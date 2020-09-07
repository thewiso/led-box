su ${RUNTIME_USER} -c 'uwsgi --ini led_box_backend.ini > /dev/null'  &
sleep 5s

nginx -g 'daemon off;'