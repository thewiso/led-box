from led_controller.pattern_animator import PatternAnimator
import adafruit_ws2801
from api.model.led_pattern import LEDPattern
import threading
import time


class PatternAnimatorNone(PatternAnimator):

	def __init__(self, leds: adafruit_ws2801.WS2801, led_pattern: LEDPattern):
		super().__init__(leds, led_pattern)
		self.current_blink_state = False
		self.blink_toggle_duration = round(
			1000 / self.led_pattern.blink_speed / 2)

		if(self.led_pattern.blink_dimming_period_factor > 0):
			self.blink_dimming_duration = self.blink_toggle_duration * \
				led_pattern.blink_dimming_period_factor
		else:
			self.blink_dimming_duration = 0

		self.next_toggle_timestamp = 0
		self.timer = None

	def start(self):
		self.clear_leds()
		self.timer = threading.Timer(0.01, self.blink)
		self.timer.start()

	def stop(self):
		if(self.timer is not None):
			self.timer.cancel()

	def blink(self):
		dimming_color_factor = None
		timestamp = int(round(time.time() * 1000))

		if timestamp >= self.next_toggle_timestamp:
			self.current_blink_state = not self.current_blink_state
			self.next_toggle_timestamp = timestamp + self.blink_toggle_duration

			dimming_color_factor = 0 if self.current_blink_state else 1

		if self.blink_dimming_duration > 0 and dimming_color_factor is None and timestamp > self.next_toggle_timestamp - self.blink_dimming_duration:
			dimming_color_factor = (
				self.next_toggle_timestamp - timestamp) / self.blink_dimming_duration
			if self.current_blink_state:
				dimming_color_factor = 1 - dimming_color_factor

		if dimming_color_factor is not None:
			self.leds.brightness = dimming_color_factor
