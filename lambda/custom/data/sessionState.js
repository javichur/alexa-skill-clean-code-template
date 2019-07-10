module.exports = {

  STATES: Object.freeze({
    UNINITIALIZED: -1,
    LAUNCH: 1,
    HELP: 2,
    HELLO_WORLD: 3,
  }),

  /**
   * Save the current state in session
   * @param {*} handlerInput
   * @param {*} currentState
   */
  setCurrentState(handlerInput, currentState) {
    const { attributesManager } = handlerInput;
    const sessionAttributes = attributesManager.getSessionAttributes();

    sessionAttributes.currentState = currentState; // save new state

    attributesManager.setSessionAttributes(sessionAttributes);
  },

  /**
   * Returns the state saved in session
   * @param {*} handlerInput
   */
  getCurrentState(handlerInput) {
    const { attributesManager } = handlerInput;

    const sessionAttributes = attributesManager.getSessionAttributes();

    if (sessionAttributes.currentState) {
      return sessionAttributes.currentState;
    }

    return this.STATES.UNINITIALIZED;
  },

  /**
   * Sample method to save "testAttribute"
   * @param {*} handlerInput
   * @param {string} testAtt
   */
  setTestAttribute(handlerInput, testAtt) {
    const { attributesManager } = handlerInput;
    const sessionAttributes = attributesManager.getSessionAttributes();

    sessionAttributes.testAttribute = testAtt; // save

    attributesManager.setSessionAttributes(sessionAttributes);
  },

  /**
   * Returns value of "testAttribute" from session.
   * Returns null if not exists.
   * @param {*} handlerInput
   */
  getTestAttribute(handlerInput) {
    const { attributesManager } = handlerInput;

    const sessionAttributes = attributesManager.getSessionAttributes();

    if (sessionAttributes.testAttribute) {
      return sessionAttributes.testAttribute;
    }

    return null;
  },

};
