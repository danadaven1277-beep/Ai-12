
import React from 'react';
import GardenForm from './components/GardenForm';
import ImageCanvas from './components/ImageCanvas';
import { GardenPreferences, HistoryItem } from './types';
import { generateGardenImage, editGardenImage } from './services/geminiService';

const App: React.FC = () => {
  const [currentImage, setCurrentImage] = React.useState<string | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);
  const [history, setHistory] = React.useState<HistoryItem[]>([]);
  const [error, setError] = React.useState<string | null>(null);

  const handleGenerate = async (prefs: GardenPreferences) => {
    setIsLoading(true);
    setError(null);
    try {
      const imageUrl = await generateGardenImage(prefs);
      setCurrentImage(imageUrl);
      addToHistory(imageUrl, `New Design: ${prefs.style} Garden`);
    } catch (err: any) {
      setError(err.message || 'Failed to generate garden. Please check your API key.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = async (prompt: string) => {
    if (!currentImage) return;
    setIsLoading(true);
    setError(null);
    try {
      const imageUrl = await editGardenImage(currentImage, prompt);
      setCurrentImage(imageUrl);
      addToHistory(imageUrl, `Edit: ${prompt}`);
    } catch (err: any) {
      setError(err.message || 'Failed to edit image.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const base64 = event.target?.result as string;
        setCurrentImage(base64);
        addToHistory(base64, "Uploaded Base Image");
      };
      reader.readAsDataURL(file);
    }
  };

  const addToHistory = (imageUrl: string, prompt: string) => {
    const newItem: HistoryItem = {
      id: Math.random().toString(36).substr(2, 9),
      imageUrl,
      prompt,
      timestamp: Date.now()
    };
    setHistory(prev => [newItem, ...prev].slice(0, 5));
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Header */}
      <header className="bg-emerald-900 text-white pt-16 pb-24 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <img 
            src="https://picsum.photos/id/12/1600/900" 
            alt="Garden background" 
            className="w-full h-full object-cover"
          />
        </div>
        <div className="container mx-auto px-6 relative z-10 text-center">
          <h1 className="text-5xl md:text-6xl font-serif font-bold mb-4 tracking-tight">
            GardenDreamer <span className="text-emerald-400">AI</span>
          </h1>
          <p className="text-emerald-100 text-lg md:text-xl max-w-2xl mx-auto font-light leading-relaxed">
            Harness the power of AI to visualize, design, and perfect your outdoor sanctuary. 
            From initial layouts to fine-tuned botanical edits.
          </p>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-gray-50 to-transparent"></div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 -mt-12 flex-1 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Form & History */}
          <div className="lg:col-span-4 space-y-8">
            <GardenForm onGenerate={handleGenerate} isLoading={isLoading} />
            
            {history.length > 0 && (
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-emerald-50">
                <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-emerald-600"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/><path d="M12 7v5l4 2"/></svg>
                  Recent Versions
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  {history.map(item => (
                    <button 
                      key={item.id}
                      onClick={() => setCurrentImage(item.imageUrl)}
                      className={`group relative aspect-video rounded-lg overflow-hidden border-2 transition-all ${
                        currentImage === item.imageUrl ? 'border-emerald-500 ring-2 ring-emerald-200' : 'border-transparent hover:border-emerald-200'
                      }`}
                    >
                      <img src={item.imageUrl} alt={item.prompt} className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-end p-2 transition-opacity">
                        <p className="text-[10px] text-white truncate">{item.prompt}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Canvas & Actions */}
          <div className="lg:col-span-8 flex flex-col gap-6">
            {error && (
              <div className="bg-red-50 border border-red-100 text-red-700 px-4 py-3 rounded-xl flex items-center gap-3 animate-bounce">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                <span className="text-sm font-medium">{error}</span>
              </div>
            )}

            <ImageCanvas 
              imageUrl={currentImage} 
              isLoading={isLoading} 
              onEdit={handleEdit}
              onUpload={handleUpload}
            />

            <div className="bg-emerald-50 p-6 rounded-2xl border border-emerald-100 flex items-center gap-6">
              <div className="hidden sm:block p-4 bg-emerald-100 rounded-full text-emerald-600">
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/><circle cx="12" cy="13" r="3"/></svg>
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-emerald-900 mb-1">Visual Intelligence Tip</h4>
                <p className="text-sm text-emerald-700">
                  Try phrases like <span className="italic font-medium">"Add cherry blossoms"</span> or <span className="italic font-medium">"Transform into a winter garden"</span>. 
                  The AI understands both structural landscape changes and stylistic filters.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-100 py-10">
        <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center text-white font-bold">G</div>
            <span className="font-bold text-gray-800 tracking-tight">GardenDreamer AI</span>
          </div>
          <div className="text-sm text-gray-400">
            Powered by Gemini 2.5 Flash Image &bull; Crafting beauty with AI
          </div>
          <div className="flex gap-4">
            <a href="#" className="text-gray-400 hover:text-emerald-600 transition-colors">Privacy</a>
            <a href="#" className="text-gray-400 hover:text-emerald-600 transition-colors">Terms</a>
            <a href="#" className="text-gray-400 hover:text-emerald-600 transition-colors">Support</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
