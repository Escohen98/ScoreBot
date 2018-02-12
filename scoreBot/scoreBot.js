const Discord = require("discord.js");
const client = new Discord.Client();
const SortedMap = require('sortedmap')
var command_prefix = ";";
var help = new Map();
const Team = require('./Team.js'); //Imports Team.js class
const Command = require('./Commands.js'); //Imports Command.js class
var cmds;
var teams = new Map(); //Teams to keep track of. 1) Series Wins 2) Series Losses 3) Games won 4) Games lost 5) %Games Won 
var divisions = new Set();

client.on('ready', () => {
    let comds = new Command(help, command_prefix);
    cmds = comds;
    console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', msg => {
    if (msg.content.substring(0, 1) === command_prefix) {
        var cmd = msg.content.substring(1);

        //Administrator only commands
        if (msg.member.hasPermission("ADMINISTRATOR")) {

            //Changes the command_prefix to content proceeding the command.
            //Displays current command_prefix if parameters are left empty.
            if(cmd.includes('cmd')) {
                cmds.command(msg, command_prefix);
            }

            //Creates new team and adds team to Map with the Team name as the key.
            else if (cmd.includes('addTeam')) {
                cmds.addTeam(msg, cmd, teams);
            }

            //Removes team from Map.
            else if (cmd.includes('delTeam')) {
                cmds.delTeam(msg, cmd, teams);
            }

            //Adds given division to set.
            else if (cmd.includes('addDivision')) {
                cmds.addDivision(msg, cmd, divisions);
            }

            //Removes given division from set.
            else if (cmd.includes('delDivision') && division.has(cmd.substring(12).trim())) {
                cmds.delDivision(msg, cmd, divisions);
            }

            //Sets the division of the given team.
            else if (cmd.includes('setDivision')) {
               cmds.setDivision(msg, cmd, teams, divisions)
            }

            else if (cmd.includes(`override`)) {
                cmds.override(msg, cmd, teams);
            }

            //Testing purposes only.
            else if (cmd == 'testProgram') {
                cmds.addTeam(msg, 'addTeam Team1', teams);
                cmds.addTeam(msg, 'addTeam Team2', teams);
                cmds.addTeam(msg, 'addTeam Team3', teams);
                cmds.addDivision(msg, 'addDivision Division1', divisions);
                cmds.addDivision(msg, 'addDivision Division2', divisions);
                cmds.setDivision(msg, 'setDivision Team1, Division1', teams, divisions);
                cmds.setDivision(msg, 'setDivision Team2, Division2', teams, divisions);
                cmds.setDivision(msg, 'setDivision Team3, Division1', teams, divisions);
                cmds.report(msg, 'report Team1, 1: Team2, 2', teams);
                cmds.report(msg, 'report Team1, 2: Team3, 0', teams);
                cmds.standings(msg, teams, divisions);
            }

            //Logs bot out of given server.
            else if (cmd.includes('exit')) {
                cmds.exit(msg, cmd);
            }
        }

        //Prints out a list of all commands and their descriptions
        if (cmd.includes('help')) {
            if (cmd.substring(5).trim() === 'override' && msg.member.hasPermission("ADMINISTRATOR")) {
                cmds.overrideHelp(msg);
            } else
            cmds.getHelp(msg, help);
        }

        //Updates team records. Adds 1 to first index for winning team (first team in entry) 
        //and 1 to second index for losing team (second team in entry).
        else if (cmd.includes('report')) {
            cmds.report(msg, cmd, teams);
        }

        //Adds all teams and stats from teams Map to string. 
        //Calculates and adds Win percentage
        //Prints string.
        else if (cmd === 'standings') {
            cmds.standings(msg, teams, divisions);
        }

       /* else {
            msg.reply('Sorry, that command does not exist.');
        }*/
    }
});

client.login('');
