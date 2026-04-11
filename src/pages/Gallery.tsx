import { useEffect, useState } from 'react';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { motion, AnimatePresence } from 'framer-motion';
import { db } from '../firebase';
import { AspectRatio } from '../components/ui/aspect-ratio';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Play, Music, Image as ImageIcon, Filter } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger } from '../components/ui/tabs';

interface Artwork {
  id: string;
  title: string;
  description?: string;
  type: 'image' | 'video' | 'audio';
  url: string;
  thumbnailUrl?: string;
  createdAt: any;
}

export default function Gallery() {
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [filter, setFilter] = useState<string>('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, 'artworks'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const docs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Artwork));
      setArtworks(docs);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching artworks:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const filteredArtworks = filter === 'all' 
    ? artworks 
    : artworks.filter(art => art.type === filter);

  return (
    <div className="min-h-screen py-20 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mb-16">
          <h1 className="text-5xl font-serif font-bold tracking-tight text-neutral-900 mb-6">
            The Gallery
          </h1>
          <p className="text-neutral-500 text-lg">
            Explore our collection of digital and traditional masterpieces. 
            Filter by medium to find exactly what moves you.
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-6">
          <Tabs defaultValue="all" className="w-full md:w-auto" onValueChange={setFilter}>
            <TabsList className="bg-neutral-100 p-1 rounded-full">
              <TabsTrigger value="all" className="rounded-full px-6">All</TabsTrigger>
              <TabsTrigger value="image" className="rounded-full px-6">Images</TabsTrigger>
              <TabsTrigger value="video" className="rounded-full px-6">Video</TabsTrigger>
              <TabsTrigger value="audio" className="rounded-full px-6">Audio</TabsTrigger>
            </TabsList>
          </Tabs>
          
          <div className="flex items-center text-sm text-neutral-400">
            <Filter className="h-4 w-4 mr-2" />
            Showing {filteredArtworks.length} pieces
          </div>
        </div>

        {/* Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="animate-pulse bg-neutral-100 rounded-3xl aspect-[4/5]" />
            ))}
          </div>
        ) : (
          <motion.div 
            layout
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            <AnimatePresence mode="popLayout">
              {filteredArtworks.map((art) => (
                <motion.div
                  key={art.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.4 }}
                  className="group relative overflow-hidden rounded-3xl bg-neutral-50 border border-neutral-100"
                >
                  <AspectRatio ratio={4/5}>
                    {art.type === 'image' ? (
                      <img 
                        src={art.url} 
                        alt={art.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <div className="w-full h-full bg-neutral-900 flex items-center justify-center">
                        {art.thumbnailUrl ? (
                          <img 
                            src={art.thumbnailUrl} 
                            alt={art.title}
                            className="w-full h-full object-cover opacity-50"
                            referrerPolicy="no-referrer"
                          />
                        ) : (
                          <div className="text-neutral-700">
                            {art.type === 'video' ? <Play className="h-12 w-12" /> : <Music className="h-12 w-12" />}
                          </div>
                        )}
                      </div>
                    )}
                  </AspectRatio>

                  <div className="absolute top-4 right-4">
                    <Badge variant="secondary" className="bg-white/90 backdrop-blur-sm text-neutral-900 border-none px-3 py-1 capitalize">
                      {art.type === 'image' && <ImageIcon className="h-3 w-3 mr-1" />}
                      {art.type === 'video' && <Play className="h-3 w-3 mr-1" />}
                      {art.type === 'audio' && <Music className="h-3 w-3 mr-1" />}
                      {art.type}
                    </Badge>
                  </div>

                  <div className="p-6">
                    <h3 className="text-xl font-serif font-bold text-neutral-900 mb-2">{art.title}</h3>
                    {art.description && (
                      <p className="text-neutral-500 text-sm line-clamp-2 mb-4">{art.description}</p>
                    )}
                    <Button variant="outline" size="sm" className="w-full rounded-full border-neutral-200 hover:bg-neutral-900 hover:text-white transition-colors">
                      View Details
                    </Button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}

        {!loading && filteredArtworks.length === 0 && (
          <div className="py-20 text-center">
            <p className="text-neutral-400 font-serif italic text-xl">No artworks found in this category.</p>
          </div>
        )}
      </div>
    </div>
  );
}
