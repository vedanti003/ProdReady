import React, { useEffect, useState } from 'react';
import axios from 'axios';
import EditModal from '../component/utils/EditModal';


const UserProfile = () => {
  const [userData, setUserData] = useState(null);
  const user = localStorage.getItem("user_id");
//console.log(user)
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        const response = await axios.get(`http://localhost:5001/api/panShopOwner/${user}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log( response.data.qrCodeBase64);
        if (response.data.qrCodeBase64) {
          setUserData(response.data);
        } else {
          console.error("QR Code Base64 string not found in response.");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        // Handle error state or notification here
      }
    };

    fetchData();
  }, []);

  return (
    <>
    <div className='flex justify-center items-center content-center w-full bg-gray-200'>
      <div className='bg-green-500 w-full h-full flex justify-center items-center content-center p-10'>
        <div className='bg-white lg:h-60 lg:w-60 h-60 w-60 pt-4 rounded-lg'>
          <div className='object-cover flex justify-center items-center content-center'>
            {userData && userData.qrCodeBase64 && (
              <img src={`data:image/png;base64,${userData.qrCodeBase64}`} alt="QR Code" />
            )}
          </div>
          <div className='flex justify-center items-center '>
            <p className='text-sm'>{user}</p>
          </div>
        </div>
      </div>
      
    </div>
    <div className='flex justify-center items-center content-center my-10'>
    <div className='border-2 bg-white-200 shadow-lg rounded p-10'>
      {userData ? (
        <>
          <p>PAN Shop Owner Name: {userData.owner.panShopOwner}</p>
          <p>Phone: {userData.owner.phoneNumber}</p>
          <p className='mb-4'>Address: {userData.owner.address}</p> 
          <div className='flex justify-center items-center content-center'>
          <EditModal className="mt-5" user={userData.owner} />
          </div>             
        </>
      ) : (
        <p>Loading user data...</p>
      )}
    </div>
   
  </div>
  </>
  );
};

export default UserProfile;
