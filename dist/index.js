import { ref as C, readonly as ce, defineComponent as oe, computed as D, watch as Q, onMounted as se, onUnmounted as he, createBlock as ie, openBlock as i, Teleport as ge, createVNode as ne, Transition as ye, withCtx as ke, createElementBlock as u, createCommentVNode as j, withModifiers as te, createElementVNode as e, toDisplayString as T, withDirectives as ze, normalizeStyle as G, vShow as Se, Fragment as ee, renderList as ae, normalizeClass as W, unref as m, createStaticVNode as Me, createTextVNode as pe, shallowRef as de, nextTick as Ee } from "vue";
const re = C(!1), we = C([]), be = C(0);
let xe = null;
function Ce() {
  function f(k) {
    xe = k;
  }
  function E() {
    return xe;
  }
  function a(k, o = 0) {
    we.value = k, be.value = o, re.value = !0;
  }
  function c() {
    re.value = !1;
  }
  function v(k, o) {
    a([{ url: k, alt: o }], 0);
  }
  return {
    // State (readonly to prevent external mutation)
    isOpen: ce(re),
    images: ce(we),
    initialIndex: ce(be),
    // Actions
    openViewer: a,
    closeViewer: c,
    openImage: v,
    setVariantFetcher: f,
    getVariantFetcher: E,
    // For the provider component
    _setOpen: (k) => {
      re.value = k;
    }
  };
}
const Ie = { class: "viewer-toolbar top" }, Le = {
  key: 0,
  class: "image-counter"
}, Ue = { class: "image-container" }, je = {
  key: 0,
  class: "loading-spinner"
}, Ae = {
  key: 1,
  class: "error-state"
}, Fe = ["src", "alt"], Pe = {
  key: 2,
  class: "loading-variants"
}, Re = { class: "viewer-toolbar bottom" }, Oe = { class: "zoom-controls" }, Te = {
  key: 2,
  class: "thumbnail-strip"
}, De = ["onClick"], Be = ["src", "alt"], He = 0.5, Ze = 5, _e = 0.25, Ye = /* @__PURE__ */ oe({
  __name: "ImageViewer",
  props: {
    images: {},
    initialIndex: { default: 0 },
    open: { type: Boolean }
  },
  emits: ["close", "indexChange"],
  setup(f, { emit: E }) {
    const a = f, c = E, { getVariantFetcher: v } = Ce(), k = C(a.initialIndex), o = C(1), R = C(0), F = C(0), H = C(!1), O = C({ x: 0, y: 0 }), Z = C(!0), Y = C(!1), z = C(!1), $ = C(/* @__PURE__ */ new Map()), p = D(() => a.images[k.value]), d = D(() => {
      const t = p.value;
      if (!t) return null;
      if (t.fileId && $.value.has(t.fileId)) {
        const M = $.value.get(t.fileId);
        return { ...t, variants: M };
      }
      return t;
    }), S = D(() => {
      var M, K, q, V, ue;
      const t = d.value;
      if (!t) return "";
      if (t.variants) {
        if ((M = t.variants.lg) != null && M.url) return t.variants.lg.url;
        if ((K = t.variants.original) != null && K.url) return t.variants.original.url;
        if ((q = t.variants.md) != null && q.url) return t.variants.md.url;
        if ((V = t.variants.sm) != null && V.url) return t.variants.sm.url;
        if ((ue = t.variants.thumb) != null && ue.url) return t.variants.thumb.url;
      }
      return t.url;
    }), w = D(() => a.images.length > 1), y = D(() => k.value > 0), _ = D(() => k.value < a.images.length - 1);
    Q(k, () => {
      o.value = 1, R.value = 0, F.value = 0, Z.value = !0, Y.value = !1, c("indexChange", k.value);
    }), Q(() => a.open, (t) => {
      t ? (k.value = a.initialIndex, o.value = 1, R.value = 0, F.value = 0, Z.value = !0, Y.value = !1, document.body.style.overflow = "hidden", b()) : document.body.style.overflow = "";
    }), Q(p, () => {
      b();
    });
    async function b() {
      var K, q;
      const t = p.value;
      if (!(t != null && t.fileId) || $.value.has(t.fileId) || (K = t.variants) != null && K.lg || (q = t.variants) != null && q.original) return;
      const M = v();
      if (M) {
        z.value = !0;
        try {
          const V = await M(t.fileId);
          V && $.value.set(t.fileId, V);
        } catch (V) {
          console.error("Failed to fetch variants:", V);
        } finally {
          z.value = !1;
        }
      }
    }
    function r() {
      y.value && k.value--;
    }
    function s() {
      _.value && k.value++;
    }
    function g(t) {
      t >= 0 && t < a.images.length && (k.value = t);
    }
    function x() {
      o.value = Math.min(Ze, o.value + _e);
    }
    function L() {
      o.value = Math.max(He, o.value - _e), o.value <= 1 && (R.value = 0, F.value = 0);
    }
    function B() {
      o.value = 1, R.value = 0, F.value = 0;
    }
    function N(t) {
      t.preventDefault(), t.deltaY < 0 ? x() : L();
    }
    function X(t) {
      if (o.value <= 1) return;
      H.value = !0;
      const M = "touches" in t ? t.touches[0] : t;
      O.value = { x: M.clientX - R.value, y: M.clientY - F.value };
    }
    function J(t) {
      if (!H.value) return;
      t.preventDefault();
      const M = "touches" in t ? t.touches[0] : t;
      R.value = M.clientX - O.value.x, F.value = M.clientY - O.value.y;
    }
    function U() {
      H.value = !1;
    }
    function h(t) {
      if (a.open)
        switch (t.key) {
          case "Escape":
            c("close");
            break;
          case "ArrowLeft":
            r();
            break;
          case "ArrowRight":
            s();
            break;
          case "+":
          case "=":
            x();
            break;
          case "-":
            L();
            break;
          case "0":
            B();
            break;
        }
    }
    async function I() {
      if (d.value)
        try {
          const t = S.value, K = await (await fetch(t)).blob(), q = URL.createObjectURL(K), V = document.createElement("a");
          V.href = q, V.download = d.value.alt || `image-${k.value + 1}`, document.body.appendChild(V), V.click(), document.body.removeChild(V), URL.revokeObjectURL(q);
        } catch (t) {
          console.error("Failed to download image:", t);
        }
    }
    function A() {
      Z.value = !1;
    }
    function P() {
      Z.value = !1, Y.value = !0;
    }
    function l(t) {
      t.target.classList.contains("viewer-backdrop") && c("close");
    }
    se(() => {
      window.addEventListener("keydown", h);
    }), he(() => {
      window.removeEventListener("keydown", h), document.body.style.overflow = "";
    });
    const n = D(() => ({
      transform: `scale(${o.value}) translate(${R.value / o.value}px, ${F.value / o.value}px)`,
      cursor: o.value > 1 ? H.value ? "grabbing" : "grab" : "default"
    }));
    return (t, M) => (i(), ie(ge, { to: "body" }, [
      ne(ye, { name: "viewer" }, {
        default: ke(() => {
          var K;
          return [
            f.open ? (i(), u("div", {
              key: 0,
              class: "viewer-backdrop",
              onClick: l,
              onWheel: te(N, ["prevent"])
            }, [
              e("button", {
                class: "viewer-btn close-btn",
                onClick: M[0] || (M[0] = (q) => c("close")),
                title: "Close (Esc)"
              }, [...M[1] || (M[1] = [
                e("svg", {
                  viewBox: "0 0 24 24",
                  fill: "none",
                  stroke: "currentColor",
                  "stroke-width": "2"
                }, [
                  e("path", { d: "M18 6L6 18M6 6l12 12" })
                ], -1)
              ])]),
              e("div", Ie, [
                w.value ? (i(), u("span", Le, T(k.value + 1) + " / " + T(f.images.length), 1)) : j("", !0)
              ]),
              w.value && y.value ? (i(), u("button", {
                key: 0,
                class: "viewer-btn nav-btn prev",
                onClick: te(r, ["stop"]),
                title: "Previous (←)"
              }, [...M[2] || (M[2] = [
                e("svg", {
                  viewBox: "0 0 24 24",
                  fill: "none",
                  stroke: "currentColor",
                  "stroke-width": "2"
                }, [
                  e("path", { d: "M15 18l-6-6 6-6" })
                ], -1)
              ])])) : j("", !0),
              w.value && _.value ? (i(), u("button", {
                key: 1,
                class: "viewer-btn nav-btn next",
                onClick: te(s, ["stop"]),
                title: "Next (→)"
              }, [...M[3] || (M[3] = [
                e("svg", {
                  viewBox: "0 0 24 24",
                  fill: "none",
                  stroke: "currentColor",
                  "stroke-width": "2"
                }, [
                  e("path", { d: "M9 18l6-6-6-6" })
                ], -1)
              ])])) : j("", !0),
              e("div", Ue, [
                Z.value ? (i(), u("div", je, [...M[4] || (M[4] = [
                  e("div", { class: "spinner" }, null, -1)
                ])])) : j("", !0),
                Y.value ? (i(), u("div", Ae, [...M[5] || (M[5] = [
                  e("svg", {
                    viewBox: "0 0 24 24",
                    fill: "none",
                    stroke: "currentColor",
                    "stroke-width": "2"
                  }, [
                    e("circle", {
                      cx: "12",
                      cy: "12",
                      r: "10"
                    }),
                    e("path", { d: "M12 8v4M12 16h.01" })
                  ], -1),
                  e("span", null, "Failed to load image", -1)
                ])])) : j("", !0),
                ze(e("img", {
                  src: S.value,
                  alt: ((K = d.value) == null ? void 0 : K.alt) || "Image",
                  style: G(n.value),
                  class: "viewer-image",
                  draggable: "false",
                  onLoad: A,
                  onError: P,
                  onMousedown: X,
                  onMousemove: J,
                  onMouseup: U,
                  onMouseleave: U,
                  onTouchstart: X,
                  onTouchmove: J,
                  onTouchend: U
                }, null, 44, Fe), [
                  [Se, !Y.value]
                ]),
                z.value ? (i(), u("div", Pe, " Loading full resolution... ")) : j("", !0)
              ]),
              e("div", Re, [
                e("div", Oe, [
                  e("button", {
                    class: "viewer-btn small",
                    onClick: L,
                    title: "Zoom out (-)"
                  }, [...M[6] || (M[6] = [
                    e("svg", {
                      viewBox: "0 0 24 24",
                      fill: "none",
                      stroke: "currentColor",
                      "stroke-width": "2"
                    }, [
                      e("circle", {
                        cx: "11",
                        cy: "11",
                        r: "8"
                      }),
                      e("path", { d: "M21 21l-4.35-4.35M8 11h6" })
                    ], -1)
                  ])]),
                  e("span", {
                    class: "zoom-level",
                    onClick: B,
                    title: "Reset zoom (0)"
                  }, T(Math.round(o.value * 100)) + "% ", 1),
                  e("button", {
                    class: "viewer-btn small",
                    onClick: x,
                    title: "Zoom in (+)"
                  }, [...M[7] || (M[7] = [
                    e("svg", {
                      viewBox: "0 0 24 24",
                      fill: "none",
                      stroke: "currentColor",
                      "stroke-width": "2"
                    }, [
                      e("circle", {
                        cx: "11",
                        cy: "11",
                        r: "8"
                      }),
                      e("path", { d: "M21 21l-4.35-4.35M11 8v6M8 11h6" })
                    ], -1)
                  ])])
                ]),
                e("button", {
                  class: "viewer-btn small",
                  onClick: I,
                  title: "Download"
                }, [...M[8] || (M[8] = [
                  e("svg", {
                    viewBox: "0 0 24 24",
                    fill: "none",
                    stroke: "currentColor",
                    "stroke-width": "2"
                  }, [
                    e("path", { d: "M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3" })
                  ], -1)
                ])])
              ]),
              w.value && f.images.length <= 20 ? (i(), u("div", Te, [
                (i(!0), u(ee, null, ae(f.images, (q, V) => (i(), u("button", {
                  key: V,
                  class: W(["thumbnail", { active: V === k.value }]),
                  onClick: (ue) => g(V)
                }, [
                  e("img", {
                    src: q.thumbnail || q.url,
                    alt: `Thumbnail ${V + 1}`
                  }, null, 8, Be)
                ], 10, De))), 128))
              ])) : j("", !0)
            ], 32)) : j("", !0)
          ];
        }),
        _: 1
      })
    ]));
  }
}), le = (f, E) => {
  const a = f.__vccOpts || f;
  for (const [c, v] of E)
    a[c] = v;
  return a;
}, Ve = /* @__PURE__ */ le(Ye, [["__scopeId", "data-v-a29bab64"]]), Ta = /* @__PURE__ */ oe({
  __name: "ImageViewerProvider",
  setup(f) {
    const { isOpen: E, images: a, initialIndex: c, _setOpen: v } = Ce(), k = D(() => [...a.value]);
    function o() {
      v(!1);
    }
    return (R, F) => (i(), ie(Ve, {
      images: k.value,
      "initial-index": m(c),
      open: m(E),
      onClose: o
    }, null, 8, ["images", "initial-index", "open"]));
  }
}), fe = C({});
function Da(f) {
  fe.value = { ...fe.value, ...f };
}
function Ne(f) {
  const E = C(!1), a = C(0), c = C(null), v = C(null), k = C(null), o = D(() => ({
    uploadUrl: "/api/v1/upload",
    profile: "avatar",
    maxFileSize: 10 * 1024 * 1024,
    // 10MB
    acceptedTypes: ["image/jpeg", "image/png", "image/webp", "image/heic", "image/heif"],
    ...fe.value,
    ...f
  }));
  function R(z) {
    var $;
    return ($ = o.value.acceptedTypes) != null && $.some((p) => z.type === p || z.type.startsWith(p.replace("/*", "/"))) ? o.value.maxFileSize && z.size > o.value.maxFileSize ? {
      message: `File too large. Maximum size is ${Math.round(o.value.maxFileSize / 1048576)}MB.`,
      code: "FILE_TOO_LARGE"
    } : null : {
      message: "Invalid file type. Please select a JPEG, PNG, WebP, or HEIC image.",
      code: "INVALID_TYPE"
    };
  }
  function F(z) {
    const $ = R(z);
    return $ ? (c.value = $, $) : (v.value && URL.revokeObjectURL(v.value), k.value = z, v.value = URL.createObjectURL(z), c.value = null, null);
  }
  function H() {
    v.value && URL.revokeObjectURL(v.value), k.value = null, v.value = null, c.value = null, a.value = 0;
  }
  async function O() {
    if (!k.value)
      return c.value = { message: "No file selected", code: "NO_FILE" }, null;
    E.value = !0, a.value = 0, c.value = null;
    try {
      const z = new FormData();
      z.append("file", k.value), z.append("profile", o.value.profile || "avatar"), o.value.projectId && z.append("project_id", o.value.projectId);
      const $ = {};
      o.value.apiKey && ($.Authorization = `Bearer ${o.value.apiKey}`), o.value.headers && Object.assign($, o.value.headers);
      const p = await new Promise((d, S) => {
        const w = new XMLHttpRequest();
        w.upload.addEventListener("progress", (y) => {
          y.lengthComputable && (a.value = Math.round(y.loaded / y.total * 100));
        }), w.addEventListener("load", () => {
          if (w.status >= 200 && w.status < 300)
            try {
              const y = JSON.parse(w.responseText), _ = y.data || y;
              d({
                id: _.id,
                url: _.url || _.signed_url,
                variants: _.variants || {}
              });
            } catch {
              S({ message: "Invalid response from server", code: "PARSE_ERROR" });
            }
          else {
            let y = "Upload failed";
            try {
              const _ = JSON.parse(w.responseText);
              y = _.error || _.message || y;
            } catch {
            }
            S({ message: y, code: `HTTP_${w.status}` });
          }
        }), w.addEventListener("error", () => {
          S({ message: "Network error during upload", code: "NETWORK_ERROR" });
        }), w.addEventListener("abort", () => {
          S({ message: "Upload cancelled", code: "ABORTED" });
        }), w.open("POST", o.value.uploadUrl);
        for (const [y, _] of Object.entries($))
          w.setRequestHeader(y, _);
        w.send(z);
      });
      return a.value = 100, p;
    } catch (z) {
      return c.value = z, null;
    } finally {
      E.value = !1;
    }
  }
  async function Z(z) {
    return F(z) ? null : O();
  }
  async function Y(z) {
    if (!k.value)
      return c.value = { message: "No file selected", code: "NO_FILE" }, null;
    E.value = !0, a.value = 0, c.value = null;
    try {
      const $ = new FormData();
      $.append("file", k.value), $.append("profile", o.value.profile || "avatar"), $.append("crop_x", String(z.x)), $.append("crop_y", String(z.y)), $.append("crop_width", String(z.width)), $.append("crop_height", String(z.height)), z.zoom !== void 0 && $.append("crop_zoom", String(z.zoom)), o.value.projectId && $.append("project_id", o.value.projectId);
      const p = {};
      o.value.apiKey && (p.Authorization = `Bearer ${o.value.apiKey}`), o.value.headers && Object.assign(p, o.value.headers);
      const d = await new Promise((S, w) => {
        const y = new XMLHttpRequest();
        y.upload.addEventListener("progress", (_) => {
          _.lengthComputable && (a.value = Math.round(_.loaded / _.total * 100));
        }), y.addEventListener("load", () => {
          if (y.status >= 200 && y.status < 300)
            try {
              const _ = JSON.parse(y.responseText), b = _.data || _;
              S({
                id: b.id,
                url: b.url || b.signed_url,
                variants: b.variants || {}
              });
            } catch {
              w({ message: "Invalid response from server", code: "PARSE_ERROR" });
            }
          else {
            let _ = "Upload failed";
            try {
              const b = JSON.parse(y.responseText);
              _ = b.error || b.message || _;
            } catch {
            }
            w({ message: _, code: `HTTP_${y.status}` });
          }
        }), y.addEventListener("error", () => {
          w({ message: "Network error during upload", code: "NETWORK_ERROR" });
        }), y.addEventListener("abort", () => {
          w({ message: "Upload cancelled", code: "ABORTED" });
        }), y.open("POST", o.value.uploadUrl);
        for (const [_, b] of Object.entries(p))
          y.setRequestHeader(_, b);
        y.send($);
      });
      return a.value = 100, d;
    } catch ($) {
      return c.value = $, null;
    } finally {
      E.value = !1;
    }
  }
  return {
    // State
    uploading: E,
    progress: a,
    error: c,
    previewUrl: v,
    selectedFile: k,
    config: o,
    // Methods
    validateFile: R,
    selectFile: F,
    clearSelection: H,
    upload: O,
    selectAndUpload: Z,
    uploadWithCrop: Y
  };
}
const ve = {
  shape: "circle",
  cropSize: 280,
  outputSize: 512,
  maxZoom: 5,
  format: "image/jpeg",
  quality: 0.92,
  mediaProxyUrl: void 0
};
function Xe(f) {
  const E = D(() => ({ ...ve, ...f })), a = C({
    image: null,
    naturalWidth: 0,
    naturalHeight: 0,
    panX: 0,
    panY: 0,
    zoom: 1,
    minZoom: 1,
    maxZoom: ve.maxZoom
  }), c = C(!1), v = C(null), k = C(null), o = C(null);
  function R(r) {
    a.value.image = r, a.value.naturalWidth = r.naturalWidth, a.value.naturalHeight = r.naturalHeight;
    const { cropSize: s } = E.value, g = s / r.naturalWidth, x = s / r.naturalHeight, L = Math.max(g, x);
    console.log("[Cropper] Image initialized:", {
      naturalWidth: r.naturalWidth,
      naturalHeight: r.naturalHeight,
      cropSize: s,
      scaleX: g.toFixed(4),
      scaleY: x.toFixed(4),
      minZoom: L.toFixed(4)
    }), a.value.minZoom = L, a.value.maxZoom = L * E.value.maxZoom, a.value.zoom = L, Y(), console.log("[Cropper] After centering:", {
      panX: a.value.panX.toFixed(2),
      panY: a.value.panY.toFixed(2),
      zoom: a.value.zoom.toFixed(4)
    });
  }
  async function F(r) {
    c.value = !0, v.value = null, k.value = r, o.value && URL.revokeObjectURL(o.value);
    try {
      const s = URL.createObjectURL(r);
      o.value = s;
      const g = await Z(s);
      return R(g), c.value = !1, !0;
    } catch {
      return v.value = "Failed to load image", c.value = !1, !1;
    }
  }
  async function H(r) {
    c.value = !0, v.value = null, k.value = null;
    try {
      let s = r;
      const { mediaProxyUrl: g } = E.value;
      g && O(r) && (s = `${g}?url=${encodeURIComponent(r)}`, console.log("[Cropper] Using proxy for external URL:", s)), o.value = s;
      const x = await Z(s);
      return R(x), c.value = !1, !0;
    } catch (s) {
      return console.error("[Cropper] Failed to load image:", s), v.value = "Failed to load image", c.value = !1, !1;
    }
  }
  function O(r) {
    try {
      return new URL(r).origin !== window.location.origin;
    } catch {
      return !1;
    }
  }
  function Z(r) {
    return new Promise((s, g) => {
      const x = new Image();
      x.crossOrigin = "anonymous", x.onload = () => s(x), x.onerror = () => g(new Error("Failed to load image")), x.src = r;
    });
  }
  function Y() {
    const { cropSize: r } = E.value, { naturalWidth: s, naturalHeight: g, zoom: x } = a.value, L = r / x, B = r / x;
    a.value.panX = (s - L) / 2, a.value.panY = (g - B) / 2;
  }
  function z(r) {
    const { minZoom: s, maxZoom: g } = a.value, x = Math.max(s, Math.min(g, r)), L = a.value.zoom, { cropSize: B } = E.value, N = a.value.panX + B / (2 * L), X = a.value.panY + B / (2 * L);
    a.value.zoom = x, a.value.panX = N - B / (2 * x), a.value.panY = X - B / (2 * x), p();
  }
  function $(r, s) {
    const { zoom: g } = a.value;
    a.value.panX -= r / g, a.value.panY -= s / g, p();
  }
  function p() {
    const { cropSize: r } = E.value, { naturalWidth: s, naturalHeight: g, zoom: x } = a.value, L = r / x, B = r / x, N = s - L, X = g - B;
    a.value.panX = Math.max(0, Math.min(N, a.value.panX)), a.value.panY = Math.max(0, Math.min(X, a.value.panY));
  }
  const d = D(() => {
    if (!a.value.image) return null;
    const { cropSize: r } = E.value, { panX: s, panY: g, zoom: x } = a.value, L = r / x, B = r / x;
    return {
      x: Math.round(s),
      y: Math.round(g),
      width: Math.round(L),
      height: Math.round(B),
      zoom: x
    };
  }), S = D(() => {
    const { zoom: r, panX: s, panY: g } = a.value, x = -s * r, L = -g * r;
    return Math.random() < 0.01 && console.log("[Cropper] Transform:", {
      panX: s.toFixed(2),
      panY: g.toFixed(2),
      zoom: r.toFixed(4),
      translateX: x.toFixed(2),
      translateY: L.toFixed(2)
    }), `translate(${x}px, ${L}px) scale(${r})`;
  });
  async function w() {
    if (!a.value.image || !d.value) return null;
    const { outputSize: r, format: s, quality: g } = E.value, x = d.value, L = document.createElement("canvas");
    L.width = r, L.height = r;
    const B = L.getContext("2d");
    return B ? (B.drawImage(
      a.value.image,
      x.x,
      x.y,
      x.width,
      x.height,
      0,
      0,
      r,
      r
    ), new Promise((N) => {
      L.toBlob(
        (X) => N(X),
        s,
        g
      );
    })) : null;
  }
  async function y(r) {
    const s = await w();
    if (!s) return null;
    const { format: g } = E.value, x = g.split("/")[1], L = r || `avatar-cropped.${x}`;
    return new File([s], L, { type: g });
  }
  function _() {
    o.value && k.value && URL.revokeObjectURL(o.value), a.value = {
      image: null,
      naturalWidth: 0,
      naturalHeight: 0,
      panX: 0,
      panY: 0,
      zoom: 1,
      minZoom: 1,
      maxZoom: ve.maxZoom
    }, k.value = null, o.value = null, v.value = null;
  }
  function b() {
    if (!a.value.image) return;
    const { cropSize: r } = E.value, s = r / a.value.naturalWidth, g = r / a.value.naturalHeight, x = Math.max(s, g);
    a.value.zoom = x, Y();
  }
  return {
    // State
    state: a,
    loading: c,
    error: v,
    sourceFile: k,
    sourceUrl: o,
    cropRegion: d,
    imageTransform: S,
    config: E,
    // Methods
    loadFile: F,
    loadUrl: H,
    setZoom: z,
    pan: $,
    centerImage: Y,
    reset: b,
    exportCrop: w,
    exportCropAsFile: y,
    cleanup: _
  };
}
const We = { class: "avatar-cropper flex flex-col items-center gap-6" }, Ke = { class: "relative" }, qe = { class: "text-sm" }, Je = ["src"], Ge = {
  key: 0,
  class: "absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 hover:opacity-100 transition-opacity pointer-events-none"
}, Qe = {
  key: 0,
  class: "w-full max-w-xs space-y-2"
}, et = { class: "flex items-center gap-3" }, tt = ["disabled"], at = { class: "flex-1 relative" }, ot = ["value"], nt = ["disabled"], lt = { class: "w-12 text-right text-sm text-dark-400 tabular-nums" }, rt = { class: "flex items-center gap-3" }, st = ["disabled"], it = /* @__PURE__ */ oe({
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
  setup(f, { emit: E }) {
    const a = f, c = E, {
      state: v,
      loading: k,
      error: o,
      sourceUrl: R,
      cropRegion: F,
      imageTransform: H,
      config: O,
      loadFile: Z,
      loadUrl: Y,
      setZoom: z,
      pan: $,
      reset: p,
      exportCropAsFile: d,
      cleanup: S
    } = Xe({
      shape: a.shape,
      cropSize: a.cropSize,
      outputSize: a.outputSize,
      ...a.config
    }), w = C(null), y = C(!1), _ = C({ x: 0, y: 0 });
    Q(() => a.file, async (l) => {
      l && await Z(l);
    }, { immediate: !0 }), Q(() => a.url, async (l) => {
      l && !a.file && await Y(l);
    }, { immediate: !0 }), Q(F, (l) => {
      l && c("crop-change", l);
    });
    const b = D(() => v.value.minZoom ? Math.round(v.value.zoom / v.value.minZoom * 100) : 100), r = D({
      get: () => {
        const { zoom: l, minZoom: n, maxZoom: t } = v.value;
        return t === n ? 0 : (l - n) / (t - n);
      },
      set: (l) => {
        const { minZoom: n, maxZoom: t } = v.value, M = n + l * (t - n);
        z(M);
      }
    }), s = D(() => {
      switch (a.shape) {
        case "circle":
          return "rounded-full";
        case "rounded":
          return "rounded-3xl";
        default:
          return "";
      }
    });
    function g(l) {
      if (k.value) return;
      y.value = !0, _.value = { x: l.clientX, y: l.clientY }, l.target.setPointerCapture(l.pointerId);
    }
    function x(l) {
      if (!y.value) return;
      const n = l.clientX - _.value.x, t = l.clientY - _.value.y;
      $(n, t), _.value = { x: l.clientX, y: l.clientY };
    }
    function L(l) {
      y.value = !1, l.target.releasePointerCapture(l.pointerId);
    }
    function B(l) {
      l.preventDefault();
      const n = l.deltaY > 0 ? -0.1 : 0.1, { zoom: t, minZoom: M, maxZoom: K } = v.value, q = K - M, V = t + n * q * 0.3;
      z(V);
    }
    let N = 0;
    function X(l) {
      l.touches.length === 2 && (N = U(l.touches));
    }
    function J(l) {
      if (l.touches.length === 2) {
        l.preventDefault();
        const n = U(l.touches), t = n / N;
        z(v.value.zoom * t), N = n;
      }
    }
    function U(l) {
      const n = l[0].clientX - l[1].clientX, t = l[0].clientY - l[1].clientY;
      return Math.sqrt(n * n + t * t);
    }
    async function h() {
      if (!F.value) return;
      const l = await d();
      l && c("confirm", { file: l, crop: F.value });
    }
    function I() {
      S(), c("cancel");
    }
    function A() {
      p();
    }
    function P(l) {
      l.key === "Escape" ? I() : l.key === "Enter" && h();
    }
    return se(() => {
      document.addEventListener("keydown", P);
    }), he(() => {
      document.removeEventListener("keydown", P), S();
    }), (l, n) => (i(), u("div", We, [
      e("div", Ke, [
        m(k) ? (i(), u("div", {
          key: 0,
          class: W(["flex items-center justify-center bg-dark-800", s.value]),
          style: G({ width: `${f.cropSize}px`, height: `${f.cropSize}px` })
        }, [...n[3] || (n[3] = [
          e("div", { class: "w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" }, null, -1)
        ])], 6)) : m(o) ? (i(), u("div", {
          key: 1,
          class: W(["flex flex-col items-center justify-center gap-2 bg-dark-800 text-red-400", s.value]),
          style: G({ width: `${f.cropSize}px`, height: `${f.cropSize}px` })
        }, [
          n[4] || (n[4] = e("svg", {
            class: "w-8 h-8",
            fill: "none",
            stroke: "currentColor",
            viewBox: "0 0 24 24"
          }, [
            e("path", {
              "stroke-linecap": "round",
              "stroke-linejoin": "round",
              "stroke-width": "2",
              d: "M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            })
          ], -1)),
          e("span", qe, T(m(o)), 1)
        ], 6)) : m(v).image ? (i(), u("div", {
          key: 2,
          ref_key: "cropAreaRef",
          ref: w,
          class: W(["relative overflow-hidden bg-dark-900 select-none touch-none", s.value]),
          style: G({
            width: `${f.cropSize}px`,
            height: `${f.cropSize}px`,
            cursor: y.value ? "grabbing" : "grab"
          }),
          onPointerdown: g,
          onPointermove: x,
          onPointerup: L,
          onPointercancel: L,
          onWheel: B,
          onTouchstart: X,
          onTouchmove: J
        }, [
          e("img", {
            src: m(R) || "",
            alt: "Crop preview",
            class: "pointer-events-none",
            style: G({
              position: "absolute",
              top: "0",
              left: "0",
              width: `${m(v).naturalWidth}px`,
              height: `${m(v).naturalHeight}px`,
              maxWidth: "none",
              maxHeight: "none",
              transformOrigin: "0 0",
              transform: m(H)
            }),
            draggable: "false"
          }, null, 12, Je),
          n[6] || (n[6] = Me('<div class="absolute inset-0 pointer-events-none opacity-0 hover:opacity-100 transition-opacity" data-v-235e5b45><div class="absolute inset-0 border border-white/20" data-v-235e5b45></div><div class="absolute left-1/3 top-0 bottom-0 w-px bg-white/10" data-v-235e5b45></div><div class="absolute right-1/3 top-0 bottom-0 w-px bg-white/10" data-v-235e5b45></div><div class="absolute top-1/3 left-0 right-0 h-px bg-white/10" data-v-235e5b45></div><div class="absolute bottom-1/3 left-0 right-0 h-px bg-white/10" data-v-235e5b45></div><div class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6" data-v-235e5b45><div class="absolute left-1/2 top-0 bottom-0 w-px bg-white/30 -translate-x-1/2" data-v-235e5b45></div><div class="absolute top-1/2 left-0 right-0 h-px bg-white/30 -translate-y-1/2" data-v-235e5b45></div></div></div>', 1)),
          y.value ? j("", !0) : (i(), u("div", Ge, [...n[5] || (n[5] = [
            e("div", { class: "flex items-center gap-2 px-3 py-1.5 bg-black/60 rounded-full text-white text-sm" }, [
              e("svg", {
                class: "w-4 h-4",
                fill: "none",
                stroke: "currentColor",
                viewBox: "0 0 24 24"
              }, [
                e("path", {
                  "stroke-linecap": "round",
                  "stroke-linejoin": "round",
                  "stroke-width": "2",
                  d: "M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"
                })
              ]),
              pe(" Drag to reposition ")
            ], -1)
          ])]))
        ], 38)) : (i(), u("div", {
          key: 3,
          class: W(["flex items-center justify-center bg-dark-800 text-dark-500", s.value]),
          style: G({ width: `${f.cropSize}px`, height: `${f.cropSize}px` })
        }, [...n[7] || (n[7] = [
          e("svg", {
            class: "w-12 h-12",
            fill: "none",
            stroke: "currentColor",
            viewBox: "0 0 24 24"
          }, [
            e("path", {
              "stroke-linecap": "round",
              "stroke-linejoin": "round",
              "stroke-width": "1.5",
              d: "M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
            })
          ], -1)
        ])], 6)),
        a.shape !== "circle" && m(v).image ? (i(), u("div", {
          key: 4,
          class: W(["absolute inset-0 pointer-events-none border-2 border-white/20", s.value])
        }, null, 2)) : j("", !0)
      ]),
      f.showZoomSlider && m(v).image ? (i(), u("div", Qe, [
        e("div", et, [
          e("button", {
            type: "button",
            class: "p-1.5 text-dark-400 hover:text-white rounded-lg hover:bg-dark-700 transition-colors",
            onClick: n[0] || (n[0] = (t) => m(z)(m(v).zoom - (m(v).maxZoom - m(v).minZoom) * 0.1)),
            disabled: m(v).zoom <= m(v).minZoom
          }, [...n[8] || (n[8] = [
            e("svg", {
              class: "w-4 h-4",
              fill: "none",
              stroke: "currentColor",
              viewBox: "0 0 24 24"
            }, [
              e("path", {
                "stroke-linecap": "round",
                "stroke-linejoin": "round",
                "stroke-width": "2",
                d: "M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM13 10H7"
              })
            ], -1)
          ])], 8, tt),
          e("div", at, [
            e("input", {
              type: "range",
              value: r.value,
              min: "0",
              max: "1",
              step: "0.01",
              class: "zoom-slider w-full h-2 bg-dark-700 rounded-full appearance-none cursor-pointer",
              onInput: n[1] || (n[1] = (t) => r.value = parseFloat(t.target.value))
            }, null, 40, ot)
          ]),
          e("button", {
            type: "button",
            class: "p-1.5 text-dark-400 hover:text-white rounded-lg hover:bg-dark-700 transition-colors",
            onClick: n[2] || (n[2] = (t) => m(z)(m(v).zoom + (m(v).maxZoom - m(v).minZoom) * 0.1)),
            disabled: m(v).zoom >= m(v).maxZoom
          }, [...n[9] || (n[9] = [
            e("svg", {
              class: "w-4 h-4",
              fill: "none",
              stroke: "currentColor",
              viewBox: "0 0 24 24"
            }, [
              e("path", {
                "stroke-linecap": "round",
                "stroke-linejoin": "round",
                "stroke-width": "2",
                d: "M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7"
              })
            ], -1)
          ])], 8, nt),
          e("span", lt, T(b.value) + "% ", 1)
        ])
      ])) : j("", !0),
      e("div", rt, [
        f.showReset && m(v).image ? (i(), u("button", {
          key: 0,
          type: "button",
          class: "px-4 py-2 text-sm text-dark-400 hover:text-white rounded-lg hover:bg-dark-700 transition-colors",
          onClick: A
        }, " Reset ")) : j("", !0),
        e("button", {
          type: "button",
          class: "px-4 py-2 text-sm text-dark-300 bg-dark-700 hover:bg-dark-600 rounded-lg transition-colors",
          onClick: I
        }, T(f.cancelLabel), 1),
        e("button", {
          type: "button",
          class: "px-6 py-2 text-sm font-medium text-white bg-primary-600 hover:bg-primary-500 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed",
          disabled: !m(v).image || m(k),
          onClick: h
        }, T(f.confirmLabel), 9, st)
      ])
    ]));
  }
}), $e = /* @__PURE__ */ le(it, [["__scopeId", "data-v-235e5b45"]]), ut = {
  key: 0,
  class: "fixed inset-0 z-50 flex items-center justify-center p-4"
}, ct = { class: "relative bg-dark-900 rounded-2xl p-6 shadow-2xl border border-dark-700 max-w-md w-full" }, dt = ["src"], vt = {
  key: 1,
  class: "w-full h-full bg-gradient-to-br from-slate-600 to-slate-800 flex items-center justify-center"
}, pt = ["width", "height"], ft = {
  key: 2,
  class: "absolute inset-0 bg-black/50 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center"
}, mt = {
  key: 3,
  class: "absolute inset-0 bg-black/60 flex items-center justify-center"
}, ht = {
  key: 0,
  class: "transform -rotate-90",
  width: "60",
  height: "60",
  viewBox: "0 0 100 100"
}, gt = ["stroke-dasharray", "stroke-dashoffset"], yt = { class: "absolute text-white font-medium text-sm" }, kt = {
  key: 0,
  class: "absolute -bottom-6 left-1/2 transform -translate-x-1/2 whitespace-nowrap text-xs text-red-400"
}, wt = /* @__PURE__ */ oe({
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
  setup(f, { emit: E }) {
    const a = f, c = E, {
      uploading: v,
      progress: k,
      error: o,
      previewUrl: R,
      selectedFile: F,
      selectFile: H,
      clearSelection: O,
      upload: Z,
      uploadWithCrop: Y
    } = Ne(a.config), z = C(null), $ = C(!1), p = C(!1), d = C(null), S = C(null), w = D(() => R.value || a.modelValue || null), y = D(() => {
      switch (a.shape) {
        case "rounded":
          return "rounded-2xl";
        case "square":
          return "rounded-none";
        default:
          return "rounded-full";
      }
    }), _ = D(() => 2 * Math.PI * 45), b = D(() => _.value - k.value / 100 * _.value);
    Q(k, (h) => {
      c("upload-progress", h);
    }), Q(o, (h) => {
      h && c("upload-error", h);
    });
    function r() {
      var h;
      !a.editable || v.value || (h = z.value) == null || h.click();
    }
    function s(h) {
      var P;
      const I = h.target, A = (P = I.files) == null ? void 0 : P[0];
      A && g(A), I.value = "";
    }
    function g(h) {
      if (!["image/jpeg", "image/png", "image/webp", "image/heic", "image/heif"].some((A) => h.type === A)) {
        c("upload-error", {
          message: "Invalid file type. Please select a JPEG, PNG, WebP, or HEIC image.",
          code: "INVALID_TYPE"
        });
        return;
      }
      if (c("file-selected", h), a.enableCrop)
        d.value = h, p.value = !0;
      else {
        if (H(h))
          return;
        x();
      }
    }
    async function x() {
      var I, A, P, l;
      if (!F.value) return;
      c("upload-start", F.value);
      const h = await Z();
      if (h) {
        c("upload-success", h);
        const n = ((A = (I = h.variants) == null ? void 0 : I.lg) == null ? void 0 : A.url) || ((l = (P = h.variants) == null ? void 0 : P.md) == null ? void 0 : l.url) || h.url;
        c("update:modelValue", n), O();
      }
    }
    async function L(h) {
      var P, l, n, t;
      if (p.value = !1, d.value = null, S.value = h.crop, c("crop-applied", h), H(h.file))
        return;
      c("upload-start", h.file);
      const A = await Y(h.crop);
      if (A) {
        c("upload-success", { ...A, crop: h.crop });
        const M = ((l = (P = A.variants) == null ? void 0 : P.lg) == null ? void 0 : l.url) || ((t = (n = A.variants) == null ? void 0 : n.md) == null ? void 0 : t.url) || A.url;
        c("update:modelValue", M), O();
      }
    }
    function B() {
      p.value = !1, d.value = null;
    }
    function N(h) {
      h.preventDefault(), a.editable && !v.value && ($.value = !0);
    }
    function X(h) {
      h.preventDefault(), $.value = !1;
    }
    function J(h) {
      h.preventDefault();
    }
    function U(h) {
      var A;
      if (h.preventDefault(), $.value = !1, !a.editable || v.value) return;
      const I = (A = h.dataTransfer) == null ? void 0 : A.files[0];
      I && I.type.startsWith("image/") && g(I);
    }
    return he(() => {
      O();
    }), (h, I) => (i(), u("div", null, [
      (i(), ie(ge, { to: "body" }, [
        ne(ye, { name: "fade" }, {
          default: ke(() => [
            p.value && d.value ? (i(), u("div", ut, [
              e("div", {
                class: "absolute inset-0 bg-black/80 backdrop-blur-sm",
                onClick: B
              }),
              e("div", ct, [
                I[0] || (I[0] = e("h3", { class: "text-lg font-semibold text-white mb-4 text-center" }, " Adjust your photo ", -1)),
                ne($e, {
                  file: d.value,
                  shape: f.shape,
                  "crop-size": f.cropSize,
                  "output-size": f.cropOutputSize,
                  "confirm-label": "Save",
                  onConfirm: L,
                  onCancel: B
                }, null, 8, ["file", "shape", "crop-size", "output-size"])
              ])
            ])) : j("", !0)
          ]),
          _: 1
        })
      ])),
      e("div", {
        class: W(["avatar-upload-container relative inline-block", f.containerClass]),
        style: G({ width: `${f.size}px`, height: `${f.size}px` })
      }, [
        e("input", {
          ref_key: "fileInput",
          ref: z,
          type: "file",
          accept: "image/jpeg,image/png,image/webp,image/heic,image/heif",
          class: "hidden",
          onChange: s
        }, null, 544),
        e("div", {
          class: W(["avatar-upload relative w-full h-full overflow-hidden transition-all duration-200", [
            y.value,
            f.editable && !m(v) ? "cursor-pointer hover:ring-4 hover:ring-primary-500/30" : "",
            $.value ? "ring-4 ring-primary-500 scale-105" : "",
            m(o) ? "ring-2 ring-red-500" : ""
          ]]),
          onClick: r,
          onDragenter: N,
          onDragleave: X,
          onDragover: J,
          onDrop: U
        }, [
          w.value ? (i(), u("img", {
            key: 0,
            src: w.value,
            alt: "Avatar",
            class: "w-full h-full object-cover"
          }, null, 8, dt)) : (i(), u("div", vt, [
            f.placeholder ? (i(), u("span", {
              key: 0,
              class: "text-white font-semibold",
              style: G({ fontSize: `${f.size / 3}px` })
            }, T(f.placeholder), 5)) : (i(), u("svg", {
              key: 1,
              class: "text-slate-400",
              width: f.size / 2.5,
              height: f.size / 2.5,
              fill: "currentColor",
              viewBox: "0 0 24 24"
            }, [...I[1] || (I[1] = [
              e("path", { d: "M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" }, null, -1)
            ])], 8, pt))
          ])),
          f.editable && !m(v) ? (i(), u("div", ft, [...I[2] || (I[2] = [
            e("svg", {
              class: "text-white",
              width: "24",
              height: "24",
              fill: "none",
              stroke: "currentColor",
              viewBox: "0 0 24 24"
            }, [
              e("path", {
                "stroke-linecap": "round",
                "stroke-linejoin": "round",
                "stroke-width": "2",
                d: "M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
              }),
              e("path", {
                "stroke-linecap": "round",
                "stroke-linejoin": "round",
                "stroke-width": "2",
                d: "M15 13a3 3 0 11-6 0 3 3 0 016 0z"
              })
            ], -1)
          ])])) : j("", !0),
          m(v) ? (i(), u("div", mt, [
            f.showProgress ? (i(), u("svg", ht, [
              I[3] || (I[3] = e("circle", {
                cx: "50",
                cy: "50",
                r: "45",
                fill: "none",
                stroke: "currentColor",
                "stroke-width": "6",
                class: "text-white/20"
              }, null, -1)),
              e("circle", {
                cx: "50",
                cy: "50",
                r: "45",
                fill: "none",
                stroke: "currentColor",
                "stroke-width": "6",
                "stroke-linecap": "round",
                class: "text-primary-500 transition-all duration-200",
                "stroke-dasharray": _.value,
                "stroke-dashoffset": b.value
              }, null, 8, gt)
            ])) : j("", !0),
            e("span", yt, T(m(k)) + "%", 1)
          ])) : j("", !0)
        ], 34),
        m(o) && !m(v) ? (i(), u("div", kt, T(m(o).message), 1)) : j("", !0)
      ], 6)
    ]));
  }
}), Ba = /* @__PURE__ */ le(wt, [["__scopeId", "data-v-9d8f9209"]]), me = C({});
function Ha(f) {
  me.value = { ...me.value, ...f };
}
function bt(f) {
  const E = C([]), a = C(!1), c = C(null), v = C(!1), k = C(0), o = D(() => ({
    apiBaseUrl: "/api",
    getHeaders: () => ({}),
    ...me.value,
    ...f
  })), R = D(() => E.value.find((p) => p.is_primary));
  async function F() {
    a.value = !0, c.value = null;
    try {
      let p = `${o.value.apiBaseUrl}/avatars`;
      const d = new URLSearchParams();
      o.value.projectId && d.set("project_id", o.value.projectId), o.value.entityType && d.set("entity_type", o.value.entityType), o.value.entityId && d.set("entity_id", o.value.entityId), d.toString() && (p += `?${d.toString()}`);
      const S = await fetch(p, {
        headers: o.value.getHeaders()
      });
      if (!S.ok)
        throw new Error(await S.text());
      const w = await S.json();
      E.value = w.avatars || [];
    } catch (p) {
      c.value = p.message || "Failed to fetch avatars";
    } finally {
      a.value = !1;
    }
  }
  async function H(p) {
    c.value = null;
    try {
      const d = await fetch(`${o.value.apiBaseUrl}/avatars`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...o.value.getHeaders()
        },
        body: JSON.stringify({
          original_url: p.original_url,
          file_id: p.file_id,
          name: p.name,
          is_primary: p.is_primary ?? !1,
          source: "upload",
          format: "static",
          variants: p.variants,
          blurhash: p.blurhash,
          dominant_color: p.dominant_color,
          alt_text: p.alt_text,
          fallback_type: p.fallback_initials ? "initials" : "default",
          fallback_data: p.fallback_initials ? { initials: p.fallback_initials } : void 0
        })
      });
      if (!d.ok)
        throw new Error(await d.text());
      const S = await d.json();
      return await F(), S;
    } catch (d) {
      return c.value = d.message || "Failed to create avatar", null;
    }
  }
  async function O(p) {
    c.value = null;
    try {
      const d = await fetch(`${o.value.apiBaseUrl}/avatars/${p}/primary`, {
        method: "POST",
        headers: o.value.getHeaders()
      });
      if (!d.ok)
        throw new Error(await d.text());
      return E.value = E.value.map((S) => ({
        ...S,
        is_primary: S.id === p
      })), !0;
    } catch (d) {
      return c.value = d.message || "Failed to set primary avatar", !1;
    }
  }
  async function Z(p) {
    c.value = null;
    try {
      const d = await fetch(`${o.value.apiBaseUrl}/avatars/${p}`, {
        method: "DELETE",
        headers: o.value.getHeaders()
      });
      if (!d.ok)
        throw new Error(await d.text());
      return E.value = E.value.filter((S) => S.id !== p), !0;
    } catch (d) {
      return c.value = d.message || "Failed to delete avatar", !1;
    }
  }
  async function Y(p, d) {
    c.value = null;
    try {
      const S = await fetch(`${o.value.apiBaseUrl}/avatars/${p}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...o.value.getHeaders()
        },
        body: JSON.stringify(d)
      });
      if (!S.ok)
        throw new Error(await S.text());
      const w = await S.json();
      return E.value = E.value.map(
        (y) => y.id === p ? w : y
      ), w;
    } catch (S) {
      return c.value = S.message || "Failed to update avatar", null;
    }
  }
  async function z(p, d) {
    if (!o.value.uploadUrl)
      return c.value = "Upload URL not configured", null;
    v.value = !0, k.value = 0, c.value = null;
    try {
      const S = new FormData();
      S.append("file", p), S.append("profile", "avatar");
      const w = await new Promise((_, b) => {
        const r = new XMLHttpRequest();
        r.upload.addEventListener("progress", (g) => {
          g.lengthComputable && (k.value = Math.round(g.loaded / g.total * 100));
        }), r.addEventListener("load", () => {
          if (r.status >= 200 && r.status < 300)
            try {
              const g = JSON.parse(r.responseText);
              _(g.data || g);
            } catch {
              b(new Error("Invalid response from server"));
            }
          else {
            let g = "Upload failed";
            try {
              const x = JSON.parse(r.responseText);
              g = x.error || x.message || g;
            } catch {
            }
            b(new Error(g));
          }
        }), r.addEventListener("error", () => b(new Error("Network error"))), r.addEventListener("abort", () => b(new Error("Upload cancelled"))), r.open("POST", o.value.uploadUrl);
        const s = o.value.getHeaders();
        for (const [g, x] of Object.entries(s))
          r.setRequestHeader(g, x);
        r.send(S);
      });
      return k.value = 100, await H({
        original_url: w.url || w.signed_url,
        file_id: w.id,
        name: d == null ? void 0 : d.name,
        is_primary: d == null ? void 0 : d.is_primary,
        variants: w.variants,
        fallback_initials: d == null ? void 0 : d.fallback_initials
      });
    } catch (S) {
      return c.value = S.message || "Failed to upload avatar", null;
    } finally {
      v.value = !1;
    }
  }
  function $(p, d = "md") {
    var w, y, _, b, r, s, g;
    if (d === "original")
      return p.original_url;
    if (d === "source")
      return ((w = p.variants.source) == null ? void 0 : w.url) || p.original_url;
    const S = p.variants[d];
    return S ? S.url : d === "sm" ? ((y = p.variants.md) == null ? void 0 : y.url) || ((_ = p.variants.lg) == null ? void 0 : _.url) || p.original_url : d === "md" ? ((b = p.variants.lg) == null ? void 0 : b.url) || ((r = p.variants.sm) == null ? void 0 : r.url) || p.original_url : d === "lg" && (((s = p.variants.md) == null ? void 0 : s.url) || ((g = p.variants.sm) == null ? void 0 : g.url)) || p.original_url;
  }
  return {
    // State
    avatars: E,
    loading: a,
    error: c,
    uploading: v,
    uploadProgress: k,
    primaryAvatar: R,
    config: o,
    // Methods
    fetchAvatars: F,
    createAvatar: H,
    setPrimary: O,
    deleteAvatar: Z,
    updateAvatar: Y,
    uploadAndCreateAvatar: z,
    getAvatarUrl: $
  };
}
const xt = { class: "avatar-manager" }, _t = {
  key: 0,
  class: "fixed inset-0 z-50 flex items-center justify-center p-4"
}, Ct = { class: "relative bg-dark-900 rounded-2xl p-6 shadow-2xl border border-dark-700 max-w-md w-full" }, $t = { class: "text-lg font-semibold text-white mb-4 text-center" }, zt = {
  key: 0,
  class: "flex items-center justify-center py-8"
}, St = {
  key: 1,
  class: "text-center py-8"
}, Mt = { class: "text-red-400 mb-2" }, Et = {
  key: 2,
  class: "space-y-3"
}, It = { class: "flex flex-wrap gap-3" }, Lt = ["onClick"], Ut = ["src", "alt"], jt = {
  key: 0,
  class: "absolute -top-1 -right-1 w-5 h-5 bg-yellow-500 rounded-full flex items-center justify-center shadow-lg",
  title: "Pending moderation"
}, At = ["onClick"], Ft = ["onClick"], Pt = ["onClick", "title"], Rt = ["disabled"], Ot = {
  key: 0,
  class: "relative w-full h-full flex items-center justify-center"
}, Tt = {
  class: "absolute inset-2 w-auto h-auto",
  viewBox: "0 0 36 36"
}, Dt = ["stroke-dasharray"], Bt = { class: "text-xs font-medium text-dark-300" }, Ht = {
  key: 1,
  class: "text-dark-500 hover:text-primary-400 transition-colors"
}, Zt = { class: "text-xs text-dark-500" }, Yt = { key: 0 }, Vt = { key: 1 }, Nt = {
  key: 0,
  class: "text-sm text-red-400"
}, Xt = {
  key: 3,
  class: "space-y-3"
}, Wt = { class: "space-y-2" }, Kt = ["onClick"], qt = ["src", "alt"], Jt = { class: "flex-1 min-w-0" }, Gt = { class: "flex items-center gap-2" }, Qt = { class: "font-medium text-white truncate" }, ea = {
  key: 0,
  class: "px-2 py-0.5 text-xs font-medium bg-emerald-500/20 text-emerald-400 rounded-full"
}, ta = {
  key: 1,
  class: "px-2 py-0.5 text-xs font-medium bg-yellow-500/20 text-yellow-400 rounded-full"
}, aa = { class: "flex items-center gap-3 mt-1 text-xs text-dark-400" }, oa = { key: 0 }, na = {
  key: 1,
  class: "text-purple-400"
}, la = { class: "flex items-center gap-2" }, ra = ["onClick"], sa = ["onClick"], ia = ["onClick", "title"], ua = ["disabled"], ca = { class: "text-dark-400" }, da = { class: "flex items-center justify-between text-xs text-dark-500" }, va = {
  key: 0,
  class: "text-red-400"
}, pa = /* @__PURE__ */ oe({
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
  setup(f, { emit: E }) {
    const a = f, c = E, {
      avatars: v,
      loading: k,
      error: o,
      uploading: R,
      uploadProgress: F,
      config: H,
      fetchAvatars: O,
      setPrimary: Z,
      deleteAvatar: Y,
      uploadAndCreateAvatar: z,
      getAvatarUrl: $
    } = bt(a.config), p = C(null), d = C(null), S = C(null), w = C(!1), y = C("upload"), _ = C(null), b = C(null), r = D(() => a.allowUpload && v.value.length < a.maxAvatars), s = D(() => {
      switch (a.shape) {
        case "circle":
          return "rounded-full";
        case "square":
          return "rounded-none";
        case "rounded":
          return "rounded-xl";
        default:
          return "rounded-full";
      }
    }), g = D(() => b.value ? b.value.original_url : null);
    se(() => {
      O();
    });
    function x() {
      var l;
      (l = p.value) == null || l.click();
    }
    async function L(l) {
      var M;
      const n = l.target, t = (M = n.files) == null ? void 0 : M[0];
      if (t)
        if (n.value = "", a.enableCropOnUpload)
          _.value = t, y.value = "upload", w.value = !0;
        else {
          const K = await z(t, {
            name: `Avatar ${v.value.length + 1}`,
            is_primary: v.value.length === 0,
            fallback_initials: a.initials
          });
          K ? c("upload-success", K) : o.value && c("upload-error", o.value);
        }
    }
    function B(l) {
      b.value = l, y.value = "edit", w.value = !0;
    }
    async function N(l) {
      if (w.value = !1, y.value === "upload" && _.value) {
        const n = await z(l.file, {
          name: `Avatar ${v.value.length + 1}`,
          is_primary: v.value.length === 0,
          fallback_initials: a.initials,
          crop: l.crop
        });
        n ? c("upload-success", n) : o.value && c("upload-error", o.value);
      } else if (y.value === "edit" && b.value) {
        const n = await z(l.file, {
          name: b.value.name,
          is_primary: b.value.is_primary,
          fallback_initials: a.initials,
          crop: l.crop
        });
        n ? (await Y(b.value.id), c("crop-updated", n, l.crop)) : o.value && c("upload-error", o.value);
      }
      _.value = null, b.value = null;
    }
    function X() {
      w.value = !1, _.value = null, b.value = null;
    }
    async function J(l) {
      if (l.is_primary) return;
      await Z(l.id) && c("primary-changed", l);
    }
    async function U(l) {
      if (d.value !== l.id) {
        d.value = l.id;
        return;
      }
      await Y(l.id) && (c("delete", l), d.value = null);
    }
    function h() {
      d.value = null;
    }
    function I(l) {
      S.value = l.id, c("select", l);
    }
    function A(l) {
      const n = new Date(l);
      return n.toLocaleDateString(void 0, {
        month: "short",
        day: "numeric",
        year: n.getFullYear() !== (/* @__PURE__ */ new Date()).getFullYear() ? "numeric" : void 0
      });
    }
    function P(l) {
      return {
        upload: "Uploaded",
        gravatar: "Gravatar",
        oauth: "OAuth",
        generated: "Generated",
        ai: "AI Generated"
      }[l] || l;
    }
    return (l, n) => (i(), u("div", xt, [
      e("input", {
        ref_key: "fileInputRef",
        ref: p,
        type: "file",
        accept: "image/*",
        class: "hidden",
        onChange: L
      }, null, 544),
      (i(), ie(ge, { to: "body" }, [
        ne(ye, { name: "fade" }, {
          default: ke(() => [
            w.value && (_.value || b.value) ? (i(), u("div", _t, [
              e("div", {
                class: "absolute inset-0 bg-black/80 backdrop-blur-sm",
                onClick: X
              }),
              e("div", Ct, [
                e("h3", $t, T(y.value === "edit" ? "Adjust your photo" : "Position your photo"), 1),
                ne($e, {
                  file: _.value,
                  url: g.value,
                  shape: f.shape,
                  "crop-size": f.cropSize,
                  config: { mediaProxyUrl: m(H).mediaProxyUrl },
                  "confirm-label": y.value === "edit" ? "Save changes" : "Upload",
                  onConfirm: N,
                  onCancel: X
                }, null, 8, ["file", "url", "shape", "crop-size", "config", "confirm-label"])
              ])
            ])) : j("", !0)
          ]),
          _: 1
        })
      ])),
      m(k) && m(v).length === 0 ? (i(), u("div", zt, [...n[1] || (n[1] = [
        e("div", { class: "w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" }, null, -1)
      ])])) : m(o) && m(v).length === 0 ? (i(), u("div", St, [
        e("div", Mt, T(m(o)), 1),
        e("button", {
          onClick: n[0] || (n[0] = //@ts-ignore
          (...t) => m(O) && m(O)(...t)),
          class: "text-sm text-primary-400 hover:text-primary-300 underline"
        }, " Try again ")
      ])) : f.mode === "compact" ? (i(), u("div", Et, [
        e("div", It, [
          (i(!0), u(ee, null, ae(m(v), (t) => (i(), u("div", {
            key: t.id,
            class: "relative group",
            style: G({ width: `${f.avatarSize}px`, height: `${f.avatarSize}px` })
          }, [
            e("button", {
              onClick: (M) => I(t),
              class: W(["w-full h-full overflow-hidden transition-all duration-200", [
                s.value,
                t.is_primary ? "ring-[3px] ring-emerald-500 ring-offset-2 ring-offset-dark-900" : S.value === t.id ? "ring-2 ring-dark-400 ring-offset-2 ring-offset-dark-900" : "ring-2 ring-transparent hover:ring-dark-500 ring-offset-2 ring-offset-dark-900"
              ]])
            }, [
              e("img", {
                src: m($)(t, "md"),
                alt: t.alt_text || t.name || "Avatar",
                class: "w-full h-full object-cover",
                style: G(t.dominant_color ? { backgroundColor: t.dominant_color } : {})
              }, null, 12, Ut)
            ], 10, Lt),
            t.moderation_status === "pending" ? (i(), u("div", jt, [...n[2] || (n[2] = [
              e("svg", {
                class: "w-3 h-3 text-white",
                fill: "currentColor",
                viewBox: "0 0 20 20"
              }, [
                e("path", {
                  "fill-rule": "evenodd",
                  d: "M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z",
                  "clip-rule": "evenodd"
                })
              ], -1)
            ])])) : j("", !0),
            e("div", {
              class: W(["absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1", [
                s.value,
                d.value === t.id ? "z-50 opacity-100" : "z-10"
              ]])
            }, [
              f.allowEdit ? (i(), u("button", {
                key: 0,
                type: "button",
                onClick: te((M) => B(t), ["stop"]),
                class: "p-1.5 bg-dark-700 hover:bg-primary-600 rounded-lg transition-colors",
                title: "Edit crop"
              }, [...n[3] || (n[3] = [
                e("svg", {
                  class: "w-4 h-4 text-white",
                  fill: "none",
                  stroke: "currentColor",
                  viewBox: "0 0 24 24"
                }, [
                  e("path", {
                    "stroke-linecap": "round",
                    "stroke-linejoin": "round",
                    "stroke-width": "2",
                    d: "M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  })
                ], -1)
              ])], 8, At)) : j("", !0),
              t.is_primary ? j("", !0) : (i(), u("button", {
                key: 1,
                type: "button",
                onClick: te((M) => J(t), ["stop"]),
                class: "p-1.5 bg-dark-700 hover:bg-emerald-600 rounded-lg transition-colors",
                title: "Set as primary"
              }, [...n[4] || (n[4] = [
                e("svg", {
                  class: "w-4 h-4 text-white",
                  fill: "none",
                  stroke: "currentColor",
                  viewBox: "0 0 24 24"
                }, [
                  e("path", {
                    "stroke-linecap": "round",
                    "stroke-linejoin": "round",
                    "stroke-width": "2",
                    d: "M5 13l4 4L19 7"
                  })
                ], -1)
              ])], 8, Ft)),
              f.allowDelete ? (i(), u("button", {
                key: 2,
                type: "button",
                onClick: te((M) => U(t), ["stop"]),
                class: W(["p-1.5 rounded-lg transition-colors", d.value === t.id ? "bg-red-600 hover:bg-red-700" : "bg-dark-700 hover:bg-red-600"]),
                title: d.value === t.id ? "Click again to confirm" : "Delete"
              }, [...n[5] || (n[5] = [
                e("svg", {
                  class: "w-4 h-4 text-white",
                  fill: "none",
                  stroke: "currentColor",
                  viewBox: "0 0 24 24"
                }, [
                  e("path", {
                    "stroke-linecap": "round",
                    "stroke-linejoin": "round",
                    "stroke-width": "2",
                    d: "M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  })
                ], -1)
              ])], 10, Pt)) : j("", !0)
            ], 2)
          ], 4))), 128)),
          r.value ? (i(), u("button", {
            key: 0,
            type: "button",
            onClick: x,
            disabled: m(R),
            class: W(["flex items-center justify-center border-2 border-dashed border-dark-600 hover:border-primary-500 transition-colors", s.value]),
            style: G({ width: `${f.avatarSize}px`, height: `${f.avatarSize}px` })
          }, [
            m(R) ? (i(), u("div", Ot, [
              (i(), u("svg", Tt, [
                n[6] || (n[6] = e("path", {
                  class: "text-dark-700",
                  stroke: "currentColor",
                  "stroke-width": "3",
                  fill: "none",
                  d: "M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                }, null, -1)),
                e("path", {
                  class: "text-primary-500",
                  stroke: "currentColor",
                  "stroke-width": "3",
                  fill: "none",
                  "stroke-linecap": "round",
                  "stroke-dasharray": `${m(F)}, 100`,
                  d: "M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                }, null, 8, Dt)
              ])),
              e("span", Bt, T(m(F)) + "%", 1)
            ])) : (i(), u("div", Ht, [...n[7] || (n[7] = [
              e("svg", {
                class: "w-6 h-6",
                fill: "none",
                stroke: "currentColor",
                viewBox: "0 0 24 24"
              }, [
                e("path", {
                  "stroke-linecap": "round",
                  "stroke-linejoin": "round",
                  "stroke-width": "2",
                  d: "M12 4v16m8-8H4"
                })
              ], -1)
            ])]))
          ], 14, Rt)) : j("", !0)
        ]),
        e("p", Zt, [
          m(v).length === 0 ? (i(), u("span", Yt, "Upload your first avatar")) : (i(), u("span", Vt, [
            pe(T(m(v).length) + "/" + T(f.maxAvatars) + " · ", 1),
            n[8] || (n[8] = e("span", { class: "text-emerald-500" }, "Green ring", -1)),
            n[9] || (n[9] = pe(" = primary · Hover for options ", -1))
          ]))
        ]),
        m(o) ? (i(), u("div", Nt, T(m(o)), 1)) : j("", !0)
      ])) : (i(), u("div", Xt, [
        e("div", Wt, [
          (i(!0), u(ee, null, ae(m(v), (t) => (i(), u("div", {
            key: t.id,
            class: W(["flex items-center gap-4 p-3 rounded-xl transition-colors", [
              t.is_primary ? "bg-emerald-500/10 border border-emerald-500/30" : "bg-dark-800 border border-dark-700 hover:border-dark-600"
            ]])
          }, [
            e("button", {
              onClick: (M) => I(t),
              class: W(["flex-shrink-0 w-14 h-14 overflow-hidden transition-transform hover:scale-105", s.value])
            }, [
              e("img", {
                src: m($)(t, "sm"),
                alt: t.alt_text || t.name || "Avatar",
                class: "w-full h-full object-cover"
              }, null, 8, qt)
            ], 10, Kt),
            e("div", Jt, [
              e("div", Gt, [
                e("span", Qt, T(t.name || "Unnamed avatar"), 1),
                t.is_primary ? (i(), u("span", ea, " Primary ")) : j("", !0),
                t.moderation_status === "pending" ? (i(), u("span", ta, " Pending ")) : j("", !0)
              ]),
              e("div", aa, [
                e("span", null, T(P(t.source)), 1),
                n[10] || (n[10] = e("span", null, "·", -1)),
                e("span", null, T(A(t.created_at)), 1),
                t.format === "animated" ? (i(), u("span", oa, "·")) : j("", !0),
                t.format === "animated" ? (i(), u("span", na, "Animated")) : j("", !0)
              ])
            ]),
            e("div", la, [
              f.allowEdit ? (i(), u("button", {
                key: 0,
                type: "button",
                onClick: (M) => B(t),
                class: "p-2 text-dark-400 hover:text-primary-400 hover:bg-dark-700 rounded-lg transition-colors",
                title: "Edit crop"
              }, [...n[11] || (n[11] = [
                e("svg", {
                  class: "w-5 h-5",
                  fill: "none",
                  stroke: "currentColor",
                  viewBox: "0 0 24 24"
                }, [
                  e("path", {
                    "stroke-linecap": "round",
                    "stroke-linejoin": "round",
                    "stroke-width": "2",
                    d: "M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  })
                ], -1)
              ])], 8, ra)) : j("", !0),
              t.is_primary ? j("", !0) : (i(), u("button", {
                key: 1,
                type: "button",
                onClick: (M) => J(t),
                class: "p-2 text-dark-400 hover:text-emerald-400 hover:bg-dark-700 rounded-lg transition-colors",
                title: "Set as primary"
              }, [...n[12] || (n[12] = [
                e("svg", {
                  class: "w-5 h-5",
                  fill: "none",
                  stroke: "currentColor",
                  viewBox: "0 0 24 24"
                }, [
                  e("path", {
                    "stroke-linecap": "round",
                    "stroke-linejoin": "round",
                    "stroke-width": "2",
                    d: "M5 13l4 4L19 7"
                  })
                ], -1)
              ])], 8, sa)),
              f.allowDelete ? (i(), u("button", {
                key: 2,
                type: "button",
                onClick: (M) => U(t),
                class: W(["p-2 rounded-lg transition-colors", d.value === t.id ? "text-white bg-red-600 hover:bg-red-700" : "text-dark-400 hover:text-red-400 hover:bg-dark-700"]),
                title: d.value === t.id ? "Click again to confirm" : "Delete"
              }, [...n[13] || (n[13] = [
                e("svg", {
                  class: "w-5 h-5",
                  fill: "none",
                  stroke: "currentColor",
                  viewBox: "0 0 24 24"
                }, [
                  e("path", {
                    "stroke-linecap": "round",
                    "stroke-linejoin": "round",
                    "stroke-width": "2",
                    d: "M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  })
                ], -1)
              ])], 10, ia)) : j("", !0)
            ])
          ], 2))), 128))
        ]),
        r.value ? (i(), u("button", {
          key: 0,
          type: "button",
          onClick: x,
          disabled: m(R),
          class: "w-full flex items-center justify-center gap-3 p-4 border-2 border-dashed border-dark-600 hover:border-primary-500 rounded-xl transition-colors group"
        }, [
          m(R) ? (i(), u(ee, { key: 0 }, [
            n[14] || (n[14] = e("div", { class: "w-5 h-5 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" }, null, -1)),
            e("span", ca, "Uploading... " + T(m(F)) + "%", 1)
          ], 64)) : (i(), u(ee, { key: 1 }, [
            n[15] || (n[15] = e("svg", {
              class: "w-5 h-5 text-dark-500 group-hover:text-primary-400 transition-colors",
              fill: "none",
              stroke: "currentColor",
              viewBox: "0 0 24 24"
            }, [
              e("path", {
                "stroke-linecap": "round",
                "stroke-linejoin": "round",
                "stroke-width": "2",
                d: "M12 4v16m8-8H4"
              })
            ], -1)),
            n[16] || (n[16] = e("span", { class: "text-dark-500 group-hover:text-primary-400 transition-colors" }, " Add new avatar ", -1))
          ], 64))
        ], 8, ua)) : j("", !0),
        e("div", da, [
          e("span", null, T(m(v).length) + " of " + T(f.maxAvatars) + " avatars", 1),
          m(o) ? (i(), u("span", va, T(m(o)), 1)) : j("", !0)
        ])
      ])),
      d.value ? (i(), u("div", {
        key: 4,
        class: "fixed inset-0 z-40",
        onClick: h
      })) : j("", !0)
    ]));
  }
}), Za = /* @__PURE__ */ le(pa, [["__scopeId", "data-v-52a5c188"]]), fa = [
  { id: "favorites", name: "Favorites", icon: "⭐" },
  { id: "smileys", name: "Smileys", icon: "😀" },
  { id: "people", name: "People", icon: "👋" },
  { id: "animals", name: "Animals", icon: "🐶" },
  { id: "food", name: "Food", icon: "🍔" },
  { id: "travel", name: "Travel", icon: "✈️" },
  { id: "activities", name: "Activities", icon: "⚽" },
  { id: "objects", name: "Objects", icon: "💡" },
  { id: "symbols", name: "Symbols", icon: "❤️" },
  { id: "flags", name: "Flags", icon: "🏳️" }
], ma = {
  smileys: ["😀", "😃", "😄", "😁", "😅", "😂", "🤣", "😊", "😇", "🙂", "😉", "😍", "🥰", "😘", "😎", "🤔", "😴", "🥳"],
  people: ["👋", "👌", "✌️", "👍", "👎", "👏", "🙌", "🤝", "🙏", "💪", "🤘", "🖕"],
  animals: ["🐶", "🐱", "🐭", "🐹", "🐰", "🦊", "🐻", "🐼", "🐸", "🦁", "🐮", "🐷", "🐵", "🦄", "🐝", "🦋", "🐢", "🦈"],
  food: ["🍏", "🍎", "🍌", "🍕", "🍔", "🍟", "🌮", "🍣", "🍩", "🍪", "🎂", "🍺", "☕", "🍷"],
  travel: ["🚗", "✈️", "🚀", "🏠", "🏖️", "🌅", "🏔️", "🗽"],
  activities: ["⚽", "🏀", "🎾", "🎮", "🎬", "🎤", "🎸", "🎲"],
  objects: ["💡", "📱", "💻", "🔧", "💰", "🎁", "🔑", "📚"],
  symbols: ["❤️", "💔", "💯", "✅", "❌", "⚠️", "🔔", "💬"],
  flags: ["🏳️", "🏴", "🏁", "🚩", "🏳️‍🌈", "🇺🇸", "🇬🇧", "🇯🇵"]
};
function ha() {
  const f = [];
  for (const [E, a] of Object.entries(ma))
    for (const c of a)
      f.push({
        id: c,
        value: c,
        type: "emoji",
        keywords: [c],
        category: E
      });
  return f;
}
function ga(f = {}) {
  var J;
  const {
    searchEndpoint: E,
    categories: a = fa,
    customItems: c = [],
    getFavorites: v = () => [],
    saveFavorite: k,
    maxFavorites: o = 16,
    columns: R = 8,
    searchDebounceMs: F = 150
  } = f, H = C(!1), O = C(""), Z = C(((J = a[0]) == null ? void 0 : J.id) || "smileys"), Y = C(0), z = C(!1), $ = de([]), p = C(null), d = de(ha()), S = /* @__PURE__ */ new Map(), w = de([]), y = D(() => [...d.value, ...c]), _ = D(() => {
    const U = v(), h = [...$.value, ...w.value, ...y.value], I = /* @__PURE__ */ new Set(), A = [];
    for (const P of U) {
      if (I.has(P)) continue;
      I.add(P);
      const l = h.find((n) => n.id === P);
      l ? A.push(l) : A.push({
        id: P,
        value: P,
        type: "emoji",
        keywords: [P],
        category: "favorites"
      });
    }
    return A.slice(0, o);
  });
  let b = null;
  async function r(U) {
    if (!E) {
      const h = U.toLowerCase();
      return y.value.filter(
        (I) => I.value.includes(h) || I.keywords.some((A) => A.toLowerCase().includes(h))
      );
    }
    try {
      const h = `${E}?q=${encodeURIComponent(U)}&limit=50`, I = await fetch(h);
      if (!I.ok)
        throw new Error(`Search failed: ${I.status}`);
      const A = await I.json();
      return A.success && Array.isArray(A.results) ? A.results.map((P) => ({
        id: P.id || P.value,
        value: P.value,
        type: P.type || "emoji",
        keywords: P.keywords || [],
        category: P.category || "search",
        url: P.url
      })) : [];
    } catch (h) {
      return p.value = h instanceof Error ? h.message : "Search failed", console.error("[EmojiPicker] Search error:", h), [];
    }
  }
  async function s(U) {
    if (!E || U === "favorites")
      return y.value.filter((h) => h.category === U);
    if (S.has(U))
      return S.get(U);
    try {
      const h = y.value.filter((I) => I.category === U);
      return S.set(U, h), h;
    } catch (h) {
      return console.error("[EmojiPicker] Category fetch error:", h), y.value.filter((I) => I.category === U);
    }
  }
  Q(O, (U) => {
    if (b && clearTimeout(b), !U.trim()) {
      $.value = [], z.value = !1;
      return;
    }
    z.value = !0, b = setTimeout(async () => {
      const h = await r(U);
      $.value = h, z.value = !1;
    }, F);
  }), Q(Z, async (U) => {
    O.value.trim() || (w.value = await s(U));
  }, { immediate: !0 });
  const g = D(() => O.value.trim() ? $.value : Z.value === "favorites" ? _.value : w.value);
  function x() {
    H.value = !0, O.value = "";
  }
  function L() {
    H.value = !1;
  }
  function B(U) {
    return k && k(U.id), U;
  }
  function N(U) {
    Z.value = U, O.value = "";
  }
  function X(U) {
    O.value = U;
  }
  return {
    // State
    isOpen: H,
    searchQuery: O,
    activeCategory: Z,
    selectedSkinTone: Y,
    isSearching: z,
    searchError: p,
    // Data
    categories: a,
    allItems: y,
    favorites: _,
    displayItems: g,
    searchResults: $,
    columns: R,
    // Actions
    open: x,
    close: L,
    selectItem: B,
    setCategory: N,
    setSearch: X
  };
}
const ya = { class: "nui-picker-search" }, ka = ["value", "placeholder"], wa = { class: "nui-picker-categories" }, ba = ["title", "onClick"], xa = { class: "nui-category-icon" }, _a = {
  key: 0,
  class: "nui-picker-loading"
}, Ca = {
  key: 1,
  class: "nui-picker-empty"
}, $a = { key: 0 }, za = { key: 1 }, Sa = { key: 2 }, Ma = ["title", "onClick"], Ea = {
  key: 0,
  class: "nui-item-emoji"
}, Ia = ["src", "alt"], La = {
  key: 2,
  class: "nui-item-fallback"
}, Ua = {
  key: 0,
  class: "nui-picker-favorites"
}, ja = { class: "nui-favorites-grid" }, Aa = ["title", "onClick"], Fa = {
  key: 0,
  class: "nui-item-emoji"
}, Pa = ["src", "alt"], Ra = /* @__PURE__ */ oe({
  __name: "EmojiPicker",
  props: {
    favorites: { default: () => [] },
    customItems: { default: () => [] },
    categories: {},
    columns: { default: 8 },
    maxFavorites: { default: 16 },
    searchPlaceholder: { default: "Search emoji..." },
    searchEndpoint: { default: void 0 }
  },
  emits: ["select", "favorite"],
  setup(f, { emit: E }) {
    const a = f, c = E, v = {
      searchEndpoint: a.searchEndpoint,
      categories: a.categories,
      customItems: a.customItems,
      getFavorites: () => a.favorites,
      saveFavorite: (b) => c("favorite", b),
      maxFavorites: a.maxFavorites,
      columns: a.columns
    }, {
      searchQuery: k,
      activeCategory: o,
      categories: R,
      displayItems: F,
      favorites: H,
      isSearching: O,
      setCategory: Z,
      setSearch: Y,
      selectItem: z
    } = ga(v), $ = C(null), p = C(null);
    se(() => {
      Ee(() => {
        var b;
        (b = $.value) == null || b.focus();
      });
    });
    function d(b) {
      const r = z(b);
      c("select", r);
    }
    function S(b) {
      const r = b.target.value;
      Y(r);
    }
    function w(b) {
      Z(b);
    }
    function y(b) {
      var r;
      b.key === "Escape" && ((r = $.value) == null || r.blur());
    }
    const _ = D(() => ({
      gridTemplateColumns: `repeat(${a.columns}, 1fr)`
    }));
    return (b, r) => (i(), u("div", {
      class: "nui-emoji-picker",
      onKeydown: y
    }, [
      e("div", ya, [
        e("input", {
          ref_key: "searchInputRef",
          ref: $,
          type: "text",
          value: m(k),
          placeholder: f.searchPlaceholder,
          class: "nui-picker-search-input",
          onInput: S
        }, null, 40, ka),
        r[0] || (r[0] = e("svg", {
          class: "nui-picker-search-icon",
          viewBox: "0 0 24 24",
          fill: "none",
          stroke: "currentColor",
          "stroke-width": "2"
        }, [
          e("circle", {
            cx: "11",
            cy: "11",
            r: "8"
          }),
          e("path", { d: "M21 21l-4.35-4.35" })
        ], -1))
      ]),
      e("div", wa, [
        (i(!0), u(ee, null, ae(m(R), (s) => (i(), u("button", {
          key: s.id,
          class: W(["nui-picker-category-tab", { active: m(o) === s.id }]),
          title: s.name,
          onClick: (g) => w(s.id)
        }, [
          e("span", xa, T(s.icon), 1)
        ], 10, ba))), 128))
      ]),
      e("div", {
        ref_key: "gridRef",
        ref: p,
        class: "nui-picker-grid-container"
      }, [
        m(O) ? (i(), u("div", _a, [...r[1] || (r[1] = [
          e("span", { class: "nui-loading-spinner" }, null, -1),
          e("span", null, "Searching...", -1)
        ])])) : m(F).length === 0 ? (i(), u("div", Ca, [
          m(k) ? (i(), u("span", $a, 'No results for "' + T(m(k)) + '"', 1)) : m(o) === "favorites" ? (i(), u("span", za, "No favorites yet")) : (i(), u("span", Sa, "No items"))
        ])) : (i(), u("div", {
          key: 2,
          class: "nui-picker-grid",
          style: G(_.value)
        }, [
          (i(!0), u(ee, null, ae(m(F), (s) => {
            var g;
            return i(), u("button", {
              key: s.id,
              class: W(["nui-picker-item", { "is-custom": s.type !== "emoji" }]),
              title: ((g = s.keywords) == null ? void 0 : g[0]) || s.value,
              onClick: (x) => d(s)
            }, [
              s.type === "emoji" ? (i(), u("span", Ea, T(s.value), 1)) : s.url ? (i(), u("img", {
                key: 1,
                src: s.url,
                alt: s.value,
                class: "nui-item-image"
              }, null, 8, Ia)) : (i(), u("span", La, T(s.value), 1))
            ], 10, Ma);
          }), 128))
        ], 4))
      ], 512),
      m(H).length > 0 ? (i(), u("div", Ua, [
        r[2] || (r[2] = e("div", { class: "nui-favorites-label" }, "⭐ Favorites", -1)),
        e("div", ja, [
          (i(!0), u(ee, null, ae(m(H), (s) => (i(), u("button", {
            key: "fav-" + s.id,
            class: "nui-picker-item nui-favorite-item",
            title: s.value,
            onClick: (g) => d(s)
          }, [
            s.type === "emoji" ? (i(), u("span", Fa, T(s.value), 1)) : s.url ? (i(), u("img", {
              key: 1,
              src: s.url,
              alt: s.value,
              class: "nui-item-image"
            }, null, 8, Pa)) : j("", !0)
          ], 8, Aa))), 128))
        ])
      ])) : j("", !0)
    ], 32));
  }
}), Ya = /* @__PURE__ */ le(Ra, [["__scopeId", "data-v-d93ce4c3"]]);
export {
  $e as AvatarCropper,
  Za as AvatarManager,
  Ba as AvatarUpload,
  Ya as EmojiPicker,
  Ve as ImageViewer,
  Ta as ImageViewerProvider,
  Ha as configureAvatarManager,
  Da as configureAvatarUpload,
  Xe as useAvatarCropper,
  bt as useAvatarManager,
  Ne as useAvatarUpload,
  ga as useEmojiPicker,
  Ce as useImageViewer
};
//# sourceMappingURL=index.js.map
