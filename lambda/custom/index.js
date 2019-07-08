/* eslint-disable  func-names */
/* eslint-disable  no-console */

const Alexa = require('ask-sdk-core');

let t = null; // strings. Initialized by myLocalizationInterceptor()
let langSkill = 'en'; // current lang. Initialized by myLocalizationInterceptor()


const LaunchRequestHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'LaunchRequest';
  },
  handle(handlerInput) {
    const speechText = `Welcome to the ${t.SKILL_NAME}, you can say hello!`;

    return handlerInput.responseBuilder
      .speak(speechText)
      .reprompt(speechText)
      .withSimpleCard(t.HELLO_WORLD, speechText)
      .getResponse();
  },
};

const HelloWorldIntentHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && handlerInput.requestEnvelope.request.intent.name === 'HelloWorldIntent';
  },
  handle(handlerInput) {
    const speechText = t.HELLO_WORLD;

    return handlerInput.responseBuilder
      .speak(speechText)
      .withSimpleCard(t.HELLO_WORLD, speechText)
      .getResponse();
  },
};

const HelpIntentHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && handlerInput.requestEnvelope.request.intent.name === 'AMAZON.HelpIntent';
  },
  handle(handlerInput) {
    const speechText = t.HELP;

    return handlerInput.responseBuilder
      .speak(speechText)
      .reprompt(speechText)
      .withSimpleCard(t.HELLO_WORLD, speechText)
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
    const speechText = t.GOODBYE;

    return handlerInput.responseBuilder
      .speak(speechText)
      .withSimpleCard(t.HELLO_WORLD, speechText)
      .getResponse();
  },
};

const SessionEndedRequestHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'SessionEndedRequest';
  },
  handle(handlerInput) {
    console.log(`Session ended with reason: ${handlerInput.requestEnvelope.request.reason}`);

    return handlerInput.responseBuilder.getResponse();
  },
};

const ErrorHandler = {
  canHandle() {
    return true;
  },
  handle(handlerInput, error) {
    console.log(`Error handled: ${error.message}`);

    return handlerInput.responseBuilder
      .speak('Sorry, I can\'t understand the command. Please say again.')
      .reprompt('Sorry, I can\'t understand the command. Please say again.')
      .getResponse();
  },
};

// The intent reflector is used for interaction model testing and debugging.
// It will simply repeat the intent the user said. You can create custom handlers
// for your intents by defining them above, then also adding them to the request
// handler chain below.
const IntentReflectorHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest';
  },
  handle(handlerInput) {
    const intentName = handlerInput.requestEnvelope.request.intent.name;
    const speechText = `You just triggered ${intentName}. Language is ${langSkill}`;

    return handlerInput.responseBuilder
      .speak(speechText)
      // .reprompt('add a reprompt if you want to keep the session open for the user to respond')
      .getResponse();
  },
};

const myLocalizationInterceptor = {
  process(handlerInput) {
    const langUser = handlerInput.requestEnvelope.request.locale;

    if (langUser) {
      const setEs = new Set(['es', 'es-ES', 'es-MX', 'es-US']);
      // const setEn = new Set(['en', 'en-US', 'en-GB', 'en-CA', 'en-IN', 'en-AU']);

      if (setEs.has(langUser)) {
        langSkill = 'es';
        t = require('./strings/es.js'); // eslint-disable-line global-require
        return;
      }
    }

    // default lang
    langSkill = 'en';
    t = require('./strings/en.js'); // eslint-disable-line global-require
  },
};


const skillBuilder = Alexa.SkillBuilders.custom();

exports.handler = skillBuilder
  .addRequestHandlers(
    LaunchRequestHandler,
    HelloWorldIntentHandler,
    HelpIntentHandler,
    CancelAndStopIntentHandler,
    SessionEndedRequestHandler,
    IntentReflectorHandler, // last
  )
  .addRequestInterceptors(myLocalizationInterceptor)
  .addErrorHandlers(ErrorHandler)
  .lambda();
