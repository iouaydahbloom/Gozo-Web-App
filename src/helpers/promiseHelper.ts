function dummySleeperPromise(value: any, action: 'resolve' | 'reject'): Promise<any> {
    return new Promise((resolve, reject) => {
        setTimeout(() => action === 'resolve' ? resolve(value) : reject(value), 1000)
    })
}

export {
    dummySleeperPromise
}