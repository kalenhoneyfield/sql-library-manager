/**
 * For more information and to review the README: https://github.com/kalenhoneyfield/bubbles.git
 */

class Bubble {
  constructor(size, blur, color, elem) {
    this._size = size;
    this._blur = blur;
    this._color = color;
    this._elem = document.querySelector(elem);
    this.range = 0;
    this.height = null;
    this.width = null;
    this.bubble = null;
  }

  createBubble() {
    this.randomID();
    this.randomStart();
    this.bubble = document.createElement('div');
    this.bubble.style.position = 'absolute';
    this.bubble.style.borderRadius = `50%`;
    this.bubble.style.height = `${this._size}px`;
    this.bubble.style.width = `${this._size}px`;
    this.bubble.style.filter = `blur(${this._blur}px)`;
    this.bubble.style.transition = '4s ease';
    this.bubble.style.backgroundBlendMode = 'screen';
    this.bubble.style.background =
      'radial-gradient(circle at center,  rgba(255,255,255,0.5) 0%,rgba(255,255,255,0) 70%);';
    this.bubble.style.boxShadow = `0 20px 30px rgba(0, 0, 0, 0.2), inset 0px 10px 30px 5px ${this._color}`;
    this.bubble.style.opacity = 0;
    this.bubble.style.zIndex = -1;
    this.bubble.style.transform = `translate(${this.startPOS}px, ${this.height}px)`;
    this.bubble.id = this.ID;

    this._elem.style.overflow = 'hidden';
    this._elem.append(this.bubble);
  }

  moveBubble() {
    setInterval(() => {
      const distance = Math.floor(Math.random() * 1000);
      let coords = this.bubble.getBoundingClientRect();
      if (coords.top <= -200) {
        this.range = 0;
        this.bubble.style.transition = '0s';
        this.bubble.style.opacity = 0;
        this.randomStart();
        this.bubble.style.transform = `translate(${this.startPOS}px, ${this.height}px)`;
      } else {
        this.bubble.style.transition = '4s ease-in-out';
        this.bubble.style.opacity = 1;
        this.range = this.range - distance;
        this.bubble.style.transform = `translate(${this.startPOS}px, ${
          this.height + this.range
        }px)`;
      }
    }, Math.floor(Math.random() * (4000 - 1000 + 1)) + 1000 + 1);
  }

  randomID() {
    let text = '';
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (var i = 0; i < 8; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    this.ID = text;
  }

  randomStart() {
    this.getDimensions();
    this.startPOS = Math.floor(Math.random() * this.width);
  }

  getRandomColor() {
    const epoc = '1/1/1970';
    let color = new Date(
      new Date(epoc).getTime() + Math.random() * (new Date().getTime() - new Date(epoc).getTime())
    );
    color = Math.abs(Math.floor(color.getTime() / 1000)); //get the number of seconds its been since the Epoch
    let bgColor = color.toString(16); //lets play with converting a number to a string, what could possible go wrong ¯\_(ツ)_/¯
    bgColor = '#' + bgColor.slice(-6);
    this._color = bgColor;
  }

  getDimensions() {
    const dims = this._elem.getBoundingClientRect();
    this.height = dims.height;
    this.width = dims.width;
  }
}

function makeBubbles(size, color) {
  const defaultColor = color || '#fff';
  const preSize = size || 100;
  const number = 100;
  let bubbly = [];
  for (let i = 0; i < number; i++) {
    const size = Math.floor(Math.random() * preSize);
    const bub = new Bubble(size, 0, defaultColor, 'body');
    bubbly.push(bub);
  }

  bubbly.forEach((blubble, idx) => {
    // if(idx%2 === 0){
    //     blubble.getRandomColor()
    // }
    // blubble.getRandomColor();
    blubble.createBubble();
    blubble.moveBubble();
  });
}
