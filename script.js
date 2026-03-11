/* ===== SUMMER SCHOOL 2026 - MAIN SCRIPT ===== */
// UPDATE THIS TO YOUR DEPLOYED RENDER URL IN PRODUCTION
// 1. INITIALIZE SUPABASE
const SUPABASE_URL = 'https://rgftzhzvzrcooajosqdd.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJnZnR6aHp2enJjb29ham9zcWRkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMyMDQyMzIsImV4cCI6MjA4ODc4MDIzMn0.FA8DdUmtOTjtbShtEiLytITCgWy_5t9dtqlcEZbyPJA';
const { createClient } = supabase;
const supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);


document.addEventListener('DOMContentLoaded', () => {

  /* ---- NAVBAR SCROLL ---- */
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 50);
  });

  /* ---- HAMBURGER MENU ---- */
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');
  hamburger.addEventListener('click', () => {
    mobileMenu.classList.toggle('open');
    const spans = hamburger.querySelectorAll('span');
    mobileMenu.classList.contains('open')
      ? (spans[0].style.transform = 'rotate(45deg) translateY(7px)',
        spans[1].style.opacity = '0',
        spans[2].style.transform = 'rotate(-45deg) translateY(-7px)')
      : (spans[0].style.transform = '', spans[1].style.opacity = '', spans[2].style.transform = '');
  });
  mobileMenu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
    mobileMenu.classList.remove('open');
    hamburger.querySelectorAll('span').forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
  }));

  /* ---- COUNTDOWN TIMER ---- */
  const eventDate = new Date('2026-05-18T09:30:00');
  function updateCountdown() {
    const now = new Date();
    const diff = eventDate - now;
    if (diff <= 0) {
      document.getElementById('cd-days').textContent = '00';
      document.getElementById('cd-hours').textContent = '00';
      document.getElementById('cd-mins').textContent = '00';
      document.getElementById('cd-secs').textContent = '00';
      return;
    }
    const days = Math.floor(diff / 86400000);
    const hours = Math.floor((diff % 86400000) / 3600000);
    const mins = Math.floor((diff % 3600000) / 60000);
    const secs = Math.floor((diff % 60000) / 1000);
    document.getElementById('cd-days').textContent = String(days).padStart(2, '0');
    document.getElementById('cd-hours').textContent = String(hours).padStart(2, '0');
    document.getElementById('cd-mins').textContent = String(mins).padStart(2, '0');
    document.getElementById('cd-secs').textContent = String(secs).padStart(2, '0');
  }
  updateCountdown();
  setInterval(updateCountdown, 1000);

  /* ---- SCHEDULE TABS ---- */
  const tabBtns = document.querySelectorAll('.tab-btn');
  const tabContents = document.querySelectorAll('.tab-content');
  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const day = btn.dataset.day;
      tabBtns.forEach(b => b.classList.remove('active'));
      tabContents.forEach(c => c.classList.remove('active'));
      btn.classList.add('active');
      document.getElementById('tab-' + day).classList.add('active');
    });
  });

  /* ---- SCROLL REVEAL ---- */
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

  document.querySelectorAll('.reveal, .reveal-left, .reveal-right').forEach(el => revealObserver.observe(el));

  /* ---- PARTICLES ---- */
  const container = document.getElementById('particles');
  if (container) {
    const colors = ['#00d4ff', '#a855f7', '#6366f1', '#f472b6', '#22d3ee'];
    for (let i = 0; i < 28; i++) {
      const p = document.createElement('div');
      p.className = 'particle';
      const size = Math.random() * 4 + 2;
      p.style.cssText = `
        left: ${Math.random() * 100}%;
        width: ${size}px; height: ${size}px;
        background: ${colors[Math.floor(Math.random() * colors.length)]};
        animation-duration: ${Math.random() * 12 + 8}s;
        animation-delay: ${Math.random() * 8}s;
        opacity: ${Math.random() * 0.7 + 0.2};
        box-shadow: 0 0 ${size * 3}px currentColor;
      `;
      container.appendChild(p);
    }
  }

  /* ---- STAGGER ANIMATION FOR CARDS ---- */
  document.querySelectorAll('.highlight-card, .speaker-card, .sponsor-card').forEach((card, i) => {
    card.style.transitionDelay = `${(i % 6) * 0.08}s`;
  });

  /* ---- SMOOTH ACTIVE NAV LINKS ---- */
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-links a[href^="#"], .mobile-menu a[href^="#"]');
  const highlightNav = () => {
    let current = '';
    sections.forEach(s => {
      if (window.scrollY >= s.offsetTop - 120) current = s.id;
    });
    navLinks.forEach(a => {
      a.style.color = '';
      if (a.getAttribute('href') === '#' + current) a.style.color = 'var(--neon-blue)';
    });
  };
  window.addEventListener('scroll', highlightNav);

  /* ---- CURSOR GLOW EFFECT (desktop only) ---- */
  if (window.innerWidth > 768) {
    const glow = document.createElement('div');
    glow.style.cssText = `
      position:fixed; pointer-events:none; z-index:9999;
      width:300px; height:300px; border-radius:50%;
      background:radial-gradient(circle, rgba(99,102,241,0.06) 0%, transparent 70%);
      transform:translate(-50%,-50%); transition:left 0.15s ease, top 0.15s ease;
    `;
    document.body.appendChild(glow);
    document.addEventListener('mousemove', e => {
      glow.style.left = e.clientX + 'px';
      glow.style.top = e.clientY + 'px';
    });
  }

  /* ---- IEEE MEMBERSHIP TOGGLE ---- */
  const ieeeCheckbox = document.getElementById('regIsIEEE');
  const ieeeIdGroup = document.getElementById('ieeeIdGroup');
  const regSubmitBtn = document.getElementById('regSubmitBtn');

  if (ieeeCheckbox) {
    ieeeCheckbox.addEventListener('change', () => {
      ieeeIdGroup.style.display = ieeeCheckbox.checked ? 'block' : 'none';
      if (regSubmitBtn) {
        regSubmitBtn.textContent = 'Register Now';
      }
    });
  }

  /* ---- REGISTRATION FORM SUBMIT ---- */
  const regForm = document.getElementById('regForm');
  if (regForm) {
    regForm.addEventListener('submit', async e => {
      e.preventDefault();
      const btn = document.getElementById('regSubmitBtn');
      const originalText = btn.textContent;

      try {
        btn.textContent = 'Processing...';
        btn.disabled = true;

        const participantData = {
          name: document.getElementById('regName').value,
          email: document.getElementById('regEmail').value,
          phone: document.getElementById('regPhone').value,
          college: document.getElementById('regCollege').value,
          department: document.getElementById('regDepartment').value,
          year: document.getElementById('regYear').value,
          isieeemember: document.getElementById('regIsIEEE').checked,
          ieeeid: document.getElementById('regIsIEEE').checked ? document.getElementById('regIEEEId').value : null
        };

        if (!supabaseClient) throw new Error('Supabase not initialized properly');

        // 1. Register in Supabase
        const fee = participantData.isieeemember ? 1499 : 1999;
        const insertData = {
          name: participantData.name,
          email: participantData.email,
          phone: participantData.phone,
          college: participantData.college,
          department: participantData.department,
          year: participantData.year,
          isieeemember: participantData.isieeemember,
          ieeeid: participantData.ieeeid,
          paymentamount: fee,
          paymentstatus: false
        };

        console.log('Inserting data:', insertData);

        const { data: savedParticipant, error: regError } = await supabaseClient
          .from('participants')
          .insert([insertData])
          .select()
          .single();

        console.log('Insert result - Data:', savedParticipant);
        console.log('Insert result - Error:', regError);

        if (regError) {
          console.error('Supabase insert error details:', JSON.stringify(regError));
          if (regError.code === '23505') throw new Error('You have already registered with this email');
          throw new Error(regError.message || 'Registration failed');
        }

        // 2. Show Success Message
        btn.textContent = '✓ Registered!';
        btn.style.background = 'linear-gradient(135deg, #22d3ee, #10b981)';

        alert('Registration successful! \n\nThank you for choosing Summer School 2026. Since our automated payment gateway is currently under verification, our team will contact you shortly via email/WhatsApp to provide payment details and confirm your seat.');

        regForm.reset();
        setTimeout(() => {
          btn.textContent = 'Register Now';
          btn.style.background = '';
          btn.disabled = false;
        }, 5000);

      } catch (error) {
        alert(error.message);
        btn.textContent = 'Register Now';
        btn.disabled = false;
      }
    });
  }
});
