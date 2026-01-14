
import React from 'react';

interface ImageCanvasProps {
  imageUrl: string | null;
  isLoading: boolean;
  onEdit: (prompt: string) => void;
  onUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const ImageCanvas: React.FC<ImageCanvasProps> = ({ imageUrl, isLoading, onEdit, onUpload }) => {
  const [editPrompt, setEditPrompt] = React.useState('');

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editPrompt.trim() && !isLoading) {
      onEdit(editPrompt);
      setEditPrompt('');
    }
  };

  return (
    <div className="flex flex-col gap-6 w-full">
      <div className="relative aspect-video w-full bg-emerald-950 rounded-2xl shadow-2xl overflow-hidden border-4 border-white">
        {imageUrl ? (
          <>
            <img 
              src={imageUrl} 
              alt="Garden Design" 
              className={`w-full h-full object-cover transition-opacity duration-700 ${isLoading ? 'opacity-40 grayscale blur-sm' : 'opacity-100'}`}
            />
            {isLoading && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/30 backdrop-blur-[2px]">
                <div className="relative">
                  <div className="w-16 h-16 border-4 border-emerald-400 border-t-transparent rounded-full animate-spin"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-emerald-400"><path d="m9 10 2 2 4-4"/><rect width="20" height="20" x="2" y="2" rx="2"/></svg>
                  </div>
                </div>
                <p className="mt-4 text-white font-medium animate-pulse">Applying AI Magic...</p>
              </div>
            )}
          </>
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-emerald-100 p-8 text-center">
            <div className="bg-emerald-900/50 p-6 rounded-full mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="opacity-50"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"/><path d="m9 12 2 2 4-4"/></svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">No Design Generated Yet</h3>
            <p className="text-sm text-emerald-300 max-w-sm mb-6">
              Use the form to create your dream garden layout, or upload an existing photo of your garden to redesign it.
            </p>
            <label className="bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-3 rounded-xl font-bold cursor-pointer transition-all shadow-lg inline-flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" x2="12" y1="3" y2="15"/></svg>
              Upload Current Garden Photo
              <input type="file" className="hidden" accept="image/*" onChange={onUpload} />
            </label>
          </div>
        )}
      </div>

      {imageUrl && (
        <div className="bg-white p-6 rounded-2xl shadow-xl border border-emerald-50 transform transition-all hover:shadow-2xl">
          <div className="flex items-center gap-2 mb-4">
            <div className="bg-emerald-100 p-2 rounded-lg text-emerald-600">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/><path d="M5 3v4"/><path d="M19 17v4"/><path d="M3 5h4"/><path d="M17 19h4"/></svg>
            </div>
            <h4 className="font-bold text-gray-800">Iterative AI Redesign</h4>
          </div>
          <form onSubmit={handleEditSubmit} className="flex gap-2">
            <input
              type="text"
              value={editPrompt}
              onChange={(e) => setEditPrompt(e.target.value)}
              disabled={isLoading}
              placeholder="e.g., 'Add a stone path', 'Make it look like autumn', 'Add more flowers'..."
              className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-emerald-500 outline-none transition-all disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={!editPrompt.trim() || isLoading}
              className="bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-300 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-md active:scale-95"
            >
              Apply Change
            </button>
          </form>
          <div className="mt-4 flex flex-wrap gap-2">
            {['Retro Filter', 'Remove Distractions', 'More Sunset Lighting', 'Add Pergola', 'Native Plants Only'].map(suggestion => (
              <button 
                key={suggestion}
                onClick={() => setEditPrompt(suggestion)}
                className="text-xs text-emerald-600 bg-emerald-50 hover:bg-emerald-100 px-3 py-1.5 rounded-full transition-colors font-medium border border-emerald-100"
              >
                + {suggestion}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageCanvas;
