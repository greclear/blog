import React from 'react';

export default class Finger extends React.Component {
    constructor(props) {
        super(props);

        this.preV = { x: null, y: null };//上次两个手指位置的向量(x = x2 - x1, y = y2 - y1)
        this.pinchStartLen = null;//两个手指的距离
        this.scale = 1;//与上一次相比的缩放倍数
        this.isDoubleTap = false;//当前是否发生了双击事件
        this.delta = null;//最近两次触发touchstart事件的时间间隔
        this.last = null;//上次触发touchstart事件时的毫秒数
        this.now = null;//当前触发touchstart事件时的毫秒数
        this.end = null;
        this.multiTouch = false;
        this.tapTimeout = null;//保存了setTimeout的返回值，当最后不是tap事件时，用于清除tap的定时器
        this.longTapTimeout = null;//保存了setTimeout的返回值，当最后不是longTap事件时，用于清除longTap的定时器
        this.singleTapTimeout = null;// 与tap事件的区别是tap是立即执行的，singleTap是跟doubleTap一起的，会延迟一点时间再执行，以判断是哪个事件
        this.swipeTimeout=null;//保存了setTimeout的返回值，当最后不是swipe事件时，用于清除swipe的定时器
        //x1,y1是当前触发touchstart事件时，pageX和pageY的位置，x2，y2记录上一次手指的位置
        this.x1 = this.x2 = this.y1 = this.y2 = null;
        this.preTapPosition={x:null,y:null};//上一次touchstart事件触发时，pageX和pageY的位置
    }

    //向量v的长度(模|v|)
     getLen(v) {
        return Math.sqrt(v.x * v.x + v.y * v.y);
    }

    //向量v1,v2的数量积
     dot(v1, v2) {
        return v1.x * v2.x + v1.y * v2.y;
    }

    //利用数量积来求两个向量的夹角θ(弧度)，下面两个定义是等价的
    //几何定义：a·b = |a||b|·cosθ
    //代数定义：a·b = x1*x2 + y1*y2。其中向量a=(x1,y1）,向量b=(x2,y2)
     getAngle(v1, v2) {
        var mr = this.getLen(v1) * this.getLen(v2);
        if (mr === 0) return 0;
        var r = this.dot(v1, v2) / mr;
        if (r > 1) r = 1;
        return Math.acos(r);
    }

    //根据向量积(叉乘)的正负来判断顺逆时针,正->顺时针,负->逆时针
    //axb = x1*y2 - x2*y1。其中向量a=(x1,y1）,向量b=(x2,y2)
     cross(v1, v2) {
        return v1.x * v2.y - v2.x * v1.y;
    }

    //得到两个向量的夹角度数
     getRotateAngle(v1, v2) {
        var angle = this.getAngle(v1, v2);
        if (this.cross(v1, v2) > 0) {
            angle *= -1;
        }

        return angle * 180 / Math.PI;
    }

    //重设state
    _resetState() {
        this.setState({x: null, y: null, swiping: false, start: 0 });
    }

    //触发事件
    _emitEvent(name, ...arg) {
         if (this.props[name]) {
             this.props[name](...arg);
         }
     }

    _handleTouchStart (evt) {

       evt.persist();
       if(!evt.touches) return;

       evt.preventDefault();//是否应该在一开始就阻止浏览器默认事件呢

       this.now = Date.now();
       this.x1 = evt.touches[0].pageX;
       this.y1 = evt.touches[0].pageY;
       this.delta = this.now - (this.last || this.now);
       if(this.preTapPosition.x!==null){
           this.isDoubleTap = (this.delta > 0 && this.delta <= 250&&Math.abs(this.preTapPosition.x-this.x1)<30&&Math.abs(this.preTapPosition.y-this.y1)<30);
       }
       this.preTapPosition.x=this.x1;
       this.preTapPosition.y=this.y1;
       this.last = this.now;
       var preV = this.preV,
           len = evt.touches.length;
       if (len > 1) {
           this._cancelLongTap();
           this._cancelSingleTap();
           var v = { x: evt.touches[1].pageX - this.x1, y: evt.touches[1].pageY - this.y1 };
           preV.x = v.x;
           preV.y = v.y;
           this.pinchStartLen = this.getLen(preV);
           this._emitEvent('onMultipointStart', evt);
       }
       this.longTapTimeout = setTimeout(function(){
           this._emitEvent('onLongTap', evt);
       }.bind(this), 750);
    }

