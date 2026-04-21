// @ts-nocheck
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
    // Handle CORS preflight request
    if (req.method === "OPTIONS") {
        return new Response("ok", { headers: corsHeaders });
    }

    try {
        const { email, amount } = await req.json();

        if (!RESEND_API_KEY) {
            throw new Error("Missing RESEND_API_KEY");
        }

        const res = await fetch("https://api.resend.com/emails", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${RESEND_API_KEY}`,
            },
            body: JSON.stringify({
                from: "Subscription Tracker <onboarding@resend.dev>",
                to: [email],
                subject: "Payment Confirmation",
                html: `
          <h1>Payment Successful!</h1>
          <p>Thank you for your payment of <strong>$${amount}</strong>.</p>
          <p>Your subscription has been updated.</p>
        `,
            }),
        });

        const data = await res.json();

        if (!res.ok) {
            return new Response(JSON.stringify({ error: data }), {
                headers: { ...corsHeaders, "Content-Type": "application/json" },
                status: 200, // Return 200 so client can see the error body
            });
        }

        return new Response(JSON.stringify(data), {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
            status: 200,
        });
    } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
            status: 200, // Return 200 to surface unexpected errors
        });
    }
});
