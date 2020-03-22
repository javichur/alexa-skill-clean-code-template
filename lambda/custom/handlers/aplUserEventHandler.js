/* eslint-disable  no-console */
const AplTemplates = require('../apl/aplTemplates.js');

module.exports = {
  EventHandler: {
    canHandle(handlerInput) {
      return handlerInput.requestEnvelope.request.type === 'Alexa.Presentation.APL.UserEvent';
    },
    handle(handlerInput) {
      const args = handlerInput.requestEnvelope.request.arguments;
      const event = args[0];

      let speechText = '';
      switch (event) {
        case 'ListadoItemSelected':
          // TODO. id selected = args[1]
          speechText = `has pulsado item número ${args[1]}.`;
          return AplTemplates.getAplTextAndHintOrVoice(handlerInput, handlerInput.t.SKILL_NAME,
            speechText, handlerInput.t.HINT_HOME, speechText);

        case 'BackFromListado':
          // TODO
          speechText = 'has pulsado atrás';
          return AplTemplates.getAplTextAndHintOrVoice(handlerInput, handlerInput.t.SKILL_NAME,
            speechText, handlerInput.t.HINT_HOME, speechText);

        default:
          // Caso imposible.
          return null;
      }
    },
  },
};
