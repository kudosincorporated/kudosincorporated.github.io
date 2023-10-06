class Slime {
	constructor(w, h, x, y, color) {
		this.w = w;
		this.h = h;
		this.x = x;
		this.y = y;
		this.renderW = w;
		this.renderH = h;
		this.renderX = x;
		this.renderY = y;
		this.vx = 0;
		this.vy = 0;
		this.facingRight = false;
		this.color = color;
		this.progress = 0;
		this.squirm = 0;
		this.hover = false;
		this.held = false;
	}
	startMoving() {
		this.progress = 1;
		let speed = randInt(10,25);
		this.vx = randNegOneOrOne()/speed;
		this.vy = randNegOneOrOne()/speed;
		if (this.vx > 0) {
			this.facingRight = true;
		} else {
			this.facingRight = false;
		}
	}
	stopMoving() {
		this.vx = 0;
		this.vy = 0;
	}
	update(dt) {
		let sw = Math.abs(oscillate(this.progress)-1);
		let sh = oscillate(this.progress);
		this.renderW = this.w - this.w/8 + sw*this.w/4;
		this.renderH = this.h - this.w/8 + sh*this.w/4;
		this.renderX = this.x + this.w/2;
		this.renderY = this.y + this.h-oscillate(this.progress)*this.h*2;

		this.progress -= 1/500*dt;
		if (this.progress < 0) {
			this.progress = 0;
			this.stopMoving();
		}

		this.squirm += 1/999*dt;
		if (this.squirm > 1) this.squirm = 0;
	}
	rotate(dt, rotationAngleDegrees) {
		const rotationAngleRadians = (rotationAngleDegrees*dt * Math.PI) / 180;

		const canvasCenterX = WIDTH / 2;
		const canvasCenterY = HEIGHT / 2;

		const relativeX = this.x - canvasCenterX;
		const relativeY = this.y - canvasCenterY;

		this.x = relativeX * Math.cos(rotationAngleRadians) - relativeY * Math.sin(rotationAngleRadians) + canvasCenterX;
		this.y = relativeX * Math.sin(rotationAngleRadians) + relativeY * Math.cos(rotationAngleRadians) + canvasCenterY;
	}
	cameraMove(dt, x, y) {
		this.x -= x*dt;
		this.y -= y*dt;
	}
	move(dt) {
		/*if (this.x <= 0 || this.x >= WIDTH-this.w || this.y <= 0 || this.y >= HEIGHT) {
			this.vx = -this.vx;
			this.vy = -this.vy;
		}

		if (this.x < 0) this.x = 0;
		if (this.x > WIDTH-this.w) this.x = WIDTH-this.w;
		if (this.y < 0) this.y = 0;
		if (this.y > HEIGHT) this.y = HEIGHT;*/

		this.x += this.vx*dt;
		this.y += this.vy*dt;
	}
	drag(dt) {
		this.x = lerp(this.x, MOUSE.x-this.w/2, 1/50*dt);
		this.y = lerp(this.y, MOUSE.y-this.h/4, 1/50*dt);
	}
	render(ctx, ttx) {
		//Draw on temporary canvas

		ttx.save();

		let slimesheetDisplacement = 0;
		if (this.progress > 0 && this.progress <= 1) slimesheetDisplacement += RATIO;

		ttx.clearRect(0, 0, temp.width, temp.height);

		ttx.drawImage(
			slimesheet,
			0,
			slimesheetDisplacement,
			RATIO,
			RATIO,
			0,
			0,
			temp.width,
			temp.height
		);

		ttx.globalCompositeOperation = 'hue';

		ttx.fillStyle = this.color;

		ttx.fillRect(0, 0, temp.width, temp.height);

		ttx.globalCompositeOperation = 'destination-in';

		ttx.drawImage(
			slimesheet,
			0,
			slimesheetDisplacement,
			RATIO,
			RATIO,
			0,
			0,
			temp.width,
			temp.height
		);

		ttx.restore();

		//End temporary canvas

		ctx.save();

		ctx.translate(this.renderX, this.renderY);

		//Looking left/right
		if (this.facingRight) {
			ctx.scale(-1,1);
		}

		//Wobble!
		if (this.held) {
			let rotation = (MOUSE.x - this.x-this.w/2)/50;
			ctx.rotate(((rotation*5) * Math.PI) / 180);
		}

		ctx.drawImage(
			temp,
			0,
			0,
			temp.width,
			temp.height,
			-this.renderW/2,
			0,
			this.renderW,
			this.renderH
		);

		/*ctx.lineWidth = 5;
		ctx.strokeStyle = '#fff';
		if (this.hover || this.held) ctx.strokeRect(-this.renderW/2, 0, this.renderW, this.renderH);*/

		/*ctx.fillStyle = '#fff';
		ctx.font = "25px Georgia";
		ctx.fillText(this.progress.toFixed(1), 0, 0);*/

		//ctx.fillStyle = 'red';
		//ctx.fillRect(-3, -3, 6, 6);

		ctx.restore();
	}
	renderShadow(ctx) {
		let sw = Math.abs(oscillate(this.progress)-1);
		let sh = oscillate(this.progress);
		let width = this.w - this.w/8 + sw*this.w/4;
		let height = this.h - this.w/8 + sh*this.w/4;
		
		ctx.fillStyle = 'rgba(0,0,0,0.15)';
		ctx.beginPath();
		ctx.ellipse(this.renderX, this.y+this.renderH/1.3, this.renderW/2.5, this.renderH/5, 0, 0, 2 * Math.PI);
		ctx.fill();
	}
}