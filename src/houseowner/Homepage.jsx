import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './HomePage.css';

const Home = () => {
  const [feedback, setFeedback] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault();
    setFeedback('Thank you for your message!');
  };


  return (
    <div className="home-body">
      <header className="home-header">
        <nav className="home-navbar">
          <div className="home-logo">GuestRoom</div>
          <ul className="home-nav-links">
            {!isLoggedIn && <li><Link to="/Login">Sign in</Link></li>}
            {!isLoggedIn && <li><Link to="/signup">Sign up</Link></li>}
            <li><Link to="#rooms">Rooms</Link></li>
            <li><Link to="#about">About</Link></li>
            <li><Link to="#contact">Contact</Link></li>
            {isLoggedIn && <li><Link to="/HouseOwner">Manage Rooms</Link></li>}
            {isLoggedIn && <li><button onClick={handleLogout}>Logout</button></li>}
          </ul>
        </nav>
      </header>

      <main className="home-main-content" id="home">
        <section className="home-hero">
          <div className="home-hero-image-container">
            <img src="src/houseowner/Images/h_back_iamge.avif" alt="" className="home-hero-image" />
          </div>
          <div className="home-hero-content">
            <h1>Welcome to GuestRoom Booking</h1>
            <p>Book your stay with us and enjoy the best hospitality.</p>
            <Link to="#rooms" className="home-btn-primary">Book Now</Link>
          </div>
        </section>

        <section className="home-rooms" id="rooms">
          <div className="container">
            <h2>Our Rooms</h2>
            <div className="home-room-cards">
              <div className="home-room-card">
                <img src="src/houseowner/Images/h-image1.jpg" alt="Deluxe Room" />
                <h3>Deluxe Room</h3>
                <p>Experience luxury and comfort in our Deluxe Room.</p>
                <Link to="#" className="home-btn-primary">View Details</Link>
              </div>

              <div className="home-room-card">
                <img src="src/houseowner/Images/h-image2.webp" alt="Standard Room" />
                <h3>Standard Room</h3>
                <p>Enjoy a pleasant stay in our Standard Room.</p>
                <Link to="#" className="home-btn-primary">View Details</Link>
              </div>

              <div className="home-room-card">
                <img src="src/houseowner/Images/h-image3.jpg" alt="Suite" />
                <h3>Suite</h3>
                <p>Indulge in our spacious and elegant Suite.</p>
                <Link to="#" className="home-btn-primary">View Details</Link>
              </div>
            </div>
          </div>
        </section>

        <section className="home-rooms" id="other-rooms">
          <div className="container">
            <div className="home-room-cards">
              <div className="home-room-card">
                <img src="src/houseowner/Images/h-image4.jpeg" alt="Executive Room" />
                <h3>Executive Room</h3>
                <p>Experience luxury and comfort in our Executive Room.</p>
                <Link to="#" className="home-btn-primary">View Details</Link>
              </div>

              <div className="home-room-card">
                <img src="src/houseowner/Images/h-image5.jpeg" alt="Presidential Suite" />
                <h3>Presidential Suite</h3>
                <p>Enjoy a pleasant stay in our Presidential Suite.</p>
                <Link to="#" className="home-btn-primary">View Details</Link>
              </div>

              <div className="home-room-card">
                <img src="src/houseowner/Images/h-image6.jpeg" alt="Presidential Suite" />
                <h3>Presidential Suite</h3>
                <p>Indulge in our spacious and elegant Presidential Suite.</p>
                <Link to="#" className="home-btn-primary">View Details</Link>
              </div>
            </div>
          </div>
        </section>

        <section className="home-rooms" id="additional-rooms">
          <div className="container">
            <div className="home-room-cards">
              <div className="home-room-card">
                <img src="src/houseowner/Images/h-image7.jpeg" alt="Family Room" />
                <h3>Family Room</h3>
                <p>Experience luxury and comfort in our Family Room.</p>
                <Link to="#" className="home-btn-primary">View Details</Link>
              </div>

              <div className="home-room-card">
                <img src="src/houseowner/Images/h-image8.jpeg" alt="Superior Room" />
                <h3>Superior Room</h3>
                <p>Enjoy a pleasant stay in our Superior Room.</p>
                <Link to="#" className="home-btn-primary">View Details</Link>
              </div>

              <div className="home-room-card">
                <img src="src/houseowner/image 3.jpg" alt="Penthouse Suite" />
                <h3>Penthouse Suite</h3>
                <p>Indulge in our spacious and elegant Penthouse Suite.</p>
                <Link to="#" className="home-btn-primary">View Details</Link>
              </div>
            </div>
          </div>
        </section>

        <section className="home-about" id="about">
          <div className="container">
            <h2>About GuestRoom Booking</h2>
            <p>Welcome to <strong>GuestRoom Booking</strong>, your one-stop solution for hassle-free room reservations. Our platform is designed to make the process of finding and booking a room as seamless and enjoyable as possible. Whether you're traveling for business, leisure, or a family vacation, we offer a wide range of accommodations tailored to meet your needs.</p>

            <h3>Why Choose Us?</h3>
            <ul>
              <li><strong>Wide Selection of Rooms:</strong> From luxury suites to budget-friendly options, we have something for every type of traveler. Our rooms range from Deluxe and Executive to Family and Standard options, ensuring that you find the perfect space for your stay.</li>
              <li><strong>Easy Booking Process:</strong> With our user-friendly interface, booking a room is simple and quick. Just browse through available rooms, select your dates, and reserve your stay with a few clicks.</li>
              <li><strong>Personalized Experience:</strong> Our platform offers features such as filtering by amenities, room type, and price range, so you can customize your search to find exactly what you're looking for.</li>
              <li><strong>Secure Transactions:</strong> Your safety and privacy are our top priority. We offer secure payment gateways and ensure your personal details are protected.</li>
              <li><strong>24/7 Customer Support:</strong> Our dedicated support team is available around the clock to assist you with any questions or concerns before, during, or after your stay.</li>
            </ul>

            <h3>What We Offer</h3>
            <ul>
              <li><strong>Luxury Rooms:</strong> Experience world-class comfort in our luxury suites and premium rooms, designed for those who appreciate the finer things in life.</li>
              <li><strong>Business-Friendly Accommodations:</strong> Our Executive rooms come equipped with modern workspaces and business amenities, perfect for professionals on the go.</li>
              <li><strong>Family-Friendly Stays:</strong> Spacious and well-equipped family rooms ensure that your entire family can enjoy a comfortable stay without compromising on quality.</li>
              <li><strong>Flexible Booking Options:</strong> Book rooms for short stays, extended stays, or even last-minute trips with complete flexibility and ease.</li>
            </ul>

            <h3>Our Mission</h3>
            <p>At GuestRoom Booking, our mission is to provide a seamless and stress-free booking experience while delivering top-notch accommodations. We aim to redefine hospitality by offering convenience, comfort, and affordability under one roof. Whether you're booking a weekend getaway or an extended vacation, GuestRoom ensures that your stay is both memorable and enjoyable.</p>

            <p><strong>Join us today and experience a new way of booking rooms, where convenience meets luxury!</strong></p>
          </div>
        </section>

        <section className="home-contact" id="contact">
          <div className="container">
            <h2>Contact Us</h2>
            <form className="home-contact-form" onSubmit={handleSubmit}>
              <label htmlFor="name">Name:</label>
              <input
                type="text"
                id="name"
                name="name"
                placeholder="Your Full Name"
                required
                aria-label="Name"
              />

              <label htmlFor="email">Email:</label>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="Your Email Address"
                required
                aria-label="Email"
                pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$"
                title="Please enter a valid email address."
              />

              <label htmlFor="message">Message:</label>
              <textarea
                id="message"
                name="message"
                placeholder="Your Message"
                required
                aria-label="Message"
              ></textarea>

              <button type="submit" className="home-btn-primary">
                Send Message
              </button>
              <button type="reset" className="home-btn-secondary">
                Clear
              </button>
            </form>
            <div className="form-feedback" aria-live="polite">{feedback}</div>
          </div>
        </section>
      </main>

      <footer className="home-footer">
        <div className="container">
          <p>&copy; 2024 GuestRoom Booking. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Home;
