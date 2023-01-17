import {useQueryClient} from "react-query";

/**
 * Custom hook to invalidate a created query
 *
 * @returns the invalidation tool object
 */
const useDataQueryInvalidation = () => {

    const client = useQueryClient();

    async function invalidate(invalidatedIdentity: readonly any[] | (any[])[]) {
        if (invalidatedIdentity.length === 0) return;

        if (Array.isArray(invalidatedIdentity[0])) {
            return Promise.all(invalidatedIdentity.map(m => (
                client.invalidateQueries(m)
            )))
        }

        return client.invalidateQueries(invalidatedIdentity);
    }

    return {
        invalidate
    }
}

export default useDataQueryInvalidation;