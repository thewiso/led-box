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
from api.model.led_pattern import LEDPattern
from api.model.blink_led_pattern import BlinkLEDPattern
from api.model.chase_led_pattern import ChaseLEDPattern
import threading

# TODO: typing in all modules
__LOG = logging.getLogger(__name__)
__pattern_animator = None
__pattern_lock = threading.Lock()

__leds = adafruit_ws2801.WS2801(
	board.SCK, board.MOSI, PatternAnimator.LED_COUNT, auto_write=False)
# failsafe
__leds.deinit()
__leds = adafruit_ws2801.WS2801(
	board.SCK, board.MOSI, PatternAnimator.LED_COUNT, auto_write=False)
__leds.brightness = 1


def start_pattern_display(led_pattern: LEDPattern):
	with __pattern_lock:
		global __pattern_animator

		if __pattern_animator is not None:
			__pattern_animator.stop()

		if isinstance(led_pattern, LEDPattern):
			__pattern_animator = PatternAnimatorNone(__leds, led_pattern)
		elif isinstance(led_pattern, BlinkLEDPattern):
			__pattern_animator = PatternAnimatorBlink(
				__leds, led_pattern)
		elif isinstance(led_pattern, ChaseLEDPattern):
			__pattern_animator = PatternAnimatorChase(
				__leds, led_pattern)

		__LOG.info(
		"Starting new animation: {}...".format(led_pattern.pattern_type))

		__pattern_animator.start()	


def stop_pattern_display():
	with __pattern_lock:
		global __pattern_animator

		if __pattern_animator is not None:
			__pattern_animator.stop()
			__pattern_animator = None


def get_active_pattern_id():
	with __pattern_lock:
		global __pattern_animator

		if __pattern_animator is not None:
			return __pattern_animator.get_pattern_id()
		else:
			return None
