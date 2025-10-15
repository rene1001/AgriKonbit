// Script pour ajouter une vidéo de test dans la table settings
require('dotenv').config();
const mysql = require('mysql2/promise');

async function addTestVideo() {
  // Connexion à la base de données
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'agrikonbit'
  });

  console.log('Connecté à la base de données');

  try {
    // Vérifier si l'entrée existe déjà
    const [rows] = await connection.execute(
      'SELECT * FROM settings WHERE setting_key = ?', 
      ['project_video_url']
    );

    if (rows.length > 0) {
      // Mise à jour de l'entrée existante
      await connection.execute(
        'UPDATE settings SET setting_value = ? WHERE setting_key = ?',
        ['https://www.youtube.com/embed/dQw4w9WgXcQ', 'project_video_url']
      );
      console.log('URL de vidéo mise à jour avec succès');
      
      await connection.execute(
        'UPDATE settings SET setting_value = ? WHERE setting_key = ?',
        ['Vidéo explicative du projet', 'project_video_title']
      );
      console.log('Titre de vidéo mis à jour avec succès');
    } else {
      // Insertion d'une nouvelle entrée
      await connection.execute(
        'INSERT INTO settings (setting_key, setting_value) VALUES (?, ?)',
        ['project_video_url', 'https://www.youtube.com/embed/dQw4w9WgXcQ']
      );
      console.log('URL de vidéo ajoutée avec succès');
      
      await connection.execute(
        'INSERT INTO settings (setting_key, setting_value) VALUES (?, ?)',
        ['project_video_title', 'Vidéo explicative du projet']
      );
      console.log('Titre de vidéo ajouté avec succès');
    }
  } catch (error) {
    console.error('Erreur lors de l\'ajout de la vidéo:', error);
  } finally {
    await connection.end();
    console.log('Connexion à la base de données fermée');
  }
}

addTestVideo();