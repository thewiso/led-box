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
1.  <code>git clone https://github.com/thewiso/led-box.git</code>
2.  Building the Vue application: NPM builds on the Raspberry Pi Zero take eternities, so:
    1. Install Node and NPM on your PC
    2. Clone the git repository 
    3. <code>cd led-box/led-box-ui</code>
    4. <code>npm install</code>
    5. <code>npm run build -- --mode prod</code>
    6.  Copy the folder "led-box/led-box-ui/dist" into the same path in your local Git repository on your Raspberry Pi e.g. with SFTP 
3.  <code>cd led-box</code>
4.  <code>sudo sh setup/installRuntimeDependencies.sh</code>
5.  **Optional** Install Swagger UI: <code>sudo pip3 install connexion[swagger-ui]</code>
6.  <code>sudo sh setup/configureServers.sh</code>

TODO: Capture portal
TODO: Create sample database data
TODO: solve TODOs 
TODO: document config file