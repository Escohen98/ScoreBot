const Discord = require("discord.js");
const Team = require('./Team.js'); //Imports Team.js class
const SortedMap = require('sortedmap')
class Commands {

        constructor(help, command_prefix) {
            help.set('help', 'view all commands');
            help.set('cmd', `\`${command_prefix}cmd [character]\` to change the command_prefix for this bot. Current prefix: \`${command_prefix}\`.`);
            help.set('addTeam', `\`${command_prefix}addTeam [team name]\` adds team to list of competitors`);
            help.set('delTeam', `\`${command_prefix}delTeam [team name]\` removes team from list of competitors`);
            help.set('addDivision', `\`${command_prefix}addDivision [division name}\` creates new division`);
            help.set('delDivision', `\`${command_prefix}delDivision [division name}\` deletes existing division`);
            help.set('setDivision', `\`${command_prefix}setDivision [team name] , [division name]\` sets division for given team`);
            help.set('override', `\`${command_prefix}override [team name] , [stat] , [value]\` changes the given stat for the given team to the given value. Type \`${command_prefix}help override\` to see all modifiable stats.`);
            help.set('report', `\`${command_prefix}report [team 1], [games won] : [losing team], [games won]\`Adds 1 win to winning team and 1 loss to losing team`);
            help.set('standings', `\`${command_prefix}standings displays\` standings formated: Wins, Losses, Win Percentage`);
            help.set('exit', `\`${command_prefix}exit\` Shuts bot down. Passcode required.`);
         }
            //Displays a list of stats that can be overrided with the override command
            overrideHelp(msg) {
                var text = `\nname - team name.\n`;
                text += `sWin - series wins.\n`;
                text += `sLoss - series losses.\n`;
                text += `cWin - conference wins.\n`;
                text += `cLoss - conference losses.\n`;
                text += `totalWins - games won.\n`;
                text += `totalLosses - games lost.`;
                msg.reply(text);
            }

            //Changes the command_prefix to content proceeding the command.
            //Displays current command_prefix if parameters are left empty.
            command(msg, command_prefix) {
                var temp = msg.content.substring(4).trim();
                if (temp.length === 0)
                    msg.reply('The current prefix is `' + command_prefix + '`');
                else if (temp.length === 1) {
                    command_prefix = temp;
                    msg.reply('Command prefix changed to ' + command_prefix);
                } else
                    msg.reply('Please keep the command to only 1 character.');
            }

                //Creates new team and adds team to Map with the Team name as the key.
            addTeam(msg, cmd, teams) {
                let team = new Team(cmd.substring(8));
                console.log(`Name: ${team.name}`);
                teams.set(team.name, team);
                msg.reply(`${teams.get(team.name).name} added.`);
                console.log(`${team.name}; ${teams.get(team.name).getArrayStats()} added`);
            }

                //Removes team from Map.
            delTeam(msg, cmd, teams) {
                msg.reply(`${cmd.substring(8)} deleted.`);
                console.log(`${cmd.substring(8)}; ${teams.get(cmd.substring(8))} removed`);
                teams.delete(cmd.substring(8));
            }

                //Adds given division to set.
            addDivision(msg, cmd, divisions) {
                divisions.add(cmd.substring(12).trim());
                msg.reply(`${cmd.substring(12).trim()} successfully added.`);
            }

                //Removes given division from set.
            delDivision(msg, cmd, divisions) {
                divisions.delete(cmd.substring(12).trim());
                msg.reply(`${cmd.substring(12).trim()} successfully deleted.`);
            }
            
            //Sets the division of the given team.
            //Both the team and the division must exist in their respected collections.
            setDivision(msg, cmd, teams, divisions) {
                if (cmd.includes(`,`)) {
                    var div = cmd.substring(12).trim().split(",");
                    if (teams.has(div[0].trim()) && divisions.has(div[1].trim())) {
                        var thisTeam = teams.get(div[0].trim());
                        thisTeam.Division = (div[1].trim());
                        msg.reply(`Team ${div[0]} successfully added to ${div[1]} division`);
                    } else
                        msg.reply(`Make sure that you entered the team name and/or division correctly`);
                } else
                    msg.reply(`Make sure that you used a \`,\` to differentiate the team name and division.`);
            }

                //Logs bot out of given server.
           exit(msg, cmd) {
                if (cmd.substring(5) === ' p#ssW0rd!') {
                    msg.reply(`You have initiated the emergency shutdown command.\nBot will be shut down entirely.`);
                    setTimeout(() => {
                        msg.reply(`Good Bye!`);
                        window.exit();
                    }, 3000);
                } else {
                    msg.reply('Incorrect password.')
                }
            }

        //Prints out a list of all commands and their descriptions
        getHelp(msg, help) {
            var display = '\n__List of all commands__';
            for (var key of help.keys()) {
                display += ('\n**' + key + '**		' + help.get(key));
            }
            msg.reply(display);
        }

