# coding: utf-8

from __future__ import absolute_import
from datetime import date, datetime  # noqa: F401

from typing import List, Dict  # noqa: F401

from .base_model_ import Model
from api.util import util


class BlinkLEDPatternAllOf(Model):
    """NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).

    Do not edit the class manually.
    """

    def __init__(self, blink_speed=None, blink_dimming_period_factor=None):  # noqa: E501
        """BlinkLEDPatternAllOf - a model defined in OpenAPI

        :param blink_speed: The blink_speed of this BlinkLEDPatternAllOf.  # noqa: E501
        :type blink_speed: float
        :param blink_dimming_period_factor: The blink_dimming_period_factor of this BlinkLEDPatternAllOf.  # noqa: E501
        :type blink_dimming_period_factor: float
        """
        self.openapi_types = {
            'blink_speed': float,
            'blink_dimming_period_factor': float
        }

        self.attribute_map = {
            'blink_speed': 'blinkSpeed',
            'blink_dimming_period_factor': 'blinkDimmingPeriodFactor'
        }

        self._blink_speed = blink_speed
        self._blink_dimming_period_factor = blink_dimming_period_factor

    @classmethod
    def from_dict(cls, dikt) -> 'BlinkLEDPatternAllOf':
        """Returns the dict as a model

        :param dikt: A dict.
        :type: dict
        :return: The BlinkLEDPattern_allOf of this BlinkLEDPatternAllOf.  # noqa: E501
        :rtype: BlinkLEDPatternAllOf
        """
        return util.deserialize_model(dikt, cls)

    @property
    def blink_speed(self):
        """Gets the blink_speed of this BlinkLEDPatternAllOf.

        Describes how often the LED will blink in a second  # noqa: E501

        :return: The blink_speed of this BlinkLEDPatternAllOf.
        :rtype: float
        """
        return self._blink_speed

    @blink_speed.setter
    def blink_speed(self, blink_speed):
        """Sets the blink_speed of this BlinkLEDPatternAllOf.

        Describes how often the LED will blink in a second  # noqa: E501

        :param blink_speed: The blink_speed of this BlinkLEDPatternAllOf.
        :type blink_speed: float
        """
        if blink_speed is None:
            raise ValueError("Invalid value for `blink_speed`, must not be `None`")  # noqa: E501
        if blink_speed is not None and blink_speed > 3:  # noqa: E501
            raise ValueError("Invalid value for `blink_speed`, must be a value less than or equal to `3`")  # noqa: E501
        if blink_speed is not None and blink_speed < 0.1:  # noqa: E501
            raise ValueError("Invalid value for `blink_speed`, must be a value greater than or equal to `0.1`")  # noqa: E501

        self._blink_speed = blink_speed

    @property
    def blink_dimming_period_factor(self):
        """Gets the blink_dimming_period_factor of this BlinkLEDPatternAllOf.

        Describes how much of the blinking time is used for blinking. 0 = No dimming, 1 = Full period between on and off will be dimmed  # noqa: E501

        :return: The blink_dimming_period_factor of this BlinkLEDPatternAllOf.
        :rtype: float
        """
        return self._blink_dimming_period_factor

    @blink_dimming_period_factor.setter
    def blink_dimming_period_factor(self, blink_dimming_period_factor):
        """Sets the blink_dimming_period_factor of this BlinkLEDPatternAllOf.

        Describes how much of the blinking time is used for blinking. 0 = No dimming, 1 = Full period between on and off will be dimmed  # noqa: E501

        :param blink_dimming_period_factor: The blink_dimming_period_factor of this BlinkLEDPatternAllOf.
        :type blink_dimming_period_factor: float
        """
        if blink_dimming_period_factor is None:
            raise ValueError("Invalid value for `blink_dimming_period_factor`, must not be `None`")  # noqa: E501
        if blink_dimming_period_factor is not None and blink_dimming_period_factor > 1:  # noqa: E501
            raise ValueError("Invalid value for `blink_dimming_period_factor`, must be a value less than or equal to `1`")  # noqa: E501
        if blink_dimming_period_factor is not None and blink_dimming_period_factor < 0:  # noqa: E501
            raise ValueError("Invalid value for `blink_dimming_period_factor`, must be a value greater than or equal to `0`")  # noqa: E501

        self._blink_dimming_period_factor = blink_dimming_period_factor