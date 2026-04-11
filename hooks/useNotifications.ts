import notifee, { AndroidImportance, AndroidNotificationVisibility, TimestampTrigger, TriggerType, EventType, AndroidAlarmAllowance } from '@notifee/react-native';
import { useCallback, useEffect, useState } from 'react';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const useNotifications = () => {
    const [isPermissionGranted, setIsPermissionGranted] = useState(false);

    const setupNotificationsAsync = useCallback(async () => {
        if (Platform.OS === 'web') return;

        try {
            // Request permissions (Android 13+ requires this)
            const settings = await notifee.requestPermission();
            setIsPermissionGranted(settings.authorizationStatus >= 1);

            // 2. Create high-priority channel for Android
            if (Platform.OS === 'android') {
                await notifee.createChannel({
                    id: 'missions',
                    name: 'Mission Reminders',
                    importance: AndroidImportance.HIGH,
                    visibility: AndroidNotificationVisibility.PUBLIC,
                    vibration: true,
                    vibrationPattern: [300, 500],
                    lightColor: '#0a7ea4',
                    badge: true,
                });

                // Check for exact alarm permission (Android 13+)
                const settings = await notifee.getNotificationSettings();
                if (settings.android.alarm === AndroidAlarmAllowance.DENIED) {
                    console.warn('[Notifee] Exact alarms are denied. Reminders might be delayed.');
                    // In a real app, you might call notifee.openAlarmSettings()
                }
            }

            // 3. Set up categories for iOS (adds action buttons)
            if (Platform.OS === 'ios') {
                await notifee.setNotificationCategories([
                    {
                        id: 'mission',
                        actions: [
                            {
                                id: 'COMPLETE',
                                title: 'Mark Done',
                                foreground: true,
                            },
                        ],
                    },
                ]);
            }
        } catch (error) {
            console.log('[Notifee Setup Error]', error);
        }
    }, []);

    const scheduleTodoReminder = useCallback(async (id: string, task: string, dueDate: number, minutesBefore: number = 0) => {
        if (Platform.OS === 'web') return null;

        const triggerTime = dueDate - (minutesBefore * 60 * 1000);
        
        // Safety: If time is in the past, fire in 2 seconds for testing
        const now = Date.now();
        const adjustedTriggerTime = triggerTime <= now ? now + 2000 : triggerTime;

        try {
            // Create a timestamp-based trigger
            const trigger: TimestampTrigger = {
                type: TriggerType.TIMESTAMP,
                timestamp: adjustedTriggerTime,
                alarmManager: true, // Use AlarmManager for high accuracy on Android
            };

            const notificationId = await notifee.createTriggerNotification(
                {
                    id: id, // Use the todo ID as the notification ID for easy management
                    title: 'Mission Alert ⏰',
                    body: minutesBefore > 0 
                        ? `${task.slice(0, 50)} starts in ${minutesBefore}m!` 
                        : `Time for your mission: ${task.slice(0, 50)}`,
                    android: {
                        channelId: 'missions',
                        importance: AndroidImportance.HIGH,
                        pressAction: {
                            id: 'default',
                        },
                        // We can add actions like 'COMPLETE' later if needed
                        actions: [
                            {
                                title: 'Mark Done',
                                pressAction: { id: 'COMPLETE' },
                            },
                        ],
                        smallIcon: 'ic_launcher', // Fallback to launcher icon
                        color: '#0a7ea4',
                    },
                    ios: {
                        critical: true,
                        categoryId: 'mission',
                        foregroundPresentationOptions: {
                            badge: true,
                            sound: true,
                            banner: true,
                            list: true,
                        },
                    },
                },
                trigger,
            );

            console.log(`[Notifee] Scheduled mission: ${id} for ${new Date(adjustedTriggerTime).toLocaleString()}`);
            return id; // With Notifee, we can use our own ID
        } catch (e) {
            console.error('[Notifee Schedule Error]', e);
            return null;
        }
    }, []);

    const cancelReminder = useCallback(async (id: string) => {
        if (Platform.OS === 'web' || !id) return;
        try {
            await notifee.cancelNotification(id);
        } catch (e) {
            console.log('[Notifee Cancel Error]', e);
        }
    }, []);

    useEffect(() => {
        setupNotificationsAsync();
    }, [setupNotificationsAsync]);

    return {
        scheduleTodoReminder,
        cancelReminder,
        isPermissionGranted,
    };
};

// Handle background events (when app is closed/background)
notifee.onBackgroundEvent(async ({ type, detail }) => {
    const { notification, actionId } = detail;

    if (type === EventType.ACTION_PRESS && actionId === 'COMPLETE') {
        const todoId = notification?.id;
        if (todoId) {
            try {
                const STORAGE_KEY = '@todo_app_data';
                const jsonValue = await AsyncStorage.getItem(STORAGE_KEY);
                if (jsonValue != null) {
                    const todos = JSON.parse(jsonValue);
                    const updated = todos.map((t: any) => 
                        t.id === todoId ? { ...t, completed: true, completedAt: Date.now(), reminderId: undefined } : t
                    );
                    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
                    console.log(`[Notifee Background] Task ${todoId} marked as done.`);
                }
            } catch (e) {
                console.error('[Notifee Background Error]', e);
            }
        }
        
        // Remove the notification
        if (notification?.id) {
            await notifee.cancelNotification(notification.id);
        }
    }
});
