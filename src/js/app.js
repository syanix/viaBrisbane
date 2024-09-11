document.addEventListener('DOMContentLoaded', function () {
    const menuToggle = document.querySelector('.menu-toggle');
    const myLinks = document.getElementById('myLinks');

    menuToggle.addEventListener('click', function () {
        myLinks.classList.toggle('show');
    });
});
