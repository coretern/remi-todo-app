import { Ionicons } from '@expo/vector-icons';
import { Stack, useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    Alert,
    SectionList,
    SafeAreaView,
    StyleSheet,
    Platform,
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
    const { todos, toggleTodo, deleteTodo, clearHistory, completedCount } = useTodos();

    const [selectedCert, setSelectedCert] = useState<any>(null);
    const [filter, setFilter] = useState<'All' | 'Streak' | 'Normal'>('All');
    
    const formatDateHeader = (timestamp: number) => {
        const date = new Date(timestamp);
        const today = new Date();
        const yesterday = new Date();
        yesterday.setDate(today.getDate() - 1);

        if (date.toDateString() === today.toDateString()) return 'TODAY';
        if (date.toDateString() === yesterday.toDateString()) return 'YESTERDAY';

        return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'long' }).toUpperCase();
    };

    // Sort archived missions by completion date (newest first)
    const archivedMissions = todos
        .filter(t => t.isArchived)
        .sort((a, b) => (b.completedAt || 0) - (a.completedAt || 0));
    
    // Grouping Logic for Sections
    let sections: any[] = [];
    
    if (filter === 'Streak') {
        sections = [{
            title: 'STREAK REWARDS',
            data: archivedMissions.filter(t => t.type === 'streak'),
            icon: 'flame' as const,
        }];
    } else if (filter === 'Normal') {
        const normalMissions = archivedMissions.filter(t => t.type === 'normal');
        const groups = normalMissions.reduce((acc: any, todo) => {
            const dateStr = formatDateHeader(todo.completedAt || Date.now());
            if (!acc[dateStr]) acc[dateStr] = [];
            acc[dateStr].push(todo);
            return acc;
        }, {});

        sections = Object.keys(groups).map(dateTitle => ({
            title: dateTitle,
            data: groups[dateTitle],
            icon: 'calendar-outline' as const,
        }));
    } else {
        // ALL MODE: Group everything by date
        const groups = archivedMissions.reduce((acc: any, todo) => {
            const dateStr = formatDateHeader(todo.completedAt || Date.now());
            if (!acc[dateStr]) acc[dateStr] = [];
            acc[dateStr].push(todo);
            return acc;
        }, {});

        sections = Object.keys(groups).map(dateTitle => ({
            title: dateTitle,
            data: groups[dateTitle],
            icon: 'documents-outline' as const,
        }));
    }

    sections = sections.filter(section => section.data.length > 0);

    const totalCount = archivedMissions.length;

    const confirmClearHistoryPhase2 = () => {
        Alert.alert(
            "Final Warning!",
            "Are you absolutely sure? This action CANNOT be undone and will permanently wipe your entire history.",
            [
                { text: "Cancel", style: "cancel" },
                { text: "WIPE EVERYTHING", style: "destructive", onPress: clearHistory }
            ]
        );
    };

    const handleClearHistory = () => {
        if (Platform.OS === 'web') {
            if (window.confirm("Are you sure you want to delete ALL completed missions forever? This cannot be undone.")) {
                clearHistory();
            }
            return;
        }

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
        if (Platform.OS === 'web') {
            if (window.confirm(`Are you sure you want to delete "${item.task}"?`)) {
                deleteTodo(item.id);
            }
            return;
        }

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
                headerRight: () => totalCount > 0 ? (
                    <TouchableOpacity onPress={handleClearHistory} style={styles.headerAction}>
                        <Ionicons name="trash-outline" size={22} color="white" />
                    </TouchableOpacity>
                ) : null,
            }} />

            <SectionList
                sections={sections}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={false}
                stickySectionHeadersEnabled={false}
                ListHeaderComponent={
                    <View>
                        <View style={styles.header}>
                            <Text style={[styles.title, { color: colors.text }]}>Record of Glory</Text>
                            <Text style={[styles.subtitle, { color: colors.secondaryText }]}>{totalCount} Missions Archived</Text>
                        </View>
                        
                        <View style={styles.filterContainer}>
                            {(['All', 'Streak', 'Normal'] as const).map((mode) => (
                                <TouchableOpacity 
                                    key={mode}
                                    style={[
                                        styles.filterTab, 
                                        filter === mode && { backgroundColor: colors.header }
                                    ]} 
                                    onPress={() => setFilter(mode)}
                                >
                                    <Text style={[
                                        styles.filterText, 
                                        { color: filter === mode ? 'white' : colors.secondaryText }
                                    ]}>
                                        {mode === 'All' ? 'All Missions' : mode === 'Streak' ? 'Streaks' : 'Normal'}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>
                }
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <Ionicons name="documents-outline" size={60} color={colors.border} />
                        <Text style={[styles.emptyText, { color: colors.secondaryText }]}>No missions found in this category.</Text>
                    </View>
                }
                renderSectionHeader={({ section }) => (
                    <View style={[styles.sectionHeader, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
                        <Ionicons name={section.icon} size={16} color={colors.header} style={{ marginRight: 8 }} />
                        <Text style={[styles.sectionHeaderText, { color: colors.header }]}>{section.title}</Text>
                        <View style={[styles.sectionBadge, { backgroundColor: colors.header }]}>
                            <Text style={styles.sectionBadgeText}>{section.data.length}</Text>
                        </View>
                    </View>
                )}
                renderItem={({ item }) => (
                    <View style={[styles.item, { borderBottomColor: colors.border, opacity: item.isBroken ? 0.7 : 1 }]}>
                        <View style={styles.itemMain}>
                            <Ionicons 
                                name={item.isBroken ? "alert-circle-outline" : item.type === 'streak' ? "flame" : "checkmark-circle"} 
                                size={22} 
                                color={item.isBroken ? "#EF4444" : item.type === 'streak' ? "#FF7A00" : colors.header} 
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
                                
                                <Text style={[styles.statusText, { color: item.isBroken ? "#EF4444" : item.type === 'streak' ? "#FF7A00" : colors.header }]}>
                                    {item.isBroken ? "STREAK BROKEN" : item.type === 'streak' ? `COMPLETED • ${item.streakTarget} DAYS` : "MISSION DONE"}
                                </Text>

                                <Text style={[styles.dateText, { color: colors.secondaryText }]}>
                                    {item.type === 'streak' 
                                        ? `Period: ${new Date(item.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })} — ${new Date(item.completedAt || Date.now()).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}`
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

                            <TouchableOpacity 
                                onPress={() => { toggleTodo(item.id); router.back(); }} 
                                style={styles.actionBtn}
                            >
                                <Ionicons name="refresh-outline" size={18} color={colors.secondaryText} />
                            </TouchableOpacity>
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
    emptyText: { fontSize: 16, fontWeight: '700', marginTop: 20, opacity: 0.5 },
    filterContainer: {
        flexDirection: 'row',
        paddingHorizontal: 25,
        paddingBottom: 25,
        marginTop: -10,
    },
    filterTab: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        marginRight: 10,
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderColor: 'rgba(0,0,0,0.05)',
    },
    filterText: {
        fontSize: 13,
        fontWeight: '700',
    },
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        paddingHorizontal: 25,
        borderBottomWidth: 1,
        marginTop: 10,
    },
    sectionHeaderText: {
        fontSize: 12,
        fontWeight: '900',
        letterSpacing: 2,
    },
    sectionBadge: {
        marginLeft: 'auto',
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 10,
    },
    sectionBadgeText: {
        color: 'white',
        fontSize: 10,
        fontWeight: '900',
    },
});
