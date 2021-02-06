from led_controller.pattern_animator import PatternAnimator
import adafruit_ws2801
from api.model.led_pattern import LEDPattern
import threading
import time
import logging
import math
from typing import Tuple, Callable


class PatternAnimatorChase(PatternAnimator):

	LOG = logging.getLogger(__name__)

	def __init__(self, leds: adafruit_ws2801.WS2801, led_pattern: LEDPattern):
		super().__init__(leds, led_pattern)

		self.chase_length = max(1, round(
			led_pattern.chase_length_factor * PatternAnimator.LED_COUNT))
		self.chase_gradient_length = math.floor(
			self.chase_length * led_pattern.chase_gradient_length_factor)
		self.chase_step_duration = round(1000 / led_pattern.chase_speed)

		self.timer = None
		self.timer_lock = threading.Lock()
		self.timer_running = False

		if(led_pattern.chase_foreground is None):
			self.background_color_list = [
				(0, 0, 0)] * PatternAnimator.LED_COUNT
			self.chase_color_list = self.led_color_list
		else:
			self.background_color_list = self.led_color_list
			chase_color = self.get_color_tuple_from_color_object(
				led_pattern.chase_foreground)
			self.chase_color_list = [chase_color] * PatternAnimator.LED_COUNT

		self.get_chase_color = self.create_chase_color_provider()

	def start(self):
		PatternAnimatorChase.LOG.info("Starting pattern animation...")
		self.clear_leds()

		self.fill_and_show_leds(self.background_color_list)

		with self.timer_lock:
			self.timer = threading.Timer(
				0.1, self.chase, args=(0, int(round(time.time() * 1000))))
			self.timer_running = True
			self.timer.start()

		PatternAnimatorChase.LOG.info("Started pattern animation")

	def stop(self):
		PatternAnimatorChase.LOG.info("Stopping pattern animation...")
		if(self.timer is not None):
			with self.timer_lock:
				self.timer_running = False
				self.timer.cancel()

			self.clear_leds()
		PatternAnimatorChase.LOG.info("Stopped pattern animation")

	def chase(self, previous_chase_start_index: int, previous_time_stamp: int):
		timestamp = int(round(time.time() * 1000))

		elapsed = timestamp - previous_time_stamp
		elapsed_steps = round(elapsed / self.chase_step_duration)
		if elapsed_steps > 0:
			chase_start_index = (previous_chase_start_index +
								 elapsed_steps) % PatternAnimator.LED_COUNT

			self.fill_leds(self.background_color_list,
						   previous_chase_start_index, elapsed_steps)
			self.fill_chase(chase_start_index)

			previous_time_stamp = timestamp
			previous_chase_start_index = chase_start_index

			self.leds.show()

		with self.timer_lock:
			if self.timer_running:
				self.timer = threading.Timer(0.01, self.chase, args=(
					previous_chase_start_index, previous_time_stamp))
				self.timer.start()

	# callable signature: chase_index, led_index, returns color tuple
	def create_chase_color_provider(self) -> Callable[[int, int], Tuple[int, int, int]]:
		if self.chase_gradient_length > 0 and self.chase_length > 1:
			rising_gradient_exclusive_end_index = self.chase_gradient_length
			descending_gradient_start_index = self.chase_length - self.chase_gradient_length

			def get_chase_color(chase_index: int, led_index: int) -> Tuple[int, int, int]:
				merge_factor = None
				if chase_index < rising_gradient_exclusive_end_index:
					merge_factor = (chase_index + 1) / \
						(self.chase_gradient_length + 1)
				elif chase_index >= descending_gradient_start_index:
					merge_factor = (descending_gradient_start_index + self.chase_gradient_length -
									chase_index) / (self.chase_gradient_length + 1)

				if merge_factor is None:
					return self.chase_color_list[led_index]
				else:
					return self.merge_color_tuples(self.background_color_list[led_index], self.chase_color_list[led_index], merge_factor)

		else:
			def get_chase_color(chase_index: int, led_index: int) -> Tuple[int, int, int]:
				return self.chase_color_list[led_index]

		return get_chase_color

	def fill_chase(self, start_index: int):
		exclusive_end_index = (
			start_index + self.chase_length) % PatternAnimator.LED_COUNT

		chase_index = 0

		if(start_index < exclusive_end_index):
			for i in range(start_index, exclusive_end_index):
				self.leds[i] = self.get_chase_color(chase_index, i)
				chase_index = chase_index + 1

		else:
			for i in range(start_index, PatternAnimator.LED_COUNT):
				self.leds[i] = self.get_chase_color(chase_index, i)
				chase_index = chase_index + 1

			for i in range(0, exclusive_end_index):
				self.leds[i] = self.get_chase_color(chase_index, i)
				chase_index = chase_index + 1
