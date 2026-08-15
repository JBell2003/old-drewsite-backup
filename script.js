// Slider content
const slides = [
    {
        title: "Video Gets Attention",
        content: "Video is the highest-performing format on every major ad platform. Businesses that run video ads consistently see stronger click-through rates and lower cost per acquisition than static creative alone."
    },
    {
        title: "Ads Need Creative Behind Them",
        content: "Running ads without strong creative is burning budget. I produce the video and manage the campaign together so your spend is tied to content built to convert."
    },
    {
        title: "Reach Customers Where They Are",
        content: "Your customers are on Meta, Google, and TikTok. I build campaigns that meet them on those platforms with content designed for how each one actually works."
    },
    {
        title: "No Marketing Team Required",
        content: "You do not need to hire a full department to compete. I handle strategy, production, and execution so you get professional marketing output without the overhead."
    },
    {
        title: "Built for Growing Businesses",
        content: "This is built for startups and growing companies that need to get in front of customers now. Not eventually. Not after you hire three more people. Now."
    }
];

const CALENDAR_URL = 'https://calendar.app.google/S2kXbDQ9ufsJ4WKHA';

let currentSlide = 0;
let isAnimating = false;

// Mobile nav toggle
function initNav() {
    const toggle = document.querySelector('.nav-toggle');
    const navLinks = document.querySelector('.nav-links');
    if (!toggle || !navLinks) return;

    toggle.addEventListener('click', () => {
        const isOpen = navLinks.classList.toggle('open');
        toggle.setAttribute('aria-expanded', isOpen);
    });

    navLinks.querySelectorAll('a').forEach((link) => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('open');
            toggle.setAttribute('aria-expanded', 'false');
        });
    });
}

// Function to update slide content with animation
function updateSlide(direction = 'next') {
    if (isAnimating) return;
    isAnimating = true;

    const container = document.querySelector('.slider-content-container');
    const currentSlideContent = container.querySelector('.slide-content');
    const newSlideContent = document.createElement('div');
    newSlideContent.className = 'slide-content';
    newSlideContent.innerHTML = `
        <h3>${slides[currentSlide].title}</h3>
        <p>${slides[currentSlide].content}</p>
    `;

    // Add animation classes based on direction
    currentSlideContent.classList.add(direction === 'next' ? 'slide-left' : 'slide-right');
    newSlideContent.classList.add(direction === 'next' ? 'slide-right' : 'slide-left');

    // Insert new slide
    container.appendChild(newSlideContent);

    // Trigger reflow
    newSlideContent.offsetHeight;

    // Remove animation classes to trigger transition
    newSlideContent.classList.remove(direction === 'next' ? 'slide-right' : 'slide-left');

    // Remove old slide after animation
    setTimeout(() => {
        currentSlideContent.remove();
        isAnimating = false;
    }, 500);
}

// Next slide function
function nextSlide() {
    if (isAnimating) return;
    currentSlide = (currentSlide + 1) % slides.length;
    updateSlide('next');
}

// Previous slide function
function prevSlide() {
    if (isAnimating) return;
    currentSlide = (currentSlide - 1 + slides.length) % slides.length;
    updateSlide('prev');
}

// Scroll reveal animation
function reveal() {
    const reveals = document.querySelectorAll('.reveal');
    const windowHeight = window.innerHeight;
    const elementVisible = 150;

    reveals.forEach((element) => {
        const elementTop = element.getBoundingClientRect().top;

        if (elementTop < windowHeight - elementVisible) {
            element.classList.add('active');
        }
    });
}

// Service card animation
function animateServiceCards() {
    const cards = document.querySelectorAll('.service-card');
    cards.forEach((card, index) => {
        setTimeout(() => {
            card.classList.add('visible');
        }, index * 200);
    });
}

// Initialize animations
document.addEventListener('DOMContentLoaded', () => {
    window.scrollTo(0, 0);

    initNav();

    if (document.querySelector('.slider-content-container')) {
        updateSlide();
    }

    reveal();
    animateServiceCards();

    window.addEventListener('scroll', reveal);

    // Form handling
    const contactForm = document.getElementById('contactForm');
    const formStatus = document.getElementById('formStatus');

    initPortfolioModal();

    if (contactForm) {
        contactForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const submitButton = this.querySelector('button[type="submit"]');
            submitButton.disabled = true;
            submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
            formStatus.innerHTML = '';
            
            const formData = {
                name: this.querySelector('#name').value,
                email: this.querySelector('#email').value,
                message: this.querySelector('#message').value
            };
            
            try {
                const response = await fetch('https://script.google.com/macros/s/AKfycbw8YiN_MBG56uKqr7B7heMMffsoVq1feDPTKIQ9kzCB1gH6u9wKWiLKqkxO8jBphHaoFQ/exec', {
                    method: 'POST',
                    body: JSON.stringify(formData)
                });
                
                const result = await response.json();
                
                if (result.result === 'success') {
                    formStatus.innerHTML = `
                        <div class="success-message success-message--extended">
                            <i class="fas fa-check-circle"></i>
                            <div class="success-content">
                                <p>Thanks, I'll be in touch shortly. Want to skip ahead? Book a time directly below.</p>
                                <a href="${CALENDAR_URL}" class="btn btn-secondary book-call-btn" target="_blank" rel="noopener noreferrer">
                                    <i class="fas fa-calendar-alt"></i> Book a Call
                                </a>
                            </div>
                        </div>`;
                    contactForm.reset();
                } else {
                    throw new Error(result.message || 'Failed to send message');
                }
            } catch (error) {
                formStatus.innerHTML = '<div class="error-message"><i class="fas fa-exclamation-circle"></i> Failed to send message. Please try again.</div>';
                console.error('Form submission error:', error);
            }
            
            submitButton.disabled = false;
            submitButton.innerHTML = '<i class="fas fa-paper-plane"></i> Send Message';
        });
    }
});

// Smooth scroll for navigation
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// Portfolio video modal
function initPortfolioModal() {
    const modal = document.getElementById('videoModal');
    const iframe = document.getElementById('videoIframe');
    if (!modal || !iframe) return;

    const closeModal = () => {
        modal.classList.remove('open');
        modal.setAttribute('aria-hidden', 'true');
        iframe.src = '';
        document.body.style.overflow = '';
    };

    document.querySelectorAll('.portfolio-watch-btn').forEach((btn) => {
        btn.addEventListener('click', () => {
            const url = btn.getAttribute('data-video-url');
            if (!url) return;
            iframe.src = url;
            modal.classList.add('open');
            modal.setAttribute('aria-hidden', 'false');
            document.body.style.overflow = 'hidden';
        });
    });

    document.querySelectorAll('.portfolio-thumbnail').forEach((thumb) => {
        thumb.addEventListener('click', () => {
            const card = thumb.closest('.portfolio-card');
            const btn = card?.querySelector('.portfolio-watch-btn');
            if (btn) btn.click();
        });
    });

    modal.querySelector('.video-modal-close')?.addEventListener('click', closeModal);
    modal.querySelector('.video-modal-backdrop')?.addEventListener('click', closeModal);

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('open')) {
            closeModal();
        }
    });
}

// Force scroll to top on page load/reload
window.onbeforeunload = function () {
    window.scrollTo(0, 0);
}; 