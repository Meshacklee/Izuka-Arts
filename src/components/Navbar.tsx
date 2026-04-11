import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Menu, X, User } from 'lucide-react';
import { useState } from 'react';
import { Button } from './ui/button';
import { Sheet, SheetContent, SheetTrigger } from './ui/sheet';
import { useAuth } from '../AuthContext';
import { cn } from '../lib/utils';
import { Wifi, WifiOff } from 'lucide-react';

const navItems = [
  { name: 'Home', path: '/' },
  { name: 'Gallery', path: '/gallery' },
  { name: 'About', path: '/about' },
  { name: 'Contact', path: '/contact' },
];

export default function Navbar() {
  const location = useLocation();
  const { user, role, connectionIssue } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-neutral-200 bg-white/80 backdrop-blur-md">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link to="/" className="text-2xl font-serif font-bold tracking-tighter text-neutral-900">
              AURA<span className="text-neutral-400">.</span>
            </Link>
            {connectionIssue && (
              <div className="flex items-center text-[10px] text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200 animate-pulse">
                <WifiOff className="h-3 w-3 mr-1" />
                Offline
              </div>
            )}
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  className={cn(
                    "text-sm font-medium transition-colors hover:text-neutral-900",
                    location.pathname === item.path ? "text-neutral-900" : "text-neutral-500"
                  )}
                >
                  {item.name}
                  {location.pathname === item.path && (
                    <motion.div
                      layoutId="nav-underline"
                      className="h-0.5 bg-neutral-900"
                    />
                  )}
                </Link>
              ))}
              {role === 'admin' && (
                <Link
                  to="/admin"
                  className={cn(
                    "text-sm font-medium transition-colors hover:text-neutral-900",
                    location.pathname === '/admin' ? "text-neutral-900" : "text-neutral-500"
                  )}
                >
                  Admin
                </Link>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-2">
                <span className="hidden sm:inline text-xs text-neutral-500">{user.email}</span>
                <Link to="/admin">
                   <Button variant="ghost" size="icon" className="rounded-full">
                    <User className="h-5 w-5" />
                  </Button>
                </Link>
              </div>
            ) : (
              <Link to="/admin">
                <Button variant="outline" size="sm" className="rounded-full px-6">
                  Login
                </Button>
              </Link>
            )}

            {/* Mobile menu button */}
            <div className="md:hidden">
              <Sheet open={isOpen} onOpenChange={setIsOpen}>
                <SheetTrigger
                  render={
                    <Button variant="ghost" size="icon">
                      <Menu className="h-6 w-6" />
                    </Button>
                  }
                />
                <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                  <div className="flex flex-col space-y-8 mt-12">
                    {navItems.map((item) => (
                      <Link
                        key={item.name}
                        to={item.path}
                        onClick={() => setIsOpen(false)}
                        className={cn(
                          "text-2xl font-serif font-medium",
                          location.pathname === item.path ? "text-neutral-900" : "text-neutral-500"
                        )}
                      >
                        {item.name}
                      </Link>
                    ))}
                    {role === 'admin' && (
                      <Link
                        to="/admin"
                        onClick={() => setIsOpen(false)}
                        className={cn(
                          "text-2xl font-serif font-medium",
                          location.pathname === '/admin' ? "text-neutral-900" : "text-neutral-500"
                        )}
                      >
                        Admin
                      </Link>
                    )}
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
