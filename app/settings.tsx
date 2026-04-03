import { Ionicons } from '@expo/vector-icons';
import { Stack, useRouter } from 'expo-router';
import React, { useState, useEffect } from 'react';
import {
    Modal,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    ActivityIndicator,
    Alert,
    TextInput,
} from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as AuthSession from 'expo-auth-session';
import { useTheme } from '../context/ThemeContext';
import { useTodoContext } from '../context/TodoContext';
import { SyncService } from '../services/SyncService';

WebBrowser.maybeCompleteAuthSession();

export default function SettingsScreen() {
    const router = useRouter();
    const { theme, toggleTheme, colors, timeFormat, toggleTimeFormat } = useTheme();
    const { todos, syncWithCloud } = useTodoContext();

    const [selectedEmail, setSelectedEmail] = useState<string | null>(null);
    const [syncMode, setSyncMode] = useState<'Auto' | 'Manual' | 'Off'>('Off');
    const [isSyncing, setIsSyncing] = useState(false);
    
    const [showSyncModal, setShowSyncModal] = useState(false);
    const [showTimeModal, setShowTimeModal] = useState(false);

    // Google Sign-In Configuration: Official Native Android Flow (Simplified Final Polish)
    const [request, response, promptAsync] = Google.useAuthRequest({
        androidClientId: '76113847872-sh64cu11m2mekqaaggslht2alsqlb3k1.apps.googleusercontent.com',
        redirectUri: AuthSession.makeRedirectUri({
            scheme: 'com.remi.todoapp',
        }),
    });

    useEffect(() => {
        if (response?.type === 'success') {
            const { authentication } = response;
            if (authentication?.accessToken) {
                getUserInfo(authentication.accessToken);
            }
        } else if (response?.type === 'error' || response?.type === 'cancel') {
            setIsSyncing(false);
            if (response?.type === 'error' ) {
                 console.log("Auth Error Details:", response);
                 Alert.alert("Sync Issue", "Could not connect to Google. Please ensure you are using the latest app version.");
            }
        }
    }, [response]);

    const getUserInfo = async (token: string) => {
        try {
            const res = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
                headers: { Authorization: `Bearer ${token}` },
            });
            const user = await res.json();
            
            if (user?.email) {
                setSelectedEmail(user.email);
                setSyncMode('Auto'); // Enable auto sync by default
                await AsyncStorage.multiSet([
                    ['sync_email', user.email],
                    ['sync_mode', 'Auto']
                ]);
                
                // MIRROR SYNC: Pull old data down AND PUSH local data up immediately
                setTimeout(async () => {
                    await syncWithCloud();
                    await SyncService.backupToCloud(todos);
                }, 1000);

                setIsSyncing(false);
                Alert.alert(
                    "Success", 
                    `Missions linked to ${user.email}. Syncing now...`
                );
            }
        } catch (error) {
            setIsSyncing(false);
            Alert.alert("Sync Error", "Could not retrieve user info. Please try again.");
        }
    };

    // Load saved settings
    useEffect(() => {
        const loadSettings = async () => {
            const email = await AsyncStorage.getItem('sync_email');
            const mode = await AsyncStorage.getItem('sync_mode');
            if (email) setSelectedEmail(email);
            if (mode) setSyncMode(mode as any);
        };
        loadSettings();
    }, []);

    const handleGoogleSignIn = async () => {
        setIsSyncing(true);
        if (request) {
            // Using explicit options to ensure it follows the Proxy flow
            promptAsync();
        } else {
            setIsSyncing(false);
            Alert.alert("Error", "Sign-in request failed to initialize. Please check your internet connection.");
        }
    };

    const handleSignOut = async () => {
        setSelectedEmail(null);
        await AsyncStorage.removeItem('sync_email');
    };

    const updateSyncMode = async (mode: 'Auto' | 'Manual' | 'Off') => {
        setSyncMode(mode);
        await AsyncStorage.setItem('sync_mode', mode);
        setShowSyncModal(false);
    };

    const updateTimeFormat = (format: '12h' | '24h') => {
        toggleTimeFormat(format);
        setShowTimeModal(false);
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
            <Stack.Screen options={{
                title: 'Settings',
            }} />

            <ScrollView contentContainerStyle={styles.scrollContent}>
                
                {/* Visual Section: Theme */}
                <View style={styles.section}>
                    <Text style={[styles.sectionHeader, { color: colors.header }]}>Visual Appearance</Text>
                    <TouchableOpacity 
                        style={[styles.settingRow, { borderBottomColor: colors.border }]} 
                        onPress={toggleTheme}
                    >
                        <View style={styles.rowLeft}>
                            <Ionicons name={theme === 'light' ? 'moon-outline' : 'sunny-outline'} size={22} color={colors.text} />
                            <View style={styles.rowText}>
                                <Text style={[styles.rowTitle, { color: colors.text }]}>Dark Mode</Text>
                                <Text style={[styles.rowSub, { color: colors.secondaryText }]}>
                                    {theme === 'light' ? 'Disabled' : 'Enabled'}
                                </Text>
                            </View>
                        </View>
                        <Ionicons name={theme === 'light' ? 'square-outline' : 'checkbox-outline'} size={22} color={colors.header} />
                    </TouchableOpacity>

                    <TouchableOpacity 
                        style={[styles.settingRow, { borderBottomColor: colors.border }]} 
                        onPress={() => setShowTimeModal(true)}
                    >
                        <View style={styles.rowLeft}>
                            <Ionicons name="time-outline" size={22} color={colors.text} />
                            <View style={styles.rowText}>
                                <Text style={[styles.rowTitle, { color: colors.text }]}>Time Format</Text>
                                <Text style={[styles.rowSub, { color: colors.secondaryText }]}>
                                    {timeFormat === '12h' ? '12-hour (1:00 PM)' : '24-hour (13:00)'}
                                </Text>
                            </View>
                        </View>
                        <Ionicons name="chevron-forward" size={18} color={colors.secondaryText} />
                    </TouchableOpacity>
                </View>

                {/* Google Sync Section */}
                <View style={styles.section}>
                    <Text style={[styles.sectionHeader, { color: colors.header }]}>Secure My Missions</Text>
                    
                    {!selectedEmail ? (
                        <TouchableOpacity 
                            style={[styles.settingRow, { borderBottomColor: colors.border }]}
                            onPress={handleGoogleSignIn}
                            disabled={isSyncing}
                        >
                            <View style={styles.rowLeft}>
                                {isSyncing ? (
                                    <ActivityIndicator size="small" color={colors.header} style={{ marginRight: 15 }} />
                                ) : (
                                    <Ionicons name="logo-google" size={22} color="#EA4335" />
                                )}
                                <View style={styles.rowText}>
                                    <Text style={[styles.rowTitle, { color: colors.text }]}>Sign in with Google</Text>
                                    <Text style={[styles.rowSub, { color: colors.secondaryText }]}>
                                        Backup your history instantly
                                    </Text>
                                </View>
                            </View>
                        </TouchableOpacity>
                    ) : (
                        <>
                            <TouchableOpacity 
                                style={[styles.settingRow, { borderBottomColor: colors.border }]}
                                onPress={handleSignOut}
                            >
                                <View style={styles.rowLeft}>
                                    <Ionicons name="person-circle-outline" size={24} color={colors.header} />
                                    <View style={styles.rowText}>
                                        <Text style={[styles.rowTitle, { color: colors.text }]}>{selectedEmail}</Text>
                                        <Text style={[styles.rowSub, { color: colors.secondaryText }]}>History Secured</Text>
                                    </View>
                                </View>
                                <Text style={{ color: colors.secondaryText, fontSize: 12 }}>Unlink</Text>
                            </TouchableOpacity>

                            <TouchableOpacity 
                                style={[styles.settingRow, { borderBottomColor: colors.border }]}
                                onPress={() => setShowSyncModal(true)}
                            >
                                <View style={styles.rowLeft}>
                                    <Ionicons name="sync-outline" size={22} color={colors.text} />
                                    <View style={styles.rowText}>
                                        <Text style={[styles.rowTitle, { color: colors.text }]}>Sync status</Text>
                                        <Text style={[styles.rowSub, { color: colors.secondaryText }]}>
                                            {syncMode === 'Off' ? 'Sync disabled' : syncMode}
                                        </Text>
                                    </View>
                                </View>
                            </TouchableOpacity>
                        </>
                    )}
                </View>

                <View style={[styles.infoBox, { borderLeftColor: colors.header }]}>
                    <Ionicons name="cloud-done-outline" size={22} color={colors.secondaryText} />
                    <Text style={[styles.infoText, { color: colors.secondaryText }]}>
                        Always safe: Even if you delete your missions or the app, your history is securely linked to your account for restoration anytime.
                    </Text>
                </View>

            </ScrollView>

            {/* Time Format Modal */}
            <Modal visible={showTimeModal} transparent animationType="fade">
                <View style={styles.modalOverlay}>
                    <View style={[styles.modalBox, { backgroundColor: colors.surface }]}>
                        <Text style={[styles.modalTitle, { color: colors.text }]}>Select Time Format</Text>
                        <View style={styles.modalContent}>
                            {[
                                { label: '12-hour (1:00 PM)', value: '12h' },
                                { label: '24-hour (13:00)', value: '24h' }
                            ].map((item) => (
                                <TouchableOpacity 
                                    key={item.value} 
                                    style={styles.modalItem}
                                    onPress={() => updateTimeFormat(item.value as any)}
                                >
                                    <View style={[styles.radio, timeFormat === item.value && styles.radioActive]} />
                                    <Text style={[styles.modalItemText, { color: colors.text }]}>{item.label}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                        <View style={styles.modalActions}>
                            <TouchableOpacity onPress={() => setShowTimeModal(false)}>
                                <Text style={[styles.modalBtn, { color: colors.header }]}>CLOSE</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>

            {/* Sync Mode Modal */}
            <Modal visible={showSyncModal} transparent animationType="fade">
                <View style={styles.modalOverlay}>
                    <View style={[styles.modalBox, { backgroundColor: colors.surface }]}>
                        <Text style={[styles.modalTitle, { color: colors.text }]}>Sync mode</Text>
                        <View style={styles.modalContent}>
                            {['Auto', 'Manual', 'Sync disabled'].map((mode) => (
                                <TouchableOpacity 
                                    key={mode} 
                                    style={styles.modalItem}
                                    onPress={() => updateSyncMode(mode === 'Sync disabled' ? 'Off' : mode as any)}
                                >
                                    <View style={[styles.radio, (syncMode === mode || (syncMode === 'Off' && mode === 'Sync disabled')) && styles.radioActive]} />
                                    <Text style={[styles.modalItemText, { color: colors.text }]}>{mode}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                        <View style={styles.modalActions}>
                            <TouchableOpacity onPress={() => setShowSyncModal(false)}>
                                <Text style={[styles.modalBtn, { color: colors.header }]}>CANCEL</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>

        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    backButton: { marginLeft: 15, padding: 5 },
    scrollContent: { padding: 25 },
    section: { marginBottom: 35 },
    sectionHeader: { fontSize: 13, fontWeight: '800', textTransform: 'uppercase', opacity: 0.6, marginBottom: 15, letterSpacing: 1 },
    settingRow: { 
        flexDirection: 'row', 
        alignItems: 'center', 
        justifyContent: 'space-between',
        paddingVertical: 20,
        borderBottomWidth: 1,
    },
    rowLeft: { flexDirection: 'row', alignItems: 'center', flex: 1 },
    rowText: { marginLeft: 15 },
    rowTitle: { fontSize: 17, fontWeight: '600' },
    rowSub: { fontSize: 13, marginTop: 4, opacity: 0.7 },
    infoBox: { 
        flexDirection: 'row', 
        backgroundColor: 'rgba(0,0,0,0.02)', 
        padding: 20, 
        borderRadius: 4, 
        alignItems: 'center',
        borderLeftWidth: 4,
    },
    infoText: { fontSize: 13, marginLeft: 15, flex: 1, lineHeight: 18 },
    
    // Modal Styles
    modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'center', alignItems: 'center' },
    modalBox: { width: '85%', maxHeight: '80%', borderRadius: 12, paddingBottom: 10, elevation: 20, shadowColor: '#000', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.3, shadowRadius: 20 },
    modalTitle: { fontSize: 20, fontWeight: '800', margin: 25 },
    modalContent: { paddingHorizontal: 25 },
    modalItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 18 },
    radio: { width: 22, height: 22, borderRadius: 11, borderWidth: 2, borderColor: '#3498DB', marginRight: 20 },
    radioActive: { backgroundColor: '#3498DB' },
    modalItemText: { fontSize: 16, fontWeight: '600' },
    modalActions: { flexDirection: 'row', justifyContent: 'flex-end', padding: 15 },
    modalBtn: { fontWeight: '800', fontSize: 15, marginLeft: 30 },
});
