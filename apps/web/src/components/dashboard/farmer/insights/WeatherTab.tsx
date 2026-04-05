import React from 'react';
import { motion } from 'framer-motion';
import { Cloud, CloudRain, Sun, Wind, Droplets, AlertTriangle } from 'lucide-react';
import { fadeInUp, staggerContainer } from '@/lib/animations';

interface WeatherTabProps {
  data: any;
}

const WeatherTab: React.FC<WeatherTabProps> = ({ data }) => {
  const forecast = [
    { day: 'Mon', temp: 30, rain: 20, icon: Sun },
    { day: 'Tue', temp: 29, rain: 60, icon: CloudRain },
    { day: 'Wed', temp: 27, rain: 80, icon: CloudRain },
    { day: 'Thu', temp: 28, rain: 40, icon: Cloud },
    { day: 'Fri', temp: 31, rain: 10, icon: Sun },
    { day: 'Sat', temp: 32, rain: 5, icon: Sun },
    { day: 'Sun', temp: 30, rain: 15, icon: Sun }
  ];

  return (
    <motion.div variants={staggerContainer} initial="initial" animate="animate" className="space-y-6">
      <motion.div variants={fadeInUp} className="bg-gradient-to-br from-blue-600 to-cyan-600 rounded-2xl shadow-lg p-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold mb-2">28°C</h2>
            <p className="text-blue-100">Partly Cloudy</p>
            <div className="flex items-center gap-4 mt-4">
              <div className="flex items-center gap-2">
                <Droplets className="w-4 h-4" />
                <span className="text-sm">65% Humidity</span>
              </div>
              <div className="flex items-center gap-2">
                <Wind className="w-4 h-4" />
                <span className="text-sm">12 km/h</span>
              </div>
            </div>
          </div>
          <Cloud className="w-24 h-24 opacity-50" />
        </div>
      </motion.div>

      <motion.div variants={fadeInUp} className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6">
        <h2 className="text-xl font-bold text-slate-800 mb-6">7-Day Forecast</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
          {forecast.map((day, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.05 }}
              className="bg-gradient-to-br from-slate-50 to-blue-50 rounded-xl p-4 text-center border border-slate-200"
            >
              <p className="text-sm font-medium text-slate-600 mb-2">{day.day}</p>
              <day.icon className="w-8 h-8 mx-auto mb-2 text-blue-600" />
              <p className="text-2xl font-bold text-slate-800 mb-1">{day.temp}°</p>
              <p className="text-xs text-blue-600">{day.rain}% rain</p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      <motion.div variants={fadeInUp} className="bg-orange-50 border-l-4 border-orange-500 rounded-xl p-6">
        <div className="flex items-start gap-4">
          <AlertTriangle className="w-6 h-6 text-orange-600 flex-shrink-0" />
          <div>
            <h3 className="font-semibold text-orange-900 mb-2">Weather Alert</h3>
            <p className="text-orange-800 mb-3">Heavy rainfall expected in 48 hours. Take preventive measures.</p>
            <div className="space-y-2">
              <p className="text-sm text-orange-700">• Postpone irrigation and fertilizer application</p>
              <p className="text-sm text-orange-700">• Ensure proper drainage in fields</p>
              <p className="text-sm text-orange-700">• Protect sensitive crops with covers</p>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default WeatherTab;
