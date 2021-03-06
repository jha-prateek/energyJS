const mqtt = require('mqtt');
const fs = require('fs');

const my_topic_name = "";

const url = "mqtts://io.adafruit.com";

let past = Math.round(Date.now()/1000); // Seconds since EPOCH
let day = Math.round(((Date.now()/1000)+19800)/86400); // Day since EPOCH
let prev_data = "0,0,0";

// Total consumption per day
let ePD = 0;

//let e_Array = [];

// Wattage per hour of appliance
const fan = 50, light = 20, s_light = 5; 

// For file creation/initialization
let file_ob = {
    energyList:[]
};

let options = {
  port: 8883,
  clientId: 'mqttjs_' + Math.random().toString(16).substr(2, 8),
  username: "",
  password: "",
};

// Create a client connection
let client = mqtt.connect(url, options);

client.on('connect', function() { // When connected

    console.log("Connected..!!");

    // subscribe to a topic
    client.subscribe(my_topic_name, function() {

        // when a message arrives, do something with it
        client.on('message', function(topic, message, packet) {

            let now = Math.round(Date.now()/1000);

            // Getting Duration
            let duration_s = now - past;
            let duration_h = duration_s/3600;
            //console.log(duration_s);
            console.log(`Duration: ${duration_h} Hrs`);

            // Getting individual Electrical Appliances
            let appliance = prev_data.split(",");
            console.log(appliance);

            // Calculating individual Energy uses
            let e_fans = appliance[0]*duration_h*fan;
            let e_lights = appliance[1]*duration_h*light;
            let e_sLights = appliance[2]*duration_h*s_light;

            console.log(e_fans + e_lights + e_sLights);

            ePD = ePD + e_fans + e_lights + e_sLights;

            // Setting time for next Process
            past = now;

            let date = new Date();

            // Saving to file if Day is changed
            if(Math.round((now+19800)/86400) > day){

                let data = {
                    "Date": date.toUTCString(),
                    "TotalofDay":ePD
                }
                //console.log(data);

                // Wrting to JSON File
                if(fs.existsSync('energyData.json')){

                    let obj = JSON.parse(fs.readFileSync('energyData.json','utf8'));
                    //console.log(obj);
                    obj.energyList.push(data);
                    fs.writeFileSync('energyData.json',JSON.stringify(obj),'utf8');

                }else{

                    file_ob.energyList.push(data);
                    fs.writeFileSync('energyData.json',JSON.stringify(file_ob),'utf8');
                }

                // Updating variables
                //e_Array.push(data);
                ePD = 0;
                day = Math.round((now+19800)/86400);
            }

            // Storing Appliance state for next Calculation
            prev_data = message.toString();
        });

        client.on('error', (error) => {
            console.log('MQTT Client Error');
            console.log(error);
        });
    });
});