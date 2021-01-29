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

# TODO: typing in all modules
__LOG = logging.getLogger(__name__)
__pattern_animator = None

__leds = adafruit_ws2801.WS2801(
    board.SCK, board.MOSI, PatternAnimator.LED_COUNT, auto_write=False)
# failsafe
__leds.deinit()
__leds = adafruit_ws2801.WS2801(
    board.SCK, board.MOSI, PatternAnimator.LED_COUNT, auto_write=False)
__leds.brightness = 1


def start_pattern_display(led_pattern: LEDPattern):
    global __pattern_animator

    if __pattern_animator is not None:
        __pattern_animator.stop()

    if(led_pattern.pattern_type == "LEDPattern"):
        __pattern_animator = PatternAnimatorNone(__leds, led_pattern)
    elif(led_pattern.pattern_type == "BlinkLEDPattern"):
        __pattern_animator = PatternAnimatorBlink(
            __leds, led_pattern)
    elif(led_pattern.pattern_type == "ChaseLEDPattern"):
        __pattern_animator = PatternAnimatorChase(
            __leds, led_pattern)

    __LOG.info(
        "Starting new animation: {}...".format(led_pattern.animation_type))
    __pattern_animator.start()


def stop_pattern_display():
    global __pattern_animator

    if __pattern_animator is not None:
        __pattern_animator.stop()
        __pattern_animator = None


def get_active_pattern_id():
    global __pattern_animator

    if __pattern_animator is not None:
        return __pattern_animator.get_pattern_id()
    else:
        return None
