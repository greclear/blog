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


// import React from 'react';
// import Crop from '../resource/example/componentsSrc/Crop';
//
// export default class CropComponent extends React.Component{
//   render(){
//     return (
//       <Crop
//         image_src = '/static/images/dog.jpeg'
//         circle = {false}
//         width = {200}
//         height = {200}
//         ok = { (base64,canvas) => console.log('ok')}
//         cancel = { () => console.log('cancel') }
//         ok_text = '确认'
//         cancel_text = '取消'
//         ></Crop>
//     )
//   }
// }






import React from 'react';
import { SingleImgView } from '../resource/example/componentsSrc/ImageViewer';

export default class ImageViewerComponent extends React.Component {
    constructor(){
        super();
    }

    render() {
        let imagelist = [
            'https://p.qpic.cn/qqconadmin/0/e4a67754b2d1485aa186a4d38dbf07e1/0',
            'https://gpic.qpic.cn/gbar_pic/2aqluyraXicEfqicaK3aV4iaib5icib78qF0eFxokIEKSewIg8hQW0kiavCQg/1000',
            'https://gpic.qpic.cn/gbar_pic/3MSgRdnPzZAQnkIModguuoU1PXSKZUup1B67V82b3KicfhjAVwh19BRFia4DgWfxgg/1000',
            'https://gpic.qpic.cn/gbar_pic/2aqluyraXicEfqicaK3aV4iazVolQTREmcvaEG92Hy9oibhyDJHNzu1s3w/1000',
            'https://gpic.qpic.cn/gbar_pic/emH5YQz0vOJ2E0L6ZljlcW9nFgQzMXtpN240iaeB7PFUhZSWvvpbtLA/1000',
            'https://gpic.qpic.cn/gbar_pic/hVlQlSGMCtYlKrqpM5xwdmJrbh4iaawOgY6lFT1eNWTib7qv2Z2QuJWXmchPUqBriay/1000',
            'https://gpic.qpic.cn/gbar_pic/lDVAjxOVicMnyU4OWLShicffM3TvZYFia4ywL0B5oC3BLPDCoIkgdkJLA/0',
            'https://gpic.qpic.cn/gbar_pic/2aqluyraXicEfqicaK3aV4ia3YQE3mKcibH02jibympJ4gzCUEjk2Iz5BwQ/1000',
            'https://gpic.qpic.cn/gbar_pic/rqlh3lfegUYAvWGGNA8wyC5kly2PwLzONQsSatcxicqJOw0gz9MGmZg/1000',
            'https://gpic.qpic.cn/gbar_pic/PR0vBBjLNC7PpwKQ5YmKjo9ricr8EqAZFQVzXJG96SKCr4hVoWiaT4OQ/0',
        ];

        return (
            <div>
                <h3 className="title">Click image to open the viewer.</h3>
                <ul className="gallery">
                { imagelist.map((item, i)=>{
                    return (<li key={i}><img className="pic" src={item} onClick={this.show.bind(this, imagelist, i)}/></li>)
                })}
                </ul>
            </div>
        )
    }

    show(imagelist, current){
        SingleImgView.show({
            imagelist,
            current,
            maxScale: 3,
            close: ()=>{SingleImgView.hide()},
            initCallback: ()=>{
                // 禁止右滑关闭webview
                // if(mqq){
                //     mqq.ui.setWebViewBehavior({
                //         swipeBack: 0
                //     });

                //     // 禁用系统的长按功能(如果没有配置长按事件则启用系统长按事件)
                //     if (mqq.compare('5.8') > -1) {
                //         mqq.invoke('ui', 'disableLongPress', {
                //             enable: true
                //         });
                //     } else if (mqq.compare('5.8') > -1) {
                //         mqq.invoke('ui', 'disableLongPress', {
                //             enable: false
                //         });
                //     }
                // }
            }
        })
    }
}
