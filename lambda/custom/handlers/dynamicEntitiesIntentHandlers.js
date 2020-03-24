/* eslint-disable  no-console */
const Alexa = require('ask-sdk-core');
const settings = require('../settings');

module.exports = {

  UpdateJokeCategoriesIntentHandler: {
    canHandle(handlerInput) {
      return (handlerInput.requestEnvelope.request.type === 'IntentRequest'
        && handlerInput.requestEnvelope.request.intent.name === 'UpdateJokeCategoriesIntent');
    },
    handle(handlerInput) {
      const replaceEntityDirective = {
        type: 'Dialog.UpdateDynamicEntities',
        updateBehavior: 'REPLACE',
        types: [
          {
            name: settings.DYNAMIC_SLOT_NAME,
            values: handlerInput.t.DYNAMIC_ENTITIES_VALUES,
          },
        ],
      };

      return handlerInput.responseBuilder
        .speak(handlerInput.t.DYNAMIC_ENTITIES_UPDATED + handlerInput.t.HINT_DYNAMIC_ENTITY)
        .reprompt(handlerInput.t.HELP)
        .addDirective(replaceEntityDirective)
        .getResponse();
    },
  },


  ClearDynamicEntitiesIntentHandler: {
    canHandle(handlerInput) {
      return (handlerInput.requestEnvelope.request.type === 'IntentRequest'
        && handlerInput.requestEnvelope.request.intent.name === 'ClearDynamicEntitiesIntent');
    },
    handle(handlerInput) {
      /* The uploaded dynamic entities time out after 30 minutes,
      so they will persist if the customer re-invokes the skill
      before the end of this 30-minute period. However, a best
      practice is to re-ingest the dynamic entity catalog in an
      intent response every session, even if the dynamic entities
      have not yet expired. */

      const clearEntitiesDirective = {
        type: 'Dialog.UpdateDynamicEntities',
        updateBehavior: 'CLEAR',
      };

      return handlerInput.responseBuilder
        .speak(handlerInput.t.DYNAMIC_ENTITIES_CLEANED + handlerInput.t.HELP)
        .reprompt(handlerInput.t.HELP)
        .addDirective(clearEntitiesDirective)
        .getResponse();
    },
  },


  TellJokeIntentHandler: {
    canHandle(handlerInput) {
      return (handlerInput.requestEnvelope.request.type === 'IntentRequest'
        && handlerInput.requestEnvelope.request.intent.name === 'TellJokeIntent');
    },
    handle(handlerInput) {
      const value = Alexa.getSlotValue(handlerInput.requestEnvelope, 'dynamicSlot');
      const speechText = handlerInput.t.SLOT_VALUE_SAID.replace('{0}', value);

      return handlerInput.responseBuilder
        .speak(speechText)
        .reprompt(handlerInput.t.HELP)
        .getResponse();
    },
  },
};
