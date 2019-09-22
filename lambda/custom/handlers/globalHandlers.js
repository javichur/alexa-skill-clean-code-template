/* eslint-disable  no-console */
module.exports = {

  SessionEndedRequestHandler: {
    canHandle(handlerInput) {
      return handlerInput.requestEnvelope.request.type === 'SessionEndedRequest';
    },
    handle(handlerInput) {
      console.log(`Session ended with reason: ${handlerInput.requestEnvelope.request.reason}`);

      return handlerInput.responseBuilder.getResponse();
    },
  },

  ErrorHandler: {
    canHandle() {
      return true;
    },
    handle(handlerInput, error) {
      console.log(`Error handled: ${error.message}`);
      const speechText = 'Sorry, I can\'t understand the command. Please say again.';

      return handlerInput.responseBuilder
        .speak(speechText)
        .reprompt(speechText)
        .getResponse();
    },
  },

  // The intent reflector is used for interaction model testing and debugging.
  // It will simply repeat the intent the user said. You can create custom handlers
  // for your intents by defining them above, then also adding them to the request
  // handler chain below.
  IntentReflectorHandler: {
    canHandle(handlerInput) {
      return handlerInput.requestEnvelope.request.type === 'IntentRequest';
    },
    handle(handlerInput) {
      const intentName = handlerInput.requestEnvelope.request.intent.name;
      const speechText = `You just triggered ${intentName}.`;

      return handlerInput.responseBuilder
        .speak(speechText)
        // .reprompt('add a reprompt if you want to keep the session open for the user to respond')
        .getResponse();
    },
  },
};
