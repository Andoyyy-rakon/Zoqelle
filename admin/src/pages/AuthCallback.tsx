import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Loader2 } from 'lucide-react';

export default function AuthCallback() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const code = searchParams.get('code');
    const next = searchParams.get('next') || '/';

    if (!code) {
      navigate('/login', { replace: true });
      return;
    }

    const exchangeCode = async () => {
      const { error } = await supabase.auth.exchangeCodeForSession(code);
      if (error) {
        console.error('Auth callback error:', error);
        navigate('/login', { replace: true });
      } else {
        navigate(next, { replace: true });
      }
    };

    exchangeCode();
  }, [searchParams, navigate]);

  return (
    <div className="min-h-screen bg-[#FFF8F8] flex items-center justify-center" style={{ fontFamily: 'Inter, sans-serif' }}>
      <div className="text-center">
        <Loader2 className="mx-auto h-10 w-10 animate-spin text-[#D4AF37]" />
        <p className="mt-4 text-[#514347]" style={{ fontFamily: 'Inter, sans-serif' }}>
          Signing you in...
        </p>
      </div>
    </div>
  );
}