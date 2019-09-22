/* eslint-disable  no-console */
/* eslint-disable global-require */
const AplTemplates = require('../apl/aplTemplates.js');
const Settings = require('../settings.js');

module.exports = {

  // ask permissions. You must add permissions in "skill.json" first.
  AskPermissionsPromptInAlexaApp(handlerInput, t) {
    return handlerInput.responseBuilder
      .speak(t.ASK_PERMISSIONS)
      .withAskForPermissionsConsentCard(Settings.PERMISSIONS)
      .withShouldEndSession(true) // required to end session with APL support.
      .getResponse();
  },

  /**
   * Comprueba si el usuario ha aceptado los permisos. Si no, le pide que abra la app Alexa
   * para aceptarlos.
   * Importante: Añade los permisos que quieras solicitar en "skill.json" antes de desplegar.
   *
   * @param {*} handlerInput
   * @param {*} t localized strings.
   * @returns responseBuilder
   */
  async PermissionRequest(handlerInput, t) {
    const { requestEnvelope, serviceClientFactory } = handlerInput;

    const consentToken = requestEnvelope.context.System.apiAccessToken;
    if (!consentToken) {
      return this.AskPermissionsPromptInAlexaApp(handlerInput, t);
    }
    let name = null;
    let email = null;
    let number = null;
    let speechText = '';

    try {
      const client = serviceClientFactory.getUpsServiceClient();

      name = await client.getProfileGivenName();
      email = await client.getProfileEmail();
      number = await client.getProfileMobileNumber();

      if (!name || !email || !number) {
        speechText = t.ASK_PERMISSIONS;
      } else {
        speechText = t.THANKS_NAME_PERMISSIONS.replace('{0}', name);
        // TODO: save the user info.
      }
    } catch (error) {
      if (error.name !== 'ServiceError') {
        speechText = `Error: ${error.name}`;
      } else {
        return this.AskPermissionsPromptInAlexaApp(handlerInput, t);
      }
    }

    return AplTemplates.getAplTextAndHintOrVoice(handlerInput, t.SKILL_NAME, speechText,
      t.HINT_HOME, speechText);
  },
};
