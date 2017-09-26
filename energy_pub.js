const mqtt = require('mqtt');
const my_topic_name = "bludragon/feeds/demoE";

const url = "mqtts://io.adafruit.com";

var options = {
  port: 8883,
  clientId: 'mqttjs_' + Math.random().toString(16).substr(2, 8),
  username: "bludragon",
  password: "64d04ed1fc00401493dcceaaf30db5c0",
};

// Create a client connection
var client = mqtt.connect(url, options);

client.on('connect', function() { // When connected

    console.log("Connected..!!");
    // subscribe to a topic
    client.subscribe(my_topic_name, function() {
        // when a message arrives, do something with it
        client.on('message', function(topic, message, packet) {
            console.log("Received '" + message + "' on '" + topic + "'");
        });
    });

    setInterval(
        function(){
            var message = getRandomInt(0,10).toString() + "," + getRandomInt(0,8).toString() + "," + getRandomInt(0,2).toString();
            console.log("Sending: ", message)
            client.publish(my_topic_name, message, {qos: 1}, function(){
                console.log("Sent: ", message)
            });
        },
    5000);

    client.on('error', (error) => {
        console.log('MQTT Client Error');
        console.log(error);
    });

});

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}