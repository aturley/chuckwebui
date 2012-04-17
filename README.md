This is an attempt to generate an HTML UI for a ChucK program by using ChucK control objects that publish information about themselves. The control objects are instantiated by the user and serialized as JSON to a file. The JSON is served by the web server and interpreted by the code in interface.js. Messages from the browser controls are sent as JSON-encoded OSC to osc.cgi, which in turn sends an OSC message to the ChucK program.

Setup:

* Move the files in the web/ directory to some place where they can be seen by your web server. You'll need to be able to run CGI scripts.
* Install [simpleOSC](http://pypi.python.org/pypi/SimpleOSC/0.2.3), either globally or in the same directory as the osc.cgi script.
* Create a ChucK program that uses the controls. For examples, see the examples/ directory. Make sure to move the files in the chuck/ directory so that they can be accessed by your program. Also make sure to modify the location where the JSON data is written to the same directory as ui.html.
* Run your ChucK program.
* Access the ui.html page in your browser. You should see your UI elements in the browser, and you should be able to use them to control your ChucK program.

Requirements:

* The osc.cgi script depends on [simpleOSC](http://pypi.python.org/pypi/SimpleOSC/0.2.3).