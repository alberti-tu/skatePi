var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var bleno = require('bleno');
var gpio = require('rpi-gpio');

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


var pin = 7;   //Number of the pin at the GPIO

// Once bleno starts, begin advertising our BLE address
bleno.on('stateChange', function(state) {
    console.log('State change: ' + state);
    if (state === 'poweredOn') {
        bleno.startAdvertising('skatePi',['12ab']);
        gpio.setup(pin, gpio.DIR_OUT, function() { console.log('GPIO started'); });
    } else {
        gpio.destroy(function() { console.log('GPIO stopped'); });
        bleno.stopAdvertising();
    }
});

// New Bluetooth connection
bleno.on('accept', function(clientAddress) {
    gpio.write(pin, 0);	// Low Voltage
    console.log("Accepted connection from address: " + clientAddress);
});

// Disconnected from the client
bleno.on('disconnect', function(clientAddress) {
    gpio.write(pin, 0);	// Low Voltage
    console.log("Disconnected from address: " + clientAddress);
});

// Start services at the begining
bleno.on('advertisingStart', function(error) {
    if (error) {
        console.log("Advertising start error:" + error);
    } else {
        console.log("Advertising start success");
        bleno.setServices([

            // Define a new service
            new bleno.PrimaryService({
                uuid : '12ab',
                characteristics : [

                    // Define a new characteristic within that service
                    new bleno.Characteristic({
                        value : null,
                        uuid : '34cd',
                        properties : ['notify', 'read', 'write'],

                        // If the client subscribes, we send out a message every 1 second
                        onSubscribe : function(maxValueSize, updateValueCallback) {
                            console.log("Device subscribed");
                            this.intervalId = setInterval(function() {
                                console.log("Sending: Hi!");
                                updateValueCallback(new Buffer("Hi!"));
                            }, 1000);
                        },

                        // If the client unsubscribes, we stop broadcasting the message
                        onUnsubscribe : function() {
                            console.log("Device unsubscribed");
                            clearInterval(this.intervalId);
                        },

                        // Send a message back to the client with the characteristic's value
                        onReadRequest : function(offset, callback) {
                            console.log("Read request received");
                            callback(this.RESULT_SUCCESS, new Buffer("Echo: " + (this.value ? this.value.toString("utf-8") : "")));
                        },

                        // Accept a new value for the characterstic's value
                        onWriteRequest : function(data, offset, withoutResponse, callback) {
                            this.value = data;
                            console.log('Write request: value = ' + this.value.toString("utf-8"));

                            if(this.value.toString("utf-8") === "on") {
                                gpio.write(pin, 1);	// High Voltage
                            } else {
                                gpio.write(pin, 0);	// Low Voltage
                            }

                            callback(this.RESULT_SUCCESS);
                        }
                    })
                ]
            })
        ]);
    }
});

module.exports = app;