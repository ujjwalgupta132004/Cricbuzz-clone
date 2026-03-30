import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useState } from 'react';
import { SportProvider } from './context/SportsContext';
import { AuthProvider } from './context/AuthContext';

import Sidebar from './components/common/Sidebar';
import TopBar from './components/common/TopBar';

import Dashboard from './pages/Home';
import LiveScores from './pages/LiveScores';
import MatchDetail from './pages/MatchDetail';
import News from './pages/News';
import AIAssistant from './pages/AIAssistant';
import PlayerProfile from './pages/PlayerProfile';
import Login from './pages/Login';
import Register from './pages/Register';
import Standings from './pages/Standings';
import CricketPage from './pages/CricketPage';
import FootballPage from './pages/FootballPage';
import TennisPage from './pages/TennisPage';
import TeamComparison from './pages/TeamComparison';

function App() {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <AuthProvider>
            <SportProvider>
                <BrowserRouter>
                    <div className="app-layout">
                        <Sidebar
                            isOpen={sidebarOpen}
                            onClose={() => setSidebarOpen(false)}
                            user={null}
                        />
                        <div className="main-area">
                            <TopBar onMenuToggle={() => setSidebarOpen(prev => !prev)} />
                            <main className="content-area">
                                <Routes>
                                    <Route path="/" element={<Dashboard />} />
                                    <Route path="/live" element={<LiveScores />} />
                                    <Route path="/match/:id" element={<MatchDetail />} />
                                    <Route path="/news" element={<News />} />
                                    <Route path="/ai" element={<AIAssistant />} />
                                    <Route path="/player/:sport/:id" element={<PlayerProfile />} />
                                    <Route path="/login" element={<Login />} />
                                    <Route path="/register" element={<Register />} />
                                    <Route path="/standings" element={<Standings />} />
                                    <Route path="/cricket" element={<CricketPage />} />
                                    <Route path="/football" element={<FootballPage />} />
                                    <Route path="/tennis" element={<TennisPage />} />
                                    <Route path="/compare" element={<TeamComparison />} />
                                </Routes>
                            </main>
                        </div>
                    </div>
                </BrowserRouter>
            </SportProvider>
        </AuthProvider>
    );
}

export default App;
