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

export default function TermsScreen() {
    const router = useRouter();
    const { colors, theme } = useTheme();

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                <View style={styles.contentHeader}>
                    <Ionicons name="document-text-outline" size={48} color={colors.header} />
                    <Text style={[styles.mainTitle, { color: colors.text }]}>Terms of Service</Text>
                    <Text style={[styles.lastUpdated, { color: colors.secondaryText }]}>LAST UPDATED: APRIL 8, 2026</Text>
                </View>

                <View style={styles.entryContainer}>
                    <TermEntry 
                        title="1. Cloud Syncing" 
                        text="When you sign in with Google, you agree to allow Remi to safely back up your missions and daily streaks to the cloud for seamless restoration." 
                        colors={colors}
                    />
                    <TermEntry 
                        title="2. Mission Integrity" 
                        text="You are fully responsible for your streaks. If a mission expires or is missed, your streak will reset to maintain the integrity of the professional achievement certificates." 
                        colors={colors}
                    />
                    <TermEntry 
                        title="3. Pure Experience" 
                        text="We promise to never show you ads or sell your data. Remi is a clean and professional space for your work." 
                        colors={colors}
                    />
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

function TermEntry({ title, text, colors }: { title: string, text: string, colors: any }) {
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
