public class WebUI_Slider extends WebUI_Element {
  "slider" => mTypeName;

  "" => string mName;

  Event mChangeEvent;

  0 => float mValue;
  0.0 => float mMin;
  1.0 => float mMax;

  fun void init_horizontal(string name) {
    name => mName;
    "hslider" => mTypeName;
  }

  fun void init_vertical(string name) {
    name => mName;
    "vslider" => mTypeName;
  }

  fun string toJson() {
    "" => string repr;
    "{" +=> repr;
    joinList([keyValuePair("type", mTypeName), keyValuePair("id", mId),  keyValuePair("name", mName), keyValuePair("min", mMin), keyValuePair("max", mMax)], ",") +=> repr;
    "}" +=> repr;
    return repr;
  }

  fun void handleOscEvt(OscRecv recv) {
    recv.event("/slider/" + mId + ", f") @=> OscEvent oe;
    while (oe => now) {
      <<<"got /slider/", mId>>>;
      while (oe.nextMsg() != 0) {
	oe.getFloat() => mValue;
	mChangeEvent.broadcast();
      }
    }
  }
}
