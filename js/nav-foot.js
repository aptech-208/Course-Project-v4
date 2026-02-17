document.addEventListener('DOMContentLoaded', () => {

    const island = document.querySelector('#islandContainer');

    window.addEventListener('scroll', () => {
        island.classList.toggle('scrolled', window.scrollY > 60);
    }, { passive: true });



    const mobileToggle = document.getElementById('mobileToggle');
    const navLinks = document.querySelector('.nav-links');
    const authBtns = document.getElementById('auth-btns');
    const userProfile = document.getElementById('user-profile');

    const drawer = document.createElement('div');
    drawer.id = 'mobile-drawer';

    const drawerHeader = document.createElement('div');
    drawerHeader.className = 'drawer-header';

    const drawerLogo = document.createElement('span');
    drawerLogo.className = 'drawer-logo';
    drawerLogo.textContent = 'RICHFIELD.';

    const closeBtn = document.createElement('button');
    closeBtn.className = 'drawer-close';
    closeBtn.setAttribute('aria-label', 'Close menu');
    closeBtn.innerHTML = '&times;';

    drawerHeader.appendChild(drawerLogo);
    drawerHeader.appendChild(closeBtn);
    drawer.appendChild(drawerHeader);

    const links = [
        { label: 'Home', href: './index.html' },
        { label: 'Furniture', href: './cardSearch.html' },
        { label: 'About Us', href: './aboutus.html' },
        { label: 'Contact', href: './contact.html' },
    ];

    const drawerNav = document.createElement('nav');
    drawerNav.className = 'drawer-nav';

    links.forEach(({ label, href }) => {
        const a = document.createElement('a');
        a.href = href;
        a.textContent = label;
        a.addEventListener('click', closeDrawer);
        drawerNav.appendChild(a);
    });

    drawer.appendChild(drawerNav);

    const divider = document.createElement('div');
    divider.className = 'drawer-divider';
    drawer.appendChild(divider);

    const drawerAuth = document.createElement('div');
    drawerAuth.className = 'drawer-auth';
    drawer.appendChild(drawerAuth);

    const backdrop = document.createElement('div');
    backdrop.id = 'drawer-backdrop';

    document.body.appendChild(backdrop);
    document.body.appendChild(drawer);

    function openDrawer() {
        renderDrawerAuth();
        drawer.classList.add('open');
        backdrop.classList.add('open');
        document.body.style.overflow = 'hidden';
        mobileToggle.classList.add('active');
    }

    function closeDrawer() {
        drawer.classList.remove('open');
        backdrop.classList.remove('open');
        document.body.style.overflow = '';
        mobileToggle.classList.remove('active');
    }

    function renderDrawerAuth() {
        drawerAuth.innerHTML = '';

        const loggedInUser = JSON.parse(localStorage.getItem('currentUser'));

        if (loggedInUser) {
            const profileCard = document.createElement('div');
            profileCard.className = 'drawer-profile-card';

            const greeting = document.createElement('span');
            greeting.className = 'drawer-greeting';
            greeting.textContent = `Hello, ${ loggedInUser.name.split(' ')[0] }`;

            const avatar = document.createElement('div');
            avatar.className = 'drawer-avatar';
            avatar.textContent = loggedInUser.name.charAt(0).toUpperCase();
            avatar.title = 'Tap to log out';
            avatar.addEventListener('click', () => {
                if (confirm('Do you want to log out?')) {
                    localStorage.removeItem('currentUser');
                    window.location.reload();
                }
            });

            profileCard.appendChild(greeting);
            profileCard.appendChild(avatar);
            drawerAuth.appendChild(profileCard);
        } else {
            const loginBtn = document.createElement('a');
            loginBtn.href = './login.html';
            loginBtn.className = 'drawer-btn-ghost';
            loginBtn.textContent = 'Log In';
            loginBtn.addEventListener('click', closeDrawer);

            const signupBtn = document.createElement('a');
            signupBtn.href = './signup.html';
            signupBtn.className = 'drawer-btn-primary';
            signupBtn.innerHTML = 'Sign Up &rarr;';
            signupBtn.addEventListener('click', closeDrawer);

            drawerAuth.appendChild(loginBtn);
            drawerAuth.appendChild(signupBtn);
        }
    }

    if (mobileToggle) {
        mobileToggle.addEventListener('click', () => {
            drawer.classList.contains('open') ? closeDrawer() : openDrawer();
        });
    }

    closeBtn.addEventListener('click', closeDrawer);
    backdrop.addEventListener('click', closeDrawer);
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeDrawer();
    });


    const userGreeting = document.getElementById('user-greeting');
    const userInitial = document.getElementById('user-initial');
    const logoutTrigger = document.getElementById('logout-trigger');

    const loggedInUser = JSON.parse(localStorage.getItem('currentUser'));

    if (loggedInUser) {
        if (authBtns) authBtns.style.display = 'none';
        if (userProfile) userProfile.style.display = 'flex';
        if (userGreeting) userGreeting.textContent = `Hello, ${ loggedInUser.name.split(' ')[0] }`;
        if (userInitial) userInitial.textContent = loggedInUser.name.charAt(0).toUpperCase();
    }

    if (logoutTrigger) {
        logoutTrigger.addEventListener('click', () => {
            if (confirm('Do you want to log out?')) {
                localStorage.removeItem('currentUser');
                window.location.reload();
            }
        });
    }


    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) entry.target.classList.add('reveal');
        });
    }, { threshold: 0.2 });

    document.querySelectorAll('section').forEach(s => revealObserver.observe(s));


    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const target = document.querySelector(this.getAttribute('href'));
            if (!target) return;
            e.preventDefault();
            const offset = 100;
            const top = target.getBoundingClientRect().top + window.scrollY - offset;
            window.scrollTo({ top, behavior: 'smooth' });
        });
    });

});