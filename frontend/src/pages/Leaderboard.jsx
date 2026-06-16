function Leaderboard({ user, completedCount, darkMode }) {
  const theme = {
    card: darkMode ? '#1e1c2e' : '#ffffff',
    border: darkMode ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)',
    text: darkMode ? '#ffffff' : '#1a1825',
    subtext: darkMode ? '#9ca3af' : '#6b7280',
    hover: darkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)',
  };

  const leaderboard = [
    { name: user?.username || 'You', lessons: completedCount, avatar: '👤', isYou: true },
    { name: 'Ahmed Ali', lessons: 18, avatar: '🧑' },
    { name: 'Sara Mohamed', lessons: 15, avatar: '👩' },
    { name: 'Omar Hassan', lessons: 12, avatar: '👨' },
    { name: 'Fatima Abdi', lessons: 10, avatar: '👩' },
    { name: 'Yusuf Ibrahim', lessons: 8, avatar: '🧑' },
    { name: 'Amina Warsame', lessons: 6, avatar: '👩' },
  ].sort((a, b) => b.lessons - a.lessons).map((u, i) => ({ ...u, rank: i + 1 }));

  const medals = ['🥇', '🥈', '🥉'];

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold mb-1" style={{color: theme.text}}>🏆 Leaderboard</h1>
        <p style={{color: theme.subtext}}>See how you rank among other learners</p>
      </div>

      {/* Top 3 */}
      <div className="grid grid-cols-3 gap-4">
        {leaderboard.slice(0, 3).map((u, i) => (
          <div key={i} className="rounded-2xl border p-4 text-center" style={{background: u.isYou ? 'rgba(102,126,234,0.15)' : theme.card, borderColor: u.isYou ? 'rgba(102,126,234,0.4)' : theme.border}}>
            <p className="text-3xl mb-2">{medals[i]}</p>
            <p className="text-2xl mb-1">{u.avatar}</p>
            <p className="font-bold text-sm" style={{color: theme.text}}>{u.name}</p>
            <p className="text-xs" style={{color: theme.subtext}}>{u.lessons} lessons</p>
          </div>
        ))}
      </div>

      {/* Full list */}
      <div className="rounded-2xl border overflow-hidden" style={{background: theme.card, borderColor: theme.border}}>
        {leaderboard.map((u, i) => (
          <div key={i} className="flex items-center gap-4 p-4 border-b last:border-0 transition"
            style={{borderColor: theme.border, background: u.isYou ? 'rgba(102,126,234,0.1)' : 'transparent'}}>
            <span className="text-lg w-8 text-center">{u.rank <= 3 ? medals[u.rank - 1] : `#${u.rank}`}</span>
            <span className="text-2xl">{u.avatar}</span>
            <div className="flex-1">
              <p className="font-medium text-sm" style={{color: theme.text}}>{u.name} {u.isYou && <span className="text-xs text-purple-400">(You)</span>}</p>
              <p className="text-xs" style={{color: theme.subtext}}>{u.lessons} lessons completed</p>
            </div>
            <div className="w-24 h-2 rounded-full" style={{background: theme.border}}>
              <div className="h-2 rounded-full" style={{width: `${(u.lessons / 20) * 100}%`, background: 'linear-gradient(90deg, #667eea, #764ba2)'}} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
export default Leaderboard;