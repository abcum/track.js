window.OPA = (function() {

    function exports(){};

    exports.prototype.lat = null;
    exports.prototype.lng = null;

    exports.prototype.auto = true;
    exports.prototype.find = false;

    exports.prototype.start = null;

    exports.prototype.domain = 'https://itsy.li';

    exports.prototype.conf = function() {

        var opts = window.OP || {};

        if (typeof opts.auto != 'undefined')
            this.auto = opts.auto;

        if (typeof opts.find != 'undefined')
            this.find = opts.find;

    };

    exports.prototype.init = function() {

        var self = this;

        // ------------------------------
        // Check config
        // ------------------------------

        self.conf();

        // ------------------------------
        // Check url
        // ------------------------------

        self.cors();

        // ------------------------------
        // Check url
        // ------------------------------

        self.load();

        // ------------------------------
        // Check location
        // ------------------------------

        self.locate();

        // ------------------------------
        // Save initial url
        // ------------------------------

        self.start = window.location.href;

        // ------------------------------
        // Replace pushState
        // ------------------------------

        if (this.auto && window.history) {

            var push = window.history.pushState;

            window.history.pushState = function(state) {

                if (push) push.apply(window.history, arguments);

                return (self.auto) ? self.track('page') : null;

            };

        }

        // ------------------------------
        // Replace replaceState
        // ------------------------------

        if (this.auto && window.history) {

            var repl = window.history.replaceState;

            window.history.replaceState = function(state) {

                if (repl) repl.apply(window.history, arguments);

                return (self.auto) ? self.track('page') : null;

            };

        }

        // ------------------------------
        // Replace onpopState
        // ------------------------------

        if (this.auto && window.history) {

            var onpp = window.onpopstate;

            window.onpopstate = function(state) {

                if (onpp) onpp.apply(window, arguments);

                if (self.start == window.location.href) return;

                return (self.auto) ? self.track('page') : null;

            };

        }

        // ------------------------------
        // Replace onhashchange
        // ------------------------------

        if (this.auto && "onhashchange" in window) {

            var hash = window.onhashchange;

            window.onhashchange = function() {

                if (hash) hash.apply(window, arguments);

                return (self.auto) ? self.track('hash') : null;

            };

        }

    };

    exports.prototype.load = function() {

        // ID has been embedded in the page

        if ( window.OPAID )
            this.identify( window.OPAID );

        // ID has been appended to URL

        if ( this.query('opa') )
            this.identify( this.query('opa') );

        // Came from a link

        if ( this.query('l') )
            return this.track('page', { l: this.query('l'), referer: document.referrer });

        // Came from an email

        if ( this.query('e') )
            return this.track('page', { e: this.query('e'), referer: document.referrer });

        // Came from nowhere special

        if ( this.auto )
            return this.track('page', { referer: document.referrer });

    };

    exports.prototype.send = function(url, object) {

        var http = new XMLHttpRequest();

        http.open("POST", url, false);

        http.send( JSON.stringify(object) );

    };

    exports.prototype.time = function() {

        return new Date().getTime();

    };

    exports.prototype.hash = function() {

        var all = document.getElementsByTagName('*');

        for (var i=0; i<all.length; i++) {

            if ( all[i].getAttribute('data-opa') ) return all[i].getAttribute('data-opa');

        }

    };

    exports.prototype.cors = function() {

        var img = new Image(1, 1);

        img.src = this.domain + '/uniq/' + this.uniq() + '/' + this.time() + '.gif';

    };

    exports.prototype.track = function(name, extra) {

        var object = {};

        // Name

        object.name = name;

        // Geo

        object.lat = this.lat;
        object.lng = this.lng;

        // Hash

        object.hash = this.hash();

        // Uniq

        object.sess = this.uniq();

        // Href

        object.href = window.location.href;


        // Save screen dimension info

        object.sw = window.screen.width;
        object.sh = window.screen.height;

        object.ww = window.innerWidth || document.documentElement.clientWidth || document.getElementsByTagName('body')[0].clientWidth;
        object.wh = window.innerHeight|| document.documentElement.clientHeight|| document.getElementsByTagName('body')[0].clientHeight;

        // Save all extra info

        if (extra) object.extra = extra;

        // Send result to server

        this.send(this.domain + '/track', object);

    };

    exports.prototype.identify = function(name) {

        if (!name) return;

        // Create object

        var object = {};

        // Check if this is an email

        object.name = ( name.indexOf('@') != -1 ) ? Base64.encode(name) : name;

        // Hash

        object.sess = this.uniq();

        // Send result to server

        this.send(this.domain + '/identify', object);

    };

    exports.prototype.uniq = function() {

        var key = 'opa';
        var val = Math.random().toString(36).slice(2);

        var c = this.getCookie(key);
        var s = this.getStorage(key);

        if (s && !c) this.setCookie(key, s);
        if (c && !s) this.setStorage(key, c);

        if (!c && !s && val) this.setCookie(key, val);
        if (!c && !s && val) this.setStorage(key, val);

        return c || s || val;

    };

    exports.prototype.locate = function() {

        if (this.find) {

            this.lat = this.getStorage('lat');
            this.lng = this.getStorage('lng');

            if ( !(this.lat && this.lng) ) this.geocode();

        }

    };

    exports.prototype.geocode = function() {

        if (window.navigator.geolocation) {

            var self = this;

            window.navigator.geolocation.getCurrentPosition(
                function(e) { self.geocoded(e); },
                function(e) { },
                {
                    enableHighAccuracy: true,
                    maximumAge: 365 * 24 * 60 * 60 * 1000,
                    timeout: 60 * 1000
                }
            );

        }

    };

    exports.prototype.geocoded = function(e) {

        this.lat = e.coords.latitude;
        this.lng = e.coords.longitude;

        this.setStorage('lat', this.lat);
        this.setStorage('lng', this.lng);

    };

    exports.prototype.getCookie = function(key) {
        var value = "; " + document.cookie;
        var parts = value.split("; " + name + "=");
        if (parts.length == 2) return parts.pop().split(";").shift();
    };

    exports.prototype.setCookie = function(key, value) {
        var date = new Date();
		date.setTime( date.getTime()+(5*365*24*60*60*1000) );
        document.cookie = key + "=" + value + "; expires=" + date.toGMTString() + "; path=/";
    };

    exports.prototype.getStorage = function(key) {
        if ('localStorage' in window) {
            return window.localStorage[key];
        }
    };

    exports.prototype.setStorage = function(key, value) {
        if ('localStorage' in window) {
            window.localStorage[key] = (typeof value === 'object') ? JSON.stringify(value) : value;
        }
    };

    exports.prototype.query = function(key) {

        var vars = window.location.search.substring(1).split('&');;

        for (var i = 0; i < vars.length; i++) {

            var pair = vars[i].split('=');

            if (decodeURIComponent(pair[0]) == key) {
                return decodeURIComponent(pair[1]);
            }

        }

    };

    return new exports();

})(); OPA.init();