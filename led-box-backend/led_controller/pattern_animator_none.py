from led_controller.pattern_animator import PatternAnimator
import adafruit_ws2801
import logging
from api.model.led_pattern import LEDPattern


class PatternAnimatorNone(PatternAnimator):
    LOG = logging.getLogger(__name__)

    def __init__(self, leds: adafruit_ws2801.WS2801, led_pattern: LEDPattern):
        super().__init__(leds, led_pattern)

    def start(self):
        PatternAnimatorNone.LOG.debug("Starting pattern animation...")
        self.clear_leds()
        self.fill_and_show_leds(self.led_color_list)
        PatternAnimatorNone.LOG.debug("Started pattern animation")

    def stop(self):
        PatternAnimatorNone.LOG.debug("Stopping pattern animation...")
        self.clear_leds()
        PatternAnimatorNone.LOG.debug("Stopped pattern animation")
