import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Shield, Plus, Edit, Package, DollarSign, Truck, LogOut, Building2, Gift, Megaphone, ChevronDown, ChevronUp, TrendingUp, Users, Target, Award } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import { apiRequest } from '@/lib/queryClient';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { formatPrice } from '@/lib/utils';
import type { Painting } from '@shared/schema';

const ADMIN_TOKEN = 'secure-admin-token';

export default function Admin() {
  const { adminToken, setAdminToken, showToast } = useApp();
  const [loginToken, setLoginToken] = useState('');
  const [uploadForm, setUploadForm] = useState({
    title: '',
    description: '',
    price: '',
    salePrice: '',
    imageUrl: '',
    imageFile: null as File | null,
    medium: '',
    dimensions: '',
    year: '',
    artist: '',
    artistBio: '',
    artistPhotoUrl: '',
    artistPhotoFile: null as File | null,
    artistBornYear: '',
    artistAwards: '',
    availableSizes: [] as string[],
    availableFrames: [] as string[],
  });

  const [sizeOptions] = useState([
    "12\" x 16\"", "16\" x 20\"", "20\" x 24\"", "24\" x 30\"", 
    "30\" x 40\"", "36\" x 48\"", "40\" x 60\""
  ]);

  const [frameOptions] = useState([
    "Frameless Stretch", "Black Wood Frame", "White Wood Frame", 
    "Natural Wood Frame", "Black Metal Frame", "Silver Frame", 
    "Gold Ornate Frame", "Gallery Float Frame", "Custom Gallery Frame"
  ]);

  const [bannerForm, setBannerForm] = useState({
    text: '',
    backgroundColor: '#dc2626',
    textColor: '#ffffff'
  });

  const [corporateBannerForm, setCorporateBannerForm] = useState({
    text: '',
    backgroundColor: '#1e40af',
    textColor: '#ffffff'
  });

  const [giftForm, setGiftForm] = useState({
    title: '',
    description: '',
    price: '',
    salePrice: '',
    imageUrl: '',
    category: '',
    material: '',
    minQuantity: '1',
    maxQuantity: '500',
  });

  const [collapsedSections, setCollapsedSections] = useState({
    galleryBanner: false,
    corporateBanner: false,
    corporateGift: false,
    painting: false,
    paintingManagement: false,
    corporateManagement: false,
    analytics: false,
    corporateSales: false,
  });

  const [activeTab, setActiveTab] = useState<'gallery' | 'corporate'>('gallery');
  const queryClient = useQueryClient();

  const { data: paintings = [] } = useQuery<Painting[]>({
    queryKey: ['/api/paintings'],
    enabled: !!adminToken,
  });

  const { data: corporateGifts = [] } = useQuery<any[]>({
    queryKey: ['/api/corporate-gifts'],
    enabled: !!adminToken,
  });

  const uploadPaintingMutation = useMutation({
    mutationFn: async (formData: FormData) => {
      return apiRequest('/api/admin/paintings', 'POST', formData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/paintings'] });
      queryClient.refetchQueries({ queryKey: ['/api/paintings'] });
      showToast('Painting uploaded successfully!');
      setUploadForm({
        title: '',
        description: '',
        price: '',
        salePrice: '',
        imageUrl: '',
        imageFile: null,
        medium: '',
        dimensions: '',
        year: '',
        artist: '',
        artistBio: '',
        artistPhotoUrl: '',
        artistPhotoFile: null,
        artistBornYear: '',
        artistAwards: '',
        availableSizes: [],
        availableFrames: [],
      });
    },
    onError: () => {
      showToast('Failed to upload painting', 'error');
    },
  });

  const updateBannerMutation = useMutation({
    mutationFn: async (bannerData: any) => {
      return apiRequest('/api/admin/banner', 'POST', bannerData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/banner/active'] });
      showToast('Banner updated successfully!');
      setBannerForm({
        text: '',
        backgroundColor: '#dc2626',
        textColor: '#ffffff'
      });
    },
    onError: () => {
      showToast('Failed to update banner', 'error');
    },
  });

  const updateCorporateBannerMutation = useMutation({
    mutationFn: async (bannerData: any) => {
      return apiRequest('/api/admin/corporate-banner', 'POST', bannerData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/corporate-banner/active'] });
      showToast('Corporate banner updated successfully!');
      setCorporateBannerForm({
        text: '',
        backgroundColor: '#1e40af',
        textColor: '#ffffff'
      });
    },
    onError: () => {
      showToast('Failed to update corporate banner', 'error');
    },
  });

  const uploadGiftMutation = useMutation({
    mutationFn: async (formData: FormData) => {
      return apiRequest('/api/admin/corporate-gifts', 'POST', formData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/corporate-gifts'] });
      showToast('Corporate gift added successfully!');
      setGiftForm({
        title: '',
        description: '',
        price: '',
        salePrice: '',
        imageUrl: '',
        category: '',
        material: '',
        minQuantity: '1',
        maxQuantity: '500',
      });
    },
    onError: () => {
      showToast('Failed to add corporate gift', 'error');
    },
  });

  const markAsSoldMutation = useMutation({
    mutationFn: async (paintingId: string) => {
      return apiRequest('PUT', `/api/admin/paintings/${paintingId}/sold`, {});
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/paintings'] });
      showToast('Painting marked as sold!');
    },
    onError: () => {
      showToast('Failed to mark painting as sold', 'error');
    },
  });

  const handleLogin = () => {
    if (loginToken === ADMIN_TOKEN) {
      setAdminToken(loginToken);
      localStorage.setItem('adminToken', loginToken);
      showToast('Admin access granted!');
    } else {
      showToast('Invalid admin token!', 'error');
    }
  };

  const handleLogout = () => {
    setAdminToken(null);
    localStorage.removeItem('adminToken');
    showToast('Logged out successfully!');
  };

  const handleUpload = () => {
    if (!uploadForm.title || !uploadForm.description || !uploadForm.price) {
      showToast('Please fill in all required fields', 'error');
      return;
    }

    if (!uploadForm.imageUrl && !uploadForm.imageFile) {
      showToast('Please provide either an image URL or upload an image file', 'error');
      return;
    }

    const formData = new FormData();
    
    // Add all form fields except files
    Object.entries(uploadForm).forEach(([key, value]) => {
      if (value && key !== 'imageFile' && key !== 'artistPhotoFile') {
        if (Array.isArray(value)) {
          formData.append(key, JSON.stringify(value));
        } else {
          formData.append(key, value.toString());
        }
      }
    });

    // Add image file if provided
    if (uploadForm.imageFile) {
      formData.append('imageFile', uploadForm.imageFile);
    }

    uploadPaintingMutation.mutate(formData);
  };

  const handleGiftUpload = () => {
    if (!giftForm.title || !giftForm.description || !giftForm.price) {
      showToast('Please fill in all required fields', 'error');
      return;
    }

    const formData = new FormData();
    Object.entries(giftForm).forEach(([key, value]) => {
      if (value) {
        formData.append(key, value);
      }
    });

    uploadGiftMutation.mutate(formData);
  };

  const handleInputChange = (field: string, value: string) => {
    setUploadForm(prev => ({ ...prev, [field]: value }));
  };

  const toggleSizeOption = (size: string) => {
    setUploadForm(prev => ({
      ...prev,
      availableSizes: prev.availableSizes.includes(size)
        ? prev.availableSizes.filter(s => s !== size)
        : [...prev.availableSizes, size]
    }));
  };

  const toggleFrameOption = (frame: string) => {
    setUploadForm(prev => ({
      ...prev,
      availableFrames: prev.availableFrames.includes(frame)
        ? prev.availableFrames.filter(f => f !== frame)
        : [...prev.availableFrames, frame]
    }));
  };

  const markAsSold = (paintingId: string) => {
    markAsSoldMutation.mutate(paintingId);
  };

  const toggleSection = (section: keyof typeof collapsedSections) => {
    setCollapsedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  // Analytics
  const totalSales = paintings
    .filter(p => p.sold)
    .reduce((sum, p) => sum + (p.salePrice || p.price), 0);
  const paintingsSold = paintings.filter(p => p.sold).length;
  const activePaintings = paintings.filter(p => !p.sold).length;

  // Corporate Sales Data (sample)
  const corporateOrders = [
    { id: 'corp-001', company: 'TechFlow Solutions', amount: 2249.00, status: 'delivered', date: '2024-12-28' },
    { id: 'corp-002', company: 'Creative Agency LLC', amount: 1299.00, status: 'processing', date: '2024-12-29' },
    { id: 'corp-003', company: 'Global Enterprises', amount: 8796.00, status: 'shipped', date: '2024-12-30' }
  ];
  
  const corporateRevenue = corporateOrders.reduce((sum, order) => sum + order.amount, 0);
  const corporateOrdersCount = corporateOrders.length;
  const uniqueCompanies = new Set(corporateOrders.map(order => order.company)).size;

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
          {/* Tab Navigation */}
          <div className="flex space-x-4 mt-4">
            <Button
              variant={activeTab === 'gallery' ? 'default' : 'outline'}
              onClick={() => setActiveTab('gallery')}
              className="flex items-center"
            >
              <Package className="mr-2" size={16} />
              Gallery Management
            </Button>
            <Button
              variant={activeTab === 'corporate' ? 'default' : 'outline'}
              onClick={() => setActiveTab('corporate')}
              className="flex items-center"
            >
              <Building2 className="mr-2" size={16} />
              Corporate Sales
            </Button>
          </div>
        </div>
        <Button onClick={handleLogout} variant="outline">
          <LogOut className="mr-2" size={16} />
          Logout
        </Button>
      </div>

      {/* Gallery Management Tab */}
      {activeTab === 'gallery' && (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Gallery Banner Management */}
        <Card>
          <CardHeader>
            <CardTitle 
              className="flex items-center justify-between cursor-pointer"
              onClick={() => toggleSection('galleryBanner')}
            >
              <div className="flex items-center">
                <Package className="mr-2" size={20} />
                Gallery Promotional Banner
              </div>
              {collapsedSections.galleryBanner ? <ChevronDown size={20} /> : <ChevronUp size={20} />}
            </CardTitle>
          </CardHeader>
          {!collapsedSections.galleryBanner && (
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="banner-text">Banner Text</Label>
                <Textarea
                  id="banner-text"
                  placeholder="Enter promotional message (e.g., July 4th Special: 25% OFF All Paintings!)"
                  value={bannerForm.text}
                  onChange={(e) => setBannerForm({ ...bannerForm, text: e.target.value })}
                  className="min-h-[80px]"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="bg-color">Background Color</Label>
                  <Input
                    id="bg-color"
                    type="color"
                    value={bannerForm.backgroundColor}
                    onChange={(e) => setBannerForm({ ...bannerForm, backgroundColor: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="text-color">Text Color</Label>
                  <Input
                    id="text-color"
                    type="color"
                    value={bannerForm.textColor}
                    onChange={(e) => setBannerForm({ ...bannerForm, textColor: e.target.value })}
                  />
                </div>
              </div>
              <Button
                onClick={() => updateBannerMutation.mutate(bannerForm)}
                disabled={updateBannerMutation.isPending || !bannerForm.text.trim()}
                className="w-full bg-elegant-gold text-rich-brown hover:bg-rich-brown hover:text-white"
              >
                {updateBannerMutation.isPending ? 'Updating...' : 'Update Gallery Banner'}
              </Button>
            </CardContent>
          )}
        </Card>

        {/* Corporate Banner Management */}
        <Card>
          <CardHeader>
            <CardTitle 
              className="flex items-center justify-between cursor-pointer"
              onClick={() => toggleSection('corporateBanner')}
            >
              <div className="flex items-center">
                <Megaphone className="mr-2" size={20} />
                Corporate Banner
              </div>
              {collapsedSections.corporateBanner ? <ChevronDown size={20} /> : <ChevronUp size={20} />}
            </CardTitle>
          </CardHeader>
          {!collapsedSections.corporateBanner && (
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="corporate-banner-text">Corporate Banner Text</Label>
                <Textarea
                  id="corporate-banner-text"
                  placeholder="Enter corporate promotional message (e.g., End of Year Corporate Gifts: 20% Bulk Discount!)"
                  value={corporateBannerForm.text}
                  onChange={(e) => setCorporateBannerForm({ ...corporateBannerForm, text: e.target.value })}
                  className="min-h-[80px]"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="corp-bg-color">Background Color</Label>
                  <Input
                    id="corp-bg-color"
                    type="color"
                    value={corporateBannerForm.backgroundColor}
                    onChange={(e) => setCorporateBannerForm({ ...corporateBannerForm, backgroundColor: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="corp-text-color">Text Color</Label>
                  <Input
                    id="corp-text-color"
                    type="color"
                    value={corporateBannerForm.textColor}
                    onChange={(e) => setCorporateBannerForm({ ...corporateBannerForm, textColor: e.target.value })}
                  />
                </div>
              </div>
              <Button
                onClick={() => updateCorporateBannerMutation.mutate(corporateBannerForm)}
                disabled={updateCorporateBannerMutation.isPending || !corporateBannerForm.text.trim()}
                className="w-full bg-blue-600 text-white hover:bg-blue-700"
              >
                {updateCorporateBannerMutation.isPending ? 'Updating...' : 'Update Corporate Banner'}
              </Button>
            </CardContent>
          )}
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Upload New Corporate Gift */}
        <Card>
          <CardHeader>
            <CardTitle 
              className="flex items-center justify-between cursor-pointer"
              onClick={() => toggleSection('corporateGift')}
            >
              <div className="flex items-center">
                <Gift className="mr-2" size={20} />
                Add New Corporate Gift
              </div>
              {collapsedSections.corporateGift ? <ChevronDown size={20} /> : <ChevronUp size={20} />}
            </CardTitle>
          </CardHeader>
          {!collapsedSections.corporateGift && (
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="gift-title">Title *</Label>
                  <Input
                    id="gift-title"
                    placeholder="Corporate gift name"
                    value={giftForm.title}
                    onChange={(e) => setGiftForm({ ...giftForm, title: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="gift-category">Category</Label>
                  <Input
                    id="gift-category"
                    placeholder="Drinkware, Apparel, Office"
                    value={giftForm.category}
                    onChange={(e) => setGiftForm({ ...giftForm, category: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="gift-description">Description *</Label>
                <Textarea
                  id="gift-description"
                  placeholder="Describe the corporate gift item"
                  value={giftForm.description}
                  onChange={(e) => setGiftForm({ ...giftForm, description: e.target.value })}
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="gift-price">Price ($) *</Label>
                  <Input
                    id="gift-price"
                    type="number"
                    placeholder="0.00"
                    value={giftForm.price}
                    onChange={(e) => setGiftForm({ ...giftForm, price: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="gift-salePrice">Bulk Price ($)</Label>
                  <Input
                    id="gift-salePrice"
                    type="number"
                    placeholder="0.00 (bulk discount)"
                    value={giftForm.salePrice}
                    onChange={(e) => setGiftForm({ ...giftForm, salePrice: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="gift-imageUrl">Image URL</Label>
                <Input
                  id="gift-imageUrl"
                  placeholder="https://example.com/corporate-gift.jpg"
                  value={giftForm.imageUrl}
                  onChange={(e) => setGiftForm({ ...giftForm, imageUrl: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="gift-material">Material</Label>
                  <Input
                    id="gift-material"
                    placeholder="Ceramic, Cotton, Metal"
                    value={giftForm.material}
                    onChange={(e) => setGiftForm({ ...giftForm, material: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="gift-minQuantity">Min Quantity</Label>
                  <Input
                    id="gift-minQuantity"
                    type="number"
                    placeholder="1"
                    value={giftForm.minQuantity}
                    onChange={(e) => setGiftForm({ ...giftForm, minQuantity: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="gift-maxQuantity">Max Quantity</Label>
                  <Input
                    id="gift-maxQuantity"
                    type="number"
                    placeholder="500"
                    value={giftForm.maxQuantity}
                    onChange={(e) => setGiftForm({ ...giftForm, maxQuantity: e.target.value })}
                  />
                </div>
              </div>

              <Button
                onClick={handleGiftUpload}
                disabled={uploadGiftMutation.isPending}
                className="w-full bg-blue-600 text-white hover:bg-blue-700"
              >
                <Gift className="mr-2" size={16} />
                Add Corporate Gift
              </Button>
            </CardContent>
          )}
        </Card>

        {/* Upload New Painting */}
        <Card>
          <CardHeader>
            <CardTitle 
              className="flex items-center justify-between cursor-pointer"
              onClick={() => toggleSection('painting')}
            >
              <div className="flex items-center">
                <Plus className="mr-2" size={20} />
                Upload New Painting
              </div>
              {collapsedSections.painting ? <ChevronDown size={20} /> : <ChevronUp size={20} />}
            </CardTitle>
          </CardHeader>
          {!collapsedSections.painting && (
            <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  placeholder="Painting title"
                  value={uploadForm.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="artist">Artist Name *</Label>
                <Input
                  id="artist"
                  placeholder="Artist name"
                  value={uploadForm.artist}
                  onChange={(e) => handleInputChange('artist', e.target.value)}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                placeholder="Describe the painting"
                value={uploadForm.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                rows={3}
              />
            </div>

            {/* Artist Information Section */}
            <div className="border-t pt-4">
              <Label className="text-base font-medium mb-3 block">Artist Information</Label>
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor="artistBio">Artist Biography</Label>
                  <Textarea
                    id="artistBio"
                    placeholder="Tell us about the artist's background, style, and career"
                    value={uploadForm.artistBio}
                    onChange={(e) => handleInputChange('artistBio', e.target.value)}
                    rows={4}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="artistPhotoUrl">Artist Photo URL</Label>
                    <Input
                      id="artistPhotoUrl"
                      placeholder="https://example.com/artist-photo.jpg"
                      value={uploadForm.artistPhotoUrl}
                      onChange={(e) => handleInputChange('artistPhotoUrl', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="artistBornYear">Born Year</Label>
                    <Input
                      id="artistBornYear"
                      type="number"
                      placeholder="1975"
                      value={uploadForm.artistBornYear}
                      onChange={(e) => handleInputChange('artistBornYear', e.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="artistRecognitions">Awards & Recognitions</Label>
                  <Textarea
                    id="artistAwards"
                    placeholder="List major awards, exhibitions, or recognitions (e.g., 'Winner of the 2023 National Art Award, Featured in Metropolitan Museum')"
                    value={uploadForm.artistAwards}
                    onChange={(e) => handleInputChange('artistAwards', e.target.value)}
                    rows={3}
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="price">Price ($) *</Label>
                <Input
                  id="price"
                  type="number"
                  placeholder="0.00"
                  value={uploadForm.price}
                  onChange={(e) => handleInputChange('price', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="salePrice">Sale Price ($)</Label>
                <Input
                  id="salePrice"
                  type="number"
                  placeholder="0.00 (optional)"
                  value={uploadForm.salePrice}
                  onChange={(e) => handleInputChange('salePrice', e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="imageUrl">Image URL (or upload file below)</Label>
                <Input
                  id="imageUrl"
                  placeholder="https://example.com/image.jpg"
                  value={uploadForm.imageUrl}
                  onChange={(e) => handleInputChange('imageUrl', e.target.value)}
                />
              </div>
              
              <div>
                <Label htmlFor="imageFile">Or Upload Image File</Label>
                <Input
                  id="imageFile"
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0] || null;
                    setUploadForm(prev => ({ ...prev, imageFile: file }));
                    if (file) {
                      // Clear URL if file is selected
                      setUploadForm(prev => ({ ...prev, imageUrl: '' }));
                    }
                  }}
                  className="file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
                {uploadForm.imageFile && (
                  <p className="text-sm text-green-600 mt-1">
                    Selected: {uploadForm.imageFile.name}
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label htmlFor="medium">Medium</Label>
                <Input
                  id="medium"
                  placeholder="Oil on Canvas"
                  value={uploadForm.medium}
                  onChange={(e) => handleInputChange('medium', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="dimensions">Dimensions</Label>
                <Input
                  id="dimensions"
                  placeholder='24" × 36"'
                  value={uploadForm.dimensions}
                  onChange={(e) => handleInputChange('dimensions', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="year">Year</Label>
                <Input
                  id="year"
                  type="number"
                  placeholder="2024"
                  value={uploadForm.year}
                  onChange={(e) => handleInputChange('year', e.target.value)}
                />
              </div>
            </div>

            {/* Available Sizes */}
            <div>
              <Label className="text-base font-medium mb-3 block">Available Sizes</Label>
              <div className="grid grid-cols-2 gap-3">
                {sizeOptions.map((size) => (
                  <div key={size} className="flex items-center space-x-2">
                    <Checkbox
                      id={`size-${size}`}
                      checked={uploadForm.availableSizes.includes(size)}
                      onCheckedChange={() => toggleSizeOption(size)}
                    />
                    <Label htmlFor={`size-${size}`} className="text-sm">
                      {size}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            {/* Available Frames */}
            <div>
              <Label className="text-base font-medium mb-3 block">Available Frame Options</Label>
              <div className="grid grid-cols-2 gap-3">
                {frameOptions.map((frame) => (
                  <div key={frame} className="flex items-center space-x-2">
                    <Checkbox
                      id={`frame-${frame}`}
                      checked={uploadForm.availableFrames.includes(frame)}
                      onCheckedChange={() => toggleFrameOption(frame)}
                    />
                    <Label htmlFor={`frame-${frame}`} className="text-sm">
                      {frame}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            <Button
              onClick={handleUpload}
              disabled={uploadPaintingMutation.isPending}
              className="w-full bg-elegant-gold text-white hover:bg-yellow-600"
            >
              <Plus className="mr-2" size={16} />
              Upload Painting
            </Button>
            </CardContent>
          )}
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Manage Paintings */}
        <Card>
          <CardHeader>
            <CardTitle 
              className="flex items-center justify-between cursor-pointer"
              onClick={() => toggleSection('paintingManagement')}
            >
              <div className="flex items-center">
                <Edit className="mr-2" size={20} />
                Manage Paintings ({paintings.length})
              </div>
              {collapsedSections.paintingManagement ? <ChevronDown size={20} /> : <ChevronUp size={20} />}
            </CardTitle>
          </CardHeader>
          {!collapsedSections.paintingManagement && (
            <CardContent>
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {paintings.map((painting) => (
                <div
                  key={painting.id}
                  className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center space-x-4">
                    <img
                      src={painting.imageUrl}
                      alt={painting.title}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <h4 className="font-semibold">{painting.title}</h4>
                      <p className="text-sm text-muted-foreground">
                        {formatPrice(painting.salePrice || painting.price)}
                      </p>
                      <div className="flex items-center space-x-2 mt-1">
                        <Badge variant={painting.sold ? "destructive" : "default"}>
                          {painting.sold ? "Sold" : "Active"}
                        </Badge>
                      </div>
                    </div>
                    <div className="flex flex-col space-y-2">
                      {!painting.sold && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => markAsSold(painting.id)}
                          disabled={markAsSoldMutation.isPending}
                          className="text-xs"
                        >
                          Mark Sold
                        </Button>
                      )}
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => showToast('Edit functionality coming soon!')}
                        className="text-xs"
                      >
                        Edit
                      </Button>
                    </div>
                  </div>
                </div>
              ))}

              {paintings.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  No paintings uploaded yet
                </div>
              )}
            </div>
          </CardContent>
          )}
        </Card>

        {/* Manage Corporate Gifts */}
        <Card>
          <CardHeader>
            <CardTitle 
              className="flex items-center justify-between cursor-pointer"
              onClick={() => toggleSection('corporateManagement')}
            >
              <div className="flex items-center">
                <Building2 className="mr-2" size={20} />
                Manage Corporate Gifts ({corporateGifts.length})
              </div>
              {collapsedSections.corporateManagement ? <ChevronDown size={20} /> : <ChevronUp size={20} />}
            </CardTitle>
          </CardHeader>
          {!collapsedSections.corporateManagement && (
            <CardContent>
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {(corporateGifts as any[]).map((gift: any) => (
                <div
                  key={gift.id}
                  className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center space-x-4">
                    <img
                      src={gift.imageUrl}
                      alt={gift.title}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <h4 className="font-semibold">{gift.title}</h4>
                      <p className="text-sm text-muted-foreground">
                        {formatPrice(gift.salePrice || gift.price)} • {gift.category}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Qty: {gift.minQuantity}-{gift.maxQuantity}
                      </p>
                      <div className="flex items-center space-x-2 mt-1">
                        <Badge variant="default">Active</Badge>
                      </div>
                    </div>
                    <div className="flex flex-col space-y-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => showToast('Corporate gift management coming soon!')}
                        className="text-xs"
                      >
                        Edit
                      </Button>
                    </div>
                  </div>
                </div>
              ))}

              {(corporateGifts as any[]).length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  No corporate gifts added yet
                </div>
              )}
            </div>
          </CardContent>
          )}
        </Card>
      </div>

      {/* Sales Analytics */}
      <Card>
        <CardHeader>
          <CardTitle 
            className="flex items-center justify-between cursor-pointer"
            onClick={() => toggleSection('analytics')}
          >
            <div className="flex items-center">
              <DollarSign className="mr-2" size={20} />
              Sales Overview
            </div>
            {collapsedSections.analytics ? <ChevronDown size={20} /> : <ChevronUp size={20} />}
          </CardTitle>
        </CardHeader>
        {!collapsedSections.analytics && (
          <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center p-6 bg-yellow-50 rounded-xl">
              <div className="text-3xl font-bold text-elegant-gold">
                {formatPrice(totalSales)}
              </div>
              <div className="text-muted-foreground">Total Sales</div>
            </div>
            <div className="text-center p-6 bg-green-50 rounded-xl">
              <div className="text-3xl font-bold text-green-600">
                {paintingsSold}
              </div>
              <div className="text-muted-foreground">Paintings Sold</div>
            </div>
            <div className="text-center p-6 bg-blue-50 rounded-xl">
              <div className="text-3xl font-bold text-blue-600">
                {activePaintings}
              </div>
              <div className="text-muted-foreground">Active Listings</div>
            </div>
            <div className="text-center p-6 bg-purple-50 rounded-xl">
              <div className="text-3xl font-bold text-purple-600">
                {Math.floor(Math.random() * 10) + 1}
              </div>
              <div className="text-muted-foreground">Pending Orders</div>
            </div>
          </div>
          </CardContent>
        )}
      </Card>
        </>
      )}

      {/* Corporate Sales Overview Tab */}
      {activeTab === 'corporate' && (
        <>
          {/* Corporate Sales Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Corporate Revenue</p>
                    <p className="text-2xl font-bold text-green-600">{formatPrice(corporateRevenue)}</p>
                  </div>
                  <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <DollarSign className="h-6 w-6 text-green-600" />
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  <span className="text-green-600">+12.5%</span> from last month
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Corporate Orders</p>
                    <p className="text-2xl font-bold text-blue-600">{corporateOrdersCount}</p>
                  </div>
                  <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Package className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  <span className="text-blue-600">+8.3%</span> from last month
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Active Clients</p>
                    <p className="text-2xl font-bold text-purple-600">{uniqueCompanies}</p>
                  </div>
                  <div className="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center">
                    <Building2 className="h-6 w-6 text-purple-600" />
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  <span className="text-purple-600">+2</span> new this month
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Corporate Orders and Insights */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Recent Corporate Orders */}
            <Card>
              <CardHeader>
                <CardTitle 
                  className="flex items-center justify-between cursor-pointer"
                  onClick={() => toggleSection('corporateSales')}
                >
                  <div className="flex items-center">
                    <Package className="mr-2" size={20} />
                    Recent Corporate Orders
                  </div>
                  {collapsedSections.corporateSales ? <ChevronDown size={20} /> : <ChevronUp size={20} />}
                </CardTitle>
              </CardHeader>
              {!collapsedSections.corporateSales && (
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
                              order.status === 'processing' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-gray-100 text-gray-800'
                            }>
                              {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
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
              )}
            </Card>

            {/* Performance Insights */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrendingUp className="mr-2" size={20} />
                  Performance Insights
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <h4 className="font-medium text-blue-800 mb-2">Peak Season Performance</h4>
                    <p className="text-sm text-blue-700">December orders up 45% - holiday corporate gifting surge</p>
                  </div>
                  <div className="p-4 bg-green-50 rounded-lg">
                    <h4 className="font-medium text-green-800 mb-2">Bulk Order Success</h4>
                    <p className="text-sm text-green-700">Average bulk discount: 20% driving larger order volumes</p>
                  </div>
                  <div className="p-4 bg-purple-50 rounded-lg">
                    <h4 className="font-medium text-purple-800 mb-2">Client Retention</h4>
                    <p className="text-sm text-purple-700">67% repeat customer rate in corporate segment</p>
                  </div>
                  <div className="p-4 bg-orange-50 rounded-lg">
                    <h4 className="font-medium text-orange-800 mb-2">Growth Opportunity</h4>
                    <p className="text-sm text-orange-700">Tech companies show highest order values - expand outreach</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Top Products */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Award className="mr-2" size={20} />
                Top Corporate Products
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium">Premium Coffee Mug</p>
                    <p className="text-sm text-muted-foreground">250 units sold</p>
                  </div>
                  <p className="font-semibold text-green-600">{formatPrice(6247.50)}</p>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium">Water Bottle</p>
                    <p className="text-sm text-muted-foreground">200 units sold</p>
                  </div>
                  <p className="font-semibold text-green-600">{formatPrice(3798.00)}</p>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium">Branded Notebook</p>
                    <p className="text-sm text-muted-foreground">100 units sold</p>
                  </div>
                  <p className="font-semibold text-green-600">{formatPrice(1299.00)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </section>
  );
}
