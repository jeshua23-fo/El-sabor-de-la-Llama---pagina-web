async function cargarMenuHamburguesas() {
  try {
    // URL con anti-cache para jalar los datos actualizados
    const response = await fetch(`https://sheetdb.io/api/v1/2pci9lbq5vmqp?t=${Date.now()}`);
    
    if (!response.ok) {
      throw new Error(`Error al conectar con SheetDB: ${response.status}`);
    }
    
    const data = await response.json();
    console.log("¡Hamburguesas cargadas con éxito!", data);
    
    const contenedorMenu = document.getElementById('contenedor-menu');
    
    if (contenedorMenu && data.length > 0) {
      contenedorMenu.innerHTML = ''; // Limpiamos el contenedor por si acaso

      let htmlContenido = '';

      // 1. La primera hamburguesa de tu Excel será la "Card Grande" (Hero)
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

      // 2. Si hay más hamburguesas en tu Excel, las metemos en la columna de "Cards Pequeñas"
      if (data.length > 1) {
        htmlContenido += `<div class="menu-col">`;
        
        // Recorremos desde la segunda hamburguesa en adelante
        for (let i = 1; i < data.length; i++) {
          const burger = data[i];
          
          // Renderizamos la tarjeta pequeña respetando tus clases CSS
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
        
        htmlContenido += `</div>`; // Cerramos la columna pequeña
      }

      // 3. Metemos todo el bloque estructural dentro de tu div "contenedor-menu"
      contenedorMenu.innerHTML = htmlContenido;

    }
  } catch (error) {
    console.error('Hubo un problema al cargar el menú:', error);
  }
}

// Inicializar la carga al montar el DOM
document.addEventListener('DOMContentLoaded', cargarMenuHamburguesas);
