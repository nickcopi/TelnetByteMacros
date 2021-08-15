const {spawn} = require('child_process');
const child_process = require('child_process');
const net = require('net');

const IAC = 255;
const BM = 19;
const WILL = 251;
const WONT = 252;

const PORT = 18492;

const createServer = ()=>{
	return new Promise((resolve,reject)=>{
		const server =  net.createServer(socket=>{
			const remoteSocket = net.createConnection(23,process.argv[2], () => {
				remoteSocket.on('data',data=>{
					//data = warpData(data);
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
					data = warpData(data);
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

const warpData = data=>{
	data = [...data].join(',');
	const wontString = `${IAC},${WONT},${BM}`;
	while(data.includes(wontString))
		data = data.replace(wontString,`${IAC},${WILL},${BM}`);
	data = data.split(',');
	return Buffer.from(data);
}

const init = async()=>{
	const server = await createServer();
	const telnet = makeTelnet();
	process.stdin.on('data',data=>{
		data = warpData(data);
		telnet.stdin.write(data);
	});
}
init();
