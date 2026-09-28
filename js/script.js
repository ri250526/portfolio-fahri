const root = document.documentElement;
const revealSections = document.querySelectorAll('.reveal-section');
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (revealSections.length && !prefersReducedMotion) {
    if ('IntersectionObserver' in window) {
        root.classList.add('has-scroll-reveal');

        const sectionObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.12 });

        revealSections.forEach(section => sectionObserver.observe(section));
    } else {
        revealSections.forEach(section => section.classList.add('is-visible'));
    }
}

const themeToggle = document.getElementById('themeToggle');
const themeIcon = document.getElementById('themeIcon');

let savedTheme = null;
try {
    savedTheme = localStorage.getItem('theme');
} catch {
    savedTheme = null;
}

function applyTheme(theme) {
    root.setAttribute('data-bs-theme', theme);

    if (themeIcon) {
        themeIcon.className = theme === 'light'
            ? 'bi bi-moon-stars-fill text-dark'
            : 'bi bi-sun-fill text-warning';
    }

    themeToggle?.setAttribute('aria-label', theme === 'light' ? 'Aktifkan tema gelap' : 'Aktifkan tema terang');
}

if (savedTheme === 'light' || savedTheme === 'dark') {
    applyTheme(savedTheme);
} else {
    applyTheme(root.getAttribute('data-bs-theme') || 'dark');
}

themeToggle?.addEventListener('click', () => {
    const nextTheme = root.getAttribute('data-bs-theme') === 'dark' ? 'light' : 'dark';
    applyTheme(nextTheme);

    try {
        localStorage.setItem('theme', nextTheme);
    } catch {
        // Theme switching still works when storage is unavailable.
    }
});

const navbarMenu = document.getElementById('navbarNav');
const navbarLinks = navbarMenu?.querySelectorAll('.nav-link[href^="#"]') ?? [];
if (navbarMenu && window.bootstrap?.Collapse) {
    navbarLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (navbarMenu.classList.contains('show')) {
                window.bootstrap.Collapse.getOrCreateInstance(navbarMenu).hide();
            }
        });
    });
}

const navSections = [...document.querySelectorAll('main section[id]')];
if (navbarLinks.length && navSections.length) {
    const updateActiveNavLink = () => {
        const activationPoint = window.scrollY + 104;
        let activeSection = navSections[0];

        navSections.forEach(section => {
            if (section.getBoundingClientRect().top + window.scrollY <= activationPoint) {
                activeSection = section;
            }
        });

        navbarLinks.forEach(link => {
            const isActive = link.hash === `#${activeSection.id}`;
            link.classList.toggle('active', isActive);

            if (isActive) {
                link.setAttribute('aria-current', 'location');
            } else {
                link.removeAttribute('aria-current');
            }
        });
    };

    updateActiveNavLink();
    window.addEventListener('scroll', updateActiveNavLink, { passive: true });
    window.addEventListener('resize', updateActiveNavLink);
}

const typewriter = document.getElementById('typewriter');
const roles = ['Network Engineer', 'Network Technician', 'Problem Solver'];
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (typewriter) {
    if (reduceMotion) {
        typewriter.textContent = roles[0];
    } else {
        let roleIndex = 0;
        let characterIndex = 0;
        let deleting = false;

        function typeNextCharacter() {
            if (document.hidden) {
                window.setTimeout(typeNextCharacter, 500);
                return;
            }

            const role = roles[roleIndex];
            characterIndex += deleting ? -1 : 1;
            typewriter.textContent = role.slice(0, characterIndex);

            if (!deleting && characterIndex === role.length) {
                deleting = true;
                window.setTimeout(typeNextCharacter, 1600);
                return;
            }

            if (deleting && characterIndex === 0) {
                deleting = false;
                roleIndex = (roleIndex + 1) % roles.length;
                window.setTimeout(typeNextCharacter, 350);
                return;
            }

            window.setTimeout(typeNextCharacter, deleting ? 45 : 85);
        }

        typeNextCharacter();
    }
}

const backToTop = document.getElementById('backToTop');
if (backToTop) {
    const updateBackToTopVisibility = () => {
        backToTop.style.display = window.scrollY > 300 ? 'grid' : 'none';
    };

    updateBackToTopVisibility();
    window.addEventListener('scroll', updateBackToTopVisibility, { passive: true });
    backToTop.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

const contactForm = document.getElementById('contactForm');
const contactAlert = document.getElementById('contactAlert');
const contactEmail = document.getElementById('contactEmail')?.textContent.trim();

if (contactForm && contactAlert) {
    contactForm.addEventListener('submit', event => {
        event.preventDefault();
        contactForm.classList.add('was-validated');

        if (!contactForm.checkValidity()) {
            contactForm.querySelector(':invalid')?.focus();
            return;
        }

        if (!contactEmail) {
            contactAlert.classList.remove('d-none');
            contactAlert.classList.replace('alert-info', 'alert-danger');
            contactAlert.textContent = 'Alamat email tujuan belum tersedia.';
            return;
        }

        const fieldValue = name => contactForm.elements.namedItem(name).value.trim();
        const subject = fieldValue('subject');
        const body = `Nama: ${fieldValue('name')}\nEmail: ${fieldValue('email')}\n\n${fieldValue('message')}`;
        const mailto = `mailto:${contactEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

        contactAlert.classList.remove('d-none');
        window.location.href = mailto;
    });
}