import { useState, useEffect } from 'react';
import { combinedHealthData, regions, calculateRegionalStats } from '../../data/combinedData';
import { FlagImage } from './flagImage';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { ChevronLeft, ChevronRight, Play, Image, ExternalLink } from 'lucide-react';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import CustomMarker from "/marker/marker.png"

const locations: { [key: string]: [number, number] } = {
  "Hong Kong": [22.2783, 114.1747],
  "Greater Bay Area": [23.1291, 113.2644],
  //-------------------------------------------
  "Singapore": [1.3521, 103.8198],
  "Indonesia": [-0.7893, 113.9213],
  "Malaysia": [4.2105, 101.9758],
  "Thailand": [15.8700, 100.9925],
  "Philippines": [12.8797, 121.7740],
  "Vietnam": [14.0583, 108.2772],
};

// Map locations to their country codes for flags
const locationFlags = {
  "Hong Kong": "hk",
  "Greater Bay Area": "cn",
  "Singapore": "sg",
  "Indonesia": "id",
  "Malaysia": "my",
  "Thailand": "th",
  "Philippines": "ph",
  "Vietnam": "vn",
};

// Map locations to their corresponding tab names for navigation
const locationTabs = {
  "Hong Kong": "hongkong",
  "Greater Bay Area": "GBA",
  "Singapore": "singapore",
  "Indonesia": "indonesia",
  "Malaysia": "malaysia",
  "Thailand": "thailand",
  "Philippines": "philippines",
  "Vietnam": "vietnam",
};

// Define different slides
const mapSlides: {
  title: string;
  type: "map" | "image" | "video";
  center?: [number, number];
  zoom?: number;
  description: string;
}[] = [
  {
    title: "Interactive Study Locations Map",
    type: "map",
    center: [10.8, 106.9] as [number, number],
    zoom: 4.5,
    description: "Interactive map showing all study locations across Hong Kong, Greater Bay Area, and Southeast Asia"
  },
  // {
  //   title: "Health Technology Usage Trends",
  //   type: "image",
  //   description: "Visual analysis of health app and wearable device usage patterns across different regions"
  // },
  // {
  //   title: "Regional Comparison Video",
  //   type: "video",
  //   description: "Animated comparison of health technology adoption and wellbeing outcomes"
  // },
  // {
  //   title: "Data Collection Process",
  //   type: "image",
  //   description: "Overview of our research methodology and data collection process across all study regions"
  // }
];

// Create custom marker with flag
const createCustomMarkerWithFlag = (flagCode:any) => {
  // Create a div element for the custom marker
  const markerHtml = `
    <div style="position: relative; width: 40px; height: 40px;">
      <img src="${CustomMarker}" style="width: 40px; height: 40px;" />
      <div style="
        position: absolute;
        top: -8px;
        right: -8px;
        width: 24px;
        height: 18px;
        border-radius: 4px;
        overflow: hidden;
        border: 2px solid white;
        box-shadow: 0 2px 4px rgba(0,0,0,0.3);
        background: white;
      ">
        <img 
          src="https://flagsapi.com/${flagCode.toUpperCase()}/flat/64.png" 
          style="width: 100%; height: 100%; object-fit: cover;"
          alt="${flagCode} flag"
        />
      </div>
    </div>
  `;

  const icon = L.divIcon({
    html: markerHtml,
    iconSize: [40, 40],
    iconAnchor: [20, 40],
    popupAnchor: [0, -40],
    className: 'custom-marker-with-flag'
  });
  
  return icon;
};

// Add this interface for the props
interface OverviewProps {
  onTabChange?: (tab: string) => void;
}

