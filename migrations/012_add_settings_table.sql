-- Migration: Add settings table for storing system settings including video URL
CREATE TABLE IF NOT EXISTS settings (
  id INT AUTO_INCREMENT PRIMARY KEY,
  setting_key VARCHAR(100) NOT NULL UNIQUE,
  setting_value TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Insert default settings
INSERT INTO settings (setting_key, setting_value) VALUES 
('project_video_url', 'https://www.youtube.com/embed/dQw4w9WgXcQ'),
('project_video_title', 'Vidéo explicative du projet AgriKonbit');