export default function CareInstructions() {
  return (
    <div className="min-h-screen bg-warm-beige">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h1 className="font-brand text-4xl font-bold text-gray-900 mb-4 uppercase tracking-wide">
            Care <span className="text-elegant-gold">Instructions</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Preserve the beauty and value of your artwork with proper care and maintenance.
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">General Artwork Care</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <span className="text-elegant-gold mr-2">🌡️</span>
                Temperature & Humidity
              </h3>
              <ul className="space-y-2 text-gray-700">
                <li>• Maintain 65-75°F (18-24°C)</li>
                <li>• Keep humidity at 45-55%</li>
                <li>• Avoid extreme fluctuations</li>
                <li>• Use dehumidifiers in damp areas</li>
                <li>• Consider climate-controlled rooms</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <span className="text-elegant-gold mr-2">☀️</span>
                Light Protection
              </h3>
              <ul className="space-y-2 text-gray-700">
                <li>• Avoid direct sunlight</li>
                <li>• Use UV-filtering glass or acrylic</li>
                <li>• Position away from windows</li>
                <li>• Consider museum-quality lighting</li>
                <li>• Rotate displayed pieces periodically</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Canvas Care</h2>
            <div className="space-y-4">
              <div className="border-l-4 border-elegant-gold pl-4">
                <h3 className="font-semibold text-gray-900 mb-2">Daily Maintenance</h3>
                <p className="text-gray-700">Dust gently with a soft, dry brush or microfiber cloth. Always brush in one direction from top to bottom.</p>
              </div>
              <div className="border-l-4 border-gray-300 pl-4">
                <h3 className="font-semibold text-gray-900 mb-2">Deep Cleaning</h3>
                <p className="text-gray-700">For valuable pieces, consult a professional conservator. Never use water or cleaning solutions.</p>
              </div>
              <div className="border-l-4 border-gray-300 pl-4">
                <h3 className="font-semibold text-gray-900 mb-2">Storage</h3>
                <p className="text-gray-700">Store vertically in a cool, dry place. Use acid-free tissue paper between stacked works.</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Frame Maintenance</h2>
            <div className="space-y-4">
              <div className="border-l-4 border-elegant-gold pl-4">
                <h3 className="font-semibold text-gray-900 mb-2">Wood Frames</h3>
                <p className="text-gray-700">Dust with soft cloth. Use appropriate wood cleaner sparingly. Check for pest activity regularly.</p>
              </div>
              <div className="border-l-4 border-gray-300 pl-4">
                <h3 className="font-semibold text-gray-900 mb-2">Metal Frames</h3>
                <p className="text-gray-700">Clean with dry cloth. For stubborn spots, use slightly damp cloth and dry immediately.</p>
              </div>
              <div className="border-l-4 border-gray-300 pl-4">
                <h3 className="font-semibold text-gray-900 mb-2">Glass & Acrylic</h3>
                <p className="text-gray-700">Use ammonia-free glass cleaner. Spray on cloth, not directly on glass to avoid seepage.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">Hanging & Display Guidelines</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl mb-3">📏</div>
              <h3 className="font-semibold text-gray-900 mb-2">Height</h3>
              <p className="text-gray-600">Center artwork at 57-60 inches from floor to center of piece</p>
            </div>
            <div className="text-center">
              <div className="text-3xl mb-3">🔧</div>
              <h3 className="font-semibold text-gray-900 mb-2">Hardware</h3>
              <p className="text-gray-600">Use appropriate wall anchors and picture hanging systems for weight</p>
            </div>
            <div className="text-center">
              <div className="text-3xl mb-3">📐</div>
              <h3 className="font-semibold text-gray-900 mb-2">Spacing</h3>
              <p className="text-gray-600">Leave 2-3 inches between multiple pieces in groupings</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-yellow-800 mb-3">Warning Signs</h3>
            <p className="text-yellow-700 mb-3">Contact a conservator if you notice:</p>
            <ul className="space-y-1 text-yellow-700">
              <li>• Cracking or flaking paint</li>
              <li>• Canvas sagging or tearing</li>
              <li>• Discoloration or fading</li>
              <li>• Mold or mildew spots</li>
              <li>• Frame separation or damage</li>
            </ul>
          </div>
          
          <div className="bg-green-50 border border-green-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-green-800 mb-3">Professional Services</h3>
            <p className="text-green-700 mb-3">We recommend annual check-ups for:</p>
            <ul className="space-y-1 text-green-700">
              <li>• High-value artworks</li>
              <li>• Antique or vintage pieces</li>
              <li>• Works in challenging environments</li>
              <li>• Insurance documentation</li>
              <li>• Conservation planning</li>
            </ul>
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg p-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">Emergency Procedures</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Water Damage</h3>
              <ol className="space-y-2 text-gray-700 list-decimal list-inside">
                <li>Remove from water source immediately</li>
                <li>Do not attempt to dry or clean</li>
                <li>Place horizontally on flat surface</li>
                <li>Contact conservator within 24 hours</li>
                <li>Document damage with photographs</li>
              </ol>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Physical Damage</h3>
              <ol className="space-y-2 text-gray-700 list-decimal list-inside">
                <li>Handle minimally and carefully</li>
                <li>Support from behind if moving</li>
                <li>Collect any loose fragments</li>
                <li>Avoid tape or adhesives</li>
                <li>Seek professional restoration</li>
              </ol>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}