/* eslint-disable  no-console */
/* eslint-disable global-require */
const AplTemplates = require('../apl/aplTemplates.js');

module.exports = {

  async UseApiRequest(handlerInput, t) {
    const API = require('../data/api.js');
    const respuestaApi = await API.getInfoAPI();

    const ret = (!respuestaApi) ? 'nada' : `${respuestaApi.length} caracteres`;
    const speechText = `La API devolvió ${ret}.`;

    return AplTemplates.getAplTextAndHintOrVoice(handlerInput, t.SKILL_NAME, speechText,
      t.HINT_HOME, speechText);
  },
};
