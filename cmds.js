
const Sequelize = require('sequelize');
const {models} = require('./model');
const {colorize, log, biglog, errorlog} = require('./out');


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

const makeQuestion = (text, rl) => {
	return new Sequelize.Promise((resolve, reject) => {
		rl.question(colorize(`${text}  `, 'red'), answer => {
			resolve(answer.trim());
		});
	});
};

exports.help = (socket, rl) => {
	socket.write('Commandos:');
	socket.write('  h|help - Muestra esta ayuda.');
	socket.write('  list - Listar los quizzes existentes.');
	socket.write('  show <id> - Muestra la pregunta y la respuesta el quiz indicado.');
	socket.write('  add - Añadir un nuevo quiz interactivamente.');
	socket.write('  delete <id> - Borrar el quiz indicado.');
	socket.write('  edit <id> - Editar el quiz indicado.');
	socket.write('  test <id> - Probar el quiz indicado.');
	socket.write('  p|play - Jugar a preguntar aleatoriamente todos los quizzes.');
	socket.write('  credits - Créditos.');
	socket.write('  q|quit - Salir del programa.' + "\n");
	rl.prompt();
};

exports.add = (socket, rl) => {
	makeQuestion(' Introduzca una pregunta:', rl)
	.then(q => {
		return makeQuestion(' Introduzca la respuesta:', rl)
		.then(a => {
			return {question: q, answer: a};
		});
	})
	.then(quiz => {
		return models.quiz.create(quiz);
	})
	.then((quiz) => {
		log(socket, ` ${colorize('Se ha añadido', 'magenta')}: ${quiz.question}`);
	})
	.catch(Sequelize.ValidationError, error => {
		errorlog(socket, 'El quiz es erroneo:');
		error.errors.forEach(({message}) => errorlog(socket, message));
	})
	.catch(error => {
		errorlog(socket, error.message);
	})
	.then(() => {
		rl.prompt();
	});
};

exports.list = (socket, rl) => {
	models.quiz.findAll()
	.each(quiz => {
		log(socket, ` [${colorize(quiz.id, 'magenta')}]: ${quiz.question}`);
	}).catch(error => {
		errorlog(socket, error.message);
	}).then(() => {
		rl.prompt();
	});
};

exports.test = (socket, id, rl) => {
	validateId(id)
	.then(id => models.quiz.findById(id))
	.then(quiz => {
		if (!quiz) {
			throw new Error(`No existe un quiz asociado al id=${id}`);
		}
		return makeQuestion(quiz.question, rl)
		.then(answer => {
			if(answer.toUpperCase() === quiz.answer.toUpperCase()){
				log(socket, ` ${colorize('¡Respuesta correcta!', 'green')}`);
			} else {
				log(socket, ` ${colorize('Respuesta incorrecta', 'red')}`);
			}
		});
	}).catch(error => {
		errorlog(socket, error.message);
	}).then(() => {
		rl.prompt();
	});
};

// let playGame = () {
// 	whereOpt = {'id': {[Sequelize.Op.notIn]: resolved}};
// 	return models.quiz.count({where: whereOpt})
// 	.then(function(count) {
// 		return models.quiz.findAll({
// 			where: whereOpt,
// 			offset: Math.floor(Math.random()*count),
// 			limit: 1
// 		});
// 	})
// 	.then(quizzes => quizzes[0])
// 	.then(quiz => {
// 		if (!quiz) {
// 			log(socket, ` ${colorize('FIN', 'green')}`);
// 			return;
// 		}
// 	})
// }

exports.play = (socket, rl) => {
	let score = 0;
	let nextQ = [];
	models.quiz.findAll({raw: true})
	.then(quizzes => {
		nextQ = quizzes;
	}).then(() => {
		playGame(socket, rl);
	});
	let playGame = (socket, rl) => {
		if (nextQ.length <= 0){
			log(socket, ` ${colorize('FIN', 'green')}`);
			biglog(socket, score, 'green');
			rl.prompt();
			return;
		}
		let pos = Math.floor(Math.random()*nextQ.length);
		let quiz = nextQ[pos];
		nextQ.splice(pos, 1);
		makeQuestion(quiz.question, rl)
		.then(answer => {
			if(answer.toUpperCase() === quiz.answer.toUpperCase()){
				log(socket, ` ${colorize('¡Respuesta correcta!', 'green')}`);
				score++;
				biglog(socket, score, 'blue');
				playGame(socket, rl);
			} else {
				log(socket, ` ${colorize('Respuesta incorrecta', 'red')}`);
				log(socket, ` ${colorize('FIN', 'red')}`);
				biglog(socket, score, 'red');
				rl.prompt();
			}
		})
		.catch(error => {
			errorlog(socket, error.message);
		}).then(() => {
			rl.prompt();
		});
	};
};

exports.show = (socket, id, rl) => {
	validateId(id)
	.then(id => models.quiz.findById(id))
	.then(quiz => {
		if (!quiz) {
			throw new Error(`No existe un quiz asociado al id=${id}`);
		}
		log(socket, ` [${colorize(quiz.id, 'magenta')}]: ${quiz.question} ${colorize('=>', 'magenta')} ${quiz.answer}`);
	}).catch(error => {
		errorlog(socket, error.message);
	}).then(() => {
		rl.prompt();
	});
};

exports.edit = (socket, id, rl) => {
	validateId(id)
	.then(id => models.quiz.findById(id))
	.then(quiz => {
		if (!quiz) {
			throw new Error(`No existe un quiz asociado al id=${id}`);
		}
		process.stdout.isTTY && setTimeout(() => {rl.write(quiz.question)}, 0);
		return makeQuestion(' Introduzca la pregunta', rl)
		.then(q => {
			process.stdout.isTTY && setTimeout(() => {rl.write(quiz.answer)}, 0);
			return makeQuestion(' Introduzca la respuesta', rl)
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
		log(socket, ` Se ha cambiado el quiz ${colorize(quiz.id, 'magenta')} `);
	})
	.catch(Sequelize.ValidationError, error => {
		errorlog(socket, 'El quiz es erroneo: ');
		error.errors.forEach(({message}) => errorlog(socket, message));
	})
	.catch(error => {
		errorlog(socket, error.message);
	}).then(() => {
		rl.prompt();
	});
};

exports.del = (socket, id, rl) => {
	validateId(id)
	.then(id => models.quiz.destroy({where: {id}}))
	.catch(error => {
		errorlog(socket, error.message);
	}).then(() => {
		rl.prompt();
	});
};

exports.credits = (socket, rl) => {
	socket.write('Autor de la práctica:');
	socket.write('Daniel Guerra Bernardo');
	rl.prompt();
};

exports.quit = (socket, rl) => {
	rl.close();
};