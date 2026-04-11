import { useTodoContext } from '../context/TodoContext';

export const useTodos = () => {
    const context = useTodoContext();
    
    return {
        todos: context.todos,
        addTodo: context.addTodo,
        toggleTodo: context.toggleTodo,
        deleteTodo: context.deleteTodo,
        clearCompleted: context.clearCompleted,
        archiveCompleted: context.archiveCompleted,
        pinTodo: context.pinTodo,
        syncWithCloud: context.syncWithCloud,
        isLoading: context.isLoading,
        count: context.count,
        completedCount: context.completedCount,
    };
};
