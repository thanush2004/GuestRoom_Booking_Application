import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import NavBar from '../navbar/Navbar';
import './houseowner.css';

const RoomManager = ({ setRoomsData }) => {
  const [editIndex, setEditIndex] = useState(-1);
  const [file, setFile] = useState(null);
  const [name, setName] = useState('');
  const [minBookingPeriod, setMinBooking] = useState('');
  const [maxBookingPeriod, setMaxBooking] = useState('');
  const [rentPerDay, setRentPerDay] = useState('');
  const [rooms, setRooms] = useState([]);
  const [description, setDescription] = useState('');
  const [floorsize, setFloorSize] = useState('');
  const [numberofbed, setNumberOfBed] = useState('');
  const revealRoomsRef = useRef(null);

  useEffect(() => {
    axios.get('http://localhost:3001/getImage')
      .then(res => {
        setRooms(res.data);
        setRoomsData(res.data);
      })
      .catch(err => console.log(err));
  }, [setRoomsData]);

  const addRoom = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('name', name);
    formData.append('file', file);
    formData.append('minBookingPeriod', minBookingPeriod);
    formData.append('maxBookingPeriod', maxBookingPeriod);
    formData.append('rentPerDay', rentPerDay);
    formData.append('description', description);
    formData.append('floorsize', floorsize);
    formData.append('numberofbed', numberofbed);

    try {
      const res = await axios.post('http://localhost:3001/upload', formData);
      toast.success('Room added successfully!');
      const newRooms = [...rooms, { ...res.data, file: file.name }];
      setRooms(newRooms);
      setRoomsData(newRooms);
      clearForm();
    } catch (err) {
      console.log(err);
      toast.error('Failed to add room.');
    }
  };

  const updateRoom = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('name', name);
    formData.append('file', file);
    formData.append('minBookingPeriod', minBookingPeriod);
    formData.append('maxBookingPeriod', maxBookingPeriod);
    formData.append('rentPerDay', rentPerDay);
    formData.append('description', description);
    formData.append('floorsize', floorsize);
    formData.append('numberofbed', numberofbed);

    try {
      const res = await axios.put(`http://localhost:3001/update/${rooms[editIndex]._id}`, formData);
      toast.success('Room updated successfully!');
      const updatedRoom = { ...res.data, file: file ? file.name : rooms[editIndex].file };
      const updatedRooms = [...rooms];
      updatedRooms[editIndex] = updatedRoom;
      setRooms(updatedRooms);
      setRoomsData(updatedRooms);
      clearForm();
      setEditIndex(-1);
    } catch (err) {
      console.log(err);
      toast.error('Failed to update room.');
    }
  };

  const deleteRoom = async (id) => {
    try {
      await axios.delete(`http://localhost:3001/delete/${id}`);
      toast.success('Room deleted successfully!');
      const remainingRooms = rooms.filter(room => room._id !== id);
      setRooms(remainingRooms);
      setRoomsData(remainingRooms);
    } catch (err) {
      console.log(err);
      toast.error('Failed to delete room.');
    }
  };

  const editRoom = (index) => {
    const room = rooms[index];
    setEditIndex(index);
    setName(room.name);
    setMinBooking(room.minBookingPeriod);
    setMaxBooking(room.maxBookingPeriod);
    setRentPerDay(room.rentPerDay);
    setDescription(room.description);
    setFloorSize(room.floorsize);
    setNumberOfBed(room.numberofbed);
    setFile(null);
  };

  const clearForm = () => {
    setName('');
    setMinBooking('');
    setMaxBooking('');
    setRentPerDay('');
    setDescription('');
    setFloorSize('');
    setNumberOfBed('');
    setFile(null);
  };

  const scrollToRevealRooms = () => {
    revealRoomsRef.current.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div>
      <NavBar scrollToRevealRooms={scrollToRevealRooms} />  
      <div className='room-manager'>
        <h1>Create Room</h1>
        <form onSubmit={editIndex === -1 ? addRoom : updateRoom} className='room-manager-container'>
          <label>Enter Room Name:</label>
          <input className='room-manager-containers' placeholder='Enter Room Name' type="text" name="name" value={name} onChange={(e) => setName(e.target.value)} />
          <label>Description:</label>
          <input className='room-manager-containers' placeholder='Give Description' type="text" name="description" value={description} onChange={(e) => setDescription(e.target.value)} />
          <label>Floor Size:</label>
          <input className='room-manager-containers' placeholder='Enter Floor Size' type="text" name="floorsize" value={floorsize} onChange={(e) => setFloorSize(e.target.value)} />
          <label>Number of Beds:</label>
          <input className='room-manager-containers' placeholder='Enter Number Of Bed' type="number" name="numberofbed" value={numberofbed} onChange={(e) => setNumberOfBed(e.target.value)} />
          <label>Min Booking Period:</label>
          <input className='room-manager-containers' type="number" placeholder='Enter Min Booking Period' name="minBookingPeriod" min="1" value={minBookingPeriod} onChange={(e) => setMinBooking(e.target.value)} />
          <label>Max Booking Period:</label>
          <input className='room-manager-containers' placeholder='Enter Max Booking Period' type="number" name="maxBookingPeriod" max="30" value={maxBookingPeriod} onChange={(e) => setMaxBooking(e.target.value)} />
          <label>Rent Per Day:</label>
          <input className='room-manager-containers' placeholder='Enter Rent Per Day' type="text" name="rentPerDay" value={rentPerDay} onChange={(e) => setRentPerDay(e.target.value)} />
          <label>Photos:</label>
          <div className="file-input-container">
            <label htmlFor="file-input">Choose File</label>
            <input id="file-input" type="file" accept="image/*" multiple onChange={e => setFile(e.target.files[0])} />
          </div>
          <button className='room-manager-containers' type="submit">{editIndex === -1 ? 'Add Room' : 'Update Room'}</button>
        </form>
        <div className='table-container'>
          <div className='display-rooms-containers'>
            <h2>Rooms List</h2>
            <div className='reveal-rooms' ref={revealRoomsRef}>
              {rooms.map((room, index) => (
                <div key={room._id}>
                  <table>
                    <thead>
                      <tr>
                        <th>Room Name</th>
                        <th>Description</th>
                        <th>Floor Size</th>
                        <th>Number of Beds</th>
                        <th>Min Booking Period</th>
                        <th>Max Booking Period</th>
                        <th>Rent Per Day</th>
                        <th>Room Image</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>{room.name}</td>
                        <td>{room.description}</td>
                        <td>{room.floorsize}</td>
                        <td>{room.numberofbed}</td>
                        <td>{room.minBookingPeriod}</td>
                        <td>{room.maxBookingPeriod}</td>
                        <td>{room.rentPerDay}</td>
                        <td><img src={`http://localhost:3001/Images/${room.file}`} alt={room.name} height="100" width="150" /></td>
                        <td>
                          <button onClick={() => editRoom(index)} className='edit'>Edit</button>
                          <button onClick={() => deleteRoom(room._id)} className='delete'>Delete</button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoomManager; 