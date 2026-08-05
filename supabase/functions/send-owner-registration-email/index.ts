import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'

const resendApiKey = Deno.env.get('RESEND_API_KEY')

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
      },
    })
  }

  try {
    const { registrationRequestId } = await req.json()

    if (!registrationRequestId) {
      throw new Error('registrationRequestId is required')
    }

    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const { data: request, error: requestError } = await supabaseAdmin
      .from('registration_requests')
      .select('*, kindergarten_id')
      .eq('id', registrationRequestId)
      .single()

    if (requestError || !request) {
      throw new Error('Registration request not found')
    }

    const { data: kindergarten, error: kgError } = await supabaseAdmin
      .from('kindergartens')
      .select('id, name_ar, name_fr')
      .eq('id', request.kindergarten_id)
      .single()

    if (kgError || !kindergarten) {
      throw new Error('Kindergarten not found')
    }

    const { data: ownerLink, error: ownerLinkError } = await supabaseAdmin
      .from('owner_kindergartens')
      .select('owner_id')
      .eq('kindergarten_id', kindergarten.id)
      .single()

    if (ownerLinkError || !ownerLink) {
      throw new Error('Owner linkage not found')
    }

    const { data: ownerUser, error: ownerUserError } = await supabaseAdmin.auth.admin.getUserById(ownerLink.owner_id)
    if (ownerUserError || !ownerUser?.user) {
      throw new Error('Owner user not found')
    }

    const ownerEmail = ownerUser.user.email
    if (!ownerEmail) {
      throw new Error('Owner email not available')
    }

    const ownerName = ownerUser.user.user_metadata?.full_name || `${kindergarten.name_ar}`
    const parentName = request.parent_name || 'ولي الأمر'
    const childName = request.child_name || 'الطفل'
    const childAge = request.child_age ? `${request.child_age}` : 'غير محدد'
    const parentPhone = request.phone || 'غير متوفر'
    const parentEmail = request.email || 'غير متوفر'
    const requestMessage = request.message || ''
    const kindergartenName = kindergarten.name_ar || kindergarten.name_fr || 'الروضه'

    if (resendApiKey && ownerEmail) {
      const emailBody = `
        <div dir="rtl" style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; text-align: right;">
          <h2 style="color: #6366f1;">تم تسجيل طفل جديد في روضتك</h2>
          <p>مرحباً ${ownerName},</p>
          <p>قام ولي الأمر ${parentName} بتسجيل الطفل ${childName} (${childAge} سنة) في روضة ${kindergartenName}.</p>
          <p>تفاصيل الاتصال بالولي:</p>
          <ul>
            <li>الهاتف: ${parentPhone}</li>
            <li>البريد الإلكتروني: ${parentEmail}</li>
          </ul>
          ${requestMessage ? `<p>ملاحظات الوالي: ${requestMessage}</p>` : ''}
          <p>الرجاء مراجعة الطلب في لوحة تحكم صاحب الروضة.</p>
          <p>شكراً لاستخدامك منصة روضتي.</p>
        </div>
      `

      const resRes = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${resendApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: 'Rawdati Connect <noreply@rawdati-connect.com>',
          to: [ownerEmail],
          subject: `تسجيل جديد في ${kindergartenName}`,
          html: emailBody,
        }),
      })

      if (!resRes.ok) {
        const resendData = await resRes.text()
        console.error('Resend Error:', resendData)
      }
    }

    return new Response('Owner email processed successfully', { status: 200 })
  } catch (error) {
    console.error(error)
    return new Response(`Error: ${error.message}`, { status: 400 })
  }
})
