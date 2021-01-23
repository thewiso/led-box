# coding: utf-8

from __future__ import absolute_import
from datetime import date, datetime  # noqa: F401

from typing import List, Dict  # noqa: F401

from api.model.base_model_ import Model
from api.util import util


class Color(Model):
    """NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).

    Do not edit the class manually.
    """

    def __init__(self, r=None, g=None, b=None):  # noqa: E501
        """Color - a model defined in OpenAPI

        :param r: The r of this Color.  # noqa: E501
        :type r: int
        :param g: The g of this Color.  # noqa: E501
        :type g: int
        :param b: The b of this Color.  # noqa: E501
        :type b: int
        """
        self.openapi_types = {
            'r': int,
            'g': int,
            'b': int
        }

        self.attribute_map = {
            'r': 'r',
            'g': 'g',
            'b': 'b'
        }

        self._r = r
        self._g = g
        self._b = b

    @classmethod
    def from_dict(cls, dikt) -> 'Color':
        """Returns the dict as a model

        :param dikt: A dict.
        :type: dict
        :return: The Color of this Color.  # noqa: E501
        :rtype: Color
        """
        return util.deserialize_model(dikt, cls)

    @property
    def r(self):
        """Gets the r of this Color.

        Red  # noqa: E501

        :return: The r of this Color.
        :rtype: int
        """
        return self._r

    @r.setter
    def r(self, r):
        """Sets the r of this Color.

        Red  # noqa: E501

        :param r: The r of this Color.
        :type r: int
        """
        if r is None:
            raise ValueError("Invalid value for `r`, must not be `None`")  # noqa: E501
        if r is not None and r > 255:  # noqa: E501
            raise ValueError("Invalid value for `r`, must be a value less than or equal to `255`")  # noqa: E501
        if r is not None and r < 0:  # noqa: E501
            raise ValueError("Invalid value for `r`, must be a value greater than or equal to `0`")  # noqa: E501

        self._r = r

    @property
    def g(self):
        """Gets the g of this Color.

        Green  # noqa: E501

        :return: The g of this Color.
        :rtype: int
        """
        return self._g

    @g.setter
    def g(self, g):
        """Sets the g of this Color.

        Green  # noqa: E501

        :param g: The g of this Color.
        :type g: int
        """
        if g is None:
            raise ValueError("Invalid value for `g`, must not be `None`")  # noqa: E501
        if g is not None and g > 255:  # noqa: E501
            raise ValueError("Invalid value for `g`, must be a value less than or equal to `255`")  # noqa: E501
        if g is not None and g < 0:  # noqa: E501
            raise ValueError("Invalid value for `g`, must be a value greater than or equal to `0`")  # noqa: E501

        self._g = g

    @property
    def b(self):
        """Gets the b of this Color.

        Blue  # noqa: E501

        :return: The b of this Color.
        :rtype: int
        """
        return self._b

    @b.setter
    def b(self, b):
        """Sets the b of this Color.

        Blue  # noqa: E501

        :param b: The b of this Color.
        :type b: int
        """
        if b is None:
            raise ValueError("Invalid value for `b`, must not be `None`")  # noqa: E501
        if b is not None and b > 255:  # noqa: E501
            raise ValueError("Invalid value for `b`, must be a value less than or equal to `255`")  # noqa: E501
        if b is not None and b < 0:  # noqa: E501
            raise ValueError("Invalid value for `b`, must be a value greater than or equal to `0`")  # noqa: E501

        self._b = b
