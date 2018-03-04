const readline = require('readline');
const model = require('./model');
const {colorize, log, biglog, errorlog} = require('./out');


biglog('QUIZ CORE', 'blue');

const rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout,
	prompt: colorize('quiz> ', 'yellow'),
	completer: (line) => {
	  const completions = 'h help add delete list p play show test credits quit q'.split(' ');
	  const hits = completions.filter((c) => c.startsWith(line));
	  // show all completions if none found
	  return [hits.length ? hits : completions, line];
	},
});

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
			help();
			break;
		case 'quit':
		case 'q':
			quit();
			break;
		case 'add':
			add();
			break;		
		case 'list':
			list();
			break;
		case 'show':
			show(args[1]);
			break;
		case 'test':
			test(args[1]);
			break;	
		case 'play':
		case 'p':
			play();
			break;	
		case 'delete':
			del(args[1]);
			break;	
		case 'edit':
			edit(args[1]);
			break;	
		case 'credits':
			credits();
			break;	
		default:
			console.log(`Comando desconocido '${cmd}'`);
			console.log('Use "help" para ver los comandos disponibles.');
			rl.prompt();
			break;
	}
}).on('close', () => {
	log('¡Hasta otra!', "green");
	process.exit(0);
});

const help = () => {
	console.log('Commandos:');
	console.log('  h|help - Muestra esta ayuda.');
	console.log('  list - Listar los quizzes existentes.');
	console.log('  show <id> - Muestra la pregunta y la respuesta el quiz indicado.');
	console.log('  add - Añadir un nuevo quiz interactivamente.');
	console.log('  delete <id> - Borrar el quiz indicado.');
	console.log('  edit <id> - Editar el quiz indicado.');
	console.log('  test <id> - Probar el quiz indicado.');
	console.log('  p|play - Jugar a preguntar aleatoriamente todos los quizzes.');
	console.log('  credits - Créditos.');
	console.log('  q|quit - Salir del programa.');
	rl.prompt();
}

const add = () => {
	rl.question(colorize(' Introduzca una pregunta: ', 'red'), question => {
		rl.question(colorize(' Introduzca la respuesta: ', 'red'), answer => {
			model.addQ(question, answer);
			log(` ${colorize('Se ha añadido', 'magenta')}: ${question}`);
			rl.prompt();
		});
	});
};

const list = () => {
	model.getAll().forEach((quiz, id) => {
		log(` [${colorize(id, 'magenta')}]: ${quiz.question}`);
	});
	rl.prompt();
};

const test = id => {
	if(typeof id === "undefined"){
		errorlog(`El valor de id no es válido`);
		rl.prompt();
	} else {
		try{
			const quiz = model.getById(id);		
			rl.question(colorize(`${quiz.question}  `, 'red'), answer => {
				if(answer.toUpperCase() === quiz.answer.toUpperCase()){
					log(` ${colorize('¡Respuesta correcta!', 'green')}`);
				} else {
					log(` ${colorize('Respuesta incorrecta', 'red')}`);
				}
				rl.prompt();
			});
		} catch(error) {
			errorlog(error.message);
			rl.prompt();
		}
	};
};

const play = () => {
	console.log('Jugar a preguntar aleatoriamente todos los quizzes.');
	rl.prompt();
};

const show = id => {
	if(typeof id === "undefined"){
		errorlog(`El valor de id no es válido`);
		rl.prompt();
	} else {
		try{
			const quiz = model.getById(id);
			log(` [${colorize(id, 'magenta')}]: ${quiz.question} ${colorize('=>', 'magenta')} ${quiz.answer}`);
		} catch(error) {
			errorlog(error.message);
			rl.prompt();
		}
	};
	rl.prompt();
};

const edit = id => {
	console.log('Editar el quiz indicado.');
	rl.prompt();
};

const del = id => {
	if(typeof id === "undefined"){
		errorlog(`El valor de id no es válido`);
		rl.prompt();
	} else {
		try{
			model.deleteById(id);
		} catch(error) {
			errorlog(error.message);
			rl.prompt();
		}
	};
	rl.prompt();
};

const credits = () => {
	console.log('Autor de la práctica:');
	console.log('Daniel Guerra Bernardo');
	rl.prompt();
};

const quit = () => {
	rl.close();
};