// aurevant-production/types/three.d.ts
// Ambient type definitions for Three.js and GLTF loaders

declare module 'three' {
  export interface Material {
    name?: string;
    opacity?: number;
    transparent?: boolean;
    visible?: boolean;
    roughness?: number;
    metalness?: number;
    color?: Color | any;
    map?: Texture | null;
    normalMap?: Texture | null;
    roughnessMap?: Texture | null;
    metalnessMap?: Texture | null;
    needsUpdate?: boolean;
    dispose?(): void;
    [key: string]: any;
  }

  export interface MeshStandardMaterial extends Material {
    roughness: number;
    metalness: number;
    needsUpdate: boolean;
  }

  export interface MeshPhysicalMaterial extends MeshStandardMaterial {
    transmission?: number;
    thickness?: number;
    ior?: number;
  }

  export class Color {
    r: number;
    g: number;
    b: number;
    constructor(color?: any);
    set(color: any): this;
    setHex(hex: number): this;
    setRGB(r: number, g: number, b: number): this;
  }

  export class Vector2 {
    x: number;
    y: number;
    constructor(x?: number, y?: number);
    set(x: number, y: number): this;
  }

  export class Vector3 {
    x: number;
    y: number;
    z: number;
    constructor(x?: number, y?: number, z?: number);
    set(x: number, y: number, z: number): this;
    setScalar(scalar: number): this;
    copy(v: Vector3): this;
    clone(): Vector3;
    add(v: Vector3): this;
    sub(v: Vector3): this;
    multiplyScalar(s: number): this;
  }

  export class Vector4 {
    x: number;
    y: number;
    z: number;
    w: number;
    constructor(x?: number, y?: number, z?: number, w?: number);
  }

  export class Euler {
    x: number;
    y: number;
    z: number;
    order?: string;
    constructor(x?: number, y?: number, z?: number, order?: string);
    set(x: number, y: number, z: number, order?: string): this;
  }

  export class Quaternion {
    x: number;
    y: number;
    z: number;
    w: number;
    constructor(x?: number, y?: number, z?: number, w?: number);
  }

  export class Matrix4 {
    constructor();
    identity(): this;
  }

  export class Box3 {
    min: Vector3;
    max: Vector3;
    constructor(min?: Vector3, max?: Vector3);
    setFromObject(object: any): this;
    getCenter(target: Vector3): Vector3;
    getSize(target: Vector3): Vector3;
  }

  export class Texture {
    needsUpdate: boolean;
    dispose(): void;
    [key: string]: any;
  }

  export class TextureLoader {
    load(
      url: string,
      onLoad?: (texture: Texture) => void,
      onProgress?: (event: ProgressEvent) => void,
      onError?: (event: ErrorEvent | any) => void
    ): Texture;
  }

  export class Clock {
    autoStart: boolean;
    running: boolean;
    constructor(autoStart?: boolean);
    start(): void;
    stop(): void;
    getElapsedTime(): number;
    getDelta(): number;
  }

  export class Raycaster {
    constructor(origin?: Vector3, direction?: Vector3, near?: number, far?: number);
    setFromCamera(coords: Vector2, camera: Camera): void;
    intersectObjects(objects: any[], recursive?: boolean): any[];
    intersectObject(object: any, recursive?: boolean): any[];
  }

  export class Object3D {
    id: number;
    uuid: string;
    name: string;
    type: string;
    parent: Object3D | null;
    children: Object3D[];
    position: Vector3;
    rotation: Euler;
    quaternion: Quaternion;
    scale: Vector3;
    visible: boolean;
    castShadow: boolean;
    receiveShadow: boolean;
    isMesh?: boolean;
    material?: Material | Material[];

    traverse(callback: (child: any) => any): void;
    add(...object: any[]): this;
    remove(...object: any[]): this;
    clear(): this;
    lookAt(x: number | Vector3, y?: number, z?: number): void;
    clone(recursive?: boolean): this;
    [key: string]: any;
  }

  export class Group extends Object3D {
    isGroup: boolean;
  }

  export class Mesh extends Object3D {
    isMesh: boolean;
    geometry: any;
    material: Material;
    constructor(geometry?: any, material?: Material | Material[]);
  }

  export class Scene extends Object3D {
    isScene: boolean;
    background: any;
    environment: any;
    fog: any;
  }

  export class Camera extends Object3D {
    isCamera: boolean;
    matrixWorldInverse: Matrix4;
    projectionMatrix: Matrix4;
  }

