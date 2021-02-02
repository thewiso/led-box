import connexion
from .model.led_pattern import LEDPattern
from .model.blink_led_pattern import BlinkLEDPattern
from .model.chase_led_pattern import ChaseLEDPattern
from db import led_box_db
import json
from typing import Tuple, Any, List
import logging
import led_controller.pattern_controller as pattern_controller
import subprocess

__LOG = logging.getLogger(__name__)


def create_pattern(body: dict):
    __LOG.info("Received 'create_pattern' request")
    __LOG.debug(body)

    id = led_box_db.insert_pattern(body)
    return id, 201


def update_pattern(id_: int, body: dict):
    __LOG.info(f"Received 'update_pattern' request for id {id}")
    __LOG.debug(body)

    if led_box_db.is_pattern_existing(id_):
        led_box_db.update_pattern(id_, body)
        return None, 200
    else:
        return None, 404


def get_patterns():
    __LOG.info("Received 'get_patterns' request")
    return led_box_db.get_patterns()


def get_active_pattern():
    __LOG.info("Received 'get_active_pattern' request")
    active_pattern_id = pattern_controller.get_active_pattern_id()

    if active_pattern_id is not None:
        return active_pattern_id, 200
    else:
        return None, 404


def run_pattern(body=None):
    __LOG.info("Received 'run_pattern' request")
    __LOG.debug(body)

    id = body
    if led_box_db.is_pattern_existing(id):
        pattern_dict = led_box_db.get_pattern(id)

        if pattern_dict["patternType"] == "BlinkLEDPattern":
            led_pattern = BlinkLEDPattern.from_dict(pattern_dict)
        elif pattern_dict["patternType"] == "ChaseLEDPattern":
            led_pattern = ChaseLEDPattern.from_dict(pattern_dict)
        else:
            led_pattern = LEDPattern.from_dict(pattern_dict)

        pattern_controller.start_pattern_display(led_pattern)

        return None, 204
    else:
        return None, 404


def stop_pattern():
    __LOG.info("Received 'stop_pattern' request")
    pattern_controller.stop_pattern_display()

    return None, 204


def deleteAllPatterns(body):
    __LOG.info("Received 'deleteAllPatterns' request")
    __LOG.debug(body)

    led_box_db.drop_and_create_tables()
    if(body == True):
        led_box_db.insert_example_pattern()


def shutdownServer():
    __LOG.info("Received 'shutdownServer' request")

    pattern_controller.stop_pattern_display()
    __LOG.info("Shutting down system...")
    completed_process = subprocess.run(
        "sudo shutdown -h now", shell=True, capture_output=True, text=True)

    if completed_process.returncode != 0:
        __LOG.info(f"Could not shutdown system: {completed_process.stdout}")
