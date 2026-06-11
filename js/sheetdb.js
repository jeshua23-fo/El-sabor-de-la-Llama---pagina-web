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
      

      // === BLOQUE 1: LAS 3 PRIMERAS HAMBURGUESAS (Estructura nativa original) ===
      
      // 1. La primera de tu Excel va a la izquierda como la Card Grande
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

      // 2. La segunda y tercera hamburguesa van en la columna derecha nativa (.menu-col)
      if (data.length > 1) {
        htmlContenido += `<div class="menu-col">`;
        
        // Controlamos que solo entren máximo 2 elementos aquí (índices 1 y 2)
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
        
        htmlContenido += `</div>`; // Cerramos la columna derecha (.menu-col)
      }

      // === BLOQUE 2: DE LA 4TA HAMBURGUESA EN ADELANTE (Inyección Balanceada Inferior) ===
      if (data.length > 3) {
        /* Aquí cerramos el impacto del grid original inyectando un contenedor que rompe las 
           dos columnas gracias a 'grid-column: 1 / -1'. Además, usamos 'display: flex' 
           y 'flex-wrap: wrap' para que las tarjetas sobrantes fluyan de izquierda a derecha 
           de forma perfectamente simétrica y adaptativa.
        */
        htmlContenido += `
          <div class="menu-extras-container" style="grid-column: 1 / -1; display: flex; flex-wrap: wrap; gap: 20px; width: 100%; margin-top: 10px;">
        `;

        for (let i = 3; i < data.length; i++) {
          const burger = data[i];
          htmlContenido += `
            <article class="menu-card menu-card--small" data-price="${burger.precio}" data-name="${burger.nombre}" style="flex: 1 1 calc(50% - 10px); min-width: 280px; display: flex; flex-direction: column;">
              <div class="menu-card__img-wrap" style="height: 180px;">
                <img src="${burger.imagen}" alt="${burger.nombre}" />
              </div>
              <div class="menu-card__body" style="padding: 14px 16px 16px; display: flex; flex-direction: column; gap: 10px; flex: 1;">
                <div class="menu-card__row" style="display: flex; align-items: baseline; justify-content: space-between;">
                  <h3 class="menu-card__name">${burger.nombre}</h3>
                  <p class="menu-card__price">S/. ${burger.precio}</p>
                </div>
                <button class="btn btn-outline btn-sm add-cart" style="margin-top: auto;">Agregar al Carrito</button>
              </div>
            </article>
          `;
        }

        htmlContenido += `</div>`; // Cerramos el contenedor de extras
      }

      // Volcamos la estructura final limpia
      contenedorMenu.innerHTML = htmlContenido;
    }
  } catch (error) {
    console.error('Error al ordenar dinámicamente las hamburguesas:', error);
  }
}

document.addEventListener('DOMContentLoaded', cargarMenuHamburguesas);
