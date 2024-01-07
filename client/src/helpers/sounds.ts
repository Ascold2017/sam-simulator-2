import start from '@/assets/sounds/start.ogg'
import idle from '@/assets/sounds/idle.ogg'
import stop from '@/assets/sounds/stop.mp3'
import turnOn from '@/assets/sounds/turnOn.mp3';
import turnOff from '@/assets/sounds/turnOff.mp3';
import turnStart from '@/assets/sounds/turnStart.mp3';
import turnIdle from '@/assets/sounds/turnIdle.ogg';
import startMissile from '@/assets/sounds/startMissile.mp3';
const idleSound = new Audio(idle);
const startSound = new Audio(start);
const stopSound = new Audio(stop);
const turnOnSound = new Audio(turnOn);
const turnOffSound = new Audio(turnOff);
const turnStartSound = new Audio(turnStart);
const turnIdleSound = new Audio(turnIdle);
const startMissileSound = new Audio(startMissile);
  
let isTurning = false;
export default class Sounds {
  static isEnabled = true;
  static onEndedStartSound() {
    idleSound.addEventListener("timeupdate", function () {
      var buffer = 0.1;
      if (this.currentTime > this.duration - buffer) {
        this.currentTime = buffer;
        this.play();
      }
    });
    idleSound.volume = 0.7;
    idleSound.playbackRate = 0.7;
    idleSound.play();
  }

  static onEndedStartTunringSound() {
    turnIdleSound.addEventListener("timeupdate", function () {
      var buffer = 0.1;
      if (this.currentTime > this.duration - buffer) {
        this.currentTime = buffer;
        this.play();
      }
    });
    turnIdleSound.play();
  }

  static startEngine() {
    if (!Sounds.isEnabled) return
    turnOnSound.volume = 0.5;
    turnOnSound.play();
    stopSound.pause();
    stopSound.currentTime = 0;
    startSound.play();
    startSound.addEventListener("ended", Sounds.onEndedStartSound);
  }

  static turnStart() {
    if (!Sounds.isEnabled) return
    if (isTurning) return;
    isTurning = true;
    turnStartSound.play();
    turnStartSound.addEventListener("ended", Sounds.onEndedStartTunringSound);
  }
  static turnStop() {
    if (!Sounds.isEnabled) return
    if (!isTurning) return;
    isTurning = false;
    turnStartSound.pause();
    turnIdleSound.pause();
    turnStartSound.currentTime = 0;
    turnIdleSound.currentTime = 0;
    turnIdleSound.removeEventListener("ended", Sounds.onEndedStartSound);
  }

  static stopEngine() {
    if (!Sounds.isEnabled) return
    turnOffSound.play();
    startSound.pause();
    idleSound.pause();
    startSound.currentTime = 0;
    idleSound.currentTime = 0;
    stopSound.play();
    idleSound.removeEventListener("ended", Sounds.onEndedStartSound);
  }

  static click(off?: boolean) {
    if (!Sounds.isEnabled) return
    if (off !== undefined) {
      return off ? turnOffSound.play() : turnOnSound.play();
    }
    Math.random() % 2 === 0 ? turnOnSound.play() : turnOffSound.play();
  }

  static missileStart() {
    if (!Sounds.isEnabled) return
    startMissileSound.currentTime = 0;
    startMissileSound.play();
  }
}
