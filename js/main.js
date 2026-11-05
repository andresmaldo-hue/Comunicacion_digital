/**
 * DCCD - DISEÑO, CONTENIDO Y COMUNICACIÓN DIGITAL
 * Script Principal Interactivo
 */

document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initHeroCarousel();
  initGallery();
  initDiagnosisForm();
  initAuthModal();
  initScrollSpy();
});

/* ==========================================================================
   1. NAVBAR & NAVEGACIÓN MÓVIL
   ========================================================================== */
function initNavbar() {
  const menuToggle = document.getElementById('menuToggle');
  const navLinks = document.getElementById('navLinks');
  const header = document.querySelector('.site-header');

  if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', () => {
      navLinks.classList.toggle('open');
      const icon = menuToggle.querySelector('i');
      if (icon) {
        icon.classList.toggle('fa-bars');
        icon.classList.toggle('fa-xmark');
      }
    });

    // Cerrar al dar click en cualquier enlace
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('open');
        const icon = menuToggle.querySelector('i');
        if (icon) {
          icon.classList.add('fa-bars');
          icon.classList.remove('fa-xmark');
        }
      });
    });
  }

  // Sombra y estilo dinámico al hacer scroll
  window.addEventListener('scroll', () => {
    if (window.scrollY > 30) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });
}

/* ==========================================================================
   2. HERO CAROUSEL (BANNERS DCCD)
   ========================================================================== */
function initHeroCarousel() {
  const slides = document.querySelectorAll('.carousel-slide');
  const dots = document.querySelectorAll('.carousel-dot');
  const prevBtn = document.getElementById('carouselPrev');
  const nextBtn = document.getElementById('carouselNext');
  const carouselContainer = document.querySelector('.carousel-container');

  if (!slides.length) return;

  let currentIndex = 0;
  let intervalId = null;
  const slideDuration = 6500;

  function showSlide(index) {
    slides.forEach((slide, i) => {
      slide.classList.toggle('active', i === index);
    });
    dots.forEach((dot, i) => {
      dot.classList.toggle('active', i === index);
    });
    currentIndex = index;
  }

  function nextSlide() {
    let nextIndex = (currentIndex + 1) % slides.length;
    showSlide(nextIndex);
  }

  function prevSlide() {
    let prevIndex = (currentIndex - 1 + slides.length) % slides.length;
    showSlide(prevIndex);
  }

  function startAutoPlay() {
    if (!intervalId) {
      intervalId = setInterval(nextSlide, slideDuration);
    }
  }

  function stopAutoPlay() {
    if (intervalId) {
      clearInterval(intervalId);
      intervalId = null;
    }
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      nextSlide();
      stopAutoPlay();
      startAutoPlay();
    });
  }

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      prevSlide();
      stopAutoPlay();
      startAutoPlay();
    });
  }

  dots.forEach(dot => {
    dot.addEventListener('click', (e) => {
      const slideIndex = parseInt(e.target.dataset.slide, 10);
      showSlide(slideIndex);
      stopAutoPlay();
      startAutoPlay();
    });
  });

  if (carouselContainer) {
    carouselContainer.addEventListener('mouseenter', stopAutoPlay);
    carouselContainer.addEventListener('mouseleave', startAutoPlay);

    // Soporte para gestos táctiles (Swipe en celulares)
    let touchStartX = 0;
    let touchEndX = 0;

    carouselContainer.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    carouselContainer.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      handleSwipe();
    }, { passive: true });

    function handleSwipe() {
      if (touchEndX < touchStartX - 40) {
        nextSlide();
      }
      if (touchEndX > touchStartX + 40) {
        prevSlide();
      }
    }
  }

  startAutoPlay();
}

/* ==========================================================================
   3. GALERÍA DE IMÁGENES Y LIGHTBOX (PIEZAS GRÁFICAS DCCD)
   ========================================================================== */
