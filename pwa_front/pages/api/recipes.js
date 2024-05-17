// pages/api/recipes.js
export default function handler(req, res) {
    if (req.method === 'GET') {
      // Handle GET request
      res.status(200).json({ message: 'Get all recipes' });
    } else if (req.method === 'POST') {
      // Handle POST request
      const recipe = req.body;
      // Vous pouvez ajouter la logique pour enregistrer la recette ici
      res.status(201).json({ message: 'Recipe created', recipe });
    } else {
      res.status(405).json({ message: 'Method not allowed' });
    }
  }