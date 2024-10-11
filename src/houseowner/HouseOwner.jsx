import React, { useState, useEffect } from 'react';
import './houseowner.css';

const HouseOwner = () => {
  const [roomName, setRoomName] = useState('');
  const [roomDescription, setRoomDescription] = useState('');
  const [rooms, setRooms] = useState([]);
  const [maxRooms, setMaxRooms] = useState('');
  const [minRooms, setMinRooms] = useState('');
  const [roomImage, setRoomImage] = useState(null);
  const [editingRoomId, setEditingRoomId] = useState(null);

  // Fetch existing rooms from the server when the component mounts
  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const response = await fetch('http://localhost:3001/getRooms');
        const data = await response.json();
        setRooms(data);
      } catch (error) {
        console.error('Error fetching rooms:', error);
      }
    };

    fetchRooms();
  }, []);

  const addOrUpdateRoom = async () => {
    if (roomName && roomDescription && rooms.length < maxRooms) {
      const formData = new FormData();
      
      formData.append('file', roomImage); // Ensure the file is appended here
      formData.append('name', roomName);
      formData.append('description', roomDescription);
      formData.append('minBookingPeriod', minRooms);
      formData.append('maxBookingPeriod', maxRooms);
  
      try {
        const endpoint = editingRoomId
          ? `http://localhost:3001/update/${editingRoomId}`
          : 'http://localhost:3001/upload';
          
        const response = await fetch(endpoint, {
          method: 'POST',
          body: formData,
        });
  
        if (response.ok) {
          const newRoom = await response.json();
  
          // Update or add the new room to the UI state
          if (editingRoomId) {
            setRooms(rooms.map(room => (room.id === editingRoomId ? newRoom : room)));
            alert('Room updated successfully');
          } else {
            setRooms([...rooms, newRoom]);
            alert('Room added successfully');
          }
  
          resetForm();
        } else {
          alert('Failed to add/update room');
        }
      } catch (error) {
        console.error('Error uploading room:', error);
      }
    } else {
      alert(`Cannot add more than ${maxRooms} rooms.`);
    }
  };
  
  const deleteRoom = async (id) => {
    try {
      const response = await fetch(`http://localhost:3001/delete/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setRooms(rooms.filter(room => room._id !== id));
        alert('Room deleted successfully');
      } else {
        alert('Failed to delete room');
      }
    } catch (error) {
      console.error('Error deleting room:', error);
    }
  };

  const editRoom = (room) => {
    setRoomName(room.name);
    setRoomDescription(room.description);
    setMinRooms(room.minBookingPeriod);
    setMaxRooms(room.maxBookingPeriod);
    setEditingRoomId(room._id);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setRoomImage(file); // Ensure you're storing the file correctly
    }
  };
  

  const resetForm = () => {
    setRoomName('');
    setRoomDescription('');
    setRoomImage(null);
    setMinRooms('');
    setMaxRooms('');
    setEditingRoomId(null);
  };

  return (
    <div className="house-owner">
      <header className="house-owner__header">
        <div className="house-owner__navbar">
          <div className="house-owner__logo">RoomBooking</div>
          <ul className="house-owner__nav-links">
            <li><a href="/">Home</a></li>
            <li><a href="/login">Logout</a></li>
            <li><a href="/customer">Rooms</a></li>
          </ul>
        </div>
      </header>
      <div className="house-owner__hero">
        <div className="house-owner__hero-content">
          <h1>"Welcome to the Guest Room Booking, Room Addition section!"</h1>
          <p>Quickly add new rooms to your property by providing essential details and uploading images.</p>
        </div>  
      </div>
      <div className="house-owner__room-manager">
        <h1>{editingRoomId ? 'Edit Room' : 'Add a New Room'}</h1>
        <div className="house-owner__room-manager-form">
          <label>Room Name</label>
          <input
            type="text"
            value={roomName}
            onChange={(e) => setRoomName(e.target.value)}
          />
          <label>Room Description</label>
          <textarea
            value={roomDescription}
            onChange={(e) => setRoomDescription(e.target.value)}
          ></textarea>
          <label>Upload Room Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
          />
          <label>Minimum Number of Rooms</label>
          <input
            type="number"
            value={minRooms}
            onChange={(e) => setMinRooms(e.target.value)}
          />
          <label>Maximum Number of Rooms</label>
          <input
            type="number"
            value={maxRooms}
            onChange={(e) => setMaxRooms(e.target.value)}
          />
          <button className="house-owner__btn-submit" onClick={addOrUpdateRoom}>
            {editingRoomId ? 'Update Room' : 'Add Room'}
          </button>
        </div>
      </div>

      <div className="house-owner__display-rooms">
        <h2>Available Rooms</h2>
        {rooms.length === 0 ? (
          <p>No rooms available.</p>
        ) : (
          rooms.map((room, index) => (
            <div key={index} className="house-owner__room-card">
              {room.file && <img src={`http://localhost:3001/Images/${room.file}`} alt="Room" className="room-image" />}
              <h3>{room.name}</h3>
              <p>{room.description}</p>
              <button className="house-owner__btn-edit" onClick={() => editRoom(room)}>
                Edit
              </button>
              <button className="house-owner__btn-delete" onClick={() => deleteRoom(room._id)}>
                Delete
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default HouseOwner;
