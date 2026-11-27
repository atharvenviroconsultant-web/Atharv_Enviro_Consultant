// Initialize Scroll Animations
if (typeof AOS !== 'undefined') {
    AOS.init({
        once: true,
        duration: 800
    });

    window.addEventListener('load', () => {
        AOS.refresh();
    });
}

// Hero Background Image Slideshow
const heroSlides = document.querySelectorAll('.hero-bg-slide');
let currentSlideIndex = 0;

if (heroSlides.length > 1) {
    setInterval(() => {
        heroSlides[currentSlideIndex].classList.remove('active');
        currentSlideIndex = (currentSlideIndex + 1) % heroSlides.length;
        heroSlides[currentSlideIndex].classList.add('active');
    }, 4500);
}

// Mobile Menu Toggle
const menuToggle = document.getElementById('mobile-menu');
const navLinks = document.getElementById('nav-links');

if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', () => {
        navLinks.classList.toggle('active');
    });

    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
        });
    });
}

// Project Category Filter (Works for both static & Firebase-loaded project cards)
document.addEventListener('click', (e) => {
    const btn = e.target.closest('.filter-btn');
    if (!btn) return;

    const filterBtns = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    const filter = btn.getAttribute('data-filter');

    projectCards.forEach(card => {
        if (filter === 'all' || card.getAttribute('data-category') === filter) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
});

// Home Projects Preview rule:
// - 1 uploaded card -> keep that 1 card visible (and hide extra Read More button)
// - 2 or more uploaded cards -> show 2 cards on Home + display Read More button to projects.html
function syncHomeProjectsPreview() {
    const homeProjectsGrid = document.getElementById('home-projects-grid');
    if (!homeProjectsGrid) return;

    const homeProjectsReadMore = document.getElementById('home-projects-readmore');
    const cards = Array.from(homeProjectsGrid.querySelectorAll('.project-card'));
    const totalUploaded = cards.length;

    if (totalUploaded <= 1) {
        cards.forEach(card => {
            card.style.display = '';
        });
        if (homeProjectsReadMore) {
            homeProjectsReadMore.style.display = 'none';
        }
    } else {
        cards.forEach((card, index) => {
            card.style.display = index < 2 ? '' : 'none';
        });
        if (homeProjectsReadMore) {
            homeProjectsReadMore.style.display = '';
        }
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', syncHomeProjectsPreview);
} else {
    syncHomeProjectsPreview();
}

// Observe dynamically added cards (for example from Firebase) on #home-projects-grid
const homeProjectsContainer = document.getElementById('home-projects-grid');
if (homeProjectsContainer && typeof MutationObserver !== 'undefined') {
    const observer = new MutationObserver(() => {
        syncHomeProjectsPreview();
    });
    observer.observe(homeProjectsContainer, { childList: true });
}

// Helper to build mailto and Gmail compose URLs safely when inquiry payload is passed
function buildInquiryMailLinks(payload) {
    if (!payload) return null;

    const service = payload.service || 'General Inquiry';
    const name = payload.name || '';
    const phone = payload.phone || '';
    const email = payload.email || '';
    const message = payload.message || '';

    const mailSubject = encodeURIComponent(`Website Inquiry - ${service}`);
    const mailBody = encodeURIComponent(
        `Name: ${name}\nPhone: ${phone}\nEmail: ${email}\nService: ${service}\n\nMessage:\n${message}`
    );

    return {
        mailtoUrl: `mailto:hr.atharvenviro@gmail.com?subject=${mailSubject}&body=${mailBody}`,
        gmailWebUrl: `https://mail.google.com/mail/?view=cm&fs=1&to=hr.atharvenviro@gmail.com&su=${mailSubject}&body=${mailBody}`
    };
}