import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'

const resendApiKey = Deno.env.get('RESEND_API_KEY')

serve(async (req) => {
  try {
    const { tx_id } = await req.json()
    
    if (!tx_id) {
       throw new Error('tx_id is required')
    }

    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Fetch transaction details
    const { data: tx, error: txError } = await supabaseAdmin
      .from('payment_transactions')
      .select('*, kindergartens(name_ar, name_fr)')
      .eq('id', tx_id)
      .single()

    if (txError || !tx) {
        throw new Error('Transaction not found')
    }

    const requestId = tx.metadata?.request_id
    
    if (requestId) {
        // Update request status to 'approved' since payment succeeded
        await supabaseAdmin
            .from('registration_requests')
            .update({ status: 'approved' })
            .eq('id', requestId)
    }

    // Fetch user details for email (parent)
    const { data: user, error: userError } = await supabaseAdmin.auth.admin.getUserById(tx.user_id)
    
    if (userError || !user) {
        throw new Error('User not found')
    }

    const parentEmail = user.user.email
    const childName = tx.metadata?.childName || 'ابنكم'
    const kgName = tx.kindergartens?.name_ar || 'روضتنا'

    if (resendApiKey && parentEmail) {
        const resRes = await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${resendApiKey}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                from: 'Rawdati Connect <noreply@rawdati-connect.com>',
                to: [parentEmail],
                subject: `تأكيد التسجيل في ${kgName}`,
                html: `
                    <div dir="rtl" style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; text-align: right;">
                        <h2 style="color: #6366f1;">تم تأكيد تسجيل طفلكم بنجاح!</h2>
                        <p>مرحباً،</p>
                        <p>يسعدنا إعلامكم أنه تم استلام مبلغ <strong>${tx.amount} دج</strong> بنجاح.</p>
                        <p>تم تسجيل الطفل <strong>${childName}</strong> في <strong>${kgName}</strong>.</p>
                        <p>رقم المعاملة: ${tx.id}</p>
                        <p>شكراً لثقتكم في منصة روضتي.</p>
                    </div>
                `
            })
        })
        
        const resendData = await resRes.json()
        if (!resRes.ok) {
            console.error('Resend Error:', resendData)
        }
    }

    return new Response('Email processed successfully', { status: 200 })
  } catch (error) {
    console.error(error)
    return new Response(`Error: ${error.message}`, { status: 400 })
  }
})
