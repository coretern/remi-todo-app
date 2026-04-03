import Constants from 'expo-constants';
import * as Device from 'expo-device';
import { useCallback, useEffect, useState } from 'react';
import { Platform } from 'react-native';

// Helper to get notifications instance safely
const getNotifications = () => {
    try {
        // SDK 53 Safety: expo-notifications causes crashes in Expo Go Android
        if (Platform.OS === 'web' || Constants.appOwnership === 'expo') return null;
        return require('expo-notifications');
    } catch (e) {
        return null;
    }
};

export const useNotifications = () => {
    const [expoPushToken, setExpoPushToken] = useState('');

    const registerForPushNotificationsAsync = useCallback(async () => {
        const Notifications = getNotifications();
        if (!Notifications || Platform.OS === 'web') return;

        let token;
        try {
            // 1. Check Permissions
            const { status: existingStatus } = await Notifications.getPermissionsAsync();
            let finalStatus = existingStatus;

            if (existingStatus !== 'granted') {
                const { status } = await Notifications.requestPermissionsAsync();
                finalStatus = status;
            }

            if (finalStatus !== 'granted') return;

            // 2. Setup Android Channel
            if (Platform.OS === 'android') {
                await Notifications.setNotificationChannelAsync('default', {
                    name: 'default',
                    importance: Notifications.AndroidImportance.MAX,
                    vibrationPattern: [0, 250, 250, 250],
                    lightColor: '#0a7ea4',
                });
            }

            // 3. Expo SDK 53+ Safety: Skip push token in Expo Go / Development
            const isExpoGo = Constants.executionEnvironment === 'storeClient';

            if (Device.isDevice && !isExpoGo) {
                try {
                    const tokenData = await Notifications.getExpoPushTokenAsync();
                    token = tokenData.data;
                } catch (e) {
                    console.log('Push token not supported/configured for this build');
                }
            } else {
                console.log('Local-only notifications mode (Expo Go/Dev)');
            }

        } catch (error) {
            console.log('Notification setup skipped:', error);
        }

        return token;
    }, []);

    const scheduleTodoReminder = useCallback(async (id: string, task: string, dueDate: number, minutesBefore: number = 0) => {
        // Calculate trigger time
        const triggerDate = new Date(dueDate - (minutesBefore * 60 * 1000));
        
        console.log(`[Reminder Logic] Mission: "${task}" alert scheduled for: ${triggerDate.toLocaleString()}`);
        console.log(`[Reminder Logic] Offset: ${minutesBefore} minutes before mission due time.`);

        const Notifications = getNotifications();
        if (!Notifications || Platform.OS === 'web') {
            console.log(`[Reminder Info] Native notification skipped (Running in Expo Go/Web). Logic is verified!`);
            return 'expo_go_mock_id';
        }
        
        if (triggerDate.getTime() <= Date.now()) return null;

        try {
            const notificationId = await Notifications.scheduleNotificationAsync({
                content: {
                    title: "Mission Alert ⏰",
                    body: minutesBefore > 0 
                        ? `${task} starts in ${minutesBefore} minutes!` 
                        : `Time for your mission: ${task}`,
                    data: { id },
                },
                trigger: {
                    type: Notifications.SchedulableTriggerInputTypes.DATE,
                    date: triggerDate,
                },
            });
            console.log(`[Reminder Success] Native alert active with ID: ${notificationId}`);
            return notificationId;
        } catch (e) {
            console.error('[Reminder Error] Failed to schedule notification', e);
            return null;
        }
    }, []);

    const cancelReminder = useCallback(async (id: string) => {
        const Notifications = getNotifications();
        if (!Notifications || Platform.OS === 'web' || !id) return;
        try {
            await Notifications.cancelScheduledNotificationAsync(id);
        } catch (e) {
            console.log('Failed to cancel notification', e);
        }
    }, []);

    useEffect(() => {
        const Notifications = getNotifications();
        if (Notifications) {
            Notifications.setNotificationHandler({
                handleNotification: async () => ({
                    shouldShowAlert: true,
                    shouldPlaySound: true,
                    shouldSetBadge: true,
                }),
            });
            
            registerForPushNotificationsAsync().then(token => {
                if (token) setExpoPushToken(token);
            }).catch(err => {
                // Silently catch and log for debug, but don't crash the app
                console.log('Push notification registration skipped (normal for Expo Go)');
            });
        }
    }, [registerForPushNotificationsAsync]);

    return {
        scheduleTodoReminder,
        cancelReminder,
        expoPushToken
    };
};
