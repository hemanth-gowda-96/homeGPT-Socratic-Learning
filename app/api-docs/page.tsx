'use client';

import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
import 'swagger-ui-react/swagger-ui.css';

const SwaggerUI = dynamic(() => import('swagger-ui-react'), { ssr: false });

export default function ApiDocsPage() {
  const [spec, setSpec] = useState(null);

  useEffect(() => {
    const fetchSpec = async () => {
      try {
        const response = await fetch('/api/swagger');
        const swaggerSpec = await response.json();
        setSpec(swaggerSpec);
      } catch (error) {
        console.error('Failed to fetch Swagger spec:', error);
      }
    };

    fetchSpec();
  }, []);

  if (!spec) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading API Documentation...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <header className="bg-blue-600 text-white py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold">homeGPT API Documentation</h1>
          <p className="mt-2 text-blue-100">
            Explore and test the homeGPT Socratic Learning API endpoints
          </p>
        </div>
      </header>
      
      <div className="max-w-7xl mx-auto py-8">
        <SwaggerUI 
          spec={spec as any} 
          tryItOutEnabled={true}
          displayRequestDuration={true}
          docExpansion="list"
          defaultModelsExpandDepth={2}
          displayOperationId={false}
          filter={true}
        />
      </div>
    </div>
  );
}