import { useEffect, useState } from 'react';
import axios from 'axios';

export default function Profile() {
  const [user, setUser] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('https://nodejs-serverless-function-express-sigma-two-85.vercel.app/profile', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUser(res.data);
      } catch (err) {
        setError(err.response?.data?.message || 'An error occurred');
      }
    };

    fetchProfile();
  }, []);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-80">
        <h2 className="text-2xl font-bold mb-4">Profil</h2>
        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
        {user ? (
          <div>
            <p className="text-gray-700"><strong>Email: </strong>{user.email}</p>
          </div>
        ) : (
          <p>Chargement...</p>
        )}
      </div>
    </div>
  );
}