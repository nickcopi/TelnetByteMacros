const WILL = 251;
const WONT = 252;
const DO = 253;
const DONT = 254;
const IAC = 255;
const ECHO = 1;
const NEGOTIATE_WINDOW_SIZE = 0x1f;
const SEND_LOCATION = 23;
const SB = 250;
const SE = 240;
const BM = 19;
const NEW_ENVIRON = 39;


const addDoEcho = buf=>{
	buf = [...buf];
	buf.push(IAC);
	buf.push(DO);
	buf.push(ECHO);
	return Buffer.from(buf);
}
const addDoNegotiateWindowSize = buf=>{
	buf = [...buf];
	buf.push(IAC);
	buf.push(DO);
	buf.push(NEGOTIATE_WINDOW_SIZE);
	return Buffer.from(buf);
}
const addDoSendLocation = buf=>{
	buf = [...buf];
	buf.push(IAC);
	buf.push(DO);
	buf.push(SEND_LOCATION);
	return Buffer.from(buf);
}

const addDoSendBullshit = buf=>{
	buf = [...buf];
	/*	
	for(let i = 0; i < 254; i++){
		buf.push(IAC);
		buf.push(DO);
		buf.push(i);
	}
	*/
	
	buf.push(IAC);
	buf.push(DO);
	buf.push(BM);
	/*
	//
	buf.push(IAC);
	buf.push(SB);
	buf.push(NEW_ENVIRON);
	buf.push(1);
	buf.push(IAC);
	buf.push(SE);
	//
	buf.push(IAC);
	buf.push(SB);
	buf.push(NEW_ENVIRON);
	buf.push(1);
	buf.push(IAC);
	buf.push(SE);
	*/

	return Buffer.from(buf);

}


module.exports = {

	addDoEcho,
	addDoNegotiateWindowSize,
	addDoSendLocation,
	addDoSendBullshit,
}
