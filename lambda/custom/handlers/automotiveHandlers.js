/* eslint-disable  no-console */
/* eslint-disable global-require */

// More info about Alexa Location Services: 
// https://developer.amazon.com/es-ES/docs/alexa/custom-skills/location-services-for-alexa-skills.html

const auto = {
  getFrescuraSegundos(handlerInput) {
    var geoObject = handlerInput.requestEnvelope.context.Geolocation;
    return (new Date(handlerInput.requestEnvelope.request.timestamp) - new Date(geoObject.timestamp)) / 1000; // freshness in seconds
  },

  AreYouACarIntentHandler: {
    canHandle(handlerInput) {
      return handlerInput.requestEnvelope.request.type === 'IntentRequest'
        && handlerInput.requestEnvelope.request.intent.name === 'AreYouACarIntent';
    },
    handle(handlerInput) {
      let speakOutput = '';
      var isAnAutomotiveEndpoint = handlerInput.requestEnvelope.context.Automotive;
      if (isAnAutomotiveEndpoint) {
        speakOutput = 'Sí, soy un Alexa Auto.';
      } else {
        speakOutput = 'No, no soy un Alexa Auto.';
      }

      var isGeolocationSupported = handlerInput.requestEnvelope.context.System.device.supportedInterfaces.Geolocation;
      if (isGeolocationSupported) {   //  does the device support location based features? 
        var geoObject = handlerInput.requestEnvelope.context.Geolocation;
        if (!geoObject || !geoObject.coordinate) {
          // IMPORTANTE: para que no de error esta Directiva, configura en la consola de alexa que esta skill tenga permiso de localización.
          return handlerInput.responseBuilder
            .speak(speakOutput + '. No tengo permiso de acceso a tu ubicación. Para conceder permiso, abre la app Alexa y sigue las instrucciones.')
            .withAskForPermissionsConsentCard(['alexa::devices:all:geolocation:read'])
            .getResponse();
        } else {
          var freshness = auto.getFrescuraSegundos(handlerInput);
          speakOutput += ' La siguiente info se obtuvo hace ' + freshness + ' segundos.';

          // obtener la altura
          if (geoObject.altitude) {
            var altura = Math.round(geoObject.altitude.altitudeInMeters);
            var precisionAltura = Math.round(geoObject.altitude.accuracyInMeters);
            speakOutput += ' Estás a una altura de ' + altura + ' metros sobre nivel del mar, con una precisión de ' + Math.round(precisionAltura) + ' metros.';
          } else {
            speakOutput += ' Este dispositivo no calcula la altitud, lo siento.';
          }

          // obtener velocidad
          if (geoObject.speed) {
            var speed = geoObject.speed.speedInMetersPerSecond;
            var kmph = speed * 3600 / 1000;
            speakOutput += ' Tu velocidad es ' + kmph + ' kilómetros por hora.';
          } else {
            speakOutput += ' Este dispositivo no calcula la velocidad, lo siento.';
          }

          // obtener latitud y longitud
          if (geoObject.coordinate) {
            var lat = geoObject.coordinate.latitudeInDegrees;
            var lon = geoObject.coordinate.longitudeInDegrees;
            var precisionLatLonMetros = geoObject.coordinate.accuracyInMeters;
            speakOutput += ' Tu ubicación (latitud, longitud) es ' + lat + ', ' + lon + ', con una preción de ' + precisionLatLonMetros + ' metros.';
          } else {
            speakOutput += ' Este dispositivo no calcula la ubicación, lo siento.';
          }
        }
      } else {
        speakOutput += ' No tengo capacidad para conocer tu ubicación, lo siento. Pruébame desde la app móvil Alexa o desde un Alexa Auto, por ejemplo.';
      }

      return handlerInput.responseBuilder
        .speak(speakOutput)
        .reprompt(speakOutput)
        .getResponse();
    },
  }
};
module.exports = auto;