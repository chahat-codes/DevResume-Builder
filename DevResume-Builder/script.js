document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements - Inputs
    const inputs = {
        name: document.getElementById('input-name'),
        email: document.getElementById('input-email'),
        phone: document.getElementById('input-phone'),
        linkedin: document.getElementById('input-linkedin'),
        github: document.getElementById('input-github'),
        bio: document.getElementById('input-bio'),
        skills: document.getElementById('input-skills'),
        experience: document.getElementById('input-experience'),
        education: document.getElementById('input-education')
    };

    // DOM Elements - Preview & Controls
    const preview = document.getElementById('resume-preview');
    const btnPrint = document.getElementById('btn-print');
    const btnReset = document.getElementById('btn-reset');
    const themeBtns = document.querySelectorAll('.theme-btn');

    // State
    let currentTheme = 'classic';

    // Initialize
    loadFromLocalStorage();
    updatePreview();

    // Event Listeners for Live Preview
    Object.values(inputs).forEach(input => {
        input.addEventListener('input', () => {
            updatePreview();
            saveToLocalStorage();
        });
    });

    // Theme Switching
    themeBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            currentTheme = btn.getAttribute('data-theme');
            
            // Update UI
            themeBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            // Update Preview Class
            preview.className = `theme-${currentTheme}`;
            updatePreview();
            saveToLocalStorage();
        });
    });

    // Print / Download PDF
    btnPrint.addEventListener('click', () => {
        window.print();
    });

    // Reset Data
    btnReset.addEventListener('click', () => {
        if (confirm('Are you sure you want to reset all data?')) {
            Object.values(inputs).forEach(input => input.value = '');
            updatePreview();
            saveToLocalStorage();
        }
    });

    // Update Preview Function
    function updatePreview() {
        const data = {};
        Object.keys(inputs).forEach(key => {
            data[key] = inputs[key].value || '';
        });

        if (currentTheme === 'classic') {
            renderClassic(data);
        } else {
            renderModern(data);
        }
    }

    function renderClassic(data) {
        const skillsList = data.skills.split(',').filter(s => s.trim()).map(s => `<span class="skill-tag">${s.trim()}</span>`).join('');
        const expItems = data.experience.split('\n').filter(line => line.trim()).map(line => {
            const [title, date, desc] = line.split('|');
            return `<div class="experience-item">
                <div class="item-header"><span>${title?.trim() || ''}</span><span>${date?.trim() || ''}</span></div>
                <p>${desc?.trim() || ''}</p>
            </div>`;
        }).join('');

        const eduItems = data.education.split('\n').filter(line => line.trim()).map(line => {
            const [degree, date] = line.split('|');
            return `<div class="education-item">
                <div class="item-header"><span>${degree?.trim() || ''}</span><span>${date?.trim() || ''}</span></div>
            </div>`;
        }).join('');

        preview.innerHTML = `
            <header class="header">
                <h1>${data.name || 'Your Name'}</h1>
                <div class="contact-info">
                    ${data.email} ${data.email && data.phone ? '|' : ''} ${data.phone} <br>
                    ${data.linkedin} ${data.linkedin && data.github ? '|' : ''} ${data.github}
                </div>
            </header>
            <section class="bio">
                <h2>Professional Summary</h2>
                <p>${data.bio || 'Your professional summary will appear here...'}</p>
            </section>
            <section>
                <h2>Skills</h2>
                <div class="skills-list">${skillsList || 'No skills listed'}</div>
            </section>
            <section>
                <h2>Experience</h2>
                ${expItems || '<p>No experience listed</p>'}
            </section>
            <section>
                <h2>Education</h2>
                ${eduItems || '<p>No education listed</p>'}
            </section>
        `;
    }

    function renderModern(data) {
        const skillsList = data.skills.split(',').filter(s => s.trim()).map(s => `<span class="skill-tag">${s.trim()}</span>`).join('');
        const expItems = data.experience.split('\n').filter(line => line.trim()).map(line => {
            const [title, date, desc] = line.split('|');
            return `<div class="experience-item">
                <div class="item-title">${title?.trim() || ''}</div>
                <div class="item-date">${date?.trim() || ''}</div>
                <p>${desc?.trim() || ''}</p>
            </div>`;
        }).join('');

        const eduItems = data.education.split('\n').filter(line => line.trim()).map(line => {
            const [degree, date] = line.split('|');
            return `<div class="education-item">
                <div class="item-subtitle">${degree?.trim() || ''}</div>
                <div class="item-date">${date?.trim() || ''}</div>
            </div>`;
        }).join('');

        preview.innerHTML = `
            <div class="resume-sidebar">
                <div class="profile-section">
                    <h1>${data.name || 'Your Name'}</h1>
                    <div id="resume-modern-contact">
                        ${data.email ? `<div>${data.email}</div>` : ''}
                        ${data.phone ? `<div>${data.phone}</div>` : ''}
                        ${data.linkedin ? `<div>${data.linkedin}</div>` : ''}
                        ${data.github ? `<div>${data.github}</div>` : ''}
                    </div>
                </div>
                <section class="section-content">
                    <h2>Skills</h2>
                    <div class="skills-list">${skillsList || 'No skills listed'}</div>
                </section>
            </div>
            <div class="resume-main">
                <section class="section-content">
                    <h2>About Me</h2>
                    <p class="bio">${data.bio || 'Your professional summary will appear here...'}</p>
                </section>
                <section class="section-content">
                    <h2>Experience</h2>
                    ${expItems || '<p>No experience listed</p>'}
                </section>
                <section class="section-content">
                    <h2>Education</h2>
                    ${eduItems || '<p>No education listed</p>'}
                </section>
            </div>
        `;
    }

    // Local Storage Functions
    function saveToLocalStorage() {
        const data = {};
        Object.keys(inputs).forEach(key => {
            data[key] = inputs[key].value;
        });
        data.theme = currentTheme;
        localStorage.setItem('devResumeData', JSON.stringify(data));
    }

    function loadFromLocalStorage() {
        const savedData = localStorage.getItem('devResumeData');
        if (savedData) {
            const data = JSON.parse(savedData);
            Object.keys(inputs).forEach(key => {
                if (data[key]) inputs[key].value = data[key];
            });
            
            if (data.theme) {
                currentTheme = data.theme;
                preview.className = `theme-${currentTheme}`;
                themeBtns.forEach(btn => {
                    if (btn.getAttribute('data-theme') === currentTheme) {
                        btn.classList.add('active');
                    } else {
                        btn.classList.remove('active');
                    }
                });
            }
        }
    }
});
