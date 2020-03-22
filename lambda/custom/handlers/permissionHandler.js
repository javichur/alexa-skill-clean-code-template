/* eslint-disable  no-console */
/* eslint-disable global-require */
const AplTemplates = require('../apl/aplTemplates.js');
const Settings = require('../settings.js');

module.exports = {

  // Ask permissions. You must add permissions in "skill.json" first.
  AskPermissionsPromptInAlexaApp(handlerInput) {
    return handlerInput.responseBuilder
      .speak(handlerInput.t.ASK_PERMISSIONS)
      .withAskForPermissionsConsentCard(Settings.PERMISSIONS)
      .withShouldEndSession(true) // required to end session with APL support.
      .getResponse();
  },

  /**
   * Comprueba si el usuario ha aceptado los permisos. Si no, le pide que abra la app Alexa
   * para aceptarlos.
   * Importante: Añade los permisos que quieras solicitar en "skill.json" antes de desplegar.
   * Note: "handlerInput.t" strings are initialized in the myLocalizationInterceptor.
   * @param {*} handlerInput
   * @returns responseBuilder
   */
  CheckPermissionsIntentHandler: {
    canHandle(handlerInput) {
      return handlerInput.requestEnvelope.request.type === 'IntentRequest'
        && handlerInput.requestEnvelope.request.intent.name === 'CheckPermisionsIntent';
    },
    async handle(handlerInput) {
      const { requestEnvelope, serviceClientFactory } = handlerInput;

      const consentToken = requestEnvelope.context.System.apiAccessToken;
      if (!consentToken) {
        return this.AskPermissionsPromptInAlexaApp(handlerInput);
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
          speechText = handlerInput.t.ASK_PERMISSIONS;
        } else {
          speechText = handlerInput.t.THANKS_NAME_PERMISSIONS.replace('{0}', name);
          // TODO: save the user info.
        }
      } catch (error) {
        if (error.name !== 'ServiceError') {
          speechText = `Error: ${error.name}`;
        } else {
          return this.AskPermissionsPromptInAlexaApp(handlerInput);
        }
      }

      return AplTemplates.getAplTextAndHintOrVoice(handlerInput, handlerInput.t.SKILL_NAME,
        speechText, handlerInput.t.HINT_HOME, speechText);
    },
  },
};
