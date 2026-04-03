import { Ionicons } from '@expo/vector-icons';
import { Stack, useRouter } from 'expo-router';
import React from 'react';
import {
    Image,
    Linking,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { useTheme } from '../context/ThemeContext';

export default function AboutScreen() {
    const router = useRouter();
    const { colors, theme } = useTheme();

    const handleContactEmail = () => {
        Linking.openURL('mailto:anilarangi6@gmail.com?subject=Support: Remi Todo App');
    };

    const handleFeedbackForm = () => {
        Linking.openURL('https://docs.google.com/forms/d/e/1FAIpQLSeGLFa0DTPoalpk2FXGyYCQAuAB9UQOeDKewbBxo8Wb5w9VUw/viewform?usp=sf_link');
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                <View style={styles.heroArea}>
                    <Ionicons 
                        name="checkmark-done-circle" 
                        size={80} 
                        color={colors.header} 
                        style={{ marginBottom: 10 }}
                    />
                    <Text style={[styles.appName, { color: colors.text }]}>Remi Todo</Text>
                    
                    <Text style={[styles.simpleDescription, { color: colors.text }]}>
                        Remi Todo keeps your life organized. Easily backup your tasks to the cloud, sync with Google Calendar, and restore your history whenever you need.
                    </Text>
                </View>

                <View style={styles.featuresArea}>
                    <FeatureItem icon="cloud-done-outline" text="Cloud backup for your tasks" colors={colors} />
                    <FeatureItem icon="calendar-outline" text="Google Calendar sync" colors={colors} />
                    <FeatureItem icon="sync-outline" text="Easy history restoration" colors={colors} />
                </View>

                <View style={styles.actionSection}>
                    <TouchableOpacity 
                        style={[styles.actionRow, { borderTopColor: colors.border }]}
                        onPress={handleContactEmail}
                    >
                        <Ionicons name="mail-outline" size={22} color={colors.header} />
                        <Text style={[styles.actionLabel, { color: colors.text }]}>Contact Support</Text>
                    </TouchableOpacity>

                    <TouchableOpacity 
                        style={[styles.actionRow, { borderTopColor: colors.border, borderBottomColor: colors.border, borderBottomWidth: 1 }]}
                        onPress={handleFeedbackForm}
                    >
                        <Ionicons name="chatbox-ellipses-outline" size={22} color={colors.header} />
                        <Text style={[styles.actionLabel, { color: colors.text }]}>Share Feedback</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.footer}>
                    <Text style={[styles.footerText, { color: colors.secondaryText }]}>Version 1.0.1 Premium</Text>
                </View>

                <View style={styles.developerArea}>
                    <Text style={[styles.devLabel, { color: colors.secondaryText }]}>Built with ❤️ by</Text>
                    <TouchableOpacity 
                        onPress={() => router.push('/developer')}
                        style={[styles.devChip, { backgroundColor: colors.surface, borderColor: colors.border }]}
                    >
                        <Ionicons name="person-circle-outline" size={20} color={colors.header} style={{ marginRight: 8 }} />
                        <Text style={[styles.devChipText, { color: colors.header }]}>@anilmonitor</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

function FeatureItem({ icon, text, colors }: { icon: any, text: string, colors: any }) {
    return (
        <View style={styles.featureItem}>
            <Ionicons name={icon} size={20} color={colors.header} />
            <Text style={[styles.featureText, { color: colors.text }]}>{text}</Text>
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
        paddingBottom: 120,
    },
    heroArea: {
        alignItems: 'center',
        paddingTop: 50,
        paddingBottom: 30,
    },
    appName: {
        fontSize: 32,
        fontWeight: '800',
        marginTop: 20,
    },
    appVersion: {
        fontSize: 14,
        marginTop: 5,
        fontWeight: '600',
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    simpleDescription: {
        fontSize: 15,
        lineHeight: 22,
        textAlign: 'center',
        marginTop: 25,
        paddingHorizontal: 40,
        opacity: 0.8,
    },
    featuresArea: {
        paddingHorizontal: 40,
        marginBottom: 30,
    },
    featureItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    featureText: {
        marginLeft: 15,
        fontSize: 15,
        fontWeight: '500',
    },
    actionSection: {
        marginTop: 10,
    },
    actionRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 20,
        paddingHorizontal: 35,
        borderTopWidth: 1,
    },
    actionLabel: {
        marginLeft: 20,
        fontSize: 16,
        fontWeight: '700',
    },
    developerArea: {
        alignItems: 'center',
        marginTop: 20,
        paddingTop: 10,
    },
    devLabel: {
        fontSize: 11,
        fontWeight: '500',
        textTransform: 'uppercase',
        letterSpacing: 2,
        opacity: 0.6,
    },
    devChip: {
        marginTop: 12,
        paddingVertical: 10,
        paddingHorizontal: 25,
        borderRadius: 100,
        borderWidth: 1,
        flexDirection: 'row',
        alignItems: 'center',
    },
    devChipText: {
        fontSize: 16,
        fontWeight: '700',
    },
    hireButton: {
        marginTop: 20,
        paddingVertical: 12,
        paddingHorizontal: 40,
        borderRadius: 12,
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 5,
    },
    hireButtonText: {
        color: 'white',
        fontSize: 14,
        fontWeight: '800',
        letterSpacing: 1.5,
    },
    socialActionRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 15,
        paddingHorizontal: 35,
    },
    smallSocialChip: {
        width: 48,
        height: 48,
        borderRadius: 12,
        borderWidth: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    footer: {
        alignItems: 'center',
        paddingVertical: 35,
    },
    footerText: {
        fontSize: 12,
        fontWeight: '700',
        textTransform: 'uppercase',
        letterSpacing: 1.5,
        opacity: 0.4,
    },
});
