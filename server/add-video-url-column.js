const { query } = require('./config/database');

async function addVideoUrlColumn() {
  try {
    console.log('🎥 Ajout de la colonne video_url à la table projects...\n');

    // Vérifier si la colonne existe déjà
    const columns = await query(`
      SHOW COLUMNS FROM projects LIKE 'video_url'
    `);

    if (columns.length > 0) {
      console.log('✅ La colonne video_url existe déjà!');
      return;
    }

    // Ajouter la colonne
    await query(`
      ALTER TABLE projects
      ADD COLUMN video_url VARCHAR(500) NULL AFTER images
    `);

    console.log('✅ Colonne video_url ajoutée avec succès!');
    console.log('📝 Type: VARCHAR(500), NULL autorisé');
    
  } catch (error) {
    console.error('❌ Erreur:', error.message);
    throw error;
  } finally {
    process.exit();
  }
}

addVideoUrlColumn();