function initGallery() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const galleryItems = document.querySelectorAll('.gallery-item');
  const lightboxModal = document.getElementById('lightboxModal');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxTitle = document.getElementById('lightboxTitle');
  const lightboxTag = document.getElementById('lightboxTag');
  const lightboxDesc = document.getElementById('lightboxDesc');
  const lightboxClient = document.getElementById('lightboxClient');
  const lightboxCtaBtn = document.getElementById('lightboxCtaBtn');

  // Filtrado de Categorías
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.dataset.filter;

      galleryItems.forEach(item => {
        const itemCategory = item.dataset.category;
        if (filterValue === 'all' || itemCategory === filterValue) {
          item.style.display = 'block';
          item.style.animation = 'fadeIn 0.5s ease forwards';
        } else {
          item.style.display = 'none';
        }
      });
    });
  });

  // Apertura de Lightbox
  galleryItems.forEach(item => {
    item.addEventListener('click', () => {
      const img = item.querySelector('img');
      const title = item.dataset.title || 'Pieza Gráfica';
      const category = item.dataset.categoryName || 'Diseño';
      const desc = item.dataset.description || 'Diseño publicitario de alto impacto realizado por el equipo DCCD.';
      const client = item.dataset.client || 'Cliente DCCD';

      if (lightboxImg && img) lightboxImg.src = img.src;
      if (lightboxTitle) lightboxTitle.textContent = title;
      if (lightboxTag) lightboxTag.textContent = category;
      if (lightboxDesc) lightboxDesc.textContent = desc;
      if (lightboxClient) lightboxClient.textContent = client;

      if (lightboxCtaBtn) {
        const message = encodeURIComponent(`¡Hola equipo DCCD! Vi en su galería el trabajo "${title}" (${client}) y me gustaría cotizar una pieza publicitaria similar para mi negocio.`);
        lightboxCtaBtn.href = `https://wa.me/573000000000?text=${message}`;
      }

      openModal(lightboxModal);
    });
  });

  // Cerrar modales generales
  document.querySelectorAll('.modal-overlay').forEach(modal => {
    modal.addEventListener('click', (e) => {
      if (e.target === modal || e.target.closest('.modal-close-btn')) {
        closeModal(modal);
      }
    });
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      document.querySelectorAll('.modal-overlay.active').forEach(modal => {
        closeModal(modal);
      });
    }
  });
}

