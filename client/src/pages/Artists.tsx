import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import type { Painting } from "@shared/schema";

interface Artist {
  name: string;
  bio: string;
  photoUrl: string;
  bornYear: number;
  awards: string;
  paintings: Painting[];
}

export default function Artists() {
  const { data: paintings, isLoading } = useQuery<Painting[]>({
    queryKey: ["/api/paintings"],
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-stone-600 mx-auto"></div>
          <p className="mt-4 text-stone-600">Loading artists...</p>
        </div>
      </div>
    );
  }

  // Group paintings by artist
  const artistsData: { [key: string]: Artist } = {};
  
  paintings?.forEach((painting) => {
    if (painting.artist && painting.artistBio) {
      if (!artistsData[painting.artist]) {
        artistsData[painting.artist] = {
          name: painting.artist,
          bio: painting.artistBio,
          photoUrl: painting.artistPhotoUrl || "",
          bornYear: painting.artistBornYear || 0,
          awards: painting.artistAwards || "",
          paintings: [],
        };
      }
      artistsData[painting.artist].paintings.push(painting);
    }
  });

  const artists = Object.values(artistsData);

  return (
    <div className="min-h-screen bg-stone-50">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-stone-800 to-stone-900 text-white">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="font-brand text-5xl lg:text-7xl font-bold mb-6 uppercase tracking-wide">
              Our Artists
            </h1>
            <p className="text-xl lg:text-2xl max-w-3xl mx-auto leading-relaxed text-stone-200">
              Meet the talented artists behind our curated collection. Each brings their unique vision, 
              technique, and story to create paintings that inspire and captivate.
            </p>
          </div>
        </div>
      </div>

      {/* Artists Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid gap-12 lg:gap-16">
          {artists.map((artist) => (
            <div key={artist.name} className="bg-white rounded-2xl shadow-lg overflow-hidden">
              {/* Artist Header */}
              <div className="p-8 lg:p-12">
                <div className="flex flex-col lg:flex-row gap-8 items-start">
                  {/* Artist Photo */}
                  {artist.photoUrl && (
                    <div className="flex-shrink-0">
                      <img
                        src={artist.photoUrl}
                        alt={artist.name}
                        className="w-32 h-32 lg:w-40 lg:h-40 rounded-full object-cover shadow-lg"
                      />
                    </div>
                  )}
                  
                  {/* Artist Info */}
                  <div className="flex-1">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
                      <div>
                        <h2 className="font-brand text-3xl lg:text-4xl font-bold text-stone-900 mb-2">
                          {artist.name}
                        </h2>
                        {artist.bornYear > 0 && (
                          <p className="text-stone-600 text-lg">
                            Born {artist.bornYear}
                          </p>
                        )}
                      </div>
                      <div className="text-right">
                        <p className="text-stone-600 font-medium">
                          {artist.paintings.length} {artist.paintings.length === 1 ? 'Artwork' : 'Artworks'}
                        </p>
                      </div>
                    </div>
                    
                    {/* Biography */}
                    <p className="text-stone-700 text-lg leading-relaxed mb-6">
                      {artist.bio}
                    </p>
                    
                    {/* Awards */}
                    {artist.awards && (
                      <div className="bg-stone-50 rounded-lg p-6">
                        <h3 className="font-semibold text-stone-900 mb-3">
                          Awards & Recognition
                        </h3>
                        <p className="text-stone-700">
                          {artist.awards}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Artist's Paintings */}
              <div className="border-t bg-stone-50 p-8 lg:p-12">
                <h3 className="font-brand text-2xl font-bold text-stone-900 mb-8 uppercase tracking-wide">
                  Featured Works
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {artist.paintings.map((painting) => (
                    <Link
                      key={painting.id}
                      href="/"
                      className="group cursor-pointer"
                    >
                      <div className="bg-white rounded-lg overflow-hidden shadow-md group-hover:shadow-xl transition-all duration-300 transform group-hover:scale-105">
                        <div className="aspect-[4/3] overflow-hidden">
                          <img
                            src={painting.imageUrl}
                            alt={painting.title}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                          />
                        </div>
                        <div className="p-4">
                          <h4 className="font-semibold text-stone-900 mb-1 group-hover:text-stone-700 transition-colors">
                            {painting.title}
                          </h4>
                          <p className="text-stone-600 text-sm mb-2">
                            {painting.year} • {painting.medium}
                          </p>
                          <div className="flex items-center justify-between">
                            <p className="font-bold text-stone-900">
                              {painting.salePrice ? (
                                <span>
                                  <span className="text-red-600">${painting.salePrice.toLocaleString()}</span>
                                  <span className="text-stone-500 text-sm line-through ml-2">
                                    ${painting.price.toLocaleString()}
                                  </span>
                                </span>
                              ) : (
                                `$${painting.price.toLocaleString()}`
                              )}
                            </p>
                            {painting.sold && (
                              <span className="bg-red-100 text-red-800 text-xs font-medium px-2 py-1 rounded">
                                Sold
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
                
                {/* View All Link */}
                <div className="text-center mt-8">
                  <Link
                    href="/"
                    className="inline-flex items-center px-6 py-3 bg-stone-900 text-white font-medium rounded-lg hover:bg-stone-800 transition-colors"
                  >
                    View All Works by {artist.name}
                    <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center mt-16 bg-white rounded-2xl shadow-lg p-12">
          <h2 className="font-brand text-3xl font-bold text-stone-900 mb-6 uppercase tracking-wide">
            Discover More Art
          </h2>
          <p className="text-stone-600 text-lg mb-8 max-w-2xl mx-auto">
            Explore our complete collection of contemporary paintings and find the perfect piece 
            to transform your space.
          </p>
          <Link
            href="/"
            className="inline-flex items-center px-8 py-4 bg-stone-900 text-white font-medium rounded-lg hover:bg-stone-800 transition-colors text-lg"
          >
            Browse Gallery
            <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
}