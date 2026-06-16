function Settings({ user, darkMode, setDarkMode, onLogout, darkModeSetter }) {
  const theme = {
    card: darkMode ? '#1e1c2e' : '#ffffff',
    border: darkMode ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)',
    text: darkMode ? '#ffffff' : '#1a1825',
    subtext: darkMode ? '#9ca3af' : '#6b7280',
    hover: darkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)',
  };

  return (
    <div className="p-6 space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold mb-1" style={{color: theme.text}}>⚙️ Settings</h1>
        <p style={{color: theme.subtext}}>Manage your account and preferences</p>
      </div>

      {/* Profile */}
      <div className="rounded-2xl border p-5" style={{background: theme.card, borderColor: theme.border}}>
        <h2 className="font-bold mb-4" style={{color: theme.text}}>👤 Profile</h2>
        <div className="flex items-center gap-4 mb-4">
          <div className="w-16 h-16 rounded-full flex items-center justify-center text-white text-2xl font-bold"
            style={{background: 'linear-gradient(135deg, #667eea, #764ba2)'}}>
            {user?.username?.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="font-bold" style={{color: theme.text}}>{user?.username}</p>
            <p className="text-sm" style={{color: theme.subtext}}>{user?.email}</p>
          </div>
        </div>
      </div>

      {/* Appearance */}
      <div className="rounded-2xl border p-5" style={{background: theme.card, borderColor: theme.border}}>
        <h2 className="font-bold mb-4" style={{color: theme.text}}>🎨 Appearance</h2>
        <div className="flex items-center justify-between p-3 rounded-xl" style={{background: theme.hover}}>
          <div>
            <p className="font-medium text-sm" style={{color: theme.text}}>Dark Mode</p>
            <p className="text-xs" style={{color: theme.subtext}}>Toggle dark/light theme</p>
          </div>
          <button onClick={() => setDarkMode(!darkMode)}
            className="w-12 h-6 rounded-full transition-all duration-300 relative"
            style={{background: darkMode ? 'linear-gradient(135deg, #667eea, #764ba2)' : theme.border}}>
            <div className="w-5 h-5 rounded-full bg-white absolute top-0.5 transition-all duration-300"
              style={{left: darkMode ? '26px' : '2px'}} />
          </button>
        </div>
      </div>

      {/* Notifications */}
      <div className="rounded-2xl border p-5" style={{background: theme.card, borderColor: theme.border}}>
        <h2 className="font-bold mb-4" style={{color: theme.text}}>🔔 Notifications</h2>
        {['Email notifications', 'Lesson reminders', 'Achievement alerts'].map((item, i) => (
          <div key={i} className="flex items-center justify-between p-3 rounded-xl mb-2" style={{background: theme.hover}}>
            <p className="text-sm" style={{color: theme.text}}>{item}</p>
            <button className="w-12 h-6 rounded-full relative" style={{background: 'linear-gradient(135deg, #667eea, #764ba2)'}}>
              <div className="w-5 h-5 rounded-full bg-white absolute top-0.5 right-0.5" />
            </button>
          </div>
        ))}
      </div>

      {/* Danger zone */}
      <div className="rounded-2xl border p-5" style={{background: theme.card, borderColor: 'rgba(245,87,108,0.3)'}}>
        <h2 className="font-bold mb-4 text-red-400">⚠️ Account</h2>
        <button onClick={onLogout}
          className="px-6 py-2.5 rounded-xl text-sm font-bold text-white transition hover:opacity-90"
          style={{background: 'linear-gradient(135deg, #f5576c, #f093fb)'}}>
          🚪 Logout
        </button>
      </div>
    </div>
  );
}
export default Settings;