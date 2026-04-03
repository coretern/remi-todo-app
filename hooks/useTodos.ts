import { useTodoContext } from '../context/TodoContext';

export const useTodos = () => {
    const context = useTodoContext();
    
    return {
        todos: context.todos,
        addTodo: context.addTodo,
        toggleTodo: context.toggleTodo,
        deleteTodo: context.deleteTodo,
        clearCompleted: context.clearCompleted,
        isLoading: context.isLoading,
        count: context.count,
        completedCount: context.completedCount,
    };
};
