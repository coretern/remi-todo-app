import Constants from 'expo-constants';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import { useCallback, useEffect, useState } from 'react';
import { Platform } from 'react-native';

// Only set handler if not on Web
if (Platform.OS !== 'web') {
    Notifications.setNotificationHandler({
        handleNotification: async () => ({
            shouldShowAlert: true,
            shouldPlaySound: true,
            shouldSetBadge: true,
            shouldShowBanner: true,
            shouldShowList: true,
        }),
    });
}

export const useNotifications = () => {
    const [expoPushToken, setExpoPushToken] = useState('');

    const registerForPushNotificationsAsync = useCallback(async () => {
        if (Platform.OS === 'web') return;

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
            // Expo Go no longer supports the push token functionality on Android 
            const isExpoGo = Constants.executionEnvironment === 'storeClient';

            if (Device.isDevice && !isExpoGo) {
                try {
                    // Try getting token, fail silently if not supported
                    const tokenData = await Notifications.getExpoPushTokenAsync();
                    token = tokenData.data;
                } catch (e) {
                    console.log('Push token not supported/configured for this build');
                }
            } else {
                console.log('Local-only notifications mode (Expo Go/Dev)');
            }

        } catch (error) {
            // Final safety catch to prevent app crash
            console.log('Notification setup skipped:', error);
        }

        return token;
    }, []);

    const scheduleTodoReminder = useCallback(async (id: string, task: string, dueDate: number) => {
        if (Platform.OS === 'web') return null;
        if (dueDate <= Date.now()) return null;

        try {
            // LOCAL notifications work fine in Expo Go
            const notificationId = await Notifications.scheduleNotificationAsync({
                content: {
                    title: "Task Reminder ⏰",
                    body: `Don't forget: ${task}`,
                    data: { id },
                },
                trigger: {
                    type: Notifications.SchedulableTriggerInputTypes.DATE,
                    date: new Date(dueDate),
                },
            });
            return notificationId;
        } catch (e) {
            console.error('Failed to schedule local notification', e);
            return null;
        }
    }, []);

    const cancelReminder = useCallback(async (id: string) => {
        if (Platform.OS === 'web' || !id) return;
        try {
            await Notifications.cancelScheduledNotificationAsync(id);
        } catch (e) {
            console.log('Failed to cancel notification', e);
        }
    }, []);

    useEffect(() => {
        registerForPushNotificationsAsync().then(token => {
            if (token) setExpoPushToken(token);
        }).catch(err => {
            console.log('Notification registration error ignored:', err);
        });
    }, [registerForPushNotificationsAsync]);

    return {
        scheduleTodoReminder,
        cancelReminder,
        expoPushToken
    };
};
