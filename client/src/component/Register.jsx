import React, { useState, useRef, useEffect } from "react";
import img from '../../src/assets/registerImage.webp';
import axios from 'axios';
import { useNavigate } from "react-router-dom";

export default function Register() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    panShopOwner: '',
    phoneNumber: '',
    address: '',
    latitude: 0,
    longitude: 0,
  });
  const [error, setError] = useState('');

  const panShopOwnerRef = useRef();
  const phoneNumberRef = useRef();
  const streetAddressRef = useRef();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("accessToken");
  
    const dataToSend = {
      panShopOwner: panShopOwnerRef.current.value,
      phoneNumber: phoneNumberRef.current.value,
      address: streetAddressRef.current.value,
      latitude: formData.latitude,
      longitude: formData.longitude,
    };
  
    try {
      const response = await axios.post("http://localhost:5001/api/panShopOwner/", dataToSend, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log(response.data.owner._id);
      const {_id} =response.data.owner;
      console.log(_id)
      localStorage.setItem("user_id",_id)
       // Log the response from the server
      // Optionally, you can handle success notification or navigation here
      navigate("/qrDetail")
    } catch (error) {
      console.error("Error submitting form:", error);
      if (error.response && error.response.status === 401) {
        setError('Unauthorized: User is not authorized. Please login again.');
      } else {
        setError('Invalid Phone Number.');
      }
    }
  };
  
  const handleCancel = () => {
    setFormData({
      panShopOwner: '',
      phoneNumber: '',
      address: '',
      latitude: 0,
      longitude: 0,
    });
  };

  const  getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setFormData({
            ...formData,
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        (error) => {
          console.error(error);
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
    }
  };
  useEffect(() => {
    getCurrentLocation();
  },[])
  return (
    <div className="lg:flex justify-center content-center lg:p-32 p-0 m-0 bg-slate-100 w-full">
      <div className="flex flex-col lg:flex-row mx-auto p-0 rounded w-full gap-0">
        <div className="lg:w-1/2 lg:flex block p-0">
          <img
            className="rounded-r h-full object-cover"
            src={img}
            alt=""
          />
        </div>
        <div className="w-full lg:w-1/3 p-4 lg:px-5 py-5 lg:py-10 overflow-hidden bg-blue-500 text-white rounded-t-3xl lg:rounded-lg h-full shadow-xl">
          <h2 className="mt-2 text-center font-heading leading-9 tracking-tight text-white">
            Register
          </h2>
          <form className="mt-6 lg:py-3 px-5" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="panShopOwner" className="block font text-white leading-6">
                Shopkeeper Name
              </label>
              <input
                id="panShopOwner"
                type="text"
                ref={panShopOwnerRef}
                required
                className="block w-full  text-black  mt-1 rounded-xl border-gray-300 shadow-sm focus:border-indigo-600 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 border border-solid py-3 px-4"
              />
            </div>
            <div className="mt-4">
              <label htmlFor="phoneNumber" className="block font leading-6 text-white">
                Phone Number
              </label>
              <input
                id="phoneNumber"
                type="number"
                ref={phoneNumberRef}
                required
                className="block w-full mt-1   text-black  rounded-xl border-gray-300 shadow-sm focus:border-indigo-600 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 border border-solid py-3 px-4"
              />
            </div>
            <div className="mt-4">
              <label htmlFor="streetAddress" className="block font leading-6 text-white">
                Street Address
              </label>
              <input
                id="streetAddress"
                type="text"
                ref={streetAddressRef}
                required
                className="block w-full mt-1 rounded-xl border-gray-300 text-black shadow-sm focus:border-indigo-600 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 border border-solid py-3 px-4"
              />
            </div>
            {error && <p className="text-red-500 mt-2">{error}</p>}
            <div className="mt-6 flex items-center justify-center gap-x-6">
              <button
                type="submit"
                onClick={getCurrentLocation}
                className="rounded-xl color-submit px-10 py-3 text-md font-bold shadow-md shadow-black text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Submit
              </button>
              <button
                type="button"
                onClick={handleCancel}
                className="rounded-xl bg-red-600 px-10 py-3 text-md font-bold text-white shadow-md shadow-red-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
