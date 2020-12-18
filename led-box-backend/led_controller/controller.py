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

pattern_animator: PatternAnimator = None
LOG = logging.getLogger('Controller')


# TODO: init
leds = adafruit_ws2801.WS2801(
	board.SCK, board.MOSI, PatternAnimator.LED_COUNT, auto_write=False)
leds.deinit()
leds = adafruit_ws2801.WS2801(
	board.SCK, board.MOSI, PatternAnimator.LED_COUNT, auto_write=False)
leds.brightness = 1


def start_pattern_display(led_pattern: LEDPattern):
	global pattern_animator
	if pattern_animator is not None:
		pattern_animator.stop()

	if(led_pattern.animation_type == "none"):
		pattern_animator = PatternAnimatorNone(leds, led_pattern)
	elif(led_pattern.animation_type == "blink"):
		pattern_animator = PatternAnimatorBlink(leds, led_pattern)
	elif(led_pattern.animation_type == "chase"):
		pattern_animator = PatternAnimatorChase(leds, led_pattern)
	LOG.warning(led_pattern.animation_type)
	pattern_animator.start()


json_str_none = """{
	"name": "none_animation",
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
	"colorGradientLengthFactor": 0.5,
	"animationType": "none"
}"""

json_str_blink = """{
	"name": "blink_animation",
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
	"blinkSpeed": 0.1,
	"blinkDimmingPeriodFactor": 
}"""

json_str_chase = """{
	"name": "chase_animation",
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
	"animationType": "chase",
	"chaseSpeed": 1,
	"chaseLengthFactor": 0.2,
    "chaseGradientLengthFactor": 0.25,
	"chaseForeground": {
		"r": 0,
		"g": 0,
		"b": 255
	}
}"""

json_str_chase_2 = """{
	"name": "chase_animation",
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
	"animationType": "chase",
	"chaseSpeed": 50,
	"chaseLengthFactor": 0.2,
    "chaseGradientLengthFactor": 0.5
}"""

#led_pattern_dict = json.loads(json_str_none)
#led_pattern_dict = json.loads(json_str_blink)
led_pattern_dict = json.loads(json_str_chase)
led_pattern = LEDPattern.from_dict(led_pattern_dict)

start_pattern_display(led_pattern)