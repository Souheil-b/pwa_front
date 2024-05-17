import { useEffect, useState } from 'react';
import axios from 'axios';

export default function Profile() {
  const [favorites, setFavorites] = useState([]);
  const [newFavorite, setNewFavorite] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    fetchFavorites();
  }, []);

  const fetchFavorites = async () => {
    try {
      const res = await axios.get('https://nodejs-serverless-function-express-sigma-two-85.vercel.app/profile/favorites', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setFavorites(res.data);
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred');
    }
  };

  const addFavorite = async () => {
    try {
      const res = await axios.post('https://nodejs-serverless-function-express-sigma-two-85.vercel.app/profile/add-favorite', 
        { recipeId: newFavorite },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      setFavorites(res.data);
      setNewFavorite('');
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred');
    }
  };

  const removeFavorite = async (recipeId) => {
    try {
      const res = await axios.delete('https://nodejs-serverless-function-express-sigma-two-85.vercel.app/profile/remove-favorite', 
        { data: { recipeId }, headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      setFavorites(res.data);
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="bg-white p-8 rounded shadow-md w-96">
        <h2 className="text-2xl font-bold mb-4">Profil</h2>
        <div className="card bg-blue-100 p-4 rounded mb-4">
          <h3 className="text-lg font-bold mb-2">Ajouter au favoris</h3>
          <input
            type="text"
            value={newFavorite}
            onChange={(e) => setNewFavorite(e.target.value)}
            placeholder="ID de la recette"
            className="p-2 border border-gray-300 rounded w-full mb-2"
          />
          <button onClick={addFavorite} className="bg-blue-500 text-white p-2 rounded">Ajouter</button>
        </div>
        <ul>
          {favorites.map((fav, index) => (
            <li key={index} className="bg-gray-200 p-2 rounded mb-2 flex justify-between items-center">
              ID: {fav}
              <button onClick={() => removeFavorite(fav)} className="bg-red-500 text-white p-2 rounded">Supprimer</button>
            </li>
          ))}
        </ul>
        {error && <p className="text-red-500">{error}</p>}
      </div>
    </div>
  );
}
