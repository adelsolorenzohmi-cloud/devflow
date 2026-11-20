import React from 'react';
import Link from 'next/link';

interface FeatureHighlight {
  title: string;
  description: string;
}

const FEATURES: FeatureHighlight[] = [
  {
    title: 'Sprint & Milestone Tracking',
    description:
      'Plan sprints with clear start and end dates and monitor live task completion across your team.',
  },
  {
    title: 'Four-Stage Kanban Board',
    description:
      'Move tasks smoothly through To Do, In Progress, Under Review, and Done while filtering by priority or sprint.',
  },
  {
    title: 'Built for Small Dev Teams',
    description:
      'Keep tasks focused and clear without heavy enterprise clutter so student pairs and small squads ship on time.',
  },
];

export default function HomePage() {
  return (
    <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col justify-center px-4 py-12 sm:px-6 lg:px-8">
      <section className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm sm:p-12">
        <span className="inline-block rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
          DevFlow v0.1 • Sprint &amp; Task Tracker
        </span>

        <h1 className="mt-4 max-w-3xl text-3xl font-bold tracking-tight text-slate-900 sm:text-5xl">
          Simple sprint and task tracking for small development teams.
        </h1>

        <p className="mt-4 max-w-2xl text-base leading-relaxed text-slate-600 sm:text-lg">
          Organize sprints, create and assign tasks, update progress across columns, and filter by
          priority in one fast workspace.
        </p>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href="/dashboard/board"
            className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-blue-700"
          >
            Open Kanban Board
          </Link>
          <Link
            href="/dashboard"
            className="rounded-lg border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50"
          >
            View Sprint Dashboard
          </Link>
        </div>
      </section>

      <section aria-label="Key Features" className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-3">
        {FEATURES.map((feature) => (
          <div
            key={feature.title}
            className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
          >
            <h2 className="text-base font-semibold text-slate-900">{feature.title}</h2>
            <p className="mt-2 text-sm leading-relaxed text-slate-600">{feature.description}</p>
          </div>
        ))}
      </section>
    </main>
  );
}