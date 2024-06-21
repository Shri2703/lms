 
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import LoginPage from './Components/LoginPage';
import StudentDashboard from './Components/StudentDashboard';
import AssignmentDetail from './Components/AssignmentDetail';

function App() {
  return (

    <Router>
      <Routes>
        
        <Route path="/" element={ < StudentDashboard />} />
        <Route path="/login" element={ < LoginPage />} />
        <Route path="/assignment-detail" element={<AssignmentDetail />} />
      </Routes>
    </Router>
    
  );
}

export default App;
