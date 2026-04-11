import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Mail, MapPin, Phone, Send } from 'lucide-react';
import { toast } from 'sonner';

export default function Contact() {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Message sent! We'll get back to you soon.");
  };

  return (
    <div className="min-h-screen py-20 bg-neutral-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            <div>
              <h1 className="text-5xl font-serif font-bold text-neutral-900 mb-8">Get in Touch</h1>
              <p className="text-neutral-500 text-lg mb-12">
                Have a question about a piece? Interested in a collaboration? 
                Or just want to say hello? We'd love to hear from you.
              </p>

              <div className="space-y-8">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm border border-neutral-100">
                    <Mail className="h-5 w-5 text-neutral-900" />
                  </div>
                  <div>
                    <h4 className="font-bold text-neutral-900">Email</h4>
                    <p className="text-neutral-500">hello@aura-platform.art</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm border border-neutral-100">
                    <MapPin className="h-5 w-5 text-neutral-900" />
                  </div>
                  <div>
                    <h4 className="font-bold text-neutral-900">Studio</h4>
                    <p className="text-neutral-500">123 Creative Lane, Arts District<br />New York, NY 10001</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm border border-neutral-100">
                    <Phone className="h-5 w-5 text-neutral-900" />
                  </div>
                  <div>
                    <h4 className="font-bold text-neutral-900">Phone</h4>
                    <p className="text-neutral-500">+1 (555) 000-1234</p>
                  </div>
                </div>
              </div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white p-10 rounded-[40px] shadow-xl border border-neutral-100"
            >
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="first-name">First Name</Label>
                    <Input id="first-name" placeholder="John" className="rounded-xl" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="last-name">Last Name</Label>
                    <Input id="last-name" placeholder="Doe" className="rounded-xl" required />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" placeholder="john@example.com" className="rounded-xl" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="subject">Subject</Label>
                  <Input id="subject" placeholder="Inquiry about 'Ethereal Dreams'" className="rounded-xl" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="message">Message</Label>
                  <textarea 
                    id="message" 
                    rows={4} 
                    className="w-full rounded-xl border border-neutral-200 p-3 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900 transition-all"
                    placeholder="How can we help you?"
                    required
                  ></textarea>
                </div>
                <Button type="submit" className="w-full rounded-full bg-neutral-900 hover:bg-neutral-800 h-12">
                  <Send className="mr-2 h-4 w-4" /> Send Message
                </Button>
              </form>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
