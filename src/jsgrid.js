/*
 * JsGrid
 *
 * Copyright (c) 2014
 * Licensed under the MIT license.
 */


(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(['jquery'], factory);
    } else if (typeof exports === 'object') {
        // Node.
        module.exports = factory(require('jquery'));
    } else {
        factory(root.jQuery);
    }
}(this, function ($) {

    function JsGrid(el, options) {
        this.init(el, options);
    }

    JsGrid.OPTIONS = {
        sel_content: '[data-js-grid-item]',
        sel_exclude: '.fixed-ratio',
        throttleDelay: 100
    };

    JsGrid.prototype = {
        grid: null,
        numColumns: 0,
        init: function (el, options) {
            this.opt = $.extend({}, JsGrid.OPTIONS, options);
            this.$container = $(el);
            this.$items = this.$container.find(this.opt.sel_content);
            this.update();

            $(window).on('resize', $.proxy(this.update, this).throttle(this.opt.throttleDelay));
        },

        update: function () {
            var self = this;
            // only works if the number of columns doesn't change
            if (self.grid && self._countColumns() === self.numColumns) {
                // if the column count is the same just go through the previously built arrays
                self._refresh();
            } else {
                // if the column count has changed we need to recalculate
                self._build();
            }

        },

        _countColumns: function () {
            var posY, prevPosY, numColumns = 0;

            if (this.$items.length) {
                this.$items.each(function (i, el) {
                    posY = $(el).position().top;

                    if ((typeof prevPosY === 'undefined') || posY === prevPosY) {
                        numColumns++;
                        prevPosY = posY;
                    } else {
                        return true;
                    }
                });
            }
            return numColumns;
        },

        _refresh: function () {
            var self = this, g = this.grid, row = 0, col = 0, tallest = 0, h;

            this.$items.css('height', '');

            for (var y = 0, ly = g.length; y < ly; y++) {
                row = g[y];
                tallest = 0;
                for (var x = 0, lx = g[y].length; x < lx; x++) {
                    col = g[y][x];
                    h = $(col).height();
                    tallest = tallest < h ? h : tallest;
                }
                $(g[y]).not(self.opt.sel_exclude).height(tallest);
            }
        },

        _build: function () {
            this.grid = [
                []
            ];

            var self = this,
                $items = this.$items,
                numColumns = this._countColumns(),
                row = 0,
                col = 0,
                tallest = 0;

            $items.css('height', '');
            if (numColumns === 0) {
                return;
            }

            $items.each(function (i, el) {
                var $el = $(el),
                    itemH = $el.height();

                col = i % numColumns;

                // row is finished when we reach a 0 column
                if (col === 0 && i !== 0) {
                    // set heights on finished row
                    $(self.grid[row]).not(self.opt.sel_exclude).height(tallest);

                    // create new row
                    row++;
                    tallest = 0;
                    self.grid.push([]);
                }

                tallest = tallest < itemH ? itemH : tallest;
                self.grid[row].push(el);
            });
            $(self.grid[row]).not(self.opt.sel_exclude).height(tallest);

            self.numColumns = numColumns;
        },

        destroy: function () {
            this.$items.css('height', '');
        }
    };

    if (typeof $.createPlugin === 'function') {
        $.createPlugin('jsGrid', JsGrid);
    } else {
        $.fn.jsGrid = function (options) {
            return this.each(function (i, el) {
                return new JsGrid(el, options);
            });
        };
    }

    // Throttle resize callbacks
    if (!Function.prototype.throttle) {
        Function.prototype.throttle = function (wait, options) {
            var func = this, context, args, result, timeout = null, previous = 0;

            options || (options = {});

            var later = function () {
                previous = options.leading === false ? 0 : new Date();
                timeout = null;
                result = func.apply(context, args);
            };

            return function () {
                var now = new Date();
                if (!previous && options.leading === false) previous = now;
                var remaining = wait - (now - previous);
                context = this;
                args = arguments;
                if (remaining <= 0) {
                    clearTimeout(timeout);
                    timeout = null;
                    previous = now;
                    result = func.apply(context, args);
                } else if (!timeout && options.trailing !== false) {
                    timeout = setTimeout(later, remaining);
                }
                return result;
            };
        };
    }


}));