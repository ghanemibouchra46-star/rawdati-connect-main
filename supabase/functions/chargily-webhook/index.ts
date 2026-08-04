import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'

serve(async (req) => {
  try {
    const rawBody = await req.text()
    const signature = req.headers.get('signature') || req.headers.get('Signature')
    
    // In a real production app, verify the HMAC SHA-256 signature here using Deno.env.get('CHARGILY_SECRET_KEY')
    // For now, we will trust the payload but verify the checkout status via API call to Chargily
    
    const payload = JSON.parse(rawBody)
    if (payload.type !== 'checkout.paid' && payload.type !== 'checkout.failed') {
       return new Response('Ignored', { status: 200 })
    }

    const checkoutData = payload.data
    const txIdMeta = checkoutData.metadata?.find((m: any) => m.tx_id)
    const txId = txIdMeta ? txIdMeta.tx_id : null

    if (!txId) {
       throw new Error('No tx_id in metadata')
    }

    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Fetch the checkout from Chargily to ensure it's actually paid (security measure)
    const chargilySecret = Deno.env.get('CHARGILY_SECRET_KEY')
    const isTestMode = chargilySecret?.startsWith('test_')
    const chargilyUrl = isTestMode ? `https://pay.chargily.net/test/api/v2/checkouts/${checkoutData.id}` : `https://pay.chargily.net/api/v2/checkouts/${checkoutData.id}`
    
    if (chargilySecret) {
       const verifyRes = await fetch(chargilyUrl, {
           headers: { 'Authorization': `Bearer ${chargilySecret}` }
       })
       if (verifyRes.ok) {
           const verifyData = await verifyRes.json()
           if (verifyData.status !== 'paid' && payload.type === 'checkout.paid') {
               throw new Error('Spoofed webhook detected')
           }
       }
    }

    const status = payload.type === 'checkout.paid' ? 'paid' : 'failed'
    const providerStatus = checkoutData?.status || (payload.type === 'checkout.paid' ? 'paid' : 'failed')

    // Update Transaction
    await supabaseAdmin
      .from('payment_transactions')
      .update({
        status,
        provider_status: providerStatus,
        provider_reference: checkoutData?.id || null
      })
      .eq('id', txId)

    if (status === 'paid') {
      // Get transaction details
      const { data: tx } = await supabaseAdmin.from('payment_transactions').select('*').eq('id', txId).single()
      
      if (tx) {
         if (tx.payment_type === 'platform_subscription') {
            // Update platform subscription
            const endDate = new Date()
            if (tx.plan_type === 'yearly') endDate.setFullYear(endDate.getFullYear() + 1)
            else endDate.setMonth(endDate.getMonth() + 1)

            // Upsert platform_subscription
            await supabaseAdmin.from('platform_subscriptions').upsert({
               user_id: tx.user_id,
               plan_type: tx.plan_type,
               price: tx.amount,
               status: 'active',
               is_trial: false,
               start_date: new Date().toISOString(),
               end_date: endDate.toISOString(),
               payment_method: 'chargily'
            }, { onConflict: 'user_id' })

            // Update kindergarten status
            await supabaseAdmin.from('kindergartens')
              .update({ subscription_status: 'active' })
              .eq('id', tx.kindergarten_id)
         } else if (tx.payment_type === 'enrollment') {
            // Invoke the send-enrollment-email function from here
            // We pass the tx_id so it can do the heavy lifting
            await supabaseAdmin.functions.invoke('send-enrollment-email', {
                body: { tx_id: txId }
            })
         }
      }
    }

    return new Response('Webhook processed successfully', { status: 200 })
  } catch (error) {
    console.error(error)
    return new Response(`Error: ${error.message}`, { status: 400 })
  }
})
