	var wl = window.location.href;
	var mob = (window.location.href.indexOf('file://')>=0);

	function setCookie(cname,cvalue)	{
		if (mob===true) {
			window.localStorage.setItem(cname, cvalue);
		} else {
			var d = new Date(); 
			d.setTime(d.getTime()+(1*24*60*60*1000)); 
			var expires = "expires="+d.toGMTString(); 
			document.cookie = cname + "=" + cvalue + "; " + expires; 
		}
	} 

	function getCookie(cname)	{ 
		if (mob===true) {
			var cvalue = window.localStorage.getItem(cname);
			return cvalue
		} else {
			var name = cname + "="; 
			var ca = document.cookie.split(';'); 
			for(var i=0; i<ca.length; i++) { 
			  var c = ca[i].trim(); 
			  if (c.indexOf(name)==0) return c.substring(name.length,c.length); 
			} 
			return ""; 
		}
	} 

	function delCookie(cname) {
		if (mob===true) {
			window.localStorage.removeItem(cname);
		} else {
			var d = new Date();
			d.setTime(d.getTime());
			var expires = "expires="+d.toGMTString();
			document.cookie = cname + "=" + "" + "; " + expires;
		}
	}


(function(f) {
    var g;
    if (typeof window !== "undefined") {
        g = window
    } else if (typeof global !== "undefined") {
        g = global
    } else if (typeof self !== "undefined") {
        g = self
    } else {
        g = this
    }
    g.adapter = f()
	
	function setClientID(cid, who) {
		return cid=who
	}
})(function() {
    var define, module, exports;
    return function e(t, n, r) {
        function s(o, u) {
            if (!n[o]) {
                if (!t[o]) {
                    var a = typeof require == "function" && require;
                    if (!u && a) return a(o, !0);
                    if (i) return i(o, !0);
                    var f = new Error("Cannot find module '" + o + "'");
                    throw f.code = "MODULE_NOT_FOUND", f
                }
                var l = n[o] = {
                    exports: {}
                };
                t[o][0].call(l.exports, function(e) {
                    var n = t[o][1][e];
                    return s(n ? n : e)
                }, l, l.exports, e, t, n, r)
            }
            return n[o].exports
        }
        var i = typeof require == "function" && require;
        for (var o = 0; o < r.length; o++) s(r[o]);
        return s
    }({
        1: [function(require, module, exports) {
            "use strict";
            (function() {
                var logging = require("./utils").log;
                var browserDetails = require("./utils").browserDetails;
                module.exports.browserDetails = browserDetails;
                module.exports.extractVersion = require("./utils").extractVersion;
                module.exports.disableLog = require("./utils").disableLog;
                var chromeShim = require("./chrome/chrome_shim") || null;
                var edgeShim = require("./edge/edge_shim") || null;
                var firefoxShim = require("./firefox/firefox_shim") || null;
                var safariShim = require("./safari/safari_shim") || null;
                switch (browserDetails.browser) {
                    case "opera":
                    case "chrome":
                        if (!chromeShim || !chromeShim.shimPeerConnection) {
                            logging("Chrome shim is not included in this adapter release.");
                            return
                        }
                        logging("adapter.js shimming chrome.");
                        module.exports.browserShim = chromeShim;
                        chromeShim.shimGetUserMedia();
                        chromeShim.shimSourceObject();
                        chromeShim.shimPeerConnection();
                        chromeShim.shimOnTrack();
                        break;
                    case "firefox":
                        if (!firefoxShim || !firefoxShim.shimPeerConnection) {
                            logging("Firefox shim is not included in this adapter release.");
                            return
                        }
                        logging("adapter.js shimming firefox.");
                        module.exports.browserShim = firefoxShim;
                        firefoxShim.shimGetUserMedia();
                        firefoxShim.shimSourceObject();
                        firefoxShim.shimPeerConnection();
                        firefoxShim.shimOnTrack();
                        break;
                    case "edge":
                        if (!edgeShim || !edgeShim.shimPeerConnection) {
                            logging("MS edge shim is not included in this adapter release.");
                            return
                        }
                        logging("adapter.js shimming edge.");
                        module.exports.browserShim = edgeShim;
                        edgeShim.shimPeerConnection();
                        break;
                    case "safari":
                        if (!safariShim) {
                            logging("Safari shim is not included in this adapter release.");
                            return
                        }
                        logging("adapter.js shimming safari.");
                        module.exports.browserShim = safariShim;
                        safariShim.shimGetUserMedia();
                        break;
                    default:
                        logging("Unsupported browser!")
                }
            })()
        }, {
            "./chrome/chrome_shim": 2,
            "./edge/edge_shim": 5,
            "./firefox/firefox_shim": 6,
            "./safari/safari_shim": 8,
            "./utils": 9
        }],
        2: [function(require, module, exports) {
            "use strict";
            var logging = require("../utils.js").log;
            var browserDetails = require("../utils.js").browserDetails;
            var chromeShim = {
                shimOnTrack: function() {
                    if (typeof window === "object" && window.RTCPeerConnection && !("ontrack" in window.RTCPeerConnection.prototype)) {
                        Object.defineProperty(window.RTCPeerConnection.prototype, "ontrack", {
                            get: function() {
                                return this._ontrack
                            },
                            set: function(f) {
                                var self = this;
                                if (this._ontrack) {
                                    this.removeEventListener("track", this._ontrack);
                                    this.removeEventListener("addstream", this._ontrackpoly)
                                }
                                this.addEventListener("track", this._ontrack = f);
                                this.addEventListener("addstream", this._ontrackpoly = function(e) {
                                    e.stream.addEventListener("addtrack", function(te) {
                                        var event = new Event("track");
                                        event.track = te.track;
                                        event.receiver = {
                                            track: te.track
                                        };
                                        event.streams = [e.stream];
                                        self.dispatchEvent(event)
                                    });
                                    e.stream.getTracks().forEach(function(track) {
                                        var event = new Event("track");
                                        event.track = track;
                                        event.receiver = {
                                            track: track
                                        };
                                        event.streams = [e.stream];
                                        this.dispatchEvent(event)
                                    }.bind(this))
                                }.bind(this))
                            }
                        })
                    }
                },
                shimSourceObject: function() {
                    if (typeof window === "object") {
                        if (window.HTMLMediaElement && !("srcObject" in window.HTMLMediaElement.prototype)) {
                            Object.defineProperty(window.HTMLMediaElement.prototype, "srcObject", {
                                get: function() {
                                    return this._srcObject
                                },
                                set: function(stream) {
                                    var self = this;
                                    this._srcObject = stream;
                                    if (this.src) {
                                        URL.revokeObjectURL(this.src)
                                    }
                                    if (!stream) {
                                        this.src = "";
                                        return
                                    }
                                    this.src = URL.createObjectURL(stream);
                                    stream.addEventListener("addtrack", function() {
                                        if (self.src) {
                                            URL.revokeObjectURL(self.src)
                                        }
                                        self.src = URL.createObjectURL(stream)
                                    });
                                    stream.addEventListener("removetrack", function() {
                                        if (self.src) {
                                            URL.revokeObjectURL(self.src)
                                        }
                                        self.src = URL.createObjectURL(stream)
                                    })
                                }
                            })
                        }
                    }
                },
                shimPeerConnection: function() {
                    window.RTCPeerConnection = function(pcConfig, pcConstraints) {
                        logging("PeerConnection");
                        if (pcConfig && pcConfig.iceTransportPolicy) {
                            pcConfig.iceTransports = pcConfig.iceTransportPolicy
                        }
                        var pc = new webkitRTCPeerConnection(pcConfig, pcConstraints);
                        if (pc.getStats !== undefined) {
                            var origGetStats = pc.getStats.bind(pc);
                            pc.getStats = function(selector, successCallback, errorCallback) {
                                var self = this;
                                var args = arguments;
                                if (arguments.length > 0 && typeof selector === "function") {
                                    return origGetStats(selector, successCallback)
                                }
                                var fixChromeStats_ = function(response) {
                                    var standardReport = {};
                                    var reports = response.result();
                                    reports.forEach(function(report) {
                                        var standardStats = {
                                            id: report.id,
                                            timestamp: report.timestamp,
                                            type: report.type
                                        };
                                        report.names().forEach(function(name) {
                                            standardStats[name] = report.stat(name)
                                        });
                                        standardReport[standardStats.id] = standardStats
                                    });
                                    return standardReport
                                };
                                if (arguments.length >= 2) {
                                    var successCallbackWrapper_ = function(response) {
                                        args[1](fixChromeStats_(response))
                                    };
                                    return origGetStats.apply(this, [successCallbackWrapper_, arguments[0]])
                                }
                                return new Promise(function(resolve, reject) {
                                    if (args.length === 1 && typeof selector === "object") {
                                        origGetStats.apply(self, [function(response) {
                                            resolve.apply(null, [fixChromeStats_(response)])
                                        }, reject])
                                    } else {
                                        origGetStats.apply(self, [resolve, reject])
                                    }
                                })
                            }
                        } else {
                            console.log("pc.getStats is not defined")
                        }
                        return pc
                    };
                    window.RTCPeerConnection.prototype = webkitRTCPeerConnection.prototype;
                    if (webkitRTCPeerConnection.generateCertificate) {
                        Object.defineProperty(window.RTCPeerConnection, "generateCertificate", {
                            get: function() {
                                return webkitRTCPeerConnection.generateCertificate
                            }
                        })
                    }["createOffer", "createAnswer"].forEach(function(method) {
                        var nativeMethod = webkitRTCPeerConnection.prototype[method];
                        webkitRTCPeerConnection.prototype[method] = function() {
                            var self = this;
                            if (arguments.length < 1 || arguments.length === 1 && typeof arguments[0] === "object") {
                                var opts = arguments.length === 1 ? arguments[0] : undefined;
                                return new Promise(function(resolve, reject) {
                                    nativeMethod.apply(self, [resolve, reject, opts])
                                })
                            }
                            return nativeMethod.apply(this, arguments)
                        }
                    });
                    ["setLocalDescription", "setRemoteDescription", "addIceCandidate"].forEach(function(method) {
                        var nativeMethod = webkitRTCPeerConnection.prototype[method];
                        webkitRTCPeerConnection.prototype[method] = function() {
                            var args = arguments;
                            var self = this;
                            args[0] = new(method === "addIceCandidate" ? RTCIceCandidate : RTCSessionDescription)(args[0]);
                            return new Promise(function(resolve, reject) {
                                nativeMethod.apply(self, [args[0], function() {
                                    resolve();
                                    if (args.length >= 2) {
                                        args[1].apply(null, [])
                                    }
                                }, function(err) {
                                    reject(err);
                                    if (args.length >= 3) {
                                        args[2].apply(null, [err])
                                    }
                                }])
                            })
                        }
                    })
                },
                attachMediaStream: function(element, stream) {
                    logging("DEPRECATED, attachMediaStream will soon be removed.");
                    if (browserDetails.version >= 43) {
                        element.srcObject = stream
                    } else if (typeof element.src !== "undefined") {
                        element.src = URL.createObjectURL(stream)
                    } else {
                        logging("Error attaching stream to element.")
                    }
                },
                reattachMediaStream: function(to, from) {
                    logging("DEPRECATED, reattachMediaStream will soon be removed.");
                    if (browserDetails.version >= 43) {
                        to.srcObject = from.srcObject
                    } else {
                        to.src = from.src
                    }
                }
            };
            module.exports = {
                shimOnTrack: chromeShim.shimOnTrack,
                shimSourceObject: chromeShim.shimSourceObject,
                shimPeerConnection: chromeShim.shimPeerConnection,
                shimGetUserMedia: require("./getusermedia"),
                attachMediaStream: chromeShim.attachMediaStream,
                reattachMediaStream: chromeShim.reattachMediaStream
            }
        }, {
            "../utils.js": 9,
            "./getusermedia": 3
        }],
        3: [function(require, module, exports) {
            "use strict";
            var logging = require("../utils.js").log;
            module.exports = function() {
                var constraintsToChrome_ = function(c) {
                    if (typeof c !== "object" || c.mandatory || c.optional) {
                        return c
                    }
                    var cc = {};
                    Object.keys(c).forEach(function(key) {
                        if (key === "require" || key === "advanced" || key === "mediaSource") {
                            return
                        }
                        var r = typeof c[key] === "object" ? c[key] : {
                            ideal: c[key]
                        };
                        if (r.exact !== undefined && typeof r.exact === "number") {
                            r.min = r.max = r.exact
                        }
                        var oldname_ = function(prefix, name) {
                            if (prefix) {
                                return prefix + name.charAt(0).toUpperCase() + name.slice(1)
                            }
                            return name === "deviceId" ? "sourceId" : name
                        };
                        if (r.ideal !== undefined) {
                            cc.optional = cc.optional || [];
                            var oc = {};
                            if (typeof r.ideal === "number") {
                                oc[oldname_("min", key)] = r.ideal;
                                cc.optional.push(oc);
                                oc = {};
                                oc[oldname_("max", key)] = r.ideal;
                                cc.optional.push(oc)
                            } else {
                                oc[oldname_("", key)] = r.ideal;
                                cc.optional.push(oc)
                            }
                        }
                        if (r.exact !== undefined && typeof r.exact !== "number") {
                            cc.mandatory = cc.mandatory || {};
                            cc.mandatory[oldname_("", key)] = r.exact
                        } else {
                            ["min", "max"].forEach(function(mix) {
                                if (r[mix] !== undefined) {
                                    cc.mandatory = cc.mandatory || {};
                                    cc.mandatory[oldname_(mix, key)] = r[mix]
                                }
                            })
                        }
                    });
                    if (c.advanced) {
                        cc.optional = (cc.optional || []).concat(c.advanced)
                    }
                    return cc
                };
                var getUserMedia_ = function(constraints, onSuccess, onError) {
                    constraints = JSON.parse(JSON.stringify(constraints));
                    if (constraints.audio) {
                        constraints.audio = constraintsToChrome_(constraints.audio)
                    }
                    if (constraints.video) {
                        constraints.video = constraintsToChrome_(constraints.video)
                    }
                    logging("chrome: " + JSON.stringify(constraints));
                    return navigator.webkitGetUserMedia(constraints, onSuccess, onError)
                };
                navigator.getUserMedia = getUserMedia_;
                var getUserMediaPromise_ = function(constraints) {
                    return new Promise(function(resolve, reject) {
                        navigator.getUserMedia(constraints, resolve, reject)
                    })
                };
                if (!navigator.mediaDevices) {
                    navigator.mediaDevices = {
                        getUserMedia: getUserMediaPromise_,
                        enumerateDevices: function() {
                            return new Promise(function(resolve) {
                                var kinds = {
                                    audio: "audioinput",
                                    video: "videoinput"
                                };
                                return MediaStreamTrack.getSources(function(devices) {
                                    resolve(devices.map(function(device) {
                                        return {
                                            label: device.label,
                                            kind: kinds[device.kind],
                                            deviceId: device.id,
                                            groupId: ""
                                        }
                                    }))
                                })
                            })
                        }
                    }
                }
                if (!navigator.mediaDevices.getUserMedia) {
                    navigator.mediaDevices.getUserMedia = function(constraints) {
                        return getUserMediaPromise_(constraints)
                    }
                } else {
                    var origGetUserMedia = navigator.mediaDevices.getUserMedia.bind(navigator.mediaDevices);
                    navigator.mediaDevices.getUserMedia = function(c) {
                        if (c) {
                            logging("spec:   " + JSON.stringify(c));
                            c.audio = constraintsToChrome_(c.audio);
                            c.video = constraintsToChrome_(c.video);
                            logging("chrome: " + JSON.stringify(c))
                        }
                        return origGetUserMedia(c)
                    }.bind(this)
                }
                if (typeof navigator.mediaDevices.addEventListener === "undefined") {
                    navigator.mediaDevices.addEventListener = function() {
                        logging("Dummy mediaDevices.addEventListener called.")
                    }
                }
                if (typeof navigator.mediaDevices.removeEventListener === "undefined") {
                    navigator.mediaDevices.removeEventListener = function() {
                        logging("Dummy mediaDevices.removeEventListener called.")
                    }
                }
            }
        }, {
            "../utils.js": 9
        }],
        4: [function(require, module, exports) {
            "use strict";
            var SDPUtils = {};
            SDPUtils.generateIdentifier = function() {
                return Math.random().toString(36).substr(2, 10)
            };
            SDPUtils.localCName = SDPUtils.generateIdentifier();
            SDPUtils.splitLines = function(blob) {
                return blob.trim().split("\n").map(function(line) {
                    return line.trim()
                })
            };
            SDPUtils.splitSections = function(blob) {
                var parts = blob.split("\nm=");
                return parts.map(function(part, index) {
                    return (index > 0 ? "m=" + part : part).trim() + "\r\n"
                })
            };
            SDPUtils.matchPrefix = function(blob, prefix) {
                return SDPUtils.splitLines(blob).filter(function(line) {
                    return line.indexOf(prefix) === 0
                })
            };
            SDPUtils.parseCandidate = function(line) {
                var parts;
                if (line.indexOf("a=candidate:") === 0) {
                    parts = line.substring(12).split(" ")
                } else {
                    parts = line.substring(10).split(" ")
                }
                var candidate = {
                    foundation: parts[0],
                    component: parts[1],
                    protocol: parts[2].toLowerCase(),
                    priority: parseInt(parts[3], 10),
                    ip: parts[4],
                    port: parseInt(parts[5], 10),
                    type: parts[7]
                };
                for (var i = 8; i < parts.length; i += 2) {
                    switch (parts[i]) {
                        case "raddr":
                            candidate.relatedAddress = parts[i + 1];
                            break;
                        case "rport":
                            candidate.relatedPort = parseInt(parts[i + 1], 10);
                            break;
                        case "tcptype":
                            candidate.tcpType = parts[i + 1];
                            break;
                        default:
                            break
                    }
                }
                return candidate
            };
            SDPUtils.writeCandidate = function(candidate) {
                var sdp = [];
                sdp.push(candidate.foundation);
                sdp.push(candidate.component);
                sdp.push(candidate.protocol.toUpperCase());
                sdp.push(candidate.priority);
                sdp.push(candidate.ip);
                sdp.push(candidate.port);
                var type = candidate.type;
                sdp.push("typ");
                sdp.push(type);
                if (type !== "host" && candidate.relatedAddress && candidate.relatedPort) {
                    sdp.push("raddr");
                    sdp.push(candidate.relatedAddress);
                    sdp.push("rport");
                    sdp.push(candidate.relatedPort)
                }
                if (candidate.tcpType && candidate.protocol.toLowerCase() === "tcp") {
                    sdp.push("tcptype");
                    sdp.push(candidate.tcpType)
                }
                return "candidate:" + sdp.join(" ")
            };
            SDPUtils.parseRtpMap = function(line) {
                var parts = line.substr(9).split(" ");
                var parsed = {
                    payloadType: parseInt(parts.shift(), 10)
                };
                parts = parts[0].split("/");
                parsed.name = parts[0];
                parsed.clockRate = parseInt(parts[1], 10);
                parsed.numChannels = parts.length === 3 ? parseInt(parts[2], 10) : 1;
                return parsed
            };
            SDPUtils.writeRtpMap = function(codec) {
                var pt = codec.payloadType;
                if (codec.preferredPayloadType !== undefined) {
                    pt = codec.preferredPayloadType
                }
                return "a=rtpmap:" + pt + " " + codec.name + "/" + codec.clockRate + (codec.numChannels !== 1 ? "/" + codec.numChannels : "") + "\r\n"
            };
            SDPUtils.parseExtmap = function(line) {
                var parts = line.substr(9).split(" ");
                return {
                    id: parseInt(parts[0], 10),
                    uri: parts[1]
                }
            };
            SDPUtils.writeExtmap = function(headerExtension) {
                return "a=extmap:" + (headerExtension.id || headerExtension.preferredId) + " " + headerExtension.uri + "\r\n"
            };
            SDPUtils.parseFmtp = function(line) {
                var parsed = {};
                var kv;
                var parts = line.substr(line.indexOf(" ") + 1).split(";");
                for (var j = 0; j < parts.length; j++) {
                    kv = parts[j].trim().split("=");
                    parsed[kv[0].trim()] = kv[1]
                }
                return parsed
            };
            SDPUtils.writeFmtp = function(codec) {
                var line = "";
                var pt = codec.payloadType;
                if (codec.preferredPayloadType !== undefined) {
                    pt = codec.preferredPayloadType
                }
                if (codec.parameters && Object.keys(codec.parameters).length) {
                    var params = [];
                    Object.keys(codec.parameters).forEach(function(param) {
                        params.push(param + "=" + codec.parameters[param])
                    });
                    line += "a=fmtp:" + pt + " " + params.join(";") + "\r\n"
                }
                return line
            };
            SDPUtils.parseRtcpFb = function(line) {
                var parts = line.substr(line.indexOf(" ") + 1).split(" ");
                return {
                    type: parts.shift(),
                    parameter: parts.join(" ")
                }
            };
            SDPUtils.writeRtcpFb = function(codec) {
                var lines = "";
                var pt = codec.payloadType;
                if (codec.preferredPayloadType !== undefined) {
                    pt = codec.preferredPayloadType
                }
                if (codec.rtcpFeedback && codec.rtcpFeedback.length) {
                    codec.rtcpFeedback.forEach(function(fb) {
                        lines += "a=rtcp-fb:" + pt + " " + fb.type + " " + fb.parameter + "\r\n"
                    })
                }
                return lines
            };
            SDPUtils.parseSsrcMedia = function(line) {
                var sp = line.indexOf(" ");
                var parts = {
                    ssrc: parseInt(line.substr(7, sp - 7), 10)
                };
                var colon = line.indexOf(":", sp);
                if (colon > -1) {
                    parts.attribute = line.substr(sp + 1, colon - sp - 1);
                    parts.value = line.substr(colon + 1)
                } else {
                    parts.attribute = line.substr(sp + 1)
                }
                return parts
            };
            SDPUtils.getDtlsParameters = function(mediaSection, sessionpart) {
                var lines = SDPUtils.splitLines(mediaSection);
                lines = lines.concat(SDPUtils.splitLines(sessionpart));
                var fpLine = lines.filter(function(line) {
                    return line.indexOf("a=fingerprint:") === 0
                })[0].substr(14);
                var dtlsParameters = {
                    role: "auto",
                    fingerprints: [{
                        algorithm: fpLine.split(" ")[0],
                        value: fpLine.split(" ")[1]
                    }]
                };
                return dtlsParameters
            };
            SDPUtils.writeDtlsParameters = function(params, setupType) {
                var sdp = "a=setup:" + setupType + "\r\n";
                params.fingerprints.forEach(function(fp) {
                    sdp += "a=fingerprint:" + fp.algorithm + " " + fp.value + "\r\n"
                });
                return sdp
            };
            SDPUtils.getIceParameters = function(mediaSection, sessionpart) {
                var lines = SDPUtils.splitLines(mediaSection);
                lines = lines.concat(SDPUtils.splitLines(sessionpart));
                var iceParameters = {
                    usernameFragment: lines.filter(function(line) {
                        return line.indexOf("a=ice-ufrag:") === 0
                    })[0].substr(12),
                    password: lines.filter(function(line) {
                        return line.indexOf("a=ice-pwd:") === 0
                    })[0].substr(10)
                };
                return iceParameters
            };
            SDPUtils.writeIceParameters = function(params) {
                return "a=ice-ufrag:" + params.usernameFragment + "\r\n" + "a=ice-pwd:" + params.password + "\r\n"
            };
            SDPUtils.parseRtpParameters = function(mediaSection) {
                var description = {
                    codecs: [],
                    headerExtensions: [],
                    fecMechanisms: [],
                    rtcp: []
                };
                var lines = SDPUtils.splitLines(mediaSection);
                var mline = lines[0].split(" ");
                for (var i = 3; i < mline.length; i++) {
                    var pt = mline[i];
                    var rtpmapline = SDPUtils.matchPrefix(mediaSection, "a=rtpmap:" + pt + " ")[0];
                    if (rtpmapline) {
                        var codec = SDPUtils.parseRtpMap(rtpmapline);
                        var fmtps = SDPUtils.matchPrefix(mediaSection, "a=fmtp:" + pt + " ");
                        codec.parameters = fmtps.length ? SDPUtils.parseFmtp(fmtps[0]) : {};
                        codec.rtcpFeedback = SDPUtils.matchPrefix(mediaSection, "a=rtcp-fb:" + pt + " ").map(SDPUtils.parseRtcpFb);
                        description.codecs.push(codec);
                        switch (codec.name.toUpperCase()) {
                            case "RED":
                            case "ULPFEC":
                                description.fecMechanisms.push(codec.name.toUpperCase());
                                break;
                            default:
                                break
                        }
                    }
                }
                SDPUtils.matchPrefix(mediaSection, "a=extmap:").forEach(function(line) {
                    description.headerExtensions.push(SDPUtils.parseExtmap(line))
                });
                return description
            };
            SDPUtils.writeRtpDescription = function(kind, caps) {
                var sdp = "";
                sdp += "m=" + kind + " ";
                sdp += caps.codecs.length > 0 ? "9" : "0";
                sdp += " UDP/TLS/RTP/SAVPF ";
                sdp += caps.codecs.map(function(codec) {
                    if (codec.preferredPayloadType !== undefined) {
                        return codec.preferredPayloadType
                    }
                    return codec.payloadType
                }).join(" ") + "\r\n";
                sdp += "c=IN IP4 0.0.0.0\r\n";
                sdp += "a=rtcp:9 IN IP4 0.0.0.0\r\n";
                caps.codecs.forEach(function(codec) {
                    sdp += SDPUtils.writeRtpMap(codec);
                    sdp += SDPUtils.writeFmtp(codec);
                    sdp += SDPUtils.writeRtcpFb(codec)
                });
                sdp += "a=rtcp-mux\r\n";
                return sdp
            };
            SDPUtils.parseRtpEncodingParameters = function(mediaSection) {
                var encodingParameters = [];
                var description = SDPUtils.parseRtpParameters(mediaSection);
                var hasRed = description.fecMechanisms.indexOf("RED") !== -1;
                var hasUlpfec = description.fecMechanisms.indexOf("ULPFEC") !== -1;
                var ssrcs = SDPUtils.matchPrefix(mediaSection, "a=ssrc:").map(function(line) {
                    return SDPUtils.parseSsrcMedia(line)
                }).filter(function(parts) {
                    return parts.attribute === "cname"
                });
                var primarySsrc = ssrcs.length > 0 && ssrcs[0].ssrc;
                var secondarySsrc;
                var flows = SDPUtils.matchPrefix(mediaSection, "a=ssrc-group:FID").map(function(line) {
                    var parts = line.split(" ");
                    parts.shift();
                    return parts.map(function(part) {
                        return parseInt(part, 10)
                    })
                });
                if (flows.length > 0 && flows[0].length > 1 && flows[0][0] === primarySsrc) {
                    secondarySsrc = flows[0][1]
                }
                description.codecs.forEach(function(codec) {
                    if (codec.name.toUpperCase() === "RTX" && codec.parameters.apt) {
                        var encParam = {
                            ssrc: primarySsrc,
                            codecPayloadType: parseInt(codec.parameters.apt, 10),
                            rtx: {
                                ssrc: secondarySsrc
                            }
                        };
                        encodingParameters.push(encParam);
                        if (hasRed) {
                            encParam = JSON.parse(JSON.stringify(encParam));
                            encParam.fec = {
                                ssrc: secondarySsrc,
                                mechanism: hasUlpfec ? "red+ulpfec" : "red"
                            };
                            encodingParameters.push(encParam)
                        }
                    }
                });
                if (encodingParameters.length === 0 && primarySsrc) {
                    encodingParameters.push({
                        ssrc: primarySsrc
                    })
                }
                var bandwidth = SDPUtils.matchPrefix(mediaSection, "b=");
                if (bandwidth.length) {
                    if (bandwidth[0].indexOf("b=TIAS:") === 0) {
                        bandwidth = parseInt(bandwidth[0].substr(7), 10)
                    } else if (bandwidth[0].indexOf("b=AS:") === 0) {
                        bandwidth = parseInt(bandwidth[0].substr(5), 10)
                    }
                    encodingParameters.forEach(function(params) {
                        params.maxBitrate = bandwidth
                    })
                }
                return encodingParameters
            };
            SDPUtils.writeSessionBoilerplate = function() {
                return "v=0\r\n" + "o=thisisadapterortc 8169639915646943137 2 IN IP4 127.0.0.1\r\n" + "s=-\r\n" + "t=0 0\r\n"
            };
            SDPUtils.writeMediaSection = function(transceiver, caps, type, stream) {
                var sdp = SDPUtils.writeRtpDescription(transceiver.kind, caps);
                sdp += SDPUtils.writeIceParameters(transceiver.iceGatherer.getLocalParameters());
                sdp += SDPUtils.writeDtlsParameters(transceiver.dtlsTransport.getLocalParameters(), type === "offer" ? "actpass" : "active");
                sdp += "a=mid:" + transceiver.mid + "\r\n";
                if (transceiver.rtpSender && transceiver.rtpReceiver) {
                    sdp += "a=sendrecv\r\n"
                } else if (transceiver.rtpSender) {
                    sdp += "a=sendonly\r\n"
                } else if (transceiver.rtpReceiver) {
                    sdp += "a=recvonly\r\n"
                } else {
                    sdp += "a=inactive\r\n"
                }
                if (transceiver.rtpSender) {
                    var msid = "msid:" + stream.id + " " + transceiver.rtpSender.track.id + "\r\n";
                    sdp += "a=" + msid;
                    sdp += "a=ssrc:" + transceiver.sendEncodingParameters[0].ssrc + " " + msid
                }
                sdp += "a=ssrc:" + transceiver.sendEncodingParameters[0].ssrc + " cname:" + SDPUtils.localCName + "\r\n";
                return sdp
            };
            SDPUtils.getDirection = function(mediaSection, sessionpart) {
                var lines = SDPUtils.splitLines(mediaSection);
                for (var i = 0; i < lines.length; i++) {
                    switch (lines[i]) {
                        case "a=sendrecv":
                        case "a=sendonly":
                        case "a=recvonly":
                        case "a=inactive":
                            return lines[i].substr(2);
                        default:
                    }
                }
                if (sessionpart) {
                    return SDPUtils.getDirection(sessionpart)
                }
                return "sendrecv"
            };
            module.exports = SDPUtils
        }, {}],
        5: [function(require, module, exports) {
            "use strict";
            var SDPUtils = require("./edge_sdp");
            var logging = require("../utils").log;
            var edgeShim = {
                shimPeerConnection: function() {
                    if (window.RTCIceGatherer) {
                        if (!window.RTCIceCandidate) {
                            window.RTCIceCandidate = function(args) {
                                return args
                            }
                        }
                        if (!window.RTCSessionDescription) {
                            window.RTCSessionDescription = function(args) {
                                return args
                            }
                        }
                    }
                    window.RTCPeerConnection = function(config) {
                        var self = this;
                        var _eventTarget = document.createDocumentFragment();
                        ["addEventListener", "removeEventListener", "dispatchEvent"].forEach(function(method) {
                            self[method] = _eventTarget[method].bind(_eventTarget)
                        });
                        this.onicecandidate = null;
                        this.onaddstream = null;
                        this.ontrack = null;
                        this.onremovestream = null;
                        this.onsignalingstatechange = null;
                        this.oniceconnectionstatechange = null;
                        this.onnegotiationneeded = null;
                        this.ondatachannel = null;
                        this.localStreams = [];
                        this.remoteStreams = [];
                        this.getLocalStreams = function() {
                            return self.localStreams
                        };
                        this.getRemoteStreams = function() {
                            return self.remoteStreams
                        };
                        this.localDescription = new RTCSessionDescription({
                            type: "",
                            sdp: ""
                        });
                        this.remoteDescription = new RTCSessionDescription({
                            type: "",
                            sdp: ""
                        });
                        this.signalingState = "stable";
                        this.iceConnectionState = "new";
                        this.iceGatheringState = "new";
                        this.iceOptions = {
                            gatherPolicy: "all",
                            iceServers: []
                        };
                        if (config && config.iceTransportPolicy) {
                            switch (config.iceTransportPolicy) {
                                case "all":
                                case "relay":
                                    this.iceOptions.gatherPolicy = config.iceTransportPolicy;
                                    break;
                                case "none":
                                    throw new TypeError('iceTransportPolicy "none" not supported');
                                default:
                                    break
                            }
                        }
                        if (config && config.iceServers) {
                            this.iceOptions.iceServers = config.iceServers.filter(function(server) {
                                if (server && server.urls) {
                                    server.urls = server.urls.filter(function(url) {
                                        return url.indexOf("turn:") === 0 && url.indexOf("transport=udp") !== -1
                                    })[0];
                                    return !!server.urls
                                }
                                return false
                            })
                        }
                        this.transceivers = [];
                        this._localIceCandidatesBuffer = []
                    };
                    window.RTCPeerConnection.prototype._emitBufferedCandidates = function() {
                        var self = this;
                        var sections = SDPUtils.splitSections(self.localDescription.sdp);
                        this._localIceCandidatesBuffer.forEach(function(event) {
                            var end = !event.candidate || Object.keys(event.candidate).length === 0;
                            if (end) {
                                for (var j = 1; j < sections.length; j++) {
                                    if (sections[j].indexOf("\r\na=end-of-candidates\r\n") === -1) {
                                        sections[j] += "a=end-of-candidates\r\n"
                                    }
                                }
                            } else if (event.candidate.candidate.indexOf("typ endOfCandidates") === -1) {
                                sections[event.candidate.sdpMLineIndex + 1] += "a=" + event.candidate.candidate + "\r\n"
                            }
                            self.localDescription.sdp = sections.join("");
                            self.dispatchEvent(event);
                            if (self.onicecandidate !== null) {
                                self.onicecandidate(event)
                            }
                            if (!event.candidate && self.iceGatheringState !== "complete") {
                                var complete = self.transceivers.every(function(transceiver) {
                                    return transceiver.iceGatherer && transceiver.iceGatherer.state === "completed"
                                });
                                if (complete) {
                                    self.iceGatheringState = "complete"
                                }
                            }
                        });
                        this._localIceCandidatesBuffer = []
                    };
                    window.RTCPeerConnection.prototype.addStream = function(stream) {
                        this.localStreams.push(stream.clone());
                        this._maybeFireNegotiationNeeded()
                    };
                    window.RTCPeerConnection.prototype.removeStream = function(stream) {
                        var idx = this.localStreams.indexOf(stream);
                        if (idx > -1) {
                            this.localStreams.splice(idx, 1);
                            this._maybeFireNegotiationNeeded()
                        }
                    };
                    window.RTCPeerConnection.prototype._getCommonCapabilities = function(localCapabilities, remoteCapabilities) {
                        var commonCapabilities = {
                            codecs: [],
                            headerExtensions: [],
                            fecMechanisms: []
                        };
                        localCapabilities.codecs.forEach(function(lCodec) {
                            for (var i = 0; i < remoteCapabilities.codecs.length; i++) {
                                var rCodec = remoteCapabilities.codecs[i];
                                if (lCodec.name.toLowerCase() === rCodec.name.toLowerCase() && lCodec.clockRate === rCodec.clockRate && lCodec.numChannels === rCodec.numChannels) {
                                    commonCapabilities.codecs.push(rCodec);
                                    break
                                }
                            }
                        });
                        localCapabilities.headerExtensions.forEach(function(lHeaderExtension) {
                            for (var i = 0; i < remoteCapabilities.headerExtensions.length; i++) {
                                var rHeaderExtension = remoteCapabilities.headerExtensions[i];
                                if (lHeaderExtension.uri === rHeaderExtension.uri) {
                                    commonCapabilities.headerExtensions.push(rHeaderExtension);
                                    break
                                }
                            }
                        });
                        return commonCapabilities
                    };
                    window.RTCPeerConnection.prototype._createIceAndDtlsTransports = function(mid, sdpMLineIndex) {
                        var self = this;
                        var iceGatherer = new RTCIceGatherer(self.iceOptions);
                        var iceTransport = new RTCIceTransport(iceGatherer);
                        iceGatherer.onlocalcandidate = function(evt) {
                            var event = new Event("icecandidate");
                            event.candidate = {
                                sdpMid: mid,
                                sdpMLineIndex: sdpMLineIndex
                            };
                            var cand = evt.candidate;
                            var end = !cand || Object.keys(cand).length === 0;
                            if (end) {
                                if (iceGatherer.state === undefined) {
                                    iceGatherer.state = "completed"
                                }
                                event.candidate.candidate = "candidate:1 1 udp 1 0.0.0.0 9 typ endOfCandidates"
                            } else {
                                cand.component = iceTransport.component === "RTCP" ? 2 : 1;
                                event.candidate.candidate = SDPUtils.writeCandidate(cand)
                            }
                            var complete = self.transceivers.every(function(transceiver) {
                                return transceiver.iceGatherer && transceiver.iceGatherer.state === "completed"
                            });
                            switch (self.iceGatheringState) {
                                case "new":
                                    self._localIceCandidatesBuffer.push(event);
                                    if (end && complete) {
                                        self._localIceCandidatesBuffer.push(new Event("icecandidate"))
                                    }
                                    break;
                                case "gathering":
                                    self._emitBufferedCandidates();
                                    self.dispatchEvent(event);
                                    if (self.onicecandidate !== null) {
                                        self.onicecandidate(event)
                                    }
                                    if (complete) {
                                        self.dispatchEvent(new Event("icecandidate"));
                                        if (self.onicecandidate !== null) {
                                            self.onicecandidate(new Event("icecandidate"))
                                        }
                                        self.iceGatheringState = "complete"
                                    }
                                    break;
                                case "complete":
                                    break;
                                default:
                                    break
                            }
                        };
                        iceTransport.onicestatechange = function() {
                            self._updateConnectionState()
                        };
                        var dtlsTransport = new RTCDtlsTransport(iceTransport);
                        dtlsTransport.ondtlsstatechange = function() {
                            self._updateConnectionState()
                        };
                        dtlsTransport.onerror = function() {
                            dtlsTransport.state = "failed";
                            self._updateConnectionState()
                        };
                        return {
                            iceGatherer: iceGatherer,
                            iceTransport: iceTransport,
                            dtlsTransport: dtlsTransport
                        }
                    };
                    window.RTCPeerConnection.prototype._transceive = function(transceiver, send, recv) {
                        var params = this._getCommonCapabilities(transceiver.localCapabilities, transceiver.remoteCapabilities);
                        if (send && transceiver.rtpSender) {
                            params.encodings = transceiver.sendEncodingParameters;
                            params.rtcp = {
                                cname: SDPUtils.localCName
                            };
                            if (transceiver.recvEncodingParameters.length) {
                                params.rtcp.ssrc = transceiver.recvEncodingParameters[0].ssrc
                            }
                            transceiver.rtpSender.send(params)
                        }
                        if (recv && transceiver.rtpReceiver) {
                            params.encodings = transceiver.recvEncodingParameters;
                            params.rtcp = {
                                cname: transceiver.cname
                            };
                            if (transceiver.sendEncodingParameters.length) {
                                params.rtcp.ssrc = transceiver.sendEncodingParameters[0].ssrc
                            }
                            transceiver.rtpReceiver.receive(params)
                        }
                    };
                    window.RTCPeerConnection.prototype.setLocalDescription = function(description) {
                        var self = this;
                        var sections;
                        var sessionpart;
                        if (description.type === "offer") {
                            if (this._pendingOffer) {
                                sections = SDPUtils.splitSections(description.sdp);
                                sessionpart = sections.shift();
                                sections.forEach(function(mediaSection, sdpMLineIndex) {
                                    var caps = SDPUtils.parseRtpParameters(mediaSection);
                                    self._pendingOffer[sdpMLineIndex].localCapabilities = caps
                                });
                                this.transceivers = this._pendingOffer;
                                delete this._pendingOffer
                            }
                        } else if (description.type === "answer") {
                            sections = SDPUtils.splitSections(self.remoteDescription.sdp);
                            sessionpart = sections.shift();
                            sections.forEach(function(mediaSection, sdpMLineIndex) {
                                var transceiver = self.transceivers[sdpMLineIndex];
                                var iceGatherer = transceiver.iceGatherer;
                                var iceTransport = transceiver.iceTransport;
                                var dtlsTransport = transceiver.dtlsTransport;
                                var localCapabilities = transceiver.localCapabilities;
                                var remoteCapabilities = transceiver.remoteCapabilities;
                                var rejected = mediaSection.split("\n", 1)[0].split(" ", 2)[1] === "0";
                                if (!rejected) {
                                    var remoteIceParameters = SDPUtils.getIceParameters(mediaSection, sessionpart);
                                    iceTransport.start(iceGatherer, remoteIceParameters, "controlled");
                                    var remoteDtlsParameters = SDPUtils.getDtlsParameters(mediaSection, sessionpart);
                                    dtlsTransport.start(remoteDtlsParameters);
                                    var params = self._getCommonCapabilities(localCapabilities, remoteCapabilities);
                                    self._transceive(transceiver, params.codecs.length > 0, false)
                                }
                            })
                        }
                        this.localDescription = {
                            type: description.type,
                            sdp: description.sdp
                        };
                        switch (description.type) {
                            case "offer":
                                this._updateSignalingState("have-local-offer");
                                break;
                            case "answer":
                                this._updateSignalingState("stable");
                                break;
                            default:
                                throw new TypeError('unsupported type "' + description.type + '"')
                        }
                        var hasCallback = arguments.length > 1 && typeof arguments[1] === "function";
                        if (hasCallback) {
                            var cb = arguments[1];
                            window.setTimeout(function() {
                                cb();
                                if (self.iceGatheringState === "new") {
                                    self.iceGatheringState = "gathering"
                                }
                                self._emitBufferedCandidates()
                            }, 0)
                        }
                        var p = Promise.resolve();
                        p.then(function() {
                            if (!hasCallback) {
                                if (self.iceGatheringState === "new") {
                                    self.iceGatheringState = "gathering"
                                }
                                window.setTimeout(self._emitBufferedCandidates.bind(self), 500)
                            }
                        });
                        return p
                    };
                    window.RTCPeerConnection.prototype.setRemoteDescription = function(description) {
                        var self = this;
                        var stream = new MediaStream;
                        var receiverList = [];
                        var sections = SDPUtils.splitSections(description.sdp);
                        var sessionpart = sections.shift();
                        sections.forEach(function(mediaSection, sdpMLineIndex) {
                            var lines = SDPUtils.splitLines(mediaSection);
                            var mline = lines[0].substr(2).split(" ");
                            var kind = mline[0];
                            var rejected = mline[1] === "0";
                            var direction = SDPUtils.getDirection(mediaSection, sessionpart);
                            var transceiver;
                            var iceGatherer;
                            var iceTransport;
                            var dtlsTransport;
                            var rtpSender;
                            var rtpReceiver;
                            var sendEncodingParameters;
                            var recvEncodingParameters;
                            var localCapabilities;
                            var track;
                            var remoteCapabilities = SDPUtils.parseRtpParameters(mediaSection);
                            var remoteIceParameters;
                            var remoteDtlsParameters;
                            if (!rejected) {
                                remoteIceParameters = SDPUtils.getIceParameters(mediaSection, sessionpart);
                                remoteDtlsParameters = SDPUtils.getDtlsParameters(mediaSection, sessionpart)
                            }
                            recvEncodingParameters = SDPUtils.parseRtpEncodingParameters(mediaSection);
                            var mid = SDPUtils.matchPrefix(mediaSection, "a=mid:");
                            if (mid.length) {
                                mid = mid[0].substr(6)
                            } else {
                                mid = SDPUtils.generateIdentifier()
                            }
                            var cname;
                            var remoteSsrc = SDPUtils.matchPrefix(mediaSection, "a=ssrc:").map(function(line) {
                                return SDPUtils.parseSsrcMedia(line)
                            }).filter(function(obj) {
                                return obj.attribute === "cname"
                            })[0];
                            if (remoteSsrc) {
                                cname = remoteSsrc.value
                            }
                            var isComplete = SDPUtils.matchPrefix(mediaSection, "a=end-of-candidates").length > 0;
                            var cands = SDPUtils.matchPrefix(mediaSection, "a=candidate:").map(function(cand) {
                                return SDPUtils.parseCandidate(cand)
                            }).filter(function(cand) {
                                return cand.component === "1"
                            });
                            if (description.type === "offer" && !rejected) {
                                var transports = self._createIceAndDtlsTransports(mid, sdpMLineIndex);
                                if (isComplete) {
                                    transports.iceTransport.setRemoteCandidates(cands)
                                }
                                localCapabilities = RTCRtpReceiver.getCapabilities(kind);
                                sendEncodingParameters = [{
                                    ssrc: (2 * sdpMLineIndex + 2) * 1001
                                }];
                                rtpReceiver = new RTCRtpReceiver(transports.dtlsTransport, kind);
                                track = rtpReceiver.track;
                                receiverList.push([track, rtpReceiver]);
                                stream.addTrack(track);
                                if (self.localStreams.length > 0 && self.localStreams[0].getTracks().length >= sdpMLineIndex) {
                                    var localtrack = self.localStreams[0].getTracks()[sdpMLineIndex];
                                    rtpSender = new RTCRtpSender(localtrack, transports.dtlsTransport)
                                }
                                self.transceivers[sdpMLineIndex] = {
                                    iceGatherer: transports.iceGatherer,
                                    iceTransport: transports.iceTransport,
                                    dtlsTransport: transports.dtlsTransport,
                                    localCapabilities: localCapabilities,
                                    remoteCapabilities: remoteCapabilities,
                                    rtpSender: rtpSender,
                                    rtpReceiver: rtpReceiver,
                                    kind: kind,
                                    mid: mid,
                                    cname: cname,
                                    sendEncodingParameters: sendEncodingParameters,
                                    recvEncodingParameters: recvEncodingParameters
                                };
                                self._transceive(self.transceivers[sdpMLineIndex], false, direction === "sendrecv" || direction === "sendonly")
                            } else if (description.type === "answer" && !rejected) {
                                transceiver = self.transceivers[sdpMLineIndex];
                                iceGatherer = transceiver.iceGatherer;
                                iceTransport = transceiver.iceTransport;
                                dtlsTransport = transceiver.dtlsTransport;
                                rtpSender = transceiver.rtpSender;
                                rtpReceiver = transceiver.rtpReceiver;
                                sendEncodingParameters = transceiver.sendEncodingParameters;
                                localCapabilities = transceiver.localCapabilities;
                                self.transceivers[sdpMLineIndex].recvEncodingParameters = recvEncodingParameters;
                                self.transceivers[sdpMLineIndex].remoteCapabilities = remoteCapabilities;
                                self.transceivers[sdpMLineIndex].cname = cname;
                                if (isComplete) {
                                    iceTransport.setRemoteCandidates(cands);

                                }
                                iceTransport.start(iceGatherer, remoteIceParameters, "controlling");
                                dtlsTransport.start(remoteDtlsParameters);
                                self._transceive(transceiver, direction === "sendrecv" || direction === "recvonly", direction === "sendrecv" || direction === "sendonly");
                                if (rtpReceiver && (direction === "sendrecv" || direction === "sendonly")) {
                                    track = rtpReceiver.track;
                                    receiverList.push([track, rtpReceiver]);
                                    stream.addTrack(track)
                                } else {
                                    delete transceiver.rtpReceiver
                                }
                            }
                        });
                        this.remoteDescription = {
                            type: description.type,
                            sdp: description.sdp
                        };
                        switch (description.type) {
                            case "offer":
                                this._updateSignalingState("have-remote-offer");
                                break;
                            case "answer":
                                this._updateSignalingState("stable");
                                break;
                            default:
                                throw new TypeError('unsupported type "' + description.type + '"')
                        }
                        if (stream.getTracks().length) {
                            self.remoteStreams.push(stream);
                            window.setTimeout(function() {
                                var event = new Event("addstream");
                                event.stream = stream;
                                self.dispatchEvent(event);
                                if (self.onaddstream !== null) {
                                    window.setTimeout(function() {
                                        self.onaddstream(event)
                                    }, 0)
                                }
                                receiverList.forEach(function(item) {
                                    var track = item[0];
                                    var receiver = item[1];
                                    var trackEvent = new Event("track");
                                    trackEvent.track = track;
                                    trackEvent.receiver = receiver;
                                    trackEvent.streams = [stream];
                                    self.dispatchEvent(event);
                                    if (self.ontrack !== null) {
                                        window.setTimeout(function() {
                                            self.ontrack(trackEvent)
                                        }, 0)
                                    }
                                })
                            }, 0)
                        }
                        if (arguments.length > 1 && typeof arguments[1] === "function") {
                            window.setTimeout(arguments[1], 0)
                        }
                        return Promise.resolve()
                    };
                    window.RTCPeerConnection.prototype.close = function() {
                        this.transceivers.forEach(function(transceiver) {
                            if (transceiver.iceTransport) {
                                transceiver.iceTransport.stop()
                            }
                            if (transceiver.dtlsTransport) {
                                transceiver.dtlsTransport.stop()
                            }
                            if (transceiver.rtpSender) {
                                transceiver.rtpSender.stop()
                            }
                            if (transceiver.rtpReceiver) {
                                transceiver.rtpReceiver.stop()
                            }
                        });
                        this._updateSignalingState("closed")
                    };
                    window.RTCPeerConnection.prototype._updateSignalingState = function(newState) {
                        this.signalingState = newState;
                        var event = new Event("signalingstatechange");
                        this.dispatchEvent(event);
                        if (this.onsignalingstatechange !== null) {
                            this.onsignalingstatechange(event)
                        }
                    };
                    window.RTCPeerConnection.prototype._maybeFireNegotiationNeeded = function() {
                        var event = new Event("negotiationneeded");
                        this.dispatchEvent(event);
                        if (this.onnegotiationneeded !== null) {
                            this.onnegotiationneeded(event)
                        }
                    };
                    window.RTCPeerConnection.prototype._updateConnectionState = function() {
                        var self = this;
                        var newState;
                        var states = {
                            "new": 0,
                            closed: 0,
                            connecting: 0,
                            checking: 0,
                            connected: 0,
                            completed: 0,
                            failed: 0
                        };
                        this.transceivers.forEach(function(transceiver) {
                            states[transceiver.iceTransport.state]++;
                            states[transceiver.dtlsTransport.state]++
                        });
                        states.connected += states.completed;
                        newState = "new";
                        if (states.failed > 0) {
                            newState = "failed"
                        } else if (states.connecting > 0 || states.checking > 0) {
                            newState = "connecting"
                        } else if (states.disconnected > 0) {
                            newState = "disconnected"
                        } else if (states.new > 0) {
                            newState = "new"
                        } else if (states.connected > 0 || states.completed > 0) {
                            newState = "connected"
                        }
                        if (newState !== self.iceConnectionState) {
                            self.iceConnectionState = newState;
                            var event = new Event("iceconnectionstatechange");
                            this.dispatchEvent(event);
                            if (this.oniceconnectionstatechange !== null) {
                                this.oniceconnectionstatechange(event)
                            }
                        }
                    };
                    window.RTCPeerConnection.prototype.createOffer = function() {
                        var self = this;
                        if (this._pendingOffer) {
                            throw new Error("createOffer called while there is a pending offer.")
                        }
                        var offerOptions;
                        if (arguments.length === 1 && typeof arguments[0] !== "function") {
                            offerOptions = arguments[0]
                        } else if (arguments.length === 3) {
                            offerOptions = arguments[2]
                        }
                        var tracks = [];
                        var numAudioTracks = 0;
                        var numVideoTracks = 0;
                        if (this.localStreams.length) {
                            numAudioTracks = this.localStreams[0].getAudioTracks().length;
                            numVideoTracks = this.localStreams[0].getVideoTracks().length
                        }
                        if (offerOptions) {
                            if (offerOptions.mandatory || offerOptions.optional) {
                                throw new TypeError("Legacy mandatory/optional constraints not supported.")
                            }
                            if (offerOptions.offerToReceiveAudio !== undefined) {
                                numAudioTracks = offerOptions.offerToReceiveAudio
                            }
                            if (offerOptions.offerToReceiveVideo !== undefined) {
                                numVideoTracks = offerOptions.offerToReceiveVideo
                            }
                        }
                        if (this.localStreams.length) {
                            this.localStreams[0].getTracks().forEach(function(track) {
                                tracks.push({
                                    kind: track.kind,
                                    track: track,
                                    wantReceive: track.kind === "audio" ? numAudioTracks > 0 : numVideoTracks > 0
                                });
                                if (track.kind === "audio") {
                                    numAudioTracks--
                                } else if (track.kind === "video") {
                                    numVideoTracks--
                                }
                            })
                        }
                        while (numAudioTracks > 0 || numVideoTracks > 0) {
                            if (numAudioTracks > 0) {
                                tracks.push({
                                    kind: "audio",
                                    wantReceive: true
                                });
                                numAudioTracks--
                            }
                            if (numVideoTracks > 0) {
                                tracks.push({
                                    kind: "video",
                                    wantReceive: true
                                });
                                numVideoTracks--
                            }
                        }
                        var sdp = SDPUtils.writeSessionBoilerplate();
                        var transceivers = [];
                        tracks.forEach(function(mline, sdpMLineIndex) {
                            var track = mline.track;
                            var kind = mline.kind;
                            var mid = SDPUtils.generateIdentifier();
                            var transports = self._createIceAndDtlsTransports(mid, sdpMLineIndex);
                            var localCapabilities = RTCRtpSender.getCapabilities(kind);
                            var rtpSender;
                            var rtpReceiver;
                            var sendEncodingParameters = [{
                                ssrc: (2 * sdpMLineIndex + 1) * 1001
                            }];
                            if (track) {
                                rtpSender = new RTCRtpSender(track, transports.dtlsTransport)
                            }
                            if (mline.wantReceive) {
                                rtpReceiver = new RTCRtpReceiver(transports.dtlsTransport, kind)
                            }
                            transceivers[sdpMLineIndex] = {
                                iceGatherer: transports.iceGatherer,
                                iceTransport: transports.iceTransport,
                                dtlsTransport: transports.dtlsTransport,
                                localCapabilities: localCapabilities,
                                remoteCapabilities: null,
                                rtpSender: rtpSender,
                                rtpReceiver: rtpReceiver,
                                kind: kind,
                                mid: mid,
                                sendEncodingParameters: sendEncodingParameters,
                                recvEncodingParameters: null
                            };
                            var transceiver = transceivers[sdpMLineIndex];
                            sdp += SDPUtils.writeMediaSection(transceiver, transceiver.localCapabilities, "offer", self.localStreams[0])
                        });
                        this._pendingOffer = transceivers;
                        var desc = new RTCSessionDescription({
                            type: "offer",
                            sdp: sdp
                        });
                        if (arguments.length && typeof arguments[0] === "function") {
                            window.setTimeout(arguments[0], 0, desc)
                        }
                        return Promise.resolve(desc)
                    };
                    window.RTCPeerConnection.prototype.createAnswer = function() {
                        var self = this;
                        var sdp = SDPUtils.writeSessionBoilerplate();
                        this.transceivers.forEach(function(transceiver) {
                            var commonCapabilities = self._getCommonCapabilities(transceiver.localCapabilities, transceiver.remoteCapabilities);
                            sdp += SDPUtils.writeMediaSection(transceiver, commonCapabilities, "answer", self.localStreams[0])
                        });
                        var desc = new RTCSessionDescription({
                            type: "answer",
                            sdp: sdp
                        });
                        if (arguments.length && typeof arguments[0] === "function") {
                            window.setTimeout(arguments[0], 0, desc)
                        }
                        return Promise.resolve(desc)
                    };
                    window.RTCPeerConnection.prototype.addIceCandidate = function(candidate) {
                        var mLineIndex = candidate.sdpMLineIndex;
                        if (candidate.sdpMid) {
                            for (var i = 0; i < this.transceivers.length; i++) {
                                if (this.transceivers[i].mid === candidate.sdpMid) {
                                    mLineIndex = i;
                                    break
                                }
                            }
                        }
                        var transceiver = this.transceivers[mLineIndex];
                        if (transceiver) {
                            var cand = Object.keys(candidate.candidate).length > 0 ? SDPUtils.parseCandidate(candidate.candidate) : {};
                            if (cand.protocol === "tcp" && cand.port === 0) {
                                return
                            }
                            if (cand.component !== "1") {
                                return
                            }
                            if (cand.type === "endOfCandidates") {
                                cand = {}
                            }
                            transceiver.iceTransport.addRemoteCandidate(cand);
                            var sections = SDPUtils.splitSections(this.remoteDescription.sdp);
                            sections[mLineIndex + 1] += (cand.type ? candidate.candidate.trim() : "a=end-of-candidates") + "\r\n";
                            this.remoteDescription.sdp = sections.join("")
                        }
                        if (arguments.length > 1 && typeof arguments[1] === "function") {
                            window.setTimeout(arguments[1], 0)
                        }
                        return Promise.resolve()
                    };
                    window.RTCPeerConnection.prototype.getStats = function() {
                        var promises = [];
                        this.transceivers.forEach(function(transceiver) {
                            ["rtpSender", "rtpReceiver", "iceGatherer", "iceTransport", "dtlsTransport"].forEach(function(method) {
                                if (transceiver[method]) {
                                    promises.push(transceiver[method].getStats())
                                }
                            })
                        });
                        var cb = arguments.length > 1 && typeof arguments[1] === "function" && arguments[1];
                        return new Promise(function(resolve) {
                            var results = {};
                            Promise.all(promises).then(function(res) {
                                res.forEach(function(result) {
                                    Object.keys(result).forEach(function(id) {
                                        results[id] = result[id]
                                    })
                                });
                                if (cb) {
                                    window.setTimeout(cb, 0, results)
                                }
                                resolve(results)
                            })
                        })
                    }
                },
                attachMediaStream: function(element, stream) {
                    logging("DEPRECATED, attachMediaStream will soon be removed.");
                    element.srcObject = stream
                },
                reattachMediaStream: function(to, from) {
                    logging("DEPRECATED, reattachMediaStream will soon be removed.");
                    to.srcObject = from.srcObject
                }
            };
            module.exports = {
                shimPeerConnection: edgeShim.shimPeerConnection,
                attachMediaStream: edgeShim.attachMediaStream,
                reattachMediaStream: edgeShim.reattachMediaStream
            }
        }, {
            "../utils": 9,
            "./edge_sdp": 4
        }],
        6: [function(require, module, exports) {
            "use strict";
            var logging = require("../utils").log;
            var browserDetails = require("../utils").browserDetails;
            var firefoxShim = {
                shimOnTrack: function() {
                    if (typeof window === "object" && window.RTCPeerConnection && !("ontrack" in window.RTCPeerConnection.prototype)) {
                        Object.defineProperty(window.RTCPeerConnection.prototype, "ontrack", {
                            get: function() {
                                return this._ontrack
                            },
                            set: function(f) {
                                if (this._ontrack) {
                                    this.removeEventListener("track", this._ontrack);
                                    this.removeEventListener("addstream", this._ontrackpoly)
                                }
                                this.addEventListener("track", this._ontrack = f);
                                this.addEventListener("addstream", this._ontrackpoly = function(e) {
                                    e.stream.getTracks().forEach(function(track) {
                                        var event = new Event("track");
                                        event.track = track;
                                        event.receiver = {
                                            track: track
                                        };
                                        event.streams = [e.stream];
                                        this.dispatchEvent(event)
                                    }.bind(this))
                                }.bind(this))
                            }
                        })
                    }
                },
                shimSourceObject: function() {
                    if (typeof window === "object") {
                        if (window.HTMLMediaElement && !("srcObject" in window.HTMLMediaElement.prototype)) {
                            Object.defineProperty(window.HTMLMediaElement.prototype, "srcObject", {
                                get: function() {
                                    return this.mozSrcObject
                                },
                                set: function(stream) {
                                    this.mozSrcObject = stream
                                }
                            })
                        }
                    }
                },
                shimPeerConnection: function() {
                    if (!window.RTCPeerConnection) {
                        window.RTCPeerConnection = function(pcConfig, pcConstraints) {
                            if (browserDetails.version < 38) {
                                if (pcConfig && pcConfig.iceServers) {
                                    var newIceServers = [];
                                    for (var i = 0; i < pcConfig.iceServers.length; i++) {
                                        var server = pcConfig.iceServers[i];
                                        if (server.hasOwnProperty("urls")) {
                                            for (var j = 0; j < server.urls.length; j++) {
                                                var newServer = {
                                                    url: server.urls[j]
                                                };
                                                if (server.urls[j].indexOf("turn") === 0) {
                                                    newServer.username = server.username;
                                                    newServer.credential = server.credential
                                                }
                                                newIceServers.push(newServer)
                                            }
                                        } else {
                                            newIceServers.push(pcConfig.iceServers[i])
                                        }
                                    }
                                    pcConfig.iceServers = newIceServers
                                }
                            }
                            return new mozRTCPeerConnection(pcConfig, pcConstraints)
                        };
                        window.RTCPeerConnection.prototype = mozRTCPeerConnection.prototype;
                        if (mozRTCPeerConnection.generateCertificate) {
                            Object.defineProperty(window.RTCPeerConnection, "generateCertificate", {
                                get: function() {
                                    return mozRTCPeerConnection.generateCertificate
                                }
                            })
                        }
                        window.RTCSessionDescription = mozRTCSessionDescription;
                        window.RTCIceCandidate = mozRTCIceCandidate
                    }["setLocalDescription", "setRemoteDescription", "addIceCandidate"].forEach(function(method) {
                        var nativeMethod = RTCPeerConnection.prototype[method];
                        RTCPeerConnection.prototype[method] = function() {
                            arguments[0] = new(method === "addIceCandidate" ? RTCIceCandidate : RTCSessionDescription)(arguments[0]);
                            return nativeMethod.apply(this, arguments)
                        }
                    })
                },
                shimGetUserMedia: function() {
                    var getUserMedia_ = function(constraints, onSuccess, onError) {
                        var constraintsToFF37_ = function(c) {
                            if (typeof c !== "object" || c.require) {
                                return c
                            }
                            var require = [];
                            Object.keys(c).forEach(function(key) {
                                if (key === "require" || key === "advanced" || key === "mediaSource") {
                                    return
                                }
                                var r = c[key] = typeof c[key] === "object" ? c[key] : {
                                    ideal: c[key]
                                };
                                if (r.min !== undefined || r.max !== undefined || r.exact !== undefined) {
                                    require.push(key)
                                }
                                if (r.exact !== undefined) {
                                    if (typeof r.exact === "number") {
                                        r.min = r.max = r.exact
                                    } else {
                                        c[key] = r.exact
                                    }
                                    delete r.exact
                                }
                                if (r.ideal !== undefined) {
                                    c.advanced = c.advanced || [];
                                    var oc = {};
                                    if (typeof r.ideal === "number") {
                                        oc[key] = {
                                            min: r.ideal,
                                            max: r.ideal
                                        }
                                    } else {
                                        oc[key] = r.ideal
                                    }
                                    c.advanced.push(oc);
                                    delete r.ideal;
                                    if (!Object.keys(r).length) {
                                        delete c[key]
                                    }
                                }
                            });
                            if (require.length) {
                                c.require = require
                            }
                            return c
                        };
                        constraints = JSON.parse(JSON.stringify(constraints));
                        if (browserDetails.version < 38) {
                            logging("spec: " + JSON.stringify(constraints));
                            if (constraints.audio) {
                                constraints.audio = constraintsToFF37_(constraints.audio)
                            }
                            if (constraints.video) {
                                constraints.video = constraintsToFF37_(constraints.video)
                            }
                            logging("ff37: " + JSON.stringify(constraints))
                        }
                        return navigator.mozGetUserMedia(constraints, onSuccess, onError)
                    };
                    navigator.getUserMedia = getUserMedia_;
                    var getUserMediaPromise_ = function(constraints) {
                        return new Promise(function(resolve, reject) {
                            navigator.getUserMedia(constraints, resolve, reject)
                        })
                    };
                    if (!navigator.mediaDevices) {
                        navigator.mediaDevices = {
                            getUserMedia: getUserMediaPromise_,
                            addEventListener: function() {},
                            removeEventListener: function() {}
                        }
                    }
                    navigator.mediaDevices.enumerateDevices = navigator.mediaDevices.enumerateDevices || function() {
                        return new Promise(function(resolve) {
                            var infos = [{
                                kind: "audioinput",
                                deviceId: "default",
                                label: "",
                                groupId: ""
                            }, {
                                kind: "videoinput",
                                deviceId: "default",
                                label: "",
                                groupId: ""
                            }];
                            resolve(infos)
                        })
                    };
                    if (browserDetails.version < 41) {
                        var orgEnumerateDevices = navigator.mediaDevices.enumerateDevices.bind(navigator.mediaDevices);
                        navigator.mediaDevices.enumerateDevices = function() {
                            return orgEnumerateDevices().then(undefined, function(e) {
                                if (e.name === "NotFoundError") {
                                    return []
                                }
                                throw e
                            })
                        }
                    }
                },
                attachMediaStream: function(element, stream) {
                    logging("DEPRECATED, attachMediaStream will soon be removed.");
                    element.srcObject = stream
                },
                reattachMediaStream: function(to, from) {
                    logging("DEPRECATED, reattachMediaStream will soon be removed.");
                    to.srcObject = from.srcObject
                }
            };
            module.exports = {
                shimOnTrack: firefoxShim.shimOnTrack,
                shimSourceObject: firefoxShim.shimSourceObject,
                shimPeerConnection: firefoxShim.shimPeerConnection,
                shimGetUserMedia: require("./getusermedia"),
                attachMediaStream: firefoxShim.attachMediaStream,
                reattachMediaStream: firefoxShim.reattachMediaStream
            }
        }, {
            "../utils": 9,
            "./getusermedia": 7
        }],
        7: [function(require, module, exports) {
            "use strict";
            var logging = require("../utils").log;
            var browserDetails = require("../utils").browserDetails;
            module.exports = function() {
                var getUserMedia_ = function(constraints, onSuccess, onError) {
                    var constraintsToFF37_ = function(c) {
                        if (typeof c !== "object" || c.require) {
                            return c
                        }
                        var require = [];
                        Object.keys(c).forEach(function(key) {
                            if (key === "require" || key === "advanced" || key === "mediaSource") {
                                return
                            }
                            var r = c[key] = typeof c[key] === "object" ? c[key] : {
                                ideal: c[key]
                            };
                            if (r.min !== undefined || r.max !== undefined || r.exact !== undefined) {
                                require.push(key)
                            }
                            if (r.exact !== undefined) {
                                if (typeof r.exact === "number") {
                                    r.min = r.max = r.exact
                                } else {
                                    c[key] = r.exact
                                }
                                delete r.exact
                            }
                            if (r.ideal !== undefined) {
                                c.advanced = c.advanced || [];
                                var oc = {};
                                if (typeof r.ideal === "number") {
                                    oc[key] = {
                                        min: r.ideal,
                                        max: r.ideal
                                    }
                                } else {
                                    oc[key] = r.ideal
                                }
                                c.advanced.push(oc);
                                delete r.ideal;
                                if (!Object.keys(r).length) {
                                    delete c[key]
                                }
                            }
                        });
                        if (require.length) {
                            c.require = require
                        }
                        return c
                    };
                    constraints = JSON.parse(JSON.stringify(constraints));
                    if (browserDetails.version < 38) {
                        logging("spec: " + JSON.stringify(constraints));
                        if (constraints.audio) {
                            constraints.audio = constraintsToFF37_(constraints.audio)
                        }
                        if (constraints.video) {
                            constraints.video = constraintsToFF37_(constraints.video)
                        }
                        logging("ff37: " + JSON.stringify(constraints))
                    }
                    return navigator.mozGetUserMedia(constraints, onSuccess, onError)
                };
                navigator.getUserMedia = getUserMedia_;
                var getUserMediaPromise_ = function(constraints) {
                    return new Promise(function(resolve, reject) {
                        navigator.getUserMedia(constraints, resolve, reject)
                    })
                };
                if (!navigator.mediaDevices) {
                    navigator.mediaDevices = {
                        getUserMedia: getUserMediaPromise_,
                        addEventListener: function() {},
                        removeEventListener: function() {}
                    }
                }
                navigator.mediaDevices.enumerateDevices = navigator.mediaDevices.enumerateDevices || function() {
                    return new Promise(function(resolve) {
                        var infos = [{
                            kind: "audioinput",
                            deviceId: "default",
                            label: "",
                            groupId: ""
                        }, {
                            kind: "videoinput",
                            deviceId: "default",
                            label: "",
                            groupId: ""
                        }];
                        resolve(infos)
                    })
                };
                if (browserDetails.version < 41) {
                    var orgEnumerateDevices = navigator.mediaDevices.enumerateDevices.bind(navigator.mediaDevices);
                    navigator.mediaDevices.enumerateDevices = function() {
                        return orgEnumerateDevices().then(undefined, function(e) {
                            if (e.name === "NotFoundError") {
                                return []
                            }
                            throw e
                        })
                    }
                }
            }
        }, {
            "../utils": 9
        }],
        8: [function(require, module, exports) {
            "use strict";
            var safariShim = {
                shimGetUserMedia: function() {
                    navigator.getUserMedia = navigator.webkitGetUserMedia
                }
            };
            module.exports = {
                shimGetUserMedia: safariShim.shimGetUserMedia
            }
        }, {}],
        9: [function(require, module, exports) {
            "use strict";
            var logDisabled_ = false;
            var utils = {
                disableLog: function(bool) {
                    if (typeof bool !== "boolean") {
                        return new Error("Argument type: " + typeof bool + ". Please use a boolean.")
                    }
                    logDisabled_ = bool;
                    return bool ? "adapter.js logging disabled" : "adapter.js logging enabled"
                },
                log: function() {
                    if (typeof window === "object") {
                        if (logDisabled_) {
                            return
                        }
                        if (typeof console !== "undefined" && typeof console.log === "function") {
                            console.log.apply(console, arguments)
                        }
                    }
                },
                extractVersion: function(uastring, expr, pos) {
                    var match = uastring.match(expr);
                    return match && match.length >= pos && parseInt(match[pos], 10)
                },
                detectBrowser: function() {
                    var result = {};
                    result.browser = null;
                    result.version = null;
                    result.minVersion = null;
                    if (typeof window === "undefined" || !window.navigator) {
                        result.browser = "Not a browser.";
                        return result
                    }
                    if (navigator.mozGetUserMedia) {
                        result.browser = "firefox";
                        result.version = this.extractVersion(navigator.userAgent, /Firefox\/([0-9]+)\./, 1);
                        result.minVersion = 31
                    } else if (navigator.webkitGetUserMedia) {
                        if (window.webkitRTCPeerConnection) {
                            result.browser = "chrome";
                            result.version = this.extractVersion(navigator.userAgent, /Chrom(e|ium)\/([0-9]+)\./, 2);
                            result.minVersion = 38
                        } else {
                            if (navigator.userAgent.match(/Version\/(\d+).(\d+)/)) {
                                result.browser = "safari";
                                result.version = this.extractVersion(navigator.userAgent, /AppleWebKit\/([0-9]+)\./, 1);
                                result.minVersion = 602
                            } else {
                                result.browser = "Unsupported webkit-based browser " + "with GUM support but no WebRTC support.";
                                return result
                            }
                        }
                    } else if (navigator.mediaDevices && navigator.userAgent.match(/Edge\/(\d+).(\d+)$/)) {
                        result.browser = "edge";
                        result.version = this.extractVersion(navigator.userAgent, /Edge\/(\d+).(\d+)$/, 2);
                        result.minVersion = 10547
                    } else {
                        result.browser = "Not a supported browser.";
                        return result
                    }
                    if (result.version < result.minVersion) {
                        utils.log("Browser: " + result.browser + " Version: " + result.version + " < minimum supported version: " + result.minVersion + "\n some things might not work!")
                    }
                    return result
                }
            };
            module.exports = {
                log: utils.log,
                disableLog: utils.disableLog,
                browserDetails: utils.detectBrowser(),
                extractVersion: utils.extractVersion
            }
        }, {}]
    }, {}, [1])(1)
});

/*! LAB.js (LABjs :: Loading And Blocking JavaScript)
    v2.0.3 (c) Kyle Simpson
    MIT License
*/
(function(o) {
    var K = o.$LAB,
        y = "UseLocalXHR",
        z = "AlwaysPreserveOrder",
        u = "AllowDuplicates",
        A = "CacheBust",
        B = "BasePath",
        C = /^[^?#]*\//.exec(location.href)[0],
        D = /^\w+\:\/\/\/?[^\/]+/.exec(C)[0],
        i = document.head || document.getElementsByTagName("head"),
        L = (o.opera && Object.prototype.toString.call(o.opera) == "[object Opera]") || ("MozAppearance" in document.documentElement.style),
        q = document.createElement("script"),
        E = typeof q.preload == "boolean",
        r = E || (q.readyState && q.readyState == "uninitialized"),
        F = !r && q.async === true,
        M = !r && !F && !L;

    function G(a) {
        return Object.prototype.toString.call(a) == "[object Function]"
    }

    function H(a) {
        return Object.prototype.toString.call(a) == "[object Array]"
    }

    function N(a, c) {
        var b = /^\w+\:\/\//;
        if (/^\/\/\/?/.test(a)) {
            a = location.protocol + a
        } else if (!b.test(a) && a.charAt(0) != "/") {
            a = (c || "") + a
        }
        return b.test(a) ? a : ((a.charAt(0) == "/" ? D : C) + a)
    }

    function s(a, c) {
        for (var b in a) {
            if (a.hasOwnProperty(b)) {
                c[b] = a[b]
            }
        }
        return c
    }

    function O(a) {
        var c = false;
        for (var b = 0; b < a.scripts.length; b++) {
            if (a.scripts[b].ready && a.scripts[b].exec_trigger) {
                c = true;
                a.scripts[b].exec_trigger();
                a.scripts[b].exec_trigger = null
            }
        }
        return c
    }

    function t(a, c, b, d) {
        a.onload = a.onreadystatechange = function() {
            if ((a.readyState && a.readyState != "complete" && a.readyState != "loaded") || c[b]) return;
            a.onload = a.onreadystatechange = null;
            d()
        }
    }

    function I(a) {
        a.ready = a.finished = true;
        for (var c = 0; c < a.finished_listeners.length; c++) {
            a.finished_listeners[c]()
        }
        a.ready_listeners = [];
        a.finished_listeners = []
    }

    function P(d, f, e, g, h) {
        setTimeout(function() {
            var a, c = f.real_src,
                b;
            if ("item" in i) {
                if (!i[0]) {
                    setTimeout(arguments.callee, 25);
                    return
                }
                i = i[0]
            }
            a = document.createElement("script");
            if (f.type) a.type = f.type;
            if (f.charset) a.charset = f.charset;
            if (h) {
                if (r) {
                    e.elem = a;
                    if (E) {
                        a.preload = true;
                        a.onpreload = g
                    } else {
                        a.onreadystatechange = function() {
                            if (a.readyState == "loaded") g()
                        }
                    }
                    a.src = c
                } else if (h && c.indexOf(D) == 0 && d[y]) {
                    b = new XMLHttpRequest();
                    b.onreadystatechange = function() {
                        if (b.readyState == 4) {
                            b.onreadystatechange = function() {};
                            e.text = b.responseText + "\n//@ sourceURL=" + c;
                            g()
                        }
                    };
                    b.open("GET", c);
                    b.send()
                } else {
                    a.type = "text/cache-script";
                    t(a, e, "ready", function() {
                        i.removeChild(a);
                        g()
                    });
                    a.src = c;
                    i.insertBefore(a, i.firstChild)
                }
            } else if (F) {
                a.async = false;
                t(a, e, "finished", g);
                a.src = c;
                i.insertBefore(a, i.firstChild)
            } else {
                t(a, e, "finished", g);
                a.src = c;
                i.insertBefore(a, i.firstChild)
            }
        }, 0)
    }

    function J() {
        var l = {},
            Q = r || M,
            n = [],
            p = {},
            m;
        l[y] = true;
        l[z] = false;
        l[u] = false;
        l[A] = false;
        l[B] = "";

        function R(a, c, b) {
            var d;

            function f() {
                if (d != null) {
                    d = null;
                    I(b)
                }
            }
            if (p[c.src].finished) return;
            if (!a[u]) p[c.src].finished = true;
            d = b.elem || document.createElement("script");
            if (c.type) d.type = c.type;
            if (c.charset) d.charset = c.charset;
            t(d, b, "finished", f);
            if (b.elem) {
                b.elem = null
            } else if (b.text) {
                d.onload = d.onreadystatechange = null;
                d.text = b.text
            } else {
                d.src = c.real_src
            }
            i.insertBefore(d, i.firstChild);
            if (b.text) {
                f()
            }
        }

        function S(c, b, d, f) {
            var e, g, h = function() {
                    b.ready_cb(b, function() {
                        R(c, b, e)
                    })
                },
                j = function() {
                    b.finished_cb(b, d)
                };
            b.src = N(b.src, c[B]);
            b.real_src = b.src + (c[A] ? ((/\?.*$/.test(b.src) ? "&_" : "?_") + ~~(Math.random() * 1E9) + "=") : "");
            if (!p[b.src]) p[b.src] = {
                items: [],
                finished: false
            };
            g = p[b.src].items;
            if (c[u] || g.length == 0) {
                e = g[g.length] = {
                    ready: false,
                    finished: false,
                    ready_listeners: [h],
                    finished_listeners: [j]
                };
                P(c, b, e, ((f) ? function() {
                    e.ready = true;
                    for (var a = 0; a < e.ready_listeners.length; a++) {
                        e.ready_listeners[a]()
                    }
                    e.ready_listeners = []
                } : function() {
                    I(e)
                }), f)
            } else {
                e = g[0];
                if (e.finished) {
                    j()
                } else {
                    e.finished_listeners.push(j)
                }
            }
        }

        function v() {
            var e, g = s(l, {}),
                h = [],
                j = 0,
                w = false,
                k;

            function T(a, c) {
                a.ready = true;
                a.exec_trigger = c;
                x()
            }

            function U(a, c) {
                a.ready = a.finished = true;
                a.exec_trigger = null;
                for (var b = 0; b < c.scripts.length; b++) {
                    if (!c.scripts[b].finished) return
                }
                c.finished = true;
                x()
            }

            function x() {
                while (j < h.length) {
                    if (G(h[j])) {
                        try {
                            h[j++]()
                        } catch (err) {}
                        continue
                    } else if (!h[j].finished) {
                        if (O(h[j])) continue;
                        break
                    }
                    j++
                }
                if (j == h.length) {
                    w = false;
                    k = false
                }
            }

            function V() {
                if (!k || !k.scripts) {
                    h.push(k = {
                        scripts: [],
                        finished: true
                    })
                }
            }
            e = {
                script: function() {
                    for (var f = 0; f < arguments.length; f++) {
                        (function(a, c) {
                            var b;
                            if (!H(a)) {
                                c = [a]
                            }
                            for (var d = 0; d < c.length; d++) {
                                V();
                                a = c[d];
                                if (G(a)) a = a();
                                if (!a) continue;
                                if (H(a)) {
                                    b = [].slice.call(a);
                                    b.unshift(d, 1);
                                    [].splice.apply(c, b);
                                    d--;
                                    continue
                                }
                                if (typeof a == "string") a = {
                                    src: a
                                };
                                a = s(a, {
                                    ready: false,
                                    ready_cb: T,
                                    finished: false,
                                    finished_cb: U
                                });
                                k.finished = false;
                                k.scripts.push(a);
                                S(g, a, k, (Q && w));
                                w = true;
                                if (g[z]) e.wait()
                            }
                        })(arguments[f], arguments[f])
                    }
                    return e
                },
                wait: function() {
                    if (arguments.length > 0) {
                        for (var a = 0; a < arguments.length; a++) {
                            h.push(arguments[a])
                        }
                        k = h[h.length - 1]
                    } else k = false;
                    x();
                    return e
                }
            };
            return {
                script: e.script,
                wait: e.wait,
                setOptions: function(a) {
                    s(a, g);
                    return e
                }
            }
        }
        m = {
            setGlobalDefaults: function(a) {
                s(a, l);
                return m
            },
            setOptions: function() {
                return v().setOptions.apply(null, arguments)
            },
            script: function() {
                return v().script.apply(null, arguments)
            },
            wait: function() {
                return v().wait.apply(null, arguments)
            },
            queueScript: function() {
                n[n.length] = {
                    type: "script",
                    args: [].slice.call(arguments)
                };
                return m
            },
            queueWait: function() {
                n[n.length] = {
                    type: "wait",
                    args: [].slice.call(arguments)
                };
                return m
            },
            runQueue: function() {
                var a = m,
                    c = n.length,
                    b = c,
                    d;
                for (; --b >= 0;) {
                    d = n.shift();
                    a = a[d.type].apply(null, d.args)
                }
                return a
            },
            noConflict: function() {
                o.$LAB = K;
                return m
            },
            sandbox: function() {
                return J()
            }
        };
        return m
    }
    o.$LAB = J();
    (function(a, c, b) {
        if (document.readyState == null && document[a]) {
            document.readyState = "loading";
            document[a](c, b = function() {
                document.removeEventListener(c, b, false);
                document.readyState = "complete"
            }, false)
        }
    })("addEventListener", "DOMContentLoaded")
})(this);
! function(i, s) {
    "use strict";
    var e = "0.7.10",
        o = "",
        r = "?",
        n = "function",
        a = "undefined",
        t = "object",
        w = "string",
        l = "major",
        d = "model",
        p = "name",
        c = "type",
        u = "vendor",
        m = "version",
        f = "architecture",
        b = "console",
        g = "mobile",
        h = "tablet",
        v = "smarttv",
        x = "wearable",
        y = "embedded",
        k = {
            extend: function(i, s) {
                var e = {};
                for (var o in i) s[o] && s[o].length % 2 === 0 ? e[o] = s[o].concat(i[o]) : e[o] = i[o];
                return e
            },
            has: function(i, s) {
                return "string" == typeof i ? -1 !== s.toLowerCase().indexOf(i.toLowerCase()) : !1
            },
            lowerize: function(i) {
                return i.toLowerCase()
            },
            major: function(i) {
                return typeof i === w ? i.split(".")[0] : s
            }
        },
        A = {
            rgx: function() {
                for (var i, e, o, r, w, l, d, p = 0, c = arguments; p < c.length && !l;) {
                    var u = c[p],
                        m = c[p + 1];
                    if (typeof i === a) {
                        i = {};
                        for (r in m) m.hasOwnProperty(r) && (w = m[r], typeof w === t ? i[w[0]] = s : i[w] = s)
                    }
                    for (e = o = 0; e < u.length && !l;)
                        if (l = u[e++].exec(this.getUA()))
                            for (r = 0; r < m.length; r++) d = l[++o], w = m[r], typeof w === t && w.length > 0 ? 2 == w.length ? typeof w[1] == n ? i[w[0]] = w[1].call(this, d) : i[w[0]] = w[1] : 3 == w.length ? typeof w[1] !== n || w[1].exec && w[1].test ? i[w[0]] = d ? d.replace(w[1], w[2]) : s : i[w[0]] = d ? w[1].call(this, d, w[2]) : s : 4 == w.length && (i[w[0]] = d ? w[3].call(this, d.replace(w[1], w[2])) : s) : i[w] = d ? d : s;
                    p += 2
                }
                return i
            },
            str: function(i, e) {
                for (var o in e)
                    if (typeof e[o] === t && e[o].length > 0) {
                        for (var n = 0; n < e[o].length; n++)
                            if (k.has(e[o][n], i)) return o === r ? s : o
                    } else if (k.has(e[o], i)) return o === r ? s : o;
                return i
            }
        },
        S = {
            browser: {
                oldsafari: {
                    version: {
                        "1.0": "/8",
                        1.2: "/1",
                        1.3: "/3",
                        "2.0": "/412",
                        "2.0.2": "/416",
                        "2.0.3": "/417",
                        "2.0.4": "/419",
                        "?": "/"
                    }
                }
            },
            device: {
                amazon: {
                    model: {
                        "Fire Phone": ["SD", "KF"]
                    }
                },
                sprint: {
                    model: {
                        "Evo Shift 4G": "7373KT"
                    },
                    vendor: {
                        HTC: "APA",
                        Sprint: "Sprint"
                    }
                }
            },
            os: {
                windows: {
                    version: {
                        ME: "4.90",
                        "NT 3.11": "NT3.51",
                        "NT 4.0": "NT4.0",
                        2000: "NT 5.0",
                        XP: ["NT 5.1", "NT 5.2"],
                        Vista: "NT 6.0",
                        7: "NT 6.1",
                        8: "NT 6.2",
                        8.1: "NT 6.3",
                        10: ["NT 6.4", "NT 10.0"],
                        RT: "ARM"
                    }
                }
            }
        },
        E = {
            browser: [
                [/(opera\smini)\/([\w\.-]+)/i, /(opera\s[mobiletab]+).+version\/([\w\.-]+)/i, /(opera).+version\/([\w\.]+)/i, /(opera)[\/\s]+([\w\.]+)/i],
                [p, m],
                [/(OPiOS)[\/\s]+([\w\.]+)/i],
                [
                    [p, "Opera Mini"], m
                ],
                [/\s(opr)\/([\w\.]+)/i],
                [
                    [p, "Opera"], m
                ],
                [/(kindle)\/([\w\.]+)/i, /(lunascape|maxthon|netfront|jasmine|blazer)[\/\s]?([\w\.]+)*/i, /(avant\s|iemobile|slim|baidu)(?:browser)?[\/\s]?([\w\.]*)/i, /(?:ms|\()(ie)\s([\w\.]+)/i, /(rekonq)\/([\w\.]+)*/i, /(chromium|flock|rockmelt|midori|epiphany|silk|skyfire|ovibrowser|bolt|iron|vivaldi|iridium|phantomjs)\/([\w\.-]+)/i],
                [p, m],
                [/(trident).+rv[:\s]([\w\.]+).+like\sgecko/i],
                [
                    [p, "IE"], m
                ],
                [/(edge)\/((\d+)?[\w\.]+)/i],
                [p, m],
                [/(yabrowser)\/([\w\.]+)/i],
                [
                    [p, "Yandex"], m
                ],
                [/(comodo_dragon)\/([\w\.]+)/i],
                [
                    [p, /_/g, " "], m
                ],
                [/(chrome|omniweb|arora|[tizenoka]{5}\s?browser)\/v?([\w\.]+)/i, /(qqbrowser)[\/\s]?([\w\.]+)/i],
                [p, m],
                [/(uc\s?browser)[\/\s]?([\w\.]+)/i, /ucweb.+(ucbrowser)[\/\s]?([\w\.]+)/i, /JUC.+(ucweb)[\/\s]?([\w\.]+)/i],
                [
                    [p, "UCBrowser"], m
                ],
                [/(dolfin)\/([\w\.]+)/i],
                [
                    [p, "Dolphin"], m
                ],
                [/((?:android.+)crmo|crios)\/([\w\.]+)/i],
                [
                    [p, "Chrome"], m
                ],
                [/XiaoMi\/MiuiBrowser\/([\w\.]+)/i],
                [m, [p, "MIUI Browser"]],
                [/android.+version\/([\w\.]+)\s+(?:mobile\s?safari|safari)/i],
                [m, [p, "Android Browser"]],
                [/FBAV\/([\w\.]+);/i],
                [m, [p, "Facebook"]],
                [/fxios\/([\w\.-]+)/i],
                [m, [p, "Firefox"]],
                [/version\/([\w\.]+).+?mobile\/\w+\s(safari)/i],
                [m, [p, "Mobile Safari"]],
                [/version\/([\w\.]+).+?(mobile\s?safari|safari)/i],
                [m, p],
                [/webkit.+?(mobile\s?safari|safari)(\/[\w\.]+)/i],
                [p, [m, A.str, S.browser.oldsafari.version]],
                [/(konqueror)\/([\w\.]+)/i, /(webkit|khtml)\/([\w\.]+)/i],
                [p, m],
                [/(navigator|netscape)\/([\w\.-]+)/i],
                [
                    [p, "Netscape"], m
                ],
                [/(swiftfox)/i, /(icedragon|iceweasel|camino|chimera|fennec|maemo\sbrowser|minimo|conkeror)[\/\s]?([\w\.\+]+)/i, /(firefox|seamonkey|k-meleon|icecat|iceape|firebird|phoenix)\/([\w\.-]+)/i, /(mozilla)\/([\w\.]+).+rv\:.+gecko\/\d+/i, /(polaris|lynx|dillo|icab|doris|amaya|w3m|netsurf|sleipnir)[\/\s]?([\w\.]+)/i, /(links)\s\(([\w\.]+)/i, /(gobrowser)\/?([\w\.]+)*/i, /(ice\s?browser)\/v?([\w\._]+)/i, /(mosaic)[\/\s]([\w\.]+)/i],
                [p, m]
            ],
            cpu: [
                [/(?:(amd|x(?:(?:86|64)[_-])?|wow|win)64)[;\)]/i],
                [
                    [f, "amd64"]
                ],
                [/(ia32(?=;))/i],
                [
                    [f, k.lowerize]
                ],
                [/((?:i[346]|x)86)[;\)]/i],
                [
                    [f, "ia32"]
                ],
                [/windows\s(ce|mobile);\sppc;/i],
                [
                    [f, "arm"]
                ],
                [/((?:ppc|powerpc)(?:64)?)(?:\smac|;|\))/i],
                [
                    [f, /ower/, "", k.lowerize]
                ],
                [/(sun4\w)[;\)]/i],
                [
                    [f, "sparc"]
                ],
                [/((?:avr32|ia64(?=;))|68k(?=\))|arm(?:64|(?=v\d+;))|(?=atmel\s)avr|(?:irix|mips|sparc)(?:64)?(?=;)|pa-risc)/i],
                [
                    [f, k.lowerize]
                ]
            ],
            device: [
                [/\((ipad|playbook);[\w\s\);-]+(rim|apple)/i],
                [d, u, [c, h]],
                [/applecoremedia\/[\w\.]+ \((ipad)/],
                [d, [u, "Apple"],
                    [c, h]
                ],
                [/(apple\s{0,1}tv)/i],
                [
                    [d, "Apple TV"],
                    [u, "Apple"]
                ],
                [/(archos)\s(gamepad2?)/i, /(hp).+(touchpad)/i, /(kindle)\/([\w\.]+)/i, /\s(nook)[\w\s]+build\/(\w+)/i, /(dell)\s(strea[kpr\s\d]*[\dko])/i],
                [u, d, [c, h]],
                [/(kf[A-z]+)\sbuild\/[\w\.]+.*silk\//i],
                [d, [u, "Amazon"],
                    [c, h]
                ],
                [/(sd|kf)[0349hijorstuw]+\sbuild\/[\w\.]+.*silk\//i],
                [
                    [d, A.str, S.device.amazon.model],
                    [u, "Amazon"],
                    [c, g]
                ],
                [/\((ip[honed|\s\w*]+);.+(apple)/i],
                [d, u, [c, g]],
                [/\((ip[honed|\s\w*]+);/i],
                [d, [u, "Apple"],
                    [c, g]
                ],
                [/(blackberry)[\s-]?(\w+)/i, /(blackberry|benq|palm(?=\-)|sonyericsson|acer|asus|dell|huawei|meizu|motorola|polytron)[\s_-]?([\w-]+)*/i, /(hp)\s([\w\s]+\w)/i, /(asus)-?(\w+)/i],
                [u, d, [c, g]],
                [/\(bb10;\s(\w+)/i],
                [d, [u, "BlackBerry"],
                    [c, g]
                ],
                [/android.+(transfo[prime\s]{4,10}\s\w+|eeepc|slider\s\w+|nexus 7)/i],
                [d, [u, "Asus"],
                    [c, h]
                ],
                [/(sony)\s(tablet\s[ps])\sbuild\//i, /(sony)?(?:sgp.+)\sbuild\//i],
                [
                    [u, "Sony"],
                    [d, "Xperia Tablet"],
                    [c, h]
                ],
                [/(?:sony)?(?:(?:(?:c|d)\d{4})|(?:so[-l].+))\sbuild\//i],
                [
                    [u, "Sony"],
                    [d, "Xperia Phone"],
                    [c, g]
                ],
                [/\s(ouya)\s/i, /(nintendo)\s([wids3u]+)/i],
                [u, d, [c, b]],
                [/android.+;\s(shield)\sbuild/i],
                [d, [u, "Nvidia"],
                    [c, b]
                ],
                [/(playstation\s[34portablevi]+)/i],
                [d, [u, "Sony"],
                    [c, b]
                ],
                [/(sprint\s(\w+))/i],
                [
                    [u, A.str, S.device.sprint.vendor],
                    [d, A.str, S.device.sprint.model],
                    [c, g]
                ],
                [/(lenovo)\s?(S(?:5000|6000)+(?:[-][\w+]))/i],
                [u, d, [c, h]],
                [/(htc)[;_\s-]+([\w\s]+(?=\))|\w+)*/i, /(zte)-(\w+)*/i, /(alcatel|geeksphone|huawei|lenovo|nexian|panasonic|(?=;\s)sony)[_\s-]?([\w-]+)*/i],
                [u, [d, /_/g, " "],
                    [c, g]
                ],
                [/(nexus\s9)/i],
                [d, [u, "HTC"],
                    [c, h]
                ],
                [/[\s\(;](xbox(?:\sone)?)[\s\);]/i],
                [d, [u, "Microsoft"],
                    [c, b]
                ],
                [/(kin\.[onetw]{3})/i],
                [
                    [d, /\./g, " "],
                    [u, "Microsoft"],
                    [c, g]
                ],
                [/\s(milestone|droid(?:[2-4x]|\s(?:bionic|x2|pro|razr))?(:?\s4g)?)[\w\s]+build\//i, /mot[\s-]?(\w+)*/i, /(XT\d{3,4}) build\//i, /(nexus\s[6])/i],
                [d, [u, "Motorola"],
                    [c, g]
                ],
                [/android.+\s(mz60\d|xoom[\s2]{0,2})\sbuild\//i],
                [d, [u, "Motorola"],
                    [c, h]
                ],
                [/android.+((sch-i[89]0\d|shw-m380s|gt-p\d{4}|gt-n8000|sgh-t8[56]9|nexus 10))/i, /((SM-T\w+))/i],
                [
                    [u, "Samsung"], d, [c, h]
                ],
                [/((s[cgp]h-\w+|gt-\w+|galaxy\snexus|sm-n900))/i, /(sam[sung]*)[\s-]*(\w+-?[\w-]*)*/i, /sec-((sgh\w+))/i],
                [
                    [u, "Samsung"], d, [c, g]
                ],
                [/(samsung);smarttv/i],
                [u, d, [c, v]],
                [/\(dtv[\);].+(aquos)/i],
                [d, [u, "Sharp"],
                    [c, v]
                ],
                [/sie-(\w+)*/i],
                [d, [u, "Siemens"],
                    [c, g]
                ],
                [/(maemo|nokia).*(n900|lumia\s\d+)/i, /(nokia)[\s_-]?([\w-]+)*/i],
                [
                    [u, "Nokia"], d, [c, g]
                ],
                [/android\s3\.[\s\w;-]{10}(a\d{3})/i],
                [d, [u, "Acer"],
                    [c, h]
                ],
                [/android\s3\.[\s\w;-]{10}(lg?)-([06cv9]{3,4})/i],
                [
                    [u, "LG"], d, [c, h]
                ],
                [/(lg) netcast\.tv/i],
                [u, d, [c, v]],
                [/(nexus\s[45])/i, /lg[e;\s\/-]+(\w+)*/i],
                [d, [u, "LG"],
                    [c, g]
                ],
                [/android.+(ideatab[a-z0-9\-\s]+)/i],
                [d, [u, "Lenovo"],
                    [c, h]
                ],
                [/linux;.+((jolla));/i],
                [u, d, [c, g]],
                [/((pebble))app\/[\d\.]+\s/i],
                [u, d, [c, x]],
                [/android.+;\s(glass)\s\d/i],
                [d, [u, "Google"],
                    [c, x]
                ],
                [/android.+(\w+)\s+build\/hm\1/i, /android.+(hm[\s\-_]*note?[\s_]*(?:\d\w)?)\s+build/i, /android.+(mi[\s\-_]*(?:one|one[\s_]plus)?[\s_]*(?:\d\w)?)\s+build/i],
                [
                    [d, /_/g, " "],
                    [u, "Xiaomi"],
                    [c, g]
                ],
                [/\s(tablet)[;\/\s]/i, /\s(mobile)[;\/\s]/i],
                [
                    [c, k.lowerize], u, d
                ]
            ],
            engine: [
                [/windows.+\sedge\/([\w\.]+)/i],
                [m, [p, "EdgeHTML"]],
                [/(presto)\/([\w\.]+)/i, /(webkit|trident|netfront|netsurf|amaya|lynx|w3m)\/([\w\.]+)/i, /(khtml|tasman|links)[\/\s]\(?([\w\.]+)/i, /(icab)[\/\s]([23]\.[\d\.]+)/i],
                [p, m],
                [/rv\:([\w\.]+).*(gecko)/i],
                [m, p]
            ],
            os: [
                [/microsoft\s(windows)\s(vista|xp)/i],
                [p, m],
                [/(windows)\snt\s6\.2;\s(arm)/i, /(windows\sphone(?:\sos)*|windows\smobile|windows)[\s\/]?([ntce\d\.\s]+\w)/i],
                [p, [m, A.str, S.os.windows.version]],
                [/(win(?=3|9|n)|win\s9x\s)([nt\d\.]+)/i],
                [
                    [p, "Windows"],
                    [m, A.str, S.os.windows.version]
                ],
                [/\((bb)(10);/i],
                [
                    [p, "BlackBerry"], m
                ],
                [/(blackberry)\w*\/?([\w\.]+)*/i, /(tizen)[\/\s]([\w\.]+)/i, /(android|webos|palm\sos|qnx|bada|rim\stablet\sos|meego|contiki)[\/\s-]?([\w\.]+)*/i, /linux;.+(sailfish);/i],
                [p, m],
                [/(symbian\s?os|symbos|s60(?=;))[\/\s-]?([\w\.]+)*/i],
                [
                    [p, "Symbian"], m
                ],
                [/\((series40);/i],
                [p],
                [/mozilla.+\(mobile;.+gecko.+firefox/i],
                [
                    [p, "Firefox OS"], m
                ],
                [/(nintendo|playstation)\s([wids34portablevu]+)/i, /(mint)[\/\s\(]?(\w+)*/i, /(mageia|vectorlinux)[;\s]/i, /(joli|[kxln]?ubuntu|debian|[open]*suse|gentoo|(?=\s)arch|slackware|fedora|mandriva|centos|pclinuxos|redhat|zenwalk|linpus)[\/\s-]?([\w\.-]+)*/i, /(hurd|linux)\s?([\w\.]+)*/i, /(gnu)\s?([\w\.]+)*/i],
                [p, m],
                [/(cros)\s[\w]+\s([\w\.]+\w)/i],
                [
                    [p, "Chromium OS"], m
                ],
                [/(sunos)\s?([\w\.]+\d)*/i],
                [
                    [p, "Solaris"], m
                ],
                [/\s([frentopc-]{0,4}bsd|dragonfly)\s?([\w\.]+)*/i],
                [p, m],
                [/(ip[honead]+)(?:.*os\s([\w]+)*\slike\smac|;\sopera)/i],
                [
                    [p, "iOS"],
                    [m, /_/g, "."]
                ],
                [/(mac\sos\sx)\s?([\w\s\.]+\w)*/i, /(macintosh|mac(?=_powerpc)\s)/i],
                [
                    [p, "Mac OS"],
                    [m, /_/g, "."]
                ],
                [/((?:open)?solaris)[\/\s-]?([\w\.]+)*/i, /(haiku)\s(\w+)/i, /(aix)\s((\d)(?=\.|\)|\s)[\w\.]*)*/i, /(plan\s9|minix|beos|os\/2|amigaos|morphos|risc\sos|openvms)/i, /(unix)\s?([\w\.]+)*/i],
                [p, m]
            ]
        },
        T = function(s, e) {
            if (!(this instanceof T)) return new T(s, e).getResult();
            var r = s || (i && i.navigator && i.navigator.userAgent ? i.navigator.userAgent : o),
                n = e ? k.extend(E, e) : E;
            return this.getBrowser = function() {
                var i = A.rgx.apply(this, n.browser);
                return i.major = k.major(i.version), i
            }, this.getCPU = function() {
                return A.rgx.apply(this, n.cpu)
            }, this.getDevice = function() {
                return A.rgx.apply(this, n.device)
            }, this.getEngine = function() {
                return A.rgx.apply(this, n.engine)
            }, this.getOS = function() {
                return A.rgx.apply(this, n.os)
            }, this.getResult = function() {
                return {
                    ua: this.getUA(),
                    browser: this.getBrowser(),
                    engine: this.getEngine(),
                    os: this.getOS(),
                    device: this.getDevice(),
                    cpu: this.getCPU()
                }
            }, this.getUA = function() {
                return r
            }, this.setUA = function(i) {
                return r = i, this
            }, this
        };
    T.VERSION = e, T.BROWSER = {
        NAME: p,
        MAJOR: l,
        VERSION: m
    }, T.CPU = {
        ARCHITECTURE: f
    }, T.DEVICE = {
        MODEL: d,
        VENDOR: u,
        TYPE: c,
        CONSOLE: b,
        MOBILE: g,
        SMARTTV: v,
        TABLET: h,
        WEARABLE: x,
        EMBEDDED: y
    }, T.ENGINE = {
        NAME: p,
        VERSION: m
    }, T.OS = {
        NAME: p,
        VERSION: m
    }, typeof exports !== a ? (typeof module !== a && module.exports && (exports = module.exports = T), exports.UAParser = T) : typeof define === n && define.amd ? (define("ua-parser-js", [], function() {
        return T
    }), i.UAParser = T) : i.UAParser = T;
    var N = i.jQuery || i.Zepto;
    if (typeof N !== a) {
        var O = new T;
        N.ua = O.getResult(), N.ua.get = function() {
            return O.getUA()
        }, N.ua.set = function(i) {
            O.setUA(i);
            var s = O.getResult();
            for (var e in s) N.ua[e] = s[e]
        }
    }
}("object" == typeof window ? window : this);

function qosMonitor(t, e, s, i, o, a, d, h) {
    this.rawStats = new Object, this.rawStats.ConnectedPair = new Array, this.rawStats["Audio send"] = new Array, this.rawStats["Audio recv"] = new Array, this.rawStats["Video send"] = new Array, this.rawStats["Video recv"] = new Array, this.moyRttCP = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0], this.moyRttAS = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0], this.moyRttVS = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0], this.tauxPacketLossAS = [0], this.oldLostAS = this.oldSentAS = 0, this.oldLostVS = this.oldLostVS = 0, this.cptTaux = 0, this.tauxPacketLossVS = [0], this.oldBandwidthAS = 0, this.oldBandwidthVS = 0, this.bandwidthAS = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0], this.bandwidthAR = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0], this.bandwidthVS = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0], this.bandwidthVR = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0], this.qosIn = 0, this.qosInAverage = 0, this.qosInAverageCount = 0, this.qosAudioIn = 0, this.qosAudioInAverage = 0, this.qosAudioInAverageCount = 0, this.qosVideoIn = 0, this.qosVideoInAverage = 0, this.qosVideoInAverageCount = 0, this.qosOut = 0, this.qosOutAverage = 0, this.qosOutAverageCount = 0, this.qosAudioOut = 0, this.qosAudioOutAverage = 0, this.qosAudioOutAverageCount = 0, this.qosVideoOut = 0, this.qosVideoOutAverage = 0, this.qosVideoOutAverageCount = 0, this.onQosChange = e, this.onQosAudioChange = s, this.onQosVideoChange = i, this.cpt = 0, this.cptRes = 5, this.cptDb = 60, this.saveStatsFlag = !0, this.tabQosIn = new Array, this.tabQosAudioIn = new Array, this.tabQosVideoIn = new Array, this.tabQosOut = new Array, this.tabQosAudioOut = new Array, this.tabQosVideoOut = new Array, this.tabTimestamp = new Array, this.tabDelay = new Array, this.tabJitterBufferAudio = new Array, this.tabJitterBufferVideo = new Array, this.tabAudioRtt = new Array, this.tabVideoRtt = new Array, this.tabAudioBW = new Array, this.tabVideoBW = new Array, this.clientId = d, this.callId = o, this.apiKey = a, this.socket = h, this.interval = t
}
qosMonitor.prototype.insertStats = function(t, e, s, i) {
    var o = 0,
        a = 0,
        d = 0;
    for (this.cpt = this.cpt + this.interval, o = 0; o < t.length; ++o) {
        var h = t[o];
        switch (h.type) {
            case "googCandidatePair":
                var r = h.names();
                for (d = 0; d < r.length; ++d)
                    if ("googActiveConnection" == r[d] && "true" == h.stat(r[d]))
                        for (a = 0; a < r.length; ++a) "bytesSent" == r[a] && "undefined" != typeof h.stat(r[a]) && (this.rawStats.ConnectedPair.bytesSent = h.stat(r[a])), "bytesReceived" == r[a] && "undefined" != typeof h.stat(r[a]) && (this.rawStats.ConnectedPair.bytesReceived = h.stat(r[a])), "googRtt" == r[a] && "undefined" != typeof h.stat(r[a]) && (this.rawStats.ConnectedPair.googRtt = h.stat(r[a]));
                break;
            case "ssrc":
                var r = h.names();
                for (d = 0; d < r.length; ++d) {
                    if ("audioOutputLevel" == r[d])
                        for (a = 0; a < r.length; ++a) "packetsLost" == r[a] && "undefined" != typeof h.stat(r[a]) && (this.rawStats["Audio recv"].packetsLost = h.stat(r[a])), "googDecodingPLC" == r[a] && "undefined" != typeof h.stat(r[a]) && (this.rawStats["Audio recv"].googDecodingPLC = h.stat(r[a])), "googJitterReceived" == r[a] && "undefined" != typeof h.stat(r[a]) && (this.rawStats["Audio recv"].googJitterReceived = h.stat(r[a])), "googJitterBufferMs" == r[a] && "undefined" != typeof h.stat(r[a]) && (this.rawStats["Audio recv"].googJitterBufferMs = h.stat(r[a])), "googCurrentDelayMs" == r[a] && "undefined" != typeof h.stat(r[a]) && (this.rawStats["Audio recv"].googCurrentDelayMs = h.stat(r[a])), "bytesReceived" == r[a] && "undefined" != typeof h.stat(r[a]) && (this.rawStats["Audio recv"].bytesReceived = h.stat(r[a]));
                    if ("audioInputLevel" == r[d])
                        for (a = 0; a < r.length; ++a) "googRtt" == r[a] && "undefined" != typeof h.stat(r[a]) && -1 != h.stat(r[a]) && (this.rawStats["Audio send"].googRtt = h.stat(r[a])), "packetsLost" == r[a] && "undefined" != typeof h.stat(r[a]) && (this.rawStats["Audio send"].packetsLost = h.stat(r[a])), "packetsSent" == r[a] && "undefined" != typeof h.stat(r[a]) && (this.rawStats["Audio send"].packetsSent = h.stat(r[a])), "googJitterReceived" == r[a] && "undefined" != typeof h.stat(r[a]) && (this.rawStats["Audio send"].googJitterReceived = h.stat(r[a]));
                    if ("googFrameHeightReceived" == r[d])
                        for (var a = 0; a < r.length; ++a) "packetsLost" == r[a] && "undefined" != typeof h.stat(r[a]) && (this.rawStats["Video recv"].packetsLost = h.stat(r[a])), "googNacksSent" == r[a] && "undefined" != typeof h.stat(r[a]) && (this.rawStats["Video recv"].googNacksSent = h.stat(r[a])), "googJitterBufferMs" == r[a] && "undefined" != typeof h.stat(r[a]) && (this.rawStats["Video recv"].googJitterBufferMs = h.stat(r[a])), "bytesReceived" == r[a] && "undefined" != typeof h.stat(r[a]) && (this.rawStats["Video recv"].bytesReceived = h.stat(r[a]));
                    if ("googFrameHeightInput" == r[d])
                        for (var a = 0; a < r.length; ++a) "packetsLost" == r[a] && "undefined" != typeof h.stat(r[a]) && (this.rawStats["Video send"].packetsLost = h.stat(r[a])), "googNacksReceived" == r[a] && "undefined" != typeof h.stat(r[a]) && (this.rawStats["Video send"].googNacksReceived = h.stat(r[a])), "googRtt" == r[a] && "undefined" != typeof h.stat(r[a]) && -1 != h.stat(r[a]) && (this.rawStats["Video send"].googRtt = h.stat(r[a])), "packetsSent" == r[a] && "undefined" != typeof h.stat(r[a]) && (this.rawStats["Video send"].packetsSent = h.stat(r[a]))
                }
        }
    }
    this.computeStats(e, s, i), this.cpt % this.cptRes == 0 && this.saveStatsLocal(), this.cpt % this.cptDb == 0 && this.saveStatsToDb(!1)
}, qosMonitor.prototype.saveStatsLocal = function() {
    if (this.saveStatsFlag) {
        var t = Date.now();
        this.tabTimestamp.push(t), this.tabQosIn.push(this.qosIn), this.tabQosAudioIn.push(this.qosAudioIn), 0 != this.qosVideoIn && this.tabQosVideoIn.push(this.qosVideoIn), this.tabQosOut.push(this.qosOut), this.tabQosAudioOut.push(this.qosAudioOut), 0 != this.qosVideoOut && this.tabQosVideoOut.push(this.qosVideoOut), this.tabJitterBufferAudio.push(this.rawStats["Audio recv"].googJitterBufferMs), "undefined" != typeof this.rawStats["Video recv"].googJitterBufferMs && this.tabJitterBufferVideo.push(this.rawStats["Video recv"].googJitterBufferMs), "undefined" != typeof this.rawStats["Video send"].googRtt && this.tabVideoRtt.push(this.rawStats["Video send"].googRtt), this.tabAudioRtt.push(this.rawStats["Audio send"].googRtt), this.tabAudioBW.push(8 * this.Average(this.bandwidthAS) / 1024), "undefined" != typeof this.bandwidthVS && this.tabVideoBW.push(8 * this.Average(this.bandwidthVS) / 1024)
    }
}, qosMonitor.prototype.saveStatsToDb = function(t) {
    return
}, qosMonitor.prototype.setSaveStats = function(t) {
    this.saveStatsFlag = t
}, qosMonitor.prototype.computeStats = function(t, e, s) {
    if (-1 != this.rawStats.ConnectedPair.googRtt && 0 != this.rawStats.ConnectedPair.googRtt && "undefined" != typeof this.rawStats.ConnectedPair.googRtt && this.add(this.rawStats.ConnectedPair.googRtt, this.moyRttCP), -1 != this.rawStats["Video send"].googRtt && 0 != this.rawStats["Video send"].googRtt && "undefined" != typeof this.rawStats["Video send"].googRtt && this.add(this.rawStats["Video send"].googRtt, this.moyRttVS), -1 != this.rawStats["Audio send"].googRtt && 0 != this.rawStats["Audio send"].googRtt && "undefined" != typeof this.rawStats["Audio send"].googRtt && this.add(this.rawStats["Audio send"].googRtt, this.moyRttAS), -1 != this.rawStats["Audio send"].packetsLost && "undefined" != typeof this.rawStats["Audio send"].packetsLost && -1 != this.rawStats["Audio send"].packetsSent && 0 != this.rawStats["Audio send"].packetsSent && "undefined" != typeof this.rawStats["Audio send"].packetsSent) {
        var i = 100 * (this.rawStats["Audio send"].packetsLost - this.oldLostAS) / (this.rawStats["Audio send"].packetsSent - this.oldSentAS);
        this.oldLostAS = this.rawStats["Audio send"].packetsLost, this.oldSentAS = this.rawStats["Audio send"].packetsSent, this.add(i, this.tauxPacketLossAS)
    }
    if (-1 != this.rawStats["Video send"].packetsLost && "undefined" != typeof this.rawStats["Video send"].packetsLost && -1 != this.rawStats["Video send"].packetsSent && 0 != this.rawStats["Video send"].packetsSent && "undefined" != typeof this.rawStats["Video send"].packetsSent) {
        var i = 100 * (this.rawStats["Video send"].packetsLost - this.oldLostVS) / (this.rawStats["Video send"].packetsSent - this.oldSentVS);
        this.oldLostVS = this.rawStats["Video send"].packetsLost, this.oldSentVS = this.rawStats["Video send"].packetsSent, this.add(i, this.tauxPacketLossVS)
    } - 1 != this.rawStats["Audio recv"].bytesReceived && "undefined" != typeof this.rawStats["Audio recv"].bytesReceived && ("undefined" == typeof this.oldBandwidthAS && (this.oldBandwidthAS = 0), this.add((this.rawStats["Audio recv"].bytesReceived - this.oldBandwidthAS) / this.interval, this.bandwidthAS), this.oldBandwidthAS = this.rawStats["Audio recv"].bytesReceived), -1 != this.rawStats["Video recv"].bytesReceived && "undefined" != typeof this.rawStats["Video recv"].bytesReceived && ("undefined" == typeof this.oldBandwidthVS && (this.oldBandwidthVS = 0), this.add((this.rawStats["Video recv"].bytesReceived - this.oldBandwidthVS) / this.interval, this.bandwidthVS), this.oldBandwidthVS = this.rawStats["Video recv"].bytesReceived);
    var o = 0,
        a = 0,
        d = 0,
        h = 0,
        r = 0,
        n = 0,
        u = 0,
        A = 0,
        g = 0,
        c = 0,
        S = this.getCodecs(e),
        v = 8 * this.Average(this.bandwidthAS) / 1024;
    if (5 > v ? o = 1 : v >= 5 && 10 > v ? o = 2 : v >= 10 && (o = 3), null != S[1]) {
        var f = 8 * this.Average(this.bandwidthVS) / 1024;
        expectedVideoBandwidth = 300, f < .8 * expectedVideoBandwidth ? h = 1 : f >= .8 * expectedVideoBandwidth && f < 1.1 * expectedVideoBandwidth ? h = 2 : f >= 1.1 * expectedVideoBandwidth && (h = 3)
    }
    this.rawStats["Audio recv"].googJitterBufferMs < 60 ? a = 3 : this.rawStats["Audio recv"].googJitterBufferMs >= 60 && this.rawStats["Audio recv"].googJitterBufferMs < 100 ? a = 2 : this.rawStats["Audio recv"].googJitterBufferMs >= 100 && (a = 1), this.rawStats["Audio recv"].googCurrentDelayMs < 100 ? d = 3 : this.rawStats["Audio recv"].googCurrentDelayMs >= 100 && this.rawStats["Audio recv"].googCurrentDelayMs < 200 ? d = 2 : this.rawStats["Audio recv"].googCurrentDelayMs >= 200 && (d = 1), null != S[1] && (this.rawStats["Video recv"].googJitterBufferMs < 100 ? r = 3 : this.rawStats["Video recv"].googJitterBufferMs >= 100 && this.rawStats["Video recv"].googJitterBufferMs < 200 ? r = 2 : this.rawStats["Video recv"].googJitterBufferMs >= 200 && (r = 1));
    var p = !1,
        w = !1,
        q = !1;
    null != S[1] ? (Math.ceil((o + 2 * h + r + a + d) / 6) != this.qosIn && (p = !0), this.qosIn = Math.ceil((o + 2 * h + r + a + d) / 6), this.qosInAverage = (this.qosInAverage * this.qosInAverageCount + this.qosIn) / (this.qosInAverageCount + 1), this.qosInAverageCount++, Math.ceil((o + a + d) / 3) != this.qosAudioIn && (w = !0), this.qosAudioIn = Math.ceil((o + a + d) / 3), this.qosAudioInAverage = (this.qosAudioInAverage * this.qosAudioInAverageCount + this.qosAudioIn) / (this.qosAudioInAverageCount + 1), this.qosAudioInAverageCount++, Math.ceil((2 * h + r) / 3) != this.qosVideoIn && (q = !0), this.qosVideoIn = Math.ceil((2 * h + r) / 3), this.qosVideoInAverage = (this.qosVideoInAverage * this.qosVideoInAverageCount + this.qosVideoIn) / (this.qosVideoInAverageCount + 1), this.qosVideoInAverageCount++) : (Math.ceil((o + a + d) / 3) != this.qosOut && (p = !0), this.qosIn = Math.ceil((o + a + d) / 3), this.qosInAverage = (this.qosInAverage * this.qosInAverageCount + this.qosIn) / (this.qosInAverageCount + 1), this.qosInAverageCount++, Math.ceil((o + a + d) / 3) != this.qosAudioIn && (w = !0), this.qosAudioIn = Math.ceil((o + a + d) / 3), this.qosAudioInAverage = (this.qosAudioInAverage * this.qosAudioInAverageCount + this.qosAudioIn) / (this.qosAudioInAverageCount + 1), this.qosAudioInAverageCount++), this.RttAverage(this.moyRttAS) < 80 ? u = 3 : this.RttAverage(this.moyRttAS) >= 80 && this.RttAverage(this.moyRttAS) < 150 ? u = 2 : this.RttAverage(this.moyRttAS) >= 150 && (u = 1), this.tauxPacketLossAS <= 5 ? n = 3 : this.tauxPacketLossAS > 5 && this.tauxPacketLossAS < 10 ? n = 2 : this.tauxPacketLossAS >= 10 && (n = 1), this.rawStats["Audio recv"].googJitterReceived < 80 ? A = 3 : this.rawStats["Audio recv"].googJitterReceived >= 80 && this.rawStats["Audio recv"].googJitterReceived < 150 ? A = 2 : this.rawStats["Audio recv"].googJitterReceived >= 150 && (A = 1), null != S[1] && (this.tauxPacketLossVS <= 5 ? g = 3 : this.tauxPacketLossVS > 5 && this.tauxPacketLossVS < 10 ? g = 2 : this.tauxPacketLossVS >= 10 && (g = 1), this.RttAverage(this.moyRttVS) < 80 ? c = 3 : this.RttAverage(this.moyRttVS) >= 80 && this.RttAverage(this.moyRttVS) < 150 ? c = 2 : this.RttAverage(this.moyRttVS) >= 150 && (c = 1)), null != S[1] ? (Math.ceil((u + 2 * n + A + 2 * g + c) / 7) != this.qosOut && (p = !0), this.qosOut = Math.ceil((u + 2 * n + A + 2 * g + c) / 7), this.qosOutAverage = (this.qosOutAverage * this.qosOutAverageCount + this.qosOut) / (this.qosOutAverageCount + 1), this.qosOutAverageCount++, Math.ceil((u + 2 * n + A) / 4) != this.qosAudioOut && (w = !0), this.qosAudioOut = Math.ceil((u + 2 * n + A) / 4), this.qosAudioOutAverage = (this.qosAudioOutAverage * this.qosAudioOutAverageCount + this.qosAudioOut) / (this.qosAudioOutAverageCount + 1), this.qosAudioOutAverageCount++, Math.ceil((2 * g + c) / 3) != this.qosVideoOut && (q = !0), this.qosVideoOut = Math.ceil((2 * g + c) / 3), this.qosVideoOutAverage = (this.qosVideoOutAverage * this.qosVideoOutAverageCount + this.qosVideoOut) / (this.qosVideoOutAverageCount + 1), this.qosVideoOutAverageCount++) : (Math.ceil((u + 2 * n + A) / 4) != this.qosOut && (p = !0), this.qosOut = Math.ceil((u + 2 * n + A) / 4), this.qosOutAverage = (this.qosOutAverage * this.qosOutAverageCount + this.qosOut) / (this.qosOutAverageCount + 1), this.qosOutAverageCount++, Math.ceil((u + 2 * n + A) / 4) != this.qosAudioOut && (w = !0), this.qosAudioOut = Math.ceil((u + 2 * n + A) / 4), this.qosAudioOutAverage = (this.qosAudioOutAverage * this.qosAudioOutAverageCount + this.qosAudioOut) / (this.qosAudioOutAverageCount + 1), this.qosAudioOutAverageCount++), p && (this.onQosChange(this.qosIn, this.qosOut), p = !1), w && (this.onQosAudioChange(this.qosAudioIn, this.qosAudioOut), w = !1), q && (this.onQosVideoChange(this.qosVideoIn, this.qosVideoOut), q = !1)
}, qosMonitor.prototype.getCodecs = function(t) {
    var e = !1,
        s = !1,
        i = null,
        o = null;
    if (null !== typeof t && "undefined" != typeof t && "undefined" != typeof t.sdp) {
        for (var a = t.sdp, d = a.split("\n"), h = 0; h < d.length; h++) - 1 != d[h].indexOf("a=mid:audio") && (e = !0), -1 != d[h].indexOf("a=mid:video") && (s = !0), e && -1 != d[h].indexOf("a=rtpmap:") && (i = d[h], e = !1), s && -1 != d[h].indexOf("a=rtpmap:") && (o = d[h], s = !1);
        return [i, o]
    }
}, qosMonitor.prototype.getQosScore = function() {
    return [this.qosIn, this.qosOut, this.qosAudioIn, this.qosAudioOut, this.qosVideoIn, this.qosVideoOut]
}, qosMonitor.prototype.getStat = function(t) {
    switch (t) {
        case "AudioInBandwidth":
            return 8 * this.Average(this.bandwidthAS) / 1024;
        case "VideoInBandwidth":
            return 8 * this.Average(this.bandwidthVS) / 1024;
        case "AudioInJitterReceived":
            return this.rawStats["Audio recv"].googJitterReceived;
        case "AudioInJitterBufferMs":
            return this.rawStats["Audio recv"].googJitterBufferMs;
        case "AudioInDelay":
            return this.rawStats["Audio recv"].googCurrentDelayMs;
        case "AudioOutLossRate":
            return this.tauxPacketLossAS;
        case "AudioOutRtt":
            return this.RttAverage(this.moyRttAS);
        case "AudioOutJitterReceived":
            return this.rawStats["Audio recv"].googJitterReceived;
        case "VideoInJitterBufferMs":
            return this.rawStats["Video recv"].googJitterBufferMs;
        case "VideoOutLossRate":
            return this.tauxPacketLossVS;
        case "VideoOutRtt":
            return this.RttAverage(this.moyRttVS)
    }
}, qosMonitor.prototype.displayComputedStats = function() {}, qosMonitor.prototype.RttAverage = function(t) {
    for (var e = 0, s = 0, i = 0; i < t.length; ++i) 0 != t[i] && -1 != t[i] && "undefined" != typeof t[i] && (e += parseInt(t[i], 10), s++);
    return parseInt(e / s, 10)
}, qosMonitor.prototype.Average = function(t) {
    for (var e = 0, s = 0, i = 0; i < t.length; ++i) - 1 != t[i] && "undefined" != typeof t[i] && (e += parseInt(t[i], 10), s++);
    return parseInt(e / s, 10)
}, qosMonitor.prototype.add = function(t, e) {
    e.pop(), e.unshift(t)
}, qosMonitor.prototype.displayTab = function(t) {
    for (var e in t);
};
! function(e, t) {
    "use strict";

    function i(e) {
        var t = new RegExp("^[0-9-.]*$", "g");
        return t.test(e)
    }

    function n() {
        return "https:" == e.location.protocol
    }

    function s() {
        return "http:" == e.location.protocol
    }

    function a(e, t) {
        var i = {},
            n = null;
        for (n in e) e.hasOwnProperty(n) && (i[n] = e[n]);
        for (n in t) t.hasOwnProperty(n) && (i[n] = t[n]);
        return i
    }

    function o(e) {
        var t, i, n, s, a = {};
        for (t = e.split("&"), n = 0, s = t.length; s > n; n++) i = t[n].split("="), a[i[0]] = i[1];
        return a
    }

    function l(e) {
        return Object.keys(e).map(function(t) {
            return t + "=" + e[t]
        }).join("&")
    }
    e.Prototype && delete Array.prototype.toJSON;
    var r = null,
        c = null,
        d = null,
        h = null,
        u = null,
        C = null,
        p = null,
        m = null,
        v = null,
        f = null,
        g = null,
        b = null,
        I = "notTested",
        T = null,
        R = null,
        S = null,
        y = null,
        D = null,
        w = null,
        M = null,
        E = null;
    return M = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-/=", E = {
        decode: function(e) {
            var t = M.indexOf(e.charAt(e.length - 1)),
                i = M.indexOf(e.charAt(e.length - 2)),
                n = e.length / 4 * 3,
                s = null,
                a = null,
                o = null,
                l = null,
                r = null,
                c = null,
                d = null,
                h = 0,
                u = 0,
                C = null;
            for (64 == t && n--, 64 == i && n--, C = new Uint8Array(n), h = 0; n > h; h += 3) l = M.indexOf(e.charAt(u++)), r = M.indexOf(e.charAt(u++)), c = M.indexOf(e.charAt(u++)), d = M.indexOf(e.charAt(u++)), s = l << 2 | r >> 4, a = (15 & r) << 4 | c >> 2, o = (3 & c) << 6 | d, C[h] = s, 64 != c && (C[h + 1] = a), 64 != d && (C[h + 2] = o);
            return C
        },
        encode: function(e) {
            var t = "",
                i = new Uint8Array(e),
                n = i.byteLength,
                s = n % 3,
                a = n - s,
                o = null,
                l = null,
                r = null,
                c = null,
                d = null,
                h = 0;
            for (h = 0; a > h; h += 3) d = i[h] << 16 | i[h + 1] << 8 | i[h + 2], o = (16515072 & d) >> 18, l = (258048 & d) >> 12, r = (4032 & d) >> 6, c = 63 & d, t += M[o] + M[l] + M[r] + M[c];
            return 1 == s ? (d = i[a], o = (252 & d) >> 2, l = (3 & d) << 4, t += M[o] + M[l] + "==") : 2 == s && (d = i[a] << 8 | i[a + 1], o = (64512 & d) >> 10, l = (1008 & d) >> 4, r = (15 & d) << 2, t += M[o] + M[l] + M[r] + "="), t
        }
    }, S = new UAParser, y = S.getBrowser(), f = y.name, g = y.version, w = S.getOS(), r = function() {
        if ("notTested" === I) try {
            new CustomEvent("test", {
                detail: "test",
                bubbles: !0,
                cancelable: !0
            }), I = !0
        } catch (i) {
            I = !1
        }("IE" === f && g > 8 || "Netscape" === f) && (! function() {
            function i(e, i) {
                i = i || {
                    bubbles: !1,
                    cancelable: !1,
                    detail: t
                };
                var n = document.createEvent("CustomEvent");
                return n.initCustomEvent(e, i.bubbles, i.cancelable, i.detail), n
            }
            i.prototype = e.CustomEvent.prototype, e.CustomEvent = i
        }(), I = !0), this.eventDispatchMgr = function(e, t) {
            if (I === !1) "undefined" != typeof $jqApz ? $jqApz.event.trigger({
                type: e,
                detail: t
            }) : "undefined" != typeof jQuery && jQuery.event.trigger({
                type: e,
                detail: t
            });
            else {
                var i = new CustomEvent(e, {
                    detail: t,
                    bubbles: !0,
                    cancelable: !0
                });
                document.dispatchEvent(i)
            }
        }, this.createIncomingCallEvent = function(e, t, i, n, s, a, o, l, r, c) {
            var d = "incomingCall",
                h = {
                    eventType: "incomingCall",
                    time: new Date,
                    clientId: e,
                    callerId: t,
                    callId: n,
                    autoAnswerActivated: s,
                    callNumber: a,
                    callerNickname: i,
                    audioOnly: o,
                    callType: l,
                    recordedCall: r,
                    remoteType: c
                };
            this.eventDispatchMgr(d, h)
        }, this.createCallAttemptEvent = function(e, t, i, n) {
            var s = "callAttempt",
                a = {
                    eventType: "callAttempt",
                    time: new Date,
                    clientId: e,
                    callerId: t,
                    callId: n,
                    callerNickname: i
                };
            this.eventDispatchMgr(s, a)
        }, this.createCallEstablishedEvent = function(e, t, i, n) {
            var s = "callEstablished",
                a = {
                    eventType: "callEstablished",
                    time: new Date,
                    calleeId: e,
                    callType: t,
                    callId: i,
                    destCallType: n
                };
            this.eventDispatchMgr(s, a)
        }, this.createHangupEvent = function(e, t, i, n, s, a, o) {
            var l = "hangup",
                r = {
                    eventType: "hangup",
                    time: new Date,
                    hangupType: e,
                    clientId: t,
                    remoteId: i,
                    lastEstablishedCall: n,
                    reason: s,
                    callId: a,
                    callType: o
                };
            this.eventDispatchMgr(l, r)
        }, this.createRemoteHangupEvent = function(e, t, i, n) {
            var s = "remoteHangup",
                a = {
                    eventType: "remoteHangup",
                    time: new Date,
                    clientId: e,
                    remoteId: t,
                    lastEstablishedCall: i,
                    reason: n
                };
            this.eventDispatchMgr(s, a)
        }, this.createUserMediaSuccessEvent = function(e, t, i, n, s, a, o, l, r) {
            var c = "userMediaSuccess",
                d = {
                    eventType: "userMediaSuccess",
                    time: new Date,
                    onCallEstablishment: e,
                    audioIsAvailable: t,
                    audioDeviceLabel: i,
                    videoIsAvailable: n,
                    videoDeviceLabel: s,
                    callType: a,
                    callId: o,
                    stream: l,
                    remoteId: r
                };
            this.eventDispatchMgr(c, d)
        }, this.createUserMediaErrorEvent = function(e, t) {
            var i = "userMediaError",
                n = {
                    eventType: "userMediaError",
                    time: new Date,
                    onCallEstablishment: e,
                    callType: t
                };
            this.eventDispatchMgr(i, n)
        }, this.createErrorEvent = function(e, t) {
            var i = "error",
                n = {
                    eventType: "error :",
                    time: new Date,
                    errorInfo: e,
                    errorCode: t
                };
            this.eventDispatchMgr(i, n)
        }, this.createReceiveIMMessageEvent = function(e, t, i, n, s, a) {
            var o = "receiveIMMessage",
                l = {
                    eventType: "receiveIMMessage",
                    time: new Date,
                    senderId: e,
                    senderNickname: t,
                    senderPhotoURL: i,
                    message: n,
                    UUCSeq: s,
                    convId: a
                };
            this.eventDispatchMgr(o, l)
        }, this.createChannelEvent = function(e) {
            var t = "channelEvent",
                i = {
                    eventType: "channelEvent :",
                    time: new Date,
                    channelEvent: e
                };
            this.eventDispatchMgr(t, i)
        }, this.createSessionReadyEvent = function(e) {
            var t = "sessionReady",
                i = {
                    eventType: "sessionReady",
                    time: new Date,
//                    apiCCId: e
                    apiCCId: e
                };
            this.eventDispatchMgr(t, i)
        }, this.createWebRTCClientCreatedEvent = function() {
            var e = "webRTCClientCreated",
                t = {
                    eventType: "webRTCClientCreated",
                    time: new Date
                };
            this.eventDispatchMgr(e, t)
        }, this.createUpdatePresenceEvent = function(e, t, i) {
            var n = "updatePresence",
                s = {
                    eventType: "updatePresence",
                    time: new Date,
                    connectedUsersList: e,
                    connectedUsersListWithStatus: i,
                    state: t
                };
            this.eventDispatchMgr(n, s)
        }, this.createUpdateUserStatusEvent = function(e) {
            var t = "updateUserStatus",
                i = {
                    eventType: "updateUserStatus",
                    time: new Date,
                    message: e
                };
            this.eventDispatchMgr(t, i)
        }, this.createGroupChatCreationEvent = function(e, t, i, n, s, a) {
            var o = "groupChatCreation",
                l = {
                    eventType: "groupChatCreation",
                    time: new Date,
                    status: e,
                    groupChatId: t,
                    initialDestId: i,
                    invitationSendedToInitialDestId: n,
                    newContactId: s,
                    invitationSendedToNewContactId: a
                };
            this.eventDispatchMgr(o, l)
        }, this.createGroupChatInvitationEvent = function(e, t, i, n, s) {
            var a = "groupChatInvitation",
                o = {
                    eventType: "groupChatInvitation",
                    time: new Date,
                    groupChatId: e,
                    contactList: s,
                    senderId: t,
                    senderNickname: i,
                    senderPhotoURL: n
                };
            this.eventDispatchMgr(a, o)
        }, this.createGroupChatMemberUpdateEvent = function(e, t, i) {
            var n = "groupChatMemberUpdate",
                s = {
                    eventType: "groupChatMemberUpdate",
                    time: new Date,
                    groupChatId: e,
                    contactList: t,
                    status: i
                };
            this.eventDispatchMgr(n, s)
        }, this.createAddUserInGroupChatEvent = function(e, t, i) {
            var n = "addUserInGroupChatAnswer",
                s = {
                    eventType: "addUserInGroupChatAnswer",
                    time: new Date,
                    invitationSended: e,
                    groupChatId: t,
                    contactId: i
                };
            this.eventDispatchMgr(n, s)
        }, this.createReceiveGroupChatMessageEvent = function(e, t, i, n) {
            var s = "receiveGroupChatMessage",
                a = {
                    eventType: "receiveGroupChatMessage",
                    time: new Date,
                    groupChatId: e,
                    senderId: t,
                    senderNickname: i,
                    message: n
                };
            this.eventDispatchMgr(s, a)
        }, this.createReceiveConversationListAnswerEvent = function(e) {
            var t = "receiveConversationList",
                i = {
                    eventType: "receiveConversationList",
                    time: new Date,
                    convList: e
                };
            this.eventDispatchMgr(t, i)
        }, this.createReceiveContactOccurrencesFromConversationListAnswerEvent = function(e) {
            var t = "receiveContactOccurrencesFromConversationList",
                i = {
                    eventType: "receiveContactOccurrencesFromConversationList",
                    time: new Date,
                    occurrencesList: e
                };
            this.eventDispatchMgr(t, i)
        }, this.createReceiveConversationDetailReportAnswerEvent = function(e) {
            var t = "receiveConversationDetailReport",
                i = {
                    eventType: "receiveConversationDetailReport",
                    time: new Date,
                    CDR: e
                };
            this.eventDispatchMgr(t, i)
        }, this.createReceiveConversationHistoryEvent = function(e, t, i) {
            var n = "receiveConversationHistory",
                s = {
                    eventType: "receiveConversationHistory",
                    time: new Date,
                    convId: e,
                    convHistory: t,
                    status: i
                };
            this.eventDispatchMgr(n, s)
        }, this.createUserDataAnswerEvent = function(e, t, i, n) {
            var s = "userDataAnswer",
                a = {
                    eventType: "userDataAnswer",
                    time: new Date,
                    userFound: e,
                    contactId: t,
                    nickname: i,
                    photoURL: n
                };
            this.eventDispatchMgr(s, a)
        }, this.createReceiveDataEvent = function(e, t, i) {
            var n = "receiveData",
                s = {
                    eventType: "receiveData",
                    time: new Date,
                    senderId: e,
                    dstRoomId: t,
                    data: i
                };
            this.eventDispatchMgr(n, s)
        }, this.createMCUSessionCreationEvent = function(e, t) {
            var i = "MCUSessionCreation",
                n = {
                    eventType: "MCUSessionCreation",
                    time: new Date,
                    sessionId: e,
                    token: t
                };
            this.eventDispatchMgr(i, n)
        }, this.createJoinMCUSessionAnswerEvent = function(e, t, i, n) {
            var s = "joinMCUSessionAnswer",
                a = {
                    eventType: "joinMCUSessionAnswer",
                    time: new Date,
                    sessionId: e,
                    token: t,
                    groupChatId: i,
                    initiator: n
                };
            this.eventDispatchMgr(s, a)
        }, this.createMCUAvailableStreamEvent = function(e, t) {
            var i = "MCUAvailableStream",
                n = {
                    eventType: "MCUAvailableStream",
                    time: new Date,
                    streams: e,
                    isRemoteStream: t
                };
            this.eventDispatchMgr(i, n)
        }, this.createMCURemovedStreamEvent = function(e) {
            var t = "MCURemoveStream",
                i = {
                    eventType: "MCURemoveStream",
                    time: new Date,
                    streamId: e
                };
            this.eventDispatchMgr(t, i)
        }, this.createReceiveMCUSessionInvitationEvent = function(e, i, n, s) {
            n === t && (n = 0);
            var a = "receiveMCUSessionInvitation",
                o = {
                    eventType: "receiveMCUSessionInvitation",
                    time: new Date,
                    sessionId: e,
                    token: i,
                    groupChatId: n,
                    initiatorId: s
                };
            this.eventDispatchMgr(a, o)
        }, this.createMCUSessionConnectionEvent = function(e) {
            var t = "MCUSessionConnection",
                i = {
                    eventType: "MCUSessionConnection",
                    time: new Date,
                    userIdList: e
                };
            this.eventDispatchMgr(t, i)
        }, this.createMCUUserConnectionEvent = function(e) {
            var t = "MCUUserConnection",
                i = {
                    eventType: "MCUUserConnection",
                    time: new Date,
                    userIdList: e
                };
            this.eventDispatchMgr(t, i)
        }, this.createMCUUserDisconnectionEvent = function(e) {
            var t = "MCUUserDisconnection",
                i = {
                    eventType: "MCUUserDisconnection",
                    time: new Date,
                    userIdList: e
                };
            this.eventDispatchMgr(t, i)
        }, this.createRemoteStreamAddedEvent = function(e, t, i, n, s) {
            var a = "remoteStreamAdded",
                o = {
                    eventType: "remoteStreamAdded",
                    time: new Date,
                    callId: t,
                    callType: e,
                    stream: i,
                    remoteId: n,
                    destCallType: s
                };
            this.eventDispatchMgr(a, o)
        }, this.createCanPlayRemoteVideoEvent = function(e, t, i) {
            var n = "canPlayRemoteVideo",
                s = {
                    eventType: "canPlayRemoteVideo",
                    time: new Date,
                    videoDivId: e,
                    callType: t,
                    remoteId: i
                };
            this.eventDispatchMgr(n, s)
        }, this.createRecordedFileAvailableEvent = function(e) {
            var t = "recordedFileAvailable",
                i = {
                    eventType: "recordedFileAvailable",
                    time: new Date,
                    fileName: e
                };
            this.eventDispatchMgr(t, i)
        }, this.createRecordedStreamsAvailableEvent = function(e, t, i) {
            var n = "recordedStreamsAvailable",
                s = {
                    eventType: "recordedStreamsAvailable",
                    time: new Date,
                    confId: e,
                    userId1: t,
                    userId2: i
                };
            this.eventDispatchMgr(n, s)
        }, this.createStopRecordEvent = function() {
            var e = "stopRecord",
                t = {
                    eventType: "stopRecord",
                    time: new Date
                };
            this.eventDispatchMgr(e, t)
        }, this.createSnapShotPhotoUploaded = function(e) {
            var t = "snapShotPhotoUploaded",
                i = {
                    eventType: "snapShotPhotoUploaded",
                    time: new Date,
                    fileName: e
                };
            this.eventDispatchMgr(t, i)
        }, this.createRoomCreationEvent = function(e, t, i) {
            var n = "roomCreation",
                s = {
                    eventType: "roomCreation",
                    time: new Date,
                    status: e,
                    roomId: t,
                    roomType: i
                };
            this.eventDispatchMgr(n, s)
        }, this.createRoomInvitationEvent = function(e, t, i, n, s, a) {
            var o = "roomInvitation",
                l = {
                    eventType: "roomInvitation",
                    time: new Date,
                    roomId: e,
                    contactList: s,
                    senderId: t,
                    senderNickname: i,
                    senderPhotoURL: n,
                    roomType: a
                };
            this.eventDispatchMgr(o, l)
        }, this.createRoomMemberUpdateEvent = function(e, t, i, n) {
            var s = "roomMemberUpdate",
                a = {
                    eventType: "roomMemberUpdate",
                    time: new Date,
                    roomId: e,
                    contactList: t,
                    status: i,
                    roomType: n
                };
            this.eventDispatchMgr(s, a)
        }, this.createReceiveRoomMessageEvent = function(e, t, i, n, s) {
            var a = "receiveRoomMessage",
                o = {
                    eventType: "receiveRoomMessage",
                    time: new Date,
                    roomId: e,
                    senderId: t,
                    senderNickname: i,
                    message: n,
                    roomType: s
                };
            this.eventDispatchMgr(a, o)
        }, this.createDesktopCaptureEvent = function(e, t, i) {
            var n = "desktopCapture",
                s = {
                    eventType: "desktopCapture",
                    time: new Date,
                    event: e,
                    callId: t,
                    remoteId: i
                };
            this.eventDispatchMgr(n, s)
        }, this.createSwitchStreamEvent = function(e, t) {
            var i = "switchStream",
                n = {
                    eventType: "switchStream",
                    time: new Date,
                    callId: e,
                    stream: t
                };
            this.eventDispatchMgr(i, n)
        }, this.createConnectedUsersListUpdateEvent = function(e, t) {
            var i = "connectedUsersListUpdate",
                n = {
                    eventType: "ConnectedUsersListUpdate",
                    time: new Date,
                    group: e,
                    usersList: t
                };
            this.eventDispatchMgr(i, n)
        }, this.createClosingWhiteBoardEvent = function(e, t) {
            var i = "closingWhiteBoard",
                n = {
                    eventType: "closingWhiteBoard",
                    time: new Date,
                    roomId: e,
                    reason: t
                };
            this.eventDispatchMgr(i, n)
        }, this.createEvent = function(e) {
            if (!e.eventType) throw new Error("The event json must have an eventType" + e);
            e.time = new Date, this.eventDispatchMgr(e.eventType, e)
        }
    }, c = new r, d = {
        version: "3.3.0",
        description: "Apizee Cloud Communication Library",
        session: null,
        jsLoaded: !1,
        initApiKey: null,
        initApiCCId: null
    }, d.init = function(i) {
        var n = "";
        if (n = "https:" != e.location.protocol ? "http" : "https", "iOS" === w.name && (n = "https"), i.ccsServer === t && (i.ccsServer = "https:" != e.location.protocol && "iOS" !== w.name ? "ccs3.apizee.com:80" : "ccs3.apizee.com:443"), i.userData !== t, this.jsLoaded === !1)
            if (d.initApiKey = i.apiKey, d.initApiCCId = i.apiCCId, "function" == typeof define && define.amd) {
                var s = [],
                    a = n + "://" + i.ccsServer + "/socket.io/socket.io",
                    o = n + "://cloud.apizee.com/apiRTC/lib/RecordRTC",
                    l = "",
                    r = {};
                s.push("sio"), s.push("recordrtc"), r = {
                    sio: a,
                    recordrtc: o
                }, i.ApiDBActivated !== !1 && i.ApiDBActivated !== t && null !== i.ApiDBActivated && (l = i.ApiDBActivated === !0 ? n + "://cloud.apizee.com/apiRTC-DB/v1.0/apiRTC-DB-1.0.7.min" : n + ":" + i.ApiDBActivated + "apiRTC-DB/v1.0/apiRTC-DB-1.0.7.min", s.push("apirtcdb"), r.apirtcdb = l), require.config({
                    shim: {
                        sio: {
                            exports: "io"
                        }
                    },
                    wrap: !1,
                    paths: r
                }), require(s, function(t) {
                    e.rtcio = t, d.jsLoaded = !0, d.session = new d.ApiCCSession(i)
                })
            } else $LAB.script(function() {
                return n + "://" + i.ccsServer + "/socket.io/socket.io.js"
            }).script(function() {
                return i.ApiDBActivated === !1 || i.ApiDBActivated === t || null === i.ApiDBActivated ? null : i.ApiDBActivated === !0 ? n + "://cloud.apizee.com/apiRTC-DB/v1.0/apiRTC-DB-1.0.7.min.js" : n + ":" + i.ApiDBActivated + "apiRTC-DB/v1.0/apiRTC-DB-1.0.7.min.js"
            }).script(function() {
                return i.recordActivated === !0 ? n + "://cloud.apizee.com/apiRTC/lib/RecordRTC.js" : null
            }).wait(function() {
                e.rtcio = io, d.jsLoaded = !0, d.session = new d.ApiCCSession(i)
            });
        else i.apiCCId === t && (i.apiCCId = d.session.apiCCId), null !== i.userData && i.userData !== t && (d.session.userData = i.userData), d.session.reOpenChannel(i.apiCCId, i.apiKey), d.session.nickname = null !== i.nickname && i.nickname !== t ? i.nickname : d.session.apiCCId, d.session.photoURL = null !== i.photoURL && i.photoURL !== t ? i.photoURL : null, d.initApiKey = i.apiKey, d.initApiCCId = i.apiCCId
    }, d.registerIOsDevice = function(e) {
        var t = {
                type: "registerIOsDevice",
                senderId: d.session.apiCCId,
                token: e
            },
            i = JSON.stringify(t);
        d.session.channel.socket.emit("registerIOsDevice", i)
    }, d.registerAndroidDevice = function(e) {
        var t = {
                type: "registerAndroidDevice",
                senderId: d.session.apiCCId,
                token: e
            },
            i = JSON.stringify(t);
        d.session.channel.socket.emit("registerAndroidDevice", i)
    }, d.unRegisterIOsDevice = function(e) {
        var t = {
                type: "unRegisterIOsDevice",
                senderId: d.session.apiCCId,
                token: e
            },
            i = JSON.stringify(t);
        d.session.channel.socket.emit("unRegisterIOsDevice", i)
    }, d.unRegisterAndroidDevice = function(e) {
        var t = {
                type: "unRegisterAndroidDevice",
                senderId: d.session.apiCCId,
                token: e
            },
            i = JSON.stringify(t);
        d.session.channel.socket.emit("unRegisterAndroidDevice", i)
    }, d.disconnect = function() {
        null !== d.session && d.session !== t && (d.setCookie("apiCCId", d.session.apiCCId, 5e3), null !== d.session.sessionId && d.setCookie("sessionId", d.session.sessionId, 5e3), null !== d.session.apiCCWhiteBoardClient && null !== d.session.apiCCWhiteBoardClient.roomId && d.session.closeWhiteBoardClient("USER_DISCONNECTION"), d.session.channel.socket !== t && null !== d.session.channel.socket && d.session.channel.socket.disconnect(), d.session.channel.channelHasBeenDisconnected = !1, d.session.connectedUsersList.splice(0, d.session.connectedUsersList.length), d.session.channel.socket = null)
    }, d.cleanApiRTCContext = function() {
        null !== d.session && d.session !== t && (null !== d.session.apiCCWebRTCClient && d.session.apiCCWebRTCClient !== t && (0 !== d.session.apiCCWebRTCClient.webRTCClient.callsTable.length, null !== d.session.apiCCWebRTCClient.webRTCClient.MCUClient.sessionMCU, d.session.apiCCWebRTCClient.hangUp(), null !== d.session.apiCCWebRTCClient.webRTCClient.localStream && d.session.apiCCWebRTCClient.webRTCClient.stopStream(d.session.apiCCWebRTCClient.webRTCClient.localStream), d.session.apiCCWebRTCClient = null), null !== d.session.apiCCIMClient && d.session.apiCCIMClient !== t && (d.session.apiCCIMClient = null), null !== d.session.apiCCDataClient && d.session.apiCCDataClient !== t && (d.session.apiCCDataClient = null), null !== d.session.apiCCWhiteBoardClient && d.session.apiCCWhiteBoardClient !== t && (d.session.apiCCWhiteBoardClient = null), null !== d.session.apiCCCoBrowsingClient && d.session.apiCCCoBrowsingClient !== t && (d.session.apiCCCoBrowsingClient = null))
    }, d.myEventTable = [], d.addEventListener = function(e, t) {
        if ("sessionReady" == e || "incomingCall" == e || "callEstablished" == e || "remoteHangup" == e || "userMediaSuccess" == e || "userMediaError" == e || "error" == e || "receiveIMMessage" == e || "updatePresence" == e || "webRTCClientCreated" == e || "updateUserStatus" == e || "channelEvent" == e || "groupChatCreation" == e || "groupChatInvitation" == e || "groupChatMemberUpdate" == e || "addUserInGroupChatAnswer" == e || "receiveGroupChatMessage" == e || "userDataAnswer" == e || "receiveConversationList" == e || "receiveConversationHistory" == e || "receiveConversationDetailReport" == e || "receiveContactOccurrencesFromConversationList" == e || "receiveMCUSessionInvitation" == e || "MCUSessionCreation" == e || "MCUSessionConnection" == e || "MCUUserConnection" == e || "MCUUserDisconnection" == e || "MCUAvailableStream" == e || "MCURemoveStream" == e || "canPlayRemoteVideo" == e || "recordedFileAvailable" == e || "receiveData" == e || "roomCreation" == e || "roomInvitation" == e || "roomMemberUpdate" == e || "receiveRoomMessage" == e || "snapShotPhotoUploaded" == e || "stopRecord" == e || "mcu" == e || "callAttempt" == e || "joinMCUSessionAnswer" == e || "hangup" == e || "desktopCapture" == e || "remoteStreamAdded" == e || "switchStream" == e || "sendDataChannelOpen" == e || "sendDataChannelClose" == e || "sendDataChannelError" == e || "receiveDataChannelOpen" == e || "receiveDataChannelClose" == e || "receiveDataChannelError" == e || "connectedUsersListUpdate" == e || "onFileSended" == e || "onFileSending" == e || "onFileReceiving" == e || "onFileReceived" == e || "onFileProgress" == e || "recordedStreamsAvailable" == e || "closingWhiteBoard" == e || "webRTCPluginInstallation" == e || "onQosChange" == e || "onQosAudioChange" == e || "onQosVideoChange" == e) {
            document.addEventListener && I === !0 ? document.addEventListener(e, t, !1) : "undefined" != typeof $jqApz ? $jqApz(document).on(e, t) : "undefined" != typeof jQuery && jQuery(document).on(e, t);
            var i = {
                    type: e,
                    listener: t
                },
                n = d.myEventTable.push(i);
            i = null, n = 0
        } else c.createErrorEvent("ERROR: Trying to add a listener on an unknow event", "UNKNOWN_EVENT_ON_ADDLISTENER")
    }, d.removeEventListener = function(e, t) {
        document.removeEventListener ? document.removeEventListener(e, t, !1) : "undefined" != typeof jQuery && jQuery(document).off(e, t)
    }, d.setCookie = function(e, t, i) {
        i = i || 36e5;
        var n = new Date,
            s = new Date;
        s.setTime(n.getTime() + i), document.cookie = e + "=" + encodeURIComponent(t) + ";expires=" + s.toGMTString()
    }, e.onbeforeunload = function() {
        try {
            if ("undefined" != typeof mailClicked && null !== mailClicked && mailClicked === !0) return void(mailClicked = !1)
        } catch (e) {}
        null !== d && (d.cleanApiRTCContext(), d.disconnect());
        var t = 0,
            i = 0;
        if (null !== d && (t = d.myEventTable.length), 0 !== t) {
            for (i = 0; t > i; i += 1) d.removeEventListener(d.myEventTable[i].type, d.myEventTable[i].listener);
            this.apiCC.myEventTable.splice(0, t), t = d.myEventTable.length, d.myEventTable = null
        }
        null !== d && (d.session = null), r = null, c = null, h = null, u = null, C = null, p = null, m = null, null !== d && (d.ApiCCSession = null, d.ApiCCIMClient = null, d = null)
    }, h = function(i) {
        this.channelReady = !1, this.socket = null, this.channelId = i.apiCCId, this.callURLDestRoom = 0, this.myWebRTC_Event = new r, this.channelHasBeenDisconnected = !1, this.cSeq = 0, this.socketio_1X = !1, this.initialize = function() {
            this.openChannel()
        }, this.getNewCSeq = function() {
            return this.cSeq = this.cSeq + 1, this.cSeq
        }, this.openChannel = function() {
            var n = "",
                s = null,
                a = null,
                o = null,
                l = null,
                r = null,
                c = null,
                h = null,
                u = null,
                C = null,
                p = null,
                m = "80",
                v = "",
                f = null;
            i.xhrPolling = !0, h = i.appId !== t ? "&appId=" + i.appId : "", u = i.siteId !== t ? "&siteId=" + i.siteId : "", i.userData !== t && (s = JSON.stringify(i.userData), s.length <= 500 && (a = encodeURIComponent(s), n = "&userData=" + a)), i.presenceGroup !== t && (o = JSON.stringify(i.presenceGroup), o.length <= 500 && (l = encodeURIComponent(o), n += "&presenceGroup=" + l)), i.subscribeToPresenceGroup !== t && (r = JSON.stringify(i.subscribeToPresenceGroup), r.length <= 500 && (c = encodeURIComponent(r), n += "&subscribeToPresenceGroup=" + c)), i.token !== t && (n += "&token=" + i.token), -1 !== i.ccsServer.indexOf(":") ? (f = i.ccsServer.split(":"), v = f[0], m = f[1]) : (v = i.ccsServer, m = "https:" == e.location.protocol || "iOS" === w.name ? "443" : "80"), "ccs2.apizee.com" !== v ? (this.socketio_1X = !0, C = "?channelId=" + this.channelId + "&apiKey=" + i.apiKey + "&apiVersion=" + d.version + "&sessionId=" + i.sessionId + h + u + n, p = null, p = "https:" == e.location.protocol ? "https" : "http", "iOS" === w.name && (p = "https"), this.socket = rtcio.connect(p + "://" + i.ccsServer + "/" + C, {
                forceNew: !0,
                multiplex: !1
            })) : this.socket = i.xhrPolling === !0 ? "https:" != e.location.protocol && "iOS" !== w.name ? rtcio.connect("http://" + i.ccsServer + "/?channelId=" + this.channelId + "&apiKey=" + i.apiKey + "&apiVersion=" + d.version + "&sessionId=" + i.sessionId + h + u + n, {
                transports: ["xhr-polling"],
                "force new connection": !0,
                port: m
            }) : rtcio.connect("https://" + i.ccsServer + "/?channelId=" + this.channelId + "&apiKey=" + i.apiKey + "&apiVersion=" + d.version + "&sessionId=" + i.sessionId + h + u + n, {
                transports: ["xhr-polling"],
                "force new connection": !0,
                secure: !0,
                port: m
            }) : "https:" != e.location.protocol && "iOS" !== w.name ? rtcio.connect("http://" + i.ccsServer + "/?channelId=" + this.channelId + "&apiKey=" + i.apiKey + "&apiVersion=" + d.version + "&sessionId=" + i.sessionId + n, {
                "force new connection": !0
            }) : rtcio.connect("https://" + i.ccsServer + "/?channelId=" + this.channelId + "&apiKey=" + i.apiKey + "&apiVersion=" + d.version + "&sessionId=" + i.sessionId + n, {
                "force new connection": !0,
                secure: !0,
                port: m
            }), this.socket.on("connect", this.callback(this, "onChannelOpened")).on("message", this.callbackWithParams(this, "onChannelMessage")).on("error", this.callback(this, "onChannelError")).on("bye", this.callback(this, "onChannelBye")).on("close", this.callback(this, "onChannelClosed")).on("connecting", this.callback(this, "onChannelConnecting")).on("disconnect", this.callback(this, "onChannelDisconnect")).on("connect_failed", this.callback(this, "onChannelConnect_failed")).on("reconnect_failed", this.callback(this, "onChannelReconnect_failed")).on("reconnect", this.callback(this, "onChannelReconnect")).on("reconnecting", this.callback(this, "onChannelReconnecting"))
        }, this.onChannelConnecting = function() {
            this.myWebRTC_Event.createChannelEvent("onChannelConnecting")
        }, this.onWhiteBoardDisconnection = function() {
            d.session.closeWhiteBoardClient("NETWORK_DISCONNECTION")
        }, this.onChannelDisconnect = function() {
            var e = Date();
            e = null, d.session.connectedUsersList.splice(0, d.session.connectedUsersList.length), this.myWebRTC_Event.createChannelEvent("onChannelDisconnect"), this.channelHasBeenDisconnected = !0, null !== d.session.apiCCWhiteBoardClient && null !== d.session.apiCCWhiteBoardClient.roomId && (d.session.apiCCWhiteBoardClient.whiteBoardDisconnectionTimeoutId = setTimeout(this.callback(this, "onWhiteBoardDisconnection"), d.session.apiCCWhiteBoardClient.disconnectionTimer))
        }, this.onChannelConnect_failed = function() {	
            this.myWebRTC_Event.createChannelEvent("onChannelConnect_failed")
        }, this.onChannelReconnect_failed = function() {
            this.myWebRTC_Event.createChannelEvent("onChannelReconnect_failed")
        }, this.onChannelReconnect = function() {
            var e = null,
                t = 0,
                i = 0,
                n = [],
                s = null,
                a = null,
                o = null,
                l = !1,
                r = 0;
            if (null !== d.session.apiCCIMClient && d.session.apiCCIMClient.userDataSetted === !0 && (e = {
                    photoURL: d.session.apiCCIMClient.photoURL
                }, d.session.apiCCIMClient.setUserData(e)), null !== d.session.apiCCWebRTCClient && (t = d.session.apiCCWebRTCClient.webRTCClient.callsTable.length, 0 !== t)) {
                for (i = 0; t > i; i += 1) s = {
                    destId: d.session.apiCCWebRTCClient.webRTCClient.callsTable[i].remoteId,
                    convId: d.session.apiCCWebRTCClient.webRTCClient.callsTable[i].callId,
                    callType: d.session.apiCCWebRTCClient.webRTCClient.callsTable[i].callType,
                    roomId: d.session.apiCCWebRTCClient.webRTCClient.callsTable[i].dest_roomId
                }, n.push(s);
                l = !0
            }
            null !== d.session.apiCCWhiteBoardClient && (0 !== d.session.apiCCWhiteBoardClient.whiteBoardDisconnectionTimeoutId && (clearTimeout(d.session.apiCCWhiteBoardClient.whiteBoardDisconnectionTimeoutId), d.session.apiCCWhiteBoardClient.whiteBoardDisconnectionTimeoutId = 0), null !== d.session.apiCCWhiteBoardClient.roomId && (r = d.session.apiCCWhiteBoardClient.roomId, l = !0)), l === !0 && (a = {
                type: "reconnectContext",
                callList: n,
                whiteBoardRoomId: r
            }, o = JSON.stringify(a), d.session.channel.socket.emit("reconnectContext", o)), n.splice(0, n.length), this.myWebRTC_Event.createChannelEvent("onChannelReconnect")
        }, this.onChannelReconnecting = function() {
            var e = Date();
            e = null, this.myWebRTC_Event.createChannelEvent("onChannelReconnecting")
        }, this.onChannelOpened = function() {
            this.channelReady = !0, this.channelHasBeenDisconnected === !1 ? i.onChannelOpened() : (this.channelHasBeenDisconnected = !1, i.ApiDBActivated !== !1 && i.ApiDBActivated !== t && null !== i.ApiDBActivated && apiDB.init(i.channel.socket), this.socketio_1X === !0 && (i.updateUserDataToBeDone = !0)), this.myWebRTC_Event.createChannelEvent("onChannelOpened")
        }, this.onChannelMessage = function(e, n) {
            var s = JSON.parse(e),
                a = null;
            "IMMessage" === s.type && (a = s.IMId), n !== t && n({
                reason: "ack",
                convId: a
            }), i.processSignalingMessage(s)
        }, this.onChannelError = function() {
            this.myWebRTC_Event.createChannelEvent("onChannelError")
        }, this.onChannelClosed = function() {
            this.myWebRTC_Event.createChannelEvent("onChannelClosed")
        }, this.onChannelBye = function(e) {
            var t = JSON.parse(e);
            t = null
        }, this.callback = function(e, t) {
            return this.closureHandler = function(i) {
                return e[t](i)
            }, this.closureHandler
        }, this.callbackWithParams = function(e, t) {
            return this.closureHandler = function(i, n, s) {
                return e[t](i, n, s)
            }, this.closureHandler
        }
    }, u = function(e) {
        this.sendInvite = function(i, n, s, a, o, l, r, c, d) {
            var h = null,
                u = null,
                C = null;
            (r === t || null === r) && (r = "media"), null === d && (d = t), ("IE" === f || "Safari" === f) && (C = {}, C.sdp = l.sdp, C.type = l.type, l = C), h = null !== c ? {
                type: "invite",
                callId: i,
                callerId: n,
                callerNickname: s,
                calleeId: a,
                roomId: o,
                sdpoffer: l,
                callType: r,
                data: c,
                stream: d
            } : {
                type: "invite",
                callId: i,
                callerId: n,
                callerNickname: s,
                calleeId: a,
                roomId: o,
                sdpoffer: l,
                callType: r
            }, u = JSON.stringify(h), e.emit("invite", u)
        }, this.sendInviteBroadcast = function(t, i, n, s, a, o) {
            var l = null,
                r = null;
            l = {
                type: "invite",
                callId: t,
                callerId: i,
                callerNickname: n,
                calleeId: s,
                roomId: a,
                sdpoffer: o
            }, r = JSON.stringify(l), e.emit("invite_broadcast", r)
        }, this.send200OK = function(t, i, n, s, a, o, l) {
            var r = null,
                c = null,
                d = null;
            ("IE" === f || "Safari" === f) && (d = {}, d.sdp = o.sdp, d.type = o.type, o = d), r = {
                type: "200OK",
                callId: t,
                callerId: i,
                calleeId: n,
                calleeNickname: s,
                roomId: a,
                sdpanswer: o,
                data: l
            }, c = JSON.stringify(r), e.emit("200OK", c)
        }, this.sendCandidate = function(t, i, n, s, a, o, l, r, c, d) {
            var h = null,
                u = null;
            h = null !== c && "IE" !== f ? {
                type: "candidate",
                callId: t,
                callerId: i,
                calleeId: n,
                roomId: s,
                dst: a,
                label: o,
                id: l,
                candidate: r,
                data: c,
                completeCandidate: d
            } : {
                type: "candidate",
                callId: t,
                callerId: i,
                calleeId: n,
                roomId: s,
                dst: a,
                label: o,
                id: l,
                candidate: r
            }, u = JSON.stringify(h), e.emit("candidate", u)
        }, this.sendBye = function(t, i, n, s, a, o) {
            var l = null,
                r = null;
            l = null !== o ? {
                type: "bye",
                callId: t,
                clientId: i,
                roomId: n,
                dst: s,
                reason: a,
                data: o
            } : {
                type: "bye",
                callId: t,
                clientId: i,
                roomId: n,
                dst: s,
                reason: a
            }, r = JSON.stringify(l), e.emit("bye", r)
        }, this.sendUpdate = function(t, i, n, s, a, o) {
            var l = null,
                r = null;
            l = {
                type: "update",
                callId: t,
                callerId: i,
                calleeId: n,
                roomId: s,
                dst: a,
                sdpoffer: o
            }, r = JSON.stringify(l), e.emit("update", r)
        }, this.send200Update = function(t, i, n, s, a, o) {
            var l = null,
                r = null;
            l = {
                type: "200update",
                callId: t,
                callerId: i,
                calleeId: n,
                roomId: s,
                dst: a,
                sdpanswer: o
            }, r = JSON.stringify(l), e.emit("200update", r)
        }, this.sendDebugCommand = function(t, i, n) {
            var s = null,
                a = null;
            s = {
                type: "debugCommand",
                command: t,
                apiKey: i,
                clientId: n
            }, a = JSON.stringify(s), e.emit("debugCommand", a)
        }, this.sendAck = function(t, i, n) {
            var s = null,
                a = null;
            s = {
                type: "Ack",
                AckMessageType: t,
                cSeq: i,
                dst: n
            }, a = JSON.stringify(s), e.emit("Ack", a)
        }
    }, C = function() {
        this.webrtcDetectedBrowser = adapter.browserDetails.browser, this.webrtcDetectedVersion = adapter.browserDetails.version, "undefined" != typeof RTCSessionDescription && (this.RTCSessionDescription = RTCSessionDescription), "undefined" != typeof RTCIceCandidate && (this.RTCIceCandidate = RTCIceCandidate), "iOS" === w.name ? (this.RTCPeerConnection = e.RTCPeerConnection, this.getUserMedia = navigator.getUserMedia, this.attachMediaStream = function(e, t) {
            "undefined" != typeof e.srcObject ? e.srcObject = t : "undefined" != typeof e.mozSrcObject ? e.mozSrcObject = t : "undefined" != typeof e.src && (e.src = URL.createObjectURL(t))
        }) : ("undefined" != typeof RTCPeerConnection && (this.RTCPeerConnection = RTCPeerConnection), "undefined" != typeof navigator.getUserMedia ? this.getUserMedia = navigator.getUserMedia : "undefined" != typeof getUserMedia && (this.getUserMedia = getUserMedia), "undefined" != typeof adapter.browserShim && "undefined" != typeof adapter.browserShim.attachMediaStream && (this.attachMediaStream = adapter.browserShim.attachMediaStream))
    }, b = function(e, i) {
        this.defaultPub = "licodeConnector", this.sessionMCU = null, this.streamList = [], this.receiveSessionId = function(e) {
            c.createMCUSessionCreationEvent(e.sessionId, e.token), this.publish(e.sessionId, e.token)
        }, this.sendSessionInvitation = function(e, n, s) {
            if (null !== n && n !== t) {
                var a = null,
                    o = null;
                s === t && (s = 0), a = {
                    type: "MCUSessionInvitation",
                    srcId: i,
                    destId: e,
                    sessionId: n,
                    groupChatId: s
                }, o = JSON.stringify(a), d.session.channel.socket.emit("MCUSessionInvitation", o)
            }
        }, this.sendSessionInvitationToGroupChat = function(e, n) {
            if (null !== e && e !== t && null !== n && n !== t) {
                var s = null,
                    a = null;
                s = {
                    type: "MCUSessionInvitationToGroupChat",
                    srcId: i,
                    groupChatId: e,
                    sessionId: n
                }, a = JSON.stringify(s), d.session.channel.socket.emit("MCUSessionInvitationToGroupChat", a)
            }
        }, this.receiveSessionInvitation = function(e) {
            c.createReceiveMCUSessionInvitationEvent(e.sessionId, e.token, e.groupChatId, e.srcId)
        }, this.acceptSessionInvitation = function(e, t) {
            this.publish(e, t)
        }, this.leaveSession = function() {
            null !== this.sessionMCU && (d.session.apiCCWebRTCClient.webRTCClient.onHangup(), this.sessionMCU = null)
        }, this.joinSession = function(e) {
            var t = null,
                i = null;
            t = {
                type: "joinSession",
                roomId: e,
                callerId: d.session.apiCCWebRTCClient.webRTCClient.clientId,
                data: {
                    pubSub: this.defaultPub
                }
            }, i = JSON.stringify(t), d.session.channel.socket.emit("joinSession", i)
        }, this.joinSessionAnswer = function(e) {
            this.sessionMCU = {}, this.sessionMCU.roomID = e.sessionId, this.sessionMCU.roomName = e.roomName;
            var t = [];
            t.push(e.roomName), d.session.sendPresenceGroupManagementCommand("join", t), d.session.sendPresenceGroupManagementCommand("subscribe", t), c.createJoinMCUSessionAnswerEvent(e.sessionId, e.token, e.groupChatId, e.initiator)
        }, this.getStreamList = function() {
            return this.streamList
        }, this.getStreamFromList = function(e) {
            var t = 0;
            for (t = 0; t < this.streamList.length; t += 1)
                if (this.streamList[t].streamInfo.id === e) return this.streamList[t].streamInfo;
            return null
        }, this.getStreamIdOfUser = function(e) {
            var t = 0;
            for (t = 0; t < this.streamList.length; t += 1)
                if (this.streamList[t].userId === e) return this.streamList[t].streamInfo.id;
            return null
        }, this.newAvailableStream = function(e) {
            var t = !1,
                n = 0,
                s = null;
            for (t = e[0].attributes.callerId === i ? !1 : !0, n = 0; n < e.length; n += 1) s = {
                userId: e[n].attributes.callerId,
                roomId: this.sessionMCU.roomID,
                isRemoteStream: t,
                streamInfo: e[n]
            }, this.streamList.push(s);
            c.createMCUAvailableStreamEvent(e, t)
        }, this.subscribeToStreams = function(e, i) {
            var n, s, a = [],
                o = null;
            for (s in e) n = e[s], a[s] = new p(d.session.apiCCWebRTCClient.webRTCClient), o = a[s], o.data.pubSub = this.defaultPub, o.data.type = "subscribe", ("audio" == n.attributes.callType || i === !0) && (o.audioOnly = !0), o.mcuRemoteStream = n, o.dest_roomId = this.sessionMCU.roomName, o.calleeId = this.sessionMCU.roomName, o.generateCallId(), o.callerId = d.session.apiCCWebRTCClient.webRTCClient.clientId, d.session.apiCCWebRTCClient.webRTCClient.callsTable.push(o), o.createPeerConnection(!0), o.doCall(), o.started = !0, o.callType = n.attributes.callType, o.remoteId = n.attributes.callerId, o.remoteMailAddress = n.attributes.mailAddress, n.id === t && alert("stream.id is undefined :", n), o.streamId = n.id
        }, this.unsubscribe = function(e) {
            var i = d.session.apiCCWebRTCClient.webRTCClient.findCallWithStreamId(e);
            null === i || i.callId !== t && d.session.apiCCWebRTCClient.webRTCClient.onHangup(i.callId)
        }, this.publish = function(t, i, n, s) {
            var a = d.session.apiCCWebRTCClient.webRTCClient.callsTable.length,
                o = new p(d.session.apiCCWebRTCClient.webRTCClient);
            return (1 == s || "true" == s) && (o.audioOnly = !0), o.dest_roomId = this.sessionMCU.roomName, o.calleeId = this.sessionMCU.roomName, o.data.pubSub = this.defaultPub, o.data.type = "publish", o.mediaConstraints = "firefox" === d.session.apiCCWebRTCClient.webRTCClient.myWebRTC_Adapter.webrtcDetectedBrowser && d.session.apiCCWebRTCClient.webRTCClient.myWebRTC_Adapter.webrtcDetectedVersion > 43 ? {
                offerToReceiveAudio: !1,
                offerToReceiveVideo: !1
            } : {
                mandatory: {
                    OfferToReceiveAudio: !1,
                    OfferToReceiveVideo: !1
                }
            }, o.generateCallId(), o.callerId = d.session.apiCCWebRTCClient.webRTCClient.clientId, null !== e.localStream ? (0 === e.localStream.getVideoTracks().length && (o.audioOnly = !0), o.onUserMediaSuccessOnCall(e.localStream), o.establishCall()) : o.getUserMediaOnCall(), a = d.session.apiCCWebRTCClient.webRTCClient.callsTable.push(o), o.callId;

        }, this.publishScreen = function() {
            var e = {};
            e.pubSub = this.defaultPub, e.type = "publish", d.session.apiCCWebRTCClient.webRTCClient.shareScreen(this.sessionMCU.roomID, e)
        }, this.unpublish = function(e) {
            d.session.apiCCWebRTCClient.webRTCClient.onHangup(e)
        }, this.removeMCUStream = function(e, i) {
            var n = 0;
            for (n = 0; n < this.streamList.length; n += 1)
                if (this.streamList[n].streamInfo.id === i) {
                    this.streamList.splice(n, 1);
                    break
                }
            e !== t && d.session.apiCCWebRTCClient.webRTCClient.onHangup(e), c.createMCURemovedStreamEvent(i)
        }, this.callback = function(e, t) {
            return this.closureHandler = function(i) {
                return e[t](i)
            }, this.closureHandler
        }
    }, v = function() {
        this.getSDPLines = function(e) {
            var t = e.split("\r\n"),
                i = 0;
            for (i = 0; i < t.length; i += 1);
            return t
        }, this.getVideoMediaDescriptionPart = function(e) {
            var t = e.split("m=video"),
                i = 0;
            for (i = 0; i < t.length; i += 1);
            return t[1]
        }, this.searchMediaDescriptionForRecvOnly = function(e) {
            return -1 !== e.search("a=recvonly") ? !0 : !1
        }, this.searchSDPForVideoRecvOnly = function(e) {
            return e !== t ? this.searchMediaDescriptionForRecvOnly(e) : !1
        }, this.stripVideoMediaDescriptionFromSDP = function(e) {
            e = e.replace("a=group:BUNDLE audio video", "a=group:BUNDLE audio");
            var t = e.split("m=video"),
                i = 0;
            for (i = 0; i < t.length; i += 1);
            return t[0]
        }, this.setAudioBandwidth = function(e, t) {
            return t ? e = e.replace(/a=mid:audio\r\n/g, "a=mid:audio\r\nb=AS:" + t + "\r\n") : e
        }, this.setVideoBandwidth = function(e, t) {
            return t ? e = e.replace(/a=mid:video\r\n/g, "a=mid:video\r\nb=AS:" + t + "\r\n") : e
        }, this.setDataBandwidth = function(e, t) {
            return t ? e = e.replace(/a=mid:data\r\n/g, "a=mid:data\r\nb=AS:" + t + "\r\n") : e
        }, this.updateSDPcodecs = function(t, i, n, s) {
            var a, o, l, r, c, d, h, u, C = !1,
                p = new RegExp("\r\n$"),
                m = !1,
                v = null,
                f = null,
                g = "",
                b = "",
                I = "",
                T = "",
                R = "",
                S = "",
                y = "",
                D = "";
            if ("" == s) return t;
            for (l = RTCSessionDescription && t instanceof RTCSessionDescription ? t.sdp : e.SessionDescription && t instanceof SessionDescription ? t.toSdp() : t, l = l.split("\r\nm="), p.test(l[l.length - 2]) === !1 && (l[l.length - 2] = l[l.length - 2] + "\r\n", m = !0), a = 0; a < l.length; a++)
                if (0 == l[a].indexOf(n)) {
                    for (v = l[a].split("\r\n"), f = v[0].split(" "), o = 3; o < f.length; o++)
                        if (r = !0, 0 == isNaN(f[o])) {
                            switch (g = "", b = "a=rtpmap:" + f[o] + " ", c = l[a].indexOf(b), -1 != c && (d = l[a].indexOf("\r\n", c)), f[o]) {
                                case 0:
                                    g = "PCMU/8000";
                                    break;
                                case 8:
                                    g = "PCMA/8000";
                                    break;
                                case 9:
                                    g = "G722/8000";
                                    break;
                                case 13:
                                    g = "CN/8000";
                                    break;
                                case 18:
                                    g = "G729/8000";
                                    break;
                                default:
                                    g = -1 != c ? l[a].substring(c + b.length, d) : ""
                            }
                            "" != g && -1 != s.indexOf(g) || (r = !1), r || (I = b + ".*\r\n", T = "a=fmtp:" + f[o] + " .*\r\n", R = " " + f[o] + " ", S = " " + f[o] + "\r", l[a] = l[a].replace(new RegExp(I, "g"), ""), l[a] = l[a].replace(new RegExp(T, "g"), ""), h = l[a].split("\n"), u = h[0].split("RTP"), u[1] = u[1].replace(R, " "), u[1] = u[1].replace(S, "\r"), h[0] = u.join("RTP"), l[a] = h.join("\n"), "video" == n && (y = "a=rtcp-fb:" + f[o] + " .*\r\n", l[a] = l[a].replace(new RegExp(y, "g"), ""), "" != g && "rtx/" == g.substr(0, 4) && (D = "a=ssrc-group:FID .*\r\n", l[a] = l[a].replace(new RegExp(D, "g"), ""), h = l[a].split("\r\na="), h.splice(h.length - 8, 4), l[a] = h.join("\r\na="))), C = !0)
                        }
                    break
                }
            return m && (l[l.length - 2] = l[l.length - 2].substr(0, l[l.length - 2].length - 2)), l = l.join("\r\nm="), C === !0 ? RTCSessionDescription && t instanceof RTCSessionDescription ? new RTCSessionDescription({
                type: i,
                sdp: l
            }) : e.SessionDescription && t instanceof SessionDescription ? new SessionDescription(l) : l : t
        }
    }, T = function(e, i) {
        this.recordAudio = null, this.recordVideo = null, this.recordOngoing = !1, this.uploadServerAddress = i, this.sessionIdForRecord = null, this.timerRef = 0, this.setUploadServerAddress = function(e) {
            this.uploadServerAddress = e
        }, this.record = function(i, n, s, a) {
            this.sessionIdForRecord = a, "local" === i && ("audio" === n || "video" === n || "videoOnly" === n) && (null === e.localStream || e.localStream === t, this.recordStream(e.localStream, n) === !0 && (this.timerRef = setTimeout(this.callback(this, "stopRecord"), s)))
        }, this.stop = function() {
            clearTimeout(this.timerRef), this.timerRef = 0, this.stopRecord()
        }, this.xhr = function(e, t, i) {
            var n = new XMLHttpRequest;
            n.onreadystatechange = function() {
                4 == n.readyState && 200 == n.status && i(n.responseText)
            }, n.open("POST", e), n.send(t)
        }, this.recordStream = function(e, t) {
            if (this.recordOngoing === !0) return !1;
            if (this.recordOngoing = !0, this.recordType = t, "videoOnly" !== this.recordType && (this.recordAudio = new RecordRTC(e, {
                    bufferSize: 16384,
                    sampleRate: 44100
                })), "audio" !== this.recordType) {
                var i = {
                    type: "video",
                    video: {
                        width: 320,
                        height: 240
                    },
                    canvas: {
                        width: 320,
                        height: 240
                    }
                };
                this.recordVideo = new RecordRTC(e, i)
            }
            return "videoOnly" !== this.recordType && this.recordAudio.startRecording(), "audio" !== this.recordType && this.recordVideo.startRecording(), !0
        }, this.postBlob = function(e, t, i) {
            var n = new FormData;
            n.append("destFileName", i), n.append("fichier", e), n.append("sessionId", this.sessionIdForRecord), this.xhr(this.uploadServerAddress, n, function(e) {
                c.createRecordedFileAvailableEvent(JSON.parse(e).fileUrl)
            })
        }, this.stopRecord = function() {
            var t = new Date,
                i = t.toJSON(),
                n = i.replace(new RegExp(":", "g"), "-");
            c.createStopRecordEvent(), this.fileName = e.clientId + "-" + n, "videoOnly" !== this.recordType && this.recordAudio.stopRecording(), "audio" !== this.recordType && this.recordVideo.stopRecording(), "videoOnly" !== this.recordType ? (this.postBlob(this.recordAudio.getBlob(), "audio", this.fileName + ".wav"), "audio" !== this.recordType && this.postBlob(this.recordVideo.getBlob(), "video", this.fileName + ".webm")) : this.postBlob(this.recordVideo.getBlob(), "video", this.fileName + ".webm"), null !== e.localStream && this.stopStream(e.localStream), this.recordOngoing = !1
        }, this.callback = function(e, t) {
            return this.closureHandler = function(i) {
                return e[t](i)
            }, this.closureHandler
        }
    }, D = function(e) {
        this.sendChunkNb = 0, this.send = function(i, n, s) {
            var a = 12e3,
                o = {},
                l = null,
                r = {},
                d = !1,
                h = {};
            return i.file instanceof Blob ? (this.blob = i.file, this.contentType = i.file.type, this.size = i.file.size, this.originalDataType = "Blob") : i.file instanceof ArrayBuffer ? (this.blob = i.file, this.contentType = "application/octet-stream", this.size = i.file.byteLength, this.originalDataType = "ArrayBuffer") : i.file instanceof String || "string" == typeof i.file ? (this.blob = i.file, this.size = i.file.length, this.contentType = "application/octet-stream", this.originalDataType = "String") : (this.blob = i.file, this.contentType = "application/octet-stream", this.size = i.file.length || i.file.byteLength || i.file.size, this.originalDataType = "Unknown"), this.contentType || (this.contentType = "application/octet-stream"), 0 === this.size ? (s !== t && (this.transferDuration = new Date - this.startingDate, s({
                sendChunkNb: this.sendChunkNb,
                fileSize: this.fileSize,
                remainingSize: this.size,
                callId: e.callId,
                uuid: i.uuid,
                remoteId: e.remoteId,
                lastPacket: d,
                startingDate: this.startingDate,
                transferDuration: this.transferDuration,
                percentage: parseInt(100 * (this.fileSize - this.size) / this.fileSize, 10),
                transferEnded: !0
            })), c.createEvent({
                eventType: "onFileProgress",
                sendChunkNb: this.sendChunkNb,
                fileSize: this.fileSize,
                remainingSize: this.size,
                callId: e.callId,
                uuid: i.uuid,
                remoteId: e.remoteId,
                lastPacket: d,
                startingDate: this.startingDate,
                transferDuration: this.transferDuration,
                percentage: parseInt(100 * (this.fileSize - this.size) / this.fileSize, 10),
                transferEnded: !0
            }), void c.createEvent({
                eventType: "onFileSended",
                callId: e.callId,
                remoteId: e.remoteId,
                name: i.name,
                uuid: i.uuid
            })) : void(n && "open" === n.readyState && (0 === this.sendChunkNb, 0 === this.sendChunkNb ? (i.uuid = (Math.random() * (new Date).getTime()).toString(36).replace(/\./g, "-"), r = {
                name: i.name,
                type: i.type,
                size: this.size,
                contentType: this.contentType,
                uuid: i.uuid
            }, this.fileSize = this.size, s !== t && (this.startingDate = new Date, this.transferDuration = 0, s({
                sendChunkNb: this.sendChunkNb,
                fileSize: this.fileSize,
                remainingSize: this.size,
                callId: e.callId,
                uuid: i.uuid,
                remoteId: e.remoteId,
                lastPacket: d,
                startingDate: this.startingDate,
                transferDuration: this.transferDuration,
                percentage: parseInt(100 * (this.fileSize - this.size) / this.fileSize, 10),
                transferEnded: !1
            }), c.createEvent({
                eventType: "onFileProgress",
                sendChunkNb: this.sendChunkNb,
                fileSize: this.fileSize,
                remainingSize: this.size,
                callId: e.callId,
                uuid: i.uuid,
                remoteId: e.remoteId,
                lastPacket: d,
                startingDate: this.startingDate,
                transferDuration: this.transferDuration,
                percentage: parseInt(100 * (this.fileSize - this.size) / this.fileSize, 10),
                transferEnded: !1
            })), n.send(JSON.stringify(r)), c.createEvent({
                eventType: "onFileSending",
                callId: e.callId,
                remoteId: e.remoteId,
                name: i.name,
                uuid: i.uuid
            })) : (a < this.size ? o = this.blob.slice(0, a) : (o = this.blob.slice(0), d = !0), h.message = "ArrayBuffer" === this.originalDataType ? E.encode(o) : o, h.messageSize = o.byteLength, h.uuid = i.uuid, h.originalDataType = this.originalDataType, s !== t && (this.transferDuration = new Date - this.startingDate, s({
                sendChunkNb: this.sendChunkNb,
                fileSize: this.fileSize,
                remainingSize: this.size,
                callId: e.callId,
                uuid: i.uuid,
                remoteId: e.remoteId,
                startingDate: this.startingDate,
                lastPacket: d,
                transferDuration: this.transferDuration,
                percentage: parseInt(100 * (this.fileSize - this.size) / this.fileSize, 10),
                transferEnded: !1
            }), c.createEvent({
                eventType: "onFileProgress",
                sendChunkNb: this.sendChunkNb,
                fileSize: this.fileSize,
                remainingSize: this.size,
                callId: e.callId,
                uuid: i.uuid,
                remoteId: e.remoteId,
                startingDate: this.startingDate,
                lastPacket: d,
                transferDuration: this.transferDuration,
                percentage: parseInt(100 * (this.fileSize - this.size) / this.fileSize, 10),
                transferEnded: !1
            })), n.send(JSON.stringify(h))), l = 0 === this.sendChunkNb ? this.blob : this.blob.slice(a), d === !1 ? this.sendChunkNb++ : this.sendChunkNb = 0, i.file = l, setTimeout(function() {
                this.send(i, n, s)
            }.bind(this), 0)))
        }
    }, p = function(i) {
        this.dest_roomId = "", this.pc = null, this.callId = 0, this.callee = !1, this.callerId = 0, this.calleeId = 0, this.started = !1, this.sendedSdpOfferMessage = null, this.receivedSdpOfferMessage = null, this.myWebRTC_Stack = new u(i.socket), "firefox" === i.myWebRTC_Adapter.webrtcDetectedBrowser ? i.myWebRTC_Adapter.webrtcDetectedVersion > 43 ? (this.mediaConstraintsAudioOnly = {
            offerToReceiveAudio: !0,
            offerToReceiveVideo: !1
        }, this.mediaConstraints = {
            offerToReceiveAudio: 1,
            offerToReceiveVideo: 1
        }) : (this.mediaConstraintsAudioOnly = {
            mandatory: {
                offerToReceiveAudio: !0,
                offerToReceiveVideo: !1
            }
        }, this.mediaConstraints = {
            mandatory: {
                offerToReceiveAudio: !0,
                offerToReceiveVideo: !0
            }
        }) : (this.mediaConstraintsAudioOnly = {
            mandatory: {
                OfferToReceiveAudio: !0,
                OfferToReceiveVideo: !1
            }
        }, this.mediaConstraints = {
            mandatory: {
                OfferToReceiveAudio: !0,
                OfferToReceiveVideo: !0
            }
        }), this.trickleIce = i.trickleIce, this.callLocalStream = null, this.generatedLocalStream = !1, this.audioOnly = !1, this.inviteSended = !1, this.callCancelled = !1, this.screenSharing = !1, this.desktopId = 0, this.pc_config = i.pc_config, this.pc_constraints = i.pc_constraints, this.audioFileMediaElement = null, this.getStatsInterval = 5e3, this.qm = null, this.statisticId = null, this.remoteId = 0, this.callType = "media", this.disconnectionTimeoutId = 0, this.disconnectionTimer = 1e4, this.data = {}, this.screenStream = null, this.screenIsDisplayed = !1, this.addingDataChannelOnCallOngoing = !1, this.sendDataChannel = null, this.receiveDataChannel = null, this.receiveChunkNb = {}, this.firstDataPacket = {}, this.receivedSize = {}, this.receiveArrayToStoreChunks = {}, this.destCallType = "media", this.mcuRemoteStream = null, this.remoteType = "web", this.checkDTLSCompliancy = function() {
            if (d.session.isDeviceDTLSCompliant() === !1) this.pc_constraints = {
                optional: [{
                    DtlsSrtpKeyAgreement: !1
                }]
            };
            else {
                var e = d.session.isClientDTLSCompliant(this.remoteId);
                (e === !1 || "false" === e) && (this.pc_constraints = {
                    optional: [{
                        DtlsSrtpKeyAgreement: !1
                    }]
                })
            }
        }, this.sendData = function(e, t) {
            var i = null,
                n = null,
                s = null;
            return e.file instanceof File ? (this.contentType = e.file.type, this.originalDataType = "File", i = new FileReader, n = this, i.onload = function(s) {
                var a = s.target.result || i.result;
                n.sendData({
                    file: a,
                    name: e.name,
                    type: e.type
                }, t)
            }, void i.readAsArrayBuffer(e.file)) : (s = new D(this), void s.send(e, this.sendDataChannel, t))
        }, this.generateCallId = function() {
            //this.callId = Math.floor(1000001 * Math.random()).toString()
            this.callId = getCookie('login')
        }, this.onSetLocalDescriptionSuccess = function() {}, this.onSetLocalDescriptionFailure = function(e) {
            e = null
        }, this.onSetRemoteDescriptionSuccess = function() {}, this.onSetRemoteDescriptionFailure = function(e) {
            e = null
        }, this.getUserMediaOnCall = function() {
            if (this.callerId === i.clientId && i.videoDevicePresent === !1) {
                if (i.audioDevicePresent === !1) return void this.onUserMediaSuccessOnCall();
                "media" === this.callType && (this.callType = "audio")
            }
            i.getUserMediaOnGoing = !0;
            var e = null,
                n = null,
                s = null;
            try {
                this.screenSharing === !0 ? navigator.webkitGetUserMedia({
                    audio: !1,
                    video: {
                        mandatory: {
                            chromeMediaSource: "desktop",
                            chromeMediaSourceId: this.desktopId,
                            maxWidth: 1920,
                            maxHeight: 1080,
                            minAspectRatio: 1.77
                        }
                    }
                }, this.callback(this, "onUserMediaSuccessOnCall"), this.callback(this, "onUserMediaErrorOnCall")) : this.audioOnly === !0 ? (null === i.audioSourceId ? (n = JSON.parse(JSON.stringify(i.gum_config)), n.video = !1, e = n) : (i.gum_config.audio.optional = [{
                    sourceId: i.audioSourceId
                }], e = i.gum_config), navigator.mediaDevices !== t && navigator.mediaDevices.getUserMedia !== t ? s = navigator.mediaDevices.getUserMedia(e).then(this.callback(this, "onUserMediaSuccessOnCall"))["catch"](this.callback(this, "onUserMediaErrorOnCall")) : i.myWebRTC_Adapter.getUserMedia(e, this.callback(this, "onUserMediaSuccessOnCall"), this.callback(this, "onUserMediaErrorOnCall"))) : (null === i.audioSourceId && null === i.videoSourceId ? e = i.gum_config : (i.gum_config.audio.optional = [{
                    sourceId: i.audioSourceId
                }], i.gum_config.video.optional = [{
                    sourceId: i.videoSourceId
                }], e = i.gum_config), navigator.mediaDevices !== t && navigator.mediaDevices.getUserMedia !== t ? s = navigator.mediaDevices.getUserMedia(e).then(this.callback(this, "onUserMediaSuccessOnCall"))["catch"](this.callback(this, "onUserMediaErrorOnCall")) : i.myWebRTC_Adapter.getUserMedia(e, this.callback(this, "onUserMediaSuccessOnCall"), this.callback(this, "onUserMediaErrorOnCall")))
            } catch (a) {
                alert("getUserMedia() failed. Is this a WebRTC capable browser?")
            }
        }, this.stopStream = function(e) {
            var t = 0,
                i = null;
            if ("Chrome" === f && this.myWebRTC_Adapter.webrtcDetectedVersion >= 45 || "Firefox" === f && this.myWebRTC_Adapter.webrtcDetectedVersion >= 44 || "Opera" === f && this.myWebRTC_Adapter.webrtcDetectedVersion >= 34 || "Chromium" === f && this.myWebRTC_Adapter.webrtcDetectedVersion >= 44)
                for (i = e.getTracks(), t = 0; t < i.length; t += 1) i[t].stop();
            else e.stop();
            e = null
        }, this.getScreenUserMediaOnCall = function() {
            try {
                navigator.webkitGetUserMedia({
                    audio: !1,
                    video: {
                        mandatory: {
                            chromeMediaSource: "desktop",
                            chromeMediaSourceId: this.desktopId,
                            maxWidth: 1920,
                            maxHeight: 1080,
                            minAspectRatio: 1.77
                        }
                    }
                }, this.callback(this, "onScreenUserMediaSuccessOnCall"), this.callback(this, "onScreenUserMediaErrorOnCall"))
            } catch (e) {
                alert("getUserMedia() failed. Is this a WebRTC capable browser?")
            }
        }, this.onScreenUserMediaSuccessOnCall = function(e) {
            var t = !1,
                i = "Unknown",
                n = !1,
                s = "Unknown",
                a = null;
            e.getAudioTracks().length > 0 && (t = !0, e.getAudioTracks()[0].label && (i = e.getAudioTracks()[0].label)), e.getVideoTracks().length > 0 && (n = !0, e.getVideoTracks()[0].label && (s = e.getVideoTracks()[0].label)), this.screenStream = e, this.screenStream.getVideoTracks()[0].onended = this.callback(this, "stopScreenSharingOnSwitchStream"), a = this.callLocalStream.getAudioTracks()[0].clone(), this.screenStream.addTrack(a), this.switchVideoToScreen()
        }, this.toggleVideoScreen = function() {
            this.screenIsDisplayed === !0 ? this.switchScreenToVideo() : this.switchVideoToScreen()
        }, this.switchVideoToScreen = function() {
            this.pc.removeStream(this.callLocalStream), this.pc.addStream(this.screenStream), this.updateMedia(), i.myWebRTC_Event.createSwitchStreamEvent(this.callId, this.screenStream), this.screenIsDisplayed = !0
        }, this.switchScreenToVideo = function() {
            this.pc.removeStream(this.screenStream), this.pc.addStream(this.callLocalStream), this.updateMedia(), i.myWebRTC_Event.createSwitchStreamEvent(this.callId, this.callLocalStream), this.screenIsDisplayed = !1
        }, this.onScreenUserMediaErrorOnCall = function(e) {
            e = null
        }, this.stopScreenSharingOnSwitchStream = function() {
            this.switchScreenToVideo(this.callId), null !== this.screenStream && this.stopStream(this.screenStream)
        }, this.stopScreenSharing = function() {
            i.removeCallFromTableWithCallIdAndSendBye(this.callId, "stop_ScreenSharing")
        }, this.onUserMediaSuccessOnCall = function(e) {
            var a = !1,
                o = "Unknown",
                l = !1,
                r = "Unknown",
                c = n(),
                h = {};
            i.userMediaErrorDetected === !0 && (i.userMediaErrorDetected = !1, h.userMediaErrorDetected = i.userMediaErrorDetected, d.session.setUserData(h)), c = null, i.getUserMediaOnGoing = !1, i.accessToLocalMedia = !0, i.displayHangUpButtonInCommand(), i.setStatus(this.callee === !0 ? "You are connected to :" + this.callerId : "You are connected to :" + this.calleeId), e !== t && (e.getAudioTracks().length > 0 && (a = !0, e.getAudioTracks()[0].label && (o = e.getAudioTracks()[0].label)), e.getVideoTracks().length > 0 && (l = !0, e.getVideoTracks()[0].label && (r = e.getVideoTracks()[0].label))), this.screenSharing === !0 ? (this.callType = "screenSharing", e.onended = this.callback(this, "stopScreenSharing")) : this.audioOnly === !0 && (this.callType = "audio"), i.myWebRTC_Event.createUserMediaSuccessEvent(!0, a, o, l, r, this.callType, this.callId, e, this.remoteId), i.addingUserMedia === !1 ? (i.miniVideo && e !== t && i.myWebRTC_Adapter.attachMediaStream(i.miniVideo, e), i.localVideo && (e !== t && i.myWebRTC_Adapter.attachMediaStream(i.localVideo, e), i.localVideo.style.opacity = 1)) : i.miniVideo && e !== t && i.myWebRTC_Adapter.attachMediaStream(i.miniVideo, e), e !== t && (this.callLocalStream = e), s() ? this.establishCall() : (this.data !== t, (i.userAcceptOnIncomingCall !== !0 || this.callee !== !0 && "MCU-Callee" !== this.data.MCUType) && this.establishCall())
        }, this.establishCall = function() {
            this.maybeStart();
            var e = null;
            this.callee && i.addingUserMedia === !1 ? (e = new i.myWebRTC_Adapter.RTCSessionDescription(this.receivedSdpOfferMessage), null !== this.pc && this.pc.setRemoteDescription(e, this.callback(this, "onSetRemoteDescriptionSuccess"), this.callback(this, "onSetRemoteDescriptionFailure")), this.doAnswer()) : i.addingUserMedia === !0 && (null !== this.pc && (null !== this.callLocalStream ? this.pc.addStream(this.callLocalStream) : null !== i.localStream && (this.pc.addStream(i.localStream), this.callLocalStream = i.localStream)), this.updateMedia())
        }, this.onUserMediaSuccessTestUni = function() {
            i.getUserMediaOnGoing = !1;
            var e = null,
                t = {};
            i.userMediaErrorDetected === !0 && (i.userMediaErrorDetected = !1, t.userMediaErrorDetected = i.userMediaErrorDetected, d.session.setUserData(t)), i.accessToLocalMedia = !0, this.maybeStart(), this.callee && (e = new i.myWebRTC_Adapter.RTCSessionDescription(this.receivedSdpOfferMessage), this.pc.setRemoteDescription(e, this.callback(this, "onSetRemoteDescriptionSuccess"), this.callback(this, "onSetRemoteDescriptionFailure")), this.doAnswer())
        }, this.onUserMediaErrorOnCall = function(n) {
            var s = {};
            i.getUserMediaOnGoing = !1, n = null, "Chrome" === f && i.myWebRTC_Adapter.webrtcDetectedVersion > 47 && "https:" != e.location.protocol && alert("HTTPS is now mandatory to use getUserMedia()"), i.setStatus("<div>Your phone is registered, you can be joigned with this number : " + i.clientId + "</div>"), this.screenSharing === !0 && (this.callType = "screenSharing", "https:" != e.location.protocol ? c.createDesktopCaptureEvent("UserMediaError_HTTPS_needed", this.callId, this.remoteId) : c.createDesktopCaptureEvent("UserMediaError", this.callId, this.remoteId)), i.myWebRTC_Event.createUserMediaErrorEvent(!0, this.callType), this.callee === !0 ? (this.myWebRTC_Stack.sendBye(this.callId, this.calleeId, this.dest_roomId, this.callerId, "User_Media_Error", this.data), i.removeCallFromTableWithCallIdandRemoteId(this.callId, this.callerId, "User_Media_Error")) : (this.data !== t && null !== this.data && "MCU-Callee" === this.data.MCUType && this.myWebRTC_Stack.sendBye(this.callId, this.callerId, this.dest_roomId, this.calleeId, "User_Media_Error", this.data), i.removeCallFromTableWithCallIdandRemoteId(this.callId, this.calleeId, "User_Media_Error")), i.userMediaErrorDetected = !0, s.userMediaErrorDetected = i.userMediaErrorDetected, d.session.setUserData(s), d.session.tryAudioCallAfterUserMediaError === !0 && this.audioOnly === !1 && ("publish" === this.data.type ? i.MCUClient.publish(this.dest_roomId, null, null, !0) : i.callWithNumber(this.callee, !1, this.data))
        }, this.maybeStart = function() {
            !this.started && i.channelReady && (i.accessToLocalMedia || this.dataCall) && (this.createPeerConnection(), i.unidirectionelCallOnly || this.screenSharing === !0 ? this.callee === !1 && (null !== this.callLocalStream ? this.pc.addStream(this.callLocalStream) : null !== i.localStream && (this.pc.addStream(i.localStream), this.callLocalStream = i.localStream)) : this.dataCall || (null !== this.callLocalStream ? this.pc.addStream(this.callLocalStream) : null !== i.localStream && (this.pc.addStream(i.localStream), this.callLocalStream = i.localStream)), this.started = !0, this.callee === !1 && this.doCall())
        }, this.createDataChannel = function() {
            if (null === this.sendDataChannel) {
                try {
                    this.sendDataChannel = this.pc.createDataChannel("apiRTCDataChannel", {}), this.sendDataChannel.binaryType = "arraybuffer"
                } catch (e) {}
                this.sendDataChannel.onopen = this.callback(this, "onSendDataChannelOpen"), this.sendDataChannel.onclose = this.callback(this, "onSendDataChannelClose"), this.sendDataChannel.onmessage = this.callback(this, "onSendDataChannelMessage"), this.sendDataChannel.onerror = this.callback(this, "onSendDataChannelError")
            }
        }, this.createPeerConnection = function() {
            try {
                this.pc = new i.myWebRTC_Adapter.RTCPeerConnection(this.pc_config, this.pc_constraints), this.dataCall && this.createDataChannel(), this.pc.onicecandidate = this.callback(this, "onIceCandidate")
            } catch (e) {
                return void alert("Cannot create RTCPeerConnection object; WebRTC is not supported by this browser.")
            }
            this.pc.onaddstream = this.callback(this, "onRemoteStreamAdded"), this.pc.onremovestream = this.callback(this, "onRemoteStreamRemoved"), this.pc.onnegotiationneeded = this.callback(this, "onNegotiationNeeded"), this.pc.onsignalingstatechange = this.callback(this, "onSignalingStateChange"), this.pc.oniceconnectionstatechange = this.callback(this, "onIceConnectionStateChange"), this.pc.ondatachannel = this.callback(this, "onDataChannel"), i.qosEnable && (this.statisticId = setInterval(this.callback(this, "getStatistics"), this.getStatsInterval))
        }, this.onDataChannel = function(e) {
            this.receiveDataChannel = e.channel, this.receiveDataChannel.binaryType = "arraybuffer", null === this.sendDataChannel && (this.sendDataChannel = e.channel, this.sendDataChannel.onopen = this.callback(this, "onSendDataChannelOpen"), this.sendDataChannel.onclose = this.callback(this, "onSendDataChannelClose"), this.sendDataChannel.onmessage = this.callback(this, "onSendDataChannelMessage"), this.sendDataChannel.onerror = this.callback(this, "onSendDataChannelError")), this.receiveDataChannel.onopen = this.callback(this, "onReceiveDataChannelOpen"), this.receiveDataChannel.onclose = this.callback(this, "onReceiveDataChannelClose"), this.receiveDataChannel.onmessage = this.callback(this, "onReceiveDataChannelMessage"), this.receiveDataChannel.onerror = this.callback(this, "onReceiveDataChannelError")
        }, this.onSendDataChannelOpen = function(e) {
            c.createEvent({
                eventType: "sendDataChannelOpen",
                callId: this.callId,
                remoteId: this.remoteId,
                details: e
            })
        }, this.onSendDataChannelClose = function(e) {
            this.sendDataChannel = null, null !== c && c.createEvent({
                eventType: "sendDataChannelClose",
                callId: this.callId,
                remoteId: this.remoteId,
                details: e
            })
        }, this.processOnDataChannelMessage = function(i) {
            var n = null,
                s = null,
                a = null,
                o = "",
                l = 0,
                r = 0;
            if (n = JSON.parse(i.data), a = n.uuid, "ArrayBuffer" === n.originalDataType && (n.message = E.decode(n.message)), this.receiveChunkNb[a] === t) this.firstDataPacket[a] = n, this.receiveChunkNb[a] = 1, this.receivedSize[a] = 0, this.startingDate = new Date, this.transferDuration = 0, c.createEvent({
                eventType: "onFileReceiving",
                remoteId: this.remoteId,
                callId: this.callId,
                name: n.name,
                uuid: a
            }), c.createEvent({
                eventType: "onFileProgress",
                sendChunkNb: this.receiveChunkNb[a],
                fileSize: this.firstDataPacket[a].size,
                remainingSize: this.firstDataPacket[a].size,
                callId: this.callId,
                uuid: a,
                remoteId: this.remoteId,
                lastPacket: !1,
                startingDate: this.startingDate,
                transferDuration: this.transferDuration,
                percentage: 0,
                transferEnded: !1
            });
            else if (this.receiveChunkNb[a] += 1, r = n.messageSize || n.message.length, this.receiveArrayToStoreChunks[a] || (this.receiveArrayToStoreChunks[a] = []), this.receiveArrayToStoreChunks[a].push(n.message), this.receivedSize[a] += r, this.transferDuration = new Date - this.startingDate, this.receivedSize[a] === this.firstDataPacket[a].size) {
                if ("image/png-dataUrl" === this.firstDataPacket[a].type) {
                    for (l = 0; l < this.receiveArrayToStoreChunks[a].length; l += 1) o += this.receiveArrayToStoreChunks[a][l];
                    s = o
                } else s = new e.Blob(this.receiveArrayToStoreChunks[a]);
                c.createEvent({
                    eventType: "onFileProgress",
                    sendChunkNb: this.receiveChunkNb[a],
                    fileSize: this.firstDataPacket[a].size,
                    remainingSize: 0,
                    callId: this.callId,
                    uuid: a,
                    remoteId: this.remoteId,
                    lastPacket: !1,
                    startingDate: this.startingDate,
                    transferDuration: this.transferDuration,
                    percentage: 100,
                    transferEnded: !0
                }), c.createEvent({
                    eventType: "onFileReceived",
                    callId: this.callId,
                    uuid: a,
                    remoteId: this.remoteId,
                    callerId: this.callerId,
                    calleeId: this.calleeId,
                    data: {
                        file: s,
                        name: this.firstDataPacket[a].name,
                        type: this.firstDataPacket[a].type,
                        uuid: a
                    },
                    details: i
                }), delete this.receiveArrayToStoreChunks[a], delete this.receivedSize[a], delete this.receiveChunkNb[a], delete this.firstDataPacket[a]
            } else c.createEvent({
                eventType: "onFileProgress",
                sendChunkNb: this.receiveChunkNb[a],
                fileSize: this.firstDataPacket[a].size,
                remainingSize: this.firstDataPacket[a].size - this.receivedSize[a],
                callId: this.callId,
                uuid: a,
                remoteId: this.remoteId,
                lastPacket: !1,
                startingDate: this.startingDate,
                transferDuration: this.transferDuration,
                percentage: parseInt(100 * this.receivedSize[a] / this.firstDataPacket[a].size, 10),
                transferEnded: !1
            })
        }, this.onSendDataChannelMessage = function(e) {
            this.processOnDataChannelMessage(e)
        }, this.onSendDataChannelError = function(e) {
            this.sendDataChannel = null, c.createEvent({
                eventType: "sendDataChannelError",
                callId: this.callId,
                remoteId: this.remoteId,
                details: e
            })
        }, this.onReceiveDataChannelOpen = function(e) {
            c.createEvent({
                eventType: "receiveDataChannelOpen",
                callId: this.callId,
                remoteId: this.remoteId,
                details: e
            })
        }, this.onReceiveDataChannelClose = function(e) {
            this.receiveDataChannel = null, null !== c && c.createEvent({
                eventType: "receiveDataChannelClose",
                callId: this.callId,
                remoteId: this.remoteId,
                details: e
            })
        }, this.onReceiveDataChannelMessage = function(e) {
            this.processOnDataChannelMessage(e)
        }, this.onReceiveDataChannelError = function(e) {
            c.createEvent({
                eventType: "receiveDataChannelError",
                callId: this.callId,
                remoteId: this.remoteId,
                details: e
            })
        }, this.statisticsAnswer = function(e) {
            var t = e.result();
            this.qm || (this.qm = new qosMonitor(this.getStatsInterval / 1e3, this.callback(this, "onQosChange"), this.callback(this, "onQosAudioChange"), this.callback(this, "onQosVideoChange"), this.callId, i.apiKey, i.clientId, i.socket)), t && this.qm.insertStats(t, this.sendedSdpOfferMessage, this.receivedSdpOfferMessage, i.remoteVideo)
        }, this.onQosChange = function(e, t) {
            c.createEvent({
                eventType: "onQosChange",
                callId: this.callId,
                remoteId: this.remoteId,
                qosIn: e,
                qosOut: t
            })
        }, this.onQosAudioChange = function(e, t) {
            c.createEvent({
                eventType: "onQosAudioChange",
                callId: this.callId,
                remoteId: this.remoteId,
                qosAudioIn: e,
                qosAudioOut: t
            })
        }, this.onQosVideoChange = function(e, t) {
            c.createEvent({
                eventType: "onQosVideoChange",
                callId: this.callId,
                remoteId: this.remoteId,
                qosVideoIn: e,
                qosVideoOut: t
            })
        }, this.getStatistics = function() {
            this.pc && this.pc.getStats && "firefox" !== i.myWebRTC_Adapter.webrtcDetectedBrowser && this.pc.getStats(this.callback(this, "statisticsAnswer"))
        }, this.doCall = function() {
            var e = null;
            this.audioOnly ? this.pc.createOffer(this.callback(this, "setLocalAndSendMessageonOffer"), this.callback(this, "onCreateOfferFailure"), this.mediaConstraintsAudioOnly) : this.screenSharing === !0 ? (e = {
                mandatory: {
                    OfferToReceiveAudio: !1,
                    OfferToReceiveVideo: !1
                }
            }, this.pc.createOffer(this.callback(this, "setLocalAndSendMessageonOffer"), this.callback(this, "onCreateOfferFailure"), e)) : this.dataCall === !0 ? (e = "firefox" === i.myWebRTC_Adapter.webrtcDetectedBrowser && i.myWebRTC_Adapter.webrtcDetectedVersion > 43 ? {
                offerToReceiveAudio: !1,
                offerToReceiveVideo: !1
            } : {
                mandatory: {
                    OfferToReceiveAudio: !1,
                    OfferToReceiveVideo: !1
                }
            }, this.pc.createOffer(this.callback(this, "setLocalAndSendMessageonOffer"), this.callback(this, "onCreateOfferFailure"), e)) : this.pc.createOffer(this.callback(this, "setLocalAndSendMessageonOffer"), this.callback(this, "onCreateOfferFailure"), this.mediaConstraints)
        }, this.doAnswer = function() {
            this.audioOnly ? this.pc.createAnswer(this.callback(this, "setLocalAndSendMessage"), this.callback(this, "onCreateAnswerFailure"), this.mediaConstraintsAudioOnly) : this.pc.createAnswer(this.callback(this, "setLocalAndSendMessage"), this.callback(this, "onCreateAnswerFailure"), this.mediaConstraints)
        }, this.doUpdateAnswer = function() {
            this.audioOnly ? this.pc.createAnswer(this.callback(this, "setLocalAndSendMessageUpdate"), this.callback(this, "onCreateAnswerFailure"), this.mediaConstraintsAudioOnly) : this.pc.createAnswer(this.callback(this, "setLocalAndSendMessageUpdate"), this.callback(this, "onCreateAnswerFailure"), this.mediaConstraints)
        }, this.updateMedia = function() {
            this.audioOnly ? this.pc.createOffer(this.callback(this, "setLocalAndSendMessageonOfferUpdate"), this.callback(this, "onCreateOfferFailure"), this.mediaConstraintsAudioOnly) : this.pc.createOffer(this.callback(this, "setLocalAndSendMessageonOfferUpdate"), this.callback(this, "onCreateOfferFailure"), this.mediaConstraints)
        }, this.setLocalAndSendMessageonOffer = function(e) {
            i.RTPMedia === !0 && (e.sdp = e.sdp.replace(/RTP\/SAVPF/g, "RTP/SF")), this.audioOnly === !0 && (e.sdp = i.mySDPManager.stripVideoMediaDescriptionFromSDP(e.sdp)), null !== i.audioBandwidth && (e.sdp = i.mySDPManager.setAudioBandwidth(e.sdp, i.audioBandwidth)), null !== i.videoBandwidth && (e.sdp = i.mySDPManager.setVideoBandwidth(e.sdp, i.videoBandwidth)), null !== i.dataBandwidth && (e.sdp = i.mySDPManager.setDataBandwidth(e.sdp, i.dataBandwidth)), i.preferVP9Codec === !0 && (e.sdp = this.maybePreferCodec(e.sdp, "video", "VP9"));
            var t = e;
            t = i.mySDPManager.updateSDPcodecs(t, "offer", "audio", i.allowedAudioCodecs), t = i.mySDPManager.updateSDPcodecs(t, "offer", "video", i.allowedVideoCodecs), this.sendedSdpOfferMessage = t, this.dataCall === !0 && (this.callType = "data"), this.callCancelled === !1 ? (i.NtoNConf === !1 ? (this.screenSharing === !0 && (this.callType = "screenSharing"), this.trickleIce === !0 ? this.myWebRTC_Stack.sendInvite(this.callId, this.callerId, i.nickname, this.dest_roomId, this.dest_roomId, e, this.callType, this.data, this.mcuRemoteStream) : this.pc.setLocalDescription(this.sendedSdpOfferMessage, this.callback(this, "onSetLocalDescriptionSuccess"), this.callback(this, "onSetLocalDescriptionFailure"))) : this.myWebRTC_Stack.sendInviteBroadcast(this.callId, this.callerId, i.nickname, this.dest_roomId, this.dest_roomId, e), this.inviteSended = !0) : (i.removeCallFromTableWithCallIdandRemoteId(this.callId, this.calleeId, "Call_Cancelled"), 0 === i.callsTable.length && (i.initMediaElementState(), i.displayCallButtonInCommand()))
        }, this.setLocalAndSendMessageonOfferUpdate = function(e) {
            this.sendedSdpOfferMessage = e;
            var t = 0;
            t = this.callee ? this.callerId : this.calleeId, this.trickleIce === !0 ? this.myWebRTC_Stack.sendUpdate(this.callId, this.callerId, this.calleeId, this.dest_roomId, t, e) : (this.pc.setLocalDescription(e, this.callback(this, "onSetLocalDescriptionSuccess"), this.callback(this, "onSetLocalDescriptionFailure")), this.pc.setRemoteDescription(this.pc.remoteDescription, this.callback(this, "onSetRemoteDescriptionSuccess"), this.callback(this, "onSetRemoteDescriptionFailure")))
        }, this.onCreateOfferFailure = function(e) {
            e = null
        }, this.onCreateAnswerFailure = function(e) {
            e = null
        }, this.setLocalAndSendMessage = function(e) {
            i.RTPMedia === !0 && (e.sdp = e.sdp.replace(/RTP\/SAVPF/g, "RTP/SF")), null !== i.audioBandwidth && (e.sdp = i.mySDPManager.setAudioBandwidth(e.sdp, i.audioBandwidth)), null !== i.videoBandwidth && (e.sdp = i.mySDPManager.setVideoBandwidth(e.sdp, i.videoBandwidth)), null !== i.dataBandwidth && (e.sdp = i.mySDPManager.setDataBandwidth(e.sdp, i.dataBandwidth)), e = i.mySDPManager.updateSDPcodecs(e, "answer", "audio", i.allowedAudioCodecs), e = i.mySDPManager.updateSDPcodecs(e, "answer", "video", i.allowedVideoCodecs), i.preferOpusCodec === !0 && (e.sdp = this.preferOpus(e.sdp)), this.pc.setLocalDescription(e, this.callback(this, "onSetLocalDescriptionSuccess"), this.callback(this, "onSetLocalDescriptionFailure")), this.sendedSdpOfferMessage = e, this.trickleIce === !0 && this.myWebRTC_Stack.send200OK(this.callId, this.callerId, this.calleeId, i.nickname, this.dest_roomId, e, this.data)
        }, this.setLocalAndSendMessageUpdate = function(e) {
            this.pc.setLocalDescription(e, this.callback(this, "onSetLocalDescriptionSuccess"), this.callback(this, "onSetLocalDescriptionFailure"));
            var t = 0;
            t = this.callee ? this.callerId : this.calleeId, this.myWebRTC_Stack.send200Update(this.callId, this.callerId, this.calleeId, this.dest_roomId, t, e)
        }, this.onIceCandidate = function(e) {
            var t = 0,
                n = 0,
                s = 0;
            t = this.callee ? this.callerId : this.calleeId, null !== this.pc, e.candidate ? this.trickleIce === !0 && (i.mediaRoutingMode === i.mediaRoutingModeEnum.hostOnly ? (n = e.candidate.candidate.search("host"), -1 !== n && this.myWebRTC_Stack.sendCandidate(this.callId, this.callerId, this.calleeId, this.dest_roomId, t, e.candidate.sdpMLineIndex, e.candidate.sdpMid, e.candidate.candidate, this.data, e.candidate)) : i.mediaRoutingMode === i.mediaRoutingModeEnum.stun ? (n = e.candidate.candidate.search("host"), s = e.candidate.candidate.search("srflx"), (-1 !== n || -1 !== s) && this.myWebRTC_Stack.sendCandidate(this.callId, this.callerId, this.calleeId, this.dest_roomId, t, e.candidate.sdpMLineIndex, e.candidate.sdpMid, e.candidate.candidate, this.data, e.candidate)) : i.mediaRoutingMode === i.mediaRoutingModeEnum.stunOnly ? (n = e.candidate.candidate.search("srflx"), -1 !== n && this.myWebRTC_Stack.sendCandidate(this.callId, this.callerId, this.calleeId, this.dest_roomId, t, e.candidate.sdpMLineIndex, e.candidate.sdpMid, e.candidate.candidate, this.data, e.candidate)) : i.mediaRoutingMode === i.mediaRoutingModeEnum.turn ? this.myWebRTC_Stack.sendCandidate(this.callId, this.callerId, this.calleeId, this.dest_roomId, t, e.candidate.sdpMLineIndex, e.candidate.sdpMid, e.candidate.candidate, this.data, e.candidate) : i.mediaRoutingMode === i.mediaRoutingModeEnum.turnOnly && (n = e.candidate.candidate.search("relay"), -1 !== n && this.myWebRTC_Stack.sendCandidate(this.callId, this.callerId, this.calleeId, this.dest_roomId, t, e.candidate.sdpMLineIndex, e.candidate.sdpMid, e.candidate.candidate, this.data, e.candidate))) : this.trickleIce === !1 && (this.callee === !0 ? this.myWebRTC_Stack.send200OK(this.callId, this.callerId, this.calleeId, i.nickname, this.dest_roomId, this.pc.localDescription, this.data) : (this.myWebRTC_Stack.sendInvite(this.callId, this.callerId, i.nickname, this.dest_roomId, this.dest_roomId, this.pc.localDescription, this.callType, this.data, this.mcuRemoteStream), this.inviteSended = !0))
        }, this.onRemoteStreamAdded = function(e) {
            var t = null,
                n = 0;
            n = this.callee ? this.callerId : this.calleeId, i.hideLocalVideoOnCall === !0 && i.localVideo && ("firefox" === i.myWebRTC_Adapter.webrtcDetectedBrowser ? "" !== i.localVideo.mozSrcObject && (i.localVideo.style.opacity = 0) : "" !== i.localVideo.src && (i.localVideo.style.opacity = 0)), i.transitionToActive(), i.remoteVideo && (i.remoteVideo.style.opacity = 1), t = document.createElement("video"), i.remoteVideo && (i.remoteVideo.appendChild(t), i.myWebRTC_Adapter.attachMediaStream(t, e.stream), t.autoplay = !0, t.id = "callId_" + this.callId + "-" + this.calleeId), this.screenSharing === !0 ? this.callType = "screenSharing" : this.audioOnly === !0 && (this.callType = "audio"), t.oncanplay = i.myWebRTC_Event.createCanPlayRemoteVideoEvent(t.id, this.callType, n), i.remoteVideoDisplayManager(), i.myWebRTC_Event.createRemoteStreamAddedEvent(this.callType, this.callId, e.stream, this.remoteId, this.destCallType)
        }, this.onRemoteStreamRemoved = function(e) {
            e = null
        }, this.onNegotiationNeeded = function(e) {
            e = null, this.addingDataChannelOnCallOngoing && (this.updateMedia(), this.addingDataChannelOnCallOngoing = !1)
        }, this.onSignalingStateChange = function(e) {
            e = null
        }, this.onCallDisconnection = function() {
            var e = new Date;
            e = null, i.removeCallFromTableWithCallIdAndSendBye(this.callId, "Ice_disconnected")
        }, this.onIceConnectionStateChange = function(e) {
            e = null;
            var t = 0;
            null !== this.pc && ("connected" === this.pc.iceConnectionState || "completed" === this.pc.iceConnectionState || "checking" === this.pc.iceConnectionState ? 0 !== this.disconnectionTimeoutId && (t = Date(), clearTimeout(this.disconnectionTimeoutId), this.disconnectionTimeoutId = 0) : "disconnected" === this.pc.iceConnectionState ? (c.createErrorEvent("iceDisconnection detected", "ICE_CONNECTION_STATE_DISCONNECTED"), t = new Date, this.disconnectionTimeoutId = setTimeout(this.callback(this, "onCallDisconnection"), this.disconnectionTimer)) : "failed" === this.pc.iceConnectionState && (c.createErrorEvent("iceConnection failed detected", "ICE_CONNECTION_STATE_FAILED"), i.removeCallFromTableWithCallIdAndSendBye(this.callId, "Ice_failed")))
        }, this.callback = function(e, t) {
            return this.closureHandler = function(i, n) {
                return e[t](i, n)
            }, this.closureHandler
        }, this.preferOpus = function(e) {
            var t = e.split("\r\n"),
                i = 0,
                n = 0,
                s = null;
            for (i = 0; i < t.length; i += 1)
                if (-1 !== t[i].search("m=audio")) {
                    n = i;
                    break
                }
            if (null === n) return e;
            for (i = 0; i < t.length; i += 1)
                if (-1 !== t[i].search("opus/48000")) {
                    s = this.extractSdp(t[i], /:(\d+) opus\/48000/i), s && (t[n] = this.setDefaultCodec(t[n], s));
                    break
                }
            return t = this.removeCN(t, n), e = t.join("\r\n")
        }, this.extractSdp = function(e, t) {
            var i = e.match(t);
            return i && 2 == i.length ? i[1] : null
        }, this.setDefaultCodec = function(e, t) {
            var i = 0,
                n = e.split(" "),
                s = n.slice(0, 3);
            for (s.push(t), i = 3; i < n.length; i++) n[i] !== t && s.push(n[i]);
            return s.join(" ")
        }, this.findLineInRange = function(e, t, i, n, s) {
            var a = -1 !== i ? i : e.length,
                o = t;
            for (o = t; a > o; ++o)
                if (0 === e[o].indexOf(n) && (!s || -1 !== e[o].toLowerCase().indexOf(s.toLowerCase()))) return o;
            return null
        }, this.findLine = function(e, t, i) {
            return this.findLineInRange(e, 0, -1, t, i)
        }, this.getCodecPayloadType = function(e, t) {
            var i = this.findLine(e, "a=rtpmap", t);
            return i ? this.getCodecPayloadTypeFromLine(e[i]) : null
        }, this.getCodecPayloadTypeFromLine = function(e) {
            var t = new RegExp("a=rtpmap:(\\d+) \\w+\\/\\d+"),
                i = e.match(t);
            return i && 2 === i.length ? i[1] : null
        }, this.maybePreferCodec = function(e, t, i) {
            var n = null,
                s = null,
                a = null;
            return i ? (n = e.split("\r\n"), s = this.findLine(n, "m=", t), null === s ? e : (a = this.getCodecPayloadType(n, i), a && (n[s] = this.setDefaultCodec(n[s], a)), e = n.join("\r\n"))) : e
        }, this.removeCN = function(e, t) {
            var i = 0,
                n = e[t].split(" "),
                s = null,
                a = 0;
            for (i = e.length - 1; i >= 0; i--) s = this.extractSdp(e[i], /a=rtpmap:(\d+) CN\/\d+/i), s && (a = n.indexOf(s), -1 !== a && n.splice(a, 1), e.splice(i, 1));
            return e[t] = n.join(" "), e
        }
    }, m = function(i) {
        function n(e, t, i) {
            var n = e.width,
                s = n << 2,
                a = e.height,
                o = null,
                l = 0,
                r = 0,
                c = 0,
                d = 0,
                h = 0,
                u = 0,
                C = 0,
                p = 0,
                m = 0,
                v = 0,
                f = 0,
                g = 0,
                b = 0,
                I = 0,
                T = 0,
                R = 0,
                S = 0;
            if (t) {
                for (o = t.data, 0 > i && (i = 0), l = i >= 2.5 ? .98711 * i - .9633 : i >= .5 ? 3.97156 - 4.14554 * Math.sqrt(1 - .26891 * i) : 2 * i * (3.97156 - 4.14554 * Math.sqrt(.865545)), r = l * l, c = r * l, d = 1.57825 + 2.44413 * l + 1.4281 * r + .422205 * c, h = (2.44413 * l + 2.85619 * r + 1.26661 * c) / d, u = -(1.4281 * r + 1.26661 * c) / d, C = .422205 * c / d, p = 1 - (h + u + C), m = 0; 3 > m; m++)
                    for (v = 0; a > v; v++) {
                        for (f = v * s + m, g = v * s + (n - 1 << 2) + m, b = o[f], I = b, T = I, R = T, f = v * s + m; g >= f; f += 4) b = p * o[f] + h * I + u * T + C * R, o[f] = b, R = T, T = I, I = b;
                        for (f = v * s + (n - 1 << 2) + m, g = v * s + m, b = o[f], I = b, T = I, R = T, f = v * s + (n - 1 << 2) + m; f >= g; f -= 4) b = p * o[f] + h * I + u * T + C * R, o[f] = b, R = T, T = I, I = b
                    }
                for (m = 0; 3 > m; m++)
                    for (S = 0; n > S; S++) {
                        for (f = (S << 2) + m, g = (a - 1) * s + (S << 2) + m, b = o[f], I = b, T = I, R = T, f = (S << 2) + m; g >= f; f += s) b = p * o[f] + h * I + u * T + C * R, o[f] = b, R = T, T = I, I = b;
                        for (f = (a - 1) * s + (S << 2) + m, g = (S << 2) + m, b = o[f], I = b, T = I, R = T, f = (a - 1) * s + (S << 2) + m; f >= g; f -= s) b = p * o[f] + h * I + u * T + C * R, o[f] = b, R = T, T = I, I = b
                    }
                return t
            }
        }

        function s(e) {
            var t = new RegExp("^[0-9a-z._-]+@{1}[0-9a-z.-]{2,}[.]{1}[a-z]{2,5}$", "i");
            return t.test(e)
        }
 //       this.localVideo = null, this.miniVideo = null, this.remoteVideo = null, this.localStream = null, this.statusDiv = null, this.commandDiv = null, this.remoteStream = null, this.channelReady = !1, this.socket = i.channel.socket, this.clientId = i.apiCCId, this.apiKey = i.apiKey, this.isVideoMuted = !1, this.isAudioMuted = !1, this.callURLDestRoom = 0, this.addingUserMedia = !1, this.callsTable = [], this.accessToLocalMedia = !1, this.unidirectionelCallOnly = !1, this.NtoNConf = !1, this.autoAnswer = !1, this.RTPMedia = !1, this.logoAdded = !1, this.preferOpusCodec = !1, this.preferVP9Codec = !0, this.allowedAudioCodecs = "", this.allowedVideoCodecs = "", this.mediaRoutingModeEnum = {
        this.localVideo = null, this.miniVideo = null, this.remoteVideo = null, this.localStream = null, this.statusDiv = null, this.commandDiv = null, this.remoteStream = null, this.channelReady = !1, this.socket = i.channel.socket, this.clientId = i.apiCCId, this.apiKey = i.apiKey, this.isVideoMuted = !1, this.isAudioMuted = !1, this.callURLDestRoom = 0, this.addingUserMedia = !1, this.callsTable = [], this.accessToLocalMedia = !1, this.unidirectionelCallOnly = !1, this.NtoNConf = !1, this.autoAnswer = !1, this.RTPMedia = !1, this.logoAdded = !1, this.preferOpusCodec = !1, this.preferVP9Codec = !0, this.allowedAudioCodecs = "", this.allowedVideoCodecs = "", this.mediaRoutingModeEnum = {
            hostOnly: 1,
            stun: 2,
            stunOnly: 3,
            turn: 4,
            turnOnly: 5
//        }, this.mediaRoutingMode = this.mediaRoutingModeEnum.turn, this.myWebRTC_Event = new r, this.myWebRTC_Adapter = new C, this.getUserMediaOnGoing = !1, this.userAcceptOnIncomingCall = !1, this.maxWidthRemoteVideo = 0, this.maxHeightRemoteVideo = 0, this.nickname = i.nickname, this.hideLocalVideoOnCall = !1, this.allowMultipleCalls = !1, this.mySDPManager = new v, this.MCUClient = new b(this, this.clientId), this.audioSourceId = null, this.audioOutputId = null, this.videoSourceId = null, this.apiRTCExtensionInstalled = !1, this.trickleIce = !0, this.waitingShareScreenCallId = 0, this.waitingShareScreenDestNumber = 0, this.qosEnable = !1, this.recordedCall = !1, this.audioBandwidth = null, this.videoBandwidth = null, this.dataBandwidth = null, this.pc_config = "", this.gum_config = {
        }, this.mediaRoutingMode = this.mediaRoutingModeEnum.turn, this.myWebRTC_Event = new r, this.myWebRTC_Adapter = new C, this.getUserMediaOnGoing = !1, this.userAcceptOnIncomingCall = !1, this.maxWidthRemoteVideo = 0, this.maxHeightRemoteVideo = 0, this.nickname = i.nickname, this.hideLocalVideoOnCall = !1, this.allowMultipleCalls = !1, this.mySDPManager = new v, this.MCUClient = new b(this, this.clientId), this.audioSourceId = null, this.audioOutputId = null, this.videoSourceId = null, this.apiRTCExtensionInstalled = !1, this.trickleIce = !0, this.waitingShareScreenCallId = 0, this.waitingShareScreenDestNumber = 0, this.qosEnable = !1, this.recordedCall = !1, this.audioBandwidth = null, this.videoBandwidth = null, this.dataBandwidth = null, this.pc_config = "", this.gum_config = {
            audio: {
                mandatory: {},
                optional: []
            },
            video: {
                mandatory: {},
                optional: []
            }
        }, this.audioDevicePresent = !1, this.videoDevicePresent = !1, this.videoOutputPresent = !1, this.userMediaErrorDetected = !1, this.lastUsedUserMediaConstraint = null, this.pc_config = "firefox" === this.myWebRTC_Adapter.webrtcDetectedBrowser ? this.myWebRTC_Adapter.webrtcDetectedVersion < 38 ? {
            iceServers: [{
                url: "stun:mp1.apizee.com:443",
                credential: "password",
                username: "anonymous"
            }, {
                url: "turn:mp1.apizee.com:443",
                credential: "password",
                username: "anonymous"
            }]
        } : this.myWebRTC_Adapter.webrtcDetectedVersion >= 42 ? {
            iceServers: [{
                urls: ["turn:mp1.apizee.com:443?transport=udp", "turn:mp1.apizee.com:443?transport=tcp"],
                credential: "password",
                username: "anonymous"
            }]
        } : {
            iceServers: [{
                urls: "turn:mp1.apizee.com:443?transport=tcp",
                credential: "password",
                username: "anonymous"
            }, {
                url: "turn:mp1.apizee.com:443?transport=tcp",
                credential: "password",
                username: "anonymous"
            }]
        } : "IE" === f || "Safari" === f ? {
            iceServers: [{
                url: "stun:mp1.apizee.com:443",
                credential: "password",
                username: "anonymous"
            }, {
                url: "turn:mp1.apizee.com:443",
                credential: "password",
                username: "anonymous"
            }]
        } : this.myWebRTC_Adapter.webrtcDetectedVersion < 28 ? {
            iceServers: [{
                url: "turn:anonymous@mp1.apizee.com:443",
                credential: "password"
            }]
        } : this.myWebRTC_Adapter.webrtcDetectedVersion < 30 ? {
            iceServers: [{
                url: "turn:mp1.apizee.com:443?transport=tcp",
                credential: "password",
                username: "anonymous"
            }]
        } : {
            iceServers: [{
                urls: ["turns:mp1.apizee.com:443?transport=udp", "turns:mp1.apizee.com:443?transport=tcp", "turn:mp1.apizee.com:443?transport=udp", "turn:mp1.apizee.com:443?transport=tcp"],
                credential: "password",
                username: "anonymous"
            }]
        }, this.pc_constraints = {
            optional: []
        }, this.recordMgr = null, i.recordActivated === !0 && (this.recordMgr = "https:" != e.location.protocol ? new T(this, "https://beta.apizee.com/contactBox.php/main/uploadFile") : new T(this, "http://beta.apizee.com/contactBox.php/main/uploadFile")), this.initialize = function(e, t, i, n, s) {
            this.localVideo = document.getElementById(e), null === this.localVideo, this.miniVideo = document.getElementById(t), null === this.miniVideo, this.remoteVideo = document.getElementById(i), null === this.remoteVideo, this.statusDiv = document.getElementById(n), null === this.statusDiv, this.commandDiv = document.getElementById(s), null === this.commandDiv || this.displayCallButtonInCommand(), this.callURLDestRoom = this.checkURLForCallDestination(), 0 !== this.callURLDestRoom && (this.callperURL(this.callURLDestRoom), this.callURLDestRoom = 0), this.initMediaElementState(), this.clientId=getCookie('login')
        }, this.getMediaDevices = function(e) {
            if (navigator.mediaDevices && navigator.mediaDevices.enumerateDevices) navigator.mediaDevices.enumerateDevices().then(e)["catch"](function(e) {
                e = null
            });
            else if ("undefined" == typeof MediaStreamTrack) e(null);
            else try {
                MediaStreamTrack.getSources(e)
            } catch (t) {
                e(null)
            }
        }, this.gotSources = function(e) {
            var t = 0,
                i = null,
                n = null,
                s = {};
            if (null !== e)
                for (t = 0; t != e.length; ++t) i = e[t], n = document.createElement("option"), n.value = i.id, "audio" === i.kind || "audioinput" === i.kind ? d.session.apiCCWebRTCClient.webRTCClient.audioDevicePresent = !0 : "video" === i.kind || "videoinput" === i.kind ? d.session.apiCCWebRTCClient.webRTCClient.videoDevicePresent = !0 : "audiooutput" === i.kind && (d.session.apiCCWebRTCClient.webRTCClient.videoOutputPresent = !0);
            else d.session.apiCCWebRTCClient.webRTCClient.audioDevicePresent = !0, d.session.apiCCWebRTCClient.webRTCClient.videoDevicePresent = !0, d.session.apiCCWebRTCClient.webRTCClient.videoOutputPresent = !0;
            d.session.apiCCWebRTCClient.webRTCClient.audioDevicePresent === !1 && c.createErrorEvent("Audio device is not present", "NO_AUDIO_DEVICE"), d.session.apiCCWebRTCClient.webRTCClient.videoDevicePresent === !1 && c.createErrorEvent("Video device is not present", "NO_VIDEO_DEVICE"), d.session.apiCCWebRTCClient.webRTCClient.audioDevicePresent === !1 && (d.session.apiCCWebRTCClient.webRTCClient.gum_config.audio = !1), d.session.apiCCWebRTCClient.webRTCClient.videoDevicePresent === !1 && (d.session.apiCCWebRTCClient.webRTCClient.gum_config.video = !1), d.session.apiCCWebRTCClient.webRTCClient.audioDevicePresent === !1 && d.session.apiCCWebRTCClient.webRTCClient.videoDevicePresent === !1 && (d.session.apiCCWebRTCClient.webRTCClient.unidirectionelCallOnly = !0), s.audioDevicePresent = d.session.apiCCWebRTCClient.webRTCClient.audioDevicePresent, s.videoDevicePresent = d.session.apiCCWebRTCClient.webRTCClient.videoDevicePresent, d.session.setUserData(s), c.createWebRTCClientCreatedEvent()
        }, this.activateScreenSharing = function(i) {
            var n = null,
                s = null;
            i !== t || (i = "mjjnofoemoepfididplbfimokpnpcoeg"), "chrome" === this.myWebRTC_Adapter.webrtcDetectedBrowser ? (n = document.getElementById(i), null !== n ? e.postMessage("apiRTC-extension", "*") : (s = document.createElement("link"), s.href = "https://chrome.google.com/webstore/detail/" + i, s.rel = "chrome-webstore-item", s.id = i, document.getElementsByTagName("head")[0].appendChild(s), e.postMessage("apiRTC-extension", "*"), e.addEventListener("message", function(i) {
                var n = apiCCIDCookie.session.apiCCWebRTCClient.webRTCClient,
                    s = null;
                i.origin == e.location.origin && ("apiRTC-DeskstopCapture-loaded" == i.data && (n.apiRTCExtensionInstalled = !0), i.data.desktopId != t && "mediaError" != i.data.desktopId && (s = d.session.apiCCWebRTCClient.webRTCClient.findCallWithCallId(i.data.callNumber), d.session.apiCCWebRTCClient.webRTCClient.setStatus("Calling Destination number :" + s.calleeId), s.desktopId = i.data.desktopId, "screenSharing" === s.callType ? s.getUserMediaOnCall() : s.getScreenUserMediaOnCall()), "mediaError" == i.data.desktopId && (s = d.session.apiCCWebRTCClient.webRTCClient.findCallWithCallId(i.data.callNumber), "screenSharing" === s.callType && d.session.apiCCWebRTCClient.webRTCClient.removeCallFromTableWithCallIdandRemoteId(i.data.callNumber, i.data.remoteId, "Media_Error"), "https:" != e.location.protocol, c.createDesktopCaptureEvent("UserMediaError", i.data.callNumber, i.data.remoteId)), "extensionInstalledAndLoaded" == i.data && 0 !== d.session.apiCCWebRTCClient.webRTCClient.waitingShareScreenCallId && (e.postMessage({
                    command: "getDesktopId",
                    callNumber: d.session.apiCCWebRTCClient.webRTCClient.waitingShareScreenCallId,
                    remoteId: d.session.apiCCWebRTCClient.webRTCClient.waitingShareScreenDestNumber
                }, "*"), d.session.apiCCWebRTCClient.webRTCClient.waitingShareScreenCallId = 0, d.session.apiCCWebRTCClient.webRTCClient.waitingShareScreenDestNumber = 0))
            }))) : c.createDesktopCaptureEvent("Browser_Not_Compatible", null, null)
        }, this.onSetLocalDescriptionSuccess = function() {}, this.onSetLocalDescriptionFailure = function(e) {
            e = null
        }, this.onSetRemoteDescriptionSuccess = function() {}, this.onSetRemoteDescriptionFailure = function(e) {
            e = null
        }, this.setGetUserMediaConfig = function(e) {
            this.gum_config = e
        }, this.getUserMedia = function() {
            var e = null,
                i = null;
            try {
                null === this.audioSourceId && null === this.videoSourceId ? e = this.gum_config : (this.gum_config.audio.optional = [{
                    sourceId: this.audioSourceId
                }], this.gum_config.video.optional = [{
                    sourceId: this.videoSourceId
                }], e = this.gum_config), this.lastUsedUserMediaConstraint = e, navigator.mediaDevices !== t && navigator.mediaDevices.getUserMedia !== t ? i = navigator.mediaDevices.getUserMedia(e).then(this.callback(this, "onUserMediaSuccess"))["catch"](this.callback(this, "onUserMediaError")) : this.myWebRTC_Adapter.getUserMedia(e, this.callback(this, "onUserMediaSuccess"), this.callback(this, "onUserMediaError"))
            } catch (n) {
                alert("getUserMedia() failed. Is this a WebRTC capable browser?")
            }
        }, this.onUserMediaSuccess = function(e) {
            this.accessToLocalMedia = !0;
            var t = !1,
                i = "Unknown",
                n = !1,
                s = "Unknown";
            this.miniVideo && this.myWebRTC_Adapter.attachMediaStream(this.miniVideo, e), this.localVideo && (this.myWebRTC_Adapter.attachMediaStream(this.localVideo, e), this.localVideo.style.opacity = 1), this.localStream = e, e.getAudioTracks().length > 0 && (t = !0, e.getAudioTracks()[0].label && (i = e.getAudioTracks()[0].label)), e.getVideoTracks().length > 0 && (n = !0, e.getVideoTracks()[0].label && (s = e.getVideoTracks()[0].label)), this.myWebRTC_Event.createUserMediaSuccessEvent(!1, t, i, n, s, "media", null, e, null)
        }, this.onUserMediaError = function(t) {
            t = null, this.accessToLocalMedia = !1, "Chrome" === f && this.myWebRTC_Adapter.webrtcDetectedVersion > 47 && "https:" != e.location.protocol && alert("HTTPS is now mandatory to use getUserMedia()"), this.myWebRTC_Event.createUserMediaErrorEvent(!1, "media"), d.session.tryAudioCallAfterUserMediaError === !0 && this.lastUsedUserMediaConstraint.video !== !1 && (this.videoSourceId = null, this.gum_config.video = !1, this.getUserMedia())
        }, this.processInvite = function(e) {
            var i = 0,
                n = null,
                s = !1,
                a = !0,
                o = null;
            if (n = new p(this), n.callId = e.callId, n.callerId = e.callerId, n.calleeId = this.clientId, n.dest_roomId = e.roomId, n.callee = !0, n.remoteId = e.callerId, n.data = e.data, n.receivedSdpOfferMessage = e.sdpoffer, e.data !== t && "sipConnector" === e.data.pubSub && (n.trickleIce = !1, n.remoteType = "sip"), n.checkDTLSCompliancy(), i = this.callsTable.push(n), "screenSharing" === e.callType) n.screenSharing = !0, n.callType = "screenSharing";
            else if ("data" === e.callType);
            else if (this.allowMultipleCalls === !1)
                if (2 == i) {
                    if ("screenSharing" !== this.callsTable[0].callType && "data" !== this.callsTable[0].callType) return this.myWebRTC_Event.createCallAttemptEvent(this.clientId, e.callerId, e.callerNickname, n.callId), void this.refuseCall(n.callId, "User_Busy")
                } else if (i >= 2) return this.myWebRTC_Event.createCallAttemptEvent(this.clientId, e.callerId, e.callerNickname, n.callId), void this.refuseCall(n.callId, "User_Busy");
            o = this.mySDPManager.getVideoMediaDescriptionPart(e.sdpoffer.sdp), o !== t ? s = this.mySDPManager.searchSDPForVideoRecvOnly(o) : a = !1, (s || a === !1) && (n.audioOnly = !0, n.callType = "audio"), this.autoAnswer === !0 && this.displayHangUpButtonInCommand(), "data" === e.callType ? (n.callType = "data", n.dataCall = !0, this.setStatus("Incoming data Call from ongoing :" + e.callerId), n.onUserMediaSuccessTestUni(), this.myWebRTC_Event.createIncomingCallEvent(this.clientId, e.callerId, e.callerNickname, n.callId, !1, i, !1, e.callType, !1, n.remoteType)) : this.unidirectionelCallOnly || n.screenSharing === !0 ? (this.unidirectionelCallOnly && this.setStatus("You are connected to " + e.callerId + ', your audio and video media are not transmitted. <input type="button" id="AddMedia" value="Activate Audio & Video" onclick="apiCC.session.apiCCWebRTCClient.addMedia(' + n.callId + ')" />'), n.screenSharing === !0 ? (this.setStatus("Screensharing session activated, accepting unidirectionnel call"), n.onUserMediaSuccessTestUni()) : this.userAcceptOnIncomingCall || n.onUserMediaSuccessTestUni(), this.myWebRTC_Event.createIncomingCallEvent(this.clientId, e.callerId, e.callerNickname, n.callId, !1, i, !1, e.callType, !1, n.remoteType)) : this.accessToLocalMedia === !0 && this.autoAnswer === !0 ? (this.setStatus("You are connected to :" + e.callerId), this.myWebRTC_Event.createIncomingCallEvent(this.clientId, e.callerId, e.callerNickname, n.callId, !0, i, n.audioOnly, e.callType, !1, n.remoteType), this.userAcceptOnIncomingCall || n.establishCall()) : (this.setStatus("Incoming Call from :" + e.callerId + '. Click on "Autoriser" button to accept.'), this.myWebRTC_Event.createIncomingCallEvent(this.clientId, e.callerId, e.callerNickname, n.callId, !1, i, n.audioOnly, e.callType, !1, n.remoteType), n.audioOnly === !0 && d.session.apiCCWebRTCClient.webRTCClient.audioDevicePresent === !1 ? (this.setStatus("You are connected to " + e.callerId + ', your audio and video media are not transmitted. <input type="button" id="AddMedia" value="Activate Audio & Video" onclick="apiCC.session.apiCCWebRTCClient.addMedia(' + n.callId + ')" />'), n.onUserMediaSuccessTestUni()) : n.getUserMediaOnCall())
        }, this.process200OK = function(e) {
            var i = null,
                n = null,
                s = null,
                o = 0,
                l = null,
                r = !0,
                c = null,
                d = !1;
            if (i = this.findCallWithCallIdAndRemoteId(e.callId, e.calleeId), null === i) {
                if (n = this.findCallWithCallId(e.callId), null === n) return void this.myWebRTC_Event.createErrorEvent("200OK received but callId is not matching, no process", "NOT_MATCHING_CALLID_ON_200OK");
                s = new p(this), s.callId = e.callId, s.callerId = e.callerId, s.calleeId = e.calleeId, s.dest_roomId = e.roomId, s.callee = !1, s.remoteId = e.calleeId, s.createPeerConnection(), s.sendedSdpOfferMessage = n.sendedSdpOfferMessage, s.audioOnly = !1, i.checkDTLSCompliancy();
                try {
                    s.callLocalStream = new webkitMediaStream(n.callLocalStream.getAudioTracks(), n.callLocalStream.getVideoTracks())
                } catch (h) {
                    s.callLocalStream = new webkitMediaStream(n.callLocalStream)
                }
                s.generatedLocalStream = !0, s.started = !0, o = this.callsTable.push(s), s.pc.addStream(n.callLocalStream), s.pc.setLocalDescription(s.sendedSdpOfferMessage, this.callback(this, "onSetLocalDescriptionSuccess"), this.callback(this, "onSetLocalDescriptionFailure")), l = new this.myWebRTC_Adapter.RTCSessionDescription(e.sdpanswer), s.pc.setRemoteDescription(l, this.callback(this, "onSetRemoteDescriptionSuccess"), this.callback(this, "onSetRemoteDescriptionFailure")), this.setStatus("You are connected to :" + e.calleeId), this.myWebRTC_Event.createCallEstablishedEvent(e.calleeId, "media", s.callId, s.destCallType)
            } else i.calleeId = e.calleeId, c = this.mySDPManager.getVideoMediaDescriptionPart(e.sdpanswer.sdp), c !== t ? d = this.mySDPManager.searchSDPForVideoRecvOnly(c) : r = !1, (d || r === !1) && (i.destCallType = "audio"), i.trickleIce === !0 && i.pc.setLocalDescription(i.sendedSdpOfferMessage, this.callback(this, "onSetLocalDescriptionSuccess"), this.callback(this, "onSetLocalDescriptionFailure")), l = new this.myWebRTC_Adapter.RTCSessionDescription(e.sdpanswer), i.receivedSdpOfferMessage = e.sdpanswer, i.pc.setRemoteDescription(l, this.callback(this, "onSetRemoteDescriptionSuccess"), this.callback(this, "onSetRemoteDescriptionFailure")), this.setStatus("You are connected to :" + e.calleeId), i.screenSharing === !0 && (i.callType = "screenSharing"), null !== e.data && e.data !== t && (i.data = null !== i.data && i.data !== t ? a(i.data, e.data) : e.data), this.myWebRTC_Event.createCallEstablishedEvent(e.calleeId, i.callType, i.callId, i.destCallType)
        }, this.processCandidate = function(e) {
            var i = null,
                n = null;
            i = e.callerId === this.clientId ? this.findCallWithCallIdAndRemoteId(e.callId, e.calleeId) : this.findCallWithCallIdAndRemoteId(e.callId, e.callerId), null !== i && i.started && null !== i.pc && (n = new this.myWebRTC_Adapter.RTCIceCandidate(e.completeCandidate !== t ? {
                sdpMLineIndex: e.completeCandidate.sdpMLineIndex,
                candidate: e.completeCandidate.candidate
            } : {
                sdpMLineIndex: e.label,
                candidate: e.candidate
            }), i.pc.addIceCandidate(n, function() {}, function(e) {
                e = null
            }))
        }, this.processUpdate = function(e) {
            var t = null,
                i = null;
            return t = e.callerId === this.clientId ? this.findCallWithCallIdAndRemoteId(e.callId, e.calleeId) : this.findCallWithCallIdAndRemoteId(e.callId, e.callerId), null === t ? void this.myWebRTC_Event.createErrorEvent("Cannot find call to process Update", "CALL_NOT_FOUND_ON_UPDATE") : (i = new this.myWebRTC_Adapter.RTCSessionDescription(e.sdpoffer), t.pc.setRemoteDescription(i, this.callback(this, "onSetRemoteDescriptionSuccess"), this.callback(this, "onSetRemoteDescriptionFailure")), void t.doUpdateAnswer())
        }, this.process200Update = function(e) {
            this.setStatus("You are connected to :" + e.calleeId);
            var t = null,
                i = null;
            return t = this.findCallWithRoomId(e.roomId), null === t ? void this.myWebRTC_Event.createErrorEvent("Cannot find call to process 200 Update", "CALL_NOT_FOUND_ON_200UPDATE") : (t.calleeId = e.calleeId, t.pc.setLocalDescription(t.sendedSdpOfferMessage, this.callback(this, "onSetLocalDescriptionSuccess"), this.callback(this, "onSetLocalDescriptionFailure")), i = new this.myWebRTC_Adapter.RTCSessionDescription(e.sdpanswer), t.pc.setRemoteDescription(i, this.callback(this, "onSetRemoteDescriptionSuccess"), this.callback(this, "onSetRemoteDescriptionFailure")), void(this.addingUserMedia === !0 && (this.miniVideo && (this.miniVideo.style.opacity = 1), this.addingUserMedia = !1)))
        }, this.onHangup = function(e) {
            this.clientId=getCookie('login'), this.initMediaElementState(), e === t ? this.removeAllCalls() : this.removeCallFromTableWithCallIdAndSendBye(e, null), this.displayCallButtonInCommand()
        }, this.stopStream = function(e) {
            var t = 0,
                i = null;
            if ("Chrome" === f && this.myWebRTC_Adapter.webrtcDetectedVersion >= 45 || "Firefox" === f && this.myWebRTC_Adapter.webrtcDetectedVersion >= 44 || "Opera" === f && this.myWebRTC_Adapter.webrtcDetectedVersion >= 34 || "Chromium" === f && this.myWebRTC_Adapter.webrtcDetectedVersion >= 44)
                for (i = e.getTracks(), t = 0; t < i.length; t += 1) i[t].stop();
            else e.stop();
            e = null
        }, this.removeAllCalls = function() {
            var e = this.callsTable.length,
                i = 0,
                n = 0,
                s = null,
                a = null,
                o = 0;
            for (i = 0; e > i; i += 1) {
                if (n = 0, n = this.callsTable[i - o].callee ? this.callsTable[i - o].callerId : this.callsTable[i - o].calleeId, this.callsTable[i - o].callee === !0) a = "Hangup_From_Callee", this.callsTable[i - o].myWebRTC_Stack.sendBye(this.callsTable[i - o].callId, this.clientId, this.callsTable[i - o].dest_roomId, n, a, this.callsTable[i - o].data);
                else {
                    if (a = "Hangup_From_Caller", this.callsTable[i - o].inviteSended !== !0) {
                        this.callsTable[i - o].callCancelled = !0;
                        continue
                    }
                    this.callsTable[i - o].myWebRTC_Stack.sendBye(this.callsTable[i - o].callId, this.clientId, this.callsTable[i - o].dest_roomId, n, a, this.callsTable[i - o].data)
                }
                null !== this.callsTable[i - o].callLocalStream && (this.callsTable[i - o].generatedLocalStream === !0 || this.autoAnswer === !1 && this.stopStream(this.callsTable[i - o].callLocalStream)), null !== this.callsTable[i - o].screenStream && this.stopStream(this.callsTable[i - o].screenStream), null !== this.callsTable[i - o].pc && (this.qosEnable && "undefined" != typeof this.callsTable[i - o].qm && null !== this.callsTable[i - o].qm && "function" == typeof this.callsTable[i - o].qm.saveStatsToDb && (this.callsTable[i - o].qm.saveStatsToDb(!0), clearInterval(this.callsTable[i - o].statisticId)), this.callsTable[i - o].pc.close(), this.callsTable[i - o].pc = null), s = this.callsTable[i - o].callId + "-" + this.callsTable[i - o].calleeId, this.removeRemoteVideoDisplay(s), this.myWebRTC_Event.createHangupEvent("local", this.clientId, 0, !0, a, this.callsTable[i - o].callId, this.callsTable[i - o].callType), this.callsTable[i - o].data !== t && null !== this.callsTable[i - o].data && ("MCU-Caller" === this.callsTable[i - o].data.MCUType || "MCU-Callee" === this.callsTable[i - o].data.MCUType) && this.myWebRTC_Event.createRecordedStreamsAvailableEvent(this.callsTable[i - o].data.confId, this.callsTable[i - o].callerId, this.callsTable[i - o].calleeId), this.callsTable.splice(i - o, 1), o += 1
            }
        }, this.onRemoteHangup = function(e, n, s, a, o, l) {
            var r = null;
            e !== t ? r = this.removeCallFromTableWithCallIdandRemoteId(e, n, a) : o !== t && (r = this.removeCallFromTableWithConfIdandRemoteId(o, n, a)), this.setStatus(a === t ? "<div>Your partner : " + n + " have left the call. You can be joigned with this number : " + this.clientId + "</div>" : "<div>Call hangup with reason : " + a + ". You can be joigned with this number : " + this.clientId + "</div>"), 0 === this.callsTable.length ? (this.initMediaElementState(), this.myWebRTC_Event.createRemoteHangupEvent(this.clientId, n, !0, a), this.myWebRTC_Event.createHangupEvent("remote", this.clientId, n, !0, a, e, r), this.displayCallButtonInCommand(), this.getUserMediaOnGoing === !0 && i.deactivateReloadOnCancel !== !0 && (location.reload(), this.getUserMediaOnGoing = !1)) : (this.myWebRTC_Event.createRemoteHangupEvent(this.clientId, n, !1, a), this.myWebRTC_Event.createHangupEvent("remote", this.clientId, n, !1, a, e, r)), l !== t && null !== l && ("MCU-Caller" === l.MCUType || "MCU-Callee" === l.MCUType) && this.myWebRTC_Event.createRecordedStreamsAvailableEvent(o, this.clientId, n)
        }, this.removeCallFromTableWithCallIdAndSendBye = function(e, t) {
            var i = 0,
                n = null,
                s = 0,
                a = null;
            i = this.findCallIndexWithCallId(e), -1 !== i && (null !== this.callsTable[i].callLocalStream && (this.callsTable[i].generatedLocalStream === !0 || this.autoAnswer === !1 && this.stopStream(this.callsTable[i].callLocalStream)), null !== this.callsTable[i].screenStream && this.stopStream(this.callsTable[i].screenStream), null !== this.callsTable[i].pc && (this.qosEnable && "undefined" != typeof this.callsTable[i].qm && null !== this.callsTable[i].qm && "function" == typeof this.callsTable[i].qm.saveStatsToDb && (this.callsTable[i].qm.saveStatsToDb(!0), clearInterval(this.callsTable[i].statisticId)), this.callsTable[i].pc.close(), this.callsTable[i].pc = null), n = this.callsTable[i].callId + "-" + this.callsTable[i].calleeId, this.removeRemoteVideoDisplay(n), this.callsTable[i].callee ? (a = this.callsTable[i].callerId, null === t && (t = "Hangup_From_Callee")) : (a = this.callsTable[i].calleeId, null === t && (t = "Hangup_From_Caller")), this.callsTable[i].myWebRTC_Stack.sendBye(this.callsTable[i].callId, this.clientId, this.callsTable[i].dest_roomId, a, t, this.callsTable[i].data), this.myWebRTC_Event.createHangupEvent("local", this.clientId, 0, !0, t, this.callsTable[i].callId, this.callsTable[i].callType), this.callsTable.splice(i, 1), s = this.callsTable.length, this.miniVideo && 0 !== s && this.myWebRTC_Adapter.attachMediaStream(this.miniVideo, this.callsTable[0].callLocalStream))
        }, this.removeCall = function(e) {
            var t = null,
                i = 0,
                n = null;
            return -1 !== e && (null !== this.callsTable[e].callLocalStream && (this.callsTable[e].generatedLocalStream === !0 || this.autoAnswer === !1 && this.stopStream(this.callsTable[e].callLocalStream)), null !== this.callsTable[e].screenStream && this.stopStream(this.callsTable[e].screenStream), null !== this.callsTable[e].pc && (this.qosEnable && "undefined" != typeof this.callsTable[e].qm && null !== this.callsTable[e].qm && "function" == typeof this.callsTable[e].qm.saveStatsToDb && (this.callsTable[e].qm.saveStatsToDb(!0), clearInterval(this.callsTable[e].statisticId)), this.callsTable[e].pc.close(), this.callsTable[e].pc = null), t = this.callsTable[e].callId + "-" + this.callsTable[e].calleeId, this.removeRemoteVideoDisplay(t), n = this.callsTable[e].callType, this.callsTable.splice(e, 1), i = this.callsTable.length, this.miniVideo && 0 !== i && this.myWebRTC_Adapter.attachMediaStream(this.miniVideo, this.callsTable[0].callLocalStream)), n
        }, this.removeCallFromTableWithConfIdandRemoteId = function(e, t, i) {
            i = null;
            var n = null,
                s = null;
            return n = this.findCallIndexWithConfIdAndRemoteId(e, t), s = this.removeCall(n)
        }, this.removeCallFromTableWithCallIdandRemoteId = function(e, t, i) {
            i = null;
            var n = 0,
                s = null;
            return n = this.findCallIndexWithCallIdAndRemoteId(e, t), s = this.removeCall(n)
        }, this.transitionToActive = function() {
            this.remoteVideo && (this.remoteVideo.style.opacity = 1), setTimeout(this.callback(this, "callback2"), 1e3)
        }, this.callback2 = function() {
            this.miniVideo && (this.miniVideo.style.opacity = 1)
        }, this.initMediaElementState = function() {
            this.autoAnswer === !1 ? this.localVideo && (this.localVideo.style.opacity = 0, this.localVideo.src = "") : this.localVideo && (this.localVideo.style.opacity = 1), this.remoteVideo && (this.remoteVideo.style.opacity = 0, this.remoteVideo.src = ""), this.miniVideo && (this.miniVideo.style.opacity = 0), this.autoAnswer === !0 || this.miniVideo && (this.miniVideo.src = "")
        }, this.toggleVideoMute = function() {
            var e = 0,
                t = this.callsTable.length;
            if (this.isVideoMuted)
                for (null !== this.localStream && this.unMuteTracks(this.localStream.getVideoTracks()), e = 0; t > e; e += 1) null !== this.callsTable[e].callLocalStream && this.unMuteTracks(this.callsTable[e].callLocalStream.getVideoTracks());
            else
                for (null !== this.localStream && this.muteTracks(this.localStream.getVideoTracks()), e = 0; t > e; e += 1) null !== this.callsTable[e].callLocalStream && this.muteTracks(this.callsTable[e].callLocalStream.getVideoTracks());
            this.isVideoMuted = !this.isVideoMuted
        }, this.unMuteTracks = function(e) {
            var t = 0;
            if (0 !== e.length)
                for (t = 0; t < e.length; t += 1) e[t].enabled = !0
        }, this.muteTracks = function(e) {
            var t = 0;
            if (0 !== e.length)
                for (t = 0; t < e.length; t += 1) e[t].enabled = !1
        }, this.toggleAudioMute = function() {
            var e = 0,
                t = this.callsTable.length;
            if (this.isAudioMuted)
                for (null !== this.localStream && this.unMuteTracks(this.localStream.getAudioTracks()), e = 0; t > e; e += 1) null !== this.callsTable[e].callLocalStream && this.unMuteTracks(this.callsTable[e].callLocalStream.getAudioTracks());
            else
                for (null !== this.localStream && this.muteTracks(this.localStream.getAudioTracks()), e = 0; t > e; e += 1) null !== this.callsTable[e].callLocalStream && this.muteTracks(this.callsTable[e].callLocalStream.getAudioTracks());
            this.isAudioMuted = !this.isAudioMuted
        }, this.xhr = function(e, t, i, n) {
            var s = new XMLHttpRequest;
            s.onreadystatechange = function() {
                4 == s.readyState && 200 == s.status && i(s.responseText)
            }, "undefined" != typeof n && (s.upload.onprogress = n), s.open("POST", e), s.send(t)
        }, this.takeSnapshot = function(e, i, s, a, o, l, r) {
            var h = null,
                u = null,
                C = document.createElement("canvas"),
                p = 0,
                m = null,
                v = null,
                f = new Date,
                g = f.toJSON(),
                b = g.replace(new RegExp(":", "g"), "-"),
                I = null;
            switch (a) {
                case "Desactivated":
                    p = 0;
                    break;
                case "Low":
                    p = 2;
                    break;
                case "Medium":
                    p = 4;
                    break;
                case "High":
                    p = 6
            }
            if (r !== t) {
                if (I = document.getElementById(r), null === I) return void this.myWebRTC_Event.createErrorEvent("localVideo Div Name is not correct for takeSnapshot", "INCORRECT_VIDEOID_FOR_SNAPSHOT")
            } else if (null != this.localVideo) I = this.localVideo;
            else if (I = document.getElementById("myLocalVideo"), null === I) return void this.myWebRTC_Event.createErrorEvent("localVideo Div Name is not correct for takeSnapshot", "INCORRECT_VIDEOID_FOR_SNAPSHOT");

            C.width = I.clientWidth, C.height = I.clientHeight, h = C.getContext("2d"), h.drawImage(I, 0, 0, C.width, C.height), u = document.createElement("img"), u.src = C.toDataURL("image/png"), u.style.padding = 5, u.width = C.width, u.height = C.height, 0 !== p && (m = h.getImageData(0, 0, C.width, C.height), m = n(u, m, p), h.putImageData(m, 0, 0), u.src = C.toDataURL("image/png")), "object" == typeof i ? null !== i && (i.src = u.src) : null !== document.getElementById(i) && (document.getElementById(i).src = u.src), v = new FormData, o !== t ? (v.append("destFileName", this.clientId + "-" + b + ".png"), v.append("data", C.toDataURL("image/png")), v.append("sessionId", o)) : (v.append("photo", C.toDataURL("image/png")), v.append("clientId", this.clientId), v.append("apiKey", d.session.apiKey)), this.xhr(e, v, function(e) {
                if ("Photo received" !== e || "An error occurred." !== e) try {
                    var t = JSON.parse(e);
                    c.createSnapShotPhotoUploaded(t.fileUrl)
                } catch (i) {}
            }, l)
        }, this.takeSnapshotAndSendOnDataChannel = function(e, i, n, s) {
            var a = null,
                o = null,
                l = document.createElement("canvas"),
                r = null,
                c = null;
            return i !== t && (r = document.getElementById(i), null === r) ? void this.myWebRTC_Event.createErrorEvent("localVideo Div Name is not correct for takeSnapshot", "INCORRECT_VIDEOID_FOR_SNAPSHOT") : (l.width = r.clientWidth, l.height = r.clientHeight, a = l.getContext("2d"), a.drawImage(r, 0, 0, l.width, l.height), o = document.createElement("img"), o.src = l.toDataURL("image/png"), o.style.padding = 5, o.width = l.width, o.height = l.height, "object" == typeof e ? null !== e && (e.src = o.src) : null !== document.getElementById(e) && (document.getElementById(e).src = o.src), c = l.toDataURL("image/png"), void this.sendDataWithCallId(n, {
                file: c,
                name: "nomFichier",
                type: "image/png-dataUrl"
            }, s))
        }, this.callWithNumber = function(e, i, n) {
            var s = null,
                a = 0,
                o = null;
            return "" !== e && e !== this.clientId ? (this.setStatus("Calling Destination number :" + e), s = new p(this), s.generateCallId(), s.callerId = this.clientId, s.calleeId = e, s.dest_roomId = e, s.audioOnly = !i, s.remoteId = e, s.checkDTLSCompliancy(), o = s.callId, (0 === e.toString().indexOf("0") || 0 === e.toString().indexOf("+")) && (n !== t && null !== n ? n.pubSub = "sipConnector" : (n = {}, n.pubSub = "sipConnector"), s.trickleIce = !1), s.audioOnly === !0 && (s.callType = "audio"), n !== t && (s.data = n), "data" === n && (s.dataCall = !0), this.accessToLocalMedia === !0 && this.autoAnswer === !0 || s.dataCall ? (s.dataCall, s.establishCall()) : s.getUserMediaOnCall(), a = this.callsTable.push(s), this.autoAnswer === !0 && this.displayHangUpButtonInCommand()) : this.setStatus("Dialed call number is not correct :" + e + ".You can be joigned with this number : " + this.clientId), o
        }, this.extensionInstallationSuccessCallback = function() {
            d.session.apiCCWebRTCClient.webRTCClient.apiRTCExtensionInstalled = !0
        }, this.extensionInstallationFailureCallback = function(e, t) {
            e = null, t = null, c.createDesktopCaptureEvent("Extension_installation_Error", this.waitingShareScreenCallId, this.waitingShareScreenDestNumber), this.setStatus('Inline extension installation is not possible, please install extension using following link: <a href="https://chrome.google.com/webstore/detail/apizee-desktop-capture/mjjnofoemoepfididplbfimokpnpcoeg?hl=fr" target="_blank">ApiRTC desktopCapture extension</a>')
        }, this.manageNotInstalledExtension = function(e, t) {
            this.setStatus("ApiRTC extension need to be installed to enable screen sharing.<br>You can be joigned with this number : " + this.clientId), c.createDesktopCaptureEvent("Extension_not_installed", e, t), this.waitingShareScreenDestNumber = t, this.waitingShareScreenCallId = e, chrome.webstore.install("https://chrome.google.com/webstore/detail/mjjnofoemoepfididplbfimokpnpcoeg", this.callback(this, "extensionInstallationSuccessCallback"), this.callback(this, "extensionInstallationFailureCallback"))
        }, this.shareScreen = function(i, n) {
            var s = null,
                a = null,
                o = 0;
            if ("chrome" === this.myWebRTC_Adapter.webrtcDetectedBrowser)
                if ("" !== i && i !== this.clientId) {
                    if (a = new p(d.session.apiCCWebRTCClient.webRTCClient), a.generateCallId(), s = a.callId, a.callerId = this.clientId, a.calleeId = i, a.dest_roomId = i, a.audioOnly = !1, a.screenSharing = !0, a.remoteId = i, a.callType = "screenSharing", a.checkDTLSCompliancy(), n !== t && (a.data = n), o = d.session.apiCCWebRTCClient.webRTCClient.callsTable.push(a), this.apiRTCExtensionInstalled === !1) return this.manageNotInstalledExtension(a.callId, a.remoteId), s;
                    e.postMessage({
                        command: "getDesktopId",
                        callNumber: s,
                        remoteId: i
                    }, "*")
                } else this.setStatus("Dialed call number is not correct :" + i + ".You can be joigned with this number : " + this.clientId);
            else c.createDesktopCaptureEvent("Browser_Not_Compatible", s, i);
            return s
        }, this.startScreenSharingOnCall = function(t) {
            var i = null;
            if ("chrome" === this.myWebRTC_Adapter.webrtcDetectedBrowser) {
                if (i = this.findCallWithCallId(t), null !== i) {
                    if (this.apiRTCExtensionInstalled === !1) return void this.manageNotInstalledExtension(i.callId, i.remoteId);
                    e.postMessage({
                        command: "getDesktopId",
                        callNumber: i.callId,
                        remoteId: i.remoteId
                    }, "*")
                }
            } else c.createDesktopCaptureEvent("Browser_Not_Compatible", i.callId, i.remoteId)
        }, this.toggleVideoScreen = function(e) {
            var t = this.findCallWithCallId(e);
            null !== t && t.toggleVideoScreen()
        }, this.switchVideoToScreen = function(e) {
            var t = this.findCallWithCallId(e);
            null !== t && t.switchVideoToScreen()
        }, this.switchScreenToVideo = function(e) {
            var t = this.findCallWithCallId(e);
            null !== t && t.switchScreenToVideo()
        }, this.callbymail = function(e) {
            s(e) && (this.socket.emit("webrtc_invite_permail", e), i.channel.socket.emit("webrtc_invite_permail", e))
        }, this.callperURL = function(e) {
            var t = null,
                i = 0;
            t = new p(this), t.generateCallId(), t.callerId = this.clientId, t.calleeId = e, t.dest_roomId = e, t.audioOnly = !1, t.getUserMediaOnCall(), t.remoteId = e, t.checkDTLSCompliancy(), i = this.callsTable.push(t)
        }, this.acceptCall = function(e) {
            var t = null;
            t = this.findCallWithCallId(e), null !== t && (this.unidirectionelCallOnly ? t.onUserMediaSuccessTestUni() : this.accessToLocalMedia === !0 ? t.establishCall() : t.getUserMediaOnCall())
        }, this.refuseCall = function(e, i) {
            var n = null,
                s = null;
            s = i !== t ? i : "User_Refuse_Call", n = this.findCallWithCallId(e), null !== n && ("MCU-Callee" === n.data.MCUType ? (n.myWebRTC_Stack.sendBye(n.callId, n.callerId, n.dest_roomId, n.calleeId, "User_Media_Error", n.data), this.removeCallFromTableWithCallIdandRemoteId(n.callId, n.calleeId, s)) : (n.myWebRTC_Stack.sendBye(n.callId, n.calleeId, n.dest_roomId, n.callerId, s, n.data), this.removeCallFromTableWithCallIdandRemoteId(n.callId, n.callerId, s)), 0 === this.callsTable.length && this.initMediaElementState())
        }, this.addMedia = function(e) {
            this.addingUserMedia = !0;
            var t = null;
            t = this.findCallWithCallId(e), null !== t && (this.accessToLocalMedia === !0 && this.autoAnswer === !0 ? t.establishCall() : t.getUserMediaOnCall())
        }, this.findCallWithRoomId = function(e) {
            var t = 0,
                i = this.callsTable.length;
            for (t = 0; i > t; t += 1)
                if (this.callsTable[t].dest_roomId === e) return this.callsTable[t];
            return null
        }, this.findCallIndexWithCallIdAndRemoteId = function(e, t) {
            var i = 0,
                n = this.callsTable.length;
            for (i = 0; n > i; i += 1)
                if (this.callsTable[i].callId == e && (this.callsTable[i].callee === !0 && this.callsTable[i].callerId == t || this.callsTable[i].callee === !1 && this.callsTable[i].calleeId == t)) return i;
            return -1
        }, this.findCallIndexWithConfIdAndRemoteId = function(e, t) {
            var i = 0,
                n = this.callsTable.length;
            for (i = 0; n > i; i += 1)
                if (this.callsTable[i].data.confId == e && (this.callsTable[i].callee === !0 && this.callsTable[i].callerId == t || this.callsTable[i].callee === !1 && this.callsTable[i].calleeId == t)) return i;
            return -1
        }, this.findCallIndexWithCallId = function(e) {
            var t = 0,
                i = this.callsTable.length;
            for (t = 0; i > t; t += 1)
                if (this.callsTable[t].callId == e) return t;
            return -1
        }, this.findCallWithCallId = function(e) {
            var t = 0,
                i = this.callsTable.length;
            for (t = 0; i > t; t += 1)
                if (this.callsTable[t].callId == e) return this.callsTable[t];
            return null
        }, this.findCallWithStreamId = function(e) {
            var t = 0,
                i = this.callsTable.length;
            for (t = 0; i > t; t += 1)
                if (this.callsTable[t].streamId == e) return this.callsTable[t];
            return null
        }, this.findCallWithCallIdAndRemoteId = function(e, t) {
            var i = 0,
                n = this.callsTable.length;
            for (i = 0; n > i; i += 1)
                if (this.callsTable[i].callId === e && (this.callsTable[i].callee === !0 && this.callsTable[i].callerId == t || this.callsTable[i].callee === !1 && this.callsTable[i].calleeId == t)) return this.callsTable[i];
            return null
        }, this.findCallWithRemoteId = function(e) {
            var t = 0,
                i = this.callsTable.length;
            for (t = 0; i > t; t += 1)
                if (this.callsTable[t].callee === !0 && this.callsTable[t].callerId == e || this.callsTable[t].callee === !1 && this.callsTable[t].calleeId == e) return this.callsTable[t];
            return null
        }, this.remoteVideoDisplayManager = function() {
            var t = 0,
                i = null,
                n = 0,
                s = 0,
                a = 0,
                o = 0,
                l = .75 * o,
                r = 0,
                c = 0;
            for (this.remoteVideo && (0 === this.maxWidthRemoteVideo && (this.maxWidthRemoteVideo = this.remoteVideo.clientWidth), 0 === this.maxHeightRemoteVideo && (this.maxHeightRemoteVideo = this.remoteVideo.clientHeight), i = this.remoteVideo.children, n = i.length, s = this.maxWidthRemoteVideo, a = this.maxHeightRemoteVideo, o = this.remoteVideo.clientWidth, l = .75 * o), o > s && (o = s), o /= n, l = .75 * o, l > a && (l = a, o = 4 / 3 * l), r = o / s * 100, c = l / a * 100, r += "%", c += "%", t = 0; n > t; t += 1) i[t].style.cssText = "width:" + r + ";height:" + c + ";";
            l = e.innerHeight - l - 60
        }, this.removeRemoteVideoDisplay = function(e) {
            var t = "callId_" + e,
                i = 0,
                n = null,
                s = 0;
            for (this.remoteVideo && (n = this.remoteVideo.children, s = n.length), i = 0; s > i; i += 1)
                if (n[i].id === t) return void this.remoteVideo.removeChild(n[i]);
            this.remoteVideoDisplayManager()
        }, this.setStatus = function(e) {
            null !== this.statusDiv && (this.statusDiv.innerHTML = e)
        }, this.displayCallButtonInCommand = function() {
            if (null !== this.commandDiv) {
                var e = '<input type="texte" name="mail" value="" placeholder="Enter Destination number..."><a href="#" onClick = "apiCC.session.apiCCWebRTCClient.call(document.forms.form1.mail.value);"><img src="http://www.apizee.com/Demo/images/Call.png" height="30px"></a></input>';
                this.commandDiv.innerHTML = '<form name="form1" action="">' + e + "</form>"
            }
        }, this.displayHangUpButtonInCommand = function() {
            null !== this.commandDiv && (this.commandDiv.innerHTML = '<a href="#" onClick = "apiCC.session.apiCCWebRTCClient.toggleAudioMute()"> <img src="http://www.apizee.com/Demo/images/Microphone.png" height="30px" disabled="true"></a><a href="#" onClick = "apiCC.session.apiCCWebRTCClient.toggleVideoMute();"> <img src="http://www.apizee.com/Demo/images/Camera2.png" height="30px" disabled="true"></a><a href="#" onClick = "apiCC.session.apiCCWebRTCClient.hangUp()"> <img src="http://www.apizee.com/Demo/images/Hangup.png" height="30px" disabled="true"> </a>')
        }, this.checkURLForCallDestination = function() {
            var e = 0;
            return "room" === location.search.substring(1, 5) && (e = location.search.substring(6)), e
        }, this.releaseUserMedia = function() {
            null !== this.localStream && (this.stopStream(this.localStream), this.accessToLocalMedia = !1, this.autoAnswer = !1), null !== this.screenStream && this.screenStream !== t && this.stopStream(this.screenStream)
        }, this.startDataChannelOnCall = function(e) {
            var t = this.findCallWithCallId(e);
            t && (t.addingDataChannelOnCallOngoing = !0, t.createDataChannel())
        }, this.sendDataWithCallId = function(e, t, i) {
            var n = this.findCallWithCallId(e);
            n && n.sendData(t, i)
        }, this.setVideoBandwidth = function(e) {
            this.videoBandwidth = e
        }, this.setAudioBandwidth = function(e) {
            this.audioBandwidth = e
        }, this.setDataBandwidth = function(e) {
            this.dataBandwidth = e
        }, this.callback = function(e, t) {
            return this.closureHandler = function(i) {
                return e[t](i)
            }, this.closureHandler
        }, this.callbackWithParams = function(e, t) {
            return this.closureHandler = function(i, n, s) {
                return e[t](i, n, s)
            }, this.closureHandler
        }
    }, d.ApiCCIMClient = function(e, i) {
        this.convTable = [], this.myWebRTC_Event = new r, this.nickname = e.nickname, this.photoURL = null, this.userDataSetted = !1, this.myWebRTC_Stack = new u(e.channel.socket), this.findIMIdWithDestID = function(e) {
            var t = 0,
                i = this.convTable.length;
            for (t = 0; i > t; t += 1)
                if (this.convTable[t].dest_roomId == e) return this.convTable[t].IMId;
            return 0
        }, this.addInConvTable = function(e) {
            var t = 0,
                i = this.convTable.length;
            for (t = 0; i > t; t += 1)
                if (this.convTable[t].dest_roomId == e.dest_roomId) return void(this.convTable[t].IMId = e.IMId);
            this.convTable.push(e)
        }, this.sendMessage = function(i, n, s) {
            var a = this.findIMIdWithDestID(i),
                o = null,
                l = null,
                r = null,
                c = null,
                h = e.channel.getNewCSeq();
            return o = {
                type: "IMMessage",
                IMId: a,
                senderId: e.apiCCId,
                nickname: this.nickname,
                photoURL: this.photoURL,
                dstRoomId: i,
                data: n,
                cSeq: h
            }, l = JSON.stringify(o), r = document.createElement("message"), s !== t ? (c = setTimeout(function() {
                var e = {
                    reason: "timeoutReached",
                    cSeq: h
                };
                s(e), delete d.session.messageTimeOutTable[h]
            }, e.messageTimeOutTimer), e.messageTimeOutTable[h] = c, e.channel.socket.emit("IMMessage", l, function(e) {
                s(e), d.session.messageTimeOutTable[h] !== t && (clearTimeout(d.session.messageTimeOutTable[h]), delete d.session.messageTimeOutTable[h])
            })) : e.channel.socket.emit("IMMessage", l), null !== this.conversation && (r.innerHTML = "<b>me :</b> " + n + "<br>", this.conversation.appendChild(r), this.conversation.scrollTop = this.conversation.scrollHeight), h
        }, this.newConversationCreated = function(e) {
            var t = {
                dest_roomId: e.dstRoomId,
                IMId: e.IMId
            };
            this.addInConvTable(t)
        }, this.receiveMessage = function(e) {
            var t = null,
                i = null;
            i = {
                dest_roomId: e.senderId,
                IMId: e.IMId
            }, this.addInConvTable(i), null !== this.conversation && (t = document.createElement("message"), t.innerHTML = "<b>" + e.nickname + ":</b> " + e.data + "<br>", this.conversation.appendChild(t), this.conversation.scrollTop = this.conversation.scrollHeight), this.myWebRTC_Event.createReceiveIMMessageEvent(e.senderId, e.nickname, e.photoURL, e.data, e.UUCSeq, e.IMId)
        }, this.createGroupChat = function(t, i) {
            var n = null,
                s = null;
            n = {
                type: "createGroupChat",
                nickname: this.nickname,
                photoURL: this.photoURL,
                contactId1: t,
                contactId2: i
            }, s = JSON.stringify(n), e.channel.socket.emit("createGroupChat", s)
        }, this.groupChatCreation = function(e) {
            this.myWebRTC_Event.createGroupChatCreationEvent(e.status, e.groupChatId, e.contactId1, e.invitationSendedToInitialDestId, e.contactId2, e.invitationSendedToNewContactId)
        }, this.joinGroupChat = function(t) {
            var i = null,
                n = null;
            i = {
                type: "joinGroupChat",
                groupChatId: t
            }, n = JSON.stringify(i), e.channel.socket.emit("joinGroupChat", n)
        }, this.groupChatInvitation = function(e) {
            this.myWebRTC_Event.createGroupChatInvitationEvent(e.groupChatId, e.senderId, e.senderNickname, e.senderPhotoURL, e.contactList)
        }, this.answerToGroupChatInvitation = function(t, i) {
            if (i === !0 || i === !1) {
                var n = null,
                    s = null;
                n = {
                    type: "groupChatInvitationAnswer",
                    groupChatId: t,
                    senderId: e.apiCCId,
                    nickname: this.nickname,
                    photoURL: this.photoURL,
                    accept: i
                }, s = JSON.stringify(n), e.channel.socket.emit("groupChatInvitationAnswer", s)
            }
        }, this.groupChatMemberUpdate = function(e) {
            this.myWebRTC_Event.createGroupChatMemberUpdateEvent(e.groupChatId, e.contactList, e.status)
        }, this.addUserInGroupChat = function(t, i) {
            var n = null,
                s = null;
            n = {
                type: "addUserInGroupChat",
                groupChatId: t,
                nickname: this.nickname,
                photoURL: this.photoURL,
                contactId: i
            }, s = JSON.stringify(n), e.channel.socket.emit("addUserInGroupChat", s)
        }, this.addUserInGroupChatAnswer = function(e) {
            this.myWebRTC_Event.createAddUserInGroupChatEvent(e.invitationSended, e.groupChatId, e.contactId)
        }, this.leaveGroupChat = function(t) {
            var i = null,
                n = null;
            i = {
                type: "leaveGroupChat",
                groupChatId: t,
                nickname: this.nickname,
                photoURL: this.photoURL
            }, n = JSON.stringify(i), e.channel.socket.emit("leaveGroupChat", n)
        }, this.sendMessageToGroupChat = function(t, i) {
            var n = null,
                s = null;
            n = {
                type: "groupChatMessage",
                groupChatId: t,
                senderId: e.apiCCId,
                nickname: this.nickname,
                data: i
            }, s = JSON.stringify(n), e.channel.socket.emit("groupChatMessage", s)
        }, this.receiveGroupChatMessage = function(e) {
            this.myWebRTC_Event.createReceiveGroupChatMessageEvent(e.groupChatId, e.senderId, e.nickname, e.data)
        }, this.getConversationHistory = function(t) {
            var i = null,
                n = null;
            i = {
                type: "getConversationHistory",
                convId: t
            }, n = JSON.stringify(i), e.channel.socket.emit("getConversationHistory", n)
        }, this.receiveConversationHistory = function(e) {
            var t = 0,
                i = 0,
                n = [],
                s = null;
            if (null !== e.convHistory)
                for (i = e.convHistory.length, n = [], t = 0; i > t; t += 1) s = JSON.parse(e.convHistory[t]), n.push(s);
            this.myWebRTC_Event.createReceiveConversationHistoryEvent(e.convId, n, e.status)
        }, this.setUserData = function(t) {
            this.photoURL = t.photoURL, e.photoURL = t.photoURL;
            var i = null,
                n = null;
            i = {
                type: "setUserData",
                nickname: this.nickname,
                photoURL: this.photoURL
            }, n = JSON.stringify(i), e.channel.socket.emit("setUserData", n), this.userDataSetted = !0
        }, this.getUserData = function(t) {
            var i = null,
                n = null;
            i = {
                type: "getUserData",
                contactId: t
            }, n = JSON.stringify(i), e.channel.socket.emit("getUserData", n)
        }, this.receiveUserDataAnswer = function(e) {
            this.myWebRTC_Event.createUserDataAnswerEvent(e.userFound, e.contactId, e.nickname, e.photoURL)
        }, this.initialize = function(t) {
            var i = null,
                n = null;
            this.conversation = document.getElementById(t), null === this.conversation, i = {
                type: "registerIM",
                username: this.nickname
            }, n = JSON.stringify(i), e.channel.socket.emit("registerIM", n)
        }, this.initialize(i)
    }, d.ApiCCDataClient = function(e) {
        this.sendData = function(i, n, s) {
            var a = null,
                o = null,
                l = e.channel.getNewCSeq(),
                r = null;
            return a = {
                type: "dataMessage",
                senderId: e.apiCCId,
                dstRoomId: i,
                data: n,
                cSeq: l
            }, o = JSON.stringify(a), s !== t ? (r = setTimeout(function() {
                var e = {
                    reason: "timeoutReached",
                    cSeq: l
                };
                s(e), delete d.session.messageTimeOutTable[l]
            }, e.messageTimeOutTimer), e.messageTimeOutTable[l] = r, e.channel.socket.emit("dataMessage", o, function(e) {
                s(e), d.session.messageTimeOutTable[l] !== t && (clearTimeout(d.session.messageTimeOutTable[l]), delete d.session.messageTimeOutTable[l])
            })) : e.channel.socket.emit("dataMessage", o), l
        }, this.receiveData = function(e) {
            c.createReceiveDataEvent(e.senderId, e.dstRoomId, e.data)
        }
    }, R = function(e, t) {
        this.createRoom = function(t) {
            var i = null,
                n = null;
            i = {
                type: "createRoom",
                roomType: t,
                nickname: e.nickname,
                photoURL: e.photoURL
            }, n = JSON.stringify(i), e.channel.socket.emit("createRoom", n)
        }, this.roomCreation = function(e) {
            t(e)
        }, this.inviteInRoom = function(t, i, n) {
            var s = null,
                a = null;
            s = {
                type: "inviteInRoom",
                roomId: t,
                contactId: i,
                roomType: n,
                nickname: e.nickname,
                photoURL: e.photoURL
            }, a = JSON.stringify(s), e.channel.socket.emit("inviteInRoom", a)
        }, this.inviteInRoomStatus = function(e) {
            t(e)
        }, this.roomInvitation = function(e) {
            t(e)
        }, this.answerToRoomInvitation = function(t, i, n) {
            if (i === !0 || i === !1) {
                var s = null,
                    a = null;
                s = {
                    type: "roomInvitationAnswer",
                    roomId: t,
                    senderId: e.apiCCId,
                    nickname: e.nickname,
                    photoURL: e.photoURL,
                    accept: i,
                    roomType: n
                }, a = JSON.stringify(s), e.channel.socket.emit("roomInvitationAnswer", a)
            }
        }, this.roomMemberUpdate = function(e) {
            t(e)
        }, this.sendMessageToRoom = function(t, i, n) {
            var s = null,
                a = null;
            s = {
                type: "roomMessage",
                roomId: t,
                senderId: e.apiCCId,
                nickname: e.nickname,
                roomType: i,
                data: n
            }, a = JSON.stringify(s), e.channel.socket.emit("roomMessage", a)
        }, this.receiveRoomMessage = function(e) {
            t(e)
        }, this.leaveRoom = function(t, i) {
            var n = null,
                s = null;
            n = {
                type: "leaveRoom",
                roomId: t,
                nickname: e.nickname,
                photoURL: e.photoURL,
                roomType: i
            }, s = JSON.stringify(n), e.channel.socket.emit("leaveRoom", s)
        }
    }, d.ApiCCWhiteBoardClient = function(i, n, s, a, o) {
        function l(e) {
            var t = 1,
                i = setInterval(function() {.1 >= t && (clearInterval(i), e.style.display = "none"), e.style.opacity = t, e.style.filter = "alpha(opacity=" + 100 * t + ")", t -= .1 * t
                }, 50)
        }
        this.roomId = null, this.whiteBoardDisconnectionTimeoutId = 0, this.disconnectionTimer = o !== t ? o : 3e4, this.createRoom = function() {
            i.roomMgr.createRoom("whiteBoard")
        }, this.inviteInRoom = function(e, t) {
            i.roomMgr.inviteInRoom(e, t, "whiteBoard")
        }, this.answerToRoomInvitation = function(e, t) {
            i.roomMgr.answerToRoomInvitation(e, t, "whiteBoard")
        }, this.leaveRoom = function(e) {
            i.roomMgr.leaveRoom(e, "whiteBoard"), this.roomId = null
        }, this.clearPaper = function() {
            var e = this.canvas.width;
            this.canvas.width = e
        }, this.canvas = document.getElementById(n), this.ctx = this.canvas.getContext("2d"), this.drawLine = function(e, t, i, n) {
            this.ctx.moveTo(e, t), this.ctx.lineTo(i, n), this.ctx.stroke()
        }, this.getContext = function() {
            return this.ctx
        }, this.loadPhotoInBackground = function(e) {
            var t = document.getElementsByTagName("body")[0];
            t.style.backgroundImage = "url(" + e + ")", t.style.backgroundPosition = "50% 50%", t.style.backgroundRepeat = "no-repeat"
        }, this.messageProcessing = function(e) {
            var t = null,
                i = null,
                n = null;
            e.id in this.clients || (t = document.createElement("div"), t.className = "cursor", t.id = "cursorId" + e.id, this.cursors[e.id] = t, i = document.getElementById(s), i.appendChild(t)), this.cursors[e.id].style.left = e.x, this.cursors[e.id].style.top = e.y, e.drawing && this.clients[e.id] && (this.drawLine(this.clients[e.id].x, this.clients[e.id].y, e.x, e.y), "undefined" != typeof focusOnDrawing && (n = this.canvas.parentNode, n.scrollLeft = e.x - n.clientWidth / 2, n.scrollTop = e.y - n.clientHeight / 2)), this.clients[e.id] = e
        }, this.start = function() {
            function t(t) {
                var i = null,
                    n = null,
                    s = 0,
                    a = 0,
                    o = null,
                    l = {};
                return l.offsetX = 0, l.offsetY = 0, i = t.target, n = e.getComputedStyle(i, null), s = parseInt(n.borderLeftWidth, 10), a = parseInt(n.borderTopWidth, 10), o = i.getBoundingClientRect(), l.offsetX = t.clientX - s - o.left, l.offsetY = t.clientY - a - o.top, l
            }

            function n(e) {
                e.preventDefault(), c = !0;
                var n = 0,
                    s = e.changedTouches,
                    o = null,
                    r = {},
                    u = {};
                for (n = 0; n < s.length; n++) r = t(s[n]), h.x = r.offsetX, h.y = r.offsetY, u = {
                    x: r.offsetX,
                    y: r.offsetY,
                    drawing: !1,
                    id: d.session.apiCCId
                }, i.roomMgr.sendMessageToRoom(d.session.apiCCWhiteBoardClient.roomId, "whiteBoard", u);
                o = document.getElementById(a), null !== o && l(o)
            }

            function s(e) {
                c = !1, e = null
            }

            function o(e) {
                c = !1, e = null
            }

            function r(e) {
                var n = null,
                    s = 0,
                    a = e.changedTouches,
                    o = {};
                if (Date.now() - u > 30)
                    for (s = 0; s < a.length; s++) o = t(a[s]), n = {
                        x: o.offsetX,
                        y: o.offsetY,
                        drawing: c,
                        id: d.session.apiCCId
                    }, i.roomMgr.sendMessageToRoom(d.session.apiCCWhiteBoardClient.roomId, "whiteBoard", n), u = Date.now();
                if (c)
                    for (s = 0; s < a.length; s++) o = t(a[s]), d.session.apiCCWhiteBoardClient.drawLine(h.x, h.y, o.offsetX, o.offsetY), h.x = o.offsetX, h.y = o.offsetY
            }
            var c = !1,
                h = {},
                u = 0;
            this.clients = {}, this.cursors = {}, this.touchScreenActivated = !1, this.toggleTouchScreen = function() {
                this.touchScreenActivated === !0 ? this.deactivateTouchScreen() : this.activateTouchScreen()
            }, this.activateTouchScreen = function() {
                this.touchScreenActivated = !0, this.canvas.addEventListener("touchstart", n, !1), this.canvas.addEventListener("touchend", s, !1), this.canvas.addEventListener("touchcancel", o, !1), this.canvas.addEventListener("touchleave", s, !1), this.canvas.addEventListener("touchmove", r, !1)
            }, this.deactivateTouchScreen = function() {
                this.touchScreenActivated = !1, this.canvas.removeEventListener("touchstart", n, !1), this.canvas.removeEventListener("touchend", s, !1), this.canvas.removeEventListener("touchcancel", o, !1), this.canvas.removeEventListener("touchleave", s, !1), this.canvas.removeEventListener("touchmove", r, !1)
            }, this.canvas.onmousedown = function(t) {
                t.preventDefault(), c = !0;
                var i = t.target || t.srcElement,
                    n = i.currentStyle || e.getComputedStyle(i, null),
                    s = parseInt(n.borderLeftWidth, 10),
                    o = parseInt(n.borderTopWidth, 10),
                    r = i.getBoundingClientRect(),
                    d = t.clientX - s - r.left,
                    u = t.clientY - o - r.top,
                    C = null;
                h.x = d, h.y = u, C = document.getElementById(a), null !== C && l(C)
            }, this.canvas.onmouseup = function() {
                c = !1
            }, this.canvas.onmouseleave = function() {
                c = !1
            }, u = Date.now(), this.canvas.onmousemove = function(t) {
                var n = null,
                    s = null,
                    a = 0,
                    o = 0,
                    l = null,
                    r = 0,
                    C = 0,
                    p = null;
                Date.now() - u > 30 && (n = t.target || t.srcElement, s = n.currentStyle || e.getComputedStyle(n, null), a = parseInt(s.borderLeftWidth, 10), o = parseInt(s.borderTopWidth, 10), l = n.getBoundingClientRect(), r = t.clientX - a - l.left, C = t.clientY - o - l.top, p = {
                    x: r,
                    y: C,
                    drawing: c,
                    id: d.session.apiCCId
                }, i.roomMgr.sendMessageToRoom(d.session.apiCCWhiteBoardClient.roomId, "whiteBoard", p), u = Date.now()), c && (n = t.target || t.srcElement, s = n.currentStyle || e.getComputedStyle(n, null), a = parseInt(s.borderLeftWidth, 10), o = parseInt(s.borderTopWidth, 10), l = n.getBoundingClientRect(), r = t.clientX - a - l.left, C = t.clientY - o - l.top, d.session.apiCCWhiteBoardClient.drawLine(h.x, h.y, r, C), h.x = r, h.y = C)
            }
        }, this.stop = function() {
            this.canvas.onmousedown = null, this.canvas.onmouseup = null, this.canvas.onmouseleave = null, this.canvas.onmousemove = null
        }
    }, d.ApiCCCoBrowsingClient = function(e) {
        this.createRoom = function() {
            e.roomMgr.createRoom("coBrowsing")
        }, this.inviteInRoom = function(t, i) {
            e.roomMgr.inviteInRoom(t, i, "coBrowsing")
        }, this.answerToRoomInvitation = function(t, i) {
            e.roomMgr.answerToRoomInvitation(t, i, "coBrowsing")
        }, this.leaveRoom = function(t) {
            e.roomMgr.leaveRoom(t, "coBrowsing")
        }
    }, d.ApiCCWebRTCClient = function(i, n, s, a, o, l) {
        this.myWebRTC_Event = new r, this.webRTCClient = new m(i), this.webRTCClient.channelReady = !0, this.webRTCClient.initialize(n, s, a, o, l), this.manageWebRTCPlugin = function(t, i) {
            var n = "";
            n = "https:" != e.location.protocol ? "http" : "https", $LAB.script(function() {
                return n + "://cdn.temasys.com.sg/adapterjs/0.13.x/adapter.debug.js"
            }).wait(function() {
                AdapterJS.WebRTCPlugin.isPluginInstalled(AdapterJS.WebRTCPlugin.pluginInfo.prefix, AdapterJS.WebRTCPlugin.pluginInfo.plugName, function() {
                    d.session.apiCCWebRTCClient.webRTCClient.myWebRTC_Adapter.RTCSessionDescription = RTCSessionDescription, d.session.apiCCWebRTCClient.webRTCClient.myWebRTC_Adapter.RTCIceCandidate = RTCIceCandidate, d.session.apiCCWebRTCClient.webRTCClient.myWebRTC_Adapter.RTCPeerConnection = RTCPeerConnection, d.session.apiCCWebRTCClient.webRTCClient.myWebRTC_Adapter.getUserMedia = navigator.getUserMedia, d.session.apiCCWebRTCClient.webRTCClient.myWebRTC_Adapter.attachMediaStream = attachMediaStream;
                    var e = t();
                    return e
                }, function() {
                    return i(), d.session.apiCCWebRTCClient.myWebRTC_Event.createEvent({
                        eventType: "webRTCPluginInstallation"
                    }), null
                })
            })
        }, this.call = function(e, n) {
            var s = null;
            return (this.webRTCClient.recordedCall === !0 || "RECORD" === n) && ((n === t || "RECORD" === n) && (n = {}), n.MCUType = "MCU-Caller", n.confId = Math.floor(1000001 * Math.random()).toString()), "IE" !== f && "Safari" !== f || i.webRTCPluginActivated !== !0 ? s = this.webRTCClient.callWithNumber(e, !0, n) : (s = this.manageWebRTCPlugin(function() {
                d.session.apiCCWebRTCClient.webRTCClient.callWithNumber(e, !0, n)
            }, function() {}), s = "WebRTCPlugin")
        }, this.activateScreenSharing = function(e) {
            this.webRTCClient.activateScreenSharing(e)
        }, this.shareScreen = function(e) {
            var t = this.webRTCClient.shareScreen(e, !0);
            return t
        }, this.startScreenSharingOnCall = function(e) {
            this.webRTCClient.startScreenSharingOnCall(e)
        }, this.startDataChannel = function(e) {
            var t = this.webRTCClient.callWithNumber(e, !0, "data");
            return t
        }, this.startDataChannelOnCall = function(e) {
            this.webRTCClient.startDataChannelOnCall(e)
        }, this.sendDataWithCallId = function(e, t, i) {
            this.webRTCClient.sendDataWithCallId(e, t, i)
        }, this.callAudio = function(e, t) {
            var i = this.webRTCClient.callWithNumber(e, !1, t);
            return i
        }, this.callbymail = function(e) {
            this.webRTCClient.callbymail(e)
        }, this.addMedia = function(e) {
            this.webRTCClient.addMedia(e)
        }, this.hangUp = function(e) {
            this.webRTCClient.onHangup(e)
        }, this.getMyMedia = function() {
            this.webRTCClient.getUserMedia()
        }, this.autoAnswerUserMediaSuccessHandler = function(e) {
            e = null, this.webRTCClient.autoAnswer = !0
        }, this.autoAnswerUserMediaErrorHandler = function(e) {
            e = null, this.webRTCClient.autoAnswer = !1
        }, this.activateAutoAnswer = function() {
            d.addEventListener("userMediaSuccess", this.callback(this, "autoAnswerUserMediaSuccessHandler")), d.addEventListener("userMediaError", this.callback(this, "autoAnswerUserMediaErrorHandler")), this.webRTCClient.getUserMedia()
        }, this.getAutoAnswer = function() {
            return this.webRTCClient.autoAnswer
        }, this.setUnidirectionalCall = function(e) {
            e === !0 || e === !1 ? this.webRTCClient.unidirectionelCallOnly = e : this.myWebRTC_Event.createErrorEvent("parameter error when calling function : setUnidirectionalCall()", "PARAMETER_ERROR_SETUNIDIRCALL")
        }, this.getUnidirectionalCall = function() {
            return this.webRTCClient.unidirectionelCallOnly
        }, this.toggleVideoMute = function() {
            this.webRTCClient.toggleVideoMute()
        }, this.isVideoMuted = function() {
            return this.webRTCClient.isVideoMuted
        }, this.toggleAudioMute = function() {
            this.webRTCClient.toggleAudioMute()
        }, this.isAudioMuted = function() {
            return this.webRTCClient.isAudioMuted
        }, this.setNtoNConf = function(e) {
            e === !0 || e === !1 ? this.webRTCClient.NtoNConf = e : this.myWebRTC_Event.createErrorEvent("parameter error when calling function : setNtoNConf()", "PARAMETER_ERROR_SETNTONCONF")
        }, this.getNtoNConf = function() {
            return this.webRTCClient.NtoNConf
        }, this.setRTPMedia = function(e) {
            e === !0 || e === !1 ? this.webRTCClient.RTPMedia = e : this.myWebRTC_Event.createErrorEvent("parameter error when calling function : setRTPMedia()", "PARAMETER_ERROR_SETRTPMEDIA")
        }, this.getRTPMedia = function() {
            return this.webRTCClient.RTPMedia
        }, this.setMediaRoutingMode = function(e) {
            "hostOnly" === e ? this.webRTCClient.mediaRoutingMode = this.webRTCClient.mediaRoutingModeEnum.hostOnly : "stun" === e ? this.webRTCClient.mediaRoutingMode = this.webRTCClient.mediaRoutingModeEnum.stun : "stunOnly" === e ? this.webRTCClient.mediaRoutingMode = this.webRTCClient.mediaRoutingModeEnum.stunOnly : "turn" === e ? this.webRTCClient.mediaRoutingMode = this.webRTCClient.mediaRoutingModeEnum.turn : "turnOnly" === e ? this.webRTCClient.mediaRoutingMode = this.webRTCClient.mediaRoutingModeEnum.turnOnly : this.myWebRTC_Event.createErrorEvent("parameter error when calling function : setMediaRoutingMode()", "PARAMETER_ERROR_SETMEDIAROUTINGMODE")
        }, this.enableQos = function(e) {
            this.webRTCClient.qosEnable = e
        }, this.getMediaRoutingMode = function() {
            var e = null;
            return this.webRTCClient.mediaRoutingMode === this.webRTCClient.mediaRoutingModeEnum.hostOnly ? e = "hostOnly" : this.webRTCClient.mediaRoutingMode === this.webRTCClient.mediaRoutingModeEnum.stun ? e = "stun" : this.webRTCClient.mediaRoutingMode === this.webRTCClient.mediaRoutingModeEnum.stunOnly ? e = "stunOnly" : this.webRTCClient.mediaRoutingMode === this.webRTCClient.mediaRoutingModeEnum.turn ? e = "turn" : this.webRTCClient.mediaRoutingMode === this.webRTCClient.mediaRoutingModeEnum.turnOnly && (e = "turnOnly"), e
        }, this.takeSnapshot = function(e, t, n, s, a, o) {
            this.webRTCClient.takeSnapshot(e, t, i.apiKey, n, s, a, o)
        }, this.takeSnapshotAndSendOnDataChannel = function(e, t, i, n) {
            this.webRTCClient.takeSnapshotAndSendOnDataChannel(e, t, i, n)
        }, this.setUserAcceptOnIncomingCall = function(e) {
            e === !0 || e === !1 ? this.webRTCClient.userAcceptOnIncomingCall = e : this.myWebRTC_Event.createErrorEvent("parameter error when calling function : setUserAcceptOnIncomingCall()", "PARAMETER_ERROR_SETUSERACCEPTONINCOCALL")
        }, this.setHideLocalVideoOnCall = function(e) {
            e === !0 || e === !1 ? this.webRTCClient.hideLocalVideoOnCall = e : this.myWebRTC_Event.createErrorEvent("parameter error when calling function : hideLocalVideoOnCall()", "PARAMETER_ERROR_SETHIDELOCALVIDEOONCALL")
        }, this.setAllowMultipleCalls = function(e) {
            e === !0 || e === !1 ? this.webRTCClient.allowMultipleCalls = e : this.myWebRTC_Event.createErrorEvent("parameter error when calling function : setAllowMultipleCalls()", "PARAMETER_ERROR_SETALLOWMULTIPLECALLS")
        }, this.setPcConfig = function(e) {
            this.webRTCClient.pc_config = e
        }, this.setPcConstraints = function(e) {
            this.webRTCClient.pc_constraints = e
        }, this.setGetUserMediaConfig = function(e) {
            this.webRTCClient.setGetUserMediaConfig(e)
        }, this.setTrickleIce = function(e) {
            e === !0 || e === !1 ? this.webRTCClient.trickleIce = e : this.myWebRTC_Event.createErrorEvent("parameter error when calling function : setTrickleIce()", "PARAMETER_ERROR_SETTRICKLEICE")
        }, this.setRecordedCall = function(e) {
            e === !0 || e === !1 ? this.webRTCClient.recordedCall = e : this.myWebRTC_Event.createErrorEvent("parameter error when calling function : setRecordedCall()", "PARAMETER_ERROR_SETRECORDEDCALL")
        }, this.getRecordedCall = function() {
            return this.webRTCClient.recordedCall
        }, this.acceptCall = function(e) {
            this.webRTCClient.acceptCall(e)
        }, this.refuseCall = function(e) {
            this.webRTCClient.refuseCall(e)
        }, this.toggleVideoScreen = function(e) {
            this.webRTCClient.toggleVideoScreen(e)
        }, this.switchVideoToScreen = function(e) {
            this.webRTCClient.switchVideoToScreen(e)
        }, this.switchScreenToVideo = function(e) {
            this.webRTCClient.switchScreenToVideo(e)
        }, this.releaseUserMedia = function() {
            this.webRTCClient.releaseUserMedia()
        }, this.setAllowedAudioCodecs = function(e) {
            this.webRTCClient.allowedAudioCodecs = e
        }, this.setAllowedVideoCodecs = function(e) {
            this.webRTCClient.allowedVideoCodecs = e
        }, this.setAudioBandwidth = function(e) {
            this.webRTCClient.setAudioBandwidth(e)
        }, this.setVideoBandwidth = function(e) {
            this.webRTCClient.setVideoBandwidth(e)
        }, this.setDataBandwidth = function(e) {
            this.webRTCClient.setDataBandwidth(e)
        }, this.createMCUSession = function(e, t) {
            this.webRTCClient.MCUClient.TBLibIsLoaded === !1 ? $LAB.script(function() {
                return "//static.opentok.com/webrtc/v2.2/js/opentok.min.js"
            }).wait(function() {
                d.session.apiCCWebRTCClient.webRTCClient.MCUClient.TBLibIsLoaded = !0, d.session.apiCCWebRTCClient.webRTCClient.MCUClient.initDivElements(e, t), d.session.apiCCWebRTCClient.webRTCClient.MCUClient.createSession()
            }) : (this.webRTCClient.MCUClient.initDivElements(e, t), this.webRTCClient.MCUClient.createSession())
        }, this.joinMCUSession = function(e) {
            this.webRTCClient.MCUClient.joinSession(e)
        }, this.getMCUStreamList = function() {
            return this.webRTCClient.MCUClient.getStreamList()
        }, this.getStreamFromList = function(e) {
            return this.webRTCClient.MCUClient.getStreamFromList(e)
        }, this.getStreamIdOfUser = function(e) {
            return this.webRTCClient.MCUClient.getStreamIdOfUser(e)
        }, this.getCallIdFromStreamId = function(e) {
            var t = this.webRTCClient.findCallWithStreamId(e);

            return null === t ? null : t.callId
        }, this.getCallIdFromRemoteMCUUser = function(e) {
            var t = null,
                i = null;
            return t = this.webRTCClient.MCUClient.getStreamIdOfUser(e), i = this.webRTCClient.findCallWithStreamId(t), null === i ? null : i.callId
        }, this.publish = function(e, t, i, n) {
            return this.webRTCClient.MCUClient.publish(e, t, i, n)
        }, this.unpublish = function(e) {
            this.webRTCClient.MCUClient.unpublish(e)
        }, this.publishScreen = function(e, t, i) {
            this.webRTCClient.MCUClient.publishScreen(e, t, i)
        }, this.subscribe = function(e, t) {
            this.webRTCClient.MCUClient.subscribeToStreams(e, t)
        }, this.unsubscribe = function(e) {
            this.webRTCClient.MCUClient.unsubscribe(e)
        }, this.takeSnapshotOnMCUSession = function(e) {
            var t = this.webRTCClient.MCUClient.takeSnapshot(e);
            return t
        }, this.sendMCUSessionInvitation = function(e, t, i) {
            this.webRTCClient.MCUClient.sendSessionInvitation(e, t, i)
        }, this.sendMCUSessionInvitationToGroupChat = function(e, t) {
            this.webRTCClient.MCUClient.sendSessionInvitationToGroupChat(e, t)
        }, this.acceptMCUSessionInvitation = function(e, t, i, n) {
            this.webRTCClient.MCUClient.TBLibIsLoaded === !1 ? $LAB.script(function() {
                return "//static.opentok.com/webrtc/v2.2/js/opentok.min.js"
            }).wait(function() {
                d.session.apiCCWebRTCClient.webRTCClient.MCUClient.TBLibIsLoaded = !0, d.session.apiCCWebRTCClient.webRTCClient.MCUClient.initDivElements(i, n), d.session.apiCCWebRTCClient.webRTCClient.MCUClient.acceptSessionInvitation(e, t)
            }) : (this.webRTCClient.MCUClient.initDivElements(i, n), this.webRTCClient.MCUClient.acceptSessionInvitation(e, t))
        }, this.leaveMCUSession = function() {
            this.webRTCClient.MCUClient.leaveSession()
        }, this.recordType = null, this.duration = 6e4, this.listenerOnRecordEventAdded = !1, this.sessionIdForRecord = null, this.recordStreamUserMediaSuccessHandler = function(e) {
            e = null, this.webRTCClient.recordMgr.record("local", this.recordType, this.duration, this.sessionIdForRecord)
        }, this.recordStreamUserMediaErrorHandler = function(e) {
            e = null
        }, this.recordStream = function(e, t, i) {
            this.recordType = e, this.sessionIdForRecord = i, t > 6e4 && (t = 6e4), this.duration = t, null !== this.webRTCClient.recordMgr && this.webRTCClient.recordMgr.recordOngoing === !1 && (this.listenerOnRecordEventAdded === !1 && (d.addEventListener("userMediaSuccess", this.callback(this, "recordStreamUserMediaSuccessHandler")), d.addEventListener("userMediaError", this.callback(this, "recordStreamUserMediaErrorHandler")), this.listenerOnRecordEventAdded = !0), this.webRTCClient.getUserMedia())
        }, this.stopRecordStream = function() {
            null !== this.webRTCClient.recordMgr && (this.webRTCClient.recordMgr.recordOngoing === !1 || this.webRTCClient.recordMgr.stop())
        }, this.setUploadServerAddressForRecord = function(e) {
            this.webRTCClient.recordMgr.setUploadServerAddress(e)
        }, this.getMediaDevices = function(e) {
            this.webRTCClient.getMediaDevices(e)
        }, this.setAudioSourceId = function(e) {
            this.webRTCClient.audioSourceId = e
        }, this.setAudioOutputId = function(e) {
            this.webRTCClient.audioOutputId = e
        }, this.setVideoSourceId = function(e) {
            this.webRTCClient.videoSourceId = e
        }, this.attachMediaStream = function(e, t) {
            this.webRTCClient.myWebRTC_Adapter.attachMediaStream(e, t)
        }, this.addStreamInDiv = function(e, i, n, s, a, o) {
            var l = null,
                r = null;
            l = document.createElement("audio" === i ? "audio" : "video"), l.id = s, l.autoplay = !0, l.muted = o, l.style.width = a.width, l.style.height = a.height, "undefined" != typeof this.webRTCClient.audioOutputId && null != this.webRTCClient.audioOutputId && l.setSinkId(this.webRTCClient.audioOutputId).then(function() {}), r = document.getElementById(n), r.appendChild(l), e !== t && this.attachMediaStream(l, e)
        }, this.removeElementFromDiv = function(e, t) {
            var i = null,
                n = null;
            i = document.getElementById(t), null !== i && (n = document.getElementById(e), n.removeChild(i))
        }, this.callback = function(e, t) {
            return this.closureHandler = function(i) {
                return e[t](i)
            }, this.closureHandler
        }
    }, d.ApiCCSession = function(e) {
        function s(e) {
            return e instanceof Array ? !0 : !1
        }
        if (this.apiCCId = null, this.apiKey = null, this.nickname = null, this.photoURL = null, this.apiCCWebRTCClient = null, this.apiCCIMClient = null, this.apiCCDataClient = null, this.apiCCIDCookie = null, this.channel = null, this.recordActivated = e.recordActivated, this.sessionId = null, this.apiCCWhiteBoardClient = null, this.apiCCCoBrowsingClient = null, this.ccsServer = e.ccsServer, this.userData = e.userData, this.apiDBActivated = e.ApiDBActivated, this.webRTCPluginActivated = e.webRTCPluginActivated, this.token = e.token, this.tryAudioCallAfterUserMediaError = e.tryAudioCallAfterUserMediaError, this.deactivateReloadOnCancel = e.deactivateReloadOnCancel, this.updateUserDataToBeDone = !1, this.connectedUsersList = [], this.messageTimeOutTable = [], this.messageTimeOutTimer = e.messageTimeOutTimer !== t ? e.messageTimeOutTimer : 1e4, this.presenceGroup = e.presenceGroup !== t ? e.presenceGroup : ["default"], this.subscribeToPresenceGroup = e.subscribeToPresenceGroup !== t ? e.subscribeToPresenceGroup : ["default"], this.isDeviceWebRTCCompliant = function() {
                var e = S.getOS().name,
                    t = S.getBrowser(),
                    i = S.getDevice().type,
                    s = parseInt(t.version, 10);
                if ("iOS" === e) return !1;
                if ("Edge" === t.name) return !1;
                if ("Chrome" === t.name && s >= 47 && !n()) return !1;
                if ("mobile" === i || "tablet" === i || "Android" === e) switch (t.name) {
                    case "Chrome":
                        return s >= 36;
                    case "Firefox":
                        return s >= 40;
                    case "Android Browser":
                        return s >= 44;
                    case "Opera Mobile":
                        return s >= 30;
                    default:
                        return !1
                } else if (("IE" === t.name || "Safari" === t.name) && this.webRTCPluginActivated !== !0) return !1;
                return !0
            }, this.isDeviceDTLSCompliant = function() {
                var e = S.getBrowser(),
                    t = parseInt(e.version, 10);
                return "Chrome" === e.name && 44 > t ? !1 : !0
            }, "undefined" == typeof this.userData || null === this.userData ? (this.userData = {}, this.userData.webRtcCompliant = this.isDeviceWebRTCCompliant(), this.userData.dtlsCompliant = this.isDeviceDTLSCompliant()) : ("undefined" == typeof this.userData.webRtcCompliant || null === this.userData.webRtcCompliant) && (this.userData.webRtcCompliant = this.isDeviceWebRTCCompliant(), this.userData.dtlsCompliant = this.isDeviceDTLSCompliant()), this.roomManagerEventHandler = function(e) {
                "whiteBoard" === e.roomType ? ("roomCreation" === e.type && (this.apiCCWhiteBoardClient.roomId = e.roomId, c.createRoomCreationEvent(e.status, e.roomId, e.roomType)), "roomInvitation" === e.type && (this.apiCCWhiteBoardClient.roomId = e.roomId, c.createRoomInvitationEvent(e.roomId, e.senderId, e.senderNickname, e.senderPhotoURL, e.contactList, e.roomType)), "roomMessage" === e.type && (this.apiCCWhiteBoardClient.messageProcessing(e.data), c.createReceiveRoomMessageEvent(e.roomId, e.senderId, e.nickname, e.data, e.roomType)), "roomMemberUpdate" === e.type && c.createRoomMemberUpdateEvent(e.roomId, e.contactList, e.status, e.roomType)) : "coBrowsing" === e.roomType && ("roomCreation" === e.type && c.createRoomCreationEvent(e.status, e.roomId, e.roomType), "roomInvitation" === e.type && c.createRoomInvitationEvent(e.roomId, e.senderId, e.senderNickname, e.senderPhotoURL, e.contactList, e.roomType), "roomMessage" === e.type && c.createReceiveRoomMessageEvent(e.roomId, e.senderId, e.nickname, e.data, e.roomType), "roomMemberUpdate" === e.type && c.createRoomMemberUpdateEvent(e.roomId, e.contactList, e.status, e.roomType))
            }, this.callback = function(e, t) {
                return this.closureHandler = function(i) {
                    return e[t](i)
                }, this.closureHandler
            }, this.roomMgr = new R(this, this.callback(this, "roomManagerEventHandler")), this.xhrPolling = e.xhrPolling === !0 ? !0 : !1, this.getCookie = function(e) {
                var t = new RegExp("(?:; )?" + e + "=([^;]*);?");
                return t.test(document.cookie) ? decodeURIComponent(RegExp.$1) : null
            }, this.generateApiCCID = function() {
//                this.apiCCIDCookie = this.getCookie("apiCCId"), this.apiCCId = null !== this.apiCCIDCookie ? this.apiCCIDCookie : Math.floor(1000001 * Math.random()).toString()
                this.apiCCIDCookie = this.getCookie("apiCCId"), this.apiCCId = null !== this.apiCCIDCookie ? this.apiCCIDCookie : getCookie('login')
            }, this.getNumericIdFromAlpha = function(e) {
                var t = 0,
                    i = 0,
                    n = null;
                if (0 == e.length) return t;
                for (i = 0; i < e.length; i++) n = e.charCodeAt(i), t = (t << 5) - t + n, t &= t;
                return t >>> 0
            }, e === t) return alert("Error : Initialisation parameters for session creation are not defined"), null;
        if (e.appId !== t && (this.appId = e.appId), e.siteId !== t && (this.siteId = e.siteId), e.apiKey === t) return alert('Error : Initialisation parameters: "apikey" for session creation is not defined'), null;
        if (this.apiKey = e.apiKey, e.onReady === t) return alert('Error : Initialisation parameters: "onReady" for session creation is not defined'), null;
        if (d.addEventListener("sessionReady", e.onReady), this.sessionId = this.getCookie("sessionId"), e.apiCCId === t) this.generateApiCCID();
        else if (e.idConversionActivated === t || e.idConversionActivated === !0)
            if (i(e.apiCCId)) this.apiCCId = e.apiCCId.toString();
            else {
                var r = this.getNumericIdFromAlpha(e.apiCCId);
                r += "", i(r) ? this.apiCCId = r.toString() : this.generateApiCCID()
            } else this.apiCCId = e.apiCCId.toString();
        null !== this.channel && delete this.channel, this.channel = new h(this), this.channel.initialize(), this.nickname = null !== e.nickname && e.nickname !== t ? e.nickname : this.apiCCId, this.photoURL = null !== e.photoURL && e.photoURL !== t ? e.photoURL : null, this.reOpenChannel = function(e, i) {
            this.apiCCId = e.toString(), this.apiKey = i, this.channel.socket !== t && null !== this.channel.socket && this.channel.socket.disconnect(), this.channel.channelReady = !1, this.channel.socket = null, this.channel.channelId = this.apiCCId, this.channel.initialize(), null !== this.apiCCWebRTCClient && null !== this.apiCCWebRTCClient.webRTCClient && (this.apiCCWebRTCClient.webRTCClient.socket = this.channel.socket)
        }, this.onChannelOpened = function() {
            e.ApiDBActivated !== !1 && e.ApiDBActivated !== t && null !== e.ApiDBActivated && apiDB.init(this.channel.socket), c.createSessionReadyEvent(d.session.apiCCId)
        }, this.createWebRTCClient = function(e) {
            return e !== t && null !== e ? (this.apiCCWebRTCClient = new d.ApiCCWebRTCClient(this, e.localVideo, e.minilocalVideo, e.remoteVideo, e.status, e.command), this.apiCCWebRTCClient.webRTCClient.getMediaDevices(this.apiCCWebRTCClient.webRTCClient.gotSources), this.apiCCWebRTCClient) : null
        }, this.createWhiteBoard = function(e, t, i, n) {
            return this.apiCCWhiteBoardClient = new d.ApiCCWhiteBoardClient(this, e, t, i, n), this.apiCCWhiteBoardClient
        }, this.closeWhiteBoardClient = function(e) {
            c.createClosingWhiteBoardEvent(this.apiCCWhiteBoardClient.roomId, e), this.apiCCWhiteBoardClient.leaveRoom(this.apiCCWhiteBoardClient.roomId), this.apiCCWhiteBoardClient.stop()
        }, this.createCoBrowsing = function() {
            return this.apiCCCoBrowsingClient = new d.ApiCCCoBrowsingClient(this), this.apiCCCoBrowsingClient
        }, this.createIMClient = function(e) {
            return this.apiCCIMClient = new d.ApiCCIMClient(this, e), this.apiCCIMClient
        }, this.createDataClient = function() {
            return this.apiCCDataClient = new d.ApiCCDataClient(this), this.apiCCDataClient
        }, this.updatingQuery = function(e) {
            var i = null,
                n = null,
                s = null,
                a = null;
            return i = o(e), this.userData !== t ? (n = JSON.stringify(this.userData), s = encodeURIComponent(n), i.userData = s, a = l(i)) : void 0
        }, this.setUserData = function(e) {
            var i = null,
                n = null,
                s = 0,
                o = [];
            for (i = {
                    type: "setUserData",
                    userData: e
                }, n = JSON.stringify(i), this.channel.socket.emit("setUserData", n), this.userData = this.userData !== t ? a(this.userData, e) : e, this.channel.socketio_1X === !0 ? this.channel.socket.io.opts.query = this.updatingQuery(this.channel.socket.io.opts.query) : this.channel.socket.socket.options.query = this.updatingQuery(this.channel.socket.socket.options.query), s = 0; s < this.connectedUsersList.length; s += 1) this.apiCCId === this.connectedUsersList[s].userId && (this.connectedUsersList[s].userData = a(this.connectedUsersList[s].userData, e)), o[0] = this.apiCCId, c.createConnectedUsersListUpdateEvent(this.connectedUsersList[s].group, o)
        }, this.sendPresenceGroupManagementCommand = function(e, t) {
            var i = null,
                n = null;
            i = {
                type: "presenceGroupManagement",
                command: e,
                group: t
            }, n = JSON.stringify(i), this.channel.socket.emit("presenceGroupManagement", n)
        }, this.joinPresenceGroup = function(e) {
            s(e) === !0 && this.sendPresenceGroupManagementCommand("join", e)
        }, this.leavePresenceGroup = function(e) {
            s(e) === !0 && this.sendPresenceGroupManagementCommand("leave", e)
        }, this.subscribePresenceGroup = function(e) {
            s(e) === !0 && this.sendPresenceGroupManagementCommand("subscribe", e)
        }, this.unsubscribePresenceGroup = function(e) {
            s(e) === !0 && this.sendPresenceGroupManagementCommand("unsubscribe", e)
        }, this.getConversationList = function(e) {
            var i = null,
                n = null;
            i = e !== t ? {
                type: "getConversationList",
                lastConversationNb: e
            } : {
                type: "getConversationList",
                lastConversationNb: 50
            }, n = JSON.stringify(i), this.channel.socket.emit("getConversationList", n)
        }, this.receiveConversationListAnswer = function(e) {
            var t = 0,
                i = e.convList.length,
                n = [],
                s = null;
            for (t = 0; i > t; t += 1) s = JSON.parse(e.convList[t]), n.push(s);
            c.createReceiveConversationListAnswerEvent(n)
        }, this.getContactOccurrencesFromConversationList = function(e) {
            var i = null,
                n = null;
            i = e !== t ? {
                type: "getContactOccurrencesFromConversationList",
                lastConversationNb: e
            } : {
                type: "getContactOccurrencesFromConversationList",
                lastConversationNb: 50
            }, n = JSON.stringify(i), this.channel.socket.emit("getContactOccurrencesFromConversationList", n)
        }, this.receiveContactOccurrencesFromConversationListAnswer = function(e) {
            c.createReceiveContactOccurrencesFromConversationListAnswerEvent(e.contactOccurrencesTable)
        }, this.getConversationDetailReport = function(e) {
            var t = null,
                i = null;
            t = {
                type: "getConversationDetailReport",
                convId: e
            }, i = JSON.stringify(t), this.channel.socket.emit("getConversationDetailReport", i)
        }, this.receiveConversationDetailReportAnswer = function(e) {
            c.createReceiveConversationDetailReportAnswerEvent(e.CDR)
        }, this.manageConnectedUsersList = function(e, t, i, n) {
            var s = 0,
                a = 0,
                o = 0,
                l = !1,
                r = 0;
            for (o = 0; o < e.length; o += 1) e[o].group = i;
            if ("online" === t) {
                for (s = 0; s < e.length; s += 1) {
                    if (0 === this.connectedUsersList.length) {
                        this.connectedUsersList = e, c.createConnectedUsersListUpdateEvent(i, n);
                        break
                    }
                    for (a = 0; a < this.connectedUsersList.length; a += 1)
                        if (e[s].userId === this.connectedUsersList[a].userId && e[s].group === this.connectedUsersList[a].group) {
                            l = !0, JSON.stringify(this.connectedUsersList[a].userData) !== JSON.stringify(e[s].userData) && (this.connectedUsersList[a].userData = e[s].userData, c.createConnectedUsersListUpdateEvent(i, n));
                            break
                        }
                    l === !1 && (this.connectedUsersList.push(e[s]), c.createConnectedUsersListUpdateEvent(i, n))
                }
                this.updateUserDataToBeDone === !0 && ("undefined" != typeof this.userData && null !== this.userData && d.session.setUserData(d.session.userData), this.updateUserDataToBeDone = !1)
            } else
                for (s = 0; s < e.length; s += 1)
                    for (r = this.connectedUsersList.length, a = 0; r > a; a += 1)
                        if (e[s].userId === this.connectedUsersList[a].userId) {
                            this.connectedUsersList.splice(a, 1), c.createConnectedUsersListUpdateEvent(i, n);
                            break
                        }
        }, this.getConnectedUsersList = function(e) {
            var i = 0,
                n = [];
            if (e === t || null === e) return this.connectedUsersList;
            for (i = 0; i < this.connectedUsersList.length; i += 1) this.connectedUsersList[i].group === e && n.push(this.connectedUsersList[i]);
            return n
        }, this.isClientWebRtcCompliant = function(e) {
            var t, i = null,
                n = null,
                s = 0;
            if ("undefined" != typeof e)
                for (t = this.getConnectedUsersList(), s = 0; s < t.length; s++) t[s].userId === e && (n = t[s].userData, "undefined" != typeof n && null !== n && "undefined" != typeof n.webRtcCompliant && (i = n.webRtcCompliant));
            return i
        }, this.isClientDTLSCompliant = function(e) {
            var t, i = !0,
                n = null,
                s = 0;
            if ("undefined" != typeof e)
                for (t = this.getConnectedUsersList(), s = 0; s < t.length; s++) t[s].userId === e && (n = t[s].userData, "undefined" != typeof n && null !== n && "undefined" != typeof n.dtlsCompliant && (i = n.dtlsCompliant));
            return i
        }, this.getConnectedUserIdsList = function() {
            var e = 0,
                t = 0,
                i = [],
                n = !1,
                s = {};
            for (e = 0; e < this.connectedUsersList.length; e += 1) {
                for (n = !1, t = 0; t < i.length; t++)
                    if (i[t].userId === this.connectedUsersList[e].userId) {
                        n = !0;
                        break
                    }
                n === !1 && (s = {}, s.userId = this.connectedUsersList[e].userId, s.callState = this.connectedUsersList[e].callState, s.userData = this.connectedUsersList[e].userData, i.push(s))
            }
            return i
        }, this.getGroupsFromConnectedUsersList = function(e) {
            var t = 0,
                i = [],
                n = !1;
            for (t = 0; t < this.connectedUsersList.length; t += 1) this.connectedUsersList[t].userId === e && (n = !0, i.push(this.connectedUsersList[t].group));
            return n === !0 ? JSON.stringify(i) : "User_Not_Found"
        }, this.getConnectedUserInfo = function(e, t) {
            var i = 0,
                n = null;
            switch (t) {
                case "all":
                    for (i = 0; i < this.connectedUsersList.length; i += 1)
                        if (this.connectedUsersList[i].userId === e) return n = this.getGroupsFromConnectedUsersList(e), this.connectedUsersList[i].groups = n, delete this.connectedUsersList[i].group, JSON.stringify(this.connectedUsersList[i]);
                    break;
                case "callState":
                    for (i = 0; i < this.connectedUsersList.length; i += 1)
                        if (this.connectedUsersList[i].userId === e) return this.connectedUsersList[i].callState;
                    break;
                case "userData":
                    for (i = 0; i < this.connectedUsersList.length; i += 1)
                        if (this.connectedUsersList[i].userId === e) return JSON.stringify(this.connectedUsersList[i].userData);
                    break;
                case "groups":
                    return n = this.getGroupsFromConnectedUsersList(e)
            }
            return "User_Not_Found"
        }, this.isConnectedUser = function(e) {
            var t = 0,
                i = !1;
            for (t = 0; t < this.connectedUsersList.length; t += 1)
                if (this.connectedUsersList[t].userId === e) return i = !0;
            return i
        }, this.displayConnectedUsersList = function() {
            var e = 0;
            for (e = 0; e < this.connectedUsersList.length; e += 1);
        }, this.updatePresence = function(e) {
            this.manageConnectedUsersList(e.connectedUsersListWithStatus, e.state, e.group, e.connectedUsersList), this.displayConnectedUsersList(), c.createUpdatePresenceEvent(e.connectedUsersList, e.state, e.connectedUsersListWithStatus)
        }, this.updateUserStatus = function(e) {
            c.createUpdateUserStatusEvent(e)
        }, this.sendDebugCommand = function(e, t, i) {
            var n = new u(this.channel.socket);
            n.sendDebugCommand("getClientSocketsInfo", t, i)
        }, this.processSignalingMessage = function(e) {
            var i = null;
            "invite" === e.type ? this.apiCCWebRTCClient && ("IE" !== f && "Safari" !== f || this.webRTCPluginActivated !== !0 ? this.apiCCWebRTCClient.webRTCClient.processInvite(e) : this.apiCCWebRTCClient.manageWebRTCPlugin(function() {
                d.session.apiCCWebRTCClient.webRTCClient.processInvite(e)
            }, function() {
                var t = new u(d.session.channel.socket);
                t.sendBye(e.callId, e.calleeId, e.roomId, e.callerId, "WebRTC_Plugin_Installation_needed", e.data)
            })) : "200OK" === e.type ? this.apiCCWebRTCClient && this.apiCCWebRTCClient.webRTCClient.process200OK(e) : "candidate" === e.type ? this.apiCCWebRTCClient && this.apiCCWebRTCClient.webRTCClient.processCandidate(e) : "bye" === e.type ? this.apiCCWebRTCClient && this.apiCCWebRTCClient.webRTCClient.onRemoteHangup(e.callId, e.clientId, e.roomId, e.reason, e.confId, e.data) : "update" === e.type ? this.apiCCWebRTCClient && this.apiCCWebRTCClient.webRTCClient.processUpdate(e) : "200update" === e.type ? this.apiCCWebRTCClient && this.apiCCWebRTCClient.webRTCClient.process200Update(e) : "newConversationCreated" === e.type ? this.apiCCIMClient && this.apiCCIMClient.newConversationCreated(e) : "IMMessage" === e.type ? this.apiCCIMClient && this.apiCCIMClient.receiveMessage(e) : "groupChatCreation" === e.type ? this.apiCCIMClient && this.apiCCIMClient.groupChatCreation(e) : "groupChatInvitation" === e.type ? this.apiCCIMClient && this.apiCCIMClient.groupChatInvitation(e) : "groupChatMemberUpdate" === e.type ? this.apiCCIMClient && this.apiCCIMClient.groupChatMemberUpdate(e) : "addUserInGroupChatAnswer" === e.type ? this.apiCCIMClient && this.apiCCIMClient.addUserInGroupChatAnswer(e) : "groupChatMessage" === e.type ? this.apiCCIMClient && this.apiCCIMClient.receiveGroupChatMessage(e) : "conversationHistoryAnswer" === e.type ? this.apiCCIMClient && this.apiCCIMClient.receiveConversationHistory(e) : "getUserDataAnswer" === e.type ? this.apiCCIMClient && this.apiCCIMClient.receiveUserDataAnswer(e) : "dataMessage" === e.type ? this.apiCCDataClient && this.apiCCDataClient.receiveData(e) : "apiRTCDataMessage" === e.type ? e.data !== t && "callOrder" === e.data.type && this.apiCCWebRTCClient && (i = this.apiCCWebRTCClient.webRTCClient.callWithNumber(e.data.caller, !0, {
                MCUType: "MCU-Callee",
                confId: e.data.confId
            }), this.apiCCWebRTCClient.webRTCClient.myWebRTC_Event.createIncomingCallEvent(this.clientId, e.data.caller, e.data.caller, i, !1, 1, !1, "video", !0, "web")) : "conversationListAnswer" === e.type ? this.receiveConversationListAnswer(e) : "contactOccurrencesFromConversationListAnswer" === e.type ? this.receiveContactOccurrencesFromConversationListAnswer(e) : "conversationDetailReport" === e.type ? this.receiveConversationDetailReportAnswer(e) : "updatePresence" === e.type ? this.updatePresence(e) : "updateUserStatus" === e.type ? this.updateUserStatus(e) : "receiveMCUSessionId" === e.type ? this.apiCCWebRTCClient && this.apiCCWebRTCClient.webRTCClient.MCUClient.receiveSessionId(e) : "joinSessionAnswer" === e.type ? this.apiCCWebRTCClient && this.apiCCWebRTCClient.webRTCClient.MCUClient.joinSessionAnswer(e) : "availableStreams" === e.type ? this.apiCCWebRTCClient && this.apiCCWebRTCClient && this.apiCCWebRTCClient.webRTCClient.MCUClient.newAvailableStream(e.msg) : "onRemoveStream" === e.type ? this.apiCCWebRTCClient && this.apiCCWebRTCClient && this.apiCCWebRTCClient.webRTCClient.MCUClient.removeMCUStream(e.callId, e.msg.id) : "MCUSessionInvitation" === e.type ? this.apiCCWebRTCClient && this.apiCCWebRTCClient.webRTCClient.MCUClient.receiveSessionInvitation(e) : "MCUSessionInvitationToGroupChat" === e.type ? this.apiCCWebRTCClient && this.apiCCWebRTCClient.webRTCClient.MCUClient.receiveSessionInvitation(e) : "sessionId" === e.type ? this.sessionId = e.sessionId : "roomCreation" === e.type ? this.roomMgr.roomCreation(e) : "inviteInRoomStatus" === e.type ? this.roomMgr.inviteInRoomStatus(e) : "roomInvitation" === e.type ? this.roomMgr.roomInvitation(e) : "roomMessage" === e.type ? this.roomMgr.receiveRoomMessage(e) : "roomMemberUpdate" === e.type ? this.roomMgr.roomMemberUpdate(e) : "Ack" === e.type
        }
    }, e.apiRTC = e.apiCC = e.CC = d, d
}(window);