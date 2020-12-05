from abc import ABC, abstractmethod
import adafruit_ws2801
from api.model.led_pattern import LEDPattern
import math


class PatternAnimator(ABC):
    LED_COUNT = 160

    def __init__(self, leds: adafruit_ws2801.WS2801, led_pattern: LEDPattern):
        self.leds = leds
        self.led_pattern = led_pattern
        self.led_color_list = None
        self.init_led_color_list()

    @abstractmethod
    def start(self):
        pass

    @abstractmethod
    def stop(self):
        pass

    def init_led_color_list(self):
        self.led_color_list = []

        color_count = len(self.led_pattern.colors)
        led_color_share = math.floor(PatternAnimator.LED_COUNT / color_count)

        led_count_per_color_in_repition = math.ceil(
            (1 - self.led_pattern.repition_factor) * led_color_share)
        if led_count_per_color_in_repition == 0:
            led_count_per_color_in_repition = 1

        color_gradient_length_per_color = math.floor(
            led_count_per_color_in_repition * self.led_pattern.color_gradient_length_factor)
        color_gradient_merge_factor = 1 / \
            (color_gradient_length_per_color * 2 + 1)

        for i in range(0, PatternAnimator.LED_COUNT):
            current_color_index = math.floor(
                i / led_count_per_color_in_repition) % color_count
            index_in_repition = i % led_count_per_color_in_repition

            # a bit hacky, but otherwise the remaining leds won't be filled
            if (
                self.led_pattern.color_gradient_length_factor == 0 and
                self.led_pattern.repition_factor == 0 and
                current_color_index == 0 and
                i > led_count_per_color_in_repition
            ):
                current_color_index = color_count - 1

            current_color = self.led_pattern.colors[current_color_index]

            if (self.led_pattern.color_gradient_length_factor > 0 and led_count_per_color_in_repition > 1):
                previous_color_index = current_color_index - 1 if current_color_index > 0 \
                    else color_count - 1
                previous_color = self.led_pattern.colors[previous_color_index]

                next_color_index = current_color_index + 1 if current_color_index < color_count - 1 \
                    else 0
                next_color = self.led_pattern.colors[next_color_index]

                if index_in_repition < color_gradient_length_per_color:
                    led_in_gradient_index = index_in_repition + color_gradient_length_per_color
                    gradient_factor = color_gradient_merge_factor * \
                        (led_in_gradient_index + 1)
                    current_color = self.merge_colors(
                        previous_color, current_color, gradient_factor)
                elif index_in_repition >= led_count_per_color_in_repition - color_gradient_length_per_color:
                    led_in_gradient_index = index_in_repition - \
                        led_count_per_color_in_repition + color_gradient_length_per_color
                    gradient_factor = color_gradient_merge_factor * \
                        (led_in_gradient_index + 1)
                    current_color = self.merge_colors(
                        current_color, next_color, gradient_factor)
            self.led_color_list.append(current_color)

    def merge_colors(self, color_1: tuple, color_2: tuple, factor: float):
        return (
            self.merge_primary_color(color_1[0], color_2[0], factor),
            self.merge_primary_color(color_1[1], color_2[1], factor),
            self.merge_primary_color(color_1[2], color_2[2], factor),
        )

    def merge_primary_color(self, primary_color_1: int, primary_color_2: int, factor: float):
        return round((1 - factor) * primary_color_1 + factor * primary_color_2)

    def fill_and_show_leds(self, led_colors: list):
        for i in range(0, PatternAnimator.LED_COUNT):
            self.leds[i] = led_colors[i]
        self.leds.show()

    def clear_leds(self):
        self.leds.fill((0, 0, 0))
        self.leds.show()
