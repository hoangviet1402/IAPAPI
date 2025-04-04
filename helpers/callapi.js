var lbActivity = {
    modal: "#popup-activity",
    isShowDetail: !1,
    EventClose: null,
    element: {
        class: {
            header: ".ohyea__modal_header",
            body: ".ohyea__modal_body",
            content: ".ohyea__modal_content",
            dialog: ".ohyea__modal_dialog"
        }
    },
    showPopupActivity: function(e) {
        lbActivity.EventClose = e;
        var i = [{
            Code: 0,
            Action: lbActivity.init,
            IsCallback: !0
        }];
        lbDataHelper.loadData(lbDataHelper.METHOD.ACTIVITY, {}, i, lbActivity.EventClose)
    },
    init: function(e) {
        var i = '<div class="popup-content container-popup-activity"><div class="popup-activity-top-bar"><button type="button" class="popup-btn-close" onclick="lbActivity.closePopupActive()"></button></div><div class="popup-activity-body" style="justify-content: center;"><div class="activity-body-right-frame"><div class="title"><span>' + Language.Activity + '</span></div><div id="slide-game-now" class="slide-game">' + lbActivity.renderListGame(e.no, "now") + '</div></div></div><div class="popup-activity-footer"><div class="DontShow"><input type="checkbox" id="dontShowTodayActivity" name="dontShowToday" value="dontShowToday"><label for="dontShowToday">' + Language.Tournament_dontShow + "</label></div></div></div>";
        $(lbActivity.modal + " .modal-body").html(i), $(lbActivity.modal).modal("show"), $(lbActivity.element.class.header).show(), lbActivity.init_activity_slide("slide-game-now"), lbActivity.updateCheckboxState(), lbActivity.checkSlideGame(), lbActivity.initListener()
    },
    initListener: function() {
        $(lbActivity.modal).on("hidden.bs.modal", (function(e) {
            "function" == typeof lbActivity.EventClose && lbActivity.EventClose(), lbActivity.EventClose = null
        })), $("#dontShowTodayActivity").change((function() {
            this.checked ? lbActivity.setCookie("hidePopupActivity", "true") : document.cookie = "hidePopupActivity=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;"
        }))
    },
    closePopupActive: function() {
        $(lbActivity.modal).modal("hide")
    },
    checkEventOceanKing: function(e) {
        var i = e,
            t = i.findIndex((e => 500 == e.gid));
        if (-1 != t) {
            var a = i[t],
                l = {
                    ti: a.ti,
                    gid: -1,
                    rew: a.rew,
                    url: a.url,
                    iwv: a.iwv
                },
                n = {
                    ti: a.ti,
                    gid: -111,
                    rew: a.rew,
                    url: a.url,
                    iwv: a.iwv
                };
            i.splice(t, 1, l, n)
        }
        return i
    },
    renderListGame: function(e, i) {
        for (var t = lbActivity.checkEventOceanKing(e), a = "", l = 0; l < t.length; l++) {
            var n = t[l];
            a += lbActivity.getGame(n, i)
        }
        return a
    },
    getGame: function(e, i) {
        if (!e) return "";
        var t, a, l, n, s = "";
        e.img && (t = e.img), e.url && (n = e.url);
        for (var c = JSON.parse(JSON.stringify(lbConfig.Games)), o = 0; o < c.length; o++) {
            for (var d = c[o].list, r = 0; r < d.length; r++) {
                var m = d[r];
                if (m.gameId === e.gid) {
                    t || (t = lb.getLinkImageNagaGameLanguage(m.image)), a = m.alt, 500 === e.gid ? 
                    (t = "http://pc.kingplay.net/content/Images/web/en/atlantic-king-event.png?v=151", l = "lbActivity.showRoomOceanking1('/fishing?id=200&type=1', '/fishing?id=200&type=0')") :
                    600 === e.gid ? (t = "/Content/images/game/en/ocean-king.png", l = "lb.checkLoginBeforeCall('/fishing?id=200&type=1')") : 
                    l = m.action, n = "ClientWebHelper.ShowPopupEventDetail(" + m.guideId + ")";
                    break
                }
            }
            if (a && l && n) break
        }
        return "now" === i && 1 == m.visible ? s = '<div class="frame-game-now" data-game-id="' + e.gid + '" style="z-index: 4; position: relative;"><div class="game-time"><span>' + e.ti + '</span></div><div class="game-image"><img src="/Content/images/game/en/' + m.image + '.png" alt="' + a + '" onclick="' + l + '"><div class="game-dictionary" onclick="' + n + '" ' + (lbActivity.isShowDetail ? "" : ' style="display: none;"') + '></div></div><div class="game-reward"><span>' + lbHelper.formatNumber(e.rew) + '</span></div><div class="game-btn-go"' + (l ? "" : ' style="display: none;"') + '><span onclick="' + l + '">' + Language.Activity_GO + "</span></div></div>" : "next" === i && 1 == m.visible && (s = '<div class="frame-game-next" data-game-id="' + e.gid + '" style="z-index: 4;"><div class="game-time"><span>' + e.ti + '</span></div><div class="game-image"><img src="' + t + '" alt="' + a + '"><div class="game-dictionary" onclick="' + n + '" ' + (lbActivity.isShowDetail ? "" : ' style="display: none;"') + '></div></div><div class="game-reward"><span>' + lbHelper.formatNumber(e.rew) + '</span></div><div class="game-text"><span>' + Language.Activity_COMINGSOON + "</span></div></div>"), s
    },
    init_activity_slide: function(e) {
        var i = !1,
            a = 0,
            l = 0,
            n = $("#" + e);
        t = $(".popup-tour .slide .slide-left"), s = $(".popup-tour .slide .slide-right"), n && 0 < n.length && (n[0].addEventListener("mousedown", (function(e) {
            i = !0, a = e.clientX, l = e.clientY
        })), n[0].addEventListener("touchstart", (function(e) {
            i = !0, e.changedTouches && 0 < e.changedTouches.length && (a = e.changedTouches[0].clientX, l = e.changedTouches[0].clientY)
        })), n[0].addEventListener("mousemove", (function(e) {
            if (i) {
                var c = e.clientX - a,
                    o = e.clientY - l;
                n[0].scrollLeft -= c, n[0].scrollTop -= o, a = e.clientX, l = e.clientY, n[0].scrollLeft < 100 ? t && 0 < t.length && -1 === t[0].className.search("disabled") && (t[0].className += " disabled") : t && 0 < t.length && (t[0].className = t[0].className.replace(/ disabled/g, "")), n[0].scrollLeft + n[0].clientWidth > n[0].scrollWidth - 100 ? s && 0 < s.length && -1 === s[0].className.search("disabled") && (s[0].className += " disabled") : s && 0 < s.length && (s[0].className = s[0].className.replace(/ disabled/g, ""))
            }
        })), n[0].addEventListener("touchmove", (function(e) {
            if (i && e.changedTouches && 0 < e.changedTouches.length) {
                var c = e.changedTouches[0].clientX - a,
                    o = e.changedTouches[0].clientY - l;
                lb.scale.isVerticalScreen ? (n[0].scrollLeft -= o, n[0].scrollTop += c) : (n[0].scrollLeft -= c, n[0].scrollTop -= o), e.cancelable && n[0].scrollTop <= 0 && 0 < o && e.preventDefault(), e.cancelable && n[0].scrollHeight - n[0].scrollTop <= n[0].clientHeight && o < 0 && e.preventDefault(), a = e.changedTouches[0].clientX, l = e.changedTouches[0].clientY, n[0].scrollLeft < 100 ? t && 0 < t.length && -1 === t[0].className.search("disabled") && (t[0].className += " disabled") : t && 0 < t.length && (t[0].className = t[0].className.replace(/ disabled/g, "")), n[0].scrollLeft + n[0].clientWidth > n[0].scrollWidth - 100 ? s && 0 < s.length && -1 === s[0].className.search("disabled") && (s[0].className += " disabled") : s && 0 < s.length && (s[0].className = s[0].className.replace(/ disabled/g, ""))
            }
        })), n[0].addEventListener("mouseup", (function(e) {
            i = !1
        })), n[0].addEventListener("touchend", (function(e) {
            i = !1
        })), n[0].addEventListener("mouseleave", (function(e) {
            i = !1
        })), n[0].addEventListener("touchcancel", (function(e) {
            i = !1
        })), n[0].addEventListener("dragstart", (function(e) {
            i = !1
        }))), t && 0 < t.length && (t[0].className += " disabled", t[0].addEventListener("click", (function(e) {
            n && 0 < n.length && (n[0].scrollLeft -= 180, n[0].scrollLeft < 100 ? t && 0 < t.length && -1 === t[0].className.search("disabled") && (t[0].className += " disabled") : t && 0 < t.length && (t[0].className = t[0].className.replace(/ disabled/g, "")), n[0].scrollLeft + n[0].clientWidth > n[0].scrollWidth - 100 ? s && 0 < s.length && -1 === s[0].className.search("disabled") && (s[0].className += " disabled") : s && 0 < s.length && (s[0].className = s[0].className.replace(/ disabled/g, "")))
        }))), s && 0 < s.length && s[0].addEventListener("click", (function(e) {
            n && 0 < n.length && (n[0].scrollLeft += 180, n[0].scrollLeft < 100 ? t && 0 < t.length && -1 === t[0].className.search("disabled") && (t[0].className += " disabled") : t && 0 < t.length && (t[0].className = t[0].className.replace(/ disabled/g, "")), n[0].scrollLeft + n[0].clientWidth > n[0].scrollWidth - 100 ? s && 0 < s.length && -1 === s[0].className.search("disabled") && (s[0].className += " disabled") : s && 0 < s.length && (s[0].className = s[0].className.replace(/ disabled/g, "")))
        }))
    },
    setCookie: function(e, i) {
        var t = new Date,
            a = new Date(t.getFullYear(), t.getMonth(), t.getDate(), 23, 59, 59, 999);
        document.cookie = e + "=" + i + ";expires=" + a.toUTCString() + ";path=/"
    },
    updateCheckboxState: function() {
        var e = document.getElementById("dontShowTodayActivity");
        e && !lbHelper.isElementDefined(e) && (document.cookie.includes("hidePopupActivity=true") ? e.checked = !0 : e.checked = !1)
    },
    showRoomOceanking1: function(e, i) {
        var t = $(".frame-game-now[data-game-id=500]");
        if (lbHelper.isElementDefined(t)) {
            var a = t.find(".icon-room-normal");
            lbHelper.isElementDefined(a) || (a = $('<div class="ocean-king icon-room-normal" style="margin-left: 30px;"><span class="text"></span></div>'), t.append(a)), a.find(".text").html(Language.RoomNormal), a.unbind("click"), a.click((function() {
                lb.isUserMy() ? lbActivity.checkMinCoinRoomGame(lbConfig.MinCoinRoomFishingMy, e) : lb.checkLoginBeforeCall(e)
            }));
            var l = t.find(".icon-room-vip");
            lbHelper.isElementDefined(l) || (l = $('<div class="ocean-king icon-room-vip" style="margin-right: 30px;"><span class="text"></span></div>'), t.append(l)), l.find(".text").html(Language.RoomVip), l.unbind("click"), l.click((function() {
                lbActivity.checkMinCoinRoomGame(1e5, i)
            }));
            var n = t.find(".icon");
            lbHelper.isElementDefined(n) && n.addClass("disabled");
            var s = t.find(".new");
            lbHelper.isElementDefined(s) && s.addClass("disabled")
        }
    },
    checkMinCoinRoomGame: function(e, i) {
        if (lb.isLogged()) {
            var t = !0;
            if (lb.isUserMy() && (0 === e && (e = lbConfig.MinCoinRoomFishingMy), 0 === lb.userData.Vip.Point && (t = !1)), lb.userData.Coin >= e && !0 === t) {
                if (lbHelper.isUndefinedOrNull(i)) return;
                if (lbHelper.isFunction(i)) return void callback();
                lbHelper.callFunctionFromString(i)
            } else {
                var a = $("#lb_md_noti_recharge .noti-message");
                if (lbHelper.isElementDefined(a)) {
                    var l = lbHelper.formatNumber(e);
                    a.html(lbHelper.formatString(Language.NotEnoughtCoin, l))
                }
                PopupOhYea.Hide(), lb.popup.show("#lb_md_noti_recharge")
            }
        } else lb.popup.showPopupLogin()
    },
    checkSlideGame: function() {
        var e = document.getElementById("slide-game-now");
        e.childElementCount < 3 && e.classList.add("frame-game-center")
    },
    checkShowActivity: function(e) {
        !document.cookie.includes("hidePopupActivity=true") ? lbActivity.showPopupActivity(e) : "function" == typeof e && e()
    }
};