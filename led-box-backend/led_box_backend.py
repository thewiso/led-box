#!/usr/bin/env python3

import connexion
from connexion.resolver import RestyResolver
from api.util import encoder
from api.util.camel_case_resolver import CamelCaseResolver
import logging
import sys

app = connexion.App(__name__)
app.app.json_encoder = encoder.JSONEncoder
app.add_api('../openapi.yaml',
            arguments={'title': 'LED Box API'},
            resolver=CamelCaseResolver('api.led_box_api'),
            pythonic_params=True,
            base_path="/api")

application = app.app

# LOGGING CONFIG
formatter = logging.Formatter(
    '%(asctime)s - %(name)s - %(levelname)s - %(message)s')
streamHandler = logging.StreamHandler(sys.stdout)
streamHandler.setFormatter(formatter)

rootLogger = logging.getLogger()
rootLogger.addHandler(streamHandler)
rootLogger.setLevel(logging.INFO)


def main():
    app.run(port=8080)


if __name__ == '__main__':
    main()
