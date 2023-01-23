interface Props<TArgs> {
    fn: (args: TArgs) => Promise<any>,
    mutatedIdentity: readonly any[] | (any[])[]
}

const useDataMutation = <TArgs>({fn, mutatedIdentity}: Props<TArgs>) => {
    return {
        mutateAsync: fn
    }
}

export default useDataMutation;