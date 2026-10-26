import { Link, useLocation, useSearchParams } from "react-router-dom"
import { useAuthStore } from "../../auth/authStore";
import { RELATION_OPTIONS, STATUS_OPTIONS } from "../filterOptions";
import type { TaskStatus } from "@/types/api";
import { useTasks } from "../hooks/useTasks";
import { Pagination } from "@/components/Pagination";
import { TaskCard } from "../components/TaskCard";
import { getErrorMessage } from "@/lib/apiError";
import type { TaskRelation } from "../types";
import { FilterTabs } from "@/components/FilterTabs";
import { TaskActions } from "../components/TasksActions";
import { BulkDeleteButton } from "../components/BulkDeleteButton";

const PAGE_SIZE = 5

export function TasksPage(){
    const [searchParams,setSearchParams] = useSearchParams();
    // const currentUserId = useAuthStore(state => state.user!.id)
    const status = STATUS_OPTIONS.find((opt)=>opt.value === searchParams.get("status"))?.value
    const relation = RELATION_OPTIONS.find((opt)=>opt.value === searchParams.get("relation"))?.value
    const pageNumber = Math.max(1,Number(searchParams.get("page")) || 1)
    const me = useAuthStore((s) => s.user!)
    const notice = (useLocation().state as { notice?: string } | null)?.notice

    const {data,isPending,isError,error,refetch,isFetching,isPlaceholderData} = useTasks({
        status,
        relation,
        pageNumber,
        pageSize: PAGE_SIZE
    })
    
    function updateParams(changes:Record<string,string | undefined>){
      setSearchParams((prev)=>{
        const params = new URLSearchParams(prev)
        for(const [key,val] of Object.entries(changes)){
          if(val === undefined){
            params.delete(key)
          }else{
            params.set(key,val)
          }

        }
        return params
      })
    }
    
    const changeStatus = (s:TaskStatus | undefined) => updateParams({status:s, page:undefined})
    const changeRelation = (r:TaskRelation | undefined) => updateParams({relation:r, page:undefined})
    const changePage = (p: number) => updateParams({page: String(p)})

    const totalPages = data ? Math.max(1,Math.ceil(data.totalCount / PAGE_SIZE)) : 1

    const canBulkDelete = !!status && !!data?.items.some((t) => t.status === status && t.createdByUserId==me.id)
   return (
    <div className="space-y-6">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-100">Tasks</h1>
          {data && (
            <p className="text-sm text-slate-400">
              {data.totalCount} {data.totalCount === 1 ? 'task' : 'tasks'}
            </p>
          )}
        </div>
        {isFetching && !isPending && <span className="text-xs text-slate-500">Updating…</span>}
        <Link to="/tasks/new" className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-500">
          New task
        </Link>
      </div>
      {/* ----------------------- */}
      {notice && (
        <div role="status" className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-4 text-sm text-amber-200">
          {notice}
        </div>
      )}
     <div className="space-y-3">
      <FilterTabs label="Filter by relation" options={RELATION_OPTIONS} value={relation} onChange={changeRelation} />
      <FilterTabs label="Filter by status" options={STATUS_OPTIONS} value={status} onChange={changeStatus} />
      {(status || relation) && (
      <button
        type="button"
        onClick={() => updateParams({ status: undefined, relation: undefined, page: undefined })}
        className="text-sm text-indigo-400 hover:text-indigo-500"
      >
        Clear filters
      </button>
      )}
      <div>
         {canBulkDelete && status &&<BulkDeleteButton status={status} />}
      </div>
    </div>
    

      {isPending ? (
        <TaskListSkeleton />
      ) : isError ? (
        <div role="alert" className="rounded-xl border border-red-500/30 bg-red-500/10 p-5">
          <p className="text-red-300">{getErrorMessage(error)}</p>
          <button
            onClick={() => refetch()}
            className="mt-3 rounded-lg border border-red-400/40 px-3 py-1.5 text-sm text-red-200 hover:bg-red-500/10"
          >
            Try again
          </button>
        </div>
      ) : data.items.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-700 p-10 text-center">
          <p className="text-slate-300">No tasks here yet.</p>
          <p className="mt-1 text-sm text-slate-500">
            {status || relation
              ? 'No tasks match these filters.'
              : 'Tasks you create or are assigned will appear here.'}
          </p>
        </div>
      ) : (
        <>
          <div className={`space-y-3 transition-opacity ${isPlaceholderData ? 'opacity-60' : ''}`}>
            {data.items.map((task) => (
          <TaskCard 
            key={task.id} 
            task={task} 
            currentUserId={me.id} 
            actions={<TaskActions task={task} me={me} />} />            
        ))}
          </div>
          <Pagination
            page={pageNumber}
            totalPages={totalPages}
            onChange={changePage}
            disabled={isPlaceholderData}
          />
        </>
      )}
    </div>
  )
}

function TaskListSkeleton() {
  return (
    <div className="space-y-3" aria-busy="true" aria-label="Loading tasks">
      {Array.from({ length: 3 }, (_, i) => (
        <div key={i} className="h-32 animate-pulse rounded-xl bg-slate-900" />
      ))}
    </div>
  )
}