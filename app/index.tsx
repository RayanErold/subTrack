import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Platform, UIManager, Dimensions } from 'react-native';
import { Link, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import Colors from '../constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';

// Extracted Components
import { BenefitCard } from '../components/landing/BenefitCard';
import { ReviewCard } from '../components/landing/ReviewCard';
import { FeatureRow } from '../components/landing/FeatureRow';
import { PlanCard } from '../components/landing/PlanCard';
import { FAQItem } from '../components/landing/FAQItem';

if (Platform.OS === 'android') {
    if (UIManager.setLayoutAnimationEnabledExperimental) {
        UIManager.setLayoutAnimationEnabledExperimental(true);
    }
}

const { width } = Dimensions.get('window');

export default function LandingPage() {
    const router = useRouter();

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar style="light" />

            {/* Header */}
            <View style={styles.header}>
                <View style={styles.logoContainer}>
                    <View style={styles.logoIcon}>
                        <Ionicons name="wallet" size={20} color="#fff" />
                    </View>
                    <Text style={styles.logoText}>SubTrack</Text>
                </View>
                <Link href="/(auth)" asChild>
                    <TouchableOpacity style={styles.signInButton}>
                        <Text style={styles.signInText}>Login</Text>
                    </TouchableOpacity>
                </Link>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                {/* Hero Section */}
                <View style={styles.heroSection}>
                    <View style={styles.glow} />

                    <View style={styles.badge}>
                        <Text style={styles.badgeText}>🚀 #1 Subscription Manager of 2026</Text>
                    </View>

                    <Text style={styles.heroTitle}>
                        Stop Paying for <Text style={styles.highlight}>Unwanted Charges</Text>
                    </Text>

                    <Text style={styles.heroSubtitle}>
                        Track every penny, predict future bills, and never let a free trial accidentally charge you again.
                    </Text>

                    <View style={styles.downloadButtons}>
                        <TouchableOpacity style={styles.storeButton} onPress={() => alert('Coming Soon to App Store')}>
                            <Ionicons name="logo-apple" size={24} color="#fff" />
                            <View>
                                <Text style={styles.storeSubtext}>Coming Soon</Text>
                                <Text style={styles.storeText}>App Store</Text>
                            </View>
                        </TouchableOpacity>

                        <TouchableOpacity style={[styles.storeButton, styles.playStoreButton]} onPress={() => alert('Coming Soon to Play Store')}>
                            <Ionicons name="logo-google-playstore" size={22} color="#fff" />
                            <View>
                                <Text style={styles.storeSubtext}>Coming Soon</Text>
                                <Text style={styles.storeText}>Google Play</Text>
                            </View>
                        </TouchableOpacity>
                    </View>

                    {/* Enhanced Mockup */}
                    <View style={styles.mockupContainer}>
                        <View style={styles.mockupCard}>
                            <View style={styles.mockupHeader}>
                                <Text style={styles.mockupTitle}>Upcoming Bills</Text>
                                <Ionicons name="notifications-outline" size={20} color="#fff" />
                            </View>

                            <View style={styles.mockupList}>
                                <View style={styles.mockupItem}>
                                    <View style={[styles.iconBox, { backgroundColor: 'rgba(229, 9, 20, 0.2)' }]}>
                                        <Ionicons name="film-outline" size={20} color="#E50914" />
                                    </View>
                                    <View style={{ flex: 1 }}>
                                        <Text style={styles.itemTitle}>Netflix</Text>
                                        <Text style={styles.itemSub}>Tomorrow • Auto-renew</Text>
                                    </View>
                                    <Text style={styles.itemPrice}>-$19.99</Text>
                                </View>

                                <View style={styles.mockupItem}>
                                    <View style={[styles.iconBox, { backgroundColor: 'rgba(29, 185, 84, 0.2)' }]}>
                                        <Ionicons name="musical-notes-outline" size={20} color="#1DB954" />
                                    </View>
                                    <View style={{ flex: 1 }}>
                                        <Text style={styles.itemTitle}>Spotify</Text>
                                        <Text style={styles.itemSub}>In 5 days • Trial ending</Text>
                                    </View>
                                    <Text style={styles.itemPrice}>-$12.99</Text>
                                </View>

                                <View style={[styles.mockupItem, styles.forecastItem]}>
                                    <View style={[styles.iconBox, { backgroundColor: 'rgba(108, 99, 255, 0.2)' }]}>
                                        <Ionicons name="trending-up" size={20} color={Colors.dark.primary} />
                                    </View>
                                    <View style={{ flex: 1 }}>
                                        <Text style={styles.itemTitle}>Next Month Forecast</Text>
                                        <Text style={styles.itemSub}>Predicted spend based on trends</Text>
                                    </View>
                                    <Text style={[styles.itemPrice, { color: Colors.dark.primary }]}>$145.00</Text>
                                </View>
                            </View>
                        </View>
                    </View>
                </View>

                {/* Trusted By Section */}
                <View style={styles.trustedSection}>
                    <Text style={styles.trustedLabel}>TRUSTED BY LEADING FINANCE TEAMS</Text>
                    <View style={styles.trustedLogos}>
                        <Text style={styles.trustedLogo}>TechCrunch</Text>
                        <Text style={styles.trustedLogo}>Forbes</Text>
                        <Text style={styles.trustedLogo}>IndieHackers</Text>
                        <Text style={styles.trustedLogo}>ProductHunt</Text>
                        <Text style={styles.trustedLogo}>Bloomberg</Text>
                    </View>
                </View>

                {/* Benefits Grid */}
                <View style={styles.sectionContainer}>
                    <Text style={styles.sectionOverline}>FEATURES</Text>
                    <Text style={styles.sectionTitle}>Financial Clarity, Finally.</Text>

                    <View style={styles.grid}>
                        <BenefitCard
                            icon="calendar-outline"
                            title="Calendar Sync"
                            desc="Auto-add renewal dates to your Google or Outlook calendar. Never get caught off guard."
                        />
                        <BenefitCard
                            icon="document-text-outline"
                            title="Export Reports"
                            desc="Generate PDF or CSV reports of your spending for tax season or deeper analysis."
                        />
                        <BenefitCard
                            icon="wallet-outline"
                            title="Smart Budgets"
                            desc="Set spending limits per category. We'll alert you if you're about to overspend."
                        />
                        <BenefitCard
                            icon="globe-outline"
                            title="Multi-Currency"
                            desc="Track subscriptions in USD, EUR, GBP, and more. Real-time exchange rates included."
                        />
                    </View>
                </View>

                {/* Stats / Social Proof */}
                <View style={styles.statsSection}>
                    <View style={styles.statItem}>
                        <Text style={styles.statValue}>50k+</Text>
                        <Text style={styles.statLabel}>Users</Text>
                    </View>
                    <View style={styles.statDivider} />
                    <View style={styles.statItem}>
                        <Text style={styles.statValue}>$2M+</Text>
                        <Text style={styles.statLabel}>Saved</Text>
                    </View>
                    <View style={styles.statDivider} />
                    <View style={styles.statItem}>
                        <Text style={styles.statValue}>4.9</Text>
                        <Text style={styles.statLabel}>App Store</Text>
                    </View>
                </View>

                {/* Detailed Reviews */}
                <View style={[styles.sectionContainer, styles.altBackground]}>
                    <Text style={styles.sectionTitle}>Wall of Love 💜</Text>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.horizontalScroll}>
                        <ReviewCard
                            name="Sarah Jenkins"
                            handle="@sarah_creates"
                            text="I found $45/mo in subscriptions I forgot about! This app paid for itself 10x over in the first hour."
                        />
                        <ReviewCard
                            name="Michael Chen"
                            handle="@mike_dev"
                            text="The PDF export saved my life during tax season. I finally know if I can afford that extra tool."
                        />
                        <ReviewCard
                            name="Jessica Lee"
                            handle="@jess_designs"
                            text="The Calendar Sync is genius. I get a notification from my own calendar before a trial ends."
                        />
                    </ScrollView>
                </View>

                {/* Pricing */}
                <View style={styles.sectionContainer}>
                    <Text style={styles.sectionOverline}>PRICING</Text>
                    <Text style={styles.sectionTitle}>Invest in your Wallet</Text>

                    {/* Lifetime Deal - Hero Card */}
                    <View style={styles.lifetimeContainer}>
                        <View style={styles.lifetimeGlow} />
                        <View style={styles.lifetimeCard}>
                            <View style={styles.lifetimeHeader}>
                                <View>
                                    <Text style={styles.lifetimeLabel}>LIMITED TIME OFFER</Text>
                                    <Text style={styles.lifetimeTitle}>Lifetime Access</Text>
                                </View>
                                <View style={styles.saveBadge}>
                                    <Text style={styles.saveText}>SAVE 75%</Text>
                                </View>
                            </View>

                            <View style={styles.priceRow}>
                                <Text style={styles.priceMain}>$49.99</Text>
                                <Text style={styles.priceCross}>$199.99</Text>
                            </View>

                            <Text style={styles.lifetimeDesc}>Pay once, own it forever. Get all future Pro features without any monthly fees.</Text>

                            <View style={styles.featureList}>
                                <FeatureRow text="Unlimited Subscriptions" />
                                <FeatureRow text="Calendar Sync & PDF Export" />
                                <FeatureRow text="Smart Trend Analysis" />
                                <FeatureRow text="Multi-Currency Support" />
                            </View>

                            <TouchableOpacity style={styles.lifetimeButton}>
                                <Text style={styles.lifetimeBtnText}>Get Lifetime Access</Text>
                                <Ionicons name="arrow-forward" size={18} color="#000" />
                            </TouchableOpacity>

                            <Text style={styles.guarantee}>30-day money-back guarantee</Text>
                        </View>
                    </View>

                    {/* Standard Plans */}
                    <View style={styles.plansRow}>
                        <PlanCard
                            title="Free Forever"
                            price="$0"
                            period=""
                            features={['5 Active Subs', 'Basic Reminders', 'Standard Support']}
                        />
                        <PlanCard
                            title="Monthly"
                            price="$4.99"
                            period="/mo"
                            trial="1 Month Free"
                            features={['Unlimited Subs', 'Calendar Sync', 'PDF Export & Trends']}
                        />
                        <PlanCard
                            title="Yearly"
                            price="$39.99"
                            period="/yr"
                            trial="5 Months Free"
                            isBestValue
                            features={['Best Value', 'Priority Support', 'All Premium Features']}
                        />
                    </View>
                </View>

                {/* FAQ - Accordion */}
                <View style={[styles.sectionContainer, { paddingBottom: 100 }]}>
                    <Text style={styles.sectionTitle}>FAQ</Text>
                    <FAQItem q="Is my bank data safe?" a="Yes. We use bank-level 256-bit encryption. We never see or store your login credentials." />
                    <FAQItem q="Can I cancel anytime?" a="Absolutely. You can cancel your subscription from the app settings instantly. No questions asked." />
                    <FAQItem q="Does it support international banks?" a="We support over 10,000 banks across the US, Canada, UK, and Europe." />
                </View>

                {/* Footer */}
                <View style={styles.footer}>
                    <View style={styles.logoContainer}>
                        <Ionicons name="wallet" size={18} color="#666" />
                        <Text style={[styles.logoText, { color: '#666', fontSize: 16 }]}>SubTrack</Text>
                    </View>
                    <Text style={styles.footerCopyright}>© 2026 SubTrack Inc. All rights reserved.</Text>
                    <View style={styles.footerLinks}>
                        <Text style={styles.link}>Privacy</Text>
                        <Text style={styles.link}>Terms</Text>
                        <Text style={styles.link}>Support</Text>
                    </View>
                </View>
            </ScrollView>

            {/* Sticky Bottom Actions (Mobile) */}
            <View style={styles.stickyBottom}>
                <Link href="/(auth)" asChild>
                    <TouchableOpacity style={styles.stickyBtn}>
                        <Text style={styles.stickyBtnText}>Get Started Free</Text>
                    </TouchableOpacity>
                </Link>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#050505' },
    header: {
        flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
        paddingHorizontal: 24, paddingVertical: 16,
        borderBottomWidth: 1, borderBottomColor: '#1a1a1a',
    },
    logoContainer: { flexDirection: 'row', alignItems: 'center', gap: 10 },
    logoIcon: { width: 32, height: 32, borderRadius: 10, backgroundColor: Colors.dark.primary, justifyContent: 'center', alignItems: 'center' },
    logoText: { color: '#fff', fontSize: 18, fontWeight: '700', letterSpacing: -0.5 },
    signInButton: { paddingVertical: 8, paddingHorizontal: 16, borderRadius: 20, backgroundColor: '#1a1a1a' },
    signInText: { color: '#fff', fontSize: 14, fontWeight: '600' },

    scrollContent: { paddingBottom: 40 },

    heroSection: { paddingTop: 60, paddingBottom: 40, paddingHorizontal: 24, alignItems: 'center', position: 'relative' },
    glow: {
        position: 'absolute', top: -100, left: '50%', marginLeft: -150,
        width: 300, height: 300, borderRadius: 150,
        backgroundColor: Colors.dark.primary, opacity: 0.15, filter: 'blur(80px)', // web support
    },
    badge: { backgroundColor: 'rgba(108, 99, 255, 0.1)', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, marginBottom: 24, borderWidth: 1, borderColor: 'rgba(108, 99, 255, 0.2)' },
    badgeText: { color: Colors.dark.primary, fontSize: 13, fontWeight: '600' },
    heroTitle: { fontSize: 48, fontWeight: '800', color: '#fff', textAlign: 'center', lineHeight: 56, marginBottom: 16, letterSpacing: -1 },
    highlight: { color: Colors.dark.primary },
    heroSubtitle: { fontSize: 18, color: '#888', textAlign: 'center', lineHeight: 28, maxWidth: 500, marginBottom: 40 },

    downloadButtons: { flexDirection: 'row', gap: 12, marginBottom: 60, flexWrap: 'wrap', justifyContent: 'center' },
    storeButton: {
        flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff',
        paddingVertical: 10, paddingHorizontal: 20, borderRadius: 12, gap: 8,
        minWidth: 160,
    },
    playStoreButton: { backgroundColor: 'transparent', borderWidth: 1, borderColor: '#444' },
    storeSubtext: { fontSize: 10, color: '#000', fontWeight: '600', textTransform: 'uppercase' },
    storeText: { fontSize: 16, color: '#000', fontWeight: '800' },

    mockupContainer: { width: '100%', maxWidth: 500, padding: 10 },
    mockupCard: { backgroundColor: '#111', borderRadius: 24, borderWidth: 1, borderColor: '#222', padding: 24, shadowColor: '#000', shadowOffset: { width: 0, height: 20 }, shadowOpacity: 0.5, shadowRadius: 40 },
    mockupHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 24 },
    mockupTitle: { color: '#fff', fontSize: 18, fontWeight: '700' },
    mockupList: { gap: 16 },
    mockupItem: { flexDirection: 'row', alignItems: 'center', gap: 16 },
    forecastItem: { marginTop: 8, paddingTop: 16, borderTopWidth: 1, borderTopColor: '#222' },
    iconBox: { width: 40, height: 40, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
    itemTitle: { color: '#fff', fontWeight: '600', fontSize: 15 },
    itemSub: { color: '#666', fontSize: 12 },
    itemPrice: { color: '#fff', fontWeight: '700', fontSize: 15 },

    trustedSection: { paddingVertical: 40, alignItems: 'center', backgroundColor: '#050505', borderBottomWidth: 1, borderBottomColor: '#111' },
    trustedLabel: { color: '#444', fontSize: 10, fontWeight: '700', letterSpacing: 1, marginBottom: 24, textTransform: 'uppercase' },
    trustedLogos: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 32, paddingHorizontal: 20, opacity: 0.5 },
    trustedLogo: { color: '#888', fontSize: 18, fontWeight: '700', letterSpacing: -0.5 },

    sectionContainer: { paddingVertical: 60, paddingHorizontal: 24 },
    sectionOverline: { color: Colors.dark.primary, fontSize: 12, fontWeight: '700', letterSpacing: 1, marginBottom: 8, textTransform: 'uppercase' },
    sectionTitle: { fontSize: 32, fontWeight: '800', color: '#fff', marginBottom: 40, letterSpacing: -0.5 },

    grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 16 },

    statsSection: { flexDirection: 'row', justifyContent: 'space-around', paddingVertical: 40, borderTopWidth: 1, borderBottomWidth: 1, borderColor: '#1a1a1a', backgroundColor: '#0a0a0a' },
    statItem: { alignItems: 'center' },
    statValue: { color: '#fff', fontSize: 32, fontWeight: '800' },
    statLabel: { color: '#666', fontSize: 14, fontWeight: '600', textTransform: 'uppercase' },
    statDivider: { width: 1, height: 40, backgroundColor: '#222' },

    altBackground: { backgroundColor: '#0a0a0a' },
    horizontalScroll: { gap: 16, paddingRight: 24 },

    lifetimeContainer: { alignItems: 'center', marginBottom: 40, position: 'relative' },
    lifetimeGlow: { position: 'absolute', top: 0, width: '100%', height: '100%', borderRadius: 32, backgroundColor: '#FFD700', opacity: 0.15, filter: 'blur(40px)' },
    lifetimeCard: { width: '100%', maxWidth: 500, backgroundColor: '#111', borderRadius: 32, padding: 32, borderWidth: 1, borderColor: '#FFD700' },
    lifetimeHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 },
    lifetimeLabel: { color: '#FFD700', fontWeight: '700', fontSize: 12, marginBottom: 4 },
    lifetimeTitle: { color: '#fff', fontSize: 24, fontWeight: '800' },
    saveBadge: { backgroundColor: '#FFD700', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
    saveText: { color: '#000', fontWeight: '800', fontSize: 10 },
    priceRow: { flexDirection: 'row', alignItems: 'baseline', gap: 12, marginBottom: 16 },
    priceMain: { color: '#fff', fontSize: 48, fontWeight: '800' },
    priceCross: { color: '#666', fontSize: 24, textDecorationLine: 'line-through' },
    lifetimeDesc: { color: '#aaa', fontSize: 16, marginBottom: 32, lineHeight: 24 },
    featureList: { gap: 8, marginBottom: 32 },
    lifetimeButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#FFD700', paddingVertical: 16, borderRadius: 16, gap: 8 },
    lifetimeBtnText: { color: '#000', fontSize: 16, fontWeight: '800' },
    guarantee: { color: '#666', fontSize: 12, textAlign: 'center', marginTop: 16 },

    plansRow: { flexDirection: 'row', gap: 16 },

    footer: { padding: 40, borderTopWidth: 1, borderTopColor: '#1a1a1a', alignItems: 'center', gap: 24 },
    footerCopyright: { color: '#444' },
    footerLinks: { flexDirection: 'row', gap: 24 },
    link: { color: '#666', fontSize: 14 },

    stickyBottom: { position: 'absolute', bottom: 0, left: 0, right: 0, padding: 20, backgroundColor: 'rgba(5,5,5,0.9)', borderTopWidth: 1, borderTopColor: '#222' },
    stickyBtn: { backgroundColor: '#fff', paddingVertical: 16, borderRadius: 16, alignItems: 'center' },
    stickyBtnText: { color: '#000', fontSize: 16, fontWeight: '800' },
});

