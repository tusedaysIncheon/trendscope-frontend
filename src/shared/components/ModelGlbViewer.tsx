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
  appearance?: "studio" | "dark";
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
  appearance = "studio",
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
    let modelPivot: any = null;
    let shadowGround: any = null;
    let passiveRotation = 0;
    let isUserInteracting = false;
    let lockedCameraPosition: any = null;
    let lockedCameraQuaternion: any = null;
    let detachControlListeners: (() => void) | null = null;

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
      const isStudio = appearance === "studio";
      scene.background = new THREE.Color(isStudio ? "#f1f4f9" : "#1b2434");

      renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: false,
        powerPreference: "high-performance",
        logarithmicDepthBuffer: true,
      });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = isStudio ? 1.06 : 1.2;
      renderer.shadowMap.enabled = true;
      renderer.shadowMap.type = THREE.PCFSoftShadowMap;

      camera = new THREE.PerspectiveCamera(32, 1, 0.01, 200);
      controls = new OrbitControls(camera, renderer.domElement);
      controls.enableDamping = interactive && !autoRotate;
      controls.dampingFactor = 0.08;
      controls.enablePan = false;
      controls.enableRotate = interactive;
      controls.enableZoom = interactive;
      // Keep camera stable by default; auto-rotation is applied to the model itself.
      controls.autoRotate = false;

      const controlsAny = controls as any;
      if (interactive && typeof controlsAny.addEventListener === "function") {
        const onStart = () => {
          isUserInteracting = true;
        };
        const onEnd = () => {
          isUserInteracting = false;
          if (camera) {
            lockedCameraPosition = camera.position.clone();
            lockedCameraQuaternion = camera.quaternion.clone();
          }
        };
        controlsAny.addEventListener("start", onStart);
        controlsAny.addEventListener("end", onEnd);
        detachControlListeners = () => {
          if (typeof controlsAny.removeEventListener === "function") {
            controlsAny.removeEventListener("start", onStart);
            controlsAny.removeEventListener("end", onEnd);
          }
        };
      }

      const hemiLight = isStudio
        ? new THREE.HemisphereLight(0xffffff, 0xdbe4ef, 1.1)
        : new THREE.HemisphereLight(0xdbeafe, 0x0f172a, 1.05);
      const keyLight = new THREE.DirectionalLight(0xffffff, isStudio ? 1.35 : 1.25);
      keyLight.position.set(2.8, 3.6, 2.2);
      keyLight.castShadow = true;
      keyLight.shadow.mapSize.width = 1024;
      keyLight.shadow.mapSize.height = 1024;
      keyLight.shadow.radius = 3;
      keyLight.shadow.bias = -0.0002;
      const fillLight = new THREE.DirectionalLight(isStudio ? 0xf2f6ff : 0x9cc3ff, isStudio ? 0.75 : 0.45);
      fillLight.position.set(-2.6, 2.3, 1.9);
      const rimLight = new THREE.DirectionalLight(0xffffff, isStudio ? 0.45 : 0.6);
      rimLight.position.set(-1.5, 2.7, -3.0);
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
            const materials = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
            materials.forEach((material: any) => {
              if (!material) return;
              if ("metalness" in material) material.metalness = Math.min(material.metalness ?? 0, 0.08);
              if ("roughness" in material) material.roughness = Math.max(material.roughness ?? 0.55, 0.55);
              if ("envMapIntensity" in material) material.envMapIntensity = isStudio ? 0.8 : 1.0;
              material.needsUpdate = true;
            });
          });

          const box = new THREE.Box3().setFromObject(modelRoot);
          const center = box.getCenter(new THREE.Vector3());
          modelPivot = new THREE.Group();
          modelRoot.position.sub(center);
          modelPivot.add(modelRoot);
          scene.add(modelPivot);

          const size = box.getSize(new THREE.Vector3());
          const sphere = box.getBoundingSphere(new THREE.Sphere());
          const maxDim = Math.max(size.x, size.y, size.z, 0.01);
          const fov = (camera.fov * Math.PI) / 180;
          const fitDistance = (maxDim / (2 * Math.tan(fov / 2))) * 1.35;
          const orbit = parseCameraOrbit(cameraOrbit);
          const distance = Math.max(fitDistance, orbit.radius);
          const phi = THREE.MathUtils.degToRad(orbit.phi);
          const theta = THREE.MathUtils.degToRad(orbit.theta);
          const targetY = isStudio ? size.y * 0.06 : 0;

          camera.position.set(
            distance * Math.sin(phi) * Math.sin(theta),
            distance * Math.cos(phi),
            distance * Math.sin(phi) * Math.cos(theta)
          );
          const depthRange = computeCameraDepthRange(distance, Math.max(sphere.radius, 0.1));
          camera.near = depthRange.near;
          camera.far = depthRange.far;
          camera.updateProjectionMatrix();

          controls.target.set(0, targetY, 0);
          controls.minDistance = Math.max(0.8, distance * 0.4);
          controls.maxDistance = distance * 2.6;
          controls.update();
          lockedCameraPosition = camera.position.clone();
          lockedCameraQuaternion = camera.quaternion.clone();

          if (isStudio) {
            const groundY = box.min.y - center.y - Math.max(0.01, size.y * 0.01);
            shadowGround = new THREE.Mesh(
              new THREE.CircleGeometry(Math.max(1.1, sphere.radius * 1.8), 64),
              new THREE.ShadowMaterial({ opacity: 0.26 })
            );
            shadowGround.rotation.x = -Math.PI / 2;
            shadowGround.position.set(0, groundY, 0);
            shadowGround.receiveShadow = true;
            scene.add(shadowGround);
          }

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
        if (autoRotate && modelRoot) {
          passiveRotation += isStudio ? 0.0032 : 0.0038;
          if (modelPivot) {
            modelPivot.rotation.y = passiveRotation;
          } else {
            modelRoot.rotation.y = passiveRotation;
          }
        }
        controls.update();
        if (autoRotate && !isUserInteracting && lockedCameraPosition && lockedCameraQuaternion) {
          camera.position.copy(lockedCameraPosition);
          camera.quaternion.copy(lockedCameraQuaternion);
          camera.updateMatrixWorld();
        }
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
      detachControlListeners?.();
      controls?.dispose();
      dracoLoader?.dispose();
      if (modelPivot && scene) {
        scene.remove(modelPivot);
      }
      if (shadowGround && scene) {
        scene.remove(shadowGround);
        shadowGround.geometry.dispose();
        shadowGround.material?.dispose?.();
      }
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
  }, [src, autoRotate, interactive, cameraOrbit, appearance]);

  const containerClassName = useMemo(
    () =>
      `relative overflow-hidden rounded-xl ${
        appearance === "studio" ? "bg-[#f1f4f9]" : "bg-[#1b2434]"
      } ${className ?? ""}`,
    [appearance, className]
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
