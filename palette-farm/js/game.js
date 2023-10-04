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
		this.squirm = 0;
		this.held = false;
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

		this.squirm += 1/999*dt;
		if (this.squirm > 1) this.squirm = 0;
	}
	move(dt) {
		if (this.x <= 0 || this.x >= WIDTH-this.w || this.y <= MAX_SIZE*2 || this.y >= HEIGHT) {
			this.vx = -this.vx;
			this.vy = -this.vy;
		}

		if (this.x < 0) this.x = 0;
		if (this.x > WIDTH-this.w) this.x = WIDTH-this.w;
		if (this.y < MAX_SIZE*2) this.y = MAX_SIZE*2;
		if (this.y > HEIGHT) this.y = HEIGHT;

		this.x += this.vx*dt;
		this.y += this.vy*dt;
	}
	drag(dt) {
		this.x = lerp(this.x, MOUSE.x-this.w/2, 1/50*dt);
		this.y = lerp(this.y, MOUSE.y, 1/50*dt);
	}
	render(ctx) {

		let sw = Math.abs(oscillate(this.progress)-1);
		let sh = oscillate(this.progress);
		let width = this.w - this.w/8 + sw*this.w/4;
		let height = this.h - this.w/8 + sh*this.w/4;

		ctx.save();

		ctx.translate(this.x, this.y);

		ctx.fillStyle = 'rgba(0,0,0,0.15)';
		ctx.fillRect(0, height/2, width, height/2);

		//jump!
		ctx.translate(this.w/2, this.w-oscillate(this.progress)*this.w*2);

		//wobble!
		if (this.held) {
			let rotation = (MOUSE.x - this.x)/50;
			ctx.rotate(((rotation*5) * Math.PI) / 180);
		}

		ctx.fillStyle = this.color;
		ctx.fillRect(-width/2, 0, width, height);

		/*ctx.fillStyle = '#fff';
		ctx.font = "25px Georgia";
		ctx.fillText(this.progress.toFixed(1), 0, 0);*/

		//ctx.fillStyle = 'red';
		//ctx.fillRect(-3, -3, 6, 6);

		ctx.restore();
	}
}