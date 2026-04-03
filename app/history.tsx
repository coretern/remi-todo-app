// Remi Todo App - History Screen (Stable Build)
import { Ionicons } from '@expo/vector-icons';
import { Stack, useRouter } from 'expo-router';
import React from 'react';
import {
    Alert,
    FlatList,
    SafeAreaView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { useTodos } from '../hooks/useTodos';
import { useTheme } from '../context/ThemeContext';

export default function HistoryScreen() {
    const router = useRouter();
    const { colors, timeFormat } = useTheme();
    const { todos, toggleTodo, deleteTodo, clearCompleted, completedCount } = useTodos();

    const completedMissions = todos.filter(t => t.completed);

    const handleClearHistory = () => {
        Alert.alert(
            "Clear History",
            "Are you sure you want to delete all completed missions forever?",
            [
                { text: "Cancel", style: "cancel" },
                { text: "Delete All", style: "destructive", onPress: clearCompleted }
            ]
        );
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
            {/* Note: headerRight is now handled in the layout for state integrity, or keep it here if local only */}
            <Stack.Screen options={{
                headerRight: () => completedMissions.length > 0 ? (
                    <TouchableOpacity
                        onPress={handleClearHistory}
                        style={styles.headerAction}
                    >
                        <Ionicons name="trash-outline" size={22} color="white" />
                    </TouchableOpacity>
                ) : null,
            }} />

            <FlatList
                data={completedMissions}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={false}
                ListHeaderComponent={
                    <View style={styles.header}>
                        <Text style={[styles.title, { color: colors.text }]}>Mission History</Text>
                        <Text style={[styles.subtitle, { color: colors.secondaryText }]}>{completedCount} Accomplished</Text>
                    </View>
                }
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <Text style={[styles.emptyText, { color: colors.secondaryText }]}>No history yet.</Text>
                    </View>
                }
                renderItem={({ item }) => (
                    <View style={[styles.item, { borderBottomColor: colors.border }]}>
                        <View style={styles.itemMain}>
                            <Ionicons name="checkmark-circle-outline" size={20} color={colors.header} />
                            <View style={styles.textContainer}>
                                <Text style={[styles.taskText, { color: colors.text }]}>{item.task}</Text>
                                <Text style={[styles.dateText, { color: colors.secondaryText }]}>
                                    Finished {new Date(item.completedAt || item.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric' })} at {new Date(item.completedAt || item.createdAt).toLocaleTimeString(timeFormat === '12h' ? 'en-US' : 'en-GB', { 
                                        hour: 'numeric', 
                                        minute: '2-digit',
                                        hour12: timeFormat === '12h'
                                    })}
                                </Text>
                            </View>
                        </View>
                        <View style={styles.actions}>
                            <TouchableOpacity 
                                onPress={() => { toggleTodo(item.id); router.replace('/'); }} 
                                style={styles.actionBtn}
                            >
                                <Ionicons name="refresh-outline" size={18} color={colors.secondaryText} />
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => deleteTodo(item.id)} style={styles.actionBtn}>
                                <Ionicons name="trash-outline" size={18} color={colors.secondaryText} />
                            </TouchableOpacity>
                        </View>
                    </View>
                )}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    backButton: { marginLeft: 15, padding: 5 },
    headerAction: { marginRight: 15, padding: 5 },
    header: { paddingVertical: 35, paddingHorizontal: 25 },
    title: { fontSize: 32, fontWeight: '800' },
    subtitle: { fontSize: 13, fontWeight: '700', textTransform: 'uppercase', opacity: 0.6, marginTop: 5 },
    listContent: { paddingBottom: 40 },
    item: { 
        flexDirection: 'row', 
        alignItems: 'center', 
        justifyContent: 'space-between', 
        paddingVertical: 18, 
        paddingHorizontal: 25,
        borderBottomWidth: 1 
    },
    itemMain: { flexDirection: 'row', alignItems: 'center', flex: 1 },
    textContainer: { marginLeft: 15, flex: 1 },
    taskText: { fontSize: 15, fontWeight: '600', opacity: 0.7, textDecorationLine: 'line-through' },
    dateText: { fontSize: 12, marginTop: 2, opacity: 0.5 },
    actions: { flexDirection: 'row', marginLeft: 10 },
    actionBtn: { 
        flexDirection: 'row',
        alignItems: 'center',
        padding: 8, 
        marginLeft: 5 
    },
    emptyContainer: { alignItems: 'center', marginTop: 100 },
    emptyText: { fontSize: 16, fontWeight: '600' },
});
