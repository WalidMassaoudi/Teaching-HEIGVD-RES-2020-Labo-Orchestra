
/**
* Autor Walid Massaoudi
*/

const PORT = 2205;
const MULTICAST_ADDRESS = '239.255.35.11';
const TIME_SLOT = 1000; 
const KEEP_ALIVE = 5000;
const dgram = require('dgram');
const net = require('net');
var time = require('moment');

/**
 * AuditorServer
 * Listening on the multicast for musicians data using UDP
 * Listening on the TCP port for the user requests
 */
function serverAuditor(){

	/*  createserver for tcp and udp */
	this.sUDP = dgram.createSocket('udp4');
	this.sTCP = net.createServer();
    /* map of musicians data */
	this.mapMusicians = new Map();


  /* two function to change tcp and udp server setups*/
	this.udpConfig();
	this.tcpConfig();

}


/**
 * function keep alive only updated musicians
 *@return list of musicians still alive
 */
serverAuditor.prototype.whoISAlive = function() {
	var stillAlive = [];
	this.mapMusicians.forEach((data, key) => {
    //checking the time
		var deltaTime = time().diff(data[0]);
		if(deltaTime < KEEP_ALIVE){
			stillAlive.push(
				{
					uuid : key,
					instrument : data[1],
					activeSince : data[0]
				}
			);
		}
	});
	return stillAlive;
}

/**
 * function to update musician
 * @param  data list of musicians
 */
serverAuditor.prototype.updatePlayingMusicians = function( data ){

	this.mapMusicians.set(
		 data.id,
		[data.timestamp,data.instrument]
	);
}

/* udp server config */
serverAuditor.prototype.udpConfig = function() {

	/*join and  bind the multicast group*/
	this.sUDP.bind(PROTOCOL.PORT, () => {
	  this.sUDP.addMembership(MULTICAST_ADDRESS);
	  console.log('I am listening to the multicast group  : ' + MULTICAST_ADDRESS);
	});

	/*i we get a message */
	this.sUDP.on('message', (data, source) => {

		/* apdate the data of playing musicians*/
		this.updatePlayingMusicians(JSON.parse(data));
	});
}


/* tcp server config*/
serverAuditor.prototype.tcpConfig = function() {

	this.sTCP.listen(PORT);

	/* if we have connection*/
	this.sTCP.on('connection', (TCPSocket) => {
		//list of musicians stayed alive since 5 secondes
		var stillAliveMusicians  = this.whoISAlive();
		//use tpc to send data
		TCPSocket.write(JSON.stringify(stillAliveMusicians)+ '\r\n');
		TCPSocket.end();
	});
}



var serverAuditor = new serverAuditor();
