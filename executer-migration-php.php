<?php
// Script PHP pour exécuter la migration 027
echo "=== Migration 027: Trésorerie de la Plateforme ===\n";

try {
    // Connexion à la base de données
    $pdo = new PDO('mysql:host=localhost;dbname=agrikonbit', 'root', '123456');
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // Lecture du fichier de migration
    $migrationFile = __DIR__ . '/migrations/027_platform_treasury.sql';
    $sql = file_get_contents($migrationFile);

    if (!$sql) {
        throw new Exception("Impossible de lire le fichier de migration");
    }

    // Exécuter la migration
    echo "Exécution de la migration...\n";
    $pdo->exec($sql);

    echo "✅ Migration exécutée avec succès!\n";

    // Vérifier les tables créées
    $tables = ['platform_treasury', 'platform_treasury_transactions'];
    foreach ($tables as $table) {
        $stmt = $pdo->query("SHOW TABLES LIKE '$table'");
        if ($stmt->rowCount() > 0) {
            echo "✅ Table '$table' créée avec succès\n";
        } else {
            echo "❌ Table '$table' non trouvée\n";
        }
    }

    // Vérifier l'enregistrement initial
    $stmt = $pdo->query("SELECT * FROM platform_treasury WHERE id = 1");
    $treasury = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($treasury) {
        echo "✅ Enregistrement initial créé:\n";
        echo "   - Solde: $" . $treasury['balance_usd'] . "\n";
        echo "   - Frais collectés: $" . $treasury['total_fees_collected'] . "\n";
        echo "   - Total retiré: $" . $treasury['total_withdrawn'] . "\n";
    } else {
        echo "❌ Enregistrement initial non trouvé\n";
    }

} catch (Exception $e) {
    echo "❌ Erreur: " . $e->getMessage() . "\n";
}

echo "\n=== Fin de la migration ===\n";
?>
