// constructor function for balls
    function Ball(x, y, vx, vy, diameter, ballSet) {
        this.x = x;
        this.y = y;
        this.vx = vx;
        this.vy = vy;
        this.radius = diameter / 2;
        this.color = 'rgba(0,0,0,0.5)';
        this.dead = false;
        this.set = ballSet;
        this.mass = (4/3) * Math.PI * Math.pow(this.radius/10, 3);

        this.draw = function (ctx) {
            ctx.save();
            ctx.beginPath();
            ctx.fillStyle = this.color;
            ctx.strokeStyle = '#666';
            ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
            ctx.fill();
            ctx.stroke();
            ctx.restore(); 
            this.color = 'rgba(0,0,0,0.5)';
        };

        this.move = function () {
            // add horizontal increment to the x pos
            // add vertical increment to the y pos

            var incX = this.vx;
            var incY = this.vy;

            this.x += calcDistanceToMove(delta, incX);
            this.y += calcDistanceToMove(delta, incY);
        };
    }
