import AsyncStorage from '@react-native-async-storage/async-storage';
import { db } from './firebase';
import { collection, doc, setDoc, getDocs, deleteDoc, query, orderBy } from 'firebase/firestore';

const CALENDAR_API_URL = 'https://www.googleapis.com/calendar/v3/calendars/primary/events';

export const SyncService = {
  
  /**
   * Pushes a mission to the user's primary Google Calendar (Uses access token in Production)
   */
  async pushToCalendar(task: string, dueDate?: number, reminderOffset?: number) {
    const email = await AsyncStorage.getItem('sync_email');
    const syncMode = await AsyncStorage.getItem('sync_mode');
    if (!email || syncMode === 'Off') return;

    // Use current date if no due date provided
    const startTime = dueDate ? new Date(dueDate).toISOString() : new Date().toISOString();
    const endTime = new Date(new Date(startTime).getTime() + 3600 * 1000).toISOString();

    console.log(`[Calendar] Mission "${task}" ready for Calendar Sync for ${email} with ${reminderOffset || 0}m reminder`);
    // In Production: fetch(CALENDAR_API_URL, { headers: { Authorization: token }, body: { ... reminders: { useDefault: false, overrides: [{ method: 'popup', minutes: reminderOffset }] } } })
  },

  /**
   * Backs up the entire mission list to Firestore forever
   */
  async backupToCloud(todos: any[]) {
    const email = await AsyncStorage.getItem('sync_email');
    const syncMode = await AsyncStorage.getItem('sync_mode');
    
    // Stop if no email or sync is disabled
    if (!email || syncMode === 'Off') return;

    try {
      const userRef = doc(db, 'users', email.toLowerCase());
      const missionsRef = collection(userRef, 'missions');

      // We use the email to create a safe, permanent container for missions
      for (const todo of todos) {
        // CLEAN DATA: Remove 'undefined' fields so Firestore doesn't error
        const cleanTodo = JSON.parse(JSON.stringify(todo));
        
        await setDoc(doc(missionsRef, todo.id), {
          ...cleanTodo,
          updatedAt: Date.now(),
        }, { merge: true });
      }

      console.log(`[Backup] Synced ${todos.length} missions for ${email}`);
    } catch (error) {
      console.error('[Backup Error]', error);
    }
  },

  /**
   * Restores mission history from Firestore upon login
   */
  async restoreFromCloud() {
    const email = await AsyncStorage.getItem('sync_email');
    if (!email) return [];

    try {
      console.log(`[Restore] Fetching mission history for ${email}...`);
      const userRef = doc(db, 'users', email.toLowerCase());
      const missionsQuery = query(collection(userRef, 'missions'), orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(missionsQuery);
      
      const restored = querySnapshot.docs.map(doc => doc.data());
      console.log(`[Restore] Successfully recovered ${restored.length} missions!`);
      return restored;
    } catch (error) {
      console.error('[Restore Error]', error);
      return [];
    }
  },

  /**
   * Deletes a specific mission from the cloud
   */
  async deleteFromCloud(todoId: string) {
    const email = await AsyncStorage.getItem('sync_email');
    if (!email) return;

    try {
      const userRef = doc(db, 'users', email.toLowerCase());
      const missionRef = doc(userRef, 'missions', todoId);
      await deleteDoc(missionRef);
      console.log(`[Delete] Mission ${todoId} removed from Cloud`);
    } catch (error) {
      console.error('[Delete Error]', error);
    }
  }
};
