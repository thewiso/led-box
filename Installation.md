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
1.  <code>git clone https://github.com/thewiso/led-box.git</code>
2.  Execute <code>cd led-box && sudo sh led-box/install.sh</code>
3.  5. **Optional** Swagger UI: <code>sudo pip3 install connexion[swagger-ui]</code>

TODO: Start server at startup
TODO: Capture portal
TODO: Create sample database data
TODO: reset leds at startup
TODO: property for db path
