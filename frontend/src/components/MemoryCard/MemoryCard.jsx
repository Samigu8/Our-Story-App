import { Image as ImageIcon, Trash2 } from 'lucide-react';

export default function MemoryCard({ photo, index, onDelete }) {
  const gradients = [
    'from-pink-300 to-rose-300',
    'from-purple-300 to-indigo-300',
    'from-blue-300 to-cyan-300',
    'from-pink-300 to-purple-300',
    'from-purple-300 to-blue-300',
    'from-rose-300 to-pink-300',
  ];

  return (
    <div className="group relative bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all hover:-translate-y-1 duration-300">
      <button onClick={() => onDelete(photo.id)} className="absolute top-3 right-3 z-10 p-2 rounded-full bg-white/80 hover:bg-white text-red-500 transition-colors" aria-label={`Delete ${photo.caption}`}>
        <Trash2 className="w-4 h-4" />
      </button>
      {photo.imageUrl ? (
        <img src={photo.imageUrl} alt={photo.caption || 'Memory photo'} className="aspect-square w-full object-cover" />
      ) : (
        <div className={`aspect-square bg-gradient-to-br ${gradients[index % gradients.length]} flex items-center justify-center`}>
          <ImageIcon className="w-16 h-16 text-white opacity-60" />
        </div>
      )}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4 opacity-0 group-hover:opacity-100 transition-opacity">
        <p className="text-white text-sm">{photo.caption}</p>
      </div>
      <div className="p-3 md:hidden">
        <p className="text-gray-600 text-sm">{photo.caption}</p>
      </div>
    </div>
  );
}
