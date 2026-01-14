
import React from 'react';
import { GardenStyle, SunlightLevel, GardenPreferences } from '../types';

interface GardenFormProps {
  onGenerate: (prefs: GardenPreferences) => void;
  isLoading: boolean;
}

const GardenForm: React.FC<GardenFormProps> = ({ onGenerate, isLoading }) => {
  const [prefs, setPrefs] = React.useState<GardenPreferences>({
    style: GardenStyle.MODERN,
    size: 'Small Courtyard',
    sunlight: SunlightLevel.FULL_SUN,
    features: [],
    customDescription: ''
  });

  const availableFeatures = ['Water Fountain', 'Fire Pit', 'Vegetable Patch', 'Wooden Deck', 'Stone Path', 'Pergola', 'Ambient Lighting'];

  const toggleFeature = (feature: string) => {
    setPrefs(prev => ({
      ...prev,
      features: prev.features.includes(feature)
        ? prev.features.filter(f => f !== feature)
        : [...prev.features, feature]
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onGenerate(prefs);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-2xl shadow-xl border border-emerald-50">
      <h2 className="text-2xl font-bold text-emerald-900 mb-6 flex items-center gap-2">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-emerald-600"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"/><path d="m9 12 2 2 4-4"/></svg>
        Garden Specifications
      </h2>

      <div className="space-y-5">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Architectural Style</label>
          <select 
            value={prefs.style}
            onChange={(e) => setPrefs({...prefs, style: e.target.value as GardenStyle})}
            className="w-full bg-emerald-50 border-0 rounded-lg p-3 text-emerald-900 focus:ring-2 focus:ring-emerald-500"
          >
            {Object.values(GardenStyle).map(style => (
              <option key={style} value={style}>{style}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Space Size</label>
          <select 
            value={prefs.size}
            onChange={(e) => setPrefs({...prefs, size: e.target.value})}
            className="w-full bg-emerald-50 border-0 rounded-lg p-3 text-emerald-900 focus:ring-2 focus:ring-emerald-500"
          >
            <option>Small Courtyard (10-20m²)</option>
            <option>Medium Backyard (20-100m²)</option>
            <option>Large Estate (100m²+)</option>
            <option>Balcony / Terrace</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Sunlight Exposure</label>
          <div className="flex gap-2">
            {Object.values(SunlightLevel).map(level => (
              <button
                key={level}
                type="button"
                onClick={() => setPrefs({...prefs, sunlight: level})}
                className={`flex-1 py-2 px-3 rounded-lg text-xs font-medium transition-all ${
                  prefs.sunlight === level 
                  ? 'bg-emerald-600 text-white shadow-md' 
                  : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                }`}
              >
                {level}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Key Features</label>
          <div className="flex flex-wrap gap-2">
            {availableFeatures.map(feature => (
              <button
                key={feature}
                type="button"
                onClick={() => toggleFeature(feature)}
                className={`px-3 py-1.5 rounded-full text-xs transition-colors border ${
                  prefs.features.includes(feature)
                  ? 'bg-emerald-100 border-emerald-500 text-emerald-700 font-semibold'
                  : 'bg-white border-gray-200 text-gray-500 hover:border-emerald-300'
                }`}
              >
                {feature}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Custom Vision</label>
          <textarea
            value={prefs.customDescription}
            onChange={(e) => setPrefs({...prefs, customDescription: e.target.value})}
            placeholder="Describe your dream garden (e.g., 'lots of lavender and white roses with a winding path')..."
            className="w-full bg-emerald-50 border-0 rounded-lg p-3 text-emerald-900 focus:ring-2 focus:ring-emerald-500 h-24 resize-none"
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className={`w-full py-4 rounded-xl font-bold text-white shadow-lg transition-all ${
            isLoading 
            ? 'bg-emerald-300 cursor-not-allowed' 
            : 'bg-emerald-600 hover:bg-emerald-700 hover:scale-[1.02] active:scale-[0.98]'
          }`}
        >
          {isLoading ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Creating your oasis...
            </span>
          ) : 'Generate Garden Design'}
        </button>
      </div>
    </form>
  );
};

export default GardenForm;
