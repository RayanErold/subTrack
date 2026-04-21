# ✅ Verification Guide: Payments & Emails

Follow these steps to ensure your new features are working correctly.

## 1. Database Setup (Required)
Before testing payments, you must create the `payments` table in Supabase.

1.  Go to your [Supabase Dashboard](https://supabase.com/dashboard).
2.  Open the **SQL Editor**.
3.  Copy and paste the contents of `supabase_schema.sql` (located in your project root).
4.  Run the query. This creates the `payments` table and security policies.

## 2. Testing Payment Logic (Mobile Only)
*Why Mobile Only?* Stripe React Native SDK does not support web.

1.  **Run on Mobile**:
    ```bash
    npx expo start --clear
    ```
    Scan the QR code with your phone (Expo Go).

2.  **Navigate**: Go to the **Premium** tab (or wherever the payment screen is).
3.  **Enter Details**:
    *   **Amount**: `20`
    *   **Card Number**: `4242 4242 4242 4242` (Stripe Test Card)
    *   **Expiry**: `12/34`
    *   **CVC**: `123`
4.  **Tap "Pay Now"**.
5.  **Success**: You should see an Alert: **"Payment processed successfully!"**.

## 3. Testing Email Logic (Mock vs Real)
After a successful payment, the app tries to send an email.

### Scenario A: Mock Mode (Default)
*If you haven't deployed the Edge Function yet.*
1.  After payment success, look for a second Alert: **"📧 Email Sent (Mock)"**.
2.  Check your terminal/console logs. You will see:
    ```
    [EMAIL SERVICE] Falling back to Mock/Console log.
    [Subject] Payment Confirmation
    [Body] Thank you for your payment of $20...
    ```
    *Result*: The logic works! The app correctly handled the "missing backend" and simulated the email.

### Scenario B: Real Emails (Advanced)
*Only if you deployed the Edge Function.*
1.  Deploy the function: `supabase functions deploy send-email`.
2.  Set API Key: `supabase secrets set RESEND_API_KEY=re_123...`.
3.  Run the payment test again.
4.  *Result*: You should receive a **real HTML email** to your inbox.

## 4. Verification Checklist
- [ ] `payments` table exists in Supabase.
- [ ] Mobile App: Payment succeeds with test card `4242...`.
- [ ] Mobile App: "Email Sent (Mock)" alert appears (or real email received).
- [ ] Web App: Shows "Payment not supported on web" message (instead of crashing).
