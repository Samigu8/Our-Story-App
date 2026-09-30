import { useEffect, useState } from 'react';
import { Heart, Plus, MoreVertical, Pencil, Trash2, X } from 'lucide-react';
import { API_URL } from './config';

function LoveNote({ note, onEdit, onDelete }) {
  return (
    <div className={`bg-gradient-to-br ${note.color} rounded-3xl p-6 shadow-md hover:shadow-xl transition-all hover:-translate-y-1 duration-300 relative`}>
      <button className="absolute top-4 right-4 p-2 rounded-full hover:bg-white/20 text-white transition-colors" aria-label="Note actions">
        <MoreVertical className="w-4 h-4" />
      </button>

      <div className="absolute top-12 right-4 flex gap-2">
        <button
          onClick={() => onEdit(note)}
          className="p-2 rounded-full bg-white/20 hover:bg-white/35 text-white transition-colors"
          aria-label={`Edit note from ${note.author}`}
        >
          <Pencil className="w-4 h-4" />
        </button>
        <button
          onClick={() => onDelete(note.id)}
          className="p-2 rounded-full bg-white/20 hover:bg-white/35 text-white transition-colors"
          aria-label={`Delete note from ${note.author}`}
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
      
      <div className="flex items-start gap-3 mb-4">
        <Heart className="w-6 h-6 text-white fill-white flex-shrink-0 mt-1" />
        <p className="text-white leading-relaxed italic text-lg">
          "{note.message}"
        </p>
      </div>
      
      <div className="flex justify-between items-center mt-6 pt-4 border-t border-white/30">
        <p className="text-white/90">{note.author}</p>
        <p className="text-white/70 text-sm">{note.date}</p>
      </div>
    </div>
  );
}

