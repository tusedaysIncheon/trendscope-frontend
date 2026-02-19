import { Loader2 } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

type ModelGlbViewerProps = {
  src?: string;
  className?: string;
  autoRotate?: boolean;
  interactive?: boolean;
  emptyMessage?: string;
  errorMessage?: string;
  cameraOrbit?: string;
};

const DEPTH_MIN_NEAR = 0.01;
const DEPTH_MIN_GAP = 4;
const DEPTH_NEAR_PADDING = 1.35;
const DEPTH_FAR_PADDING = 2.2;

function parseCameraOrbit(value: string) {
  const [thetaRaw, phiRaw, radiusRaw] = value.trim().split(/\s+/);
  const theta = Number.parseFloat(thetaRaw?.replace("deg", "")) || 0;
  const phiParsed = Number.parseFloat(phiRaw?.replace("deg", "")) || 78;
  const radius = Number.parseFloat(radiusRaw?.replace("m", "")) || 4.1;
  return {
    theta,
    phi: Math.min(85, Math.max(25, phiParsed)),
    radius: Math.max(1.2, radius),
  };
}

function computeCameraDepthRange(distance: number, radius: number) {
  const near = Math.max(DEPTH_MIN_NEAR, distance - radius * DEPTH_NEAR_PADDING);
  const far = Math.max(near + DEPTH_MIN_GAP, distance + radius * DEPTH_FAR_PADDING);
  return { near, far };
}

function disposeObjectResources(object: any) {
  if (!object) return;

  object.traverse((child: any) => {
    const mesh = child as any;
    if (mesh.geometry) {
      mesh.geometry.dispose();
    }

    const material = mesh.material;
    if (!material) return;

    const disposeMaterial = (mat: any) => {
      const materialWithMaps = mat as {
        map?: any;
        normalMap?: any;
        roughnessMap?: any;
        metalnessMap?: any;
        aoMap?: any;
        emissiveMap?: any;
      };

      materialWithMaps.map?.dispose();
      materialWithMaps.normalMap?.dispose();
      materialWithMaps.roughnessMap?.dispose();
      materialWithMaps.metalnessMap?.dispose();
      materialWithMaps.aoMap?.dispose();
      materialWithMaps.emissiveMap?.dispose();
      mat.dispose();
    };

    if (Array.isArray(material)) {
      material.forEach(disposeMaterial);
    } else {
      disposeMaterial(material);
    }
  });
}

