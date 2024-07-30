const dot = document.getElementById('dot');

document.addEventListener('mousemove', (e) => {
    const x = e.clientX;
    const y = e.clientY;

    dot.style.left = x + 'px';
    dot.style.top = y + 'px';
});


