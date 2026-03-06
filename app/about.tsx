import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
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

export default function AboutScreen() {
    const router = useRouter();

    const handleContactEmail = () => {
        Linking.openURL('mailto:anilarangi6@gmail.com?subject=Support: Remi Todo App');
    };

    return (
        <SafeAreaView style={styles.container}>
            <Stack.Screen options={{
                title: 'About Remi',
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
                {/* Hero Section with Animated Feel */}
                <View style={styles.heroSection}>
                    <LinearGradient
                        colors={['rgba(0, 122, 255, 0.12)', 'transparent']}
                        style={styles.heroGradient}
                    />
                    <View style={styles.logoContainer}>
                        <View style={styles.logoCircle}>
                            <Ionicons name="checkmark-done-circle" size={56} color="white" />
                        </View>
                    </View>
                    <Text style={styles.appName}>Remi Todo</Text>
                    <Text style={styles.tagline}>Master Your Daily Missions</Text>
                    <View style={styles.versionBadge}>
                        <Text style={styles.versionText}>v1.5.0 Premium</Text>
                    </View>
                </View>

                {/* Core Mission Section */}
                <View style={[styles.card, styles.missionCard]}>
                    <Text style={styles.cardTitle}>Our Core Mission</Text>
                    <Text style={styles.cardText}>
                        Remi Todo isn't just another task list. It's a sanctuary for your productivity.
                        Designed with a minimalist heart and a premium soul, we help you eliminate noise
                        and focus on what truly matters: **Your Progress.**
                    </Text>
                </View>

                {/* Why Remi? Features with Premium Icons */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Why Choose Remi?</Text>

                    <View style={styles.featureGrid}>
                        <FeatureCard
                            icon="shield-checkmark"
                            title="Private"
                            desc="100% Local Data"
                        />
                        <FeatureCard
                            icon="notifications"
                            title="Smart Alarms"
                            desc="Never miss a goal"
                        />
                        <FeatureCard
                            icon="color-palette"
                            title="Aesthetic"
                            desc="Glassmorphism UI"
                        />
                        <FeatureCard
                            icon="flash"
                            title="Speed"
                            desc="Native Performance"
                        />
                    </View>
                </View>

                {/* Support & Legal Links */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Support & Links</Text>

                    <TouchableOpacity
                        style={styles.listItem}
                        onPress={handleContactEmail}
                        activeOpacity={0.6}
                    >
                        <View style={[styles.listIcon, { backgroundColor: '#E1F5FE' }]}>
                            <Ionicons name="mail" size={22} color="#03A9F4" />
                        </View>
                        <View style={styles.listTextContent}>
                            <Text style={styles.listTitle}>Contact Support</Text>
                            <Text style={styles.listSubtitle}>anilarangi6@gmail.com</Text>
                        </View>
                        <Ionicons name="chevron-forward" size={20} color="#CCC" />
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.listItem}
                        onPress={() => router.push('/privacy')}
                        activeOpacity={0.6}
                    >
                        <View style={[styles.listIcon, { backgroundColor: '#E8F5E9' }]}>
                            <Ionicons name="lock-closed" size={22} color="#4CAF50" />
                        </View>
                        <View style={styles.listTextContent}>
                            <Text style={styles.listTitle}>Privacy Policy</Text>
                            <Text style={styles.listSubtitle}>Your data security</Text>
                        </View>
                        <Ionicons name="chevron-forward" size={20} color="#CCC" />
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.listItem}
                        onPress={() => router.push('/terms')}
                        activeOpacity={0.6}
                    >
                        <View style={[styles.listIcon, { backgroundColor: '#FFF3E0' }]}>
                            <Ionicons name="document-text" size={22} color="#FF9800" />
                        </View>
                        <View style={styles.listTextContent}>
                            <Text style={styles.listTitle}>Terms of Service</Text>
                            <Text style={styles.listSubtitle}>Usage guidelines</Text>
                        </View>
                        <Ionicons name="chevron-forward" size={20} color="#CCC" />
                    </TouchableOpacity>
                </View>

                {/* Developer Footer */}
                <View style={styles.footer}>
                    <Text style={styles.footerText}>Designed with ❤️ by ANIL</Text>
                    <Text style={styles.copyright}>© 2026 Remi Todo App. All rights reserved.</Text>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const FeatureCard = ({ icon, title, desc }: { icon: any, title: string, desc: string }) => (
    <View style={styles.featureCard}>
        <Ionicons name={icon} size={28} color="#007AFF" style={styles.featureIcon} />
        <Text style={styles.featureTitle}>{title}</Text>
        <Text style={styles.featureDesc}>{desc}</Text>
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
    heroSection: {
        alignItems: 'center',
        paddingVertical: 40,
        position: 'relative',
    },
    heroGradient: {
        ...StyleSheet.absoluteFillObject,
        height: 200,
    },
    logoContainer: {
        marginBottom: 15,
    },
    logoCircle: {
        width: 100,
        height: 100,
        borderRadius: 28, // SQUIRCLE!
        backgroundColor: '#007AFF',
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#007AFF',
        shadowOffset: { width: 0, height: 12 },
        shadowOpacity: 0.3,
        shadowRadius: 20,
        elevation: 15,
    },
    appName: {
        fontSize: 32,
        fontWeight: '900',
        color: '#1A1A1A',
        letterSpacing: -1,
        marginTop: 10,
    },
    tagline: {
        fontSize: 16,
        color: '#666',
        marginTop: 4,
        fontWeight: '500',
    },
    versionBadge: {
        backgroundColor: 'rgba(0, 122, 255, 0.1)',
        paddingHorizontal: 16,
        paddingVertical: 6,
        borderRadius: 20,
        marginTop: 15,
    },
    versionText: {
        color: '#007AFF',
        fontSize: 12,
        fontWeight: '700',
    },
    section: {
        marginTop: 30,
        paddingHorizontal: 20,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: '800',
        color: '#1A1A1A',
        marginBottom: 16,
    },
    card: {
        marginHorizontal: 20,
        backgroundColor: 'white',
        borderRadius: 24,
        padding: 24,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 2,
    },
    missionCard: {
        marginTop: 10,
        borderLeftWidth: 5,
        borderLeftColor: '#007AFF',
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#1A1A1A',
        marginBottom: 10,
    },
    cardText: {
        fontSize: 15,
        color: '#555',
        lineHeight: 24,
    },
    featureGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    featureCard: {
        width: '48%',
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 16,
        marginBottom: 15,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOpacity: 0.03,
        shadowRadius: 10,
        elevation: 1,
    },
    featureIcon: {
        marginBottom: 10,
    },
    featureTitle: {
        fontSize: 14,
        fontWeight: '700',
        color: '#1A1A1A',
    },
    featureDesc: {
        fontSize: 11,
        color: '#888',
        marginTop: 2,
        textAlign: 'center',
    },
    listItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'white',
        padding: 16,
        borderRadius: 18,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOpacity: 0.03,
        shadowRadius: 10,
        elevation: 1,
    },
    listIcon: {
        width: 44,
        height: 44,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 16,
    },
    listTextContent: {
        flex: 1,
    },
    listTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: '#1A1A1A',
    },
    listSubtitle: {
        fontSize: 13,
        color: '#888',
    },
    footer: {
        marginTop: 40,
        alignItems: 'center',
        paddingBottom: 20,
    },
    footerText: {
        fontSize: 14,
        color: '#666',
        fontWeight: '600',
    },
    copyright: {
        fontSize: 12,
        color: '#AAA',
        marginTop: 4,
    }
});
