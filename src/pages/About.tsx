import { motion } from 'framer-motion';

export default function About() {
  return (
    <div className="min-h-screen py-20 bg-white relative overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <span className="text-neutral-400 text-sm font-medium tracking-widest uppercase mb-4 block">Our Story</span>
            <h1 className="text-5xl md:text-7xl font-serif font-bold text-neutral-900 leading-tight mb-8">
              Defining the <br />
              <span className="italic text-blue-500">Artz</span> of Izuka.
            </h1>
            <div className="space-y-6 text-neutral-600 leading-relaxed">
              <p>
                Izuka Artz was born from a simple yet profound realization: 
                art in the digital age deserves a space that honors its complexity and soul.
              </p>
              <p>
                We are more than just a gallery; we are a curated sanctuary for creators who push 
                the boundaries of visual, auditory, and cinematic expression. Our mission is to 
                bridge the gap between the traditional gallery experience and the limitless 
                potential of digital media.
              </p>
              <p>
                Every piece on our platform is hand-selected for its unique "character"—that intangible 
                quality that makes a work of art truly unforgettable.
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="aspect-[4/5] rounded-[40px] overflow-hidden shadow-2xl">
              <img 
                src="https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&q=80&w=1000" 
                alt="Artist at work" 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            {/* Decorative elements */}
            <div className="absolute -bottom-8 -left-8 w-48 h-48 bg-neutral-900 rounded-full -z-10 flex items-center justify-center p-8">
              <p className="text-white text-center text-xs font-serif italic">
                "Art is the only way to run away without leaving home."
              </p>
            </div>
          </motion.div>
        </div>

        {/* Philosophy Section */}
        <div className="mt-32 grid grid-cols-1 md:grid-cols-3 gap-12 border-t border-neutral-100 pt-20">
          <div>
            <h3 className="text-2xl font-serif font-bold mb-4">Curation</h3>
            <p className="text-neutral-500 text-sm leading-relaxed">
              We believe in quality over quantity. Our selection process is rigorous, 
              ensuring every piece contributes to a cohesive and meaningful narrative.
            </p>
          </div>
          <div>
            <h3 className="text-2xl font-serif font-bold mb-4">Innovation</h3>
            <p className="text-neutral-500 text-sm leading-relaxed">
              From VR installations to generative soundscapes, we embrace the 
              technologies that are defining the future of artistic expression.
            </p>
          </div>
          <div>
            <h3 className="text-2xl font-serif font-bold mb-4">Community</h3>
            <p className="text-neutral-500 text-sm leading-relaxed">
              We foster a global community of artists and collectors, providing 
              a platform for dialogue, collaboration, and mutual growth.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
