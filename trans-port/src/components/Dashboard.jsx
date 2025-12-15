import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { useNavigate, useLocation } from 'react-router-dom';
import { storage, STORAGE_KEYS } from '../utils/localStorage';
import Loader from './Loader';
import Testimonials from './Testimonials';
import Features from './Features';
import TransportIllustration from './TransportIllustration';

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    confirmed: 0,
    completed: 0,
    upcoming: 0
  });
  const [recentBookings, setRecentBookings] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    loadDashboardData();
  }, [location.pathname]);

  useEffect(() => {
    // Listen for storage changes (when bookings are updated from other tabs/components)
    const handleStorageChange = () => {
      loadDashboardData();
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    // Also refresh when component becomes visible (user navigates back)
    const handleFocus = () => {
      loadDashboardData();
    };
    
    window.addEventListener('focus', handleFocus);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('focus', handleFocus);
    };
  }, []);

  const loadDashboardData = () => {
    setLoading(true);
    // Simulate loading delay for better UX
    setTimeout(() => {
      const bookings = storage.get(STORAGE_KEYS.BOOKINGS, []);
      
      const total = bookings.length;
      const pending = bookings.filter(b => b.status === 'pending').length;
      const confirmed = bookings.filter(b => b.status === 'confirmed').length;
      const completed = bookings.filter(b => b.status === 'completed').length;
      
      // Count upcoming bookings (future date/time and not completed/cancelled)
      const now = new Date();
      const upcoming = bookings.filter(booking => {
        const bookingDateTime = new Date(`${booking.bookingDate}T${booking.bookingTime}`);
        return bookingDateTime > now && 
               booking.status !== 'completed' && 
               booking.status !== 'cancelled';
      }).length;

      setStats({ total, pending, confirmed, completed, upcoming });

      // Get recent bookings (last 5, sorted by creation date)
      const recent = [...bookings]
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 5);
      setRecentBookings(recent);
      setLoading(false);
    }, 500);
  };

  const statCards = [
    {
      title: 'Total Bookings',
      value: stats.total,
      icon: '📋',
      color: 'primary',
      bg: 'bg-primary'
    },
    {
      title: 'Pending',
      value: stats.pending,
      icon: '⏳',
      color: 'warning',
      bg: 'bg-warning'
    },
    {
      title: 'Confirmed',
      value: stats.confirmed,
      icon: '✅',
      color: 'info',
      bg: 'bg-info'
    },
    {
      title: 'Upcoming',
      value: stats.upcoming,
      icon: '🚀',
      color: 'success',
      bg: 'bg-success'
    }
  ];

  const getStatusBadge = (status) => {
    const badges = {
      pending: 'warning',
      confirmed: 'info',
      completed: 'success',
      cancelled: 'danger'
    };
    return badges[status] || 'secondary';
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

  if (loading) {
    return <Loader />;
  }

  return (
    <Container>
      <div className="hero-section mb-4" style={{ position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '20px', right: '20px', opacity: 0.1, fontSize: '8rem' }}>
          🚐
        </div>
        <div className="d-flex justify-content-between align-items-center flex-wrap">
          <div style={{ position: 'relative', zIndex: 1, flex: 1 }}>
            <h1 className="text-white mb-2">🚐 Transport Dashboard</h1>
            <p className="text-white mb-2">Manage your bookings and track your rides</p>
            <div className="mt-3">
              <blockquote className="text-white" style={{ fontStyle: 'italic', opacity: 0.95, fontSize: '1.1rem', borderLeft: '3px solid white', paddingLeft: '1rem' }}>
                "Your journey, our commitment to excellence"
              </blockquote>
            </div>
          </div>
          <div style={{ position: 'relative', zIndex: 1, marginLeft: '2rem' }}>
            <TransportIllustration type="fleet" size="medium" />
          </div>
          <Button variant="light" size="lg" onClick={() => navigate('/add-booking')} className="mt-3 mt-md-0" style={{ position: 'relative', zIndex: 1 }}>
            ➕ New Booking
          </Button>
        </div>
      </div>

      <Row className="mb-4">
        {statCards.map((stat, index) => (
          <Col key={index} md={6} lg={3} className="mb-3">
            <Card className="h-100 shadow-sm">
              <Card.Body>
                <div className="d-flex align-items-center">
                  <div className={`${stat.bg} text-white rounded-circle p-3 me-3`} style={{ width: '60px', height: '60px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px' }}>
                    {stat.icon}
                  </div>
                  <div>
                    <h3 className="mb-0">{stat.value}</h3>
                    <p className="text-muted mb-0">{stat.title}</p>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      <Row>
        <Col>
          <Card className="shadow-sm">
            <Card.Header>
              <h5 className="mb-0">Recent Bookings</h5>
            </Card.Header>
            <Card.Body>
              {recentBookings.length === 0 ? (
                <p className="text-muted text-center py-4">
                  No bookings yet. <Button variant="link" className="p-0" onClick={() => navigate('/add-booking')}>Create your first booking!</Button>
                </p>
              ) : (
                <div className="list-group">
                  {recentBookings.map((booking) => (
                    <div
                      key={booking.id}
                      className="list-group-item"
                    >
                      <div className="d-flex justify-content-between align-items-start">
                        <div className="flex-grow-1">
                          <div className="d-flex align-items-center gap-2 mb-1">
                            <span style={{ fontSize: '20px' }}>
                              {getVehicleTypeIcon(booking.vehicleType)}
                            </span>
                            <h6 className="mb-0">
                              {booking.origin} → {booking.destination}
                            </h6>
                          </div>
                          <p className="mb-1 text-muted small">
                            {new Date(booking.bookingDate).toLocaleDateString()} at {booking.bookingTime} • 
                            {booking.vehicleType.charAt(0).toUpperCase() + booking.vehicleType.slice(1)} • 
                            {booking.passengers} passenger{booking.passengers !== 1 ? 's' : ''}
                          </p>
                          <div className="d-flex gap-2">
                            <span className={`badge bg-${getStatusBadge(booking.status)}`}>
                              {booking.status}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Features Section */}
      <Features />

      {/* Testimonials Section */}
      <Testimonials />
    </Container>
  );
};

export default Dashboard;

