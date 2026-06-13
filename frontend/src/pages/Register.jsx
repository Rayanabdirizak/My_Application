import { useState } from "react";

function Register({ onRegister, onGoLogin }) {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const newUser = { username, email, password };

  const handleRegister = () => {
    if (!username || !email || !password) { setError("Please fill in all fields"); return; }
    if (password.length < 6) { setError("Password must be at least 6 characters"); return; }
    const users = JSON.parse(localStorage.getItem("users") || "[]");
    if (users.find(u => u.email === email)) { setError("Email already registered"); return; }
    const newUser = { username, email, password };
    users.push(newUser);
    localStorage.setItem("users", JSON.stringify(users));
    onRegister(newUser);
  };

  return (
    <div className="min-h-screen flex items-center justify-center" style={{background: 'linear-gradient(135deg, #0f0c29, #302b63, #24243e)'}}>
      <div className="w-full max-w-md p-8 rounded-2xl border border-white/10" style={{background: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(10px)'}}>
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-4" style={{background: 'linear-gradient(135deg, #667eea, #764ba2)'}}>🎓</div>
          <h1 className="text-2xl font-bold text-white">Create Account</h1>
          <p className="text-gray-400 text-sm mt-1">Join EduStream today</p>
        </div>
        {error && <p className="text-red-400 text-sm text-center mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20">{error}</p>}
        <div className="space-y-4">
          <input
            className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-gray-500 focus:border-purple-500 focus:outline-none transition-all"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-gray-500 focus:border-purple-500 focus:outline-none transition-all"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-gray-500 focus:border-purple-500 focus:outline-none transition-all"
            placeholder="Password (min 6 characters)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleRegister()}
          />
          <button onClick={handleRegister}
            className="w-full py-3 rounded-xl text-white font-bold text-sm transition-all duration-200 hover:opacity-90 hover:scale-105"
            style={{background: 'linear-gradient(135deg, #11998e, #38ef7d)'}}>
            Create Account
          </button>
        </div>
        <p className="text-center text-gray-400 text-sm mt-6">
          Already have an account?{" "}
          <button onClick={onGoLogin} className="text-purple-400 hover:text-purple-300 font-medium">Sign in here</button>
        </p>
      </div>
    </div>
  );
}
export default Register;
