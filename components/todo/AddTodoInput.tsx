import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import React, { useState } from 'react';
import { Keyboard, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

interface AddTodoInputProps {
    onAdd: (text: string, dueDate?: number) => void;
}

const AddTodoInput: React.FC<AddTodoInputProps> = ({ onAdd }) => {
    const [text, setText] = useState('');
    const [dueDate, setDueDate] = useState<Date | undefined>(undefined);
    const [showPicker, setShowPicker] = useState(false);

    const handleAdd = () => {
        if (text.trim()) {
            onAdd(text.trim(), dueDate?.getTime());
            setText('');
            setDueDate(undefined);
            setShowPicker(false);
            Keyboard.dismiss();
        }
    };

    const onChange = (event: any, selectedDate?: Date) => {
        if (event.type === 'dismissed') {
            setShowPicker(false);
            return;
        }

        if (selectedDate) {
            setDueDate(selectedDate);
            // For Android, we close on selection. For iOS spinner, we keep it open for "Submit" logic.
            if (Platform.OS === 'android') {
                setShowPicker(false);
            }
        }
    };

    const formatDate = (date: Date) => {
        return date.toLocaleString([], {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: true // Forces AM/PM format
        });
    };

    const openPicker = () => {
        if (!dueDate) {
            // Default to current time + 1 hour, rounded to next 30m
            const d = new Date();
            d.setHours(d.getHours() + 1);
            d.setMinutes(0);
            setDueDate(d);
        }
        setShowPicker(true);
    };

    return (
        <View style={styles.container}>
            <View style={styles.inputHeader}>
                {dueDate && (
                    <View style={styles.alarmIndicator}>
                        <View style={styles.alarmTag}>
                            <Ionicons name="notifications-outline" size={12} color="white" />
                            <Text style={styles.alarmText}>{formatDate(dueDate)}</Text>
                        </View>
                        <TouchableOpacity onPress={() => setDueDate(undefined)}>
                            <Ionicons name="close-circle" size={18} color="#FF6B6B" style={{ marginLeft: 6 }} />
                        </TouchableOpacity>
                    </View>
                )}
            </View>

            <View style={styles.inputRow}>
                <TextInput
                    style={styles.input}
                    placeholder="New Mission..."
                    placeholderTextColor="#999"
                    value={text}
                    onChangeText={setText}
                    onSubmitEditing={handleAdd}
                    maxLength={100}
                />

                <TouchableOpacity
                    style={[styles.actionBtn, dueDate && styles.activeBtn]}
                    onPress={openPicker}
                >
                    <Ionicons name="alarm-outline" size={24} color={dueDate ? "white" : "#666"} />
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.addButton, !text.trim() && styles.disabled]}
                    onPress={handleAdd}
                    disabled={!text.trim()}
                >
                    <Ionicons name="arrow-up" size={24} color="white" />
                </TouchableOpacity>
            </View>

            {showPicker && (
                <View style={styles.pickerBackdrop}>
                    <View style={styles.pickerContainer}>
                        <View style={styles.pickerHeader}>
                            <Text style={styles.pickerTitle}>Select Time (AM/PM)</Text>
                            <Text style={styles.pickerSubtitle}>When should the alarm go off?</Text>
                        </View>

                        {Platform.OS === 'web' ? (
                            <View style={styles.webInputWrapper}>
                                <input
                                    type="datetime-local"
                                    style={{
                                        padding: '15px',
                                        borderRadius: '15px',
                                        border: '2px solid #007AFF',
                                        width: '100%',
                                        fontSize: '18px',
                                        fontWeight: '600',
                                        color: '#333',
                                        backgroundColor: '#F8F9FA'
                                    }}
                                    defaultValue={new Date(Date.now() + 60 * 60 * 1000).toISOString().slice(0, 16)}
                                    onChange={(e) => setDueDate(new Date(e.target.value))}
                                />
                                <Text style={styles.hintText}>Tap the box to open the full AM/PM selector</Text>
                            </View>
                        ) : (
                            <DateTimePicker
                                value={dueDate || new Date()}
                                mode="datetime"
                                is24Hour={false} // THIS ADDS AM/PM OPTION
                                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                                onChange={onChange}
                                minimumDate={new Date()}
                            />
                        )}

                        <View style={styles.pickerActions}>
                            <TouchableOpacity
                                style={styles.cancelBtn}
                                onPress={() => {
                                    setShowPicker(false);
                                    if (!dueDate) setDueDate(undefined);
                                }}
                            >
                                <Text style={styles.cancelBtnText}>Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.setBtn}
                                onPress={() => setShowPicker(false)}
                            >
                                <Text style={styles.setBtnText}>Set Alarm</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
        borderRadius: 28,
        marginVertical: 12,
        marginHorizontal: 16,
        padding: 8,
        // Apple Sophisticated Shadow
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 12 },
        shadowOpacity: 0.12,
        shadowRadius: 24,
        elevation: 10,
    },
    inputHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 10,
    },
    alarmIndicator: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    alarmTag: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 122, 255, 0.1)',
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 10,
    },
    alarmText: {
        fontSize: 11,
        fontWeight: '700',
        color: '#007AFF',
        marginLeft: 4,
    },
    inputRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingLeft: 12,
    },
    input: {
        flex: 1,
        fontSize: 17,
        color: '#1C1C1E',
        paddingVertical: 12,
        fontWeight: '500',
        // @ts-ignore - Web specific
        outlineWidth: 0,
    },
    actionBtn: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: '#F2F2F7',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 8,
    },
    activeBtn: {
        backgroundColor: '#007AFF',
    },
    addButton: {
        backgroundColor: '#007AFF',
        width: 44,
        height: 44,
        borderRadius: 22,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#007AFF',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
    },
    disabled: {
        backgroundColor: '#E5E5EA',
        shadowOpacity: 0,
    },
    pickerBackdrop: {
        position: 'absolute',
        bottom: 100,
        left: 0,
        right: 0,
        alignItems: 'center',
        zIndex: 5000,
    },
    pickerContainer: {
        backgroundColor: 'white',
        borderRadius: 32,
        padding: 24,
        width: '95%',
        maxWidth: 400,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 25 },
        shadowOpacity: 0.25,
        shadowRadius: 50,
        elevation: 30,
    },
    pickerHeader: {
        marginBottom: 20,
        alignItems: 'center',
    },
    pickerTitle: {
        fontSize: 22,
        fontWeight: '800',
        color: '#000',
        letterSpacing: -0.5,
    },
    pickerSubtitle: {
        fontSize: 14,
        color: '#8E8E93',
        marginTop: 4,
    },
    webInputWrapper: {
        width: '100%',
        marginBottom: 10,
    },
    hintText: {
        fontSize: 11,
        color: '#007AFF',
        textAlign: 'center',
        marginTop: 10,
        fontWeight: '600',
    },
    pickerActions: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 25,
        gap: 12,
    },
    cancelBtn: {
        flex: 1,
        padding: 16,
        borderRadius: 16,
        backgroundColor: '#F2F2F7',
        alignItems: 'center',
    },
    cancelBtnText: {
        color: '#8E8E93',
        fontWeight: '700',
        fontSize: 15,
    },
    setBtn: {
        flex: 1,
        padding: 16,
        borderRadius: 16,
        backgroundColor: '#007AFF',
        alignItems: 'center',
    },
    setBtnText: {
        color: 'white',
        fontWeight: '700',
        fontSize: 15,
    },
});

export default AddTodoInput;
