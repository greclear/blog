/**********************************************************************************************
 *
 *  @ param(array)       imagelist: The list of images to view
 *  @ param(bool)        disablePinch: Disable pinch function
 *  @ param(bool)        disableRotate: Disable rotate function
 *  @ param(bool)        disableDoubleTap: Disable double tap function
 *  @ param(function)    longTap: Events called after the long tap
 *  @ param(function)    close: the function to close the viewer
 *
 *
 **********************************************************************************************/
import React, { Component } from 'react'
import Finger from './Finger';
import Transform from './Transform';
import { CenterImage } from './ImageViewerComponent.js'
import Singleton from './react-singleton'

const MARGIN = 0

class ImageView extends Component {
    static defaultProps = {
        gap: MARGIN,
        current: 0,
        disablePageNum: false,
        desc: '',
        maxScale: 2
    }

    static propTypes = {
        gap: React.PropTypes.number,
        maxScale: React.PropTypes.number,
        current: React.PropTypes.number,
        imagelist: React.PropTypes.array.isRequired,
        disablePageNum: React.PropTypes.bool,
        disablePinch: React.PropTypes.bool,
        enableRotate: React.PropTypes.bool,
        disableDoubleTap: React.PropTypes.bool,
        longTap: React.PropTypes.func,
        close: React.PropTypes.func.isRequired,
        changeIndex: React.PropTypes.func,
        initCallback: React.PropTypes.func
    }

    constructor(props) {
        super();
        this.arrLength = props.imagelist.length;
        this.state = {
            current: props.current,
            translateX:0,

            scaleXArr: new Array(this.arrLength).fill(1),
            scaleYArr: new Array(this.arrLength).fill(1),
            initScaleArr: new Array(this.arrLength).fill(1),

            translateXArr: new Array(this.arrLength).fill(0),
            translateYArr: new Array(this.arrLength).fill(0),

            originXArr: new Array(this.arrLength).fill(0),
            originYArr: new Array(this.arrLength).fill(0)
        }
    }

    initScale = 1;
    screenWidth = window.innerWidth || window.screen.availWidth;
    screenHeight = window.innerHeight || window.screen.availHeight;
    list = null;
    ob = null;
    focused = null;

    componentDidMount() {
        const { current } = this.state,
            { imagelist, initCallback } = this.props;

        this.arrLength = imagelist.length;
        this.list = this.refs['imagelist'].parentNode;

        //Transform(this.list);

        current && this.changeIndex(current, false);

        this.bindStyle(current);

        initCallback && initCallback();
    }

    //单击图片关闭查看器
    onSingleTap(){
        this.props.close && this.props.close();
    }


    onPressMove(evt){

        const { current } = this.state;

        this.endAnimation();

        if( !this.focused ){
            if((current === 0 && evt.deltaX > 0) || (current === this.arrLength - 1 && evt.deltaX < 0)){
              this.setState({
                translateX: this.state.translateX + evt.deltaX / 3
              })
                //this.list.translateX += evt.deltaX / 3;
            }else{
              this.setState({
                translateX: this.state.translateX + evt.deltaX
              })
                //this.list.translateX += evt.deltaX;
            }
        }

        evt.preventDefault();
    }

    onSwipe(evt){
        const { direction } = evt;

        let { current } = this.state;
        if( this.focused ){
            return false;
        }
        switch(direction) {
            case 'Left':
                current < this.arrLength-1 && ++current && this.bindStyle(current);
                // current < this.arrLength-1 && ++current;
                break;
            case 'Right':
                current > 0 && current-- && this.bindStyle(current);
                // current > 0 && current--;
                break;
        }
        this.setState({
          current
        },() => this.changeIndex(current))

    }

    onPicPressMove(evt) {

        const { deltaX, deltaY } = evt,
            isLongPic = this.ob.getAttribute('long'),
            { scaleX, width } = this.ob;

        if(this.ob.scaleX <= 1 || evt.touches.length > 1){
            return;
        }

        if(this.ob && this.checkBoundary(deltaX, deltaY)){
            !isLongPic && (this.ob.translateX += deltaX);
            this.ob.translateY += deltaY;

            if(isLongPic && scaleX * width === this.screenWidth){
                this.focused = false;
            }else{
                this.focused = true;
            }
        }else {
            this.focused = false;
        }
    }

