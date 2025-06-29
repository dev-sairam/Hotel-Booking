import './style.css'

class HotelReservationSystem {
  constructor() {
    // Hotel structure: 97 rooms across 10 floors
    this.rooms = this.initializeRooms();
    this.occupiedRooms = new Set();
    this.bookedRooms = new Set();
    
    this.init();
  }

  initializeRooms() {
    const rooms = {};
    
    // Floors 1-9: 10 rooms each (101-110, 201-210, etc.)
    for (let floor = 1; floor <= 9; floor++) {
      for (let room = 1; room <= 10; room++) {
        const roomNumber = floor * 100 + room;
        rooms[roomNumber] = {
          floor: floor,
          position: room,
          status: 'available'
        };
      }
    }
    
    // Floor 10: 7 rooms (1001-1007)
    for (let room = 1; room <= 7; room++) {
      const roomNumber = 1000 + room;
      rooms[roomNumber] = {
        floor: 10,
        position: room,
        status: 'available'
      };
    }
    
    return rooms;
  }

  init() {
    this.renderHotel();
    this.setupEventListeners();
  }

  setupEventListeners() {
    document.getElementById('bookRooms').addEventListener('click', () => {
      const roomCount = parseInt(document.getElementById('roomCount').value);
      this.bookRooms(roomCount);
    });

    document.getElementById('generateRandom').addEventListener('click', () => {
      this.generateRandomOccupancy();
    });

    document.getElementById('resetBooking').addEventListener('click', () => {
      this.resetBookings();
    });
  }

  renderHotel() {
    const hotelFloorsDiv = document.getElementById('hotelFloors');
    hotelFloorsDiv.innerHTML = '';

    // Render floors from 10 to 1 (top to bottom)
    for (let floor = 10; floor >= 1; floor--) {
      const floorDiv = document.createElement('div');
      floorDiv.className = 'floor';

      const floorLabel = document.createElement('div');
      floorLabel.className = 'floor-label';
      floorLabel.textContent = `Floor ${floor}`;

      const roomsDiv = document.createElement('div');
      roomsDiv.className = 'rooms';

      // Get rooms for this floor
      const floorRooms = Object.keys(this.rooms)
        .filter(roomNum => this.rooms[roomNum].floor === floor)
        .sort((a, b) => parseInt(a) - parseInt(b));

      floorRooms.forEach(roomNum => {
        const roomDiv = document.createElement('div');
        roomDiv.className = 'room-box';
        roomDiv.textContent = roomNum;
        roomDiv.dataset.room = roomNum;

        // Set room status
        if (this.bookedRooms.has(parseInt(roomNum))) {
          roomDiv.classList.add('booked');
        } else if (this.occupiedRooms.has(parseInt(roomNum))) {
          roomDiv.classList.add('occupied');
        } else {
          roomDiv.classList.add('available');
        }

        roomsDiv.appendChild(roomDiv);
      });

      floorDiv.appendChild(floorLabel);
      floorDiv.appendChild(roomsDiv);
      hotelFloorsDiv.appendChild(floorDiv);
    }
  }

  calculateTravelTime(room1, room2) {
    const r1 = this.rooms[room1];
    const r2 = this.rooms[room2];
    
    // Vertical travel: 2 minutes per floor
    const verticalTime = Math.abs(r1.floor - r2.floor) * 2;
    
    // Horizontal travel: 1 minute per room (only if on same floor)
    const horizontalTime = r1.floor === r2.floor ? Math.abs(r1.position - r2.position) : 0;
    
    return verticalTime + horizontalTime;
  }

  calculateTotalTravelTime(roomList) {
    if (roomList.length <= 1) return 0;
    
    let totalTime = 0;
    for (let i = 0; i < roomList.length - 1; i++) {
      totalTime += this.calculateTravelTime(roomList[i], roomList[i + 1]);
    }
    return totalTime;
  }

  getAvailableRooms() {
    return Object.keys(this.rooms)
      .map(Number)
      .filter(roomNum => !this.occupiedRooms.has(roomNum) && !this.bookedRooms.has(roomNum))
      .sort((a, b) => a - b);
  }

  findOptimalRooms(requestedCount) {
    const availableRooms = this.getAvailableRooms();
    
    if (availableRooms.length < requestedCount) {
      return null; // Not enough rooms available
    }

    let bestCombination = null;
    let minTravelTime = Infinity;
    let bestFloor = Infinity; // Track the best floor for tie-breaking

    // Try to book rooms on the same floor first
    for (let floor = 1; floor <= 10; floor++) {
      const floorRooms = availableRooms.filter(room => this.rooms[room].floor === floor);
      
      if (floorRooms.length >= requestedCount) {
        // Find the best consecutive sequence on this floor
        const bestFloorCombination = this.findBestConsecutiveRooms(floorRooms, requestedCount);
        const travelTime = this.calculateTotalTravelTime(bestFloorCombination);
        
        // Prefer lower travel time, or lower floor if travel time is equal
        if (travelTime < minTravelTime || (travelTime === minTravelTime && floor < bestFloor)) {
          minTravelTime = travelTime;
          bestCombination = bestFloorCombination;
          bestFloor = floor;
        }
      }
    }

    // If we found a same-floor solution, return it
    if (bestCombination) {
      return { rooms: bestCombination, travelTime: minTravelTime };
    }

    // If no same-floor solution, find the best cross-floor combination
    // This is computationally expensive, so we'll use a heuristic approach
    return this.findCrossFloorOptimalRooms(availableRooms, requestedCount);
  }

