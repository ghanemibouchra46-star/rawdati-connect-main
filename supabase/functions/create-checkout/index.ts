import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: req.headers.get('Authorization')! } } }
    )

    const { data: { user }, error: userError } = await supabaseClient.auth.getUser()
    if (userError || !user) throw new Error('Unauthorized')

    const { amount, kindergartenId, planType, paymentType, childName, parentName, requestId } = await req.json()

    // Create a transaction record in pending state using service_role to bypass RLS
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const { data: tx, error: txError } = await supabaseAdmin
      .from('payment_transactions')
      .insert({
        user_id: user.id,
        kindergarten_id: kindergartenId,
        amount: amount,
        payment_type: paymentType,
        plan_type: planType,
        metadata: { childName, parentName, request_id: requestId }
      })
      .select()
      .single()

    if (txError) throw txError

    // Chargily API V2 Checkout
    const chargilyApiKey = Deno.env.get('CHARGILY_API_KEY')
    if (!chargilyApiKey) throw new Error('Missing Chargily API Key')

    // Uses https://pay.chargily.net/test/api/v2/checkouts for test mode
    const isTestMode = chargilyApiKey.startsWith('test_')
    const chargilyUrl = isTestMode ? 'https://pay.chargily.net/test/api/v2/checkouts' : 'https://pay.chargily.net/api/v2/checkouts'

    const appUrl = Deno.env.get('VITE_APP_URL') || 'http://localhost:8081'

    const payload = {
      amount: amount,
      currency: "dzd",
      success_url: `${appUrl}/payment/callback?checkout_id=${tx.id}&status=success`,
      failure_url: `${appUrl}/payment/callback?checkout_id=${tx.id}&status=failure`,
      webhook_endpoint: `${Deno.env.get('SUPABASE_URL')}/functions/v1/chargily-webhook`,
      description: paymentType === 'platform_subscription' ? `Platform Subscription - ${planType}` : `Kindergarten Enrollment`,
      metadata: [
        { tx_id: tx.id },
        { user_id: user.id },
        { kindergarten_id: kindergartenId }
      ]
    }

    const response = await fetch(chargilyUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${chargilyApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })

    const chargilyData = await response.json()

    if (!response.ok) {
      throw new Error(`Chargily Error: ${JSON.stringify(chargilyData)}`)
    }

    // Update tx with chargily_checkout_id
    await supabaseAdmin
      .from('payment_transactions')
      .update({ chargily_checkout_id: chargilyData.id })
      .eq('id', tx.id)

    return new Response(
      JSON.stringify({ checkout_url: chargilyData.checkout_url }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
    )
  } catch (error) {
    console.error(error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
    )
  }
})
