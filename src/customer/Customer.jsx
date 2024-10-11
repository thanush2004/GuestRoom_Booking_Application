import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Modal from 'react-modal';
import 'react-datepicker/dist/react-datepicker.css';
import DatePicker from 'react-datepicker'; // Ensure you import DatePicker
import styles from './customer.module.css'; // Update to your CSS module
import './customer.css';

const Customer = () => {
  const [rooms, setRooms] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [checkIn, setCheckIn] = useState(null);
  const [checkOut, setCheckOut] = useState(null);
  const [roomType, setRoomType] = useState('');
  const [availableRooms, setAvailableRooms] = useState([]);
  const navigate = useNavigate();

  // Fetch rooms on component mount
  useEffect(() => {
    axios.get('http://localhost:3001/getRooms')
      .then(res => {
        const storedRooms = JSON.parse(localStorage.getItem('bookedRooms')) || [];
        const updatedRooms = res.data.map(room => ({
          ...room,
          isBooked: storedRooms.includes(room._id)
        }));
        setRooms(updatedRooms);
        setAvailableRooms(updatedRooms); // Initially all rooms are available until filter is applied
      })
      .catch(err => console.log(err));
  }, []);

  // Filter rooms based on check-in and check-out dates
  const filterAvailableRooms = () => {
    if (!checkIn || !checkOut) {
      toast.error('Please select both check-in and check-out dates.');
      return;
    }

    const startDate = new Date(checkIn);
    const endDate = new Date(checkOut);

    const filteredRooms = rooms.filter(room => {
      const roomBookings = room.bookings || [];
      const isRoomAvailable = roomBookings.every(booking => {
        const bookingStart = new Date(booking.checkIn);
        const bookingEnd = new Date(booking.checkOut);
        return (
          startDate >= bookingEnd || // Check if the selected dates are after the booking end date
          endDate <= bookingStart   // Check if the selected dates are before the booking start date
        );
      });
      return isRoomAvailable && !room.isBooked; // Ensure the room is not already booked
    });

    setAvailableRooms(filteredRooms);
  };

  // Handle room booking
  const addRoom = (e) => {
    e.preventDefault();
    if (!selectedRoom) return;

    axios.post('http://localhost:3001/booking', {
      roomId: selectedRoom._id,
      checkIn,
      checkOut,
      roomType
    })
    .then(res => {
      const updatedRoom = res.data;

      const updatedRooms = rooms.map(room =>
        room._id === updatedRoom._id ? updatedRoom : room
      );
      setRooms(updatedRooms);
      localStorage.setItem('bookedRooms', JSON.stringify(updatedRooms.filter(room => room.isBooked).map(room => room._id)));
      setShowForm(false);
      navigate('/CustomerLogin');
      toast.success('Room booked successfully!');
    })
    .catch(err => {
      console.log(err);
      toast.error('An error occurred while booking the room.');
    });
  };

  // Toggle booking form
  const toggleForm = (room) => {
    setSelectedRoom(room);
    setShowForm(!showForm);
  };

  // Open modal for room details
  const openModal = (room) => {
    setSelectedRoom(room);
    setModalIsOpen(true);
  };

  // Close modal
  const closeModal = () => {
    setModalIsOpen(false);
    setSelectedRoom(null);
  };

  return (
    <div className='customer-body'>
      <div className='customer-container'>
        <div className="header">
          <h3><a href="">Guest Room Booking</a></h3>
          <nav className="nav-bar">
            <h4><a href="/login">Logout</a></h4>
          </nav>
        </div>
        <div className="header-container">
          <div className="header-content">
            <h2>
            Experience a Relaxing Vacation</h2>
            <p>
Reserve your rooms and stay packages at the most competitive prices, ensuring you enjoy a comfortable and memorable experience during your visit.</p>
          </div>
        </div>
        <br />
        <div className='rooms-container'>
          <h1>Available Rooms</h1>
          <div className="date-picker-container">
            <DatePicker
              selected={checkIn}
              onChange={date => setCheckIn(date)}
              selectsStart
              startDate={checkIn}
              endDate={checkOut}
              placeholderText="Check-in Date"
              className={styles.checkIn} // Use CSS Module class
            />
            <DatePicker
              selected={checkOut}
              onChange={date => setCheckOut(date)}
              selectsEnd
              startDate={checkIn}
              endDate={checkOut}
              minDate={checkIn}
              placeholderText="Check-out Date"
              className={styles.checkOut} // Use CSS Module class
            />
          </div>
          <button onClick={filterAvailableRooms} className={styles.availabilityButton}>Check Availability</button>
          <div className='display_rooms_container'>
            {availableRooms.length > 0 ? (
              availableRooms.map(room => (
                <div key={room._id} className='display_rooms'>
                  <table className='table-rooms'>
                    <thead>
                      <tr>
                        <th>Room Name</th>
                        <th>Min Booking Period</th>
                        <th>Max Booking Period</th>
                        <th>Rent Per Day</th>
                        <th>Room Image</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td><h2 className='room-name'>{room.name}</h2></td>
                        <td><p>{room.minBookingPeriod}</p></td>
                        <td><p>{room.maxBookingPeriod}</p></td>
                        <td><p>{room.rentPerDay}</p></td>
                        <td><img src={`http://localhost:3001/Images/${room.file}`} alt={room.name} height={"200px"} width={"250px"}  /><button
                      className='book'
                      onClick={() => toggleForm(room)}
                      style={{ backgroundColor: room.isBooked ? 'green' : 'silver' }}
                      disabled={room.isBooked}
                    >
                      {room.isBooked ? 'Booked' : 'Book Now'}
                    </button><button
                      className='view-details'
                      onClick={() => openModal(room)}
                    >
                      View Details
                    </button></td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              ))
            ) : (
              <p>No rooms available for the selected dates.</p>
            )}
          </div>
        </div>
        {showForm && selectedRoom && (
          <div className="formm-container">
            <form id="reservationForm" className="zoom-in" onSubmit={addRoom}>
              <h2>Hotel Reservation Form</h2>
              <label htmlFor="name">Room Name:</label>
              <input
                type="text"
                id="name"
                name="name"
                value={selectedRoom.name}
                disabled
              />
              <br/>
              <label htmlFor="checkin">Check-in Date:</label>
              <input type="date" id="checkin" name="checkin" required onChange={(e) => setCheckIn(e.target.value)} />
              <br/>

              <label htmlFor="checkout">Check-out Date:</label>
              <input type="date" id="checkout" name="checkout" required onChange={(e) => setCheckOut(e.target.value)} />
              <br/>

              <label htmlFor="roomtype">Room Type:</label>
              <select id="roomtype" name="roomtype" required onChange={(e) => setRoomType(e.target.value)}>
                <option value="">Select Room Type</option>
                <option value="single">Single</option>
                <option value="double">Double</option>
                <option value="suite">Suite</option>
              </select>
              <br/>
              <input type="submit" value="Submit Reservation" id="submit" className='submit_form_submit' />
            </form>
          </div>
        )}
        <Modal
          isOpen={modalIsOpen}
          onRequestClose={closeModal}
          contentLabel="Room Details"
          className="Modal"
          overlayClassName="Overlay"
        >
          {selectedRoom && (
            <div className="selected-room-details-container">
              <div className="selected-room-details">
                <h2>Room Details</h2>
                <p className="room-detail"><strong>Name:</strong> {selectedRoom.name}</p>
                <p className="room-detail"><strong>Min Booking Period:</strong> {selectedRoom.minBookingPeriod}</p>
                <p className="room-detail"><strong>Max Booking Period:</strong> {selectedRoom.maxBookingPeriod}</p>
                <p className="room-detail"><strong>Number Of Bed:</strong> {selectedRoom.numberofbed}</p>
                <p className="room-detail"><strong>Rent Per Day:</strong> {selectedRoom.rentPerDay}</p>
                <p className="room-detail"><strong>Description:</strong> {selectedRoom.description}</p>
                <img src={`http://localhost:3001/Images/${selectedRoom.file}`} width={"250px"} alt={selectedRoom.name} className="room-image" />
                <br />
                <button onClick={closeModal} className="close-button">Close</button>
              </div>
            </div>
          )}
        </Modal>
        <ToastContainer />
      </div>
    </div>
  );
};

export default Customer;
