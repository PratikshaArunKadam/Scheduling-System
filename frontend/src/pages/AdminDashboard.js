import React, { useState, useEffect } from 'react';
import { getUserAvailability, scheduleSession } from '../services/api';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const [availabilities, setAvailabilities] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [rawAttendeesInput, setRawAttendeesInput] = useState(''); 
  const [sessionDetails, setSessionDetails] = useState({
    start: '',
    end: '',
    duration: 30,
    attendees: [],
  });

  const navigate=useNavigate();
  useEffect(() => {
    if (selectedUser) {
      const fetchAvailabilities = async () => {
        const response = await getUserAvailability(selectedUser);
        setAvailabilities(response.data);
      };

      fetchAvailabilities();
    }
  }, [selectedUser]);

  const parseAttendees = () => {
    // Split input by lines and filter out any empty lines
    const lines = rawAttendeesInput.split('\n').filter(line => line.trim() !== '');
    
    // Parse each line
    const attendees = lines.map(line => {
      // Check for the presence of parentheses and valid structure
      if (!line.includes('(') || !line.includes(')')) {
        console.warn(`Invalid format for attendee line: "${line}"`); // Debugging log for invalid formats
        return null;
      }
      
      // Split the line by the first occurrence of '('
      const [name, emailPart] = line.split(' (');
  
      // Ensure name and email part are found
      if (!name || !emailPart) {
        console.warn(`Parsing failed for line: "${line}"`); // Debugging log for parse failures
        return null;
      }
  
      // Extract email and trim spaces and special characters
      const email = emailPart.replace(')', '').trim();
  
      // Ensure both name and email are not empty after trimming
      if (!name.trim() || !email) {
        console.warn(`Empty name or email found: Name="${name}", Email="${email}"`); // Debugging log for empty fields
        return null;
      }
  
      // Return parsed attendee object
      return { name: name.trim(), email };
    }).filter(attendee => attendee !== null); // Filter out invalid entries
  
    // Log the parsed attendees for debugging
    console.log("Parsed Attendees:", attendees);
  
    return attendees;
  };
  
  const handleSchedule = async () => {
    // Parse attendees before scheduling
    const attendees = parseAttendees();
    console.log("Payload to send:", attendees);
// return false;
    // Ensure session details are updated with the correct attendees
    setSessionDetails(prevDetails => ({ ...prevDetails, attendees }));
   
    try {
      const payload = {
        user: selectedUser,
        start: sessionDetails.start,
        end: sessionDetails.end,
        duration: sessionDetails.duration,
        attendees,
      };

      console.log("Payload to send:", payload); // Debugging: Check payload
    //   return false;
      await scheduleSession(payload);
      alert('Session scheduled successfully!');
      navigate('/session')
    } catch (error) {
      console.error('Conflicting session exists');
      alert('Conflicting session exists');
    }
  };

  const handleSelectTimeSlot = (start, end) => {
    const duration = (new Date(end) - new Date(start)) / (1000 * 60); // Calculate duration in minutes
    setSessionDetails({
      ...sessionDetails,
      start,
      end,
      duration,
    });
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white shadow-md rounded-md border mt-10">
      <h1 className="text-2xl font-bold mb-4 text-center">Admin Dashboard</h1>

      {/* User selection */}
      <div className="mb-4">
        <label className="block mb-2">Select User:</label>
        <input
          type="text"
          className="w-full p-2 border rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={selectedUser || ''}
          onChange={(e) => setSelectedUser(e.target.value)}
          placeholder="Enter User ID"
        />
      </div>

      <h2 className="text-xl font-semibold mb-2">User Availability</h2>
      <ul className="mb-4">
        {availabilities.map((availability) => (
          <li key={availability._id} className="mb-2">
            {new Date(availability.start).toLocaleString()} - {new Date(availability.end).toLocaleString()}
            <button 
              onClick={() => handleSelectTimeSlot(availability.start, availability.end)}
              className="ml-2 p-1 text-white bg-blue-500 rounded shadow-sm hover:bg-blue-600 focus:outline-none"
            >
              Select Slot
            </button>
          </li>
        ))}
      </ul>

      <h2 className="text-xl font-semibold mb-2">Schedule Session</h2>
      <div className="mb-4">
        <label className="block mb-2">Start:</label>
        <input
          type="datetime-local"
          className="w-full p-2 border rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={sessionDetails.start}
          onChange={(e) => setSessionDetails({ ...sessionDetails, start: e.target.value })}
        />
      </div>

      <div className="mb-4">
        <label className="block mb-2">End:</label>
        <input
          type="datetime-local"
          className="w-full p-2 border rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={sessionDetails.end}
          onChange={(e) => {
            const end = e.target.value;
            const duration = (new Date(end) - new Date(sessionDetails.start)) / (1000 * 60);
            setSessionDetails({ ...sessionDetails, end, duration });
          }}
        />
      </div>

      <div className="mb-4">
        <label className="block mb-2">Duration (minutes):</label>
        <input
          type="number"
          className="w-full p-2 border rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={sessionDetails.duration}
          readOnly
        />
      </div>

      {/* Attendees */}
      <div className="mb-4">
        <label className="block mb-2">Attendees:</label>
        <textarea
          className="w-full p-2 border rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={rawAttendeesInput}
          onChange={(e) => setRawAttendeesInput(e.target.value)} 
          placeholder="Enter attendees in format: Name (email)"
        />
      </div>

      <button 
        onClick={handleSchedule}
        className="w-full p-2 text-white bg-green-500 rounded shadow-sm hover:bg-green-600 focus:outline-none"
      >
        Schedule Session
      </button>
    </div>
  );
};

export default AdminDashboard;
