import React, { useState } from 'react';
import CameraModal from './camera';

const Sidebar = ({ onImageSelected, onSubmit }) => {
  const [showCamera, setShowCamera] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
        onImageSelected(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const openFilePicker = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = handleFileUpload;
    input.click();
  };

  const handleImageCapture = (dataUrl) => {
    setPreviewImage(dataUrl);
    onImageSelected(dataUrl);
  };

  const commonButtonClasses =
    'px-4 py-2 rounded w-full text-white font-medium transition-transform duration-200 transform active:scale-95 focus:outline-none';

  return (
    <div className="w-64 p-4 bg-gray-100 border-r h-full">
      <h2 className="text-lg font-semibold mb-4">📁 Upload Image</h2>

      <button
        className={`${commonButtonClasses} bg-blue-500 hover:bg-blue-600`}
        onClick={() => setShowCamera(true)}
      >
        📸 Click from Camera
      </button>

      <button
        className={`${commonButtonClasses} bg-gray-600 hover:bg-gray-700 mt-2`}
        onClick={openFilePicker}
      >
        💻 Upload from PC
      </button>

      <button
        className={`${commonButtonClasses} bg-green-600 hover:bg-green-700 mt-2`}
        onClick={onSubmit}
        disabled={!previewImage}
        style={{ opacity: previewImage ? 1 : 0.5, cursor: previewImage ? 'pointer' : 'not-allowed' }}
      >
        🚀 Submit to API
      </button>

      <div className="mt-4">
        <h4 className="text-sm mb-1">Preview:</h4>
        {previewImage ? (
          <img src={previewImage} alt="Preview" className="w-full rounded border" />
        ) : (
          <div className="text-center text-gray-500 border rounded py-8">No image selected</div>
        )}
      </div>

      <CameraModal
        isOpen={showCamera}
        onClose={() => setShowCamera(false)}
        onCapture={handleImageCapture}
      />
    </div>
  );
};

export default Sidebar;
