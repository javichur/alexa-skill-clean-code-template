module.exports = {
  DEFAULT_LANGUAGE: 'en',
  URL_API: 'https://google.com',
  PERMISSIONS: ['alexa::profile:given_name:read',
    'alexa::profile:email:read',
    'alexa::profile:mobile_number:read'],
  DYNAMODB_TABLE_NAME: 'skillTable',
  DYNAMODB_PRIMARY_KEY_NAME: 'Key',

  ID_PRODUCT_ISP: 'nameproductpurchase', // isp name
  NUM_FREE_ITEMS: 3, // num de items que permites usar gratis.
  UPSELL_EACH_N_TIMES: 5, // cada cuántas iteraciones sugieres la compra

  DYNAMIC_SLOT_NAME: 'MyDynamicEntitySlot',

  VIDEO_URL: 'https://file-examples-com.github.io/uploads/2017/04/file_example_MP4_1920_18MG.mp4', // HTTPS location for videos is required.
};
