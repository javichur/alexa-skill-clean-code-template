module.exports = {
  DEFAULT_LANGUAGE: 'en',
  URL_API: 'https://google.com',
  PERMISSIONS: ['alexa::profile:given_name:read',
    'alexa::profile:email:read',
    'alexa::profile:mobile_number:read'],
  DYNAMODB_TABLE_NAME: 'skillTable',
  DYNAMODB_PRIMARY_KEY_NAME: 'Key',
};
