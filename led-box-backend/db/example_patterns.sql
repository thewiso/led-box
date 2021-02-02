INSERT INTO LED_PATTERN (JSON) VALUES ('{
	"name": "none_animation",
	"colors": [
		{
			"r": 255,
			"g": 0,
			"b": 0
		},
		{
			"r": 0,
			"g": 255,
			"b": 0
		},
		{
			"r": 0,
			"g": 0,
			"b": 255
		}
	],
	"repitionFactor": 0,
	"colorGradientLengthFactor": 0.3,
	"patternType": "LEDPattern"
}')

INSERT INTO LED_PATTERN (JSON) VALUES ('{
	"name": "blink_animation",
	"colors": [
		{
			"r": 255,
			"g": 0,
			"b": 0
		},
		{
			"r": 0,
			"g": 255,
			"b": 0
		},
		{
			"r": 0,
			"g": 0,
			"b": 255
		}
	],
	"repitionFactor": 0,
	"colorGradientLengthFactor": 0.3,
	"patternType": "BlinkLEDPattern",
	"blinkSpeed": 0.1,
	"blinkDimmingPeriodFactor": 0.5
}')

INSERT INTO LED_PATTERN (JSON) VALUES ('{
	"name": "chase_animation",
	"colors": [
		{
			"r": 255,
			"g": 0,
			"b": 0
		},
		{
			"r": 0,
			"g": 255,
			"b": 0
		},
		{
			"r": 0,
			"g": 0,
			"b": 255
		}
	],
	"repitionFactor": 0,
	"colorGradientLengthFactor": 0.3,
	"patternType": "ChaseLEDPattern",
	"chaseSpeed": 20,
	"chaseLengthFactor": 0.2,
	"chaseGradientLengthFactor": 0.25
}')