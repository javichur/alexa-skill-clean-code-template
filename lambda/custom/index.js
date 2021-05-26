/* eslint-disable  no-console */
/* eslint-disable global-require */
const Alexa = require('ask-sdk-core');
const Settings = require('./settings.js');
const AplTemplates = require('./apl/aplTemplates.js');
const SessionState = require('./data/sessionState.js');
const SessionHandlers = require('./handlers/sessionHandlers.js');
const DynamoDbHandlers = require('./handlers/dynamoDbHandlers.js');
const AplUserEventHandler = require('./handlers/aplUserEventHandler.js');
const GlobalHandlers = require('./handlers/globalHandlers.js'); // ErrorHandler, SessionEnded...
const PermissionHandler = require('./handlers/permissionHandler.js');
const ChainingIntentHandler = require('./handlers/chainingIntentHandler.js');
const ApiHandlers = require('./handlers/apiHandlers.js');
const DynamicEntitiesHandlers = require('./handlers/dynamicEntitiesIntentHandlers.js');
const AutomotiveHandlers = require('./handlers/automotiveHandlers.js');
const PlayVideoHandler = require('./handlers/playVideoHandler.js');

function initializeSkill(handlerInput) {
  SessionState.setCurrentState(handlerInput, SessionState.STATES.LAUNCH);
}

/* in-skill purchases */
const PurchaseHandlers = require('./handlers/purchaseHandlers.js');

const initPurchaseHandlers = {
  process(handlerInput) {
    PurchaseHandlers.methodPostPurchase = initializeSkill; // reload session after purchase, etc.
    PurchaseHandlers.methodPostRefund = initializeSkill; // reload session after refund, etc.
    PurchaseHandlers.speakPostPurchase = handlerInput.t.SPEAK_POST_PURCHASE;
    PurchaseHandlers.speakPostRefund = handlerInput.t.SPEAK_POST_REFUND;
  },
};
/* end in-skill purchases */

function simpleApl(handlerInput, speechText) {
  return AplTemplates.getAplTextAndHintOrVoice(handlerInput, handlerInput.t.SKILL_NAME,
    speechText, handlerInput.t.HINT_HOME, speechText);
}

const LaunchRequestHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'LaunchRequest';
  },
  async handle(handlerInput) {
    initializeSkill(handlerInput);

    const speechText = `${handlerInput.t.WELCOME_TO} ${handlerInput.t.SKILL_NAME}. 
      ${handlerInput.t.HELP}`;

    return simpleApl(handlerInput, speechText);
  },
};

const HelloWorldIntentHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && handlerInput.requestEnvelope.request.intent.name === 'HelloWorldIntent';
  },
  handle(handlerInput) {
    SessionState.setCurrentState(handlerInput, SessionState.STATES.HELLO_WORLD);

    return simpleApl(handlerInput, handlerInput.t.HELLO_WORLD);
  },
};


const ColorIntentHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && handlerInput.requestEnvelope.request.intent.name === 'ColorIntent';
  },
  handle(handlerInput) {
    const color = Alexa.getSlotValue(handlerInput.requestEnvelope, 'colorSlot');
    const speechText = handlerInput.t.COLOR_SAID.replace('{0}', color);

    return simpleApl(handlerInput, speechText);
  },
};


const HelpIntentHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && handlerInput.requestEnvelope.request.intent.name === 'AMAZON.HelpIntent';
  },
  handle(handlerInput) {
    SessionState.setCurrentState(handlerInput, SessionState.STATES.HELP);

    const speechText = handlerInput.t.HELP;
    const MockList = require('./data/mocks/mockList.js');

    return AplTemplates.getAplListOrVoice(handlerInput, handlerInput.t.SKILL_NAME, MockList.list,
      handlerInput.t.HINT_HOME, speechText);
  },
};


// Initialize 'handlerInput.t' and 'LOC' with user language or default language.
const myLocalizationInterceptor = {
  process(handlerInput) {
    const langUser = handlerInput.requestEnvelope.request.locale;

    if (langUser) {
      try {
        handlerInput.t = require(`./strings/${langUser}.js`); // eslint-disable-line import/no-dynamic-require, no-param-reassign
        return;
      } catch (e) { /* console.log(`Error reading strings. langUser: ${langUser}`); */ }

      const lang = langUser.split('-')[0];
      try {
        handlerInput.t = require(`./strings/${lang}.js`); // eslint-disable-line import/no-dynamic-require, no-param-reassign
        return;
      } catch (e) { /* console.log(`Error reading strings. lang: ${lang}`); */ }
    }

    // default lang
    handlerInput.t = require(`./strings/${Settings.DEFAULT_LANGUAGE}.js`); // eslint-disable-line import/no-dynamic-require, no-param-reassign
  },
};


const skillBuilder = Alexa.SkillBuilders.custom();
exports.handler = skillBuilder
  .addRequestHandlers(
    LaunchRequestHandler,
    HelloWorldIntentHandler,
    ColorIntentHandler,
    HelpIntentHandler,
    AplUserEventHandler.EventHandler, // taps en pantalla APL (ver APL list en HelpIntentHandler)
    PermissionHandler.CheckPermissionsIntentHandler,
    AutomotiveHandlers.AreYouACarIntentHandler,

    SessionHandlers.SaveSessionIntentHandler, // sample session
    SessionHandlers.LoadSessionIntentHandler,
    DynamoDbHandlers.SaveDynamoDBIntentHandler, // sample dynamodb
    DynamoDbHandlers.LoadDynamoDBIntentHandler,

    ApiHandlers.UseApiRequestHandler, // API sample

    PurchaseHandlers.WhatCanIBuyIntentHandler, // purchase handlers
    PurchaseHandlers.TellMeMoreAboutProductIntentHandler,
    PurchaseHandlers.BuyIntentHandler,
    PurchaseHandlers.BuyResponseHandler,
    PurchaseHandlers.PurchaseHistoryIntentHandler,
    PurchaseHandlers.RefundProductIntentHandler,
    PurchaseHandlers.CancelProductResponseHandler,

    ChainingIntentHandler.ChainingIntentHandler, // chaining to color intent

    DynamicEntitiesHandlers.UpdateJokeCategoriesIntentHandler, // dynamic entity sample
    DynamicEntitiesHandlers.ClearDynamicEntitiesIntentHandler,
    DynamicEntitiesHandlers.TellJokeIntentHandler,

    PlayVideoHandler.PlayVideoIntentHandler,

    GlobalHandlers.CancelAndStopIntentHandler,
    GlobalHandlers.FallbackIntentHandler, // to Respond Gracefully to Unexpected Customer Requests
    GlobalHandlers.SessionEndedRequestHandler,
    GlobalHandlers.IntentReflectorHandler, // last
  )
  .addRequestInterceptors(myLocalizationInterceptor, initPurchaseHandlers) // lang & purchase
  .addErrorHandlers(GlobalHandlers.ErrorHandler)
  .withApiClient(new Alexa.DefaultApiClient()) // API to get user permissions & in-skill purchases
  .lambda();
