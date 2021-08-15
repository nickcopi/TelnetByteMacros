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
		byte:138,
		replacement:'{'
	},
	{
		byte:137,
		replacement:'rc'
	},
	{
		byte:136,
		replacement:'g'
	},
	{
		byte:142,
		replacement:'a'
	},
	{
		byte:144,
		replacement:'c'
	},
	{
		byte:141,
		replacement:'s'
	},
	{
		byte:144,
		replacement:'}'
	},
	{
		byte:148,
		replacement:'by'
	},
	{
		byte:149,
		replacement:'o'
	},
	{
		byte:140,
		replacement:'fl'
	},
	{
		byte:153,
		replacement:'"'
	},
	{
		byte:151,
		replacement:'e'
	},
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

const processMacros = buf=>{
	buf = [...buf];
	macros.forEach(macro=>{
		while(buf.includes(macro.byte)){
			const index = buf.indexOf(macro.byte);
			const replacement = [...macro.replacement].map(a=>a.charCodeAt(0));
			buf = [...buf.slice(0,index), ...replacement, ...buf.slice(index+1,buf.length)];
		}
	});
	return Buffer.from(buf);
}


module.exports = {

	addDoEcho,
	addDoNegotiateWindowSize,
	addDoSendLocation,
	addByteMacros,
	processMacros
}
