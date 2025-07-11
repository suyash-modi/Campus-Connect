import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Register from './pages/Register';
import JobBoard from './pages/JobBoard';
import PostJob from './pages/PostJob';
import ApplyJob from './pages/ApplyJob';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import ApplicantsPage from './pages/ApplicantsPage';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-200 text-gray-900">
        <Navbar />
        <div className="p-6">
          <Routes>
            <Route path="/" element={<JobBoard />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            <Route element={<ProtectedRoute allowedRole="COMPANY" />}>
            <Route path="/jobs/:id/applications" element={<ApplicantsPage />} />
              <Route path="/post-job" element={<PostJob />} />
            </Route>
            <Route element={<ProtectedRoute allowedRole="STUDENT" />}>
              <Route path="/jobs/:id/apply" element={<ApplyJob />} />
            </Route>
          </Routes>
        </div>
      </div>
    </Router>
  );
}


export default App;

