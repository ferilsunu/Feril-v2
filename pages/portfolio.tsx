import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import Layout from '../components/Layout';
import BackgroundEffects from '../components/BackgroundEffects';
import Navigation from '../components/Navigation';

export default function Portfolio() {
  const [activeSection, setActiveSection] = useState('profile');
  const [visitedSections, setVisitedSections] = useState(new Set(['profile']));


  // Typewriter effect function with erase capability
  const typeWriter = useCallback((element: HTMLElement, text: string, speed: number = 100): Promise<void> => {
    return new Promise((resolve) => {
      element.textContent = '';
      element.style.borderRight = '2px solid var(--primary-green)';
      let i = 0;

      const timer = setInterval(() => {
        if (i < text.length) {
          element.textContent += text.charAt(i);
          i++;
        } else {
          clearInterval(timer);
          resolve();
        }
      }, speed);
    });
  }, []);

  // Erase text function
  const eraseText = useCallback((element: HTMLElement, speed: number = 50): Promise<void> => {
    return new Promise((resolve) => {
      const text = element.textContent || '';
      let i = text.length;

      const timer = setInterval(() => {
        if (i > 0) {
          element.textContent = text.substring(0, i - 1);
          i--;
        } else {
          clearInterval(timer);
          resolve();
        }
      }, speed);
    });
  }, []);

  // Terminal helper functions
  const typeCommand = useCallback((text: string, element: HTMLElement, callback: () => void) => {
    element.textContent = '';
    let charIndex = 0;

    const typeChar = () => {
      if (charIndex < text.length) {
        element.textContent += text.charAt(charIndex);
        charIndex++;
        setTimeout(typeChar, 35);
      } else {
        setTimeout(callback, 300);
      }
    };
    typeChar();
  }, []);

  const typeOutput = useCallback((text: string, element: HTMLElement, callback: () => void) => {
    element.textContent = '';
    let charIndex = 0;

    const typeChar = () => {
      if (charIndex < text.length) {
        element.textContent += text.charAt(charIndex);
        charIndex++;
        setTimeout(typeChar, 20);
      } else {
        setTimeout(callback, 300);
      }
    };
    typeChar();
  }, []);

  // Terminal animation functionality
  const showTerminalAnimation = useCallback((sectionId: string, callback: () => void) => {
    // Skip terminal animation for profile section or already visited sections
    if (sectionId === 'profile' || visitedSections.has(sectionId)) {
      callback();
      return;
    }

    const sectionData: { [key: string]: { command: string; output: string } } = {
      experience: {
        command: 'cd experience && ls -la',
        output: 'Loading professional experience data...\nScanning work history...\nAnalyzing career progression...'
      },
      education: {
        command: 'cd education && cat academic_records.txt',
        output: 'Accessing educational background...\nRetrieving academic achievements...\nCompiling degree information...'
      },
      skills: {
        command: 'cd skills && ./scan_abilities.sh',
        output: 'Scanning technical capabilities...\nAnalyzing programming languages...\nEvaluating expertise levels...'
      },
      projects: {
        command: 'cd projects && git log --oneline',
        output: 'Loading project repository...\nScanning development history...\nAnalyzing code contributions...'
      },
      certificates: {
        command: 'cd certificates && openssl verify *.pem',
        output: 'Verifying professional certifications...\nValidating credentials...\nChecking authenticity...'
      }
    };

    const data = sectionData[sectionId];
    if (!data) {
      callback();
      return;
    }

    const terminalOverlay = document.getElementById('terminalOverlay');
    const terminalWindow = document.getElementById('terminalWindow');
    const terminalCommand = document.getElementById('terminalCommand');
    const terminalOutput = document.getElementById('terminalOutput');
    const loadingFill = document.getElementById('loadingFill');
    const terminalAccess = document.getElementById('terminalAccess');

    if (!terminalOverlay || !terminalWindow || !terminalCommand || !terminalOutput || !loadingFill || !terminalAccess) {
      callback();
      return;
    }

    // Reset terminal state
    terminalCommand.textContent = '';
    terminalOutput.textContent = '';
    loadingFill.classList.remove('animate');
    terminalAccess.classList.remove('show');
    terminalWindow.classList.remove('open');

    // Show terminal overlay
    terminalOverlay.classList.add('active');

    setTimeout(() => {
      terminalWindow.classList.add('open');

      setTimeout(() => {
        // Type command
        typeCommand(data.command, terminalCommand, () => {
          // Type output
          typeOutput(data.output, terminalOutput, () => {
            // Start loading bar
            loadingFill.classList.add('animate');

            setTimeout(() => {
              // Show access granted
              terminalAccess.classList.add('show');

              setTimeout(() => {
                // Hide terminal and show section
                terminalOverlay.classList.remove('active');
                callback();
              }, 500);
            }, 1000);
          });
        });
      }, 300);
    }, 300);
  }, [typeCommand, typeOutput, visitedSections]);

  // Initialize profile animations when component mounts
  useEffect(() => {
    let animationActive = false;
    let animationCleanup: (() => void) | null = null;

    if (activeSection === 'profile') {
      const nameElement = document.querySelector('.name') as HTMLElement;
      const titleElement = document.querySelector('.title') as HTMLElement;
      const contactItems = document.querySelectorAll('.contact-item') as NodeListOf<HTMLElement>;

      if (nameElement && titleElement && !animationActive) {
        animationActive = true;

        // Show contact items first
        contactItems.forEach((item, index) => {
          const element = item as HTMLElement;
          element.style.opacity = '0';
          element.style.transform = 'translateY(20px)';

          setTimeout(() => {
            element.style.transition = 'all 0.6s ease-out';
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
          }, 500 + (index * 200));
        });

        // Start infinite typewriter immediately
        let isRunning = true;
        const runTypewriter = async () => {
          while (isRunning) {
            try {
              // Type name
              await typeWriter(nameElement, 'Feril Sunu', 120);
              if (!isRunning) break;
              await new Promise(resolve => setTimeout(resolve, 2000)); // Pause

              // Type title
              await typeWriter(titleElement, 'Software Developer', 100);
              if (!isRunning) break;
              await new Promise(resolve => setTimeout(resolve, 3000)); // Longer pause to read

              // Erase title
              await eraseText(titleElement, 50);
              if (!isRunning) break;
              await new Promise(resolve => setTimeout(resolve, 300)); // Short pause

              // Erase name
              await eraseText(nameElement, 50);
              if (!isRunning) break;
              await new Promise(resolve => setTimeout(resolve, 800)); // Pause before next cycle
            } catch (error) {
              // Handle typewriter error silently and break the loop
              break;
            }
          }
        };

        runTypewriter();
        animationCleanup = () => {
          isRunning = false;
        };
      }
    }

    return () => {
      if (animationCleanup) {
        animationCleanup();
      }
    };
  }, [activeSection, typeWriter, eraseText]);



  const handleSectionChange = useCallback((section: string) => {
    showTerminalAnimation(section, () => {
      setActiveSection(section);
      setVisitedSections(prev => new Set(prev).add(section));
    });
  }, [showTerminalAnimation]);





  return (
    <Layout>
      <BackgroundEffects />

      {/* Terminal Overlay */}
      <div className="terminal-overlay" id="terminalOverlay">
        <div className="terminal-window" id="terminalWindow">
          <div className="terminal-header">
            <span className="terminal-title">SECURE_TERMINAL_v3.7.9</span>
            <div className="terminal-buttons">
              <div className="terminal-button close"></div>
              <div className="terminal-button minimize"></div>
              <div className="terminal-button maximize"></div>
            </div>
          </div>

          <div className="command-line">
            <span className="prompt">root@feril:~$</span>
            <span className="command-text" id="terminalCommand"></span>
            <span className="terminal-cursor"></span>
          </div>

          <div className="terminal-output" id="terminalOutput"></div>

          <div className="loading-bar">
            <div className="loading-fill" id="loadingFill"></div>
          </div>

          <div className="access-granted" id="terminalAccess">
            &gt;&gt;&gt; ACCESS GRANTED &lt;&lt;&lt;
          </div>
        </div>
      </div>

      <Navigation activeSection={activeSection} onSectionChange={handleSectionChange} />

      {/* Main content */}
      <main className="main-content">
        {/* Profile section */}
        <section id="profile" className={`content-section ${activeSection === 'profile' ? 'active' : ''}`}>
          <div className="header-section">
            <div className="profile-container">
              <Image 
                src="/photo.png" 
                alt="Feril Sunu" 
                className="profile-image"
                width={200}
                height={200}
                priority
              />
              <div className="profile-info">
                <h1 className="name typewriter">Feril Sunu</h1>
                <p className="title typewriter">Software Developer</p>
                <div className="contact-grid">
                  <div className="contact-item">
                    <i className="fas fa-globe" style={{ color: 'var(--primary-green)', marginRight: '12px', width: '20px' }}></i>
                    <span className="contact-label">Website:</span>
                    <span className="contact-value">
                      <a href="https://ferilsunu.com" target="_blank" rel="noopener noreferrer">ferilsunu.com</a>
                    </span>
                  </div>
                  <div className="contact-item">
                    <i className="fas fa-envelope" style={{ color: 'var(--primary-green)', marginRight: '12px', width: '20px' }}></i>
                    <span className="contact-label">Email:</span>
                    <span className="contact-value">
                      <a href="mailto:ferilsunu@gmail.com">ferilsunu@gmail.com</a>
                    </span>
                  </div>
                  <div className="contact-item">
                    <i className="fab fa-linkedin" style={{ color: 'var(--primary-green)', marginRight: '12px', width: '20px' }}></i>
                    <span className="contact-label">LinkedIn:</span>
                    <span className="contact-value">
                      <a href="https://linkedin.com/in/ferilsunu" target="_blank" rel="noopener noreferrer">linkedin.com/in/ferilsunu</a>
                    </span>
                  </div>
                  <div className="contact-item">
                    <i className="fab fa-github" style={{ color: 'var(--primary-green)', marginRight: '12px', width: '20px' }}></i>
                    <span className="contact-label">GitHub:</span>
                    <span className="contact-value">
                      <a href="https://github.com/ferilsunu" target="_blank" rel="noopener noreferrer">github.com/ferilsunu</a>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <a href="#experience" className="next-button" onClick={(e) => { e.preventDefault(); handleSectionChange('experience'); }}>
            Next: Experience <i className="fas fa-arrow-right"></i>
          </a>
        </section>

        {/* Experience section */}
        <section id="experience" className={`content-section ${activeSection === 'experience' ? 'active' : ''}`}>
          <h2 className="section-title">
            <i className="fas fa-briefcase" style={{ marginRight: '12px' }}></i>Experience
          </h2>

          <div className="timeline">
            <div className="timeline-item">
              <div className="timeline-dot"></div>
              <div className="timeline-content">
                <div className="card-header">
                  <div>
                    <h3 className="card-title">Software Developer</h3>
                    <p className="card-subtitle">Global Money Exchange</p>
                  </div>
                  <span className="card-date">09/2023 – Present</span>
                </div>

              </div>
            </div>

            <div className="timeline-item">
              <div className="timeline-dot"></div>
              <div className="timeline-content">
                <div className="card-header">
                  <div>
                    <h3 className="card-title">Software Developer Intern</h3>
                    <p className="card-subtitle">Cranes Varsity</p>
                  </div>
                  <span className="card-date">04/2023 – 09/2023</span>
                </div>

              </div>
            </div>

            <div className="timeline-item">
              <div className="timeline-dot"></div>
              <div className="timeline-content">
                <div className="card-header">
                  <div>
                    <h3 className="card-title">FullStack Developer Intern</h3>
                    <p className="card-subtitle">Inventron Technologies</p>
                  </div>
                  <span className="card-date">11/2022 – 04/2023</span>
                </div>

              </div>
            </div>
          </div>
          <a href="#education" className="next-button" onClick={(e) => { e.preventDefault(); handleSectionChange('education'); }}>
            Next: Education <i className="fas fa-arrow-right"></i>
          </a>
        </section>

        {/* Education section */}
        <section id="education" className={`content-section ${activeSection === 'education' ? 'active' : ''}`}>
          <h2 className="section-title">
            <i className="fas fa-graduation-cap" style={{ marginRight: '12px' }}></i>Education
          </h2>

          <div className="timeline">
            <div className="timeline-item">
              <div className="timeline-dot"></div>
              <div className="timeline-content">
                <div className="card-header">
                  <div>
                    <h3 className="card-title">Master&apos;s in Computer Applications</h3>
                    <p className="card-subtitle">Sikkim Manipal University (Distance)</p>
                  </div>
                  <span className="card-date">10/2024 – 10/2026</span>
                </div>
                <div className="card-content">
                  <p>Currently pursuing advanced studies in computer applications with focus on modern software development practices and emerging technologies.</p>
                </div>
              </div>
            </div>

            <div className="timeline-item">
              <div className="timeline-dot"></div>
              <div className="timeline-content">
                <div className="card-header">
                  <div>
                    <h3 className="card-title">Bachelor Of Computer Applications</h3>
                    <p className="card-subtitle">Bangalore City University</p>
                  </div>
                  <span className="card-date">06/2021 – 08/2024</span>
                </div>
                <div className="card-content">
                  <p><strong>CGPA:</strong> 8.0 - Comprehensive study of computer science fundamentals, programming languages, and software engineering principles.</p>
                </div>
              </div>
            </div>

            <div className="timeline-item">
              <div className="timeline-dot"></div>
              <div className="timeline-content">
                <div className="card-header">
                  <div>
                    <h3 className="card-title">Senior Secondary (XII), Commerce</h3>
                    <p className="card-subtitle">Indian School Al Seeb, Oman</p>
                  </div>
                  <span className="card-date">04/2020 – 04/2021</span>
                </div>
                <div className="card-content">
                  <p><strong>Score:</strong> 86% - Strong foundation in commerce and business studies with excellent academic performance.</p>
                </div>
              </div>
            </div>
          </div>
          <a href="#skills" className="next-button" onClick={(e) => { e.preventDefault(); handleSectionChange('skills'); }}>
            Next: Skills <i className="fas fa-arrow-right"></i>
          </a>
        </section>

        {/* Skills section */}
        <section id="skills" className={`content-section ${activeSection === 'skills' ? 'active' : ''}`}>
          <h2 className="section-title">
            <i className="fas fa-code" style={{ marginRight: '12px' }}></i>Skills
          </h2>

          <div className="skills-grid">
            <div className="skill-category">
              <h3 className="skill-category-title">
                <i className="fas fa-code" style={{ marginRight: '8px' }}></i>Programming Languages
              </h3>
              <div className="skill-tags">
                <span className="skill-tag">
                  <i className="fab fa-js-square" style={{ color: '#f7df1e' }}></i>JavaScript
                </span>
                <span className="skill-tag">
                  <i className="fab fa-python" style={{ color: '#3776ab' }}></i>Python
                </span>
                <span className="skill-tag">
                  <i className="fab fa-java" style={{ color: '#ed8b00' }}></i>Java
                </span>
                <span className="skill-tag">
                  <i className="fab fa-php" style={{ color: '#777bb4' }}></i>PHP
                </span>
                <span className="skill-tag">
                  <i className="fas fa-hashtag" style={{ color: '#239120' }}></i>C#
                </span>
              </div>
            </div>

            <div className="skill-category">
              <h3 className="skill-category-title">
                <i className="fas fa-tools" style={{ marginRight: '8px' }}></i>Frontend Technologies
              </h3>
              <div className="skill-tags">
                <span className="skill-tag">
                  <i className="fab fa-react" style={{ color: '#61dafb' }}></i>React
                </span>
                <span className="skill-tag">
                  <i className="fab fa-vuejs" style={{ color: '#4fc08d' }}></i>Vue.js
                </span>
                <span className="skill-tag">
                  <i className="fab fa-angular" style={{ color: '#dd0031' }}></i>Angular
                </span>
                <span className="skill-tag">
                  <i className="fas fa-layer-group" style={{ color: '#000000' }}></i>NextJS
                </span>
                <span className="skill-tag">
                  <i className="fab fa-html5" style={{ color: '#e34f26' }}></i>HTML5
                </span>
                <span className="skill-tag">
                  <i className="fab fa-css3-alt" style={{ color: '#1572b6' }}></i>CSS3
                </span>
                <span className="skill-tag">
                  <i className="fab fa-sass" style={{ color: '#cc6699' }}></i>SASS
                </span>
                <span className="skill-tag">
                  <i className="fas fa-wind" style={{ color: '#06b6d4' }}></i>Tailwind CSS
                </span>
              </div>
            </div>

            <div className="skill-category">
              <h3 className="skill-category-title">
                <i className="fas fa-server" style={{ marginRight: '8px' }}></i>Backend Technologies
              </h3>
              <div className="skill-tags">
                <span className="skill-tag">
                  <i className="fab fa-node-js" style={{ color: '#339933' }}></i>NodeJS
                </span>
                <span className="skill-tag">
                  <i className="fas fa-server" style={{ color: '#68a063' }}></i>ExpressJS
                </span>
                <span className="skill-tag">
                  <i className="fab fa-laravel" style={{ color: '#ff2d20' }}></i>Laravel
                </span>
                <span className="skill-tag">
                  <i className="fas fa-fire" style={{ color: '#092e20' }}></i>Django
                </span>
                <span className="skill-tag">
                  <i className="fas fa-flask" style={{ color: '#000000' }}></i>Flask
                </span>
                <span className="skill-tag">
                  <i className="fas fa-leaf" style={{ color: '#6db33f' }}></i>Spring Boot
                </span>
              </div>
            </div>

            <div className="skill-category">
              <h3 className="skill-category-title">
                <i className="fas fa-database" style={{ marginRight: '8px' }}></i>Databases
              </h3>
              <div className="skill-tags">
                <span className="skill-tag">
                  <i className="fas fa-leaf" style={{ color: '#4db33d' }}></i>MongoDB
                </span>
                <span className="skill-tag">
                  <i className="fas fa-elephant" style={{ color: '#336791' }}></i>PostgreSQL
                </span>
                <span className="skill-tag">
                  <i className="fas fa-database" style={{ color: '#00758f' }}></i>MySQL
                </span>
                <span className="skill-tag">
                  <i className="fas fa-database" style={{ color: '#f80000' }}></i>Oracle 19c
                </span>
                <span className="skill-tag">
                  <i className="fas fa-fire" style={{ color: '#ffca28' }}></i>Firebase
                </span>
                <span className="skill-tag">
                  <i className="fas fa-database" style={{ color: '#cc2927' }}></i>Redis
                </span>
              </div>
            </div>

            <div className="skill-category">
              <h3 className="skill-category-title">
                <i className="fas fa-cloud" style={{ marginRight: '8px' }}></i>Cloud & DevOps
              </h3>
              <div className="skill-tags">
                <span className="skill-tag">
                  <i className="fab fa-aws" style={{ color: '#ff9900' }}></i>AWS
                </span>
                <span className="skill-tag">
                  <i className="fab fa-microsoft" style={{ color: '#0078d4' }}></i>Azure
                </span>
                <span className="skill-tag">
                  <i className="fab fa-google" style={{ color: '#4285f4' }}></i>Google Cloud
                </span>
                <span className="skill-tag">
                  <i className="fab fa-docker" style={{ color: '#2496ed' }}></i>Docker
                </span>
                <span className="skill-tag">
                  <i className="fas fa-dharmachakra" style={{ color: '#326ce5' }}></i>Kubernetes
                </span>
                <span className="skill-tag">
                  <i className="fab fa-jenkins" style={{ color: '#d33833' }}></i>Jenkins
                </span>
              </div>
            </div>

            <div className="skill-category">
              <h3 className="skill-category-title">
                <i className="fas fa-tools" style={{ marginRight: '8px' }}></i>Development Tools
              </h3>
              <div className="skill-tags">
                <span className="skill-tag">
                  <i className="fab fa-git-alt" style={{ color: '#f05032' }}></i>Git
                </span>
                <span className="skill-tag">
                  <i className="fab fa-github" style={{ color: '#181717' }}></i>GitHub
                </span>
                <span className="skill-tag">
                  <i className="fab fa-gitlab" style={{ color: '#fc6d26' }}></i>GitLab
                </span>
                <span className="skill-tag">
                  <i className="fas fa-code-branch" style={{ color: '#0052cc' }}></i>Jira
                </span>
                <span className="skill-tag">
                  <i className="fab fa-npm" style={{ color: '#cb3837' }}></i>NPM
                </span>
                <span className="skill-tag">
                  <i className="fas fa-cube" style={{ color: '#2c8ebb' }}></i>Webpack
                </span>
              </div>
            </div>

            <div className="skill-category">
              <h3 className="skill-category-title">
                <i className="fas fa-desktop" style={{ marginRight: '8px' }}></i>Operating Systems
              </h3>
              <div className="skill-tags">
                <span className="skill-tag">
                  <i className="fab fa-linux" style={{ color: '#fcc624' }}></i>Linux
                </span>
                <span className="skill-tag">
                  <i className="fab fa-windows" style={{ color: '#0078d6' }}></i>Windows
                </span>
                <span className="skill-tag">
                  <i className="fab fa-apple" style={{ color: '#000000' }}></i>macOS
                </span>
                <span className="skill-tag">
                  <i className="fab fa-ubuntu" style={{ color: '#e95420' }}></i>Ubuntu
                </span>
              </div>
            </div>

            <div className="skill-category">
              <h3 className="skill-category-title">
                <i className="fas fa-palette" style={{ marginRight: '8px' }}></i>Design & CMS
              </h3>
              <div className="skill-tags">
                <span className="skill-tag">
                  <i className="fab fa-wordpress" style={{ color: '#21759b' }}></i>WordPress
                </span>
                <span className="skill-tag">
                  <i className="fab fa-figma" style={{ color: '#f24e1e' }}></i>Figma
                </span>
                <span className="skill-tag">
                  <i className="fab fa-adobe" style={{ color: '#ff0000' }}></i>Adobe XD
                </span>
                <span className="skill-tag">
                  <i className="fas fa-paint-brush" style={{ color: '#ff6b6b' }}></i>UI/UX Design
                </span>
              </div>
            </div>

            <div className="skill-category">
              <h3 className="skill-category-title">
                <i className="fas fa-users" style={{ marginRight: '8px' }}></i>Soft Skills
              </h3>
              <div className="skill-tags">
                <span className="skill-tag">
                  <i className="fas fa-crown"></i>Leadership
                </span>
                <span className="skill-tag">
                  <i className="fas fa-handshake"></i>Team Player
                </span>
                <span className="skill-tag">
                  <i className="fas fa-brain"></i>Problem Solving
                </span>
                <span className="skill-tag">
                  <i className="fas fa-eye"></i>Attention to Detail
                </span>
                <span className="skill-tag">
                  <i className="fas fa-comments"></i>Communication
                </span>
                <span className="skill-tag">
                  <i className="fas fa-clock"></i>Time Management
                </span>
              </div>
            </div>
          </div>
          <a href="#projects" className="next-button" onClick={(e) => { e.preventDefault(); handleSectionChange('projects'); }}>
            Next: Projects <i className="fas fa-arrow-right"></i>
          </a>
        </section>

        {/* Projects section */}
        <section id="projects" className={`content-section ${activeSection === 'projects' ? 'active' : ''}`}>
          <h2 className="section-title">
            <i className="fas fa-project-diagram" style={{ marginRight: '12px' }}></i>Projects
          </h2>



          {/* Projects Grid */}
          <div className="projects-grid">
            {/* Personal Projects */}
            <div className="image-card project-item" data-category="personal web">
              <div className="image-card-image">
                <i className="fas fa-sticky-note"></i>
              </div>
              <div className="image-card-content">
                <h3 className="image-card-title">NoteX: Advanced Notes Taking App</h3>
                <p className="image-card-subtitle">Full-Stack Web Application</p>
                <div className="image-card-description">
                  <ul style={{ listStyle: 'none', padding: 0 }}>
                    <li style={{ marginBottom: '8px' }}>→ Deployed on Microsoft Azure with enhanced security features like email verification</li>
                    <li style={{ marginBottom: '8px' }}>→ Demonstrated adaptability to new technologies and frameworks</li>
                    <li style={{ marginBottom: '8px' }}>→ Built with modern web technologies for optimal performance</li>
                  </ul>
                  <a href="https://notesapp-feril.azurewebsites.net" className="project-link" target="_blank" rel="noopener noreferrer">
                    View Project →
                  </a>
                </div>
              </div>
            </div>

            <div className="image-card project-item" data-category="personal web">
              <div className="image-card-image">
                <i className="fab fa-twitter"></i>
              </div>
              <div className="image-card-content">
                <h3 className="image-card-title">Twitter Clone using NextJS</h3>
                <p className="image-card-subtitle">Social Media Platform</p>
                <div className="image-card-description">
                  <ul style={{ listStyle: 'none', padding: 0 }}>
                    <li style={{ marginBottom: '8px' }}>→ Developed a fully functional Twitter clone using NextJS and React</li>
                    <li style={{ marginBottom: '8px' }}>→ Created reusable components and utilized frontend libraries such as Tailwind</li>
                    <li style={{ marginBottom: '8px' }}>→ Optimized for performance across various devices and browsers</li>
                  </ul>
                  <a href="https://twitter-clone-feril.netlify.app" className="project-link" target="_blank" rel="noopener noreferrer">
                    View Project →
                  </a>
                </div>
              </div>
            </div>

            <div className="image-card project-item" data-category="personal web tools">
              <div className="image-card-image">
                <i className="fab fa-youtube"></i>
              </div>
              <div className="image-card-content">
                <h3 className="image-card-title">YouTube Channel Analyzer</h3>
                <p className="image-card-subtitle">Data Analytics Web Application</p>
                <div className="image-card-description">
                  <ul style={{ listStyle: 'none', padding: 0 }}>
                    <li style={{ marginBottom: '8px' }}>→ Built a website using Node.js to analyze YouTube channels using YouTube API</li>
                    <li style={{ marginBottom: '8px' }}>→ Returns key data including channel stats, video stats, and more insights</li>
                    <li style={{ marginBottom: '8px' }}>→ Streamlines analysis process for digital marketers and content creators</li>
                  </ul>
                  <a href="#" className="project-link" target="_blank" rel="noopener noreferrer">
                    View Project →
                  </a>
                </div>
              </div>
            </div>

            <div className="image-card project-item" data-category="personal web tools">
              <div className="image-card-image">
                <i className="fas fa-code"></i>
              </div>
              <div className="image-card-content">
                <h3 className="image-card-title">CodeCraft</h3>
                <p className="image-card-subtitle">Online Code Editor</p>
                <div className="image-card-description">
                  <ul style={{ listStyle: 'none', padding: 0 }}>
                    <li style={{ marginBottom: '8px' }}>→ Developed an online code editor using HTML, CSS, and JavaScript</li>
                    <li style={{ marginBottom: '8px' }}>→ Allows users to write, edit, and run code in a browser environment</li>
                    <li style={{ marginBottom: '8px' }}>→ Enhanced coding convenience for developers and learners</li>
                  </ul>
                  <a href="#" className="project-link" target="_blank" rel="noopener noreferrer">
                    View Project →
                  </a>
                </div>
              </div>
            </div>

            {/* Company Projects */}
            <div className="image-card project-item" data-category="company">
              <div className="image-card-image">
                <i className="fas fa-credit-card"></i>
              </div>
              <div className="image-card-content">
                <h3 className="image-card-title">Payment Gateway Architecture</h3>
                <p className="image-card-subtitle">Enterprise Financial System</p>
                <div className="image-card-description">
                  <ul style={{ listStyle: 'none', padding: 0 }}>
                    <li style={{ marginBottom: '8px' }}>→ Architected payment gateway and switches using Spring Boot microservices</li>
                    <li style={{ marginBottom: '8px' }}>→ Collaborated with cross-functional teams to ensure secure transaction processing</li>
                    <li style={{ marginBottom: '8px' }}>→ Implemented high-availability architecture for financial operations</li>
                  </ul>
                  <button className="project-link locked" disabled>
                    <i className="fas fa-lock"></i>Locked - Company Project
                  </button>
                </div>
              </div>
            </div>

            <div className="image-card project-item" data-category="company web">
              <div className="image-card-image">
                <i className="fas fa-users"></i>
              </div>
              <div className="image-card-content">
                <h3 className="image-card-title">Human Resource Portal</h3>
                <p className="image-card-subtitle">PHP Enterprise Portal</p>
                <div className="image-card-description">
                  <ul style={{ listStyle: 'none', padding: 0 }}>
                    <li style={{ marginBottom: '8px' }}>→ Developed comprehensive HR management portal using PHP</li>
                    <li style={{ marginBottom: '8px' }}>→ Worked collaboratively with HR team to streamline employee processes</li>
                    <li style={{ marginBottom: '8px' }}>→ Integrated employee onboarding, payroll, and performance management</li>
                  </ul>
                  <button className="project-link locked" disabled>
                    <i className="fas fa-lock"></i>Locked - Company Project
                  </button>
                </div>
              </div>
            </div>

            <div className="image-card project-item" data-category="company web">
              <div className="image-card-image">
                <i className="fas fa-shield-alt"></i>
              </div>
              <div className="image-card-content">
                <h3 className="image-card-title">Compliance Portal</h3>
                <p className="image-card-subtitle">Regulatory Management System</p>
                <div className="image-card-description">
                  <ul style={{ listStyle: 'none', padding: 0 }}>
                    <li style={{ marginBottom: '8px' }}>→ Built compliance management portal for regulatory requirements</li>
                    <li style={{ marginBottom: '8px' }}>→ Collaborated with compliance team to automate reporting processes</li>
                    <li style={{ marginBottom: '8px' }}>→ Ensured adherence to financial industry regulations and standards</li>
                  </ul>
                  <button className="project-link locked" disabled>
                    <i className="fas fa-lock"></i>Locked - Company Project
                  </button>
                </div>
              </div>
            </div>

            <div className="image-card project-item" data-category="company web">
              <div className="image-card-image">
                <i className="fas fa-exchange-alt"></i>
              </div>
              <div className="image-card-content">
                <h3 className="image-card-title">CRF Change Request Portal</h3>
                <p className="image-card-subtitle">Change Management System</p>
                <div className="image-card-description">
                  <ul style={{ listStyle: 'none', padding: 0 }}>
                    <li style={{ marginBottom: '8px' }}>→ Developed change request management portal for operational efficiency</li>
                    <li style={{ marginBottom: '8px' }}>→ Worked with operations team to streamline change approval workflows</li>
                    <li style={{ marginBottom: '8px' }}>→ Implemented automated notifications and approval tracking system</li>
                  </ul>
                  <button className="project-link locked" disabled>
                    <i className="fas fa-lock"></i>Locked - Company Project
                  </button>
                </div>
              </div>
            </div>

            <div className="image-card project-item" data-category="company web">
              <div className="image-card-image">
                <i className="fas fa-globe"></i>
              </div>
              <div className="image-card-content">
                <h3 className="image-card-title">Global Website Repolish</h3>
                <p className="image-card-subtitle">Corporate Website Enhancement</p>
                <div className="image-card-description">
                  <ul style={{ listStyle: 'none', padding: 0 }}>
                    <li style={{ marginBottom: '8px' }}>→ Led team effort to redesign and enhance the global corporate website</li>
                    <li style={{ marginBottom: '8px' }}>→ Collaborated with marketing and design teams for brand consistency</li>
                    <li style={{ marginBottom: '8px' }}>→ Improved user experience and mobile responsiveness</li>
                  </ul>
                  <button className="project-link locked" disabled>
                    <i className="fas fa-lock"></i>Locked - Company Project
                  </button>
                </div>
              </div>
            </div>

            <div className="image-card project-item" data-category="company tools">
              <div className="image-card-image">
                <i className="fas fa-mobile-alt"></i>
              </div>
              <div className="image-card-content">
                <h3 className="image-card-title">Mobile Automation Framework</h3>
                <p className="image-card-subtitle">Testing Automation Solution</p>
                <div className="image-card-description">
                  <ul style={{ listStyle: 'none', padding: 0 }}>
                    <li style={{ marginBottom: '8px' }}>→ Created comprehensive mobile automation framework for GlobalPay app testing</li>
                    <li style={{ marginBottom: '8px' }}>→ Collaborated with QA team to streamline mobile testing processes</li>
                    <li style={{ marginBottom: '8px' }}>→ Reduced manual testing time by 70% through automated test suites</li>
                  </ul>
                  <button className="project-link locked" disabled>
                    <i className="fas fa-lock"></i>Locked - Company Project
                  </button>
                </div>
              </div>
            </div>

            <div className="image-card project-item" data-category="company">
              <div className="image-card-image">
                <i className="fas fa-server"></i>
              </div>
              <div className="image-card-content">
                <h3 className="image-card-title">Website Migration & Server Setup</h3>
                <p className="image-card-subtitle">Infrastructure Management</p>
                <div className="image-card-description">
                  <ul style={{ listStyle: 'none', padding: 0 }}>
                    <li style={{ marginBottom: '8px' }}>→ Led website migration project with zero downtime deployment</li>
                    <li style={{ marginBottom: '8px' }}>→ Worked with infrastructure team to optimize server configurations</li>
                    <li style={{ marginBottom: '8px' }}>→ Implemented load balancing and disaster recovery solutions</li>
                  </ul>
                  <button className="project-link locked" disabled>
                    <i className="fas fa-lock"></i>Locked - Company Project
                  </button>
                </div>
              </div>
            </div>

            <div className="image-card project-item" data-category="company tools">
              <div className="image-card-image">
                <i className="fas fa-robot"></i>
              </div>
              <div className="image-card-content">
                <h3 className="image-card-title">Cybersecurity Assessment Automation</h3>
                <p className="image-card-subtitle">Security Automation Portal</p>
                <div className="image-card-description">
                  <ul style={{ listStyle: 'none', padding: 0 }}>
                    <li style={{ marginBottom: '8px' }}>→ Automated cybersecurity team assessments through intelligent portal</li>
                    <li style={{ marginBottom: '8px' }}>→ Collaborated with security team to identify automation opportunities</li>
                    <li style={{ marginBottom: '8px' }}>→ Reduced manual assessment time from days to hours</li>
                  </ul>
                  <button className="project-link locked" disabled>
                    <i className="fas fa-lock"></i>Locked - Company Project
                  </button>
                </div>
              </div>
            </div>

            <div className="image-card project-item" data-category="company web">
              <div className="image-card-image">
                <i className="fas fa-chart-line"></i>
              </div>
              <div className="image-card-content">
                <h3 className="image-card-title">Real-time Trading Dashboard</h3>
                <p className="image-card-subtitle">Financial Analytics Platform</p>
                <div className="image-card-description">
                  <ul style={{ listStyle: 'none', padding: 0 }}>
                    <li style={{ marginBottom: '8px' }}>→ Developed real-time trading dashboard for currency exchange monitoring</li>
                    <li style={{ marginBottom: '8px' }}>→ Worked with trading team to implement live market data integration</li>
                    <li style={{ marginBottom: '8px' }}>→ Created customizable alerts and risk management indicators</li>
                  </ul>
                  <button className="project-link locked" disabled>
                    <i className="fas fa-lock"></i>Locked - Company Project
                  </button>
                </div>
              </div>
            </div>

            <div className="image-card project-item" data-category="company">
              <div className="image-card-image">
                <i className="fas fa-database"></i>
              </div>
              <div className="image-card-content">
                <h3 className="image-card-title">Transaction Processing Engine</h3>
                <p className="image-card-subtitle">High-Performance Backend System</p>
                <div className="image-card-description">
                  <ul style={{ listStyle: 'none', padding: 0 }}>
                    <li style={{ marginBottom: '8px' }}>→ Built high-throughput transaction processing engine for currency exchanges</li>
                    <li style={{ marginBottom: '8px' }}>→ Collaborated with backend team to optimize database performance</li>
                    <li style={{ marginBottom: '8px' }}>→ Implemented distributed caching and queue management systems</li>
                  </ul>
                  <button className="project-link locked" disabled>
                    <i className="fas fa-lock"></i>Locked - Company Project
                  </button>
                </div>
              </div>
            </div>
          </div>
          <a href="#certificates" className="next-button" onClick={(e) => { e.preventDefault(); handleSectionChange('certificates'); }}>
            Next: Certificates <i className="fas fa-arrow-right"></i>
          </a>
        </section>

        {/* Certificates section */}
        <section id="certificates" className={`content-section ${activeSection === 'certificates' ? 'active' : ''}`}>
          <h2 className="section-title">
            <i className="fas fa-certificate" style={{ marginRight: '12px' }}></i>Certificates
          </h2>

          <div className="cert-grid">
            <div className="image-card">
              <div className="image-card-image">
                <Image 
                  src="/certificates/oracle.png" 
                  alt="Oracle Cloud Infrastructure 2025 Developer Certificate" 
                  fill
                  style={{ objectFit: 'cover' }}
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
              <div className="image-card-content">
                <h3 className="image-card-title">Oracle Cloud Infrastructure 2025 Developer</h3>
                <p className="image-card-subtitle">Oracle Certification</p>
                <p className="image-card-description">Professional certification demonstrating expertise in developing applications on Oracle Cloud Infrastructure, including cloud-native development, microservices, and OCI services integration.</p>
                <a href="/certificates/Oracle Cloud Infrastructure 2025 Developer.pdf" target="_blank" rel="noopener noreferrer" className="project-link">
                  <i className="fas fa-external-link-alt"></i>View Certificate
                </a>
              </div>
            </div>

            <div className="image-card">
              <div className="image-card-image">
                <Image 
                  src="/certificates/oracle.png" 
                  alt="Oracle Cloud Infrastructure 2025 Certified Foundations Associate Certificate" 
                  fill
                  style={{ objectFit: 'cover' }}
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
              <div className="image-card-content">
                <h3 className="image-card-title">Oracle Cloud Infrastructure 2025 Certified Foundations Associate</h3>
                <p className="image-card-subtitle">Oracle Certification</p>
                <p className="image-card-description">Foundational certification covering Oracle Cloud Infrastructure core services, architecture, security, pricing, and support models for cloud computing solutions.</p>
                <a href="/certificates/Oracle Cloud Infrastructure 2025 Certified Foundations Associate.pdf" target="_blank" rel="noopener noreferrer" className="project-link">
                  <i className="fas fa-external-link-alt"></i>View Certificate
                </a>
              </div>
            </div>

            <div className="image-card">
              <div className="image-card-image">
                <Image 
                  src="/certificates/oracle.png" 
                  alt="Oracle Data Platform 2025 Foundations Associate Certificate" 
                  fill
                  style={{ objectFit: 'cover' }}
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
              <div className="image-card-content">
                <h3 className="image-card-title">Oracle Data Platform 2025 Foundations Associate</h3>
                <p className="image-card-subtitle">Oracle Certification</p>
                <p className="image-card-description">Comprehensive certification covering Oracle&apos;s data platform services, data management, analytics, ~machine learning, and data integration solutions on Oracle Cloud.</p>
                <a href="/certificates/Oracle Data Platform 2025 Foundations Associatee Certificate.pdf" target="_blank" rel="noopener noreferrer" className="project-link">
                  <i className="fas fa-external-link-alt"></i>View Certificate
                </a>
              </div>
            </div>

            <div className="image-card">
              <div className="image-card-image">
                <Image 
                  src="/certificates/oracle.png" 
                  alt="Oracle Certified AI Foundation Associate Certificate" 
                  fill
                  style={{ objectFit: 'cover' }}
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
              <div className="image-card-content">
                <h3 className="image-card-title">Oracle Certified AI Foundation Associate</h3>
                <p className="image-card-subtitle">Oracle Certification</p>
                <p className="image-card-description">Advanced certification demonstrating knowledge of artificial intelligence fundamentals, machine learning concepts, and AI implementation using Oracle&apos;s AI and ML services.</p>
                <a href="/certificates/Oracle Certified AI Foundation Associate.pdf" target="_blank" rel="noopener noreferrer" className="project-link">
                  <i className="fas fa-external-link-alt"></i>View Certificate
                </a>
              </div>
            </div>

            <div className="image-card">
              <div className="image-card-image">
                <Image 
                  src="/certificates/IBM.webp" 
                  alt="IBM Full Stack Software Developer Certificate" 
                  fill
                  style={{ objectFit: 'cover' }}
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
              <div className="image-card-content">
                <h3 className="image-card-title">IBM Full Stack Software Developer</h3>
                <p className="image-card-subtitle">Professional Certificate</p>
                <p className="image-card-description">Comprehensive certification covering full-stack development technologies including front-end frameworks, back-end development, databases, and cloud deployment.</p>
                <a href="/certificates/IBM CERTIFICATE.pdf" target="_blank" rel="noopener noreferrer" className="project-link">
                  <i className="fas fa-external-link-alt"></i>View Certificate
                </a>
              </div>
            </div>

            <div className="image-card">
              <div className="image-card-image">
                <Image 
                  src="/certificates/DELOITTE.webp" 
                  alt="Deloitte Developer Job Simulation Certificate" 
                  fill
                  style={{ objectFit: 'cover' }}
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
              <div className="image-card-content">
                <h3 className="image-card-title">Deloitte Developer Job Simulation</h3>
                <p className="image-card-subtitle">Professional Simulation</p>
                <p className="image-card-description">Completed comprehensive developer job simulation covering real-world software development scenarios, problem-solving, and industry best practices.</p>
                <a href="/certificates/deloitte certificate.pdf" target="_blank" rel="noopener noreferrer" className="project-link">
                  <i className="fas fa-external-link-alt"></i>View Certificate
                </a>
              </div>
            </div>

            <div className="image-card">
              <div className="image-card-image">
                <Image 
                  src="/certificates/ACCENTURE.webp" 
                  alt="Accenture Developer Job Simulation Certificate" 
                  fill
                  style={{ objectFit: 'cover' }}
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
              <div className="image-card-content">
                <h3 className="image-card-title">Accenture Developer Job Simulation</h3>
                <p className="image-card-subtitle">Professional Simulation</p>
                <p className="image-card-description">Successfully completed Accenture&apos;s developer job simulation program, demonstrating proficiency in enterprise-level development practices and consulting methodologies.</p>
                <a href="/certificates/accenture certificate.pdf" target="_blank" rel="noopener noreferrer" className="project-link">
                  <i className="fas fa-external-link-alt"></i>View Certificate
                </a>
              </div>
            </div>

            <div className="image-card">
              <div className="image-card-image">
                <Image 
                  src="/certificates/GOLDMANSACHS.webp" 
                  alt="Goldman Sachs Job Simulation Certificate" 
                  fill
                  style={{ objectFit: 'cover' }}
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
              <div className="image-card-content">
                <h3 className="image-card-title">Goldman Sachs Job Simulation</h3>
                <p className="image-card-subtitle">Financial Technology Simulation</p>
                <p className="image-card-description">Completed Goldman Sachs job simulation focusing on financial technology solutions, algorithmic trading systems, and quantitative development practices in investment banking.</p>
                <a href="/certificates/GoldmanSachs.pdf" target="_blank" rel="noopener noreferrer" className="project-link">
                  <i className="fas fa-external-link-alt"></i>View Certificate
                </a>
              </div>
            </div>

            <div className="image-card">
              <div className="image-card-image">
                <Image 
                  src="/certificates/UDEMY.webp" 
                  alt="Angular Frontend Bootcamp Certificate" 
                  fill
                  style={{ objectFit: 'cover' }}
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
              <div className="image-card-content">
                <h3 className="image-card-title">Angular Frontend Bootcamp</h3>
                <p className="image-card-subtitle">Udemy Certification</p>
                <p className="image-card-description">Comprehensive Angular frontend development bootcamp covering components, services, routing, forms, HTTP client, and modern Angular best practices for building scalable web applications.</p>
                <a href="/certificates/Angular.pdf" target="_blank" rel="noopener noreferrer" className="project-link">
                  <i className="fas fa-external-link-alt"></i>View Certificate
                </a>
              </div>
            </div>

            <div className="image-card">
              <div className="image-card-image">
                <Image 
                  src="/certificates/UDEMY.webp" 
                  alt="Angular Frontend Bootcamp Certificate" 
                  fill
                  style={{ objectFit: 'cover' }}
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
              <div className="image-card-content">
                <h3 className="image-card-title">PHP Development Certificate</h3>
                <p className="image-card-subtitle">Programming Certification</p>
                <p className="image-card-description">Comprehensive PHP programming certification covering server-side development, database integration, web application development, and modern PHP frameworks and best practices.</p>
                <a href="/certificates/PHP CERTIFICATE.pdf" target="_blank" rel="noopener noreferrer" className="project-link">
                  <i className="fas fa-external-link-alt"></i>View Certificate
                </a>
              </div>
            </div>

            <div className="image-card">
              <div className="image-card-image">
                <i className="fab fa-python" style={{ fontSize: '3rem', color: '#3776ab' }}></i>
              </div>
              <div className="image-card-content">
                <h3 className="image-card-title">Python Programming Certificate</h3>
                <p className="image-card-subtitle">Programming Certification</p>
                <p className="image-card-description">Advanced Python programming certification covering data structures, algorithms, web development, data analysis, and modern Python frameworks for versatile application development.</p>
                <a href="/certificates/Python Certificate-1.pdf" target="_blank" rel="noopener noreferrer" className="project-link">
                  <i className="fas fa-external-link-alt"></i>View Certificate
                </a>
              </div>
            </div>

            <div className="image-card">
              <div className="image-card-image">
                <i className="fab fa-html5" style={{ fontSize: '2.5rem', color: '#e34f26', marginRight: '10px' }}></i>
                <i className="fab fa-css3-alt" style={{ fontSize: '2.5rem', color: '#1572b6' }}></i>
              </div>
              <div className="image-card-content">
                <h3 className="image-card-title">HTML & CSS Certificate</h3>
                <p className="image-card-subtitle">Web Development Certification</p>
                <p className="image-card-description">Comprehensive web development certification covering HTML5 markup, CSS3 styling, responsive design, modern layout techniques, and frontend development best practices.</p>
                <a href="/certificates/html&css certificate.pdf" target="_blank" rel="noopener noreferrer" className="project-link">
                  <i className="fas fa-external-link-alt"></i>View Certificate
                </a>
              </div>
            </div>
          </div>
          <a href="#profile" className="next-button" onClick={(e) => { e.preventDefault(); handleSectionChange('profile'); }}>
            Back to Profile <i className="fas fa-arrow-left"></i>
          </a>
        </section>
      </main>

    </Layout>
  );
}