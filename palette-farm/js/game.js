class Slime {
	constructor(w, h, x, y, color) {
		this.w = w;
		this.h = h;
		this.x = x;
		this.y = y;
		this.vx = 0;
		this.vy = 0;
		this.color = color;
		this.progress = 0;
	}
	startMoving() {
		this.progress = 1;
		let speed = randInt(10,25);
		this.vx = randNegOneOrOne()/speed;
		this.vy = randNegOneOrOne()/speed;
	}
	stopMoving() {
		this.vx = 0;
		this.vy = 0;
	}
	update(dt) {
		this.progress -= 1/500*dt;
		if (this.progress < 0) {
			this.progress = 0;
			this.stopMoving();
		}

		this.x += this.vx*dt;
		this.y += this.vy*dt;

		if (this.x < 0) this.x = 0;
		if (this.x > WIDTH) this.x = WIDTH;
		if (this.y < 0) this.y = 0;
		if (this.y > HEIGHT) this.y = HEIGHT;
	}
	render(ctx) {

		let sw = Math.abs(oscillate(this.progress)-1);
		let sh = oscillate(this.progress);
		let width = this.w + sw*SIZE/4;
		let height = this.h + sh*SIZE/4;

		ctx.save();

		ctx.translate(this.x, this.y);

		//jump!
		ctx.translate(0, SIZE-oscillate(this.progress)*SIZE*2);

		ctx.fillStyle = this.color;

		ctx.fillRect(-width/2, -height, width, height);

		/*ctx.fillStyle = '#fff';
		ctx.font = "25px Georgia";
		ctx.fillText(this.progress.toFixed(1), 0, 0);*/

		ctx.restore();
	}
}