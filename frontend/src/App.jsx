import React, { useState, useEffect, useCallback, useRef } from 'react';
import axios from 'axios';
import Login from './pages/Login';
import Register from './pages/Register';
import Certificate from './pages/Certificate';
import Quiz from './components/Quiz';

const PLAYLIST = [
  { id: "lesson_1", title: "Introduction to Web Apps", embedId: "ysEN5RaKOlA" },
  { id: "lesson_2", title: "Understanding Databases", embedId: "HXV3zeQKqGY" },
  { id: "lesson_3", title: "Full-Stack Integration", embedId: "nu_pCVPKzTk" },
  { id: "lesson_4", title: "Networking", embedId: "qiQR5rTSshw" },
  { id: "lesson_5", title: "Data Analysis", embedId: "kghcAk7l6eA" },
  { id: "lesson_6", title: "Data Science", embedId: "4DlsTsqpY84" },
  { id: "lesson_7", title: "Python for Data Analysis", embedId: "wUSDVGivd-8" },
  { id: "lesson_8", title: "Python Tutorial", embedId: "ix9cRaBkVe0" },
  { id: "lesson_9", title: "JavaScript Tutorial", embedId: "lfmg-EJ8gm4" },
  { id: "lesson_10", title: "React JS Tutorial", embedId: "SqcY0GlETPk" },
  { id: "lesson_11", title: "Node JS Tutorial", embedId: "KOutPbKc9UM" },
  { id: "lesson_12", title: "HTML Full Course", embedId: "qz0aGYrrlhU" },
  { id: "lesson_13", title: "CSS Tutorial", embedId: "wRNinF7YQqQ" },
];

const REACTIONS = ['👍', '❤️', '😮', '🔥', '😂'];

