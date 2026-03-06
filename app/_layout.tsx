import { Ionicons } from '@expo/vector-icons';
import { DrawerContentScrollView, DrawerItem, DrawerItemList } from '@react-navigation/drawer';
import * as Notifications from 'expo-notifications';
import { Drawer } from 'expo-router/drawer';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { Platform, Share, StyleSheet, Text, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync().catch(() => { });

// Request permissions on startup
const requestPermissions = async () => {
  if (Platform.OS === 'web') return false;
  try {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    return finalStatus === 'granted';
  } catch (e) {
    return false;
  }
};

// Custom Drawer Content for "Premium" look
function CustomDrawerContent(props: any) {
  const handleShare = async () => {
    try {
      await Share.share({
        message: 'Master your daily missions with Remi Todo! Download the premium todo app for peak productivity: https://play.google.com/store/apps/details?id=com.monitorweb.remitodo',
        title: 'Remi Todo App',
      });
    } catch (error) {
      console.error(error);
    }
  };

  const filteredProps = {
    ...props,
    state: {
      ...props.state,
      routes: props.state.routes.filter((route: any) =>
        ['index', 'history', 'about', 'help', 'privacy', 'terms'].includes(route.name)
      ),
    },
  };

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.drawerHeader}>
        <View style={styles.logoCircle}>
          <Ionicons name="checkmark-done-circle" size={50} color="white" />
        </View>
        <Text style={styles.drawerTitle}>Remi Todo</Text>
        <Text style={styles.drawerSubtitle}>Mission: Possible</Text>
      </View>
      <DrawerContentScrollView {...props}>
        <DrawerItemList {...filteredProps} />

        <View style={styles.divider} />

        <DrawerItem
          label="Share App"
          icon={({ color, size }) => <Ionicons name="share-social-outline" size={size} color={color} />}
          onPress={handleShare}
        />
      </DrawerContentScrollView>
      <View style={styles.drawerFooter}>
        <Text style={styles.footerText}>Remi Todo v1.5 Premium</Text>
      </View>
    </View>
  );
}

export default function RootLayout() {
  useEffect(() => {
    requestPermissions();
    // Hide splash screen after 1 second to ensure UI is ready
    setTimeout(async () => {
      await SplashScreen.hideAsync().catch(() => { });
    }, 1000);
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Drawer
        drawerContent={(props) => <CustomDrawerContent {...props} />}
        screenOptions={{
          headerShown: true,
          headerStyle: { backgroundColor: '#007AFF' },
          headerTintColor: 'white',
          headerTitleStyle: { fontWeight: '800' },
          drawerActiveBackgroundColor: 'rgba(0, 122, 255, 0.08)',
          drawerActiveTintColor: '#007AFF',
          drawerInactiveTintColor: '#8E8E93',
          drawerLabelStyle: { fontSize: 16, fontWeight: '600', marginLeft: 10 },
          drawerItemStyle: { borderRadius: 12, marginVertical: 4 },
          drawerStyle: { width: 310 },
        }}
      >
        <Drawer.Screen
          name="index"
          options={{
            headerShown: false, // Hide native header for custom premium dashboard
            drawerLabel: 'My Dashboard',
            title: 'Remi Dashboard',
            drawerIcon: ({ color, size }) => (
              <Ionicons name="grid-outline" size={size} color={color} />
            ),
          }}
        />
        <Drawer.Screen
          name="history"
          options={{
            drawerLabel: 'Mission History',
            title: 'Completed List',
            drawerIcon: ({ color, size }) => (
              <Ionicons name="time-outline" size={size} color={color} />
            ),
          }}
        />
        <Drawer.Screen
          name="about"
          options={{
            drawerLabel: 'About Remi',
            title: 'About Us',
            drawerIcon: ({ color, size }) => (
              <Ionicons name="information-circle-outline" size={size} color={color} />
            ),
          }}
        />
        <Drawer.Screen
          name="help"
          options={{
            drawerLabel: 'Help & Support',
            title: 'Remi Help',
            drawerIcon: ({ color, size }) => (
              <Ionicons name="help-buoy-outline" size={size} color={color} />
            ),
          }}
        />
        <Drawer.Screen
          name="privacy"
          options={{
            drawerLabel: 'Privacy Policy',
            title: 'Remi Privacy',
            drawerIcon: ({ color, size }) => (
              <Ionicons name="shield-checkmark-outline" size={size} color={color} />
            ),
          }}
        />
        <Drawer.Screen
          name="terms"
          options={{
            drawerLabel: 'Terms of Service',
            title: 'Remi Terms',
            drawerIcon: ({ color, size }) => (
              <Ionicons name="document-text-outline" size={size} color={color} />
            ),
          }}
        />
      </Drawer>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  drawerHeader: {
    height: 240,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    padding: 24,
    borderBottomLeftRadius: 36,
    borderBottomRightRadius: 36,
    // Add a subtle bottom shadow for depth
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 15,
    elevation: 10,
  },
  logoCircle: {
    width: 80,
    height: 80,
    borderRadius: 24, // More Apple-like squircle
    backgroundColor: 'rgba(255,255,255,0.25)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.4)',
  },
  drawerTitle: {
    fontSize: 26,
    fontWeight: '900',
    color: 'white',
    letterSpacing: -0.5,
  },
  drawerSubtitle: {
    fontSize: 13,
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.7)',
    marginTop: 2,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  divider: {
    height: 1,
    backgroundColor: '#f2f2f7',
    marginVertical: 12,
    marginHorizontal: 15,
  },
  drawerFooter: {
    padding: 24,
    borderTopWidth: 1,
    borderTopColor: '#f2f2f7',
  },
  footerText: {
    fontSize: 12,
    color: '#8E8E93',
    textAlign: 'center',
    fontWeight: '600',
  },
});
