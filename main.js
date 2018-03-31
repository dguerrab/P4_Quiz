const readline = require('readline');
const Sequelize = require('sequelize');
const {models} = require('./model');
const {colorize, log, biglog, errorlog} = require('./out');
const cmds = require("./cmds")
const net = require("net");

//net.createServer(function(socket) {
net.createServer(socket => {
	console.log("Nuevo cliente en " + socket.remoteAddress);

	biglog(socket, 'QUIZ CORE', 'blue');

	const rl = readline.createInterface({
		input: socket,
		output: socket,
		prompt: colorize('quiz> ', 'yellow'),
		completer: (line) => {
		  const completions = 'h help add delete list p play show test credits quit q'.split(' ');
		  const hits = completions.filter((c) => c.startsWith(line));
		  // show all completions if none found
		  return [hits.length ? hits : completions, line];
		},
	});

	socket.on("error", () => { rl.close(); })
	.on("end", () => { rl.close(); });

	rl.prompt();

	rl.on('line', (line) => {
		let args = line.split(" ");
		let cmd = args[0].toLowerCase().trim();
		switch (cmd) {
			case '':
				rl.prompt();
				break;
			case 'help':
			case 'h':
				cmds.help(socket, rl);
				break;
			case 'quit':
			case 'q':
				cmds.quit(socket, rl);
				break;
			case 'add':
				cmds.add(socket, rl);
				break;		
			case 'list':
				cmds.list(socket, rl);
				break;
			case 'show':
				cmds.show(socket, args[1], rl);
				break;
			case 'test':
				cmds.test(socket, args[1], rl);
				break;	
			case 'play':
			case 'p':
				cmds.play(socket, rl);
				break;	
			case 'delete':
				cmds.del(socket, args[1], rl);
				break;	
			case 'edit':
				cmds.edit(socket, args[1], rl);
				break;	
			case 'credits':
				cmds.credits(socket, rl);
				break;	
			default:
				socket.write(`Comando desconocido '${cmd}'`);
				socket.write('Use "help" para ver los comandos disponibles.');
				rl.prompt();
				break;
		}
	}).on('close', () => {
		log(socket, '¡Hasta otra!', "green");
		socket.end();
	});
}).listen(3030);