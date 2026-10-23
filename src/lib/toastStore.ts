import { create } from "zustand";

export interface Toast{
    id:number,
    kind:'success' | 'error',
    message:string,
    action?: {
        label: string,
        onClick:()=>void
    }
}

interface ToastStore {
    toasts: Toast[],
    show:(toast:Omit<Toast,'id'>,durationMs?:number) => void
    dismiss: (id: number) => void
}

let nextId = 1;

export const useToastStore = create<ToastStore>((set,get) => ({
    toasts: [],
    show: (toast, durationMs = 5000) => {
        const id = nextId++;
        set(state => ({
            toasts: [...state.toasts, { ...toast, id }]
        }));
        setTimeout(() => get().dismiss(id), durationMs);
    },
    dismiss: (id) => {
        set(state => ({
            toasts: state.toasts.filter(t => t.id !== id)
        }));
    }
}))

export const toast = {
    success:(message:string) => useToastStore.getState().show({ kind: 'success', message }),
    error:(message:string) => useToastStore.getState().show({ kind: 'error', message },7000),
    undoable:(message:string, onUndo:()=>void) => useToastStore.getState().show({ kind: 'success', message, action: { label: 'Undo', onClick: onUndo } }, 8000)
}