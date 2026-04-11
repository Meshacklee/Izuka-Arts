import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { ArrowRight, Play, Image as ImageIcon, Music } from 'lucide-react';
import { useEffect, useState } from 'react';
import { collection, query, limit, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';

export default function Home() {
  const [featured, setFeatured] = useState<any[]>([]);

  useEffect(() => {
    const q = query(collection(db, 'artworks'), orderBy('createdAt', 'desc'), limit(3));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setFeatured(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    return () => unsubscribe();
  }, []);

  return (
    <div className="relative">
      {/* Hero Section */}
      <section className="relative h-[90vh] flex items-center overflow-hidden bg-neutral-900">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1547826039-bfc35e0f1ea8?auto=format&fit=crop&q=80&w=1920" 
            alt="Hero background" 
            className="w-full h-full object-cover opacity-40"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-neutral-900/80" />
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-3xl"
          >
            <span className="inline-block text-neutral-400 text-sm font-medium tracking-[0.3em] uppercase mb-4">
              Curated Excellence
            </span>
            <h1 className="text-5xl md:text-8xl font-serif font-bold text-white leading-[0.9] tracking-tighter mb-8">
              Where Vision <br />
              <span className="italic text-neutral-400">Meets</span> Reality.
            </h1>
            <p className="text-lg md:text-xl text-neutral-300 mb-10 max-w-xl font-light leading-relaxed">
              A digital sanctuary for the modern artist. Explore a curated collection of visual, 
              auditory, and cinematic masterpieces.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/gallery">
                <Button size="lg" className="rounded-full px-8 bg-white text-neutral-900 hover:bg-neutral-200">
                  Explore Gallery
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link to="/about">
                <Button size="lg" variant="outline" className="rounded-full px-8 border-white text-white hover:bg-white/10">
                  Our Story
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>

        {/* Floating Stats */}
        <div className="absolute bottom-12 right-12 hidden lg:block">
          <div className="flex space-x-12">
            <div>
              <p className="text-4xl font-serif font-bold text-white">120+</p>
              <p className="text-xs text-neutral-400 uppercase tracking-widest mt-1">Artworks</p>
            </div>
            <div>
              <p className="text-4xl font-serif font-bold text-white">45</p>
              <p className="text-xs text-neutral-400 uppercase tracking-widest mt-1">Exhibitions</p>
            </div>
          </div>
        </div>
      </section>

      {/* Media Types Section */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <motion.div 
              whileHover={{ y: -10 }}
              className="p-8 border border-neutral-100 rounded-3xl bg-neutral-50"
            >
              <div className="w-12 h-12 bg-neutral-900 rounded-2xl flex items-center justify-center mb-6">
                <ImageIcon className="text-white h-6 w-6" />
              </div>
              <h3 className="text-xl font-serif font-bold mb-4">Visual Arts</h3>
              <p className="text-neutral-500 text-sm leading-relaxed">
                High-resolution digital paintings, photography, and traditional media captures.
              </p>
            </motion.div>
            <motion.div 
              whileHover={{ y: -10 }}
              className="p-8 border border-neutral-100 rounded-3xl bg-neutral-50"
            >
              <div className="w-12 h-12 bg-neutral-900 rounded-2xl flex items-center justify-center mb-6">
                <Play className="text-white h-6 w-6" />
              </div>
              <h3 className="text-xl font-serif font-bold mb-4">Cinematics</h3>
              <p className="text-neutral-500 text-sm leading-relaxed">
                Short films, motion graphics, and experimental video installations.
              </p>
            </motion.div>
            <motion.div 
              whileHover={{ y: -10 }}
              className="p-8 border border-neutral-100 rounded-3xl bg-neutral-50"
            >
              <div className="w-12 h-12 bg-neutral-900 rounded-2xl flex items-center justify-center mb-6">
                <Music className="text-white h-6 w-6" />
              </div>
              <h3 className="text-xl font-serif font-bold mb-4">Soundscapes</h3>
              <p className="text-neutral-500 text-sm leading-relaxed">
                Immersive audio experiences, ambient compositions, and sound design.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Featured Section */}
      <section className="py-24 bg-neutral-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16">
            <div className="max-w-xl">
              <h2 className="text-4xl md:text-5xl font-serif font-bold tracking-tight mb-6">
                Featured Works
              </h2>
              <p className="text-neutral-500">
                A selection of our most impactful pieces from the current season.
              </p>
            </div>
            <Link to="/gallery" className="mt-8 md:mt-0">
              <Button variant="link" className="text-neutral-900 p-0 h-auto font-semibold">
                View All Works <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featured.length > 0 ? featured.map((art) => (
              <motion.div 
                key={art.id}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="group relative overflow-hidden rounded-3xl aspect-[4/5] bg-neutral-200"
              >
                <img 
                  src={art.type === 'image' ? art.url : art.thumbnailUrl} 
                  alt={art.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-8">
                  <h4 className="text-white text-xl font-serif font-bold">{art.title}</h4>
                  <p className="text-neutral-300 text-sm mt-2 capitalize">{art.type}</p>
                </div>
              </motion.div>
            )) : [1, 2, 3].map((i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="group relative overflow-hidden rounded-3xl aspect-[4/5] bg-neutral-100"
              >
                <div className="w-full h-full flex items-center justify-center text-neutral-300">
                  <ImageIcon className="h-12 w-12" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
