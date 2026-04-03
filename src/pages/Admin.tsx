import React from 'react';
import { auth, db, onAuthStateChanged, collection, addDoc, getDocs, deleteDoc, doc, updateDoc, serverTimestamp } from '../firebase';
import { UserProfile, Resource, Category } from '../types';
import { Plus, Trash2, Edit, Save, X, LayoutDashboard, FileText, FolderTree, LogIn } from 'lucide-react';
import { cn } from '../lib/utils';

export default function Admin() {
  const [user, setUser] = React.useState<UserProfile | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [resources, setResources] = React.useState<Resource[]>([]);
  const [categories, setCategories] = React.useState<Category[]>([]);
  const [activeTab, setActiveTab] = React.useState<'resources' | 'categories'>('resources');
  const [isEditing, setIsEditing] = React.useState(false);
  const [currentResource, setCurrentResource] = React.useState<Partial<Resource>>({
    title: '',
    description: '',
    category: '',
    difficulty: 'Beginner',
    tags: [],
    content: '',
    promptBlocks: [],
    upvotes: 0,
    bookmarks: 0,
    copyCount: 0,
  });

  React.useEffect(() => {
    const unsubAuth = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const userDoc = await getDocs(collection(db, 'users'));
        const profile = userDoc.docs.find(d => d.id === firebaseUser.uid)?.data() as UserProfile;
        if (profile?.role === 'admin') {
          setUser(profile);
          fetchData();
        } else {
          setUser(null);
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubAuth();
  }, []);

  const fetchData = async () => {
    const resSnap = await getDocs(collection(db, 'resources'));
    setResources(resSnap.docs.map(d => ({ id: d.id, ...d.data() } as Resource)));
    
    const catSnap = await getDocs(collection(db, 'categories'));
    setCategories(catSnap.docs.map(d => ({ id: d.id, ...d.data() } as Category)));
  };

  const handleSeedData = async () => {
    if (!window.confirm('This will seed initial categories and resources. Continue?')) return;
    
    const initialCategories = [
      { name: 'Prompts', icon: 'MessageSquare', description: 'Curated prompts for LLMs like ChatGPT and Claude.' },
      { name: 'Workflows', icon: 'Zap', description: 'Step-by-step automation and logic flows.' },
      { name: 'Tools', icon: 'Wrench', description: 'Essential AI tools and libraries for developers.' },
      { name: 'Guides', icon: 'BookOpen', description: 'In-depth tutorials and best practices.' },
    ];

    for (const cat of initialCategories) {
      await addDoc(collection(db, 'categories'), cat);
    }

    const initialResource = {
      title: 'Mastering Claude 3.5 Sonnet',
      description: 'A comprehensive guide to getting the most out of Anthropic\'s latest model.',
      category: 'Guides',
      difficulty: 'Intermediate',
      tags: ['Claude', 'LLM', 'Prompt Engineering'],
      content: '# Mastering Claude 3.5 Sonnet\n\nClaude 3.5 Sonnet is a powerful model that excels at coding and reasoning. This guide covers the best ways to interact with it.\n\n## Key Features\n- High reasoning capabilities\n- Excellent code generation\n- Fast response times\n\n## Best Practices\n1. Be specific in your instructions.\n2. Use XML tags for structure.\n3. Provide context.',
      promptBlocks: [
        { label: 'System Prompt Template', code: 'You are an expert software engineer. Your goal is to provide clean, efficient, and well-documented code.' },
        { label: 'Coding Request', code: 'Implement a React component that handles real-time data fetching from a Firestore collection.' }
      ],
      upvotes: 42,
      bookmarks: 15,
      copyCount: 120,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      authorId: user?.uid,
    };

    await addDoc(collection(db, 'resources'), initialResource);
    fetchData();
    alert('Data seeded successfully!');
  };

  const handleSaveResource = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentResource.title || !currentResource.category) return;

    try {
      if (currentResource.id) {
        await updateDoc(doc(db, 'resources', currentResource.id), {
          ...currentResource,
          updatedAt: serverTimestamp(),
        });
      } else {
        await addDoc(collection(db, 'resources'), {
          ...currentResource,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
          authorId: user?.uid,
        });
      }
      setIsEditing(false);
      setCurrentResource({
        title: '',
        description: '',
        category: '',
        difficulty: 'Beginner',
        tags: [],
        content: '',
        promptBlocks: [],
        upvotes: 0,
        bookmarks: 0,
        copyCount: 0,
      });
      fetchData();
    } catch (error) {
      console.error('Error saving resource:', error);
    }
  };

  const handleDeleteResource = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this resource?')) {
      await deleteDoc(doc(db, 'resources', id));
      fetchData();
    }
  };

  if (loading) return <div className="flex h-96 items-center justify-center">Loading...</div>;

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="mb-6 rounded-full bg-red-50 p-6 dark:bg-red-900/20">
          <LogIn className="h-12 w-12 text-red-500" />
        </div>
        <h2 className="text-2xl font-bold">Access Denied</h2>
        <p className="mt-2 text-gray-500">You must be an admin to view this page.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-20">
      <div className="flex items-center justify-between">
        <h1 className="text-4xl font-bold tracking-tight">Admin Dashboard</h1>
        <div className="flex gap-4">
          <button
            onClick={handleSeedData}
            className="flex items-center gap-2 rounded-full border border-gray-200 px-6 py-3 font-bold hover:bg-gray-50 dark:border-gray-800 dark:hover:bg-gray-900"
          >
            Seed Initial Data
          </button>
          <button
            onClick={() => {
              setIsEditing(true);
              setCurrentResource({
                title: '',
                description: '',
                category: '',
                difficulty: 'Beginner',
                tags: [],
                content: '',
                promptBlocks: [],
                upvotes: 0,
                bookmarks: 0,
                copyCount: 0,
              });
            }}
            className="flex items-center gap-2 rounded-full bg-black px-6 py-3 font-bold text-white dark:bg-white dark:text-black"
          >
            <Plus className="h-5 w-5" />
            Add Resource
          </button>
        </div>
      </div>

      <div className="flex gap-4 border-b border-gray-100 dark:border-gray-900">
        <button
          onClick={() => setActiveTab('resources')}
          className={cn(
            "flex items-center gap-2 border-b-2 px-4 py-2 text-sm font-bold transition-all",
            activeTab === 'resources' ? "border-black text-black dark:border-white dark:text-white" : "border-transparent text-gray-400"
          )}
        >
          <FileText className="h-4 w-4" />
          Resources
        </button>
        <button
          onClick={() => setActiveTab('categories')}
          className={cn(
            "flex items-center gap-2 border-b-2 px-4 py-2 text-sm font-bold transition-all",
            activeTab === 'categories' ? "border-black text-black dark:border-white dark:text-white" : "border-transparent text-gray-400"
          )}
        >
          <FolderTree className="h-4 w-4" />
          Categories
        </button>
      </div>

      {activeTab === 'resources' && (
        <div className="overflow-hidden rounded-2xl border border-gray-200 dark:border-gray-800">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 dark:bg-gray-900">
              <tr>
                <th className="px-6 py-4 font-bold">Title</th>
                <th className="px-6 py-4 font-bold">Category</th>
                <th className="px-6 py-4 font-bold">Difficulty</th>
                <th className="px-6 py-4 font-bold">Stats</th>
                <th className="px-6 py-4 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-900">
              {resources.map(res => (
                <tr key={res.id} className="hover:bg-gray-50 dark:hover:bg-gray-900/50">
                  <td className="px-6 py-4 font-medium">{res.title}</td>
                  <td className="px-6 py-4 text-gray-500">{res.category}</td>
                  <td className="px-6 py-4">{res.difficulty}</td>
                  <td className="px-6 py-4 text-xs text-gray-400">
                    {res.upvotes} ❤️ • {res.bookmarks} 🔖 • {res.copyCount} 📋
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => {
                          setCurrentResource(res);
                          setIsEditing(true);
                        }}
                        className="rounded-md p-2 text-gray-400 hover:bg-gray-100 hover:text-black dark:hover:bg-gray-800 dark:hover:text-white"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteResource(res.id)}
                        className="rounded-md p-2 text-gray-400 hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-900/20"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {isEditing && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-3xl bg-white p-8 dark:bg-black">
            <div className="mb-8 flex items-center justify-between">
              <h2 className="text-2xl font-bold">{currentResource.id ? 'Edit Resource' : 'Add New Resource'}</h2>
              <button onClick={() => setIsEditing(false)} className="rounded-full p-2 hover:bg-gray-100 dark:hover:bg-gray-900">
                <X className="h-6 w-6" />
              </button>
            </div>

            <form onSubmit={handleSaveResource} className="space-y-6">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-bold">Title</label>
                  <input
                    type="text"
                    required
                    value={currentResource.title}
                    onChange={e => setCurrentResource({ ...currentResource, title: e.target.value })}
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 outline-none focus:border-black dark:border-gray-800 dark:bg-gray-900 dark:focus:border-white"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold">Category</label>
                  <select
                    required
                    value={currentResource.category}
                    onChange={e => setCurrentResource({ ...currentResource, category: e.target.value })}
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 outline-none focus:border-black dark:border-gray-800 dark:bg-gray-900 dark:focus:border-white"
                  >
                    <option value="">Select Category</option>
                    {categories.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-bold">Difficulty</label>
                  <select
                    required
                    value={currentResource.difficulty}
                    onChange={e => setCurrentResource({ ...currentResource, difficulty: e.target.value as any })}
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 outline-none focus:border-black dark:border-gray-800 dark:bg-gray-900 dark:focus:border-white"
                  >
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold">Tags (comma separated)</label>
                  <input
                    type="text"
                    value={currentResource.tags?.join(', ')}
                    onChange={e => setCurrentResource({ ...currentResource, tags: e.target.value.split(',').map(t => t.trim()) })}
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 outline-none focus:border-black dark:border-gray-800 dark:bg-gray-900 dark:focus:border-white"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold">Description</label>
                <textarea
                  required
                  rows={3}
                  value={currentResource.description}
                  onChange={e => setCurrentResource({ ...currentResource, description: e.target.value })}
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 outline-none focus:border-black dark:border-gray-800 dark:bg-gray-900 dark:focus:border-white"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold">Content (Markdown)</label>
                <textarea
                  required
                  rows={8}
                  value={currentResource.content}
                  onChange={e => setCurrentResource({ ...currentResource, content: e.target.value })}
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 font-mono text-sm outline-none focus:border-black dark:border-gray-800 dark:bg-gray-900 dark:focus:border-white"
                />
              </div>

              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-bold">Image URL</label>
                  <input
                    type="url"
                    value={currentResource.imageUrl}
                    onChange={e => setCurrentResource({ ...currentResource, imageUrl: e.target.value })}
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 outline-none focus:border-black dark:border-gray-800 dark:bg-gray-900 dark:focus:border-white"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold">External Link</label>
                  <input
                    type="url"
                    value={currentResource.externalLink}
                    onChange={e => setCurrentResource({ ...currentResource, externalLink: e.target.value })}
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 outline-none focus:border-black dark:border-gray-800 dark:bg-gray-900 dark:focus:border-white"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-4 pt-6">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="rounded-full border border-gray-200 px-8 py-3 font-bold dark:border-gray-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-2 rounded-full bg-black px-8 py-3 font-bold text-white dark:bg-white dark:text-black"
                >
                  <Save className="h-5 w-5" />
                  Save Resource
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
