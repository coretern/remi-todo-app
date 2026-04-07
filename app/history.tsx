import { Ionicons } from '@expo/vector-icons';
import { Stack, useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    Alert,
    FlatList,
    SafeAreaView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    Image
} from 'react-native';
import { useTodos } from '../hooks/useTodos';
import { useTheme } from '../context/ThemeContext';
import CertificateModal from '../components/todo/CertificateModal';

export default function HistoryScreen() {
    const router = useRouter();
    const { colors, theme, timeFormat } = useTheme();
    const { todos, toggleTodo, deleteTodo, clearCompleted, completedCount } = useTodos();

    const [selectedCert, setSelectedCert] = useState<any>(null);
    const completedMissions = todos.filter(t => t.completed || t.isBroken);

    const confirmClearHistoryPhase2 = () => {
        Alert.alert(
            "Final Warning!",
            "Are you absolutely sure? This action CANNOT be undone and will permanently wipe your entire history.",
            [
                { text: "Cancel", style: "cancel" },
                { text: "WIPE EVERYTHING", style: "destructive", onPress: clearCompleted }
            ]
        );
    };

    const handleClearHistory = () => {
        Alert.alert(
            "Clear History",
            "Are you sure you want to delete all completed missions forever?",
            [
                { text: "Cancel", style: "cancel" },
                { text: "Yes, continue", style: "destructive", onPress: confirmClearHistoryPhase2 }
            ]
        );
    };

    const confirmDeleteStreakPhase2 = (id: string, taskName: string) => {
        Alert.alert(
            "Final Warning!",
            `Are you absolutely sure you want to permanently delete the streak "${taskName}"? This cannot be undone.`,
            [
                { text: "Cancel", style: "cancel" },
                { text: "Permanently Delete", style: "destructive", onPress: () => deleteTodo(id) }
            ]
        );
    };

    const handleDeleteItem = (item: any) => {
        if (item.type === 'streak') {
            Alert.alert(
                "Delete Streak",
                `Are you sure you want to delete the streak "${item.task}"?`,
                [
                    { text: "Cancel", style: "cancel" },
                    { text: "Yes, continue", style: "destructive", onPress: () => confirmDeleteStreakPhase2(item.id, item.task) }
                ]
            );
        } else {
            deleteTodo(item.id);
        }
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
            <Stack.Screen options={{
                title: 'Mission History',
                headerRight: () => completedMissions.length > 0 ? (
                    <TouchableOpacity onPress={handleClearHistory} style={styles.headerAction}>
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
                        <Text style={[styles.title, { color: colors.text }]}>Record of Glory</Text>
                        <Text style={[styles.subtitle, { color: colors.secondaryText }]}>{completedCount} Missions Accomplished</Text>
                    </View>
                }
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <Ionicons name="documents-outline" size={60} color={colors.border} />
                        <Text style={[styles.emptyText, { color: colors.secondaryText }]}>No history yet.</Text>
                    </View>
                }
                renderItem={({ item }) => (
                    <View style={[styles.item, { borderBottomColor: colors.border, opacity: item.isBroken ? 0.7 : 1 }]}>
                        <View style={styles.itemMain}>
                            <Ionicons 
                                name={item.isBroken ? "flame-outline" : "checkmark-circle-outline"} 
                                size={22} 
                                color={item.isBroken ? "#EF4444" : colors.header} 
                            />
                            <View style={styles.textContainer}>
                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    {item.icon && item.icon !== 'default' && (
                                        <Image 
                                            source={
                                                item.icon === 'youtube' ? require('../assets/icon/YouTube.jpeg') :
                                                item.icon === 'instagram' ? require('../assets/icon/Instagram.jpeg') :
                                                item.icon === 'study' ? require('../assets/icon/study.jpeg') :
                                                null
                                            } 
                                            style={{ width: 14, height: 14, marginRight: 6, borderRadius: 2 }} 
                                        />
                                    )}
                                    <Text style={[styles.taskText, { color: colors.text, textDecorationLine: item.isBroken ? 'none' : 'line-through' }]}>
                                        {item.task}
                                    </Text>
                                </View>
                                
                                <Text style={[styles.statusText, { color: item.isBroken ? "#EF4444" : colors.header }]}>
                                    {item.isBroken ? "STREAK BROKEN" : item.type === 'streak' ? "STREAK COMPLETED" : "MISSION DONE"}
                                </Text>

                                <Text style={[styles.dateText, { color: colors.secondaryText }]}>
                                    {item.type === 'streak' 
                                        ? `Timeline: ${new Date(item.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })} — ${new Date(item.completedAt || Date.now()).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}`
                                        : `Completed: ${new Date(item.completedAt || Date.now()).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })} at ${new Date(item.completedAt || Date.now()).toLocaleTimeString(timeFormat === '12h' ? 'en-US' : 'en-GB', { hour: 'numeric', minute: '2-digit', hour12: timeFormat === '12h' })}`
                                    }
                                </Text>
                            </View>
                        </View>
                        <View style={styles.actions}>
                            {item.type === 'streak' && !item.isBroken && item.completed && (
                                <TouchableOpacity 
                                    onPress={() => setSelectedCert(item)} 
                                    style={[styles.actionBtn, { marginRight: 10 }]}
                                >
                                    <Ionicons name="ribbon" size={20} color="#FFD700" />
                                </TouchableOpacity>
                            )}

                            {item.type === 'normal' && (
                                <TouchableOpacity 
                                    onPress={() => { toggleTodo(item.id); router.back(); }} 
                                    style={styles.actionBtn}
                                >
                                    <Ionicons name="refresh-outline" size={18} color={colors.secondaryText} />
                                </TouchableOpacity>
                            )}
                            <TouchableOpacity onPress={() => handleDeleteItem(item)} style={styles.actionBtn}>
                                <Ionicons name="trash-outline" size={18} color={colors.secondaryText} />
                            </TouchableOpacity>
                        </View>
                    </View>
                )}
            />

            {/* Achievement Certificate Modal 📜🏆 */}
            <CertificateModal 
                visible={!!selectedCert} 
                selectedCert={selectedCert} 
                onClose={() => setSelectedCert(null)} 
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    headerAction: { marginRight: 15, padding: 5 },
    header: { paddingVertical: 40, paddingHorizontal: 25 },
    title: { fontSize: 32, fontWeight: '900', letterSpacing: -1 },
    subtitle: { fontSize: 13, fontWeight: '800', textTransform: 'uppercase', opacity: 0.6, marginTop: 5, letterSpacing: 1 },
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
    taskText: { fontSize: 16, fontWeight: '700' },
    statusText: { fontSize: 10, fontWeight: '900', marginTop: 4, letterSpacing: 0.5 },
    dateText: { fontSize: 11, marginTop: 2, opacity: 0.5 },
    actions: { flexDirection: 'row', alignItems: 'center' },
    actionBtn: { padding: 8 },
    emptyContainer: { alignItems: 'center', marginTop: 120 },
    emptyText: { fontSize: 16, fontWeight: '700', marginTop: 20, opacity: 0.5 }
});
