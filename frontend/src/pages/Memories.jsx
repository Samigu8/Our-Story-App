import { useEffect, useState } from 'react';
import { Upload, X, LoaderCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { API_URL, authHeaders } from '../services/api';
import MemoryCard from '../components/MemoryCard/MemoryCard.jsx';

export default function Memories() {
  const [photos, setPhotos] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');
  const [formErrors, setFormErrors] = useState({});
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [form, setForm] = useState({ caption: '' });

  useEffect(() => {
    fetchPhotos();
  }, []);

  useEffect(() => {
    if (!selectedImage) {
      setImagePreview('');
      return undefined;
    }

    const previewUrl = URL.createObjectURL(selectedImage);
    setImagePreview(previewUrl);
    return () => URL.revokeObjectURL(previewUrl);
  }, [selectedImage]);

  const fetchPhotos = async () => {
    try {
      const response = await fetch(`${API_URL}/memories/photos`, { headers: authHeaders() });
      if (!response.ok) {
        setStatusMessage('Unable to load memories right now.');
        return;
      }
      const data = await response.json();
      setPhotos(Array.isArray(data) ? data : []);
    } catch {
      setStatusMessage('Unable to load memories right now. Please try again.');
    }
  };

  const validateForm = () => {
    const errors = {};
    const caption = form.caption.trim();

    if (caption.length > 240) {
      errors.caption = 'Caption must be 240 characters or fewer.';
    }

    if (!selectedImage) {
      errors.imageUrl = 'Please choose an image file.';
    } else if (!selectedImage.type.startsWith('image/')) {
      errors.imageUrl = 'Only image files are allowed.';
    }

    return errors;
  };

  const uploadImage = async (file, folder) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('folder', folder);

    const uploadResponse = await fetch(`${API_URL}/uploads`, {
      method: 'POST',
      headers: authHeaders(),
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
      // Keep fallback for non-JSON responses.
    }
    return fallback;
  };

  const submitPhoto = async (event) => {
    event.preventDefault();
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      setStatusMessage('Please correct the form before uploading.');
      toast.error('Please correct the highlighted fields.');
      return;
    }

    try {
      setIsUploadingImage(true);
      const imageUrl = await uploadImage(selectedImage, 'memories');

      const response = await fetch(`${API_URL}/memories/photos`, {
        method: 'POST',
        headers: { ...authHeaders(), 'Content-Type': 'application/json' },
        body: JSON.stringify({
          caption: form.caption.trim(),
          imageUrl,
        }),
      });

      if (!response.ok) {
        const message = await parseMessage(response, 'Unable to upload photo.');
        setStatusMessage(message);
        toast.error(message);
        return;
      }

      setForm({ caption: '' });
      setSelectedImage(null);
      setImagePreview('');
      setFormErrors({});
      setIsUploading(false);
      await fetchPhotos();
      setStatusMessage('Photo uploaded.');
      toast.success('Photo uploaded.');
    } catch (error) {
      const message = error?.message || 'Unable to upload photo right now. Please try again.';
      setStatusMessage(message);
      toast.error(message);
    } finally {
      setIsUploadingImage(false);
    }
  };

  const deletePhoto = async (id) => {
    try {
      const response = await fetch(`${API_URL}/memories/photos/${id}`, { method: 'DELETE', headers: authHeaders() });
      if (!response.ok) {
        const message = await parseMessage(response, 'Unable to delete photo.');
        setStatusMessage(message);
        toast.error(message);
        return;
      }

      setPhotos((prev) => prev.filter((photo) => photo.id !== id));
      setStatusMessage('Photo deleted.');
      toast.success('Photo deleted.');
    } catch {
      setStatusMessage('Unable to delete photo right now.');
      toast.error('Unable to delete photo right now.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 via-purple-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Page Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl text-gray-800 mb-4">Our Memories</h1>
          <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto mb-8">
            A collection of beautiful moments captured through our journey together
          </p>
          
          {/* Upload Button */}
          <button
            onClick={() => {
              setIsUploading(true);
              setStatusMessage('');
            }}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-gradient-to-r from-pink-500 to-purple-500 text-white px-8 py-3 rounded-full hover:from-pink-600 hover:to-purple-600 transition-all hover:shadow-lg hover:-translate-y-0.5"
          >
            <Upload className="w-5 h-5" />
            Upload New Photo
          </button>
        </div>

        {statusMessage && <p className="text-center mb-6 text-gray-700" role="status">{statusMessage}</p>}

        {isUploading && (
          <form onSubmit={submitPhoto} className="bg-white rounded-2xl p-4 sm:p-6 shadow-md mb-8 max-w-3xl mx-auto">
            <h2 className="text-xl sm:text-2xl text-gray-800 mb-4">Upload Memory</h2>

            <label className="text-gray-700">
              Caption (optional)
              <textarea
                className="mt-1 w-full rounded-xl border border-gray-300 p-3"
                rows="3"
                value={form.caption}
                onChange={(e) => {
                  setForm((prev) => ({ ...prev, caption: e.target.value }));
                  setFormErrors((prev) => ({ ...prev, caption: '' }));
                }}
                placeholder="Optional: describe the moment"
              />
            </label>
            {formErrors.caption && <p className="text-red-600 mt-1" role="alert">{formErrors.caption}</p>}

            <label className="text-gray-700 block mt-4">
              Image File
              <input
                className="mt-1 w-full rounded-xl border border-gray-300 p-3"
                type="file"
                accept="image/*"
                onChange={(e) => {
                  setSelectedImage(e.target.files?.[0] || null);
                  setFormErrors((prev) => ({ ...prev, imageUrl: '' }));
                }}
              />
            </label>
            {imagePreview && (
              <img src={imagePreview} alt="Selected memory preview" className="mt-3 max-h-56 w-full rounded-xl object-cover" />
            )}
            {formErrors.imageUrl && <p className="text-red-600 mt-1" role="alert">{formErrors.imageUrl}</p>}

            <div className="mt-5 flex flex-col sm:flex-row gap-3">
              <button type="submit" disabled={isUploadingImage} className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-pink-500 text-white px-5 py-2 rounded-full hover:bg-pink-600 disabled:bg-pink-300">
                {isUploadingImage && <LoaderCircle className="w-4 h-4 animate-spin" />}
                {isUploadingImage ? 'Uploading image...' : 'Upload'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsUploading(false);
                  setSelectedImage(null);
                  setImagePreview('');
                  setFormErrors({});
                }}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-gray-200 text-gray-700 px-5 py-2 rounded-full hover:bg-gray-300"
              >
                <X className="w-4 h-4" />
                Cancel
              </button>
            </div>
          </form>
        )}

        {/* Photo Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {photos.map((photo, index) => (
            <MemoryCard key={photo.id} photo={photo} index={index} onDelete={deletePhoto} />
          ))}
        </div>
      </div>
    </div>
  );
}
