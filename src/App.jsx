// App.jsx
import React, { useState } from 'react';
import Sidebar from './sidebar';
import ResultSidebar from './results';

const App = () => {
  const [imageData, setImageData] = useState(null);
  const [apiResponse, setApiResponse] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleImageSelected = (dataUrl) => {
    setImageData(dataUrl);
    setApiResponse(null); // reset previous response
  };

  const handleSubmit = async () => {
    if (!imageData) return;

    setLoading(true); // start loading

    try {
      const base64 = imageData.replace(/^data:image\/\w+;base64,/, '');
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
              value: base64
            }
          }
        })
      });

      const result = await response.json();
      setApiResponse(result);
    } catch (error) {
      console.error('API Error:', error);
    } finally {
      setLoading(false); // end loading
    }
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      <Sidebar onImageSelected={handleImageSelected} onSubmit={handleSubmit} />

      <div className="flex-1 p-4 overflow-auto">
        {loading && (
          <div className="flex items-center justify-center h-full">
            <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-green-500 border-solid"></div>
          </div>
        )}

        {!loading && apiResponse?.outputs?.[0] && (
          <div className="max-w-md mx-auto">
            <h2 className="text-lg font-semibold mb-2">🍌 Detection Result</h2>
            <img
              src={`data:image/jpeg;base64,${apiResponse.outputs[0].output_image.value}`}
              alt="API Output"
              className="border rounded w-full max-w-xs mx-auto"
            />
          </div>
        )}
      </div>

      <ResultSidebar apiResponse={apiResponse} />
    </div>
  );
};

export default App;
