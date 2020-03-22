/* eslint-disable  no-console */
/* eslint-disable global-require */
const AplTemplates = require('../apl/aplTemplates.js');

module.exports = {

  /**
   * Sample: handler using API call.
   * Note: "handlerInput.t" strings are initialized in the myLocalizationInterceptor.
   */
  UseApiRequestHandler: {
    canHandle(handlerInput) {
      return handlerInput.requestEnvelope.request.type === 'IntentRequest'
        && handlerInput.requestEnvelope.request.intent.name === 'UseApiIntent';
    },
    async handle(handlerInput) {
      const API = require('../data/api.js');
      const respuestaApi = await API.getInfoAPI();

      const ret = (!respuestaApi) ? 'nada' : `${respuestaApi.length} caracteres`;
      const speechText = `La API devolvió ${ret}.`;

      return AplTemplates.getAplTextAndHintOrVoice(handlerInput, handlerInput.t.SKILL_NAME,
        speechText, handlerInput.t.HINT_HOME, speechText);
    },
  },
};
