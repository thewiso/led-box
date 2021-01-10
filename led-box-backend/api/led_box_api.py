import connexion
from .model.led_pattern import LEDPattern
from db import led_box_db
import json
from typing import Tuple, Any, List
import logging

__LOG = logging.getLogger('LedBoxAPI')


def create_pattern(body: dict):
	__LOG.info("Received 'create_pattern' request")
	__LOG.debug(body)
	id = led_box_db.insert_pattern(body)
	return id, 201


def get_patterns():
	__LOG.info("Received 'get_patterns' request")
	return led_box_db.get_patterns()


def run_pattern(body=None):
	__LOG.info("Received 'run_pattern' request")
	__LOG.debug(body)

	"""run_pattern

	Put new active pattern # noqa: E501

	:param body: 
	:type body: int

	:rtype: None
	"""
	return 'do some magic!'


def update_pattern(id_: int, body: dict):
	__LOG.info(f"Received 'update_pattern' request for id {id}")
	__LOG.debug(body)

	if led_box_db.is_pattern_existing(id_):
		led_box_db.update_pattern(id_, body)
		return None, 200
	else:
		return None, 404
