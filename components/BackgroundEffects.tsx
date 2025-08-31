import { useEffect, useRef } from 'react';

export default function BackgroundEffects() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    // Matrix rain effect
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const matrix = "ABCDEFGHIJKLMNOPQRSTUVWXYZ123456789@#$%^&*()*&^%+-/~{[|`]}";
    const matrixArray = matrix.split("");
    const fontSize = 10;
    const columns = canvas.width / fontSize;
    const drops: number[] = [];

    for (let x = 0; x < columns; x++) {
      drops[x] = 1;
    }

    function drawMatrix() {
      if (!ctx || !canvas) return;
      
      ctx.fillStyle = 'rgba(0, 0, 0, 0.04)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = '#00ff00';
      ctx.font = fontSize + 'px monospace';

      for (let i = 0; i < drops.length; i++) {
        const text = matrixArray[Math.floor(Math.random() * matrixArray.length)];
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);

        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }
    }

    const matrixInterval = setInterval(drawMatrix, 35);

    // Floating code snippets
    function createCodeSnippet() {
      const snippets = [
        'const skills = ["JavaScript", "Python"];',
        'function innovate() { return solutions; }',
        '// Building the future',
        'npm install excellence',
        'git commit -m "Another great feature"',
        'const passion = "coding";'
      ];

      const snippet = document.createElement('div');
      snippet.className = 'code-float';
      snippet.textContent = snippets[Math.floor(Math.random() * snippets.length)];
      snippet.style.left = Math.random() * 80 + 10 + '%';
      snippet.style.animationDelay = '0s';
      snippet.style.animationDuration = Math.random() * 5 + 10 + 's';

      document.body.appendChild(snippet);

      setTimeout(() => {
        snippet.remove();
      }, 15000);
    }

    const codeInterval = setInterval(createCodeSnippet, 3000);

    // Particle system
    function createParticle() {
      const particle = document.createElement('div');
      particle.className = 'particle';
      particle.style.left = Math.random() * 100 + '%';
      particle.style.width = particle.style.height = Math.random() * 4 + 2 + 'px';
      particle.style.animationDuration = (Math.random() * 3 + 3) + 's';
      particle.style.animationDelay = Math.random() * 2 + 's';

      const colors = ['#00ff00', '#00ffff', '#ff00ff', '#ffff00'];
      particle.style.background = colors[Math.floor(Math.random() * colors.length)];

      const particlesContainer = document.getElementById('particles');
      particlesContainer?.appendChild(particle);

      setTimeout(() => {
        particle.remove();
      }, 8000);
    }

    const particleInterval = setInterval(createParticle, 300);

    // Resize handler
    const handleResize = () => {
      if (canvas) {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
      }
    };

    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      clearInterval(matrixInterval);
      clearInterval(codeInterval);
      clearInterval(particleInterval);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <>
      <canvas ref={canvasRef} className="matrix-bg"></canvas>
      <div className="bg-pattern"></div>
      <div className="particles" id="particles"></div>
      
      {/* Static floating code snippets */}
      <div className="code-float" style={{ left: '10%', animationDelay: '0s' }}>
        const developer = &apos;Feril Sunu&apos;;
      </div>
      <div className="code-float" style={{ left: '30%', animationDelay: '3s' }}>
        function buildAmazingApps() {'{'}
      </div>
      <div className="code-float" style={{ left: '50%', animationDelay: '6s' }}>
        return innovation;
      </div>
      <div className="code-float" style={{ left: '70%', animationDelay: '9s' }}>
        {'}'}
      </div>
      <div className="code-float" style={{ left: '90%', animationDelay: '12s' }}>
        {'// Elite Developer'}
      </div>
    </>
  );
}