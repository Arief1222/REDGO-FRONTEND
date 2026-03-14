// features/auth/OAuthCallbackPage.tsx
import { useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router'
import { authService } from '@/app/services/authService'
import { authApi } from '@/app/api/auth/authApi'

const OAuthCallbackPage = () => {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()

  useEffect(() => {
    const token = searchParams.get('token')

    if (!token) {
      navigate('/auth/login?error=oauth_failed', { replace: true })
      return
    }

    const handleCallback = async () => {
      try {
        // Simpan token dulu
        await authService.setAuthData(token, null as any)

        // Fetch profile pakai token
        const profileRes = await authApi.getProfile()
        const user = profileRes.data.data

        // Simpan ulang dengan user data lengkap
        await authService.setAuthData(token, user)

        // Redirect ke app
        navigate('/', { replace: true })
      } catch (err) {
        console.error('OAuth callback error:', err)
        navigate('/auth/login?error=oauth_failed', { replace: true })
      }
    }

    handleCallback()
  }, [])

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100vh',
      fontFamily: "'Plus Jakarta Sans', sans-serif",
      flexDirection: 'column',
      gap: '16px',
    }}>
      <div style={{
        width: '40px', height: '40px',
        border: '3px solid #fee2e2',
        borderTop: '3px solid #e53e3e',
        borderRadius: '50%',
        animation: 'spin 0.8s linear infinite',
      }} />
      <p style={{ color: '#9ca3af', fontSize: '14px', fontWeight: 500 }}>
        Menyelesaikan login...
      </p>
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
}

export default OAuthCallbackPage