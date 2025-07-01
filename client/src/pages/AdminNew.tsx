import { useState } from 'react';
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
  BarChart3
} from 'lucide-react';
import { apiRequest } from '@/lib/queryClient';
import { toast } from '@/hooks/use-toast';

export default function AdminNew() {
  const [adminToken, setAdminToken] = useState(localStorage.getItem('adminToken') || '');
  const [loginToken, setLoginToken] = useState('');
  const [collapsedSections, setCollapsedSections] = useState<Record<string, boolean>>({});

  const queryClient = useQueryClient();

  // Fetch paintings data
  const { data: paintings = [] } = useQuery({
    queryKey: ['/api/paintings'],
    enabled: !!adminToken,
  });

  // Fetch corporate gifts data
  const { data: corporateGifts = [] } = useQuery({
    queryKey: ['/api/corporate-gifts'],
    enabled: !!adminToken,
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

  const handleLogin = () => {
    if (loginToken === 'admin123') {
      setAdminToken(loginToken);
      localStorage.setItem('adminToken', loginToken);
      toast({
        title: "Success",
        description: "Admin access granted",
      });
    } else {
      toast({
        title: "Error",
        description: "Invalid admin token",
        variant: "destructive",
      });
    }
  };

  const handleLogout = () => {
    setAdminToken('');
    localStorage.removeItem('adminToken');
    toast({
      title: "Success",
      description: "Logged out successfully",
    });
  };

  // Upload mutations
  const uploadMutation = useMutation({
    mutationFn: async (formData: FormData) => {
      const response = await fetch('/api/admin/paintings', {
        method: 'POST',
        body: formData,
        headers: {
          'Authorization': `Bearer ${adminToken}`
        }
      });
      if (!response.ok) throw new Error('Upload failed');
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
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to upload painting",
        variant: "destructive",
      });
    }
  });

  const uploadGiftMutation = useMutation({
    mutationFn: async (formData: FormData) => {
      const response = await fetch('/api/admin/corporate-gifts', {
        method: 'POST',
        body: formData,
        headers: {
          'Authorization': `Bearer ${adminToken}`
        }
      });
      if (!response.ok) throw new Error('Upload failed');
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
    }
  });

  const bannerMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await fetch('/api/admin/banner', {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${adminToken}`
        }
      });
      if (!response.ok) throw new Error('Banner update failed');
      return response.json();
    },
    onSuccess: () => {
      setBannerForm({
        text: '',
        backgroundColor: '#1e40af',
        textColor: '#ffffff'
      });
      toast({
        title: "Success",
        description: "Gallery banner updated successfully",
      });
    }
  });

  const corporateBannerMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await fetch('/api/admin/corporate-banner', {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${adminToken}`
        }
      });
      if (!response.ok) throw new Error('Corporate banner update failed');
      return response.json();
    },
    onSuccess: () => {
      setCorporateBannerForm({
        text: '',
        backgroundColor: '#7c3aed',
        textColor: '#ffffff'
      });
      toast({
        title: "Success",
        description: "Corporate banner updated successfully",
      });
    }
  });

  // Analytics calculations
  const paintingsArray = Array.isArray(paintings) ? paintings : [];
  const totalSales = paintingsArray
    .filter((p: any) => p.sold)
    .reduce((sum: number, p: any) => sum + (p.salePrice || p.price), 0);
  const paintingsSold = paintingsArray.filter((p: any) => p.sold).length;
  const activePaintings = paintingsArray.filter((p: any) => !p.sold).length;

  // Corporate data
  const corporateOrders = [
    { id: 'corp-001', company: 'TechFlow Solutions', amount: 2249.00, status: 'delivered', date: '2024-12-28' },
    { id: 'corp-002', company: 'Creative Agency LLC', amount: 1299.00, status: 'processing', date: '2024-12-29' },
    { id: 'corp-003', company: 'Global Enterprises', amount: 8796.00, status: 'shipped', date: '2024-12-30' }
  ];
  
  const corporateRevenue = corporateOrders.reduce((sum, order) => sum + order.amount, 0);
  const corporateOrdersCount = corporateOrders.length;
  const uniqueCompanies = new Set(corporateOrders.map(order => order.company)).size;

  const formatPrice = (price: number) => `$${price.toLocaleString('en-US', { minimumFractionDigits: 2 })}`;

  if (!adminToken) {
    return (
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Card className="max-w-md mx-auto">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-serif font-bold text-charcoal flex items-center justify-center">
              <Shield className="mr-2 text-elegant-gold" size={32} />
              Admin Access
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <Label htmlFor="admin-token">Admin Token</Label>
              <Input
                id="admin-token"
                type="password"
                placeholder="Enter admin token"
                value={loginToken}
                onChange={(e) => setLoginToken(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
              />
            </div>
            <Button onClick={handleLogin} className="w-full bg-charcoal text-white hover:bg-elegant-gold">
              <Shield className="mr-2" size={16} />
              Access Admin Panel
            </Button>
          </CardContent>
        </Card>
      </section>
    );
  }

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

        <div className="space-y-6">
          {/* Gallery Analytics */}
          <Card className={`transition-all duration-200 ${collapsedSections.galleryAnalytics ? 'h-auto' : ''}`}>
            <CardHeader>
              <CardTitle 
                className="flex items-center justify-between cursor-pointer"
                onClick={() => toggleSection('galleryAnalytics')}
              >
                <div className="flex items-center">
                  <BarChart3 className="mr-2 text-blue-600" size={20} />
                  Gallery Analytics
                </div>
                {collapsedSections.galleryAnalytics ? <ChevronDown size={20} /> : <ChevronUp size={20} />}
              </CardTitle>
            </CardHeader>
            <div className={`overflow-hidden transition-all duration-200 ${
              collapsedSections.galleryAnalytics ? 'max-h-0' : 'max-h-96'
            }`}>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-blue-600">Total Sales</p>
                        <p className="text-2xl font-bold text-blue-700">{formatPrice(totalSales)}</p>
                      </div>
                      <DollarSign className="h-8 w-8 text-blue-600" />
                    </div>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-green-600">Paintings Sold</p>
                        <p className="text-2xl font-bold text-green-700">{paintingsSold}</p>
                      </div>
                      <Package className="h-8 w-8 text-green-600" />
                    </div>
                  </div>
                  <div className="bg-purple-50 p-4 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-purple-600">Active Paintings</p>
                        <p className="text-2xl font-bold text-purple-700">{activePaintings}</p>
                      </div>
                      <Star className="h-8 w-8 text-purple-600" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </div>
          </Card>

          {/* Upload New Painting */}
          <Card className={`transition-all duration-200 ${collapsedSections.uploadPainting ? 'h-auto' : ''}`}>
            <CardHeader>
              <CardTitle 
                className="flex items-center justify-between cursor-pointer"
                onClick={() => toggleSection('uploadPainting')}
              >
                <div className="flex items-center">
                  <Upload className="mr-2 text-blue-600" size={20} />
                  Upload New Painting
                </div>
                {collapsedSections.uploadPainting ? <ChevronDown size={20} /> : <ChevronUp size={20} />}
              </CardTitle>
            </CardHeader>
            <div className={`overflow-hidden transition-all duration-200 ${
              collapsedSections.uploadPainting ? 'max-h-0' : 'max-h-[800px]'
            }`}>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="title">Title</Label>
                      <Input
                        id="title"
                        value={uploadForm.title}
                        onChange={(e) => setUploadForm(prev => ({ ...prev, title: e.target.value }))}
                        placeholder="Enter painting title"
                      />
                    </div>
                    <div>
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        value={uploadForm.description}
                        onChange={(e) => setUploadForm(prev => ({ ...prev, description: e.target.value }))}
                        placeholder="Enter painting description"
                        rows={3}
                      />
                    </div>
                    <div>
                      <Label htmlFor="price">Price ($)</Label>
                      <Input
                        id="price"
                        type="number"
                        value={uploadForm.price}
                        onChange={(e) => setUploadForm(prev => ({ ...prev, price: e.target.value }))}
                        placeholder="Enter price"
                      />
                    </div>
                    <div>
                      <Label htmlFor="image-url">Image URL</Label>
                      <Input
                        id="image-url"
                        value={uploadForm.imageUrl}
                        onChange={(e) => setUploadForm(prev => ({ ...prev, imageUrl: e.target.value }))}
                        placeholder="Enter image URL"
                      />
                    </div>
                    <div>
                      <Label htmlFor="image-file">Or Upload Image File</Label>
                      <Input
                        id="image-file"
                        type="file"
                        accept="image/*"
                        onChange={(e) => setUploadForm(prev => ({ ...prev, imageFile: e.target.files?.[0] || null }))}
                      />
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="artist">Artist</Label>
                      <Input
                        id="artist"
                        value={uploadForm.artist}
                        onChange={(e) => setUploadForm(prev => ({ ...prev, artist: e.target.value }))}
                        placeholder="Enter artist name"
                      />
                    </div>
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
                        placeholder="e.g., 24 x 36 inches"
                      />
                    </div>
                    <div>
                      <Label htmlFor="year">Year</Label>
                      <Input
                        id="year"
                        type="number"
                        value={uploadForm.year}
                        onChange={(e) => setUploadForm(prev => ({ ...prev, year: e.target.value }))}
                        placeholder="Enter year created"
                      />
                    </div>
                  </div>
                </div>
                <div className="mt-6">
                  <Button 
                    onClick={() => {
                      const formData = new FormData();
                      Object.entries(uploadForm).forEach(([key, value]) => {
                        if (value && key !== 'imageFile' && key !== 'availableSizes' && key !== 'availableFrames') {
                          formData.append(key, value.toString());
                        }
                      });
                      
                      if (uploadForm.imageFile) {
                        formData.append('imageFile', uploadForm.imageFile);
                      }
                      
                      formData.append('availableSizes', JSON.stringify(uploadForm.availableSizes));
                      formData.append('availableFrames', JSON.stringify(uploadForm.availableFrames));
                      
                      uploadMutation.mutate(formData);
                    }}
                    disabled={uploadMutation.isPending}
                    className="w-full bg-blue-600 hover:bg-blue-700"
                  >
                    <Upload className="mr-2" size={16} />
                    {uploadMutation.isPending ? 'Uploading...' : 'Upload Painting'}
                  </Button>
                </div>
              </CardContent>
            </div>
          </Card>

          {/* Gallery Banner Management */}
          <Card className={`transition-all duration-200 ${collapsedSections.galleryBanner ? 'h-auto' : ''}`}>
            <CardHeader>
              <CardTitle 
                className="flex items-center justify-between cursor-pointer"
                onClick={() => toggleSection('galleryBanner')}
              >
                <div className="flex items-center">
                  <Megaphone className="mr-2 text-blue-600" size={20} />
                  Gallery Banner Management
                </div>
                {collapsedSections.galleryBanner ? <ChevronDown size={20} /> : <ChevronUp size={20} />}
              </CardTitle>
            </CardHeader>
            <div className={`overflow-hidden transition-all duration-200 ${
              collapsedSections.galleryBanner ? 'max-h-0' : 'max-h-96'
            }`}>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="banner-text">Banner Text</Label>
                    <Input
                      id="banner-text"
                      value={bannerForm.text}
                      onChange={(e) => setBannerForm(prev => ({ ...prev, text: e.target.value }))}
                      placeholder="Enter banner text"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="bg-color">Background Color</Label>
                      <Input
                        id="bg-color"
                        type="color"
                        value={bannerForm.backgroundColor}
                        onChange={(e) => setBannerForm(prev => ({ ...prev, backgroundColor: e.target.value }))}
                      />
                    </div>
                    <div>
                      <Label htmlFor="text-color">Text Color</Label>
                      <Input
                        id="text-color"
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
                    {bannerMutation.isPending ? 'Updating...' : 'Update Gallery Banner'}
                  </Button>
                </div>
              </CardContent>
            </div>
          </Card>
        </div>
      </div>

      {/* Corporate Gifting Section */}
      <div className="mb-12">
        <div className="flex items-center mb-6 pb-4 border-b-2 border-purple-200">
          <Building2 className="mr-3 text-purple-600" size={28} />
          <h3 className="text-2xl font-semibold text-charcoal">Corporate Gifting Management</h3>
        </div>

        <div className="space-y-6">
          {/* Corporate Analytics */}
          <Card className={`transition-all duration-200 ${collapsedSections.corporateAnalytics ? 'h-auto' : ''}`}>
            <CardHeader>
              <CardTitle 
                className="flex items-center justify-between cursor-pointer"
                onClick={() => toggleSection('corporateAnalytics')}
              >
                <div className="flex items-center">
                  <TrendingUp className="mr-2 text-purple-600" size={20} />
                  Corporate Analytics
                </div>
                {collapsedSections.corporateAnalytics ? <ChevronDown size={20} /> : <ChevronUp size={20} />}
              </CardTitle>
            </CardHeader>
            <div className={`overflow-hidden transition-all duration-200 ${
              collapsedSections.corporateAnalytics ? 'max-h-0' : 'max-h-96'
            }`}>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-purple-50 p-4 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-purple-600">Corporate Revenue</p>
                        <p className="text-2xl font-bold text-purple-700">{formatPrice(corporateRevenue)}</p>
                      </div>
                      <DollarSign className="h-8 w-8 text-purple-600" />
                    </div>
                  </div>
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-blue-600">Total Orders</p>
                        <p className="text-2xl font-bold text-blue-700">{corporateOrdersCount}</p>
                      </div>
                      <Package className="h-8 w-8 text-blue-600" />
                    </div>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-green-600">Active Clients</p>
                        <p className="text-2xl font-bold text-green-700">{uniqueCompanies}</p>
                      </div>
                      <Users className="h-8 w-8 text-green-600" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </div>
          </Card>

          {/* Upload Corporate Gift */}
          <Card className={`transition-all duration-200 ${collapsedSections.uploadGift ? 'h-auto' : ''}`}>
            <CardHeader>
              <CardTitle 
                className="flex items-center justify-between cursor-pointer"
                onClick={() => toggleSection('uploadGift')}
              >
                <div className="flex items-center">
                  <Upload className="mr-2 text-purple-600" size={20} />
                  Upload Corporate Gift
                </div>
                {collapsedSections.uploadGift ? <ChevronDown size={20} /> : <ChevronUp size={20} />}
              </CardTitle>
            </CardHeader>
            <div className={`overflow-hidden transition-all duration-200 ${
              collapsedSections.uploadGift ? 'max-h-0' : 'max-h-[600px]'
            }`}>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="gift-title">Title</Label>
                      <Input
                        id="gift-title"
                        value={giftForm.title}
                        onChange={(e) => setGiftForm(prev => ({ ...prev, title: e.target.value }))}
                        placeholder="Enter gift title"
                      />
                    </div>
                    <div>
                      <Label htmlFor="gift-description">Description</Label>
                      <Textarea
                        id="gift-description"
                        value={giftForm.description}
                        onChange={(e) => setGiftForm(prev => ({ ...prev, description: e.target.value }))}
                        placeholder="Enter gift description"
                        rows={3}
                      />
                    </div>
                    <div>
                      <Label htmlFor="gift-price">Price ($)</Label>
                      <Input
                        id="gift-price"
                        type="number"
                        value={giftForm.price}
                        onChange={(e) => setGiftForm(prev => ({ ...prev, price: e.target.value }))}
                        placeholder="Enter price"
                      />
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="gift-category">Category</Label>
                      <Input
                        id="gift-category"
                        value={giftForm.category}
                        onChange={(e) => setGiftForm(prev => ({ ...prev, category: e.target.value }))}
                        placeholder="e.g., Drinkware, Apparel"
                      />
                    </div>
                    <div>
                      <Label htmlFor="gift-image-url">Image URL</Label>
                      <Input
                        id="gift-image-url"
                        value={giftForm.imageUrl}
                        onChange={(e) => setGiftForm(prev => ({ ...prev, imageUrl: e.target.value }))}
                        placeholder="Enter image URL"
                      />
                    </div>
                    <div>
                      <Label htmlFor="gift-image-file">Or Upload Image File</Label>
                      <Input
                        id="gift-image-file"
                        type="file"
                        accept="image/*"
                        onChange={(e) => setGiftForm(prev => ({ ...prev, imageFile: e.target.files?.[0] || null }))}
                      />
                    </div>
                  </div>
                </div>
                <div className="mt-6">
                  <Button 
                    onClick={() => {
                      const formData = new FormData();
                      Object.entries(giftForm).forEach(([key, value]) => {
                        if (value && key !== 'imageFile') {
                          formData.append(key, value.toString());
                        }
                      });
                      
                      if (giftForm.imageFile) {
                        formData.append('imageFile', giftForm.imageFile);
                      }
                      
                      uploadGiftMutation.mutate(formData);
                    }}
                    disabled={uploadGiftMutation.isPending}
                    className="w-full bg-purple-600 hover:bg-purple-700"
                  >
                    <Upload className="mr-2" size={16} />
                    {uploadGiftMutation.isPending ? 'Uploading...' : 'Upload Corporate Gift'}
                  </Button>
                </div>
              </CardContent>
            </div>
          </Card>

          {/* Corporate Banner Management */}
          <Card className={`transition-all duration-200 ${collapsedSections.corporateBanner ? 'h-auto' : ''}`}>
            <CardHeader>
              <CardTitle 
                className="flex items-center justify-between cursor-pointer"
                onClick={() => toggleSection('corporateBanner')}
              >
                <div className="flex items-center">
                  <Megaphone className="mr-2 text-purple-600" size={20} />
                  Corporate Banner Management
                </div>
                {collapsedSections.corporateBanner ? <ChevronDown size={20} /> : <ChevronUp size={20} />}
              </CardTitle>
            </CardHeader>
            <div className={`overflow-hidden transition-all duration-200 ${
              collapsedSections.corporateBanner ? 'max-h-0' : 'max-h-96'
            }`}>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="corp-banner-text">Banner Text</Label>
                    <Input
                      id="corp-banner-text"
                      value={corporateBannerForm.text}
                      onChange={(e) => setCorporateBannerForm(prev => ({ ...prev, text: e.target.value }))}
                      placeholder="Enter corporate banner text"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="corp-bg-color">Background Color</Label>
                      <Input
                        id="corp-bg-color"
                        type="color"
                        value={corporateBannerForm.backgroundColor}
                        onChange={(e) => setCorporateBannerForm(prev => ({ ...prev, backgroundColor: e.target.value }))}
                      />
                    </div>
                    <div>
                      <Label htmlFor="corp-text-color">Text Color</Label>
                      <Input
                        id="corp-text-color"
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
                    {corporateBannerMutation.isPending ? 'Updating...' : 'Update Corporate Banner'}
                  </Button>
                </div>
              </CardContent>
            </div>
          </Card>

          {/* Recent Corporate Orders */}
          <Card className={`transition-all duration-200 ${collapsedSections.corporateOrders ? 'h-auto' : ''}`}>
            <CardHeader>
              <CardTitle 
                className="flex items-center justify-between cursor-pointer"
                onClick={() => toggleSection('corporateOrders')}
              >
                <div className="flex items-center">
                  <Package className="mr-2 text-purple-600" size={20} />
                  Recent Corporate Orders
                </div>
                {collapsedSections.corporateOrders ? <ChevronDown size={20} /> : <ChevronUp size={20} />}
              </CardTitle>
            </CardHeader>
            <div className={`overflow-hidden transition-all duration-200 ${
              collapsedSections.corporateOrders ? 'max-h-0' : 'max-h-96'
            }`}>
              <CardContent>
                <div className="space-y-4">
                  {corporateOrders.map((order) => (
                    <div key={order.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <h4 className="font-semibold text-charcoal">{order.company}</h4>
                          <p className="text-sm text-muted-foreground">Order #{order.id}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-green-600">{formatPrice(order.amount)}</p>
                          <Badge className={
                            order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                            order.status === 'shipped' ? 'bg-blue-100 text-blue-800' :
                            'bg-yellow-100 text-yellow-800'
                          }>
                            {order.status}
                          </Badge>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Order Date: {new Date(order.date).toLocaleDateString()}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
}