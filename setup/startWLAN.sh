#!/bin/sh

HOME_NETWORK_SSID="CHANGE_TO_YOUR_HOME_SSID"

if [ "$1" = "check" ]
then
	echo "Check if connected to home network..."
	sleep 15
	GREP_COUNT=$(iwconfig wlan0 | grep -c "CHANGE_TO_YOUR_HOME_SSID")
	if [ "$GREP_COUNT" = "0" ]
	then
		echo "Not connected to home network"
		START_WLAN=true
	else
		echo "Connected to home network"
	fi
else
	START_WLAN=true
fi


if [ "$START_WLAN" = "true" ]
then
	echo "Starting own WLAN"
	sudo killall wpa_supplicant
	sudo ifconfig wlan0 down
	sudo ifconfig wlan0 192.168.0.1 netmask 255.255.255.0 up
	sudo service dnsmasq start
	sudo hostapd setup/hostapd.conf &
fi