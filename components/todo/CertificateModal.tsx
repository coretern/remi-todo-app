import { Ionicons } from '@expo/vector-icons';
import React, { useRef, useState } from 'react';
import {
    Alert,
    Dimensions,
    Image,
    Modal,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import ViewShot, { captureRef } from 'react-native-view-shot';
import * as MediaLibrary from 'expo-media-library';

const { width } = Dimensions.get('window');
const CERT_WIDTH = width * 0.85;
const QR_IMAGE = require('../../assets/images/remi-todo-qr-url.jpeg');

interface Props {
    visible: boolean;
    selectedCert: any;
    onClose: () => void;
}

export default function CertificateModal({ visible, selectedCert, onClose }: Props) {
    const viewRef = useRef<any>(null);
    const [isSaving, setIsSaving] = useState(false);

    const handleDownload = async () => {
        if (!viewRef.current) return;
        
        setIsSaving(true);
        try {
            const { status, canAskAgain } = await MediaLibrary.getPermissionsAsync();
            let finalStatus = status;
            if (status !== 'granted' && canAskAgain) {
                const { status: newStatus } = await MediaLibrary.requestPermissionsAsync(false);
                finalStatus = newStatus;
            }

            if (finalStatus !== 'granted') {
                Alert.alert("Permission Required", "Please enable Gallery access in settings to save your achievement.");
                setIsSaving(false);
                return;
            }

            const uri = await captureRef(viewRef, {
                format: 'jpg',
                quality: 1.0,
            });

            await MediaLibrary.saveToLibraryAsync(uri);
            Alert.alert("Victory Saved! ✅", "Your professional certificate has been added to your gallery! Excellent work!");
            onClose();
        } catch (error) {
            console.error(error);
            Alert.alert("Save Error", "Could not save to gallery. Please check your storage settings.");
        } finally {
            setIsSaving(false);
        }
    };

    if (!selectedCert) return null;

    return (
        <Modal
            visible={visible}
            transparent={true}
            animationType="fade"
            onRequestClose={onClose}
        >
            <View style={styles.modalOverlay}>
                <TouchableOpacity style={styles.dismissOverlay} activeOpacity={1} onPress={onClose} />
                
                <ScrollView 
                    style={{ width: '100%' }}
                    contentContainerStyle={styles.modalScroll}
                    showsVerticalScrollIndicator={false}
                >
                    <ViewShot ref={viewRef} options={{ format: 'jpg', quality: 1.0 }}>
                        <LinearGradient
                            colors={['#1A1A1A', '#000000']}
                            style={styles.certCard}
                        >
                            <View style={styles.certBorder}>
                                <View style={styles.certInner}>
                                    <View style={styles.brandingHeader}>
                                        <View style={styles.qrHeaderRow}>
                                            <Image source={QR_IMAGE} style={styles.qrHeaderImageOnly} />
                                            <View style={styles.headerTitleCol}>
                                                <Text style={styles.headerBrandName}>REMI TODO</Text>
                                                <Text style={styles.headerBrandSub}>Pro Mission Tracker</Text>
                                            </View>
                                        </View>
                                        <Ionicons name="ribbon" size={44} color="#FFD700" />
                                    </View>

                                    <View style={styles.titleGroup}>
                                        <Text style={styles.certTitle} numberOfLines={1} adjustsFontSizeToFit>CERTIFICATE</Text>
                                        <Text style={styles.certSubtitle} numberOfLines={1} adjustsFontSizeToFit>OF MISSION MASTERY</Text>
                                    </View>
                                    
                                    <View style={styles.certPresentedCol}>
                                        <Text style={styles.certPresented}>This is proudly presented to</Text>
                                        <Text style={styles.userNameText}>{selectedCert?.userName || 'A Champion'}</Text>
                                    </View>
                                    
                                    <Text style={styles.certBodyMain}>
                                        Successfully completed <Text style={{ color: '#FFD700', fontWeight: '900' }}>{selectedCert?.streakTarget} DAY STREAK</Text> from {new Date(selectedCert?.createdAt || 0).toLocaleDateString('en-GB', { day: 'numeric', month: 'long' })} to {new Date(selectedCert?.completedAt || 0).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })} on {selectedCert?.task}
                                    </Text>

                                    <View style={styles.sealFooterRow}>
                                        <Ionicons name="shield-checkmark" size={24} color="#FFD700" />
                                        <View style={styles.sealTextCol}>
                                            <Text style={styles.sealText}>OFFICIAL REMI ACHIEVEMENT</Text>
                                            <Text style={styles.sealUrlText}>www.remi-todo-app.vercel.app</Text>
                                        </View>
                                    </View>
                                </View>
                            </View>
                        </LinearGradient>
                    </ViewShot>

                    {/* Actions Bar */}
                    <View style={styles.certButtons}>
                        <TouchableOpacity style={styles.btnClose} onPress={onClose}>
                            <Ionicons name="close" size={24} color="white" />
                        </TouchableOpacity>
                        
                        <TouchableOpacity 
                            style={styles.btnDownload} 
                            onPress={handleDownload}
                            disabled={isSaving}
                        >
                            <Ionicons name={isSaving ? "sync" : "save-outline"} size={24} color="#000" />
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.95)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    dismissOverlay: {
        position: 'absolute',
        top: 0, left: 0, right: 0, bottom: 0
    },
    modalScroll: {
        alignItems: 'center',
        paddingVertical: 50,
        paddingHorizontal: 20
    },
    certCard: {
        width: CERT_WIDTH,
        aspectRatio: 0.8,
        borderRadius: 24,
        padding: 8,
        justifyContent: 'center',
        backgroundColor: '#000',
        elevation: 10,
        shadowColor: '#FFD700',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.2,
        shadowRadius: 20
    },
    certBorder: {
        flex: 1,
        borderWidth: 2,
        borderColor: '#FFD700',
        padding: 4,
        borderRadius: 20,
    },
    certInner: {
        flex: 1,
        padding: 18,
        borderRadius: 16,
        alignItems: 'center',
        backgroundColor: 'transparent',
        justifyContent: 'space-between'
    },
    brandingHeader: {
        flexDirection: 'row',
        width: '100%',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    qrHeaderRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    qrHeaderImageOnly: {
        width: 60,
        height: 60,
    },
    headerTitleCol: {
        marginLeft: 12
    },
    headerBrandName: {
        color: '#FFD700',
        fontSize: 18,
        fontWeight: '900',
        letterSpacing: 1
    },
    headerBrandSub: {
        color: 'rgba(255,255,255,0.6)',
        fontSize: 8,
        fontWeight: '800',
        textTransform: 'uppercase',
        letterSpacing: 0.5
    },
    titleGroup: {
        alignItems: 'center',
        width: '100%',
        paddingHorizontal: 5,
    },
    certTitle: {
        color: '#FFD700',
        fontSize: 30,
        fontWeight: '900',
        letterSpacing: 3,
        textAlign: 'center',
    },
    certSubtitle: {
        color: 'white',
        fontSize: 10,
        fontWeight: '800',
        letterSpacing: 2,
        marginTop: 4,
        textAlign: 'center',
    },
    certPresentedCol: {
        alignItems: 'center',
    },
    certPresented: {
        color: 'rgba(255,255,255,0.6)',
        fontSize: 9,
        fontWeight: '700',
        textTransform: 'uppercase',
        letterSpacing: 1
    },
    userNameText: {
        color: 'white',
        fontSize: 24,
        fontWeight: '900',
        marginVertical: 4,
        textTransform: 'uppercase',
        textAlign: 'center'
    },
    certBodyMain: {
        color: 'white',
        fontSize: 13,
        textAlign: 'center',
        lineHeight: 22,
        marginHorizontal: 5,
        fontWeight: '700',
    },
    sealFooterRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 8
    },
    sealTextCol: {
        marginLeft: 8,
    },
    sealText: {
        color: '#FFD700',
        fontSize: 10,
        fontWeight: '900',
        letterSpacing: 1
    },
    sealUrlText: {
        color: 'rgba(255,215,0,0.6)',
        fontSize: 8,
        fontWeight: '800',
        marginTop: 2,
        letterSpacing: 0.5,
        alignSelf: 'center',
    },
    certButtons: {
        flexDirection: 'row',
        width: CERT_WIDTH,
        justifyContent: 'space-between',
        marginTop: 30,
        alignItems: 'center'
    },
    btnClose: {
        width: 50,
        height: 50,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 25,
        backgroundColor: 'rgba(255,255,255,0.1)'
    },
    btnDownload: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: '#FFD700',
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 5,
        shadowColor: '#FFD700',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8
    },
});
