import { useState } from "react";

const QUIZZES = {
  lesson_1: {
    title: "Introduction to Web Apps",
    questions: [
      { q: "What does HTML stand for?", options: ["Hyper Text Markup Language", "High Tech Modern Language", "Home Tool Markup Language", "Hyper Transfer Markup Language"], answer: 0 },
      { q: "Which language is used for styling web pages?", options: ["JavaScript", "Python", "CSS", "PHP"], answer: 2 },
      { q: "What does a web browser do?", options: ["Compiles code", "Renders web pages", "Stores databases", "Sends emails"], answer: 1 },
    ]
  },
  lesson_2: {
    title: "Understanding Databases",
    questions: [
      { q: "What is a database?", options: ["A programming language", "Organized collection of data", "A web browser", "An operating system"], answer: 1 },
      { q: "What does SQL stand for?", options: ["Simple Query Language", "Structured Query Language", "Standard Question Language", "System Query Logic"], answer: 1 },
      { q: "Which is a NoSQL database?", options: ["MySQL", "PostgreSQL", "MongoDB", "SQLite"], answer: 2 },
    ]
  },
  lesson_3: {
    title: "Full-Stack Integration",
    questions: [
      { q: "What is a full-stack developer?", options: ["Only frontend", "Only backend", "Both frontend and backend", "Database specialist"], answer: 2 },
      { q: "What is an API?", options: ["A database", "Application Programming Interface", "A web browser", "A CSS framework"], answer: 1 },
      { q: "What does REST stand for?", options: ["Remote Execute State Transfer", "Representational State Transfer", "Remote System Technology", "Real-time Exchange Standard Transfer"], answer: 1 },
    ]
  },
  lesson_4: {
    title: "Networking",
    questions: [
      { q: "What does HTTP stand for?", options: ["Hyper Text Transfer Protocol", "High Tech Transfer Protocol", "Home Transfer Text Protocol", "Hyper Transfer Text Process"], answer: 0 },
      { q: "What is an IP address?", options: ["Internet Password", "Unique identifier for devices on a network", "Internet Protocol Address only for servers", "A type of domain name"], answer: 1 },
      { q: "What port does HTTPS use?", options: ["80", "21", "443", "8080"], answer: 2 },
    ]
  },
  lesson_5: {
    title: "Data Analysis",
    questions: [
      { q: "What is data analysis?", options: ["Writing code", "Inspecting and modeling data to discover insights", "Designing websites", "Building databases"], answer: 1 },
      { q: "Which Python library is used for data analysis?", options: ["Django", "Flask", "Pandas", "React"], answer: 2 },
      { q: "What is a dataset?", options: ["A single data point", "A collection of related data", "A database query", "A programming function"], answer: 1 },
    ]
  },
  lesson_6: {
    title: "Data Science",
    questions: [
      { q: "What is machine learning?", options: ["Teaching computers to learn from data", "A type of database", "A web framework", "A CSS library"], answer: 0 },
      { q: "Which library is used for machine learning in Python?", options: ["NumPy", "Scikit-learn", "Matplotlib", "Flask"], answer: 1 },
      { q: "What is data visualization?", options: ["Storing data", "Representing data graphically", "Deleting data", "Encrypting data"], answer: 1 },
    ]
  },
  lesson_7: {
    title: "Python for Data Analysis",
    questions: [
      { q: "What is NumPy used for?", options: ["Web development", "Numerical computing", "Database management", "UI design"], answer: 1 },
      { q: "What does iloc do in Pandas?", options: ["Filters by column name", "Selects by integer position", "Sorts data", "Deletes rows"], answer: 1 },
      { q: "Which function reads a CSV in Pandas?", options: ["pd.read_excel()", "pd.load_csv()", "pd.read_csv()", "pd.import_csv()"], answer: 2 },
    ]
  },
  lesson_8: {
    title: "Python Tutorial",
    questions: [
      { q: "What is Python?", options: ["A snake", "A high-level programming language", "A database", "A web browser"], answer: 1 },
      { q: "How do you print in Python?", options: ["console.log()", "echo()", "print()", "printf()"], answer: 2 },
      { q: "What is a list in Python?", options: ["A dictionary", "An ordered mutable collection", "A function", "A class"], answer: 1 },
    ]
  },
  lesson_9: {
    title: "JavaScript Tutorial",
    questions: [
      { q: "What is JavaScript?", options: ["A styling language", "A markup language", "A programming language for the web", "A database language"], answer: 2 },
      { q: "How do you declare a variable in modern JS?", options: ["var only", "let and const", "dim", "variable"], answer: 1 },
      { q: "What does DOM stand for?", options: ["Document Object Model", "Data Object Management", "Dynamic Object Module", "Document Output Mode"], answer: 0 },
    ]
  },
  lesson_10: {
    title: "React JS Tutorial",
    questions: [
      { q: "What is React?", options: ["A database", "A JavaScript UI library", "A CSS framework", "A server language"], answer: 1 },
      { q: "What is JSX?", options: ["JavaScript XML syntax", "A database query", "A CSS preprocessor", "A JavaScript compiler"], answer: 0 },
      { q: "What is a React component?", options: ["A database table", "A reusable piece of UI", "A CSS class", "A server endpoint"], answer: 1 },
    ]
  },
  lesson_11: {
    title: "Node JS Tutorial",
    questions: [
      { q: "What is Node.js?", options: ["A frontend framework", "JavaScript runtime for the server", "A CSS library", "A database"], answer: 1 },
      { q: "What is npm?", options: ["Node Package Manager", "New Programming Module", "Network Protocol Manager", "Node Process Monitor"], answer: 0 },
      { q: "Which framework is built on Node.js?", options: ["React", "Vue", "Express", "Angular"], answer: 2 },
    ]
  },
  lesson_12: {
    title: "HTML Full Course",
    questions: [
      { q: "What tag creates a hyperlink?", options: ["<link>", "<a>", "<href>", "<url>"], answer: 1 },
      { q: "What tag is used for the largest heading?", options: ["<h6>", "<heading>", "<h1>", "<title>"], answer: 2 },
      { q: "What does the <div> tag do?", options: ["Creates a link", "Displays an image", "Creates a block container", "Adds a table"], answer: 2 },
    ]
  },
  lesson_13: {
    title: "CSS Tutorial",
    questions: [
      { q: "What does CSS stand for?", options: ["Computer Style Sheets", "Cascading Style Sheets", "Creative Style Syntax", "Colorful Style Sheets"], answer: 1 },
      { q: "Which property changes text color in CSS?", options: ["font-color", "text-color", "color", "foreground"], answer: 2 },
      { q: "What is the CSS box model?", options: ["A 3D model", "Content, padding, border, margin", "A grid system", "A flexbox layout"], answer: 1 },
    ]
  },
};

