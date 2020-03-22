/* eslint-disable  no-console */
/* eslint-disable global-require */
const AplTemplates = require('../apl/aplTemplates.js');
const SessionState = require('../data/sessionState.js');

module.exports = {
  SaveSessionIntentHandler: {
    canHandle(handlerInput) {
      return handlerInput.requestEnvelope.request.type === 'IntentRequest'
        && handlerInput.requestEnvelope.request.intent.name === 'SaveSessionIntent';
    },
    handle(handlerInput) {
      let speechText = '';
      const valor = Math.floor((Math.random() * 10) + 1);
      SessionState.setTestAttribute(handlerInput, valor);
      speechText = handlerInput.t.SESSION_SAVED.replace('{0}', valor);

      return AplTemplates.getAplTextAndHintOrVoice(handlerInput, handlerInput.t.SKILL_NAME,
        speechText, handlerInput.t.HINT_HOME, speechText);
    },
  },


  LoadSessionIntentHandler: {
    canHandle(handlerInput) {
      return handlerInput.requestEnvelope.request.type === 'IntentRequest'
        && handlerInput.requestEnvelope.request.intent.name === 'LoadSessionIntent';
    },
    handle(handlerInput) {
      let speechText = '';
      const valor = SessionState.getTestAttribute(handlerInput);
      if (!valor) {
        speechText = handlerInput.t.SESSION_NOT_SAVED_YET;
      } else {
        speechText = handlerInput.t.SESSION_LOADED.replace('{0}', valor);
      }

      return AplTemplates.getAplTextAndHintOrVoice(handlerInput, handlerInput.t.SKILL_NAME,
        speechText, handlerInput.t.HINT_HOME, speechText);
    },
  },
};
