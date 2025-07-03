import { useState, useEffect } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Shield, 
  Upload, 
  Package, 
  TrendingUp, 
  DollarSign, 
  Users, 
  Star,
  Building2,
  Palette,
  ChevronDown,
  ChevronUp,
  LogOut,
  Megaphone,
  BarChart3,
  Image as ImageIcon,
  Settings,
  Trash2
} from 'lucide-react';
import { apiRequest } from '@/lib/queryClient';
import { toast } from '@/hooks/use-toast';
import { useLocation } from 'wouter';

// Background Image Form Component
function BackgroundImageForm({ section }: { section: string }) {
  const [formData, setFormData] = useState({
    imageUrl: '',
    title: '',
    subtitle: ''
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const queryClient = useQueryClient();

  const backgroundMutation = useMutation({
    mutationFn: async (data: any) => {
      const formData = new FormData();
      formData.append('section', section);
      formData.append('title', data.title);
      formData.append('subtitle', data.subtitle);
      
      if (imageFile) {
        formData.append('imageFile', imageFile);
      } else {
        formData.append('imageUrl', data.imageUrl);
      }

      const response = await apiRequest('/api/admin/background-images', 'POST', formData);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/background/${section}`] });
      setFormData({ imageUrl: '', title: '', subtitle: '' });
      setImageFile(null);
      toast({
        title: "Success",
        description: `${section === 'gallery' ? 'Gallery' : 'Corporate'} background updated successfully`,
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update background",
        variant: "destructive",
      });
    }
  });

  const handleSubmit = () => {
    if (!formData.imageUrl && !imageFile) {
      toast({
        title: "Error",
        description: "Please provide either an image URL or upload a file",
        variant: "destructive",
      });
      return;
    }
    backgroundMutation.mutate(formData);
  };

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor={`bg-title-${section}`}>Background Title</Label>
        <Input
          id={`bg-title-${section}`}
          value={formData.title}
          onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
          placeholder="Enter background title"
        />
      </div>

      <div>
        <Label htmlFor={`bg-subtitle-${section}`}>Background Subtitle</Label>
        <Input
          id={`bg-subtitle-${section}`}
          value={formData.subtitle}
          onChange={(e) => setFormData(prev => ({ ...prev, subtitle: e.target.value }))}
          placeholder="Enter background subtitle"
        />
      </div>

      <div>
        <Label htmlFor={`bg-file-${section}`}>Upload Image File</Label>
        <Input
          id={`bg-file-${section}`}
          type="file"
          accept="image/*"
          onChange={(e) => setImageFile(e.target.files?.[0] || null)}
        />
      </div>

      <div className="text-center text-sm text-muted-foreground">OR</div>

      <div>
        <Label htmlFor={`bg-url-${section}`}>Image URL</Label>
        <Input
          id={`bg-url-${section}`}
          value={formData.imageUrl}
          onChange={(e) => setFormData(prev => ({ ...prev, imageUrl: e.target.value }))}
          placeholder="Enter image URL"
        />
      </div>

      <Button 
        onClick={handleSubmit}
        disabled={backgroundMutation.isPending}
        className={`w-full ${section === 'gallery' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-purple-600 hover:bg-purple-700'}`}
      >
        {backgroundMutation.isPending ? 'Updating...' : `Update ${section === 'gallery' ? 'Gallery' : 'Corporate'} Background`}
      </Button>
    </div>
  );
}

export default function AdminNew() {
  const [, setLocation] = useLocation();
  const [user, setUser] = useState<any>(null);
  const [collapsedSections, setCollapsedSections] = useState<Record<string, boolean>>({
    'manage-paintings': true,
    'manage-corporate-gifts': true
  });

  const queryClient = useQueryClient();

  // Check authentication on component mount
  useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        const userData = JSON.parse(userStr);
        if (userData.role === 'admin') {
          setUser(userData);
        } else {
          // User is not admin, redirect to home
          setLocation('/');
        }
      } catch (error) {
        console.error('Error parsing user data:', error);
        setLocation('/auth');
      }
    } else {
      // No user logged in, redirect to auth
      setLocation('/auth');
    }
  }, [setLocation]);

  // Fetch paintings data
  const { data: paintings = [] } = useQuery({
    queryKey: ['/api/paintings'],
    enabled: !!user
  });

  // Fetch corporate gifts data
  const { data: corporateGifts = [] } = useQuery({
    queryKey: ['/api/corporate-gifts'],
    enabled: !!user
  });

  // Upload form state
  const [uploadForm, setUploadForm] = useState({
    title: '',
    description: '',
    price: '',
    imageUrl: '',
    imageFile: null as File | null,
    medium: '',
    dimensions: '',
    year: '',
    artist: '',
    artistBio: '',
    artistPhoto: '',
    artistBornYear: '',
    artistAwards: '',
    availableSizes: [] as string[],
    availableFrames: [] as string[]
  });

  // Corporate gift form state
  const [giftForm, setGiftForm] = useState({
    title: '',
    description: '',
    price: '',
    imageUrl: '',
    imageFile: null as File | null,
    category: '',
    minQuantity: '1'
  });

  // Banner form state
  const [bannerForm, setBannerForm] = useState({
    text: '',
    backgroundColor: '#1e40af',
    textColor: '#ffffff'
  });

  // Corporate banner form state
  const [corporateBannerForm, setCorporateBannerForm] = useState({
    text: '',
    backgroundColor: '#7c3aed',
    textColor: '#ffffff'
  });

  const toggleSection = (sectionId: string) => {
    setCollapsedSections(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }));
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
    
    // Dispatch custom event to update navigation
    window.dispatchEvent(new CustomEvent('userStateChanged'));
    
    toast({
      title: "Success",
      description: "Logged out successfully",
    });
    
    // Redirect to home page
    setLocation('/');
  };

  // Upload mutations
  const uploadMutation = useMutation({
    mutationFn: async (formData: FormData) => {
      const response = await apiRequest('/api/admin/paintings', 'POST', formData);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/paintings'] });
      setUploadForm({
        title: '',
        description: '',
        price: '',
        imageUrl: '',
        imageFile: null,
        medium: '',
        dimensions: '',
        year: '',
        artist: '',
        artistBio: '',
        artistPhoto: '',
        artistBornYear: '',
        artistAwards: '',
        availableSizes: [],
        availableFrames: []
      });
      toast({
        title: "Success",
        description: "Painting uploaded successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to upload painting",
        variant: "destructive",
      });
    }
  });

  const uploadGiftMutation = useMutation({
    mutationFn: async (formData: FormData) => {
      const response = await apiRequest('/api/admin/corporate-gifts', 'POST', formData);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/corporate-gifts'] });
      setGiftForm({
        title: '',
        description: '',
        price: '',
        imageUrl: '',
        imageFile: null,
        category: '',
        minQuantity: '1'
      });
      toast({
        title: "Success",
        description: "Corporate gift uploaded successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to upload corporate gift",
        variant: "destructive",
      });
    }
  });

  const bannerMutation = useMutation({
    mutationFn: async (bannerData: any) => {
      const response = await apiRequest('/api/admin/banners', 'POST', bannerData);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/banner/active'] });
      setBannerForm({
        text: '',
        backgroundColor: '#1e40af',
        textColor: '#ffffff'
      });
      toast({
        title: "Success",
        description: "Banner created successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create banner",
        variant: "destructive",
      });
    }
  });

  const corporateBannerMutation = useMutation({
    mutationFn: async (bannerData: any) => {
      const response = await apiRequest('/api/admin/corporate-banners', 'POST', bannerData);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/corporate-banner/active'] });
      setCorporateBannerForm({
        text: '',
        backgroundColor: '#7c3aed',
        textColor: '#ffffff'
      });
      toast({
        title: "Success",
        description: "Corporate banner created successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create corporate banner",
        variant: "destructive",
      });
    }
  });

  // Painting management mutations
  const togglePaintingSoldMutation = useMutation({
    mutationFn: async ({ id, sold }: { id: string, sold: boolean }) => {
      const response = await apiRequest(`/api/admin/paintings/${id}/sold`, 'PUT', { sold });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/paintings'] });
      toast({
        title: "Success",
        description: "Painting status updated successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update painting status",
        variant: "destructive",
      });
    }
  });

  const deletePaintingMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await apiRequest(`/api/admin/paintings/${id}`, 'DELETE');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/paintings'] });
      toast({
        title: "Success",
        description: "Painting deleted successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to delete painting",
        variant: "destructive",
      });
    }
  });

  // Corporate gift management mutations
  const deleteCorporateGiftMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await apiRequest(`/api/admin/corporate-gifts/${id}`, 'DELETE');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/corporate-gifts'] });
      toast({
        title: "Success",
        description: "Corporate gift deleted successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to delete corporate gift",
        variant: "destructive",
      });
    }
  });

  // Handler functions
  const togglePaintingSold = (id: string, sold: boolean) => {
    togglePaintingSoldMutation.mutate({ id, sold });
  };

  const deletePainting = (id: string) => {
    if (confirm('Are you sure you want to delete this painting? This action cannot be undone.')) {
      deletePaintingMutation.mutate(id);
    }
  };

  const deleteCorporateGift = (id: string) => {
    if (confirm('Are you sure you want to delete this corporate gift? This action cannot be undone.')) {
      deleteCorporateGiftMutation.mutate(id);
    }
  };

  // Show loading while checking authentication
  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Shield className="mx-auto h-12 w-12 text-elegant-gold animate-pulse" />
          <p className="mt-4 text-lg text-charcoal">Checking admin access...</p>
        </div>
      </div>
    );
  }

  const handleUpload = () => {
    if (!uploadForm.title || !uploadForm.description || !uploadForm.price) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    if (!uploadForm.imageUrl && !uploadForm.imageFile) {
      toast({
        title: "Error",
        description: "Please provide either an image URL or upload a file",
        variant: "destructive",
      });
      return;
    }

    const formData = new FormData();
    formData.append('title', uploadForm.title);
    formData.append('description', uploadForm.description);
    formData.append('price', uploadForm.price);
    formData.append('medium', uploadForm.medium);
    formData.append('dimensions', uploadForm.dimensions);
    formData.append('year', uploadForm.year);
    formData.append('artist', uploadForm.artist);
    formData.append('artistBio', uploadForm.artistBio);
    formData.append('artistPhoto', uploadForm.artistPhoto);
    formData.append('artistBornYear', uploadForm.artistBornYear);
    formData.append('artistAwards', uploadForm.artistAwards);
    formData.append('availableSizes', JSON.stringify(uploadForm.availableSizes));
    formData.append('availableFrames', JSON.stringify(uploadForm.availableFrames));
    
    if (uploadForm.imageFile) {
      formData.append('imageFile', uploadForm.imageFile);
    } else {
      formData.append('imageUrl', uploadForm.imageUrl);
    }

    uploadMutation.mutate(formData);
  };

  const handleGiftUpload = () => {
    if (!giftForm.title || !giftForm.description || !giftForm.price) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    if (!giftForm.imageUrl && !giftForm.imageFile) {
      toast({
        title: "Error",
        description: "Please provide either an image URL or upload a file",
        variant: "destructive",
      });
      return;
    }

    const formData = new FormData();
    formData.append('title', giftForm.title);
    formData.append('description', giftForm.description);
    formData.append('price', giftForm.price);
    formData.append('category', giftForm.category);
    formData.append('minQuantity', giftForm.minQuantity);
    
    if (giftForm.imageFile) {
      formData.append('imageFile', giftForm.imageFile);
    } else {
      formData.append('imageUrl', giftForm.imageUrl);
    }

    uploadGiftMutation.mutate(formData);
  };

  const sizeOptions = [
    'Canvas Print (16x20)', 'Canvas Print (20x24)', 'Canvas Print (24x36)',
    'Framed Print (11x14)', 'Framed Print (16x20)', 'Framed Print (20x24)',
    'Metal Print (12x18)', 'Metal Print (16x24)', 'Metal Print (20x30)'
  ];

  const frameOptions = [
    'Gallery Wrap', 'Black Frame', 'White Frame', 'Natural Wood Frame',
    'Floating Frame', 'No Frame'
  ];

  return (
    <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl font-serif font-bold text-charcoal">Admin Dashboard</h2>
          <p className="text-muted-foreground mt-2">Manage your gallery and corporate gifting operations</p>
        </div>
        <Button onClick={handleLogout} variant="outline">
          <LogOut className="mr-2" size={16} />
          Logout
        </Button>
      </div>

      {/* Gallery Management Section */}
      <div className="mb-12">
        <div className="flex items-center mb-6 pb-4 border-b-2 border-blue-200">
          <Palette className="mr-3 text-blue-600" size={28} />
          <h3 className="text-2xl font-semibold text-charcoal">Gallery Management</h3>
        </div>

        <div className="grid gap-6">
          {/* Gallery Analytics */}
          <Card>
            <CardHeader 
              className="cursor-pointer"
              onClick={() => toggleSection('gallery-analytics')}
            >
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center">
                  <BarChart3 className="mr-2 text-blue-600" size={20} />
                  Gallery Analytics
                </div>
                {collapsedSections['gallery-analytics'] ? <ChevronDown size={20} /> : <ChevronUp size={20} />}
              </CardTitle>
            </CardHeader>
            {!collapsedSections['gallery-analytics'] && (
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-blue-600">Total Paintings</p>
                        <p className="text-2xl font-bold text-blue-900">{paintings.length}</p>
                      </div>
                      <Package className="h-8 w-8 text-blue-500" />
                    </div>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-green-600">Available</p>
                        <p className="text-2xl font-bold text-green-900">
                          {paintings.filter((p: any) => !p.sold).length}
                        </p>
                      </div>
                      <Star className="h-8 w-8 text-green-500" />
                    </div>
                  </div>
                  <div className="bg-red-50 p-4 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-red-600">Sold</p>
                        <p className="text-2xl font-bold text-red-900">
                          {paintings.filter((p: any) => p.sold).length}
                        </p>
                      </div>
                      <TrendingUp className="h-8 w-8 text-red-500" />
                    </div>
                  </div>
                </div>
              </CardContent>
            )}
          </Card>

          {/* Upload Painting */}
          <Card>
            <CardHeader 
              className="cursor-pointer"
              onClick={() => toggleSection('upload-painting')}
            >
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center">
                  <Upload className="mr-2 text-blue-600" size={20} />
                  Upload Painting
                </div>
                {collapsedSections['upload-painting'] ? <ChevronDown size={20} /> : <ChevronUp size={20} />}
              </CardTitle>
            </CardHeader>
            {!collapsedSections['upload-painting'] && (
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="title">Title *</Label>
                    <Input
                      id="title"
                      value={uploadForm.title}
                      onChange={(e) => setUploadForm(prev => ({ ...prev, title: e.target.value }))}
                      placeholder="Enter painting title"
                    />
                  </div>
                  <div>
                    <Label htmlFor="price">Price * ($)</Label>
                    <Input
                      id="price"
                      type="number"
                      value={uploadForm.price}
                      onChange={(e) => setUploadForm(prev => ({ ...prev, price: e.target.value }))}
                      placeholder="Enter price"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="description">Description *</Label>
                  <Textarea
                    id="description"
                    value={uploadForm.description}
                    onChange={(e) => setUploadForm(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Enter painting description"
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="medium">Medium</Label>
                    <Input
                      id="medium"
                      value={uploadForm.medium}
                      onChange={(e) => setUploadForm(prev => ({ ...prev, medium: e.target.value }))}
                      placeholder="e.g., Oil on canvas"
                    />
                  </div>
                  <div>
                    <Label htmlFor="dimensions">Dimensions</Label>
                    <Input
                      id="dimensions"
                      value={uploadForm.dimensions}
                      onChange={(e) => setUploadForm(prev => ({ ...prev, dimensions: e.target.value }))}
                      placeholder="e.g., 24x36 inches"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="artist">Artist</Label>
                    <Input
                      id="artist"
                      value={uploadForm.artist}
                      onChange={(e) => setUploadForm(prev => ({ ...prev, artist: e.target.value }))}
                      placeholder="Artist name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="year">Year</Label>
                    <Input
                      id="year"
                      type="number"
                      value={uploadForm.year}
                      onChange={(e) => setUploadForm(prev => ({ ...prev, year: e.target.value }))}
                      placeholder="Year created"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="artistBio">Artist Biography</Label>
                  <Textarea
                    id="artistBio"
                    value={uploadForm.artistBio}
                    onChange={(e) => setUploadForm(prev => ({ ...prev, artistBio: e.target.value }))}
                    placeholder="Brief biography of the artist"
                    rows={2}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="artistPhoto">Artist Photo URL</Label>
                    <Input
                      id="artistPhoto"
                      value={uploadForm.artistPhoto}
                      onChange={(e) => setUploadForm(prev => ({ ...prev, artistPhoto: e.target.value }))}
                      placeholder="URL to artist photo"
                    />
                  </div>
                  <div>
                    <Label htmlFor="artistBornYear">Artist Born Year</Label>
                    <Input
                      id="artistBornYear"
                      type="number"
                      value={uploadForm.artistBornYear}
                      onChange={(e) => setUploadForm(prev => ({ ...prev, artistBornYear: e.target.value }))}
                      placeholder="Birth year"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="artistAwards">Artist Awards/Recognition</Label>
                  <Textarea
                    id="artistAwards"
                    value={uploadForm.artistAwards}
                    onChange={(e) => setUploadForm(prev => ({ ...prev, artistAwards: e.target.value }))}
                    placeholder="Awards, exhibitions, and recognition"
                    rows={2}
                  />
                </div>

                <div>
                  <Label>Available Sizes</Label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2">
                    {sizeOptions.map((size) => (
                      <div key={size} className="flex items-center space-x-2">
                        <Checkbox
                          id={`size-${size}`}
                          checked={uploadForm.availableSizes.includes(size)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setUploadForm(prev => ({
                                ...prev,
                                availableSizes: [...prev.availableSizes, size]
                              }));
                            } else {
                              setUploadForm(prev => ({
                                ...prev,
                                availableSizes: prev.availableSizes.filter(s => s !== size)
                              }));
                            }
                          }}
                        />
                        <Label htmlFor={`size-${size}`} className="text-sm">{size}</Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <Label>Available Frames</Label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2">
                    {frameOptions.map((frame) => (
                      <div key={frame} className="flex items-center space-x-2">
                        <Checkbox
                          id={`frame-${frame}`}
                          checked={uploadForm.availableFrames.includes(frame)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setUploadForm(prev => ({
                                ...prev,
                                availableFrames: [...prev.availableFrames, frame]
                              }));
                            } else {
                              setUploadForm(prev => ({
                                ...prev,
                                availableFrames: prev.availableFrames.filter(f => f !== frame)
                              }));
                            }
                          }}
                        />
                        <Label htmlFor={`frame-${frame}`} className="text-sm">{frame}</Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <Label htmlFor="image-file">Upload Image File</Label>
                  <Input
                    id="image-file"
                    type="file"
                    accept="image/*"
                    onChange={(e) => setUploadForm(prev => ({ ...prev, imageFile: e.target.files?.[0] || null }))}
                  />
                </div>

                <div className="text-center text-sm text-muted-foreground">OR</div>

                <div>
                  <Label htmlFor="imageUrl">Image URL</Label>
                  <Input
                    id="imageUrl"
                    value={uploadForm.imageUrl}
                    onChange={(e) => setUploadForm(prev => ({ ...prev, imageUrl: e.target.value }))}
                    placeholder="Enter image URL"
                  />
                </div>

                <Button 
                  onClick={handleUpload}
                  disabled={uploadMutation.isPending}
                  className="w-full bg-blue-600 hover:bg-blue-700"
                >
                  {uploadMutation.isPending ? 'Uploading...' : 'Upload Painting'}
                </Button>
              </CardContent>
            )}
          </Card>

          {/* Gallery Banner Management */}
          <Card>
            <CardHeader 
              className="cursor-pointer"
              onClick={() => toggleSection('gallery-banner')}
            >
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center">
                  <Megaphone className="mr-2 text-blue-600" size={20} />
                  Gallery Banner Management
                </div>
                {collapsedSections['gallery-banner'] ? <ChevronDown size={20} /> : <ChevronUp size={20} />}
              </CardTitle>
            </CardHeader>
            {!collapsedSections['gallery-banner'] && (
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="banner-text">Banner Text</Label>
                  <Input
                    id="banner-text"
                    value={bannerForm.text}
                    onChange={(e) => setBannerForm(prev => ({ ...prev, text: e.target.value }))}
                    placeholder="Enter banner text"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="banner-bg-color">Background Color</Label>
                    <Input
                      id="banner-bg-color"
                      type="color"
                      value={bannerForm.backgroundColor}
                      onChange={(e) => setBannerForm(prev => ({ ...prev, backgroundColor: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="banner-text-color">Text Color</Label>
                    <Input
                      id="banner-text-color"
                      type="color"
                      value={bannerForm.textColor}
                      onChange={(e) => setBannerForm(prev => ({ ...prev, textColor: e.target.value }))}
                    />
                  </div>
                </div>

                <Button 
                  onClick={() => bannerMutation.mutate(bannerForm)}
                  disabled={bannerMutation.isPending}
                  className="w-full bg-blue-600 hover:bg-blue-700"
                >
                  {bannerMutation.isPending ? 'Creating...' : 'Create Gallery Banner'}
                </Button>
              </CardContent>
            )}
          </Card>

          {/* Manage Paintings */}
          <Card>
            <CardHeader 
              className="cursor-pointer"
              onClick={() => toggleSection('manage-paintings')}
            >
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center">
                  <Settings className="mr-2 text-blue-600" size={20} />
                  Manage Paintings
                </div>
                {collapsedSections['manage-paintings'] ? <ChevronDown size={20} /> : <ChevronUp size={20} />}
              </CardTitle>
            </CardHeader>
            {!collapsedSections['manage-paintings'] && (
              <CardContent>
                <div className="space-y-4">
                  {paintings.map((painting: any) => (
                    <div key={painting.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <img 
                          src={painting.imageUrl} 
                          alt={painting.title}
                          className="w-16 h-16 object-cover rounded"
                        />
                        <div>
                          <h4 className="font-medium">{painting.title}</h4>
                          <p className="text-sm text-gray-600">${painting.price}</p>
                          <span className={`inline-block px-2 py-1 text-xs rounded ${
                            painting.sold 
                              ? 'bg-red-100 text-red-800' 
                              : 'bg-green-100 text-green-800'
                          }`}>
                            {painting.sold ? 'Sold' : 'Available'}
                          </span>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => togglePaintingSold(painting.id, !painting.sold)}
                          className={painting.sold ? 'text-green-600 hover:text-green-700' : 'text-orange-600 hover:text-orange-700'}
                        >
                          {painting.sold ? 'Mark Available' : 'Mark Sold'}
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => deletePainting(painting.id)}
                        >
                          <Trash2 size={16} />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            )}
          </Card>
        </div>
      </div>

      {/* Corporate Gifting Management Section */}
      <div className="mb-12">
        <div className="flex items-center mb-6 pb-4 border-b-2 border-purple-200">
          <Building2 className="mr-3 text-purple-600" size={28} />
          <h3 className="text-2xl font-semibold text-charcoal">Corporate Gifting Management</h3>
        </div>

        <div className="grid gap-6">
          {/* Corporate Analytics */}
          <Card>
            <CardHeader 
              className="cursor-pointer"
              onClick={() => toggleSection('corporate-analytics')}
            >
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center">
                  <BarChart3 className="mr-2 text-purple-600" size={20} />
                  Corporate Analytics
                </div>
                {collapsedSections['corporate-analytics'] ? <ChevronDown size={20} /> : <ChevronUp size={20} />}
              </CardTitle>
            </CardHeader>
            {!collapsedSections['corporate-analytics'] && (
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-purple-50 p-4 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-purple-600">Total Gifts</p>
                        <p className="text-2xl font-bold text-purple-900">{corporateGifts.length}</p>
                      </div>
                      <Package className="h-8 w-8 text-purple-500" />
                    </div>
                  </div>
                  <div className="bg-indigo-50 p-4 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-indigo-600">Revenue</p>
                        <p className="text-2xl font-bold text-indigo-900">$12,450</p>
                      </div>
                      <DollarSign className="h-8 w-8 text-indigo-500" />
                    </div>
                  </div>
                  <div className="bg-pink-50 p-4 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-pink-600">Corporate Clients</p>
                        <p className="text-2xl font-bold text-pink-900">23</p>
                      </div>
                      <Users className="h-8 w-8 text-pink-500" />
                    </div>
                  </div>
                </div>
              </CardContent>
            )}
          </Card>

          {/* Upload Corporate Gift */}
          <Card>
            <CardHeader 
              className="cursor-pointer"
              onClick={() => toggleSection('upload-gift')}
            >
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center">
                  <Upload className="mr-2 text-purple-600" size={20} />
                  Upload Corporate Gift
                </div>
                {collapsedSections['upload-gift'] ? <ChevronDown size={20} /> : <ChevronUp size={20} />}
              </CardTitle>
            </CardHeader>
            {!collapsedSections['upload-gift'] && (
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="gift-title">Title *</Label>
                    <Input
                      id="gift-title"
                      value={giftForm.title}
                      onChange={(e) => setGiftForm(prev => ({ ...prev, title: e.target.value }))}
                      placeholder="Enter gift title"
                    />
                  </div>
                  <div>
                    <Label htmlFor="gift-price">Price * ($)</Label>
                    <Input
                      id="gift-price"
                      type="number"
                      value={giftForm.price}
                      onChange={(e) => setGiftForm(prev => ({ ...prev, price: e.target.value }))}
                      placeholder="Enter price"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="gift-description">Description *</Label>
                  <Textarea
                    id="gift-description"
                    value={giftForm.description}
                    onChange={(e) => setGiftForm(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Enter gift description"
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="gift-category">Category</Label>
                    <Input
                      id="gift-category"
                      value={giftForm.category}
                      onChange={(e) => setGiftForm(prev => ({ ...prev, category: e.target.value }))}
                      placeholder="e.g., Office Supplies"
                    />
                  </div>
                  <div>
                    <Label htmlFor="gift-min-quantity">Minimum Quantity</Label>
                    <Input
                      id="gift-min-quantity"
                      type="number"
                      value={giftForm.minQuantity}
                      onChange={(e) => setGiftForm(prev => ({ ...prev, minQuantity: e.target.value }))}
                      placeholder="Minimum order quantity"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="gift-image-file">Upload Image File</Label>
                  <Input
                    id="gift-image-file"
                    type="file"
                    accept="image/*"
                    onChange={(e) => setGiftForm(prev => ({ ...prev, imageFile: e.target.files?.[0] || null }))}
                  />
                </div>

                <div className="text-center text-sm text-muted-foreground">OR</div>

                <div>
                  <Label htmlFor="gift-imageUrl">Image URL</Label>
                  <Input
                    id="gift-imageUrl"
                    value={giftForm.imageUrl}
                    onChange={(e) => setGiftForm(prev => ({ ...prev, imageUrl: e.target.value }))}
                    placeholder="Enter image URL"
                  />
                </div>

                <Button 
                  onClick={handleGiftUpload}
                  disabled={uploadGiftMutation.isPending}
                  className="w-full bg-purple-600 hover:bg-purple-700"
                >
                  {uploadGiftMutation.isPending ? 'Uploading...' : 'Upload Corporate Gift'}
                </Button>
              </CardContent>
            )}
          </Card>

          {/* Corporate Banner Management */}
          <Card>
            <CardHeader 
              className="cursor-pointer"
              onClick={() => toggleSection('corporate-banner')}
            >
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center">
                  <Megaphone className="mr-2 text-purple-600" size={20} />
                  Corporate Banner Management
                </div>
                {collapsedSections['corporate-banner'] ? <ChevronDown size={20} /> : <ChevronUp size={20} />}
              </CardTitle>
            </CardHeader>
            {!collapsedSections['corporate-banner'] && (
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="corporate-banner-text">Banner Text</Label>
                  <Input
                    id="corporate-banner-text"
                    value={corporateBannerForm.text}
                    onChange={(e) => setCorporateBannerForm(prev => ({ ...prev, text: e.target.value }))}
                    placeholder="Enter corporate banner text"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="corporate-banner-bg-color">Background Color</Label>
                    <Input
                      id="corporate-banner-bg-color"
                      type="color"
                      value={corporateBannerForm.backgroundColor}
                      onChange={(e) => setCorporateBannerForm(prev => ({ ...prev, backgroundColor: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="corporate-banner-text-color">Text Color</Label>
                    <Input
                      id="corporate-banner-text-color"
                      type="color"
                      value={corporateBannerForm.textColor}
                      onChange={(e) => setCorporateBannerForm(prev => ({ ...prev, textColor: e.target.value }))}
                    />
                  </div>
                </div>

                <Button 
                  onClick={() => corporateBannerMutation.mutate(corporateBannerForm)}
                  disabled={corporateBannerMutation.isPending}
                  className="w-full bg-purple-600 hover:bg-purple-700"
                >
                  {corporateBannerMutation.isPending ? 'Creating...' : 'Create Corporate Banner'}
                </Button>
              </CardContent>
            )}
          </Card>

          {/* Manage Corporate Gifts */}
          <Card>
            <CardHeader 
              className="cursor-pointer"
              onClick={() => toggleSection('manage-corporate-gifts')}
            >
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center">
                  <Settings className="mr-2 text-purple-600" size={20} />
                  Manage Corporate Gifts
                </div>
                {collapsedSections['manage-corporate-gifts'] ? <ChevronDown size={20} /> : <ChevronUp size={20} />}
              </CardTitle>
            </CardHeader>
            {!collapsedSections['manage-corporate-gifts'] && (
              <CardContent>
                <div className="space-y-4">
                  {corporateGifts.map((gift: any) => (
                    <div key={gift.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <img 
                          src={gift.imageUrl} 
                          alt={gift.title}
                          className="w-16 h-16 object-cover rounded"
                        />
                        <div>
                          <h4 className="font-medium">{gift.title}</h4>
                          <p className="text-sm text-gray-600">${gift.price}</p>
                          <p className="text-xs text-gray-500">Min: {gift.minQuantity}, Max: {gift.maxQuantity}</p>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => deleteCorporateGift(gift.id)}
                        >
                          <Trash2 size={16} />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            )}
          </Card>
        </div>
      </div>
    </section>
  );
}