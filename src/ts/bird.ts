import assets from "./assets";
import { Coord, gameLifecycle } from "./utils";
import Game from "./game";
import Pipe from "./pipe";
const synaptic = require('synaptic');

export default class Bird implements gameLifecycle{
    defs: Object;

    pos: Coord;
    velocity_y: number = 0 // vitesse axe y 
    maxvelocity_y: number = 20;
    acceleration_y: number = 1300; // accélération y (gravité)
    died: boolean = false;


    public static gameClass: Game;
    public perceptron;
    distanceToNextPipe: Coord;

    die() {
        this.died = true;
    }
    constructor(canvas?: HTMLCanvasElement) {
        this.load(canvas);
    }
    load(canvas?: HTMLCanvasElement) { 
        this.pos = {x: 70, y: canvas.height/2 || 500};


        this.perceptron = new synaptic.Architect.Perceptron(2, 6, 1);

        // set additional parameters for the new unit// optionnal
        this.perceptron.index = 0;
        this.perceptron.fitness = 0;
        this.perceptron.score = 0;
        this.perceptron.isWinner = false;
    }

    static getLastPipe() {
        return Bird.gameClass.pipes[(Pipe.closest - 1) % 3];
    }

    update(dt: number) {
        this.velocity_y += Math.min(this.acceleration_y * dt, this.maxvelocity_y);
        this.pos.y = Math.min(this.pos.y + this.velocity_y * dt,390);

        
        if (this.died) return;

        const nextPipe: Pipe = Pipe.getClosestPipe();
        if (nextPipe.birdCollide(this.pos) || Pipe.getClosestPipe(-1).birdCollide(this.pos)) {
            this.die();
        }
        const nextPipePos: Coord = nextPipe.getCenterPos();
        this.distanceToNextPipe = {
            x: nextPipePos.x - this.pos.x - assets.bird.width * 0.5,
            y: nextPipePos.y - this.pos.y - assets.bird.height * 0.5
        };
        
		// input 1: the horizontal distance between the bird and the target
        //var targetDeltaX = Bird.normalize(this.distanceToNextPipe.x, 700) * this.SCALE_FACTOR;
		// input 2: the height difference between the bird and the target
        //var targetDeltaY = Bird.normalize(this.distanceToNextPipe.y, 800) * this.SCALE_FACTOR;

		// create an array of all inputs
		var inputs = [this.distanceToNextPipe.x, this.distanceToNextPipe.y];

		// calculate outputs by activating synaptic neural network of this bird
		var outputs = this.perceptron.activate(inputs);

		// perform flap if output is greater than 0.5
		if (outputs[0] > 0.5) this.moveUp();
    }
    draw(scr: CanvasRenderingContext2D) {
        if (this.died) {
            scr.globalAlpha = 0.4;
            scr.drawImage(assets.bird, this.pos.x, this.pos.y);
            scr.globalAlpha = 1;
            return;
        }
        
        scr.drawImage(assets.bird, this.pos.x, this.pos.y);
    }
    moveUp() {
        if (this.died) return; 
        this.velocity_y = -300;
    }



    static normalize(value, max){
		// clamp the value between its min/max limits
		if (value < -max) value = -max;
		else if (value > max) value = max;
		
		// normalize the clamped value
		return (value/max);
	}
}