import { Ionicons } from '@expo/vector-icons';
import { Stack, useRouter } from 'expo-router';
import React from 'react';
import { Linking, Platform, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function HelpScreen() {
    const router = useRouter();
    const supportEmail = 'anilarangi6@gmail.com';

    const handleContact = () => {
        const mailUrl = `mailto:${supportEmail}?subject=Support Request - Premium Todo`;

        if (Platform.OS === 'web') {
            window.open(mailUrl);
        } else {
            Linking.openURL(mailUrl);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <Stack.Screen options={{
                title: 'Help & Support',
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
                {/* Support Banner */}
                <View style={styles.banner}>
                    <View style={styles.iconCircle}>
                        <Ionicons name="help-buoy-outline" size={50} color="white" />
                    </View>
                    <Text style={styles.bannerTitle}>How can we help?</Text>
                    <Text style={styles.bannerSubtitle}>We are here to support your productivity journey</Text>
                </View>

                {/* FAQ Section */}
                <View style={styles.section}>
                    <Text style={styles.sectionLabel}>Quick FAQ</Text>
                    <FAQItem
                        question="How do I set an alarm?"
                        answer="Click the alarm icon next to 'New Mission', select your time (AM/PM), then add the task."
                    />
                    <FAQItem
                        question="Is my data safe?"
                        answer="Yes, all tasks are stored locally on your device. We don't upload them anywhere."
                    />
                    <FAQItem
                        question="Can I use this on Web?"
                        answer="Yes! But push notifications (alarms) are optimized for mobile devices."
                    />
                </View>

                {/* Simplified Contact Section */}
                <View style={styles.contactCard}>
                    <Text style={styles.contactTitle}>Get in Touch</Text>
                    <Text style={styles.contactText}>
                        If you have any questions or need technical support, please reach out to us directly via email.
                    </Text>

                    <TouchableOpacity style={styles.emailBtn} onPress={handleContact}>
                        <Ionicons name="mail-outline" size={24} color="white" />
                        <View style={styles.emailBtnTextContainer}>
                            <Text style={styles.emailBtnLabel}>Email Support</Text>
                            <Text style={styles.emailAddress}>{supportEmail}</Text>
                        </View>
                        <Ionicons name="chevron-forward" size={20} color="rgba(255,255,255,0.6)" />
                    </TouchableOpacity>
                </View>

                <View style={styles.footer}>
                    <Text style={styles.footerText}>Support available 24/7</Text>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const FAQItem = ({ question, answer }: { question: string, answer: string }) => (
    <View style={styles.faqItem}>
        <Text style={styles.faqQuestion}>{question}</Text>
        <Text style={styles.faqAnswer}>{answer}</Text>
    </View>
);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8F9FA',
    },
    scrollContent: {
        paddingBottom: 40,
    },
    backButton: {
        marginLeft: 16,
        padding: 8,
    },
    banner: {
        backgroundColor: '#0a7ea4',
        paddingVertical: 50,
        paddingHorizontal: 20,
        alignItems: 'center',
        borderBottomLeftRadius: 40,
        borderBottomRightRadius: 40,
    },
    iconCircle: {
        width: 90,
        height: 90,
        borderRadius: 45,
        backgroundColor: 'rgba(255,255,255,0.2)',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 20,
    },
    bannerTitle: {
        fontSize: 26,
        fontWeight: '900',
        color: 'white',
    },
    bannerSubtitle: {
        fontSize: 14,
        color: 'rgba(255,255,255,0.8)',
        marginTop: 8,
        textAlign: 'center',
    },
    section: {
        paddingHorizontal: 20,
        marginTop: 30,
    },
    sectionLabel: {
        fontSize: 14,
        fontWeight: '800',
        color: '#0a7ea4',
        textTransform: 'uppercase',
        letterSpacing: 1,
        marginBottom: 15,
    },
    faqItem: {
        backgroundColor: 'white',
        padding: 16,
        borderRadius: 16,
        marginBottom: 12,
        borderLeftWidth: 4,
        borderLeftColor: '#0a7ea4',
    },
    faqQuestion: {
        fontSize: 16,
        fontWeight: '700',
        color: '#1A1A1A',
        marginBottom: 6,
    },
    faqAnswer: {
        fontSize: 14,
        color: '#666',
        lineHeight: 20,
    },
    contactCard: {
        margin: 20,
        backgroundColor: 'white',
        borderRadius: 24,
        padding: 24,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 20,
        elevation: 5,
        alignItems: 'center',
    },
    contactTitle: {
        fontSize: 20,
        fontWeight: '800',
        color: '#1A1A1A',
        marginBottom: 10,
    },
    contactText: {
        fontSize: 14,
        color: '#666',
        textAlign: 'center',
        lineHeight: 22,
        marginBottom: 24,
    },
    emailBtn: {
        backgroundColor: '#0a7ea4',
        width: '100%',
        padding: 20,
        borderRadius: 20,
        flexDirection: 'row',
        alignItems: 'center',
        shadowColor: '#0a7ea4',
        shadowOpacity: 0.3,
        shadowRadius: 10,
        elevation: 8,
    },
    emailBtnTextContainer: {
        flex: 1,
        marginLeft: 15,
    },
    emailBtnLabel: {
        color: 'rgba(255,255,255,0.8)',
        fontSize: 12,
        fontWeight: '600',
        textTransform: 'uppercase',
    },
    emailAddress: {
        color: 'white',
        fontSize: 15,
        fontWeight: '800',
        marginTop: 2,
    },
    footer: {
        marginTop: 10,
        alignItems: 'center',
    },
    footerText: {
        fontSize: 14,
        color: '#BBB',
    }
});
