/*
 * panorama360 - jQuery plugin
 * Created by Liviu Cerchez (http://liviucerchez.com/)
 */
(function(a) {
    a.fn.panorama360 = function(b) {
        function c(a) {
            return a.preventDefault(), !1
        }

        function d(a, b, c, d) {
            var e = parseInt(a.css("marginLeft")) + c;
            if (d.is360) e > 0 && (e = -b), -b > e && (e = 0);
            else {
                var f = -(b - a.parent().width());
                e > 0 && (e = 0, d.sliding_direction && (d.sliding_direction *= -1)), f > e && (e = f, d.sliding_direction && (d.sliding_direction *= -1))
            }
            a.css("marginLeft", e + "px")
        }

        function e(b, c, d, e) {
            var f = d / c;
            b.each(function() {
                switch (area_coord = a(this).data("coords"), stitch = a(this).data("stitch")) {
                    case 1:
                        a(this).css({
                            left: area_coord[0] * f + "px",
                            top: area_coord[1] * f + "px",
                            width: (area_coord[2] - area_coord[0]) * f + "px",
                            height: (area_coord[3] - area_coord[1]) * f + "px"
                        });
                        break;
                    case 2:
                        a(this).css({
                            left: e + parseInt(area_coord[0]) * f + "px",
                            top: area_coord[1] * f + "px",
                            width: (area_coord[2] - area_coord[0]) * f + "px",
                            height: (area_coord[3] - area_coord[1]) * f + "px"
                        })
                }
            })
        }
        return this.each(function() {
            var f = {
                start_position: 0,
                image_width: 0,
                image_height: 0,
                mouse_wheel_multiplier: 10,
                bind_resize: !0,
                is360: !0,
                sliding_controls: !1,
                sliding_direction: 0,
                sliding_interval: 8,
                use_preloader: !0
            };
            b && a.extend(f, b);
            var g = a(this),
                h = g.children(".panorama-container"),
                i = h.children("img:first-child");
            if (f.use_preloader) {
                g.css("display", "none");
                var j = g.parent().find(".preloader");
                0 == j.length && (j = a('<div class="preloader"></div>').insertAfter(g)), jQuery(window).load(function() {
                    g.show(), j.hide()
                })
            }
            if (!(0 >= f.image_width && 0 >= f.image_height) || (f.image_width = parseInt(i.data("width")), f.image_height = parseInt(i.data("height")), f.image_width && f.image_height)) {
                var o, k = f.image_height / f.image_width,
                    l = parseInt(g.height()),
                    m = parseInt(l / k),
                    n = i.attr("usemap"),
                    p = !1,
                    q = 0,
                    r = 0,
                    s = !1;
                if (f.is360 && i.removeAttr("usemap").css("left", 0).clone().css("left", m + "px").insertAfter(i), h.css({
                    "margin-left": "-" + f.start_position + "px",
                    width: 2 * m + "px",
                    height: l + "px"
                }), setInterval(function() {
                    return p ? !1 : (-2 > r || r > 2 ? r *= .98 : r = f.sliding_direction ? 2 * -f.sliding_direction : 0, r && d(h, m, r, f), void 0)
                }, f.sliding_interval), g.unbind("mousedown mouseup mousemove mouseout mousewheel contextmenu touchmove touchend"), g.mousedown(function(b) {
                    return p ? !1 : (a(this).addClass("grab"), p = !0, q = b.clientX, scrollOffset = 0, !1)
                }).mouseup(function() {
                    return a(this).removeClass("grab"), p = !1, r = .45 * r, f.sliding_direction = 0, !1
                }).mousemove(function(a) {
                    return p ? (r = parseInt(a.clientX - q), q = a.clientX, d(h, m, r, f), !1) : !1
                }).mouseout(function() {
                    p = !1
                }).bind("mousewheel", function(a, b) {
                    var c = Math.ceil(Math.sqrt(Math.abs(b)));
                    return 0 != f.sliding_direction && (f.sliding_direction = 0 > b ? 1 : -1), c = 0 > b ? -c : c, r += 5 * c, d(h, m, c * f.mouse_wheel_multiplier, f), f.sliding_direction = 0, !1
                }).bind("contextmenu", c).bind("touchstart", function(a) {
                    return p ? !1 : (p = !0, q = a.originalEvent.touches[0].pageX, scrollOffset = 0, void 0)
                }).bind("touchmove", function(a) {
                    if (a.preventDefault(), !p) return !1;
                    var b = a.originalEvent.touches[0].pageX;
                    r = parseInt(b - q), q = b, d(h, m, r, f)
                }).bind("touchend", function() {
                    p = !1, f.sliding_direction && (f.sliding_direction = r > 0 ? -1 : 1), r = .45 * r, f.sliding_direction = 0
                }), n && (0 > n.indexOf("#") && (n = "#" + n), new_area = a("a").addClass("area"), a("map" + n, h).children("area").each(function() {
                    switch (a(this).attr("shape").toLowerCase()) {
                        case "rect":
                            var b = a(this).attr("coords").split(","),
                                c = a(document.createElement("a")).addClass("area").attr("href", a(this).attr("href")).attr("title", a(this).attr("alt"));
                            c.addClass(a(this).attr("class")), h.append(c.data("stitch", 1).data("coords", b)), h.append(c.clone().data("stitch", 2).data("coords", b))
                    }
                }), a("map" + n, h).remove(), o = h.children(".area"), o.mouseup(c).mousemove(c).mousedown(c), e(o, f.image_height, l, m)), f.sliding_controls) {
                    var t = g.parent().find(".controls");
                    if (0 == t.length) {
                        var t = a('<div class="controls"></div>').insertAfter(g);
                        a('<a class="prev"><span>&#9664;</span></a>').click(function(a) {
                            f.sliding_direction = -1, a.preventDefault()
                        }).appendTo(t), a('<a class="stop"><span>&#8718</span></a>').click(function(a) {
                            f.sliding_direction = 0, a.preventDefault()
                        }).appendTo(t), a('<a class="next"><span>&#9654;</span></a>').click(function(a) {
                            f.sliding_direction = 1, a.preventDefault()
                        }).appendTo(t)
                    }
                }
                if (f.bind_resize && !s && (s = !0, a(window).resize(function() {
                    $parent = g.parent(), l = parseInt($parent.height()), m = parseInt(l / k), h.css({
                        width: 2 * m + "px",
                        height: l + "px"
                    }), i.css("left", 0).next().css("left", m + "px"), n && e(o, f.image_height, l, m)
                })), f.loaded && a.isFunction(loaded) && f.loaded(), f.callback && a.isFunction(f.callback)) {
                    var u = 0;
                    a(".panorama-container img").load(function() {
                        u += 1, 2 == u && f.callback()
                    })
                }
            }
        })
    }
})(jQuery);
