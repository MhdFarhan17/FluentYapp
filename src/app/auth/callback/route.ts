import { NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/dashboard'

  if (code) {
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            const cookieStore = request.headers.get('cookie') || ''
            return cookieStore.split(';').map(cookie => {
              const [name, ...rest] = cookie.trim().split('=')
              return { name, value: rest.join('=') }
            }).filter(c => c.name)
          },
          setAll(cookiesToSet) {
            // Cookies will be set in the response below
          },
        },
      }
    )

    const { error } = await supabase.auth.exchangeCodeForSession(code)
    
    if (!error) {
      const forwardedHost = request.headers.get('x-forwarded-host')
      const isLocalEnv = process.env.NODE_ENV === 'development'
      
      const response = NextResponse.redirect(
        isLocalEnv
          ? `${origin}${next}`
          : forwardedHost
            ? `https://${forwardedHost}${next}`
            : `${origin}${next}`
      )

      // Set cookies from the supabase exchange
      const cookieStore = request.headers.get('cookie') || ''
      const supabaseResponse = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
          cookies: {
            getAll() {
              return cookieStore.split(';').map(cookie => {
                const [name, ...rest] = cookie.trim().split('=')
                return { name, value: rest.join('=') }
              }).filter(c => c.name)
            },
            setAll(cookiesToSet) {
              cookiesToSet.forEach(({ name, value, options }) => {
                response.cookies.set(name, value, options)
              })
            },
          },
        }
      )

      await supabaseResponse.auth.exchangeCodeForSession(code)

      return response
    }
  }

  // If there's an error or no code, redirect to login with error
  return NextResponse.redirect(`${origin}/login?error=auth_callback_error`)
}
