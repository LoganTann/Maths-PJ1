import Game from "./game";

export default {
    bird: HTMLImageElement = null,
    bg: HTMLImageElement = null,
    fg: HTMLImageElement = null,
    pipe: HTMLImageElement = null,
    pipeRev: HTMLImageElement = null,

    defs: {
        bird: require("../../assets/yellowbird-upflap.png"),
        bg: require("../../assets/background-day.png"),
        fg: require("../../assets/base.png"),
        pipe: require("../../assets/pipe-green.png"),
        pipeRev: require("../../assets/pipe-green-rev.png")
    },

    load() {
        const log = Game.log("Loading assets...");
        const imagePromises = [];

        for (let asset in this.defs) {
            this[asset] = new Image();
            const field = this[asset];
            field.src = this.defs[asset];
            imagePromises.push(new Promise(function(resolve, reject) {
                log.innerHTML += " (Creating " + field.src + ") ";
                field.onload = function() {
                    log.innerHTML += " (Solved " + field.src + ") ";
                    resolve('')
                };
                field.onerror = function(e) {
                    log.innerHTML += " (Failed " + field.src + " : " + e + ") ";
                    reject('')
                };
            }));
        }
        
        Game.log("Promises created");
        return Promise.all(imagePromises);
    }
}