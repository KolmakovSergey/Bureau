(function() {
    'use strict';

    // ---------- СТАТИЧЕСКИЕ ДАННЫЕ КОНТАКТОВ (измените здесь свои данные) ----------
    const contacts = {
        email: "SHUBERT-ANNA@MAIL.RU",
        phone: "+7 (913) 437-89-70",
        telegram: "https://t.me/my_username",
        max: "https://max.com/my_insta",
        address: "г. Новокузнецк, улица Франкфурта, 6",
        socials: [
            { name: "YouTube", url: "https://youtube.com/@my_channel" },
            { name: "VK", url: "https://vk.com/my_page" }
        ]
    };

    // ---------- ФУНКЦИЯ ЗАПОЛНЕНИЯ ЭЛЕМЕНТОВ ----------
    function fillContacts() {
        // Ищем элементы по data-contact
        const emailEl = document.querySelector('[data-contact="email"]');
        const phoneEl = document.querySelector('[data-contact="phone"]');
        const telegramEl = document.querySelector('[data-contact="telegram"]');
        const maxEl = document.querySelector('[data-contact="max"]');
        const addressEl = document.querySelector('[data-contact="address"]');

        if (emailEl) {
            if (emailEl.tagName === 'A') {
                emailEl.href = 'mailto:' + contacts.email;
            }
            const span = emailEl.querySelector('[data-contact="email"]');
            if (span) span.textContent = contacts.email;
            else emailEl.textContent = contacts.email;
        }

        if (phoneEl) {
            if (phoneEl.tagName === 'A') {
                phoneEl.href = 'tel:' + contacts.phone.replace(/\s/g, '');
            }
            const span = phoneEl.querySelector('[data-contact="phone"]');
            if (span) span.textContent = contacts.phone;
            else phoneEl.textContent = contacts.phone;
        }

        if (telegramEl) {
            if (telegramEl.tagName === 'A') {
                telegramEl.href = contacts.telegram || '#';
            }
        }

        if (maxEl) {
            if (maxEl.tagName === 'A') {
                maxEl.href = contacts.max || '#';
            }
        }

        if (addressEl && contacts.address) {
            addressEl.textContent = contacts.address;
        }

        // Можно также заполнить соцсети, если у вас есть список socials в HTML
        const socialContainer = document.getElementById('social-list'); // пример контейнера
        if (socialContainer && contacts.socials && contacts.socials.length) {
            socialContainer.innerHTML = '';
            contacts.socials.forEach(social => {
                const li = document.createElement('li');
                const a = document.createElement('a');
                a.href = social.url;
                a.target = '_blank';
                a.textContent = social.name;
                li.appendChild(a);
                socialContainer.appendChild(li);
            });
        }
    }

    // ---------- Остальной код (без изменений) ----------
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

    // ---------- Заполняем контакты при загрузке DOM ----------
    document.addEventListener('DOMContentLoaded', fillContacts);
})();