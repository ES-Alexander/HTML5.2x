function addListeners(inputStates, canvas, button, analysisDiv, analyticsCanvas, analysisCtx, gridBox, gridBoxDiv, ballArray, monsterDisplayButton, mDisplay) {
    //add the listener to the main, window object, and update the states
    window.addEventListener('keydown', function (event) {
        if (event.keyCode === 37) {
            inputStates.left = true;
        } else if (event.keyCode === 38) {
            inputStates.up = true;
        } else if (event.keyCode === 39) {
            inputStates.right = true;
        } else if (event.keyCode === 40) {
            inputStates.down = true;
        } else if (event.keyCode === 32) {
            inputStates.space = true;
        }
    }, false);

    //if the key will be released, change the states object 
    window.addEventListener('keyup', function (event) {
        if (event.keyCode === 37) {
            inputStates.left = false;
        } else if (event.keyCode === 38) {
            inputStates.up = false;
        } else if (event.keyCode === 39) {
            inputStates.right = false;
        } else if (event.keyCode === 40) {
            inputStates.down = false;
        } else if (event.keyCode === 32) {
            inputStates.space = false;
        }
    }, false);

    // Mouse event listeners
    canvas.addEventListener('mousemove', function (evt) {
        inputStates.mousePos = getMousePos(evt, canvas);
    }, false);

    canvas.addEventListener('mousedown', function (evt) {
        inputStates.mousedown = true;
        inputStates.mouseButton = evt.button;
    }, false);

    canvas.addEventListener('mouseup', function (evt) {
        inputStates.mousedown = false;
    }, false);
    
    button.addEventListener('click', function (evt) {
        if(inputStates.analyticsToggle != null) {
        inputStates.analyticsToggle += 1;
        inputStates.analyticsToggle %= 2;
        } else {
            inputStates.analyticsToggle = 0;
        }
        if (inputStates.analyticsToggle === 1) {
            console.log("analytics displayed for momentum");
            button.innerHTML = "Analytics: Momentum";
            displayAnalytics(analyticsCanvas, analysisDiv, gridBoxDiv);
        } else {
            console.log("analytics hidden");
            button.innerHTML = "Analytics: Hidden";
            hideAnalytics(analyticsCanvas, analysisDiv, gridBoxDiv);
        }
    }, false);
    
    monsterDisplayButton.addEventListener('click', function (evt) {
        mDisplay.display = (!mDisplay.display);
        if(mDisplay.display) {
            monsterDisplayButton.innerHTML = "Monster Display: On";
        } else {
            monsterDisplayButton.innerHTML = "Monster Display: Off";
        }
        
        console.log("monster display changed to " + mDisplay.display);
    }, false);
    
    gridBox.addEventListener('change', function(evt) {
        inputStates.grid = gridBox.checked;
    }, false);
        
}

function getMousePos(evt, canvas) {
    // necessary to take into account CSS boudaries
    var rect = canvas.getBoundingClientRect();
    return {
        x: evt.clientX - rect.left,
        y: evt.clientY - rect.top
    };
}
