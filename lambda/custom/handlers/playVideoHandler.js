/* eslint-disable  no-console */
/* eslint-disable global-require */
const Settings = require('../settings.js');

// https://developer.amazon.com/en-US/docs/alexa/custom-skills/videoapp-interface-reference.html

const playVideo = {
  PlayVideoIntentHandler: {
    canHandle(handlerInput) {
      return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
        && Alexa.getIntentName(handlerInput.requestEnvelope) === 'PlayVideoIntent';
    },
    handle(handlerInput) {
      const VIDEO_TITLE = 'video title (editable)';
      const VIDEO_SUBTITLE = 'video subtitle (editable)';
      const VIDEO_URL = Settings.VIDEO_URL;

      // console.log('handlerInput.requestEnvelope.context.System.device.supportedInterfaces: ==> ' + JSON.stringify(handlerInput.requestEnvelope.context.System.device.supportedInterfaces));

      if (playVideo.supportsDisplay(handlerInput)) {
        handlerInput.responseBuilder.addVideoAppLaunchDirective(VIDEO_URL, VIDEO_TITLE, VIDEO_SUBTITLE);
      } else {
        handlerInput.responseBuilder.speak("Este dispositivo no soporta vídeo.");
      }

      return handlerInput.responseBuilder
        .getResponse();
    }
  },

  supportsDisplay(handlerInput) {
    const hasDisplay =
      handlerInput.requestEnvelope.context &&
      handlerInput.requestEnvelope.context.System &&
      handlerInput.requestEnvelope.context.System.device &&
      handlerInput.requestEnvelope.context.System.device.supportedInterfaces &&
      handlerInput.requestEnvelope.context.System.device.supportedInterfaces.VideoApp; // EDIT: añadido "VideoApp"
    return hasDisplay;
  },
};
module.exports = playVideo;