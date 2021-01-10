import board
import adafruit_ws2801
from time import sleep
import json
import math
from api.model.led_pattern import LEDPattern
from led_controller.pattern_animator import PatternAnimator
from led_controller.pattern_animator_none import PatternAnimatorNone
from led_controller.pattern_animator_blink import PatternAnimatorBlink
from led_controller.pattern_animator_chase import PatternAnimatorChase
import logging

# TODO: some logging in all classes
# TODO: typing in all classes


class PatternController:
    LOG = logging.getLogger('PatternController')

    def __init__(self):
        self.pattern_animator = None

        self.leds = adafruit_ws2801.WS2801(
            board.SCK, board.MOSI, PatternAnimator.LED_COUNT, auto_write=False)
        self.leds.deinit()
        self.leds = adafruit_ws2801.WS2801(
            board.SCK, board.MOSI, PatternAnimator.LED_COUNT, auto_write=False)
        self.leds.brightness = 1

    def start_pattern_display(self, led_pattern: LEDPattern):
        if self.pattern_animator is not None:
            self.pattern_animator.stop()

        if(led_pattern.animation_type == "none"):
            self.pattern_animator = PatternAnimatorNone(self.leds, led_pattern)
        elif(led_pattern.animation_type == "blink"):
            self.pattern_animator = PatternAnimatorBlink(
                self.leds, led_pattern)
        elif(led_pattern.animation_type == "chase"):
            self.pattern_animator = PatternAnimatorChase(
                self.leds, led_pattern)

        PatternController.LOG.info(
            "Starting new animation: {}...".format(led_pattern.animation_type))
        self.pattern_animator.start()
