# coding: utf-8

from __future__ import absolute_import
from datetime import date, datetime  # noqa: F401

from typing import List, Dict  # noqa: F401

from ...base.models.base_model_ import Model
from ...base.models.color import Color
from ...base import util

from ...base.models.color import Color  # noqa: E501

class LEDPattern(Model):
    """NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).

    Do not edit the class manually.
    """

    def __init__(self, id=None, name=None, colors=None, repition_factor=None, color_gradient_length_factor=None, pattern_type=None):  # noqa: E501
        """LEDPattern - a model defined in OpenAPI

        :param id: The id of this LEDPattern.  # noqa: E501
        :type id: int
        :param name: The name of this LEDPattern.  # noqa: E501
        :type name: str
        :param colors: The colors of this LEDPattern.  # noqa: E501
        :type colors: List[Color]
        :param repition_factor: The repition_factor of this LEDPattern.  # noqa: E501
        :type repition_factor: float
        :param color_gradient_length_factor: The color_gradient_length_factor of this LEDPattern.  # noqa: E501
        :type color_gradient_length_factor: float
        :param pattern_type: The pattern_type of this LEDPattern.  # noqa: E501
        :type pattern_type: str
        """
        self.openapi_types = {
            'id': int,
            'name': str,
            'colors': List[Color],
            'repition_factor': float,
            'color_gradient_length_factor': float,
            'pattern_type': str
        }

        self.attribute_map = {
            'id': 'id',
            'name': 'name',
            'colors': 'colors',
            'repition_factor': 'repitionFactor',
            'color_gradient_length_factor': 'colorGradientLengthFactor',
            'pattern_type': 'patternType'
        }

        self._id = id
        self._name = name
        self._colors = colors
        self._repition_factor = repition_factor
        self._color_gradient_length_factor = color_gradient_length_factor
        self._pattern_type = pattern_type

    @classmethod
    def from_dict(cls, dikt) -> 'LEDPattern':
        """Returns the dict as a model

        :param dikt: A dict.
        :type: dict
        :return: The LEDPattern of this LEDPattern.  # noqa: E501
        :rtype: LEDPattern
        """
        return util.deserialize_model(dikt, cls)

    @property
    def id(self):
        """Gets the id of this LEDPattern.


        :return: The id of this LEDPattern.
        :rtype: int
        """
        return self._id

    @id.setter
    def id(self, id):
        """Sets the id of this LEDPattern.


        :param id: The id of this LEDPattern.
        :type id: int
        """

        self._id = id

    @property
    def name(self):
        """Gets the name of this LEDPattern.


        :return: The name of this LEDPattern.
        :rtype: str
        """
        return self._name

    @name.setter
    def name(self, name):
        """Sets the name of this LEDPattern.


        :param name: The name of this LEDPattern.
        :type name: str
        """
        if name is None:
            raise ValueError("Invalid value for `name`, must not be `None`")  # noqa: E501
        if name is not None and len(name) > 20:
            raise ValueError("Invalid value for `name`, length must be less than or equal to `20`")  # noqa: E501
        if name is not None and len(name) < 3:
            raise ValueError("Invalid value for `name`, length must be greater than or equal to `3`")  # noqa: E501

        self._name = name

    @property
    def colors(self):
        """Gets the colors of this LEDPattern.

        Colors that will be displayed in-line  # noqa: E501

        :return: The colors of this LEDPattern.
        :rtype: List[Color]
        """
        return self._colors

    @colors.setter
    def colors(self, colors):
        """Sets the colors of this LEDPattern.

        Colors that will be displayed in-line  # noqa: E501

        :param colors: The colors of this LEDPattern.
        :type colors: List[Color]
        """
        if colors is None:
            raise ValueError("Invalid value for `colors`, must not be `None`")  # noqa: E501
        if colors is not None and len(colors) > 5:
            raise ValueError("Invalid value for `colors`, number of items must be less than or equal to `5`")  # noqa: E501
        if colors is not None and len(colors) < 1:
            raise ValueError("Invalid value for `colors`, number of items must be greater than or equal to `1`")  # noqa: E501

        self._colors = colors

    @property
    def repition_factor(self):
        """Gets the repition_factor of this LEDPattern.

        Describes how often the colors will be repeated in the LED strip. 0 = No repetition, 1 = One LED per color  # noqa: E501

        :return: The repition_factor of this LEDPattern.
        :rtype: float
        """
        return self._repition_factor

    @repition_factor.setter
    def repition_factor(self, repition_factor):
        """Sets the repition_factor of this LEDPattern.

        Describes how often the colors will be repeated in the LED strip. 0 = No repetition, 1 = One LED per color  # noqa: E501

        :param repition_factor: The repition_factor of this LEDPattern.
        :type repition_factor: float
        """
        if repition_factor is None:
            raise ValueError("Invalid value for `repition_factor`, must not be `None`")  # noqa: E501
        if repition_factor is not None and repition_factor > 1:  # noqa: E501
            raise ValueError("Invalid value for `repition_factor`, must be a value less than or equal to `1`")  # noqa: E501
        if repition_factor is not None and repition_factor < 0:  # noqa: E501
            raise ValueError("Invalid value for `repition_factor`, must be a value greater than or equal to `0`")  # noqa: E501

        self._repition_factor = repition_factor

    @property
    def color_gradient_length_factor(self):
        """Gets the color_gradient_length_factor of this LEDPattern.

        Describes how many of the LED of one color create a gradient to the next and previous color. 0 = No gradient, 0.5 Half of LED create a gradient to the next and previous color  # noqa: E501

        :return: The color_gradient_length_factor of this LEDPattern.
        :rtype: float
        """
        return self._color_gradient_length_factor

    @color_gradient_length_factor.setter
    def color_gradient_length_factor(self, color_gradient_length_factor):
        """Sets the color_gradient_length_factor of this LEDPattern.

        Describes how many of the LED of one color create a gradient to the next and previous color. 0 = No gradient, 0.5 Half of LED create a gradient to the next and previous color  # noqa: E501

        :param color_gradient_length_factor: The color_gradient_length_factor of this LEDPattern.
        :type color_gradient_length_factor: float
        """
        if color_gradient_length_factor is None:
            raise ValueError("Invalid value for `color_gradient_length_factor`, must not be `None`")  # noqa: E501
        if color_gradient_length_factor is not None and color_gradient_length_factor > 0.5:  # noqa: E501
            raise ValueError("Invalid value for `color_gradient_length_factor`, must be a value less than or equal to `0.5`")  # noqa: E501
        if color_gradient_length_factor is not None and color_gradient_length_factor < 0:  # noqa: E501
            raise ValueError("Invalid value for `color_gradient_length_factor`, must be a value greater than or equal to `0`")  # noqa: E501

        self._color_gradient_length_factor = color_gradient_length_factor

    @property
    def pattern_type(self):
        """Gets the pattern_type of this LEDPattern.


        :return: The pattern_type of this LEDPattern.
        :rtype: str
        """
        return self._pattern_type

    @pattern_type.setter
    def pattern_type(self, pattern_type):
        """Sets the pattern_type of this LEDPattern.


        :param pattern_type: The pattern_type of this LEDPattern.
        :type pattern_type: str
        """
        if pattern_type is None:
            raise ValueError("Invalid value for `pattern_type`, must not be `None`")  # noqa: E501

        self._pattern_type = pattern_type