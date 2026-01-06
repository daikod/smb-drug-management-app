import Link from "next/link";

export default async function Home() {
  return (
    <div className="min-h-screen bg-linear-to-br from-brown-150 to-brown-250 flex flex-col justify-between">
      {/* 🔹 Existing Hero Section */}
      <div className="grow flex items-center justify-center">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center">
            <h1 className="text-5xl font-bold text-gray-900 mb-6">
              SM Balgwe Drug Management Application
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Streamline your drug inventory and supply tracking with our powerful,
              easy-to-use management system. Track drugs, monitor stock levels, and
              gain valuable insights.
            </p>
            <div className="flex gap-4 justify-center">
              <Link
                href="/sign-in"
                className="bg-[#2E7D32] text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
              >
                Sign In
              </Link>
              <Link
                href="/learn-more"
                className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold border-2 border-blue-600 hover:bg-blue-50 transition-colors"
              >
                Learn More
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* 🔹 AI Benefits Section - Lower Half */}
      <section className="bg-gray-50 py-16 border-t">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-10">
            Why AI-Driven Drug Inventory Management?
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Reduced Waste */}
            <div className="p-6 rounded-xl shadow-md border-l-4" style={{ borderColor: "#2E7D32" }}>
              <h3 className="text-xl font-semibold mb-2 text-[#2E7D32]">
                Reduced Waste & Expiry
              </h3>
              <p className="text-gray-700">
                AI predicts drug usage based on hospital trends, preventing expiry-related losses
                across Plateau State facilities.
              </p>
            </div>

            {/* Stock Alerts */}
            <div className="p-6 rounded-xl shadow-md border-l-4" style={{ borderColor: "#0056A6" }}>
              <h3 className="text-xl font-semibold mb-2 text-[#0056A6]">
                Real-Time Stock Alerts
              </h3>
              <p className="text-gray-700">
                Automated alerts ensure essential medicines never run out, especially in remote LGAs.
              </p>
            </div>

            {/* Cost Optimization */}
            <div className="p-6 rounded-xl shadow-md border-l-4" style={{ borderColor: "#C8A327" }}>
              <h3 className="text-xl font-semibold mb-2 text-[#C8A327]">
                Cost Optimization
              </h3>
              <p className="text-gray-700">
                AI forecasting helps health facilities optimize budgets through efficient procurement.
              </p>
            </div>

            {/* Accountability */}
            <div className="p-6 rounded-xl shadow-md border-l-4" style={{ borderColor: "#2E7D32" }}>
              <h3 className="text-xl font-semibold mb-2 text-[#2E7D32]">
                Increased Accountability
              </h3>
              <p className="text-gray-700">
                Real-time tracking helps reduce diversion, misuse, and ensures proper drug handling.
              </p>
            </div>

            {/* Regulatory Compliance */}
            <div className="p-6 rounded-xl shadow-md border-l-4" style={{ borderColor: "#0056A6" }}>
              <h3 className="text-xl font-semibold mb-2 text-[#0056A6]">
                Compliance & Reporting
              </h3>
              <p className="text-gray-700">
                Supports compliance with NAFDAC, NHIS and Plateau State Ministry of Health regulations.
              </p>
            </div>

            {/* Central Oversight */}
            <div className="p-6 rounded-xl shadow-md border-l-4" style={{ borderColor: "#C8A327" }}>
              <h3 className="text-xl font-semibold mb-2 text-[#C8A327]">
                Central Oversight
              </h3>
              <p className="text-gray-700">
                Enables centralized monitoring of hospitals, clinics & pharmacies by state authorities.
              </p>
            </div>
          </div>

          {/* Call to Action */}
          <div className="text-center mt-12">
            <Link
              href="/sign-in"
              className="px-6 py-3 bg-[#2E7D32] text-white rounded-lg shadow hover:bg-green-800 transition"
            >
              Get Started with AI Drug Inventory Management
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
