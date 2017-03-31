import React from 'react';
import Finger from './Finger';
import Transform from './Transform';

export default class Crop extends React.Component{
  state = {
    pressMoveX:0,
    pressMoveY:0,

    scaleX:1,
    scaleY:1,
    initScale:1,

  }

  componentDidMount(){
    this.ctx = this.refs.canvas.getContext('2d');
    this.type = this.props.type || 'png';
    this.refs.cover.width = window.innerWidth;
    this.refs.cover.height = window.innerHeight;
    this.cover_ctx = this.refs.cover.getContext('2d');
    this.cancel = this.props.cancel;
    this.ok = this.props.ok;
    this.ok_text = this.props.ok_text;
    this.cancel_text = this.props.cancel_text;
  }

  init(){
    //使图片刚好适应屏幕的大小
    this.img_width = this.refs.img.width;
    this.img_height = this.refs.img.height;
    var scaling_x = window.innerWidth / this.img_width,
        scaling_y = window.innerHeight / this.img_height;
    var scaling = scaling_x > scaling_y ? scaling_y : scaling_x;
    this.setState({
      initScale: scaling,
      scaleX: scaling,
      scaleY: scaling,
    },() => {
      this.renderCover();
      this.setStyle();
    });
  }

  _cancel(){
    this._css('cropSrc',{display:'none'});
    this.cancel();
  }

  _ok(){
    this.crop();
    this._css('cropSrc',{display:'none'});
    this.ok(this.refs.canvas.toDataURL("image/" + this.type),this.refs.canvas);
  }

  renderCover(){
    var ctx = this.cover_ctx,
        w = this.refs.cover.width,
        h = this.refs.cover.height,
        cw = this.refs.canvas.width,
        ch = this.refs.canvas.height;
    ctx.save();
    ctx.fillStyle = 'blank';
    ctx.globalAlpha = 0.7;
    ctx.fillRect(0,0,this.refs.cover.width,this.refs.cover.height);
    ctx.restore();
    ctx.save();
    ctx.globalCompositeOperation = 'destination-out';
    ctx.beginPath();
    if (this.props.circle) {
        ctx.arc(w / 2, h / 2, cw / 2 - 4, 0, Math.PI * 2, false);
    } else {
        ctx.rect(w / 2 - cw / 2, h / 2 - ch / 2, cw, ch)
    }
    ctx.fill();
    ctx.restore();
    ctx.save();
    ctx.beginPath();
    ctx.strokeStyle = "white";
    if (this.props.circle) {
        ctx.arc(w / 2, h / 2, cw / 2 - 4, 0, Math.PI * 2, false);
    } else {
        ctx.rect(w / 2 - cw / 2, h / 2 - ch / 2, cw, ch)
    }
    ctx.stroke();
  }

  setStyle(){
    this._css('cropCover',{
      pointerEvents:'none',
      position: 'absolute',
      zIndex: '100',
      left: '0px',
      top: '0px',
    });

    this._css('cropSrc',{
      color: "white",
      textAlign: "center",
      fontSize: "18px",
      textDecoration: "none",
      visibility: "visible"
    })

    this._css('cropImg', {
        position: "absolute",
        zIndex: "99",
        left: "50%",
        // error position in meizu when set the top  50%
        top: window.innerHeight / 2 + "px",
        marginLeft: this.img_width / -2 + "px",
        marginTop: this.img_height / -2 + "px"
    });

    this._css('cropOk', {
        position: "fixed",
        zIndex: "101",
        width: "100px",
        right: "50px",
        lineHeight: "40px",
        height: "40px",
        bottom: "20px",
        borderRadius: "2px",
        backgroundColor: "#836FFF"

    });

    this._css('cropCancel', {
        position: "fixed",
        zIndex: "101",
        width: "100px",
        height: "40px",
        lineHeight: "40px",
        left: "50px",
        bottom: "20px",
        borderRadius: "2px",
        backgroundColor: "#836FFF"

    });
  }

  crop(){
      this.calculateRect();
      this.ctx.drawImage(this.refs.img, this.crop_rect[0], this.crop_rect[1], this.crop_rect[2], this.crop_rect[3], 0, 0, this.refs.canvas.width, this.refs.canvas.height);
      document.getElementById('cropResult').style.display = 'block';
  }

