import { Ionicons } from '@expo/vector-icons';
import { Stack, useRouter } from 'expo-router';
import React from 'react';
import { Linking, Platform, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function HelpScreen() {
    const router = useRouter();
    const supportEmail = 'anilarangi6@gmail.com';
    const feedbackFormUrl = 'https://forms.gle/1UTNrqfhKqRgEq138';

    const handleContact = () => {
        const mailUrl = `mailto:${supportEmail}?subject=Support Request - Remi Todo`;

        if (Platform.OS === 'web') {
            window.open(mailUrl);
        } else {
            Linking.openURL(mailUrl);
        }
    };

    const handleFeedback = () => {
        if (Platform.OS === 'web') {
            window.open(feedbackFormUrl);
        } else {
            Linking.openURL(feedbackFormUrl);
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
                headerStyle: { backgroundColor: '#007AFF' },
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

                {/* Feedback Section - NEW */}
                <View style={styles.feedbackCard}>
                    <Ionicons name="chatbubble-ellipses-outline" size={32} color="#007AFF" />
                    <Text style={styles.feedbackTitle}>Share Your Feedback</Text>
                    <Text style={styles.feedbackSubtitle}>Your suggestions help us improve Remi Todo for everyone.</Text>
                    <TouchableOpacity style={styles.feedbackBtn} onPress={handleFeedback}>
                        <Text style={styles.feedbackBtnText}>Give Feedback</Text>
                        <Ionicons name="open-outline" size={18} color="white" style={{ marginLeft: 8 }} />
                    </TouchableOpacity>
                </View>

                {/* FAQ Section */}
                <View style={styles.section}>
                    <Text style={styles.sectionLabel}>Quick FAQ</Text>
                    <FAQItem
                        question="How do I add a mission?"
                        answer="Simply type your task in the 'New Mission' box at the bottom and tap the arrow icon."
                    />
                    <FAQItem
                        question="Is my data safe?"
                        answer="Yes, all tasks are stored locally on your device. We don't upload them anywhere."
                    />
                    <FAQItem
                        question="Can I use this on Web?"
                        answer="Yes! Remi Todo is fully responsive and works beautifully on all your devices."
                    />
                </View>

                {/* Simplified Contact Section */}
                <View style={styles.contactCard}>
                    <Text style={styles.contactTitle}>Get in Touch</Text>
                    <Text style={styles.contactText}>
                        If you have any questions or need technical support, please reach out via email.
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
        backgroundColor: '#F2F2F7',
    },
    scrollContent: {
        paddingBottom: 40,
    },
    backButton: {
        marginLeft: 16,
        padding: 8,
    },
    banner: {
        backgroundColor: '#007AFF',
        paddingVertical: 40,
        paddingHorizontal: 20,
        alignItems: 'center',
        borderBottomLeftRadius: 40,
        borderBottomRightRadius: 40,
    },
    iconCircle: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: 'rgba(255,255,255,0.2)',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 16,
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
    feedbackCard: {
        margin: 20,
        backgroundColor: 'white',
        borderRadius: 24,
        padding: 24,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOpacity: 0.05,
        shadowRadius: 15,
        elevation: 5,
    },
    feedbackTitle: {
        fontSize: 18,
        fontWeight: '800',
        color: '#1C1C1E',
        marginTop: 12,
    },
    feedbackSubtitle: {
        fontSize: 13,
        color: '#8E8E93',
        textAlign: 'center',
        marginTop: 6,
        marginBottom: 18,
    },
    feedbackBtn: {
        backgroundColor: '#007AFF',
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 16,
    },
    feedbackBtnText: {
        color: 'white',
        fontWeight: '700',
        fontSize: 15,
    },
    section: {
        paddingHorizontal: 20,
        marginTop: 10,
    },
    sectionLabel: {
        fontSize: 13,
        fontWeight: '800',
        color: '#8E8E93',
        textTransform: 'uppercase',
        letterSpacing: 1,
        marginBottom: 12,
        marginLeft: 4,
    },
    faqItem: {
        backgroundColor: 'white',
        padding: 18,
        borderRadius: 20,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOpacity: 0.02,
        shadowRadius: 10,
        elevation: 2,
    },
    faqQuestion: {
        fontSize: 16,
        fontWeight: '700',
        color: '#1C1C1E',
        marginBottom: 6,
    },
    faqAnswer: {
        fontSize: 14,
        color: '#636366',
        lineHeight: 20,
    },
    contactCard: {
        margin: 20,
        backgroundColor: 'white',
        borderRadius: 24,
        padding: 24,
        shadowColor: '#000',
        shadowOpacity: 0.05,
        shadowRadius: 15,
        elevation: 5,
    },
    contactTitle: {
        fontSize: 18,
        fontWeight: '800',
        color: '#1C1C1E',
        marginBottom: 8,
        textAlign: 'center',
    },
    contactText: {
        fontSize: 13,
        color: '#8E8E93',
        textAlign: 'center',
        lineHeight: 20,
        marginBottom: 20,
    },
    emailBtn: {
        backgroundColor: '#007AFF',
        width: '100%',
        padding: 16,
        borderRadius: 18,
        flexDirection: 'row',
        alignItems: 'center',
    },
    emailBtnTextContainer: {
        flex: 1,
        marginLeft: 15,
    },
    emailBtnLabel: {
        color: 'rgba(255,255,255,0.7)',
        fontSize: 10,
        fontWeight: '700',
        textTransform: 'uppercase',
    },
    emailAddress: {
        color: 'white',
        fontSize: 15,
        fontWeight: '700',
        marginTop: 1,
    },
    footer: {
        marginTop: 10,
        alignItems: 'center',
    },
    footerText: {
        fontSize: 13,
        color: '#C7C7CC',
    }
});
