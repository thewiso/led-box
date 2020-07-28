#include <stdio.h>
#include <ESP8266WiFi.h>
#include <DNSServer.h>
#include <ESP8266mDNS.h>
#include <ESP8266WebServer.h>
#include <SoftwareSerial.h>
#include <ArduinoJson.h>
#include <SPI.h>
#include <SD.h>
#include <uri/UriBraces.h>

#define BUTTON_SWITCH_PIN D3
#define LED_PIN D2
#define BUTTON_PIN D1
//https://arduinojson.org/v6/assistant/ => 812 was the tested value
//TODO: check this value again
#define JSON_SIZE 812
#define INVALID_PRIMARY_COLOR -1
#define JSON_FILE_EXTENSION ".json"

//TODO: check which can be defined instead of beeing global vars
const char* SSID = "LED-MANAGER";
const byte DNS_PORT = 53;
const byte WEBSERVER_PORT = 80;
const IPAddress AP_IP(192, 168, 1, 1);
const IPAddress SUBNET_MASK(255, 255, 255, 0);
const char* AP_URL = "http://192.168.1.1/";
const String LED_PATTERN_DIR_STR = "/led-patterns/";

ESP8266WebServer webServer(AP_IP, WEBSERVER_PORT);
DNSServer dnsServer;
SoftwareSerial ledClientSerial(1, 2); //RX, TX ; 2 is D4 //TODO: mark 1 as unused
File patternDir;
bool shutdownRequested = false;
unsigned short newPatternId = 1;

void ICACHE_RAM_ATTR onButtonPress();

void setup() {
	// start serial
	Serial.begin(9600);
	ledClientSerial.begin(9600); //TODO: make faster? 600, 57600, 76800 or 115200
	delay(1);

	// create access point
	WiFi.mode(WIFI_AP);
	WiFi.softAPConfig(AP_IP, AP_IP, SUBNET_MASK);
	WiFi.softAP(SSID);

	setupPins();
	setupSD();
	setupServer();

	Serial.println("Setup completed");
}

void loop() {
	dnsServer.processNextRequest();
	webServer.handleClient();
	//TODO: delay or sleep?

	if(shutdownRequested && digitalRead(BUTTON_PIN) == HIGH) {
		Serial.println("Finishing background tasks...");
		for(char i=0; i<40; i++) {
			delay(50);
			yield();
		}
		Serial.println("Goodbye");
		digitalWrite(LED_PIN, LOW);
		digitalWrite(BUTTON_SWITCH_PIN, HIGH);
		ESP.deepSleep(0);
	}
}

void setupPins() {
	pinMode(BUTTON_SWITCH_PIN, OUTPUT);
	pinMode(LED_PIN, OUTPUT);
	pinMode(BUTTON_PIN, INPUT_PULLUP);

	digitalWrite(BUTTON_SWITCH_PIN, LOW);
	digitalWrite(LED_PIN, HIGH);
	attachInterrupt(digitalPinToInterrupt(BUTTON_PIN), onButtonPress, FALLING);

}

void onButtonPress() {
	detachInterrupt(digitalPinToInterrupt(BUTTON_PIN));
	shutdownRequested = true;
}

void setupSD() {
	bool error = true;
	if (SD.begin(D8)) {//TODO: define

		bool createPatternDir = true;
		if (SD.exists(LED_PATTERN_DIR_STR)) {
			patternDir = SD.open(LED_PATTERN_DIR_STR);
			if(patternDir.isDirectory()) {
				createPatternDir = false;
			}
		}

		if (createPatternDir) {
			Serial.println("Led pattern dir is missing - creating new...");
			if (!SD.mkdir(LED_PATTERN_DIR_STR)) {
				Serial.println("Could not create led pattern dir");
			} else {
				patternDir = SD.open(LED_PATTERN_DIR_STR);
			}
		}

		if (patternDir) {
			error = false;
		}
	} else {
		Serial.println("Could not connect to SD");
	}

	if(!error) {
		//Finding out highest existing pattern id
		File patternFile =  patternDir.openNextFile();
		while(patternFile) {
			String fileName = patternFile.name();
			if(!patternFile.isDirectory() && fileName.endsWith(JSON_FILE_EXTENSION)) {
				fileName.replace(JSON_FILE_EXTENSION, "");
				unsigned short patternId = fileName.toInt();
				if(patternId >= newPatternId) {
					newPatternId = patternId + 1;
				}
			}
			patternFile = patternDir.openNextFile();
		}
	} else {
		//TODO: warning lamp? power off?
		Serial.println("Could not init SD");
	}
}

