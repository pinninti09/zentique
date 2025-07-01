export default function CustomerCare() {
  return (
    <div className="min-h-screen bg-warm-beige">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h1 className="font-brand text-4xl font-bold text-gray-900 mb-4 uppercase tracking-wide">
            Customer <span className="text-elegant-gold">Care</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            We're here to help you with any questions about your art collection journey.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Contact Us</h2>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <span className="text-elegant-gold">📞</span>
                <div>
                  <p className="font-semibold text-gray-900">Phone</p>
                  <p className="text-gray-600">(555) 123-4567</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <span className="text-elegant-gold">✉️</span>
                <div>
                  <p className="font-semibold text-gray-900">Email</p>
                  <p className="text-gray-600">support@atelier-gallery.com</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <span className="text-elegant-gold">🕒</span>
                <div>
                  <p className="font-semibold text-gray-900">Hours</p>
                  <p className="text-gray-600">Mon-Fri: 9am-6pm EST</p>
                  <p className="text-gray-600">Sat-Sun: 10am-4pm EST</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Quick Support</h2>
            <div className="space-y-4">
              <button className="w-full text-left p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <p className="font-semibold text-gray-900">Track Your Order</p>
                <p className="text-gray-600 text-sm">Check the status of your artwork delivery</p>
              </button>
              <button className="w-full text-left p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <p className="font-semibold text-gray-900">Start a Return</p>
                <p className="text-gray-600 text-sm">Begin the return process for your purchase</p>
              </button>
              <button className="w-full text-left p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <p className="font-semibold text-gray-900">Art Consultation</p>
                <p className="text-gray-600 text-sm">Get expert advice on your art selection</p>
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">Frequently Asked Questions</h2>
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">How long does shipping take?</h3>
              <p className="text-gray-700">Standard shipping takes 5-7 business days. Express shipping (2-3 days) and white-glove delivery are also available.</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Do you offer authentication certificates?</h3>
              <p className="text-gray-700">Yes, every artwork comes with a certificate of authenticity from the artist or our gallery experts.</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Can I see the artwork before purchasing?</h3>
              <p className="text-gray-700">We offer virtual consultations and detailed photos. You can also visit our physical gallery to view pieces in person.</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">What if the artwork arrives damaged?</h3>
              <p className="text-gray-700">We have comprehensive insurance coverage. Contact us immediately with photos, and we'll arrange for replacement or full refund.</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Do you offer custom framing?</h3>
              <p className="text-gray-700">Yes, we partner with master framers to offer museum-quality custom framing options for all our artworks.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}