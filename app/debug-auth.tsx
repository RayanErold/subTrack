import { useEffect } from 'react';
import { View, Text, Button } from 'react-native';
import { useSubscriptionStore } from '../store/useSubscriptionStore';
import { supabase } from '../utils/supabase';

export default function DebugAuth() {
    const { session, addSubscription } = useSubscriptionStore();

    useEffect(() => {
        console.log('DEBUG SCREEN MOUNTED');
        checkSession();
    }, []);

    const checkSession = async () => {
        const { data } = await supabase.auth.getSession();
        console.log('DEBUG: Supabase Session:', data.session?.user?.id);
        console.log('DEBUG: Store Session:', session?.user?.id);
    };

    const checkTable = async () => {
        console.log('DEBUG: Checking Table...');
        const { data, error } = await supabase.from('subscriptions').select('*').limit(1);
        if (error) {
            console.error('Table Check Error:', error);
            alert(`Table Error: ${error.message}\n${error.details || ''}`);
        } else {
            console.log('Table Data:', data);
            if (data && data.length > 0) {
                alert(`Table Keys: ${Object.keys(data[0]).join(', ')}`);
            } else {
                alert('Table exists but is empty. Try adding a row manually in Supabase to see keys, or just trust the schema.');
            }
        }
    };

    const testAdd = () => {
        console.log('DEBUG: Attempting Add');
        addSubscription({
            name: 'Debug Sub',
            price: 9.99,
            type: 'active',
            billingCycle: 'monthly',
            category: 'Entertainment',
            renewalDate: new Date().toISOString(),
            reminderDays: 3,
            reminderEnabled: false
        });
    };

    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text>Debug Auth</Text>
            <Button title="Check Session" onPress={checkSession} />
            <Button title="Test Add" onPress={testAdd} />
            <Button title="Check Table Schema" onPress={checkTable} />
        </View>
    );
}