void setupServer() {
	dnsServer.setErrorReplyCode(DNSReplyCode::NoError);
	dnsServer.start(DNS_PORT, "*", AP_IP);

	//redirect
	webServer.onNotFound([]() {
		webServer.sendHeader("Location", AP_URL);
		webServer.send(303);
	});
	//home
	webServer.on("/", HTTP_GET, []() {
		webServer.send(200, "text/html",
		               "Hello World");
	});
	//REST API
	webServer.on("/led-patterns", HTTP_POST, postLedPattern);
	webServer.on("/led-patterns", HTTP_GET, getLedPattern);
	webServer.on(UriBraces("/led-patterns/{}"), HTTP_PATCH, patchLedPattern);

	webServer.begin();

}

void postLedPattern() {
	StaticJsonDocument<JSON_SIZE> requestDoc;
	String body = webServer.arg("plain");

	DeserializationError error = deserializeJson(requestDoc, body);
	if (!error) {
		StaticJsonDocument<JSON_SIZE> parsedDoc;
		bool parsingSuccess = parseRequestLedPattern(requestDoc, parsedDoc);
		if(parsingSuccess) {
			parsedDoc["id"] = newPatternId;

			String fileExtension = JSON_FILE_EXTENSION;
			File newPatternFile = SD.open(LED_PATTERN_DIR_STR + newPatternId + fileExtension, FILE_WRITE);
			serializeJson(parsedDoc, newPatternFile);
			newPatternFile.close();
			webServer.send(201, "text/json", String(newPatternId));

			newPatternId++;
		} else {
			webServer.send(400);
		}
	} else {
		webServer.send(400);
	}
}

void getLedPattern() {
	webServer.chunkedResponseModeStart(200, "text/json");
	webServer.sendContent("[");

	patternDir.rewindDirectory();
	File patternFile = patternDir.openNextFile();

	while(patternFile) {
		if(!patternFile.isDirectory()) {
			String stringBuffer = "";
			while (patternFile.available())
			{
				stringBuffer += (char)patternFile.read();
				if(stringBuffer.length() >= 1000) {
					webServer.sendContent(stringBuffer);
					stringBuffer = "";
				}
			}
			webServer.sendContent(stringBuffer);
			webServer.sendContent(",");
		}
		patternFile = patternDir.openNextFile();
	}

	webServer.sendContent("]");
	webServer.chunkedResponseFinalize();
}

void patchLedPattern() {
	StaticJsonDocument<JSON_SIZE> requestDoc;
	String body = webServer.arg("plain");

	DeserializationError error = deserializeJson(requestDoc, body);
	if (!error) {
		StaticJsonDocument<JSON_SIZE> parsedDoc;
		bool parsingSuccess = parseRequestLedPattern(requestDoc, parsedDoc);
		if(parsingSuccess) {
			String idStr = webServer.pathArg(0);
			unsigned short id = idStr.toInt();
			if(id > 0) {
				String fileExtension = JSON_FILE_EXTENSION;
				String fileName = LED_PATTERN_DIR_STR + idStr.toInt() + fileExtension;
				if(SD.exists(fileName)) {
                    parsedDoc["id"] = id;
                    
					SD.remove(fileName);
					File patternFile = SD.open(fileName, FILE_WRITE);
					serializeJson(parsedDoc, patternFile);
					patternFile.close();
                    
                    webServer.send(200);
				} else {
					webServer.send(404);
				}

			} else {
				webServer.send(400);
			}
		} else {
			webServer.send(400);
		}
		//const char* colorName = doc["color"];

		//ledClientSerial.print(body);
		//ledClientSerial.print('\0');


	} else {
		webServer.send(400);
	}
}

