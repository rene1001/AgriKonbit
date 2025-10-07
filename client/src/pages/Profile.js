import React, { useState, useEffect } from 'react';
import { api, endpoints } from '../utils/api';
import toast from 'react-hot-toast';

const Profile = () => {
  const [form, setForm] = useState({ fullName: '', phone: '', country: '', city: '', address: '' });

  useEffect(() => {
    const load = async () => {
      const res = await api.get(endpoints.users.profile);
      const u = res.data.data;
      setForm({
        fullName: u.full_name || '',
        phone: u.phone || '',
        country: u.country || '',
        city: u.city || '',
        address: u.address || ''
      });
    };
    load();
  }, []);

  const updateProfile = async () => {
    try {
      await api.put(endpoints.users.updateProfile, {
        fullName: form.fullName,
        phone: form.phone,
        country: form.country,
        city: form.city,
        address: form.address
      });
      toast.success('Profile updated');
    } catch (e) {
      toast.error('Update failed');
    }
  };

  return (
    <div className="py-10 bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-bold mb-6">Profile</h1>
        <div className="card space-y-4">
          {['fullName','phone','country','city','address'].map((field) => (
            <div key={field}>
              <label className="label capitalize">{field}</label>
              <input
                className="input"
                value={form[field]}
                onChange={(e) => setForm(prev => ({ ...prev, [field]: e.target.value }))}
              />
            </div>
          ))}
          <button className="btn btn-primary" onClick={updateProfile}>Save</button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
