import { Ionicons } from '@expo/vector-icons';
import { Stack, useRouter } from 'expo-router';
import React from 'react';
import {
    Linking,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';

import { useTheme } from '../context/ThemeContext';

export default function HelpScreen() {
    const router = useRouter();
    const { colors, theme } = useTheme();

    const handleEmailSupport = () => {
        Linking.openURL('mailto:anilarangi6@gmail.com');
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                <View style={styles.contentHeader}>
                    <Ionicons name="help-buoy-outline" size={48} color={colors.header} />
                    <Text style={[styles.mainTitle, { color: colors.text }]}>How can we help?</Text>
                </View>

                <View style={styles.faqSection}>
                    <FAQItem 
                        question="How to add missions?" 
                        answer="Use the bottom bar to type and add tasks instantly." 
                        colors={colors}
                    />
                    <FAQItem 
                        question="Is my data safe?" 
                        answer="Yes, everything is stored 100% locally on your own device." 
                        colors={colors}
                    />
                    <FAQItem 
                        question="Can I delete all?" 
                        answer="Use 'Clear Completed' from the menu to purge finished tasks." 
                        colors={colors}
                    />
                </View>

                <TouchableOpacity 
                    style={[styles.contactRow, { borderTopColor: colors.border }]}
                    onPress={handleEmailSupport}
                >
                    <Ionicons name="mail-outline" size={24} color={colors.header} />
                    <View style={styles.contactText}>
                        <Text style={[styles.contactLabel, { color: colors.text }]}>Still need help?</Text>
                        <Text style={[styles.contactValue, { color: colors.secondaryText }]}>anilarangi6@gmail.com</Text>
                    </View>
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    );
}

function FAQItem({ question, answer, colors }: { question: string, answer: string, colors: any }) {
    return (
        <View style={styles.faqEntry}>
            <Text style={[styles.faqQuestion, { color: colors.header }]}>{question}</Text>
            <Text style={[styles.faqAnswer, { color: colors.text }]}>{answer}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    backButton: {
        marginLeft: 15,
        padding: 5,
    },
    scrollContent: {
        paddingBottom: 40,
    },
    contentHeader: {
        alignItems: 'center',
        paddingVertical: 40,
    },
    mainTitle: {
        fontSize: 28,
        fontWeight: '800',
        marginTop: 15,
    },
    faqSection: {
        paddingHorizontal: 25,
    },
    faqEntry: {
        marginBottom: 30,
    },
    faqQuestion: {
        fontSize: 18,
        fontWeight: '800',
        marginBottom: 8,
    },
    faqAnswer: {
        fontSize: 15,
        lineHeight: 22,
        opacity: 0.8,
    },
    contactRow: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 25,
        borderTopWidth: 1,
        marginTop: 10,
    },
    contactText: {
        marginLeft: 20,
    },
    contactLabel: {
        fontSize: 16,
        fontWeight: '700',
    },
    contactValue: {
        fontSize: 14,
        marginTop: 2,
    },
});
