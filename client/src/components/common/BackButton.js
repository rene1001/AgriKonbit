import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function BackButton({ label = 'Retour' }) {
  const navigate = useNavigate();
  return (
    <button
      type="button"
      className="text-sm text-gray-600 hover:text-gray-800 hover:underline"
      onClick={() => navigate(-1)}
      title="Retour à la page précédente"
    >
      ← {label}
    </button>
  );
}
