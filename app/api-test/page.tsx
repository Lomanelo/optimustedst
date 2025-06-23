'use client';

import { useState } from 'react';

// Force dynamic rendering for this page
export const dynamic = 'force-dynamic';

export default function ApiTestPage() {
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const addResult = (test: string, result: any) => {
    setResults(prev => [...prev, { test, result, timestamp: new Date().toISOString() }]);
  };

  const testEnrollmentAPI = async () => {
    setLoading(true);
    const enrollmentId = '3ad25fcf-529c-429d-acb2-5130d9771039';

    try {
      // Test 1: Basic connection test
      console.log('Testing basic API connection...');
      const testResponse = await fetch(`/api/enrollment/${enrollmentId}?test-connection=true`);
      const testData = await testResponse.json();
      addResult('Connection Test', { 
        status: testResponse.status, 
        ok: testResponse.ok, 
        data: testData 
      });

      // Test 2: Actual enrollment fetch
      console.log('Testing enrollment fetch...');
      const enrollmentResponse = await fetch(`/api/enrollment/${enrollmentId}`);
      const enrollmentData = await enrollmentResponse.json();
      addResult('Enrollment Fetch', { 
        status: enrollmentResponse.status, 
        ok: enrollmentResponse.ok, 
        data: enrollmentData 
      });

    } catch (error) {
      console.error('Test error:', error);
      addResult('Error', { 
        error: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined
      });
    } finally {
      setLoading(false);
    }
  };

  const testFirebaseConnection = async () => {
    try {
      // Test Firebase connection by trying to import it
      const { db } = await import('../../src/firebase/firebase');
      addResult('Firebase Connection', { 
        connected: !!db,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      addResult('Firebase Connection Error', { 
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  };

  const clearResults = () => {
    setResults([]);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">API Testing Page</h1>
        
      <div className="space-y-4 mb-8">
        <button
          onClick={testEnrollmentAPI}
          disabled={loading}
          className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
        >
          {loading ? 'Testing...' : 'Test Enrollment API'}
        </button>
        
        <button
          onClick={testFirebaseConnection}
          className="bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600 ml-4"
        >
          Test Firebase Connection
        </button>
        
          <button
          onClick={clearResults}
          className="bg-red-500 text-white px-6 py-2 rounded hover:bg-red-600 ml-4"
          >
          Clear Results
          </button>
        </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Test Results:</h2>
        {results.length === 0 ? (
          <p className="text-gray-500">No tests run yet.</p>
        ) : (
          results.map((result, index) => (
            <div key={index} className="bg-gray-100 p-4 rounded-lg">
              <h3 className="font-bold text-lg">{result.test}</h3>
              <p className="text-sm text-gray-600 mb-2">{result.timestamp}</p>
              <pre className="bg-white p-2 rounded text-sm overflow-auto">
                {JSON.stringify(result.result, null, 2)}
            </pre>
          </div>
          ))
        )}
      </div>
    </div>
  );
} 