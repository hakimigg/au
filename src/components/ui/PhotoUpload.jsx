import React, { useState, useRef, useCallback } from 'react';
import { Upload, X, Image, Camera } from 'lucide-react';

const PhotoUpload = ({ 
  onPhotosChange, 
  maxFiles = 5, 
  maxSizeInMB = 5,
  existingPhotos = [],
  className = "" 
}) => {
  const [photos, setPhotos] = useState(existingPhotos);
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);

  // Handle file validation
  const validateFile = (file) => {
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
    const maxSize = maxSizeInMB * 1024 * 1024; // Convert MB to bytes

    if (!validTypes.includes(file.type)) {
      return 'Please upload only image files (JPEG, PNG, WebP, GIF)';
    }

    if (file.size > maxSize) {
      return `File size must be less than ${maxSizeInMB}MB`;
    }

    return null;
  };

  // Convert file to base64 for preview and storage
  const fileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });
  };

  // Handle file processing
  const processFiles = async (files) => {
    setError('');
    setUploading(true);

    const fileArray = Array.from(files);
    const newPhotos = [];

    // Check if adding these files would exceed the limit
    if (photos.length + fileArray.length > maxFiles) {
      setError(`You can only upload up to ${maxFiles} photos`);
      setUploading(false);
      return;
    }

    try {
      for (const file of fileArray) {
        const validationError = validateFile(file);
        if (validationError) {
          setError(validationError);
          setUploading(false);
          return;
        }

        const base64 = await fileToBase64(file);
        newPhotos.push({
          id: Date.now() + Math.random(), // Simple ID generation
          file,
          preview: base64,
          name: file.name,
          size: file.size
        });
      }

      const updatedPhotos = [...photos, ...newPhotos];
      setPhotos(updatedPhotos);
      onPhotosChange(updatedPhotos);
    } catch (err) {
      setError('Error processing files. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  // Handle drag events
  const handleDrag = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFiles(e.dataTransfer.files);
    }
  }, [photos.length]);

  // Handle file input change
  const handleFileInput = (e) => {
    if (e.target.files && e.target.files[0]) {
      processFiles(e.target.files);
    }
  };

  // Remove photo
  const removePhoto = (photoId) => {
    const updatedPhotos = photos.filter(photo => photo.id !== photoId);
    setPhotos(updatedPhotos);
    onPhotosChange(updatedPhotos);
  };

  // Open file dialog
  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className={`w-full ${className}`}>
      {/* Upload Area */}
      <div
        className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200 ${
          dragActive
            ? 'border-blue-500 bg-blue-50'
            : 'border-gray-300 hover:border-gray-400 bg-gray-50'
        } ${uploading ? 'opacity-50 pointer-events-none' : ''}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*"
          onChange={handleFileInput}
          className="hidden"
        />

        <div className="flex flex-col items-center space-y-4">
          <div className={`w-16 h-16 rounded-full flex items-center justify-center ${
            dragActive ? 'bg-blue-100' : 'bg-gray-100'
          }`}>
            {uploading ? (
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            ) : (
              <Upload className={`w-8 h-8 ${dragActive ? 'text-blue-600' : 'text-gray-400'}`} />
            )}
          </div>

          <div>
            <p className="text-lg font-medium text-gray-700 mb-2">
              {dragActive ? 'Drop your photos here' : 'Upload Product Photos'}
            </p>
            <p className="text-sm text-gray-500 mb-4">
              Drag and drop your images here, or{' '}
              <button
                type="button"
                onClick={openFileDialog}
                className="text-blue-600 hover:text-blue-700 font-medium underline"
              >
                browse files
              </button>
            </p>
            <p className="text-xs text-gray-400">
              Supports JPEG, PNG, WebP, GIF • Max {maxSizeInMB}MB per file • Up to {maxFiles} photos
            </p>
          </div>

          {/* Mobile-friendly buttons */}
          <div className="flex space-x-3 sm:hidden">
            <button
              type="button"
              onClick={openFileDialog}
              className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Image className="w-4 h-4" />
              <span>Gallery</span>
            </button>
            <button
              type="button"
              onClick={() => {
                // For mobile camera access
                const input = document.createElement('input');
                input.type = 'file';
                input.accept = 'image/*';
                input.capture = 'environment'; // Use rear camera
                input.onchange = (e) => processFiles(e.target.files);
                input.click();
              }}
              className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
            >
              <Camera className="w-4 h-4" />
              <span>Camera</span>
            </button>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      {/* Photo Previews */}
      {photos.length > 0 && (
        <div className="mt-6">
          <h4 className="text-sm font-medium text-gray-700 mb-3">
            Uploaded Photos ({photos.length}/{maxFiles})
          </h4>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {photos.map((photo) => (
              <div key={photo.id} className="relative group">
                <div className="aspect-square rounded-lg overflow-hidden bg-gray-100 border border-gray-200">
                  <img
                    src={photo.preview}
                    alt={photo.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                
                {/* Remove button */}
                <button
                  type="button"
                  onClick={() => removePhoto(photo.id)}
                  className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                >
                  <X className="w-3 h-3" />
                </button>

                {/* File info */}
                <div className="mt-1">
                  <p className="text-xs text-gray-500 truncate">{photo.name}</p>
                  <p className="text-xs text-gray-400">
                    {(photo.size / 1024 / 1024).toFixed(1)}MB
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default PhotoUpload;
