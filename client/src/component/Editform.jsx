import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; // Import axios for HTTP requests

export const Editform = ({ userData, setUserData }) => {
  const [formData, setFormData] = useState({
    panShopOwner: userData.panShopOwner || '',
    phoneNumber: userData.phoneNumber || '',
    address: userData.address || '',
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };
  const [showModal, setShowModal] = useState(true); // State for modal visibility
  const handleSubmit = async (e) => {
    e.preventDefault();

    const { panShopOwner, phoneNumber, address } = formData;
    const user = userData._id;

    // Validate form fields here if needed
    if (!panShopOwner || !phoneNumber || !address) {
      setError('Please fill out all fields.');
      return;
    }

    try {
      const token = localStorage.getItem('accessToken');
      const response = await axios.put(
        `http://localhost:5001/api/panShopOwner/${user}`,
        {
          panShopOwner,
          phoneNumber,
          address,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log(response.data.qrCodeBase64);
      if (response.data.qrCodeBase64) {
        setUserData(response.data);
        navigate('/qrDetail');
      } else {
        console.error('QR Code Base64 string not found in response.');
      }
    } catch (error) {
      console.error('Error updating user data:', error);
      // Handle error state or notification here
    }
    // Reset error state
    setError('');
  };

  const getCurrentLocation = () => {
    // Implement geolocation logic here if needed
    console.log('Getting current location...');
  };

  const handleCancel = () => {
    // Hide the edit modal
    setShowModal(false); // Set showModal to false to hide the modal

    // Reload the window
    window.location.reload();
  };

  return (
    <div className="w-full overflow-hidden rounded-t-3xl lg:rounded-lg h-full">
      <h2 className="mt-2 text-center font-heading leading-9 tracking-tight">Edit</h2>
      <form className="mt-6 p-10 lg:py-3 px-5" onSubmit={handleSubmit}>
        <div>
          <label htmlFor="panShopOwner" className="block font leading-6">
            Shopkeeper Name
          </label>
          <input
            id="panShopOwner"
            name="panShopOwner"
            type="text"
            value={formData.panShopOwner}
            onChange={handleChange}
            required
            className="block w-full text-black mt-1 rounded-xl border-gray-300 shadow-sm focus:border-indigo-600 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 border border-solid py-3 px-4"
          />
        </div>
        <div className="mt-4">
          <label htmlFor="phoneNumber" className="block font leading-6">
            Phone Number
          </label>
          <input
            id="phoneNumber"
            name="phoneNumber"
            type="number"
            value={formData.phoneNumber}
            onChange={handleChange}
            required
            className="block w-full mt-1 text-black rounded-xl border-gray-300 shadow-sm focus:border-indigo-600 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 border border-solid py-3 px-4"
          />
        </div>
        <div className="mt-4">
          <label htmlFor="address" className="block font leading-6">
            Street Address
          </label>
          <input
            id="address"
            name="address"
            type="text"
            value={formData.address}
            onChange={handleChange}
            required
            className="block w-full mt-1 rounded-xl border-gray-300 text-black shadow-sm focus:border-indigo-600 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 border border-solid py-3 px-4"
          />
        </div>
        {error && <p className="text-red-500 mt-2">{error}</p>}
        <div className="mt-6 flex items-center justify-center gap-x-6">
        <button
            type="submit"
            onClick={getCurrentLocation}
            className="rounded-xl bg-green-700 px-10 py-3 text-md font-bold text-white shadow-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Submit
          </button>
          <button
            type="button"
            onClick={handleCancel}
            className="rounded-xl bg-green-700 px-10 py-3 text-md font-bold text-white shadow-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};
