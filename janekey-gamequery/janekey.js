// Global constants:
var PLAYGROUND_WIDTH	= 720;
var PLAYGROUND_HEIGHT	= 300;
var PLAYER_WIDTH = 30;
var PLAYER_HEIGHT = 30;
var BULLET_WIDTH = 10
var BULLET_HEIGHT = 10;

var smallStarSpeed = 1 //pixels per frame
var startGame = false;
var gameOver = false;
var straightBulletSpeed = 3;
var cirBulletSpeed = 5;

var backgroundRefreshTime = 100;
var playDirRefreshTime = 10;// player direction refresh time
var bulletRefreshTime = 50;

var straightInitRefreshTime = 4000;//5s
var arcInitRefreshTime = 1000;
var circleInitRefreshTime = 1000;

// Global animation holder
var player;
var bullet;

var bulletList = new Array();

// the position of mouse
var point_x;
var point_y;

var level = 0;
var tipsMsg = new Array("", "练习一下!", "还不错!", "干得好!", "加油！");
var bulletCount = 0;    //已出现子弹数
var currentBulletCount = 0;     //当前屏幕子弹数量

var isStraightBullet = false;   //是否出现直线子弹
var isArcBullet = false;    //是否出现阿基米德子弹
var isCircleBullet = false;	//是否出现圆形子弹

var invincible = false;	//无敌
// --------------------------------------------------------------------------------------------------------------------
// --                                      the main declaration:                                                     --
// --------------------------------------------------------------------------------------------------------------------

//获取对象X坐标
function objX(obj, objWidth) {
	return $(obj).x() + objWidth/2;
}

//获取对象Y坐标
function objY(obj, objHeight) {
	return $(obj).y() + objHeight/2;
}

//设置对象X坐标
function setObjectX(obj, newX, objWidth) {
	$(obj).x(newX - objWidth/2);
}

//设置对象Y坐标
function setObjectY(obj, newY, objHeight) {
	$(obj).y(newY - objHeight/2);
}

//对象的直线运动
function objMove(obj, distanceX, distanceY, objWidth, objHeight, speed) {
	var oldX = objX(obj, objWidth);
	var oldY = objY(obj, objHeight);
	
	setObjectX(obj, oldX - speed, objWidth);
	setObjectY(obj, oldY - speed, objHeight);
	
	if(Math.abs(distanceX) >= Math.abs(distanceY)) {
		if(distanceX > 0) {		//向右移
			//setObjectX(obj, oldX + 1, objWidth);
			//setObjectY(obj, oldY + (distanceY / distanceX), objHeight);
			setObjectX(obj, oldX + speed, objWidth);
			setObjectY(obj, oldY + (distanceY / distanceX * speed), objHeight);
		} else if(distanceX < 0) {		//向左移
			//setObjectX(obj, oldX - 1, objWidth);
			//setObjectY(obj, oldY - (distanceY / distanceX), objHeight);
			setObjectX(obj, oldX - speed, objWidth);
			setObjectY(obj, oldY - (distanceY / distanceX * speed), objHeight);
		} else if(distanceX == 0) {		//上下移动
			if(distanceY > 0) {
				//setObjectY(obj, oldY + 1, objHeight);
				setObjectY(obj, oldY + speed, objHeight);
			} else if(distanceY < 0) {
				setObjectY(obj, oldY - speed, objHeight);
				//setObjectY(obj, oldY - 1, objHeight);
			}
		}
	} else {
		if(distanceY > 0) {		//向下移
			//setObjectY(obj, oldY + 1, objHeight);
			//setObjectX(obj, oldX + (distanceX / distanceY), objWidth);
			setObjectY(obj, oldY + speed, objHeight);
			setObjectX(obj, oldX + (distanceX / distanceY * speed), objWidth);
		} else if(distanceY < 0) {		//向上移动
			//setObjectY(obj, oldY - 1, objHeight);
			//setObjectX(obj, oldX - (distanceX / distanceY), objWidth);
			setObjectY(obj, oldY - speed, objHeight);
			setObjectX(obj, oldX - (distanceX / distanceY * speed), objWidth);
		} else if(distanceY == 0) {
			if(distanceX > 0) {
				//setObjectX(obj, oldX + 1, objWidth);
				setObjectX(obj, oldX + speed, objWidth);
			} else if(distanceX < 0) {
				//setObjectX(obj, oldX - 1, objWidth);
				setObjectX(obj, oldX - speed, objWidth);
			}
		}
	}
}

