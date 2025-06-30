export default function Returns() {
  return (
    <div className="min-h-screen bg-warm-beige">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h1 className="font-brand text-4xl font-bold text-gray-900 mb-4 uppercase tracking-wide">
            Returns <span className="text-elegant-gold">Policy</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Your satisfaction is our priority. We offer flexible return options for your peace of mind.
          </p>
        </div>

        <div className="bg-elegant-gold bg-opacity-10 border border-elegant-gold rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-3">30-Day Return Guarantee</h2>
          <p className="text-gray-700">
            We offer a full 30-day return period from the date of delivery. If you're not completely satisfied with your artwork, 
            we'll accept returns in original condition for a full refund or exchange.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Return Eligibility</h2>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <span className="text-green-500 mt-1">✓</span>
                <div>
                  <p className="font-semibold text-gray-900">Original Condition</p>
                  <p className="text-gray-600">Artwork must be unaltered and undamaged</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <span className="text-green-500 mt-1">✓</span>
                <div>
                  <p className="font-semibold text-gray-900">Original Packaging</p>
                  <p className="text-gray-600">Please retain all protective materials</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <span className="text-green-500 mt-1">✓</span>
                <div>
                  <p className="font-semibold text-gray-900">Documentation</p>
                  <p className="text-gray-600">Include certificate of authenticity</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <span className="text-green-500 mt-1">✓</span>
                <div>
                  <p className="font-semibold text-gray-900">Time Frame</p>
                  <p className="text-gray-600">Within 30 days of delivery</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Return Process</h2>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <span className="bg-elegant-gold text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">1</span>
                <div>
                  <p className="font-semibold text-gray-900">Contact Us</p>
                  <p className="text-gray-600">Email or call to initiate return</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <span className="bg-elegant-gold text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">2</span>
                <div>
                  <p className="font-semibold text-gray-900">Authorization</p>
                  <p className="text-gray-600">Receive return authorization number</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <span className="bg-elegant-gold text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">3</span>
                <div>
                  <p className="font-semibold text-gray-900">Package</p>
                  <p className="text-gray-600">Repack using original materials</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <span className="bg-elegant-gold text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">4</span>
                <div>
                  <p className="font-semibold text-gray-900">Ship</p>
                  <p className="text-gray-600">Use provided prepaid label</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">Refund Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Processing Time</h3>
              <ul className="space-y-2 text-gray-700">
                <li>• Inspection: 2-3 business days</li>
                <li>• Refund processing: 3-5 business days</li>
                <li>• Bank processing: 5-10 business days</li>
                <li>• Total time: 10-18 business days</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Refund Method</h3>
              <ul className="space-y-2 text-gray-700">
                <li>• Original payment method</li>
                <li>• Full purchase price refunded</li>
                <li>• Free return shipping (US only)</li>
                <li>• Original shipping costs included</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-red-800 mb-3">Non-Returnable Items</h3>
            <ul className="space-y-2 text-red-700">
              <li>• Custom framed pieces (unless damaged)</li>
              <li>• Commissioned artwork</li>
              <li>• Digital art downloads</li>
              <li>• Items damaged by customer</li>
            </ul>
          </div>
          
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-blue-800 mb-3">Exchanges</h3>
            <p className="text-blue-700 mb-3">
              We're happy to facilitate exchanges for different sizes, frames, or similar-valued pieces.
            </p>
            <p className="text-blue-700">
              Contact our team to discuss exchange options before initiating a return.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}