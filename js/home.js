const supabaseUrl = 'https://odpocjplypbalmraeokm.supabase.co';
const supabaseKey = 'sb_publishable_Bb6lJ49GmkXJ1P0Dww0qhg_r9PM3i1s';
const _supabase = window.supabase.createClient(supabaseUrl, supabaseKey);

async function cargarAccesoriosHome() {
    // Consultamos los accesorios limitando el resultado a un máximo de 4 productos
    const { data: productos, error } = await _supabase
        .from('productos')
        .select('*')
        .eq('categoria', 'accesorios')
        .limit(4);

    if (error) {
        console.error('Error conectando a Supabase desde Home:', error.message);
        return;
    }

    const grid = document.getElementById('grid-accesorios-home');
    if (!grid) return;
    
    grid.innerHTML = ''; 

    productos.forEach(prod => {
        const item = document.createElement('div');
        item.className = 'product-item';
        item.dataset.info = JSON.stringify(prod); 

        const imagenUrl = prod.imagenes && prod.imagenes.length > 0 ? prod.imagenes : '/assets/images/placeholder.png';

        item.innerHTML = `
            <img src="${imagenUrl}" alt="${prod.nombre}">
            <button class="btn-view">Ver Producto</button>
        `;
        
        grid.appendChild(item);
    });

    configurarModalesHome();
}

function configurarModalesHome() {
    const modal = document.getElementById('main-modal');
    if (!modal) return;

    // 1. Modales para los productos dinámicos de Supabase (Grid-4)
    document.querySelectorAll('.product-item .btn-view').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const card = e.target.closest('.product-item');
            const prodData = JSON.parse(card.dataset.info);
            const imagenUrl = prodData.imagenes && prodData.imagenes.length > 0 ? prodData.imagenes : '/assets/images/placeholder.png';

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

    // 2. Modales para las secciones fijas espejo (Grid-2-custom)
    document.querySelectorAll('.btn-view-static').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const row = e.target.closest('.row-product');
            const imagenUrl = row.querySelector('.product-image img').src;
            
            modal.open({
                image: imagenUrl,
                title: btn.dataset.title,
                price: btn.dataset.price,
                description: btn.dataset.desc,
                sizes: ['Única'],
                colors: [] // Puedes mapear colores estáticos si lo deseas
            });
        });
    });
}

document.addEventListener('DOMContentLoaded', () => {
    cargarAccesoriosHome();
});
