const fs = require("fs");
const Sequelize = require('sequelize');
const options = { logging: false, operatorsAliases: false };
const sequelize = new Sequelize("sqlite:db.sqlite", options);

// const user = sequelize.define(
// 	'user',	{ 
// 		name: {
// 			type: Sequelize.STRING,
// 			unique: { msg: "Name already exists"},
// 			validate: {
// 				is: { args: /^[a-z]+$/i, msg: "name: invalid characters"}
// 			}
// 		}
// 	}
// );

sequelize.define('quiz', {
	question:{
		type: Sequelize.STRING,
		unique: {msg: "Esta pregunta ya existe"},
		validate: {notEmpty: {msg: "La pregunta no puede estar vacía"}}
	},
	answer: {
		type: Sequelize.STRING,
		validate: {notEmpty: {msg: "La respuesta no puede estar vacía"}}
	}
});

sequelize.sync()
.then(() => sequelize.models.quiz.count())
.then((count) => {
	if(!count){
		return sequelize.models.quiz.bulkCreate([
			{ question: 'Capital de Italia', answer: 'Roma'},
			{ question: 'Capital de España', answer: 'Madrid'},
			{ question: 'Capital de Rusia', answer: 'Moscu'},
			{ question: 'Capital de Grecia', answer: 'Atenas'}
		]);
	}
})
.catch(error => {
	errorlog(error.message);
});

module.exports = sequelize;


// const DB_FILENAME = "quizzes.json";

// let quizzes = [
// 	{
// 		question: "Capital de Italia",
// 		answer: "Roma"
// 	},
// 	{
// 		question: "Capital de Grecia",
// 		answer: "Atenas"
// 	},
// 	{
// 		question: "Capital de España",
// 		answer: "Madrid"
// 	},
// 	{
// 		question: "Capital de Portugal",
// 		answer: "Lisboa"
// 	}
// ];

// const load = () => {
// 	fs.readFile(DB_FILENAME, (err, data) => {
// 		if(err) {
// 			if(err.code === "ENOENT"){
// 				save();
// 				return;
// 			}
// 			throw err;
// 		}
// 		let json = JSON.parse(data);
// 		if (json){quizzes = json;}
// 	});
// };

// const save = () => {
// 	fs.writeFile(DB_FILENAME, JSON.stringify(quizzes), err => {
// 		if(err) throw err;
// 	});
// };

// exports.count = () => quizzes.length;

// exports.addQ = (question, answer) => {
// 	quizzes.push({
// 		question: (question || "").trim(),
// 		answer: (answer || "").trim()
// 	});
// 	save();
// };

// exports.update = (id, question, answer) => {
// 	const quiz = quizzes[id];
// 	if(typeof quiz === "undefined"){
// 		throw new Error(`El valor de id no es válido`);
// 	}
// 	quizzes.splice(id, 1, {
// 		question: (question || "").trim(),
// 		answer: (answer || "").trim()
// 	});
// 	save();
// };

// exports.getAll = () => JSON.parse(JSON.stringify(quizzes));

// exports.getById = id => {
// 	const quiz = quizzes[id];
// 	if(typeof quiz === "undefined"){
// 		throw new Error(`El valor de id no es válido`);
// 	}
// 	return JSON.parse(JSON.stringify(quiz));
// };

// exports.deleteById = id => {
// 	const quiz = quizzes[id];
// 	if(typeof quiz === "undefined"){
// 		throw new Error(`El valor de id no es válido`);
// 	}
// 	quizzes.splice(id, 1);
// 	save();
// };

// //Carga los quizzes
// load();