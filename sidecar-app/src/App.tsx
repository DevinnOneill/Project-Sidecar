import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Landing from './Landing/Landing';
import Workspace from './Workspace/Workspace';
import Personnel from './Personnel/Personnel';
import Command from './Command/Command';
import Analytics from './Analytics/Analytics';
import AdvancedSearch from './AdvancedSearch/AdvancedSearch';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/landing" element={<Landing />} />
        <Route path="/workspace" element={<Workspace />} />
        <Route path="/advanced-search" element={<AdvancedSearch />} />
        <Route path="/personnel/:id" element={<Personnel />} />
        <Route path="/command" element={<Command />} />
        <Route path="/analytics" element={<Analytics />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
