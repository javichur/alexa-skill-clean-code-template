/* eslint-disable  no-console */
module.exports = {

  ChainingIntentHandler: {
    canHandle(handlerInput) {
      return (handlerInput.requestEnvelope.request.type === 'IntentRequest'
        && handlerInput.requestEnvelope.request.intent.name === 'ChainingIntent');
    },
    handle(handlerInput) {
      return handlerInput.responseBuilder
        .addDelegateDirective({
          name: 'ColorIntent',
          confirmationStatus: 'NONE',
          slots: {
            colorSlot: {
              name: 'colorSlot',
              value: 'verde',
              confirmationStatus: 'NONE',
            },
          },
        }).getResponse();
    },
  },
};
