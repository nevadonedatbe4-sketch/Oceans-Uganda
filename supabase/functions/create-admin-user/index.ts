import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      { auth: { autoRefreshToken: false, persistSession: false } }
    );

    const body = await req.json();
    const { email, password, full_name, role, action } = body;

    // ACTION: create-user (used by invite modal or direct setup)
    if (action === 'create-user' || action === undefined) {
      // Check if user already exists in user_profiles
      const { data: existing } = await supabaseAdmin
        .from('user_profiles')
        .select('id')
        .eq('email', email)
        .maybeSingle();

      if (existing) {
        return new Response(JSON.stringify({ error: 'A user with this email already exists.' }), {
          status: 409,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      let authUserId: string;

      if (password) {
        // Direct creation with password (admin setup)
        const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
          email,
          password,
          email_confirm: true,
        });
        if (authError) {
          return new Response(JSON.stringify({ error: authError.message }), {
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        }
        authUserId = authData.user.id;
      } else {
        // Invite via email
        const { data: inviteData, error: inviteError } = await supabaseAdmin.auth.admin.inviteUserByEmail(email);
        if (inviteError) {
          return new Response(JSON.stringify({ error: inviteError.message }), {
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        }
        authUserId = inviteData.user.id;
      }

      const { error: profileError } = await supabaseAdmin.from('user_profiles').insert({
        auth_user_id: authUserId,
        role: role ?? 'agent',
        full_name: full_name ?? email,
        email,
        status: password ? 'active' : 'pending',
      });

      if (profileError) {
        return new Response(JSON.stringify({ error: profileError.message }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      return new Response(JSON.stringify({ success: true, auth_user_id: authUserId }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ error: 'Unknown action' }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: String(err) }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
