sudo apt-get install -y hostapd dnsmasq
sudo systemctl disable dnsmasq

sudo cat setup/hostapd.conf >> /etc/dnsmasq.conf