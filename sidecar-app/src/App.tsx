import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Landing from './Landing/Landing';
import Workspace from './Workspace/Workspace';
import Personnel from './Personnel/Personnel';
import Command from './Command/Command';
import Analytics from './Analytics/Analytics';
import AdvancedSearch from './AdvancedSearch/AdvancedSearch';
import './App.css';

function AnimatedRoutes() {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Landing />} />
        <Route path="/landing" element={<Landing />} />
        <Route path="/workspace" element={<Workspace />} />
        <Route path="/advanced-search" element={<AdvancedSearch />} />
        <Route path="/personnel/:id" element={<Personnel />} />
        <Route path="/command" element={<Command />} />
        <Route path="/analytics" element={<Analytics />} />
      </Routes>
    </AnimatePresence>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AnimatedRoutes />
    </BrowserRouter>
  );
}

export default App;
