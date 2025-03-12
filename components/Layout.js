import Head from 'next/head';
import Link from 'next/link';
import { useUser } from '../pages/_app';
import { supabase } from '../lib/supabase';
import { useRouter } from 'next/router';

export default function Layout({ children }) {
  const { user, loading } = useUser();
  const router = useRouter();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Head>
        <title>Notes App</title>
        <meta name="description" content="Application de notes personnelles" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <nav className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <Link href="/" className="text-xl font-bold text-indigo-600">
              Notes App
            </Link>
            <div>
              {loading ? (
                <p>Chargement...</p>
              ) : user ? (
                <div className="flex space-x-4 items-center">
                  <p>Bonjour, {user.email}</p>
                  <button
                    onClick={handleSignOut}
                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
                  >
                    Déconnexion
                  </button>
                </div>
              ) : (
                <div className="space-x-4">
                  <Link href="/login" className="text-indigo-600 hover:text-indigo-800">
                    Connexion
                  </Link>
                  <Link
                    href="/register"
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded"
                  >
                    Inscription
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 py-8">{children}</main>
    </div>
  );
}