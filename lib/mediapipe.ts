// Shared types for MediaPipe Hands/Camera, loaded from CDN at runtime by
// GestureFXSection and AirMouse — there's no official @types package for
// these, so both components rely on this one declaration.

export interface MediaPipeHandLandmark {
  x: number
  y: number
  z: number
}

export interface MediaPipeHandsResults {
  multiHandLandmarks?: MediaPipeHandLandmark[][]
}

export interface MediaPipeHandsInstance {
  setOptions(options: Record<string, unknown>): void
  onResults(callback: (results: MediaPipeHandsResults) => void): void
  initialize(): Promise<void>
  send(input: { image: HTMLVideoElement }): Promise<void>
  close(): void
}

export interface MediaPipeHandsConstructor {
  new (config: { locateFile: (file: string) => string }): MediaPipeHandsInstance
}

export interface MediaPipeCameraInstance {
  start(): void
  stop(): void
}

export interface MediaPipeCameraConstructor {
  new (
    videoElement: HTMLVideoElement | null,
    config: { onFrame: () => Promise<void>; width: number; height: number },
  ): MediaPipeCameraInstance
}

declare global {
  interface Window {
    Hands: MediaPipeHandsConstructor
    Camera: MediaPipeCameraConstructor
    __gfxSwitch?: (word: string, idx: number) => void
  }
}
