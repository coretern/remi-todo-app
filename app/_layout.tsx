import { ThemeProvider, useTheme } from '../context/ThemeContext';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Stack, useRouter } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { Platform, TouchableOpacity, StatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import Constants from 'expo-constants';

import { TodoProvider } from '../context/TodoContext';

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync().catch(() => { });

// Safety wrapper to avoid crashes on Expo Go SDK 53
const initNotifications = async () => {
    if (Platform.OS === 'web' || Constants.appOwnership === 'expo') return;
    
    try {
        // Dynamic require to prevent top-level import side effects
        const Notifications = require('expo-notifications');
        const { status: existingStatus } = await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;
        if (existingStatus !== 'granted') {
            const { status } = await Notifications.requestPermissionsAsync();
            finalStatus = status;
        }
        console.log('Push status:', finalStatus);
    } catch (e) {
        console.warn('Notifications init failed:', e);
    }
};

export default function RootLayout() {
    useEffect(() => {
        initNotifications();
        setTimeout(async () => {
            await SplashScreen.hideAsync().catch(() => { });
        }, 300);
    }, []);

    return (
        <SafeAreaProvider>
            <StatusBar barStyle="light-content" backgroundColor="transparent" translucent={true} />
            <TodoProvider>
                <ThemeProvider>
                    <RootLayoutContent />
                </ThemeProvider>
            </TodoProvider>
        </SafeAreaProvider>
    );
}

function RootLayoutContent() {
    const themeContext = useTheme();
    const router = useRouter();
    // Safety check: wait for context to be ready
    if (!themeContext) return null;
    
    const { colors } = themeContext;

    return (
        <Stack
            screenOptions={{
                headerStyle: { backgroundColor: colors.header },
                headerTintColor: 'white',
                headerTitleStyle: { fontWeight: '800' },
                headerLeft: () => (
                    <TouchableOpacity 
                        onPress={() => router.back()} 
                        style={{ marginLeft: -10, padding: 15, marginRight: 5 }} 
                    >
                        <Ionicons name="arrow-back" size={26} color="white" />
                    </TouchableOpacity>
                ),
                headerShown: true,
                headerTitleAlign: 'left',
            }}
        >
            <Stack.Screen name="index" options={{ headerShown: false, title: 'Remi Todo' }} />
            <Stack.Screen name="history" options={{ title: 'Mission History' }} />
            <Stack.Screen name="about" options={{ title: 'About Remi' }} />
            <Stack.Screen name="settings" options={{ title: 'Settings' }} />
            <Stack.Screen name="help" options={{ title: 'Support' }} />
            <Stack.Screen name="privacy" options={{ title: 'Privacy Policy' }} />
            <Stack.Screen name="terms" options={{ title: 'Terms of Service' }} />
            <Stack.Screen name="legal" options={{ title: 'Legal Info' }} />
            <Stack.Screen name="new-task" options={{ title: 'New Mission' }} />
            <Stack.Screen name="developer" options={{ title: 'Developer Info' }} />
        </Stack>
    );
}