export default function App() {
  const [page, setPage] = useState('login');
  const [user, setUser] = useState(null);
  const [notes, setNotes] = useState([]);
  const [noteText, setNoteText] = useState('');
  const [currentVideo, setCurrentVideo] = useState(PLAYLIST[0]);
  const [searchText, setSearchText] = useState('');
  const [completedLessons, setCompletedLessons] = useState([]);
  const [showDashboard, setShowDashboard] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
  const [mobileTab, setMobileTab] = useState('video');
  const [showSidebar, setShowSidebar] = useState(false);
  const [timeSpent, setTimeSpent] = useState({});
  const [isTimerRunning, setIsTimerRunning] = useState(true);
  const timerRef = useRef(null);

  // 🎯 QUIZ
  const [showQuiz, setShowQuiz] = useState(false);

  // 💬 COMMENTS & REACTIONS
  const [reactions, setReactions] = useState({});
  const [comments, setComments] = useState({});
  const [commentText, setCommentText] = useState('');
  const [showComments, setShowComments] = useState(false);

 const API_URL = 'https://my-application-nc8w.onrender.com/api/notes';

  const theme = {
    bg: darkMode ? 'linear-gradient(135deg, #0f0c29, #302b63, #24243e)' : 'linear-gradient(135deg, #e8eaf6, #c5cae9, #e3f2fd)',
    headerBg: darkMode ? 'rgba(15,12,41,0.85)' : 'rgba(255,255,255,0.85)',
    cardBg: darkMode ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.8)',
    cardBorder: darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
    text: darkMode ? 'text-white' : 'text-gray-900',
    subtext: darkMode ? 'text-gray-400' : 'text-gray-500',
    inputBg: darkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)',
    inputBorder: darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.15)',
    sidebarHeader: darkMode ? 'linear-gradient(135deg, rgba(102,126,234,0.2), rgba(118,75,162,0.2))' : 'linear-gradient(135deg, rgba(102,126,234,0.3), rgba(118,75,162,0.3))',
  };

  // ⏱️ Timer
  useEffect(() => {
    if (isTimerRunning && page === 'main') {
      timerRef.current = setInterval(() => {
        setTimeSpent(prev => ({ ...prev, [currentVideo.id]: (prev[currentVideo.id] || 0) + 1 }));
      }, 1000);
    }
    return () => clearInterval(timerRef.current);
  }, [currentVideo.id, isTimerRunning, page]);

  const formatTime = (seconds) => {
    if (!seconds) return '0:00';
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    if (h > 0) return `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const totalTimeSpent = Object.values(timeSpent).reduce((a, b) => a + b, 0);

  // 💬 Add reaction
  const handleReaction = (emoji) => {
    setReactions(prev => {
      const videoReactions = prev[currentVideo.id] || {};
      const current = videoReactions[emoji] || [];
      const alreadyReacted = current.includes(user?.username);
      return {
        ...prev,
        [currentVideo.id]: {
          ...videoReactions,
          [emoji]: alreadyReacted
            ? current.filter(u => u !== user?.username)
            : [...current, user?.username]
        }
      };
    });
  };

  // 💬 Add comment
  const handleAddComment = () => {
    if (!commentText.trim()) return;
    const newComment = {
      id: Date.now(),
      text: commentText,
      username: user?.username,
      time: new Date().toLocaleString()
    };
    setComments(prev => ({
      ...prev,
      [currentVideo.id]: [...(prev[currentVideo.id] || []), newComment]
    }));
    setCommentText('');
  };

  const handleDeleteComment = (commentId) => {
    setComments(prev => ({
      ...prev,
      [currentVideo.id]: (prev[currentVideo.id] || []).filter(c => c.id !== commentId)
    }));
  };

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

    // 📧 Send email when lesson is marked complete
    if (!wasCompleted && user?.email) {
      const lesson = PLAYLIST.find(v => v.id === videoId);
      try {
        await axios.post('https://my-application-nc8w.onrender.com/api/email/lesson-complete', {
          email: user.email,
          username: user.username,
          lessonTitle: lesson.title
        });
        console.log('Email sent!');
      } catch (error) {
        console.error('Email error:', error);
      }
    }
  };
  const filteredNotes = notes.filter(note =>
    note.noteText.toLowerCase().includes(searchText.toLowerCase())
  );

  const completedCount = completedLessons.length;
  const totalCount = PLAYLIST.length;
  const progressPercent = Math.round((completedCount / totalCount) * 100);

  const handleLogin = (userData) => { setUser(userData); setPage('main'); };
  const handleRegister = (userData) => { setUser(userData); setPage('main'); };
  const handleLogout = () => { setUser(null); setPage('login'); setCompletedLessons([]); clearInterval(timerRef.current); };

  if (page === 'login') return <Login onLogin={handleLogin} onGoRegister={() => setPage('register')} darkMode={darkMode} />;
  if (page === 'register') return <Register onRegister={handleRegister} onGoLogin={() => setPage('login')} darkMode={darkMode} />;
  if (page === 'certificate') return <Certificate user={user} completedCount={completedCount} totalCount={totalCount} onBack={() => setPage('main')} darkMode={darkMode} />;

  const currentReactions = reactions[currentVideo.id] || {};
  const currentComments = comments[currentVideo.id] || [];

  // 💬 Reactions & Comments Panel
  const ReactionsPanel = () => (
    <div className="rounded-2xl border p-4 space-y-4 transition-all duration-500"
      style={{background: theme.cardBg, borderColor: theme.cardBorder}}>
      {/* Reactions */}
      <div>
        <label className="text-xs font-bold text-purple-400 uppercase tracking-widest block mb-3">💬 Reactions</label>
        <div className="flex gap-2 flex-wrap">
          {REACTIONS.map(emoji => {
            const count = (currentReactions[emoji] || []).length;
            const reacted = (currentReactions[emoji] || []).includes(user?.username);
            return (
              <button key={emoji} onClick={() => handleReaction(emoji)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm font-bold border transition-all duration-200 hover:scale-110 ${
                  reacted ? 'border-purple-500 text-white' : 'border-white/10 text-gray-400 hover:border-purple-400'
                }`}
                style={reacted ? {background: 'linear-gradient(135deg, rgba(102,126,234,0.3), rgba(118,75,162,0.3))'} : {background: theme.inputBg}}>
                {emoji} {count > 0 && <span className="text-xs">{count}</span>}
              </button>
            );
          })}
        </div>
      </div>

      {/* Comments toggle */}
      <div>
        <button onClick={() => setShowComments(!showComments)}
          className={`text-xs font-bold text-purple-400 uppercase tracking-widest flex items-center gap-2`}>
          💬 Comments ({currentComments.length})
          <span className="text-gray-500">{showComments ? '▲' : '▼'}</span>
        </button>

        {showComments && (
          <div className="mt-3 space-y-3">
            {/* Comment input */}
            <div className="flex gap-2">
              <input type="text" value={commentText} onChange={(e) => setCommentText(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAddComment()}
                placeholder="Write a comment..."
                className={`flex-1 rounded-xl border px-3 py-2 text-xs ${theme.text} placeholder-gray-500 focus:border-purple-500 focus:outline-none`}
                style={{background: theme.inputBg, borderColor: theme.inputBorder}} />
              <button onClick={handleAddComment}
                className="rounded-xl px-3 py-2 text-xs font-bold text-white transition hover:opacity-90"
                style={{background: 'linear-gradient(135deg, #667eea, #764ba2)'}}>Post</button>
            </div>

            {/* Comments list */}
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {currentComments.length === 0 ? (
                <p className={`text-xs ${theme.subtext} text-center py-4`}>No comments yet. Be the first! 💬</p>
              ) : (
                currentComments.map(comment => (
                  <div key={comment.id} className="p-3 rounded-xl border group transition"
                    style={{background: theme.inputBg, borderColor: theme.cardBorder}}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold text-purple-400">@{comment.username}</span>
                      <div className="flex items-center gap-2">
                        <span className={`text-xs ${theme.subtext}`}>{comment.time}</span>
                        {comment.username === user?.username && (
                          <button onClick={() => handleDeleteComment(comment.id)}
                            className="text-gray-500 hover:text-red-400 text-xs opacity-0 group-hover:opacity-100 transition">✕</button>
                        )}
                      </div>
                    </div>
                    <p className={`text-xs ${theme.text}`}>{comment.text}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );

  const SidebarContent = () => (
    <div className="rounded-2xl border overflow-hidden transition-all duration-500"
      style={{background: theme.cardBg, borderColor: theme.cardBorder}}>
      <div className="p-4 border-b" style={{background: theme.sidebarHeader, borderColor: theme.cardBorder}}>
        <h2 className={`text-sm font-bold uppercase tracking-widest ${theme.text}`}>📚 Course Modules</h2>
        <p className={`text-xs ${theme.subtext} mt-1`}>{totalCount} lessons available</p>
      </div>
      <div className="p-3 space-y-1 max-h-[520px] overflow-y-auto">
        {PLAYLIST.map((video, index) => (
          <div key={video.id} className="flex items-center gap-2">
            <button onClick={() => { setCurrentVideo(video); setShowSidebar(false); setMobileTab('video'); setShowComments(false); }}
              className={`flex-1 text-left px-3 py-2.5 rounded-xl text-xs font-medium transition-all duration-200 flex items-center gap-2 border ${
                currentVideo.id === video.id ? `${theme.text} border-purple-500/50` : `${theme.subtext} border-transparent`
              } ${completedLessons.includes(video.id) ? 'opacity-50 line-through' : ''}`}
              style={currentVideo.id === video.id ? {background: 'linear-gradient(135deg, rgba(102,126,234,0.3), rgba(118,75,162,0.3))'} : {}}>
              <span className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 text-white"
                style={{background: currentVideo.id === video.id ? 'linear-gradient(135deg, #667eea, #764ba2)' : 'rgba(128,128,128,0.3)'}}>
                {index + 1}
              </span>
              <div className="flex-1 min-w-0">
                <div className="truncate">{video.title}</div>
                {timeSpent[video.id] > 0 && (
                  <div className="text-xs text-purple-400 mt-0.5">⏱️ {formatTime(timeSpent[video.id])}</div>
                )}
              </div>
            </button>
            <button onClick={() => toggleComplete(video.id)}
              className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-200 flex-shrink-0 ${
                completedLessons.includes(video.id) ? 'text-white' : 'border border-gray-400 text-gray-400 hover:border-green-400 hover:text-green-400'
              }`}
              style={completedLessons.includes(video.id) ? {background: 'linear-gradient(135deg, #11998e, #38ef7d)'} : {}}>✓</button>
          </div>
        ))}
      </div>
    </div>
  );

  const NotesPanel = () => (
    <div className="rounded-2xl border flex flex-col transition-all duration-500"
      style={{background: theme.cardBg, borderColor: theme.cardBorder, minHeight: '400px'}}>
      <div className="p-4 border-b" style={{background: theme.sidebarHeader, borderColor: theme.cardBorder}}>
        <div className="flex items-center justify-between mb-2">
          <h2 className={`text-sm font-bold uppercase tracking-widest ${theme.text}`}>📓 Notebook</h2>
          <span className="text-xs px-2 py-0.5 rounded-full text-purple-400 border border-purple-500/30">{filteredNotes.length} notes</span>
        </div>
        <input type="text" value={searchText} onChange={(e) => setSearchText(e.target.value)}
          placeholder="🔍 Search notes..."
          className={`w-full rounded-xl border px-3 py-2 text-xs ${theme.text} placeholder-gray-500 focus:border-purple-500 focus:outline-none`}
          style={{background: theme.inputBg, borderColor: theme.inputBorder}} />
      </div>
      <div className="flex-1 overflow-y-auto p-3 space-y-2" style={{maxHeight: '400px'}}>
        {filteredNotes.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 text-center">
            <div className="text-4xl mb-3">📭</div>
            <p className={`text-xs ${theme.subtext}`}>{searchText ? 'No notes match.' : 'No notes yet.'}</p>
          </div>
        ) : (
          filteredNotes.map((note) => (
            <div key={note._id || note.id}
              className="p-3 rounded-xl border hover:border-purple-500/30 transition-all duration-200 group"
              style={{background: darkMode ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)', borderColor: theme.cardBorder}}>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs text-purple-400">📅 {note.createdAt ? new Date(note.createdAt).toLocaleString() : 'Just now'}</span>
                <button onClick={() => handleDeleteNote(note._id)}
                  className="text-gray-400 hover:text-red-400 text-xs transition opacity-0 group-hover:opacity-100">✕</button>
              </div>
              <p className={`text-xs break-words leading-relaxed ${theme.text}`}>{note.noteText}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen font-sans transition-all duration-500" style={{background: theme.bg}}>

      {showSidebar && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/60" onClick={() => setShowSidebar(false)} />
          <div className="absolute left-0 top-0 bottom-0 w-80 p-4 overflow-y-auto"
            style={{background: darkMode ? '#0f0c29' : '#e8eaf6'}}>
            <div className="flex justify-between items-center mb-4">
              <h2 className={`font-bold ${theme.text}`}>Course Modules</h2>
              <button onClick={() => setShowSidebar(false)} className="text-gray-400 hover:text-white text-xl">✕</button>
            </div>
            <SidebarContent />
          </div>
        </div>
      )}

      <header className="sticky top-0 z-40 border-b transition-all duration-500"
        style={{background: theme.headerBg, borderColor: theme.cardBorder, backdropFilter: 'blur(10px)'}}>
        <div className="container mx-auto px-4 py-3 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <button onClick={() => setShowSidebar(true)}
              className="lg:hidden w-9 h-9 rounded-xl flex items-center justify-center border transition"
              style={{background: theme.cardBg, borderColor: theme.cardBorder}}>
              <span className={theme.text}>☰</span>
            </button>
            <div className="w-9 h-9 rounded-xl flex items-center justify-center text-lg"
              style={{background: 'linear-gradient(135deg, #667eea, #764ba2)'}}>🎓</div>
            <div className="hidden sm:block">
              <h1 className={`text-base font-bold ${theme.text}`}>EduStream</h1>
              <p className="text-xs text-purple-400">Welcome, {user?.username}!</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="hidden sm:flex items-center gap-1 px-3 py-1.5 rounded-xl border"
              style={{background: theme.cardBg, borderColor: theme.cardBorder}}>
              <span className="text-xs">⏱️</span>
              <span className={`text-xs font-mono font-bold ${theme.text}`}>{formatTime(timeSpent[currentVideo.id] || 0)}</span>
              <button onClick={() => setIsTimerRunning(!isTimerRunning)}
                className="ml-1 text-xs text-purple-400 hover:text-purple-300">{isTimerRunning ? '⏸' : '▶️'}</button>
            </div>
            <div className="hidden sm:block text-right">
              <p className={`text-xs ${theme.subtext}`}>{completedCount}/{totalCount}</p>
              <div className="w-20 h-1.5 rounded-full mt-1" style={{background: darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}}>
                <div className="h-1.5 rounded-full transition-all duration-700"
                  style={{width: `${progressPercent}%`, background: 'linear-gradient(90deg, #667eea, #764ba2)'}} />
              </div>
            </div>
            <button onClick={() => setDarkMode(!darkMode)}
              className="w-9 h-9 rounded-xl flex items-center justify-center border transition hover:scale-110"
              style={{background: theme.cardBg, borderColor: theme.cardBorder}}>
              {darkMode ? '☀️' : '🌙'}
            </button>
            <button onClick={() => setShowDashboard(!showDashboard)}
              className="hidden sm:flex px-3 py-2 rounded-xl text-xs font-bold text-white border border-white/20 hover:border-purple-500 transition">📊</button>
            {completedCount === totalCount && (
              <button onClick={() => setPage('certificate')}
                className="px-2 py-2 rounded-xl text-xs font-bold text-white transition hover:opacity-90"
                style={{background: 'linear-gradient(135deg, #f093fb, #f5576c)'}}>🏆</button>
            )}
            <button onClick={handleLogout}
              className={`px-3 py-2 rounded-xl text-xs font-bold border transition ${darkMode ? 'text-gray-400 border-white/10 hover:border-red-500 hover:text-red-400' : 'text-gray-600 border-gray-300 hover:border-red-500 hover:text-red-500'}`}>
              Exit
            </button>
          </div>
        </div>
        <div className="lg:hidden flex border-t" style={{borderColor: theme.cardBorder}}>
          {['video', 'notes', 'comments'].map(tab => (
            <button key={tab} onClick={() => setMobileTab(tab)}
              className={`flex-1 py-2 text-xs font-bold uppercase tracking-wider transition ${
                mobileTab === tab ? 'text-purple-400 border-b-2 border-purple-400' : theme.subtext}`}>
              {tab === 'video' ? '🎬' : tab === 'notes' ? '📓' : '💬'}
            </button>
          ))}
        </div>
      </header>

      {showDashboard && (
        <div className="border-b" style={{background: darkMode ? 'rgba(102,126,234,0.1)' : 'rgba(102,126,234,0.05)', borderColor: theme.cardBorder}}>
          <div className="container mx-auto px-4 py-4 grid grid-cols-2 lg:grid-cols-5 gap-3">
            {[
              { value: completedCount, label: 'Completed' },
              { value: totalCount - completedCount, label: 'Remaining' },
              { value: `${progressPercent}%`, label: 'Progress' },
              { value: notes.length, label: 'Notes' },
              { value: formatTime(totalTimeSpent), label: 'Total Time' },
            ].map((stat, i) => (
              <div key={i} className="rounded-xl p-3 border text-center" style={{background: theme.cardBg, borderColor: theme.cardBorder}}>
                <p className={`text-2xl font-bold ${theme.text}`}>{stat.value}</p>
                <p className={`text-xs ${theme.subtext} mt-1`}>{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Desktop Layout */}
      <div className="hidden lg:grid container mx-auto px-4 py-6 grid-cols-4 gap-6">
        <div className="col-span-1"><SidebarContent /></div>
        <div className="col-span-2 space-y-4">
          <div className="rounded-2xl overflow-hidden border shadow-2xl" style={{background: 'rgba(0,0,0,0.5)', borderColor: theme.cardBorder}}>
            <div className="aspect-video">
              <iframe className="w-full h-full" src={`https://www.youtube.com/embed/${currentVideo.embedId}`}
                title={currentVideo.title} frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen />
            </div>
            <div className="px-4 py-3 flex items-center justify-between"
              style={{background: darkMode ? 'rgba(15,12,41,0.8)' : 'rgba(255,255,255,0.9)'}}>
              <div>
                <h3 className={`text-sm font-bold ${theme.text}`}>{currentVideo.title}</h3>
                <p className={`text-xs ${theme.subtext}`}>Lesson {PLAYLIST.findIndex(v => v.id === currentVideo.id) + 1} of {totalCount} • ⏱️ {formatTime(timeSpent[currentVideo.id] || 0)}</p>
              </div>
              <button onClick={() => toggleComplete(currentVideo.id)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all duration-200 ${completedLessons.includes(currentVideo.id) ? 'text-white' : `border ${darkMode ? 'border-white/20 text-gray-400' : 'border-gray-300 text-gray-500'} hover:border-green-400 hover:text-green-400`}`}
                style={completedLessons.includes(currentVideo.id) ? {background: 'linear-gradient(135deg, #11998e, #38ef7d)'} : {}}>
                {completedLessons.includes(currentVideo.id) ? '✓ Completed' : 'Mark Complete'}
              </button>
            </div>
          </div>
          {/* 🎯 Quiz Button & Panel */}
          <div className="rounded-2xl border overflow-hidden transition-all duration-500"
            style={{background: theme.cardBg, borderColor: theme.cardBorder}}>
            <button onClick={() => setShowQuiz(!showQuiz)}
              className="w-full px-4 py-3 flex items-center justify-between transition hover:opacity-90"
              style={{background: 'linear-gradient(135deg, rgba(102,126,234,0.2), rgba(118,75,162,0.2))'}}>
              <span className={`text-sm font-bold ${theme.text}`}>🎯 Take Quiz — {currentVideo.title}</span>
              <span className="text-purple-400 text-xs">{showQuiz ? '▲ Hide' : '▼ Start'}</span>
            </button>
            {showQuiz && (
              <div className="p-4">
                <Quiz videoId={currentVideo.id} darkMode={darkMode} onClose={() => setShowQuiz(false)} />
              </div>
            )}
          </div>
          {/* Reactions & Comments */}
          <ReactionsPanel />
          <div className="rounded-2xl border p-4" style={{background: theme.cardBg, borderColor: theme.cardBorder}}>
            <label className="text-xs font-bold text-purple-400 uppercase tracking-widest block mb-3">📝 Add Note</label>
            <div className="flex gap-2">
              <input type="text" value={noteText} onChange={(e) => setNoteText(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSaveNote()}
                placeholder="Type a note... (Press Enter to save)"
                className={`flex-1 rounded-xl border px-4 py-2.5 text-sm ${theme.text} placeholder-gray-500 focus:border-purple-500 focus:outline-none`}
                style={{background: theme.inputBg, borderColor: theme.inputBorder}} />
              <button onClick={handleSaveNote}
                className="rounded-xl px-5 py-2.5 text-sm font-bold text-white hover:opacity-90 hover:scale-105 transition"
                style={{background: 'linear-gradient(135deg, #667eea, #764ba2)'}}>Save</button>
            </div>
          </div>
        </div>
        <div className="col-span-1" style={{height: '600px'}}><NotesPanel /></div>
      </div>

      {/* Mobile Layout */}
      <div className="lg:hidden container mx-auto px-4 py-4">
        {mobileTab === 'video' && (
          <div className="space-y-4">
            <div className="rounded-2xl overflow-hidden border shadow-2xl" style={{background: 'rgba(0,0,0,0.5)', borderColor: theme.cardBorder}}>
              <div className="aspect-video">
                <iframe className="w-full h-full" src={`https://www.youtube.com/embed/${currentVideo.embedId}`}
                  title={currentVideo.title} frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen />
              </div>
              <div className="px-4 py-3 flex items-center justify-between"
                style={{background: darkMode ? 'rgba(15,12,41,0.8)' : 'rgba(255,255,255,0.9)'}}>
                <div>
                  <h3 className={`text-sm font-bold ${theme.text}`}>{currentVideo.title}</h3>
                  <p className={`text-xs ${theme.subtext}`}>⏱️ {formatTime(timeSpent[currentVideo.id] || 0)}</p>
                </div>
                <button onClick={() => toggleComplete(currentVideo.id)}
                  className={`px-3 py-2 rounded-xl text-xs font-bold transition-all ${completedLessons.includes(currentVideo.id) ? 'text-white' : `border ${darkMode ? 'border-white/20 text-gray-400' : 'border-gray-300 text-gray-500'}`}`}
                  style={completedLessons.includes(currentVideo.id) ? {background: 'linear-gradient(135deg, #11998e, #38ef7d)'} : {}}>
                  {completedLessons.includes(currentVideo.id) ? '✓ Done' : 'Complete'}
                </button>
              </div>
            </div>
            <div className="rounded-2xl border p-4" style={{background: theme.cardBg, borderColor: theme.cardBorder}}>
              <label className="text-xs font-bold text-purple-400 uppercase tracking-widest block mb-3">📝 Add Note</label>
              <div className="flex gap-2">
                <input type="text" value={noteText} onChange={(e) => setNoteText(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSaveNote()}
                  placeholder="Type a note..."
                  className={`flex-1 rounded-xl border px-4 py-2.5 text-sm ${theme.text} placeholder-gray-500 focus:border-purple-500 focus:outline-none`}
                  style={{background: theme.inputBg, borderColor: theme.inputBorder}} />
                <button onClick={handleSaveNote}
                  className="rounded-xl px-4 py-2.5 text-sm font-bold text-white transition"
                  style={{background: 'linear-gradient(135deg, #667eea, #764ba2)'}}>Save</button>
              </div>
            </div>
          </div>
        )}
        {mobileTab === 'notes' && <NotesPanel />}
        {mobileTab === 'comments' && <ReactionsPanel />}
      </div>

    </div>
  );
}