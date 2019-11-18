/* eslint-disable  no-console */
// Based on https://github.com/alexa/skill-sample-nodejs-premium-hello-world
const AplTemplates = require('../apl/aplTemplates.js'); // eslint-disable-line global-require

const p = {

  // inicializa estas 2 propiedades para controlar el flujo de ejecución tras una compra.
  methodPostPurchase: null, // se ejecuta tras una compra, pasando como parámetro handlerInput
  methodPostRefund: null, // ejecutado tras solicitar cancelación compra, parámetro handlerInput
  speakPostPurchase: null, // speek tras la compra
  speakPostRefund: null, // speak tras solicitar cancelar una compra
  LOC: null, // strings

  isProduct(product) {
    return product && product.length > 0;
  },

  isEntitled(product) {
    return this.isProduct(product) && product[0].entitled === 'ENTITLED';
  },

  async isEntitledByProductId(handlerInput, productid) {
    const { locale } = handlerInput.requestEnvelope.request;
    const monetizationClient = handlerInput.serviceClientFactory.getMonetizationServiceClient();
    const res = await monetizationClient.getInSkillProducts(locale);
    const oneProduct = res.inSkillProducts.filter(record => record.referenceName === productid);
    const ret = this.isEntitled(oneProduct);
    console.log(`ret isEntitledByProductId: ${ret}`);
    return ret;
  },

  isPurchasable(product) {
    return this.isProduct(product) && product[0].purchasable === 'PURCHASABLE';
  },

  async isPurchasableByProductId(handlerInput, productid) {
    const { locale } = handlerInput.requestEnvelope.request;
    const monetizationClient = handlerInput.serviceClientFactory.getMonetizationServiceClient();
    const res = await monetizationClient.getInSkillProducts(locale);
    const oneProduct = res.inSkillProducts.filter(record => record.referenceName === productid);
    const ret = this.isPurchasable(oneProduct);
    console.log(`ret isPurchasableByProductId: ${ret}`);
    return ret;
  },

  getAllEntitledProducts(inSkillProductList) {
    const entitledProductList = inSkillProductList.filter(record => record.entitled === 'ENTITLED');
    return entitledProductList;
  },

  // randomize(array) {
  //   const randomItem = array[Math.floor(Math.random() * array.length)];
  //   return randomItem;
  // },

  makeUpsellByProductId(handlerInput, productId) {
    console.log('debug: makeUpsellByProductId');
    const { locale } = handlerInput.requestEnvelope.request;
    const monetizationClient = handlerInput.serviceClientFactory.getMonetizationServiceClient();
    return monetizationClient.getInSkillProducts(locale).then((res) => {
      // Filter the list of products available for purchase to find the product with the
      // reference name idProduct
      const oneProduct = res.inSkillProducts.filter(record => record.referenceName === productId);
      return p.makeUpsell(p.LOC.t.I_RECOMMEND_THIS, oneProduct, handlerInput);
    });
  },

  makeUpsell(preUpsellMessage, product, handlerInput) {
    const reprompt = p.LOC.t.IF_YOU_ARE_READY_TO_BUY_X_SAY.replace('{0}', product[0].name);
    const msg = `${preUpsellMessage}. ${product[0].summary}. ${reprompt}`;

    return AplTemplates.getAplTextAndHintOrVoice(handlerInput, product[0].name, msg,
      reprompt, msg);

    /*
    return handlerInput.responseBuilder
      .addDirective({
        type: 'Connections.SendRequest',
        name: 'Upsell',
        payload: {
          InSkillProduct: {
            productId: product[0].productId,
          },
          upsellMessage: msg, // "This is my product...Do you want to know more?",
        },
        token: 'correlationToken',
      })
      .getResponse();
      */
  },

  makeBuyOffer(theProduct, handlerInput) {
    return handlerInput.responseBuilder
      .addDirective({
        type: 'Connections.SendRequest',
        name: 'Buy',
        payload: {
          InSkillProduct: {
            productId: theProduct[0].productId,
          },
        },
        token: 'correlationToken',
      })
      .getResponse();
  },

  getSpeakableListOfProducts(entitleProductsList) {
    // Generate a single string with comma separated product names
    const productNameList = entitleProductsList.map(item => item.name);
    const productListSpeech = productNameList.join(', ');
    // Replace last comma with an 'and '
    // productListSpeech = productListSpeech.replace(/_([^_]*)$/, 'and $1');
    return productListSpeech;
  },

  WhatCanIBuyIntentHandler: {
    canHandle(handlerInput) {
      return (handlerInput.requestEnvelope.request.type === 'IntentRequest'
        && handlerInput.requestEnvelope.request.intent.name === 'WhatCanIBuyIntent');
    },
    handle(handlerInput) {
      // Get the list of products available for in-skill purchase
      const { locale } = handlerInput.requestEnvelope.request;
      const monetizationClient = handlerInput.serviceClientFactory.getMonetizationServiceClient();
      return monetizationClient.getInSkillProducts(locale).then((res) => {
        // res contains the list of all ISP products for this skill.
        // We now need to filter this to find the ISP products that are
        // available for purchase (NOT ENTITLED)
        const purchasableProducts = res.inSkillProducts.filter(record => record.entitled === 'NOT_ENTITLED'
          && record.purchasable === 'PURCHASABLE');
        // Say the list of products
        if (purchasableProducts.length > 0) {
          // One or more products are available for purchase. say the list of products
          const speechText = p.LOC.t.PRODUCTS_AVAILABLE_TO_PURCHASE_ARE.replace('{0}',
            p.getSpeakableListOfProducts(purchasableProducts));

          return AplTemplates.getAplTextAndHintOrVoice(handlerInput, p.LOC.t.SKILL_NAME,
            speechText, p.LOC.t.TRY_BUY_AND_PRODUCT_NAME, speechText);
        }
        // no products are available for purchase. Ask if they would like to hear another greeting
        const speechText = `${p.LOC.t.NO_PRODUCTS_TO_OFFER}. ${p.speakPostPurchase}`;
        return AplTemplates.getAplTextAndHintOrVoice(handlerInput, p.LOC.t.SKILL_NAME,
          speechText, p.LOC.t.TRY_ORDER_HISTORY, speechText);
      });
    },
  },

  /**
   * Diálogo de Buy o Upsell
   * @param {*} handlerInput
   * @param {bool} isUpsell Indica si hay que mostrar pregunta de upsell (true) o de compra (false)
   */
  makeUpsellOrBuyOfferIfNotBought(handlerInput, isUpsell) {
    const { locale } = handlerInput.requestEnvelope.request;
    const monetizationClient = handlerInput.serviceClientFactory.getMonetizationServiceClient();
    const itemSlot = handlerInput.requestEnvelope.request.intent.slots.ProductName;
    let idProduct = null;
    let displayNameProduct = null;
    if (itemSlot && itemSlot.resolutions
      && itemSlot.resolutions.resolutionsPerAuthority
      && itemSlot.resolutions.resolutionsPerAuthority[0].values
      && itemSlot.resolutions.resolutionsPerAuthority[0].values[0].value.name) {
      idProduct = itemSlot.resolutions.resolutionsPerAuthority[0].values[0].value.id; // save id
      displayNameProduct = itemSlot.resolutions.resolutionsPerAuthority[0].values[0].value.name;
    }
    return monetizationClient.getInSkillProducts(locale).then((res) => {
      // Filter the list of products available for purchase to find the product with the
      // reference name idProduct
      const oneProduct = res.inSkillProducts.filter(record => record.referenceName === idProduct);
      if (this.isEntitled(oneProduct)) {
        // Customer has bought the product. They don't need to buy it
        const speechText = `${p.LOC.t.YOU_HAVE_ALREADY_BOUGHT_THE} ${displayNameProduct}. ${p.LOC.t.ASK_WHAT_CAN_I_BUY_OR_HELP}`;
        return AplTemplates.getAplTextAndHintOrVoice(handlerInput, p.LOC.t.SKILL_NAME,
          speechText, p.LOC.t.ASK_WHAT_CAN_I_BUY_OR_HELP, speechText);
      }
      // Customer hasn't bought this product yet.
      // Make the upsell / buy offer
      if (isUpsell) {
        return this.makeUpsell(p.LOC.t.SURE, oneProduct, handlerInput);
      }
      return this.makeBuyOffer(oneProduct, handlerInput);
    });
  },

  TellMeMoreAboutProductIntentHandler: {
    canHandle(handlerInput) {
      return handlerInput.requestEnvelope.request.type === 'IntentRequest'
        && handlerInput.requestEnvelope.request.intent.name === 'TellMeMoreAboutProductIntent';
    },
    handle(handlerInput) {
      return p.makeUpsellOrBuyOfferIfNotBought(handlerInput, true);
    },
  },

  BuyIntentHandler: {
    canHandle(handlerInput) {
      return handlerInput.requestEnvelope.request.type === 'IntentRequest'
        && handlerInput.requestEnvelope.request.intent.name === 'BuyIntent';
    },
    handle(handlerInput) {
      return p.makeUpsellOrBuyOfferIfNotBought(handlerInput, false);
    },
  },

  async getResponseBasedOnAccessType(handlerInput, preSpeechText) {
    if (this.methodPostPurchase) {
      await this.methodPostPurchase(handlerInput);
    }
    let speechText = `${preSpeechText} `;

    if (this.speakPostPurchase) {
      speechText += this.speakPostPurchase;
    }

    return AplTemplates.getAplTextAndHintOrVoice(handlerInput, p.LOC.t.SKILL_NAME,
      speechText, this.speakPostPurchase, speechText);
  },

  BuyResponseHandler: {
    canHandle(handlerInput) {
      return handlerInput.requestEnvelope.request.type === 'Connections.Response'
        && (handlerInput.requestEnvelope.request.name === 'Buy'
          || handlerInput.requestEnvelope.request.name === 'Upsell');
    },
    async handle(handlerInput) {
      const { locale } = handlerInput.requestEnvelope.request;
      const monetizationClient = handlerInput.serviceClientFactory.getMonetizationServiceClient();
      const { productId } = handlerInput.requestEnvelope.request.payload;
      return monetizationClient.getInSkillProducts(locale).then(async (res) => {
        const product = res.inSkillProducts.filter(record => record.productId === productId);
        console.log(`BuyResponseHandler. product = ${JSON.stringify(product)}`);
        if (handlerInput.requestEnvelope.request.status.code === '200') {
          let preSpeechText;
          // check the Buy status - accepted, declined, already purchased, or something went wrong.
          switch (handlerInput.requestEnvelope.request.payload.purchaseResult) {
            case 'ACCEPTED':
              preSpeechText = p.LOC.t.ENJOY_YOUR_X_PURCHASE.replace('{0}', product[0].name);
              break;
            case 'DECLINED':
              preSpeechText = 'No Problem.';
              break;
            case 'ALREADY_PURCHASED':
              preSpeechText = `${p.LOC.t.YOU_HAVE_ALREADY_BOUGHT_THE} ${product[0].name}.`;
              break;
            default:
              preSpeechText = p.LOC.t.SOMETHING_UNEXPECTED_BUYING.replace('{0}', product[0].name);
              break;
          }
          // respond back to the customer
          return p.getResponseBasedOnAccessType(handlerInput, preSpeechText);
        }
        // Request Status Code NOT 200. Something has failed with the connection.
        console.log(`Connections.Response indicated failure. error: + ${handlerInput.requestEnvelope.request.status.message}`);
        return handlerInput.responseBuilder
          .speak(p.LOC.t.ERROR_HANDLING_REQUEST)
          .getResponse();
      });
    },
  },

  PurchaseHistoryIntentHandler: {
    canHandle(handlerInput) {
      return (handlerInput.requestEnvelope.request.type === 'IntentRequest'
        && handlerInput.requestEnvelope.request.intent.name === 'PurchaseHistoryIntent');
    },
    handle(handlerInput) {
      const { locale } = handlerInput.requestEnvelope.request;
      const monetizationClient = handlerInput.serviceClientFactory.getMonetizationServiceClient();
      return monetizationClient.getInSkillProducts(locale).then((result) => {
        const entitledProducts = p.getAllEntitledProducts(result.inSkillProducts);
        if (entitledProducts && entitledProducts.length > 0) {
          const speechText = `${p.LOC.t.BOUGHT_LIST} ${p.getSpeakableListOfProducts(entitledProducts)}. ${p.LOC.t.HOW_CAN_I_HELP}`;
          return AplTemplates.getAplTextAndHintOrVoice(handlerInput, p.LOC.t.SKILL_NAME,
            speechText, p.LOC.t.ASK_WHAT_CAN_I_BUY_OR_HELP, speechText);
        }
        const speechText = p.LOC.t.YOU_HAVE_NOT_PURCHASED_ANYTHING;
        return AplTemplates.getAplTextAndHintOrVoice(handlerInput, p.LOC.t.SKILL_NAME,
          speechText, p.LOC.t.ASK_WHAT_CAN_I_BUY_OR_HELP, speechText);
      });
    },
  },

  RefundProductIntentHandler: {
    canHandle(handlerInput) {
      return (
        handlerInput.requestEnvelope.request.type === 'IntentRequest'
        && handlerInput.requestEnvelope.request.intent.name === 'RefundProductIntent'
      );
    },
    handle(handlerInput) {
      const { locale } = handlerInput.requestEnvelope.request;
      const monetizationClient = handlerInput.serviceClientFactory.getMonetizationServiceClient();

      const itemSlot = handlerInput.requestEnvelope.request.intent.slots.ProductName;
      let idProduct = null;

      if (itemSlot && itemSlot.resolutions
        && itemSlot.resolutions.resolutionsPerAuthority
        && itemSlot.resolutions.resolutionsPerAuthority[0].values
        && itemSlot.resolutions.resolutionsPerAuthority[0].values[0].value.name) {
        idProduct = itemSlot.resolutions.resolutionsPerAuthority[0].values[0].value.id; // save id
      }

      return monetizationClient.getInSkillProducts(locale).then((res) => {
        const oneProduct = res.inSkillProducts.filter(
          record => record.referenceName === idProduct,
        );

        return handlerInput.responseBuilder
          .addDirective({
            type: 'Connections.SendRequest',
            name: 'Cancel',
            payload: {
              InSkillProduct: {
                productId: oneProduct[0].productId,
              },
            },
            token: 'correlationToken',
          })
          .getResponse();
      });
    },
  },

  CancelProductResponseHandler: {
    canHandle(handlerInput) {
      return (
        handlerInput.requestEnvelope.request.type === 'Connections.Response'
        && handlerInput.requestEnvelope.request.name === 'Cancel'
      );
    },
    async handle(handlerInput) {
      const { locale } = handlerInput.requestEnvelope.request;
      const monetizationClient = handlerInput.serviceClientFactory.getMonetizationServiceClient();
      const { productId } = handlerInput.requestEnvelope.request.payload;
      let speechText;

      console.log('CancelProductResponseHandler');

      if (p.methodPostRefund) {
        await p.methodPostRefund(handlerInput);
      }

      return monetizationClient.getInSkillProducts(locale).then((res) => {
        const product = res.inSkillProducts.filter(
          record => record.productId === productId,
        );

        console.log(`PRODUCT = ${JSON.stringify(product)}`);

        if (handlerInput.requestEnvelope.request.status.code === '200') {
          // Alexa handles the speech response immediately following the cancellation request.
          // It then passes the control to our CancelProductResponseHandler() along with the
          // status code (ACCEPTED, DECLINED, NOT_ENTITLED).
          // We use status code to put speech at the end of Alexa's cancellation response.
          // Currently, we have the same additional speech (getRandomYesNoQuestion)for accepted,
          // canceled, and not_entitled. You may edit these below, if you like.
          switch (handlerInput.requestEnvelope.request.payload.purchaseResult) {
            case 'ACCEPTED':
              // Cancellation confirmation response is handled by Alexa's Purchase Experience Flow.
              // Simply add to that with getRandomYesNoQuestion()
              speechText = `${p.speakPostRefund}`;
              break;
            case 'DECLINED':
              speechText = `${p.speakPostRefund}`;
              break;
            case 'NOT_ENTITLED':
              // No subscription to cancel.
              // "No subscription to cancel" response handled by Alexa's Purchase Experience Flow.
              // Simply add to that with getRandomYesNoQuestion()
              speechText = `${p.speakPostRefund}`;
              break;
            default:
              speechText = `${p.speakPostRefund}`;
              break;
          }

          return AplTemplates.getAplTextAndHintOrVoice(handlerInput, p.LOC.t.SKILL_NAME,
            speechText, p.LOC.t.ASK_WHAT_CAN_I_BUY_OR_HELP, speechText);
        }
        // Something failed.
        console.log(`Connections.Response indicated failure. error: ${handlerInput.requestEnvelope.request.status.message}`);

        return handlerInput.responseBuilder
          .speak(p.LOC.t.ERROR_HANDLING_REQUEST)
          .getResponse();
      });
    },
  },

};
module.exports = p;
