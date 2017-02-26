// Inits
window.onload = function init() {
    var game = new GF();
    game.start();
};

// GAME FRAMEWORK STARTS HERE
var GF = function () {
    // Vars relative to the canvas
    var canvas, ctx, w, h;
    
    var button;
    var analyticsCanvas;
    var analyticsCtx;
    var analysisDiv;
    var gridBox;
    var gridBoxDiv;
    

    // vars for handling inputs
    var inputStates = {};
    inputStates.analyticsToggle = 0;
    inputStates.divisor = 25;
    inputStates.grid = false;

    // game states
    var gameStates = {
        mainMenu: 0,
        gameRunning: 1,
        gameOver: 2
    };
    var currentGameState = gameStates.gameRunning;
    var currentLevel = 1;
    var TIME_BETWEEN_LEVELS = 5000; // 5 seconds
    var currentLevelTime = TIME_BETWEEN_LEVELS;
    var plopSound; // Sound of a ball exploding

    // The monster !
    var monster = {
        dead: false,
        display: true,
        x: 10,
        y: 10,
        width: 50,
        height: 50,
        speed: 100, // pixels/s this time !
        lives: 5
    };

    // array of balls to animate
    var initialNB = 2;
    var ballArray = [];
    var nbBalls = initialNB;
    var goodBalls = nbBalls;

    // clears the canvas content
    function clearCanvas() {
        ctx.clearRect(0, 0, w, h);
    }

    // Functions for drawing the monster and maybe other objects
    function drawMyMonster(x, y) {
        // draw a big monster !
        // head

        // save the context
        ctx.save();

        // translate the coordinate system, draw relative to it
        ctx.translate(x, y);
        ctx.scale(0.5, 0.5);

        // (0, 0) is the top left corner of the monster.
        ctx.fillStyle = 'green';
        ctx.fillRect(0, 0, 100, 100);
        ctx.strokeRect(0, 0, 100, 100);

        // eyes
        ctx.fillStyle = 'black';
        ctx.fillRect(20, 20, 10, 10);
        ctx.fillRect(65, 20, 10, 10);

        // nose
        ctx.strokeRect(45, 40, 10, 40);

        // mouth
        ctx.strokeRect(35, 84, 30, 10);

        // teeth
        ctx.fillRect(38, 84, 10, 10);
        ctx.fillRect(52, 84, 10, 10);

        // restore the context
        ctx.restore();
    }

    
    var mainLoop = function (time) {
        //main function, called each frame 
        measureFPS(time);

        // number of ms since last frame draw
        delta = timer(time);

        // Clear the canvas
        clearCanvas();

        if (monster.dead) {
            currentGameState = gameStates.gameOver;
        }

        switch (currentGameState) {
            case gameStates.gameRunning:
                
                if(monster.display) {
                    // draw the monster
                    drawMyMonster(monster.x, monster.y);

                    // Check inputs and move the monster
                    updateMonsterPosition(delta);
                };

                // update and draw balls
                updateBalls(delta);
                
                if(monster.display) {
                    // display Score
                    displayScore();

                    // When good balls < 0 go to next level

                    if (goodBalls <= 0) {
                        goToNextLevel();
                    }
                }
                
                if(inputStates.analyticsToggle != 0) {
                    if(inputStates.analyticsToggle === 1) {
                        function callbackAnalytics() {
                            updateAnalytics(analyticsCanvas, analysisCtx, ballArray, analysisDiv, 'momentum', inputStates, w, h);
                        };
                        setTimeout(callbackAnalytics,4);
                    }
                }
                
                break;
            case gameStates.mainMenu:
                // TO DO !
                break;
            case gameStates.gameOver:
                ctx.save();
                ctx.fillStyle = 'white';
                ctx.fillText("GAME OVER", 50, 100);
                ctx.fillText("Press SPACE to start again", 50, 150);
                ctx.fillText("Move with arrow keys", 50, 200);
                ctx.fillText("Pop all the small bubbles", 50, 250);
                ctx.fillText("and dodge the big ones.", 50, 300);
                ctx.restore();
                if (inputStates.space) {
                    startNewGame();
                }
                break;
        }

        // call the animation loop every 1/60th of second
        requestAnimationFrame(mainLoop);
    };

    function startNewGame() {
        monster.dead = false;
        currentLevel = 1;
        nbBalls = initialNB;
        goodBalls = nbBalls;
        createBalls(nbBalls);
        currentGameState = gameStates.gameRunning;
    }

    function goToNextLevel() {
        currentLevel++;
        // Add one pair of balls per level
        nbBalls += 1;
        // Add one life every two levels
        if(currentLevel%2 === 0) {
            monster.lives++;
        }
        goodBalls = nbBalls;
        createBalls(nbBalls);
    }

    function displayScore() {
        ctx.save();
        ctx.fillStyle = '#5A5';
        ctx.fillText("Level: " + currentLevel, 300, 30);
        ctx.fillText("Balls: " + (2*nbBalls), 300, 60);
        ctx.fillText("Lives: " + monster.lives, 300, 90);
        ctx.restore();
    }
    
    function updateMonsterPosition(delta) {
        monster.speedX = monster.speedY = 0;
        // check inputStates
        if (inputStates.left) {
            monster.speedX = -monster.speed;
        }
        if (inputStates.up) {
            monster.speedY = -monster.speed;
        }
        if (inputStates.right) {
            monster.speedX = monster.speed;
        }
        if (inputStates.down) {
            monster.speedY = monster.speed;
        }
        if (inputStates.space) {
        }
        if (inputStates.mousePos) {
        }
        if (inputStates.mousedown) {
            monster.speed = 500;
        } else {
            // mouse up
            monster.speed = 100;
        }

        // Compute the incX and inY in pixels depending
        // on the time elasped since last redraw
        monster.x += calcDistanceToMove(delta, monster.speedX);
        monster.y += calcDistanceToMove(delta, monster.speedY);
        testMonsterWallCollisions(monster, w, h);
    }

    function updateBalls(delta) {
        ballCollisions(ballArray);
        // Move and draw each ball, test collisions, 
        for (var i = 0; i < ballArray.length; i++) {
            var ball = ballArray[i];
            if(ball.dead) {continue;}
            else {
                // 1) move the ball
                ball.move();

                // 2) test if the ball collides with a wall
                testCollisionWithWalls(ball, w, h);
                
                if(monster.display) {
                    // Test if the monster collides
                    if (circRectsOverlap(monster.x, monster.y,
                            monster.width, monster.height,
                            ball.x, ball.y, ball.radius)) {
                        if(ball.set === 0) {
                            ball.color = 'green';
                            goodBalls--;
                        } else {
                            //change the color of the ball
                            ball.color = 'red';
                            monster.lives -= 1;
                            if(monster.lives <= 0) {
                                monster.dead = true;
                                monster.lives = 3;
                            }
                        }
                        ball.dead = true;
                        ball.momentum = 0;
                        // Here, a sound effect greatly improves
                        // the experience!
                        plopSound.play();
                    }
                };

                // 3) draw the ball
                ball.draw(ctx);
            }
        }
    }

 

    function createBalls(numberOfBalls) {
        // Start from an empty array
        ballArray = [];
        for (var set = 0; set < 2; set++) { 
            for (var i = 0; i < numberOfBalls; i++) {
                // Create a ball with random position and speed. 
                // You can change the radius
                // Create a ball with random position and speed
                var ball =  new Ball(w*Math.random(),
                                      h*Math.random(),
                                      (10*Math.random())-5,
                                      (500*Math.random())-250,
                                      20*(set+1),set); // radius
                // Do not create a ball on the player. We augmented the ball radius 
                // to ensure the ball is created far from the monster. 
                if ((!circRectsOverlap(monster.x, monster.y,
                        monster.width, monster.height,
                        ball.x, ball.y, ball.radius * 3)) || (!monster.display)) {
                    // Add it to the array
                    ballArray[i+(set * numberOfBalls)] = ball;
                } else {
                    i--;
                };
            };
        };
        for(var j = 0; j<numberOfBalls*2; j++) {
            if(!ballArray[j] instanceof Ball) {
                console.log("Ball " + (j+1) + " unsuccessful. Restarting ball generation.");
                createBalls(numberOfBalls);
            };
        };
    }

    function loadAssets(callback) {
        // here we should load the souds, the sprite sheets etc.
        // then at the end call the callback function

        // simple example that loads a sound and then calls the callback. We used the howler.js WebAudio lib here.
        // Load sounds asynchronously using howler.js
        plopSound = new Howl({
            urls: ['http://mainline.i3s.unice.fr/mooc/plop.mp3'],
            autoplay: false,
            volume: 1,
            onload: function () {
                console.log("all sounds loaded");
                // We're done!
                callback();
            }
        });
    }
    var start = function () {
        initFPSCounter();

        // Canvas, context etc.
        canvas = document.querySelector("#myCanvas");

        // often useful
        w = canvas.width;
        h = canvas.height;

        // important, we will draw with this object
        ctx = canvas.getContext('2d');
        // default police for text 
        ctx.font = "20px Arial";
        
        button = document.querySelector("#analyticsToggle");
        analyticsCanvas = document.querySelector('#analysisCanvas');
        analysisCtx = analyticsCanvas.getContext('2d');
        analysisDiv = document.querySelector("#analysisDiv");
        gridBox = document.querySelector("#gridBox");
        gridBoxDiv = document.querySelector("#gridBoxDiv");
        
        monsterDisplayButton = document.querySelector("#monsterDisplayToggle");

        // Create the different key and mouse listeners
        addListeners(inputStates, canvas, button, analysisDiv, analyticsCanvas, analysisCtx, gridBox, gridBoxDiv, ballArray, monsterDisplayButton, monster);
        
        // Display startup screen
        
        ctx.save(); 
        ctx.fillStyle = 'white';
        ctx.fillText("WELCOME, BUBBLE MONSTER", 50, 100);
        ctx.fillText("Move with arrow keys", 50, 150);
        ctx.fillText("Pop the small bubbles", 50, 200);
        ctx.fillText("Dodge the big ones", 50, 250);
        ctx.fillText("It's quite simple, really.", 50, 300);
        ctx.restore();
        
        // We create the balls: try to change the parameter
        createBalls(nbBalls);
        
        function callback() {
            loadAssets(function () {
                // all assets (images, sounds) loaded, we can start the animation
                requestAnimationFrame(mainLoop);
            });
        };
        setTimeout(callback,5000);
    };

    //our GameFramework returns a public API visible from outside its scope
    return {
        start: start
    };
}


