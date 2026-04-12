// Remi Todo App - Version 1.0.2 (Stable Build)
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRouter } from 'expo-router';
import React, { useRef, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    FlatList,
    Image,
    Keyboard,
    KeyboardAvoidingView,
    LayoutAnimation,
    Modal,
    Platform,
    Share,
    StatusBar,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    UIManager,
    View
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import TodoItem from '../components/todo/TodoItem/TodoItem';
import CertificateModal from '../components/todo/CertificateModal';
import { useTheme } from '../context/ThemeContext';
import { useTodos } from '../hooks/useTodos';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
}

export default function HomeScreen() {
    const insets = useSafeAreaInsets();
    const navigation = useNavigation();
    const router = useRouter();
    const {
        todos,
        addTodo,
        toggleTodo: originalToggleTodo,
        deleteTodo: originalDeleteTodo,
        pinTodo: originalPinTodo,
        clearHistory: originalClearHistory,
        archiveCompleted: originalArchiveCompleted,
        isLoading,
        count,
        completedCount
    } = useTodos();
    const { theme, toggleTheme, colors } = useTheme();

    const [showPagesModal, setShowPagesModal] = useState(false);
    const [isSearching, setIsSearching] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);
    const [selectedCert, setSelectedCert] = useState<any>(null);

    React.useEffect(() => {
        const showSub = Keyboard.addListener(Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow', () => setIsKeyboardVisible(true));
        const hideSub = Keyboard.addListener(Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide', () => setIsKeyboardVisible(false));
        return () => {
            showSub.remove();
            hideSub.remove();
        };
    }, []);

    const toggleTodo = (id: string) => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        originalToggleTodo(id);
    };

    const deleteTodo = (id: string) => {
        const todo = todos.find(t => t.id === id);
        if (!todo) return;

        if (Platform.OS === 'web') {
            const confirmMsg = todo.type === 'streak' 
                ? "This will permanently erase your streak progress and statistics. Are you absolutely sure?" 
                : "Are you sure you want to remove this task?";
            
            if (window.confirm(confirmMsg)) {
                originalDeleteTodo(id);
            }
            return;
        }

        if (todo.type === 'streak') {
            // STREAK DOUBLE CONFIRMATION 🛡️
            Alert.alert(
                "Delete Streak?",
                "This will permanently erase your daily progress and statistics. Are you absolutely sure?",
                [
                    { text: "Cancel", style: "cancel" },
                    { 
                        text: "Yes, Delete", 
                        style: "destructive",
                        onPress: () => {
                            // FINAL SECOND CONFIRMATION 🛑
                            Alert.alert(
                                "FINAL WARNING",
                                "Progress for this streak will be wiped from your Cloud Backup. This cannot be undone!",
                                [
                                    { text: "Keep My Streak", style: "cancel" },
                                    { 
                                        text: "DELETE FOREVER", 
                                        style: "destructive",
                                        onPress: () => {
                                            LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
                                            originalDeleteTodo(id);
                                        }
                                    }
                                ]
                            );
                        }
                    }
                ]
            );
        } else {
            // NORMAL MISSION SINGLE CONFIRMATION
            Alert.alert(
                "Delete Mission?",
                "Are you sure you want to remove this task?",
                [
                    { text: "Cancel", style: "cancel" },
                    { 
                        text: "Delete", 
                        style: "destructive",
                        onPress: () => {
                            LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
                            originalDeleteTodo(id);
                        }
                    }
                ]
            );
        }
    };

    const pinTodo = (id: string) => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        originalPinTodo(id);
    };

    const clearHistory = () => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        originalClearHistory();
    };

    const archiveCompleted = () => {
        if (Platform.OS === 'web') {
            // Direct confirmation for Web to avoid browser Modal blocks
            if (window.confirm("Move all completed missions to your history record?")) {
                originalArchiveCompleted();
            }
            return;
        }

        Alert.alert(
            "Move to History?",
            "This will move all completed missions to your permanent history record. They will no longer appear in this list.",
            [
                { text: "Cancel", style: "cancel" },
                { 
                    text: "Move All", 
                    onPress: () => {
                        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
                        originalArchiveCompleted();
                    }
                }
            ]
        );
    };

    const handleShare = async () => {
        try {
            await Share.share({
                message: `I've finished ${completedCount}/${count} missions on Remi Todo! Join me: https://play.google.com/store/apps/details?id=com.remi.todoapp`,
            });
        } catch (e) {
            console.error(e);
        }
    };

    const [filter, setFilter] = useState<'Active' | 'Completed'>('Active');

    const filteredTodos = todos.filter(t => {
        if (t.isArchived) return false;
        if (isSearching && searchQuery) {
            return t.task.toLowerCase().includes(searchQuery.toLowerCase());
        }
        if (filter === 'Active') return !t.completed;
        return t.completed;
    });

    const handleFilterChange = (newFilter: 'Active' | 'Completed') => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setFilter(newFilter);
    };

    if (isLoading) {
        return (
            <View style={[styles.loadingContainer, { backgroundColor: colors.background }]}>
                <Image 
                    source={require('../assets/images/remiicon.png')} 
                    style={styles.loadingLogo}
                    resizeMode="contain"
                />
                <Text style={[styles.loadingAppName, { color: colors.header }]}>Remi Todo</Text>
                <ActivityIndicator size="small" color={colors.header} style={{ marginTop: 25 }} />
                <Text style={{ marginTop: 15, color: colors.secondaryText, fontSize: 12, fontWeight: '600', letterSpacing: 1.5 }}>LOADING MISSION...</Text>
            </View>
        );
    }

    const navigationPages = [
        { title: 'Mission History', icon: 'time-outline', path: '/history' },
        { title: 'Settings', icon: 'settings-outline', path: '/settings' },
        { title: 'Share App', icon: 'share-social-outline', path: 'share_app' },
        { title: 'Legal Info', icon: 'shield-outline', path: '/legal' },
        { title: 'About Remi', icon: 'information-circle-outline', path: '/about' },
    ];

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <View style={[styles.navBar, { backgroundColor: colors.header }]}>
                {isSearching ? (
                    <View style={[styles.searchContainer, { flex: 1 }]}>
                        <TouchableOpacity onPress={() => { setIsSearching(false); setSearchQuery(''); }}>
                            <Ionicons name="arrow-back" size={24} color="white" />
                        </TouchableOpacity>
                        <TextInput
                            style={styles.searchInput}
                            placeholder="Search missions..."
                            placeholderTextColor="rgba(255,255,255,0.6)"
                            value={searchQuery}
                            onChangeText={setSearchQuery}
                            autoFocus
                        />
                    </View>
                ) : (
                    <>
                        <View style={styles.navLeft}>
                            <Image 
                                source={require('../assets/images/icon.png')} 
                                style={styles.navLogo}
                                resizeMode="contain"
                            />
                            <Text style={styles.navTitle}>Remi Todo</Text>
                        </View>
                        <View style={styles.navRight}>
                            <TouchableOpacity style={styles.navIcon} onPress={() => setIsSearching(true)}>
                                <Ionicons name="search-outline" size={22} color="white" />
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.navIcon} onPress={() => setShowPagesModal(true)}>
                                <Ionicons name="ellipsis-vertical" size={22} color="white" />
                            </TouchableOpacity>
                        </View>
                    </>
                )}
            </View>

            {!isSearching && (
                <View style={[styles.filterContainer, { backgroundColor: colors.header }]}>
                    <TouchableOpacity 
                        style={[styles.filterTab, filter === 'Active' && styles.activeFilterTab]} 
                        onPress={() => handleFilterChange('Active')}
                    >
                        <Text style={[styles.filterText, filter === 'Active' ? styles.activeFilterText : { color: 'rgba(255,255,255,0.7)' }]}>Active</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                        style={[styles.filterTab, filter === 'Completed' && styles.activeFilterTab]} 
                        onPress={() => handleFilterChange('Completed')}
                    >
                        <Text style={[styles.filterText, filter === 'Completed' ? styles.activeFilterText : { color: 'rgba(255,255,255,0.7)' }]}>Completed</Text>
                    </TouchableOpacity>
                </View>
            )}

            <Modal
                visible={showPagesModal}
                transparent={true}
                animationType="fade"
                onRequestClose={() => setShowPagesModal(false)}
            >
                <TouchableOpacity 
                    style={styles.dropdownOverlay} 
                    activeOpacity={1} 
                    onPress={() => setShowPagesModal(false)}
                >
                    <View style={[styles.dropdownMenu, { backgroundColor: colors.surface }]}>
                        {navigationPages.map((page, index) => (
                            <TouchableOpacity 
                                key={index}
                                style={[styles.dropdownItem, { borderBottomColor: colors.border }]}
                                onPress={() => {
                                    setShowPagesModal(false);
                                    if (page.path === 'share_app') {
                                        handleShare();
                                    } else if (page.path !== '/') {
                                        // @ts-ignore
                                        navigation.navigate(page.path.replace('/', ''));
                                    }
                                }}
                            >
                                <Text style={[styles.dropdownItemText, { color: colors.text }]}>{page.title}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </TouchableOpacity>
            </Modal>

            <View style={{ flex: 1 }}>
                <FlatList
                    style={{ flex: 1 }}
                    data={filteredTodos}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                        <TodoItem
                            todo={item}
                            onToggle={toggleTodo}
                            onDelete={deleteTodo}
                            onPin={pinTodo}
                            onShowCert={setSelectedCert}
                        />
                    )}
                    ListHeaderComponent={
                        filter === 'Completed' && filteredTodos.length > 0 ? (
                            <TouchableOpacity 
                                style={[styles.archiveHeader, { backgroundColor: colors.surface, borderColor: colors.border }]}
                                onPress={archiveCompleted}
                            >
                                <Ionicons name="archive-outline" size={20} color={colors.header} />
                                <Text style={[styles.archiveHeaderText, { color: colors.header }]}>Move all to History</Text>
                            </TouchableOpacity>
                        ) : null
                    }
                    contentContainerStyle={[
                        styles.listContainer, 
                        { paddingBottom: 100 + insets.bottom } 
                    ]}
                    showsVerticalScrollIndicator={false}
                    ListEmptyComponent={
                        <View style={styles.emptyContainer}>
                            <Ionicons 
                                name={filter === 'Completed' ? "list-outline" : "checkmark-done"} 
                                size={60} 
                                color={theme === 'dark' ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.05)"} 
                            />
                            <Text style={[styles.emptyText, { color: colors.secondaryText }]}>
                                {filter === 'Active' ? 'All Missions Completed.' : 
                                 'No Completed Missions.'}
                            </Text>
                        </View>
                    }
                />

                <TouchableOpacity 
                    style={[
                        styles.fab, 
                        { 
                            backgroundColor: 'white',
                            bottom: 30 + insets.bottom
                        }
                    ]} 
                    activeOpacity={0.8}
                    onPress={() => router.push('/new-task')}
                >
                    <Ionicons name="add" size={36} color="#006EAF" />
                </TouchableOpacity>

                <CertificateModal 
                    visible={!!selectedCert} 
                    selectedCert={selectedCert} 
                    onClose={() => setSelectedCert(null)} 
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    loadingContainer: {
        height: '100%',
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    navBar: {
        height: Platform.OS === 'ios' ? 115 : 100,
        backgroundColor: '#006EAF',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 15,
        paddingTop: Platform.OS === 'ios' ? 55 : 40,
    },
    navLogo: {
        width: 32,
        height: 32,
        marginRight: 10,
        borderRadius: 8,
    },
    loadingLogo: {
        width: 100,
        height: 100,
        marginBottom: 15,
        borderRadius: 20,
    },
    loadingAppName: {
        fontSize: 28,
        fontWeight: '900',
        letterSpacing: -0.5,
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        height: '100%',
    },
    searchInput: {
        flex: 1,
        color: 'white',
        fontSize: 18,
        marginLeft: 15,
        fontWeight: '500',
    },
    navLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    navTitle: {
        color: 'white',
        fontSize: 20,
        fontWeight: '700',
    },
    navRight: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    navIcon: {
        marginLeft: 15,
        padding: 5,
    },
    listContainer: {
        paddingHorizontal: 16,
        paddingTop: 20,
        paddingBottom: 20,
    },
    fab: {
        position: 'absolute',
        bottom: 110,
        right: 20,
        width: 65,
        height: 65,
        borderRadius: 33,
        justifyContent: 'center',
        alignItems: 'center',
        boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)',
        elevation: 8,
        zIndex: 1000,
    },
    quickTaskBar: {
        backgroundColor: '#006EAF',
        minHeight: 75,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 15,
        paddingTop: 10,
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        elevation: 10, // Shadow for Android visibility
    },
    emptyContainer: {
        alignItems: 'center',
        paddingVertical: 140,
    },
    emptyText: {
        fontSize: 16,
        fontWeight: '700',
        marginTop: 20,
    },
    dropdownOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.4)', 
    },
    dropdownMenu: {
        position: 'absolute',
        top: Platform.OS === 'ios' ? 110 : 95,
        right: 10,
        width: 250,
        borderRadius: 12,
        paddingVertical: 5,
        boxShadow: '0px 10px 10px rgba(0, 0, 0, 0.3)',
        elevation: 15,
    },
    dropdownItem: {
        paddingVertical: 18,
        paddingHorizontal: 15,
        borderBottomWidth: 1,
    },
    dropdownItemText: {
        fontSize: 16,
        fontWeight: '600',
    },
    filterContainer: {
        flexDirection: 'row',
        paddingHorizontal: 15,
        paddingBottom: 10,
        height: 50,
        alignItems: 'center',
    },
    filterTab: {
        paddingHorizontal: 20,
        paddingVertical: 8,
        borderRadius: 20,
        marginRight: 10,
    },
    activeFilterTab: {
        backgroundColor: 'rgba(255,255,255,0.2)',
    },
    filterText: {
        fontSize: 14,
        fontWeight: '700',
    },
    activeFilterText: {
        color: 'white',
    },
    archiveHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
        borderRadius: 12,
        marginBottom: 15,
        borderWidth: 1,
        borderStyle: 'dashed',
    },
    archiveHeaderText: {
        fontSize: 14,
        fontWeight: '700',
        marginLeft: 8,
    },
});
