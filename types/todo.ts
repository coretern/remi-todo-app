export interface Todo {
    id: string;
    task: string;
    completed: boolean;
    createdAt: number;
    completedAt?: number; // Exact time when mission was finished
    dueDate?: number;
    reminderId?: string;
    reminderOffset?: number; // Minutes before due date
}

export type TodoAction =
    | { type: 'ADD_TODO'; payload: { task: string; dueDate?: number } }
    | { type: 'TOGGLE_TODO'; payload: string }
    | { type: 'DELETE_TODO'; payload: string }
    | { type: 'CLEAR_COMPLETED' };
