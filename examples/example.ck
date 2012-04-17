WebUI_Container wc;

WebUI_Button b1;
b1.init("b1");
wc.addElement(b1);

WebUI_Toggle t1;
t1.init("t1");
wc.addElement(t1);

WebUI_Selection s1;
s1.init("s1", ["s1a", "s1b", "s1c"]);
wc.addElement(s1);

WebUI_Slider x1;
x1.init_horizontal("x1");
wc.addElement(x1);

WebUI_Slider x2;
x2.init_vertical("x2");
wc.addElement(x2);

WebUI_TouchPad p1;
p1.init("p1");
wc.addElement(p1);

wc.save("/Users/aturley/Sites/chuckwebui/ui.json");

wc.startOscHandlers();

PulseOsc pu[5];

<<<"waiting">>>;
while (1) {
  p1.mChangeEvent => now;
  <<<"got", p1.mTouches, "touches">>>;
  0 => int i;
  for (0 => i; i < p1.mTouches * 2; 2 +=> i) {
    <<<"[", p1.mValue[i], ",", p1.mValue[i+1], "]">>>;
    50 + ((50.0/400.0) * p1.mValue[i]) => Std.mtof => pu[i / 2].freq;
    (1.0 * p1.mValue[i + 1] / 500) => pu[i / 2].width;
    pu[i / 2] => dac;
  }
  for (; i < 10; 2 +=> i) {
    pu[i / 2] =< dac;
  }
}
<<<"done">>>;
