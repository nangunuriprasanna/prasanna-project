import React, { useState, useEffect } from 'react';
import { Container, Card, Form, Button, Alert, Row, Col } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';
import Loader from './Loader';

const Profile = () => {
  const { user, updateProfile } = useAuth();
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: ''
  });
  const [errors, setErrors] = useState({});
  const [alert, setAlert] = useState({ show: false, message: '', variant: '' });

  useEffect(() => {
    if (user) {
      // Simulate loading delay
      setTimeout(() => {
        setFormData({
          name: user.name || '',
          email: user.email || ''
        });
        setLoading(false);
      }, 300);
    } else {
      setLoading(false);
    }
  }, [user]);

  const validate = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Full name is required. Please enter your name to update your profile.';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters long. Please enter your full name.';
    } else if (formData.name.trim().length > 50) {
      newErrors.name = 'Name is too long. Maximum 50 characters allowed. Please shorten your name.';
    } else if (!/^[a-zA-Z\s.'-]+$/.test(formData.name.trim())) {
      newErrors.name = 'Name contains invalid characters. Please use only letters, spaces, apostrophes, periods, and hyphens.';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email address is required. Please enter your email to update your profile.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address. Format should be: name@example.com';
    } else if (formData.email.length > 100) {
      newErrors.email = 'Email address is too long. Maximum 100 characters allowed.';
    } else if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(formData.email)) {
      newErrors.email = 'Email address format is invalid. Please check for typos and ensure it follows the format: name@domain.com';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validate()) {
      const errorMessages = Object.values(errors).join(' ');
      setAlert({
        show: true,
        message: `Please fix the following errors: ${errorMessages}`,
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

    // Simulate update delay
    setTimeout(() => {
      updateProfile({
        name: formData.name.trim(),
        email: formData.email.trim()
      });

      setAlert({
        show: true,
        message: 'Profile updated successfully!',
        variant: 'success'
      });
      setLoading(false);
    }, 500);
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <Container>
      <div className="hero-section mb-4">
        <h1 className="text-white mb-2">👤 Profile Settings</h1>
        <p className="text-white mb-0">Manage your account information</p>
      </div>
      <Row className="justify-content-center">
        <Col md={8} lg={6}>
          <Card className="shadow-lg" style={{ borderRadius: '20px', border: 'none' }}>
            <Card.Body className="p-4">
              {alert.show && (
                <Alert variant={alert.variant} dismissible onClose={() => setAlert({ show: false })}>
                  {alert.message}
                </Alert>
              )}

              <div className="text-center mb-4">
                <div className="bg-primary text-white rounded-circle d-inline-flex align-items-center justify-content-center" style={{ width: '80px', height: '80px', fontSize: '32px' }}>
                  {user?.name?.charAt(0).toUpperCase() || 'U'}
                </div>
                <h4 className="mt-3 mb-0">{user?.name || 'User'}</h4>
                <p className="text-muted">{user?.email || ''}</p>
              </div>

              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label>Full Name <span className="text-danger">*</span></Form.Label>
                  <Form.Control
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter your full name"
                    isInvalid={!!errors.name}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.name}
                  </Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Email Address <span className="text-danger">*</span></Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter your email"
                    isInvalid={!!errors.email}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.email}
                  </Form.Control.Feedback>
                </Form.Group>

                <div className="mb-3">
                  <Form.Label>Account Created</Form.Label>
                  <Form.Control
                    type="text"
                    value={user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                    disabled
                    readOnly
                  />
                </div>

                <Button variant="primary" type="submit" className="w-100">
                  Update Profile
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Profile;

