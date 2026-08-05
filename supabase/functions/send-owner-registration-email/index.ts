import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'

const resendApiKey = Deno.env.get('RESEND_API_KEY')
const resendFrom = Deno.env.get('RESEND_FROM') || 'Rawdati Connect <noreply@rawdati-connect.com>'

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
    const body = await req.json()
    const {
      registrationRequestId,
      kindergartenId,
      kindergartenName: explicitKindergartenName,
      parentName: explicitParentName,
      childName: explicitChildName,
      childAge: explicitChildAge,
      parentPhone: explicitParentPhone,
      parentEmail: explicitParentEmail,
      requestMessage: explicitRequestMessage,
      ownerEmail: explicitOwnerEmail,
    } = body || {}

    if (!registrationRequestId && !kindergartenId) {
      throw new Error('registrationRequestId or kindergartenId is required')
    }

    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    let request: any = null
    let kindergarten: any = null

    if (registrationRequestId) {
      const { data, error } = await supabaseAdmin
        .from('registration_requests')
        .select('*, kindergarten_id')
        .eq('id', registrationRequestId)
        .single()

      request = data
      if (error || !request) {
        throw new Error('Registration request not found')
      }
    }

    const resolvedKindergartenId = request?.kindergarten_id || kindergartenId

    if (resolvedKindergartenId) {
      const { data, error } = await supabaseAdmin
        .from('kindergartens')
        .select('id, name_ar, name_fr')
        .eq('id', resolvedKindergartenId)
        .single()

      kindergarten = data
      if (error || !kindergarten) {
        throw new Error('Kindergarten not found')
      }
    }

    let ownerEmail = explicitOwnerEmail || null
    let ownerName = 'صاحب الروضة'

    if (!ownerEmail && kindergarten?.id) {
      const { data: ownerLink, error: ownerLinkError } = await supabaseAdmin
        .from('owner_kindergartens')
        .select('owner_id')
        .eq('kindergarten_id', kindergarten.id)
        .single()

      if (!ownerLinkError && ownerLink?.owner_id) {
        const { data: ownerUser, error: ownerUserError } = await supabaseAdmin.auth.admin.getUserById(ownerLink.owner_id)
        if (!ownerUserError && ownerUser?.user) {
          ownerEmail = ownerUser.user.email || null
          ownerName = ownerUser.user.user_metadata?.full_name || `${kindergarten.name_ar}`
        }
      }
    }

    if (!ownerEmail) {
      throw new Error('Owner email not available')
    }

    const parentName = explicitParentName || request?.parent_name || 'ولي الأمر'
    const childName = explicitChildName || request?.child_name || 'الطفل'
    const childAge = explicitChildAge || request?.child_age ? `${explicitChildAge || request?.child_age}` : 'غير محدد'
    const parentPhone = explicitParentPhone || request?.phone || 'غير متوفر'
    const parentEmail = explicitParentEmail || request?.email || 'غير متوفر'
    const requestMessage = explicitRequestMessage || request?.message || ''
    const kindergartenName = explicitKindergartenName || kindergarten?.name_ar || kindergarten?.name_fr || 'الروضه'

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
          from: resendFrom,
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
  } catch (error: any) {
    console.error(error)
    return new Response(`Error: ${error?.message || 'Unknown error'}`, { status: 400 })
  }
})
