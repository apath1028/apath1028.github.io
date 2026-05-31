// ===== Cursor glow =====
function initCursorGlow() {
  const glow = document.getElementById("cursorGlow");
  if (!glow) return;
  let mouseX = -500,
    mouseY = -500;
  let glowX = -500,
    glowY = -500;

  document.addEventListener("mousemove", (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  function animate() {
    glowX += (mouseX - glowX) * 0.08;
    glowY += (mouseY - glowY) * 0.08;
    glow.style.left = glowX + "px";
    glow.style.top = glowY + "px";
    requestAnimationFrame(animate);
  }
  animate();
}

// ===== Parallax background orbs =====
function initParallaxOrbs() {
  document.addEventListener("mousemove", (e) => {
    const orbs = document.querySelectorAll("[data-parallax]");
    const cx = window.innerWidth / 2;
    const cy = window.innerHeight / 2;
    const dx = (e.clientX - cx) / cx;
    const dy = (e.clientY - cy) / cy;
    orbs.forEach((orb) => {
      const factor = parseFloat(orb.dataset.parallax || "0.03");
      orb.style.transform = `translate(${dx * factor * 60}px, ${dy * factor * 60}px)`;
    });
  });
}

// ===== Scroll reveal =====
function initScrollReveal() {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: "0px 0px -50px 0px" }
  );

  document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));
}

// ===== Header scroll effect =====
function initHeaderScroll() {
  const header = document.getElementById("header");
  if (!header) return;
  window.addEventListener("scroll", () => {
    header.classList.toggle("scrolled", window.scrollY > 10);
  });
}

// ===== Nav indicator =====
function initNavIndicator() {
  const nav = document.getElementById("nav");
  const indicator = document.getElementById("navIndicator");
  if (!nav || !indicator) return;

  const navLinks = nav.querySelectorAll(".nav-link");

  function updateIndicator(link) {
    const rect = link.getBoundingClientRect();
    const navRect = nav.getBoundingClientRect();
    indicator.style.width = rect.width + "px";
    indicator.style.left = rect.left - navRect.left + "px";
  }

  const activeLink = nav.querySelector(".nav-link.active");
  if (activeLink) updateIndicator(activeLink);

  navLinks.forEach((link) => {
    link.addEventListener("mouseenter", () => updateIndicator(link));
    link.addEventListener("mouseleave", () => {
      const active = nav.querySelector(".nav-link.active");
      if (active) updateIndicator(active);
    });
  });
}

// ===== Button ripple =====
function initButtonRipple() {
  document.querySelectorAll(".btn").forEach((btn) => {
    btn.addEventListener("click", function (e) {
      const ripple = document.createElement("span");
      ripple.className = "btn-ripple";
      const rect = this.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      ripple.style.width = ripple.style.height = size + "px";
      ripple.style.left = e.clientX - rect.left - size / 2 + "px";
      ripple.style.top = e.clientY - rect.top - size / 2 + "px";
      this.appendChild(ripple);
      ripple.addEventListener("animationend", () => ripple.remove());
    });
  });
}

// ===== About avatar spin =====
function initAboutAvatar() {
  const avatar = document.getElementById("aboutAvatar");
  if (!avatar) return;
  avatar.addEventListener("mouseenter", () => {
    avatar.style.transform = "rotate(360deg) scale(1.1)";
    avatar.style.transition = "transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)";
  });
  avatar.addEventListener("mouseleave", () => {
    avatar.style.transform = "rotate(0deg) scale(1)";
  });
}

// ===== Init all =====
document.addEventListener("DOMContentLoaded", () => {
  initCursorGlow();
  initParallaxOrbs();
  initScrollReveal();
  initHeaderScroll();
  initNavIndicator();
  initButtonRipple();
  initAboutAvatar();
});
