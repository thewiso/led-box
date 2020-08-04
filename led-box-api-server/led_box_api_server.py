#!/usr/bin/env python3

import connexion
from connexion.resolver import RestyResolver
from api.util import encoder
from api.util.camel_case_resolver import CamelCaseResolver

app = connexion.App(__name__)


def main():
    app.app.json_encoder = encoder.JSONEncoder
    app.add_api('../openapi.yaml',
                arguments={'title': 'LED Box API'},
                resolver=CamelCaseResolver('api.led_box_api'),
                pythonic_params=True)
    app.run(port=8080)


if __name__ == '__main__':
    main()
