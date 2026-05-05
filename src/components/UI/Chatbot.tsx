import React, { useState, useRef, useEffect } from 'react';
import { Settings, X, MessageCircle, Bot, Send, Loader2 } from 'lucide-react';
import { profileData } from '../../data/profileData';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hey there! 👋 I'm Aryan's AI assistant (built into this portfolio). Ask me anything about his skills, projects, experience, or certifications!",
      sender: 'bot',
      timestamp: new Date(),
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
    }
  }, [inputValue]);

  // Smart response generator using profile data
  const generateResponse = (query: string): string => {
    const q = query.toLowerCase();

    // Greetings
    if (/\b(hi|hello|hey|greetings|sup|yo)\b/.test(q)) {
      return "Hey! 👋 Great to see you! What would you like to know about Aryan?";
    }

    // Goodbye
    if (/\b(bye|goodbye|see you|later)\b/.test(q)) {
      return "Thanks for chatting! 👋 Don't forget to check out Aryan's projects!";
    }

    // Thanks
    if (/\b(thanks|thank you|thx)\b/.test(q)) {
      return "You're welcome! 😊 Anything else you'd like to know?";
    }

    // Help
    if (/\b(help|what can you)\b/.test(q)) {
      return `I can tell you about:\n• Skills & tech stack 💻\n• 12+ projects 🚀\n• 5 internships 💼\n• Education 🎓\n• 25+ certifications 🏆\n• Contact info 📧\n\nJust ask naturally!`;
    }

    // Jokes
    if (/\b(joke|funny|laugh)\b/.test(q)) {
      const jokes = [
        "Why do programmers prefer dark mode? Because light attracts bugs! 🐛",
        "How many programmers to change a bulb? None - that's hardware! 💡",
        "Why do Java devs wear glasses? Because they can't C#! 😎",
        "A SQL query walks into a bar... Can I JOIN you? 🍺",
        "Why did the dev go broke? Used up all his cache! 💸",
      ];
      return jokes[Math.floor(Math.random() * jokes.length)];
    }

    // WHO ARE YOU / ABOUT
    if (/\b(who are you|what are you|your name)\b/.test(q) || q.includes("who is aryan")) {
      return `Aryan Mishra - AI & ML specialist & Full-Stack Developer 🎓\n\nFinal semester B.Tech (CS with AI/ML) at Presidency University Bengaluru. He's built an award-winning facial recognition system (92%+ accuracy), worked 5 internships, earned 25+ certifications, and has 72+ technical skills. Currently seeking ML/SDE/Full-Stack roles!\n\nContact: ${profileData.contact.email}`;
    }

    // SKILLS
    if (/\b(skill|technology|tech stack|programming|languages)\b/.test(q)) {
      const sorted = [...profileData.skills].sort((a, b) => b.level - a.level);
      const top = sorted.slice(0, 5);
      return `Top skills (${sorted.length} total):\n\n${top.map(s => `• ${s.name}: ${s.level}%`).join('\n')}\n\nHe also knows: ML, AI, Computer Vision, Data Science, Cloud, IoT, and more!`;
    }

    // SPECIFIC SKILL QUERIES
    const skillMap: Record<string, string> = {
      'python': `Python: ${profileData.skills.find(s => s.name === 'Python')?.level}% - Used for ML, AI, data science, and backend. Powers his facial recognition and 5G simulation projects.`,
      'javascript': `JavaScript: ${profileData.skills.find(s => s.name === 'JavaScript')?.level}% - Used for web dev with React. Full-stack expertise.`,
      'react': `React: ${profileData.skills.find(s => s.name === 'React')?.level}% - Built this portfolio with React + TypeScript. Also skilled in hooks, components, modern patterns.`,
      'machine learning': `Machine Learning: ${profileData.skills.find(s => s.name === 'Machine Learning')?.level}% - Core specialty! Projects: facial recognition, 5G optimization, weather prediction, CSV automation.`,
      'ml': `ML: ${profileData.skills.find(s => s.name === 'Machine Learning')?.level}% - Uses TensorFlow, scikit-learn, and more.`,
      'ai': `AI: ${profileData.skills.find(s => s.name === 'Artificial Intelligence')?.level}% - Deep learning, neural networks, NLP, computer vision.`,
    };

    for (const [key, answer] of Object.entries(skillMap)) {
      if (q.includes(key)) return answer;
    }

    // PROJECTS
    if (/\b(project|built|created|developed|work)\b/.test(q)) {
      // Specific projects
      if (/(face|facial|recognition|missing)/.test(q)) {
        return `🏆 Facial Recognition System\n• 92%+ accuracy 🎯\n• Identifies missing persons using Aadhaar biometrics\n• Won "Best Societal Relevant Project" (400+ submissions)\n• Python, OpenCV, Raspberry Pi\n\nThis is his award-winning project!`;
      }
      if (/(5g|network|simulation)/.test(q)) {
        return `📡 5G Network Simulation\n• 300-400% throughput improvement 🚀\n• AI-driven adaptive resource management\n• Reinforcement learning (Q-Learning)\n• Python, Flask, TensorFlow, NumPy\n\nDemonstrates AI + networking mastery!`;
      }
      if (/(pib|multilingual|video|press)/.test(q)) {
        return `🎥 PIB Multilingual Video Platform\n• Transforms press releases into videos\n• 94% speech synthesis accuracy\n• 87% user satisfaction\n• Next.js, React, TypeScript, AI/ML\n\nGovernment communications revolutionized!`;
      }
      if (/(csv|dashboard|automated)/.test(q)) {
        return `📊 CSV-Automated Dashboard\n• Full ML pipeline automation\n• File upload → cleaning → analysis → predictions → visualizations → reports\n• Python, pandas, matplotlib, plotly\n\nA data scientist's dream tool!`;
      }
      if (/(thala|thalassemia|healthcare|medical)/.test(q)) {
        return `❤️ ThalaCare AI Assistant\n• Helps thalassemia patients manage condition\n• Multilingual conversational AI\n• Medical report translation\n• Symptom tracking\n\nTech for social good!`;
      }
      if (/(weather|forecast|prediction)/.test(q)) {
        return `🌤️ Weather Prediction Platform\n• 5-year forecasts using ML\n• Simulated models (Random Forest, XGBoost, LSTM, Ensemble)\n• Historical + real-time data\n• React, TypeScript, Chart.js\n\nAccurate and user-friendly!`;
      }
      if (/(sql|database|monitoring)/.test(q)) {
        return `🗄️ SQL Database Dashboard\n• Real-time DB monitoring\n• Server & DB stats with <1s latency\n• Performance metrics\n• Terminate heavy processes\n• SQL, Web Development\n\nLike a task manager for databases!`;
      }
      if (/(face detection)/.test(q) || q.includes('face dection')) {
        return `👁️ Face Detection/Recognition - see "facial recognition" above.`;
      }

      // Default project list
      return `Aryan has 12+ major projects:\n\n🏆 Facial Recognition (92% accuracy)\n📡 5G Network Simulation (300-400% improvement)\n🎥 PIB Multilingual Video Platform\n📊 CSV-Automated Dashboard\n🏥 ThalaCare AI Assistant\n🌤️ Weather Prediction\n🗄️ SQL Database Dashboard\n\nWant details on a specific project? Just ask!`;
    }

    // EXPERIENCE / INTERNSHIPS
    if (/\b(experience|internship|interned|worked|job|company)\b/.test(q)) {
      if (q.includes('airtel')) return `📱 **Airtel Digital** (Aug-Oct 2025)\nStudent Intern - Data Science & Network Optimization. Gained real-world experience at India's leading telecom.`;
      if (q.includes('gaia') || q.includes('smart city')) return `🌆 **Gaia Smart City** (Jul-Oct 2025)\nAI-ML Intern - IoT-based smart city solutions. Got a Letter of Recommendation!`;
      if (q.includes('scanpick')) return `💻 **ScanPick** (Oct 2024 - May 2025)\nFull-Stack Developer - Built responsive full-stack apps. Got Offer Letter + LOR!`;
      if (q.includes('xtelify')) return `📊 **Xtelify Limited** (Aug-Oct 2025)\nData Science Intern - Research projects with expert mentorship.`;
      if (q.includes('capgemini')) return `☁️ **Capgemini** (Feb-May 2026)\nCloud Infrastructure Associate - Enterprise cloud projects, automation, optimization.`;
      if (q.includes('sewa') || q.includes('social')) return `❤️ **Subhansh Sewa Trust** (May-Jun 2024)\nSocial Entrepreneurship Intern - Fundraising, social impact. Got LOR!`;

      return `5 impressive internships:\n\n1. Capgemini - Cloud Infrastructure (2026)\n2. Airtel Digital - Data Science (2025)\n3. Xtelify - Data Science (2025)\n4. Gaia Smart City - AI/ML (2025)\n5. ScanPick - Full-Stack (2024-25)\n\nAll with recommendation letters!`;
    }

    // EDUCATION
    if (/\b(education|university|college|degree|study|school)\b/.test(q)) {
      if (q.includes('presidency') || q.includes('current')) {
        return `🎓 **B.Tech in CS with AI/ML**\nPresidency University, Bengaluru\nNov 2022 - Nov 2026 (Final semester)\n\nSkills acquired: DSA, Web Apps, TensorFlow, MySQL, Video Analytics, Chatbot Dev, and more!`;
      }
      if (q.includes('hiranandani') || q.includes('school')) {
        return `🏫 **Hiranandani Foundation School** (2020-2022)\nComputer Science - HTML, XML, CSS, JavaScript, problem solving. This is where it all began!`;
      }
      return `🎓 B.Tech (CS + AI/ML) - Presidency University (2022-2026)\n🏫 Hiranandani Foundation School (2020-2022)`;
    }

    // CERTIFICATES
    if (/\b(certificate|certification|achievement|award)\b/.test(q)) {
      if (q.includes('google')) return `Google certs:\n• Google Analytics Individual Qualification\n• Digital Marketing\n• And more! (25+ total)`;
      if (q.includes('oracle')) return `🏆 Oracle Foundation Associate - prestigious DB & enterprise tech cert!`;
      if (q.includes('deloitte')) return `📊 Deloitte Australia - Data Analytics Job Simulation via Forage.`;
      if (q.includes('linux')) return `🐧 Linux Foundation - "A Beginner's Guide to Linux Kernel Development"`;
      if (q.includes('microsoft')) return `Microsoft: Power BI Desktop, Azure DevOps, SCCM Training.`;
      if (q.includes('ibm')) return `IBM: Design Thinking, Vector Database Essentials.`;
      return `🏆 25+ certifications from:\nGoogle, Oracle, Deloitte, Linux Foundation, Microsoft, IBM, TCS, and more!`;
    }

    // CONTACT
    if (/\b(contact|email|phone|reach|connect|location)\b/.test(q)) {
      return `📬 **Contact Aryan:**\n\n📧 ${profileData.contact.email}\n📱 ${profileData.contact.phone}\n📍 ${profileData.contact.location}\n\n💼 LinkedIn: ${profileData.contact.linkedinLink}\n💻 GitHub: ${profileData.contact.githubLink}\n🐦 ${profileData.contact.twitter}\n\nHe's responsive and open to opportunities! 🚀`;
    }

    // SOCIAL MEDIA
    if (/\b(linkedin|github|social|twitter|facebook)\b/.test(q)) {
      if (q.includes('linkedin')) return `💼 LinkedIn: ${profileData.contact.linkedinLink}\n\n743+ followers, 500+ connections, #OPEN_TO_WORK, very active!`;
      if (q.includes('github')) return `💻 GitHub: ${profileData.contact.githubLink}\n\nCheck out his repos: AI/ML, web apps, data science, open source!`;
      return `Social media:\n\n💼 LinkedIn: ${profileData.contact.linkedinLink}\n💻 GitHub: ${profileData.contact.githubLink}\n🐦 Twitter: ${profileData.contact.twitter}\n📘 Facebook: ${profileData.contact.facebook}`;
    }

    // CURRENT STATUS / AVAILABILITY
    if (/\b(current|now|present|doing|available|open to work|hire|hiring)\b/.test(q)) {
      return `🎯 **Currently:**\n• Final semester B.Tech at Presidency University\n• Recently completed Capgemini Cloud Infrastructure role\n• **Actively seeking** ML, SDE, and Full-Stack roles!\n• Available after graduation (Nov 2026)\n\nInterested? Email: ${profileData.contact.email}`;
    }

    // ABOUT / SUMMARY
    if (/\b(about|bio|summary|tell me about|who is)\b/.test(q)) {
      return `Aryan Mishra - AI & ML Specialist & Full-Stack Developer 🌟\n\n🏆 Award-winning facial recognition (92%+ accuracy, 400+ submissions)\n📜 25+ certifications (Google, Oracle, Deloitte, Linux, Microsoft)\n💼 5 internships (Capgemini, Airtel, Xtelify, Gaia, ScanPick)\n🚀 12+ major projects\n💻 72+ technical skills\n🎓 Final semester B.Tech (CS + AI/ML) at Presidency University\n\nOpen to ML, SDE, and Full-Stack roles!`;
    }

    // ACHIEVEMENTS / AWARDS
    if (/\b(achievement|award|recognition|won|best)\b/.test(q)) {
      return `🏆 **Major Awards & Achievements:**\n\n• "Best Societal Relevant Project" award (400+ submissions)\n• Facial recognition system: 92%+ accuracy\n• Raspberry Pi certification (top 70/400)\n• 25+ industry certifications\n• Letters of Recommendation from all internships\n• 743+ LinkedIn followers`;
    }

    // HOW MANY
    if (/\b(how many)\b/.test(q)) {
      if (q.includes('project')) return `12+ major projects! 🚀`;
      if (q.includes('certificate') || q.includes('certification')) return `25+ certifications! 🏆`;
      if (q.includes('skill')) return `72+ technical skills! 💻`;
      if (q.includes('internship') || q.includes('experience')) return `5 internships + 1 social entrepreneurship role! 💼`;
      return `He's accomplished a lot! Try asking "how many projects" or "how many certifications"?`;
    }

    // BEST / TOP
    if (/\b(best|strongest|top)\b/.test(q)) {
      if (q.includes('skill')) return `Top skills:\n1. Python - 90% 🔥\n2. HTML - 90% 🔥\n3. TypeScript - 80%\n4. React - 80%\n5. ML/AI - 80%`;
      if (q.includes('project')) return `Facial Recognition System - his standout project! 92%+ accuracy, award-winning, helps find missing persons.`;
      return `His greatest strength is combining AI/ML with real-world impact - like the facial recognition system that reunites families! 🌟`;
    }

    // LOCATION
    if (/\b(where|located|live|based|from)\b/.test(q) && /\b(based|located|live)\b/.test(q)) {
      return `📍 Bengaluru (Bangalore), Karnataka, India - India's Silicon Valley! 🌆 Open to relocation for the right opportunity.`;
    }

    // RESUME / CV
    if (/\b(resume|cv|download)\b/.test(q)) {
      return `📄 Download Aryan's CV from the Resume page on this website! Or email him at ${profileData.contact.email}`;
    }

    // PORTFOLIO / WEBSITE
    if (/\b(portfolio|website|this site)\b/.test(q)) {
      return `He built this entire portfolio himself! 💻 React + TypeScript + Tailwind CSS + Three.js (3D effects). Yes, this chatbot is also his creation! 🤖`;
    }

    // Default fallback
    return `I'm not sure I understood. I can tell you about Aryan's:\n\n• Skills & technologies 💻\n• Projects & achievements 🚀\n• Work experience 💼\n• Education 🎓\n• 25+ certifications 🏆\n• Contact info 📧\n\nJust ask naturally! Example: "What projects has he built?"`;
  };

  const handleSendMessage = () => {
    if (inputValue.trim() === '') return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    // Simulate natural thinking delay (300-800ms)
    const thinkingTime = 300 + Math.random() * 500;
    setTimeout(() => {
      const response = generateResponse(userMessage.text);
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: response,
        sender: 'bot',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, botMessage]);
      setIsLoading(false);
    }, thinkingTime);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 sm:bottom-6 sm:right-6 max-w-[calc(100vw-2rem)]">
      {isOpen ? (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-[90vw] max-w-xs sm:w-80 h-[70vh] max-h-[500px] sm:h-96 flex flex-col border border-gray-200 dark:border-gray-700">
          {/* Header */}
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-3 rounded-t-lg flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-full bg-white/20 p-1.5">
                <Bot size={20} className="text-white" />
              </div>
              <div>
                <span className="font-medium block text-sm">Aryan's Assistant</span>
                <span className="text-xs opacity-90 flex items-center gap-1">
                  <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                  Offline
                </span>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setShowSettings(true)}
                className="p-1.5 hover:bg-white/10 rounded-full transition-colors"
                title="Info"
              >
                <Settings size={18} />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 hover:bg-white/10 rounded-full transition-colors"
                title="Close"
              >
                <X size={18} />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-3 bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`mb-3 ${message.sender === 'user' ? 'text-right' : 'text-left'}`}
              >
                <div
                  className={`inline-block p-3 rounded-lg max-w-[85%] sm:max-w-xs shadow-md ${
                    message.sender === 'user'
                      ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-tr-none'
                      : 'bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-tl-none border border-gray-200 dark:border-gray-600'
                  }`}
                >
                  {/* Format message with links */}
                  {message.text.split('\n').map((line, i) => {
                    const urlParts = line.split(/(https?:\/\/[^\s]+)/g);
                    return (
                      <div key={i} className="mb-1 last:mb-0">
                        {urlParts.map((urlPart, j) => {
                          if (urlPart.match(/https?:\/\/[^\s]+/)) {
                            return (
                              <a
                                key={`${i}-${j}`}
                                href={urlPart}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={`${message.sender === 'user' ? 'text-yellow-200' : 'text-blue-600 dark:text-blue-400'} underline hover:opacity-80 font-medium`}
                              >
                                {urlPart}
                              </a>
                            );
                          }
                          const emailParts = urlPart.split(/([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/g);
                          return (
                            <span key={`${i}-${j}`}>
                              {emailParts.map((emailPart, k) => {
                                if (emailPart.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/)) {
                                  return (
                                    <a
                                      key={`${i}-${j}-${k}`}
                                      href={`mailto:${emailPart}`}
                                      className={`${message.sender === 'user' ? 'text-yellow-200' : 'text-blue-600 dark:text-blue-400'} underline hover:opacity-80 font-medium`}
                                    >
                                      {emailPart}
                                    </a>
                                  );
                                }
                                return <span key={`${i}-${j}-${k}`}>{emailPart}</span>;
                              })}
                            </span>
                          );
                        })}
                      </div>
                    );
                  })}
                </div>
                <div className={`text-xs text-gray-500 dark:text-gray-400 mt-1 ${message.sender === 'user' ? 'text-right' : 'text-left'}`}>
                  {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            ))}

            {/* Typing indicator */}
            {isLoading && (
              <div className="mb-3 text-left">
                <div className="inline-block p-3 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-tl-none shadow-md border border-gray-200 dark:border-gray-600">
                  <div className="flex items-center gap-2">
                    <Loader2 size={16} className="animate-spin text-indigo-500" />
                    <span className="text-sm text-gray-500">Thinking...</span>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-3 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
            <div className="flex gap-2">
              <textarea
                ref={textareaRef}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask about Aryan... 💬"
                className="flex-1 border border-gray-300 dark:border-gray-600 rounded-lg p-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white transition-all"
                rows={1}
                style={{ minHeight: '40px', maxHeight: '120px' }}
              />
              <button
                onClick={handleSendMessage}
                disabled={isLoading || !inputValue.trim()}
                className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-4 rounded-lg hover:from-indigo-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2 shadow-md"
                aria-label="Send"
              >
                <Send size={16} />
              </button>
            </div>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-4 rounded-full shadow-lg hover:shadow-xl hover:from-indigo-700 hover:to-purple-700 transition-all transform hover:scale-110 active:scale-95 flex items-center justify-center group relative"
          aria-label="Open chatbot"
        >
          <MessageCircle size={24} />
          <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-pulse"></span>
        </button>
      )}

      {/* Settings/Info Modal */}
      {showSettings && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl max-w-md w-full p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">Chatbot Info</h3>
              <button
                onClick={() => setShowSettings(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4">
              <div className="bg-indigo-50 dark:bg-indigo-900/20 rounded-lg p-4 border border-indigo-200 dark:border-indigo-800">
                <div className="flex items-center gap-2 mb-2">
                  <Bot size={20} className="text-indigo-600 dark:text-indigo-400" />
                  <span className="font-medium text-indigo-900 dark:text-indigo-100">Offline Rule-Based System</span>
                </div>
                <p className="text-sm text-indigo-700 dark:text-indigo-300">
                  This chatbot runs completely offline using Aryan's portfolio data. No external API calls, no internet required!
                </p>
              </div>

              <div>
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">What I know about:</h4>
                <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                  <li>✅ All 12+ projects with details</li>
                  <li>✅ 5 internships & work experience</li>
                  <li>✅ 25+ certifications</li>
                  <li>✅ 72+ skills & proficiency levels</li>
                  <li>✅ Education & achievements</li>
                  <li>✅ Contact info & social links</li>
                  <li>✅ Can tell jokes! 😄</li>
                </ul>
              </div>

              <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3 text-sm text-gray-600 dark:text-gray-400">
                <p className="font-medium mb-1">💡 Example questions:</p>
                <ul className="space-y-1 text-xs">
                  <li>"What are Aryan's top skills?"</li>
                  <li>"Tell me about his facial recognition project"</li>
                  <li>"Where has he worked?"</li>
                  <li>"What certifications does he have?"</li>
                  <li>"How can I contact him?"</li>
                  <li>"Tell me a joke!"</li>
                </ul>
              </div>
            </div>

            <button
              onClick={() => setShowSettings(false)}
              className="mt-4 w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-lg transition-colors"
            >
              Got it!
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Chatbot;
