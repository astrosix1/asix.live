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

        <Link
          href="/admin/blog"
          className="block p-6 bg-white rounded-lg shadow hover:shadow-lg transition-shadow cursor-pointer"
        >
          <h2 className="text-2xl font-bold mb-2 text-gray-900">Manage Blog</h2>
          <p className="text-gray-600">Write, edit, or publish blog posts and announcements</p>
        </Link>

        <Link
          href="/admin/blog/new"
          className="block p-6 bg-blue-600 rounded-lg shadow hover:bg-blue-700 transition-colors cursor-pointer"
        >
          <h2 className="text-2xl font-bold mb-2 text-white">+ New Blog Post</h2>
          <p className="text-blue-100">Jump straight into writing a new post</p>
        </Link>
      </div>
    </div>
  );
}
