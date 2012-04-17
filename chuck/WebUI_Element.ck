public class WebUI_Element {
  static int sNextId;

  "" => string mTypeName;

  "c" + sNextId => string mId;
  sNextId++;

  fun string toJson() {
    return "";
  }

  fun void handleOscEvt(OscRecv recv) {
  }

  fun string joinList(string list[], string joiner) {
    string repr;
    for (0 => int i; i < list.cap(); i++) {
      if (i != 0) {
	repr + joiner => repr;
      }
      repr + list[i] => repr;
    }
    return repr;
  }

  fun string keyValuePair(string key, int value) {
    return "\"" + key + "\":" + value;
  }

  fun string keyValuePair(string key, float value) {
    return "\"" + key + "\":" + value;
  }

  fun string keyValuePair(string key, string value) {
    return "\"" + key + "\":\"" + value + "\"";
  }

  fun string keyValuePair(string key, string values[]) {
    "[" => string valueList;
    for (0 => int i; i < values.cap(); i++) {
      if (i != 0) {
	valueList + "," => valueList;
      }
      valueList + "\"" + values[i] + "\"" => valueList;
    }
    valueList + "]" => valueList;

    return "\"" + key + "\":" + valueList;
  }
}
