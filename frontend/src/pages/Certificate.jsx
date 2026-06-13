function Certificate({ user, completedCount, totalCount, onBack }) {
  const today = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <div className="min-h-screen flex items-center justify-center p-8" style={{background: 'linear-gradient(135deg, #0f0c29, #302b63, #24243e)'}}>
      <div className="w-full max-w-2xl">
        <button onClick={onBack} className="mb-6 text-purple-400 hover:text-purple-300 text-sm flex items-center gap-2 transition">
          ← Back to Dashboard
        </button>
        <div className="rounded-2xl p-10 text-center border-2" style={{background: 'rgba(255,255,255,0.05)', borderColor: 'rgba(102,126,234,0.5)', backdropFilter: 'blur(10px)'}}>
          <div className="text-6xl mb-4">🏆</div>
          <div className="text-xs font-bold uppercase tracking-widest text-purple-400 mb-4">Certificate of Completion</div>
          <div className="h-px w-32 mx-auto mb-6" style={{background: 'linear-gradient(90deg, #667eea, #764ba2)'}} />
          <p className="text-gray-400 text-sm mb-2">This certifies that</p>
          <h1 className="text-4xl font-bold text-white mb-2">{user?.username || "Student"}</h1>
          <p className="text-gray-400 text-sm mb-6">has successfully completed</p>
          <h2 className="text-2xl font-bold mb-2" style={{background: 'linear-gradient(135deg, #667eea, #764ba2)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'}}>
            EduStream Advanced Learning Program
          </h2>
          <p className="text-gray-400 text-sm mb-6">completing {completedCount} out of {totalCount} lessons</p>
          <div className="h-px w-32 mx-auto mb-6" style={{background: 'linear-gradient(90deg, #667eea, #764ba2)'}} />
          <p className="text-gray-500 text-xs">Issued on {today}</p>
          <button
            onClick={() => window.print()}
            className="mt-8 px-8 py-3 rounded-xl text-white font-bold text-sm transition-all duration-200 hover:opacity-90"
            style={{background: 'linear-gradient(135deg, #667eea, #764ba2)'}}>
            🖨️ Print Certificate
          </button>
        </div>
      </div>
    </div>
  );
}
export default Certificate;
