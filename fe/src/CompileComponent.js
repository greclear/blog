// import React from 'react';
// import FingerComponent from '../resource/example/componentsSrc/Finger';
// import Transform from '../resource/example/componentsSrc/Transform';
//
// export default class Finger extends React.Component{
//
//   state = {
//     tap: false,
//     longTap:false,
//     doubleTap:1,
//
//     pressMoveX:0,
//     pressMoveY:0,
//
//     scaleX:1,
//     scaleY:1,
//     initScale:1,
//
//     rotateZ:0,
//
//     swipe:0,
//     currentIndex:0,
//
//   }
//
//   onTap(){
//     this.setState({
//       tap : !this.state.tap
//     });
//   }
//
//   onLongTap(){
//     this.setState({
//       longTap: !this.state.longTap
//     })
//   }
//
//   onDoubleTap(){
//     this.setState({
//       doubleTap: this.state.doubleTap == 1 ? 2 : 1
//     })
//   }
//
//   onPressMove(evt){
//     this.setState({
//       pressMoveX:this.state.pressMoveX + evt.deltaX,
//       pressMoveY:this.state.pressMoveY + evt.deltaY,
//     });
//   }
//
//   onPinch(evt){
//     this.setState({
//       scaleX:  this.state.initScale * evt.scale,
//       scaleY: this.state.scaleX,
//     })
//   }
//
//   onMultipointStart(){
//     this.state.initScale = this.state.scaleX;
//   }
//
//   onRotate(evt){
//     this.setState({
//       rotateZ:  this.state.rotateZ + evt.angle,
//     })
//   }
//
//   onSwipe(evt){
//     if(evt.direction === 'Left'){
//       if(this.state.currentIndex < 2){
//         this.state.currentIndex++;
//         this.setState({
//           swipe: -160 * this.state.currentIndex
//         })
//       }
//     }else if (evt.direction === 'Right') {
//       if(this.state.currentIndex > 0){
//         this.state.currentIndex--;
//         this.setState({
//           swipe: -160 * this.state.currentIndex
//         })
//       }
//     }
//   }
//
//   render() {
//       return (
//         <div>
//
//           <FingerComponent  onTap={ () => this.onTap()}>
//               <div  className='tap'>
//                 <img src='/static/images/WeChat.jpg' />
//                 <div className="overlay"  style={{display: this.state.tap ? 'block':'none'}}>
//                     <img src="/static/images/yes.png" />
//                 </div>
//               </div>
//           </FingerComponent>
//           <div className='titleTip'>tap</div>
//
//           <FingerComponent  onLongTap={ () => this.onLongTap()}>
//               <div  className='tap'>
//                 <img src='/static/images/WeChat.jpg' />
//                 <div className="overlay"  style={{display: this.state.longTap ? 'block':'none'}}>
//                     <img src="/static/images/yes.png" />
//                 </div>
//               </div>
//           </FingerComponent>
//           <div className='titleTip'>longTap</div>
//
//           <FingerComponent  onDoubleTap={ () => this.onDoubleTap()}>
//               <Transform scaleX={this.state.doubleTap} scaleY={this.state.doubleTap} className='tap' style={{transition:'.5s'}}>
//                 <div><img src='/static/images/WeChat.jpg' /></div>
//               </Transform>
//           </FingerComponent>
//           <div className='titleTip'>doubleTap</div>
//
//           <FingerComponent  onPressMove={ (evt) => this.onPressMove(evt)}>
//               <Transform translateX={this.state.pressMoveX} translateY={this.state.pressMoveY} className='tap'>
//                 <div><img src='/static/images/WeChat.jpg' /></div>
//               </Transform>
//           </FingerComponent>
//           <div className='titleTip'>pressMove</div>
//
//           <FingerComponent  onPinch={ (evt) => this.onPinch(evt)} onMultipointStart={ () => this.onMultipointStart()}>
//               <Transform scaleX={this.state.scaleX} scaleY={this.state.scaleY} className='tap'>
//                 <div><img src='/static/images/WeChat.jpg' /></div>
//               </Transform>
//           </FingerComponent>
//           <div className='titleTip'>pinch</div>
//
//           <FingerComponent  onRotate={ (evt) => this.onRotate(evt)} >
//               <Transform rotateZ={this.state.rotateZ} className='tap'>
//                 <div><img src='/static/images/WeChat.jpg' /></div>
//               </Transform>
//           </FingerComponent>
//           <div className='titleTip'>rotate</div>
//
//           <FingerComponent  onRotate={ (evt) => this.onRotate(evt)} onMultipointStart={ () => this.onMultipointStart()} onPinch={ (evt) => this.onPinch(evt)}>
//               <Transform scaleX={this.state.scaleX} scaleY={this.state.scaleY} rotateZ={this.state.rotateZ} className='tap'>
//                 <div><img src='/static/images/WeChat.jpg' /></div>
//               </Transform>
//           </FingerComponent>
//           <div className='titleTip'>pinchRotate</div>
//
//           <FingerComponent  onSwipe={ (evt) => this.onSwipe(evt)} >
//             <div className='swipeBox'>
//               <Transform translateX={this.state.swipe} className='scroll' style={{transition:'.5s ease'}}>
//                 <img src='/static/images/WeChat.jpg' />
//                 <img src='/static/images/WeChat.jpg' />
//                 <img src='/static/images/WeChat.jpg' />
//               </Transform>
//               <div className="nuclear-nav">
//                   <a className={ this.state.currentIndex === 0 ? 'active' : ''}></a>
//                   <a className={ this.state.currentIndex === 1 ? 'active' : ''}></a>
//                   <a className={ this.state.currentIndex === 2 ? 'active' : ''}></a>
//               </div>
//             </div>
//           </FingerComponent>
//           <div className='titleTip'>swipe</div>
//         </div>
//       );
//   }
//
// }


import React from 'react';
import Crop from '../resource/example/componentsSrc/Crop';

export default class CropComponent extends React.Component{
  render(){
    return (
      <Crop
        image_src = '/static/images/dog.jpeg'
        circle = {false}
        width = {200}
        height = {200}
        ok = { (base64,canvas) => console.log('ok')}
        cancel = { () => console.log('cancel') }
        ok_text = '确认'
        cancel_text = '取消'
        ></Crop>
    )
  }
}