        //Updates team records.
        //Series Wins, Series Losses, Conference Wins, Conference Losses Total Wins, Total Losses, Win Percentage
        report(msg, cmd, teams) {
            var temp = cmd.substring(7).trim().split(":");
            if (temp.length > 1) {
                var team1 = temp[0].trim().split(",");
                var team2 = temp[1].trim().split(",");
                if (teams.has(team1[0].trim()) && teams.has(team2[0].trim()) && (team2[0].trim() != team1[0].trim())) {
                    var inConf = (teams.get(team1[0]).Division === teams.get(team2[0]).Division);
                    teams.get(team1[0]).update(team1[1].trim(), team2[1].trim(), inConf);
                    teams.get(team2[0]).update(team2[1].trim(), team1[1].trim(), inConf);
                    
                    msg.reply('Team records successfully updated!');
                }
                else {
                    msg.reply('Are you sure that those teams exist or you typed correctly? Remember, 2 teams can\'t be tied');
                }
            } else
                msg.reply(`Remember to split the teams with a \`:\``);
        }

         //Adds all teams and stats from teams Map to string. 
         //Calculates and adds Win percentage
         //Prints string.
        standings(msg, oldteams, divisions) {
            //teams = [...teams.values()].map(e =>{ return e[1];}).slice().sort(this.compare);
            var teams = new Map([...oldteams.entries()].sort(this.compare));
            console.log(`${teams.keys()}`);
            var tlist = `Standings\n`;
            if (divisions.size > 0) {
                for(let valued of divisions) {
                    console.log(`Division: ${valued}`);
                    tlist += (`**${valued} Division**\n`);
                    for (var value of teams) {
                        //console.log(`Team: ${value.name}\n Stats: ${value.getArrayStats}`);
                        console.log(`${value.name}'s division: ${value.Division}`)
                        if (value.Division === valued)
                            tlist += value.getPrintedStats();
                    }
                }
            } else {
                for ([key, value]of teams.entries())
					tlist += value.getPrintedStats();
            }
            msg.reply(tlist);
        }
        
    //Changes the data of the given variable for the given team.
    //Format .override [team],[variable],[new data]
        override(msg, cmd, teams) {
            var text = cmd.substring(8).trim();
            if (text.includes(',')) {
                var p = text.split(',')
                p[0] = p[0].trim();
                p[1] = p[1].trim();
                p[2] = p[2].trim();
                var team = teams.get(p[0]);
                switch (p[1]) {
                    case 'name':
                        team.name = p[2];
                        msg.reply(`${p[1]} successfully set to ${p[2]}`);
                        break;
                    case 'sWin':
                        team.sWin = p[2];
                        msg.reply(`${p[1]} successfully set to ${p[2]}`);
                        break;
                    case 'sLoss':
                        team.sLoss = p[2];
                        msg.reply(`${p[1]} successfully set to ${p[2]}`);
                        break;
                    case 'cWin':
                        team.cWin = p[2];
                        msg.reply(`${p[1]} successfully set to ${p[2]}`);
                        break;
                    case 'cWLoss':
                        team.cLoss = p[2];
                        msg.reply(`${p[1]} successfully set to ${p[2]}`);
                        break;
                    case 'totalWins':
                        team.totalWins = p[2];
                        msg.reply(`${p[1]} successfully set to ${p[2]}`);
                        break;
                    case 'totalLosses':
                        team.totalLosses = p[2];
                        msg.reply(`${p[1]} successfully set to ${p[2]}`);
                        break;
                    default:
                        msg.reply(`Are you sure that you typed the correct command?`);
                        }
                

                        }
        }

        //Compares 2 team objects.
        compare(team1, team2) {
            //Returns 1 if Team 1 series wins per total series > Team 2 series wins per total series. -1 if less.
            if (team1.sWin * 1.0 / (team1.sWin + team1.sLoss) != team2.sWin * 1.0 / (team2.sWin + team2.sLoss)) {
                if (team1.sWin * 1.0 / (team1.sWin + team1.sLoss) > team2.sWin * 1.0 / (team2.sWin + team2.sLoss))
                    return 1;
                return -1;
            }
            //Returns 1 if Team 1 conference wins per conference series > Team 2 conference wins per conference series. -1 if less.
            if (team1.cWin * 1.0 / (team1.cWin + team1.cLoss) != team2.cWin * 1.0 / (team2.cWin + team2.cLoss)) {
                if (team1.cWin * 1.0 / (team1.cWin + team1.cLoss) > team2.cWin * 1.0 / (team2.cWin + team2.cLoss))
                    return 1;
                return -1;
            }

            //Returns 1 if Team 1 winRatio > Team 2 winRatio -1 if less.
            if (team1.getWinRatio() != team2.getWinRatio()) {
                if (team1.getWinRatio() > team2.getWinRatio())
                    return 1;
                return -1;
            }
            //Returns 0 if teams have equal stats. Does not take into account head to head.
            return 0;
        }
};
module.exports = Commands;