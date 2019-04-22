const defaultOptions = {
  container: null,  // 容器
  duration: 2000, // 持续时间
  speed: 1000, // 动画速度
  easing: 'ease', // 动画效果
  vertical: true,

  // 待实现
  horizontal: false,
  autoPlay: true,
  height: 'auto',
};

class MessageSlider {
  constructor(options) {
    this._options = { ...defaultOptions, ...options };

    this.init();
  }

  init () {
    const { container } = this._options;
    this._container = null;
    this.children = null;
    this.container = null;

    if (typeof container !== 'string') {
      console.error('Invalid argument: "container" !');
      return;
    }
    else if (!document.querySelector(`${container}>div`)) {
      console.warn('Please check the pattern of the container!');
      return;
    }
    else {
      this.container = document.querySelector(container);
      this._container = document.querySelector(`${container}>div`);
      const childCounts = this._container.childElementCount;
      this._childCounts = childCounts;

      if ( childCounts === 0) {
        // 容器下没有子元素
        console.warn('No child elements!');
        return;
      }
      if (childCounts === 1) {
        console.warn('Only one child in the container.');
        return;
      }

      // let children = this._container.children;
      /*
      // Children may contain false or null, so we should filter them
      // children may also contain string filled with spaces (in certain cases where we use jsx strings)
      children = children.filter(child => {
        if (typeof child === 'string') {
          return !!child.trim();
        }
        return !!child;
      });
      */
      this._addClass2Header(this._options);
      this.container.classList.add('message-slider');
      this._container.classList.add('message-slider-slick');
      this._clonedContainer = this._cloneElement(this._container);
      this._clonedContainer.id = '';
      this._clonedContainer.classList.add('message-slider-slick-cloned');
      this._container.after(this._clonedContainer);
      this.play()
    }
  }

  play() {
    const { height } = this._options;
    let childHeight;

    if (height == 'auto') {
      // 获取子元素的高度
      childHeight = parseInt( getComputedStyle(this._container.children[0]).height ); // "000px"
    }
    else {
      childHeight = typeof height === 'number' ? height : parseInt(height);
    }
    this._childHeight = childHeight;
    this.currentIndex = 0;

    // 循环
    // setTimeout(this._translate.bind(this), duration, childCounts, childHeight);
    this.start()
  }

  start() {
    this.currentIndex = 0;
    // 克隆元素在准备位置
    this._clonedContainer.style.top = `${this._childHeight}px`;

    //this.intervalTimer = this._intervalTimer();
  }

  stop() {
    clearInterval(this.intervalTimer);
  }

  _intervalTimer() {
    return setInterval(() => {
      this._translate(this._childCounts, this._childHeight)
    }, this._options.duration);
  }

  _translate (childCounts, childHeight) {
    if (this.currentIndex < childCounts - 1) {
      this._container.style.transition = '';
      this._clonedContainer.style.transition = '';

      let next = this.currentIndex + 1;
      const y = childHeight * next;
      this._container.style.transform = `translate3d(0, ${-y}px, 0)`;
      this.currentIndex = next;
    }
    else {
      // it's time to switch

      // 继续切换
      let y = (this.currentIndex + 1) * childHeight;
      this._clonedContainer.style.transform = `translate3d(0, -${childHeight}px, 0)`;
      this._container.style.transform = `translate3d(0, ${-y}px, 0)`;

      //恢复初始位置
      setTimeout(() => {
        this._container.style.transition = 'none 0s linear 0s';
        this._container.style.transform = `translate3d(0, 0, 0)`;
        this._clonedContainer.style.transition = 'none 0s linear 0s';
        this._clonedContainer.style.transform = `translate3d(0, ${childHeight}px, 0)`;
        this.currentIndex = 0;
      }, this._options.speed);
      // this._clonedContainer.style.zIndex = '99';
    
      // 下次是第一次
      this.currentIndex = -1;
    }
  }

  _cloneElement (node) {
    return node.cloneNode(true);
  }

  _addClass2Header (options) {
    let head = document.head || document.getElementsByTagName('head')[0];
    let styleNode = document.createElement('style');
    styleNode.innerHTML = `
      .message-slider {
        position: relative;
        overflow: hidden;
      }
      .message-slider-slick {
        transition: all ${options.speed}ms ${options.easing};
      }
      .message-slider-slick-cloned {
        position: absolute;
      }
    `;

    head.appendChild(styleNode);
  }
}