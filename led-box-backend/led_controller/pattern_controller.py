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

__LOG = logging.getLogger('PatternController')
__pattern_animator = None

__leds = adafruit_ws2801.WS2801(
            board.SCK, board.MOSI, PatternAnimator.LED_COUNT, auto_write=False)
__leds.deinit()
__leds.leds = adafruit_ws2801.WS2801(
            board.SCK, board.MOSI, PatternAnimator.LED_COUNT, auto_write=False)
__leds.leds.brightness = 1

def start_pattern_display(led_pattern: LEDPattern):
	global __pattern_animator

	if __pattern_animator is not None:
		__pattern_animator.stop()

	if(led_pattern.animation_type == "none"):
		__pattern_animator = PatternAnimatorNone(__leds, led_pattern)
	elif(led_pattern.animation_type == "blink"):
		__pattern_animator = PatternAnimatorBlink(
			__leds, led_pattern)
	elif(led_pattern.animation_type == "chase"):
		__pattern_animator = PatternAnimatorChase(
			__leds, led_pattern)

	__LOG.info(
		"Starting new animation: {}...".format(led_pattern.animation_type))
	__pattern_animator.start()
