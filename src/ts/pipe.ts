import assets from "./assets";
import Game from "./game";
import { Coord, gameLifecycle, randint } from "./utils";

export default class Pipe implements gameLifecycle{
    static gap: number = 100;
    static speed: number = -130;
    public static createNewPipe: CallableFunction;
    public static removeLastPipe: CallableFunction;
    
    public static lastCreatedPosY: number;

    defs: {[key: string]: any} = {};

    private position: Coord;  /// position x, y = left, center
    private createdPipe = false;
    public static parent: Game;

    constructor(canvas: HTMLCanvasElement) {
        Pipe.lastCreatedPosY = canvas.height/2;
        this.load(canvas);
    }
    load(canvas: HTMLCanvasElement) {
        this.defs.canvasWidth = canvas.width;
        let y = randint(4, 15) * 20;
        let i = 0;
        while (i < 5 && y < Pipe.lastCreatedPosY - 100 && y > Pipe.lastCreatedPosY + 100) {
            y = randint(4, 15) * 20;
            i++;
            Game.log("recherche du random en cours...");
        }
        Pipe.lastCreatedPosY = y;
        this.position = {x: this.defs.canvasWidth, y: y};
        Game.log("Pipe rechargée");
    }

    centerY: number;
    centerX(): number {
        return this.position.x + assets.pipe.width;
    }

    update(dt) {
        this.position.x += Pipe.speed * dt;
        if (!this.createdPipe && this.position.x < (this.defs.canvasWidth - 180)) {
            this.createdPipe = true;
            Pipe.createNewPipe();
        }
        if (this.position.x < -60) {
            Pipe.removeLastPipe();
        }
        if (this.birdCollide()) {
            Pipe.parent.player.die();
        }
    }
    birdCollide(){
        //x1, x2           = Left
        //x1 + w1, x2 + w2 = Right
        //y1, y2           = Bottom
        //y1 - h1, y2 - h2 = Top
        const birdPos: Coord = Pipe.parent.player.pos;
        const birdSize: Coord = {x: assets.bird.width, y: assets.bird.height};
        const help = 3;
        return  (birdPos.x < this.position.x + assets.pipe.width) &&
                (birdPos.x + birdSize.x > this.position.x) && (
                    (birdPos.y + birdSize.y > this.position.y + Pipe.gap + help) ||
                    (birdPos.y < this.position.y - Pipe.gap/2 - help)
                );
    }
    draw(scr) {
        // celle du haut
        scr.drawImage(assets.pipeRev, this.position.x, this.position.y - Pipe.gap/2 - assets.pipe.height);
        // celle du bas
        scr.drawImage(assets.pipe, this.position.x, this.position.y + Pipe.gap/2);
        // objectif
        scr.fillRect(this.centerX()-5,this.position.y-5,10,10); // fill in the pixel at (10,10)

        scr.fillRect(this.position.x,this.position.y - Pipe.gap/2,assets.pipe.width,Pipe.gap); // fill in the pixel at (10,10)
    }

}