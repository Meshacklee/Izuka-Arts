import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="border-t border-neutral-200 bg-white py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <Link to="/" className="text-2xl font-serif font-bold tracking-tighter text-neutral-900">
              AURA<span className="text-neutral-400">.</span>
            </Link>
            <p className="mt-4 text-sm text-neutral-500 max-w-xs">
              A curated platform for contemporary digital and traditional art. 
              Exploring the boundaries of visual storytelling.
            </p>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-neutral-900 uppercase tracking-wider">Platform</h3>
            <ul className="mt-4 space-y-2">
              <li><Link to="/gallery" className="text-sm text-neutral-500 hover:text-neutral-900">Gallery</Link></li>
              <li><Link to="/about" className="text-sm text-neutral-500 hover:text-neutral-900">About Us</Link></li>
              <li><Link to="/contact" className="text-sm text-neutral-500 hover:text-neutral-900">Contact</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-neutral-900 uppercase tracking-wider">Legal</h3>
            <ul className="mt-4 space-y-2">
              <li><a href="#" className="text-sm text-neutral-500 hover:text-neutral-900">Privacy Policy</a></li>
              <li><a href="#" className="text-sm text-neutral-500 hover:text-neutral-900">Terms of Service</a></li>
            </ul>
          </div>
        </div>
        <div className="mt-12 border-t border-neutral-100 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-xs text-neutral-400">
            &copy; {new Date().getFullYear()} Aura Artist Platform. All rights reserved.
          </p>
          <div className="mt-4 md:mt-0 flex space-x-6">
            <a href="#" className="text-neutral-400 hover:text-neutral-500">Instagram</a>
            <a href="#" className="text-neutral-400 hover:text-neutral-500">Twitter</a>
            <a href="#" className="text-neutral-400 hover:text-neutral-500">Behance</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
