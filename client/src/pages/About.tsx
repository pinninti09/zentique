export default function About() {
  return (
    <div className="min-h-screen bg-warm-beige">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h1 className="font-brand text-4xl font-bold text-gray-900 mb-4 uppercase tracking-wide">
            About <span className="text-elegant-gold">Atelier</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Curating exceptional art from talented artists worldwide. Each piece tells a unique story.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          <div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Our Story</h2>
            <div className="space-y-4 text-gray-700">
              <p>
                Founded with a passion for discovering and showcasing extraordinary artistic talent, Atelier has become a premier destination for art collectors and enthusiasts seeking authentic, high-quality paintings.
              </p>
              <p>
                We believe that art has the power to transform spaces and inspire emotions. Our carefully curated collection features works from both emerging and established artists, each selected for their unique voice and exceptional craftsmanship.
              </p>
              <p>
                From contemporary abstracts to classical landscapes, every piece in our gallery represents a commitment to artistic excellence and storytelling through visual expression.
              </p>
            </div>
          </div>
          
          <div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Our Mission</h2>
            <div className="space-y-4 text-gray-700">
              <p>
                To bridge the gap between exceptional artists and discerning collectors by providing a platform where art transcends boundaries and finds its perfect home.
              </p>
              <p>
                We are committed to supporting artists by showcasing their work in the best possible light, while offering our clients unparalleled access to authentic, museum-quality pieces.
              </p>
              <p>
                Our mission extends beyond sales – we aim to educate, inspire, and foster a deeper appreciation for the arts within our community.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-8 mb-12">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6 text-center">Our Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-3xl mb-4">🎨</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Authenticity</h3>
              <p className="text-gray-600">Every piece is carefully verified and comes with a certificate of authenticity.</p>
            </div>
            <div className="text-center">
              <div className="text-3xl mb-4">✨</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Quality</h3>
              <p className="text-gray-600">We maintain the highest standards in artwork selection and presentation.</p>
            </div>
            <div className="text-center">
              <div className="text-3xl mb-4">🤝</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Service</h3>
              <p className="text-gray-600">Dedicated support from consultation to delivery and beyond.</p>
            </div>
          </div>
        </div>

        <div className="text-center">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">Visit Our Gallery</h2>
          <p className="text-gray-700 mb-6">
            Experience our collection in person at our flagship gallery location, or browse our complete catalog online.
          </p>
          <div className="bg-gray-50 rounded-lg p-6 inline-block">
            <p className="text-gray-900 font-semibold">Atelier Gallery</p>
            <p className="text-gray-600">123 Art District Avenue</p>
            <p className="text-gray-600">New York, NY 10001</p>
            <p className="text-gray-600 mt-2">Open Tuesday - Sunday, 10am - 7pm</p>
          </div>
        </div>
      </div>
    </div>
  );
}