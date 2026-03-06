import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { Todo } from '../../../types/todo';
import { styles } from './styles';

interface TodoItemProps {
    todo: Todo;
    onToggle: (id: string) => void;
    onDelete: (id: string) => void;
}

const TodoItem: React.FC<TodoItemProps> = ({ todo, onToggle, onDelete }) => {
    const formatDate = (timestamp: number) => {
        const date = new Date(timestamp);
        return date.toLocaleString([], {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <View style={styles.container}>
            <TouchableOpacity
                style={styles.content}
                onPress={() => onToggle(todo.id)}
                activeOpacity={0.7}
            >
                <View style={[styles.checkbox, todo.completed && styles.checkboxChecked]}>
                    {todo.completed && (
                        <Ionicons name="checkmark" size={14} color="white" />
                    )}
                </View>
                <View style={styles.textContainer}>
                    <Text style={[styles.text, todo.completed && styles.completedText]} numberOfLines={2}>
                        {todo.task}
                    </Text>
                    {todo.dueDate && !todo.completed && (
                        <View style={styles.alarmRow}>
                            <Ionicons name="notifications-outline" size={12} color="#007AFF" />
                            <Text style={styles.alarmText}>{formatDate(todo.dueDate)}</Text>
                        </View>
                    )}
                    <Text style={styles.creationText}>
                        Created • {formatDate(todo.createdAt)}
                    </Text>
                </View>
            </TouchableOpacity>

            <TouchableOpacity
                onPress={() => onDelete(todo.id)}
                style={styles.deleteButton}
            >
                <Ionicons name="trash-outline" size={18} color="#FF3B30" />
            </TouchableOpacity>
        </View>
    );
};

export default TodoItem;