export default function LoveNotes() {
  const datePattern = /^(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec) (0?[1-9]|[12][0-9]|3[01]), \d{4}$/;

  const colorOptions = [
    { label: 'Pink', value: 'from-pink-400 to-rose-400' },
    { label: 'Purple', value: 'from-purple-400 to-indigo-400' },
    { label: 'Blue', value: 'from-blue-400 to-cyan-400' },
    { label: 'Indigo', value: 'from-indigo-400 to-purple-400' },
    { label: 'Rose', value: 'from-rose-400 to-pink-400' },
    { label: 'Soft Pink', value: 'from-pink-400 to-purple-400' },
    { label: 'Sky', value: 'from-cyan-400 to-blue-400' },
  ];

  const [notes, setNotes] = useState([]);
  const [isWriting, setIsWriting] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [statusMessage, setStatusMessage] = useState('');
  const [formErrors, setFormErrors] = useState({});
  const [form, setForm] = useState({
    message: '',
    author: '',
    date: '',
    color: colorOptions[0].value,
  });

  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    try {
      const response = await fetch(`${API_URL}/lovenotes`);
      if (!response.ok) {
        setStatusMessage('Unable to load love notes right now.');
        return;
      }
      const data = await response.json();
      setNotes(Array.isArray(data) ? data : []);
    } catch {
      setStatusMessage('Unable to load love notes right now. Please try again.');
    }
  };

  const validateForm = () => {
    const errors = {};
    const message = form.message.trim();
    const author = form.author.trim();
    const date = form.date.trim();

    if (!message) {
      errors.message = 'Message is required.';
    } else if (message.length > 400) {
      errors.message = 'Message must be 400 characters or fewer.';
    }

    if (!author) {
      errors.author = 'Author is required.';
    } else if (author.length > 40) {
      errors.author = 'Author must be 40 characters or fewer.';
    }

    if (!date) {
      errors.date = 'Date is required.';
    } else if (!datePattern.test(date)) {
      errors.date = 'Date must use format Mon D, YYYY (example: Apr 8, 2024).';
    }

    if (!form.color) {
      errors.color = 'Color is required.';
    }

    return errors;
  };

  const parseMessage = async (response, fallback) => {
    try {
      const payload = await response.json();
      if (payload?.errors && typeof payload.errors === 'object') {
        setFormErrors(payload.errors);
      }
      if (payload?.message) {
        return payload.message;
      }
    } catch {
      // Keep fallback for non-JSON responses.
    }
    return fallback;
  };

  const resetForm = () => {
    setForm({ message: '', author: '', date: '', color: colorOptions[0].value });
    setFormErrors({});
    setIsWriting(false);
    setEditingId(null);
  };

  const submitNote = async (event) => {
    event.preventDefault();
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      setStatusMessage('Please correct the form before saving.');
      return;
    }

    const isEdit = editingId !== null;
    const endpoint = isEdit ? `${API_URL}/lovenotes/${editingId}` : `${API_URL}/lovenotes`;
    const method = isEdit ? 'PUT' : 'POST';

    try {
      const response = await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: form.message.trim(),
          author: form.author.trim(),
          date: form.date.trim(),
          color: form.color,
        }),
      });

      if (!response.ok) {
        const message = await parseMessage(response, 'Unable to save love note.');
        setStatusMessage(message);
        return;
      }

      await fetchNotes();
      resetForm();
      setStatusMessage(isEdit ? 'Love note updated.' : 'Love note added.');
    } catch {
      setStatusMessage('Unable to save love note right now. Please try again.');
    }
  };

  const startCreate = () => {
    resetForm();
    setIsWriting(true);
  };

  const startEdit = (note) => {
    setEditingId(note.id);
    setIsWriting(false);
    setForm({
      message: note.message,
      author: note.author,
      date: note.date,
      color: note.color,
    });
    setFormErrors({});
    setStatusMessage('');
  };

  const deleteNote = async (id) => {
    try {
      const response = await fetch(`${API_URL}/lovenotes/${id}`, { method: 'DELETE' });
      if (!response.ok) {
        const message = await parseMessage(response, 'Unable to delete love note.');
        setStatusMessage(message);
        return;
      }

      setNotes((prev) => prev.filter((note) => note.id !== id));
      if (editingId === id) {
        resetForm();
      }
      setStatusMessage('Love note deleted.');
    } catch {
      setStatusMessage('Unable to delete love note right now.');
    }
  };

  const showForm = isWriting || editingId !== null;

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 via-purple-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Page Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <Heart className="w-12 h-12 text-pink-500 fill-pink-500" />
          </div>
          <h1 className="text-3xl sm:text-4xl text-gray-800 mb-4">Love Notes</h1>
          <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto mb-8">
            Sweet messages and heartfelt words we've shared with each other
          </p>
          
          {/* Add New Note Button */}
          <button
            onClick={startCreate}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-gradient-to-r from-pink-500 to-rose-500 text-white px-8 py-3 rounded-full hover:from-pink-600 hover:to-rose-600 transition-all hover:shadow-lg hover:-translate-y-0.5"
          >
            <Plus className="w-5 h-5" />
            Write a Love Note
          </button>
        </div>

        {statusMessage && <p className="text-center mb-6 text-gray-700" role="status">{statusMessage}</p>}

        {showForm && (
          <form onSubmit={submitNote} className="bg-white rounded-2xl p-4 sm:p-6 shadow-md mb-8 max-w-3xl mx-auto">
            <h2 className="text-xl sm:text-2xl text-gray-800 mb-4">{editingId !== null ? 'Edit Love Note' : 'New Love Note'}</h2>

            <label className="text-gray-700 block">
              Message
              <textarea
                className="mt-1 w-full rounded-xl border border-gray-300 p-3 placeholder:text-gray-400"
                rows="4"
                value={form.message}
                onChange={(e) => {
                  setForm((prev) => ({ ...prev, message: e.target.value }));
                  setFormErrors((prev) => ({ ...prev, message: '' }));
                }}
                placeholder="Example: You make every day brighter."
              />
            </label>
            {formErrors.message && <p className="text-red-600 mt-1" role="alert">{formErrors.message}</p>}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <label className="text-gray-700">
                Author
                <input
                  className="mt-1 w-full rounded-xl border border-gray-300 p-3 placeholder:text-gray-400"
                  type="text"
                  value={form.author}
                  onChange={(e) => {
                    setForm((prev) => ({ ...prev, author: e.target.value }));
                    setFormErrors((prev) => ({ ...prev, author: '' }));
                  }}
                  placeholder="Example: From Me"
                />
              </label>

              <label className="text-gray-700">
                Date
                <input
                  className="mt-1 w-full rounded-xl border border-gray-300 p-3 placeholder:text-gray-400"
                  type="text"
                  value={form.date}
                  onChange={(e) => {
                    setForm((prev) => ({ ...prev, date: e.target.value }));
                    setFormErrors((prev) => ({ ...prev, date: '' }));
                  }}
                  placeholder="Example: Mar 26, 2026"
                />
              </label>
            </div>
            {formErrors.author && <p className="text-red-600 mt-1" role="alert">{formErrors.author}</p>}
            {formErrors.date && <p className="text-red-600 mt-1" role="alert">{formErrors.date}</p>}

            <label className="text-gray-700 block mt-4">
              Card Color
              <select
                className="mt-1 w-full rounded-xl border border-gray-300 p-3"
                value={form.color}
                onChange={(e) => {
                  setForm((prev) => ({ ...prev, color: e.target.value }));
                  setFormErrors((prev) => ({ ...prev, color: '' }));
                }}
              >
                {colorOptions.map((option) => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            </label>
            {formErrors.color && <p className="text-red-600 mt-1" role="alert">{formErrors.color}</p>}

            <div className="mt-5 flex flex-col sm:flex-row gap-3">
              <button type="submit" className="w-full sm:w-auto bg-pink-500 text-white px-5 py-2 rounded-full hover:bg-pink-600">Save Note</button>
              <button
                type="button"
                onClick={() => {
                  resetForm();
                  setStatusMessage('');
                }}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-gray-200 text-gray-700 px-5 py-2 rounded-full hover:bg-gray-300"
              >
                <X className="w-4 h-4" />
                Cancel
              </button>
            </div>
          </form>
        )}

        {/* Love Notes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {notes.map((note) => (
            <LoveNote
              key={note.id}
              note={note}
              onEdit={startEdit}
              onDelete={deleteNote}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
