-- 1. Crear la tabla de productos para Loto Tigre
create table productos (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  nombre text not null,
  sku text unique not null,
  categoria text not null,
  precio numeric not null,
  stock integer default 0,
  descripcion text,
  colores text[] default '{}', -- Guarda una lista de colores (ej: ['#000000', '#FFFFFF'])
  tallas text[] default '{}',  -- Guarda una lista de tallas (ej: ['S', 'M', 'L'] o ['Única'])
  imagenes text[] default '{}' -- Guarda una lista de URLs de las fotos
);

-- 2. Insertar un accesorio de prueba (Ficha técnica real)
insert into productos (nombre, sku, categoria, precio, stock, descripcion, colores, tallas, imagenes)
values (
  'Cosmetiquero box-fuscia',
  'LT-COS-FU-M',
  'accesorios',
  180000,
  3,
  'Cosmetiquero pop elaborado a mano en ceda fuscia para el verano.',
  array['#FF00FF', '#F014C8'], 
  array['10cm x 10cm x 20cm'],
  array['assets/images/img1-600-800.png'] 
);

-- 3. Activar el sistema de seguridad (Row Level Security)
alter table productos enable row level security;

-- 4. Crear una política de seguridad: CUALQUIERA puede ver los productos (público)
create policy "Cualquiera puede ver los productos" 
on productos for select 
using (true);