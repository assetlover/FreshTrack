import React, { useRef, useState, useEffect } from 'react';

const CameraModal = ({ isOpen, onClose, onCapture }) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [stream, setStream] = useState(null);
  const [capturedImage, setCapturedImage] = useState(null);

  useEffect(() => {
    if (isOpen) {
      startCamera();
    } else {
      stopCamera();
      setCapturedImage(null);
    }
    return () => stopCamera();
  }, [isOpen]);
  useEffect(() => {
    if (!capturedImage && stream && videoRef.current) {
      videoRef.current.srcObject = stream;
    }
  }, [capturedImage, stream]);
  

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' },
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
  };

  const capture = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (video && canvas) {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL('image/jpeg');
      setCapturedImage(dataUrl);
      onCapture(dataUrl);
    }
  };

  const recapture = () => {
    setCapturedImage(null);
  };

  const handleClose = () => {
    setCapturedImage(null);
    onClose();
    stopCamera();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-70 flex items-center justify-center">
      <div className="bg-white rounded-lg p-4 w-full max-w-md shadow-lg relative">
        <h2 className="text-xl font-semibold mb-3">📷 Camera</h2>

        {!capturedImage ? (
          <div className="aspect-video w-full mb-4 relative">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover rounded"
            />
          </div>
        ) : (
          <div className="mb-4">
            <img src={capturedImage} alt="Captured" className="rounded w-full" />
          </div>
        )}

        <div className="flex justify-between gap-2">
          {!capturedImage ? (
            <button
              onClick={capture}
              className="bg-green-600 hover:bg-green-700 active:scale-95 transition px-4 py-2 rounded text-white font-medium w-full"
            >
              📸 Capture
            </button>
          ) : (
            <button
              onClick={recapture}
              className="bg-yellow-500 hover:bg-yellow-600 active:scale-95 transition px-4 py-2 rounded text-white font-medium w-full"
            >
              🔄 Retake
            </button>
          )}

          <button
            onClick={handleClose}
            className="bg-red-600 hover:bg-red-700 active:scale-95 transition px-4 py-2 rounded text-white font-medium w-full"
          >
            ❌ Close
          </button>
        </div>

        <canvas ref={canvasRef} style={{ display: 'none' }} />
      </div>
    </div>
  );
};

export default CameraModal;
