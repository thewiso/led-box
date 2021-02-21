#!/bin/sh

sudo apt-get install -y hostapd dnsmasq
sudo systemctl disable dnsmasq
sudo bash -c 'cat setup/dnsmasq.conf >> /etc/dnsmasq.conf'

sudo cp setup/captive_portal_nginx.conf /etc/nginx/sites-available/
sudo ln -s /etc/nginx/sites-available/captive_portal_nginx.conf /etc/nginx/sites-enabled/
