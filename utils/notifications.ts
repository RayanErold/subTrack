
import * as Notifications from 'expo-notifications';
import { Platform, Linking } from 'react-native';
import { differenceInSeconds, subDays } from 'date-fns';

// Configure notification handler
Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
        shouldShowBanner: true,
        shouldShowList: true,
    }),
});

// Listener for interacting with notifications
Notifications.addNotificationResponseReceivedListener(response => {
    const url = response.notification.request.content.data.cancelUrl as string;
    if (url) {
        Linking.openURL(url).catch(err => console.error("Could not open URL", err));
    }
});

export async function registerForPushNotificationsAsync() {
    if (Platform.OS === 'web') {
        return;
    }

    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
    }

    if (finalStatus !== 'granted') {
        console.log('Failed to get push token for push notification!');
        return;
    }
}

export async function scheduleRenewalNotification(
    title: string,
    renewalDate: string,
    isPremium: boolean,
    cancelUrl?: string
) {
    if (Platform.OS === 'web') return;

    const targetDate = new Date(renewalDate);
    targetDate.setHours(9, 0, 0, 0); // 9 AM

    const scheduleForDate = async (triggerDate: Date, body: string) => {
        const now = new Date();
        const secondsUntil = differenceInSeconds(triggerDate, now);

        if (secondsUntil <= 0) return;

        await Notifications.scheduleNotificationAsync({
            content: {
                title: `${title} Renewal Warning`,
                body: body,
                data: { cancelUrl }
            },
            trigger: {
                type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
                seconds: secondsUntil,
                repeats: false,
            },
        });
    };

    // 1 Day Before (Default)
    const oneDayBefore = subDays(targetDate, 1);
    const bodySuffix = cancelUrl && isPremium ? "\nTap to open Cancel Link." : "";
    await scheduleForDate(oneDayBefore, `Your subscription for ${title} renews tomorrow!${bodySuffix}`);

    // 7 Days Before (Premium Only)
    if (isPremium) {
        const sevenDaysBefore = subDays(targetDate, 7);
        await scheduleForDate(sevenDaysBefore, `Heads up! ${title} renews in 7 days.${bodySuffix}`);
    }
}
