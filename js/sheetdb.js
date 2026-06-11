'use strict';

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

      // === BLOQUE 1: LA HAMBURGUESA GRANDE (HERO) ===
      const primeraBurger = data[0];
      
      // Validamos que exista el precio antes de limpiarlo para evitar caídas
      let precioHeroRaw = primeraBurger.precio ? primeraBurger.precio.toString() : '0';
      let precioHeroLimpio = precioHeroRaw.replace(/S\/\.?\s?/g, '');
      let precioHeroFormateado = parseFloat(precioHeroLimpio).toFixed(2);

      htmlContenido += `
        <article class="menu-card menu-card--hero" data-price="${precioHeroFormateado}" data-name="${primeraBurger.nombre}">
          <div class="menu-card__img-wrap">
            <img src="${primeraBurger.imagen}" alt="${primeraBurger.nombre}" />
          </div>
          <div class="menu-card__body">
            <h3 class="menu-card__name">${primeraBurger.nombre}</h3>
            <p class="menu-card__price">S/. ${precioHeroFormateado}</p>
            <p class="menu-card__desc">${primeraBurger.descripcion}</p>
            <button class="btn btn-primary btn-sm add-cart">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
              Agregar al Carrito
            </button>
          </div>
        </article>
      `;

      // === BLOQUE 2: LAS DOS HAMBURGUESAS MEDIANAS (COLUMNA DERECHA) ===
      if (data.length > 1) {
        htmlContenido += `<div class="menu-col">`;
        
        const limiteBloqueOriginal = Math.min(data.length, 3);
        for (let i = 1; i < limiteBloqueOriginal; i++) {
          const burger = data[i];

          let precioRaw = burger.precio ? burger.precio.toString() : '0';
          let precioLimpio = precioRaw.replace(/S\/\.?\s?/g, '');
          let precioFormateado = parseFloat(precioLimpio).toFixed(2);

          htmlContenido += `
            <article class="menu-card menu-card--small" data-price="${precioFormateado}" data-name="${burger.nombre}">
              <div class="menu-card__img-wrap">
                <img src="${burger.imagen}" alt="${burger.nombre}" />
                ${i === 1 ? '<span class="badge badge--new">New</span>' : ''} 
              </div>
              <div class="menu-card__body">
                <div class="menu-card__row">
                  <h3 class="menu-card__name">${burger.nombre}</h3>
                  <p class="menu-card__price">S/. ${precioFormateado}</p>
                </div>
                <button class="btn btn-outline btn-sm add-cart">Agregar al Carrito</button>
              </div>
            </article>
          `;
        }
        
        htmlContenido += `</div>`; 
      }

      // === BLOQUE 3: DE LA 4TA HAMBURGUESA EN ADELANTE (FILA INFERIOR) ===
      if (data.length > 3) {
        htmlContenido += `
          <div class="menu-extras-container" style="grid-column: 1 / -1; display: flex; flex-wrap: wrap; gap: 20px; width: 100%; margin-top: 10px;">
        `;

        for (let i = 3; i < data.length; i++) {
          const burger = data[i];

          let precioRaw = burger.precio ? burger.precio.toString() : '0';
          let precioLimpio = precioRaw.replace(/S\/\.?\s?/g, '');
          let precioFormateado = parseFloat(precioLimpio).toFixed(2);

          htmlContenido += `
            <article class="menu-card menu-card--small" data-price="${precioFormateado}" data-name="${burger.nombre}" style="flex: 1 1 calc(50% - 10px); min-width: 280px; display: flex; flex-direction: column;">
              <div class="menu-card__img-wrap" style="height: 180px;">
                <img src="${burger.imagen}" alt="${burger.nombre}" />
              </div>
              <div class="menu-card__body" style="padding: 14px 16px 16px; display: flex; flex-direction: column; gap: 10px; flex: 1;">
                <div class="menu-card__row" style="display: flex; align-items: baseline; justify-content: space-between;">
                  <h3 class="menu-card__name">${burger.nombre}</h3>
                  <p class="menu-card__price">S/. ${precioFormateado}</p>
                </div>
                <button class="btn btn-outline btn-sm add-cart" style="margin-top: auto;">Agregar al Carrito</button>
              </div>
            </article>
          `;
        }

        htmlContenido += `</div>`; 
      }

      contenedorMenu.innerHTML = htmlContenido;
    }
  } catch (error) {
    console.error('Error al ordenar dinámicamente las hamburguesas:', error);
  }
}

document.addEventListener('DOMContentLoaded', cargarMenuHamburguesas);
