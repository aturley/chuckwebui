WebUI_Container wc;

fun void toggleHandler(WebUI_Toggle t, int idx) {
  SqrOsc sq => Gain g => dac;
  0.0 => g.gain;

  idx + 60 => Std.mtof => sq.freq;

  while(t.mChangeEvent => now) {
    t.mValue * 0.3 => g.gain;
  }
}

for (0 => int i; i < 4; i++) {
  for (0 => int j; j < 4; j++) {
    WebUI_Toggle t;
    t.init("t_" + i + "_" + j);
    i * 80 + 20 => t.mX;
    j * 80 + 20 => t.mY;
    true => t.mAbsolutePos;
    spork ~ toggleHandler(t, i + 4 * j);
    wc.addElement(t);
  }
 }

wc.save("/Users/aturley/Sites/chuckwebui/ui.json");

wc.startOscHandlers();

<<<"waiting">>>;
while (1) {
  10::second => now;
}
<<<"done">>>;
