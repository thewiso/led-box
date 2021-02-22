from led_controller.pattern_animator import PatternAnimator
import adafruit_ws2801
from api.gen.base.models.led_pattern import LEDPattern
import threading
import time
import logging
import math


class PatternAnimatorBlink(PatternAnimator):

    LOG = logging.getLogger(__name__)

    GAMMA_CORRECTION = 1 / 2.2
    GAMMA_CORRECTION_RECIPROCAL = 1 / GAMMA_CORRECTION

    # The LED strip will not show pretty or any colors below this threshold
    MIN_BRIGHTNESS = 0.05

    def __init__(self, leds: adafruit_ws2801.WS2801, led_pattern: LEDPattern):
        super().__init__(leds, led_pattern)
        self.blink_toggle_duration = round(
            1000 / self.led_pattern.blink_speed / 2)

        if(self.led_pattern.blink_dimming_period_factor > 0):
            self.blink_dimming_duration = self.blink_toggle_duration * \
                led_pattern.blink_dimming_period_factor
        else:
            self.blink_dimming_duration = 0

        self.timer = None
        self.timer_lock = threading.Lock()
        self.timer_running = False

    def start(self):
        PatternAnimatorBlink.LOG.info("Starting pattern animation...")
        self.clear_leds()

        self.leds.brightness = 0
        self.fill_and_show_leds(self.led_color_list)

        with self.timer_lock:
            self.timer = threading.Timer(0.1, self.blink, args=(False, 0))
            self.timer_running = True
            self.timer.start()
        PatternAnimatorBlink.LOG.info("Started pattern animation")

    def stop(self):
        PatternAnimatorBlink.LOG.info("Stopping pattern animation...")
        if(self.timer is not None):
            with self.timer_lock:
                self.timer_running = False
                self.timer.cancel()

            self.leds.brightness = 1
            self.clear_leds()
        PatternAnimatorBlink.LOG.info("Stopped pattern animation")

    def blink(self, current_blink_state: bool, next_toggle_timestamp: int):
        brightness = None
        timestamp = int(round(time.time() * 1000))

        if timestamp >= next_toggle_timestamp:
            current_blink_state = not current_blink_state
            next_toggle_timestamp = timestamp + self.blink_toggle_duration

            brightness = PatternAnimatorBlink.MIN_BRIGHTNESS if current_blink_state else 1

        if self.blink_dimming_duration > 0 and brightness is None and timestamp > next_toggle_timestamp - self.blink_dimming_duration:
            brightness = (
                next_toggle_timestamp - timestamp) / self.blink_dimming_duration
            if current_blink_state:
                brightness = 1 - brightness

            # https://www.mikrocontroller.net/articles/Diskussion:LED-Fading#Diskussion_wissenschaftl.-technischer_Hintergrund
            brightness = brightness ** PatternAnimatorBlink.GAMMA_CORRECTION_RECIPROCAL
            # map brightness' value (which is currently between 0 and 1) to the proportional value between MIN_BRIGHTNESS and 1
            if brightness == 0:
                brightness = PatternAnimatorBlink.MIN_BRIGHTNESS
            else:
                brightness = ((1 - PatternAnimatorBlink.MIN_BRIGHTNESS)
                              * brightness) + PatternAnimatorBlink.MIN_BRIGHTNESS

        if brightness is not None:
            self.leds.brightness = brightness
            self.leds.show()

        with self.timer_lock:
            if self.timer_running:
                self.timer = threading.Timer(0.01, self.blink, args=(
                    current_blink_state, next_toggle_timestamp))
                self.timer.start()
