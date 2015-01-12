"use strict"

var util = require('util');
var unirest = require('unirest');
var xml2js = require('xml2js')

module.exports = TCPConnected;

var RequestString = 'cmd=%s&data=%s&fmt=xml';
var DevicesCommand = ['<gwrcmds><gwrcmd><gcmd>SceneGetCarouselDevType</gcmd><gdata><gip><version>1</version><token>1234567890</token><fields>detail</fields></gip></gdata></gwrcmd></gwrcmds>'].join('\n');

function TCPConnected(host) {
    var self = this;

    if (!host) {
        host = "lighting.local"
    }

    self._host = host;
    self.devices = [];
    self.scenes = [];

    var payload = util.format(RequestString, 'GWRBatch', encodeURIComponent(DevicesCommand));

    self._request(payload, function (error, xml) {
        if (xml) {
            try {
                self.devices = xml['gwrcmd']['gdata']['gip']['devtype']['device'];
                if (typeof (self.rooms["did"]) !== 'undefined') {
                    self.devices = [self.devices];
                }
            } catch (err) {
                var error = {
                    error: 'Unkown Error'
                }
            }
        }
    })

};

TCPConnected.prototype._request = function (payload, callback) {
    console.log("TCPConnected request with payload: " + payload);
    unirest
        .post('http://' + this._host + '/gwr/gop.php')
        .headers({
            'Content-Type': 'text/xml; charset="utf-8"',
            'Content-Length': payload.length
        })
        .send(payload)
        .end(function (result) {
            if (!result.ok) {
                console.log("# TCPConnected._request", "error", result.error)
                callback(result.error, null)
            } else if (result.body) {
                xml2js.parseString(result.body, function (error, result) {
                    callback(null, flatten(result.gwrcmds))
                });
            } else {
                console.log("# TCPConnected._request", "no body - unexpected")
                callback("no body", null)
            }
        });
}

/**
 *  This converts what xml-to-js makes to xml2js
 */
var flatten = function (o) {
    if (Array.isArray(o)) {
        if (o.length === 1) {
            return flatten(o[0])
        } else {
            var ns = []
            for (var oi in o) {
                ns.push(flatten(o[oi]))
            }
            return ns
        }
    } else if (typeof o === "object") {
        var nd = {}
        for (var nkey in o) {
            nd[nkey] = flatten(o[nkey])
        }
        return nd
    } else {
        return o
    }
}


