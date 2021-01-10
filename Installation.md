1. Install Raspberry Pi OS Lite on SD card (https://www.raspberrypi.org/software/)
2. Setting up Raspberry Pi headless (Wifi, SSH): 
   - https://www.raspberrypi.org/documentation/configuration/wireless/headless.md
   - https://www.raspberrypi.org/documentation/remote-access/ssh/README.md
3. Connect with ssh (username: pi, password: raspberry)
4. Change password with <code>passwd</code>
5. **Optional** Change hostname: <code>sudo raspi-config</code>
6. Enable SPI with <code>sudo raspi-config</code> in menu item "Interface Options"
7. sudo apt-get update && sudo apt-get upgrade
8. sudo apt-get install -y git python3 python3-pip
9. Install CircuitPython: https://learn.adafruit.com/circuitpython-on-raspberrypi-linux/installing-circuitpython-on-raspberry-pi
10.  <code>sudo pip3 install -r requirements.txt</code>
11.  5. **Optional** Swagger UI: <code>sudo pip3 install connexion[swagger-ui]</code>
