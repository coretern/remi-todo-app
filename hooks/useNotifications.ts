import Constants from 'expo-constants';
import * as Device from 'expo-device';
import { useCallback, useEffect, useState } from 'react';
import { Platform } from 'react-native';

// Helper to get notifications instance safely
const getNotifications = () => {
    try {
        if (Platform.OS === 'web') return null;
        return require('expo-notifications');
    } catch (e) {
        return null;
    }
};

export const useNotifications = () => {
    const [expoPushToken, setExpoPushToken] = useState('');

    const setupNotificationsAsync = useCallback(async () => {
        const Notifications = getNotifications();
        if (!Notifications || Platform.OS === 'web') return;

        try {
            // 1. Initial Configuration (Must be done early)
            Notifications.setNotificationHandler({
                handleNotification: async () => ({
                    shouldShowAlert: true,
                    shouldPlaySound: true,
                    shouldSetBadge: true,
                    priority: Notifications.AndroidImportance.MAX,
                }),
            });

            // 2. Check & Request Permissions
            const { status: existingStatus } = await Notifications.getPermissionsAsync();
            let finalStatus = existingStatus;

            if (existingStatus !== 'granted') {
                const { status } = await Notifications.requestPermissionsAsync();
                finalStatus = status;
            }

            if (finalStatus !== 'granted') {
                console.log('[Notification Warning] Permission not granted');
                return;
            }

            // 2.5 Check Exact Alarm permission for Android 12+
            if (Platform.OS === 'android') {
                const { canScheduleExactAlarms } = await Notifications.getPermissionsAsync();
                if (!canScheduleExactAlarms) {
                    console.log('[Notification Warning] Exact Alarms not permitted - timing may be imprecise.');
                    // Optionally we could request this, but it requires a specific intent on most devices
                }
            }

            // 3. Setup Android Channel (Vital for Android 8+)
            if (Platform.OS === 'android') {
                await Notifications.setNotificationChannelAsync('missions', {
                    name: 'Mission Reminders',
                    importance: Notifications.AndroidImportance.MAX,
                    vibrationPattern: [0, 250, 250, 250],
                    lightColor: '#0a7ea4',
                    lockscreenVisibility: Notifications.AndroidNotificationVisibility.PUBLIC,
                    showBadge: true,
                    enableVibrate: true,
                    sound: 'default',
                    bypassDnd: true,
                });
            }

            // 4. Setup Categories for Actions
            await Notifications.setNotificationCategoryAsync('mission_actions', [
                {
                    identifier: 'COMPLETE',
                    buttonTitle: 'COMPLETE',
                    options: { isDestructive: false },
                },
                {
                    identifier: 'TRASH',
                    buttonTitle: 'TRASH',
                    options: { isDestructive: true },
                },
            ]);

            // 5. Token logic (Only for standalone builds)
            const isExpoGo = Constants.executionEnvironment === 'storeClient';
            if (Device.isDevice && !isExpoGo) {
                try {
                    const tokenData = await Notifications.getExpoPushTokenAsync({
                        projectId: Constants.expoConfig?.extra?.eas?.projectId,
                    });
                    setExpoPushToken(tokenData.data);
                } catch (e) {
                    console.log('Push token skip');
                }
            }

        } catch (error) {
            console.log('Notification setup Error:', error);
        }
    }, []);

    const scheduleTodoReminder = useCallback(async (id: string, task: string, dueDate: number, minutesBefore: number = 0) => {
        const Notifications = getNotifications();
        if (!Notifications || Platform.OS === 'web') return null;

        // Ensure setup is done (in case it's the first run)
        await setupNotificationsAsync();

        const triggerTime = dueDate - (minutesBefore * 60 * 1000);
        const triggerDate = new Date(triggerTime);
        
        if (triggerDate.getTime() <= Date.now()) {
            if (Date.now() - triggerDate.getTime() < 10000) {
                triggerDate.setTime(Date.now() + 5000);
            } else {
                return null;
            }
        }

        try {
            const notificationId = await Notifications.scheduleNotificationAsync({
                content: {
                    title: "Mission Alert ⏰",
                    body: (minutesBefore > 0 
                        ? `${task.slice(0, 50)} starts in ${minutesBefore}m!` 
                        : `Time for your mission: ${task.slice(0, 50)}`).trim(),
                    data: { id },
                    sound: 'default', 
                    priority: Notifications.AndroidNotificationPriority.MAX,
                    categoryIdentifier: 'mission_actions',
                    color: '#0a7ea4',
                    android: {
                        channelId: 'missions',
                        importance: Notifications.AndroidImportance.MAX,
                        priority: 'max',
                        visibility: 'public',
                    }
                },
                trigger: {
                    type: Notifications.SchedulableTriggerInputTypes.DATE,
                    date: triggerDate,
                },
            });
            return notificationId;
        } catch (e) {
            console.error('[Reminder Error]', e);
            return null;
        }
    }, [setupNotificationsAsync]);

    const cancelReminder = useCallback(async (id: string) => {
        const Notifications = getNotifications();
        if (!Notifications || Platform.OS === 'web' || !id) return;
        try {
            await Notifications.cancelScheduledNotificationAsync(id);
        } catch (e) {
            console.log('Cancel Error', e);
        }
    }, []);

    useEffect(() => {
        setupNotificationsAsync();
    }, [setupNotificationsAsync]);

    return {
        scheduleTodoReminder,
        cancelReminder,
        expoPushToken
    };
};
