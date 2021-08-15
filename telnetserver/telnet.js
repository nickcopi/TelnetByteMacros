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

const macros = [
	{
		byte:140,
		replacement:'tel'
	},
	{
		byte:142,
		replacement:'net'
	},
	{
		byte:137,
		replacement:'shell'
	},
	{
		byte:136,
		replacement:'net'
	}
]


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

const addByteMacros = buf=>{
	buf = [...buf];
	buf.push(IAC);
	buf.push(DO);
	buf.push(BM);
	//
	macros.forEach(macro=>{	
		buf.push(IAC);
		buf.push(SB);
		buf.push(BM);
		buf.push(1);
		buf.push(macro.byte);
		buf.push(macro.replacement.length);
		[...macro.replacement].forEach(c=>{
			buf.push(c.charCodeAt(0));
		});
		buf.push(IAC);
		buf.push(SE);
	})

	return Buffer.from(buf);

}


module.exports = {

	addDoEcho,
	addDoNegotiateWindowSize,
	addDoSendLocation,
	addByteMacros,
}
