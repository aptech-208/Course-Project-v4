const observerOption = {
    threshold: 0.1
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = "1";
            entry.target.style.transform = "translateY(0) scale(1)";
        }
    });
}, observerOption);

document.querySelectorAll('.product-card').forEach(card => {
    card.style.opacity = "0";
    card.style.transform = "translateY(100px) scale(0.9)";
    card.style.transition = "all 0.8s cubic-bezier(0.22, 1, 0.36, 1)";
    observer.observe(card);
});