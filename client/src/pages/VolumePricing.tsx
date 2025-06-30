export default function VolumePricing() {
  return (
    <div className="min-h-screen bg-warm-beige">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h1 className="font-brand text-4xl font-bold text-gray-900 mb-4 uppercase tracking-wide">
            Volume <span className="text-elegant-gold">Pricing</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Competitive pricing tiers that scale with your order size. The more you order, the more you save.
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">Pricing Tiers Overview</h2>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">Order Quantity</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">Discount</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">Example: Coffee Mug</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">You Save</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-gray-100">
                  <td className="py-3 px-4">1-24 units</td>
                  <td className="py-3 px-4">Standard Price</td>
                  <td className="py-3 px-4">$15.00 each</td>
                  <td className="py-3 px-4">-</td>
                </tr>
                <tr className="border-b border-gray-100 bg-green-50">
                  <td className="py-3 px-4">25-49 units</td>
                  <td className="py-3 px-4 text-green-600 font-semibold">10% off</td>
                  <td className="py-3 px-4">$13.50 each</td>
                  <td className="py-3 px-4 text-green-600">$1.50 per unit</td>
                </tr>
                <tr className="border-b border-gray-100 bg-blue-50">
                  <td className="py-3 px-4">50-99 units</td>
                  <td className="py-3 px-4 text-blue-600 font-semibold">15% off</td>
                  <td className="py-3 px-4">$12.75 each</td>
                  <td className="py-3 px-4 text-blue-600">$2.25 per unit</td>
                </tr>
                <tr className="border-b border-gray-100 bg-purple-50">
                  <td className="py-3 px-4">100-249 units</td>
                  <td className="py-3 px-4 text-purple-600 font-semibold">20% off</td>
                  <td className="py-3 px-4">$12.00 each</td>
                  <td className="py-3 px-4 text-purple-600">$3.00 per unit</td>
                </tr>
                <tr className="border-b border-gray-100 bg-yellow-50">
                  <td className="py-3 px-4">250-499 units</td>
                  <td className="py-3 px-4 text-yellow-600 font-semibold">25% off</td>
                  <td className="py-3 px-4">$11.25 each</td>
                  <td className="py-3 px-4 text-yellow-600">$3.75 per unit</td>
                </tr>
                <tr className="bg-elegant-gold bg-opacity-10">
                  <td className="py-3 px-4">500+ units</td>
                  <td className="py-3 px-4 text-elegant-gold font-semibold">30% off</td>
                  <td className="py-3 px-4">$10.50 each</td>
                  <td className="py-3 px-4 text-elegant-gold">$4.50 per unit</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Product Category Pricing</h2>
            <div className="space-y-4">
              <div className="p-4 border border-gray-200 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-2">Drinkware</h3>
                <p className="text-gray-600 text-sm mb-2">Coffee mugs, water bottles, tumblers</p>
                <p className="text-gray-700">Starting at $8.50 (500+ qty) | Regular: $12.95</p>
              </div>
              <div className="p-4 border border-gray-200 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-2">Apparel</h3>
                <p className="text-gray-600 text-sm mb-2">T-shirts, polo shirts, hoodies</p>
                <p className="text-gray-700">Starting at $14.75 (500+ qty) | Regular: $21.95</p>
              </div>
              <div className="p-4 border border-gray-200 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-2">Office Supplies</h3>
                <p className="text-gray-600 text-sm mb-2">Notebooks, pens, desk accessories</p>
                <p className="text-gray-700">Starting at $6.25 (500+ qty) | Regular: $9.95</p>
              </div>
              <div className="p-4 border border-gray-200 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-2">Tech Accessories</h3>
                <p className="text-gray-600 text-sm mb-2">Phone stands, cable organizers, speakers</p>
                <p className="text-gray-700">Starting at $18.50 (500+ qty) | Regular: $26.95</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Additional Savings</h2>
            <div className="space-y-4">
              <div className="border-l-4 border-elegant-gold pl-4">
                <h3 className="font-semibold text-gray-900 mb-2">Annual Contracts</h3>
                <p className="text-gray-700 mb-1">Additional 5-10% off with yearly commitments</p>
                <p className="text-gray-600 text-sm">Minimum $50K annual spend required</p>
              </div>
              <div className="border-l-4 border-gray-300 pl-4">
                <h3 className="font-semibold text-gray-900 mb-2">Multi-Product Orders</h3>
                <p className="text-gray-700 mb-1">Extra 3% discount on mixed product orders</p>
                <p className="text-gray-600 text-sm">Must meet minimum quantities per product</p>
              </div>
              <div className="border-l-4 border-gray-300 pl-4">
                <h3 className="font-semibold text-gray-900 mb-2">Repeat Customer Discount</h3>
                <p className="text-gray-700 mb-1">Progressive savings up to 7% for loyal clients</p>
                <p className="text-gray-600 text-sm">Based on order history and frequency</p>
              </div>
              <div className="border-l-4 border-gray-300 pl-4">
                <h3 className="font-semibold text-gray-900 mb-2">Early Bird Pricing</h3>
                <p className="text-gray-700 mb-1">Additional 5% off orders placed 4+ weeks ahead</p>
                <p className="text-gray-600 text-sm">Perfect for planned events and campaigns</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">Calculation Examples</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="p-6 bg-gray-50 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Scenario 1: Company Event</h3>
              <div className="space-y-2 text-gray-700">
                <p>• 150 branded coffee mugs</p>
                <p>• Regular price: $15.00 each = $2,250</p>
                <p>• Volume price (20% off): $12.00 each = $1,800</p>
                <p className="font-semibold text-green-600">Total Savings: $450</p>
              </div>
            </div>
            <div className="p-6 bg-gray-50 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Scenario 2: Annual Program</h3>
              <div className="space-y-2 text-gray-700">
                <p>• 750 assorted promotional items</p>
                <p>• Regular total: $18,750</p>
                <p>• Volume + Annual discount: $11,812</p>
                <p className="font-semibold text-green-600">Total Savings: $6,938</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg p-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6 text-center">Get Your Volume Quote</h2>
          <div className="text-center">
            <p className="text-gray-700 mb-6">
              Submit your requirements for a detailed volume pricing quote tailored to your specific needs.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-elegant-gold text-white px-8 py-3 rounded-md hover:bg-opacity-90 transition-colors font-semibold">
                Request Volume Quote
              </button>
              <button className="border border-elegant-gold text-elegant-gold px-8 py-3 rounded-md hover:bg-elegant-gold hover:text-white transition-colors font-semibold">
                Talk to Pricing Specialist
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}