declare global {
  interface Window {
    JitsiMeetExternalAPI: {
      new (domain: string, options: JitsiOptions): JitsiAPI
    }
  }
}

export interface JitsiOptions {
  roomName: string
  width: string | number
  heigh?: string | number
  parentNode?: HTMLElement
  configOverwrite?: Record<string, unknown>
  interfaceConfigOverwrite?: Record<string, unknown>
  [key: string]: unknown
}

export interface JitsiAPI {
  executeCommand: (command: string, ...args: unknown[]) => void
  on: (event: string, handler: () => void) => void
  off: (event: string, handler: () => void) => void
  dispose: () => void
  addListener: (event: string, handler: (data: { muted: boolean, on: boolean }) => void) => void
  removeListener: (event: string, handler: () => void) => void
  [key: string]: unknown
}
