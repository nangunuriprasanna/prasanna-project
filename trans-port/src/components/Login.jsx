import React, { useState } from 'react';
import { Container, Card, Form, Button, Alert, Row, Col } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import Loader from './Loader';
import Logo from './Logo';
import TransportIllustration from './TransportIllustration';

const Login = () => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [alert, setAlert] = useState({ show: false, message: '', variant: '' });
  const { login } = useAuth();
  const navigate = useNavigate();

  const validate = () => {
    const newErrors = {};

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = 'Email address is required. Please enter your email to continue.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address. Format should be: name@example.com';
    } else if (formData.email.length > 100) {
      newErrors.email = 'Email address is too long. Maximum 100 characters allowed.';
    } else if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(formData.email)) {
      newErrors.email = 'Email address format is invalid. Please check for typos and ensure it follows the format: name@domain.com';
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required. Please enter your password to continue.';
    } else if (formData.password.length < 6) {
      newErrors.password = `Password must be at least 6 characters long. You entered ${formData.password.length} character${formData.password.length !== 1 ? 's' : ''}. Please add ${6 - formData.password.length} more character${6 - formData.password.length > 1 ? 's' : ''}.`;
    } else if (formData.password.length > 128) {
      newErrors.password = 'Password is too long. Maximum 128 characters allowed.';
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

    // Simulate login delay
    setTimeout(() => {
      const result = login(formData.email, formData.password);
      
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
      <div style={{ position: 'absolute', top: '-50px', right: '-50px', width: '300px', height: '300px', background: 'rgba(255,255,255,0.1)', borderRadius: '50%', zIndex: 0 }}></div>
      <div style={{ position: 'absolute', bottom: '-100px', left: '-100px', width: '400px', height: '400px', background: 'rgba(255,255,255,0.05)', borderRadius: '50%', zIndex: 0 }}></div>
      
      <Container style={{ position: 'relative', zIndex: 1 }}>
        <Row className="justify-content-center align-items-center" style={{ minHeight: '80vh' }}>
          <Col md={5} lg={4} className="mb-4 mb-md-0">
            <div className="text-center">
              <TransportIllustration type="fleet" size="large" />
            </div>
          </Col>
          <Col md={6} lg={5}>
            <div className="text-center mb-4">
              <div className="mb-3" style={{ display: 'flex', justifyContent: 'center' }}>
                <Logo size="large" showText={true} className="text-white" />
              </div>
              <h2 className="text-white mb-2" style={{ fontWeight: 700 }}>Welcome Back!</h2>
              <p className="text-white mb-3" style={{ opacity: 0.9 }}>Sign in to continue your journey</p>
              <div className="text-white" style={{ opacity: 0.8, fontStyle: 'italic' }}>
                <p className="mb-0" style={{ fontSize: '0.95rem' }}>"Travel with confidence, book with ease"</p>
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
                </Form.Group>

                <Button variant="primary" type="submit" className="w-100 mb-3">
                  Login
                </Button>

                <div className="text-center">
                  <p className="mb-0">
                    Don't have an account? <Link to="/register">Register here</Link>
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

export default Login;

