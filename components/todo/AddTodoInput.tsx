import { Ionicons } from '@expo/vector-icons';
import React, { forwardRef, useState } from 'react';
import { Keyboard, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';

interface AddTodoInputProps {
    onAdd: (text: string) => void;
}

const AddTodoInput = forwardRef<TextInput, AddTodoInputProps>(({ onAdd }, ref) => {
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
                <Ionicons name="mic-outline" size={22} color="white" style={styles.micIcon} />
                
                <TextInput
                    ref={ref}
                    style={styles.input}
                    placeholder="Enter Quick Task Here"
                    placeholderTextColor="rgba(255,255,255,0.6)"
                    value={text}
                    onChangeText={setText}
                    onSubmitEditing={handleAdd}
                    maxLength={100}
                />

                {text.trim() && (
                    <TouchableOpacity
                        style={styles.addButton}
                        onPress={handleAdd}
                    >
                        <Ionicons name="checkmark-outline" size={24} color="white" />
                    </TouchableOpacity>
                )}
            </View>
        </View>
    );
});

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    inputRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    micIcon: {
        marginRight: 10,
        opacity: 0.7,
    },
    input: {
        flex: 1,
        fontSize: 18,
        color: 'white',
        paddingVertical: 5,
        fontWeight: '500',
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255,255,255,0.4)',
        // @ts-ignore - Web specific
        outlineWidth: 0,
    },
    addButton: {
        marginLeft: 15,
    },
});

export default AddTodoInput;