bool parseRequestLedPattern(JsonDocument &rawDoc, JsonDocument &parsedDoc) {
	//TODO: MAX, MIN AS DEFINE
	//"name"
	JsonVariant nameVar = rawDoc["name"];
	if(nameVar.isNull() || !nameVar.is<String>()) {
		return false;
	} else {
		String name = nameVar.as<String>();
		if(name.length() > 20) {
			return false;
		}
		else {
			parsedDoc["name"] = name;
		}
	}

	//"colors"
	JsonVariant colorsVar = rawDoc["colors"];
	if(colorsVar.isNull() || !colorsVar.is<JsonArray>()) {
		return false;
	} else {
		JsonArray colors = colorsVar.as<JsonArray>();
		size_t colorSize = colors.size();
		if(colorSize < 1 || colorSize > 5) {
			return false;
		}
		JsonArray parsedColors = parsedDoc.createNestedArray("colors");
		for(short i = 0; i < colorSize; i++) {
			JsonObject parsedColor = parsedColors.createNestedObject();
			JsonVariant rawColorVar = colors[i];
			bool parsingSuccess = parseColor(rawColorVar, parsedColor);
			if(!parsingSuccess) {
				return false;
			}
		}
	}

	//"repitionFactor", "colorGradientLengthFactor"
	if(!parseNumberAttr<float>(rawDoc, parsedDoc, "repitionFactor", 0, 1)
	        || !parseNumberAttr<float>(rawDoc, parsedDoc, "colorGradientLengthFactor", 0, 0.5)) {
		return false;
	}

	//"animationType"
	JsonVariant animationTypeVar = rawDoc["animationType"];
	if(animationTypeVar.isNull() || !animationTypeVar.is<String>()) {
		return false;
	}

	String animationType = animationTypeVar.as<String>();
	if(animationType.equals("none")) {
		//all good
	} else if(animationType.equals("blink")) {
		//"blinkSpeed", "blinkDimmingPeriodFactor"
		if(!parseNumberAttr<float>(rawDoc, parsedDoc, "blinkSpeed", 0.1, 3)
		        || !parseNumberAttr<float>(rawDoc, parsedDoc, "blinkDimmingPeriodFactor", 0, 1)) {
			return false;
		}
	} else if(animationType.equals("chase")) {
		//"chaseSpeed", "chaseLengthFactor", "chaseGradientLengthFactor"
		if(!parseNumberAttr<float>(rawDoc, parsedDoc, "chaseSpeed", 1, 300)
		        ||!parseNumberAttr<float>(rawDoc, parsedDoc, "chaseLengthFactor", 0, 0.99)
		        ||!parseNumberAttr<float>(rawDoc, parsedDoc, "chaseGradientLengthFactor", 0, 0.5)) {
			return false;
		}

		//chaseForeground
		JsonVariant chaseForegroundVar = rawDoc["chaseForeground"];
		if(!chaseForegroundVar.isNull()) {
			JsonObject parsedColor = parsedDoc.createNestedObject("chaseForeground");
			if(!parseColor(chaseForegroundVar, parsedColor)) {
				return false;
			}
		}
	} else {
		return false;
	}

	return true;
}

bool parseColor(JsonVariant &rawColorVar, JsonObject &parsedColor) {
	if(!rawColorVar.isNull() && rawColorVar.is<JsonObject>()) {
		JsonObject rawColor = rawColorVar.as<JsonObject>();
		const byte attrNamesLength = 3;
		String attrNames[attrNamesLength] = {"r", "g", "b"};

		for(char i=0; i < attrNamesLength; i++) {
			bool parseSuccess = parseNumberAttr(rawColor, parsedColor, attrNames[i], 0, 255);
			if(!parseSuccess) {
				return false;
			}
		}
	}
	return true;
}

template<typename T>
bool parseNumberAttr(JsonDocument &rawDoc, JsonDocument &parsedDoc, String attrName, T min, T max) {
	JsonVariant var = rawDoc[attrName];
	if(!var.isNull() && var.is<T>()) {
		T typeVar = var.as<T>();
		if(typeVar >= min && typeVar <= max) {
			parsedDoc[attrName] = typeVar;
			return true;
		}
	}
	return false;
}

template<typename T>
bool parseNumberAttr(JsonObject &rawObj, JsonObject &parsedObj, String attrName, T min, T max) {
	JsonVariant var = rawObj[attrName];
	if(!var.isNull() && var.is<T>()) {
		T typeVar = var.as<T>();
		if(typeVar >= min && typeVar <= max) {
			parsedObj[attrName] = typeVar;
			return true;
		}
	}
	return false;
}
