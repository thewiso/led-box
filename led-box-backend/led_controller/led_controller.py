import board
import adafruit_ws2801
from time import sleep
import json
import math

# TODO: init
led_count = 160
leds = adafruit_ws2801.WS2801(
    board.SCK, board.MOSI, led_count, auto_write=False)
leds.deinit()
leds = adafruit_ws2801.WS2801(
    board.SCK, board.MOSI, led_count, auto_write=False)
leds.fill((0, 0, 0))


def create_led_color_list(led_pattern):
    led_color_list = []
    pattern_colors = led_pattern["colors"]
    color_gradient_length_factor = led_pattern["colorGradientLengthFactor"]
    repition_factor = led_pattern["repitionFactor"]

    color_count = len(pattern_colors)
    led_color_share = math.floor(led_count / color_count)

    led_count_per_color_in_repition = math.ceil(
        (1 - repition_factor) * led_color_share)
    if led_count_per_color_in_repition == 0:
        led_count_per_color_in_repition = 1

    color_gradient_length_per_color = math.floor(
        led_count_per_color_in_repition * color_gradient_length_factor)
    color_gradient_merge_factor = 1 / (color_gradient_length_per_color * 2 + 1)

    for i in range(0, led_count):
        current_color_index = math.floor(
            i / led_count_per_color_in_repition) % color_count
        index_in_repition = i % led_count_per_color_in_repition

        # a bit hacky, but otherwise the remaining leds won't be filled
        if (
            color_gradient_length_factor == 0 and
            repition_factor == 0 and
            current_color_index == 0 and
            i > led_count_per_color_in_repition
        ):
            current_color_index = color_count - 1

        current_color = get_color_from_json_list(
            pattern_colors, current_color_index)

        if (color_gradient_length_factor > 0 and led_count_per_color_in_repition > 1):
            previous_color_index = current_color_index - 1 if current_color_index > 0 \
                else color_count - 1
            previous_color = get_color_from_json_list(
                pattern_colors, previous_color_index)

            next_color_index = current_color_index + 1 if current_color_index < color_count - 1 \
                else 0
            next_color = get_color_from_json_list(
                pattern_colors, next_color_index)

            if index_in_repition < color_gradient_length_per_color:
                led_in_gradient_index = index_in_repition + color_gradient_length_per_color
                gradient_factor = color_gradient_merge_factor * \
                    (led_in_gradient_index + 1)
                current_color = merge_colors(
                    previous_color, current_color, gradient_factor)
            elif index_in_repition >= led_count_per_color_in_repition - color_gradient_length_per_color:
                led_in_gradient_index = index_in_repition - \
                    led_count_per_color_in_repition + color_gradient_length_per_color
                gradient_factor = color_gradient_merge_factor * \
                    (led_in_gradient_index + 1)
                current_color = merge_colors(
                    current_color, next_color, gradient_factor)
        led_color_list.append(current_color)

    return led_color_list


def get_color_from_json_list(colors: list, index: int):
    color_json = colors[index]
    return (
        color_json["r"],
        color_json["g"],
        color_json["b"]
    )


def merge_colors(color_1: tuple, color_2: tuple, factor: float):
    return (
        merge_primary_color(color_1[0], color_2[0], factor),
        merge_primary_color(color_1[1], color_2[1], factor),
        merge_primary_color(color_1[2], color_2[2], factor),
    )


def merge_primary_color(primary_color_1: int, primary_color_2: int, factor: float):
    return round((1 - factor) * primary_color_1 + factor * primary_color_2)


def fill_and_show_leds(led_colors: list):
    for i in range(0, led_count):
        leds[i] = led_colors[i]
    leds.show()


def start_pattern_


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
led_color_list = create_led_color_list(led_pattern)
fill_and_show_leds(led_color_list)

"""
chase_length = 20
chase_color = (234, 10, 142)
background_color = (0, 0, 0)
for i in range(0, chase_length):
    leds[i] = chase_color


i = 0
while True:
    leds[i] = background_color


    i += 1
    if i >= led_count:
        i = 0

    endIndex = i + chase_length
    if endIndex >= led_count:
        endIndex %= led_count

    leds[endIndex] = chase_color
    leds.show()
    sleep(0.01)
"""
