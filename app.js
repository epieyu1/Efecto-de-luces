window.addEventListener('mousemove', (e) => {
    document.body.style.setProperty('--mx', e.clientX - (window.innerWidth / 2));
    document.body.style.setProperty('--my', e.clientY - (window.innerHeight / 2));
});