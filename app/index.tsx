import { Ionicons } from '@expo/vector-icons';
import { DrawerActions } from '@react-navigation/native';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import {
    ActivityIndicator,
    Animated,
    Dimensions,
    KeyboardAvoidingView,
    LayoutAnimation,
    Platform,
    SafeAreaView,
    Share,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    UIManager,
    View,
} from 'react-native';
import ConfettiCannon from 'react-native-confetti-cannon';
import AddTodoInput from '../components/todo/AddTodoInput';
import TodoItem from '../components/todo/TodoItem/TodoItem';
import { useTodos } from '../hooks/useTodos';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
}

const { width } = Dimensions.get('window');

export default function HomeScreen() {
    const navigation = useNavigation();
    const {
        todos,
        addTodo,
        toggleTodo: originalToggleTodo,
        deleteTodo: originalDeleteTodo,
        clearCompleted: originalClearCompleted,
        isLoading,
        count,
        completedCount
    } = useTodos();

    const [showConfetti, setShowConfetti] = useState(false);

    // Watch for "All Accomplished" moment
    useEffect(() => {
        if (count > 0 && completedCount === count) {
            setShowConfetti(true);
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            setTimeout(() => setShowConfetti(false), 5000);
        }
    }, [completedCount, count]);

    const handleOpenDrawer = () => {
        navigation.dispatch(DrawerActions.openDrawer());
    };

    const handleAdd = (text: string, due?: number) => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        addTodo(text, due);
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    };

    const toggleTodo = (id: string) => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        originalToggleTodo(id);
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    };

    const deleteTodo = (id: string) => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        originalDeleteTodo(id);
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    };

    const clearCompleted = () => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        originalClearCompleted();
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    };

    const handleShare = async () => {
        try {
            await Share.share({
                message: `I've finished ${completedCount}/${count} missions on Remi Todo! Join me: https://play.google.com/store/apps/details?id=com.monitorweb.remitodo`,
            });
        } catch (e) {
            console.error(e);
        }
    };

    const [filter, setFilter] = useState<'All' | 'Active' | 'Completed'>('All');
    const scrollY = useRef(new Animated.Value(0)).current;

    const filteredTodos = todos.filter(t => {
        if (filter === 'Active') return !t.completed;
        if (filter === 'Completed') return t.completed;
        return true;
    });

    // Dashboard Header Animation (GPU-Driven)
    const headerTranslateY = scrollY.interpolate({
        inputRange: [0, 100],
        outputRange: [0, -110],
        extrapolate: 'clamp'
    });

    const headerContentScale = scrollY.interpolate({
        inputRange: [0, 100],
        outputRange: [1, 0.85],
        extrapolate: 'clamp'
    });

    const headerTitleOpacity = scrollY.interpolate({
        inputRange: [0, 80],
        outputRange: [1, 0],
        extrapolate: 'clamp'
    });

    if (isLoading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#007AFF" />
            </View>
        );
    }

    const completionPercentage = count > 0 ? (completedCount / count) * 100 : 0;

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" />

            {/* Premium iPhone-Style Header */}
            <Animated.View style={[
                styles.dashboardHeader,
                { transform: [{ translateY: headerTranslateY }] }
            ]}>
                <LinearGradient
                    colors={['#007AFF', '#0055D4']}
                    style={StyleSheet.absoluteFill}
                />

                <SafeAreaView style={{ flex: 1 }}>
                    <View style={styles.headerTopBar}>
                        <TouchableOpacity onPress={handleOpenDrawer} style={styles.menuBtn}>
                            <Ionicons name="menu" size={26} color="white" />
                        </TouchableOpacity>

                        <View style={styles.headerActions}>
                            <TouchableOpacity style={styles.iconBtn} onPress={handleShare}>
                                <Ionicons name="share-social-outline" size={20} color="white" />
                            </TouchableOpacity>
                            <TouchableOpacity style={[styles.iconBtn, { backgroundColor: 'rgba(255,255,255,0.2)' }]} onPress={clearCompleted}>
                                <Ionicons name="sparkles-outline" size={20} color="white" />
                            </TouchableOpacity>
                        </View>
                    </View>

                    <Animated.View style={{
                        opacity: headerTitleOpacity,
                        transform: [{ scale: headerContentScale }],
                        paddingHorizontal: 25
                    }}>
                        <Text style={styles.dateLabel}>{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</Text>
                        <View style={styles.titleRow}>
                            <Text style={styles.appName}>Missions</Text>
                            <View style={styles.badge}>
                                <Text style={styles.badgeText}>{completedCount}/{count}</Text>
                            </View>
                        </View>

                        {/* Sleek Integrated Progress */}
                        <View style={styles.progressSection}>
                            <View style={styles.progressInfo}>
                                <Text style={styles.progressLabel}>Daily Progress</Text>
                                <Text style={styles.progressPercent}>{Math.round(completionPercentage)}%</Text>
                            </View>
                            <View style={styles.miniProgressContainer}>
                                <View style={[styles.miniProgressBar, { width: `${completionPercentage}%` }]} />
                            </View>
                        </View>
                    </Animated.View>
                </SafeAreaView>
            </Animated.View>

            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={{ flex: 1 }}
            >
                {/* List Section */}
                <Animated.FlatList
                    data={filteredTodos}
                    keyExtractor={(item) => item.id}
                    onScroll={Animated.event(
                        [{ nativeEvent: { contentOffset: { y: scrollY } } }],
                        { useNativeDriver: true }
                    )}
                    renderItem={({ item }) => (
                        <TodoItem
                            todo={item}
                            onToggle={toggleTodo}
                            onDelete={deleteTodo}
                        />
                    )}
                    contentContainerStyle={styles.listContainer}
                    showsVerticalScrollIndicator={false}
                    scrollEventThrottle={16}
                    ListHeaderComponent={
                        <View>
                            <View style={styles.headerSpacer} />
                            {/* iOS Segmented Control Style Filter */}
                            <View style={styles.segmentedContainer}>
                                <View style={styles.segmentedControl}>
                                    {(['All', 'Active', 'Completed'] as const).map(f => (
                                        <TouchableOpacity
                                            key={f}
                                            onPress={() => {
                                                LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
                                                setFilter(f);
                                            }}
                                            style={[styles.segmentTab, filter === f && styles.activeSegmentTab]}
                                        >
                                            <Text style={[styles.segmentText, filter === f && styles.activeSegmentText]}>{f}</Text>
                                        </TouchableOpacity>
                                    ))}
                                </View>
                            </View>
                        </View>
                    }
                    windowSize={5}
                    initialNumToRender={10}
                    removeClippedSubviews={Platform.OS === 'android'}
                    ListEmptyComponent={
                        <View style={styles.emptyContainer}>
                            <Ionicons name="document-text-outline" size={60} color="#DDD" />
                            <Text style={styles.emptyText}>No {filter.toLowerCase()} missions found.</Text>
                        </View>
                    }
                />

                {/* Floating Input Area (Floats above Navbar) */}
                <View style={styles.inputWrapper}>
                    <AddTodoInput onAdd={handleAdd} />
                </View>

                {/* iPhone-Style Floating Glassy Navbar */}
                <View style={styles.glassNav}>
                    <TouchableOpacity style={styles.navTab} onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}>
                        <Ionicons name="grid" size={24} color="#007AFF" />
                        <Text style={[styles.navLabel, { color: '#007AFF' }]}>Missions</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.navTab} onPress={() => {
                        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                        navigation.navigate('history' as never);
                    }}>
                        <Ionicons name="time-outline" size={24} color="#8E8E93" />
                        <Text style={styles.navLabel}>History</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.navTab} onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}>
                        <Ionicons name="stats-chart-outline" size={24} color="#8E8E93" />
                        <Text style={styles.navLabel}>Insights</Text>
                    </TouchableOpacity>
                </View>

                {/* Celebration Overlay */}
                {showConfetti && (
                    <View style={StyleSheet.absoluteFill} pointerEvents="none">
                        <ConfettiCannon
                            count={200}
                            origin={{ x: Dimensions.get('window').width / 2, y: -20 }}
                            fadeOut={true}
                        />
                    </View>
                )}
            </KeyboardAvoidingView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F2F2F7', // iOS Light Gray Background
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    dashboardHeader: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: 195,
        borderBottomLeftRadius: 32,
        borderBottomRightRadius: 32,
        overflow: 'hidden',
        // iOS Sophisticated Shadow
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.15,
        shadowRadius: 20,
        elevation: 15,
        zIndex: 1000,
    },
    headerTopBar: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: Platform.OS === 'ios' ? 10 : 40,
        paddingHorizontal: 20,
        marginBottom: 5,
    },
    menuBtn: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(255, 255, 255, 0.15)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    headerSpacer: {
        height: 195,
    },
    dateLabel: {
        fontSize: 11,
        fontWeight: '700',
        color: 'rgba(255,255,255,0.6)',
        textTransform: 'uppercase',
        letterSpacing: 2,
        marginBottom: 4,
    },
    titleRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    appName: {
        fontSize: 32,
        fontWeight: '800',
        color: 'white',
        letterSpacing: -0.5,
    },
    badge: {
        backgroundColor: 'rgba(255,255,255,0.2)',
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 8,
        marginLeft: 12,
    },
    badgeText: {
        color: 'white',
        fontSize: 14,
        fontWeight: '700',
    },
    progressSection: {
        marginTop: 20,
    },
    progressInfo: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    progressLabel: {
        fontSize: 12,
        color: 'rgba(255,255,255,0.8)',
        fontWeight: '600',
    },
    progressPercent: {
        fontSize: 12,
        color: 'white',
        fontWeight: '800',
    },
    miniProgressContainer: {
        height: 6,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        borderRadius: 3,
        overflow: 'hidden',
    },
    miniProgressBar: {
        height: '100%',
        backgroundColor: '#34C759', // Success Green
    },
    headerActions: {
        flexDirection: 'row',
    },
    iconBtn: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(255, 255, 255, 0.15)',
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: 10,
    },
    segmentedContainer: {
        paddingHorizontal: 20,
        marginTop: 20,
        marginBottom: 10,
    },
    segmentedControl: {
        flexDirection: 'row',
        backgroundColor: '#E3E3E8',
        borderRadius: 12,
        padding: 2,
    },
    segmentTab: {
        flex: 1,
        paddingVertical: 8,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 10,
    },
    activeSegmentTab: {
        backgroundColor: 'white',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.12,
        shadowRadius: 4,
        elevation: 2,
    },
    segmentText: {
        fontSize: 13,
        fontWeight: '600',
        color: '#636366',
    },
    activeSegmentText: {
        color: '#000',
        fontWeight: '700',
    },
    listContainer: {
        paddingHorizontal: 16,
        paddingBottom: 180, // Extra space for navbar + input
    },
    inputWrapper: {
        position: 'absolute',
        bottom: 100,
        left: 0,
        right: 0,
        zIndex: 2000,
    },
    glassNav: {
        position: 'absolute',
        bottom: 30,
        left: 20,
        right: 20,
        height: 70,
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        borderRadius: 35,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around',
        paddingHorizontal: 10,
        // iOS Glass Shadow
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.1,
        shadowRadius: 20,
        elevation: 10,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.5)',
        zIndex: 3000,
    },
    navTab: {
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
    },
    navLabel: {
        fontSize: 10,
        fontWeight: '700',
        color: '#8E8E93',
        marginTop: 4,
    },
    emptyContainer: {
        marginTop: 60,
        alignItems: 'center',
    },
    emptyText: {
        color: '#999',
        fontSize: 16,
        fontWeight: '500',
        marginTop: 12,
    },
});
