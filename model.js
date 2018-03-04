let quizzes = [
	{
		question: "Capital de Italia",
		answer: "Roma"
	},
	{
		question: "Capital de Grecia",
		answer: "Atenas"
	},
	{
		question: "Capital de España",
		answer: "Madrid"
	},
	{
		question: "Capital de Portugal",
		answer: "Lisboa"
	}
];

exports.count = () => quizzes.length;

exports.addQ = (question, answer) => {
	quizzes.push({
		question: (question || "").trim(),
		answer: (answer || "").trim()
	});
};

exports.update = (id, question, answer) => {
	const quiz = quizzes[id];
	if(typeof quiz === "undefined"){
		throw new Error(`El valor de id no es válido`);
	}
	quizzes.splice(id, 1, {
		question: (question || "").trim(),
		answer: (answer || "").trim()
	});
};

exports.getAll = () => JSON.parse(JSON.stringify(quizzes));

exports.getById = id => {
	const quiz = quizzes[id];
	if(typeof quiz === "undefined"){
		throw new Error(`El valor de id no es válido`);
	}
	return JSON.parse(JSON.stringify(quiz));
};

exports.deleteById = id => {
	const quiz = quizzes[id];
	if(typeof quiz === "undefined"){
		throw new Error(`El valor de id no es válido`);
	}
	quizzes.splice(id, 1);
};
