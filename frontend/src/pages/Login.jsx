import { useState } from "react";

function Login({ onLogin, onGoRegister }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = () => {
    if (!email || !password) { setError("Please fill in all fields"); return; }
    const users = JSON.parse(localStorage.getItem("users") || "[]");
    const user = users.find(u => u.email === email && u.password === password);
    if (user) { onLogin(user); }
    else { setError("Invalid email or password"); }
  };

  return (
    <div className="min-h-screen flex items-center justify-center" style={{background: 'linear-gradient(135deg, #0f0c29, #302b63, #24243e)'}}>
      <div className="w-full max-w-md p-8 rounded-2xl border border-white/10" style={{background: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(10px)'}}>
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-4" style={{background: 'linear-gradient(135deg, #667eea, #764ba2)'}}>🎓</div>
          <h1 className="text-2xl font-bold text-white">Welcome Back</h1>
          <p className="text-gray-400 text-sm mt-1">Sign in to EduStream</p>
        </div>
        {error && <p className="text-red-400 text-sm text-center mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20">{error}</p>}
        <div className="space-y-4">
          <input
            className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-gray-500 focus:border-purple-500 focus:outline-none transition-all"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-gray-500 focus:border-purple-500 focus:outline-none transition-all"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
          />
          <button onClick={handleLogin}
            className="w-full py-3 rounded-xl text-white font-bold text-sm transition-all duration-200 hover:opacity-90 hover:scale-105"
            style={{background: 'linear-gradient(135deg, #667eea, #764ba2)'}}>
            Sign In
          </button>
        </div>
        <p className="text-center text-gray-400 text-sm mt-6">
          Don't have an account?{" "}
          <button onClick={onGoRegister} className="text-purple-400 hover:text-purple-300 font-medium">Register here</button>
        </p>
      </div>
    </div>
  );
}
export default Login;
