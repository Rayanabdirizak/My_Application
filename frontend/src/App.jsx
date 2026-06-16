import React, { useState, useEffect, useCallback, useRef } from 'react';
import axios from 'axios';
import Login from './pages/Login';
import Register from './pages/Register';
import Certificate from './pages/Certificate';
import Quiz from './components/Quiz';
import Dashboard from './pages/Dashboard';
import Explore from './pages/Explore';
import Leaderboard from './pages/Leaderboard';
import Achievements from './pages/Achievements';
import Settings from './pages/Settings';

const PLAYLIST = [
  { id: "lesson_1", title: "Introduction to Web Apps", embedId: "ysEN5RaKOlA", module: "Module 1: Basics" },
  { id: "lesson_2", title: "Understanding Databases", embedId: "HXV3zeQKqGY", module: "Module 1: Basics" },
  { id: "lesson_3", title: "Full-Stack Integration", embedId: "nu_pCVPKzTk", module: "Module 1: Basics" },
  { id: "lesson_4", title: "Networking", embedId: "qiQR5rTSshw", module: "Module 2: Infrastructure" },
  { id: "lesson_5", title: "Data Analysis", embedId: "kghcAk7l6eA", module: "Module 2: Infrastructure" },
  { id: "lesson_6", title: "Data Science", embedId: "4DlsTsqpY84", module: "Module 2: Infrastructure" },
  { id: "lesson_7", title: "Python for Data Analysis", embedId: "wUSDVGivd-8", module: "Module 3: Python" },
  { id: "lesson_8", title: "Python Tutorial", embedId: "ix9cRaBkVe0", module: "Module 3: Python" },
  { id: "lesson_9", title: "JavaScript Tutorial", embedId: "lfmg-EJ8gm4", module: "Module 4: Frontend" },
  { id: "lesson_10", title: "React JS Tutorial", embedId: "SqcY0GlETPk", module: "Module 4: Frontend" },
  { id: "lesson_11", title: "Node JS Tutorial", embedId: "KOutPbKc9UM", module: "Module 5: Backend" },
  { id: "lesson_12", title: "HTML Full Course", embedId: "qz0aGYrrlhU", module: "Module 4: Frontend" },
  { id: "lesson_13", title: "CSS Tutorial", embedId: "wRNinF7YQqQ", module: "Module 4: Frontend" },
  { id: "lesson_14", title: "Django Tutorial", embedId: "Rp5vd34d-z4", module: "Module 5: Backend" },
  { id: "lesson_15", title: "SQL Database Tutorial", embedId: "7S_tz1z_5bA", module: "Module 6: Database" },
  { id: "lesson_16", title: "Git & GitHub Tutorial", embedId: "RGOj5yH7evk", module: "Module 7: Tools" },
  { id: "lesson_17", title: "Flutter Mobile Development", embedId: "VPvVD8t02U8", module: "Module 7: Tools" },
  { id: "lesson_18", title: "Cloud Computing Basics", embedId: "EN4fEbcFZ_E", module: "Module 7: Tools" },
  { id: "lesson_19", title: "Cybersecurity Basics", embedId: "9HOpanT0GRs", module: "Module 7: Tools" },
  { id: "lesson_20", title: "AI & Machine Learning", embedId: "GwIo3gDZCVQ", module: "Module 7: Tools" },
];

const REACTIONS = ['👍', '❤️', '😮', '🔥', '😂'];

const ACHIEVEMENTS = [
  { id: 'first_lesson', title: 'First Lesson', icon: '🎯', desc: 'Complete your first lesson', condition: (c) => c >= 1 },
  { id: 'five_lessons', title: 'Getting Started', icon: '⭐', desc: 'Complete 5 lessons', condition: (c) => c >= 5 },
  { id: 'ten_lessons', title: 'On Fire', icon: '🔥', desc: 'Complete 10 lessons', condition: (c) => c >= 10 },
  { id: 'halfway', title: 'Halfway There', icon: '💪', desc: 'Complete 10 lessons', condition: (c) => c >= 10 },
  { id: 'almost', title: 'Almost Done', icon: '🚀', desc: 'Complete 15 lessons', condition: (c) => c >= 15 },
  { id: 'complete', title: 'Graduate', icon: '🎓', desc: 'Complete all lessons', condition: (c, t) => c >= t },
];

