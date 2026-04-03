import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { doc, getDoc, updateDoc, increment, db, auth, onAuthStateChanged, arrayUnion, arrayRemove } from '../firebase';
import { Resource, UserProfile } from '../types';
import { Heart, Bookmark, Share2, ArrowLeft, ExternalLink, Clock, User, ChevronRight, PlayCircle } from 'lucide-react';
import TagBadge from '../components/TagBadge';
import CodeBlock from '../components/CodeBlock';
import ReactMarkdown from 'react-markdown';
import { cn } from '../lib/utils';

export default function ResourceDetail() {
  const { id } = useParams<{ id: string }>();
  const [resource, setResource] = React.useState<Resource | null>(null);
  const [userProfile, setUserProfile] = React.useState<UserProfile | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [isUpvoted, setIsUpvoted] = React.useState(false);
  const [isBookmarked, setIsBookmarked] = React.useState(false);

  React.useEffect(() => {
    if (!id) return;

    const fetchResource = async () => {
      const docRef = doc(db, 'resources', id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setResource({ id: docSnap.id, ...docSnap.data() } as Resource);
      }
      setLoading(false);
    };

    fetchResource();

    const unsubAuth = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
          const profile = userDoc.data() as UserProfile;
          setUserProfile(profile);
          setIsUpvoted(profile.upvotedResources?.includes(id) || false);
          setIsBookmarked(profile.bookmarkedResources?.includes(id) || false);
        }
      }
    });

    return () => unsubAuth();
  }, [id]);

  const handleUpvote = async () => {
    if (!auth.currentUser || !id || !resource) return;
    
    const userRef = doc(db, 'users', auth.currentUser.uid);
    const resourceRef = doc(db, 'resources', id);

    if (isUpvoted) {
      await updateDoc(userRef, { upvotedResources: arrayRemove(id) });
      await updateDoc(resourceRef, { upvotes: increment(-1) });
      setIsUpvoted(false);
      setResource({ ...resource, upvotes: resource.upvotes - 1 });
    } else {
      await updateDoc(userRef, { upvotedResources: arrayUnion(id) });
      await updateDoc(resourceRef, { upvotes: increment(1) });
      setIsUpvoted(true);
      setResource({ ...resource, upvotes: resource.upvotes + 1 });
    }
  };

  const handleBookmark = async () => {
    if (!auth.currentUser || !id || !resource) return;
    
    const userRef = doc(db, 'users', auth.currentUser.uid);
    const resourceRef = doc(db, 'resources', id);

    if (isBookmarked) {
      await updateDoc(userRef, { bookmarkedResources: arrayRemove(id) });
      await updateDoc(resourceRef, { bookmarks: increment(-1) });
      setIsBookmarked(false);
      setResource({ ...resource, bookmarks: resource.bookmarks - 1 });
    } else {
      await updateDoc(userRef, { bookmarkedResources: arrayUnion(id) });
      await updateDoc(resourceRef, { bookmarks: increment(1) });
      setIsBookmarked(true);
      setResource({ ...resource, bookmarks: resource.bookmarks + 1 });
    }
  };

  const handleCopy = async () => {
    if (!id || !resource) return;
    const resourceRef = doc(db, 'resources', id);
    await updateDoc(resourceRef, { copyCount: increment(1) });
    setResource({ ...resource, copyCount: resource.copyCount + 1 });
  };

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-black border-t-transparent dark:border-white" />
      </div>
    );
  }

  if (!resource) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <h2 className="text-2xl font-bold">Resource not found</h2>
        <Link to="/resources" className="mt-4 text-black underline dark:text-white">Back to resources</Link>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
      <div className="lg:col-span-2">
        <Link to="/resources" className="mb-8 flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-black dark:text-gray-400 dark:hover:text-white">
          <ArrowLeft className="h-4 w-4" />
          Back to resources
        </Link>

        <div className="space-y-6">
          <div className="flex flex-wrap items-center gap-3">
            <TagBadge variant={resource.difficulty}>{resource.difficulty}</TagBadge>
            <span className="text-sm font-semibold uppercase tracking-wider text-gray-400">{resource.category}</span>
          </div>

          <h1 className="text-4xl font-bold tracking-tight text-black dark:text-white sm:text-5xl">
            {resource.title}
          </h1>

          <div className="flex flex-wrap items-center gap-6 text-sm text-gray-500 dark:text-gray-400">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4" />
              <span>By AI Hub Team</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <span>Updated {new Date(resource.updatedAt?.seconds * 1000).toLocaleDateString()}</span>
            </div>
          </div>

          <div className="aspect-video overflow-hidden rounded-3xl bg-gray-100 dark:bg-gray-900">
            {resource.imageUrl ? (
              <img src={resource.imageUrl} alt={resource.title} className="h-full w-full object-cover" referrerPolicy="no-referrer" />
            ) : (
              <div className="flex h-full w-full items-center justify-center">
                <PlayCircle className="h-20 w-20 text-gray-300 dark:text-gray-700" />
              </div>
            )}
          </div>

          <div className="prose prose-lg dark:prose-invert max-w-none">
            <ReactMarkdown>{resource.content}</ReactMarkdown>
          </div>

          {resource.promptBlocks && resource.promptBlocks.length > 0 && (
            <div className="space-y-6 pt-8">
              <h2 className="text-2xl font-bold">Prompts & Code</h2>
              {resource.promptBlocks.map((block, idx) => (
                <CodeBlock key={idx} code={block.code} label={block.label} onCopy={handleCopy} />
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="space-y-8">
        <div className="sticky top-24 space-y-6">
          <div className="rounded-3xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-black">
            <div className="flex items-center justify-between">
              <div className="flex flex-col items-center gap-1">
                <button
                  onClick={handleUpvote}
                  className={cn(
                    "flex h-12 w-12 items-center justify-center rounded-full border transition-all",
                    isUpvoted 
                      ? "border-red-500 bg-red-50 text-red-500 dark:bg-red-900/20" 
                      : "border-gray-200 hover:border-red-500 hover:text-red-500 dark:border-gray-800"
                  )}
                >
                  <Heart className={cn("h-6 w-6", isUpvoted && "fill-current")} />
                </button>
                <span className="text-xs font-bold">{resource.upvotes}</span>
              </div>
              
              <div className="flex flex-col items-center gap-1">
                <button
                  onClick={handleBookmark}
                  className={cn(
                    "flex h-12 w-12 items-center justify-center rounded-full border transition-all",
                    isBookmarked 
                      ? "border-blue-500 bg-blue-50 text-blue-500 dark:bg-blue-900/20" 
                      : "border-gray-200 hover:border-blue-500 hover:text-blue-500 dark:border-gray-800"
                  )}
                >
                  <Bookmark className={cn("h-6 w-6", isBookmarked && "fill-current")} />
                </button>
                <span className="text-xs font-bold">{resource.bookmarks}</span>
              </div>

              <div className="flex flex-col items-center gap-1">
                <button className="flex h-12 w-12 items-center justify-center rounded-full border border-gray-200 transition-all hover:border-black dark:border-gray-800 dark:hover:border-white">
                  <Share2 className="h-6 w-6" />
                </button>
                <span className="text-xs font-bold">Share</span>
              </div>
            </div>

            {resource.externalLink && (
              <a
                href={resource.externalLink}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-8 flex w-full items-center justify-center gap-2 rounded-full bg-black py-4 font-bold text-white transition-opacity hover:opacity-80 dark:bg-white dark:text-black"
              >
                Try Tool
                <ExternalLink className="h-5 w-5" />
              </a>
            )}
          </div>

          <div className="rounded-3xl border border-gray-200 bg-gray-50 p-6 dark:border-gray-800 dark:bg-gray-900">
            <h3 className="font-bold">Tags</h3>
            <div className="mt-4 flex flex-wrap gap-2">
              {resource.tags?.map(tag => (
                <TagBadge key={tag}>{tag}</TagBadge>
              ))}
            </div>
          </div>

          {/* Sidebar Ad Placeholder */}
          <div className="flex h-64 w-full items-center justify-center rounded-3xl border border-dashed border-gray-300 bg-white text-xs font-medium text-gray-400 dark:border-gray-700 dark:bg-black">
            ADVERTISEMENT
          </div>
        </div>
      </div>
    </div>
  );
}
