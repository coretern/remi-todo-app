import { Ionicons } from '@expo/vector-icons';
import { Stack, useRouter } from 'expo-router';
import React from 'react';
import {
    Image,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    Linking
} from 'react-native';
import { useTheme } from '../context/ThemeContext';

export default function DeveloperScreen() {
    const router = useRouter();
    const { colors } = useTheme();

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                <View style={styles.headerArea}>
                    <View style={[styles.avatarBorder, { borderColor: colors.header }]}>
                        <Image 
                            source={require('../assets/images/anil.jpeg')} 
                            style={styles.profileImage} 
                        />
                    </View>
                    <Text style={[styles.devName, { color: colors.text }]}>ANIL KUMAR</Text>
                    <Text style={[styles.devRole, { color: colors.secondaryText }]}>B.Tech CSE Student</Text>
                </View>

                <View style={styles.bioSection}>
                    <Text style={[styles.bioText, { color: colors.text }]}>
                        Hi, I&apos;m ANIL KUMAR! I am a B.Tech Computer Science student. Since I was in 8th or 9th class, I always dreamed of making my own apps and putting them on the Play Store. It was my childhood goal to see my work used by people around the world.
                    </Text>
                    <Text style={[styles.bioText, { color: colors.text }]}>
                        Today, I have made that dream come true! After many years of learning and hard work, I have successfully published Remi Todo. It took a lot of learning about coding and the publishing process to get here.
                    </Text>
                    <Text style={[styles.bioText, { color: colors.text }]}>
                        I made this app simple and private because I want everyone to have a clean, easy space for their daily tasks. Thank you for using my app and being part of my journey!
                    </Text>
                </View>

                <View style={[styles.socialSection, { borderTopColor: colors.border }]}>
                    <Text style={styles.socialLabel}>Follow My Journey</Text>
                    <View style={styles.socialGrid}>
                        <SocialChip icon="logo-youtube" label="Anil Monitor" url="https://youtube.com/@anilmonitor" colors={colors} iconColor="#FF0000" />
                        <SocialChip icon="logo-youtube" label="Anil Engineer" url="https://youtube.com/@ANILENGINEER" colors={colors} iconColor="#FF0000" />
                        <SocialChip icon="logo-youtube" label="Anil Vlog" url="https://youtube.com/@VLOGANIl" colors={colors} iconColor="#FF0000" />
                        <SocialChip icon="logo-linkedin" label="LinkedIn" url="https://www.linkedin.com/in/anilmonitor/" colors={colors} iconColor="#0077B5" />
                    </View>
                </View>

                <View style={styles.hireSection}>
                    <TouchableOpacity 
                        style={[styles.hireButton, { backgroundColor: colors.header }]}
                        onPress={() => Linking.openURL('mailto:anilarangi6@gmail.com?subject=Hiring Inquiry: App Developer')}
                    >
                        <Text style={styles.hireButtonText}>💼 HIRE ME @anilmonitor</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.footer}>
                    <Text style={[styles.versionText, { color: colors.secondaryText }]}>Remi Todo Developer</Text>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

function SocialChip({ icon, label, url, colors, iconColor }: { icon: any, label: string, url: string, colors: any, iconColor?: string }) {
    return (
        <TouchableOpacity 
            style={[styles.socialChip, { backgroundColor: colors.surface, borderColor: colors.border }]}
            onPress={() => Linking.openURL(url)}
        >
            <Ionicons name={icon} size={18} color={iconColor || "#FF0000"} />
            <Text style={[styles.socialText, { color: colors.text }]}>{label}</Text>
        </TouchableOpacity>
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
    headerArea: {
        alignItems: 'center',
        paddingVertical: 60,
    },
    avatarBorder: {
        width: 150,
        height: 150,
        borderRadius: 75,
        borderWidth: 2,
        padding: 6,
        marginBottom: 25,
    },
    profileImage: {
        width: '100%',
        height: '100%',
        borderRadius: 70,
    },
    devName: {
        fontSize: 32,
        fontWeight: '800',
    },
    devRole: {
        fontSize: 14,
        fontWeight: '600',
        textTransform: 'uppercase',
        letterSpacing: 1.5,
        marginTop: 8,
        opacity: 0.7,
    },
    bioSection: {
        paddingHorizontal: 35,
        marginBottom: 40,
    },
    bioText: {
        fontSize: 16,
        lineHeight: 26,
        textAlign: 'center',
        fontWeight: '500',
        opacity: 0.8,
        marginBottom: 20,
    },
    socialSection: {
        paddingTop: 30,
        paddingHorizontal: 25,
        borderTopWidth: 1,
    },
    socialLabel: {
        fontSize: 12,
        fontWeight: '700',
        color: '#666',
        textTransform: 'uppercase',
        letterSpacing: 2,
        textAlign: 'center',
        marginBottom: 20,
    },
    socialGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        gap: 10,
    },
    socialChip: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10,
        paddingHorizontal: 16,
        borderRadius: 100,
        borderWidth: 1,
    },
    socialText: {
        marginLeft: 8,
        fontSize: 13,
        fontWeight: '600',
    },
    hireSection: {
        alignItems: 'center',
        marginTop: 30,
        paddingHorizontal: 25,
    },
    hireButton: {
        paddingVertical: 14,
        paddingHorizontal: 30,
        borderRadius: 12,
        width: '100%',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 5,
        elevation: 3,
    },
    hireButtonText: {
        color: 'white',
        fontSize: 15,
        fontWeight: '800',
        letterSpacing: 1,
    },
    footer: {
        alignItems: 'center',
        marginTop: 50,
    },
    versionText: {
        fontSize: 12,
        fontWeight: '600',
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
});