    onMultipointStart(){
        this.state.initScale = this.state.scaleX;
    }

    onPinch(evt){
        if( this.props.disablePinch || this.ob.getAttribute('long')){
            return false;
        }
        this.ob.style.webkitTransition = 'cubic-bezier(.25,.01,.25,1)'

        const { originX, originY } = this.ob,
            originX2 = evt.center.x - this.screenWidth/2 - document.body.scrollLeft,
            originY2 = evt.center.y - this.screenHeight/2 - document.body.scrollTop;

        this.ob.originX = originX2;
        this.ob.originY = originY2;
        this.ob.translateX = this.ob.translateX + (originX2 - originX) * this.ob.scaleX;
        this.ob.translateY = this.ob.translateY + (originY2 - originY) * this.ob.scaleY;

        this.setState({
          scaleX:  this.state.initScale * evt.scale,
          scaleY: this.state.scaleX,
        })


        // const { originX, originY } = this.ob,
        //     originX2 = evt.center.x - this.screenWidth/2 - document.body.scrollLeft,
        //     originY2 = evt.center.y - this.screenHeight/2 - document.body.scrollTop;
        //
        // this.ob.originX = originX2;
        // this.ob.originY = originY2;
        // this.ob.translateX = this.ob.translateX + (originX2 - originX) * this.ob.scaleX;
        // this.ob.translateY = this.ob.translateY + (originY2 - originY) * this.ob.scaleY;
        //
        // this.ob.scaleX = this.ob.scaleY = this.initScale * evt.scale;
    }

    onRotate(evt){
        if( !this.props.enableRotate || this.ob.getAttribute('rate') >= 3.5){
            return false;
        }

        this.ob.style.webkitTransition = 'cubic-bezier(.25,.01,.25,1)'

        this.ob.rotateZ += evt.angle;
    }

    onLongTap(){
        this.props.longTap && this.props.longTap();
    }

    onMultipointEnd(evt){
        // translate to normal
        this.changeIndex(this.state.current);

        if(!this.ob){
            return;
        }

        this.ob.style.webkitTransition = '300ms ease';

        const { maxScale } = this.props,
            isLongPic = this.ob.getAttribute('long');
        // scale to normal
        if (this.ob.scaleX < 1) {
            this.restore(false);
        }
        if (this.ob.scaleX > maxScale && !isLongPic){
            this.setScale(maxScale);
        }

        // rotate to normal
        let rotation = this.ob.rotateZ % 360,
            rate = this.ob.getAttribute('rate');

        if(rotation < 0){
            rotation = 360 + rotation;
        }
        this.ob.rotateZ = rotation;

        if (rotation > 0 && rotation < 45) {
            this.ob.rotateZ = 0;
        } else if (rotation >= 315) {
            this.ob.rotateZ = 360;
        } else if (rotation >= 45 && rotation < 135) {
            this.ob.rotateZ = 90;
            this.setScale(rate);
        } else if (rotation >= 135 && rotation < 225) {
            this.ob.rotateZ = 180;
        } else if (rotation >= 225 && rotation < 315) {
            this.ob.rotateZ = 270;
            this.setScale(rate);
        }
    }

    onDoubleTap(evt){
        if( this.props.disableDoubleTap ){
            return false;
        }

        const { origin } = evt,
            originX = origin[0] - this.screenWidth/2 - document.body.scrollLeft,
            originY = origin[1] - this.screenHeight/2 - document.body.scrollTop,
            isLongPic = this.ob.getAttribute('long');

        if(this.state.scaleXArr[this.state.current] === 1){
            var translateXArr = this.state.translateXArr;
            translateXArr[this.state.current] = originX;
            var translateYArr = this.state.translateYArr;
            translateYArr[this.state.current] = originY;
            var originXArr = this.state.originXArr;
            originXArr[this.state.current] = originX;
            var originYArr = this.state.originYArr;
            originYArr[this.state.current] = originY;

            !isLongPic && (this.setState({
              translateXArr,
              translateYArr,
              originXArr,
              originYArr
            }))
            this.setScale(isLongPic ? this.screenWidth / this.ob.width : this.props.maxScale);
        }else{
            var translateXArr = this.state.translateXArr;
            translateXArr[this.state.current] = this.state.originXArr[this.state.current];
            var translateYArr = this.state.translateYArr;
            translateYArr[this.state.current] = this.state.originYArr[this.state.current];

            this.setState({
              translateXArr,
              translateYArr
            })
            this.setScale(1);
        }

    }

