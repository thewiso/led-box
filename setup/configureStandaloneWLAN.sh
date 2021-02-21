sudo apt-get install -y hostapd dnsmasq
sudo systemctl disable dnsmasq

sudo bash -c 'cat setup/dnsmasq.conf >> /etc/dnsmasq.conf'