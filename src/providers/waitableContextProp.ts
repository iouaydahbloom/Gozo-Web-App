export interface WaitableContextProp {
    isReady: boolean,
    refresh: () => Promise<void>
}