export const Overview = ({ onTabChange }: OverviewProps) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  
  // Auto-advance timer effect
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % mapSlides.length);
    }, 5000); // 5 seconds

    return () => clearInterval(timer);
  }, []);
  
  // Calculate regional statistics
  const regionalStats = calculateRegionalStats();
  
  // Calculate overall statistics
  const totalParticipants = combinedHealthData.length;
  const totalRegions = regions.length;
  const avgDailyAppUsage = regionalStats.reduce((sum, r) => sum + r.healthApps, 0) / regionalStats.length;
  const avgMentalWellbeing = regionalStats.reduce((sum, r) => sum + r.mentalHealth, 0) / regionalStats.length;

  const nextSlide = () => {
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentSlide((prev) => (prev + 1) % mapSlides.length);
      setIsTransitioning(false);
    }, 150);
  };

  const prevSlide = () => {
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentSlide((prev) => (prev - 1 + mapSlides.length) % mapSlides.length);
      setIsTransitioning(false);
    }, 150);
  };

  const handleViewDetails = (location: string) => {
    const tabName = locationTabs[location as keyof typeof locationTabs];
    if (tabName && onTabChange) {
      onTabChange(tabName);
    }
  };

  const handleSlideIndicatorClick = (index: number) => {
    if (index !== currentSlide) {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentSlide(index);
        setIsTransitioning(false);
      }, 150);
    }
  };

  const renderSlideContent = () => {
    const slide = mapSlides[currentSlide];
    
    const slideStyle = {
      opacity: isTransitioning ? 0 : 1,
      transform: isTransitioning ? 'translateX(20px)' : 'translateX(0)',
      transition: 'opacity 0.3s ease-in-out, transform 0.3s ease-in-out'
    };
    
    if (slide.type === "map") {
      return (
        <div style={{ ...slideStyle, position: 'relative' }}>
          <style>{`
            .custom-marker-with-flag {
              background: transparent !important;
              border: none !important;
            }
            .leaflet-popup-content-wrapper {
              padding: 0;
            }
            .leaflet-popup-content {
              margin: 0;
              padding: 16px;
              min-width: 180px;
            }
          `}</style>
          <MapContainer 
            center={slide.center} 
            zoom={slide.zoom} 
            style={{ height: '600px', width: '100%', zIndex: 1 }}
            key={currentSlide} // Force re-render for smooth map transitions
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            {Object.entries(locations).map(([location, coords]) => (
              <Marker 
                key={location} 
                position={coords} 
                icon={createCustomMarkerWithFlag(locationFlags[location as keyof typeof locationFlags])}
              >
                <Popup>
                  <div className="text-center">
                    <div className="flex items-center justify-center mb-3">
                      <h3 className="font-semibold mr-2 text-gray-800">{location}</h3>
                      <FlagImage code={locationFlags[location as keyof typeof locationFlags]} />
                    </div>
                    <p className="text-sm text-gray-600 mb-3">Study Location</p>
                    <button
                      onClick={() => handleViewDetails(location)}
                      className="inline-flex items-center px-3 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
                    >
                      <ExternalLink className="w-4 h-4 mr-1" />
                      View Details
                    </button>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>
      );
    } else if (slide.type === "video") {
      return (
        <div style={slideStyle} className="flex items-center justify-center h-96 bg-gray-100 rounded-lg border-2 border-dashed border-gray-300">
          <div className="text-center">
            <Play className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">Video Placeholder</h3>
            <p className="text-gray-500">Replace with your video content</p>
          </div>
        </div>
      );
    } else {
      return (
        <div style={slideStyle} className="flex items-center justify-center h-96 bg-gray-100 rounded-lg border-2 border-dashed border-gray-300">
          <div className="text-center">
            <Image className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">Image Placeholder</h3>
            <p className="text-gray-500">Replace with your image content</p>
          </div>
        </div>
      );
    }
  };

  const formatHoursAndMinutes = (hours: number): string => {
    const totalMinutes = hours * 60;
    const hoursPart = Math.floor(totalMinutes / 60);
    const minutesPart = Math.round(totalMinutes % 60);
    return `${hoursPart}h ${minutesPart}m`;
  };

  const convertToPercentage = (score: number, maxScore: number = 6): string => {
    const percentage = (score / maxScore) * 100;
    return `${percentage.toFixed(1)}%`;
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Health Technology Usage: Hong Kong, Greater Bay Area & Southeast Asia
        </h1>
        <p className="text-xl text-gray-600 max-w-4xl mx-auto">
          Comprehensive analysis of health app and wearable usage patterns and their relationship
          with wellbeing outcomes across Hong Kong, Greater Bay Area, and Southeast Asia with {totalParticipants.toLocaleString()} total participants.
        </p>
      </div>

      {/* Key Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <div className="text-3xl font-bold text-blue-600">{totalParticipants.toLocaleString()}</div>
          <div className="text-gray-600">Total Participants</div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <div className="text-3xl font-bold text-green-600">{totalRegions}</div>
          <div className="text-gray-600">Regions Studied</div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <div className="text-3xl font-bold text-purple-600">
            {formatHoursAndMinutes(avgDailyAppUsage)}
          </div>
          <div className="text-gray-600">Avg Daily App Usage</div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <div className="text-3xl font-bold text-orange-600">
            {convertToPercentage(avgMentalWellbeing)}
          </div>
          <div className="text-gray-600">Avg Mental Wellbeing</div>
        </div>
      </div>

      {/* Interactive Slideshow */}
      <div className="bg-white p-4 rounded-xl shadow-sm border">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold text-gray-900">Study Overview</h2>
          <div className="flex items-center space-x-4">
            <div className="text-sm text-gray-600">
              {currentSlide + 1} / {mapSlides.length}
            </div>
            <div className="flex space-x-2">
              <button
                onClick={prevSlide}
                className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
                aria-label="Previous slide"
              >
                <ChevronLeft className="w-5 h-5 text-gray-600" />
              </button>
              <button
                onClick={nextSlide}
                className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
                aria-label="Next slide"
              >
                <ChevronRight className="w-5 h-5 text-gray-600" />
              </button>
            </div>
          </div>
        </div>
        
        <div className="mb-4">
          <h3 className="text-lg font-medium text-gray-800">{mapSlides[currentSlide].title}</h3>
          <p className="text-sm text-gray-600">{mapSlides[currentSlide].description}</p>
        </div>

        {renderSlideContent()}

        {/* Slide Indicators */}
        <div className="flex justify-center mt-4 space-x-2">
          {mapSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => handleSlideIndicatorClick(index)}
              className={`w-3 h-3 rounded-full transition-colors ${
                index === currentSlide ? 'bg-blue-600' : 'bg-gray-300'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Regional Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {regionalStats.map((region) => (
          <div key={region.code} className="bg-gray-200 p-6 rounded-xl shadow-sm border hover:shadow-lg transition-shadow duration-300">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center">
                <h3 className="text-xl font-semibold text-gray-900 mr-3">{region.name}</h3>
                <FlagImage code={region.flag} />
              </div>
              <div 
                className="w-4 h-4 rounded-full"
                style={{ backgroundColor: region.color }}
              ></div>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Participants:</span>
                <span className="font-semibold">{region.participants.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Health Apps:</span>
                <span className="font-semibold">{formatHoursAndMinutes(region.healthApps)}/day</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Wearables:</span>
                <span className="font-semibold">{formatHoursAndMinutes(region.wearables)}/day</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Physical Health:</span>
                <span className="font-semibold">{convertToPercentage(region.physicalHealth,5)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Mental Wellbeing:</span>
                <span className="font-semibold">{convertToPercentage(region.mentalHealth,6)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Total Tech Usage:</span>
                <span className="font-semibold text-blue-600">{formatHoursAndMinutes(region.totalUsage)}/day</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Overview;