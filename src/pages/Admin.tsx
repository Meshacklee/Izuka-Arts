import React, { useState } from 'react';
import { signInWithPopup, signOut } from 'firebase/auth';
import { collection, addDoc, serverTimestamp, deleteDoc, doc, query, orderBy, onSnapshot } from 'firebase/firestore';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { auth, db, googleProvider, storage } from '../firebase';
import { useAuth } from '../AuthContext';
import { Button } from '../components/ui/button';
import { cn } from '../lib/utils';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { toast } from 'sonner';
import { LogIn, LogOut, Plus, Trash2, Video, Music, Image as ImageIcon, Loader2, WifiOff } from 'lucide-react';
import { motion } from 'framer-motion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { ScrollArea } from '../components/ui/scroll-area';

export default function Admin() {
  const { user, role, loading: authLoading, connectionIssue } = useAuth();
  const [uploading, setUploading] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [artworks, setArtworks] = useState<any[]>([]);

  // Form states
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState<'image' | 'video' | 'audio'>('image');
  const [url, setUrl] = useState('');
  const [thumbnailUrl, setThumbnailUrl] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [thumbFile, setThumbFile] = useState<File | null>(null);

  const handleLogin = async () => {
    setLoginError(null);
    try {
      await signInWithPopup(auth, googleProvider);
      toast.success("Logged in successfully");
    } catch (error: any) {
      console.error("Login error:", error);
      setLoginError(error.code || error.message);
      if (error.code === 'auth/popup-blocked') {
        toast.error("Popup blocked! Please allow popups for this site.");
      } else if (error.code === 'auth/popup-closed-by-user') {
        toast.error("Sign-in window was closed. Please try again and keep the window open until finished.");
      } else if (error.message?.includes('redirect_uri_mismatch') || error.code === 'auth/invalid-auth-event') {
        setLoginError('redirect_mismatch');
        toast.error("Configuration error: Redirect URI mismatch. Please see the instructions on the page.");
      } else if (error.code === 'auth/network-request-failed' || connectionIssue) {
        toast.error("Network error: Firebase is unreachable. Please try the 'Open in New Tab' button above.");
      } else {
        toast.error(`Login failed: ${error.message}`);
      }
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      toast.success("Logged out successfully");
    } catch (error) {
      toast.error("Logout failed");
    }
  };

  const uploadFile = (file: File, path: string): Promise<string> => {
    return new Promise((resolve, reject) => {
      const storageRef = ref(storage, path);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on('state_changed', 
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setUploadProgress(progress);
        }, 
        (error) => reject(error), 
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            resolve(downloadURL);
          });
        }
      );
    });
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || role !== 'admin') return;
    if (!file && !url) {
      toast.error("Please provide a file or a URL");
      return;
    }

    setUploading(true);
    setUploadProgress(0);
    try {
      let finalUrl = url;
      let finalThumbUrl = thumbnailUrl;

      if (file) {
        const path = `artworks/${Date.now()}_${file.name}`;
        finalUrl = await uploadFile(file, path);
      }

      if (thumbFile && type !== 'image') {
        const path = `thumbnails/${Date.now()}_${thumbFile.name}`;
        finalThumbUrl = await uploadFile(thumbFile, path);
      }

      const artworkData: any = {
        title,
        description,
        type,
        url: finalUrl,
        createdAt: serverTimestamp(),
        authorId: user.uid
      };

      if (type !== 'image' && finalThumbUrl) {
        artworkData.thumbnailUrl = finalThumbUrl;
      }

      await addDoc(collection(db, 'artworks'), artworkData);
      toast.success("Artwork uploaded successfully");
      // Reset form
      setTitle('');
      setDescription('');
      setUrl('');
      setThumbnailUrl('');
      setFile(null);
      setThumbFile(null);
    } catch (error) {
      toast.error("Upload failed. Check permissions.");
      console.error(error);
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this artwork?")) return;
    try {
      await deleteDoc(doc(db, 'artworks', id));
      toast.success("Artwork deleted");
    } catch (error) {
      toast.error("Delete failed");
    }
  };

  // Fetch artworks for management
  useState(() => {
    if (role === 'admin') {
      const q = query(collection(db, 'artworks'), orderBy('createdAt', 'desc'));
      const unsubscribe = onSnapshot(q, (snapshot) => {
        setArtworks(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      });
      return () => unsubscribe();
    }
  }, [role]);

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-neutral-400" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-50 px-4">
        <Card className="w-full max-w-md border-neutral-200 shadow-xl rounded-3xl overflow-hidden">
          <div className="h-2 bg-neutral-900" />
          <CardHeader className="text-center pt-10">
            <CardTitle className="text-3xl font-serif font-bold">Admin Portal</CardTitle>
            <CardDescription>Please sign in to manage your gallery</CardDescription>
          </CardHeader>
          <CardContent className="pb-10 flex flex-col items-center">
            {(connectionIssue || loginError) && (
              <div className={cn(
                "mb-6 p-6 rounded-3xl text-sm text-center shadow-sm border",
                connectionIssue ? "bg-amber-50 border-amber-200 text-amber-900" : "bg-neutral-50 border-neutral-200 text-neutral-900"
              )}>
                <div className="flex justify-center mb-3">
                  <div className={cn("p-2 rounded-full", connectionIssue ? "bg-amber-100" : "bg-neutral-100")}>
                    {connectionIssue ? <WifiOff className="h-6 w-6 text-amber-600" /> : <LogIn className="h-6 w-6 text-neutral-600" />}
                  </div>
                </div>
                <h3 className="font-bold text-lg mb-2">
                  {connectionIssue ? "Connection Blocked" : loginError === 'redirect_mismatch' ? "Configuration Error" : "Login Issue Detected"}
                </h3>
                <p className="mb-4 opacity-80">
                  {connectionIssue 
                    ? "Your current network is blocking the connection to our secure login servers."
                    : loginError === 'redirect_mismatch'
                    ? "The login domain is not authorized in your Google Cloud Console."
                    : "There was a problem with the sign-in popup. This often happens inside an iframe."}
                </p>
                
                {loginError === 'redirect_mismatch' && (
                  <div className="mb-4 p-3 bg-white/50 rounded-xl text-left text-[11px] space-y-2 border border-neutral-200">
                    <p className="font-bold text-neutral-900">To fix this:</p>
                    <ol className="list-decimal ml-4 space-y-1">
                      <li>Go to <a href="https://console.cloud.google.com/apis/credentials" target="_blank" className="text-blue-600 underline">Google Cloud Credentials</a></li>
                      <li>Edit your <strong>OAuth 2.0 Client ID</strong></li>
                      <li>Add <code className="bg-neutral-100 px-1">https://gen-lang-client-0924061132.firebaseapp.com</code> to <strong>Authorized JavaScript origins</strong></li>
                      <li>Add <code className="bg-neutral-100 px-1">https://gen-lang-client-0924061132.firebaseapp.com/__/auth/handler</code> to <strong>Authorized redirect URIs</strong></li>
                    </ol>
                  </div>
                )}

                <div className="space-y-3">
                  <Button 
                    variant="outline" 
                    className={cn(
                      "w-full rounded-full border shadow-sm",
                      connectionIssue ? "border-amber-300 hover:bg-amber-100 text-amber-900" : "border-neutral-300 hover:bg-neutral-100 text-neutral-900"
                    )}
                    onClick={() => window.open(window.location.href, '_blank')}
                  >
                    Open App in New Tab
                  </Button>
                  <p className={cn("text-[10px] italic", connectionIssue ? "text-amber-600" : "text-neutral-500")}>
                    Opening the app in its own tab usually fixes login and popup issues.
                  </p>
                </div>
              </div>
            )}
            <Button onClick={handleLogin} size="lg" className="w-full rounded-full bg-neutral-900 hover:bg-neutral-800 h-14 text-lg shadow-lg group">
              <LogIn className="mr-2 h-5 w-5 transition-transform group-hover:translate-x-1" /> 
              Sign in with Google
            </Button>
            <p className="mt-6 text-xs text-neutral-400 text-center">
              Only authorized administrators can access this section.
            </p>
            <p className="mt-4 text-[10px] text-neutral-400 text-center italic">
              Having trouble? Try opening the app in a <strong>new tab</strong> using the button in the top right of the preview.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (role !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-50 px-4">
        <div className="text-center max-w-md">
          <h1 className="text-4xl font-serif font-bold text-neutral-900 mb-4">Access Denied</h1>
          <p className="text-neutral-500 mb-8">
            Your account ({user.email}) does not have administrator privileges. 
            If you believe this is an error, please contact the system owner.
          </p>
          <Button onClick={handleLogout} variant="outline" className="rounded-full">
            <LogOut className="mr-2 h-4 w-4" /> Sign Out
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 bg-neutral-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-4">
          <div>
            <h1 className="text-4xl font-serif font-bold text-neutral-900">Dashboard</h1>
            <p className="text-neutral-500">Welcome back, {user.displayName || 'Admin'}</p>
          </div>
          <Button onClick={handleLogout} variant="outline" className="rounded-full border-neutral-200">
            <LogOut className="mr-2 h-4 w-4" /> Sign Out
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Upload Form */}
          <Card className="lg:col-span-1 border-neutral-200 rounded-3xl shadow-sm">
            <CardHeader>
              <CardTitle className="font-serif">Upload New Work</CardTitle>
              <CardDescription>Add a new piece to your public gallery</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleUpload} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="title">Title</Label>
                  <Input 
                    id="title" 
                    placeholder="E.g. Midnight Serenade" 
                    value={title} 
                    onChange={(e) => setTitle(e.target.value)}
                    required
                    className="rounded-xl"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Input 
                    id="description" 
                    placeholder="Tell the story behind this piece..." 
                    value={description} 
                    onChange={(e) => setDescription(e.target.value)}
                    className="rounded-xl"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Media Type</Label>
                  <Tabs value={type} onValueChange={(v: any) => setType(v)} className="w-full">
                    <TabsList className="grid grid-cols-3 w-full rounded-xl">
                      <TabsTrigger value="image" className="rounded-lg"><ImageIcon className="h-4 w-4 mr-2" /> Image</TabsTrigger>
                      <TabsTrigger value="video" className="rounded-lg"><Video className="h-4 w-4 mr-2" /> Video</TabsTrigger>
                      <TabsTrigger value="audio" className="rounded-lg"><Music className="h-4 w-4 mr-2" /> Audio</TabsTrigger>
                    </TabsList>
                  </Tabs>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="file">Upload File</Label>
                  <Input 
                    id="file" 
                    type="file" 
                    onChange={(e) => setFile(e.target.files?.[0] || null)}
                    className="rounded-xl cursor-pointer"
                    accept={type === 'image' ? 'image/*' : type === 'video' ? 'video/*' : 'audio/*'}
                  />
                  <p className="text-[10px] text-neutral-400 italic">Or provide a URL below</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="url">Media URL (Optional if file uploaded)</Label>
                  <Input 
                    id="url" 
                    placeholder="https://example.com/file.mp4" 
                    value={url} 
                    onChange={(e) => setUrl(e.target.value)}
                    className="rounded-xl"
                  />
                </div>

                {type !== 'image' && (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="thumb-file">Upload Thumbnail</Label>
                      <Input 
                        id="thumb-file" 
                        type="file" 
                        onChange={(e) => setThumbFile(e.target.files?.[0] || null)}
                        className="rounded-xl cursor-pointer"
                        accept="image/*"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="thumb">Thumbnail URL (Optional)</Label>
                      <Input 
                        id="thumb" 
                        placeholder="https://example.com/thumb.jpg" 
                        value={thumbnailUrl} 
                        onChange={(e) => setThumbnailUrl(e.target.value)}
                        className="rounded-xl"
                      />
                    </div>
                  </div>
                )}

                {uploading && uploadProgress > 0 && (
                  <div className="w-full bg-neutral-100 rounded-full h-2 overflow-hidden">
                    <motion.div 
                      className="bg-neutral-900 h-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                )}

                <Button type="submit" disabled={uploading} className="w-full rounded-full bg-neutral-900 hover:bg-neutral-800">
                  {uploading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Plus className="h-4 w-4 mr-2" />}
                  {uploading ? `Uploading ${Math.round(uploadProgress)}%` : 'Publish Artwork'}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Manage List */}
          <Card className="lg:col-span-2 border-neutral-200 rounded-3xl shadow-sm">
            <CardHeader>
              <CardTitle className="font-serif">Manage Artworks</CardTitle>
              <CardDescription>Edit or remove existing pieces from the gallery</CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[600px] pr-4">
                <div className="space-y-4">
                  {artworks.map((art) => (
                    <div key={art.id} className="flex items-center justify-between p-4 bg-white border border-neutral-100 rounded-2xl group hover:border-neutral-300 transition-colors">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 rounded-lg bg-neutral-100 overflow-hidden">
                          <img 
                            src={art.type === 'image' ? art.url : art.thumbnailUrl} 
                            alt="" 
                            className="w-full h-full object-cover"
                            referrerPolicy="no-referrer"
                          />
                        </div>
                        <div>
                          <h4 className="font-medium text-neutral-900">{art.title}</h4>
                          <p className="text-xs text-neutral-400 capitalize">{art.type}</p>
                        </div>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => handleDelete(art.id)}
                        className="text-neutral-400 hover:text-red-500 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  {artworks.length === 0 && (
                    <div className="text-center py-20 text-neutral-400 italic">
                      No artworks uploaded yet.
                    </div>
                  )}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
