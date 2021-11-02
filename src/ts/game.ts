import Bird from "./bird";
import Pipe from "./pipe";
import { gameLifecycle } from "./utils";
import assets from "./assets";

export default class Game implements gameLifecycle {
    defs = {
        baseGravity: 1.5,
        score: 0,
    }
    
    player: Bird;
    pipes: Array<Pipe> = new Array();

    async load(canvas ?: HTMLCanvasElement) {
        const logElem = Game.log("Loading game (Assets...");
        await assets.load();
        logElem.innerHTML += "OK,";
        this.player = new Bird(canvas);
        logElem.innerHTML += "Bird OK,";

        Pipe.gameClass = this;

        for (let i = 0; i < 3; i++) {
            this.pipes.push(new Pipe(canvas, i));
        }
        
        logElem.innerHTML += "Pipes OK)";
        logElem.innerHTML += " ->> Game loaded";
    }

    update(dt: DOMHighResTimeStamp) {
        this.player.update(dt);
        for (let pipe of this.pipes) {
            pipe.update(dt);
        }
    }

    draw(scr: CanvasRenderingContext2D){  
        scr.drawImage(assets.bg, 0, 0);

        for (let pipe of this.pipes) {
            pipe.draw(scr);
        }

        scr.drawImage(assets.fg, 0, scr.canvas.height - assets.fg.height); 
        this.player.draw(scr);
        
        //ctx.drawImage(bird,bX,bY);  
        
    }
    
    keyPress(event: KeyboardEvent) {
        this.player.moveUp();
    }

    
    static log($text) {
        const logContainer = document.getElementById("log");
        const elem = document.createElement("div");
        elem.innerText = $text;
        elem.dataset.hour = new Date().toLocaleTimeString();
        logContainer.prepend(elem);
        return elem;
    }
}