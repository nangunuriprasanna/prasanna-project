# Transport Booking System

A comprehensive frontend-only React application for managing transport bookings with authentication, dashboard, profile management, and full CRUD operations.

## Project Overview

This project is a Standard Operating Procedure (SOP) compliant transport booking system built with React, Bootstrap, and LocalStorage for data persistence.

## Features

### ✅ Authentication
- User Registration with validation
- User Login with validation
- Secure session management using LocalStorage
- Protected routes

### ✅ Dashboard
- Real-time statistics (Total, Pending, Confirmed, Upcoming bookings)
- Recent bookings display
- Quick navigation to create new bookings

### ✅ Booking Management
- Create transport bookings with full validation:
  - Origin and destination locations
  - Booking date and time
  - Vehicle type selection (Sedan, SUV, Van, Bus, Truck, Motorcycle)
  - Number of passengers
  - Contact information (name, phone, email)
  - Special requests
- View all bookings with filtering options
- Update booking status (Pending, Confirmed, Completed, Cancelled)
- Delete bookings
- Filter by status (All, Pending, Confirmed, Completed, Cancelled)
- Upcoming bookings highlighting

### ✅ Profile Management
- View and update user profile
- Change name and email
- Form validation

### ✅ Data Persistence
- All data stored in browser LocalStorage
- Automatic save/load functionality
- Data persists across browser sessions

### ✅ Responsive Design
- Fully responsive layout using Bootstrap 5
- Mobile-friendly navigation
- Works on all device sizes

## Technology Stack

- **React 19.2.3** - UI framework
- **React Router DOM 6.22.3** - Routing
- **Bootstrap 5.3.3** - Styling and responsive design
- **React Bootstrap 2.10.2** - Bootstrap components for React
- **LocalStorage API** - Data persistence

## Project Structure

```
trans-port/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   ├── AddBooking.js        # Booking creation form
│   │   ├── Dashboard.js         # Dashboard with stats
│   │   ├── Login.js             # Login page
│   │   ├── Navbar.js            # Navigation bar
│   │   ├── PrivateRoute.js      # Route protection
│   │   ├── Profile.js           # User profile page
│   │   ├── Register.js          # Registration page
│   │   └── BookingList.js       # Booking listing with filters
│   ├── context/
│   │   └── AuthContext.js       # Authentication context
│   ├── utils/
│   │   └── localStorage.js      # LocalStorage utilities
│   ├── App.js                   # Main app component with routing
│   ├── App.css                  # App styles
│   ├── index.js                 # Entry point
│   └── index.css                # Global styles
├── package.json
└── README.md
```

## Installation & Setup

1. **Install Dependencies**
   ```bash
   cd trans-port
   npm install
   ```

2. **Start Development Server**
   ```bash
   npm start
   ```
   The app will open at `http://localhost:3000`

3. **Build for Production**
   ```bash
   npm run build
   ```

## Usage

### Getting Started

1. **Register a New Account**
   - Navigate to the Register page
   - Fill in your name, email, and password
   - Submit the form (validation will ensure data quality)

2. **Login**
   - Use your registered credentials to login
   - You'll be redirected to the Dashboard

3. **Create a Booking**
   - Click "New Booking" from the navigation or dashboard
   - Fill in booking details:
     - **Origin** (required): Pickup location
     - **Destination** (required): Drop-off location
     - **Booking Date** (required): Cannot be in the past
     - **Booking Time** (required): Preferred time
     - **Vehicle Type** (required): Sedan, SUV, Van, Bus, Truck, or Motorcycle
     - **Passengers** (required): Number of passengers (1-50)
     - **Contact Information** (required): Name, phone, email
     - **Special Requests** (optional): Any additional notes
   - Submit to create the booking

4. **Manage Bookings**
   - View all bookings on the Bookings page
   - Filter by status (Pending, Confirmed, Completed, Cancelled)
   - Update booking status:
     - Pending → Confirm or Cancel
     - Confirmed → Mark Complete or Set Pending
   - Delete bookings you no longer need

5. **Update Profile**
   - Navigate to Profile from the navigation
   - Update your name and email
   - Changes are saved automatically

## Form Validations

### Registration Form
- Name: Required, 2-50 characters
- Email: Required, valid email format
- Password: Required, minimum 6 characters
- Confirm Password: Must match password

### Login Form
- Email: Required, valid email format
- Password: Required, minimum 6 characters

### Booking Form
- Origin: Required, 3-100 characters
- Destination: Required, 3-100 characters
- Booking Date: Required, cannot be in the past
- Booking Time: Required
- Vehicle Type: Required selection
- Passengers: Required, 1-50 passengers
- Contact Name: Required, minimum 2 characters
- Contact Phone: Required, valid phone format, minimum 10 digits
- Contact Email: Required, valid email format
- Special Requests: Optional, max 500 characters

### Profile Form
- Name: Required, 2-50 characters
- Email: Required, valid email format

## Data Storage

All data is stored in browser LocalStorage:
- **User Data**: `user` key
- **Bookings**: `bookings` key
- **Registered Users**: `users` key
- **Theme**: `theme` key (for future dark mode)

## Booking Status Flow

1. **Pending** - New booking created, awaiting confirmation
2. **Confirmed** - Booking confirmed and ready
3. **Completed** - Transport service completed
4. **Cancelled** - Booking cancelled

## Vehicle Types

- 🚗 **Sedan** - Standard 4-door car
- 🚙 **SUV** - Sport Utility Vehicle
- 🚐 **Van** - Passenger van
- 🚌 **Bus** - Large passenger bus
- 🚚 **Truck** - Cargo transport
- 🏍️ **Motorcycle** - Two-wheeled vehicle

## Quality Checklist

✅ All forms have comprehensive validation
✅ UI is fully responsive and works across devices
✅ LocalStorage saves and loads data properly
✅ All screens follow consistent design guidelines
✅ Error handling for all user interactions
✅ Loading states for better UX
✅ Protected routes for authenticated pages

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Development Workflow

This project follows a 4-day development workflow:

- **Day 1**: Layout creation and basic components ✅
- **Day 2**: Functionality implementation (core JS logic) ✅
- **Day 3**: Enhancements, validations, and interactivity ✅
- **Day 4**: Final testing, polishing, and packaging ✅

## Notes

- This is a frontend-only application
- No backend server required
- All data persists in browser LocalStorage
- This SOP is confidential and intended for internal use only

## Future Enhancements

- Dark mode theme toggle
- Data export/import functionality
- Booking search functionality
- Route mapping integration
- Price calculation
- Driver assignment
- SMS/Email notifications
- Booking calendar view
- Recurring bookings

## License

Internal use only - Confidential
