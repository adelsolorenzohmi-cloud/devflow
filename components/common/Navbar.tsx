'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface NavItem {
    href: string;
    label: string;
}

const NAV_ITEMS: NavItem[] = [
    { href: '/', label: 'Home' },
    { href: '/dashboard', label: 'Dashboard' },
    { href: '/dashboard/board', label: 'Kanban Board' },
];

export default function Navbar() {
    const pathname = usePathname();

    return (
        <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur">
            <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
                <Link href="/" className="flex items-center gap-2.5">
                    <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-sm font-bold text-white">
                        DF
                    </span>
                    <span className="text-lg font-bold tracking-tight text-slate-900">DevFlow</span>
                </Link>

                <nav aria-label="Primary Navigation" className="flex items-center gap-1 sm:gap-2">
                    {NAV_ITEMS.map((item) => {
                        const isActive =
                            item.href === '/' ? pathname === '/' : pathname.startsWith(item.href);

                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${isActive
                                    ? 'bg-blue-50 text-blue-700'
                                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                                    }`}
                            >
                                {item.label}
                            </Link>
                        );
                    })}
                </nav>
            </div>
        </header>
    );
}