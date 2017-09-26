const fs = require('fs');
const light = 20, fan = 50, s_light = 5; // Wattage per hour of appliance

let obj = JSON.parse(fs.readFileSync('usageData-20170923-0742.json','utf8'));

//console.log(obj.length);
let total_energy = 0;

for(let count=0; count<obj.length-1; count++){

	// Getting Instance for Calculations
	let instance1 = obj[count];
	let instance2 = obj[count+1];

	console.log(`From ${instance1["created_at"]} to ${instance2["created_at"]}`);
	
	// Conversion of time from String to Date Format
	let t0 = new Date(instance1["created_at"]);
	let t1 = new Date(instance2["created_at"]);
	
	// Getting duration time in seconds
	let duration_s = (Math.round(t1.getTime()/1000)) - (Math.round(t0.getTime()/1000));
	let duration_h = duration_s/3600;

	console.log(duration_s + " seconds");
	console.log(duration_h + " hours");
	
	// Getting individual Electrical Appliances
	let val = instance2["value"].split(",");
	
	// Calculating individual Energy uses
	let e_fans = val[0]*duration_h*fan;
	let e_lights = val[1]*duration_h*light;
	let e_sLights = val[2]*duration_h*s_light;

	console.log(e_fans + e_lights + e_sLights);
	console.log();

	// Total Energy uses by all units in given Time Duration
	total_energy = total_energy + e_fans + e_lights + e_sLights;
}
console.log(`Total Energy Uses: ${total_energy} Watt`);