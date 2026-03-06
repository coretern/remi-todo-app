import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
        borderRadius: 24,
        marginVertical: 10,
        marginHorizontal: 16,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        // Premium Apple Shadow
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.1,
        shadowRadius: 16,
        elevation: 8,
    },
    content: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 20,
        paddingLeft: 16,
    },
    textContainer: {
        flex: 1,
        marginLeft: 18,
    },
    text: {
        fontSize: 17, // iOS Standard body size
        color: '#1C1C1E',
        fontWeight: '700',
        letterSpacing: -0.5,
    },
    completedText: {
        textDecorationLine: 'line-through',
        color: '#C7C7CC',
        fontWeight: '500',
    },
    alarmRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 6,
        backgroundColor: 'rgba(0, 122, 255, 0.08)',
        alignSelf: 'flex-start',
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: 8,
    },
    alarmText: {
        fontSize: 11,
        color: '#007AFF', // iOS blue
        fontWeight: '700',
        marginLeft: 4,
    },
    creationText: {
        fontSize: 10,
        color: '#BCBCC0',
        marginTop: 8,
        fontWeight: '600',
        letterSpacing: 0.2,
        textTransform: 'uppercase',
    },
    deleteButton: {
        paddingHorizontal: 20,
        paddingVertical: 15,
    },
    checkbox: {
        width: 26,
        height: 26,
        borderRadius: 13, // Circular
        borderWidth: 2,
        borderColor: '#E5E5EA', // iOS separator/mid-gray
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'white',
    },
    checkboxChecked: {
        backgroundColor: '#34C759', // iOS Green
        borderColor: '#34C759',
    },
});
