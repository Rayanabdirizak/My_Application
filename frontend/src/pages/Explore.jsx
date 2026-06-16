function Explore({ darkMode, onNavigate, PLAYLIST }) {
  const theme = {
    card: darkMode ? '#1e1c2e' : '#ffffff',
    border: darkMode ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)',
    text: darkMode ? '#ffffff' : '#1a1825',
    subtext: darkMode ? '#9ca3af' : '#6b7280',
    hover: darkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)',
  };

  const categories = [...new Set(PLAYLIST.map(v => v.module))];

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold mb-1" style={{color: theme.text}}>🔍 Explore Courses</h1>
        <p style={{color: theme.subtext}}>Browse all available lessons by category</p>
      </div>

      {categories.map(cat => (
        <div key={cat} className="rounded-2xl border p-5" style={{background: theme.card, borderColor: theme.border}}>
          <h2 className="font-bold mb-4 text-purple-400">{cat}</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
            {PLAYLIST.filter(v => v.module === cat).map((video, i) => (
              <button key={video.id} onClick={() => onNavigate('main', video)}
                className="flex items-center gap-3 p-3 rounded-xl text-left transition hover:opacity-80"
                style={{background: theme.hover, border: `1px solid ${theme.border}`}}>
                <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold"
                  style={{background: 'linear-gradient(135deg, #667eea, #764ba2)'}}>
                  {PLAYLIST.findIndex(v => v.id === video.id) + 1}
                </div>
                <div>
                  <p className="text-sm font-medium" style={{color: theme.text}}>{video.title}</p>
                  <p className="text-xs" style={{color: theme.subtext}}>Click to start</p>
                </div>
                <span className="ml-auto text-purple-400">▶</span>
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
export default Explore;