/* eslint-disable  no-console */
/* eslint-disable global-require */
const AplTemplates = require('../apl/aplTemplates.js');

module.exports = {
  SaveDynamoDBIntentHandler: {
    canHandle(handlerInput) {
      return handlerInput.requestEnvelope.request.type === 'IntentRequest'
        && handlerInput.requestEnvelope.request.intent.name === 'SaveDynamoDBIntent';
    },
    async handle(handlerInput) {
      const dataHelper = require('../data/dataHelper.js');
      const { userId } = handlerInput.requestEnvelope.context.System.user;

      const attributes = { name: 'Bob', country: 'Spain', city: 'Valencia' };
      const speechText = await dataHelper.saveToDynamoDB(userId, attributes);

      return AplTemplates.getAplTextAndHintOrVoice(handlerInput, handlerInput.t.SKILL_NAME,
        speechText, handlerInput.t.HINT_HOME, speechText);
    },
  },

  LoadDynamoDBIntentHandler: {
    canHandle(handlerInput) {
      return handlerInput.requestEnvelope.request.type === 'IntentRequest'
        && handlerInput.requestEnvelope.request.intent.name === 'LoadDynamoDBIntent';
    },
    async handle(handlerInput) {
      const dataHelper = require('../data/dataHelper.js');
      const { userId } = handlerInput.requestEnvelope.context.System.user;

      const ret = await dataHelper.loadFromDynamoDB(userId);

      let speechText = '';
      if (!ret) {
        speechText = 'Error reading from database.';
      } else {
        speechText = ret.name;
      }

      return AplTemplates.getAplTextAndHintOrVoice(handlerInput, handlerInput.t.SKILL_NAME,
        speechText, handlerInput.t.HINT_HOME, speechText);
    },
  },
};
