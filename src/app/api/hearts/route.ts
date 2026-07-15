import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

const supabase = createClient(supabaseUrl, supabaseKey);

export async function POST(req: Request) {
  try {
    const { userId } = await req.json();
    
    if (!userId) {
      return NextResponse.json({ error: 'Missing userId' }, { status: 400 });
    }

    const { data: profile, error: fetchError } = await supabase
      .from('user_profiles')
      .select('hearts, hearts_empty_at')
      .eq('id', userId)
      .single();

    if (fetchError || !profile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
    }

    const currentHearts = profile.hearts !== undefined ? profile.hearts : 5;
    
    if (currentHearts <= 0) {
       return NextResponse.json({ hearts: 0, message: 'No hearts left' });
    }

    const newHearts = currentHearts - 1;
    
    const updateData: any = { hearts: newHearts };
    
    // Start regeneration timer if this is the first lost heart (from 5 to 4) 
    // or if the timer is somehow null but we have less than 5 hearts
    if (newHearts < 5 && !profile.hearts_empty_at) {
      updateData.hearts_empty_at = new Date().toISOString();
    }
    
    const { error: updateError } = await supabase
      .from('user_profiles')
      .update(updateData)
      .eq('id', userId);

    if (updateError) {
      throw updateError;
    }

    return NextResponse.json({ hearts: newHearts });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
