function Dashboard({ user, completedCount, totalCount, timeSpent, notes, darkMode, onNavigate }) {
  const progressPercent = Math.round((completedCount / totalCount) * 100);
  const totalTime = Object.values(timeSpent).reduce((a, b) => a + b, 0);
  const formatTime = (s) => { const h = Math.floor(s/3600); const m = Math.floor((s%3600)/60); return h > 0 ? `${h}h ${m}m` : `${m}m`; };

  const theme = {
    bg: darkMode ? '#0f0e17' : '#f8f9ff',
    card: darkMode ? '#1e1c2e' : '#ffffff',
    border: darkMode ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)',
    text: darkMode ? '#ffffff' : '#1a1825',
    subtext: darkMode ? '#9ca3af' : '#6b7280',
    hover: darkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)',
  };

  return (
    <div className="p-6 space-y-6">
      {/* Welcome */}
      <div className="rounded-2xl p-6 text-white" style={{background: 'linear-gradient(135deg, #667eea, #764ba2)'}}>
        <h1 className="text-2xl font-bold mb-1">Welcome back, {user?.username}! 👋</h1>
        <p className="text-purple-200">You're making great progress. Keep it up!</p>
        <div className="mt-4 flex items-center gap-4">
          <div>
            <p className="text-3xl font-bold">{progressPercent}%</p>
            <p className="text-purple-200 text-sm">Course Complete</p>
          </div>
          <div className="flex-1 h-3 rounded-full bg-white/20">
            <div className="h-3 rounded-full bg-white transition-all" style={{width: `${progressPercent}%`}} />
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { icon: '✅', value: completedCount, label: 'Lessons Done', color: '#11998e' },
          { icon: '📚', value: totalCount - completedCount, label: 'Remaining', color: '#667eea' },
          { icon: '⏱️', value: formatTime(totalTime) || '0m', label: 'Study Time', color: '#f093fb' },
          { icon: '📝', value: notes, label: 'Notes Saved', color: '#f5576c' },
        ].map((s, i) => (
          <div key={i} className="rounded-xl p-4 border text-center" style={{background: theme.card, borderColor: theme.border}}>
            <p className="text-3xl mb-1">{s.icon}</p>
            <p className="text-2xl font-bold" style={{color: s.color}}>{s.value}</p>
            <p className="text-xs" style={{color: theme.subtext}}>{s.label}</p>
          </div>
        ))}
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="rounded-2xl p-5 border" style={{background: theme.card, borderColor: theme.border}}>
          <h3 className="font-bold mb-3" style={{color: theme.text}}>🚀 Quick Actions</h3>
          <div className="space-y-2">
            {[
              { label: 'Continue Learning', icon: '▶️', action: () => onNavigate('main') },
              { label: 'View Achievements', icon: '🏆', action: () => onNavigate('achievements') },
              { label: 'Check Leaderboard', icon: '📊', action: () => onNavigate('leaderboard') },
            ].map((item, i) => (
              <button key={i} onClick={item.action}
                className="w-full flex items-center gap-3 p-3 rounded-xl text-left transition hover:opacity-80"
                style={{background: 'rgba(102,126,234,0.1)', border: '1px solid rgba(102,126,234,0.2)'}}>
                <span>{item.icon}</span>
                <span className="text-sm font-medium" style={{color: theme.text}}>{item.label}</span>
                <span className="ml-auto text-purple-400">→</span>
              </button>
            ))}
          </div>
        </div>
        <div className="rounded-2xl p-5 border" style={{background: theme.card, borderColor: theme.border}}>
          <h3 className="font-bold mb-3" style={{color: theme.text}}>📈 Weekly Goal</h3>
          <div className="text-center py-4">
            <p className="text-5xl font-bold mb-2" style={{color: '#667eea'}}>{Math.min(completedCount, 7)}/7</p>
            <p className="text-sm mb-4" style={{color: theme.subtext}}>Lessons this week</p>
            <div className="flex gap-1 justify-center">
              {[...Array(7)].map((_, i) => (
                <div key={i} className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold"
                  style={{background: i < Math.min(completedCount, 7) ? 'linear-gradient(135deg, #11998e, #38ef7d)' : theme.border, color: 'white'}}>
                  {i < Math.min(completedCount, 7) ? '✓' : i + 1}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
export default Dashboard;