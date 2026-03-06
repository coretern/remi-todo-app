import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
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

export default function HistoryScreen() {
    const router = useRouter();
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
        <View style={styles.mainContainer}>
            <SafeAreaView style={styles.container}>
                <Stack.Screen options={{
                    title: 'Mission History',
                    headerShown: true,
                    headerLeft: () => (
                        <TouchableOpacity
                            onPress={() => router.replace('/')}
                            style={styles.backButton}
                            activeOpacity={0.7}
                        >
                            <Ionicons name="arrow-back" size={24} color="white" />
                        </TouchableOpacity>
                    ),
                    headerRight: () => completedMissions.length > 0 && (
                        <TouchableOpacity
                            onPress={handleClearHistory}
                            style={styles.headerAction}
                        >
                            <Ionicons name="trash-outline" size={22} color="white" />
                        </TouchableOpacity>
                    ),
                    headerStyle: { backgroundColor: '#2ED573' }, // Success Green for History
                    headerTintColor: 'white',
                }} />

                <View style={styles.statsBar}>
                    <LinearGradient
                        colors={['#2ED573', '#1ea353']}
                        style={styles.statsGradient}
                    />
                    <View style={styles.statsContent}>
                        <Text style={styles.statsTitle}>Missions Accomplished</Text>
                        <Text style={styles.statsNumber}>{completedCount}</Text>
                    </View>
                    <Ionicons name="trophy" size={50} color="rgba(255,255,255,0.3)" style={styles.statsIcon} />
                </View>

                <FlatList
                    data={completedMissions}
                    keyExtractor={(item) => item.id}
                    contentContainerStyle={styles.listContent}
                    renderItem={({ item }) => {
                        const formatDate = (ts: number) => new Date(ts).toLocaleString([], {
                            month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
                        });

                        return (
                            <View style={styles.historyItem}>
                                <View style={[styles.itemMain, { paddingVertical: 18, paddingLeft: 16 }]}>
                                    <View style={styles.checkedIcon}>
                                        <Ionicons name="checkmark-circle" size={26} color="#2ED573" />
                                    </View>
                                    <View style={styles.itemText}>
                                        <Text style={styles.taskText}>{item.task}</Text>
                                        <View style={styles.timeAudit}>
                                            <Text style={styles.dateText}>
                                                <Ionicons name="add-circle-outline" size={10} color="#999" /> Created: {formatDate(item.createdAt)}
                                            </Text>
                                            <Text style={styles.dateText}>
                                                <Ionicons name="checkmark-done" size={10} color="#2ED573" /> Finished: {item.completedAt ? formatDate(item.completedAt) : formatDate(item.createdAt)}
                                            </Text>
                                        </View>
                                    </View>
                                </View>

                                <View style={styles.itemActions}>
                                    <TouchableOpacity
                                        onPress={() => toggleTodo(item.id)}
                                        style={styles.restoreBtn}
                                    >
                                        <Ionicons name="refresh" size={22} color="#666" />
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        onPress={() => deleteTodo(item.id)}
                                        style={styles.deleteBtn}
                                    >
                                        <Ionicons name="close-circle" size={22} color="#FF6B6B" />
                                    </TouchableOpacity>
                                </View>
                            </View>
                        );
                    }}
                    ListEmptyComponent={
                        <View style={styles.emptyContainer}>
                            <Ionicons name="receipt-outline" size={80} color="#DDD" />
                            <Text style={styles.emptyTitle}>No History Found</Text>
                            <Text style={styles.emptySubtitle}>Complete some missions to build your legacy!</Text>
                        </View>
                    }
                />
            </SafeAreaView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8F9FA',
    },
    backButton: {
        marginLeft: 16,
        padding: 8,
    },
    headerAction: {
        marginRight: 16,
        padding: 8,
    },
    statsBar: {
        height: 120,
        margin: 20,
        borderRadius: 24,
        overflow: 'hidden',
        flexDirection: 'row',
        alignItems: 'center',
        padding: 24,
        elevation: 8,
        shadowColor: '#2ED573',
        shadowOpacity: 0.2,
        shadowRadius: 15,
    },
    statsGradient: {
        ...StyleSheet.absoluteFillObject,
    },
    statsContent: {
        flex: 1,
    },
    statsTitle: {
        color: 'rgba(255,255,255,0.8)',
        fontSize: 14,
        fontWeight: '600',
    },
    statsNumber: {
        color: 'white',
        fontSize: 36,
        fontWeight: '900',
    },
    statsIcon: {
        position: 'absolute',
        right: 20,
        top: 30,
    },
    listContent: {
        padding: 20,
        paddingTop: 0,
        paddingBottom: 40, // Reduced space now that navbar is gone
    },
    mainContainer: {
        flex: 1,
        backgroundColor: '#F8F9FA',
    },
    historyItem: {
        backgroundColor: 'white',
        borderRadius: 20,
        marginBottom: 12,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        shadowColor: '#000',
        shadowOpacity: 0.03,
        shadowRadius: 10,
        elevation: 1,
    },
    itemMain: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    checkedIcon: {
        marginRight: 12,
    },
    itemText: {
        flex: 1,
    },
    taskText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
        textDecorationLine: 'line-through',
        opacity: 0.6,
    },
    timeAudit: {
        marginTop: 6,
        gap: 2,
    },
    dateText: {
        fontSize: 10,
        color: '#BBB',
        fontWeight: '400',
        letterSpacing: 0.2,
    },
    itemActions: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingRight: 10,
    },
    restoreBtn: {
        padding: 8,
        marginRight: 4,
    },
    deleteBtn: {
        padding: 8,
    },
    emptyContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 60,
        paddingHorizontal: 40,
    },
    emptyTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: '#333',
        marginTop: 20,
    },
    emptySubtitle: {
        fontSize: 14,
        color: '#999',
        textAlign: 'center',
        marginTop: 8,
        lineHeight: 20,
    },
});
