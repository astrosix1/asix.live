'use client';

import Link from 'next/link';

export default function AdminPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-4xl font-bold mb-8 text-gray-900">Admin Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link
          href="/admin/projects"
          className="block p-6 bg-white rounded-lg shadow hover:shadow-lg transition-shadow cursor-pointer"
        >
          <h2 className="text-2xl font-bold mb-2 text-gray-900">Manage Projects</h2>
          <p className="text-gray-600">Add, edit, or remove projects from your portfolio</p>
        </Link>

        <div className="p-6 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
          <h2 className="text-2xl font-bold mb-2 text-gray-900">More Options</h2>
          <p className="text-gray-600">User management, analytics, and more coming soon</p>
        </div>
      </div>
    </div>
  );
}
