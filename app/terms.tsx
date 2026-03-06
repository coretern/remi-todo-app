import { Ionicons } from '@expo/vector-icons';
import { Stack, useRouter } from 'expo-router';
import React from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function TermsScreen() {
    const router = useRouter();

    return (
        <SafeAreaView style={styles.container}>
            <Stack.Screen options={{
                title: 'Terms of Service',
                headerShown: true,
                headerLeft: () => (
                    <TouchableOpacity
                        onPress={() => router.replace('/')}
                        style={styles.backButton}
                        activeOpacity={0.7}
                    >
                        <Ionicons name="arrow-back" size={24} color="white" />
                    </TouchableOpacity>
                ),
                headerStyle: { backgroundColor: '#0a7ea4' },
                headerTintColor: 'white',
            }} />

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                <View style={styles.content}>
                    <Text style={styles.title}>Terms of Service</Text>
                    <Text style={styles.date}>Effective Date: March 2026</Text>

                    <Text style={styles.paragraph}>
                        By using Remi Todo, you agree to these basic terms.
                    </Text>

                    <Text style={styles.sectionTitle}>1. Use of the App</Text>
                    <Text style={styles.paragraph}>
                        Remi Todo is provided "as is". You are responsible for maintaining your tasks and reminders. We do not provide cloud backups, so if you delete the app, your tasks will be lost forever.
                    </Text>

                    <Text style={styles.sectionTitle}>2. Account Deletion</Text>
                    <Text style={styles.paragraph}>
                        Since the app stores data locally, deleting the application will effectively delete all your data. We do not maintain any user accounts on external servers.
                    </Text>

                    <Text style={styles.sectionTitle}>3. Changes to Terms</Text>
                    <Text style={styles.paragraph}>
                        We reserve the right to modify these terms at any time.
                    </Text>

                    <Text style={styles.sectionTitle}>4. Disclaimer</Text>
                    <Text style={styles.paragraph}>
                        Remi Todo will not be held liable for missed tasks or alarms if your device is turned off, in silent mode, or if the notification permissions are disabled.
                    </Text>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8F9FA',
    },
    scrollContent: {
        padding: 24,
    },
    backButton: {
        marginLeft: 16,
        padding: 8,
    },
    content: {
        backgroundColor: 'white',
        padding: 24,
        borderRadius: 24,
        shadowColor: '#000',
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 2,
    },
    title: {
        fontSize: 24,
        fontWeight: '800',
        color: '#1A1A1A',
        marginBottom: 8,
    },
    date: {
        fontSize: 14,
        color: '#999',
        marginBottom: 24,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#0a7ea4',
        marginTop: 20,
        marginBottom: 10,
    },
    paragraph: {
        fontSize: 15,
        color: '#555',
        lineHeight: 24,
        marginBottom: 10,
    }
});
