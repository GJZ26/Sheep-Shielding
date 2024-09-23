export default function Looper(callback: Function, frameRate: number = 30) {
  const frameRateInMillisecond: number = 1000 / frameRate;
  setInterval(callback, frameRateInMillisecond);
}
