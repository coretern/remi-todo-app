import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Text, TouchableOpacity, View, ScrollView } from 'react-native';
import { Todo } from '../../../types/todo';
import { styles } from './styles';

interface TodoItemProps {
    todo: Todo;
    onToggle: (id: string) => void;
    onDelete: (id: string) => void;
    onPin?: (id: string) => void;
}

import { useTheme } from '../../../context/ThemeContext';

const TodoItem: React.FC<TodoItemProps> = ({ todo, onToggle, onDelete, onPin }) => {
    const { colors, theme, timeFormat } = useTheme();
    const today = new Date().toISOString().split('T')[0];
    
    // Check if streak is locked for today
    const isLocked = todo.type === 'streak' && todo.lastCompletedDate === today;

    const formatDate = (timestamp: number) => {
        const date = new Date(timestamp);
        const today = new Date();
        const isToday = date.toDateString() === today.toDateString();
        return date.toLocaleString('en-GB', {
            day: 'numeric',
            month: 'short',
            hour: 'numeric',
            minute: '2-digit',
            hour12: timeFormat === '12h'
        });
    };

    return (
        <View style={[styles.container, { backgroundColor: colors.surface, borderColor: colors.border, paddingRight: 12, paddingVertical: 18 }]}>
            <View style={styles.content}>
                <TouchableOpacity 
                    onPress={() => onToggle(todo.id)}
                    activeOpacity={isLocked ? 1 : 0.7}
                    style={[
                        styles.checkbox, 
                        (todo.completed || isLocked) && { backgroundColor: isLocked ? '#FFD700' : colors.header, borderColor: isLocked ? '#FFD700' : colors.header }, 
                        { borderColor: theme === 'dark' ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.1)' }
                    ]}
                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                    {(todo.completed || isLocked) && (
                        <Ionicons name={isLocked ? "lock-closed" : "checkmark"} size={14} color="white" />
                    )}
                </TouchableOpacity>
                
                <View style={styles.textContainer}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        {todo.icon && todo.icon !== 'default' && (
                            <Ionicons 
                                name={todo.icon === 'youtube' ? 'logo-youtube' : 'logo-instagram'} 
                                size={14} 
                                color={todo.icon === 'youtube' ? '#FF0000' : '#E1306C'} 
                                style={{ marginRight: 6 }}
                            />
                        )}
                        <Text style={[styles.text, todo.completed && styles.completedText, { color: colors.text, fontSize: 16, fontWeight: '700', flexShrink: 1 }]}>
                            {todo.task}
                        </Text>
                    </View>

                    <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4 }}>
                        {todo.type === 'streak' && !todo.completed && (
                            <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255, 215, 0, 0.12)', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6, marginRight: 10, borderWidth: 0.5, borderColor: 'rgba(255, 215, 0, 0.3)' }}>
                                <Ionicons name="flame" size={12} color="#FFD700" />
                                <Text style={{ fontSize: 9, fontWeight: '900', color: '#FFD700', marginLeft: 4, letterSpacing: 1 }}>
                                    DAY {todo.currentStreak}/{todo.streakTarget}
                                </Text>
                            </View>
                        )}
                        <Text style={[styles.timestamp, { color: colors.secondaryText, opacity: 0.4 }]}>
                            {formatDate(todo.createdAt)}
                        </Text>
                    </View>
                </View>
            </View>

            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                {onPin && !todo.completed && (
                    <TouchableOpacity onPress={() => onPin(todo.id)} style={{ padding: 8, opacity: todo.isPinned ? 1 : 0.35 }}>
                        <Ionicons name={todo.isPinned ? "pin" : "pin-outline"} size={18} color={todo.isPinned ? colors.header : colors.secondaryText} />
                    </TouchableOpacity>
                )}
                <TouchableOpacity
                    onPress={() => onDelete(todo.id)}
                    style={[styles.deleteButton, { marginLeft: 5 }]}
                    activeOpacity={0.5}
                >
                    <Ionicons name="close-circle-outline" size={22} color={colors.secondaryText} />
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default TodoItem;
