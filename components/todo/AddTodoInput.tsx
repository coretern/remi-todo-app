import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Keyboard, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';

interface AddTodoInputProps {
    onAdd: (text: string) => void;
}

const AddTodoInput: React.FC<AddTodoInputProps> = ({ onAdd }) => {
    const [text, setText] = useState('');

    const handleAdd = () => {
        if (text.trim()) {
            onAdd(text.trim());
            setText('');
            Keyboard.dismiss();
        }
    };

    return (
        <View style={styles.container}>
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
                    style={[styles.addButton, !text.trim() && styles.disabled]}
                    onPress={handleAdd}
                    disabled={!text.trim()}
                >
                    <Ionicons name="arrow-up" size={24} color="white" />
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        borderRadius: 24,
        marginVertical: 8,
        marginHorizontal: 12,
        paddingHorizontal: 18,
        paddingVertical: 12,
        borderWidth: 1,
        borderColor: 'rgba(0, 0, 0, 0.05)',
        // Sophisticated Glassmorphism Shadow
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.08,
        shadowRadius: 20,
        elevation: 8,
    },
    inputRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    input: {
        flex: 1,
        fontSize: 16,
        color: '#1C1C1E',
        paddingVertical: 8,
        fontWeight: '500',
        // @ts-ignore - Web specific
        outlineWidth: 0,
    },
    addButton: {
        backgroundColor: '#007AFF',
        width: 42,
        height: 42,
        borderRadius: 21,
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: 12,
        shadowColor: '#007AFF',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.25,
        shadowRadius: 8,
    },
    disabled: {
        backgroundColor: '#E5E5EA',
        shadowOpacity: 0,
    },
});

export default AddTodoInput;