export default function App() {
  const [page, setPage] = useState('login');
  const [user, setUser] = useState(null);
  const [notes, setNotes] = useState([]);
  const [noteText, setNoteText] = useState('');
  const [currentVideo, setCurrentVideo] = useState(PLAYLIST[0]);
  const [searchText, setSearchText] = useState('');
  const [completedLessons, setCompletedLessons] = useState([]);
  const [darkMode, setDarkMode] = useState(true);
  const [timeSpent, setTimeSpent] = useState({});
  const [isTimerRunning, setIsTimerRunning] = useState(true);
  const [showQuiz, setShowQuiz] = useState(false);
  const [reactions, setReactions] = useState({});
  const [comments, setComments] = useState({});
  const [commentText, setCommentText] = useState('');
  const [showComments, setShowComments] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [activePage, setActivePage] = useState('main');
  const [dayStreak, setDayStreak] = useState(5);
  const [studyTimer, setStudyTimer] = useState(25 * 60);
  const [timerRunning, setTimerRunning] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);
  const [sidebarSearch, setSidebarSearch] = useState('');
  const timerRef = useRef(null);
  const studyTimerRef = useRef(null);

  const API_URL = 'https://my-application-nc8w.onrender.com/api/notes';

  const theme = {
    bg: darkMode ? '#0f0e17' : '#f8f9ff',
    sidebar: darkMode ? '#1a1825' : '#ffffff',
    card: darkMode ? '#1e1c2e' : '#ffffff',
    border: darkMode ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)',
    text: darkMode ? '#ffffff' : '#1a1825',
    subtext: darkMode ? '#9ca3af' : '#6b7280',
    hover: darkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)',
    accent: 'linear-gradient(135deg, #667eea, #764ba2)',
    green: 'linear-gradient(135deg, #11998e, #38ef7d)',
  };

  // ⏱️ Lesson timer
  useEffect(() => {
    if (isTimerRunning && page === 'main') {
      timerRef.current = setInterval(() => {
        setTimeSpent(prev => ({ ...prev, [currentVideo.id]: (prev[currentVideo.id] || 0) + 1 }));
      }, 1000);
    }
    return () => clearInterval(timerRef.current);
  }, [currentVideo.id, isTimerRunning, page]);

  // ⏱️ Pomodoro study timer
  useEffect(() => {
    if (timerRunning) {
      studyTimerRef.current = setInterval(() => {
        setStudyTimer(prev => prev > 0 ? prev - 1 : 0);
      }, 1000);
    }
    return () => clearInterval(studyTimerRef.current);
  }, [timerRunning]);

  const formatTime = (seconds) => {
    if (!seconds) return '0:00';
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    if (h > 0) return `${h}h ${m}m`;
    if (m > 0) return `${m}m ${s}s`;
    return `${s}s`;
  };

  const formatStudyTimer = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const totalTimeSpent = Object.values(timeSpent).reduce((a, b) => a + b, 0);

  const fetchNotes = useCallback(async (videoId) => {
    if (!videoId) return;
    try {
      const response = await axios.get(`${API_URL}/${videoId}`);
      if (response.data.success) setNotes(response.data.data);
    } catch (error) { console.error("Error fetching notes:", error); }
  }, [API_URL]);

  useEffect(() => {
    if (currentVideo?.id) fetchNotes(currentVideo.id);
  }, [currentVideo, fetchNotes]);

  const handleSaveNote = async () => {
    if (!noteText.trim() || !currentVideo?.id) return;
    try {
      const response = await axios.post(API_URL, { videoId: currentVideo.id, noteText, timestampInSeconds: 0 });
      if (response.data.success) { fetchNotes(currentVideo.id); setNoteText(''); }
    } catch (error) { console.error("Error saving note:", error); }
  };

  const handleDeleteNote = async (noteId) => {
    if (!noteId || !currentVideo?.id) return;
    try {
      const response = await axios.delete(`${API_URL}/${noteId}`);
      if (response.data.success) fetchNotes(currentVideo.id);
    } catch (error) { console.error("Error deleting note:", error); }
  };

  const toggleComplete = async (videoId) => {
    const wasCompleted = completedLessons.includes(videoId);
    setCompletedLessons(prev =>
      wasCompleted ? prev.filter(id => id !== videoId) : [...prev, videoId]
    );
    if (!wasCompleted && user?.email) {
      const lesson = PLAYLIST.find(v => v.id === videoId);
      try {
        await axios.post('https://my-application-nc8w.onrender.com/api/email/lesson-complete', {
          email: user.email, username: user.username, lessonTitle: lesson.title
        });
      } catch (error) { console.error('Email error:', error); }
    }
  };

  const handleReaction = (emoji) => {
    setReactions(prev => {
      const videoReactions = prev[currentVideo.id] || {};
      const current = videoReactions[emoji] || [];
      const alreadyReacted = current.includes(user?.username);
      return { ...prev, [currentVideo.id]: { ...videoReactions, [emoji]: alreadyReacted ? current.filter(u => u !== user?.username) : [...current, user?.username] } };
    });
  };

  const handleAddComment = () => {
    if (!commentText.trim()) return;
    const newComment = { id: Date.now(), text: commentText, username: user?.username, time: new Date().toLocaleString() };
    setComments(prev => ({ ...prev, [currentVideo.id]: [...(prev[currentVideo.id] || []), newComment] }));
    setCommentText('');
  };

  const filteredNotes = notes.filter(note => note.noteText.toLowerCase().includes(searchText.toLowerCase()));
  const completedCount = completedLessons.length;
  const totalCount = PLAYLIST.length;
  const progressPercent = Math.round((completedCount / totalCount) * 100);
  const currentReactions = reactions[currentVideo.id] || {};
  const currentComments = comments[currentVideo.id] || [];
  const currentIndex = PLAYLIST.findIndex(v => v.id === currentVideo.id);
  const nextLesson = PLAYLIST[currentIndex + 1];
  const earnedAchievements = ACHIEVEMENTS.filter(a => a.condition(completedCount, totalCount));

  const handleLogin = (userData) => { setUser(userData); setPage('main'); };
  const handleRegister = (userData) => { setUser(userData); setPage('main'); };
  const handleLogout = () => { setUser(null); setPage('login'); setCompletedLessons([]); };

  const handleNavigate = (page, video = null) => {
    setActivePage(page);
    if (video) { setCurrentVideo(video); setActivePage('main'); }
  };

  if (page === 'login') return <Login onLogin={handleLogin} onGoRegister={() => setPage('register')} darkMode={darkMode} />;
  if (page === 'register') return <Register onRegister={handleRegister} onGoLogin={() => setPage('login')} darkMode={darkMode} />;
  if (page === 'certificate') return <Certificate user={user} completedCount={completedCount} totalCount={totalCount} onBack={() => setPage('main')} darkMode={darkMode} />;

  const filteredPlaylist = PLAYLIST.filter(v => v.title.toLowerCase().includes(sidebarSearch.toLowerCase()));

  return (
  // Line 210
<div className="flex min-h-screen w-full overflow-x-hidden font-sans" style={{background: theme.bg, color: theme.text}}>
  
    {/* ... all your components, routes, and pages are inside here ... */}


      {/* Mobile overlay */}
      {showSidebar && <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setShowSidebar(false)} />}

      {/* LEFT SIDEBAR */}
      <aside className={`fixed lg:static inset-y-0 left-0 z-50 w-64 flex flex-col border-r transition-transform duration-300 ${showSidebar ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
        style={{background: theme.sidebar, borderColor: theme.border}}>
        {/* Logo */}
        <div className="p-5 border-b flex items-center gap-3" style={{borderColor: theme.border}}>
          <div className="w-9 h-9 rounded-xl flex items-center justify-center text-lg" style={{background: 'linear-gradient(135deg, #667eea, #764ba2)'}}>🎓</div>
          <span className="font-bold text-lg" style={{color: theme.text}}>EduStream</span>
          <button onClick={() => setShowSidebar(false)} className="ml-auto lg:hidden text-gray-400">✕</button>
        </div>

        {/* Nav */}
        <nav className="p-3 space-y-1">
          {[
            { icon: '🏠', label: 'Dashboard', action: () => handleNavigate('dashboard') },
            { icon: '📚', label: 'My Courses', action: () => handleNavigate('main') },
            { icon: '🔍', label: 'Explore', action: () => handleNavigate('explore') },
            { icon: '🏆', label: 'Leaderboard', action: () => handleNavigate('leaderboard') },
            { icon: '🎖️', label: 'Achievements', action: () => handleNavigate('achievements') },
            { icon: '🏅', label: 'Certificates', action: () => completedCount === totalCount && setPage('certificate') },
            { icon: '⚙️', label: 'Settings', action: () => handleNavigate('settings') },
          ].map((item, i) => (
            <button key={i} onClick={item.action}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200"
              style={{color: activePage === ['dashboard','main','explore','leaderboard','achievements','certificate','settings'][i] ? '#667eea' : theme.subtext, background: activePage === ['dashboard','main','explore','leaderboard','achievements','certificate','settings'][i] ? 'rgba(102,126,234,0.1)' : 'transparent'}}>
              <span>{item.icon}</span>{item.label}
              {item.label === 'Achievements' && earnedAchievements.length > 0 && (
                <span className="ml-auto text-xs px-1.5 py-0.5 rounded-full text-white" style={{background: 'linear-gradient(135deg, #667eea, #764ba2)'}}>{earnedAchievements.length}</span>
              )}
            </button>
          ))}
        </nav>

        {/* Current Course */}
        <div className="mx-3 mt-2 p-3 rounded-xl border" style={{background: theme.hover, borderColor: theme.border}}>
          <p className="text-xs font-bold uppercase tracking-wider mb-2" style={{color: theme.subtext}}>Current Course</p>
          <p className="text-sm font-bold mb-1" style={{color: theme.text}}>Full Stack Web Dev</p>
          <div className="h-1.5 rounded-full mb-1" style={{background: theme.border}}>
            <div className="h-1.5 rounded-full transition-all" style={{width: `${progressPercent}%`, background: 'linear-gradient(90deg, #667eea, #764ba2)'}} />
          </div>
          <p className="text-xs" style={{color: theme.subtext}}>{progressPercent}% Complete</p>
        </div>

        {/* Motivational */}
        <div className="mx-3 mt-3 p-3 rounded-xl" style={{background: 'rgba(102,126,234,0.1)', border: '1px solid rgba(102,126,234,0.2)'}}>
          <p className="text-xs font-bold text-purple-400">You are amazing! 🔥</p>
          <p className="text-xs mt-0.5" style={{color: theme.subtext}}>Keep going, you're doing great!</p>
        </div>

        <div className="mt-auto p-3 border-t" style={{borderColor: theme.border}}>
          <button onClick={handleLogout}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-sm transition hover:opacity-80"
            style={{color: theme.subtext}}>
            🚪 Logout
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <div className="flex-1 flex flex-col min-w-0">

        {/* TOP NAV */}
        <header className="sticky top-0 z-30 border-b px-4 py-3 flex items-center gap-3" style={{background: theme.sidebar, borderColor: theme.border, backdropFilter: 'blur(10px)'}}>
          <button onClick={() => setShowSidebar(true)} className="lg:hidden p-2 rounded-lg" style={{color: theme.subtext}}>☰</button>

          {/* Search */}
          <div className="flex-1 max-w-md relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm" style={{color: theme.subtext}}>🔍</span>
            <input value={sidebarSearch} onChange={e => setSidebarSearch(e.target.value)}
              placeholder="Search for courses, lessons..."
              className="w-full pl-9 pr-4 py-2 rounded-xl text-sm border focus:outline-none focus:border-purple-500 transition"
              style={{background: theme.hover, borderColor: theme.border, color: theme.text}} />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs px-1.5 py-0.5 rounded border" style={{color: theme.subtext, borderColor: theme.border}}>Ctrl K</span>
          </div>

          <div className="ml-auto flex items-center gap-3">
            {/* Streak */}
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl border" style={{borderColor: theme.border, background: theme.hover}}>
              <span>🔥</span>
              <div>
                <p className="text-xs font-bold" style={{color: theme.text}}>{dayStreak}</p>
                <p className="text-xs" style={{color: theme.subtext}}>Day Streak</p>
              </div>
            </div>

            {/* Dark mode */}
            <button onClick={() => setDarkMode(!darkMode)}
              className="w-9 h-9 rounded-xl flex items-center justify-center border transition hover:scale-110"
              style={{background: theme.hover, borderColor: theme.border}}>
              {darkMode ? '☀️' : '🌙'}
            </button>

            {/* Notifications */}
            <button className="w-9 h-9 rounded-xl flex items-center justify-center border relative" style={{background: theme.hover, borderColor: theme.border}}>
              🔔
              {earnedAchievements.length > 0 && <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full text-white text-xs flex items-center justify-center" style={{background: '#667eea'}}>{earnedAchievements.length}</span>}
            </button>

            {/* User */}
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl border" style={{borderColor: theme.border, background: theme.hover}}>
              <div className="w-7 h-7 rounded-full flex items-center justify-center text-white text-sm font-bold" style={{background: 'linear-gradient(135deg, #667eea, #764ba2)'}}>
                {user?.username?.charAt(0).toUpperCase()}
              </div>
              <div className="hidden sm:block">
                <p className="text-xs font-bold" style={{color: theme.text}}>{user?.username}</p>
                <p className="text-xs" style={{color: theme.subtext}}>Level {Math.floor(completedCount / 3) + 1}</p>
              </div>
            </div>
          </div>
        </header>

        {/* PAGE ROUTING */}
        {activePage === 'dashboard' && <div className="flex-1 overflow-y-auto"><Dashboard user={user} completedCount={completedCount} totalCount={totalCount} timeSpent={timeSpent} notes={notes.length} darkMode={darkMode} onNavigate={handleNavigate} /></div>}
        {activePage === 'explore' && <div className="flex-1 overflow-y-auto"><Explore darkMode={darkMode} onNavigate={handleNavigate} PLAYLIST={PLAYLIST} /></div>}
        {activePage === 'leaderboard' && <div className="flex-1 overflow-y-auto"><Leaderboard user={user} completedCount={completedCount} darkMode={darkMode} /></div>}
        {activePage === 'achievements' && <div className="flex-1 overflow-y-auto"><Achievements completedCount={completedCount} totalCount={totalCount} darkMode={darkMode} /></div>}
        {activePage === 'settings' && <div className="flex-1 overflow-y-auto"><Settings user={user} darkMode={darkMode} setDarkMode={setDarkMode} onLogout={handleLogout} /></div>}

        {/* MAIN COURSE VIEW */}
      
{activePage === 'main' && (
  <div> {/* <-- Change this from <> to <div> */}
    {/* ... all your other components and HTML elements inside ... */}
    
  </div> // <-- This will now correctly match line 629
)}
        {/* STATS BAR */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 p-4 border-b" style={{borderColor: theme.border}}>
          {[
            { icon: '✅', value: completedCount, label: 'Completed', sub: 'Lessons' },
            { icon: '📋', value: totalCount - completedCount, label: 'Remaining', sub: 'Lessons' },
            { icon: '📈', value: `${progressPercent}%`, label: 'Progress', sub: 'Overall' },
            { icon: '⏱️', value: formatTime(totalTimeSpent), label: 'Study Time', sub: 'Total' },
            { icon: '🎯', value: earnedAchievements.length, label: 'Achievements', sub: 'Earned' },
          ].map((stat, i) => (
            <div key={i} className="rounded-xl p-3 border flex items-center gap-3 transition hover:scale-105"
              style={{background: theme.card, borderColor: theme.border}}>
              <span className="text-2xl">{stat.icon}</span>
              <div>
                <p className="text-xl font-bold" style={{color: theme.text}}>{stat.value}</p>
                <p className="text-xs" style={{color: theme.subtext}}>{stat.label}</p>
                <p className="text-xs" style={{color: theme.subtext}}>{stat.sub}</p>
              </div>
            </div>
          ))}
        </div>

        {/* MAIN GRID */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-4 gap-0 overflow-hidden">

          {/* COURSE CONTENT PANEL */}
          <div className="border-r overflow-y-auto" style={{borderColor: theme.border, maxHeight: 'calc(100vh - 200px)'}}>
            <div className="p-4 border-b sticky top-0 z-10" style={{background: theme.sidebar, borderColor: theme.border}}>
              <h2 className="font-bold text-sm" style={{color: theme.text}}>Course Content</h2>
              <p className="text-xs mt-0.5" style={{color: theme.subtext}}>{totalCount} Lessons</p>
            </div>
            <div className="p-2">
              {PLAYLIST.filter(v => v.title.toLowerCase().includes(sidebarSearch.toLowerCase())).map((video, index) => (
                <button key={video.id} onClick={() => { setCurrentVideo(video); setShowQuiz(false); setActiveTab('overview'); }}
                  className="w-full flex items-center gap-3 p-3 rounded-xl text-left transition-all duration-200 mb-1"
                  style={{background: currentVideo.id === video.id ? 'rgba(102,126,234,0.15)' : 'transparent', border: currentVideo.id === video.id ? '1px solid rgba(102,126,234,0.3)' : '1px solid transparent'}}>
                  <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
                    style={{background: completedLessons.includes(video.id) ? 'linear-gradient(135deg, #11998e, #38ef7d)' : currentVideo.id === video.id ? 'linear-gradient(135deg, #667eea, #764ba2)' : theme.border, color: 'white'}}>
                    {completedLessons.includes(video.id) ? '✓' : index + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium truncate" style={{color: completedLessons.includes(video.id) ? theme.subtext : theme.text, textDecoration: completedLessons.includes(video.id) ? 'line-through' : 'none'}}>
                      {video.title}
                    </p>
                    {timeSpent[video.id] > 0 && <p className="text-xs" style={{color: theme.subtext}}>⏱️ {formatTime(timeSpent[video.id])}</p>}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* CENTER - VIDEO + TABS */}
          <div className="lg:col-span-2 overflow-y-auto" style={{maxHeight: 'calc(100vh - 200px)'}}>
            {/* Video */}
            <div className="aspect-video bg-black">
              <iframe className="w-full h-full"
                src={`https://www.youtube.com/embed/${currentVideo.embedId}`}
                title={currentVideo.title} frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen />
            </div>

            {/* Video info bar */}
            <div className="p-4 border-b flex items-center justify-between" style={{borderColor: theme.border}}>
              <div>
                <p className="text-xs mb-0.5" style={{color: theme.subtext}}>{currentIndex + 1}.{currentIndex + 1} {currentVideo.title}</p>
                <p className="text-xs" style={{color: theme.subtext}}>Lesson {currentIndex + 1} of {totalCount}</p>
              </div>
              <button onClick={() => toggleComplete(currentVideo.id)}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-white transition hover:opacity-90"
                style={{background: completedLessons.includes(currentVideo.id) ? 'linear-gradient(135deg, #11998e, #38ef7d)' : 'linear-gradient(135deg, #667eea, #764ba2)'}}>
                {completedLessons.includes(currentVideo.id) ? '✓ Completed' : '+ Mark Complete'}
              </button>
            </div>

            {/* Tabs */}
            <div className="flex border-b" style={{borderColor: theme.border}}>
              {['overview', 'notes', 'quiz', 'comments'].map(tab => (
                <button key={tab} onClick={() => setActiveTab(tab)}
                  className="px-4 py-3 text-xs font-bold capitalize transition border-b-2"
                  style={{color: activeTab === tab ? '#667eea' : theme.subtext, borderColor: activeTab === tab ? '#667eea' : 'transparent'}}>
                  {tab === 'quiz' ? '🎯 Quiz' : tab === 'notes' ? '📝 Notes' : tab === 'comments' ? `💬 Comments (${currentComments.length})` : '📄 Overview'}
                </button>
              ))}
            </div>

            {/* Tab content */}
            <div className="p-4">
              {/* Overview */}
              {activeTab === 'overview' && (
                <div className="space-y-4">
                  <div className="p-4 rounded-xl border" style={{background: theme.card, borderColor: theme.border}}>
                    <h3 className="font-bold mb-2" style={{color: theme.text}}>{currentVideo.title}</h3>
                    <p className="text-sm" style={{color: theme.subtext}}>In this lesson, you will learn about {currentVideo.title.toLowerCase()} and how it applies to modern software development.</p>
                  </div>
                  {/* Reactions */}
                  <div className="p-4 rounded-xl border" style={{background: theme.card, borderColor: theme.border}}>
                    <p className="text-xs font-bold uppercase tracking-wider mb-3" style={{color: theme.subtext}}>Reactions</p>
                    <div className="flex gap-2 flex-wrap">
                      {REACTIONS.map(emoji => {
                        const count = (currentReactions[emoji] || []).length;
                        const reacted = (currentReactions[emoji] || []).includes(user?.username);
                        return (
                          <button key={emoji} onClick={() => handleReaction(emoji)}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm border transition hover:scale-110"
                            style={{background: reacted ? 'rgba(102,126,234,0.2)' : theme.hover, borderColor: reacted ? '#667eea' : theme.border}}>
                            {emoji} {count > 0 && <span className="text-xs" style={{color: theme.subtext}}>{count}</span>}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                  {/* Next lesson */}
                  {nextLesson && (
                    <div className="p-4 rounded-xl border" style={{background: theme.card, borderColor: theme.border}}>
                      <p className="text-xs font-bold uppercase tracking-wider mb-2" style={{color: theme.subtext}}>Next Lesson</p>
                      <button onClick={() => setCurrentVideo(nextLesson)}
                        className="w-full flex items-center gap-3 p-3 rounded-xl transition hover:opacity-90"
                        style={{background: 'rgba(102,126,234,0.1)', border: '1px solid rgba(102,126,234,0.2)'}}>
                        <div className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold text-sm" style={{background: 'linear-gradient(135deg, #667eea, #764ba2)'}}>
                          {PLAYLIST.findIndex(v => v.id === nextLesson.id) + 1}
                        </div>
                        <div className="flex-1 text-left">
                          <p className="text-sm font-medium" style={{color: theme.text}}>{nextLesson.title}</p>
                          <p className="text-xs" style={{color: theme.subtext}}>{nextLesson.module}</p>
                        </div>
                        <span className="text-purple-400">→</span>
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* Notes */}
              {activeTab === 'notes' && (
                <div className="space-y-3">
                  <div className="flex gap-2">
                    <input type="text" value={noteText} onChange={e => setNoteText(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && handleSaveNote()}
                      placeholder="Add a note for this lesson..."
                      className="flex-1 rounded-xl border px-4 py-2.5 text-sm focus:outline-none focus:border-purple-500 transition"
                      style={{background: theme.hover, borderColor: theme.border, color: theme.text}} />
                    <button onClick={handleSaveNote}
                      className="px-4 py-2.5 rounded-xl text-sm font-bold text-white transition hover:opacity-90"
                      style={{background: 'linear-gradient(135deg, #667eea, #764ba2)'}}>+ Add</button>
                  </div>
                  {notes.length === 0 ? (
                    <div className="text-center py-8">
                      <p className="text-3xl mb-2">📝</p>
                      <p className="text-sm" style={{color: theme.subtext}}>No notes yet for this lesson</p>
                    </div>
                  ) : (
                    notes.map(note => (
                      <div key={note._id || note.id} className="p-3 rounded-xl border group" style={{background: theme.card, borderColor: theme.border}}>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs text-purple-400">📅 {note.createdAt ? new Date(note.createdAt).toLocaleString() : 'Just now'}</span>
                          <button onClick={() => handleDeleteNote(note._id)} className="text-xs text-gray-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition">✕</button>
                        </div>
                        <p className="text-sm" style={{color: theme.text}}>{note.noteText}</p>
                      </div>
                    ))
                  )}
                </div>
              )}

              {/* Quiz */}
              {activeTab === 'quiz' && (
                <div className="rounded-xl border p-4" style={{background: theme.card, borderColor: theme.border}}>
                  <Quiz videoId={currentVideo.id} darkMode={darkMode} onClose={() => setActiveTab('overview')} />
                </div>
              )}

              {/* Comments */}
              {activeTab === 'comments' && (
                <div className="space-y-3">
                  <div className="flex gap-2">
                    <input type="text" value={commentText} onChange={e => setCommentText(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && handleAddComment()}
                      placeholder="Write a comment..."
                      className="flex-1 rounded-xl border px-4 py-2.5 text-sm focus:outline-none focus:border-purple-500 transition"
                      style={{background: theme.hover, borderColor: theme.border, color: theme.text}} />
                    <button onClick={handleAddComment}
                      className="px-4 py-2.5 rounded-xl text-sm font-bold text-white transition hover:opacity-90"
                      style={{background: 'linear-gradient(135deg, #667eea, #764ba2)'}}>Post</button>
                  </div>
                  {currentComments.length === 0 ? (
                    <div className="text-center py-8">
                      <p className="text-3xl mb-2">💬</p>
                      <p className="text-sm" style={{color: theme.subtext}}>No comments yet. Be the first!</p>
                    </div>
                  ) : (
                    currentComments.map(comment => (
                      <div key={comment.id} className="p-3 rounded-xl border group" style={{background: theme.card, borderColor: theme.border}}>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-bold text-purple-400">@{comment.username}</span>
                          <span className="text-xs" style={{color: theme.subtext}}>{comment.time}</span>
                        </div>
                        <p className="text-sm" style={{color: theme.text}}>{comment.text}</p>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          </div>

          {/* RIGHT PANEL */}
          <div className="border-l overflow-y-auto" style={{borderColor: theme.border, maxHeight: 'calc(100vh - 200px)'}}>

            {/* Notebook */}
            <div className="p-4 border-b" style={{borderColor: theme.border}}>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-bold" style={{color: theme.text}}>📔 Notebook</h3>
                <span className="text-xs px-2 py-0.5 rounded-full" style={{background: 'rgba(102,126,234,0.2)', color: '#667eea'}}>{notes.length} Notes</span>
              </div>
              <input value={searchText} onChange={e => setSearchText(e.target.value)}
                placeholder="Search your notes..."
                className="w-full px-3 py-2 rounded-xl border text-xs focus:outline-none focus:border-purple-500 transition"
                style={{background: theme.hover, borderColor: theme.border, color: theme.text}} />
              <div className="mt-2 space-y-2 max-h-40 overflow-y-auto">
                {filteredNotes.slice(0, 3).map(note => (
                  <div key={note._id || note.id} className="p-2 rounded-lg border" style={{background: theme.hover, borderColor: theme.border}}>
                    <p className="text-xs font-bold" style={{color: theme.subtext}}>{note.createdAt ? new Date(note.createdAt).toLocaleDateString() : 'Today'}</p>
                    <p className="text-xs truncate" style={{color: theme.text}}>{note.noteText}</p>
                  </div>
                ))}
                {filteredNotes.length === 0 && <p className="text-xs text-center py-2" style={{color: theme.subtext}}>No notes yet</p>}
              </div>
            </div>

            {/* Achievements */}
            <div className="p-4 border-b" style={{borderColor: theme.border}}>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-bold" style={{color: theme.text}}>🏆 Achievements</h3>
                <button className="text-xs" style={{color: '#667eea'}}>View all →</button>
              </div>
              <div className="grid grid-cols-4 gap-2">
                {ACHIEVEMENTS.map(achievement => {
                  const earned = achievement.condition(completedCount, totalCount);
                  return (
                    <div key={achievement.id} title={achievement.desc}
                      className="flex flex-col items-center p-2 rounded-xl border transition"
                      style={{background: earned ? 'rgba(102,126,234,0.1)' : theme.hover, borderColor: earned ? 'rgba(102,126,234,0.3)' : theme.border, opacity: earned ? 1 : 0.4}}>
                      <span className="text-xl">{achievement.icon}</span>
                      <p className="text-xs text-center mt-1" style={{color: theme.subtext, fontSize: '9px'}}>{achievement.title}</p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Study Timer */}
            <div className="p-4 border-b" style={{borderColor: theme.border}}>
              <h3 className="text-sm font-bold mb-3" style={{color: theme.text}}>⏱️ Study Timer</h3>
              <div className="flex flex-col items-center">
                <div className="w-24 h-24 rounded-full border-4 flex items-center justify-center mb-3"
                  style={{borderColor: timerRunning ? '#667eea' : theme.border}}>
                  <span className="text-xl font-bold font-mono" style={{color: theme.text}}>{formatStudyTimer(studyTimer)}</span>
                </div>
                <p className="text-xs mb-3" style={{color: theme.subtext}}>Focus Time</p>
                <div className="flex gap-2">
                  <button onClick={() => setTimerRunning(!timerRunning)}
                    className="px-4 py-2 rounded-xl text-xs font-bold text-white transition hover:opacity-90"
                    style={{background: 'linear-gradient(135deg, #667eea, #764ba2)'}}>
                    {timerRunning ? '⏸ Pause' : '▶ Start'}
                  </button>
                  <button onClick={() => { setStudyTimer(25 * 60); setTimerRunning(false); }}
                    className="px-3 py-2 rounded-xl text-xs border transition hover:opacity-80"
                    style={{borderColor: theme.border, color: theme.subtext}}>↺</button>
                </div>
              </div>
            </div>

            {/* Progress */}
            <div className="p-4">
              <h3 className="text-sm font-bold mb-3" style={{color: theme.text}}>📊 Progress</h3>
              <div className="space-y-2">
                <div className="flex justify-between text-xs mb-1">
                  <span style={{color: theme.subtext}}>Overall</span>
                  <span style={{color: '#667eea'}}>{progressPercent}%</span>
                </div>
                <div className="h-2 rounded-full" style={{background: theme.border}}>
                  <div className="h-2 rounded-full transition-all duration-700" style={{width: `${progressPercent}%`, background: 'linear-gradient(90deg, #667eea, #764ba2)'}} />
                </div>
                {completedCount === totalCount && (
                  <button onClick={() => setPage('certificate')}
                    className="w-full mt-3 py-2 rounded-xl text-xs font-bold text-white transition hover:opacity-90"
                    style={{background: 'linear-gradient(135deg, #f093fb, #f5576c)'}}>
                    🏆 Get Certificate
                  </button>
                )}
              </div>
            </div>
          </div>

        </div>
      </div>
 </div>
  );
}