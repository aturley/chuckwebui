public class WebUI_Selection extends WebUI_Element {
  "selection" => mTypeName;

  string mName;

  string mLabels[];

  Event mChangeEvent;
  0 => int mValue;
  
  fun void init(string name, string labels[]) {
    name => mName;
    labels @=> mLabels;
  }

  fun string toJson() {
    "" => string repr;
    "{" +=> repr;
    joinList([keyValuePair("type", mTypeName), keyValuePair("id", mId), keyValuePair("name", mName), keyValuePair("labels", mLabels)], ",") +=> repr;
    "}" +=> repr;
    return repr;
  }

  fun void handleOscEvt(OscRecv recv) {
    recv.event("/selection/" + mId + ", i") @=> OscEvent oe;
    while (oe => now) {
      <<<"got /selection/", mId>>>;
      while (oe.nextMsg() != 0) {
	oe.getInt() => mValue;
	mChangeEvent.broadcast();
      }
    }
  }
}
