'use strict';

/* ============================================================
   CONTACTO API – Conexión con SheetDB para formulario de contacto
   API: https://sheetdb.io/api/v1/9r4ckxyvfw54u
   ============================================================ */

// Configuración de la API de SheetDB para contacto
const CONTACTO_API_CONFIG = {
  apiUrl: 'https://sheetdb.io/api/v1/9r4ckxyvfw54u',
  timeout: 15000, // 15 segundos
};

/**
 * Agrega un registro de contacto a la hoja de Excel.
 * @param {Object} contact - Datos del contacto
 * @param {string} contact.name - Nombre del cliente
 * @param {string} contact.email - Correo electrónico
 * @param {string} contact.subject - Asunto (general, reservation, catering, etc.)
 * @param {string} contact.message - Mensaje del cliente
 * @param {string} contact.date - Fecha y hora en formato ISO
 * @returns {Promise<Object>} Respuesta de la API
 */
async function addContactRecord(contact) {
  // Validar datos requeridos
  if (!contact.name || !contact.email || !contact.message) {
    throw new Error('Faltan datos requeridos: name, email y message son obligatorios');
  }

  const { apiUrl, timeout } = CONTACTO_API_CONFIG;

  // Preparar el payload para SheetDB (formato simple)
  // Preparar el payload con los nombres de columna exactos de tu Excel en español
  const payload = {
    data: [{
      nombre: contact.name,    // Mapea 'name' a la columna 'nombre'
      correo: contact.email,   // Mapea 'email' a la columna 'correo'
      asunto: contact.subject || 'general', // Mapea a 'asunto'
      mensaje: contact.message // Mapea 'message' a la columna 'mensaje'
      // Quitamos 'date' porque no está en tu Excel actual
    }]
  };

  console.log('📤 Enviando a SheetDB:', payload);

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    // Leer la respuesta como texto primero para debugging
    const responseText = await response.text();
    console.log('📥 Respuesta raw de SheetDB:', responseText);

    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${responseText || response.statusText}`);
    }

    // Intentar parsear como JSON
    let result;
    try {
      result = JSON.parse(responseText);
    } catch (e) {
      result = { message: responseText };
    }

    console.log('✓ Contacto guardado en SheetDB:', result);
    return result;

  } catch (error) {
    clearTimeout(timeoutId);
    
    if (error.name === 'AbortError') {
      throw new Error('Tiempo de espera agotado. Por favor intenta de nuevo.');
    }
    
    console.error('❌ Error en addContactRecord:', error);
    throw error;
  }
}

/**
 * Obtiene todos los registros de contacto (útil para administración)
 * @returns {Promise<Array>} Lista de registros
 */
async function getAllContactRecords() {
  const { apiUrl, timeout } = CONTACTO_API_CONFIG;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    return data;

  } catch (error) {
    clearTimeout(timeoutId);
    console.error('Error al obtener registros de contacto:', error);
    throw error;
  }
}

/**
 * Busca contactos por correo electrónico
 * @param {string} email - Correo a buscar
 * @returns {Promise<Array>} Registros que coinciden
 */
async function searchContactByEmail(email) {
  const { apiUrl, timeout } = CONTACTO_API_CONFIG;

  if (!email) {
    throw new Error('El correo electrónico es requerido para la búsqueda');
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    // SheetDB permite búsqueda con parámetros query
    const searchUrl = `${apiUrl}?search[email]=${encodeURIComponent(email)}`;
    
    const response = await fetch(searchUrl, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    return data;

  } catch (error) {
    clearTimeout(timeoutId);
    console.error('Error al buscar contacto:', error);
    throw error;
  }
}

/**
 * Verifica la conexión con la API de contacto
 * @returns {Promise<boolean>} True si la conexión es exitosa
 */
async function testContactoAPI() {
  try {
    await getAllContactRecords();
    return true;
  } catch (error) {
    console.error('Conexión con API de contacto fallida:', error.message);
    return false;
  }
}

// Mensaje de inicialización en consola
console.log('📞 Contacto API Module cargado - API:', CONTACTO_API_CONFIG.apiUrl);

// Exportar funciones (disponibles globalmente en el navegador)
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    addContactRecord,
    getAllContactRecords,
    searchContactByEmail,
    testContactoAPI,
    CONTACTO_API_CONFIG,
  };
}