//玩家移动
var timeoutObj;
function playerMoveTo() {
	var playerObj = $("#player");
	
	var actorTmp = $('#actors').detach();
	
    var nowX = objX(playerObj, PLAYER_WIDTH);
    var nowY = objY(playerObj, PLAYER_HEIGHT);
	
	if (Math.abs(nowX - point_x) > 1 || Math.abs(nowY - point_y) > 1) {
		objMove(playerObj, point_x - nowX, point_y - nowY, PLAYER_WIDTH, PLAYER_HEIGHT, 1);
		
		if(timeoutObj != null){
    		clearTimeout(timeoutObj);
    		timeoutObj = null;
    	}
    	timeoutObj = setTimeout("playerMoveTo()", playDirRefreshTime);
	}
	
	$('#msglayer').before(actorTmp);
}

function pauseGame() {
	startGame = false;
	if(timeoutObj != null){
		clearTimeout(timeoutObj);
		timeoutObj = null;
	}
}

//查看等级
function trackLevel() {
	if(bulletCount > 600) {
		alert("好吧,要么你作弊,要么你不是人,你赢了!");
		isStraightBullet = false;
		isArcBullet = false;
		isCircleBullet = false;
	} else if(bulletCount > 300 && level < 4) {
		level = 4;
		tip(level);
		isStraightBullet = true;
		isArcBullet = true;
		isCircleBullet = true;
		straightBulletSpeed += 2;
	} else if(bulletCount > 250 && level < 3) {
		level = 3;
		tip(level);
		isStraightBullet = false;
		isArcBullet = true;
		isCircleBullet = false;
	} else if(bulletCount > 100 && level < 2) {
		level = 2;
		tip(level);
		isStraightBullet = false;
		isArcBullet = false;
		isCircleBullet = true;
	} else if(bulletCount > 50 && level < 1) {
		level = 1;
		tip(level);
		straightBulletSpeed += 2;
	}
}

function tip(level) {
	var tip;
	if(level < tipsMsg.length) {
		tip = tipsMsg[level];
	} else {
		tip = tipsMsg[tipsMsg.length - 1];
	}
	showTips(tip);
	setTimeout("hideTip()", 1000);
}

//初始化直线子弹
function initializeStraightBuller() {
    var p_x = objX($("#player"), PLAYER_WIDTH);
    var p_y = objY($("#player"), PLAYER_HEIGHT);
    for (var i = 0; i < 5; i++) {
        //上面的子弹
        bulletCount++;
        var x = 150 * i + Math.ceil(Math.random() * 10);
        var y = -(Math.ceil(Math.random() * 10));
        addBulletSprite("bullet_" + bulletCount, x, y, p_x - x + (10 - Math.random() * 40), p_y - y + (10 - Math.random() * 40), 1, straightBulletSpeed);

        //下面的子弹
        bulletCount++;
        x = 150 * i + Math.ceil(Math.random() * 10);
        y = PLAYGROUND_HEIGHT + Math.ceil(Math.random() * 10);
        addBulletSprite("bullet_" + bulletCount, x, y, p_x - x + (10 - Math.random() * 40), p_y - y + (10 - Math.random() * 40), 1, straightBulletSpeed);

        //左边的子弹
        bulletCount++;
        var x = -(Math.ceil(Math.random() * 10));
        var y = 60 * i + Math.ceil(Math.random() * 10);
        addBulletSprite("bullet_" + bulletCount, x, y, p_x - x + (10 - Math.random() * 40), p_y - y + (10 - Math.random() * 40), 1, straightBulletSpeed);

        //右边的子弹
        bulletCount++;
        x = PLAYGROUND_WIDTH + (Math.ceil(Math.random() * 10));
        y = 60 * i + Math.ceil(Math.random() * 10);
        addBulletSprite("bullet_" + bulletCount, x, y, p_x - x + (10 - Math.random() * 40), p_y - y + (10 - Math.random() * 40), 1, straightBulletSpeed);
    }
}

//添加子弹
function addBulletSprite(name, x, y, trackX, trackY, type, speed) {
    $("#bullets").addSprite(name, {animation: bullet, width: BULLET_WIDTH, height: BULLET_HEIGHT, posx: x, posy: y});
    $("#" + name).addClass("bullets");
    $("#" + name).attr("x", trackX);
    $("#" + name).attr("y", trackY);
    $("#" + name).attr("s", speed);
    $("#" + name).attr("type", type);
//    bulletList.push($("#" + name));
    
    bulletMove($("#" + name));
}

