export default function Customization() {
  return (
    <div className="min-h-screen bg-warm-beige">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h1 className="font-brand text-4xl font-bold text-gray-900 mb-4 uppercase tracking-wide">
            Product <span className="text-elegant-gold">Customization</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Transform standard products into unique branded experiences that reflect your company's identity and values.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Customization Options</h2>
            <div className="space-y-6">
              <div className="border-l-4 border-elegant-gold pl-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Color Customization</h3>
                <p className="text-gray-700 mb-2">Match your exact brand colors with Pantone color matching system.</p>
                <p className="text-gray-600 text-sm">Available on apparel, drinkware, and promotional items</p>
              </div>
              <div className="border-l-4 border-gray-300 pl-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Size Modifications</h3>
                <p className="text-gray-700 mb-2">Custom sizing for notebooks, bags, and packaging materials.</p>
                <p className="text-gray-600 text-sm">Minimum order quantities may apply</p>
              </div>
              <div className="border-l-4 border-gray-300 pl-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Material Upgrades</h3>
                <p className="text-gray-700 mb-2">Premium materials including organic cotton, bamboo, and recycled options.</p>
                <p className="text-gray-600 text-sm">Sustainable and eco-friendly alternatives available</p>
              </div>
              <div className="border-l-4 border-gray-300 pl-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Packaging Design</h3>
                <p className="text-gray-700 mb-2">Custom gift boxes, bags, and presentation materials.</p>
                <p className="text-gray-600 text-sm">Enhanced unboxing experiences for special events</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Advanced Features</h2>
            <div className="space-y-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-2">Multi-Location Branding</h3>
                <p className="text-gray-600 text-sm mb-2">Starting at $75 setup fee</p>
                <p className="text-gray-700">Logo placement on multiple product areas for maximum visibility.</p>
              </div>
              <div className="p-4 bg-elegant-gold bg-opacity-10 border border-elegant-gold rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-2">Variable Data Printing</h3>
                <p className="text-gray-600 text-sm mb-2">$2-5 per unit depending on complexity</p>
                <p className="text-gray-700">Individual names, titles, or departments on each item.</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-2">Special Effects</h3>
                <p className="text-gray-600 text-sm mb-2">Premium pricing varies by effect</p>
                <p className="text-gray-700">Foil stamping, embossing, glow-in-the-dark, and metallic finishes.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">Product Categories</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center p-4 border border-gray-200 rounded-lg">
              <div className="text-3xl mb-3">☕</div>
              <h3 className="font-semibold text-gray-900 mb-2">Drinkware</h3>
              <ul className="text-gray-600 text-sm space-y-1">
                <li>• Handle colors</li>
                <li>• Interior colors</li>
                <li>• Lid customization</li>
                <li>• Thermal features</li>
              </ul>
            </div>
            <div className="text-center p-4 border border-gray-200 rounded-lg">
              <div className="text-3xl mb-3">👕</div>
              <h3 className="font-semibold text-gray-900 mb-2">Apparel</h3>
              <ul className="text-gray-600 text-sm space-y-1">
                <li>• Fabric blends</li>
                <li>• Cut styles</li>
                <li>• Collar options</li>
                <li>• Pocket designs</li>
              </ul>
            </div>
            <div className="text-center p-4 border border-gray-200 rounded-lg">
              <div className="text-3xl mb-3">📓</div>
              <h3 className="font-semibold text-gray-900 mb-2">Office Items</h3>
              <ul className="text-gray-600 text-sm space-y-1">
                <li>• Paper types</li>
                <li>• Binding styles</li>
                <li>• Cover materials</li>
                <li>• Page layouts</li>
              </ul>
            </div>
            <div className="text-center p-4 border border-gray-200 rounded-lg">
              <div className="text-3xl mb-3">🎒</div>
              <h3 className="font-semibold text-gray-900 mb-2">Bags</h3>
              <ul className="text-gray-600 text-sm space-y-1">
                <li>• Strap options</li>
                <li>• Pocket layouts</li>
                <li>• Zipper colors</li>
                <li>• Liner materials</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Process Timeline</h2>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <span className="bg-elegant-gold text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">1</span>
                <div>
                  <p className="font-semibold text-gray-900">Consultation Call</p>
                  <p className="text-gray-600 text-sm">Discuss customization requirements and feasibility</p>
                  <p className="text-gray-500 text-xs">Day 1: 1-2 hours</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <span className="bg-elegant-gold text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">2</span>
                <div>
                  <p className="font-semibold text-gray-900">Design Development</p>
                  <p className="text-gray-600 text-sm">Create mockups and technical specifications</p>
                  <p className="text-gray-500 text-xs">Days 2-5: Design iteration</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <span className="bg-elegant-gold text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">3</span>
                <div>
                  <p className="font-semibold text-gray-900">Sample Production</p>
                  <p className="text-gray-600 text-sm">Physical samples for approval and testing</p>
                  <p className="text-gray-500 text-xs">Days 6-10: Sample creation</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <span className="bg-elegant-gold text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">4</span>
                <div>
                  <p className="font-semibold text-gray-900">Full Production</p>
                  <p className="text-gray-600 text-sm">Manufacturing and quality control</p>
                  <p className="text-gray-500 text-xs">Days 11-25: Bulk production</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Investment Levels</h2>
            <div className="space-y-4">
              <div className="border-l-4 border-green-500 pl-4">
                <h3 className="font-semibold text-gray-900 mb-1">Basic Customization</h3>
                <p className="text-gray-600 text-sm mb-1">$200-500 setup costs</p>
                <p className="text-green-600 font-bold">Simple color changes, basic logo placement</p>
              </div>
              <div className="border-l-4 border-blue-500 pl-4">
                <h3 className="font-semibold text-gray-900 mb-1">Advanced Options</h3>
                <p className="text-gray-600 text-sm mb-1">$500-1,500 setup costs</p>
                <p className="text-blue-600 font-bold">Material changes, multiple locations, special effects</p>
              </div>
              <div className="border-l-4 border-purple-500 pl-4">
                <h3 className="font-semibold text-gray-900 mb-1">Premium Custom</h3>
                <p className="text-gray-600 text-sm mb-1">$1,500+ setup costs</p>
                <p className="text-purple-600 font-bold">Complete product redesign, unique features</p>
              </div>
              <div className="border-l-4 border-elegant-gold pl-4">
                <h3 className="font-semibold text-gray-900 mb-1">Exclusive Development</h3>
                <p className="text-gray-600 text-sm mb-1">$5,000+ project investment</p>
                <p className="text-elegant-gold font-bold">New product creation, patent-pending designs</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg p-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6 text-center">Ready to Create Something Unique?</h2>
          <div className="text-center">
            <p className="text-gray-700 mb-6">
              Schedule a customization consultation to explore possibilities for your next corporate gifting project.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-elegant-gold text-white px-8 py-3 rounded-md hover:bg-opacity-90 transition-colors font-semibold">
                Schedule Customization Call
              </button>
              <button className="border border-elegant-gold text-elegant-gold px-8 py-3 rounded-md hover:bg-elegant-gold hover:text-white transition-colors font-semibold">
                View Customization Gallery
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}