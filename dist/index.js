import { ref as z, readonly as ie, defineComponent as oe, computed as F, watch as Q, onMounted as fe, onUnmounted as me, createBlock as le, openBlock as v, Teleport as he, createVNode as ae, Transition as ge, withCtx as ye, createElementBlock as p, createCommentVNode as E, withModifiers as ee, createElementVNode as t, toDisplayString as j, withDirectives as ze, normalizeStyle as G, vShow as $e, Fragment as te, renderList as ce, normalizeClass as W, unref as f, createStaticVNode as Me, createTextVNode as de } from "vue";
const ne = z(!1), xe = z([]), be = z(0);
let we = null;
function Ce() {
  function d(x) {
    we = x;
  }
  function S() {
    return we;
  }
  function o(x, n = 0) {
    xe.value = x, be.value = n, ne.value = !0;
  }
  function c() {
    ne.value = !1;
  }
  function r(x, n) {
    o([{ url: x, alt: n }], 0);
  }
  return {
    // State (readonly to prevent external mutation)
    isOpen: ie(ne),
    images: ie(xe),
    initialIndex: ie(be),
    // Actions
    openViewer: o,
    closeViewer: c,
    openImage: r,
    setVariantFetcher: d,
    getVariantFetcher: S,
    // For the provider component
    _setOpen: (x) => {
      ne.value = x;
    }
  };
}
const Se = { class: "viewer-toolbar top" }, Ue = {
  key: 0,
  class: "image-counter"
}, Le = { class: "image-container" }, Ee = {
  key: 0,
  class: "loading-spinner"
}, Ie = {
  key: 1,
  class: "error-state"
}, Ae = ["src", "alt"], Pe = {
  key: 2,
  class: "loading-variants"
}, Re = { class: "viewer-toolbar bottom" }, Fe = { class: "zoom-controls" }, Oe = {
  key: 2,
  class: "thumbnail-strip"
}, je = ["onClick"], De = ["src", "alt"], Be = 0.5, Te = 5, ke = 0.25, He = /* @__PURE__ */ oe({
  __name: "ImageViewer",
  props: {
    images: {},
    initialIndex: { default: 0 },
    open: { type: Boolean }
  },
  emits: ["close", "indexChange"],
  setup(d, { emit: S }) {
    const o = d, c = S, { getVariantFetcher: r } = Ce(), x = z(o.initialIndex), n = z(1), P = z(0), A = z(0), H = z(!1), T = z({ x: 0, y: 0 }), Z = z(!0), D = z(!1), $ = z(!1), M = z(/* @__PURE__ */ new Map()), u = F(() => o.images[x.value]), s = F(() => {
      const e = u.value;
      if (!e) return null;
      if (e.fileId && M.value.has(e.fileId)) {
        const b = M.value.get(e.fileId);
        return { ...e, variants: b };
      }
      return e;
    }), C = F(() => {
      var b, N, q, B, se;
      const e = s.value;
      if (!e) return "";
      if (e.variants) {
        if ((b = e.variants.lg) != null && b.url) return e.variants.lg.url;
        if ((N = e.variants.original) != null && N.url) return e.variants.original.url;
        if ((q = e.variants.md) != null && q.url) return e.variants.md.url;
        if ((B = e.variants.sm) != null && B.url) return e.variants.sm.url;
        if ((se = e.variants.thumb) != null && se.url) return e.variants.thumb.url;
      }
      return e.url;
    }), w = F(() => o.images.length > 1), g = F(() => x.value > 0), k = F(() => x.value < o.images.length - 1);
    Q(x, () => {
      n.value = 1, P.value = 0, A.value = 0, Z.value = !0, D.value = !1, c("indexChange", x.value);
    }), Q(() => o.open, (e) => {
      e ? (x.value = o.initialIndex, n.value = 1, P.value = 0, A.value = 0, Z.value = !0, D.value = !1, document.body.style.overflow = "hidden", U()) : document.body.style.overflow = "";
    }), Q(u, () => {
      U();
    });
    async function U() {
      var N, q;
      const e = u.value;
      if (!(e != null && e.fileId) || M.value.has(e.fileId) || (N = e.variants) != null && N.lg || (q = e.variants) != null && q.original) return;
      const b = r();
      if (b) {
        $.value = !0;
        try {
          const B = await b(e.fileId);
          B && M.value.set(e.fileId, B);
        } catch (B) {
          console.error("Failed to fetch variants:", B);
        } finally {
          $.value = !1;
        }
      }
    }
    function i() {
      g.value && x.value--;
    }
    function m() {
      k.value && x.value++;
    }
    function h(e) {
      e >= 0 && e < o.images.length && (x.value = e);
    }
    function y() {
      n.value = Math.min(Te, n.value + ke);
    }
    function L() {
      n.value = Math.max(Be, n.value - ke), n.value <= 1 && (P.value = 0, A.value = 0);
    }
    function R() {
      n.value = 1, P.value = 0, A.value = 0;
    }
    function Y(e) {
      e.preventDefault(), e.deltaY < 0 ? y() : L();
    }
    function V(e) {
      if (n.value <= 1) return;
      H.value = !0;
      const b = "touches" in e ? e.touches[0] : e;
      T.value = { x: b.clientX - P.value, y: b.clientY - A.value };
    }
    function K(e) {
      if (!H.value) return;
      e.preventDefault();
      const b = "touches" in e ? e.touches[0] : e;
      P.value = b.clientX - T.value.x, A.value = b.clientY - T.value.y;
    }
    function J() {
      H.value = !1;
    }
    function _(e) {
      if (o.open)
        switch (e.key) {
          case "Escape":
            c("close");
            break;
          case "ArrowLeft":
            i();
            break;
          case "ArrowRight":
            m();
            break;
          case "+":
          case "=":
            y();
            break;
          case "-":
            L();
            break;
          case "0":
            R();
            break;
        }
    }
    async function I() {
      if (s.value)
        try {
          const e = C.value, N = await (await fetch(e)).blob(), q = URL.createObjectURL(N), B = document.createElement("a");
          B.href = q, B.download = s.value.alt || `image-${x.value + 1}`, document.body.appendChild(B), B.click(), document.body.removeChild(B), URL.revokeObjectURL(q);
        } catch (e) {
          console.error("Failed to download image:", e);
        }
    }
    function O() {
      Z.value = !1;
    }
    function X() {
      Z.value = !1, D.value = !0;
    }
    function l(e) {
      e.target.classList.contains("viewer-backdrop") && c("close");
    }
    fe(() => {
      window.addEventListener("keydown", _);
    }), me(() => {
      window.removeEventListener("keydown", _), document.body.style.overflow = "";
    });
    const a = F(() => ({
      transform: `scale(${n.value}) translate(${P.value / n.value}px, ${A.value / n.value}px)`,
      cursor: n.value > 1 ? H.value ? "grabbing" : "grab" : "default"
    }));
    return (e, b) => (v(), le(he, { to: "body" }, [
      ae(ge, { name: "viewer" }, {
        default: ye(() => {
          var N;
          return [
            d.open ? (v(), p("div", {
              key: 0,
              class: "viewer-backdrop",
              onClick: l,
              onWheel: ee(Y, ["prevent"])
            }, [
              t("button", {
                class: "viewer-btn close-btn",
                onClick: b[0] || (b[0] = (q) => c("close")),
                title: "Close (Esc)"
              }, [...b[1] || (b[1] = [
                t("svg", {
                  viewBox: "0 0 24 24",
                  fill: "none",
                  stroke: "currentColor",
                  "stroke-width": "2"
                }, [
                  t("path", { d: "M18 6L6 18M6 6l12 12" })
                ], -1)
              ])]),
              t("div", Se, [
                w.value ? (v(), p("span", Ue, j(x.value + 1) + " / " + j(d.images.length), 1)) : E("", !0)
              ]),
              w.value && g.value ? (v(), p("button", {
                key: 0,
                class: "viewer-btn nav-btn prev",
                onClick: ee(i, ["stop"]),
                title: "Previous (←)"
              }, [...b[2] || (b[2] = [
                t("svg", {
                  viewBox: "0 0 24 24",
                  fill: "none",
                  stroke: "currentColor",
                  "stroke-width": "2"
                }, [
                  t("path", { d: "M15 18l-6-6 6-6" })
                ], -1)
              ])])) : E("", !0),
              w.value && k.value ? (v(), p("button", {
                key: 1,
                class: "viewer-btn nav-btn next",
                onClick: ee(m, ["stop"]),
                title: "Next (→)"
              }, [...b[3] || (b[3] = [
                t("svg", {
                  viewBox: "0 0 24 24",
                  fill: "none",
                  stroke: "currentColor",
                  "stroke-width": "2"
                }, [
                  t("path", { d: "M9 18l6-6-6-6" })
                ], -1)
              ])])) : E("", !0),
              t("div", Le, [
                Z.value ? (v(), p("div", Ee, [...b[4] || (b[4] = [
                  t("div", { class: "spinner" }, null, -1)
                ])])) : E("", !0),
                D.value ? (v(), p("div", Ie, [...b[5] || (b[5] = [
                  t("svg", {
                    viewBox: "0 0 24 24",
                    fill: "none",
                    stroke: "currentColor",
                    "stroke-width": "2"
                  }, [
                    t("circle", {
                      cx: "12",
                      cy: "12",
                      r: "10"
                    }),
                    t("path", { d: "M12 8v4M12 16h.01" })
                  ], -1),
                  t("span", null, "Failed to load image", -1)
                ])])) : E("", !0),
                ze(t("img", {
                  src: C.value,
                  alt: ((N = s.value) == null ? void 0 : N.alt) || "Image",
                  style: G(a.value),
                  class: "viewer-image",
                  draggable: "false",
                  onLoad: O,
                  onError: X,
                  onMousedown: V,
                  onMousemove: K,
                  onMouseup: J,
                  onMouseleave: J,
                  onTouchstart: V,
                  onTouchmove: K,
                  onTouchend: J
                }, null, 44, Ae), [
                  [$e, !D.value]
                ]),
                $.value ? (v(), p("div", Pe, " Loading full resolution... ")) : E("", !0)
              ]),
              t("div", Re, [
                t("div", Fe, [
                  t("button", {
                    class: "viewer-btn small",
                    onClick: L,
                    title: "Zoom out (-)"
                  }, [...b[6] || (b[6] = [
                    t("svg", {
                      viewBox: "0 0 24 24",
                      fill: "none",
                      stroke: "currentColor",
                      "stroke-width": "2"
                    }, [
                      t("circle", {
                        cx: "11",
                        cy: "11",
                        r: "8"
                      }),
                      t("path", { d: "M21 21l-4.35-4.35M8 11h6" })
                    ], -1)
                  ])]),
                  t("span", {
                    class: "zoom-level",
                    onClick: R,
                    title: "Reset zoom (0)"
                  }, j(Math.round(n.value * 100)) + "% ", 1),
                  t("button", {
                    class: "viewer-btn small",
                    onClick: y,
                    title: "Zoom in (+)"
                  }, [...b[7] || (b[7] = [
                    t("svg", {
                      viewBox: "0 0 24 24",
                      fill: "none",
                      stroke: "currentColor",
                      "stroke-width": "2"
                    }, [
                      t("circle", {
                        cx: "11",
                        cy: "11",
                        r: "8"
                      }),
                      t("path", { d: "M21 21l-4.35-4.35M11 8v6M8 11h6" })
                    ], -1)
                  ])])
                ]),
                t("button", {
                  class: "viewer-btn small",
                  onClick: I,
                  title: "Download"
                }, [...b[8] || (b[8] = [
                  t("svg", {
                    viewBox: "0 0 24 24",
                    fill: "none",
                    stroke: "currentColor",
                    "stroke-width": "2"
                  }, [
                    t("path", { d: "M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3" })
                  ], -1)
                ])])
              ]),
              w.value && d.images.length <= 20 ? (v(), p("div", Oe, [
                (v(!0), p(te, null, ce(d.images, (q, B) => (v(), p("button", {
                  key: B,
                  class: W(["thumbnail", { active: B === x.value }]),
                  onClick: (se) => h(B)
                }, [
                  t("img", {
                    src: q.thumbnail || q.url,
                    alt: `Thumbnail ${B + 1}`
                  }, null, 8, De)
                ], 10, je))), 128))
              ])) : E("", !0)
            ], 32)) : E("", !0)
          ];
        }),
        _: 1
      })
    ]));
  }
}), re = (d, S) => {
  const o = d.__vccOpts || d;
  for (const [c, r] of S)
    o[c] = r;
  return o;
}, Ze = /* @__PURE__ */ re(He, [["__scopeId", "data-v-1fa5ee85"]]), pa = /* @__PURE__ */ oe({
  __name: "ImageViewerProvider",
  setup(d) {
    const { isOpen: S, images: o, initialIndex: c, _setOpen: r } = Ce(), x = F(() => [...o.value]);
    function n() {
      r(!1);
    }
    return (P, A) => (v(), le(Ze, {
      images: x.value,
      "initial-index": f(c),
      open: f(S),
      onClose: n
    }, null, 8, ["images", "initial-index", "open"]));
  }
}), ve = z({});
function fa(d) {
  ve.value = { ...ve.value, ...d };
}
function Ye(d) {
  const S = z(!1), o = z(0), c = z(null), r = z(null), x = z(null), n = F(() => ({
    uploadUrl: "/api/v1/upload",
    profile: "avatar",
    maxFileSize: 10 * 1024 * 1024,
    // 10MB
    acceptedTypes: ["image/jpeg", "image/png", "image/webp", "image/heic", "image/heif"],
    ...ve.value,
    ...d
  }));
  function P($) {
    var M;
    return (M = n.value.acceptedTypes) != null && M.some((u) => $.type === u || $.type.startsWith(u.replace("/*", "/"))) ? n.value.maxFileSize && $.size > n.value.maxFileSize ? {
      message: `File too large. Maximum size is ${Math.round(n.value.maxFileSize / 1048576)}MB.`,
      code: "FILE_TOO_LARGE"
    } : null : {
      message: "Invalid file type. Please select a JPEG, PNG, WebP, or HEIC image.",
      code: "INVALID_TYPE"
    };
  }
  function A($) {
    const M = P($);
    return M ? (c.value = M, M) : (r.value && URL.revokeObjectURL(r.value), x.value = $, r.value = URL.createObjectURL($), c.value = null, null);
  }
  function H() {
    r.value && URL.revokeObjectURL(r.value), x.value = null, r.value = null, c.value = null, o.value = 0;
  }
  async function T() {
    if (!x.value)
      return c.value = { message: "No file selected", code: "NO_FILE" }, null;
    S.value = !0, o.value = 0, c.value = null;
    try {
      const $ = new FormData();
      $.append("file", x.value), $.append("profile", n.value.profile || "avatar"), n.value.projectId && $.append("project_id", n.value.projectId);
      const M = {};
      n.value.apiKey && (M.Authorization = `Bearer ${n.value.apiKey}`), n.value.headers && Object.assign(M, n.value.headers);
      const u = await new Promise((s, C) => {
        const w = new XMLHttpRequest();
        w.upload.addEventListener("progress", (g) => {
          g.lengthComputable && (o.value = Math.round(g.loaded / g.total * 100));
        }), w.addEventListener("load", () => {
          if (w.status >= 200 && w.status < 300)
            try {
              const g = JSON.parse(w.responseText), k = g.data || g;
              s({
                id: k.id,
                url: k.url || k.signed_url,
                variants: k.variants || {}
              });
            } catch {
              C({ message: "Invalid response from server", code: "PARSE_ERROR" });
            }
          else {
            let g = "Upload failed";
            try {
              const k = JSON.parse(w.responseText);
              g = k.error || k.message || g;
            } catch {
            }
            C({ message: g, code: `HTTP_${w.status}` });
          }
        }), w.addEventListener("error", () => {
          C({ message: "Network error during upload", code: "NETWORK_ERROR" });
        }), w.addEventListener("abort", () => {
          C({ message: "Upload cancelled", code: "ABORTED" });
        }), w.open("POST", n.value.uploadUrl);
        for (const [g, k] of Object.entries(M))
          w.setRequestHeader(g, k);
        w.send($);
      });
      return o.value = 100, u;
    } catch ($) {
      return c.value = $, null;
    } finally {
      S.value = !1;
    }
  }
  async function Z($) {
    return A($) ? null : T();
  }
  async function D($) {
    if (!x.value)
      return c.value = { message: "No file selected", code: "NO_FILE" }, null;
    S.value = !0, o.value = 0, c.value = null;
    try {
      const M = new FormData();
      M.append("file", x.value), M.append("profile", n.value.profile || "avatar"), M.append("crop_x", String($.x)), M.append("crop_y", String($.y)), M.append("crop_width", String($.width)), M.append("crop_height", String($.height)), $.zoom !== void 0 && M.append("crop_zoom", String($.zoom)), n.value.projectId && M.append("project_id", n.value.projectId);
      const u = {};
      n.value.apiKey && (u.Authorization = `Bearer ${n.value.apiKey}`), n.value.headers && Object.assign(u, n.value.headers);
      const s = await new Promise((C, w) => {
        const g = new XMLHttpRequest();
        g.upload.addEventListener("progress", (k) => {
          k.lengthComputable && (o.value = Math.round(k.loaded / k.total * 100));
        }), g.addEventListener("load", () => {
          if (g.status >= 200 && g.status < 300)
            try {
              const k = JSON.parse(g.responseText), U = k.data || k;
              C({
                id: U.id,
                url: U.url || U.signed_url,
                variants: U.variants || {}
              });
            } catch {
              w({ message: "Invalid response from server", code: "PARSE_ERROR" });
            }
          else {
            let k = "Upload failed";
            try {
              const U = JSON.parse(g.responseText);
              k = U.error || U.message || k;
            } catch {
            }
            w({ message: k, code: `HTTP_${g.status}` });
          }
        }), g.addEventListener("error", () => {
          w({ message: "Network error during upload", code: "NETWORK_ERROR" });
        }), g.addEventListener("abort", () => {
          w({ message: "Upload cancelled", code: "ABORTED" });
        }), g.open("POST", n.value.uploadUrl);
        for (const [k, U] of Object.entries(u))
          g.setRequestHeader(k, U);
        g.send(M);
      });
      return o.value = 100, s;
    } catch (M) {
      return c.value = M, null;
    } finally {
      S.value = !1;
    }
  }
  return {
    // State
    uploading: S,
    progress: o,
    error: c,
    previewUrl: r,
    selectedFile: x,
    config: n,
    // Methods
    validateFile: P,
    selectFile: A,
    clearSelection: H,
    upload: T,
    selectAndUpload: Z,
    uploadWithCrop: D
  };
}
const ue = {
  shape: "circle",
  cropSize: 280,
  outputSize: 512,
  maxZoom: 5,
  format: "image/jpeg",
  quality: 0.92,
  mediaProxyUrl: void 0
};
function Ve(d) {
  const S = F(() => ({ ...ue, ...d })), o = z({
    image: null,
    naturalWidth: 0,
    naturalHeight: 0,
    panX: 0,
    panY: 0,
    zoom: 1,
    minZoom: 1,
    maxZoom: ue.maxZoom
  }), c = z(!1), r = z(null), x = z(null), n = z(null);
  function P(i) {
    o.value.image = i, o.value.naturalWidth = i.naturalWidth, o.value.naturalHeight = i.naturalHeight;
    const { cropSize: m } = S.value, h = m / i.naturalWidth, y = m / i.naturalHeight, L = Math.max(h, y);
    console.log("[Cropper] Image initialized:", {
      naturalWidth: i.naturalWidth,
      naturalHeight: i.naturalHeight,
      cropSize: m,
      scaleX: h.toFixed(4),
      scaleY: y.toFixed(4),
      minZoom: L.toFixed(4)
    }), o.value.minZoom = L, o.value.maxZoom = L * S.value.maxZoom, o.value.zoom = L, D(), console.log("[Cropper] After centering:", {
      panX: o.value.panX.toFixed(2),
      panY: o.value.panY.toFixed(2),
      zoom: o.value.zoom.toFixed(4)
    });
  }
  async function A(i) {
    c.value = !0, r.value = null, x.value = i, n.value && URL.revokeObjectURL(n.value);
    try {
      const m = URL.createObjectURL(i);
      n.value = m;
      const h = await Z(m);
      return P(h), c.value = !1, !0;
    } catch {
      return r.value = "Failed to load image", c.value = !1, !1;
    }
  }
  async function H(i) {
    c.value = !0, r.value = null, x.value = null;
    try {
      let m = i;
      const { mediaProxyUrl: h } = S.value;
      h && T(i) && (m = `${h}?url=${encodeURIComponent(i)}`, console.log("[Cropper] Using proxy for external URL:", m)), n.value = m;
      const y = await Z(m);
      return P(y), c.value = !1, !0;
    } catch (m) {
      return console.error("[Cropper] Failed to load image:", m), r.value = "Failed to load image", c.value = !1, !1;
    }
  }
  function T(i) {
    try {
      return new URL(i).origin !== window.location.origin;
    } catch {
      return !1;
    }
  }
  function Z(i) {
    return new Promise((m, h) => {
      const y = new Image();
      y.crossOrigin = "anonymous", y.onload = () => m(y), y.onerror = () => h(new Error("Failed to load image")), y.src = i;
    });
  }
  function D() {
    const { cropSize: i } = S.value, { naturalWidth: m, naturalHeight: h, zoom: y } = o.value, L = i / y, R = i / y;
    o.value.panX = (m - L) / 2, o.value.panY = (h - R) / 2;
  }
  function $(i) {
    const { minZoom: m, maxZoom: h } = o.value, y = Math.max(m, Math.min(h, i)), L = o.value.zoom, { cropSize: R } = S.value, Y = o.value.panX + R / (2 * L), V = o.value.panY + R / (2 * L);
    o.value.zoom = y, o.value.panX = Y - R / (2 * y), o.value.panY = V - R / (2 * y), u();
  }
  function M(i, m) {
    const { zoom: h } = o.value;
    o.value.panX -= i / h, o.value.panY -= m / h, u();
  }
  function u() {
    const { cropSize: i } = S.value, { naturalWidth: m, naturalHeight: h, zoom: y } = o.value, L = i / y, R = i / y, Y = m - L, V = h - R;
    o.value.panX = Math.max(0, Math.min(Y, o.value.panX)), o.value.panY = Math.max(0, Math.min(V, o.value.panY));
  }
  const s = F(() => {
    if (!o.value.image) return null;
    const { cropSize: i } = S.value, { panX: m, panY: h, zoom: y } = o.value, L = i / y, R = i / y;
    return {
      x: Math.round(m),
      y: Math.round(h),
      width: Math.round(L),
      height: Math.round(R),
      zoom: y
    };
  }), C = F(() => {
    const { zoom: i, panX: m, panY: h } = o.value, y = -m * i, L = -h * i;
    return Math.random() < 0.01 && console.log("[Cropper] Transform:", {
      panX: m.toFixed(2),
      panY: h.toFixed(2),
      zoom: i.toFixed(4),
      translateX: y.toFixed(2),
      translateY: L.toFixed(2)
    }), `translate(${y}px, ${L}px) scale(${i})`;
  });
  async function w() {
    if (!o.value.image || !s.value) return null;
    const { outputSize: i, format: m, quality: h } = S.value, y = s.value, L = document.createElement("canvas");
    L.width = i, L.height = i;
    const R = L.getContext("2d");
    return R ? (R.drawImage(
      o.value.image,
      y.x,
      y.y,
      y.width,
      y.height,
      0,
      0,
      i,
      i
    ), new Promise((Y) => {
      L.toBlob(
        (V) => Y(V),
        m,
        h
      );
    })) : null;
  }
  async function g(i) {
    const m = await w();
    if (!m) return null;
    const { format: h } = S.value, y = h.split("/")[1], L = i || `avatar-cropped.${y}`;
    return new File([m], L, { type: h });
  }
  function k() {
    n.value && x.value && URL.revokeObjectURL(n.value), o.value = {
      image: null,
      naturalWidth: 0,
      naturalHeight: 0,
      panX: 0,
      panY: 0,
      zoom: 1,
      minZoom: 1,
      maxZoom: ue.maxZoom
    }, x.value = null, n.value = null, r.value = null;
  }
  function U() {
    if (!o.value.image) return;
    const { cropSize: i } = S.value, m = i / o.value.naturalWidth, h = i / o.value.naturalHeight, y = Math.max(m, h);
    o.value.zoom = y, D();
  }
  return {
    // State
    state: o,
    loading: c,
    error: r,
    sourceFile: x,
    sourceUrl: n,
    cropRegion: s,
    imageTransform: C,
    config: S,
    // Methods
    loadFile: A,
    loadUrl: H,
    setZoom: $,
    pan: M,
    centerImage: D,
    reset: U,
    exportCrop: w,
    exportCropAsFile: g,
    cleanup: k
  };
}
const Xe = { class: "avatar-cropper flex flex-col items-center gap-6" }, Ne = { class: "relative" }, We = { class: "text-sm" }, qe = ["src"], Je = {
  key: 0,
  class: "absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 hover:opacity-100 transition-opacity pointer-events-none"
}, Ge = {
  key: 0,
  class: "w-full max-w-xs space-y-2"
}, Ke = { class: "flex items-center gap-3" }, Qe = ["disabled"], et = { class: "flex-1 relative" }, tt = ["value"], at = ["disabled"], ot = { class: "w-12 text-right text-sm text-dark-400 tabular-nums" }, nt = { class: "flex items-center gap-3" }, lt = ["disabled"], rt = /* @__PURE__ */ oe({
  __name: "AvatarCropper",
  props: {
    file: {},
    url: {},
    shape: { default: "circle" },
    cropSize: { default: 280 },
    outputSize: { default: 512 },
    showZoomSlider: { type: Boolean, default: !0 },
    showReset: { type: Boolean, default: !0 },
    confirmLabel: { default: "Apply" },
    cancelLabel: { default: "Cancel" },
    config: {}
  },
  emits: ["confirm", "cancel", "crop-change"],
  setup(d, { emit: S }) {
    const o = d, c = S, {
      state: r,
      loading: x,
      error: n,
      sourceUrl: P,
      cropRegion: A,
      imageTransform: H,
      config: T,
      loadFile: Z,
      loadUrl: D,
      setZoom: $,
      pan: M,
      reset: u,
      exportCropAsFile: s,
      cleanup: C
    } = Ve({
      shape: o.shape,
      cropSize: o.cropSize,
      outputSize: o.outputSize,
      ...o.config
    }), w = z(null), g = z(!1), k = z({ x: 0, y: 0 });
    Q(() => o.file, async (l) => {
      l && await Z(l);
    }, { immediate: !0 }), Q(() => o.url, async (l) => {
      l && !o.file && await D(l);
    }, { immediate: !0 }), Q(A, (l) => {
      l && c("crop-change", l);
    });
    const U = F(() => r.value.minZoom ? Math.round(r.value.zoom / r.value.minZoom * 100) : 100), i = F({
      get: () => {
        const { zoom: l, minZoom: a, maxZoom: e } = r.value;
        return e === a ? 0 : (l - a) / (e - a);
      },
      set: (l) => {
        const { minZoom: a, maxZoom: e } = r.value, b = a + l * (e - a);
        $(b);
      }
    }), m = F(() => {
      switch (o.shape) {
        case "circle":
          return "rounded-full";
        case "rounded":
          return "rounded-3xl";
        default:
          return "";
      }
    });
    function h(l) {
      if (x.value) return;
      g.value = !0, k.value = { x: l.clientX, y: l.clientY }, l.target.setPointerCapture(l.pointerId);
    }
    function y(l) {
      if (!g.value) return;
      const a = l.clientX - k.value.x, e = l.clientY - k.value.y;
      M(a, e), k.value = { x: l.clientX, y: l.clientY };
    }
    function L(l) {
      g.value = !1, l.target.releasePointerCapture(l.pointerId);
    }
    function R(l) {
      l.preventDefault();
      const a = l.deltaY > 0 ? -0.1 : 0.1, { zoom: e, minZoom: b, maxZoom: N } = r.value, q = N - b, B = e + a * q * 0.3;
      $(B);
    }
    let Y = 0;
    function V(l) {
      l.touches.length === 2 && (Y = J(l.touches));
    }
    function K(l) {
      if (l.touches.length === 2) {
        l.preventDefault();
        const a = J(l.touches), e = a / Y;
        $(r.value.zoom * e), Y = a;
      }
    }
    function J(l) {
      const a = l[0].clientX - l[1].clientX, e = l[0].clientY - l[1].clientY;
      return Math.sqrt(a * a + e * e);
    }
    async function _() {
      if (!A.value) return;
      const l = await s();
      l && c("confirm", { file: l, crop: A.value });
    }
    function I() {
      C(), c("cancel");
    }
    function O() {
      u();
    }
    function X(l) {
      l.key === "Escape" ? I() : l.key === "Enter" && _();
    }
    return fe(() => {
      document.addEventListener("keydown", X);
    }), me(() => {
      document.removeEventListener("keydown", X), C();
    }), (l, a) => (v(), p("div", Xe, [
      t("div", Ne, [
        f(x) ? (v(), p("div", {
          key: 0,
          class: W(["flex items-center justify-center bg-dark-800", m.value]),
          style: G({ width: `${d.cropSize}px`, height: `${d.cropSize}px` })
        }, [...a[3] || (a[3] = [
          t("div", { class: "w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" }, null, -1)
        ])], 6)) : f(n) ? (v(), p("div", {
          key: 1,
          class: W(["flex flex-col items-center justify-center gap-2 bg-dark-800 text-red-400", m.value]),
          style: G({ width: `${d.cropSize}px`, height: `${d.cropSize}px` })
        }, [
          a[4] || (a[4] = t("svg", {
            class: "w-8 h-8",
            fill: "none",
            stroke: "currentColor",
            viewBox: "0 0 24 24"
          }, [
            t("path", {
              "stroke-linecap": "round",
              "stroke-linejoin": "round",
              "stroke-width": "2",
              d: "M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            })
          ], -1)),
          t("span", We, j(f(n)), 1)
        ], 6)) : f(r).image ? (v(), p("div", {
          key: 2,
          ref_key: "cropAreaRef",
          ref: w,
          class: W(["relative overflow-hidden bg-dark-900 select-none touch-none", m.value]),
          style: G({
            width: `${d.cropSize}px`,
            height: `${d.cropSize}px`,
            cursor: g.value ? "grabbing" : "grab"
          }),
          onPointerdown: h,
          onPointermove: y,
          onPointerup: L,
          onPointercancel: L,
          onWheel: R,
          onTouchstart: V,
          onTouchmove: K
        }, [
          t("img", {
            src: f(P) || "",
            alt: "Crop preview",
            class: "pointer-events-none",
            style: G({
              position: "absolute",
              top: "0",
              left: "0",
              width: `${f(r).naturalWidth}px`,
              height: `${f(r).naturalHeight}px`,
              maxWidth: "none",
              maxHeight: "none",
              transformOrigin: "0 0",
              transform: f(H)
            }),
            draggable: "false"
          }, null, 12, qe),
          a[6] || (a[6] = Me('<div class="absolute inset-0 pointer-events-none opacity-0 hover:opacity-100 transition-opacity" data-v-235e5b45><div class="absolute inset-0 border border-white/20" data-v-235e5b45></div><div class="absolute left-1/3 top-0 bottom-0 w-px bg-white/10" data-v-235e5b45></div><div class="absolute right-1/3 top-0 bottom-0 w-px bg-white/10" data-v-235e5b45></div><div class="absolute top-1/3 left-0 right-0 h-px bg-white/10" data-v-235e5b45></div><div class="absolute bottom-1/3 left-0 right-0 h-px bg-white/10" data-v-235e5b45></div><div class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6" data-v-235e5b45><div class="absolute left-1/2 top-0 bottom-0 w-px bg-white/30 -translate-x-1/2" data-v-235e5b45></div><div class="absolute top-1/2 left-0 right-0 h-px bg-white/30 -translate-y-1/2" data-v-235e5b45></div></div></div>', 1)),
          g.value ? E("", !0) : (v(), p("div", Je, [...a[5] || (a[5] = [
            t("div", { class: "flex items-center gap-2 px-3 py-1.5 bg-black/60 rounded-full text-white text-sm" }, [
              t("svg", {
                class: "w-4 h-4",
                fill: "none",
                stroke: "currentColor",
                viewBox: "0 0 24 24"
              }, [
                t("path", {
                  "stroke-linecap": "round",
                  "stroke-linejoin": "round",
                  "stroke-width": "2",
                  d: "M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"
                })
              ]),
              de(" Drag to reposition ")
            ], -1)
          ])]))
        ], 38)) : (v(), p("div", {
          key: 3,
          class: W(["flex items-center justify-center bg-dark-800 text-dark-500", m.value]),
          style: G({ width: `${d.cropSize}px`, height: `${d.cropSize}px` })
        }, [...a[7] || (a[7] = [
          t("svg", {
            class: "w-12 h-12",
            fill: "none",
            stroke: "currentColor",
            viewBox: "0 0 24 24"
          }, [
            t("path", {
              "stroke-linecap": "round",
              "stroke-linejoin": "round",
              "stroke-width": "1.5",
              d: "M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
            })
          ], -1)
        ])], 6)),
        o.shape !== "circle" && f(r).image ? (v(), p("div", {
          key: 4,
          class: W(["absolute inset-0 pointer-events-none border-2 border-white/20", m.value])
        }, null, 2)) : E("", !0)
      ]),
      d.showZoomSlider && f(r).image ? (v(), p("div", Ge, [
        t("div", Ke, [
          t("button", {
            type: "button",
            class: "p-1.5 text-dark-400 hover:text-white rounded-lg hover:bg-dark-700 transition-colors",
            onClick: a[0] || (a[0] = (e) => f($)(f(r).zoom - (f(r).maxZoom - f(r).minZoom) * 0.1)),
            disabled: f(r).zoom <= f(r).minZoom
          }, [...a[8] || (a[8] = [
            t("svg", {
              class: "w-4 h-4",
              fill: "none",
              stroke: "currentColor",
              viewBox: "0 0 24 24"
            }, [
              t("path", {
                "stroke-linecap": "round",
                "stroke-linejoin": "round",
                "stroke-width": "2",
                d: "M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM13 10H7"
              })
            ], -1)
          ])], 8, Qe),
          t("div", et, [
            t("input", {
              type: "range",
              value: i.value,
              min: "0",
              max: "1",
              step: "0.01",
              class: "zoom-slider w-full h-2 bg-dark-700 rounded-full appearance-none cursor-pointer",
              onInput: a[1] || (a[1] = (e) => i.value = parseFloat(e.target.value))
            }, null, 40, tt)
          ]),
          t("button", {
            type: "button",
            class: "p-1.5 text-dark-400 hover:text-white rounded-lg hover:bg-dark-700 transition-colors",
            onClick: a[2] || (a[2] = (e) => f($)(f(r).zoom + (f(r).maxZoom - f(r).minZoom) * 0.1)),
            disabled: f(r).zoom >= f(r).maxZoom
          }, [...a[9] || (a[9] = [
            t("svg", {
              class: "w-4 h-4",
              fill: "none",
              stroke: "currentColor",
              viewBox: "0 0 24 24"
            }, [
              t("path", {
                "stroke-linecap": "round",
                "stroke-linejoin": "round",
                "stroke-width": "2",
                d: "M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7"
              })
            ], -1)
          ])], 8, at),
          t("span", ot, j(U.value) + "% ", 1)
        ])
      ])) : E("", !0),
      t("div", nt, [
        d.showReset && f(r).image ? (v(), p("button", {
          key: 0,
          type: "button",
          class: "px-4 py-2 text-sm text-dark-400 hover:text-white rounded-lg hover:bg-dark-700 transition-colors",
          onClick: O
        }, " Reset ")) : E("", !0),
        t("button", {
          type: "button",
          class: "px-4 py-2 text-sm text-dark-300 bg-dark-700 hover:bg-dark-600 rounded-lg transition-colors",
          onClick: I
        }, j(d.cancelLabel), 1),
        t("button", {
          type: "button",
          class: "px-6 py-2 text-sm font-medium text-white bg-primary-600 hover:bg-primary-500 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed",
          disabled: !f(r).image || f(x),
          onClick: _
        }, j(d.confirmLabel), 9, lt)
      ])
    ]));
  }
}), _e = /* @__PURE__ */ re(rt, [["__scopeId", "data-v-235e5b45"]]), st = {
  key: 0,
  class: "fixed inset-0 z-50 flex items-center justify-center p-4"
}, it = { class: "relative bg-dark-900 rounded-2xl p-6 shadow-2xl border border-dark-700 max-w-md w-full" }, ut = ["src"], ct = {
  key: 1,
  class: "w-full h-full bg-gradient-to-br from-slate-600 to-slate-800 flex items-center justify-center"
}, dt = ["width", "height"], vt = {
  key: 2,
  class: "absolute inset-0 bg-black/50 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center"
}, pt = {
  key: 3,
  class: "absolute inset-0 bg-black/60 flex items-center justify-center"
}, ft = {
  key: 0,
  class: "transform -rotate-90",
  width: "60",
  height: "60",
  viewBox: "0 0 100 100"
}, mt = ["stroke-dasharray", "stroke-dashoffset"], ht = { class: "absolute text-white font-medium text-sm" }, gt = {
  key: 0,
  class: "absolute -bottom-6 left-1/2 transform -translate-x-1/2 whitespace-nowrap text-xs text-red-400"
}, yt = /* @__PURE__ */ oe({
  __name: "AvatarUpload",
  props: {
    modelValue: {},
    size: { default: 120 },
    config: {},
    editable: { type: Boolean, default: !0 },
    placeholder: {},
    shape: { default: "circle" },
    showProgress: { type: Boolean, default: !0 },
    containerClass: {},
    enableCrop: { type: Boolean, default: !1 },
    cropSize: { default: 280 },
    cropOutputSize: { default: 512 }
  },
  emits: ["update:modelValue", "upload-start", "upload-progress", "upload-success", "upload-error", "file-selected", "crop-applied"],
  setup(d, { emit: S }) {
    const o = d, c = S, {
      uploading: r,
      progress: x,
      error: n,
      previewUrl: P,
      selectedFile: A,
      selectFile: H,
      clearSelection: T,
      upload: Z,
      uploadWithCrop: D
    } = Ye(o.config), $ = z(null), M = z(!1), u = z(!1), s = z(null), C = z(null), w = F(() => P.value || o.modelValue || null), g = F(() => {
      switch (o.shape) {
        case "rounded":
          return "rounded-2xl";
        case "square":
          return "rounded-none";
        default:
          return "rounded-full";
      }
    }), k = F(() => 2 * Math.PI * 45), U = F(() => k.value - x.value / 100 * k.value);
    Q(x, (_) => {
      c("upload-progress", _);
    }), Q(n, (_) => {
      _ && c("upload-error", _);
    });
    function i() {
      var _;
      !o.editable || r.value || (_ = $.value) == null || _.click();
    }
    function m(_) {
      var X;
      const I = _.target, O = (X = I.files) == null ? void 0 : X[0];
      O && h(O), I.value = "";
    }
    function h(_) {
      if (!["image/jpeg", "image/png", "image/webp", "image/heic", "image/heif"].some((O) => _.type === O)) {
        c("upload-error", {
          message: "Invalid file type. Please select a JPEG, PNG, WebP, or HEIC image.",
          code: "INVALID_TYPE"
        });
        return;
      }
      if (c("file-selected", _), o.enableCrop)
        s.value = _, u.value = !0;
      else {
        if (H(_))
          return;
        y();
      }
    }
    async function y() {
      var I, O, X, l;
      if (!A.value) return;
      c("upload-start", A.value);
      const _ = await Z();
      if (_) {
        c("upload-success", _);
        const a = ((O = (I = _.variants) == null ? void 0 : I.lg) == null ? void 0 : O.url) || ((l = (X = _.variants) == null ? void 0 : X.md) == null ? void 0 : l.url) || _.url;
        c("update:modelValue", a), T();
      }
    }
    async function L(_) {
      var X, l, a, e;
      if (u.value = !1, s.value = null, C.value = _.crop, c("crop-applied", _), H(_.file))
        return;
      c("upload-start", _.file);
      const O = await D(_.crop);
      if (O) {
        c("upload-success", { ...O, crop: _.crop });
        const b = ((l = (X = O.variants) == null ? void 0 : X.lg) == null ? void 0 : l.url) || ((e = (a = O.variants) == null ? void 0 : a.md) == null ? void 0 : e.url) || O.url;
        c("update:modelValue", b), T();
      }
    }
    function R() {
      u.value = !1, s.value = null;
    }
    function Y(_) {
      _.preventDefault(), o.editable && !r.value && (M.value = !0);
    }
    function V(_) {
      _.preventDefault(), M.value = !1;
    }
    function K(_) {
      _.preventDefault();
    }
    function J(_) {
      var O;
      if (_.preventDefault(), M.value = !1, !o.editable || r.value) return;
      const I = (O = _.dataTransfer) == null ? void 0 : O.files[0];
      I && I.type.startsWith("image/") && h(I);
    }
    return me(() => {
      T();
    }), (_, I) => (v(), p("div", null, [
      (v(), le(he, { to: "body" }, [
        ae(ge, { name: "fade" }, {
          default: ye(() => [
            u.value && s.value ? (v(), p("div", st, [
              t("div", {
                class: "absolute inset-0 bg-black/80 backdrop-blur-sm",
                onClick: R
              }),
              t("div", it, [
                I[0] || (I[0] = t("h3", { class: "text-lg font-semibold text-white mb-4 text-center" }, " Adjust your photo ", -1)),
                ae(_e, {
                  file: s.value,
                  shape: d.shape,
                  "crop-size": d.cropSize,
                  "output-size": d.cropOutputSize,
                  "confirm-label": "Save",
                  onConfirm: L,
                  onCancel: R
                }, null, 8, ["file", "shape", "crop-size", "output-size"])
              ])
            ])) : E("", !0)
          ]),
          _: 1
        })
      ])),
      t("div", {
        class: W(["avatar-upload-container relative inline-block", d.containerClass]),
        style: G({ width: `${d.size}px`, height: `${d.size}px` })
      }, [
        t("input", {
          ref_key: "fileInput",
          ref: $,
          type: "file",
          accept: "image/jpeg,image/png,image/webp,image/heic,image/heif",
          class: "hidden",
          onChange: m
        }, null, 544),
        t("div", {
          class: W(["avatar-upload relative w-full h-full overflow-hidden transition-all duration-200", [
            g.value,
            d.editable && !f(r) ? "cursor-pointer hover:ring-4 hover:ring-primary-500/30" : "",
            M.value ? "ring-4 ring-primary-500 scale-105" : "",
            f(n) ? "ring-2 ring-red-500" : ""
          ]]),
          onClick: i,
          onDragenter: Y,
          onDragleave: V,
          onDragover: K,
          onDrop: J
        }, [
          w.value ? (v(), p("img", {
            key: 0,
            src: w.value,
            alt: "Avatar",
            class: "w-full h-full object-cover"
          }, null, 8, ut)) : (v(), p("div", ct, [
            d.placeholder ? (v(), p("span", {
              key: 0,
              class: "text-white font-semibold",
              style: G({ fontSize: `${d.size / 3}px` })
            }, j(d.placeholder), 5)) : (v(), p("svg", {
              key: 1,
              class: "text-slate-400",
              width: d.size / 2.5,
              height: d.size / 2.5,
              fill: "currentColor",
              viewBox: "0 0 24 24"
            }, [...I[1] || (I[1] = [
              t("path", { d: "M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" }, null, -1)
            ])], 8, dt))
          ])),
          d.editable && !f(r) ? (v(), p("div", vt, [...I[2] || (I[2] = [
            t("svg", {
              class: "text-white",
              width: "24",
              height: "24",
              fill: "none",
              stroke: "currentColor",
              viewBox: "0 0 24 24"
            }, [
              t("path", {
                "stroke-linecap": "round",
                "stroke-linejoin": "round",
                "stroke-width": "2",
                d: "M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
              }),
              t("path", {
                "stroke-linecap": "round",
                "stroke-linejoin": "round",
                "stroke-width": "2",
                d: "M15 13a3 3 0 11-6 0 3 3 0 016 0z"
              })
            ], -1)
          ])])) : E("", !0),
          f(r) ? (v(), p("div", pt, [
            d.showProgress ? (v(), p("svg", ft, [
              I[3] || (I[3] = t("circle", {
                cx: "50",
                cy: "50",
                r: "45",
                fill: "none",
                stroke: "currentColor",
                "stroke-width": "6",
                class: "text-white/20"
              }, null, -1)),
              t("circle", {
                cx: "50",
                cy: "50",
                r: "45",
                fill: "none",
                stroke: "currentColor",
                "stroke-width": "6",
                "stroke-linecap": "round",
                class: "text-primary-500 transition-all duration-200",
                "stroke-dasharray": k.value,
                "stroke-dashoffset": U.value
              }, null, 8, mt)
            ])) : E("", !0),
            t("span", ht, j(f(x)) + "%", 1)
          ])) : E("", !0)
        ], 34),
        f(n) && !f(r) ? (v(), p("div", gt, j(f(n).message), 1)) : E("", !0)
      ], 6)
    ]));
  }
}), ma = /* @__PURE__ */ re(yt, [["__scopeId", "data-v-36262731"]]), pe = z({});
function ha(d) {
  pe.value = { ...pe.value, ...d };
}
function xt(d) {
  const S = z([]), o = z(!1), c = z(null), r = z(!1), x = z(0), n = F(() => ({
    apiBaseUrl: "/api",
    getHeaders: () => ({}),
    ...pe.value,
    ...d
  })), P = F(() => S.value.find((u) => u.is_primary));
  async function A() {
    o.value = !0, c.value = null;
    try {
      let u = `${n.value.apiBaseUrl}/avatars`;
      const s = new URLSearchParams();
      n.value.projectId && s.set("project_id", n.value.projectId), n.value.entityType && s.set("entity_type", n.value.entityType), n.value.entityId && s.set("entity_id", n.value.entityId), s.toString() && (u += `?${s.toString()}`);
      const C = await fetch(u, {
        headers: n.value.getHeaders()
      });
      if (!C.ok)
        throw new Error(await C.text());
      const w = await C.json();
      S.value = w.avatars || [];
    } catch (u) {
      c.value = u.message || "Failed to fetch avatars";
    } finally {
      o.value = !1;
    }
  }
  async function H(u) {
    c.value = null;
    try {
      const s = await fetch(`${n.value.apiBaseUrl}/avatars`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...n.value.getHeaders()
        },
        body: JSON.stringify({
          original_url: u.original_url,
          file_id: u.file_id,
          name: u.name,
          is_primary: u.is_primary ?? !1,
          source: "upload",
          format: "static",
          variants: u.variants,
          blurhash: u.blurhash,
          dominant_color: u.dominant_color,
          alt_text: u.alt_text,
          fallback_type: u.fallback_initials ? "initials" : "default",
          fallback_data: u.fallback_initials ? { initials: u.fallback_initials } : void 0
        })
      });
      if (!s.ok)
        throw new Error(await s.text());
      const C = await s.json();
      return await A(), C;
    } catch (s) {
      return c.value = s.message || "Failed to create avatar", null;
    }
  }
  async function T(u) {
    c.value = null;
    try {
      const s = await fetch(`${n.value.apiBaseUrl}/avatars/${u}/primary`, {
        method: "POST",
        headers: n.value.getHeaders()
      });
      if (!s.ok)
        throw new Error(await s.text());
      return S.value = S.value.map((C) => ({
        ...C,
        is_primary: C.id === u
      })), !0;
    } catch (s) {
      return c.value = s.message || "Failed to set primary avatar", !1;
    }
  }
  async function Z(u) {
    c.value = null;
    try {
      const s = await fetch(`${n.value.apiBaseUrl}/avatars/${u}`, {
        method: "DELETE",
        headers: n.value.getHeaders()
      });
      if (!s.ok)
        throw new Error(await s.text());
      return S.value = S.value.filter((C) => C.id !== u), !0;
    } catch (s) {
      return c.value = s.message || "Failed to delete avatar", !1;
    }
  }
  async function D(u, s) {
    c.value = null;
    try {
      const C = await fetch(`${n.value.apiBaseUrl}/avatars/${u}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...n.value.getHeaders()
        },
        body: JSON.stringify(s)
      });
      if (!C.ok)
        throw new Error(await C.text());
      const w = await C.json();
      return S.value = S.value.map(
        (g) => g.id === u ? w : g
      ), w;
    } catch (C) {
      return c.value = C.message || "Failed to update avatar", null;
    }
  }
  async function $(u, s) {
    if (!n.value.uploadUrl)
      return c.value = "Upload URL not configured", null;
    r.value = !0, x.value = 0, c.value = null;
    try {
      const C = new FormData();
      C.append("file", u), C.append("profile", "avatar");
      const w = await new Promise((k, U) => {
        const i = new XMLHttpRequest();
        i.upload.addEventListener("progress", (h) => {
          h.lengthComputable && (x.value = Math.round(h.loaded / h.total * 100));
        }), i.addEventListener("load", () => {
          if (i.status >= 200 && i.status < 300)
            try {
              const h = JSON.parse(i.responseText);
              k(h.data || h);
            } catch {
              U(new Error("Invalid response from server"));
            }
          else {
            let h = "Upload failed";
            try {
              const y = JSON.parse(i.responseText);
              h = y.error || y.message || h;
            } catch {
            }
            U(new Error(h));
          }
        }), i.addEventListener("error", () => U(new Error("Network error"))), i.addEventListener("abort", () => U(new Error("Upload cancelled"))), i.open("POST", n.value.uploadUrl);
        const m = n.value.getHeaders();
        for (const [h, y] of Object.entries(m))
          i.setRequestHeader(h, y);
        i.send(C);
      });
      return x.value = 100, await H({
        original_url: w.url || w.signed_url,
        file_id: w.id,
        name: s == null ? void 0 : s.name,
        is_primary: s == null ? void 0 : s.is_primary,
        variants: w.variants,
        fallback_initials: s == null ? void 0 : s.fallback_initials
      });
    } catch (C) {
      return c.value = C.message || "Failed to upload avatar", null;
    } finally {
      r.value = !1;
    }
  }
  function M(u, s = "md") {
    var w, g, k, U, i, m, h;
    if (s === "original")
      return u.original_url;
    if (s === "source")
      return ((w = u.variants.source) == null ? void 0 : w.url) || u.original_url;
    const C = u.variants[s];
    return C ? C.url : s === "sm" ? ((g = u.variants.md) == null ? void 0 : g.url) || ((k = u.variants.lg) == null ? void 0 : k.url) || u.original_url : s === "md" ? ((U = u.variants.lg) == null ? void 0 : U.url) || ((i = u.variants.sm) == null ? void 0 : i.url) || u.original_url : s === "lg" && (((m = u.variants.md) == null ? void 0 : m.url) || ((h = u.variants.sm) == null ? void 0 : h.url)) || u.original_url;
  }
  return {
    // State
    avatars: S,
    loading: o,
    error: c,
    uploading: r,
    uploadProgress: x,
    primaryAvatar: P,
    config: n,
    // Methods
    fetchAvatars: A,
    createAvatar: H,
    setPrimary: T,
    deleteAvatar: Z,
    updateAvatar: D,
    uploadAndCreateAvatar: $,
    getAvatarUrl: M
  };
}
const bt = { class: "avatar-manager" }, wt = {
  key: 0,
  class: "fixed inset-0 z-50 flex items-center justify-center p-4"
}, kt = { class: "relative bg-dark-900 rounded-2xl p-6 shadow-2xl border border-dark-700 max-w-md w-full" }, Ct = { class: "text-lg font-semibold text-white mb-4 text-center" }, _t = {
  key: 0,
  class: "flex items-center justify-center py-8"
}, zt = {
  key: 1,
  class: "text-center py-8"
}, $t = { class: "text-red-400 mb-2" }, Mt = {
  key: 2,
  class: "space-y-3"
}, St = { class: "flex flex-wrap gap-3" }, Ut = ["onClick"], Lt = ["src", "alt"], Et = {
  key: 0,
  class: "absolute -top-1 -right-1 w-5 h-5 bg-yellow-500 rounded-full flex items-center justify-center shadow-lg",
  title: "Pending moderation"
}, It = ["onClick"], At = ["onClick"], Pt = ["onClick", "title"], Rt = ["disabled"], Ft = {
  key: 0,
  class: "relative w-full h-full flex items-center justify-center"
}, Ot = {
  class: "absolute inset-2 w-auto h-auto",
  viewBox: "0 0 36 36"
}, jt = ["stroke-dasharray"], Dt = { class: "text-xs font-medium text-dark-300" }, Bt = {
  key: 1,
  class: "text-dark-500 hover:text-primary-400 transition-colors"
}, Tt = { class: "text-xs text-dark-500" }, Ht = { key: 0 }, Zt = { key: 1 }, Yt = {
  key: 0,
  class: "text-sm text-red-400"
}, Vt = {
  key: 3,
  class: "space-y-3"
}, Xt = { class: "space-y-2" }, Nt = ["onClick"], Wt = ["src", "alt"], qt = { class: "flex-1 min-w-0" }, Jt = { class: "flex items-center gap-2" }, Gt = { class: "font-medium text-white truncate" }, Kt = {
  key: 0,
  class: "px-2 py-0.5 text-xs font-medium bg-emerald-500/20 text-emerald-400 rounded-full"
}, Qt = {
  key: 1,
  class: "px-2 py-0.5 text-xs font-medium bg-yellow-500/20 text-yellow-400 rounded-full"
}, ea = { class: "flex items-center gap-3 mt-1 text-xs text-dark-400" }, ta = { key: 0 }, aa = {
  key: 1,
  class: "text-purple-400"
}, oa = { class: "flex items-center gap-2" }, na = ["onClick"], la = ["onClick"], ra = ["onClick", "title"], sa = ["disabled"], ia = { class: "text-dark-400" }, ua = { class: "flex items-center justify-between text-xs text-dark-500" }, ca = {
  key: 0,
  class: "text-red-400"
}, da = /* @__PURE__ */ oe({
  __name: "AvatarManager",
  props: {
    initials: { default: "" },
    maxAvatars: { default: 10 },
    allowUpload: { type: Boolean, default: !0 },
    allowDelete: { type: Boolean, default: !0 },
    allowEdit: { type: Boolean, default: !0 },
    enableCropOnUpload: { type: Boolean, default: !0 },
    avatarSize: { default: 80 },
    shape: { default: "circle" },
    mode: { default: "compact" },
    cropSize: { default: 280 },
    config: {}
  },
  emits: ["select", "primary-changed", "upload-success", "upload-error", "delete", "crop-updated"],
  setup(d, { emit: S }) {
    const o = d, c = S, {
      avatars: r,
      loading: x,
      error: n,
      uploading: P,
      uploadProgress: A,
      config: H,
      fetchAvatars: T,
      setPrimary: Z,
      deleteAvatar: D,
      uploadAndCreateAvatar: $,
      getAvatarUrl: M
    } = xt(o.config), u = z(null), s = z(null), C = z(null), w = z(!1), g = z("upload"), k = z(null), U = z(null), i = F(() => o.allowUpload && r.value.length < o.maxAvatars), m = F(() => {
      switch (o.shape) {
        case "circle":
          return "rounded-full";
        case "square":
          return "rounded-none";
        case "rounded":
          return "rounded-xl";
        default:
          return "rounded-full";
      }
    }), h = F(() => U.value ? U.value.original_url : null);
    fe(() => {
      T();
    });
    function y() {
      var l;
      (l = u.value) == null || l.click();
    }
    async function L(l) {
      var b;
      const a = l.target, e = (b = a.files) == null ? void 0 : b[0];
      if (e)
        if (a.value = "", o.enableCropOnUpload)
          k.value = e, g.value = "upload", w.value = !0;
        else {
          const N = await $(e, {
            name: `Avatar ${r.value.length + 1}`,
            is_primary: r.value.length === 0,
            fallback_initials: o.initials
          });
          N ? c("upload-success", N) : n.value && c("upload-error", n.value);
        }
    }
    function R(l) {
      U.value = l, g.value = "edit", w.value = !0;
    }
    async function Y(l) {
      if (w.value = !1, g.value === "upload" && k.value) {
        const a = await $(l.file, {
          name: `Avatar ${r.value.length + 1}`,
          is_primary: r.value.length === 0,
          fallback_initials: o.initials,
          crop: l.crop
        });
        a ? c("upload-success", a) : n.value && c("upload-error", n.value);
      } else if (g.value === "edit" && U.value) {
        const a = await $(l.file, {
          name: U.value.name,
          is_primary: U.value.is_primary,
          fallback_initials: o.initials,
          crop: l.crop
        });
        a ? (await D(U.value.id), c("crop-updated", a, l.crop)) : n.value && c("upload-error", n.value);
      }
      k.value = null, U.value = null;
    }
    function V() {
      w.value = !1, k.value = null, U.value = null;
    }
    async function K(l) {
      if (l.is_primary) return;
      await Z(l.id) && c("primary-changed", l);
    }
    async function J(l) {
      if (s.value !== l.id) {
        s.value = l.id;
        return;
      }
      await D(l.id) && (c("delete", l), s.value = null);
    }
    function _() {
      s.value = null;
    }
    function I(l) {
      C.value = l.id, c("select", l);
    }
    function O(l) {
      const a = new Date(l);
      return a.toLocaleDateString(void 0, {
        month: "short",
        day: "numeric",
        year: a.getFullYear() !== (/* @__PURE__ */ new Date()).getFullYear() ? "numeric" : void 0
      });
    }
    function X(l) {
      return {
        upload: "Uploaded",
        gravatar: "Gravatar",
        oauth: "OAuth",
        generated: "Generated",
        ai: "AI Generated"
      }[l] || l;
    }
    return (l, a) => (v(), p("div", bt, [
      t("input", {
        ref_key: "fileInputRef",
        ref: u,
        type: "file",
        accept: "image/*",
        class: "hidden",
        onChange: L
      }, null, 544),
      (v(), le(he, { to: "body" }, [
        ae(ge, { name: "fade" }, {
          default: ye(() => [
            w.value && (k.value || U.value) ? (v(), p("div", wt, [
              t("div", {
                class: "absolute inset-0 bg-black/80 backdrop-blur-sm",
                onClick: V
              }),
              t("div", kt, [
                t("h3", Ct, j(g.value === "edit" ? "Adjust your photo" : "Position your photo"), 1),
                ae(_e, {
                  file: k.value,
                  url: h.value,
                  shape: d.shape,
                  "crop-size": d.cropSize,
                  config: { mediaProxyUrl: f(H).mediaProxyUrl },
                  "confirm-label": g.value === "edit" ? "Save changes" : "Upload",
                  onConfirm: Y,
                  onCancel: V
                }, null, 8, ["file", "url", "shape", "crop-size", "config", "confirm-label"])
              ])
            ])) : E("", !0)
          ]),
          _: 1
        })
      ])),
      f(x) && f(r).length === 0 ? (v(), p("div", _t, [...a[1] || (a[1] = [
        t("div", { class: "w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" }, null, -1)
      ])])) : f(n) && f(r).length === 0 ? (v(), p("div", zt, [
        t("div", $t, j(f(n)), 1),
        t("button", {
          onClick: a[0] || (a[0] = //@ts-ignore
          (...e) => f(T) && f(T)(...e)),
          class: "text-sm text-primary-400 hover:text-primary-300 underline"
        }, " Try again ")
      ])) : d.mode === "compact" ? (v(), p("div", Mt, [
        t("div", St, [
          (v(!0), p(te, null, ce(f(r), (e) => (v(), p("div", {
            key: e.id,
            class: "relative group",
            style: G({ width: `${d.avatarSize}px`, height: `${d.avatarSize}px` })
          }, [
            t("button", {
              onClick: (b) => I(e),
              class: W(["w-full h-full overflow-hidden transition-all duration-200", [
                m.value,
                e.is_primary ? "ring-[3px] ring-emerald-500 ring-offset-2 ring-offset-dark-900" : C.value === e.id ? "ring-2 ring-dark-400 ring-offset-2 ring-offset-dark-900" : "ring-2 ring-transparent hover:ring-dark-500 ring-offset-2 ring-offset-dark-900"
              ]])
            }, [
              t("img", {
                src: f(M)(e, "md"),
                alt: e.alt_text || e.name || "Avatar",
                class: "w-full h-full object-cover",
                style: G(e.dominant_color ? { backgroundColor: e.dominant_color } : {})
              }, null, 12, Lt)
            ], 10, Ut),
            e.moderation_status === "pending" ? (v(), p("div", Et, [...a[2] || (a[2] = [
              t("svg", {
                class: "w-3 h-3 text-white",
                fill: "currentColor",
                viewBox: "0 0 20 20"
              }, [
                t("path", {
                  "fill-rule": "evenodd",
                  d: "M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z",
                  "clip-rule": "evenodd"
                })
              ], -1)
            ])])) : E("", !0),
            t("div", {
              class: W(["absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1", [
                m.value,
                s.value === e.id ? "z-50 opacity-100" : "z-10"
              ]])
            }, [
              d.allowEdit ? (v(), p("button", {
                key: 0,
                type: "button",
                onClick: ee((b) => R(e), ["stop"]),
                class: "p-1.5 bg-dark-700 hover:bg-primary-600 rounded-lg transition-colors",
                title: "Edit crop"
              }, [...a[3] || (a[3] = [
                t("svg", {
                  class: "w-4 h-4 text-white",
                  fill: "none",
                  stroke: "currentColor",
                  viewBox: "0 0 24 24"
                }, [
                  t("path", {
                    "stroke-linecap": "round",
                    "stroke-linejoin": "round",
                    "stroke-width": "2",
                    d: "M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  })
                ], -1)
              ])], 8, It)) : E("", !0),
              e.is_primary ? E("", !0) : (v(), p("button", {
                key: 1,
                type: "button",
                onClick: ee((b) => K(e), ["stop"]),
                class: "p-1.5 bg-dark-700 hover:bg-emerald-600 rounded-lg transition-colors",
                title: "Set as primary"
              }, [...a[4] || (a[4] = [
                t("svg", {
                  class: "w-4 h-4 text-white",
                  fill: "none",
                  stroke: "currentColor",
                  viewBox: "0 0 24 24"
                }, [
                  t("path", {
                    "stroke-linecap": "round",
                    "stroke-linejoin": "round",
                    "stroke-width": "2",
                    d: "M5 13l4 4L19 7"
                  })
                ], -1)
              ])], 8, At)),
              d.allowDelete ? (v(), p("button", {
                key: 2,
                type: "button",
                onClick: ee((b) => J(e), ["stop"]),
                class: W(["p-1.5 rounded-lg transition-colors", s.value === e.id ? "bg-red-600 hover:bg-red-700" : "bg-dark-700 hover:bg-red-600"]),
                title: s.value === e.id ? "Click again to confirm" : "Delete"
              }, [...a[5] || (a[5] = [
                t("svg", {
                  class: "w-4 h-4 text-white",
                  fill: "none",
                  stroke: "currentColor",
                  viewBox: "0 0 24 24"
                }, [
                  t("path", {
                    "stroke-linecap": "round",
                    "stroke-linejoin": "round",
                    "stroke-width": "2",
                    d: "M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  })
                ], -1)
              ])], 10, Pt)) : E("", !0)
            ], 2)
          ], 4))), 128)),
          i.value ? (v(), p("button", {
            key: 0,
            type: "button",
            onClick: y,
            disabled: f(P),
            class: W(["flex items-center justify-center border-2 border-dashed border-dark-600 hover:border-primary-500 transition-colors", m.value]),
            style: G({ width: `${d.avatarSize}px`, height: `${d.avatarSize}px` })
          }, [
            f(P) ? (v(), p("div", Ft, [
              (v(), p("svg", Ot, [
                a[6] || (a[6] = t("path", {
                  class: "text-dark-700",
                  stroke: "currentColor",
                  "stroke-width": "3",
                  fill: "none",
                  d: "M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                }, null, -1)),
                t("path", {
                  class: "text-primary-500",
                  stroke: "currentColor",
                  "stroke-width": "3",
                  fill: "none",
                  "stroke-linecap": "round",
                  "stroke-dasharray": `${f(A)}, 100`,
                  d: "M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                }, null, 8, jt)
              ])),
              t("span", Dt, j(f(A)) + "%", 1)
            ])) : (v(), p("div", Bt, [...a[7] || (a[7] = [
              t("svg", {
                class: "w-6 h-6",
                fill: "none",
                stroke: "currentColor",
                viewBox: "0 0 24 24"
              }, [
                t("path", {
                  "stroke-linecap": "round",
                  "stroke-linejoin": "round",
                  "stroke-width": "2",
                  d: "M12 4v16m8-8H4"
                })
              ], -1)
            ])]))
          ], 14, Rt)) : E("", !0)
        ]),
        t("p", Tt, [
          f(r).length === 0 ? (v(), p("span", Ht, "Upload your first avatar")) : (v(), p("span", Zt, [
            de(j(f(r).length) + "/" + j(d.maxAvatars) + " · ", 1),
            a[8] || (a[8] = t("span", { class: "text-emerald-500" }, "Green ring", -1)),
            a[9] || (a[9] = de(" = primary · Hover for options ", -1))
          ]))
        ]),
        f(n) ? (v(), p("div", Yt, j(f(n)), 1)) : E("", !0)
      ])) : (v(), p("div", Vt, [
        t("div", Xt, [
          (v(!0), p(te, null, ce(f(r), (e) => (v(), p("div", {
            key: e.id,
            class: W(["flex items-center gap-4 p-3 rounded-xl transition-colors", [
              e.is_primary ? "bg-emerald-500/10 border border-emerald-500/30" : "bg-dark-800 border border-dark-700 hover:border-dark-600"
            ]])
          }, [
            t("button", {
              onClick: (b) => I(e),
              class: W(["flex-shrink-0 w-14 h-14 overflow-hidden transition-transform hover:scale-105", m.value])
            }, [
              t("img", {
                src: f(M)(e, "sm"),
                alt: e.alt_text || e.name || "Avatar",
                class: "w-full h-full object-cover"
              }, null, 8, Wt)
            ], 10, Nt),
            t("div", qt, [
              t("div", Jt, [
                t("span", Gt, j(e.name || "Unnamed avatar"), 1),
                e.is_primary ? (v(), p("span", Kt, " Primary ")) : E("", !0),
                e.moderation_status === "pending" ? (v(), p("span", Qt, " Pending ")) : E("", !0)
              ]),
              t("div", ea, [
                t("span", null, j(X(e.source)), 1),
                a[10] || (a[10] = t("span", null, "·", -1)),
                t("span", null, j(O(e.created_at)), 1),
                e.format === "animated" ? (v(), p("span", ta, "·")) : E("", !0),
                e.format === "animated" ? (v(), p("span", aa, "Animated")) : E("", !0)
              ])
            ]),
            t("div", oa, [
              d.allowEdit ? (v(), p("button", {
                key: 0,
                type: "button",
                onClick: (b) => R(e),
                class: "p-2 text-dark-400 hover:text-primary-400 hover:bg-dark-700 rounded-lg transition-colors",
                title: "Edit crop"
              }, [...a[11] || (a[11] = [
                t("svg", {
                  class: "w-5 h-5",
                  fill: "none",
                  stroke: "currentColor",
                  viewBox: "0 0 24 24"
                }, [
                  t("path", {
                    "stroke-linecap": "round",
                    "stroke-linejoin": "round",
                    "stroke-width": "2",
                    d: "M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  })
                ], -1)
              ])], 8, na)) : E("", !0),
              e.is_primary ? E("", !0) : (v(), p("button", {
                key: 1,
                type: "button",
                onClick: (b) => K(e),
                class: "p-2 text-dark-400 hover:text-emerald-400 hover:bg-dark-700 rounded-lg transition-colors",
                title: "Set as primary"
              }, [...a[12] || (a[12] = [
                t("svg", {
                  class: "w-5 h-5",
                  fill: "none",
                  stroke: "currentColor",
                  viewBox: "0 0 24 24"
                }, [
                  t("path", {
                    "stroke-linecap": "round",
                    "stroke-linejoin": "round",
                    "stroke-width": "2",
                    d: "M5 13l4 4L19 7"
                  })
                ], -1)
              ])], 8, la)),
              d.allowDelete ? (v(), p("button", {
                key: 2,
                type: "button",
                onClick: (b) => J(e),
                class: W(["p-2 rounded-lg transition-colors", s.value === e.id ? "text-white bg-red-600 hover:bg-red-700" : "text-dark-400 hover:text-red-400 hover:bg-dark-700"]),
                title: s.value === e.id ? "Click again to confirm" : "Delete"
              }, [...a[13] || (a[13] = [
                t("svg", {
                  class: "w-5 h-5",
                  fill: "none",
                  stroke: "currentColor",
                  viewBox: "0 0 24 24"
                }, [
                  t("path", {
                    "stroke-linecap": "round",
                    "stroke-linejoin": "round",
                    "stroke-width": "2",
                    d: "M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  })
                ], -1)
              ])], 10, ra)) : E("", !0)
            ])
          ], 2))), 128))
        ]),
        i.value ? (v(), p("button", {
          key: 0,
          type: "button",
          onClick: y,
          disabled: f(P),
          class: "w-full flex items-center justify-center gap-3 p-4 border-2 border-dashed border-dark-600 hover:border-primary-500 rounded-xl transition-colors group"
        }, [
          f(P) ? (v(), p(te, { key: 0 }, [
            a[14] || (a[14] = t("div", { class: "w-5 h-5 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" }, null, -1)),
            t("span", ia, "Uploading... " + j(f(A)) + "%", 1)
          ], 64)) : (v(), p(te, { key: 1 }, [
            a[15] || (a[15] = t("svg", {
              class: "w-5 h-5 text-dark-500 group-hover:text-primary-400 transition-colors",
              fill: "none",
              stroke: "currentColor",
              viewBox: "0 0 24 24"
            }, [
              t("path", {
                "stroke-linecap": "round",
                "stroke-linejoin": "round",
                "stroke-width": "2",
                d: "M12 4v16m8-8H4"
              })
            ], -1)),
            a[16] || (a[16] = t("span", { class: "text-dark-500 group-hover:text-primary-400 transition-colors" }, " Add new avatar ", -1))
          ], 64))
        ], 8, sa)) : E("", !0),
        t("div", ua, [
          t("span", null, j(f(r).length) + " of " + j(d.maxAvatars) + " avatars", 1),
          f(n) ? (v(), p("span", ca, j(f(n)), 1)) : E("", !0)
        ])
      ])),
      s.value ? (v(), p("div", {
        key: 4,
        class: "fixed inset-0 z-40",
        onClick: _
      })) : E("", !0)
    ]));
  }
}), ga = /* @__PURE__ */ re(da, [["__scopeId", "data-v-52a5c188"]]);
export {
  _e as AvatarCropper,
  ga as AvatarManager,
  ma as AvatarUpload,
  Ze as ImageViewer,
  pa as ImageViewerProvider,
  ha as configureAvatarManager,
  fa as configureAvatarUpload,
  Ve as useAvatarCropper,
  xt as useAvatarManager,
  Ye as useAvatarUpload,
  Ce as useImageViewer
};
//# sourceMappingURL=index.js.map
