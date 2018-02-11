class Team {

    constructor(name) {
        this.name = name;
        this.sWin = 0;
        this.sLoss = 0;
        this.cWin = 0;
        this.cLoss = 0;
        this.totalWins = 0;
        this.totalLosses = 0;
        this.Division = "";
    }

    //Updates stats for given team
    update(wins, losses, inConf) {
        this.totalWins += parseInt(wins);
        this.totalLosses += parseInt(losses);
        if (wins > losses) {
            this.sWin += 1;
            if (inConf)
                this.cWin += 1;
        } else {
            this.sLoss += 1;
            if (inConf)
                this.cLoss += 1;
        }
    }

    //Returns the win ratio for the given team.
    getWinRatio() {
        if (this.totalWins === 0 && this.totalLosses === 0) {
            return 0;
        }
        console.log(`totalWins = ${this.totalWins} & totalLosses = ${this.totalLosses}.`);
        var winRatio = (1.0 * this.totalWins / (this.totalWins + this.totalLosses) * 100);
        console.log(`Win ratio of ${this.name}: ${winRatio}%`);
        return winRatio;
  
    }

    //Rounds a number to two decimal places.
    rounder(winRatio1) {
        var winRatio = winRatio1 * 100.0;
        if (parseInt(((parseInt(winRatio) / 10.0) + 0.5)) > parseInt(winRatio) / 10)
            winRatio = (parseInt(winRatio) + 1) / 100.0;
        else
            winRatio = parseInt(winRatio) / 100.0;
        return winRatio;
    }

    getPrintedStats() {
        var winRatio = this.rounder(this.getWinRatio());
        return (`${this.name} \tW: ${this.sWin} \tL: ${this.sLoss}  \tcW: ${this.cWin} \tcL: ${this.cLoss} \tGW: ${this.totalWins} \tGL: ${this.totalLosses} \tWP: ${winRatio}%\n`);
    }

    getArrayStats() {
        var winRatio = this.rounder(this.getWinRatio());
        return [`${this.sWin}`, `${this.sLoss}`, `${this.cWin}`, `${this.cLoss}`, `${this.totalWins}`, `${this.totalLosses}`, `${winRatio}`];
    }

    

    /*
    setName(name) {
        this.name = name;
    }
    
    setSeriesWins(count) {
        this.sWin = count;
    }

    setSeriesLosses(count) {
        this.sLoss = count;
    }

    setTotalWins(count) {
        this.totalWins = count;
    }

    setTotalLosses(count) {
        this.totalLosses = count;
    }

    setConferenceWins(count) {
        this.cWins = count;
    }

    setConferenceLosses(count) {
        this.cLosses = count;
    }

    //---//
    getSeriesWins() {
        return this.sWin;
    }

    getSeriesLosses() {
        return this.sLoss;
    }

    getTotalWins() {
        return this.totalWins;
    }

    getTotalLosses() {
        return this.totalLosses;
    }

    getDivision() {
        return this.Division;
    }

    getConferenceWins() {
        return this.cWins;
    }

    getConferenceLosses() {
        return this.cLosses;
    }
    getName() {
        return this.name;
    }
    //---//
    */
};
module.exports = Team;