  export class PerspectiveCamera extends Camera {
    isPerspectiveCamera: boolean;
    fov: number;
    zoom: number;
    near: number;
    far: number;
    aspect: number;
    constructor(fov?: number, aspect?: number, near?: number, far?: number);
    updateProjectionMatrix(): void;
  }

  export class OrthographicCamera extends Camera {
    isOrthographicCamera: boolean;
    zoom: number;
    left: number;
    right: number;
    top: number;
    bottom: number;
    near: number;
    far: number;
    constructor(left: number, right: number, top: number, bottom: number, near?: number, far?: number);
    updateProjectionMatrix(): void;
  }

  export class Light extends Object3D {
    isLight: boolean;
    color: Color;
    intensity: number;
    constructor(color?: any, intensity?: number);
  }

  export class DirectionalLight extends Light {
    isDirectionalLight: boolean;
    target: Object3D;
  }

  export class AmbientLight extends Light {
    isAmbientLight: boolean;
  }

  export class PointLight extends Light {
    isPointLight: boolean;
    distance: number;
    decay: number;
  }

  export class HemisphereLight extends Light {
    isHemisphereLight: boolean;
    groundColor: Color;
  }

  export class WebGLRenderer {
    domElement: HTMLCanvasElement;
    toneMapping: any;
    toneMappingExposure: number;
    outputColorSpace: any;
    shadowMap: { enabled: boolean; type?: any };

    constructor(parameters?: {
      canvas?: HTMLCanvasElement | OffscreenCanvas;
      alpha?: boolean;
      antialias?: boolean;
      depth?: boolean;
      stencil?: boolean;
      precision?: string;
      powerPreference?: string;
      premultipliedAlpha?: boolean;
      preserveDrawingBuffer?: boolean;
      [key: string]: any;
    });

    setSize(width: number, height: number, updateStyle?: boolean): void;
    setPixelRatio(value: number): void;
    setClearColor(color: any, alpha?: number): void;
    render(scene: any, camera: any): void;
    dispose(): void;
    [key: string]: any;
  }

  // Encoding & Tone Mapping constants
  export const ACESFilmicToneMapping: number;
  export const LinearToneMapping: number;
  export const ReinhardToneMapping: number;
  export const CineonToneMapping: number;
  export const CustomToneMapping: number;
  export const NoToneMapping: number;

  export const SRGBColorSpace: string;
  export const LinearSRGBColorSpace: string;

  // Math utilities
  export namespace MathUtils {
    export function degToRad(degrees: number): number;
    export function radToDeg(radians: number): number;
    export function clamp(value: number, min: number, max: number): number;
    export function lerp(x: number, y: number, t: number): number;
  }
}

declare module 'three/examples/jsm/loaders/GLTFLoader.js' {
  import { Group, Camera } from 'three';

  export interface GLTF {
    scene: Group;
    scenes: Group[];
    cameras: Camera[];
    animations: any[];
    asset: any;
    parser: any;
    userData: any;
    [key: string]: any;
  }

  export class GLTFLoader {
    constructor();
    load(
      url: string,
      onLoad: (gltf: GLTF) => void,
      onProgress?: (event: ProgressEvent) => void,
      onError?: (event: ErrorEvent | Error | any) => void
    ): void;
    loadAsync(url: string, onProgress?: (event: ProgressEvent) => void): Promise<GLTF>;
  }
}

declare module 'three/addons/loaders/GLTFLoader.js' {
  export * from 'three/examples/jsm/loaders/GLTFLoader.js';
}

declare module 'three/examples/jsm/loaders/DRACOLoader.js' {
  export class DRACOLoader {
    constructor();
    setDecoderPath(path: string): this;
    dispose(): void;
    [key: string]: any;
  }
}

declare module 'three/addons/loaders/DRACOLoader.js' {
  export * from 'three/examples/jsm/loaders/DRACOLoader.js';
}

declare module 'three/examples/jsm/controls/OrbitControls.js' {
  import { Camera } from 'three';

  export class OrbitControls {
    constructor(camera: Camera, domElement?: HTMLElement);
    enabled: boolean;
    autoRotate: boolean;
    autoRotateSpeed: number;
    enableDamping: boolean;
    dampingFactor: number;
    minDistance: number;
    maxDistance: number;
    minPolarAngle: number;
    maxPolarAngle: number;
    update(): void;
    dispose(): void;
    [key: string]: any;
  }
}

declare module 'three/addons/controls/OrbitControls.js' {
  export * from 'three/examples/jsm/controls/OrbitControls.js';
}
