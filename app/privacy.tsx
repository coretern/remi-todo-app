import { Ionicons } from '@expo/vector-icons';
import { Stack, useRouter } from 'expo-router';
import React from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function PrivacyPolicyScreen() {
    const router = useRouter();

    return (
        <SafeAreaView style={styles.container}>
            <Stack.Screen options={{
                title: 'Privacy Policy',
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
                    <Text style={styles.title}>Privacy Policy</Text>
                    <Text style={styles.date}>Last Updated: March 2026</Text>

                    <Text style={styles.paragraph}>
                        At Remi Todo, we take your privacy seriously. This policy explains how we handle your data.
                    </Text>

                    <Text style={styles.sectionTitle}>1. Data Collection</Text>
                    <Text style={styles.paragraph}>
                        Remi Todo is a local-first application. All tasks, alarms, and settings you create are stored exclusively on your device's local storage. We do not collect, store, or transmit any of your personal data to external servers.
                    </Text>

                    <Text style={styles.sectionTitle}>2. Use of Permissions</Text>
                    <Text style={styles.paragraph}>
                        The app requests notification permissions solely to provide the alarm and reminder functionality you set for your tasks.
                    </Text>

                    <Text style={styles.sectionTitle}>3. Third-Party Services</Text>
                    <Text style={styles.paragraph}>
                        We do not use third-party tracking or analytics services that collect your personal information.
                    </Text>

                    <Text style={styles.sectionTitle}>4. Data Security</Text>
                    <Text style={styles.paragraph}>
                        Since your data is stored locally, its security depends on your device's security settings.
                    </Text>

                    <Text style={styles.sectionTitle}>5. Contact Us</Text>
                    <Text style={styles.paragraph}>
                        If you have any questions about this Privacy Policy, please contact us at anilarangi6@gmail.com.
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
