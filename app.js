/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(1);
	module.exports = __webpack_require__(59);


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(__resourceQuery) {var url = __webpack_require__(2);
	var io = __webpack_require__(8);
	var stripAnsi = __webpack_require__(57);
	var scriptElements = document.getElementsByTagName("script");
	
	var urlParts = url.parse( true ?
		__resourceQuery.substr(1) :
		scriptElements[scriptElements.length-1].getAttribute("src").replace(/\/[^\/]+$/, "")
	);
	
	io = io.connect(
		url.format({
			protocol: urlParts.protocol,
			auth: urlParts.auth,
			hostname: (urlParts.hostname === '0.0.0.0') ? window.location.hostname : urlParts.hostname,
			port: urlParts.port
		}), {
			path: urlParts.path === '/' ? null : urlParts.path
		}
	);
	
	var hot = false;
	var initial = true;
	var currentHash = "";
	
	io.on("hot", function() {
		hot = true;
		console.log("[WDS] Hot Module Replacement enabled.");
	});
	
	io.on("invalid", function() {
		console.log("[WDS] App updated. Recompiling...");
	});
	
	io.on("hash", function(hash) {
		currentHash = hash;
	});
	
	io.on("still-ok", function() {
		console.log("[WDS] Nothing changed.")
	});
	
	io.on("ok", function() {
		if(initial) return initial = false;
		reloadApp();
	});
	
	io.on("warnings", function(warnings) {
		console.log("[WDS] Warnings while compiling.");
		for(var i = 0; i < warnings.length; i++)
			console.warn(stripAnsi(warnings[i]));
		if(initial) return initial = false;
		reloadApp();
	});
	
	io.on("errors", function(errors) {
		console.log("[WDS] Errors while compiling.");
		for(var i = 0; i < errors.length; i++)
			console.error(stripAnsi(errors[i]));
		if(initial) return initial = false;
		reloadApp();
	});
	
	io.on("proxy-error", function(errors) {
		console.log("[WDS] Proxy error.");
		for(var i = 0; i < errors.length; i++)
			console.error(stripAnsi(errors[i]));
		if(initial) return initial = false;
		reloadApp();
	});
	
	io.on("disconnect", function() {
		console.error("[WDS] Disconnected!");
	});
	
	function reloadApp() {
		if(hot) {
			console.log("[WDS] App hot update...");
			window.postMessage("webpackHotUpdate" + currentHash, "*");
		} else {
			console.log("[WDS] App updated. Reloading...");
			window.location.reload();
		}
	}
	
	/* WEBPACK VAR INJECTION */}.call(exports, "?http://localhost:3000"))

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	// Copyright Joyent, Inc. and other Node contributors.
	//
	// Permission is hereby granted, free of charge, to any person obtaining a
	// copy of this software and associated documentation files (the
	// "Software"), to deal in the Software without restriction, including
	// without limitation the rights to use, copy, modify, merge, publish,
	// distribute, sublicense, and/or sell copies of the Software, and to permit
	// persons to whom the Software is furnished to do so, subject to the
	// following conditions:
	//
	// The above copyright notice and this permission notice shall be included
	// in all copies or substantial portions of the Software.
	//
	// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
	// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
	// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
	// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
	// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
	// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
	// USE OR OTHER DEALINGS IN THE SOFTWARE.
	
	var punycode = __webpack_require__(3);
	
	exports.parse = urlParse;
	exports.resolve = urlResolve;
	exports.resolveObject = urlResolveObject;
	exports.format = urlFormat;
	
	exports.Url = Url;
	
	function Url() {
	  this.protocol = null;
	  this.slashes = null;
	  this.auth = null;
	  this.host = null;
	  this.port = null;
	  this.hostname = null;
	  this.hash = null;
	  this.search = null;
	  this.query = null;
	  this.pathname = null;
	  this.path = null;
	  this.href = null;
	}
	
	// Reference: RFC 3986, RFC 1808, RFC 2396
	
	// define these here so at least they only have to be
	// compiled once on the first module load.
	var protocolPattern = /^([a-z0-9.+-]+:)/i,
	    portPattern = /:[0-9]*$/,
	
	    // RFC 2396: characters reserved for delimiting URLs.
	    // We actually just auto-escape these.
	    delims = ['<', '>', '"', '`', ' ', '\r', '\n', '\t'],
	
	    // RFC 2396: characters not allowed for various reasons.
	    unwise = ['{', '}', '|', '\\', '^', '`'].concat(delims),
	
	    // Allowed by RFCs, but cause of XSS attacks.  Always escape these.
	    autoEscape = ['\''].concat(unwise),
	    // Characters that are never ever allowed in a hostname.
	    // Note that any invalid chars are also handled, but these
	    // are the ones that are *expected* to be seen, so we fast-path
	    // them.
	    nonHostChars = ['%', '/', '?', ';', '#'].concat(autoEscape),
	    hostEndingChars = ['/', '?', '#'],
	    hostnameMaxLen = 255,
	    hostnamePartPattern = /^[a-z0-9A-Z_-]{0,63}$/,
	    hostnamePartStart = /^([a-z0-9A-Z_-]{0,63})(.*)$/,
	    // protocols that can allow "unsafe" and "unwise" chars.
	    unsafeProtocol = {
	      'javascript': true,
	      'javascript:': true
	    },
	    // protocols that never have a hostname.
	    hostlessProtocol = {
	      'javascript': true,
	      'javascript:': true
	    },
	    // protocols that always contain a // bit.
	    slashedProtocol = {
	      'http': true,
	      'https': true,
	      'ftp': true,
	      'gopher': true,
	      'file': true,
	      'http:': true,
	      'https:': true,
	      'ftp:': true,
	      'gopher:': true,
	      'file:': true
	    },
	    querystring = __webpack_require__(5);
	
	function urlParse(url, parseQueryString, slashesDenoteHost) {
	  if (url && isObject(url) && url instanceof Url) return url;
	
	  var u = new Url;
	  u.parse(url, parseQueryString, slashesDenoteHost);
	  return u;
	}
	
	Url.prototype.parse = function(url, parseQueryString, slashesDenoteHost) {
	  if (!isString(url)) {
	    throw new TypeError("Parameter 'url' must be a string, not " + typeof url);
	  }
	
	  var rest = url;
	
	  // trim before proceeding.
	  // This is to support parse stuff like "  http://foo.com  \n"
	  rest = rest.trim();
	
	  var proto = protocolPattern.exec(rest);
	  if (proto) {
	    proto = proto[0];
	    var lowerProto = proto.toLowerCase();
	    this.protocol = lowerProto;
	    rest = rest.substr(proto.length);
	  }
	
	  // figure out if it's got a host
	  // user@server is *always* interpreted as a hostname, and url
	  // resolution will treat //foo/bar as host=foo,path=bar because that's
	  // how the browser resolves relative URLs.
	  if (slashesDenoteHost || proto || rest.match(/^\/\/[^@\/]+@[^@\/]+/)) {
	    var slashes = rest.substr(0, 2) === '//';
	    if (slashes && !(proto && hostlessProtocol[proto])) {
	      rest = rest.substr(2);
	      this.slashes = true;
	    }
	  }
	
	  if (!hostlessProtocol[proto] &&
	      (slashes || (proto && !slashedProtocol[proto]))) {
	
	    // there's a hostname.
	    // the first instance of /, ?, ;, or # ends the host.
	    //
	    // If there is an @ in the hostname, then non-host chars *are* allowed
	    // to the left of the last @ sign, unless some host-ending character
	    // comes *before* the @-sign.
	    // URLs are obnoxious.
	    //
	    // ex:
	    // http://a@b@c/ => user:a@b host:c
	    // http://a@b?@c => user:a host:c path:/?@c
	
	    // v0.12 TODO(isaacs): This is not quite how Chrome does things.
	    // Review our test case against browsers more comprehensively.
	
	    // find the first instance of any hostEndingChars
	    var hostEnd = -1;
	    for (var i = 0; i < hostEndingChars.length; i++) {
	      var hec = rest.indexOf(hostEndingChars[i]);
	      if (hec !== -1 && (hostEnd === -1 || hec < hostEnd))
	        hostEnd = hec;
	    }
	
	    // at this point, either we have an explicit point where the
	    // auth portion cannot go past, or the last @ char is the decider.
	    var auth, atSign;
	    if (hostEnd === -1) {
	      // atSign can be anywhere.
	      atSign = rest.lastIndexOf('@');
	    } else {
	      // atSign must be in auth portion.
	      // http://a@b/c@d => host:b auth:a path:/c@d
	      atSign = rest.lastIndexOf('@', hostEnd);
	    }
	
	    // Now we have a portion which is definitely the auth.
	    // Pull that off.
	    if (atSign !== -1) {
	      auth = rest.slice(0, atSign);
	      rest = rest.slice(atSign + 1);
	      this.auth = decodeURIComponent(auth);
	    }
	
	    // the host is the remaining to the left of the first non-host char
	    hostEnd = -1;
	    for (var i = 0; i < nonHostChars.length; i++) {
	      var hec = rest.indexOf(nonHostChars[i]);
	      if (hec !== -1 && (hostEnd === -1 || hec < hostEnd))
	        hostEnd = hec;
	    }
	    // if we still have not hit it, then the entire thing is a host.
	    if (hostEnd === -1)
	      hostEnd = rest.length;
	
	    this.host = rest.slice(0, hostEnd);
	    rest = rest.slice(hostEnd);
	
	    // pull out port.
	    this.parseHost();
	
	    // we've indicated that there is a hostname,
	    // so even if it's empty, it has to be present.
	    this.hostname = this.hostname || '';
	
	    // if hostname begins with [ and ends with ]
	    // assume that it's an IPv6 address.
	    var ipv6Hostname = this.hostname[0] === '[' &&
	        this.hostname[this.hostname.length - 1] === ']';
	
	    // validate a little.
	    if (!ipv6Hostname) {
	      var hostparts = this.hostname.split(/\./);
	      for (var i = 0, l = hostparts.length; i < l; i++) {
	        var part = hostparts[i];
	        if (!part) continue;
	        if (!part.match(hostnamePartPattern)) {
	          var newpart = '';
	          for (var j = 0, k = part.length; j < k; j++) {
	            if (part.charCodeAt(j) > 127) {
	              // we replace non-ASCII char with a temporary placeholder
	              // we need this to make sure size of hostname is not
	              // broken by replacing non-ASCII by nothing
	              newpart += 'x';
	            } else {
	              newpart += part[j];
	            }
	          }
	          // we test again with ASCII char only
	          if (!newpart.match(hostnamePartPattern)) {
	            var validParts = hostparts.slice(0, i);
	            var notHost = hostparts.slice(i + 1);
	            var bit = part.match(hostnamePartStart);
	            if (bit) {
	              validParts.push(bit[1]);
	              notHost.unshift(bit[2]);
	            }
	            if (notHost.length) {
	              rest = '/' + notHost.join('.') + rest;
	            }
	            this.hostname = validParts.join('.');
	            break;
	          }
	        }
	      }
	    }
	
	    if (this.hostname.length > hostnameMaxLen) {
	      this.hostname = '';
	    } else {
	      // hostnames are always lower case.
	      this.hostname = this.hostname.toLowerCase();
	    }
	
	    if (!ipv6Hostname) {
	      // IDNA Support: Returns a puny coded representation of "domain".
	      // It only converts the part of the domain name that
	      // has non ASCII characters. I.e. it dosent matter if
	      // you call it with a domain that already is in ASCII.
	      var domainArray = this.hostname.split('.');
	      var newOut = [];
	      for (var i = 0; i < domainArray.length; ++i) {
	        var s = domainArray[i];
	        newOut.push(s.match(/[^A-Za-z0-9_-]/) ?
	            'xn--' + punycode.encode(s) : s);
	      }
	      this.hostname = newOut.join('.');
	    }
	
	    var p = this.port ? ':' + this.port : '';
	    var h = this.hostname || '';
	    this.host = h + p;
	    this.href += this.host;
	
	    // strip [ and ] from the hostname
	    // the host field still retains them, though
	    if (ipv6Hostname) {
	      this.hostname = this.hostname.substr(1, this.hostname.length - 2);
	      if (rest[0] !== '/') {
	        rest = '/' + rest;
	      }
	    }
	  }
	
	  // now rest is set to the post-host stuff.
	  // chop off any delim chars.
	  if (!unsafeProtocol[lowerProto]) {
	
	    // First, make 100% sure that any "autoEscape" chars get
	    // escaped, even if encodeURIComponent doesn't think they
	    // need to be.
	    for (var i = 0, l = autoEscape.length; i < l; i++) {
	      var ae = autoEscape[i];
	      var esc = encodeURIComponent(ae);
	      if (esc === ae) {
	        esc = escape(ae);
	      }
	      rest = rest.split(ae).join(esc);
	    }
	  }
	
	
	  // chop off from the tail first.
	  var hash = rest.indexOf('#');
	  if (hash !== -1) {
	    // got a fragment string.
	    this.hash = rest.substr(hash);
	    rest = rest.slice(0, hash);
	  }
	  var qm = rest.indexOf('?');
	  if (qm !== -1) {
	    this.search = rest.substr(qm);
	    this.query = rest.substr(qm + 1);
	    if (parseQueryString) {
	      this.query = querystring.parse(this.query);
	    }
	    rest = rest.slice(0, qm);
	  } else if (parseQueryString) {
	    // no query string, but parseQueryString still requested
	    this.search = '';
	    this.query = {};
	  }
	  if (rest) this.pathname = rest;
	  if (slashedProtocol[lowerProto] &&
	      this.hostname && !this.pathname) {
	    this.pathname = '/';
	  }
	
	  //to support http.request
	  if (this.pathname || this.search) {
	    var p = this.pathname || '';
	    var s = this.search || '';
	    this.path = p + s;
	  }
	
	  // finally, reconstruct the href based on what has been validated.
	  this.href = this.format();
	  return this;
	};
	
	// format a parsed object into a url string
	function urlFormat(obj) {
	  // ensure it's an object, and not a string url.
	  // If it's an obj, this is a no-op.
	  // this way, you can call url_format() on strings
	  // to clean up potentially wonky urls.
	  if (isString(obj)) obj = urlParse(obj);
	  if (!(obj instanceof Url)) return Url.prototype.format.call(obj);
	  return obj.format();
	}
	
	Url.prototype.format = function() {
	  var auth = this.auth || '';
	  if (auth) {
	    auth = encodeURIComponent(auth);
	    auth = auth.replace(/%3A/i, ':');
	    auth += '@';
	  }
	
	  var protocol = this.protocol || '',
	      pathname = this.pathname || '',
	      hash = this.hash || '',
	      host = false,
	      query = '';
	
	  if (this.host) {
	    host = auth + this.host;
	  } else if (this.hostname) {
	    host = auth + (this.hostname.indexOf(':') === -1 ?
	        this.hostname :
	        '[' + this.hostname + ']');
	    if (this.port) {
	      host += ':' + this.port;
	    }
	  }
	
	  if (this.query &&
	      isObject(this.query) &&
	      Object.keys(this.query).length) {
	    query = querystring.stringify(this.query);
	  }
	
	  var search = this.search || (query && ('?' + query)) || '';
	
	  if (protocol && protocol.substr(-1) !== ':') protocol += ':';
	
	  // only the slashedProtocols get the //.  Not mailto:, xmpp:, etc.
	  // unless they had them to begin with.
	  if (this.slashes ||
	      (!protocol || slashedProtocol[protocol]) && host !== false) {
	    host = '//' + (host || '');
	    if (pathname && pathname.charAt(0) !== '/') pathname = '/' + pathname;
	  } else if (!host) {
	    host = '';
	  }
	
	  if (hash && hash.charAt(0) !== '#') hash = '#' + hash;
	  if (search && search.charAt(0) !== '?') search = '?' + search;
	
	  pathname = pathname.replace(/[?#]/g, function(match) {
	    return encodeURIComponent(match);
	  });
	  search = search.replace('#', '%23');
	
	  return protocol + host + pathname + search + hash;
	};
	
	function urlResolve(source, relative) {
	  return urlParse(source, false, true).resolve(relative);
	}
	
	Url.prototype.resolve = function(relative) {
	  return this.resolveObject(urlParse(relative, false, true)).format();
	};
	
	function urlResolveObject(source, relative) {
	  if (!source) return relative;
	  return urlParse(source, false, true).resolveObject(relative);
	}
	
	Url.prototype.resolveObject = function(relative) {
	  if (isString(relative)) {
	    var rel = new Url();
	    rel.parse(relative, false, true);
	    relative = rel;
	  }
	
	  var result = new Url();
	  Object.keys(this).forEach(function(k) {
	    result[k] = this[k];
	  }, this);
	
	  // hash is always overridden, no matter what.
	  // even href="" will remove it.
	  result.hash = relative.hash;
	
	  // if the relative url is empty, then there's nothing left to do here.
	  if (relative.href === '') {
	    result.href = result.format();
	    return result;
	  }
	
	  // hrefs like //foo/bar always cut to the protocol.
	  if (relative.slashes && !relative.protocol) {
	    // take everything except the protocol from relative
	    Object.keys(relative).forEach(function(k) {
	      if (k !== 'protocol')
	        result[k] = relative[k];
	    });
	
	    //urlParse appends trailing / to urls like http://www.example.com
	    if (slashedProtocol[result.protocol] &&
	        result.hostname && !result.pathname) {
	      result.path = result.pathname = '/';
	    }
	
	    result.href = result.format();
	    return result;
	  }
	
	  if (relative.protocol && relative.protocol !== result.protocol) {
	    // if it's a known url protocol, then changing
	    // the protocol does weird things
	    // first, if it's not file:, then we MUST have a host,
	    // and if there was a path
	    // to begin with, then we MUST have a path.
	    // if it is file:, then the host is dropped,
	    // because that's known to be hostless.
	    // anything else is assumed to be absolute.
	    if (!slashedProtocol[relative.protocol]) {
	      Object.keys(relative).forEach(function(k) {
	        result[k] = relative[k];
	      });
	      result.href = result.format();
	      return result;
	    }
	
	    result.protocol = relative.protocol;
	    if (!relative.host && !hostlessProtocol[relative.protocol]) {
	      var relPath = (relative.pathname || '').split('/');
	      while (relPath.length && !(relative.host = relPath.shift()));
	      if (!relative.host) relative.host = '';
	      if (!relative.hostname) relative.hostname = '';
	      if (relPath[0] !== '') relPath.unshift('');
	      if (relPath.length < 2) relPath.unshift('');
	      result.pathname = relPath.join('/');
	    } else {
	      result.pathname = relative.pathname;
	    }
	    result.search = relative.search;
	    result.query = relative.query;
	    result.host = relative.host || '';
	    result.auth = relative.auth;
	    result.hostname = relative.hostname || relative.host;
	    result.port = relative.port;
	    // to support http.request
	    if (result.pathname || result.search) {
	      var p = result.pathname || '';
	      var s = result.search || '';
	      result.path = p + s;
	    }
	    result.slashes = result.slashes || relative.slashes;
	    result.href = result.format();
	    return result;
	  }
	
	  var isSourceAbs = (result.pathname && result.pathname.charAt(0) === '/'),
	      isRelAbs = (
	          relative.host ||
	          relative.pathname && relative.pathname.charAt(0) === '/'
	      ),
	      mustEndAbs = (isRelAbs || isSourceAbs ||
	                    (result.host && relative.pathname)),
	      removeAllDots = mustEndAbs,
	      srcPath = result.pathname && result.pathname.split('/') || [],
	      relPath = relative.pathname && relative.pathname.split('/') || [],
	      psychotic = result.protocol && !slashedProtocol[result.protocol];
	
	  // if the url is a non-slashed url, then relative
	  // links like ../.. should be able
	  // to crawl up to the hostname, as well.  This is strange.
	  // result.protocol has already been set by now.
	  // Later on, put the first path part into the host field.
	  if (psychotic) {
	    result.hostname = '';
	    result.port = null;
	    if (result.host) {
	      if (srcPath[0] === '') srcPath[0] = result.host;
	      else srcPath.unshift(result.host);
	    }
	    result.host = '';
	    if (relative.protocol) {
	      relative.hostname = null;
	      relative.port = null;
	      if (relative.host) {
	        if (relPath[0] === '') relPath[0] = relative.host;
	        else relPath.unshift(relative.host);
	      }
	      relative.host = null;
	    }
	    mustEndAbs = mustEndAbs && (relPath[0] === '' || srcPath[0] === '');
	  }
	
	  if (isRelAbs) {
	    // it's absolute.
	    result.host = (relative.host || relative.host === '') ?
	                  relative.host : result.host;
	    result.hostname = (relative.hostname || relative.hostname === '') ?
	                      relative.hostname : result.hostname;
	    result.search = relative.search;
	    result.query = relative.query;
	    srcPath = relPath;
	    // fall through to the dot-handling below.
	  } else if (relPath.length) {
	    // it's relative
	    // throw away the existing file, and take the new path instead.
	    if (!srcPath) srcPath = [];
	    srcPath.pop();
	    srcPath = srcPath.concat(relPath);
	    result.search = relative.search;
	    result.query = relative.query;
	  } else if (!isNullOrUndefined(relative.search)) {
	    // just pull out the search.
	    // like href='?foo'.
	    // Put this after the other two cases because it simplifies the booleans
	    if (psychotic) {
	      result.hostname = result.host = srcPath.shift();
	      //occationaly the auth can get stuck only in host
	      //this especialy happens in cases like
	      //url.resolveObject('mailto:local1@domain1', 'local2@domain2')
	      var authInHost = result.host && result.host.indexOf('@') > 0 ?
	                       result.host.split('@') : false;
	      if (authInHost) {
	        result.auth = authInHost.shift();
	        result.host = result.hostname = authInHost.shift();
	      }
	    }
	    result.search = relative.search;
	    result.query = relative.query;
	    //to support http.request
	    if (!isNull(result.pathname) || !isNull(result.search)) {
	      result.path = (result.pathname ? result.pathname : '') +
	                    (result.search ? result.search : '');
	    }
	    result.href = result.format();
	    return result;
	  }
	
	  if (!srcPath.length) {
	    // no path at all.  easy.
	    // we've already handled the other stuff above.
	    result.pathname = null;
	    //to support http.request
	    if (result.search) {
	      result.path = '/' + result.search;
	    } else {
	      result.path = null;
	    }
	    result.href = result.format();
	    return result;
	  }
	
	  // if a url ENDs in . or .., then it must get a trailing slash.
	  // however, if it ends in anything else non-slashy,
	  // then it must NOT get a trailing slash.
	  var last = srcPath.slice(-1)[0];
	  var hasTrailingSlash = (
	      (result.host || relative.host) && (last === '.' || last === '..') ||
	      last === '');
	
	  // strip single dots, resolve double dots to parent dir
	  // if the path tries to go above the root, `up` ends up > 0
	  var up = 0;
	  for (var i = srcPath.length; i >= 0; i--) {
	    last = srcPath[i];
	    if (last == '.') {
	      srcPath.splice(i, 1);
	    } else if (last === '..') {
	      srcPath.splice(i, 1);
	      up++;
	    } else if (up) {
	      srcPath.splice(i, 1);
	      up--;
	    }
	  }
	
	  // if the path is allowed to go above the root, restore leading ..s
	  if (!mustEndAbs && !removeAllDots) {
	    for (; up--; up) {
	      srcPath.unshift('..');
	    }
	  }
	
	  if (mustEndAbs && srcPath[0] !== '' &&
	      (!srcPath[0] || srcPath[0].charAt(0) !== '/')) {
	    srcPath.unshift('');
	  }
	
	  if (hasTrailingSlash && (srcPath.join('/').substr(-1) !== '/')) {
	    srcPath.push('');
	  }
	
	  var isAbsolute = srcPath[0] === '' ||
	      (srcPath[0] && srcPath[0].charAt(0) === '/');
	
	  // put the host back
	  if (psychotic) {
	    result.hostname = result.host = isAbsolute ? '' :
	                                    srcPath.length ? srcPath.shift() : '';
	    //occationaly the auth can get stuck only in host
	    //this especialy happens in cases like
	    //url.resolveObject('mailto:local1@domain1', 'local2@domain2')
	    var authInHost = result.host && result.host.indexOf('@') > 0 ?
	                     result.host.split('@') : false;
	    if (authInHost) {
	      result.auth = authInHost.shift();
	      result.host = result.hostname = authInHost.shift();
	    }
	  }
	
	  mustEndAbs = mustEndAbs || (result.host && srcPath.length);
	
	  if (mustEndAbs && !isAbsolute) {
	    srcPath.unshift('');
	  }
	
	  if (!srcPath.length) {
	    result.pathname = null;
	    result.path = null;
	  } else {
	    result.pathname = srcPath.join('/');
	  }
	
	  //to support request.http
	  if (!isNull(result.pathname) || !isNull(result.search)) {
	    result.path = (result.pathname ? result.pathname : '') +
	                  (result.search ? result.search : '');
	  }
	  result.auth = relative.auth || result.auth;
	  result.slashes = result.slashes || relative.slashes;
	  result.href = result.format();
	  return result;
	};
	
	Url.prototype.parseHost = function() {
	  var host = this.host;
	  var port = portPattern.exec(host);
	  if (port) {
	    port = port[0];
	    if (port !== ':') {
	      this.port = port.substr(1);
	    }
	    host = host.substr(0, host.length - port.length);
	  }
	  if (host) this.hostname = host;
	};
	
	function isString(arg) {
	  return typeof arg === "string";
	}
	
	function isObject(arg) {
	  return typeof arg === 'object' && arg !== null;
	}
	
	function isNull(arg) {
	  return arg === null;
	}
	function isNullOrUndefined(arg) {
	  return  arg == null;
	}


/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;/* WEBPACK VAR INJECTION */(function(module, global) {/*! https://mths.be/punycode v1.3.2 by @mathias */
	;(function(root) {
	
		/** Detect free variables */
		var freeExports = typeof exports == 'object' && exports &&
			!exports.nodeType && exports;
		var freeModule = typeof module == 'object' && module &&
			!module.nodeType && module;
		var freeGlobal = typeof global == 'object' && global;
		if (
			freeGlobal.global === freeGlobal ||
			freeGlobal.window === freeGlobal ||
			freeGlobal.self === freeGlobal
		) {
			root = freeGlobal;
		}
	
		/**
		 * The `punycode` object.
		 * @name punycode
		 * @type Object
		 */
		var punycode,
	
		/** Highest positive signed 32-bit float value */
		maxInt = 2147483647, // aka. 0x7FFFFFFF or 2^31-1
	
		/** Bootstring parameters */
		base = 36,
		tMin = 1,
		tMax = 26,
		skew = 38,
		damp = 700,
		initialBias = 72,
		initialN = 128, // 0x80
		delimiter = '-', // '\x2D'
	
		/** Regular expressions */
		regexPunycode = /^xn--/,
		regexNonASCII = /[^\x20-\x7E]/, // unprintable ASCII chars + non-ASCII chars
		regexSeparators = /[\x2E\u3002\uFF0E\uFF61]/g, // RFC 3490 separators
	
		/** Error messages */
		errors = {
			'overflow': 'Overflow: input needs wider integers to process',
			'not-basic': 'Illegal input >= 0x80 (not a basic code point)',
			'invalid-input': 'Invalid input'
		},
	
		/** Convenience shortcuts */
		baseMinusTMin = base - tMin,
		floor = Math.floor,
		stringFromCharCode = String.fromCharCode,
	
		/** Temporary variable */
		key;
	
		/*--------------------------------------------------------------------------*/
	
		/**
		 * A generic error utility function.
		 * @private
		 * @param {String} type The error type.
		 * @returns {Error} Throws a `RangeError` with the applicable error message.
		 */
		function error(type) {
			throw RangeError(errors[type]);
		}
	
		/**
		 * A generic `Array#map` utility function.
		 * @private
		 * @param {Array} array The array to iterate over.
		 * @param {Function} callback The function that gets called for every array
		 * item.
		 * @returns {Array} A new array of values returned by the callback function.
		 */
		function map(array, fn) {
			var length = array.length;
			var result = [];
			while (length--) {
				result[length] = fn(array[length]);
			}
			return result;
		}
	
		/**
		 * A simple `Array#map`-like wrapper to work with domain name strings or email
		 * addresses.
		 * @private
		 * @param {String} domain The domain name or email address.
		 * @param {Function} callback The function that gets called for every
		 * character.
		 * @returns {Array} A new string of characters returned by the callback
		 * function.
		 */
		function mapDomain(string, fn) {
			var parts = string.split('@');
			var result = '';
			if (parts.length > 1) {
				// In email addresses, only the domain name should be punycoded. Leave
				// the local part (i.e. everything up to `@`) intact.
				result = parts[0] + '@';
				string = parts[1];
			}
			// Avoid `split(regex)` for IE8 compatibility. See #17.
			string = string.replace(regexSeparators, '\x2E');
			var labels = string.split('.');
			var encoded = map(labels, fn).join('.');
			return result + encoded;
		}
	
		/**
		 * Creates an array containing the numeric code points of each Unicode
		 * character in the string. While JavaScript uses UCS-2 internally,
		 * this function will convert a pair of surrogate halves (each of which
		 * UCS-2 exposes as separate characters) into a single code point,
		 * matching UTF-16.
		 * @see `punycode.ucs2.encode`
		 * @see <https://mathiasbynens.be/notes/javascript-encoding>
		 * @memberOf punycode.ucs2
		 * @name decode
		 * @param {String} string The Unicode input string (UCS-2).
		 * @returns {Array} The new array of code points.
		 */
		function ucs2decode(string) {
			var output = [],
			    counter = 0,
			    length = string.length,
			    value,
			    extra;
			while (counter < length) {
				value = string.charCodeAt(counter++);
				if (value >= 0xD800 && value <= 0xDBFF && counter < length) {
					// high surrogate, and there is a next character
					extra = string.charCodeAt(counter++);
					if ((extra & 0xFC00) == 0xDC00) { // low surrogate
						output.push(((value & 0x3FF) << 10) + (extra & 0x3FF) + 0x10000);
					} else {
						// unmatched surrogate; only append this code unit, in case the next
						// code unit is the high surrogate of a surrogate pair
						output.push(value);
						counter--;
					}
				} else {
					output.push(value);
				}
			}
			return output;
		}
	
		/**
		 * Creates a string based on an array of numeric code points.
		 * @see `punycode.ucs2.decode`
		 * @memberOf punycode.ucs2
		 * @name encode
		 * @param {Array} codePoints The array of numeric code points.
		 * @returns {String} The new Unicode string (UCS-2).
		 */
		function ucs2encode(array) {
			return map(array, function(value) {
				var output = '';
				if (value > 0xFFFF) {
					value -= 0x10000;
					output += stringFromCharCode(value >>> 10 & 0x3FF | 0xD800);
					value = 0xDC00 | value & 0x3FF;
				}
				output += stringFromCharCode(value);
				return output;
			}).join('');
		}
	
		/**
		 * Converts a basic code point into a digit/integer.
		 * @see `digitToBasic()`
		 * @private
		 * @param {Number} codePoint The basic numeric code point value.
		 * @returns {Number} The numeric value of a basic code point (for use in
		 * representing integers) in the range `0` to `base - 1`, or `base` if
		 * the code point does not represent a value.
		 */
		function basicToDigit(codePoint) {
			if (codePoint - 48 < 10) {
				return codePoint - 22;
			}
			if (codePoint - 65 < 26) {
				return codePoint - 65;
			}
			if (codePoint - 97 < 26) {
				return codePoint - 97;
			}
			return base;
		}
	
		/**
		 * Converts a digit/integer into a basic code point.
		 * @see `basicToDigit()`
		 * @private
		 * @param {Number} digit The numeric value of a basic code point.
		 * @returns {Number} The basic code point whose value (when used for
		 * representing integers) is `digit`, which needs to be in the range
		 * `0` to `base - 1`. If `flag` is non-zero, the uppercase form is
		 * used; else, the lowercase form is used. The behavior is undefined
		 * if `flag` is non-zero and `digit` has no uppercase form.
		 */
		function digitToBasic(digit, flag) {
			//  0..25 map to ASCII a..z or A..Z
			// 26..35 map to ASCII 0..9
			return digit + 22 + 75 * (digit < 26) - ((flag != 0) << 5);
		}
	
		/**
		 * Bias adaptation function as per section 3.4 of RFC 3492.
		 * http://tools.ietf.org/html/rfc3492#section-3.4
		 * @private
		 */
		function adapt(delta, numPoints, firstTime) {
			var k = 0;
			delta = firstTime ? floor(delta / damp) : delta >> 1;
			delta += floor(delta / numPoints);
			for (/* no initialization */; delta > baseMinusTMin * tMax >> 1; k += base) {
				delta = floor(delta / baseMinusTMin);
			}
			return floor(k + (baseMinusTMin + 1) * delta / (delta + skew));
		}
	
		/**
		 * Converts a Punycode string of ASCII-only symbols to a string of Unicode
		 * symbols.
		 * @memberOf punycode
		 * @param {String} input The Punycode string of ASCII-only symbols.
		 * @returns {String} The resulting string of Unicode symbols.
		 */
		function decode(input) {
			// Don't use UCS-2
			var output = [],
			    inputLength = input.length,
			    out,
			    i = 0,
			    n = initialN,
			    bias = initialBias,
			    basic,
			    j,
			    index,
			    oldi,
			    w,
			    k,
			    digit,
			    t,
			    /** Cached calculation results */
			    baseMinusT;
	
			// Handle the basic code points: let `basic` be the number of input code
			// points before the last delimiter, or `0` if there is none, then copy
			// the first basic code points to the output.
	
			basic = input.lastIndexOf(delimiter);
			if (basic < 0) {
				basic = 0;
			}
	
			for (j = 0; j < basic; ++j) {
				// if it's not a basic code point
				if (input.charCodeAt(j) >= 0x80) {
					error('not-basic');
				}
				output.push(input.charCodeAt(j));
			}
	
			// Main decoding loop: start just after the last delimiter if any basic code
			// points were copied; start at the beginning otherwise.
	
			for (index = basic > 0 ? basic + 1 : 0; index < inputLength; /* no final expression */) {
	
				// `index` is the index of the next character to be consumed.
				// Decode a generalized variable-length integer into `delta`,
				// which gets added to `i`. The overflow checking is easier
				// if we increase `i` as we go, then subtract off its starting
				// value at the end to obtain `delta`.
				for (oldi = i, w = 1, k = base; /* no condition */; k += base) {
	
					if (index >= inputLength) {
						error('invalid-input');
					}
	
					digit = basicToDigit(input.charCodeAt(index++));
	
					if (digit >= base || digit > floor((maxInt - i) / w)) {
						error('overflow');
					}
	
					i += digit * w;
					t = k <= bias ? tMin : (k >= bias + tMax ? tMax : k - bias);
	
					if (digit < t) {
						break;
					}
	
					baseMinusT = base - t;
					if (w > floor(maxInt / baseMinusT)) {
						error('overflow');
					}
	
					w *= baseMinusT;
	
				}
	
				out = output.length + 1;
				bias = adapt(i - oldi, out, oldi == 0);
	
				// `i` was supposed to wrap around from `out` to `0`,
				// incrementing `n` each time, so we'll fix that now:
				if (floor(i / out) > maxInt - n) {
					error('overflow');
				}
	
				n += floor(i / out);
				i %= out;
	
				// Insert `n` at position `i` of the output
				output.splice(i++, 0, n);
	
			}
	
			return ucs2encode(output);
		}
	
		/**
		 * Converts a string of Unicode symbols (e.g. a domain name label) to a
		 * Punycode string of ASCII-only symbols.
		 * @memberOf punycode
		 * @param {String} input The string of Unicode symbols.
		 * @returns {String} The resulting Punycode string of ASCII-only symbols.
		 */
		function encode(input) {
			var n,
			    delta,
			    handledCPCount,
			    basicLength,
			    bias,
			    j,
			    m,
			    q,
			    k,
			    t,
			    currentValue,
			    output = [],
			    /** `inputLength` will hold the number of code points in `input`. */
			    inputLength,
			    /** Cached calculation results */
			    handledCPCountPlusOne,
			    baseMinusT,
			    qMinusT;
	
			// Convert the input in UCS-2 to Unicode
			input = ucs2decode(input);
	
			// Cache the length
			inputLength = input.length;
	
			// Initialize the state
			n = initialN;
			delta = 0;
			bias = initialBias;
	
			// Handle the basic code points
			for (j = 0; j < inputLength; ++j) {
				currentValue = input[j];
				if (currentValue < 0x80) {
					output.push(stringFromCharCode(currentValue));
				}
			}
	
			handledCPCount = basicLength = output.length;
	
			// `handledCPCount` is the number of code points that have been handled;
			// `basicLength` is the number of basic code points.
	
			// Finish the basic string - if it is not empty - with a delimiter
			if (basicLength) {
				output.push(delimiter);
			}
	
			// Main encoding loop:
			while (handledCPCount < inputLength) {
	
				// All non-basic code points < n have been handled already. Find the next
				// larger one:
				for (m = maxInt, j = 0; j < inputLength; ++j) {
					currentValue = input[j];
					if (currentValue >= n && currentValue < m) {
						m = currentValue;
					}
				}
	
				// Increase `delta` enough to advance the decoder's <n,i> state to <m,0>,
				// but guard against overflow
				handledCPCountPlusOne = handledCPCount + 1;
				if (m - n > floor((maxInt - delta) / handledCPCountPlusOne)) {
					error('overflow');
				}
	
				delta += (m - n) * handledCPCountPlusOne;
				n = m;
	
				for (j = 0; j < inputLength; ++j) {
					currentValue = input[j];
	
					if (currentValue < n && ++delta > maxInt) {
						error('overflow');
					}
	
					if (currentValue == n) {
						// Represent delta as a generalized variable-length integer
						for (q = delta, k = base; /* no condition */; k += base) {
							t = k <= bias ? tMin : (k >= bias + tMax ? tMax : k - bias);
							if (q < t) {
								break;
							}
							qMinusT = q - t;
							baseMinusT = base - t;
							output.push(
								stringFromCharCode(digitToBasic(t + qMinusT % baseMinusT, 0))
							);
							q = floor(qMinusT / baseMinusT);
						}
	
						output.push(stringFromCharCode(digitToBasic(q, 0)));
						bias = adapt(delta, handledCPCountPlusOne, handledCPCount == basicLength);
						delta = 0;
						++handledCPCount;
					}
				}
	
				++delta;
				++n;
	
			}
			return output.join('');
		}
	
		/**
		 * Converts a Punycode string representing a domain name or an email address
		 * to Unicode. Only the Punycoded parts of the input will be converted, i.e.
		 * it doesn't matter if you call it on a string that has already been
		 * converted to Unicode.
		 * @memberOf punycode
		 * @param {String} input The Punycoded domain name or email address to
		 * convert to Unicode.
		 * @returns {String} The Unicode representation of the given Punycode
		 * string.
		 */
		function toUnicode(input) {
			return mapDomain(input, function(string) {
				return regexPunycode.test(string)
					? decode(string.slice(4).toLowerCase())
					: string;
			});
		}
	
		/**
		 * Converts a Unicode string representing a domain name or an email address to
		 * Punycode. Only the non-ASCII parts of the domain name will be converted,
		 * i.e. it doesn't matter if you call it with a domain that's already in
		 * ASCII.
		 * @memberOf punycode
		 * @param {String} input The domain name or email address to convert, as a
		 * Unicode string.
		 * @returns {String} The Punycode representation of the given domain name or
		 * email address.
		 */
		function toASCII(input) {
			return mapDomain(input, function(string) {
				return regexNonASCII.test(string)
					? 'xn--' + encode(string)
					: string;
			});
		}
	
		/*--------------------------------------------------------------------------*/
	
		/** Define the public API */
		punycode = {
			/**
			 * A string representing the current Punycode.js version number.
			 * @memberOf punycode
			 * @type String
			 */
			'version': '1.3.2',
			/**
			 * An object of methods to convert from JavaScript's internal character
			 * representation (UCS-2) to Unicode code points, and back.
			 * @see <https://mathiasbynens.be/notes/javascript-encoding>
			 * @memberOf punycode
			 * @type Object
			 */
			'ucs2': {
				'decode': ucs2decode,
				'encode': ucs2encode
			},
			'decode': decode,
			'encode': encode,
			'toASCII': toASCII,
			'toUnicode': toUnicode
		};
	
		/** Expose `punycode` */
		// Some AMD build optimizers, like r.js, check for specific condition patterns
		// like the following:
		if (
			true
		) {
			!(__WEBPACK_AMD_DEFINE_RESULT__ = function() {
				return punycode;
			}.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
		} else if (freeExports && freeModule) {
			if (module.exports == freeExports) { // in Node.js or RingoJS v0.8.0+
				freeModule.exports = punycode;
			} else { // in Narwhal or RingoJS v0.7.0-
				for (key in punycode) {
					punycode.hasOwnProperty(key) && (freeExports[key] = punycode[key]);
				}
			}
		} else { // in Rhino or a web browser
			root.punycode = punycode;
		}
	
	}(this));
	
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(4)(module), (function() { return this; }())))

/***/ },
/* 4 */
/***/ function(module, exports) {

	module.exports = function(module) {
		if(!module.webpackPolyfill) {
			module.deprecate = function() {};
			module.paths = [];
			// module.parent = undefined by default
			module.children = [];
			module.webpackPolyfill = 1;
		}
		return module;
	}


/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	exports.decode = exports.parse = __webpack_require__(6);
	exports.encode = exports.stringify = __webpack_require__(7);


/***/ },
/* 6 */
/***/ function(module, exports) {

	// Copyright Joyent, Inc. and other Node contributors.
	//
	// Permission is hereby granted, free of charge, to any person obtaining a
	// copy of this software and associated documentation files (the
	// "Software"), to deal in the Software without restriction, including
	// without limitation the rights to use, copy, modify, merge, publish,
	// distribute, sublicense, and/or sell copies of the Software, and to permit
	// persons to whom the Software is furnished to do so, subject to the
	// following conditions:
	//
	// The above copyright notice and this permission notice shall be included
	// in all copies or substantial portions of the Software.
	//
	// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
	// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
	// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
	// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
	// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
	// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
	// USE OR OTHER DEALINGS IN THE SOFTWARE.
	
	'use strict';
	
	// If obj.hasOwnProperty has been overridden, then calling
	// obj.hasOwnProperty(prop) will break.
	// See: https://github.com/joyent/node/issues/1707
	function hasOwnProperty(obj, prop) {
	  return Object.prototype.hasOwnProperty.call(obj, prop);
	}
	
	module.exports = function(qs, sep, eq, options) {
	  sep = sep || '&';
	  eq = eq || '=';
	  var obj = {};
	
	  if (typeof qs !== 'string' || qs.length === 0) {
	    return obj;
	  }
	
	  var regexp = /\+/g;
	  qs = qs.split(sep);
	
	  var maxKeys = 1000;
	  if (options && typeof options.maxKeys === 'number') {
	    maxKeys = options.maxKeys;
	  }
	
	  var len = qs.length;
	  // maxKeys <= 0 means that we should not limit keys count
	  if (maxKeys > 0 && len > maxKeys) {
	    len = maxKeys;
	  }
	
	  for (var i = 0; i < len; ++i) {
	    var x = qs[i].replace(regexp, '%20'),
	        idx = x.indexOf(eq),
	        kstr, vstr, k, v;
	
	    if (idx >= 0) {
	      kstr = x.substr(0, idx);
	      vstr = x.substr(idx + 1);
	    } else {
	      kstr = x;
	      vstr = '';
	    }
	
	    k = decodeURIComponent(kstr);
	    v = decodeURIComponent(vstr);
	
	    if (!hasOwnProperty(obj, k)) {
	      obj[k] = v;
	    } else if (Array.isArray(obj[k])) {
	      obj[k].push(v);
	    } else {
	      obj[k] = [obj[k], v];
	    }
	  }
	
	  return obj;
	};


/***/ },
/* 7 */
/***/ function(module, exports) {

	// Copyright Joyent, Inc. and other Node contributors.
	//
	// Permission is hereby granted, free of charge, to any person obtaining a
	// copy of this software and associated documentation files (the
	// "Software"), to deal in the Software without restriction, including
	// without limitation the rights to use, copy, modify, merge, publish,
	// distribute, sublicense, and/or sell copies of the Software, and to permit
	// persons to whom the Software is furnished to do so, subject to the
	// following conditions:
	//
	// The above copyright notice and this permission notice shall be included
	// in all copies or substantial portions of the Software.
	//
	// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
	// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
	// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
	// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
	// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
	// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
	// USE OR OTHER DEALINGS IN THE SOFTWARE.
	
	'use strict';
	
	var stringifyPrimitive = function(v) {
	  switch (typeof v) {
	    case 'string':
	      return v;
	
	    case 'boolean':
	      return v ? 'true' : 'false';
	
	    case 'number':
	      return isFinite(v) ? v : '';
	
	    default:
	      return '';
	  }
	};
	
	module.exports = function(obj, sep, eq, name) {
	  sep = sep || '&';
	  eq = eq || '=';
	  if (obj === null) {
	    obj = undefined;
	  }
	
	  if (typeof obj === 'object') {
	    return Object.keys(obj).map(function(k) {
	      var ks = encodeURIComponent(stringifyPrimitive(k)) + eq;
	      if (Array.isArray(obj[k])) {
	        return obj[k].map(function(v) {
	          return ks + encodeURIComponent(stringifyPrimitive(v));
	        }).join(sep);
	      } else {
	        return ks + encodeURIComponent(stringifyPrimitive(obj[k]));
	      }
	    }).join(sep);
	
	  }
	
	  if (!name) return '';
	  return encodeURIComponent(stringifyPrimitive(name)) + eq +
	         encodeURIComponent(stringifyPrimitive(obj));
	};


/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	
	module.exports = __webpack_require__(9);


/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	
	/**
	 * Module dependencies.
	 */
	
	var url = __webpack_require__(10);
	var parser = __webpack_require__(13);
	var Manager = __webpack_require__(21);
	var debug = __webpack_require__(12)('socket.io-client');
	
	/**
	 * Module exports.
	 */
	
	module.exports = exports = lookup;
	
	/**
	 * Managers cache.
	 */
	
	var cache = exports.managers = {};
	
	/**
	 * Looks up an existing `Manager` for multiplexing.
	 * If the user summons:
	 *
	 *   `io('http://localhost/a');`
	 *   `io('http://localhost/b');`
	 *
	 * We reuse the existing instance based on same scheme/port/host,
	 * and we initialize sockets for each namespace.
	 *
	 * @api public
	 */
	
	function lookup(uri, opts) {
	  if (typeof uri == 'object') {
	    opts = uri;
	    uri = undefined;
	  }
	
	  opts = opts || {};
	
	  var parsed = url(uri);
	  var source = parsed.source;
	  var id = parsed.id;
	  var io;
	
	  if (opts.forceNew || opts['force new connection'] || false === opts.multiplex) {
	    debug('ignoring socket cache for %s', source);
	    io = Manager(source, opts);
	  } else {
	    if (!cache[id]) {
	      debug('new io instance for %s', source);
	      cache[id] = Manager(source, opts);
	    }
	    io = cache[id];
	  }
	
	  return io.socket(parsed.path);
	}
	
	/**
	 * Protocol version.
	 *
	 * @api public
	 */
	
	exports.protocol = parser.protocol;
	
	/**
	 * `connect`.
	 *
	 * @param {String} uri
	 * @api public
	 */
	
	exports.connect = lookup;
	
	/**
	 * Expose constructors for standalone build.
	 *
	 * @api public
	 */
	
	exports.Manager = __webpack_require__(21);
	exports.Socket = __webpack_require__(51);


/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(global) {
	/**
	 * Module dependencies.
	 */
	
	var parseuri = __webpack_require__(11);
	var debug = __webpack_require__(12)('socket.io-client:url');
	
	/**
	 * Module exports.
	 */
	
	module.exports = url;
	
	/**
	 * URL parser.
	 *
	 * @param {String} url
	 * @param {Object} An object meant to mimic window.location.
	 *                 Defaults to window.location.
	 * @api public
	 */
	
	function url(uri, loc){
	  var obj = uri;
	
	  // default to window.location
	  var loc = loc || global.location;
	  if (null == uri) uri = loc.protocol + '//' + loc.host;
	
	  // relative path support
	  if ('string' == typeof uri) {
	    if ('/' == uri.charAt(0)) {
	      if ('/' == uri.charAt(1)) {
	        uri = loc.protocol + uri;
	      } else {
	        uri = loc.hostname + uri;
	      }
	    }
	
	    if (!/^(https?|wss?):\/\//.test(uri)) {
	      debug('protocol-less url %s', uri);
	      if ('undefined' != typeof loc) {
	        uri = loc.protocol + '//' + uri;
	      } else {
	        uri = 'https://' + uri;
	      }
	    }
	
	    // parse
	    debug('parse %s', uri);
	    obj = parseuri(uri);
	  }
	
	  // make sure we treat `localhost:80` and `localhost` equally
	  if (!obj.port) {
	    if (/^(http|ws)$/.test(obj.protocol)) {
	      obj.port = '80';
	    }
	    else if (/^(http|ws)s$/.test(obj.protocol)) {
	      obj.port = '443';
	    }
	  }
	
	  obj.path = obj.path || '/';
	
	  // define unique id
	  obj.id = obj.protocol + '://' + obj.host + ':' + obj.port;
	  // define href
	  obj.href = obj.protocol + '://' + obj.host + (loc && loc.port == obj.port ? '' : (':' + obj.port));
	
	  return obj;
	}
	
	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ },
/* 11 */
/***/ function(module, exports) {

	/**
	 * Parses an URI
	 *
	 * @author Steven Levithan <stevenlevithan.com> (MIT license)
	 * @api private
	 */
	
	var re = /^(?:(?![^:@]+:[^:@\/]*@)(http|https|ws|wss):\/\/)?((?:(([^:@]*)(?::([^:@]*))?)?@)?((?:[a-f0-9]{0,4}:){2,7}[a-f0-9]{0,4}|[^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/;
	
	var parts = [
	    'source', 'protocol', 'authority', 'userInfo', 'user', 'password', 'host'
	  , 'port', 'relative', 'path', 'directory', 'file', 'query', 'anchor'
	];
	
	module.exports = function parseuri(str) {
	  var m = re.exec(str || '')
	    , uri = {}
	    , i = 14;
	
	  while (i--) {
	    uri[parts[i]] = m[i] || '';
	  }
	
	  return uri;
	};


/***/ },
/* 12 */
/***/ function(module, exports) {

	
	/**
	 * Expose `debug()` as the module.
	 */
	
	module.exports = debug;
	
	/**
	 * Create a debugger with the given `name`.
	 *
	 * @param {String} name
	 * @return {Type}
	 * @api public
	 */
	
	function debug(name) {
	  if (!debug.enabled(name)) return function(){};
	
	  return function(fmt){
	    fmt = coerce(fmt);
	
	    var curr = new Date;
	    var ms = curr - (debug[name] || curr);
	    debug[name] = curr;
	
	    fmt = name
	      + ' '
	      + fmt
	      + ' +' + debug.humanize(ms);
	
	    // This hackery is required for IE8
	    // where `console.log` doesn't have 'apply'
	    window.console
	      && console.log
	      && Function.prototype.apply.call(console.log, console, arguments);
	  }
	}
	
	/**
	 * The currently active debug mode names.
	 */
	
	debug.names = [];
	debug.skips = [];
	
	/**
	 * Enables a debug mode by name. This can include modes
	 * separated by a colon and wildcards.
	 *
	 * @param {String} name
	 * @api public
	 */
	
	debug.enable = function(name) {
	  try {
	    localStorage.debug = name;
	  } catch(e){}
	
	  var split = (name || '').split(/[\s,]+/)
	    , len = split.length;
	
	  for (var i = 0; i < len; i++) {
	    name = split[i].replace('*', '.*?');
	    if (name[0] === '-') {
	      debug.skips.push(new RegExp('^' + name.substr(1) + '$'));
	    }
	    else {
	      debug.names.push(new RegExp('^' + name + '$'));
	    }
	  }
	};
	
	/**
	 * Disable debug output.
	 *
	 * @api public
	 */
	
	debug.disable = function(){
	  debug.enable('');
	};
	
	/**
	 * Humanize the given `ms`.
	 *
	 * @param {Number} m
	 * @return {String}
	 * @api private
	 */
	
	debug.humanize = function(ms) {
	  var sec = 1000
	    , min = 60 * 1000
	    , hour = 60 * min;
	
	  if (ms >= hour) return (ms / hour).toFixed(1) + 'h';
	  if (ms >= min) return (ms / min).toFixed(1) + 'm';
	  if (ms >= sec) return (ms / sec | 0) + 's';
	  return ms + 'ms';
	};
	
	/**
	 * Returns true if the given mode name is enabled, false otherwise.
	 *
	 * @param {String} name
	 * @return {Boolean}
	 * @api public
	 */
	
	debug.enabled = function(name) {
	  for (var i = 0, len = debug.skips.length; i < len; i++) {
	    if (debug.skips[i].test(name)) {
	      return false;
	    }
	  }
	  for (var i = 0, len = debug.names.length; i < len; i++) {
	    if (debug.names[i].test(name)) {
	      return true;
	    }
	  }
	  return false;
	};
	
	/**
	 * Coerce `val`.
	 */
	
	function coerce(val) {
	  if (val instanceof Error) return val.stack || val.message;
	  return val;
	}
	
	// persist
	
	try {
	  if (window.localStorage) debug.enable(localStorage.debug);
	} catch(e){}


/***/ },
/* 13 */
/***/ function(module, exports, __webpack_require__) {

	
	/**
	 * Module dependencies.
	 */
	
	var debug = __webpack_require__(14)('socket.io-parser');
	var json = __webpack_require__(15);
	var isArray = __webpack_require__(17);
	var Emitter = __webpack_require__(18);
	var binary = __webpack_require__(19);
	var isBuf = __webpack_require__(20);
	
	/**
	 * Protocol version.
	 *
	 * @api public
	 */
	
	exports.protocol = 4;
	
	/**
	 * Packet types.
	 *
	 * @api public
	 */
	
	exports.types = [
	  'CONNECT',
	  'DISCONNECT',
	  'EVENT',
	  'BINARY_EVENT',
	  'ACK',
	  'BINARY_ACK',
	  'ERROR'
	];
	
	/**
	 * Packet type `connect`.
	 *
	 * @api public
	 */
	
	exports.CONNECT = 0;
	
	/**
	 * Packet type `disconnect`.
	 *
	 * @api public
	 */
	
	exports.DISCONNECT = 1;
	
	/**
	 * Packet type `event`.
	 *
	 * @api public
	 */
	
	exports.EVENT = 2;
	
	/**
	 * Packet type `ack`.
	 *
	 * @api public
	 */
	
	exports.ACK = 3;
	
	/**
	 * Packet type `error`.
	 *
	 * @api public
	 */
	
	exports.ERROR = 4;
	
	/**
	 * Packet type 'binary event'
	 *
	 * @api public
	 */
	
	exports.BINARY_EVENT = 5;
	
	/**
	 * Packet type `binary ack`. For acks with binary arguments.
	 *
	 * @api public
	 */
	
	exports.BINARY_ACK = 6;
	
	/**
	 * Encoder constructor.
	 *
	 * @api public
	 */
	
	exports.Encoder = Encoder;
	
	/**
	 * Decoder constructor.
	 *
	 * @api public
	 */
	
	exports.Decoder = Decoder;
	
	/**
	 * A socket.io Encoder instance
	 *
	 * @api public
	 */
	
	function Encoder() {}
	
	/**
	 * Encode a packet as a single string if non-binary, or as a
	 * buffer sequence, depending on packet type.
	 *
	 * @param {Object} obj - packet object
	 * @param {Function} callback - function to handle encodings (likely engine.write)
	 * @return Calls callback with Array of encodings
	 * @api public
	 */
	
	Encoder.prototype.encode = function(obj, callback){
	  debug('encoding packet %j', obj);
	
	  if (exports.BINARY_EVENT == obj.type || exports.BINARY_ACK == obj.type) {
	    encodeAsBinary(obj, callback);
	  }
	  else {
	    var encoding = encodeAsString(obj);
	    callback([encoding]);
	  }
	};
	
	/**
	 * Encode packet as string.
	 *
	 * @param {Object} packet
	 * @return {String} encoded
	 * @api private
	 */
	
	function encodeAsString(obj) {
	  var str = '';
	  var nsp = false;
	
	  // first is type
	  str += obj.type;
	
	  // attachments if we have them
	  if (exports.BINARY_EVENT == obj.type || exports.BINARY_ACK == obj.type) {
	    str += obj.attachments;
	    str += '-';
	  }
	
	  // if we have a namespace other than `/`
	  // we append it followed by a comma `,`
	  if (obj.nsp && '/' != obj.nsp) {
	    nsp = true;
	    str += obj.nsp;
	  }
	
	  // immediately followed by the id
	  if (null != obj.id) {
	    if (nsp) {
	      str += ',';
	      nsp = false;
	    }
	    str += obj.id;
	  }
	
	  // json data
	  if (null != obj.data) {
	    if (nsp) str += ',';
	    str += json.stringify(obj.data);
	  }
	
	  debug('encoded %j as %s', obj, str);
	  return str;
	}
	
	/**
	 * Encode packet as 'buffer sequence' by removing blobs, and
	 * deconstructing packet into object with placeholders and
	 * a list of buffers.
	 *
	 * @param {Object} packet
	 * @return {Buffer} encoded
	 * @api private
	 */
	
	function encodeAsBinary(obj, callback) {
	
	  function writeEncoding(bloblessData) {
	    var deconstruction = binary.deconstructPacket(bloblessData);
	    var pack = encodeAsString(deconstruction.packet);
	    var buffers = deconstruction.buffers;
	
	    buffers.unshift(pack); // add packet info to beginning of data list
	    callback(buffers); // write all the buffers
	  }
	
	  binary.removeBlobs(obj, writeEncoding);
	}
	
	/**
	 * A socket.io Decoder instance
	 *
	 * @return {Object} decoder
	 * @api public
	 */
	
	function Decoder() {
	  this.reconstructor = null;
	}
	
	/**
	 * Mix in `Emitter` with Decoder.
	 */
	
	Emitter(Decoder.prototype);
	
	/**
	 * Decodes an ecoded packet string into packet JSON.
	 *
	 * @param {String} obj - encoded packet
	 * @return {Object} packet
	 * @api public
	 */
	
	Decoder.prototype.add = function(obj) {
	  var packet;
	  if ('string' == typeof obj) {
	    packet = decodeString(obj);
	    if (exports.BINARY_EVENT == packet.type || exports.BINARY_ACK == packet.type) { // binary packet's json
	      this.reconstructor = new BinaryReconstructor(packet);
	
	      // no attachments, labeled binary but no binary data to follow
	      if (this.reconstructor.reconPack.attachments === 0) {
	        this.emit('decoded', packet);
	      }
	    } else { // non-binary full packet
	      this.emit('decoded', packet);
	    }
	  }
	  else if (isBuf(obj) || obj.base64) { // raw binary data
	    if (!this.reconstructor) {
	      throw new Error('got binary data when not reconstructing a packet');
	    } else {
	      packet = this.reconstructor.takeBinaryData(obj);
	      if (packet) { // received final buffer
	        this.reconstructor = null;
	        this.emit('decoded', packet);
	      }
	    }
	  }
	  else {
	    throw new Error('Unknown type: ' + obj);
	  }
	};
	
	/**
	 * Decode a packet String (JSON data)
	 *
	 * @param {String} str
	 * @return {Object} packet
	 * @api private
	 */
	
	function decodeString(str) {
	  var p = {};
	  var i = 0;
	
	  // look up type
	  p.type = Number(str.charAt(0));
	  if (null == exports.types[p.type]) return error();
	
	  // look up attachments if type binary
	  if (exports.BINARY_EVENT == p.type || exports.BINARY_ACK == p.type) {
	    var buf = '';
	    while (str.charAt(++i) != '-') {
	      buf += str.charAt(i);
	      if (i == str.length) break;
	    }
	    if (buf != Number(buf) || str.charAt(i) != '-') {
	      throw new Error('Illegal attachments');
	    }
	    p.attachments = Number(buf);
	  }
	
	  // look up namespace (if any)
	  if ('/' == str.charAt(i + 1)) {
	    p.nsp = '';
	    while (++i) {
	      var c = str.charAt(i);
	      if (',' == c) break;
	      p.nsp += c;
	      if (i == str.length) break;
	    }
	  } else {
	    p.nsp = '/';
	  }
	
	  // look up id
	  var next = str.charAt(i + 1);
	  if ('' !== next && Number(next) == next) {
	    p.id = '';
	    while (++i) {
	      var c = str.charAt(i);
	      if (null == c || Number(c) != c) {
	        --i;
	        break;
	      }
	      p.id += str.charAt(i);
	      if (i == str.length) break;
	    }
	    p.id = Number(p.id);
	  }
	
	  // look up json data
	  if (str.charAt(++i)) {
	    try {
	      p.data = json.parse(str.substr(i));
	    } catch(e){
	      return error();
	    }
	  }
	
	  debug('decoded %s as %j', str, p);
	  return p;
	}
	
	/**
	 * Deallocates a parser's resources
	 *
	 * @api public
	 */
	
	Decoder.prototype.destroy = function() {
	  if (this.reconstructor) {
	    this.reconstructor.finishedReconstruction();
	  }
	};
	
	/**
	 * A manager of a binary event's 'buffer sequence'. Should
	 * be constructed whenever a packet of type BINARY_EVENT is
	 * decoded.
	 *
	 * @param {Object} packet
	 * @return {BinaryReconstructor} initialized reconstructor
	 * @api private
	 */
	
	function BinaryReconstructor(packet) {
	  this.reconPack = packet;
	  this.buffers = [];
	}
	
	/**
	 * Method to be called when binary data received from connection
	 * after a BINARY_EVENT packet.
	 *
	 * @param {Buffer | ArrayBuffer} binData - the raw binary data received
	 * @return {null | Object} returns null if more binary data is expected or
	 *   a reconstructed packet object if all buffers have been received.
	 * @api private
	 */
	
	BinaryReconstructor.prototype.takeBinaryData = function(binData) {
	  this.buffers.push(binData);
	  if (this.buffers.length == this.reconPack.attachments) { // done with buffer list
	    var packet = binary.reconstructPacket(this.reconPack, this.buffers);
	    this.finishedReconstruction();
	    return packet;
	  }
	  return null;
	};
	
	/**
	 * Cleans up binary packet reconstruction variables.
	 *
	 * @api private
	 */
	
	BinaryReconstructor.prototype.finishedReconstruction = function() {
	  this.reconPack = null;
	  this.buffers = [];
	};
	
	function error(data){
	  return {
	    type: exports.ERROR,
	    data: 'parser error'
	  };
	}


/***/ },
/* 14 */
/***/ function(module, exports) {

	
	/**
	 * Expose `debug()` as the module.
	 */
	
	module.exports = debug;
	
	/**
	 * Create a debugger with the given `name`.
	 *
	 * @param {String} name
	 * @return {Type}
	 * @api public
	 */
	
	function debug(name) {
	  if (!debug.enabled(name)) return function(){};
	
	  return function(fmt){
	    fmt = coerce(fmt);
	
	    var curr = new Date;
	    var ms = curr - (debug[name] || curr);
	    debug[name] = curr;
	
	    fmt = name
	      + ' '
	      + fmt
	      + ' +' + debug.humanize(ms);
	
	    // This hackery is required for IE8
	    // where `console.log` doesn't have 'apply'
	    window.console
	      && console.log
	      && Function.prototype.apply.call(console.log, console, arguments);
	  }
	}
	
	/**
	 * The currently active debug mode names.
	 */
	
	debug.names = [];
	debug.skips = [];
	
	/**
	 * Enables a debug mode by name. This can include modes
	 * separated by a colon and wildcards.
	 *
	 * @param {String} name
	 * @api public
	 */
	
	debug.enable = function(name) {
	  try {
	    localStorage.debug = name;
	  } catch(e){}
	
	  var split = (name || '').split(/[\s,]+/)
	    , len = split.length;
	
	  for (var i = 0; i < len; i++) {
	    name = split[i].replace('*', '.*?');
	    if (name[0] === '-') {
	      debug.skips.push(new RegExp('^' + name.substr(1) + '$'));
	    }
	    else {
	      debug.names.push(new RegExp('^' + name + '$'));
	    }
	  }
	};
	
	/**
	 * Disable debug output.
	 *
	 * @api public
	 */
	
	debug.disable = function(){
	  debug.enable('');
	};
	
	/**
	 * Humanize the given `ms`.
	 *
	 * @param {Number} m
	 * @return {String}
	 * @api private
	 */
	
	debug.humanize = function(ms) {
	  var sec = 1000
	    , min = 60 * 1000
	    , hour = 60 * min;
	
	  if (ms >= hour) return (ms / hour).toFixed(1) + 'h';
	  if (ms >= min) return (ms / min).toFixed(1) + 'm';
	  if (ms >= sec) return (ms / sec | 0) + 's';
	  return ms + 'ms';
	};
	
	/**
	 * Returns true if the given mode name is enabled, false otherwise.
	 *
	 * @param {String} name
	 * @return {Boolean}
	 * @api public
	 */
	
	debug.enabled = function(name) {
	  for (var i = 0, len = debug.skips.length; i < len; i++) {
	    if (debug.skips[i].test(name)) {
	      return false;
	    }
	  }
	  for (var i = 0, len = debug.names.length; i < len; i++) {
	    if (debug.names[i].test(name)) {
	      return true;
	    }
	  }
	  return false;
	};
	
	/**
	 * Coerce `val`.
	 */
	
	function coerce(val) {
	  if (val instanceof Error) return val.stack || val.message;
	  return val;
	}
	
	// persist
	
	try {
	  if (window.localStorage) debug.enable(localStorage.debug);
	} catch(e){}


/***/ },
/* 15 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;/*! JSON v3.2.6 | http://bestiejs.github.io/json3 | Copyright 2012-2013, Kit Cambridge | http://kit.mit-license.org */
	;(function (window) {
	  // Convenience aliases.
	  var getClass = {}.toString, isProperty, forEach, undef;
	
	  // Detect the `define` function exposed by asynchronous module loaders. The
	  // strict `define` check is necessary for compatibility with `r.js`.
	  var isLoader = "function" === "function" && __webpack_require__(16);
	
	  // Detect native implementations.
	  var nativeJSON = typeof JSON == "object" && JSON;
	
	  // Set up the JSON 3 namespace, preferring the CommonJS `exports` object if
	  // available.
	  var JSON3 = typeof exports == "object" && exports && !exports.nodeType && exports;
	
	  if (JSON3 && nativeJSON) {
	    // Explicitly delegate to the native `stringify` and `parse`
	    // implementations in CommonJS environments.
	    JSON3.stringify = nativeJSON.stringify;
	    JSON3.parse = nativeJSON.parse;
	  } else {
	    // Export for web browsers, JavaScript engines, and asynchronous module
	    // loaders, using the global `JSON` object if available.
	    JSON3 = window.JSON = nativeJSON || {};
	  }
	
	  // Test the `Date#getUTC*` methods. Based on work by @Yaffle.
	  var isExtended = new Date(-3509827334573292);
	  try {
	    // The `getUTCFullYear`, `Month`, and `Date` methods return nonsensical
	    // results for certain dates in Opera >= 10.53.
	    isExtended = isExtended.getUTCFullYear() == -109252 && isExtended.getUTCMonth() === 0 && isExtended.getUTCDate() === 1 &&
	      // Safari < 2.0.2 stores the internal millisecond time value correctly,
	      // but clips the values returned by the date methods to the range of
	      // signed 32-bit integers ([-2 ** 31, 2 ** 31 - 1]).
	      isExtended.getUTCHours() == 10 && isExtended.getUTCMinutes() == 37 && isExtended.getUTCSeconds() == 6 && isExtended.getUTCMilliseconds() == 708;
	  } catch (exception) {}
	
	  // Internal: Determines whether the native `JSON.stringify` and `parse`
	  // implementations are spec-compliant. Based on work by Ken Snyder.
	  function has(name) {
	    if (has[name] !== undef) {
	      // Return cached feature test result.
	      return has[name];
	    }
	
	    var isSupported;
	    if (name == "bug-string-char-index") {
	      // IE <= 7 doesn't support accessing string characters using square
	      // bracket notation. IE 8 only supports this for primitives.
	      isSupported = "a"[0] != "a";
	    } else if (name == "json") {
	      // Indicates whether both `JSON.stringify` and `JSON.parse` are
	      // supported.
	      isSupported = has("json-stringify") && has("json-parse");
	    } else {
	      var value, serialized = '{"a":[1,true,false,null,"\\u0000\\b\\n\\f\\r\\t"]}';
	      // Test `JSON.stringify`.
	      if (name == "json-stringify") {
	        var stringify = JSON3.stringify, stringifySupported = typeof stringify == "function" && isExtended;
	        if (stringifySupported) {
	          // A test function object with a custom `toJSON` method.
	          (value = function () {
	            return 1;
	          }).toJSON = value;
	          try {
	            stringifySupported =
	              // Firefox 3.1b1 and b2 serialize string, number, and boolean
	              // primitives as object literals.
	              stringify(0) === "0" &&
	              // FF 3.1b1, b2, and JSON 2 serialize wrapped primitives as object
	              // literals.
	              stringify(new Number()) === "0" &&
	              stringify(new String()) == '""' &&
	              // FF 3.1b1, 2 throw an error if the value is `null`, `undefined`, or
	              // does not define a canonical JSON representation (this applies to
	              // objects with `toJSON` properties as well, *unless* they are nested
	              // within an object or array).
	              stringify(getClass) === undef &&
	              // IE 8 serializes `undefined` as `"undefined"`. Safari <= 5.1.7 and
	              // FF 3.1b3 pass this test.
	              stringify(undef) === undef &&
	              // Safari <= 5.1.7 and FF 3.1b3 throw `Error`s and `TypeError`s,
	              // respectively, if the value is omitted entirely.
	              stringify() === undef &&
	              // FF 3.1b1, 2 throw an error if the given value is not a number,
	              // string, array, object, Boolean, or `null` literal. This applies to
	              // objects with custom `toJSON` methods as well, unless they are nested
	              // inside object or array literals. YUI 3.0.0b1 ignores custom `toJSON`
	              // methods entirely.
	              stringify(value) === "1" &&
	              stringify([value]) == "[1]" &&
	              // Prototype <= 1.6.1 serializes `[undefined]` as `"[]"` instead of
	              // `"[null]"`.
	              stringify([undef]) == "[null]" &&
	              // YUI 3.0.0b1 fails to serialize `null` literals.
	              stringify(null) == "null" &&
	              // FF 3.1b1, 2 halts serialization if an array contains a function:
	              // `[1, true, getClass, 1]` serializes as "[1,true,],". FF 3.1b3
	              // elides non-JSON values from objects and arrays, unless they
	              // define custom `toJSON` methods.
	              stringify([undef, getClass, null]) == "[null,null,null]" &&
	              // Simple serialization test. FF 3.1b1 uses Unicode escape sequences
	              // where character escape codes are expected (e.g., `\b` => `\u0008`).
	              stringify({ "a": [value, true, false, null, "\x00\b\n\f\r\t"] }) == serialized &&
	              // FF 3.1b1 and b2 ignore the `filter` and `width` arguments.
	              stringify(null, value) === "1" &&
	              stringify([1, 2], null, 1) == "[\n 1,\n 2\n]" &&
	              // JSON 2, Prototype <= 1.7, and older WebKit builds incorrectly
	              // serialize extended years.
	              stringify(new Date(-8.64e15)) == '"-271821-04-20T00:00:00.000Z"' &&
	              // The milliseconds are optional in ES 5, but required in 5.1.
	              stringify(new Date(8.64e15)) == '"+275760-09-13T00:00:00.000Z"' &&
	              // Firefox <= 11.0 incorrectly serializes years prior to 0 as negative
	              // four-digit years instead of six-digit years. Credits: @Yaffle.
	              stringify(new Date(-621987552e5)) == '"-000001-01-01T00:00:00.000Z"' &&
	              // Safari <= 5.1.5 and Opera >= 10.53 incorrectly serialize millisecond
	              // values less than 1000. Credits: @Yaffle.
	              stringify(new Date(-1)) == '"1969-12-31T23:59:59.999Z"';
	          } catch (exception) {
	            stringifySupported = false;
	          }
	        }
	        isSupported = stringifySupported;
	      }
	      // Test `JSON.parse`.
	      if (name == "json-parse") {
	        var parse = JSON3.parse;
	        if (typeof parse == "function") {
	          try {
	            // FF 3.1b1, b2 will throw an exception if a bare literal is provided.
	            // Conforming implementations should also coerce the initial argument to
	            // a string prior to parsing.
	            if (parse("0") === 0 && !parse(false)) {
	              // Simple parsing test.
	              value = parse(serialized);
	              var parseSupported = value["a"].length == 5 && value["a"][0] === 1;
	              if (parseSupported) {
	                try {
	                  // Safari <= 5.1.2 and FF 3.1b1 allow unescaped tabs in strings.
	                  parseSupported = !parse('"\t"');
	                } catch (exception) {}
	                if (parseSupported) {
	                  try {
	                    // FF 4.0 and 4.0.1 allow leading `+` signs and leading
	                    // decimal points. FF 4.0, 4.0.1, and IE 9-10 also allow
	                    // certain octal literals.
	                    parseSupported = parse("01") !== 1;
	                  } catch (exception) {}
	                }
	                if (parseSupported) {
	                  try {
	                    // FF 4.0, 4.0.1, and Rhino 1.7R3-R4 allow trailing decimal
	                    // points. These environments, along with FF 3.1b1 and 2,
	                    // also allow trailing commas in JSON objects and arrays.
	                    parseSupported = parse("1.") !== 1;
	                  } catch (exception) {}
	                }
	              }
	            }
	          } catch (exception) {
	            parseSupported = false;
	          }
	        }
	        isSupported = parseSupported;
	      }
	    }
	    return has[name] = !!isSupported;
	  }
	
	  if (!has("json")) {
	    // Common `[[Class]]` name aliases.
	    var functionClass = "[object Function]";
	    var dateClass = "[object Date]";
	    var numberClass = "[object Number]";
	    var stringClass = "[object String]";
	    var arrayClass = "[object Array]";
	    var booleanClass = "[object Boolean]";
	
	    // Detect incomplete support for accessing string characters by index.
	    var charIndexBuggy = has("bug-string-char-index");
	
	    // Define additional utility methods if the `Date` methods are buggy.
	    if (!isExtended) {
	      var floor = Math.floor;
	      // A mapping between the months of the year and the number of days between
	      // January 1st and the first of the respective month.
	      var Months = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334];
	      // Internal: Calculates the number of days between the Unix epoch and the
	      // first day of the given month.
	      var getDay = function (year, month) {
	        return Months[month] + 365 * (year - 1970) + floor((year - 1969 + (month = +(month > 1))) / 4) - floor((year - 1901 + month) / 100) + floor((year - 1601 + month) / 400);
	      };
	    }
	
	    // Internal: Determines if a property is a direct property of the given
	    // object. Delegates to the native `Object#hasOwnProperty` method.
	    if (!(isProperty = {}.hasOwnProperty)) {
	      isProperty = function (property) {
	        var members = {}, constructor;
	        if ((members.__proto__ = null, members.__proto__ = {
	          // The *proto* property cannot be set multiple times in recent
	          // versions of Firefox and SeaMonkey.
	          "toString": 1
	        }, members).toString != getClass) {
	          // Safari <= 2.0.3 doesn't implement `Object#hasOwnProperty`, but
	          // supports the mutable *proto* property.
	          isProperty = function (property) {
	            // Capture and break the object's prototype chain (see section 8.6.2
	            // of the ES 5.1 spec). The parenthesized expression prevents an
	            // unsafe transformation by the Closure Compiler.
	            var original = this.__proto__, result = property in (this.__proto__ = null, this);
	            // Restore the original prototype chain.
	            this.__proto__ = original;
	            return result;
	          };
	        } else {
	          // Capture a reference to the top-level `Object` constructor.
	          constructor = members.constructor;
	          // Use the `constructor` property to simulate `Object#hasOwnProperty` in
	          // other environments.
	          isProperty = function (property) {
	            var parent = (this.constructor || constructor).prototype;
	            return property in this && !(property in parent && this[property] === parent[property]);
	          };
	        }
	        members = null;
	        return isProperty.call(this, property);
	      };
	    }
	
	    // Internal: A set of primitive types used by `isHostType`.
	    var PrimitiveTypes = {
	      'boolean': 1,
	      'number': 1,
	      'string': 1,
	      'undefined': 1
	    };
	
	    // Internal: Determines if the given object `property` value is a
	    // non-primitive.
	    var isHostType = function (object, property) {
	      var type = typeof object[property];
	      return type == 'object' ? !!object[property] : !PrimitiveTypes[type];
	    };
	
	    // Internal: Normalizes the `for...in` iteration algorithm across
	    // environments. Each enumerated key is yielded to a `callback` function.
	    forEach = function (object, callback) {
	      var size = 0, Properties, members, property;
	
	      // Tests for bugs in the current environment's `for...in` algorithm. The
	      // `valueOf` property inherits the non-enumerable flag from
	      // `Object.prototype` in older versions of IE, Netscape, and Mozilla.
	      (Properties = function () {
	        this.valueOf = 0;
	      }).prototype.valueOf = 0;
	
	      // Iterate over a new instance of the `Properties` class.
	      members = new Properties();
	      for (property in members) {
	        // Ignore all properties inherited from `Object.prototype`.
	        if (isProperty.call(members, property)) {
	          size++;
	        }
	      }
	      Properties = members = null;
	
	      // Normalize the iteration algorithm.
	      if (!size) {
	        // A list of non-enumerable properties inherited from `Object.prototype`.
	        members = ["valueOf", "toString", "toLocaleString", "propertyIsEnumerable", "isPrototypeOf", "hasOwnProperty", "constructor"];
	        // IE <= 8, Mozilla 1.0, and Netscape 6.2 ignore shadowed non-enumerable
	        // properties.
	        forEach = function (object, callback) {
	          var isFunction = getClass.call(object) == functionClass, property, length;
	          var hasProperty = !isFunction && typeof object.constructor != 'function' && isHostType(object, 'hasOwnProperty') ? object.hasOwnProperty : isProperty;
	          for (property in object) {
	            // Gecko <= 1.0 enumerates the `prototype` property of functions under
	            // certain conditions; IE does not.
	            if (!(isFunction && property == "prototype") && hasProperty.call(object, property)) {
	              callback(property);
	            }
	          }
	          // Manually invoke the callback for each non-enumerable property.
	          for (length = members.length; property = members[--length]; hasProperty.call(object, property) && callback(property));
	        };
	      } else if (size == 2) {
	        // Safari <= 2.0.4 enumerates shadowed properties twice.
	        forEach = function (object, callback) {
	          // Create a set of iterated properties.
	          var members = {}, isFunction = getClass.call(object) == functionClass, property;
	          for (property in object) {
	            // Store each property name to prevent double enumeration. The
	            // `prototype` property of functions is not enumerated due to cross-
	            // environment inconsistencies.
	            if (!(isFunction && property == "prototype") && !isProperty.call(members, property) && (members[property] = 1) && isProperty.call(object, property)) {
	              callback(property);
	            }
	          }
	        };
	      } else {
	        // No bugs detected; use the standard `for...in` algorithm.
	        forEach = function (object, callback) {
	          var isFunction = getClass.call(object) == functionClass, property, isConstructor;
	          for (property in object) {
	            if (!(isFunction && property == "prototype") && isProperty.call(object, property) && !(isConstructor = property === "constructor")) {
	              callback(property);
	            }
	          }
	          // Manually invoke the callback for the `constructor` property due to
	          // cross-environment inconsistencies.
	          if (isConstructor || isProperty.call(object, (property = "constructor"))) {
	            callback(property);
	          }
	        };
	      }
	      return forEach(object, callback);
	    };
	
	    // Public: Serializes a JavaScript `value` as a JSON string. The optional
	    // `filter` argument may specify either a function that alters how object and
	    // array members are serialized, or an array of strings and numbers that
	    // indicates which properties should be serialized. The optional `width`
	    // argument may be either a string or number that specifies the indentation
	    // level of the output.
	    if (!has("json-stringify")) {
	      // Internal: A map of control characters and their escaped equivalents.
	      var Escapes = {
	        92: "\\\\",
	        34: '\\"',
	        8: "\\b",
	        12: "\\f",
	        10: "\\n",
	        13: "\\r",
	        9: "\\t"
	      };
	
	      // Internal: Converts `value` into a zero-padded string such that its
	      // length is at least equal to `width`. The `width` must be <= 6.
	      var leadingZeroes = "000000";
	      var toPaddedString = function (width, value) {
	        // The `|| 0` expression is necessary to work around a bug in
	        // Opera <= 7.54u2 where `0 == -0`, but `String(-0) !== "0"`.
	        return (leadingZeroes + (value || 0)).slice(-width);
	      };
	
	      // Internal: Double-quotes a string `value`, replacing all ASCII control
	      // characters (characters with code unit values between 0 and 31) with
	      // their escaped equivalents. This is an implementation of the
	      // `Quote(value)` operation defined in ES 5.1 section 15.12.3.
	      var unicodePrefix = "\\u00";
	      var quote = function (value) {
	        var result = '"', index = 0, length = value.length, isLarge = length > 10 && charIndexBuggy, symbols;
	        if (isLarge) {
	          symbols = value.split("");
	        }
	        for (; index < length; index++) {
	          var charCode = value.charCodeAt(index);
	          // If the character is a control character, append its Unicode or
	          // shorthand escape sequence; otherwise, append the character as-is.
	          switch (charCode) {
	            case 8: case 9: case 10: case 12: case 13: case 34: case 92:
	              result += Escapes[charCode];
	              break;
	            default:
	              if (charCode < 32) {
	                result += unicodePrefix + toPaddedString(2, charCode.toString(16));
	                break;
	              }
	              result += isLarge ? symbols[index] : charIndexBuggy ? value.charAt(index) : value[index];
	          }
	        }
	        return result + '"';
	      };
	
	      // Internal: Recursively serializes an object. Implements the
	      // `Str(key, holder)`, `JO(value)`, and `JA(value)` operations.
	      var serialize = function (property, object, callback, properties, whitespace, indentation, stack) {
	        var value, className, year, month, date, time, hours, minutes, seconds, milliseconds, results, element, index, length, prefix, result;
	        try {
	          // Necessary for host object support.
	          value = object[property];
	        } catch (exception) {}
	        if (typeof value == "object" && value) {
	          className = getClass.call(value);
	          if (className == dateClass && !isProperty.call(value, "toJSON")) {
	            if (value > -1 / 0 && value < 1 / 0) {
	              // Dates are serialized according to the `Date#toJSON` method
	              // specified in ES 5.1 section 15.9.5.44. See section 15.9.1.15
	              // for the ISO 8601 date time string format.
	              if (getDay) {
	                // Manually compute the year, month, date, hours, minutes,
	                // seconds, and milliseconds if the `getUTC*` methods are
	                // buggy. Adapted from @Yaffle's `date-shim` project.
	                date = floor(value / 864e5);
	                for (year = floor(date / 365.2425) + 1970 - 1; getDay(year + 1, 0) <= date; year++);
	                for (month = floor((date - getDay(year, 0)) / 30.42); getDay(year, month + 1) <= date; month++);
	                date = 1 + date - getDay(year, month);
	                // The `time` value specifies the time within the day (see ES
	                // 5.1 section 15.9.1.2). The formula `(A % B + B) % B` is used
	                // to compute `A modulo B`, as the `%` operator does not
	                // correspond to the `modulo` operation for negative numbers.
	                time = (value % 864e5 + 864e5) % 864e5;
	                // The hours, minutes, seconds, and milliseconds are obtained by
	                // decomposing the time within the day. See section 15.9.1.10.
	                hours = floor(time / 36e5) % 24;
	                minutes = floor(time / 6e4) % 60;
	                seconds = floor(time / 1e3) % 60;
	                milliseconds = time % 1e3;
	              } else {
	                year = value.getUTCFullYear();
	                month = value.getUTCMonth();
	                date = value.getUTCDate();
	                hours = value.getUTCHours();
	                minutes = value.getUTCMinutes();
	                seconds = value.getUTCSeconds();
	                milliseconds = value.getUTCMilliseconds();
	              }
	              // Serialize extended years correctly.
	              value = (year <= 0 || year >= 1e4 ? (year < 0 ? "-" : "+") + toPaddedString(6, year < 0 ? -year : year) : toPaddedString(4, year)) +
	                "-" + toPaddedString(2, month + 1) + "-" + toPaddedString(2, date) +
	                // Months, dates, hours, minutes, and seconds should have two
	                // digits; milliseconds should have three.
	                "T" + toPaddedString(2, hours) + ":" + toPaddedString(2, minutes) + ":" + toPaddedString(2, seconds) +
	                // Milliseconds are optional in ES 5.0, but required in 5.1.
	                "." + toPaddedString(3, milliseconds) + "Z";
	            } else {
	              value = null;
	            }
	          } else if (typeof value.toJSON == "function" && ((className != numberClass && className != stringClass && className != arrayClass) || isProperty.call(value, "toJSON"))) {
	            // Prototype <= 1.6.1 adds non-standard `toJSON` methods to the
	            // `Number`, `String`, `Date`, and `Array` prototypes. JSON 3
	            // ignores all `toJSON` methods on these objects unless they are
	            // defined directly on an instance.
	            value = value.toJSON(property);
	          }
	        }
	        if (callback) {
	          // If a replacement function was provided, call it to obtain the value
	          // for serialization.
	          value = callback.call(object, property, value);
	        }
	        if (value === null) {
	          return "null";
	        }
	        className = getClass.call(value);
	        if (className == booleanClass) {
	          // Booleans are represented literally.
	          return "" + value;
	        } else if (className == numberClass) {
	          // JSON numbers must be finite. `Infinity` and `NaN` are serialized as
	          // `"null"`.
	          return value > -1 / 0 && value < 1 / 0 ? "" + value : "null";
	        } else if (className == stringClass) {
	          // Strings are double-quoted and escaped.
	          return quote("" + value);
	        }
	        // Recursively serialize objects and arrays.
	        if (typeof value == "object") {
	          // Check for cyclic structures. This is a linear search; performance
	          // is inversely proportional to the number of unique nested objects.
	          for (length = stack.length; length--;) {
	            if (stack[length] === value) {
	              // Cyclic structures cannot be serialized by `JSON.stringify`.
	              throw TypeError();
	            }
	          }
	          // Add the object to the stack of traversed objects.
	          stack.push(value);
	          results = [];
	          // Save the current indentation level and indent one additional level.
	          prefix = indentation;
	          indentation += whitespace;
	          if (className == arrayClass) {
	            // Recursively serialize array elements.
	            for (index = 0, length = value.length; index < length; index++) {
	              element = serialize(index, value, callback, properties, whitespace, indentation, stack);
	              results.push(element === undef ? "null" : element);
	            }
	            result = results.length ? (whitespace ? "[\n" + indentation + results.join(",\n" + indentation) + "\n" + prefix + "]" : ("[" + results.join(",") + "]")) : "[]";
	          } else {
	            // Recursively serialize object members. Members are selected from
	            // either a user-specified list of property names, or the object
	            // itself.
	            forEach(properties || value, function (property) {
	              var element = serialize(property, value, callback, properties, whitespace, indentation, stack);
	              if (element !== undef) {
	                // According to ES 5.1 section 15.12.3: "If `gap` {whitespace}
	                // is not the empty string, let `member` {quote(property) + ":"}
	                // be the concatenation of `member` and the `space` character."
	                // The "`space` character" refers to the literal space
	                // character, not the `space` {width} argument provided to
	                // `JSON.stringify`.
	                results.push(quote(property) + ":" + (whitespace ? " " : "") + element);
	              }
	            });
	            result = results.length ? (whitespace ? "{\n" + indentation + results.join(",\n" + indentation) + "\n" + prefix + "}" : ("{" + results.join(",") + "}")) : "{}";
	          }
	          // Remove the object from the traversed object stack.
	          stack.pop();
	          return result;
	        }
	      };
	
	      // Public: `JSON.stringify`. See ES 5.1 section 15.12.3.
	      JSON3.stringify = function (source, filter, width) {
	        var whitespace, callback, properties, className;
	        if (typeof filter == "function" || typeof filter == "object" && filter) {
	          if ((className = getClass.call(filter)) == functionClass) {
	            callback = filter;
	          } else if (className == arrayClass) {
	            // Convert the property names array into a makeshift set.
	            properties = {};
	            for (var index = 0, length = filter.length, value; index < length; value = filter[index++], ((className = getClass.call(value)), className == stringClass || className == numberClass) && (properties[value] = 1));
	          }
	        }
	        if (width) {
	          if ((className = getClass.call(width)) == numberClass) {
	            // Convert the `width` to an integer and create a string containing
	            // `width` number of space characters.
	            if ((width -= width % 1) > 0) {
	              for (whitespace = "", width > 10 && (width = 10); whitespace.length < width; whitespace += " ");
	            }
	          } else if (className == stringClass) {
	            whitespace = width.length <= 10 ? width : width.slice(0, 10);
	          }
	        }
	        // Opera <= 7.54u2 discards the values associated with empty string keys
	        // (`""`) only if they are used directly within an object member list
	        // (e.g., `!("" in { "": 1})`).
	        return serialize("", (value = {}, value[""] = source, value), callback, properties, whitespace, "", []);
	      };
	    }
	
	    // Public: Parses a JSON source string.
	    if (!has("json-parse")) {
	      var fromCharCode = String.fromCharCode;
	
	      // Internal: A map of escaped control characters and their unescaped
	      // equivalents.
	      var Unescapes = {
	        92: "\\",
	        34: '"',
	        47: "/",
	        98: "\b",
	        116: "\t",
	        110: "\n",
	        102: "\f",
	        114: "\r"
	      };
	
	      // Internal: Stores the parser state.
	      var Index, Source;
	
	      // Internal: Resets the parser state and throws a `SyntaxError`.
	      var abort = function() {
	        Index = Source = null;
	        throw SyntaxError();
	      };
	
	      // Internal: Returns the next token, or `"$"` if the parser has reached
	      // the end of the source string. A token may be a string, number, `null`
	      // literal, or Boolean literal.
	      var lex = function () {
	        var source = Source, length = source.length, value, begin, position, isSigned, charCode;
	        while (Index < length) {
	          charCode = source.charCodeAt(Index);
	          switch (charCode) {
	            case 9: case 10: case 13: case 32:
	              // Skip whitespace tokens, including tabs, carriage returns, line
	              // feeds, and space characters.
	              Index++;
	              break;
	            case 123: case 125: case 91: case 93: case 58: case 44:
	              // Parse a punctuator token (`{`, `}`, `[`, `]`, `:`, or `,`) at
	              // the current position.
	              value = charIndexBuggy ? source.charAt(Index) : source[Index];
	              Index++;
	              return value;
	            case 34:
	              // `"` delimits a JSON string; advance to the next character and
	              // begin parsing the string. String tokens are prefixed with the
	              // sentinel `@` character to distinguish them from punctuators and
	              // end-of-string tokens.
	              for (value = "@", Index++; Index < length;) {
	                charCode = source.charCodeAt(Index);
	                if (charCode < 32) {
	                  // Unescaped ASCII control characters (those with a code unit
	                  // less than the space character) are not permitted.
	                  abort();
	                } else if (charCode == 92) {
	                  // A reverse solidus (`\`) marks the beginning of an escaped
	                  // control character (including `"`, `\`, and `/`) or Unicode
	                  // escape sequence.
	                  charCode = source.charCodeAt(++Index);
	                  switch (charCode) {
	                    case 92: case 34: case 47: case 98: case 116: case 110: case 102: case 114:
	                      // Revive escaped control characters.
	                      value += Unescapes[charCode];
	                      Index++;
	                      break;
	                    case 117:
	                      // `\u` marks the beginning of a Unicode escape sequence.
	                      // Advance to the first character and validate the
	                      // four-digit code point.
	                      begin = ++Index;
	                      for (position = Index + 4; Index < position; Index++) {
	                        charCode = source.charCodeAt(Index);
	                        // A valid sequence comprises four hexdigits (case-
	                        // insensitive) that form a single hexadecimal value.
	                        if (!(charCode >= 48 && charCode <= 57 || charCode >= 97 && charCode <= 102 || charCode >= 65 && charCode <= 70)) {
	                          // Invalid Unicode escape sequence.
	                          abort();
	                        }
	                      }
	                      // Revive the escaped character.
	                      value += fromCharCode("0x" + source.slice(begin, Index));
	                      break;
	                    default:
	                      // Invalid escape sequence.
	                      abort();
	                  }
	                } else {
	                  if (charCode == 34) {
	                    // An unescaped double-quote character marks the end of the
	                    // string.
	                    break;
	                  }
	                  charCode = source.charCodeAt(Index);
	                  begin = Index;
	                  // Optimize for the common case where a string is valid.
	                  while (charCode >= 32 && charCode != 92 && charCode != 34) {
	                    charCode = source.charCodeAt(++Index);
	                  }
	                  // Append the string as-is.
	                  value += source.slice(begin, Index);
	                }
	              }
	              if (source.charCodeAt(Index) == 34) {
	                // Advance to the next character and return the revived string.
	                Index++;
	                return value;
	              }
	              // Unterminated string.
	              abort();
	            default:
	              // Parse numbers and literals.
	              begin = Index;
	              // Advance past the negative sign, if one is specified.
	              if (charCode == 45) {
	                isSigned = true;
	                charCode = source.charCodeAt(++Index);
	              }
	              // Parse an integer or floating-point value.
	              if (charCode >= 48 && charCode <= 57) {
	                // Leading zeroes are interpreted as octal literals.
	                if (charCode == 48 && ((charCode = source.charCodeAt(Index + 1)), charCode >= 48 && charCode <= 57)) {
	                  // Illegal octal literal.
	                  abort();
	                }
	                isSigned = false;
	                // Parse the integer component.
	                for (; Index < length && ((charCode = source.charCodeAt(Index)), charCode >= 48 && charCode <= 57); Index++);
	                // Floats cannot contain a leading decimal point; however, this
	                // case is already accounted for by the parser.
	                if (source.charCodeAt(Index) == 46) {
	                  position = ++Index;
	                  // Parse the decimal component.
	                  for (; position < length && ((charCode = source.charCodeAt(position)), charCode >= 48 && charCode <= 57); position++);
	                  if (position == Index) {
	                    // Illegal trailing decimal.
	                    abort();
	                  }
	                  Index = position;
	                }
	                // Parse exponents. The `e` denoting the exponent is
	                // case-insensitive.
	                charCode = source.charCodeAt(Index);
	                if (charCode == 101 || charCode == 69) {
	                  charCode = source.charCodeAt(++Index);
	                  // Skip past the sign following the exponent, if one is
	                  // specified.
	                  if (charCode == 43 || charCode == 45) {
	                    Index++;
	                  }
	                  // Parse the exponential component.
	                  for (position = Index; position < length && ((charCode = source.charCodeAt(position)), charCode >= 48 && charCode <= 57); position++);
	                  if (position == Index) {
	                    // Illegal empty exponent.
	                    abort();
	                  }
	                  Index = position;
	                }
	                // Coerce the parsed value to a JavaScript number.
	                return +source.slice(begin, Index);
	              }
	              // A negative sign may only precede numbers.
	              if (isSigned) {
	                abort();
	              }
	              // `true`, `false`, and `null` literals.
	              if (source.slice(Index, Index + 4) == "true") {
	                Index += 4;
	                return true;
	              } else if (source.slice(Index, Index + 5) == "false") {
	                Index += 5;
	                return false;
	              } else if (source.slice(Index, Index + 4) == "null") {
	                Index += 4;
	                return null;
	              }
	              // Unrecognized token.
	              abort();
	          }
	        }
	        // Return the sentinel `$` character if the parser has reached the end
	        // of the source string.
	        return "$";
	      };
	
	      // Internal: Parses a JSON `value` token.
	      var get = function (value) {
	        var results, hasMembers;
	        if (value == "$") {
	          // Unexpected end of input.
	          abort();
	        }
	        if (typeof value == "string") {
	          if ((charIndexBuggy ? value.charAt(0) : value[0]) == "@") {
	            // Remove the sentinel `@` character.
	            return value.slice(1);
	          }
	          // Parse object and array literals.
	          if (value == "[") {
	            // Parses a JSON array, returning a new JavaScript array.
	            results = [];
	            for (;; hasMembers || (hasMembers = true)) {
	              value = lex();
	              // A closing square bracket marks the end of the array literal.
	              if (value == "]") {
	                break;
	              }
	              // If the array literal contains elements, the current token
	              // should be a comma separating the previous element from the
	              // next.
	              if (hasMembers) {
	                if (value == ",") {
	                  value = lex();
	                  if (value == "]") {
	                    // Unexpected trailing `,` in array literal.
	                    abort();
	                  }
	                } else {
	                  // A `,` must separate each array element.
	                  abort();
	                }
	              }
	              // Elisions and leading commas are not permitted.
	              if (value == ",") {
	                abort();
	              }
	              results.push(get(value));
	            }
	            return results;
	          } else if (value == "{") {
	            // Parses a JSON object, returning a new JavaScript object.
	            results = {};
	            for (;; hasMembers || (hasMembers = true)) {
	              value = lex();
	              // A closing curly brace marks the end of the object literal.
	              if (value == "}") {
	                break;
	              }
	              // If the object literal contains members, the current token
	              // should be a comma separator.
	              if (hasMembers) {
	                if (value == ",") {
	                  value = lex();
	                  if (value == "}") {
	                    // Unexpected trailing `,` in object literal.
	                    abort();
	                  }
	                } else {
	                  // A `,` must separate each object member.
	                  abort();
	                }
	              }
	              // Leading commas are not permitted, object property names must be
	              // double-quoted strings, and a `:` must separate each property
	              // name and value.
	              if (value == "," || typeof value != "string" || (charIndexBuggy ? value.charAt(0) : value[0]) != "@" || lex() != ":") {
	                abort();
	              }
	              results[value.slice(1)] = get(lex());
	            }
	            return results;
	          }
	          // Unexpected token encountered.
	          abort();
	        }
	        return value;
	      };
	
	      // Internal: Updates a traversed object member.
	      var update = function(source, property, callback) {
	        var element = walk(source, property, callback);
	        if (element === undef) {
	          delete source[property];
	        } else {
	          source[property] = element;
	        }
	      };
	
	      // Internal: Recursively traverses a parsed JSON object, invoking the
	      // `callback` function for each value. This is an implementation of the
	      // `Walk(holder, name)` operation defined in ES 5.1 section 15.12.2.
	      var walk = function (source, property, callback) {
	        var value = source[property], length;
	        if (typeof value == "object" && value) {
	          // `forEach` can't be used to traverse an array in Opera <= 8.54
	          // because its `Object#hasOwnProperty` implementation returns `false`
	          // for array indices (e.g., `![1, 2, 3].hasOwnProperty("0")`).
	          if (getClass.call(value) == arrayClass) {
	            for (length = value.length; length--;) {
	              update(value, length, callback);
	            }
	          } else {
	            forEach(value, function (property) {
	              update(value, property, callback);
	            });
	          }
	        }
	        return callback.call(source, property, value);
	      };
	
	      // Public: `JSON.parse`. See ES 5.1 section 15.12.2.
	      JSON3.parse = function (source, callback) {
	        var result, value;
	        Index = 0;
	        Source = "" + source;
	        result = get(lex());
	        // If a JSON string contains multiple tokens, it is invalid.
	        if (lex() != "$") {
	          abort();
	        }
	        // Reset the parser state.
	        Index = Source = null;
	        return callback && getClass.call(callback) == functionClass ? walk((value = {}, value[""] = result, value), "", callback) : result;
	      };
	    }
	  }
	
	  // Export for asynchronous module loaders.
	  if (isLoader) {
	    !(__WEBPACK_AMD_DEFINE_RESULT__ = function () {
	      return JSON3;
	    }.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	  }
	}(this));


/***/ },
/* 16 */
/***/ function(module, exports) {

	/* WEBPACK VAR INJECTION */(function(__webpack_amd_options__) {module.exports = __webpack_amd_options__;
	
	/* WEBPACK VAR INJECTION */}.call(exports, {}))

/***/ },
/* 17 */
/***/ function(module, exports) {

	module.exports = Array.isArray || function (arr) {
	  return Object.prototype.toString.call(arr) == '[object Array]';
	};


/***/ },
/* 18 */
/***/ function(module, exports) {

	
	/**
	 * Expose `Emitter`.
	 */
	
	module.exports = Emitter;
	
	/**
	 * Initialize a new `Emitter`.
	 *
	 * @api public
	 */
	
	function Emitter(obj) {
	  if (obj) return mixin(obj);
	};
	
	/**
	 * Mixin the emitter properties.
	 *
	 * @param {Object} obj
	 * @return {Object}
	 * @api private
	 */
	
	function mixin(obj) {
	  for (var key in Emitter.prototype) {
	    obj[key] = Emitter.prototype[key];
	  }
	  return obj;
	}
	
	/**
	 * Listen on the given `event` with `fn`.
	 *
	 * @param {String} event
	 * @param {Function} fn
	 * @return {Emitter}
	 * @api public
	 */
	
	Emitter.prototype.on =
	Emitter.prototype.addEventListener = function(event, fn){
	  this._callbacks = this._callbacks || {};
	  (this._callbacks[event] = this._callbacks[event] || [])
	    .push(fn);
	  return this;
	};
	
	/**
	 * Adds an `event` listener that will be invoked a single
	 * time then automatically removed.
	 *
	 * @param {String} event
	 * @param {Function} fn
	 * @return {Emitter}
	 * @api public
	 */
	
	Emitter.prototype.once = function(event, fn){
	  var self = this;
	  this._callbacks = this._callbacks || {};
	
	  function on() {
	    self.off(event, on);
	    fn.apply(this, arguments);
	  }
	
	  on.fn = fn;
	  this.on(event, on);
	  return this;
	};
	
	/**
	 * Remove the given callback for `event` or all
	 * registered callbacks.
	 *
	 * @param {String} event
	 * @param {Function} fn
	 * @return {Emitter}
	 * @api public
	 */
	
	Emitter.prototype.off =
	Emitter.prototype.removeListener =
	Emitter.prototype.removeAllListeners =
	Emitter.prototype.removeEventListener = function(event, fn){
	  this._callbacks = this._callbacks || {};
	
	  // all
	  if (0 == arguments.length) {
	    this._callbacks = {};
	    return this;
	  }
	
	  // specific event
	  var callbacks = this._callbacks[event];
	  if (!callbacks) return this;
	
	  // remove all handlers
	  if (1 == arguments.length) {
	    delete this._callbacks[event];
	    return this;
	  }
	
	  // remove specific handler
	  var cb;
	  for (var i = 0; i < callbacks.length; i++) {
	    cb = callbacks[i];
	    if (cb === fn || cb.fn === fn) {
	      callbacks.splice(i, 1);
	      break;
	    }
	  }
	  return this;
	};
	
	/**
	 * Emit `event` with the given args.
	 *
	 * @param {String} event
	 * @param {Mixed} ...
	 * @return {Emitter}
	 */
	
	Emitter.prototype.emit = function(event){
	  this._callbacks = this._callbacks || {};
	  var args = [].slice.call(arguments, 1)
	    , callbacks = this._callbacks[event];
	
	  if (callbacks) {
	    callbacks = callbacks.slice(0);
	    for (var i = 0, len = callbacks.length; i < len; ++i) {
	      callbacks[i].apply(this, args);
	    }
	  }
	
	  return this;
	};
	
	/**
	 * Return array of callbacks for `event`.
	 *
	 * @param {String} event
	 * @return {Array}
	 * @api public
	 */
	
	Emitter.prototype.listeners = function(event){
	  this._callbacks = this._callbacks || {};
	  return this._callbacks[event] || [];
	};
	
	/**
	 * Check if this emitter has `event` handlers.
	 *
	 * @param {String} event
	 * @return {Boolean}
	 * @api public
	 */
	
	Emitter.prototype.hasListeners = function(event){
	  return !! this.listeners(event).length;
	};


/***/ },
/* 19 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(global) {/*global Blob,File*/
	
	/**
	 * Module requirements
	 */
	
	var isArray = __webpack_require__(17);
	var isBuf = __webpack_require__(20);
	
	/**
	 * Replaces every Buffer | ArrayBuffer in packet with a numbered placeholder.
	 * Anything with blobs or files should be fed through removeBlobs before coming
	 * here.
	 *
	 * @param {Object} packet - socket.io event packet
	 * @return {Object} with deconstructed packet and list of buffers
	 * @api public
	 */
	
	exports.deconstructPacket = function(packet){
	  var buffers = [];
	  var packetData = packet.data;
	
	  function _deconstructPacket(data) {
	    if (!data) return data;
	
	    if (isBuf(data)) {
	      var placeholder = { _placeholder: true, num: buffers.length };
	      buffers.push(data);
	      return placeholder;
	    } else if (isArray(data)) {
	      var newData = new Array(data.length);
	      for (var i = 0; i < data.length; i++) {
	        newData[i] = _deconstructPacket(data[i]);
	      }
	      return newData;
	    } else if ('object' == typeof data && !(data instanceof Date)) {
	      var newData = {};
	      for (var key in data) {
	        newData[key] = _deconstructPacket(data[key]);
	      }
	      return newData;
	    }
	    return data;
	  }
	
	  var pack = packet;
	  pack.data = _deconstructPacket(packetData);
	  pack.attachments = buffers.length; // number of binary 'attachments'
	  return {packet: pack, buffers: buffers};
	};
	
	/**
	 * Reconstructs a binary packet from its placeholder packet and buffers
	 *
	 * @param {Object} packet - event packet with placeholders
	 * @param {Array} buffers - binary buffers to put in placeholder positions
	 * @return {Object} reconstructed packet
	 * @api public
	 */
	
	exports.reconstructPacket = function(packet, buffers) {
	  var curPlaceHolder = 0;
	
	  function _reconstructPacket(data) {
	    if (data && data._placeholder) {
	      var buf = buffers[data.num]; // appropriate buffer (should be natural order anyway)
	      return buf;
	    } else if (isArray(data)) {
	      for (var i = 0; i < data.length; i++) {
	        data[i] = _reconstructPacket(data[i]);
	      }
	      return data;
	    } else if (data && 'object' == typeof data) {
	      for (var key in data) {
	        data[key] = _reconstructPacket(data[key]);
	      }
	      return data;
	    }
	    return data;
	  }
	
	  packet.data = _reconstructPacket(packet.data);
	  packet.attachments = undefined; // no longer useful
	  return packet;
	};
	
	/**
	 * Asynchronously removes Blobs or Files from data via
	 * FileReader's readAsArrayBuffer method. Used before encoding
	 * data as msgpack. Calls callback with the blobless data.
	 *
	 * @param {Object} data
	 * @param {Function} callback
	 * @api private
	 */
	
	exports.removeBlobs = function(data, callback) {
	  function _removeBlobs(obj, curKey, containingObject) {
	    if (!obj) return obj;
	
	    // convert any blob
	    if ((global.Blob && obj instanceof Blob) ||
	        (global.File && obj instanceof File)) {
	      pendingBlobs++;
	
	      // async filereader
	      var fileReader = new FileReader();
	      fileReader.onload = function() { // this.result == arraybuffer
	        if (containingObject) {
	          containingObject[curKey] = this.result;
	        }
	        else {
	          bloblessData = this.result;
	        }
	
	        // if nothing pending its callback time
	        if(! --pendingBlobs) {
	          callback(bloblessData);
	        }
	      };
	
	      fileReader.readAsArrayBuffer(obj); // blob -> arraybuffer
	    } else if (isArray(obj)) { // handle array
	      for (var i = 0; i < obj.length; i++) {
	        _removeBlobs(obj[i], i, obj);
	      }
	    } else if (obj && 'object' == typeof obj && !isBuf(obj)) { // and object
	      for (var key in obj) {
	        _removeBlobs(obj[key], key, obj);
	      }
	    }
	  }
	
	  var pendingBlobs = 0;
	  var bloblessData = data;
	  _removeBlobs(bloblessData);
	  if (!pendingBlobs) {
	    callback(bloblessData);
	  }
	};
	
	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ },
/* 20 */
/***/ function(module, exports) {

	/* WEBPACK VAR INJECTION */(function(global) {
	module.exports = isBuf;
	
	/**
	 * Returns true if obj is a buffer or an arraybuffer.
	 *
	 * @api private
	 */
	
	function isBuf(obj) {
	  return (global.Buffer && global.Buffer.isBuffer(obj)) ||
	         (global.ArrayBuffer && obj instanceof ArrayBuffer);
	}
	
	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ },
/* 21 */
/***/ function(module, exports, __webpack_require__) {

	
	/**
	 * Module dependencies.
	 */
	
	var url = __webpack_require__(10);
	var eio = __webpack_require__(22);
	var Socket = __webpack_require__(51);
	var Emitter = __webpack_require__(18);
	var parser = __webpack_require__(13);
	var on = __webpack_require__(53);
	var bind = __webpack_require__(54);
	var object = __webpack_require__(55);
	var debug = __webpack_require__(12)('socket.io-client:manager');
	var indexOf = __webpack_require__(48);
	var Backoff = __webpack_require__(56);
	
	/**
	 * Module exports
	 */
	
	module.exports = Manager;
	
	/**
	 * `Manager` constructor.
	 *
	 * @param {String} engine instance or engine uri/opts
	 * @param {Object} options
	 * @api public
	 */
	
	function Manager(uri, opts){
	  if (!(this instanceof Manager)) return new Manager(uri, opts);
	  if (uri && ('object' == typeof uri)) {
	    opts = uri;
	    uri = undefined;
	  }
	  opts = opts || {};
	
	  opts.path = opts.path || '/socket.io';
	  this.nsps = {};
	  this.subs = [];
	  this.opts = opts;
	  this.reconnection(opts.reconnection !== false);
	  this.reconnectionAttempts(opts.reconnectionAttempts || Infinity);
	  this.reconnectionDelay(opts.reconnectionDelay || 1000);
	  this.reconnectionDelayMax(opts.reconnectionDelayMax || 5000);
	  this.randomizationFactor(opts.randomizationFactor || 0.5);
	  this.backoff = new Backoff({
	    min: this.reconnectionDelay(),
	    max: this.reconnectionDelayMax(),
	    jitter: this.randomizationFactor()
	  });
	  this.timeout(null == opts.timeout ? 20000 : opts.timeout);
	  this.readyState = 'closed';
	  this.uri = uri;
	  this.connected = [];
	  this.encoding = false;
	  this.packetBuffer = [];
	  this.encoder = new parser.Encoder();
	  this.decoder = new parser.Decoder();
	  this.autoConnect = opts.autoConnect !== false;
	  if (this.autoConnect) this.open();
	}
	
	/**
	 * Propagate given event to sockets and emit on `this`
	 *
	 * @api private
	 */
	
	Manager.prototype.emitAll = function() {
	  this.emit.apply(this, arguments);
	  for (var nsp in this.nsps) {
	    this.nsps[nsp].emit.apply(this.nsps[nsp], arguments);
	  }
	};
	
	/**
	 * Update `socket.id` of all sockets
	 *
	 * @api private
	 */
	
	Manager.prototype.updateSocketIds = function(){
	  for (var nsp in this.nsps) {
	    this.nsps[nsp].id = this.engine.id;
	  }
	};
	
	/**
	 * Mix in `Emitter`.
	 */
	
	Emitter(Manager.prototype);
	
	/**
	 * Sets the `reconnection` config.
	 *
	 * @param {Boolean} true/false if it should automatically reconnect
	 * @return {Manager} self or value
	 * @api public
	 */
	
	Manager.prototype.reconnection = function(v){
	  if (!arguments.length) return this._reconnection;
	  this._reconnection = !!v;
	  return this;
	};
	
	/**
	 * Sets the reconnection attempts config.
	 *
	 * @param {Number} max reconnection attempts before giving up
	 * @return {Manager} self or value
	 * @api public
	 */
	
	Manager.prototype.reconnectionAttempts = function(v){
	  if (!arguments.length) return this._reconnectionAttempts;
	  this._reconnectionAttempts = v;
	  return this;
	};
	
	/**
	 * Sets the delay between reconnections.
	 *
	 * @param {Number} delay
	 * @return {Manager} self or value
	 * @api public
	 */
	
	Manager.prototype.reconnectionDelay = function(v){
	  if (!arguments.length) return this._reconnectionDelay;
	  this._reconnectionDelay = v;
	  this.backoff && this.backoff.setMin(v);
	  return this;
	};
	
	Manager.prototype.randomizationFactor = function(v){
	  if (!arguments.length) return this._randomizationFactor;
	  this._randomizationFactor = v;
	  this.backoff && this.backoff.setJitter(v);
	  return this;
	};
	
	/**
	 * Sets the maximum delay between reconnections.
	 *
	 * @param {Number} delay
	 * @return {Manager} self or value
	 * @api public
	 */
	
	Manager.prototype.reconnectionDelayMax = function(v){
	  if (!arguments.length) return this._reconnectionDelayMax;
	  this._reconnectionDelayMax = v;
	  this.backoff && this.backoff.setMax(v);
	  return this;
	};
	
	/**
	 * Sets the connection timeout. `false` to disable
	 *
	 * @return {Manager} self or value
	 * @api public
	 */
	
	Manager.prototype.timeout = function(v){
	  if (!arguments.length) return this._timeout;
	  this._timeout = v;
	  return this;
	};
	
	/**
	 * Starts trying to reconnect if reconnection is enabled and we have not
	 * started reconnecting yet
	 *
	 * @api private
	 */
	
	Manager.prototype.maybeReconnectOnOpen = function() {
	  // Only try to reconnect if it's the first time we're connecting
	  if (!this.reconnecting && this._reconnection && this.backoff.attempts === 0) {
	    // keeps reconnection from firing twice for the same reconnection loop
	    this.reconnect();
	  }
	};
	
	
	/**
	 * Sets the current transport `socket`.
	 *
	 * @param {Function} optional, callback
	 * @return {Manager} self
	 * @api public
	 */
	
	Manager.prototype.open =
	Manager.prototype.connect = function(fn){
	  debug('readyState %s', this.readyState);
	  if (~this.readyState.indexOf('open')) return this;
	
	  debug('opening %s', this.uri);
	  this.engine = eio(this.uri, this.opts);
	  var socket = this.engine;
	  var self = this;
	  this.readyState = 'opening';
	  this.skipReconnect = false;
	
	  // emit `open`
	  var openSub = on(socket, 'open', function() {
	    self.onopen();
	    fn && fn();
	  });
	
	  // emit `connect_error`
	  var errorSub = on(socket, 'error', function(data){
	    debug('connect_error');
	    self.cleanup();
	    self.readyState = 'closed';
	    self.emitAll('connect_error', data);
	    if (fn) {
	      var err = new Error('Connection error');
	      err.data = data;
	      fn(err);
	    } else {
	      // Only do this if there is no fn to handle the error
	      self.maybeReconnectOnOpen();
	    }
	  });
	
	  // emit `connect_timeout`
	  if (false !== this._timeout) {
	    var timeout = this._timeout;
	    debug('connect attempt will timeout after %d', timeout);
	
	    // set timer
	    var timer = setTimeout(function(){
	      debug('connect attempt timed out after %d', timeout);
	      openSub.destroy();
	      socket.close();
	      socket.emit('error', 'timeout');
	      self.emitAll('connect_timeout', timeout);
	    }, timeout);
	
	    this.subs.push({
	      destroy: function(){
	        clearTimeout(timer);
	      }
	    });
	  }
	
	  this.subs.push(openSub);
	  this.subs.push(errorSub);
	
	  return this;
	};
	
	/**
	 * Called upon transport open.
	 *
	 * @api private
	 */
	
	Manager.prototype.onopen = function(){
	  debug('open');
	
	  // clear old subs
	  this.cleanup();
	
	  // mark as open
	  this.readyState = 'open';
	  this.emit('open');
	
	  // add new subs
	  var socket = this.engine;
	  this.subs.push(on(socket, 'data', bind(this, 'ondata')));
	  this.subs.push(on(this.decoder, 'decoded', bind(this, 'ondecoded')));
	  this.subs.push(on(socket, 'error', bind(this, 'onerror')));
	  this.subs.push(on(socket, 'close', bind(this, 'onclose')));
	};
	
	/**
	 * Called with data.
	 *
	 * @api private
	 */
	
	Manager.prototype.ondata = function(data){
	  this.decoder.add(data);
	};
	
	/**
	 * Called when parser fully decodes a packet.
	 *
	 * @api private
	 */
	
	Manager.prototype.ondecoded = function(packet) {
	  this.emit('packet', packet);
	};
	
	/**
	 * Called upon socket error.
	 *
	 * @api private
	 */
	
	Manager.prototype.onerror = function(err){
	  debug('error', err);
	  this.emitAll('error', err);
	};
	
	/**
	 * Creates a new socket for the given `nsp`.
	 *
	 * @return {Socket}
	 * @api public
	 */
	
	Manager.prototype.socket = function(nsp){
	  var socket = this.nsps[nsp];
	  if (!socket) {
	    socket = new Socket(this, nsp);
	    this.nsps[nsp] = socket;
	    var self = this;
	    socket.on('connect', function(){
	      socket.id = self.engine.id;
	      if (!~indexOf(self.connected, socket)) {
	        self.connected.push(socket);
	      }
	    });
	  }
	  return socket;
	};
	
	/**
	 * Called upon a socket close.
	 *
	 * @param {Socket} socket
	 */
	
	Manager.prototype.destroy = function(socket){
	  var index = indexOf(this.connected, socket);
	  if (~index) this.connected.splice(index, 1);
	  if (this.connected.length) return;
	
	  this.close();
	};
	
	/**
	 * Writes a packet.
	 *
	 * @param {Object} packet
	 * @api private
	 */
	
	Manager.prototype.packet = function(packet){
	  debug('writing packet %j', packet);
	  var self = this;
	
	  if (!self.encoding) {
	    // encode, then write to engine with result
	    self.encoding = true;
	    this.encoder.encode(packet, function(encodedPackets) {
	      for (var i = 0; i < encodedPackets.length; i++) {
	        self.engine.write(encodedPackets[i]);
	      }
	      self.encoding = false;
	      self.processPacketQueue();
	    });
	  } else { // add packet to the queue
	    self.packetBuffer.push(packet);
	  }
	};
	
	/**
	 * If packet buffer is non-empty, begins encoding the
	 * next packet in line.
	 *
	 * @api private
	 */
	
	Manager.prototype.processPacketQueue = function() {
	  if (this.packetBuffer.length > 0 && !this.encoding) {
	    var pack = this.packetBuffer.shift();
	    this.packet(pack);
	  }
	};
	
	/**
	 * Clean up transport subscriptions and packet buffer.
	 *
	 * @api private
	 */
	
	Manager.prototype.cleanup = function(){
	  var sub;
	  while (sub = this.subs.shift()) sub.destroy();
	
	  this.packetBuffer = [];
	  this.encoding = false;
	
	  this.decoder.destroy();
	};
	
	/**
	 * Close the current socket.
	 *
	 * @api private
	 */
	
	Manager.prototype.close =
	Manager.prototype.disconnect = function(){
	  this.skipReconnect = true;
	  this.backoff.reset();
	  this.readyState = 'closed';
	  this.engine && this.engine.close();
	};
	
	/**
	 * Called upon engine close.
	 *
	 * @api private
	 */
	
	Manager.prototype.onclose = function(reason){
	  debug('close');
	  this.cleanup();
	  this.backoff.reset();
	  this.readyState = 'closed';
	  this.emit('close', reason);
	  if (this._reconnection && !this.skipReconnect) {
	    this.reconnect();
	  }
	};
	
	/**
	 * Attempt a reconnection.
	 *
	 * @api private
	 */
	
	Manager.prototype.reconnect = function(){
	  if (this.reconnecting || this.skipReconnect) return this;
	
	  var self = this;
	
	  if (this.backoff.attempts >= this._reconnectionAttempts) {
	    debug('reconnect failed');
	    this.backoff.reset();
	    this.emitAll('reconnect_failed');
	    this.reconnecting = false;
	  } else {
	    var delay = this.backoff.duration();
	    debug('will wait %dms before reconnect attempt', delay);
	
	    this.reconnecting = true;
	    var timer = setTimeout(function(){
	      if (self.skipReconnect) return;
	
	      debug('attempting reconnect');
	      self.emitAll('reconnect_attempt', self.backoff.attempts);
	      self.emitAll('reconnecting', self.backoff.attempts);
	
	      // check again for the case socket closed in above events
	      if (self.skipReconnect) return;
	
	      self.open(function(err){
	        if (err) {
	          debug('reconnect attempt error');
	          self.reconnecting = false;
	          self.reconnect();
	          self.emitAll('reconnect_error', err.data);
	        } else {
	          debug('reconnect success');
	          self.onreconnect();
	        }
	      });
	    }, delay);
	
	    this.subs.push({
	      destroy: function(){
	        clearTimeout(timer);
	      }
	    });
	  }
	};
	
	/**
	 * Called upon successful reconnect.
	 *
	 * @api private
	 */
	
	Manager.prototype.onreconnect = function(){
	  var attempt = this.backoff.attempts;
	  this.reconnecting = false;
	  this.backoff.reset();
	  this.updateSocketIds();
	  this.emitAll('reconnect', attempt);
	};


/***/ },
/* 22 */
/***/ function(module, exports, __webpack_require__) {

	
	module.exports =  __webpack_require__(23);


/***/ },
/* 23 */
/***/ function(module, exports, __webpack_require__) {

	
	module.exports = __webpack_require__(24);
	
	/**
	 * Exports parser
	 *
	 * @api public
	 *
	 */
	module.exports.parser = __webpack_require__(32);


/***/ },
/* 24 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(global) {/**
	 * Module dependencies.
	 */
	
	var transports = __webpack_require__(25);
	var Emitter = __webpack_require__(18);
	var debug = __webpack_require__(42)('engine.io-client:socket');
	var index = __webpack_require__(48);
	var parser = __webpack_require__(32);
	var parseuri = __webpack_require__(49);
	var parsejson = __webpack_require__(50);
	var parseqs = __webpack_require__(40);
	
	/**
	 * Module exports.
	 */
	
	module.exports = Socket;
	
	/**
	 * Noop function.
	 *
	 * @api private
	 */
	
	function noop(){}
	
	/**
	 * Socket constructor.
	 *
	 * @param {String|Object} uri or options
	 * @param {Object} options
	 * @api public
	 */
	
	function Socket(uri, opts){
	  if (!(this instanceof Socket)) return new Socket(uri, opts);
	
	  opts = opts || {};
	
	  if (uri && 'object' == typeof uri) {
	    opts = uri;
	    uri = null;
	  }
	
	  if (uri) {
	    uri = parseuri(uri);
	    opts.host = uri.host;
	    opts.secure = uri.protocol == 'https' || uri.protocol == 'wss';
	    opts.port = uri.port;
	    if (uri.query) opts.query = uri.query;
	  }
	
	  this.secure = null != opts.secure ? opts.secure :
	    (global.location && 'https:' == location.protocol);
	
	  if (opts.host) {
	    var pieces = opts.host.split(':');
	    opts.hostname = pieces.shift();
	    if (pieces.length) {
	      opts.port = pieces.pop();
	    } else if (!opts.port) {
	      // if no port is specified manually, use the protocol default
	      opts.port = this.secure ? '443' : '80';
	    }
	  }
	
	  this.agent = opts.agent || false;
	  this.hostname = opts.hostname ||
	    (global.location ? location.hostname : 'localhost');
	  this.port = opts.port || (global.location && location.port ?
	       location.port :
	       (this.secure ? 443 : 80));
	  this.query = opts.query || {};
	  if ('string' == typeof this.query) this.query = parseqs.decode(this.query);
	  this.upgrade = false !== opts.upgrade;
	  this.path = (opts.path || '/engine.io').replace(/\/$/, '') + '/';
	  this.forceJSONP = !!opts.forceJSONP;
	  this.jsonp = false !== opts.jsonp;
	  this.forceBase64 = !!opts.forceBase64;
	  this.enablesXDR = !!opts.enablesXDR;
	  this.timestampParam = opts.timestampParam || 't';
	  this.timestampRequests = opts.timestampRequests;
	  this.transports = opts.transports || ['polling', 'websocket'];
	  this.readyState = '';
	  this.writeBuffer = [];
	  this.callbackBuffer = [];
	  this.policyPort = opts.policyPort || 843;
	  this.rememberUpgrade = opts.rememberUpgrade || false;
	  this.binaryType = null;
	  this.onlyBinaryUpgrades = opts.onlyBinaryUpgrades;
	
	  // SSL options for Node.js client
	  this.pfx = opts.pfx || null;
	  this.key = opts.key || null;
	  this.passphrase = opts.passphrase || null;
	  this.cert = opts.cert || null;
	  this.ca = opts.ca || null;
	  this.ciphers = opts.ciphers || null;
	  this.rejectUnauthorized = opts.rejectUnauthorized || null;
	
	  this.open();
	}
	
	Socket.priorWebsocketSuccess = false;
	
	/**
	 * Mix in `Emitter`.
	 */
	
	Emitter(Socket.prototype);
	
	/**
	 * Protocol version.
	 *
	 * @api public
	 */
	
	Socket.protocol = parser.protocol; // this is an int
	
	/**
	 * Expose deps for legacy compatibility
	 * and standalone browser access.
	 */
	
	Socket.Socket = Socket;
	Socket.Transport = __webpack_require__(31);
	Socket.transports = __webpack_require__(25);
	Socket.parser = __webpack_require__(32);
	
	/**
	 * Creates transport of the given type.
	 *
	 * @param {String} transport name
	 * @return {Transport}
	 * @api private
	 */
	
	Socket.prototype.createTransport = function (name) {
	  debug('creating transport "%s"', name);
	  var query = clone(this.query);
	
	  // append engine.io protocol identifier
	  query.EIO = parser.protocol;
	
	  // transport name
	  query.transport = name;
	
	  // session id if we already have one
	  if (this.id) query.sid = this.id;
	
	  var transport = new transports[name]({
	    agent: this.agent,
	    hostname: this.hostname,
	    port: this.port,
	    secure: this.secure,
	    path: this.path,
	    query: query,
	    forceJSONP: this.forceJSONP,
	    jsonp: this.jsonp,
	    forceBase64: this.forceBase64,
	    enablesXDR: this.enablesXDR,
	    timestampRequests: this.timestampRequests,
	    timestampParam: this.timestampParam,
	    policyPort: this.policyPort,
	    socket: this,
	    pfx: this.pfx,
	    key: this.key,
	    passphrase: this.passphrase,
	    cert: this.cert,
	    ca: this.ca,
	    ciphers: this.ciphers,
	    rejectUnauthorized: this.rejectUnauthorized
	  });
	
	  return transport;
	};
	
	function clone (obj) {
	  var o = {};
	  for (var i in obj) {
	    if (obj.hasOwnProperty(i)) {
	      o[i] = obj[i];
	    }
	  }
	  return o;
	}
	
	/**
	 * Initializes transport to use and starts probe.
	 *
	 * @api private
	 */
	Socket.prototype.open = function () {
	  var transport;
	  if (this.rememberUpgrade && Socket.priorWebsocketSuccess && this.transports.indexOf('websocket') != -1) {
	    transport = 'websocket';
	  } else if (0 == this.transports.length) {
	    // Emit error on next tick so it can be listened to
	    var self = this;
	    setTimeout(function() {
	      self.emit('error', 'No transports available');
	    }, 0);
	    return;
	  } else {
	    transport = this.transports[0];
	  }
	  this.readyState = 'opening';
	
	  // Retry with the next transport if the transport is disabled (jsonp: false)
	  var transport;
	  try {
	    transport = this.createTransport(transport);
	  } catch (e) {
	    this.transports.shift();
	    this.open();
	    return;
	  }
	
	  transport.open();
	  this.setTransport(transport);
	};
	
	/**
	 * Sets the current transport. Disables the existing one (if any).
	 *
	 * @api private
	 */
	
	Socket.prototype.setTransport = function(transport){
	  debug('setting transport %s', transport.name);
	  var self = this;
	
	  if (this.transport) {
	    debug('clearing existing transport %s', this.transport.name);
	    this.transport.removeAllListeners();
	  }
	
	  // set up transport
	  this.transport = transport;
	
	  // set up transport listeners
	  transport
	  .on('drain', function(){
	    self.onDrain();
	  })
	  .on('packet', function(packet){
	    self.onPacket(packet);
	  })
	  .on('error', function(e){
	    self.onError(e);
	  })
	  .on('close', function(){
	    self.onClose('transport close');
	  });
	};
	
	/**
	 * Probes a transport.
	 *
	 * @param {String} transport name
	 * @api private
	 */
	
	Socket.prototype.probe = function (name) {
	  debug('probing transport "%s"', name);
	  var transport = this.createTransport(name, { probe: 1 })
	    , failed = false
	    , self = this;
	
	  Socket.priorWebsocketSuccess = false;
	
	  function onTransportOpen(){
	    if (self.onlyBinaryUpgrades) {
	      var upgradeLosesBinary = !this.supportsBinary && self.transport.supportsBinary;
	      failed = failed || upgradeLosesBinary;
	    }
	    if (failed) return;
	
	    debug('probe transport "%s" opened', name);
	    transport.send([{ type: 'ping', data: 'probe' }]);
	    transport.once('packet', function (msg) {
	      if (failed) return;
	      if ('pong' == msg.type && 'probe' == msg.data) {
	        debug('probe transport "%s" pong', name);
	        self.upgrading = true;
	        self.emit('upgrading', transport);
	        if (!transport) return;
	        Socket.priorWebsocketSuccess = 'websocket' == transport.name;
	
	        debug('pausing current transport "%s"', self.transport.name);
	        self.transport.pause(function () {
	          if (failed) return;
	          if ('closed' == self.readyState) return;
	          debug('changing transport and sending upgrade packet');
	
	          cleanup();
	
	          self.setTransport(transport);
	          transport.send([{ type: 'upgrade' }]);
	          self.emit('upgrade', transport);
	          transport = null;
	          self.upgrading = false;
	          self.flush();
	        });
	      } else {
	        debug('probe transport "%s" failed', name);
	        var err = new Error('probe error');
	        err.transport = transport.name;
	        self.emit('upgradeError', err);
	      }
	    });
	  }
	
	  function freezeTransport() {
	    if (failed) return;
	
	    // Any callback called by transport should be ignored since now
	    failed = true;
	
	    cleanup();
	
	    transport.close();
	    transport = null;
	  }
	
	  //Handle any error that happens while probing
	  function onerror(err) {
	    var error = new Error('probe error: ' + err);
	    error.transport = transport.name;
	
	    freezeTransport();
	
	    debug('probe transport "%s" failed because of error: %s', name, err);
	
	    self.emit('upgradeError', error);
	  }
	
	  function onTransportClose(){
	    onerror("transport closed");
	  }
	
	  //When the socket is closed while we're probing
	  function onclose(){
	    onerror("socket closed");
	  }
	
	  //When the socket is upgraded while we're probing
	  function onupgrade(to){
	    if (transport && to.name != transport.name) {
	      debug('"%s" works - aborting "%s"', to.name, transport.name);
	      freezeTransport();
	    }
	  }
	
	  //Remove all listeners on the transport and on self
	  function cleanup(){
	    transport.removeListener('open', onTransportOpen);
	    transport.removeListener('error', onerror);
	    transport.removeListener('close', onTransportClose);
	    self.removeListener('close', onclose);
	    self.removeListener('upgrading', onupgrade);
	  }
	
	  transport.once('open', onTransportOpen);
	  transport.once('error', onerror);
	  transport.once('close', onTransportClose);
	
	  this.once('close', onclose);
	  this.once('upgrading', onupgrade);
	
	  transport.open();
	
	};
	
	/**
	 * Called when connection is deemed open.
	 *
	 * @api public
	 */
	
	Socket.prototype.onOpen = function () {
	  debug('socket open');
	  this.readyState = 'open';
	  Socket.priorWebsocketSuccess = 'websocket' == this.transport.name;
	  this.emit('open');
	  this.flush();
	
	  // we check for `readyState` in case an `open`
	  // listener already closed the socket
	  if ('open' == this.readyState && this.upgrade && this.transport.pause) {
	    debug('starting upgrade probes');
	    for (var i = 0, l = this.upgrades.length; i < l; i++) {
	      this.probe(this.upgrades[i]);
	    }
	  }
	};
	
	/**
	 * Handles a packet.
	 *
	 * @api private
	 */
	
	Socket.prototype.onPacket = function (packet) {
	  if ('opening' == this.readyState || 'open' == this.readyState) {
	    debug('socket receive: type "%s", data "%s"', packet.type, packet.data);
	
	    this.emit('packet', packet);
	
	    // Socket is live - any packet counts
	    this.emit('heartbeat');
	
	    switch (packet.type) {
	      case 'open':
	        this.onHandshake(parsejson(packet.data));
	        break;
	
	      case 'pong':
	        this.setPing();
	        break;
	
	      case 'error':
	        var err = new Error('server error');
	        err.code = packet.data;
	        this.emit('error', err);
	        break;
	
	      case 'message':
	        this.emit('data', packet.data);
	        this.emit('message', packet.data);
	        break;
	    }
	  } else {
	    debug('packet received with socket readyState "%s"', this.readyState);
	  }
	};
	
	/**
	 * Called upon handshake completion.
	 *
	 * @param {Object} handshake obj
	 * @api private
	 */
	
	Socket.prototype.onHandshake = function (data) {
	  this.emit('handshake', data);
	  this.id = data.sid;
	  this.transport.query.sid = data.sid;
	  this.upgrades = this.filterUpgrades(data.upgrades);
	  this.pingInterval = data.pingInterval;
	  this.pingTimeout = data.pingTimeout;
	  this.onOpen();
	  // In case open handler closes socket
	  if  ('closed' == this.readyState) return;
	  this.setPing();
	
	  // Prolong liveness of socket on heartbeat
	  this.removeListener('heartbeat', this.onHeartbeat);
	  this.on('heartbeat', this.onHeartbeat);
	};
	
	/**
	 * Resets ping timeout.
	 *
	 * @api private
	 */
	
	Socket.prototype.onHeartbeat = function (timeout) {
	  clearTimeout(this.pingTimeoutTimer);
	  var self = this;
	  self.pingTimeoutTimer = setTimeout(function () {
	    if ('closed' == self.readyState) return;
	    self.onClose('ping timeout');
	  }, timeout || (self.pingInterval + self.pingTimeout));
	};
	
	/**
	 * Pings server every `this.pingInterval` and expects response
	 * within `this.pingTimeout` or closes connection.
	 *
	 * @api private
	 */
	
	Socket.prototype.setPing = function () {
	  var self = this;
	  clearTimeout(self.pingIntervalTimer);
	  self.pingIntervalTimer = setTimeout(function () {
	    debug('writing ping packet - expecting pong within %sms', self.pingTimeout);
	    self.ping();
	    self.onHeartbeat(self.pingTimeout);
	  }, self.pingInterval);
	};
	
	/**
	* Sends a ping packet.
	*
	* @api public
	*/
	
	Socket.prototype.ping = function () {
	  this.sendPacket('ping');
	};
	
	/**
	 * Called on `drain` event
	 *
	 * @api private
	 */
	
	Socket.prototype.onDrain = function() {
	  for (var i = 0; i < this.prevBufferLen; i++) {
	    if (this.callbackBuffer[i]) {
	      this.callbackBuffer[i]();
	    }
	  }
	
	  this.writeBuffer.splice(0, this.prevBufferLen);
	  this.callbackBuffer.splice(0, this.prevBufferLen);
	
	  // setting prevBufferLen = 0 is very important
	  // for example, when upgrading, upgrade packet is sent over,
	  // and a nonzero prevBufferLen could cause problems on `drain`
	  this.prevBufferLen = 0;
	
	  if (this.writeBuffer.length == 0) {
	    this.emit('drain');
	  } else {
	    this.flush();
	  }
	};
	
	/**
	 * Flush write buffers.
	 *
	 * @api private
	 */
	
	Socket.prototype.flush = function () {
	  if ('closed' != this.readyState && this.transport.writable &&
	    !this.upgrading && this.writeBuffer.length) {
	    debug('flushing %d packets in socket', this.writeBuffer.length);
	    this.transport.send(this.writeBuffer);
	    // keep track of current length of writeBuffer
	    // splice writeBuffer and callbackBuffer on `drain`
	    this.prevBufferLen = this.writeBuffer.length;
	    this.emit('flush');
	  }
	};
	
	/**
	 * Sends a message.
	 *
	 * @param {String} message.
	 * @param {Function} callback function.
	 * @return {Socket} for chaining.
	 * @api public
	 */
	
	Socket.prototype.write =
	Socket.prototype.send = function (msg, fn) {
	  this.sendPacket('message', msg, fn);
	  return this;
	};
	
	/**
	 * Sends a packet.
	 *
	 * @param {String} packet type.
	 * @param {String} data.
	 * @param {Function} callback function.
	 * @api private
	 */
	
	Socket.prototype.sendPacket = function (type, data, fn) {
	  if ('closing' == this.readyState || 'closed' == this.readyState) {
	    return;
	  }
	
	  var packet = { type: type, data: data };
	  this.emit('packetCreate', packet);
	  this.writeBuffer.push(packet);
	  this.callbackBuffer.push(fn);
	  this.flush();
	};
	
	/**
	 * Closes the connection.
	 *
	 * @api private
	 */
	
	Socket.prototype.close = function () {
	  if ('opening' == this.readyState || 'open' == this.readyState) {
	    this.readyState = 'closing';
	
	    var self = this;
	
	    function close() {
	      self.onClose('forced close');
	      debug('socket closing - telling transport to close');
	      self.transport.close();
	    }
	
	    function cleanupAndClose() {
	      self.removeListener('upgrade', cleanupAndClose);
	      self.removeListener('upgradeError', cleanupAndClose);
	      close();
	    }
	
	    function waitForUpgrade() {
	      // wait for upgrade to finish since we can't send packets while pausing a transport
	      self.once('upgrade', cleanupAndClose);
	      self.once('upgradeError', cleanupAndClose);
	    }
	
	    if (this.writeBuffer.length) {
	      this.once('drain', function() {
	        if (this.upgrading) {
	          waitForUpgrade();
	        } else {
	          close();
	        }
	      });
	    } else if (this.upgrading) {
	      waitForUpgrade();
	    } else {
	      close();
	    }
	  }
	
	  return this;
	};
	
	/**
	 * Called upon transport error
	 *
	 * @api private
	 */
	
	Socket.prototype.onError = function (err) {
	  debug('socket error %j', err);
	  Socket.priorWebsocketSuccess = false;
	  this.emit('error', err);
	  this.onClose('transport error', err);
	};
	
	/**
	 * Called upon transport close.
	 *
	 * @api private
	 */
	
	Socket.prototype.onClose = function (reason, desc) {
	  if ('opening' == this.readyState || 'open' == this.readyState || 'closing' == this.readyState) {
	    debug('socket close with reason: "%s"', reason);
	    var self = this;
	
	    // clear timers
	    clearTimeout(this.pingIntervalTimer);
	    clearTimeout(this.pingTimeoutTimer);
	
	    // clean buffers in next tick, so developers can still
	    // grab the buffers on `close` event
	    setTimeout(function() {
	      self.writeBuffer = [];
	      self.callbackBuffer = [];
	      self.prevBufferLen = 0;
	    }, 0);
	
	    // stop event from firing again for transport
	    this.transport.removeAllListeners('close');
	
	    // ensure transport won't stay open
	    this.transport.close();
	
	    // ignore further transport communication
	    this.transport.removeAllListeners();
	
	    // set ready state
	    this.readyState = 'closed';
	
	    // clear session id
	    this.id = null;
	
	    // emit close event
	    this.emit('close', reason, desc);
	  }
	};
	
	/**
	 * Filters upgrades, returning only those matching client transports.
	 *
	 * @param {Array} server upgrades
	 * @api private
	 *
	 */
	
	Socket.prototype.filterUpgrades = function (upgrades) {
	  var filteredUpgrades = [];
	  for (var i = 0, j = upgrades.length; i<j; i++) {
	    if (~index(this.transports, upgrades[i])) filteredUpgrades.push(upgrades[i]);
	  }
	  return filteredUpgrades;
	};
	
	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ },
/* 25 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(global) {/**
	 * Module dependencies
	 */
	
	var XMLHttpRequest = __webpack_require__(26);
	var XHR = __webpack_require__(29);
	var JSONP = __webpack_require__(45);
	var websocket = __webpack_require__(46);
	
	/**
	 * Export transports.
	 */
	
	exports.polling = polling;
	exports.websocket = websocket;
	
	/**
	 * Polling transport polymorphic constructor.
	 * Decides on xhr vs jsonp based on feature detection.
	 *
	 * @api private
	 */
	
	function polling(opts){
	  var xhr;
	  var xd = false;
	  var xs = false;
	  var jsonp = false !== opts.jsonp;
	
	  if (global.location) {
	    var isSSL = 'https:' == location.protocol;
	    var port = location.port;
	
	    // some user agents have empty `location.port`
	    if (!port) {
	      port = isSSL ? 443 : 80;
	    }
	
	    xd = opts.hostname != location.hostname || port != opts.port;
	    xs = opts.secure != isSSL;
	  }
	
	  opts.xdomain = xd;
	  opts.xscheme = xs;
	  xhr = new XMLHttpRequest(opts);
	
	  if ('open' in xhr && !opts.forceJSONP) {
	    return new XHR(opts);
	  } else {
	    if (!jsonp) throw new Error('JSONP disabled');
	    return new JSONP(opts);
	  }
	}
	
	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ },
/* 26 */
/***/ function(module, exports, __webpack_require__) {

	// browser shim for xmlhttprequest module
	var hasCORS = __webpack_require__(27);
	
	module.exports = function(opts) {
	  var xdomain = opts.xdomain;
	
	  // scheme must be same when usign XDomainRequest
	  // http://blogs.msdn.com/b/ieinternals/archive/2010/05/13/xdomainrequest-restrictions-limitations-and-workarounds.aspx
	  var xscheme = opts.xscheme;
	
	  // XDomainRequest has a flow of not sending cookie, therefore it should be disabled as a default.
	  // https://github.com/Automattic/engine.io-client/pull/217
	  var enablesXDR = opts.enablesXDR;
	
	  // XMLHttpRequest can be disabled on IE
	  try {
	    if ('undefined' != typeof XMLHttpRequest && (!xdomain || hasCORS)) {
	      return new XMLHttpRequest();
	    }
	  } catch (e) { }
	
	  // Use XDomainRequest for IE8 if enablesXDR is true
	  // because loading bar keeps flashing when using jsonp-polling
	  // https://github.com/yujiosaka/socke.io-ie8-loading-example
	  try {
	    if ('undefined' != typeof XDomainRequest && !xscheme && enablesXDR) {
	      return new XDomainRequest();
	    }
	  } catch (e) { }
	
	  if (!xdomain) {
	    try {
	      return new ActiveXObject('Microsoft.XMLHTTP');
	    } catch(e) { }
	  }
	}


/***/ },
/* 27 */
/***/ function(module, exports, __webpack_require__) {

	
	/**
	 * Module dependencies.
	 */
	
	var global = __webpack_require__(28);
	
	/**
	 * Module exports.
	 *
	 * Logic borrowed from Modernizr:
	 *
	 *   - https://github.com/Modernizr/Modernizr/blob/master/feature-detects/cors.js
	 */
	
	try {
	  module.exports = 'XMLHttpRequest' in global &&
	    'withCredentials' in new global.XMLHttpRequest();
	} catch (err) {
	  // if XMLHttp support is disabled in IE then it will throw
	  // when trying to create
	  module.exports = false;
	}


/***/ },
/* 28 */
/***/ function(module, exports) {

	
	/**
	 * Returns `this`. Execute this without a "context" (i.e. without it being
	 * attached to an object of the left-hand side), and `this` points to the
	 * "global" scope of the current JS execution.
	 */
	
	module.exports = (function () { return this; })();


/***/ },
/* 29 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(global) {/**
	 * Module requirements.
	 */
	
	var XMLHttpRequest = __webpack_require__(26);
	var Polling = __webpack_require__(30);
	var Emitter = __webpack_require__(18);
	var inherit = __webpack_require__(41);
	var debug = __webpack_require__(42)('engine.io-client:polling-xhr');
	
	/**
	 * Module exports.
	 */
	
	module.exports = XHR;
	module.exports.Request = Request;
	
	/**
	 * Empty function
	 */
	
	function empty(){}
	
	/**
	 * XHR Polling constructor.
	 *
	 * @param {Object} opts
	 * @api public
	 */
	
	function XHR(opts){
	  Polling.call(this, opts);
	
	  if (global.location) {
	    var isSSL = 'https:' == location.protocol;
	    var port = location.port;
	
	    // some user agents have empty `location.port`
	    if (!port) {
	      port = isSSL ? 443 : 80;
	    }
	
	    this.xd = opts.hostname != global.location.hostname ||
	      port != opts.port;
	    this.xs = opts.secure != isSSL;
	  }
	}
	
	/**
	 * Inherits from Polling.
	 */
	
	inherit(XHR, Polling);
	
	/**
	 * XHR supports binary
	 */
	
	XHR.prototype.supportsBinary = true;
	
	/**
	 * Creates a request.
	 *
	 * @param {String} method
	 * @api private
	 */
	
	XHR.prototype.request = function(opts){
	  opts = opts || {};
	  opts.uri = this.uri();
	  opts.xd = this.xd;
	  opts.xs = this.xs;
	  opts.agent = this.agent || false;
	  opts.supportsBinary = this.supportsBinary;
	  opts.enablesXDR = this.enablesXDR;
	
	  // SSL options for Node.js client
	  opts.pfx = this.pfx;
	  opts.key = this.key;
	  opts.passphrase = this.passphrase;
	  opts.cert = this.cert;
	  opts.ca = this.ca;
	  opts.ciphers = this.ciphers;
	  opts.rejectUnauthorized = this.rejectUnauthorized;
	
	  return new Request(opts);
	};
	
	/**
	 * Sends data.
	 *
	 * @param {String} data to send.
	 * @param {Function} called upon flush.
	 * @api private
	 */
	
	XHR.prototype.doWrite = function(data, fn){
	  var isBinary = typeof data !== 'string' && data !== undefined;
	  var req = this.request({ method: 'POST', data: data, isBinary: isBinary });
	  var self = this;
	  req.on('success', fn);
	  req.on('error', function(err){
	    self.onError('xhr post error', err);
	  });
	  this.sendXhr = req;
	};
	
	/**
	 * Starts a poll cycle.
	 *
	 * @api private
	 */
	
	XHR.prototype.doPoll = function(){
	  debug('xhr poll');
	  var req = this.request();
	  var self = this;
	  req.on('data', function(data){
	    self.onData(data);
	  });
	  req.on('error', function(err){
	    self.onError('xhr poll error', err);
	  });
	  this.pollXhr = req;
	};
	
	/**
	 * Request constructor
	 *
	 * @param {Object} options
	 * @api public
	 */
	
	function Request(opts){
	  this.method = opts.method || 'GET';
	  this.uri = opts.uri;
	  this.xd = !!opts.xd;
	  this.xs = !!opts.xs;
	  this.async = false !== opts.async;
	  this.data = undefined != opts.data ? opts.data : null;
	  this.agent = opts.agent;
	  this.isBinary = opts.isBinary;
	  this.supportsBinary = opts.supportsBinary;
	  this.enablesXDR = opts.enablesXDR;
	
	  // SSL options for Node.js client
	  this.pfx = opts.pfx;
	  this.key = opts.key;
	  this.passphrase = opts.passphrase;
	  this.cert = opts.cert;
	  this.ca = opts.ca;
	  this.ciphers = opts.ciphers;
	  this.rejectUnauthorized = opts.rejectUnauthorized;
	
	  this.create();
	}
	
	/**
	 * Mix in `Emitter`.
	 */
	
	Emitter(Request.prototype);
	
	/**
	 * Creates the XHR object and sends the request.
	 *
	 * @api private
	 */
	
	Request.prototype.create = function(){
	  var opts = { agent: this.agent, xdomain: this.xd, xscheme: this.xs, enablesXDR: this.enablesXDR };
	
	  // SSL options for Node.js client
	  opts.pfx = this.pfx;
	  opts.key = this.key;
	  opts.passphrase = this.passphrase;
	  opts.cert = this.cert;
	  opts.ca = this.ca;
	  opts.ciphers = this.ciphers;
	  opts.rejectUnauthorized = this.rejectUnauthorized;
	
	  var xhr = this.xhr = new XMLHttpRequest(opts);
	  var self = this;
	
	  try {
	    debug('xhr open %s: %s', this.method, this.uri);
	    xhr.open(this.method, this.uri, this.async);
	    if (this.supportsBinary) {
	      // This has to be done after open because Firefox is stupid
	      // http://stackoverflow.com/questions/13216903/get-binary-data-with-xmlhttprequest-in-a-firefox-extension
	      xhr.responseType = 'arraybuffer';
	    }
	
	    if ('POST' == this.method) {
	      try {
	        if (this.isBinary) {
	          xhr.setRequestHeader('Content-type', 'application/octet-stream');
	        } else {
	          xhr.setRequestHeader('Content-type', 'text/plain;charset=UTF-8');
	        }
	      } catch (e) {}
	    }
	
	    // ie6 check
	    if ('withCredentials' in xhr) {
	      xhr.withCredentials = true;
	    }
	
	    if (this.hasXDR()) {
	      xhr.onload = function(){
	        self.onLoad();
	      };
	      xhr.onerror = function(){
	        self.onError(xhr.responseText);
	      };
	    } else {
	      xhr.onreadystatechange = function(){
	        if (4 != xhr.readyState) return;
	        if (200 == xhr.status || 1223 == xhr.status) {
	          self.onLoad();
	        } else {
	          // make sure the `error` event handler that's user-set
	          // does not throw in the same tick and gets caught here
	          setTimeout(function(){
	            self.onError(xhr.status);
	          }, 0);
	        }
	      };
	    }
	
	    debug('xhr data %s', this.data);
	    xhr.send(this.data);
	  } catch (e) {
	    // Need to defer since .create() is called directly fhrom the constructor
	    // and thus the 'error' event can only be only bound *after* this exception
	    // occurs.  Therefore, also, we cannot throw here at all.
	    setTimeout(function() {
	      self.onError(e);
	    }, 0);
	    return;
	  }
	
	  if (global.document) {
	    this.index = Request.requestsCount++;
	    Request.requests[this.index] = this;
	  }
	};
	
	/**
	 * Called upon successful response.
	 *
	 * @api private
	 */
	
	Request.prototype.onSuccess = function(){
	  this.emit('success');
	  this.cleanup();
	};
	
	/**
	 * Called if we have data.
	 *
	 * @api private
	 */
	
	Request.prototype.onData = function(data){
	  this.emit('data', data);
	  this.onSuccess();
	};
	
	/**
	 * Called upon error.
	 *
	 * @api private
	 */
	
	Request.prototype.onError = function(err){
	  this.emit('error', err);
	  this.cleanup(true);
	};
	
	/**
	 * Cleans up house.
	 *
	 * @api private
	 */
	
	Request.prototype.cleanup = function(fromError){
	  if ('undefined' == typeof this.xhr || null === this.xhr) {
	    return;
	  }
	  // xmlhttprequest
	  if (this.hasXDR()) {
	    this.xhr.onload = this.xhr.onerror = empty;
	  } else {
	    this.xhr.onreadystatechange = empty;
	  }
	
	  if (fromError) {
	    try {
	      this.xhr.abort();
	    } catch(e) {}
	  }
	
	  if (global.document) {
	    delete Request.requests[this.index];
	  }
	
	  this.xhr = null;
	};
	
	/**
	 * Called upon load.
	 *
	 * @api private
	 */
	
	Request.prototype.onLoad = function(){
	  var data;
	  try {
	    var contentType;
	    try {
	      contentType = this.xhr.getResponseHeader('Content-Type').split(';')[0];
	    } catch (e) {}
	    if (contentType === 'application/octet-stream') {
	      data = this.xhr.response;
	    } else {
	      if (!this.supportsBinary) {
	        data = this.xhr.responseText;
	      } else {
	        data = 'ok';
	      }
	    }
	  } catch (e) {
	    this.onError(e);
	  }
	  if (null != data) {
	    this.onData(data);
	  }
	};
	
	/**
	 * Check if it has XDomainRequest.
	 *
	 * @api private
	 */
	
	Request.prototype.hasXDR = function(){
	  return 'undefined' !== typeof global.XDomainRequest && !this.xs && this.enablesXDR;
	};
	
	/**
	 * Aborts the request.
	 *
	 * @api public
	 */
	
	Request.prototype.abort = function(){
	  this.cleanup();
	};
	
	/**
	 * Aborts pending requests when unloading the window. This is needed to prevent
	 * memory leaks (e.g. when using IE) and to ensure that no spurious error is
	 * emitted.
	 */
	
	if (global.document) {
	  Request.requestsCount = 0;
	  Request.requests = {};
	  if (global.attachEvent) {
	    global.attachEvent('onunload', unloadHandler);
	  } else if (global.addEventListener) {
	    global.addEventListener('beforeunload', unloadHandler, false);
	  }
	}
	
	function unloadHandler() {
	  for (var i in Request.requests) {
	    if (Request.requests.hasOwnProperty(i)) {
	      Request.requests[i].abort();
	    }
	  }
	}
	
	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ },
/* 30 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Module dependencies.
	 */
	
	var Transport = __webpack_require__(31);
	var parseqs = __webpack_require__(40);
	var parser = __webpack_require__(32);
	var inherit = __webpack_require__(41);
	var debug = __webpack_require__(42)('engine.io-client:polling');
	
	/**
	 * Module exports.
	 */
	
	module.exports = Polling;
	
	/**
	 * Is XHR2 supported?
	 */
	
	var hasXHR2 = (function() {
	  var XMLHttpRequest = __webpack_require__(26);
	  var xhr = new XMLHttpRequest({ xdomain: false });
	  return null != xhr.responseType;
	})();
	
	/**
	 * Polling interface.
	 *
	 * @param {Object} opts
	 * @api private
	 */
	
	function Polling(opts){
	  var forceBase64 = (opts && opts.forceBase64);
	  if (!hasXHR2 || forceBase64) {
	    this.supportsBinary = false;
	  }
	  Transport.call(this, opts);
	}
	
	/**
	 * Inherits from Transport.
	 */
	
	inherit(Polling, Transport);
	
	/**
	 * Transport name.
	 */
	
	Polling.prototype.name = 'polling';
	
	/**
	 * Opens the socket (triggers polling). We write a PING message to determine
	 * when the transport is open.
	 *
	 * @api private
	 */
	
	Polling.prototype.doOpen = function(){
	  this.poll();
	};
	
	/**
	 * Pauses polling.
	 *
	 * @param {Function} callback upon buffers are flushed and transport is paused
	 * @api private
	 */
	
	Polling.prototype.pause = function(onPause){
	  var pending = 0;
	  var self = this;
	
	  this.readyState = 'pausing';
	
	  function pause(){
	    debug('paused');
	    self.readyState = 'paused';
	    onPause();
	  }
	
	  if (this.polling || !this.writable) {
	    var total = 0;
	
	    if (this.polling) {
	      debug('we are currently polling - waiting to pause');
	      total++;
	      this.once('pollComplete', function(){
	        debug('pre-pause polling complete');
	        --total || pause();
	      });
	    }
	
	    if (!this.writable) {
	      debug('we are currently writing - waiting to pause');
	      total++;
	      this.once('drain', function(){
	        debug('pre-pause writing complete');
	        --total || pause();
	      });
	    }
	  } else {
	    pause();
	  }
	};
	
	/**
	 * Starts polling cycle.
	 *
	 * @api public
	 */
	
	Polling.prototype.poll = function(){
	  debug('polling');
	  this.polling = true;
	  this.doPoll();
	  this.emit('poll');
	};
	
	/**
	 * Overloads onData to detect payloads.
	 *
	 * @api private
	 */
	
	Polling.prototype.onData = function(data){
	  var self = this;
	  debug('polling got data %s', data);
	  var callback = function(packet, index, total) {
	    // if its the first message we consider the transport open
	    if ('opening' == self.readyState) {
	      self.onOpen();
	    }
	
	    // if its a close packet, we close the ongoing requests
	    if ('close' == packet.type) {
	      self.onClose();
	      return false;
	    }
	
	    // otherwise bypass onData and handle the message
	    self.onPacket(packet);
	  };
	
	  // decode payload
	  parser.decodePayload(data, this.socket.binaryType, callback);
	
	  // if an event did not trigger closing
	  if ('closed' != this.readyState) {
	    // if we got data we're not polling
	    this.polling = false;
	    this.emit('pollComplete');
	
	    if ('open' == this.readyState) {
	      this.poll();
	    } else {
	      debug('ignoring poll - transport state "%s"', this.readyState);
	    }
	  }
	};
	
	/**
	 * For polling, send a close packet.
	 *
	 * @api private
	 */
	
	Polling.prototype.doClose = function(){
	  var self = this;
	
	  function close(){
	    debug('writing close packet');
	    self.write([{ type: 'close' }]);
	  }
	
	  if ('open' == this.readyState) {
	    debug('transport open - closing');
	    close();
	  } else {
	    // in case we're trying to close while
	    // handshaking is in progress (GH-164)
	    debug('transport not open - deferring close');
	    this.once('open', close);
	  }
	};
	
	/**
	 * Writes a packets payload.
	 *
	 * @param {Array} data packets
	 * @param {Function} drain callback
	 * @api private
	 */
	
	Polling.prototype.write = function(packets){
	  var self = this;
	  this.writable = false;
	  var callbackfn = function() {
	    self.writable = true;
	    self.emit('drain');
	  };
	
	  var self = this;
	  parser.encodePayload(packets, this.supportsBinary, function(data) {
	    self.doWrite(data, callbackfn);
	  });
	};
	
	/**
	 * Generates uri for connection.
	 *
	 * @api private
	 */
	
	Polling.prototype.uri = function(){
	  var query = this.query || {};
	  var schema = this.secure ? 'https' : 'http';
	  var port = '';
	
	  // cache busting is forced
	  if (false !== this.timestampRequests) {
	    query[this.timestampParam] = +new Date + '-' + Transport.timestamps++;
	  }
	
	  if (!this.supportsBinary && !query.sid) {
	    query.b64 = 1;
	  }
	
	  query = parseqs.encode(query);
	
	  // avoid port if default for schema
	  if (this.port && (('https' == schema && this.port != 443) ||
	     ('http' == schema && this.port != 80))) {
	    port = ':' + this.port;
	  }
	
	  // prepend ? to query
	  if (query.length) {
	    query = '?' + query;
	  }
	
	  return schema + '://' + this.hostname + port + this.path + query;
	};


/***/ },
/* 31 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Module dependencies.
	 */
	
	var parser = __webpack_require__(32);
	var Emitter = __webpack_require__(18);
	
	/**
	 * Module exports.
	 */
	
	module.exports = Transport;
	
	/**
	 * Transport abstract constructor.
	 *
	 * @param {Object} options.
	 * @api private
	 */
	
	function Transport (opts) {
	  this.path = opts.path;
	  this.hostname = opts.hostname;
	  this.port = opts.port;
	  this.secure = opts.secure;
	  this.query = opts.query;
	  this.timestampParam = opts.timestampParam;
	  this.timestampRequests = opts.timestampRequests;
	  this.readyState = '';
	  this.agent = opts.agent || false;
	  this.socket = opts.socket;
	  this.enablesXDR = opts.enablesXDR;
	
	  // SSL options for Node.js client
	  this.pfx = opts.pfx;
	  this.key = opts.key;
	  this.passphrase = opts.passphrase;
	  this.cert = opts.cert;
	  this.ca = opts.ca;
	  this.ciphers = opts.ciphers;
	  this.rejectUnauthorized = opts.rejectUnauthorized;
	}
	
	/**
	 * Mix in `Emitter`.
	 */
	
	Emitter(Transport.prototype);
	
	/**
	 * A counter used to prevent collisions in the timestamps used
	 * for cache busting.
	 */
	
	Transport.timestamps = 0;
	
	/**
	 * Emits an error.
	 *
	 * @param {String} str
	 * @return {Transport} for chaining
	 * @api public
	 */
	
	Transport.prototype.onError = function (msg, desc) {
	  var err = new Error(msg);
	  err.type = 'TransportError';
	  err.description = desc;
	  this.emit('error', err);
	  return this;
	};
	
	/**
	 * Opens the transport.
	 *
	 * @api public
	 */
	
	Transport.prototype.open = function () {
	  if ('closed' == this.readyState || '' == this.readyState) {
	    this.readyState = 'opening';
	    this.doOpen();
	  }
	
	  return this;
	};
	
	/**
	 * Closes the transport.
	 *
	 * @api private
	 */
	
	Transport.prototype.close = function () {
	  if ('opening' == this.readyState || 'open' == this.readyState) {
	    this.doClose();
	    this.onClose();
	  }
	
	  return this;
	};
	
	/**
	 * Sends multiple packets.
	 *
	 * @param {Array} packets
	 * @api private
	 */
	
	Transport.prototype.send = function(packets){
	  if ('open' == this.readyState) {
	    this.write(packets);
	  } else {
	    throw new Error('Transport not open');
	  }
	};
	
	/**
	 * Called upon open
	 *
	 * @api private
	 */
	
	Transport.prototype.onOpen = function () {
	  this.readyState = 'open';
	  this.writable = true;
	  this.emit('open');
	};
	
	/**
	 * Called with data.
	 *
	 * @param {String} data
	 * @api private
	 */
	
	Transport.prototype.onData = function(data){
	  var packet = parser.decodePacket(data, this.socket.binaryType);
	  this.onPacket(packet);
	};
	
	/**
	 * Called with a decoded packet.
	 */
	
	Transport.prototype.onPacket = function (packet) {
	  this.emit('packet', packet);
	};
	
	/**
	 * Called upon close.
	 *
	 * @api private
	 */
	
	Transport.prototype.onClose = function () {
	  this.readyState = 'closed';
	  this.emit('close');
	};


/***/ },
/* 32 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(global) {/**
	 * Module dependencies.
	 */
	
	var keys = __webpack_require__(33);
	var hasBinary = __webpack_require__(34);
	var sliceBuffer = __webpack_require__(35);
	var base64encoder = __webpack_require__(36);
	var after = __webpack_require__(37);
	var utf8 = __webpack_require__(38);
	
	/**
	 * Check if we are running an android browser. That requires us to use
	 * ArrayBuffer with polling transports...
	 *
	 * http://ghinda.net/jpeg-blob-ajax-android/
	 */
	
	var isAndroid = navigator.userAgent.match(/Android/i);
	
	/**
	 * Check if we are running in PhantomJS.
	 * Uploading a Blob with PhantomJS does not work correctly, as reported here:
	 * https://github.com/ariya/phantomjs/issues/11395
	 * @type boolean
	 */
	var isPhantomJS = /PhantomJS/i.test(navigator.userAgent);
	
	/**
	 * When true, avoids using Blobs to encode payloads.
	 * @type boolean
	 */
	var dontSendBlobs = isAndroid || isPhantomJS;
	
	/**
	 * Current protocol version.
	 */
	
	exports.protocol = 3;
	
	/**
	 * Packet types.
	 */
	
	var packets = exports.packets = {
	    open:     0    // non-ws
	  , close:    1    // non-ws
	  , ping:     2
	  , pong:     3
	  , message:  4
	  , upgrade:  5
	  , noop:     6
	};
	
	var packetslist = keys(packets);
	
	/**
	 * Premade error packet.
	 */
	
	var err = { type: 'error', data: 'parser error' };
	
	/**
	 * Create a blob api even for blob builder when vendor prefixes exist
	 */
	
	var Blob = __webpack_require__(39);
	
	/**
	 * Encodes a packet.
	 *
	 *     <packet type id> [ <data> ]
	 *
	 * Example:
	 *
	 *     5hello world
	 *     3
	 *     4
	 *
	 * Binary is encoded in an identical principle
	 *
	 * @api private
	 */
	
	exports.encodePacket = function (packet, supportsBinary, utf8encode, callback) {
	  if ('function' == typeof supportsBinary) {
	    callback = supportsBinary;
	    supportsBinary = false;
	  }
	
	  if ('function' == typeof utf8encode) {
	    callback = utf8encode;
	    utf8encode = null;
	  }
	
	  var data = (packet.data === undefined)
	    ? undefined
	    : packet.data.buffer || packet.data;
	
	  if (global.ArrayBuffer && data instanceof ArrayBuffer) {
	    return encodeArrayBuffer(packet, supportsBinary, callback);
	  } else if (Blob && data instanceof global.Blob) {
	    return encodeBlob(packet, supportsBinary, callback);
	  }
	
	  // might be an object with { base64: true, data: dataAsBase64String }
	  if (data && data.base64) {
	    return encodeBase64Object(packet, callback);
	  }
	
	  // Sending data as a utf-8 string
	  var encoded = packets[packet.type];
	
	  // data fragment is optional
	  if (undefined !== packet.data) {
	    encoded += utf8encode ? utf8.encode(String(packet.data)) : String(packet.data);
	  }
	
	  return callback('' + encoded);
	
	};
	
	function encodeBase64Object(packet, callback) {
	  // packet data is an object { base64: true, data: dataAsBase64String }
	  var message = 'b' + exports.packets[packet.type] + packet.data.data;
	  return callback(message);
	}
	
	/**
	 * Encode packet helpers for binary types
	 */
	
	function encodeArrayBuffer(packet, supportsBinary, callback) {
	  if (!supportsBinary) {
	    return exports.encodeBase64Packet(packet, callback);
	  }
	
	  var data = packet.data;
	  var contentArray = new Uint8Array(data);
	  var resultBuffer = new Uint8Array(1 + data.byteLength);
	
	  resultBuffer[0] = packets[packet.type];
	  for (var i = 0; i < contentArray.length; i++) {
	    resultBuffer[i+1] = contentArray[i];
	  }
	
	  return callback(resultBuffer.buffer);
	}
	
	function encodeBlobAsArrayBuffer(packet, supportsBinary, callback) {
	  if (!supportsBinary) {
	    return exports.encodeBase64Packet(packet, callback);
	  }
	
	  var fr = new FileReader();
	  fr.onload = function() {
	    packet.data = fr.result;
	    exports.encodePacket(packet, supportsBinary, true, callback);
	  };
	  return fr.readAsArrayBuffer(packet.data);
	}
	
	function encodeBlob(packet, supportsBinary, callback) {
	  if (!supportsBinary) {
	    return exports.encodeBase64Packet(packet, callback);
	  }
	
	  if (dontSendBlobs) {
	    return encodeBlobAsArrayBuffer(packet, supportsBinary, callback);
	  }
	
	  var length = new Uint8Array(1);
	  length[0] = packets[packet.type];
	  var blob = new Blob([length.buffer, packet.data]);
	
	  return callback(blob);
	}
	
	/**
	 * Encodes a packet with binary data in a base64 string
	 *
	 * @param {Object} packet, has `type` and `data`
	 * @return {String} base64 encoded message
	 */
	
	exports.encodeBase64Packet = function(packet, callback) {
	  var message = 'b' + exports.packets[packet.type];
	  if (Blob && packet.data instanceof Blob) {
	    var fr = new FileReader();
	    fr.onload = function() {
	      var b64 = fr.result.split(',')[1];
	      callback(message + b64);
	    };
	    return fr.readAsDataURL(packet.data);
	  }
	
	  var b64data;
	  try {
	    b64data = String.fromCharCode.apply(null, new Uint8Array(packet.data));
	  } catch (e) {
	    // iPhone Safari doesn't let you apply with typed arrays
	    var typed = new Uint8Array(packet.data);
	    var basic = new Array(typed.length);
	    for (var i = 0; i < typed.length; i++) {
	      basic[i] = typed[i];
	    }
	    b64data = String.fromCharCode.apply(null, basic);
	  }
	  message += global.btoa(b64data);
	  return callback(message);
	};
	
	/**
	 * Decodes a packet. Changes format to Blob if requested.
	 *
	 * @return {Object} with `type` and `data` (if any)
	 * @api private
	 */
	
	exports.decodePacket = function (data, binaryType, utf8decode) {
	  // String data
	  if (typeof data == 'string' || data === undefined) {
	    if (data.charAt(0) == 'b') {
	      return exports.decodeBase64Packet(data.substr(1), binaryType);
	    }
	
	    if (utf8decode) {
	      try {
	        data = utf8.decode(data);
	      } catch (e) {
	        return err;
	      }
	    }
	    var type = data.charAt(0);
	
	    if (Number(type) != type || !packetslist[type]) {
	      return err;
	    }
	
	    if (data.length > 1) {
	      return { type: packetslist[type], data: data.substring(1) };
	    } else {
	      return { type: packetslist[type] };
	    }
	  }
	
	  var asArray = new Uint8Array(data);
	  var type = asArray[0];
	  var rest = sliceBuffer(data, 1);
	  if (Blob && binaryType === 'blob') {
	    rest = new Blob([rest]);
	  }
	  return { type: packetslist[type], data: rest };
	};
	
	/**
	 * Decodes a packet encoded in a base64 string
	 *
	 * @param {String} base64 encoded message
	 * @return {Object} with `type` and `data` (if any)
	 */
	
	exports.decodeBase64Packet = function(msg, binaryType) {
	  var type = packetslist[msg.charAt(0)];
	  if (!global.ArrayBuffer) {
	    return { type: type, data: { base64: true, data: msg.substr(1) } };
	  }
	
	  var data = base64encoder.decode(msg.substr(1));
	
	  if (binaryType === 'blob' && Blob) {
	    data = new Blob([data]);
	  }
	
	  return { type: type, data: data };
	};
	
	/**
	 * Encodes multiple messages (payload).
	 *
	 *     <length>:data
	 *
	 * Example:
	 *
	 *     11:hello world2:hi
	 *
	 * If any contents are binary, they will be encoded as base64 strings. Base64
	 * encoded strings are marked with a b before the length specifier
	 *
	 * @param {Array} packets
	 * @api private
	 */
	
	exports.encodePayload = function (packets, supportsBinary, callback) {
	  if (typeof supportsBinary == 'function') {
	    callback = supportsBinary;
	    supportsBinary = null;
	  }
	
	  var isBinary = hasBinary(packets);
	
	  if (supportsBinary && isBinary) {
	    if (Blob && !dontSendBlobs) {
	      return exports.encodePayloadAsBlob(packets, callback);
	    }
	
	    return exports.encodePayloadAsArrayBuffer(packets, callback);
	  }
	
	  if (!packets.length) {
	    return callback('0:');
	  }
	
	  function setLengthHeader(message) {
	    return message.length + ':' + message;
	  }
	
	  function encodeOne(packet, doneCallback) {
	    exports.encodePacket(packet, !isBinary ? false : supportsBinary, true, function(message) {
	      doneCallback(null, setLengthHeader(message));
	    });
	  }
	
	  map(packets, encodeOne, function(err, results) {
	    return callback(results.join(''));
	  });
	};
	
	/**
	 * Async array map using after
	 */
	
	function map(ary, each, done) {
	  var result = new Array(ary.length);
	  var next = after(ary.length, done);
	
	  var eachWithIndex = function(i, el, cb) {
	    each(el, function(error, msg) {
	      result[i] = msg;
	      cb(error, result);
	    });
	  };
	
	  for (var i = 0; i < ary.length; i++) {
	    eachWithIndex(i, ary[i], next);
	  }
	}
	
	/*
	 * Decodes data when a payload is maybe expected. Possible binary contents are
	 * decoded from their base64 representation
	 *
	 * @param {String} data, callback method
	 * @api public
	 */
	
	exports.decodePayload = function (data, binaryType, callback) {
	  if (typeof data != 'string') {
	    return exports.decodePayloadAsBinary(data, binaryType, callback);
	  }
	
	  if (typeof binaryType === 'function') {
	    callback = binaryType;
	    binaryType = null;
	  }
	
	  var packet;
	  if (data == '') {
	    // parser error - ignoring payload
	    return callback(err, 0, 1);
	  }
	
	  var length = ''
	    , n, msg;
	
	  for (var i = 0, l = data.length; i < l; i++) {
	    var chr = data.charAt(i);
	
	    if (':' != chr) {
	      length += chr;
	    } else {
	      if ('' == length || (length != (n = Number(length)))) {
	        // parser error - ignoring payload
	        return callback(err, 0, 1);
	      }
	
	      msg = data.substr(i + 1, n);
	
	      if (length != msg.length) {
	        // parser error - ignoring payload
	        return callback(err, 0, 1);
	      }
	
	      if (msg.length) {
	        packet = exports.decodePacket(msg, binaryType, true);
	
	        if (err.type == packet.type && err.data == packet.data) {
	          // parser error in individual packet - ignoring payload
	          return callback(err, 0, 1);
	        }
	
	        var ret = callback(packet, i + n, l);
	        if (false === ret) return;
	      }
	
	      // advance cursor
	      i += n;
	      length = '';
	    }
	  }
	
	  if (length != '') {
	    // parser error - ignoring payload
	    return callback(err, 0, 1);
	  }
	
	};
	
	/**
	 * Encodes multiple messages (payload) as binary.
	 *
	 * <1 = binary, 0 = string><number from 0-9><number from 0-9>[...]<number
	 * 255><data>
	 *
	 * Example:
	 * 1 3 255 1 2 3, if the binary contents are interpreted as 8 bit integers
	 *
	 * @param {Array} packets
	 * @return {ArrayBuffer} encoded payload
	 * @api private
	 */
	
	exports.encodePayloadAsArrayBuffer = function(packets, callback) {
	  if (!packets.length) {
	    return callback(new ArrayBuffer(0));
	  }
	
	  function encodeOne(packet, doneCallback) {
	    exports.encodePacket(packet, true, true, function(data) {
	      return doneCallback(null, data);
	    });
	  }
	
	  map(packets, encodeOne, function(err, encodedPackets) {
	    var totalLength = encodedPackets.reduce(function(acc, p) {
	      var len;
	      if (typeof p === 'string'){
	        len = p.length;
	      } else {
	        len = p.byteLength;
	      }
	      return acc + len.toString().length + len + 2; // string/binary identifier + separator = 2
	    }, 0);
	
	    var resultArray = new Uint8Array(totalLength);
	
	    var bufferIndex = 0;
	    encodedPackets.forEach(function(p) {
	      var isString = typeof p === 'string';
	      var ab = p;
	      if (isString) {
	        var view = new Uint8Array(p.length);
	        for (var i = 0; i < p.length; i++) {
	          view[i] = p.charCodeAt(i);
	        }
	        ab = view.buffer;
	      }
	
	      if (isString) { // not true binary
	        resultArray[bufferIndex++] = 0;
	      } else { // true binary
	        resultArray[bufferIndex++] = 1;
	      }
	
	      var lenStr = ab.byteLength.toString();
	      for (var i = 0; i < lenStr.length; i++) {
	        resultArray[bufferIndex++] = parseInt(lenStr[i]);
	      }
	      resultArray[bufferIndex++] = 255;
	
	      var view = new Uint8Array(ab);
	      for (var i = 0; i < view.length; i++) {
	        resultArray[bufferIndex++] = view[i];
	      }
	    });
	
	    return callback(resultArray.buffer);
	  });
	};
	
	/**
	 * Encode as Blob
	 */
	
	exports.encodePayloadAsBlob = function(packets, callback) {
	  function encodeOne(packet, doneCallback) {
	    exports.encodePacket(packet, true, true, function(encoded) {
	      var binaryIdentifier = new Uint8Array(1);
	      binaryIdentifier[0] = 1;
	      if (typeof encoded === 'string') {
	        var view = new Uint8Array(encoded.length);
	        for (var i = 0; i < encoded.length; i++) {
	          view[i] = encoded.charCodeAt(i);
	        }
	        encoded = view.buffer;
	        binaryIdentifier[0] = 0;
	      }
	
	      var len = (encoded instanceof ArrayBuffer)
	        ? encoded.byteLength
	        : encoded.size;
	
	      var lenStr = len.toString();
	      var lengthAry = new Uint8Array(lenStr.length + 1);
	      for (var i = 0; i < lenStr.length; i++) {
	        lengthAry[i] = parseInt(lenStr[i]);
	      }
	      lengthAry[lenStr.length] = 255;
	
	      if (Blob) {
	        var blob = new Blob([binaryIdentifier.buffer, lengthAry.buffer, encoded]);
	        doneCallback(null, blob);
	      }
	    });
	  }
	
	  map(packets, encodeOne, function(err, results) {
	    return callback(new Blob(results));
	  });
	};
	
	/*
	 * Decodes data when a payload is maybe expected. Strings are decoded by
	 * interpreting each byte as a key code for entries marked to start with 0. See
	 * description of encodePayloadAsBinary
	 *
	 * @param {ArrayBuffer} data, callback method
	 * @api public
	 */
	
	exports.decodePayloadAsBinary = function (data, binaryType, callback) {
	  if (typeof binaryType === 'function') {
	    callback = binaryType;
	    binaryType = null;
	  }
	
	  var bufferTail = data;
	  var buffers = [];
	
	  var numberTooLong = false;
	  while (bufferTail.byteLength > 0) {
	    var tailArray = new Uint8Array(bufferTail);
	    var isString = tailArray[0] === 0;
	    var msgLength = '';
	
	    for (var i = 1; ; i++) {
	      if (tailArray[i] == 255) break;
	
	      if (msgLength.length > 310) {
	        numberTooLong = true;
	        break;
	      }
	
	      msgLength += tailArray[i];
	    }
	
	    if(numberTooLong) return callback(err, 0, 1);
	
	    bufferTail = sliceBuffer(bufferTail, 2 + msgLength.length);
	    msgLength = parseInt(msgLength);
	
	    var msg = sliceBuffer(bufferTail, 0, msgLength);
	    if (isString) {
	      try {
	        msg = String.fromCharCode.apply(null, new Uint8Array(msg));
	      } catch (e) {
	        // iPhone Safari doesn't let you apply to typed arrays
	        var typed = new Uint8Array(msg);
	        msg = '';
	        for (var i = 0; i < typed.length; i++) {
	          msg += String.fromCharCode(typed[i]);
	        }
	      }
	    }
	
	    buffers.push(msg);
	    bufferTail = sliceBuffer(bufferTail, msgLength);
	  }
	
	  var total = buffers.length;
	  buffers.forEach(function(buffer, i) {
	    callback(exports.decodePacket(buffer, binaryType, true), i, total);
	  });
	};
	
	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ },
/* 33 */
/***/ function(module, exports) {

	
	/**
	 * Gets the keys for an object.
	 *
	 * @return {Array} keys
	 * @api private
	 */
	
	module.exports = Object.keys || function keys (obj){
	  var arr = [];
	  var has = Object.prototype.hasOwnProperty;
	
	  for (var i in obj) {
	    if (has.call(obj, i)) {
	      arr.push(i);
	    }
	  }
	  return arr;
	};


/***/ },
/* 34 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(global) {
	/*
	 * Module requirements.
	 */
	
	var isArray = __webpack_require__(17);
	
	/**
	 * Module exports.
	 */
	
	module.exports = hasBinary;
	
	/**
	 * Checks for binary data.
	 *
	 * Right now only Buffer and ArrayBuffer are supported..
	 *
	 * @param {Object} anything
	 * @api public
	 */
	
	function hasBinary(data) {
	
	  function _hasBinary(obj) {
	    if (!obj) return false;
	
	    if ( (global.Buffer && global.Buffer.isBuffer(obj)) ||
	         (global.ArrayBuffer && obj instanceof ArrayBuffer) ||
	         (global.Blob && obj instanceof Blob) ||
	         (global.File && obj instanceof File)
	        ) {
	      return true;
	    }
	
	    if (isArray(obj)) {
	      for (var i = 0; i < obj.length; i++) {
	          if (_hasBinary(obj[i])) {
	              return true;
	          }
	      }
	    } else if (obj && 'object' == typeof obj) {
	      if (obj.toJSON) {
	        obj = obj.toJSON();
	      }
	
	      for (var key in obj) {
	        if (Object.prototype.hasOwnProperty.call(obj, key) && _hasBinary(obj[key])) {
	          return true;
	        }
	      }
	    }
	
	    return false;
	  }
	
	  return _hasBinary(data);
	}
	
	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ },
/* 35 */
/***/ function(module, exports) {

	/**
	 * An abstraction for slicing an arraybuffer even when
	 * ArrayBuffer.prototype.slice is not supported
	 *
	 * @api public
	 */
	
	module.exports = function(arraybuffer, start, end) {
	  var bytes = arraybuffer.byteLength;
	  start = start || 0;
	  end = end || bytes;
	
	  if (arraybuffer.slice) { return arraybuffer.slice(start, end); }
	
	  if (start < 0) { start += bytes; }
	  if (end < 0) { end += bytes; }
	  if (end > bytes) { end = bytes; }
	
	  if (start >= bytes || start >= end || bytes === 0) {
	    return new ArrayBuffer(0);
	  }
	
	  var abv = new Uint8Array(arraybuffer);
	  var result = new Uint8Array(end - start);
	  for (var i = start, ii = 0; i < end; i++, ii++) {
	    result[ii] = abv[i];
	  }
	  return result.buffer;
	};


/***/ },
/* 36 */
/***/ function(module, exports) {

	/*
	 * base64-arraybuffer
	 * https://github.com/niklasvh/base64-arraybuffer
	 *
	 * Copyright (c) 2012 Niklas von Hertzen
	 * Licensed under the MIT license.
	 */
	(function(chars){
	  "use strict";
	
	  exports.encode = function(arraybuffer) {
	    var bytes = new Uint8Array(arraybuffer),
	    i, len = bytes.length, base64 = "";
	
	    for (i = 0; i < len; i+=3) {
	      base64 += chars[bytes[i] >> 2];
	      base64 += chars[((bytes[i] & 3) << 4) | (bytes[i + 1] >> 4)];
	      base64 += chars[((bytes[i + 1] & 15) << 2) | (bytes[i + 2] >> 6)];
	      base64 += chars[bytes[i + 2] & 63];
	    }
	
	    if ((len % 3) === 2) {
	      base64 = base64.substring(0, base64.length - 1) + "=";
	    } else if (len % 3 === 1) {
	      base64 = base64.substring(0, base64.length - 2) + "==";
	    }
	
	    return base64;
	  };
	
	  exports.decode =  function(base64) {
	    var bufferLength = base64.length * 0.75,
	    len = base64.length, i, p = 0,
	    encoded1, encoded2, encoded3, encoded4;
	
	    if (base64[base64.length - 1] === "=") {
	      bufferLength--;
	      if (base64[base64.length - 2] === "=") {
	        bufferLength--;
	      }
	    }
	
	    var arraybuffer = new ArrayBuffer(bufferLength),
	    bytes = new Uint8Array(arraybuffer);
	
	    for (i = 0; i < len; i+=4) {
	      encoded1 = chars.indexOf(base64[i]);
	      encoded2 = chars.indexOf(base64[i+1]);
	      encoded3 = chars.indexOf(base64[i+2]);
	      encoded4 = chars.indexOf(base64[i+3]);
	
	      bytes[p++] = (encoded1 << 2) | (encoded2 >> 4);
	      bytes[p++] = ((encoded2 & 15) << 4) | (encoded3 >> 2);
	      bytes[p++] = ((encoded3 & 3) << 6) | (encoded4 & 63);
	    }
	
	    return arraybuffer;
	  };
	})("ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/");


/***/ },
/* 37 */
/***/ function(module, exports) {

	module.exports = after
	
	function after(count, callback, err_cb) {
	    var bail = false
	    err_cb = err_cb || noop
	    proxy.count = count
	
	    return (count === 0) ? callback() : proxy
	
	    function proxy(err, result) {
	        if (proxy.count <= 0) {
	            throw new Error('after called too many times')
	        }
	        --proxy.count
	
	        // after first error, rest are passed to err_cb
	        if (err) {
	            bail = true
	            callback(err)
	            // future error callbacks will go to error handler
	            callback = err_cb
	        } else if (proxy.count === 0 && !bail) {
	            callback(null, result)
	        }
	    }
	}
	
	function noop() {}


/***/ },
/* 38 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;/* WEBPACK VAR INJECTION */(function(module, global) {/*! https://mths.be/utf8js v2.0.0 by @mathias */
	;(function(root) {
	
		// Detect free variables `exports`
		var freeExports = typeof exports == 'object' && exports;
	
		// Detect free variable `module`
		var freeModule = typeof module == 'object' && module &&
			module.exports == freeExports && module;
	
		// Detect free variable `global`, from Node.js or Browserified code,
		// and use it as `root`
		var freeGlobal = typeof global == 'object' && global;
		if (freeGlobal.global === freeGlobal || freeGlobal.window === freeGlobal) {
			root = freeGlobal;
		}
	
		/*--------------------------------------------------------------------------*/
	
		var stringFromCharCode = String.fromCharCode;
	
		// Taken from https://mths.be/punycode
		function ucs2decode(string) {
			var output = [];
			var counter = 0;
			var length = string.length;
			var value;
			var extra;
			while (counter < length) {
				value = string.charCodeAt(counter++);
				if (value >= 0xD800 && value <= 0xDBFF && counter < length) {
					// high surrogate, and there is a next character
					extra = string.charCodeAt(counter++);
					if ((extra & 0xFC00) == 0xDC00) { // low surrogate
						output.push(((value & 0x3FF) << 10) + (extra & 0x3FF) + 0x10000);
					} else {
						// unmatched surrogate; only append this code unit, in case the next
						// code unit is the high surrogate of a surrogate pair
						output.push(value);
						counter--;
					}
				} else {
					output.push(value);
				}
			}
			return output;
		}
	
		// Taken from https://mths.be/punycode
		function ucs2encode(array) {
			var length = array.length;
			var index = -1;
			var value;
			var output = '';
			while (++index < length) {
				value = array[index];
				if (value > 0xFFFF) {
					value -= 0x10000;
					output += stringFromCharCode(value >>> 10 & 0x3FF | 0xD800);
					value = 0xDC00 | value & 0x3FF;
				}
				output += stringFromCharCode(value);
			}
			return output;
		}
	
		function checkScalarValue(codePoint) {
			if (codePoint >= 0xD800 && codePoint <= 0xDFFF) {
				throw Error(
					'Lone surrogate U+' + codePoint.toString(16).toUpperCase() +
					' is not a scalar value'
				);
			}
		}
		/*--------------------------------------------------------------------------*/
	
		function createByte(codePoint, shift) {
			return stringFromCharCode(((codePoint >> shift) & 0x3F) | 0x80);
		}
	
		function encodeCodePoint(codePoint) {
			if ((codePoint & 0xFFFFFF80) == 0) { // 1-byte sequence
				return stringFromCharCode(codePoint);
			}
			var symbol = '';
			if ((codePoint & 0xFFFFF800) == 0) { // 2-byte sequence
				symbol = stringFromCharCode(((codePoint >> 6) & 0x1F) | 0xC0);
			}
			else if ((codePoint & 0xFFFF0000) == 0) { // 3-byte sequence
				checkScalarValue(codePoint);
				symbol = stringFromCharCode(((codePoint >> 12) & 0x0F) | 0xE0);
				symbol += createByte(codePoint, 6);
			}
			else if ((codePoint & 0xFFE00000) == 0) { // 4-byte sequence
				symbol = stringFromCharCode(((codePoint >> 18) & 0x07) | 0xF0);
				symbol += createByte(codePoint, 12);
				symbol += createByte(codePoint, 6);
			}
			symbol += stringFromCharCode((codePoint & 0x3F) | 0x80);
			return symbol;
		}
	
		function utf8encode(string) {
			var codePoints = ucs2decode(string);
			var length = codePoints.length;
			var index = -1;
			var codePoint;
			var byteString = '';
			while (++index < length) {
				codePoint = codePoints[index];
				byteString += encodeCodePoint(codePoint);
			}
			return byteString;
		}
	
		/*--------------------------------------------------------------------------*/
	
		function readContinuationByte() {
			if (byteIndex >= byteCount) {
				throw Error('Invalid byte index');
			}
	
			var continuationByte = byteArray[byteIndex] & 0xFF;
			byteIndex++;
	
			if ((continuationByte & 0xC0) == 0x80) {
				return continuationByte & 0x3F;
			}
	
			// If we end up here, it’s not a continuation byte
			throw Error('Invalid continuation byte');
		}
	
		function decodeSymbol() {
			var byte1;
			var byte2;
			var byte3;
			var byte4;
			var codePoint;
	
			if (byteIndex > byteCount) {
				throw Error('Invalid byte index');
			}
	
			if (byteIndex == byteCount) {
				return false;
			}
	
			// Read first byte
			byte1 = byteArray[byteIndex] & 0xFF;
			byteIndex++;
	
			// 1-byte sequence (no continuation bytes)
			if ((byte1 & 0x80) == 0) {
				return byte1;
			}
	
			// 2-byte sequence
			if ((byte1 & 0xE0) == 0xC0) {
				var byte2 = readContinuationByte();
				codePoint = ((byte1 & 0x1F) << 6) | byte2;
				if (codePoint >= 0x80) {
					return codePoint;
				} else {
					throw Error('Invalid continuation byte');
				}
			}
	
			// 3-byte sequence (may include unpaired surrogates)
			if ((byte1 & 0xF0) == 0xE0) {
				byte2 = readContinuationByte();
				byte3 = readContinuationByte();
				codePoint = ((byte1 & 0x0F) << 12) | (byte2 << 6) | byte3;
				if (codePoint >= 0x0800) {
					checkScalarValue(codePoint);
					return codePoint;
				} else {
					throw Error('Invalid continuation byte');
				}
			}
	
			// 4-byte sequence
			if ((byte1 & 0xF8) == 0xF0) {
				byte2 = readContinuationByte();
				byte3 = readContinuationByte();
				byte4 = readContinuationByte();
				codePoint = ((byte1 & 0x0F) << 0x12) | (byte2 << 0x0C) |
					(byte3 << 0x06) | byte4;
				if (codePoint >= 0x010000 && codePoint <= 0x10FFFF) {
					return codePoint;
				}
			}
	
			throw Error('Invalid UTF-8 detected');
		}
	
		var byteArray;
		var byteCount;
		var byteIndex;
		function utf8decode(byteString) {
			byteArray = ucs2decode(byteString);
			byteCount = byteArray.length;
			byteIndex = 0;
			var codePoints = [];
			var tmp;
			while ((tmp = decodeSymbol()) !== false) {
				codePoints.push(tmp);
			}
			return ucs2encode(codePoints);
		}
	
		/*--------------------------------------------------------------------------*/
	
		var utf8 = {
			'version': '2.0.0',
			'encode': utf8encode,
			'decode': utf8decode
		};
	
		// Some AMD build optimizers, like r.js, check for specific condition patterns
		// like the following:
		if (
			true
		) {
			!(__WEBPACK_AMD_DEFINE_RESULT__ = function() {
				return utf8;
			}.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
		}	else if (freeExports && !freeExports.nodeType) {
			if (freeModule) { // in Node.js or RingoJS v0.8.0+
				freeModule.exports = utf8;
			} else { // in Narwhal or RingoJS v0.7.0-
				var object = {};
				var hasOwnProperty = object.hasOwnProperty;
				for (var key in utf8) {
					hasOwnProperty.call(utf8, key) && (freeExports[key] = utf8[key]);
				}
			}
		} else { // in Rhino or a web browser
			root.utf8 = utf8;
		}
	
	}(this));
	
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(4)(module), (function() { return this; }())))

/***/ },
/* 39 */
/***/ function(module, exports) {

	/* WEBPACK VAR INJECTION */(function(global) {/**
	 * Create a blob builder even when vendor prefixes exist
	 */
	
	var BlobBuilder = global.BlobBuilder
	  || global.WebKitBlobBuilder
	  || global.MSBlobBuilder
	  || global.MozBlobBuilder;
	
	/**
	 * Check if Blob constructor is supported
	 */
	
	var blobSupported = (function() {
	  try {
	    var a = new Blob(['hi']);
	    return a.size === 2;
	  } catch(e) {
	    return false;
	  }
	})();
	
	/**
	 * Check if Blob constructor supports ArrayBufferViews
	 * Fails in Safari 6, so we need to map to ArrayBuffers there.
	 */
	
	var blobSupportsArrayBufferView = blobSupported && (function() {
	  try {
	    var b = new Blob([new Uint8Array([1,2])]);
	    return b.size === 2;
	  } catch(e) {
	    return false;
	  }
	})();
	
	/**
	 * Check if BlobBuilder is supported
	 */
	
	var blobBuilderSupported = BlobBuilder
	  && BlobBuilder.prototype.append
	  && BlobBuilder.prototype.getBlob;
	
	/**
	 * Helper function that maps ArrayBufferViews to ArrayBuffers
	 * Used by BlobBuilder constructor and old browsers that didn't
	 * support it in the Blob constructor.
	 */
	
	function mapArrayBufferViews(ary) {
	  for (var i = 0; i < ary.length; i++) {
	    var chunk = ary[i];
	    if (chunk.buffer instanceof ArrayBuffer) {
	      var buf = chunk.buffer;
	
	      // if this is a subarray, make a copy so we only
	      // include the subarray region from the underlying buffer
	      if (chunk.byteLength !== buf.byteLength) {
	        var copy = new Uint8Array(chunk.byteLength);
	        copy.set(new Uint8Array(buf, chunk.byteOffset, chunk.byteLength));
	        buf = copy.buffer;
	      }
	
	      ary[i] = buf;
	    }
	  }
	}
	
	function BlobBuilderConstructor(ary, options) {
	  options = options || {};
	
	  var bb = new BlobBuilder();
	  mapArrayBufferViews(ary);
	
	  for (var i = 0; i < ary.length; i++) {
	    bb.append(ary[i]);
	  }
	
	  return (options.type) ? bb.getBlob(options.type) : bb.getBlob();
	};
	
	function BlobConstructor(ary, options) {
	  mapArrayBufferViews(ary);
	  return new Blob(ary, options || {});
	};
	
	module.exports = (function() {
	  if (blobSupported) {
	    return blobSupportsArrayBufferView ? global.Blob : BlobConstructor;
	  } else if (blobBuilderSupported) {
	    return BlobBuilderConstructor;
	  } else {
	    return undefined;
	  }
	})();
	
	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ },
/* 40 */
/***/ function(module, exports) {

	/**
	 * Compiles a querystring
	 * Returns string representation of the object
	 *
	 * @param {Object}
	 * @api private
	 */
	
	exports.encode = function (obj) {
	  var str = '';
	
	  for (var i in obj) {
	    if (obj.hasOwnProperty(i)) {
	      if (str.length) str += '&';
	      str += encodeURIComponent(i) + '=' + encodeURIComponent(obj[i]);
	    }
	  }
	
	  return str;
	};
	
	/**
	 * Parses a simple querystring into an object
	 *
	 * @param {String} qs
	 * @api private
	 */
	
	exports.decode = function(qs){
	  var qry = {};
	  var pairs = qs.split('&');
	  for (var i = 0, l = pairs.length; i < l; i++) {
	    var pair = pairs[i].split('=');
	    qry[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1]);
	  }
	  return qry;
	};


/***/ },
/* 41 */
/***/ function(module, exports) {

	
	module.exports = function(a, b){
	  var fn = function(){};
	  fn.prototype = b.prototype;
	  a.prototype = new fn;
	  a.prototype.constructor = a;
	};

/***/ },
/* 42 */
/***/ function(module, exports, __webpack_require__) {

	
	/**
	 * This is the web browser implementation of `debug()`.
	 *
	 * Expose `debug()` as the module.
	 */
	
	exports = module.exports = __webpack_require__(43);
	exports.log = log;
	exports.formatArgs = formatArgs;
	exports.save = save;
	exports.load = load;
	exports.useColors = useColors;
	
	/**
	 * Colors.
	 */
	
	exports.colors = [
	  'lightseagreen',
	  'forestgreen',
	  'goldenrod',
	  'dodgerblue',
	  'darkorchid',
	  'crimson'
	];
	
	/**
	 * Currently only WebKit-based Web Inspectors, Firefox >= v31,
	 * and the Firebug extension (any Firefox version) are known
	 * to support "%c" CSS customizations.
	 *
	 * TODO: add a `localStorage` variable to explicitly enable/disable colors
	 */
	
	function useColors() {
	  // is webkit? http://stackoverflow.com/a/16459606/376773
	  return ('WebkitAppearance' in document.documentElement.style) ||
	    // is firebug? http://stackoverflow.com/a/398120/376773
	    (window.console && (console.firebug || (console.exception && console.table))) ||
	    // is firefox >= v31?
	    // https://developer.mozilla.org/en-US/docs/Tools/Web_Console#Styling_messages
	    (navigator.userAgent.toLowerCase().match(/firefox\/(\d+)/) && parseInt(RegExp.$1, 10) >= 31);
	}
	
	/**
	 * Map %j to `JSON.stringify()`, since no Web Inspectors do that by default.
	 */
	
	exports.formatters.j = function(v) {
	  return JSON.stringify(v);
	};
	
	
	/**
	 * Colorize log arguments if enabled.
	 *
	 * @api public
	 */
	
	function formatArgs() {
	  var args = arguments;
	  var useColors = this.useColors;
	
	  args[0] = (useColors ? '%c' : '')
	    + this.namespace
	    + (useColors ? ' %c' : ' ')
	    + args[0]
	    + (useColors ? '%c ' : ' ')
	    + '+' + exports.humanize(this.diff);
	
	  if (!useColors) return args;
	
	  var c = 'color: ' + this.color;
	  args = [args[0], c, 'color: inherit'].concat(Array.prototype.slice.call(args, 1));
	
	  // the final "%c" is somewhat tricky, because there could be other
	  // arguments passed either before or after the %c, so we need to
	  // figure out the correct index to insert the CSS into
	  var index = 0;
	  var lastC = 0;
	  args[0].replace(/%[a-z%]/g, function(match) {
	    if ('%%' === match) return;
	    index++;
	    if ('%c' === match) {
	      // we only are interested in the *last* %c
	      // (the user may have provided their own)
	      lastC = index;
	    }
	  });
	
	  args.splice(lastC, 0, c);
	  return args;
	}
	
	/**
	 * Invokes `console.log()` when available.
	 * No-op when `console.log` is not a "function".
	 *
	 * @api public
	 */
	
	function log() {
	  // This hackery is required for IE8,
	  // where the `console.log` function doesn't have 'apply'
	  return 'object' == typeof console
	    && 'function' == typeof console.log
	    && Function.prototype.apply.call(console.log, console, arguments);
	}
	
	/**
	 * Save `namespaces`.
	 *
	 * @param {String} namespaces
	 * @api private
	 */
	
	function save(namespaces) {
	  try {
	    if (null == namespaces) {
	      localStorage.removeItem('debug');
	    } else {
	      localStorage.debug = namespaces;
	    }
	  } catch(e) {}
	}
	
	/**
	 * Load `namespaces`.
	 *
	 * @return {String} returns the previously persisted debug modes
	 * @api private
	 */
	
	function load() {
	  var r;
	  try {
	    r = localStorage.debug;
	  } catch(e) {}
	  return r;
	}
	
	/**
	 * Enable namespaces listed in `localStorage.debug` initially.
	 */
	
	exports.enable(load());


/***/ },
/* 43 */
/***/ function(module, exports, __webpack_require__) {

	
	/**
	 * This is the common logic for both the Node.js and web browser
	 * implementations of `debug()`.
	 *
	 * Expose `debug()` as the module.
	 */
	
	exports = module.exports = debug;
	exports.coerce = coerce;
	exports.disable = disable;
	exports.enable = enable;
	exports.enabled = enabled;
	exports.humanize = __webpack_require__(44);
	
	/**
	 * The currently active debug mode names, and names to skip.
	 */
	
	exports.names = [];
	exports.skips = [];
	
	/**
	 * Map of special "%n" handling functions, for the debug "format" argument.
	 *
	 * Valid key names are a single, lowercased letter, i.e. "n".
	 */
	
	exports.formatters = {};
	
	/**
	 * Previously assigned color.
	 */
	
	var prevColor = 0;
	
	/**
	 * Previous log timestamp.
	 */
	
	var prevTime;
	
	/**
	 * Select a color.
	 *
	 * @return {Number}
	 * @api private
	 */
	
	function selectColor() {
	  return exports.colors[prevColor++ % exports.colors.length];
	}
	
	/**
	 * Create a debugger with the given `namespace`.
	 *
	 * @param {String} namespace
	 * @return {Function}
	 * @api public
	 */
	
	function debug(namespace) {
	
	  // define the `disabled` version
	  function disabled() {
	  }
	  disabled.enabled = false;
	
	  // define the `enabled` version
	  function enabled() {
	
	    var self = enabled;
	
	    // set `diff` timestamp
	    var curr = +new Date();
	    var ms = curr - (prevTime || curr);
	    self.diff = ms;
	    self.prev = prevTime;
	    self.curr = curr;
	    prevTime = curr;
	
	    // add the `color` if not set
	    if (null == self.useColors) self.useColors = exports.useColors();
	    if (null == self.color && self.useColors) self.color = selectColor();
	
	    var args = Array.prototype.slice.call(arguments);
	
	    args[0] = exports.coerce(args[0]);
	
	    if ('string' !== typeof args[0]) {
	      // anything else let's inspect with %o
	      args = ['%o'].concat(args);
	    }
	
	    // apply any `formatters` transformations
	    var index = 0;
	    args[0] = args[0].replace(/%([a-z%])/g, function(match, format) {
	      // if we encounter an escaped % then don't increase the array index
	      if (match === '%%') return match;
	      index++;
	      var formatter = exports.formatters[format];
	      if ('function' === typeof formatter) {
	        var val = args[index];
	        match = formatter.call(self, val);
	
	        // now we need to remove `args[index]` since it's inlined in the `format`
	        args.splice(index, 1);
	        index--;
	      }
	      return match;
	    });
	
	    if ('function' === typeof exports.formatArgs) {
	      args = exports.formatArgs.apply(self, args);
	    }
	    var logFn = enabled.log || exports.log || console.log.bind(console);
	    logFn.apply(self, args);
	  }
	  enabled.enabled = true;
	
	  var fn = exports.enabled(namespace) ? enabled : disabled;
	
	  fn.namespace = namespace;
	
	  return fn;
	}
	
	/**
	 * Enables a debug mode by namespaces. This can include modes
	 * separated by a colon and wildcards.
	 *
	 * @param {String} namespaces
	 * @api public
	 */
	
	function enable(namespaces) {
	  exports.save(namespaces);
	
	  var split = (namespaces || '').split(/[\s,]+/);
	  var len = split.length;
	
	  for (var i = 0; i < len; i++) {
	    if (!split[i]) continue; // ignore empty strings
	    namespaces = split[i].replace(/\*/g, '.*?');
	    if (namespaces[0] === '-') {
	      exports.skips.push(new RegExp('^' + namespaces.substr(1) + '$'));
	    } else {
	      exports.names.push(new RegExp('^' + namespaces + '$'));
	    }
	  }
	}
	
	/**
	 * Disable debug output.
	 *
	 * @api public
	 */
	
	function disable() {
	  exports.enable('');
	}
	
	/**
	 * Returns true if the given mode name is enabled, false otherwise.
	 *
	 * @param {String} name
	 * @return {Boolean}
	 * @api public
	 */
	
	function enabled(name) {
	  var i, len;
	  for (i = 0, len = exports.skips.length; i < len; i++) {
	    if (exports.skips[i].test(name)) {
	      return false;
	    }
	  }
	  for (i = 0, len = exports.names.length; i < len; i++) {
	    if (exports.names[i].test(name)) {
	      return true;
	    }
	  }
	  return false;
	}
	
	/**
	 * Coerce `val`.
	 *
	 * @param {Mixed} val
	 * @return {Mixed}
	 * @api private
	 */
	
	function coerce(val) {
	  if (val instanceof Error) return val.stack || val.message;
	  return val;
	}


/***/ },
/* 44 */
/***/ function(module, exports) {

	/**
	 * Helpers.
	 */
	
	var s = 1000;
	var m = s * 60;
	var h = m * 60;
	var d = h * 24;
	var y = d * 365.25;
	
	/**
	 * Parse or format the given `val`.
	 *
	 * Options:
	 *
	 *  - `long` verbose formatting [false]
	 *
	 * @param {String|Number} val
	 * @param {Object} options
	 * @return {String|Number}
	 * @api public
	 */
	
	module.exports = function(val, options){
	  options = options || {};
	  if ('string' == typeof val) return parse(val);
	  return options.long
	    ? long(val)
	    : short(val);
	};
	
	/**
	 * Parse the given `str` and return milliseconds.
	 *
	 * @param {String} str
	 * @return {Number}
	 * @api private
	 */
	
	function parse(str) {
	  var match = /^((?:\d+)?\.?\d+) *(ms|seconds?|s|minutes?|m|hours?|h|days?|d|years?|y)?$/i.exec(str);
	  if (!match) return;
	  var n = parseFloat(match[1]);
	  var type = (match[2] || 'ms').toLowerCase();
	  switch (type) {
	    case 'years':
	    case 'year':
	    case 'y':
	      return n * y;
	    case 'days':
	    case 'day':
	    case 'd':
	      return n * d;
	    case 'hours':
	    case 'hour':
	    case 'h':
	      return n * h;
	    case 'minutes':
	    case 'minute':
	    case 'm':
	      return n * m;
	    case 'seconds':
	    case 'second':
	    case 's':
	      return n * s;
	    case 'ms':
	      return n;
	  }
	}
	
	/**
	 * Short format for `ms`.
	 *
	 * @param {Number} ms
	 * @return {String}
	 * @api private
	 */
	
	function short(ms) {
	  if (ms >= d) return Math.round(ms / d) + 'd';
	  if (ms >= h) return Math.round(ms / h) + 'h';
	  if (ms >= m) return Math.round(ms / m) + 'm';
	  if (ms >= s) return Math.round(ms / s) + 's';
	  return ms + 'ms';
	}
	
	/**
	 * Long format for `ms`.
	 *
	 * @param {Number} ms
	 * @return {String}
	 * @api private
	 */
	
	function long(ms) {
	  return plural(ms, d, 'day')
	    || plural(ms, h, 'hour')
	    || plural(ms, m, 'minute')
	    || plural(ms, s, 'second')
	    || ms + ' ms';
	}
	
	/**
	 * Pluralization helper.
	 */
	
	function plural(ms, n, name) {
	  if (ms < n) return;
	  if (ms < n * 1.5) return Math.floor(ms / n) + ' ' + name;
	  return Math.ceil(ms / n) + ' ' + name + 's';
	}


/***/ },
/* 45 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(global) {
	/**
	 * Module requirements.
	 */
	
	var Polling = __webpack_require__(30);
	var inherit = __webpack_require__(41);
	
	/**
	 * Module exports.
	 */
	
	module.exports = JSONPPolling;
	
	/**
	 * Cached regular expressions.
	 */
	
	var rNewline = /\n/g;
	var rEscapedNewline = /\\n/g;
	
	/**
	 * Global JSONP callbacks.
	 */
	
	var callbacks;
	
	/**
	 * Callbacks count.
	 */
	
	var index = 0;
	
	/**
	 * Noop.
	 */
	
	function empty () { }
	
	/**
	 * JSONP Polling constructor.
	 *
	 * @param {Object} opts.
	 * @api public
	 */
	
	function JSONPPolling (opts) {
	  Polling.call(this, opts);
	
	  this.query = this.query || {};
	
	  // define global callbacks array if not present
	  // we do this here (lazily) to avoid unneeded global pollution
	  if (!callbacks) {
	    // we need to consider multiple engines in the same page
	    if (!global.___eio) global.___eio = [];
	    callbacks = global.___eio;
	  }
	
	  // callback identifier
	  this.index = callbacks.length;
	
	  // add callback to jsonp global
	  var self = this;
	  callbacks.push(function (msg) {
	    self.onData(msg);
	  });
	
	  // append to query string
	  this.query.j = this.index;
	
	  // prevent spurious errors from being emitted when the window is unloaded
	  if (global.document && global.addEventListener) {
	    global.addEventListener('beforeunload', function () {
	      if (self.script) self.script.onerror = empty;
	    }, false);
	  }
	}
	
	/**
	 * Inherits from Polling.
	 */
	
	inherit(JSONPPolling, Polling);
	
	/*
	 * JSONP only supports binary as base64 encoded strings
	 */
	
	JSONPPolling.prototype.supportsBinary = false;
	
	/**
	 * Closes the socket.
	 *
	 * @api private
	 */
	
	JSONPPolling.prototype.doClose = function () {
	  if (this.script) {
	    this.script.parentNode.removeChild(this.script);
	    this.script = null;
	  }
	
	  if (this.form) {
	    this.form.parentNode.removeChild(this.form);
	    this.form = null;
	    this.iframe = null;
	  }
	
	  Polling.prototype.doClose.call(this);
	};
	
	/**
	 * Starts a poll cycle.
	 *
	 * @api private
	 */
	
	JSONPPolling.prototype.doPoll = function () {
	  var self = this;
	  var script = document.createElement('script');
	
	  if (this.script) {
	    this.script.parentNode.removeChild(this.script);
	    this.script = null;
	  }
	
	  script.async = true;
	  script.src = this.uri();
	  script.onerror = function(e){
	    self.onError('jsonp poll error',e);
	  };
	
	  var insertAt = document.getElementsByTagName('script')[0];
	  insertAt.parentNode.insertBefore(script, insertAt);
	  this.script = script;
	
	  var isUAgecko = 'undefined' != typeof navigator && /gecko/i.test(navigator.userAgent);
	  
	  if (isUAgecko) {
	    setTimeout(function () {
	      var iframe = document.createElement('iframe');
	      document.body.appendChild(iframe);
	      document.body.removeChild(iframe);
	    }, 100);
	  }
	};
	
	/**
	 * Writes with a hidden iframe.
	 *
	 * @param {String} data to send
	 * @param {Function} called upon flush.
	 * @api private
	 */
	
	JSONPPolling.prototype.doWrite = function (data, fn) {
	  var self = this;
	
	  if (!this.form) {
	    var form = document.createElement('form');
	    var area = document.createElement('textarea');
	    var id = this.iframeId = 'eio_iframe_' + this.index;
	    var iframe;
	
	    form.className = 'socketio';
	    form.style.position = 'absolute';
	    form.style.top = '-1000px';
	    form.style.left = '-1000px';
	    form.target = id;
	    form.method = 'POST';
	    form.setAttribute('accept-charset', 'utf-8');
	    area.name = 'd';
	    form.appendChild(area);
	    document.body.appendChild(form);
	
	    this.form = form;
	    this.area = area;
	  }
	
	  this.form.action = this.uri();
	
	  function complete () {
	    initIframe();
	    fn();
	  }
	
	  function initIframe () {
	    if (self.iframe) {
	      try {
	        self.form.removeChild(self.iframe);
	      } catch (e) {
	        self.onError('jsonp polling iframe removal error', e);
	      }
	    }
	
	    try {
	      // ie6 dynamic iframes with target="" support (thanks Chris Lambacher)
	      var html = '<iframe src="javascript:0" name="'+ self.iframeId +'">';
	      iframe = document.createElement(html);
	    } catch (e) {
	      iframe = document.createElement('iframe');
	      iframe.name = self.iframeId;
	      iframe.src = 'javascript:0';
	    }
	
	    iframe.id = self.iframeId;
	
	    self.form.appendChild(iframe);
	    self.iframe = iframe;
	  }
	
	  initIframe();
	
	  // escape \n to prevent it from being converted into \r\n by some UAs
	  // double escaping is required for escaped new lines because unescaping of new lines can be done safely on server-side
	  data = data.replace(rEscapedNewline, '\\\n');
	  this.area.value = data.replace(rNewline, '\\n');
	
	  try {
	    this.form.submit();
	  } catch(e) {}
	
	  if (this.iframe.attachEvent) {
	    this.iframe.onreadystatechange = function(){
	      if (self.iframe.readyState == 'complete') {
	        complete();
	      }
	    };
	  } else {
	    this.iframe.onload = complete;
	  }
	};
	
	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ },
/* 46 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Module dependencies.
	 */
	
	var Transport = __webpack_require__(31);
	var parser = __webpack_require__(32);
	var parseqs = __webpack_require__(40);
	var inherit = __webpack_require__(41);
	var debug = __webpack_require__(42)('engine.io-client:websocket');
	
	/**
	 * `ws` exposes a WebSocket-compatible interface in
	 * Node, or the `WebSocket` or `MozWebSocket` globals
	 * in the browser.
	 */
	
	var WebSocket = __webpack_require__(47);
	
	/**
	 * Module exports.
	 */
	
	module.exports = WS;
	
	/**
	 * WebSocket transport constructor.
	 *
	 * @api {Object} connection options
	 * @api public
	 */
	
	function WS(opts){
	  var forceBase64 = (opts && opts.forceBase64);
	  if (forceBase64) {
	    this.supportsBinary = false;
	  }
	  Transport.call(this, opts);
	}
	
	/**
	 * Inherits from Transport.
	 */
	
	inherit(WS, Transport);
	
	/**
	 * Transport name.
	 *
	 * @api public
	 */
	
	WS.prototype.name = 'websocket';
	
	/*
	 * WebSockets support binary
	 */
	
	WS.prototype.supportsBinary = true;
	
	/**
	 * Opens socket.
	 *
	 * @api private
	 */
	
	WS.prototype.doOpen = function(){
	  if (!this.check()) {
	    // let probe timeout
	    return;
	  }
	
	  var self = this;
	  var uri = this.uri();
	  var protocols = void(0);
	  var opts = { agent: this.agent };
	
	  // SSL options for Node.js client
	  opts.pfx = this.pfx;
	  opts.key = this.key;
	  opts.passphrase = this.passphrase;
	  opts.cert = this.cert;
	  opts.ca = this.ca;
	  opts.ciphers = this.ciphers;
	  opts.rejectUnauthorized = this.rejectUnauthorized;
	
	  this.ws = new WebSocket(uri, protocols, opts);
	
	  if (this.ws.binaryType === undefined) {
	    this.supportsBinary = false;
	  }
	
	  this.ws.binaryType = 'arraybuffer';
	  this.addEventListeners();
	};
	
	/**
	 * Adds event listeners to the socket
	 *
	 * @api private
	 */
	
	WS.prototype.addEventListeners = function(){
	  var self = this;
	
	  this.ws.onopen = function(){
	    self.onOpen();
	  };
	  this.ws.onclose = function(){
	    self.onClose();
	  };
	  this.ws.onmessage = function(ev){
	    self.onData(ev.data);
	  };
	  this.ws.onerror = function(e){
	    self.onError('websocket error', e);
	  };
	};
	
	/**
	 * Override `onData` to use a timer on iOS.
	 * See: https://gist.github.com/mloughran/2052006
	 *
	 * @api private
	 */
	
	if ('undefined' != typeof navigator
	  && /iPad|iPhone|iPod/i.test(navigator.userAgent)) {
	  WS.prototype.onData = function(data){
	    var self = this;
	    setTimeout(function(){
	      Transport.prototype.onData.call(self, data);
	    }, 0);
	  };
	}
	
	/**
	 * Writes data to socket.
	 *
	 * @param {Array} array of packets.
	 * @api private
	 */
	
	WS.prototype.write = function(packets){
	  var self = this;
	  this.writable = false;
	  // encodePacket efficient as it uses WS framing
	  // no need for encodePayload
	  for (var i = 0, l = packets.length; i < l; i++) {
	    parser.encodePacket(packets[i], this.supportsBinary, function(data) {
	      //Sometimes the websocket has already been closed but the browser didn't
	      //have a chance of informing us about it yet, in that case send will
	      //throw an error
	      try {
	        self.ws.send(data);
	      } catch (e){
	        debug('websocket closed before onclose event');
	      }
	    });
	  }
	
	  function ondrain() {
	    self.writable = true;
	    self.emit('drain');
	  }
	  // fake drain
	  // defer to next tick to allow Socket to clear writeBuffer
	  setTimeout(ondrain, 0);
	};
	
	/**
	 * Called upon close
	 *
	 * @api private
	 */
	
	WS.prototype.onClose = function(){
	  Transport.prototype.onClose.call(this);
	};
	
	/**
	 * Closes socket.
	 *
	 * @api private
	 */
	
	WS.prototype.doClose = function(){
	  if (typeof this.ws !== 'undefined') {
	    this.ws.close();
	  }
	};
	
	/**
	 * Generates uri for connection.
	 *
	 * @api private
	 */
	
	WS.prototype.uri = function(){
	  var query = this.query || {};
	  var schema = this.secure ? 'wss' : 'ws';
	  var port = '';
	
	  // avoid port if default for schema
	  if (this.port && (('wss' == schema && this.port != 443)
	    || ('ws' == schema && this.port != 80))) {
	    port = ':' + this.port;
	  }
	
	  // append timestamp to URI
	  if (this.timestampRequests) {
	    query[this.timestampParam] = +new Date;
	  }
	
	  // communicate binary support capabilities
	  if (!this.supportsBinary) {
	    query.b64 = 1;
	  }
	
	  query = parseqs.encode(query);
	
	  // prepend ? to query
	  if (query.length) {
	    query = '?' + query;
	  }
	
	  return schema + '://' + this.hostname + port + this.path + query;
	};
	
	/**
	 * Feature detection for WebSocket.
	 *
	 * @return {Boolean} whether this transport is available.
	 * @api public
	 */
	
	WS.prototype.check = function(){
	  return !!WebSocket && !('__initialize' in WebSocket && this.name === WS.prototype.name);
	};


/***/ },
/* 47 */
/***/ function(module, exports) {

	
	/**
	 * Module dependencies.
	 */
	
	var global = (function() { return this; })();
	
	/**
	 * WebSocket constructor.
	 */
	
	var WebSocket = global.WebSocket || global.MozWebSocket;
	
	/**
	 * Module exports.
	 */
	
	module.exports = WebSocket ? ws : null;
	
	/**
	 * WebSocket constructor.
	 *
	 * The third `opts` options object gets ignored in web browsers, since it's
	 * non-standard, and throws a TypeError if passed to the constructor.
	 * See: https://github.com/einaros/ws/issues/227
	 *
	 * @param {String} uri
	 * @param {Array} protocols (optional)
	 * @param {Object) opts (optional)
	 * @api public
	 */
	
	function ws(uri, protocols, opts) {
	  var instance;
	  if (protocols) {
	    instance = new WebSocket(uri, protocols);
	  } else {
	    instance = new WebSocket(uri);
	  }
	  return instance;
	}
	
	if (WebSocket) ws.prototype = WebSocket.prototype;


/***/ },
/* 48 */
/***/ function(module, exports) {

	
	var indexOf = [].indexOf;
	
	module.exports = function(arr, obj){
	  if (indexOf) return arr.indexOf(obj);
	  for (var i = 0; i < arr.length; ++i) {
	    if (arr[i] === obj) return i;
	  }
	  return -1;
	};

/***/ },
/* 49 */
/***/ function(module, exports) {

	/**
	 * Parses an URI
	 *
	 * @author Steven Levithan <stevenlevithan.com> (MIT license)
	 * @api private
	 */
	
	var re = /^(?:(?![^:@]+:[^:@\/]*@)(http|https|ws|wss):\/\/)?((?:(([^:@]*)(?::([^:@]*))?)?@)?((?:[a-f0-9]{0,4}:){2,7}[a-f0-9]{0,4}|[^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/;
	
	var parts = [
	    'source', 'protocol', 'authority', 'userInfo', 'user', 'password', 'host', 'port', 'relative', 'path', 'directory', 'file', 'query', 'anchor'
	];
	
	module.exports = function parseuri(str) {
	    var src = str,
	        b = str.indexOf('['),
	        e = str.indexOf(']');
	
	    if (b != -1 && e != -1) {
	        str = str.substring(0, b) + str.substring(b, e).replace(/:/g, ';') + str.substring(e, str.length);
	    }
	
	    var m = re.exec(str || ''),
	        uri = {},
	        i = 14;
	
	    while (i--) {
	        uri[parts[i]] = m[i] || '';
	    }
	
	    if (b != -1 && e != -1) {
	        uri.source = src;
	        uri.host = uri.host.substring(1, uri.host.length - 1).replace(/;/g, ':');
	        uri.authority = uri.authority.replace('[', '').replace(']', '').replace(/;/g, ':');
	        uri.ipv6uri = true;
	    }
	
	    return uri;
	};


/***/ },
/* 50 */
/***/ function(module, exports) {

	/* WEBPACK VAR INJECTION */(function(global) {/**
	 * JSON parse.
	 *
	 * @see Based on jQuery#parseJSON (MIT) and JSON2
	 * @api private
	 */
	
	var rvalidchars = /^[\],:{}\s]*$/;
	var rvalidescape = /\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g;
	var rvalidtokens = /"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g;
	var rvalidbraces = /(?:^|:|,)(?:\s*\[)+/g;
	var rtrimLeft = /^\s+/;
	var rtrimRight = /\s+$/;
	
	module.exports = function parsejson(data) {
	  if ('string' != typeof data || !data) {
	    return null;
	  }
	
	  data = data.replace(rtrimLeft, '').replace(rtrimRight, '');
	
	  // Attempt to parse using the native JSON parser first
	  if (global.JSON && JSON.parse) {
	    return JSON.parse(data);
	  }
	
	  if (rvalidchars.test(data.replace(rvalidescape, '@')
	      .replace(rvalidtokens, ']')
	      .replace(rvalidbraces, ''))) {
	    return (new Function('return ' + data))();
	  }
	};
	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ },
/* 51 */
/***/ function(module, exports, __webpack_require__) {

	
	/**
	 * Module dependencies.
	 */
	
	var parser = __webpack_require__(13);
	var Emitter = __webpack_require__(18);
	var toArray = __webpack_require__(52);
	var on = __webpack_require__(53);
	var bind = __webpack_require__(54);
	var debug = __webpack_require__(12)('socket.io-client:socket');
	var hasBin = __webpack_require__(34);
	
	/**
	 * Module exports.
	 */
	
	module.exports = exports = Socket;
	
	/**
	 * Internal events (blacklisted).
	 * These events can't be emitted by the user.
	 *
	 * @api private
	 */
	
	var events = {
	  connect: 1,
	  connect_error: 1,
	  connect_timeout: 1,
	  disconnect: 1,
	  error: 1,
	  reconnect: 1,
	  reconnect_attempt: 1,
	  reconnect_failed: 1,
	  reconnect_error: 1,
	  reconnecting: 1
	};
	
	/**
	 * Shortcut to `Emitter#emit`.
	 */
	
	var emit = Emitter.prototype.emit;
	
	/**
	 * `Socket` constructor.
	 *
	 * @api public
	 */
	
	function Socket(io, nsp){
	  this.io = io;
	  this.nsp = nsp;
	  this.json = this; // compat
	  this.ids = 0;
	  this.acks = {};
	  if (this.io.autoConnect) this.open();
	  this.receiveBuffer = [];
	  this.sendBuffer = [];
	  this.connected = false;
	  this.disconnected = true;
	}
	
	/**
	 * Mix in `Emitter`.
	 */
	
	Emitter(Socket.prototype);
	
	/**
	 * Subscribe to open, close and packet events
	 *
	 * @api private
	 */
	
	Socket.prototype.subEvents = function() {
	  if (this.subs) return;
	
	  var io = this.io;
	  this.subs = [
	    on(io, 'open', bind(this, 'onopen')),
	    on(io, 'packet', bind(this, 'onpacket')),
	    on(io, 'close', bind(this, 'onclose'))
	  ];
	};
	
	/**
	 * "Opens" the socket.
	 *
	 * @api public
	 */
	
	Socket.prototype.open =
	Socket.prototype.connect = function(){
	  if (this.connected) return this;
	
	  this.subEvents();
	  this.io.open(); // ensure open
	  if ('open' == this.io.readyState) this.onopen();
	  return this;
	};
	
	/**
	 * Sends a `message` event.
	 *
	 * @return {Socket} self
	 * @api public
	 */
	
	Socket.prototype.send = function(){
	  var args = toArray(arguments);
	  args.unshift('message');
	  this.emit.apply(this, args);
	  return this;
	};
	
	/**
	 * Override `emit`.
	 * If the event is in `events`, it's emitted normally.
	 *
	 * @param {String} event name
	 * @return {Socket} self
	 * @api public
	 */
	
	Socket.prototype.emit = function(ev){
	  if (events.hasOwnProperty(ev)) {
	    emit.apply(this, arguments);
	    return this;
	  }
	
	  var args = toArray(arguments);
	  var parserType = parser.EVENT; // default
	  if (hasBin(args)) { parserType = parser.BINARY_EVENT; } // binary
	  var packet = { type: parserType, data: args };
	
	  // event ack callback
	  if ('function' == typeof args[args.length - 1]) {
	    debug('emitting packet with ack id %d', this.ids);
	    this.acks[this.ids] = args.pop();
	    packet.id = this.ids++;
	  }
	
	  if (this.connected) {
	    this.packet(packet);
	  } else {
	    this.sendBuffer.push(packet);
	  }
	
	  return this;
	};
	
	/**
	 * Sends a packet.
	 *
	 * @param {Object} packet
	 * @api private
	 */
	
	Socket.prototype.packet = function(packet){
	  packet.nsp = this.nsp;
	  this.io.packet(packet);
	};
	
	/**
	 * Called upon engine `open`.
	 *
	 * @api private
	 */
	
	Socket.prototype.onopen = function(){
	  debug('transport is open - connecting');
	
	  // write connect packet if necessary
	  if ('/' != this.nsp) {
	    this.packet({ type: parser.CONNECT });
	  }
	};
	
	/**
	 * Called upon engine `close`.
	 *
	 * @param {String} reason
	 * @api private
	 */
	
	Socket.prototype.onclose = function(reason){
	  debug('close (%s)', reason);
	  this.connected = false;
	  this.disconnected = true;
	  delete this.id;
	  this.emit('disconnect', reason);
	};
	
	/**
	 * Called with socket packet.
	 *
	 * @param {Object} packet
	 * @api private
	 */
	
	Socket.prototype.onpacket = function(packet){
	  if (packet.nsp != this.nsp) return;
	
	  switch (packet.type) {
	    case parser.CONNECT:
	      this.onconnect();
	      break;
	
	    case parser.EVENT:
	      this.onevent(packet);
	      break;
	
	    case parser.BINARY_EVENT:
	      this.onevent(packet);
	      break;
	
	    case parser.ACK:
	      this.onack(packet);
	      break;
	
	    case parser.BINARY_ACK:
	      this.onack(packet);
	      break;
	
	    case parser.DISCONNECT:
	      this.ondisconnect();
	      break;
	
	    case parser.ERROR:
	      this.emit('error', packet.data);
	      break;
	  }
	};
	
	/**
	 * Called upon a server event.
	 *
	 * @param {Object} packet
	 * @api private
	 */
	
	Socket.prototype.onevent = function(packet){
	  var args = packet.data || [];
	  debug('emitting event %j', args);
	
	  if (null != packet.id) {
	    debug('attaching ack callback to event');
	    args.push(this.ack(packet.id));
	  }
	
	  if (this.connected) {
	    emit.apply(this, args);
	  } else {
	    this.receiveBuffer.push(args);
	  }
	};
	
	/**
	 * Produces an ack callback to emit with an event.
	 *
	 * @api private
	 */
	
	Socket.prototype.ack = function(id){
	  var self = this;
	  var sent = false;
	  return function(){
	    // prevent double callbacks
	    if (sent) return;
	    sent = true;
	    var args = toArray(arguments);
	    debug('sending ack %j', args);
	
	    var type = hasBin(args) ? parser.BINARY_ACK : parser.ACK;
	    self.packet({
	      type: type,
	      id: id,
	      data: args
	    });
	  };
	};
	
	/**
	 * Called upon a server acknowlegement.
	 *
	 * @param {Object} packet
	 * @api private
	 */
	
	Socket.prototype.onack = function(packet){
	  debug('calling ack %s with %j', packet.id, packet.data);
	  var fn = this.acks[packet.id];
	  fn.apply(this, packet.data);
	  delete this.acks[packet.id];
	};
	
	/**
	 * Called upon server connect.
	 *
	 * @api private
	 */
	
	Socket.prototype.onconnect = function(){
	  this.connected = true;
	  this.disconnected = false;
	  this.emit('connect');
	  this.emitBuffered();
	};
	
	/**
	 * Emit buffered events (received and emitted).
	 *
	 * @api private
	 */
	
	Socket.prototype.emitBuffered = function(){
	  var i;
	  for (i = 0; i < this.receiveBuffer.length; i++) {
	    emit.apply(this, this.receiveBuffer[i]);
	  }
	  this.receiveBuffer = [];
	
	  for (i = 0; i < this.sendBuffer.length; i++) {
	    this.packet(this.sendBuffer[i]);
	  }
	  this.sendBuffer = [];
	};
	
	/**
	 * Called upon server disconnect.
	 *
	 * @api private
	 */
	
	Socket.prototype.ondisconnect = function(){
	  debug('server disconnect (%s)', this.nsp);
	  this.destroy();
	  this.onclose('io server disconnect');
	};
	
	/**
	 * Called upon forced client/server side disconnections,
	 * this method ensures the manager stops tracking us and
	 * that reconnections don't get triggered for this.
	 *
	 * @api private.
	 */
	
	Socket.prototype.destroy = function(){
	  if (this.subs) {
	    // clean subscriptions to avoid reconnections
	    for (var i = 0; i < this.subs.length; i++) {
	      this.subs[i].destroy();
	    }
	    this.subs = null;
	  }
	
	  this.io.destroy(this);
	};
	
	/**
	 * Disconnects the socket manually.
	 *
	 * @return {Socket} self
	 * @api public
	 */
	
	Socket.prototype.close =
	Socket.prototype.disconnect = function(){
	  if (this.connected) {
	    debug('performing disconnect (%s)', this.nsp);
	    this.packet({ type: parser.DISCONNECT });
	  }
	
	  // remove socket from pool
	  this.destroy();
	
	  if (this.connected) {
	    // fire events
	    this.onclose('io client disconnect');
	  }
	  return this;
	};


/***/ },
/* 52 */
/***/ function(module, exports) {

	module.exports = toArray
	
	function toArray(list, index) {
	    var array = []
	
	    index = index || 0
	
	    for (var i = index || 0; i < list.length; i++) {
	        array[i - index] = list[i]
	    }
	
	    return array
	}


/***/ },
/* 53 */
/***/ function(module, exports) {

	
	/**
	 * Module exports.
	 */
	
	module.exports = on;
	
	/**
	 * Helper for subscriptions.
	 *
	 * @param {Object|EventEmitter} obj with `Emitter` mixin or `EventEmitter`
	 * @param {String} event name
	 * @param {Function} callback
	 * @api public
	 */
	
	function on(obj, ev, fn) {
	  obj.on(ev, fn);
	  return {
	    destroy: function(){
	      obj.removeListener(ev, fn);
	    }
	  };
	}


/***/ },
/* 54 */
/***/ function(module, exports) {

	/**
	 * Slice reference.
	 */
	
	var slice = [].slice;
	
	/**
	 * Bind `obj` to `fn`.
	 *
	 * @param {Object} obj
	 * @param {Function|String} fn or string
	 * @return {Function}
	 * @api public
	 */
	
	module.exports = function(obj, fn){
	  if ('string' == typeof fn) fn = obj[fn];
	  if ('function' != typeof fn) throw new Error('bind() requires a function');
	  var args = slice.call(arguments, 2);
	  return function(){
	    return fn.apply(obj, args.concat(slice.call(arguments)));
	  }
	};


/***/ },
/* 55 */
/***/ function(module, exports) {

	
	/**
	 * HOP ref.
	 */
	
	var has = Object.prototype.hasOwnProperty;
	
	/**
	 * Return own keys in `obj`.
	 *
	 * @param {Object} obj
	 * @return {Array}
	 * @api public
	 */
	
	exports.keys = Object.keys || function(obj){
	  var keys = [];
	  for (var key in obj) {
	    if (has.call(obj, key)) {
	      keys.push(key);
	    }
	  }
	  return keys;
	};
	
	/**
	 * Return own values in `obj`.
	 *
	 * @param {Object} obj
	 * @return {Array}
	 * @api public
	 */
	
	exports.values = function(obj){
	  var vals = [];
	  for (var key in obj) {
	    if (has.call(obj, key)) {
	      vals.push(obj[key]);
	    }
	  }
	  return vals;
	};
	
	/**
	 * Merge `b` into `a`.
	 *
	 * @param {Object} a
	 * @param {Object} b
	 * @return {Object} a
	 * @api public
	 */
	
	exports.merge = function(a, b){
	  for (var key in b) {
	    if (has.call(b, key)) {
	      a[key] = b[key];
	    }
	  }
	  return a;
	};
	
	/**
	 * Return length of `obj`.
	 *
	 * @param {Object} obj
	 * @return {Number}
	 * @api public
	 */
	
	exports.length = function(obj){
	  return exports.keys(obj).length;
	};
	
	/**
	 * Check if `obj` is empty.
	 *
	 * @param {Object} obj
	 * @return {Boolean}
	 * @api public
	 */
	
	exports.isEmpty = function(obj){
	  return 0 == exports.length(obj);
	};

/***/ },
/* 56 */
/***/ function(module, exports) {

	
	/**
	 * Expose `Backoff`.
	 */
	
	module.exports = Backoff;
	
	/**
	 * Initialize backoff timer with `opts`.
	 *
	 * - `min` initial timeout in milliseconds [100]
	 * - `max` max timeout [10000]
	 * - `jitter` [0]
	 * - `factor` [2]
	 *
	 * @param {Object} opts
	 * @api public
	 */
	
	function Backoff(opts) {
	  opts = opts || {};
	  this.ms = opts.min || 100;
	  this.max = opts.max || 10000;
	  this.factor = opts.factor || 2;
	  this.jitter = opts.jitter > 0 && opts.jitter <= 1 ? opts.jitter : 0;
	  this.attempts = 0;
	}
	
	/**
	 * Return the backoff duration.
	 *
	 * @return {Number}
	 * @api public
	 */
	
	Backoff.prototype.duration = function(){
	  var ms = this.ms * Math.pow(this.factor, this.attempts++);
	  if (this.jitter) {
	    var rand =  Math.random();
	    var deviation = Math.floor(rand * this.jitter * ms);
	    ms = (Math.floor(rand * 10) & 1) == 0  ? ms - deviation : ms + deviation;
	  }
	  return Math.min(ms, this.max) | 0;
	};
	
	/**
	 * Reset the number of attempts.
	 *
	 * @api public
	 */
	
	Backoff.prototype.reset = function(){
	  this.attempts = 0;
	};
	
	/**
	 * Set the minimum duration
	 *
	 * @api public
	 */
	
	Backoff.prototype.setMin = function(min){
	  this.ms = min;
	};
	
	/**
	 * Set the maximum duration
	 *
	 * @api public
	 */
	
	Backoff.prototype.setMax = function(max){
	  this.max = max;
	};
	
	/**
	 * Set the jitter
	 *
	 * @api public
	 */
	
	Backoff.prototype.setJitter = function(jitter){
	  this.jitter = jitter;
	};
	


/***/ },
/* 57 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	var ansiRegex = __webpack_require__(58)();
	
	module.exports = function (str) {
		return typeof str === 'string' ? str.replace(ansiRegex, '') : str;
	};


/***/ },
/* 58 */
/***/ function(module, exports) {

	'use strict';
	module.exports = function () {
		return /[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-ORZcf-nqry=><]/g;
	};


/***/ },
/* 59 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }
	
	var _planetMapsDistOlBase = __webpack_require__(60);
	
	var _planetMapsDistOlBase2 = _interopRequireDefault(_planetMapsDistOlBase);
	
	var format = new _planetMapsDistOlBase2['default'].format.GeoJSON();
	
	var source = new _planetMapsDistOlBase2['default'].source.Vector({
	  features: []
	});
	
	var map = new _planetMapsDistOlBase2['default'].Map({
	  target: document.getElementById('map'),
	  layers: [new _planetMapsDistOlBase2['default'].layer.Tile({
	    source: new _planetMapsDistOlBase2['default'].source.XYZ({
	      crossOrigin: 'anonymous',
	      url: 'https://{a-d}.tiles.mapbox.com/v3/planet.he80d477/{z}/{x}/{y}.png'
	    })
	  }), new _planetMapsDistOlBase2['default'].layer.Vector({
	    source: source,
	    style: new _planetMapsDistOlBase2['default'].style.Style({
	      stroke: new _planetMapsDistOlBase2['default'].style.Stroke({
	        color: 'rgba(252,172,32,1)',
	        width: 1.5
	      }),
	      fill: new _planetMapsDistOlBase2['default'].style.Fill({
	        color: 'rgba(252,172,32,0.5)'
	      }),
	      image: new _planetMapsDistOlBase2['default'].style.Circle({
	        radius: 6,
	        fill: new _planetMapsDistOlBase2['default'].style.Fill({
	          color: 'rgba(252,172,32,0.5)'
	        }),
	        stroke: new _planetMapsDistOlBase2['default'].style.Stroke({
	          color: 'rgba(252,172,32,1)',
	          width: 1.5
	        })
	      })
	    })
	  })],
	  view: new _planetMapsDistOlBase2['default'].View({
	    center: [0, 0],
	    zoom: 3
	  })
	});
	
	fetch('http://eonet.sci.gsfc.nasa.gov/api/v2/events?days=20').then(function (response) {
	  return response.json();
	}).then(function (data) {
	  var features = data.events.map(function (event) {
	    var json = {
	      type: 'Feature',
	      id: event.id,
	      properties: {
	        title: event.title,
	        description: event.description,
	        link: event.link
	      },
	      geometry: {
	        type: 'GeometryCollection',
	        geometries: event.geometries.map(function (geometry) {
	          // TODO: file a ticket about the invalid polygon coordinates
	          if (geometry.type === 'Polygon') {
	            geometry.coordinates = [geometry.coordinates];
	          }
	          return geometry;
	        })
	      }
	    };
	    return format.readFeature(json, { featureProjection: 'EPSG:3857' });
	  });
	  source.addFeatures(features);
	});
	
	var element = document.getElementById('overlay');
	
	var overlay = new _planetMapsDistOlBase2['default'].Overlay({
	  element: element,
	  positioning: 'bottom-center',
	  stopEvent: false
	});
	map.addOverlay(overlay);
	
	map.on('pointermove', function (event) {
	  var feature = null;
	  if (!event.dragging) {
	    feature = map.forEachFeatureAtPixel(event.pixel, function (feature) {
	      return feature;
	    });
	  }
	  if (feature) {
	    map.getTarget().style.cursor = 'pointer';
	    element.innerText = feature.get('title');
	    element.style.visibility = 'visible';
	    overlay.setPosition(event.coordinate);
	  } else {
	    element.style.visibility = 'hidden';
	    map.getTarget().style.cursor = '';
	  }
	});
	
	map.on('click', function (event) {
	  var feature = map.forEachFeatureAtPixel(event.pixel, function (feature) {
	    return feature;
	  });
	  if (feature) {
	    window.open(feature.get('link'));
	  }
	});

/***/ },
/* 60 */
/***/ function(module, exports, __webpack_require__) {

	var require;var require;/* WEBPACK VAR INJECTION */(function(global) {// OpenLayers 3. See http://openlayers.org/
	// License: https://raw.githubusercontent.com/openlayers/ol3/master/LICENSE.md
	// Version: v4.0.0
	
	(function (root, factory) {
	  if (true) {
	    module.exports = factory();
	  } else if (typeof define === "function" && define.amd) {
	    define([], factory);
	  } else {
	    root.ol = factory();
	  }
	}(this, function () {
	  var OPENLAYERS = {};
	  var k,aa=aa||{},ba=this;function ca(b){return void 0!==b}function u(b,c,d){b=b.split(".");d=d||ba;b[0]in d||!d.execScript||d.execScript("var "+b[0]);for(var e;b.length&&(e=b.shift());)!b.length&&ca(c)?d[e]=c:d[e]?d=d[e]:d=d[e]={}}function ea(){}
	function ga(b){var c=typeof b;if("object"==c)if(b){if(b instanceof Array)return"array";if(b instanceof Object)return c;var d=Object.prototype.toString.call(b);if("[object Window]"==d)return"object";if("[object Array]"==d||"number"==typeof b.length&&"undefined"!=typeof b.splice&&"undefined"!=typeof b.propertyIsEnumerable&&!b.propertyIsEnumerable("splice"))return"array";if("[object Function]"==d||"undefined"!=typeof b.call&&"undefined"!=typeof b.propertyIsEnumerable&&!b.propertyIsEnumerable("call"))return"function"}else return"null";
	else if("function"==c&&"undefined"==typeof b.call)return"object";return c}function ha(b){return"array"==ga(b)}function ia(b){var c=ga(b);return"array"==c||"object"==c&&"number"==typeof b.length}function ja(b){return"string"==typeof b}function ka(b){return"number"==typeof b}function la(b){return"function"==ga(b)}function ma(b){var c=typeof b;return"object"==c&&null!=b||"function"==c}function pa(b){return b[qa]||(b[qa]=++ra)}var qa="closure_uid_"+(1E9*Math.random()>>>0),ra=0;
	function sa(b,c,d){return b.call.apply(b.bind,arguments)}function ta(b,c,d){if(!b)throw Error();if(2<arguments.length){var e=Array.prototype.slice.call(arguments,2);return function(){var d=Array.prototype.slice.call(arguments);Array.prototype.unshift.apply(d,e);return b.apply(c,d)}}return function(){return b.apply(c,arguments)}}function ua(b,c,d){ua=Function.prototype.bind&&-1!=Function.prototype.bind.toString().indexOf("native code")?sa:ta;return ua.apply(null,arguments)}
	function va(b,c){var d=Array.prototype.slice.call(arguments,1);return function(){var c=d.slice();c.push.apply(c,arguments);return b.apply(this,c)}}var wa=Date.now||function(){return+new Date};function v(b,c){function d(){}d.prototype=c.prototype;b.ca=c.prototype;b.prototype=new d;b.prototype.constructor=b;b.Yi=function(b,d,g){for(var h=Array(arguments.length-2),l=2;l<arguments.length;l++)h[l-2]=arguments[l];return c.prototype[d].apply(b,h)}};function ya(){};function za(b){if(Error.captureStackTrace)Error.captureStackTrace(this,za);else{var c=Error().stack;c&&(this.stack=c)}b&&(this.message=String(b))}v(za,Error);za.prototype.name="CustomError";var Ba;var Ca=String.prototype.trim?function(b){return b.trim()}:function(b){return b.replace(/^[\s\xa0]+|[\s\xa0]+$/g,"")};function Da(b){if(!Ea.test(b))return b;-1!=b.indexOf("&")&&(b=b.replace(Fa,"&amp;"));-1!=b.indexOf("<")&&(b=b.replace(Ga,"&lt;"));-1!=b.indexOf(">")&&(b=b.replace(Ia,"&gt;"));-1!=b.indexOf('"')&&(b=b.replace(Ja,"&quot;"));-1!=b.indexOf("'")&&(b=b.replace(Ka,"&#39;"));-1!=b.indexOf("\x00")&&(b=b.replace(La,"&#0;"));return b}var Fa=/&/g,Ga=/</g,Ia=/>/g,Ja=/"/g,Ka=/'/g,La=/\x00/g,Ea=/[\x00&<>"']/;
	function Ma(b,c){return b<c?-1:b>c?1:0};function Na(b,c,d){return Math.min(Math.max(b,c),d)}function Oa(b,c,d,e){b=d-b;c=e-c;return b*b+c*c};function Pa(b){return function(c){if(c)return[Na(c[0],b[0],b[2]),Na(c[1],b[1],b[3])]}}function Qa(b){return b};var Ra=Array.prototype,Sa=Ra.indexOf?function(b,c,d){return Ra.indexOf.call(b,c,d)}:function(b,c,d){d=null==d?0:0>d?Math.max(0,b.length+d):d;if(ja(b))return ja(c)&&1==c.length?b.indexOf(c,d):-1;for(;d<b.length;d++)if(d in b&&b[d]===c)return d;return-1},Ta=Ra.forEach?function(b,c,d){Ra.forEach.call(b,c,d)}:function(b,c,d){for(var e=b.length,f=ja(b)?b.split(""):b,g=0;g<e;g++)g in f&&c.call(d,f[g],g,b)},Ua=Ra.filter?function(b,c,d){return Ra.filter.call(b,c,d)}:function(b,c,d){for(var e=b.length,f=[],
	g=0,h=ja(b)?b.split(""):b,l=0;l<e;l++)if(l in h){var m=h[l];c.call(d,m,l,b)&&(f[g++]=m)}return f},Wa=Ra.some?function(b,c,d){return Ra.some.call(b,c,d)}:function(b,c,d){for(var e=b.length,f=ja(b)?b.split(""):b,g=0;g<e;g++)if(g in f&&c.call(d,f[g],g,b))return!0;return!1};function Xa(b){var c;a:{c=Ya;for(var d=b.length,e=ja(b)?b.split(""):b,f=0;f<d;f++)if(f in e&&c.call(void 0,e[f],f,b)){c=f;break a}c=-1}return 0>c?null:ja(b)?b.charAt(c):b[c]}
	function Za(b,c){var d=Sa(b,c),e;(e=0<=d)&&Ra.splice.call(b,d,1);return e}function $a(b){return Ra.concat.apply(Ra,arguments)}function ab(b){var c=b.length;if(0<c){for(var d=Array(c),e=0;e<c;e++)d[e]=b[e];return d}return[]}function bb(b,c){for(var d=1;d<arguments.length;d++){var e=arguments[d];if(ia(e)){var f=b.length||0,g=e.length||0;b.length=f+g;for(var h=0;h<g;h++)b[f+h]=e[h]}else b.push(e)}}function cb(b,c,d,e){Ra.splice.apply(b,db(arguments,1))}
	function db(b,c,d){return 2>=arguments.length?Ra.slice.call(b,c):Ra.slice.call(b,c,d)}function eb(b,c){b.sort(c||fb)}function gb(b){for(var c=hb,d=0;d<b.length;d++)b[d]={index:d,value:b[d]};var e=c||fb;eb(b,function(b,c){return e(b.value,c.value)||b.index-c.index});for(d=0;d<b.length;d++)b[d]=b[d].value}function ib(b,c){if(!ia(b)||!ia(c)||b.length!=c.length)return!1;for(var d=b.length,e=jb,f=0;f<d;f++)if(!e(b[f],c[f]))return!1;return!0}function fb(b,c){return b>c?1:b<c?-1:0}
	function jb(b,c){return b===c};function kb(b,c,d){var e=b.length;if(b[0]<=c)return 0;if(!(c<=b[e-1]))if(0<d)for(d=1;d<e;++d){if(b[d]<c)return d-1}else if(0>d)for(d=1;d<e;++d){if(b[d]<=c)return d}else for(d=1;d<e;++d){if(b[d]==c)return d;if(b[d]<c)return b[d-1]-c<c-b[d]?d-1:d}return e-1};function lb(b){return function(c,d,e){if(void 0!==c)return c=kb(b,c,e),c=Na(c+d,0,b.length-1),b[c]}}function mb(b,c,d){return function(e,f,g){if(void 0!==e)return e=Math.max(Math.floor(Math.log(c/e)/Math.log(b)+(0<g?0:0>g?1:.5))+f,0),void 0!==d&&(e=Math.min(e,d)),c/Math.pow(b,e)}};function nb(b,c){var d=b%c;return 0>d*c?d+c:d}function pb(b,c,d){return b+d*(c-b)};function qb(b){if(void 0!==b)return 0}function rb(b,c){if(void 0!==b)return b+c}function sb(b){var c=2*Math.PI/b;return function(b,e){if(void 0!==b)return b=Math.floor((b+e)/c+.5)*c}}function tb(){var b=5*Math.PI/180;return function(c,d){if(void 0!==c)return Math.abs(c+d)<=b?0:c+d}};function ub(b,c,d){this.center=b;this.resolution=c;this.rotation=d};var vb;a:{var wb=ba.navigator;if(wb){var xb=wb.userAgent;if(xb){vb=xb;break a}}vb=""}function yb(b){return-1!=vb.indexOf(b)};function zb(b,c,d){for(var e in b)c.call(d,b[e],e,b)}function Ab(b,c){for(var d in b)if(c.call(void 0,b[d],d,b))return!0;return!1}function Bb(b){var c=0,d;for(d in b)c++;return c}function Cb(b){var c=[],d=0,e;for(e in b)c[d++]=b[e];return c}function Db(b){var c=[],d=0,e;for(e in b)c[d++]=e;return c}function Eb(b){for(var c in b)return!1;return!0}function Fb(b){for(var c in b)delete b[c]}function Gb(b){var c={},d;for(d in b)c[d]=b[d];return c}
	function Hb(b){var c=ga(b);if("object"==c||"array"==c){if(la(b.clone))return b.clone();var c="array"==c?[]:{},d;for(d in b)c[d]=Hb(b[d]);return c}return b}var Ib="constructor hasOwnProperty isPrototypeOf propertyIsEnumerable toLocaleString toString valueOf".split(" ");function Jb(b,c){for(var d,e,f=1;f<arguments.length;f++){e=arguments[f];for(d in e)b[d]=e[d];for(var g=0;g<Ib.length;g++)d=Ib[g],Object.prototype.hasOwnProperty.call(e,d)&&(b[d]=e[d])}};var Kb=yb("Opera")||yb("OPR"),Lb=yb("Trident")||yb("MSIE"),Mb=yb("Edge"),Nb=yb("Gecko")&&!(-1!=vb.toLowerCase().indexOf("webkit")&&!yb("Edge"))&&!(yb("Trident")||yb("MSIE"))&&!yb("Edge"),Pb=-1!=vb.toLowerCase().indexOf("webkit")&&!yb("Edge"),Qb=yb("Macintosh"),Rb=yb("Windows"),Sb=yb("Linux")||yb("CrOS");function Tb(){var b=vb;if(Nb)return/rv\:([^\);]+)(\)|;)/.exec(b);if(Mb)return/Edge\/([\d\.]+)/.exec(b);if(Lb)return/\b(?:MSIE|rv)[: ]([^\);]+)(\)|;)/.exec(b);if(Pb)return/WebKit\/(\S+)/.exec(b)}
	function Ub(){var b=ba.document;return b?b.documentMode:void 0}var Vb=function(){if(Kb&&ba.opera){var b;var c=ba.opera.version;try{b=c()}catch(d){b=c}return b}b="";(c=Tb())&&(b=c?c[1]:"");return Lb&&(c=Ub(),c>parseFloat(b))?String(c):b}(),Wb={};
	function Xb(b){var c;if(!(c=Wb[b])){c=0;for(var d=Ca(String(Vb)).split("."),e=Ca(String(b)).split("."),f=Math.max(d.length,e.length),g=0;0==c&&g<f;g++){var h=d[g]||"",l=e[g]||"",m=RegExp("(\\d*)(\\D*)","g"),n=RegExp("(\\d*)(\\D*)","g");do{var p=m.exec(h)||["","",""],q=n.exec(l)||["","",""];if(0==p[0].length&&0==q[0].length)break;c=Ma(0==p[1].length?0:parseInt(p[1],10),0==q[1].length?0:parseInt(q[1],10))||Ma(0==p[2].length,0==q[2].length)||Ma(p[2],q[2])}while(0==c)}c=Wb[b]=0<=c}return c}
	var Yb=ba.document,Zb=Yb&&Lb?Ub()||("CSS1Compat"==Yb.compatMode?parseInt(Vb,10):5):void 0;var $b=!Lb||9<=Zb,ac=!Lb||9<=Zb,bc=Lb&&!Xb("9");!Pb||Xb("528");Nb&&Xb("1.9b")||Lb&&Xb("8")||Kb&&Xb("9.5")||Pb&&Xb("528");Nb&&!Xb("8")||Lb&&Xb("9");function cc(){0!=dc&&(ec[pa(this)]=this);this.H=this.H;this.L=this.L}var dc=0,ec={};cc.prototype.H=!1;cc.prototype.Xc=function(){if(!this.H&&(this.H=!0,this.K(),0!=dc)){var b=pa(this);delete ec[b]}};function fc(b,c){var d=va(gc,c);b.H?d.call(void 0):(b.L||(b.L=[]),b.L.push(ca(void 0)?ua(d,void 0):d))}cc.prototype.K=function(){if(this.L)for(;this.L.length;)this.L.shift()()};function gc(b){b&&"function"==typeof b.Xc&&b.Xc()};function hc(b,c){this.type=b;this.f=this.target=c;this.h=!1;this.Be=!0}hc.prototype.l=function(){this.h=!0};hc.prototype.preventDefault=function(){this.Be=!1};function ic(b){b.l()};var jc=Lb?"focusout":"DOMFocusOut";function kc(b){kc[" "](b);return b}kc[" "]=ea;function lc(b,c){hc.call(this,b?b.type:"");this.relatedTarget=this.f=this.target=null;this.o=this.c=this.button=this.screenY=this.screenX=this.clientY=this.clientX=this.offsetY=this.offsetX=0;this.H=this.g=this.b=this.j=!1;this.state=null;this.i=!1;this.a=null;if(b){var d=this.type=b.type,e=b.changedTouches?b.changedTouches[0]:null;this.target=b.target||b.srcElement;this.f=c;var f=b.relatedTarget;if(f){if(Nb){var g;a:{try{kc(f.nodeName);g=!0;break a}catch(h){}g=!1}g||(f=null)}}else"mouseover"==d?
	f=b.fromElement:"mouseout"==d&&(f=b.toElement);this.relatedTarget=f;null===e?(this.offsetX=Pb||void 0!==b.offsetX?b.offsetX:b.layerX,this.offsetY=Pb||void 0!==b.offsetY?b.offsetY:b.layerY,this.clientX=void 0!==b.clientX?b.clientX:b.pageX,this.clientY=void 0!==b.clientY?b.clientY:b.pageY,this.screenX=b.screenX||0,this.screenY=b.screenY||0):(this.clientX=void 0!==e.clientX?e.clientX:e.pageX,this.clientY=void 0!==e.clientY?e.clientY:e.pageY,this.screenX=e.screenX||0,this.screenY=e.screenY||0);this.button=
	b.button;this.c=b.keyCode||0;this.o=b.charCode||("keypress"==d?b.keyCode:0);this.j=b.ctrlKey;this.b=b.altKey;this.g=b.shiftKey;this.H=b.metaKey;this.i=Qb?b.metaKey:b.ctrlKey;this.state=b.state;this.a=b;b.defaultPrevented&&this.preventDefault()}}v(lc,hc);var mc=[1,4,2];function nc(b){return($b?0==b.a.button:"click"==b.type?!0:!!(b.a.button&mc[0]))&&!(Pb&&Qb&&b.j)}lc.prototype.l=function(){lc.ca.l.call(this);this.a.stopPropagation?this.a.stopPropagation():this.a.cancelBubble=!0};
	lc.prototype.preventDefault=function(){lc.ca.preventDefault.call(this);var b=this.a;if(b.preventDefault)b.preventDefault();else if(b.returnValue=!1,bc)try{if(b.ctrlKey||112<=b.keyCode&&123>=b.keyCode)b.keyCode=-1}catch(c){}};var oc="closure_listenable_"+(1E6*Math.random()|0);function pc(b){return!(!b||!b[oc])}var qc=0;function rc(b,c,d,e,f){this.listener=b;this.a=null;this.src=c;this.type=d;this.rb=!!e;this.nc=f;this.key=++qc;this.kb=this.Yb=!1}function sc(b){b.kb=!0;b.listener=null;b.a=null;b.src=null;b.nc=null};function tc(b){this.src=b;this.a={};this.b=0}tc.prototype.add=function(b,c,d,e,f){var g=b.toString();b=this.a[g];b||(b=this.a[g]=[],this.b++);var h=uc(b,c,e,f);-1<h?(c=b[h],d||(c.Yb=!1)):(c=new rc(c,this.src,g,!!e,f),c.Yb=d,b.push(c));return c};tc.prototype.remove=function(b,c,d,e){b=b.toString();if(!(b in this.a))return!1;var f=this.a[b];c=uc(f,c,d,e);return-1<c?(sc(f[c]),Ra.splice.call(f,c,1),0==f.length&&(delete this.a[b],this.b--),!0):!1};
	function vc(b,c){var d=c.type;if(!(d in b.a))return!1;var e=Za(b.a[d],c);e&&(sc(c),0==b.a[d].length&&(delete b.a[d],b.b--));return e}function wc(b,c,d,e,f){b=b.a[c.toString()];c=-1;b&&(c=uc(b,d,e,f));return-1<c?b[c]:null}function xc(b,c,d){var e=ca(c),f=e?c.toString():"",g=ca(d);return Ab(b.a,function(b){for(var c=0;c<b.length;++c)if(!(e&&b[c].type!=f||g&&b[c].rb!=d))return!0;return!1})}
	function uc(b,c,d,e){for(var f=0;f<b.length;++f){var g=b[f];if(!g.kb&&g.listener==c&&g.rb==!!d&&g.nc==e)return f}return-1};var yc="closure_lm_"+(1E6*Math.random()|0),zc={},Ac=0;function w(b,c,d,e,f){if(ha(c)){for(var g=0;g<c.length;g++)w(b,c[g],d,e,f);return null}d=Bc(d);return pc(b)?b.Ua(c,d,e,f):Cc(b,c,d,!1,e,f)}
	function Cc(b,c,d,e,f,g){if(!c)throw Error("Invalid event type");var h=!!f,l=Dc(b);l||(b[yc]=l=new tc(b));d=l.add(c,d,e,f,g);if(d.a)return d;e=Ec();d.a=e;e.src=b;e.listener=d;if(b.addEventListener)b.addEventListener(c.toString(),e,h);else if(b.attachEvent)b.attachEvent(Fc(c.toString()),e);else throw Error("addEventListener and attachEvent are unavailable.");Ac++;return d}
	function Ec(){var b=Gc,c=ac?function(d){return b.call(c.src,c.listener,d)}:function(d){d=b.call(c.src,c.listener,d);if(!d)return d};return c}function Hc(b,c,d,e,f){if(ha(c)){for(var g=0;g<c.length;g++)Hc(b,c[g],d,e,f);return null}d=Bc(d);return pc(b)?b.wa.add(String(c),d,!0,e,f):Cc(b,c,d,!0,e,f)}function Ic(b,c,d,e,f){if(ha(c))for(var g=0;g<c.length;g++)Ic(b,c[g],d,e,f);else d=Bc(d),pc(b)?b.Ad(c,d,e,f):b&&(b=Dc(b))&&(c=wc(b,c,d,!!e,f))&&Jc(c)}
	function Jc(b){if(ka(b)||!b||b.kb)return!1;var c=b.src;if(pc(c))return vc(c.wa,b);var d=b.type,e=b.a;c.removeEventListener?c.removeEventListener(d,e,b.rb):c.detachEvent&&c.detachEvent(Fc(d),e);Ac--;(d=Dc(c))?(vc(d,b),0==d.b&&(d.src=null,c[yc]=null)):sc(b);return!0}function Fc(b){return b in zc?zc[b]:zc[b]="on"+b}function Lc(b,c,d,e){var f=!0;if(b=Dc(b))if(c=b.a[c.toString()])for(c=c.concat(),b=0;b<c.length;b++){var g=c[b];g&&g.rb==d&&!g.kb&&(g=Mc(g,e),f=f&&!1!==g)}return f}
	function Mc(b,c){var d=b.listener,e=b.nc||b.src;b.Yb&&Jc(b);return d.call(e,c)}
	function Gc(b,c){if(b.kb)return!0;if(!ac){var d;if(!(d=c))a:{d=["window","event"];for(var e=ba,f;f=d.shift();)if(null!=e[f])e=e[f];else{d=null;break a}d=e}f=d;d=new lc(f,this);e=!0;if(!(0>f.keyCode||void 0!=f.returnValue)){a:{var g=!1;if(0==f.keyCode)try{f.keyCode=-1;break a}catch(m){g=!0}if(g||void 0==f.returnValue)f.returnValue=!0}f=[];for(g=d.f;g;g=g.parentNode)f.push(g);for(var g=b.type,h=f.length-1;!d.h&&0<=h;h--){d.f=f[h];var l=Lc(f[h],g,!0,d),e=e&&l}for(h=0;!d.h&&h<f.length;h++)d.f=f[h],l=
	Lc(f[h],g,!1,d),e=e&&l}return e}return Mc(b,new lc(c,this))}function Dc(b){b=b[yc];return b instanceof tc?b:null}var Nc="__closure_events_fn_"+(1E9*Math.random()>>>0);function Bc(b){if(la(b))return b;b[Nc]||(b[Nc]=function(c){return b.handleEvent(c)});return b[Nc]};function Oc(){cc.call(this);this.wa=new tc(this);this.Sb=this;this.Da=null}v(Oc,cc);Oc.prototype[oc]=!0;k=Oc.prototype;k.addEventListener=function(b,c,d,e){w(this,b,c,d,e)};k.removeEventListener=function(b,c,d,e){Ic(this,b,c,d,e)};
	function y(b,c){var d,e=b.Da;if(e)for(d=[];e;e=e.Da)d.push(e);var e=b.Sb,f=c,g=f.type||f;if(ja(f))f=new hc(f,e);else if(f instanceof hc)f.target=f.target||e;else{var h=f,f=new hc(g,e);Jb(f,h)}var h=!0,l;if(d)for(var m=d.length-1;!f.h&&0<=m;m--)l=f.f=d[m],h=Pc(l,g,!0,f)&&h;f.h||(l=f.f=e,h=Pc(l,g,!0,f)&&h,f.h||(h=Pc(l,g,!1,f)&&h));if(d)for(m=0;!f.h&&m<d.length;m++)l=f.f=d[m],h=Pc(l,g,!1,f)&&h;return h}
	k.K=function(){Oc.ca.K.call(this);if(this.wa){var b=this.wa,c=0,d;for(d in b.a){for(var e=b.a[d],f=0;f<e.length;f++)++c,sc(e[f]);delete b.a[d];b.b--}}this.Da=null};k.Ua=function(b,c,d,e){return this.wa.add(String(b),c,!1,d,e)};k.Ad=function(b,c,d,e){return this.wa.remove(String(b),c,d,e)};
	function Pc(b,c,d,e){c=b.wa.a[String(c)];if(!c)return!0;c=c.concat();for(var f=!0,g=0;g<c.length;++g){var h=c[g];if(h&&!h.kb&&h.rb==d){var l=h.listener,m=h.nc||h.src;h.Yb&&vc(b.wa,h);f=!1!==l.call(m,e)&&f}}return f&&0!=e.Be}function Qc(b,c,d){return xc(b.wa,ca(c)?String(c):void 0,d)};function Rc(){Oc.call(this);this.g=0}v(Rc,Oc);k=Rc.prototype;k.s=function(){++this.g;y(this,"change")};k.S=function(){return this.g};k.T=function(b,c,d){return w(this,b,c,!1,d)};k.U=function(b,c,d){return Hc(this,b,c,!1,d)};k.V=function(b,c,d){Ic(this,b,c,!1,d)};k.W=function(b){Jc(b)};function Sc(b,c,d){hc.call(this,b);this.key=c;this.oldValue=d}v(Sc,hc);function Tc(b){Rc.call(this);pa(this);this.l={};void 0!==b&&this.I(b)}v(Tc,Rc);var Uc={};function Vc(b){return Uc.hasOwnProperty(b)?Uc[b]:Uc[b]="change:"+b}k=Tc.prototype;k.get=function(b){var c;this.l.hasOwnProperty(b)&&(c=this.l[b]);return c};k.G=function(){return Object.keys(this.l)};k.O=function(){var b={},c;for(c in this.l)b[c]=this.l[c];return b};
	function Wc(b,c,d){var e;e=Vc(c);y(b,new Sc(e,c,d));y(b,new Sc("propertychange",c,d))}k.B=function(b,c){var d=this.l[b];this.l[b]=c;Wc(this,b,d)};k.I=function(b){for(var c in b)this.B(c,b[c])};k.X=function(b){if(b in this.l){var c=this.l[b];delete this.l[b];Wc(this,b,c)}};function Xc(b,c){if(ha(b))return b;void 0===c?c=[b,b]:(c[0]=b,c[1]=b);return c};function Yc(b,c){b[0]+=c[0];b[1]+=c[1]}function Zc(b,c){var d=Math.cos(c),e=Math.sin(c),f=b[1]*d+b[0]*e;b[0]=b[0]*d-b[1]*e;b[1]=f};function $c(b){this.length=b.length||b;for(var c=0;c<this.length;c++)this[c]=b[c]||0}$c.prototype.a=4;$c.prototype.b=function(b,c){c=c||0;for(var d=0;d<b.length&&c+d<this.length;d++)this[c+d]=b[d]};$c.prototype.toString=Array.prototype.join;"undefined"==typeof Float32Array&&($c.BYTES_PER_ELEMENT=4,$c.prototype.BYTES_PER_ELEMENT=$c.prototype.a,$c.prototype.set=$c.prototype.b,$c.prototype.toString=$c.prototype.toString,u("Float32Array",$c,void 0));function ad(b){this.length=b.length||b;for(var c=0;c<this.length;c++)this[c]=b[c]||0}ad.prototype.a=8;ad.prototype.b=function(b,c){c=c||0;for(var d=0;d<b.length&&c+d<this.length;d++)this[c+d]=b[d]};ad.prototype.toString=Array.prototype.join;if("undefined"==typeof Float64Array){try{ad.BYTES_PER_ELEMENT=8}catch(b){}ad.prototype.BYTES_PER_ELEMENT=ad.prototype.a;ad.prototype.set=ad.prototype.b;ad.prototype.toString=ad.prototype.toString;u("Float64Array",ad,void 0)};function bd(){var b=Array(16);b[0]=0;b[1]=0;b[2]=0;b[3]=0;b[4]=0;b[5]=0;b[6]=0;b[7]=0;b[8]=0;b[9]=0;b[10]=0;b[11]=0;b[12]=0;b[13]=0;b[14]=0;b[15]=0;return b}
	function cd(b,c){var d=b[0],e=b[1],f=b[2],g=b[3],h=b[4],l=b[5],m=b[6],n=b[7],p=b[8],q=b[9],r=b[10],t=b[11],A=b[12],K=b[13],U=b[14],x=b[15],L=d*l-e*h,V=d*m-f*h,X=d*n-g*h,da=e*m-f*l,oa=e*n-g*l,na=f*n-g*m,fa=p*K-q*A,S=p*U-r*A,I=p*x-t*A,xa=q*U-r*K,Ha=q*x-t*K,Va=r*x-t*U,Aa=L*Va-V*Ha+X*xa+da*I-oa*S+na*fa;0!=Aa&&(Aa=1/Aa,c[0]=(l*Va-m*Ha+n*xa)*Aa,c[1]=(-e*Va+f*Ha-g*xa)*Aa,c[2]=(K*na-U*oa+x*da)*Aa,c[3]=(-q*na+r*oa-t*da)*Aa,c[4]=(-h*Va+m*I-n*S)*Aa,c[5]=(d*Va-f*I+g*S)*Aa,c[6]=(-A*na+U*X-x*V)*Aa,c[7]=(p*na-r*
	X+t*V)*Aa,c[8]=(h*Ha-l*I+n*fa)*Aa,c[9]=(-d*Ha+e*I-g*fa)*Aa,c[10]=(A*oa-K*X+x*L)*Aa,c[11]=(-p*oa+q*X-t*L)*Aa,c[12]=(-h*xa+l*S-m*fa)*Aa,c[13]=(d*xa-e*S+f*fa)*Aa,c[14]=(-A*da+K*V-U*L)*Aa,c[15]=(p*da-q*V+r*L)*Aa)}function dd(b,c,d){var e=b[1]*c+b[5]*d+0*b[9]+b[13],f=b[2]*c+b[6]*d+0*b[10]+b[14],g=b[3]*c+b[7]*d+0*b[11]+b[15];b[12]=b[0]*c+b[4]*d+0*b[8]+b[12];b[13]=e;b[14]=f;b[15]=g}new Float64Array(3);new Float64Array(3);new Float64Array(4);new Float64Array(4);new Float64Array(4);new Float64Array(16);function ed(b,c,d){var e=Math.min.apply(null,b),f=Math.min.apply(null,c);b=Math.max.apply(null,b);c=Math.max.apply(null,c);return fd(e,f,b,c,d)}function gd(b,c,d){return d?(d[0]=b[0]-c,d[1]=b[1]-c,d[2]=b[2]+c,d[3]=b[3]+c,d):[b[0]-c,b[1]-c,b[2]+c,b[3]+c]}function hd(b,c){return c?(c[0]=b[0],c[1]=b[1],c[2]=b[2],c[3]=b[3],c):b.slice()}function id(b,c,d){c=c<b[0]?b[0]-c:b[2]<c?c-b[2]:0;b=d<b[1]?b[1]-d:b[3]<d?d-b[3]:0;return c*c+b*b}function jd(b,c){return kd(b,c[0],c[1])}
	function ld(b,c){return b[0]<=c[0]&&c[2]<=b[2]&&b[1]<=c[1]&&c[3]<=b[3]}function kd(b,c,d){return b[0]<=c&&c<=b[2]&&b[1]<=d&&d<=b[3]}function md(b,c){var d=b[1],e=b[2],f=b[3],g=c[0],h=c[1],l=0;g<b[0]?l=l|16:g>e&&(l=l|4);h<d?l|=8:h>f&&(l|=2);0===l&&(l=1);return l}function nd(){return[Infinity,Infinity,-Infinity,-Infinity]}function fd(b,c,d,e,f){return f?(f[0]=b,f[1]=c,f[2]=d,f[3]=e,f):[b,c,d,e]}function od(b,c){return b[0]==c[0]&&b[2]==c[2]&&b[1]==c[1]&&b[3]==c[3]}
	function pd(b,c){c[0]<b[0]&&(b[0]=c[0]);c[2]>b[2]&&(b[2]=c[2]);c[1]<b[1]&&(b[1]=c[1]);c[3]>b[3]&&(b[3]=c[3]);return b}function td(b,c){c[0]<b[0]&&(b[0]=c[0]);c[0]>b[2]&&(b[2]=c[0]);c[1]<b[1]&&(b[1]=c[1]);c[1]>b[3]&&(b[3]=c[1])}function ud(b,c,d,e,f){for(;d<e;d+=f){var g=b,h=c[d],l=c[d+1];g[0]=Math.min(g[0],h);g[1]=Math.min(g[1],l);g[2]=Math.max(g[2],h);g[3]=Math.max(g[3],l)}return b}
	function vd(b,c,d){var e;return(e=c.call(d,wd(b)))||(e=c.call(d,xd(b)))||(e=c.call(d,yd(b)))?e:(e=c.call(d,zd(b)))?e:!1}function wd(b){return[b[0],b[1]]}function xd(b){return[b[2],b[1]]}function Ad(b){return[(b[0]+b[2])/2,(b[1]+b[3])/2]}function Bd(b,c,d,e){var f=c*e[0]/2;e=c*e[1]/2;c=Math.cos(d);d=Math.sin(d);f=[-f,-f,f,f];e=[-e,e,-e,e];var g,h,l;for(g=0;4>g;++g)h=f[g],l=e[g],f[g]=b[0]+h*c-l*d,e[g]=b[1]+h*d+l*c;return ed(f,e,void 0)}function Cd(b){return b[3]-b[1]}
	function Dd(b,c,d){d=d?d:nd();Ed(b,c)&&(d[0]=b[0]>c[0]?b[0]:c[0],d[1]=b[1]>c[1]?b[1]:c[1],d[2]=b[2]<c[2]?b[2]:c[2],d[3]=b[3]<c[3]?b[3]:c[3]);return d}function zd(b){return[b[0],b[3]]}function yd(b){return[b[2],b[3]]}function Fd(b){return b[2]-b[0]}function Ed(b,c){return b[0]<=c[2]&&b[2]>=c[0]&&b[1]<=c[3]&&b[3]>=c[1]}function Gd(b){return b[2]<b[0]||b[3]<b[1]}function Hd(b,c,d){b=[b[0],b[1],b[0],b[3],b[2],b[1],b[2],b[3]];c(b,b,2);return ed([b[0],b[2],b[4],b[6]],[b[1],b[3],b[5],b[7]],d)};function Id(b){return function(){return b}}var Jd=Id(!1),Kd=Id(!0),Ld=Id(null);function Md(b){return b}function Nd(b){var c;c=c||0;return function(){return b.apply(this,Array.prototype.slice.call(arguments,0,c))}}function Od(b){var c=arguments,d=c.length;return function(){for(var b=0;b<d;b++)if(!c[b].apply(this,arguments))return!1;return!0}};/*
	
	 Latitude/longitude spherical geodesy formulae taken from
	 http://www.movable-type.co.uk/scripts/latlong.html
	 Licensed under CC-BY-3.0.
	*/
	function Pd(b){this.radius=b}function Qd(b,c){var d=b[1]*Math.PI/180,e=c[1]*Math.PI/180,f=(e-d)/2,g=(c[0]-b[0])*Math.PI/180/2,d=Math.sin(f)*Math.sin(f)+Math.sin(g)*Math.sin(g)*Math.cos(d)*Math.cos(e);return 2*Rd.radius*Math.atan2(Math.sqrt(d),Math.sqrt(1-d))}
	Pd.prototype.offset=function(b,c,d){var e=b[1]*Math.PI/180;c/=this.radius;var f=Math.asin(Math.sin(e)*Math.cos(c)+Math.cos(e)*Math.sin(c)*Math.cos(d));return[180*(b[0]*Math.PI/180+Math.atan2(Math.sin(d)*Math.sin(c)*Math.cos(e),Math.cos(c)-Math.sin(e)*Math.sin(f)))/Math.PI,180*f/Math.PI]};var Rd=new Pd(6370997);var Sd={};Sd.degrees=2*Math.PI*Rd.radius/360;Sd.ft=.3048;Sd.m=1;Sd["us-ft"]=1200/3937;function Td(b){this.a=b.code;this.b=b.units;this.f=void 0!==b.extent?b.extent:null;this.i=void 0!==b.worldExtent?b.worldExtent:null;this.c=void 0!==b.global?b.global:!1;this.g=!(!this.c||!this.f);this.l=void 0!==b.getPointResolution?b.getPointResolution:this.Pf;this.h=null}k=Td.prototype;k.wf=function(){return this.a};k.v=function(){return this.f};k.Vf=function(){return this.b};k.dd=function(){return Sd[this.b]};
	k.Xf=function(){return this.i};k.zg=function(){return this.c};k.ri=function(b){this.c=b;this.g=!(!b||!this.f)};k.lh=function(b){this.f=b;this.g=!(!this.c||!b)};k.Di=function(b){this.i=b};k.pi=function(b){this.l=b};k.Pf=function(b,c){if("degrees"==this.b)return b;var d=Ud(this,Vd("EPSG:4326")),e=[c[0]-b/2,c[1],c[0]+b/2,c[1],c[0],c[1]-b/2,c[0],c[1]+b/2],e=d(e,e,2),d=(Qd(e.slice(0,2),e.slice(2,4))+Qd(e.slice(4,6),e.slice(6,8)))/2,e=this.dd();void 0!==e&&(d/=e);return d};
	k.getPointResolution=function(b,c){return this.l(b,c)};var Wd={},Xd={};function Yd(b){Zd(b);b.forEach(function(c){b.forEach(function(b){c!==b&&$d(c,b,ae)})})}function be(){var b=ce,c=de,d=ee;fe.forEach(function(e){b.forEach(function(b){$d(e,b,c);$d(b,e,d)})})}function ge(b){Wd[b.a]=b;$d(b,b,ae)}function Zd(b){var c=[];b.forEach(function(b){c.push(ge(b))})}function he(b){return b?ja(b)?Vd(b):b:Vd("EPSG:3857")}function $d(b,c,d){b=b.a;c=c.a;b in Xd||(Xd[b]={});Xd[b][c]=d}
	function ie(b){return function(c,d,e){var f=c.length;e=void 0!==e?e:2;d=void 0!==d?d:Array(f);var g,h;for(h=0;h<f;h+=e)for(g=b([c[h],c[h+1]]),d[h]=g[0],d[h+1]=g[1],g=e-1;2<=g;--g)d[h+g]=c[h+g];return d}}function Vd(b){var c;b instanceof Td?c=b:ja(b)?c=Wd[b]:c=null;return c}function je(b,c){var d=Vd(b),e=Vd(c);return Ud(d,e)}function Ud(b,c){var d=b.a,e=c.a,f;d in Xd&&e in Xd[d]&&(f=Xd[d][e]);void 0===f&&(f=ke);return f}
	function ke(b,c){if(void 0!==c&&b!==c){for(var d=0,e=b.length;d<e;++d)c[d]=b[d];b=c}return b}function ae(b,c){var d;if(void 0!==c){d=0;for(var e=b.length;d<e;++d)c[d]=b[d];d=c}else d=b.slice();return d}function le(b,c,d){return je(c,d)(b,void 0,b.length)}function me(b,c,d){c=je(c,d);return Hd(b,c)};function ne(){Tc.call(this);this.C=nd();this.w=-1;this.i={};this.u=this.j=0}v(ne,Tc);k=ne.prototype;k.qa=function(b,c){var d=c?c:[NaN,NaN];this.pa(b[0],b[1],d,Infinity);return d};k.Pd=function(b){return this.Va(b[0],b[1])};k.Va=Jd;k.v=function(b){this.w!=this.g&&(this.C=this.$b(this.C),this.w=this.g);var c=this.C;b?(b[0]=c[0],b[1]=c[1],b[2]=c[2],b[3]=c[3]):b=c;return b};k.ua=function(b){return this.jc(b*b)};k.oa=function(b,c){this.qb(je(b,c));return this};function oe(b,c,d,e,f,g){var h=f[0],l=f[1],m=f[4],n=f[5],p=f[12];f=f[13];for(var q=g?g:[],r=0;c<d;c+=e){var t=b[c],A=b[c+1];q[r++]=h*t+m*A+p;q[r++]=l*t+n*A+f}g&&q.length!=r&&(q.length=r);return q};function z(){ne.call(this);this.c="XY";this.b=2;this.a=null}v(z,ne);function pe(b){if("XY"==b)return 2;if("XYZ"==b||"XYM"==b)return 3;if("XYZM"==b)return 4}k=z.prototype;k.Va=Jd;k.$b=function(b){var c=this.a,d=this.a.length,e=this.b;b=fd(Infinity,Infinity,-Infinity,-Infinity,b);return ud(b,c,0,d,e)};k.Fa=function(){return this.a.slice(0,this.b)};k.Ga=function(){return this.a.slice(this.a.length-this.b)};k.Ha=function(){return this.c};
	k.jc=function(b){this.u!=this.g&&(Fb(this.i),this.j=0,this.u=this.g);if(0>b||0!==this.j&&b<=this.j)return this;var c=b.toString();if(this.i.hasOwnProperty(c))return this.i[c];var d=this.gb(b);if(d.a.length<this.a.length)return this.i[c]=d;this.j=b;return this};k.gb=function(){return this};function qe(b,c,d){b.b=pe(c);b.c=c;b.a=d}function re(b,c,d,e){if(c)d=pe(c);else{for(c=0;c<e;++c){if(0===d.length){b.c="XY";b.b=2;return}d=d[0]}d=d.length;c=2==d?"XY":3==d?"XYZ":4==d?"XYZM":void 0}b.c=c;b.b=d}
	k.qb=function(b){this.a&&(b(this.a,this.a,this.b),this.s())};k.vc=function(b,c){var d=this.a;if(d){var e=d.length,f=this.b,g=d?d:[],h=0,l,m;for(l=0;l<e;l+=f)for(g[h++]=d[l]+b,g[h++]=d[l+1]+c,m=l+2;m<l+f;++m)g[h++]=d[m];d&&g.length!=h&&(g.length=h);this.s()}};function se(b,c,d,e){for(var f=0,g=b[d-e],h=b[d-e+1];c<d;c+=e)var l=b[c],m=b[c+1],f=f+(h*l-g*m),g=l,h=m;return f/2}function te(b,c,d,e){var f=0,g,h;g=0;for(h=d.length;g<h;++g){var l=d[g],f=f+se(b,c,l,e);c=l}return f};function ue(b,c,d,e,f,g,h){var l=b[c],m=b[c+1],n=b[d]-l,p=b[d+1]-m;if(0!==n||0!==p)if(g=((f-l)*n+(g-m)*p)/(n*n+p*p),1<g)c=d;else if(0<g){for(f=0;f<e;++f)h[f]=pb(b[c+f],b[d+f],g);h.length=e;return}for(f=0;f<e;++f)h[f]=b[c+f];h.length=e}function ve(b,c,d,e,f){var g=b[c],h=b[c+1];for(c+=e;c<d;c+=e){var l=b[c],m=b[c+1],g=Oa(g,h,l,m);g>f&&(f=g);g=l;h=m}return f}function we(b,c,d,e,f){var g,h;g=0;for(h=d.length;g<h;++g){var l=d[g];f=ve(b,c,l,e,f);c=l}return f}
	function xe(b,c,d,e,f,g,h,l,m,n,p){if(c==d)return n;var q;if(0===f){q=Oa(h,l,b[c],b[c+1]);if(q<n){for(p=0;p<e;++p)m[p]=b[c+p];m.length=e;return q}return n}for(var r=p?p:[NaN,NaN],t=c+e;t<d;)if(ue(b,t-e,t,e,h,l,r),q=Oa(h,l,r[0],r[1]),q<n){n=q;for(p=0;p<e;++p)m[p]=r[p];m.length=e;t+=e}else t+=e*Math.max((Math.sqrt(q)-Math.sqrt(n))/f|0,1);if(g&&(ue(b,d-e,c,e,h,l,r),q=Oa(h,l,r[0],r[1]),q<n)){n=q;for(p=0;p<e;++p)m[p]=r[p];m.length=e}return n}
	function ye(b,c,d,e,f,g,h,l,m,n,p){p=p?p:[NaN,NaN];var q,r;q=0;for(r=d.length;q<r;++q){var t=d[q];n=xe(b,c,t,e,f,g,h,l,m,n,p);c=t}return n};function ze(b,c){var d=0,e,f;e=0;for(f=c.length;e<f;++e)b[d++]=c[e];return d}function Ae(b,c,d,e){var f,g;f=0;for(g=d.length;f<g;++f){var h=d[f],l;for(l=0;l<e;++l)b[c++]=h[l]}return c}function Be(b,c,d,e,f){f=f?f:[];var g=0,h,l;h=0;for(l=d.length;h<l;++h)c=Ae(b,c,d[h],e),f[g++]=c;f.length=g;return f};function Ce(b,c,d,e,f){f=void 0!==f?f:[];for(var g=0;c<d;c+=e)f[g++]=b.slice(c,c+e);f.length=g;return f}function De(b,c,d,e,f){f=void 0!==f?f:[];var g=0,h,l;h=0;for(l=d.length;h<l;++h){var m=d[h];f[g++]=Ce(b,c,m,e,f[g]);c=m}f.length=g;return f};function Ee(b,c,d,e,f,g,h){var l=(d-c)/e;if(3>l){for(;c<d;c+=e)g[h++]=b[c],g[h++]=b[c+1];return h}var m=Array(l);m[0]=1;m[l-1]=1;d=[c,d-e];for(var n=0,p;0<d.length;){var q=d.pop(),r=d.pop(),t=0,A=b[r],K=b[r+1],U=b[q],x=b[q+1];for(p=r+e;p<q;p+=e){var L;L=b[p];var V=b[p+1],X=A,da=K,oa=U-X,na=x-da;if(0!==oa||0!==na){var fa=((L-X)*oa+(V-da)*na)/(oa*oa+na*na);1<fa?(X=U,da=x):0<fa&&(X+=oa*fa,da+=na*fa)}L=Oa(L,V,X,da);L>t&&(n=p,t=L)}t>f&&(m[(n-c)/e]=1,r+e<n&&d.push(r,n),n+e<q&&d.push(n,q))}for(p=0;p<l;++p)m[p]&&
	(g[h++]=b[c+p*e],g[h++]=b[c+p*e+1]);return h}
	function Fe(b,c,d,e,f,g,h,l){var m,n;m=0;for(n=d.length;m<n;++m){var p=d[m];a:{var q=b,r=p,t=e,A=f,K=g;if(c!=r){var U=A*Math.round(q[c]/A),x=A*Math.round(q[c+1]/A);c+=t;K[h++]=U;K[h++]=x;var L=void 0,V=void 0;do if(L=A*Math.round(q[c]/A),V=A*Math.round(q[c+1]/A),c+=t,c==r){K[h++]=L;K[h++]=V;break a}while(L==U&&V==x);for(;c<r;){var X,da;X=A*Math.round(q[c]/A);da=A*Math.round(q[c+1]/A);c+=t;if(X!=L||da!=V){var oa=L-U,na=V-x,fa=X-U,S=da-x;oa*S==na*fa&&(0>oa&&fa<oa||oa==fa||0<oa&&fa>oa)&&(0>na&&S<na||
	na==S||0<na&&S>na)||(K[h++]=L,K[h++]=V,U=L,x=V);L=X;V=da}}K[h++]=L;K[h++]=V}}l.push(h);c=p}return h};function B(b,c){z.call(this);this.f=this.o=-1;this.aa(b,c)}v(B,z);k=B.prototype;k.clone=function(){var b=new B(null);qe(b,this.c,this.a.slice());b.s();return b};k.pa=function(b,c,d,e){if(e<id(this.v(),b,c))return e;this.f!=this.g&&(this.o=Math.sqrt(ve(this.a,0,this.a.length,this.b,0)),this.f=this.g);return xe(this.a,0,this.a.length,this.b,this.o,!0,b,c,d,e)};k.dh=function(){return se(this.a,0,this.a.length,this.b)};k.ba=function(){return Ce(this.a,0,this.a.length,this.b)};
	k.gb=function(b){var c=[];c.length=Ee(this.a,0,this.a.length,this.b,b,c,0);b=new B(null);qe(b,"XY",c);b.s();return b};k.P=function(){return"LinearRing"};k.aa=function(b,c){b?(re(this,c,b,1),this.a||(this.a=[]),this.a.length=Ae(this.a,0,b,this.b)):qe(this,"XY",null);this.s()};function C(b,c){z.call(this);this.aa(b,c)}v(C,z);k=C.prototype;k.clone=function(){var b=new C(null);qe(b,this.c,this.a.slice());b.s();return b};k.pa=function(b,c,d,e){var f=this.a;b=Oa(b,c,f[0],f[1]);if(b<e){e=this.b;for(c=0;c<e;++c)d[c]=f[c];d.length=e;return b}return e};k.ba=function(){return this.a?this.a.slice():[]};k.$b=function(b){var c=this.a,d=c[0],c=c[1];return fd(d,c,d,c,b)};k.P=function(){return"Point"};k.ea=function(b){return kd(b,this.a[0],this.a[1])};
	k.aa=function(b,c){b?(re(this,c,b,0),this.a||(this.a=[]),this.a.length=ze(this.a,b)):qe(this,"XY",null);this.s()};function Ge(b,c,d,e,f){return!vd(f,function(f){return!He(b,c,d,e,f[0],f[1])})}function He(b,c,d,e,f,g){for(var h=!1,l=b[d-e],m=b[d-e+1];c<d;c+=e){var n=b[c],p=b[c+1];m>g!=p>g&&f<(n-l)*(g-m)/(p-m)+l&&(h=!h);l=n;m=p}return h}function Ie(b,c,d,e,f,g){if(0===d.length||!He(b,c,d[0],e,f,g))return!1;var h;c=1;for(h=d.length;c<h;++c)if(He(b,d[c-1],d[c],e,f,g))return!1;return!0};function Je(b,c,d,e,f,g,h){var l,m,n,p,q,r=f[g+1],t=[],A=d[0];n=b[A-e];q=b[A-e+1];for(l=c;l<A;l+=e){p=b[l];m=b[l+1];if(r<=q&&m<=r||q<=r&&r<=m)n=(r-q)/(m-q)*(p-n)+n,t.push(n);n=p;q=m}A=NaN;q=-Infinity;t.sort();n=t[0];l=1;for(m=t.length;l<m;++l){p=t[l];var K=Math.abs(p-n);K>q&&(n=(n+p)/2,Ie(b,c,d,e,n,r)&&(A=n,q=K));n=p}isNaN(A)&&(A=f[g]);return h?(h.push(A,r),h):[A,r]};function Ke(b,c,d,e,f,g){for(var h=[b[c],b[c+1]],l=[],m;c+e<d;c+=e){l[0]=b[c+e];l[1]=b[c+e+1];if(m=f.call(g,h,l))return m;h[0]=l[0];h[1]=l[1]}return!1};function Le(b,c,d,e,f){var g=ud(nd(),b,c,d,e);return Ed(f,g)?ld(f,g)||g[0]>=f[0]&&g[2]<=f[2]||g[1]>=f[1]&&g[3]<=f[3]?!0:Ke(b,c,d,e,function(b,c){var d=!1,e=md(f,b),g=md(f,c);if(1===e||1===g)d=!0;else{var q=f[0],r=f[1],t=f[2],A=f[3],K=c[0],U=c[1],x=(U-b[1])/(K-b[0]);g&2&&!(e&2)&&(d=K-(U-A)/x,d=d>=q&&d<=t);d||!(g&4)||e&4||(d=U-(K-t)*x,d=d>=r&&d<=A);d||!(g&8)||e&8||(d=K-(U-r)/x,d=d>=q&&d<=t);d||!(g&16)||e&16||(d=U-(K-q)*x,d=d>=r&&d<=A)}return d}):!1}
	function Me(b,c,d,e,f){var g=d[0];if(!(Le(b,c,g,e,f)||He(b,c,g,e,f[0],f[1])||He(b,c,g,e,f[0],f[3])||He(b,c,g,e,f[2],f[1])||He(b,c,g,e,f[2],f[3])))return!1;if(1===d.length)return!0;c=1;for(g=d.length;c<g;++c)if(Ge(b,d[c-1],d[c],e,f))return!1;return!0};function Ne(b,c,d,e){for(var f=0,g=b[d-e],h=b[d-e+1];c<d;c+=e)var l=b[c],m=b[c+1],f=f+(l-g)*(m+h),g=l,h=m;return 0<f}function Oe(b,c,d,e){var f=0;e=void 0!==e?e:!1;var g,h;g=0;for(h=c.length;g<h;++g){var l=c[g],f=Ne(b,f,l,d);if(0===g){if(e&&f||!e&&!f)return!1}else if(e&&!f||!e&&f)return!1;f=l}return!0}
	function Pe(b,c,d,e,f){f=void 0!==f?f:!1;var g,h;g=0;for(h=d.length;g<h;++g){var l=d[g],m=Ne(b,c,l,e);if(0===g?f&&m||!f&&!m:f&&!m||!f&&m)for(var m=b,n=l,p=e;c<n-p;){var q;for(q=0;q<p;++q){var r=m[c+q];m[c+q]=m[n-p+q];m[n-p+q]=r}c+=p;n-=p}c=l}return c}function Qe(b,c,d,e){var f=0,g,h;g=0;for(h=c.length;g<h;++g)f=Pe(b,f,c[g],d,e);return f};function D(b,c){z.call(this);this.f=[];this.A=-1;this.D=null;this.Y=this.F=this.N=-1;this.o=null;this.aa(b,c)}v(D,z);k=D.prototype;k.kf=function(b){this.a?bb(this.a,b.a):this.a=b.a.slice();this.f.push(this.a.length);this.s()};k.clone=function(){var b=new D(null);Re(b,this.c,this.a.slice(),this.f.slice());return b};k.pa=function(b,c,d,e){if(e<id(this.v(),b,c))return e;this.F!=this.g&&(this.N=Math.sqrt(we(this.a,0,this.f,this.b,0)),this.F=this.g);return ye(this.a,0,this.f,this.b,this.N,!0,b,c,d,e)};
	k.Va=function(b,c){return Ie(Se(this),0,this.f,this.b,b,c)};k.gh=function(){return te(Se(this),0,this.f,this.b)};k.ba=function(b){var c;void 0!==b?(c=Se(this).slice(),Pe(c,0,this.f,this.b,b)):c=this.a;return De(c,0,this.f,this.b)};function Te(b){if(b.A!=b.g){var c=Ad(b.v());b.D=Je(Se(b),0,b.f,b.b,c,0);b.A=b.g}return b.D}k.Ef=function(){return new C(Te(this))};k.Jf=function(){return this.f.length};
	k.ae=function(b){if(0>b||this.f.length<=b)return null;var c=new B(null);qe(c,this.c,this.a.slice(0===b?0:this.f[b-1],this.f[b]));c.s();return c};k.be=function(){var b=this.c,c=this.a,d=this.f,e=[],f=0,g,h;g=0;for(h=d.length;g<h;++g){var l=d[g],m=new B(null),n=m;qe(n,b,c.slice(f,l));n.s();e.push(m);f=l}return e};function Se(b){if(b.Y!=b.g){var c=b.a;Oe(c,b.f,b.b)?b.o=c:(b.o=c.slice(),b.o.length=Pe(b.o,0,b.f,b.b));b.Y=b.g}return b.o}
	k.gb=function(b){var c=[],d=[];c.length=Fe(this.a,0,this.f,this.b,Math.sqrt(b),c,0,d);b=new D(null);Re(b,"XY",c,d);return b};k.P=function(){return"Polygon"};k.ea=function(b){return Me(Se(this),0,this.f,this.b,b)};k.aa=function(b,c){if(b){re(this,c,b,2);this.a||(this.a=[]);var d=Be(this.a,0,b,this.b,this.f);this.a.length=0===d.length?0:d[d.length-1];this.s()}else Re(this,"XY",null,this.f)};function Re(b,c,d,e){qe(b,c,d);b.f=e;b.s()}
	function Ue(b){var c=b[0],d=b[1],e=b[2];b=b[3];c=[c,d,c,b,e,b,e,d,c,d];d=new D(null);Re(d,"XY",c,[c.length]);return d};function E(b){Tc.call(this);b=b||{};this.f=[0,0];var c={};c.center=void 0!==b.center?b.center:null;this.i=he(b.projection);var d,e,f,g=void 0!==b.minZoom?b.minZoom:0;d=void 0!==b.maxZoom?b.maxZoom:28;var h=void 0!==b.zoomFactor?b.zoomFactor:2;if(void 0!==b.resolutions)d=b.resolutions,e=d[0],f=d[d.length-1],d=lb(d);else{e=he(b.projection);f=e.v();var l=(f?Math.max(Fd(f),Cd(f)):360*Sd.degrees/Sd[e.b])/256/Math.pow(2,0),m=l/Math.pow(2,28);e=b.maxResolution;void 0!==e?g=0:e=l/Math.pow(h,g);f=b.minResolution;
	void 0===f&&(f=void 0!==b.maxZoom?void 0!==b.maxResolution?e/Math.pow(h,d):l/Math.pow(h,d):m);d=g+Math.floor(Math.log(e/f)/Math.log(h));f=e/Math.pow(h,d-g);d=mb(h,e,d-g)}this.a=e;this.h=f;this.b=g;g=void 0!==b.extent?Pa(b.extent):Qa;(void 0!==b.enableRotation?b.enableRotation:1)?(e=b.constrainRotation,e=void 0===e||!0===e?tb():!1===e?rb:ka(e)?sb(e):rb):e=qb;this.c=new ub(g,d,e);void 0!==b.resolution?c.resolution=b.resolution:void 0!==b.zoom&&(c.resolution=this.constrainResolution(this.a,b.zoom-this.b));
	c.rotation=void 0!==b.rotation?b.rotation:0;this.I(c)}v(E,Tc);k=E.prototype;k.ac=function(b){return this.c.center(b)};k.constrainResolution=function(b,c,d){return this.c.resolution(b,c||0,d||0)};k.constrainRotation=function(b,c){return this.c.rotation(b,c||0)};k.na=function(){return this.get("center")};k.of=function(b){var c=this.na(),d=this.Z(),e=this.ja();return Bd(c,d,e,b)};k.Zg=function(){return this.i};k.Z=function(){return this.get("resolution")};
	function Ve(b){var c=b.a,d=Math.log(c/b.h)/Math.log(2);return function(b){return c/Math.pow(2,b*d)}}k.ja=function(){return this.get("rotation")};function We(b){var c=b.a,d=Math.log(c/b.h)/Math.log(2);return function(b){return Math.log(c/b)/Math.log(2)/d}}function Xe(b){var c=b.na(),d=b.i,e=b.Z();b=b.ja();return{center:[Math.round(c[0]/e)*e,Math.round(c[1]/e)*e],projection:void 0!==d?d:null,resolution:e,rotation:b}}
	k.Yf=function(){var b,c=this.Z();if(void 0!==c){var d,e=0;do{d=this.constrainResolution(this.a,e);if(d==c){b=e;break}++e}while(d>this.h)}return void 0!==b?this.b+b:b};
	k.uf=function(b,c,d){b instanceof z||(b=Ue(b));var e=d||{};d=void 0!==e.padding?e.padding:[0,0,0,0];var f=void 0!==e.constrainResolution?e.constrainResolution:!0,g=void 0!==e.nearest?e.nearest:!1,h;void 0!==e.minResolution?h=e.minResolution:void 0!==e.maxZoom?h=this.constrainResolution(this.a,e.maxZoom-this.b,0):h=0;var l=b.a,m=this.ja(),e=Math.cos(-m),m=Math.sin(-m),n=Infinity,p=Infinity,q=-Infinity,r=-Infinity;b=b.b;for(var t=0,A=l.length;t<A;t+=b)var K=l[t]*e-l[t+1]*m,U=l[t]*m+l[t+1]*e,n=Math.min(n,
	K),p=Math.min(p,U),q=Math.max(q,K),r=Math.max(r,U);l=[n,p,q,r];c=[c[0]-d[1]-d[3],c[1]-d[0]-d[2]];c=Math.max(Fd(l)/c[0],Cd(l)/c[1]);c=isNaN(c)?h:Math.max(c,h);f&&(h=this.constrainResolution(c,0,0),!g&&h<c&&(h=this.constrainResolution(h,-1,0)),c=h);this.Ia(c);m=-m;g=(n+q)/2+(d[1]-d[3])/2*c;d=(p+r)/2+(d[0]-d[2])/2*c;this.sa([g*e-d*m,d*e+g*m])};
	k.pf=function(b,c,d){var e=this.ja(),f=Math.cos(-e),e=Math.sin(-e),g=b[0]*f-b[1]*e;b=b[1]*f+b[0]*e;var h=this.Z(),g=g+(c[0]/2-d[0])*h;b+=(d[1]-c[1]/2)*h;e=-e;this.sa([g*f-b*e,b*f+g*e])};k.rotate=function(b,c){if(void 0!==c){var d,e=this.na();void 0!==e&&(d=[e[0]-c[0],e[1]-c[1]],Zc(d,b-this.ja()),Yc(d,c));this.sa(d)}this.md(b)};k.sa=function(b){this.B("center",b)};function Ye(b,c){b.f[1]+=c}k.Ia=function(b){this.B("resolution",b)};k.md=function(b){this.B("rotation",b)};
	k.Ei=function(b){b=this.constrainResolution(this.a,b-this.b,0);this.Ia(b)};function Ze(b){return 1-Math.pow(1-b,3)}function $e(b){return 3*b*b-2*b*b*b}function af(b){return b};function bf(b){var c=b.source,d=b.start?b.start:Date.now(),e=c[0],f=c[1],g=void 0!==b.duration?b.duration:1E3,h=b.easing?b.easing:$e;return function(b,c){if(c.time<d)return c.animate=!0,c.viewHints[0]+=1,!0;if(c.time<d+g){var n=1-h((c.time-d)/g),p=e-c.viewState.center[0],q=f-c.viewState.center[1];c.animate=!0;c.viewState.center[0]+=n*p;c.viewState.center[1]+=n*q;c.viewHints[0]+=1;return!0}return!1}}
	function cf(b){var c=b.rotation?b.rotation:0,d=b.start?b.start:Date.now(),e=void 0!==b.duration?b.duration:1E3,f=b.easing?b.easing:$e,g=b.anchor?b.anchor:null;return function(b,l){if(l.time<d)return l.animate=!0,l.viewHints[0]+=1,!0;if(l.time<d+e){var m=1-f((l.time-d)/e),m=(c-l.viewState.rotation)*m;l.animate=!0;l.viewState.rotation+=m;if(g){var n=l.viewState.center;n[0]-=g[0];n[1]-=g[1];Zc(n,m);Yc(n,g)}l.viewHints[0]+=1;return!0}return!1}}
	function df(b){var c=b.resolution,d=b.start?b.start:Date.now(),e=void 0!==b.duration?b.duration:1E3,f=b.easing?b.easing:$e;return function(b,h){if(h.time<d)return h.animate=!0,h.viewHints[0]+=1,!0;if(h.time<d+e){var l=1-f((h.time-d)/e),m=c-h.viewState.resolution;h.animate=!0;h.viewState.resolution+=l*m;h.viewHints[0]+=1;return!0}return!1}};function ef(b,c,d){return b+"/"+c+"/"+d}function ff(b){return ef(b[0],b[1],b[2])};function gf(b,c,d,e){this.a=b;this.b=c;this.c=d;this.g=e}gf.prototype.contains=function(b){return hf(this,b[1],b[2])};function hf(b,c,d){return b.a<=c&&c<=b.b&&b.c<=d&&d<=b.g}function jf(b,c){return b.a<=c.b&&b.b>=c.a&&b.c<=c.g&&b.g>=c.c};function kf(b){this.b=b.html;this.a=b.tileRanges?b.tileRanges:null};function lf(b,c,d){hc.call(this,b,d);this.element=c}v(lf,hc);function F(b){Tc.call(this);this.a=b?b:[];mf(this)}v(F,Tc);k=F.prototype;k.clear=function(){for(;0<this.hb();)this.pop()};k.kd=function(b){var c,d;c=0;for(d=b.length;c<d;++c)this.push(b[c]);return this};k.forEach=function(b,c){this.a.forEach(b,c)};k.Pg=function(){return this.a};k.item=function(b){return this.a[b]};k.hb=function(){return this.get("length")};k.oc=function(b,c){cb(this.a,b,0,c);mf(this);y(this,new lf("add",c,this))};
	k.pop=function(){return this.wd(this.hb()-1)};k.push=function(b){var c=this.a.length;this.oc(c,b);return c};k.remove=function(b){var c=this.a,d,e;d=0;for(e=c.length;d<e;++d)if(c[d]===b)return this.wd(d)};k.wd=function(b){var c=this.a[b];Ra.splice.call(this.a,b,1);mf(this);y(this,new lf("remove",c,this));return c};k.mi=function(b,c){var d=this.hb();if(b<d)d=this.a[b],this.a[b]=c,y(this,new lf("remove",d,this)),y(this,new lf("add",c,this));else{for(;d<b;++d)this.oc(d,void 0);this.oc(b,c)}};
	function mf(b){b.B("length",b.a.length)};function nf(b){if(!ja(b)){var c=b[0];c!=(c|0)&&(c=c+.5|0);var d=b[1];d!=(d|0)&&(d=d+.5|0);var e=b[2];e!=(e|0)&&(e=e+.5|0);b="rgba("+c+","+d+","+e+","+b[3]+")"}return b};var of=!Lb||9<=Zb;!Nb&&!Lb||Lb&&9<=Zb||Nb&&Xb("1.9.1");Lb&&Xb("9");function pf(b,c){this.x=ca(b)?b:0;this.y=ca(c)?c:0}k=pf.prototype;k.clone=function(){return new pf(this.x,this.y)};k.ceil=function(){this.x=Math.ceil(this.x);this.y=Math.ceil(this.y);return this};k.floor=function(){this.x=Math.floor(this.x);this.y=Math.floor(this.y);return this};k.round=function(){this.x=Math.round(this.x);this.y=Math.round(this.y);return this};k.scale=function(b,c){var d=ka(c)?c:b;this.x*=b;this.y*=d;return this};function qf(b,c){this.width=b;this.height=c}k=qf.prototype;k.clone=function(){return new qf(this.width,this.height)};k.nf=function(){return this.width*this.height};k.Aa=function(){return!this.nf()};k.ceil=function(){this.width=Math.ceil(this.width);this.height=Math.ceil(this.height);return this};k.floor=function(){this.width=Math.floor(this.width);this.height=Math.floor(this.height);return this};k.round=function(){this.width=Math.round(this.width);this.height=Math.round(this.height);return this};
	k.scale=function(b,c){var d=ka(c)?c:b;this.width*=b;this.height*=d;return this};function rf(b){return b?new sf(tf(b)):Ba||(Ba=new sf)}function uf(b){var c=document;return ja(b)?c.getElementById(b):b}function vf(b,c){zb(c,function(c,e){"style"==e?b.style.cssText=c:"class"==e?b.className=c:"for"==e?b.htmlFor=c:wf.hasOwnProperty(e)?b.setAttribute(wf[e],c):0==e.lastIndexOf("aria-",0)||0==e.lastIndexOf("data-",0)?b.setAttribute(e,c):b[e]=c})}
	var wf={cellpadding:"cellPadding",cellspacing:"cellSpacing",colspan:"colSpan",frameborder:"frameBorder",height:"height",maxlength:"maxLength",role:"role",rowspan:"rowSpan",type:"type",usemap:"useMap",valign:"vAlign",width:"width"};function xf(b){b=b.document.documentElement;return new qf(b.clientWidth,b.clientHeight)}
	function yf(b,c,d){var e=arguments,f=document,g=e[0],h=e[1];if(!of&&h&&(h.name||h.type)){g=["<",g];h.name&&g.push(' name="',Da(h.name),'"');if(h.type){g.push(' type="',Da(h.type),'"');var l={};Jb(l,h);delete l.type;h=l}g.push(">");g=g.join("")}g=f.createElement(g);h&&(ja(h)?g.className=h:ha(h)?g.className=h.join(" "):vf(g,h));2<e.length&&zf(f,g,e,2);return g}
	function zf(b,c,d,e){function f(d){d&&c.appendChild(ja(d)?b.createTextNode(d):d)}for(;e<d.length;e++){var g=d[e];!ia(g)||ma(g)&&0<g.nodeType?f(g):Ta(Af(g)?ab(g):g,f)}}function Bf(b,c){zf(tf(b),b,arguments,1)}function Cf(b){b&&b.parentNode&&b.parentNode.removeChild(b)}function Df(b){if(ca(b.firstElementChild))b=b.firstElementChild;else for(b=b.firstChild;b&&1!=b.nodeType;)b=b.nextSibling;return b}
	function Ef(b,c){if(b.contains&&1==c.nodeType)return b==c||b.contains(c);if("undefined"!=typeof b.compareDocumentPosition)return b==c||Boolean(b.compareDocumentPosition(c)&16);for(;c&&b!=c;)c=c.parentNode;return c==b}function tf(b){return 9==b.nodeType?b:b.ownerDocument||b.document}function Af(b){if(b&&"number"==typeof b.length){if(ma(b))return"function"==typeof b.item||"string"==typeof b.item;if(la(b))return"function"==typeof b.item}return!1}function sf(b){this.a=b||ba.document||document}
	function Ff(b){var c=b.a;b=c.scrollingElement?c.scrollingElement:Pb?c.body||c.documentElement:c.documentElement;c=c.parentWindow||c.defaultView;return Lb&&Xb("10")&&c.pageYOffset!=b.scrollTop?new pf(b.scrollLeft,b.scrollTop):new pf(c.pageXOffset||b.scrollLeft,c.pageYOffset||b.scrollTop)}sf.prototype.appendChild=function(b,c){b.appendChild(c)};sf.prototype.contains=Ef;function Gf(b){if(b.classList)return b.classList;b=b.className;return ja(b)&&b.match(/\S+/g)||[]}function Hf(b,c){var d;b.classList?d=b.classList.contains(c):(d=Gf(b),d=0<=Sa(d,c));return d}function If(b,c){b.classList?b.classList.add(c):Hf(b,c)||(b.className+=0<b.className.length?" "+c:c)}function Jf(b,c){b.classList?b.classList.remove(c):Hf(b,c)&&(b.className=Ua(Gf(b),function(b){return b!=c}).join(" "))};function Kf(b,c,d,e){this.top=b;this.right=c;this.bottom=d;this.left=e}k=Kf.prototype;k.clone=function(){return new Kf(this.top,this.right,this.bottom,this.left)};k.contains=function(b){return this&&b?b instanceof Kf?b.left>=this.left&&b.right<=this.right&&b.top>=this.top&&b.bottom<=this.bottom:b.x>=this.left&&b.x<=this.right&&b.y>=this.top&&b.y<=this.bottom:!1};
	k.ceil=function(){this.top=Math.ceil(this.top);this.right=Math.ceil(this.right);this.bottom=Math.ceil(this.bottom);this.left=Math.ceil(this.left);return this};k.floor=function(){this.top=Math.floor(this.top);this.right=Math.floor(this.right);this.bottom=Math.floor(this.bottom);this.left=Math.floor(this.left);return this};k.round=function(){this.top=Math.round(this.top);this.right=Math.round(this.right);this.bottom=Math.round(this.bottom);this.left=Math.round(this.left);return this};
	k.scale=function(b,c){var d=ka(c)?c:b;this.left*=b;this.right*=b;this.top*=d;this.bottom*=d;return this};function Lf(b,c,d,e){this.left=b;this.top=c;this.width=d;this.height=e}k=Lf.prototype;k.clone=function(){return new Lf(this.left,this.top,this.width,this.height)};k.contains=function(b){return b instanceof Lf?this.left<=b.left&&this.left+this.width>=b.left+b.width&&this.top<=b.top&&this.top+this.height>=b.top+b.height:b.x>=this.left&&b.x<=this.left+this.width&&b.y>=this.top&&b.y<=this.top+this.height};
	k.distance=function(b){var c=b.x<this.left?this.left-b.x:Math.max(b.x-(this.left+this.width),0);b=b.y<this.top?this.top-b.y:Math.max(b.y-(this.top+this.height),0);return Math.sqrt(c*c+b*b)};k.ceil=function(){this.left=Math.ceil(this.left);this.top=Math.ceil(this.top);this.width=Math.ceil(this.width);this.height=Math.ceil(this.height);return this};k.floor=function(){this.left=Math.floor(this.left);this.top=Math.floor(this.top);this.width=Math.floor(this.width);this.height=Math.floor(this.height);return this};
	k.round=function(){this.left=Math.round(this.left);this.top=Math.round(this.top);this.width=Math.round(this.width);this.height=Math.round(this.height);return this};k.scale=function(b,c){var d=ka(c)?c:b;this.left*=b;this.width*=b;this.top*=d;this.height*=d;return this};function Mf(b,c){var d=tf(b);return d.defaultView&&d.defaultView.getComputedStyle&&(d=d.defaultView.getComputedStyle(b,null))?d[c]||d.getPropertyValue(c)||"":""}function Nf(b,c){return Mf(b,c)||(b.currentStyle?b.currentStyle[c]:null)||b.style&&b.style[c]}function Of(b,c,d){var e;c instanceof pf?(e=c.x,c=c.y):(e=c,c=d);b.style.left=Pf(e);b.style.top=Pf(c)}
	function Qf(b){var c;try{c=b.getBoundingClientRect()}catch(d){return{left:0,top:0,right:0,bottom:0}}Lb&&b.ownerDocument.body&&(b=b.ownerDocument,c.left-=b.documentElement.clientLeft+b.body.clientLeft,c.top-=b.documentElement.clientTop+b.body.clientTop);return c}function Rf(b){if(1==b.nodeType)return b=Qf(b),new pf(b.left,b.top);b=b.changedTouches?b.changedTouches[0]:b;return new pf(b.clientX,b.clientY)}function Pf(b){"number"==typeof b&&(b=b+"px");return b}
	function Sf(b){var c=Tf;if("none"!=Nf(b,"display"))return c(b);var d=b.style,e=d.display,f=d.visibility,g=d.position;d.visibility="hidden";d.position="absolute";d.display="inline";b=c(b);d.display=e;d.position=g;d.visibility=f;return b}function Tf(b){var c=b.offsetWidth,d=b.offsetHeight,e=Pb&&!c&&!d;return ca(c)&&!e||!b.getBoundingClientRect?new qf(c,d):(b=Qf(b),new qf(b.right-b.left,b.bottom-b.top))}function Uf(b,c){b.style.display=c?"":"none"}
	function Vf(b,c,d,e){if(/^\d+px?$/.test(c))return parseInt(c,10);var f=b.style[d],g=b.runtimeStyle[d];b.runtimeStyle[d]=b.currentStyle[d];b.style[d]=c;c=b.style[e];b.style[d]=f;b.runtimeStyle[d]=g;return c}function Wf(b,c){var d=b.currentStyle?b.currentStyle[c]:null;return d?Vf(b,d,"left","pixelLeft"):0}
	function Xf(b,c){if(Lb){var d=Wf(b,c+"Left"),e=Wf(b,c+"Right"),f=Wf(b,c+"Top"),g=Wf(b,c+"Bottom");return new Kf(f,e,g,d)}d=Mf(b,c+"Left");e=Mf(b,c+"Right");f=Mf(b,c+"Top");g=Mf(b,c+"Bottom");return new Kf(parseFloat(f),parseFloat(e),parseFloat(g),parseFloat(d))}var Yf={thin:2,medium:4,thick:6};function Zf(b,c){if("none"==(b.currentStyle?b.currentStyle[c+"Style"]:null))return 0;var d=b.currentStyle?b.currentStyle[c+"Width"]:null;return d in Yf?Yf[d]:Vf(b,d,"left","pixelLeft")};function $f(b,c,d){hc.call(this,b);this.map=c;this.frameState=void 0!==d?d:null}v($f,hc);function ag(b){Tc.call(this);this.element=b.element?b.element:null;this.a=this.A=null;this.i=[];this.render=b.render?b.render:ya;b.target&&(this.A=uf(b.target))}v(ag,Tc);ag.prototype.K=function(){Cf(this.element);ag.ca.K.call(this)};ag.prototype.setMap=function(b){this.a&&Cf(this.element);0<this.i.length&&(this.i.forEach(Jc),this.i.length=0);if(this.a=b)(this.A?this.A:b.w).appendChild(this.element),this.render!==ya&&this.i.push(w(b,"postrender",this.render,!1,this)),b.render()};function bg(){this.c=0;this.g={};this.a=this.b=null}k=bg.prototype;k.clear=function(){this.c=0;this.g={};this.a=this.b=null};k.forEach=function(b,c){for(var d=this.b;d;)b.call(c,d.nb,d.gd,this),d=d.ra};k.get=function(b){b=this.g[b];if(b===this.a)return b.nb;b===this.b?(this.b=this.b.ra,this.b.Ma=null):(b.ra.Ma=b.Ma,b.Ma.ra=b.ra);b.ra=null;b.Ma=this.a;this.a=this.a.ra=b;return b.nb};k.Ab=function(){return this.c};k.G=function(){var b=Array(this.c),c=0,d;for(d=this.a;d;d=d.Ma)b[c++]=d.gd;return b};
	k.Qa=function(){var b=Array(this.c),c=0,d;for(d=this.a;d;d=d.Ma)b[c++]=d.nb;return b};k.pop=function(){var b=this.b;delete this.g[b.gd];b.ra&&(b.ra.Ma=null);this.b=b.ra;this.b||(this.a=null);--this.c;return b.nb};function cg(b){bg.call(this);this.f=void 0!==b?b:2048}v(cg,bg);function dg(b){return b.Ab()>b.f};function eg(b,c){Oc.call(this);this.a=b;this.state=c}v(eg,Oc);eg.prototype.getKey=function(){return pa(this).toString()};function fg(b){Tc.call(this);this.u=Vd(b.projection);this.j=void 0!==b.attributions?b.attributions:null;this.D=b.logo;this.o=void 0!==b.state?b.state:"ready";this.C=void 0!==b.wrapX?b.wrapX:!1}v(fg,Tc);k=fg.prototype;k.mh=ya;k.Lb=function(){return this.j};k.Bb=function(){return this.D};k.Mb=function(){return this.u};k.Nb=function(){return this.o};function gg(b){return b.C}k.lb=function(b){this.j=b;this.s()};function hg(b){this.minZoom=void 0!==b.minZoom?b.minZoom:0;this.g=b.resolutions;this.maxZoom=this.g.length-1;this.b=void 0!==b.origin?b.origin:null;this.f=null;void 0!==b.origins&&(this.f=b.origins);var c=b.extent;void 0===c||this.b||this.f||(this.b=zd(c));this.h=null;void 0!==b.tileSizes&&(this.h=b.tileSizes);this.l=void 0!==b.tileSize?b.tileSize:this.h?null:256;this.i=void 0!==c?c:null;this.a=null;void 0!==b.sizes?this.a=b.sizes.map(function(b){return new gf(Math.min(0,b[0]),Math.max(b[0]-1,-1),
	Math.min(0,b[1]),Math.max(b[1]-1,-1))},this):c&&ig(this,c);this.c=[0,0]}var jg=[0,0,0];hg.prototype.v=function(){return this.i};hg.prototype.za=function(b){return this.b?this.b:this.f[b]};hg.prototype.Z=function(b){return this.g[b]};function kg(b,c,d,e){lg(b,c[0],c[1],d,!1,jg);var f=jg[1],g=jg[2];lg(b,c[2],c[3],d,!0,jg);b=jg[1];c=jg[2];void 0!==e?(e.a=f,e.b=b,e.c=g,e.g=c):e=new gf(f,b,g,c);return e}function mg(b,c,d,e){d=b.Z(d);return kg(b,c,d,e)}
	function ng(b,c){var d=b.za(c[0]),e=b.Z(c[0]),f=Xc(og(b,c[0]),b.c);return[d[0]+(c[1]+.5)*f[0]*e,d[1]+(c[2]+.5)*f[1]*e]}function pg(b,c,d){var e=b.za(c[0]),f=b.Z(c[0]);b=Xc(og(b,c[0]),b.c);var g=e[0]+c[1]*b[0]*f;c=e[1]+c[2]*b[1]*f;return fd(g,c,g+b[0]*f,c+b[1]*f,d)}
	function lg(b,c,d,e,f,g){var h=qg(b,e),l=e/b.Z(h),m=b.za(h);b=Xc(og(b,h),b.c);c=l*Math.floor((c-m[0])/e+(f?.5:0))/b[0];d=l*Math.floor((d-m[1])/e+(f?0:.5))/b[1];f?(c=Math.ceil(c)-1,d=Math.ceil(d)-1):(c=Math.floor(c),d=Math.floor(d));f=c;void 0!==g?(g[0]=h,g[1]=f,g[2]=d):g=[h,f,d];return g}function og(b,c){return b.l?b.l:b.h[c]}function qg(b,c){var d=kb(b.g,c,0);return Na(d,b.minZoom,b.maxZoom)}function ig(b,c){for(var d=b.g.length,e=Array(d),f=b.minZoom;f<d;++f)e[f]=mg(b,c,f);b.a=e}
	function rg(b){var c=b.h;if(!c){var c=sg(b),d=tg(c,void 0,void 0),c=new hg({extent:c,origin:zd(c),resolutions:d,tileSize:void 0});b.h=c}return c}function ug(b){var c={};Jb(c,void 0!==b?b:{});void 0===c.extent&&(c.extent=Vd("EPSG:3857").v());c.resolutions=tg(c.extent,c.maxZoom,c.tileSize);delete c.maxZoom;return new hg(c)}function tg(b,c,d){c=void 0!==c?c:42;var e=Cd(b);b=Fd(b);d=Xc(void 0!==d?d:256);d=Math.max(b/d[0],e/d[1]);c+=1;e=Array(c);for(b=0;b<c;++b)e[b]=d/Math.pow(2,b);return e}
	function sg(b){b=Vd(b);var c=b.v();c||(b=180*Sd.degrees/b.dd(),c=fd(-b,-b,b,b));return c};function vg(b){fg.call(this,{attributions:b.attributions,extent:b.extent,logo:b.logo,projection:b.projection,state:b.state,wrapX:b.wrapX});this.A=void 0!==b.opaque?b.opaque:!1;this.F=void 0!==b.tilePixelRatio?b.tilePixelRatio:1;this.tileGrid=void 0!==b.tileGrid?b.tileGrid:null;this.a=new cg;this.w=[0,0]}v(vg,fg);
	function wg(b,c,d,e){for(var f=!0,g,h,l=d.a;l<=d.b;++l)for(var m=d.c;m<=d.g;++m)g=b.b(c,l,m),h=!1,b.a.g.hasOwnProperty(g)&&(g=b.a.get(g),(h=2===g.state)&&(h=!1!==e(g))),h||(f=!1);return f}vg.prototype.b=ef;vg.prototype.h=function(){return this.tileGrid};function xg(b,c,d){d=b.tileGrid?b.tileGrid:rg(d);c=Xc(og(d,c),b.w);d=b.F;b=b.w;void 0===b&&(b=[0,0]);b[0]=c[0]*d+.5|0;b[1]=c[1]*d+.5|0;return b}vg.prototype.Oe=ya;function yg(b,c){hc.call(this,b);this.tile=c}v(yg,hc);function zg(b){b=b?b:{};this.u=document.createElement("UL");this.j=document.createElement("LI");this.u.appendChild(this.j);Uf(this.j,!1);this.f=void 0!==b.collapsed?b.collapsed:!0;this.h=void 0!==b.collapsible?b.collapsible:!0;this.h||(this.f=!1);var c=b.className?b.className:"ol-attribution",d=b.tipLabel?b.tipLabel:"Attributions",e=b.collapseLabel?b.collapseLabel:"\u00bb";this.C=ja(e)?yf("SPAN",{},e):e;e=b.label?b.label:"i";this.w=ja(e)?yf("SPAN",{},e):e;d=yf("BUTTON",{type:"button",title:d},this.h&&
	!this.f?this.C:this.w);w(d,"click",this.F,!1,this);w(d,["mouseout",jc],function(){this.blur()},!1);c=yf("DIV",c+" ol-unselectable ol-control"+(this.f&&this.h?" ol-collapsed":"")+(this.h?"":" ol-uncollapsible"),this.u,d);ag.call(this,{element:c,render:b.render?b.render:Ag,target:b.target});this.o=!0;this.c={};this.b={};this.D={}}v(zg,ag);
	function Ag(b){if(b=b.frameState){var c,d,e,f,g,h,l,m,n,p,q,r=b.layerStatesArray,t=Gb(b.attributions),A={},K=b.viewState.projection;d=0;for(c=r.length;d<c;d++)if(h=r[d].layer.da())if(p=pa(h).toString(),n=h.j)for(e=0,f=n.length;e<f;e++)if(l=n[e],m=pa(l).toString(),!(m in t)){if(g=b.usedTiles[p]){var U=h.tileGrid?h.tileGrid:rg(K);a:{q=l;var x=K;if(q.a){var L=void 0,V=void 0,X=void 0,da=void 0;for(da in g)if(da in q.a)for(var X=g[da],oa,L=0,V=q.a[da].length;L<V;++L){oa=q.a[da][L];if(jf(oa,X)){q=!0;break a}var na=
	mg(U,x.v(),parseInt(da,10)),fa=na.b-na.a+1;if(X.a<na.a||X.b>na.b)if(jf(oa,new gf(nb(X.a,fa),nb(X.b,fa),X.c,X.g))||X.b-X.a+1>fa&&jf(oa,na)){q=!0;break a}}q=!1}else q=!0}}else q=!1;q?(m in A&&delete A[m],t[m]=l):A[m]=l}c=[t,A];d=c[0];c=c[1];for(var S in this.c)S in d?(this.b[S]||(Uf(this.c[S],!0),this.b[S]=!0),delete d[S]):S in c?(this.b[S]&&(Uf(this.c[S],!1),delete this.b[S]),delete c[S]):(Cf(this.c[S]),delete this.c[S],delete this.b[S]);for(S in d)e=document.createElement("LI"),e.innerHTML=d[S].b,
	this.u.appendChild(e),this.c[S]=e,this.b[S]=!0;for(S in c)e=document.createElement("LI"),e.innerHTML=c[S].b,Uf(e,!1),this.u.appendChild(e),this.c[S]=e;S=!Eb(this.b)||!Eb(b.logos);this.o!=S&&(Uf(this.element,S),this.o=S);S&&Eb(this.b)?If(this.element,"ol-logo-only"):Jf(this.element,"ol-logo-only");var I;b=b.logos;S=this.D;for(I in S)I in b||(Cf(S[I]),delete S[I]);for(var xa in b)xa in S||(I=new Image,I.src=xa,d=b[xa],""===d?d=I:(d=yf("A",{href:d}),d.appendChild(I)),this.j.appendChild(d),S[xa]=d);Uf(this.j,
	!Eb(b))}else this.o&&(Uf(this.element,!1),this.o=!1)}zg.prototype.F=function(b){b.preventDefault();b=this.element;Hf(b,"ol-collapsed")?Jf(b,"ol-collapsed"):If(b,"ol-collapsed");if(this.f){b=this.w;var c=b.parentNode;c&&c.replaceChild(this.C,b)}else b=this.C,(c=b.parentNode)&&c.replaceChild(this.w,b);this.f=!this.f};function Bg(b){b=b?b:{};var c=b.className?b.className:"ol-rotate",d=b.label?b.label:"\u21e7";this.b=null;ja(d)?this.b=yf("SPAN","ol-compass",d):(this.b=d,If(this.b,"ol-compass"));d=yf("BUTTON",{"class":c+"-reset",type:"button",title:b.tipLabel?b.tipLabel:"Reset rotation"},this.b);w(d,"click",Bg.prototype.j,!1,this);c=yf("DIV",c+" ol-unselectable ol-control",d);ag.call(this,{element:c,render:b.render?b.render:Cg,target:b.target});this.f=b.duration?b.duration:250;this.c=void 0!==b.autoHide?b.autoHide:
	!0;this.h=void 0;this.c&&If(this.element,"ol-hidden")}v(Bg,ag);Bg.prototype.j=function(b){b.preventDefault();b=this.a;var c=b.R();if(c){var d=c.ja();void 0!==d&&(0<this.f&&(d%=2*Math.PI,d<-Math.PI&&(d+=2*Math.PI),d>Math.PI&&(d-=2*Math.PI),b.ha(cf({rotation:d,duration:this.f,easing:Ze}))),c.md(0))}};
	function Cg(b){if(b=b.frameState){b=b.viewState.rotation;if(b!=this.h){var c="rotate("+b+"rad)";if(this.c){var d=this.element;0===b?If(d,"ol-hidden"):Jf(d,"ol-hidden")}this.b.style.msTransform=c;this.b.style.webkitTransform=c;this.b.style.transform=c}this.h=b}};function Dg(b){b=b?b:{};var c=b.className?b.className:"ol-zoom",d=b.delta?b.delta:1,e=b.zoomOutLabel?b.zoomOutLabel:"\u2212",f=b.zoomOutTipLabel?b.zoomOutTipLabel:"Zoom out",g=yf("BUTTON",{"class":c+"-in",type:"button",title:b.zoomInTipLabel?b.zoomInTipLabel:"Zoom in"},b.zoomInLabel?b.zoomInLabel:"+");w(g,"click",va(Dg.prototype.c,d),!1,this);e=yf("BUTTON",{"class":c+"-out",type:"button",title:f},e);w(e,"click",va(Dg.prototype.c,-d),!1,this);c=yf("DIV",c+" ol-unselectable ol-control",g,e);ag.call(this,
	{element:c,target:b.target});this.b=b.duration?b.duration:250}v(Dg,ag);Dg.prototype.c=function(b,c){c.preventDefault();var d=this.a,e=d.R();if(e){var f=e.Z();f&&(0<this.b&&d.ha(df({resolution:f,duration:this.b,easing:Ze})),d=e.constrainResolution(f,b),e.Ia(d))}};function Eg(b){b=b?b:{};var c=new F;(void 0!==b.zoom?b.zoom:1)&&c.push(new Dg(b.zoomOptions));(void 0!==b.rotate?b.rotate:1)&&c.push(new Bg(b.rotateOptions));(void 0!==b.attribution?b.attribution:1)&&c.push(new zg(b.attributionOptions));return c};function Fg(b,c,d){cc.call(this);this.$=null;this.g=!1;this.h=b;this.f=d;this.a=c||window;this.b=ua(this.c,this)}v(Fg,cc);Fg.prototype.start=function(){Gg(this);this.g=!1;var b=Hg(this),c=Ig(this);b&&!c&&this.a.mozRequestAnimationFrame?(this.$=w(this.a,"MozBeforePaint",this.b),this.a.mozRequestAnimationFrame(null),this.g=!0):this.$=b&&c?b.call(this.a,this.b):this.a.setTimeout(Nd(this.b),20)};
	function Gg(b){if(null!=b.$){var c=Hg(b),d=Ig(b);c&&!d&&b.a.mozRequestAnimationFrame?Jc(b.$):c&&d?d.call(b.a,b.$):b.a.clearTimeout(b.$)}b.$=null}Fg.prototype.c=function(){this.g&&this.$&&Jc(this.$);this.$=null;this.h.call(this.f,wa())};Fg.prototype.K=function(){Gg(this);Fg.ca.K.call(this)};function Hg(b){b=b.a;return b.requestAnimationFrame||b.webkitRequestAnimationFrame||b.mozRequestAnimationFrame||b.oRequestAnimationFrame||b.msRequestAnimationFrame||null}
	function Ig(b){b=b.a;return b.cancelAnimationFrame||b.cancelRequestAnimationFrame||b.webkitCancelRequestAnimationFrame||b.mozCancelRequestAnimationFrame||b.oCancelRequestAnimationFrame||b.msCancelRequestAnimationFrame||null};function Jg(b){ba.setTimeout(function(){throw b;},0)}function Kg(b,c){var d=b;c&&(d=ua(b,c));d=Lg(d);!la(ba.setImmediate)||ba.Window&&ba.Window.prototype&&ba.Window.prototype.setImmediate==ba.setImmediate?(Mg||(Mg=Ng()),Mg(d)):ba.setImmediate(d)}var Mg;
	function Ng(){var b=ba.MessageChannel;"undefined"===typeof b&&"undefined"!==typeof window&&window.postMessage&&window.addEventListener&&!yb("Presto")&&(b=function(){var b=document.createElement("IFRAME");b.style.display="none";b.src="";document.documentElement.appendChild(b);var c=b.contentWindow,b=c.document;b.open();b.write("");b.close();var d="callImmediate"+Math.random(),e="file:"==c.location.protocol?"*":c.location.protocol+"//"+c.location.host,b=ua(function(b){if(("*"==e||b.origin==e)&&b.data==
	d)this.port1.onmessage()},this);c.addEventListener("message",b,!1);this.port1={};this.port2={postMessage:function(){c.postMessage(d,e)}}});if("undefined"!==typeof b&&!yb("Trident")&&!yb("MSIE")){var c=new b,d={},e=d;c.port1.onmessage=function(){if(ca(d.next)){d=d.next;var b=d.Od;d.Od=null;b()}};return function(b){e.next={Od:b};e=e.next;c.port2.postMessage(0)}}return"undefined"!==typeof document&&"onreadystatechange"in document.createElement("SCRIPT")?function(b){var c=document.createElement("SCRIPT");
	c.onreadystatechange=function(){c.onreadystatechange=null;c.parentNode.removeChild(c);c=null;b();b=null};document.documentElement.appendChild(c)}:function(b){ba.setTimeout(b,0)}}var Lg=Md;function Og(b,c){this.b={};this.a=[];this.c=this.g=0;var d=arguments.length;if(1<d){if(d%2)throw Error("Uneven number of arguments");for(var e=0;e<d;e+=2)Pg(this,arguments[e],arguments[e+1])}else if(b){b instanceof Og?(d=b.G(),e=b.Qa()):(d=Db(b),e=Cb(b));for(var f=0;f<d.length;f++)Pg(this,d[f],e[f])}}k=Og.prototype;k.Ab=function(){return this.g};k.Qa=function(){Qg(this);for(var b=[],c=0;c<this.a.length;c++)b.push(this.b[this.a[c]]);return b};k.G=function(){Qg(this);return this.a.concat()};
	k.Aa=function(){return 0==this.g};k.clear=function(){this.b={};this.c=this.g=this.a.length=0};k.remove=function(b){return Rg(this.b,b)?(delete this.b[b],this.g--,this.c++,this.a.length>2*this.g&&Qg(this),!0):!1};function Qg(b){if(b.g!=b.a.length){for(var c=0,d=0;c<b.a.length;){var e=b.a[c];Rg(b.b,e)&&(b.a[d++]=e);c++}b.a.length=d}if(b.g!=b.a.length){for(var f={},d=c=0;c<b.a.length;)e=b.a[c],Rg(f,e)||(b.a[d++]=e,f[e]=1),c++;b.a.length=d}}k.get=function(b,c){return Rg(this.b,b)?this.b[b]:c};
	function Pg(b,c,d){Rg(b.b,c)||(b.g++,b.a.push(c),b.c++);b.b[c]=d}k.forEach=function(b,c){for(var d=this.G(),e=0;e<d.length;e++){var f=d[e],g=this.get(f);b.call(c,g,f,this)}};k.clone=function(){return new Og(this)};function Rg(b,c){return Object.prototype.hasOwnProperty.call(b,c)};function Sg(){this.a=wa()}new Sg;Sg.prototype.reset=function(){this.a=wa()};Sg.prototype.get=function(){return this.a};function Tg(b){Oc.call(this);this.a=b||window;this.g=w(this.a,"resize",this.c,!1,this);this.b=xf(this.a||window)}v(Tg,Oc);Tg.prototype.K=function(){Tg.ca.K.call(this);this.g&&(Jc(this.g),this.g=null);this.b=this.a=null};Tg.prototype.c=function(){var b=xf(this.a||window),c=this.b;b==c||b&&c&&b.width==c.width&&b.height==c.height||(this.b=b,y(this,"resize"))};function Ug(b,c,d,e,f){if(!(Lb||Mb||Pb&&Xb("525")))return!0;if(Qb&&f)return Vg(b);if(f&&!e)return!1;ka(c)&&(c=Wg(c));if(!d&&(17==c||18==c||Qb&&91==c))return!1;if((Pb||Mb)&&e&&d)switch(b){case 220:case 219:case 221:case 192:case 186:case 189:case 187:case 188:case 190:case 191:case 192:case 222:return!1}if(Lb&&e&&c==b)return!1;switch(b){case 13:return!0;case 27:return!(Pb||Mb)}return Vg(b)}
	function Vg(b){if(48<=b&&57>=b||96<=b&&106>=b||65<=b&&90>=b||(Pb||Mb)&&0==b)return!0;switch(b){case 32:case 43:case 63:case 64:case 107:case 109:case 110:case 111:case 186:case 59:case 189:case 187:case 61:case 188:case 190:case 191:case 192:case 222:case 219:case 220:case 221:return!0;default:return!1}}function Wg(b){if(Nb)b=Xg(b);else if(Qb&&Pb)a:switch(b){case 93:b=91;break a}return b}
	function Xg(b){switch(b){case 61:return 187;case 59:return 186;case 173:return 189;case 224:return 91;case 0:return 224;default:return b}};function Yg(b,c){Oc.call(this);b&&Zg(this,b,c)}v(Yg,Oc);k=Yg.prototype;k.Gb=null;k.pc=null;k.fd=null;k.qc=null;k.ma=-1;k.Ka=-1;k.Tc=!1;
	var $g={3:13,12:144,63232:38,63233:40,63234:37,63235:39,63236:112,63237:113,63238:114,63239:115,63240:116,63241:117,63242:118,63243:119,63244:120,63245:121,63246:122,63247:123,63248:44,63272:46,63273:36,63275:35,63276:33,63277:34,63289:144,63302:45},ah={Up:38,Down:40,Left:37,Right:39,Enter:13,F1:112,F2:113,F3:114,F4:115,F5:116,F6:117,F7:118,F8:119,F9:120,F10:121,F11:122,F12:123,"U+007F":46,Home:36,End:35,PageUp:33,PageDown:34,Insert:45},bh=Lb||Mb||Pb&&Xb("525"),ch=Qb&&Nb;
	Yg.prototype.a=function(b){if(Pb||Mb)if(17==this.ma&&!b.j||18==this.ma&&!b.b||Qb&&91==this.ma&&!b.H)this.Ka=this.ma=-1;-1==this.ma&&(b.j&&17!=b.c?this.ma=17:b.b&&18!=b.c?this.ma=18:b.H&&91!=b.c&&(this.ma=91));bh&&!Ug(b.c,this.ma,b.g,b.j,b.b)?this.handleEvent(b):(this.Ka=Wg(b.c),ch&&(this.Tc=b.b))};Yg.prototype.b=function(b){this.Ka=this.ma=-1;this.Tc=b.b};
	Yg.prototype.handleEvent=function(b){var c=b.a,d,e,f=c.altKey;Lb&&"keypress"==b.type?(d=this.Ka,e=13!=d&&27!=d?c.keyCode:0):(Pb||Mb)&&"keypress"==b.type?(d=this.Ka,e=0<=c.charCode&&63232>c.charCode&&Vg(d)?c.charCode:0):Kb&&!Pb?(d=this.Ka,e=Vg(d)?c.keyCode:0):(d=c.keyCode||this.Ka,e=c.charCode||0,ch&&(f=this.Tc),Qb&&63==e&&224==d&&(d=191));var g=d=Wg(d),h=c.keyIdentifier;d?63232<=d&&d in $g?g=$g[d]:25==d&&b.g&&(g=9):h&&h in ah&&(g=ah[h]);this.ma=g;b=new dh(g,e,0,c);b.b=f;y(this,b)};
	function Zg(b,c,d){b.qc&&eh(b);b.Gb=c;b.pc=w(b.Gb,"keypress",b,d);b.fd=w(b.Gb,"keydown",b.a,d,b);b.qc=w(b.Gb,"keyup",b.b,d,b)}function eh(b){b.pc&&(Jc(b.pc),Jc(b.fd),Jc(b.qc),b.pc=null,b.fd=null,b.qc=null);b.Gb=null;b.ma=-1;b.Ka=-1}Yg.prototype.K=function(){Yg.ca.K.call(this);eh(this)};function dh(b,c,d,e){lc.call(this,e);this.type="key";this.c=b;this.o=c}v(dh,lc);function fh(b,c){Oc.call(this);var d=this.a=b;(d=ma(d)&&1==d.nodeType?this.a:this.a?this.a.body:null)&&Nf(d,"direction");this.b=w(this.a,Nb?"DOMMouseScroll":"mousewheel",this,c)}v(fh,Oc);
	fh.prototype.handleEvent=function(b){var c=0,d=0;b=b.a;if("mousewheel"==b.type){c=1;if(Lb||Pb&&(Rb||Xb("532.0")))c=40;d=gh(-b.wheelDelta,c);c=ca(b.wheelDeltaX)?gh(-b.wheelDeltaY,c):d}else d=b.detail,100<d?d=3:-100>d&&(d=-3),ca(b.axis)&&b.axis===b.HORIZONTAL_AXIS||(c=d);ka(this.g)&&(c=Math.min(Math.max(c,-this.g),this.g));d=new hh(d,b,0,c);y(this,d)};function gh(b,c){return Pb&&(Qb||Sb)&&0!=b%c?b:b/c}fh.prototype.K=function(){fh.ca.K.call(this);Jc(this.b);this.b=null};
	function hh(b,c,d,e){lc.call(this,c);this.type="mousewheel";this.detail=b;this.L=e}v(hh,lc);function ih(b,c,d){hc.call(this,b);this.a=c;b=d?d:{};this.buttons=jh(b);this.pressure=kh(b,this.buttons);this.bubbles="bubbles"in b?b.bubbles:!1;this.cancelable="cancelable"in b?b.cancelable:!1;this.view="view"in b?b.view:null;this.detail="detail"in b?b.detail:null;this.screenX="screenX"in b?b.screenX:0;this.screenY="screenY"in b?b.screenY:0;this.clientX="clientX"in b?b.clientX:0;this.clientY="clientY"in b?b.clientY:0;this.button="button"in b?b.button:0;this.relatedTarget="relatedTarget"in b?b.relatedTarget:
	null;this.pointerId="pointerId"in b?b.pointerId:0;this.width="width"in b?b.width:0;this.height="height"in b?b.height:0;this.pointerType="pointerType"in b?b.pointerType:"";this.isPrimary="isPrimary"in b?b.isPrimary:!1;c.preventDefault&&(this.preventDefault=function(){c.preventDefault()})}v(ih,hc);function jh(b){if(b.buttons||lh)b=b.buttons;else switch(b.which){case 1:b=1;break;case 2:b=4;break;case 3:b=2;break;default:b=0}return b}
	function kh(b,c){var d=0;b.pressure?d=b.pressure:d=c?.5:0;return d}var lh=!1;try{lh=1===(new MouseEvent("click",{buttons:1})).buttons}catch(b){};function mh(b,c){var d=document.createElement("CANVAS");b&&(d.width=b);c&&(d.height=c);return d.getContext("2d")};var nh=ba.devicePixelRatio||1,oh=!1,ph=function(){if(!("HTMLCanvasElement"in ba))return!1;try{var b=mh();return b?(void 0!==b.setLineDash&&(oh=!0),!0):!1}catch(c){return!1}}(),qh="ontouchstart"in ba,rh="PointerEvent"in ba,sh=!!ba.navigator.msPointerEnabled;function th(b,c){this.a=b;this.f=c};function uh(b){th.call(this,b,{mousedown:this.Bg,mousemove:this.Cg,mouseup:this.Fg,mouseover:this.Eg,mouseout:this.Dg});this.b=b.b;this.g=[]}v(uh,th);function vh(b,c){for(var d=b.g,e=c.clientX,f=c.clientY,g=0,h=d.length,l;g<h&&(l=d[g]);g++){var m=Math.abs(f-l[1]);if(25>=Math.abs(e-l[0])&&25>=m)return!0}return!1}function wh(b){var c=xh(b,b.a),d=c.preventDefault;c.preventDefault=function(){b.preventDefault();d()};c.pointerId=1;c.isPrimary=!0;c.pointerType="mouse";return c}k=uh.prototype;
	k.Bg=function(b){if(!vh(this,b)){(1).toString()in this.b&&this.cancel(b);var c=wh(b);this.b[(1).toString()]=b;yh(this.a,zh,c,b)}};k.Cg=function(b){if(!vh(this,b)){var c=wh(b);yh(this.a,Ah,c,b)}};k.Fg=function(b){if(!vh(this,b)){var c=this.b[(1).toString()];c&&c.button===b.button&&(c=wh(b),yh(this.a,Bh,c,b),delete this.b[(1).toString()])}};k.Eg=function(b){if(!vh(this,b)){var c=wh(b);Ch(this.a,c,b)}};k.Dg=function(b){if(!vh(this,b)){var c=wh(b);Dh(this.a,c,b)}};
	k.cancel=function(b){var c=wh(b);this.a.cancel(c,b);delete this.b[(1).toString()]};function Eh(b){th.call(this,b,{MSPointerDown:this.Kg,MSPointerMove:this.Lg,MSPointerUp:this.Og,MSPointerOut:this.Mg,MSPointerOver:this.Ng,MSPointerCancel:this.Jg,MSGotPointerCapture:this.Hg,MSLostPointerCapture:this.Ig});this.b=b.b;this.g=["","unavailable","touch","pen","mouse"]}v(Eh,th);function Fh(b,c){var d=c;ka(c.a.pointerType)&&(d=xh(c,c.a),d.pointerType=b.g[c.a.pointerType]);return d}k=Eh.prototype;k.Kg=function(b){this.b[b.a.pointerId.toString()]=b;var c=Fh(this,b);yh(this.a,zh,c,b)};
	k.Lg=function(b){var c=Fh(this,b);yh(this.a,Ah,c,b)};k.Og=function(b){var c=Fh(this,b);yh(this.a,Bh,c,b);delete this.b[b.a.pointerId.toString()]};k.Mg=function(b){var c=Fh(this,b);Dh(this.a,c,b)};k.Ng=function(b){var c=Fh(this,b);Ch(this.a,c,b)};k.Jg=function(b){var c=Fh(this,b);this.a.cancel(c,b);delete this.b[b.a.pointerId.toString()]};k.Ig=function(b){y(this.a,new ih("lostpointercapture",b,b.a))};k.Hg=function(b){y(this.a,new ih("gotpointercapture",b,b.a))};function Gh(b){th.call(this,b,{pointerdown:this.Vh,pointermove:this.Wh,pointerup:this.Zh,pointerout:this.Xh,pointerover:this.Yh,pointercancel:this.Uh,gotpointercapture:this.Zf,lostpointercapture:this.Ag})}v(Gh,th);k=Gh.prototype;k.Vh=function(b){Hh(this.a,b)};k.Wh=function(b){Hh(this.a,b)};k.Zh=function(b){Hh(this.a,b)};k.Xh=function(b){Hh(this.a,b)};k.Yh=function(b){Hh(this.a,b)};k.Uh=function(b){Hh(this.a,b)};k.Ag=function(b){Hh(this.a,b)};k.Zf=function(b){Hh(this.a,b)};function Ih(b,c){th.call(this,b,{touchstart:this.Ji,touchmove:this.Ii,touchend:this.Hi,touchcancel:this.Gi});this.b=b.b;this.l=c;this.g=void 0;this.h=0;this.c=void 0}v(Ih,th);k=Ih.prototype;k.Ae=function(){this.h=0;this.c=void 0};
	function Jh(b,c,d){c=xh(c,d);c.pointerId=d.identifier+2;c.bubbles=!0;c.cancelable=!0;c.detail=b.h;c.button=0;c.buttons=1;c.width=d.webkitRadiusX||d.radiusX||0;c.height=d.webkitRadiusY||d.radiusY||0;c.pressure=d.webkitForce||d.force||.5;c.isPrimary=b.g===d.identifier;c.pointerType="touch";c.clientX=d.clientX;c.clientY=d.clientY;c.screenX=d.screenX;c.screenY=d.screenY;return c}
	function Kh(b,c,d){function e(){c.preventDefault()}var f=Array.prototype.slice.call(c.a.changedTouches),g=f.length,h,l;for(h=0;h<g;++h)l=Jh(b,c,f[h]),l.preventDefault=e,d.call(b,c,l)}
	k.Ji=function(b){var c=b.a.touches,d=Db(this.b),e=d.length;if(e>=c.length){var f=[],g,h,l;for(g=0;g<e;++g){h=d[g];l=this.b[h];var m;if(!(m=1==h))a:{m=c.length;for(var n=void 0,p=0;p<m;p++)if(n=c[p],n.identifier===h-2){m=!0;break a}m=!1}m||f.push(l.Xa)}for(g=0;g<f.length;++g)this.Uc(b,f[g])}c=Bb(this.b);if(!(d=0===c)){if(c=1===c)c=(1).toString()in this.b;d=c}d&&(this.g=b.a.changedTouches[0].identifier,void 0!==this.c&&ba.clearTimeout(this.c));Lh(this,b);this.h++;Kh(this,b,this.Qh)};
	k.Qh=function(b,c){this.b[c.pointerId]={target:c.target,Xa:c,ye:c.target};var d=this.a;c.bubbles=!0;yh(d,Nh,c,b);d=this.a;c.bubbles=!1;yh(d,Oh,c,b);yh(this.a,zh,c,b)};k.Ii=function(b){b.preventDefault();Kh(this,b,this.Gg)};k.Gg=function(b,c){var d=this.b[c.pointerId];if(d){var e=d.Xa,f=d.ye;yh(this.a,Ah,c,b);e&&f!==c.target&&(e.relatedTarget=c.target,c.relatedTarget=f,e.target=f,c.target?(Dh(this.a,e,b),Ch(this.a,c,b)):(c.target=f,c.relatedTarget=null,this.Uc(b,c)));d.Xa=c;d.ye=c.target}};
	k.Hi=function(b){Lh(this,b);Kh(this,b,this.Ki)};k.Ki=function(b,c){yh(this.a,Bh,c,b);this.a.Xa(c,b);var d=this.a;c.bubbles=!1;yh(d,Ph,c,b);delete this.b[c.pointerId];c.isPrimary&&(this.g=void 0,this.c=ba.setTimeout(ua(this.Ae,this),200))};k.Gi=function(b){Kh(this,b,this.Uc)};k.Uc=function(b,c){this.a.cancel(c,b);this.a.Xa(c,b);var d=this.a;c.bubbles=!1;yh(d,Ph,c,b);delete this.b[c.pointerId];c.isPrimary&&(this.g=void 0,this.c=ba.setTimeout(ua(this.Ae,this),200))};
	function Lh(b,c){var d=b.l.g,e=c.a.changedTouches[0];if(b.g===e.identifier){var f=[e.clientX,e.clientY];d.push(f);ba.setTimeout(function(){Za(d,f)},2500)}};function Qh(b){Oc.call(this);this.c=b;this.b={};this.g={};this.a=[];rh?Rh(this,new Gh(this)):sh?Rh(this,new Eh(this)):(b=new uh(this),Rh(this,b),qh&&Rh(this,new Ih(this,b)));b=this.a.length;for(var c,d=0;d<b;d++)c=this.a[d],Sh(this,Object.keys(c.f))}v(Qh,Oc);function Rh(b,c){var d=Object.keys(c.f);d&&(d.forEach(function(b){var d=c.f[b];d&&(this.g[b]=ua(d,c))},b),b.a.push(c))}Qh.prototype.f=function(b){var c=this.g[b.type];c&&c(b)};
	function Sh(b,c){c.forEach(function(b){w(this.c,b,this.f,!1,this)},b)}function Th(b,c){c.forEach(function(b){Ic(this.c,b,this.f,!1,this)},b)}function xh(b,c){for(var d={},e,f=0,g=Uh.length;f<g;f++)e=Uh[f][0],d[e]=b[e]||c[e]||Uh[f][1];return d}Qh.prototype.Xa=function(b,c){b.bubbles=!0;yh(this,Vh,b,c)};Qh.prototype.cancel=function(b,c){yh(this,Wh,b,c)};function Dh(b,c,d){b.Xa(c,d);var e=c.relatedTarget;e&&Ef(c.target,e)||(c.bubbles=!1,yh(b,Ph,c,d))}
	function Ch(b,c,d){c.bubbles=!0;yh(b,Nh,c,d);var e=c.relatedTarget;e&&Ef(c.target,e)||(c.bubbles=!1,yh(b,Oh,c,d))}function yh(b,c,d,e){y(b,new ih(c,e,d))}function Hh(b,c){y(b,new ih(c.type,c,c.a))}Qh.prototype.K=function(){for(var b=this.a.length,c,d=0;d<b;d++)c=this.a[d],Th(this,Object.keys(c.f));Qh.ca.K.call(this)};
	var Ah="pointermove",zh="pointerdown",Bh="pointerup",Nh="pointerover",Vh="pointerout",Oh="pointerenter",Ph="pointerleave",Wh="pointercancel",Uh=[["bubbles",!1],["cancelable",!1],["view",null],["detail",null],["screenX",0],["screenY",0],["clientX",0],["clientY",0],["ctrlKey",!1],["altKey",!1],["shiftKey",!1],["metaKey",!1],["button",0],["relatedTarget",null],["buttons",0],["pointerId",0],["width",0],["height",0],["pressure",0],["tiltX",0],["tiltY",0],["pointerType",""],["hwTimestamp",0],["isPrimary",
	!1],["type",""],["target",null],["currentTarget",null],["which",0]];function Xh(b,c,d,e,f){$f.call(this,b,c,f);this.a=d;this.originalEvent=d.a;this.pixel=c.ad(this.originalEvent);this.coordinate=c.ya(this.pixel);this.dragging=void 0!==e?e:!1}v(Xh,$f);Xh.prototype.preventDefault=function(){Xh.ca.preventDefault.call(this);this.a.preventDefault()};Xh.prototype.l=function(){Xh.ca.l.call(this);this.a.l()};function Yh(b,c,d,e,f){Xh.call(this,b,c,d.a,e,f);this.b=d}v(Yh,Xh);
	function Zh(b){Oc.call(this);this.g=b;this.h=0;this.l=!1;this.b=this.i=this.c=null;b=this.g.a;this.u=0;this.o={};this.f=new Qh(b);this.a=null;this.i=w(this.f,zh,this.og,!1,this);this.j=w(this.f,Ah,this.bi,!1,this)}v(Zh,Oc);function $h(b,c){var d;d=new Yh(ai,b.g,c);y(b,d);0!==b.h?(ba.clearTimeout(b.h),b.h=0,d=new Yh(bi,b.g,c),y(b,d)):b.h=ba.setTimeout(ua(function(){this.h=0;var b=new Yh(ci,this.g,c);y(this,b)},b),250)}
	function di(b,c){c.type==ei||c.type==fi?delete b.o[c.pointerId]:c.type==gi&&(b.o[c.pointerId]=!0);b.u=Bb(b.o)}k=Zh.prototype;k.le=function(b){di(this,b);var c=new Yh(ei,this.g,b);y(this,c);!this.l&&0===b.button&&$h(this,this.b);0===this.u&&(this.c.forEach(Jc),this.c=null,this.l=!1,this.b=null,gc(this.a),this.a=null)};
	k.og=function(b){di(this,b);var c=new Yh(gi,this.g,b);y(this,c);this.b=b;this.c||(this.a=new Qh(document),this.c=[w(this.a,hi,this.Ug,!1,this),w(this.a,ei,this.le,!1,this),w(this.f,fi,this.le,!1,this)])};k.Ug=function(b){if(b.clientX!=this.b.clientX||b.clientY!=this.b.clientY){this.l=!0;var c=new Yh(ii,this.g,b,this.l);y(this,c)}b.preventDefault()};k.bi=function(b){y(this,new Yh(b.type,this.g,b,!(!this.b||b.clientX==this.b.clientX&&b.clientY==this.b.clientY)))};
	k.K=function(){this.j&&(Jc(this.j),this.j=null);this.i&&(Jc(this.i),this.i=null);this.c&&(this.c.forEach(Jc),this.c=null);this.a&&(gc(this.a),this.a=null);this.f&&(gc(this.f),this.f=null);Zh.ca.K.call(this)};var ci="singleclick",ai="click",bi="dblclick",ii="pointerdrag",hi="pointermove",gi="pointerdown",ei="pointerup",fi="pointercancel",ji={Wi:ci,Li:ai,Mi:bi,Pi:ii,Si:hi,Oi:gi,Vi:ei,Ui:"pointerover",Ti:"pointerout",Qi:"pointerenter",Ri:"pointerleave",Ni:fi};function ki(b){Tc.call(this);var c=Gb(b);c.opacity=void 0!==b.opacity?b.opacity:1;c.visible=void 0!==b.visible?b.visible:!0;c.zIndex=void 0!==b.zIndex?b.zIndex:0;c.maxResolution=void 0!==b.maxResolution?b.maxResolution:Infinity;c.minResolution=void 0!==b.minResolution?b.minResolution:0;this.I(c)}v(ki,Tc);
	function li(b){var c=b.Ib(),d=b.ed(),e=b.Ra(),f=b.v(),g=b.Jb(),h=b.Cb(),l=b.Db();return{layer:b,opacity:Na(c,0,1),Fi:d,visible:e,sc:!0,extent:f,zIndex:g,maxResolution:h,minResolution:Math.max(l,0)}}k=ki.prototype;k.v=function(){return this.get("extent")};k.Cb=function(){return this.get("maxResolution")};k.Db=function(){return this.get("minResolution")};k.Ib=function(){return this.get("opacity")};k.Ra=function(){return this.get("visible")};k.Jb=function(){return this.get("zIndex")};
	k.wc=function(b){this.B("extent",b)};k.Mc=function(b){this.B("maxResolution",b)};k.Nc=function(b){this.B("minResolution",b)};k.xc=function(b){this.B("opacity",b)};k.yc=function(b){this.B("visible",b)};k.zc=function(b){this.B("zIndex",b)};function mi(){};function ni(b,c,d,e,f,g){hc.call(this,b,c);this.vectorContext=d;this.frameState=e;this.context=f;this.glContext=g}v(ni,hc);function oi(b){var c=Gb(b);delete c.source;ki.call(this,c);this.a=this.c=this.b=null;b.map&&this.setMap(b.map);w(this,Vc("source"),this.tg,!1,this);this.Oc(b.source?b.source:null)}v(oi,ki);k=oi.prototype;k.cd=function(b){b=b?b:[];b.push(li(this));return b};k.da=function(){return this.get("source")||null};k.ed=function(){var b=this.da();return b?b.o:"undefined"};k.kh=function(){this.s()};k.tg=function(){this.a&&(Jc(this.a),this.a=null);var b=this.da();b&&(this.a=w(b,"change",this.kh,!1,this));this.s()};
	k.setMap=function(b){Jc(this.b);this.b=null;b||this.s();Jc(this.c);this.c=null;b&&(this.b=w(b,"precompose",function(b){var d=li(this);d.sc=!1;d.zIndex=Infinity;b.frameState.layerStatesArray.push(d);b.frameState.layerStates[pa(this)]=d},!1,this),this.c=w(this,"change",b.render,!1,b),this.s())};k.Oc=function(b){this.B("source",b)};function pi(b,c,d,e,f){Oc.call(this);this.l=f;this.extent=b;this.i=d;this.resolution=c;this.state=e}v(pi,Oc);function qi(b){y(b,"change")}pi.prototype.v=function(){return this.extent};pi.prototype.Z=function(){return this.resolution};function ri(b,c,d,e,f,g,h,l){b[0]=1;b[1]=0;b[2]=0;b[3]=0;b[4]=0;b[5]=1;b[6]=0;b[7]=0;b[8]=0;b[9]=0;b[10]=1;b[11]=0;b[12]=0;b[13]=0;b[14]=0;b[15]=1;0===c&&0===d||dd(b,c,d);if(1!=e||1!=f){c=b[1]*e;d=b[2]*e;var m=b[3]*e,n=b[4]*f,p=b[5]*f,q=b[6]*f;f=b[7]*f;var r=1*b[8],t=1*b[9],A=1*b[10],K=1*b[11],U=b[12],x=b[13],L=b[14],V=b[15];b[0]*=e;b[1]=c;b[2]=d;b[3]=m;b[4]=n;b[5]=p;b[6]=q;b[7]=f;b[8]=r;b[9]=t;b[10]=A;b[11]=K;b[12]=U;b[13]=x;b[14]=L;b[15]=V}0!==g&&(e=b[0],c=b[1],d=b[2],m=b[3],n=b[4],p=b[5],q=b[6],
	f=b[7],r=Math.cos(g),g=Math.sin(g),b[0]=e*r+n*g,b[1]=c*r+p*g,b[2]=d*r+q*g,b[3]=m*r+f*g,b[4]=e*-g+n*r,b[5]=c*-g+p*r,b[6]=d*-g+q*r,b[7]=m*-g+f*r);0===h&&0===l||dd(b,h,l);return b}function si(b,c,d){var e=b[1],f=b[5],g=b[13],h=c[0];c=c[1];d[0]=b[0]*h+b[4]*c+b[12];d[1]=e*h+f*c+g;return d};function ti(b){Rc.call(this);this.a=b}v(ti,Rc);ti.prototype.Bc=ya;ti.prototype.od=function(b,c,d,e){b=b.slice();si(c.pixelToCoordinateMatrix,b,b);if(this.Bc(b,c,Kd,this))return d.call(e,this.a)};function ui(b,c){return function(d,e){return wg(b,d,e,function(b){c[d]||(c[d]={});c[d][b.a.toString()]=b})}}ti.prototype.D=function(b){2===b.target.state&&vi(this)};function vi(b){var c=b.a;c.Ra()&&"ready"==c.ed()&&b.s()}
	function wi(b,c){dg(c.a)&&b.postRenderFunctions.push(va(function(b,c,f){c=pa(b).toString();b=b.a;f=f.usedTiles[c];for(var g;dg(b)&&!(c=b.b.nb,g=c.a[0].toString(),g in f&&f[g].contains(c.a));)b.pop().Xc()},c))}function xi(b,c){if(c){var d,e,f;e=0;for(f=c.length;e<f;++e)d=c[e],b[pa(d).toString()]=d}}function yi(b,c){var d=c.D;void 0!==d&&(ja(d)?b.logos[d]="":ma(d)&&(b.logos[d.src]=d.href))};function zi(b){this.o=b.opacity;this.u=b.rotateWithView;this.H=b.rotation;this.L=b.scale;this.C=b.snapToPixel}k=zi.prototype;k.Dc=function(){return this.o};k.ic=function(){return this.u};k.Ec=function(){return this.H};k.Fc=function(){return this.L};k.kc=function(){return this.C};k.Gc=function(b){this.o=b};k.Hc=function(b){this.H=b};k.Ic=function(b){this.L=b};function Ai(b){b=b||{};this.f=void 0!==b.anchor?b.anchor:[.5,.5];this.c=null;this.b=void 0!==b.anchorOrigin?b.anchorOrigin:"top-left";this.l=void 0!==b.anchorXUnits?b.anchorXUnits:"fraction";this.i=void 0!==b.anchorYUnits?b.anchorYUnits:"fraction";var c=void 0!==b.crossOrigin?b.crossOrigin:null,d=void 0!==b.img?b.img:null,e=void 0!==b.imgSize?b.imgSize:null,f=b.src;void 0!==f&&0!==f.length||!d||(f=d.src);var g=void 0!==b.src?0:2,h=Bi.Zd(),l=h.get(f,c);l||(l=new Ci(d,f,e,c,g),h.a[c+":"+f]=l,++h.b);
	this.a=l;this.w=void 0!==b.offset?b.offset:[0,0];this.g=void 0!==b.offsetOrigin?b.offsetOrigin:"top-left";this.h=null;this.j=void 0!==b.size?b.size:null;zi.call(this,{opacity:void 0!==b.opacity?b.opacity:1,rotation:void 0!==b.rotation?b.rotation:0,scale:void 0!==b.scale?b.scale:1,snapToPixel:void 0!==b.snapToPixel?b.snapToPixel:!0,rotateWithView:void 0!==b.rotateWithView?b.rotateWithView:!1})}v(Ai,zi);k=Ai.prototype;
	k.eb=function(){if(this.c)return this.c;var b=this.f,c=this.La();if("fraction"==this.l||"fraction"==this.i){if(!c)return null;b=this.f.slice();"fraction"==this.l&&(b[0]*=c[0]);"fraction"==this.i&&(b[1]*=c[1])}if("top-left"!=this.b){if(!c)return null;b===this.f&&(b=this.f.slice());if("top-right"==this.b||"bottom-right"==this.b)b[0]=-b[0]+c[0];if("bottom-left"==this.b||"bottom-right"==this.b)b[1]=-b[1]+c[1]}return this.c=b};k.Wa=function(){return this.a.a};k.Ob=function(){return this.a.b};
	k.pd=function(){var b=this.a;if(!b.f)if(b.i){var c=b.c[0],d=b.c[1],e=mh(c,d);e.fillRect(0,0,c,d);b.f=e.canvas}else b.f=b.a;return b.f};k.za=function(){if(this.h)return this.h;var b=this.w;if("top-left"!=this.g){var c=this.La(),d=this.a.c;if(!c||!d)return null;b=b.slice();if("top-right"==this.g||"bottom-right"==this.g)b[0]=d[0]-c[0]-b[0];if("bottom-left"==this.g||"bottom-right"==this.g)b[1]=d[1]-c[1]-b[1]}return this.h=b};k.rh=function(){return this.a.h};k.La=function(){return this.j?this.j:this.a.c};
	k.jd=function(b,c){return w(this.a,"change",b,!1,c)};k.load=function(){this.a.load()};k.Bd=function(b,c){Ic(this.a,"change",b,!1,c)};function Ci(b,c,d,e,f){Oc.call(this);this.f=null;this.a=b?b:new Image;e&&(this.a.crossOrigin=e);this.g=null;this.b=f;this.c=d;this.h=c;this.i=!1;2==this.b&&Di(this)}v(Ci,Oc);function Di(b){var c=mh(1,1);try{c.drawImage(b.a,0,0),c.getImageData(0,0,1,1)}catch(d){b.i=!0}}Ci.prototype.l=function(){this.b=3;this.g.forEach(Jc);this.g=null;y(this,"change")};
	Ci.prototype.j=function(){this.b=2;this.c=[this.a.width,this.a.height];this.g.forEach(Jc);this.g=null;Di(this);y(this,"change")};Ci.prototype.load=function(){if(0==this.b){this.b=1;this.g=[Hc(this.a,"error",this.l,!1,this),Hc(this.a,"load",this.j,!1,this)];try{this.a.src=this.h}catch(b){this.l()}}};function Bi(){this.a={};this.b=0}(function(){var b=Bi;b.Zd=function(){return b.ne?b.ne:b.ne=new b}})();Bi.prototype.clear=function(){this.a={};this.b=0};
	Bi.prototype.get=function(b,c){var d=c+":"+b;return d in this.a?this.a[d]:null};function Ei(b,c){cc.call(this);this.h=c;this.b={};this.c={}}v(Ei,cc);Ei.prototype.K=function(){zb(this.b,gc);Ei.ca.K.call(this)};function Fi(){var b=Bi.Zd();if(32<b.b){var c=0,d,e;for(d in b.a){e=b.a[d];var f;if(f=0===(c++&3))pc(e)?e=Qc(e,void 0,void 0):(e=Dc(e),e=!!e&&xc(e,void 0,void 0)),f=!e;f&&(delete b.a[d],--b.b)}}}
	function Gi(b,c,d,e,f,g,h){var l,m=d.viewState,n=m.resolution,p=m.projection,m=c;if(p.g){var p=p.v(),q=Fd(p),r=c[0];if(r<p[0]||r>p[2])m=[r+q*Math.ceil((p[0]-r)/q),c[1]]}p=d.layerStatesArray;for(q=p.length-1;0<=q;--q){var t=p[q],r=t.layer;if(!t.sc||t.visible&&n>=t.minResolution&&n<t.maxResolution&&g.call(h,r))if(t=Hi(b,r),r.da()&&(l=t.Bc(gg(r.da())?m:c,d,e,f)),l)return l}}
	function Hi(b,c){var d=pa(c).toString();if(d in b.b)return b.b[d];var e;e=c instanceof G?new Ii(c):c instanceof H?new Ji(c):c instanceof J?new Ki(c):null;b.b[d]=e;b.c[d]=w(e,"change",b.i,!1,b);return e}Ei.prototype.i=function(){this.h.render()};Ei.prototype.l=ya;Ei.prototype.o=function(b,c){for(var d in this.b)if(!(c&&d in c.layerStates)){var e=d,f=this.b[e];delete this.b[e];Jc(this.c[e]);delete this.c[e];gc(f)}};function hb(b,c){return b.zIndex-c.zIndex};function Li(b,c){this.l=b;this.f=c;this.a=[];this.b=[];this.g={}}Li.prototype.clear=function(){this.a.length=0;this.b.length=0;Fb(this.g)};Li.prototype.Ab=function(){return this.a.length};Li.prototype.Aa=function(){return 0===this.a.length};function Mi(b,c){for(var d=b.a,e=b.b,f=d.length,g=d[c],h=e[c],l=c;c<f>>1;){var m=2*c+1,n=2*c+2,m=n<f&&e[n]<e[m]?n:m;d[c]=d[m];e[c]=e[m];c=m}d[c]=g;e[c]=h;Ni(b,l,c)}
	function Ni(b,c,d){var e=b.a;b=b.b;for(var f=e[d],g=b[d];d>c;){var h=d-1>>1;if(b[h]>g)e[d]=e[h],b[d]=b[h],d=h;else break}e[d]=f;b[d]=g};function Oi(b,c){Li.call(this,function(c){return b.apply(null,c)},function(b){return b[0].getKey()});this.i=c;this.c=0}v(Oi,Li);Oi.prototype.h=function(b){b=b.target;var c=b.state;if(2===c||3===c||4===c)Ic(b,"change",this.h,!1,this),--this.c,this.i()};function Pi(b,c,d){for(var e=0,f;b.c<c&&e<d&&0<b.Ab();){f=b;var g=f.a,h=f.b,l=g[0];1==g.length?(g.length=0,h.length=0):(g[0]=g.pop(),h[0]=h.pop(),Mi(f,0));g=f.f(l);delete f.g[g];f=l[0];0===f.state&&(w(f,"change",b.h,!1,b),f.load(),++b.c,++e)}};function Qi(){this.a=[];this.b=this.g=0}function Ri(b,c){var d=b.b,e=.05-d,f=Math.log(.05/b.b)/-.005;return bf({source:c,duration:f,easing:function(b){return d*(Math.exp(-.005*b*f)-1)/e}})};function Si(b){Tc.call(this);this.C=null;this.Y(!0);this.handleEvent=b.handleEvent}v(Si,Tc);Si.prototype.D=function(){return this.get("active")};Si.prototype.Y=function(b){this.B("active",b)};Si.prototype.setMap=function(b){this.C=b};function Ti(b,c,d,e,f){if(void 0!==d){var g=c.ja(),h=c.na();void 0!==g&&h&&f&&0<f&&(b.ha(cf({rotation:g,duration:f,easing:Ze})),e&&b.ha(bf({source:h,duration:f,easing:Ze})));c.rotate(d,e)}}
	function Ui(b,c,d,e,f){var g=c.Z();d=c.constrainResolution(g,d,0);Vi(b,c,d,e,f)}function Vi(b,c,d,e,f){if(d){var g=c.Z(),h=c.na();void 0!==g&&h&&d!==g&&f&&0<f&&(b.ha(df({resolution:g,duration:f,easing:Ze})),e&&b.ha(bf({source:h,duration:f,easing:Ze})));if(e){var l;b=c.na();f=c.Z();void 0!==b&&void 0!==f&&(l=[e[0]-d*(e[0]-b[0])/f,e[1]-d*(e[1]-b[1])/f]);c.sa(l)}c.Ia(d)}};function Wi(b){b=b?b:{};this.a=b.delta?b.delta:1;Si.call(this,{handleEvent:Xi});this.b=b.duration?b.duration:250}v(Wi,Si);function Xi(b){var c=!1,d=b.a;if(b.type==bi){var c=b.map,e=b.coordinate,d=d.g?-this.a:this.a,f=c.R();Ui(c,f,d,e,this.b);b.preventDefault();c=!0}return!c};function Yi(b){b=b.a;return b.b&&!b.i&&b.g}function Zi(b){return"pointermove"==b.type}function $i(b){return b.type==ci}function aj(b){b=b.a;return!b.b&&!b.i&&!b.g}function bj(b){b=b.a;return!b.b&&!b.i&&b.g}function cj(b){b=b.a.target.tagName;return"INPUT"!==b&&"SELECT"!==b&&"TEXTAREA"!==b}function dj(b){return 1==b.b.pointerId};function ej(b){b=b?b:{};Si.call(this,{handleEvent:b.handleEvent?b.handleEvent:fj});this.Za=b.handleDownEvent?b.handleDownEvent:Jd;this.$a=b.handleDragEvent?b.handleDragEvent:ya;this.ab=b.handleMoveEvent?b.handleMoveEvent:ya;this.ob=b.handleUpEvent?b.handleUpEvent:Jd;this.u=!1;this.F={};this.c=[]}v(ej,Si);function gj(b){for(var c=b.length,d=0,e=0,f=0;f<c;f++)d+=b[f].clientX,e+=b[f].clientY;return[d/c,e/c]}
	function fj(b){if(!(b instanceof Yh))return!0;var c=!1,d=b.type;if(d===gi||d===ii||d===ei)d=b.b,b.type==ei?delete this.F[d.pointerId]:b.type==gi?this.F[d.pointerId]=d:d.pointerId in this.F&&(this.F[d.pointerId]=d),this.c=Cb(this.F);this.u&&(b.type==ii?this.$a(b):b.type==ei&&(this.u=this.ob(b)));b.type==gi?(this.u=b=this.Za(b),c=this.mb(b)):b.type==hi&&this.ab(b);return!c}ej.prototype.mb=Md;function hj(b){ej.call(this,{handleDownEvent:ij,handleDragEvent:jj,handleUpEvent:kj});b=b?b:{};this.a=b.kinetic;this.b=this.f=null;this.i=b.condition?b.condition:aj;this.h=!1}v(hj,ej);function jj(b){var c=gj(this.c);this.a&&this.a.a.push(c[0],c[1],Date.now());if(this.b){var d=this.b[0]-c[0],e=c[1]-this.b[1];b=b.map;var f=b.R(),g=Xe(f),e=d=[d,e],h=g.resolution;e[0]*=h;e[1]*=h;Zc(d,g.rotation);Yc(d,g.center);d=f.ac(d);b.render();f.sa(d)}this.b=c}
	function kj(b){b=b.map;var c=b.R();if(0===this.c.length){var d;if(d=!this.h&&this.a)if(d=this.a,6>d.a.length)d=!1;else{var e=Date.now()-100,f=d.a.length-3;if(d.a[f+2]<e)d=!1;else{for(var g=f-3;0<g&&d.a[g+2]>e;)g-=3;var e=d.a[f+2]-d.a[g+2],h=d.a[f]-d.a[g],f=d.a[f+1]-d.a[g+1];d.g=Math.atan2(f,h);d.b=Math.sqrt(h*h+f*f)/e;d=.05<d.b}}d&&(d=(.05-this.a.b)/-.005,f=this.a.g,g=c.na(),this.f=Ri(this.a,g),b.ha(this.f),g=b.Eb(g),d=b.ya([g[0]-d*Math.cos(f),g[1]-d*Math.sin(f)]),d=c.ac(d),c.sa(d));Ye(c,-1);b.render();
	return!1}this.b=null;return!0}function ij(b){if(0<this.c.length&&this.i(b)){var c=b.map,d=c.R();this.b=null;this.u||Ye(d,1);c.render();this.f&&Za(c.A,this.f)&&(d.sa(b.frameState.viewState.center),this.f=null);this.a&&(b=this.a,b.a.length=0,b.g=0,b.b=0);this.h=1<this.c.length;return!0}return!1}hj.prototype.mb=Jd;function lj(b){b=b?b:{};ej.call(this,{handleDownEvent:mj,handleDragEvent:nj,handleUpEvent:oj});this.b=b.condition?b.condition:Yi;this.a=void 0;this.f=b.duration?b.duration:250}v(lj,ej);function nj(b){if(dj(b)){var c=b.map,d=c.ib();b=b.pixel;d=Math.atan2(d[1]/2-b[1],b[0]-d[0]/2);if(void 0!==this.a){b=d-this.a;var e=c.R(),f=e.ja();c.render();Ti(c,e,f-b)}this.a=d}}
	function oj(b){if(!dj(b))return!0;b=b.map;var c=b.R();Ye(c,-1);var d=c.ja(),e=this.f,d=c.constrainRotation(d,0);Ti(b,c,d,void 0,e);return!1}function mj(b){return dj(b)&&nc(b.a)&&this.b(b)?(b=b.map,Ye(b.R(),1),b.render(),this.a=void 0,!0):!1}lj.prototype.mb=Jd;function pj(b){this.g=this.b=this.c=this.f=this.a=null;this.l=b}v(pj,cc);function qj(b){var c=b.c,d=b.b;b=[c,[c[0],d[1]],d,[d[0],c[1]]].map(b.a.ya,b.a);b[4]=b[0].slice();return new D([b])}pj.prototype.K=function(){this.setMap(null)};pj.prototype.h=function(b){var c=this.g,d=this.l;b.vectorContext.Yc(Infinity,function(b){b.Ca(d.f,d.g);b.ta(d.b);b.yb(c,null)})};pj.prototype.J=function(){return this.g};function rj(b){b.a&&b.c&&b.b&&b.a.render()}
	pj.prototype.setMap=function(b){this.f&&(Jc(this.f),this.f=null,this.a.render(),this.a=null);if(this.a=b)this.f=w(b,"postcompose",this.h,!1,this),rj(this)};function sj(b,c){hc.call(this,b);this.coordinate=c}v(sj,hc);function tj(b){ej.call(this,{handleDownEvent:uj,handleDragEvent:vj,handleUpEvent:wj});b=b?b:{};this.b=new pj(b.style?b.style:null);this.a=null;this.i=b.condition?b.condition:Kd}v(tj,ej);function vj(b){if(dj(b)){var c=this.b;b=b.pixel;c.c=this.a;c.b=b;c.g=qj(c);rj(c)}}tj.prototype.J=function(){return this.b.J()};tj.prototype.h=ya;
	function wj(b){if(!dj(b))return!0;this.b.setMap(null);var c=b.pixel[0]-this.a[0],d=b.pixel[1]-this.a[1];64<=c*c+d*d&&(this.h(b),y(this,new sj("boxend",b.coordinate)));return!1}function uj(b){if(dj(b)&&nc(b.a)&&this.i(b)){this.a=b.pixel;this.b.setMap(b.map);var c=this.b,d=this.a;c.c=this.a;c.b=d;c.g=qj(c);rj(c);y(this,new sj("boxstart",b.coordinate));return!0}return!1};function xj(){this.b=-1};function yj(){this.b=-1;this.b=64;this.a=Array(4);this.f=Array(this.b);this.c=this.g=0;this.reset()}v(yj,xj);yj.prototype.reset=function(){this.a[0]=1732584193;this.a[1]=4023233417;this.a[2]=2562383102;this.a[3]=271733878;this.c=this.g=0};
	function zj(b,c,d){d||(d=0);var e=Array(16);if(ja(c))for(var f=0;16>f;++f)e[f]=c.charCodeAt(d++)|c.charCodeAt(d++)<<8|c.charCodeAt(d++)<<16|c.charCodeAt(d++)<<24;else for(f=0;16>f;++f)e[f]=c[d++]|c[d++]<<8|c[d++]<<16|c[d++]<<24;c=b.a[0];d=b.a[1];var f=b.a[2],g=b.a[3],h=0,h=c+(g^d&(f^g))+e[0]+3614090360&4294967295;c=d+(h<<7&4294967295|h>>>25);h=g+(f^c&(d^f))+e[1]+3905402710&4294967295;g=c+(h<<12&4294967295|h>>>20);h=f+(d^g&(c^d))+e[2]+606105819&4294967295;f=g+(h<<17&4294967295|h>>>15);h=d+(c^f&(g^
	c))+e[3]+3250441966&4294967295;d=f+(h<<22&4294967295|h>>>10);h=c+(g^d&(f^g))+e[4]+4118548399&4294967295;c=d+(h<<7&4294967295|h>>>25);h=g+(f^c&(d^f))+e[5]+1200080426&4294967295;g=c+(h<<12&4294967295|h>>>20);h=f+(d^g&(c^d))+e[6]+2821735955&4294967295;f=g+(h<<17&4294967295|h>>>15);h=d+(c^f&(g^c))+e[7]+4249261313&4294967295;d=f+(h<<22&4294967295|h>>>10);h=c+(g^d&(f^g))+e[8]+1770035416&4294967295;c=d+(h<<7&4294967295|h>>>25);h=g+(f^c&(d^f))+e[9]+2336552879&4294967295;g=c+(h<<12&4294967295|h>>>20);h=f+
	(d^g&(c^d))+e[10]+4294925233&4294967295;f=g+(h<<17&4294967295|h>>>15);h=d+(c^f&(g^c))+e[11]+2304563134&4294967295;d=f+(h<<22&4294967295|h>>>10);h=c+(g^d&(f^g))+e[12]+1804603682&4294967295;c=d+(h<<7&4294967295|h>>>25);h=g+(f^c&(d^f))+e[13]+4254626195&4294967295;g=c+(h<<12&4294967295|h>>>20);h=f+(d^g&(c^d))+e[14]+2792965006&4294967295;f=g+(h<<17&4294967295|h>>>15);h=d+(c^f&(g^c))+e[15]+1236535329&4294967295;d=f+(h<<22&4294967295|h>>>10);h=c+(f^g&(d^f))+e[1]+4129170786&4294967295;c=d+(h<<5&4294967295|
	h>>>27);h=g+(d^f&(c^d))+e[6]+3225465664&4294967295;g=c+(h<<9&4294967295|h>>>23);h=f+(c^d&(g^c))+e[11]+643717713&4294967295;f=g+(h<<14&4294967295|h>>>18);h=d+(g^c&(f^g))+e[0]+3921069994&4294967295;d=f+(h<<20&4294967295|h>>>12);h=c+(f^g&(d^f))+e[5]+3593408605&4294967295;c=d+(h<<5&4294967295|h>>>27);h=g+(d^f&(c^d))+e[10]+38016083&4294967295;g=c+(h<<9&4294967295|h>>>23);h=f+(c^d&(g^c))+e[15]+3634488961&4294967295;f=g+(h<<14&4294967295|h>>>18);h=d+(g^c&(f^g))+e[4]+3889429448&4294967295;d=f+(h<<20&4294967295|
	h>>>12);h=c+(f^g&(d^f))+e[9]+568446438&4294967295;c=d+(h<<5&4294967295|h>>>27);h=g+(d^f&(c^d))+e[14]+3275163606&4294967295;g=c+(h<<9&4294967295|h>>>23);h=f+(c^d&(g^c))+e[3]+4107603335&4294967295;f=g+(h<<14&4294967295|h>>>18);h=d+(g^c&(f^g))+e[8]+1163531501&4294967295;d=f+(h<<20&4294967295|h>>>12);h=c+(f^g&(d^f))+e[13]+2850285829&4294967295;c=d+(h<<5&4294967295|h>>>27);h=g+(d^f&(c^d))+e[2]+4243563512&4294967295;g=c+(h<<9&4294967295|h>>>23);h=f+(c^d&(g^c))+e[7]+1735328473&4294967295;f=g+(h<<14&4294967295|
	h>>>18);h=d+(g^c&(f^g))+e[12]+2368359562&4294967295;d=f+(h<<20&4294967295|h>>>12);h=c+(d^f^g)+e[5]+4294588738&4294967295;c=d+(h<<4&4294967295|h>>>28);h=g+(c^d^f)+e[8]+2272392833&4294967295;g=c+(h<<11&4294967295|h>>>21);h=f+(g^c^d)+e[11]+1839030562&4294967295;f=g+(h<<16&4294967295|h>>>16);h=d+(f^g^c)+e[14]+4259657740&4294967295;d=f+(h<<23&4294967295|h>>>9);h=c+(d^f^g)+e[1]+2763975236&4294967295;c=d+(h<<4&4294967295|h>>>28);h=g+(c^d^f)+e[4]+1272893353&4294967295;g=c+(h<<11&4294967295|h>>>21);h=f+(g^
	c^d)+e[7]+4139469664&4294967295;f=g+(h<<16&4294967295|h>>>16);h=d+(f^g^c)+e[10]+3200236656&4294967295;d=f+(h<<23&4294967295|h>>>9);h=c+(d^f^g)+e[13]+681279174&4294967295;c=d+(h<<4&4294967295|h>>>28);h=g+(c^d^f)+e[0]+3936430074&4294967295;g=c+(h<<11&4294967295|h>>>21);h=f+(g^c^d)+e[3]+3572445317&4294967295;f=g+(h<<16&4294967295|h>>>16);h=d+(f^g^c)+e[6]+76029189&4294967295;d=f+(h<<23&4294967295|h>>>9);h=c+(d^f^g)+e[9]+3654602809&4294967295;c=d+(h<<4&4294967295|h>>>28);h=g+(c^d^f)+e[12]+3873151461&4294967295;
	g=c+(h<<11&4294967295|h>>>21);h=f+(g^c^d)+e[15]+530742520&4294967295;f=g+(h<<16&4294967295|h>>>16);h=d+(f^g^c)+e[2]+3299628645&4294967295;d=f+(h<<23&4294967295|h>>>9);h=c+(f^(d|~g))+e[0]+4096336452&4294967295;c=d+(h<<6&4294967295|h>>>26);h=g+(d^(c|~f))+e[7]+1126891415&4294967295;g=c+(h<<10&4294967295|h>>>22);h=f+(c^(g|~d))+e[14]+2878612391&4294967295;f=g+(h<<15&4294967295|h>>>17);h=d+(g^(f|~c))+e[5]+4237533241&4294967295;d=f+(h<<21&4294967295|h>>>11);h=c+(f^(d|~g))+e[12]+1700485571&4294967295;c=d+
	(h<<6&4294967295|h>>>26);h=g+(d^(c|~f))+e[3]+2399980690&4294967295;g=c+(h<<10&4294967295|h>>>22);h=f+(c^(g|~d))+e[10]+4293915773&4294967295;f=g+(h<<15&4294967295|h>>>17);h=d+(g^(f|~c))+e[1]+2240044497&4294967295;d=f+(h<<21&4294967295|h>>>11);h=c+(f^(d|~g))+e[8]+1873313359&4294967295;c=d+(h<<6&4294967295|h>>>26);h=g+(d^(c|~f))+e[15]+4264355552&4294967295;g=c+(h<<10&4294967295|h>>>22);h=f+(c^(g|~d))+e[6]+2734768916&4294967295;f=g+(h<<15&4294967295|h>>>17);h=d+(g^(f|~c))+e[13]+1309151649&4294967295;
	d=f+(h<<21&4294967295|h>>>11);h=c+(f^(d|~g))+e[4]+4149444226&4294967295;c=d+(h<<6&4294967295|h>>>26);h=g+(d^(c|~f))+e[11]+3174756917&4294967295;g=c+(h<<10&4294967295|h>>>22);h=f+(c^(g|~d))+e[2]+718787259&4294967295;f=g+(h<<15&4294967295|h>>>17);h=d+(g^(f|~c))+e[9]+3951481745&4294967295;b.a[0]=b.a[0]+c&4294967295;b.a[1]=b.a[1]+(f+(h<<21&4294967295|h>>>11))&4294967295;b.a[2]=b.a[2]+f&4294967295;b.a[3]=b.a[3]+g&4294967295}
	function Aj(b,c){var d;ca(d)||(d=c.length);for(var e=d-b.b,f=b.f,g=b.g,h=0;h<d;){if(0==g)for(;h<=e;)zj(b,c,h),h+=b.b;if(ja(c))for(;h<d;){if(f[g++]=c.charCodeAt(h++),g==b.b){zj(b,f);g=0;break}}else for(;h<d;)if(f[g++]=c[h++],g==b.b){zj(b,f);g=0;break}}b.g=g;b.c+=d};function Bj(b){b=b||{};this.b=void 0!==b.color?b.color:null;this.c=b.lineCap;this.a=void 0!==b.lineDash?b.lineDash:null;this.f=b.lineJoin;this.h=b.miterLimit;this.g=b.width;this.l=void 0}k=Bj.prototype;k.xh=function(){return this.b};k.Gf=function(){return this.c};k.yh=function(){return this.a};k.Hf=function(){return this.f};k.Kf=function(){return this.h};k.zh=function(){return this.g};k.Ah=function(b){this.b=b;this.l=void 0};k.ti=function(b){this.c=b;this.l=void 0};
	k.Bh=function(b){this.a=b;this.l=void 0};k.ui=function(b){this.f=b;this.l=void 0};k.vi=function(b){this.h=b;this.l=void 0};k.Ci=function(b){this.g=b;this.l=void 0};
	k.Ea=function(){if(void 0===this.l){var b="s"+(this.b?nf(this.b):"-")+","+(void 0!==this.c?this.c.toString():"-")+","+(this.a?this.a.toString():"-")+","+(void 0!==this.f?this.f:"-")+","+(void 0!==this.h?this.h.toString():"-")+","+(void 0!==this.g?this.g.toString():"-"),c=new yj;Aj(c,b);var d=Array((56>c.g?c.b:2*c.b)-c.g);d[0]=128;for(b=1;b<d.length-8;++b)d[b]=0;for(var e=8*c.c,b=d.length-8;b<d.length;++b)d[b]=e&255,e/=256;Aj(c,d);d=Array(16);for(b=e=0;4>b;++b)for(var f=0;32>f;f+=8)d[e++]=c.a[b]>>>
	f&255;if(8192>=d.length)c=String.fromCharCode.apply(null,d);else for(c="",b=0;b<d.length;b+=8192)c+=String.fromCharCode.apply(null,db(d,b,b+8192));this.l=c}return this.l};var Cj=[0,0,0,1],Dj=[],Ej=[0,0,0,1];function Fj(b){b=b||{};this.a=void 0!==b.color?b.color:null;this.b=void 0}Fj.prototype.g=function(){return this.a};Fj.prototype.c=function(b){this.a=b;this.b=void 0};Fj.prototype.Ea=function(){void 0===this.b&&(this.b="f"+(this.a?nf(this.a):"-"));return this.b};function Gj(b){b=b||{};this.h=this.a=this.f=null;this.c=void 0!==b.fill?b.fill:null;this.b=void 0!==b.stroke?b.stroke:null;this.g=b.radius;this.i=[0,0];this.j=this.l=null;var c=b.atlasManager,d=null,e,f=0;this.b&&(e=nf(this.b.b),f=this.b.g,void 0===f&&(f=1),d=this.b.a,oh||(d=null));var g=2*(this.g+f)+1;e={strokeStyle:e,Rb:f,size:g,lineDash:d};if(void 0===c){this.a=document.createElement("CANVAS");this.a.height=g;this.a.width=g;var g=this.a.width,h=this.a.getContext("2d");this.ue(e,h,0,0);this.c?this.h=
	this.a:(h=this.h=document.createElement("CANVAS"),h.height=e.size,h.width=e.size,h=h.getContext("2d"),this.te(e,h,0,0))}else g=Math.round(g),(d=!this.c)&&(h=ua(this.te,this,e)),f=this.Ea(),h=c.add(f,g,g,ua(this.ue,this,e),h),this.a=h.image,this.i=[h.offsetX,h.offsetY],this.h=d?h.me:this.a;this.l=[g/2,g/2];this.j=[g,g];zi.call(this,{opacity:1,rotateWithView:!1,rotation:0,scale:1,snapToPixel:void 0!==b.snapToPixel?b.snapToPixel:!0})}v(Gj,zi);k=Gj.prototype;k.eb=function(){return this.l};k.oh=function(){return this.c};
	k.pd=function(){return this.h};k.Wa=function(){return this.a};k.Ob=function(){return 2};k.za=function(){return this.i};k.ph=function(){return this.g};k.La=function(){return this.j};k.qh=function(){return this.b};k.jd=ya;k.load=ya;k.Bd=ya;
	k.ue=function(b,c,d,e){c.setTransform(1,0,0,1,0,0);c.translate(d,e);c.beginPath();c.arc(b.size/2,b.size/2,this.g,0,2*Math.PI,!0);this.c&&(c.fillStyle=nf(this.c.a),c.fill());this.b&&(c.strokeStyle=b.strokeStyle,c.lineWidth=b.Rb,b.lineDash&&c.setLineDash(b.lineDash),c.stroke());c.closePath()};
	k.te=function(b,c,d,e){c.setTransform(1,0,0,1,0,0);c.translate(d,e);c.beginPath();c.arc(b.size/2,b.size/2,this.g,0,2*Math.PI,!0);c.fillStyle=nf(Cj);c.fill();this.b&&(c.strokeStyle=b.strokeStyle,c.lineWidth=b.Rb,b.lineDash&&c.setLineDash(b.lineDash),c.stroke());c.closePath()};k.Ea=function(){var b=this.b?this.b.Ea():"-",c=this.c?this.c.Ea():"-";this.f&&b==this.f[1]&&c==this.f[2]&&this.g==this.f[3]||(this.f=["c"+b+c+(void 0!==this.g?this.g.toString():"-"),b,c,this.g]);return this.f[0]};function Hj(b){b=b||{};this.l=null;this.c=Ij;void 0!==b.geometry&&this.xe(b.geometry);this.f=void 0!==b.fill?b.fill:null;this.h=void 0!==b.image?b.image:null;this.g=void 0!==b.stroke?b.stroke:null;this.b=void 0!==b.text?b.text:null;this.a=b.zIndex}k=Hj.prototype;k.J=function(){return this.l};k.Af=function(){return this.c};k.Ch=function(){return this.f};k.Dh=function(){return this.h};k.Eh=function(){return this.g};k.Fh=function(){return this.b};k.Gh=function(){return this.a};
	k.xe=function(b){la(b)?this.c=b:ja(b)?this.c=function(c){return c.get(b)}:b?void 0!==b&&(this.c=function(){return b}):this.c=Ij;this.l=b};k.Hh=function(b){this.a=b};function Jj(b){if(!la(b)){var c;c=ha(b)?b:[b];b=function(){return c}}return b}var Kj=null;function Lj(){if(!Kj){var b=new Fj({color:"rgba(255,255,255,0.4)"}),c=new Bj({color:"#3399CC",width:1.25});Kj=[new Hj({image:new Gj({fill:b,stroke:c,radius:5}),fill:b,stroke:c})]}return Kj}
	function Mj(){var b={},c=[255,255,255,1],d=[0,153,255,1];b.Polygon=[new Hj({fill:new Fj({color:[255,255,255,.5]})})];b.MultiPolygon=b.Polygon;b.LineString=[new Hj({stroke:new Bj({color:c,width:5})}),new Hj({stroke:new Bj({color:d,width:3})})];b.MultiLineString=b.LineString;b.Circle=b.Polygon.concat(b.LineString);b.Point=[new Hj({image:new Gj({radius:6,fill:new Fj({color:d}),stroke:new Bj({color:c,width:1.5})}),zIndex:Infinity})];b.MultiPoint=b.Point;b.GeometryCollection=b.Polygon.concat(b.LineString,
	b.Point);return b}function Ij(b){return b.J()};function Nj(b){var c=b?b:{};b=c.condition?c.condition:bj;this.f=c.duration?c.duration:200;c=c.style?c.style:new Hj({stroke:new Bj({color:[0,0,255,1]})});tj.call(this,{condition:b,style:c})}v(Nj,tj);Nj.prototype.h=function(){var b=this.C,c=b.R(),d=b.ib(),e=this.J().v(),d=c.constrainResolution(Math.max(Fd(e)/d[0],Cd(e)/d[1])),f=c.Z(),g=c.na();b.ha(df({resolution:f,duration:this.f,easing:Ze}));b.ha(bf({source:g,duration:this.f,easing:Ze}));c.sa(Ad(e));c.Ia(d)};function Oj(b){Si.call(this,{handleEvent:Pj});b=b||{};this.a=void 0!==b.condition?b.condition:Od(aj,cj);this.b=void 0!==b.duration?b.duration:100;this.c=void 0!==b.pixelDelta?b.pixelDelta:128}v(Oj,Si);
	function Pj(b){var c=!1;if("key"==b.type){var d=b.a.c;if(this.a(b)&&(40==d||37==d||39==d||38==d)){var e=b.map,c=e.R(),f=c.Z()*this.c,g=0,h=0;40==d?h=-f:37==d?g=-f:39==d?g=f:h=f;d=[g,h];Zc(d,c.ja());f=this.b;if(g=c.na())f&&0<f&&e.ha(bf({source:g,duration:f,easing:af})),e=c.ac([g[0]+d[0],g[1]+d[1]]),c.sa(e);b.preventDefault();c=!0}}return!c};function Qj(b){Si.call(this,{handleEvent:Rj});b=b?b:{};this.b=b.condition?b.condition:cj;this.a=b.delta?b.delta:1;this.c=b.duration?b.duration:100}v(Qj,Si);function Rj(b){var c=!1;if("key"==b.type){var d=b.a.o;if(this.b(b)&&(43==d||45==d)){c=b.map;d=43==d?this.a:-this.a;c.render();var e=c.R();Ui(c,e,d,void 0,this.c);b.preventDefault();c=!0}}return!c};function Sj(b){Si.call(this,{handleEvent:Tj});b=b||{};this.a=0;this.i=void 0!==b.duration?b.duration:250;this.j=void 0!==b.useAnchor?b.useAnchor:!0;this.c=null;this.f=this.b=void 0}v(Sj,Si);function Tj(b){var c=!1;if("mousewheel"==b.type){var c=b.map,d=b.a;this.j&&(this.c=b.coordinate);this.a+=d.L;void 0===this.b&&(this.b=Date.now());d=Math.max(80-(Date.now()-this.b),0);ba.clearTimeout(this.f);this.f=ba.setTimeout(ua(this.h,this,c),d);b.preventDefault();c=!0}return!c}
	Sj.prototype.h=function(b){var c=Na(this.a,-1,1),d=b.R();b.render();Ui(b,d,-c,this.c,this.i);this.a=0;this.c=null;this.f=this.b=void 0};function Uj(b){ej.call(this,{handleDownEvent:Vj,handleDragEvent:Wj,handleUpEvent:Xj});b=b||{};this.b=null;this.f=void 0;this.a=!1;this.h=0;this.j=void 0!==b.threshold?b.threshold:.3;this.i=void 0!==b.duration?b.duration:250}v(Uj,ej);
	function Wj(b){var c=0,d=this.c[0],e=this.c[1],d=Math.atan2(e.clientY-d.clientY,e.clientX-d.clientX);void 0!==this.f&&(c=d-this.f,this.h+=c,!this.a&&Math.abs(this.h)>this.j&&(this.a=!0));this.f=d;b=b.map;d=Rf(b.a);e=gj(this.c);e[0]-=d.x;e[1]-=d.y;this.b=b.ya(e);this.a&&(d=b.R(),e=d.ja(),b.render(),Ti(b,d,e+c,this.b))}function Xj(b){if(2>this.c.length){b=b.map;var c=b.R();Ye(c,-1);if(this.a){var d=c.ja(),e=this.b,f=this.i,d=c.constrainRotation(d,0);Ti(b,c,d,e,f)}return!1}return!0}
	function Vj(b){return 2<=this.c.length?(b=b.map,this.b=null,this.f=void 0,this.a=!1,this.h=0,this.u||Ye(b.R(),1),b.render(),!0):!1}Uj.prototype.mb=Jd;function Yj(b){ej.call(this,{handleDownEvent:Zj,handleDragEvent:ak,handleUpEvent:bk});b=b?b:{};this.b=null;this.h=void 0!==b.duration?b.duration:400;this.a=void 0;this.f=1}v(Yj,ej);function ak(b){var c=1,d=this.c[0],e=this.c[1],f=d.clientX-e.clientX,d=d.clientY-e.clientY,f=Math.sqrt(f*f+d*d);void 0!==this.a&&(c=this.a/f);this.a=f;1!=c&&(this.f=c);b=b.map;var f=b.R(),d=f.Z(),e=Rf(b.a),g=gj(this.c);g[0]-=e.x;g[1]-=e.y;this.b=b.ya(g);b.render();Vi(b,f,d*c,this.b)}
	function bk(b){if(2>this.c.length){b=b.map;var c=b.R();Ye(c,-1);var d=c.Z(),e=this.b,f=this.h,d=c.constrainResolution(d,0,this.f-1);Vi(b,c,d,e,f);return!1}return!0}function Zj(b){return 2<=this.c.length?(b=b.map,this.b=null,this.a=void 0,this.f=1,this.u||Ye(b.R(),1),b.render(),!0):!1}Yj.prototype.mb=Jd;function ck(b){b=b?b:{};var c=new F,d=new Qi;(void 0!==b.altShiftDragRotate?b.altShiftDragRotate:1)&&c.push(new lj);(void 0!==b.doubleClickZoom?b.doubleClickZoom:1)&&c.push(new Wi({delta:b.zoomDelta,duration:b.zoomDuration}));(void 0!==b.dragPan?b.dragPan:1)&&c.push(new hj({kinetic:d}));(void 0!==b.pinchRotate?b.pinchRotate:1)&&c.push(new Uj);(void 0!==b.pinchZoom?b.pinchZoom:1)&&c.push(new Yj({duration:b.zoomDuration}));if(void 0!==b.keyboard?b.keyboard:1)c.push(new Oj),c.push(new Qj({delta:b.zoomDelta,
	duration:b.zoomDuration}));(void 0!==b.mouseWheelZoom?b.mouseWheelZoom:1)&&c.push(new Sj({duration:b.zoomDuration}));(void 0!==b.shiftDragZoom?b.shiftDragZoom:1)&&c.push(new Nj);return c};function M(b){var c=b||{};b=Gb(c);delete b.layers;c=c.layers;ki.call(this,b);this.b=[];this.a={};w(this,Vc("layers"),this.jg,!1,this);c?ha(c)&&(c=new F(c.slice())):c=new F;this.Ge(c)}v(M,ki);k=M.prototype;k.mc=function(){this.Ra()&&this.s()};
	k.jg=function(){this.b.forEach(Jc);this.b.length=0;var b=this.jb();this.b.push(w(b,"add",this.ig,!1,this),w(b,"remove",this.kg,!1,this));zb(this.a,function(b){b.forEach(Jc)});Fb(this.a);var b=b.a,c,d,e;c=0;for(d=b.length;c<d;c++)e=b[c],this.a[pa(e).toString()]=[w(e,"propertychange",this.mc,!1,this),w(e,"change",this.mc,!1,this)];this.s()};k.ig=function(b){b=b.element;var c=pa(b).toString();this.a[c]=[w(b,"propertychange",this.mc,!1,this),w(b,"change",this.mc,!1,this)];this.s()};
	k.kg=function(b){b=pa(b.element).toString();this.a[b].forEach(Jc);delete this.a[b];this.s()};k.jb=function(){return this.get("layers")};k.Ge=function(b){this.B("layers",b)};
	k.cd=function(b){var c=void 0!==b?b:[],d=c.length;this.jb().forEach(function(b){b.cd(c)});b=li(this);var e,f;for(e=c.length;d<e;d++)f=c[d],f.opacity*=b.opacity,f.visible=f.visible&&b.visible,f.maxResolution=Math.min(f.maxResolution,b.maxResolution),f.minResolution=Math.max(f.minResolution,b.minResolution),void 0!==b.extent&&(f.extent=void 0!==f.extent?Dd(f.extent,b.extent):b.extent);return c};k.ed=function(){return"ready"};function dk(b){Td.call(this,{code:b,units:"m",extent:ek,global:!0,worldExtent:fk})}v(dk,Td);dk.prototype.getPointResolution=function(b,c){var d=c[1]/6378137;return b/((Math.exp(d)+Math.exp(-d))/2)};var gk=6378137*Math.PI,ek=[-gk,-gk,gk,gk],fk=[-180,-85,180,85],ce="EPSG:3857 EPSG:102100 EPSG:102113 EPSG:900913 urn:ogc:def:crs:EPSG:6.18:3:3857 urn:ogc:def:crs:EPSG::3857 http://www.opengis.net/gml/srs/epsg.xml#3857".split(" ").map(function(b){return new dk(b)});
	function de(b,c,d){var e=b.length;d=1<d?d:2;void 0===c&&(2<d?c=b.slice():c=Array(e));for(var f=0;f<e;f+=d)c[f]=6378137*Math.PI*b[f]/180,c[f+1]=6378137*Math.log(Math.tan(Math.PI*(b[f+1]+90)/360));return c}function ee(b,c,d){var e=b.length;d=1<d?d:2;void 0===c&&(2<d?c=b.slice():c=Array(e));for(var f=0;f<e;f+=d)c[f]=180*b[f]/(6378137*Math.PI),c[f+1]=360*Math.atan(Math.exp(b[f+1]/6378137))/Math.PI-90;return c};function hk(b,c){Td.call(this,{code:b,units:"degrees",extent:ik,axisOrientation:c,global:!0,worldExtent:ik})}v(hk,Td);hk.prototype.getPointResolution=function(b){return b};
	var ik=[-180,-90,180,90],fe=[new hk("CRS:84"),new hk("EPSG:4326","neu"),new hk("urn:ogc:def:crs:EPSG::4326","neu"),new hk("urn:ogc:def:crs:EPSG:6.6:4326","neu"),new hk("urn:ogc:def:crs:OGC:1.3:CRS84"),new hk("urn:ogc:def:crs:OGC:2:84"),new hk("http://www.opengis.net/gml/srs/epsg.xml#4326","neu"),new hk("urn:x-ogc:def:crs:EPSG:4326","neu")];function jk(){Yd(ce);Yd(fe);be()};function G(b){oi.call(this,b?b:{})}v(G,oi);function H(b){b=b?b:{};var c=Gb(b);delete c.preload;delete c.useInterimTilesOnError;oi.call(this,c);this.i(void 0!==b.preload?b.preload:0);this.j(void 0!==b.useInterimTilesOnError?b.useInterimTilesOnError:!0)}v(H,oi);H.prototype.f=function(){return this.get("preload")};H.prototype.i=function(b){this.B("preload",b)};H.prototype.h=function(){return this.get("useInterimTilesOnError")};H.prototype.j=function(b){this.B("useInterimTilesOnError",b)};function J(b){b=b?b:{};var c=Gb(b);delete c.style;delete c.renderBuffer;delete c.updateWhileAnimating;delete c.updateWhileInteracting;oi.call(this,c);this.i=void 0!==b.renderBuffer?b.renderBuffer:100;this.h=null;this.f=void 0;this.j(b.style);this.C=void 0!==b.updateWhileAnimating?b.updateWhileAnimating:!1;this.w=void 0!==b.updateWhileInteracting?b.updateWhileInteracting:!1}v(J,oi);J.prototype.o=function(){return this.h};J.prototype.u=function(){return this.f};
	J.prototype.j=function(b){this.h=void 0!==b?b:Lj;this.f=null===b?void 0:Jj(this.h);this.s()};function kk(b,c,d,e,f){this.u={};this.g=b;this.w=c;this.f=d;this.D=e;this.ob=f;this.h=this.a=this.b=this.va=this.la=this.Da=null;this.Na=this.Ja=this.L=this.Y=this.N=this.F=0;this.Oa=!1;this.i=this.Pa=0;this.Sb=!1;this.fa=0;this.c="";this.o=this.A=this.$a=this.Za=0;this.ga=this.H=this.j=null;this.C=[];this.ab=bd()}
	function lk(b,c,d){if(b.h){c=oe(c,0,d,2,b.D,b.C);d=b.g;var e=b.ab,f=d.globalAlpha;1!=b.L&&(d.globalAlpha=f*b.L);var g=b.Pa;b.Oa&&(g+=b.ob);var h,l;h=0;for(l=c.length;h<l;h+=2){var m=c[h]-b.F,n=c[h+1]-b.N;b.Sb&&(m=m+.5|0,n=n+.5|0);if(0!==g||1!=b.i){var p=m+b.F,q=n+b.N;ri(e,p,q,b.i,b.i,g,-p,-q);d.setTransform(e[0],e[1],e[4],e[5],e[12],e[13])}d.drawImage(b.h,b.Ja,b.Na,b.fa,b.Y,m,n,b.fa,b.Y)}0===g&&1==b.i||d.setTransform(1,0,0,1,0,0);1!=b.L&&(d.globalAlpha=f)}}
	function mk(b,c,d,e){var f=0;if(b.ga&&""!==b.c){b.j&&nk(b,b.j);b.H&&ok(b,b.H);var g=b.ga,h=b.g,l=b.va;l?(l.font!=g.font&&(l.font=h.font=g.font),l.textAlign!=g.textAlign&&(l.textAlign=h.textAlign=g.textAlign),l.textBaseline!=g.textBaseline&&(l.textBaseline=h.textBaseline=g.textBaseline)):(h.font=g.font,h.textAlign=g.textAlign,h.textBaseline=g.textBaseline,b.va={font:g.font,textAlign:g.textAlign,textBaseline:g.textBaseline});c=oe(c,f,d,e,b.D,b.C);for(g=b.g;f<d;f+=e){h=c[f]+b.Za;l=c[f+1]+b.$a;if(0!==
	b.A||1!=b.o){var m=ri(b.ab,h,l,b.o,b.o,b.A,-h,-l);g.setTransform(m[0],m[1],m[4],m[5],m[12],m[13])}b.H&&g.strokeText(b.c,h,l);b.j&&g.fillText(b.c,h,l)}0===b.A&&1==b.o||g.setTransform(1,0,0,1,0,0)}}function pk(b,c,d,e,f,g){var h=b.g;b=oe(c,d,e,f,b.D,b.C);h.moveTo(b[0],b[1]);for(c=2;c<b.length;c+=2)h.lineTo(b[c],b[c+1]);g&&h.lineTo(b[0],b[1]);return e}function qk(b,c,d,e,f){var g=b.g,h,l;h=0;for(l=e.length;h<l;++h)d=pk(b,c,d,e[h],f,!0),g.closePath();return d}k=kk.prototype;
	k.Yc=function(b,c){var d=b.toString(),e=this.u[d];void 0!==e?e.push(c):this.u[d]=[c]};k.bc=function(b){if(Ed(this.f,b.v())){if(this.b||this.a){this.b&&nk(this,this.b);this.a&&ok(this,this.a);var c;c=(c=b.a)?oe(c,0,c.length,b.b,this.D,this.C):null;var d=c[2]-c[0],e=c[3]-c[1],d=Math.sqrt(d*d+e*e),e=this.g;e.beginPath();e.arc(c[0],c[1],d,0,2*Math.PI);this.b&&e.fill();this.a&&e.stroke()}""!==this.c&&mk(this,b.Hb(),2,2)}};
	k.sf=function(b,c){var d=(0,c.c)(b);if(d&&Ed(this.f,d.v())){var e=c.a;void 0===e&&(e=0);this.Yc(e,function(b){b.Ca(c.f,c.g);b.Pb(c.h);b.ta(c.b);rk[d.P()].call(b,d,null)})}};k.tf=function(b,c){var d=b.h,e,f;e=0;for(f=d.length;e<f;++e){var g=d[e];rk[g.P()].call(this,g,c)}};k.gc=function(b){var c=b.a;b=b.b;this.h&&lk(this,c,c.length);""!==this.c&&mk(this,c,c.length,b)};k.ec=function(b){var c=b.a;b=b.b;this.h&&lk(this,c,c.length);""!==this.c&&mk(this,c,c.length,b)};
	k.cc=function(b){if(Ed(this.f,b.v())){if(this.a){ok(this,this.a);var c=this.g,d=b.a;c.beginPath();pk(this,d,0,d.length,b.b,!1);c.stroke()}""!==this.c&&(b=sk(b),mk(this,b,2,2))}};k.dc=function(b){var c=b.v();if(Ed(this.f,c)){if(this.a){ok(this,this.a);var c=this.g,d=b.a,e=0,f=b.f,g=b.b;c.beginPath();var h,l;h=0;for(l=f.length;h<l;++h)e=pk(this,d,e,f[h],g,!1);c.stroke()}""!==this.c&&(b=tk(b),mk(this,b,b.length,2))}};
	k.yb=function(b){if(Ed(this.f,b.v())){if(this.a||this.b){this.b&&nk(this,this.b);this.a&&ok(this,this.a);var c=this.g;c.beginPath();qk(this,Se(b),0,b.f,b.b);this.b&&c.fill();this.a&&c.stroke()}""!==this.c&&(b=Te(b),mk(this,b,2,2))}};
	k.fc=function(b){if(Ed(this.f,b.v())){if(this.a||this.b){this.b&&nk(this,this.b);this.a&&ok(this,this.a);var c=this.g,d=uk(b),e=0,f=b.f,g=b.b,h,l;h=0;for(l=f.length;h<l;++h){var m=f[h];c.beginPath();e=qk(this,d,e,m,g);this.b&&c.fill();this.a&&c.stroke()}}""!==this.c&&(b=vk(b),mk(this,b,b.length,2))}};function wk(b){var c=Object.keys(b.u).map(Number);eb(c);var d,e,f,g,h;d=0;for(e=c.length;d<e;++d)for(f=b.u[c[d].toString()],g=0,h=f.length;g<h;++g)f[g](b)}
	function nk(b,c){var d=b.g,e=b.Da;e?e.fillStyle!=c.fillStyle&&(e.fillStyle=d.fillStyle=c.fillStyle):(d.fillStyle=c.fillStyle,b.Da={fillStyle:c.fillStyle})}
	function ok(b,c){var d=b.g,e=b.la;e?(e.lineCap!=c.lineCap&&(e.lineCap=d.lineCap=c.lineCap),oh&&!ib(e.lineDash,c.lineDash)&&d.setLineDash(e.lineDash=c.lineDash),e.lineJoin!=c.lineJoin&&(e.lineJoin=d.lineJoin=c.lineJoin),e.lineWidth!=c.lineWidth&&(e.lineWidth=d.lineWidth=c.lineWidth),e.miterLimit!=c.miterLimit&&(e.miterLimit=d.miterLimit=c.miterLimit),e.strokeStyle!=c.strokeStyle&&(e.strokeStyle=d.strokeStyle=c.strokeStyle)):(d.lineCap=c.lineCap,oh&&d.setLineDash(c.lineDash),d.lineJoin=c.lineJoin,d.lineWidth=
	c.lineWidth,d.miterLimit=c.miterLimit,d.strokeStyle=c.strokeStyle,b.la={lineCap:c.lineCap,lineDash:c.lineDash,lineJoin:c.lineJoin,lineWidth:c.lineWidth,miterLimit:c.miterLimit,strokeStyle:c.strokeStyle})}
	k.Ca=function(b,c){if(b){var d=b.a;this.b={fillStyle:nf(d?d:Cj)}}else this.b=null;if(c){var d=c.b,e=c.c,f=c.a,g=c.f,h=c.g,l=c.h;this.a={lineCap:void 0!==e?e:"round",lineDash:f?f:Dj,lineJoin:void 0!==g?g:"round",lineWidth:this.w*(void 0!==h?h:1),miterLimit:void 0!==l?l:10,strokeStyle:nf(d?d:Ej)}}else this.a=null};
	k.Pb=function(b){if(b){var c=b.eb(),d=b.Wa(1),e=b.za(),f=b.La();this.F=c[0];this.N=c[1];this.Y=f[1];this.h=d;this.L=b.o;this.Ja=e[0];this.Na=e[1];this.Oa=b.u;this.Pa=b.H;this.i=b.L;this.Sb=b.C;this.fa=f[0]}else this.h=null};
	k.ta=function(b){if(b){var c=b.b;c?(c=c.a,this.j={fillStyle:nf(c?c:Cj)}):this.j=null;var d=b.f;if(d){var c=d.b,e=d.c,f=d.a,g=d.f,h=d.g,d=d.h;this.H={lineCap:void 0!==e?e:"round",lineDash:f?f:Dj,lineJoin:void 0!==g?g:"round",lineWidth:void 0!==h?h:1,miterLimit:void 0!==d?d:10,strokeStyle:nf(c?c:Ej)}}else this.H=null;var c=b.a,e=b.j,f=b.o,g=b.g,h=b.c,d=b.h,l=b.l;b=b.i;this.ga={font:void 0!==c?c:"10px sans-serif",textAlign:void 0!==l?l:"center",textBaseline:void 0!==b?b:"middle"};this.c=void 0!==d?d:
	"";this.Za=void 0!==e?this.w*e:0;this.$a=void 0!==f?this.w*f:0;this.A=void 0!==g?g:0;this.o=this.w*(void 0!==h?h:1)}else this.c=""};var rk={Point:kk.prototype.gc,LineString:kk.prototype.cc,Polygon:kk.prototype.yb,MultiPoint:kk.prototype.ec,MultiLineString:kk.prototype.dc,MultiPolygon:kk.prototype.fc,GeometryCollection:kk.prototype.tf,Circle:kk.prototype.bc};function xk(b){ti.call(this,b);this.F=bd()}v(xk,ti);
	xk.prototype.u=function(b,c,d){yk(this,"precompose",d,b,void 0);var e=this.Kb();if(e){var f=c.extent,g=void 0!==f;if(g){var h=b.pixelRatio,l=zd(f),m=yd(f),n=xd(f),f=wd(f);si(b.coordinateToPixelMatrix,l,l);si(b.coordinateToPixelMatrix,m,m);si(b.coordinateToPixelMatrix,n,n);si(b.coordinateToPixelMatrix,f,f);d.save();d.beginPath();d.moveTo(l[0]*h,l[1]*h);d.lineTo(m[0]*h,m[1]*h);d.lineTo(n[0]*h,n[1]*h);d.lineTo(f[0]*h,f[1]*h);d.clip()}h=this.bd();l=d.globalAlpha;d.globalAlpha=c.opacity;0===b.viewState.rotation?
	d.drawImage(e,0,0,+e.width,+e.height,Math.round(h[12]),Math.round(h[13]),Math.round(e.width*h[0]),Math.round(e.height*h[5])):(d.setTransform(h[0],h[1],h[4],h[5],h[12],h[13]),d.drawImage(e,0,0),d.setTransform(1,0,0,1,0,0));d.globalAlpha=l;g&&d.restore()}yk(this,"postcompose",d,b,void 0)};function yk(b,c,d,e,f){var g=b.a;Qc(g,c)&&(b=void 0!==f?f:zk(b,e,0),b=new kk(d,e.pixelRatio,e.extent,b,e.viewState.rotation),y(g,new ni(c,g,b,e,d,null)),wk(b))}
	function zk(b,c,d){var e=c.viewState,f=c.pixelRatio;return ri(b.F,f*c.size[0]/2,f*c.size[1]/2,f/e.resolution,-f/e.resolution,-e.rotation,-e.center[0]+d,-e.center[1])}function Ak(b,c){var d=[0,0];si(c,b,d);return d}
	var Bk=function(){var b=null,c=null;return function(d){if(!b){b=mh(1,1);c=b.createImageData(1,1);var e=c.data;e[0]=42;e[1]=84;e[2]=126;e[3]=255}var e=b.canvas,f=d[0]<=e.width&&d[1]<=e.height;f||(e.width=d[0],e.height=d[1],e=d[0]-1,d=d[1]-1,b.putImageData(c,e,d),d=b.getImageData(e,d,1,1),f=ib(c.data,d.data));return f}}();var Ck=["Polygon","LineString","Image","Text"];function Dk(b,c,d){this.va=b;this.fa=c;this.c=null;this.f=0;this.resolution=d;this.N=this.F=null;this.b=[];this.coordinates=[];this.Da=bd();this.a=[];this.ga=[];this.la=bd()}v(Dk,mi);
	function Ek(b,c,d,e,f,g){var h=b.coordinates.length,l=b.$c(),m=[c[d],c[d+1]],n=[NaN,NaN],p=!0,q,r,t;for(q=d+f;q<e;q+=f)n[0]=c[q],n[1]=c[q+1],t=md(l,n),t!==r?(p&&(b.coordinates[h++]=m[0],b.coordinates[h++]=m[1]),b.coordinates[h++]=n[0],b.coordinates[h++]=n[1],p=!1):1===t?(b.coordinates[h++]=n[0],b.coordinates[h++]=n[1],p=!1):p=!0,m[0]=n[0],m[1]=n[1],r=t;q===d+f&&(b.coordinates[h++]=m[0],b.coordinates[h++]=m[1]);g&&(b.coordinates[h++]=c[d],b.coordinates[h++]=c[d+1]);return h}
	function Fk(b,c){b.F=[0,c,0];b.b.push(b.F);b.N=[0,c,0];b.a.push(b.N)}
	function Gk(b,c,d,e,f,g,h,l,m){var n;n=b.Da;if(e[0]==n[0]&&e[1]==n[1]&&e[4]==n[4]&&e[5]==n[5]&&e[12]==n[12]&&e[13]==n[13])n=b.ga;else{n=oe(b.coordinates,0,b.coordinates.length,2,e,b.ga);var p=b.Da;p[0]=e[0];p[1]=e[1];p[2]=e[2];p[3]=e[3];p[4]=e[4];p[5]=e[5];p[6]=e[6];p[7]=e[7];p[8]=e[8];p[9]=e[9];p[10]=e[10];p[11]=e[11];p[12]=e[12];p[13]=e[13];p[14]=e[14];p[15]=e[15]}e=0;var p=h.length,q=0,r;for(b=b.la;e<p;){var t=h[e],A,K,U,x;switch(t[0]){case 0:q=t[1];r=pa(q).toString();void 0===g[r]&&q.J()?void 0===
	m||Ed(m,q.J().v())?++e:e=t[2]:e=t[2];break;case 1:c.beginPath();++e;break;case 2:q=t[1];r=n[q];var L=n[q+1],V=n[q+2]-r,q=n[q+3]-L;c.arc(r,L,Math.sqrt(V*V+q*q),0,2*Math.PI,!0);++e;break;case 3:c.closePath();++e;break;case 4:q=t[1];r=t[2];A=t[3];U=t[4]*d;var X=t[5]*d,da=t[6];K=t[7];var oa=t[8],na=t[9],L=t[11],V=t[12],fa=t[13],S=t[14];for(t[10]&&(L+=f);q<r;q+=2){t=n[q]-U;x=n[q+1]-X;fa&&(t=t+.5|0,x=x+.5|0);if(1!=V||0!==L){var I=t+U,xa=x+X;ri(b,I,xa,V,V,L,-I,-xa);c.setTransform(b[0],b[1],b[4],b[5],b[12],
	b[13])}I=c.globalAlpha;1!=K&&(c.globalAlpha=I*K);c.drawImage(A,oa,na,S,da,t,x,S*d,da*d);1!=K&&(c.globalAlpha=I);1==V&&0===L||c.setTransform(1,0,0,1,0,0)}++e;break;case 5:q=t[1];r=t[2];U=t[3];X=t[4]*d;da=t[5]*d;L=t[6];V=t[7]*d;A=t[8];for(K=t[9];q<r;q+=2){t=n[q]+X;x=n[q+1]+da;if(1!=V||0!==L)ri(b,t,x,V,V,L,-t,-x),c.setTransform(b[0],b[1],b[4],b[5],b[12],b[13]);K&&c.strokeText(U,t,x);A&&c.fillText(U,t,x);1==V&&0===L||c.setTransform(1,0,0,1,0,0)}++e;break;case 6:if(void 0!==l&&(q=t[1],q=l(q)))return q;
	++e;break;case 7:c.fill();++e;break;case 8:q=t[1];r=t[2];c.moveTo(n[q],n[q+1]);for(q+=2;q<r;q+=2)c.lineTo(n[q],n[q+1]);++e;break;case 9:c.fillStyle=t[1];++e;break;case 10:q=void 0!==t[7]?t[7]:!0;r=t[2];c.strokeStyle=t[1];c.lineWidth=q?r*d:r;c.lineCap=t[3];c.lineJoin=t[4];c.miterLimit=t[5];oh&&c.setLineDash(t[6]);++e;break;case 11:c.font=t[1];c.textAlign=t[2];c.textBaseline=t[3];++e;break;case 12:c.stroke();++e;break;default:++e}}}
	function Hk(b){var c=b.a;c.reverse();var d,e=c.length,f,g,h=-1;for(d=0;d<e;++d)if(f=c[d],g=f[0],6==g)h=d;else if(0==g){f[2]=d;f=b.a;for(g=d;h<g;){var l=f[h];f[h]=f[g];f[g]=l;++h;--g}h=-1}}function Ik(b,c){b.F[2]=b.b.length;b.F=null;b.N[2]=b.a.length;b.N=null;var d=[6,c];b.b.push(d);b.a.push(d)}Dk.prototype.Ac=ya;Dk.prototype.$c=function(){return this.fa};function Jk(b,c,d){Dk.call(this,b,c,d);this.j=this.Y=null;this.D=this.A=this.w=this.C=this.u=this.L=this.H=this.o=this.i=this.h=this.g=void 0}
	v(Jk,Dk);Jk.prototype.gc=function(b,c){if(this.j){Fk(this,c);var d=b.a,e=this.coordinates.length,d=Ek(this,d,0,d.length,b.b,!1);this.b.push([4,e,d,this.j,this.g,this.h,this.i,this.o,this.H,this.L,this.u,this.C,this.w,this.A,this.D]);this.a.push([4,e,d,this.Y,this.g,this.h,this.i,this.o,this.H,this.L,this.u,this.C,this.w,this.A,this.D]);Ik(this,c)}};
	Jk.prototype.ec=function(b,c){if(this.j){Fk(this,c);var d=b.a,e=this.coordinates.length,d=Ek(this,d,0,d.length,b.b,!1);this.b.push([4,e,d,this.j,this.g,this.h,this.i,this.o,this.H,this.L,this.u,this.C,this.w,this.A,this.D]);this.a.push([4,e,d,this.Y,this.g,this.h,this.i,this.o,this.H,this.L,this.u,this.C,this.w,this.A,this.D]);Ik(this,c)}};Jk.prototype.Ac=function(){Hk(this);this.h=this.g=void 0;this.j=this.Y=null;this.D=this.A=this.C=this.u=this.L=this.H=this.o=this.w=this.i=void 0};
	Jk.prototype.Pb=function(b){var c=b.eb(),d=b.La(),e=b.pd(1),f=b.Wa(1),g=b.za();this.g=c[0];this.h=c[1];this.Y=e;this.j=f;this.i=d[1];this.o=b.o;this.H=g[0];this.L=g[1];this.u=b.u;this.C=b.H;this.w=b.L;this.A=b.C;this.D=d[0]};function Kk(b,c,d){Dk.call(this,b,c,d);this.g={xb:void 0,sb:void 0,tb:null,ub:void 0,vb:void 0,wb:void 0,hd:0,strokeStyle:void 0,lineCap:void 0,lineDash:null,lineJoin:void 0,lineWidth:void 0,miterLimit:void 0}}v(Kk,Dk);
	function Lk(b,c,d,e,f){var g=b.coordinates.length;c=Ek(b,c,d,e,f,!1);g=[8,g,c];b.b.push(g);b.a.push(g);return e}k=Kk.prototype;k.$c=function(){this.c||(this.c=hd(this.fa),0<this.f&&gd(this.c,this.resolution*(this.f+1)/2,this.c));return this.c};
	function Mk(b){var c=b.g,d=c.strokeStyle,e=c.lineCap,f=c.lineDash,g=c.lineJoin,h=c.lineWidth,l=c.miterLimit;c.xb==d&&c.sb==e&&ib(c.tb,f)&&c.ub==g&&c.vb==h&&c.wb==l||(c.hd!=b.coordinates.length&&(b.b.push([12]),c.hd=b.coordinates.length),b.b.push([10,d,h,e,g,l,f],[1]),c.xb=d,c.sb=e,c.tb=f,c.ub=g,c.vb=h,c.wb=l)}
	k.cc=function(b,c){var d=this.g,e=d.lineWidth;void 0!==d.strokeStyle&&void 0!==e&&(Mk(this),Fk(this,c),this.a.push([10,d.strokeStyle,d.lineWidth,d.lineCap,d.lineJoin,d.miterLimit,d.lineDash],[1]),d=b.a,Lk(this,d,0,d.length,b.b),this.a.push([12]),Ik(this,c))};
	k.dc=function(b,c){var d=this.g,e=d.lineWidth;if(void 0!==d.strokeStyle&&void 0!==e){Mk(this);Fk(this,c);this.a.push([10,d.strokeStyle,d.lineWidth,d.lineCap,d.lineJoin,d.miterLimit,d.lineDash],[1]);var d=b.f,e=b.a,f=b.b,g=0,h,l;h=0;for(l=d.length;h<l;++h)g=Lk(this,e,g,d[h],f);this.a.push([12]);Ik(this,c)}};k.Ac=function(){this.g.hd!=this.coordinates.length&&this.b.push([12]);Hk(this);this.g=null};
	k.Ca=function(b,c){var d=c.b;this.g.strokeStyle=nf(d?d:Ej);d=c.c;this.g.lineCap=void 0!==d?d:"round";d=c.a;this.g.lineDash=d?d:Dj;d=c.f;this.g.lineJoin=void 0!==d?d:"round";d=c.g;this.g.lineWidth=void 0!==d?d:1;d=c.h;this.g.miterLimit=void 0!==d?d:10;this.g.lineWidth>this.f&&(this.f=this.g.lineWidth,this.c=null)};
	function Nk(b,c,d){Dk.call(this,b,c,d);this.g={Qd:void 0,xb:void 0,sb:void 0,tb:null,ub:void 0,vb:void 0,wb:void 0,fillStyle:void 0,strokeStyle:void 0,lineCap:void 0,lineDash:null,lineJoin:void 0,lineWidth:void 0,miterLimit:void 0}}v(Nk,Dk);
	function Ok(b,c,d,e,f){var g=b.g,h=[1];b.b.push(h);b.a.push(h);var l,h=0;for(l=e.length;h<l;++h){var m=e[h],n=b.coordinates.length;d=Ek(b,c,d,m,f,!0);d=[8,n,d];n=[3];b.b.push(d,n);b.a.push(d,n);d=m}c=[7];b.a.push(c);void 0!==g.fillStyle&&b.b.push(c);void 0!==g.strokeStyle&&(g=[12],b.b.push(g),b.a.push(g));return d}k=Nk.prototype;
	k.bc=function(b,c){var d=this.g,e=d.strokeStyle;if(void 0!==d.fillStyle||void 0!==e){Pk(this);Fk(this,c);this.a.push([9,nf(Cj)]);void 0!==d.strokeStyle&&this.a.push([10,d.strokeStyle,d.lineWidth,d.lineCap,d.lineJoin,d.miterLimit,d.lineDash]);var f=b.a,e=this.coordinates.length;Ek(this,f,0,f.length,b.b,!1);f=[1];e=[2,e];this.b.push(f,e);this.a.push(f,e);e=[7];this.a.push(e);void 0!==d.fillStyle&&this.b.push(e);void 0!==d.strokeStyle&&(d=[12],this.b.push(d),this.a.push(d));Ik(this,c)}};
	k.yb=function(b,c){var d=this.g,e=d.strokeStyle;if(void 0!==d.fillStyle||void 0!==e)Pk(this),Fk(this,c),this.a.push([9,nf(Cj)]),void 0!==d.strokeStyle&&this.a.push([10,d.strokeStyle,d.lineWidth,d.lineCap,d.lineJoin,d.miterLimit,d.lineDash]),d=b.f,e=Se(b),Ok(this,e,0,d,b.b),Ik(this,c)};
	k.fc=function(b,c){var d=this.g,e=d.strokeStyle;if(void 0!==d.fillStyle||void 0!==e){Pk(this);Fk(this,c);this.a.push([9,nf(Cj)]);void 0!==d.strokeStyle&&this.a.push([10,d.strokeStyle,d.lineWidth,d.lineCap,d.lineJoin,d.miterLimit,d.lineDash]);var d=b.f,e=uk(b),f=b.b,g=0,h,l;h=0;for(l=d.length;h<l;++h)g=Ok(this,e,g,d[h],f);Ik(this,c)}};k.Ac=function(){Hk(this);this.g=null;var b=this.va;if(0!==b){var c=this.coordinates,d,e;d=0;for(e=c.length;d<e;++d)c[d]=b*Math.round(c[d]/b)}};
	k.$c=function(){this.c||(this.c=hd(this.fa),0<this.f&&gd(this.c,this.resolution*(this.f+1)/2,this.c));return this.c};
	k.Ca=function(b,c){var d=this.g;if(b){var e=b.a;d.fillStyle=nf(e?e:Cj)}else d.fillStyle=void 0;c?(e=c.b,d.strokeStyle=nf(e?e:Ej),e=c.c,d.lineCap=void 0!==e?e:"round",e=c.a,d.lineDash=e?e.slice():Dj,e=c.f,d.lineJoin=void 0!==e?e:"round",e=c.g,d.lineWidth=void 0!==e?e:1,e=c.h,d.miterLimit=void 0!==e?e:10,d.lineWidth>this.f&&(this.f=d.lineWidth,this.c=null)):(d.strokeStyle=void 0,d.lineCap=void 0,d.lineDash=null,d.lineJoin=void 0,d.lineWidth=void 0,d.miterLimit=void 0)};
	function Pk(b){var c=b.g,d=c.fillStyle,e=c.strokeStyle,f=c.lineCap,g=c.lineDash,h=c.lineJoin,l=c.lineWidth,m=c.miterLimit;void 0!==d&&c.Qd!=d&&(b.b.push([9,d]),c.Qd=c.fillStyle);void 0===e||c.xb==e&&c.sb==f&&c.tb==g&&c.ub==h&&c.vb==l&&c.wb==m||(b.b.push([10,e,l,f,h,m,g]),c.xb=e,c.sb=f,c.tb=g,c.ub=h,c.vb=l,c.wb=m)}function Qk(b,c,d){Dk.call(this,b,c,d);this.A=this.w=this.C=null;this.j="";this.u=this.L=this.H=this.o=0;this.i=this.h=this.g=null}v(Qk,Dk);
	Qk.prototype.l=function(b,c,d,e){if(""!==this.j&&this.i&&(this.g||this.h)){if(this.g){var f=this.g,g=this.C;if(!g||g.fillStyle!=f.fillStyle){var h=[9,f.fillStyle];this.b.push(h);this.a.push(h);g?g.fillStyle=f.fillStyle:this.C={fillStyle:f.fillStyle}}}this.h&&(f=this.h,g=this.w,g&&g.lineCap==f.lineCap&&g.lineDash==f.lineDash&&g.lineJoin==f.lineJoin&&g.lineWidth==f.lineWidth&&g.miterLimit==f.miterLimit&&g.strokeStyle==f.strokeStyle||(h=[10,f.strokeStyle,f.lineWidth,f.lineCap,f.lineJoin,f.miterLimit,
	f.lineDash,!1],this.b.push(h),this.a.push(h),g?(g.lineCap=f.lineCap,g.lineDash=f.lineDash,g.lineJoin=f.lineJoin,g.lineWidth=f.lineWidth,g.miterLimit=f.miterLimit,g.strokeStyle=f.strokeStyle):this.w={lineCap:f.lineCap,lineDash:f.lineDash,lineJoin:f.lineJoin,lineWidth:f.lineWidth,miterLimit:f.miterLimit,strokeStyle:f.strokeStyle}));f=this.i;g=this.A;g&&g.font==f.font&&g.textAlign==f.textAlign&&g.textBaseline==f.textBaseline||(h=[11,f.font,f.textAlign,f.textBaseline],this.b.push(h),this.a.push(h),g?
	(g.font=f.font,g.textAlign=f.textAlign,g.textBaseline=f.textBaseline):this.A={font:f.font,textAlign:f.textAlign,textBaseline:f.textBaseline});Fk(this,e);f=this.coordinates.length;b=Ek(this,b,0,c,d,!1);b=[5,f,b,this.j,this.o,this.H,this.L,this.u,!!this.g,!!this.h];this.b.push(b);this.a.push(b);Ik(this,e)}};
	Qk.prototype.ta=function(b){if(b){var c=b.b;c?(c=c.a,c=nf(c?c:Cj),this.g?this.g.fillStyle=c:this.g={fillStyle:c}):this.g=null;var d=b.f;if(d){var c=d.b,e=d.c,f=d.a,g=d.f,h=d.g,d=d.h,e=void 0!==e?e:"round",f=f?f.slice():Dj,g=void 0!==g?g:"round",h=void 0!==h?h:1,d=void 0!==d?d:10,c=nf(c?c:Ej);if(this.h){var l=this.h;l.lineCap=e;l.lineDash=f;l.lineJoin=g;l.lineWidth=h;l.miterLimit=d;l.strokeStyle=c}else this.h={lineCap:e,lineDash:f,lineJoin:g,lineWidth:h,miterLimit:d,strokeStyle:c}}else this.h=null;
	var m=b.a,c=b.j,e=b.o,f=b.g,h=b.c,d=b.h,g=b.l,l=b.i;b=void 0!==m?m:"10px sans-serif";g=void 0!==g?g:"center";l=void 0!==l?l:"middle";this.i?(m=this.i,m.font=b,m.textAlign=g,m.textBaseline=l):this.i={font:b,textAlign:g,textBaseline:l};this.j=void 0!==d?d:"";this.o=void 0!==c?c:0;this.H=void 0!==e?e:0;this.L=void 0!==f?f:0;this.u=void 0!==h?h:1}else this.j=""};function Rk(b,c,d,e){this.i=b;this.g=c;this.l=d;this.c=e;this.b={};this.f=mh(1,1);this.h=bd()}
	function Sk(b){for(var c in b.b){var d=b.b[c],e;for(e in d)d[e].Ac()}}function Tk(b,c,d,e,f,g){var h=b.h;ri(h,.5,.5,1/d,-1/d,-e,-c[0],-c[1]);var l=b.f;l.clearRect(0,0,1,1);var m;void 0!==b.c&&(m=nd(),td(m,c),gd(m,d*b.c,m));return Uk(b,l,h,e,f,function(b){if(0<l.getImageData(0,0,1,1).data[3]){if(b=g(b))return b;l.clearRect(0,0,1,1)}},m)}
	Rk.prototype.a=function(b,c){var d=void 0!==b?b.toString():"0",e=this.b[d];void 0===e&&(e={},this.b[d]=e);d=e[c];void 0===d&&(d=new Vk[c](this.i,this.g,this.l),e[c]=d);return d};Rk.prototype.Aa=function(){return Eb(this.b)};
	function Wk(b,c,d,e,f,g){var h=Object.keys(b.b).map(Number);eb(h);var l=b.g,m=l[0],n=l[1],p=l[2],l=l[3],m=[m,n,m,l,p,l,p,n];oe(m,0,8,2,e,m);c.save();c.beginPath();c.moveTo(m[0],m[1]);c.lineTo(m[2],m[3]);c.lineTo(m[4],m[5]);c.lineTo(m[6],m[7]);c.closePath();c.clip();for(var q,r,m=0,n=h.length;m<n;++m)for(q=b.b[h[m].toString()],p=0,l=Ck.length;p<l;++p)r=q[Ck[p]],void 0!==r&&Gk(r,c,d,e,f,g,r.b,void 0);c.restore()}
	function Uk(b,c,d,e,f,g,h){var l=Object.keys(b.b).map(Number);eb(l,function(b,c){return c-b});var m,n,p,q,r;m=0;for(n=l.length;m<n;++m)for(q=b.b[l[m].toString()],p=Ck.length-1;0<=p;--p)if(r=q[Ck[p]],void 0!==r&&(r=Gk(r,c,1,d,e,f,r.a,g,h)))return r}var Vk={Image:Jk,LineString:Kk,Polygon:Nk,Text:Qk};function N(b,c,d){z.call(this);this.yd(b,c?c:0,d)}v(N,z);k=N.prototype;k.clone=function(){var b=new N(null);qe(b,this.c,this.a.slice());b.s();return b};k.pa=function(b,c,d,e){var f=this.a;b-=f[0];var g=c-f[1];c=b*b+g*g;if(c<e){if(0===c)for(e=0;e<this.b;++e)d[e]=f[e];else for(e=this.nd()/Math.sqrt(c),d[0]=f[0]+e*b,d[1]=f[1]+e*g,e=2;e<this.b;++e)d[e]=f[e];d.length=this.b;return c}return e};k.Va=function(b,c){var d=this.a,e=b-d[0],d=c-d[1];return e*e+d*d<=Xk(this)};
	k.Hb=function(){return this.a.slice(0,this.b)};k.$b=function(b){var c=this.a,d=c[this.b]-c[0];return fd(c[0]-d,c[1]-d,c[0]+d,c[1]+d,b)};k.nd=function(){return Math.sqrt(Xk(this))};function Xk(b){var c=b.a[b.b]-b.a[0];b=b.a[b.b+1]-b.a[1];return c*c+b*b}k.P=function(){return"Circle"};k.ea=function(b){var c=this.v();return Ed(b,c)?(c=this.Hb(),b[0]<=c[0]&&b[2]>=c[0]||b[1]<=c[1]&&b[3]>=c[1]?!0:vd(b,this.Pd,this)):!1};
	k.$g=function(b){var c=this.b,d=b.slice();d[c]=d[0]+(this.a[c]-this.a[0]);var e;for(e=1;e<c;++e)d[c+e]=b[e];qe(this,this.c,d);this.s()};k.yd=function(b,c,d){if(b){re(this,d,b,0);this.a||(this.a=[]);d=this.a;b=ze(d,b);d[b++]=d[0]+c;var e;c=1;for(e=this.b;c<e;++c)d[b++]=d[c];d.length=b}else qe(this,"XY",null);this.s()};k.wi=function(b){this.a[this.b]=this.a[0]+b;this.s()};function O(b){ne.call(this);this.h=b?b:null;Yk(this)}v(O,ne);function Zk(b){var c=[],d,e;d=0;for(e=b.length;d<e;++d)c.push(b[d].clone());return c}function $k(b){var c,d;if(b.h)for(c=0,d=b.h.length;c<d;++c)Ic(b.h[c],"change",b.s,!1,b)}function Yk(b){var c,d;if(b.h)for(c=0,d=b.h.length;c<d;++c)w(b.h[c],"change",b.s,!1,b)}k=O.prototype;k.clone=function(){var b=new O(null);b.Ee(this.h);return b};
	k.pa=function(b,c,d,e){if(e<id(this.v(),b,c))return e;var f=this.h,g,h;g=0;for(h=f.length;g<h;++g)e=f[g].pa(b,c,d,e);return e};k.Va=function(b,c){var d=this.h,e,f;e=0;for(f=d.length;e<f;++e)if(d[e].Va(b,c))return!0;return!1};k.$b=function(b){fd(Infinity,Infinity,-Infinity,-Infinity,b);for(var c=this.h,d=0,e=c.length;d<e;++d)pd(b,c[d].v());return b};k.Yd=function(){return Zk(this.h)};
	k.jc=function(b){this.u!=this.g&&(Fb(this.i),this.j=0,this.u=this.g);if(0>b||0!==this.j&&b<this.j)return this;var c=b.toString();if(this.i.hasOwnProperty(c))return this.i[c];var d=[],e=this.h,f=!1,g,h;g=0;for(h=e.length;g<h;++g){var l=e[g],m=l.jc(b);d.push(m);m!==l&&(f=!0)}if(f)return b=new O(null),$k(b),b.h=d,Yk(b),b.s(),this.i[c]=b;this.j=b;return this};k.P=function(){return"GeometryCollection"};k.ea=function(b){var c=this.h,d,e;d=0;for(e=c.length;d<e;++d)if(c[d].ea(b))return!0;return!1};
	k.Aa=function(){return 0===this.h.length};k.Ee=function(b){b=Zk(b);$k(this);this.h=b;Yk(this);this.s()};k.qb=function(b){var c=this.h,d,e;d=0;for(e=c.length;d<e;++d)c[d].qb(b);this.s()};k.vc=function(b,c){var d=this.h,e,f;e=0;for(f=d.length;e<f;++e)d[e].vc(b,c);this.s()};k.K=function(){$k(this);O.ca.K.call(this)};function al(b,c,d,e,f){var g=NaN,h=NaN,l=(d-c)/e;if(0!==l)if(1==l)g=b[c],h=b[c+1];else if(2==l)g=.5*b[c]+.5*b[c+e],h=.5*b[c+1]+.5*b[c+e+1];else{var h=b[c],l=b[c+1],m=0,g=[0],n;for(n=c+e;n<d;n+=e){var p=b[n],q=b[n+1],m=m+Math.sqrt((p-h)*(p-h)+(q-l)*(q-l));g.push(m);h=p;l=q}d=.5*m;for(var r,h=fb,l=0,m=g.length;l<m;)n=l+m>>1,p=h(d,g[n]),0<p?l=n+1:(m=n,r=!p);r=r?l:~l;0>r?(d=(d-g[-r-2])/(g[-r-1]-g[-r-2]),c+=(-r-2)*e,g=pb(b[c],b[c+e],d),h=pb(b[c+1],b[c+e+1],d)):(g=b[c+r*e],h=b[c+r*e+1])}return f?(f[0]=
	g,f[1]=h,f):[g,h]}function bl(b,c,d,e,f,g){if(d==c)return null;if(f<b[c+e-1])return g?(d=b.slice(c,c+e),d[e-1]=f,d):null;if(b[d-1]<f)return g?(d=b.slice(d-e,d),d[e-1]=f,d):null;if(f==b[c+e-1])return b.slice(c,c+e);c/=e;for(d/=e;c<d;)g=c+d>>1,f<b[(g+1)*e-1]?d=g:c=g+1;d=b[c*e-1];if(f==d)return b.slice((c-1)*e,(c-1)*e+e);g=(f-d)/(b[(c+1)*e-1]-d);d=[];var h;for(h=0;h<e-1;++h)d.push(pb(b[(c-1)*e+h],b[c*e+h],g));d.push(f);return d}
	function cl(b,c,d,e,f,g){var h=0;if(g)return bl(b,h,c[c.length-1],d,e,f);if(e<b[d-1])return f?(b=b.slice(0,d),b[d-1]=e,b):null;if(b[b.length-1]<e)return f?(b=b.slice(b.length-d),b[d-1]=e,b):null;f=0;for(g=c.length;f<g;++f){var l=c[f];if(h!=l){if(e<b[h+d-1])break;if(e<=b[l-1])return bl(b,h,l,d,e,!1);h=l}}return null};function P(b,c){z.call(this);this.f=null;this.A=this.D=this.o=-1;this.aa(b,c)}v(P,z);k=P.prototype;k.hf=function(b){this.a?bb(this.a,b):this.a=b.slice();this.s()};k.clone=function(){var b=new P(null);dl(b,this.c,this.a.slice());return b};k.pa=function(b,c,d,e){if(e<id(this.v(),b,c))return e;this.A!=this.g&&(this.D=Math.sqrt(ve(this.a,0,this.a.length,this.b,0)),this.A=this.g);return xe(this.a,0,this.a.length,this.b,this.D,!1,b,c,d,e)};k.vf=function(b,c){return Ke(this.a,0,this.a.length,this.b,b,c)};
	k.ah=function(b,c){return"XYM"!=this.c&&"XYZM"!=this.c?null:bl(this.a,0,this.a.length,this.b,b,void 0!==c?c:!1)};k.ba=function(){return Ce(this.a,0,this.a.length,this.b)};k.bh=function(){var b=this.a,c=this.b,d=b[0],e=b[1],f=0,g;for(g=0+c;g<this.a.length;g+=c)var h=b[g],l=b[g+1],f=f+Math.sqrt((h-d)*(h-d)+(l-e)*(l-e)),d=h,e=l;return f};function sk(b){b.o!=b.g&&(b.f=al(b.a,0,b.a.length,b.b,b.f),b.o=b.g);return b.f}
	k.gb=function(b){var c=[];c.length=Ee(this.a,0,this.a.length,this.b,b,c,0);b=new P(null);dl(b,"XY",c);return b};k.P=function(){return"LineString"};k.ea=function(b){return Le(this.a,0,this.a.length,this.b,b)};k.aa=function(b,c){b?(re(this,c,b,1),this.a||(this.a=[]),this.a.length=Ae(this.a,0,b,this.b),this.s()):dl(this,"XY",null)};function dl(b,c,d){qe(b,c,d);b.s()};function Q(b,c){z.call(this);this.f=[];this.o=this.A=-1;this.aa(b,c)}v(Q,z);k=Q.prototype;k.jf=function(b){this.a?bb(this.a,b.a.slice()):this.a=b.a.slice();this.f.push(this.a.length);this.s()};k.clone=function(){var b=new Q(null),c=this.f.slice();qe(b,this.c,this.a.slice());b.f=c;b.s();return b};k.pa=function(b,c,d,e){if(e<id(this.v(),b,c))return e;this.o!=this.g&&(this.A=Math.sqrt(we(this.a,0,this.f,this.b,0)),this.o=this.g);return ye(this.a,0,this.f,this.b,this.A,!1,b,c,d,e)};
	k.eh=function(b,c,d){return"XYM"!=this.c&&"XYZM"!=this.c||0===this.a.length?null:cl(this.a,this.f,this.b,b,void 0!==c?c:!1,void 0!==d?d:!1)};k.ba=function(){return De(this.a,0,this.f,this.b)};k.If=function(b){if(0>b||this.f.length<=b)return null;var c=new P(null);dl(c,this.c,this.a.slice(0===b?0:this.f[b-1],this.f[b]));return c};k.$d=function(){var b=this.a,c=this.f,d=this.c,e=[],f=0,g,h;g=0;for(h=c.length;g<h;++g){var l=c[g],m=new P(null);dl(m,d,b.slice(f,l));e.push(m);f=l}return e};
	function tk(b){var c=[],d=b.a,e=0,f=b.f;b=b.b;var g,h;g=0;for(h=f.length;g<h;++g){var l=f[g],e=al(d,e,l,b);bb(c,e);e=l}return c}k.gb=function(b){var c=[],d=[],e=this.a,f=this.f,g=this.b,h=0,l=0,m,n;m=0;for(n=f.length;m<n;++m){var p=f[m],l=Ee(e,h,p,g,b,c,l);d.push(l);h=p}c.length=l;b=new Q(null);qe(b,"XY",c);b.f=d;b.s();return b};k.P=function(){return"MultiLineString"};
	k.ea=function(b){a:{var c=this.a,d=this.f,e=this.b,f=0,g,h;g=0;for(h=d.length;g<h;++g){if(Le(c,f,d[g],e,b)){b=!0;break a}f=d[g]}b=!1}return b};k.aa=function(b,c){if(b){re(this,c,b,2);this.a||(this.a=[]);var d=Be(this.a,0,b,this.b,this.f);this.a.length=0===d.length?0:d[d.length-1]}else d=this.f,qe(this,"XY",null),this.f=d;this.s()};function R(b,c){z.call(this);this.aa(b,c)}v(R,z);k=R.prototype;k.lf=function(b){this.a?bb(this.a,b.a):this.a=b.a.slice();this.s()};k.clone=function(){var b=new R(null);qe(b,this.c,this.a.slice());b.s();return b};k.pa=function(b,c,d,e){if(e<id(this.v(),b,c))return e;var f=this.a,g=this.b,h,l,m;h=0;for(l=f.length;h<l;h+=g)if(m=Oa(b,c,f[h],f[h+1]),m<e){e=m;for(m=0;m<g;++m)d[m]=f[h+m];d.length=g}return e};k.ba=function(){return Ce(this.a,0,this.a.length,this.b)};
	k.Of=function(b){var c=this.a?this.a.length/this.b:0;if(0>b||c<=b)return null;c=new C(null);qe(c,this.c,this.a.slice(b*this.b,(b+1)*this.b));c.s();return c};k.re=function(){var b=this.a,c=this.c,d=this.b,e=[],f,g;f=0;for(g=b.length;f<g;f+=d){var h=new C(null),l=h;qe(l,c,b.slice(f,f+d));l.s();e.push(h)}return e};k.P=function(){return"MultiPoint"};k.ea=function(b){var c=this.a,d=this.b,e,f,g,h;e=0;for(f=c.length;e<f;e+=d)if(g=c[e],h=c[e+1],kd(b,g,h))return!0;return!1};
	k.aa=function(b,c){b?(re(this,c,b,1),this.a||(this.a=[]),this.a.length=Ae(this.a,0,b,this.b)):qe(this,"XY",null);this.s()};function T(b,c){z.call(this);this.f=[];this.A=-1;this.D=null;this.Y=this.F=this.N=-1;this.o=null;this.aa(b,c)}v(T,z);k=T.prototype;k.mf=function(b){if(this.a){var c=this.a.length;bb(this.a,b.a);b=b.f.slice();var d,e;d=0;for(e=b.length;d<e;++d)b[d]+=c}else this.a=b.a.slice(),b=b.f.slice(),this.f.push();this.f.push(b);this.s()};k.clone=function(){var b=new T(null),c=Hb(this.f);qe(b,this.c,this.a.slice());b.f=c;b.s();return b};
	k.pa=function(b,c,d,e){if(e<id(this.v(),b,c))return e;if(this.F!=this.g){var f=this.f,g=0,h=0,l,m;l=0;for(m=f.length;l<m;++l)var n=f[l],h=we(this.a,g,n,this.b,h),g=n[n.length-1];this.N=Math.sqrt(h);this.F=this.g}f=uk(this);g=this.f;h=this.b;l=this.N;m=0;var n=[NaN,NaN],p,q;p=0;for(q=g.length;p<q;++p){var r=g[p];e=ye(f,m,r,h,l,!0,b,c,d,e,n);m=r[r.length-1]}return e};
	k.Va=function(b,c){var d;a:{d=uk(this);var e=this.f,f=0;if(0!==e.length){var g,h;g=0;for(h=e.length;g<h;++g){var l=e[g];if(Ie(d,f,l,this.b,b,c)){d=!0;break a}f=l[l.length-1]}}d=!1}return d};k.fh=function(){var b=uk(this),c=this.f,d=0,e=0,f,g;f=0;for(g=c.length;f<g;++f)var h=c[f],e=e+te(b,d,h,this.b),d=h[h.length-1];return e};
	k.ba=function(b){var c;void 0!==b?(c=uk(this).slice(),Qe(c,this.f,this.b,b)):c=this.a;b=c;c=this.f;var d=this.b,e=0,f=[],g=0,h,l;h=0;for(l=c.length;h<l;++h){var m=c[h];f[g++]=De(b,e,m,d,f[g]);e=m[m.length-1]}f.length=g;return f};
	function vk(b){if(b.A!=b.g){var c=b.a,d=b.f,e=b.b,f=0,g=[],h,l,m=nd();h=0;for(l=d.length;h<l;++h){var n=d[h],m=ud(fd(Infinity,Infinity,-Infinity,-Infinity,void 0),c,f,n[0],e);g.push((m[0]+m[2])/2,(m[1]+m[3])/2);f=n[n.length-1]}c=uk(b);d=b.f;e=b.b;f=0;h=[];l=0;for(m=d.length;l<m;++l)n=d[l],h=Je(c,f,n,e,g,2*l,h),f=n[n.length-1];b.D=h;b.A=b.g}return b.D}k.Ff=function(){var b=new R(null),c=vk(this).slice();qe(b,"XY",c);b.s();return b};
	function uk(b){if(b.Y!=b.g){var c=b.a,d;a:{d=b.f;var e,f;e=0;for(f=d.length;e<f;++e)if(!Oe(c,d[e],b.b,void 0)){d=!1;break a}d=!0}d?b.o=c:(b.o=c.slice(),b.o.length=Qe(b.o,b.f,b.b));b.Y=b.g}return b.o}k.gb=function(b){var c=[],d=[],e=this.a,f=this.f,g=this.b;b=Math.sqrt(b);var h=0,l=0,m,n;m=0;for(n=f.length;m<n;++m){var p=f[m],q=[],l=Fe(e,h,p,g,b,c,l,q);d.push(q);h=p[p.length-1]}c.length=l;e=new T(null);qe(e,"XY",c);e.f=d;e.s();return e};
	k.Qf=function(b){if(0>b||this.f.length<=b)return null;var c;0===b?c=0:(c=this.f[b-1],c=c[c.length-1]);b=this.f[b].slice();var d=b[b.length-1];if(0!==c){var e,f;e=0;for(f=b.length;e<f;++e)b[e]-=c}e=new D(null);Re(e,this.c,this.a.slice(c,d),b);return e};k.de=function(){var b=this.c,c=this.a,d=this.f,e=[],f=0,g,h,l,m;g=0;for(h=d.length;g<h;++g){var n=d[g].slice(),p=n[n.length-1];if(0!==f)for(l=0,m=n.length;l<m;++l)n[l]-=f;l=new D(null);Re(l,b,c.slice(f,p),n);e.push(l);f=p}return e};k.P=function(){return"MultiPolygon"};
	k.ea=function(b){a:{var c=uk(this),d=this.f,e=this.b,f=0,g,h;g=0;for(h=d.length;g<h;++g){var l=d[g];if(Me(c,f,l,e,b)){b=!0;break a}f=l[l.length-1]}b=!1}return b};k.aa=function(b,c){if(b){re(this,c,b,3);this.a||(this.a=[]);var d=this.a,e=this.b,f=this.f,g=0,f=f?f:[],h=0,l,m;l=0;for(m=b.length;l<m;++l)g=Be(d,g,b[l],e,f[h]),f[h++]=g,g=g[g.length-1];f.length=h;0===f.length?this.a.length=0:(d=f[f.length-1],this.a.length=0===d.length?0:d[d.length-1])}else d=this.f,qe(this,"XY",null),this.f=d;this.s()};function el(b,c){return pa(b)-pa(c)}
	var fl={Point:function(b,c,d,e){var f=d.h;if(f){if(2!=f.Ob())return;var g=b.a(d.a,"Image");g.Pb(f);g.gc(c,e)}if(f=d.b)b=b.a(d.a,"Text"),b.ta(f),b.l(c.ba(),2,2,e)},LineString:function(b,c,d,e){var f=d.g;if(f){var g=b.a(d.a,"LineString");g.Ca(null,f);g.cc(c,e)}if(f=d.b)b=b.a(d.a,"Text"),b.ta(f),b.l(sk(c),2,2,e)},Polygon:function(b,c,d,e){var f=d.f,g=d.g;if(f||g){var h=b.a(d.a,"Polygon");h.Ca(f,g);h.yb(c,e)}if(f=d.b)b=b.a(d.a,"Text"),b.ta(f),b.l(Te(c),2,2,e)},MultiPoint:function(b,c,d,e){var f=d.h;if(f){if(2!=
	f.Ob())return;var g=b.a(d.a,"Image");g.Pb(f);g.ec(c,e)}if(f=d.b)b=b.a(d.a,"Text"),b.ta(f),d=c.a,b.l(d,d.length,c.b,e)},MultiLineString:function(b,c,d,e){var f=d.g;if(f){var g=b.a(d.a,"LineString");g.Ca(null,f);g.dc(c,e)}if(f=d.b)b=b.a(d.a,"Text"),b.ta(f),c=tk(c),b.l(c,c.length,2,e)},MultiPolygon:function(b,c,d,e){var f=d.f,g=d.g;if(g||f){var h=b.a(d.a,"Polygon");h.Ca(f,g);h.fc(c,e)}if(f=d.b)b=b.a(d.a,"Text"),b.ta(f),c=vk(c),b.l(c,c.length,2,e)},GeometryCollection:function(b,c,d,e){c=c.h;var f,g;f=
	0;for(g=c.length;f<g;++f)(0,fl[c[f].P()])(b,c[f],d,e)},Circle:function(b,c,d,e){var f=d.f,g=d.g;if(f||g){var h=b.a(d.a,"Polygon");h.Ca(f,g);h.bc(c,e)}if(f=d.b)b=b.a(d.a,"Text"),b.ta(f),b.l(c.Hb(),2,2,e)}};function gl(b,c,d,e,f,g){this.g=void 0!==g?g:null;pi.call(this,b,c,d,void 0!==g?0:2,e);this.b=f}v(gl,pi);gl.prototype.a=function(b){this.state=b?3:2;qi(this)};gl.prototype.load=function(){0==this.state&&(this.state=1,qi(this),this.g(ua(this.a,this)))};gl.prototype.c=function(){return this.b};function hl(b){fg.call(this,{attributions:b.attributions,extent:b.extent,logo:b.logo,projection:b.projection,state:b.state})}v(hl,fg);hl.prototype.F=function(b){b=b.target;switch(b.state){case 1:y(this,new il(jl,b));break;case 2:y(this,new il(kl,b));break;case 3:y(this,new il(ll,b))}};function ml(b,c){b.c().src=c}function il(b,c){hc.call(this,b);this.image=c}v(il,hc);var jl="imageloadstart",kl="imageloadend",ll="imageloaderror";function nl(b){Tc.call(this);this.$=void 0;this.a="geometry";this.f=null;this.c=void 0;this.b=null;w(this,Vc(this.a),this.lc,!1,this);void 0!==b&&(b instanceof ne||!b?this.Ba(b):this.I(b))}v(nl,Tc);k=nl.prototype;k.clone=function(){var b=new nl(this.O());b.Lc(this.a);var c=this.J();c&&b.Ba(c.clone());(c=this.f)&&b.oe(c);return b};k.J=function(){return this.get(this.a)};k.Cf=function(){return this.$};k.Bf=function(){return this.a};k.Qg=function(){return this.f};k.Rg=function(){return this.c};
	k.eg=function(){this.s()};k.lc=function(){this.b&&(Jc(this.b),this.b=null);var b=this.J();b&&(this.b=w(b,"change",this.eg,!1,this));this.s()};k.Ba=function(b){this.B(this.a,b)};k.oe=function(b){this.c=(this.f=b)?pl(b):void 0;this.s()};k.Fe=function(b){this.$=b;this.s()};k.Lc=function(b){Ic(this,Vc(this.a),this.lc,!1,this);this.a=b;w(this,Vc(this.a),this.lc,!1,this);this.lc()};function pl(b){if(!la(b)){var c;c=ha(b)?b:[b];b=function(){return c}}return b};function ql(b){b.prototype.then=b.prototype.then;b.prototype.$goog_Thenable=!0}function rl(b){if(!b)return!1;try{return!!b.$goog_Thenable}catch(c){return!1}};function sl(b,c,d){this.c=d;this.g=b;this.f=c;this.b=0;this.a=null}sl.prototype.get=function(){var b;0<this.b?(this.b--,b=this.a,this.a=b.next,b.next=null):b=this.g();return b};function tl(b,c){b.f(c);b.b<b.c&&(b.b++,c.next=b.a,b.a=c)};function ul(){this.b=this.a=null}var wl=new sl(function(){return new vl},function(b){b.reset()},100);ul.prototype.add=function(b,c){var d=wl.get();d.a=b;d.b=c;d.next=null;this.b?this.b.next=d:this.a=d;this.b=d};ul.prototype.remove=function(){var b=null;this.a&&(b=this.a,this.a=this.a.next,this.a||(this.b=null),b.next=null);return b};function vl(){this.next=this.b=this.a=null}vl.prototype.reset=function(){this.next=this.b=this.a=null};function xl(b,c){yl||zl();Al||(yl(),Al=!0);Bl.add(b,c)}var yl;function zl(){if(ba.Promise&&ba.Promise.resolve){var b=ba.Promise.resolve(void 0);yl=function(){b.then(Cl)}}else yl=function(){Kg(Cl)}}var Al=!1,Bl=new ul;function Cl(){for(var b=null;b=Bl.remove();){try{b.a.call(b.b)}catch(c){Jg(c)}tl(wl,b)}Al=!1};function Dl(b,c){this.a=El;this.l=void 0;this.c=this.b=this.g=null;this.f=this.h=!1;if(b!=ea)try{var d=this;b.call(c,function(b){Fl(d,Gl,b)},function(b){Fl(d,Hl,b)})}catch(e){Fl(this,Hl,e)}}var El=0,Gl=2,Hl=3;function Il(){this.next=this.g=this.b=this.c=this.a=null;this.f=!1}Il.prototype.reset=function(){this.g=this.b=this.c=this.a=null;this.f=!1};var Jl=new sl(function(){return new Il},function(b){b.reset()},100);function Kl(b,c,d){var e=Jl.get();e.c=b;e.b=c;e.g=d;return e}
	Dl.prototype.then=function(b,c,d){return Ll(this,la(b)?b:null,la(c)?c:null,d)};ql(Dl);Dl.prototype.cancel=function(b){this.a==El&&xl(function(){var c=new Ml(b);Nl(this,c)},this)};function Nl(b,c){if(b.a==El)if(b.g){var d=b.g;if(d.b){for(var e=0,f=null,g=null,h=d.b;h&&(h.f||(e++,h.a==b&&(f=h),!(f&&1<e)));h=h.next)f||(g=h);f&&(d.a==El&&1==e?Nl(d,c):(g?(e=g,e.next==d.c&&(d.c=e),e.next=e.next.next):Ol(d),Pl(d,f,Hl,c)))}b.g=null}else Fl(b,Hl,c)}
	function Ql(b,c){b.b||b.a!=Gl&&b.a!=Hl||Rl(b);b.c?b.c.next=c:b.b=c;b.c=c}function Ll(b,c,d,e){var f=Kl(null,null,null);f.a=new Dl(function(b,h){f.c=c?function(d){try{var f=c.call(e,d);b(f)}catch(n){h(n)}}:b;f.b=d?function(c){try{var f=d.call(e,c);!ca(f)&&c instanceof Ml?h(c):b(f)}catch(n){h(n)}}:h});f.a.g=b;Ql(b,f);return f.a}Dl.prototype.j=function(b){this.a=El;Fl(this,Gl,b)};Dl.prototype.o=function(b){this.a=El;Fl(this,Hl,b)};
	function Fl(b,c,d){if(b.a==El){b==d&&(c=Hl,d=new TypeError("Promise cannot resolve to itself"));b.a=1;var e;a:{var f=d,g=b.j,h=b.o;if(f instanceof Dl)Ql(f,Kl(g||ea,h||null,b)),e=!0;else if(rl(f))f.then(g,h,b),e=!0;else{if(ma(f))try{var l=f.then;if(la(l)){Sl(f,l,g,h,b);e=!0;break a}}catch(m){h.call(b,m);e=!0;break a}e=!1}}e||(b.l=d,b.a=c,b.g=null,Rl(b),c!=Hl||d instanceof Ml||Tl(b,d))}}
	function Sl(b,c,d,e,f){function g(b){l||(l=!0,e.call(f,b))}function h(b){l||(l=!0,d.call(f,b))}var l=!1;try{c.call(b,h,g)}catch(m){g(m)}}function Rl(b){b.h||(b.h=!0,xl(b.i,b))}function Ol(b){var c=null;b.b&&(c=b.b,b.b=c.next,c.next=null);b.b||(b.c=null);return c}Dl.prototype.i=function(){for(var b=null;b=Ol(this);)Pl(this,b,this.a,this.l);this.h=!1};
	function Pl(b,c,d,e){if(d==Hl&&c.b&&!c.f)for(;b&&b.f;b=b.g)b.f=!1;if(c.a)c.a.g=null,Ul(c,d,e);else try{c.f?c.c.call(c.g):Ul(c,d,e)}catch(f){Vl.call(null,f)}tl(Jl,c)}function Ul(b,c,d){c==Gl?b.c.call(b.g,d):b.b&&b.b.call(b.g,d)}function Tl(b,c){b.f=!0;xl(function(){b.f&&Vl.call(null,c)})}var Vl=Jg;function Ml(b){za.call(this,b)}v(Ml,za);Ml.prototype.name="cancel";function Wl(b,c,d){if(la(b))d&&(b=ua(b,d));else if(b&&"function"==typeof b.handleEvent)b=ua(b.handleEvent,b);else throw Error("Invalid listener argument");return 2147483647<c?-1:ba.setTimeout(b,c||0)};function Xl(b){b=String(b);if(/^\s*$/.test(b)?0:/^[\],:{}\s\u2028\u2029]*$/.test(b.replace(/\\["\\\/bfnrtu]/g,"@").replace(/"[^"\\\n\r\u2028\u2029\x00-\x08\x0a-\x1f]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g,"]").replace(/(?:^|:|,)(?:[\s\u2028\u2029]*\[)+/g,"")))try{return eval("("+b+")")}catch(c){}throw Error("Invalid JSON string: "+b);}function Yl(b){var c=[];Zl(new $l,b,c);return c.join("")}function $l(){}
	function Zl(b,c,d){if(null==c)d.push("null");else{if("object"==typeof c){if(ha(c)){var e=c;c=e.length;d.push("[");for(var f="",g=0;g<c;g++)d.push(f),Zl(b,e[g],d),f=",";d.push("]");return}if(c instanceof String||c instanceof Number||c instanceof Boolean)c=c.valueOf();else{d.push("{");f="";for(e in c)Object.prototype.hasOwnProperty.call(c,e)&&(g=c[e],"function"!=typeof g&&(d.push(f),am(e,d),d.push(":"),Zl(b,g,d),f=","));d.push("}");return}}switch(typeof c){case "string":am(c,d);break;case "number":d.push(isFinite(c)&&
	!isNaN(c)?c:"null");break;case "boolean":d.push(c);break;case "function":d.push("null");break;default:throw Error("Unknown type: "+typeof c);}}}var bm={'"':'\\"',"\\":"\\\\","/":"\\/","\b":"\\b","\f":"\\f","\n":"\\n","\r":"\\r","\t":"\\t","\x0B":"\\u000b"},cm=/\uffff/.test("\uffff")?/[\\\"\x00-\x1f\x7f-\uffff]/g:/[\\\"\x00-\x1f\x7f-\xff]/g;function am(b,c){c.push('"',b.replace(cm,function(b){var c=bm[b];c||(c="\\u"+(b.charCodeAt(0)|65536).toString(16).substr(1),bm[b]=c);return c}),'"')};function dm(){}dm.prototype.a=null;function em(b){var c;(c=b.a)||(c={},fm(b)&&(c[0]=!0,c[1]=!0),c=b.a=c);return c};var gm;function hm(){}v(hm,dm);function im(b){return(b=fm(b))?new ActiveXObject(b):new XMLHttpRequest}function fm(b){if(!b.b&&"undefined"==typeof XMLHttpRequest&&"undefined"!=typeof ActiveXObject){for(var c=["MSXML2.XMLHTTP.6.0","MSXML2.XMLHTTP.3.0","MSXML2.XMLHTTP","Microsoft.XMLHTTP"],d=0;d<c.length;d++){var e=c[d];try{return new ActiveXObject(e),b.b=e}catch(f){}}throw Error("Could not create ActiveXObject. ActiveX might be disabled, or MSXML might not be installed");}return b.b}gm=new hm;var jm=/^(?:([^:/?#.]+):)?(?:\/\/(?:([^/?#]*)@)?([^/#?]*?)(?::([0-9]+))?(?=[/#?]|$))?([^?#]+)?(?:\?([^#]*))?(?:#(.*))?$/;function km(b,c){if(b)for(var d=b.split("&"),e=0;e<d.length;e++){var f=d[e].indexOf("="),g=null,h=null;0<=f?(g=d[e].substring(0,f),h=d[e].substring(f+1)):g=d[e];c(g,h?decodeURIComponent(h.replace(/\+/g," ")):"")}};function lm(b){Oc.call(this);this.D=new Og;this.i=b||null;this.a=!1;this.l=this.M=null;this.f=this.F=this.u="";this.b=this.o=this.c=this.j=!1;this.h=0;this.g=null;this.C=mm;this.w=this.Y=!1}v(lm,Oc);var mm="",nm=/^https?$/i,om=["POST","PUT"];
	function pm(b,c){if(b.M)throw Error("[goog.net.XhrIo] Object is active with another request="+b.u+"; newUri="+c);b.u=c;b.f="";b.F="GET";b.j=!1;b.a=!0;b.M=b.i?im(b.i):im(gm);b.l=b.i?em(b.i):em(gm);b.M.onreadystatechange=ua(b.A,b);try{b.o=!0,b.M.open("GET",String(c),!0),b.o=!1}catch(g){qm(b,g);return}var d=b.D.clone(),e=Xa(d.G()),f=ba.FormData&&!1;!(0<=Sa(om,"GET"))||e||f||Pg(d,"Content-Type","application/x-www-form-urlencoded;charset=utf-8");d.forEach(function(b,c){this.M.setRequestHeader(c,b)},b);
	b.C&&(b.M.responseType=b.C);"withCredentials"in b.M&&(b.M.withCredentials=b.Y);try{rm(b),0<b.h&&(b.w=sm(b.M),b.w?(b.M.timeout=b.h,b.M.ontimeout=ua(b.Ya,b)):b.g=Wl(b.Ya,b.h,b)),b.c=!0,b.M.send(""),b.c=!1}catch(g){qm(b,g)}}function sm(b){return Lb&&Xb(9)&&ka(b.timeout)&&ca(b.ontimeout)}function Ya(b){return"content-type"==b.toLowerCase()}
	lm.prototype.Ya=function(){"undefined"!=typeof aa&&this.M&&(this.f="Timed out after "+this.h+"ms, aborting",y(this,"timeout"),this.M&&this.a&&(this.a=!1,this.b=!0,this.M.abort(),this.b=!1,y(this,"complete"),y(this,"abort"),tm(this)))};function qm(b,c){b.a=!1;b.M&&(b.b=!0,b.M.abort(),b.b=!1);b.f=c;um(b);tm(b)}function um(b){b.j||(b.j=!0,y(b,"complete"),y(b,"error"))}lm.prototype.K=function(){this.M&&(this.a&&(this.a=!1,this.b=!0,this.M.abort(),this.b=!1),tm(this,!0));lm.ca.K.call(this)};
	lm.prototype.A=function(){this.H||(this.o||this.c||this.b?vm(this):this.N())};lm.prototype.N=function(){vm(this)};function vm(b){if(b.a&&"undefined"!=typeof aa&&(!b.l[1]||4!=wm(b)||2!=xm(b)))if(b.c&&4==wm(b))Wl(b.A,0,b);else if(y(b,"readystatechange"),4==wm(b)){b.a=!1;try{if(ym(b))y(b,"complete"),y(b,"success");else{var c;try{c=2<wm(b)?b.M.statusText:""}catch(d){c=""}b.f=c+" ["+xm(b)+"]";um(b)}}finally{tm(b)}}}
	function tm(b,c){if(b.M){rm(b);var d=b.M,e=b.l[0]?ea:null;b.M=null;b.l=null;c||y(b,"ready");try{d.onreadystatechange=e}catch(f){}}}function rm(b){b.M&&b.w&&(b.M.ontimeout=null);ka(b.g)&&(ba.clearTimeout(b.g),b.g=null)}
	function ym(b){var c=xm(b),d;a:switch(c){case 200:case 201:case 202:case 204:case 206:case 304:case 1223:d=!0;break a;default:d=!1}if(!d){if(c=0===c)b=String(b.u).match(jm)[1]||null,!b&&ba.self&&ba.self.location&&(b=ba.self.location.protocol,b=b.substr(0,b.length-1)),c=!nm.test(b?b.toLowerCase():"");d=c}return d}function wm(b){return b.M?b.M.readyState:0}function xm(b){try{return 2<wm(b)?b.M.status:-1}catch(c){return-1}}function zm(b){try{return b.M?b.M.responseText:""}catch(c){return""}};function Am(){if(!Lb)return!1;try{return new ActiveXObject("MSXML2.DOMDocument"),!0}catch(b){return!1}}var Bm=Lb&&Am();a:if(!document.implementation||!document.implementation.createDocument){if(Bm){var Cm=new ActiveXObject("MSXML2.DOMDocument");if(Cm){Cm.resolveExternals=!1;Cm.validateOnParse=!1;try{Cm.setProperty("ProhibitDTD",!0),Cm.setProperty("MaxXMLSize",2048),Cm.setProperty("MaxElementDepth",256)}catch(b){}}if(Cm)break a}throw Error("Your browser does not support creating new documents");};function Dm(b,c,d){return function(e,f,g){var h=new lm;h.C="text";w(h,"complete",function(b){b=b.target;if(ym(b)){var e=c.P(),f;if("json"==e)f=zm(b);else if("text"==e)f=zm(b);else if("xml"==e){if(!Lb)try{f=b.M?b.M.responseXML:null}catch(h){f=null}f||(f=zm(b),f=(new DOMParser).parseFromString(f,"application/xml"))}f&&(f=c.Jc(f,{featureProjection:g}),d.call(this,f))}gc(b)},!1,this);la(b)?pm(h,b(e,f,g)):pm(h,b)}}function Em(b,c){return Dm(b,c,function(b){this.Wb(b)})};function Fm(){return[[-Infinity,-Infinity,Infinity,Infinity]]};var Gm,Hm;
	(function(){var b={xa:{}};(function(){function c(b,d){if(!(this instanceof c))return new c(b,d);this.Sc=Math.max(4,b||9);this.Ld=Math.max(2,Math.ceil(.4*this.Sc));d&&this.Ze(d);this.clear()}function d(b,c){b.bbox=e(b,0,b.children.length,c)}function e(b,c,d,e){for(var g=[Infinity,Infinity,-Infinity,-Infinity],h;c<d;c++)h=b.children[c],f(g,b.ia?e(h):h.bbox);return g}function f(b,c){b[0]=Math.min(b[0],c[0]);b[1]=Math.min(b[1],c[1]);b[2]=Math.max(b[2],c[2]);b[3]=Math.max(b[3],c[3])}function g(b,c){return b.bbox[0]-
	c.bbox[0]}function h(b,c){return b.bbox[1]-c.bbox[1]}function l(b){return(b[2]-b[0])*(b[3]-b[1])}function m(b){return b[2]-b[0]+(b[3]-b[1])}function n(b,c){return b[0]<=c[0]&&b[1]<=c[1]&&c[2]<=b[2]&&c[3]<=b[3]}function p(b,c){return c[0]<=b[2]&&c[1]<=b[3]&&c[2]>=b[0]&&c[3]>=b[1]}function q(b,c,d,e,f){for(var g=[c,d],h;g.length;)d=g.pop(),c=g.pop(),d-c<=e||(h=c+Math.ceil((d-c)/e/2)*e,r(b,c,d,h,f),g.push(c,h,h,d))}function r(b,c,d,e,f){for(var g,h,l,m,n;d>c;){600<d-c&&(g=d-c+1,h=e-c+1,l=Math.log(g),
	m=.5*Math.exp(2*l/3),n=.5*Math.sqrt(l*m*(g-m)/g)*(0>h-g/2?-1:1),l=Math.max(c,Math.floor(e-h*m/g+n)),h=Math.min(d,Math.floor(e+(g-h)*m/g+n)),r(b,l,h,e,f));g=b[e];h=c;m=d;t(b,c,e);for(0<f(b[d],g)&&t(b,c,d);h<m;){t(b,h,m);h++;for(m--;0>f(b[h],g);)h++;for(;0<f(b[m],g);)m--}0===f(b[c],g)?t(b,c,m):(m++,t(b,m,d));m<=e&&(c=m+1);e<=m&&(d=m-1)}}function t(b,c,d){var e=b[c];b[c]=b[d];b[d]=e}c.prototype={all:function(){return this.Gd(this.data,[])},search:function(b){var c=this.data,d=[],e=this.ka;if(!p(b,c.bbox))return d;
	for(var f=[],g,h,l,m;c;){g=0;for(h=c.children.length;g<h;g++)l=c.children[g],m=c.ia?e(l):l.bbox,p(b,m)&&(c.ia?d.push(l):n(b,m)?this.Gd(l,d):f.push(l));c=f.pop()}return d},load:function(b){if(!b||!b.length)return this;if(b.length<this.Ld){for(var c=0,d=b.length;c<d;c++)this.Ta(b[c]);return this}b=this.Id(b.slice(),0,b.length-1,0);this.data.children.length?this.data.height===b.height?this.Nd(this.data,b):(this.data.height<b.height&&(c=this.data,this.data=b,b=c),this.Kd(b,this.data.height-b.height-1,
	!0)):this.data=b;return this},Ta:function(b){b&&this.Kd(b,this.data.height-1);return this},clear:function(){this.data={children:[],height:1,bbox:[Infinity,Infinity,-Infinity,-Infinity],ia:!0};return this},remove:function(b){if(!b)return this;for(var c=this.data,d=this.ka(b),e=[],f=[],g,h,l,m;c||e.length;){c||(c=e.pop(),h=e[e.length-1],g=f.pop(),m=!0);if(c.ia&&(l=c.children.indexOf(b),-1!==l)){c.children.splice(l,1);e.push(c);this.Xe(e);break}m||c.ia||!n(c.bbox,d)?h?(g++,c=h.children[g],m=!1):c=null:
	(e.push(c),f.push(g),g=0,h=c,c=c.children[0])}return this},ka:function(b){return b},Vc:function(b,c){return b[0]-c[0]},Wc:function(b,c){return b[1]-c[1]},toJSON:function(){return this.data},Gd:function(b,c){for(var d=[];b;)b.ia?c.push.apply(c,b.children):d.push.apply(d,b.children),b=d.pop();return c},Id:function(b,c,e,f){var g=e-c+1,h=this.Sc,l;if(g<=h)return l={children:b.slice(c,e+1),height:1,bbox:null,ia:!0},d(l,this.ka),l;f||(f=Math.ceil(Math.log(g)/Math.log(h)),h=Math.ceil(g/Math.pow(h,f-1)));
	l={children:[],height:f,bbox:null};var g=Math.ceil(g/h),h=g*Math.ceil(Math.sqrt(h)),m,n,p;for(q(b,c,e,h,this.Vc);c<=e;c+=h)for(n=Math.min(c+h-1,e),q(b,c,n,g,this.Wc),m=c;m<=n;m+=g)p=Math.min(m+g-1,n),l.children.push(this.Id(b,m,p,f-1));d(l,this.ka);return l},We:function(b,c,d,e){for(var f,g,h,m,n,p,q,r;;){e.push(c);if(c.ia||e.length-1===d)break;q=r=Infinity;f=0;for(g=c.children.length;f<g;f++)h=c.children[f],n=l(h.bbox),p=h.bbox,p=(Math.max(p[2],b[2])-Math.min(p[0],b[0]))*(Math.max(p[3],b[3])-Math.min(p[1],
	b[1]))-n,p<r?(r=p,q=n<q?n:q,m=h):p===r&&n<q&&(q=n,m=h);c=m}return c},Kd:function(b,c,d){var e=this.ka;d=d?b.bbox:e(b);var e=[],g=this.We(d,this.data,c,e);g.children.push(b);for(f(g.bbox,d);0<=c;)if(e[c].children.length>this.Sc)this.bf(e,c),c--;else break;this.Te(d,e,c)},bf:function(b,c){var e=b[c],f=e.children.length,g=this.Ld;this.Ue(e,g,f);f={children:e.children.splice(this.Ve(e,g,f)),height:e.height};e.ia&&(f.ia=!0);d(e,this.ka);d(f,this.ka);c?b[c-1].children.push(f):this.Nd(e,f)},Nd:function(b,
	c){this.data={children:[b,c],height:b.height+1};d(this.data,this.ka)},Ve:function(b,c,d){var f,g,h,m,n,p,q;n=p=Infinity;for(f=c;f<=d-c;f++)g=e(b,0,f,this.ka),h=e(b,f,d,this.ka),m=Math.max(0,Math.min(g[2],h[2])-Math.max(g[0],h[0]))*Math.max(0,Math.min(g[3],h[3])-Math.max(g[1],h[1])),g=l(g)+l(h),m<n?(n=m,q=f,p=g<p?g:p):m===n&&g<p&&(p=g,q=f);return q},Ue:function(b,c,d){var e=b.ia?this.Vc:g,f=b.ia?this.Wc:h,l=this.Hd(b,c,d,e);c=this.Hd(b,c,d,f);l<c&&b.children.sort(e)},Hd:function(b,c,d,g){b.children.sort(g);
	g=this.ka;var h=e(b,0,c,g),l=e(b,d-c,d,g),n=m(h)+m(l),p,q;for(p=c;p<d-c;p++)q=b.children[p],f(h,b.ia?g(q):q.bbox),n+=m(h);for(p=d-c-1;p>=c;p--)q=b.children[p],f(l,b.ia?g(q):q.bbox),n+=m(l);return n},Te:function(b,c,d){for(;0<=d;d--)f(c[d].bbox,b)},Xe:function(b){for(var c=b.length-1,e;0<=c;c--)0===b[c].children.length?0<c?(e=b[c-1].children,e.splice(e.indexOf(b[c]),1)):this.clear():d(b[c],this.ka)},Ze:function(b){var c=["return a"," - b",";"];this.Vc=new Function("a","b",c.join(b[0]));this.Wc=new Function("a",
	"b",c.join(b[1]));this.ka=new Function("a","return [a"+b.join(", a")+"];")}};"undefined"!==typeof b?b.xa=c:"undefined"!==typeof self?self.a=c:window.a=c})();Gm=b.xa})();function Im(b){this.b=Gm(b);this.a={}}k=Im.prototype;k.Ta=function(b,c){var d=[b[0],b[1],b[2],b[3],c];this.b.Ta(d);this.a[pa(c)]=d};k.load=function(b,c){for(var d=Array(c.length),e=0,f=c.length;e<f;e++){var g=b[e],h=c[e],g=[g[0],g[1],g[2],g[3],h];d[e]=g;this.a[pa(h)]=g}this.b.load(d)};k.remove=function(b){b=pa(b);var c=this.a[b];delete this.a[b];return null!==this.b.remove(c)};function Jm(b){return b.b.all().map(function(b){return b[4]})}
	function Km(b,c){return b.b.search(c).map(function(b){return b[4]})}k.forEach=function(b,c){return Lm(Jm(this),b,c)};function Mm(b,c,d,e){return Lm(Km(b,c),d,e)}function Lm(b,c,d){for(var e,f=0,g=b.length;f<g&&!(e=c.call(d,b[f]));f++);return e}k.Aa=function(){return Eb(this.a)};k.clear=function(){this.b.clear();this.a={}};k.v=function(){return this.b.data.bbox};function W(b){b=b||{};fg.call(this,{attributions:b.attributions,logo:b.logo,projection:void 0,state:"ready",wrapX:void 0!==b.wrapX?b.wrapX:!0});this.w=ya;void 0!==b.loader?this.w=b.loader:void 0!==b.url&&(this.w=Em(b.url,b.format));this.F=void 0!==b.strategy?b.strategy:Fm;var c=void 0!==b.useSpatialIndex?b.useSpatialIndex:!0;this.a=c?new Im:null;this.A=new Im;this.c={};this.f={};this.h={};this.i={};this.b=null;var d,e;b.features instanceof F?(d=b.features,e=d.a):ha(b.features)&&(e=b.features);c||
	void 0!==d||(d=new F(e));void 0!==e&&Nm(this,e);void 0!==d&&Om(this,d)}v(W,fg);k=W.prototype;k.Vb=function(b){var c=pa(b).toString();if(Pm(this,c,b)){Qm(this,c,b);var d=b.J();d?(c=d.v(),this.a&&this.a.Ta(c,b)):this.c[c]=b;y(this,new Rm("addfeature",b))}this.s()};function Qm(b,c,d){b.i[c]=[w(d,"change",b.je,!1,b),w(d,"propertychange",b.je,!1,b)]}function Pm(b,c,d){var e=!0,f=d.$;void 0!==f?f.toString()in b.f?e=!1:b.f[f.toString()]=d:b.h[c]=d;return e}k.Wb=function(b){Nm(this,b);this.s()};
	function Nm(b,c){var d,e,f,g,h=[],l=[],m=[];e=0;for(f=c.length;e<f;e++)g=c[e],d=pa(g).toString(),Pm(b,d,g)&&l.push(g);e=0;for(f=l.length;e<f;e++){g=l[e];d=pa(g).toString();Qm(b,d,g);var n=g.J();n?(d=n.v(),h.push(d),m.push(g)):b.c[d]=g}b.a&&b.a.load(h,m);e=0;for(f=l.length;e<f;e++)y(b,new Rm("addfeature",l[e]))}
	function Om(b,c){var d=!1;w(b,"addfeature",function(b){d||(d=!0,c.push(b.feature),d=!1)});w(b,"removefeature",function(b){d||(d=!0,c.remove(b.feature),d=!1)});w(c,"add",function(b){d||(b=b.element,d=!0,this.Vb(b),d=!1)},!1,b);w(c,"remove",function(b){d||(b=b.element,d=!0,this.xd(b),d=!1)},!1,b);b.b=c}
	k.clear=function(b){if(b){for(var c in this.i)this.i[c].forEach(Jc);this.b||(this.i={},this.f={},this.h={})}else b=this.ze,this.a&&(this.a.forEach(b,this),zb(this.c,b,this));this.b&&this.b.clear();this.a&&this.a.clear();this.A.clear();this.c={};y(this,new Rm("clear"));this.s()};k.Rd=function(b,c){if(this.a)return this.a.forEach(b,c);if(this.b)return this.b.forEach(b,c)};function Sm(b,c,d){b.cb([c[0],c[1],c[0],c[1]],function(b){if(b.J().Pd(c))return d.call(void 0,b)})}
	k.cb=function(b,c,d){if(this.a)return Mm(this.a,b,c,d);if(this.b)return this.b.forEach(c,d)};function Tm(b,c,d,e){b.cb(c,d,e)}k.Sd=function(b,c,d){return this.cb(b,function(e){if(e.J().ea(b)&&(e=c.call(d,e)))return e})};k.Wd=function(){return this.b};k.se=function(){var b;this.b?b=this.b.a:this.a&&(b=Jm(this.a),Eb(this.c)||bb(b,Cb(this.c)));return b};k.Vd=function(b){var c=[];Sm(this,b,function(b){c.push(b)});return c};k.Xd=function(b){return Km(this.a,b)};
	k.Td=function(b){var c=b[0],d=b[1],e=null,f=[NaN,NaN],g=Infinity,h=[-Infinity,-Infinity,Infinity,Infinity];Mm(this.a,h,function(b){var m=b.J(),n=g;g=m.pa(c,d,f,g);g<n&&(e=b,b=Math.sqrt(g),h[0]=c-b,h[1]=d-b,h[2]=c+b,h[3]=d+b)});return e};k.v=function(){return this.a.v()};k.Ud=function(b){b=this.f[b.toString()];return void 0!==b?b:null};
	k.je=function(b){b=b.target;var c=pa(b).toString(),d=b.J();if(d)if(d=d.v(),c in this.c)delete this.c[c],this.a&&this.a.Ta(d,b);else{if(this.a){var e=this.a,f=pa(b);od(e.a[f].slice(0,4),d)||(e.remove(b),e.Ta(d,b))}}else c in this.c||(this.a&&this.a.remove(b),this.c[c]=b);d=b.$;void 0!==d?(d=d.toString(),c in this.h?(delete this.h[c],this.f[d]=b):this.f[d]!==b&&(Um(this,b),this.f[d]=b)):c in this.h||(Um(this,b),this.h[c]=b);this.s();y(this,new Rm("changefeature",b))};
	k.Aa=function(){return this.a.Aa()&&Eb(this.c)};function Vm(b,c,d,e){var f=b.A;c=b.F(c,d);var g,h;g=0;for(h=c.length;g<h;++g){var l=c[g];Mm(f,l,function(b){return ld(b.extent,l)})||(b.w.call(b,l,d,e),f.Ta(l,{extent:l.slice()}))}}k.xd=function(b){var c=pa(b).toString();c in this.c?delete this.c[c]:this.a&&this.a.remove(b);this.ze(b);this.s()};
	k.ze=function(b){var c=pa(b).toString();this.i[c].forEach(Jc);delete this.i[c];var d=b.$;void 0!==d?delete this.f[d.toString()]:delete this.h[c];y(this,new Rm("removefeature",b))};function Um(b,c){for(var d in b.f)if(b.f[d]===c){delete b.f[d];break}}function Rm(b,c){hc.call(this,b);this.feature=c}v(Rm,hc);function Ii(b){xk.call(this,b);this.f=null;this.h=bd();this.b=this.c=null}v(Ii,xk);k=Ii.prototype;k.Bc=function(b,c,d,e){var f=this.a;return f.da().mh(b,c.viewState.resolution,c.viewState.rotation,c.skippedFeatureUids,function(b){return d.call(e,b,f)})};
	k.od=function(b,c,d,e){if(this.Kb()&&(this.c||(this.c=bd(),cd(this.h,this.c)),b=Ak(b,this.c),this.b||(this.b=mh(1,1)),this.b.clearRect(0,0,1,1),this.b.drawImage(this.Kb(),b[0],b[1],1,1,0,0,1,1),0<this.b.getImageData(0,0,1,1).data[3]))return d.call(e,this.a)};k.Kb=function(){return this.f?this.f.c():null};k.bd=function(){return this.h};
	k.Cc=function(b,c){var d=b.pixelRatio,e=b.viewState,f=e.center,g=e.resolution,h=e.rotation,l,m=this.a.da(),n=b.viewHints;l=b.extent;void 0!==c.extent&&(l=Dd(l,c.extent));if(!n[0]&&!n[1]&&!Gd(l)){e=e.projection;(n=m.u)&&(e=n);if(e=l=m.b(l,g,d,e))e=l,n=e.state,2!=n&&3!=n&&w(e,"change",this.D,!1,this),0==n&&(e.load(),n=e.state),e=2==n;e&&(this.f=l)}if(this.f){l=this.f;var e=l.v(),n=l.Z(),p=l.i,g=d*n/(g*p);ri(this.h,d*b.size[0]/2,d*b.size[1]/2,g,g,h,p*(e[0]-f[0])/n,p*(f[1]-e[3])/n);this.c=null;xi(b.attributions,
	l.l);yi(b,m)}return!0};function Ji(b){xk.call(this,b);this.b=this.h=null;this.j=!1;this.l=null;this.o=bd();this.f=null;this.w=this.A=this.C=NaN;this.i=this.c=null;this.N=[0,0]}v(Ji,xk);Ji.prototype.Kb=function(){return this.h};Ji.prototype.bd=function(){return this.o};
	Ji.prototype.Cc=function(b,c){var d=b.pixelRatio,e=b.viewState,f=e.projection,g=this.a,h=g.da(),l=h.tileGrid?h.tileGrid:rg(f),m=qg(l,e.resolution),n=xg(h,m,f),p=n[0]/Xc(og(l,m),this.N)[0],q=l.Z(m),p=q/p,r=e.center,t;q==e.resolution?(t=b.size,r=[q*(Math.round(r[0]/q)+t[0]%2/2),q*(Math.round(r[1]/q)+t[1]%2/2)],t=Bd(r,q,e.rotation,b.size)):t=b.extent;void 0!==c.extent&&(t=Dd(t,c.extent));if(Gd(t))return!1;var A=kg(l,t,q),K=n[0]*(A.b-A.a+1),U=n[1]*(A.g-A.c+1),x,L;this.h?(x=this.h,L=this.l,this.b[0]<K||
	this.b[1]<U||this.A!==n[0]||this.w!==n[1]||this.j&&(this.b[0]>K||this.b[1]>U)?(x.width=K,x.height=U,this.b=[K,U],this.j=!Bk(this.b),this.c=null):(K=this.b[0],U=this.b[1],(x=m!=this.C)||(x=this.c,x=!(x.a<=A.a&&A.b<=x.b&&x.c<=A.c&&A.g<=x.g)),x&&(this.c=null))):(L=mh(K,U),this.h=L.canvas,this.b=[K,U],this.l=L,this.j=!Bk(this.b));var V,X;this.c?(x=this.c,K=x.b-x.a+1):(K/=n[0],U/=n[1],V=A.a-Math.floor((K-(A.b-A.a+1))/2),X=A.c-Math.floor((U-(A.g-A.c+1))/2),this.C=m,this.A=n[0],this.w=n[1],this.c=new gf(V,
	V+K-1,X,X+U-1),this.i=Array(K*U),x=this.c);var da={};da[m]={};var U=[],oa=ui(h,da),na=g.h(),fa=nd(),S=new gf(0,0,0,0),I,xa,Ha;for(X=A.a;X<=A.b;++X)for(Ha=A.c;Ha<=A.g;++Ha)if(I=Wm(h,m,X,Ha,d,f),V=I.state,2==V||4==V||3==V&&!na)da[m][ff(I.a)]=I;else{a:{xa=l;for(var Va=I.a,Aa=oa,qd=S,rd=pg(xa,Va,fa),Va=Va[0]-1;Va>=xa.minZoom;){if(Aa.call(null,Va,mg(xa,rd,Va,qd))){xa=!0;break a}--Va}xa=!1}xa||(U.push(I),xa=l,I=I.a,Aa=S,I[0]<xa.maxZoom?(qd=pg(xa,I,fa),I=mg(xa,qd,I[0]+1,Aa)):I=null,I&&oa(m+1,I))}oa=0;for(xa=
	U.length;oa<xa;++oa)I=U[oa],X=n[0]*(I.a[1]-x.a),Ha=n[1]*(x.g-I.a[2]),L.clearRect(X,Ha,n[0],n[1]);Aa=Object.keys(da).map(Number);eb(Aa);var qd=h.A,U=zd(pg(l,[m,x.a,x.g],fa)),Ob,ob,Kc,Mh,oa=0;for(xa=Aa.length;oa<xa;++oa)if(X=Aa[oa],n=xg(h,X,f),rd=da[X],X==m)for(ob in rd)I=rd[ob],Ob=(I.a[2]-x.c)*K+(I.a[1]-x.a),this.i[Ob]!=I&&(X=n[0]*(I.a[1]-x.a),Ha=n[1]*(x.g-I.a[2]),V=I.state,4!=V&&(3!=V||na)&&qd||L.clearRect(X,Ha,n[0],n[1]),2==V&&L.drawImage(I.b,0,0,n[0],n[1],X,Ha,n[0],n[1]),this.i[Ob]=I);else for(ob in Va=
	l.Z(X)/q,rd)for(I=rd[ob],Ob=pg(l,I.a,fa),X=(Ob[0]-U[0])/p,Ha=(U[1]-Ob[3])/p,Mh=Va*n[0],Kc=Va*n[1],V=I.state,4!=V&&qd||L.clearRect(X,Ha,Mh,Kc),2==V&&L.drawImage(I.b,0,0,n[0],n[1],X,Ha,Mh,Kc),I=mg(l,Ob,m,S),V=Math.max(I.a,x.a),Ha=Math.min(I.b,x.b),X=Math.max(I.c,x.c),I=Math.min(I.g,x.g);V<=Ha;++V)for(Kc=X;Kc<=I;++Kc)Ob=(Kc-x.c)*K+(V-x.a),this.i[Ob]=void 0;n=b.usedTiles;q=pa(h).toString();ob=m.toString();q in n?ob in n[q]?(n=n[q][ob],A.a<n.a&&(n.a=A.a),A.b>n.b&&(n.b=A.b),A.c<n.c&&(n.c=A.c),A.g>n.g&&
	(n.g=A.g)):n[q][ob]=A:(n[q]={},n[q][ob]=A);g=g.f();A=pa(h).toString();A in b.wantedTiles||(b.wantedTiles[A]={});n=b.wantedTiles[A];q=b.tileQueue;ob=l.minZoom;for(var sd,da=m;da>=ob;--da)for(sd=mg(l,t,da,sd),L=l.Z(da),K=sd.a;K<=sd.b;++K)for(x=sd.c;x<=sd.g;++x)m-da<=g?(fa=Wm(h,da,K,x,d,f),0==fa.state&&(n[ff(fa.a)]=!0,fa.getKey()in q.g||(na=q,fa=[fa,A,ng(l,fa.a),L],S=na.l(fa),Infinity!=S&&(na.a.push(fa),na.b.push(S),na.g[na.f(fa)]=!0,Ni(na,0,na.a.length-1))))):h.Oe(da,K,x);wi(b,h);yi(b,h);ri(this.o,
	d*b.size[0]/2,d*b.size[1]/2,d*p/e.resolution,d*p/e.resolution,e.rotation,(U[0]-r[0])/p,(r[1]-U[1])/p);this.f=null;return!0};Ji.prototype.od=function(b,c,d,e){if(this.l&&(this.f||(this.f=bd(),cd(this.o,this.f)),b=Ak(b,this.f),0<this.l.getImageData(b[0],b[1],1,1).data[3]))return d.call(e,this.a)};function Ki(b){xk.call(this,b);this.c=!1;this.j=-1;this.i=NaN;this.h=nd();this.b=this.l=null;this.f=mh()}v(Ki,xk);
	Ki.prototype.u=function(b,c,d){var e=b.extent,f=b.pixelRatio,g=c.sc?b.skippedFeatureUids:{},h=b.viewState,l=h.projection,h=h.rotation,m=l.v(),n=this.a.da(),p=zk(this,b,0);yk(this,"precompose",d,b,p);var q=this.b;if(q&&!q.Aa()){var r;Qc(this.a,"render")?(this.f.canvas.width=d.canvas.width,this.f.canvas.height=d.canvas.height,r=this.f):r=d;var t=r.globalAlpha;r.globalAlpha=c.opacity;Wk(q,r,f,p,h,g);if(n.C&&l.g&&!ld(m,e)){c=e[0];l=Fd(m);for(n=0;c<m[0];)--n,p=l*n,p=zk(this,b,p),Wk(q,r,f,p,h,g),c+=l;n=
	0;for(c=e[2];c>m[2];)++n,p=l*n,p=zk(this,b,p),Wk(q,r,f,p,h,g),c-=l;p=zk(this,b,0)}r!=d&&(yk(this,"render",r,b,p),d.drawImage(r.canvas,0,0));r.globalAlpha=t}yk(this,"postcompose",d,b,p)};Ki.prototype.Bc=function(b,c,d,e){if(this.b){var f=c.viewState.resolution,g=c.viewState.rotation,h=this.a,l=c.layerStates[pa(h)],m={};return Tk(this.b,b,f,g,l.sc?c.skippedFeatureUids:{},function(b){var c=pa(b).toString();if(!(c in m))return m[c]=!0,d.call(e,b,h)})}};Ki.prototype.o=function(){vi(this)};
	Ki.prototype.Cc=function(b){function c(b){var c,e=b.c;e?c=e.call(b,n):(e=d.f)&&(c=e(b,n));if(c){if(c){var f,g=!1,e=0;for(f=c.length;e<f;++e){var h=.5*n/p,l=r,m=b,q=c[e],t=h*h,fa=this.o,h=!1,S=void 0,I=void 0;if(S=q.h)I=S.Ob(),2==I||3==I?S.Bd(fa,this):(0==I&&S.load(),S.jd(fa,this),h=!0);if(fa=(0,q.c)(m))t=fa.jc(t),(0,fl[t.P()])(l,t,q,m);g=h||g}b=g}else b=!1;this.c=this.c||b}}var d=this.a,e=d.da();xi(b.attributions,e.j);yi(b,e);var f=b.viewHints[0],g=b.viewHints[1],h=d.C,l=d.w;if(!this.c&&!h&&f||!l&&
	g)return!0;var m=b.extent,l=b.viewState,f=l.projection,n=l.resolution,p=b.pixelRatio,g=d.g,q=d.i,h=d.get("renderOrder");void 0===h&&(h=el);m=gd(m,q*n);q=l.projection.v();e.C&&l.projection.g&&!ld(q,b.extent)&&(b=Math.max(Fd(m)/2,Fd(q)),m[0]=q[0]-b,m[2]=q[2]+b);if(!this.c&&this.i==n&&this.j==g&&this.l==h&&ld(this.h,m))return!0;gc(this.b);this.b=null;this.c=!1;var r=new Rk(.5*n/p,m,n,d.i);Vm(e,m,n,f);if(h){var t=[];Tm(e,m,function(b){t.push(b)},this);eb(t,h);t.forEach(c,this)}else e.cb(m,c,this);Sk(r);
	this.i=n;this.j=g;this.l=h;this.h=m;this.b=r;return!0};function Xm(b,c){Ei.call(this,0,c);this.f=mh();this.a=this.f.canvas;this.a.style.width="100%";this.a.style.height="100%";this.a.className="ol-unselectable";b.insertBefore(this.a,b.childNodes[0]||null);this.g=!0;this.j=bd()}v(Xm,Ei);
	function Ym(b,c,d){var e=b.h,f=b.f;if(Qc(e,c)){var g=d.extent,h=d.pixelRatio,l=d.viewState.rotation,m=d.pixelRatio,n=d.viewState,p=n.resolution;b=ri(b.j,b.a.width/2,b.a.height/2,m/p,-m/p,-n.rotation,-n.center[0],-n.center[1]);g=new kk(f,h,g,b,l);y(e,new ni(c,e,g,d,f,null));wk(g)}}Xm.prototype.P=function(){return"canvas"};
	Xm.prototype.l=function(b){if(b){var c=this.f,d=b.size[0]*b.pixelRatio,e=b.size[1]*b.pixelRatio;this.a.width!=d||this.a.height!=e?(this.a.width=d,this.a.height=e):c.clearRect(0,0,this.a.width,this.a.height);d=b.viewState;e=b.coordinateToPixelMatrix;ri(e,b.size[0]/2,b.size[1]/2,1/d.resolution,-1/d.resolution,-d.rotation,-d.center[0],-d.center[1]);cd(e,b.pixelToCoordinateMatrix);Ym(this,"precompose",b);d=b.layerStatesArray;gb(d);var e=b.viewState.resolution,f,g,h,l;f=0;for(g=d.length;f<g;++f)l=d[f],
	h=l.layer,h=Hi(this,h),l.visible&&e>=l.minResolution&&e<l.maxResolution&&"ready"==l.Fi&&h.Cc(b,l)&&h.u(b,l,c);Ym(this,"postcompose",b);this.g||(Uf(this.a,!0),this.g=!0);for(var m in this.b)if(!(m in b.layerStates)){b.postRenderFunctions.push(ua(this.o,this));break}b.postRenderFunctions.push(Fi)}else this.g&&(Uf(this.a,!1),this.g=!1)};var Zm=["canvas","webgl","dom"];
	function Y(b){Tc.call(this);var c=$m(b);this.Pa=void 0!==b.loadTilesWhileAnimating?b.loadTilesWhileAnimating:!1;this.Za=void 0!==b.loadTilesWhileInteracting?b.loadTilesWhileInteracting:!1;this.ab=void 0!==b.pixelRatio?b.pixelRatio:nh;this.$a=c.logos;this.o=new Fg(this.ii,void 0,this);fc(this,this.o);this.Na=bd();this.ob=bd();this.Oa=0;this.b=null;this.va=nd();this.C=this.D=null;this.a=yf("DIV","ol-viewport");this.a.style.position="relative";this.a.style.overflow="hidden";this.a.style.width="100%";
	this.a.style.height="100%";this.a.style.msTouchAction="none";this.a.style.a="none";qh&&If(this.a,"ol-touch");this.ga=yf("DIV","ol-overlaycontainer");this.a.appendChild(this.ga);this.w=yf("DIV","ol-overlaycontainer-stopevent");w(this.w,["click","dblclick","mousedown","touchstart","MSPointerDown",gi,Nb?"DOMMouseScroll":"mousewheel"],ic);this.a.appendChild(this.w);b=new Zh(this);w(b,Cb(ji),this.ke,!1,this);fc(this,b);this.Y=c.keyboardEventTarget;this.u=new Yg;w(this.u,"key",this.ie,!1,this);fc(this,
	this.u);b=new fh(this.a);w(b,"mousewheel",this.ie,!1,this);fc(this,b);this.f=c.controls;this.c=c.interactions;this.h=c.overlays;this.i=new c.ki(this.a,this);fc(this,this.i);this.Ja=new Tg;fc(this,this.Ja);this.F=this.j=null;this.A=[];this.la=[];this.fa=new Oi(ua(this.Uf,this),ua(this.Xg,this));this.N={};w(this,Vc("layergroup"),this.fg,!1,this);w(this,Vc("view"),this.vg,!1,this);w(this,Vc("size"),this.sg,!1,this);w(this,Vc("target"),this.ug,!1,this);this.I(c.values);this.f.forEach(function(b){b.setMap(this)},
	this);w(this.f,"add",function(b){b.element.setMap(this)},!1,this);w(this.f,"remove",function(b){b.element.setMap(null)},!1,this);this.c.forEach(function(b){b.setMap(this)},this);w(this.c,"add",function(b){b.element.setMap(this)},!1,this);w(this.c,"remove",function(b){b.element.setMap(null)},!1,this);this.h.forEach(function(b){b.setMap(this)},this);w(this.h,"add",function(b){b.element.setMap(this)},!1,this);w(this.h,"remove",function(b){b.element.setMap(null)},!1,this)}v(Y,Tc);k=Y.prototype;k.cf=function(b){this.f.push(b)};
	k.ef=function(b){this.c.push(b)};k.ff=function(b){this.fb().jb().push(b)};k.gf=function(b){this.h.push(b)};k.ha=function(b){this.render();Array.prototype.push.apply(this.A,arguments)};k.K=function(){Cf(this.a);Y.ca.K.call(this)};k.Zc=function(b,c,d,e,f){if(this.b)return b=this.ya(b),Gi(this.i,b,this.b,c,void 0!==d?d:null,void 0!==e?e:Kd,void 0!==f?f:null)};
	k.Vg=function(b,c,d,e,f){if(this.b){a:{var g=this.i,h=this.b;d=void 0!==d?d:null;e=void 0!==e?e:Kd;f=void 0!==f?f:null;var l,m=h.viewState.resolution,n=h.layerStatesArray,p;for(p=n.length-1;0<=p;--p){l=n[p];var q=l.layer;if(l.visible&&m>=l.minResolution&&m<l.maxResolution&&e.call(f,q)&&(l=Hi(g,q).od(b,h,c,d))){b=l;break a}}b=void 0}return b}};k.xg=function(b,c,d){if(!this.b)return!1;b=this.ya(b);var e=this.i;return void 0!==Gi(e,b,this.b,Kd,e,void 0!==c?c:Kd,void 0!==d?d:null)};k.yf=function(b){return this.ya(this.ad(b))};
	k.ad=function(b){var c;c=this.a;b=Rf(b);c=Rf(c);c=new pf(b.x-c.x,b.y-c.y);return[c.x,c.y]};k.pe=function(){return this.get("target")};k.Fb=function(){var b=this.pe();return void 0!==b?uf(b):null};k.ya=function(b){var c=this.b;return c?(b=b.slice(),si(c.pixelToCoordinateMatrix,b,b)):null};k.xf=function(){return this.f};k.Nf=function(){return this.h};k.Df=function(){return this.c};k.fb=function(){return this.get("layergroup")};k.Wg=function(){return this.fb().jb()};
	k.Eb=function(b){var c=this.b;return c?(b=b.slice(0,2),si(c.coordinateToPixelMatrix,b,b)):null};k.ib=function(){return this.get("size")};k.R=function(){return this.get("view")};k.Wf=function(){return this.a};k.Uf=function(b,c,d,e){var f=this.b;if(!(f&&c in f.wantedTiles&&f.wantedTiles[c][ff(b.a)]))return Infinity;b=d[0]-f.focus[0];d=d[1]-f.focus[1];return 65536*Math.log(e)+Math.sqrt(b*b+d*d)/e};k.ie=function(b,c){var d=new Xh(c||b.type,this,b);this.ke(d)};
	k.ke=function(b){if(this.b){this.F=b.coordinate;b.frameState=this.b;var c=this.c.a,d;if(!1!==y(this,b))for(d=c.length-1;0<=d;d--){var e=c[d];if(e.D()&&!e.handleEvent(b))break}}};
	k.rg=function(){var b=this.b,c=this.fa;if(!c.Aa()){var d=16,e=d,f=0;b&&(f=b.viewHints,f[0]&&(d=this.Pa?8:0,e=2),f[1]&&(d=this.Za?8:0,e=2),f=Bb(b.wantedTiles));d*=f;e*=f;if(c.c<d){var f=c.l,g=c.a,h=c.b,l=0,m=g.length,n,p,q;for(p=0;p<m;++p)n=g[p],q=f(n),Infinity==q?delete c.g[c.f(n)]:(h[l]=q,g[l++]=n);g.length=l;h.length=l;for(f=(c.a.length>>1)-1;0<=f;f--)Mi(c,f);Pi(c,d,e)}}c=this.la;d=0;for(e=c.length;d<e;++d)c[d](this,b);c.length=0};k.sg=function(){this.render()};
	k.ug=function(){var b=this.Fb();eh(this.u);b?(b.appendChild(this.a),Zg(this.u,this.Y?this.Y:b),this.j||(this.j=w(this.Ja,"resize",this.Cd,!1,this))):(Cf(this.a),this.j&&(Jc(this.j),this.j=null));this.Cd()};k.Xg=function(){this.render()};k.wg=function(){this.render()};k.vg=function(){this.D&&(Jc(this.D),this.D=null);var b=this.R();b&&(this.D=w(b,"propertychange",this.wg,!1,this));this.render()};k.gg=function(){this.render()};k.hg=function(){this.render()};
	k.fg=function(){this.C&&(this.C.forEach(Jc),this.C=null);var b=this.fb();b&&(this.C=[w(b,"propertychange",this.hg,!1,this),w(b,"change",this.gg,!1,this)]);this.render()};k.ji=function(){var b=this.o;Gg(b);b.c()};k.render=function(){null!=this.o.$||this.o.start()};k.ci=function(b){return this.f.remove(b)};k.ei=function(b){return this.c.remove(b)};k.gi=function(b){return this.fb().jb().remove(b)};k.hi=function(b){return this.h.remove(b)};
	k.ii=function(b){var c,d,e,f=this.ib(),g=this.R(),h=null;if(c=void 0!==f&&0<f[0]&&0<f[1]&&g)c=!!g.na()&&void 0!==g.Z();if(c){var h=g.f.slice(),l=this.fb().cd(),m={};c=0;for(d=l.length;c<d;++c)m[pa(l[c].layer)]=l[c];e=Xe(g);h={animate:!1,attributions:{},coordinateToPixelMatrix:this.Na,extent:null,focus:this.F?this.F:e.center,index:this.Oa++,layerStates:m,layerStatesArray:l,logos:Gb(this.$a),pixelRatio:this.ab,pixelToCoordinateMatrix:this.ob,postRenderFunctions:[],size:f,skippedFeatureUids:this.N,tileQueue:this.fa,
	time:b,usedTiles:{},viewState:e,viewHints:h,wantedTiles:{}}}if(h){b=this.A;c=f=0;for(d=b.length;c<d;++c)g=b[c],g(this,h)&&(b[f++]=g);b.length=f;h.extent=Bd(e.center,e.resolution,e.rotation,h.size)}this.b=h;this.i.l(h);h&&(h.animate&&this.render(),Array.prototype.push.apply(this.la,h.postRenderFunctions),0!==this.A.length||h.viewHints[0]||h.viewHints[1]||od(h.extent,this.va)||(y(this,new $f("moveend",this,h)),hd(h.extent,this.va)));y(this,new $f("postrender",this,h));Kg(this.rg,this)};
	k.si=function(b){this.B("layergroup",b)};k.zd=function(b){this.B("size",b)};k.Yg=function(b){this.B("target",b)};k.Bi=function(b){this.B("view",b)};k.Ke=function(b){b=pa(b).toString();this.N[b]=!0;this.render()};
	k.Cd=function(){var b=this.Fb();if(b){var c=tf(b),d=Lb&&b.currentStyle,e;if(e=d)rf(c),e=!0;if(e&&"auto"!=d.width&&"auto"!=d.height&&!d.boxSizing)c=Vf(b,d.width,"width","pixelWidth"),b=Vf(b,d.height,"height","pixelHeight"),b=new qf(c,b);else{d=new qf(b.offsetWidth,b.offsetHeight);c=Xf(b,"padding");if(!Lb||9<=Zb)e=Mf(b,"borderLeftWidth"),f=Mf(b,"borderRightWidth"),g=Mf(b,"borderTopWidth"),b=Mf(b,"borderBottomWidth"),b=new Kf(parseFloat(g),parseFloat(f),parseFloat(b),parseFloat(e));else{e=Zf(b,"borderLeft");
	var f=Zf(b,"borderRight"),g=Zf(b,"borderTop"),b=Zf(b,"borderBottom"),b=new Kf(g,f,b,e)}b=new qf(d.width-b.left-c.left-c.right-b.right,d.height-b.top-c.top-c.bottom-b.bottom)}this.zd([b.width,b.height])}else this.zd(void 0)};k.Me=function(b){b=pa(b).toString();delete this.N[b];this.render()};
	function $m(b){var c=null;void 0!==b.keyboardEventTarget&&(c=ja(b.keyboardEventTarget)?document.getElementById(b.keyboardEventTarget):b.keyboardEventTarget);var d={},e={};if(void 0===b.logo||"boolean"==typeof b.logo&&b.logo)e["data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAMAAABEpIrGAAAAA3NCSVQICAjb4U/gAAAACXBIWXMAAAHGAAABxgEXwfpGAAAAGXRFWHRTb2Z0d2FyZQB3d3cuaW5rc2NhcGUub3Jnm+48GgAAAhNQTFRF////AP//AICAgP//AFVVQECA////K1VVSbbbYL/fJ05idsTYJFtbbcjbJllmZszWWMTOIFhoHlNiZszTa9DdUcHNHlNlV8XRIVdiasrUHlZjIVZjaMnVH1RlIFRkH1RkH1ZlasvYasvXVsPQH1VkacnVa8vWIVZjIFRjVMPQa8rXIVVkXsXRsNveIFVkIFZlIVVj3eDeh6GmbMvXH1ZkIFRka8rWbMvXIFVkIFVjIFVkbMvWH1VjbMvWIFVlbcvWIFVla8vVIFVkbMvWbMvVH1VkbMvWIFVlbcvWIFVkbcvVbMvWjNPbIFVkU8LPwMzNIFVkbczWIFVkbsvWbMvXIFVkRnB8bcvW2+TkW8XRIFVkIlZlJVloJlpoKlxrLl9tMmJwOWd0Omh1RXF8TneCT3iDUHiDU8LPVMLPVcLPVcPQVsPPVsPQV8PQWMTQWsTQW8TQXMXSXsXRX4SNX8bSYMfTYcfTYsfTY8jUZcfSZsnUaIqTacrVasrVa8jTa8rWbI2VbMvWbcvWdJObdcvUdszUd8vVeJaee87Yfc3WgJyjhqGnitDYjaarldPZnrK2oNbborW5o9bbo9fbpLa6q9ndrL3ArtndscDDutzfu8fJwN7gwt7gxc/QyuHhy+HizeHi0NfX0+Pj19zb1+Tj2uXk29/e3uLg3+Lh3+bl4uXj4ufl4+fl5Ofl5ufl5ujm5+jmySDnBAAAAFp0Uk5TAAECAgMEBAYHCA0NDg4UGRogIiMmKSssLzU7PkJJT1JTVFliY2hrdHZ3foSFhYeJjY2QkpugqbG1tre5w8zQ09XY3uXn6+zx8vT09vf4+Pj5+fr6/P39/f3+gz7SsAAAAVVJREFUOMtjYKA7EBDnwCPLrObS1BRiLoJLnte6CQy8FLHLCzs2QUG4FjZ5GbcmBDDjxJBXDWxCBrb8aM4zbkIDzpLYnAcE9VXlJSWlZRU13koIeW57mGx5XjoMZEUqwxWYQaQbSzLSkYGfKFSe0QMsX5WbjgY0YS4MBplemI4BdGBW+DQ11eZiymfqQuXZIjqwyadPNoSZ4L+0FVM6e+oGI6g8a9iKNT3o8kVzNkzRg5lgl7p4wyRUL9Yt2jAxVh6mQCogae6GmflI8p0r13VFWTHBQ0rWPW7ahgWVcPm+9cuLoyy4kCJDzCm6d8PSFoh0zvQNC5OjDJhQopPPJqph1doJBUD5tnkbZiUEqaCnB3bTqLTFG1bPn71kw4b+GFdpLElKIzRxxgYgWNYc5SCENVHKeUaltHdXx0dZ8uBI1hJ2UUDgq82CM2MwKeibqAvSO7MCABq0wXEPiqWEAAAAAElFTkSuQmCC"]=
	"http://openlayers.org/";else{var f=b.logo;ja(f)?e[f]="":ma(f)&&(e[f.src]=f.href)}f=b.layers instanceof M?b.layers:new M({layers:b.layers});d.layergroup=f;d.target=b.target;d.view=void 0!==b.view?b.view:new E;var f=Ei,g;void 0!==b.renderer?ha(b.renderer)?g=b.renderer:ja(b.renderer)&&(g=[b.renderer]):g=Zm;var h,l;h=0;for(l=g.length;h<l;++h)if("canvas"==g[h]&&ph){f=Xm;break}var m;void 0!==b.controls?m=ha(b.controls)?new F(b.controls.slice()):b.controls:m=Eg();var n;void 0!==b.interactions?n=ha(b.interactions)?
	new F(b.interactions.slice()):b.interactions:n=ck();b=void 0!==b.overlays?ha(b.overlays)?new F(b.overlays.slice()):b.overlays:new F;return{controls:m,interactions:n,keyboardEventTarget:c,logos:e,overlays:b,ki:f,values:d}}jk();function an(b){Tc.call(this);this.i=void 0!==b.insertFirst?b.insertFirst:!0;this.j=void 0!==b.stopEvent?b.stopEvent:!0;this.b=yf("DIV",{"class":"ol-overlay-container"});this.b.style.position="absolute";this.autoPan=void 0!==b.autoPan?b.autoPan:!1;this.f=void 0!==b.autoPanAnimation?b.autoPanAnimation:{};this.h=void 0!==b.autoPanMargin?b.autoPanMargin:20;this.a={Xb:"",rc:"",Kc:"",Pc:"",visible:!0};this.c=null;w(this,Vc("element"),this.dg,!1,this);w(this,Vc("map"),this.lg,!1,this);w(this,Vc("offset"),
	this.ng,!1,this);w(this,Vc("position"),this.pg,!1,this);w(this,Vc("positioning"),this.qg,!1,this);void 0!==b.element&&this.De(b.element);this.He(void 0!==b.offset?b.offset:[0,0]);this.Ie(void 0!==b.positioning?b.positioning:"top-left");void 0!==b.position&&this.qe(b.position)}v(an,Tc);k=an.prototype;k.ld=function(){return this.get("element")};k.uc=function(){return this.get("map")};k.ce=function(){return this.get("offset")};k.ee=function(){return this.get("position")};k.fe=function(){return this.get("positioning")};
	k.dg=function(){for(var b=this.b,c;c=b.firstChild;)b.removeChild(c);(b=this.ld())&&Bf(this.b,b)};k.lg=function(){this.c&&(Cf(this.b),Jc(this.c),this.c=null);var b=this.uc();b&&(this.c=w(b,"postrender",this.render,!1,this),bn(this),b=this.j?b.w:b.ga,this.i?b.insertBefore(this.b,b.childNodes[0]||null):Bf(b,this.b))};k.render=function(){bn(this)};k.ng=function(){bn(this)};
	k.pg=function(){bn(this);if(void 0!==this.get("position")&&this.autoPan){var b=this.uc();if(void 0!==b&&b.Fb()){var c=cn(b.Fb(),b.ib()),d=this.ld(),e=d.offsetWidth,f=d.currentStyle||window.getComputedStyle(d),e=e+(parseInt(f.marginLeft,10)+parseInt(f.marginRight,10)),f=d.offsetHeight,g=d.currentStyle||window.getComputedStyle(d),f=f+(parseInt(g.marginTop,10)+parseInt(g.marginBottom,10)),h=cn(d,[e,f]),d=this.h;ld(c,h)||(e=h[0]-c[0],f=c[2]-h[2],g=h[1]-c[1],h=c[3]-h[3],c=[0,0],0>e?c[0]=e-d:0>f&&(c[0]=
	Math.abs(f)+d),0>g?c[1]=g-d:0>h&&(c[1]=Math.abs(h)+d),0===c[0]&&0===c[1])||(d=b.R().na(),e=b.Eb(d),c=[e[0]+c[0],e[1]+c[1]],this.f&&(this.f.source=d,b.ha(bf(this.f))),b.R().sa(b.ya(c)))}}};k.qg=function(){bn(this)};k.De=function(b){this.B("element",b)};k.setMap=function(b){this.B("map",b)};k.He=function(b){this.B("offset",b)};k.qe=function(b){this.B("position",b)};
	function cn(b,c){var d=tf(b),e=new pf(0,0),f;f=d?tf(d):document;var g;(g=!Lb||9<=Zb)||(rf(f),g=!0);b!=(g?f.documentElement:f.body)&&(f=Qf(b),d=Ff(rf(d)),e.x=f.left+d.x,e.y=f.top+d.y);return[e.x,e.y,e.x+c[0],e.y+c[1]]}k.Ie=function(b){this.B("positioning",b)};function dn(b,c){b.a.visible!==c&&(Uf(b.b,c),b.a.visible=c)}
	function bn(b){var c=b.uc(),d=b.ee();if(void 0!==c&&c.b&&void 0!==d){var d=c.Eb(d),e=c.ib(),c=b.b.style,f=b.ce(),g=b.fe(),h=f[0],f=f[1];if("bottom-right"==g||"center-right"==g||"top-right"==g)""!==b.a.rc&&(b.a.rc=c.left=""),h=Math.round(e[0]-d[0]-h)+"px",b.a.Kc!=h&&(b.a.Kc=c.right=h);else{""!==b.a.Kc&&(b.a.Kc=c.right="");if("bottom-center"==g||"center-center"==g||"top-center"==g)h-=Sf(b.b).width/2;h=Math.round(d[0]+h)+"px";b.a.rc!=h&&(b.a.rc=c.left=h)}if("bottom-left"==g||"bottom-center"==g||"bottom-right"==
	g)""!==b.a.Pc&&(b.a.Pc=c.top=""),d=Math.round(e[1]-d[1]-f)+"px",b.a.Xb!=d&&(b.a.Xb=c.bottom=d);else{""!==b.a.Xb&&(b.a.Xb=c.bottom="");if("center-left"==g||"center-center"==g||"center-right"==g)f-=Sf(b.b).height/2;d=Math.round(d[1]+f)+"px";b.a.Pc!=d&&(b.a.Pc=c.top=d)}dn(b,!0)}else dn(b,!1)};function en(b){cc.call(this);this.b=b;this.a={}}v(en,cc);var fn=[];en.prototype.Ua=function(b,c,d,e){ha(c)||(c&&(fn[0]=c.toString()),c=fn);for(var f=0;f<c.length;f++){var g=w(b,c[f],d||this.handleEvent,e||!1,this.b||this);if(!g)break;this.a[g.key]=g}return this};
	en.prototype.Ad=function(b,c,d,e,f){if(ha(c))for(var g=0;g<c.length;g++)this.Ad(b,c[g],d,e,f);else d=d||this.handleEvent,f=f||this.b||this,d=Bc(d),e=!!e,c=pc(b)?wc(b.wa,String(c),d,e,f):b?(b=Dc(b))?wc(b,c,d,e,f):null:null,c&&(Jc(c),delete this.a[c.key]);return this};function gn(b){zb(b.a,function(b,d){this.a.hasOwnProperty(d)&&Jc(b)},b);b.a={}}en.prototype.K=function(){en.ca.K.call(this);gn(this)};en.prototype.handleEvent=function(){throw Error("EventHandler.handleEvent not implemented");};function hn(b,c,d){Oc.call(this);this.target=b;this.handle=c||b;this.a=d||new Lf(NaN,NaN,NaN,NaN);this.h=tf(b);this.b=new en(this);fc(this,this.b);this.f=this.c=this.j=this.i=this.screenY=this.screenX=this.clientY=this.clientX=0;this.g=!1;w(this.handle,["touchstart","mousedown"],this.Le,!1,this)}v(hn,Oc);var jn=Lb||Nb&&Xb("1.9.3");k=hn.prototype;
	k.K=function(){hn.ca.K.call(this);Ic(this.handle,["touchstart","mousedown"],this.Le,!1,this);gn(this.b);jn&&this.h.releaseCapture();this.handle=this.target=null};
	k.Le=function(b){var c="mousedown"==b.type;if(this.g||c&&!nc(b))y(this,"earlycancel");else if(y(this,new kn("start",this,b.clientX,b.clientY))){this.g=!0;b.preventDefault();var c=this.h,d=c.documentElement,e=!jn;this.b.Ua(c,["touchmove","mousemove"],this.mg,e);this.b.Ua(c,["touchend","mouseup"],this.hc,e);jn?(d.setCapture(!1),this.b.Ua(d,"losecapture",this.hc)):this.b.Ua(c?c.parentWindow||c.defaultView:window,"blur",this.hc);this.o&&this.b.Ua(this.o,"scroll",this.Ph,e);this.clientX=this.i=b.clientX;
	this.clientY=this.j=b.clientY;this.screenX=b.screenX;this.screenY=b.screenY;this.c=this.target.offsetLeft;this.f=this.target.offsetTop;this.l=Ff(rf(this.h))}};k.hc=function(b){gn(this.b);jn&&this.h.releaseCapture();this.g?(this.g=!1,y(this,new kn("end",this,b.clientX,b.clientY,0,ln(this,this.c),mn(this,this.f)))):y(this,"earlycancel")};
	k.mg=function(b){var c=1*(b.clientX-this.clientX),d=b.clientY-this.clientY;this.clientX=b.clientX;this.clientY=b.clientY;this.screenX=b.screenX;this.screenY=b.screenY;if(!this.g){var e=this.i-this.clientX,f=this.j-this.clientY;if(0<e*e+f*f)if(y(this,new kn("start",this,b.clientX,b.clientY)))this.g=!0;else{this.H||this.hc(b);return}}d=nn(this,c,d);c=d.x;d=d.y;this.g&&y(this,new kn("beforedrag",this,b.clientX,b.clientY,0,c,d))&&(on(this,b,c,d),b.preventDefault())};
	function nn(b,c,d){var e=Ff(rf(b.h));c+=e.x-b.l.x;d+=e.y-b.l.y;b.l=e;b.c+=c;b.f+=d;return new pf(ln(b,b.c),mn(b,b.f))}k.Ph=function(b){var c=nn(this,0,0);b.clientX=this.clientX;b.clientY=this.clientY;on(this,b,c.x,c.y)};function on(b,c,d,e){b.target.style.left=d+"px";b.target.style.top=e+"px";y(b,new kn("drag",b,c.clientX,c.clientY,0,d,e))}function ln(b,c){var d=b.a,e=isNaN(d.left)?null:d.left,d=isNaN(d.width)?0:d.width;return Math.min(null!=e?e+d:Infinity,Math.max(null!=e?e:-Infinity,c))}
	function mn(b,c){var d=b.a,e=isNaN(d.top)?null:d.top,d=isNaN(d.height)?0:d.height;return Math.min(null!=e?e+d:Infinity,Math.max(null!=e?e:-Infinity,c))}function kn(b,c,d,e,f,g,h){hc.call(this,b);this.clientX=d;this.clientY=e;this.left=ca(g)?g:c.c;this.top=ca(h)?h:c.f}v(kn,hc);function pn(b){b=b?b:{};this.c=void 0;this.f=qn;this.h=null;this.o=!1;this.j=b.duration?b.duration:200;var c=b.className?b.className:"ol-zoomslider",d=yf("DIV",[c+"-thumb","ol-unselectable"]),c=yf("DIV",[c,"ol-unselectable","ol-control"],d);this.b=new hn(d);fc(this,this.b);w(this.b,"start",this.cg,!1,this);w(this.b,"drag",this.ag,!1,this);w(this.b,"end",this.bg,!1,this);w(c,"click",this.$f,!1,this);w(d,"click",ic);ag.call(this,{element:c,render:b.render?b.render:rn})}v(pn,ag);var qn=0;k=pn.prototype;
	k.setMap=function(b){pn.ca.setMap.call(this,b);b&&b.render()};
	function rn(b){if(b.frameState){if(!this.o){var c=this.element,d=Sf(c),e=Df(c),c=Xf(e,"margin"),f=new qf(e.offsetWidth,e.offsetHeight),e=f.width+c.right+c.left,c=f.height+c.top+c.bottom;this.h=[e,c];e=d.width-e;c=d.height-c;d.width>d.height?(this.f=1,d=new Lf(0,0,e,0)):(this.f=qn,d=new Lf(0,0,0,c));this.b.a=d||new Lf(NaN,NaN,NaN,NaN);this.o=!0}b=b.frameState.viewState.resolution;b!==this.c&&(this.c=b,b=1-We(this.a.R())(b),d=this.b,c=Df(this.element),1==this.f?Of(c,d.a.left+d.a.width*b):Of(c,d.a.left,
	d.a.top+d.a.height*b))}}k.$f=function(b){var c=this.a,d=c.R(),e=d.Z();c.ha(df({resolution:e,duration:this.j,easing:Ze}));b=sn(this,tn(this,b.offsetX-this.h[0]/2,b.offsetY-this.h[1]/2));d.Ia(d.constrainResolution(b))};k.cg=function(){Ye(this.a.R(),1)};k.ag=function(b){this.c=sn(this,tn(this,b.left,b.top));this.a.R().Ia(this.c)};k.bg=function(){var b=this.a,c=b.R();Ye(c,-1);b.ha(df({resolution:this.c,duration:this.j,easing:Ze}));b=c.constrainResolution(this.c);c.Ia(b)};
	function tn(b,c,d){var e=b.b.a;return Na(1===b.f?(c-e.left)/e.width:(d-e.top)/e.height,0,1)}function sn(b,c){return Ve(b.a.R())(1-c)};function un(){this.defaultDataProjection=null}function vn(b,c,d){var e;d&&(e={dataProjection:d.dataProjection?d.dataProjection:b.vd(c),featureProjection:d.featureProjection});return wn(b,e)}function wn(b,c){var d;c&&(d={featureProjection:c.featureProjection,dataProjection:c.dataProjection?c.dataProjection:b.defaultDataProjection,rightHanded:c.rightHanded});return d}
	function xn(b,c,d){var e=d?Vd(d.featureProjection):null;d=d?Vd(d.dataProjection):null;return e&&d&&e!==d&&e.a!==d.a&&(e.b!=d.b||Ud(e,d)!==ae)?b instanceof ne?(c?b.clone():b).oa(c?e:d,c?d:e):me(c?b.slice():b,c?e:d,c?d:e):b};function yn(){this.defaultDataProjection=null}v(yn,un);function zn(b){return ma(b)?b:ja(b)?(b=Xl(b))?b:null:null}k=yn.prototype;k.P=function(){return"json"};k.td=function(b,c){return An(this,zn(b),vn(this,b,c))};k.Jc=function(b,c){var d;var e=zn(b);d=vn(this,b,c);if("Feature"==e.type)d=[An(this,e,d)];else if("FeatureCollection"==e.type){var f=[],e=e.features,g,h;g=0;for(h=e.length;g<h;++g)f.push(An(this,e[g],d));d=f}else d=[];return d};k.ud=function(b,c){var d=zn(b),e=vn(this,b,c);return Bn(d,e)};
	k.vd=function(b){return(b=zn(b).crs)?"name"==b.type?Vd(b.properties.name):"EPSG"==b.type?Vd("EPSG:"+b.properties.code):null:this.defaultDataProjection};k.Dd=function(b,c){return Yl(this.a(b,c))};k.Ed=function(b,c){return Yl(this.g(b,c))};k.Fd=function(b,c){return Yl(this.c(b,c))};function Cn(b){b=b?b:{};this.defaultDataProjection=null;this.defaultDataProjection=Vd(b.defaultDataProjection?b.defaultDataProjection:"EPSG:4326");this.b=b.geometryName}v(Cn,yn);function Bn(b,c){return b?xn((0,Dn[b.type])(b),!1,c):null}function En(b,c){return(0,Fn[b.P()])(xn(b,!0,c),c)}
	var Dn={Point:function(b){return new C(b.coordinates)},LineString:function(b){return new P(b.coordinates)},Polygon:function(b){return new D(b.coordinates)},MultiPoint:function(b){return new R(b.coordinates)},MultiLineString:function(b){return new Q(b.coordinates)},MultiPolygon:function(b){return new T(b.coordinates)},GeometryCollection:function(b,c){var d=b.geometries.map(function(b){return Bn(b,c)});return new O(d)}},Fn={Point:function(b){return{type:"Point",coordinates:b.ba()}},LineString:function(b){return{type:"LineString",
	coordinates:b.ba()}},Polygon:function(b,c){var d;c&&(d=c.rightHanded);return{type:"Polygon",coordinates:b.ba(d)}},MultiPoint:function(b){return{type:"MultiPoint",coordinates:b.ba()}},MultiLineString:function(b){return{type:"MultiLineString",coordinates:b.ba()}},MultiPolygon:function(b,c){var d;c&&(d=c.rightHanded);return{type:"MultiPolygon",coordinates:b.ba(d)}},GeometryCollection:function(b,c){return{type:"GeometryCollection",geometries:b.h.map(function(b){return En(b,c)})}},Circle:function(){return{type:"GeometryCollection",
	geometries:[]}}};function An(b,c,d){d=Bn(c.geometry,d);var e=new nl;b.b&&e.Lc(b.b);e.Ba(d);c.id&&e.Fe(c.id);c.properties&&e.I(c.properties);return e}Cn.prototype.a=function(b,c){c=wn(this,c);var d={type:"Feature"},e=b.$;e&&(d.id=e);e=b.J();d.geometry=e?En(e,c):null;e=b.O();delete e[b.a];d.properties=Eb(e)?null:e;return d};Cn.prototype.g=function(b,c){c=wn(this,c);var d=[],e,f;e=0;for(f=b.length;e<f;++e)d.push(this.a(b[e],c));return{type:"FeatureCollection",features:d}};
	Cn.prototype.c=function(b,c){return En(b,wn(this,c))};function Gn(){this.defaultDataProjection=null}v(Gn,un);k=Gn.prototype;k.P=function(){return"text"};k.td=function(b,c){var d;if(d=Hn(ja(b)?b:"",wn(this,c))){var e=new nl;e.Ba(d);d=e}else d=null;return d};k.Jc=function(b,c){var d=[],e=Hn(ja(b)?b:"",wn(this,c));this.a&&"GeometryCollection"==e.P()?d=e.h:d=[e];for(var f=[],g=0,h=d.length;g<h;++g)e=new nl,e.Ba(d[g]),f.push(e);return f};k.ud=function(b,c){return Hn(ja(b)?b:"",wn(this,c))};k.vd=function(){return this.defaultDataProjection};
	k.Dd=function(b,c){return In(b,wn(this,c))};k.Ed=function(b,c){var d;d=wn(this,c);if(1==b.length)d=In(b[0],d);else{for(var e=[],f=0,g=b.length;f<g;++f)e.push(b[f].J());e=new O(e);d=Jn(xn(e,!0,d))}return d};k.Fd=function(b,c){return Jn(xn(b,!0,wn(this,c)))};function Kn(b,c){this.c=this.i=this.g="";this.l=null;this.f=this.h="";this.a=!1;var d;b instanceof Kn?(this.a=ca(c)?c:b.a,Ln(this,b.g),this.i=b.i,this.c=b.c,Mn(this,b.l),this.h=b.h,Nn(this,b.b.clone()),this.f=b.f):b&&(d=String(b).match(jm))?(this.a=!!c,Ln(this,d[1]||"",!0),this.i=On(d[2]||""),this.c=On(d[3]||"",!0),Mn(this,d[4]),this.h=On(d[5]||"",!0),Nn(this,d[6]||"",!0),this.f=On(d[7]||"")):(this.a=!!c,this.b=new Pn(null,0,this.a))}
	Kn.prototype.toString=function(){var b=[],c=this.g;c&&b.push(Qn(c,Rn,!0),":");var d=this.c;if(d||"file"==c)b.push("//"),(c=this.i)&&b.push(Qn(c,Rn,!0),"@"),b.push(encodeURIComponent(String(d)).replace(/%25([0-9a-fA-F]{2})/g,"%$1")),d=this.l,null!=d&&b.push(":",String(d));if(d=this.h)this.c&&"/"!=d.charAt(0)&&b.push("/"),b.push(Qn(d,"/"==d.charAt(0)?Sn:Tn,!0));(d=this.b.toString())&&b.push("?",d);(d=this.f)&&b.push("#",Qn(d,Un));return b.join("")};Kn.prototype.clone=function(){return new Kn(this)};
	function Ln(b,c,d){b.g=d?On(c,!0):c;b.g&&(b.g=b.g.replace(/:$/,""))}function Mn(b,c){if(c){c=Number(c);if(isNaN(c)||0>c)throw Error("Bad port number "+c);b.l=c}else b.l=null}function Nn(b,c,d){c instanceof Pn?(b.b=c,Vn(b.b,b.a)):(d||(c=Qn(c,Wn)),b.b=new Pn(c,0,b.a))}function On(b,c){return b?c?decodeURI(b.replace(/%25/g,"%2525")):decodeURIComponent(b):""}function Qn(b,c,d){return ja(b)?(b=encodeURI(b).replace(c,Xn),d&&(b=b.replace(/%25([0-9a-fA-F]{2})/g,"%$1")),b):null}
	function Xn(b){b=b.charCodeAt(0);return"%"+(b>>4&15).toString(16)+(b&15).toString(16)}var Rn=/[#\/\?@]/g,Tn=/[\#\?:]/g,Sn=/[\#\?]/g,Wn=/[\#\?@]/g,Un=/#/g;function Pn(b,c,d){this.g=this.a=null;this.b=b||null;this.c=!!d}function Yn(b){b.a||(b.a=new Og,b.g=0,b.b&&km(b.b,function(c,d){b.add(decodeURIComponent(c.replace(/\+/g," ")),d)}))}k=Pn.prototype;k.Ab=function(){Yn(this);return this.g};
	k.add=function(b,c){Yn(this);this.b=null;b=Zn(this,b);var d=this.a.get(b);d||Pg(this.a,b,d=[]);d.push(c);this.g++;return this};k.remove=function(b){Yn(this);b=Zn(this,b);return Rg(this.a.b,b)?(this.b=null,this.g-=this.a.get(b).length,this.a.remove(b)):!1};k.clear=function(){this.a=this.b=null;this.g=0};k.Aa=function(){Yn(this);return 0==this.g};k.G=function(){Yn(this);for(var b=this.a.Qa(),c=this.a.G(),d=[],e=0;e<c.length;e++)for(var f=b[e],g=0;g<f.length;g++)d.push(c[e]);return d};
	k.Qa=function(b){Yn(this);var c=[];if(ja(b)){var d=b;Yn(this);d=Zn(this,d);Rg(this.a.b,d)&&(c=$a(c,this.a.get(Zn(this,b))))}else for(b=this.a.Qa(),d=0;d<b.length;d++)c=$a(c,b[d]);return c};k.get=function(b,c){var d=b?this.Qa(b):[];return 0<d.length?String(d[0]):c};function $n(b,c,d){b.remove(c);0<d.length&&(b.b=null,Pg(b.a,Zn(b,c),ab(d)),b.g+=d.length)}
	k.toString=function(){if(this.b)return this.b;if(!this.a)return"";for(var b=[],c=this.a.G(),d=0;d<c.length;d++)for(var e=c[d],f=encodeURIComponent(String(e)),e=this.Qa(e),g=0;g<e.length;g++){var h=f;""!==e[g]&&(h+="="+encodeURIComponent(String(e[g])));b.push(h)}return this.b=b.join("&")};k.clone=function(){var b=new Pn;b.b=this.b;this.a&&(b.a=this.a.clone(),b.g=this.g);return b};function Zn(b,c){var d=String(c);b.c&&(d=d.toLowerCase());return d}
	function Vn(b,c){c&&!b.c&&(Yn(b),b.b=null,b.a.forEach(function(b,c){var f=c.toLowerCase();c!=f&&(this.remove(c),$n(this,f,b))},b));b.c=c};function ao(b){b=b||{};this.a=b.font;this.g=b.rotation;this.c=b.scale;this.h=b.text;this.l=b.textAlign;this.i=b.textBaseline;this.b=void 0!==b.fill?b.fill:new Fj({color:"#333"});this.f=void 0!==b.stroke?b.stroke:null;this.j=void 0!==b.offsetX?b.offsetX:0;this.o=void 0!==b.offsetY?b.offsetY:0}k=ao.prototype;k.zf=function(){return this.a};k.Lf=function(){return this.j};k.Mf=function(){return this.o};k.Ih=function(){return this.b};k.Jh=function(){return this.g};k.Kh=function(){return this.c};k.Lh=function(){return this.f};
	k.Mh=function(){return this.h};k.Sf=function(){return this.l};k.Tf=function(){return this.i};k.oi=function(b){this.a=b};k.ni=function(b){this.b=b};k.Nh=function(b){this.g=b};k.Oh=function(b){this.c=b};k.xi=function(b){this.f=b};k.yi=function(b){this.h=b};k.zi=function(b){this.l=b};k.Ai=function(b){this.i=b};function bo(b){b=b?b:{};this.defaultDataProjection=null;this.a=void 0!==b.splitCollection?b.splitCollection:!1}v(bo,Gn);function co(b){b=b.ba();return 0===b.length?"":b[0]+" "+b[1]}function eo(b){b=b.ba();for(var c=[],d=0,e=b.length;d<e;++d)c.push(b[d][0]+" "+b[d][1]);return c.join(",")}function fo(b){var c=[];b=b.be();for(var d=0,e=b.length;d<e;++d)c.push("("+eo(b[d])+")");return c.join(",")}function Jn(b){var c=b.P();b=(0,go[c])(b);c=c.toUpperCase();return 0===b.length?c+" EMPTY":c+"("+b+")"}
	var go={Point:co,LineString:eo,Polygon:fo,MultiPoint:function(b){var c=[];b=b.re();for(var d=0,e=b.length;d<e;++d)c.push("("+co(b[d])+")");return c.join(",")},MultiLineString:function(b){var c=[];b=b.$d();for(var d=0,e=b.length;d<e;++d)c.push("("+eo(b[d])+")");return c.join(",")},MultiPolygon:function(b){var c=[];b=b.de();for(var d=0,e=b.length;d<e;++d)c.push("("+fo(b[d])+")");return c.join(",")},GeometryCollection:function(b){var c=[];b=b.Yd();for(var d=0,e=b.length;d<e;++d)c.push(Jn(b[d]));return c.join(",")}};
	function Hn(b,c){var d;d=new ho(new io(b));d.a=jo(d.b);return(d=ko(d))?xn(d,!1,c):null}function In(b,c){var d=b.J();return d?Jn(xn(d,!0,c)):""}function io(b){this.b=b;this.a=-1}function lo(b,c){return"0"<=b&&"9">=b||"."==b&&!(void 0!==c&&c)}
	function jo(b){var c=b.b.charAt(++b.a),d={position:b.a,value:c};if("("==c)d.type=2;else if(","==c)d.type=5;else if(")"==c)d.type=3;else if(lo(c)||"-"==c){d.type=4;var e,c=b.a,f=!1,g=!1;do{if("."==e)f=!0;else if("e"==e||"E"==e)g=!0;e=b.b.charAt(++b.a)}while(lo(e,f)||!g&&("e"==e||"E"==e)||g&&("-"==e||"+"==e));b=parseFloat(b.b.substring(c,b.a--));d.value=b}else if("a"<=c&&"z">=c||"A"<=c&&"Z">=c){d.type=1;c=b.a;do e=b.b.charAt(++b.a);while("a"<=e&&"z">=e||"A"<=e&&"Z">=e);b=b.b.substring(c,b.a--).toUpperCase();
	d.value=b}else{if(" "==c||"\t"==c||"\r"==c||"\n"==c)return jo(b);if(""===c)d.type=6;else throw Error("Unexpected character: "+c);}return d}function ho(b){this.b=b}k=ho.prototype;k.match=function(b){if(b=this.a.type==b)this.a=jo(this.b);return b};
	function ko(b){var c=b.a;if(b.match(1)){var d=c.value;if("GEOMETRYCOLLECTION"==d){a:{if(b.match(2)){c=[];do c.push(ko(b));while(b.match(5));if(b.match(3)){b=c;break a}}else if(mo(b)){b=[];break a}throw Error(no(b));}return new O(b)}var e=oo[d],c=po[d];if(!e||!c)throw Error("Invalid geometry type: "+d);b=e.call(b);return new c(b)}throw Error(no(b));}k.rd=function(){if(this.match(2)){var b=qo(this);if(this.match(3))return b}else if(mo(this))return null;throw Error(no(this));};
	k.qd=function(){if(this.match(2)){var b=ro(this);if(this.match(3))return b}else if(mo(this))return[];throw Error(no(this));};k.sd=function(){if(this.match(2)){var b=so(this);if(this.match(3))return b}else if(mo(this))return[];throw Error(no(this));};k.Sh=function(){if(this.match(2)){var b;if(2==this.a.type)for(b=[this.rd()];this.match(5);)b.push(this.rd());else b=ro(this);if(this.match(3))return b}else if(mo(this))return[];throw Error(no(this));};
	k.Rh=function(){if(this.match(2)){var b=so(this);if(this.match(3))return b}else if(mo(this))return[];throw Error(no(this));};k.Th=function(){if(this.match(2)){for(var b=[this.sd()];this.match(5);)b.push(this.sd());if(this.match(3))return b}else if(mo(this))return[];throw Error(no(this));};function qo(b){for(var c=[],d=0;2>d;++d){var e=b.a;if(b.match(4))c.push(e.value);else break}if(2==c.length)return c;throw Error(no(b));}function ro(b){for(var c=[qo(b)];b.match(5);)c.push(qo(b));return c}
	function so(b){for(var c=[b.qd()];b.match(5);)c.push(b.qd());return c}function mo(b){var c=1==b.a.type&&"EMPTY"==b.a.value;c&&(b.a=jo(b.b));return c}function no(b){return"Unexpected `"+b.a.value+"` at position "+b.a.position+" in `"+b.b.b+"`"}var po={POINT:C,LINESTRING:P,POLYGON:D,MULTIPOINT:R,MULTILINESTRING:Q,MULTIPOLYGON:T},oo={POINT:ho.prototype.rd,LINESTRING:ho.prototype.qd,POLYGON:ho.prototype.sd,MULTIPOINT:ho.prototype.Sh,MULTILINESTRING:ho.prototype.Rh,MULTIPOLYGON:ho.prototype.Th};function to(b,c,d,e,f,g,h){pi.call(this,b,c,d,0,e);this.h=f;this.a=new Image;g&&(this.a.crossOrigin=g);this.g={};this.b=null;this.state=0;this.f=h}v(to,pi);to.prototype.c=function(b){if(void 0!==b){var c=pa(b);if(c in this.g)return this.g[c];b=Eb(this.g)?this.a:this.a.cloneNode(!1);return this.g[c]=b}return this.a};to.prototype.j=function(){this.state=3;this.b.forEach(Jc);this.b=null;qi(this)};
	to.prototype.o=function(){void 0===this.resolution&&(this.resolution=Cd(this.extent)/this.a.height);this.state=2;this.b.forEach(Jc);this.b=null;qi(this)};to.prototype.load=function(){0==this.state&&(this.state=1,qi(this),this.b=[Hc(this.a,"error",this.j,!1,this),Hc(this.a,"load",this.o,!1,this)],this.f(this,this.h))};function uo(b,c,d,e,f){eg.call(this,b,c);this.c=d;this.b=new Image;e&&(this.b.crossOrigin=e);this.g=null;this.f=f}v(uo,eg);k=uo.prototype;k.K=function(){1==this.state&&vo(this);uo.ca.K.call(this)};k.getKey=function(){return this.c};k.Sg=function(){this.state=3;vo(this);y(this,"change")};k.Tg=function(){this.state=this.b.naturalWidth&&this.b.naturalHeight?2:4;vo(this);y(this,"change")};
	k.load=function(){0==this.state&&(this.state=1,y(this,"change"),this.g=[Hc(this.b,"error",this.Sg,!1,this),Hc(this.b,"load",this.Tg,!1,this)],this.f(this,this.c))};function vo(b){b.g.forEach(Jc);b.g=null};/*
	 Portions of this code are from MochiKit, received by
	 The Closure Authors under the MIT license. All other code is Copyright
	 2005-2009 The Closure Authors. All Rights Reserved.
	*/
	function wo(b,c){this.f=[];this.L=b;this.H=c||null;this.c=this.a=!1;this.g=void 0;this.j=this.u=this.l=!1;this.h=0;this.b=null;this.i=0}wo.prototype.cancel=function(b){if(this.a)this.g instanceof wo&&this.g.cancel();else{if(this.b){var c=this.b;delete this.b;b?c.cancel(b):(c.i--,0>=c.i&&c.cancel())}this.L?this.L.call(this.H,this):this.j=!0;this.a||(b=new xo,yo(this),zo(this,!1,b))}};wo.prototype.o=function(b,c){this.l=!1;zo(this,b,c)};function zo(b,c,d){b.a=!0;b.g=d;b.c=!c;Ao(b)}
	function yo(b){if(b.a){if(!b.j)throw new Bo;b.j=!1}}wo.prototype.Zb=function(b){yo(this);zo(this,!0,b)};function Co(b,c,d,e){b.f.push([c,d,e]);b.a&&Ao(b)}wo.prototype.then=function(b,c,d){var e,f,g=new Dl(function(b,c){e=b;f=c});Co(this,e,function(b){b instanceof xo?g.cancel():f(b)});return g.then(b,c,d)};ql(wo);function Do(b){return Wa(b.f,function(b){return la(b[1])})}
	function Ao(b){if(b.h&&b.a&&Do(b)){var c=b.h,d=Eo[c];d&&(ba.clearTimeout(d.$),delete Eo[c]);b.h=0}b.b&&(b.b.i--,delete b.b);for(var c=b.g,e=d=!1;b.f.length&&!b.l;){var f=b.f.shift(),g=f[0],h=f[1],f=f[2];if(g=b.c?h:g)try{var l=g.call(f||b.H,c);ca(l)&&(b.c=b.c&&(l==c||l instanceof Error),b.g=c=l);if(rl(c)||"function"===typeof ba.Promise&&c instanceof ba.Promise)e=!0,b.l=!0}catch(m){c=m,b.c=!0,Do(b)||(d=!0)}}b.g=c;e&&(l=ua(b.o,b,!0),e=ua(b.o,b,!1),c instanceof wo?(Co(c,l,e),c.u=!0):c.then(l,e));d&&(c=
	new Fo(c),Eo[c.$]=c,b.h=c.$)}function Bo(){za.call(this)}v(Bo,za);Bo.prototype.message="Deferred has already fired";Bo.prototype.name="AlreadyCalledError";function xo(){za.call(this)}v(xo,za);xo.prototype.message="Deferred was canceled";xo.prototype.name="CanceledError";function Fo(b){this.$=ba.setTimeout(ua(this.b,this),0);this.a=b}Fo.prototype.b=function(){delete Eo[this.$];throw this.a;};var Eo={};function Go(b,c){hc.call(this,b);this.feature=c}v(Go,hc);
	function Ho(b){ej.call(this,{handleDownEvent:Io,handleEvent:Jo,handleUpEvent:Ko});this.fa=null;this.A=!1;this.Pa=b.source?b.source:null;this.la=b.features?b.features:null;this.Re=b.snapTolerance?b.snapTolerance:12;this.N=b.type;this.b=Lo(this.N);this.Na=b.minPoints?b.minPoints:this.b===Mo?3:2;this.Ja=b.maxPoints?b.maxPoints:Infinity;var c=b.geometryFunction;if(!c)if("Circle"===this.N)c=function(b,c){var d=c?c:new N([NaN,NaN]),h=b[0],l=b[1],m=h[0]-l[0],h=h[1]-l[1];d.yd(b[0],Math.sqrt(m*m+h*h));return d};
	else{var d,c=this.b;c===No?d=C:c===Oo?d=P:c===Mo&&(d=D);c=function(b,c){var g=c;g?g.aa(b):g=new d(b);return g}}this.j=c;this.w=this.i=this.a=this.o=this.f=this.h=null;this.Se=b.clickTolerance?b.clickTolerance*b.clickTolerance:36;this.ga=new J({source:new W({useSpatialIndex:!1,wrapX:b.wrapX?b.wrapX:!1}),style:b.style?b.style:Po()});this.Oa=b.geometryName;this.Qe=b.condition?b.condition:aj;this.va=b.freehandCondition?b.freehandCondition:bj;w(this,Vc("active"),this.Ne,!1,this)}v(Ho,ej);
	function Po(){var b=Mj();return function(c){return b[c.J().P()]}}k=Ho.prototype;k.setMap=function(b){Ho.ca.setMap.call(this,b);this.Ne()};function Jo(b){var c=!this.A;this.A&&b.type===ii?(Qo(this,b),c=!1):b.type===hi?c=Ro(this,b):b.type===bi&&(c=!1);return fj.call(this,b)&&c}function Io(b){if(this.Qe(b))return this.fa=b.pixel,!0;if(this.b!==Oo&&this.b!==Mo||!this.va(b))return!1;this.fa=b.pixel;this.A=!0;this.h||So(this,b);return!0}
	function Ko(b){this.A=!1;var c=this.fa,d=b.pixel,e=c[0]-d[0],c=c[1]-d[1],d=!0;e*e+c*c<=this.Se&&(Ro(this,b),this.h?this.b===To?this.zb():Uo(this,b)?this.zb():Qo(this,b):(So(this,b),this.b===No&&this.zb()),d=!1);return d}
	function Ro(b,c){if(b.h){var d=c.coordinate,e=b.f.J(),f;b.b===No?f=b.a:b.b===Mo?(f=b.a[0],f=f[f.length-1],Uo(b,c)&&(d=b.h.slice())):(f=b.a,f=f[f.length-1]);f[0]=d[0];f[1]=d[1];b.j(b.a,e);b.o&&b.o.J().aa(d);e instanceof D&&b.b!==Mo?(b.i||(b.i=new nl(new P(null))),e=e.ae(0),d=b.i.J(),dl(d,e.c,e.a)):b.w&&(d=b.i.J(),d.aa(b.w));Vo(b)}else d=c.coordinate.slice(),b.o?b.o.J().aa(d):(b.o=new nl(new C(d)),Vo(b));return!0}
	function Uo(b,c){var d=!1;if(b.f){var e=!1,f=[b.h];b.b===Oo?e=b.a.length>b.Na:b.b===Mo&&(e=b.a[0].length>b.Na,f=[b.a[0][0],b.a[0][b.a[0].length-2]]);if(e)for(var e=c.map,g=0,h=f.length;g<h;g++){var l=f[g],m=e.Eb(l),n=c.pixel,d=n[0]-m[0],m=n[1]-m[1],n=b.A&&b.va(c)?1:b.Re;if(d=Math.sqrt(d*d+m*m)<=n){b.h=l;break}}}return d}
	function So(b,c){var d=c.coordinate;b.h=d;b.b===No?b.a=d.slice():b.b===Mo?(b.a=[[d.slice(),d.slice()]],b.w=b.a[0]):(b.a=[d.slice(),d.slice()],b.b===To&&(b.w=b.a));b.w&&(b.i=new nl(new P(b.w)));d=b.j(b.a);b.f=new nl;b.Oa&&b.f.Lc(b.Oa);b.f.Ba(d);Vo(b);y(b,new Go("drawstart",b.f))}
	function Qo(b,c){var d=c.coordinate,e=b.f.J(),f,g;if(b.b===Oo)b.h=d.slice(),g=b.a,g.push(d.slice()),f=g.length>b.Ja,b.j(g,e);else if(b.b===Mo){g=b.a[0];g.push(d.slice());if(f=g.length>b.Ja)b.h=g[0];b.j(b.a,e)}Vo(b);f&&b.zb()}k.fi=function(){var b=this.f.J(),c,d;this.b===Oo?(c=this.a,c.splice(-2,1),this.j(c,b)):this.b===Mo&&(c=this.a[0],c.splice(-2,1),d=this.i.J(),d.aa(c),this.j(this.a,b));0===c.length&&(this.h=null);Vo(this)};
	k.zb=function(){var b=Wo(this),c=this.a,d=b.J();this.b===Oo?(c.pop(),this.j(c,d)):this.b===Mo&&(c[0].pop(),c[0].push(c[0][0]),this.j(c,d));"MultiPoint"===this.N?b.Ba(new R([c])):"MultiLineString"===this.N?b.Ba(new Q([c])):"MultiPolygon"===this.N&&b.Ba(new T([c]));y(this,new Go("drawend",b));this.la&&this.la.push(b);this.Pa&&this.Pa.Vb(b)};function Wo(b){b.h=null;var c=b.f;c&&(b.f=null,b.o=null,b.i=null,b.ga.da().clear(!0));return c}
	k.hh=function(b){var c=b.J();this.f=b;this.a=c.ba();b=this.a[this.a.length-1];this.h=b.slice();this.a.push(b.slice());Vo(this);y(this,new Go("drawstart",this.f))};k.mb=Jd;function Vo(b){var c=[];b.f&&c.push(b.f);b.i&&c.push(b.i);b.o&&c.push(b.o);b=b.ga.da();b.clear(!0);b.Wb(c)}k.Ne=function(){var b=this.C,c=this.D();b&&c||Wo(this);this.ga.setMap(c?b:null)};
	function Lo(b){var c;"Point"===b||"MultiPoint"===b?c=No:"LineString"===b||"MultiLineString"===b?c=Oo:"Polygon"===b||"MultiPolygon"===b?c=Mo:"Circle"===b&&(c=To);return c}var No="Point",Oo="LineString",Mo="Polygon",To="Circle";function Xo(b,c,d,e){hc.call(this,b);this.selected=c;this.deselected=d;this.mapBrowserEvent=e}v(Xo,hc);
	function Yo(b){Si.call(this,{handleEvent:Zo});b=b?b:{};this.j=b.condition?b.condition:$i;this.h=b.addCondition?b.addCondition:Jd;this.o=b.removeCondition?b.removeCondition:Jd;this.u=b.toggleCondition?b.toggleCondition:bj;this.i=b.multi?b.multi:!1;this.c=b.filter?b.filter:Kd;var c;if(b.layers)if(la(b.layers))c=b.layers;else{var d=b.layers;c=function(b){return 0<=d.indexOf(b)}}else c=Kd;this.f=c;this.a={};this.b=new J({source:new W({useSpatialIndex:!1,features:b.features,wrapX:b.wrapX}),style:b.style?
	b.style:$o(),updateWhileAnimating:!0,updateWhileInteracting:!0});b=this.b.da().b;w(b,"add",this.df,!1,this);w(b,"remove",this.di,!1,this)}v(Yo,Si);k=Yo.prototype;k.ih=function(){return this.b.da().b};k.jh=function(b){b=pa(b);return this.a[b]};
	function Zo(b){if(!this.j(b))return!0;var c=this.h(b),d=this.o(b),e=this.u(b),f=!c&&!d&&!e,g=b.map,h=this.b.da().b,l=[],m=[],n=!1;if(f)g.Zc(b.pixel,function(b,c){if(this.c(b,c)){m.push(b);var d=pa(b);this.a[d]=c;return!this.i}},this,this.f),0<m.length&&1==h.hb()&&h.item(0)==m[0]||(n=!0,0!==h.hb()&&(l=Array.prototype.concat(h.a),h.clear()),h.kd(m),0===m.length?Fb(this.a):0<l.length&&l.forEach(function(b){b=pa(b);delete this.a[b]},this));else{g.Zc(b.pixel,function(b,f){if(!(0<=h.a.indexOf(b))){if((c||
	e)&&this.c(b,f)){m.push(b);var g=pa(b);this.a[g]=f}}else if(d||e)l.push(b),g=pa(b),delete this.a[g]},this,this.f);for(f=l.length-1;0<=f;--f)h.remove(l[f]);h.kd(m);if(0<m.length||0<l.length)n=!0}n&&y(this,new Xo("select",m,l,b));return Zi(b)}k.setMap=function(b){var c=this.C,d=this.b.da().b;null===c||d.forEach(c.Me,c);Yo.ca.setMap.call(this,b);this.b.setMap(b);null===b||d.forEach(b.Ke,b)};
	function $o(){var b=Mj();bb(b.Polygon,b.LineString);bb(b.GeometryCollection,b.LineString);return function(c){return b[c.J().P()]}}k.df=function(b){b=b.element;var c=this.C;null===c||c.Ke(b)};k.di=function(b){b=b.element;var c=this.C;null===c||c.Me(b)};function ap(b,c){var d=c||{},e=d.document||document,f=document.createElement("SCRIPT"),g={Ce:f,Ya:void 0},h=new wo(bp,g),l=null,m=null!=d.timeout?d.timeout:5E3;0<m&&(l=window.setTimeout(function(){cp(f,!0);var c=new dp(ep,"Timeout reached for loading script "+b);yo(h);zo(h,!1,c)},m),g.Ya=l);f.onload=f.onreadystatechange=function(){f.readyState&&"loaded"!=f.readyState&&"complete"!=f.readyState||(cp(f,d.qf||!1,l),h.Zb(null))};f.onerror=function(){cp(f,!0,l);var c=new dp(fp,"Error while loading script "+
	b);yo(h);zo(h,!1,c)};g=d.attributes||{};Jb(g,{type:"text/javascript",charset:"UTF-8",src:b});vf(f,g);gp(e).appendChild(f);return h}function gp(b){var c=b.getElementsByTagName("HEAD");return c&&0!=c.length?c[0]:b.documentElement}function bp(){if(this&&this.Ce){var b=this.Ce;b&&"SCRIPT"==b.tagName&&cp(b,!0,this.Ya)}}function cp(b,c,d){null!=d&&ba.clearTimeout(d);b.onload=ea;b.onerror=ea;b.onreadystatechange=ea;c&&window.setTimeout(function(){Cf(b)},0)}var fp=0,ep=1;
	function dp(b,c){var d="Jsloader error (code #"+b+")";c&&(d+=": "+c);za.call(this,d);this.code=b}v(dp,za);function hp(b,c){this.b=new Kn(b);this.a=c?c:"callback";this.Ya=5E3}var ip=0;hp.prototype.cancel=function(b){b&&(b.rf&&b.rf.cancel(),b.$&&jp(b.$,!1))};function kp(b,c){return function(){jp(b,!1);c&&c(null)}}function lp(b,c){return function(d){jp(b,!0);c.apply(void 0,arguments)}}function jp(b,c){ba._callbacks_[b]&&(c?delete ba._callbacks_[b]:ba._callbacks_[b]=ea)};function mp(b,c){var d=/\{z\}/g,e=/\{x\}/g,f=/\{y\}/g,g=/\{-y\}/g;return function(h){if(h)return b.replace(d,h[0].toString()).replace(e,h[1].toString()).replace(f,function(){return(-h[2]-1).toString()}).replace(g,function(){var b=c.a?c.a[h[0]]:null;return(b.g-b.c+1+h[2]).toString()})}}function np(b,c){for(var d=b.length,e=Array(d),f=0;f<d;++f)e[f]=mp(b[f],c);return op(e)}function op(b){return 1===b.length?b[0]:function(c,d,e){if(c)return b[nb((c[1]<<c[0])+c[2],b.length)](c,d,e)}}function pp(){}
	function qp(b){var c=[],d=/\{(\d)-(\d)\}/.exec(b)||/\{([a-z])-([a-z])\}/.exec(b);if(d){var e=d[2].charCodeAt(0),f;for(f=d[1].charCodeAt(0);f<=e;++f)c.push(b.replace(d[0],String.fromCharCode(f)))}else c.push(b);return c};function rp(b){vg.call(this,{attributions:b.attributions,extent:b.extent,logo:b.logo,opaque:b.opaque,projection:b.projection,state:void 0!==b.state?b.state:void 0,tileGrid:b.tileGrid,tilePixelRatio:b.tilePixelRatio,wrapX:b.wrapX});this.tileUrlFunction=void 0!==b.tileUrlFunction?b.tileUrlFunction:pp;this.crossOrigin=void 0!==b.crossOrigin?b.crossOrigin:null;this.tileLoadFunction=void 0!==b.tileLoadFunction?b.tileLoadFunction:sp;this.tileClass=void 0!==b.tileClass?b.tileClass:uo}v(rp,vg);
	function sp(b,c){b.b.src=c}
	function Wm(b,c,d,e,f,g){var h=b.b(c,d,e);if(b.a.g.hasOwnProperty(h))return b.a.get(h);e=c=[c,d,e];var l=void 0!==g?g:b.u;d=b.tileGrid?b.tileGrid:rg(l);if(b.C&&l.c){var m=e,n=m[0];e=ng(d,m);l=sg(l);jd(l,e)?e=m:(m=Fd(l),e[0]+=m*Math.ceil((l[0]-e[0])/m),n=d.Z(n),e=lg(d,e[0],e[1],n,!1,void 0))}m=e[0];n=e[1];l=e[2];if(d.minZoom>m||m>d.maxZoom)d=!1;else{var p=d.v();d=(d=p?mg(d,p,m):d.a?d.a[m]:null)?hf(d,n,l):!0}f=(d=d?e:null)?b.tileUrlFunction(d,f,g):void 0;f=new b.tileClass(c,void 0!==f?0:4,void 0!==
	f?f:"",b.crossOrigin,b.tileLoadFunction);w(f,"change",b.nh,!1,b);b=b.a;g={gd:h,ra:null,Ma:b.a,nb:f};b.a?b.a.ra=g:b.b=g;b.a=g;b.g[h]=g;++b.c;return f}k=rp.prototype;k.ge=function(){return this.tileLoadFunction};k.he=function(){return this.tileUrlFunction};k.nh=function(b){b=b.target;switch(b.state){case 1:y(this,new yg("tileloadstart",b));break;case 2:y(this,new yg("tileloadend",b));break;case 3:y(this,new yg("tileloaderror",b))}};k.Je=function(b){this.a.clear();this.tileLoadFunction=b;this.s()};
	k.Qb=function(b){this.a.clear();this.tileUrlFunction=b;this.s()};k.Oe=function(b,c,d){b=this.b(b,c,d);this.a.g.hasOwnProperty(b)&&this.a.get(b)};function tp(b){var c=void 0!==b.attributions?b.attributions:null,d=b.imageExtent,e,f;void 0!==b.imageSize&&(e=Cd(d)/b.imageSize[1],f=[e]);var g=void 0!==b.crossOrigin?b.crossOrigin:null,h=void 0!==b.imageLoadFunction?b.imageLoadFunction:ml;hl.call(this,{attributions:c,logo:b.logo,projection:Vd(b.projection),resolutions:f});this.a=new to(d,e,1,c,b.url,g,h);w(this.a,"change",this.F,!1,this)}v(tp,hl);tp.prototype.b=function(b){return Ed(b,this.a.v())?this.a:null};function Z(b){var c=void 0!==b.projection?b.projection:"EPSG:3857",d=void 0!==b.tileGrid?b.tileGrid:ug({extent:sg(c),maxZoom:b.maxZoom,tileSize:b.tileSize});this.f=null;rp.call(this,{attributions:b.attributions,crossOrigin:b.crossOrigin,logo:b.logo,projection:c,tileGrid:d,tileLoadFunction:b.tileLoadFunction,tilePixelRatio:b.tilePixelRatio,tileUrlFunction:pp,wrapX:void 0!==b.wrapX?b.wrapX:!0});void 0!==b.tileUrlFunction?this.Qb(b.tileUrlFunction):void 0!==b.urls?(b=b.urls,this.Qb(np(b,this.tileGrid)),
	this.f=b):void 0!==b.url&&this.c(b.url)}v(Z,rp);Z.prototype.i=function(){return this.f};Z.prototype.c=function(b){this.Qb(np(qp(b),this.tileGrid));this.f=[b]};(function(){var b={},c={xa:b};(function(d){if("object"===typeof b&&"undefined"!==typeof c)c.xa=d();else{var e;"undefined"!==typeof window?e=window:"undefined"!==typeof global?e=global:"undefined"!==typeof self?e=self:e=this;e.Zi=d()}})(function(){return function e(b,c,h){function l(n,q){if(!c[n]){if(!b[n]){var r="function"==typeof require&&require;if(!q&&r)return require(n,!0);if(m)return m(n,!0);r=Error("Cannot find module '"+n+"'");throw r.code="MODULE_NOT_FOUND",r;}r=c[n]={xa:{}};b[n][0].call(r.xa,function(c){var e=
	b[n][1][c];return l(e?e:c)},r,r.xa,e,b,c,h)}return c[n].xa}for(var m="function"==typeof require&&require,n=0;n<h.length;n++)l(h[n]);return l}({1:[function(b,c,g){b=b("./processor");g.Pe=b},{"./processor":2}],2:[function(b,c){function g(b){return function(c){var e=c.buffers,f=c.meta,g=c.width,h=c.height,l=e.length,m=e[0].byteLength,x;if(c.imageOps){m=Array(l);for(x=0;x<l;++x)m[x]=new ImageData(new Uint8ClampedArray(e[x]),g,h);g=b(m,f).data}else{g=new Uint8ClampedArray(m);h=Array(l);c=Array(l);for(x=
	0;x<l;++x)h[x]=new Uint8ClampedArray(e[x]),c[x]=[0,0,0,0];for(e=0;e<m;e+=4){for(x=0;x<l;++x){var L=h[x];c[x][0]=L[e];c[x][1]=L[e+1];c[x][2]=L[e+2];c[x][3]=L[e+3]}x=b(c,f);g[e]=x[0];g[e+1]=x[1];g[e+2]=x[2];g[e+3]=x[3]}}return g.buffer}}function h(b,c){var e=Object.keys(b.lib||{}).map(function(c){return"var "+c+" = "+b.lib[c].toString()+";"}).concat(["var __minion__ = ("+g.toString()+")(",b.operation.toString(),");",'self.addEventListener("message", function(__event__) {',"var buffer = __minion__(__event__.data);",
	"self.postMessage({buffer: buffer, meta: __event__.data.meta}, [buffer]);","});"]),e=URL.createObjectURL(new Blob(e,{type:"text/javascript"})),e=new Worker(e);e.addEventListener("message",c);return e}function l(b,c){var e=g(b.operation);return{postMessage:function(b){setTimeout(function(){c({data:{buffer:e(b),tc:b.tc}})},0)}}}function m(b){this.Qc=!!b.yg;var c;0===b.threads?c=0:this.Qc?c=1:c=b.threads||1;var e=[];if(c)for(var f=0;f<c;++f)e[f]=h(b,this.Md.bind(this,f));else e[0]=l(b,this.Md.bind(this,
	0));this.Ub=e;this.pb=[];this.$e=b.ai||Infinity;this.Tb=0;this.bb={};this.Rc=null}m.prototype.$h=function(b,c,e){this.Ye({Sa:b,tc:c,Zb:e});this.Jd()};m.prototype.Ye=function(b){for(this.pb.push(b);this.pb.length>this.$e;)this.pb.shift().Zb(null,null)};m.prototype.Jd=function(){if(0===this.Tb&&0<this.pb.length){var b=this.Rc=this.pb.shift(),c=b.Sa[0].width,e=b.Sa[0].height,f=b.Sa.map(function(b){return b.data.buffer}),g=this.Ub.length;this.Tb=g;if(1===g)this.Ub[0].postMessage({buffers:f,meta:b.tc,
	imageOps:this.Qc,width:c,height:e},f);else for(var h=4*Math.ceil(b.Sa[0].data.length/4/g),l=0;l<g;++l){for(var m=l*h,x=[],L=0,V=f.length;L<V;++L)x.push(f[l].slice(m,m+h));this.Ub[l].postMessage({buffers:x,meta:b.tc,imageOps:this.Qc,width:c,height:e},x)}}};m.prototype.Md=function(b,c){this.Xi||(this.bb[b]=c.data,--this.Tb,0===this.Tb&&this.af())};m.prototype.af=function(){var b=this.Rc,c=this.Ub.length,e,f;if(1===c)e=new Uint8ClampedArray(this.bb[0].buffer),f=this.bb[0].meta;else{var g=b.Sa[0].data.length;
	e=new Uint8ClampedArray(g);f=Array(g);for(var g=4*Math.ceil(g/4/c),h=0;h<c;++h){var l=h*g;e.set(new Uint8ClampedArray(this.bb[h].buffer),l);f[h]=this.bb[h].meta}}this.Rc=null;this.bb={};b.Zb(null,new ImageData(e,b.Sa[0].width,b.Sa[0].height),f);this.Jd()};c.xa=m},{}]},{},[1])(1)});Hm=c.xa})();function up(b){this.w=null;this.ga=void 0!==b.operationType?b.operationType:"pixel";this.la=void 0!==b.threads?b.threads:1;this.a=vp(b.sources);for(var c=0,d=this.a.length;c<d;++c)w(this.a[c],"change",this.s,!1,this);this.c=mh();this.Y=new Oi(function(){return 1},ua(this.s,this));for(var c=wp(this.a),d={},e=0,f=c.length;e<f;++e)d[pa(c[e].layer)]=c[e];this.f=this.h=null;this.N={animate:!1,attributions:{},coordinateToPixelMatrix:bd(),extent:null,focus:null,index:0,layerStates:d,layerStatesArray:c,logos:{},
	pixelRatio:1,pixelToCoordinateMatrix:bd(),postRenderFunctions:[],size:[0,0],skippedFeatureUids:{},tileQueue:this.Y,time:Date.now(),usedTiles:{},viewState:{rotation:0},viewHints:[],wantedTiles:{}};hl.call(this,{});void 0!==b.operation&&this.i(b.operation,b.lib)}v(up,hl);up.prototype.i=function(b,c){this.w=new Hm.Pe({operation:b,yg:"image"===this.ga,ai:1,lib:c,threads:this.la});this.s()};function xp(b,c,d){var e=b.h;return!e||b.g!==e.li||d!==e.resolution||!od(c,e.extent)}
	up.prototype.b=function(b,c,d,e){d=!0;for(var f,g=0,h=this.a.length;g<h;++g)if(f=this.a[g].a.da(),"ready"!==f.o){d=!1;break}if(!d)return null;if(!xp(this,b,c))return this.f;d=this.c.canvas;f=Math.round(Fd(b)/c);g=Math.round(Cd(b)/c);if(f!==d.width||g!==d.height)d.width=f,d.height=g;f=Gb(this.N);f.viewState=Gb(f.viewState);var g=Ad(b),h=Math.round(Fd(b)/c),l=Math.round(Cd(b)/c);f.extent=b;f.focus=Ad(b);f.size[0]=h;f.size[1]=l;h=f.viewState;h.center=g;h.projection=e;h.resolution=c;this.f=e=new gl(b,
	c,1,this.j,d,this.A.bind(this,f));this.h={extent:b,resolution:c,li:this.g};return e};
	up.prototype.A=function(b,c){for(var d=this.a.length,e=Array(d),f=0;f<d;++f){var g;var h=this.a[f],l=b;h.Cc(l,b.layerStatesArray[f]);if(g=h.Kb()){var h=h.bd(),m=Math.round(h[12]),n=Math.round(h[13]),p=l.size[0],l=l.size[1];if(g instanceof Image){if(yp){var q=yp.canvas;q.width!==p||q.height!==l?yp=mh(p,l):yp.clearRect(0,0,p,l)}else yp=mh(p,l);yp.drawImage(g,m,n,Math.round(g.width*h[0]),Math.round(g.height*h[5]));g=yp.getImageData(0,0,p,l)}else g=g.getContext("2d").getImageData(-m,-n,p,l)}else g=null;
	if(g)e[f]=g;else return}d={};y(this,new zp(Ap,b,d));this.w.$h(e,d,this.fa.bind(this,b,c));Pi(b.tileQueue,16,16)};up.prototype.fa=function(b,c,d,e,f){d?c(d):e&&(y(this,new zp(Bp,b,f)),xp(this,b.extent,b.viewState.resolution/b.pixelRatio)||this.c.putImageData(e,0,0),c(null))};var yp=null;function wp(b){return b.map(function(b){return li(b.a)})}
	function vp(b){for(var c=b.length,d=Array(c),e=0;e<c;++e){var f=e,g=b[e],h=null;g instanceof vg?(g=new H({source:g}),h=new Ji(g)):g instanceof hl&&(g=new G({source:g}),h=new Ii(g));d[f]=h}return d}function zp(b,c,d){hc.call(this,b);this.extent=c.extent;this.resolution=c.viewState.resolution/c.pixelRatio;this.data=d}v(zp,hc);var Ap="beforeoperations",Bp="afteroperations";function Cp(b){rp.call(this,{attributions:b.attributions,crossOrigin:b.crossOrigin,projection:Vd("EPSG:3857"),state:"loading",tileLoadFunction:b.tileLoadFunction,wrapX:void 0!==b.wrapX?b.wrapX:!0});var c=new hp(b.url),d=ua(this.f,this);b=ua(this.c,this);var e="_"+(ip++).toString(36)+wa().toString(36);ba._callbacks_||(ba._callbacks_={});var f=c.b.clone();if(d){ba._callbacks_[e]=lp(e,d);var d=c.a,g="_callbacks_."+e;ha(g)||(g=[String(g)]);$n(f.b,d,g)}c=ap(f.toString(),{timeout:c.Ya,qf:!0});Co(c,null,
	kp(e,b),void 0)}v(Cp,rp);Cp.prototype.f=function(b){var c=Vd("EPSG:4326"),d=this.u,e;void 0!==b.bounds&&(e=Hd(b.bounds,Ud(c,d)));var f=b.minzoom||0,g=b.maxzoom||22;this.tileGrid=d=ug({extent:sg(d),maxZoom:g,minZoom:f});this.tileUrlFunction=np(b.tiles,d);if(void 0!==b.attribution&&!this.j){c=void 0!==e?e:c.v();e={};for(var h;f<=g;++f)h=f.toString(),e[h]=[mg(d,c,f)];this.lb([new kf({html:b.attribution,tileRanges:e})])}this.o="ready";this.s()};Cp.prototype.c=function(){this.o="error";this.s()};function Dp(b){b=b||{};this.b=void 0!==b.initialSize?b.initialSize:256;this.g=void 0!==b.maxSize?b.maxSize:2048;this.a=void 0!==b.space?b.space:1;this.f=[new Ep(this.b,this.a)];this.c=this.b;this.h=[new Ep(this.c,this.a)]}Dp.prototype.add=function(b,c,d,e,f,g){if(c+this.a>this.g||d+this.a>this.g)return null;e=Fp(this,!1,b,c,d,e,g);if(!e)return null;b=Fp(this,!0,b,c,d,void 0!==f?f:Ld,g);return{offsetX:e.offsetX,offsetY:e.offsetY,image:e.image,me:b.image}};
	function Fp(b,c,d,e,f,g,h){var l=c?b.h:b.f,m,n,p;n=0;for(p=l.length;n<p;++n){m=l[n];if(m=m.add(d,e,f,g,h))return m;m||n!==p-1||(c?(m=Math.min(2*b.c,b.g),b.c=m):(m=Math.min(2*b.b,b.g),b.b=m),m=new Ep(m,b.a),l.push(m),++p)}}function Ep(b,c){this.a=c;this.b=[{x:0,y:0,width:b,height:b}];this.c={};this.g=document.createElement("CANVAS");this.g.width=b;this.g.height=b;this.f=this.g.getContext("2d")}Ep.prototype.get=function(b){var c=this.c;return b in c?c[b]:null};
	Ep.prototype.add=function(b,c,d,e,f){var g,h,l;h=0;for(l=this.b.length;h<l;++h)if(g=this.b[h],g.width>=c+this.a&&g.height>=d+this.a)return l={offsetX:g.x+this.a,offsetY:g.y+this.a,image:this.g},this.c[b]=l,e.call(f,this.f,g.x+this.a,g.y+this.a),b=h,c=c+this.a,d=d+this.a,f=e=void 0,g.width-c>g.height-d?(e={x:g.x+c,y:g.y,width:g.width-c,height:g.height},f={x:g.x,y:g.y+d,width:c,height:g.height-d},Gp(this,b,e,f)):(e={x:g.x+c,y:g.y,width:g.width-c,height:d},f={x:g.x,y:g.y+d,width:g.width,height:g.height-
	d},Gp(this,b,e,f)),l;return null};function Gp(b,c,d,e){c=[c,1];0<d.width&&0<d.height&&c.push(d);0<e.width&&0<e.height&&c.push(e);b.b.splice.apply(b.b,c)};function Hp(b){this.j=this.c=this.f=null;this.i=void 0!==b.fill?b.fill:null;this.A=[0,0];this.a=b.points;this.g=void 0!==b.radius?b.radius:b.radius1;this.h=void 0!==b.radius2?b.radius2:this.g;this.l=void 0!==b.angle?b.angle:0;this.b=void 0!==b.stroke?b.stroke:null;this.D=this.w=null;var c=b.atlasManager,d="",e="",f=0,g=null,h,l=0;this.b&&(h=nf(this.b.b),l=this.b.g,void 0===l&&(l=1),g=this.b.a,oh||(g=null),e=this.b.f,void 0===e&&(e="round"),d=this.b.c,void 0===d&&(d="round"),f=this.b.h,void 0===f&&
	(f=10));var m=2*(this.g+l)+1,d={strokeStyle:h,Rb:l,size:m,lineCap:d,lineDash:g,lineJoin:e,miterLimit:f};if(void 0===c)this.c=document.createElement("CANVAS"),this.c.height=m,this.c.width=m,m=this.c.width,c=this.c.getContext("2d"),this.we(d,c,0,0),this.i?this.j=this.c:(c=this.j=document.createElement("CANVAS"),c.height=d.size,c.width=d.size,c=c.getContext("2d"),this.ve(d,c,0,0));else{var m=Math.round(m),e=!this.i,n;e&&(n=ua(this.ve,this,d));f=this.Ea();c=c.add(f,m,m,ua(this.we,this,d),n);this.c=c.image;
	this.A=[c.offsetX,c.offsetY];this.j=e?c.me:this.c}this.w=[m/2,m/2];this.D=[m,m];zi.call(this,{opacity:1,rotateWithView:!1,rotation:void 0!==b.rotation?b.rotation:0,scale:1,snapToPixel:void 0!==b.snapToPixel?b.snapToPixel:!0})}v(Hp,zi);k=Hp.prototype;k.eb=function(){return this.w};k.sh=function(){return this.l};k.th=function(){return this.i};k.pd=function(){return this.j};k.Wa=function(){return this.c};k.Ob=function(){return 2};k.za=function(){return this.A};k.uh=function(){return this.a};k.vh=function(){return this.g};
	k.Rf=function(){return this.h};k.La=function(){return this.D};k.wh=function(){return this.b};k.jd=ya;k.load=ya;k.Bd=ya;
	k.we=function(b,c,d,e){var f;c.setTransform(1,0,0,1,0,0);c.translate(d,e);c.beginPath();this.h!==this.g&&(this.a*=2);for(d=0;d<=this.a;d++)e=2*d*Math.PI/this.a-Math.PI/2+this.l,f=0===d%2?this.g:this.h,c.lineTo(b.size/2+f*Math.cos(e),b.size/2+f*Math.sin(e));this.i&&(c.fillStyle=nf(this.i.a),c.fill());this.b&&(c.strokeStyle=b.strokeStyle,c.lineWidth=b.Rb,b.lineDash&&c.setLineDash(b.lineDash),c.lineCap=b.lineCap,c.lineJoin=b.lineJoin,c.miterLimit=b.miterLimit,c.stroke());c.closePath()};
	k.ve=function(b,c,d,e){c.setTransform(1,0,0,1,0,0);c.translate(d,e);c.beginPath();this.h!==this.g&&(this.a*=2);var f;for(d=0;d<=this.a;d++)f=2*d*Math.PI/this.a-Math.PI/2+this.l,e=0===d%2?this.g:this.h,c.lineTo(b.size/2+e*Math.cos(f),b.size/2+e*Math.sin(f));c.fillStyle=Cj;c.fill();this.b&&(c.strokeStyle=b.strokeStyle,c.lineWidth=b.Rb,b.lineDash&&c.setLineDash(b.lineDash),c.stroke());c.closePath()};
	k.Ea=function(){var b=this.b?this.b.Ea():"-",c=this.i?this.i.Ea():"-";this.f&&b==this.f[1]&&c==this.f[2]&&this.g==this.f[3]&&this.h==this.f[4]&&this.l==this.f[5]&&this.a==this.f[6]||(this.f=["r"+b+c+(void 0!==this.g?this.g.toString():"-")+(void 0!==this.h?this.h.toString():"-")+(void 0!==this.l?this.l.toString():"-")+(void 0!==this.a?this.a.toString():"-"),b,c,this.g,this.h,this.l,this.a]);return this.f[0]};u("ol.Attribution",kf,OPENLAYERS);F.prototype.clear=F.prototype.clear;F.prototype.extend=F.prototype.kd;F.prototype.forEach=F.prototype.forEach;F.prototype.getArray=F.prototype.Pg;F.prototype.item=F.prototype.item;F.prototype.getLength=F.prototype.hb;F.prototype.insertAt=F.prototype.oc;F.prototype.pop=F.prototype.pop;F.prototype.push=F.prototype.push;F.prototype.remove=F.prototype.remove;F.prototype.removeAt=F.prototype.wd;F.prototype.setAt=F.prototype.mi;F.prototype.get=F.prototype.get;
	F.prototype.getKeys=F.prototype.G;F.prototype.getProperties=F.prototype.O;F.prototype.set=F.prototype.B;F.prototype.setProperties=F.prototype.I;F.prototype.unset=F.prototype.X;F.prototype.changed=F.prototype.s;F.prototype.getRevision=F.prototype.S;F.prototype.on=F.prototype.T;F.prototype.once=F.prototype.U;F.prototype.un=F.prototype.V;F.prototype.unByKey=F.prototype.W;u("ol.Feature",nl,OPENLAYERS);nl.prototype.clone=nl.prototype.clone;nl.prototype.getGeometry=nl.prototype.J;nl.prototype.getId=nl.prototype.Cf;
	nl.prototype.getGeometryName=nl.prototype.Bf;nl.prototype.getStyle=nl.prototype.Qg;nl.prototype.getStyleFunction=nl.prototype.Rg;nl.prototype.setGeometry=nl.prototype.Ba;nl.prototype.setStyle=nl.prototype.oe;nl.prototype.setId=nl.prototype.Fe;nl.prototype.setGeometryName=nl.prototype.Lc;nl.prototype.get=nl.prototype.get;nl.prototype.getKeys=nl.prototype.G;nl.prototype.getProperties=nl.prototype.O;nl.prototype.set=nl.prototype.B;nl.prototype.setProperties=nl.prototype.I;nl.prototype.unset=nl.prototype.X;
	nl.prototype.changed=nl.prototype.s;nl.prototype.getRevision=nl.prototype.S;nl.prototype.on=nl.prototype.T;nl.prototype.once=nl.prototype.U;nl.prototype.un=nl.prototype.V;nl.prototype.unByKey=nl.prototype.W;u("ol.Map",Y,OPENLAYERS);Y.prototype.addControl=Y.prototype.cf;Y.prototype.addInteraction=Y.prototype.ef;Y.prototype.addLayer=Y.prototype.ff;Y.prototype.addOverlay=Y.prototype.gf;Y.prototype.beforeRender=Y.prototype.ha;Y.prototype.forEachFeatureAtPixel=Y.prototype.Zc;
	Y.prototype.forEachLayerAtPixel=Y.prototype.Vg;Y.prototype.hasFeatureAtPixel=Y.prototype.xg;Y.prototype.getEventCoordinate=Y.prototype.yf;Y.prototype.getEventPixel=Y.prototype.ad;Y.prototype.getTarget=Y.prototype.pe;Y.prototype.getTargetElement=Y.prototype.Fb;Y.prototype.getCoordinateFromPixel=Y.prototype.ya;Y.prototype.getControls=Y.prototype.xf;Y.prototype.getOverlays=Y.prototype.Nf;Y.prototype.getInteractions=Y.prototype.Df;Y.prototype.getLayerGroup=Y.prototype.fb;Y.prototype.getLayers=Y.prototype.Wg;
	Y.prototype.getPixelFromCoordinate=Y.prototype.Eb;Y.prototype.getSize=Y.prototype.ib;Y.prototype.getView=Y.prototype.R;Y.prototype.getViewport=Y.prototype.Wf;Y.prototype.renderSync=Y.prototype.ji;Y.prototype.render=Y.prototype.render;Y.prototype.removeControl=Y.prototype.ci;Y.prototype.removeInteraction=Y.prototype.ei;Y.prototype.removeLayer=Y.prototype.gi;Y.prototype.removeOverlay=Y.prototype.hi;Y.prototype.setLayerGroup=Y.prototype.si;Y.prototype.setSize=Y.prototype.zd;Y.prototype.setTarget=Y.prototype.Yg;
	Y.prototype.setView=Y.prototype.Bi;Y.prototype.updateSize=Y.prototype.Cd;Y.prototype.get=Y.prototype.get;Y.prototype.getKeys=Y.prototype.G;Y.prototype.getProperties=Y.prototype.O;Y.prototype.set=Y.prototype.B;Y.prototype.setProperties=Y.prototype.I;Y.prototype.unset=Y.prototype.X;Y.prototype.changed=Y.prototype.s;Y.prototype.getRevision=Y.prototype.S;Y.prototype.on=Y.prototype.T;Y.prototype.once=Y.prototype.U;Y.prototype.un=Y.prototype.V;Y.prototype.unByKey=Y.prototype.W;Rc.prototype.changed=Rc.prototype.s;
	Rc.prototype.getRevision=Rc.prototype.S;Rc.prototype.on=Rc.prototype.T;Rc.prototype.once=Rc.prototype.U;Rc.prototype.un=Rc.prototype.V;Rc.prototype.unByKey=Rc.prototype.W;u("ol.Overlay",an,OPENLAYERS);an.prototype.getElement=an.prototype.ld;an.prototype.getMap=an.prototype.uc;an.prototype.getOffset=an.prototype.ce;an.prototype.getPosition=an.prototype.ee;an.prototype.getPositioning=an.prototype.fe;an.prototype.setElement=an.prototype.De;an.prototype.setMap=an.prototype.setMap;
	an.prototype.setOffset=an.prototype.He;an.prototype.setPosition=an.prototype.qe;an.prototype.setPositioning=an.prototype.Ie;an.prototype.get=an.prototype.get;an.prototype.getKeys=an.prototype.G;an.prototype.getProperties=an.prototype.O;an.prototype.set=an.prototype.B;an.prototype.setProperties=an.prototype.I;an.prototype.unset=an.prototype.X;an.prototype.changed=an.prototype.s;an.prototype.getRevision=an.prototype.S;an.prototype.on=an.prototype.T;an.prototype.once=an.prototype.U;an.prototype.un=an.prototype.V;
	an.prototype.unByKey=an.prototype.W;u("ol.View",E,OPENLAYERS);E.prototype.constrainCenter=E.prototype.ac;E.prototype.constrainResolution=E.prototype.constrainResolution;E.prototype.constrainRotation=E.prototype.constrainRotation;E.prototype.getCenter=E.prototype.na;E.prototype.calculateExtent=E.prototype.of;E.prototype.getProjection=E.prototype.Zg;E.prototype.getResolution=E.prototype.Z;E.prototype.getRotation=E.prototype.ja;E.prototype.getZoom=E.prototype.Yf;E.prototype.fit=E.prototype.uf;
	E.prototype.centerOn=E.prototype.pf;E.prototype.rotate=E.prototype.rotate;E.prototype.setCenter=E.prototype.sa;E.prototype.setResolution=E.prototype.Ia;E.prototype.setRotation=E.prototype.md;E.prototype.setZoom=E.prototype.Ei;E.prototype.get=E.prototype.get;E.prototype.getKeys=E.prototype.G;E.prototype.getProperties=E.prototype.O;E.prototype.set=E.prototype.B;E.prototype.setProperties=E.prototype.I;E.prototype.unset=E.prototype.X;E.prototype.changed=E.prototype.s;E.prototype.getRevision=E.prototype.S;
	E.prototype.on=E.prototype.T;E.prototype.once=E.prototype.U;E.prototype.un=E.prototype.V;E.prototype.unByKey=E.prototype.W;u("ol.animation.pan",bf,OPENLAYERS);u("ol.animation.zoom",df,OPENLAYERS);u("ol.control.defaults",Eg,OPENLAYERS);u("ol.geom.Circle",N,OPENLAYERS);N.prototype.clone=N.prototype.clone;N.prototype.getCenter=N.prototype.Hb;N.prototype.getRadius=N.prototype.nd;N.prototype.getType=N.prototype.P;N.prototype.intersectsExtent=N.prototype.ea;N.prototype.setCenter=N.prototype.$g;
	N.prototype.setCenterAndRadius=N.prototype.yd;N.prototype.setRadius=N.prototype.wi;N.prototype.transform=N.prototype.oa;u("ol.geom.Geometry",ne,OPENLAYERS);ne.prototype.getClosestPoint=ne.prototype.qa;ne.prototype.getExtent=ne.prototype.v;ne.prototype.simplify=ne.prototype.ua;ne.prototype.transform=ne.prototype.oa;u("ol.geom.GeometryCollection",O,OPENLAYERS);O.prototype.clone=O.prototype.clone;O.prototype.getGeometries=O.prototype.Yd;O.prototype.getType=O.prototype.P;
	O.prototype.intersectsExtent=O.prototype.ea;O.prototype.setGeometries=O.prototype.Ee;O.prototype.applyTransform=O.prototype.qb;O.prototype.translate=O.prototype.vc;u("ol.geom.LinearRing",B,OPENLAYERS);B.prototype.clone=B.prototype.clone;B.prototype.getArea=B.prototype.dh;B.prototype.getCoordinates=B.prototype.ba;B.prototype.getType=B.prototype.P;B.prototype.setCoordinates=B.prototype.aa;u("ol.geom.LineString",P,OPENLAYERS);P.prototype.appendCoordinate=P.prototype.hf;P.prototype.clone=P.prototype.clone;
	P.prototype.forEachSegment=P.prototype.vf;P.prototype.getCoordinateAtM=P.prototype.ah;P.prototype.getCoordinates=P.prototype.ba;P.prototype.getLength=P.prototype.bh;P.prototype.getType=P.prototype.P;P.prototype.intersectsExtent=P.prototype.ea;P.prototype.setCoordinates=P.prototype.aa;u("ol.geom.MultiLineString",Q,OPENLAYERS);Q.prototype.appendLineString=Q.prototype.jf;Q.prototype.clone=Q.prototype.clone;Q.prototype.getCoordinateAtM=Q.prototype.eh;Q.prototype.getCoordinates=Q.prototype.ba;
	Q.prototype.getLineString=Q.prototype.If;Q.prototype.getLineStrings=Q.prototype.$d;Q.prototype.getType=Q.prototype.P;Q.prototype.intersectsExtent=Q.prototype.ea;Q.prototype.setCoordinates=Q.prototype.aa;u("ol.geom.MultiPoint",R,OPENLAYERS);R.prototype.appendPoint=R.prototype.lf;R.prototype.clone=R.prototype.clone;R.prototype.getCoordinates=R.prototype.ba;R.prototype.getPoint=R.prototype.Of;R.prototype.getPoints=R.prototype.re;R.prototype.getType=R.prototype.P;R.prototype.intersectsExtent=R.prototype.ea;
	R.prototype.setCoordinates=R.prototype.aa;u("ol.geom.MultiPolygon",T,OPENLAYERS);T.prototype.appendPolygon=T.prototype.mf;T.prototype.clone=T.prototype.clone;T.prototype.getArea=T.prototype.fh;T.prototype.getCoordinates=T.prototype.ba;T.prototype.getInteriorPoints=T.prototype.Ff;T.prototype.getPolygon=T.prototype.Qf;T.prototype.getPolygons=T.prototype.de;T.prototype.getType=T.prototype.P;T.prototype.intersectsExtent=T.prototype.ea;T.prototype.setCoordinates=T.prototype.aa;u("ol.geom.Point",C,OPENLAYERS);
	C.prototype.clone=C.prototype.clone;C.prototype.getCoordinates=C.prototype.ba;C.prototype.getType=C.prototype.P;C.prototype.intersectsExtent=C.prototype.ea;C.prototype.setCoordinates=C.prototype.aa;u("ol.geom.Polygon",D,OPENLAYERS);D.prototype.appendLinearRing=D.prototype.kf;D.prototype.clone=D.prototype.clone;D.prototype.getArea=D.prototype.gh;D.prototype.getCoordinates=D.prototype.ba;D.prototype.getInteriorPoint=D.prototype.Ef;D.prototype.getLinearRingCount=D.prototype.Jf;
	D.prototype.getLinearRing=D.prototype.ae;D.prototype.getLinearRings=D.prototype.be;D.prototype.getType=D.prototype.P;D.prototype.intersectsExtent=D.prototype.ea;D.prototype.setCoordinates=D.prototype.aa;u("ol.geom.Polygon.circular",function(b,c,d,e){var f=e?e:32;e=[];var g;for(g=0;g<f;++g)bb(e,b.offset(c,d,2*Math.PI*g/f));e.push(e[0],e[1]);b=new D(null);Re(b,"XY",e,[e.length]);return b},OPENLAYERS);u("ol.geom.Polygon.fromExtent",Ue,OPENLAYERS);
	u("ol.geom.Polygon.fromCircle",function(b,c,d){var e=c?c:32,f=b.b,g=b.c;c=new D(null,g);for(var e=f*(e+1),f=[],h=0;h<e;h++)f[h]=0;Re(c,g,f,[f.length]);g=b.Hb();b=b.nd();var e=c.a,f=c.c,h=c.b,l=c.f,m=e.length/h-1;d=d?d:0;for(var n,p,q=0;q<=m;++q)p=q*h,n=d+2*nb(q,m)*Math.PI/m,e[p]=g[0]+b*Math.cos(n),e[p+1]=g[1]+b*Math.sin(n);Re(c,f,e,l);return c},OPENLAYERS);u("ol.geom.SimpleGeometry",z,OPENLAYERS);z.prototype.getFirstCoordinate=z.prototype.Fa;z.prototype.getLastCoordinate=z.prototype.Ga;
	z.prototype.getLayout=z.prototype.Ha;z.prototype.applyTransform=z.prototype.qb;z.prototype.translate=z.prototype.vc;ne.prototype.get=ne.prototype.get;ne.prototype.getKeys=ne.prototype.G;ne.prototype.getProperties=ne.prototype.O;ne.prototype.set=ne.prototype.B;ne.prototype.setProperties=ne.prototype.I;ne.prototype.unset=ne.prototype.X;ne.prototype.changed=ne.prototype.s;ne.prototype.getRevision=ne.prototype.S;ne.prototype.on=ne.prototype.T;ne.prototype.once=ne.prototype.U;ne.prototype.un=ne.prototype.V;
	ne.prototype.unByKey=ne.prototype.W;z.prototype.getClosestPoint=z.prototype.qa;z.prototype.getExtent=z.prototype.v;z.prototype.simplify=z.prototype.ua;z.prototype.transform=z.prototype.oa;z.prototype.get=z.prototype.get;z.prototype.getKeys=z.prototype.G;z.prototype.getProperties=z.prototype.O;z.prototype.set=z.prototype.B;z.prototype.setProperties=z.prototype.I;z.prototype.unset=z.prototype.X;z.prototype.changed=z.prototype.s;z.prototype.getRevision=z.prototype.S;z.prototype.on=z.prototype.T;
	z.prototype.once=z.prototype.U;z.prototype.un=z.prototype.V;z.prototype.unByKey=z.prototype.W;N.prototype.getFirstCoordinate=N.prototype.Fa;N.prototype.getLastCoordinate=N.prototype.Ga;N.prototype.getLayout=N.prototype.Ha;N.prototype.getClosestPoint=N.prototype.qa;N.prototype.getExtent=N.prototype.v;N.prototype.simplify=N.prototype.ua;N.prototype.get=N.prototype.get;N.prototype.getKeys=N.prototype.G;N.prototype.getProperties=N.prototype.O;N.prototype.set=N.prototype.B;N.prototype.setProperties=N.prototype.I;
	N.prototype.unset=N.prototype.X;N.prototype.changed=N.prototype.s;N.prototype.getRevision=N.prototype.S;N.prototype.on=N.prototype.T;N.prototype.once=N.prototype.U;N.prototype.un=N.prototype.V;N.prototype.unByKey=N.prototype.W;O.prototype.getClosestPoint=O.prototype.qa;O.prototype.getExtent=O.prototype.v;O.prototype.simplify=O.prototype.ua;O.prototype.transform=O.prototype.oa;O.prototype.get=O.prototype.get;O.prototype.getKeys=O.prototype.G;O.prototype.getProperties=O.prototype.O;
	O.prototype.set=O.prototype.B;O.prototype.setProperties=O.prototype.I;O.prototype.unset=O.prototype.X;O.prototype.changed=O.prototype.s;O.prototype.getRevision=O.prototype.S;O.prototype.on=O.prototype.T;O.prototype.once=O.prototype.U;O.prototype.un=O.prototype.V;O.prototype.unByKey=O.prototype.W;B.prototype.getFirstCoordinate=B.prototype.Fa;B.prototype.getLastCoordinate=B.prototype.Ga;B.prototype.getLayout=B.prototype.Ha;B.prototype.getClosestPoint=B.prototype.qa;B.prototype.getExtent=B.prototype.v;
	B.prototype.simplify=B.prototype.ua;B.prototype.transform=B.prototype.oa;B.prototype.get=B.prototype.get;B.prototype.getKeys=B.prototype.G;B.prototype.getProperties=B.prototype.O;B.prototype.set=B.prototype.B;B.prototype.setProperties=B.prototype.I;B.prototype.unset=B.prototype.X;B.prototype.changed=B.prototype.s;B.prototype.getRevision=B.prototype.S;B.prototype.on=B.prototype.T;B.prototype.once=B.prototype.U;B.prototype.un=B.prototype.V;B.prototype.unByKey=B.prototype.W;
	P.prototype.getFirstCoordinate=P.prototype.Fa;P.prototype.getLastCoordinate=P.prototype.Ga;P.prototype.getLayout=P.prototype.Ha;P.prototype.getClosestPoint=P.prototype.qa;P.prototype.getExtent=P.prototype.v;P.prototype.simplify=P.prototype.ua;P.prototype.transform=P.prototype.oa;P.prototype.get=P.prototype.get;P.prototype.getKeys=P.prototype.G;P.prototype.getProperties=P.prototype.O;P.prototype.set=P.prototype.B;P.prototype.setProperties=P.prototype.I;P.prototype.unset=P.prototype.X;
	P.prototype.changed=P.prototype.s;P.prototype.getRevision=P.prototype.S;P.prototype.on=P.prototype.T;P.prototype.once=P.prototype.U;P.prototype.un=P.prototype.V;P.prototype.unByKey=P.prototype.W;Q.prototype.getFirstCoordinate=Q.prototype.Fa;Q.prototype.getLastCoordinate=Q.prototype.Ga;Q.prototype.getLayout=Q.prototype.Ha;Q.prototype.getClosestPoint=Q.prototype.qa;Q.prototype.getExtent=Q.prototype.v;Q.prototype.simplify=Q.prototype.ua;Q.prototype.transform=Q.prototype.oa;Q.prototype.get=Q.prototype.get;
	Q.prototype.getKeys=Q.prototype.G;Q.prototype.getProperties=Q.prototype.O;Q.prototype.set=Q.prototype.B;Q.prototype.setProperties=Q.prototype.I;Q.prototype.unset=Q.prototype.X;Q.prototype.changed=Q.prototype.s;Q.prototype.getRevision=Q.prototype.S;Q.prototype.on=Q.prototype.T;Q.prototype.once=Q.prototype.U;Q.prototype.un=Q.prototype.V;Q.prototype.unByKey=Q.prototype.W;R.prototype.getFirstCoordinate=R.prototype.Fa;R.prototype.getLastCoordinate=R.prototype.Ga;R.prototype.getLayout=R.prototype.Ha;
	R.prototype.getClosestPoint=R.prototype.qa;R.prototype.getExtent=R.prototype.v;R.prototype.simplify=R.prototype.ua;R.prototype.transform=R.prototype.oa;R.prototype.get=R.prototype.get;R.prototype.getKeys=R.prototype.G;R.prototype.getProperties=R.prototype.O;R.prototype.set=R.prototype.B;R.prototype.setProperties=R.prototype.I;R.prototype.unset=R.prototype.X;R.prototype.changed=R.prototype.s;R.prototype.getRevision=R.prototype.S;R.prototype.on=R.prototype.T;R.prototype.once=R.prototype.U;
	R.prototype.un=R.prototype.V;R.prototype.unByKey=R.prototype.W;T.prototype.getFirstCoordinate=T.prototype.Fa;T.prototype.getLastCoordinate=T.prototype.Ga;T.prototype.getLayout=T.prototype.Ha;T.prototype.getClosestPoint=T.prototype.qa;T.prototype.getExtent=T.prototype.v;T.prototype.simplify=T.prototype.ua;T.prototype.transform=T.prototype.oa;T.prototype.get=T.prototype.get;T.prototype.getKeys=T.prototype.G;T.prototype.getProperties=T.prototype.O;T.prototype.set=T.prototype.B;
	T.prototype.setProperties=T.prototype.I;T.prototype.unset=T.prototype.X;T.prototype.changed=T.prototype.s;T.prototype.getRevision=T.prototype.S;T.prototype.on=T.prototype.T;T.prototype.once=T.prototype.U;T.prototype.un=T.prototype.V;T.prototype.unByKey=T.prototype.W;C.prototype.getFirstCoordinate=C.prototype.Fa;C.prototype.getLastCoordinate=C.prototype.Ga;C.prototype.getLayout=C.prototype.Ha;C.prototype.getClosestPoint=C.prototype.qa;C.prototype.getExtent=C.prototype.v;C.prototype.simplify=C.prototype.ua;
	C.prototype.transform=C.prototype.oa;C.prototype.get=C.prototype.get;C.prototype.getKeys=C.prototype.G;C.prototype.getProperties=C.prototype.O;C.prototype.set=C.prototype.B;C.prototype.setProperties=C.prototype.I;C.prototype.unset=C.prototype.X;C.prototype.changed=C.prototype.s;C.prototype.getRevision=C.prototype.S;C.prototype.on=C.prototype.T;C.prototype.once=C.prototype.U;C.prototype.un=C.prototype.V;C.prototype.unByKey=C.prototype.W;D.prototype.getFirstCoordinate=D.prototype.Fa;
	D.prototype.getLastCoordinate=D.prototype.Ga;D.prototype.getLayout=D.prototype.Ha;D.prototype.getClosestPoint=D.prototype.qa;D.prototype.getExtent=D.prototype.v;D.prototype.simplify=D.prototype.ua;D.prototype.transform=D.prototype.oa;D.prototype.get=D.prototype.get;D.prototype.getKeys=D.prototype.G;D.prototype.getProperties=D.prototype.O;D.prototype.set=D.prototype.B;D.prototype.setProperties=D.prototype.I;D.prototype.unset=D.prototype.X;D.prototype.changed=D.prototype.s;D.prototype.getRevision=D.prototype.S;
	D.prototype.on=D.prototype.T;D.prototype.once=D.prototype.U;D.prototype.un=D.prototype.V;D.prototype.unByKey=D.prototype.W;u("ol.interaction.defaults",ck,OPENLAYERS);u("ol.source.Vector",W,OPENLAYERS);W.prototype.addFeature=W.prototype.Vb;W.prototype.addFeatures=W.prototype.Wb;W.prototype.clear=W.prototype.clear;W.prototype.forEachFeature=W.prototype.Rd;W.prototype.forEachFeatureInExtent=W.prototype.cb;W.prototype.forEachFeatureIntersectingExtent=W.prototype.Sd;W.prototype.getFeaturesCollection=W.prototype.Wd;
	W.prototype.getFeatures=W.prototype.se;W.prototype.getFeaturesAtCoordinate=W.prototype.Vd;W.prototype.getFeaturesInExtent=W.prototype.Xd;W.prototype.getClosestFeatureToCoordinate=W.prototype.Td;W.prototype.getExtent=W.prototype.v;W.prototype.getFeatureById=W.prototype.Ud;W.prototype.removeFeature=W.prototype.xd;W.prototype.getAttributions=W.prototype.Lb;W.prototype.getLogo=W.prototype.Bb;W.prototype.getProjection=W.prototype.Mb;W.prototype.getState=W.prototype.Nb;W.prototype.setAttributions=W.prototype.lb;
	W.prototype.get=W.prototype.get;W.prototype.getKeys=W.prototype.G;W.prototype.getProperties=W.prototype.O;W.prototype.set=W.prototype.B;W.prototype.setProperties=W.prototype.I;W.prototype.unset=W.prototype.X;W.prototype.changed=W.prototype.s;W.prototype.getRevision=W.prototype.S;W.prototype.on=W.prototype.T;W.prototype.once=W.prototype.U;W.prototype.un=W.prototype.V;W.prototype.unByKey=W.prototype.W;u("ol.source.XYZ",Z,OPENLAYERS);Z.prototype.getUrls=Z.prototype.i;Z.prototype.setUrl=Z.prototype.c;
	Z.prototype.getTileLoadFunction=Z.prototype.ge;Z.prototype.getTileUrlFunction=Z.prototype.he;Z.prototype.setTileLoadFunction=Z.prototype.Je;Z.prototype.setTileUrlFunction=Z.prototype.Qb;Z.prototype.getTileGrid=Z.prototype.h;Z.prototype.getAttributions=Z.prototype.Lb;Z.prototype.getLogo=Z.prototype.Bb;Z.prototype.getProjection=Z.prototype.Mb;Z.prototype.getState=Z.prototype.Nb;Z.prototype.setAttributions=Z.prototype.lb;Z.prototype.get=Z.prototype.get;Z.prototype.getKeys=Z.prototype.G;
	Z.prototype.getProperties=Z.prototype.O;Z.prototype.set=Z.prototype.B;Z.prototype.setProperties=Z.prototype.I;Z.prototype.unset=Z.prototype.X;Z.prototype.changed=Z.prototype.s;Z.prototype.getRevision=Z.prototype.S;Z.prototype.on=Z.prototype.T;Z.prototype.once=Z.prototype.U;Z.prototype.un=Z.prototype.V;Z.prototype.unByKey=Z.prototype.W;u("ol.events.condition.altKeyOnly",function(b){b=b.a;return b.b&&!b.i&&!b.g},OPENLAYERS);u("ol.events.condition.altShiftKeysOnly",Yi,OPENLAYERS);
	u("ol.events.condition.always",Kd,OPENLAYERS);u("ol.events.condition.click",function(b){return b.type==ai},OPENLAYERS);u("ol.events.condition.never",Jd,OPENLAYERS);u("ol.events.condition.pointerMove",Zi,OPENLAYERS);u("ol.events.condition.singleClick",$i,OPENLAYERS);u("ol.events.condition.doubleClick",function(b){return b.type==bi},OPENLAYERS);u("ol.events.condition.noModifierKeys",aj,OPENLAYERS);u("ol.events.condition.platformModifierKeyOnly",function(b){b=b.a;return!b.b&&b.i&&!b.g},OPENLAYERS);
	u("ol.events.condition.shiftKeyOnly",bj,OPENLAYERS);u("ol.events.condition.targetNotEditable",cj,OPENLAYERS);u("ol.events.condition.mouseOnly",dj,OPENLAYERS);u("ol.extent.boundingExtent",function(b){for(var c=nd(),d=0,e=b.length;d<e;++d)td(c,b[d]);return c},OPENLAYERS);u("ol.extent.buffer",gd,OPENLAYERS);u("ol.extent.containsCoordinate",jd,OPENLAYERS);u("ol.extent.containsExtent",ld,OPENLAYERS);u("ol.extent.containsXY",kd,OPENLAYERS);u("ol.extent.createEmpty",nd,OPENLAYERS);
	u("ol.extent.equals",od,OPENLAYERS);u("ol.extent.extend",pd,OPENLAYERS);u("ol.extent.getBottomLeft",wd,OPENLAYERS);u("ol.extent.getBottomRight",xd,OPENLAYERS);u("ol.extent.getCenter",Ad,OPENLAYERS);u("ol.extent.getHeight",Cd,OPENLAYERS);u("ol.extent.getIntersection",Dd,OPENLAYERS);u("ol.extent.getSize",function(b){return[b[2]-b[0],b[3]-b[1]]},OPENLAYERS);u("ol.extent.getTopLeft",zd,OPENLAYERS);u("ol.extent.getTopRight",yd,OPENLAYERS);u("ol.extent.getWidth",Fd,OPENLAYERS);
	u("ol.extent.intersects",Ed,OPENLAYERS);u("ol.extent.isEmpty",Gd,OPENLAYERS);u("ol.extent.applyTransform",Hd,OPENLAYERS);u("ol.format.GeoJSON",Cn,OPENLAYERS);Cn.prototype.readFeature=Cn.prototype.td;Cn.prototype.readFeatures=Cn.prototype.Jc;Cn.prototype.readGeometry=Cn.prototype.ud;Cn.prototype.readProjection=Cn.prototype.vd;Cn.prototype.writeFeature=Cn.prototype.Dd;Cn.prototype.writeFeatureObject=Cn.prototype.a;Cn.prototype.writeFeatures=Cn.prototype.Ed;Cn.prototype.writeFeaturesObject=Cn.prototype.g;
	Cn.prototype.writeGeometry=Cn.prototype.Fd;Cn.prototype.writeGeometryObject=Cn.prototype.c;u("ol.format.WKT",bo,OPENLAYERS);bo.prototype.readFeature=bo.prototype.td;bo.prototype.readFeatures=bo.prototype.Jc;bo.prototype.readGeometry=bo.prototype.ud;bo.prototype.writeFeature=bo.prototype.Dd;bo.prototype.writeFeatures=bo.prototype.Ed;bo.prototype.writeGeometry=bo.prototype.Fd;u("ol.inherits",v,OPENLAYERS);u("ol.interaction.DoubleClickZoom",Wi,OPENLAYERS);Wi.prototype.getActive=Wi.prototype.D;
	Wi.prototype.setActive=Wi.prototype.Y;Wi.prototype.get=Wi.prototype.get;Wi.prototype.getKeys=Wi.prototype.G;Wi.prototype.getProperties=Wi.prototype.O;Wi.prototype.set=Wi.prototype.B;Wi.prototype.setProperties=Wi.prototype.I;Wi.prototype.unset=Wi.prototype.X;Wi.prototype.changed=Wi.prototype.s;Wi.prototype.getRevision=Wi.prototype.S;Wi.prototype.on=Wi.prototype.T;Wi.prototype.once=Wi.prototype.U;Wi.prototype.un=Wi.prototype.V;Wi.prototype.unByKey=Wi.prototype.W;u("ol.interaction.Draw",Ho,OPENLAYERS);
	Ho.prototype.removeLastPoint=Ho.prototype.fi;Ho.prototype.finishDrawing=Ho.prototype.zb;Ho.prototype.extend=Ho.prototype.hh;Ho.prototype.getActive=Ho.prototype.D;Ho.prototype.setActive=Ho.prototype.Y;Ho.prototype.get=Ho.prototype.get;Ho.prototype.getKeys=Ho.prototype.G;Ho.prototype.getProperties=Ho.prototype.O;Ho.prototype.set=Ho.prototype.B;Ho.prototype.setProperties=Ho.prototype.I;Ho.prototype.unset=Ho.prototype.X;Ho.prototype.changed=Ho.prototype.s;Ho.prototype.getRevision=Ho.prototype.S;
	Ho.prototype.on=Ho.prototype.T;Ho.prototype.once=Ho.prototype.U;Ho.prototype.un=Ho.prototype.V;Ho.prototype.unByKey=Ho.prototype.W;u("ol.interaction.Select",Yo,OPENLAYERS);Yo.prototype.getFeatures=Yo.prototype.ih;Yo.prototype.getLayer=Yo.prototype.jh;Yo.prototype.setMap=Yo.prototype.setMap;Yo.prototype.getActive=Yo.prototype.D;Yo.prototype.setActive=Yo.prototype.Y;Yo.prototype.get=Yo.prototype.get;Yo.prototype.getKeys=Yo.prototype.G;Yo.prototype.getProperties=Yo.prototype.O;Yo.prototype.set=Yo.prototype.B;
	Yo.prototype.setProperties=Yo.prototype.I;Yo.prototype.unset=Yo.prototype.X;Yo.prototype.changed=Yo.prototype.s;Yo.prototype.getRevision=Yo.prototype.S;Yo.prototype.on=Yo.prototype.T;Yo.prototype.once=Yo.prototype.U;Yo.prototype.un=Yo.prototype.V;Yo.prototype.unByKey=Yo.prototype.W;u("ol.interaction.defaults",ck,OPENLAYERS);u("ol.layer.Image",G,OPENLAYERS);G.prototype.getSource=G.prototype.da;G.prototype.setMap=G.prototype.setMap;G.prototype.setSource=G.prototype.Oc;G.prototype.getExtent=G.prototype.v;
	G.prototype.getMaxResolution=G.prototype.Cb;G.prototype.getMinResolution=G.prototype.Db;G.prototype.getOpacity=G.prototype.Ib;G.prototype.getVisible=G.prototype.Ra;G.prototype.getZIndex=G.prototype.Jb;G.prototype.setExtent=G.prototype.wc;G.prototype.setMaxResolution=G.prototype.Mc;G.prototype.setMinResolution=G.prototype.Nc;G.prototype.setOpacity=G.prototype.xc;G.prototype.setVisible=G.prototype.yc;G.prototype.setZIndex=G.prototype.zc;G.prototype.get=G.prototype.get;G.prototype.getKeys=G.prototype.G;
	G.prototype.getProperties=G.prototype.O;G.prototype.set=G.prototype.B;G.prototype.setProperties=G.prototype.I;G.prototype.unset=G.prototype.X;G.prototype.changed=G.prototype.s;G.prototype.getRevision=G.prototype.S;G.prototype.on=G.prototype.T;G.prototype.once=G.prototype.U;G.prototype.un=G.prototype.V;G.prototype.unByKey=G.prototype.W;u("ol.layer.Tile",H,OPENLAYERS);H.prototype.getPreload=H.prototype.f;H.prototype.getSource=H.prototype.da;H.prototype.setPreload=H.prototype.i;
	H.prototype.getUseInterimTilesOnError=H.prototype.h;H.prototype.setUseInterimTilesOnError=H.prototype.j;H.prototype.setMap=H.prototype.setMap;H.prototype.setSource=H.prototype.Oc;H.prototype.getExtent=H.prototype.v;H.prototype.getMaxResolution=H.prototype.Cb;H.prototype.getMinResolution=H.prototype.Db;H.prototype.getOpacity=H.prototype.Ib;H.prototype.getVisible=H.prototype.Ra;H.prototype.getZIndex=H.prototype.Jb;H.prototype.setExtent=H.prototype.wc;H.prototype.setMaxResolution=H.prototype.Mc;
	H.prototype.setMinResolution=H.prototype.Nc;H.prototype.setOpacity=H.prototype.xc;H.prototype.setVisible=H.prototype.yc;H.prototype.setZIndex=H.prototype.zc;H.prototype.get=H.prototype.get;H.prototype.getKeys=H.prototype.G;H.prototype.getProperties=H.prototype.O;H.prototype.set=H.prototype.B;H.prototype.setProperties=H.prototype.I;H.prototype.unset=H.prototype.X;H.prototype.changed=H.prototype.s;H.prototype.getRevision=H.prototype.S;H.prototype.on=H.prototype.T;H.prototype.once=H.prototype.U;
	H.prototype.un=H.prototype.V;H.prototype.unByKey=H.prototype.W;u("ol.layer.Vector",J,OPENLAYERS);J.prototype.getSource=J.prototype.da;J.prototype.getStyle=J.prototype.o;J.prototype.getStyleFunction=J.prototype.u;J.prototype.setStyle=J.prototype.j;J.prototype.setMap=J.prototype.setMap;J.prototype.setSource=J.prototype.Oc;J.prototype.getExtent=J.prototype.v;J.prototype.getMaxResolution=J.prototype.Cb;J.prototype.getMinResolution=J.prototype.Db;J.prototype.getOpacity=J.prototype.Ib;
	J.prototype.getVisible=J.prototype.Ra;J.prototype.getZIndex=J.prototype.Jb;J.prototype.setExtent=J.prototype.wc;J.prototype.setMaxResolution=J.prototype.Mc;J.prototype.setMinResolution=J.prototype.Nc;J.prototype.setOpacity=J.prototype.xc;J.prototype.setVisible=J.prototype.yc;J.prototype.setZIndex=J.prototype.zc;J.prototype.get=J.prototype.get;J.prototype.getKeys=J.prototype.G;J.prototype.getProperties=J.prototype.O;J.prototype.set=J.prototype.B;J.prototype.setProperties=J.prototype.I;
	J.prototype.unset=J.prototype.X;J.prototype.changed=J.prototype.s;J.prototype.getRevision=J.prototype.S;J.prototype.on=J.prototype.T;J.prototype.once=J.prototype.U;J.prototype.un=J.prototype.V;J.prototype.unByKey=J.prototype.W;u("ol.layer.Group",M,OPENLAYERS);M.prototype.getLayers=M.prototype.jb;M.prototype.setLayers=M.prototype.Ge;M.prototype.getExtent=M.prototype.v;M.prototype.getMaxResolution=M.prototype.Cb;M.prototype.getMinResolution=M.prototype.Db;M.prototype.getOpacity=M.prototype.Ib;
	M.prototype.getVisible=M.prototype.Ra;M.prototype.getZIndex=M.prototype.Jb;M.prototype.setExtent=M.prototype.wc;M.prototype.setMaxResolution=M.prototype.Mc;M.prototype.setMinResolution=M.prototype.Nc;M.prototype.setOpacity=M.prototype.xc;M.prototype.setVisible=M.prototype.yc;M.prototype.setZIndex=M.prototype.zc;M.prototype.get=M.prototype.get;M.prototype.getKeys=M.prototype.G;M.prototype.getProperties=M.prototype.O;M.prototype.set=M.prototype.B;M.prototype.setProperties=M.prototype.I;
	M.prototype.unset=M.prototype.X;M.prototype.changed=M.prototype.s;M.prototype.getRevision=M.prototype.S;M.prototype.on=M.prototype.T;M.prototype.once=M.prototype.U;M.prototype.un=M.prototype.V;M.prototype.unByKey=M.prototype.W;u("ol.proj.common.add",jk,OPENLAYERS);u("ol.proj.METERS_PER_UNIT",Sd,OPENLAYERS);u("ol.proj.Projection",Td,OPENLAYERS);Td.prototype.getCode=Td.prototype.wf;Td.prototype.getExtent=Td.prototype.v;Td.prototype.getUnits=Td.prototype.Vf;Td.prototype.getMetersPerUnit=Td.prototype.dd;
	Td.prototype.getWorldExtent=Td.prototype.Xf;Td.prototype.isGlobal=Td.prototype.zg;Td.prototype.setGlobal=Td.prototype.ri;Td.prototype.setExtent=Td.prototype.lh;Td.prototype.setWorldExtent=Td.prototype.Di;Td.prototype.setGetPointResolution=Td.prototype.pi;Td.prototype.getPointResolution=Td.prototype.getPointResolution;u("ol.proj.addEquivalentProjections",Yd,OPENLAYERS);u("ol.proj.addProjection",ge,OPENLAYERS);
	u("ol.proj.addCoordinateTransforms",function(b,c,d,e){b=Vd(b);c=Vd(c);$d(b,c,ie(d));$d(c,b,ie(e))},OPENLAYERS);u("ol.proj.fromLonLat",function(b,c){return le(b,"EPSG:4326",void 0!==c?c:"EPSG:3857")},OPENLAYERS);u("ol.proj.toLonLat",function(b,c){return le(b,void 0!==c?c:"EPSG:3857","EPSG:4326")},OPENLAYERS);u("ol.proj.get",Vd,OPENLAYERS);u("ol.proj.getTransform",je,OPENLAYERS);u("ol.proj.transform",le,OPENLAYERS);u("ol.proj.transformExtent",me,OPENLAYERS);kk.prototype.drawAsync=kk.prototype.Yc;
	kk.prototype.drawCircleGeometry=kk.prototype.bc;kk.prototype.drawFeature=kk.prototype.sf;kk.prototype.drawPointGeometry=kk.prototype.gc;kk.prototype.drawMultiPointGeometry=kk.prototype.ec;kk.prototype.drawLineStringGeometry=kk.prototype.cc;kk.prototype.drawMultiLineStringGeometry=kk.prototype.dc;kk.prototype.drawPolygonGeometry=kk.prototype.yb;kk.prototype.drawMultiPolygonGeometry=kk.prototype.fc;kk.prototype.setFillStrokeStyle=kk.prototype.Ca;kk.prototype.setImageStyle=kk.prototype.Pb;
	kk.prototype.setTextStyle=kk.prototype.ta;u("ol.source.ImageStatic",tp,OPENLAYERS);u("ol.source.Raster",up,OPENLAYERS);up.prototype.setOperation=up.prototype.i;up.prototype.getAttributions=up.prototype.Lb;up.prototype.getLogo=up.prototype.Bb;up.prototype.getProjection=up.prototype.Mb;up.prototype.getState=up.prototype.Nb;up.prototype.setAttributions=up.prototype.lb;up.prototype.get=up.prototype.get;up.prototype.getKeys=up.prototype.G;up.prototype.getProperties=up.prototype.O;up.prototype.set=up.prototype.B;
	up.prototype.setProperties=up.prototype.I;up.prototype.unset=up.prototype.X;up.prototype.changed=up.prototype.s;up.prototype.getRevision=up.prototype.S;up.prototype.on=up.prototype.T;up.prototype.once=up.prototype.U;up.prototype.un=up.prototype.V;up.prototype.unByKey=up.prototype.W;u("ol.source.TileJSON",Cp,OPENLAYERS);u("ol.source.Vector",W,OPENLAYERS);W.prototype.addFeature=W.prototype.Vb;W.prototype.addFeatures=W.prototype.Wb;W.prototype.clear=W.prototype.clear;W.prototype.forEachFeature=W.prototype.Rd;
	W.prototype.forEachFeatureInExtent=W.prototype.cb;W.prototype.forEachFeatureIntersectingExtent=W.prototype.Sd;W.prototype.getFeaturesCollection=W.prototype.Wd;W.prototype.getFeatures=W.prototype.se;W.prototype.getFeaturesAtCoordinate=W.prototype.Vd;W.prototype.getFeaturesInExtent=W.prototype.Xd;W.prototype.getClosestFeatureToCoordinate=W.prototype.Td;W.prototype.getExtent=W.prototype.v;W.prototype.getFeatureById=W.prototype.Ud;W.prototype.removeFeature=W.prototype.xd;W.prototype.getAttributions=W.prototype.Lb;
	W.prototype.getLogo=W.prototype.Bb;W.prototype.getProjection=W.prototype.Mb;W.prototype.getState=W.prototype.Nb;W.prototype.setAttributions=W.prototype.lb;W.prototype.get=W.prototype.get;W.prototype.getKeys=W.prototype.G;W.prototype.getProperties=W.prototype.O;W.prototype.set=W.prototype.B;W.prototype.setProperties=W.prototype.I;W.prototype.unset=W.prototype.X;W.prototype.changed=W.prototype.s;W.prototype.getRevision=W.prototype.S;W.prototype.on=W.prototype.T;W.prototype.once=W.prototype.U;
	W.prototype.un=W.prototype.V;W.prototype.unByKey=W.prototype.W;u("ol.source.XYZ",Z,OPENLAYERS);Z.prototype.getUrls=Z.prototype.i;Z.prototype.setUrl=Z.prototype.c;Z.prototype.getTileLoadFunction=Z.prototype.ge;Z.prototype.getTileUrlFunction=Z.prototype.he;Z.prototype.setTileLoadFunction=Z.prototype.Je;Z.prototype.setTileUrlFunction=Z.prototype.Qb;Z.prototype.getTileGrid=Z.prototype.h;Z.prototype.getAttributions=Z.prototype.Lb;Z.prototype.getLogo=Z.prototype.Bb;Z.prototype.getProjection=Z.prototype.Mb;
	Z.prototype.getState=Z.prototype.Nb;Z.prototype.setAttributions=Z.prototype.lb;Z.prototype.get=Z.prototype.get;Z.prototype.getKeys=Z.prototype.G;Z.prototype.getProperties=Z.prototype.O;Z.prototype.set=Z.prototype.B;Z.prototype.setProperties=Z.prototype.I;Z.prototype.unset=Z.prototype.X;Z.prototype.changed=Z.prototype.s;Z.prototype.getRevision=Z.prototype.S;Z.prototype.on=Z.prototype.T;Z.prototype.once=Z.prototype.U;Z.prototype.un=Z.prototype.V;Z.prototype.unByKey=Z.prototype.W;
	u("ol.control.ZoomSlider",pn,OPENLAYERS);u("ol.style.AtlasManager",Dp,OPENLAYERS);u("ol.style.Circle",Gj,OPENLAYERS);Gj.prototype.getFill=Gj.prototype.oh;Gj.prototype.getImage=Gj.prototype.Wa;Gj.prototype.getRadius=Gj.prototype.ph;Gj.prototype.getStroke=Gj.prototype.qh;u("ol.style.Fill",Fj,OPENLAYERS);Fj.prototype.getColor=Fj.prototype.g;Fj.prototype.setColor=Fj.prototype.c;u("ol.style.Icon",Ai,OPENLAYERS);Ai.prototype.getAnchor=Ai.prototype.eb;Ai.prototype.getImage=Ai.prototype.Wa;
	Ai.prototype.getOrigin=Ai.prototype.za;Ai.prototype.getSrc=Ai.prototype.rh;Ai.prototype.getSize=Ai.prototype.La;Ai.prototype.load=Ai.prototype.load;u("ol.style.Image",zi,OPENLAYERS);zi.prototype.getOpacity=zi.prototype.Dc;zi.prototype.getRotateWithView=zi.prototype.ic;zi.prototype.getRotation=zi.prototype.Ec;zi.prototype.getScale=zi.prototype.Fc;zi.prototype.getSnapToPixel=zi.prototype.kc;zi.prototype.setOpacity=zi.prototype.Gc;zi.prototype.setRotation=zi.prototype.Hc;zi.prototype.setScale=zi.prototype.Ic;
	u("ol.style.RegularShape",Hp,OPENLAYERS);Hp.prototype.getAnchor=Hp.prototype.eb;Hp.prototype.getAngle=Hp.prototype.sh;Hp.prototype.getFill=Hp.prototype.th;Hp.prototype.getImage=Hp.prototype.Wa;Hp.prototype.getOrigin=Hp.prototype.za;Hp.prototype.getPoints=Hp.prototype.uh;Hp.prototype.getRadius=Hp.prototype.vh;Hp.prototype.getRadius2=Hp.prototype.Rf;Hp.prototype.getSize=Hp.prototype.La;Hp.prototype.getStroke=Hp.prototype.wh;u("ol.style.Stroke",Bj,OPENLAYERS);Bj.prototype.getColor=Bj.prototype.xh;
	Bj.prototype.getLineCap=Bj.prototype.Gf;Bj.prototype.getLineDash=Bj.prototype.yh;Bj.prototype.getLineJoin=Bj.prototype.Hf;Bj.prototype.getMiterLimit=Bj.prototype.Kf;Bj.prototype.getWidth=Bj.prototype.zh;Bj.prototype.setColor=Bj.prototype.Ah;Bj.prototype.setLineCap=Bj.prototype.ti;Bj.prototype.setLineDash=Bj.prototype.Bh;Bj.prototype.setLineJoin=Bj.prototype.ui;Bj.prototype.setMiterLimit=Bj.prototype.vi;Bj.prototype.setWidth=Bj.prototype.Ci;u("ol.style.Style",Hj,OPENLAYERS);
	Hj.prototype.getGeometry=Hj.prototype.J;Hj.prototype.getGeometryFunction=Hj.prototype.Af;Hj.prototype.getFill=Hj.prototype.Ch;Hj.prototype.getImage=Hj.prototype.Dh;Hj.prototype.getStroke=Hj.prototype.Eh;Hj.prototype.getText=Hj.prototype.Fh;Hj.prototype.getZIndex=Hj.prototype.Gh;Hj.prototype.setGeometry=Hj.prototype.xe;Hj.prototype.setZIndex=Hj.prototype.Hh;u("ol.style.Text",ao,OPENLAYERS);ao.prototype.getFont=ao.prototype.zf;ao.prototype.getOffsetX=ao.prototype.Lf;ao.prototype.getOffsetY=ao.prototype.Mf;
	ao.prototype.getFill=ao.prototype.Ih;ao.prototype.getRotation=ao.prototype.Jh;ao.prototype.getScale=ao.prototype.Kh;ao.prototype.getStroke=ao.prototype.Lh;ao.prototype.getText=ao.prototype.Mh;ao.prototype.getTextAlign=ao.prototype.Sf;ao.prototype.getTextBaseline=ao.prototype.Tf;ao.prototype.setFont=ao.prototype.oi;ao.prototype.setFill=ao.prototype.ni;ao.prototype.setRotation=ao.prototype.Nh;ao.prototype.setScale=ao.prototype.Oh;ao.prototype.setStroke=ao.prototype.xi;ao.prototype.setText=ao.prototype.yi;
	ao.prototype.setTextAlign=ao.prototype.zi;ao.prototype.setTextBaseline=ao.prototype.Ai;Gj.prototype.getOpacity=Gj.prototype.Dc;Gj.prototype.getRotateWithView=Gj.prototype.ic;Gj.prototype.getRotation=Gj.prototype.Ec;Gj.prototype.getScale=Gj.prototype.Fc;Gj.prototype.getSnapToPixel=Gj.prototype.kc;Gj.prototype.setOpacity=Gj.prototype.Gc;Gj.prototype.setRotation=Gj.prototype.Hc;Gj.prototype.setScale=Gj.prototype.Ic;Ai.prototype.getOpacity=Ai.prototype.Dc;Ai.prototype.getRotateWithView=Ai.prototype.ic;
	Ai.prototype.getRotation=Ai.prototype.Ec;Ai.prototype.getScale=Ai.prototype.Fc;Ai.prototype.getSnapToPixel=Ai.prototype.kc;Ai.prototype.setOpacity=Ai.prototype.Gc;Ai.prototype.setRotation=Ai.prototype.Hc;Ai.prototype.setScale=Ai.prototype.Ic;Hp.prototype.getOpacity=Hp.prototype.Dc;Hp.prototype.getRotateWithView=Hp.prototype.ic;Hp.prototype.getRotation=Hp.prototype.Ec;Hp.prototype.getScale=Hp.prototype.Fc;Hp.prototype.getSnapToPixel=Hp.prototype.kc;Hp.prototype.setOpacity=Hp.prototype.Gc;
	Hp.prototype.setRotation=Hp.prototype.Hc;Hp.prototype.setScale=Hp.prototype.Ic;
	  return OPENLAYERS.ol;
	}));
	
	
	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ }
/******/ ]);