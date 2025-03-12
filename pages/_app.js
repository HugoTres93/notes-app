import '@/styles/globals.css';
import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

const UserContext = createContext(null);

export const useUser = () => useContext(UserContext);

function MyApp({ Component, pageProps }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Vérifiez si l'utilisateur est connecté
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user || null);
        setLoading(false);
      }
    );

    // Récupérer la session au chargement
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user || null);
      setLoading(false);
    });

    // Nettoyage
    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);

  return (
    <UserContext.Provider value={{ user, loading }}>
      <Component {...pageProps} />
    </UserContext.Provider>
  );
}

export default MyApp;