const child_process = require('child_process');
const net = require('net');
const telnet = require('./telnet');


const PORT = 23; 
const PROGRAM = '/bin/sh';


const createServer = ()=>{
	const server =  net.createServer(socket=>{
		socket.on('end', ()=>{

		});
		socket.on('data',data=>{
			console.log(data.toString());
			if(data[0] === 0xff) return;
			data = telnet.processMacros(data);
			console.log(data.toString());
			process.stdin.write(Buffer.from([...data.slice(0,data.length-2),0x0a]));
			//socket.write(telnet.addDoNegotiateWindowSize(telnet.addDoEcho(Buffer.from([]))));
		});
		
		const process = child_process.spawn(PROGRAM);
		process.stdout.on('data',data=>{
			console.log('proc says: ' + data.toString(),data);
			socket.write(data);
		});
		process.stderr.on('data',data=>{
			console.log('proc err says: ' + data.toString(),data);
			socket.write(data);
		});
	
		//socket.write(Buffer.from([37]));
		socket.write(telnet.addByteMacros(Buffer.from([])));
		
	}); 
	server.on('error',e=>{
		console.error(e);
	});
	return server;
}

const init = async()=>{
	const server = createServer();	
	server.listen(PORT,()=>console.log(`Listening on port ${PORT}.`));
}

init();
