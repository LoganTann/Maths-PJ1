import Bird from "./bird";
import Pipe from "./pipe";
import { gameLifecycle } from "./utils";
import assets from "./assets";

export default class Game implements gameLifecycle {
    defs = {
        baseGravity: 1.5,
        score: 0,
    }
    
    private player: Bird;
    private pipes: Array<Pipe> = new Array();

    async load(canvas ?: HTMLCanvasElement) {
        await assets.load();
        this.player = new Bird(canvas);

        const pipes = this.pipes;
        Pipe.createNewPipe = () => pipes.push(new Pipe(canvas));
        Pipe.removeLastPipe = () => pipes.shift();
        Pipe.createNewPipe();
    }

    update(dt: DOMHighResTimeStamp) {
        for (let pipe of this.pipes) {
            pipe.update(dt);
        }
        this.player.update(dt);
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
        console.log("ee");
        this.player.moveUp();
    }  
}