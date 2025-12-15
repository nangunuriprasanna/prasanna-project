import React from 'react';
import { Card, Row, Col } from 'react-bootstrap';
import TransportIllustration from './TransportIllustration';

const Features = () => {
  const features = [
    {
      icon: "🚀",
      title: "Fast Booking",
      description: "Book your ride in seconds with our easy-to-use interface",
      image: "car"
    },
    {
      icon: "📍",
      title: "Real-time Availability",
      description: "See available vehicles based on your route and time",
      image: "bus"
    },
    {
      icon: "💳",
      title: "Secure Payment",
      description: "Multiple payment options with secure transactions",
      image: "general"
    },
    {
      icon: "📱",
      title: "Mobile Friendly",
      description: "Book on the go with our responsive design",
      image: "car"
    },
    {
      icon: "⭐",
      title: "24/7 Support",
      description: "Round-the-clock customer support for your convenience",
      image: "general"
    },
    {
      icon: "🎯",
      title: "Track Bookings",
      description: "Monitor your bookings and manage them easily",
      image: "fleet"
    }
  ];

  return (
    <div className="mb-5">
      <div className="text-center mb-4">
        <h3 className="gradient-text mb-2">Why Choose Prasanna Transport?</h3>
        <p className="text-muted">Experience the best in transport booking</p>
      </div>
      <Row>
        {features.map((feature, index) => (
          <Col key={index} md={4} className="mb-3">
            <Card className="h-100 shadow-sm text-center feature-card" style={{ border: 'none', borderRadius: '15px', transition: 'all 0.3s', overflow: 'hidden' }}>
              <Card.Body className="p-4">
                <div style={{ marginBottom: '1rem' }}>
                  <TransportIllustration type={feature.image} size="small" />
                </div>
                <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>
                  {feature.icon}
                </div>
                <h5 className="mb-3">{feature.title}</h5>
                <p className="text-muted small mb-0">{feature.description}</p>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default Features;

