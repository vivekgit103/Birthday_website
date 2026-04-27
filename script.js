/* =====================================================
       BACKGROUND FLOATING HEARTS & SPARKLES
    ===================================================== */
    const floaters = document.getElementById('bgFloaters');
    const floatEmojis = ['💗','💖','✨','🌸','💕','⭐','🌷','💫','🩷','💜','🦋','🍀'];

    function spawnFloater() {
      const el = document.createElement('div');
      el.className = 'floater';
      el.textContent = floatEmojis[Math.floor(Math.random() * floatEmojis.length)];
      el.style.cssText = `
        left: ${Math.random() * 100}%;
        font-size: ${0.8 + Math.random() * 1.6}rem;
        animation-duration: ${7 + Math.random() * 9}s;
        animation-delay: ${Math.random() * 5}s;
      `;
      floaters.appendChild(el);
      // remove after animation completes to keep DOM clean
      setTimeout(() => el.remove(), 18000);
    }

    // seed initial floaters
    for (let i = 0; i < 18; i++) {
      setTimeout(spawnFloater, i * 600);
    }
    // keep adding
    setInterval(spawnFloater, 1400);


    /* =====================================================
       CUSTOM CURSOR SPARKLE
    ===================================================== */
    const cursor = document.getElementById('cursorSparkle');
    document.addEventListener('mousemove', e => {
      cursor.style.left = e.clientX + 'px';
      cursor.style.top  = e.clientY + 'px';
    });


    /* =====================================================
       CLICK — EMIT HEARTS AT POSITION
    ===================================================== */
    document.addEventListener('click', e => {
      for (let i = 0; i < 8; i++) spawnClickHeart(e.clientX, e.clientY);
    });

    function spawnClickHeart(x, y) {
      const h = document.createElement('div');
      h.textContent = ['💗','💖','💕','✨','🌸'][Math.floor(Math.random()*5)];
      const angle  = Math.random() * 360;
      const dist   = 50 + Math.random() * 80;
      const dx     = Math.cos(angle * Math.PI/180) * dist;
      const dy     = Math.sin(angle * Math.PI/180) * dist;
      h.style.cssText = `
        position:fixed;
        left:${x}px; top:${y}px;
        font-size:${1 + Math.random()}rem;
        pointer-events:none;
        z-index:9998;
        transform:translate(-50%,-50%);
        transition: transform 0.9s ease-out, opacity 0.9s ease-out;
        will-change:transform,opacity;
      `;
      document.body.appendChild(h);
      requestAnimationFrame(() => {
        h.style.transform = `translate(calc(-50% + ${dx}px), calc(-50% + ${dy}px)) scale(0)`;
        h.style.opacity = '0';
      });
      setTimeout(() => h.remove(), 950);
    }


    /* =====================================================
       CANVAS — CONFETTI & HEART BURST
    ===================================================== */
    const canvas  = document.getElementById('canvas-layer');
    const ctx     = canvas.getContext('2d');
    let particles = [];
    let animId    = null;

    function resizeCanvas() {
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const confettiColors = ['#FFB7C5','#D4BBFF','#FFCBA4','#B5D8FF','#FF9EC0','#C9A0FF','#FFE4A0'];

    function Particle(type) {
      this.type   = type; // 'confetti' | 'heart'
      this.x      = Math.random() * canvas.width;
      this.y      = -20;
      this.vx     = (Math.random() - 0.5) * 4;
      this.vy     = 2 + Math.random() * 4;
      this.rot    = Math.random() * Math.PI * 2;
      this.rotV   = (Math.random() - 0.5) * 0.2;
      this.size   = type === 'heart' ? 16 + Math.random()*14 : 8 + Math.random()*8;
      this.color  = confettiColors[Math.floor(Math.random() * confettiColors.length)];
      this.alpha  = 1;
      this.decay  = 0.006 + Math.random() * 0.006;
      this.wobble = Math.random() * Math.PI * 2;
      this.wobbleSpeed = 0.08 + Math.random() * 0.08;
    }

    Particle.prototype.update = function() {
      this.wobble += this.wobbleSpeed;
      this.x  += this.vx + Math.sin(this.wobble) * 1.2;
      this.y  += this.vy;
      this.rot += this.rotV;
      this.alpha -= this.decay;
    };

    Particle.prototype.draw = function() {
      ctx.save();
      ctx.globalAlpha = Math.max(0, this.alpha);
      ctx.translate(this.x, this.y);
      ctx.rotate(this.rot);

      if (this.type === 'heart') {
        ctx.font = `${this.size}px serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('💖', 0, 0);
      } else {
        // confetti rectangle
        ctx.fillStyle = this.color;
        ctx.fillRect(-this.size/2, -this.size/4, this.size, this.size/2);
      }
      ctx.restore();
    };

    function animateParticles() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles = particles.filter(p => p.alpha > 0);
      particles.forEach(p => { p.update(); p.draw(); });
      if (particles.length > 0) {
        animId = requestAnimationFrame(animateParticles);
      } else {
        animId = null;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    }

    function launchConfetti(count = 220) {
      for (let i = 0; i < count; i++) {
        setTimeout(() => {
          for (let j = 0; j < 3; j++) particles.push(new Particle('confetti'));
        }, i * 10);
      }
      for (let i = 0; i < 50; i++) {
        setTimeout(() => particles.push(new Particle('heart')), i * 25);
      }
      if (!animId) animateParticles();
    }


    /* =====================================================
       SURPRISE BUTTON
    ===================================================== */
    function triggerSurprise() {
      launchConfetti();
      // staggered click-hearts burst from center
      const cx = window.innerWidth  / 2;
      const cy = window.innerHeight / 2;
      for (let i = 0; i < 30; i++) {
        setTimeout(() => spawnClickHeart(cx + (Math.random()-0.5)*300, cy + (Math.random()-0.5)*200), i * 40);
      }
      // show modal after slight delay
      setTimeout(openModal, 700);
    }

    function openModal()  { document.getElementById('modalOverlay').classList.add('active'); }
    function closeModal() { document.getElementById('modalOverlay').classList.remove('active'); }

    // close modal on overlay click
    document.getElementById('modalOverlay').addEventListener('click', function(e) {
      if (e.target === this) closeModal();
    });


    /* =====================================================
       SCROLL REVEAL
    ===================================================== */
    const reveals = document.querySelectorAll('.reveal');
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
          entry.target.style.transitionDelay = (i * 0.06) + 's';
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    reveals.forEach(el => observer.observe(el));


    /* =====================================================
       SPARKLE TRAIL ON MOUSE MOVE
    ===================================================== */
    let trailTimer = 0;
    document.addEventListener('mousemove', e => {
      if (Date.now() - trailTimer < 60) return;
      trailTimer = Date.now();
      const s = document.createElement('div');
      s.textContent = ['✨','⭐','💫','🌟'][Math.floor(Math.random()*4)];
      s.style.cssText = `
        position:fixed;
        left:${e.clientX}px; top:${e.clientY}px;
        font-size:${0.7 + Math.random() * 0.8}rem;
        pointer-events:none;
        z-index:9997;
        transform:translate(-50%,-50%);
        transition:transform 0.6s ease-out, opacity 0.6s ease-out;
      `;
      document.body.appendChild(s);
      requestAnimationFrame(() => {
        s.style.transform = `translate(-50%,-50%) scale(0) translateY(-30px)`;
        s.style.opacity   = '0';
      });
      setTimeout(() => s.remove(), 650);
    });