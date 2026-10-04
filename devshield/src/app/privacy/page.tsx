import React from 'react';

export default function PrivacyPage() {
  return (
    <div className="max-w-3xl mx-auto py-20 px-6">
      <h1 className="text-3xl font-bold mb-8">Privacy Policy</h1>
      <div className="space-y-6 text-gray-600">
        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">1. Data Collection</h2>
          <p>We collect only the information necessary to provide our service, including your email and the contract files you upload for analysis.</p>
        </section>
        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">2. Data Usage</h2>
          <p>Your contracts are processed by AI models to generate reports. We do not sell your personal data or contract contents to third parties.</p>
        </section>
        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">3. Security</h2>
          <p>We employ industry-standard encryption to protect your data during transit and at rest.</p>
        </section>
      </div>
    </div>
  );
}
