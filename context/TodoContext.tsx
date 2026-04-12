import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { Platform } from 'react-native';
import { Todo } from '../types/todo';
import { useNotifications } from '../hooks/useNotifications';
import { SyncService } from '../services/SyncService';
import notifee, { EventType } from '@notifee/react-native';

interface TodoContextType {
    todos: Todo[];
    isLoading: boolean;
    addTodo: (task: string, type: 'normal' | 'streak', userName?: string, streakTarget?: number, icon?: 'youtube' | 'instagram' | 'default', dueDate?: number, reminderOffset?: number) => Promise<void>;
    toggleTodo: (id: string) => void;
    deleteTodo: (id: string) => void;
    pinTodo: (id: string) => void;
    clearHistory: () => void;
    archiveCompleted: () => void;
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

    // Helper: Local ISO Date (YYYY-MM-DD) for timezone-accurate tracking 🌍
    const getTodayISO = () => {
        const d = new Date();
        return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    };

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

                    // 🤖 AUTOMATIC STREAK BREAKER: Check for missed days
                    loadedTodos = loadedTodos.map(todo => {
                        if (todo.type === 'streak' && !todo.completed && !todo.isBroken) {
                            // Use lastCompletedDate if available, otherwise use createdAt
                            const referenceDate = todo.lastCompletedDate || 
                                new Date(todo.createdAt || Date.now()).toISOString().split('T')[0];
                            
                            if (referenceDate) {
                                const refTime = new Date(referenceDate).getTime();
                                const nowTime = new Date(today).getTime();
                                const diffDays = (nowTime - refTime) / (1000 * 60 * 60 * 24);
                                
                                // BREAK CONDITION: If more than 1 full calendar day has passed since last tick
                                // Example: Last tick 12th, Today 14th -> diffDays is 2 -> BREAK!
                                if (diffDays > 1) {
                                    return { 
                                        ...todo, 
                                        isBroken: true, 
                                        completed: true, 
                                        completedAt: Date.now(),
                                        isArchived: false // Keep on main list for a day to show it's broken
                                    };
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
        const todoId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
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
                    // RESTORE/UNDO LOGIC: Only allow undoing if it's NOT a streak mission
                    if ((todo.completed || todo.isArchived) && todo.type !== 'streak') {
                        return { 
                            ...todo, 
                            completed: false, 
                            completedAt: undefined, 
                            isArchived: false,
                            isBroken: false,
                            // If it's a streak, keep the current streak count but allow continuing
                            lastCompletedDate: undefined 
                        };
                    }

                    // STREAK TICKING LOGIC: No Undo if Locked today
                    if (todo.type === 'streak') {
                        if (todo.lastCompletedDate === today) return todo; // Locked today
                        
                        const newStreak = (todo.currentStreak || 0) + 1;
                        const isFinished = newStreak === todo.streakTarget;

                        return {
                            ...todo,
                            currentStreak: newStreak,
                            lastCompletedDate: today,
                            streakStartedAt: todo.streakStartedAt || Date.now(), // First tick records the start 🚀
                            completed: isFinished,
                            completedAt: isFinished ? Date.now() : undefined,
                        };
                    }

                    // NORMAL TASK LOGIC: Simple toggle
                    const now = Date.now();
                    if (todo.reminderId) cancelReminder(todo.reminderId);
                    return { ...todo, completed: true, completedAt: now, reminderId: undefined };
                }
                return todo;
            });
            SyncService.backupToCloud(updated);
            return updated;
        });
    }, [cancelReminder, getTodayISO]);

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

    const clearHistory = useCallback(() => {
        setTodos(prev => {
            const toClear = prev.filter(t => t.isArchived);
            toClear.forEach(t => {
                if (t.reminderId) cancelReminder(t.reminderId);
                // Mirror Cleanup in Cloud 🧼
                SyncService.deleteFromCloud(t.id);
            });
            const updated = prev.filter(todo => !todo.isArchived);
            SyncService.backupToCloud(updated); // Final array sync
            return updated;
        });
    }, [cancelReminder]);

    const archiveCompleted = useCallback(() => {
        const toArchive = todos.filter(t => t.completed || t.isBroken);
        if (toArchive.length === 0) return;

        const updated = todos.map(t => (t.completed || t.isBroken) ? { ...t, isArchived: true } : t);
        setTodos(updated);
        
        // Push to cloud background sync logic
        SyncService.backupToCloud(updated);
        console.log(`[Archive] Successfully moved ${toArchive.length} items to history.`);
    }, [todos]);

    // LISTEN FOR NOTIFICATION ACTIONS (COMPLETE) 📱
    useEffect(() => {
        if (Platform.OS === 'web') return;
        
        const unsubscribe = notifee.onForegroundEvent(({ type, detail }) => {
            if (type === EventType.ACTION_PRESS && detail.actionId === 'COMPLETE') {
                const todoId = detail.notification?.id;
                if (todoId) {
                    toggleTodo(todoId);
                }
            }
        });

        return () => unsubscribe();
    }, [toggleTodo]);

    // UPDATE HOME SCREEN WIDGET 🏠
    useEffect(() => {
        if (Platform.OS !== 'android' || isLoading) return;

        const updateWidget = async () => {
            try {
                const { requestWidgetUpdate } = require('react-native-android-widget');
                const { TodoWidget } = require('../widget/TodoWidget');
                
                requestWidgetUpdate({
                    widgetName: 'TodoWidget',
                    renderWidget: () => <TodoWidget todos={todos} />
                });
            } catch (e) {
                // Widget might not be configured or platform not supported
            }
        };
        updateWidget();
    }, [todos, isLoading]);

    return (
        <TodoContext.Provider value={{
            todos,
            isLoading,
            addTodo,
            toggleTodo,
            deleteTodo,
            pinTodo,
            clearHistory,
            archiveCompleted,
            syncWithCloud,
            count: todos.filter(t => !t.isArchived).length,
            completedCount: todos.filter(t => t.completed && !t.isArchived).length,
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
