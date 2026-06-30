(function() {
    'use strict';

    // Hamburger
    const hamburger = document.getElementById('hamburger');
    const nav = document.getElementById('nav');

    if (hamburger && nav) {
        hamburger.addEventListener('click', function() {
            this.classList.toggle('active');
            nav.classList.toggle('open');
        });

        nav.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                nav.classList.remove('open');
            });
        });
    }

    // Header scroll
    const header = document.getElementById('header');
    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 30) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // Case toggles
    const toggleButtons = document.querySelectorAll('.case-toggle');
    toggleButtons.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            const targetId = this.dataset.target;
            const details = document.getElementById(targetId);
            const arrow = this.querySelector('.arrow');
            const span = this.querySelector('span:first-child');
            if (!details) return;
            const isOpen = details.classList.contains('open');
            if (isOpen) {
                details.classList.remove('open');
                if (arrow) arrow.classList.remove('open');
                if (span) span.textContent = 'Подробнее';
            } else {
                details.classList.add('open');
                if (arrow) arrow.classList.add('open');
                if (span) span.textContent = 'Скрыть';
            }
        });
    });

    // Click on card toggles details
    document.querySelectorAll('.case-card').forEach(card => {
        card.addEventListener('click', function(e) {
            if (e.target.closest('.case-toggle')) return;
            if (e.target.closest('a')) return;
            const toggleBtn = this.querySelector('.case-toggle');
            if (toggleBtn) toggleBtn.click();
        });
    });

    // Smooth anchor scroll
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            const targetEl = document.querySelector(targetId);
            if (targetEl) {
                e.preventDefault();
                const offset = 80;
                const top = targetEl.getBoundingClientRect().top + window.pageYOffset - offset;
                window.scrollTo({ top, behavior: 'smooth' });
            }
        });
    });

    // Escape closes nav
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && nav.classList.contains('open')) {
            hamburger.classList.remove('active');
            nav.classList.remove('open');
        }
    });

    // ---------- Загрузка контактов с сервера ----------
    async function loadContacts() {
        try {
            const response = await fetch('/api/contacts');
            if (!response.ok) throw new Error('Network error');
            const data = await response.json();

            // Заполняем элементы с data-contact
            const emailEl = document.querySelector('[data-contact="email"]');
            const phoneEl = document.querySelector('[data-contact="phone"]');
            const telegramEl = document.querySelector('[data-contact="telegram"]');
            const instagramEl = document.querySelector('[data-contact="instagram"]');

            if (emailEl) {
                if (emailEl.tagName === 'A') {
                    emailEl.href = 'mailto:' + data.email;
                }
                // Внутри может быть span с тем же атрибутом, обновим его текст
                const span = emailEl.querySelector('[data-contact="email"]');
                if (span) span.textContent = data.email;
                else emailEl.textContent = data.email;
            }

            if (phoneEl) {
                if (phoneEl.tagName === 'A') {
                    phoneEl.href = 'tel:' + data.phone.replace(/\s/g, '');
                }
                const span = phoneEl.querySelector('[data-contact="phone"]');
                if (span) span.textContent = data.phone;
                else phoneEl.textContent = data.phone;
            }

            if (telegramEl) {
                if (telegramEl.tagName === 'A') {
                    telegramEl.href = data.telegram || '#';
                }
                // Можно обновить текст, если нужно
            }

            if (instagramEl) {
                if (instagramEl.tagName === 'A') {
                    instagramEl.href = data.instagram || '#';
                }
            }

            // Дополнительно можно заполнить другие места, например, если есть отдельный блок с адресом
            const addressEl = document.querySelector('[data-contact="address"]');
            if (addressEl && data.address) {
                addressEl.textContent = data.address;
            }

        } catch (error) {
            console.error('Failed to load contacts:', error);
        }
    }

    // Загружаем контакты при загрузке DOM
    document.addEventListener('DOMContentLoaded', loadContacts);
})();