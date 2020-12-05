from led_controller.pattern_animator import PatternAnimator
import adafruit_ws2801
from api.model.led_pattern import LEDPattern

class PatternAnimatorBlink(PatternAnimator):

	def __init__(self, leds: adafruit_ws2801.WS2801, led_pattern: LEDPattern):
		super.__init__(leds, led_pattern)

	def start(self):
		self.clear_leds()
		self.fill_and_show_leds(self.led_color_list)
	
	def stop(self):
		pass