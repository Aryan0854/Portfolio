import React, { useState, useEffect, useRef } from 'react';
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
      text: "Hello! I'm Aryan's personal assistant. Ask me anything about Aryan!",
      sender: 'bot',
      timestamp: new Date(),
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const getBotResponse = (userMessage: string): string => {
    const message = userMessage.toLowerCase();
    
    // Handle greetings
    if (message.includes('hello') || message.includes('hi') || message.includes('hey')) {
      return "Hello! I'm Aryan's personal assistant. How can I help you learn more about Aryan?";
    }
    
    // Handle name questions
    if (message.includes('name') || message.includes('who are you')) {
      return `Aryan's full name is ${profileData.name}.`;
    }
    
    // Handle title/job questions
    if (message.includes('title') || message.includes('job') || message.includes('position') || message.includes('work') || message.includes('role')) {
      return `Aryan is an ${profileData.title}.`;
    }
    
    // Handle bio questions
    if (message.includes('bio') || message.includes('about') || message.includes('tell me about')) {
      return profileData.bio;
    }
    
    // Handle contact information
    if (message.includes('contact') || message.includes('email') || message.includes('phone') || message.includes('reach')) {
      return `You can reach Aryan at:\n- Email: ${profileData.contact.email}\n- Phone: ${profileData.contact.phone}\n- Location: ${profileData.contact.location}`;
    }
    
    // Handle skills questions
    if (message.includes('skill') || message.includes('technology') || message.includes('programming')) {
      const skills = profileData.skills.map(skill => skill.name).join(', ');
      return `Aryan is skilled in: ${skills}`;
    }
    
    // Handle experience questions
    if (message.includes('experience') || message.includes('work') || message.includes('job') || message.includes('internship') || message.includes('company')) {
      let response = "Aryan has the following experience:\n";
      profileData.experiences.forEach((exp, index) => {
        response += `${index + 1}. ${exp.title} at ${exp.company} (${exp.period})\n- ${exp.description}\n`;
      });
      return response;
    }
    
    // Handle education questions
    if (message.includes('education') || message.includes('school') || message.includes('university') || message.includes('college')) {
      let response = "Aryan's education:\n";
      profileData.education.forEach((edu, index) => {
        response += `${index + 1}. ${edu.degree} at ${edu.institution} (${edu.period})\n- ${edu.description}\n`;
      });
      return response;
    }
    
    // Handle projects questions
    if (message.includes('project') || message.includes('work') || message.includes('github')) {
      let response = `Aryan has worked on ${profileData.projects.length} projects. Here are some notable ones:\n`;
      profileData.projects.slice(0, 5).forEach((proj, index) => {
        response += `${index + 1}. ${proj.title}
- ${proj.description}
- Technologies: ${proj.technologies.join(', ')}
- Live: ${proj.liveLink}
- GitHub: ${proj.githubLink}

`;
      });
      return response;
    }
    
    // Handle certificates questions
    if (message.includes('certificate') || message.includes('certification') || message.includes('achievement')) {
      return `Aryan has earned ${profileData.certificates.length} certificates and achievements. This includes certifications from Google, Oracle, Deloitte, and many other organizations.`;
    }
    
    // Handle specific certificate questions
    if (message.includes('certificate') || message.includes('certification')) {
      const googleCerts = profileData.certificates.filter(cert => cert.issuer.toLowerCase().includes('google'));
      if (googleCerts.length > 0) {
        return `Some of Aryan's Google certifications include: ${googleCerts.slice(0, 2).map(cert => cert.title).join(', ')}.`;
      }
    }
    
    // Handle social media questions
    if (message.includes('linkedin') || message.includes('github') || message.includes('social')) {
      return `You can find Aryan on:
- LinkedIn: ${profileData.contact.linkedinLink}
- GitHub: ${profileData.contact.githubLink}
- Twitter: ${profileData.contact.twitter}
- Facebook: ${profileData.contact.facebook}`;
    }
    
    // Handle specific project questions
    if (message.includes('pib') || message.includes('multilingual') || message.includes('video platform')) {
      const project = profileData.projects.find(p => p.title.toLowerCase().includes('pib') || p.title.toLowerCase().includes('multilingual'));
      if (project) {
        return `${project.title}: ${project.description}\nTechnologies: ${project.technologies.join(', ')}\nLive: ${project.liveLink}\nGitHub: ${project.githubLink}`;
      }
    }
    
    // Handle specific project questions
    if (message.includes('csv') || message.includes('automated')) {
      const project = profileData.projects.find(p => p.title.toLowerCase().includes('csv'));
      if (project) {
        return `${project.title}: ${project.description}\nTechnologies: ${project.technologies.join(', ')}\nLive: ${project.liveLink}\nGitHub: ${project.githubLink}`;
      }
    }
    
    // Handle specific project questions
    if (message.includes('5g') || message.includes('network') || message.includes('simulation')) {
      const project = profileData.projects.find(p => p.title.toLowerCase().includes('5g'));
      if (project) {
        return `${project.title}: ${project.description}\nTechnologies: ${project.technologies.join(', ')}\nLive: ${project.liveLink}\nGitHub: ${project.githubLink}`;
      }
    }
    
    // Handle specific project questions
    if (message.includes('thala') || message.includes('ai assistant') || message.includes('thalassemia')) {
      const project = profileData.projects.find(p => p.title.toLowerCase().includes('thala'));
      if (project) {
        return `${project.title}: ${project.description}\nTechnologies: ${project.technologies.join(', ')}\nLive: ${project.liveLink}\nGitHub: ${project.githubLink}`;
      }
    }
    
    // Handle specific project questions
    if (message.includes('weather') || message.includes('prediction') || message.includes('forecast')) {
      const project = profileData.projects.find(p => p.title.toLowerCase().includes('weather') || p.title.toLowerCase().includes('prediction') || p.title.toLowerCase().includes('forecast'));
      if (project) {
        return `${project.title}: ${project.description}\nTechnologies: ${project.technologies.join(', ')}\nLive: ${project.liveLink}\nGitHub: ${project.githubLink}`;
      }
    }
    
    // Handle specific skills
    if (message.includes('javascript') || message.includes('js')) {
      const skill = profileData.skills.find(s => s.name.toLowerCase().includes('javascript') || s.name.toLowerCase().includes('js'));
      if (skill) {
        return `Aryan's JavaScript skill level is at ${skill.level}%.`;
      }
    }
    
    if (message.includes('python')) {
      const skill = profileData.skills.find(s => s.name.toLowerCase().includes('python'));
      if (skill) {
        return `Aryan's Python skill level is at ${skill.level}%.`;
      }
    }
    
    if (message.includes('react')) {
      const skill = profileData.skills.find(s => s.name.toLowerCase().includes('react'));
      if (skill) {
        return `Aryan's React skill level is at ${skill.level}%.`;
      }
    }
    
    if (message.includes('machine learning') || message.includes('ml')) {
      const skill = profileData.skills.find(s => s.name.toLowerCase().includes('machine learning') || s.name.toLowerCase().includes('ml'));
      if (skill) {
        return `Aryan's Machine Learning skill level is at ${skill.level}%.`;
      }
    }
    
    if (message.includes('artificial intelligence') || message.includes('ai')) {
      const skill = profileData.skills.find(s => s.name.toLowerCase().includes('artificial intelligence') || s.name.toLowerCase().includes('ai'));
      if (skill) {
        return `Aryan's Artificial Intelligence skill level is at ${skill.level}%.`;
      }
    }
    
    // Handle current status
    if (message.includes('current') || message.includes('working') || message.includes('now') || message.includes('present')) {
      return `Aryan is currently in his final semester of B.Tech in Computer Science with AI/ML specialization at Presidency University Bangalore. He is open to ML, SDE & Full-Stack roles.`;
    }
    
    // Handle internship questions
    if (message.includes('intern') || message.includes('internship')) {
      let response = `Aryan has completed several internships:\n`;
      profileData.experiences.forEach((exp, index) => {
        if (exp.title.toLowerCase().includes('intern')) {
          response += `${index + 1}. ${exp.title} at ${exp.company} (${exp.period})\n- ${exp.description}\n\n`;
        }
      });
      return response;
    }
    
    // Handle open to work status
    if (message.includes('open to work') || message.includes('available') || message.includes('hiring')) {
      return `Yes, Aryan is currently open to work and actively seeking opportunities in Machine Learning, Software Development, and Full-Stack roles. His LinkedIn profile shows he is #OPEN_TO_WORK.`;
    }
    
    // Handle LinkedIn profile
    if (message.includes('linkedin') || message.includes('profile')) {
      return `You can find Aryan's detailed LinkedIn profile at: https://www.linkedin.com/in/aryan0854. He has 743+ followers, 500+ connections, and is actively engaged in the tech community.`;
    }
    
    // Handle certifications
    if (message.includes('certification') || message.includes('certificate') || message.includes('cert')) {
      return `Aryan has earned 25+ certifications from various institutions including Google, Oracle, Deloitte, The Linux Foundation, and many others. Notable certifications include Google Analytics, Oracle Foundation Associate, and Deloitte Data Analytics Job Simulation.`;
    }
    
    // Handle projects
    if (message.includes('face recognition') || message.includes('facial recognition') || message.includes('missing person')) {
      return `Aryan developed an award-winning facial recognition system for identifying missing persons using Aadhaar-enabled biometric details. The system achieved 92%+ accuracy and won the 'Best Societal Relevant Project' award, selected from 400+ submissions.`;
    }
    
    // Handle technical skills
    if (message.includes('technical') || message.includes('skills') || message.includes('programming')) {
      return `Aryan has 72+ technical skills including Machine Learning, Data Science, Data Modeling, Data Visualization, Full-Stack Development, React.js, OpenCV, Computer Vision, Artificial Intelligence, TensorFlow, SQL, MySQL, HTML, CSS, JavaScript, and more.`;
    }
    
    // Handle education
    if (message.includes('presidency') || message.includes('university') || message.includes('college')) {
      const education = profileData.education.find(edu => edu.institution.toLowerCase().includes('presidency'));
      if (education) {
        return `${education.degree} at ${education.institution} (${education.period}). Aryan is currently in his final semester of B.Tech in Computer Science with AI/ML specialization at Presidency University Bangalore.`;
      }
    }
    
    // Handle more specific questions
    if (message.includes('location') || message.includes('where') || message.includes('live') || message.includes('city')) {
      return `Aryan is currently located in Bengaluru, Karnataka, India.`;
    }
    
    if (message.includes('pronouns') || message.includes('he/him')) {
      return `Aryan's pronouns are He/Him.`;
    }
    
    if (message.includes('followers') || message.includes('connections')) {
      return `Aryan has 743+ followers and 500+ connections on LinkedIn.`;
    }
    
    if (message.includes('linkedin') && message.includes('views')) {
      return `Aryan's LinkedIn profile received 38 views in the past 7 days with 563 post impressions and appeared in 18 searches.`;
    }
    
    if (message.includes('portfolio') || message.includes('website')) {
      return `You can visit Aryan's portfolio website at: https://aryan0854.github.io/. It showcases his projects in AI/ML, full-stack development, and computer vision.`;
    }
    
    if (message.includes('github') || message.includes('code')) {
      return `Aryan's GitHub profile can be found at: https://github.com/Aryan0854. It contains repositories of code, AI projects, ML experiments, and web development projects.`;
    }
    
    if (message.includes('skills') && message.includes('total')) {
      return `Aryan has 72+ technical skills including Machine Learning, Data Science, Full-Stack Development, React.js, OpenCV, Computer Vision, Artificial Intelligence, TensorFlow, SQL, MySQL, HTML, CSS, JavaScript, and many more.`;
    }
    
    if (message.includes('machine learning') && message.includes('ai')) {
      return `Aryan specializes in Machine Learning and Artificial Intelligence. He is currently pursuing a B.Tech with AI/ML specialization and has worked on several ML projects including a 5G Network Simulation Framework and an AI-Powered Weather Prediction Platform.`;
    }
    
    if (message.includes('full stack') || message.includes('full-stack')) {
      return `Aryan is a Full-Stack Developer with experience in both frontend and backend technologies. He has worked on full-stack applications during his internship at ScanPick and has skills in React, JavaScript, CSS, HTML, and backend technologies.`;
    }
    
    if (message.includes('computer vision') || message.includes('opencv')) {
      return `Aryan has expertise in Computer Vision and OpenCV. His award-winning facial recognition project for identifying missing persons showcases his skills in this area, achieving 92%+ accuracy.`;
    }
    
    if (message.includes('iot') || message.includes('smart city')) {
      return `During his internship at Gaia Smart Cities, Aryan worked on IoT-based smart city solutions, developing data-driven applications and automation workflows for smart city systems.`;
    }
    
    if (message.includes('biometric') || message.includes('facial recognition') && message.includes('award')) {
      return `Aryan developed an award-winning facial recognition system for identifying missing persons using Aadhaar-enabled biometric details. It achieved 92%+ accuracy and won the 'Best Societal Relevant Project' award, selected from 400+ submissions.`;
    }
    
    if (message.includes('network optimization') || message.includes('data science')) {
      return `Aryan previously interned at Airtel Digital focusing on Data Science and Network Optimization (Aug 2025 - Oct 2025). He also interned at Xtelify Limited working on data-driven research projects.`;
    }
    
    if (message.includes('social entrepreneurship') || message.includes('social work')) {
      return `Aryan completed a Social Entrepreneurship internship with Subhansh Sewa Trust where he coordinated activities to raise funds for social impact. He received a Letter of Recommendation for this work (ID: RTKK08-CE001210).`;
    }
    
    if (message.includes('education') && message.includes('presidency')) {
      return `Aryan is pursuing a Bachelor of Technology (B.Tech) in Computer Science with AI/ML specialization at Presidency University Bangalore from November 2022 to November 2026. He is currently in his final semester. He has acquired skills in Data Structures, Web Applications, TensorFlow, MySQL, Video Analytics, Chatbot Development, and many more.`;
    }
    
    if (message.includes('education') && message.includes('school')) {
      return `Aryan studied Computer Science at Hiranandani Foundation School Thane from March 2020 to August 2022. He developed skills in Writing, Problem Solving, HTML, XML, CSS, JavaScript, and Web Technologies.`;
    }
    
    if (message.includes('5g') && message.includes('network')) {
      return `Aryan developed a 5G Network Simulation Framework that demonstrates how AI-driven adaptive resource management can achieve 300-400% throughput improvements while maintaining excellent Quality of Experience (QoE).`;
    }
    
    if (message.includes('sql') && message.includes('dashboard')) {
      return `Aryan built a Web-Based SQL Database Management Dashboard that connects SQL databases via hostname and credentials, displaying real-time server and database statistics with <1 second monitoring latency.`;
    }
    
    if (message.includes('certification') && message.includes('google')) {
      return `Aryan has earned multiple Google certifications including Google Analytics Individual Qualification and certifications in Digital Marketing. His Google Analytics certification can be viewed at: https://skillshop.exceedlms.com/student/award/Gpok229yrtw4oFbXdRHRH41Z.`;
    }
    
    if (message.includes('certification') && message.includes('oracle')) {
      return `Aryan earned the Oracle Foundation Associate certification. The credential can be viewed at: https://catalog-education.oracle.com/pls/certview/sharebadge?id=054BDDF690C4EEB29C307046DE6D84E8FEECFF5B848D1920C49B708C8C17CD72.`;
    }
    
    if (message.includes('certification') && message.includes('linux')) {
      return `Aryan completed the 'A Beginner's Guide to Linux Kernel Development (LFD103)' certification from The Linux Foundation with credential ID: LF-nxwy8zzyhq.`;
    }
    
    if (message.includes('certification') && message.includes('deloitte')) {
      return `Aryan completed the Deloitte Australia - Data Analytics Job Simulation through Forage with credential ID: B3bS4mt3XJ8JL59y7. This certification includes skills in Data Analytics, Data Modeling, Data Visualization Tools, and Spreadsheet Skills.`;
    }
    
    if (message.includes('tcs') || message.includes('tcsion')) {
      return `Aryan earned the TCSION Career Edge - Young Professional certification with credential ID: 119854-24671367-1016, focusing on Data Analytics.`;
    }
    
    if (message.includes('nss') || message.includes('volunteer')) {
      return `Aryan was involved in NSS Volunteer Activities from January 2023 to May 2025 at Presidency University Bangalore. Activities included Cancer Awareness Campaigns, Harithvam (Green India Initiative), and School Bell (Education Drive).`;
    }
    
    if (message.includes('raspberry') || message.includes('pi')) {
      return `Aryan earned the RASPBERRY-PI certification from Presidency University Bangalore for a project that was selected as one of the 'Top 70 best innovative projects' out of 400 submissions.`;
    }
    
    if (message.includes('intern') && message.includes('airtel')) {
      return `Aryan worked as a Student Intern at Airtel Digital from August 2025 to October 2025 (5 months). He worked on professional development through project-based assignments in Data Science and Network Optimization.`;
    }
    
    if (message.includes('intern') && message.includes('xtelify')) {
      return `Aryan worked as a Data Science Intern at Xtelify Limited from August 2025 to October 2025. He conducted data-driven research projects under expert mentorship, delivering insights and recommendations.`;
    }
    
    if (message.includes('intern') && message.includes('gaia')) {
      return `Aryan worked as an AI-ML Intern at Gaia Smart City, Mumbai from July 2025 to October 2025. He developed IoT-based smart city solutions and gained hands-on experience in digital transformation.`;
    }
    
    if (message.includes('intern') && message.includes('scanpick')) {
      return `Aryan worked as a Full-Stack Developer intern at ScanPick, Bangalore Karnataka from October 2024 to May 2025. He built responsive full-stack applications, enhancing user experience and functionality. He received both an Offer Letter and a Letter of Recommendation for this role.`;
    }
    
    if (message.includes('intern') && message.includes('sewa')) {
      return `Aryan worked as a Social Entrepreneurship (Social Work) Intern at Subhansh Sewa Trust, Bareilly UP from May 2024 to June 2024. He coordinated activities to raise funds, creating measurable social impact. He received a Letter of Recommendation (ID: RTKK08-CE001210) for this work.`;
    }
    
    if (message.includes('pib') && message.includes('video')) {
      return `Aryan developed the PIB Multilingual Video Platform, an AI-powered platform that transforms static press releases into engaging, synchronized multilingual video content. It achieves 94% speech synthesis accuracy and 87% user satisfaction in multilingual content comprehension.`;
    }
    
    if (message.includes('csv') && message.includes('automated')) {
      return `Aryan created the CSV-Automated Dashboard, a comprehensive data analysis platform that automates the entire CSV processing pipeline from file upload through data cleaning, statistical analysis, machine learning predictions, interactive visualizations, and professional report generation.`;
    }
    
    // Handle additional questions based on profile data
    if (message.includes('soft skills') || message.includes('non-technical skills')) {
      return `Aryan has strong soft skills including: Public Speaking, Community Engagement, Research Skills, Social Entrepreneurship, Attention to Detail, Teamwork, Team Leadership, Team Building, Pressure Handling, Creativity & Innovation, Problem Solving, and Strategic Planning.`;
    }
    
    if (message.includes('career goals') || message.includes('goals') || message.includes('aspirations')) {
      return `Aryan is seeking opportunities in Machine Learning, Artificial Intelligence, Software Development, and Data Engineering where he can contribute meaningfully while leveling up his technical depth. He thrives in environments that value innovation, experimentation, and continuous learning.`;
    }
    
    if (message.includes('search appearances') || message.includes('linkedin stats')) {
      return `Aryan's LinkedIn profile has 18 search appearances, 38 profile views in the past 7 days, and 563 post impressions.`;
    }
    
    if (message.includes('professional headline') || message.includes('headline')) {
      return `Aryan's professional headline is: 'Ex-Airtel Digital Intern - Ex-Intern at Gaia, ScanPick & Sewa Trust - AI/ML & Computer Vision - Pursuing B.Tech AI/ML - Open to ML, SDE & Full-Stack Internships'.`;
    }
    
    if (message.includes('open to work') || message.includes('status')) {
      return `Yes, Aryan is currently open to work and actively seeking opportunities in Machine Learning, Software Development, and Full-Stack roles. His LinkedIn profile shows he is #OPEN_TO_WORK.`;
    }
    
    if (message.includes('presidency') && message.includes('course')) {
      return `Aryan is pursuing a Bachelor of Technology (B.Tech) in Computer Science with AI/ML specialization at Presidency University Bangalore.`;
    }
    
    if (message.includes('hobbies') || message.includes('interests')) {
      return `Based on his activities, Aryan seems interested in technology innovation, social impact work, and community engagement. He's involved in NSS activities and has worked on projects with societal relevance.`;
    }
    
    if (message.includes('achievements') || message.includes('awards')) {
      return `Aryan has received several achievements including: Best Societal Relevant Project award for his facial recognition system (top 70 out of 400 submissions), Raspberry Pi certification for an innovative project, and various other certifications from Google, Oracle, Deloitte, and The Linux Foundation.`;
    }
    
    if (message.includes('projects') && message.includes('total')) {
      return `Aryan has worked on 12 major projects including the PIB Multilingual Video Platform, CSV-Automated Dashboard, 5G Network Simulation Framework, ThalaCare AI Assistant, and an award-winning facial recognition system for identifying missing persons.`;
    }
    
    if (message.includes('experience') && message.includes('total')) {
      return `Aryan has completed 4 internships: Student Intern at Airtel Digital (Aug 2025 - Oct 2025), Data Science Intern at Xtelify Limited, AI-ML Intern at Gaia Smart City, Full-Stack Developer at ScanPick, and Social Entrepreneurship Intern at Subhansh Sewa Trust.`;
    }
    
    if (message.includes('education') && message.includes('total')) {
      return `Aryan has education from 4 institutions: currently pursuing B.Tech at Presidency University Bangalore, studied at Hiranandani Foundation School Thane, and completed additional educational experiences through CST AI&ML Course.`;
    }
    
    if (message.includes('certifications') && message.includes('total')) {
      return `Aryan has earned 25+ certifications from various institutions including Google, Oracle, Deloitte, The Linux Foundation, TCS iON, and many others.`;
    }
    
    if (message.includes('programming') && message.includes('languages')) {
      return `Aryan is proficient in several programming languages including Python (90% proficiency), JavaScript (80% proficiency), Java (80% proficiency), C (70% proficiency), HTML (90% proficiency), and TypeScript (80% proficiency).`;
    }
    
    if (message.includes('face recognition') && message.includes('accuracy')) {
      return `Aryan's facial recognition system for identifying missing persons achieved 92%+ accuracy, making it highly effective for its intended purpose.`;
    }
    
    if (message.includes('face recognition') && message.includes('technology')) {
      return `Aryan's facial recognition project was built using Python, OpenCV, and Raspberry Pi, showcasing his skills in Computer Vision and Biometric Verification.`;
    }
    
    if (message.includes('ai') && message.includes('ml') && message.includes('focus')) {
      return `Aryan's focus in AI/ML includes Computer Vision, Machine Learning algorithms, TensorFlow, Data Science, and practical applications like his facial recognition system and 5G network optimization.`;
    }
    
    if (message.includes('web development') && message.includes('focus')) {
      return `Aryan's web development skills include both frontend and backend technologies. He's proficient in React, JavaScript, CSS, HTML, and has practical experience building responsive full-stack applications during his internship at ScanPick.`;
    }
    
    if (message.includes('data science') && message.includes('skills')) {
      return `Aryan's data science skills include Data Modeling, Data Visualization, Spreadsheet Skills, Statistical Analysis, and practical applications through projects like the CSV Automation Agent and Xtelify internship.`;
    }
    
    if (message.includes('social impact') || message.includes('community')) {
      return `Aryan has been involved in various social impact activities including NSS Volunteer Activities, Social Entrepreneurship with Subhansh Sewa Trust, and his award-winning facial recognition project for identifying missing persons.`;
    }
    
    // Handle short summary requests
    if (message.includes('short summary') || (message.includes('summary') && message.includes('short')) || message.includes('brief summary') || message.includes('quick summary')) {
      return `Aryan Mishra is an AI & ML, Full Stack Developer currently in his final semester of B.Tech in Computer Science with AI/ML specialization. Known for his award-winning facial recognition system (92%+ accuracy) and 25+ certifications. Open to ML, SDE & Full-Stack roles.`;
    }
    
    // Handle summary requests
    if (message.includes('summary') || (message.includes('about') && message.includes('overall')) || (message.includes('tell me about') && !message.includes('project') && !message.includes('experience') && !message.includes('skill') && !message.includes('certification') && !message.includes('education'))) {
      return `Aryan Mishra is an AI & ML, Full Stack Developer currently in his final semester of B.Tech in Computer Science with AI/ML specialization at Presidency University Bangalore. Aryan has 72+ technical skills and has completed 4 internships at companies like Airtel Digital, Xtelify, Gaia Smart City, and ScanPick. He's known for his award-winning facial recognition system that achieved 92%+ accuracy for identifying missing persons, selected from 400+ submissions. He has 25+ certifications from institutions like Google, Oracle, and Deloitte, and has worked on 12 major projects spanning AI/ML, web development, and data science.`;
    }
    
    // Default response
    return "I can tell you about Aryan's background, skills, experiences, projects, and contact information. What would you like to know?";
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

    // Simulate bot thinking and response
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
    }, 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 sm:bottom-6 sm:right-6">
      {isOpen ? (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-xs sm:w-80 h-96 flex flex-col border border-gray-200 dark:border-gray-700">
          {/* Chat Header */}
          <div className="bg-indigo-600 text-white p-3 rounded-t-lg flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-red-400 rounded-full"></div>
              <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
              <div className="w-3 h-3 bg-green-400 rounded-full"></div>
              <img 
                src={profileData.avatar} 
                alt="Aryan Mishra" 
                className="w-8 h-8 rounded-full ml-2 border-2 border-white"
              />
              <span className="font-medium">Aryan's Assistant</span>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              className="text-white hover:text-gray-200 focus:outline-none"
            >
              ×
            </button>
          </div>

          {/* Chat Messages */}
          <div className="flex-1 overflow-y-auto p-3 bg-gray-50 dark:bg-gray-900">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`mb-3 ${message.sender === 'user' ? 'text-right' : 'text-left'}`}
              >
                <div
                  className={`inline-block p-2 rounded-lg max-w-[85%] sm:max-w-xs ${
                    message.sender === 'user'
                      ? 'bg-indigo-500 text-white rounded-tr-none'
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-tl-none'
                  }`}
                >
                  {message.text.split('\n').map((line, i) => {
                    // First split by URLs
                    const urlParts = line.split(/(https?:\/\/[^\s]+)/g);
                    return (
                      <div key={i}>
                        {urlParts.map((urlPart, j) => {
                          // If it's a URL, return it as a link
                          if (urlPart.match(/https?:\/\/[^\s]+/)) {
                            return (
                              <a 
                                key={`${i}-${j}`} 
                                href={urlPart} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-blue-500 underline hover:text-blue-700"
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
                                      className="text-blue-500 underline hover:text-blue-700"
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
                <div className={`text-xs text-gray-500 mt-1 ${message.sender === 'user' ? 'text-right' : 'text-left'}`}>
                  {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="mb-3 text-left">
                <div className="inline-block p-2 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-tl-none">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Chat Input */}
          <div className="p-3 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
            <div className="flex">
              <textarea
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask about Aryan..."
                className="flex-1 border border-gray-300 dark:border-gray-600 rounded-l-lg p-2 text-sm resize-none h-10 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                rows={1}
                style={{ minHeight: '40px', maxHeight: '120px' }}
              />
              <button
                onClick={handleSendMessage}
                disabled={isLoading}
                className="bg-indigo-600 text-white px-4 rounded-r-lg hover:bg-indigo-700 disabled:opacity-50 transition-colors"
              >
                Send
              </button>
            </div>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-indigo-600 text-white p-4 rounded-full shadow-lg hover:bg-indigo-700 transition-all transform hover:scale-105 flex items-center justify-center"
          aria-label="Open chatbot"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
        </button>
      )}
    </div>
  );
};

export default Chatbot;