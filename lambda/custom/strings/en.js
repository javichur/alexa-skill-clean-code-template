const p = {
  SKILL_NAME: 'The Template',
  WELCOME_TO: 'Welcome to the',
  SAMPLES: '"hello", "help", "check permissions" (first activate them for your skill in the Alexa developer console), "use api", "load session", "save session", "load database", "save database", a color, "chaining intents" (it will jump to the color intent with green), "load the dynamic slot values", "clear dynamic slot values", "tell me a joke about animals" (animals is a dynamic value of the slot), "are you a car?" (first activate the location permission for your skill in the Alexa developer console) or "bye"',
  HELLO_WORLD: 'Hello World',
  GOODBYE: 'Goodbye!',
  ASK_PERMISSIONS: 'Check your Alexa mobile app to give me the permissions. See you later!',
  THANKS_NAME_PERMISSIONS: 'Thanks you {0}, you have accepted the permissions.',
  SESSION_NOT_SAVED_YET: 'You haven\'t saved a value in the skill session yet. Say "save session".',
  SESSION_LOADED: 'I just read the value {0} from the skill session.',
  SESSION_SAVED: 'I just saved the {0} value to the skill session. Say "load session".',
  COLOR_SAID: 'You just said the color {0}',
  FALLBACK: 'I don\'t understand what you mean in this context. ',

  SPEAK_POST_PURCHASE: 'Try "help" for more info', // edit this
  SPEAK_POST_REFUND: 'Try "help" for more info', // edit this

  /* purchase strings */
  I_RECOMMEND_THIS: 'I recommend this for you',
  DO_YOU_WANT_TO_LEARN_MORE: 'Do you want to learn more?',
  NO_PRODUCTS_TO_OFFER: 'There are no products to offer to you right now. Sorry about that',
  I_DIDNT_CATCH: 'I didn\'t catch that. What can I help you with?',
  PRODUCTS_AVAILABLE_TO_PURCHASE_ARE: `Products available for purchase at this time are {0}. 
    To learn more about a product, say 'Tell me more about' followed by the product name. 
    If you are ready to buy, say, 'Buy' followed by the product name. So what can I help you with?`,
  YOU_HAVE_ALREADY_BOUGHT_THE: 'Good News! You\'ve already bought the',
  ENJOY_YOUR_X_PURCHASE: 'Enjoy your {0} purchase. ',
  SOMETHING_UNEXPECTED_BUYING: 'Something unexpected happened, but thanks for your interest in the {0}.',
  ERROR_HANDLING_REQUEST: 'There was an error handling your request. Please try again or contact us for help.',
  BOUGHT_LIST: 'You have bought the following items:',
  HOW_CAN_I_HELP: 'How can I help?',
  ASK_WHAT_CAN_I_BUY_OR_HELP: 'Say "what can I buy"? Also you can say "Help". How can I help?',
  YOU_HAVE_NOT_PURCHASED_ANYTHING: 'You haven\'t purchased anything yet. To learn more about the products you can buy, Say "what can I buy"? Also you can say "Help". How can I help?',
  IF_YOU_ARE_READY_TO_BUY_X_SAY: 'If you are ready to buy, say "Buy {0}". So what can I help you with?',
  SURE: 'Sure',
  TRY_ORDER_HISTORY: 'Try "Order history" or "Help".',
  TRY_BUY_AND_PRODUCT_NAME: 'Try "Buy" followed by the product name',

  DYNAMIC_ENTITIES_CLEANED: 'Dynamic entities cleaned. ',
  DYNAMIC_ENTITIES_UPDATED: 'Dynamic entities updated. ',
  HINT_DYNAMIC_ENTITY: 'Try "tell me a joke about animals".',
  SLOT_VALUE_SAID: 'The slot value is "{0}"',
  DYNAMIC_ENTITIES_VALUES: [
    {
      id: 'animales',
      name: {
        value: 'animals',
        synonyms: ['animal', 'bugs'],
      },
    },
    {
      id: 'medicos',
      name: {
        value: 'doctor',
        synonyms: ['doctors', 'medical'],
      },
    },
    {
      id: 'comida',
      name: {
        value: 'food',
        synonyms: ['foods', 'eat', 'meal', 'lunch'],
      },
    },
  ],
};
p.HELP = `You can say ${p.SAMPLES}`;
p.HINT_HOME = `Say ${p.SAMPLES}`;

module.exports = p;
