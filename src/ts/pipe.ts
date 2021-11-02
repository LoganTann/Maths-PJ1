import assets from "./assets";
import Game from "./game";
import { Coord, gameLifecycle, randint } from "./utils";

export default class Pipe implements gameLifecycle{
    private static gap: Coord = {x: 180, y: 100};
    private static speed: number = -130;
    public static gameClass: Game;

    public defs: {[key: string]: any} = {};
    private id: number;
    private position: Coord;  /// position x, y = left, center

    constructor(canvas: HTMLCanvasElement, id: number) {
        this.id = id;
        this.defs.canvasWidth = canvas.width;
        this.load(canvas);
    }
    load(canvas: HTMLCanvasElement) {
        this.restore(this.defs.canvasWidth + Pipe.gap.x * (this.id + 1));
    }

    private restore(x = 0) {
        this.position = {
            x: x,
            y: randint(4, 15) * 20
        }
    }


    centerY: number;
    centerX(): number {
        return this.position.x + assets.pipe.width;
    }

    update(dt) {
        this.position.x += Pipe.speed * dt;
        if (this.position.x < -60) {
            this.restore(Pipe.gameClass.pipes[(this.id + 2) % 3].position.x + Pipe.gap.x);
        }
        if (this.birdCollide()) {
            Pipe.gameClass.player.die();
        }
    }
    birdCollide(){
        //x1, x2           = Left
        //x1 + w1, x2 + w2 = Right
        //y1, y2           = Bottom
        //y1 - h1, y2 - h2 = Top
        const birdPos: Coord = Pipe.gameClass.player.pos;
        const birdSize: Coord = {x: assets.bird.width, y: assets.bird.height};
        const help = 3;
        return  (birdPos.x < this.position.x + assets.pipe.width) &&
                (birdPos.x + birdSize.x > this.position.x) && (
                    (birdPos.y + birdSize.y > this.position.y + Pipe.gap.y + help) ||
                    (birdPos.y < this.position.y - Pipe.gap.y/2 - help)
                );
    }
    draw(scr) {
        // celle du haut
        scr.drawImage(assets.pipeRev, this.position.x, this.position.y - Pipe.gap.y/2 - assets.pipe.height);
        // celle du bas
        scr.drawImage(assets.pipe, this.position.x, this.position.y + Pipe.gap.y/2);
        // objectif
        scr.fillRect(this.centerX()-5,this.position.y-5,10,10); // fill in the pixel at (10,10)
    }

}