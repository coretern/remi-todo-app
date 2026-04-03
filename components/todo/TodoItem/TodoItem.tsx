import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Text, TouchableOpacity, View, ScrollView } from 'react-native';
import { Todo } from '../../../types/todo';
import { styles } from './styles';

interface TodoItemProps {
    todo: Todo;
    onToggle: (id: string) => void;
    onDelete: (id: string) => void;
}

import { useTheme } from '../../../context/ThemeContext';

const TodoItem: React.FC<TodoItemProps> = ({ todo, onToggle, onDelete }) => {
    const { colors, theme, timeFormat } = useTheme();
    const formatDate = (timestamp: number) => {
        const date = new Date(timestamp);
        const today = new Date();
        const isToday = date.toDateString() === today.toDateString();
        
        return date.toLocaleString(timeFormat === '12h' ? 'en-US' : 'en-GB', {
            month: isToday ? undefined : 'short',
            day: isToday ? undefined : 'numeric',
            hour: 'numeric',
            minute: '2-digit',
            hour12: timeFormat === '12h'
        });
    };

    return (
        <View style={[styles.container, { backgroundColor: colors.surface, borderColor: colors.border, paddingRight: 12 }]}>
            <View style={styles.content}>
                <TouchableOpacity 
                    onPress={() => onToggle(todo.id)}
                    activeOpacity={0.7}
                    style={[styles.checkbox, todo.completed && styles.checkboxChecked, { borderColor: theme === 'dark' ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.1)' }]}
                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                    {todo.completed && (
                        <Ionicons name="checkmark" size={14} color="white" />
                    )}
                </TouchableOpacity>
                
                <View style={styles.textContainer}>
                    <Text style={[styles.text, todo.completed && styles.completedText, { color: colors.text }]}>
                        {todo.task}
                    </Text>
                    <Text style={[styles.timestamp, { color: colors.secondaryText, opacity: 0.35 }]}>
                        {new Date(todo.createdAt).toLocaleString(timeFormat === '12h' ? 'en-US' : 'en-GB', { 
                            month: 'short', 
                            day: 'numeric', 
                            hour: 'numeric', 
                            minute: '2-digit',
                            hour12: timeFormat === '12h'
                        })}
                    </Text>
                    {todo.dueDate && !todo.completed && (
                        <View style={[styles.alarmRow, { opacity: 0.55 }]}>
                            <Ionicons name="notifications-outline" size={10} color="#0EA5E9" />
                            <Text style={styles.alarmText}>{formatDate(todo.dueDate)}</Text>
                        </View>
                    )}
                </View>
            </View>

            <TouchableOpacity
                onPress={() => onDelete(todo.id)}
                style={styles.deleteButton}
                activeOpacity={0.5}
            >
                <Ionicons name="close-circle-outline" size={22} color={colors.secondaryText} />
            </TouchableOpacity>
        </View>
    );
};

export default TodoItem;
