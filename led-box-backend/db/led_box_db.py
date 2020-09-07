import sqlite3
import threading
from api.model.led_pattern import LEDPattern
import json
from typing import List

# SQL QUERIES AND COMMANDS
insert_pattern_template = 'INSERT INTO LED_PATTERN (JSON) values (?)'
update_pattern_template = 'UPDATE LED_PATTERN SET JSON = ? WHERE ID = ?'
select_pattern_count_template = 'SELECT COUNT(*) FROM LED_PATTERN WHERE ID=?'
select_all_patterns = 'SELECT * FROM LED_PATTERN'

select_last_insert_rowid = 'SELECT last_insert_rowid()'
select_led_pattern_table = 'SELECT count(*) FROM sqlite_master WHERE name = \'LED_PATTERN\''

# INIT CONNECTION AND DB
connection = sqlite3.connect('led_box.sqlite', check_same_thread=False)

cursor = connection.cursor()
cursor.execute(select_led_pattern_table)
table_count = cursor.fetchone()[0]
if(table_count == 0):
    ddl_file = open("db/ddl.sql")
    ddl_script = ddl_file.read()
    cursor.executescript(ddl_script)

db_lock = threading.Lock()


def insert_pattern(pattern_dict: dict) -> int:
    db_lock.acquire()
    cursor = connection.cursor()

    cursor.execute(insert_pattern_template, (json.dumps(pattern_dict),))
    cursor.execute(select_last_insert_rowid)
    id = cursor.fetchone()[0]
    connection.commit()
    db_lock.release()

    return id


def get_patterns() -> List[dict]:
    db_lock.acquire()
    cursor = connection.cursor()

    cursor.execute(select_all_patterns)
    result_list = cursor.fetchall()
    db_lock.release()

    pattern_list = []

    for result in result_list:
        id = result[0]
        jsonString = result[1]

        jsonDict = json.loads(jsonString)
        jsonDict['id'] = id

        pattern_list.append(jsonDict)

    return pattern_list


def is_pattern_existing(id: int) -> bool:
    db_lock.acquire()
    cursor = connection.cursor()

    cursor.execute(select_pattern_count_template, (id,))
    count = cursor.fetchone()[0]
    db_lock.release()

    return count == 1


def update_pattern(id: int, pattern_dict: dict):
    pattern_dict['id'] = id
    db_lock.acquire()
    cursor = connection.cursor()

    cursor.execute(update_pattern_template, (json.dumps(pattern_dict), id))
    connection.commit()
    db_lock.release()
