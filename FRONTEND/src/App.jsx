import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainLayout from './MainLayout.jsx';
import HomePage from './pages/HomePage.jsx';
import LoginPage from './pages/LoginPage.jsx'; 
import SignUpPage from './pages/SignupPage.jsx'; 
import VideoPage from './pages/VideoPage.jsx';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/" element={<MainLayout />}>
          <Route index element={<HomePage />} />
          
          <Route path="channel">
          </Route>
          <Route path="/videos/:id" element={<VideoPage />} /> 
            <Route path="/search" element={<HomePage />} />  
        </Route>
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="*" element={<h1>Not Found</h1>} />
      </Routes>
    </BrowserRouter>
  );
}