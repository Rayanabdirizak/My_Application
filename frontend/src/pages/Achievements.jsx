function Achievements({ completedCount, totalCount, darkMode }) {
  const theme = {
    card: darkMode ? '#1e1c2e' : '#ffffff',
    border: darkMode ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)',
    text: darkMode ? '#ffffff' : '#1a1825',
    subtext: darkMode ? '#9ca3af' : '#6b7280',
  };

  const achievements = [
    { icon: '🎯', title: 'First Step', desc: 'Complete your first lesson', earned: completedCount >= 1 },
    { icon: '⭐', title: 'Getting Started', desc: 'Complete 5 lessons', earned: completedCount >= 5 },
    { icon: '🔥', title: 'On Fire', desc: 'Complete 10 lessons', earned: completedCount >= 10 },
    { icon: '💪', title: 'Halfway There', desc: 'Complete 10 lessons', earned: completedCount >= 10 },
    { icon: '🚀', title: 'Almost Done', desc: 'Complete 15 lessons', earned: completedCount >= 15 },
    { icon: '🎓', title: 'Graduate', desc: 'Complete all lessons', earned: completedCount >= totalCount },
    { icon: '📝', title: 'Note Taker', desc: 'Save your first note', earned: false },
    { icon: '🏃', title: 'Speed Learner', desc: 'Complete 3 lessons in one day', earned: completedCount >= 3 },
    { icon: '🌟', title: 'Star Student', desc: 'Score 100% on a quiz', earned: false },
    { icon: '💡', title: 'Curious Mind', desc: 'Watch 5 different topics', earned: completedCount >= 5 },
    { icon: '🎪', title: 'Dedicated', desc: 'Study for 1 hour total', earned: false },
    { icon: '👑', title: 'Champion', desc: 'Reach #1 on leaderboard', earned: false },
  ];

  const earnedCount = achievements.filter(a => a.earned).length;

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold mb-1" style={{color: theme.text}}>🎖️ Achievements</h1>
          <p style={{color: theme.subtext}}>Track your learning milestones</p>
        </div>
        <div className="text-right">
          <p className="text-3xl font-bold" style={{color: '#667eea'}}>{earnedCount}/{achievements.length}</p>
          <p className="text-xs" style={{color: theme.subtext}}>Earned</p>
        </div>
      </div>

      {/* Progress */}
      <div className="rounded-2xl border p-5" style={{background: theme.card, borderColor: theme.border}}>
        <div className="flex justify-between text-sm mb-2">
          <span style={{color: theme.subtext}}>Achievement Progress</span>
          <span style={{color: '#667eea'}}>{Math.round((earnedCount / achievements.length) * 100)}%</span>
        </div>
        <div className="h-3 rounded-full" style={{background: theme.border}}>
          <div className="h-3 rounded-full transition-all" style={{width: `${(earnedCount / achievements.length) * 100}%`, background: 'linear-gradient(90deg, #667eea, #764ba2)'}} />
        </div>
      </div>

      {/* Achievement grid */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        {achievements.map((a, i) => (
          <div key={i} className="rounded-2xl border p-4 text-center transition hover:scale-105"
            style={{background: a.earned ? 'rgba(102,126,234,0.1)' : theme.card, borderColor: a.earned ? 'rgba(102,126,234,0.3)' : theme.border, opacity: a.earned ? 1 : 0.5}}>
            <p className="text-4xl mb-2">{a.icon}</p>
            <p className="font-bold text-sm mb-1" style={{color: theme.text}}>{a.title}</p>
            <p className="text-xs" style={{color: theme.subtext}}>{a.desc}</p>
            {a.earned && <span className="mt-2 inline-block text-xs px-2 py-0.5 rounded-full text-white" style={{background: 'linear-gradient(135deg, #11998e, #38ef7d)'}}>✓ Earned</span>}
          </div>
        ))}
      </div>
    </div>
  );
}
export default Achievements;