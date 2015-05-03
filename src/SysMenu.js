
var SysMenu = cc.Layer.extend( {
    ctor:function () {
        this._super();
        this.init();
    },
    init:function () {
    	winSize = cc.director.getWinSize();
    	var background = new cc.Sprite(res.background);
    	background.anchorX = 0;
        	background.anchorY = 0;
        	this.addChild(background, 0, 1);
    }
})