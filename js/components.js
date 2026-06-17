class MainHeader extends HTMLElement {
    constructor() {
        super();
        this.isSubmenuOpen = false;
        this.isMobileMenuOpen = false;
    }

    connectedCallback() {
        this.render();
        this.setActiveLink();
    }

    setActiveLink() {
        const currentPath = window.location.pathname;
        this.querySelectorAll('a').forEach(link => {
            const href = link.getAttribute('href');
            if (href && href !== "#" && currentPath.includes(href)) {
                link.classList.add('active');
            }
        });
    }

    render() {
        this.innerHTML = `
        <header class="navbar">
            <div class="header-container">
                <div class="logo-container">
                    <a href="/">
                        <img src="assets/icons/logo.svg" alt="Loto Tigre Logo">
                    </a>
                </div>
                <nav class="nav-desktop">
                    <ul>
                        <li><a href="#" id="btn-colecciones">Colecciones</a></li>
                        <li><a href="#">Líneas de Diseño</a></li>
                        <li><a href="#">Sobre la Marca</a></li>
                    </ul>
                </nav>
                <button class="hamburger" id="hamburger">
                    <span></span><span></span><span></span>
                </button>
            </div>
            <div class="submenu-horizontal" id="submenu">
                <ul>
                    <li><a href="colecciones/abrigos.html">Abrigos y Chaquetas</a></li>
                    <li><a href="#">Tops</a></li>
                    <li><a href="#">Bottoms</a></li>
                    <li><a href="colecciones/accesorios.html">Accesorios</a></li>
                    <li><a href="#">Todos</a></li>
                </ul>
            </div>
            <div class="mobile-drawer" id="mobile-drawer">
                <ul class="mobile-nav-links">
                    <li>
                        <div class="mobile-collapse-btn">Colecciones <span>+</span></div>
                        <ul class="mobile-submenu">
                            <li><a href="#">Abrigos y Chaquetas</a></li>
                            <li><a href="#">Tops</a></li>
                            <li><a href="#">Bottoms</a></li>
                            <li><a href="#">Accesorios</a></li>
                            <li><a href="#">Todos</a></li>
                        </ul>
                    </li>
                    <li><a href="#">Líneas de Diseño</a></li>
                    <li><a href="#">Sobre la Marca</a></li>
                </ul>
            </div>
        </header>`;
        this.setupEventListeners();
    }

    setupEventListeners() {
        const btnCol = this.querySelector('#btn-colecciones');
        const submenu = this.querySelector('#submenu');
        const ham = this.querySelector('#hamburger');
        const drawer = this.querySelector('#mobile-drawer');
        const collapseBtn = this.querySelector('.mobile-collapse-btn');
        const mobileSubmenu = this.querySelector('.mobile-submenu');

        if (btnCol) {
            btnCol.addEventListener('click', (e) => {
                e.preventDefault();
                this.isSubmenuOpen = !this.isSubmenuOpen;
                submenu.classList.toggle('active');
                btnCol.classList.toggle('active');
            });
        }

        if (ham) {
            ham.addEventListener('click', () => {
                this.isMobileMenuOpen = !this.isMobileMenuOpen;
                drawer.classList.toggle('active');
            });
        }

        if (collapseBtn) {
            collapseBtn.addEventListener('click', () => {
                mobileSubmenu.classList.toggle('active');
            });
        }

        const menuLinks = this.querySelectorAll('.navbar a, .submenu-horizontal a');
        menuLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                const parent = link.closest('ul');
                if (parent) {
                    parent.querySelectorAll('a').forEach(l => l.classList.remove('active'));
                }
                link.classList.add('active');
            });
        });
    }
}

// Asegúrate de que esta línea no tenga puntos extra antes o después
customElements.define('main-header', MainHeader);



class ProductModal extends HTMLElement {
    constructor() {
        super();
        this.isOpen = false;
    }

    connectedCallback() {
    // 1. Primero dibujamos el menú
    this.render();

    // 2. Luego verificamos la URL para activar el link correspondiente
    const currentPath = window.location.pathname;
    
    // Buscamos todos los enlaces que acabamos de renderizar
    this.querySelectorAll('a').forEach(link => {
        const href = link.getAttribute('href');
        
                // Si el href coincide con la ruta actual (y no es solo "#")
            if (href && href !== "#" && currentPath.includes(href)) {
                    link.classList.add('active');
                    
                    // Opcional: Si el link está en el submenú, abre el submenú automáticamente
                if (link.closest('.submenu-horizontal')) {
                        this.isSubmenuOpen = true;
                        this.querySelector('#submenu').classList.add('active');
                    }
                }
            });
        }

