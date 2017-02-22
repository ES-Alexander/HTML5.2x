// We can add the other collision functions seen in the
// course here...

// Collisions between rectangle and circle
function circRectsOverlap(x0, y0, w0, h0, cx, cy, r) {
    var testX = cx;
    var testY = cy;

    if (testX < x0)
        testX = x0;
    if (testX > (x0 + w0))
        testX = (x0 + w0);
    if (testY < y0)
        testY = y0;
    if (testY > (y0 + h0))
        testY = (y0 + h0);

    return (((cx - testX) * (cx - testX) + (cy - testY) * (cy - testY)) < r * r);
}


function testCollisionWithWalls(ball, w, h) {
    // left
    if (ball.x < ball.radius) {
        ball.x = ball.radius;
        ball.vx *= -1;
    }
    // right
    if (ball.x > w - (ball.radius)) {
        ball.x = w - (ball.radius);
        ball.vx *= -1;
    }
    // up
    if (ball.y < ball.radius) {
        ball.y = ball.radius;
        ball.vy *= -1;
    }
    // down
    if (ball.y > h - (ball.radius)) {
        ball.y = h - (ball.radius);
        ball.vy *= -1;
    }
}

function ballCollisions(ballArray) {
    for(var i=0; i<ballArray.length; i++)  {
        if(!ballArray[i].dead) {
            for(var j=i+1; j<ballArray.length; j++) {
                if(!ballArray[j].dead) {
                    var x0 = ballArray[i].x, x1 = ballArray[j].x;
                    var y0 = ballArray[i].y, y1 = ballArray[j].y;
                    var r0 = ballArray[i].radius, r1 = ballArray[j].radius;
                    var dx = x1 - x0;
                    var dy = y1 - y0;

                    var dist = Math.sqrt(dx*dx + dy*dy);
                    if(dist < (r0 + r1)) {
                        var m0 = (4/3)*Math.PI*(r0*r0*r0);
                        var m1 = (4/3)*Math.PI*(r1*r1*r1);
                        // balls have contact so push back...
                        var normalX = dx / dist;
                        var normalY = dy / dist;
                        var middleX = (x0 + x1) / 2;
                        var middleY = (y0 + y1) / 2;

                        ballArray[i].x = middleX - normalX * r0;
                        ballArray[i].y = middleY - normalY * r0;
                        ballArray[j].x = middleX + normalX * r1;
                        ballArray[j].y = middleY + normalY * r1;
                        
                        /*var totX = m0*Math.pow(ballArray[i].vx,2) + m1*Math.pow(ballArray[j].vx,2);
                        var totY = m0*Math.pow(ballArray[i].vy,2) + m1*Math.pow(ballArray[j].vy,2);
                        var newTotX = m0*Math.pow((ballArray[i].vx*(m0-m1)+2*m1*ballArray[j].vx)/(m0+m1),2) + 
                            m1*Math.pow((ballArray[j].vx*(m1-m0)+2*m0*ballArray[i].vx)/(m0+m1),2);
                        var newTotY = m0*Math.pow((ballArray[i].vy*(m0-m1)+2*m1*ballArray[j].vy)/(m0+m1),2) +
                            m1*Math.pow((ballArray[j].vy*(m1-m0)+2*m0*ballArray[i].vy)/(m0+m1),2);
                        var xRatio = newTotX/totX;
                        var yRatio = newTotY/totY;
                        
                        ballArray[i].vx = (ballArray[i].vx*(m0-m1)+2*m1*ballArray[j].vx)/((m0+m1)*xRatio);
                        ballArray[i].vy = (ballArray[i].vy*(m0-m1)+2*m1*ballArray[j].vy)/((m0+m1)*yRatio);
                        ballArray[j].vx = (ballArray[j].vx*(m1-m0)+2*m0*ballArray[i].vx)/((m0+m1)*xRatio);
                        ballArray[j].vy = (ballArray[j].vy*(m1-m0)+2*m0*ballArray[i].vy)/((m0+m1)*yRatio);*/
                    }
                }
            }
        }
    }
}
    
    
function testMonsterWallCollisions(monster, w, h) {
    // left
    if (monster.x < 0) {
        monster.x = 0;
    }
    // right
    if (monster.x > w - (monster.width)) {
        monster.x = w - (monster.width);
    }
    // up
    if (monster.y < 0) {
        monster.y = 0;
    }
    // down
    if (monster.y > h - (monster.height)) {
        monster.y = h - (monster.height);
    }
}