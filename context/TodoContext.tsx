import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { Todo } from '../types/todo';
import { useNotifications } from '../hooks/useNotifications';
import { SyncService } from '../services/SyncService';

interface TodoContextType {
    todos: Todo[];
    isLoading: boolean;
    addTodo: (task: string, type: 'normal' | 'streak', userName?: string, streakTarget?: number, icon?: 'youtube' | 'instagram' | 'default', dueDate?: number, reminderOffset?: number) => Promise<void>;
    toggleTodo: (id: string) => void;
    deleteTodo: (id: string) => void;
    pinTodo: (id: string) => void;
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

    // Helper: ISO Date for daily tracking
    const getTodayISO = () => new Date().toISOString().split('T')[0];

    // The heart of the cloud sync: Pulls data from Firebase and merges it with local data
    const syncWithCloud = useCallback(async () => {
        const email = await AsyncStorage.getItem('sync_email');
        if (!email) return;

        try {
            const cloudTodos = await SyncService.restoreFromCloud() as Todo[];
            if (cloudTodos && cloudTodos.length > 0) {
                setTodos(prev => {
                    const merged = [...prev];
                    cloudTodos.forEach(cloudTodo => {
                        if (!merged.find(t => t.id === cloudTodo.id)) {
                            merged.push(cloudTodo);
                        }
                    });
                    
                    // Sort priorities: Pinned first, then by creation
                    return merged.sort((a, b) => {
                        if (a.isPinned && !b.isPinned) return -1;
                        if (!a.isPinned && b.isPinned) return 1;
                        return (b.createdAt || 0) - (a.createdAt || 0);
                    });
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
                    let loadedTodos: Todo[] = JSON.parse(jsonValue);
                    const today = getTodayISO();

                    // BROKEN STREAK LOGIC: Detect missed days during load 🤖
                    loadedTodos = loadedTodos.map(todo => {
                        if (todo.type === 'streak' && !todo.completed && !todo.isBroken) {
                            const lastDate = todo.lastCompletedDate;
                            if (lastDate) {
                                const diffTime = Math.abs(new Date(today).getTime() - new Date(lastDate).getTime());
                                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                                
                                // Reset logic: If more than 1 day has passed without a tick
                                if (diffDays > 1) {
                                    return { ...todo, isBroken: true, completed: true, completedAt: Date.now() };
                                }
                            }
                        }
                        return todo;
                    });

                    setTodos(loadedTodos);
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

    const addTodo = useCallback(async (
        task: string, 
        type: 'normal' | 'streak', 
        userName: string = 'Champion',
        streakTarget?: number, 
        icon: 'youtube' | 'instagram' | 'default' = 'default',
        dueDate?: number, 
        reminderOffset?: number
    ) => {
        const todoId = Date.now().toString();
        const newTodo: Todo = {
            id: todoId,
            task,
            type,
            userName,
            streakTarget,
            icon,
            currentStreak: type === 'streak' ? 0 : undefined,
            completed: false,
            isPinned: false,
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
            // Sort to respect existing pins
            const sorted = updated.sort((a, b) => {
                if (a.isPinned && !b.isPinned) return -1;
                if (!a.isPinned && b.isPinned) return 1;
                return (b.createdAt || 0) - (a.createdAt || 0);
            });
            SyncService.pushToCalendar(task, dueDate, reminderOffset);
            SyncService.backupToCloud(sorted);
            return sorted;
        });
    }, [scheduleTodoReminder]);

    const toggleTodo = useCallback((id: string) => {
        setTodos(prev => {
            const today = getTodayISO();
            const updated = prev.map(todo => {
                if (todo.id === id) {
                    // STREAK LOGIC: No Undo if Completed or Broken 🔒
                    if (todo.type === 'streak') {
                        if (todo.completed || todo.isBroken) return todo;
                        if (todo.lastCompletedDate === today) return todo; // Locked today
                        
                        const newStreak = (todo.currentStreak || 0) + 1;
                        const isFinished = newStreak === todo.streakTarget;

                        return {
                            ...todo,
                            currentStreak: newStreak,
                            lastCompletedDate: today,
                            completed: isFinished,
                            completedAt: isFinished ? Date.now() : undefined,
                        };
                    }

                    // NORMAL TASK LOGIC: Can toggle freely
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

    const pinTodo = useCallback((id: string) => {
        setTodos(prev => {
            const updated = prev.map(t => t.id === id ? { ...t, isPinned: !t.isPinned } : t);
            // Sort by pinned first
            const sorted = updated.sort((a, b) => {
                if (a.isPinned && !b.isPinned) return -1;
                if (!a.isPinned && b.isPinned) return 1;
                return (b.createdAt || 0) - (a.createdAt || 0);
            });
            SyncService.backupToCloud(sorted);
            return sorted;
        });
    }, []);

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
            pinTodo,
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