    // Método para abrir el modal con datos dinámicos
    open(productData) {
        this.isOpen = true;
        this.render(productData);
        document.body.style.overflow = 'hidden'; // Evita scroll al estar abierto
    }

    close() {
        this.isOpen = false;
        this.render();
        document.body.style.overflow = 'auto';
    }

    render(data = {}) {
        if (!this.isOpen) {
            this.innerHTML = '';
            return;
        }

        // Generamos los círculos de color dinámicamente si existen
        const coloresHtml = data.colors && data.colors.length > 0
            ? data.colors.map(col => `<span class="color-dot" style="background-color: ${col};"></span>`).join('')
            : '';

        // Generamos los botones de tallas dinámicamente si existen
        const tallasHtml = data.sizes && data.sizes.length > 0
            ? data.sizes.map(talla => `<button class="size-btn">${talla}</button>`).join('')
            : '';

        this.innerHTML = `
        <div class="modal-overlay">
            <div class="modal-content">
                <button class="close-modal">&times;</button>
                <div class="modal-body">
                    <div class="modal-image">
                        <img src="${data.image}" alt="${data.title}">
                    </div>
                    <div class="modal-info">
                        <span class="category">LOTO TIGRE — EXCLUSIVE</span>
                        <h2>${data.title}</h2>
                        <p class="price">$ ${data.price} COP</p>
                        
                        <div class="description">
                            <p>${data.description}</p>
                        </div>

                        ${coloresHtml ? `
                            <div class="modal-section">
                                <span class="section-label">Colores Disponibles:</span>
                                <div class="color-selector">${coloresHtml}</div>
                            </div>
                        ` : ''}

                        ${tallasHtml ? `
                            <div class="modal-section">
                                <span class="section-label">Tallas / Dimensiones:</span>
                                <div class="size-selector">${tallasHtml}</div>
                            </div>
                        ` : ''}

                        <button class="btn-add-cart">Lo quiero</button>
                    </div>
                </div>
            </div>
        </div>`;

        // Eventos de cierre
        this.querySelector('.close-modal').addEventListener('click', () => this.close());
        this.querySelector('.modal-overlay').addEventListener('click', (e) => {
            if (e.target.classList.contains('modal-overlay')) this.close();
        });
    }

}
customElements.define('product-modal', ProductModal);

// lee esos datos específicos del contenedor que se pulsó
document.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById('main-modal');

    document.querySelectorAll('.product-item').forEach(item => {
        const btn = item.querySelector('.btn-view');
        
        if (btn) {
            btn.addEventListener('click', () => {
                // Extraemos los datos del dataset del contenedor 'item'
                const productData = {
                    image: item.querySelector('img').src,
                    title: item.dataset.title, // Lee data-title
                    price: item.dataset.price, // Lee data-price
                    description: item.dataset.desc // Lee data-desc
                };
                
                modal.open(productData);
            });
        }
    });
});



