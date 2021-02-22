import connexion
import six

from ...base.models.led_pattern import LEDPattern  # noqa: E501
from ...base import util


def create_pattern(led_pattern):  # noqa: E501
    """create_pattern

     # noqa: E501

    :param led_pattern: 
    :type led_pattern: dict | bytes

    :rtype: int
    """
    if connexion.request.is_json:
        led_pattern = LEDPattern.from_dict(connexion.request.get_json())  # noqa: E501
    return 'do some magic!'


def delete_all_patterns(restore_examples=None):  # noqa: E501
    """delete_all_patterns

    Delete all patterns # noqa: E501

    :param restore_examples: Flag indicating if the examples should be restored
    :type restore_examples: bool

    :rtype: None
    """
    return 'do some magic!'


def get_active_pattern():  # noqa: E501
    """get_active_pattern

    Get currently active pattern id # noqa: E501


    :rtype: int
    """
    return 'do some magic!'


def get_patterns():  # noqa: E501
    """get_patterns

    Get all patterns # noqa: E501


    :rtype: List[LEDPattern]
    """
    return 'do some magic!'


def run_pattern(body):  # noqa: E501
    """run_pattern

    Put new active pattern # noqa: E501

    :param body: 
    :type body: int

    :rtype: None
    """
    return 'do some magic!'


def shutdown_server():  # noqa: E501
    """shutdown_server

    Shutdown server and hosting system # noqa: E501


    :rtype: None
    """
    return 'do some magic!'


def stop_pattern():  # noqa: E501
    """stop_pattern

    Stop currently active pattern # noqa: E501


    :rtype: None
    """
    return 'do some magic!'


def update_pattern(id, led_pattern):  # noqa: E501
    """update_pattern

     # noqa: E501

    :param id: 
    :type id: int
    :param led_pattern: 
    :type led_pattern: dict | bytes

    :rtype: None
    """
    if connexion.request.is_json:
        led_pattern = LEDPattern.from_dict(connexion.request.get_json())  # noqa: E501
    return 'do some magic!'
