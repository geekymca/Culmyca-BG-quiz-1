import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QuizProvider } from './QuizContext';
import { Background } from './components/Background';
import { LogoHeader } from './components/LogoHeader';
import { LandingPage } from './pages/LandingPage';
import { RegistrationPage } from './pages/RegistrationPage';
import { QuizPage } from './pages/QuizPage';
import { ResultPage } from './pages/ResultPage';
import { LeaderboardPage } from './pages/LeaderboardPage';

import { doc, getDocFromCache } from 'firebase/firestore';
import { db } from './lib/firebase';
import { ErrorBoundary } from './components/ErrorBoundary';

export default function App() {
  React.useEffect(() => {
    const testConnection = async () => {
      try {
        // Simple connection test
        await getDocFromCache(doc(db, '_connection_test_', 'ping'));
      } catch (e) {
        // Ignore cache errors, this is just to trigger initialization
      }
    };
    testConnection();
  }, []);

  return (
    <ErrorBoundary>
      <QuizProvider>
        <Router>
          <div className="relative min-h-screen flex flex-col">
            <Background />
            <LogoHeader />
            
            <main className="flex-grow container mx-auto px-4 py-8">
              <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/register" element={<RegistrationPage />} />
                <Route path="/quiz" element={<QuizPage />} />
                <Route path="/result" element={<ResultPage />} />
                <Route path="/leaderboard" element={<LeaderboardPage />} />
              </Routes>
            </main>

            <footer className="py-8 text-center text-gray-500 text-sm">
              <p>© 2024 EthicCraft Club & JC Bose University (YMCA). All Rights Reserved.</p>
              <p className="mt-2 italic">"Wisdom is the purifier of the soul."</p>
            </footer>
          </div>
        </Router>
      </QuizProvider>
    </ErrorBoundary>
  );
}
