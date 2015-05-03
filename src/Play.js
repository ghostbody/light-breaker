var PlayLayer = cc.Layer.extend({

	background : null,
	player : null,
	bulbs : null,
	bonus : null,
	bullet : null,
	explosionAction : null,
	bulletLimit: null,
	score:null,
	scoreText:null,
	bulletText:null,
	life:null,
	lifeText:null,
	speed:null,

	ctor:function (space) {
		this._super();
		this.init();
	},

	init:function () {
		// initialize array variables
		this.bulbs = [];
		this.bullet = [];
		this.bonus = [];
		this.speed = 1;

		winSize = cc.director.getWinSize();
		var origin = cc.director.getVisibleOrigin();
		var centerpos = cc.p(winSize.width / 2, winSize.height / 2);

		//initial background
		this.background = new cc.Sprite(res.background);
		this.background.setPosition(centerpos);
		this.addChild(this.background);

		// player
		this.player = new cc.Sprite(res.player);
		this.player.setPosition(cc.p(winSize.width/2 - this.background.getContentSize().width/2 + this.player.getContentSize().width/2+10,40));
		this.addChild(this.player);

		// bulls
		this.schedule(this.addBulbs, 0.7);
		this.schedule(this.addBonus, 4);
		this.schedule(this.updateGame);

		// shoot
		this.bullets = [];
		if ('mouse' in cc.sys.capabilities)
			cc.eventManager.addListener({
				event: cc.EventListener.MOUSE,
				onMouseDown: function(event) {
					if(event.getButton() == cc.EventMouse.BUTTON_LEFT) {
						this.bulletLimit--;
						event.getCurrentTarget().Spwan(event);
						return true;
					}
					return false;
				}
			}, this);

		// shoot limit initialize
		this.bulletLimit = 20;

		// score initialize
		this.score = 0;

		// life
		this.life = 10;

		return true;
	},

	// core function of this game
	updateGame:function() {
		var bulbs2Delete = [];
		var bonus2Delete = [];

		var i ;
		for( i in this.bulbs ) {
			var bulb = this.bulbs[i];
			var bulbRect = bulb.getBoundingBox();

			var bullets2Delete = [];
			for(i in this.bullet) {
				var bullet = this.bullet[i];
				var bulletRect = bullet.getBoundingBox();

				var distance = cc.pDistance(bullet.getPosition(), bulb.getPosition());  
				var radiusSum = sprite.radius + this.catchHand.radius;
				
				cc.log("distance:" + distance + "; radius:" + radiusSum);  
				if(distance < radiusSum){  
				    //发生碰撞  
				}  
	  
				// unsicentific 
				if(cc.rectIntersectsRect(bulletRect,bulbRect)){
					bullets2Delete.push(bullet);
				}
			}

			if(bullets2Delete.length > 0) {
				bulbs2Delete.push(bulb);
			}
		bullets2Delete = null;
		}

		for( i in this.bonus) {
			var bonus = this.bonus[i];
			var bonusRect = bonus.getBoundingBox();

			var bullets2Delete = [];
			for(i in this.bullet) {
				var bullet = this.bullet[i];
				var bulletRect = bullet.getBoundingBox();
				if(cc.rectIntersectsRect(bulletRect,bonusRect)){
					bullets2Delete.push(bullet);
				}
			}

			if(bullets2Delete.length > 0) {
				bonus2Delete.push(bonus);
			}
		bullets2Delete = null;
		}

		for( i in bulbs2Delete) {
			this.score += 100;
			this.speed += 0.005;
			var bulb = bulbs2Delete[i];
			var index = this.bulbs.indexOf(bulb);
			if (index > -1) {
				this.bulbs.splice(index, 1);
			}
			this.removeChild(bulb);
		}
		bulbs2Delete = null;

		for( i in bonus2Delete) {
			this.score += 100;
			this.speed += 0.007;
			this.bulletLimit += 10;
			if (this.bulletLimit > 20)
				this.bulletLimit = 10;

			var bonus = bonus2Delete[i];
			var index = this.bonus.indexOf(bonus);
			if (index > -1) {
				this.bonus.splice(index, 1);
			}
			this.removeChild(bonus);
		}
		bonus2Delete = null;

		this.removeChild(this.bulletText);
		// bullet
		this.bulletText = new cc.LabelTTF("Bullets : " + this.bulletLimit/2, "Arial", 21);
		this.bulletText.attr({
			x: winSize.width/2 - 180,
			y: winSize.height - this.bulletText.getContentSize().height,
			anchorX: 0.5,
			anchorY: 0.5
		});
		this.addChild(this.bulletText);

		// score
		this.removeChild(this.scoreText);
		this.scoreText = new cc.LabelTTF("Score : " + this.score, "Arial", 21);
		this.scoreText.attr({
			x: winSize.width/2 - 50,
			y: winSize.height - this.scoreText.getContentSize().height,
			anchorX: 0.5,
			anchorY: 0.5
		});
		this.addChild(this.scoreText);

		// life
		this.removeChild(this.lifeText);
		this.lifeText = new cc.LabelTTF("life : " + this.life, "Arial", 21);
		this.lifeText.attr({
			x: winSize.width/2 + 50,
			y: winSize.height - this.lifeText.getContentSize().height,
			anchorX: 0.5,
			anchorY: 0.5
		});
		this.addChild(this.lifeText);

	},

	addBulbs: function() {
		var cc_bgSize = this.background.getContentSize();
		var winSize = cc.director.getWinSize();
		var bulb = cc.Sprite.create(res.bulb);
		bulb.setTag(1);

		// fix positon
		var fix_x = winSize.width/2+cc_bgSize.width/2 - bulb.getContentSize().width/3

		var minY = this.player.getContentSize().height;
		var maxY = winSize.height/2 + bulb.getContentSize().height;
		var rangeY = maxY - minY;
		var actualY = Math.random() * rangeY + minY;

		var fix_y = winSize.height*3/5;
		bulb.setPosition(cc.p(fix_x, actualY));

		// move druration
		var minDuration = 2.5;
		var maxDuration = 4;
		var rangeDuration = maxDuration - minDuration;
		var actualDuration = (Math.random() * rangeDuration + minDuration) * (1 / this.speed);

		var actionMove = cc.MoveTo.create(actualDuration ,cc.p(0 - bulb.getContentSize().width, actualY));
		var actionMoveDone = cc.CallFunc.create(this.spriteMoveFinished,this);

		bulb.runAction(cc.Sequence.create(actionMove,actionMoveDone));

		this.addChild(bulb,1);
		this.bulbs.push(bulb);
	},

	addBonus: function() {
		console.log("bonus");
		var cc_bgSize = this.background.getContentSize();
		var winSize = cc.director.getWinSize();
		var bonus = cc.Sprite.create(res.bonus);
		bonus.setTag(2);

		// fix positon
		var fix_x = winSize.width/2+cc_bgSize.width/2 - bonus.getContentSize().width/3

		var minY = this.player.getContentSize().height;
		var maxY = winSize.height/2 + bonus.getContentSize().height;
		var rangeY = maxY - minY;
		var actualY = Math.random() * rangeY + minY;

		var fix_y = winSize.height*3/5;
		bonus.setPosition(cc.p(fix_x, actualY));

		// move druration
		var minDuration = 2.5;
		var maxDuration = 4;
		var rangeDuration = maxDuration - minDuration;
		var actualDuration = (Math.random() * rangeDuration + minDuration) * (1 / this.speed);

		var actionMove = cc.MoveTo.create(actualDuration ,cc.p(0 - bonus.getContentSize().width, actualY));
		var actionMoveDone = cc.CallFunc.create(this.spriteMoveFinished,this);

		bonus.runAction(cc.Sequence.create(actionMove,actionMoveDone));

		this.addChild(bonus,1);
		this.bonus.push(bonus);
	},

	Spwan:function (event) {
		if (this.bulletLimit <= 0)
			return false;
		
		this.bulletLimit--;

		var winSize = cc.director.getWinSize();
		var origin = cc.director.getVisibleOrigin();
		var bulletDuration = 1.1;

		var bullet = cc.Sprite.create(res.bullet);
		bullet.setRotation(38);
		bullet.setPosition(cc.p(this.player.getPosition().x+25, this.player.getPosition().y+35));

		var actionMove = cc.MoveTo.create(bulletDuration,
			cc.p(this.player.getPosition().x * 7, winSize.height + bullet.getContentSize().height/2));

		var actionMoveDone = cc.CallFunc.create(this.spriteMoveFinished,this);

		bullet.runAction(cc.Sequence.create(actionMove,actionMoveDone));

		bullet.setTag(6);

		this.bullet.push(bullet);
		this.addChild(bullet,0);
	},

	spriteMoveFinished:function(sprite) {
		this.removeChild(sprite, true);
		if(sprite.getTag()==6){
			var index = this.bullets.indexOf(sprite);
			if (index > -1) {
				this.bullet.splice(index, 1);
			}
		} else if (sprite.getTag()==1){
			var index = this.bulbs.indexOf(sprite);
			this.life -- ;
			if(index < -1){
				this.bulbs.splice(index,1);
			}
		}
	}

});

var PlayScene = cc.Scene.extend({
	onEnter:function() {
		this._super();
		var layer = new PlayLayer();
		this.addChild(layer);
		layer.init();
	}
});
