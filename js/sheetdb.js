'use strict';

/* ============================================================
   SHEETDB – Conexión con base de datos de Hamburguesas
   ============================================================ */

// 1. Configuramos tu URL base con la API que me pasaste
const SHEETDB_API_URL = 'https://sheetdb.io/api/v1/2pci9lbq5vmqp';

/**
 * Obtiene las hamburguesas de Excel y las edita directamente en la página.
 */
async function cargarMenuHamburguesas() {
  try {
    // Armamos la URL agregando el '?t=' para romper el caché del navegador
    const urlConAntiCache = `${SHEETDB_API_URL}?t=${Date.now()}`;
    
    const response = await fetch(urlConAntiCache);
    
    if (!response.ok) {
      throw new Error(`Error al conectar con SheetDB: ${response.status}`);
    }
    
    const data = await response.json();
    console.log("¡Hamburguesas cargadas con éxito desde Excel!", data);
    
    // 2. BUSCAMOS TU CONTENEDOR EN EL HTML
    // (Reemplaza 'contenedor-menu' por el ID real de tu sección de productos en tu HTML)
    const contenedorMenu = document.getElementById('contenedor-menu');
    
    if (contenedorMenu) {
      contenedorMenu.innerHTML = ''; // Limpiamos las tarjetas estáticas que tenías antes

      // Recorremos las filas de tu Excel y las metemos dinámicamente al HTML
      data.forEach(burger => {
        contenedorMenu.innerHTML += `
          <div class="card-hamburguesa">
            <img src="${burger.imagen}" alt="${burger.nombre}" class="img-producto">
            <div class="info-producto">
              <h3>${burger.nombre}</h3>
              <p>${burger.descripcion}</p>
              <span class="precio">S/. ${burger.precio}</span>
            </div>
          </div>
        `;
      });
    } else {
      console.warn("Alerta: No se encontró el contenedor HTML. Revisa el ID en tu archivo .html");
    }

    return data;
  } catch (error) {
    console.error('Hubo un problema al cargar el menú:', error);
    return [];
  }
}

// Ejecutamos la función de manera automática cuando la página termine de cargar
document.addEventListener('DOMContentLoaded', cargarMenuHamburguesas);
