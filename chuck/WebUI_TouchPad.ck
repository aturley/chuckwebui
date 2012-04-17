
public class WebUI_TouchPad extends WebUI_Element {
  5 => int kMaxTouches;

  "touchpad" => mTypeName;

  string mName;

  Event mChangeEvent;
  0 => int mTouches;
  int mValue[kMaxTouches * 2];

  100 => int mWidth;
  100 => int mHeight;
  
  fun void init(string name) {
    <<<"mId = ", mId>>>;
    name => mName;
  }

  fun string toJson() {
    "" => string repr;
    "{" +=> repr;
    joinList([keyValuePair("type", mTypeName), 
	      keyValuePair("id", mId),
	      keyValuePair("name", mName),
	      keyValuePair("width", mWidth),
	      keyValuePair("height", mHeight)], ",") +=> repr;
    "}" +=> repr;
    return repr;
  }

  fun void handleOscEvt(OscRecv recv) {
    recv.event("/touchpad/" + mId + ", iiiiiiiiiii") @=> OscEvent oe;
    while (oe => now) {
      while (oe.nextMsg() != 0) {
	oe.getInt() => mTouches;
	for (0 => int i; i < kMaxTouches * 2; i++) {
	  oe.getInt() => mValue[i];
	  if (((i + 1) % 2) == 0) {
	    // <<<i, mValue[i - 1], mValue[i]>>>;
	  }
	}
	mChangeEvent.broadcast();
      }
    }
  }
}
