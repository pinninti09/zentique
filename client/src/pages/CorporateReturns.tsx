export default function CorporateReturns() {
  return (
    <div className="min-h-screen bg-warm-beige">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h1 className="font-brand text-4xl font-bold text-gray-900 mb-4 uppercase tracking-wide">
            Corporate <span className="text-elegant-gold">Returns</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Flexible return policies designed for corporate purchasing needs and bulk order requirements.
          </p>
        </div>

        <div className="bg-elegant-gold bg-opacity-10 border border-elegant-gold rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-3">Extended 60-Day Corporate Return Policy</h2>
          <p className="text-gray-700">
            Corporate clients receive extended return windows and simplified processes for bulk orders and promotional merchandise.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Corporate Return Benefits</h2>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <span className="text-elegant-gold mt-1">📅</span>
                <div>
                  <p className="font-semibold text-gray-900">Extended Return Window</p>
                  <p className="text-gray-600 text-sm">60 days for corporate orders vs 30 days standard</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <span className="text-elegant-gold mt-1">🚚</span>
                <div>
                  <p className="font-semibold text-gray-900">Free Return Shipping</p>
                  <p className="text-gray-600 text-sm">Prepaid return labels for orders over $500</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <span className="text-elegant-gold mt-1">⚡</span>
                <div>
                  <p className="font-semibold text-gray-900">Priority Processing</p>
                  <p className="text-gray-600 text-sm">Expedited refunds within 3-5 business days</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <span className="text-elegant-gold mt-1">🔄</span>
                <div>
                  <p className="font-semibold text-gray-900">Bulk Exchange Options</p>
                  <p className="text-gray-600 text-sm">Easy exchanges for different sizes or products</p>
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
                  <p className="font-semibold text-gray-900">Contact Account Manager</p>
                  <p className="text-gray-600 text-sm">Call or email your dedicated corporate contact</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <span className="bg-elegant-gold text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">2</span>
                <div>
                  <p className="font-semibold text-gray-900">Return Authorization</p>
                  <p className="text-gray-600 text-sm">Receive RMA number and return instructions</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <span className="bg-elegant-gold text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">3</span>
                <div>
                  <p className="font-semibold text-gray-900">Package Items</p>
                  <p className="text-gray-600 text-sm">Use original packaging when possible</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <span className="bg-elegant-gold text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">4</span>
                <div>
                  <p className="font-semibold text-gray-900">Ship & Track</p>
                  <p className="text-gray-600 text-sm">Use provided label and tracking number</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">Corporate Return Scenarios</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Eligible Returns</h3>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start space-x-2">
                  <span className="text-green-500 mt-1">✓</span>
                  <span>Unused promotional items in original condition</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-green-500 mt-1">✓</span>
                  <span>Overordered quantities from bulk purchases</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-green-500 mt-1">✓</span>
                  <span>Items damaged during shipping</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-green-500 mt-1">✓</span>
                  <span>Incorrect products or customization errors</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-green-500 mt-1">✓</span>
                  <span>Event cancellations (with documentation)</span>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Special Circumstances</h3>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start space-x-2">
                  <span className="text-yellow-500 mt-1">⚠</span>
                  <span>Custom branded items (case-by-case basis)</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-yellow-500 mt-1">⚠</span>
                  <span>Partially used promotional sets</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-red-500 mt-1">✗</span>
                  <span>Items worn or used at events</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-red-500 mt-1">✗</span>
                  <span>Personalized items with individual names</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-red-500 mt-1">✗</span>
                  <span>Returns beyond 60-day window</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Refund Options</h2>
            <div className="space-y-4">
              <div className="border-l-4 border-elegant-gold pl-4">
                <h3 className="font-semibold text-gray-900 mb-2">Full Refund</h3>
                <p className="text-gray-700 mb-1">100% refund to original payment method</p>
                <p className="text-gray-600 text-sm">For eligible returns in perfect condition</p>
              </div>
              <div className="border-l-4 border-blue-500 pl-4">
                <h3 className="font-semibold text-gray-900 mb-2">Store Credit</h3>
                <p className="text-gray-700 mb-1">110% value in account credit</p>
                <p className="text-gray-600 text-sm">Extra 10% bonus for future orders</p>
              </div>
              <div className="border-l-4 border-green-500 pl-4">
                <h3 className="font-semibold text-gray-900 mb-2">Exchange Credit</h3>
                <p className="text-gray-700 mb-1">Equal value exchange plus shipping</p>
                <p className="text-gray-600 text-sm">For different products or quantities</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Enterprise Support</h2>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <span className="text-elegant-gold mt-1">👤</span>
                <div>
                  <p className="font-semibold text-gray-900">Dedicated Return Specialist</p>
                  <p className="text-gray-600 text-sm">Direct line for enterprise accounts</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <span className="text-elegant-gold mt-1">📞</span>
                <div>
                  <p className="font-semibold text-gray-900">Priority Phone Support</p>
                  <p className="text-gray-600 text-sm">Skip the queue with corporate hotline</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <span className="text-elegant-gold mt-1">📊</span>
                <div>
                  <p className="font-semibold text-gray-900">Return Analytics</p>
                  <p className="text-gray-600 text-sm">Track return patterns and trends</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <span className="text-elegant-gold mt-1">🔄</span>
                <div>
                  <p className="font-semibold text-gray-900">Automated Processing</p>
                  <p className="text-gray-600 text-sm">Streamlined workflow for repeat clients</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg p-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6 text-center">Need to Process a Return?</h2>
          <div className="text-center">
            <p className="text-gray-700 mb-6">
              Contact your account manager or our corporate returns team to get started with your return request.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-elegant-gold text-white px-8 py-3 rounded-md hover:bg-opacity-90 transition-colors font-semibold">
                Start Return Process
              </button>
              <button className="border border-elegant-gold text-elegant-gold px-8 py-3 rounded-md hover:bg-elegant-gold hover:text-white transition-colors font-semibold">
                Contact Returns Team
              </button>
            </div>
            <div className="mt-6 text-center">
              <p className="text-gray-600 text-sm">
                Corporate Returns Hotline: <span className="font-semibold">(555) 123-4567 ext. 2</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}