/* ===== SUMMER SCHOOL 2026 - MAIN SCRIPT ===== */
// UPDATE THIS TO YOUR DEPLOYED RENDER URL IN PRODUCTION
const API_BASE_URL = 'http://localhost:5000';

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
        regSubmitBtn.textContent = ieeeCheckbox.checked ? 'Proceed to Pay ₹1,499' : 'Proceed to Pay ₹1,999';
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
          isIEEEMember: document.getElementById('regIsIEEE').checked,
          ieeeId: document.getElementById('regIsIEEE').checked ? document.getElementById('regIEEEId').value : null
        };

        // 1. Register temporarily
        const regRes = await fetch(`${API_BASE_URL}/api/register`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(participantData)
        });
        const regData = await regRes.json();
        if (!regData.success) throw new Error(regData.message || 'Registration failed');

        const participantId = regData.participantId;

        // 2. Create Razorpay Order
        const orderRes = await fetch(`${API_BASE_URL}/api/create-order`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ participantId })
        });
        const orderData = await orderRes.json();
        if (!orderData.success) throw new Error(orderData.message || 'Failed to create payment order');

        // 3. Initialize Razorpay Checkout
        const options = {
          key: orderData.key_id,
          amount: orderData.order.amount,
          currency: orderData.order.currency,
          name: 'Summer School 2026',
          description: 'Event Registration Fee',
          order_id: orderData.order.id,
          handler: async function (response) {
            try {
              btn.textContent = 'Verifying Payment...';

              // 4. Verify Payment & Confirm
              const verifyRes = await fetch(`${API_BASE_URL}/api/verify-payment`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_signature: response.razorpay_signature,
                  participantId: participantId
                })
              });
              const verifyData = await verifyRes.json();

              if (verifyData.success) {
                btn.textContent = '✓ Registered & Paid!';
                btn.style.background = 'linear-gradient(135deg, #22d3ee, #10b981)';
                alert('Registration and payment successful! Confirmation email with QR sent.');
                regForm.reset();
                setTimeout(() => {
                  btn.textContent = originalText;
                  btn.style.background = '';
                  btn.disabled = false;
                }, 4000);
              } else {
                throw new Error(verifyData.message || 'Payment verification failed');
              }
            } catch (err) {
              alert(err.message);
              btn.textContent = originalText;
              btn.disabled = false;
            }
          },
          prefill: {
            name: participantData.name,
            email: participantData.email,
            contact: participantData.phone
          },
          theme: {
            color: '#6366f1'
          }
        };

        const rzp = new window.Razorpay(options);
        rzp.on('payment.failed', function (response) {
          alert("Payment failed: " + response.error.description);
          btn.textContent = originalText;
          btn.disabled = false;
        });
        rzp.open();

      } catch (error) {
        alert(error.message);
        btn.textContent = originalText;
        btn.disabled = false;
      }
    });
  }
});
