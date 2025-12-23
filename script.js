document.addEventListener("DOMContentLoaded", () => {
  const navToggle = document.getElementById("navToggle");
  const navMenu = document.getElementById("navMenu");
  const themeToggle = document.getElementById("themeToggle");

  // ===== MOBILE MENU =====
  if (navToggle && navMenu) {
    // ARIA
    navToggle.setAttribute("aria-controls", "navMenu");
    navToggle.setAttribute("aria-expanded", "false");

    // Single click handler (jangan dobel)
    navToggle.addEventListener("click", () => {
      navMenu.classList.toggle("active");
      const isOpen = navMenu.classList.contains("active");
      navToggle.setAttribute("aria-expanded", String(isOpen));
    });

    window.addEventListener("resize", () => {
      if (window.innerWidth > 700) {
        navMenu.classList.remove("active");
        navToggle.setAttribute("aria-expanded", "false");
      }
    });

    // Close menu when clicking a nav link
    navMenu.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        navMenu.classList.remove("active");
        navToggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  // ===== ACTIVE NAV (scroll spy) =====
const navLinks = document.querySelectorAll('#navMenu a[href^="#"]');
const sections = Array.from(navLinks)
  .map(a => document.querySelector(a.getAttribute("href")))
  .filter(Boolean);

function setActive(hash) {
  navLinks.forEach(a => {
    const isActive = a.getAttribute("href") === hash;
    a.classList.toggle("active", isActive);
  });
}

// Set initial active based on URL hash or default to first
if (location.hash) setActive(location.hash);
else if (navLinks[0]) setActive(navLinks[0].getAttribute("href"));

const observer = new IntersectionObserver(
  (entries) => {
    // pilih entry yang paling “terlihat”
    const visible = entries
      .filter(e => e.isIntersecting)
      .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

    if (visible && visible.target && visible.target.id) {
      setActive(`#${visible.target.id}`);
    }
  },
  {
    root: null,
    threshold: [0.25, 0.4, 0.6],
    rootMargin: "-20% 0px -60% 0px" // tuning supaya enak
  }
);

sections.forEach(sec => observer.observe(sec));

// Optional: close menu on scroll (mobile UX)
window.addEventListener("scroll", () => {
  if (navMenu && navToggle && navMenu.classList.contains("active")) {
    navMenu.classList.remove("active");
    navToggle.setAttribute("aria-expanded", "false");
  }
}, { passive: true });


  // ===== DARK MODE =====
  if (themeToggle) {
    const savedTheme = localStorage.getItem("theme");

    if (savedTheme === "dark") {
      document.body.classList.add("dark");
      themeToggle.textContent = "☀️";
    } else {
      themeToggle.textContent = "🌙";
    }

    themeToggle.addEventListener("click", () => {
      document.body.classList.toggle("dark");
      const isDark = document.body.classList.contains("dark");
      localStorage.setItem("theme", isDark ? "dark" : "light");
      themeToggle.textContent = isDark ? "☀️" : "🌙";
    });
  }

  // ===== PORTFOLIO MODAL =====
const modal = document.getElementById("portfolioModal");
const modalTitle = modal?.querySelector("#modalTitle");
const modalDesc = modal?.querySelector(".modal-desc");
const modalTags = modal?.querySelector(".modal-tags");
const modalLink = modal?.querySelector("#modalLink");

document.querySelectorAll(".tile").forEach(tile => {
  tile.addEventListener("click", (e) => {
    e.preventDefault();

    modalTitle.textContent = tile.dataset.title || "";
    modalDesc.textContent = tile.dataset.desc || "";
    modalLink.href = tile.dataset.link || "#";

    modalTags.innerHTML = "";
    (tile.dataset.tags || "").split(",").forEach(t => {
      if (!t) return;
      const span = document.createElement("span");
      span.textContent = t.trim();
      modalTags.appendChild(span);
    });

    modal.classList.add("active");
    modal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  });
});

modal?.querySelectorAll("[data-close]").forEach(el => {
  el.addEventListener("click", closeModal);
});

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && modal.classList.contains("active")) {
    closeModal();
  }
});

function closeModal() {
  modal.classList.remove("active");
  modal.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
}

});
