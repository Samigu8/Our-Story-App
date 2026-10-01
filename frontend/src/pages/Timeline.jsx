import { useEffect, useState } from 'react';
import { Plus, Save, X } from 'lucide-react';
import { API_URL } from '../services/api';
import TimelineCard from '../components/Timeline/TimelineCard.jsx';

export default function Timeline() {
  const datePattern = /^(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec) (0?[1-9]|[12][0-9]|3[01]), \d{4}$/;

  const [timelineEvents, setTimelineEvents] = useState([]);
  const [statusMessage, setStatusMessage] = useState('');
  const [formErrors, setFormErrors] = useState({});
  const [isCreating, setIsCreating] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [form, setForm] = useState({ title: '', date: '', description: '', imageUrl: '' });

  useEffect(() => {
    fetchTimelineEvents();
  }, []);

  const fetchTimelineEvents = async () => {
    try {
      const response = await fetch(`${API_URL}/timeline`);
      if (!response.ok) {
        setStatusMessage('Unable to load timeline events right now.');
        return;
      }

      const data = await response.json();
      setTimelineEvents(Array.isArray(data) ? data : []);
    } catch {
      setStatusMessage('Unable to load timeline events right now. Please try again.');
    }
  };

  const validateForm = () => {
    const errors = {};
    const title = form.title.trim();
    const date = form.date.trim();
    const description = form.description.trim();

    if (!title) {
      errors.title = 'Title is required.';
    } else if (title.length > 80) {
      errors.title = 'Title must be 80 characters or fewer.';
    }

    if (!date) {
      errors.date = 'Date is required.';
    } else if (!datePattern.test(date)) {
      errors.date = 'Date must use format Mon D, YYYY (example: Apr 8, 2024).';
    }

    if (!description) {
      errors.description = 'Description is required.';
    } else if (description.length > 400) {
      errors.description = 'Description must be 400 characters or fewer.';
    }

    if (form.imageUrl && form.imageUrl.trim().length > 500) {
      errors.imageUrl = 'Image URL must be 500 characters or fewer.';
    }

    return errors;
  };

  const handleFormChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setFormErrors((prev) => ({ ...prev, [field]: '' }));
    setStatusMessage('');
  };

  const resetForm = () => {
    setForm({ title: '', date: '', description: '', imageUrl: '' });
    setSelectedImage(null);
    setIsUploadingImage(false);
    setFormErrors({});
    setIsCreating(false);
    setEditingId(null);
  };

  const uploadImage = async (file, folder) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('folder', folder);

    const uploadResponse = await fetch(`${API_URL}/uploads`, {
      method: 'POST',
      body: formData,
    });

    if (!uploadResponse.ok) {
      const message = await parseMessage(uploadResponse, 'Unable to upload image.');
      throw new Error(message);
    }

    const { fileUrl } = await uploadResponse.json();
    return fileUrl;
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
      // Keep fallback message for non-JSON responses.
    }
    return fallback;
  };

  const submitForm = async (event) => {
    event.preventDefault();

    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      setStatusMessage('Please correct the form before saving.');
      return;
    }

    const isEditMode = editingId !== null;
    const endpoint = isEditMode ? `${API_URL}/timeline/${editingId}` : `${API_URL}/timeline`;
    const method = isEditMode ? 'PUT' : 'POST';

    try {
      let imageUrl = form.imageUrl.trim();
      if (selectedImage) {
        setIsUploadingImage(true);
        imageUrl = await uploadImage(selectedImage, 'timeline');
      }

      const requestBody = {
        title: form.title.trim(),
        date: form.date.trim(),
        description: form.description.trim(),
        imageUrl,
      };

      const response = await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const message = await parseMessage(response, 'Unable to save timeline event.');
        setStatusMessage(message);
        return;
      }

      await fetchTimelineEvents();
      resetForm();
      setStatusMessage(isEditMode ? 'Timeline event updated.' : 'Timeline event added.');
    } catch (error) {
      setStatusMessage(error?.message || 'Unable to save timeline event right now. Please try again.');
    } finally {
      setIsUploadingImage(false);
    }
  };

  const startCreate = () => {
    resetForm();
    setIsCreating(true);
  };

  const startEdit = (event) => {
    setIsCreating(false);
    setEditingId(event.id);
    setForm({
      title: event.title,
      date: event.date,
      description: event.description,
      imageUrl: event.imageUrl || '',
    });
    setSelectedImage(null);
    setFormErrors({});
    setStatusMessage('');
  };

  const cancelForm = () => {
    resetForm();
    setStatusMessage('');
  };

  const deleteEvent = async (id) => {
    try {
      const response = await fetch(`${API_URL}/timeline/${id}`, { method: 'DELETE' });
      if (!response.ok) {
        const message = await parseMessage(response, 'Unable to delete timeline event.');
        setStatusMessage(message);
        return;
      }

      setTimelineEvents((prev) => prev.filter((item) => item.id !== id));
      if (editingId === id) {
        resetForm();
      }
      setStatusMessage('Timeline event deleted.');
    } catch {
      setStatusMessage('Unable to delete timeline event right now.');
    }
  };

  const showForm = isCreating || editingId !== null;

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 via-purple-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Page Header */}
        <div className="text-center mb-8 sm:mb-12">
          <h1 className="text-3xl sm:text-4xl text-gray-800 mb-4">Our Timeline</h1>
          <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto">
            A chronological journey through all the special moments we've shared
          </p>
          <button
            className="mt-6 w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-gradient-to-r from-pink-500 to-purple-500 text-white px-8 py-3 rounded-full hover:from-pink-600 hover:to-purple-600 transition-all hover:shadow-lg hover:-translate-y-0.5"
            onClick={startCreate}
          >
            <Plus className="w-5 h-5" />
            Add Timeline Event
          </button>
        </div>

        {statusMessage && <p className="text-center mb-6 text-gray-700" role="status">{statusMessage}</p>}

        {showForm && (
          <form onSubmit={submitForm} className="bg-white rounded-2xl p-4 sm:p-6 shadow-md mb-8 max-w-3xl mx-auto">
            <h2 className="text-xl sm:text-2xl text-gray-800 mb-4">{editingId !== null ? 'Edit Timeline Event' : 'New Timeline Event'}</h2>
            <div className="grid gap-4">
              <label className="text-gray-700">
                Title
                <input
                  className="mt-1 w-full rounded-xl border border-gray-300 p-3 placeholder:text-gray-400"
                  type="text"
                  value={form.title}
                  onChange={(e) => handleFormChange('title', e.target.value)}
                  placeholder="Example: First Date"
                />
              </label>
              {formErrors.title && <p className="text-red-600" role="alert">{formErrors.title}</p>}

              <label className="text-gray-700">
                Date
                <input
                  className="mt-1 w-full rounded-xl border border-gray-300 p-3 placeholder:text-gray-400"
                  type="text"
                  value={form.date}
                  onChange={(e) => handleFormChange('date', e.target.value)}
                  placeholder="Example: April 8, 2024"
                />
              </label>
              {formErrors.date && <p className="text-red-600" role="alert">{formErrors.date}</p>}

              <label className="text-gray-700">
                Description
                <textarea
                  className="mt-1 w-full rounded-xl border border-gray-300 p-3 placeholder:text-gray-400"
                  rows="4"
                  value={form.description}
                  onChange={(e) => handleFormChange('description', e.target.value)}
                  placeholder="Example: We had coffee and talked for hours."
                />
              </label>
              {formErrors.description && <p className="text-red-600" role="alert">{formErrors.description}</p>}

              <label className="text-gray-700">
                Event Image
                <input
                  className="mt-1 w-full rounded-xl border border-gray-300 p-3"
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0] || null;
                    setSelectedImage(file);
                    setFormErrors((prev) => ({ ...prev, imageUrl: '' }));
                  }}
                />
              </label>
              {form.imageUrl && !selectedImage && (
                <p className="text-sm text-gray-600">Current image is saved. Choose a file only if you want to replace it.</p>
              )}
              {formErrors.imageUrl && <p className="text-red-600" role="alert">{formErrors.imageUrl}</p>}
            </div>

            <div className="mt-5 flex flex-col sm:flex-row gap-3">
              <button type="submit" disabled={isUploadingImage} className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-blue-500 text-white px-5 py-2 rounded-full hover:bg-blue-600 disabled:bg-blue-300">
                <Save className="w-4 h-4" />
                {isUploadingImage ? 'Uploading image...' : 'Save'}
              </button>
              <button type="button" onClick={cancelForm} className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-gray-200 text-gray-700 px-5 py-2 rounded-full hover:bg-gray-300">
                <X className="w-4 h-4" />
                Cancel
              </button>
            </div>
          </form>
        )}

        {/* Timeline Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {timelineEvents.map((event) => (
            <TimelineCard
              key={event.id}
              event={event}
              onEdit={startEdit}
              onDelete={deleteEvent}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
