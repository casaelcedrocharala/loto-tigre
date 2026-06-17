class AuthForm extends HTMLElement {
    constructor() {
        super();
        this.isLogin = true; // Estado para alternar entre login y registro
    }

    connectedCallback() {
        this.render();
    }

    toggleMode() {
        this.isLogin = !this.isLogin;
        this.render();
    }

    render() {
        this.innerHTML = `
        <div class="auth-container">
            <div class="auth-box">
                <h2>${this.isLogin ? 'Iniciar Sesión' : 'Crear Cuenta'}</h2>
                <p class="auth-subtitle">LOTO TIGRE — EXCLUSIVE DESIGN</p>
                
                <form id="auth-form">
                    <div class="input-group">
                        <label>Email</label>
                        <input type="email" id="email" required placeholder="tu@email.com">
                    </div>
                    <div class="input-group">
                        <label>Contraseña</label>
                        <input type="password" id="password" required placeholder="••••••••">
                    </div>
                    
                    <button type="submit" class="btn-submit">
                        ${this.isLogin ? 'ENTRAR' : 'REGISTRARME'}
                    </button>
                </form>

                <button class="btn-toggle" id="toggle-auth">
                    ${this.isLogin ? '¿No tienes cuenta? Regístrate' : '¿Ya tienes cuenta? Inicia sesión'}
                </button>
            </div>
        </div>
        `;

        // Eventos
        this.querySelector('#toggle-auth').addEventListener('click', () => this.toggleMode());
        this.querySelector('#auth-form').addEventListener('submit', (e) => this.handleSubmit(e));
    }

    async handleSubmit(e) {
        e.preventDefault();
        const email = this.querySelector('#email').value;
        const password = this.querySelector('#password').value;

        if (this.isLogin) {
            // Lógica de Supabase: const { data, error } = await supabase.auth.signInWithPassword({ email, password })
            console.log("Iniciando sesión con:", email);
        } else {
            // Lógica de Supabase: const { data, error } = await supabase.auth.signUp({ email, password })
            console.log("Registrando a:", email);
        }
    }
}

customElements.define('auth-form', AuthForm);
