import { Category } from '../utils/smartCategories';

export type SubscriptionType = 'active' | 'trial';
export type BillingCycle = 'monthly' | 'yearly';

export interface Subscription {
  id: string; // Stored as string to handle BigInt safely
  name: string;
  type: SubscriptionType;
  price: number;
  billingCycle: BillingCycle;
  category: Category;
  renewalDate: string; // ISO string
  reminderDays: number;
  reminderEnabled: boolean;
  cancelUrl?: string;
  icon?: string;
  created_at?: string;
}
