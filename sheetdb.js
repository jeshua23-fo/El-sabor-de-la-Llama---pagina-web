'use strict';

/* ============================================================
   SHEETDB – Conexión con base de datos Excel
   ============================================================ */

const SHEETDB_API_URL = 'https://sheetdb.io/api/v1/1ahgi07ndlp75';

/**
 * Envía datos a SheetDB usando POST.
 * @param {{data: any}} payload
 * @returns {Promise<any>}
 */
async function postSheetDB(payload) {
  const response = await fetch(SHEETDB_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`SheetDB error ${response.status}: ${errorText}`);
  }

  return response.json();
}

/**
 * Agrega un registro de contacto a la hoja de Excel.
 * @param {{name:string,email:string,subject:string,message:string,date:string}} contact
 * @returns {Promise<any>}
 */
async function addContactRecord(contact) {
  return postSheetDB({ data: [contact] });
}

/**
 * Agrega un registro de suscripción (newsletter / mailing list).
 * @param {{email:string,subscribed_at:string}} record
 * @returns {Promise<any>}
 */
async function addSubscriptionRecord(record) {
  return postSheetDB({ data: [record] });
}

/**
 * Verifica que la API esté disponible.
 * @returns {Promise<boolean>}
 */
async function checkSheetDBConnection() {
  try {
    const response = await fetch(SHEETDB_API_URL);
    return response.ok;
  } catch (error) {
    return false;
  }
}
