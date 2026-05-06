'use client';

import { useState } from 'react';
import { Navbar } from './Navbar';
import { LoginModal } from './LoginModal';

export function NavbarWithModal() {
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  return (
    <>
      <Navbar onLoginClick={() => setIsLoginOpen(true)} />
      <LoginModal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />
    </>
  );
}
