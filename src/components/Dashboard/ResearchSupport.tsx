import React from 'react';
import { motion } from 'framer-motion';
import { Award, School, Users, Heart } from 'lucide-react';
import MoeLogo from '../../../public/logo/moe-logo.jpg'
import CityULogo from '../../../public/logo/cityu.jpg'
import MedCommCityULogo from '../../../public/logo/media-communication-cityu.jpg'
import DigMedCityULogo from '../../../public/logo/digital-medicine-cityu.jpg'
import NTULogo from '../../../public/logo/weekimwee.png'

export const ResearchSupport: React.FC = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <Award className="w-8 h-8 text-blue-600" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Research Support
            </h1>
          </div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Acknowledgments of research funding and collaborative partnerships
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-8"
        >
          {/* Introduction */}
          <motion.div
            variants={itemVariants}
            className="bg-white rounded-2xl shadow-lg p-8 text-center"
          >
            <div className="flex justify-center mb-4">
              <Heart className="w-12 h-12 text-red-500" />
            </div>
            <p className="text-lg text-gray-700 leading-relaxed">
              This research was supported through generous funding and institutional collaboration. 
              We gratefully acknowledge the following grants and partners for making this work possible.
            </p>
          </motion.div>

          {/* ASEAN Data Collection */}
          <motion.div
            variants={itemVariants}
            className="bg-white rounded-2xl shadow-lg p-8"
            >
            <div className="flex items-start gap-6 mb-6">
                {/* Left side: Icon and text content */}
                <div className="flex-1">
                <div className="flex items-start gap-4 mb-4">
                    <div className="bg-blue-100 p-3 rounded-xl">
                    <School className="w-8 h-8 text-blue-600" />
                    </div>
                    <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">
                        ASEAN Data Collection
                    </h2>
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        <h3 className="text-xl font-semibold text-blue-600">
                        Ministry of Education (MOE), Singapore
                        </h3>
                    </div>
                    </div>
                </div>
                </div>

                {/* MOE Logo - Properly sized */}
                <div className="flex-shrink-0">
                <img 
                    src={MoeLogo} 
                    alt="Ministry of Education Singapore" 
                    className="w-32 h-32 object-contain rounded-lg"
                />
                </div>
            </div>
            
            <div className="bg-blue-50 rounded-xl p-6 border-l-4 border-blue-500">
                <p className="text-gray-700 leading-relaxed mb-4">
                This work is supported by the Social Science and Humanities Research (SSHR) Fellowship Call 
                <span className="font-semibold text-blue-700"> [Award Number: SSRC2022-SSHR-006]</span>, 
                under the project titled:
                </p>
                <blockquote className="text-lg font-medium text-gray-900 italic border-l-4 border-blue-300 pl-4 ml-2">
                "Towards Successful Ageing: Leveraging A Community-Engaged Digital Health Technologies 
                Ecosystem in Promoting Physical Activity and Well-Being Among Future and Current Seniors."
                </blockquote>
            </div>
          </motion.div>

          {/* Hong Kong-GBA Data Collection */}
          <motion.div
            variants={itemVariants}
            className="bg-white rounded-2xl shadow-lg p-8"
          >
            <div className="flex items-start gap-6 mb-6">
                {/* Left side: Icon and text content */}
                <div className="flex-1">
                <div className="flex items-start gap-4 mb-4">
                    <div className="bg-purple-100 p-3 rounded-xl">
                    <School className="w-8 h-8 text-purple-600" />
                    </div>
                    <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">
                        Hong Kong-Greater Bay Area (HK-GBA) Data Collection
                    </h2>
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                        <h3 className="text-xl font-semibold text-purple-600">
                        City University of Hong Kong (CityUHK)
                        </h3>
                    </div>
                    </div>
                </div>
                </div>

                {/* CityU Logo - Larger for better balance */}
                <div className="flex-shrink-0">
                <img 
                    src={CityULogo} 
                    alt="City University of Hong Kong" 
                    className="w-48 h-32 object-contain rounded-lg" 
                />
                </div>
            </div>
            
            <div className="bg-purple-50 rounded-xl p-6 border-l-4 border-purple-500">
                <p className="text-gray-700 leading-relaxed mb-4">
                This work is supported by a CityUHK Start-up Grant 
                <span className="font-semibold text-purple-700"> [Grant No. 9610698]</span>, 
                under the project titled:
                </p>
                <blockquote className="text-lg font-medium text-gray-900 italic border-l-4 border-purple-300 pl-4 ml-2">
                "Advancing Inclusive Gerontechnologies: Co-Creating Virtual Reality Wearable Gloves 
                for Active Ageing in Hong Kong and Singapore."
                </blockquote>
            </div>
          </motion.div>

          {/* Collaborating Institutions */}
          <motion.div
            variants={itemVariants}
            className="bg-white rounded-2xl shadow-lg p-8"
          >
            <div className="flex items-center gap-3 mb-8">
                <Users className="w-8 h-8 text-green-600" />
                <h2 className="text-3xl font-bold text-gray-900">
                Collaborating Institutions
                </h2>
            </div>
            
            <div className="text-center mb-8">
                <p className="text-lg text-gray-700 leading-relaxed max-w-4xl mx-auto">
                The following institutions have provided invaluable support and collaboration for this research program. 
                We extend our sincere gratitude for their partnership.
                </p>
            </div>

            {/* Logo Placeholders - Only 3 now */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 justify-items-center">
                {/* MedComm CityU Logo */}
                <motion.div
                whileHover={{ scale: 1.05 }}
                className="flex items-center justify-center"
                >
                <img 
                    src={MedCommCityULogo} 
                    alt="Media Communication CityU" 
                    className="w-64 h-40 object-contain rounded-lg"
                />
                </motion.div>

                {/* DigMed CityU Logo */}
                <motion.div
                whileHover={{ scale: 1.05 }}
                className="flex items-center justify-center"
                >
                <img 
                    src={DigMedCityULogo} 
                    alt="Digital Medicine CityU" 
                    className="w-64 h-40 object-contain rounded-lg"
                />
                </motion.div>

                {/* NTU Logo */}
                <motion.div
                whileHover={{ scale: 1.05 }}
                className="flex items-center justify-center"
                >
                <img 
                    src={NTULogo} 
                    alt="Nanyang Technological University" 
                    className="w-64 h-40 object-contain rounded-lg"
                />
                </motion.div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default ResearchSupport;