import { supabase } from './supabase';

export interface PaymentRecord {
    user_id: string;
    amount: number;
    currency: string;
    status: 'pending' | 'succeeded' | 'failed' | 'cancelled';
}

export const logPayment = async (payment: PaymentRecord) => {
    const { data, error } = await supabase
        .from('payments')
        .insert([
            {
                user_id: payment.user_id,
                amount: payment.amount,
                currency: payment.currency,
                status: payment.status,
            },
        ])
        .select();

    if (error) {
        console.error('Error logging payment:', error);
        throw error;
    }

    return data;
};

export const deactivatePremium = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('No user logged in');

    const { error } = await supabase
        .from('payments')
        .update({ status: 'cancelled' })
        .eq('user_id', user.id)
        .eq('status', 'succeeded');

    if (error) {
        console.error('Error deactivating premium:', error);
        throw error;
    }

    return true;
};

export const getUserPayments = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('No user logged in');

    const { data, error } = await supabase
        .from('payments')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching payments:', error);
        throw error;
    }

    return data;
};
