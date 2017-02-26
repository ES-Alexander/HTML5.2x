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

function circsOverlap(x0,y0,r0,x1,y1,r1) {
    if(Math.pow(x1-x0,2)+Math.pow(y1-y0,2) <= Math.pow(r0+r1,2)) {return true;}
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
                    // Central/initial Coordinates
                    var x0 = ballArray[i].x;
                    var x1 = ballArray[j].x;
                    var y0 = ballArray[i].y;
                    var y1 = ballArray[j].y;
                    var r0 = ballArray[i].radius;
                    var r1 = ballArray[j].radius;
                    // Normal coords
                    var nx = x1 - x0;
                    var ny = y1 - y0;
                    
                    var dist = Math.sqrt((nx)*(nx) + (ny)*(ny));
                    
                    if(dist <= r0+r1) {
                        // prevents ball intersection on collision
                        if(dist < r0+r1) {
                            ballArray[i].x = (x0+x1)/2 - r0*nx/dist;
                            ballArray[i].y = (y0+y1)/2 - r0*ny/dist;
                            ballArray[j].x = (x0+x1)/2 + r1*nx/dist;
                            ballArray[j].y = (y0+y1)/2 + r1*ny/dist;
                        }
                        
                        /*/
                        x0 = ballArray[i].x;
                        x1 = ballArray[j].x;
                        y0 = ballArray[i].y;
                        y1 = ballArray[j].y;
                        
                        // Normal coords
                        nx = x1 - x0;
                        ny = y1 - y0;
                        // */
                        
                        // mass in nice variables
                        var m0 = ballArray[i].mass;
                        var m1 = ballArray[j].mass;

                        var v0x = ballArray[i].vx;
                        var v0y = ballArray[i].vy;
                        var v1x = ballArray[j].vx;
                        var v1y = ballArray[j].vy;

                        // Unit vector
                        var nMag = Math.sqrt(nx*nx + ny*ny);
                        var nhx = nx/nMag;
                        var nhy = ny/nMag;

                        // Tangent unit vector
                        var thx = -nhy;
                        var thy = nhx;

                        // Component scalars
                        var v0t = thx*v0x + thy*v0y;
                        var v1t = thx*v1x + thy*v1y;         
                        var v0n = nhx*v0x + nhy*v0y;
                        var v1n = nhx*v1x + nhy*v1y;

                        var vp0t = v0t;
                        var vp1t = v1t;
                        var vp0n = (v0n*(m0-m1)+2*m1*v1n)/(m0+m1);
                        var vp1n = (v1n*(m1-m0)+2*m0*v0n)/(m0+m1);
                        
                        ballArray[i].vx = vp0t*thx + vp0n*nhx;
                        ballArray[i].vy = vp0t*thy + vp0n*nhy;
                        ballArray[j].vx = vp1t*thx + vp1n*nhx;
                        ballArray[j].vy = vp1t*thy + vp1n*nhy;
                    }
                }
            
                
                /*/
                if(!ballArray[j].dead) {
                    var x0 = ballArray[i].x, x1 = ballArray[j].x;
                    var y0 = ballArray[i].y, y1 = ballArray[j].y;
                    var r0 = ballArray[i].radius, r1 = ballArray[j].radius;
                    var dx = x1 - x0;
                    var dy = y1 - y0;

                    var dist = Math.sqrt(dx*dx + dy*dy);
                    if(dist < (r0 + r1)) {
                        // mass in nice variables
                        var m0 = ballArray[i].mass;
                        var m1 = ballArray[j].mass;
                        
                        // balls have contact so push back...
                        var normalX = dx / dist;
                        var normalY = dy / dist;
                        var middleX = (x0 + x1) / 2;
                        var middleY = (y0 + y1) / 2;

                        ballArray[i].x = middleX - normalX * r0;
                        ballArray[i].y = middleY - normalY * r0;
                        ballArray[j].x = middleX + normalX * r1;
                        ballArray[j].y = middleY + normalY * r1;
                        
                        var dVector = (ballArray[i].vx - ballArray[j].vx) * normalX;
                        dVector += (ballArray[i].vy - ballArray[j].vy) * normalY;
                        var dvx = dVector * normalX;
                        var dvy = dVector * normalY;

                        ballArray[i].vx -= dvx*2*m1/(m0+m1);
                        ballArray[i].vy -= dvy*2*m1/(m0+m1);
                        ballArray[j].vx += dvx*2*m0/(m0+m1);
                        ballArray[j].vy += dvy*2*m0/(m0+m1);
                    }
                } //*/
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