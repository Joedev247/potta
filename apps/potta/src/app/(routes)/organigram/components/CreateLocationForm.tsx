'use client';

import { Location } from '../types';
import { useState } from 'react';

interface CreateLocationFormProps {
  onSubmit: (data: Partial<Location>) => Promise<void>;
  onCancel: () => void;
  isCreating: boolean;
}

export default function CreateLocationForm({
  onSubmit,
  onCancel,
  isCreating,
}: CreateLocationFormProps) {
  const [coordinates, setCoordinates] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [address, setAddress] = useState('');

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    onSubmit({
      location_name: formData.get('location_name') as string,
      address: formData.get('address') as string,
      city: formData.get('city') as string,
      state: (formData.get('state') as string) || undefined,
      country: formData.get('country') as string,
      postal_code: (formData.get('postal_code') as string) || undefined,
      latitude: coordinates?.lat || 0,
      longitude: coordinates?.lng || 0,
      phone: (formData.get('phone') as string) || undefined,
      email: (formData.get('email') as string) || undefined,
      website: (formData.get('website') as string) || undefined,
      description: (formData.get('description') as string) || undefined,
      capacity: parseInt(formData.get('capacity') as string) || undefined,
    });
  };

  const handleAddressSearch = async () => {
    const searchAddress = `${address}, ${
      (document.querySelector('input[name="city"]') as HTMLInputElement)
        ?.value || ''
    }, ${
      (document.querySelector('input[name="country"]') as HTMLInputElement)
        ?.value || ''
    }`;

    try {
      // Use a geocoding service (you can replace with your preferred service)
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          searchAddress
        )}&limit=1`
      );
      const data = await response.json();

      if (data && data.length > 0) {
        setCoordinates({
          lat: parseFloat(data[0].lat),
          lng: parseFloat(data[0].lon),
        });
      }
    } catch (error) {
      console.error('Error getting coordinates:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Location Name *
          </label>
          <input
            type="text"
            name="location_name"
            required
            minLength={2}
            className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#237804]"
            placeholder="Enter location name"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Address *
          </label>
          <input
            type="text"
            name="address"
            required
            minLength={5}
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#237804]"
            placeholder="Enter full address"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            City *
          </label>
          <input
            type="text"
            name="city"
            required
            minLength={2}
            className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#237804]"
            placeholder="Enter city"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            State/Province
          </label>
          <input
            type="text"
            name="state"
            className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#237804]"
            placeholder="Enter state or province"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Country *
          </label>
          <input
            type="text"
            name="country"
            required
            minLength={2}
            className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#237804]"
            placeholder="Enter country"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Postal Code
          </label>
          <input
            type="text"
            name="postal_code"
            className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#237804]"
            placeholder="Enter postal code"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Coordinates
          </label>
          <div className="flex space-x-2">
            <button
              type="button"
              onClick={handleAddressSearch}
              className="px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Get Coordinates from Address
            </button>
            {coordinates && (
              <div className="flex-1 px-3 py-2 bg-gray-100 text-sm">
                Lat: {coordinates.lat.toFixed(6)}, Lng:{' '}
                {coordinates.lng.toFixed(6)}
              </div>
            )}
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Click the button to automatically get coordinates from the address,
            city, and country
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Phone
          </label>
          <input
            type="tel"
            name="phone"
            className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#237804]"
            placeholder="Enter phone number"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <input
            type="email"
            name="email"
            className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#237804]"
            placeholder="Enter email address"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Website
          </label>
          <input
            type="url"
            name="website"
            className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#237804]"
            placeholder="Enter website URL"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            name="description"
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#237804]"
            placeholder="Enter location description"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Capacity
          </label>
          <input
            type="number"
            name="capacity"
            min="1"
            className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#237804]"
            placeholder="Enter maximum capacity"
          />
        </div>
      </div>

      <div className="flex justify-end space-x-3 mt-6">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-gray-600 hover:text-gray-800"
          disabled={isCreating}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-[#237804] text-white hover:bg-[#1D6303] disabled:opacity-50"
          disabled={isCreating}
        >
          {isCreating ? 'Creating...' : 'Create Location'}
        </button>
      </div>
    </form>
  );
}
