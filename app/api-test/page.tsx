'use client';

import { useState } from 'react';

// Force dynamic rendering for this page
export const dynamic = 'force-dynamic';

export default function ApiTestPage() {
  const [testResult, setTestResult] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  const testApiEndpoint = async () => {
    setIsLoading(true);
    setTestResult('Testing API endpoint...');

    try {
      // Test GET request first
      const getResponse = await fetch('/api/submit-form', {
        method: 'GET',
      });

      const getResult = await getResponse.text();
      console.log('GET Response:', getResult);

      // Test POST request
      const postResponse = await fetch('/api/submit-form', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstName: 'Test',
          lastName: 'User',
          phone: '+966500000000',
          email: 'test@example.com',
          timestamp: new Date().toISOString(),
        }),
      });

      const postResult = await postResponse.text();
      console.log('POST Response:', postResult);

      setTestResult(`
GET Response (${getResponse.status}): ${getResult}

POST Response (${postResponse.status}): ${postResult}
      `);

    } catch (error) {
      console.error('API Test Error:', error);
      setTestResult(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8">API Endpoint Test</h1>
        
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <button
            onClick={testApiEndpoint}
            disabled={isLoading}
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-md disabled:opacity-50"
          >
            {isLoading ? 'Testing...' : 'Test API Endpoint'}
          </button>
        </div>

        {testResult && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Test Results:</h2>
            <pre className="bg-gray-100 p-4 rounded-md overflow-auto text-sm">
              {testResult}
            </pre>
          </div>
        )}

        <div className="bg-white rounded-lg shadow p-6 mt-6">
          <h2 className="text-xl font-semibold mb-4">Debug Information:</h2>
          <div className="space-y-2 text-sm">
            <p><strong>Current URL:</strong> {typeof window !== 'undefined' ? window.location.href : 'Server-side'}</p>
            <p><strong>API URL:</strong> {typeof window !== 'undefined' ? `${window.location.origin}/api/submit-form` : '/api/submit-form'}</p>
            <p><strong>User Agent:</strong> {typeof window !== 'undefined' ? navigator.userAgent : 'Server-side'}</p>
          </div>
        </div>
      </div>
    </div>
  );
} 