module.exports = {
  /**
   * Returns a response with APL (if compatible) or just voice response
   * @param {Object} handlerInput
   * @param {string} title
   * @param {string} text
   * @param {string} hint
   * @param {string} speechText
   */
  getAplTextAndHintOrVoice(handlerInput, title, text, hint, speechText) {
    if (handlerInput.requestEnvelope.context.System.device.supportedInterfaces['Alexa.Presentation.APL']) {
      /* si hay soporte APL... */
      const docu = require('./documentTextAndHint.json'); // eslint-disable-line global-require
      const d = require('./myDataSourceTextAndHint'); // eslint-disable-line global-require

      d.data.title = title;
      d.data.text = text;
      d.data.hintText = hint;

      return handlerInput.responseBuilder
        .speak(speechText)
        .reprompt(speechText)
        .addDirective({
          type: 'Alexa.Presentation.APL.RenderDocument',
          version: '1.0',
          document: docu,
          datasources: d,
        })
        .getResponse();
    }

    return handlerInput.responseBuilder
      .speak(speechText)
      .reprompt(speechText)
      .withSimpleCard(title, speechText)
      .getResponse();
  },
};
