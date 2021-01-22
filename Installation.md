# Install and configure Raspberry Pi OS
1. Install Raspberry Pi OS Lite on SD card (https://www.raspberrypi.org/software/)
2. Setting up Raspberry Pi headless (Wifi, SSH): 
   - https://www.raspberrypi.org/documentation/configuration/wireless/headless.md
   - https://www.raspberrypi.org/documentation/remote-access/ssh/README.md
3. Connect with ssh (username: pi, password: raspberry)
4. Change password with <code>passwd</code>
5. **Optional** Change hostname: <code>sudo raspi-config</code>
6. Enable SPI with <code>sudo raspi-config</code> in menu item "Interface Options"

# Install dependencies
1. sudo apt-get update && sudo apt-get upgrade
2. sudo apt-get install -y git python3 python3-pip virtualenv nginx
3.  <code>git clone https://github.com/thewiso/led-box.git</code>
4.  <code>python3 -m virtualenv led-box/led-box-backend/env</code>
5.  <code>source led-box/led-box-backend/env/bin/activate</code>
6.  <code>pip3 install -r led-box/led-box-backend/requirements.txt</code>
7.  <code>deactivate</code>
8.  <code>sudo cp led-box/led-box-backend/led_box_backend.service /etc/systemd/system/</code>
9.  <code>sudo systemctl start led_box_backend</code>
10. <code>sudo systemctl enable led_box_backend</code>
11. <code>sudo systemctl status led_box_backend</code> Should print "active"
12. <code>sudo cp led-box/led_box_nginx.conf /etc/nginx/sites-available/</code>
13. 5. **Optional** Swagger UI: <code>sudo pip3 install connexion[swagger-ui]</code>

TODO: Start server at startup
TODO: Capture portal
TODO: Create sample database data
TODO: reset leds at startup
TODO: property for db path
