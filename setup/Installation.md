# Install and configure Raspberry Pi OS
1. Install Raspberry Pi OS Lite on SD card (https://www.raspberrypi.org/software/)
2. Setting up Raspberry Pi headless (Wifi, SSH): 
   - https://www.raspberrypi.org/documentation/configuration/wireless/headless.md
   - https://www.raspberrypi.org/documentation/remote-access/ssh/README.md
3. Connect with ssh (username: pi, password: raspberry)
4. Change password with <code>passwd</code>
5. **Optional** Change hostname: <code>sudo raspi-config</code>
6. Enable SPI with <code>sudo raspi-config</code> in menu item "Interface Options"

# Set the server up
1.  <code>sudo apt-get install git</code>
2.  <code>git clone https://github.com/thewiso/led-box.git</code>
3.  Building the Vue application: NPM builds on the Raspberry Pi Zero take eternities, so:
    1. Install Node and NPM on your PC
    2. Clone the git repository 
    3. <code>cd led-box/led-box-ui</code>
    4. <code>npm install</code>
    5. <code>npm run build -- --mode prod</code>
    6.  Copy the folder "led-box/led-box-ui/dist" into the same path in your local Git repository on your Raspberry Pi e.g. with SFTP 
4.  <code>cd led-box</code>
5.  <code>sudo sh setup/installRuntimeDependencies.sh</code>
6.  <code>sudo sh setup/configureServers.sh</code>
7.  The UI is now reachable under your Raspberry Pi's IP adress, port 80

# Set up own wireless LAN
This setup is useful if you are going to use Led-Box both at your home and "on tour". The Raspberry Pi will try to connect to your home Wifi at startup and if not succesfull, create it's own WLAN network.

1. In setup/startWLAN.sh, replace "CHANGE_TO_YOUR_HOME_SSID" with the SSID of your home network.
2. Add line <code>sudo sh /home/pi/led-box/setup/startWLAN.sh check & </code> to /etc/rc.local **before the final "exit 0" command.** 
3. Edit /etc/nginx/nginx.conf: Set <code>server_names_hash_bucket_size</code> in "http"-block to 64
4. <code>sudo reboot</code>
5. If the Raspberry Pi creates it's own WLAN, the UI is rachable under http://led.box or http://192.168.0.1