/* Creating a basic dynamodb table to test access from Lambda function. */
const Dynamola = require('dynamola');
const settings = require('./settings');

const ret = await Dynamola.createTableBasic(settings.DYNAMODB_TABLE_NAME);

console.log(JSON.stringify(ret));