import ContactForm from '@/components/forms/ContactForm';
import { Mail, Github, Linkedin } from 'lucide-react';

export const metadata = {
  title: 'Contact | asixstud.io',
  description: 'Get in touch with us about our projects',
};

export default function Contact() {
  return (
    <div className="min-h-screen pt-20 pb-20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-16">
          <h1 className="text-5xl font-bold text-slate-900 dark:text-white mb-4">Get in Touch</h1>
          <p className="text-xl text-slate-600 dark:text-slate-400">
            Have a question or want to collaborate? We'd love to hear from you.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-12">
          {/* Contact Form */}
          <div className="md:col-span-2">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-8">Send us a message</h2>
            <ContactForm />
          </div>

          {/* Contact Info */}
          <div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-8">Other ways to reach us</h2>

            <div className="space-y-6">
              {/* Email */}
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <Mail size={20} className="text-slate-600 dark:text-slate-400" />
                  <h3 className="font-semibold text-slate-900 dark:text-white">Email</h3>
                </div>
                <a
                  href="mailto:hello@asixstud.io"
                  className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
                >
                  hello@asixstud.io
                </a>
              </div>

              {/* GitHub */}
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <Github size={20} className="text-slate-600 dark:text-slate-400" />
                  <h3 className="font-semibold text-slate-900 dark:text-white">GitHub</h3>
                </div>
                <a
                  href="https://github.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
                >
                  Visit our GitHub
                </a>
              </div>

              {/* LinkedIn */}
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <Linkedin size={20} className="text-slate-600 dark:text-slate-400" />
                  <h3 className="font-semibold text-slate-900 dark:text-white">LinkedIn</h3>
                </div>
                <a
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
                >
                  Connect on LinkedIn
                </a>
              </div>

              {/* Response Time */}
              <div className="p-4 bg-blue-50 dark:bg-blue-950 rounded-lg border border-blue-200 dark:border-blue-800">
                <p className="text-sm text-blue-900 dark:text-blue-100">
                  We typically respond to messages within 24 hours.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
