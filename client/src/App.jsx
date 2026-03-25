import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/common/Navbar';
import Home from './pages/Home';
import LiveScores from './pages/LiveScores';
import MatchDetail from './pages/MatchDetail';
import News from './pages/News';
import AIAssistant from './pages/AIAssistant';
import { SportProvider } from './context/SportsContext';

function App() {
  return (
    <SportProvider>
      <BrowserRouter>
        <div className="min-h-screen bg-gray-100">
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/live" element={<LiveScores />} />
            <Route path="/match/:id" element={<MatchDetail />} />
            <Route path="/news" element={<News />} />
            <Route path="/ai" element={<AIAssistant />} />
          </Routes>
        </div>
      </BrowserRouter>
    </SportProvider>
  );
}
export default App;
