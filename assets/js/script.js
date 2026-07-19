const navigation = document.querySelector('.site-nav');
const menuToggle = document.querySelector('.nav-toggle');
const navigationLinks = [...document.querySelectorAll('[data-nav-link]')];
const menuLinks = [...document.querySelectorAll('.nav-menu a')];

if (navigation && menuToggle && navigationLinks.length) {
  const closeMenu = () => {
    navigation.classList.remove('is-menu-open');
    menuToggle.setAttribute('aria-expanded', 'false');
  };

  const setActiveLink = (sectionId) => {
    navigationLinks.forEach((link) => {
      const isActive = link.getAttribute('href') === `#${sectionId}`;

      if (isActive) {
        link.setAttribute('aria-current', 'page');
      } else {
        link.removeAttribute('aria-current');
      }
    });
  };

  menuToggle.addEventListener('click', () => {
    const isOpen = navigation.classList.toggle('is-menu-open');
    menuToggle.setAttribute('aria-expanded', String(isOpen));
  });

  menuLinks.forEach((link) => {
    link.addEventListener('click', () => {
      if (link.hasAttribute('data-nav-link')) {
        setActiveLink(link.getAttribute('href').slice(1));
      }

      closeMenu();
    });
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && navigation.classList.contains('is-menu-open')) {
      closeMenu();
      menuToggle.focus();
    }
  });

  const linkedSections = navigationLinks
    .map((link) => document.querySelector(link.getAttribute('href')))
    .filter(Boolean);

  if ('IntersectionObserver' in window) {
    const visibleSections = new Map();
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(({ isIntersecting, intersectionRatio, target }) => {
          if (isIntersecting) {
            visibleSections.set(target, intersectionRatio);
          } else {
            visibleSections.delete(target);
          }
        });

        const [currentSection] = [...visibleSections.entries()]
          .sort(([, firstRatio], [, secondRatio]) => secondRatio - firstRatio)[0] || [];

        if (currentSection) {
          setActiveLink(currentSection.id);
        }
      },
      {
        rootMargin: '-30% 0px -55% 0px',
        threshold: [0, 0.1, 0.25, 0.5],
      },
    );

    linkedSections.forEach((section) => observer.observe(section));
  } else {
    const updateActiveLink = () => {
      const currentSection = linkedSections.reduce((activeSection, section) => (
        section.getBoundingClientRect().top <= window.innerHeight * 0.35
          ? section
          : activeSection
      ), linkedSections[0]);

      if (currentSection) {
        setActiveLink(currentSection.id);
      }
    };

    window.addEventListener('scroll', updateActiveLink, { passive: true });
    updateActiveLink();
  }
}
