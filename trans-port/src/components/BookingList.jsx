import React, { useState, useEffect, useCallback } from 'react';
import { Container, Card, Button, Badge, Form } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { storage, STORAGE_KEYS } from '../utils/localStorage';
import Loader from './Loader';

const BookingList = () => {
  const [loading, setLoading] = useState(true);
  const [bookings, setBookings] = useState([]);
  const [filter, setFilter] = useState('all');
  const navigate = useNavigate();

  const loadBookings = useCallback(() => {
    setLoading(true);
    // Simulate loading delay for better UX
    setTimeout(() => {
      const allBookings = storage.get(STORAGE_KEYS.BOOKINGS, []);
      let filtered = [...allBookings];

      if (filter === 'pending') {
        filtered = filtered.filter(b => b.status === 'pending');
      } else if (filter === 'confirmed') {
        filtered = filtered.filter(b => b.status === 'confirmed');
      } else if (filter === 'completed') {
        filtered = filtered.filter(b => b.status === 'completed');
      } else if (filter === 'cancelled') {
        filtered = filtered.filter(b => b.status === 'cancelled');
      }

      // Sort by booking date and time (upcoming first)
      filtered.sort((a, b) => {
        const dateA = new Date(`${a.bookingDate}T${a.bookingTime}`);
        const dateB = new Date(`${b.bookingDate}T${b.bookingTime}`);
        return dateA - dateB;
      });

      setBookings(filtered);
      setLoading(false);
    }, 500);
  }, [filter]);

  useEffect(() => {
    loadBookings();
  }, [loadBookings]);

  const updateBookingStatus = (bookingId, newStatus) => {
    const allBookings = storage.get(STORAGE_KEYS.BOOKINGS, []);
    const updatedBookings = allBookings.map(booking =>
      booking.id === bookingId ? { ...booking, status: newStatus } : booking
    );
    storage.save(STORAGE_KEYS.BOOKINGS, updatedBookings);
    loadBookings();
  };

  const deleteBooking = (bookingId) => {
    if (window.confirm('Are you sure you want to delete this booking?')) {
      const allBookings = storage.get(STORAGE_KEYS.BOOKINGS, []);
      const updatedBookings = allBookings.filter(booking => booking.id !== bookingId);
      storage.save(STORAGE_KEYS.BOOKINGS, updatedBookings);
      loadBookings();
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      pending: { bg: 'warning', text: 'Pending' },
      confirmed: { bg: 'info', text: 'Confirmed' },
      completed: { bg: 'success', text: 'Completed' },
      cancelled: { bg: 'danger', text: 'Cancelled' }
    };
    return badges[status] || { bg: 'secondary', text: status };
  };

  const getVehicleTypeIcon = (type) => {
    const icons = {
      motorcycle: '🏍️',
      auto: '🛺',
      sedan: '🚗',
      suv: '🚙',
      van: '🚐',
      bus: '🚌',
      truck: '🚚'
    };
    return icons[type] || '🚗';
  };

  const isUpcoming = (booking) => {
    const bookingDateTime = new Date(`${booking.bookingDate}T${booking.bookingTime}`);
    return bookingDateTime > new Date() && booking.status !== 'completed' && booking.status !== 'cancelled';
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <Container>
      <div className="hero-section mb-4">
        <div className="d-flex justify-content-between align-items-center flex-wrap">
          <div>
            <h1 className="text-white mb-2">📋 All Bookings</h1>
            <p className="text-white mb-0">View and manage your transport bookings</p>
          </div>
          <div className="d-flex gap-2 mt-3 mt-md-0">
          <Form.Select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            style={{ width: 'auto' }}
          >
            <option value="all">All Bookings</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </Form.Select>
          <Button variant="primary" onClick={() => navigate('/add-booking')}>
            New Booking
          </Button>
        </div>
        </div>
      </div>

      {bookings.length === 0 ? (
        <Card className="shadow-sm">
          <Card.Body className="text-center py-5">
            <p className="text-muted mb-3">No bookings found.</p>
            <Button variant="primary" onClick={() => navigate('/add-booking')}>
              Create Your First Booking
            </Button>
          </Card.Body>
        </Card>
      ) : (
        <div className="d-flex flex-column gap-3">
          {bookings.map((booking) => {
            const statusInfo = getStatusBadge(booking.status);
            const upcoming = isUpcoming(booking);
            
            return (
              <Card
                key={booking.id}
                className={`shadow-sm ${upcoming ? 'border-primary' : ''}`}
                style={{
                  borderLeft: `4px solid ${
                    booking.status === 'completed' ? 'var(--bs-success)' :
                    booking.status === 'cancelled' ? 'var(--bs-danger)' :
                    booking.status === 'confirmed' ? 'var(--bs-info)' :
                    'var(--bs-warning)'
                  }`
                }}
              >
                <Card.Body>
                  <div className="d-flex justify-content-between align-items-start">
                    <div className="flex-grow-1">
                      <div className="d-flex align-items-center gap-2 mb-2">
                        <span style={{ fontSize: '24px' }}>
                          {getVehicleTypeIcon(booking.vehicleType)}
                        </span>
                        <h5 className="mb-0">
                          {booking.origin} → {booking.destination}
                        </h5>
                        {upcoming && (
                          <Badge bg="primary">Upcoming</Badge>
                        )}
                      </div>
                      
                      <div className="row mb-2">
                        <div className="col-md-6">
                          <p className="mb-1">
                            <strong>Date & Time:</strong> {new Date(booking.bookingDate).toLocaleDateString()} at {booking.bookingTime}
                          </p>
                          <p className="mb-1">
                            <strong>Vehicle:</strong> {booking.vehicleType.charAt(0).toUpperCase() + booking.vehicleType.slice(1)}
                          </p>
                          <p className="mb-1">
                            <strong>Passengers:</strong> {booking.passengers}
                          </p>
                        </div>
                        <div className="col-md-6">
                          <p className="mb-1">
                            <strong>Contact:</strong> {booking.contactName}
                          </p>
                          <p className="mb-1">
                            <strong>Phone:</strong> {booking.contactPhone}
                          </p>
                          <p className="mb-1">
                            <strong>Email:</strong> {booking.contactEmail}
                          </p>
                        </div>
                      </div>

                      {booking.specialRequests && (
                        <div className="mb-2">
                          <strong>Special Requests:</strong>
                          <p className="text-muted mb-0">{booking.specialRequests}</p>
                        </div>
                      )}

                      <div className="d-flex flex-wrap gap-2 mt-2">
                        <Badge bg={statusInfo.bg}>{statusInfo.text}</Badge>
                        <small className="text-muted">
                          Created: {new Date(booking.createdAt).toLocaleDateString()}
                        </small>
                      </div>
                    </div>
                    <div className="d-flex flex-column gap-2 ms-3">
                      {booking.status === 'pending' && (
                        <>
                          <Button
                            variant="success"
                            size="sm"
                            onClick={() => updateBookingStatus(booking.id, 'confirmed')}
                          >
                            Confirm
                          </Button>
                          <Button
                            variant="danger"
                            size="sm"
                            onClick={() => updateBookingStatus(booking.id, 'cancelled')}
                          >
                            Cancel
                          </Button>
                        </>
                      )}
                      {booking.status === 'confirmed' && (
                        <>
                          <Button
                            variant="success"
                            size="sm"
                            onClick={() => updateBookingStatus(booking.id, 'completed')}
                          >
                            Mark Complete
                          </Button>
                          <Button
                            variant="warning"
                            size="sm"
                            onClick={() => updateBookingStatus(booking.id, 'pending')}
                          >
                            Set Pending
                          </Button>
                        </>
                      )}
                      {booking.status === 'completed' && (
                        <Button
                          variant="secondary"
                          size="sm"
                          disabled
                        >
                          Completed
                        </Button>
                      )}
                      {booking.status === 'cancelled' && (
                        <Button
                          variant="secondary"
                          size="sm"
                          disabled
                        >
                          Cancelled
                        </Button>
                      )}
                      <Button
                        variant="outline-danger"
                        size="sm"
                        onClick={() => deleteBooking(booking.id)}
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            );
          })}
        </div>
      )}
    </Container>
  );
};

export default BookingList;

