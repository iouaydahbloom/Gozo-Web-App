module collectionManipulationHelper {
    export function removeAtIndex<T>(array: T[], index: number) {
        if (index !== -1) array.splice(index, 1);
        return array;
    }
}

export default collectionManipulationHelper;