/* =========================================================
   CONFIGURACIÓN CENTRAL DE TEILEN TEENS
   Cambia aquí los enlaces: todos los botones del sitio los leen de este archivo.
   No publiques un enlace de pago que no esté verificado.
   ========================================================= */
window.TEILEN_CONFIG = Object.freeze({
  siteUrl: 'https://www.teilenteens.com/',
  assessmentUrl: 'https://www.teilenteens.com/login',   // Botones "Empieza sin pagar"
  loginUrl: 'https://www.teilenteens.com/login',        // Enlace "Iniciar sesión"
  supportEmail: 'talento@teilenteens.com',
  whatsappInternational: '5493517623874',               // Probar desde un teléfono de otro país antes de publicar
  newsletter: 'https://www.linkedin.com/newsletters/el-valor-humano-7512193265182564352',
  instagram: 'https://www.instagram.com/teilenteens/',
  checkoutUrl: '',          // Checkout de Hotmart, cuando esté verificado (precio, moneda, garantía, webhook)
  familyCheckoutUrl: '',    // Lo genera el backend: vinculado a la evaluación mediante un código de un solo uso
  applicationEndpoint: ''   // Endpoint HTTPS/CRM para formularios. Vacío = los formularios preparan un correo
});
