import { useState } from 'react';
import { Navbar } from './components/Navigation/Navbar';
import { Overview } from './components/Dashboard/Overview';
import { CountryComparison } from './components/Dashboard/CountryComparison';
import { SingaporeAnalysis } from './components/Dashboard/SingaporeAnalysis';
import { IndonesiaAnalysis } from './components/Dashboard/IndonesiaAnalysis';
import { MalaysiaAnalysis } from './components/Dashboard/MalaysiaAnalysis';
import { PhilippinesAnalysis } from './components/Dashboard/PhilippinesAnalysis';
import { VietnamAnalysis } from './components/Dashboard/VietnamAnalysis';
import { ThailandAnalysis } from './components/Dashboard/ThailandAnalysis';
import { RegionalInsights } from './components/Dashboard/RegionalInsights';
import ResearchSupport from './components/Dashboard/ResearchSupport';
import './components/Charts/ChartSetup';
import { HongKongAnalysis } from './components/Dashboard/HongKongAnalysis';
import { GBAAnalysis } from './components/Dashboard/GBAAnalysis';

function App() {
  const [activeTab, setActiveTab] = useState('overview');

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return <Overview onTabChange={setActiveTab}/>;
      case 'comparison':
        return <CountryComparison />;
      case 'singapore':
        return <SingaporeAnalysis />;
      case 'indonesia':
        return <IndonesiaAnalysis />;
      case 'malaysia':
        return <MalaysiaAnalysis />;
      case 'vietnam':
        return <VietnamAnalysis />;
      case 'thailand':
        return <ThailandAnalysis />;
      case 'philippines':
        return <PhilippinesAnalysis />;
      case 'hongkong':
        return <HongKongAnalysis />;
      case 'GBA':
        return <GBAAnalysis />;
      case 'insights':
        return <RegionalInsights />;
      case 'support':
        return <ResearchSupport />;
      default:
        return <Overview onTabChange={setActiveTab}/>;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar activeTab={activeTab} onTabChange={setActiveTab} />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {renderContent()}
      </main>
      
      {/* Footer */}
      <footer className="bg-white border-t mt-16 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-gray-600">
            Health Technology Research Dashboard - Southeast Asia Survey Data Analysis
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Based on survey data from 6,000 participants across Singapore, Philippines, Thailand, Indonesia, Malaysia, and Vietnam
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;