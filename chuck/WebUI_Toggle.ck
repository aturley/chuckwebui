public class WebUI_Toggle extends WebUI_Element {
  "toggle" => mTypeName;

  "" => string mName;

  Event mChangeEvent;

  0 => int mValue;

  0 => int mX;
  0 => int mY;
  false => int mAbsolutePos;

  fun void init(string name) {
    name => mName;
  }

  fun string toJson() {
    "" => string repr;
    "{" +=> repr;
    [keyValuePair("type", mTypeName), keyValuePair("id", mId), keyValuePair("name", mName)] @=> string attrs[];
    if (mAbsolutePos) {
      attrs << keyValuePair("x", mX);
      attrs << keyValuePair("y", mY);
    }
    joinList(attrs, ",") +=> repr;
    "}" +=> repr;
    return repr;
  }

  fun void handleOscEvt(OscRecv recv) {
    recv.event("/toggle/" + mId + ", i") @=> OscEvent oe;
    while (oe => now) {
      while (oe.nextMsg() != 0) {
	oe.getInt() => mValue;
	<<<"got /toggle/", mId, mValue>>>;
	mChangeEvent.broadcast();
      }
    }
  }
}
