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
    LayoutAnimation,
    Image,
    Switch
} from 'react-native';
import { useTodos } from '../hooks/useTodos';
import { useTheme } from '../context/ThemeContext';

export default function NewTaskScreen() {
    const router = useRouter();
    const { addTodo } = useTodos();
    const { colors, theme, timeFormat } = useTheme();
    
    const [task, setTask] = useState('');
    const [userName, setUserName] = useState('');
    const [type, setType] = useState<'normal' | 'streak'>('normal');
    const [streakTarget, setStreakTarget] = useState<number | undefined>(10);
    const [customTarget, setCustomTarget] = useState('');
    const [icon, setIcon] = useState<'youtube' | 'instagram' | 'default'>('default');
    
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [showTimePicker, setShowTimePicker] = useState(false);
    const [dueDate, setDueDate] = useState<Date | null>(null);
    const [reminderOffset, setReminderOffset] = useState<number | undefined>(undefined);
    const [customOffset, setCustomOffset] = useState('');
    const [reminderEnabled, setReminderEnabled] = useState(false);

    const handleSave = async () => {
        if (task.trim()) {
            const finalOffset = customOffset ? parseInt(customOffset) : reminderOffset;
            const finalTarget = customTarget ? parseInt(customTarget) : streakTarget;
            
            // Notification logic: If enabled and no date, default 10min. If disabled, undefined.
            let finalDueDate: number | undefined = undefined;
            if (reminderEnabled) {
                finalDueDate = dueDate ? dueDate.getTime() : (Date.now() + 10 * 60 * 1000);
            }
            
            if (type === 'normal') {
                await addTodo(
                    task.trim(), 
                    'normal', 
                    userName.trim() || 'Champion',
                    undefined,
                    icon,
                    finalDueDate, 
                    finalOffset
                );
            } else {
                await addTodo(
                    task.trim(), 
                    'streak', 
                    userName.trim() || 'Champion',
                    finalTarget,
                    icon,
                    finalDueDate, 
                    finalOffset
                );
            }

            LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
            router.back();
        }
    };

    const onDateChange = (_: any, selectedDate?: Date) => {
        setShowDatePicker(false);
        if (selectedDate) {
            const newDate = dueDate || new Date();
            newDate.setFullYear(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate());
            newDate.setSeconds(0, 0);
            setDueDate(new Date(newDate));
        }
    };

    const onTimeChange = (_: any, selectedTime?: Date) => {
        setShowTimePicker(false);
        if (selectedTime) {
            const newDate = dueDate || new Date();
            newDate.setHours(selectedTime.getHours(), selectedTime.getMinutes(), 0, 0);
            setDueDate(new Date(newDate));
        }
    };

    const formatDate = (date: Date) => {
        return date.toLocaleDateString('en-GB', {
            weekday: 'short', day: 'numeric', month: 'long', year: 'numeric'
        });
    };

    const formatTime = (date: Date) => {
        return date.toLocaleTimeString(timeFormat === '12h' ? 'en-US' : 'en-GB', { 
            hour: 'numeric', minute: '2-digit', hour12: timeFormat === '12h' 
        });
    };

    const handleTaskChange = (text: string) => {
        const wordCount = text.trim().split(/\s+/).filter(w => w.length > 0).length;
        if (type === 'normal' || wordCount <= 12 || text.length < task.length) {
            setTask(text);
        }
    };

    const currentWordCount = task.trim().split(/\s+/).filter(w => w.length > 0).length;

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
            <Stack.Screen options={{ title: 'New Mission' }} />

            <KeyboardAvoidingView 
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={{ flex: 1 }}
            >
                <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
                    
                    {/* Mission Type Selection */}
                    <View style={styles.section}>
                        <Text style={[styles.sectionLabel, { color: colors.header }]}>Mission Type</Text>
                        <View style={styles.typeRow}>
                            <TouchableOpacity 
                                style={[styles.typeBtn, type === 'normal' && { backgroundColor: colors.header, borderColor: colors.header }]} 
                                onPress={() => {
                                    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
                                    setType('normal');
                                }}
                            >
                                <Ionicons name="list" size={18} color={type === 'normal' ? 'white' : colors.text} />
                                <Text style={[styles.typeBtnText, { color: type === 'normal' ? 'white' : colors.text }]}>Normal Task</Text>
                            </TouchableOpacity>
                            <TouchableOpacity 
                                style={[styles.typeBtn, type === 'streak' && { backgroundColor: colors.header, borderColor: colors.header }]} 
                                onPress={() => {
                                    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
                                    setType('streak');
                                }}
                            >
                                <Ionicons name="flame" size={18} color={type === 'streak' ? 'white' : colors.text} />
                                <Text style={[styles.typeBtnText, { color: type === 'streak' ? 'white' : colors.text }]}>Daily Streak</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* Personalized Name Section */}
                    {type === 'streak' && (
                        <View style={styles.section}>
                            <Text style={[styles.sectionLabel, { color: colors.header }]}>Real Name (for Certificate)</Text>
                            <View style={styles.inputRow}>
                                <TextInput
                                    style={[styles.taskInput, { color: colors.text }]}
                                    placeholder="Enter Your Name"
                                    placeholderTextColor={colors.secondaryText}
                                    value={userName}
                                    onChangeText={setUserName}
                                />
                            </View>
                            <View style={[styles.underline, { backgroundColor: colors.border }]} />
                        </View>
                    )}

                    {/* Mission Description Section */}
                    <View style={styles.section}>
                        <Text style={[styles.sectionLabel, { color: colors.header }]}>What is to be done?</Text>
                        <View style={[styles.inputRow, type === 'normal' && { alignItems: 'flex-end' }]}>
                            <TextInput
                                style={[styles.taskInput, { color: colors.text }, type === 'normal' && { minHeight: 80, textAlignVertical: 'top' }]}
                                placeholder={type === 'streak' ? "e.g. Make a Reel daily" : "Enter Task Here"}
                                placeholderTextColor={colors.secondaryText}
                                value={task}
                                onChangeText={handleTaskChange}
                                onSubmitEditing={type === 'streak' ? handleSave : undefined}
                                returnKeyType={type === 'streak' ? "done" : "default"}
                                multiline={type === 'normal'}
                                autoFocus
                            />
                            {task.trim().length > 0 && (
                                <TouchableOpacity 
                                    style={[styles.inlineSaveBtn, { backgroundColor: colors.header }, type === 'normal' && { marginBottom: 10 }]} 
                                    onPress={handleSave}
                                    activeOpacity={0.7}
                                >
                                    <Ionicons name="checkmark" size={24} color="white" />
                                </TouchableOpacity>
                            )}
                        </View>
                        <View style={[styles.underline, { backgroundColor: colors.border }]} />
                        {type === 'streak' && (
                            <Text style={{ fontSize: 10, color: currentWordCount === 12 ? '#EF4444' : colors.secondaryText, marginTop: 6, alignSelf: 'flex-end', fontWeight: 'bold' }}>
                                {currentWordCount}/12 words
                            </Text>
                        )}
                    </View>

                    {type === 'streak' && (
                        <View style={styles.section}>
                            <Text style={[styles.sectionLabel, { color: colors.header }]}>Streak Target (Days)</Text>
                            <View style={styles.chipRow}>
                                {[5, 15, 30].map(val => (
                                    <TouchableOpacity 
                                        key={val} 
                                        style={[styles.chip, streakTarget === val && !customTarget && { backgroundColor: colors.header, borderColor: colors.header }]}
                                        onPress={() => { setStreakTarget(val); setCustomTarget(''); }}
                                    >
                                        <Text style={[styles.chipText, { color: colors.text }, streakTarget === val && !customTarget && { color: 'white' }]}>{val} Days</Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                            <View style={[styles.customRow, { marginTop: 10 }]}>
                                <TextInput
                                    style={[styles.customInput, { color: colors.text, borderColor: colors.border }]}
                                    placeholder="Custom"
                                    placeholderTextColor={colors.secondaryText}
                                    keyboardType="numeric"
                                    value={customTarget}
                                    onChangeText={(t) => { setCustomTarget(t); setStreakTarget(undefined); }}
                                />
                                <Text style={{ color: colors.secondaryText, fontSize: 12, marginLeft: 10 }}>days goal</Text>
                            </View>

                            <Text style={[styles.sectionLabel, { color: colors.header, marginTop: 24 }]}>Identify Mission With</Text>
                            <View style={styles.iconRow}>
                                {[
                                    { id: 'default', ionicIcon: 'star-outline' },
                                    { id: 'youtube', source: require('../assets/icon/YouTube.jpeg'), title: 'YouTube' },
                                    { id: 'instagram', source: require('../assets/icon/Instagram.jpeg'), title: 'Instagram' },
                                    { id: 'study', source: require('../assets/icon/study.jpeg'), title: 'Study' }
                                ].map(item => (
                                    <TouchableOpacity 
                                        key={item.id} 
                                        style={[styles.iconBtn, icon === item.id && { backgroundColor: 'rgba(0,0,0,0.05)', borderColor: colors.header }]} 
                                        onPress={() => setIcon(item.id as any)}
                                    >
                                        {item.id === 'default' ? (
                                            <Ionicons name={item.ionicIcon as any} size={30} color={colors.text} />
                                        ) : (
                                            <Image source={item.source} style={{ width: 30, height: 30, borderRadius: 8 }} resizeMode="cover" />
                                        )}
                                        <Text style={[styles.iconLabel, { color: colors.secondaryText }, icon === item.id && { color: colors.header }]} numberOfLines={1} adjustsFontSizeToFit>
                                            {item.title || 'Default'}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </View>
                    )}

                    <View style={styles.section}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                            <Text style={[styles.sectionLabel, { color: colors.header, marginBottom: 0 }]}>Due date & Reminder</Text>
                            <Switch
                                value={reminderEnabled}
                                onValueChange={(val) => {
                                    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
                                    setReminderEnabled(val);
                                }}
                                trackColor={{ false: '#767577', true: colors.header }}
                                thumbColor={reminderEnabled ? '#fff' : '#f4f3f4'}
                            />
                        </View>

                        <View style={{ opacity: reminderEnabled ? 1 : 0.35 }}>
                            <TouchableOpacity 
                                style={styles.pickerRow} 
                                onPress={() => reminderEnabled && setShowDatePicker(true)}
                                disabled={!reminderEnabled}
                            >
                                <Text style={[styles.pickerText, { color: colors.text }, !dueDate && { color: colors.secondaryText }]}>
                                    {dueDate ? formatDate(dueDate) : `Auto: In 10 min (${formatTime(new Date(Date.now() + 10 * 60 * 1000))})`}
                                </Text>
                                <Ionicons name="calendar-outline" size={22} color={colors.header} />
                                {dueDate && reminderEnabled && (
                                    <TouchableOpacity onPress={() => { setDueDate(null); setReminderOffset(undefined); }} style={styles.clearBtn}>
                                        <Ionicons name="close-circle" size={20} color={colors.secondaryText} />
                                    </TouchableOpacity>
                                )}
                            </TouchableOpacity>
                            <View style={[styles.underline, { backgroundColor: colors.border }]} />

                            {dueDate && (
                                <>
                                    <TouchableOpacity 
                                        style={styles.pickerRow} 
                                        onPress={() => reminderEnabled && setShowTimePicker(true)}
                                        disabled={!reminderEnabled}
                                    >
                                        <Text style={[styles.pickerText, { color: colors.text }]}>{formatTime(dueDate)}</Text>
                                        <Ionicons name="time-outline" size={22} color={colors.header} />
                                    </TouchableOpacity>
                                    <View style={[styles.underline, { backgroundColor: colors.border }]} />
                                </>
                            )}
                        </View>
                    </View>
                </ScrollView>

                {Platform.OS !== 'web' && (
                    <>
                        {showDatePicker && <DateTimePicker value={dueDate || new Date()} mode="date" display={Platform.OS === 'ios' ? 'spinner' : 'calendar'} onChange={onDateChange} />}
                        {showTimePicker && <DateTimePicker value={dueDate || new Date()} mode="time" display={Platform.OS === 'ios' ? 'spinner' : 'clock'} is24Hour={timeFormat === '24h'} onChange={onTimeChange} />}
                    </>
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
        width: 100,
        height: 44,
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 15,
        fontSize: 14,
        fontWeight: '600',
    },
    typeRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 5,
    },
    typeBtn: {
        flex: 0.48,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
        borderRadius: 12,
        borderWidth: 1.5,
        borderColor: '#e0e0e0',
    },
    typeBtnText: {
        fontSize: 14,
        fontWeight: '700',
        marginLeft: 8,
    },
    iconRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginTop: 15,
    },
    iconBtn: {
        width: '23%',
        alignItems: 'center',
        paddingVertical: 12,
        borderRadius: 12,
        borderWidth: 1.5,
        borderColor: 'transparent',
    },
    iconLabel: {
        fontSize: 9,
        fontWeight: '800',
        marginTop: 8,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
        textAlign: 'center',
    }
});
