import sqlite3
import threading
from api.model.led_pattern import LEDPattern
import json
from typing import List
import logging
import os

# SQL queries and commands
insert_pattern_template = 'INSERT INTO LED_PATTERN (JSON) values (?)'
update_pattern_template = 'UPDATE LED_PATTERN SET JSON = ? WHERE ID = ?'
select_pattern_count_template = 'SELECT COUNT(*) FROM LED_PATTERN WHERE ID=?'
select_all_patterns = 'SELECT ID, JSON FROM LED_PATTERN'
select_pattern_template = 'SELECT  ID, JSON FROM LED_PATTERN WHERE ID=?'

select_last_insert_rowid = 'SELECT last_insert_rowid()'
select_led_pattern_table = 'SELECT count(*) FROM sqlite_master WHERE name = \'LED_PATTERN\''

# init connection and db
__db_file_path = os.path.join(os.path.dirname(__file__), 'led_box.sqlite')
__ddl_file_path = os.path.join(os.path.dirname(__file__), 'ddl.sql')
__example_patterns_file_path = os.path.join(
    os.path.dirname(__file__), 'example_patterns.sql')

__connection = sqlite3.connect(__db_file_path, check_same_thread=False)
__db_lock = threading.Lock()
__LOG = logging.getLogger('LedBoxDB')


def __init_db():
    cursor = __connection.cursor()
    cursor.execute(select_led_pattern_table)
    table_count = cursor.fetchone()[0]
    if(table_count == 0):
        __LOG.info("No table found in database, initializing database...")
        drop_and_create_tables()
        insert_example_pattern()


def drop_and_create_tables():
    __LOG.info("Dropping and creating tables...")
    __db_lock.acquire()

    cursor = __connection.cursor()
    ddl_file = open(__ddl_file_path)
    ddl_script = ddl_file.read()
    cursor.executescript(ddl_script)

    __db_lock.release()


def insert_example_pattern():
    __LOG.info("Inserting example patterns...")
    __db_lock.acquire()

    cursor = __connection.cursor()
    example_patterns_file = open(__example_patterns_file_path)
    example_patterns_script = example_patterns_file.read()
    cursor.executescript(example_patterns_script)

    __db_lock.release()


__init_db()


def insert_pattern(pattern_dict: dict) -> int:
    __db_lock.acquire()
    cursor = __connection.cursor()

    cursor.execute(insert_pattern_template, (json.dumps(pattern_dict),))
    cursor.execute(select_last_insert_rowid)
    id = cursor.fetchone()[0]
    __connection.commit()
    __db_lock.release()

    return id


def get_patterns() -> List[dict]:
    __db_lock.acquire()
    cursor = __connection.cursor()

    cursor.execute(select_all_patterns)
    result_list = cursor.fetchall()
    __db_lock.release()

    pattern_list = []

    for result in result_list:
        id = result[0]
        jsonString = result[1]

        jsonDict = json.loads(jsonString)
        jsonDict['id'] = id

        pattern_list.append(jsonDict)

    return pattern_list


def is_pattern_existing(id: int) -> bool:
    __db_lock.acquire()
    cursor = __connection.cursor()

    cursor.execute(select_pattern_count_template, (id,))
    count = cursor.fetchone()[0]
    __db_lock.release()

    return count == 1


def update_pattern(id: int, pattern_dict: dict):
    pattern_dict['id'] = id
    __db_lock.acquire()
    cursor = __connection.cursor()

    cursor.execute(update_pattern_template, (json.dumps(pattern_dict), id))
    __connection.commit()
    __db_lock.release()


def get_pattern(id: int):
    __db_lock.acquire()
    cursor = __connection.cursor()

    cursor.execute(select_pattern_template, (id,))
    result = cursor.fetchone()
    __db_lock.release()

    id = result[0]
    jsonString = result[1]

    jsonDict = json.loads(jsonString)
    jsonDict['id'] = id

    return jsonDict
