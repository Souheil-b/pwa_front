import { useRef, useEffect, useState } from 'react';

const Camera = () => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [photo, setPhoto] = useState(null);
  const [location, setLocation] = useState({ latitude: null, longitude: null });
  const [error, setError] = useState(null);

  useEffect(() => {
    const getCameraStream = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        videoRef.current.srcObject = stream;
      } catch (error) {
        console.error('Error accessing the camera', error);
      }
    };

    const getGeolocation = () => {
      if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            setLocation({
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
            });
          },
          (err) => {
            setError(err.message);
          }
        );
      } else {
        setError('Geolocation is not supported by your browser');
      }
    };

    getCameraStream();
    getGeolocation();
  }, []);

  const takePhoto = () => {
    const context = canvasRef.current.getContext('2d');
    context.drawImage(videoRef.current, 0, 0, canvasRef.current.width, canvasRef.current.height);
    setPhoto(canvasRef.current.toDataURL('image/png'));
  };

  const savePhoto = () => {
    if (photo && location.latitude && location.longitude) {
      const photoData = {
        image: photo,
        latitude: location.latitude,
        longitude: location.longitude,
        timestamp: new Date().toISOString(),
      };
      localStorage.setItem('photoData', JSON.stringify(photoData));
      alert('Photo sauvegardée avec succès !');
    } else {
      alert('Veuillez prendre une photo et activer la géolocalisation.');
    }
  };

  return (
    <div>
      <h1>Prendre une Photo avec Géolocalisation</h1>
      <div>
        <video ref={videoRef} autoPlay style={{ width: '100%', maxWidth: '500px' }}></video>
        <canvas ref={canvasRef} style={{ display: 'none' }} width="500" height="400"></canvas>
      </div>
      <button onClick={takePhoto}>Prendre une photo</button>
      {photo && (
        <div>
          <h2>Photo capturée :</h2>
          <img src={photo} alt="Captured" style={{ width: '100%', maxWidth: '500px' }} />
          <p>Latitude : {location.latitude}</p>
          <p>Longitude : {location.longitude}</p>
          <button onClick={savePhoto}>Sauvegarder la photo</button>
        </div>
      )}
      {error && <p>Erreur : {error}</p>}
    </div>
  );
};

export default Camera;
