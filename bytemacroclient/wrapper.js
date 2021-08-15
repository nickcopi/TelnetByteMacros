const {spawn} = require('child_process');
const child_process = require('child_process');
const net = require('net');

let byteMacros = [];
let respondBM = false;

const IAC = 255;
const BM = 19;
const SE = 240;
const SB = 250;
const WILL = 251;
const WONT = 252;

const PORT = 18492;

const ACCEPT = 2;

const createServer = ()=>{
	return new Promise((resolve,reject)=>{
		const server =  net.createServer(socket=>{
			const remoteSocket = net.createConnection(23,process.argv[2], () => {
				remoteSocket.on('data',data=>{
					data = warpIncoming(data);
					if(!socket.write(data))
						remoteSocket.pause();
				});
				remoteSocket.on('drain',()=>{
					socket.resume();
				});
				remoteSocket.on('close',()=>{
					socket.end();
				});
				socket.on('data',data=>{
					data = warpOutgoing(data);
					if(!remoteSocket.write(data))
						socket.pause();

				});
				socket.on('drain',()=>{
					remoteSocket.resume();
				});
				socket.on('close',()=>{
					remoteSocket.end();
				});

			});
			
		}); 
		server.on('error',e=>{
			console.error(e);
		});
		server.listen(PORT,() => {
			console.log('Started tcp proxy on', server.address());
			resolve(server);
		});

	});
}


const makeTelnet = ()=>{
	const telnet = spawn('telnet',['localhost',`${PORT}`]);
	telnet.stdout.on('data',data=>{
		console.log(data.toString());
	});
	telnet.stderr.on('data',data=>{
		console.error(data.toString());
	});
	return telnet;
}

const warpIncoming = data=>{
	data = [...data].join(',');
	const defineString = `${IAC},${SB},${BM},1`;
	let bms = data.split(defineString);
	bms.shift();
	bms = bms.map(bm=>{
		bm = bm.split(',').map(a=>Number(a))
		bm.shift();
		const macro = bm[0];
		const replacementLength = bm[1];
		const replacement = bm.slice(2,2+replacementLength).map(a=>String.fromCharCode(a)).join('');
		return {
			byte:macro,
			replacement
		}
	});
	if(bms.length){
		byteMacros = byteMacros.concat(bms);
		respondBM = true;
	}
	//console.log(bms);
	data = data.split(',');
	return Buffer.from(data);
}

const warpOutgoing = data=>{
	data = [...data].join(',');
	const wontString = `${IAC},${WONT},${BM}`;
	while(data.includes(wontString))
		data = data.replace(wontString,`${IAC},${WILL},${BM}`);
	byteMacros.forEach(bm=>{
		const replacement = [...bm.replacement].map(a=>a.charCodeAt(0)).join(',');
		while(data.includes(replacement)) data = data.replace(replacement,bm.byte);
	});
	data = data.split(',');
	if(respondBM){
		respondBM = false;
		byteMacros.forEach(bm=>data = data.concat([IAC,SB,BM,ACCEPT,bm.byte,IAC,SE]));
	}
	return Buffer.from(data);
}

const init = async()=>{
	const server = await createServer();
	const telnet = makeTelnet();
	process.stdin.on('data',data=>{
		//data = warpData(data);
		telnet.stdin.write(data);
	});
}
init();
