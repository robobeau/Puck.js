/**
 * @file Flashes the LED at an interval calculated from the light levels measured by the Puck.js
 * @author Rene Esteves <rene@robobeau.com>
 * @version 1.0
 */
(function() {
	'use strict';

	const intervalModifier = 1000;
	const ledOffTimeout = 100;

	let areLightsOn = false;
	let interval = 200;

	// Timeouts
	let ledIntervalTimer = null;
	let ledOffTimer = null;

	/**
	 * Calculates the interval
	 *
	 * @description The interval is determined by the light levels,
	 * 		so low levels of light should result in a more frequent interval
	 */
	let calculateInterval = () => {
		let light = Puck.light();

		interval = intervalModifier * light;

		console.log(intervalModifier + ' * ' + light + ' = ' + interval);

		// We want to limit the amount of times Puck.light() gets called
		// to a maximum of 5 times per second
		interval = Math.max(interval, 200);
	};

	/**
	 * Flashes the LED by recursively calling itself via setTimeout
	 */
	let ledInterval = () => {
		turnLedOn();

		// If we haven't turned the LED off before this interval, cancel it
		if (ledOffTimer) {
			clearTimeout(ledOffTimer);
		}

		calculateInterval();

		ledOffTimer = setTimeout(turnLedOff, ledOffTimeout);
		ledIntervalTimer = setTimeout(ledInterval, interval);
	};

	/**
	 * Turns the LED off
	 */
	let turnLedOff = () => {
		ledOffTimer = null; // Prevents "Unknown Timeout" errors

		digitalWrite(LED, 0);
	};

	/**
	 * Turns the LED on
	 */
	let turnLedOn = () => {
		ledIntervalTimer = null; // Prevents "Unknown Timeout" errors

		digitalWrite(LED, 1);
	};

	// Event handler for the button (BTN)
	setWatch(
		(e) => {
			areLightsOn = !areLightsOn;

			if (areLightsOn) {
				console.log("ON");

				ledIntervalTimer = setTimeout(ledInterval, interval);
			} else {
				console.log("OFF");

				if (ledIntervalTimer) {
					clearTimeout(ledIntervalTimer);
				}
			}
		},
		BTN,
		{
			debounce: 200,
			edge: 'falling',
			repeat: true
		}
	);
}());