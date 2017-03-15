let m = function(elem) {
  return  new m.prototype.init(elem);
}
// dom 方法
m.prototype = {
  init(elem) {
    this.elem = elem;
    return this;
  },
  //绑定事件，并处理兼容性
  on(type, eventHandle) {
    let elem = this.elem;
    if ( elem.addEventListener ) {
      elem.addEventListener( type, eventHandle, false );

    } else if ( elem.attachEvent ) {
      elem.attachEvent( "on" + type, eventHandle );
    }
  },
  //取消绑定事件，并处理兼容性
  off(type, eventHandle) {
    let elem = this.elem;
    if ( elem.removeEventListener ) {
      elem.removeEventListener( type, eventHandle, false );

    } else if ( elem.detachEvent ) {
      elem.detachEvent( "on" + type, eventHandle );
    }
  }
};

//为了可以去调用init外面的方法，比如on，off方法，而做的处理。
//因为是在init方法里面 new 的，所以this只是指向init而已，并没有指向 m
//做了以下赋值之后，当在init方法中找不到时，就回去 m 的原型去找
m.prototype.init.prototype = m.prototype;

//动态加载script到页面
//除了这种方法，还可以利用ajax方式，把script文件代码从后台加载到前台，然后对加载到的内容通过eval()执行代码。
m.createScript = function(url, callback) {
  var
    head = document.getElementsByTagName('head')[0],
    script = document.createElement('script');

  script.type = 'text/javascript';
  //标准是onload，ie使用onreadystatechange,绑定监听函数，判断js是否加载完成
  script.onload = script.onreadystatechange = function() {
    //因为浏览器对于代表加载情况的状态有些会被跳过，所以做多点判断
    if (!this.readyState || this.readyState === "loaded" || this.readyState === "complete") {
      //确定加载完成后，调用callback
      callback();
      // Handle memory leak in IE
      script.onload = script.onreadystatechange = null;
    }
  };

  //src 属性一定要写到 onload 的后面，否则程序在 IE 中会出错,图片加载情况也是一样
  //因为script标签的src可以跨域访问资源,所以这种方法可以模拟ajax，解决ajax跨域访问的问题
  script.src = url;

  head.appendChild(script);
};

//动态添加link
m.createStyle = function(url) {
  var
    head = document.getElementsByTagName('head')[0],
    link = document.createElement('link');

  link.type = 'text/css';
  link.rel = "stylesheet";
  link.href = url;

  head.appendChild(link);
};

//动态添加img，暂时还不需要用到
m.createImg = function(url){
  var
    id = document.getElementById('test'),
    img = new Image();//或者 img = document.createElement('img');

    img.onload = img.onreadystatechange = function(){
      console.log('img is loaded');
    }

    //ie8及以下好像不支持error事件
    img.onerror = function(){
      console.log('error');
    }

    img.src = url;
    id.appendChild(img);
}

export default m;
