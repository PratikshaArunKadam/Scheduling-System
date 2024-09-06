import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import { getUserSessions, updateSession, deleteSession } from '../services/api';

// Set the app element for accessibility
Modal.setAppElement('#root');

const SessionForm = () => {
  const [sessions, setSessions] = useState([]);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentSession, setCurrentSession] = useState(null);
  const [newStart, setNewStart] = useState('');
  const [newEnd, setNewEnd] = useState('');
  const userId = localStorage.getItem('email'); // Assuming email is used as userId

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const response = await getUserSessions(userId);
        console.log('API response:', response); // Log the entire response

        if (Array.isArray(response)) {
          setSessions(response);
        } else {
          throw new Error('Unexpected data format');
        }
      } catch (err) {
        console.error('Failed to fetch sessions:', err);
        setError('Failed to load sessions.');
      }
    };

    fetchSessions();
  }, [userId]);

  const handleReschedule = async () => {
    try {
      await updateSession(currentSession._id, { start: newStart, end: newEnd });
      alert('Session rescheduled successfully!');
      setIsModalOpen(false);

      // Refresh session list
      const response = await getUserSessions(userId);
      console.log('API response after reschedule:', response); // Log the response after rescheduling

      if (Array.isArray(response)) {
        setSessions(response);
      } else {
        throw new Error('Unexpected data format');
      }
    } catch (err) {
      console.error('Failed to reschedule session:', err);
      setError('Failed to reschedule session.');
    }
  };

  const handleCancel = async (id) => {
    try {
      await deleteSession(id);
      alert('Session canceled successfully!');

      // Refresh session list
      const response = await getUserSessions(userId);
      console.log('API response after cancel:', response); // Log the response after canceling

      if (Array.isArray(response)) {
        setSessions(response);
      } else {
        throw new Error('Unexpected data format');
      }
    } catch (err) {
      console.error('Failed to cancel session:', err);
      setError('Failed to cancel session.');
    }
  };

  return (
    <div className="p-4 max-w-4xl mx-auto bg-white shadow-md rounded-md">
      <h1 className="text-3xl font-bold mb-4">Manage Sessions</h1>
      {error && <div className="text-red-500 mb-4">{error}</div>}
      <ul className="space-y-4">
        {Array.isArray(sessions) && sessions.length > 0 ? (
          sessions.map((session) => (
            <li key={session._id} className="border rounded-md p-4 bg-gray-50 shadow-sm">
              <h2 className="text-xl font-semibold">{new Date(session.start).toLocaleString()}</h2>
              <p className="text-gray-600">{new Date(session.end).toLocaleString()}</p>
              <div className="mt-2">
                <h3 className="font-medium">Participants:</h3>
                {session.attendees && session.attendees.length > 0 ? (
                  <ul className="list-disc ml-5">
                    {session.attendees.map((attendee, index) => (
                      <li key={index} className="text-gray-700">
                        {attendee.name} ({attendee.email})
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-500">No participants yet.</p>
                )}
              </div>
              <div className="mt-4 flex gap-4">
                <button
                  onClick={() => {
                    setCurrentSession(session);
                    setIsModalOpen(true);
                  }}
                  className="bg-yellow-500 text-white py-2 px-4 rounded-md hover:bg-yellow-600"
                >
                  Reschedule
                </button>
                <button
                  onClick={() => handleCancel(session._id)}
                  className="bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600"
                >
                  Cancel
                </button>
              </div>
            </li>
          ))
        ) : (
          <p>No sessions found.</p>
        )}
      </ul>

      <Modal
        isOpen={isModalOpen}
        onRequestClose={() => setIsModalOpen(false)}
        className="fixed inset-0 flex items-center justify-center p-4 bg-gray-800 bg-opacity-50"
        overlayClassName="fixed inset-0"
      >
        <div className="bg-white p-6 rounded-md shadow-lg max-w-sm w-full">
          <h2 className="text-xl font-semibold mb-4">Reschedule Session</h2>
          <form onSubmit={(e) => {
            e.preventDefault();
            handleReschedule();
          }}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">New Start Time:</label>
              <input
                type="datetime-local"
                value={newStart}
                onChange={(e) => setNewStart(e.target.value)}
                className="p-2 border border-gray-300 rounded-md w-full"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">New End Time:</label>
              <input
                type="datetime-local"
                value={newEnd}
                onChange={(e) => setNewEnd(e.target.value)}
                className="p-2 border border-gray-300 rounded-md w-full"
                required
              />
            </div>
            <div className="flex gap-4">
              <button
                type="submit"
                className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
              >
                Save Changes
              </button>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="bg-gray-500 text-white py-2 px-4 rounded-md hover:bg-gray-600"
              >
                Close
              </button>
            </div>
          </form>
        </div>
      </Modal>
    </div>
  );
};

export default SessionForm;
