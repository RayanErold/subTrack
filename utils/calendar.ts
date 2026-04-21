
import { Linking } from 'react-native';

export function openGoogleCalendar(title: string, date: string, details: string) {
    const startDate = new Date(date);
    if (isNaN(startDate.getTime())) {
        console.warn("Invalid date for calendar");
        return;
    }
    const endDate = new Date(startDate.getTime() + 60 * 60 * 1000); // 1 hour event

    const format = (d: Date) => d.toISOString().replace(/-|:|\.|Z/g, "").slice(0, 15) + 'Z';

    const url = `https://www.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(title)}&details=${encodeURIComponent(details)}&dates=${format(startDate)}/${format(endDate)}`;

    Linking.openURL(url).catch(err => {
        console.error("Failed to open calendar URL:", err);
    });
}
