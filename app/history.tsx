// Remi Todo App - History & Elite Achievement Screen
import { Ionicons } from '@expo/vector-icons';
import { Stack, useRouter } from 'expo-router';
import React, { useState, useRef } from 'react';
import {
    Alert,
    FlatList,
    Modal,
    SafeAreaView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    Dimensions,
    ScrollView,
    Image
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import ViewShot, { captureRef } from 'react-native-view-shot';
import * as MediaLibrary from 'expo-media-library';
import { useTodos } from '../hooks/useTodos';
import { useTheme } from '../context/ThemeContext';

const { width, height } = Dimensions.get('window');
const CERT_WIDTH = width * 0.85;
const QR_IMAGE = require('../assets/images/remi-todo-qr-url.jpeg');

export default function HistoryScreen() {
    const router = useRouter();
    const viewRef = useRef<any>(null);
    const { colors, theme, timeFormat } = useTheme();
    const { todos, toggleTodo, deleteTodo, clearCompleted, completedCount } = useTodos();

    const [selectedCert, setSelectedCert] = useState<any>(null);
    const [isSaving, setIsSaving] = useState(false);

    const completedMissions = todos.filter(t => t.completed || t.isBroken);

    const handleDownload = async () => {
        if (!viewRef.current) return;
        
        setIsSaving(true);
        try {
            const { status, canAskAgain } = await MediaLibrary.getPermissionsAsync();
            let finalStatus = status;
            if (status !== 'granted' && canAskAgain) {
                const { status: newStatus } = await MediaLibrary.requestPermissionsAsync(false);
                finalStatus = newStatus;
            }

            if (finalStatus !== 'granted') {
                Alert.alert("Permission Required", "Please enable Gallery access in settings to save your achievement.");
                setIsSaving(false);
                return;
            }

            // Capture High-Definition JPG 📸
            const uri = await captureRef(viewRef, {
                format: 'jpg',
                quality: 1.0,
            });

            await MediaLibrary.saveToLibraryAsync(uri);
            Alert.alert("Victory Saved! ✅", "Your professional certificate has been added to your gallery! Excellent work!");
        } catch (error) {
            console.error(error);
            Alert.alert("Save Error", "Could not save to gallery. Please check your storage settings.");
        } finally {
            setIsSaving(false);
        }
    };

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
                                        <Ionicons 
                                            name={item.icon === 'youtube' ? 'logo-youtube' : 'logo-instagram'} 
                                            size={12} 
                                            color={item.icon === 'youtube' ? '#FF0000' : '#E1306C'} 
                                            style={{ marginRight: 6 }}
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
                            <TouchableOpacity onPress={() => deleteTodo(item.id)} style={styles.actionBtn}>
                                <Ionicons name="trash-outline" size={18} color={colors.secondaryText} />
                            </TouchableOpacity>
                        </View>
                    </View>
                )}
            />

            {/* Achievement Certificate Modal 📜🏆 */}
            <Modal
                visible={!!selectedCert}
                transparent={true}
                animationType="fade"
                onRequestClose={() => setSelectedCert(null)}
            >
                <View style={styles.modalOverlay}>
                    <TouchableOpacity style={styles.dismissOverlay} activeOpacity={1} onPress={() => setSelectedCert(null)} />
                    
                    <ScrollView 
                        style={{ width: '100%' }}
                        contentContainerStyle={styles.modalScroll}
                        showsVerticalScrollIndicator={false}
                    >
                        <ViewShot ref={viewRef} options={{ format: 'jpg', quality: 1.0 }}>
                            <LinearGradient
                                colors={['#1A1A1A', '#000000']}
                                style={styles.certCard}
                            >
                                <View style={styles.certBorder}>
                                    <View style={styles.certInner}>
                                        <View style={styles.brandingHeader}>
                                            <View style={styles.qrHeaderRow}>
                                                <Image source={QR_IMAGE} style={styles.qrHeaderImageOnly} />
                                                <View style={styles.headerTitleCol}>
                                                    <Text style={styles.headerBrandName}>REMI TODO</Text>
                                                    <Text style={styles.headerBrandSub}>Pro Mission Tracker</Text>
                                                </View>
                                            </View>
                                            <Ionicons name="ribbon" size={44} color="#FFD700" />
                                        </View>

                                        <View style={styles.titleGroup}>
                                            <Text style={styles.certTitle}>CERTIFICATE</Text>
                                            <Text style={styles.certSubtitle}>OF MISSION MASTERY</Text>
                                        </View>
                                        
                                        <View style={styles.certPresentedCol}>
                                            <Text style={styles.certPresented}>This is proudly presented to</Text>
                                            <Text style={styles.userNameText}>{selectedCert?.userName || 'A Champion'}</Text>
                                        </View>
                                        
                                        <Text style={styles.certBodyMain}>
                                            Successfully completed <Text style={{ color: '#FFD700', fontWeight: '900' }}>{selectedCert?.streakTarget} DAY STREAK</Text> from {new Date(selectedCert?.createdAt || 0).toLocaleDateString('en-GB', { day: 'numeric', month: 'long' })} to {new Date(selectedCert?.completedAt || 0).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })} on {selectedCert?.task}
                                        </Text>

                                        <View style={styles.sealFooterRow}>
                                            <Ionicons name="shield-checkmark" size={24} color="#FFD700" />
                                            <View style={styles.sealTextCol}>
                                                <Text style={styles.sealText}>OFFICIAL REMI ACHIEVEMENT</Text>
                                                <Text style={styles.sealUrlText}>www.remi-todo-app.vercel.app</Text>
                                            </View>
                                        </View>
                                    </View>
                                </View>
                            </LinearGradient>
                        </ViewShot>

                        {/* Actions Bar */}
                        <View style={styles.certButtons}>
                            <TouchableOpacity style={styles.btnClose} onPress={() => setSelectedCert(null)}>
                                <Ionicons name="close" size={24} color="white" />
                            </TouchableOpacity>
                            
                            <TouchableOpacity 
                                style={styles.btnDownload} 
                                onPress={handleDownload}
                                disabled={isSaving}
                            >
                                <Ionicons name={isSaving ? "sync" : "save-outline"} size={24} color="#000" />
                            </TouchableOpacity>
                        </View>
                    </ScrollView>
                </View>
            </Modal>
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
    
    // Modal & Certificate Styling
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.95)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    dismissOverlay: {
        position: 'absolute',
        top: 0, left: 0, right: 0, bottom: 0
    },
    modalScroll: {
        alignItems: 'center',
        paddingVertical: 50,
        paddingHorizontal: 20
    },
    certCard: {
        width: CERT_WIDTH,
        aspectRatio: 0.8,
        borderRadius: 24,
        padding: 8,
        justifyContent: 'center',
        backgroundColor: '#000',
        elevation: 10,
        shadowColor: '#FFD700',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.2,
        shadowRadius: 20
    },
    certBorder: {
        flex: 1,
        borderWidth: 2,
        borderColor: '#FFD700',
        padding: 4,
        borderRadius: 20,
    },
    certInner: {
        flex: 1,
        padding: 18,
        borderRadius: 16,
        alignItems: 'center',
        backgroundColor: 'transparent',
        justifyContent: 'space-between'
    },
    brandingHeader: {
        flexDirection: 'row',
        width: '100%',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    qrHeaderRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    qrHeaderImageOnly: {
        width: 60,
        height: 60,
    },
    headerTitleCol: {
        marginLeft: 12
    },
    headerBrandName: {
        color: '#FFD700',
        fontSize: 18,
        fontWeight: '900',
        letterSpacing: 1
    },
    headerBrandSub: {
        color: 'rgba(255,255,255,0.6)',
        fontSize: 8,
        fontWeight: '800',
        textTransform: 'uppercase',
        letterSpacing: 0.5
    },
    titleGroup: {
        alignItems: 'center',
    },
    certTitle: {
        color: '#FFD700',
        fontSize: 32,
        fontWeight: '900',
        letterSpacing: 5
    },
    certSubtitle: {
        color: 'white',
        fontSize: 10,
        fontWeight: '800',
        letterSpacing: 3,
        marginTop: 4
    },
    certPresentedCol: {
        alignItems: 'center',
    },
    certPresented: {
        color: 'rgba(255,255,255,0.6)',
        fontSize: 9,
        fontWeight: '700',
        textTransform: 'uppercase',
        letterSpacing: 1
    },
    userNameText: {
        color: 'white',
        fontSize: 24,
        fontWeight: '900',
        marginVertical: 4,
        textTransform: 'uppercase',
        textAlign: 'center'
    },
    certBodyMain: {
        color: 'white',
        fontSize: 13,
        textAlign: 'center',
        lineHeight: 22,
        marginHorizontal: 5,
        fontWeight: '700',
    },
    sealFooterRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 8
    },
    sealTextCol: {
        marginLeft: 8,
    },
    sealText: {
        color: '#FFD700',
        fontSize: 10,
        fontWeight: '900',
        letterSpacing: 1
    },
    sealUrlText: {
        color: 'rgba(255,215,0,0.6)',
        fontSize: 8,
        fontWeight: '800',
        marginTop: 2,
        letterSpacing: 0.5
    },
    certButtons: {
        flexDirection: 'row',
        width: CERT_WIDTH,
        justifyContent: 'space-between',
        marginTop: 30,
        alignItems: 'center'
    },
    btnClose: {
        width: 50,
        height: 50,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 25,
        backgroundColor: 'rgba(255,255,255,0.1)'
    },
    btnDownload: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: '#FFD700',
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 5,
        shadowColor: '#FFD700',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8
    },
});
