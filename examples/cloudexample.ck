20 => int gNumSquirtHandlers;

class SquirtEvent extends Event {
  int cycles;
  float freq;
}

fun void squirtHandler(UGen @ output, SquirtEvent evt) {
  SinOsc s;
  float freq;
  int cycles;

  while (evt => now) {
    evt.freq => freq;
    evt.cycles => cycles;

    freq => s.freq;
    (cycles/freq)::second => dur d;
    0 => s.phase;
    s => output;
    me.yield();
    d => now;
    s =< output;
  }
}

class SquirtSynth {
  false => int mPlaying;
  0.0 => float mDensity;
  1 => int mCycles;
  50 => float mFreq;

  fun void doit(SquirtEvent evt) {
    while ((20 + Std.rand2f(0.0, 5.0))::ms => now) {
      if (mPlaying) {
	// <<<"playing", mCycles, mFreq>>>;
	mCycles => evt.cycles;
	mFreq => evt.freq;
	evt.signal();
      }
    }
  }
}


fun void main() {
  Gain g => dac;
  0.5 => g.gain;
  SquirtEvent squirtEvent;
  for (0 => int i; i < gNumSquirtHandlers; i++) {
    spork ~ squirtHandler(g, squirtEvent);
  }

  SquirtSynth ss[5];
  for (0 => int i; i < 5; i++) {
    spork ~ ss[i].doit(squirtEvent);
  }

  WebUI_Container wc;

  WebUI_TouchPad p1;
  p1.init("touch_here");
  200 => p1.mWidth;
  200 => p1.mHeight;
  wc.addElement(p1);

  wc.save("/Users/aturley/Sites/chuckwebui/ui.json");

  wc.startOscHandlers();



  <<<"waiting">>>;
  while(1) {
    p1.mChangeEvent => now;
    // <<<"Got", p1.mTouches, "touches">>>;
    int i;
    for (0 => i; i < p1.mTouches * 2; 2 +=> i) {
      // <<<"[", p1.mValue[i], ",", p1.mValue[i+1], "]">>>;
      true => ss[i / 2].mPlaying;
      50 + (p1.mValue[i] * 50.0 / p1.mWidth) => Std.mtof => ss[i / 2].mFreq;
      p1.mValue[i + 1] / 4 => ss[i / 2].mCycles;
    }
    for (; i < 10; 2 +=> i) {
      false => ss[i / 2].mPlaying;
    }
  }
}

main();
