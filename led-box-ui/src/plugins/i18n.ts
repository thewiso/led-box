import Vue from "vue";
import VueI18n from "vue-i18n";

Vue.use(VueI18n);

export const Languages = ["en-US", "de-DE"];

const messages = {
  "en-US": {
    adminPanel: {
      categories: {
        server: "Server",
        database: "Database",
      },
      back: "Back",
      armButton: "Arm button (Danger!)",
      shutdown: "Shutdown",
      reset: "Reset",
      delete: "Delete everything",
    },
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
        emptyValidationHint: "Must contain any character except whitespace",
        tooShortValidationHint: "Is too short",
        tooLongValidationHint: "Is too long",
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
    errors: {
      loadPatterns: "Could not load patterns, please reload and try again later",
      loadActivePattern: "Could not load active pattern, please reload and try again later",
      runPattern: "Could not start pattern, please reload and try again later",
      stopPattern: "Could not stop pattern, please reload and try again later",
      savePattern: "Could not save pattern, please reload and try again later",
      generalError: "Could not fulfil operation, please reload and try again later",
    },
  },
  "de-DE": {
    adminPanel: {
      categories: {
        server: "Server",
        database: "Datenbank",
      },
      back: "Zurück",
      armButton: "Button freischalten (Achtung!)",
      shutdown: "Herunterfahren",
      reset: "Zurücksetzen",
      delete: "Alles löschen",
    },
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
        emptyValidationHint: "Muss aus mindestens einem Zeichen außer Leerzeichen bestehen",
        tooShortValidationHint: "Ist zu kurz",
        tooLongValidationHint: "Ist zu lang",
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
    errors: {
      loadPatterns:
        "Muster konnten nicht geladen werden, bitte laden Sie die Seite neu und versuchen Sie es später noch einmal",
      loadActivePattern:
        "Aktives Muster konnte nicht geladen werden, bitte laden Sie die Seite neu und versuchen Sie es später noch einmal",
      runPattern:
        "Muster konnte nicht abgespielt werden, bitte laden Sie die Seite neu und versuchen Sie es später noch einmal",
      stopPattern:
        "Muster konnte nicht gestoppt werden, bitte laden Sie die Seite neu und versuchen Sie es später noch einmal",
      savePattern:
        "Muster konnte nicht gespeichert werden, bitte laden Sie die Seite neu und versuchen Sie es später noch einmal",
      generalError:
        "Operation konnte nicht abgeschlossen werden, bitte laden Sie die Seite neu und versuchen Sie es später noch einmal",
    },
  },
};

export default new VueI18n({
  locale: process.env.VUE_APP_DEFAULT_LANGUAGE,
  messages,
});