    _handleTouchMove(evt){
        evt.persist();

        var preV = this.preV,
                    len = evt.touches.length,
                    currentX = evt.touches[0].pageX,
                    currentY = evt.touches[0].pageY;
        this.isDoubleTap=false;//一旦手指移动，那就不是进行长按操作了
        if (len > 1) {
            var v = { x: evt.touches[1].pageX - currentX, y: evt.touches[1].pageY - currentY };

            if (preV.x !== null) {
                if (this.pinchStartLen > 0) {
                   evt.center = {
                        x: (evt.touches[1].pageX + currentX) / 2,
                        y: (evt.touches[1].pageY + currentY) / 2
                    };
                    evt.scale = this.getLen(v) / this.pinchStartLen;
                    this._emitEvent('onPinch', evt);
                }

                evt.angle = this.getRotateAngle(v, preV);
                this._emitEvent('onRotate', evt);
            }
            preV.x = v.x;
            preV.y = v.y;
            this.multiTouch = true;
        } else {
            if (this.x2 !== null) {
                evt.deltaX = currentX - this.x2;
                evt.deltaY = currentY - this.y2;
            }else{
                evt.deltaX = 0;
                evt.deltaY = 0;
            }
            this._emitEvent('onPressMove', evt);
        }
        this._cancelLongTap();//手指移动了，就没长按操作什么事了
        this.x2 = currentX;
        this.y2 = currentY;
        //当然要阻止浏览器的默认行为啦，比如在屏幕上双指移动，网页会缩小和放大的嘛
        if(len > 1) {
            evt.preventDefault();
        }
    }

    //别有疑问，clearInterval和clearTimeout效果都是一样的，没有什么区别
    _handleTouchCancel(){
        clearInterval(this.singleTapTimeout);
        clearInterval(this.tapTimeout);
        clearInterval(this.longTapTimeout);
        clearInterval(this.swipeTimeout);
    }

    _handleTouchEnd(evt){

      evt.persist();
      this.end = Date.now();
      this._cancelLongTap();

      if( evt.touches.length<2){
          this._emitEvent('onMultipointEnd', evt);
      }

      evt.origin = [this.x1, this.y1];
      if(this.multiTouch === false){
          if ((this.x2 && Math.abs(this.x1 - this.x2) > 30) ||
              (this.y2 && Math.abs(this.preV.y - this.y2) > 30)) {
              evt.direction = this._swipeDirection(this.x1, this.x2, this.y1, this.y2);
              evt.distance = Math.abs(this.x1 - this.x2);
              this.swipeTimeout = setTimeout(() => {
                  this._emitEvent('onSwipe', evt);
              }, 0)
          } else {
              this.tapTimeout = setTimeout(() => {
                  this._emitEvent('onTap', evt);
                  if (this.isDoubleTap) {
                      this._emitEvent('onDoubleTap', evt);
                      clearTimeout(this.singleTapTimeout);
                      this.isDoubleTap = false;
                  } else {
                      this.singleTapTimeout = setTimeout(()=>{
                          this._emitEvent('onSingleTap', evt);
                      }, 250);
                  }
              }, 0)
          }
      }

      this.preV.x = 0;
      this.preV.y = 0;
      this.scale = 1;
      this.pinchStartLen = null;
      this.x1 = this.x2 = this.y1 = this.y2 = null;
      this.multiTouch = false;
  }

    //取消绑定的长按事件
    _cancelLongTap () {
        clearTimeout(this.longTapTimeout);
    }

    _cancelSingleTap () {
        clearTimeout(this.singleTapTimeout);
    }
    //滑动方向
    _swipeDirection (x1, x2, y1, y2) {
        if(Math.abs(x1 - x2) > 80 || this.end-this.now < 250){
            return Math.abs(x1 - x2) >= Math.abs(y1 - y2) ? (x1 - x2 > 0 ? 'Left' : 'Right') : (y1 - y2 > 0 ? 'Up' : 'Down')
        }else {
            return 'Nochange'
        }

    }

    render() {
        return React.cloneElement(React.Children.only(this.props.children), {
            onTouchStart: this._handleTouchStart.bind(this),
            onTouchMove: this._handleTouchMove.bind(this),
            onTouchCancel: this._handleTouchCancel.bind(this),
            onTouchEnd: this._handleTouchEnd.bind(this)
        });
    }
}

//使用例子

// render() {
//     return (
//         <Finger
//             onTap={this.onTap.bind(this)}
//             onMultipointStart={this.onMultipointStart.bind(this)}
//             onLongTap={this.onLongTap.bind(this)}
//             onSwipe={this.onSwipe.bind(this)}
//             onPinch={this.onPinch.bind(this)}
//             onRotate={this.onRotate.bind(this)}
//             onPressMove={this.onPressMove.bind(this)}
//             onMultipointEnd={this.onMultipointEnd.bind(this)}
//             onSingleTap={this.onSingleTap.bind(this)}
//             onDoubleTap={this.onDoubleTap.bind(this)}>
//             <div className="test">the element that you want to bind event</div>
//         </Finger>
//     );
// }
