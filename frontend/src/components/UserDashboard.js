// import React, { useState, useEffect } from 'react';
// import { getUserSessions } from '../services/api';

// const UserDashboard = () => {
//   const [sessions, setSessions] = useState([]);
//   const userId = localStorage.getItem('email'); // Ensure this is correctly set

//   useEffect(() => {
//     const fetchSessions = async () => {
//       try {
//         const response = await getUserSessions(userId);
//         if (response.data) {
//           setSessions(response.data);
//         }
//       } catch (error) {
//         console.error('Error fetching sessions:', error);
//       }
//     };

//     fetchSessions();
//   }, [userId]);

//   return (
//     <div className="container mx-auto p-4">
//       <h1 className="text-2xl font-bold mb-4">Your Upcoming Sessions</h1>
//       {sessions.length === 0 ? (
//         <p className="text-gray-500">No upcoming sessions.</p>
//       ) : (
//         <ul className="space-y-4">
//           {sessions.map((session) => (
//             <li key={session._id} className="bg-white shadow-md rounded-lg p-4">
//               <div className="text-lg font-semibold">
//                 {new Date(session.start).toLocaleString()} - {new Date(session.end).toLocaleString()}
//               </div>
//               <div className="mt-2">
//                 <h2 className="text-md font-medium">Participants:</h2>
//                 <ul className="list-disc ml-5">
//                   {session.scheduledSlots && session.scheduledSlots.length > 0 ? (
//                     session.scheduledSlots[0].attendees.map((attendee, index) => (
//                       <li key={index} className="text-gray-700">
//                         {attendee.name} ({attendee.email})
//                       </li>
//                     ))
//                   ) : (
//                     <p className="text-gray-500">No participants listed.</p>
//                   )}
//                 </ul>
//               </div>
//             </li>
//           ))}
//         </ul>
//       )}
//     </div>
//   );
// };

// export default UserDashboard;
