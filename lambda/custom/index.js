/* eslint-disable  no-console */
/* eslint-disable global-require */
const Alexa = require('ask-sdk-core');
const Settings = require('./settings.js');
const AplTemplates = require('./apl/aplTemplates.js');
const SessionState = require('./data/sessionState.js');
const GlobalHandlers = require('./handlers/globalHandlers.js'); // ErrorHandler, SessionEnded...
const ChainingIntentHandler = require('./handlers/chainingIntentHandler.js');

const LOC = { // Se inicializa en myLocalizationInterceptor()
  t: null, // cadenas de texto localizadas.
  langSkill: null, // current language ('es-ES', 'en-US', 'en', 'es'...)
};

function initializeSkill(handlerInput) {
  SessionState.setCurrentState(handlerInput, SessionState.STATES.LAUNCH);
}

/* in-skill purchases */
const PurchaseHandlers = require('./handlers/purchaseHandlers.js');

const initPurchaseHandlers = {
  process(handlerInput) {
    PurchaseHandlers.methodPostPurchase = initializeSkill; // reload session after purchase, etc.
    PurchaseHandlers.methodPostRefund = initializeSkill; // reload session after refund, etc.
    PurchaseHandlers.LOC = LOC; // strings
    PurchaseHandlers.speakPostPurchase = LOC.t.SPEAK_POST_PURCHASE;
    PurchaseHandlers.speakPostRefund = LOC.t.SPEAK_POST_REFUND;
  },
};
/* end in-skill purchases */


const LaunchRequestHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'LaunchRequest';
  },
  async handle(handlerInput) {
    initializeSkill(handlerInput);

    const speechText = `${LOC.t.WELCOME_TO} ${LOC.t.SKILL_NAME}. ${LOC.t.HELP}`;

    return AplTemplates.getAplTextAndHintOrVoice(handlerInput, LOC.t.SKILL_NAME, speechText,
      LOC.t.HINT_HOME, speechText);
  },
};

const HelloWorldIntentHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && handlerInput.requestEnvelope.request.intent.name === 'HelloWorldIntent';
  },
  handle(handlerInput) {
    SessionState.setCurrentState(handlerInput, SessionState.STATES.HELLO_WORLD);

    const speechText = LOC.t.HELLO_WORLD;

    return AplTemplates.getAplTextAndHintOrVoice(handlerInput, LOC.t.SKILL_NAME, speechText,
      LOC.t.HINT_HOME, speechText);
  },
};

/* Ejemplo de intent handler que sugiere la compra del in-skill purchase si no se
ha comprado ya antes y además el usuario puede comprarlo (purchasable)
const HelloWorldIntentHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && handlerInput.requestEnvelope.request.intent.name === 'HelloWorldIntent';
  },
  handle(handlerInput) {
    SessionState.setCurrentState(handlerInput, SessionState.STATES.HELLO_WORLD);

    // si no ha comprado la in-skill purchase... sugerir su compra cada X tiempo
    const random = 10;
    if (random >= Settings.NUM_FREE_ITEMS) {
      const isEntitled = await PurchaseHandlers.isEntitledByProductId(handlerInput,
        Settings.ID_PRODUCT_ISP);
      if (!isEntitled) {
        const isPurchasable = await PurchaseHandlers.isPurchasableByProductId(handlerInput,
          Settings.ID_PRODUCT_ISP);
        if (isPurchasable) {
          return PurchaseHandlers.makeUpsellByProductId(handlerInput, Settings.ID_PRODUCT_ISP);
        }
      }
    }

    const speechText = LOC.t.HELLO_WORLD;
    return AplTemplates.getAplTextAndHintOrVoice(handlerInput, LOC.t.SKILL_NAME, speechText,
      LOC.t.HINT_HOME, speechText);
  },
};
*/

const CheckPermissionsIntentHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && handlerInput.requestEnvelope.request.intent.name === 'CheckPermisionsIntent';
  },
  handle(handlerInput) {
    const PermissionHandler = require('./handlers/permissionHandler.js');
    return PermissionHandler.PermissionRequest(handlerInput, LOC.t);
  },
};

const SaveSessionIntentHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && handlerInput.requestEnvelope.request.intent.name === 'SaveSessionIntent';
  },
  handle(handlerInput) {
    let speechText = '';
    const valor = Math.floor((Math.random() * 10) + 1);
    SessionState.setTestAttribute(handlerInput, valor);
    speechText = LOC.t.SESSION_SAVED.replace('{0}', valor);

    return AplTemplates.getAplTextAndHintOrVoice(handlerInput, LOC.t.SKILL_NAME, speechText,
      LOC.t.HINT_HOME, speechText);
  },
};

const LoadSessionIntentHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && handlerInput.requestEnvelope.request.intent.name === 'LoadSessionIntent';
  },
  handle(handlerInput) {
    let speechText = '';
    const valor = SessionState.getTestAttribute(handlerInput);
    if (!valor) {
      speechText = LOC.t.SESSION_NOT_SAVED_YET;
    } else {
      speechText = LOC.t.SESSION_LOADED.replace('{0}', valor);
    }

    return AplTemplates.getAplTextAndHintOrVoice(handlerInput, LOC.t.SKILL_NAME, speechText,
      LOC.t.HINT_HOME, speechText);
  },
};

const SaveDynamoDBIntentHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && handlerInput.requestEnvelope.request.intent.name === 'SaveDynamoDBIntent';
  },
  async handle(handlerInput) {
    const dataHelper = require('./data/dataHelper.js');
    const { userId } = handlerInput.requestEnvelope.context.System.user;

    const attributes = { name: 'Bob', country: 'Spain', city: 'Valencia' };
    const speechText = await dataHelper.saveToDynamoDB(userId, attributes);

    return AplTemplates.getAplTextAndHintOrVoice(handlerInput, LOC.t.SKILL_NAME, speechText,
      LOC.t.HINT_HOME, speechText);
  },
};

const LoadDynamoDBIntentHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && handlerInput.requestEnvelope.request.intent.name === 'LoadDynamoDBIntent';
  },
  async handle(handlerInput) {
    const dataHelper = require('./data/dataHelper.js');
    const { userId } = handlerInput.requestEnvelope.context.System.user;

    const ret = await dataHelper.loadFromDynamoDB(userId);

    let speechText = '';
    if (!ret) {
      speechText = 'Error reading from database.';
    } else {
      speechText = ret.name;
    }

    return AplTemplates.getAplTextAndHintOrVoice(handlerInput, LOC.t.SKILL_NAME, speechText,
      LOC.t.HINT_HOME, speechText);
  },
};

const ColorIntentHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && handlerInput.requestEnvelope.request.intent.name === 'ColorIntent';
  },
  handle(handlerInput) {
    const color = Alexa.getSlotValue(handlerInput.requestEnvelope, 'colorSlot');
    const speechText = LOC.t.COLOR_SAID.replace('{0}', color);

    return AplTemplates.getAplTextAndHintOrVoice(handlerInput, LOC.t.SKILL_NAME, speechText,
      LOC.t.HINT_HOME, speechText);
  },
};

const HelpIntentHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && handlerInput.requestEnvelope.request.intent.name === 'AMAZON.HelpIntent';
  },
  handle(handlerInput) {
    SessionState.setCurrentState(handlerInput, SessionState.STATES.HELP);

    const speechText = LOC.t.HELP;
    const MockList = require('./data/mocks/mockList.js');

    return AplTemplates.getAplListOrVoice(handlerInput, LOC.t.SKILL_NAME, MockList.list,
      LOC.t.HINT_HOME, speechText);
  },
};

const FallbackIntentHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && handlerInput.requestEnvelope.request.intent.name === 'AMAZON.FallbackIntent';
  },
  handle(handlerInput) {
    const speakOutput = LOC.t.FALLBACK + LOC.t.HELP;

    return handlerInput.responseBuilder
      .speak(speakOutput)
      .reprompt(speakOutput)
      .getResponse();
  },
};

const CancelAndStopIntentHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && (handlerInput.requestEnvelope.request.intent.name === 'AMAZON.CancelIntent'
        || handlerInput.requestEnvelope.request.intent.name === 'AMAZON.StopIntent');
  },
  handle(handlerInput) {
    return handlerInput.responseBuilder
      .speak(LOC.t.GOODBYE)
      .withShouldEndSession(true) // required to end session with APL support.
      .getResponse();
  },
};

const EventHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'Alexa.Presentation.APL.UserEvent';
  },
  handle(handlerInput) {
    const AplUserEventHandler = require('./handlers/aplUserEventHandler.js');
    return AplUserEventHandler.AplUserEvent(handlerInput, LOC.t);
  },
};

/**
 * Sample: handler using API call.
 */
const UseApiRequestHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && handlerInput.requestEnvelope.request.intent.name === 'UseApiIntent';
  },
  async handle(handlerInput) {
    const ApiHandlers = require('./handlers/apiHandlers.js');
    return ApiHandlers.UseApiRequest(handlerInput, LOC.t);
  },
};

// Initialize 'LOC' with user language or default language.
const myLocalizationInterceptor = {
  process(handlerInput) {
    const langUser = handlerInput.requestEnvelope.request.locale;

    if (langUser) {
      try {
        LOC.t = require(`./strings/${langUser}.js`); // eslint-disable-line import/no-dynamic-require
        LOC.langSkill = langUser;
        return;
      } catch (e) {
        // console.log(`Error reading strings. langUser: ${langUser}`);
      }

      const lang = langUser.split('-')[0];
      try {
        LOC.t = require(`./strings/${lang}.js`); // eslint-disable-line import/no-dynamic-require
        LOC.langSkill = lang;
        return;
      } catch (e) {
        // console.log(`Error reading strings. lang: ${lang}`);
      }
    }

    // default lang
    LOC.langSkill = Settings.DEFAULT_LANGUAGE;
    LOC.t = require(`./strings/${LOC.langSkill}.js`); // eslint-disable-line import/no-dynamic-require
  },
};


const skillBuilder = Alexa.SkillBuilders.custom();
exports.handler = skillBuilder
  .addRequestHandlers(
    LaunchRequestHandler,
    HelloWorldIntentHandler,
    HelpIntentHandler,
    CheckPermissionsIntentHandler,
    SaveSessionIntentHandler,
    LoadSessionIntentHandler,
    SaveDynamoDBIntentHandler,
    LoadDynamoDBIntentHandler,
    ColorIntentHandler,
    EventHandler, // taps en pantalla APL
    CancelAndStopIntentHandler,
    FallbackIntentHandler, // to Respond Gracefully to Unexpected Customer Requests
    GlobalHandlers.SessionEndedRequestHandler,
    UseApiRequestHandler, // API sample

    PurchaseHandlers.WhatCanIBuyIntentHandler, // purchase handlers
    PurchaseHandlers.TellMeMoreAboutProductIntentHandler,
    PurchaseHandlers.BuyIntentHandler,
    PurchaseHandlers.BuyResponseHandler,
    PurchaseHandlers.PurchaseHistoryIntentHandler,
    PurchaseHandlers.RefundProductIntentHandler,
    PurchaseHandlers.CancelProductResponseHandler,

    ChainingIntentHandler.ChainingIntentHandler, // chaining to color intent

    GlobalHandlers.IntentReflectorHandler, // last
  )
  .addRequestInterceptors(myLocalizationInterceptor, initPurchaseHandlers) // lang & purchase
  .addErrorHandlers(GlobalHandlers.ErrorHandler)
  .withApiClient(new Alexa.DefaultApiClient()) // API to get user permissions and in-skill purchases
  .lambda();
