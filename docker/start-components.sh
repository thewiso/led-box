su ${RUNTIME_USER} -c 'uwsgi --ini led_box_api_server.ini > /dev/null &'
sleep 5s

nginx -g 'daemon off;'