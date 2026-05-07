export default function WritingDiagnosticPage() {
  return (
    <main className="px-6 py-12 max-w-4xl mx-auto">

      {/* BACK */}
      <p className="mb-6 text-gray-500">← All Diagnostics</p>

      {/* TITLE */}
      <h1 className="text-4xl font-serif text-navy-800 mb-4">
        Writing Diagnostic
      </h1>

      <p className="text-lg text-gray-600 mb-6">
        Detailed analysis of your writing based on Cambridge criteria.
      </p>

      {/* PRICE */}
      <div className="bg-yellow-100 text-yellow-700 text-3xl font-bold px-6 py-4 rounded-xl mb-10">
        $15 USD
      </div>

      {/* WHAT IT COVERS */}
      <h2 className="text-2xl font-semibold mb-4">What It Covers</h2>

      <ul className="mb-12 space-y-2 text-gray-700">
        <li>• Essay</li>
        <li>• Letter / Email</li>
        <li>• Review</li>
        <li>• Report</li>
        <li>• Article</li>
      </ul>

      {/* STEP 1 */}
      <div className="text-center mt-12">

        <p className="text-lg font-medium text-navy-700 mb-4">
          Step 1 — Complete your payment
        </p>

        <a
          href="https://paypal.me/pharosenglish/15"
          target="_blank"
          className="inline-block px-10 py-5 bg-yellow-500 text-white rounded-xl font-semibold text-lg hover:scale-105 transition"
        >
          Pay with PayPal
        </a>

      </div>

      {/* STEP 2 */}
      <div className="text-center mt-16">

        <p className="text-lg font-medium text-navy-700 mb-2">
          Step 2 — Submit your writing
        </p>

        <p className="text-sm text-gray-600 mb-6">
          After payment, upload your writing using the form below
        </p>

        <a
          href="https://docs.google.com/forms/d/e/1FAIpQLScNBspnvsQBaZovkv_ADSilTJiZ6RelDhaL46G_W_DhyHozkQ/viewform?usp=header"
          target="_blank"
          className="inline-block px-10 py-5 bg-navy-700 text-white rounded-xl font-semibold text-lg hover:scale-105 transition"
        >
          Submit your writing
        </a>

      </div>

    </main>
  );
}