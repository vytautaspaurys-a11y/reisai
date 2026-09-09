import { createContext, createElement, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import type { Session, User } from '@supabase/supabase-js'
import { supabase } from '../lib/supabase'

type AuthContextValue = {
  user: User | null
  isLoading: boolean
  signIn: (email: string, password: string) => Promise<void>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | null>(null)

function getSignInErrorMessage(message: string): string {
  const lowerMessage = message.toLowerCase()

  if (lowerMessage.includes('invalid login credentials')) {
    return 'Neteisingas el. paštas arba slaptažodis.'
  }

  if (lowerMessage.includes('email not confirmed')) {
    return 'El. paštas dar nepatvirtintas.'
  }

  return 'Nepavyko prisijungti. Bandykite dar kartą.'
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let isMounted = true

    void supabase.auth.getSession().then(({ data }) => {
      if (isMounted) {
        setSession(data.session)
        setIsLoading(false)
      }
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession)
      setIsLoading(false)
    })

    return () => {
      isMounted = false
      subscription.unsubscribe()
    }
  }, [])

  const value = useMemo<AuthContextValue>(
    () => ({
      user: session?.user ?? null,
      isLoading,
      async signIn(email: string, password: string) {
        const { error } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        })

        if (error) {
          throw new Error(getSignInErrorMessage(error.message))
        }
      },
      async signOut() {
        const { error } = await supabase.auth.signOut()

        if (error) {
          throw new Error('Nepavyko atsijungti. Bandykite dar kartą.')
        }
      },
    }),
    [isLoading, session?.user],
  )

  return createElement(AuthContext.Provider, { value }, children)
}

export function useAuth() {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error('useAuth turi būti naudojamas AuthProvider viduje.')
  }

  return context
}
