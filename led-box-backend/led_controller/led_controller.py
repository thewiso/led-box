import board
import adafruit_ws2801
from time import sleep
import json
import math
from api.model.led_pattern import LEDPattern
from led_controller.pattern_animator import PatternAnimator
from led_controller.pattern_animator_none import PatternAnimatorNone
from led_controller.pattern_animator_blink import PatternAnimatorBlink


# TODO: some logging in all classes

pattern_animator: PatternAnimator = None


# TODO: init
leds = adafruit_ws2801.WS2801(
	board.SCK, board.MOSI, PatternAnimator.LED_COUNT, auto_write=False)
leds.deinit()
leds = adafruit_ws2801.WS2801(
	board.SCK, board.MOSI, PatternAnimator.LED_COUNT, auto_write=False)



def start_pattern_display(led_pattern: LEDPattern):
	global pattern_animator
	if pattern_animator is not None:
		pattern_animator.stop()

	if(led_pattern.animation_type == "none"):
		pattern_animator = PatternAnimatorNone(leds, led_pattern)
	elif(led_pattern.animation_type == "blink"):
		pattern_animator = PatternAnimatorBlink(leds, led_pattern)

	pattern_animator.start()


json_str_none = """{
	"name": "tobi",
	"colors": [
		{
			"r": 255,
			"g": 0,
			"b": 0
		},
		{
			"r": 0,
			"g": 255,
			"b": 0
		},
		{
			"r": 0,
			"g": 0,
			"b": 255
		}
	],
	"repitionFactor": 0,
	"colorGradientLengthFactor": 0.3,
	"animationType": "none"
}"""

json_str_blink = """{
	"name": "tobi",
	"colors": [
		{
			"r": 255,
			"g": 0,
			"b": 0
		},
		{
			"r": 0,
			"g": 255,
			"b": 0
		},
		{
			"r": 0,
			"g": 0,
			"b": 255
		}
	],
	"repitionFactor": 0,
	"colorGradientLengthFactor": 0.3,
	"animationType": "blink",
	"blinkSpeed": 0.5,
	"blinkDimmingPeriodFactor": 0.5
}"""

led_pattern = json.loads(json_str_none)
start_pattern_display(led_pattern)