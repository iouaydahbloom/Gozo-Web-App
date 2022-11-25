export interface CommonContextProp {
    isReady: boolean,
    refresh: () => Promise<void>
}