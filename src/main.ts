'use strict';
import Game from './ts/game';


// dom content loaded
document.addEventListener('DOMContentLoaded', () => {
    const actionBtn = document.getElementById('btn');
    let started = false;
    actionBtn.addEventListener('click', () => {
        if (started) {
            started = false;
            actionBtn.innerText = 'Start';
            return;
        } else {
            actionBtn.innerText = 'Kill';
            document.getElementById("log").innerHTML = '';
            started = true;
        }

        actionBtn.blur();
        const canvas = <HTMLCanvasElement> document.getElementById("canvas");  
        const ctx: CanvasRenderingContext2D = canvas.getContext("2d"); 
        const game = new Game();

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
        game.load(canvas)
            .then(()=> {
                requestAnimationFrame(gameloop);
                document.addEventListener("keydown", game.keyPress.bind(game));
            });
    });
});

