import { AccountView } from '@neondatabase/auth/react/ui';
import Link from 'next/link';

export const dynamicParams = false;

export function generateStaticParams() {
  return [
    { path: 'settings' },
    { path: 'security' },
    { path: 'sessions' },
  ];
}

export default async function AccountPage({ params }: { params: Promise<{ path: string }> }) {
  const { path } = await params;

  const titles: Record<string, string> = {
    'settings': 'Account Settings',
    'security': 'Security',
    'sessions': 'Active Sessions',
  };

  return (
    <main className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-2xl mx-auto px-4">
        {/* Header with back link */}
        <div className="mb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to calculator
          </Link>
        </div>

        {/* Account card */}
        <div className="bg-white rounded-2xl shadow-xl shadow-gray-200/50 border border-gray-100 p-8">
          <h1 className="text-2xl font-semibold text-gray-900 mb-6">
            {titles[path] || 'Account'}
          </h1>

          <AccountView path={path} />
        </div>
      </div>
    </main>
  );
}
