# Hotel Room Reservation System

A sophisticated web application that optimizes hotel room bookings based on travel time minimization across a 97-room hotel.

## 🏨 Hotel Structure

- **Floors 1-9**: 10 rooms each (101-110, 201-210, etc.)
- **Floor 10**: 7 rooms (1001-1007)
- **Total**: 97 rooms across 10 floors

## ✨ Features

### Core Functionality

- **Smart Booking Algorithm**: Automatically finds the optimal room combination that minimizes travel time
- **Travel Time Calculation**:
  - Horizontal: 1 minute per room on the same floor
  - Vertical: 2 minutes per floor using stairs/lift
- **Booking Rules**:
  - Maximum 5 rooms per booking
  - Priority to same-floor bookings
  - Cross-floor optimization when needed

### Interactive Interface

- **Real-time Visualization**: See all 97 rooms with color-coded status
- **Booking Controls**: Easy-to-use interface for room selection
- **Random Occupancy Generator**: Test different scenarios
- **Reset Functionality**: Clear all bookings and start fresh

### Visual Feedback

- 🟢 **Green**: Available rooms
- 🔴 **Gray**: Occupied rooms
- 🟡 **Gold**: Your booked rooms (with glow animation)

## 🚀 Getting Started

### Prerequisites

- Node.js (version 12 or higher)
- npm or yarn

### Installation

1. Clone or download this repository
2. Navigate to the project directory
3. Install dependencies:
   ```bash
   npm install
   ```

### Development

Start the development server:

```bash
npm run dev
```

The application will be available at `http://localhost:3000`

### Build for Production

Create a production build:

```bash
npm run build
```

### Preview Production Build

Preview the production build locally:

```bash
npm run preview
```

## 🎯 How It Works

### Booking Algorithm

1. **Same-Floor Priority**: The system first tries to find all requested rooms on a single floor
2. **Consecutive Rooms**: Within a floor, it prioritizes consecutive room numbers (minimal horizontal travel)
3. **Cross-Floor Optimization**: If same-floor booking isn't possible, it uses a greedy algorithm to minimize total travel time
4. **Travel Time Calculation**: Considers both vertical (floor-to-floor) and horizontal (room-to-room) distances

### Example Scenarios

**Scenario 1: Same Floor Available**

- Request: 4 rooms
- Available on Floor 1: 101, 102, 105, 106
- Result: Books 101, 102, 105, 106 (minimal travel time)

**Scenario 2: Cross-Floor Booking**

- Request: 4 rooms
- Floor 1: Only 101, 102 available
- Floor 2: 201, 202 available
- Result: Books 101, 102, 201, 202 (optimized for minimal vertical travel)

## 🎨 Design Features

- **Modern UI**: Glassmorphism design with gradient backgrounds
- **Responsive**: Works on desktop, tablet, and mobile devices
- **Animations**: Smooth transitions and glow effects for booked rooms
- **Accessibility**: Proper color contrast and keyboard navigation

## 🛠️ Technology Stack

- **Frontend**: HTML5, CSS3, Vanilla JavaScript (ES6+)
- **Build Tool**: Vite
- **Styling**: Modern CSS with custom properties, flexbox, and grid
- **Architecture**: Class-based JavaScript with modular design

## 📱 Browser Support

- Chrome/Chromium 60+
- Firefox 60+
- Safari 12+
- Edge 79+

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit your changes: `git commit -am 'Add feature'`
4. Push to the branch: `git push origin feature-name`
5. Submit a pull request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🙋‍♂️ Support

If you have any questions or run into issues, please open an issue on the repository or contact the development team.

---

Built with ❤️ using modern web technologies
