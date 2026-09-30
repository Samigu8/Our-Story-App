import { Link, useLocation } from 'react-router-dom';
import { Heart } from 'lucide-react';

export default function Navbar() {
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="bg-white border-b border-pink-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-3 sm:py-0 sm:h-16 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 sm:gap-0">
          <Link to="/" className="flex items-center gap-2 text-pink-500 hover:text-pink-600 transition-colors self-start sm:self-auto">
            <Heart className="w-5 h-5 sm:w-6 sm:h-6 fill-current" />
            <span className="font-semibold text-base sm:text-lg">Our Story</span>
          </Link>
          
          <div className="w-full sm:w-auto overflow-x-auto">
            <div className="flex gap-2 sm:gap-4 min-w-max">
            <Link
              to="/"
              className={`px-3 sm:px-4 py-2 rounded-full text-sm sm:text-base whitespace-nowrap transition-colors ${
                isActive('/')
                  ? 'bg-pink-100 text-pink-600'
                  : 'text-gray-600 hover:text-pink-500 hover:bg-pink-50'
              }`}
            >
              Home
            </Link>
            <Link
              to="/timeline"
              className={`px-3 sm:px-4 py-2 rounded-full text-sm sm:text-base whitespace-nowrap transition-colors ${
                isActive('/timeline')
                  ? 'bg-pink-100 text-pink-600'
                  : 'text-gray-600 hover:text-pink-500 hover:bg-pink-50'
              }`}
            >
              Timeline
            </Link>
            <Link
              to="/memories"
              className={`px-3 sm:px-4 py-2 rounded-full text-sm sm:text-base whitespace-nowrap transition-colors ${
                isActive('/memories')
                  ? 'bg-pink-100 text-pink-600'
                  : 'text-gray-600 hover:text-pink-500 hover:bg-pink-50'
              }`}
            >
              Memories
            </Link>
            <Link
              to="/lovenotes"
              className={`px-3 sm:px-4 py-2 rounded-full text-sm sm:text-base whitespace-nowrap transition-colors ${
                isActive('/lovenotes')
                  ? 'bg-pink-100 text-pink-600'
                  : 'text-gray-600 hover:text-pink-500 hover:bg-pink-50'
              }`}
            >
              Love Notes
            </Link>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
