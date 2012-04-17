#!/usr/local/bin/python

import osc, sys, json

lines = sys.stdin.readlines()

osc.init()

data = json.loads(lines[-1])

print "Content-type: text/json"
print 
print lines[-1]

address = str(data['address'])
port = data['port']
args = data['args']
types = data['types']

typed_args = []

for arg, t in zip(args, types):
    if t == "i":
        typed_args.append(int(arg))
    elif t == "f":
        typed_args.append(float(arg))
    elif t == "s":
        typed_args.append(str(arg))
    else:
        typed_args.append(arg)
        

osc.sendMsg(address, typed_args, "127.0.0.1", port)

