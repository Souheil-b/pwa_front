import { useRef, useEffect, useState } from 'react';

const Modal = ({ isOpen, onClose, onSave }) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [photo, setPhoto] = useState(null);

  useEffect(() => {
    if (isOpen) {
      const getCameraStream = async () => {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({ video: true });
          videoRef.current.srcObject = stream;
        } catch (error) {
          console.error('Error accessing the camera', error);
        }
      };

      getCameraStream();
    }
  }, [isOpen]);

  const takePhoto = () => {
    const context = canvasRef.current.getContext('2d');
    context.drawImage(videoRef.current, 0, 0, canvasRef.current.width, canvasRef.current.height);
    setPhoto(canvasRef.current.toDataURL('image/png'));
  };

  const handleSave = () => {
    onSave(photo);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal">
      <div className="modal-content">
        <span className="close" onClick={onClose}>&times;</span>
        <video ref={videoRef} autoPlay style={{ width: '100%', maxWidth: '500px' }}></video>
        <canvas ref={canvasRef} style={{ display: 'none' }} width="500" height="400"></canvas>
        <button className="action-button" onClick={takePhoto}>Prendre une photo</button>
        {photo && (
          <div>
            <h2>Photo capturée :</h2>
            <img src={photo} alt="Captured" style={{ width: '100%', maxWidth: '500px' }} />
            <button className="action-button" onClick={handleSave}>Sauvegarder la photo</button>
          </div>
        )}
      </div>
      <style jsx>{`
        .modal {
          display: block;
          position: fixed;
          z-index: 1;
          left: 0;
          top: 0;
          width: 100%;
          height: 100%;
          overflow: auto;
          background-color: rgba(0,0,0,0.4);
        }
        .modal-content {
          background-color: #fefefe;
          margin: 15% auto;
          padding: 20px;
          border: 1px solid #888;
          width: 80%;
        }
        .close {
          color: #aaa;
          float: right;
          font-size: 28px;
          font-weight: bold;
        }
        .close:hover,
        .close:focus {
          color: black;
          text-decoration: none;
          cursor: pointer;
        }
        .action-button {
          margin-top: 10px;
          padding: 10px 20px;
          font-size: 16px;
          color: #fff;
          background-color: #007bff;
          border: none;
          border-radius: 4px;
          cursor: pointer;
        }
        .action-button:hover {
          background-color: #0056b3;
        }
      `}</style>
    </div>
  );
};

export default Modal;