function openModal(modal) {
  if (modal) {
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
}

function closeModal(modal) {
  if (modal) {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }
}

/* ==========================================================================
   4. FORMULARIO DE DIAGNÓSTICO Y COTIZACIÓN (REQUISITO 8)
   ========================================================================== */
function initDiagnosisForm() {
  const form = document.getElementById('diagnosisForm');
  const summaryModal = document.getElementById('summaryModal');
  const summaryContent = document.getElementById('summaryContent');
  const sendWhatsAppBtn = document.getElementById('summaryWhatsAppBtn');

  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    // 1. Información de contacto
    const nombre = form.fullName.value.trim();
    const empresa = form.companyName.value.trim();
    const email = form.email.value.trim();
    const telefono = form.phone.value.trim();
    const website = form.socialLinks.value.trim() || 'No especificada';

    // 2. Objetivos
    const selectedGoals = [];
    form.querySelectorAll('input[name="goals"]:checked').forEach(cb => {
      selectedGoals.push(cb.value);
    });

    const otherGoal = form.otherGoal.value.trim();
    if (otherGoal) {
      selectedGoals.push(`Otro: ${otherGoal}`);
    }

    const projectIdea = form.projectIdea.value.trim();

    // 3. Presupuesto
    const budgetSelected = form.querySelector('input[name="budget"]:checked');
    const presupuesto = budgetSelected ? budgetSelected.value : 'No seleccionado';

    // 4. Tiempo
    const timeframeSelected = form.querySelector('input[name="timeframe"]:checked');
    const tiempo = timeframeSelected ? timeframeSelected.value : 'No seleccionado';

    // Validaciones básicas
    if (!nombre || !empresa || !email || !telefono) {
      alert('Por favor completa todos los campos obligatorios de la sección 1 (Información de Contacto).');
      return;
    }

    if (selectedGoals.length === 0) {
      alert('Por favor selecciona al menos un objetivo para tu proyecto en la sección 2.');
      return;
    }

    if (!presupuesto || presupuesto === 'No seleccionado') {
      alert('Por favor selecciona una opción de presupuesto en la sección 3.');
      return;
    }

    if (!tiempo || tiempo === 'No seleccionado') {
      alert('Por favor selecciona el tiempo estimado de entrega en la sección 4.');
      return;
    }

    // Datos estructurados
    const cotizacionData = {
      id: 'COT-' + Math.floor(1000 + Math.random() * 9000),
      fecha: new Date().toLocaleDateString('es-CO', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' }),
      nombre,
      empresa,
      email,
      telefono,
      website,
      objetivos: selectedGoals,
      detalles: projectIdea || 'Sin detalles adicionales',
      presupuesto,
      tiempo
    };

    // Guardar en LocalStorage para historial de cotizaciones / portal cliente
    let savedQuotes = JSON.parse(localStorage.getItem('dccd_cotizaciones') || '[]');
    savedQuotes.unshift(cotizacionData);
    localStorage.setItem('dccd_cotizaciones', JSON.stringify(savedQuotes));

    // Generar mensaje para WhatsApp con formato enriquecido
    const goalsFormatted = selectedGoals.map(g => `• ${g}`).join('%0A');
    const waMessage = 
      `*SOLICITUD DE DIAGNÓSTICO Y COTIZACIÓN - DCCD*%0A` +
      `Código: ${cotizacionData.id}%0A` +
      `------------------------------------------%0A` +
      `👤 *Cliente:* ${nombre}%0A` +
      `🏢 *Empresa / Proyecto:* ${empresa}%0A` +
      `📧 *Correo:* ${email}%0A` +
      `📱 *Teléfono:* ${telefono}%0A` +
      `🌐 *Redes / Web:* ${website}%0A%0A` +
      `🎯 *Objetivos Seleccionados:*%0A${goalsFormatted}%0A%0A` +
      `📝 *Detalles de la Idea:*%0A${encodeURIComponent(cotizacionData.detalles)}%0A%0A` +
      `💰 *Presupuesto Estimado:* ${presupuesto}%0A` +
      `⏱️ *Tiempo Requerido:* ${tiempo}%0A` +
      `------------------------------------------%0A` +
      `¡Quedo a la espera de su asesoría y propuesta personalizada!`;

    // Renderizar modal de resumen
    if (summaryContent) {
      summaryContent.innerHTML = `
        <div style="background: rgba(95, 116, 68, 0.15); border: 1px solid var(--primary-green); border-radius: 12px; padding: 20px; margin-bottom: 24px;">
          <h4 style="color: var(--accent-yellow); margin-bottom: 6px; font-size: 1.15rem;">
            <i class="fa-solid fa-circle-check"></i> ¡Diagnóstico Registrado con Éxito!
          </h4>
          <p style="font-size: 0.9rem; color: #e2e8f0;">
            Hemos recibido los requerimientos de tu proyecto <strong>${empresa}</strong> (ID: <code>${cotizacionData.id}</code>). Analizaremos la información de inmediato.
          </p>
        </div>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 20px; font-size: 0.92rem;">
          <div><strong style="color: var(--text-muted);">Nombre:</strong> <br>${nombre}</div>
          <div><strong style="color: var(--text-muted);">Empresa:</strong> <br>${empresa}</div>
          <div><strong style="color: var(--text-muted);">Correo:</strong> <br>${email}</div>
          <div><strong style="color: var(--text-muted);">WhatsApp:</strong> <br>${telefono}</div>
          <div><strong style="color: var(--text-muted);">Presupuesto:</strong> <br><span style="color: var(--accent-yellow); font-weight:700;">${presupuesto}</span></div>
          <div><strong style="color: var(--text-muted);">Tiempo:</strong> <br>${tiempo}</div>
        </div>

        <div style="margin-bottom: 20px; font-size: 0.92rem;">
          <strong style="color: var(--text-muted);">Objetivos:</strong>
          <ul style="margin-top: 6px; padding-left: 20px; color: #f1f5f9;">
            ${selectedGoals.map(g => `<li>${g}</li>`).join('')}
          </ul>
        </div>

        ${projectIdea ? `
        <div style="margin-bottom: 24px; font-size: 0.9rem; background: rgba(0,0,0,0.3); padding: 14px; border-radius: 8px;">
          <strong style="color: var(--text-muted);">Detalles adicionales:</strong>
          <p style="color: #cbd5e1; margin-top: 4px;">${projectIdea}</p>
        </div>` : ''}

        <p style="font-size: 0.9rem; color: #94a3b8; margin-bottom: 24px;">
          Para acelerar la respuesta y agendar tu asesoría inmediata, puedes enviar una copia directa a nuestro WhatsApp corporativo:
        </p>
      `;
    }

    if (sendWhatsAppBtn) {
      sendWhatsAppBtn.href = `https://wa.me/573000000000?text=${waMessage}`;
    }

    openModal(summaryModal);
    form.reset();
  });
}

/* ==========================================================================
   5. INICIO DE SESIÓN / PORTAL DE CLIENTES (REQUISITO 8)
   ========================================================================== */
