import React, { useState, useEffect } from 'react';
import { Container, Card, Form, Button, Alert, Row, Col, Badge } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { storage, STORAGE_KEYS } from '../utils/localStorage';
import { checkVehicleAvailability, getVehicleTypeLabel, getVehicleTypeIcon } from '../utils/vehicleInventory';
import Loader from './Loader';
import TransportIllustration from './TransportIllustration';

const AddBooking = () => {
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    origin: '',
    destination: '',
    bookingDate: '',
    bookingTime: '',
    vehicleType: '',
    passengers: '',
    contactName: '',
    contactPhone: '',
    contactEmail: '',
    specialRequests: ''
  });
  const [errors, setErrors] = useState({});
  const [alert, setAlert] = useState({ show: false, message: '', variant: '' });
  const [vehicleAvailability, setVehicleAvailability] = useState({ available: [], counts: {}, total: 0 });
  const navigate = useNavigate();

  useEffect(() => {
    // Simulate initial page load
    setTimeout(() => {
      setLoading(false);
    }, 300);
  }, []);

  // Update vehicle availability when route or time changes
  useEffect(() => {
    if (formData.origin && formData.destination && formData.bookingDate && formData.bookingTime) {
      const existingBookings = storage.get(STORAGE_KEYS.BOOKINGS, []);
      const availability = checkVehicleAvailability(
        formData.origin,
        formData.destination,
        formData.bookingDate,
        formData.bookingTime,
        existingBookings
      );
      setVehicleAvailability(availability);
      
      // Clear vehicle type if it's no longer available
      if (formData.vehicleType && !availability.counts[formData.vehicleType]) {
        setFormData(prev => ({ ...prev, vehicleType: '' }));
      }
    } else {
      setVehicleAvailability({ available: [], counts: {}, total: 0 });
    }
  }, [formData.origin, formData.destination, formData.bookingDate, formData.bookingTime]);

  const validate = (returnErrors = false) => {
    const newErrors = {};

    // Origin validation
    if (!formData.origin.trim()) {
      newErrors.origin = 'Origin location is required. Please enter the pickup location.';
    } else if (formData.origin.trim().length < 3) {
      newErrors.origin = 'Origin location must be at least 3 characters long. Please provide a more specific location.';
    } else if (formData.origin.trim().length > 100) {
      newErrors.origin = 'Origin location is too long. Maximum 100 characters allowed.';
    } else if (!/^[a-zA-Z0-9\s,.-]+$/.test(formData.origin.trim())) {
      newErrors.origin = 'Origin location contains invalid characters. Please use only letters, numbers, spaces, commas, periods, and hyphens.';
    }

    // Destination validation
    if (!formData.destination.trim()) {
      newErrors.destination = 'Destination location is required. Please enter the drop-off location.';
    } else if (formData.destination.trim().length < 3) {
      newErrors.destination = 'Destination location must be at least 3 characters long. Please provide a more specific location.';
    } else if (formData.destination.trim().length > 100) {
      newErrors.destination = 'Destination location is too long. Maximum 100 characters allowed.';
    } else if (!/^[a-zA-Z0-9\s,.-]+$/.test(formData.destination.trim())) {
      newErrors.destination = 'Destination location contains invalid characters. Please use only letters, numbers, spaces, commas, periods, and hyphens.';
    } else if (formData.origin.trim().toLowerCase() === formData.destination.trim().toLowerCase()) {
      newErrors.destination = 'Destination cannot be the same as origin. Please enter a different location.';
    }

    // Booking date validation
    if (!formData.bookingDate) {
      newErrors.bookingDate = 'Booking date is required. Please select a date for your booking.';
    } else {
      const selectedDate = new Date(formData.bookingDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (selectedDate < today) {
        newErrors.bookingDate = 'Booking date cannot be in the past. Please select today\'s date or a future date.';
      } else {
        const maxDate = new Date();
        maxDate.setMonth(maxDate.getMonth() + 6);
        if (selectedDate > maxDate) {
          newErrors.bookingDate = 'Booking date cannot be more than 6 months in advance. Please select a date within the next 6 months.';
        }
      }
    }

    // Booking time validation
    if (!formData.bookingTime) {
      newErrors.bookingTime = 'Booking time is required. Please select a time for your booking.';
    } else if (formData.bookingDate) {
      const selectedDate = new Date(formData.bookingDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (selectedDate.getTime() === today.getTime()) {
        const [hours, minutes] = formData.bookingTime.split(':');
        const bookingDateTime = new Date();
        bookingDateTime.setHours(parseInt(hours), parseInt(minutes), 0, 0);
        const now = new Date();
        
        if (bookingDateTime < now) {
          newErrors.bookingTime = 'Booking time cannot be in the past. Please select a future time.';
        }
      }
    }

    // Vehicle type validation
    if (!formData.vehicleType) {
      newErrors.vehicleType = 'Vehicle type is required. Please select a vehicle type from the dropdown.';
    } else if (formData.origin && formData.destination && formData.bookingDate && formData.bookingTime) {
      // Check if selected vehicle type is available
      const existingBookings = storage.get(STORAGE_KEYS.BOOKINGS, []);
      const availability = checkVehicleAvailability(
        formData.origin,
        formData.destination,
        formData.bookingDate,
        formData.bookingTime,
        existingBookings
      );
      if (!availability.counts[formData.vehicleType] || availability.counts[formData.vehicleType] === 0) {
        newErrors.vehicleType = 'Selected vehicle type is not available for this route and time. Please select another vehicle type.';
      }
    }

    // Passengers validation with vehicle type limits
    if (!formData.passengers) {
      newErrors.passengers = 'Number of passengers is required. Please enter the number of passengers.';
    } else {
      const passengers = parseInt(formData.passengers);
      const vehicleLimits = {
        motorcycle: { min: 1, max: 2 },
        auto: { min: 1, max: 4 },
        sedan: { min: 1, max: 5 },
        suv: { min: 1, max: 8 },
        van: { min: 1, max: 15 },
        bus: { min: 1, max: 50 },
        truck: { min: 0, max: 2 } // Truck for cargo, minimal passengers
      };

      if (isNaN(passengers)) {
        newErrors.passengers = 'Please enter a valid number for passengers.';
      } else if (passengers < 0) {
        newErrors.passengers = 'Number of passengers cannot be negative. Please enter a positive number.';
      } else if (passengers === 0 && formData.vehicleType !== 'truck') {
        newErrors.passengers = 'At least 1 passenger is required for this vehicle type.';
      } else if (formData.vehicleType && vehicleLimits[formData.vehicleType]) {
        const limit = vehicleLimits[formData.vehicleType];
        if (passengers < limit.min) {
          newErrors.passengers = `${formData.vehicleType.charAt(0).toUpperCase() + formData.vehicleType.slice(1)} requires at least ${limit.min} passenger${limit.min > 1 ? 's' : ''}. Please enter ${limit.min} or more.`;
        } else if (passengers > limit.max) {
          newErrors.passengers = `${formData.vehicleType.charAt(0).toUpperCase() + formData.vehicleType.slice(1)} can accommodate maximum ${limit.max} passenger${limit.max > 1 ? 's' : ''} only. Please reduce the number of passengers.`;
        }
      } else if (passengers > 50) {
        newErrors.passengers = 'Maximum 50 passengers allowed per booking. For larger groups, please make multiple bookings.';
      }
    }

    // Contact name validation
    if (!formData.contactName.trim()) {
      newErrors.contactName = 'Contact name is required. Please enter the name of the contact person.';
    } else if (formData.contactName.trim().length < 2) {
      newErrors.contactName = 'Contact name must be at least 2 characters long. Please enter a valid name.';
    } else if (formData.contactName.trim().length > 50) {
      newErrors.contactName = 'Contact name is too long. Maximum 50 characters allowed.';
    } else if (!/^[a-zA-Z\s.'-]+$/.test(formData.contactName.trim())) {
      newErrors.contactName = 'Contact name contains invalid characters. Please use only letters, spaces, apostrophes, periods, and hyphens.';
    }

    // Contact phone validation
    if (!formData.contactPhone.trim()) {
      newErrors.contactPhone = 'Contact phone number is required. Please enter a valid phone number.';
    } else {
      const phoneDigits = formData.contactPhone.replace(/\D/g, '');
      if (!/^[\d\s\-\+\(\)]+$/.test(formData.contactPhone.trim())) {
        newErrors.contactPhone = 'Phone number contains invalid characters. Please use only digits, spaces, hyphens, plus signs, and parentheses.';
      } else if (phoneDigits.length < 10) {
        newErrors.contactPhone = `Phone number must have at least 10 digits. You entered ${phoneDigits.length} digit${phoneDigits.length !== 1 ? 's' : ''}. Please check and correct.`;
      } else if (phoneDigits.length > 15) {
        newErrors.contactPhone = 'Phone number is too long. Maximum 15 digits allowed. Please check and correct.';
      }
    }

    // Contact email validation
    if (!formData.contactEmail.trim()) {
      newErrors.contactEmail = 'Contact email address is required. Please enter a valid email address.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.contactEmail)) {
      newErrors.contactEmail = 'Please enter a valid email address. Format should be: name@example.com';
    } else if (formData.contactEmail.length > 100) {
      newErrors.contactEmail = 'Email address is too long. Maximum 100 characters allowed.';
    } else if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(formData.contactEmail)) {
      newErrors.contactEmail = 'Email address format is invalid. Please check for typos and ensure it follows the format: name@domain.com';
    }

    // Special requests validation
    if (formData.specialRequests && formData.specialRequests.length > 500) {
      newErrors.specialRequests = `Special requests exceed the maximum length of 500 characters. You have entered ${formData.specialRequests.length} characters. Please reduce by ${formData.specialRequests.length - 500} characters.`;
    }

    setErrors(newErrors);
    if (returnErrors) {
      return { isValid: Object.keys(newErrors).length === 0, errors: newErrors };
    }
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const validationResult = validate(true);
    if (!validationResult.isValid) {
      setAlert({
        show: true,
        message: 'Please fill all required fields correctly.',
        variant: 'danger'
      });
      
      // Scroll to first error field
      setTimeout(() => {
        const firstErrorField = Object.keys(validationResult.errors)[0];
        if (firstErrorField) {
          const element = document.querySelector(`[name="${firstErrorField}"]`);
          if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'center' });
            element.focus();
          }
        }
      }, 100);
      return;
    }

    setLoading(true);

    // Find an available vehicle of the selected type
    const existingBookings = storage.get(STORAGE_KEYS.BOOKINGS, []);
    const availability = checkVehicleAvailability(
      formData.origin,
      formData.destination,
      formData.bookingDate,
      formData.bookingTime,
      existingBookings
    );
    
    const availableVehicle = availability.available.find(v => v.type === formData.vehicleType);
    const vehicleId = availableVehicle ? availableVehicle.id : null;

    // Create new booking (temporary, will be saved after payment)
    const newBooking = {
      id: Date.now().toString(),
      origin: formData.origin.trim(),
      destination: formData.destination.trim(),
      bookingDate: formData.bookingDate,
      bookingTime: formData.bookingTime,
      vehicleType: formData.vehicleType,
      vehicleId: vehicleId,
      passengers: parseInt(formData.passengers),
      contactName: formData.contactName.trim(),
      contactPhone: formData.contactPhone.trim(),
      contactEmail: formData.contactEmail.trim(),
      specialRequests: formData.specialRequests.trim() || '',
      status: 'pending', // Will be confirmed after payment
      createdAt: new Date().toISOString()
    };

    // Simulate processing delay
    setTimeout(() => {
      // Reset form
      setFormData({
        origin: '',
        destination: '',
        bookingDate: '',
        bookingTime: '',
        vehicleType: '',
        passengers: '',
        contactName: '',
        contactPhone: '',
        contactEmail: '',
        specialRequests: ''
      });

      // Navigate to payment page with booking data
      navigate('/payment', { state: { booking: newBooking } });
    }, 500);
  };

  const handleReset = () => {
    setFormData({
      origin: '',
      destination: '',
      bookingDate: '',
      bookingTime: '',
      vehicleType: '',
      passengers: '',
      contactName: '',
      contactPhone: '',
      contactEmail: '',
      specialRequests: ''
    });
    setErrors({});
    setAlert({ show: false });
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <Container>
      <div className="hero-section mb-4" style={{ position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '20px', right: '20px', opacity: 0.1, fontSize: '8rem' }}>
          📝
        </div>
        <div style={{ position: 'relative', zIndex: 1 }} className="d-flex justify-content-between align-items-center flex-wrap">
          <div style={{ flex: 1 }}>
            <h1 className="text-white mb-2">📝 New Transport Booking</h1>
            <p className="text-white mb-2">Fill in the details to book your ride</p>
            <div className="mt-2">
              <p className="text-white" style={{ opacity: 0.9, fontStyle: 'italic', fontSize: '1rem' }}>
                "Book now and travel with comfort and reliability"
              </p>
            </div>
          </div>
          <div style={{ marginLeft: '2rem' }}>
            <TransportIllustration type="fleet" size="medium" />
          </div>
        </div>
      </div>
      <Row className="justify-content-center">
        <Col md={10} lg={9}>
          <Card className="shadow-lg" style={{ borderRadius: '20px', border: 'none' }}>
            <Card.Body className="p-4">
              {alert.show && (
                <Alert variant={alert.variant} dismissible onClose={() => setAlert({ show: false })}>
                  {alert.message}
                </Alert>
              )}

              <Form onSubmit={handleSubmit}>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Origin <span className="text-danger">*</span></Form.Label>
                      <Form.Control
                        type="text"
                        name="origin"
                        value={formData.origin}
                        onChange={handleChange}
                        placeholder="Enter pickup location"
                        isInvalid={!!errors.origin}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.origin}
                      </Form.Control.Feedback>
                      <Form.Text className="text-muted">
                        <small>Examples: City Center, Airport, Station, Mall, Hotel, Hospital, University</small>
                      </Form.Text>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Destination <span className="text-danger">*</span></Form.Label>
                      <Form.Control
                        type="text"
                        name="destination"
                        value={formData.destination}
                        onChange={handleChange}
                        placeholder="Enter drop-off location"
                        isInvalid={!!errors.destination}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.destination}
                      </Form.Control.Feedback>
                      <Form.Text className="text-muted">
                        <small>Examples: City Center, Airport, Station, Mall, Hotel, Hospital, University</small>
                      </Form.Text>
                    </Form.Group>
                  </Col>
                </Row>

                <Row>
                  <Col md={4}>
                    <Form.Group className="mb-3">
                      <Form.Label>Booking Date <span className="text-danger">*</span></Form.Label>
                      <Form.Control
                        type="date"
                        name="bookingDate"
                        value={formData.bookingDate}
                        onChange={handleChange}
                        isInvalid={!!errors.bookingDate}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.bookingDate}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                  <Col md={4}>
                    <Form.Group className="mb-3">
                      <Form.Label>Booking Time <span className="text-danger">*</span></Form.Label>
                      <Form.Control
                        type="time"
                        name="bookingTime"
                        value={formData.bookingTime}
                        onChange={handleChange}
                        isInvalid={!!errors.bookingTime}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.bookingTime}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                </Row>

                {/* Vehicle Availability Display */}
                {formData.origin && formData.destination && formData.bookingDate && formData.bookingTime && (
                  <Row className="mb-3">
                    <Col>
                      <Card className="bg-light" style={{ border: '2px solid #0d6efd' }}>
                        <Card.Body>
                          <div className="d-flex justify-content-between align-items-center flex-wrap mb-2">
                            <h6 className="mb-0">
                              <strong>Available Vehicles:</strong> 
                              <Badge bg={vehicleAvailability.total > 0 ? 'success' : 'danger'} className="ms-2">
                                {vehicleAvailability.total} {vehicleAvailability.total === 1 ? 'Vehicle' : 'Vehicles'}
                              </Badge>
                            </h6>
                          </div>
                          {vehicleAvailability.total > 0 ? (
                            <div className="d-flex flex-wrap gap-2">
                              {Object.entries(vehicleAvailability.counts).map(([type, count]) => (
                                <Badge 
                                  key={type} 
                                  bg="primary" 
                                  style={{ fontSize: '0.9rem', padding: '0.5rem 0.75rem' }}
                                >
                                  {getVehicleTypeIcon(type)} {getVehicleTypeLabel(type)}: {count}
                                </Badge>
                              ))}
                            </div>
                          ) : (
                            <Alert variant="warning" className="mb-0 mt-2">
                              <small>No vehicles available for this route and time. Please try a different route or time.</small>
                            </Alert>
                          )}
                        </Card.Body>
                      </Card>
                    </Col>
                  </Row>
                )}

                <Row>
                  <Col md={4}>
                    <Form.Group className="mb-3">
                      <Form.Label>Vehicle Type <span className="text-danger">*</span></Form.Label>
                      <Form.Select
                        name="vehicleType"
                        value={formData.vehicleType}
                        onChange={handleChange}
                        isInvalid={!!errors.vehicleType}
                        disabled={vehicleAvailability.total === 0 && formData.origin && formData.destination && formData.bookingDate && formData.bookingTime}
                      >
                        <option value="">Select Vehicle Type</option>
                        {vehicleAvailability.counts.motorcycle > 0 && (
                          <option value="motorcycle">🏍️ Motorcycle (1-2 passengers)</option>
                        )}
                        {vehicleAvailability.counts.auto > 0 && (
                          <option value="auto">🛺 Auto/Three-wheeler (1-4 passengers)</option>
                        )}
                        {vehicleAvailability.counts.sedan > 0 && (
                          <option value="sedan">🚗 Sedan (1-5 passengers)</option>
                        )}
                        {vehicleAvailability.counts.suv > 0 && (
                          <option value="suv">🚙 SUV (1-8 passengers)</option>
                        )}
                        {vehicleAvailability.counts.van > 0 && (
                          <option value="van">🚐 Van (1-15 passengers)</option>
                        )}
                        {vehicleAvailability.counts.bus > 0 && (
                          <option value="bus">🚌 Bus (1-50 passengers)</option>
                        )}
                        {vehicleAvailability.counts.truck > 0 && (
                          <option value="truck">🚚 Truck (Cargo)</option>
                        )}
                        {/* Show all options if availability not checked yet */}
                        {!formData.origin || !formData.destination || !formData.bookingDate || !formData.bookingTime ? (
                          <>
                            <option value="motorcycle">🏍️ Motorcycle (1-2 passengers)</option>
                            <option value="auto">🛺 Auto/Three-wheeler (1-4 passengers)</option>
                            <option value="sedan">🚗 Sedan (1-5 passengers)</option>
                            <option value="suv">🚙 SUV (1-8 passengers)</option>
                            <option value="van">🚐 Van (1-15 passengers)</option>
                            <option value="bus">🚌 Bus (1-50 passengers)</option>
                            <option value="truck">🚚 Truck (Cargo)</option>
                          </>
                        ) : null}
                      </Form.Select>
                      <Form.Control.Feedback type="invalid">
                        {errors.vehicleType}
                      </Form.Control.Feedback>
                      {formData.origin && formData.destination && formData.bookingDate && formData.bookingTime && vehicleAvailability.total === 0 && (
                        <Form.Text className="text-danger">
                          No vehicles available. Please select a different route or time.
                        </Form.Text>
                      )}
                    </Form.Group>
                  </Col>
                </Row>

                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Number of Passengers <span className="text-danger">*</span></Form.Label>
                      <Form.Control
                        type="number"
                        name="passengers"
                        value={formData.passengers}
                        onChange={handleChange}
                        placeholder="Enter number of passengers"
                        min={formData.vehicleType === 'motorcycle' ? 1 : formData.vehicleType === 'auto' ? 1 : formData.vehicleType === 'sedan' ? 1 : formData.vehicleType === 'suv' ? 1 : formData.vehicleType === 'van' ? 1 : formData.vehicleType === 'bus' ? 1 : 1}
                        max={formData.vehicleType === 'motorcycle' ? 2 : formData.vehicleType === 'auto' ? 4 : formData.vehicleType === 'sedan' ? 5 : formData.vehicleType === 'suv' ? 8 : formData.vehicleType === 'van' ? 15 : formData.vehicleType === 'bus' ? 50 : 50}
                        isInvalid={!!errors.passengers}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.passengers}
                      </Form.Control.Feedback>
                      {formData.vehicleType && (
                        <Form.Text className="text-muted">
                          {formData.vehicleType === 'motorcycle' && 'Motorcycle: 1-2 passengers'}
                          {formData.vehicleType === 'auto' && 'Auto: 1-4 passengers'}
                          {formData.vehicleType === 'sedan' && 'Sedan: 1-5 passengers'}
                          {formData.vehicleType === 'suv' && 'SUV: 1-8 passengers'}
                          {formData.vehicleType === 'van' && 'Van: 1-15 passengers'}
                          {formData.vehicleType === 'bus' && 'Bus: 1-50 passengers'}
                          {formData.vehicleType === 'truck' && 'Truck: 0-2 passengers (cargo vehicle)'}
                        </Form.Text>
                      )}
                    </Form.Group>
                  </Col>
                </Row>

                <hr className="my-4" />
                <h5 className="mb-3">Contact Information</h5>

                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Contact Name <span className="text-danger">*</span></Form.Label>
                      <Form.Control
                        type="text"
                        name="contactName"
                        value={formData.contactName}
                        onChange={handleChange}
                        placeholder="Enter contact person name"
                        isInvalid={!!errors.contactName}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.contactName}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Contact Phone <span className="text-danger">*</span></Form.Label>
                      <Form.Control
                        type="tel"
                        name="contactPhone"
                        value={formData.contactPhone}
                        onChange={handleChange}
                        placeholder="Enter contact phone number"
                        isInvalid={!!errors.contactPhone}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.contactPhone}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                </Row>

                <Row>
                  <Col md={12}>
                    <Form.Group className="mb-3">
                      <Form.Label>Contact Email <span className="text-danger">*</span></Form.Label>
                      <Form.Control
                        type="email"
                        name="contactEmail"
                        value={formData.contactEmail}
                        onChange={handleChange}
                        placeholder="Enter contact email address"
                        isInvalid={!!errors.contactEmail}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.contactEmail}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                </Row>

                <Form.Group className="mb-3">
                  <Form.Label>Special Requests</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    name="specialRequests"
                    value={formData.specialRequests}
                    onChange={handleChange}
                    placeholder="Any special requests or notes (optional)"
                    isInvalid={!!errors.specialRequests}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.specialRequests}
                  </Form.Control.Feedback>
                  <Form.Text className="text-muted">
                    {formData.specialRequests.length}/500 characters
                  </Form.Text>
                </Form.Group>

                <div className="d-flex gap-2">
                  <Button variant="primary" type="submit" className="flex-grow-1">
                    Create Booking
                  </Button>
                  <Button variant="secondary" type="button" onClick={handleReset}>
                    Clear Form
                  </Button>
                  <Button variant="outline-secondary" type="button" onClick={() => navigate('/bookings')}>
                    Cancel
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default AddBooking;

