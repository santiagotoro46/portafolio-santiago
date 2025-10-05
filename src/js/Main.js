import AOS from 'aos';
import 'aos/dist/aos.css';
import tippy from 'tippy.js';
import 'tippy.js/animations/shift-away.css';
import "tippy.js/dist/backdrop.css";
import 'tippy.js/dist/tippy.css';
import { initSendEmail } from './SendEmail.js';

const initAOS = () => {
    AOS.init({
        duration: 800,
        easing: 'ease-in-out',
        once: true,
        mirror: false
    })
}

const initTippy = () => {
    tippy('[data-tippy-content]', {
        animation: 'rotate',
        arrow: false,
        theme: 'custom',
        duration: [400, 300],
    })
}

const initLoadingBar = () => {
    const loadingBar = document.querySelector('.loading-bar');
    let width = 0;

    const interval = setInterval(() => {
        if (width >= 100) {
            clearInterval(interval);
            setTimeout(() => {
                const preloader = document.getElementById('preloader');
                preloader.style.opacity = '0';
                setTimeout(() => {
                    preloader.style.display = 'none';
                }, 500);
            }, 500);
        } else {
            width += 5;
            loadingBar.style.width = width + '%';
        }
    }, 100);
};

// --- Mobile Menu ---
// Toggle para abrir/cerrar el menú
const initMobileMenuToggle = () => {
    const menuToggle = document.getElementById('menu-toggle');
    const mobileMenu = document.getElementById('mobile-menu');

    if (!menuToggle || !mobileMenu) return; 

    menuToggle.addEventListener('click', () => {
        menuToggle.classList.toggle('open');

        if (mobileMenu.classList.contains('translate-x-full')) {
            mobileMenu.classList.remove('translate-x-full');
            mobileMenu.classList.add('translate-x-0');
        } else {
            mobileMenu.classList.remove('translate-x-0');
            mobileMenu.classList.add('translate-x-full');
        }
    });
};

// Cerrar menú al hacer click en un enlace
const initMobileNavLinks = () => {
    const menuToggle = document.getElementById('menu-toggle');
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');

    if (!menuToggle || !mobileMenu || mobileNavLinks.length === 0) return; 

    mobileNavLinks.forEach(link => {
        link.addEventListener('click', () => {
            menuToggle.classList.remove('open');
            mobileMenu.classList.remove('translate-x-0');
            mobileMenu.classList.add('translate-x-full');
        });
    });
};


const initScrollSpy = () => {
    const sections = document.querySelectorAll("section[id]");
    const navLinks = document.querySelectorAll("nav a[href^='#']");

    if (sections.length === 0 || navLinks.length === 0) return;

    const onScroll = () => {
        const scrollY = window.pageYOffset;

        sections.forEach((current) => {
            const sectionHeight = current.offsetHeight;
            const sectionTop = current.offsetTop - 100;
            const sectionId = current.getAttribute("id");

            const navLink = document.querySelector(`nav a[href="#${sectionId}"]`);
            if (navLink) {
                if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                    navLink.classList.add("active-link");
                } else {
                    navLink.classList.remove("active-link");
                }
            }
        });
    };

    window.addEventListener("scroll", onScroll);
};

window.addEventListener("load", () => {
    if (window.location.hash) {
        window.location.href = window.location.origin + window.location.pathname;
    }
});



const main = () => {
    initAOS();
    initTippy();
    initLoadingBar();
    initMobileMenuToggle();
    initMobileNavLinks();
    initScrollSpy();
    initSendEmail();
}

document.addEventListener('DOMContentLoaded', main);