async function cargarMenuHamburguesas() {
  try {
    const response = await fetch(`https://sheetdb.io/api/v1/2pci9lbq5vmqp?t=${Date.now()}`);
    
    if (!response.ok) {
      throw new Error(`Error al conectar con SheetDB: ${response.status}`);
    }
    
    const data = await response.json();
    console.log("¡Hamburguesas cargadas con éxito!", data);
    
    const contenedorMenu = document.getElementById('contenedor-menu');
    
    if (contenedorMenu && data.length > 0) {
      contenedorMenu.innerHTML = ''; 

      let htmlContenido = '';

      // --- BLOQUE 1: LAS 3 PRIMERAS HAMBURGUESAS (Diseño Asimétrico Premium) ---
      
      // 1. La primera hamburguesa va como "Card Grande" (Hero) a la izquierda
      const primeraBurger = data[0];
      htmlContenido += `
        <article class="menu-card menu-card--hero" data-price="${primeraBurger.precio}" data-name="${primeraBurger.nombre}">
          <div class="menu-card__img-wrap">
            <img src="${primeraBurger.imagen}" alt="${primeraBurger.nombre}" />
          </div>
          <div class="menu-card__body">
            <h3 class="menu-card__name">${primeraBurger.nombre}</h3>
            <p class="menu-card__price">S/. ${primeraBurger.precio}</p>
            <p class="menu-card__desc">${primeraBurger.descripcion}</p>
            <button class="btn btn-primary btn-sm add-cart">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
              Agregar al Carrito
            </button>
          </div>
        </article>
      `;

      // 2. La segunda y tercera van en la columna derecha (`menu-col`)
      if (data.length > 1) {
        htmlContenido += `<div class="menu-col">`;
        
        // Tomamos el elemento 2 (índice 1) y el elemento 3 (índice 2) si existen
        const limiteBloqueOriginal = Math.min(data.length, 3);
        for (let i = 1; i < limiteBloqueOriginal; i++) {
          const burger = data[i];
          htmlContenido += `
            <article class="menu-card menu-card--small" data-price="${burger.precio}" data-name="${burger.nombre}">
              <div class="menu-card__img-wrap">
                <img src="${burger.imagen}" alt="${burger.nombre}" />
                ${i === 1 ? '<span class="badge badge--new">New</span>' : ''} 
              </div>
              <div class="menu-card__body">
                <div class="menu-card__row">
                  <h3 class="menu-card__name">${burger.nombre}</h3>
                  <p class="menu-card__price">S/. ${burger.precio}</p>
                </div>
                <button class="btn btn-outline btn-sm add-cart">Agregar al Carrito</button>
              </div>
            </article>
          `;
        }
        
        htmlContenido += `</div>`; // Cerramos la columna derecha original
      }

      // --- BLOQUE 2: DE LA 4TA HAMBURGUESA EN ADELANTE (Filas de tarjetas ordenadas) ---
      if (data.length > 3) {
        // Creamos un contenedor especial para las extras que ocupe todo el ancho inferior
        htmlContenido += `<div class="menu-grid-extras" style="grid-column: 1 / -1; display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 2rem; width: 100%; margin-top: 2rem;">`;

        for (let i = 3; i < data.length; i++) {
          const burger = data[i];
          htmlContenido += `
            <article class="menu-card menu-card--small" data-price="${burger.precio}" data-name="${burger.nombre}" style="width: 100%;">
              <div class="menu-card__img-wrap">
                <img src="${burger.imagen}" alt="${burger.nombre}" />
              </div>
              <div class="menu-card__body">
                <div class="menu-card__row">
                  <h3 class="menu-card__name">${burger.nombre}</h3>
                  <p class="menu-card__price">S/. ${burger.precio}</p>
                </div>
                <button class="btn btn-outline btn-sm add-cart" style="width: 100%; margin-top: 1rem;">Agregar al Carrito</button>
              </div>
            </article>
          `;
        }

        htmlContenido += `</div>`; // Cerramos el contenedor de extras
      }

      // Inyectamos todo el HTML estructurado
      contenedorMenu.innerHTML = htmlContenido;
    }
  } catch (error) {
    console.error('Hubo un problema al ordenar el menú:', error);
  }
}

document.addEventListener('DOMContentLoaded', cargarMenuHamburguesas);
