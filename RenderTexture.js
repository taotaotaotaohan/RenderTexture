var HelloWorldLayer = cc.Layer.extend({
    sprite:null,
    pEraser:null,
    pRTex:null,
    particle_array:[],
    ctor:function () {
        this._super();
        //场景配置，读取配置信息121212
        var config_info=json_parse(config);
        var size = cc.winSize;
        //场景配置，背景
        this.sprite = new cc.Sprite(res.bg);
        this.sprite.attr({
            x: size.width / config_info.background_position[0],
            y: size.height / config_info.background_position[1],
        });
        this.sprite.scale=config_info.background_scale;
        this.addChild(this.sprite, 0);
        //场景配置，橡皮擦的外形　,测试提交 github桌面版
        this.shape=new cc.Sprite(res.eraser);
        this.shape.scale=config_info.images[1].scale;
        this.shape.x=size.width/config_info.images[1].location[0];
        this.shape.y=size.height/config_info.images[1].location[1];
        this.addChild(this.shape);
        //橡皮擦画笔设置
        this.pEraser = new cc.DrawNode();
        this.pEraser.drawDot(cc.p(0,0), 35, cc.color(0, 0, 0, 0));
        this.pEraser.retain();
        //场景配置，画布
        this.pRTex = new cc.RenderTexture(size.width,size.height);
        this.pRTex.setPosition(size.width/2, size.height/2);
        this.addChild(this.pRTex);
        //场景配置，dirty pic
        this.pBg =new cc.Sprite(res.dirty);
        this.pBg.x=size.width/config_info.images[0].location[0];
        this.pBg.y=size.height/config_info.images[0].location[1];
        this.pBg.scale=config_info.images[0].scale;
        this.pRTex.begin();
        this.pBg.visit();
        this.pRTex.end();
        self=this;
        self.particle_count=0;//粒子数目
        //增加事件监听器
        //设置哨兵，判断是否擦除完毕
        self.count=0;//达到哨兵的数目
        cc.eventManager.addListener({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            onTouchBegan:function(touch, event){
                var target = event.getCurrentTarget();
                var location=touch.getLocation();
                cc.log(location);
                self.base_location=location;//新基点坐标，用于判断是否新建粒子
                if(cc.rectContainsPoint(self.shape.getBoundingBox(), location)) {
                    self.shape.setPosition(location.x,location.y);
                }
                self.tag=0;


                return true;
            },
            onTouchMoved:function (touch, event) {
                var target = event.getCurrentTarget();
                var location = touch.getLocation();
                if (cc.rectContainsPoint(self.shape.getBoundingBox(), location)) {
                    self.shape.setPosition(location.x, location.y);
                    self.pEraser.setPosition(touch.getLocation());
                    self.eraseByBlend();
                    //超过一定范围，新建粒子，达到跟踪效果，避免每个像素新建粒子
                    var dis = location.x - self.base_location.x;
                    if (dis > 50 || dis < -50) {
                            self.particle_array[self.particle_count] = new cc.ParticleSystem(res.particle_file);
                            self.particle_array[self.particle_count].setPosition(location.x, location.y);
                            self.addChild(self.particle_array[self.particle_count]);
                            self.particle_array[self.particle_count].duration = 5;
                            self.particle_count++;
                            self.base_location = location;
                    }
                    self.count=self.guard_judge(location,self.count);
                    cc.log(self.count);
                    if(self.count==4 && self.tag<1){//判断擦除完毕
                        cc.log("ok");
                        self.pRTex.setVisible(false);
                        cc.audioEngine.playEffect(res.great, false);
                        self.tag++;
                        self.removeAllChildren();
                        guard=self.guard_clear(guard);
                        cc.director.pushScene(new StartScene());
                    }
                }
            },
            onTouchEnded:function(touch,event){
                return true;
            }
        }, this);
        return true;
    },
    //擦除函数test
    eraseByBlend :function() {
        var blendfunc  = {src: cc.ONE, dst: cc.ZERO};
        this.pEraser.setBlendFunc(blendfunc);
        this.pRTex.begin();
        this.pEraser.visit();
        this.pRTex.end();
    },
    //判断是否达到目标点
    guard_judge:function(location,count){
        for(var i=0;i<guard.length;i++){
            if((location.x-guard[i].location[0]<30 && location.x-guard[i].location[0]>-30)&&(guard[i].tag!=1)){
                if((location.y-guard[i].location[1]<30 && location.y-guard[i].location[1]>-30)&&(guard[i].tag!=1)) {
                    guard[i].tag = 1;
                    count++;
                }
            }
        }
        return count;
    },
    //清除哨兵影响
    guard_clear:function(guard){
        for(var i=0;i<guard.length;i++){
            guard[i].tag=0;
        }
        return guard;
    }
});

var StartScene = cc.Scene.extend({
    onEnter:function () {
        this._super();
        var layer = new HelloWorldLayer();
        this.addChild(layer);

    }
});
