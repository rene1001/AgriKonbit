import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { api, endpoints } from '../utils/api';
import toast from 'react-hot-toast';

const loadLeafletAssets = () => {
  return new Promise((resolve, reject) => {
    const existing = document.getElementById('leaflet-css');
    if (!existing) {
      const link = document.createElement('link');
      link.id = 'leaflet-css';
      link.rel = 'stylesheet';
      link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
      document.head.appendChild(link);
    }
    const existingJs = document.getElementById('leaflet-js');
    if (existingJs) {
      existingJs.addEventListener('load', resolve);
      if (window.L) resolve();
      return;
    }
    const script = document.createElement('script');
    script.id = 'leaflet-js';
    script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
    script.async = true;
    script.onload = resolve;
    script.onerror = reject;
    document.body.appendChild(script);
  });
};

const ProjectsMap = () => {
  const { t } = useTranslation();
  const mapRef = useRef(null);
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        const res = await api.get(endpoints.projects.list);
        const list = res.data?.data?.projects || res.data?.data || res.data || [];
        setProjects(Array.isArray(list) ? list : []);
      } catch (e) {
        toast.error(t('projectsMap.loadError'));
      }
    })();
  }, []);

  useEffect(() => {
    let mapInstance;
    let markers = [];
    (async () => {
      try {
        await loadLeafletAssets();
        const L = window.L;
        if (!L) return;
        if (mapRef.current && !mapRef.current._leaflet_id) {
          mapInstance = L.map(mapRef.current).setView([18.9712, -72.2852], 7); // Haiti default
          L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '&copy; OpenStreetMap contributors'
          }).addTo(mapInstance);
        }
        const valid = projects.filter(p => Number(p.latitude) && Number(p.longitude));
        valid.forEach(p => {
          const m = window.L.marker([Number(p.latitude), Number(p.longitude)]).addTo(mapInstance);
          m.bindPopup(`<b>${p.title || p.name || 'Projet'}</b><br/>${p.location || ''}`);
          markers.push(m);
        });
        if (valid.length > 0) {
          const group = window.L.featureGroup(markers);
          mapInstance.fitBounds(group.getBounds().pad(0.2));
        }
      } catch (e) {
        // silent
      }
    })();
    return () => {
      // let Leaflet handle map cleanup automatically when element is detached
    };
  }, [projects]);

  return (
    <div className="py-10 bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold">{t('projectsMap.title')}</h1>
          <a href="/projects" className="text-green-600 hover:underline" title={t('projectsMap.viewList')}>{t('projectsMap.viewList')}</a>
        </div>
        <div ref={mapRef} style={{ height: '70vh' }} className="rounded-lg shadow border bg-white" />
      </div>
    </div>
  );
};

export default ProjectsMap;
