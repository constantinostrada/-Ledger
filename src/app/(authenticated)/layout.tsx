'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@interfaces/web/AuthContext';

export default function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { status, user, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.replace('/login');
    }
  }, [status, router]);

  if (status !== 'authenticated') {
    return <main className="page-loading">Loading…</main>;
  }

  return (
    <>
      <header className="app-header">
        <Link href="/dashboard" className="app-brand">
          Ledger
        </Link>
        <div className="app-header-user">
          <span>{user?.name ?? user?.email}</span>
          <button
            type="button"
            className="button-secondary"
            onClick={() => {
              logout();
              router.replace('/login');
            }}
          >
            Log out
          </button>
        </div>
      </header>
      <main className="app-main">{children}</main>
    </>
  );
}
