declare module "three";

declare module "three/examples/jsm/controls/OrbitControls.js" {
  export class OrbitControls {
    constructor(camera: any, domElement: HTMLElement);
    enableDamping: boolean;
    dampingFactor: number;
    enablePan: boolean;
    enableRotate: boolean;
    enableZoom: boolean;
    autoRotate: boolean;
    autoRotateSpeed: number;
    target: { set: (x: number, y: number, z: number) => void };
    minDistance: number;
    maxDistance: number;
    update: () => void;
    dispose: () => void;
  }
}

declare module "three/examples/jsm/loaders/DRACOLoader.js" {
  export class DRACOLoader {
    setDecoderPath(path: string): void;
    dispose(): void;
  }
}

declare module "three/examples/jsm/loaders/GLTFLoader.js" {
  export class GLTFLoader {
    setDRACOLoader(loader: any): void;
    load(
      url: string,
      onLoad: (gltf: any) => void,
      onProgress?: (event: any) => void,
      onError?: (event: any) => void
    ): void;
  }
}
