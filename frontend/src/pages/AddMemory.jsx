import { Link } from 'react-router-dom';
import { ArrowRight, ImagePlus } from 'lucide-react';

export default function AddMemory() {
  return (
    <section className="min-h-screen bg-gradient-to-b from-pink-50 via-white to-blue-50 px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-2xl rounded-3xl bg-white p-8 text-center shadow-sm sm:p-12">
        <ImagePlus className="mx-auto h-10 w-10 text-pink-500" aria-hidden="true" />
        <h1 className="mt-5 text-3xl font-semibold text-gray-900">Add a memory</h1>
        <p className="mx-auto mt-3 max-w-lg text-gray-600">Upload a photo from the Memories page to keep this moment with the rest of your story.</p>
        <Link to="/memories" className="mt-7 inline-flex items-center gap-2 rounded-full bg-pink-500 px-5 py-3 font-medium text-white transition hover:bg-pink-600">
          Go to Memories <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      </div>
    </section>
  );
}
