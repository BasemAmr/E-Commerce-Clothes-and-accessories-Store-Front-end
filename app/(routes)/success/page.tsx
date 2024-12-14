import { Suspense } from 'react';
import SuccessClient from './components/success-client';

export default async function SuccessPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto">
            <Suspense   fallback={<div>Loading...</div>}>
                <SuccessClient />
            </Suspense>
        </div>
      </div>
    </div>
  );
}