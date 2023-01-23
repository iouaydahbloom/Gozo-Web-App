import { useMemo } from "react";
import { useLocation } from "react-router";

/**
 * Custom hook that provides a handler for the search params
 *
 * @returns object holding the search params
 */
function useSearchParams() {
    const { search } = useLocation();
    return useMemo(() => new URLSearchParams(search), [search]);
}

export default useSearchParams;