function initAuthModal() {
  const authModal = document.getElementById('authModal');
  const openAuthBtns = document.querySelectorAll('.open-auth-modal');
  const authTabs = document.querySelectorAll('.auth-tab-btn');
  const tabPanes = document.querySelectorAll('.auth-tab-pane');
  const loginForm = document.getElementById('loginForm');
  const registerForm = document.getElementById('registerForm');
  const userGreeting = document.getElementById('userGreeting');
  const clientDashboardArea = document.getElementById('clientDashboardArea');
  const quotesListContainer = document.getElementById('quotesListContainer');

  openAuthBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      checkAuthStatus();
      openModal(authModal);
    });
  });

  // Alternar pestañas del modal (Login / Registro / Dashboard)
  authTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      authTabs.forEach(t => t.classList.remove('active'));
      tabPanes.forEach(p => p.style.display = 'none');

      tab.classList.add('active');
      const targetPane = document.getElementById(tab.dataset.target);
      if (targetPane) targetPane.style.display = 'block';
    });
  });

  // Login simulado
  if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = loginForm.loginEmail.value.trim();
      const user = {
        name: email.split('@')[0],
        email: email,
        isLoggedIn: true
      };
      localStorage.setItem('dccd_current_user', JSON.stringify(user));
      loginForm.reset();
      renderClientDashboard(user);
    });
  }

  // Registro simulado
  if (registerForm) {
    registerForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = registerForm.regName.value.trim();
      const email = registerForm.regEmail.value.trim();
      const company = registerForm.regCompany.value.trim();

      const user = {
        name: name,
        email: email,
        company: company,
        isLoggedIn: true
      };
      localStorage.setItem('dccd_current_user', JSON.stringify(user));
      registerForm.reset();
      renderClientDashboard(user);
    });
  }

  function checkAuthStatus() {
    const user = JSON.parse(localStorage.getItem('dccd_current_user') || 'null');
    if (user && user.isLoggedIn) {
      renderClientDashboard(user);
    } else {
      // Mostrar pestaña de login por defecto
      authTabs.forEach(t => t.classList.toggle('active', t.dataset.target === 'paneLogin'));
      tabPanes.forEach(p => p.style.display = p.id === 'paneLogin' ? 'block' : 'none');
    }
  }

  function renderClientDashboard(user) {
    authTabs.forEach(t => t.classList.toggle('active', t.dataset.target === 'paneDashboard'));
    tabPanes.forEach(p => p.style.display = p.id === 'paneDashboard' ? 'block' : 'none');

    // Actualizar nombre en el header
    openAuthBtns.forEach(btn => {
      btn.innerHTML = `<i class="fa-solid fa-user-check"></i> ${user.name}`;
      btn.classList.add('btn-primary');
      btn.classList.remove('btn-outline');
    });

    if (userGreeting) {
      userGreeting.textContent = `¡Hola de nuevo, ${user.name}!`;
    }

    // Renderizar cotizaciones guardadas
    const quotes = JSON.parse(localStorage.getItem('dccd_cotizaciones') || '[]');
    if (quotesListContainer) {
      if (quotes.length === 0) {
        quotesListContainer.innerHTML = `
          <div style="text-align: center; padding: 30px; color: var(--text-muted); background: rgba(0,0,0,0.2); border-radius: 12px;">
            <i class="fa-regular fa-clipboard" style="font-size: 2rem; margin-bottom: 12px; opacity: 0.5;"></i>
            <p>Aún no has enviado diagnósticos ni cotizaciones.</p>
            <a href="#diagnostico" class="btn btn-sm btn-primary" style="margin-top: 14px;" onclick="closeModal(document.getElementById('authModal'))">
              Completar Formulario de Cotización
            </a>
          </div>
        `;
      } else {
        quotesListContainer.innerHTML = quotes.map(q => `
          <div style="background: rgba(13, 18, 16, 0.7); border: 1px solid var(--border-color); border-radius: 10px; padding: 16px; margin-bottom: 12px;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
              <span style="font-weight: 700; color: var(--accent-yellow); font-size: 0.95rem;">${q.id} - ${q.empresa}</span>
              <span style="font-size: 0.75rem; background: rgba(95, 116, 68, 0.3); color: var(--text-light-green); padding: 3px 10px; border-radius: 50px;">En Análisis</span>
            </div>
            <p style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 6px;">
              <strong>Presupuesto:</strong> ${q.presupuesto} | <strong>Tiempo:</strong> ${q.tiempo}
            </p>
            <div style="font-size: 0.8rem; color: var(--text-dim);">Enviado: ${q.fecha}</div>
          </div>
        `).join('');
      }
    }
  }

  // Botón de Cerrar Sesión
  const logoutBtn = document.getElementById('logoutBtn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      localStorage.removeItem('dccd_current_user');
      openAuthBtns.forEach(btn => {
        btn.innerHTML = `<i class="fa-solid fa-user-circle"></i> Iniciar Sesión`;
        btn.classList.add('btn-outline');
        btn.classList.remove('btn-primary');
      });
      authTabs.forEach(t => t.classList.toggle('active', t.dataset.target === 'paneLogin'));
      tabPanes.forEach(p => p.style.display = p.id === 'paneLogin' ? 'block' : 'none');
    });
  }

  // Verificar estado inicial
  const existingUser = JSON.parse(localStorage.getItem('dccd_current_user') || 'null');
  if (existingUser && existingUser.isLoggedIn) {
    openAuthBtns.forEach(btn => {
      btn.innerHTML = `<i class="fa-solid fa-user-check"></i> ${existingUser.name}`;
      btn.classList.add('btn-primary');
      btn.classList.remove('btn-outline');
    });
  }
}

/* ==========================================================================
   6. SCROLL SPY PARA MARCAR SECCIÓN ACTIVA EN NAVBAR
   ========================================================================== */
function initScrollSpy() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  window.addEventListener('scroll', () => {
    let current = '';
    const scrollPos = window.scrollY + 120;

    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  });
}
