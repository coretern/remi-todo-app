// Remi Todo App - New Task Screen (Stable Build)
import DateTimePicker from '@react-native-community/datetimepicker';
import { Ionicons } from '@expo/vector-icons';
import { Stack, useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    KeyboardAvoidingView,
    Platform,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
    LayoutAnimation
} from 'react-native';
import { useTodos } from '../hooks/useTodos';
import { useTheme } from '../context/ThemeContext';

export default function NewTaskScreen() {
    const router = useRouter();
    const { addTodo } = useTodos();
    const { colors, theme, timeFormat } = useTheme();
    const [task, setTask] = useState('');
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [showTimePicker, setShowTimePicker] = useState(false);
    const [dueDate, setDueDate] = useState<Date | null>(null);
    const [reminderOffset, setReminderOffset] = useState<number | undefined>(undefined);
    const [customOffset, setCustomOffset] = useState('');

    const handleSave = async () => {
        if (task.trim()) {
            const finalOffset = customOffset ? parseInt(customOffset) : reminderOffset;
            await addTodo(task, dueDate ? dueDate.getTime() : undefined, finalOffset);
            LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
            router.back();
        }
    };

    const onDateChange = (_: any, selectedDate?: Date) => {
        setShowDatePicker(false);
        if (selectedDate) {
            const newDate = dueDate || new Date();
            newDate.setFullYear(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate());
            setDueDate(new Date(newDate));
        }
    };

    const onTimeChange = (_: any, selectedTime?: Date) => {
        setShowTimePicker(false);
        if (selectedTime) {
            const newDate = dueDate || new Date();
            newDate.setHours(selectedTime.getHours(), selectedTime.getMinutes());
            setDueDate(new Date(newDate));
        }
    };

    const formatDate = (date: Date) => {
        return date.toLocaleDateString('en-GB', {
            weekday: 'short',
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
    };

    const formatTime = (date: Date) => {
        return date.toLocaleTimeString(timeFormat === '12h' ? 'en-US' : 'en-GB', { 
            hour: 'numeric', 
            minute: '2-digit', 
            hour12: timeFormat === '12h' 
        });
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
            <Stack.Screen options={{
                title: 'New Mission',
            }} />

            <KeyboardAvoidingView 
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={{ flex: 1 }}
            >
                <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
                    <View style={styles.section}>
                        <Text style={[styles.sectionLabel, { color: colors.header }]}>What is to be done?</Text>
                        <View style={styles.inputRow}>
                            <TextInput
                                style={[styles.taskInput, { color: colors.text }]}
                                placeholder="Enter Task Here"
                                placeholderTextColor={colors.secondaryText}
                                value={task}
                                onChangeText={(text) => {
                                    setTask(text);
                                    if (text.length > 0 && task.length === 0) {
                                        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
                                    }
                                }}
                                onSubmitEditing={handleSave}
                                returnKeyType="done"
                                autoFocus
                            />
                            {task.trim().length > 0 && (
                                <TouchableOpacity 
                                    style={[styles.inlineSaveBtn, { backgroundColor: colors.header }]} 
                                    onPress={handleSave}
                                    activeOpacity={0.7}
                                >
                                    <Ionicons name="checkmark" size={24} color="white" />
                                </TouchableOpacity>
                            )}
                        </View>
                        <View style={[styles.underline, { backgroundColor: colors.border }]} />
                    </View>

                    <View style={styles.section}>
                        <Text style={[styles.sectionLabel, { color: colors.header }]}>Due date</Text>
                        <TouchableOpacity style={styles.pickerRow} onPress={() => setShowDatePicker(true)}>
                            <Text style={[styles.pickerText, { color: colors.text }, !dueDate && { color: colors.secondaryText }]}>
                                {dueDate ? formatDate(dueDate) : 'Date not set'}
                            </Text>
                            <Ionicons name="calendar-outline" size={22} color={colors.header} />
                            {dueDate && (
                                <TouchableOpacity onPress={() => {
                                    setDueDate(null);
                                    setReminderOffset(undefined);
                                }} style={styles.clearBtn}>
                                    <Ionicons name="close-circle" size={20} color={colors.secondaryText} />
                                </TouchableOpacity>
                            )}
                        </TouchableOpacity>
                        <View style={[styles.underline, { backgroundColor: colors.border }]} />

                        {dueDate && (
                            <>
                                <TouchableOpacity style={styles.pickerRow} onPress={() => setShowTimePicker(true)}>
                                    <Text style={[styles.pickerText, { color: colors.text }]}>{formatTime(dueDate)}</Text>
                                    <Ionicons name="time-outline" size={22} color={colors.header} />
                                </TouchableOpacity>
                                <View style={[styles.underline, { backgroundColor: colors.border }]} />

                                {/* Reminder Selection */}
                                <View style={{ marginTop: 24 }}>
                                    <Text style={[styles.sectionLabel, { color: colors.header, marginBottom: 16 }]}>Remind Me</Text>
                                    <View style={styles.chipRow}>
                                        {[
                                            { label: 'On time', value: 0 },
                                            { label: '2 min', value: 2 },
                                            { label: '10 min', value: 10 },
                                            { label: '20 min', value: 20 }
                                        ].map(opt => (
                                            <TouchableOpacity 
                                                key={opt.value} 
                                                style={[
                                                    styles.chip, 
                                                    reminderOffset === opt.value && !customOffset && { backgroundColor: colors.header, borderColor: colors.header }
                                                ]}
                                                onPress={() => {
                                                    setReminderOffset(opt.value);
                                                    setCustomOffset('');
                                                }}
                                            >
                                                <Text style={[
                                                    styles.chipText, 
                                                    { color: colors.text },
                                                    reminderOffset === opt.value && !customOffset && { color: 'white' }
                                                ]}>{opt.label}</Text>
                                            </TouchableOpacity>
                                        ))}
                                    </View>

                                    <View style={[styles.customRow, { marginTop: 16, flexDirection: 'row', alignItems: 'center' }]}>
                                        <TextInput
                                            style={[styles.customInput, { color: colors.text, borderColor: colors.border, borderWidth: 1, borderRadius: 8, paddingHorizontal: 12, paddingVertical: 6, width: 100, fontSize: 13 }]}
                                            placeholder="Custom"
                                            placeholderTextColor={colors.secondaryText}
                                            keyboardType="numeric"
                                            value={customOffset}
                                            onChangeText={(t) => {
                                                setCustomOffset(t);
                                                if (t) setReminderOffset(undefined);
                                            }}
                                        />
                                        <Text style={{ color: colors.secondaryText, fontSize: 12, marginLeft: 10 }}>mins before mission</Text>
                                    </View>
                                </View>
                            </>
                        )}
                    </View>
                </ScrollView>


                {Platform.OS !== 'web' && showDatePicker && (
                    <DateTimePicker
                        value={dueDate || new Date()}
                        mode="date"
                        display={Platform.OS === 'ios' ? 'spinner' : 'calendar'}
                        onChange={onDateChange}
                    />
                )}
                {Platform.OS !== 'web' && showTimePicker && (
                    <DateTimePicker
                        value={dueDate || new Date()}
                        mode="time"
                        display={Platform.OS === 'ios' ? 'spinner' : 'clock'}
                        is24Hour={timeFormat === '24h'}
                        onChange={onTimeChange}
                    />
                )}
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    backButton: { marginLeft: 15 },
    scrollContent: { padding: 25, paddingBottom: 100 },
    section: { marginBottom: 35 },
    sectionLabel: { fontSize: 15, fontWeight: '800', marginBottom: 10 },
    inputRow: { flexDirection: 'row', alignItems: 'center' },
    taskInput: { flex: 1, fontSize: 18, paddingVertical: 10, fontWeight: '500' },
    underline: { height: 1, marginTop: 5 },
    pickerRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 15 },
    pickerText: { flex: 1, fontSize: 18 },
    clearBtn: { marginLeft: 15, opacity: 0.5 },
    inlineSaveBtn: {
        width: 44,
        height: 44,
        borderRadius: 22,
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 3,
    },
    chipRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    chip: {
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#e0e0e0',
        marginRight: 8,
        marginBottom: 8,
    },
    chipText: {
        fontSize: 13,
        fontWeight: '600',
    },
    customRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    customInput: {
        width: 70,
        height: 36,
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 10,
        fontSize: 14,
    }
});