//初始化阿基米德螺旋子弹
var arcInitX = 200, arcInitY = PLAYGROUND_HEIGHT / 2;
function initializeArc() {
	bulletCount++;
	var name = "bullet_"+bulletCount;
	$("#bullets").addSprite(name, {animation: bullet, width: BULLET_WIDTH, height: BULLET_HEIGHT, posx: arcInitX, posy: arcInitY});
	$("#"+name).attr({radius:3,currentArc:5,type:2,x:arcInitX,y:arcInitY,side:1});
	bulletMove($("#" + name));
	
	bulletCount++;
	name = "bullet_"+bulletCount;
	$("#bullets").addSprite(name, {animation: bullet, width: BULLET_WIDTH, height: BULLET_HEIGHT, posx: PLAYGROUND_WIDTH - arcInitX, posy: arcInitY});
	$("#"+name).attr({radius:3,currentArc:5,type:2,x:PLAYGROUND_WIDTH - arcInitX,y:arcInitY,side:2});
	bulletMove($("#" + name));
	
//	arcInitX -= 20;
}

//初始化圆形子弹
var cirInitX = 350, cirInitY = 50;
function initializeCircle() {
	for (var i = 0; i <= 360; i += 20) {
		bulletCount++;
		var name = "bullet_"+bulletCount;
		addBulletSprite(name, cirInitX, cirInitY, Math.cos(i) * 100, Math.sin(i) * 100, 3, cirBulletSpeed);
	}
}

//显示提示信息
function showTips(msg) {
	$("#tips").html(msg);
	$("#tips").slideDown("slow");
}

//隐藏提示信息
function hideTip() {
	$("#tips").slideUp("slow");
}

//子弹移动
function bulletMove(bullet) {
	var posx = objX(bullet, BULLET_WIDTH);
    var posy = objY(bullet, BULLET_HEIGHT);

    var type  = bullet.attr("type");
    
    // 子弹超出边界
    var limitSize = 30;
    if(type == 2) {
    	limitSize = 80;
    }
    
    if(posx < -limitSize || posx > PLAYGROUND_WIDTH + limitSize
        || posy < -limitSize || posy > PLAYGROUND_HEIGHT + limitSize){
    	var bulletId = $(bullet).attr("id");
    	$(bullet).remove();    	
        return;
    }
    
    if(!invincible) {
	    var playerX = objX($("#player"), PLAYER_WIDTH);
	    var playerY = objY($("#player"), PLAYER_HEIGHT);
	    if(Math.abs(playerX - posx) < 10 && Math.abs(playerY - posy) < 10) {
	    	if(confirm("游戏失败，最终得分:" + bulletCount + "\n是否启用无敌模式?(取消则重新开始)")) {
	    		invincible = true;
	    	} else {
	    		location.reload();
	    	}
	    	
	    }
    }
    
    
    if(type == 1 || type == 3) {	//直线子弹或圆形子弹
        var distanceX = $(bullet).attr("x");
        var distanceY = $(bullet).attr("y");
        var s = $(bullet).attr("s");

        objMove(bullet, distanceX, distanceY, BULLET_WIDTH, BULLET_HEIGHT, new Number(s));
    } else if (type == 2) {	//阿基米德子弹
        var radius = new Number(bullet.attr("radius"));//半径
        var currentArc = new Number(bullet.attr("currentArc"));//角速度
        //currentArc = currentArc * radius / (radius - 0.5);
        //currentArc -= 0.01;
        
        var side = bullet.attr("side");
        var arc;
        if(side == 2) {
        	arc = (2 * Math.PI) / 360 * radius * currentArc;//角度
        } else if(side == 1) {
        	arc = (2 * Math.PI) / 360 * radius * -currentArc;//角度
        }
        var xx = new Number(bullet.attr("x"));
        var yy = new Number(bullet.attr("y"));
        
        var testnewx = Math.cos(arc) * (radius) + xx;
        var testnewy = Math.sin(arc) * (radius) + yy;
        
    	radius += 0.5;
        	
    	bullet.attr("radius",radius);
    	bullet.attr("currentArc",currentArc);

    	bullet.x(testnewx);
    	bullet.y(testnewy);

    }
    
    window.setTimeout(function(){bulletMove(bullet)}, bulletRefreshTime);
}

