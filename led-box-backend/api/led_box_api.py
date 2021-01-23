import connexion
from .model.led_pattern import LEDPattern
from db import led_box_db
import json
from typing import Tuple, Any, List
import logging
import led_controller.pattern_controller as pattern_controller

__LOG = logging.getLogger('LedBoxAPI')


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

    id = body["id"]
    if led_box_db.is_pattern_existing(id):
        pattern_dict = led_box_db.get_pattern(id)
        led_pattern = LEDPattern.from_dict(pattern_dict)
        pattern_controller.start_pattern_display(led_pattern)

        return None, 204
    else:
        return None, 404


def stop_pattern():
    __LOG.info("Received 'stop_pattern' request")
    pattern_controller.stop_pattern_display()

    return None, 204
