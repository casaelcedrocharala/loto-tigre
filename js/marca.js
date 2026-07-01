document.addEventListener("DOMContentLoaded", () => {
    const secciones = document.querySelectorAll(".animar-scroll");

    const opciones = {
        root: null, // Usa la pantalla del navegador
        threshold: 0.15, // Se activa cuando el 15% de la sección es visible
        rootMargin: "0px"
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("visible");
                observer.unobserve(entry.target); // Deja de vigilarla una vez animada
            }
        });
    }, opciones);

    secciones.forEach(seccion => {
        observer.observe(seccion);
    });
});
