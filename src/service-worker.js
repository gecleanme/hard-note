if (!self.define) {
    let e, s = {};
    const r = (r, n) => (r = new URL(r + ".js", n).href, s[r] || new Promise((s => {
        if ("document" in self) {
            const e = document.createElement("script");
            e.src = r, e.onload = s, document.head.appendChild(e)
        } else e = r, importScripts(r), s()
    })).then((() => {
        let e = s[r];
        if (!e) throw new Error(`Module ${r} didn’t register its module`);
        return e
    })));
    self.define = (n, i) => {
        const o = e || ("document" in self ? document.currentScript.src : "") || location.href;
        if (s[o]) return;
        let t = {};
        const c = e => r(e, o), l = {module: {uri: o}, exports: t, require: c};
        s[o] = Promise.all(n.map((e => l[e] || c(e)))).then((e => (i(...e), t)))
    }
}
define(["./workbox-5b385ed2"], (function (e) {
    "use strict";
    e.setCacheNameDetails({prefix: "Hard Note"}), self.addEventListener("message", (e => {
        e.data && "SKIP_WAITING" === e.data.type && self.skipWaiting()
    })), e.precacheAndRoute([{url: "/css/app.3fd85b7f.css", revision: null}, {
        url: "/index.html",
        revision: "00737e085cda2bc9f5c928f09d531571"
    }, {url: "/js/app.20ea3612.js", revision: null}, {
        url: "/js/chunk-vendors.cc51a115.js",
        revision: null
    }, {url: "/manifest.json", revision: "69017745e7808b0c617ac480d4144088"}, {
        url: "/robots.txt",
        revision: "b6216d61c03e6ce0c9aea6ca7808f7ca"
    }], {})
}));
//# sourceMappingURL=service-worker.js.map
