import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, Switch, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AppFonts, BackgroundColors, ThemePresets } from '../../constants/Colors';

interface CustomizationSectionProps {
    theme: any;
    setTheme: (theme: any) => void;
    isPremium: boolean;
    currency: string;
    currentPrimary: string;
    textColor: string;
    subTextColor: string;
    cardBg: string;
    currentBg: string;
    currentFont: string;
    currentSecondary: string;
}

export function CustomizationSection({
    theme,
    setTheme,
    isPremium,
    currency,
    currentPrimary,
    textColor,
    subTextColor,
    cardBg,
    currentBg,
    currentFont,
    currentSecondary
}: CustomizationSectionProps) {
    const [showCustomization, setShowCustomization] = useState(false);

    return (
        <View style={[styles.card, { backgroundColor: cardBg }]}>
            <Pressable
                style={styles.collapsibleHeader}
                onPress={() => isPremium ? setShowCustomization(!showCustomization) : Alert.alert('Premium Required', 'Please upgrade to access customization.')}
            >
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Ionicons name="color-palette-outline" size={20} color={currentPrimary} />
                    <Text style={[styles.sectionHeaderText, { color: currentPrimary }]}>Customization</Text>
                    {!isPremium && <Ionicons name="lock-closed" size={12} color="#666" style={{ marginLeft: 6 }} />}
                </View>
                <Ionicons
                    name={showCustomization ? "chevron-up" : "chevron-down"}
                    size={20}
                    color={subTextColor}
                />
            </Pressable>

            {showCustomization && (
                <View style={{ marginTop: 20 }}>
                    <View style={styles.toggleRowCompact}>
                        <Text style={[styles.rowTitle, { color: textColor }]}>Enable Theme</Text>
                        <Switch
                            value={theme.enabled}
                            onValueChange={(val) => setTheme({ enabled: val })}
                            trackColor={{ false: '#333', true: currentPrimary }}
                            thumbColor="#fff"
                        />
                    </View>

                    <View style={{ opacity: theme.enabled ? 1 : 0.5 }} pointerEvents={theme.enabled ? 'auto' : 'none'}>
                        <Text style={[styles.subLabel, { color: subTextColor }]}>Theme Presets</Text>
                        <View style={styles.presetGrid}>
                            {ThemePresets.map((preset) => (
                                <Pressable
                                    key={preset.name}
                                    onPress={() => setTheme({ primaryColor: preset.primary, secondaryColor: preset.secondary })}
                                    style={[
                                        styles.presetCard,
                                        { backgroundColor: cardBg, borderColor: theme.primaryColor === preset.primary ? currentPrimary : 'transparent' }
                                    ]}
                                >
                                    <View style={styles.presetPreview}>
                                        <View style={[styles.previewCircle, { backgroundColor: preset.primary }]} />
                                        <View style={[styles.previewCircle, { backgroundColor: preset.secondary, marginLeft: -8 }]} />
                                    </View>
                                    <Text style={[styles.presetName, { color: textColor }]}>{preset.name}</Text>
                                </Pressable>
                            ))}
                        </View>

                        <Text style={[styles.subLabel, { color: subTextColor }]}>Background Style</Text>
                        <View style={styles.colorGrid}>
                            {BackgroundColors.map((bg) => (
                                <Pressable
                                    key={bg.name}
                                    onPress={() => setTheme({ backgroundColor: bg.value })}
                                    style={[
                                        styles.bgOption,
                                        { backgroundColor: bg.value },
                                        { borderColor: currentBg === bg.value ? currentPrimary : 'rgba(255,255,255,0.1)' }
                                    ]}
                                >
                                    {currentBg === bg.value && <Ionicons name="checkmark" size={16} color={bg.value === '#ffffff' ? '#000' : '#fff'} />}
                                </Pressable>
                            ))}
                        </View>

                        <Text style={[styles.subLabel, { color: subTextColor }]}>Typography</Text>
                        <View style={styles.fontList}>
                            {AppFonts.map((font) => (
                                <Pressable
                                    key={font}
                                    onPress={() => setTheme({ font })}
                                    style={[
                                        styles.fontOption,
                                        { backgroundColor: cardBg, borderColor: currentFont === font ? currentPrimary : 'transparent' }
                                    ]}
                                >
                                    <Text style={[styles.fontPreview, { fontFamily: font === 'System' ? undefined : font, color: textColor }]}>
                                        {font}
                                    </Text>
                                </Pressable>
                            ))}
                        </View>
                    </View>

                    {/* Live Preview */}
                    <View style={[styles.previewSection, !theme.enabled && { opacity: 0.5 }, { marginTop: 24 }]}>
                        <View style={[styles.previewCard, { backgroundColor: theme.enabled ? currentBg : '#111', borderColor: theme.enabled ? currentPrimary : 'rgba(255,255,255,0.1)', borderRadius: 16 }]}>
                            <Text style={[styles.previewTitle, { fontFamily: currentFont === 'System' ? undefined : currentFont, fontSize: 14, marginBottom: 12, color: textColor }]}>Live Preview</Text>
                            <View style={styles.previewStats}>
                                <View style={[styles.statBox, { borderLeftColor: currentPrimary }]}>
                                    <Text style={[styles.statLabel, { color: subTextColor }]}>PRIMARY</Text>
                                    <Text style={[styles.statValue, { color: currentPrimary, fontSize: 16 }]}>{currency}49.99</Text>
                                </View>
                                <View style={[styles.statBox, { borderLeftColor: currentSecondary }]}>
                                    <Text style={[styles.statLabel, { color: subTextColor }]}>SECONDARY</Text>
                                    <Text style={[styles.statValue, { color: currentSecondary, fontSize: 16 }]}>2 Active</Text>
                                </View>
                            </View>
                            <Pressable style={[styles.previewButton, { backgroundColor: currentPrimary, paddingVertical: 8 }]}>
                                <Text style={[styles.buttonText, { fontSize: 12, color: '#fff' }]}>Looks Beautiful</Text>
                            </Pressable>
                        </View>
                    </View>
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: 'rgba(255,255,255,0.05)',
        marginTop: 20,
        borderRadius: 20,
        padding: 16,
    },
    sectionHeaderText: {
        fontSize: 14,
        fontWeight: 'bold',
        marginLeft: 8,
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    collapsibleHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    toggleRowCompact: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    rowTitle: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    subLabel: {
        color: '#666',
        fontSize: 12,
        fontWeight: 'bold',
        textTransform: 'uppercase',
        marginBottom: 12,
        marginTop: 8,
    },
    presetGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 10,
        marginBottom: 20,
    },
    presetCard: {
        width: '48%',
        backgroundColor: 'rgba(255,255,255,0.03)',
        borderRadius: 12,
        padding: 10,
        borderWidth: 1,
        alignItems: 'center',
    },
    presetPreview: {
        flexDirection: 'row',
        marginBottom: 6,
    },
    previewCircle: {
        width: 20,
        height: 20,
        borderRadius: 10,
        borderWidth: 2,
        borderColor: '#000',
    },
    presetName: {
        fontSize: 11,
        fontWeight: '600',
    },
    colorGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 10,
        marginBottom: 20,
    },
    bgOption: {
        width: 50,
        height: 35,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    fontList: {
        gap: 8,
    },
    fontOption: {
        padding: 12,
        backgroundColor: 'rgba(255,255,255,0.02)',
        borderRadius: 10,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.05)',
    },
    fontPreview: {
        fontSize: 14,
    },
    previewSection: {
        marginTop: 10,
    },
    previewCard: {
        padding: 20,
        borderRadius: 24,
        borderWidth: 1.5,
    },
    previewTitle: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    previewStats: {
        flexDirection: 'row',
        gap: 16,
        marginBottom: 20,
    },
    statBox: {
        flex: 1,
        borderLeftWidth: 3,
        paddingLeft: 10,
    },
    statLabel: {
        fontSize: 10,
        fontWeight: '900',
    },
    statValue: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    previewButton: {
        paddingVertical: 12,
        borderRadius: 12,
        alignItems: 'center',
    },
    buttonText: {
        fontWeight: 'bold',
    },
});
