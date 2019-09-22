/* eslint-disable  no-console */
/* eslint-disable global-require */

const Alexa = require('ask-sdk-core');

const Settings = require('./settings.js');
const AplTemplates = require('./apl/aplTemplates.js');
const SessionState = require('./data/sessionState.js');

// GlobalHandlers: ErrorHandler, SessionEndedRequestHandler...
const GlobalHandlers = require('./handlers/globalHandlers.js');

let t = null; // strings. Initialized by myLocalizationInterceptor()
let langSkill = null; // current language ('es-ES', 'en-US', 'en', etc...)

const LaunchRequestHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'LaunchRequest';
  },
  async handle(handlerInput) {
    SessionState.setCurrentState(handlerInput, SessionState.STATES.LAUNCH);

    const speechText = `${t.WELCOME_TO} ${t.SKILL_NAME}. ${t.HELP}`;

    return AplTemplates.getAplTextAndHintOrVoice(handlerInput, t.SKILL_NAME, speechText,
      t.HINT_HOME, speechText);
  },
};

const HelloWorldIntentHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && handlerInput.requestEnvelope.request.intent.name === 'HelloWorldIntent';
  },
  handle(handlerInput) {
    SessionState.setCurrentState(handlerInput, SessionState.STATES.HELLO_WORLD);

    const speechText = t.HELLO_WORLD;

    return AplTemplates.getAplTextAndHintOrVoice(handlerInput, t.SKILL_NAME, speechText,
      t.HINT_HOME, speechText);
  },
};

const CheckPermissionsIntentHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && handlerInput.requestEnvelope.request.intent.name === 'CheckPermisionsIntent';
  },
  handle(handlerInput) {
    const PermissionHandler = require('./handlers/permissionHandler.js');
    return PermissionHandler.PermissionRequest(handlerInput, t);
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
    speechText = t.SESSION_SAVED.replace('{0}', valor);

    return AplTemplates.getAplTextAndHintOrVoice(handlerInput, t.SKILL_NAME, speechText,
      t.HINT_HOME, speechText);
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
      speechText = t.SESSION_NOT_SAVED_YET;
    } else {
      speechText = t.SESSION_LOADED.replace('{0}', valor);
    }

    return AplTemplates.getAplTextAndHintOrVoice(handlerInput, t.SKILL_NAME, speechText,
      t.HINT_HOME, speechText);
  },
};

const HelpIntentHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && handlerInput.requestEnvelope.request.intent.name === 'AMAZON.HelpIntent';
  },
  handle(handlerInput) {
    SessionState.setCurrentState(handlerInput, SessionState.STATES.HELP);

    const speechText = t.HELP;

    const MockList = require('./data/mocks/mockList.js');

    return AplTemplates.getAplListOrVoice(handlerInput, t.SKILL_NAME, MockList.list,
      t.HINT_HOME, speechText);
  },
};

const CancelAndStopIntentHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && (handlerInput.requestEnvelope.request.intent.name === 'AMAZON.CancelIntent'
        || handlerInput.requestEnvelope.request.intent.name === 'AMAZON.StopIntent');
  },
  handle(handlerInput) {
    return GlobalHandlers.CancelAndStop(handlerInput, t);
  },
};

const EventHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'Alexa.Presentation.APL.UserEvent';
  },
  handle(handlerInput) {
    const AplUserEventHandler = require('./handlers/aplUserEventHandler.js');
    return AplUserEventHandler.AplUserEvent(handlerInput, t);
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
    return ApiHandlers.UseApiRequest(handlerInput, t);
  },
};

// Initialize 't' and 'langSkill' with user language or default language.
const myLocalizationInterceptor = {
  process(handlerInput) {
    const langUser = handlerInput.requestEnvelope.request.locale;

    if (langUser) {
      try {
        t = require(`./strings/${langUser}.js`); // eslint-disable-line import/no-dynamic-require
        langSkill = langUser;
        return;
      } catch (e) {
        // console.log(`Error reading strings. langUser: ${langUser}`);
      }

      const lang = langUser.split('-')[0];
      try {
        t = require(`./strings/${lang}.js`); // eslint-disable-line import/no-dynamic-require
        langSkill = lang;
        return;
      } catch (e) {
        // console.log(`Error reading strings. lang: ${lang}`);
      }
    }

    // default lang
    langSkill = Settings.DEFAULT_LANGUAGE;
    t = require(`./strings/${langSkill}.js`); // eslint-disable-line import/no-dynamic-require
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
    EventHandler, // taps en pantalla APL
    CancelAndStopIntentHandler,
    GlobalHandlers.SessionEndedRequestHandler,
    UseApiRequestHandler, // API sample
    GlobalHandlers.IntentReflectorHandler, // last
  )
  .addRequestInterceptors(myLocalizationInterceptor)
  .addErrorHandlers(GlobalHandlers.ErrorHandler)
  .withApiClient(new Alexa.DefaultApiClient()) // API to get user permissions
  .lambda();
