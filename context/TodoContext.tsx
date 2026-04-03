import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { Todo } from '../types/todo';
import { useNotifications } from '../hooks/useNotifications';
import { SyncService } from '../services/SyncService';

interface TodoContextType {
    todos: Todo[];
    isLoading: boolean;
    addTodo: (task: string, dueDate?: number, reminderOffset?: number) => Promise<void>;
    toggleTodo: (id: string) => void;
    deleteTodo: (id: string) => void;
    clearCompleted: () => void;
    syncWithCloud: () => Promise<void>;
    count: number;
    completedCount: number;
}

const STORAGE_KEY = '@todo_app_data';
const TodoContext = createContext<TodoContextType | undefined>(undefined);

export function TodoProvider({ children }: { children: React.ReactNode }) {
    const [todos, setTodos] = useState<Todo[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const { scheduleTodoReminder, cancelReminder } = useNotifications();

    // The heart of the cloud sync: Pulls data from Firebase and merges it with local data
    const syncWithCloud = useCallback(async () => {
        const email = await AsyncStorage.getItem('sync_email');
        if (!email) return;

        try {
            const cloudTodos = await SyncService.restoreFromCloud() as Todo[];
            if (cloudTodos && cloudTodos.length > 0) {
                setTodos(prev => {
                    // Merge logic: Prioritize newer updates or unique IDs
                    const merged = [...prev];
                    cloudTodos.forEach(cloudTodo => {
                        if (!merged.find(t => t.id === cloudTodo.id)) {
                            merged.push(cloudTodo);
                        }
                    });
                    // Sort missions so newest are at the top
                    return merged.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
                });
            }
        } catch (error) {
            console.error('[Sync Context Error]', error);
        }
    }, []);

    // Listen for login/sync changes to trigger cloud recovery
    useEffect(() => {
        const checkSyncStatus = async () => {
            const email = await AsyncStorage.getItem('sync_email');
            const mode = await AsyncStorage.getItem('sync_mode');
            
            if (email && mode !== 'Off') {
                syncWithCloud();
            }
        };
        checkSyncStatus();
    }, [syncWithCloud]);

    useEffect(() => {
        const loadTodos = async () => {
            try {
                const jsonValue = await AsyncStorage.getItem(STORAGE_KEY);
                if (jsonValue != null) {
                    setTodos(JSON.parse(jsonValue));
                }
            } catch (e) {
                console.error('Failed to load todos', e);
            } finally {
                setIsLoading(false);
            }
        };
        loadTodos();
    }, []);

    useEffect(() => {
        const saveTodos = async () => {
            if (isLoading) return;
            try {
                const jsonValue = JSON.stringify(todos);
                await AsyncStorage.setItem(STORAGE_KEY, jsonValue);
            } catch (e) {
                console.error('Failed to save todos', e);
            }
        };
        saveTodos();
    }, [todos, isLoading]);

    const addTodo = useCallback(async (task: string, dueDate?: number, reminderOffset?: number) => {
        const todoId = Date.now().toString();
        const newTodo: Todo = {
            id: todoId,
            task,
            completed: false,
            createdAt: Date.now(),
            dueDate,
            reminderOffset,
        };

        if (dueDate) {
            const reminderId = await scheduleTodoReminder(todoId, task, dueDate, reminderOffset);
            if (reminderId) newTodo.reminderId = reminderId;
        }

        setTodos(prev => {
            const updated = [newTodo, ...prev];
            // Immediately backup to cloud
            SyncService.pushToCalendar(task, dueDate, reminderOffset);
            SyncService.backupToCloud(updated);
            return updated;
        });
    }, [scheduleTodoReminder]);

    const toggleTodo = useCallback((id: string) => {
        setTodos(prev => {
            const updated = prev.map(todo => {
                if (todo.id === id) {
                    const now = Date.now();
                    if (!todo.completed) {
                        if (todo.reminderId) cancelReminder(todo.reminderId);
                        return { ...todo, completed: true, completedAt: now, reminderId: undefined };
                    } else {
                        return { ...todo, completed: false, completedAt: undefined };
                    }
                }
                return todo;
            });
            SyncService.backupToCloud(updated);
            return updated;
        });
    }, [cancelReminder]);

    const deleteTodo = useCallback((id: string) => {
        setTodos(prev => {
            const todoToDelete = prev.find(t => t.id === id);
            if (todoToDelete?.reminderId) {
                cancelReminder(todoToDelete.reminderId);
            }
            const updated = prev.filter(todo => todo.id !== id);
            
            // Mirror Delete in Cloud
            SyncService.deleteFromCloud(id);
            SyncService.backupToCloud(updated);
            return updated;
        });
    }, [cancelReminder]);

    const clearCompleted = useCallback(() => {
        setTodos(prev => {
            const completed = prev.filter(t => t.completed);
            completed.forEach(t => {
                if (t.reminderId) cancelReminder(t.reminderId);
                // Mirror Cleanup in Cloud 🧼
                SyncService.deleteFromCloud(t.id);
            });
            const updated = prev.filter(todo => !todo.completed);
            SyncService.backupToCloud(updated); // Final array sync
            return updated;
        });
    }, [cancelReminder]);

    return (
        <TodoContext.Provider value={{
            todos,
            isLoading,
            addTodo,
            toggleTodo,
            deleteTodo,
            clearCompleted,
            syncWithCloud,
            count: todos.length,
            completedCount: todos.filter(t => t.completed).length,
        }}>
            {children}
        </TodoContext.Provider>
    );
}

export function useTodoContext() {
    const context = useContext(TodoContext);
    if (context === undefined) {
        throw new Error('useTodoContext must be used within a TodoProvider');
    }
    return context;
}
