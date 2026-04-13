import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
    container: {
        backgroundColor: '#003366', // Saturated Med Navy
        borderRadius: 16,
        marginVertical: 6,
        marginHorizontal: 16,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.1)',
        elevation: 0,
        overflow: 'hidden',
    },
    content: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        paddingLeft: 16,
    },
    textContainer: {
        flex: 1,
        marginLeft: 15,
        marginRight: 10,
    },
    text: {
        fontSize: 16,
        color: 'white',
        fontWeight: '600',
        letterSpacing: -0.2,
    },
    taskScroll: {
        flex: 1,
    },
    completedText: {
        textDecorationLine: 'line-through',
        color: 'rgba(255, 255, 255, 0.3)',
        fontWeight: '500',
    },
    timestamp: {
        fontSize: 8,
        color: 'rgba(255, 255, 255, 0.25)',
        marginTop: 1,
        fontWeight: '500',
    },
    alarmRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 4,
    },
    alarmText: {
        fontSize: 10,
        color: '#0EA5E9',
        fontWeight: '700',
        marginLeft: 6,
        opacity: 0.8,
    },
    deleteButton: {
        width: 38,
        height: 44,
        alignItems: 'center',
        justifyContent: 'center',
    },
    checkbox: {
        width: 22,
        height: 22,
        borderRadius: 6, // Slightly squared like the reference
        borderWidth: 2,
        borderColor: 'rgba(255, 255, 255, 0.2)',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'transparent',
    },
    checkboxChecked: {
        backgroundColor: '#0EA5E9',
        borderColor: '#0EA5E9',
    },
});
