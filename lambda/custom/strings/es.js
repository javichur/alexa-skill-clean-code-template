const p = {
  SKILL_NAME: 'El Template',
  WELCOME_TO: 'Bienvenido a',
  SAMPLES: '"hola", "ayuda", "comprobar permisos" (actívalos primero en la consola de developer alexa), "usar api", "guardar sesión", "leer sesión", "guardar base de datos", "cargar base de datos", un color, "encadena intentos" (que saltará al intent de color con verde), "carga los valores del slot dinámico", "limpia el slot dinámico", "cuéntame un chiste de tipo animales" (animales es el valor del slot dinámico), "eres un coche?" (activa primero en la consola de developer alexa el permiso de ubicación) o "stop"',
  HELLO_WORLD: 'Hola Mundo',
  GOODBYE: '¡Hasta luego!',
  ASK_PERMISSIONS: 'Revisa tu app móvil de Alexa para darme los permisos necesarios. ¡Hasta luego!',
  THANKS_NAME_PERMISSIONS: 'Gracias {0}, has aceptado los permisos.',
  SESSION_NOT_SAVED_YET: 'Aún no has guardado un valor en la sesión de la skill. Di "guardar sesión".',
  SESSION_LOADED: 'Acabo de leer el valor {0} de la sesión de la skill.',
  SESSION_SAVED: 'Acabo de guardar el valor {0} en la sesión de la skill. Di "leer sesión".',
  COLOR_SAID: 'Has dicho el color {0}',
  FALLBACK: 'No entiendo lo que quieres decir en este contexto. ',

  SPEAK_POST_PURCHASE: 'Di "ayuda" para más info', // edit this
  SPEAK_POST_REFUND: 'Di "ayuda" para más info', // edit this

  /* purchase strings */
  I_RECOMMEND_THIS: 'Te recomiendo esto',
  DO_YOU_WANT_TO_LEARN_MORE: '¿Quieres saber más?',
  NO_PRODUCTS_TO_OFFER: 'No hay productos que te pueda ofrecer ahora. Lo siento',
  I_DIDNT_CATCH: 'No entendí eso. ¿Con qué te puedo ayudar?',
  PRODUCTS_AVAILABLE_TO_PURCHASE_ARE: `Los productos disponibles para comprar en este momento son {0}. 
    Para saber más sobre un producto, di 'cuéntame más sobre' seguido del nombre del producto. 
    Si tú estás listo para comprar, dime 'Comprar' seguido del nombre del producto. ¿Qué me dices?`,
  YOU_HAVE_ALREADY_BOUGHT_THE: '¡Buenas noticias! Ya has comprado',
  ENJOY_YOUR_X_PURCHASE: 'Disfruta la compra de {0}. ',
  SOMETHING_UNEXPECTED_BUYING: 'Algo inesperado pasó, pero gracias por tu interés en {0}.',
  ERROR_HANDLING_REQUEST: 'Hubo un error atendiendo tu petición. Por favor inténtalo de nuevo o contacta con nosotros para recibir ayuda.',
  BOUGHT_LIST: 'Ya has comprado los siguientes items:',
  HOW_CAN_I_HELP: '¿Cómo puedo ayudarte?',
  ASK_WHAT_CAN_I_BUY_OR_HELP: 'Di "¿Qué puedo comprar?". También puedes decir "ayuda". ¿Cómo puedo ayudarte?',
  YOU_HAVE_NOT_PURCHASED_ANYTHING: 'Tú no has comprado nada aún. Para saber más sobre los productos que puedes comprar, di "¿Qué puedo comprar?". También puedes decir "ayuda". ¿Qué dices?',
  IF_YOU_ARE_READY_TO_BUY_X_SAY: 'Si estás listo para comprar, di "Comprar {0}". ¿Qué dices?',
  SURE: 'Claro',
  TRY_ORDER_HISTORY: 'Di "histórico de compras" o "ayuda".',
  TRY_BUY_AND_PRODUCT_NAME: 'Di "Comprar" seguido del nombre del producto',

  // Dynamic entities (slots)
  DYNAMIC_ENTITIES_CLEANED: 'Entidades dinámicas borradas. ',
  DYNAMIC_ENTITIES_UPDATED: 'Entidades dinámicas actualizadas. ',
  HINT_DYNAMIC_ENTITY: 'Di "cuéntame un chiste de animales".',
  SLOT_VALUE_SAID: 'El valor del slot es "{0}"',
  DYNAMIC_ENTITIES_VALUES: [
    {
      id: 'animales',
      name: {
        value: 'animales',
        synonyms: ['animal', 'bichos'],
      },
    },
    {
      id: 'medicos',
      name: {
        value: 'médico',
        synonyms: ['médicos', 'médica', 'médicas'],
      },
    },
    {
      id: 'comida',
      name: {
        value: 'comida',
        synonyms: ['comidas', 'alimento', 'alimentos', 'comer'],
      },
    },
  ],
};
p.HELP = `Puedes decirme por ejemplo ${p.SAMPLES}. ¿Qué dices?`;
p.HINT_HOME = `Di ${p.SAMPLES}`;

module.exports = p;
