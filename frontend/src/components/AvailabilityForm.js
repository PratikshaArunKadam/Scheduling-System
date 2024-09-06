import { useState } from 'react';
import { createAvailability } from '../services/api';
import './AvailabilityForm.css';
import { Navigate, useNavigate } from 'react-router-dom';

const AvailabilityForm = () => {
  const [availabilities, setAvailabilities] = useState([
    { day: 'Monday', slots: [], active: false },
    { day: 'Tuesday', slots: [], active: false },
    { day: 'Wednesday', slots: [], active: false },
    { day: 'Thursday', slots: [], active: false },
    { day: 'Friday', slots: [], active: false },
    { day: 'Saturday', slots: [], active: false },
    { day: 'Sunday', slots: [], active: false },
  ]);

  const navigate = useNavigate();
  const handleToggle = (index) => {
    const newAvailabilities = [...availabilities];
    newAvailabilities[index].active = !newAvailabilities[index].active;
    setAvailabilities(newAvailabilities);
  };

  const handleTimeChange = (index, slotIndex, type, value) => {
    const newAvailabilities = [...availabilities];
    newAvailabilities[index].slots[slotIndex][type] = value;
    setAvailabilities(newAvailabilities);
  };

  const handleDateChange = (index, slotIndex, value) => {
    const newAvailabilities = [...availabilities];
    newAvailabilities[index].slots[slotIndex].date = value;
    setAvailabilities(newAvailabilities);
  };

  const addSlot = (index) => {
    const newAvailabilities = [...availabilities];
    newAvailabilities[index].slots.push({ start: '09:00', end: '17:00', date: '' });
    setAvailabilities(newAvailabilities);
  };

  const removeSlot = (index, slotIndex) => {
    const newAvailabilities = [...availabilities];
    newAvailabilities[index].slots.splice(slotIndex, 1);
    setAvailabilities(newAvailabilities);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const activeAvailabilities = availabilities.filter(a => a.active);
    const userId = localStorage.getItem('email'); // Replace with actual user ID from context/auth

    try {
      await Promise.all(activeAvailabilities.map(availability => {
        return Promise.all(availability.slots.map(slot => {
          // Convert time to Date object for the selected date
          const [startHour, startMinute] = slot.start.split(':');
          const [endHour, endMinute] = slot.end.split(':');

          // Combine date with time for start and end
          const startDate = new Date(slot.date);
          startDate.setHours(startHour, startMinute, 0, 0);

          const endDate = new Date(slot.date);
          endDate.setHours(endHour, endMinute, 0, 0);

          return createAvailability({
            user: userId,
            day: availability.day,
            start: startDate,
            end: endDate,
            duration: (parseInt(endHour) * 60 + parseInt(endMinute)) - (parseInt(startHour) * 60 + parseInt(startMinute)), // Calculate duration in minutes
          });
        }));
      }));
      alert('Availability saved successfully!');
      navigate('/session');
    } catch (error) {
      console.error('Failed to save availability', error);
    }
  };

  return (
    <div className="availability-container">
      <h2 className="availability-title">Set Your Availability</h2>
      <form onSubmit={handleSubmit} className="availability-form">
        {availabilities.map((availability, index) => (
          <div key={availability.day} className="availability-row">
            <label className="switch">
              <input
                type="checkbox"
                checked={availability.active}
                onChange={() => handleToggle(index)}
              />
              <span className="slider round"></span>
            </label>
            <span className="day-label">{availability.day}</span>
            {availability.slots.map((slot, slotIndex) => (
              <div key={slotIndex} className="slot-row">
                <input
                  type="date"
                  value={slot.date}
                  onChange={(e) => handleDateChange(index, slotIndex, e.target.value)}
                  disabled={!availability.active}
                />
                <input
                  type="time"
                  value={slot.start}
                  onChange={(e) => handleTimeChange(index, slotIndex, 'start', e.target.value)}
                  disabled={!availability.active}
                />
                <span className="time-separator">-</span>
                <input
                  type="time"
                  value={slot.end}
                  onChange={(e) => handleTimeChange(index, slotIndex, 'end', e.target.value)}
                  disabled={!availability.active}
                />
                <button type="button" onClick={() => removeSlot(index, slotIndex)}>🗑️</button>
              </div>
            ))}
            <button type="button" onClick={() => addSlot(index)} disabled={!availability.active}>Add Slot</button>
          </div>
        ))}
        <button type="submit" className="save-button">Save Availability</button>
      </form>
    </div>
  );
};

export default AvailabilityForm;
