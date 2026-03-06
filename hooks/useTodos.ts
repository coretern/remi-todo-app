import AsyncStorage from '@react-native-async-storage/async-storage';
import { useCallback, useEffect, useState } from 'react';
import { Todo } from '../types/todo';
import { useNotifications } from './useNotifications';

const STORAGE_KEY = '@todo_app_data';

export const useTodos = () => {
    const [todos, setTodos] = useState<Todo[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const { scheduleTodoReminder, cancelReminder } = useNotifications();

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

    const addTodo = useCallback(async (task: string, dueDate?: number) => {
        const todoId = Date.now().toString();
        const newTodo: Todo = {
            id: todoId,
            task,
            completed: false,
            createdAt: Date.now(),
            dueDate,
        };

        if (dueDate) {
            const reminderId = await scheduleTodoReminder(todoId, task, dueDate);
            if (reminderId) newTodo.reminderId = reminderId;
        }

        setTodos(prev => [newTodo, ...prev]);
    }, [scheduleTodoReminder]);

    const toggleTodo = useCallback((id: string) => {
        setTodos(prev => prev.map(todo => {
            if (todo.id === id) {
                const now = Date.now();
                if (!todo.completed) {
                    // Completing: set completedAt
                    if (todo.reminderId) cancelReminder(todo.reminderId);
                    return { ...todo, completed: true, completedAt: now, reminderId: undefined };
                } else {
                    // Reopening: clear completedAt
                    return { ...todo, completed: false, completedAt: undefined };
                }
            }
            return todo;
        }));
    }, [cancelReminder]);

    const deleteTodo = useCallback((id: string) => {
        setTodos(prev => {
            const todoToDelete = prev.find(t => t.id === id);
            if (todoToDelete?.reminderId) {
                cancelReminder(todoToDelete.reminderId);
            }
            return prev.filter(todo => todo.id !== id);
        });
    }, [cancelReminder]);

    const clearCompleted = useCallback(() => {
        setTodos(prev => {
            prev.forEach(t => {
                if (t.completed && t.reminderId) cancelReminder(t.reminderId);
            });
            return prev.filter(todo => !todo.completed);
        });
    }, [cancelReminder]);

    return {
        todos,
        addTodo,
        toggleTodo,
        deleteTodo,
        clearCompleted,
        isLoading,
        count: todos.length,
        completedCount: todos.filter(t => t.completed).length,
    };
};
