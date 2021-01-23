#install dependencies
sudo apt-get update && sudo apt-get upgrade
sudo apt-get install -y git python3 python3-pip nginx
pip3 install virtualenv

git clone https://github.com/thewiso/led-box.git
cd led-box

python3 -m virtualenv led-box-backend/env
source led-box-backend/env/bin/activate
pip3 install -r led-box-backend/requirements.txt
#optional:
#pip3 install connexion[swagger-ui]
deactivate

#configure wsgi service
sudo cp led-box-backend/led_box_backend.service /etc/systemd/system/
sudo systemctl start led_box_backend
sudo systemctl enable led_box_backend
sudo systemctl status led_box_backend #Should print "active"

#configure nginx
sudo cp led-box/led_box_nginx.conf /etc/nginx/sites-available/
sudo rm /etc/nginx/sites-enabled/*
sudo ln -s /etc/nginx/sites-available/led_box_nginx.conf /etc/nginx/sites-enabled/
sudo nginx -t #Should print "ok"
sudo systemctl restart nginx