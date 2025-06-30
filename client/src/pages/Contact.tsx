export default function Contact() {
  return (
    <div className="min-h-screen bg-warm-beige">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h1 className="font-brand text-4xl font-bold text-gray-900 mb-4 uppercase tracking-wide">
            Contact <span className="text-elegant-gold">Us</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Get in touch with our team of art experts. We're here to help with any questions about our collection.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-12">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Send us a Message</h2>
            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
                  <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-elegant-gold focus:border-transparent" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
                  <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-elegant-gold focus:border-transparent" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <input type="email" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-elegant-gold focus:border-transparent" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-elegant-gold focus:border-transparent">
                  <option>General Inquiry</option>
                  <option>Artwork Question</option>
                  <option>Commission Request</option>
                  <option>Shipping Inquiry</option>
                  <option>Return Request</option>
                  <option>Technical Support</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
                <textarea rows={6} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-elegant-gold focus:border-transparent" placeholder="Tell us how we can help you..."></textarea>
              </div>
              <button type="submit" className="w-full bg-elegant-gold text-white py-3 px-6 rounded-md hover:bg-opacity-90 transition-colors font-semibold">
                Send Message
              </button>
            </form>
          </div>

          <div className="space-y-8">
            <div className="bg-white rounded-lg shadow-lg p-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">Gallery Information</h2>
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <span className="text-elegant-gold text-xl">📍</span>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Visit Our Gallery</h3>
                    <p className="text-gray-600">123 Art District Avenue</p>
                    <p className="text-gray-600">New York, NY 10001</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <span className="text-elegant-gold text-xl">📞</span>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Phone</h3>
                    <p className="text-gray-600">(555) 123-4567</p>
                    <p className="text-gray-600 text-sm">Mon-Fri: 9am-6pm EST</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <span className="text-elegant-gold text-xl">✉️</span>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Email</h3>
                    <p className="text-gray-600">info@atelier-gallery.com</p>
                    <p className="text-gray-600 text-sm">Response within 24 hours</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">Gallery Hours</h2>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-700">Monday</span>
                  <span className="text-gray-600">Closed</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-700">Tuesday - Friday</span>
                  <span className="text-gray-600">10am - 7pm</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-700">Saturday</span>
                  <span className="text-gray-600">10am - 6pm</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-700">Sunday</span>
                  <span className="text-gray-600">12pm - 5pm</span>
                </div>
              </div>
              <div className="mt-6 pt-6 border-t border-gray-200">
                <p className="text-sm text-gray-600">
                  Private viewings and consultations available by appointment outside regular hours.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">Specialized Services</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-6 bg-gray-50 rounded-lg">
              <div className="text-3xl mb-3">🎨</div>
              <h3 className="font-semibold text-gray-900 mb-2">Art Consultation</h3>
              <p className="text-gray-600 text-sm">Expert guidance on building your collection</p>
            </div>
            <div className="text-center p-6 bg-gray-50 rounded-lg">
              <div className="text-3xl mb-3">🖼️</div>
              <h3 className="font-semibold text-gray-900 mb-2">Custom Framing</h3>
              <p className="text-gray-600 text-sm">Museum-quality framing services</p>
            </div>
            <div className="text-center p-6 bg-gray-50 rounded-lg">
              <div className="text-3xl mb-3">🏡</div>
              <h3 className="font-semibold text-gray-900 mb-2">Home Consultation</h3>
              <p className="text-gray-600 text-sm">In-home art placement and design advice</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}