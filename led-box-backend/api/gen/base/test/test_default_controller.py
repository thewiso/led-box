# coding: utf-8

from __future__ import absolute_import
import unittest

from flask import json
from six import BytesIO

from ...base.models.led_pattern import LEDPattern  # noqa: E501
from ...base.test import BaseTestCase


class TestDefaultController(BaseTestCase):
    """DefaultController integration test stubs"""

    def test_create_pattern(self):
        """Test case for create_pattern

        
        """
        led_pattern = {
  "repitionFactor" : 0.5637377,
  "colorGradientLengthFactor" : 0.11510679,
  "name" : "name",
  "patternType" : "patternType",
  "id" : 0,
  "colors" : [ {
    "r" : 153,
    "b" : 152,
    "g" : 37
  }, {
    "r" : 153,
    "b" : 152,
    "g" : 37
  }, {
    "r" : 153,
    "b" : 152,
    "g" : 37
  }, {
    "r" : 153,
    "b" : 152,
    "g" : 37
  }, {
    "r" : 153,
    "b" : 152,
    "g" : 37
  } ]
}
        headers = { 
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        }
        response = self.client.open(
            '/led-patterns',
            method='POST',
            headers=headers,
            data=json.dumps(led_pattern),
            content_type='application/json')
        self.assert200(response,
                       'Response body is : ' + response.data.decode('utf-8'))

    def test_delete_all_patterns(self):
        """Test case for delete_all_patterns

        
        """
        query_string = [('restoreExamples', True)]
        headers = { 
        }
        response = self.client.open(
            '/led-patterns',
            method='DELETE',
            headers=headers,
            query_string=query_string)
        self.assert200(response,
                       'Response body is : ' + response.data.decode('utf-8'))

    def test_get_active_pattern(self):
        """Test case for get_active_pattern

        
        """
        headers = { 
            'Accept': 'application/json',
        }
        response = self.client.open(
            '/led-patterns/active',
            method='GET',
            headers=headers)
        self.assert200(response,
                       'Response body is : ' + response.data.decode('utf-8'))

    def test_get_patterns(self):
        """Test case for get_patterns

        
        """
        headers = { 
            'Accept': 'application/json',
        }
        response = self.client.open(
            '/led-patterns',
            method='GET',
            headers=headers)
        self.assert200(response,
                       'Response body is : ' + response.data.decode('utf-8'))

    def test_run_pattern(self):
        """Test case for run_pattern

        
        """
        body = 56
        headers = { 
            'Content-Type': 'application/json',
        }
        response = self.client.open(
            '/led-patterns/active',
            method='PUT',
            headers=headers,
            data=json.dumps(body),
            content_type='application/json')
        self.assert200(response,
                       'Response body is : ' + response.data.decode('utf-8'))

    def test_shutdown_server(self):
        """Test case for shutdown_server

        
        """
        headers = { 
        }
        response = self.client.open(
            '/server/shutdown',
            method='POST',
            headers=headers)
        self.assert200(response,
                       'Response body is : ' + response.data.decode('utf-8'))

    def test_stop_pattern(self):
        """Test case for stop_pattern

        
        """
        headers = { 
        }
        response = self.client.open(
            '/led-patterns/active',
            method='DELETE',
            headers=headers)
        self.assert200(response,
                       'Response body is : ' + response.data.decode('utf-8'))

    def test_update_pattern(self):
        """Test case for update_pattern

        
        """
        led_pattern = {
  "repitionFactor" : 0.5637377,
  "colorGradientLengthFactor" : 0.11510679,
  "name" : "name",
  "patternType" : "patternType",
  "id" : 0,
  "colors" : [ {
    "r" : 153,
    "b" : 152,
    "g" : 37
  }, {
    "r" : 153,
    "b" : 152,
    "g" : 37
  }, {
    "r" : 153,
    "b" : 152,
    "g" : 37
  }, {
    "r" : 153,
    "b" : 152,
    "g" : 37
  }, {
    "r" : 153,
    "b" : 152,
    "g" : 37
  } ]
}
        headers = { 
            'Content-Type': 'application/json',
        }
        response = self.client.open(
            '/led-patterns/{id}'.format(id=56),
            method='PATCH',
            headers=headers,
            data=json.dumps(led_pattern),
            content_type='application/json')
        self.assert200(response,
                       'Response body is : ' + response.data.decode('utf-8'))


if __name__ == '__main__':
    unittest.main()
