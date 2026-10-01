import { createElement } from 'react';
import { Heart, ShieldCheck, Sparkles } from 'lucide-react';

const principles = [
  { icon: Heart, title: 'Personal', text: 'A private place for the stories that matter most.' },
  { icon: Sparkles, title: 'Thoughtful', text: 'Small details help every memory feel like yours.' },
  { icon: ShieldCheck, title: 'Built to last', text: 'Your timeline, photos, and notes stay organized together.' },
];

export default function About() {
  return (
    <section className="min-h-screen bg-gradient-to-b from-pink-50 via-white to-blue-50 px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl text-center">
        <p className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-pink-600">Our Story</p>
        <h1 className="text-4xl font-semibold text-gray-900 sm:text-5xl">A home for the moments between us.</h1>
        <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-gray-600">
          Keep the milestones, snapshots, and little notes that turn a relationship into a story you can revisit.
        </p>
        <div className="mt-12 grid gap-5 text-left md:grid-cols-3">
          {principles.map((principle) => (
            <article key={principle.title} className="rounded-2xl border border-white bg-white/80 p-6 shadow-sm">
              {createElement(principle.icon, { className: 'mb-5 h-6 w-6 text-pink-500', 'aria-hidden': true })}
              <h2 className="text-lg font-semibold text-gray-900">{principle.title}</h2>
              <p className="mt-2 text-sm leading-6 text-gray-600">{principle.text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
