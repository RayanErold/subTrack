import { useSubscriptionStore } from '../store/useSubscriptionStore';
import Colors from '../constants/Colors';

export function useTheme() {
    const { theme } = useSubscriptionStore();

    const currentPrimary = theme.enabled ? theme.primaryColor : Colors.dark.primary;
    const currentSecondary = theme.enabled ? theme.secondaryColor : Colors.dark.secondary;
    const currentBg = theme.enabled ? theme.backgroundColor : Colors.dark.background;
    const currentFont = (theme.enabled && theme.font !== 'System') ? theme.font : undefined;

    const isLightBg = theme.enabled && (currentBg === '#ffffff' || currentBg.toLowerCase() === 'white');
    
    return {
        theme,
        isLightBg,
        currentPrimary,
        currentSecondary,
        currentBg,
        currentFont,
        textColor: isLightBg ? '#000' : '#fff',
        subTextColor: isLightBg ? '#444' : '#666',
        cardBg: isLightBg ? 'rgba(0,0,0,0.05)' : 'rgba(255,255,255,0.05)',
        inputBg: isLightBg ? 'rgba(0,0,0,0.03)' : 'rgba(255,255,255,0.05)',
    };
}
