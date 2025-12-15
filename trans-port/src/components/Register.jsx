import React, { useState } from 'react';
import { Container, Card, Form, Button, Alert, Row, Col } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import Loader from './Loader';
import Logo from './Logo';
import TransportIllustration from './TransportIllustration';

const Register = () => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});
  const [alert, setAlert] = useState({ show: false, message: '', variant: '' });
  const { register } = useAuth();
  const navigate = useNavigate();

  const validate = () => {
    const newErrors = {};

    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = 'Full name is required. Please enter your name to create an account.';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters long. Please enter your full name.';
    } else if (formData.name.trim().length > 50) {
      newErrors.name = 'Name is too long. Maximum 50 characters allowed. Please shorten your name.';
    } else if (!/^[a-zA-Z\s.'-]+$/.test(formData.name.trim())) {
      newErrors.name = 'Name contains invalid characters. Please use only letters, spaces, apostrophes, periods, and hyphens.';
    }

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = 'Email address is required. Please enter your email to create an account.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address. Format should be: name@example.com';
    } else if (formData.email.length > 100) {
      newErrors.email = 'Email address is too long. Maximum 100 characters allowed.';
    } else if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(formData.email)) {
      newErrors.email = 'Email address format is invalid. Please check for typos and ensure it follows the format: name@domain.com';
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required. Please create a password for your account.';
    } else if (formData.password.length < 6) {
      newErrors.password = `Password must be at least 6 characters long. You entered ${formData.password.length} character${formData.password.length !== 1 ? 's' : ''}. Please add ${6 - formData.password.length} more character${6 - formData.password.length > 1 ? 's' : ''}.`;
    } else if (formData.password.length > 128) {
      newErrors.password = 'Password is too long. Maximum 128 characters allowed.';
    } else if (!/(?=.*[a-z])/.test(formData.password)) {
      newErrors.password = 'Password should contain at least one lowercase letter for better security.';
    } else if (!/(?=.*[A-Z])/.test(formData.password)) {
      newErrors.password = 'Password should contain at least one uppercase letter for better security.';
    } else if (!/(?=.*\d)/.test(formData.password)) {
      newErrors.password = 'Password should contain at least one number for better security.';
    }

    // Confirm password validation
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password by entering it again in the confirm password field.';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match. Please make sure both password fields contain the same password.';
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

    // Simulate registration delay
    setTimeout(() => {
      const result = register(formData.name, formData.email, formData.password);
      
      if (result.success) {
        setAlert({
          show: true,
          message: result.message,
          variant: 'success'
        });
        setTimeout(() => {
          navigate('/dashboard');
        }, 500);
      } else {
        setAlert({
          show: true,
          message: result.message,
          variant: 'danger'
        });
        setLoading(false);
      }
    }, 800);
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <div style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', minHeight: '100vh', padding: '2rem 0', position: 'relative', overflow: 'hidden' }}>
      {/* Decorative background elements */}
      <div style={{ position: 'absolute', top: '-50px', left: '-50px', width: '300px', height: '300px', background: 'rgba(255,255,255,0.1)', borderRadius: '50%', zIndex: 0 }}></div>
      <div style={{ position: 'absolute', bottom: '-100px', right: '-100px', width: '400px', height: '400px', background: 'rgba(255,255,255,0.05)', borderRadius: '50%', zIndex: 0 }}></div>
      
      <Container style={{ position: 'relative', zIndex: 1 }}>
        <Row className="justify-content-center align-items-center" style={{ minHeight: '80vh' }}>
          <Col md={5} lg={4} className="mb-4 mb-md-0">
            <div className="text-center">
              <TransportIllustration type="bus" size="large" />
            </div>
          </Col>
          <Col md={6} lg={5}>
            <div className="text-center mb-4">
              <div className="mb-3" style={{ display: 'flex', justifyContent: 'center' }}>
                <Logo size="large" showText={true} className="text-white" />
              </div>
              <h2 className="text-white mb-2" style={{ fontWeight: 700 }}>Join Us Today!</h2>
              <p className="text-white mb-3" style={{ opacity: 0.9 }}>Create your account and start booking</p>
              <div className="text-white" style={{ opacity: 0.8, fontStyle: 'italic' }}>
                <p className="mb-0" style={{ fontSize: '0.95rem' }}>"Start your journey with us today"</p>
              </div>
            </div>
            <Card className="shadow-lg" style={{ borderRadius: '20px', border: 'none' }}>
              <Card.Body className="p-4">

              {alert.show && (
                <Alert variant={alert.variant} dismissible onClose={() => setAlert({ show: false })}>
                  {alert.message}
                </Alert>
              )}

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

                <Form.Group className="mb-3">
                  <Form.Label>Password <span className="text-danger">*</span></Form.Label>
                  <Form.Control
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Enter your password"
                    isInvalid={!!errors.password}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.password}
                  </Form.Control.Feedback>
                  <Form.Text className="text-muted">
                    Password must be at least 6 characters long
                  </Form.Text>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Confirm Password <span className="text-danger">*</span></Form.Label>
                  <Form.Control
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Confirm your password"
                    isInvalid={!!errors.confirmPassword}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.confirmPassword}
                  </Form.Control.Feedback>
                </Form.Group>

                <Button variant="primary" type="submit" className="w-100 mb-3">
                  Register
                </Button>

                <div className="text-center">
                  <p className="mb-0">
                    Already have an account? <Link to="/login">Login here</Link>
                  </p>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
    </div>
  );
};

export default Register;