// Componente del Footer
class MainFooter extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `
        <footer class="main-footer">
    <div class="footer-content">
        <!-- 1. Enlaces legales -->
        <div class="footer-section links">
            <a href="#">Política de Privacidad</a>
            <a href="#">Terminos y condiciones</a>
            <a href="#">Contáctanos</a>
        </div>
        
        <!-- 2. Iconos de Redes -->
<div class="footer-section social-icons">
    <!-- WhatsApp -->
    <a href="https://wa.me/3008324432" target="_blank" title="WhatsApp">
       <!-- Ajusté el viewBox a "60 130 160 160" para centrar tus nuevas coordenadas -->
       <svg xmlns="http://www.w3.org/2000/svg" viewBox="60 130 160 160" width="24" height="24">
          <style>
            .st-wa { fill: #fff; transition: 0.3s; }
            .st-wa:hover { fill: #25d366; } 
          </style>
          <path class="st-wa" d="M140.3,136.3l13.3,2.5c24.9,6.5,44.5,26.5,50.9,51.3l2.3,12.7v11.5c-.7,2.8-.8,5.8-1.4,8.6-9.2,44-56.8,67.9-98.3,51.5-3.2-1.2-7.2-4.1-10.5-3.9-10.9,3.1-22,5.8-32.6,9.4h-1.2c-.6-.7-.2-1.2,0-1.8,2.7-11.2,6.8-22,9.3-33.3-3.2-7-6.7-13.9-8.3-21.5l-1.8-10.3c.2-3.6-.3-7.5,0-11.1,2.5-34.3,32.3-63.3,66.5-65.7h11.9ZM126.3,146.7c-38.3,3.4-63.8,46.4-50.3,82.1,2,5.2,5.2,9.5,7.3,14.5l-6.1,20.7.5,1.3,21.4-5.9c4.8,1.6,9,4.6,14,6.4,46.3,16.9,93.3-24.2,81.7-72.3-7.3-30.3-37.9-49.4-68.4-46.7h0Z"/>
          <path class="st-wa" d="M170.2,224.3c2.4,2.4.9,9.5-.9,12.2-10.9,15.4-38.6.7-49.6-8.2-9.1-7.4-23.6-24.1-23.7-36.3,0-6.1,3.1-14.7,9.3-17.1,2-.8,7.1-1.2,8.6.5,1,1.1,4.8,10.3,5.5,12.2,1.6,4.9,1.9,6.8-1.4,11.2-1.2,1.7-3.8,2.9-3.2,5.3.7,2.7,6.8,9.5,9,11.6,3.7,3.4,12.3,9.2,17,10.5,1.3.3,2.1.2,3.1-.6,2.1-1.8,4.7-5.8,6.8-7.6.5-.4,1.7-1,2.2-1l17.3,7.5h0Z"/>
       </svg>
    </a>

    <!-- FACEBOOK (Nuevo icono integrado) -->
    <a href="https://facebook.com" target="_blank" title="Facebook">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 73.16 73.13" width="24" height="24">
            <style>.st-fb { fill: #fff; transition: 0.3s; } .st-fb:hover { fill: #1877f2; }</style>
            <path class="st-fb" d="M38.85,0l3.74.47c15.64,2.56,28.18,15.46,30.24,31.19.11.86.09,1.8.31,2.62-.07,1.51.09,3.06,0,4.57-1.83,31.22-40.35,45.82-62.52,23.52S3.14,1.82,34.27,0h4.57ZM50.56,9.71c-5.51.2-11.66-1.08-16.08,3-4.67,4.31-3.5,10.99-3.64,16.72h-8.29v9.43h8.29v24.57h9.86v-24.36s.2-.21.21-.21h9.21v-9.43h-9.43v-7.21c0-.21.26-1.1.36-1.35.38-1.02,1.04-1.6,2.08-1.92.39-.12,1.44-.36,1.78-.36h5.64v-8.86Z"/>
        </svg>
    </a>

    <!-- Instagram -->
    <a href="https://www.instagram.com/loto_tigre/" target="_blank" title="Instagram">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="-150 0 600 600" width="24" height="24">
            <style>.st-in { fill: #fff; transition: 0.3s; } .st-in:hover { fill: #E1306C; }</style>
            <path class="st-in" d="M383.62,67.36c19.86,23.51,30.85,54.89,35.36,85.15l.05,260.02c-7.55,75.21-67.79,136.75-143.55,144.45l-257.02.05c-77.21-8.03-141.23-73.05-149.45-149.55l-.05-259.02C-123.67,73.23-63.24,10.99,12.51,4.01l257.03-.05c45.89,3.97,84.93,28.89,114.08,63.41h0ZM357.43,108.58c-19.42-31.35-48.62-53.9-85.94-59.58-81.39,1.39-166.91-5.29-247.98-.99-62.39,3.3-107.14,50.59-110.55,112.45,3.49,77.2-4.52,158.29.05,235.03,3.76,63.21,53.89,114.15,117.45,117.55,76.67,4.1,156.98-3.15,234.03-.05,54.88-3.23,96.87-40.33,108.44-93.56,3.3-90.53,3.64-182.19-.18-272.69-2.97-14.35-7.95-26.27-15.32-38.17h0Z"/>
            <path class="st-in" d="M233.58,169.42c104.73,87.2,41.03,260.06-98.12,253.62C45.18,418.87-16.19,327.8,7.24,241.74c26.51-97.33,147.45-138.01,226.34-72.32h0ZM222.44,222.59c-55.31-77.76-175.72-36.78-175.44,57.91.15,48.64,35.51,91.72,84.51,97.49,86.3,10.16,140-86.41,90.93-155.4Z"/>
            <path class="st-in" d="M320.6,152.6c-22.97,40.44-90.13,7.99-67.43-36.93,22.74-44.98,93.57-9.1,67.43,36.93Z"/>
        </svg>
    </a>
</div>


        <!-- 3. Idiomas -->
        <div class="footer-section languages">
            <button>ES</button>
            <button>EN</button>
            <button>FR</button>
        </div>
    </div>
</footer>
`;

        this.querySelectorAll('button[data-lang]').forEach(btn => {
            btn.addEventListener('click', () => {
                const lang = btn.getAttribute('data-lang');
                // Emitimos un evento global que el resto de la web escuchará
                window.dispatchEvent(new CustomEvent('langChange', { detail: lang }));
            });
        });
    }
}
customElements.define('main-footer', MainFooter);

