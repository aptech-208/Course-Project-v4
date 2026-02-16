document.addEventListener('DOMContentLoaded', () => {
    // 1. DYNAMIC ISLAND SCROLL LOGIC
    const island = document.querySelector('#islandContainer');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 60) {
            island.classList.add('scrolled');
        } else {
            island.classList.remove('scrolled');
        }
    });

    // 2. REVEAL ANIMATIONS
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('reveal');
            }
        });
    }, { threshold: 0.2 });

    document.querySelectorAll('section').forEach(section => observer.observe(section));

    // 3. SMOOTH SCROLLING
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();

            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                const offset = 100;
                const bodyRect = document.body.getBoundingClientRect().top;
                const elementRect = targetElement.getBoundingClientRect().top;
                const elementPosition = elementRect - bodyRect;
                const offsetPosition = elementPosition - offset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
});

// RESPONSIVE NAVBAR SCROLL LOGIC
document.addEventListener('DOMContentLoaded', () => {
    const mobileToggle = document.getElementById('mobileToggle');
    const navLinks = document.getElementById('navLinks');

    if (mobileToggle) {
        mobileToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            mobileToggle.classList.toggle('active');
        });
    }

    // Close menu when clicking a link
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
            mobileToggle.classList.remove('active');
        });
    });
});

// SIGN AND LOGIN 
document.addEventListener('DOMContentLoaded', function () {
    const authBtns = document.getElementById('auth-btns');
    const userProfile = document.getElementById('user-profile');
    const userGreeting = document.getElementById('user-greeting');
    const userInitial = document.getElementById('user-initial');

    // 1. Check if a user is stored in localStorage from your login logic
    // Note: You should update your login.html to save 'currentUser' upon success
    const loggedInUser = JSON.parse(localStorage.getItem('currentUser'));

    if (loggedInUser) {
        // Hide Login/Signup
        authBtns.style.display = 'none';

        // Show Profile Icon
        userProfile.style.display = 'flex';

        // Set Greeting and Initial (e.g., "John" -> "J")
        userGreeting.textContent = `Hello, ${ loggedInUser.name.split(' ')[0] }`;
        userInitial.textContent = loggedInUser.name.charAt(0).toUpperCase();
    }

    // 2. Logout Functionality (Click the circle to logout)
    document.getElementById('logout-trigger').addEventListener('click', () => {
        if (confirm("Do you want to log out?")) {
            localStorage.removeItem('currentUser');
            window.location.reload();
        }
    });
});