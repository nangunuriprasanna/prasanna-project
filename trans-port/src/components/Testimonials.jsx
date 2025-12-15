import React from 'react';
import { Card, Row, Col } from 'react-bootstrap';

const Testimonials = () => {
  const testimonials = [
    {
      quote: "Prasanna Transport made my journey seamless and comfortable. Highly recommended!",
      author: "Rajesh Kumar",
      role: "Regular Customer",
      icon: "⭐"
    },
    {
      quote: "Best transport service in town. Reliable, punctual, and affordable!",
      author: "Priya Sharma",
      role: "Business Traveler",
      icon: "🚀"
    },
    {
      quote: "Easy booking process and excellent customer service. Love using this app!",
      author: "Amit Patel",
      role: "Frequent Traveler",
      icon: "💯"
    }
  ];

  return (
    <div className="mb-5">
      <div className="text-center mb-4">
        <h3 className="gradient-text mb-2">What Our Customers Say</h3>
        <p className="text-muted">Trusted by thousands of satisfied travelers</p>
      </div>
      <Row>
        {testimonials.map((testimonial, index) => (
          <Col key={index} md={4} className="mb-3">
            <Card className="h-100 shadow-sm" style={{ border: 'none', borderRadius: '15px' }}>
              <Card.Body className="p-4">
                <div className="text-center mb-3" style={{ fontSize: '2.5rem' }}>
                  {testimonial.icon}
                </div>
                <p className="text-muted mb-3" style={{ fontStyle: 'italic', fontSize: '0.95rem' }}>
                  "{testimonial.quote}"
                </p>
                <div className="text-center">
                  <strong>{testimonial.author}</strong>
                  <p className="text-muted small mb-0">{testimonial.role}</p>
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default Testimonials;

