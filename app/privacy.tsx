import { Ionicons } from '@expo/vector-icons';
import { Stack, useRouter } from 'expo-router';
import React from 'react';
import {
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';

import { useTheme } from '../context/ThemeContext';

export default function PrivacyScreen() {
    const router = useRouter();
    const { colors, theme } = useTheme();

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                <View style={styles.contentHeader}>
                    <Ionicons name="shield-checkmark-outline" size={48} color={colors.header} />
                    <Text style={[styles.mainTitle, { color: colors.text }]}>Privacy Policy</Text>
                    <Text style={[styles.lastUpdated, { color: colors.secondaryText }]}>LAST UPDATED: MARCH 31, 2026</Text>
                </View>

                <View style={styles.entryContainer}>
                    <PolicyEntry 
                        title="1. Secure Sync" 
                        text="We use Google Login to safely backup your tasks to the cloud. Only you can see your private missions." 
                        colors={colors}
                    />
                    <PolicyEntry 
                        title="2. Identification" 
                        text="Your email is used only to securely identify your account for cloud restoration across devices." 
                        colors={colors}
                    />
                    <PolicyEntry 
                        title="3. Improvements" 
                        text="We use Google Analytics to understand how users use the app so we can make it better for you." 
                        colors={colors}
                    />
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

function PolicyEntry({ title, text, colors }: { title: string, text: string, colors: any }) {
    return (
        <View style={[styles.entryCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <Text style={[styles.entryTitle, { color: colors.header }]}>{title}</Text>
            <Text style={[styles.entryText, { color: colors.text }]}>{text}</Text>
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
        paddingBottom: 60,
    },
    contentHeader: {
        alignItems: 'center',
        paddingVertical: 55,
        paddingHorizontal: 40,
    },
    mainTitle: {
        fontSize: 34,
        fontWeight: '900',
        marginTop: 20,
        letterSpacing: -0.5,
    },
    lastUpdated: {
        fontSize: 12,
        marginTop: 8,
        fontWeight: '700',
        textTransform: 'uppercase',
        letterSpacing: 2,
        opacity: 0.5,
    },
    entryContainer: {
        paddingHorizontal: 25,
    },
    entryCard: {
        marginBottom: 20,
        padding: 25,
        borderRadius: 20,
        borderWidth: 1,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 2,
    },
    entryTitle: {
        fontSize: 19,
        fontWeight: '800',
        marginBottom: 15,
    },
    entryText: {
        fontSize: 16,
        lineHeight: 25,
        opacity: 0.8,
        fontWeight: '500',
    },
});
