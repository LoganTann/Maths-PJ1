export default {
    bird: null,
    bg: null,
    fg: null,
    pipe: null,
    pipeRev: null,

    defs: {
        bird: require("../../assets/yellowbird-upflap.png"),
        bg: require("../../assets/background-day.png"),
        fg: require("../../assets/base.png"),
        pipe: require("../../assets/pipe-green.png"),
        pipeRev: require("../../assets/pipe-green-rev.png")
    },

    load() {
        console.log(this.defs);
        const imagePromises = [];

        for (let asset in this.defs) {
            this[asset] = new Image();
            const field = this[asset];
            field.src = this.defs[asset];
            imagePromises.push(new Promise(function(resolve, reject) {
                field.onload = resolve
                field.onerror = reject
            }));
        }
        return Promise.all(imagePromises);
    }
}