export function ModelGlbViewer({
  src,
  className,
  autoRotate = true,
  interactive = true,
  emptyMessage = "No 3D model available.",
  errorMessage = "Failed to load 3D model.",
  cameraOrbit = "0deg 78deg 4.1m",
}: ModelGlbViewerProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const renderMountRef = useRef<HTMLDivElement | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    if (!src) {
      setIsLoading(false);
      setHasError(false);
      return;
    }
    setIsLoading(true);
    setHasError(false);
  }, [src]);

  useEffect(() => {
    const container = containerRef.current;
    const renderMount = renderMountRef.current;
    if (!src || !container || !renderMount) {
      return;
    }

    let disposed = false;
    let frameId = 0;
    let resizeObserver: ResizeObserver | null = null;
    let loadTimeoutId: number | null = null;
    let scene: any = null;
    let renderer: any = null;
    let camera: any = null;
    let controls: OrbitControls | null = null;
    let dracoLoader: DRACOLoader | null = null;
    let gltfLoader: GLTFLoader | null = null;
    let modelRoot: any = null;
    let passiveRotation = 0;

    const resize = () => {
      if (disposed || !renderer || !camera) return;
      const { width, height } = renderMount.getBoundingClientRect();
      const safeWidth = Math.max(1, width);
      const safeHeight = Math.max(1, height);
      renderer.setSize(safeWidth, safeHeight);
      camera.aspect = safeWidth / safeHeight;
      camera.updateProjectionMatrix();
    };
    try {
      scene = new THREE.Scene();
      scene.background = new THREE.Color("#1b2434");

      renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: false,
        powerPreference: "high-performance",
        logarithmicDepthBuffer: true,
      });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.2;
      renderer.shadowMap.enabled = true;
      renderer.shadowMap.type = THREE.PCFShadowMap;

      camera = new THREE.PerspectiveCamera(34, 1, 0.01, 200);
      controls = new OrbitControls(camera, renderer.domElement);
      controls.enableDamping = true;
      controls.dampingFactor = 0.08;
      controls.enablePan = false;
      controls.enableRotate = interactive;
      controls.enableZoom = interactive;
      controls.autoRotate = interactive && autoRotate;
      controls.autoRotateSpeed = 1.25;

      const hemiLight = new THREE.HemisphereLight(0xdbeafe, 0x0f172a, 1.05);
      const keyLight = new THREE.DirectionalLight(0xffffff, 1.25);
      keyLight.position.set(2.4, 3.4, 2.6);
      keyLight.castShadow = true;
      const fillLight = new THREE.DirectionalLight(0x9cc3ff, 0.45);
      fillLight.position.set(-2.2, 2.2, 1.4);
      const rimLight = new THREE.DirectionalLight(0xffffff, 0.6);
      rimLight.position.set(-1.8, 2.8, -2.8);
      scene.add(hemiLight, keyLight, fillLight, rimLight);

      dracoLoader = new DRACOLoader();
      dracoLoader.setDecoderPath("https://www.gstatic.com/draco/v1/decoders/");

      gltfLoader = new GLTFLoader();
      gltfLoader.setDRACOLoader(dracoLoader);

      while (renderMount.firstChild) {
        renderMount.removeChild(renderMount.firstChild);
      }
      renderMount.appendChild(renderer.domElement);
      resize();

      loadTimeoutId = window.setTimeout(() => {
        if (disposed) return;
        setIsLoading(false);
        setHasError(true);
      }, 20000);

      gltfLoader.load(
        src,
        (gltf: any) => {
          if (disposed || !scene || !camera || !controls) return;
          if (loadTimeoutId !== null) {
            window.clearTimeout(loadTimeoutId);
          }

          modelRoot = gltf.scene;
          modelRoot.traverse((child: any) => {
            const mesh = child as any;
            if (!mesh.isMesh) return;
            mesh.castShadow = true;
            mesh.receiveShadow = true;
          });

          const box = new THREE.Box3().setFromObject(modelRoot);
          const center = box.getCenter(new THREE.Vector3());
          modelRoot.position.sub(center);
          scene.add(modelRoot);

          const size = box.getSize(new THREE.Vector3());
          const sphere = box.getBoundingSphere(new THREE.Sphere());
          const maxDim = Math.max(size.x, size.y, size.z, 0.01);
          const fov = (camera.fov * Math.PI) / 180;
          const fitDistance = (maxDim / (2 * Math.tan(fov / 2))) * 1.35;
          const orbit = parseCameraOrbit(cameraOrbit);
          const distance = Math.max(fitDistance, orbit.radius);
          const phi = THREE.MathUtils.degToRad(orbit.phi);
          const theta = THREE.MathUtils.degToRad(orbit.theta);

          camera.position.set(
            distance * Math.sin(phi) * Math.sin(theta),
            distance * Math.cos(phi),
            distance * Math.sin(phi) * Math.cos(theta)
          );
          const depthRange = computeCameraDepthRange(distance, Math.max(sphere.radius, 0.1));
          camera.near = depthRange.near;
          camera.far = depthRange.far;
          camera.updateProjectionMatrix();

          controls.target.set(0, 0, 0);
          controls.minDistance = Math.max(0.8, distance * 0.4);
          controls.maxDistance = distance * 2.6;
          controls.update();

          setHasError(false);
          setIsLoading(false);
        },
        undefined,
        () => {
          if (disposed) return;
          if (loadTimeoutId !== null) {
            window.clearTimeout(loadTimeoutId);
          }
          setIsLoading(false);
          setHasError(true);
        }
      );

      if (typeof ResizeObserver !== "undefined") {
        resizeObserver = new ResizeObserver(resize);
        resizeObserver.observe(container);
      } else {
        window.addEventListener("resize", resize);
      }

      const animate = () => {
        if (disposed || !renderer || !scene || !camera || !controls) return;

        frameId = window.requestAnimationFrame(animate);
        if (!interactive && autoRotate && modelRoot) {
          passiveRotation += 0.0038;
          modelRoot.rotation.y = passiveRotation;
        }
        controls.update();
        renderer.render(scene, camera);
      };
      animate();
    } catch (error) {
      console.error("ModelGlbViewer initialization failed:", error);
      setIsLoading(false);
      setHasError(true);
    }

    return () => {
      disposed = true;
      if (frameId) window.cancelAnimationFrame(frameId);
      if (loadTimeoutId !== null) {
        window.clearTimeout(loadTimeoutId);
      }
      resizeObserver?.disconnect();
      window.removeEventListener("resize", resize);
      controls?.dispose();
      dracoLoader?.dispose();
      disposeObjectResources(modelRoot);
      scene?.clear();
      renderer?.dispose();
      if (renderer?.domElement?.parentElement === renderMount) {
        renderMount.removeChild(renderer.domElement);
      } else {
        while (renderMount.firstChild) {
          renderMount.removeChild(renderMount.firstChild);
        }
      }
    };
  }, [src, autoRotate, interactive, cameraOrbit]);

  const containerClassName = useMemo(
    () => `relative overflow-hidden rounded-xl bg-[#1b2434] ${className ?? ""}`,
    [className]
  );

  return (
    <div className={containerClassName} ref={containerRef}>
      <div className="h-full w-full" ref={renderMountRef} />

      {!src && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-900/80 px-4 text-center text-sm font-medium text-slate-300">
          {emptyMessage}
        </div>
      )}

      {isLoading && src && !hasError && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-slate-900/55">
          <Loader2 className="h-5 w-5 animate-spin text-primary" />
        </div>
      )}

      {hasError && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-900/75 px-4 text-center text-sm font-medium text-slate-200">
          {errorMessage}
        </div>
      )}
    </div>
  );
}
