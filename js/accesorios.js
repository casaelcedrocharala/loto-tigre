// 1. Inicializar el cliente de Supabase
const supabaseUrl = 'https://odpocjplypbalmraeokm.supabase.co';
const supabaseKey = 'sb_publishable_Bb6lJ49GmkXJ1P0Dww0qhg_r9PM3i1s';
const _supabase = window.supabase.createClient(supabaseUrl, supabaseKey);

// Variable global para guardar los datos de la BD en memoria
let productosLocales = [];

async function cargarAccesorios() {
    const { data: productos, error } = await _supabase
        .from('productos')
        .select('*')
        .eq('categoria', 'accesorios');

    if (error) {
        console.error('Error conectando a Supabase:', error.message);
        return;
    }

    // Guardamos una copia en nuestra variable global
    productosLocales = productos;

    // Pintamos los productos inicialmente
    renderizarProductos(productosLocales);
    
    // Escuchamos los cambios en el botón de ordenar
    configurarSelectorOrden();
}

function renderizarProductos(lista) {
    const grid = document.getElementById('grid-accesorios');
    if (!grid) return;
    
    grid.innerHTML = '';

    if (lista.length === 0) {
        grid.innerHTML = '<p class="loading">No se encontraron productos en esta categoría.</p>';
        return;
    }

    lista.forEach(prod => {
        const item = document.createElement('div');
        item.className = 'product-item';
        item.dataset.info = JSON.stringify(prod); 

        const imagenUrl = prod.imagenes && prod.imagenes.length > 0 ? prod.imagenes[0] : '/assets/images/placeholder.png';

        item.innerHTML = `
            <img src="${imagenUrl}" alt="${prod.nombre}">
            <div class="product-summary">
                <h3>${prod.nombre}</h3>
                <p>$ ${Number(prod.precio).toLocaleString('es-CO')} COP</p>
            </div>
            <button class="btn-view">Ver Producto</button>
        `;
        
        grid.appendChild(item);
    });

    configurarEventosModales();
}

function configurarSelectorOrden() {
    const select = document.getElementById('sort-select');
    if (!select) return;

    select.addEventListener('change', (e) => {
        const opcion = e.target.value;
        
        // Hacemos una copia superficial para no alterar el array original al ordenar
        let productosOrdenados = [...productosLocales];

        switch (opcion) {
            case 'price-asc':
                productosOrdenados.sort((a, b) => Number(a.precio) - Number(b.precio));
                break;
            case 'price-desc':
                productosOrdenados.sort((a, b) => Number(b.precio) - Number(a.precio));
                break;
            case 'name-asc':
                productosOrdenados.sort((a, b) => a.nombre.localeCompare(b.nombre));
                break;
            case 'stock-desc':
                productosOrdenados.sort((a, b) => b.stock - a.stock);
                break;
            default:
                // Si elige "Recomendados", se queda con el orden por defecto que trajo Supabase
                break;
        }

        // Volvemos a pintar la grilla con el nuevo orden
        renderizarProductos(productosOrdenados);
    });
}

function configurarEventosModales() {
    const modal = document.getElementById('main-modal');
    if (!modal) return;

    document.querySelectorAll('.product-item .btn-view').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const card = e.target.closest('.product-item');
            const prodData = JSON.parse(card.dataset.info);
            const imagenUrl = prodData.imagenes && prodData.imagenes.length > 0 ? prodData.imagenes[0] : '/assets/images/placeholder.png';

            modal.open({
                image: imagenUrl,
                title: prodData.nombre,
                price: Number(prodData.precio).toLocaleString('es-CO'),
                description: prodData.descripcion,
                sizes: prodData.tallas,
                colors: prodData.colores
            });
        });
    });
}

document.addEventListener('DOMContentLoaded', cargarAccesorios);

