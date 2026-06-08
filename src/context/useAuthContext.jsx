import { deleteCookie, getCookie, hasCookie, setCookie } from 'cookies-next';
import { createContext, useContext, useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const AuthContext = createContext(undefined);

export function useAuthContext() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
}

const authSessionKey = '_REBACK_AUTH_KEY_';

export function AuthProvider({ children }) {
  const navigate = useNavigate();
  const { tenantSlug } = useParams();
  const tenantSlugRef = useRef(tenantSlug);

  // Keep ref updated with the latest tenantSlug
  useEffect(() => {
    tenantSlugRef.current = tenantSlug;
  }, [tenantSlug]);

  const getSession = () => {
    const fetchedCookie = getCookie(authSessionKey)?.toString();
    if (!fetchedCookie) return;
    else return JSON.parse(fetchedCookie);
  };

  const [user, setUser] = useState(getSession());

  const saveSession = (user) => {
    setCookie(authSessionKey, JSON.stringify(user));
    setUser(user);
  };

  const removeSession = () => {
    deleteCookie(authSessionKey);
    setUser(undefined);
    navigate('/auth/sign-in');
  };

  const removeSession2 = () => {
    const currentTenantSlug = tenantSlugRef.current;
    console.log({ currentTenantSlug });
    
    deleteCookie(authSessionKey);
    setUser(undefined);
    
    if (currentTenantSlug) {
      navigate(`/${currentTenantSlug}/auth/sign-in`);
    } else {
      // Fallback: try to extract tenant slug from current URL path
      const pathMatch = window.location.pathname.match(/^\/([^\/]+)/);
      const extractedSlug = pathMatch ? pathMatch[1] : null;
      
      if (extractedSlug && extractedSlug !== 'auth') {
        navigate(`/${extractedSlug}/auth/sign-in`);
      } else {
        navigate('/auth/sign-in');
      }
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: hasCookie(authSessionKey),
        saveSession,
        removeSession,
        removeSession2,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}