module.exports = {

  /**
   * Returns a response with APL (if compatible) or just voice response
   * @param {Object} handlerInput
   * @param {string} title
   * @param {string} text
   * @param {string} hint
   * @param {string} speechText
   * @param {string} img Url de la imagen de fondo. Puede ser null.
   * @param {bool} isStop indica si hay que cerrar sesión después (true) o no (false)
   */
  getAplTextAndHintOrVoiceOptionalStop(handlerInput, title, text, hint, speechText, img, isStop) {
    const ret = handlerInput.responseBuilder
      .speak(speechText);

    if (handlerInput.requestEnvelope.context.System.device.supportedInterfaces['Alexa.Presentation.APL']) {
      /* si hay soporte APL... */
      const docu = require('./documentTextAndHint.json'); // eslint-disable-line global-require
      const d = require('./myDataSourceTextAndHint'); // eslint-disable-line global-require

      d.data.title = title;
      d.data.text = text;
      d.data.hintText = hint;

      if (img !== null) {
        d.data.backgroundImageSmall = img;
        d.data.backgroundImage = img;
      }

      ret.addDirective({
        type: 'Alexa.Presentation.APL.RenderDocument',
        version: '1.0',
        document: docu,
        datasources: d,
      });
    } else {
      ret.withSimpleCard(title, speechText)
        .getResponse();
    }

    if (!isStop) {
      ret.reprompt(speechText + hint);
    } else {
      ret.withShouldEndSession(true);
    }

    return ret.getResponse();
  },


  /**
   * Returns a response with APL (if compatible) or just voice response
   * @param {Object} handlerInput
   * @param {string} title
   * @param {string} text
   * @param {string} hint
   * @param {string} speechText
   */
  getAplTextAndHintOrVoice(handlerInput, title, text, hint, speechText) {
    return this.getAplTextAndHintOrVoiceOptionalStop(handlerInput, title, text,
      hint, speechText, null, false);
  },

  getAplTextAndHintAndBackgroundOrVoice(handlerInput, title, text, hint, img, speechText) {
    return this.getAplTextAndHintOrVoiceOptionalStop(handlerInput, title, text,
      hint, speechText, img, false);
  },

  getAplListOrVoice(handlerInput, title, list, hint, speechText) {
    if (handlerInput.requestEnvelope.context.System.device.supportedInterfaces['Alexa.Presentation.APL']) {
      /* si hay soporte APL... */
      const docu = require('./documentListado.json'); // eslint-disable-line global-require
      const d = require('./myDataSourceListado'); // eslint-disable-line global-require

      d.listTemplate1Metadata.title = title;
      d.listTemplate1ListData.listItems = list;
      d.listTemplate1Metadata.hintText = hint;

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