public class WebUI_Button extends WebUI_Element {
  "button" => mTypeName;

  "" => string mName;

  Event mChangeEvent;

  0 => int mValue;

  fun void init(string name) {
    name => mName;
  }

  fun string toJson() {
    "" => string repr;
    "{" +=> repr;
    joinList([keyValuePair("type", mTypeName), keyValuePair("id", mId),  keyValuePair("name", mName)], ",") +=> repr;
    "}" +=> repr;
    return repr;
  }

  fun void handleOscEvt(OscRecv recv) {
    recv.event("/button/" + mId + ", i") @=> OscEvent oe;
    while (oe => now) {
      <<<"got /button/", mId>>>;
      while (oe.nextMsg() != 0) {
	oe.getInt() => mValue;
	mChangeEvent.broadcast();
      }
    }
  }
}
