/**
 * canvas-流星
 * Created by ZhangfengYao on 2017/12/21.
 */
(function(window){
    var speedRange = 2000;//下降间隔距离
    var arrNum = [];//运动中的流星
    var CanvasMeteor = function(el, options){
        this.init(el, options);
    };

    CanvasMeteor.prototype = {
        options:{},
        context:null,
        obj:null,
        w:100,
        h:100,
        circles: [],
        init: function (el, options) {
            var _this = this;
            var i;

            this.options = this._options();
            // User defined options
            for (i in options) _this.options[i] = options[i];

            //canvas容器
            this.obj = window.document.getElementById(el);

            //canvas对象
            this.context = this.obj.getContext('2d');

            //设定画布的宽高
            this.w = this.context.width = _this.obj.width;
            this.h = this.context.height =_this.obj.height;
            //生成随机数
            this._createDot(this.options['dotCount']);

        },
        /**
         * 生成随机点
         * @private
         */
        _createDot:function(num){
            var circles = [];
            for (var i =0 ;i < num ; i++){
                circles.push({
                    x: this.w * Math.random(),
                    y: this.h/8 * Math.random(),
                    r: Math.random() * 2
                });
            }
            this.circles = circles;
            //return circles;
        },
        /**
         * 清除上一次画板
         * @private
         */
        _clear: function () {
            this.context.clearRect(0, 0, this.w, this.h);
        },
        _moveDot:function () {
            var dots = this.circles;
            var circles = [];
            var num = Math.ceil(Math.random()*dots.length);

            for (var i = 0; i < dots.length; i++) {
                speedRange++;
                var dot = dots[i];
                if(!this._inArray(num, arrNum) && arrNum.length <= this._options().moveCount){
                    if(speedRange >= this._options().speed * 1000){
                        arrNum.push(num);
                        speedRange = 0;
                    }
                    //console.log(arrNum[arrNum.length - 1]);
                }

                if(this._inArray(i, arrNum)){
                    dot.y = dot.y + 1;
                    dot.x = dot.x - 0.5;
                    if(dot.y > this.h || dot.x <= 0){
                        this._removeArrayValue(i);
                        dot.x = this.w * Math.random();
                        dot.y = this.h/8 * Math.random();
                    }
                }
                circles.push({
                    x: dot.x,
                    y: dot.y,
                    r: dot.r
                });
            }

            this.circles = circles;
            //console.log(arrNum);
        },
        /**
         * 判断数组中是否存在某个值
         * @param val
         * @param array
         * @returns {boolean}
         * @private
         */
        _inArray:function(val, array){

            for (var i in array){
                if(val === array[i]){
                    return true;
                }
            }
            return false;
        },
        /**
         * 移除数组中的值
         * @param val
         * @private
         */
        _removeArrayValue:function(val){
            for(var i=0; i<arrNum.length; i++) {
                if(arrNum[i] == val) {
                    arrNum.splice(i, 1);
                    break;
                }
            }
        },
        /**
         * 执行动画
         */
        process:function(){
            //this.context.strokeStyle = this._color(150);
            //this.context.strokeRect(20,20,150,100);
            //this.run();
            //this.context.rotate(20*Math.PI/180);
            this.context.transform(1,0,-0.5,1,0,0);
            this.interVal = setInterval(function () {
                this.run();
            }.bind(this), 20);
            //console.log(this._color(50));
        },
        run:function(){
            this._moveDot();
            var dotCircles = this.circles;
            this._clear();
            //圆点
            //this._draw(dotCircles);
            //线
            //this._drawLIne(dotCircles);

            for(var i=0;i<dotCircles.length; i++) {
                if(this._inArray(i, arrNum)){
                    this._drawLIne(dotCircles, i);
                }else{
                    this._draw(dotCircles, i);
                }
            }
            //console.log(dotCircles);
        },
        _options:function(){
            return {
                "dotCount":50,//随机点
                "moveCount":20,//运动中的点
                "speed":3//每一颗运动点间隔
            }
        },
        /**
         * 圆点
         * @private
         */
        _draw:function(dotCircles, i){
                this.context.beginPath();
                this.context.arc(dotCircles[i].x, dotCircles[i].y, dotCircles[i].r, 0, 2 * Math.PI);
                this.context.fillStyle = 'white';
                this.context.closePath();
                this.context.fill();
        },
        _drawLIne:function(dotCircles, i){
            this.context.restore();
            var lGradient = this.context.createLinearGradient(dotCircles[i].x, dotCircles[i].y, dotCircles[i].x + dotCircles[i].r, dotCircles[i].y+dotCircles[i].r + 10);
            lGradient.addColorStop(0, 'rgba(255,255,255,.1)');
            lGradient.addColorStop(0.3, 'rgba(255,255,255,.3)');
            lGradient.addColorStop(0.5, 'rgba(255,255,255,.5)');
            lGradient.addColorStop(0.8, 'rgba(255,255,255,.8)');
            lGradient.addColorStop(1, 'rgba(255,255,255,1)');
            this.context.beginPath();
            this.context.rect(dotCircles[i].x, dotCircles[i].y, dotCircles[i].r,dotCircles[i].r + 10);
            this.context.fillStyle = lGradient;
            this.context.closePath();
            this.context.fill();

        }

    };
    if (typeof exports !== 'undefined') exports.CanvasMeteor = CanvasMeteor;
    else window.CanvasMeteor = CanvasMeteor;
})(window);
