import { QueryClient } from "@tanstack/react-query";

//cache is stored in queryClient object and stored in browser memory which is wiped on refresh
//to see cache, use queryClient.getQueryCache() or queryClient.getQueryData(queryKey) or queryClient.getQueriesData(queryKey)

const queryClient = new QueryClient(
    {
        //set default options for queries only, for mutations use `mutations` key
        defaultOptions: {
            queries: {
                staleTime:30_000,
                retry: 1,
                refetchOnWindowFocus: false
            }
        }
    }
)

export default queryClient;