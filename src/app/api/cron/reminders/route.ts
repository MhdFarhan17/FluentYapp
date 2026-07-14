import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import webpush from 'web-push';

// Configure Web Push with VAPID keys
webpush.setVapidDetails(
  'mailto:support@fluentyapp.com', // Replace with a real email
  process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || '',
  process.env.VAPID_PRIVATE_KEY || ''
);

export async function GET(req: Request) {
  try {
    // Basic authorization for cron job (optional but recommended)
    const authHeader = req.headers.get('authorization');
    if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Use service role key to bypass RLS and read all users/subscriptions
    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // 1. Fetch users who haven't practiced today
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Start of today

    const { data: inactiveUsers, error: usersError } = await supabaseAdmin
      .from('user_profiles')
      .select('id, full_name, last_activity_date, current_streak')
      .lt('last_activity_date', today.toISOString());

    if (usersError) throw usersError;

    if (!inactiveUsers || inactiveUsers.length === 0) {
      return NextResponse.json({ message: 'No reminders needed today.' });
    }

    const inactiveUserIds = inactiveUsers.map(u => u.id);

    // 2. Fetch push subscriptions for these users
    const { data: subscriptions, error: subsError } = await supabaseAdmin
      .from('push_subscriptions')
      .select('*')
      .in('user_id', inactiveUserIds);

    if (subsError) throw subsError;

    if (!subscriptions || subscriptions.length === 0) {
      return NextResponse.json({ message: 'No subscriptions found for inactive users.' });
    }

    // 3. Send notifications
    const payload = JSON.stringify({
      title: "FluentYapp Reminder 🦉",
      body: "Don't break your streak! Spend 5 minutes to practice English today.",
      icon: "/logo.png",
      badge: "/logo.png",
      url: "/dashboard"
    });

    const sendPromises = subscriptions.map(async (sub) => {
      const pushSubscription = {
        endpoint: sub.endpoint,
        keys: {
          auth: sub.auth,
          p256dh: sub.p256dh
        }
      };

      try {
        await webpush.sendNotification(pushSubscription, payload);
      } catch (err: any) {
        console.error(`Failed to send to ${sub.endpoint}`, err);
        // If subscription is invalid/expired (status 410 or 404), delete it
        if (err.statusCode === 410 || err.statusCode === 404) {
          await supabaseAdmin
            .from('push_subscriptions')
            .delete()
            .eq('id', sub.id);
        }
      }
    });

    await Promise.all(sendPromises);

    return NextResponse.json({ 
      success: true, 
      sent: subscriptions.length 
    });

  } catch (error: any) {
    console.error("Cron Reminder Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
