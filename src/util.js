// Generated by CoffeeScript 1.4.0
(function() {
    var all, any, any_point, dimensions, origin_by_name, point,
        __slice = [].slice;

    Function.prototype.method = function(name, func) {
        this.prototype[name] = func;
        return this;
    };

    Function.method('curry', function() {
        var head,
        _this = this;
        head = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
        return function() {
            var tail;
            tail = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
            return _this.apply(null, head.concat(tail));
        };
    });

    Number.method('integer', function() {
        return Math[this < 0 ? 'ceil' : 'floor'](this);
    });

    if (typeof Object.create !== 'function') {
        Object.create = function(o) {
            var F;
            F = function() {};
            F.prototype = o;
            return new F();
        };
    }

    any = function(items) {
        var item, _i, _len;
        for (_i = 0, _len = items.length; _i < _len; _i++) {
            item = items[_i];
            if (item) {
                return true;
            }
        }
        return false;
    };

    all = function(items) {
        var item, _i, _len;
        for (_i = 0, _len = items.length; _i < _len; _i++) {
            item = items[_i];
            if (!item) {
                return false;
            }
        }
        return true;
    };

    any_point = {
        subtract: function(v) {
            return point(this.x - v.x, this.y - v.y);
        },
        joined: function(separator) {
            return [String(this.x), String(this.y)].join(separator);
        },
        csv: function() {
            return this.joined(',');
        }
    };

    point = function(x, y) {
        var that;
        that = Object.create(any_point);
        that.x = Number(x);
        that.y = Number(y);
        return that;
    };

    dimensions = function(box) {
        return point(box.width, box.height);
    };

    origin_by_name = function(parent, name) {
        var e;
        e = parent.find("\#" + name);
        return point(e.attr('x'), e.attr('y'));
    };

    lib.util = {
        any_point: any_point,
        point: point,
        dimensions: dimensions,
        origin_by_name: origin_by_name,
        any: any,
        all: all
    };

    lib.error = function(data) {
        data.toString = function() {
            return JSON.stringify(data);
        };
        return data;
    };

}).call(this);