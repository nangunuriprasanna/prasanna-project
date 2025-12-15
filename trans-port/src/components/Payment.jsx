import React, { useState, useEffect } from 'react';
import { Container, Card, Form, Button, Alert, Row, Col } from 'react-bootstrap';
import { useNavigate, useLocation } from 'react-router-dom';
import { storage, STORAGE_KEYS } from '../utils/localStorage';
import Loader from './Loader';
import './Payment.css';

const Payment = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [booking, setBooking] = useState(null);
  const [paymentData, setPaymentData] = useState({
    paymentMethod: '',
    cardNumber: '',
    cardName: '',
    expiryDate: '',
    cvv: '',
    upiId: '',
    walletType: ''
  });
  const [errors, setErrors] = useState({});
  const [alert, setAlert] = useState({ show: false, message: '', variant: '' });

  useEffect(() => {
    if (location.state?.booking) {
      setBooking(location.state.booking);
      // Store booking temporarily in sessionStorage in case of page refresh
      sessionStorage.setItem('pendingBooking', JSON.stringify(location.state.booking));
    } else {
      // Try to get from sessionStorage if state is lost
      const pendingBooking = sessionStorage.getItem('pendingBooking');
      if (pendingBooking) {
        try {
          setBooking(JSON.parse(pendingBooking));
        } catch (e) {
          navigate('/add-booking');
        }
      } else {
        // If no booking data, redirect to add booking
        navigate('/add-booking');
      }
    }
  }, [location, navigate]);

  const calculatePrice = () => {
    if (!booking) return 0;
    
    const basePrices = {
      motorcycle: 50,
      auto: 100,
      sedan: 200,
      suv: 300,
      van: 400,
      bus: 800,
      truck: 500
    };

    const basePrice = basePrices[booking.vehicleType] || 200;
    const passengerMultiplier = booking.passengers > 1 ? 1 + (booking.passengers - 1) * 0.2 : 1;
    const distanceEstimate = 10; // Assume 10km base, in real app would calculate actual distance
    const distanceMultiplier = distanceEstimate / 10;
    
    return Math.round(basePrice * passengerMultiplier * distanceMultiplier);
  };

  const price = calculatePrice();
  const tax = Math.round(price * 0.18); // 18% GST
  const total = price + tax;

  const validate = () => {
    const newErrors = {};

    if (!paymentData.paymentMethod) {
      newErrors.paymentMethod = 'Payment method is required. Please select a payment method to proceed with your booking.';
    }

    if (paymentData.paymentMethod === 'card') {
      if (!paymentData.cardNumber.trim()) {
        newErrors.cardNumber = 'Card number is required. Please enter your 16-digit card number.';
      } else {
        const cardDigits = paymentData.cardNumber.replace(/\s/g, '');
        if (!/^\d{16}$/.test(cardDigits)) {
          newErrors.cardNumber = `Please enter a valid 16-digit card number. You entered ${cardDigits.length} digit${cardDigits.length !== 1 ? 's' : ''}. Card numbers must be exactly 16 digits.`;
        } else if (!/^[4-6]/.test(cardDigits)) {
          newErrors.cardNumber = 'Card number appears invalid. Most cards start with 4 (Visa), 5 (Mastercard), or 6 (Discover). Please check your card number.';
        }
      }

      if (!paymentData.cardName.trim()) {
        newErrors.cardName = 'Cardholder name is required. Please enter the name as it appears on your card.';
      } else if (paymentData.cardName.trim().length < 2) {
        newErrors.cardName = 'Cardholder name must be at least 2 characters long. Please enter the full name as shown on your card.';
      } else if (paymentData.cardName.trim().length > 50) {
        newErrors.cardName = 'Cardholder name is too long. Maximum 50 characters allowed.';
      } else if (!/^[a-zA-Z\s.'-]+$/.test(paymentData.cardName.trim())) {
        newErrors.cardName = 'Cardholder name contains invalid characters. Please use only letters, spaces, apostrophes, periods, and hyphens.';
      }

      if (!paymentData.expiryDate) {
        newErrors.expiryDate = 'Expiry date is required. Please enter the card expiry date in MM/YY format.';
      } else {
        const [month, year] = paymentData.expiryDate.split('/');
        if (!month || !year || month.length !== 2 || year.length !== 2) {
          newErrors.expiryDate = 'Expiry date format is invalid. Please enter in MM/YY format (e.g., 12/25).';
        } else {
          const monthNum = parseInt(month);
          const yearNum = parseInt(year);
          if (isNaN(monthNum) || isNaN(yearNum)) {
            newErrors.expiryDate = 'Expiry date contains invalid numbers. Please enter valid month and year.';
          } else if (monthNum < 1 || monthNum > 12) {
            newErrors.expiryDate = 'Month must be between 01 and 12. Please enter a valid month.';
          } else {
            const expiry = new Date(2000 + yearNum, monthNum - 1);
            const today = new Date();
            if (expiry < today) {
              newErrors.expiryDate = 'Card has expired. Please use a card with a valid expiry date.';
            }
          }
        }
      }

      if (!paymentData.cvv.trim()) {
        newErrors.cvv = 'CVV is required. Please enter the 3 or 4-digit CVV code from the back of your card.';
      } else if (!/^\d{3,4}$/.test(paymentData.cvv)) {
        newErrors.cvv = `CVV must be 3 or 4 digits. You entered ${paymentData.cvv.length} character${paymentData.cvv.length !== 1 ? 's' : ''}. Please check the CVV code on your card.`;
      }
    }

    if (paymentData.paymentMethod === 'upi') {
      if (!paymentData.upiId.trim()) {
        newErrors.upiId = 'UPI ID is required. Please enter your UPI ID to proceed with payment.';
      } else if (!/^[\w.-]+@[\w.-]+$/.test(paymentData.upiId)) {
        newErrors.upiId = 'UPI ID format is invalid. Please enter a valid UPI ID in the format: name@paytm, name@phonepe, name@ybl, etc.';
      } else if (paymentData.upiId.length > 100) {
        newErrors.upiId = 'UPI ID is too long. Maximum 100 characters allowed.';
      }
    }

    if (paymentData.paymentMethod === 'wallet') {
      if (!paymentData.walletType) {
        newErrors.walletType = 'Wallet selection is required. Please select a digital wallet from the dropdown to proceed.';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Format card number with spaces
    if (name === 'cardNumber') {
      const formatted = value.replace(/\s/g, '').replace(/(.{4})/g, '$1 ').trim();
      setPaymentData(prev => ({ ...prev, [name]: formatted }));
    } else if (name === 'expiryDate') {
      // Format expiry date as MM/YY
      const formatted = value.replace(/\D/g, '').replace(/(\d{2})(\d)/, '$1/$2').substring(0, 5);
      setPaymentData(prev => ({ ...prev, [name]: formatted }));
    } else {
      setPaymentData(prev => ({ ...prev, [name]: value }));
    }

    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validate()) {
      setAlert({
        show: true,
        message: 'Please fill all required fields correctly.',
        variant: 'danger'
      });
      
      // Scroll to first error field
      const firstErrorField = Object.keys(errors)[0];
      if (firstErrorField) {
        const element = document.querySelector(`[name="${firstErrorField}"]`);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'center' });
          element.focus();
        }
      }
      return;
    }

    setLoading(true);

    // Simulate payment processing
    setTimeout(() => {
      // Save booking with payment info and confirmed status
      const bookings = storage.get(STORAGE_KEYS.BOOKINGS, []);
      const confirmedBooking = {
        ...booking,
        status: 'confirmed',
        paymentMethod: paymentData.paymentMethod,
        amount: total,
        paidAt: new Date().toISOString()
      };
      
      // Add booking to list (since it wasn't saved before payment)
      bookings.unshift(confirmedBooking);
      storage.save(STORAGE_KEYS.BOOKINGS, bookings);
      
      // Clear sessionStorage
      sessionStorage.removeItem('pendingBooking');

      setLoading(false);
      setAlert({
        show: true,
        message: 'Payment successful! Booking confirmed.',
        variant: 'success'
      });

      setTimeout(() => {
        navigate('/bookings');
      }, 2000);
    }, 2000);
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

  if (!booking) {
    return (
      <Container className="text-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-3">Loading booking details...</p>
      </Container>
    );
  }

  return (
    <Container className="payment-container">
      <Row className="justify-content-center">
        <Col lg={10}>
          <div className="text-center mb-4">
            <h2 className="payment-title">Complete Your Booking</h2>
            <p className="text-muted">Review your booking details and proceed to payment</p>
          </div>

          <Row>
            <Col md={5}>
              <Card className="booking-summary-card shadow-lg">
                <Card.Header className="bg-primary text-white">
                  <h5 className="mb-0">📋 Booking Summary</h5>
                </Card.Header>
                <Card.Body>
                  <div className="booking-details">
                    <div className="detail-item">
                      <strong>Route:</strong>
                      <p className="route-text">
                        {getVehicleTypeIcon(booking.vehicleType)} {booking.origin} → {booking.destination}
                      </p>
                    </div>
                    <div className="detail-item">
                      <strong>Date & Time:</strong>
                      <p>{new Date(booking.bookingDate).toLocaleDateString()} at {booking.bookingTime}</p>
                    </div>
                    <div className="detail-item">
                      <strong>Vehicle:</strong>
                      <p>{booking.vehicleType.charAt(0).toUpperCase() + booking.vehicleType.slice(1)}</p>
                    </div>
                    <div className="detail-item">
                      <strong>Passengers:</strong>
                      <p>{booking.passengers} {booking.passengers === 1 ? 'passenger' : 'passengers'}</p>
                    </div>
                    <div className="detail-item">
                      <strong>Contact:</strong>
                      <p>{booking.contactName}<br />
                      {booking.contactPhone}<br />
                      {booking.contactEmail}</p>
                    </div>
                    {booking.specialRequests && (
                      <div className="detail-item">
                        <strong>Special Requests:</strong>
                        <p className="text-muted">{booking.specialRequests}</p>
                      </div>
                    )}
                  </div>
                </Card.Body>
              </Card>
            </Col>

            <Col md={7}>
              <Card className="payment-card shadow-lg">
                <Card.Header className="bg-success text-white">
                  <h5 className="mb-0">💳 Payment Details</h5>
                </Card.Header>
                <Card.Body>
                  {alert.show && (
                    <Alert variant={alert.variant} dismissible onClose={() => setAlert({ show: false })}>
                      {alert.message}
                    </Alert>
                  )}

                  <div className="price-breakdown mb-4">
                    <div className="price-item">
                      <span>Base Fare</span>
                      <span>₹{price}</span>
                    </div>
                    <div className="price-item">
                      <span>Tax (GST 18%)</span>
                      <span>₹{tax}</span>
                    </div>
                    <hr />
                    <div className="price-item total">
                      <span><strong>Total Amount</strong></span>
                      <span><strong>₹{total}</strong></span>
                    </div>
                  </div>

                  <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3">
                      <Form.Label>Payment Method <span className="text-danger">*</span></Form.Label>
                      <Form.Select
                        name="paymentMethod"
                        value={paymentData.paymentMethod}
                        onChange={handleChange}
                        isInvalid={!!errors.paymentMethod}
                      >
                        <option value="">Select Payment Method</option>
                        <option value="card">💳 Credit/Debit Card</option>
                        <option value="upi">📱 UPI</option>
                        <option value="wallet">💼 Digital Wallet</option>
                        <option value="cash">💵 Cash on Delivery</option>
                      </Form.Select>
                      <Form.Control.Feedback type="invalid">
                        {errors.paymentMethod}
                      </Form.Control.Feedback>
                    </Form.Group>

                    {paymentData.paymentMethod === 'card' && (
                      <>
                        <Form.Group className="mb-3">
                          <Form.Label>Card Number <span className="text-danger">*</span></Form.Label>
                          <Form.Control
                            type="text"
                            name="cardNumber"
                            value={paymentData.cardNumber}
                            onChange={handleChange}
                            placeholder="1234 5678 9012 3456"
                            maxLength="19"
                            isInvalid={!!errors.cardNumber}
                          />
                          <Form.Control.Feedback type="invalid">
                            {errors.cardNumber}
                          </Form.Control.Feedback>
                        </Form.Group>

                        <Form.Group className="mb-3">
                          <Form.Label>Cardholder Name <span className="text-danger">*</span></Form.Label>
                          <Form.Control
                            type="text"
                            name="cardName"
                            value={paymentData.cardName}
                            onChange={handleChange}
                            placeholder="John Doe"
                            isInvalid={!!errors.cardName}
                          />
                          <Form.Control.Feedback type="invalid">
                            {errors.cardName}
                          </Form.Control.Feedback>
                        </Form.Group>

                        <Row>
                          <Col md={6}>
                            <Form.Group className="mb-3">
                              <Form.Label>Expiry Date <span className="text-danger">*</span></Form.Label>
                              <Form.Control
                                type="text"
                                name="expiryDate"
                                value={paymentData.expiryDate}
                                onChange={handleChange}
                                placeholder="MM/YY"
                                maxLength="5"
                                isInvalid={!!errors.expiryDate}
                              />
                              <Form.Control.Feedback type="invalid">
                                {errors.expiryDate}
                              </Form.Control.Feedback>
                            </Form.Group>
                          </Col>
                          <Col md={6}>
                            <Form.Group className="mb-3">
                              <Form.Label>CVV <span className="text-danger">*</span></Form.Label>
                              <Form.Control
                                type="text"
                                name="cvv"
                                value={paymentData.cvv}
                                onChange={handleChange}
                                placeholder="123"
                                maxLength="4"
                                isInvalid={!!errors.cvv}
                              />
                              <Form.Control.Feedback type="invalid">
                                {errors.cvv}
                              </Form.Control.Feedback>
                            </Form.Group>
                          </Col>
                        </Row>
                      </>
                    )}

                    {paymentData.paymentMethod === 'upi' && (
                      <Form.Group className="mb-3">
                        <Form.Label>UPI ID <span className="text-danger">*</span></Form.Label>
                        <Form.Control
                          type="text"
                          name="upiId"
                          value={paymentData.upiId}
                          onChange={handleChange}
                          placeholder="yourname@paytm"
                          isInvalid={!!errors.upiId}
                        />
                        <Form.Control.Feedback type="invalid">
                          {errors.upiId}
                        </Form.Control.Feedback>
                      </Form.Group>
                    )}

                    {paymentData.paymentMethod === 'wallet' && (
                      <Form.Group className="mb-3">
                        <Form.Label>Select Wallet <span className="text-danger">*</span></Form.Label>
                        <Form.Select
                          name="walletType"
                          value={paymentData.walletType}
                          onChange={handleChange}
                          isInvalid={!!errors.walletType}
                        >
                          <option value="">Select Wallet</option>
                          <option value="paytm">Paytm</option>
                          <option value="phonepe">PhonePe</option>
                          <option value="gpay">Google Pay</option>
                          <option value="amazonpay">Amazon Pay</option>
                        </Form.Select>
                        <Form.Control.Feedback type="invalid">
                          {errors.walletType}
                        </Form.Control.Feedback>
                      </Form.Group>
                    )}

                    {paymentData.paymentMethod === 'cash' && (
                      <Alert variant="info">
                        <strong>Cash on Delivery:</strong> Payment will be collected at the time of service.
                      </Alert>
                    )}

                    <div className="d-grid gap-2 mt-4">
                      <Button variant="success" size="lg" type="submit" className="payment-button">
                        Pay ₹{total} & Confirm Booking
                      </Button>
                      <Button variant="outline-secondary" onClick={() => navigate('/bookings')}>
                        Cancel
                      </Button>
                    </div>
                  </Form>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Col>
      </Row>
    </Container>
  );
};

export default Payment;

