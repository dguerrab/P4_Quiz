const figlet = require('figlet');
const chalk = require('chalk');

const colorize = (socket, msg, color) => {
	if(typeof color !== "undefined"){
		msg = chalk[color].bold(msg);
	}
	return msg;
};

const log = (socket, msg, color) => {
	socket.write(colorize(msg, color) + "\n");
};

const biglog = (msg, color) => {
	log(socket, figlet.textSync(msg, {horizontalLayout: 'full'}), color);
};

const errorlog = (socket, msg) => {
	socket.write(`${colorize("Error", "red")}: ${colorize(colorize(msg, "red"), "bgYellowBright")}` + `\n`);
};

exports = module.exports = {
	colorize,
	log,
	biglog,
	errorlog
};