import Link from 'next/link';
import { Github, Linkedin, Twitter, Mail } from 'lucide-react';
import { SOCIAL_LINKS } from '@/lib/project-config';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const socialIcons: { [key: string]: any } = {
    Github,
    Linkedin,
    Twitter,
    Mail,
  };

  return (
    <footer className="bg-slate-950 dark:bg-slate-900 text-white border-t border-slate-800">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Brand */}
          <div>
            <h3 className="text-lg font-bold mb-2">asixstud.io</h3>
            <p className="text-slate-400 text-sm">A hub for innovative webapps and projects</p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="text-slate-400 hover:text-white transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-slate-400 hover:text-white transition-colors">
                  About
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-slate-400 hover:text-white transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Social Links */}
          <div>
            <h4 className="font-semibold mb-4">Connect</h4>
            <div className="flex gap-4">
              {SOCIAL_LINKS.map((link) => {
                const Icon = socialIcons[link.icon];
                return (
                  <a
                    key={link.name}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-slate-400 hover:text-white transition-colors"
                    aria-label={link.name}
                  >
                    <Icon size={20} />
                  </a>
                );
              })}
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-slate-800 pt-8">
          <p className="text-center text-slate-400 text-sm">
            © {currentYear} asixstud.io. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
