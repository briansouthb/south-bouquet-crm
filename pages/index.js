// pages/index.js
import { useSession, signIn } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

export default function Home() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (session) router.push('/dashboard');
  }, [session, router]);

  if (status === 'loading') {
    return (
      <div className="login-container">
        <div className="login-card">
          <h1 className="login-title">South Bouquet CRM</h1>
          <p className="login-subtitle">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-logo">SB</div>
        <h1 className="login-title">South Bouquet CRM</h1>
        <p className="login-subtitle">Client Relationship Management</p>
        <button className="login-button" onClick={() => signIn('google')}>
          Sign in with Google
        </button>
        <p className="login-note">Restricted to @southbouquetadvisory.com</p>
      </div>
    </div>
  );
}
