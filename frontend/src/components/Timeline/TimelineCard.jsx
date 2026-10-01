import { Calendar, Edit, Trash2 } from 'lucide-react';

export default function TimelineCard({ event, onEdit, onDelete, index = 0 }) {
  return (
    <div className="timeline-card bg-white rounded-2xl shadow-md hover:shadow-lg transition-shadow overflow-hidden" style={{ animationDelay: `${index * 70}ms` }}>
      {event.imageUrl ? (
        <img src={event.imageUrl} alt={event.title} className="aspect-video w-full object-cover" />
      ) : (
        <div className="aspect-video bg-gradient-to-br from-pink-200 via-purple-200 to-blue-200 flex items-center justify-center">
          <Calendar className="w-16 h-16 text-white opacity-60" />
        </div>
      )}
      <div className="p-6">
        <div className="flex justify-between items-start mb-3">
          <h3 className="text-xl text-gray-800">{event.title}</h3>
          <div className="flex gap-2">
            <button onClick={() => onEdit(event)} className="p-2 rounded-full hover:bg-blue-50 text-blue-500 transition-colors" aria-label={`Edit ${event.title}`}>
              <Edit className="w-4 h-4" />
            </button>
            <button onClick={() => onDelete(event.id)} className="p-2 rounded-full hover:bg-red-50 text-red-500 transition-colors" aria-label={`Delete ${event.title}`}>
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
        <p className="text-sm text-pink-500 mb-3">{event.date}</p>
        <p className="text-gray-600 leading-relaxed">{event.description}</p>
      </div>
    </div>
  );
}
