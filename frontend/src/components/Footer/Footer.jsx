import { Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-pink-100 bg-white/80">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-4 py-6 text-center text-sm text-gray-500 sm:flex-row sm:text-left sm:px-6 lg:px-8">
        <p>Made for the moments worth keeping.</p>
        <p className="inline-flex items-center gap-1.5">
          With <Heart className="h-4 w-4 fill-current text-pink-500" aria-label="love" />
        </p>
      </div>
    </footer>
  );
}
