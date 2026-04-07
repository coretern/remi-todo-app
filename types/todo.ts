export interface Todo {
    id: string;
    task: string;
    completed: boolean;
    createdAt: number;
    completedAt?: number;
    dueDate?: number;
    reminderId?: string;
    userName?: string;
    reminderOffset?: number;
    
    // Streak System (New)
    type: 'normal' | 'streak';
    streakTarget?: number;     // e.g. 10, 20, Custom
    currentStreak?: number;    // Count: Day 1, Day 2...
    lastCompletedDate?: string; // Track: "2026-04-01" to block checkboxes
    isBroken?: boolean;        // Moved to History: Streak Failed
    isPinned?: boolean;        // Master feature: Top of Home
    icon?: 'youtube' | 'instagram' | 'study' | 'default';
}

export type TodoAction =
    | { type: 'ADD_TODO'; payload: { task: string; type: 'normal' | 'streak'; streakTarget?: number; icon?: 'youtube' | 'instagram' | 'study' | 'default' } }
    | { type: 'TOGGLE_TODO'; payload: string }
    | { type: 'DELETE_TODO'; payload: string }
    | { type: 'PIN_TODO'; payload: string }
    | { type: 'CLEAR_COMPLETED' };