    bindStyle(current) {
        this.setState({ current }, () => {
            this.ob && this.restore();
            this.ob = document.getElementById(`view${current}`).parentNode;
            // if(this.ob && !this.ob.scaleX){
            //     //Transform(this.ob)
            //     this.setState({
            //       translateX: -this.screenWidth * current
            //     })
            // }
            // ease hide page number
            const page = this.refs.page;
            if(page){
                page.classList.remove('hide');
                setTimeout(()=>{
                    page.classList.add('hide');
                }, 2000);
            }
        })
    }

    //查看器转到第current张图片
    changeIndex(current, ease=true) {
        ease && (this.list.style.webkitTransition = '300ms ease');
        this.setState({
          translateX : -current*(this.screenWidth + this.props.gap)
        })

        //调用changeIndex的回调函数
        this.props.changeIndex && this.props.changeIndex(current);
    }

    setScale(size) {
        this.ob.style.webkitTransition = '300ms ease-in-out';
        this.state.scaleXArr[this.state.current] = size;
        this.state.scaleYArr[this.state.current] = size;
        this.setState({
          scaleXArr: this.state.scaleXArr,
          scaleYArr: this.state.scaleYArr
        })
    }

    restore(rotate=true) {
        this.ob.translateX = this.ob.translateY = 0;
        !!rotate && (this.ob.rotateZ = 0);
        this.ob.scaleX = this.ob.scaleY = 1;
        this.ob.originX = this.ob.originY = 0;
    }

    //移除动画效果,但好像没效果，浏览器的是transition
    endAnimation() {
        this.list.style.webkitTransition = '0';
        this.ob && this.ob.style && (this.ob.style.webkitTransition = '0');
    }

    checkBoundary(deltaX = 0, deltaY = 0) {
        const { scaleX, translateX, translateY, originX, originY, width, height } = this.ob,
            rate = this.ob.getAttribute('rate');

        if(scaleX !== 1 || scaleX !== rate){
            // include long picture
            const rangeLeft = (scaleX - 1) * (width / 2 + originX) + originX,
                rangeRight = -(scaleX - 1) * (width / 2 - originX) + originX,
                rangeUp = (scaleX - 1) * (height / 2 + originY) + originY,
                rangeDown = -(scaleX - 1) * (height / 2 - originY) + originY;


            if(translateX + deltaX <= rangeLeft
                && translateX + deltaX >= rangeRight
                && translateY + deltaY <= rangeUp
                && translateY + deltaY >= rangeDown ) {
                return true;
            }
        }
        return false;
    }

    render() {
        const { desc, disablePageNum, children, gap } = this.props;

        return (
          <Finger
              onSingleTap={() => this.onSingleTap()}
              onPressMove={() => this.onPressMove()}
              onSwipe={() => onSwipe()}
              >
            <div className="imageview">

                    <Transform translateX={this.state.translateX}>
                      <ul ref="imagelist" className="imagelist">
                      {
                          this.props.imagelist.map((item, i) => {
                              return (
                                  <li className="imagelist-item" style={{ marginRight: gap + 'px'}} key={"img"+i}>
                                      <Finger
                                          onDoubleTap={() => this.onDoubleTap()}
                                          onPressMove={() => this.onPicPressMove()}
                                          >
                                          <Transform scaleX={this.state.scaleXArr[i]} scaleY={this.state.scaleYArr[i]} translateX = {this.state.translateXArr[i]} translateY = {this.state.translateYArr[i]} originX = {this.state.originXArr[i]} originY = {this.state.originYArr[i]}>
                                            <CenterImage id={`view${i}`} className="imagelist-item-img" lazysrc={item} index={i} current={this.state.current}/>
                                          </Transform>
                                    </Finger>
                                  </li>
                              )
                          })
                      }
                      </ul>
                    </Transform>

                {
                    disablePageNum ? null : <div className="page" ref="page">{ this.state.current + 1 } / { this.arrLength }</div>
                }
                {
                    desc ? <div dangerouslySetInnerHTML={{__html: desc}}></div> : null
                }
                { children }
            </div>
            </Finger>
        )
    }


}

export const SingleImgView = new Singleton(ImageView)

export default ImageView
