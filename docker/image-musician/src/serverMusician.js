

/**
 * walid massaoudi
*/

const PORT = 2205;
const MULTICAST_ADDRESS = '239.255.35.11';
const TIME_SLOT = 1000; 
const KEEP_ALIVE = 5000; 

var time = require('moment');
const dgram = require('dgram');
const { v4: uuidv4 } = require('uuid');

//list of instruments with sounds 
const instrumentList = {
	piano : 'ti-ta-ti',
	trumpet : 'pouet',
	flute	: 'trulu',
	violin : 'gzi-gzi',
	drum :	'boum-boum',
	default : 'oink-oink',
};

function serverMusician(instName) {

	//Default values for unknown instrument
	if(!(instName in instrumentList)){
		this.iSound = instrumentList['default'];
		this.instName = 'no such instrument';
	}else{
		this.iSound = instrumentList[instName];
		this.instName = instName;
	}

	this.udpServer = dgram.createSocket('udp4');

	//id of the musician 
	this.id = uuidv4();
	//Sending message
	setInterval(this.play.bind(this),TIME_SLOT);
}

/* getting the payload of the musician*/
MusicianServer.prototype.getPayload = function() {
	var data = {
		id : this.id,
		instrument : this.instName,
		sound : this.sound,
		timestamp : time(),
	};

	return Buffer.from(JSON.stringify(data));
}

/**
 * send the message on the multicast group
 */
MusicianServer.prototype.play = function() {

	
	var MusicianPayload = this.getPayload();

	this.udpServer.send
	(
		MusicianPayload,
		0 ,
		MusicianPayload.length,
		PORT,
		MULTICAST_ADDRESS,
		() => {
			console.log("Sending on : " +  MULTICAST_ADDRESS + " with the port :" + PORT);
		}
	);
}


/*launch the musician with an argument that precise the instrument type*/
const arg = process.argv[2];
var musician = new serverMusician(arg);
