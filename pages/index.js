import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Layout from '../components/Layout';
import { useUser } from './_app';
import { supabase } from '../lib/supabase';

export default function Home() {
  const { user, loading } = useUser();
  const router = useRouter();
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState({ title: '', content: '', tag: '' });
  const [isAdding, setIsAdding] = useState(false);
  const [fetchError, setFetchError] = useState(null);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (user) {
      fetchNotes();
    }
  }, [user]);

  const fetchNotes = async () => {
    try {
      const { data, error } = await supabase
        .from('notes')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      setNotes(data || []);
      setFetchError(null);
    } catch (error) {
      setFetchError('Erreur lors de la récupération des notes');
      console.error('Erreur:', error);
    }
  };

  const handleAddNote = async (e) => {
    e.preventDefault();

    try {
      const { data, error } = await supabase.from('notes').insert([
        {
          title: newNote.title,
          content: newNote.content,
          tag: newNote.tag,
          user_id: user.id,
        },
      ]);

      if (error) {
        throw error;
      }

      setNewNote({ title: '', content: '', tag: '' });
      setIsAdding(false);
      fetchNotes();
    } catch (error) {
      console.error('Erreur lors de l\'ajout de la note:', error);
    }
  };

  const handleDeleteNote = async (id) => {
    try {
      const { error } = await supabase.from('notes').delete().eq('id', id);

      if (error) {
        throw error;
      }

      fetchNotes();
    } catch (error) {
      console.error('Erreur lors de la suppression de la note:', error);
    }
  };

  if (loading) {
    return <Layout>Chargement...</Layout>;
  }

  return (
    <Layout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Mes Notes</h1>

        {fetchError && <p className="text-red-500 mb-4">{fetchError}</p>}

        <button
          onClick={() => setIsAdding(!isAdding)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded mb-6"
        >
          {isAdding ? 'Annuler' : 'Ajouter une note'}
        </button>

        {isAdding && (
          <form onSubmit={handleAddNote} className="bg-white p-6 rounded shadow-md mb-6">
            <div className="mb-4">
              <label htmlFor="title" className="block text-gray-700 mb-2">
                Titre
              </label>
              <input
                type="text"
                id="title"
                value={newNote.title}
                onChange={(e) => setNewNote({ ...newNote, title: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded"
                required
              />
            </div>
            <div className="mb-4">
              <label htmlFor="content" className="block text-gray-700 mb-2">
                Contenu
              </label>
              <textarea
                id="content"
                value={newNote.content}
                onChange={(e) => setNewNote({ ...newNote, content: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded h-32"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="tag" className="block text-gray-700 mb-2">
                Étiquette
              </label>
              <input
                type="text"
                id="tag"
                value={newNote.tag}
                onChange={(e) => setNewNote({ ...newNote, tag: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>
            <button
              type="submit"
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
            >
              Enregistrer
            </button>
          </form>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {notes.length > 0 ? (
            notes.map((note) => (
              <div key={note.id} className="bg-white p-6 rounded shadow-md">
                <div className="flex justify-between items-start mb-2">
                  <h2 className="text-xl font-semibold text-gray-800">{note.title}</h2>
                  <button
                    onClick={() => handleDeleteNote(note.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    Supprimer
                  </button>
                </div>
                {note.tag && (
                  <span className="bg-indigo-100 text-indigo-800 text-xs px-2 py-1 rounded mb-2 inline-block">
                    {note.tag}
                  </span>
                )}
                <p className="text-gray-600 mt-2">{note.content}</p>
                <p className="text-xs text-gray-400 mt-4">
                  {new Date(note.created_at).toLocaleDateString()}
                </p>
              </div>
            ))
          ) : (
            <p className="col-span-3 text-gray-500">Vous n'avez pas encore de notes.</p>
          )}
        </div>
      </div>
    </Layout>
  );
}
