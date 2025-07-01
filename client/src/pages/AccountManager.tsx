export default function AccountManager() {
  return (
    <div className="min-h-screen bg-warm-beige">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h1 className="font-brand text-4xl font-bold text-gray-900 mb-4 uppercase tracking-wide">
            Account <span className="text-elegant-gold">Manager</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Dedicated corporate account management services providing personalized support for your business gifting needs.
          </p>
        </div>

        <div className="bg-elegant-gold bg-opacity-10 border border-elegant-gold rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-3">White-Glove Account Management</h2>
          <p className="text-gray-700">
            Every corporate client receives a dedicated account manager to ensure seamless service and strategic partnership development.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Your Account Manager</h2>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <span className="text-elegant-gold mt-1">👤</span>
                <div>
                  <p className="font-semibold text-gray-900">Single Point of Contact</p>
                  <p className="text-gray-600 text-sm">Direct access to your dedicated manager via phone, email, or chat</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <span className="text-elegant-gold mt-1">📊</span>
                <div>
                  <p className="font-semibold text-gray-900">Strategic Planning</p>
                  <p className="text-gray-600 text-sm">Annual gifting roadmaps aligned with your business objectives</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <span className="text-elegant-gold mt-1">⏰</span>
                <div>
                  <p className="font-semibold text-gray-900">Priority Response</p>
                  <p className="text-gray-600 text-sm">Guaranteed response within 2 hours during business days</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <span className="text-elegant-gold mt-1">🎯</span>
                <div>
                  <p className="font-semibold text-gray-900">Proactive Support</p>
                  <p className="text-gray-600 text-sm">Regular check-ins and recommendations for optimization</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Services Included</h2>
            <div className="space-y-4">
              <div className="border-l-4 border-elegant-gold pl-4">
                <h3 className="font-semibold text-gray-900 mb-2">Order Management</h3>
                <p className="text-gray-700">Complete order lifecycle support from planning to delivery tracking</p>
              </div>
              <div className="border-l-4 border-gray-300 pl-4">
                <h3 className="font-semibold text-gray-900 mb-2">Budget Planning</h3>
                <p className="text-gray-700">Annual budget allocation and cost optimization strategies</p>
              </div>
              <div className="border-l-4 border-gray-300 pl-4">
                <h3 className="font-semibold text-gray-900 mb-2">Product Sourcing</h3>
                <p className="text-gray-700">Custom product research and vendor coordination</p>
              </div>
              <div className="border-l-4 border-gray-300 pl-4">
                <h3 className="font-semibold text-gray-900 mb-2">Reporting & Analytics</h3>
                <p className="text-gray-700">Monthly reports and ROI analysis for your programs</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">Meet Our Account Management Team</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-6 border border-gray-200 rounded-lg">
              <div className="w-20 h-20 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-2xl">👩‍💼</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Sarah Chen</h3>
              <p className="text-gray-600 text-sm mb-2">Senior Account Manager</p>
              <p className="text-gray-700 text-sm">Enterprise clients, technology sector specialization</p>
            </div>
            <div className="text-center p-6 border border-gray-200 rounded-lg">
              <div className="w-20 h-20 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-2xl">👨‍💼</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Michael Rodriguez</h3>
              <p className="text-gray-600 text-sm mb-2">Corporate Account Director</p>
              <p className="text-gray-700 text-sm">Fortune 500 companies, strategic partnerships</p>
            </div>
            <div className="text-center p-6 border border-gray-200 rounded-lg">
              <div className="w-20 h-20 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-2xl">👩‍💼</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Emma Thompson</h3>
              <p className="text-gray-600 text-sm mb-2">Client Success Manager</p>
              <p className="text-gray-700 text-sm">Mid-market companies, healthcare and finance</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Communication Preferences</h2>
            <div className="space-y-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-2">Regular Check-ins</h3>
                <p className="text-gray-600 text-sm mb-2">Weekly, monthly, or quarterly</p>
                <p className="text-gray-700">Scheduled calls to review performance and upcoming needs</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-2">Instant Updates</h3>
                <p className="text-gray-600 text-sm mb-2">Email, Slack, or Teams integration</p>
                <p className="text-gray-700">Real-time notifications on order status and changes</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-2">Emergency Contact</h3>
                <p className="text-gray-600 text-sm mb-2">24/7 hotline for urgent issues</p>
                <p className="text-gray-700">Direct manager phone line for time-sensitive matters</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Success Metrics</h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                <span className="text-gray-900 font-medium">Customer Satisfaction</span>
                <span className="text-green-600 font-bold">98.5%</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                <span className="text-gray-900 font-medium">On-Time Delivery</span>
                <span className="text-blue-600 font-bold">99.2%</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
                <span className="text-gray-900 font-medium">Issue Resolution</span>
                <span className="text-purple-600 font-bold">&lt; 4 hours</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-yellow-50 rounded-lg">
                <span className="text-gray-900 font-medium">Cost Savings</span>
                <span className="text-yellow-600 font-bold">15-25%</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg p-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6 text-center">Connect with Your Account Manager</h2>
          <div className="text-center">
            <p className="text-gray-700 mb-6">
              Ready to experience personalized corporate gifting support? Connect with one of our dedicated account managers today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-elegant-gold text-white px-8 py-3 rounded-md hover:bg-opacity-90 transition-colors font-semibold">
                Request Account Manager
              </button>
              <button className="border border-elegant-gold text-elegant-gold px-8 py-3 rounded-md hover:bg-elegant-gold hover:text-white transition-colors font-semibold">
                Schedule Introduction Call
              </button>
            </div>
            <div className="mt-6 text-center">
              <p className="text-gray-600 text-sm">
                Account Management Hotline: <span className="font-semibold">(555) 123-4567 ext. 3</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}