const readline = require('readline');
const Sequelize = require('sequelize');
const {models} = require('./model');
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

const validateId = id => {
	return new Sequelize.Promise((resolve, reject) => {
		if(typeof id === "undefined"){
			reject(new Error(`Falta el parámetro <id>`));
		} else {
			id = parseInt(id);
			if (Number.isNaN(id)){
				reject(new Error(`El valor del parámetro <id> no es un número`));
			} else {
				resolve(id);
			}
		}
	});
};

const makeQuestion = text => {
	return new Sequelize.Promise((resolve, reject) => {
		rl.question(colorize(`${text}  `, 'red'), answer => {
			resolve(answer.trim());
		});
	});
};

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
	makeQuestion(' Introduzca una pregunta:')
	.then(q => {
		return makeQuestion(' Introduzca la respuesta:')
		.then(a => {
			return {question: q, answer: a};
		});
	})
	.then(quiz => {
		return models.quiz.create(quiz);
	})
	.then((quiz) => {
		log(` ${colorize('Se ha añadido', 'magenta')}: ${quiz.question}`);
	})
	.catch(Sequelize.ValidationError, error => {
		errorlog('El quiz es erroneo:');
		error.errors.forEach(({message}) => errorlog(message));
	})
	.catch(error => {
		errorlog(error.message);
	})
	.then(() => {
		rl.prompt();
	});
};

const list = () => {
	models.quiz.findAll()
	.each(quiz => {
		log(` [${colorize(quiz.id, 'magenta')}]: ${quiz.question}`);
	}).catch(error => {
		errorlog(error.message);
	}).then(() => {
		rl.prompt();
	});
};

const test = id => {
	validateId(id)
	.then(id => models.quiz.findById(id))
	.then(quiz => {
		if (!quiz) {
			throw new Error(`No existe un quiz asociado al id=${id}`);
		}
		return makeQuestion(quiz.question)
		.then(answer => {
			if(answer.toUpperCase() === quiz.answer.toUpperCase()){
				log(` ${colorize('¡Respuesta correcta!', 'green')}`);
			} else {
				log(` ${colorize('Respuesta incorrecta', 'red')}`);
			}
		});
	}).catch(error => {
		errorlog(error.message);
	}).then(() => {
		rl.prompt();
	});
};

const play = () => {

};

const show = id => {
	validateId(id)
	.then(id => models.quiz.findById(id))
	.then(quiz => {
		if (!quiz) {
			throw new Error(`No existe un quiz asociado al id=${id}`);
		}
		log(` [${colorize(quiz.id, 'magenta')}]: ${quiz.question} ${colorize('=>', 'magenta')} ${quiz.answer}`);
	}).catch(error => {
		errorlog(error.message);
	}).then(() => {
		rl.prompt();
	});
};

const edit = id => {
	validateId(id)
	.then(id => models.quiz.findById(id))
	.then(quiz => {
		if (!quiz) {
			throw new Error(`No existe un quiz asociado al id=${id}`);
		}
		process.stdout.isTTY && setTimeout(() => {rl.write(quiz.question)}, 0);
		return makeQuestion(' Introduzca la pregunta')
		.then(q => {
			process.stdout.isTTY && setTimeout(() => {rl.write(quiz.answer)}, 0);
			return makeQuestion(' Introduzca la respuesta')
			.then(a => {
				quiz.question = q;
				quiz.answer = a;
				return quiz;
			});
		});
	})
	.then(quiz => {
		return quiz.save();
	})
	.then(quiz => {
		log(` Se ha cambiado el quiz ${colorize(quiz.id, 'magenta')} `);
	})
	.catch(Sequelize.ValidationError, error => {
		errorlog('El quiz es erroneo: ');
		error.errors.forEach(({message}) => errorlog(message));
	})
	.catch(error => {
		errorlog(error.message);
	}).then(() => {
		rl.prompt();
	});
};

const del = id => {
	validateId(id)
	.then(id => models.quiz.destroy({where: {id}}))
	.catch(error => {
		errorlog(error.message);
	}).then(() => {
		rl.prompt();
	});
};

const credits = () => {
	console.log('Autor de la práctica:');
	console.log('Daniel Guerra Bernardo');
	rl.prompt();
};

const quit = () => {
	rl.close();
};