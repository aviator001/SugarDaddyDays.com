!function(e) {
    if ("object" == typeof exports && "undefined" != typeof module)
        module.exports = e();
    else if ("function" == typeof define && define.amd)
        define([], e);
    else {
        var t;
        t = "undefined" != typeof window ? window : "undefined" != typeof global ? global : "undefined" != typeof self ? self : this,
        t.adapter = e()
    }
}(function() {
    return function e(t, n, r) {
        function i(o, s) {
            if (!n[o]) {
                if (!t[o]) {
                    var c = "function" == typeof require && require;
                    if (!s && c)
                        return c(o, !0);
                    if (a)
                        return a(o, !0);
                    var d = new Error("Cannot find module '" + o + "'");
                    throw d.code = "MODULE_NOT_FOUND",
                    d
                }
                var p = n[o] = {
                    exports: {}
                };
                t[o][0].call(p.exports, function(e) {
                    var n = t[o][1][e];
                    return i(n ? n : e)
                }, p, p.exports, e, t, n, r)
            }
            return n[o].exports
        }
        for (var a = "function" == typeof require && require, o = 0; o < r.length; o++)
            i(r[o]);
        return i
    }({
        1: [function(e, t, n) {
            "use strict";
            var r = {};
            r.generateIdentifier = function() {
                return Math.random().toString(36).substr(2, 10)
            }
            ,
            r.localCName = r.generateIdentifier(),
            r.splitLines = function(e) {
                return e.trim().split("\n").map(function(e) {
                    return e.trim()
                })
            }
            ,
            r.splitSections = function(e) {
                var t = e.split("\nm=");
                return t.map(function(e, t) {
                    return (t > 0 ? "m=" + e : e).trim() + "\r\n"
                })
            }
            ,
            r.matchPrefix = function(e, t) {
                return r.splitLines(e).filter(function(e) {
                    return 0 === e.indexOf(t)
                })
            }
            ,
            r.parseCandidate = function(e) {
                var t;
                t = 0 === e.indexOf("a=candidate:") ? e.substring(12).split(" ") : e.substring(10).split(" ");
                for (var n = {
                    foundation: t[0],
                    component: t[1],
                    protocol: t[2].toLowerCase(),
                    priority: parseInt(t[3], 10),
                    ip: t[4],
                    port: parseInt(t[5], 10),
                    type: t[7]
                }, r = 8; r < t.length; r += 2)
                    switch (t[r]) {
                    case "raddr":
                        n.relatedAddress = t[r + 1];
                        break;
                    case "rport":
                        n.relatedPort = parseInt(t[r + 1], 10);
                        break;
                    case "tcptype":
                        n.tcpType = t[r + 1]
                    }
                return n
            }
            ,
            r.writeCandidate = function(e) {
                var t = [];
                t.push(e.foundation),
                t.push(e.component),
                t.push(e.protocol.toUpperCase()),
                t.push(e.priority),
                t.push(e.ip),
                t.push(e.port);
                var n = e.type;
                return t.push("typ"),
                t.push(n),
                "host" !== n && e.relatedAddress && e.relatedPort && (t.push("raddr"),
                t.push(e.relatedAddress),
                t.push("rport"),
                t.push(e.relatedPort)),
                e.tcpType && "tcp" === e.protocol.toLowerCase() && (t.push("tcptype"),
                t.push(e.tcpType)),
                "candidate:" + t.join(" ")
            }
            ,
            r.parseRtpMap = function(e) {
                var t = e.substr(9).split(" ")
                  , n = {
                    payloadType: parseInt(t.shift(), 10)
                };
                return t = t[0].split("/"),
                n.name = t[0],
                n.clockRate = parseInt(t[1], 10),
                n.numChannels = 3 === t.length ? parseInt(t[2], 10) : 1,
                n
            }
            ,
            r.writeRtpMap = function(e) {
                var t = e.payloadType;
                return void 0 !== e.preferredPayloadType && (t = e.preferredPayloadType),
                "a=rtpmap:" + t + " " + e.name + "/" + e.clockRate + (1 !== e.numChannels ? "/" + e.numChannels : "") + "\r\n"
            }
            ,
            r.parseExtmap = function(e) {
                var t = e.substr(9).split(" ");
                return {
                    id: parseInt(t[0], 10),
                    uri: t[1]
                }
            }
            ,
            r.writeExtmap = function(e) {
                return "a=extmap:" + (e.id || e.preferredId) + " " + e.uri + "\r\n"
            }
            ,
            r.parseFmtp = function(e) {
                for (var t, n = {}, r = e.substr(e.indexOf(" ") + 1).split(";"), i = 0; i < r.length; i++)
                    t = r[i].trim().split("="),
                    n[t[0].trim()] = t[1];
                return n
            }
            ,
            r.writeFmtp = function(e) {
                var t = ""
                  , n = e.payloadType;
                if (void 0 !== e.preferredPayloadType && (n = e.preferredPayloadType),
                e.parameters && Object.keys(e.parameters).length) {
                    var r = [];
                    Object.keys(e.parameters).forEach(function(t) {
                        r.push(t + "=" + e.parameters[t])
                    }),
                    t += "a=fmtp:" + n + " " + r.join(";") + "\r\n"
                }
                return t
            }
            ,
            r.parseRtcpFb = function(e) {
                var t = e.substr(e.indexOf(" ") + 1).split(" ");
                return {
                    type: t.shift(),
                    parameter: t.join(" ")
                }
            }
            ,
            r.writeRtcpFb = function(e) {
                var t = ""
                  , n = e.payloadType;
                return void 0 !== e.preferredPayloadType && (n = e.preferredPayloadType),
                e.rtcpFeedback && e.rtcpFeedback.length && e.rtcpFeedback.forEach(function(e) {
                    t += "a=rtcp-fb:" + n + " " + e.type + (e.parameter && e.parameter.length ? " " + e.parameter : "") + "\r\n"
                }),
                t
            }
            ,
            r.parseSsrcMedia = function(e) {
                var t = e.indexOf(" ")
                  , n = {
                    ssrc: parseInt(e.substr(7, t - 7), 10)
                }
                  , r = e.indexOf(":", t);
                return r > -1 ? (n.attribute = e.substr(t + 1, r - t - 1),
                n.value = e.substr(r + 1)) : n.attribute = e.substr(t + 1),
                n
            }
            ,
            r.getDtlsParameters = function(e, t) {
                var n = r.splitLines(e);
                n = n.concat(r.splitLines(t));
                var i = n.filter(function(e) {
                    return 0 === e.indexOf("a=fingerprint:")
                })[0].substr(14)
                  , a = {
                    role: "auto",
                    fingerprints: [{
                        algorithm: i.split(" ")[0],
                        value: i.split(" ")[1]
                    }]
                };
                return a
            }
            ,
            r.writeDtlsParameters = function(e, t) {
                var n = "a=setup:" + t + "\r\n";
                return e.fingerprints.forEach(function(e) {
                    n += "a=fingerprint:" + e.algorithm + " " + e.value + "\r\n"
                }),
                n
            }
            ,
            r.getIceParameters = function(e, t) {
                var n = r.splitLines(e);
                n = n.concat(r.splitLines(t));
                var i = {
                    usernameFragment: n.filter(function(e) {
                        return 0 === e.indexOf("a=ice-ufrag:")
                    })[0].substr(12),
                    password: n.filter(function(e) {
                        return 0 === e.indexOf("a=ice-pwd:")
                    })[0].substr(10)
                };
                return i
            }
            ,
            r.writeIceParameters = function(e) {
                return "a=ice-ufrag:" + e.usernameFragment + "\r\na=ice-pwd:" + e.password + "\r\n"
            }
            ,
            r.parseRtpParameters = function(e) {
                for (var t = {
                    codecs: [],
                    headerExtensions: [],
                    fecMechanisms: [],
                    rtcp: []
                }, n = r.splitLines(e), i = n[0].split(" "), a = 3; a < i.length; a++) {
                    var o = i[a]
                      , s = r.matchPrefix(e, "a=rtpmap:" + o + " ")[0];
                    if (s) {
                        var c = r.parseRtpMap(s)
                          , d = r.matchPrefix(e, "a=fmtp:" + o + " ");
                        switch (c.parameters = d.length ? r.parseFmtp(d[0]) : {},
                        c.rtcpFeedback = r.matchPrefix(e, "a=rtcp-fb:" + o + " ").map(r.parseRtcpFb),
                        t.codecs.push(c),
                        c.name.toUpperCase()) {
                        case "RED":
                        case "ULPFEC":
                            t.fecMechanisms.push(c.name.toUpperCase())
                        }
                    }
                }
                return r.matchPrefix(e, "a=extmap:").forEach(function(e) {
                    t.headerExtensions.push(r.parseExtmap(e))
                }),
                t
            }
            ,
            r.writeRtpDescription = function(e, t) {
                var n = "";
                return n += "m=" + e + " ",
                n += t.codecs.length > 0 ? "9" : "0",
                n += " UDP/TLS/RTP/SAVPF ",
                n += t.codecs.map(function(e) {
                    return void 0 !== e.preferredPayloadType ? e.preferredPayloadType : e.payloadType
                }).join(" ") + "\r\n",
                n += "c=IN IP4 0.0.0.0\r\n",
                n += "a=rtcp:9 IN IP4 0.0.0.0\r\n",
                t.codecs.forEach(function(e) {
                    n += r.writeRtpMap(e),
                    n += r.writeFmtp(e),
                    n += r.writeRtcpFb(e)
                }),
                n += "a=rtcp-mux\r\n"
            }
            ,
            r.parseRtpEncodingParameters = function(e) {
                var t, n = [], i = r.parseRtpParameters(e), a = i.fecMechanisms.indexOf("RED") !== -1, o = i.fecMechanisms.indexOf("ULPFEC") !== -1, s = r.matchPrefix(e, "a=ssrc:").map(function(e) {
                    return r.parseSsrcMedia(e)
                }).filter(function(e) {
                    return "cname" === e.attribute
                }), c = s.length > 0 && s[0].ssrc, d = r.matchPrefix(e, "a=ssrc-group:FID").map(function(e) {
                    var t = e.split(" ");
                    return t.shift(),
                    t.map(function(e) {
                        return parseInt(e, 10)
                    })
                });
                d.length > 0 && d[0].length > 1 && d[0][0] === c && (t = d[0][1]),
                i.codecs.forEach(function(e) {
                    if ("RTX" === e.name.toUpperCase() && e.parameters.apt) {
                        var r = {
                            ssrc: c,
                            codecPayloadType: parseInt(e.parameters.apt, 10),
                            rtx: {
                                payloadType: e.payloadType,
                                ssrc: t
                            }
                        };
                        n.push(r),
                        a && (r = JSON.parse(JSON.stringify(r)),
                        r.fec = {
                            ssrc: t,
                            mechanism: o ? "red+ulpfec" : "red"
                        },
                        n.push(r))
                    }
                }),
                0 === n.length && c && n.push({
                    ssrc: c
                });
                var p = r.matchPrefix(e, "b=");
                return p.length && (0 === p[0].indexOf("b=TIAS:") ? p = parseInt(p[0].substr(7), 10) : 0 === p[0].indexOf("b=AS:") && (p = parseInt(p[0].substr(5), 10)),
                n.forEach(function(e) {
                    e.maxBitrate = p
                })),
                n
            }
            ,
            r.writeSessionBoilerplate = function() {
                return "v=0\r\no=thisisadapterortc 8169639915646943137 2 IN IP4 127.0.0.1\r\ns=-\r\nt=0 0\r\n"
            }
            ,
            r.writeMediaSection = function(e, t, n, i) {
                var a = r.writeRtpDescription(e.kind, t);
                if (a += r.writeIceParameters(e.iceGatherer.getLocalParameters()),
                a += r.writeDtlsParameters(e.dtlsTransport.getLocalParameters(), "offer" === n ? "actpass" : "active"),
                a += "a=mid:" + e.mid + "\r\n",
                a += e.rtpSender && e.rtpReceiver ? "a=sendrecv\r\n" : e.rtpSender ? "a=sendonly\r\n" : e.rtpReceiver ? "a=recvonly\r\n" : "a=inactive\r\n",
                e.rtpSender) {
                    var o = "msid:" + i.id + " " + e.rtpSender.track.id + "\r\n";
                    a += "a=" + o,
                    a += "a=ssrc:" + e.sendEncodingParameters[0].ssrc + " " + o
                }
                return a += "a=ssrc:" + e.sendEncodingParameters[0].ssrc + " cname:" + r.localCName + "\r\n"
            }
            ,
            r.getDirection = function(e, t) {
                for (var n = r.splitLines(e), i = 0; i < n.length; i++)
                    switch (n[i]) {
                    case "a=sendrecv":
                    case "a=sendonly":
                    case "a=recvonly":
                    case "a=inactive":
                        return n[i].substr(2)
                    }
                return t ? r.getDirection(t) : "sendrecv"
            }
            ,
            t.exports = r
        }
        , {}],
        2: [function(e, t, n) {
            "use strict";
            !function() {
                var n = e("./utils").log
                  , r = e("./utils").browserDetails;
                t.exports.browserDetails = r,
                t.exports.extractVersion = e("./utils").extractVersion,
                t.exports.disableLog = e("./utils").disableLog;
                var i = e("./chrome/chrome_shim") || null
                  , a = e("./edge/edge_shim") || null
                  , o = e("./firefox/firefox_shim") || null
                  , s = e("./safari/safari_shim") || null;
                switch (r.browser) {
                case "opera":
                case "chrome":
                    if (!i || !i.shimPeerConnection)
                        return void n("Chrome shim is not included in this adapter release.");
                    n("adapter.js shimming chrome."),
                    t.exports.browserShim = i,
                    i.shimGetUserMedia(),
                    i.shimMediaStream(),
                    i.shimSourceObject(),
                    i.shimPeerConnection(),
                    i.shimOnTrack();
                    break;
                case "firefox":
                    if (!o || !o.shimPeerConnection)
                        return void n("Firefox shim is not included in this adapter release.");
                    n("adapter.js shimming firefox."),
                    t.exports.browserShim = o,
                    o.shimGetUserMedia(),
                    o.shimSourceObject(),
                    o.shimPeerConnection(),
                    o.shimOnTrack();
                    break;
                case "edge":
                    if (!a || !a.shimPeerConnection)
                        return void n("MS edge shim is not included in this adapter release.");
                    n("adapter.js shimming edge."),
                    t.exports.browserShim = a,
                    a.shimGetUserMedia(),
                    a.shimPeerConnection();
                    break;
                case "safari":
                    if (!s)
                        return void n("Safari shim is not included in this adapter release.");
                    n("adapter.js shimming safari."),
                    t.exports.browserShim = s,
                    s.shimGetUserMedia();
                    break;
                default:
                    n("Unsupported browser!")
                }
            }()
        }
        , {
            "./chrome/chrome_shim": 3,
            "./edge/edge_shim": 5,
            "./firefox/firefox_shim": 7,
            "./safari/safari_shim": 9,
            "./utils": 10
        }],
        3: [function(e, t, n) {
            "use strict";
            var r = e("../utils.js").log
              , i = e("../utils.js").browserDetails
              , a = {
                shimMediaStream: function() {
                    window.MediaStream = window.MediaStream || window.webkitMediaStream
                },
                shimOnTrack: function() {
                    "object" != typeof window || !window.RTCPeerConnection || "ontrack"in window.RTCPeerConnection.prototype || Object.defineProperty(window.RTCPeerConnection.prototype, "ontrack", {
                        get: function() {
                            return this._ontrack
                        },
                        set: function(e) {
                            var t = this;
                            this._ontrack && (this.removeEventListener("track", this._ontrack),
                            this.removeEventListener("addstream", this._ontrackpoly)),
                            this.addEventListener("track", this._ontrack = e),
                            this.addEventListener("addstream", this._ontrackpoly = function(e) {
                                e.stream.addEventListener("addtrack", function(n) {
                                    var r = new Event("track");
                                    r.track = n.track,
                                    r.receiver = {
                                        track: n.track
                                    },
                                    r.streams = [e.stream],
                                    t.dispatchEvent(r)
                                }),
                                e.stream.getTracks().forEach(function(t) {
                                    var n = new Event("track");
                                    n.track = t,
                                    n.receiver = {
                                        track: t
                                    },
                                    n.streams = [e.stream],
                                    this.dispatchEvent(n)
                                }
                                .bind(this))
                            }
                            .bind(this))
                        }
                    })
                },
                shimSourceObject: function() {
                    "object" == typeof window && (!window.HTMLMediaElement || "srcObject"in window.HTMLMediaElement.prototype || Object.defineProperty(window.HTMLMediaElement.prototype, "srcObject", {
                        get: function() {
                            return this._srcObject
                        },
                        set: function(e) {
                            var t = this;
                            return this._srcObject = e,
                            this.src && URL.revokeObjectURL(this.src),
                            e ? (this.src = URL.createObjectURL(e),
                            e.addEventListener("addtrack", function() {
                                t.src && URL.revokeObjectURL(t.src),
                                t.src = URL.createObjectURL(e)
                            }),
                            void e.addEventListener("removetrack", function() {
                                t.src && URL.revokeObjectURL(t.src),
                                t.src = URL.createObjectURL(e)
                            })) : void (this.src = "")
                        }
                    }))
                },
                shimPeerConnection: function() {
                    window.RTCPeerConnection = function(e, t) {
                        r("PeerConnection"),
                        e && e.iceTransportPolicy && (e.iceTransports = e.iceTransportPolicy);
                        var n = new webkitRTCPeerConnection(e,t)
                          , i = n.getStats.bind(n);
                        return n.getStats = function(e, t, n) {
                            var r = this
                              , a = arguments;
                            if (arguments.length > 0 && "function" == typeof e)
                                return i(e, t);
                            var o = function(e) {
                                var t = {}
                                  , n = e.result();
                                return n.forEach(function(e) {
                                    var n = {
                                        id: e.id,
                                        timestamp: e.timestamp,
                                        type: e.type
                                    };
                                    e.names().forEach(function(t) {
                                        n[t] = e.stat(t)
                                    }),
                                    t[n.id] = n
                                }),
                                t
                            }
                              , s = function(e, t) {
                                var n = new Map(Object.keys(e).map(function(t) {
                                    return [t, e[t]]
                                }));
                                return t = t || e,
                                Object.keys(t).forEach(function(e) {
                                    n[e] = t[e]
                                }),
                                n
                            };
                            if (arguments.length >= 2) {
                                var c = function(e) {
                                    a[1](s(o(e)))
                                };
                                return i.apply(this, [c, arguments[0]])
                            }
                            return new Promise(function(t, n) {
                                1 === a.length && "object" == typeof e ? i.apply(r, [function(e) {
                                    t(s(o(e)))
                                }
                                , n]) : i.apply(r, [function(e) {
                                    t(s(o(e), e.result()))
                                }
                                , n])
                            }
                            ).then(t, n)
                        }
                        ,
                        n
                    }
                    ,
                    window.RTCPeerConnection.prototype = webkitRTCPeerConnection.prototype,
                    webkitRTCPeerConnection.generateCertificate && Object.defineProperty(window.RTCPeerConnection, "generateCertificate", {
                        get: function() {
                            return webkitRTCPeerConnection.generateCertificate
                        }
                    }),
                    ["createOffer", "createAnswer"].forEach(function(e) {
                        var t = webkitRTCPeerConnection.prototype[e];
                        webkitRTCPeerConnection.prototype[e] = function() {
                            var e = this;
                            if (arguments.length < 1 || 1 === arguments.length && "object" == typeof arguments[0]) {
                                var n = 1 === arguments.length ? arguments[0] : void 0;
                                return new Promise(function(r, i) {
                                    t.apply(e, [r, i, n])
                                }
                                )
                            }
                            return t.apply(this, arguments)
                        }
                    }),
                    i.version < 51 && ["setLocalDescription", "setRemoteDescription", "addIceCandidate"].forEach(function(e) {
                        var t = webkitRTCPeerConnection.prototype[e];
                        webkitRTCPeerConnection.prototype[e] = function() {
                            var e = arguments
                              , n = this
                              , r = new Promise(function(r, i) {
                                t.apply(n, [e[0], r, i])
                            }
                            );
                            return e.length < 2 ? r : r.then(function() {
                                e[1].apply(null, [])
                            }, function(t) {
                                e.length >= 3 && e[2].apply(null, [t])
                            })
                        }
                    }),
                    ["setLocalDescription", "setRemoteDescription", "addIceCandidate"].forEach(function(e) {
                        var t = webkitRTCPeerConnection.prototype[e];
                        webkitRTCPeerConnection.prototype[e] = function() {
                            return arguments[0] = new ("addIceCandidate" === e ? RTCIceCandidate : RTCSessionDescription)(arguments[0]),
                            t.apply(this, arguments)
                        }
                    });
                    var e = RTCPeerConnection.prototype.addIceCandidate;
                    RTCPeerConnection.prototype.addIceCandidate = function() {
                        return null === arguments[0] ? Promise.resolve() : e.apply(this, arguments)
                    }
                }
            };
            t.exports = {
                shimMediaStream: a.shimMediaStream,
                shimOnTrack: a.shimOnTrack,
                shimSourceObject: a.shimSourceObject,
                shimPeerConnection: a.shimPeerConnection,
                shimGetUserMedia: e("./getusermedia")
            }
        }
        , {
            "../utils.js": 10,
            "./getusermedia": 4
        }],
        4: [function(e, t, n) {
            "use strict";
            var r = e("../utils.js").log;
            t.exports = function() {
                var e = function(e) {
                    if ("object" != typeof e || e.mandatory || e.optional)
                        return e;
                    var t = {};
                    return Object.keys(e).forEach(function(n) {
                        if ("require" !== n && "advanced" !== n && "mediaSource" !== n) {
                            var r = "object" == typeof e[n] ? e[n] : {
                                ideal: e[n]
                            };
                            void 0 !== r.exact && "number" == typeof r.exact && (r.min = r.max = r.exact);
                            var i = function(e, t) {
                                return e ? e + t.charAt(0).toUpperCase() + t.slice(1) : "deviceId" === t ? "sourceId" : t
                            };
                            if (void 0 !== r.ideal) {
                                t.optional = t.optional || [];
                                var a = {};
                                "number" == typeof r.ideal ? (a[i("min", n)] = r.ideal,
                                t.optional.push(a),
                                a = {},
                                a[i("max", n)] = r.ideal,
                                t.optional.push(a)) : (a[i("", n)] = r.ideal,
                                t.optional.push(a))
                            }
                            void 0 !== r.exact && "number" != typeof r.exact ? (t.mandatory = t.mandatory || {},
                            t.mandatory[i("", n)] = r.exact) : ["min", "max"].forEach(function(e) {
                                void 0 !== r[e] && (t.mandatory = t.mandatory || {},
                                t.mandatory[i(e, n)] = r[e])
                            })
                        }
                    }),
                    e.advanced && (t.optional = (t.optional || []).concat(e.advanced)),
                    t
                }
                  , t = function(t, n) {
                    if (t = JSON.parse(JSON.stringify(t)),
                    t && t.audio && (t.audio = e(t.audio)),
                    t && "object" == typeof t.video) {
                        var i = t.video.facingMode;
                        if (i = i && ("object" == typeof i ? i : {
                            ideal: i
                        }),
                        i && ("user" === i.exact || "environment" === i.exact || "user" === i.ideal || "environment" === i.ideal) && (!navigator.mediaDevices.getSupportedConstraints || !navigator.mediaDevices.getSupportedConstraints().facingMode) && (delete t.video.facingMode,
                        "environment" === i.exact || "environment" === i.ideal))
                            return navigator.mediaDevices.enumerateDevices().then(function(a) {
                                a = a.filter(function(e) {
                                    return "videoinput" === e.kind
                                });
                                var o = a.find(function(e) {
                                    return e.label.toLowerCase().indexOf("back") !== -1
                                }) || a.length && a[a.length - 1];
                                return o && (t.video.deviceId = i.exact ? {
                                    exact: o.deviceId
                                } : {
                                    ideal: o.deviceId
                                }),
                                t.video = e(t.video),
                                r("chrome: " + JSON.stringify(t)),
                                n(t)
                            });
                        t.video = e(t.video)
                    }
                    return r("chrome: " + JSON.stringify(t)),
                    n(t)
                }
                  , n = function(e) {
                    return {
                        name: {
                            PermissionDeniedError: "NotAllowedError",
                            ConstraintNotSatisfiedError: "OverconstrainedError"
                        }[e.name] || e.name,
                        message: e.message,
                        constraint: e.constraintName,
                        toString: function() {
                            return this.name + (this.message && ": ") + this.message
                        }
                    }
                }
                  , i = function(e, r, i) {
                    t(e, function(e) {
                        navigator.webkitGetUserMedia(e, r, function(e) {
                            i(n(e))
                        })
                    })
                };
                navigator.getUserMedia = i;
                var a = function(e) {
                    return new Promise(function(t, n) {
                        navigator.getUserMedia(e, t, n)
                    }
                    )
                };
                if (navigator.mediaDevices || (navigator.mediaDevices = {
                    getUserMedia: a,
                    enumerateDevices: function() {
                        return new Promise(function(e) {
                            var t = {
                                audio: "audioinput",
                                video: "videoinput"
                            };
                            return MediaStreamTrack.getSources(function(n) {
                                e(n.map(function(e) {
                                    return {
                                        label: e.label,
                                        kind: t[e.kind],
                                        deviceId: e.id,
                                        groupId: ""
                                    }
                                }))
                            })
                        }
                        )
                    }
                }),
                navigator.mediaDevices.getUserMedia) {
                    var o = navigator.mediaDevices.getUserMedia.bind(navigator.mediaDevices);
                    navigator.mediaDevices.getUserMedia = function(e) {
                        return t(e, function(e) {
                            return o(e).then(function(t) {
                                if (e.audio && !t.getAudioTracks().length || e.video && !t.getVideoTracks().length)
                                    throw t.getTracks().forEach(function(e) {
                                        e.stop()
                                    }),
                                    new DOMException("","NotFoundError");
                                return t
                            }, function(e) {
                                return Promise.reject(n(e))
                            })
                        })
                    }
                } else
                    navigator.mediaDevices.getUserMedia = function(e) {
                        return a(e)
                    }
                    ;
                "undefined" == typeof navigator.mediaDevices.addEventListener && (navigator.mediaDevices.addEventListener = function() {
                    r("Dummy mediaDevices.addEventListener called.")
                }
                ),
                "undefined" == typeof navigator.mediaDevices.removeEventListener && (navigator.mediaDevices.removeEventListener = function() {
                    r("Dummy mediaDevices.removeEventListener called.")
                }
                )
            }
        }
        , {
            "../utils.js": 10
        }],
        5: [function(e, t, n) {
            "use strict";
            var r = e("sdp")
              , i = e("../utils").browserDetails
              , a = {
                shimPeerConnection: function() {
                    window.RTCIceGatherer && (window.RTCIceCandidate || (window.RTCIceCandidate = function(e) {
                        return e
                    }
                    ),
                    window.RTCSessionDescription || (window.RTCSessionDescription = function(e) {
                        return e
                    }
                    )),
                    window.RTCPeerConnection = function(e) {
                        var t = this
                          , n = document.createDocumentFragment();
                        if (["addEventListener", "removeEventListener", "dispatchEvent"].forEach(function(e) {
                            t[e] = n[e].bind(n)
                        }),
                        this.onicecandidate = null,
                        this.onaddstream = null,
                        this.ontrack = null,
                        this.onremovestream = null,
                        this.onsignalingstatechange = null,
                        this.oniceconnectionstatechange = null,
                        this.onnegotiationneeded = null,
                        this.ondatachannel = null,
                        this.localStreams = [],
                        this.remoteStreams = [],
                        this.getLocalStreams = function() {
                            return t.localStreams
                        }
                        ,
                        this.getRemoteStreams = function() {
                            return t.remoteStreams
                        }
                        ,
                        this.localDescription = new RTCSessionDescription({
                            type: "",
                            sdp: ""
                        }),
                        this.remoteDescription = new RTCSessionDescription({
                            type: "",
                            sdp: ""
                        }),
                        this.signalingState = "stable",
                        this.iceConnectionState = "new",
                        this.iceGatheringState = "new",
                        this.iceOptions = {
                            gatherPolicy: "all",
                            iceServers: []
                        },
                        e && e.iceTransportPolicy)
                            switch (e.iceTransportPolicy) {
                            case "all":
                            case "relay":
                                this.iceOptions.gatherPolicy = e.iceTransportPolicy;
                                break;
                            case "none":
                                throw new TypeError('iceTransportPolicy "none" not supported')
                            }
                        if (this.usingBundle = e && "max-bundle" === e.bundlePolicy,
                        e && e.iceServers) {
                            var r = JSON.parse(JSON.stringify(e.iceServers));
                            this.iceOptions.iceServers = r.filter(function(e) {
                                if (e && e.urls) {
                                    var t = e.urls;
                                    return "string" == typeof t && (t = [t]),
                                    t = t.filter(function(e) {
                                        return 0 === e.indexOf("turn:") && e.indexOf("transport=udp") !== -1 && e.indexOf("turn:[") === -1 || 0 === e.indexOf("stun:") && i.version >= 14393
                                    })[0],
                                    !!t
                                }
                                return !1
                            })
                        }
                        this.transceivers = [],
                        this._localIceCandidatesBuffer = []
                    }
                    ,
                    window.RTCPeerConnection.prototype._emitBufferedCandidates = function() {
                        var e = this
                          , t = r.splitSections(e.localDescription.sdp);
                        this._localIceCandidatesBuffer.forEach(function(n) {
                            var r = !n.candidate || 0 === Object.keys(n.candidate).length;
                            if (r)
                                for (var i = 1; i < t.length; i++)
                                    t[i].indexOf("\r\na=end-of-candidates\r\n") === -1 && (t[i] += "a=end-of-candidates\r\n");
                            else
                                n.candidate.candidate.indexOf("typ endOfCandidates") === -1 && (t[n.candidate.sdpMLineIndex + 1] += "a=" + n.candidate.candidate + "\r\n");
                            if (e.localDescription.sdp = t.join(""),
                            e.dispatchEvent(n),
                            null !== e.onicecandidate && e.onicecandidate(n),
                            !n.candidate && "complete" !== e.iceGatheringState) {
                                var a = e.transceivers.every(function(e) {
                                    return e.iceGatherer && "completed" === e.iceGatherer.state
                                });
                                a && (e.iceGatheringState = "complete")
                            }
                        }),
                        this._localIceCandidatesBuffer = []
                    }
                    ,
                    window.RTCPeerConnection.prototype.addStream = function(e) {
                        this.localStreams.push(e.clone()),
                        this._maybeFireNegotiationNeeded()
                    }
                    ,
                    window.RTCPeerConnection.prototype.removeStream = function(e) {
                        var t = this.localStreams.indexOf(e);
                        t > -1 && (this.localStreams.splice(t, 1),
                        this._maybeFireNegotiationNeeded())
                    }
                    ,
                    window.RTCPeerConnection.prototype.getSenders = function() {
                        return this.transceivers.filter(function(e) {
                            return !!e.rtpSender
                        }).map(function(e) {
                            return e.rtpSender
                        })
                    }
                    ,
                    window.RTCPeerConnection.prototype.getReceivers = function() {
                        return this.transceivers.filter(function(e) {
                            return !!e.rtpReceiver
                        }).map(function(e) {
                            return e.rtpReceiver
                        })
                    }
                    ,
                    window.RTCPeerConnection.prototype._getCommonCapabilities = function(e, t) {
                        var n = {
                            codecs: [],
                            headerExtensions: [],
                            fecMechanisms: []
                        };
                        return e.codecs.forEach(function(e) {
                            for (var r = 0; r < t.codecs.length; r++) {
                                var i = t.codecs[r];
                                if (e.name.toLowerCase() === i.name.toLowerCase() && e.clockRate === i.clockRate && e.numChannels === i.numChannels) {
                                    n.codecs.push(i),
                                    i.rtcpFeedback = i.rtcpFeedback.filter(function(t) {
                                        for (var n = 0; n < e.rtcpFeedback.length; n++)
                                            if (e.rtcpFeedback[n].type === t.type && e.rtcpFeedback[n].parameter === t.parameter)
                                                return !0;
                                        return !1
                                    });
                                    break
                                }
                            }
                        }),
                        e.headerExtensions.forEach(function(e) {
                            for (var r = 0; r < t.headerExtensions.length; r++) {
                                var i = t.headerExtensions[r];
                                if (e.uri === i.uri) {
                                    n.headerExtensions.push(i);
                                    break
                                }
                            }
                        }),
                        n
                    }
                    ,
                    window.RTCPeerConnection.prototype._createIceAndDtlsTransports = function(e, t) {
                        var n = this
                          , i = new RTCIceGatherer(n.iceOptions)
                          , a = new RTCIceTransport(i);
                        i.onlocalcandidate = function(o) {
                            var s = new Event("icecandidate");
                            s.candidate = {
                                sdpMid: e,
                                sdpMLineIndex: t
                            };
                            var c = o.candidate
                              , d = !c || 0 === Object.keys(c).length;
                            d ? (void 0 === i.state && (i.state = "completed"),
                            s.candidate.candidate = "candidate:1 1 udp 1 0.0.0.0 9 typ endOfCandidates") : (c.component = "RTCP" === a.component ? 2 : 1,
                            s.candidate.candidate = r.writeCandidate(c));
                            var p = r.splitSections(n.localDescription.sdp);
                            s.candidate.candidate.indexOf("typ endOfCandidates") === -1 ? p[s.candidate.sdpMLineIndex + 1] += "a=" + s.candidate.candidate + "\r\n" : p[s.candidate.sdpMLineIndex + 1] += "a=end-of-candidates\r\n",
                            n.localDescription.sdp = p.join("");
                            var u = n.transceivers.every(function(e) {
                                return e.iceGatherer && "completed" === e.iceGatherer.state
                            });
                            switch (n.iceGatheringState) {
                            case "new":
                                n._localIceCandidatesBuffer.push(s),
                                d && u && n._localIceCandidatesBuffer.push(new Event("icecandidate"));
                                break;
                            case "gathering":
                                n._emitBufferedCandidates(),
                                n.dispatchEvent(s),
                                null !== n.onicecandidate && n.onicecandidate(s),
                                u && (n.dispatchEvent(new Event("icecandidate")),
                                null !== n.onicecandidate && n.onicecandidate(new Event("icecandidate")),
                                n.iceGatheringState = "complete");
                                break;
                            case "complete":
                            }
                        }
                        ,
                        a.onicestatechange = function() {
                            n._updateConnectionState()
                        }
                        ;
                        var o = new RTCDtlsTransport(a);
                        return o.ondtlsstatechange = function() {
                            n._updateConnectionState()
                        }
                        ,
                        o.onerror = function() {
                            o.state = "failed",
                            n._updateConnectionState()
                        }
                        ,
                        {
                            iceGatherer: i,
                            iceTransport: a,
                            dtlsTransport: o
                        }
                    }
                    ,
                    window.RTCPeerConnection.prototype._transceive = function(e, t, n) {
                        var i = this._getCommonCapabilities(e.localCapabilities, e.remoteCapabilities);
                        t && e.rtpSender && (i.encodings = e.sendEncodingParameters,
                        i.rtcp = {
                            cname: r.localCName
                        },
                        e.recvEncodingParameters.length && (i.rtcp.ssrc = e.recvEncodingParameters[0].ssrc),
                        e.rtpSender.send(i)),
                        n && e.rtpReceiver && ("video" === e.kind && e.recvEncodingParameters && e.recvEncodingParameters.forEach(function(e) {
                            delete e.rtx
                        }),
                        i.encodings = e.recvEncodingParameters,
                        i.rtcp = {
                            cname: e.cname
                        },
                        e.sendEncodingParameters.length && (i.rtcp.ssrc = e.sendEncodingParameters[0].ssrc),
                        e.rtpReceiver.receive(i))
                    }
                    ,
                    window.RTCPeerConnection.prototype.setLocalDescription = function(e) {
                        var t, n, i = this;
                        if ("offer" === e.type)
                            this._pendingOffer && (t = r.splitSections(e.sdp),
                            n = t.shift(),
                            t.forEach(function(e, t) {
                                var n = r.parseRtpParameters(e);
                                i._pendingOffer[t].localCapabilities = n
                            }),
                            this.transceivers = this._pendingOffer,
                            delete this._pendingOffer);
                        else if ("answer" === e.type) {
                            t = r.splitSections(i.remoteDescription.sdp),
                            n = t.shift();
                            var a = r.matchPrefix(n, "a=ice-lite").length > 0;
                            t.forEach(function(e, t) {
                                var o = i.transceivers[t]
                                  , s = o.iceGatherer
                                  , c = o.iceTransport
                                  , d = o.dtlsTransport
                                  , p = o.localCapabilities
                                  , u = o.remoteCapabilities
                                  , f = "0" === e.split("\n", 1)[0].split(" ", 2)[1];
                                if (!f && !o.isDatachannel) {
                                    var l = r.getIceParameters(e, n);
                                    if (a) {
                                        var m = r.matchPrefix(e, "a=candidate:").map(function(e) {
                                            return r.parseCandidate(e)
                                        }).filter(function(e) {
                                            return "1" === e.component
                                        });
                                        m.length && c.setRemoteCandidates(m)
                                    }
                                    var h = r.getDtlsParameters(e, n);
                                    a && (h.role = "server"),
                                    i.usingBundle && 0 !== t || (c.start(s, l, a ? "controlling" : "controlled"),
                                    d.start(h));
                                    var v = i._getCommonCapabilities(p, u);
                                    i._transceive(o, v.codecs.length > 0, !1)
                                }
                            })
                        }
                        switch (this.localDescription = {
                            type: e.type,
                            sdp: e.sdp
                        },
                        e.type) {
                        case "offer":
                            this._updateSignalingState("have-local-offer");
                            break;
                        case "answer":
                            this._updateSignalingState("stable");
                            break;
                        default:
                            throw new TypeError('unsupported type "' + e.type + '"')
                        }
                        var o = arguments.length > 1 && "function" == typeof arguments[1];
                        if (o) {
                            var s = arguments[1];
                            window.setTimeout(function() {
                                s(),
                                "new" === i.iceGatheringState && (i.iceGatheringState = "gathering"),
                                i._emitBufferedCandidates()
                            }, 0)
                        }
                        var c = Promise.resolve();
                        return c.then(function() {
                            o || ("new" === i.iceGatheringState && (i.iceGatheringState = "gathering"),
                            window.setTimeout(i._emitBufferedCandidates.bind(i), 500))
                        }),
                        c
                    }
                    ,
                    window.RTCPeerConnection.prototype.setRemoteDescription = function(e) {
                        var t = this
                          , n = new MediaStream
                          , i = []
                          , a = r.splitSections(e.sdp)
                          , o = a.shift()
                          , s = r.matchPrefix(o, "a=ice-lite").length > 0;
                        switch (this.usingBundle = r.matchPrefix(o, "a=group:BUNDLE ").length > 0,
                        a.forEach(function(a, c) {
                            var d = r.splitLines(a)
                              , p = d[0].substr(2).split(" ")
                              , u = p[0]
                              , f = "0" === p[1]
                              , l = r.getDirection(a, o)
                              , m = r.matchPrefix(a, "a=mid:");
                            if (m = m.length ? m[0].substr(6) : r.generateIdentifier(),
                            "application" === u && "DTLS/SCTP" === p[2])
                                return void (t.transceivers[c] = {
                                    mid: m,
                                    isDatachannel: !0
                                });
                            var h, v, g, w, C, y, b, T, P, S, R, E, k = r.parseRtpParameters(a);
                            f || (R = r.getIceParameters(a, o),
                            E = r.getDtlsParameters(a, o),
                            E.role = "client"),
                            T = r.parseRtpEncodingParameters(a);
                            var x, D = r.matchPrefix(a, "a=ssrc:").map(function(e) {
                                return r.parseSsrcMedia(e)
                            }).filter(function(e) {
                                return "cname" === e.attribute
                            })[0];
                            D && (x = D.value);
                            var O = r.matchPrefix(a, "a=end-of-candidates", o).length > 0
                              , M = r.matchPrefix(a, "a=candidate:").map(function(e) {
                                return r.parseCandidate(e)
                            }).filter(function(e) {
                                return "1" === e.component
                            });
                            if ("offer" !== e.type || f)
                                "answer" !== e.type || f || (h = t.transceivers[c],
                                v = h.iceGatherer,
                                g = h.iceTransport,
                                w = h.dtlsTransport,
                                C = h.rtpSender,
                                y = h.rtpReceiver,
                                b = h.sendEncodingParameters,
                                P = h.localCapabilities,
                                t.transceivers[c].recvEncodingParameters = T,
                                t.transceivers[c].remoteCapabilities = k,
                                t.transceivers[c].cname = x,
                                (s || O) && M.length && g.setRemoteCandidates(M),
                                t.usingBundle && 0 !== c || (g.start(v, R, "controlling"),
                                w.start(E)),
                                t._transceive(h, "sendrecv" === l || "recvonly" === l, "sendrecv" === l || "sendonly" === l),
                                !y || "sendrecv" !== l && "sendonly" !== l ? delete h.rtpReceiver : (S = y.track,
                                i.push([S, y]),
                                n.addTrack(S)));
                            else {
                                var L = t.usingBundle && c > 0 ? {
                                    iceGatherer: t.transceivers[0].iceGatherer,
                                    iceTransport: t.transceivers[0].iceTransport,
                                    dtlsTransport: t.transceivers[0].dtlsTransport
                                } : t._createIceAndDtlsTransports(m, c);
                                if (O && L.iceTransport.setRemoteCandidates(M),
                                P = RTCRtpReceiver.getCapabilities(u),
                                P.codecs = P.codecs.filter(function(e) {
                                    return "rtx" !== e.name
                                }),
                                b = [{
                                    ssrc: 1001 * (2 * c + 2)
                                }],
                                y = new RTCRtpReceiver(L.dtlsTransport,u),
                                S = y.track,
                                i.push([S, y]),
                                n.addTrack(S),
                                t.localStreams.length > 0 && t.localStreams[0].getTracks().length >= c) {
                                    var j;
                                    "audio" === u ? j = t.localStreams[0].getAudioTracks()[0] : "video" === u && (j = t.localStreams[0].getVideoTracks()[0]),
                                    j && (C = new RTCRtpSender(j,L.dtlsTransport))
                                }
                                t.transceivers[c] = {
                                    iceGatherer: L.iceGatherer,
                                    iceTransport: L.iceTransport,
                                    dtlsTransport: L.dtlsTransport,
                                    localCapabilities: P,
                                    remoteCapabilities: k,
                                    rtpSender: C,
                                    rtpReceiver: y,
                                    kind: u,
                                    mid: m,
                                    cname: x,
                                    sendEncodingParameters: b,
                                    recvEncodingParameters: T
                                },
                                t._transceive(t.transceivers[c], !1, "sendrecv" === l || "sendonly" === l)
                            }
                        }),
                        this.remoteDescription = {
                            type: e.type,
                            sdp: e.sdp
                        },
                        e.type) {
                        case "offer":
                            this._updateSignalingState("have-remote-offer");
                            break;
                        case "answer":
                            this._updateSignalingState("stable");
                            break;
                        default:
                            throw new TypeError('unsupported type "' + e.type + '"')
                        }
                        return n.getTracks().length && (t.remoteStreams.push(n),
                        window.setTimeout(function() {
                            var e = new Event("addstream");
                            e.stream = n,
                            t.dispatchEvent(e),
                            null !== t.onaddstream && window.setTimeout(function() {
                                t.onaddstream(e)
                            }, 0),
                            i.forEach(function(r) {
                                var i = r[0]
                                  , a = r[1]
                                  , o = new Event("track");
                                o.track = i,
                                o.receiver = a,
                                o.streams = [n],
                                t.dispatchEvent(e),
                                null !== t.ontrack && window.setTimeout(function() {
                                    t.ontrack(o)
                                }, 0)
                            })
                        }, 0)),
                        arguments.length > 1 && "function" == typeof arguments[1] && window.setTimeout(arguments[1], 0),
                        Promise.resolve()
                    }
                    ,
                    window.RTCPeerConnection.prototype.close = function() {
                        this.transceivers.forEach(function(e) {
                            e.iceTransport && e.iceTransport.stop(),
                            e.dtlsTransport && e.dtlsTransport.stop(),
                            e.rtpSender && e.rtpSender.stop(),
                            e.rtpReceiver && e.rtpReceiver.stop()
                        }),
                        this._updateSignalingState("closed")
                    }
                    ,
                    window.RTCPeerConnection.prototype._updateSignalingState = function(e) {
                        this.signalingState = e;
                        var t = new Event("signalingstatechange");
                        this.dispatchEvent(t),
                        null !== this.onsignalingstatechange && this.onsignalingstatechange(t)
                    }
                    ,
                    window.RTCPeerConnection.prototype._maybeFireNegotiationNeeded = function() {
                        var e = new Event("negotiationneeded");
                        this.dispatchEvent(e),
                        null !== this.onnegotiationneeded && this.onnegotiationneeded(e)
                    }
                    ,
                    window.RTCPeerConnection.prototype._updateConnectionState = function() {
                        var e, t = this, n = {
                            new: 0,
                            closed: 0,
                            connecting: 0,
                            checking: 0,
                            connected: 0,
                            completed: 0,
                            failed: 0
                        };
                        if (this.transceivers.forEach(function(e) {
                            n[e.iceTransport.state]++,
                            n[e.dtlsTransport.state]++
                        }),
                        n.connected += n.completed,
                        e = "new",
                        n.failed > 0 ? e = "failed" : n.connecting > 0 || n.checking > 0 ? e = "connecting" : n.disconnected > 0 ? e = "disconnected" : n.new > 0 ? e = "new" : (n.connected > 0 || n.completed > 0) && (e = "connected"),
                        e !== t.iceConnectionState) {
                            t.iceConnectionState = e;
                            var r = new Event("iceconnectionstatechange");
                            this.dispatchEvent(r),
                            null !== this.oniceconnectionstatechange && this.oniceconnectionstatechange(r)
                        }
                    }
                    ,
                    window.RTCPeerConnection.prototype.createOffer = function() {
                        var e = this;
                        if (this._pendingOffer)
                            throw new Error("createOffer called while there is a pending offer.");
                        var t;
                        1 === arguments.length && "function" != typeof arguments[0] ? t = arguments[0] : 3 === arguments.length && (t = arguments[2]);
                        var n = []
                          , i = 0
                          , a = 0;
                        if (this.localStreams.length && (i = this.localStreams[0].getAudioTracks().length,
                        a = this.localStreams[0].getVideoTracks().length),
                        t) {
                            if (t.mandatory || t.optional)
                                throw new TypeError("Legacy mandatory/optional constraints not supported.");
                            void 0 !== t.offerToReceiveAudio && (i = t.offerToReceiveAudio),
                            void 0 !== t.offerToReceiveVideo && (a = t.offerToReceiveVideo)
                        }
                        for (this.localStreams.length && this.localStreams[0].getTracks().forEach(function(e) {
                            n.push({
                                kind: e.kind,
                                track: e,
                                wantReceive: "audio" === e.kind ? i > 0 : a > 0
                            }),
                            "audio" === e.kind ? i-- : "video" === e.kind && a--
                        }); i > 0 || a > 0; )
                            i > 0 && (n.push({
                                kind: "audio",
                                wantReceive: !0
                            }),
                            i--),
                            a > 0 && (n.push({
                                kind: "video",
                                wantReceive: !0
                            }),
                            a--);
                        var o = r.writeSessionBoilerplate()
                          , s = [];
                        n.forEach(function(t, n) {
                            var i = t.track
                              , a = t.kind
                              , o = r.generateIdentifier()
                              , c = e.usingBundle && n > 0 ? {
                                iceGatherer: s[0].iceGatherer,
                                iceTransport: s[0].iceTransport,
                                dtlsTransport: s[0].dtlsTransport
                            } : e._createIceAndDtlsTransports(o, n)
                              , d = RTCRtpSender.getCapabilities(a);
                            d.codecs = d.codecs.filter(function(e) {
                                return "rtx" !== e.name
                            });
                            var p, u, f = [{
                                ssrc: 1001 * (2 * n + 1)
                            }];
                            i && (p = new RTCRtpSender(i,c.dtlsTransport)),
                            t.wantReceive && (u = new RTCRtpReceiver(c.dtlsTransport,a)),
                            s[n] = {
                                iceGatherer: c.iceGatherer,
                                iceTransport: c.iceTransport,
                                dtlsTransport: c.dtlsTransport,
                                localCapabilities: d,
                                remoteCapabilities: null,
                                rtpSender: p,
                                rtpReceiver: u,
                                kind: a,
                                mid: o,
                                sendEncodingParameters: f,
                                recvEncodingParameters: null
                            }
                        }),
                        this.usingBundle && (o += "a=group:BUNDLE " + s.map(function(e) {
                            return e.mid
                        }).join(" ") + "\r\n"),
                        n.forEach(function(t, n) {
                            var i = s[n];
                            o += r.writeMediaSection(i, i.localCapabilities, "offer", e.localStreams[0])
                        }),
                        this._pendingOffer = s;
                        var c = new RTCSessionDescription({
                            type: "offer",
                            sdp: o
                        });
                        return arguments.length && "function" == typeof arguments[0] && window.setTimeout(arguments[0], 0, c),
                        Promise.resolve(c)
                    }
                    ,
                    window.RTCPeerConnection.prototype.createAnswer = function() {
                        var e = this
                          , t = r.writeSessionBoilerplate();
                        this.usingBundle && (t += "a=group:BUNDLE " + this.transceivers.map(function(e) {
                            return e.mid
                        }).join(" ") + "\r\n"),
                        this.transceivers.forEach(function(n) {
                            if (n.isDatachannel)
                                return void (t += "m=application 0 DTLS/SCTP 5000\r\nc=IN IP4 0.0.0.0\r\na=mid:" + n.mid + "\r\n");
                            var i = e._getCommonCapabilities(n.localCapabilities, n.remoteCapabilities);
                            t += r.writeMediaSection(n, i, "answer", e.localStreams[0])
                        });
                        var n = new RTCSessionDescription({
                            type: "answer",
                            sdp: t
                        });
                        return arguments.length && "function" == typeof arguments[0] && window.setTimeout(arguments[0], 0, n),
                        Promise.resolve(n)
                    }
                    ,
                    window.RTCPeerConnection.prototype.addIceCandidate = function(e) {
                        if (null === e)
                            this.transceivers.forEach(function(e) {
                                e.iceTransport.addRemoteCandidate({})
                            });
                        else {
                            var t = e.sdpMLineIndex;
                            if (e.sdpMid)
                                for (var n = 0; n < this.transceivers.length; n++)
                                    if (this.transceivers[n].mid === e.sdpMid) {
                                        t = n;
                                        break
                                    }
                            var i = this.transceivers[t];
                            if (i) {
                                var a = Object.keys(e.candidate).length > 0 ? r.parseCandidate(e.candidate) : {};
                                if ("tcp" === a.protocol && (0 === a.port || 9 === a.port))
                                    return;
                                if ("1" !== a.component)
                                    return;
                                "endOfCandidates" === a.type && (a = {}),
                                i.iceTransport.addRemoteCandidate(a);
                                var o = r.splitSections(this.remoteDescription.sdp);
                                o[t + 1] += (a.type ? e.candidate.trim() : "a=end-of-candidates") + "\r\n",
                                this.remoteDescription.sdp = o.join("")
                            }
                        }
                        return arguments.length > 1 && "function" == typeof arguments[1] && window.setTimeout(arguments[1], 0),
                        Promise.resolve()
                    }
                    ,
                    window.RTCPeerConnection.prototype.getStats = function() {
                        var e = [];
                        this.transceivers.forEach(function(t) {
                            ["rtpSender", "rtpReceiver", "iceGatherer", "iceTransport", "dtlsTransport"].forEach(function(n) {
                                t[n] && e.push(t[n].getStats())
                            })
                        });
                        var t = arguments.length > 1 && "function" == typeof arguments[1] && arguments[1];
                        return new Promise(function(n) {
                            var r = new Map;
                            Promise.all(e).then(function(e) {
                                e.forEach(function(e) {
                                    Object.keys(e).forEach(function(t) {
                                        r.set(t, e[t]),
                                        r[t] = e[t]
                                    })
                                }),
                                t && window.setTimeout(t, 0, r),
                                n(r)
                            })
                        }
                        )
                    }
                }
            };
            t.exports = {
                shimPeerConnection: a.shimPeerConnection,
                shimGetUserMedia: e("./getusermedia")
            }
        }
        , {
            "../utils": 10,
            "./getusermedia": 6,
            sdp: 1
        }],
        6: [function(e, t, n) {
            "use strict";
            t.exports = function() {
                var e = function(e) {
                    return {
                        name: {
                            PermissionDeniedError: "NotAllowedError"
                        }[e.name] || e.name,
                        message: e.message,
                        constraint: e.constraint,
                        toString: function() {
                            return this.name
                        }
                    }
                }
                  , t = navigator.mediaDevices.getUserMedia.bind(navigator.mediaDevices);
                navigator.mediaDevices.getUserMedia = function(n) {
                    return t(n).catch(function(t) {
                        return Promise.reject(e(t))
                    })
                }
            }
        }
        , {}],
        7: [function(e, t, n) {
            "use strict";
            var r = e("../utils").browserDetails
              , i = {
                shimOnTrack: function() {
                    "object" != typeof window || !window.RTCPeerConnection || "ontrack"in window.RTCPeerConnection.prototype || Object.defineProperty(window.RTCPeerConnection.prototype, "ontrack", {
                        get: function() {
                            return this._ontrack
                        },
                        set: function(e) {
                            this._ontrack && (this.removeEventListener("track", this._ontrack),
                            this.removeEventListener("addstream", this._ontrackpoly)),
                            this.addEventListener("track", this._ontrack = e),
                            this.addEventListener("addstream", this._ontrackpoly = function(e) {
                                e.stream.getTracks().forEach(function(t) {
                                    var n = new Event("track");
                                    n.track = t,
                                    n.receiver = {
                                        track: t
                                    },
                                    n.streams = [e.stream],
                                    this.dispatchEvent(n)
                                }
                                .bind(this))
                            }
                            .bind(this))
                        }
                    })
                },
                shimSourceObject: function() {
                    "object" == typeof window && (!window.HTMLMediaElement || "srcObject"in window.HTMLMediaElement.prototype || Object.defineProperty(window.HTMLMediaElement.prototype, "srcObject", {
                        get: function() {
                            return this.mozSrcObject
                        },
                        set: function(e) {
                            this.mozSrcObject = e
                        }
                    }))
                },
                shimPeerConnection: function() {
                    if ("object" == typeof window && (window.RTCPeerConnection || window.mozRTCPeerConnection)) {
                        window.RTCPeerConnection || (window.RTCPeerConnection = function(e, t) {
                            if (r.version < 38 && e && e.iceServers) {
                                for (var n = [], i = 0; i < e.iceServers.length; i++) {
                                    var a = e.iceServers[i];
                                    if (a.hasOwnProperty("urls"))
                                        for (var o = 0; o < a.urls.length; o++) {
                                            var s = {
                                                url: a.urls[o]
                                            };
                                            0 === a.urls[o].indexOf("turn") && (s.username = a.username,
                                            s.credential = a.credential),
                                            n.push(s)
                                        }
                                    else
                                        n.push(e.iceServers[i])
                                }
                                e.iceServers = n
                            }
                            return new mozRTCPeerConnection(e,t)
                        }
                        ,
                        window.RTCPeerConnection.prototype = mozRTCPeerConnection.prototype,
                        mozRTCPeerConnection.generateCertificate && Object.defineProperty(window.RTCPeerConnection, "generateCertificate", {
                            get: function() {
                                return mozRTCPeerConnection.generateCertificate
                            }
                        }),
                        window.RTCSessionDescription = mozRTCSessionDescription,
                        window.RTCIceCandidate = mozRTCIceCandidate),
                        ["setLocalDescription", "setRemoteDescription", "addIceCandidate"].forEach(function(e) {
                            var t = RTCPeerConnection.prototype[e];
                            RTCPeerConnection.prototype[e] = function() {
                                return arguments[0] = new ("addIceCandidate" === e ? RTCIceCandidate : RTCSessionDescription)(arguments[0]),
                                t.apply(this, arguments)
                            }
                        });
                        var e = RTCPeerConnection.prototype.addIceCandidate;
                        RTCPeerConnection.prototype.addIceCandidate = function() {
                            return null === arguments[0] ? Promise.resolve() : e.apply(this, arguments)
                        }
                        ;
                        var t = function(e) {
                            var t = new Map;
                            return Object.keys(e).forEach(function(n) {
                                t.set(n, e[n]),
                                t[n] = e[n]
                            }),
                            t
                        }
                          , n = RTCPeerConnection.prototype.getStats;
                        RTCPeerConnection.prototype.getStats = function(e, r, i) {
                            return n.apply(this, [e || null]).then(function(e) {
                                return t(e)
                            }).then(r, i)
                        }
                    }
                }
            };
            t.exports = {
                shimOnTrack: i.shimOnTrack,
                shimSourceObject: i.shimSourceObject,
                shimPeerConnection: i.shimPeerConnection,
                shimGetUserMedia: e("./getusermedia")
            }
        }
        , {
            "../utils": 10,
            "./getusermedia": 8
        }],
        8: [function(e, t, n) {
            "use strict";
            var r = e("../utils").log
              , i = e("../utils").browserDetails;
            t.exports = function() {
                var e = function(e) {
                    return {
                        name: {
                            SecurityError: "NotAllowedError",
                            PermissionDeniedError: "NotAllowedError"
                        }[e.name] || e.name,
                        message: {
                            "The operation is insecure.": "The request is not allowed by the user agent or the platform in the current context."
                        }[e.message] || e.message,
                        constraint: e.constraint,
                        toString: function() {
                            return this.name + (this.message && ": ") + this.message
                        }
                    }
                }
                  , t = function(t, n, a) {
                    var o = function(e) {
                        if ("object" != typeof e || e.require)
                            return e;
                        var t = [];
                        return Object.keys(e).forEach(function(n) {
                            if ("require" !== n && "advanced" !== n && "mediaSource" !== n) {
                                var r = e[n] = "object" == typeof e[n] ? e[n] : {
                                    ideal: e[n]
                                };
                                if (void 0 === r.min && void 0 === r.max && void 0 === r.exact || t.push(n),
                                void 0 !== r.exact && ("number" == typeof r.exact ? r.min = r.max = r.exact : e[n] = r.exact,
                                delete r.exact),
                                void 0 !== r.ideal) {
                                    e.advanced = e.advanced || [];
                                    var i = {};
                                    "number" == typeof r.ideal ? i[n] = {
                                        min: r.ideal,
                                        max: r.ideal
                                    } : i[n] = r.ideal,
                                    e.advanced.push(i),
                                    delete r.ideal,
                                    Object.keys(r).length || delete e[n]
                                }
                            }
                        }),
                        t.length && (e.require = t),
                        e
                    };
                    return t = JSON.parse(JSON.stringify(t)),
                    i.version < 38 && (r("spec: " + JSON.stringify(t)),
                    t.audio && (t.audio = o(t.audio)),
                    t.video && (t.video = o(t.video)),
                    r("ff37: " + JSON.stringify(t))),
                    navigator.mozGetUserMedia(t, n, function(t) {
                        a(e(t))
                    })
                }
                  , n = function(e) {
                    return new Promise(function(n, r) {
                        t(e, n, r)
                    }
                    )
                };
                if (navigator.mediaDevices || (navigator.mediaDevices = {
                    getUserMedia: n,
                    addEventListener: function() {},
                    removeEventListener: function() {}
                }),
                navigator.mediaDevices.enumerateDevices = navigator.mediaDevices.enumerateDevices || function() {
                    return new Promise(function(e) {
                        var t = [{
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
                        e(t)
                    }
                    )
                }
                ,
                i.version < 41) {
                    var a = navigator.mediaDevices.enumerateDevices.bind(navigator.mediaDevices);
                    navigator.mediaDevices.enumerateDevices = function() {
                        return a().then(void 0, function(e) {
                            if ("NotFoundError" === e.name)
                                return [];
                            throw e
                        })
                    }
                }
                if (i.version < 49) {
                    var o = navigator.mediaDevices.getUserMedia.bind(navigator.mediaDevices);
                    navigator.mediaDevices.getUserMedia = function(t) {
                        return o(t).then(function(e) {
                            if (t.audio && !e.getAudioTracks().length || t.video && !e.getVideoTracks().length)
                                throw e.getTracks().forEach(function(e) {
                                    e.stop()
                                }),
                                new DOMException("The object can not be found here.","NotFoundError");
                            return e
                        }, function(t) {
                            return Promise.reject(e(t))
                        })
                    }
                }
                navigator.getUserMedia = function(e, n, r) {
                    return i.version < 44 ? t(e, n, r) : (console.warn("navigator.getUserMedia has been replaced by navigator.mediaDevices.getUserMedia"),
                    void navigator.mediaDevices.getUserMedia(e).then(n, r))
                }
            }
        }
        , {
            "../utils": 10
        }],
        9: [function(e, t, n) {
            "use strict";
            var r = {
                shimGetUserMedia: function() {
                    navigator.getUserMedia = navigator.webkitGetUserMedia
                }
            };
            t.exports = {
                shimGetUserMedia: r.shimGetUserMedia
            }
        }
        , {}],
        10: [function(e, t, n) {
            "use strict";
            var r = !0
              , i = {
                disableLog: function(e) {
                    return "boolean" != typeof e ? new Error("Argument type: " + typeof e + ". Please use a boolean.") : (r = e,
                    e ? "adapter.js logging disabled" : "adapter.js logging enabled")
                },
                log: function() {
                    if ("object" == typeof window) {
                        if (r)
                            return;
                        "undefined" != typeof console && "function" == typeof console.log && console.log.apply(console, arguments)
                    }
                },
                extractVersion: function(e, t, n) {
                    var r = e.match(t);
                    return r && r.length >= n && parseInt(r[n], 10)
                },
                detectBrowser: function() {
                    var e = {};
                    if (e.browser = null,
                    e.version = null,
                    "undefined" == typeof window || !window.navigator)
                        return e.browser = "Not a browser.",
                        e;
                    if (navigator.mozGetUserMedia)
                        e.browser = "firefox",
                        e.version = this.extractVersion(navigator.userAgent, /Firefox\/([0-9]+)\./, 1);
                    else if (navigator.webkitGetUserMedia)
                        if (window.webkitRTCPeerConnection)
                            e.browser = "chrome",
                            e.version = this.extractVersion(navigator.userAgent, /Chrom(e|ium)\/([0-9]+)\./, 2);
                        else {
                            if (!navigator.userAgent.match(/Version\/(\d+).(\d+)/))
                                return e.browser = "Unsupported webkit-based browser with GUM support but no WebRTC support.",
                                e;
                            e.browser = "safari",
                            e.version = this.extractVersion(navigator.userAgent, /AppleWebKit\/([0-9]+)\./, 1)
                        }
                    else {
                        if (!navigator.mediaDevices || !navigator.userAgent.match(/Edge\/(\d+).(\d+)$/))
                            return e.browser = "Not a supported browser.",
                            e;
                        e.browser = "edge",
                        e.version = this.extractVersion(navigator.userAgent, /Edge\/(\d+).(\d+)$/, 2)
                    }
                    return e
                }
            };
            t.exports = {
                log: i.log,
                disableLog: i.disableLog,
                browserDetails: i.detectBrowser(),
                extractVersion: i.extractVersion
            }
        }
        , {}]
    }, {}, [2])(2)
});
/*! LAB.js (LABjs :: Loading And Blocking JavaScript)
    v2.0.3 (c) Kyle Simpson
    MIT License
*/
(function(o) {
    var K = o.$LAB
      , y = "UseLocalXHR"
      , z = "AlwaysPreserveOrder"
      , u = "AllowDuplicates"
      , A = "CacheBust"
      , B = "BasePath"
      , C = /^[^?#]*\//.exec(location.href)[0]
      , D = /^\w+\:\/\/\/?[^\/]+/.exec(C)[0]
      , i = document.head || document.getElementsByTagName("head")
      , L = (o.opera && Object.prototype.toString.call(o.opera) == "[object Opera]") || ("MozAppearance"in document.documentElement.style)
      , q = document.createElement("script")
      , E = typeof q.preload == "boolean"
      , r = E || (q.readyState && q.readyState == "uninitialized")
      , F = !r && q.async === true
      , M = !r && !F && !L;
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
            if ((a.readyState && a.readyState != "complete" && a.readyState != "loaded") || c[b])
                return;
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
            var a, c = f.real_src, b;
            if ("item"in i) {
                if (!i[0]) {
                    setTimeout(arguments.callee, 25);
                    return
                }
                i = i[0]
            }
            a = document.createElement("script");
            if (f.type)
                a.type = f.type;
            if (f.charset)
                a.charset = f.charset;
            if (h) {
                if (r) {
                    e.elem = a;
                    if (E) {
                        a.preload = true;
                        a.onpreload = g
                    } else {
                        a.onreadystatechange = function() {
                            if (a.readyState == "loaded")
                                g()
                        }
                    }
                    a.src = c
                } else if (h && c.indexOf(D) == 0 && d[y]) {
                    b = new XMLHttpRequest();
                    b.onreadystatechange = function() {
                        if (b.readyState == 4) {
                            b.onreadystatechange = function() {}
                            ;
                            e.text = b.responseText + "\n//@ sourceURL=" + c;
                            g()
                        }
                    }
                    ;
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
        var l = {}, Q = r || M, n = [], p = {}, m;
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
            if (p[c.src].finished)
                return;
            if (!a[u])
                p[c.src].finished = true;
            d = b.elem || document.createElement("script");
            if (c.type)
                d.type = c.type;
            if (c.charset)
                d.charset = c.charset;
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
            }, j = function() {
                b.finished_cb(b, d)
            };
            b.src = N(b.src, c[B]);
            b.real_src = b.src + (c[A] ? ((/\?.*$/.test(b.src) ? "&_" : "?_") + ~~(Math.random() * 1E9) + "=") : "");
            if (!p[b.src])
                p[b.src] = {
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
                }
                : function() {
                    I(e)
                }
                ), f)
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
            var e, g = s(l, {}), h = [], j = 0, w = false, k;
            function T(a, c) {
                a.ready = true;
                a.exec_trigger = c;
                x()
            }
            function U(a, c) {
                a.ready = a.finished = true;
                a.exec_trigger = null;
                for (var b = 0; b < c.scripts.length; b++) {
                    if (!c.scripts[b].finished)
                        return
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
                        if (O(h[j]))
                            continue;
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
                                if (G(a))
                                    a = a();
                                if (!a)
                                    continue;
                                if (H(a)) {
                                    b = [].slice.call(a);
                                    b.unshift(d, 1);
                                    [].splice.apply(c, b);
                                    d--;
                                    continue
                                }
                                if (typeof a == "string")
                                    a = {
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
                                if (g[z])
                                    e.wait()
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
                    } else
                        k = false;
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
                var a = m, c = n.length, b = c, d;
                for (; --b >= 0; ) {
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
            }
            , false)
        }
    })("addEventListener", "DOMContentLoaded")
})(this);
!function(i, s) {
    "use strict";
    var e = "0.7.10"
      , o = ""
      , r = "?"
      , n = "function"
      , a = "undefined"
      , t = "object"
      , w = "string"
      , l = "major"
      , d = "model"
      , p = "name"
      , c = "type"
      , u = "vendor"
      , m = "version"
      , f = "architecture"
      , b = "console"
      , g = "mobile"
      , h = "tablet"
      , v = "smarttv"
      , x = "wearable"
      , y = "embedded"
      , k = {
        extend: function(i, s) {
            var e = {};
            for (var o in i)
                s[o] && s[o].length % 2 === 0 ? e[o] = s[o].concat(i[o]) : e[o] = i[o];
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
    }
      , A = {
        rgx: function() {
            for (var i, e, o, r, w, l, d, p = 0, c = arguments; p < c.length && !l; ) {
                var u = c[p]
                  , m = c[p + 1];
                if (typeof i === a) {
                    i = {};
                    for (r in m)
                        m.hasOwnProperty(r) && (w = m[r],
                        typeof w === t ? i[w[0]] = s : i[w] = s)
                }
                for (e = o = 0; e < u.length && !l; )
                    if (l = u[e++].exec(this.getUA()))
                        for (r = 0; r < m.length; r++)
                            d = l[++o],
                            w = m[r],
                            typeof w === t && w.length > 0 ? 2 == w.length ? typeof w[1] == n ? i[w[0]] = w[1].call(this, d) : i[w[0]] = w[1] : 3 == w.length ? typeof w[1] !== n || w[1].exec && w[1].test ? i[w[0]] = d ? d.replace(w[1], w[2]) : s : i[w[0]] = d ? w[1].call(this, d, w[2]) : s : 4 == w.length && (i[w[0]] = d ? w[3].call(this, d.replace(w[1], w[2])) : s) : i[w] = d ? d : s;
                p += 2
            }
            return i
        },
        str: function(i, e) {
            for (var o in e)
                if (typeof e[o] === t && e[o].length > 0) {
                    for (var n = 0; n < e[o].length; n++)
                        if (k.has(e[o][n], i))
                            return o === r ? s : o
                } else if (k.has(e[o], i))
                    return o === r ? s : o;
            return i
        }
    }
      , S = {
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
    }
      , E = {
        browser: [[/(opera\smini)\/([\w\.-]+)/i, /(opera\s[mobiletab]+).+version\/([\w\.-]+)/i, /(opera).+version\/([\w\.]+)/i, /(opera)[\/\s]+([\w\.]+)/i], [p, m], [/(OPiOS)[\/\s]+([\w\.]+)/i], [[p, "Opera Mini"], m], [/\s(opr)\/([\w\.]+)/i], [[p, "Opera"], m], [/(kindle)\/([\w\.]+)/i, /(lunascape|maxthon|netfront|jasmine|blazer)[\/\s]?([\w\.]+)*/i, /(avant\s|iemobile|slim|baidu)(?:browser)?[\/\s]?([\w\.]*)/i, /(?:ms|\()(ie)\s([\w\.]+)/i, /(rekonq)\/([\w\.]+)*/i, /(chromium|flock|rockmelt|midori|epiphany|silk|skyfire|ovibrowser|bolt|iron|vivaldi|iridium|phantomjs)\/([\w\.-]+)/i], [p, m], [/(trident).+rv[:\s]([\w\.]+).+like\sgecko/i], [[p, "IE"], m], [/(edge)\/((\d+)?[\w\.]+)/i], [p, m], [/(yabrowser)\/([\w\.]+)/i], [[p, "Yandex"], m], [/(comodo_dragon)\/([\w\.]+)/i], [[p, /_/g, " "], m], [/(chrome|omniweb|arora|[tizenoka]{5}\s?browser)\/v?([\w\.]+)/i, /(qqbrowser)[\/\s]?([\w\.]+)/i], [p, m], [/(uc\s?browser)[\/\s]?([\w\.]+)/i, /ucweb.+(ucbrowser)[\/\s]?([\w\.]+)/i, /JUC.+(ucweb)[\/\s]?([\w\.]+)/i], [[p, "UCBrowser"], m], [/(dolfin)\/([\w\.]+)/i], [[p, "Dolphin"], m], [/((?:android.+)crmo|crios)\/([\w\.]+)/i], [[p, "Chrome"], m], [/XiaoMi\/MiuiBrowser\/([\w\.]+)/i], [m, [p, "MIUI Browser"]], [/android.+version\/([\w\.]+)\s+(?:mobile\s?safari|safari)/i], [m, [p, "Android Browser"]], [/FBAV\/([\w\.]+);/i], [m, [p, "Facebook"]], [/fxios\/([\w\.-]+)/i], [m, [p, "Firefox"]], [/version\/([\w\.]+).+?mobile\/\w+\s(safari)/i], [m, [p, "Mobile Safari"]], [/version\/([\w\.]+).+?(mobile\s?safari|safari)/i], [m, p], [/webkit.+?(mobile\s?safari|safari)(\/[\w\.]+)/i], [p, [m, A.str, S.browser.oldsafari.version]], [/(konqueror)\/([\w\.]+)/i, /(webkit|khtml)\/([\w\.]+)/i], [p, m], [/(navigator|netscape)\/([\w\.-]+)/i], [[p, "Netscape"], m], [/(swiftfox)/i, /(icedragon|iceweasel|camino|chimera|fennec|maemo\sbrowser|minimo|conkeror)[\/\s]?([\w\.\+]+)/i, /(firefox|seamonkey|k-meleon|icecat|iceape|firebird|phoenix)\/([\w\.-]+)/i, /(mozilla)\/([\w\.]+).+rv\:.+gecko\/\d+/i, /(polaris|lynx|dillo|icab|doris|amaya|w3m|netsurf|sleipnir)[\/\s]?([\w\.]+)/i, /(links)\s\(([\w\.]+)/i, /(gobrowser)\/?([\w\.]+)*/i, /(ice\s?browser)\/v?([\w\._]+)/i, /(mosaic)[\/\s]([\w\.]+)/i], [p, m]],
        cpu: [[/(?:(amd|x(?:(?:86|64)[_-])?|wow|win)64)[;\)]/i], [[f, "amd64"]], [/(ia32(?=;))/i], [[f, k.lowerize]], [/((?:i[346]|x)86)[;\)]/i], [[f, "ia32"]], [/windows\s(ce|mobile);\sppc;/i], [[f, "arm"]], [/((?:ppc|powerpc)(?:64)?)(?:\smac|;|\))/i], [[f, /ower/, "", k.lowerize]], [/(sun4\w)[;\)]/i], [[f, "sparc"]], [/((?:avr32|ia64(?=;))|68k(?=\))|arm(?:64|(?=v\d+;))|(?=atmel\s)avr|(?:irix|mips|sparc)(?:64)?(?=;)|pa-risc)/i], [[f, k.lowerize]]],
        device: [[/\((ipad|playbook);[\w\s\);-]+(rim|apple)/i], [d, u, [c, h]], [/applecoremedia\/[\w\.]+ \((ipad)/], [d, [u, "Apple"], [c, h]], [/(apple\s{0,1}tv)/i], [[d, "Apple TV"], [u, "Apple"]], [/(archos)\s(gamepad2?)/i, /(hp).+(touchpad)/i, /(kindle)\/([\w\.]+)/i, /\s(nook)[\w\s]+build\/(\w+)/i, /(dell)\s(strea[kpr\s\d]*[\dko])/i], [u, d, [c, h]], [/(kf[A-z]+)\sbuild\/[\w\.]+.*silk\//i], [d, [u, "Amazon"], [c, h]], [/(sd|kf)[0349hijorstuw]+\sbuild\/[\w\.]+.*silk\//i], [[d, A.str, S.device.amazon.model], [u, "Amazon"], [c, g]], [/\((ip[honed|\s\w*]+);.+(apple)/i], [d, u, [c, g]], [/\((ip[honed|\s\w*]+);/i], [d, [u, "Apple"], [c, g]], [/(blackberry)[\s-]?(\w+)/i, /(blackberry|benq|palm(?=\-)|sonyericsson|acer|asus|dell|huawei|meizu|motorola|polytron)[\s_-]?([\w-]+)*/i, /(hp)\s([\w\s]+\w)/i, /(asus)-?(\w+)/i], [u, d, [c, g]], [/\(bb10;\s(\w+)/i], [d, [u, "BlackBerry"], [c, g]], [/android.+(transfo[prime\s]{4,10}\s\w+|eeepc|slider\s\w+|nexus 7)/i], [d, [u, "Asus"], [c, h]], [/(sony)\s(tablet\s[ps])\sbuild\//i, /(sony)?(?:sgp.+)\sbuild\//i], [[u, "Sony"], [d, "Xperia Tablet"], [c, h]], [/(?:sony)?(?:(?:(?:c|d)\d{4})|(?:so[-l].+))\sbuild\//i], [[u, "Sony"], [d, "Xperia Phone"], [c, g]], [/\s(ouya)\s/i, /(nintendo)\s([wids3u]+)/i], [u, d, [c, b]], [/android.+;\s(shield)\sbuild/i], [d, [u, "Nvidia"], [c, b]], [/(playstation\s[34portablevi]+)/i], [d, [u, "Sony"], [c, b]], [/(sprint\s(\w+))/i], [[u, A.str, S.device.sprint.vendor], [d, A.str, S.device.sprint.model], [c, g]], [/(lenovo)\s?(S(?:5000|6000)+(?:[-][\w+]))/i], [u, d, [c, h]], [/(htc)[;_\s-]+([\w\s]+(?=\))|\w+)*/i, /(zte)-(\w+)*/i, /(alcatel|geeksphone|huawei|lenovo|nexian|panasonic|(?=;\s)sony)[_\s-]?([\w-]+)*/i], [u, [d, /_/g, " "], [c, g]], [/(nexus\s9)/i], [d, [u, "HTC"], [c, h]], [/[\s\(;](xbox(?:\sone)?)[\s\);]/i], [d, [u, "Microsoft"], [c, b]], [/(kin\.[onetw]{3})/i], [[d, /\./g, " "], [u, "Microsoft"], [c, g]], [/\s(milestone|droid(?:[2-4x]|\s(?:bionic|x2|pro|razr))?(:?\s4g)?)[\w\s]+build\//i, /mot[\s-]?(\w+)*/i, /(XT\d{3,4}) build\//i, /(nexus\s[6])/i], [d, [u, "Motorola"], [c, g]], [/android.+\s(mz60\d|xoom[\s2]{0,2})\sbuild\//i], [d, [u, "Motorola"], [c, h]], [/android.+((sch-i[89]0\d|shw-m380s|gt-p\d{4}|gt-n8000|sgh-t8[56]9|nexus 10))/i, /((SM-T\w+))/i], [[u, "Samsung"], d, [c, h]], [/((s[cgp]h-\w+|gt-\w+|galaxy\snexus|sm-n900))/i, /(sam[sung]*)[\s-]*(\w+-?[\w-]*)*/i, /sec-((sgh\w+))/i], [[u, "Samsung"], d, [c, g]], [/(samsung);smarttv/i], [u, d, [c, v]], [/\(dtv[\);].+(aquos)/i], [d, [u, "Sharp"], [c, v]], [/sie-(\w+)*/i], [d, [u, "Siemens"], [c, g]], [/(maemo|nokia).*(n900|lumia\s\d+)/i, /(nokia)[\s_-]?([\w-]+)*/i], [[u, "Nokia"], d, [c, g]], [/android\s3\.[\s\w;-]{10}(a\d{3})/i], [d, [u, "Acer"], [c, h]], [/android\s3\.[\s\w;-]{10}(lg?)-([06cv9]{3,4})/i], [[u, "LG"], d, [c, h]], [/(lg) netcast\.tv/i], [u, d, [c, v]], [/(nexus\s[45])/i, /lg[e;\s\/-]+(\w+)*/i], [d, [u, "LG"], [c, g]], [/android.+(ideatab[a-z0-9\-\s]+)/i], [d, [u, "Lenovo"], [c, h]], [/linux;.+((jolla));/i], [u, d, [c, g]], [/((pebble))app\/[\d\.]+\s/i], [u, d, [c, x]], [/android.+;\s(glass)\s\d/i], [d, [u, "Google"], [c, x]], [/android.+(\w+)\s+build\/hm\1/i, /android.+(hm[\s\-_]*note?[\s_]*(?:\d\w)?)\s+build/i, /android.+(mi[\s\-_]*(?:one|one[\s_]plus)?[\s_]*(?:\d\w)?)\s+build/i], [[d, /_/g, " "], [u, "Xiaomi"], [c, g]], [/\s(tablet)[;\/\s]/i, /\s(mobile)[;\/\s]/i], [[c, k.lowerize], u, d]],
        engine: [[/windows.+\sedge\/([\w\.]+)/i], [m, [p, "EdgeHTML"]], [/(presto)\/([\w\.]+)/i, /(webkit|trident|netfront|netsurf|amaya|lynx|w3m)\/([\w\.]+)/i, /(khtml|tasman|links)[\/\s]\(?([\w\.]+)/i, /(icab)[\/\s]([23]\.[\d\.]+)/i], [p, m], [/rv\:([\w\.]+).*(gecko)/i], [m, p]],
        os: [[/microsoft\s(windows)\s(vista|xp)/i], [p, m], [/(windows)\snt\s6\.2;\s(arm)/i, /(windows\sphone(?:\sos)*|windows\smobile|windows)[\s\/]?([ntce\d\.\s]+\w)/i], [p, [m, A.str, S.os.windows.version]], [/(win(?=3|9|n)|win\s9x\s)([nt\d\.]+)/i], [[p, "Windows"], [m, A.str, S.os.windows.version]], [/\((bb)(10);/i], [[p, "BlackBerry"], m], [/(blackberry)\w*\/?([\w\.]+)*/i, /(tizen)[\/\s]([\w\.]+)/i, /(android|webos|palm\sos|qnx|bada|rim\stablet\sos|meego|contiki)[\/\s-]?([\w\.]+)*/i, /linux;.+(sailfish);/i], [p, m], [/(symbian\s?os|symbos|s60(?=;))[\/\s-]?([\w\.]+)*/i], [[p, "Symbian"], m], [/\((series40);/i], [p], [/mozilla.+\(mobile;.+gecko.+firefox/i], [[p, "Firefox OS"], m], [/(nintendo|playstation)\s([wids34portablevu]+)/i, /(mint)[\/\s\(]?(\w+)*/i, /(mageia|vectorlinux)[;\s]/i, /(joli|[kxln]?ubuntu|debian|[open]*suse|gentoo|(?=\s)arch|slackware|fedora|mandriva|centos|pclinuxos|redhat|zenwalk|linpus)[\/\s-]?([\w\.-]+)*/i, /(hurd|linux)\s?([\w\.]+)*/i, /(gnu)\s?([\w\.]+)*/i], [p, m], [/(cros)\s[\w]+\s([\w\.]+\w)/i], [[p, "Chromium OS"], m], [/(sunos)\s?([\w\.]+\d)*/i], [[p, "Solaris"], m], [/\s([frentopc-]{0,4}bsd|dragonfly)\s?([\w\.]+)*/i], [p, m], [/(ip[honead]+)(?:.*os\s([\w]+)*\slike\smac|;\sopera)/i], [[p, "iOS"], [m, /_/g, "."]], [/(mac\sos\sx)\s?([\w\s\.]+\w)*/i, /(macintosh|mac(?=_powerpc)\s)/i], [[p, "Mac OS"], [m, /_/g, "."]], [/((?:open)?solaris)[\/\s-]?([\w\.]+)*/i, /(haiku)\s(\w+)/i, /(aix)\s((\d)(?=\.|\)|\s)[\w\.]*)*/i, /(plan\s9|minix|beos|os\/2|amigaos|morphos|risc\sos|openvms)/i, /(unix)\s?([\w\.]+)*/i], [p, m]]
    }
      , T = function(s, e) {
        if (!(this instanceof T))
            return new T(s,e).getResult();
        var r = s || (i && i.navigator && i.navigator.userAgent ? i.navigator.userAgent : o)
          , n = e ? k.extend(E, e) : E;
        return this.getBrowser = function() {
            var i = A.rgx.apply(this, n.browser);
            return i.major = k.major(i.version),
            i
        }
        ,
        this.getCPU = function() {
            return A.rgx.apply(this, n.cpu)
        }
        ,
        this.getDevice = function() {
            return A.rgx.apply(this, n.device)
        }
        ,
        this.getEngine = function() {
            return A.rgx.apply(this, n.engine)
        }
        ,
        this.getOS = function() {
            return A.rgx.apply(this, n.os)
        }
        ,
        this.getResult = function() {
            return {
                ua: this.getUA(),
                browser: this.getBrowser(),
                engine: this.getEngine(),
                os: this.getOS(),
                device: this.getDevice(),
                cpu: this.getCPU()
            }
        }
        ,
        this.getUA = function() {
            return r
        }
        ,
        this.setUA = function(i) {
            return r = i,
            this
        }
        ,
        this
    };
    T.VERSION = e,
    T.BROWSER = {
        NAME: p,
        MAJOR: l,
        VERSION: m
    },
    T.CPU = {
        ARCHITECTURE: f
    },
    T.DEVICE = {
        MODEL: d,
        VENDOR: u,
        TYPE: c,
        CONSOLE: b,
        MOBILE: g,
        SMARTTV: v,
        TABLET: h,
        WEARABLE: x,
        EMBEDDED: y
    },
    T.ENGINE = {
        NAME: p,
        VERSION: m
    },
    T.OS = {
        NAME: p,
        VERSION: m
    },
    typeof exports !== a ? (typeof module !== a && module.exports && (exports = module.exports = T),
    exports.UAParser = T) : typeof define === n && define.amd ? (define("ua-parser-js", [], function() {
        return T
    }),
    i.UAParser = T) : i.UAParser = T;
    var N = i.jQuery || i.Zepto;
    if (typeof N !== a) {
        var O = new T;
        N.ua = O.getResult(),
        N.ua.get = function() {
            return O.getUA()
        }
        ,
        N.ua.set = function(i) {
            O.setUA(i);
            var s = O.getResult();
            for (var e in s)
                N.ua[e] = s[e]
        }
    }
}("object" == typeof window ? window : this);
function qosMonitor(t, e, s, i, o, a, d, n) {
    "use strict";
    console.log("qosMonitor constructor"),
    this.rawStats = new Object,
    this.rawStats.ConnectedPair = new Array,
    this.rawStats["Audio send"] = new Array,
    this.rawStats["Audio recv"] = new Array,
    this.rawStats["Video send"] = new Array,
    this.rawStats["Video recv"] = new Array,
    this.moyRttCP = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    this.moyRttAS = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    this.moyRttVS = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    this.tauxPacketLossAS = [0],
    this.oldLostAS = this.oldSentAS = 0,
    this.oldLostVS = this.oldLostVS = 0,
    this.cptTaux = 0,
    this.tauxPacketLossVS = [0],
    this.oldBandwidthAS = 0,
    this.oldBandwidthVS = 0,
    this.oldBandwidthAR = 0,
    this.oldBandwidthVR = 0,
    this.bandwidthAS = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    this.bandwidthAR = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    this.bandwidthVS = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    this.bandwidthVR = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    this.qosIn = 0,
    this.qosInAverage = 0,
    this.qosInAverageCount = 0,
    this.qosAudioIn = 0,
    this.qosAudioInAverage = 0,
    this.qosAudioInAverageCount = 0,
    this.qosVideoIn = 0,
    this.qosVideoInAverage = 0,
    this.qosVideoInAverageCount = 0,
    this.qosOut = 0,
    this.qosOutAverage = 0,
    this.qosOutAverageCount = 0,
    this.qosAudioOut = 0,
    this.qosAudioOutAverage = 0,
    this.qosAudioOutAverageCount = 0,
    this.qosVideoOut = 0,
    this.qosVideoOutAverage = 0,
    this.qosVideoOutAverageCount = 0,
    this.onQosChange = e,
    this.onQosAudioChange = s,
    this.onQosVideoChange = i,
    this.cpt = 0,
    this.cptRes = 5,
    this.cptDb = 60,
    this.saveStatsFlag = !0,
    this.tabQosIn = new Array,
    this.tabQosAudioIn = new Array,
    this.tabQosVideoIn = new Array,
    this.tabQosOut = new Array,
    this.tabQosAudioOut = new Array,
    this.tabQosVideoOut = new Array,
    this.tabTimestamp = new Array,
    this.tabDelay = new Array,
    this.tabJitterBufferAudio = new Array,
    this.tabJitterBufferVideo = new Array,
    this.tabAudioRtt = new Array,
    this.tabVideoRtt = new Array,
    this.tabAudioBW = new Array,
    this.tabVideoBW = new Array,
    this.clientId = d,
    this.callId = o,
    this.apiKey = a,
    this.socket = n,
    this.interval = t
}
qosMonitor.prototype.insertStats = function(t, e, s, i) {
    var o = 0
      , a = 0
      , d = 0;
    for (this.cpt = this.cpt + this.interval,
    o = 0; o < t.length; ++o) {
        var n = t[o];
        switch (n.type) {
        case "googCandidatePair":
            var h = n.names();
            for (d = 0; d < h.length; ++d)
                if ("googActiveConnection" == h[d] && "true" == n.stat(h[d]))
                    for (a = 0; a < h.length; ++a)
                        "bytesSent" == h[a] && "undefined" != typeof n.stat(h[a]) && (this.rawStats.ConnectedPair.bytesSent = n.stat(h[a])),
                        "bytesReceived" == h[a] && "undefined" != typeof n.stat(h[a]) && (this.rawStats.ConnectedPair.bytesReceived = n.stat(h[a])),
                        "googRtt" == h[a] && "undefined" != typeof n.stat(h[a]) && (this.rawStats.ConnectedPair.googRtt = n.stat(h[a]));
            break;
        case "ssrc":
            var h = n.names();
            for (d = 0; d < h.length; ++d) {
                if ("audioOutputLevel" == h[d])
                    for (a = 0; a < h.length; ++a)
                        "packetsLost" == h[a] && "undefined" != typeof n.stat(h[a]) && (this.rawStats["Audio recv"].packetsLost = n.stat(h[a])),
                        "googDecodingPLC" == h[a] && "undefined" != typeof n.stat(h[a]) && (this.rawStats["Audio recv"].googDecodingPLC = n.stat(h[a])),
                        "googJitterReceived" == h[a] && "undefined" != typeof n.stat(h[a]) && (this.rawStats["Audio recv"].googJitterReceived = n.stat(h[a])),
                        "googJitterBufferMs" == h[a] && "undefined" != typeof n.stat(h[a]) && (this.rawStats["Audio recv"].googJitterBufferMs = n.stat(h[a])),
                        "googCurrentDelayMs" == h[a] && "undefined" != typeof n.stat(h[a]) && (this.rawStats["Audio recv"].googCurrentDelayMs = n.stat(h[a])),
                        "bytesReceived" == h[a] && "undefined" != typeof n.stat(h[a]) && (this.rawStats["Audio recv"].bytesReceived = n.stat(h[a]));
                if ("audioInputLevel" == h[d])
                    for (a = 0; a < h.length; ++a)
                        "googRtt" == h[a] && "undefined" != typeof n.stat(h[a]) && -1 != n.stat(h[a]) && (this.rawStats["Audio send"].googRtt = n.stat(h[a])),
                        "packetsLost" == h[a] && "undefined" != typeof n.stat(h[a]) && (this.rawStats["Audio send"].packetsLost = n.stat(h[a])),
                        "packetsSent" == h[a] && "undefined" != typeof n.stat(h[a]) && (this.rawStats["Audio send"].packetsSent = n.stat(h[a])),
                        "bytesSent" == h[a] && "undefined" != typeof n.stat(h[a]) && (this.rawStats["Audio send"].bytesSent = n.stat(h[a])),
                        "googJitterReceived" == h[a] && "undefined" != typeof n.stat(h[a]) && (this.rawStats["Audio send"].googJitterReceived = n.stat(h[a]));
                if ("googFrameHeightReceived" == h[d])
                    for (var a = 0; a < h.length; ++a)
                        "packetsLost" == h[a] && "undefined" != typeof n.stat(h[a]) && (this.rawStats["Video recv"].packetsLost = n.stat(h[a])),
                        "googNacksSent" == h[a] && "undefined" != typeof n.stat(h[a]) && (this.rawStats["Video recv"].googNacksSent = n.stat(h[a])),
                        "googJitterBufferMs" == h[a] && "undefined" != typeof n.stat(h[a]) && (this.rawStats["Video recv"].googJitterBufferMs = n.stat(h[a])),
                        "bytesReceived" == h[a] && "undefined" != typeof n.stat(h[a]) && (this.rawStats["Video recv"].bytesReceived = n.stat(h[a])),
                        "googFrameRateReceived" == h[a] && "undefined" != typeof n.stat(h[a]) && (this.rawStats["Video recv"].googFrameRateReceived = n.stat(h[a]));
                if ("googFrameHeightInput" == h[d])
                    for (var a = 0; a < h.length; ++a)
                        "packetsLost" == h[a] && "undefined" != typeof n.stat(h[a]) && (this.rawStats["Video send"].packetsLost = n.stat(h[a])),
                        "googNacksReceived" == h[a] && "undefined" != typeof n.stat(h[a]) && (this.rawStats["Video send"].googNacksReceived = n.stat(h[a])),
                        "googRtt" == h[a] && "undefined" != typeof n.stat(h[a]) && -1 != n.stat(h[a]) && (this.rawStats["Video send"].googRtt = n.stat(h[a])),
                        "packetsSent" == h[a] && "undefined" != typeof n.stat(h[a]) && (this.rawStats["Video send"].packetsSent = n.stat(h[a])),
                        "bytesSent" == h[a] && "undefined" != typeof n.stat(h[a]) && (this.rawStats["Video send"].bytesSent = n.stat(h[a]))
            }
        }
    }
    this.computeStats(e, s, i),
    this.cpt % this.cptRes == 0 && this.saveStatsLocal(),
    this.cpt % this.cptDb == 0 && this.saveStatsToDb(!1)
}
,
qosMonitor.prototype.saveStatsLocal = function() {
    if (console.log("saveStatsLocal"),
    this.saveStatsFlag) {
        var t = Date.now();
        this.tabTimestamp.push(t),
        this.tabQosIn.push(this.qosIn),
        this.tabQosAudioIn.push(this.qosAudioIn),
        0 != this.qosVideoIn && this.tabQosVideoIn.push(this.qosVideoIn),
        this.tabQosOut.push(this.qosOut),
        this.tabQosAudioOut.push(this.qosAudioOut),
        0 != this.qosVideoOut && this.tabQosVideoOut.push(this.qosVideoOut),
        this.tabJitterBufferAudio.push(this.rawStats["Audio recv"].googJitterBufferMs),
        "undefined" != typeof this.rawStats["Video recv"].googJitterBufferMs && this.tabJitterBufferVideo.push(this.rawStats["Video recv"].googJitterBufferMs),
        "undefined" != typeof this.rawStats["Video send"].googRtt && this.tabVideoRtt.push(this.rawStats["Video send"].googRtt),
        this.tabAudioRtt.push(this.rawStats["Audio send"].googRtt),
        "undefined" != typeof this.bandwidthAS && this.tabVideoBW.push(8 * this.Average(this.bandwidthAS) / 1024),
        "undefined" != typeof this.bandwidthVS && this.tabVideoBW.push(8 * this.Average(this.bandwidthVS) / 1024),
        "undefined" != typeof this.bandwidthAR && this.tabVideoBW.push(8 * this.Average(this.bandwidthAR) / 1024),
        "undefined" != typeof this.bandwidthVR && this.tabVideoBW.push(8 * this.Average(this.bandwidthVR) / 1024)
    }
}
,
qosMonitor.prototype.saveStatsToDb = function(t) {
    return
}
,
qosMonitor.prototype.setSaveStats = function(t) {
    this.saveStatsFlag = t
}
,
qosMonitor.prototype.computeStats = function(t, e) {
    if (-1 != this.rawStats.ConnectedPair.googRtt && 0 != this.rawStats.ConnectedPair.googRtt && "undefined" != typeof this.rawStats.ConnectedPair.googRtt && this.add(this.rawStats.ConnectedPair.googRtt, this.moyRttCP),
    -1 != this.rawStats["Video send"].googRtt && 0 != this.rawStats["Video send"].googRtt && "undefined" != typeof this.rawStats["Video send"].googRtt && this.add(this.rawStats["Video send"].googRtt, this.moyRttVS),
    -1 != this.rawStats["Audio send"].googRtt && 0 != this.rawStats["Audio send"].googRtt && "undefined" != typeof this.rawStats["Audio send"].googRtt && this.add(this.rawStats["Audio send"].googRtt, this.moyRttAS),
    -1 != this.rawStats["Audio send"].packetsLost && "undefined" != typeof this.rawStats["Audio send"].packetsLost && -1 != this.rawStats["Audio send"].packetsSent && 0 != this.rawStats["Audio send"].packetsSent && "undefined" != typeof this.rawStats["Audio send"].packetsSent) {
        var s = 100 * (this.rawStats["Audio send"].packetsLost - this.oldLostAS) / (this.rawStats["Audio send"].packetsSent - this.oldSentAS);
        this.oldLostAS = this.rawStats["Audio send"].packetsLost,
        this.oldSentAS = this.rawStats["Audio send"].packetsSent,
        this.add(s, this.tauxPacketLossAS)
    }
    if (-1 != this.rawStats["Video send"].packetsLost && "undefined" != typeof this.rawStats["Video send"].packetsLost && -1 != this.rawStats["Video send"].packetsSent && 0 != this.rawStats["Video send"].packetsSent && "undefined" != typeof this.rawStats["Video send"].packetsSent) {
        var s = 100 * (this.rawStats["Video send"].packetsLost - this.oldLostVS) / (this.rawStats["Video send"].packetsSent - this.oldSentVS);
        this.oldLostVS = this.rawStats["Video send"].packetsLost,
        this.oldSentVS = this.rawStats["Video send"].packetsSent,
        this.add(s, this.tauxPacketLossVS)
    }
    -1 != this.rawStats["Audio recv"].bytesReceived && "undefined" != typeof this.rawStats["Audio recv"].bytesReceived && ("undefined" == typeof this.oldBandwidthAR && (this.oldBandwidthAR = 0),
    this.add((this.rawStats["Audio recv"].bytesReceived - this.oldBandwidthAR) / this.interval, this.bandwidthAR),
    this.oldBandwidthAR = this.rawStats["Audio recv"].bytesReceived),
    -1 != this.rawStats["Video recv"].bytesReceived && "undefined" != typeof this.rawStats["Video recv"].bytesReceived && ("undefined" == typeof this.oldBandwidthVR && (this.oldBandwidthVR = 0),
    this.add((this.rawStats["Video recv"].bytesReceived - this.oldBandwidthVR) / this.interval, this.bandwidthVR),
    this.oldBandwidthVR = this.rawStats["Video recv"].bytesReceived),
    -1 != this.rawStats["Audio send"].bytesSent && "undefined" != typeof this.rawStats["Audio send"].bytesSent && ("undefined" == typeof this.oldBandwidthAS && (this.oldBandwidthAS = 0),
    this.add((this.rawStats["Audio send"].bytesSent - this.oldBandwidthAS) / this.interval, this.bandwidthAS),
    this.oldBandwidthAS = this.rawStats["Audio send"].bytesSent),
    -1 != this.rawStats["Video send"].bytesSent && "undefined" != typeof this.rawStats["Video send"].bytesSent && ("undefined" == typeof this.oldBandwidthVS && (this.oldBandwidthVS = 0),
    this.add((this.rawStats["Video send"].bytesSent - this.oldBandwidthVS) / this.interval, this.bandwidthVS),
    this.oldBandwidthVS = this.rawStats["Video send"].bytesSent);
    var i = 0
      , o = 0
      , a = 0
      , d = 0
      , n = 0
      , h = 0
      , r = 0
      , u = 0
      , A = 0
      , g = 0
      , c = this.getCodecs(e)
      , S = 8 * this.Average(this.bandwidthAS) / 1024;
    if (5 > S ? i = 1 : S >= 5 && 10 > S ? i = 2 : S >= 10 && (i = 3),
    null !== c && null != c[1]) {
        var v = 8 * this.Average(this.bandwidthVS) / 1024;
        expectedVideoBandwidth = 300,
        v < .8 * expectedVideoBandwidth ? d = 1 : v >= .8 * expectedVideoBandwidth && v < 1.1 * expectedVideoBandwidth ? d = 2 : v >= 1.1 * expectedVideoBandwidth && (d = 3)
    }
    this.rawStats["Audio recv"].googJitterBufferMs < 60 ? o = 3 : this.rawStats["Audio recv"].googJitterBufferMs >= 60 && this.rawStats["Audio recv"].googJitterBufferMs < 100 ? o = 2 : this.rawStats["Audio recv"].googJitterBufferMs >= 100 && (o = 1),
    this.rawStats["Audio recv"].googCurrentDelayMs < 100 ? a = 3 : this.rawStats["Audio recv"].googCurrentDelayMs >= 100 && this.rawStats["Audio recv"].googCurrentDelayMs < 200 ? a = 2 : this.rawStats["Audio recv"].googCurrentDelayMs >= 200 && (a = 1),
    null !== c && null != c[1] && (this.rawStats["Video recv"].googJitterBufferMs < 100 ? n = 3 : this.rawStats["Video recv"].googJitterBufferMs >= 100 && this.rawStats["Video recv"].googJitterBufferMs < 200 ? n = 2 : this.rawStats["Video recv"].googJitterBufferMs >= 200 && (n = 1));
    var f = !1
      , w = !1
      , p = !1;
    null !== c && null != c[1] ? (Math.ceil((i + 2 * d + n + o + a) / 6) != this.qosIn && (f = !0),
    this.qosIn = Math.ceil((i + 2 * d + n + o + a) / 6),
    this.qosInAverage = (this.qosInAverage * this.qosInAverageCount + this.qosIn) / (this.qosInAverageCount + 1),
    this.qosInAverageCount++,
    Math.ceil((i + o + a) / 3) != this.qosAudioIn && (w = !0),
    this.qosAudioIn = Math.ceil((i + o + a) / 3),
    this.qosAudioInAverage = (this.qosAudioInAverage * this.qosAudioInAverageCount + this.qosAudioIn) / (this.qosAudioInAverageCount + 1),
    this.qosAudioInAverageCount++,
    Math.ceil((2 * d + n) / 3) != this.qosVideoIn && (p = !0),
    this.qosVideoIn = Math.ceil((2 * d + n) / 3),
    this.qosVideoInAverage = (this.qosVideoInAverage * this.qosVideoInAverageCount + this.qosVideoIn) / (this.qosVideoInAverageCount + 1),
    this.qosVideoInAverageCount++) : (Math.ceil((i + o + a) / 3) != this.qosOut && (f = !0),
    this.qosIn = Math.ceil((i + o + a) / 3),
    this.qosInAverage = (this.qosInAverage * this.qosInAverageCount + this.qosIn) / (this.qosInAverageCount + 1),
    this.qosInAverageCount++,
    Math.ceil((i + o + a) / 3) != this.qosAudioIn && (w = !0),
    this.qosAudioIn = Math.ceil((i + o + a) / 3),
    this.qosAudioInAverage = (this.qosAudioInAverage * this.qosAudioInAverageCount + this.qosAudioIn) / (this.qosAudioInAverageCount + 1),
    this.qosAudioInAverageCount++),
    this.RttAverage(this.moyRttAS) < 80 ? r = 3 : this.RttAverage(this.moyRttAS) >= 80 && this.RttAverage(this.moyRttAS) < 150 ? r = 2 : this.RttAverage(this.moyRttAS) >= 150 && (r = 1),
    this.tauxPacketLossAS <= 5 ? h = 3 : this.tauxPacketLossAS > 5 && this.tauxPacketLossAS < 10 ? h = 2 : this.tauxPacketLossAS >= 10 && (h = 1),
    this.rawStats["Audio recv"].googJitterReceived < 80 ? u = 3 : this.rawStats["Audio recv"].googJitterReceived >= 80 && this.rawStats["Audio recv"].googJitterReceived < 150 ? u = 2 : this.rawStats["Audio recv"].googJitterReceived >= 150 && (u = 1),
    null !== c && null != c[1] && (this.tauxPacketLossVS <= 5 ? A = 3 : this.tauxPacketLossVS > 5 && this.tauxPacketLossVS < 10 ? A = 2 : this.tauxPacketLossVS >= 10 && (A = 1),
    this.RttAverage(this.moyRttVS) < 80 ? g = 3 : this.RttAverage(this.moyRttVS) >= 80 && this.RttAverage(this.moyRttVS) < 150 ? g = 2 : this.RttAverage(this.moyRttVS) >= 150 && (g = 1)),
    null !== c && null != c[1] ? (Math.ceil((r + 2 * h + u + 2 * A + g) / 7) != this.qosOut && (f = !0),
    this.qosOut = Math.ceil((r + 2 * h + u + 2 * A + g) / 7),
    this.qosOutAverage = (this.qosOutAverage * this.qosOutAverageCount + this.qosOut) / (this.qosOutAverageCount + 1),
    this.qosOutAverageCount++,
    Math.ceil((r + 2 * h + u) / 4) != this.qosAudioOut && (w = !0),
    this.qosAudioOut = Math.ceil((r + 2 * h + u) / 4),
    this.qosAudioOutAverage = (this.qosAudioOutAverage * this.qosAudioOutAverageCount + this.qosAudioOut) / (this.qosAudioOutAverageCount + 1),
    this.qosAudioOutAverageCount++,
    Math.ceil((2 * A + g) / 3) != this.qosVideoOut && (p = !0),
    this.qosVideoOut = Math.ceil((2 * A + g) / 3),
    this.qosVideoOutAverage = (this.qosVideoOutAverage * this.qosVideoOutAverageCount + this.qosVideoOut) / (this.qosVideoOutAverageCount + 1),
    this.qosVideoOutAverageCount++) : (Math.ceil((r + 2 * h + u) / 4) != this.qosOut && (f = !0),
    this.qosOut = Math.ceil((r + 2 * h + u) / 4),
    this.qosOutAverage = (this.qosOutAverage * this.qosOutAverageCount + this.qosOut) / (this.qosOutAverageCount + 1),
    this.qosOutAverageCount++,
    Math.ceil((r + 2 * h + u) / 4) != this.qosAudioOut && (w = !0),
    this.qosAudioOut = Math.ceil((r + 2 * h + u) / 4),
    this.qosAudioOutAverage = (this.qosAudioOutAverage * this.qosAudioOutAverageCount + this.qosAudioOut) / (this.qosAudioOutAverageCount + 1),
    this.qosAudioOutAverageCount++),
    f && (this.onQosChange(this.qosIn, this.qosOut),
    f = !1),
    w && (this.onQosAudioChange(this.qosAudioIn, this.qosAudioOut),
    w = !1),
    p && (this.onQosVideoChange(this.qosVideoIn, this.qosVideoOut),
    p = !1)
}
,
qosMonitor.prototype.getCodecs = function(t) {
    var e = !1
      , s = !1
      , i = null
      , o = null;
    if (null !== t && "undefined" != typeof t && "undefined" != typeof t.sdp) {
        for (var a = t.sdp, d = a.split("\n"), n = 0; n < d.length; n++)
            -1 != d[n].indexOf("a=mid:audio") && (e = !0),
            -1 != d[n].indexOf("a=mid:video") && (s = !0),
            e && -1 != d[n].indexOf("a=rtpmap:") && (i = d[n],
            e = !1),
            s && -1 != d[n].indexOf("a=rtpmap:") && (o = d[n],
            s = !1);
        return [i, o]
    }
    return null
}
,
qosMonitor.prototype.getQosScore = function() {
    return [this.qosIn, this.qosOut, this.qosAudioIn, this.qosAudioOut, this.qosVideoIn, this.qosVideoOut]
}
,
qosMonitor.prototype.getStat = function(t) {
    switch (t) {
    case "AudioOutBandwidth":
        return 8 * this.Average(this.bandwidthAS) / 1024;
    case "VideoOutBandwidth":
        return 8 * this.Average(this.bandwidthVS) / 1024;
    case "AudioInBandwidth":
        return 8 * this.Average(this.bandwidthAR) / 1024;
    case "VideoInBandwidth":
        return 8 * this.Average(this.bandwidthVR) / 1024;
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
        return this.rawStats["Audio send"].googJitterReceived;
    case "VideoInJitterBufferMs":
        return this.rawStats["Video recv"].googJitterBufferMs;
    case "VideoOutLossRate":
        return this.tauxPacketLossVS;
    case "VideoOutRtt":
        return this.RttAverage(this.moyRttVS)
    }
}
,
qosMonitor.prototype.getAllStats = function() {
    for (var t = {
        AudioRecv: {},
        AudioSend: {},
        VideoRecv: {},
        VideoSend: {}
    }, e = {
        AudioRecv: "Audio recv",
        VideoRecv: "Video recv",
        AudioSend: "Audio send",
        VideoSend: "Video send"
    }, s = Object.keys(e), i = 0; i < s.length; i++)
        for (var o = Object.keys(this.rawStats[e[s[i]]]), a = 0; a < o.length; a++)
            t[s[i]][o[a]] = this.rawStats[e[s[i]]][o[a]];
    return t.AudioRecv.bandwidth = 8 * this.Average(this.bandwidthAR) / 1024,
    t.VideoRecv.bandwidth = 8 * this.Average(this.bandwidthVR) / 1024,
    t.AudioSend.bandwidth = 8 * this.Average(this.bandwidthAS) / 1024,
    t.VideoSend.bandwidth = 8 * this.Average(this.bandwidthVS) / 1024,
    t.AudioRecv.jitterReceived = this.rawStats["Audio recv"].googJitterReceived,
    t.AudioRecv.jitterBufferMs = this.rawStats["Audio recv"].googJitterBufferMs,
    t.VideoRecv.jitterBufferMs = this.rawStats["Video recv"].googJitterBufferMs,
    t.AudioRecv.delay = this.rawStats["Audio recv"].googCurrentDelayMs,
    t.AudioSend.rtt = this.RttAverage(this.moyRttAS),
    t.VideoSend.rtt = this.RttAverage(this.moyRttVS),
    delete t.AudioRecv.googCurrentDelayMs,
    delete t.AudioRecv.googJitterReceived,
    delete t.AudioRecv.googJitterBufferMs,
    delete t.VideoRecv.googJitterBufferMs,
    delete t.AudioSend.googRtt,
    delete t.VideoSend.googRtt,
    t
}
,
qosMonitor.prototype.displayComputedStats = function() {
    console.log("Audio IN JitterReceived:" + this.rawStats["Audio recv"].googJitterReceived + " jitterbufferMs:" + this.rawStats["Audio recv"].googJitterBufferMs + " delay:" + this.rawStats["Audio recv"].googCurrentDelayMs + " bandwidth :" + 8 * this.Average(this.bandwidthAS) / 1024 + " kBits/s"),
    console.log("Audio OUT  lossRate:" + this.tauxPacketLossAS + " rtt:" + this.RttAverage(this.moyRttAS) + " googJitterReceived:" + this.rawStats["Audio recv"].googJitterReceived),
    console.log("Video IN jitter buffer ms:" + this.rawStats["Video recv"].googJitterBufferMs + " bandwidth:" + 8 * this.Average(this.bandwidthVS) / 1024 + " kBits/s"),
    console.log("Video OUT loss rate:" + this.tauxPacketLossVS + " rtt:" + this.RttAverage(this.moyRttVS))
}
,
qosMonitor.prototype.RttAverage = function(t) {
    for (var e = 0, s = 0, i = 0; i < t.length; ++i)
        0 != t[i] && -1 != t[i] && "undefined" != typeof t[i] && (e += parseInt(t[i], 10),
        s++);
    return parseInt(e / s, 10)
}
,
qosMonitor.prototype.Average = function(t) {
    for (var e = 0, s = 0, i = 0; i < t.length; ++i)
        -1 != t[i] && "undefined" != typeof t[i] && (e += parseInt(t[i], 10),
        s++);
    return parseInt(e / s, 10)
}
,
qosMonitor.prototype.add = function(t, e) {
    e.pop(),
    e.unshift(t)
}
,
qosMonitor.prototype.displayTab = function(t) {
    for (var e in t)
        console.log(e + " = " + t[e])
}
;
!function(e, t) {
    "use strict";
    function i(e) {
        var t = new RegExp("^[0-9-.]*$","g");
        return t.test(e)
    }
    function n() {
        return "https:" == e.location.protocol
    }
    function s() {
        return "http:" == e.location.protocol
    }
    function a(e, t) {
        var i = {}
          , n = null;
        for (n in e)
            e.hasOwnProperty(n) && (i[n] = e[n]);
        for (n in t)
            t.hasOwnProperty(n) && (i[n] = t[n]);
        return i
    }
    function o(e) {
        var t, i, n, s, a = {};
        for (t = e.split("&"),
        n = 0,
        s = t.length; s > n; n++)
            i = t[n].split("="),
            a[i[0]] = i[1];
        return a
    }
    function l(e) {
        return Object.keys(e).map(function(t) {
            return t + "=" + e[t]
        }).join("&")
    }
    e.Prototype && delete Array.prototype.toJSON;
    var r = null
      , c = null
      , d = null
      , h = null
      , u = null
      , C = null
      , p = null
      , m = null
      , v = null
      , g = null
      , f = null
      , T = null
      , I = "notTested"
      , b = null
      , y = null
      , R = null
      , S = null
      , w = null
      , D = null
      , M = null
      , E = null;
    return M = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-/=",
    E = {
        decode: function(e) {
            var t = M.indexOf(e.charAt(e.length - 1))
              , i = M.indexOf(e.charAt(e.length - 2))
              , n = e.length / 4 * 3
              , s = null
              , a = null
              , o = null
              , l = null
              , r = null
              , c = null
              , d = null
              , h = 0
              , u = 0
              , C = null;
            for (64 == t && n--,
            64 == i && n--,
            C = new Uint8Array(n),
            h = 0; n > h; h += 3)
                l = M.indexOf(e.charAt(u++)),
                r = M.indexOf(e.charAt(u++)),
                c = M.indexOf(e.charAt(u++)),
                d = M.indexOf(e.charAt(u++)),
                s = l << 2 | r >> 4,
                a = (15 & r) << 4 | c >> 2,
                o = (3 & c) << 6 | d,
                C[h] = s,
                64 != c && (C[h + 1] = a),
                64 != d && (C[h + 2] = o);
            return C
        },
        encode: function(e) {
            var t = ""
              , i = new Uint8Array(e)
              , n = i.byteLength
              , s = n % 3
              , a = n - s
              , o = null
              , l = null
              , r = null
              , c = null
              , d = null
              , h = 0;
            for (h = 0; a > h; h += 3)
                d = i[h] << 16 | i[h + 1] << 8 | i[h + 2],
                o = (16515072 & d) >> 18,
                l = (258048 & d) >> 12,
                r = (4032 & d) >> 6,
                c = 63 & d,
                t += M[o] + M[l] + M[r] + M[c];
            return 1 == s ? (d = i[a],
            o = (252 & d) >> 2,
            l = (3 & d) << 4,
            t += M[o] + M[l] + "==") : 2 == s && (d = i[a] << 8 | i[a + 1],
            o = (64512 & d) >> 10,
            l = (1008 & d) >> 4,
            r = (15 & d) << 2,
            t += M[o] + M[l] + M[r] + "="),
            t
        }
    },
    R = new UAParser,
    S = R.getBrowser(),
    g = S.name,
    f = S.version,
    D = R.getOS(),
    r = function() {
        if ("notTested" === I)
            try {
                new CustomEvent("test",{
                    detail: "test",
                    bubbles: !0,
                    cancelable: !0
                }),
                I = !0
            } catch (i) {
                I = !1
            }
        ("IE" === g && f > 8 || "Netscape" === g) && (!function() {
            function i(e, i) {
                i = i || {
                    bubbles: !1,
                    cancelable: !1,
                    detail: t
                };
                var n = document.createEvent("CustomEvent");
                return n.initCustomEvent(e, i.bubbles, i.cancelable, i.detail),
                n
            }
            i.prototype = e.CustomEvent.prototype,
            e.CustomEvent = i
        }(),
        I = !0),
        this.eventDispatchMgr = function(e, t) {
            if (I === !1)
                "undefined" != typeof $jqApz ? $jqApz.event.trigger({
                    type: e,
                    detail: t
                }) : "undefined" != typeof jQuery && jQuery.event.trigger({
                    type: e,
                    detail: t
                });
            else {
                var i = new CustomEvent(e,{
                    detail: t,
                    bubbles: !0,
                    cancelable: !0
                });
                document.dispatchEvent(i)
            }
        }
        ,
        this.createIncomingCallEvent = function(e, t, i, n, s, a, o, l, r, c, d) {
            var h = "incomingCall"
              , u = {
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
                destCallType: d,
                recordedCall: r,
                remoteType: c
            };
            this.eventDispatchMgr(h, u)
        }
        ,
        this.createCallAttemptEvent = function(e, t, i, n) {
            var s = "callAttempt"
              , a = {
                eventType: "callAttempt",
                time: new Date,
                clientId: e,
                callerId: t,
                callId: n,
                callerNickname: i
            };
            this.eventDispatchMgr(s, a)
        }
        ,
        this.createCallEstablishedEvent = function(e, t, i, n) {
            var s = "callEstablished"
              , a = {
                eventType: "callEstablished",
                time: new Date,
                calleeId: e,
                callType: t,
                callId: i,
                destCallType: n
            };
            this.eventDispatchMgr(s, a)
        }
        ,
        this.createHangupEvent = function(e, t, i, n, s, a, o) {
            var l = "hangup"
              , r = {
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
        }
        ,
        this.createRemoteHangupEvent = function(e, t, i, n) {
            var s = "remoteHangup"
              , a = {
                eventType: "remoteHangup",
                time: new Date,
                clientId: e,
                remoteId: t,
                lastEstablishedCall: i,
                reason: n
            };
            this.eventDispatchMgr(s, a)
        }
        ,
        this.createUserMediaSuccessEvent = function(e, t, i, n, s, a, o, l, r) {
            var c = "userMediaSuccess"
              , d = {
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
        }
        ,
        this.createUserMediaErrorEvent = function(e, t) {
            var i = "userMediaError"
              , n = {
                eventType: "userMediaError",
                time: new Date,
                onCallEstablishment: e,
                callType: t
            };
            this.eventDispatchMgr(i, n)
        }
        ,
        this.createICECandidateTypeUpdateEvent = function(e, t, i) {
            var n = "ICECandidateTypeUpdate"
              , s = {
                eventType: "ICECandidateTypeUpdate",
                time: new Date,
                callId: e,
                localCandidate: t,
                remoteCandidate: i
            };
            this.eventDispatchMgr(n, s)
        }
        ,
        this.createErrorEvent = function(e, t) {
            var i = "error"
              , n = {
                eventType: "error :",
                time: new Date,
                errorInfo: e,
                errorCode: t
            };
            this.eventDispatchMgr(i, n)
        }
        ,
        this.createReceiveIMMessageEvent = function(e, t, i, n, s, a) {
            var o = "receiveIMMessage"
              , l = {
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
        }
        ,
        this.createChannelEvent = function(e) {
            var t = "channelEvent"
              , i = {
                eventType: "channelEvent :",
                time: new Date,
                channelEvent: e
            };
            this.eventDispatchMgr(t, i)
        }
        ,
        this.createSessionReadyEvent = function(e) {
            var t = "sessionReady"
              , i = {
                eventType: "sessionReady",
                time: new Date,
                apiCCId: e
            };
            this.eventDispatchMgr(t, i)
        }
        ,
        this.createWebRTCClientCreatedEvent = function() {
            var e = "webRTCClientCreated"
              , t = {
                eventType: "webRTCClientCreated",
                time: new Date
            };
            this.eventDispatchMgr(e, t)
        }
        ,
        this.createUpdatePresenceEvent = function(e, t, i) {
            var n = "updatePresence"
              , s = {
                eventType: "updatePresence",
                time: new Date,
                connectedUsersList: e,
                connectedUsersListWithStatus: i,
                state: t
            };
            this.eventDispatchMgr(n, s)
        }
        ,
        this.createUpdateUserStatusEvent = function(e) {
            var t = "updateUserStatus"
              , i = {
                eventType: "updateUserStatus",
                time: new Date,
                message: e
            };
            this.eventDispatchMgr(t, i)
        }
        ,
        this.createGroupChatCreationEvent = function(e, t, i, n, s, a) {
            var o = "groupChatCreation"
              , l = {
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
        }
        ,
        this.createGroupChatInvitationEvent = function(e, t, i, n, s) {
            var a = "groupChatInvitation"
              , o = {
                eventType: "groupChatInvitation",
                time: new Date,
                groupChatId: e,
                contactList: s,
                senderId: t,
                senderNickname: i,
                senderPhotoURL: n
            };
            this.eventDispatchMgr(a, o)
        }
        ,
        this.createGroupChatMemberUpdateEvent = function(e, t, i) {
            var n = "groupChatMemberUpdate"
              , s = {
                eventType: "groupChatMemberUpdate",
                time: new Date,
                groupChatId: e,
                contactList: t,
                status: i
            };
            this.eventDispatchMgr(n, s)
        }
        ,
        this.createAddUserInGroupChatEvent = function(e, t, i) {
            var n = "addUserInGroupChatAnswer"
              , s = {
                eventType: "addUserInGroupChatAnswer",
                time: new Date,
                invitationSended: e,
                groupChatId: t,
                contactId: i
            };
            this.eventDispatchMgr(n, s)
        }
        ,
        this.createReceiveGroupChatMessageEvent = function(e, t, i, n) {
            var s = "receiveGroupChatMessage"
              , a = {
                eventType: "receiveGroupChatMessage",
                time: new Date,
                groupChatId: e,
                senderId: t,
                senderNickname: i,
                message: n
            };
            this.eventDispatchMgr(s, a)
        }
        ,
        this.createReceiveConversationListAnswerEvent = function(e) {
            var t = "receiveConversationList"
              , i = {
                eventType: "receiveConversationList",
                time: new Date,
                convList: e
            };
            this.eventDispatchMgr(t, i)
        }
        ,
        this.createReceiveContactOccurrencesFromConversationListAnswerEvent = function(e) {
            var t = "receiveContactOccurrencesFromConversationList"
              , i = {
                eventType: "receiveContactOccurrencesFromConversationList",
                time: new Date,
                occurrencesList: e
            };
            this.eventDispatchMgr(t, i)
        }
        ,
        this.createReceiveConversationDetailReportAnswerEvent = function(e) {
            var t = "receiveConversationDetailReport"
              , i = {
                eventType: "receiveConversationDetailReport",
                time: new Date,
                CDR: e
            };
            this.eventDispatchMgr(t, i)
        }
        ,
        this.createReceiveConversationHistoryEvent = function(e, t, i) {
            var n = "receiveConversationHistory"
              , s = {
                eventType: "receiveConversationHistory",
                time: new Date,
                convId: e,
                convHistory: t,
                status: i
            };
            this.eventDispatchMgr(n, s)
        }
        ,
        this.createUserDataAnswerEvent = function(e, t, i, n) {
            var s = "userDataAnswer"
              , a = {
                eventType: "userDataAnswer",
                time: new Date,
                userFound: e,
                contactId: t,
                nickname: i,
                photoURL: n
            };
            this.eventDispatchMgr(s, a)
        }
        ,
        this.createReceiveDataEvent = function(e, t, i) {
            var n = "receiveData"
              , s = {
                eventType: "receiveData",
                time: new Date,
                senderId: e,
                dstRoomId: t,
                data: i
            };
            this.eventDispatchMgr(n, s)
        }
        ,
        this.createMCUSessionCreationEvent = function(e, t) {
            var i = "MCUSessionCreation"
              , n = {
                eventType: "MCUSessionCreation",
                time: new Date,
                sessionId: e,
                token: t
            };
            this.eventDispatchMgr(i, n)
        }
        ,
        this.createJoinMCUSessionAnswerEvent = function(e, t, i, n) {
            var s = "joinMCUSessionAnswer"
              , a = {
                eventType: "joinMCUSessionAnswer",
                time: new Date,
                sessionId: e,
                token: t,
                groupChatId: i,
                initiator: n
            };
            this.eventDispatchMgr(s, a)
        }
        ,
        this.createMCUAvailableStreamEvent = function(e, t) {
            var i = "MCUAvailableStream"
              , n = {
                eventType: "MCUAvailableStream",
                time: new Date,
                streams: e,
                isRemoteStream: t
            };
            this.eventDispatchMgr(i, n)
        }
        ,
        this.createMCURemovedStreamEvent = function(e) {
            var t = "MCURemoveStream"
              , i = {
                eventType: "MCURemoveStream",
                time: new Date,
                streamId: e
            };
            this.eventDispatchMgr(t, i)
        }
        ,
        this.createReceiveMCUSessionInvitationEvent = function(e, i, n, s) {
            n === t && (n = 0);
            var a = "receiveMCUSessionInvitation"
              , o = {
                eventType: "receiveMCUSessionInvitation",
                time: new Date,
                sessionId: e,
                token: i,
                groupChatId: n,
                initiatorId: s
            };
            this.eventDispatchMgr(a, o)
        }
        ,
        this.createRemoteStreamAddedEvent = function(e, t, i, n, s) {
            var a = "remoteStreamAdded"
              , o = {
                eventType: "remoteStreamAdded",
                time: new Date,
                callId: t,
                callType: e,
                stream: i,
                remoteId: n,
                destCallType: s
            };
            this.eventDispatchMgr(a, o)
        }
        ,
        this.createCanPlayRemoteVideoEvent = function(e, t, i) {
            var n = "canPlayRemoteVideo"
              , s = {
                eventType: "canPlayRemoteVideo",
                time: new Date,
                videoDivId: e,
                callType: t,
                remoteId: i
            };
            this.eventDispatchMgr(n, s)
        }
        ,
        this.createRecordedFileAvailableEvent = function(e) {
            var t = "recordedFileAvailable"
              , i = {
                eventType: "recordedFileAvailable",
                time: new Date,
                fileName: e
            };
            this.eventDispatchMgr(t, i)
        }
        ,
        this.createRecordedStreamsAvailableEvent = function(e, t, i) {
            var n = "recordedStreamsAvailable"
              , s = {
                eventType: "recordedStreamsAvailable",
                time: new Date,
                confId: e,
                userId1: t,
                userId2: i
            };
            this.eventDispatchMgr(n, s)
        }
        ,
        this.createMCURecordedStreamsAvailableEvent = function(e, t, i, n) {
            var s = "MCURecordedStreamsAvailable"
              , a = {
                eventType: "MCURecordedStreamsAvailable",
                time: new Date,
                roomName: e,
                callId: t,
                clientId: i,
                recordedFileName: n
            };
            this.eventDispatchMgr(s, a)
        }
        ,
        this.createMCURecordingStartedEvent = function(e, t, i) {
            var n = "MCURecordingStarted"
              , s = {
                eventType: "MCURecordingStarted",
                time: new Date,
                roomName: e,
                callId: t,
                clientId: i
            };
            this.eventDispatchMgr(n, s)
        }
        ,
        this.createStopRecordEvent = function() {
            var e = "stopRecord"
              , t = {
                eventType: "stopRecord",
                time: new Date
            };
            this.eventDispatchMgr(e, t)
        }
        ,
        this.createSnapShotPhotoUploaded = function(e) {
            var t = "snapShotPhotoUploaded"
              , i = {
                eventType: "snapShotPhotoUploaded",
                time: new Date,
                fileName: e
            };
            this.eventDispatchMgr(t, i)
        }
        ,
        this.createRoomCreationEvent = function(e, t, i) {
            var n = "roomCreation"
              , s = {
                eventType: "roomCreation",
                time: new Date,
                status: e,
                roomId: t,
                roomType: i
            };
            this.eventDispatchMgr(n, s)
        }
        ,
        this.createRoomInvitationEvent = function(e, t, i, n, s, a) {
            var o = "roomInvitation"
              , l = {
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
        }
        ,
        this.createRoomMemberUpdateEvent = function(e, t, i, n) {
            var s = "roomMemberUpdate"
              , a = {
                eventType: "roomMemberUpdate",
                time: new Date,
                roomId: e,
                contactList: t,
                status: i,
                roomType: n
            };
            this.eventDispatchMgr(s, a)
        }
        ,
        this.createContactListInRoomEvent = function(e, t, i) {
            var n = "contactListInRoom"
              , s = {
                eventType: "contactListInRoom",
                time: new Date,
                roomId: e,
                contactList: t,
                roomType: i
            };
            this.eventDispatchMgr(n, s)
        }
        ,
        this.createReceiveRoomMessageEvent = function(e, t, i, n, s) {
            var a = "receiveRoomMessage"
              , o = {
                eventType: "receiveRoomMessage",
                time: new Date,
                roomId: e,
                senderId: t,
                senderNickname: i,
                message: n,
                roomType: s
            };
            this.eventDispatchMgr(a, o)
        }
        ,
        this.createDesktopCaptureEvent = function(e, t, i) {
            var n = "desktopCapture"
              , s = {
                eventType: "desktopCapture",
                time: new Date,
                event: e,
                callId: t,
                remoteId: i
            };
            this.eventDispatchMgr(n, s)
        }
        ,
        this.createSwitchStreamEvent = function(e, t) {
            var i = "switchStream"
              , n = {
                eventType: "switchStream",
                time: new Date,
                callId: e,
                stream: t
            };
            this.eventDispatchMgr(i, n)
        }
        ,
        this.createConnectedUsersListUpdateEvent = function(e, t, i) {
            var n = "connectedUsersListUpdate"
              , s = {
                eventType: "ConnectedUsersListUpdate",
                time: new Date,
                group: e,
                usersList: t,
                status: i
            };
            this.eventDispatchMgr(n, s)
        }
        ,
        this.createClosingWhiteBoardEvent = function(e, t) {
            var i = "closingWhiteBoard"
              , n = {
                eventType: "closingWhiteBoard",
                time: new Date,
                roomId: e,
                reason: t
            };
            this.eventDispatchMgr(i, n)
        }
        ,
        this.createEvent = function(e) {
            if (!e.eventType)
                throw new Error("The event json must have an eventType" + e);
            e.time = new Date,
            this.eventDispatchMgr(e.eventType, e)
        }
    }
    ,
    c = new r,
    d = {
        version: "3.6.9",
        description: "Apizee Cloud Communication Library",
        session: null,
        jsLoaded: !1,
        initApiKey: null,
        initApiCCId: null,
        bandwidthTestServer: "https://ccs3.apizee.com:3333",
        bandwidthRatingThresholds: [40, 300, 500, 700, 1500]
    },
    d.init = function(i) {
        var n = "";
        if (n = "https:" != e.location.protocol ? "http" : "https",
        "iOS" === D.name && (n = "https"),
        i.ccsServer === t && (i.ccsServer = "https:" != e.location.protocol && "iOS" !== D.name ? "ccs5.apizee.com:80" : "ccs5.apizee.com:443"),
        i.userData !== t,
        this.jsLoaded === !1)
            if (d.initApiKey = i.apiKey,
            d.initApiCCId = i.apiCCId,
            "function" == typeof define && define.amd) {
                var s = []
                  , a = n + "://" + i.ccsServer + "/socket.io/socket.io"
                  , o = n + "://cloud.apizee.com/apiRTC/lib/RecordRTC"
                  , l = ""
                  , r = {};
                s.push("sio"),
                s.push("recordrtc"),
                r = {
                    sio: a,
                    recordrtc: o
                },
                i.ApiDBActivated !== !1 && i.ApiDBActivated !== t && null !== i.ApiDBActivated && (l = i.ApiDBActivated === !0 ? n + "://cloud.apizee.com/apiRTC-DB/v1.0/apiRTC-DB-1.0.8.min" : n + ":" + i.ApiDBActivated + "apiRTC-DB/v1.0/apiRTC-DB-1.0.8.min",
                s.push("apirtcdb"),
                r.apirtcdb = l),
                require.config({
                    shim: {
                        sio: {
                            exports: "io"
                        }
                    },
                    wrap: !1,
                    paths: r
                }),
                require(s, function(t) {
                    e.rtcio = t,
                    d.jsLoaded = !0,
                    d.session = new d.ApiCCSession(i)
                })
            } else
                $LAB.script(function() {
                    return n + "://" + i.ccsServer + "/socket.io/socket.io.js"
                }).script(function() {
                    return i.ApiDBActivated === !1 || i.ApiDBActivated === t || null === i.ApiDBActivated ? null : i.ApiDBActivated === !0 ? n + "://cloud.apizee.com/apiRTC-DB/v1.0/apiRTC-DB-1.0.8.min.js" : n + ":" + i.ApiDBActivated + "apiRTC-DB/v1.0/apiRTC-DB-1.0.8.min.js"
                }).script(function() {
                    return i.recordActivated === !0 ? n + "://cloud.apizee.com/apiRTC/lib/RecordRTC.js" : null
                }).wait(function() {
                    e.rtcio = io,
                    d.jsLoaded = !0,
                    d.session = new d.ApiCCSession(i)
                });
        else
            i.apiCCId === t && (i.apiCCId = d.session.apiCCId),
            null !== i.userData && i.userData !== t && (d.session.userData = i.userData),
            d.session.reOpenChannel(i.apiCCId, i.apiKey),
            d.session.nickname = null !== i.nickname && i.nickname !== t ? i.nickname : d.session.apiCCId,
            d.session.photoURL = null !== i.photoURL && i.photoURL !== t ? i.photoURL : null,
            d.initApiKey = i.apiKey,
            d.initApiCCId = i.apiCCId
    }
    ,
    d.registerIOsDevice = function(e) {
        var t = {
            type: "registerIOsDevice",
            senderId: d.session.apiCCId,
            token: e
        }
          , i = JSON.stringify(t);
        d.session.channel.socket.emit("registerIOsDevice", i)
    }
    ,
    d.registerAndroidDevice = function(e) {
        var t = {
            type: "registerAndroidDevice",
            senderId: d.session.apiCCId,
            token: e
        }
          , i = JSON.stringify(t);
        d.session.channel.socket.emit("registerAndroidDevice", i)
    }
    ,
    d.unRegisterIOsDevice = function(e) {
        var t = {
            type: "unRegisterIOsDevice",
            senderId: d.session.apiCCId,
            token: e
        }
          , i = JSON.stringify(t);
        d.session.channel.socket.emit("unRegisterIOsDevice", i)
    }
    ,
    d.unRegisterAndroidDevice = function(e) {
        var t = {
            type: "unRegisterAndroidDevice",
            senderId: d.session.apiCCId,
            token: e
        }
          , i = JSON.stringify(t);
        d.session.channel.socket.emit("unRegisterAndroidDevice", i)
    }
    ,
    d.disconnect = function() {
        null !== d.session && d.session !== t && (d.setCookie("apiCCId", d.session.apiCCId, 5e3),
        null !== d.session.sessionId && d.setCookie("sessionId", d.session.sessionId, 5e3),
        null !== d.session.apiCCWhiteBoardClient && null !== d.session.apiCCWhiteBoardClient.roomId && d.session.closeWhiteBoardClient("USER_DISCONNECTION"),
        d.session.channel.socket !== t && null !== d.session.channel.socket && d.session.channel.socket.disconnect(),
        d.session.channel.channelHasBeenDisconnected = !1,
        d.session.connectedUsersList.splice(0, d.session.connectedUsersList.length))
    }
    ,
    d.reconnect = function() {
        d.session.channel.socket.socket.connect()
    }
    ,
    d.cleanApiRTCContext = function() {
        null !== d.session && d.session !== t && (null !== d.session.apiCCWebRTCClient && d.session.apiCCWebRTCClient !== t && (0 !== d.session.apiCCWebRTCClient.webRTCClient.callsTable.length,
        null !== d.session.apiCCWebRTCClient.webRTCClient.MCUClient.sessionMCU,
        d.session.apiCCWebRTCClient.hangUp(),
        null !== d.session.apiCCWebRTCClient.webRTCClient.localStream && d.session.apiCCWebRTCClient.webRTCClient.stopStream(d.session.apiCCWebRTCClient.webRTCClient.localStream),
        d.session.apiCCWebRTCClient = null),
        null !== d.session.apiCCIMClient && d.session.apiCCIMClient !== t && (d.session.apiCCIMClient = null),
        null !== d.session.apiCCDataClient && d.session.apiCCDataClient !== t && (d.session.apiCCDataClient = null),
        null !== d.session.apiCCWhiteBoardClient && d.session.apiCCWhiteBoardClient !== t && (d.session.apiCCWhiteBoardClient = null),
        null !== d.session.apiCCCoBrowsingClient && d.session.apiCCCoBrowsingClient !== t && (d.session.apiCCCoBrowsingClient = null))
    }
    ,
    d.myEventTable = [],
    d.addEventListener = function(e, t) {
        var i = {}
          , n = null
          , s = ["sessionReady", "incomingCall", "callEstablished", "remoteHangup", "userMediaSuccess", "userMediaError", "error", "receiveIMMessage", "updatePresence", "webRTCClientCreated", "updateUserStatus", "channelEvent", "groupChatCreation", "groupChatInvitation", "groupChatMemberUpdate", "addUserInGroupChatAnswer", "receiveGroupChatMessage", "userDataAnswer", "receiveConversationList", "receiveConversationHistory", "receiveConversationDetailReport", "receiveContactOccurrencesFromConversationList", "receiveMCUSessionInvitation", "MCUSessionCreation", "MCUAvailableStream", "MCURemoveStream", "canPlayRemoteVideo", "recordedFileAvailable", "receiveData", "roomCreation", "roomInvitation", "roomMemberUpdate", "receiveRoomMessage", "contactListInRoom", "snapShotPhotoUploaded", "stopRecord", "callAttempt", "joinMCUSessionAnswer", "hangup", "desktopCapture", "remoteStreamAdded", "switchStream", "sendDataChannelOpen", "sendDataChannelClose", "sendDataChannelError", "receiveDataChannelOpen", "receiveDataChannelClose", "receiveDataChannelError", "connectedUsersListUpdate", "onFileSended", "onFileSending", "onFileReceiving", "onFileReceived", "onFileProgress", "recordedStreamsAvailable", "closingWhiteBoard", "webRTCPluginInstallation", "onQosStatsUpdate", "onQosChange", "onQosAudioChange", "onQosVideoChange", "MCURecordedStreamsAvailable", "MCURecordingStarted", "ICECandidateTypeUpdate", "disconnectionWarning"];
        s.indexOf(e) > -1 ? (document.addEventListener && I === !0 ? document.addEventListener(e, t, !1) : "undefined" != typeof $jqApz ? $jqApz(document).on(e, t) : "undefined" != typeof jQuery && jQuery(document).on(e, t),
        i = {
            type: e,
            listener: t
        },
        n = d.myEventTable.push(i),
        i = null,
        n = 0) : c.createErrorEvent("ERROR: Trying to add a listener on an unknow event", "UNKNOWN_EVENT_ON_ADDLISTENER")
    }
    ,
    d.removeEventListener = function(e, t) {
        document.removeEventListener ? document.removeEventListener(e, t, !1) : "undefined" != typeof jQuery && jQuery(document).off(e, t)
    }
    ,
    d.setCookie = function(e, t, i) {
        i = i || 36e5;
        var n = new Date
          , s = new Date;
        s.setTime(n.getTime() + i),
        document.cookie = e + "=" + encodeURIComponent(t) + ";expires=" + s.toGMTString()
    }
    ,
    d.testUserDownload = function(e) {
        var t, i, n, s, a, o, l, r = d.bandwidthTestServer, c = r + "/files/noise_512ko.jpg", h = 526120, u = new Image, C = 0;
        c += "?nnn=" + Date.now(),
        u.onload = function() {
            for (i = (new Date).getTime(),
            n = i - t,
            s = h / (n / 1e3),
            a = Math.round(s / 1e3),
            l = {
                type: "download",
                kBPerSec: a
            },
            o = 0; o < d.bandwidthRatingThresholds.length; o++)
                8 * l.kBPerSec >= d.bandwidthRatingThresholds[o] && C++;
            l.rating = C + "/" + d.bandwidthRatingThresholds.length,
            e(null, l)
        }
        ,
        u.onerror = function(t, i) {
            e({
                label: "Error when downloading",
                err: t,
                msg: i
            }, null)
        }
        ,
        t = (new Date).getTime(),
        u.src = c
    }
    ,
    d.testUserUpload = function(e, t) {
        var i, n, s, a = d.bandwidthTestServer + "/upload-test", o = new XMLHttpRequest, l = new FormData, r = "", c = 0;
        "withCredentials"in o ? o.open("POST", a, !0) : "undefined" != typeof XDomainRequest ? (o = new XDomainRequest,
        o.open("POST", a)) : o = null;
        for (n = 0; e > n; n++)
            r += Math.round(5 * Math.random());
        i = new Blob([r],{
            type: "text/xml"
        }),
        l.append("file", i),
        o ? (o.onload = function() {
            if (200 === o.status) {
                for (s = JSON.parse(this.responseText),
                delete s.fileSize,
                delete s.totalTime,
                n = 0; n < d.bandwidthRatingThresholds.length; n++)
                    8 * s.kBPerSec >= d.bandwidthRatingThresholds[n] && c++;
                s.rating = c + "/" + d.bandwidthRatingThresholds.length,
                t(null, s)
            } else
                t({
                    err: "An error occured during XMLHttpRequest",
                    msg: o.status
                }, null)
        }
        ,
        o.onerror = function(e) {
            t({
                err: "An error occured during XMLHttpRequest",
                msg: e.target.status
            }, null)
        }
        ,
        o.send(l)) : t({
            err: "XMLHttpRequest is not defined",
            msg: "XMLHttpRequest is not defined"
        }, null)
    }
    ,
    d.listenedAudioSources = {},
    d.listenToAudioSources = function(i) {
        var n, s = new e.AudioContext;
        null !== d.session && d.session !== t && navigator.userAgent.toLowerCase().indexOf("chrome") > -1 && null !== d.session.apiCCWebRTCClient && d.session.apiCCWebRTCClient !== t && (Object.keys(d.listenedAudioSources).length > 0 && d.stopAudioSourceListening(),
        d.session.apiCCWebRTCClient.getMediaDevices(function(e) {
            for (n = 0; n < e.length; n++)
                "audioinput" === e[n].kind && (d.listenedAudioSources[e[n].deviceId] = {
                    deviceId: e[n].deviceId,
                    callback: i,
                    label: e[n].label
                },
                navigator.getUserMedia({
                    audio: {
                        optional: [{
                            sourceId: e[n].deviceId
                        }]
                    },
                    video: !1
                }, function(e) {
                    this.device.audioListener = this;
                    var t = this
                      , i = s.createScriptProcessor(2048, 1, 1)
                      , n = s.createMediaStreamSource(e);
                    i.connect(s.destination),
                    i.onaudioprocess = function() {
                        var i, n, s, a = new Uint8Array(this.analyser.frequencyBinCount), o = 0;
                        for (this.analyser.getByteFrequencyData(a),
                        n = 0; n < a.length; n++)
                            o += a[n];
                        i = o / a.length,
                        s = {
                            deviceId: t.device.deviceId,
                            label: t.device.label,
                            amplitude: i,
                            active: e.active
                        },
                        t.device.callback(s)
                    }
                    ,
                    i.analyser = s.createAnalyser(),
                    i.analyser.smoothingTimeConstant = .3,
                    i.analyser.fftSize = 1024,
                    n.connect(i.analyser),
                    i.analyser.connect(i),
                    this.destroy = function() {
                        var t, s = e.getTracks();
                        for (t = 0; t < s.length; t += 1)
                            s[t].stop();
                        n.disconnect(),
                        i.analyser.disconnect(),
                        i.disconnect()
                    }
                }
                .bind({
                    device: d.listenedAudioSources[e[n].deviceId]
                }), function() {}))
        }))
    }
    ,
    d.stopAudioSourceListening = function() {
        var e;
        for (e = 0; e < Object.keys(d.listenedAudioSources).length; e++)
            d.listenedAudioSources[Object.keys(d.listenedAudioSources)[e]].audioListener.destroy();
        d.listenedAudioSources = {}
    }
    ,
    e.onbeforeunload = function() {
        try {
            if ("undefined" != typeof mailClicked && null !== mailClicked && mailClicked === !0)
                return void (mailClicked = !1)
        } catch (e) {}
        null !== d && (d.cleanApiRTCContext(),
        d.disconnect());
        var t = 0
          , i = 0;
        if (null !== d && (t = d.myEventTable.length),
        0 !== t) {
            for (i = 0; t > i; i += 1)
                d.removeEventListener(d.myEventTable[i].type, d.myEventTable[i].listener);
            this.apiCC.myEventTable.splice(0, t),
            t = d.myEventTable.length,
            d.myEventTable = null
        }
        null !== d && (d.session = null),
        r = null,
        c = null,
        h = null,
        u = null,
        C = null,
        p = null,
        m = null,
        null !== d && (d.ApiCCSession = null,
        d.ApiCCIMClient = null,
        d = null)
    }
    ,
    h = function(i) {
        this.channelReady = !1,
        this.socket = null,
        this.channelId = i.apiCCId,
        this.callURLDestRoom = 0,
        this.myWebRTC_Event = new r,
        this.channelHasBeenDisconnected = !1,
        this.cSeq = 0,
        this.socketio_1X = !1,
        this.initialize = function() {
            this.openChannel()
        }
        ,
        this.getNewCSeq = function() {
            return this.cSeq = this.cSeq + 1,
            this.cSeq
        }
        ,
        this.openChannel = function() {
            var n = ""
              , s = null
              , a = null
              , o = null
              , l = null
              , r = null
              , c = null
              , h = null
              , u = null
              , C = null
              , p = null
              , m = "80"
              , v = ""
              , g = null;
            i.xhrPolling = !0,
            h = i.appId !== t ? "&appId=" + i.appId : "",
            u = i.siteId !== t ? "&siteId=" + i.siteId : "",
            i.userData !== t && (s = JSON.stringify(i.userData),
            s.length <= 500 && (a = encodeURIComponent(s),
            n = "&userData=" + a)),
            i.presenceGroup !== t && (o = JSON.stringify(i.presenceGroup),
            o.length <= 500 && (l = encodeURIComponent(o),
            n += "&presenceGroup=" + l)),
            i.subscribeToPresenceGroup !== t && (r = JSON.stringify(i.subscribeToPresenceGroup),
            r.length <= 500 && (c = encodeURIComponent(r),
            n += "&subscribeToPresenceGroup=" + c)),
            i.token !== t && (n += "&token=" + i.token),
            -1 !== i.ccsServer.indexOf(":") ? (g = i.ccsServer.split(":"),
            v = g[0],
            m = g[1]) : (v = i.ccsServer,
            m = "https:" == e.location.protocol || "iOS" === D.name ? "443" : "80"),
            "ccs2.apizee.com" !== v ? (this.socketio_1X = !0,
            C = "?channelId=" + this.channelId + "&apiKey=" + i.apiKey + "&apiVersion=" + d.version + "&sessionId=" + i.sessionId + h + u + n,
            p = null,
            p = "https:" == e.location.protocol ? "https" : "http",
            "iOS" === D.name && (p = "https"),
            this.socket = rtcio.connect(p + "://" + i.ccsServer + "/" + C, {
                forceNew: !0,
                multiplex: !1
            })) : this.socket = i.xhrPolling === !0 ? "https:" != e.location.protocol && "iOS" !== D.name ? rtcio.connect("http://" + i.ccsServer + "/?channelId=" + this.channelId + "&apiKey=" + i.apiKey + "&apiVersion=" + d.version + "&sessionId=" + i.sessionId + h + u + n, {
                transports: ["xhr-polling"],
                "force new connection": !0,
                port: m
            }) : rtcio.connect("https://" + i.ccsServer + "/?channelId=" + this.channelId + "&apiKey=" + i.apiKey + "&apiVersion=" + d.version + "&sessionId=" + i.sessionId + h + u + n, {
                transports: ["xhr-polling"],
                "force new connection": !0,
                secure: !0,
                port: m
            }) : "https:" != e.location.protocol && "iOS" !== D.name ? rtcio.connect("http://" + i.ccsServer + "/?channelId=" + this.channelId + "&apiKey=" + i.apiKey + "&apiVersion=" + d.version + "&sessionId=" + i.sessionId + n, {
                "force new connection": !0
            }) : rtcio.connect("https://" + i.ccsServer + "/?channelId=" + this.channelId + "&apiKey=" + i.apiKey + "&apiVersion=" + d.version + "&sessionId=" + i.sessionId + n, {
                "force new connection": !0,
                secure: !0,
                port: m
            }),
            this.socket.on("connect", this.callback(this, "onChannelOpened")).on("message", this.callbackWithParams(this, "onChannelMessage")).on("error", this.callback(this, "onChannelError")).on("bye", this.callback(this, "onChannelBye")).on("close", this.callback(this, "onChannelClosed")).on("connecting", this.callback(this, "onChannelConnecting")).on("disconnect", this.callback(this, "onChannelDisconnect")).on("connect_failed", this.callback(this, "onChannelConnect_failed")).on("reconnect_failed", this.callback(this, "onChannelReconnect_failed")).on("reconnect", this.callback(this, "onChannelReconnect")).on("reconnecting", this.callback(this, "onChannelReconnecting"))
        }
        ,
        this.onChannelConnecting = function() {
            this.myWebRTC_Event.createChannelEvent("onChannelConnecting")
        }
        ,
        this.onWhiteBoardDisconnection = function() {
            d.session.closeWhiteBoardClient("NETWORK_DISCONNECTION")
        }
        ,
        this.onChannelDisconnect = function() {
            var e = Date();
            e = null,
            d.session.connectedUsersList.splice(0, d.session.connectedUsersList.length),
            this.myWebRTC_Event.createChannelEvent("onChannelDisconnect"),
            this.channelHasBeenDisconnected = !0,
            null !== d.session.apiCCWhiteBoardClient && null !== d.session.apiCCWhiteBoardClient.roomId && (d.session.apiCCWhiteBoardClient.whiteBoardDisconnectionTimeoutId = setTimeout(this.callback(this, "onWhiteBoardDisconnection"), d.session.apiCCWhiteBoardClient.disconnectionTimer))
        }
        ,
        this.onChannelConnect_failed = function() {
            this.myWebRTC_Event.createChannelEvent("onChannelConnect_failed")
        }
        ,
        this.onChannelReconnect_failed = function() {
            this.myWebRTC_Event.createChannelEvent("onChannelReconnect_failed")
        }
        ,
        this.onChannelReconnect = function() {
            var e = null
              , i = 0
              , n = 0
              , s = []
              , a = null
              , o = null
              , l = null
              , r = !1
              , c = 0
              , h = 0
              , u = null
              , C = "undefined";
            if (null !== d.session.apiCCIMClient && d.session.apiCCIMClient.userDataSetted === !0 && (e = {
                photoURL: d.session.apiCCIMClient.photoURL
            },
            d.session.apiCCIMClient.setUserData(e)),
            null !== d.session.apiCCWebRTCClient) {
                if (i = d.session.apiCCWebRTCClient.webRTCClient.callsTable.length,
                0 !== i) {
                    for (n = 0; i > n; n += 1)
                        null !== d.session.apiCCWebRTCClient.webRTCClient.callsTable[n] && d.session.apiCCWebRTCClient.webRTCClient.callsTable[n] !== t && (h = d.session.apiCCWebRTCClient.webRTCClient.callsTable[n].callId,
                        u = d.session.apiCCWebRTCClient.webRTCClient.callsTable[n],
                        null !== u.data ? "publish" !== u.data.type && "subscribe" !== u.data.type && (u.updateMedia(!0),
                        a = {
                            destId: d.session.apiCCWebRTCClient.webRTCClient.callsTable[n].remoteId,
                            convId: d.session.apiCCWebRTCClient.webRTCClient.callsTable[n].callId,
                            callType: d.session.apiCCWebRTCClient.webRTCClient.callsTable[n].callType,
                            roomId: d.session.apiCCWebRTCClient.webRTCClient.callsTable[n].dest_roomId
                        },
                        s.push(a)) : (u.updateMedia(!0),
                        a = {
                            destId: d.session.apiCCWebRTCClient.webRTCClient.callsTable[n].remoteId,
                            convId: d.session.apiCCWebRTCClient.webRTCClient.callsTable[n].callId,
                            callType: d.session.apiCCWebRTCClient.webRTCClient.callsTable[n].callType,
                            roomId: d.session.apiCCWebRTCClient.webRTCClient.callsTable[n].dest_roomId
                        },
                        s.push(a)));
                    r = !0
                }
                null !== d.session.apiCCWebRTCClient.webRTCClient && null !== d.session.apiCCWebRTCClient.webRTCClient.MCUClient && null !== d.session.apiCCWebRTCClient.webRTCClient.MCUClient.sessionMCU && (C = d.session.apiCCWebRTCClient.webRTCClient.MCUClient.sessionMCU.roomName,
                d.session.apiCCWebRTCClient.leaveMCUSession(),
                d.session.apiCCWebRTCClient.joinMCUSession(C))
            }
            null !== d.session.apiCCWhiteBoardClient && (0 !== d.session.apiCCWhiteBoardClient.whiteBoardDisconnectionTimeoutId && (clearTimeout(d.session.apiCCWhiteBoardClient.whiteBoardDisconnectionTimeoutId),
            d.session.apiCCWhiteBoardClient.whiteBoardDisconnectionTimeoutId = 0),
            null !== d.session.apiCCWhiteBoardClient.roomId && (c = d.session.apiCCWhiteBoardClient.roomId,
            r = !0)),
            r === !0 && (o = {
                type: "reconnectContext",
                callList: s,
                whiteBoardRoomId: c
            },
            l = JSON.stringify(o),
            d.session.channel.socket.emit("reconnectContext", l)),
            s.splice(0, s.length),
            this.myWebRTC_Event.createChannelEvent("onChannelReconnect")
        }
        ,
        this.onChannelReconnecting = function() {
            var e = Date();
            e = null,
            this.myWebRTC_Event.createChannelEvent("onChannelReconnecting")
        }
        ,
        this.onChannelOpened = function() {
            this.channelReady = !0,
            this.channelHasBeenDisconnected === !1 ? i.onChannelOpened() : (this.channelHasBeenDisconnected = !1,
            i.ApiDBActivated !== !1 && i.ApiDBActivated !== t && null !== i.ApiDBActivated && apiDB.init(i.channel.socket),
            this.socketio_1X === !0 && (i.updateUserDataToBeDone = !0)),
            this.myWebRTC_Event.createChannelEvent("onChannelOpened")
        }
        ,
        this.onChannelMessage = function(e, n) {
            var s = JSON.parse(e)
              , a = null;
            "IMMessage" === s.type && (a = s.IMId),
            n !== t && n({
                reason: "ack",
                convId: a
            }),
            i.processSignalingMessage(s)
        }
        ,
        this.onChannelError = function() {
            this.myWebRTC_Event.createChannelEvent("onChannelError")
        }
        ,
        this.onChannelClosed = function() {
            this.myWebRTC_Event.createChannelEvent("onChannelClosed")
        }
        ,
        this.onChannelBye = function(e) {
            var t = JSON.parse(e);
            t = null
        }
        ,
        this.callback = function(e, t) {
            return this.closureHandler = function(i) {
                return e[t](i)
            }
            ,
            this.closureHandler
        }
        ,
        this.callbackWithParams = function(e, t) {
            return this.closureHandler = function(i, n, s) {
                return e[t](i, n, s)
            }
            ,
            this.closureHandler
        }
    }
    ,
    u = function(e) {
        this.sendInvite = function(i, n, s, a, o, l, r, c, d) {
            var h = null
              , u = null
              , C = null;
            (r === t || null === r) && (r = "media"),
            null === d && (d = t),
            ("IE" === g || "Safari" === g) && (C = {},
            C.sdp = l.sdp,
            C.type = l.type,
            l = C),
            h = null !== c ? {
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
            },
            u = JSON.stringify(h),
            e.emit("invite", u)
        }
        ,
        this.sendInviteBroadcast = function(t, i, n, s, a, o) {
            var l = null
              , r = null;
            l = {
                type: "invite",
                callId: t,
                callerId: i,
                callerNickname: n,
                calleeId: s,
                roomId: a,
                sdpoffer: o
            },
            r = JSON.stringify(l),
            e.emit("invite_broadcast", r)
        }
        ,
        this.send200OK = function(t, i, n, s, a, o, l) {
            var r = null
              , c = null
              , d = null;
            ("IE" === g || "Safari" === g) && (d = {},
            d.sdp = o.sdp,
            d.type = o.type,
            o = d),
            r = {
                type: "200OK",
                callId: t,
                callerId: i,
                calleeId: n,
                calleeNickname: s,
                roomId: a,
                sdpanswer: o,
                data: l
            },
            c = JSON.stringify(r),
            e.emit("200OK", c)
        }
        ,
        this.sendCandidate = function(t, i, n, s, a, o, l, r, c, d) {
            var h = null
              , u = null;
            h = null !== c && "IE" !== g ? {
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
            },
            u = JSON.stringify(h),
            e.emit("candidate", u)
        }
        ,
        this.sendBye = function(t, i, n, s, a, o) {
            var l = null
              , r = null;
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
            },
            r = JSON.stringify(l),
            e.emit("bye", r)
        }
        ,
        this.sendUpdate = function(t, i, n, s, a, o, l) {
            var r = null
              , c = null;
            r = null !== l ? {
                type: "update",
                callId: t,
                callerId: i,
                calleeId: n,
                roomId: s,
                dst: a,
                sdpoffer: o,
                data: l
            } : {
                type: "update",
                callId: t,
                callerId: i,
                calleeId: n,
                roomId: s,
                dst: a,
                sdpoffer: o
            },
            c = JSON.stringify(r),
            e.emit("update", c)
        }
        ,
        this.send200Update = function(t, i, n, s, a, o, l) {
            var r = null
              , c = null;
            r = null !== l ? {
                type: "200update",
                callId: t,
                callerId: i,
                calleeId: n,
                roomId: s,
                dst: a,
                sdpanswer: o,
                data: l
            } : {
                type: "200update",
                callId: t,
                callerId: i,
                calleeId: n,
                roomId: s,
                dst: a,
                sdpanswer: o
            },
            c = JSON.stringify(r),
            e.emit("200update", c)
        }
        ,
        this.sendDebugCommand = function(t, i, n) {
            var s = null
              , a = null;
            s = {
                type: "debugCommand",
                command: t,
                apiKey: i,
                clientId: n
            },
            a = JSON.stringify(s),
            e.emit("debugCommand", a)
        }
        ,
        this.sendAck = function(t, i, n) {
            var s = null
              , a = null;
            s = {
                type: "Ack",
                AckMessageType: t,
                cSeq: i,
                dst: n
            },
            a = JSON.stringify(s),
            e.emit("Ack", a)
        }
    }
    ,
    C = function() {
        this.webrtcDetectedBrowser = adapter.browserDetails.browser,
        this.webrtcDetectedVersion = adapter.browserDetails.version,
        "undefined" != typeof RTCSessionDescription && (this.RTCSessionDescription = RTCSessionDescription),
        "undefined" != typeof RTCIceCandidate && (this.RTCIceCandidate = RTCIceCandidate),
        "iOS" === D.name ? (this.RTCPeerConnection = e.RTCPeerConnection,
        this.getUserMedia = navigator.getUserMedia,
        this.attachMediaStream = function(e, t) {
            "undefined" != typeof e.srcObject ? e.srcObject = t : "undefined" != typeof e.mozSrcObject ? e.mozSrcObject = t : "undefined" != typeof e.src && (e.src = URL.createObjectURL(t))
        }
        ) : ("undefined" != typeof RTCPeerConnection && (this.RTCPeerConnection = RTCPeerConnection),
        "undefined" != typeof navigator.getUserMedia ? this.getUserMedia = navigator.getUserMedia : "undefined" != typeof getUserMedia && (this.getUserMedia = getUserMedia),
        "undefined" != typeof adapter.browserShim && "undefined" != typeof adapter.browserShim.attachMediaStream && (this.attachMediaStream = adapter.browserShim.attachMediaStream))
    }
    ,
    T = function(e, i) {
        this.pubConnector = "licodeConnector",
        this.sessionMCU = null,
        this.streamList = [],
        this.publishCallId = null,
        this.receiveSessionId = function(e) {
            c.createMCUSessionCreationEvent(e.sessionId, e.token),
            this.publish(e.sessionId, e.token)
        }
        ,
        this.sendSessionInvitation = function(e, n, s) {
            if (null !== n && n !== t) {
                var a = null
                  , o = null;
                s === t && (s = 0),
                a = {
                    type: "MCUSessionInvitation",
                    srcId: i,
                    destId: e,
                    sessionId: n,
                    groupChatId: s
                },
                o = JSON.stringify(a),
                d.session.channel.socket.emit("MCUSessionInvitation", o)
            }
        }
        ,
        this.sendSessionInvitationToGroupChat = function(e, n) {
            if (null !== e && e !== t && null !== n && n !== t) {
                var s = null
                  , a = null;
                s = {
                    type: "MCUSessionInvitationToGroupChat",
                    srcId: i,
                    groupChatId: e,
                    sessionId: n
                },
                a = JSON.stringify(s),
                d.session.channel.socket.emit("MCUSessionInvitationToGroupChat", a)
            }
        }
        ,
        this.receiveSessionInvitation = function(e) {
            c.createReceiveMCUSessionInvitationEvent(e.sessionId, e.token, e.groupChatId, e.srcId)
        }
        ,
        this.acceptSessionInvitation = function(e, t) {
            this.publish(e, t)
        }
        ,
        this.leaveSession = function() {
            var e = []
              , t = null
              , i = null;
            null !== this.sessionMCU && (d.session.apiCCWebRTCClient.webRTCClient.onHangup(),
            e.push(this.sessionMCU.roomName),
            d.session.sendPresenceGroupManagementCommand("leave", e),
            d.session.sendPresenceGroupManagementCommand("unsubscribe", e),
            t = {
                type: "leaveSession",
                roomId: this.sessionMCU.roomName,
                callerId: d.session.apiCCWebRTCClient.webRTCClient.clientId,
                data: {
                    pubSub: this.pubConnector
                }
            },
            i = JSON.stringify(t),
            d.session.channel.socket.emit("leaveSession", i),
            this.sessionMCU = null)
        }
        ,
        this.joinSession = function(e) {
            var t = null
              , i = null;
            t = {
                type: "joinSession",
                roomId: e,
                callerId: d.session.apiCCWebRTCClient.webRTCClient.clientId,
                data: {
                    pubSub: this.pubConnector
                }
            },
            i = JSON.stringify(t),
            d.session.channel.socket.emit("joinSession", i)
        }
        ,
        this.joinSessionAnswer = function(e) {
            this.sessionMCU = {},
            this.sessionMCU.roomID = e.sessionId,
            this.sessionMCU.roomName = e.roomName;
            var t = [];
            t.push(e.roomName),
            d.session.sendPresenceGroupManagementCommand("join", t),
            d.session.sendPresenceGroupManagementCommand("subscribe", t),
            c.createJoinMCUSessionAnswerEvent(e.sessionId, e.token, e.groupChatId, e.initiator)
        }
        ,
        this.getStreamList = function() {
            return this.streamList
        }
        ,
        this.getStreamFromList = function(e) {
            var t = 0;
            for (t = 0; t < this.streamList.length; t += 1)
                if (this.streamList[t].streamInfo.id === e)
                    return this.streamList[t].streamInfo;
            return null
        }
        ,
        this.getStreamIdOfUser = function(e) {
            var t = 0;
            for (t = 0; t < this.streamList.length; t += 1)
                if (this.streamList[t].userId === e)
                    return this.streamList[t].streamInfo.id;
            return null
        }
        ,
        this.newAvailableStream = function(e) {
            var t = !1
              , n = 0
              , s = null;
            for (t = e[0].attributes.callerId === i ? !1 : !0,
            n = 0; n < e.length; n += 1)
                s = {
                    userId: e[n].attributes.callerId,
                    roomId: this.sessionMCU.roomID,
                    isRemoteStream: t,
                    streamInfo: e[n]
                },
                this.streamList.push(s);
            c.createMCUAvailableStreamEvent(e, t)
        }
        ,
        this.subscribeToStreams = function(e, i) {
            var n, s, a = [], o = null;
            for (s in e)
                n = e[s],
                a[s] = new p(d.session.apiCCWebRTCClient.webRTCClient),
                o = a[s],
                o.data.pubSub = this.pubConnector,
                o.data.type = "subscribe",
                ("audio" == n.attributes.callType || i === !0) && (o.audioOnly = !0,
                o.stripVideoSDPActivated = !0),
                o.mcuRemoteStream = n,
                o.dest_roomId = this.sessionMCU.roomName,
                o.calleeId = this.sessionMCU.roomName,
                o.generateCallId(),
                o.callerId = d.session.apiCCWebRTCClient.webRTCClient.clientId,
                d.session.apiCCWebRTCClient.webRTCClient.callsTable.push(o),
                o.createPeerConnection(!0),
                o.doCall(),
                o.started = !0,
                o.callType = n.attributes.callType,
                o.remoteId = n.attributes.callerId,
                o.remoteMailAddress = n.attributes.mailAddress,
                n.id === t && alert("stream.id is undefined :", n),
                o.streamId = n.id
        }
        ,
        this.unsubscribe = function(e) {
            var i = d.session.apiCCWebRTCClient.webRTCClient.findCallWithStreamId(e);
            null === i || i.callId !== t && d.session.apiCCWebRTCClient.webRTCClient.onHangup(i.callId)
        }
        ,
        this.publish = function(t, i, n, s) {
            var a = d.session.apiCCWebRTCClient.webRTCClient.callsTable.length
              , o = new p(d.session.apiCCWebRTCClient.webRTCClient);
            return (1 == s || "true" == s) && (o.audioOnly = !0,
            o.stripVideoSDPActivated = !0),
            o.dest_roomId = this.sessionMCU.roomName,
            o.calleeId = this.sessionMCU.roomName,
            o.data.pubSub = this.pubConnector,
            o.data.type = "publish",
            o.mediaConstraints = "firefox" === d.session.apiCCWebRTCClient.webRTCClient.myWebRTC_Adapter.webrtcDetectedBrowser && d.session.apiCCWebRTCClient.webRTCClient.myWebRTC_Adapter.webrtcDetectedVersion > 43 ? {
                offerToReceiveAudio: !1,
                offerToReceiveVideo: !1
            } : {
                mandatory: {
                    OfferToReceiveAudio: !1,
                    OfferToReceiveVideo: !1
                }
            },
            o.generateCallId(),
            o.callerId = d.session.apiCCWebRTCClient.webRTCClient.clientId,
            null !== e.localStream ? (0 === e.localStream.getVideoTracks().length && (o.audioOnly = !0),
            o.onUserMediaSuccessOnCall(e.localStream),
            o.establishCall()) : o.getUserMediaOnCall(),
            a = d.session.apiCCWebRTCClient.webRTCClient.callsTable.push(o),
            this.publishCallId = o.callId,
            o.callId
        }
        ,
        this.publishScreen = function() {
            var e = {};
            e.pubSub = this.pubConnector,
            e.type = "publish",
            d.session.apiCCWebRTCClient.webRTCClient.shareScreen(this.sessionMCU.roomID, e)
        }
        ,
        this.unpublish = function(e) {
            d.session.apiCCWebRTCClient.webRTCClient.onHangup(e),
            this.publishCallId = null
        }
        ,
        this.removeMCUStream = function(e, i) {
            var n = 0;
            for (n = 0; n < this.streamList.length; n += 1)
                if (this.streamList[n].streamInfo.id === i) {
                    this.streamList.splice(n, 1);
                    break
                }
            e !== t && d.session.apiCCWebRTCClient.webRTCClient.onHangup(e),
            c.createMCURemovedStreamEvent(i)
        }
        ,
        this.startRecording = function(e, t) {
            var i = null
              , n = null;
            null !== this.publishCallId && ("AUDIO-ONLY" !== e && "VIDEO-ONLY" !== e && (e = "AUDIO-VIDEO"),
            i = {
                type: "startRecording",
                roomId: this.sessionMCU.roomID,
                callerId: d.session.apiCCWebRTCClient.webRTCClient.clientId,
                callId: this.publishCallId,
                data: {
                    pubSub: this.pubConnector
                },
                customIdInFilename: t,
                mediaType: e
            },
            n = JSON.stringify(i),
            d.session.channel.socket.emit("startRecording", n))
        }
        ,
        this.stopRecording = function() {
            var e = null
              , t = null;
            null !== this.publishCallId && (e = {
                type: "stopRecording",
                roomId: this.sessionMCU.roomID,
                callerId: d.session.apiCCWebRTCClient.webRTCClient.clientId,
                callId: this.publishCallId,
                data: {
                    pubSub: this.pubConnector
                }
            },
            t = JSON.stringify(e),
            d.session.channel.socket.emit("stopRecording", t))
        }
        ,
        this.recordingStarted = function(e) {
            c.createMCURecordingStartedEvent(e.roomName, e.callId, e.clientId)
        }
        ,
        this.recordingStreamAvailable = function(e) {
            c.createMCURecordedStreamsAvailableEvent(e.roomName, e.callId, e.clientId, e.recordedFileName)
        }
        ,
        this.callback = function(e, t) {
            return this.closureHandler = function(i) {
                return e[t](i)
            }
            ,
            this.closureHandler
        }
    }
    ,
    v = function() {
        this.getSDPLines = function(e) {
            var t = e.split("\r\n")
              , i = 0;
            for (i = 0; i < t.length; i += 1)
                ;
            return t
        }
        ,
        this.getAudioMediaDescriptionPart = function(e) {
            var i = e.split("m=audio")
              , n = null;
            return i[1] !== t && null !== i[1] ? (n = i[1].split("m=video"),
            n[0]) : null
        }
        ,
        this.getVideoMediaDescriptionPart = function(e) {
            var t = e.split("m=video")
              , i = 0;
            for (i = 0; i < t.length; i += 1)
                ;
            return t[1]
        }
        ,
        this.searchMediaDescriptionForRecvOnly = function(e) {
            return -1 !== e.search("a=recvonly") ? !0 : !1
        }
        ,
        this.searchSDPForRecvOnly = function(e) {
            return e !== t ? this.searchMediaDescriptionForRecvOnly(e) : !1
        }
        ,
        this.searchMediaDescriptionForInactive = function(e) {
            return -1 !== e.search("a=inactive") ? !0 : !1
        }
        ,
        this.searchSDPForInactive = function(e) {
            return e !== t ? this.searchMediaDescriptionForInactive(e) : !1
        }
        ,
        this.stripVideoMediaDescriptionFromSDP = function(e) {
            e = e.replace("a=group:BUNDLE audio video", "a=group:BUNDLE audio");
            var t = e.split("m=video")
              , i = 0;
            for (i = 0; i < t.length; i += 1)
                ;
            return t[0]
        }
        ,
        this.setAudioBandwidth = function(e, t) {
            return t ? e = e.replace(/a=mid:audio\r\n/g, "a=mid:audio\r\nb=AS:" + t + "\r\n") : e
        }
        ,
        this.setVideoBandwidth = function(e, t) {
            return t ? e = e.replace(/a=mid:video\r\n/g, "a=mid:video\r\nb=AS:" + t + "\r\n") : e
        }
        ,
        this.setDataBandwidth = function(e, t) {
            return t ? e = e.replace(/a=mid:data\r\n/g, "a=mid:data\r\nb=AS:" + t + "\r\n") : e
        }
        ,
        this.setSendOnlyForAudio = function(e) {
            return e = e.replace(/a=sendrecv\r\n/, "a=sendonly\r\n")
        }
        ,
        this.setSendOnlyForVideo = function(e) {
            var t = 0;
            return e = e.replace(/a=sendrecv\r\n/g, function(e) {
                return t++,
                2 === t ? "a=sendonly\r\n" : e
            })
        }
        ,
        this.setSendOnly = function(e) {
            return e = e.replace(/a=sendrecv\r\n/g, "a=sendonly\r\n")
        }
        ,
        this.setRecvOnlyForAudio = function(e) {
            return e = e.replace(/a=sendrecv\r\n/, "a=recvonly\r\n"),
            e = e.replace(/a=sendonly\r\n/, "a=recvonly\r\n")
        }
        ,
        this.setRecvOnlyForVideo = function(e) {
            var t = 0;
            return e = e.replace(/a=sendrecv\r\n/g, function(e) {
                return t++,
                2 === t ? "a=recvonly\r\n" : e
            }),
            t = 0,
            e = e.replace(/a=sendonly\r\n/g, function(e) {
                return t++,
                2 === t ? "a=recvonly\r\n" : e
            })
        }
        ,
        this.setRecvOnly = function(e) {
            return e = e.replace(/a=sendrecv\r\n/g, "a=recvonly\r\n"),
            e = e.replace(/a=sendonly\r\n/g, "a=recvonly\r\n")
        }
        ,
        this.updateSDPcodecs = function(t, i, n, s) {
            var a, o, l, r, c, d, h, u, C = !1, p = new RegExp("\r\n$"), m = !1, v = null, g = null, f = "", T = "", I = "", b = "", y = "", R = "", S = "", w = "";
            if ("" == s)
                return t;
            for (l = RTCSessionDescription && t instanceof RTCSessionDescription ? t.sdp : e.SessionDescription && t instanceof SessionDescription ? t.toSdp() : t,
            l = l.split("\r\nm="),
            p.test(l[l.length - 2]) === !1 && (l[l.length - 2] = l[l.length - 2] + "\r\n",
            m = !0),
            a = 0; a < l.length; a++)
                if (0 == l[a].indexOf(n)) {
                    for (v = l[a].split("\r\n"),
                    g = v[0].split(" "),
                    o = 3; o < g.length; o++)
                        if (r = !0,
                        0 == isNaN(g[o])) {
                            switch (f = "",
                            T = "a=rtpmap:" + g[o] + " ",
                            c = l[a].indexOf(T),
                            -1 != c && (d = l[a].indexOf("\r\n", c)),
                            g[o]) {
                            case 0:
                                f = "PCMU/8000";
                                break;
                            case 8:
                                f = "PCMA/8000";
                                break;
                            case 9:
                                f = "G722/8000";
                                break;
                            case 13:
                                f = "CN/8000";
                                break;
                            case 18:
                                f = "G729/8000";
                                break;
                            default:
                                f = -1 != c ? l[a].substring(c + T.length, d) : ""
                            }
                            "" != f && -1 != s.indexOf(f) || (r = !1),
                            r || (I = T + ".*\r\n",
                            b = "a=fmtp:" + g[o] + " .*\r\n",
                            y = " " + g[o] + " ",
                            R = " " + g[o] + "\r",
                            l[a] = l[a].replace(new RegExp(I,"g"), ""),
                            l[a] = l[a].replace(new RegExp(b,"g"), ""),
                            h = l[a].split("\n"),
                            u = h[0].split("RTP"),
                            u[1] = u[1].replace(y, " "),
                            u[1] = u[1].replace(R, "\r"),
                            h[0] = u.join("RTP"),
                            l[a] = h.join("\n"),
                            "video" == n && (S = "a=rtcp-fb:" + g[o] + " .*\r\n",
                            l[a] = l[a].replace(new RegExp(S,"g"), ""),
                            "" != f && "rtx/" == f.substr(0, 4) && (w = "a=ssrc-group:FID .*\r\n",
                            l[a] = l[a].replace(new RegExp(w,"g"), ""),
                            h = l[a].split("\r\na="),
                            h.splice(h.length - 8, 4),
                            l[a] = h.join("\r\na="))),
                            C = !0)
                        }
                    break
                }
            return m && (l[l.length - 2] = l[l.length - 2].substr(0, l[l.length - 2].length - 2)),
            l = l.join("\r\nm="),
            C === !0 ? RTCSessionDescription && t instanceof RTCSessionDescription ? new RTCSessionDescription({
                type: i,
                sdp: l
            }) : e.SessionDescription && t instanceof SessionDescription ? new SessionDescription(l) : l : t
        }
    }
    ,
    b = function(e, i) {
        this.recordAudio = null,
        this.recordVideo = null,
        this.recordOngoing = !1,
        this.uploadServerAddress = i,
        this.sessionIdForRecord = null,
        this.timerRef = 0,
        this.setUploadServerAddress = function(e) {
            this.uploadServerAddress = e
        }
        ,
        this.record = function(i, n, s, a) {
            this.sessionIdForRecord = a,
            "local" === i && ("audio" === n || "video" === n || "videoOnly" === n) && (null === e.localStream || e.localStream === t,
            this.recordStream(e.localStream, n) === !0 && (this.timerRef = setTimeout(this.callback(this, "stopRecord"), s)))
        }
        ,
        this.stop = function() {
            clearTimeout(this.timerRef),
            this.timerRef = 0,
            this.stopRecord()
        }
        ,
        this.xhr = function(e, t, i) {
            var n = new XMLHttpRequest;
            n.onreadystatechange = function() {
                4 == n.readyState && 200 == n.status && i(n.responseText)
            }
            ,
            n.open("POST", e),
            n.send(t)
        }
        ,
        this.recordStream = function(e, t) {
            if (this.recordOngoing === !0)
                return !1;
            if (this.recordOngoing = !0,
            this.recordType = t,
            "videoOnly" !== this.recordType && (this.recordAudio = new RecordRTC(e,{
                bufferSize: 16384,
                sampleRate: 44100
            })),
            "audio" !== this.recordType) {
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
                this.recordVideo = new RecordRTC(e,i)
            }
            return "videoOnly" !== this.recordType && this.recordAudio.startRecording(),
            "audio" !== this.recordType && this.recordVideo.startRecording(),
            !0
        }
        ,
        this.postBlob = function(e, t, i) {
            var n = new FormData;
            n.append("destFileName", i),
            n.append("fichier", e),
            n.append("sessionId", this.sessionIdForRecord),
            this.xhr(this.uploadServerAddress, n, function(e) {
                c.createRecordedFileAvailableEvent(JSON.parse(e).fileUrl)
            })
        }
        ,
        this.stopRecord = function() {
            var t = new Date
              , i = t.toJSON()
              , n = i.replace(new RegExp(":","g"), "-");
            c.createStopRecordEvent(),
            this.fileName = e.clientId + "-" + n,
            "videoOnly" !== this.recordType && this.recordAudio.stopRecording(),
            "audio" !== this.recordType && this.recordVideo.stopRecording(),
            "videoOnly" !== this.recordType ? (this.postBlob(this.recordAudio.getBlob(), "audio", this.fileName + ".wav"),
            "audio" !== this.recordType && this.postBlob(this.recordVideo.getBlob(), "video", this.fileName + ".webm")) : this.postBlob(this.recordVideo.getBlob(), "video", this.fileName + ".webm"),
            null !== e.localStream && this.stopStream(e.localStream),
            this.recordOngoing = !1
        }
        ,
        this.callback = function(e, t) {
            return this.closureHandler = function(i) {
                return e[t](i)
            }
            ,
            this.closureHandler
        }
    }
    ,
    w = function(e) {
        this.sendChunkNb = 0,
        this.send = function(i, n, s) {
            var a = 12e3
              , o = {}
              , l = null
              , r = {}
              , d = !1
              , h = {};
            if (i.file instanceof Blob ? (this.blob = i.file,
            this.contentType = i.file.type,
            this.size = i.file.size,
            this.originalDataType = "Blob") : i.file instanceof ArrayBuffer ? (this.blob = i.file,
            this.contentType = "application/octet-stream",
            this.size = i.file.byteLength,
            this.originalDataType = "ArrayBuffer") : i.file instanceof String || "string" == typeof i.file ? (this.blob = i.file,
            this.size = i.file.length,
            this.contentType = "application/octet-stream",
            this.originalDataType = "String") : (this.blob = i.file,
            this.contentType = "application/octet-stream",
            this.size = i.file.length || i.file.byteLength || i.file.size,
            this.originalDataType = "Unknown"),
            this.contentType || (this.contentType = "application/octet-stream"),
            0 === this.size)
                return s !== t && (this.transferDuration = new Date - this.startingDate,
                s({
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
                })),
                c.createEvent({
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
                }),
                void c.createEvent({
                    eventType: "onFileSended",
                    callId: e.callId,
                    remoteId: e.remoteId,
                    name: i.name,
                    uuid: i.uuid
                });
            if (n && "open" === n.readyState) {
                if (0 === this.sendChunkNb,
                0 === this.sendChunkNb) {
                    i.uuid = (Math.random() * (new Date).getTime()).toString(36).replace(/\./g, "-"),
                    r = {
                        name: i.name,
                        type: i.type,
                        size: this.size,
                        contentType: this.contentType,
                        uuid: i.uuid
                    },
                    this.fileSize = this.size,
                    s !== t && (this.startingDate = new Date,
                    this.transferDuration = 0,
                    s({
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
                    }),
                    c.createEvent({
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
                    }));
                    try {
                        n.send(JSON.stringify(r))
                    } catch (u) {}
                    c.createEvent({
                        eventType: "onFileSending",
                        callId: e.callId,
                        remoteId: e.remoteId,
                        name: i.name,
                        uuid: i.uuid
                    })
                } else {
                    a < this.size ? o = this.blob.slice(0, a) : (o = this.blob.slice(0),
                    d = !0),
                    h.message = "ArrayBuffer" === this.originalDataType ? E.encode(o) : o,
                    h.messageSize = o.byteLength,
                    h.uuid = i.uuid,
                    h.originalDataType = this.originalDataType,
                    s !== t && (this.transferDuration = new Date - this.startingDate,
                    s({
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
                    }),
                    c.createEvent({
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
                    }));
                    try {
                        n.send(JSON.stringify(h))
                    } catch (C) {}
                }
                l = 0 === this.sendChunkNb ? this.blob : this.blob.slice(a),
                d === !1 ? this.sendChunkNb++ : this.sendChunkNb = 0,
                i.file = l,
                setTimeout(function() {
                    this.send(i, n, s)
                }
                .bind(this), 0)
            }
        }
    }
    ,
    p = function(i) {
        function a(e) {
            var t = {}
              , i = e.indexOf(" ")
              , n = e.substring(i + 1).split("; ")
              , s = new RegExp("a=fmtp:(\\d+)")
              , a = e.match(s)
              , o = 0
              , l = {}
              , r = null;
            if (!a || 2 !== a.length)
                return null;
            for (t.pt = a[1],
            o = 0; o < n.length; ++o)
                r = n[o].split("="),
                2 === r.length && (l[r[0]] = r[1]);
            return t.params = l,
            t
        }
        this.dest_roomId = "",
        this.pc = null,
        this.callId = 0,
        this.callee = !1,
        this.callerId = 0,
        this.calleeId = 0,
        this.started = !1,
        this.sendedSdpOfferMessage = null,
        this.receivedSdpOfferMessage = null,
        this.myWebRTC_Stack = new u(i.socket),
        this.myWebRTC_Event = new r,
        "firefox" === i.myWebRTC_Adapter.webrtcDetectedBrowser ? i.myWebRTC_Adapter.webrtcDetectedVersion > 43 ? (this.mediaConstraintsAudioOnly = {
            offerToReceiveAudio: !0,
            offerToReceiveVideo: !1
        },
        this.mediaConstraints = {
            offerToReceiveAudio: 1,
            offerToReceiveVideo: 1
        }) : (this.mediaConstraintsAudioOnly = {
            mandatory: {
                offerToReceiveAudio: !0,
                offerToReceiveVideo: !1
            }
        },
        this.mediaConstraints = {
            mandatory: {
                offerToReceiveAudio: !0,
                offerToReceiveVideo: !0
            }
        }) : (this.mediaConstraintsAudioOnly = {
            mandatory: {
                OfferToReceiveAudio: !0,
                OfferToReceiveVideo: !0
            }
        },
        this.mediaConstraints = {
            mandatory: {
                OfferToReceiveAudio: !0,
                OfferToReceiveVideo: !0
            }
        }),
        this.trickleIce = i.trickleIce,
        this.callLocalStream = null,
        this.generatedLocalStream = !1,
        this.audioOnly = !1,
        this.inviteSended = !1,
        this.callCancelled = !1,
        this.screenSharing = !1,
        this.desktopId = 0,
        this.pc_config = i.pc_config,
        this.pc_constraints = i.pc_constraints,
        this.audioFileMediaElement = null,
        this.getStatsInterval = i.qosInterval,
        this.qm = null,
        this.statisticId = null,
        this.remoteId = 0,
        this.callType = "media",
        this.disconnectionTimeoutId = 0,
        this.disconnectionTimer = 4e4,
        this.disconnectionWarningDelay = 9e3,
        this.disconnectionWarningInterval = 0,
        this.disconnectionWarningCount = 0,
        this.data = {},
        this.screenStream = null,
        this.screenIsDisplayed = !1,
        this.addingDataChannelOnCallOngoing = !1,
        this.sendDataChannel = null,
        this.receiveDataChannel = null,
        this.receiveChunkNb = {},
        this.firstDataPacket = {},
        this.receivedSize = {},
        this.receiveArrayToStoreChunks = {},
        this.destCallType = "media",
        this.mcuRemoteStream = null,
        this.remoteType = "web",
        this.mediaTypeForIncomingCall = i.mediaTypeForIncomingCall,
        this.mediaTypeForOutgoingCall = i.mediaTypeForOutgoingCall,
        this.mediaRoutingMode = i.mediaRoutingMode,
        this.stripVideoSDPActivated = !1,
        this.iceState = "notdefined",
        this.setCallTurnServer = function(e) {
            var t = JSON.stringify(this.pc_config);
            t = t.replace(/mp1.apizee.com/g, e),
            this.pc_config = JSON.parse(t)
        }
        ,
        this.setCallMediaRoutingMode = function(e) {
            "hostOnly" === e ? this.mediaRoutingMode = i.mediaRoutingModeEnum.hostOnly : "stun" === e ? this.mediaRoutingMode = i.mediaRoutingModeEnum.stun : "stunOnly" === e ? this.mediaRoutingMode = i.mediaRoutingModeEnum.stunOnly : "turn" === e ? this.mediaRoutingMode = i.mediaRoutingModeEnum.turn : "turnOnly" === e ? this.mediaRoutingMode = i.mediaRoutingModeEnum.turnOnly : this.myWebRTC_Event.createErrorEvent("parameter error when calling function : setCallMediaRoutingMode()", "PARAMETER_ERROR_SETCALLMEDIAROUTINGMODE")
        }
        ,
        this.checkDTLSCompliancy = function() {
            if (d.session.isDeviceDTLSCompliant() === !1)
                this.pc_constraints = {
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
        }
        ,
        this.sendData = function(e, t) {
            var i = null
              , n = null
              , s = null;
            return e.file instanceof File ? (this.contentType = e.file.type,
            this.originalDataType = "File",
            i = new FileReader,
            n = this,
            i.onload = function(s) {
                var a = s.target.result || i.result;
                n.sendData({
                    file: a,
                    name: e.name,
                    type: e.type
                }, t)
            }
            ,
            void i.readAsArrayBuffer(e.file)) : (s = new w(this),
            void s.send(e, this.sendDataChannel, t))
        }
        ,
        this.generateCallId = function() {
            this.callId = Math.floor(1000001 * Math.random()).toString()
        }
        ,
        this.onSetLocalDescriptionSuccess = function() {}
        ,
        this.onSetLocalDescriptionFailure = function(e) {
            e = null
        }
        ,
        this.onSetRemoteDescriptionSuccess = function() {}
        ,
        this.onSetRemoteDescriptionFailure = function(e) {
            e = null
        }
        ,
        this.getUserMediaOnCall = function() {
            if (this.callerId === i.clientId) {
                if ("VIDEO" === this.mediaTypeForOutgoingCall || "VIDEOONLY" === this.mediaTypeForOutgoingCall) {
                    if (i.videoDevicePresent === !1) {
                        if (i.audioDevicePresent === !1)
                            return void this.onUserMediaSuccessOnCall();
                        "media" === this.callType && (this.callType = "audio",
                        this.audioOnly = !0)
                    }
                } else if ("AUDIO" === this.mediaTypeForOutgoingCall)
                    this.callType = "audio",
                    this.audioOnly = !0;
                else if ("NONE" === this.mediaTypeForOutgoingCall)
                    return void this.onUserMediaSuccessOnCall()
            } else if ("VIDEO" === this.mediaTypeForIncomingCall || "VIDEOONLY" === this.mediaTypeForIncomingCall) {
                if (i.videoDevicePresent === !1) {
                    if (i.audioDevicePresent === !1)
                        return void this.onUserMediaSuccessOnCall();
                    "media" === this.callType && (this.callType = "audio",
                    this.audioOnly = !0)
                }
            } else if ("AUDIO" === this.mediaTypeForIncomingCall)
                this.callType = "audio",
                this.audioOnly = !0;
            else if ("NONE" === this.mediaTypeForIncomingCall)
                return void this.onUserMediaSuccessOnCall();
            i.getUserMediaOnGoing = !0;
            var e = null
              , n = null
              , s = null;
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
                }, this.callback(this, "onUserMediaSuccessOnCall"), this.callback(this, "onUserMediaErrorOnCall")) : this.audioOnly === !0 ? (null === i.audioSourceId || (i.gum_config.audio.optional = [{
                    sourceId: i.audioSourceId
                }]),
                n = JSON.parse(JSON.stringify(i.gum_config)),
                i.allowAsymetricMediaCalls === !1 && (n.video = !1),
                e = n,
                navigator.mediaDevices !== t && navigator.mediaDevices.getUserMedia !== t ? s = navigator.mediaDevices.getUserMedia(e).then(this.callback(this, "onUserMediaSuccessOnCall"))["catch"](this.callback(this, "onUserMediaErrorOnCall")) : i.myWebRTC_Adapter.getUserMedia(e, this.callback(this, "onUserMediaSuccessOnCall"), this.callback(this, "onUserMediaErrorOnCall"))) : (null === i.audioSourceId && null === i.videoSourceId ? e = i.gum_config : (i.gum_config.audio.optional = [{
                    sourceId: i.audioSourceId
                }],
                i.gum_config.video.optional = [{
                    sourceId: i.videoSourceId
                }],
                e = i.gum_config),
                navigator.mediaDevices !== t && navigator.mediaDevices.getUserMedia !== t ? s = navigator.mediaDevices.getUserMedia(e).then(this.callback(this, "onUserMediaSuccessOnCall"))["catch"](this.callback(this, "onUserMediaErrorOnCall")) : i.myWebRTC_Adapter.getUserMedia(e, this.callback(this, "onUserMediaSuccessOnCall"), this.callback(this, "onUserMediaErrorOnCall")))
            } catch (a) {
                alert("getUserMedia() failed. Is this a WebRTC capable browser?")
            }
        }
        ,
        this.stopStream = function(e) {
            var t = 0
              , i = null;
            if ("Chrome" === g && this.myWebRTC_Adapter.webrtcDetectedVersion >= 45 || "Firefox" === g && this.myWebRTC_Adapter.webrtcDetectedVersion >= 44 || "Opera" === g && this.myWebRTC_Adapter.webrtcDetectedVersion >= 34 || "Chromium" === g && this.myWebRTC_Adapter.webrtcDetectedVersion >= 44)
                for (i = e.getTracks(),
                t = 0; t < i.length; t += 1)
                    i[t].stop();
            else
                e.stopStream();
            e = null
        }
        ,
        this.getScreenUserMediaOnCall = function() {
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
        }
        ,
        this.onScreenUserMediaSuccessOnCall = function(e) {
            var t = !1
              , i = "Unknown"
              , n = !1
              , s = "Unknown"
              , a = null;
            e.getAudioTracks().length > 0 && (t = !0,
            e.getAudioTracks()[0].label && (i = e.getAudioTracks()[0].label)),
            e.getVideoTracks().length > 0 && (n = !0,
            e.getVideoTracks()[0].label && (s = e.getVideoTracks()[0].label)),
            this.screenStream = e,
            this.screenStream.getVideoTracks()[0].onended = this.callback(this, "stopScreenSharingOnSwitchStream"),
            a = this.callLocalStream.getAudioTracks()[0].clone(),
            this.screenStream.addTrack(a),
            this.switchVideoToScreen()
        }
        ,
        this.toggleVideoScreen = function() {
            this.screenIsDisplayed === !0 ? this.switchScreenToVideo() : this.switchVideoToScreen()
        }
        ,
        this.switchVideoToScreen = function() {
            this.pc.removeStream(this.callLocalStream),
            this.pc.addStream(this.screenStream),
            this.updateMedia(!1),
            i.myWebRTC_Event.createSwitchStreamEvent(this.callId, this.screenStream),
            this.screenIsDisplayed = !0
        }
        ,
        this.switchScreenToVideo = function() {
            this.pc.removeStream(this.screenStream),
            this.pc.addStream(this.callLocalStream),
            this.updateMedia(!1),
            i.myWebRTC_Event.createSwitchStreamEvent(this.callId, this.callLocalStream),
            this.screenIsDisplayed = !1
        }
        ,
        this.onScreenUserMediaErrorOnCall = function(e) {
            e = null
        }
        ,
        this.stopScreenSharingOnSwitchStream = function() {
            this.switchScreenToVideo(this.callId),
            null !== this.screenStream && this.stopStream(this.screenStream)
        }
        ,
        this.stopScreenSharing = function() {
            i.removeCallFromTableWithCallIdAndSendBye(this.callId, "stop_ScreenSharing")
        }
        ,
        this.onUserMediaSuccessOnCall = function(e) {
            var a = !1
              , o = "Unknown"
              , l = !1
              , r = "Unknown"
              , c = n()
              , h = {};
            i.userMediaErrorDetected === !0 && (i.userMediaErrorDetected = !1,
            h.userMediaErrorDetected = i.userMediaErrorDetected,
            d.session.setUserData(h)),
            c = null,
            i.getUserMediaOnGoing = !1,
            i.accessToLocalMedia = !0,
            i.displayHangUpButtonInCommand(),
            i.setStatus(this.callee === !0 ? "You are connected to :" + this.callerId : "You are connected to :" + this.calleeId),
            e !== t && (e.getAudioTracks().length > 0 && (a = !0,
            e.getAudioTracks()[0].label && (o = e.getAudioTracks()[0].label)),
            e.getVideoTracks().length > 0 && (l = !0,
            e.getVideoTracks()[0].label && (r = e.getVideoTracks()[0].label))),
            this.screenSharing === !0 ? (this.callType = "screenSharing",
            e.onended = this.callback(this, "stopScreenSharing"),
            e.getVideoTracks().length > 0 && (e.getVideoTracks()[0].onended = this.callback(this, "stopScreenSharing"))) : this.audioOnly === !0 && (this.callType = "audio"),
            i.myWebRTC_Event.createUserMediaSuccessEvent(!0, a, o, l, r, this.callType, this.callId, e, this.remoteId),
            i.addingUserMedia === !1 ? (i.miniVideo && e !== t && i.attachMediaStream(i.miniVideo, e),
            i.localVideo && (e !== t && i.attachMediaStream(i.localVideo, e),
            i.localVideo.style.opacity = 1)) : i.miniVideo && e !== t && i.attachMediaStream(i.miniVideo, e),
            e !== t && (this.callLocalStream = e),
            s() ? this.establishCall() : (this.data !== t,
            (i.userAcceptOnIncomingCall !== !0 || this.callee !== !0 && "MCU-Callee" !== this.data.MCUType) && this.establishCall())
        }
        ,
        this.establishCall = function() {
            this.maybeStart();
            var e = null;
            this.callee && i.addingUserMedia === !1 ? (e = new i.myWebRTC_Adapter.RTCSessionDescription(this.receivedSdpOfferMessage),
            null !== this.pc && this.pc.setRemoteDescription(e, this.callback(this, "onSetRemoteDescriptionSuccess"), this.callback(this, "onSetRemoteDescriptionFailure")),
            this.doAnswer()) : i.addingUserMedia === !0 && (null !== this.pc && (null !== this.callLocalStream ? this.pc.addStream(this.callLocalStream) : null !== i.localStream && (this.pc.addStream(i.localStream),
            this.callLocalStream = i.localStream)),
            this.updateMedia(!1))
        }
        ,
        this.onUserMediaSuccessTestUni = function() {
            i.getUserMediaOnGoing = !1;
            var e = null
              , t = {};
            i.userMediaErrorDetected === !0 && (i.userMediaErrorDetected = !1,
            t.userMediaErrorDetected = i.userMediaErrorDetected,
            d.session.setUserData(t)),
            i.accessToLocalMedia = !0,
            this.maybeStart(),
            this.callee && (e = new i.myWebRTC_Adapter.RTCSessionDescription(this.receivedSdpOfferMessage),
            this.pc.setRemoteDescription(e, this.callback(this, "onSetRemoteDescriptionSuccess"), this.callback(this, "onSetRemoteDescriptionFailure")),
            this.doAnswer())
        }
        ,
        this.onUserMediaErrorOnCall = function(n) {
            var s = {};
            i.getUserMediaOnGoing = !1,
            n = null,
            "Chrome" === g && i.myWebRTC_Adapter.webrtcDetectedVersion > 47 && "https:" != e.location.protocol && alert("HTTPS is now mandatory to use getUserMedia()"),
            i.setStatus("<div style='font-size:18px;color:orange'>Registered! <br>You can be reached at:  : " + i.clientId + "</div>"),
            this.screenSharing === !0 && (this.callType = "screenSharing",
            "https:" != e.location.protocol ? c.createDesktopCaptureEvent("UserMediaError_HTTPS_needed", this.callId, this.remoteId) : c.createDesktopCaptureEvent("UserMediaError", this.callId, this.remoteId)),
            i.myWebRTC_Event.createUserMediaErrorEvent(!0, this.callType),
            this.callee === !0 ? (this.myWebRTC_Stack.sendBye(this.callId, this.calleeId, this.dest_roomId, this.callerId, "User_Media_Error", this.data),
            i.removeCallFromTableWithCallIdandRemoteId(this.callId, this.callerId, "User_Media_Error")) : (this.data !== t && null !== this.data && "MCU-Callee" === this.data.MCUType && this.myWebRTC_Stack.sendBye(this.callId, this.callerId, this.dest_roomId, this.calleeId, "User_Media_Error", this.data),
            i.removeCallFromTableWithCallIdandRemoteId(this.callId, this.calleeId, "User_Media_Error")),
            i.userMediaErrorDetected = !0,
            s.userMediaErrorDetected = i.userMediaErrorDetected,
            d.session.setUserData(s),
            d.session.tryAudioCallAfterUserMediaError === !0 && this.audioOnly === !1 && ("publish" === this.data.type ? i.MCUClient.publish(this.dest_roomId, null, null, !0) : i.callWithNumber(this.callee, !1, this.data, "AUDIO"))
        }
        ,
        this.maybeStart = function() {
            !this.started && i.channelReady && (i.accessToLocalMedia || this.dataCall) && (this.createPeerConnection(),
            i.unidirectionelCallOnly || this.screenSharing === !0 ? this.callee === !1 && (null !== this.callLocalStream ? this.pc.addStream(this.callLocalStream) : null !== i.localStream && (this.pc.addStream(i.localStream),
            this.callLocalStream = i.localStream)) : this.dataCall || (null !== this.callLocalStream ? this.pc.addStream(this.callLocalStream) : null !== i.localStream && (this.pc.addStream(i.localStream),
            this.callLocalStream = i.localStream)),
            this.started = !0,
            this.callee === !1 && this.doCall())
        }
        ,
        this.createDataChannel = function() {
            if (null === this.sendDataChannel) {
                try {
                    this.sendDataChannel = this.pc.createDataChannel("apiRTCDataChannel", {}),
                    this.sendDataChannel.binaryType = "arraybuffer"
                } catch (e) {}
                this.sendDataChannel.onopen = this.callback(this, "onSendDataChannelOpen"),
                this.sendDataChannel.onclose = this.callback(this, "onSendDataChannelClose"),
                this.sendDataChannel.onmessage = this.callback(this, "onSendDataChannelMessage"),
                this.sendDataChannel.onerror = this.callback(this, "onSendDataChannelError")
            }
        }
        ,
        this.createPeerConnection = function() {
            try {
                this.pc = new i.myWebRTC_Adapter.RTCPeerConnection(this.pc_config,this.pc_constraints),
                this.dataCall && this.createDataChannel(),
                this.pc.onicecandidate = this.callback(this, "onIceCandidate")
            } catch (e) {
                return void alert("Cannot create RTCPeerConnection object; WebRTC is not supported by this browser.")
            }
            this.pc.onaddstream = this.callback(this, "onRemoteStreamAdded"),
            this.pc.onremovestream = this.callback(this, "onRemoteStreamRemoved"),
            this.pc.onnegotiationneeded = this.callback(this, "onNegotiationNeeded"),
            this.pc.onsignalingstatechange = this.callback(this, "onSignalingStateChange"),
            this.pc.oniceconnectionstatechange = this.callback(this, "onIceConnectionStateChange"),
            this.pc.ondatachannel = this.callback(this, "onDataChannel"),
            i.qosEnable && (this.statisticId = setInterval(this.callback(this, "getStatistics"), this.getStatsInterval))
        }
        ,
        this.onDataChannel = function(e) {
            this.receiveDataChannel = e.channel,
            this.receiveDataChannel.binaryType = "arraybuffer",
            null === this.sendDataChannel && (this.sendDataChannel = e.channel,
            this.sendDataChannel.onopen = this.callback(this, "onSendDataChannelOpen"),
            this.sendDataChannel.onclose = this.callback(this, "onSendDataChannelClose"),
            this.sendDataChannel.onmessage = this.callback(this, "onSendDataChannelMessage"),
            this.sendDataChannel.onerror = this.callback(this, "onSendDataChannelError")),
            this.receiveDataChannel.onopen = this.callback(this, "onReceiveDataChannelOpen"),
            this.receiveDataChannel.onclose = this.callback(this, "onReceiveDataChannelClose"),
            this.receiveDataChannel.onmessage = this.callback(this, "onReceiveDataChannelMessage"),
            this.receiveDataChannel.onerror = this.callback(this, "onReceiveDataChannelError")
        }
        ,
        this.onSendDataChannelOpen = function(e) {
            c.createEvent({
                eventType: "sendDataChannelOpen",
                callId: this.callId,
                remoteId: this.remoteId,
                details: e
            })
        }
        ,
        this.onSendDataChannelClose = function(e) {
            this.sendDataChannel = null,
            null !== c && c.createEvent({
                eventType: "sendDataChannelClose",
                callId: this.callId,
                remoteId: this.remoteId,
                details: e
            })
        }
        ,
        this.processOnDataChannelMessage = function(i) {
            var n = null
              , s = null
              , a = null
              , o = ""
              , l = 0
              , r = 0;
            if (n = JSON.parse(i.data),
            a = n.uuid,
            "ArrayBuffer" === n.originalDataType && (n.message = E.decode(n.message)),
            this.receiveChunkNb[a] === t)
                this.firstDataPacket[a] = n,
                this.receiveChunkNb[a] = 1,
                this.receivedSize[a] = 0,
                this.startingDate = new Date,
                this.transferDuration = 0,
                c.createEvent({
                    eventType: "onFileReceiving",
                    remoteId: this.remoteId,
                    callId: this.callId,
                    name: n.name,
                    uuid: a
                }),
                c.createEvent({
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
            else if (this.receiveChunkNb[a] += 1,
            r = n.messageSize || n.message.length,
            this.receiveArrayToStoreChunks[a] || (this.receiveArrayToStoreChunks[a] = []),
            this.receiveArrayToStoreChunks[a].push(n.message),
            this.receivedSize[a] += r,
            this.transferDuration = new Date - this.startingDate,
            this.receivedSize[a] === this.firstDataPacket[a].size) {
                if ("image/png-dataUrl" === this.firstDataPacket[a].type) {
                    for (l = 0; l < this.receiveArrayToStoreChunks[a].length; l += 1)
                        o += this.receiveArrayToStoreChunks[a][l];
                    s = o
                } else
                    s = new e.Blob(this.receiveArrayToStoreChunks[a]);
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
                }),
                c.createEvent({
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
                }),
                delete this.receiveArrayToStoreChunks[a],
                delete this.receivedSize[a],
                delete this.receiveChunkNb[a],
                delete this.firstDataPacket[a]
            } else
                c.createEvent({
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
        }
        ,
        this.onSendDataChannelMessage = function(e) {
            this.processOnDataChannelMessage(e)
        }
        ,
        this.onSendDataChannelError = function(e) {
            this.sendDataChannel = null,
            c.createEvent({
                eventType: "sendDataChannelError",
                callId: this.callId,
                remoteId: this.remoteId,
                details: e
            })
        }
        ,
        this.onReceiveDataChannelOpen = function(e) {
            c.createEvent({
                eventType: "receiveDataChannelOpen",
                callId: this.callId,
                remoteId: this.remoteId,
                details: e
            })
        }
        ,
        this.onReceiveDataChannelClose = function(e) {
            this.receiveDataChannel = null,
            null !== c && c.createEvent({
                eventType: "receiveDataChannelClose",
                callId: this.callId,
                remoteId: this.remoteId,
                details: e
            })
        }
        ,
        this.onReceiveDataChannelMessage = function(e) {
            this.processOnDataChannelMessage(e)
        }
        ,
        this.onReceiveDataChannelError = function(e) {
            c.createEvent({
                eventType: "receiveDataChannelError",
                callId: this.callId,
                remoteId: this.remoteId,
                details: e
            })
        }
        ,
        this.statisticsAnswer = function(e) {
            var t = e.result();
            this.qm || (this.qm = new qosMonitor(this.getStatsInterval / 1e3,this.callback(this, "onQosChange"),this.callback(this, "onQosAudioChange"),this.callback(this, "onQosVideoChange"),this.callId,i.apiKey,i.clientId,i.socket)),
            t && (this.qm.insertStats(t, this.sendedSdpOfferMessage, this.receivedSdpOfferMessage, i.remoteVideo),
            c.createEvent({
                eventType: "onQosStatsUpdate",
                callId: this.callId,
                remoteId: this.remoteId,
                stats: this.qm.getAllStats()
            }))
        }
        ,
        this.onQosChange = function(e, t) {
            c.createEvent({
                eventType: "onQosChange",
                callId: this.callId,
                remoteId: this.remoteId,
                qosIn: e,
                qosOut: t
            })
        }
        ,
        this.onQosAudioChange = function(e, t) {
            c.createEvent({
                eventType: "onQosAudioChange",
                callId: this.callId,
                remoteId: this.remoteId,
                qosAudioIn: e,
                qosAudioOut: t
            })
        }
        ,
        this.onQosVideoChange = function(e, t) {
            c.createEvent({
                eventType: "onQosVideoChange",
                callId: this.callId,
                remoteId: this.remoteId,
                qosVideoIn: e,
                qosVideoOut: t
            })
        }
        ,
        this.getStatistics = function() {
            this.pc && this.pc.getStats && "firefox" !== i.myWebRTC_Adapter.webrtcDetectedBrowser && this.pc.getStats(this.callback(this, "statisticsAnswer"))
        }
        ,
        this.doCall = function() {
            var e = null;
            this.audioOnly ? this.pc.createOffer(this.callback(this, "setLocalAndSendMessageonOffer"), this.callback(this, "onCreateOfferFailure"), this.mediaConstraintsAudioOnly) : this.screenSharing === !0 ? (e = {
                mandatory: {
                    OfferToReceiveAudio: !1,
                    OfferToReceiveVideo: !1
                }
            },
            this.pc.createOffer(this.callback(this, "setLocalAndSendMessageonOffer"), this.callback(this, "onCreateOfferFailure"), e)) : this.dataCall === !0 ? (e = "firefox" === i.myWebRTC_Adapter.webrtcDetectedBrowser && i.myWebRTC_Adapter.webrtcDetectedVersion > 43 ? {
                offerToReceiveAudio: !1,
                offerToReceiveVideo: !1
            } : {
                mandatory: {
                    OfferToReceiveAudio: !1,
                    OfferToReceiveVideo: !1
                }
            },
            this.pc.createOffer(this.callback(this, "setLocalAndSendMessageonOffer"), this.callback(this, "onCreateOfferFailure"), e)) : this.pc.createOffer(this.callback(this, "setLocalAndSendMessageonOffer"), this.callback(this, "onCreateOfferFailure"), this.mediaConstraints)
        }
        ,
        this.doAnswer = function() {
            this.audioOnly ? this.pc.createAnswer(this.callback(this, "setLocalAndSendMessage"), this.callback(this, "onCreateAnswerFailure"), this.mediaConstraintsAudioOnly) : this.pc.createAnswer(this.callback(this, "setLocalAndSendMessage"), this.callback(this, "onCreateAnswerFailure"), this.mediaConstraints)
        }
        ,
        this.doUpdateAnswer = function() {
            this.audioOnly ? this.pc.createAnswer(this.callback(this, "setLocalAndSendMessageUpdate"), this.callback(this, "onCreateAnswerFailure"), this.mediaConstraintsAudioOnly) : this.pc.createAnswer(this.callback(this, "setLocalAndSendMessageUpdate"), this.callback(this, "onCreateAnswerFailure"), this.mediaConstraints)
        }
        ,
        this.updateMedia = function(e) {
            this.audioOnly ? this.pc.createOffer(this.callback(this, "setLocalAndSendMessageonOfferUpdate"), this.callback(this, "onCreateOfferFailure"), this.mediaConstraintsAudioOnly) : (e === !0 && (this.mediaConstraints.mandatory.IceRestart = !0),
            this.pc.createOffer(this.callback(this, "setLocalAndSendMessageonOfferUpdate"), this.callback(this, "onCreateOfferFailure"), this.mediaConstraints))
        }
        ,
        this.setLocalAndSendMessageonOffer = function(e) {
            i.RTPMedia === !0 && (e.sdp = e.sdp.replace(/RTP\/SAVPF/g, "RTP/SF")),
            this.stripVideoSDPActivated === !0 && (e.sdp = i.mySDPManager.stripVideoMediaDescriptionFromSDP(e.sdp)),
            null !== i.audioBandwidth && (e.sdp = i.mySDPManager.setAudioBandwidth(e.sdp, i.audioBandwidth)),
            null !== i.videoBandwidth && (e.sdp = i.mySDPManager.setVideoBandwidth(e.sdp, i.videoBandwidth)),
            null !== i.dataBandwidth && (e.sdp = i.mySDPManager.setDataBandwidth(e.sdp, i.dataBandwidth)),
            i.preferVP9Codec === !0 && (e.sdp = this.maybePreferCodec(e.sdp, "video", "VP9")),
            i.setStereo === !0 && (e.sdp = this.setCodecParam(e.sdp, "opus/48000", "stereo", "1")),
            "VIDEO" === this.mediaTypeForOutgoingCall || ("AUDIO" === this.mediaTypeForOutgoingCall || this.audioOnly === !0 ? e.sdp = i.mySDPManager.setRecvOnlyForVideo(e.sdp) : "VIDEOONLY" === this.mediaTypeForOutgoingCall ? e.sdp = i.mySDPManager.setRecvOnlyForAudio(e.sdp) : "NONE" === this.mediaTypeForOutgoingCall && (e.sdp = i.mySDPManager.setRecvOnly(e.sdp)));
            var t = e;
            t = i.mySDPManager.updateSDPcodecs(t, "offer", "audio", i.allowedAudioCodecs),
            t = i.mySDPManager.updateSDPcodecs(t, "offer", "video", i.allowedVideoCodecs),
            this.sendedSdpOfferMessage = t,
            this.dataCall === !0 && (this.callType = "data"),
            this.callCancelled === !1 ? (i.NtoNConf === !1 ? (this.screenSharing === !0 && (this.callType = "screenSharing"),
            this.trickleIce === !0 ? this.myWebRTC_Stack.sendInvite(this.callId, this.callerId, i.nickname, this.dest_roomId, this.dest_roomId, e, this.callType, this.data, this.mcuRemoteStream) : this.pc.setLocalDescription(this.sendedSdpOfferMessage, this.callback(this, "onSetLocalDescriptionSuccess"), this.callback(this, "onSetLocalDescriptionFailure"))) : this.myWebRTC_Stack.sendInviteBroadcast(this.callId, this.callerId, i.nickname, this.dest_roomId, this.dest_roomId, e),
            this.inviteSended = !0) : (i.removeCallFromTableWithCallIdandRemoteId(this.callId, this.calleeId, "Call_Cancelled"),
            0 === i.callsTable.length && (i.initMediaElementState(),
            i.displayCallButtonInCommand()))
        }
        ,
        this.setLocalAndSendMessageonOfferUpdate = function(e) {
            this.sendedSdpOfferMessage = e;
            var t = 0;
            t = this.callee ? this.callerId : this.calleeId,
            this.trickleIce === !0 ? this.myWebRTC_Stack.sendUpdate(this.callId, this.callerId, this.calleeId, this.dest_roomId, t, e, this.data) : (this.pc.setLocalDescription(e, this.callback(this, "onSetLocalDescriptionSuccess"), this.callback(this, "onSetLocalDescriptionFailure")),
            this.pc.setRemoteDescription(this.pc.remoteDescription, this.callback(this, "onSetRemoteDescriptionSuccess"), this.callback(this, "onSetRemoteDescriptionFailure")))
        }
        ,
        this.onCreateOfferFailure = function(e) {
            e = null
        }
        ,
        this.onCreateAnswerFailure = function(e) {
            e = null
        }
        ,
        this.setLocalAndSendMessage = function(e) {
            i.RTPMedia === !0 && (e.sdp = e.sdp.replace(/RTP\/SAVPF/g, "RTP/SF")),
            null !== i.audioBandwidth && (e.sdp = i.mySDPManager.setAudioBandwidth(e.sdp, i.audioBandwidth)),
            null !== i.videoBandwidth && (e.sdp = i.mySDPManager.setVideoBandwidth(e.sdp, i.videoBandwidth)),
            null !== i.dataBandwidth && (e.sdp = i.mySDPManager.setDataBandwidth(e.sdp, i.dataBandwidth)),
            e = i.mySDPManager.updateSDPcodecs(e, "answer", "audio", i.allowedAudioCodecs),
            e = i.mySDPManager.updateSDPcodecs(e, "answer", "video", i.allowedVideoCodecs),
            i.preferOpusCodec === !0 && (e.sdp = this.preferOpus(e.sdp)),
            i.setStereo === !0 && (e.sdp = this.setCodecParam(e.sdp, "opus/48000", "stereo", "1")),
            "VIDEO" === this.mediaTypeForIncomingCall || ("AUDIO" === this.mediaTypeForIncomingCall ? e.sdp = i.mySDPManager.setRecvOnlyForVideo(e.sdp) : "VIDEOONLY" === this.mediaTypeForIncomingCall ? e.sdp = i.mySDPManager.setRecvOnlyForAudio(e.sdp) : "NONE" === this.mediaTypeForIncomingCall && (e.sdp = i.mySDPManager.setRecvOnly(e.sdp))),
            this.pc.setLocalDescription(e, this.callback(this, "onSetLocalDescriptionSuccess"), this.callback(this, "onSetLocalDescriptionFailure")),
            this.sendedSdpOfferMessage = e,
            this.trickleIce === !0 && this.myWebRTC_Stack.send200OK(this.callId, this.callerId, this.calleeId, i.nickname, this.dest_roomId, e, this.data)
        }
        ,
        this.setLocalAndSendMessageUpdate = function(e) {
            this.pc.setLocalDescription(e, this.callback(this, "onSetLocalDescriptionSuccess"), this.callback(this, "onSetLocalDescriptionFailure"));
            var t = 0;
            t = this.callee ? this.callerId : this.calleeId,
            this.myWebRTC_Stack.send200Update(this.callId, this.callerId, this.calleeId, this.dest_roomId, t, e, this.data)
        }
        ,
        this.onIceCandidate = function(e) {
            var t = 0
              , n = 0
              , s = 0;
            t = this.callee ? this.callerId : this.calleeId,
            null !== this.pc,
            e.candidate ? this.trickleIce === !0 && (this.mediaRoutingMode === i.mediaRoutingModeEnum.hostOnly ? (n = e.candidate.candidate.search("host"),
            -1 !== n && this.myWebRTC_Stack.sendCandidate(this.callId, this.callerId, this.calleeId, this.dest_roomId, t, e.candidate.sdpMLineIndex, e.candidate.sdpMid, e.candidate.candidate, this.data, e.candidate)) : this.mediaRoutingMode === i.mediaRoutingModeEnum.stun ? (n = e.candidate.candidate.search("host"),
            s = e.candidate.candidate.search("srflx"),
            (-1 !== n || -1 !== s) && this.myWebRTC_Stack.sendCandidate(this.callId, this.callerId, this.calleeId, this.dest_roomId, t, e.candidate.sdpMLineIndex, e.candidate.sdpMid, e.candidate.candidate, this.data, e.candidate)) : this.mediaRoutingMode === i.mediaRoutingModeEnum.stunOnly ? (n = e.candidate.candidate.search("srflx"),
            -1 !== n && this.myWebRTC_Stack.sendCandidate(this.callId, this.callerId, this.calleeId, this.dest_roomId, t, e.candidate.sdpMLineIndex, e.candidate.sdpMid, e.candidate.candidate, this.data, e.candidate)) : this.mediaRoutingMode === i.mediaRoutingModeEnum.turn ? this.myWebRTC_Stack.sendCandidate(this.callId, this.callerId, this.calleeId, this.dest_roomId, t, e.candidate.sdpMLineIndex, e.candidate.sdpMid, e.candidate.candidate, this.data, e.candidate) : this.mediaRoutingMode === i.mediaRoutingModeEnum.turnOnly && (n = e.candidate.candidate.search("relay"),
            -1 !== n && this.myWebRTC_Stack.sendCandidate(this.callId, this.callerId, this.calleeId, this.dest_roomId, t, e.candidate.sdpMLineIndex, e.candidate.sdpMid, e.candidate.candidate, this.data, e.candidate))) : this.trickleIce === !1 && (this.callee === !0 ? this.myWebRTC_Stack.send200OK(this.callId, this.callerId, this.calleeId, i.nickname, this.dest_roomId, this.pc.localDescription, this.data) : (this.myWebRTC_Stack.sendInvite(this.callId, this.callerId, i.nickname, this.dest_roomId, this.dest_roomId, this.pc.localDescription, this.callType, this.data, this.mcuRemoteStream),
            this.inviteSended = !0))
        }
        ,
        this.onRemoteStreamAdded = function(e) {
            var t = null
              , n = 0;
            n = this.callee ? this.callerId : this.calleeId,
            i.hideLocalVideoOnCall === !0 && i.localVideo && ("firefox" === i.myWebRTC_Adapter.webrtcDetectedBrowser ? "" !== i.localVideo.mozSrcObject && (i.localVideo.style.opacity = 0) : "" !== i.localVideo.src && (i.localVideo.style.opacity = 0)),
            i.transitionToActive(),
            i.remoteVideo && (i.remoteVideo.style.opacity = 1),
            t = document.createElement("video"),
            i.remoteVideo && (i.remoteVideo.appendChild(t),
            i.attachMediaStream(t, e.stream),
            t.autoplay = !0,
            t.id = "callId_" + this.callId + "-" + this.calleeId),
            this.screenSharing === !0 ? this.callType = "screenSharing" : this.audioOnly === !0 && (this.callType = "audio"),
            t.oncanplay = i.myWebRTC_Event.createCanPlayRemoteVideoEvent(t.id, this.callType, n),
            i.remoteVideoDisplayManager(),
            null !== this.data ? "publish" === this.data.type || i.myWebRTC_Event.createRemoteStreamAddedEvent(this.callType, this.callId, e.stream, this.remoteId, this.destCallType) : i.myWebRTC_Event.createRemoteStreamAddedEvent(this.callType, this.callId, e.stream, this.remoteId, this.destCallType)
        }
        ,
        this.onRemoteStreamRemoved = function(e) {
            e = null
        }
        ,
        this.onNegotiationNeeded = function(e) {
            e = null,
            this.addingDataChannelOnCallOngoing && (this.updateMedia(!1),
            this.addingDataChannelOnCallOngoing = !1)
        }
        ,
        this.onSignalingStateChange = function(e) {
            e = null
        }
        ,
        this.onCallDisconnection = function() {
            var e = new Date;
            e = null,
            i.removeCallFromTableWithCallIdAndSendBye(this.callId, "Ice_disconnected"),
            0 !== this.disconnectionWarningInterval && (clearInterval(this.disconnectionWarningInterval),
            this.disconnectionWarningInterval = 0)
        }
        ,
        this.sendDisconnectionWarning = function() {
            if (this.disconnectionWarningCount++,
            c.createEvent({
                eventType: "disconnectionWarning",
                callId: this.callId,
                remoteId: this.remoteId,
                tries: this.disconnectionWarningCount
            }),
            (this.disconnectionWarningCount - 1) * this.disconnectionWarningDelay >= this.disconnectionTimer && 0 !== this.disconnectionWarningInterval) {
                {
                    Date()
                }
                clearInterval(this.disconnectionWarningInterval),
                this.disconnectionWarningInterval = 0
            }
        }
        ,
        this.onIceConnectionStateChange = function(e) {
            e = null;
            var t = 0;
            null !== this.pc && (this.iceState = this.pc.iceConnectionState,
            "connected" === this.pc.iceConnectionState || "completed" === this.pc.iceConnectionState || "checking" === this.pc.iceConnectionState ? (0 !== this.disconnectionTimeoutId && (t = Date(),
            clearTimeout(this.disconnectionTimeoutId),
            this.disconnectionTimeoutId = 0),
            0 !== this.disconnectionWarningInterval && (t = Date(),
            clearInterval(this.disconnectionWarningInterval),
            this.disconnectionWarningInterval = 0),
            "checking" !== this.pc.iceConnectionState && this.checkCandidateTypes()) : "disconnected" === this.pc.iceConnectionState ? (c.createErrorEvent("iceDisconnection detected", "ICE_CONNECTION_STATE_DISCONNECTED"),
            t = new Date,
            this.disconnectionTimeoutId = setTimeout(this.callback(this, "onCallDisconnection"), this.disconnectionTimer),
            this.disconnectionWarningCount = 0,
            this.sendDisconnectionWarning(),
            this.disconnectionWarningInterval = setInterval(this.callback(this, "sendDisconnectionWarning"), this.disconnectionWarningDelay)) : "failed" === this.pc.iceConnectionState && (c.createErrorEvent("iceConnection failed detected", "ICE_CONNECTION_STATE_FAILED"),
            0 !== this.disconnectionTimeoutId || i.removeCallFromTableWithCallIdAndSendBye(this.callId, "Ice_failed")))
        }
        ,
        this.callback = function(e, t) {
            return this.closureHandler = function(i, n) {
                return e[t](i, n)
            }
            ,
            this.closureHandler
        }
        ,
        this.preferOpus = function(e) {
            var t = e.split("\r\n")
              , i = 0
              , n = 0
              , s = null;
            for (i = 0; i < t.length; i += 1)
                if (-1 !== t[i].search("m=audio")) {
                    n = i;
                    break
                }
            if (null === n)
                return e;
            for (i = 0; i < t.length; i += 1)
                if (-1 !== t[i].search("opus/48000")) {
                    s = this.extractSdp(t[i], /:(\d+) opus\/48000/i),
                    s && (t[n] = this.setDefaultCodec(t[n], s));
                    break
                }
            return t = this.removeCN(t, n),
            e = t.join("\r\n")
        }
        ,
        this.extractSdp = function(e, t) {
            var i = e.match(t);
            return i && 2 == i.length ? i[1] : null
        }
        ,
        this.setDefaultCodec = function(e, t) {
            var i = 0
              , n = e.split(" ")
              , s = n.slice(0, 3);
            for (s.push(t),
            i = 3; i < n.length; i++)
                n[i] !== t && s.push(n[i]);
            return s.join(" ")
        }
        ,
        this.findLineInRange = function(e, t, i, n, s) {
            var a = -1 !== i ? i : e.length
              , o = t;
            for (o = t; a > o; ++o)
                if (0 === e[o].indexOf(n) && (!s || -1 !== e[o].toLowerCase().indexOf(s.toLowerCase())))
                    return o;
            return null
        }
        ,
        this.findLine = function(e, t, i) {
            return this.findLineInRange(e, 0, -1, t, i)
        }
        ,
        this.getCodecPayloadType = function(e, t) {
            var i = this.findLine(e, "a=rtpmap", t);
            return i ? this.getCodecPayloadTypeFromLine(e[i]) : null
        }
        ,
        this.getCodecPayloadTypeFromLine = function(e) {
            var t = new RegExp("a=rtpmap:(\\d+) \\w+\\/\\d+")
              , i = e.match(t);
            return i && 2 === i.length ? i[1] : null
        }
        ,
        this.findFmtpLine = function(e, t) {
            var i = this.getCodecPayloadType(e, t);
            return i ? this.findLine(e, "a=fmtp:" + i.toString()) : null
        }
        ,
        this.writeFmtpLine = function(e) {
            if (!e.hasOwnProperty("pt") || !e.hasOwnProperty("params"))
                return null;
            var t = e.pt
              , i = e.params
              , n = []
              , s = 0
              , a = null;
            for (a in i)
                n[s] = a + "=" + i[a],
                ++s;
            return 0 === s ? null : "a=fmtp:" + t.toString() + " " + n.join("; ")
        }
        ,
        this.setCodecParam = function(e, t, i, n) {
            var s = e.split("\r\n")
              , o = this.findFmtpLine(s, t)
              , l = {}
              , r = null
              , c = null;
            if (null === o) {
                if (c = this.findLine(s, "a=rtpmap", t),
                null === c)
                    return e;
                r = this.getCodecPayloadTypeFromLine(s[c]),
                l.pt = r.toString(),
                l.params = {},
                l.params[i] = n,
                s.splice(c + 1, 0, this.writeFmtpLine(l))
            } else
                l = a(s[o]),
                l.params[i] = n,
                s[o] = this.writeFmtpLine(l);
            return e = s.join("\r\n")
        }
        ,
        this.maybePreferCodec = function(e, t, i) {
            var n = null
              , s = null
              , a = null;
            return i ? (n = e.split("\r\n"),
            s = this.findLine(n, "m=", t),
            null === s ? e : (a = this.getCodecPayloadType(n, i),
            a && (n[s] = this.setDefaultCodec(n[s], a)),
            e = n.join("\r\n"))) : e
        }
        ,
        this.removeCN = function(e, t) {
            var i = 0
              , n = e[t].split(" ")
              , s = null
              , a = 0;
            for (i = e.length - 1; i >= 0; i--)
                s = this.extractSdp(e[i], /a=rtpmap:(\d+) CN\/\d+/i),
                s && (a = n.indexOf(s),
                -1 !== a && n.splice(a, 1),
                e.splice(i, 1));
            return e[t] = n.join(" "),
            e
        }
        ,
        this.checkCandidateTypes = function() {
            var t = this
              , i = {
                LocalCandidateType: "error",
                RemoteCandidateType: "error"
            }
              , n = ["googLocalCandidateType", "googRemoteCandidateType"];
            if (null === this.pc)
                t.myWebRTC_Event.createICECandidateTypeUpdateEvent(t.callId, i.LocalCandidateType, i.RemoteCandidateType);
            else if (e.chrome)
                this.pc.getStats(function(e) {
                    var s = e.result().filter(function(e) {
                        return 0 === e.id.indexOf("Conn-audio") && "true" === e.stat("googActiveConnection")
                    })[0];
                    s ? (n.forEach(function(e) {
                        i[e.replace("goog", "")] = s.stat(e)
                    }),
                    t.myWebRTC_Event.createICECandidateTypeUpdateEvent(t.callId, i.LocalCandidateType, i.RemoteCandidateType)) : t.myWebRTC_Event.createICECandidateTypeUpdateEvent(t.callId, i.LocalCandidateType, i.RemoteCandidateType)
                });
            else {
                if (navigator.userAgent.search("Firefox") > -1)
                    return this.pc.getStats(null).then(function(e) {
                        var n = e[Object.keys(e).filter(function(t) {
                            return e[t].selected
                        })[0]]
                          , s = e[n.localCandidateId]
                          , a = e[n.remoteCandidateId];
                        i.LocalCandidateType = s.candidateType,
                        i.RemoteCandidateType = a.candidateType,
                        t.myWebRTC_Event.createICECandidateTypeUpdateEvent(t.callId, i.LocalCandidateType, i.RemoteCandidateType)
                    });
                t.myWebRTC_Event.createICECandidateTypeUpdateEvent(t.callId, i.LocalCandidateType, i.RemoteCandidateType)
            }
        }
    }
    ,
    m = function(i) {
        function n(e, t, i) {
            var n = e.width
              , s = n << 2
              , a = e.height
              , o = null
              , l = 0
              , r = 0
              , c = 0
              , d = 0
              , h = 0
              , u = 0
              , C = 0
              , p = 0
              , m = 0
              , v = 0
              , g = 0
              , f = 0
              , T = 0
              , I = 0
              , b = 0
              , y = 0
              , R = 0;
            if (t) {
                for (o = t.data,
                0 > i && (i = 0),
                l = i >= 2.5 ? .98711 * i - .9633 : i >= .5 ? 3.97156 - 4.14554 * Math.sqrt(1 - .26891 * i) : 2 * i * (3.97156 - 4.14554 * Math.sqrt(.865545)),
                r = l * l,
                c = r * l,
                d = 1.57825 + 2.44413 * l + 1.4281 * r + .422205 * c,
                h = (2.44413 * l + 2.85619 * r + 1.26661 * c) / d,
                u = -(1.4281 * r + 1.26661 * c) / d,
                C = .422205 * c / d,
                p = 1 - (h + u + C),
                m = 0; 3 > m; m++)
                    for (v = 0; a > v; v++) {
                        for (g = v * s + m,
                        f = v * s + (n - 1 << 2) + m,
                        T = o[g],
                        I = T,
                        b = I,
                        y = b,
                        g = v * s + m; f >= g; g += 4)
                            T = p * o[g] + h * I + u * b + C * y,
                            o[g] = T,
                            y = b,
                            b = I,
                            I = T;
                        for (g = v * s + (n - 1 << 2) + m,
                        f = v * s + m,
                        T = o[g],
                        I = T,
                        b = I,
                        y = b,
                        g = v * s + (n - 1 << 2) + m; g >= f; g -= 4)
                            T = p * o[g] + h * I + u * b + C * y,
                            o[g] = T,
                            y = b,
                            b = I,
                            I = T
                    }
                for (m = 0; 3 > m; m++)
                    for (R = 0; n > R; R++) {
                        for (g = (R << 2) + m,
                        f = (a - 1) * s + (R << 2) + m,
                        T = o[g],
                        I = T,
                        b = I,
                        y = b,
                        g = (R << 2) + m; f >= g; g += s)
                            T = p * o[g] + h * I + u * b + C * y,
                            o[g] = T,
                            y = b,
                            b = I,
                            I = T;
                        for (g = (a - 1) * s + (R << 2) + m,
                        f = (R << 2) + m,
                        T = o[g],
                        I = T,
                        b = I,
                        y = b,
                        g = (a - 1) * s + (R << 2) + m; g >= f; g -= s)
                            T = p * o[g] + h * I + u * b + C * y,
                            o[g] = T,
                            y = b,
                            b = I,
                            I = T
                    }
                return t
            }
        }
        function s(e) {
            var t = new RegExp("^[0-9a-z._-]+@{1}[0-9a-z.-]{2,}[.]{1}[a-z]{2,5}$","i");
            return t.test(e)
        }
        this.localVideo = null,
        this.miniVideo = null,
        this.remoteVideo = null,
        this.localStream = null,
        this.statusDiv = null,
        this.commandDiv = null,
        this.remoteStream = null,
        this.channelReady = !1,
        this.socket = i.channel.socket,
        this.clientId = i.apiCCId,
        this.apiKey = i.apiKey,
        this.isVideoMuted = !1,
        this.isAudioMuted = !1,
        this.callURLDestRoom = 0,
        this.addingUserMedia = !1,
        this.callsTable = [],
        this.accessToLocalMedia = !1,
        this.unidirectionelCallOnly = !1,
        this.NtoNConf = !1,
        this.autoAnswer = !1,
        this.RTPMedia = !1,
        this.logoAdded = !1,
        this.preferOpusCodec = !1,
        this.preferVP9Codec = !0,
        this.setStereo = !1,
        this.allowedAudioCodecs = "",
        this.allowedVideoCodecs = "",
        this.mediaRoutingModeEnum = {
            hostOnly: 1,
            stun: 2,
            stunOnly: 3,
            turn: 4,
            turnOnly: 5
        },
        this.mediaRoutingMode = this.mediaRoutingModeEnum.turn,
        this.myWebRTC_Event = new r,
        this.myWebRTC_Adapter = new C,
        this.getUserMediaOnGoing = !1,
        this.userAcceptOnIncomingCall = !1,
        this.maxWidthRemoteVideo = 0,
        this.maxHeightRemoteVideo = 0,
        this.nickname = i.nickname,
        this.hideLocalVideoOnCall = !0,
        this.allowMultipleCalls = !1,
        this.mySDPManager = new v,
        this.MCUClient = new T(this,this.clientId),
        this.audioSourceId = null,
        this.audioOutputId = null,
        this.videoSourceId = null,
        this.apiRTCExtensionInstalled = !1,
        this.trickleIce = !0,
        this.waitingShareScreenCallId = 0,
        this.waitingShareScreenDestNumber = 0,
        this.qosEnable = !1,
        this.qosInterval = 5e3,
        this.recordedCall = !1,
        this.audioBandwidth = null,
        this.videoBandwidth = null,
        this.dataBandwidth = null,
        this.pc_config = "",
        this.gum_config = {
            audio: {
                mandatory: {},
                optional: []
            },
            video: {
                mandatory: {},
                optional: []
            }
        },
        this.audioDevicePresent = !1,
        this.videoDevicePresent = !1,
        this.videoOutputPresent = !1,
        this.userMediaErrorDetected = !1,
        this.lastUsedUserMediaConstraint = null,
        this.mediaTypeForIncomingCall = "VIDEO",
        this.mediaTypeForOutgoingCall = "VIDEO",
        this.allowAsymetricMediaCalls = !1,
        this.pc_config = "firefox" === this.myWebRTC_Adapter.webrtcDetectedBrowser ? this.myWebRTC_Adapter.webrtcDetectedVersion < 38 ? {
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
        } : "IE" === g || "Safari" === g ? {
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
        },
        this.pc_constraints = {
            optional: []
        },
        this.recordMgr = null,
        i.recordActivated === !0 && (this.recordMgr = "https:" != e.location.protocol ? new b(this,"https://beta.apizee.com/contactBox.php/main/uploadFile") : new b(this,"http://beta.apizee.com/contactBox.php/main/uploadFile")),
        this.initialize = function(e, t, i, n, s) {
            this.localVideo = document.getElementById(e),
            null === this.localVideo,
            this.miniVideo = document.getElementById(t),
            null === this.miniVideo,
            this.remoteVideo = document.getElementById(i),
            null === this.remoteVideo,
            this.statusDiv = document.getElementById(n),
            null === this.statusDiv,
            this.commandDiv = document.getElementById(s),
            null === this.commandDiv || this.displayCallButtonInCommand(),
            this.callURLDestRoom = this.checkURLForCallDestination(),
            0 !== this.callURLDestRoom && (this.callperURL(this.callURLDestRoom),
            this.callURLDestRoom = 0),
            this.initMediaElementState(),
            this.setStatus("<div style='font-size:18px;color:orange'>Registered! <br>You can be reached at:  : " + this.clientId + "</div>")
        }
        ,
        this.getMediaDevices = function(e) {
            if (navigator.mediaDevices && navigator.mediaDevices.enumerateDevices)
                navigator.mediaDevices.enumerateDevices().then(e)["catch"](function(e) {
                    e = null
                });
            else if ("undefined" == typeof MediaStreamTrack)
                e(null);
            else
                try {
                    MediaStreamTrack.getSources(e)
                } catch (t) {
                    e(null)
                }
        }
        ,
        this.gotSources = function(e) {
            var t = 0
              , i = null
              , n = null
              , s = {};
            if (null !== e)
                for (t = 0; t != e.length; ++t)
                    i = e[t],
                    n = document.createElement("option"),
                    n.value = i.id,
                    "audio" === i.kind || "audioinput" === i.kind ? d.session.apiCCWebRTCClient.webRTCClient.audioDevicePresent = !0 : "video" === i.kind || "videoinput" === i.kind ? d.session.apiCCWebRTCClient.webRTCClient.videoDevicePresent = !0 : "audiooutput" === i.kind && (d.session.apiCCWebRTCClient.webRTCClient.videoOutputPresent = !0);
            else
                d.session.apiCCWebRTCClient.webRTCClient.audioDevicePresent = !0,
                d.session.apiCCWebRTCClient.webRTCClient.videoDevicePresent = !0,
                d.session.apiCCWebRTCClient.webRTCClient.videoOutputPresent = !0;
            d.session.apiCCWebRTCClient.webRTCClient.audioDevicePresent === !1 && c.createErrorEvent("Audio device is not present", "NO_AUDIO_DEVICE"),
            d.session.apiCCWebRTCClient.webRTCClient.videoDevicePresent === !1 && c.createErrorEvent("Video device is not present", "NO_VIDEO_DEVICE"),
            d.session.apiCCWebRTCClient.webRTCClient.audioDevicePresent === !1 && (d.session.apiCCWebRTCClient.webRTCClient.gum_config.audio = !1),
            d.session.apiCCWebRTCClient.webRTCClient.videoDevicePresent === !1 && (d.session.apiCCWebRTCClient.webRTCClient.gum_config.video = !1),
            d.session.apiCCWebRTCClient.webRTCClient.audioDevicePresent === !1 && d.session.apiCCWebRTCClient.webRTCClient.videoDevicePresent === !1 && (d.session.apiCCWebRTCClient.webRTCClient.unidirectionelCallOnly = !0),
            s.audioDevicePresent = d.session.apiCCWebRTCClient.webRTCClient.audioDevicePresent,
            s.videoDevicePresent = d.session.apiCCWebRTCClient.webRTCClient.videoDevicePresent,
            d.session.setUserData(s),
            c.createWebRTCClientCreatedEvent()
        }
        ,
        this.attachMediaStream = function(e, t) {
            "undefined" != typeof e.srcObject ? e.srcObject = t : "undefined" != typeof e.mozSrcObject ? e.mozSrcObject = t : "undefined" != typeof e.src && (e.src = URL.createObjectURL(t))
        }
        ,
        this.activateScreenSharing = function(i) {
            var n = null
              , s = null;
            i !== t || (i = "mjjnofoemoepfididplbfimokpnpcoeg"),
            "chrome" === this.myWebRTC_Adapter.webrtcDetectedBrowser ? (n = document.getElementById(i),
            null !== n ? e.postMessage("apiRTC-extension", "*") : (s = document.createElement("link"),
            s.href = "https://chrome.google.com/webstore/detail/" + i,
            s.rel = "chrome-webstore-item",
            s.id = i,
            document.getElementsByTagName("head")[0].appendChild(s),
            e.postMessage("apiRTC-extension", "*"),
            e.addEventListener("message", function(i) {
                var n = d.session.apiCCWebRTCClient.webRTCClient
                  , s = null;
                i.origin == e.location.origin && ("apiRTC-DeskstopCapture-loaded" == i.data && (n.apiRTCExtensionInstalled = !0),
                i.data.desktopId != t && "mediaError" != i.data.desktopId && (s = d.session.apiCCWebRTCClient.webRTCClient.findCallWithCallId(i.data.callNumber),
                d.session.apiCCWebRTCClient.webRTCClient.setStatus("Calling Destination number :" + s.calleeId),
                s.desktopId = i.data.desktopId,
                "screenSharing" === s.callType ? s.getUserMediaOnCall() : s.getScreenUserMediaOnCall()),
                "mediaError" == i.data.desktopId && (s = d.session.apiCCWebRTCClient.webRTCClient.findCallWithCallId(i.data.callNumber),
                "screenSharing" === s.callType && d.session.apiCCWebRTCClient.webRTCClient.removeCallFromTableWithCallIdandRemoteId(i.data.callNumber, i.data.remoteId, "Media_Error"),
                "https:" != e.location.protocol,
                c.createDesktopCaptureEvent("UserMediaError", i.data.callNumber, i.data.remoteId)),
                "extensionInstalledAndLoaded" == i.data && 0 !== d.session.apiCCWebRTCClient.webRTCClient.waitingShareScreenCallId && (e.postMessage({
                    command: "getDesktopId",
                    callNumber: d.session.apiCCWebRTCClient.webRTCClient.waitingShareScreenCallId,
                    remoteId: d.session.apiCCWebRTCClient.webRTCClient.waitingShareScreenDestNumber
                }, "*"),
                d.session.apiCCWebRTCClient.webRTCClient.waitingShareScreenCallId = 0,
                d.session.apiCCWebRTCClient.webRTCClient.waitingShareScreenDestNumber = 0))
            }))) : c.createDesktopCaptureEvent("Browser_Not_Compatible", null, null)
        }
        ,
        this.onSetLocalDescriptionSuccess = function() {}
        ,
        this.onSetLocalDescriptionFailure = function(e) {
            e = null
        }
        ,
        this.onSetRemoteDescriptionSuccess = function() {}
        ,
        this.onSetRemoteDescriptionFailure = function(e) {
            e = null
        }
        ,
        this.setGetUserMediaConfig = function(e) {
            this.gum_config = e
        }
        ,
        this.getUserMedia = function() {
            var e = null
              , i = null;
            try {
                null === this.audioSourceId && null === this.videoSourceId ? e = this.gum_config : (this.gum_config.audio.optional = [{
                    sourceId: this.audioSourceId
                }],
                this.gum_config.video.optional = [{
                    sourceId: this.videoSourceId
                }],
                e = this.gum_config),
                this.lastUsedUserMediaConstraint = e,
                navigator.mediaDevices !== t && navigator.mediaDevices.getUserMedia !== t ? i = navigator.mediaDevices.getUserMedia(e).then(this.callback(this, "onUserMediaSuccess"))["catch"](this.callback(this, "onUserMediaError")) : this.myWebRTC_Adapter.getUserMedia(e, this.callback(this, "onUserMediaSuccess"), this.callback(this, "onUserMediaError"))
            } catch (n) {
                alert("getUserMedia() failed. Is this a WebRTC capable browser?")
            }
        }
        ,
        this.onUserMediaSuccess = function(e) {
            this.accessToLocalMedia = !0;
            var t = !1
              , i = "Unknown"
              , n = !1
              , s = "Unknown";
            this.miniVideo && this.attachMediaStream(this.miniVideo, e),
            this.localVideo && (this.attachMediaStream(this.localVideo, e),
            this.localVideo.style.opacity = 1),
            this.localStream = e,
            e.getAudioTracks().length > 0 && (t = !0,
            e.getAudioTracks()[0].label && (i = e.getAudioTracks()[0].label)),
            e.getVideoTracks().length > 0 && (n = !0,
            e.getVideoTracks()[0].label && (s = e.getVideoTracks()[0].label)),
            this.myWebRTC_Event.createUserMediaSuccessEvent(!1, t, i, n, s, "media", null, e, null)
        }
        ,
        this.onUserMediaError = function(t) {
            t = null,
            this.accessToLocalMedia = !1,
            "Chrome" === g && this.myWebRTC_Adapter.webrtcDetectedVersion > 47 && "https:" != e.location.protocol && alert("HTTPS is now mandatory to use getUserMedia()"),
            this.myWebRTC_Event.createUserMediaErrorEvent(!1, "media"),
            d.session.tryAudioCallAfterUserMediaError === !0 && this.lastUsedUserMediaConstraint.video !== !1 && (this.videoSourceId = null,
            this.gum_config.video = !1,
            this.getUserMedia())
        }
        ,
        this.checkDestCallTypeWithSDP = function(e, i) {
            var n = !0
              , s = !0
              , a = null
              , o = !1
              , l = !1
              , r = null
              , c = !1
              , d = !1
              , h = !0
              , u = !0;
            r = this.mySDPManager.getAudioMediaDescriptionPart(e),
            r !== t && null !== r ? (c = this.mySDPManager.searchSDPForRecvOnly(r),
            c === !1 && (d = this.mySDPManager.searchSDPForInactive(r))) : n = !1,
            a = this.mySDPManager.getVideoMediaDescriptionPart(e),
            a !== t ? (o = this.mySDPManager.searchSDPForRecvOnly(a),
            o === !1 && (l = this.mySDPManager.searchSDPForInactive(a))) : s = !1,
            (c === !0 || d === !0 || n === !1) && (h = !1),
            (o === !0 || l === !0 || s === !1) && (u = !1),
            i.destCallType = h === !0 ? u === !0 ? "media" : "audioOnly" : u === !0 ? "videoOnly" : "none"
        }
        ,
        this.processInvite = function(e) {
            var i = 0
              , n = null
              , s = 0;
            if (n = new p(this),
            n.callId = e.callId,
            n.callerId = e.callerId,
            n.calleeId = this.clientId,
            n.dest_roomId = e.roomId,
            n.callee = !0,
            n.remoteId = e.callerId,
            n.data = e.data,
            n.receivedSdpOfferMessage = e.sdpoffer,
            e.data !== t && "sipConnector" === e.data.pubSub && (n.trickleIce = !1,
            n.remoteType = "sip"),
            n.checkDTLSCompliancy(),
            i = this.callsTable.length,
            "screenSharing" === e.callType)
                n.screenSharing = !0,
                n.callType = "screenSharing";
            else if ("data" === e.callType)
                ;
            else if (this.allowMultipleCalls === !1)
                for (s = 0; i > s; s += 1)
                    if ("screenSharing" !== this.callsTable[s].callType && "data" !== this.callsTable[s].callType)
                        return i = this.callsTable.push(n),
                        this.myWebRTC_Event.createCallAttemptEvent(this.clientId, e.callerId, e.callerNickname, n.callId),
                        void this.refuseCall(n.callId, "User_Busy");
            i = this.callsTable.push(n),
            "audio" === e.callType && (n.audioOnly = !0,
            n.callType = "audio"),
            this.checkDestCallTypeWithSDP(e.sdpoffer.sdp, n),
            this.autoAnswer === !0 && this.displayHangUpButtonInCommand(),
            "data" === e.callType ? (n.callType = "data",
            n.dataCall = !0,
            this.setStatus("Incoming data Call from ongoing :" + e.callerId),
            n.onUserMediaSuccessTestUni(),
            this.myWebRTC_Event.createIncomingCallEvent(this.clientId, e.callerId, e.callerNickname, n.callId, !1, i, !1, e.callType, !1, n.remoteType, n.destCallType)) : this.unidirectionelCallOnly || n.screenSharing === !0 ? (this.unidirectionelCallOnly && this.setStatus("You are connected to " + e.callerId + ', your audio and video media are not transmitted. <input type="button" id="AddMedia" value="Activate Audio & Video" onclick="apiCC.session.apiCCWebRTCClient.addMedia(' + n.callId + ')" />'),
            n.screenSharing === !0 ? (this.setStatus("Screensharing session activated, accepting unidirectionnel call"),
            n.onUserMediaSuccessTestUni()) : this.userAcceptOnIncomingCall || n.onUserMediaSuccessTestUni(),
            this.myWebRTC_Event.createIncomingCallEvent(this.clientId, e.callerId, e.callerNickname, n.callId, !1, i, !1, e.callType, !1, n.remoteType, n.destCallType)) : this.accessToLocalMedia === !0 && this.autoAnswer === !0 ? (this.setStatus("You are connected to :" + e.callerId),
            this.myWebRTC_Event.createIncomingCallEvent(this.clientId, e.callerId, e.callerNickname, n.callId, !0, i, n.audioOnly, e.callType, !1, n.remoteType, n.destCallType),
            this.userAcceptOnIncomingCall || n.establishCall()) : (this.setStatus("Incoming Call from :" + e.callerId + '. Click on "Autoriser" button to accept.'),
            this.myWebRTC_Event.createIncomingCallEvent(this.clientId, e.callerId, e.callerNickname, n.callId, !1, i, n.audioOnly, e.callType, !1, n.remoteType, n.destCallType),
            n.audioOnly === !0 && d.session.apiCCWebRTCClient.webRTCClient.audioDevicePresent === !1 ? (this.setStatus("You are connected to " + e.callerId + ', your audio and video media are not transmitted. <input type="button" id="AddMedia" value="Activate Audio & Video" onclick="apiCC.session.apiCCWebRTCClient.addMedia(' + n.callId + ')" />'),
            n.onUserMediaSuccessTestUni()) : n.getUserMediaOnCall())
        }
        ,
        this.process200OK = function(e) {
            var i = null
              , n = null
              , s = null
              , o = 0
              , l = null;
            if (i = this.findCallWithCallIdAndRemoteId(e.callId, e.calleeId),
            null === i) {
                if (n = this.findCallWithCallId(e.callId),
                null === n)
                    return void this.myWebRTC_Event.createErrorEvent("200OK received but callId is not matching, no process", "NOT_MATCHING_CALLID_ON_200OK");
                s = new p(this),
                s.callId = e.callId,
                s.callerId = e.callerId,
                s.calleeId = e.calleeId,
                s.dest_roomId = e.roomId,
                s.callee = !1,
                s.remoteId = e.calleeId,
                s.createPeerConnection(),
                s.sendedSdpOfferMessage = n.sendedSdpOfferMessage,
                s.audioOnly = !1,
                i.checkDTLSCompliancy();
                try {
                    s.callLocalStream = new webkitMediaStream(n.callLocalStream.getAudioTracks(),n.callLocalStream.getVideoTracks())
                } catch (r) {
                    s.callLocalStream = new webkitMediaStream(n.callLocalStream)
                }
                s.generatedLocalStream = !0,
                s.started = !0,
                o = this.callsTable.push(s),
                s.pc.addStream(n.callLocalStream),
                s.pc.setLocalDescription(s.sendedSdpOfferMessage, this.callback(this, "onSetLocalDescriptionSuccess"), this.callback(this, "onSetLocalDescriptionFailure")),
                l = new this.myWebRTC_Adapter.RTCSessionDescription(e.sdpanswer),
                s.pc.setRemoteDescription(l, this.callback(this, "onSetRemoteDescriptionSuccess"), this.callback(this, "onSetRemoteDescriptionFailure")),
                this.setStatus("You are connected to :" + e.calleeId),
                this.myWebRTC_Event.createCallEstablishedEvent(e.calleeId, "media", s.callId, s.destCallType)
            } else
                i.calleeId = e.calleeId,
                this.checkDestCallTypeWithSDP(e.sdpanswer.sdp, i),
                i.trickleIce === !0 && i.pc.setLocalDescription(i.sendedSdpOfferMessage, this.callback(this, "onSetLocalDescriptionSuccess"), this.callback(this, "onSetLocalDescriptionFailure")),
                l = new this.myWebRTC_Adapter.RTCSessionDescription(e.sdpanswer),
                i.receivedSdpOfferMessage = e.sdpanswer,
                i.pc.setRemoteDescription(l, this.callback(this, "onSetRemoteDescriptionSuccess"), this.callback(this, "onSetRemoteDescriptionFailure")),
                this.setStatus("You are connected to :" + e.calleeId),
                i.screenSharing === !0 && (i.callType = "screenSharing"),
                null !== e.data && e.data !== t && (i.data = null !== i.data && i.data !== t ? a(i.data, e.data) : e.data),
                this.myWebRTC_Event.createCallEstablishedEvent(e.calleeId, i.callType, i.callId, i.destCallType)
        }
        ,
        this.processCandidate = function(e) {
            var i = null
              , n = null;
            i = e.callerId === this.clientId ? this.findCallWithCallIdAndRemoteId(e.callId, e.calleeId) : this.findCallWithCallIdAndRemoteId(e.callId, e.callerId),
            null !== i && i.started && null !== i.pc && (n = new this.myWebRTC_Adapter.RTCIceCandidate(e.completeCandidate !== t ? {
                sdpMLineIndex: e.completeCandidate.sdpMLineIndex,
                candidate: e.completeCandidate.candidate
            } : {
                sdpMLineIndex: e.label,
                candidate: e.candidate
            }),
            i.pc.addIceCandidate(n, function() {}, function(e) {
                e = null
            }))
        }
        ,
        this.processUpdate = function(e) {
            var t = null
              , i = null;
            return t = e.callerId === this.clientId ? this.findCallWithCallIdAndRemoteId(e.callId, e.calleeId) : this.findCallWithCallIdAndRemoteId(e.callId, e.callerId),
            null === t ? void this.myWebRTC_Event.createErrorEvent("Cannot find call to process Update", "CALL_NOT_FOUND_ON_UPDATE") : (i = new this.myWebRTC_Adapter.RTCSessionDescription(e.sdpoffer),
            t.pc.setRemoteDescription(i, this.callback(this, "onSetRemoteDescriptionSuccess"), this.callback(this, "onSetRemoteDescriptionFailure")),
            void t.doUpdateAnswer())
        }
        ,
        this.process200Update = function(e) {
            this.setStatus("You are connected to :" + e.calleeId);
            var t = null
              , i = null;
            return t = this.findCallWithRoomId(e.roomId),
            null === t ? void this.myWebRTC_Event.createErrorEvent("Cannot find call to process 200 Update", "CALL_NOT_FOUND_ON_200UPDATE") : (t.calleeId = e.calleeId,
            t.pc.setLocalDescription(t.sendedSdpOfferMessage, this.callback(this, "onSetLocalDescriptionSuccess"), this.callback(this, "onSetLocalDescriptionFailure")),
            i = new this.myWebRTC_Adapter.RTCSessionDescription(e.sdpanswer),
            t.pc.setRemoteDescription(i, this.callback(this, "onSetRemoteDescriptionSuccess"), this.callback(this, "onSetRemoteDescriptionFailure")),
            void (this.addingUserMedia === !0 && (this.miniVideo && (this.miniVideo.style.opacity = 1),
            this.addingUserMedia = !1)))
        }
        ,
        this.onHangup = function(e) {
            this.setStatus("<div style='font-size:18px;color:orange'>Registered! <br>You can be reached at: " + this.clientId + "</div>"),
            this.initMediaElementState(),
            e === t ? this.removeAllCalls() : this.removeCallFromTableWithCallIdAndSendBye(e, null),
            this.displayCallButtonInCommand()
        }
        ,
        this.stopStream = function(e) {
            var t = 0
              , i = null;
            if ("Chrome" === g && this.myWebRTC_Adapter.webrtcDetectedVersion >= 45 || "Firefox" === g && this.myWebRTC_Adapter.webrtcDetectedVersion >= 44 || "Opera" === g && this.myWebRTC_Adapter.webrtcDetectedVersion >= 34 || "Chromium" === g && this.myWebRTC_Adapter.webrtcDetectedVersion >= 44)
                for (e.onended = null,
                i = e.getTracks(),
                t = 0; t < i.length; t += 1)
                    i[t].onended = null,
                    i[t].stop(); 
            else
             //   e.onended = null,
            //    e.stop();
            e = null
        }
        ,
        this.removeAllCalls = function() {
            var e = this.callsTable.length
              , i = 0
              , n = 0
              , s = null
              , a = null
              , o = 0;
            for (i = 0; e > i; i += 1) {
                if (n = 0,
                n = this.callsTable[i - o].callee ? this.callsTable[i - o].callerId : this.callsTable[i - o].calleeId,
                this.callsTable[i - o].callee === !0)
                    a = "Hangup_From_Callee",
                    this.callsTable[i - o].myWebRTC_Stack.sendBye(this.callsTable[i - o].callId, this.clientId, this.callsTable[i - o].dest_roomId, n, a, this.callsTable[i - o].data);
                else {
                    if (a = "Hangup_From_Caller",
                    this.callsTable[i - o].inviteSended !== !0) {
                        this.callsTable[i - o].callCancelled = !0;
                        continue
                    }
                    this.callsTable[i - o].myWebRTC_Stack.sendBye(this.callsTable[i - o].callId, this.clientId, this.callsTable[i - o].dest_roomId, n, a, this.callsTable[i - o].data)
                }
                null !== this.callsTable[i - o].callLocalStream && (this.callsTable[i - o].generatedLocalStream === !0 || this.autoAnswer === !1 && this.stopStream(this.callsTable[i - o].callLocalStream)),
                null !== this.callsTable[i - o].screenStream && this.stopStream(this.callsTable[i - o].screenStream),
                null !== this.callsTable[i - o].pc && (this.qosEnable && "undefined" != typeof this.callsTable[i - o].qm && null !== this.callsTable[i - o].qm && "function" == typeof this.callsTable[i - o].qm.saveStatsToDb && (this.callsTable[i - o].qm.saveStatsToDb(!0),
                clearInterval(this.callsTable[i - o].statisticId)),
                this.callsTable[i - o].pc.close(),
                this.callsTable[i - o].pc = null),
                s = this.callsTable[i - o].callId + "-" + this.callsTable[i - o].calleeId,
                this.removeRemoteVideoDisplay(s),
                this.myWebRTC_Event.createHangupEvent("local", this.clientId, 0, !0, a, this.callsTable[i - o].callId, this.callsTable[i - o].callType),
                this.callsTable[i - o].data !== t && null !== this.callsTable[i - o].data && ("MCU-Caller" === this.callsTable[i - o].data.MCUType || "MCU-Callee" === this.callsTable[i - o].data.MCUType) && this.myWebRTC_Event.createRecordedStreamsAvailableEvent(this.callsTable[i - o].data.confId, this.callsTable[i - o].callerId, this.callsTable[i - o].calleeId),
                this.callsTable.splice(i - o, 1),
                o += 1
            }
        }
        ,
        this.onRemoteHangup = function(e, n, s, a, o, l) {
            var r = null;
            e !== t ? r = this.removeCallFromTableWithCallIdandRemoteId(e, n, a) : o !== t && (r = this.removeCallFromTableWithConfIdandRemoteId(o, n, a)),
            this.setStatus(a === t ? "<div>Your partner : " + n + " have left the call. <br>You can be reached at:  : " + this.clientId + "</div>" : "<div><span style='color:red;font-size:16px'>Call Terminated.</span> <span style='color:#000; font-size:16px'>Details: " + a + ".</span> <span style='font-size:16px;color: grey'><br>You can be reached at: " + this.clientId + "</span></div>"),
            0 === this.callsTable.length ? (this.initMediaElementState(),
            this.myWebRTC_Event.createRemoteHangupEvent(this.clientId, n, !0, a),
            this.myWebRTC_Event.createHangupEvent("remote", this.clientId, n, !0, a, e, r),
            this.displayCallButtonInCommand(),
            this.getUserMediaOnGoing === !0 && i.deactivateReloadOnCancel !== !0 && (location.reload(),
            this.getUserMediaOnGoing = !1)) : (this.myWebRTC_Event.createRemoteHangupEvent(this.clientId, n, !1, a),
            this.myWebRTC_Event.createHangupEvent("remote", this.clientId, n, !1, a, e, r)),
            l !== t && null !== l && ("MCU-Caller" === l.MCUType || "MCU-Callee" === l.MCUType) && this.myWebRTC_Event.createRecordedStreamsAvailableEvent(o, this.clientId, n)
        }
        ,
        this.removeCallFromTableWithCallIdAndSendBye = function(e, t) {
            var i = 0
              , n = null
              , s = 0
              , a = null;
            i = this.findCallIndexWithCallId(e),
            -1 !== i && (null !== this.callsTable[i].callLocalStream && (this.callsTable[i].generatedLocalStream === !0 || this.autoAnswer === !1 && this.stopStream(this.callsTable[i].callLocalStream)),
            null !== this.callsTable[i].screenStream && this.stopStream(this.callsTable[i].screenStream),
            null !== this.callsTable[i].pc && (this.qosEnable && "undefined" != typeof this.callsTable[i].qm && null !== this.callsTable[i].qm && "function" == typeof this.callsTable[i].qm.saveStatsToDb && (this.callsTable[i].qm.saveStatsToDb(!0),
            clearInterval(this.callsTable[i].statisticId)),
            this.callsTable[i].pc.close(),
            this.callsTable[i].pc = null),
            n = this.callsTable[i].callId + "-" + this.callsTable[i].calleeId,
            this.removeRemoteVideoDisplay(n),
            this.callsTable[i].callee ? (a = this.callsTable[i].callerId,
            null === t && (t = "Hangup_From_Callee")) : (a = this.callsTable[i].calleeId,
            null === t && (t = "Hangup_From_Caller")),
            this.callsTable[i].myWebRTC_Stack.sendBye(this.callsTable[i].callId, this.clientId, this.callsTable[i].dest_roomId, a, t, this.callsTable[i].data),
            this.myWebRTC_Event.createHangupEvent("local", this.clientId, 0, !0, t, this.callsTable[i].callId, this.callsTable[i].callType),
            this.callsTable.splice(i, 1),
            s = this.callsTable.length,
            this.miniVideo && 0 !== s && this.attachMediaStream(this.miniVideo, this.callsTable[0].callLocalStream)),
            this.MCUClient.publishCallId === e && (this.publishCallId = null)
        }
        ,
        this.removeCall = function(e) {
            var t = null
              , i = 0
              , n = null;
            return -1 !== e && (null !== this.callsTable[e].callLocalStream && (this.callsTable[e].generatedLocalStream === !0 || this.autoAnswer === !1 && this.stopStream(this.callsTable[e].callLocalStream)),
            null !== this.callsTable[e].screenStream && this.stopStream(this.callsTable[e].screenStream),
            null !== this.callsTable[e].pc && (this.qosEnable && "undefined" != typeof this.callsTable[e].qm && null !== this.callsTable[e].qm && "function" == typeof this.callsTable[e].qm.saveStatsToDb && (this.callsTable[e].qm.saveStatsToDb(!0),
            clearInterval(this.callsTable[e].statisticId)),
            this.callsTable[e].pc.close(),
            this.callsTable[e].pc = null),
            t = this.callsTable[e].callId + "-" + this.callsTable[e].calleeId,
            this.removeRemoteVideoDisplay(t),
            n = this.callsTable[e].callType,
            this.callsTable.splice(e, 1),
            i = this.callsTable.length,
            this.miniVideo && 0 !== i && this.attachMediaStream(this.miniVideo, this.callsTable[0].callLocalStream)),
            n
        }
        ,
        this.removeCallFromTableWithConfIdandRemoteId = function(e, t, i) {
            i = null;
            var n = null
              , s = null;
            return n = this.findCallIndexWithConfIdAndRemoteId(e, t),
            s = this.removeCall(n)
        }
        ,
        this.removeCallFromTableWithCallIdandRemoteId = function(e, t, i) {
            i = null;
            var n = 0
              , s = null;
            return n = this.findCallIndexWithCallIdAndRemoteId(e, t),
            s = this.removeCall(n)
        }
        ,
        this.transitionToActive = function() {
            this.remoteVideo && (this.remoteVideo.style.opacity = 1),
            setTimeout(this.callback(this, "callback2"), 1e3)
        }
        ,
        this.callback2 = function() {
            this.miniVideo && (this.miniVideo.style.opacity = 1)
        }
        ,
        this.initMediaElementState = function() {
            this.autoAnswer === !1 ? this.localVideo && (this.localVideo.style.opacity = 0,
            this.localVideo.src = "") : this.localVideo && (this.localVideo.style.opacity = 1),
            this.remoteVideo && (this.remoteVideo.style.opacity = 0,
            this.remoteVideo.src = ""),
            this.miniVideo && (this.miniVideo.style.opacity = 0),
            this.autoAnswer === !0 || this.miniVideo && (this.miniVideo.src = "")
        }
        ,
        this.toggleVideoMute = function() {
            var e = 0
              , t = this.callsTable.length;
            if (this.isVideoMuted)
                for (null !== this.localStream && this.unMuteTracks(this.localStream.getVideoTracks()),
                e = 0; t > e; e += 1)
                    null !== this.callsTable[e].callLocalStream && this.unMuteTracks(this.callsTable[e].callLocalStream.getVideoTracks());
            else
                for (null !== this.localStream && this.muteTracks(this.localStream.getVideoTracks()),
                e = 0; t > e; e += 1)
                    null !== this.callsTable[e].callLocalStream && this.muteTracks(this.callsTable[e].callLocalStream.getVideoTracks());
            this.isVideoMuted = !this.isVideoMuted
        }
        ,
        this.unMuteTracks = function(e) {
            var t = 0;
            if (0 !== e.length)
                for (t = 0; t < e.length; t += 1)
                    e[t].enabled = !0
        }
        ,
        this.muteTracks = function(e) {
            var t = 0;
            if (0 !== e.length)
                for (t = 0; t < e.length; t += 1)
                    e[t].enabled = !1
        }
        ,
        this.toggleAudioMute = function() {
            var e = 0
              , t = this.callsTable.length;
            if (this.isAudioMuted)
                for (null !== this.localStream && this.unMuteTracks(this.localStream.getAudioTracks()),
                e = 0; t > e; e += 1)
                    null !== this.callsTable[e].callLocalStream && this.unMuteTracks(this.callsTable[e].callLocalStream.getAudioTracks());
            else
                for (null !== this.localStream && this.muteTracks(this.localStream.getAudioTracks()),
                e = 0; t > e; e += 1)
                    null !== this.callsTable[e].callLocalStream && this.muteTracks(this.callsTable[e].callLocalStream.getAudioTracks());
            this.isAudioMuted = !this.isAudioMuted
        }
        ,
        this.xhr = function(e, t, i, n) {
            var s = new XMLHttpRequest;
            s.onreadystatechange = function() {
                4 == s.readyState && 200 == s.status && i(s.responseText)
            }
            ,
            "undefined" != typeof n && (s.upload.onprogress = n),
            s.open("POST", e),
            s.send(t)
        }
        ,
        this.takeSnapshot = function(e, i, s, a, o, l, r) {
            var h = null
              , u = null
              , C = document.createElement("canvas")
              , p = 0
              , m = null
              , v = null
              , g = new Date
              , f = g.toJSON()
              , T = f.replace(new RegExp(":","g"), "-")
              , I = null;
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
                if (I = document.getElementById(r),
                null === I)
                    return void this.myWebRTC_Event.createErrorEvent("localVideo Div Name is not correct for takeSnapshot", "INCORRECT_VIDEOID_FOR_SNAPSHOT")
            } else if (null != this.localVideo)
                I = this.localVideo;
            else if (I = document.getElementById("myLocalVideo"),
            null === I)
                return void this.myWebRTC_Event.createErrorEvent("localVideo Div Name is not correct for takeSnapshot", "INCORRECT_VIDEOID_FOR_SNAPSHOT");
            C.width = I.clientWidth,
            C.height = I.clientHeight,
            h = C.getContext("2d"),
            h.drawImage(I, 0, 0, C.width, C.height),
            u = document.createElement("img"),
            u.src = C.toDataURL("image/png"),
            u.style.padding = 5,
            u.width = C.width,
            u.height = C.height,
            0 !== p && (m = h.getImageData(0, 0, C.width, C.height),
            m = n(u, m, p),
            h.putImageData(m, 0, 0),
            u.src = C.toDataURL("image/png")),
            "object" == typeof i ? null !== i && (i.src = u.src) : null !== document.getElementById(i) && (document.getElementById(i).src = u.src),
            v = new FormData,
            o !== t ? (v.append("destFileName", this.clientId + "-" + T + ".png"),
            v.append("data", C.toDataURL("image/png")),
            v.append("sessionId", o)) : (v.append("photo", C.toDataURL("image/png")),
            v.append("clientId", this.clientId),
            v.append("apiKey", d.session.apiKey)),
            this.xhr(e, v, function(e) {
                if (null !== e)
                    try {
                        var t = JSON.parse(e);
                        "OK" === t.resultCode && c.createSnapShotPhotoUploaded(t.fileUrl)
                    } catch (i) {}
                ("Photo received" === e || "An error occurred." === e || "Photo-" === e.substring(0, 6)) && c.createSnapShotPhotoUploaded(e)
            }, l)
        }
        ,
        this.takeSnapshotAndSendOnDataChannel = function(e, i, n, s) {
            var a = null
              , o = null
              , l = document.createElement("canvas")
              , r = null
              , c = null;
            return i !== t && (r = document.getElementById(i),
            null === r) ? void this.myWebRTC_Event.createErrorEvent("localVideo Div Name is not correct for takeSnapshot", "INCORRECT_VIDEOID_FOR_SNAPSHOT") : (l.width = r.clientWidth,
            l.height = r.clientHeight,
            a = l.getContext("2d"),
            a.drawImage(r, 0, 0, l.width, l.height),
            o = document.createElement("img"),
            o.src = l.toDataURL("image/png"),
            o.style.padding = 5,
            o.width = l.width,
            o.height = l.height,
            "object" == typeof e ? null !== e && (e.src = o.src) : null !== document.getElementById(e) && (document.getElementById(e).src = o.src),
            c = l.toDataURL("image/png"),
            void this.sendDataWithCallId(n, {
                file: c,
                name: "nomFichier",
                type: "image/png-dataUrl"
            }, s))
        }
        ,
        this.callWithNumber = function(e, i, n, s) {
            var a = null
              , o = 0
              , l = null;
            return "" !== e && e !== this.clientId ? (this.setStatus("Calling Destination number :" + e),
            a = new p(this),
            a.generateCallId(),
            a.callerId = this.clientId,
            a.calleeId = e,
            a.dest_roomId = e,
            a.audioOnly = !i,
            a.remoteId = e,
            s !== t && null !== s && (("VIDEO" === s.mediaTypeForOutgoingCall || "AUDIO" === s.mediaTypeForOutgoingCall || "VIDEOONLY" === s.mediaTypeForOutgoingCall || "NONE" === s.mediaTypeForOutgoingCall) && (a.mediaTypeForOutgoingCall = s.mediaTypeForOutgoingCall),
            s.mediaRoutingMode !== t && null !== s.mediaRoutingMode && a.setCallMediaRoutingMode(s.mediaRoutingMode),
            s.turnServerAddress !== t && null !== s.turnServerAddress && a.setCallTurnServer(s.turnServerAddress)),
            a.checkDTLSCompliancy(),
            l = a.callId,
            (0 === e.toString().indexOf("0") || 0 === e.toString().indexOf("+")) && (n !== t && null !== n ? n.pubSub = "sipConnector" : (n = {},
            n.pubSub = "sipConnector"),
            a.trickleIce = !1),
            a.audioOnly === !0 && (a.callType = "audio"),
            n !== t && (a.data = n),
            "data" === n && (a.dataCall = !0),
            this.accessToLocalMedia === !0 && this.autoAnswer === !0 || a.dataCall ? (a.dataCall,
            a.establishCall()) : a.getUserMediaOnCall(),
            o = this.callsTable.push(a),
            this.autoAnswer === !0 && this.displayHangUpButtonInCommand()) : this.setStatus("Dialed call number is not correct :" + e + ".<br>You can be reached at:  : " + this.clientId),
            l
        }
        ,
        this.startTestCall = function(e, i) {
            var n = null
              , s = 0
              , a = null
              , o = {};
            return this.setStatus("Starting test call."),
            n = new p(this),
            n.generateCallId(),
            n.callerId = this.clientId,
            n.calleeId = 12345,
            n.dest_roomId = 12345,
            n.audioOnly = !e,
            n.remoteId = 12345,
            i !== t && null !== i && (("VIDEO" === i.mediaTypeForOutgoingCall || "AUDIO" === i.mediaTypeForOutgoingCall || "VIDEOONLY" === i.mediaTypeForOutgoingCall || "NONE" === i.mediaTypeForOutgoingCall) && (n.mediaTypeForOutgoingCall = i.mediaTypeForOutgoingCall),
            i.mediaRoutingMode !== t && null !== i.mediaRoutingMode && n.setCallMediaRoutingMode(i.mediaRoutingMode),
            i.turnServerAddress !== t && null !== i.turnServerAddress && n.setCallTurnServer(i.turnServerAddress)),
            n.checkDTLSCompliancy(),
            a = n.callId,
            o.pubSub = "testCallKurentoConnector",
            n.data = o,
            n.audioOnly === !0 && (n.callType = "audio"),
            this.accessToLocalMedia === !0 && this.autoAnswer === !0 || n.dataCall ? (n.dataCall,
            n.establishCall()) : n.getUserMediaOnCall(),
            s = this.callsTable.push(n),
            this.autoAnswer === !0 && this.displayHangUpButtonInCommand(),
            a
        }
        ,
        this.extensionInstallationSuccessCallback = function() {
            d.session.apiCCWebRTCClient.webRTCClient.apiRTCExtensionInstalled = !0
        }
        ,
        this.extensionInstallationFailureCallback = function(e, t) {
            e = null,
            t = null,
            c.createDesktopCaptureEvent("Extension_installation_Error", this.waitingShareScreenCallId, this.waitingShareScreenDestNumber),
            this.setStatus('Inline extension installation is not possible, please install extension using following link: <a href="https://chrome.google.com/webstore/detail/apizee-desktop-capture/mjjnofoemoepfididplbfimokpnpcoeg?hl=fr" target="_blank">ApiRTC desktopCapture extension</a>')
        }
        ,
        this.manageNotInstalledExtension = function(e, t) {
            this.setStatus("ApiRTC extension need to be installed to enable screen sharing.<br><br>You can be reached at:  : " + this.clientId),
            c.createDesktopCaptureEvent("Extension_not_installed", e, t),
            this.waitingShareScreenDestNumber = t,
            this.waitingShareScreenCallId = e,
            chrome.webstore.install("https://chrome.google.com/webstore/detail/mjjnofoemoepfididplbfimokpnpcoeg", this.callback(this, "extensionInstallationSuccessCallback"), this.callback(this, "extensionInstallationFailureCallback"))
        }
        ,
        this.shareScreen = function(i, n) {
            var s = null
              , a = null
              , o = 0;
            if ("chrome" === this.myWebRTC_Adapter.webrtcDetectedBrowser)
                if ("" !== i && i !== this.clientId) {
                    if (a = new p(d.session.apiCCWebRTCClient.webRTCClient),
                    a.generateCallId(),
                    s = a.callId,
                    a.callerId = this.clientId,
                    a.calleeId = i,
                    a.dest_roomId = i,
                    a.audioOnly = !1,
                    a.screenSharing = !0,
                    a.remoteId = i,
                    a.callType = "screenSharing",
                    a.checkDTLSCompliancy(),
                    n !== t && (a.data = n),
                    o = d.session.apiCCWebRTCClient.webRTCClient.callsTable.push(a),
                    this.apiRTCExtensionInstalled === !1)
                        return this.manageNotInstalledExtension(a.callId, a.remoteId),
                        s;
                    e.postMessage({
                        command: "getDesktopId",
                        callNumber: s,
                        remoteId: i
                    }, "*")
                } else
                    this.setStatus("Dialed call number is not correct :" + i + ".<br>You can be reached at: " + this.clientId);
            else
                c.createDesktopCaptureEvent("Browser_Not_Compatible", s, i);
            return s
        }
        ,
        this.startScreenSharingOnCall = function(t) {
            var i = null;
            if ("chrome" === this.myWebRTC_Adapter.webrtcDetectedBrowser) {
                if (i = this.findCallWithCallId(t),
                null !== i) {
                    if (this.apiRTCExtensionInstalled === !1)
                        return void this.manageNotInstalledExtension(i.callId, i.remoteId);
                    e.postMessage({
                        command: "getDesktopId",
                        callNumber: i.callId,
                        remoteId: i.remoteId
                    }, "*")
                }
            } else
                c.createDesktopCaptureEvent("Browser_Not_Compatible", i.callId, i.remoteId)
        }
        ,
        this.toggleVideoScreen = function(e) {
            var t = this.findCallWithCallId(e);
            null !== t && t.toggleVideoScreen()
        }
        ,
        this.switchVideoToScreen = function(e) {
            var t = this.findCallWithCallId(e);
            null !== t && t.switchVideoToScreen()
        }
        ,
        this.switchScreenToVideo = function(e) {
            var t = this.findCallWithCallId(e);
            null !== t && t.switchScreenToVideo()
        }
        ,
        this.callbymail = function(e) {
            s(e) && (this.socket.emit("webrtc_invite_permail", e),
            i.channel.socket.emit("webrtc_invite_permail", e))
        }
        ,
        this.callperURL = function(e) {
            var t = null
              , i = 0;
            t = new p(this),
            t.generateCallId(),
            t.callerId = this.clientId,
            t.calleeId = e,
            t.dest_roomId = e,
            t.audioOnly = !1,
            t.getUserMediaOnCall(),
            t.remoteId = e,
            t.checkDTLSCompliancy(),
            i = this.callsTable.push(t)
        }
        ,
        this.acceptCall = function(e, i) {
            var n = null;
            n = this.findCallWithCallId(e),
            null !== n && (null !== i && i !== t && (("VIDEO" === i.mediaTypeForIncomingCall || "AUDIO" === i.mediaTypeForIncomingCall || "VIDEOONLY" === i.mediaTypeForIncomingCall || "NONE" === i.mediaTypeForIncomingCall) && (n.mediaTypeForIncomingCall = i.mediaTypeForIncomingCall),
            i.mediaRoutingMode !== t && null !== i.mediaRoutingMode && n.setCallMediaRoutingMode(i.mediaRoutingMode),
            i.turnServerAddress !== t && null !== i.turnServerAddress && n.setCallTurnServer(i.turnServerAddress)),
            this.unidirectionelCallOnly ? n.onUserMediaSuccessTestUni() : this.accessToLocalMedia === !0 ? n.establishCall() : n.getUserMediaOnCall())
        }
        ,
        this.refuseCall = function(e, i) {
            var n = null
              , s = null;
            s = i !== t ? i : "User_Refuse_Call",
            n = this.findCallWithCallId(e),
            null !== n && ("MCU-Callee" === n.data.MCUType ? (n.myWebRTC_Stack.sendBye(n.callId, n.callerId, n.dest_roomId, n.calleeId, "User_Media_Error", n.data),
            this.removeCallFromTableWithCallIdandRemoteId(n.callId, n.calleeId, s)) : (n.myWebRTC_Stack.sendBye(n.callId, n.calleeId, n.dest_roomId, n.callerId, s, n.data),
            this.removeCallFromTableWithCallIdandRemoteId(n.callId, n.callerId, s)),
            0 === this.callsTable.length && this.initMediaElementState())
        }
        ,
        this.addMedia = function(e) {
            this.addingUserMedia = !0;
            var t = null;
            t = this.findCallWithCallId(e),
            null !== t && (this.accessToLocalMedia === !0 && this.autoAnswer === !0 ? t.establishCall() : t.getUserMediaOnCall())
        }
        ,
        this.findCallWithRoomId = function(e) {
            var t = 0
              , i = this.callsTable.length;
            for (t = 0; i > t; t += 1)
                if (this.callsTable[t].dest_roomId === e)
                    return this.callsTable[t];
            return null
        }
        ,
        this.findCallIndexWithCallIdAndRemoteId = function(e, t) {
            var i = 0
              , n = this.callsTable.length;
            for (i = 0; n > i; i += 1)
                if (this.callsTable[i].callId == e && (this.callsTable[i].callee === !0 && this.callsTable[i].callerId == t || this.callsTable[i].callee === !1 && this.callsTable[i].calleeId == t))
                    return i;
            return -1
        }
        ,
        this.findCallIndexWithConfIdAndRemoteId = function(e, t) {
            var i = 0
              , n = this.callsTable.length;
            for (i = 0; n > i; i += 1)
                if (this.callsTable[i].data.confId == e && (this.callsTable[i].callee === !0 && this.callsTable[i].callerId == t || this.callsTable[i].callee === !1 && this.callsTable[i].calleeId == t))
                    return i;
            return -1
        }
        ,
        this.findCallIndexWithCallId = function(e) {
            var t = 0
              , i = this.callsTable.length;
            for (t = 0; i > t; t += 1)
                if (this.callsTable[t].callId == e)
                    return t;
            return -1
        }
        ,
        this.findCallWithCallId = function(e) {
            var t = 0
              , i = this.callsTable.length;
            for (t = 0; i > t; t += 1)
                if (this.callsTable[t].callId == e)
                    return this.callsTable[t];
            return null
        }
        ,
        this.findCallWithStreamId = function(e) {
            var t = 0
              , i = this.callsTable.length;
            for (t = 0; i > t; t += 1)
                if (this.callsTable[t].streamId == e)
                    return this.callsTable[t];
            return null
        }
        ,
        this.findCallWithCallIdAndRemoteId = function(e, t) {
            var i = 0
              , n = this.callsTable.length;
            for (i = 0; n > i; i += 1)
                if (this.callsTable[i].callId === e && (this.callsTable[i].callee === !0 && this.callsTable[i].callerId == t || this.callsTable[i].callee === !1 && this.callsTable[i].calleeId == t))
                    return this.callsTable[i];
            return null
        }
        ,
        this.findCallWithRemoteId = function(e) {
            var t = 0
              , i = this.callsTable.length;
            for (t = 0; i > t; t += 1)
                if (this.callsTable[t].callee === !0 && this.callsTable[t].callerId == e || this.callsTable[t].callee === !1 && this.callsTable[t].calleeId == e)
                    return this.callsTable[t];
            return null
        }
        ,
        this.remoteVideoDisplayManager = function() {
            var t = 0
              , i = null
              , n = 0
              , s = 0
              , a = 0
              , o = 0
              , l = .75 * o
              , r = 0
              , c = 0;
            for (this.remoteVideo && (0 === this.maxWidthRemoteVideo && (this.maxWidthRemoteVideo = this.remoteVideo.clientWidth),
            0 === this.maxHeightRemoteVideo && (this.maxHeightRemoteVideo = this.remoteVideo.clientHeight),
            i = this.remoteVideo.children,
            n = i.length,
            s = this.maxWidthRemoteVideo,
            a = this.maxHeightRemoteVideo,
            o = this.remoteVideo.clientWidth,
            l = .75 * o),
            o > s && (o = s),
            o /= n,
            l = .75 * o,
            l > a && (l = a,
            o = 4 / 3 * l),
            r = o / s * 100,
            c = l / a * 100,
            r += "%",
            c += "%",
            t = 0; n > t; t += 1)
                i[t].style.cssText = "width:" + r + ";height:" + c + ";";
            l = e.innerHeight - l - 60
        }
        ,
        this.removeRemoteVideoDisplay = function(e) {
            var t = "callId_" + e
              , i = 0
              , n = null
              , s = 0;
            for (this.remoteVideo && (n = this.remoteVideo.children,
            s = n.length),
            i = 0; s > i; i += 1)
                if (n[i].id === t)
                    return void this.remoteVideo.removeChild(n[i]);
            this.remoteVideoDisplayManager()
        }
        ,
        this.setStatus = function(e) {
            null !== this.statusDiv && (this.statusDiv.innerHTML = e)
        }
        ,
        this.displayCallButtonInCommand = function() {
            if (null !== this.commandDiv) {
                var e = '<input type="texte" name="mail" value="" placeholder="Enter Destination number..."><a href="#" onClick = "apiCC.session.apiCCWebRTCClient.call(document.forms.form1.mail.value);"><img src="http://www.apizee.com/Demo/images/Call.png" height="30px"></a></input>';
                this.commandDiv.innerHTML = '<form name="form1" action="">' + e + "</form>"
            }
        }
        ,
        this.displayHangUpButtonInCommand = function() {
            null !== this.commandDiv && (this.commandDiv.innerHTML = '<a href="#" onClick = "apiCC.session.apiCCWebRTCClient.toggleAudioMute()"> <img src="http://www.apizee.com/Demo/images/Microphone.png" height="30px" disabled="true"></a><a href="#" onClick = "apiCC.session.apiCCWebRTCClient.toggleVideoMute();"> <img src="http://www.apizee.com/Demo/images/Camera2.png" height="30px" disabled="true"></a><a href="#" onClick = "apiCC.session.apiCCWebRTCClient.hangUp()"> <img src="http://www.apizee.com/Demo/images/Hangup.png" height="30px" disabled="true"> </a>')
        }
        ,
        this.checkURLForCallDestination = function() {
            var e = 0;
            return "room" === location.search.substring(1, 5) && (e = location.search.substring(6)),
            e
        }
        ,
        this.releaseUserMedia = function() {
            null !== this.localStream && (this.stopStream(this.localStream),
            this.accessToLocalMedia = !1,
            this.autoAnswer = !1),
            null !== this.screenStream && this.screenStream !== t && this.stopStream(this.screenStream)
        }
        ,
        this.startDataChannelOnCall = function(e) {
            var t = this.findCallWithCallId(e);
            t && (t.addingDataChannelOnCallOngoing = !0,
            t.createDataChannel())
        }
        ,
        this.sendDataWithCallId = function(e, t, i) {
            var n = this.findCallWithCallId(e);
            n && n.sendData(t, i)
        }
        ,
        this.setVideoBandwidth = function(e) {
            this.videoBandwidth = e
        }
        ,
        this.setAudioBandwidth = function(e) {
            this.audioBandwidth = e
        }
        ,
        this.setDataBandwidth = function(e) {
            this.dataBandwidth = e
        }
        ,
        this.callback = function(e, t) {
            return this.closureHandler = function(i) {
                return e[t](i)
            }
            ,
            this.closureHandler
        }
        ,
        this.callbackWithParams = function(e, t) {
            return this.closureHandler = function(i, n, s) {
                return e[t](i, n, s)
            }
            ,
            this.closureHandler
        }
    }
    ,
    d.ApiCCIMClient = function(e, i) {
        this.convTable = [],
        this.myWebRTC_Event = new r,
        this.nickname = e.nickname,
        this.photoURL = null,
        this.userDataSetted = !1,
        this.myWebRTC_Stack = new u(e.channel.socket),
        this.findIMIdWithDestID = function(e) {
            var t = 0
              , i = this.convTable.length;
            for (t = 0; i > t; t += 1)
                if (this.convTable[t].dest_roomId == e)
                    return this.convTable[t].IMId;
            return 0
        }
        ,
        this.addInConvTable = function(e) {
            var t = 0
              , i = this.convTable.length;
            for (t = 0; i > t; t += 1)
                if (this.convTable[t].dest_roomId == e.dest_roomId)
                    return void (this.convTable[t].IMId = e.IMId);
            this.convTable.push(e)
        }
        ,
        this.sendMessage = function(i, n, s) {
            var a = this.findIMIdWithDestID(i)
              , o = null
              , l = null
              , r = null
              , c = null
              , h = e.channel.getNewCSeq();
            return o = {
                type: "IMMessage",
                IMId: a,
                senderId: e.apiCCId,
                nickname: this.nickname,
                photoURL: this.photoURL,
                dstRoomId: i,
                data: n,
                cSeq: h
            },
            l = JSON.stringify(o),
            r = document.createElement("message"),
            s !== t ? (c = setTimeout(function() {
                var e = {
                    reason: "timeoutReached",
                    cSeq: h
                };
                s(e),
                delete d.session.messageTimeOutTable[h]
            }, e.messageTimeOutTimer),
            e.messageTimeOutTable[h] = c,
            e.channel.socket.emit("IMMessage", l, function(e) {
                s(e),
                d.session.messageTimeOutTable[h] !== t && (clearTimeout(d.session.messageTimeOutTable[h]),
                delete d.session.messageTimeOutTable[h])
            })) : e.channel.socket.emit("IMMessage", l),
            null !== this.conversation && (r.innerHTML = "<b>me :</b> " + n + "<br>",
            this.conversation.appendChild(r),
            this.conversation.scrollTop = this.conversation.scrollHeight),
            h
        }
        ,
        this.newConversationCreated = function(e) {
            var t = {
                dest_roomId: e.dstRoomId,
                IMId: e.IMId
            };
            this.addInConvTable(t)
        }
        ,
        this.receiveMessage = function(e) {
            var t = null
              , i = null;
            i = {
                dest_roomId: e.senderId,
                IMId: e.IMId
            },
            this.addInConvTable(i),
            null !== this.conversation && (t = document.createElement("message"),
            t.innerHTML = "<b>" + e.nickname + ":</b> " + e.data + "<br>",
            this.conversation.appendChild(t),
            this.conversation.scrollTop = this.conversation.scrollHeight),
            this.myWebRTC_Event.createReceiveIMMessageEvent(e.senderId, e.nickname, e.photoURL, e.data, e.UUCSeq, e.IMId)
        }
        ,
        this.createGroupChat = function(t, i) {
            var n = null
              , s = null;
            n = {
                type: "createGroupChat",
                nickname: this.nickname,
                photoURL: this.photoURL,
                contactId1: t,
                contactId2: i
            },
            s = JSON.stringify(n),
            e.channel.socket.emit("createGroupChat", s)
        }
        ,
        this.groupChatCreation = function(e) {
            this.myWebRTC_Event.createGroupChatCreationEvent(e.status, e.groupChatId, e.contactId1, e.invitationSendedToInitialDestId, e.contactId2, e.invitationSendedToNewContactId)
        }
        ,
        this.joinGroupChat = function(t) {
            var i = null
              , n = null;
            i = {
                type: "joinGroupChat",
                groupChatId: t
            },
            n = JSON.stringify(i),
            e.channel.socket.emit("joinGroupChat", n)
        }
        ,
        this.groupChatInvitation = function(e) {
            this.myWebRTC_Event.createGroupChatInvitationEvent(e.groupChatId, e.senderId, e.senderNickname, e.senderPhotoURL, e.contactList)
        }
        ,
        this.answerToGroupChatInvitation = function(t, i) {
            if (i === !0 || i === !1) {
                var n = null
                  , s = null;
                n = {
                    type: "groupChatInvitationAnswer",
                    groupChatId: t,
                    senderId: e.apiCCId,
                    nickname: this.nickname,
                    photoURL: this.photoURL,
                    accept: i
                },
                s = JSON.stringify(n),
                e.channel.socket.emit("groupChatInvitationAnswer", s)
            }
        }
        ,
        this.groupChatMemberUpdate = function(e) {
            this.myWebRTC_Event.createGroupChatMemberUpdateEvent(e.groupChatId, e.contactList, e.status)
        }
        ,
        this.addUserInGroupChat = function(t, i) {
            var n = null
              , s = null;
            n = {
                type: "addUserInGroupChat",
                groupChatId: t,
                nickname: this.nickname,
                photoURL: this.photoURL,
                contactId: i
            },
            s = JSON.stringify(n),
            e.channel.socket.emit("addUserInGroupChat", s)
        }
        ,
        this.addUserInGroupChatAnswer = function(e) {
            this.myWebRTC_Event.createAddUserInGroupChatEvent(e.invitationSended, e.groupChatId, e.contactId)
        }
        ,
        this.leaveGroupChat = function(t) {
            var i = null
              , n = null;
            i = {
                type: "leaveGroupChat",
                groupChatId: t,
                nickname: this.nickname,
                photoURL: this.photoURL
            },
            n = JSON.stringify(i),
            e.channel.socket.emit("leaveGroupChat", n)
        }
        ,
        this.sendMessageToGroupChat = function(t, i) {
            var n = null
              , s = null;
            n = {
                type: "groupChatMessage",
                groupChatId: t,
                senderId: e.apiCCId,
                nickname: this.nickname,
                data: i
            },
            s = JSON.stringify(n),
            e.channel.socket.emit("groupChatMessage", s)
        }
        ,
        this.receiveGroupChatMessage = function(e) {
            this.myWebRTC_Event.createReceiveGroupChatMessageEvent(e.groupChatId, e.senderId, e.nickname, e.data)
        }
        ,
        this.getConversationHistory = function(t) {
            var i = null
              , n = null;
            i = {
                type: "getConversationHistory",
                convId: t
            },
            n = JSON.stringify(i),
            e.channel.socket.emit("getConversationHistory", n)
        }
        ,
        this.receiveConversationHistory = function(e) {
            var t = 0
              , i = 0
              , n = []
              , s = null;
            if (null !== e.convHistory)
                for (i = e.convHistory.length,
                n = [],
                t = 0; i > t; t += 1)
                    s = JSON.parse(e.convHistory[t]),
                    n.push(s);
            this.myWebRTC_Event.createReceiveConversationHistoryEvent(e.convId, n, e.status)
        }
        ,
        this.setUserData = function(t) {
            this.photoURL = t.photoURL,
            e.photoURL = t.photoURL;
            var i = null
              , n = null;
            i = {
                type: "setUserData",
                nickname: this.nickname,
                photoURL: this.photoURL
            },
            n = JSON.stringify(i),
            e.channel.socket.emit("setUserData", n),
            this.userDataSetted = !0
        }
        ,
        this.getUserData = function(t) {
            var i = null
              , n = null;
            i = {
                type: "getUserData",
                contactId: t
            },
            n = JSON.stringify(i),
            e.channel.socket.emit("getUserData", n)
        }
        ,
        this.receiveUserDataAnswer = function(e) {
            this.myWebRTC_Event.createUserDataAnswerEvent(e.userFound, e.contactId, e.nickname, e.photoURL);
        }
        ,
        this.initialize = function(t) {
            var i = null
              , n = null;
            this.conversation = document.getElementById(t),
            null === this.conversation,
            i = {
                type: "registerIM",
                username: this.nickname
            },
            n = JSON.stringify(i),
            e.channel.socket.emit("registerIM", n)
        }
        ,
        this.initialize(i)
    }
    ,
    d.ApiCCDataClient = function(e) {
        this.sendData = function(i, n, s) {
            var a = null
              , o = null
              , l = e.channel.getNewCSeq()
              , r = null;
            return a = {
                type: "dataMessage",
                senderId: e.apiCCId,
                dstRoomId: i,
                data: n,
                cSeq: l
            },
            o = JSON.stringify(a),
            s !== t ? (r = setTimeout(function() {
                var e = {
                    reason: "timeoutReached",
                    cSeq: l
                };
                s(e),
                delete d.session.messageTimeOutTable[l]
            }, e.messageTimeOutTimer),
            e.messageTimeOutTable[l] = r,
            e.channel.socket.emit("dataMessage", o, function(e) {
                s(e),
                d.session.messageTimeOutTable[l] !== t && (clearTimeout(d.session.messageTimeOutTable[l]),
                delete d.session.messageTimeOutTable[l])
            })) : e.channel.socket.emit("dataMessage", o),
            l
        }
        ,
        this.receiveData = function(e) {
            c.createReceiveDataEvent(e.senderId, e.dstRoomId, e.data)
        }
    }
    ,
    y = function(e, t) {
        this.myWebRTC_Event = new r,
        this.createRoom = function(t) {
            var i = null
              , n = null;
            i = {
                type: "createRoom",
                roomType: t,
                nickname: e.nickname,
                photoURL: e.photoURL
            },
            n = JSON.stringify(i),
            e.channel.socket.emit("createRoom", n)
        }
        ,
        this.roomCreation = function(e) {
            this.myWebRTC_Event.createRoomCreationEvent(e.status, e.roomId, e.roomType),
            t(e)
        }
        ,
        this.inviteInRoom = function(t, i, n) {
            var s = null
              , a = null;
            s = {
                type: "inviteInRoom",
                roomId: t,
                contactId: i,
                roomType: n,
                nickname: e.nickname,
                photoURL: e.photoURL
            },
            a = JSON.stringify(s),
            e.channel.socket.emit("inviteInRoom", a)
        }
        ,
        this.inviteInRoomStatus = function(e) {
            t(e)
        }
        ,
        this.roomInvitation = function(e) {
            this.myWebRTC_Event.createRoomInvitationEvent(e.roomId, e.senderId, e.senderNickname, e.senderPhotoURL, e.contactList, e.roomType),
            t(e)
        }
        ,
        this.requestContactListInRoom = function(t) {
            var i = null
              , n = null;
            i = {
                type: "requestContactListInRoom",
                roomId: t
            },
            n = JSON.stringify(i),
            e.channel.socket.emit("requestContactListInRoom", n)
        }
        ,
        this.onContactListInRoom = function(e) {
            this.myWebRTC_Event.createContactListInRoomEvent(e.roomId, e.contactList, e.roomType),
            t(e)
        }
        ,
        this.answerToRoomInvitation = function(t, i, n) {
            if (i === !0 || i === !1) {
                var s = null
                  , a = null;
                s = {
                    type: "roomInvitationAnswer",
                    roomId: t,
                    senderId: e.apiCCId,
                    nickname: e.nickname,
                    photoURL: e.photoURL,
                    accept: i,
                    roomType: n
                },
                a = JSON.stringify(s),
                e.channel.socket.emit("roomInvitationAnswer", a)
            }
        }
        ,
        this.roomMemberUpdate = function(e) {
            this.myWebRTC_Event.createRoomMemberUpdateEvent(e.roomId, e.contactList, e.status, e.roomType),
            t(e)
        }
        ,
        this.sendMessageToRoom = function(t, i, n) {
            var s = null
              , a = null;
            s = {
                type: "roomMessage",
                roomId: t,
                senderId: e.apiCCId,
                nickname: e.nickname,
                roomType: i,
                data: n
            },
            a = JSON.stringify(s),
            e.channel.socket.emit("roomMessage", a)
        }
        ,
        this.receiveRoomMessage = function(e) {
            this.myWebRTC_Event.createReceiveRoomMessageEvent(e.roomId, e.senderId, e.nickname, e.data, e.roomType),
            t(e)
        }
        ,
        this.leaveRoom = function(t, i) {
            var n = null
              , s = null;
            n = {
                type: "leaveRoom",
                roomId: t,
                nickname: e.nickname,
                photoURL: e.photoURL,
                roomType: i
            },
            s = JSON.stringify(n),
            e.channel.socket.emit("leaveRoom", s)
        }
    }
    ,
    d.ApiCCWhiteBoardClient = function(i, n, s, a, o) {
        function l(e) {
            var t = 1
              , i = setInterval(function() {
                .1 >= t && (clearInterval(i),
                e.style.display = "none"),
                e.style.opacity = t,
                e.style.filter = "alpha(opacity=" + 100 * t + ")",
                t -= .1 * t
            }, 50)
        }
        this.roomId = null,
        this.whiteBoardDisconnectionTimeoutId = 0,
        this.currentTool = "pen",
        this.currentColor = "rgba(0, 0, 0, 1)",
        this.currentBrushWidth = 1,
        this.sessionStarted = !1,
        this.readOnly = !1,
        this.isDrawing = !1,
        this.prev = {},
        this.lastEmit = Date.now(),
        this.clients = {},
        this.listenedPeers = {},
        this.cursors = {},
        this.touchScreenActivated = !1,
        this.drawElements = [],
        this.ghostElements = {},
        this.currentScale = 1,
        this.dx = 0,
        this.dy = 0,
        this.instructionsFaded = !1,
        this.paperSheetId = 0,
        this.availableTools = ["pen", "ellipse", "rectangle", "erase", "void", "arrow"],
        this.objectTools = ["arrow", "rectangle", "ellipse"],
        this.disconnectionTimer = o !== t ? o : 3e4,
        this.setCanvas = function(e) {
            null !== this.canvas && this.sessionStarted && !this.readOnly && (this.canvas.onmousedown = null,
            this.canvas.onmouseup = null,
            this.canvas.onmouseleave = null,
            this.canvas.onmousemove = null,
            this.touchScreenActivated && (this.canvas.removeEventListener("touchstart", this.onTouchStart, !1),
            this.canvas.removeEventListener("touchend", this.onTouchEnd, !1),
            this.canvas.removeEventListener("touchcancel", this.onTouchCancel, !1),
            this.canvas.removeEventListener("touchleave", this.onTouchEnd, !1),
            this.canvas.removeEventListener("touchmove", this.onTouchMove, !1))),
            null !== e && null !== document.getElementById(e) ? (this.canvas = document.getElementById(e),
            this.ctx = this.canvas.getContext("2d"),
            this.sessionStarted && !this.readOnly && (this.canvas.onmousedown = this.onmousedown,
            this.canvas.onmouseup = this.onmouseup,
            this.canvas.onmouseleave = this.onmouseleave,
            this.canvas.onmousemove = this.onmousemove,
            this.touchScreenActivated && (this.canvas.addEventListener("touchstart", this.onTouchStart, !1),
            this.canvas.addEventListener("touchend", this.onTouchEnd, !1),
            this.canvas.addEventListener("touchcancel", this.onTouchCancel, !1),
            this.canvas.addEventListener("touchleave", this.onTouchEnd, !1),
            this.canvas.addEventListener("touchmove", this.onTouchMove, !1)))) : (null !== e && null === document.getElementById(e),
            this.canvas = null,
            this.ctx = null)
        }
        ,
        this.canvas = null,
        this.ctx = null,
        this.setCanvas(n),
        this.setCursorsDiv = function(e) {
            this.cursorsDiv = null !== e && null !== document.getElementById(e) ? document.getElementById(e) : null
        }
        ,
        this.cursorsDiv = null,
        this.setCursorsDiv(s),
        this.createRoom = function() {
            i.roomMgr.createRoom("whiteBoard"),
            this.paperSheetId = 1
        }
        ,
        this.requestContactListInRoom = function(e) {
            i.roomMgr.requestContactListInRoom(e)
        }
        ,
        this.setDrawingTool = function(e) {
            this.availableTools.indexOf(e) > -1 && (this.currentTool = e)
        }
        ,
        this.setReadOnly = function(e) {
            this.readOnly = e === !0,
            this.readOnly && null !== this.canvas ? (this.canvas.onmousedown = null,
            this.canvas.onmouseup = null,
            this.canvas.onmouseleave = null,
            this.canvas.onmousemove = null,
            this.touchScreenActivated && (this.canvas.removeEventListener("touchstart", this.onTouchStart, !1),
            this.canvas.removeEventListener("touchend", this.onTouchEnd, !1),
            this.canvas.removeEventListener("touchcancel", this.onTouchCancel, !1),
            this.canvas.removeEventListener("touchleave", this.onTouchEnd, !1),
            this.canvas.removeEventListener("touchmove", this.onTouchMove, !1))) : null !== this.canvas && (this.canvas.onmousedown = this.onmousedown,
            this.canvas.onmouseup = this.onmouseup,
            this.canvas.onmouseleave = this.onmouseleave,
            this.canvas.onmousemove = this.onmousemove,
            this.touchScreenActivated && (this.canvas.addEventListener("touchstart", this.onTouchStart, !1),
            this.canvas.addEventListener("touchend", this.onTouchEnd, !1),
            this.canvas.addEventListener("touchcancel", this.onTouchCancel, !1),
            this.canvas.addEventListener("touchleave", this.onTouchEnd, !1),
            this.canvas.addEventListener("touchmove", this.onTouchMove, !1)))
        }
        ,
        this.setBrushSize = function(e) {
            !isNaN(e) && e > 0 && (this.currentBrushWidth = e)
        }
        ,
        this.setBrushColor = function(e) {
            this.currentColor = e
        }
        ,
        this.setScale = function(e) {
            e > 0 && (this.currentScale = e,
            this.redraw())
        }
        ,
        this.getScale = function() {
            return this.currentScale
        }
        ,
        this.setOffset = function(e, t) {
            var i = parseInt(e, 10)
              , n = parseInt(t, 10);
            isNaN(i) || isNaN(n) || (this.dx = i,
            this.dy = n,
            this.redraw())
        }
        ,
        this.getOffset = function() {
            return {
                x: this.dx,
                y: this.dy
            }
        }
        ,
        this.printSharedText = function(e, t, n, s, a) {
            this.setBrushStyle(this.currentColor, this.currentBrushWidth);
            var o, l = {
                x: e,
                y: t,
                drawing: !1,
                tool: this.currentTool,
                color: this.currentColor,
                width: this.currentBrushWidth,
                id: d.session.apiCCId,
                drawObject: {
                    type: "text",
                    x: e,
                    y: t,
                    text: n,
                    size: s,
                    font: a
                }
            };
            o = l.drawObject,
            o.color = l.color,
            o.width = l.width,
            this.addNewDrawing(o),
            i.roomMgr.sendMessageToRoom(d.session.apiCCWhiteBoardClient.roomId, "whiteBoard", l)
        }
        ,
        this.addPeerListener = function(e, t) {
            this.listenedPeers.hasOwnProperty(e) || (this.listenedPeers[e] = []),
            this.listenedPeers[e].push(t)
        }
        ,
        this.inviteInRoom = function(e, t) {
            i.roomMgr.inviteInRoom(e, t, "whiteBoard")
        }
        ,
        this.answerToRoomInvitation = function(e, t) {
            var n = t && null === this.roomId
              , s = null;
            return null === this.roomId && i.roomMgr.answerToRoomInvitation(e, n, "whiteBoard"),
            n && (this.paperSheetId = 0,
            s = {
                x: 0,
                y: 0,
                drawing: !1,
                tool: "pen",
                color: this.currentColor,
                width: 1,
                paperSheetId: this.paperSheetId,
                id: i.apiCCId
            },
            this.roomId = e,
            i.roomMgr.sendMessageToRoom(e, "whiteBoard", s)),
            n
        }
        ,
        this.leaveRoom = function(e) {
            i.roomMgr.leaveRoom(e, "whiteBoard"),
            this.roomId = null
        }
        ,
        this.clearPaper = function() {
            if (null !== this.canvas && null !== this.ctx) {
                var e = this.canvas.width;
                this.canvas.width = e
            }
        }
        ,
        this.deleteHistory = function() {
            this.clearPaper(),
            this.drawElements = [],
            this.paperSheetId++
        }
        ,
        this.setBrushStyle = function(e, t) {
            null !== this.ctx && (this.ctx.strokeStyle = e,
            this.ctx.fillStyle = e,
            this.ctx.lineWidth = t)
        }
        ,
        this.redraw = function() {
            var e, t;
            for (this.clearPaper(),
            e = 0; e < this.drawElements.length; e++)
                this.drawSingleObject(this.drawElements[e]);
            for (t = Object.keys(this.ghostElements),
            e = 0; e < t.length; e++)
                null !== this.ghostElements[t[e]] && this.drawSingleObject(this.ghostElements[t[e]])
        }
        ,
        this.addNewDrawing = function(e) {
            this.drawElements.push(e),
            this.drawSingleObject(e)
        }
        ,
        this.drawSingleObject = function(e) {
            if (null !== this.ctx && null !== this.canvas) {
                var t = {};
                switch (this.setBrushStyle(e.color, e.width),
                this.ctx.scale(this.currentScale, this.currentScale),
                t.fromx = e.fromx - this.dx,
                t.tox = e.tox - this.dx,
                t.x = e.x - this.dx,
                t.fromy = e.fromy - this.dy,
                t.toy = e.toy - this.dy,
                t.y = e.y - this.dy,
                e.type) {
                case "arrow":
                    this.drawArrow(t.fromx, t.fromy, t.tox, t.toy);
                    break;
                case "ellipse":
                    this.drawEllipse(t.fromx, t.fromy, t.tox, t.toy);
                    break;
                case "rectangle":
                    this.drawRectangle(t.fromx, t.fromy, t.tox, t.toy);
                    break;
                case "pen":
                    this.drawLine(t.fromx, t.fromy, t.tox, t.toy);
                    break;
                case "erase":
                    this.eraseArea(t.fromx, t.fromy);
                    break;
                case "text":
                    this.drawText(t.x, t.y, e.text, e.size, e.font)
                }
                this.ctx.scale(1 / this.currentScale, 1 / this.currentScale)
            }
        }
        ,
        this.drawLine = function(e, t, i, n) {
            null !== this.ctx && (this.ctx.beginPath(),
            this.ctx.moveTo(e, t),
            this.ctx.lineTo(i, n),
            this.ctx.lineCap = "round",
            this.ctx.stroke())
        }
        ,
        this.drawText = function(e, t, i, n, s) {
            if (null !== this.ctx) {
                var a = "Arial";
                s && (a = s),
                this.ctx.font = n + "px " + a,
                this.ctx.fillText(i, e, t)
            }
        }
        ,
        this.eraseArea = function(e, t) {
            null !== this.ctx && this.ctx.clearRect(e - this.ctx.lineWidth - 1, t - this.ctx.lineWidth - 1, 2 * this.ctx.lineWidth + 2, 2 * this.ctx.lineWidth + 2)
        }
        ,
        this.drawArrow = function(e, t, i, n) {
            if (null !== this.ctx) {
                var s = 10
                  , a = Math.atan2(n - t, i - e);
                this.ctx.beginPath(),
                this.ctx.lineCap = "butt",
                this.ctx.moveTo(e, t),
                this.ctx.lineTo(i, n),
                this.ctx.stroke(),
                this.ctx.save(),
                this.ctx.beginPath(),
                this.ctx.translate(i, n),
                this.ctx.rotate(a + Math.PI / 2),
                this.ctx.moveTo(0, -this.ctx.lineWidth),
                this.ctx.lineTo(5 * this.ctx.lineWidth * .5 + 1, s + .25 * this.ctx.lineWidth),
                this.ctx.lineTo(-5 * this.ctx.lineWidth * .5 - 1, s + .25 * this.ctx.lineWidth),
                this.ctx.closePath(),
                this.ctx.restore(),
                this.ctx.fill()
            }
        }
        ,
        this.drawEllipse = function(e, t, i, n) {
            if (null !== this.ctx) {
                var s = {
                    x: Math.abs(e - i) / 2,
                    y: Math.abs(t - n) / 2
                }
                  , a = {
                    x: e - (e - i) / 2,
                    y: t - (t - n) / 2
                };
                this.ctx.beginPath(),
                this.ctx.ellipse(a.x, a.y, s.x, s.y, 0, 0, 2 * Math.PI),
                this.ctx.stroke()
            }
        }
        ,
        this.drawRectangle = function(e, t, i, n) {
            if (null !== this.ctx) {
                this.ctx.beginPath();
                var s = e
                  , a = t;
                e > i && (s = i),
                t > n && (a = n),
                this.ctx.rect(s, a, Math.abs(e - i), Math.abs(t - n)),
                this.ctx.stroke()
            }
        }
        ,
        this.getContext = function() {
            return this.ctx
        }
        ,
        this.loadPhotoInBackground = function(e) {
            var t = document.getElementsByTagName("body")[0];
            t.style.backgroundImage = "url(" + e + ")",
            t.style.backgroundPosition = "50% 50%",
            t.style.backgroundRepeat = "no-repeat"
        }
        ,
        this.messageProcessing = function(e) {
            var t, n, s, a = null, o = null, l = !1;
            if (this.cursors[e.id] || null !== this.cursorsDiv && (a = document.createElement("div"),
            a.className = "cursor",
            a.id = "cursorId" + e.id,
            this.cursors[e.id] = a,
            this.cursorsDiv.appendChild(a)),
            this.listenedPeers.hasOwnProperty(e.id))
                for (s = {
                    id: e.id,
                    x: e.x,
                    y: e.y,
                    tool: e.tool,
                    drawing: e.drawing
                },
                n = 0; n < this.listenedPeers[e.id].length; n++)
                    "function" == typeof this.listenedPeers[e.id][n] && this.listenedPeers[e.id][n](s);
            this.cursors[e.id] && (this.cursors[e.id].style.left = this.currentScale * (e.x - this.dx),
            this.cursors[e.id].style.top = this.currentScale * (e.y - this.dy)),
            null !== this.ghostElements[e.id] && (this.ghostElements[e.id] = null,
            l = !0),
            e.drawing && this.clients[e.id] && (t = {
                fromx: this.clients[e.id].x,
                fromy: this.clients[e.id].y,
                tox: e.x,
                toy: e.y
            },
            t.type = null != e.tool ? e.tool : "pen",
            t.color = e.color,
            t.width = e.width,
            this.objectTools.indexOf(t.type) > -1 ? e.prevX && e.prevY && (t.fromx = e.prevX,
            t.fromy = e.prevY,
            this.ghostElements[e.id] = t,
            l = !0) : this.addNewDrawing(t),
            "undefined" != typeof focusOnDrawing && (o = this.canvas.parentNode,
            o.scrollLeft = e.x - o.clientWidth / 2,
            o.scrollTop = e.y - o.clientHeight / 2)),
            e.drawObject && (t = e.drawObject,
            t.color = e.color,
            t.width = e.width,
            this.ghostElements[e.id] = null,
            this.addNewDrawing(t),
            "undefined" != typeof focusOnDrawing && (o = this.canvas.parentNode,
            o.scrollLeft = e.x - o.clientWidth / 2,
            o.scrollTop = e.y - o.clientHeight / 2)),
            e.hasOwnProperty("paperSheetId") && (e.paperSheetId < this.paperSheetId ? (e = {
                x: 0,
                y: 0,
                drawing: !1,
                tool: "pen",
                color: this.currentColor,
                width: 1,
                paperSheetId: this.paperSheetId,
                drawElements: this.drawElements,
                id: i.apiCCId
            },
            i.roomMgr.sendMessageToRoom(d.session.apiCCWhiteBoardClient.roomId, "whiteBoard", e)) : e.paperSheetId > this.paperSheetId && e.hasOwnProperty("drawElements") && (this.drawElements = e.drawElements,
            this.paperSheetId = e.paperSheetId,
            l = !0)),
            l && this.redraw(),
            this.clients[e.id] = e
        }
        ,
        this.start = function() {
            d.session.apiCCWhiteBoardClient.isDrawing = !1,
            d.session.apiCCWhiteBoardClient.prev = {},
            d.session.apiCCWhiteBoardClient.lastEmit = Date.now(),
            this.currentScale = 1,
            this.dx = 0,
            this.dy = 0,
            this.clients = {},
            this.listenedPeers = {},
            this.cursors = {},
            this.drawElements = [],
            this.touchScreenActivated = !1,
            this.sessionStarted = !0,
            null !== this.canvas && (this.canvas.onmousedown = this.onmousedown,
            this.canvas.onmouseup = this.onmouseup,
            this.canvas.onmouseleave = this.onmouseleave,
            this.canvas.onmousemove = this.onmousemove)
        }
        ,
        this.stop = function() {
            this.sessionStarted = !1,
            this.paperSheetId = 0,
            this.listenedPeers = {},
            null !== this.canvas && (this.canvas.onmousedown = null,
            this.canvas.onmouseup = null,
            this.canvas.onmouseleave = null,
            this.canvas.onmousemove = null,
            this.touchScreenActivated && (this.canvas.removeEventListener("touchstart", this.onTouchStart, !1),
            this.canvas.removeEventListener("touchend", this.onTouchEnd, !1),
            this.canvas.removeEventListener("touchcancel", this.onTouchCancel, !1),
            this.canvas.removeEventListener("touchleave", this.onTouchEnd, !1),
            this.canvas.removeEventListener("touchmove", this.onTouchMove, !1)))
        }
        ,
        this.getTouchOffSet = function(t) {
            var i = null
              , n = null
              , s = 0
              , a = 0
              , o = null
              , l = {};
            return l.offsetX = 0,
            l.offsetY = 0,
            i = t.target,
            n = e.getComputedStyle(i, null),
            s = parseInt(n.borderLeftWidth, 10),
            a = parseInt(n.borderTopWidth, 10),
            o = i.getBoundingClientRect(),
            l.offsetX = t.clientX - s - o.left,
            l.offsetY = t.clientY - a - o.top,
            l
        }
        ,
        this.toggleTouchScreen = function() {
            this.touchScreenActivated === !0 ? this.deactivateTouchScreen() : this.activateTouchScreen()
        }
        ,
        this.activateTouchScreen = function() {
            null !== this.canvas && (this.touchScreenActivated = !0,
            this.canvas.addEventListener("touchstart", this.onTouchStart, !1),
            this.canvas.addEventListener("touchend", this.onTouchEnd, !1),
            this.canvas.addEventListener("touchcancel", this.onTouchCancel, !1),
            this.canvas.addEventListener("touchleave", this.onTouchEnd, !1),
            this.canvas.addEventListener("touchmove", this.onTouchMove, !1))
        }
        ,
        this.deactivateTouchScreen = function() {
            null !== this.canvas && (this.touchScreenActivated = !1,
            this.canvas.removeEventListener("touchstart", this.onTouchStart, !1),
            this.canvas.removeEventListener("touchend", this.onTouchEnd, !1),
            this.canvas.removeEventListener("touchcancel", this.onTouchCancel, !1),
            this.canvas.removeEventListener("touchleave", this.onTouchEnd, !1),
            this.canvas.removeEventListener("touchmove", this.onTouchMove, !1))
        }
        ,
        this.onmousedown = function(t) {
            t.preventDefault();
            var n, s, o = t.target || t.srcElement, r = o.currentStyle || e.getComputedStyle(o, null), c = parseInt(r.borderLeftWidth, 10), h = parseInt(r.borderTopWidth, 10), u = o.getBoundingClientRect(), C = d.session.apiCCWhiteBoardClient, p = C.dx + 1 / C.currentScale * (t.clientX - c - u.left), m = C.dy + 1 / C.currentScale * (t.clientY - h - u.top), v = null;
            C.prev.x = p,
            C.prev.y = m,
            C.isDrawing = !0,
            v = document.getElementById(a),
            null === v || this.instructionsFaded || (l(v),
            this.instructionsFaded = !0),
            "erase" === C.currentTool && (n = {
                x: p,
                y: m,
                drawing: C.isDrawing,
                tool: C.currentTool,
                color: C.currentColor,
                width: C.currentBrushWidth,
                prevX: C.prev.x,
                prevY: C.prev.y,
                paperSheetId: C.paperSheetId,
                id: d.session.apiCCId
            },
            i.roomMgr.sendMessageToRoom(C.roomId, "whiteBoard", n),
            C.lastEmit = Date.now(),
            s = {
                type: C.currentTool,
                fromx: C.prev.x,
                fromy: C.prev.y,
                color: n.color,
                width: n.width
            },
            C.addNewDrawing(s),
            C.redraw())
        }
        ,
        this.onmouseup = function(t) {
            var n, s = null, a = null, o = 0, l = 0, r = null, c = 0, h = 0, u = null, C = d.session.apiCCWhiteBoardClient;
            C.isDrawing && C.objectTools.indexOf(C.currentTool) > -1 && (s = t.target || t.srcElement,
            a = s.currentStyle || e.getComputedStyle(s, null),
            o = parseInt(a.borderLeftWidth, 10),
            l = parseInt(a.borderTopWidth, 10),
            r = s.getBoundingClientRect(),
            c = C.dx + 1 / C.currentScale * (t.clientX - o - r.left),
            h = C.dy + 1 / C.currentScale * (t.clientY - l - r.top),
            u = {
                x: c,
                y: h,
                drawing: C.isDrawing,
                tool: C.currentTool,
                color: C.currentColor,
                width: C.currentBrushWidth,
                id: d.session.apiCCId,
                paperSheetId: C.paperSheetId,
                drawObject: {
                    type: C.currentTool,
                    fromx: C.prev.x,
                    fromy: C.prev.y,
                    tox: c,
                    toy: h
                }
            },
            i.roomMgr.sendMessageToRoom(C.roomId, "whiteBoard", u),
            n = u.drawObject,
            n.color = u.color,
            n.width = u.width,
            C.ghostElements[d.session.apiCCId] = null,
            C.redraw(),
            C.addNewDrawing(n),
            C.prev.x = c,
            C.prev.y = h),
            C.isDrawing = !1,
            C.ghostElements[d.session.apiCCId] = null
        }
        ,
        this.onmouseleave = function() {
            var e, t = d.session.apiCCWhiteBoardClient;
            e = {
                x: 0,
                y: 0,
                drawing: !1,
                tool: t.currentTool,
                color: t.currentColor,
                width: t.currentBrushWidth,
                id: d.session.apiCCId,
                paperSheetId: t.paperSheetId
            },
            i.roomMgr.sendMessageToRoom(t.roomId, "whiteBoard", e),
            t.isDrawing = !1,
            t.ghostElements[d.session.apiCCId] = null,
            t.redraw()
        }
        ,
        this.onmousemove = function(t) {
            var n, s = null, a = null, o = 0, l = 0, r = null, c = 0, h = 0, u = d.session.apiCCWhiteBoardClient, C = null;
            s = t.target || t.srcElement,
            a = s.currentStyle || e.getComputedStyle(s, null),
            o = parseInt(a.borderLeftWidth, 10),
            l = parseInt(a.borderTopWidth, 10),
            r = s.getBoundingClientRect(),
            c = u.dx + 1 / u.currentScale * (t.clientX - o - r.left),
            h = u.dy + 1 / u.currentScale * (t.clientY - l - r.top),
            Date.now() - u.lastEmit > 30 && (C = {
                x: c,
                y: h,
                drawing: u.isDrawing,
                tool: u.currentTool,
                color: u.currentColor,
                width: u.currentBrushWidth,
                prevX: u.prev.x,
                prevY: u.prev.y,
                paperSheetId: u.paperSheetId,
                id: d.session.apiCCId
            },
            i.roomMgr.sendMessageToRoom(u.roomId, "whiteBoard", C),
            u.lastEmit = Date.now(),
            u.isDrawing ? (n = {
                type: u.currentTool,
                fromx: u.prev.x,
                fromy: u.prev.y,
                color: C.color,
                width: C.width
            },
            "pen" === u.currentTool || "erase" === u.currentTool ? ("pen" === u.currentTool && (n.tox = c,
            n.toy = h),
            u.addNewDrawing(n),
            u.prev.x = c,
            u.prev.y = h) : u.objectTools.indexOf(u.currentTool) > -1 && (n.tox = c,
            n.toy = h,
            u.ghostElements[d.session.apiCCId] = n),
            u.redraw()) : "erase" === u.currentTool && (u.redraw(),
            n = {
                type: "rectangle",
                fromx: c - C.width,
                fromy: h - C.width,
                tox: parseInt(c, 10) + parseInt(C.width, 10),
                toy: parseInt(h, 10) + parseInt(C.width, 10),
                color: "#444444",
                width: 1
            },
            u.drawSingleObject(n),
            n.color = "#DDDDDD",
            n.fromx = n.fromx - 1,
            n.fromy = n.fromy - 1,
            n.tox = n.tox + 1,
            n.toy = n.toy + 1,
            u.drawSingleObject(n)))
        }
        ,
        this.onTouchStart = function(e) {
            e.preventDefault();
            var t = 0
              , n = e.changedTouches
              , s = null
              , o = {}
              , r = d.session.apiCCWhiteBoardClient
              , c = {};
            for (r.isDrawing = !0,
            t = 0; t < n.length; t++)
                o = r.getTouchOffSet(n[t]),
                o.offsetX = r.dx + 1 / r.currentScale * o.offsetX,
                o.offsetY = r.dy + 1 / r.currentScale * o.offsetY,
                r.prev.x = o.offsetX,
                r.prev.y = o.offsetY,
                c = {
                    x: o.offsetX,
                    y: o.offsetY,
                    drawing: !1,
                    tool: r.currentTool,
                    color: r.currentColor,
                    width: r.currentBrushWidth,
                    paperSheetId: r.paperSheetId,
                    id: d.session.apiCCId
                },
                i.roomMgr.sendMessageToRoom(r.roomId, "whiteBoard", c);
            s = document.getElementById(a),
            null !== s && l(s)
        }
        ,
        this.onTouchEnd = function(t) {
            var n, s = null, a = null, o = 0, l = 0, r = null, c = 0, h = 0, u = null, C = d.session.apiCCWhiteBoardClient;
            C.isDrawing && C.objectTools.indexOf(C.currentTool) > -1 && (s = t.target || t.srcElement,
            a = s.currentStyle || e.getComputedStyle(s, null),
            o = parseInt(a.borderLeftWidth, 10),
            l = parseInt(a.borderTopWidth, 10),
            r = s.getBoundingClientRect(),
            c = C.dx + 1 / C.currentScale * (t.clientX - o - r.left),
            h = C.dy + 1 / C.currentScale * (t.clientY - l - r.top),
            u = {
                x: c,
                y: h,
                drawing: C.isDrawing,
                tool: C.currentTool,
                color: C.currentColor,
                width: C.currentBrushWidth,
                paperSheetId: C.paperSheetId,
                id: d.session.apiCCId,
                drawObject: {
                    type: C.currentTool,
                    fromx: C.prev.x,
                    fromy: C.prev.y,
                    tox: c,
                    toy: h
                }
            },
            i.roomMgr.sendMessageToRoom(C.roomId, "whiteBoard", u),
            n = u.drawObject,
            n.color = u.color,
            n.width = u.width,
            C.addNewDrawing(n),
            C.prev.x = c,
            C.prev.y = h),
            C.isDrawing = !1,
            t = null
        }
        ,
        this.onTouchCancel = function(e) {
            d.session.apiCCWhiteBoardClient.isDrawing = !1,
            e = null
        }
        ,
        this.onTouchMove = function(e) {
            var t, n = null, s = 0, a = e.changedTouches, o = d.session.apiCCWhiteBoardClient, l = {};
            if (Date.now() - o.lastEmit > 30)
                for (s = 0; s < a.length; s++)
                    l = o.getTouchOffSet(a[s]),
                    l.offsetX = o.dx + 1 / o.currentScale * l.offsetX,
                    l.offsetY = o.dy + 1 / o.currentScale * l.offsetY,
                    n = {
                        x: l.offsetX,
                        y: l.offsetY,
                        drawing: o.isDrawing,
                        tool: o.currentTool,
                        color: o.currentColor,
                        width: o.currentBrushWidth,
                        paperSheetId: o.paperSheetId,
                        id: d.session.apiCCId
                    },
                    i.roomMgr.sendMessageToRoom(o.roomId, "whiteBoard", n),
                    o.lastEmit = Date.now();
            if (o.isDrawing)
                for (s = 0; s < a.length; s++)
                    l = o.getTouchOffSet(a[s]),
                    l.offsetX = o.dx + 1 / o.currentScale * l.offsetX,
                    l.offsetY = o.dy + 1 / o.currentScale * l.offsetY,
                    t = {
                        type: o.currentTool,
                        fromx: o.prev.x,
                        fromy: o.prev.y,
                        color: o.currentColor,
                        width: o.currentBrushWidth
                    },
                    "pen" === o.currentTool || "erase" === o.currentTool ? ("pen" === o.currentTool && (t.tox = l.offsetX,
                    t.toy = l.offsetY),
                    o.addNewDrawing(t)) : o.objectTools.indexOf(o.currentTool) > -1 && (t.tox = l.offsetX,
                    t.toy = l.offsetY,
                    o.ghostElements[d.session.apiCCId] = t,
                    o.redraw()),
                    o.prev.x = l.offsetX,
                    o.prev.y = l.offsetY
        }
    }
    ,
    d.ApiCCCoBrowsingClient = function(e) {
        this.createRoom = function() {
            e.roomMgr.createRoom("coBrowsing")
        }
        ,
        this.inviteInRoom = function(t, i) {
            e.roomMgr.inviteInRoom(t, i, "coBrowsing")
        }
        ,
        this.answerToRoomInvitation = function(t, i) {
            e.roomMgr.answerToRoomInvitation(t, i, "coBrowsing")
        }
        ,
        this.leaveRoom = function(t) {
            e.roomMgr.leaveRoom(t, "coBrowsing")
        }
    }
    ,
    d.ApiCCWebRTCClient = function(i, n, s, a, o, l) {
        this.myWebRTC_Event = new r,
        this.webRTCClient = new m(i),
        this.webRTCClient.channelReady = !0,
        this.webRTCClient.initialize(n, s, a, o, l),
        this.manageWebRTCPlugin = function(t, i) {
            var n = "";
            n = "https:" != e.location.protocol ? "http" : "https",
            $LAB.script(function() {
                return n + "://cdn.temasys.com.sg/adapterjs/0.14.x/adapter.debug.js"
            }).wait(function() {
                AdapterJS.WebRTCPlugin.isPluginInstalled(AdapterJS.WebRTCPlugin.pluginInfo.prefix, AdapterJS.WebRTCPlugin.pluginInfo.plugName, AdapterJS.WebRTCPlugin.pluginInfo.type, function() {
                    d.session.apiCCWebRTCClient.webRTCClient.myWebRTC_Adapter.RTCSessionDescription = RTCSessionDescription,
                    d.session.apiCCWebRTCClient.webRTCClient.myWebRTC_Adapter.RTCIceCandidate = RTCIceCandidate,
                    d.session.apiCCWebRTCClient.webRTCClient.myWebRTC_Adapter.RTCPeerConnection = RTCPeerConnection,
                    d.session.apiCCWebRTCClient.webRTCClient.myWebRTC_Adapter.getUserMedia = navigator.getUserMedia,
                    d.session.apiCCWebRTCClient.webRTCClient.myWebRTC_Adapter.attachMediaStream = attachMediaStream;
                    var e = t();
                    return e
                }, function() {
                    return i(),
                    d.session.apiCCWebRTCClient.myWebRTC_Event.createEvent({
                        eventType: "webRTCPluginInstallation"
                    }),
                    null
                })
            })
        }
        ,
        this.call = function(e, n, s) {
            var a = null;
            return (this.webRTCClient.recordedCall === !0 || "RECORD" === n) && ((n === t || "RECORD" === n) && (n = {}),
            n.MCUType = "MCU-Caller",
            n.confId = Math.floor(1000001 * Math.random()).toString()),
            "IE" !== g && "Safari" !== g || i.webRTCPluginActivated !== !0 ? a = this.webRTCClient.callWithNumber(e, !0, n, s) : (a = this.manageWebRTCPlugin(function() {
                d.session.apiCCWebRTCClient.webRTCClient.callWithNumber(e, !0, n, s)
            }, function() {}),
            a = "WebRTCPlugin")
        }
        ,
        this.testCall = function(e) {
            var t = null;
            return "IE" !== g && "Safari" !== g || i.webRTCPluginActivated !== !0 ? t = this.webRTCClient.startTestCall(!0, e) : (t = this.manageWebRTCPlugin(function() {
                d.session.apiCCWebRTCClient.webRTCClient.startTestCall(!0, e)
            }, function() {}),
            t = "WebRTCPlugin")
        }
        ,
        this.activateScreenSharing = function(e) {
            this.webRTCClient.activateScreenSharing(e)
        }
        ,
        this.shareScreen = function(e) {
            var t = this.webRTCClient.shareScreen(e, !0);
            return t
        }
        ,
        this.startScreenSharingOnCall = function(e) {
            this.webRTCClient.startScreenSharingOnCall(e)
        }
        ,
        this.startDataChannel = function(e) {
            var t = this.webRTCClient.callWithNumber(e, !0, "data", "DATA");
            return t
        }
        ,
        this.startDataChannelOnCall = function(e) {
            this.webRTCClient.startDataChannelOnCall(e)
        }
        ,
        this.sendDataWithCallId = function(e, t, i) {
            this.webRTCClient.sendDataWithCallId(e, t, i)
        }
        ,
        this.callAudio = function(e, t) {
            var i = this.webRTCClient.callWithNumber(e, !1, t, "AUDIO");
            return i
        }
        ,
        this.callbymail = function(e) {
            this.webRTCClient.callbymail(e)
        }
        ,
        this.addMedia = function(e) {
            this.webRTCClient.addMedia(e)
        }
        ,
        this.hangUp = function(e) {
            this.webRTCClient.onHangup(e)
        }
        ,
        this.getMyMedia = function() {
            this.webRTCClient.getUserMedia()
        }
        ,
        this.autoAnswerUserMediaSuccessHandler = function(e) {
            e = null,
            this.webRTCClient.autoAnswer = !0
        }
        ,
        this.autoAnswerUserMediaErrorHandler = function(e) {
            e = null,
            this.webRTCClient.autoAnswer = !1
        }
        ,
        this.activateAutoAnswer = function() {
            d.addEventListener("userMediaSuccess", this.callback(this, "autoAnswerUserMediaSuccessHandler")),
            d.addEventListener("userMediaError", this.callback(this, "autoAnswerUserMediaErrorHandler")),
            this.webRTCClient.getUserMedia()
        }
        ,
        this.getAutoAnswer = function() {
            return this.webRTCClient.autoAnswer
        }
        ,
        this.setUnidirectionalCall = function(e) {
            e === !0 || e === !1 ? this.webRTCClient.unidirectionelCallOnly = e : this.myWebRTC_Event.createErrorEvent("parameter error when calling function : setUnidirectionalCall()", "PARAMETER_ERROR_SETUNIDIRCALL")
        }
        ,
        this.getUnidirectionalCall = function() {
            return this.webRTCClient.unidirectionelCallOnly
        }
        ,
        this.toggleVideoMute = function() {
            this.webRTCClient.toggleVideoMute()
        }
        ,
        this.isVideoMuted = function() {
            return this.webRTCClient.isVideoMuted
        }
        ,
        this.toggleAudioMute = function() {
            this.webRTCClient.toggleAudioMute()
        }
        ,
        this.isAudioMuted = function() {
            return this.webRTCClient.isAudioMuted
        }
        ,
        this.setNtoNConf = function(e) {
            e === !0 || e === !1 ? this.webRTCClient.NtoNConf = e : this.myWebRTC_Event.createErrorEvent("parameter error when calling function : setNtoNConf()", "PARAMETER_ERROR_SETNTONCONF")
        }
        ,
        this.getNtoNConf = function() {
            return this.webRTCClient.NtoNConf
        }
        ,
        this.setRTPMedia = function(e) {
            e === !0 || e === !1 ? this.webRTCClient.RTPMedia = e : this.myWebRTC_Event.createErrorEvent("parameter error when calling function : setRTPMedia()", "PARAMETER_ERROR_SETRTPMEDIA")
        }
        ,
        this.getRTPMedia = function() {
            return this.webRTCClient.RTPMedia
        }
        ,
        this.setMediaRoutingMode = function(e) {
            "hostOnly" === e ? this.webRTCClient.mediaRoutingMode = this.webRTCClient.mediaRoutingModeEnum.hostOnly : "stun" === e ? this.webRTCClient.mediaRoutingMode = this.webRTCClient.mediaRoutingModeEnum.stun : "stunOnly" === e ? this.webRTCClient.mediaRoutingMode = this.webRTCClient.mediaRoutingModeEnum.stunOnly : "turn" === e ? this.webRTCClient.mediaRoutingMode = this.webRTCClient.mediaRoutingModeEnum.turn : "turnOnly" === e ? this.webRTCClient.mediaRoutingMode = this.webRTCClient.mediaRoutingModeEnum.turnOnly : this.myWebRTC_Event.createErrorEvent("parameter error when calling function : setMediaRoutingMode()", "PARAMETER_ERROR_SETMEDIAROUTINGMODE")
        }
        ,
        this.enableQos = function(e, t) {
            this.webRTCClient.qosEnable = e,
            this.webRTCClient.qosInterval = t || this.webRTCClient.qosInterval
        }
        ,
        this.getMediaRoutingMode = function() {
            var e = null;
            return this.webRTCClient.mediaRoutingMode === this.webRTCClient.mediaRoutingModeEnum.hostOnly ? e = "hostOnly" : this.webRTCClient.mediaRoutingMode === this.webRTCClient.mediaRoutingModeEnum.stun ? e = "stun" : this.webRTCClient.mediaRoutingMode === this.webRTCClient.mediaRoutingModeEnum.stunOnly ? e = "stunOnly" : this.webRTCClient.mediaRoutingMode === this.webRTCClient.mediaRoutingModeEnum.turn ? e = "turn" : this.webRTCClient.mediaRoutingMode === this.webRTCClient.mediaRoutingModeEnum.turnOnly && (e = "turnOnly"),
            e
        }
        ,
        this.setMediaTypeForIncomingCall = function(e) {
            ("VIDEO" === e || "AUDIO" === e || "VIDEOONLY" === e || "NONE" === e) && (this.webRTCClient.mediaTypeForIncomingCall = e)
        }
        ,
        this.setMediaTypeForOutgoingCall = function(e) {
            ("VIDEO" === e || "AUDIO" === e || "VIDEOONLY" === e || "NONE" === e) && (this.webRTCClient.mediaTypeForOutgoingCall = e)
        }
        ,
        this.setStereo = function(e) {
            e === !0 ? (this.webRTCClient.setStereo = e,
            this.webRTCClient.gum_config = {
                audio: {
                    mandatory: {
                        echoCancellation: !1,
                        googEchoCancellation: !1
                    },
                    optional: []
                },
                video: {
                    mandatory: {},
                    optional: []
                }
            }) : e === !1 && (this.webRTCClient.setStereo = e)
        }
        ,
        this.setMCUConnector = function(e) {
            "mcu3.apizee.com" === e ? this.webRTCClient.MCUClient.pubConnector = "groupKurentoConnector" : "mcu2.apizee.com" === e && (this.webRTCClient.MCUClient.pubConnector = "licodeConnector")
        }
        ,
        this.setAllowAsymetricMediaCalls = function(e) {
            e === !0 ? this.webRTCClient.allowAsymetricMediaCalls = e : e === !1 && (this.webRTCClient.allowAsymetricMediaCalls = e)
        }
        ,
        this.takeSnapshot = function(e, t, n, s, a, o) {
            this.webRTCClient.takeSnapshot(e, t, i.apiKey, n, s, a, o)
        }
        ,
        this.takeSnapshotAndSendOnDataChannel = function(e, t, i, n) {
            this.webRTCClient.takeSnapshotAndSendOnDataChannel(e, t, i, n)
        }
        ,
        this.setUserAcceptOnIncomingCall = function(e) {
            e === !0 || e === !1 ? this.webRTCClient.userAcceptOnIncomingCall = e : this.myWebRTC_Event.createErrorEvent("parameter error when calling function : setUserAcceptOnIncomingCall()", "PARAMETER_ERROR_SETUSERACCEPTONINCOCALL")
        }
        ,
        this.setHideLocalVideoOnCall = function(e) {
            e === !0 || e === !1 ? this.webRTCClient.hideLocalVideoOnCall = e : this.myWebRTC_Event.createErrorEvent("parameter error when calling function : hideLocalVideoOnCall()", "PARAMETER_ERROR_SETHIDELOCALVIDEOONCALL")
        }
        ,
        this.setAllowMultipleCalls = function(e) {
            e === !0 || e === !1 ? this.webRTCClient.allowMultipleCalls = e : this.myWebRTC_Event.createErrorEvent("parameter error when calling function : setAllowMultipleCalls()", "PARAMETER_ERROR_SETALLOWMULTIPLECALLS")
        }
        ,
        this.setPcConfig = function(e) {
            this.webRTCClient.pc_config = e
        }
        ,
        this.setPcConstraints = function(e) {
            this.webRTCClient.pc_constraints = e
        }
        ,
        this.setGetUserMediaConfig = function(e) {
            this.webRTCClient.setGetUserMediaConfig(e)
        }
        ,
        this.setTrickleIce = function(e) {
            e === !0 || e === !1 ? this.webRTCClient.trickleIce = e : this.myWebRTC_Event.createErrorEvent("parameter error when calling function : setTrickleIce()", "PARAMETER_ERROR_SETTRICKLEICE")
        }
        ,
        this.setRecordedCall = function(e) {
            e === !0 || e === !1 ? this.webRTCClient.recordedCall = e : this.myWebRTC_Event.createErrorEvent("parameter error when calling function : setRecordedCall()", "PARAMETER_ERROR_SETRECORDEDCALL")
        }
        ,
        this.getRecordedCall = function() {
            return this.webRTCClient.recordedCall
        }
        ,
        this.acceptCall = function(e, t) {
            this.webRTCClient.acceptCall(e, t)
        }
        ,
        this.refuseCall = function(e) {
            this.webRTCClient.refuseCall(e)
        }
        ,
        this.toggleVideoScreen = function(e) {
            this.webRTCClient.toggleVideoScreen(e)
        }
        ,
        this.switchVideoToScreen = function(e) {
            this.webRTCClient.switchVideoToScreen(e)
        }
        ,
        this.switchScreenToVideo = function(e) {
            this.webRTCClient.switchScreenToVideo(e)
        }
        ,
        this.releaseUserMedia = function() {
            this.webRTCClient.releaseUserMedia()
        }
        ,
        this.setAllowedAudioCodecs = function(e) {
            this.webRTCClient.allowedAudioCodecs = e
        }
        ,
        this.setAllowedVideoCodecs = function(e) {
            this.webRTCClient.allowedVideoCodecs = e
        }
        ,
        this.setAudioBandwidth = function(e) {
            this.webRTCClient.setAudioBandwidth(e)
        }
        ,
        this.setVideoBandwidth = function(e) {
            this.webRTCClient.setVideoBandwidth(e)
        }
        ,
        this.setDataBandwidth = function(e) {
            this.webRTCClient.setDataBandwidth(e)
        }
        ,
        this.createMCUSession = function(e, t) {
            this.webRTCClient.MCUClient.TBLibIsLoaded === !1 ? $LAB.script(function() {
                return "//static.opentok.com/webrtc/v2.2/js/opentok.min.js"
            }).wait(function() {
                d.session.apiCCWebRTCClient.webRTCClient.MCUClient.TBLibIsLoaded = !0,
                d.session.apiCCWebRTCClient.webRTCClient.MCUClient.initDivElements(e, t),
                d.session.apiCCWebRTCClient.webRTCClient.MCUClient.createSession()
            }) : (this.webRTCClient.MCUClient.initDivElements(e, t),
            this.webRTCClient.MCUClient.createSession())
        }
        ,
        this.joinMCUSession = function(e) {
            this.webRTCClient.MCUClient.joinSession(e)
        }
        ,
        this.getMCUStreamList = function() {
            return this.webRTCClient.MCUClient.getStreamList()
        }
        ,
        this.getStreamFromList = function(e) {
            return this.webRTCClient.MCUClient.getStreamFromList(e)
        }
        ,
        this.getStreamIdOfUser = function(e) {
            return this.webRTCClient.MCUClient.getStreamIdOfUser(e)
        }
        ,
        this.getCallIdFromStreamId = function(e) {
            var t = this.webRTCClient.findCallWithStreamId(e);
            return null === t ? null : t.callId
        }
        ,
        this.getCallIdFromRemoteMCUUser = function(e) {
            var t = null
              , i = null;
            return t = this.webRTCClient.MCUClient.getStreamIdOfUser(e),
            i = this.webRTCClient.findCallWithStreamId(t),
            null === i ? null : i.callId
        }
        ,
        this.publish = function(e, t, i, n) {
            return this.webRTCClient.MCUClient.publish(e, t, i, n)
        }
        ,
        this.unpublish = function(e) {
            this.webRTCClient.MCUClient.unpublish(e)
        }
        ,
        this.publishScreen = function(e, t, i) {
            this.webRTCClient.MCUClient.publishScreen(e, t, i)
        }
        ,
        this.subscribe = function(e, t) {
            this.webRTCClient.MCUClient.subscribeToStreams(e, t)
        }
        ,
        this.unsubscribe = function(e) {
            this.webRTCClient.MCUClient.unsubscribe(e);
        }
        ,
        this.startRecording = function(e, t) {
            this.webRTCClient.MCUClient.startRecording(e, t)
        }
        ,
        this.stopRecording = function() {
            this.webRTCClient.MCUClient.stopRecording()
        }
        ,
        this.takeSnapshotOnMCUSession = function(e) {
            var t = this.webRTCClient.MCUClient.takeSnapshot(e);
            return t
        }
        ,
        this.sendMCUSessionInvitation = function(e, t, i) {
            this.webRTCClient.MCUClient.sendSessionInvitation(e, t, i)
        }
        ,
        this.sendMCUSessionInvitationToGroupChat = function(e, t) {
            this.webRTCClient.MCUClient.sendSessionInvitationToGroupChat(e, t)
        }
        ,
        this.acceptMCUSessionInvitation = function(e, t, i, n) {
            this.webRTCClient.MCUClient.TBLibIsLoaded === !1 ? $LAB.script(function() {
                return "//static.opentok.com/webrtc/v2.2/js/opentok.min.js"
            }).wait(function() {
                d.session.apiCCWebRTCClient.webRTCClient.MCUClient.TBLibIsLoaded = !0,
                d.session.apiCCWebRTCClient.webRTCClient.MCUClient.initDivElements(i, n),
                d.session.apiCCWebRTCClient.webRTCClient.MCUClient.acceptSessionInvitation(e, t)
            }) : (this.webRTCClient.MCUClient.initDivElements(i, n),
            this.webRTCClient.MCUClient.acceptSessionInvitation(e, t))
        }
        ,
        this.leaveMCUSession = function() {
            this.webRTCClient.MCUClient.leaveSession()
        }
        ,
        this.recordType = null,
        this.duration = 6e4,
        this.listenerOnRecordEventAdded = !1,
        this.sessionIdForRecord = null,
        this.recordStreamUserMediaSuccessHandler = function(e) {
            e = null,
            this.webRTCClient.recordMgr.record("local", this.recordType, this.duration, this.sessionIdForRecord)
        }
        ,
        this.recordStreamUserMediaErrorHandler = function(e) {
            e = null
        }
        ,
        this.recordStream = function(e, t, i) {
            this.recordType = e,
            this.sessionIdForRecord = i,
            t > 6e4 && (t = 6e4),
            this.duration = t,
            null !== this.webRTCClient.recordMgr && this.webRTCClient.recordMgr.recordOngoing === !1 && (this.listenerOnRecordEventAdded === !1 && (d.addEventListener("userMediaSuccess", this.callback(this, "recordStreamUserMediaSuccessHandler")),
            d.addEventListener("userMediaError", this.callback(this, "recordStreamUserMediaErrorHandler")),
            this.listenerOnRecordEventAdded = !0),
            this.webRTCClient.getUserMedia())
        }
        ,
        this.stopRecordStream = function() {
            null !== this.webRTCClient.recordMgr && (this.webRTCClient.recordMgr.recordOngoing === !1 || this.webRTCClient.recordMgr.stop())
        }
        ,
        this.setUploadServerAddressForRecord = function(e) {
            this.webRTCClient.recordMgr.setUploadServerAddress(e)
        }
        ,
        this.getMediaDevices = function(e) {
            this.webRTCClient.getMediaDevices(e)
        }
        ,
        this.setAudioSourceId = function(e) {
            this.webRTCClient.audioSourceId = e
        }
        ,
        this.setAudioOutputId = function(e) {
            this.webRTCClient.audioOutputId = e
        }
        ,
        this.setVideoSourceId = function(e) {
            this.webRTCClient.videoSourceId = e
        }
        ,
        this.attachMediaStream = function(e, t) {
            this.webRTCClient.attachMediaStream(e, t)
        }
        ,
        this.addStreamInDiv = function(e, i, n, s, a, o) {
            var l = null
              , r = null;
            l = document.createElement("audio" === i ? "audio" : "video"),
            l.id = s,
            l.autoplay = !0,
            l.muted = o,
            l.style.width = a.width,
            l.style.height = a.height,
            "undefined" != typeof this.webRTCClient.audioOutputId && null != this.webRTCClient.audioOutputId && l.setSinkId(this.webRTCClient.audioOutputId).then(function() {}),
            r = document.getElementById(n),
            r.appendChild(l),
            e !== t && this.attachMediaStream(l, e)
        }
        ,
        this.removeElementFromDiv = function(e, t) {
            var i = null
              , n = null;
            i = document.getElementById(t),
            null !== i && (n = document.getElementById(e),
            n.removeChild(i))
        }
        ,
        this.callback = function(e, t) {
            return this.closureHandler = function(i) {
                return e[t](i)
            }
            ,
            this.closureHandler
        }
    }
    ,
    d.ApiCCSession = function(e) {
        function s(e) {
            return e instanceof Array ? !0 : !1
        }
        if (this.apiCCId = null,
        this.apiKey = null,
        this.nickname = null,
        this.photoURL = null,
        this.apiCCWebRTCClient = null,
        this.apiCCIMClient = null,
        this.apiCCDataClient = null,
        this.apiCCIDCookie = null,
        this.channel = null,
        this.recordActivated = e.recordActivated,
        this.sessionId = null,
        this.apiCCWhiteBoardClient = null,
        this.apiCCCoBrowsingClient = null,
        this.ccsServer = e.ccsServer,
        this.userData = e.userData,
        this.apiDBActivated = e.ApiDBActivated,
        this.webRTCPluginActivated = e.webRTCPluginActivated,
        this.token = e.token,
        this.tryAudioCallAfterUserMediaError = e.tryAudioCallAfterUserMediaError,
        this.deactivateReloadOnCancel = e.deactivateReloadOnCancel,
        this.updateUserDataToBeDone = !1,
        this.connectedUsersList = [],
        this.messageTimeOutTable = [],
        this.messageTimeOutTimer = e.messageTimeOutTimer !== t ? e.messageTimeOutTimer : 1e4,
        this.presenceGroup = e.presenceGroup !== t ? e.presenceGroup : ["default"],
        this.subscribeToPresenceGroup = e.subscribeToPresenceGroup !== t ? e.subscribeToPresenceGroup : ["default"],
        this.isDeviceWebRTCCompliant = function() {
            var e = R.getOS().name
              , t = R.getBrowser()
              , i = R.getDevice().type
              , s = parseInt(t.version, 10);
            if ("iOS" === e)
                return !1;
            if ("Edge" === t.name)
                return !1;
            if ("Chrome" === t.name && s >= 47 && !n())
                return !1;
            if ("mobile" === i || "tablet" === i || "Android" === e)
                switch (t.name) {
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
                }
            else if (("IE" === t.name || "Safari" === t.name) && this.webRTCPluginActivated !== !0)
                return !1;
            return !0
        }
        ,
        this.isDeviceDTLSCompliant = function() {
            var e = R.getBrowser()
              , t = parseInt(e.version, 10);
            return "Chrome" === e.name && 44 > t ? !1 : !0
        }
        ,
        "undefined" == typeof this.userData || null === this.userData ? (this.userData = {},
        this.userData.webRtcCompliant = this.isDeviceWebRTCCompliant(),
        this.userData.dtlsCompliant = this.isDeviceDTLSCompliant()) : ("undefined" == typeof this.userData.webRtcCompliant || null === this.userData.webRtcCompliant) && (this.userData.webRtcCompliant = this.isDeviceWebRTCCompliant(),
        this.userData.dtlsCompliant = this.isDeviceDTLSCompliant()),
        this.roomManagerEventHandler = function(e) {
            "whiteBoard" === e.roomType ? ("roomCreation" === e.type && (this.apiCCWhiteBoardClient.roomId = e.roomId),
            "roomInvitation" === e.type && (this.apiCCWhiteBoardClient.roomId = e.roomId),
            "roomMessage" === e.type && this.apiCCWhiteBoardClient.messageProcessing(e.data)) : "coBrowsing" === e.roomType && "roomMessage" === e.type
        }
        ,
        this.callback = function(e, t) {
            return this.closureHandler = function(i) {
                return e[t](i)
            }
            ,
            this.closureHandler
        }
        ,
        this.roomMgr = new y(this,this.callback(this, "roomManagerEventHandler")),
        this.xhrPolling = e.xhrPolling === !0 ? !0 : !1,
        this.getCookie = function(e) {
            var t = new RegExp("(?:; )?" + e + "=([^;]*);?");
            return t.test(document.cookie) ? decodeURIComponent(RegExp.$1) : null
        }
        ,
        this.generateApiCCID = function() {
            this.apiCCIDCookie = this.getCookie("apiCCId"),
            this.apiCCId = null !== this.apiCCIDCookie ? this.apiCCIDCookie : Math.floor(1000001 * Math.random()).toString()
        }
        ,
        this.getNumericIdFromAlpha = function(e) {
            var t = 0
              , i = 0
              , n = null;
            if (0 == e.length)
                return t;
            for (i = 0; i < e.length; i++)
                n = e.charCodeAt(i),
                t = (t << 5) - t + n,
                t &= t;
            return t >>> 0
        }
        ,
        e === t)
            return alert("Error : Initialisation parameters for session creation are not defined"),
            null;
        if (e.appId !== t && (this.appId = e.appId),
        e.siteId !== t && (this.siteId = e.siteId),
        e.apiKey === t)
            return alert('Error : Initialisation parameters: "apikey" for session creation is not defined'),
            null;
        if (this.apiKey = e.apiKey,
        e.onReady === t)
            return alert('Error : Initialisation parameters: "onReady" for session creation is not defined'),
            null;
        if (d.addEventListener("sessionReady", e.onReady),
        this.sessionId = this.getCookie("sessionId"),
        e.apiCCId === t)
            this.generateApiCCID();
        else if (e.idConversionActivated === t || e.idConversionActivated === !0)
            if (i(e.apiCCId))
                this.apiCCId = e.apiCCId.toString();
            else {
                var r = this.getNumericIdFromAlpha(e.apiCCId);
                r += "",
                i(r) ? this.apiCCId = r.toString() : this.generateApiCCID()
            }
        else
            this.apiCCId = e.apiCCId.toString();
        null !== this.channel && delete this.channel,
        this.channel = new h(this),
        this.channel.initialize(),
        this.nickname = null !== e.nickname && e.nickname !== t ? e.nickname : this.apiCCId,
        this.photoURL = null !== e.photoURL && e.photoURL !== t ? e.photoURL : null,
        this.reOpenChannel = function(e, i) {
            this.apiCCId = e.toString(),
            this.apiKey = i,
            this.channel.socket !== t && null !== this.channel.socket && this.channel.socket.disconnect(),
            this.channel.channelReady = !1,
            this.channel.socket = null,
            this.channel.channelId = this.apiCCId,
            this.channel.initialize(),
            null !== this.apiCCWebRTCClient && null !== this.apiCCWebRTCClient.webRTCClient && (this.apiCCWebRTCClient.webRTCClient.socket = this.channel.socket)
        }
        ,
        this.onChannelOpened = function() {
            e.ApiDBActivated !== !1 && e.ApiDBActivated !== t && null !== e.ApiDBActivated && apiDB.init(this.channel.socket),
            c.createSessionReadyEvent(d.session.apiCCId)
        }
        ,
        this.createWebRTCClient = function(e) {
            return e !== t && null !== e ? (this.apiCCWebRTCClient = new d.ApiCCWebRTCClient(this,e.localVideo,e.minilocalVideo,e.remoteVideo,e.status,e.command),
            this.apiCCWebRTCClient.webRTCClient.getMediaDevices(this.apiCCWebRTCClient.webRTCClient.gotSources),
            this.apiCCWebRTCClient) : null
        }
        ,
        this.createWhiteBoard = function(e, t, i, n) {
            return this.apiCCWhiteBoardClient = new d.ApiCCWhiteBoardClient(this,e,t,i,n),
            this.apiCCWhiteBoardClient
        }
        ,
        this.closeWhiteBoardClient = function(e) {
            c.createClosingWhiteBoardEvent(this.apiCCWhiteBoardClient.roomId, e),
            this.apiCCWhiteBoardClient.leaveRoom(this.apiCCWhiteBoardClient.roomId),
            this.apiCCWhiteBoardClient.stop()
        }
        ,
        this.createCoBrowsing = function() {
            return this.apiCCCoBrowsingClient = new d.ApiCCCoBrowsingClient(this),
            this.apiCCCoBrowsingClient
        }
        ,
        this.createIMClient = function(e) {
            return this.apiCCIMClient = new d.ApiCCIMClient(this,e),
            this.apiCCIMClient
        }
        ,
        this.createDataClient = function() {
            return this.apiCCDataClient = new d.ApiCCDataClient(this),
            this.apiCCDataClient
        }
        ,
        this.updatingQuery = function(e) {
            var i = null
              , n = null
              , s = null
              , a = null;
            return i = o(e),
            this.userData !== t ? (n = JSON.stringify(this.userData),
            s = encodeURIComponent(n),
            i.userData = s,
            a = l(i)) : void 0
        }
        ,
        this.setUserData = function(e) {
            var i = null
              , n = null
              , s = 0
              , o = [];
            for (i = {
                type: "setUserData",
                userData: e
            },
            n = JSON.stringify(i),
            this.channel.socket.emit("setUserData", n),
            this.userData = this.userData !== t ? a(this.userData, e) : e,
            this.channel.socketio_1X === !0 ? this.channel.socket.io.opts.query = this.updatingQuery(this.channel.socket.io.opts.query) : this.channel.socket.socket.options.query = this.updatingQuery(this.channel.socket.socket.options.query),
            s = 0; s < this.connectedUsersList.length; s += 1)
                this.apiCCId === this.connectedUsersList[s].userId && (this.connectedUsersList[s].userData = this.userData),
                o[0] = this.apiCCId,
                c.createConnectedUsersListUpdateEvent(this.connectedUsersList[s].group, o, "userDataUpdate")
        }
        ,
        this.sendPresenceGroupManagementCommand = function(e, t) {
            var i = null
              , n = null;
            i = {
                type: "presenceGroupManagement",
                command: e,
                group: t
            },
            n = JSON.stringify(i),
            this.channel.socket.emit("presenceGroupManagement", n)
        }
        ,
        this.joinPresenceGroup = function(e) {
            s(e) === !0 && this.sendPresenceGroupManagementCommand("join", e)
        }
        ,
        this.leavePresenceGroup = function(e) {
            s(e) === !0 && this.sendPresenceGroupManagementCommand("leave", e)
        }
        ,
        this.subscribePresenceGroup = function(e) {
            s(e) === !0 && this.sendPresenceGroupManagementCommand("subscribe", e)
        }
        ,
        this.unsubscribePresenceGroup = function(e) {
            s(e) === !0 && this.sendPresenceGroupManagementCommand("unsubscribe", e)
        }
        ,
        this.getConversationList = function(e) {
            var i = null
              , n = null;
            i = e !== t ? {
                type: "getConversationList",
                lastConversationNb: e
            } : {
                type: "getConversationList",
                lastConversationNb: 50
            },
            n = JSON.stringify(i),
            this.channel.socket.emit("getConversationList", n)
        }
        ,
        this.receiveConversationListAnswer = function(e) {
            var t = 0
              , i = e.convList.length
              , n = []
              , s = null;
            for (t = 0; i > t; t += 1)
                s = JSON.parse(e.convList[t]),
                n.push(s);
            c.createReceiveConversationListAnswerEvent(n)
        }
        ,
        this.getContactOccurrencesFromConversationList = function(e) {
            var i = null
              , n = null;
            i = e !== t ? {
                type: "getContactOccurrencesFromConversationList",
                lastConversationNb: e
            } : {
                type: "getContactOccurrencesFromConversationList",
                lastConversationNb: 50
            },
            n = JSON.stringify(i),
            this.channel.socket.emit("getContactOccurrencesFromConversationList", n)
        }
        ,
        this.receiveContactOccurrencesFromConversationListAnswer = function(e) {
            c.createReceiveContactOccurrencesFromConversationListAnswerEvent(e.contactOccurrencesTable)
        }
        ,
        this.getConversationDetailReport = function(e) {
            var t = null
              , i = null;
            t = {
                type: "getConversationDetailReport",
                convId: e
            },
            i = JSON.stringify(t),
            this.channel.socket.emit("getConversationDetailReport", i)
        }
        ,
        this.receiveConversationDetailReportAnswer = function(e) {
            c.createReceiveConversationDetailReportAnswerEvent(e.CDR)
        }
        ,
        this.manageConnectedUsersList = function(e, t, i, n) {
            var s = 0
              , a = 0
              , o = 0
              , l = !1
              , r = 0;
            for (o = 0; o < e.length; o += 1)
                e[o].group = i;
            if ("online" === t) {
                for (s = 0; s < e.length; s += 1) {
                    if (0 === this.connectedUsersList.length) {
                        this.connectedUsersList = e,
                        c.createConnectedUsersListUpdateEvent(i, n, t);
                        break
                    }
                    for (a = 0; a < this.connectedUsersList.length; a += 1)
                        if (e[s].userId === this.connectedUsersList[a].userId && e[s].group === this.connectedUsersList[a].group) {
                            l = !0,
                            JSON.stringify(this.connectedUsersList[a].userData) !== JSON.stringify(e[s].userData) && (this.connectedUsersList[a].userData = e[s].userData,
                            c.createConnectedUsersListUpdateEvent(i, n, t));
                            break
                        }
                    if (l === !1) {
                        this.connectedUsersList.push(e[s]);
                        var h = [];
                        h[0] = e[s].userId,
                        c.createConnectedUsersListUpdateEvent(i, h, t)
                    }
                }
                this.updateUserDataToBeDone === !0 && ("undefined" != typeof this.userData && null !== this.userData && d.session.setUserData(d.session.userData),
                this.updateUserDataToBeDone = !1)
            } else
                for (s = 0; s < e.length; s += 1)
                    for (r = this.connectedUsersList.length,
                    a = 0; r > a; a += 1)
                        if (e[s].userId === this.connectedUsersList[a].userId && e[s].group === this.connectedUsersList[a].group) {
                            this.connectedUsersList.splice(a, 1),
                            c.createConnectedUsersListUpdateEvent(i, n, t);
                            break
                        }
        }
        ,
        this.getConnectedUsersList = function(e) {
            var i = 0
              , n = [];
            if (e === t || null === e)
                return this.connectedUsersList;
            for (i = 0; i < this.connectedUsersList.length; i += 1)
                this.connectedUsersList[i].group === e && n.push(this.connectedUsersList[i]);
            return n
        }
        ,
        this.isClientWebRtcCompliant = function(e) {
            var t, i = null, n = null, s = 0;
            if ("undefined" != typeof e)
                for (t = this.getConnectedUsersList(),
                s = 0; s < t.length; s++)
                    t[s].userId === e && (n = t[s].userData,
                    "undefined" != typeof n && null !== n && "undefined" != typeof n.webRtcCompliant && (i = n.webRtcCompliant));
            return i
        }
        ,
        this.isClientDTLSCompliant = function(e) {
            var t, i = !0, n = null, s = 0;
            if ("undefined" != typeof e)
                for (t = this.getConnectedUsersList(),
                s = 0; s < t.length; s++)
                    t[s].userId === e && (n = t[s].userData,
                    "undefined" != typeof n && null !== n && "undefined" != typeof n.dtlsCompliant && (i = n.dtlsCompliant));
            return i
        }
        ,
        this.getConnectedUserIdsList = function() {
            var e = 0
              , t = 0
              , i = []
              , n = !1
              , s = {};
            for (e = 0; e < this.connectedUsersList.length; e += 1) {
                for (n = !1,
                t = 0; t < i.length; t++)
                    if (i[t].userId === this.connectedUsersList[e].userId) {
                        n = !0;
                        break
                    }
                n === !1 && (s = {},
                s.userId = this.connectedUsersList[e].userId,
                s.callState = this.connectedUsersList[e].callState,
                s.userData = this.connectedUsersList[e].userData,
                i.push(s))
            }
            return i
        }
        ,
        this.getGroupsFromConnectedUsersList = function(e) {
            var t = 0
              , i = []
              , n = !1;
            for (t = 0; t < this.connectedUsersList.length; t += 1)
                this.connectedUsersList[t].userId === e && (n = !0,
                i.push(this.connectedUsersList[t].group));
            return n === !0 ? JSON.stringify(i) : "User_Not_Found"
        }
        ,
        this.getConnectedUserInfo = function(e, t) {
            var i = 0
              , n = null
              , s = null;
            switch (t) {
            case "all":
                for (i = 0; i < this.connectedUsersList.length; i += 1)
                    if (this.connectedUsersList[i].userId === e)
                        return n = this.getGroupsFromConnectedUsersList(e),
                        s = JSON.parse(JSON.stringify(this.connectedUsersList[i])),
                        s.groups = n,
                        delete s.group,
                        JSON.stringify(s);
                break;
            case "callState":
                for (i = 0; i < this.connectedUsersList.length; i += 1)
                    if (this.connectedUsersList[i].userId === e)
                        return this.connectedUsersList[i].callState;
                break;
            case "userData":
                for (i = 0; i < this.connectedUsersList.length; i += 1)
                    if (this.connectedUsersList[i].userId === e)
                        return JSON.stringify(this.connectedUsersList[i].userData);
                break;
            case "groups":
                return n = this.getGroupsFromConnectedUsersList(e)
            }
            return "User_Not_Found"
        }
        ,
        this.isConnectedUser = function(e) {
            var t = 0
              , i = !1;
            for (t = 0; t < this.connectedUsersList.length; t += 1)
                if (this.connectedUsersList[t].userId === e)
                    return i = !0;
            return i
        }
        ,
        this.displayConnectedUsersList = function() {
            var e = 0;
            for (e = 0; e < this.connectedUsersList.length; e += 1)
                ;
        }
        ,
        this.updatePresence = function(e) {
            this.manageConnectedUsersList(e.connectedUsersListWithStatus, e.state, e.group, e.connectedUsersList),
            this.displayConnectedUsersList(),
            c.createUpdatePresenceEvent(e.connectedUsersList, e.state, e.connectedUsersListWithStatus)
        }
        ,
        this.updateUserStatus = function(e) {
            c.createUpdateUserStatusEvent(e)
        }
        ,
        this.sendDebugCommand = function(e, t, i) {
            var n = new u(this.channel.socket);
            n.sendDebugCommand("getClientSocketsInfo", t, i)
        }
        ,
        this.processSignalingMessage = function(e) {
            var i = null;
            "invite" === e.type ? this.apiCCWebRTCClient && ("IE" !== g && "Safari" !== g || this.webRTCPluginActivated !== !0 ? this.apiCCWebRTCClient.webRTCClient.processInvite(e) : this.apiCCWebRTCClient.manageWebRTCPlugin(function() {
                d.session.apiCCWebRTCClient.webRTCClient.processInvite(e)
            }, function() {
                var t = new u(d.session.channel.socket);
                t.sendBye(e.callId, e.calleeId, e.roomId, e.callerId, "WebRTC_Plugin_Installation_needed", e.data)
            })) : "200OK" === e.type ? this.apiCCWebRTCClient && this.apiCCWebRTCClient.webRTCClient.process200OK(e) : "candidate" === e.type ? this.apiCCWebRTCClient && this.apiCCWebRTCClient.webRTCClient.processCandidate(e) : "bye" === e.type ? this.apiCCWebRTCClient && this.apiCCWebRTCClient.webRTCClient.onRemoteHangup(e.callId, e.clientId, e.roomId, e.reason, e.confId, e.data) : "update" === e.type ? this.apiCCWebRTCClient && this.apiCCWebRTCClient.webRTCClient.processUpdate(e) : "200update" === e.type ? this.apiCCWebRTCClient && this.apiCCWebRTCClient.webRTCClient.process200Update(e) : "newConversationCreated" === e.type ? this.apiCCIMClient && this.apiCCIMClient.newConversationCreated(e) : "IMMessage" === e.type ? this.apiCCIMClient && this.apiCCIMClient.receiveMessage(e) : "groupChatCreation" === e.type ? this.apiCCIMClient && this.apiCCIMClient.groupChatCreation(e) : "groupChatInvitation" === e.type ? this.apiCCIMClient && this.apiCCIMClient.groupChatInvitation(e) : "groupChatMemberUpdate" === e.type ? this.apiCCIMClient && this.apiCCIMClient.groupChatMemberUpdate(e) : "addUserInGroupChatAnswer" === e.type ? this.apiCCIMClient && this.apiCCIMClient.addUserInGroupChatAnswer(e) : "groupChatMessage" === e.type ? this.apiCCIMClient && this.apiCCIMClient.receiveGroupChatMessage(e) : "conversationHistoryAnswer" === e.type ? this.apiCCIMClient && this.apiCCIMClient.receiveConversationHistory(e) : "getUserDataAnswer" === e.type ? this.apiCCIMClient && this.apiCCIMClient.receiveUserDataAnswer(e) : "dataMessage" === e.type ? this.apiCCDataClient && this.apiCCDataClient.receiveData(e) : "apiRTCDataMessage" === e.type ? e.data !== t && "callOrder" === e.data.type && this.apiCCWebRTCClient && (i = this.apiCCWebRTCClient.webRTCClient.callWithNumber(e.data.caller, !0, {
                MCUType: "MCU-Callee",
                confId: e.data.confId
            }, "VIDEO"),
            this.apiCCWebRTCClient.webRTCClient.myWebRTC_Event.createIncomingCallEvent(this.clientId, e.data.caller, e.data.caller, i, !1, 1, !1, "video", !0, "web", "media")) : "conversationListAnswer" === e.type ? this.receiveConversationListAnswer(e) : "contactOccurrencesFromConversationListAnswer" === e.type ? this.receiveContactOccurrencesFromConversationListAnswer(e) : "conversationDetailReport" === e.type ? this.receiveConversationDetailReportAnswer(e) : "updatePresence" === e.type ? this.updatePresence(e) : "updateUserStatus" === e.type ? this.updateUserStatus(e) : "receiveMCUSessionId" === e.type ? this.apiCCWebRTCClient && this.apiCCWebRTCClient.webRTCClient.MCUClient.receiveSessionId(e) : "joinSessionAnswer" === e.type ? this.apiCCWebRTCClient && this.apiCCWebRTCClient.webRTCClient.MCUClient.joinSessionAnswer(e) : "availableStreams" === e.type ? this.apiCCWebRTCClient && this.apiCCWebRTCClient && this.apiCCWebRTCClient.webRTCClient.MCUClient.newAvailableStream(e.msg) : "onRemoveStream" === e.type ? this.apiCCWebRTCClient && this.apiCCWebRTCClient && this.apiCCWebRTCClient.webRTCClient.MCUClient.removeMCUStream(e.callId, e.msg.id) : "MCUSessionInvitation" === e.type ? this.apiCCWebRTCClient && this.apiCCWebRTCClient.webRTCClient.MCUClient.receiveSessionInvitation(e) : "MCUSessionInvitationToGroupChat" === e.type ? this.apiCCWebRTCClient && this.apiCCWebRTCClient.webRTCClient.MCUClient.receiveSessionInvitation(e) : "recordingStarted" === e.type ? this.apiCCWebRTCClient && this.apiCCWebRTCClient.webRTCClient.MCUClient.recordingStarted(e) : "recordingStreamAvailable" === e.type ? this.apiCCWebRTCClient && this.apiCCWebRTCClient.webRTCClient.MCUClient.recordingStreamAvailable(e) : "sessionId" === e.type ? this.sessionId = e.sessionId : "roomCreation" === e.type ? this.roomMgr.roomCreation(e) : "inviteInRoomStatus" === e.type ? this.roomMgr.inviteInRoomStatus(e) : "contactListInRoom" === e.type ? this.roomMgr.onContactListInRoom(e) : "roomInvitation" === e.type ? this.roomMgr.roomInvitation(e) : "roomMessage" === e.type ? this.roomMgr.receiveRoomMessage(e) : "roomMemberUpdate" === e.type ? this.roomMgr.roomMemberUpdate(e) : "Ack" === e.type || "error" === e.type && c.createErrorEvent(e.errorInfo, e.errorCode)
        }
    }
    ,
    e.apiRTC = e.apiCC = e.CC = d,
    d
}(window);
