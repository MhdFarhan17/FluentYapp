import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// We need to use the service role key to bypass RLS for server-side updates if the user doesn't pass their own token,
// But since the user is authenticated in the browser, we should ideally use their session.
// For simplicity in this API route, we'll initialize a server client with the standard URL/Anon key.
// But wait, the anon key + RLS might not let us update easily unless we pass the auth header.
// Let's create an admin client since this is a trusted server route.

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

const supabase = createClient(supabaseUrl, supabaseServiceKey);

export async function POST(req: Request) {
  try {
    const { userId, xpEarned, lessonId } = await req.json();

    if (!userId || xpEarned === undefined) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // First get current points
    const { data: profile, error: fetchError } = await supabase
      .from("user_profiles")
      .select("points")
      .eq("id", userId)
      .single();

    if (fetchError) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const currentPoints = profile.points || 0;
    const newPoints = currentPoints + xpEarned;

    // Update the profile with new points
    const { error: updateError } = await supabase
      .from("user_profiles")
      .update({ points: newPoints })
      .eq("id", userId);

    if (updateError) {
      throw updateError;
    }

    // Save completed lesson if provided
    if (lessonId) {
      const { error: insertError } = await supabase
        .from("user_completed_lessons")
        .insert({ user_id: userId, lesson_id: lessonId });
        
      // Ignore duplicate key error (already completed)
      if (insertError && insertError.code !== '23505') {
        console.error("Failed to save completed lesson", insertError);
      }
    }

    return NextResponse.json({ success: true, newPoints });
    
  } catch (error) {
    console.error("Progress API Error:", error);
    return NextResponse.json({ error: "Failed to update progress" }, { status: 500 });
  }
}
