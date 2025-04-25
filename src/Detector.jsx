import React, { useState } from 'react';

export default function BananaDetector() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [outputImage, setOutputImage] = useState(null);
  const [bananaCount, setBananaCount] = useState(null);

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setSelectedImage(file);
    setPreview(URL.createObjectURL(file));

    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64String = reader.result.split(',')[1];

      try {
        const response = await fetch('https://serverless.roboflow.com/infer/workflows/freshtrack/detect-count-and-visualize', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            api_key: 'iAAt4EQttFcm7CRQtRJk',
            inputs: {
              image: {
                type: 'base64',
                value: base64String
              }
            }
          })
        });

        const result = await response.json();
        const outputBase64 = result.outputs[0].output_image.value;
        const count = result.outputs[0].count_objects;

        setOutputImage(`data:image/jpeg;base64,${outputBase64}`);
        setBananaCount(count);
      } catch (err) {
        console.error('❌ Error:', err);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleClickUpload = () => {
    document.getElementById('imageInput').click();
  };

  return (
    <div className="flex flex-col md:flex-row gap-4 p-4">
      <div className="flex-1 flex flex-col items-center">
        <button
          onClick={handleClickUpload}
          className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded mb-4"
        >
          Upload from Camera / PC
        </button>
        <input
          id="imageInput"
          type="file"
          accept="image/*"
          capture="environment"
          className="hidden"
          onChange={handleImageUpload}
        />

        {preview && (
          <img
            src={preview}
            alt="Selected"
            className="w-full max-w-sm rounded shadow-md"
          />
        )}
      </div>

      <div className="flex-1">
        {outputImage && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Detected Bananas: {bananaCount}</h2>
            <img
              src={outputImage}
              alt="Detected"
              className="w-full max-w-sm rounded shadow-md"
            />
          </div>
        )}
      </div>
    </div>
  );
}
