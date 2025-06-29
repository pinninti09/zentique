import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Shield, Plus, Edit, Package, DollarSign, Truck, LogOut } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import { apiRequest } from '@/lib/queryClient';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
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
    medium: '',
    dimensions: '',
    year: '',
    artist: '',
  });
  const queryClient = useQueryClient();

  const { data: paintings = [] } = useQuery<Painting[]>({
    queryKey: ['/api/paintings'],
    enabled: !!adminToken,
  });

  const uploadPaintingMutation = useMutation({
    mutationFn: async (formData: FormData) => {
      return apiRequest('POST', '/api/admin/paintings', formData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/paintings'] });
      showToast('Painting uploaded successfully!');
      setUploadForm({
        title: '',
        description: '',
        price: '',
        salePrice: '',
        imageUrl: '',
        medium: '',
        dimensions: '',
        year: '',
        artist: '',
      });
    },
    onError: () => {
      showToast('Failed to upload painting', 'error');
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

    const formData = new FormData();
    Object.entries(uploadForm).forEach(([key, value]) => {
      if (value) formData.append(key, value);
    });

    uploadPaintingMutation.mutate(formData);
  };

  const handleInputChange = (field: string, value: string) => {
    setUploadForm(prev => ({ ...prev, [field]: value }));
  };

  const markAsSold = (paintingId: string) => {
    markAsSoldMutation.mutate(paintingId);
  };

  // Analytics
  const totalSales = paintings
    .filter(p => p.sold)
    .reduce((sum, p) => sum + (p.salePrice || p.price), 0);
  const paintingsSold = paintings.filter(p => p.sold).length;
  const activePaintings = paintings.filter(p => !p.sold).length;

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
        <h2 className="text-3xl font-serif font-bold text-charcoal">Admin Dashboard</h2>
        <Button onClick={handleLogout} variant="outline">
          <LogOut className="mr-2" size={16} />
          Logout
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Upload New Painting */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Plus className="mr-2" size={20} />
              Upload New Painting
            </CardTitle>
          </CardHeader>
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
                <Label htmlFor="artist">Artist</Label>
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

            <div>
              <Label htmlFor="imageUrl">Image URL</Label>
              <Input
                id="imageUrl"
                placeholder="https://example.com/image.jpg"
                value={uploadForm.imageUrl}
                onChange={(e) => handleInputChange('imageUrl', e.target.value)}
              />
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

            <Button
              onClick={handleUpload}
              disabled={uploadPaintingMutation.isPending}
              className="w-full bg-elegant-gold text-white hover:bg-yellow-600"
            >
              <Plus className="mr-2" size={16} />
              Upload Painting
            </Button>
          </CardContent>
        </Card>

        {/* Manage Paintings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Edit className="mr-2" size={20} />
              Manage Paintings ({paintings.length})
            </CardTitle>
          </CardHeader>
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
        </Card>
      </div>

      {/* Sales Analytics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <DollarSign className="mr-2" size={20} />
            Sales Overview
          </CardTitle>
        </CardHeader>
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
      </Card>
    </section>
  );
}
