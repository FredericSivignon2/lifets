// Web Audio API setup
let audioContext: AudioContext;
let buffer: AudioBuffer;

export const initAudio = async (url: string) => {
  audioContext = new AudioContext();

  const response = await fetch(url);
  const audioData = await response.arrayBuffer();

  buffer = await audioContext.decodeAudioData(audioData);
};

export const playSound = () => {
  const source = audioContext.createBufferSource();
  source.buffer = buffer;
  source.connect(audioContext.destination);
  source.start(0);
}