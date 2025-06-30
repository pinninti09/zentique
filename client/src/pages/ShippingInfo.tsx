export default function ShippingInfo() {
  return (
    <div className="min-h-screen bg-warm-beige">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h1 className="font-brand text-4xl font-bold text-gray-900 mb-4 uppercase tracking-wide">
            Shipping <span className="text-elegant-gold">Information</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Safe, secure delivery of your precious artwork to your doorstep.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Shipping Options</h2>
            <div className="space-y-6">
              <div className="border-l-4 border-elegant-gold pl-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Standard Shipping</h3>
                <p className="text-gray-600 mb-2">5-7 business days | Free on orders over $500</p>
                <p className="text-gray-700">Professional packaging with bubble wrap and rigid backing board protection.</p>
              </div>
              <div className="border-l-4 border-gray-300 pl-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Express Shipping</h3>
                <p className="text-gray-600 mb-2">2-3 business days | $35 flat rate</p>
                <p className="text-gray-700">Priority handling with expedited carrier service and signature confirmation.</p>
              </div>
              <div className="border-l-4 border-gray-300 pl-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">White Glove Delivery</h3>
                <p className="text-gray-600 mb-2">Scheduled appointment | Starting at $150</p>
                <p className="text-gray-700">Professional art handlers deliver and can assist with installation.</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Packaging Standards</h2>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <span className="text-elegant-gold mt-1">📦</span>
                <div>
                  <p className="font-semibold text-gray-900">Museum-Quality Protection</p>
                  <p className="text-gray-600">Acid-free materials and archival packaging</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <span className="text-elegant-gold mt-1">🛡️</span>
                <div>
                  <p className="font-semibold text-gray-900">Custom Crating</p>
                  <p className="text-gray-600">Large pieces receive custom wooden crates</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <span className="text-elegant-gold mt-1">📍</span>
                <div>
                  <p className="font-semibold text-gray-900">GPS Tracking</p>
                  <p className="text-gray-600">Real-time location updates throughout transit</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <span className="text-elegant-gold mt-1">🔒</span>
                <div>
                  <p className="font-semibold text-gray-900">Insurance Coverage</p>
                  <p className="text-gray-600">Full value protection during shipping</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">International Shipping</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Available Regions</h3>
              <ul className="space-y-2 text-gray-700">
                <li>• Canada: 7-10 business days</li>
                <li>• Europe: 10-14 business days</li>
                <li>• Australia: 12-16 business days</li>
                <li>• Asia: 10-15 business days</li>
                <li>• Other regions: Contact for quote</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Important Notes</h3>
              <ul className="space-y-2 text-gray-700">
                <li>• Customs duties may apply</li>
                <li>• CITES permits for certain materials</li>
                <li>• Cultural export documentation included</li>
                <li>• Professional customs broker assistance</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg p-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">Delivery Process</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-3xl mb-3">📋</div>
              <h3 className="font-semibold text-gray-900 mb-2">Order Processing</h3>
              <p className="text-gray-600 text-sm">1-2 business days for preparation and packaging</p>
            </div>
            <div className="text-center">
              <div className="text-3xl mb-3">🚚</div>
              <h3 className="font-semibold text-gray-900 mb-2">In Transit</h3>
              <p className="text-gray-600 text-sm">Real-time tracking updates via email and SMS</p>
            </div>
            <div className="text-center">
              <div className="text-3xl mb-3">📞</div>
              <h3 className="font-semibold text-gray-900 mb-2">Delivery Notice</h3>
              <p className="text-gray-600 text-sm">24-hour advance notice for delivery scheduling</p>
            </div>
            <div className="text-center">
              <div className="text-3xl mb-3">✅</div>
              <h3 className="font-semibold text-gray-900 mb-2">Safe Arrival</h3>
              <p className="text-gray-600 text-sm">Signature confirmation and condition verification</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}