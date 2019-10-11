const Dynamola = require('dynamola');
const settings = require('../settings');

module.exports = {
  async loadFromDynamoDB(id) {
    const db = new Dynamola(settings.DYNAMODB_TABLE_NAME,
      settings.DYNAMODB_PRIMARY_KEY_NAME,
      null);

    const ret = await db.getItem(id);

    return ret;
  },

  async saveToDynamoDB(id, attributes) {
    const db = new Dynamola(settings.DYNAMODB_TABLE_NAME,
      settings.DYNAMODB_PRIMARY_KEY_NAME,
      null);

    const ret = await db.addItem(id, attributes);

    let speechText = '';
    if (!ret) {
      speechText = 'Error writing in database. Did you create the table and configure IAM permissions?';
    } else if (ret.name === attributes.name) {
      speechText = 'Data saved in DynamoBB using Dynamola library.';
    } else {
      speechText = 'Error writing in database.';
    }

    return speechText;
  },
};
