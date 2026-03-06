import React, { useState, useEffect, useRef } from 'react';
import { profileData } from '../../data/profileData';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

interface ConversationContext {
  lastTopic: string;
  userName: string | null;
  messageCount: number;
  askedAbout: Set<string>;
}

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hey there! 👋 I'm Aryan's AI assistant (yes, he built me too - meta, right?). I know everything about Aryan's portfolio, projects, and skills. Ask me anything, and I promise to keep it interesting! 😄",
      sender: 'bot',
      timestamp: new Date(),
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [context, setContext] = useState<ConversationContext>({
    lastTopic: '',
    userName: null,
    messageCount: 0,
    askedAbout: new Set()
  });
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Personality responses - jokes, fun facts, and conversational elements
  const personalityResponses = {
    jokes: [
      "Why do programmers prefer dark mode? Because light attracts bugs! 🐛 Speaking of which, Aryan's code is pretty bug-free (most of the time 😉).",
      "How many programmers does it take to change a light bulb? None, that's a hardware problem! 💡 But Aryan can handle both software AND hardware - he's worked with Raspberry Pi!",
      "Why do Java developers wear glasses? Because they can't C#! 😎 Aryan knows both though, plus Python, JavaScript, and more!",
      "A SQL query walks into a bar, walks up to two tables and asks... 'Can I JOIN you?' 🍺 Aryan's SQL skills are no joke though - check out his database projects!",
      "Why did the developer go broke? Because he used up all his cache! 💸 Unlike him, Aryan's projects are well-optimized!",
      "What's a programmer's favorite hangout place? Foo Bar! 🍻 But seriously, Aryan's been to some cool places - worked at Airtel, Gaia Smart Cities, and more!",
      "Why do programmers always mix up Halloween and Christmas? Because Oct 31 == Dec 25! 🎃🎄 Aryan would catch that bug instantly!",
      "How do you comfort a JavaScript bug? You console it! 😂 Aryan's debugging skills are top-notch though!"
    ],
    funFacts: [
      "Fun fact: Aryan's facial recognition system has 92%+ accuracy - that's better than some humans at recognizing faces! 🎯",
      "Did you know? Aryan has 25+ certifications from Google, Oracle, Deloitte, and more. He's basically a certification collector! 🏆",
      "Here's something cool: Aryan's 5G network simulation showed 300-400% throughput improvements. That's like turning a bicycle into a rocket! 🚀",
      "Random fact: Aryan has 743+ LinkedIn followers and is actively growing his network. He's kind of a big deal! 😎",
      "Interesting tidbit: Aryan worked on IoT-based smart city solutions. He's literally helping build the cities of tomorrow! 🌆",
      "Cool fact: Aryan's multilingual video platform achieves 94% speech synthesis accuracy across multiple languages! 🗣️",
      "Did you know? Aryan has worked on 12+ major projects spanning AI/ML, web dev, and data science. Talk about versatile! 🎨"
    ],
    encouragements: [
      "Great question! Let me tell you about that...",
      "Ooh, I love talking about this!",
      "Excellent choice! Here's what you need to know...",
      "Now we're getting to the good stuff!",
      "Ah yes, one of my favorite topics!",
      "Smart question! Here's the scoop...",
      "I was hoping you'd ask about that!"
    ],
    transitions: [
      "By the way,",
      "Oh, and here's something interesting:",
      "Fun fact:",
      "Also worth mentioning:",
      "Here's a cool detail:",
      "You might also want to know:",
      "Quick note:"
    ]
  };

  const getRandomElement = (arr: string[]) => arr[Math.floor(Math.random() * arr.length)];

  // Enhanced natural language processing
  const extractIntent = (message: string): { intent: string; entities: string[] } => {
    const msg = message.toLowerCase();
    const entities: string[] = [];

    // Extract potential entities
    if (msg.includes('python')) entities.push('python');
    if (msg.includes('javascript') || msg.includes('js')) entities.push('javascript');
    if (msg.includes('react')) entities.push('react');
    if (msg.includes('machine learning') || msg.includes('ml')) entities.push('ml');
    if (msg.includes('ai') || msg.includes('artificial intelligence')) entities.push('ai');

    // Determine intent
    if (msg.match(/\b(hi|hello|hey|greetings|sup|yo)\b/)) return { intent: 'greeting', entities };
    if (msg.match(/\b(bye|goodbye|see you|later|exit)\b/)) return { intent: 'farewell', entities };
    if (msg.match(/\b(thanks|thank you|thx|appreciate)\b/)) return { intent: 'gratitude', entities };
    if (msg.match(/\b(joke|funny|laugh|humor)\b/)) return { intent: 'joke', entities };
    if (msg.match(/\b(who are you|what are you|your name)\b/)) return { intent: 'bot_identity', entities };
    if (msg.match(/\b(help|what can you|capabilities)\b/)) return { intent: 'help', entities };
    if (msg.match(/\b(name|who is|who's)\b/)) return { intent: 'name', entities };
    if (msg.match(/\b(skill|technology|tech stack|programming)\b/)) return { intent: 'skills', entities };
    if (msg.match(/\b(project|work|built|created|developed)\b/)) return { intent: 'projects', entities };
    if (msg.match(/\b(experience|job|internship|work|company)\b/)) return { intent: 'experience', entities };
    if (msg.match(/\b(education|university|college|degree|study)\b/)) return { intent: 'education', entities };
    if (msg.match(/\b(certificate|certification|achievement|award)\b/)) return { intent: 'certificates', entities };
    if (msg.match(/\b(contact|email|phone|reach|connect)\b/)) return { intent: 'contact', entities };
    if (msg.match(/\b(about|bio|summary|tell me about|who is aryan)\b/)) return { intent: 'about', entities };
    if (msg.match(/\b(linkedin|github|social|twitter|facebook)\b/)) return { intent: 'social', entities };
    if (msg.match(/\b(current|now|present|doing|working on)\b/)) return { intent: 'current_status', entities };
    if (msg.match(/\b(hire|hiring|available|open to work|job)\b/)) return { intent: 'availability', entities };

    return { intent: 'general', entities };
  };

  const getBotResponse = (userMessage: string): string => {
    const { intent, entities } = extractIntent(userMessage);
    const msg = userMessage.toLowerCase();

    // Update context
    setContext(prev => ({
      ...prev,
      messageCount: prev.messageCount + 1,
      lastTopic: intent,
      askedAbout: new Set([...prev.askedAbout, intent])
    }));

    // Greeting responses
    if (intent === 'greeting') {
      const greetings = [
        `Hey! 👋 ${context.userName ? context.userName + ', ' : ''}Great to see you! What would you like to know about Aryan?`,
        `Hello there! 😊 Ready to dive into Aryan's amazing portfolio? Ask me anything!`,
        `Hi! 🌟 I'm here to tell you all about Aryan's skills, projects, and achievements. What interests you?`,
        `Hey hey! 👨‍💻 Welcome! I've got all the insider info on Aryan. What would you like to explore?`,
        `Greetings! 🚀 Let's talk about Aryan's awesome work. What catches your interest?`
      ];
      return getRandomElement(greetings);
    }

    // Farewell responses
    if (intent === 'farewell') {
      const farewells = [
        "Thanks for chatting! 👋 Don't forget to check out Aryan's projects and connect with him on LinkedIn!",
        "See you later! 😊 Feel free to come back anytime you want to know more about Aryan!",
        "Goodbye! 🌟 Hope I was helpful. Don't be a stranger!",
        "Catch you later! 🚀 Remember, Aryan is open to work - spread the word!",
        "Bye! 👨‍💻 Come back soon if you have more questions!"
      ];
      return getRandomElement(farewells);
    }

    // Gratitude responses
    if (intent === 'gratitude') {
      const thanks = [
        "You're welcome! 😊 Anything else you'd like to know about Aryan?",
        "Happy to help! 🌟 Got more questions? I'm all ears!",
        "No problem at all! 👍 What else can I tell you?",
        "My pleasure! 🎉 Feel free to ask me anything else!",
        "Glad I could help! 💪 What's next on your mind?"
      ];
      return getRandomElement(thanks);
    }

    // Joke responses
    if (intent === 'joke') {
      return getRandomElement(personalityResponses.jokes);
    }

    // Bot identity
    if (intent === 'bot_identity') {
      return "I'm Aryan's AI-powered portfolio assistant! 🤖 I was designed to help people learn about Aryan's skills, projects, and experience in a fun and engaging way. Think of me as his digital spokesperson - but with better jokes! 😄 I know everything about his work, from his 92% accurate facial recognition system to his 25+ certifications. What would you like to know?";
    }

    // Help responses
    if (intent === 'help') {
      return `I can help you learn about:\n\n🎯 **Skills & Technologies** - Aryan's tech stack (Python, JavaScript, React, ML, AI, etc.)\n💼 **Experience** - His internships at Airtel, Gaia, ScanPick, and more\n🚀 **Projects** - 12+ amazing projects including AI/ML and web apps\n🎓 **Education** - B.Tech in CS with AI/ML specialization\n🏆 **Certifications** - 25+ certs from Google, Oracle, Deloitte, etc.\n📧 **Contact Info** - How to reach Aryan\n🌟 **Fun Facts** - Cool achievements and interesting tidbits\n\nJust ask me anything naturally, like "What projects has Aryan built?" or "Tell me about his skills!" I can also crack jokes if you need a laugh! 😄`;
    }

    // Name and identity
    if (intent === 'name' || msg.includes('who is aryan') || msg.includes('who\'s aryan')) {
      return `${getRandomElement(personalityResponses.encouragements)} Aryan Mishra is an AI & ML specialist and Full-Stack Developer who's currently crushing his final semester of B.Tech in Computer Science with AI/ML specialization at Presidency University Bangalore! 🎓\n\nHe's not just another developer - he's built an award-winning facial recognition system with 92%+ accuracy, earned 25+ certifications, and completed internships at major companies like Airtel Digital and Gaia Smart Cities. ${getRandomElement(personalityResponses.transitions)} He's actively seeking ML, SDE, and Full-Stack roles! 🚀`;
    }

    // Skills
    if (intent === 'skills') {
      if (entities.includes('python')) {
        return `Python is one of Aryan's strongest skills at 90% proficiency! 🐍 He uses it extensively for Machine Learning, AI projects, and data science work. His Python expertise shines in projects like the facial recognition system and the 5G network simulation framework. ${getRandomElement(personalityResponses.transitions)} He's also great with TensorFlow, OpenCV, and other Python ML libraries!`;
      }
      if (entities.includes('javascript')) {
        return `JavaScript? Aryan's got that at 80% proficiency! 💻 He uses it for full-stack development, especially with React (also 80% proficiency). Check out his portfolio website - it's built with React, TypeScript, and modern web technologies. Pretty slick, right? 😎`;
      }
      if (entities.includes('react')) {
        return `React is one of Aryan's go-to frameworks at 80% proficiency! ⚛️ He's built multiple full-stack applications with React during his internship at ScanPick. This very portfolio you're looking at? Yep, React + TypeScript + Tailwind CSS. He knows his way around hooks, components, and modern React patterns! ${getRandomElement(personalityResponses.transitions)} He's also skilled in TypeScript at 80%!`;
      }
      if (entities.includes('ml') || entities.includes('ai')) {
        return `Machine Learning and AI are Aryan's specialties! 🧠 Both at 80% proficiency. He's working on his B.Tech with AI/ML specialization and has built some seriously impressive projects:\n\n• Facial recognition system (92%+ accuracy) 🎯\n• 5G Network Simulation with AI-driven optimization 📡\n• ThalaCare AI Assistant for thalassemia patients 🏥\n• Weather prediction platform with ML 🌤️\n\n${getRandomElement(personalityResponses.funFacts)}`;
      }

      // General skills response
      const topSkills = profileData.skills.sort((a, b) => b.level - a.level).slice(0, 5);
      return `${getRandomElement(personalityResponses.encouragements)} Aryan has 72+ technical skills! Here are his top ones:\n\n${topSkills.map(skill => `• ${skill.name} - ${skill.level}% proficiency`).join('\n')}\n\nHe's also skilled in:\n• Machine Learning & AI 🤖\n• Full-Stack Development 💻\n• Computer Vision (OpenCV) 👁️\n• Data Science & Analytics 📊\n• Cloud Technologies ☁️\n• IoT Development 🌐\n\nWant to know about a specific technology? Just ask! 😊`;
    }

    // Projects
    if (intent === 'projects') {
      // Check for specific project mentions
      if (msg.includes('face') || msg.includes('facial') || msg.includes('recognition') || msg.includes('missing')) {
        return `Oh, the facial recognition project! 🏆 This is one of Aryan's crown jewels!\n\nHe built an award-winning system for identifying missing persons using Aadhaar-enabled biometric details. The system achieved 92%+ accuracy and won the "Best Societal Relevant Project" award - selected from 400+ submissions! 🎯\n\nTech stack: Python, OpenCV, Raspberry Pi\n\n${getRandomElement(personalityResponses.transitions)} This project shows Aryan's commitment to using tech for social good. Pretty inspiring, right? 🌟`;
      }

      if (msg.includes('5g') || msg.includes('network') || msg.includes('simulation')) {
        return `The 5G Network Simulation Framework is seriously impressive! 📡\n\nAryan demonstrated how AI-driven adaptive resource management can achieve 300-400% throughput improvements while maintaining excellent Quality of Experience (QoE). That's like turning a regular highway into a super-highway! 🚀\n\nThis project showcases his skills in:\n• Network optimization\n• AI/ML algorithms\n• Performance engineering\n• Simulation modeling\n\nWant to know about his other projects? 😊`;
      }

      if (msg.includes('pib') || msg.includes('multilingual') || msg.includes('video')) {
        return `The PIB Multilingual Video Platform is super cool! 🎥\n\nAryan built an AI-powered platform that transforms static press releases into engaging, synchronized multilingual video content. It achieves:\n• 94% speech synthesis accuracy 🎯\n• 87% user satisfaction in multilingual content comprehension\n\nImagine taking boring text and turning it into engaging videos in multiple languages automatically. That's the power of AI! 🤖\n\nTechnologies: AI, NLP, Speech Synthesis, Video Processing`;
      }

      if (msg.includes('csv') || msg.includes('dashboard') || msg.includes('automated')) {
        return `The CSV-Automated Dashboard is a data scientist's dream! 📊\n\nAryan created a comprehensive platform that automates the entire CSV processing pipeline:\n• File upload & validation ✅\n• Data cleaning & preprocessing 🧹\n• Statistical analysis 📈\n• Machine learning predictions 🤖\n• Interactive visualizations 📊\n• Professional report generation 📄\n\nAll automated! It's like having a data science team in a single application. ${getRandomElement(personalityResponses.transitions)} This shows his full-stack + ML skills perfectly! 💪`;
      }

      if (msg.includes('thala') || msg.includes('ai assistant') || msg.includes('thalassemia')) {
        return `ThalaCare AI Assistant is a project close to the heart! ❤️\n\nAryan built an AI-powered assistant specifically for thalassemia patients, helping them manage their condition better. This is another example of his commitment to using technology for social impact.\n\nIt combines:\n• AI/ML for personalized recommendations\n• Healthcare domain knowledge\n• User-friendly interface\n• Practical medical assistance\n\nTech for good! 🌟`;
      }

      if (msg.includes('weather') || msg.includes('prediction') || msg.includes('forecast')) {
        return `The AI-Powered Weather Prediction Platform! 🌤️\n\nAryan built a machine learning system for weather forecasting. It uses historical data and ML algorithms to predict weather patterns. Perfect example of applying AI to real-world problems!\n\nThis project demonstrates:\n• Time series analysis 📈\n• ML model training & deployment 🤖\n• Data visualization 📊\n• API integration 🔌\n\nWant to know about more projects? He's got 12+ in total! 🚀`;
      }

      if (msg.includes('sql') || msg.includes('database')) {
        return `The Web-Based SQL Database Management Dashboard! 🗄️\n\nAryan built a dashboard that connects to SQL databases via hostname and credentials, displaying real-time server and database statistics with <1 second monitoring latency. That's blazing fast! ⚡\n\nFeatures:\n• Real-time monitoring 📊\n• Database statistics 📈\n• Server health metrics 💚\n• Sub-second latency ⚡\n\nPerfect for database administrators and developers! 💻`;
      }

      // General projects response
      return `${getRandomElement(personalityResponses.encouragements)} Aryan has worked on 12+ major projects! Here are some highlights:\n\n🏆 **Facial Recognition System** - 92%+ accuracy, award-winning\n📡 **5G Network Simulation** - 300-400% throughput improvement\n🎥 **PIB Multilingual Video Platform** - 94% speech accuracy\n📊 **CSV-Automated Dashboard** - Full ML pipeline automation\n🏥 **ThalaCare AI Assistant** - Healthcare AI application\n🌤️ **Weather Prediction Platform** - ML-based forecasting\n🗄️ **SQL Database Dashboard** - Real-time monitoring\n\nWant details on any specific project? Just ask! 😊\n\n${getRandomElement(personalityResponses.funFacts)}`;
    }

    // Experience
    if (intent === 'experience') {
      if (msg.includes('airtel')) {
        return `Aryan interned at Airtel Digital! 📱\n\nFrom August 2025 to October 2025, he worked as a Student Intern focusing on Data Science and Network Optimization. He gained professional development through project-based assignments at one of India's leading telecom companies.\n\n${getRandomElement(personalityResponses.transitions)} Working at Airtel gave him real-world experience in handling large-scale data and network systems! 🚀`;
      }

      if (msg.includes('gaia') || msg.includes('smart city')) {
        return `Gaia Smart City internship was awesome! 🌆\n\nFrom July 2025 to October 2025, Aryan worked as an AI-ML Intern in Mumbai, developing IoT-based smart city solutions. He contributed to live projects and gained hands-on experience in digital transformation.\n\nImagine working on the cities of tomorrow - that's what he did! He even received a Letter of Recommendation for his work. 🏆`;
      }

      if (msg.includes('scanpick')) {
        return `ScanPick was where Aryan really honed his full-stack skills! 💻\n\nFrom October 2024 to May 2025, he worked as a Full-Stack Developer in Bangalore, building responsive full-stack applications that enhanced user experience and functionality.\n\nHe received both an Offer Letter and a Letter of Recommendation for this role. ${getRandomElement(personalityResponses.transitions)} This is where he leveled up his React, JavaScript, and full-stack development skills! 🚀`;
      }

      if (msg.includes('xtelify')) {
        return `Xtelify Limited - Data Science Intern! 📊\n\nFrom August 2025 to October 2025, Aryan conducted data-driven research projects under expert mentorship, delivering insights and recommendations while gaining professional development in data science.\n\nGreat experience in research-oriented data science work! 🔬`;
      }

      if (msg.includes('capgemini')) {
        return `Capgemini - Cloud Infrastructure Associate! ☁️\n\nFrom February 2026 to May 2026, Aryan supported enterprise cloud infrastructure projects, delivering scalable and secure solutions through automation, optimization, and cross-functional collaboration.\n\nWorking at a global consulting giant like Capgemini? That's impressive! 🌟`;
      }

      if (msg.includes('sewa') || msg.includes('social')) {
        return `Subhansh Sewa Trust - Social Entrepreneurship! ❤️\n\nFrom May 2024 to June 2024, Aryan worked as a Social Work Intern in Bareilly, coordinating activities to raise funds and creating measurable social impact. He received a Letter of Recommendation (ID: RTKK08-CE001210).\n\n${getRandomElement(personalityResponses.transitions)} This shows Aryan's commitment to giving back to society! 🌟`;
      }

      // General experience response
      return `${getRandomElement(personalityResponses.encouragements)} Aryan has impressive work experience! 💼\n\n${profileData.experiences.map((exp, i) => 
        `${i + 1}. **${exp.title}** at ${exp.company}\n   📅 ${exp.period}\n   ${exp.description}\n`
      ).join('\n')}\nThat's 5 internships across different domains! ${getRandomElement(personalityResponses.transitions)} He's gained experience in AI/ML, full-stack development, data science, cloud infrastructure, and even social entrepreneurship! 🚀`;
    }

    // Education
    if (intent === 'education') {
      if (msg.includes('presidency') || msg.includes('current') || msg.includes('university')) {
        return `Aryan is currently in his final semester at Presidency University Bangalore! 🎓\n\nHe's pursuing a Bachelor of Technology (B.Tech) in Computer Science with AI/ML specialization (November 2022 - November 2026). He's acquired skills in:\n• Data Structures & Algorithms\n• Web Applications\n• TensorFlow & Machine Learning\n• MySQL & Databases\n• Video Analytics\n• Chatbot Development\n• And much more!\n\n${getRandomElement(personalityResponses.transitions)} He's about to graduate and is actively seeking opportunities! 🚀`;
      }

      if (msg.includes('school') || msg.includes('hiranandani')) {
        return `Before university, Aryan studied Computer Science at Hiranandani Foundation School Thane from March 2020 to August 2022. 🏫\n\nHe developed foundational skills in:\n• Problem Solving\n• HTML, XML, CSS, JavaScript\n• Web Technologies\n• Writing & Communication\n\nThat's where his coding journey began! 💻`;
      }

      // General education response
      return `${getRandomElement(personalityResponses.encouragements)} Here's Aryan's educational background:\n\n🎓 **Bachelor of Technology (B.Tech)**\nComputer Science with AI/ML specialization\nPresidency University, Bengaluru\nNovember 2022 - November 2026 (Final Semester)\n\n🏫 **Computer Science**\nHiranandani Foundation School Thane\nMarch 2020 - August 2022\n\n${getRandomElement(personalityResponses.transitions)} He's been coding and building projects throughout his academic journey! 💻`;
    }

    // Certificates
    if (intent === 'certificates') {
      if (msg.includes('google')) {
        return `Aryan has multiple Google certifications! 🎯\n\nIncluding:\n• Google Analytics Individual Qualification\n• Digital Marketing certifications\n• And more!\n\nYou can view his Google Analytics certification at: https://skillshop.exceedlms.com/student/award/Gpok229yrtw4oFbXdRHRH41Z\n\n${getRandomElement(personalityResponses.transitions)} Google certifications are highly valued in the industry! 🌟`;
      }

      if (msg.includes('oracle')) {
        return `Oracle Foundation Associate certification! 🏆\n\nAryan earned this prestigious certification from Oracle. You can view the credential at: https://catalog-education.oracle.com/pls/certview/sharebadge?id=054BDDF690C4EEB29C307046DE6D84E8FEECFF5B848D1920C49B708C8C17CD72\n\nOracle certifications demonstrate solid database and enterprise technology knowledge! 💪`;
      }

      if (msg.includes('deloitte')) {
        return `Deloitte Australia - Data Analytics Job Simulation! 📊\n\nAryan completed this through Forage (Credential ID: B3bS4mt3XJ8JL59y7). This certification includes:\n• Data Analytics\n• Data Modeling\n• Data Visualization Tools\n• Spreadsheet Skills\n\nDeloitte simulations are great for real-world business analytics experience! 🚀`;
      }

      if (msg.includes('linux')) {
        return `Linux Foundation certification! 🐧\n\nAryan completed "A Beginner's Guide to Linux Kernel Development (LFD103)" from The Linux Foundation (Credential ID: LF-nxwy8zzyhq).\n\nLinux skills are essential for any serious developer! 💻`;
      }

      if (msg.includes('tcs')) {
        return `TCSION Career Edge - Young Professional! 🎓\n\nAryan earned this certification (ID: 119854-24671367-1016) focusing on Data Analytics from TCS iON.\n\nTCS certifications are well-recognized in the Indian IT industry! 🇮🇳`;
      }

      // General certificates response
      return `${getRandomElement(personalityResponses.encouragements)} Aryan has earned 25+ certifications! 🏆\n\nFrom prestigious organizations including:\n• Google (Analytics, Digital Marketing)\n• Oracle (Foundation Associate)\n• Deloitte (Data Analytics)\n• The Linux Foundation\n• TCS iON\n• IBM (Design Thinking)\n• Microsoft (Power BI, Azure)\n• And many more!\n\n${getRandomElement(personalityResponses.funFacts)}\n\nWant to know about a specific certification? Just ask! 😊`;
    }

    // Contact information
    if (intent === 'contact') {
      if (msg.includes('email')) {
        return `You can reach Aryan via email at: ${profileData.contact.email} 📧\n\nFeel free to drop him a message about opportunities, collaborations, or just to say hi! He's very responsive. 😊`;
      }

      if (msg.includes('phone')) {
        return `Aryan's phone number is: ${profileData.contact.phone} 📱\n\nFeel free to give him a call! ${getRandomElement(personalityResponses.transitions)} He's based in Bengaluru, India (UTC+5:30). ⏰`;
      }

      // General contact response
      return `Here's how you can reach Aryan: 📬\n\n📧 **Email:** ${profileData.contact.email}\n📱 **Phone:** ${profileData.contact.phone}\n📍 **Location:** ${profileData.contact.location}\n\n💼 **LinkedIn:** ${profileData.contact.linkedin}\n💻 **GitHub:** ${profileData.contact.github}\n🐦 **Twitter:** ${profileData.contact.twitter}\n📘 **Facebook:** ${profileData.contact.facebook}\n\n${getRandomElement(personalityResponses.transitions)} He's very active on LinkedIn with 743+ followers! 🌟`;
    }

    // Social media
    if (intent === 'social') {
      if (msg.includes('linkedin')) {
        return `Aryan's LinkedIn is where the magic happens! 💼\n\n🔗 ${profileData.contact.linkedinLink}\n\nHe has:\n• 743+ followers 👥\n• 500+ connections 🤝\n• 38 profile views in the past 7 days 👀\n• 563 post impressions 📊\n• 18 search appearances 🔍\n\nHe's actively engaged in the tech community and posts regularly. ${getRandomElement(personalityResponses.transitions)} He's also #OPEN_TO_WORK! 🚀`;
      }

      if (msg.includes('github')) {
        return `Check out Aryan's GitHub! 💻\n\n🔗 ${profileData.contact.githubLink}\n\nYou'll find repositories of:\n• AI/ML projects 🤖\n• Web development applications 🌐\n• Data science experiments 📊\n• Open source contributions 🌟\n\nHis code is clean, well-documented, and impressive! Want to see his coding style? GitHub is the place! 😊`;
      }

      // General social response
      return `Find Aryan on social media! 🌐\n\n💼 **LinkedIn:** ${profileData.contact.linkedinLink}\n   (743+ followers, very active!)\n\n💻 **GitHub:** ${profileData.contact.githubLink}\n   (Check out his code!)\n\n🐦 **Twitter:** ${profileData.contact.twitter}\n\n📘 **Facebook:** ${profileData.contact.facebook}\n\n${getRandomElement(personalityResponses.transitions)} LinkedIn is where he's most active - connect with him there! 🤝`;
    }

    // Current status
    if (intent === 'current_status') {
      return `Right now, Aryan is: 🎯\n\n📚 In his final semester of B.Tech in Computer Science with AI/ML specialization at Presidency University Bangalore\n\n💼 Recently completed his Cloud Infrastructure Associate role at Capgemini (Feb 2026 - May 2026)\n\n🔍 Actively seeking opportunities in:\n• Machine Learning roles 🤖\n• Software Development Engineer (SDE) positions 💻\n• Full-Stack Development roles 🌐\n\n✅ Open to work and ready to start immediately after graduation!\n\n${getRandomElement(personalityResponses.transitions)} He's looking for roles where he can contribute meaningfully while leveling up his technical depth! 🚀`;
    }

    // Availability
    if (intent === 'availability') {
      return `Yes! Aryan is actively seeking opportunities! 🎯\n\nHe's open to:\n• Machine Learning roles 🤖\n• Software Development Engineer (SDE) positions 💻\n• Full-Stack Development roles 🌐\n• Data Engineering positions 📊\n\nHis LinkedIn shows #OPEN_TO_WORK and he's ready to start after his final semester (graduating November 2026).\n\n${getRandomElement(personalityResponses.transitions)} With his 72+ technical skills, 25+ certifications, and impressive project portfolio, he'd be a great addition to any team! 💪\n\nInterested in hiring? Reach out at ${profileData.contact.email}! 📧`;
    }

    // About/Summary
    if (intent === 'about') {
      if (msg.includes('short') || msg.includes('brief') || msg.includes('quick')) {
        return `${getRandomElement(personalityResponses.encouragements)} Here's the quick version:\n\nAryan Mishra is an AI & ML specialist and Full-Stack Developer in his final semester of B.Tech (CS with AI/ML). Known for his award-winning facial recognition system (92%+ accuracy) and 25+ certifications from Google, Oracle, Deloitte, etc. He's completed 5 internships including at Airtel Digital and Capgemini. Currently open to ML, SDE & Full-Stack roles! 🚀\n\nWant the detailed version? Just ask! 😊`;
      }

      return `${getRandomElement(personalityResponses.encouragements)} Let me tell you about Aryan Mishra! 🌟\n\n**Who is he?**\nAn AI & ML specialist and Full-Stack Developer currently in his final semester of B.Tech in Computer Science with AI/ML specialization at Presidency University Bangalore.\n\n**What makes him special?**\n• 🏆 Award-winning facial recognition system (92%+ accuracy, selected from 400+ submissions)\n• 📜 25+ certifications from Google, Oracle, Deloitte, Linux Foundation, and more\n• 💼 5 internships at companies like Airtel Digital, Capgemini, Gaia Smart Cities, and ScanPick\n• 🚀 12+ major projects spanning AI/ML, web development, and data science\n• 🎯 72+ technical skills including Python, JavaScript, React, ML, AI, and more\n\n**What's he looking for?**\nOpportunities in Machine Learning, Software Development, and Full-Stack roles where he can contribute meaningfully while continuing to grow.\n\n${getRandomElement(personalityResponses.funFacts)}\n\nWant to know more about any specific area? Just ask! 😊`;
    }

    // Handle specific skill level queries
    if (msg.match(/how (good|skilled|proficient)|skill level|proficiency/)) {
      const skill = profileData.skills.find(s => 
        msg.includes(s.name.toLowerCase())
      );
      if (skill) {
        return `Aryan's ${skill.name} skill level is at ${skill.level}%! ${skill.level >= 85 ? '🔥 That\'s expert level!' : skill.level >= 70 ? '💪 Pretty solid!' : '📈 And growing!'}\n\n${getRandomElement(personalityResponses.transitions)} Want to know about other skills? Just ask! 😊`;
      }
    }

    // Handle "how many" questions
    if (msg.includes('how many')) {
      if (msg.includes('project')) {
        return `Aryan has worked on 12+ major projects! 🚀 From AI/ML applications to full-stack web apps to data science platforms. Each one showcases different aspects of his skills. Want to hear about specific projects? 😊`;
      }
      if (msg.includes('certificate') || msg.includes('certification')) {
        return `Aryan has earned 25+ certifications! 🏆 From organizations like Google, Oracle, Deloitte, The Linux Foundation, IBM, Microsoft, and many more. He's basically a certification collector! 😄 Want details on specific ones?`;
      }
      if (msg.includes('skill')) {
        return `Aryan has 72+ technical skills! 💻 Ranging from programming languages (Python, JavaScript, Java, C) to frameworks (React, TensorFlow) to domains (ML, AI, Data Science, Full-Stack Dev). That's quite the arsenal! 🎯`;
      }
      if (msg.includes('internship') || msg.includes('experience') || msg.includes('job')) {
        return `Aryan has completed 5 internships! 💼\n\n1. Capgemini - Cloud Infrastructure Associate\n2. Airtel Digital - Student Intern (Data Science)\n3. Xtelify Limited - Data Science Intern\n4. Gaia Smart City - AI-ML Intern\n5. ScanPick - Full-Stack Developer\n6. Subhansh Sewa Trust - Social Entrepreneurship Intern\n\nThat's diverse experience across different domains! 🚀`;
      }
    }

    // Handle comparison questions
    if (msg.includes('best') || msg.includes('strongest') || msg.includes('top')) {
      if (msg.includes('skill')) {
        const topSkills = profileData.skills.sort((a, b) => b.level - a.level).slice(0, 3);
        return `Aryan's top skills are:\n\n${topSkills.map((s, i) => `${i + 1}. ${s.name} - ${s.level}% 🔥`).join('\n')}\n\n${getRandomElement(personalityResponses.transitions)} He's particularly strong in Python and HTML! 💪`;
      }
      if (msg.includes('project')) {
        return `Aryan's best project? That's tough! 🤔 But the facial recognition system is definitely a standout:\n\n🏆 92%+ accuracy\n🏆 Won "Best Societal Relevant Project" award\n🏆 Selected from 400+ submissions\n🏆 Uses Aadhaar-enabled biometric details\n🏆 Helps identify missing persons\n\nIt combines technical excellence with social impact. That's what makes it special! 🌟`;
      }
    }

    // Handle "why" questions
    if (msg.includes('why should') || msg.includes('why hire')) {
      return `Why hire Aryan? Great question! 🎯\n\nHere's why:\n\n1. **Proven Track Record** 🏆\n   Award-winning projects, 25+ certifications, 5 internships\n\n2. **Diverse Skill Set** 💪\n   72+ technical skills spanning AI/ML, full-stack, data science\n\n3. **Real-World Experience** 💼\n   Worked at Airtel, Capgemini, Gaia, ScanPick - knows how to deliver\n\n4. **Problem Solver** 🧠\n   Built systems that achieve 92%+ accuracy and 300-400% performance improvements\n\n5. **Fast Learner** 📚\n   Constantly upskilling - 25+ certifications speak for themselves\n\n6. **Social Impact** ❤️\n   Builds tech that matters - missing persons identification, healthcare AI\n\n7. **Team Player** 🤝\n   Multiple internships with recommendation letters\n\n${getRandomElement(personalityResponses.transitions)} He's the complete package! 🚀`;
    }

    // Handle "can he" questions
    if (msg.includes('can he') || msg.includes('can aryan')) {
      if (msg.includes('build') || msg.includes('develop') || msg.includes('create')) {
        return `Can Aryan build it? Most likely yes! 💪\n\nHe's built:\n• AI/ML systems with 92%+ accuracy 🤖\n• Full-stack web applications 🌐\n• Real-time monitoring dashboards 📊\n• IoT-based smart city solutions 🏙️\n• Multilingual video platforms 🎥\n• Network simulation frameworks 📡\n• And much more!\n\nWith 72+ technical skills and experience across multiple domains, he can tackle a wide range of projects. What specific technology or project type are you thinking about? 😊`;
      }
    }

    // Handle location questions
    if (msg.includes('where') && (msg.includes('located') || msg.includes('live') || msg.includes('based') || msg.includes('from'))) {
      return `Aryan is currently based in Bengaluru (Bangalore), Karnataka, India! 🇮🇳\n\nBengaluru is India's Silicon Valley - the perfect place for a tech enthusiast like him! The city is home to countless tech companies and startups. ${getRandomElement(personalityResponses.transitions)} He's open to relocation for the right opportunity! 🚀`;
    }

    // Handle personality/soft skills questions
    if (msg.includes('personality') || msg.includes('soft skill') || msg.includes('team') || msg.includes('leadership')) {
      return `Aryan's soft skills are just as impressive as his technical ones! 🌟\n\nHe has:\n• Public Speaking 🎤\n• Team Leadership & Team Building 👥\n• Problem Solving 🧩\n• Creativity & Innovation 💡\n• Strategic Planning 📋\n• Pressure Handling 💪\n• Community Engagement 🤝\n• Research Skills 🔬\n• Attention to Detail 🔍\n\n${getRandomElement(personalityResponses.transitions)} His NSS volunteer work and social entrepreneurship internship show his commitment to teamwork and community! ❤️`;
    }

    // Handle achievement/award questions
    if (msg.includes('achievement') || msg.includes('award') || msg.includes('recognition') || msg.includes('won')) {
      return `Aryan's achievements are impressive! 🏆\n\n**Major Awards:**\n• "Best Societal Relevant Project" for facial recognition system (top 70 out of 400 submissions)\n• Raspberry Pi certification for innovative project (top 70 out of 400)\n\n**Certifications:**\n• 25+ from Google, Oracle, Deloitte, Linux Foundation, IBM, Microsoft, etc.\n\n**Recognition:**\n• Letters of Recommendation from multiple internships\n• Featured in LinkedIn with 743+ followers\n• Award-winning projects with measurable impact\n\n${getRandomElement(personalityResponses.funFacts)}`;
    }

    // Handle fun/personal questions
    if (msg.includes('fun fact') || msg.includes('interesting') || msg.includes('cool thing')) {
      return getRandomElement(personalityResponses.funFacts);
    }

    // Handle portfolio/website questions
    if (msg.includes('portfolio') || msg.includes('website') || msg.includes('this site')) {
      return `This portfolio website you're on? Aryan built it! 💻\n\nIt's a showcase of modern web development:\n• React + TypeScript ⚛️\n• Tailwind CSS for styling 🎨\n• 3D effects and animations ✨\n• Responsive design 📱\n• Dark mode support 🌙\n• And yes, this chatbot too! 🤖\n\nYou can visit it at: https://aryan0854.github.io/\n\n${getRandomElement(personalityResponses.transitions)} Pretty slick, right? This is what he can build! 😎`;
    }

    // Handle resume/CV questions
    if (msg.includes('resume') || msg.includes('cv') || msg.includes('download')) {
      return `Want Aryan's resume? 📄\n\nYou can download his CV from the portfolio website! It has all the details about his:\n• Education 🎓\n• Experience 💼\n• Skills 💻\n• Projects 🚀\n• Certifications 🏆\n• Achievements 🌟\n\nOr you can reach out directly at ${profileData.contact.email} and he'll send it over! 📧`;
    }

    // Handle negative/uncertain responses
    if (msg.includes('don\'t know') || msg.includes('not sure') || msg.includes('maybe')) {
      return `No worries! 😊 Let me help you out. I can tell you about:\n\n• Aryan's skills and technologies 💻\n• His projects and achievements 🚀\n• Work experience and internships 💼\n• Education and certifications 🎓\n• How to contact him 📧\n• Fun facts and jokes 😄\n\nWhat sounds interesting to you? Or just ask me anything naturally! 🌟`;
    }

    // Handle compliments
    if (msg.includes('impressive') || msg.includes('amazing') || msg.includes('awesome') || msg.includes('great') || msg.includes('cool')) {
      return `Right?! 🌟 Aryan's work is pretty impressive! He's put in a lot of effort to build these projects and earn those certifications. ${getRandomElement(personalityResponses.transitions)} If you're interested in working with him or learning more, feel free to reach out at ${profileData.contact.email}! 📧\n\nWant to know more about any specific aspect? 😊`;
    }

    // Default response with suggestions
    const suggestions = [
      "I'm not quite sure about that, but I'd love to help! 🤔 Try asking me about:\n\n• Aryan's skills (e.g., 'What programming languages does he know?')\n• His projects (e.g., 'Tell me about his facial recognition project')\n• Work experience (e.g., 'Where has he worked?')\n• Certifications (e.g., 'What certifications does he have?')\n• How to contact him\n• Or ask for a joke! 😄",
      
      "Hmm, I'm not sure I understood that correctly! 🤔 But I'm here to help! You can ask me:\n\n• About specific technologies (Python, React, ML, AI, etc.)\n• About his projects and achievements\n• About his work experience\n• How to get in touch with Aryan\n• Or just say 'tell me about Aryan' for a full overview! 😊",
      
      "I might need a bit more context! 🤔 Here are some things I'm great at answering:\n\n• Technical skills and proficiency levels\n• Project details and achievements\n• Work experience and internships\n• Education and certifications\n• Contact information\n• Fun facts about Aryan\n\nWhat would you like to know? 🌟"
    ];

    return getRandomElement(suggestions);
  };

  const handleSendMessage = () => {
    if (inputValue.trim() === '') return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    // Simulate bot thinking with variable delay for more natural feel
    const thinkingTime = 800 + Math.random() * 700; // 800-1500ms
    setTimeout(() => {
      const botResponse = getBotResponse(inputValue);
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: botResponse,
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
          {/* Chat Header */}
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-3 rounded-t-lg flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
              </div>
              <img 
                src={profileData.avatar} 
                alt="Aryan Mishra" 
                className="w-8 h-8 rounded-full ml-2 border-2 border-white shadow-lg"
              />
              <div>
                <span className="font-medium block">Aryan's AI Assistant</span>
                <span className="text-xs opacity-90">🤖 Always here to help!</span>
              </div>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              className="text-white hover:text-gray-200 focus:outline-none text-2xl leading-none"
              aria-label="Close chat"
            >
              ×
            </button>
          </div>

          {/* Chat Messages */}
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
                  {message.text.split('\n').map((line, i) => {
                    // First split by URLs
                    const urlParts = line.split(/(https?:\/\/[^\s]+)/g);
                    return (
                      <div key={i} className="mb-1 last:mb-0">
                        {urlParts.map((urlPart, j) => {
                          // If it's a URL, return it as a link
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
                          
                          // If it's not a URL, check for email addresses
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
            {isLoading && (
              <div className="mb-3 text-left">
                <div className="inline-block p-3 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-tl-none shadow-md border border-gray-200 dark:border-gray-600">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Chat Input */}
          <div className="p-3 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
            <div className="flex space-x-2">
              <textarea
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask me anything about Aryan... 💬"
                className="flex-1 border border-gray-300 dark:border-gray-600 rounded-lg p-2 text-sm resize-none h-10 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white transition-all"
                rows={1}
                style={{ minHeight: '40px', maxHeight: '120px' }}
              />
              <button
                onClick={handleSendMessage}
                disabled={isLoading || !inputValue.trim()}
                className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-4 rounded-lg hover:from-indigo-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-105 active:scale-95 font-medium shadow-md"
                aria-label="Send message"
              >
                Send
              </button>
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400 mt-2 text-center">
              💡 Try: "Tell me a joke" or "What are Aryan's skills?"
            </div>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-4 rounded-full shadow-lg hover:shadow-xl hover:from-indigo-700 hover:to-purple-700 transition-all transform hover:scale-110 active:scale-95 flex items-center justify-center group relative"
          aria-label="Open chatbot"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
          <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-pulse"></span>
          <div className="absolute bottom-full mb-2 hidden group-hover:block bg-gray-900 text-white text-xs rounded py-1 px-2 whitespace-nowrap">
            Chat with Aryan's AI! 🤖
          </div>
        </button>
      )}
    </div>
  );
};

export default Chatbot;
