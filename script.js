const menuButton = document.querySelector(".menu-toggle");
const primaryNavigation = document.querySelector("#primary-navigation");
const menuLabel = document.querySelector(".menu-toggle-label");

function closeMenu(returnFocus = false) {
  menuButton.setAttribute("aria-expanded", "false");
  primaryNavigation.classList.remove("is-open");
  menuLabel.textContent = "Menu";

  if (returnFocus) {
    menuButton.focus();
  }
}

menuButton.addEventListener("click", () => {
  const isExpanded = menuButton.getAttribute("aria-expanded") === "true";
  menuButton.setAttribute("aria-expanded", String(!isExpanded));
  primaryNavigation.classList.toggle("is-open", !isExpanded);
  menuLabel.textContent = isExpanded ? "Menu" : "Zavrieť";
});

primaryNavigation.addEventListener("click", (event) => {
  if (event.target.closest("a")) {
    closeMenu();
  }
});

document.addEventListener("click", (event) => {
  if (
    menuButton.getAttribute("aria-expanded") === "true"
    && !primaryNavigation.contains(event.target)
    && !menuButton.contains(event.target)
  ) {
    closeMenu();
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && menuButton.getAttribute("aria-expanded") === "true") {
    closeMenu(true);
  }
});

document.documentElement.classList.add("menu-ready");

const year = document.querySelector("#current-year");
year.textContent = new Date().getFullYear();

const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const scrollNextButton = document.querySelector(".scroll-next");
const sectionTargets = [...document.querySelectorAll("#domov, #projekty, #o-mne, #kontakt")];
const scrollNextContent = document.querySelectorAll(
  ".site-header .wordmark, .primary-nav, .hero-copy, .hero-art, .section-heading, .project-card, .about > *, .footer-main > *, .footer-bottom > *"
);

function getCurrentSectionIndex() {
  const marker = window.scrollY + window.innerHeight * 0.4;
  return sectionTargets.reduce((currentIndex, section, index) => (
    section.offsetTop <= marker ? index : currentIndex
  ), 0);
}

function updateScrollNextButton() {
  const currentIndex = getCurrentSectionIndex();
  const hasRoom = window.matchMedia("(min-width: 1440px)").matches;

  if (!hasRoom || currentIndex >= sectionTargets.length - 1) {
    scrollNextButton.hidden = true;
    return;
  }

  scrollNextButton.hidden = false;
  const buttonRect = scrollNextButton.getBoundingClientRect();
  const safeRect = {
    left: buttonRect.left - 8,
    right: buttonRect.right + 8,
    top: buttonRect.top - 8,
    bottom: buttonRect.bottom + 8
  };
  const overlapsContent = [...scrollNextContent].some((element) => {
    const rect = element.getBoundingClientRect();
    return rect.width > 0
      && rect.height > 0
      && safeRect.left < rect.right
      && safeRect.right > rect.left
      && safeRect.top < rect.bottom
      && safeRect.bottom > rect.top;
  });

  scrollNextButton.hidden = overlapsContent;
}

scrollNextButton.addEventListener("click", () => {
  const nextSection = sectionTargets[getCurrentSectionIndex() + 1];
  nextSection?.scrollIntoView({
    behavior: prefersReducedMotion ? "auto" : "smooth",
    block: "start"
  });
});

window.addEventListener("scroll", updateScrollNextButton, { passive: true });
window.addEventListener("resize", updateScrollNextButton);
updateScrollNextButton();

if ("IntersectionObserver" in window && !prefersReducedMotion) {
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  document.documentElement.classList.add("js-ready");
  document.querySelectorAll(".reveal").forEach((element) => revealObserver.observe(element));
}
