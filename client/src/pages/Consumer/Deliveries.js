import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from 'react-query';
import { api, endpoints } from '../../utils/api';
import { MapContainer, TileLayer, Marker, Polyline, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import BackButton from '../../components/common/BackButton';

// Helper component to auto-fit bounds to points
const FitBounds = ({ points }) => {
  const map = useMap();
  React.useEffect(() => {
    if (points && points.length > 1) {
      const bounds = L.latLngBounds(points.map(p => L.latLng(p[0], p[1])));
      map.fitBounds(bounds, { padding: [20, 20] });
    } else if (points && points.length === 1) {
      map.setView(points[0], 12);
    }
  }, [map, points]);
  return null;
};

const Deliveries = () => {
  const { data, isLoading, isError } = useQuery(['deliveries-my'], async () => {
    const res = await api.get(endpoints.deliveries.my);
    return res.data.data;
  });

  const withTracking = data?.deliveries || [];

  return (
    <div className="py-10 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Suivi des livraisons</h1>
          <BackButton />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {withTracking.map((o) => (
            <div key={o.orderId} className="card">
              <div className="text-sm text-gray-500">Commande #{o.order_number}</div>
              <div className="font-semibold mt-1">Tracking: {o.trackingNumber}</div>
              <div className="text-sm text-gray-600 mt-1">Statut: {o.status}</div>

              {/* Map if checkpoints contain coordinates */}
              {Array.isArray(o.checkpoints) && o.checkpoints.some(c => c.latitude && c.longitude) && (
                <div className="mt-3">
                  {(() => {
                    const points = o.checkpoints
                      .filter(c => typeof c.latitude === 'number' || typeof c.latitude === 'string')
                      .filter(c => c.latitude && c.longitude)
                      .map(c => [Number(c.latitude), Number(c.longitude)]);
                    const center = points[points.length - 1] || [0, 0];
                    const polyColor = '#3b82f6';
                    const icon = L.icon({
                      iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
                      iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
                      shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
                      iconSize: [25, 41],
                      iconAnchor: [12, 41],
                      popupAnchor: [1, -34],
                      shadowSize: [41, 41]
                    });
                    return (
                      <MapContainer center={center} zoom={10} style={{ height: 200, width: '100%' }} scrollWheelZoom={false} className="rounded border">
                        <FitBounds points={points} />
                        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution="&copy; OpenStreetMap contributors" />
                        {points.map((pos, idx) => (
                          <Marker key={idx} position={pos} icon={icon}>
                            <Popup>
                              <div className="text-sm">
                                <div className="font-medium">{o.checkpoints[idx]?.status}</div>
                                <div>{o.checkpoints[idx]?.location || '—'}</div>
                                <div className="text-xs text-gray-500">{new Date(o.checkpoints[idx]?.ts).toLocaleString()}</div>
                              </div>
                            </Popup>
                          </Marker>
                        ))}
                        {points.length > 1 && (
                          <Polyline positions={points} pathOptions={{ color: polyColor }} />
                        )}
                      </MapContainer>
                    );
                  })()}
                </div>
              )}
              <div className="flex gap-2 mt-4">
                <Link to={`/orders/${o.orderId}`} className="btn btn-outline flex-1">Détails</Link>
                <Link to={`/tracking?t=${encodeURIComponent(o.trackingNumber)}`} className="btn btn-primary flex-1">Suivre</Link>
              </div>
            </div>
          ))}
          {withTracking.length === 0 && (
            <div className="text-gray-600">Aucune livraison en cours. Consultez vos <Link className="text-primary-600" to="/orders">commandes</Link>.</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Deliveries;
