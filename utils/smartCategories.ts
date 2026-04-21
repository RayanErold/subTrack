import { BillingCycle } from '../store/useSubscriptionStore';

export type Category = 
    | 'Entertainment' 
    | 'Productivity' 
    | 'Utilities' 
    | 'Social' 
    | 'Shopping' 
    | 'Finance'
    | 'Health'
    | 'Education'
    | 'Gaming'
    | 'News'
    | 'Professional'
    | 'Travel'
    | 'Food'
    | 'Other';

export interface CategoryInfo {
    id: Category;
    icon: string;
    color: string;
}

export const CATEGORIES: CategoryInfo[] = [
    { id: 'Entertainment', icon: 'film-outline', color: '#8B5CF6' },
    { id: 'Productivity', icon: 'briefcase-outline', color: '#3B82F6' },
    { id: 'Finance', icon: 'wallet-outline', color: '#10B981' },
    { id: 'Health', icon: 'fitness-outline', color: '#EC4899' },
    { id: 'Shopping', icon: 'cart-outline', color: '#F59E0B' },
    { id: 'Utilities', icon: 'flash-outline', color: '#6366F1' },
    { id: 'Education', icon: 'book-outline', color: '#14B8A6' },
    { id: 'Gaming', icon: 'game-controller-outline', color: '#8B5CF6' },
    { id: 'Social', icon: 'people-outline', color: '#3B82F6' },
    { id: 'News', icon: 'newspaper-outline', color: '#F43F5E' },
    { id: 'Professional', icon: 'laptop-outline', color: '#64748B' },
    { id: 'Travel', icon: 'airplane-outline', color: '#0EA5E9' },
    { id: 'Food', icon: 'restaurant-outline', color: '#F97316' },
    { id: 'Other', icon: 'grid-outline', color: '#A8A29E' },
];

interface ServiceInfo {
    name: string;
    defaultPrice: number;
    category: Category;
    billingCycle: 'monthly' | 'yearly';
    icon?: string;
}

// A "Knowledge Base" of popular subscriptions
const KNOWLEDGE_BASE: Record<string, ServiceInfo> = {
    'netflix': { name: 'Netflix', defaultPrice: 15.49, category: 'Entertainment', billingCycle: 'monthly' },
    'spotify': { name: 'Spotify', defaultPrice: 10.99, category: 'Entertainment', billingCycle: 'monthly' },
    'apple music': { name: 'Apple Music', defaultPrice: 10.99, category: 'Entertainment', billingCycle: 'monthly' },
    'youtube premium': { name: 'YouTube Premium', defaultPrice: 13.99, category: 'Entertainment', billingCycle: 'monthly' },
    'hulu': { name: 'Hulu', defaultPrice: 7.99, category: 'Entertainment', billingCycle: 'monthly' },
    'disney+': { name: 'Disney+', defaultPrice: 7.99, category: 'Entertainment', billingCycle: 'monthly' },
    'hbo max': { name: 'HBO Max', defaultPrice: 15.99, category: 'Entertainment', billingCycle: 'monthly' },
    'prime video': { name: 'Prime Video', defaultPrice: 8.99, category: 'Entertainment', billingCycle: 'monthly' },

    'adobe': { name: 'Adobe Creative Cloud', defaultPrice: 54.99, category: 'Productivity', billingCycle: 'monthly' },
    'chatgpt': { name: 'ChatGPT Plus', defaultPrice: 20.00, category: 'Productivity', billingCycle: 'monthly' },
    'github copilot': { name: 'GitHub Copilot', defaultPrice: 10.00, category: 'Productivity', billingCycle: 'monthly' },
    'notion': { name: 'Notion', defaultPrice: 8.00, category: 'Productivity', billingCycle: 'monthly' },
    'figma': { name: 'Figma', defaultPrice: 12.00, category: 'Productivity', billingCycle: 'monthly' },
    'microsoft 365': { name: 'Microsoft 365', defaultPrice: 6.99, category: 'Productivity', billingCycle: 'monthly' },

    'amazon prime': { name: 'Amazon Prime', defaultPrice: 14.99, category: 'Shopping', billingCycle: 'monthly' },
    'walmart+': { name: 'Walmart+', defaultPrice: 12.95, category: 'Shopping', billingCycle: 'monthly' },
    'uber one': { name: 'Uber One', defaultPrice: 9.99, category: 'Utilities', billingCycle: 'monthly' },
    'door dash': { name: 'DoorDash (DashPass)', defaultPrice: 9.99, category: 'Utilities', billingCycle: 'monthly' },

    'tinder': { name: 'Tinder Gold', defaultPrice: 24.99, category: 'Social', billingCycle: 'monthly' },
    'bumble': { name: 'Bumble Boost', defaultPrice: 16.99, category: 'Social', billingCycle: 'monthly' },
    'linkedin premium': { name: 'LinkedIn Premium', defaultPrice: 39.99, category: 'Social', billingCycle: 'monthly' },
    'x premium': { name: 'X Premium', defaultPrice: 8.00, category: 'Social', billingCycle: 'monthly' },
};

export const predictServiceDetails = (inputName: string): ServiceInfo | null => {
    const normalized = inputName.toLowerCase().trim();

    // 1. Direct match
    if (KNOWLEDGE_BASE[normalized]) {
        return KNOWLEDGE_BASE[normalized];
    }

    // 2. Partial match (e.g. "netflix standard" -> "netflix")
    // We prioritize the longest key that matches the start of the input for better accuracy
    const keys = Object.keys(KNOWLEDGE_BASE);
    for (const key of keys) {
        if (normalized.includes(key)) {
            return KNOWLEDGE_BASE[key];
        }
    }

    return null;
};
