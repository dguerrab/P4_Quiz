

const readline = require('readline');
console.log('QUIZ CORE');

const rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout,
	prompt: 'quiz> '
});

rl.prompt();

rl.on('line', (line) => {
	switch (line.trim()) {
		case '':
			break;
		case 'help':
		case 'h':
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
			break;
		case 'quit':
		case 'q':
			rl.close();
			break;
		case 'add':
			console.log('Añadir un nuevo quiz.');
			break;		
		case 'list':
			console.log('Listar los quizzes existentes.');
			break;
		case 'show':
			console.log('Muestra la pregunta y la respuesta el quiz indicado.');
			break;
		case 'test':
			console.log('Probar el quiz indicado.');
			break;	
		case 'play':
		case 'p':
			console.log('Jugar a preguntar aleatoriamente todos los quizzes.');
			break;	
		case 'delete':
			console.log('Borrar el quiz indicado.');
			break;	
		case 'edit':
			console.log('Editar el quiz indicado.');
			break;	
		case 'credits':
			console.log('Autor de la práctica:');
			console.log('Daniel Guerra Bernardo');
			break;	
		default:
			console.log(`Comando desconocido '${line.trim()}'`);
			console.log('Use 'help' para ver los comandos disponibles.');
			break;
	}
	rl.prompt();
}).on('close', () => {
	console.log('¡Hasta otra!');
	process.exit(0);
});
