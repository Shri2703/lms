// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from './Components/LoginPage';
import Signup from './Components/Signup';
import StudentDashboard from './Components/StudentDashboard';
import AdminDashboard from './Components/AdminDashboard';
import AssignmentUpload from './Components/AssignmentUpload';
import AssignmentDetails from './Components/AssignmentDetails'
// import EvaluatorDashboard from './EvaluatorDashboard';

const App = () => {
  const isAuthenticated = () => !!localStorage.getItem('token');

  // const PrivateRoute = ({ element, ...rest }) => (
  //   <Route
  //     {...rest}
  //     element={isAuthenticated() ? element : <Navigate to="/login" />}
  //   />
  // );

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/studentdashboard" element={<StudentDashboard />} />
        <Route path="/admindashboard" element={<AdminDashboard />} />
        <Route path="/assignmentUpload" element={<AssignmentUpload />} />
        <Route path="/assignmentdetails" element={<AssignmentDetails/>} />
        {/* <PrivateRoute path="/evaluator/dashboard" element={<EvaluatorDashboard />} /> */}
      </Routes>
    </Router>
  );
};

export default App;


// import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// import './App.css';
// import LoginPage from './Components/LoginPage';
// import StudentDashboard from './Components/StudentDashboard';
// import AssignmentDetail from './Components/AssignmentDetail';
// import Signup from './Components/Signup';

// function App() {
//   return (

//     <Router>
//       <Routes>
        
//         <Route path="/" element={ < StudentDashboard />} />
//         <Route path="/Signup" element={ < Signup />} />
//         <Route path="/login" element={ < LoginPage />} />
//         <Route path="/assignment-detail" element={<AssignmentDetail />} />
//       </Routes>
//     </Router>
    
//   );
// }

// export default App;
