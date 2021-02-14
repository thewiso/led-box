import Vue from "vue";
import VueI18n from "vue-i18n";

Vue.use(VueI18n);

export const Languages = ["en-US", "de-DE"];

const messages = {
  "en-US": {
    adminPanel: {},
    patternConfiguration: {
      editPattern: "Edit Pattern",
      createPattern: "Create New Pattern",
      pickColor: "Pick Color",
      attributes: {
        categories: {
          general: "General",
          colors: "Colors",
          colorSettings: "Color Settings",
          animationSettings: "Animation Settings",
        },
        name: "Name",
        nameValidationHint: "Must contain any character except whitespace",
        repititionRate: "Repitition rate",
        repititionRateHint: "How often the colors get repeated",
        colorGradient: "Color gradient",
        colorGradientHint: "How soft the colors merge",
        noAnimation: "No animation",
        blinkAnimation: "Blink",
        chaseAnimation: "Chase",
        blinkSpeed: "Blink speed",
        blinkSpeedHint: "How fast the pattern blinks",
        blinkDimming: "Blink dimming",
        blinkDimmingHint: "How soft the pattern blinks",
        chaseSpeed: "Chase speed",
        chaseSpeedHint: "How fast the chase moves",
        chaseLength: "Chase length",
        chaseLengthHint: "How long the chase is",
        chaseGradient: "Chase gradient",
        chaseGradientHint: "How soft the chase merges with the background",
        chaseColor: "Chase color",
        isPatternChaseColorTrue: "Use pattern as chase color",
        isPatternChaseColorFalse: "Choose chase color and use pattern as background",
      },
    },
  },
  "de-DE": {
    adminPanel: {},
    patternConfiguration: {
      editPattern: "Muster anpassen",
      createPattern: "Neues Muster erstellen",
      pickColor: "Farbauswahl",
      attributes: {
        categories: {
          general: "Allgemein",
          colors: "Farben",
          colorSettings: "Farbeinstellungen",
          animationSettings: "Animationseinstellungen",
        },
        name: "Name",
        nameValidationHint: "Muss aus mindestens einem Zeichen außer Leerzeichen bestehen",
        repititionRate: "Wiederholungsfaktor",
        repititionRateHint: "Wie oft werden die Farben wiederholt",
        colorGradient: "Farbgradient",
        colorGradientHint: "Wie sehr gehen die Farben ineinander über",
        noAnimation: "Keine Animation",
        blinkAnimation: "Blinken",
        chaseAnimation: "Lichtlauf",
        blinkSpeed: "Blinkgeschwindigkeit",
        blinkSpeedHint: "Wie schnell blinkt das Muster",
        blinkDimming: "Blinkdämpfung",
        blinkDimmingHint: "Wie weich blinkt blinkt das Muster",
        chaseSpeed: "Lichtlaufgeschwindigkeit",
        chaseSpeedHint: "Wie schnell läuft der Lichtlauf",
        chaseLength: "Lichtlauflänge",
        chaseLengthHint: "Wie lang ist der Lichtlauf",
        chaseGradient: "Lichtlaufgradient",
        chaseGradientHint: "Wie sehr gehen die Farben des Lichtlaufs in den Hintergrund über",
        chaseColor: "Lichtlauffarbe",
        isPatternChaseColorTrue: "Das Muster als Farbe des Lichtlaufs verwenden",
        isPatternChaseColorFalse: "Eine eigene Farbe als Lichtlauf mit dem Muster als Hintergrund verwenden",
      },
    },
  },
};

export default new VueI18n({
  locale: process.env.VUE_APP_DEFAULT_LANGUAGE,
  messages,
});
