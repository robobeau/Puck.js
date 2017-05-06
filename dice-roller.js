/**
 * @file Dice Roller
 * @author Rene Esteves <rene@robobeau.com>
 * @version 1.0
 */
(() => {
    'use strict';

    const buttonCheckTimeout = 1000;
    const rollTimeout = 500;

    let counter = 0;
    let die = 0;
    let dieRoll = 0;
    let holding = false;

    // Timeouts
    let buttonCheckTimer = null;
    let ledOffTimer = null;
    let rollTimer = null;

    /**
     * Checks button presses
     *
     * @description Holding the button down will start increasing the die type, after 2 seconds,
     *      and clicking it will roll the die
     */
    let buttonCheck = () => {
        // If two seconds have passed since holding the button, it will register as such
        holding = counter > 1;

        // While holding, the die count will go up by one, every second
        // @TODO: Cap this, maybe?
        if (digitalRead(BTN) === 1) {
            if (holding) {
                if (counter === 2) {
                    die = 0;
                }

                die++;

                console.log('d' + die);

                digitalWrite(LED, 1);

                ledOffTimer = setTimeout(turnLedOff, buttonCheckTimeout / 2);
            }

            counter++;

            buttonCheckTimer = setTimeout(buttonCheck, buttonCheckTimeout);
        } else {
            buttonCheckTimer = null; // Prevents "Unknown Timeout" errors
            counter = 0;

            // Prevent rolling on release, after setting the die
            if (!holding) {
                roll();
            }
        }
    };

    /**
     * Rolls the die
     */
    let roll = () => {
        // What are you gonna roll, a d1? Maybe a d0? C'mon, man...
        if (die < 2) {
            return;
        }

        dieRoll = Math.floor(Math.random() * die) + 1;

        console.log('Rolling a d' + die + '... ' + dieRoll + '!');

        rollTimer = setTimeout(rollInterval, rollTimeout);
    };

    /**
     * Flashes the LED a set number of times via setTimeout
     */
    let rollInterval = () => {
        digitalWrite(LED, 1);

        ledOffTimer = setTimeout(turnLedOff, rollTimeout / 2);

        dieRoll--;

        if (dieRoll > 0) {
            rollTimer = setTimeout(rollInterval, rollTimeout);
        } else {
            rollTimer = null; // Prevents "Unknown Timeout" errors
        }
    };

    /**
     * Turns the LED off
     */
    let turnLedOff = () => {
        ledOffTimer = null; // Prevents "Unknown Timeout" errors

        digitalWrite(LED, 0);
    };

    // Event handler for the button (BTN)
    setWatch(
        (e) => {
            if (buttonCheckTimer) {
                clearTimeout(buttonCheckTimer);
            }

            if (rollTimer) {
                clearTimeout(rollTimer);
            }

            buttonCheck();
        },
        BTN,
        {
            debounce: 200,
            edge: 'both',
            repeat: true
        }
    );
})();