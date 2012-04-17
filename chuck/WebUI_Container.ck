public class WebUI_Container {
  WebUI_Element mElementList[0];

  9897 => int mPort;
  OscRecv mRecv;

  fun void addElement(WebUI_Element we) {
    mElementList << we;
  }

  fun string toJson() {
    "" => string repr;
    "{" +=> repr;
    "\"port\":" + mPort +=> repr;
    "," +=> repr;
    "\"elements\":[" +=> repr;
    for (0 => int i; i < mElementList.cap(); i++) {
      if (i != 0) {
	"," +=> repr;
      }
      mElementList[i].toJson() +=> repr;
    }
    "]" +=> repr;
    "}" +=> repr;
    return repr;
  }

  fun void startOscHandlers() {
    mPort => mRecv.port;
    mRecv.listen();
    for (0 => int i; i < mElementList.cap(); i++) {
      spork ~ mElementList[i].handleOscEvt(mRecv);
    }
  }

  fun void save(string path) {
    FileIO json;
    json.open(path, FileIO.WRITE);
    json <= this.toJson() <= IO.newline();
    json.close();
  }
}