  calculateRect() {
      var cr = this.refs.img.getBoundingClientRect();
      var c_left = window.innerWidth / 2 - this.refs.canvas.width / 2;
      var c_top = window.innerHeight / 2 - this.refs.canvas.height / 2;
      var cover_rect = [c_left, c_top, this.refs.canvas.width + c_left, this.refs.canvas.height + c_top];
      var img_rect = [cr.left, cr.top, cr.width + cr.left, cr.height + cr.top];
      var intersect_rect = this.getOverlap.apply(this, cover_rect.concat(img_rect));
      var left = (intersect_rect[0] - img_rect[0]) / this.state.scaleX;
      var top = (intersect_rect[1] - img_rect[1]) / this.state.scaleY;
      var width = intersect_rect[2] / this.state.scaleX;
      var height = intersect_rect[3] / this.state.scaleY;
      if (left < 0) left = 0;
      if (top < 0) top = 0;
      if (left + width > this.img_width) width = this.img_width - left;
      if (top + height > this.img_height) height = this.img_height - top;

      this.crop_rect = [left, top, width, height];
  }

  // top left (x1,y1) and bottom right (x2,y2) coordination
  getOverlap(ax1, ay1, ax2, ay2, bx1, by1, bx2, by2) {
      if (ax2 < bx1 || ay2 < by1 || ax1 > bx2 || ay1 > by2) return [0, 0, 0, 0];

      var left = Math.max(ax1, bx1);
      var top = Math.max(ay1, by1);
      var right = Math.min(ax2, bx2);
      var bottom = Math.min(ay2, by2);
      return [left, top, right - left, bottom - top]
  }

  _css(id, obj) {
      for (var key in obj) {
          if (obj.hasOwnProperty(key)) {
              document.getElementById(id).style[key] = obj[key];
          }
      }
  }

  onPressMove(evt){
    this.setState({
      pressMoveX:this.state.pressMoveX + evt.deltaX,
      pressMoveY:this.state.pressMoveY + evt.deltaY,
    });
  }

  onPinch(evt){
    this.setState({
      scaleX:  this.state.initScale * evt.scale,
      scaleY: this.state.scaleX,
    })
  }

  onMultipointStart(){
    this.state.initScale = this.state.scaleX;
  }

  render(){
    var props = this.props;
    //设置为圆形的宽高要一样
    if(props.width !== props.height && props.circle){
      throw "cant't set circle to true when width is not equal to height";
    }
    return (
      <div>
        <div id='cropResult'  style={{display:'none'}}>
          <img src={props.image_src} style={{display:'none'}} />
          <div id='crop_result'>
            <canvas id='cropCanvas' ref='canvas' width={props.width} height={props.height} style={{borderRadius: props.circle ? '50%' : '0%'}}></canvas>
          </div>
          <a id="crop_btn" style={{display: 'inline-block'}}>Crop Rect</a>
          <a id="crop_circle_btn" style={{display: 'inline-block'}}>Crop Circle</a>
        </div>

        <div id='cropSrc'>
          <Finger  onPinch={ (evt) => this.onPinch(evt)} onMultipointStart={ () => this.onMultipointStart()} onPressMove={ (evt) => this.onPressMove(evt)}>
              <Transform scaleX={this.state.scaleX} scaleY={this.state.scaleY} translateX={this.state.pressMoveX} translateY={this.state.pressMoveY} id='cropImg'>
                  {/*resolve base64 uri bug in safari:"cross-origin image load denied by cross-origin resource sharing policy."*/}
                  <img  ref='img' onLoad={() => this.init()} src={props.image_src} crossOrigin={props.image_src.substring(0,4).toLowerCase() === 'http' ? 'anonymous' : ''} />
            </Transform>
          </Finger>
          <canvas id='cropCover' ref='cover' ></canvas>
          <Finger onTap={ () => this._cancel()}>
            <a id='cropCancel'>{props.cancel_text}</a>
          </Finger>
          <Finger onTap={ () => this._ok()}>
            <a id='cropOk'>{props.ok_text}</a>
          </Finger>
      </div>

      </div>
    )
  }
}