$(function(){
    // Aniomations declaration:
    // The background:
    var background1 = new $.gQ.Animation({imageURL: "background.png"});
    var background2 = new $.gQ.Animation({imageURL: "background.png"});

    player = new $.gQ.Animation({imageURL: "player.png"});
	bullet = new $.gQ.Animation({imageURL: "bullet.png"});
	
    // Initialize the game:
    $("#playground").playground({height: PLAYGROUND_HEIGHT, width: PLAYGROUND_WIDTH, keyTracker: true});

    // Initialize the background
    $.playground().addGroup("background", {width: PLAYGROUND_WIDTH, height: PLAYGROUND_HEIGHT})
                        .addSprite("background1", {animation: background1, width: PLAYGROUND_WIDTH, height: PLAYGROUND_HEIGHT})
                        .addSprite("background2", {animation: background2, width: PLAYGROUND_WIDTH, height: PLAYGROUND_HEIGHT, posx: PLAYGROUND_WIDTH})
                  .end()
                  .addGroup("bullets", {width: PLAYGROUND_WIDTH, height: PLAYGROUND_HEIGHT})
				  .end()
				  .addGroup("actors", {width: PLAYGROUND_WIDTH, height: PLAYGROUND_HEIGHT})
                        .addSprite("player", {animation: player, width: PLAYGROUND_WIDTH, height: PLAYGROUND_HEIGHT, posx: PLAYGROUND_WIDTH/2, posy: PLAYGROUND_HEIGHT/2})
				  .end()
				  .addGroup("msglayer", {width: PLAYGROUND_WIDTH, height: PLAYGROUND_HEIGHT})
						.addSprite("tips", {width: 160, height: 50, posx: PLAYGROUND_WIDTH/2 - 50, posy: PLAYGROUND_HEIGHT/2 - 25});

	// 产生直线子弹
	$.playground().registerCallback(function(){
		if(startGame && !gameOver && isStraightBullet) {
            initializeStraightBuller();
            trackLevel();
		}
	}, straightInitRefreshTime);

	// 产生阿基米德子弹
    $.playground().registerCallback(function(){
        if(startGame && !gameOver && isArcBullet) {
            initializeArc();
            trackLevel();
        }
    }, arcInitRefreshTime);
    
    // 产生圆形子弹
    $.playground().registerCallback(function(){
        if(startGame && !gameOver && isCircleBullet && 
        		cirInitX > -10 && cirInitX < PLAYGROUND_WIDTH + 10 && 
        		cirInitY > -10 && cirInitY < PLAYGROUND_HEIGHT + 10) {
        	initializeCircle();
            trackLevel();
        }
    }, circleInitRefreshTime);
    
	
	$("#tips").css({"color":"#FFF","font-size":"30px"});
	
    //This is for the background animation
    $.playground().registerCallback(function(){
    	if(startGame && !gameOver) {
	        //Offset all the pane:
	        var newPos = ($("#background1").x() - smallStarSpeed - PLAYGROUND_WIDTH) % (2 * PLAYGROUND_WIDTH) + PLAYGROUND_WIDTH;
	        $("#background1").x(newPos);
	
	        newPos = ($("#background2").x() - smallStarSpeed - PLAYGROUND_WIDTH) % (2 * PLAYGROUND_WIDTH) + PLAYGROUND_WIDTH;
	        $("#background2").x(newPos);
    	}

    }, backgroundRefreshTime);
    
	//player move
    var mouseTime = (new Date()).getTime();
    $("#playground").mousemove(function(e) {
    	startGame = true;
    	if(!gameOver) {
	    	var newTime = (new Date()).getTime();
	        if((newTime - mouseTime) > playDirRefreshTime) {
	        	mouseTime = newTime;
	        	
	        	point_x = e.pageX;
	        	point_y = e.pageY;
	        	
	            playerMoveTo();
	        }
    	}
    });
    
	//click the start button
    $("#startbutton").click(function(){
        $.playground().startGame(function(){
            $("#welcomeScreen").fadeTo(1000,0,function(){$(this).remove();});
            startGame = true;
            isStraightBullet = true;
        });
    });
	
//    $("#playground").mouseleave(function(){
//    	pauseGame();
//    });
	
	// this sets the id of the loading bar:
    $.loadCallback(function(percent){
        $("#loadingNum").html(percent);
    });


});


