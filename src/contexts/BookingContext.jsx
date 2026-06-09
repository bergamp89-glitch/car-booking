import { createContext, useState, useEffect, useContext } from 'react';
import toast from 'react-hot-toast';

const BookingContext = createContext();

export function useBookings() {
  return useContext(BookingContext);
}

export function BookingProvider({ children }) {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    // Load bookings from local storage
    const storedBookings = localStorage.getItem('carbooking_bookings');
    if (storedBookings) {
      setBookings(JSON.parse(storedBookings));
    }
  }, []);

  const addBooking = (newBooking) => {
    const nextId = bookings.length > 0 ? Math.max(...bookings.map(b => b.id)) + 1 : 1;
    const bookingToAdd = {
      ...newBooking,
      id: nextId,
      status: 'PENDING', // default status
      createdAt: new Date().toISOString(),
    };
    const updatedBookings = [...bookings, bookingToAdd];
    setBookings(updatedBookings);
    localStorage.setItem('carbooking_bookings', JSON.stringify(updatedBookings));
    return nextId;
  };

  const updateBookingStatus = (id, newStatus) => {
    const updatedBookings = bookings.map(booking => 
      booking.id === id ? { ...booking, status: newStatus } : booking
    );
    setBookings(updatedBookings);
    localStorage.setItem('carbooking_bookings', JSON.stringify(updatedBookings));
  };

  const getBookingsByRenter = (renterId) => {
    return bookings.filter(b => b.renterId === renterId);
  };

  const getBookingsByHost = (hostId) => {
    return bookings.filter(b => b.ownerId === hostId);
  };

  const value = {
    bookings,
    addBooking,
    updateBookingStatus,
    getBookingsByRenter,
    getBookingsByHost
  };

  return (
    <BookingContext.Provider value={value}>
      {children}
    </BookingContext.Provider>
  );
}
