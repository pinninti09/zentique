export default function BulkOrders() {
  return (
    <div className="min-h-screen bg-warm-beige">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h1 className="font-brand text-4xl font-bold text-gray-900 mb-4 uppercase tracking-wide">
            Bulk <span className="text-elegant-gold">Orders</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Streamlined ordering process for large quantities with competitive pricing and dedicated support.
          </p>
        </div>

        <div className="bg-elegant-gold bg-opacity-10 border border-elegant-gold rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-3">Volume Pricing Available</h2>
          <p className="text-gray-700">
            Orders of 50+ items qualify for bulk pricing. Save up to 30% on large orders with our tiered discount structure.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Order Minimums</h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-semibold text-gray-900">Coffee Mugs</p>
                  <p className="text-gray-600 text-sm">Premium ceramic with custom logo</p>
                </div>
                <span className="text-elegant-gold font-bold">25+ units</span>
              </div>
              <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-semibold text-gray-900">T-Shirts</p>
                  <p className="text-gray-600 text-sm">100% cotton with branded design</p>
                </div>
                <span className="text-elegant-gold font-bold">50+ units</span>
              </div>
              <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-semibold text-gray-900">Notebooks</p>
                  <p className="text-gray-600 text-sm">Hardcover with custom embossing</p>
                </div>
                <span className="text-elegant-gold font-bold">100+ units</span>
              </div>
              <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-semibold text-gray-900">Water Bottles</p>
                  <p className="text-gray-600 text-sm">Stainless steel with logo engraving</p>
                </div>
                <span className="text-elegant-gold font-bold">25+ units</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Pricing Tiers</h2>
            <div className="space-y-4">
              <div className="border-l-4 border-green-500 pl-4">
                <h3 className="font-semibold text-gray-900 mb-1">50-99 Items</h3>
                <p className="text-gray-600 text-sm mb-1">10% bulk discount</p>
                <p className="text-green-600 font-bold">Save $5-15 per item</p>
              </div>
              <div className="border-l-4 border-blue-500 pl-4">
                <h3 className="font-semibold text-gray-900 mb-1">100-249 Items</h3>
                <p className="text-gray-600 text-sm mb-1">20% bulk discount</p>
                <p className="text-blue-600 font-bold">Save $10-25 per item</p>
              </div>
              <div className="border-l-4 border-purple-500 pl-4">
                <h3 className="font-semibold text-gray-900 mb-1">250-499 Items</h3>
                <p className="text-gray-600 text-sm mb-1">25% bulk discount</p>
                <p className="text-purple-600 font-bold">Save $15-35 per item</p>
              </div>
              <div className="border-l-4 border-elegant-gold pl-4">
                <h3 className="font-semibold text-gray-900 mb-1">500+ Items</h3>
                <p className="text-gray-600 text-sm mb-1">30% bulk discount</p>
                <p className="text-elegant-gold font-bold">Save $20-50 per item</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">Bulk Order Process</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="bg-elegant-gold text-white rounded-full w-12 h-12 flex items-center justify-center text-lg font-bold mx-auto mb-3">1</div>
              <h3 className="font-semibold text-gray-900 mb-2">Request Quote</h3>
              <p className="text-gray-600 text-sm">Submit your requirements for custom pricing</p>
            </div>
            <div className="text-center">
              <div className="bg-elegant-gold text-white rounded-full w-12 h-12 flex items-center justify-center text-lg font-bold mx-auto mb-3">2</div>
              <h3 className="font-semibold text-gray-900 mb-2">Review Proposal</h3>
              <p className="text-gray-600 text-sm">Detailed quote with timeline and specifications</p>
            </div>
            <div className="text-center">
              <div className="bg-elegant-gold text-white rounded-full w-12 h-12 flex items-center justify-center text-lg font-bold mx-auto mb-3">3</div>
              <h3 className="font-semibold text-gray-900 mb-2">Approve & Pay</h3>
              <p className="text-gray-600 text-sm">Secure payment with flexible terms available</p>
            </div>
            <div className="text-center">
              <div className="bg-elegant-gold text-white rounded-full w-12 h-12 flex items-center justify-center text-lg font-bold mx-auto mb-3">4</div>
              <h3 className="font-semibold text-gray-900 mb-2">Production</h3>
              <p className="text-gray-600 text-sm">Manufacturing with quality checks and updates</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Rush Order Options</h2>
            <div className="space-y-4">
              <div className="p-4 border border-yellow-300 bg-yellow-50 rounded-lg">
                <h3 className="font-semibold text-yellow-800 mb-2">Express Production</h3>
                <p className="text-yellow-700 text-sm mb-2">7-10 business days | +25% surcharge</p>
                <p className="text-yellow-700">Priority queue placement with dedicated production line</p>
              </div>
              <div className="p-4 border border-red-300 bg-red-50 rounded-lg">
                <h3 className="font-semibold text-red-800 mb-2">Emergency Rush</h3>
                <p className="text-red-700 text-sm mb-2">3-5 business days | +50% surcharge</p>
                <p className="text-red-700">Round-the-clock production for urgent deadlines</p>
              </div>
              <div className="p-4 border border-purple-300 bg-purple-50 rounded-lg">
                <h3 className="font-semibold text-purple-800 mb-2">Same-Week Delivery</h3>
                <p className="text-purple-700 text-sm mb-2">2-3 business days | Custom quote</p>
                <p className="text-purple-700">Subject to availability and product complexity</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Payment Options</h2>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <span className="text-elegant-gold mt-1">💳</span>
                <div>
                  <p className="font-semibold text-gray-900">Standard Payment</p>
                  <p className="text-gray-600 text-sm">50% deposit, 50% on completion</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <span className="text-elegant-gold mt-1">📊</span>
                <div>
                  <p className="font-semibold text-gray-900">Corporate Terms</p>
                  <p className="text-gray-600 text-sm">Net 30/60/90 payment terms available</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <span className="text-elegant-gold mt-1">🏦</span>
                <div>
                  <p className="font-semibold text-gray-900">Purchase Orders</p>
                  <p className="text-gray-600 text-sm">PO processing for enterprise clients</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <span className="text-elegant-gold mt-1">💰</span>
                <div>
                  <p className="font-semibold text-gray-900">Volume Financing</p>
                  <p className="text-gray-600 text-sm">Flexible payment plans for large orders</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg p-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6 text-center">Ready to Place Your Bulk Order?</h2>
          <div className="text-center">
            <p className="text-gray-700 mb-6">
              Get a personalized quote for your bulk order requirements. Our team will work with you to ensure the best pricing and timeline.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-elegant-gold text-white px-8 py-3 rounded-md hover:bg-opacity-90 transition-colors font-semibold">
                Get Bulk Quote
              </button>
              <button className="border border-elegant-gold text-elegant-gold px-8 py-3 rounded-md hover:bg-elegant-gold hover:text-white transition-colors font-semibold">
                View Product Catalog
              </button>
            </div>
            <div className="mt-6 text-center">
              <p className="text-gray-600 text-sm">
                Questions? Call our bulk order specialists at <span className="font-semibold">(555) 123-4567</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}