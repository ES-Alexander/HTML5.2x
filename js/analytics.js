function displayAnalytics(canvas, div, box) {
    canvas.style.display = 'inline';
    div.style.display = 'block';
    box.style.display = 'block';
}

function hideAnalytics(canvas, div, box) {
    canvas.style.display = 'none';
    div.style.display = 'none';
    box.style.display = 'none';
}

var AnalysisObject = function(objectToAnalyse, property) {
    this.baseObject = objectToAnalyse;
    if(property === 'momentum') {
        if (this.baseObject.dead) {this.momentum = 0;}
        else {
            this.momentum = Math.sqrt(
                (this.baseObject.vx)*(this.baseObject.vx)+
                (this.baseObject.vy)*(this.baseObject.vy))*this.baseObject.mass;
        };
    }
}

function updateAnalytics(canvas,ctx,objectArray,div,property, inputStates, w, h) {
    ctx.save();
    ctx.fillStyle = 'rgba(240,255,255,0.2)';
    ctx.fillRect(0,0,canvas.width, canvas.height);
    ctx.restore(); //*/
    /*ctx.clearRect(0,0,canvas.width,canvas.height);*/
    if(property === 'momentum') {
        var totalMomentum = 0;
        var nBalls = 0;
        var averageMomentum = 0;
        var momentumMax = 0;
        ctx.save();
        var lingrad = ctx.createLinearGradient(0,canvas.height/2, canvas.width, canvas.height/2);
        lingrad.addColorStop(0,'black');
        lingrad.addColorStop(0.2,'darkred');
        lingrad.addColorStop(0.5,'red');
        lingrad.addColorStop(0.7,'green');
        lingrad.addColorStop(0.9,'blue');
        ctx.fillStyle = lingrad;
        ctx.beginPath();
        ctx.moveTo(10,40+(340/(objectArray.length*3))/2);
        if(inputStates.grid) {
            ctx.save();
            ctx.fillStyle = 'rgba(0,0,0,0.03)';
            var i = 0;
            while(10+i*(500/inputStates.divisor) < canvas.width) {
                ctx.fillRect(10+i*(500/inputStates.divisor), 30, 1+((i+1)%2), canvas.height-40);
                i++;
            }
            ctx.restore();
        }
        for(var i=0; i<objectArray.length; i++) {
            var analysisObject = new AnalysisObject(objectArray[i], 'momentum');
            if(isNaN(analysisObject.momentum)) {
                var set;
                if(i<objectArray.length/2) {set = 0;}
                else {set = 1;}
                objectArray[i] = new Ball(w*Math.random(),
                                    h*Math.random(),
                                    (10*Math.random())-5,
                                    (500*Math.random())-250,
                                    20*(set+1),set);
                analysisObject = new AnalysisObject(objectArray[i], 'momentum');
            };
            if(inputStates.grid) {
                ctx.save();
                ctx.fillStyle = 'rgba(0,0,0,0.03)';
                ctx.fillRect(0,40+i*340/objectArray.length+(340/(objectArray.length*3))/2,canvas.width,1);
                ctx.restore();
            }
            ctx.fillRect(10, 40+i*(canvas.height-60)/objectArray.length, analysisObject.momentum/inputStates.divisor, (canvas.height-60)/(objectArray.length*3));
            if(!analysisObject.baseObject.dead) {
                if(analysisObject.momentum !== null) {totalMomentum += analysisObject.momentum;}
                else {totalMomentum += 0;}
                nBalls++;
            }
            ctx.lineTo(analysisObject.momentum/inputStates.divisor+10, 40+i*(canvas.height-60)/objectArray.length+((canvas.height-60)/(objectArray.length*3))/2);
            if(analysisObject.momentum > momentumMax) {
                momentumMax = analysisObject.momentum;
            }
        }
        averageMomentum = totalMomentum/nBalls;
        ctx.lineTo(10,40+(objectArray.length-1)*(canvas.height-60)/objectArray.length+((canvas.height-60)/(objectArray.length*3))/2);
        ctx.strokeStyle = 'rgba(0,0,0,0.5)';
        ctx.lineWidth = 1;
        ctx.stroke();
        ctx.fillStyle = 'rgba(0,0,0,0.05)';
        ctx.fill();
        ctx.fillStyle = 'rgba(255,0,0,0.5)';
        ctx.fillRect(averageMomentum/inputStates.divisor,30,2,canvas.height-40);
        ctx.fillStyle = 'black';
        ctx.font = '30px Arial';
        ctx.fillText('Momentum',120,25);
        ctx.restore();
        div.innerHTML = "Total Momentum: " + pRound(totalMomentum, 5) +
            "<br> Average Momentum: " + pRound(averageMomentum, 5) +
            "<br> Maximum Momentum: " + pRound(momentumMax, 5);
        if((momentumMax/inputStates.divisor > (canvas.width-40)) || (momentumMax/inputStates.divisor < (canvas.width/2.5))) {
            inputStates.divisor = momentumMax/(canvas.width-40);
        };
    }
    
}

function pRound(number, precision) {
    var factor = Math.pow(10, precision);
    var tempNumber = number * factor;
    var roundedTempNumber = Math.round(tempNumber);
    return roundedTempNumber / factor;
}