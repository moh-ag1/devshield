import React from 'react';

export default function TermsPage() {
  return (
    <div className="max-w-3xl mx-auto py-20 px-6">
      <h1 className="text-3xl font-bold mb-8">Terms of Service</h1>
      <div className="space-y-6 text-gray-600">
        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">1. Not Legal Advice</h2>
          <p>DevShield provides AI-generated analysis of contracts. This is NOT legal advice. We are not a law firm and do not provide attorney-client relationships.</p>
        </section>
        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">2. User Responsibility</h2>
          <p>You are solely responsible for the documents you upload and the decisions you make based on our analysis.</p>
        </section>
        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">3. Limitation of Liability</h2>
          <p>DevShield shall not be liable for any losses resulting from the use of our AI-powered suggestions.</p>
        </section>
      </div>
    </div>
  );
}
