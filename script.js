/* ===== SUMMER SCHOOL 2026 - MAIN SCRIPT ===== */
// 1. INITIALIZE SUPABASE
const SUPABASE_URL = 'https://rgftzhzvzrcooajosqdd.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJnZnR6aHp2enJjb29ham9zcWRkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMyMDQyMzIsImV4cCI6MjA4ODc4MDIzMn0.FA8DdUmtOTjtbShtEiLytITCgWy_5t9dtqlcEZbyPJA';
const { createClient } = supabase;
const supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);


document.addEventListener('DOMContentLoaded', () => {

  /* ---- NAVBAR SCROLL ---- */
  const navbar = document.getElementById('navbar');
  let scrollTicking = false;
  window.addEventListener('scroll', () => {
    if (!scrollTicking) {
      window.requestAnimationFrame(() => {
        navbar.classList.toggle('scrolled', window.scrollY > 50);
        scrollTicking = false;
      });
      scrollTicking = true;
    }
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
    const isMobile = window.innerWidth < 768;
    const particleCount = isMobile ? 15 : 28;
    const colors = ['#00d4ff', '#a855f7', '#6366f1', '#f472b6', '#22d3ee'];
    const fragment = document.createDocumentFragment();
    
    for (let i = 0; i < particleCount; i++) {
      const p = document.createElement('div');
      p.className = 'particle';
      const size = Math.random() * (isMobile ? 3 : 4) + 2;
      const duration = Math.random() * 12 + 8;
      const delay = Math.random() * 8;
      
      p.style.width = `${size}px`;
      p.style.height = `${size}px`;
      p.style.left = `${Math.random() * 100}%`;
      p.style.background = colors[Math.floor(Math.random() * colors.length)];
      p.style.animationDuration = `${duration}s`;
      p.style.animationDelay = `${delay}s`;
      p.style.opacity = Math.random() * 0.5 + 0.2;
      // Use simpler glow for better performance
      p.style.boxShadow = `0 0 ${size * 2}px currentColor`;
      
      fragment.appendChild(p);
    }
    container.appendChild(fragment);
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
  let navTicking = false;
  window.addEventListener('scroll', () => {
    if (!navTicking) {
      window.requestAnimationFrame(() => {
        highlightNav();
        navTicking = false;
      });
      navTicking = true;
    }
  });

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
    let mouseTicking = false;
    document.addEventListener('mousemove', e => {
      if (!mouseTicking) {
        window.requestAnimationFrame(() => {
          glow.style.left = e.clientX + 'px';
          glow.style.top = e.clientY + 'px';
          mouseTicking = false;
        });
        mouseTicking = true;
      }
    });
  }

  /* ---- IEEE MEMBERSHIP TOGGLE & FEE CALCULATION ---- */
  const ieeeCheckbox = document.getElementById('regIsIEEE');
  const cisCheckbox = document.getElementById('regIsCIS');
  const ieeeIdGroup = document.getElementById('ieeeIdGroup');
  const cisGroup = document.getElementById('cisGroup');
  const displayFee = document.getElementById('displayFee');
  const priceNote = document.getElementById('priceNote');
  const regSubmitBtn = document.getElementById('regSubmitBtn');
  const promoInput = document.getElementById('regPromoCode');
  const applyPromoBtn = document.getElementById('applyPromoBtn');
  const promoMessage = document.getElementById('promoMessage');

  let activeDiscount = 0;
  let appliedPromoCode = '';

  function calculateFee() {
    let baseFee = 2700;
    let note = 'Non-IEEE Member Price';

    if (ieeeCheckbox && ieeeCheckbox.checked) {
      baseFee = 2300;
      note = 'IEEE Member Price';
      if (cisCheckbox && cisCheckbox.checked) {
        baseFee = 2200;
        note = 'CIS Society Member Price';
      }
    }

    let finalFee = baseFee;
    if (activeDiscount > 0) {
      finalFee = baseFee - activeDiscount;
      note += ` (Promo Code Applied: ₹${activeDiscount.toLocaleString()} OFF)`;
    }

    if (finalFee < 0) finalFee = 0; // Prevent negative fees

    if (displayFee) displayFee.textContent = `₹${finalFee.toLocaleString()}`;
    if (priceNote) priceNote.textContent = note;
    return finalFee;
  }

  if (ieeeCheckbox) {
    ieeeCheckbox.addEventListener('change', () => {
      const isIEEE = ieeeCheckbox.checked;
      ieeeIdGroup.style.display = isIEEE ? 'block' : 'none';
      cisGroup.style.display = isIEEE ? 'flex' : 'none';
      if (!isIEEE && cisCheckbox) cisCheckbox.checked = false;
      calculateFee();
    });
  }

  if (cisCheckbox) {
    cisCheckbox.addEventListener('change', calculateFee);
  }

  /* ---- PROMO CODE LOGIC (Secure Database Verification) ---- */
  if (applyPromoBtn) {
    applyPromoBtn.addEventListener('click', async () => {
      const code = promoInput.value.trim().toUpperCase();
      if (!code) {
        promoMessage.textContent = 'Please enter a code';
        promoMessage.style.color = '#ff4444';
        promoMessage.style.display = 'block';
        return;
      }

      try {
        applyPromoBtn.textContent = '...';
        applyPromoBtn.disabled = true;

        // Query Supabase for the promo code
        const { data, error } = await supabaseClient
          .from('promocodes')
          .select('discount_amount, is_active')
          .eq('code', code)
          .single();

        if (error || !data || !data.is_active) {
          activeDiscount = 0;
          appliedPromoCode = '';
          promoMessage.textContent = 'Invalid or expired promo code';
          promoMessage.style.color = '#ff4444';
          promoMessage.style.display = 'block';
        } else {
          activeDiscount = data.discount_amount;
          appliedPromoCode = code;
          promoMessage.textContent = `✓ Code Applied! ₹${activeDiscount.toLocaleString()} Discount`;
          promoMessage.style.color = '#10b981';
          promoMessage.style.display = 'block';
        }
        calculateFee();
      } catch (err) {
        console.error('Promo verification error:', err);
        promoMessage.textContent = 'Verification error. Try again.';
        promoMessage.style.color = '#ff4444';
        promoMessage.style.display = 'block';
      } finally {
        applyPromoBtn.textContent = 'Apply';
        applyPromoBtn.disabled = false;
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

        const fee = calculateFee();
        const participantData = {
          name: document.getElementById('regName').value,
          email: document.getElementById('regEmail').value,
          phone: document.getElementById('regPhone').value,
          college: document.getElementById('regCollege').value,
          department: document.getElementById('regDepartment').value,
          year: document.getElementById('regYear').value,
          isieeemember: ieeeCheckbox.checked,
          iscismember: cisCheckbox ? cisCheckbox.checked : false,
          ieeeid: ieeeCheckbox.checked ? document.getElementById('regIEEEId').value : null,
          promocode: appliedPromoCode || null,
          paymentamount: fee,
          paymentstatus: false
        };

        if (!supabaseClient) throw new Error('Supabase not initialized properly');

        // 1. Register in Supabase
        const { error: regError } = await supabaseClient
          .from('participants')
          .insert([participantData]);

        if (regError) {
          if (regError.code === '23505') throw new Error('You have already registered with this email');
          throw new Error(regError.message || 'Registration failed');
        }

        // 2. Store data for payment page
        sessionStorage.setItem('pendingRegistration', JSON.stringify({
          name: participantData.name,
          email: participantData.email,
          amount: fee,
          promo: appliedPromoCode
        }));

        // 3. Success Feedback & Redirect
        btn.textContent = '✓ Taking you to payment...';
        btn.style.background = 'linear-gradient(135deg, #22d3ee, #10b981)';

        setTimeout(() => {
          window.location.href = 'payment.html';
        }, 1500);

      } catch (error) {
        alert(error.message);
        btn.textContent = 'Proceed to Pay';
        btn.disabled = false;
      }
    });
  }
});
