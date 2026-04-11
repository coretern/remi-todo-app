import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';
import { Todo } from '../../../types/todo';
import { styles } from './styles';

import { useTheme } from '../../../context/ThemeContext';

interface TodoItemProps {
    todo: Todo;
    onToggle: (id: string) => void;
    onDelete: (id: string) => void;
    onPin?: (id: string) => void;
    onShowCert?: (todo: Todo) => void;
}

const TodoItem: React.FC<TodoItemProps> = ({ todo, onToggle, onDelete, onPin, onShowCert }) => {
    const { colors, theme, timeFormat } = useTheme();
    const d = new Date();
    const today = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    
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

    const getTimeRemaining = (dueDate?: number): { text: string, isOverdue: boolean } | null => {
        if (!dueDate || todo.completed) return null;
        const now = Date.now();
        const diff = dueDate - now;
        
        if (diff <= 0) {
            const timeStr = new Date(dueDate).toLocaleTimeString(timeFormat === '12h' ? 'en-US' : 'en-GB', { 
                hour: 'numeric', 
                minute: '2-digit', 
                hour12: timeFormat === '12h' 
            });
            return { text: `Overdue at ${timeStr}`, isOverdue: true };
        }
        
        const mins = Math.round(diff / 60000);
        if (mins < 60) return { text: `(In ${mins} min)`, isOverdue: false };
        
        const hours = Math.floor(mins / 60);
        const remainingMins = mins % 60;
        if (hours < 24) return { text: `(In ${hours}h ${remainingMins}m)`, isOverdue: false };
        
        return { text: `(In ${Math.floor(hours / 24)}d)`, isOverdue: false };
    };

    const timeInfo = getTimeRemaining(todo.dueDate);

    return (
        <View style={[styles.container, { backgroundColor: colors.surface, borderColor: colors.border, paddingRight: 12 }]}>
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
                            <Image 
                                source={
                                    todo.icon === 'youtube' ? require('../../../assets/icon/YouTube.jpeg') :
                                    todo.icon === 'instagram' ? require('../../../assets/icon/Instagram.jpeg') :
                                    todo.icon === 'study' ? require('../../../assets/icon/study.jpeg') :
                                    null
                                } 
                                style={{ width: 14, height: 14, marginRight: 6, borderRadius: 2, opacity: 0.9 }} 
                            />
                        )}
                        <Text style={[styles.text, todo.completed && styles.completedText, { color: colors.text, fontSize: 16, fontWeight: '700', flexShrink: 1 }]}>
                            {todo.task}
                        </Text>
                    </View>

                    <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4 }}>
                        {todo.type === 'streak' && !todo.completed && (
                            <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: theme === 'dark' ? 'rgba(255, 215, 0, 0.12)' : 'rgba(217, 119, 6, 0.12)', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6, marginRight: 10, borderWidth: 0.5, borderColor: theme === 'dark' ? 'rgba(255, 215, 0, 0.3)' : 'rgba(217, 119, 6, 0.3)' }}>
                                <Ionicons name="flame" size={12} color={theme === 'dark' ? '#FFD700' : '#D97706'} />
                                <Text style={{ fontSize: 9, fontWeight: '900', color: theme === 'dark' ? '#FFD700' : '#D97706', marginLeft: 4, letterSpacing: 1 }}>
                                    DAY {todo.currentStreak}/{todo.streakTarget}
                                </Text>
                            </View>
                        )}
                        
                        <View style={{ flex: 1, flexDirection: todo.type === 'streak' ? 'column' : 'row', alignItems: todo.type === 'streak' ? 'flex-start' : 'center' }}>
                            <Text style={[styles.timestamp, { color: colors.secondaryText, opacity: 0.4 }]}>
                                {formatDate(todo.createdAt)}
                            </Text>
                            {timeInfo && (
                                <View style={{ 
                                    flexDirection: 'row', 
                                    alignItems: 'center', 
                                    marginTop: todo.type === 'streak' ? 1.5 : 1, 
                                    marginLeft: todo.type === 'streak' ? 0 : 6, 
                                    opacity: timeInfo.isOverdue ? 0.7 : 0.5 
                                }}>
                                    {!timeInfo.isOverdue && <Ionicons name="notifications-outline" size={8} color={colors.secondaryText} style={{ marginRight: 1, marginTop: 2 }} />}
                                    <Text style={{ 
                                        fontSize: 7.1, 
                                        color: timeInfo.isOverdue ? '#EF4444' : colors.secondaryText, 
                                        fontWeight: '700',
                                        textTransform: timeInfo.isOverdue ? 'uppercase' : 'none'
                                    }}>
                                        {timeInfo.text}
                                    </Text>
                                </View>
                            )}
                        </View>
                    </View>
                </View>
            </View>

            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                {todo.completed && (
                    <TouchableOpacity 
                        onPress={() => onToggle(todo.id)} 
                        style={{ padding: 8, marginRight: 4 }}
                    >
                        <Ionicons name="refresh-outline" size={18} color={colors.secondaryText} />
                    </TouchableOpacity>
                )}
                {onShowCert && todo.type === 'streak' && todo.completed && !todo.isBroken && (
                    <TouchableOpacity onPress={() => onShowCert(todo)} style={{ padding: 8 }}>
                        <Ionicons name="ribbon" size={20} color="#FFD700" />
                    </TouchableOpacity>
                )}
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
