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

export default function LegalScreen() {
    const router = useRouter();
    const { colors, theme } = useTheme();

    const legalItems = [
        { title: 'Privacy Policy', icon: 'shield-checkmark-outline', path: '/privacy' },
        { title: 'Terms of Service', icon: 'document-text-outline', path: '/terms' },
    ];

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>

            <ScrollView contentContainerStyle={styles.scrollContent}>
                <View style={styles.contentHeader}>
                    <Ionicons name="shield-outline" size={48} color={colors.header} />
                    <Text style={[styles.mainTitle, { color: colors.text }]}>Legal Info</Text>
                </View>

                <View style={styles.listContainer}>
                    {legalItems.map((item, index) => (
                        <TouchableOpacity 
                            key={index}
                            style={[styles.listItem, { borderBottomColor: colors.border }]}
                            onPress={() => router.push(item.path as any)}
                        >
                            <View style={styles.itemLeft}>
                                <Ionicons name={item.icon as any} size={22} color={colors.header} />
                                <Text style={[styles.itemText, { color: colors.text }]}>{item.title}</Text>
                            </View>
                            <Ionicons name="chevron-forward" size={18} color={colors.secondaryText} />
                        </TouchableOpacity>
                    ))}
                </View>

                <View style={styles.footer}>
                    <Text style={[styles.footerText, { color: colors.secondaryText }]}>Version 1.0.1 Premium</Text>
                </View>
            </ScrollView>
        </SafeAreaView>
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
    listContainer: {
        paddingHorizontal: 25,
    },
    listItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 20,
        borderBottomWidth: 1,
    },
    itemLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    itemText: {
        fontSize: 16,
        fontWeight: '700',
        marginLeft: 15,
    },
    footer: {
        alignItems: 'center',
        marginTop: 50,
    },
    footerText: {
        fontSize: 12,
        fontWeight: '600',
        textTransform: 'uppercase',
    },
});
