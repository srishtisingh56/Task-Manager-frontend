import { api } from "@/lib/api";
import { useQuery } from "node_modules/@tanstack/react-query/build/modern/useQuery";

export interface Worker { id: string; name: string }

async function fetchMyWorkers():Promise<Worker[]> {
    const {data} = await api.get<Worker[]>('/workers');
    return data;
}

export function useWorkers() {
    return useQuery({
        queryKey: ['users','my-workers'],
        queryFn: fetchMyWorkers,
        staleTime: 5*60*1000,
    })
}