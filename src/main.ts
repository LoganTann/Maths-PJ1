'use strict';
import Game from './ts/game';


// dom content loaded
document.addEventListener('DOMContentLoaded', () => {
    const startBtn = <HTMLButtonElement> document.getElementById('btn');
    const stopBtn = <HTMLButtonElement> document.getElementById('btnStop');
    const canvas = <HTMLCanvasElement>document.getElementById("canvas");
    const ctx: CanvasRenderingContext2D = canvas.getContext("2d");
    let started = false;
    let game;


    let lastElapsedTime: DOMHighResTimeStamp = 0;
    function gameloop(elapsedTime: DOMHighResTimeStamp) {
        let dt = (elapsedTime - lastElapsedTime) * 0.001;
        if (dt > 1) {
            // might be due to the game being restarted...
            dt = 0.016;
            Game.log("Warning: dt > 1");
        }
        lastElapsedTime = elapsedTime;
        game.update(dt);
        game.draw(ctx);
        if (started) {
            requestAnimationFrame(gameloop);
        }
    }

    let btnActionCallback = function() {
        started = true;
        startBtn.disabled = true;
        stopBtn.disabled = false;
        startBtn.blur();

        if (startBtn.innerText == "Restart") {
            started = true;
            game.reset(canvas);
            requestAnimationFrame(gameloop);
            return;
        } // else : game is not intialized yet
        startBtn.innerText = "Restart";
        game = new Game();
        game.load(canvas)
            .then(() => {
                requestAnimationFrame(gameloop);
                document.addEventListener("keydown", game.keyPress.bind(game));
            });
    };

    startBtn.addEventListener('click', btnActionCallback);
    stopBtn.addEventListener('click', ()=>{
        started = false;
        startBtn.disabled = false;
        stopBtn.disabled = true;
    });
});