  findCrossFloorOptimalRooms(availableRooms, requestedCount) {
    let bestCombination = null;
    let minTravelTime = Infinity;

    // Group rooms by floor
    const roomsByFloor = {};
    availableRooms.forEach(room => {
      const floor = this.rooms[room].floor;
      if (!roomsByFloor[floor]) roomsByFloor[floor] = [];
      roomsByFloor[floor].push(room);
    });

    // Try combinations starting from floors with most available rooms
    const floors = Object.keys(roomsByFloor).sort((a, b) => 
      roomsByFloor[b].length - roomsByFloor[a].length
    );

    // Greedy approach: start with the floor that has the most rooms
    // and try to minimize cross-floor travel
    let selectedRooms = [];
    let remainingCount = requestedCount;

    for (const floor of floors) {
      if (remainingCount === 0) break;
      
      const floorRooms = roomsByFloor[floor].sort((a, b) => 
        this.rooms[a].position - this.rooms[b].position
      );
      
      const takeFromFloor = Math.min(remainingCount, floorRooms.length);
      selectedRooms.push(...floorRooms.slice(0, takeFromFloor));
      remainingCount -= takeFromFloor;
    }

    if (selectedRooms.length >= requestedCount) {
      const combination = selectedRooms.slice(0, requestedCount);
      const travelTime = this.calculateTotalTravelTime(combination);
      return { rooms: combination, travelTime };
    }

    return null;
  }

  findBestConsecutiveRooms(floorRooms, requestedCount) {
    // Sort rooms by position
    const sortedRooms = floorRooms.sort((a, b) => 
      this.rooms[a].position - this.rooms[b].position
    );
    
    let bestSequence = [];
    let minTravelTime = Infinity;
    
    // Try all possible consecutive sequences of the requested length
    for (let i = 0; i <= sortedRooms.length - requestedCount; i++) {
      const sequence = sortedRooms.slice(i, i + requestedCount);
      const travelTime = this.calculateTotalTravelTime(sequence);
      
      if (travelTime < minTravelTime) {
        minTravelTime = travelTime;
        bestSequence = sequence;
      }
    }
    
    return bestSequence.length > 0 ? bestSequence : sortedRooms.slice(0, requestedCount);
  }

  bookRooms(count) {
    if (count < 1 || count > 5) {
      this.showBookingResult('Please enter a number between 1 and 5.', 'error');
      return;
    }

    const result = this.findOptimalRooms(count);
    
    if (!result) {
      this.showBookingResult(`Sorry, unable to find ${count} available rooms.`, 'error');
      return;
    }

    // Clear previous bookings
    this.bookedRooms.clear();
    
    // Book the rooms
    result.rooms.forEach(room => {
      this.bookedRooms.add(room);
    });

    this.renderHotel();
    
    const roomNumbers = result.rooms.join(', ');
    const floors = [...new Set(result.rooms.map(room => this.rooms[room].floor))];
    let floorText = floors.length === 1 ? `Floor ${floors[0]}` : `Floors ${floors.join(', ')}`;
    
    this.showBookingResult(
      `Successfully booked ${count} room(s): ${roomNumbers} (${floorText})`, 
      'success'
    );
    this.showTravelTime(result.travelTime);
  }

  showBookingResult(message, type) {
    const resultDiv = document.getElementById('bookingResult');
    resultDiv.textContent = message;
    resultDiv.className = type;
  }

  showTravelTime(time) {
    const travelTimeDiv = document.getElementById('travelTime');
    if (time === 0) {
      travelTimeDiv.textContent = 'Total travel time: 0 minutes (single room or adjacent rooms)';
    } else {
      travelTimeDiv.textContent = `Total travel time between first and last room: ${time} minutes`;
    }
  }

  generateRandomOccupancy() {
    // Clear current occupancy
    this.occupiedRooms.clear();
    this.bookedRooms.clear();
    
    const allRooms = Object.keys(this.rooms).map(Number);
    const occupancyRate = 0.3 + Math.random() * 0.4; // 30-70% occupancy
    const roomsToOccupy = Math.floor(allRooms.length * occupancyRate);
    
    // Randomly select rooms to occupy
    const shuffled = [...allRooms].sort(() => Math.random() - 0.5);
    for (let i = 0; i < roomsToOccupy; i++) {
      this.occupiedRooms.add(shuffled[i]);
    }
    
    this.renderHotel();
    this.showBookingResult(
      `Generated random occupancy: ${roomsToOccupy} out of ${allRooms.length} rooms occupied (${Math.round(occupancyRate * 100)}%)`, 
      'success'
    );
    document.getElementById('travelTime').textContent = '';
  }

  resetBookings() {
    this.occupiedRooms.clear();
    this.bookedRooms.clear();
    this.renderHotel();
    this.showBookingResult('All bookings have been reset.', 'success');
    document.getElementById('travelTime').textContent = '';
  }
}

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
  new HotelReservationSystem();
});