function Quiz({ videoId, darkMode, onClose }) {
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [finished, setFinished] = useState(false);

  const quiz = QUIZZES[videoId];
  if (!quiz) return (
    <div className="text-center py-8">
      <p className="text-gray-400 text-sm">No quiz available for this lesson yet.</p>
      <button onClick={onClose} className="mt-4 px-4 py-2 rounded-xl text-xs font-bold text-white"
        style={{background: 'linear-gradient(135deg, #667eea, #764ba2)'}}>Close</button>
    </div>
  );

  const question = quiz.questions[current];
  const score = answers.filter(a => a.correct).length;

  const handleAnswer = (index) => {
    if (selected !== null) return;
    setSelected(index);
  };

  const handleNext = () => {
    if (selected === null) return;
    const newAnswers = [...answers, { selected, correct: selected === question.answer }];
    setAnswers(newAnswers);
    if (current + 1 >= quiz.questions.length) {
      setFinished(true);
    } else {
      setCurrent(current + 1);
      setSelected(null);
    }
  };

  const cardBg = darkMode ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.9)';
  const cardBorder = darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)';
  const text = darkMode ? 'text-white' : 'text-gray-900';
  const subtext = darkMode ? 'text-gray-400' : 'text-gray-500';

  if (finished) {
    const percent = Math.round((score / quiz.questions.length) * 100);
    return (
      <div className="text-center py-4">
        <div className="text-5xl mb-3">{percent >= 70 ? '🎉' : percent >= 40 ? '😊' : '📚'}</div>
        <h3 className={`text-xl font-bold ${text} mb-2`}>Quiz Complete!</h3>
        <p className={`text-sm ${subtext} mb-4`}>{quiz.title}</p>
        <div className="w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold text-white"
          style={{background: percent >= 70 ? 'linear-gradient(135deg, #11998e, #38ef7d)' : percent >= 40 ? 'linear-gradient(135deg, #f093fb, #f5576c)' : 'linear-gradient(135deg, #667eea, #764ba2)'}}>
          {percent}%
        </div>
        <p className={`text-sm font-bold ${text} mb-1`}>{score}/{quiz.questions.length} correct</p>
        <p className={`text-xs ${subtext} mb-6`}>{percent >= 70 ? 'Excellent! You mastered this lesson! 🏆' : percent >= 40 ? 'Good effort! Review the lesson again.' : 'Keep studying! You can do it! 💪'}</p>
        <div className="flex gap-2 justify-center">
          <button onClick={() => { setCurrent(0); setSelected(null); setAnswers([]); setFinished(false); }}
            className="px-4 py-2 rounded-xl text-xs font-bold text-white transition hover:opacity-90"
            style={{background: 'linear-gradient(135deg, #667eea, #764ba2)'}}>Retry Quiz</button>
          <button onClick={onClose}
            className={`px-4 py-2 rounded-xl text-xs font-bold border transition ${darkMode ? 'text-gray-400 border-white/20 hover:border-purple-500' : 'text-gray-600 border-gray-300'}`}>
            Close</button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <span className={`text-xs ${subtext}`}>Question {current + 1} of {quiz.questions.length}</span>
        <div className="flex gap-1">
          {quiz.questions.map((_, i) => (
            <div key={i} className="w-2 h-2 rounded-full transition-all"
              style={{background: i < current ? '#11998e' : i === current ? '#667eea' : darkMode ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.2)'}} />
          ))}
        </div>
      </div>

      <h3 className={`text-sm font-bold ${text} mb-4 leading-relaxed`}>{question.q}</h3>

      <div className="space-y-2 mb-4">
        {question.options.map((option, index) => {
          let style = {background: cardBg, borderColor: cardBorder};
          let textClass = subtext;
          if (selected !== null) {
            if (index === question.answer) { style = {background: 'rgba(17,153,142,0.2)', borderColor: '#11998e'}; textClass = 'text-green-400'; }
            else if (index === selected && selected !== question.answer) { style = {background: 'rgba(245,87,108,0.2)', borderColor: '#f5576c'}; textClass = 'text-red-400'; }
          } else if (selected === index) {
            style = {background: 'rgba(102,126,234,0.2)', borderColor: '#667eea'};
            textClass = 'text-purple-400';
          }
          return (
            <button key={index} onClick={() => handleAnswer(index)}
              className={`w-full text-left px-4 py-3 rounded-xl border text-xs font-medium transition-all duration-200 ${textClass} ${selected === null ? 'hover:border-purple-400 cursor-pointer' : 'cursor-default'}`}
              style={style}>
              <span className="mr-2 font-bold">{['A', 'B', 'C', 'D'][index]}.</span>{option}
            </button>
          );
        })}
      </div>

      <button onClick={handleNext} disabled={selected === null}
        className={`w-full py-2.5 rounded-xl text-xs font-bold text-white transition-all duration-200 ${selected === null ? 'opacity-50 cursor-not-allowed' : 'hover:opacity-90 hover:scale-105'}`}
        style={{background: 'linear-gradient(135deg, #667eea, #764ba2)'}}>
        {current + 1 >= quiz.questions.length ? 'Finish Quiz 🎯' : 'Next Question →'}
      </button>
    </div>
  );
}

export default Quiz;
export { QUIZZES };