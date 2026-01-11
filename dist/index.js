import { ref as C, readonly as ce, defineComponent as oe, computed as A, watch as ee, onMounted as se, onUnmounted as me, createBlock as ie, openBlock as s, Teleport as he, createVNode as ne, Transition as ge, withCtx as ye, createElementBlock as i, createCommentVNode as U, withModifiers as te, createElementVNode as e, toDisplayString as P, withDirectives as $e, normalizeStyle as J, vShow as ze, Fragment as Q, renderList as ae, normalizeClass as Y, unref as m, createStaticVNode as Me, createTextVNode as ve, shallowRef as Se, nextTick as Ie } from "vue";
const re = C(!1), ke = C([]), xe = C(0);
let be = null;
function _e() {
  function f(y) {
    be = y;
  }
  function M() {
    return be;
  }
  function a(y, n = 0) {
    ke.value = y, xe.value = n, re.value = !0;
  }
  function u() {
    re.value = !1;
  }
  function d(y, n) {
    a([{ url: y, alt: n }], 0);
  }
  return {
    // State (readonly to prevent external mutation)
    isOpen: ce(re),
    images: ce(ke),
    initialIndex: ce(xe),
    // Actions
    openViewer: a,
    closeViewer: u,
    openImage: d,
    setVariantFetcher: f,
    getVariantFetcher: M,
    // For the provider component
    _setOpen: (y) => {
      re.value = y;
    }
  };
}
const Ee = { class: "viewer-toolbar top" }, Ue = {
  key: 0,
  class: "image-counter"
}, Le = { class: "image-container" }, je = {
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
}, De = ["onClick"], Be = ["src", "alt"], He = 0.5, Ze = 5, we = 0.25, Ye = /* @__PURE__ */ oe({
  __name: "ImageViewer",
  props: {
    images: {},
    initialIndex: { default: 0 },
    open: { type: Boolean }
  },
  emits: ["close", "indexChange"],
  setup(f, { emit: M }) {
    const a = f, u = M, { getVariantFetcher: d } = _e(), y = C(a.initialIndex), n = C(1), j = C(0), E = C(0), O = C(!1), D = C({ x: 0, y: 0 }), H = C(!0), R = C(!1), w = C(!1), S = C(/* @__PURE__ */ new Map()), v = A(() => a.images[y.value]), p = A(() => {
      const t = v.value;
      if (!t) return null;
      if (t.fileId && S.value.has(t.fileId)) {
        const $ = S.value.get(t.fileId);
        return { ...t, variants: $ };
      }
      return t;
    }), z = A(() => {
      var $, W, q, Z, ue;
      const t = p.value;
      if (!t) return "";
      if (t.variants) {
        if (($ = t.variants.lg) != null && $.url) return t.variants.lg.url;
        if ((W = t.variants.original) != null && W.url) return t.variants.original.url;
        if ((q = t.variants.md) != null && q.url) return t.variants.md.url;
        if ((Z = t.variants.sm) != null && Z.url) return t.variants.sm.url;
        if ((ue = t.variants.thumb) != null && ue.url) return t.variants.thumb.url;
      }
      return t.url;
    }), b = A(() => a.images.length > 1), k = A(() => y.value > 0), h = A(() => y.value < a.images.length - 1);
    ee(y, () => {
      n.value = 1, j.value = 0, E.value = 0, H.value = !0, R.value = !1, u("indexChange", y.value);
    }), ee(() => a.open, (t) => {
      t ? (y.value = a.initialIndex, n.value = 1, j.value = 0, E.value = 0, H.value = !0, R.value = !1, document.body.style.overflow = "hidden", _()) : document.body.style.overflow = "";
    }), ee(v, () => {
      _();
    });
    async function _() {
      var W, q;
      const t = v.value;
      if (!(t != null && t.fileId) || S.value.has(t.fileId) || (W = t.variants) != null && W.lg || (q = t.variants) != null && q.original) return;
      const $ = d();
      if ($) {
        w.value = !0;
        try {
          const Z = await $(t.fileId);
          Z && S.value.set(t.fileId, Z);
        } catch (Z) {
          console.error("Failed to fetch variants:", Z);
        } finally {
          w.value = !1;
        }
      }
    }
    function o() {
      k.value && y.value--;
    }
    function c() {
      h.value && y.value++;
    }
    function g(t) {
      t >= 0 && t < a.images.length && (y.value = t);
    }
    function x() {
      n.value = Math.min(Ze, n.value + we);
    }
    function L() {
      n.value = Math.max(He, n.value - we), n.value <= 1 && (j.value = 0, E.value = 0);
    }
    function T() {
      n.value = 1, j.value = 0, E.value = 0;
    }
    function V(t) {
      t.preventDefault(), t.deltaY < 0 ? x() : L();
    }
    function N(t) {
      if (n.value <= 1) return;
      O.value = !0;
      const $ = "touches" in t ? t.touches[0] : t;
      D.value = { x: $.clientX - j.value, y: $.clientY - E.value };
    }
    function K(t) {
      if (!O.value) return;
      t.preventDefault();
      const $ = "touches" in t ? t.touches[0] : t;
      j.value = $.clientX - D.value.x, E.value = $.clientY - D.value.y;
    }
    function G() {
      O.value = !1;
    }
    function I(t) {
      if (a.open)
        switch (t.key) {
          case "Escape":
            u("close");
            break;
          case "ArrowLeft":
            o();
            break;
          case "ArrowRight":
            c();
            break;
          case "+":
          case "=":
            x();
            break;
          case "-":
            L();
            break;
          case "0":
            T();
            break;
        }
    }
    async function F() {
      if (p.value)
        try {
          const t = z.value, W = await (await fetch(t)).blob(), q = URL.createObjectURL(W), Z = document.createElement("a");
          Z.href = q, Z.download = p.value.alt || `image-${y.value + 1}`, document.body.appendChild(Z), Z.click(), document.body.removeChild(Z), URL.revokeObjectURL(q);
        } catch (t) {
          console.error("Failed to download image:", t);
        }
    }
    function B() {
      H.value = !1;
    }
    function X() {
      H.value = !1, R.value = !0;
    }
    function r(t) {
      t.target.classList.contains("viewer-backdrop") && u("close");
    }
    se(() => {
      window.addEventListener("keydown", I);
    }), me(() => {
      window.removeEventListener("keydown", I), document.body.style.overflow = "";
    });
    const l = A(() => ({
      transform: `scale(${n.value}) translate(${j.value / n.value}px, ${E.value / n.value}px)`,
      cursor: n.value > 1 ? O.value ? "grabbing" : "grab" : "default"
    }));
    return (t, $) => (s(), ie(he, { to: "body" }, [
      ne(ge, { name: "viewer" }, {
        default: ye(() => {
          var W;
          return [
            f.open ? (s(), i("div", {
              key: 0,
              class: "viewer-backdrop",
              onClick: r,
              onWheel: te(V, ["prevent"])
            }, [
              e("button", {
                class: "viewer-btn close-btn",
                onClick: $[0] || ($[0] = (q) => u("close")),
                title: "Close (Esc)"
              }, [...$[1] || ($[1] = [
                e("svg", {
                  viewBox: "0 0 24 24",
                  fill: "none",
                  stroke: "currentColor",
                  "stroke-width": "2"
                }, [
                  e("path", { d: "M18 6L6 18M6 6l12 12" })
                ], -1)
              ])]),
              e("div", Ee, [
                b.value ? (s(), i("span", Ue, P(y.value + 1) + " / " + P(f.images.length), 1)) : U("", !0)
              ]),
              b.value && k.value ? (s(), i("button", {
                key: 0,
                class: "viewer-btn nav-btn prev",
                onClick: te(o, ["stop"]),
                title: "Previous (←)"
              }, [...$[2] || ($[2] = [
                e("svg", {
                  viewBox: "0 0 24 24",
                  fill: "none",
                  stroke: "currentColor",
                  "stroke-width": "2"
                }, [
                  e("path", { d: "M15 18l-6-6 6-6" })
                ], -1)
              ])])) : U("", !0),
              b.value && h.value ? (s(), i("button", {
                key: 1,
                class: "viewer-btn nav-btn next",
                onClick: te(c, ["stop"]),
                title: "Next (→)"
              }, [...$[3] || ($[3] = [
                e("svg", {
                  viewBox: "0 0 24 24",
                  fill: "none",
                  stroke: "currentColor",
                  "stroke-width": "2"
                }, [
                  e("path", { d: "M9 18l6-6-6-6" })
                ], -1)
              ])])) : U("", !0),
              e("div", Le, [
                H.value ? (s(), i("div", je, [...$[4] || ($[4] = [
                  e("div", { class: "spinner" }, null, -1)
                ])])) : U("", !0),
                R.value ? (s(), i("div", Ae, [...$[5] || ($[5] = [
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
                ])])) : U("", !0),
                $e(e("img", {
                  src: z.value,
                  alt: ((W = p.value) == null ? void 0 : W.alt) || "Image",
                  style: J(l.value),
                  class: "viewer-image",
                  draggable: "false",
                  onLoad: B,
                  onError: X,
                  onMousedown: N,
                  onMousemove: K,
                  onMouseup: G,
                  onMouseleave: G,
                  onTouchstart: N,
                  onTouchmove: K,
                  onTouchend: G
                }, null, 44, Fe), [
                  [ze, !R.value]
                ]),
                w.value ? (s(), i("div", Pe, " Loading full resolution... ")) : U("", !0)
              ]),
              e("div", Re, [
                e("div", Oe, [
                  e("button", {
                    class: "viewer-btn small",
                    onClick: L,
                    title: "Zoom out (-)"
                  }, [...$[6] || ($[6] = [
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
                    onClick: T,
                    title: "Reset zoom (0)"
                  }, P(Math.round(n.value * 100)) + "% ", 1),
                  e("button", {
                    class: "viewer-btn small",
                    onClick: x,
                    title: "Zoom in (+)"
                  }, [...$[7] || ($[7] = [
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
                  onClick: F,
                  title: "Download"
                }, [...$[8] || ($[8] = [
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
              b.value && f.images.length <= 20 ? (s(), i("div", Te, [
                (s(!0), i(Q, null, ae(f.images, (q, Z) => (s(), i("button", {
                  key: Z,
                  class: Y(["thumbnail", { active: Z === y.value }]),
                  onClick: (ue) => g(Z)
                }, [
                  e("img", {
                    src: q.thumbnail || q.url,
                    alt: `Thumbnail ${Z + 1}`
                  }, null, 8, Be)
                ], 10, De))), 128))
              ])) : U("", !0)
            ], 32)) : U("", !0)
          ];
        }),
        _: 1
      })
    ]));
  }
}), le = (f, M) => {
  const a = f.__vccOpts || f;
  for (const [u, d] of M)
    a[u] = d;
  return a;
}, Ve = /* @__PURE__ */ le(Ye, [["__scopeId", "data-v-1fa5ee85"]]), Oa = /* @__PURE__ */ oe({
  __name: "ImageViewerProvider",
  setup(f) {
    const { isOpen: M, images: a, initialIndex: u, _setOpen: d } = _e(), y = A(() => [...a.value]);
    function n() {
      d(!1);
    }
    return (j, E) => (s(), ie(Ve, {
      images: y.value,
      "initial-index": m(u),
      open: m(M),
      onClose: n
    }, null, 8, ["images", "initial-index", "open"]));
  }
}), pe = C({});
function Ta(f) {
  pe.value = { ...pe.value, ...f };
}
function Ne(f) {
  const M = C(!1), a = C(0), u = C(null), d = C(null), y = C(null), n = A(() => ({
    uploadUrl: "/api/v1/upload",
    profile: "avatar",
    maxFileSize: 10 * 1024 * 1024,
    // 10MB
    acceptedTypes: ["image/jpeg", "image/png", "image/webp", "image/heic", "image/heif"],
    ...pe.value,
    ...f
  }));
  function j(w) {
    var S;
    return (S = n.value.acceptedTypes) != null && S.some((v) => w.type === v || w.type.startsWith(v.replace("/*", "/"))) ? n.value.maxFileSize && w.size > n.value.maxFileSize ? {
      message: `File too large. Maximum size is ${Math.round(n.value.maxFileSize / 1048576)}MB.`,
      code: "FILE_TOO_LARGE"
    } : null : {
      message: "Invalid file type. Please select a JPEG, PNG, WebP, or HEIC image.",
      code: "INVALID_TYPE"
    };
  }
  function E(w) {
    const S = j(w);
    return S ? (u.value = S, S) : (d.value && URL.revokeObjectURL(d.value), y.value = w, d.value = URL.createObjectURL(w), u.value = null, null);
  }
  function O() {
    d.value && URL.revokeObjectURL(d.value), y.value = null, d.value = null, u.value = null, a.value = 0;
  }
  async function D() {
    if (!y.value)
      return u.value = { message: "No file selected", code: "NO_FILE" }, null;
    M.value = !0, a.value = 0, u.value = null;
    try {
      const w = new FormData();
      w.append("file", y.value), w.append("profile", n.value.profile || "avatar"), n.value.projectId && w.append("project_id", n.value.projectId);
      const S = {};
      n.value.apiKey && (S.Authorization = `Bearer ${n.value.apiKey}`), n.value.headers && Object.assign(S, n.value.headers);
      const v = await new Promise((p, z) => {
        const b = new XMLHttpRequest();
        b.upload.addEventListener("progress", (k) => {
          k.lengthComputable && (a.value = Math.round(k.loaded / k.total * 100));
        }), b.addEventListener("load", () => {
          if (b.status >= 200 && b.status < 300)
            try {
              const k = JSON.parse(b.responseText), h = k.data || k;
              p({
                id: h.id,
                url: h.url || h.signed_url,
                variants: h.variants || {}
              });
            } catch {
              z({ message: "Invalid response from server", code: "PARSE_ERROR" });
            }
          else {
            let k = "Upload failed";
            try {
              const h = JSON.parse(b.responseText);
              k = h.error || h.message || k;
            } catch {
            }
            z({ message: k, code: `HTTP_${b.status}` });
          }
        }), b.addEventListener("error", () => {
          z({ message: "Network error during upload", code: "NETWORK_ERROR" });
        }), b.addEventListener("abort", () => {
          z({ message: "Upload cancelled", code: "ABORTED" });
        }), b.open("POST", n.value.uploadUrl);
        for (const [k, h] of Object.entries(S))
          b.setRequestHeader(k, h);
        b.send(w);
      });
      return a.value = 100, v;
    } catch (w) {
      return u.value = w, null;
    } finally {
      M.value = !1;
    }
  }
  async function H(w) {
    return E(w) ? null : D();
  }
  async function R(w) {
    if (!y.value)
      return u.value = { message: "No file selected", code: "NO_FILE" }, null;
    M.value = !0, a.value = 0, u.value = null;
    try {
      const S = new FormData();
      S.append("file", y.value), S.append("profile", n.value.profile || "avatar"), S.append("crop_x", String(w.x)), S.append("crop_y", String(w.y)), S.append("crop_width", String(w.width)), S.append("crop_height", String(w.height)), w.zoom !== void 0 && S.append("crop_zoom", String(w.zoom)), n.value.projectId && S.append("project_id", n.value.projectId);
      const v = {};
      n.value.apiKey && (v.Authorization = `Bearer ${n.value.apiKey}`), n.value.headers && Object.assign(v, n.value.headers);
      const p = await new Promise((z, b) => {
        const k = new XMLHttpRequest();
        k.upload.addEventListener("progress", (h) => {
          h.lengthComputable && (a.value = Math.round(h.loaded / h.total * 100));
        }), k.addEventListener("load", () => {
          if (k.status >= 200 && k.status < 300)
            try {
              const h = JSON.parse(k.responseText), _ = h.data || h;
              z({
                id: _.id,
                url: _.url || _.signed_url,
                variants: _.variants || {}
              });
            } catch {
              b({ message: "Invalid response from server", code: "PARSE_ERROR" });
            }
          else {
            let h = "Upload failed";
            try {
              const _ = JSON.parse(k.responseText);
              h = _.error || _.message || h;
            } catch {
            }
            b({ message: h, code: `HTTP_${k.status}` });
          }
        }), k.addEventListener("error", () => {
          b({ message: "Network error during upload", code: "NETWORK_ERROR" });
        }), k.addEventListener("abort", () => {
          b({ message: "Upload cancelled", code: "ABORTED" });
        }), k.open("POST", n.value.uploadUrl);
        for (const [h, _] of Object.entries(v))
          k.setRequestHeader(h, _);
        k.send(S);
      });
      return a.value = 100, p;
    } catch (S) {
      return u.value = S, null;
    } finally {
      M.value = !1;
    }
  }
  return {
    // State
    uploading: M,
    progress: a,
    error: u,
    previewUrl: d,
    selectedFile: y,
    config: n,
    // Methods
    validateFile: j,
    selectFile: E,
    clearSelection: O,
    upload: D,
    selectAndUpload: H,
    uploadWithCrop: R
  };
}
const de = {
  shape: "circle",
  cropSize: 280,
  outputSize: 512,
  maxZoom: 5,
  format: "image/jpeg",
  quality: 0.92,
  mediaProxyUrl: void 0
};
function Xe(f) {
  const M = A(() => ({ ...de, ...f })), a = C({
    image: null,
    naturalWidth: 0,
    naturalHeight: 0,
    panX: 0,
    panY: 0,
    zoom: 1,
    minZoom: 1,
    maxZoom: de.maxZoom
  }), u = C(!1), d = C(null), y = C(null), n = C(null);
  function j(o) {
    a.value.image = o, a.value.naturalWidth = o.naturalWidth, a.value.naturalHeight = o.naturalHeight;
    const { cropSize: c } = M.value, g = c / o.naturalWidth, x = c / o.naturalHeight, L = Math.max(g, x);
    console.log("[Cropper] Image initialized:", {
      naturalWidth: o.naturalWidth,
      naturalHeight: o.naturalHeight,
      cropSize: c,
      scaleX: g.toFixed(4),
      scaleY: x.toFixed(4),
      minZoom: L.toFixed(4)
    }), a.value.minZoom = L, a.value.maxZoom = L * M.value.maxZoom, a.value.zoom = L, R(), console.log("[Cropper] After centering:", {
      panX: a.value.panX.toFixed(2),
      panY: a.value.panY.toFixed(2),
      zoom: a.value.zoom.toFixed(4)
    });
  }
  async function E(o) {
    u.value = !0, d.value = null, y.value = o, n.value && URL.revokeObjectURL(n.value);
    try {
      const c = URL.createObjectURL(o);
      n.value = c;
      const g = await H(c);
      return j(g), u.value = !1, !0;
    } catch {
      return d.value = "Failed to load image", u.value = !1, !1;
    }
  }
  async function O(o) {
    u.value = !0, d.value = null, y.value = null;
    try {
      let c = o;
      const { mediaProxyUrl: g } = M.value;
      g && D(o) && (c = `${g}?url=${encodeURIComponent(o)}`, console.log("[Cropper] Using proxy for external URL:", c)), n.value = c;
      const x = await H(c);
      return j(x), u.value = !1, !0;
    } catch (c) {
      return console.error("[Cropper] Failed to load image:", c), d.value = "Failed to load image", u.value = !1, !1;
    }
  }
  function D(o) {
    try {
      return new URL(o).origin !== window.location.origin;
    } catch {
      return !1;
    }
  }
  function H(o) {
    return new Promise((c, g) => {
      const x = new Image();
      x.crossOrigin = "anonymous", x.onload = () => c(x), x.onerror = () => g(new Error("Failed to load image")), x.src = o;
    });
  }
  function R() {
    const { cropSize: o } = M.value, { naturalWidth: c, naturalHeight: g, zoom: x } = a.value, L = o / x, T = o / x;
    a.value.panX = (c - L) / 2, a.value.panY = (g - T) / 2;
  }
  function w(o) {
    const { minZoom: c, maxZoom: g } = a.value, x = Math.max(c, Math.min(g, o)), L = a.value.zoom, { cropSize: T } = M.value, V = a.value.panX + T / (2 * L), N = a.value.panY + T / (2 * L);
    a.value.zoom = x, a.value.panX = V - T / (2 * x), a.value.panY = N - T / (2 * x), v();
  }
  function S(o, c) {
    const { zoom: g } = a.value;
    a.value.panX -= o / g, a.value.panY -= c / g, v();
  }
  function v() {
    const { cropSize: o } = M.value, { naturalWidth: c, naturalHeight: g, zoom: x } = a.value, L = o / x, T = o / x, V = c - L, N = g - T;
    a.value.panX = Math.max(0, Math.min(V, a.value.panX)), a.value.panY = Math.max(0, Math.min(N, a.value.panY));
  }
  const p = A(() => {
    if (!a.value.image) return null;
    const { cropSize: o } = M.value, { panX: c, panY: g, zoom: x } = a.value, L = o / x, T = o / x;
    return {
      x: Math.round(c),
      y: Math.round(g),
      width: Math.round(L),
      height: Math.round(T),
      zoom: x
    };
  }), z = A(() => {
    const { zoom: o, panX: c, panY: g } = a.value, x = -c * o, L = -g * o;
    return Math.random() < 0.01 && console.log("[Cropper] Transform:", {
      panX: c.toFixed(2),
      panY: g.toFixed(2),
      zoom: o.toFixed(4),
      translateX: x.toFixed(2),
      translateY: L.toFixed(2)
    }), `translate(${x}px, ${L}px) scale(${o})`;
  });
  async function b() {
    if (!a.value.image || !p.value) return null;
    const { outputSize: o, format: c, quality: g } = M.value, x = p.value, L = document.createElement("canvas");
    L.width = o, L.height = o;
    const T = L.getContext("2d");
    return T ? (T.drawImage(
      a.value.image,
      x.x,
      x.y,
      x.width,
      x.height,
      0,
      0,
      o,
      o
    ), new Promise((V) => {
      L.toBlob(
        (N) => V(N),
        c,
        g
      );
    })) : null;
  }
  async function k(o) {
    const c = await b();
    if (!c) return null;
    const { format: g } = M.value, x = g.split("/")[1], L = o || `avatar-cropped.${x}`;
    return new File([c], L, { type: g });
  }
  function h() {
    n.value && y.value && URL.revokeObjectURL(n.value), a.value = {
      image: null,
      naturalWidth: 0,
      naturalHeight: 0,
      panX: 0,
      panY: 0,
      zoom: 1,
      minZoom: 1,
      maxZoom: de.maxZoom
    }, y.value = null, n.value = null, d.value = null;
  }
  function _() {
    if (!a.value.image) return;
    const { cropSize: o } = M.value, c = o / a.value.naturalWidth, g = o / a.value.naturalHeight, x = Math.max(c, g);
    a.value.zoom = x, R();
  }
  return {
    // State
    state: a,
    loading: u,
    error: d,
    sourceFile: y,
    sourceUrl: n,
    cropRegion: p,
    imageTransform: z,
    config: M,
    // Methods
    loadFile: E,
    loadUrl: O,
    setZoom: w,
    pan: S,
    centerImage: R,
    reset: _,
    exportCrop: b,
    exportCropAsFile: k,
    cleanup: h
  };
}
const We = { class: "avatar-cropper flex flex-col items-center gap-6" }, qe = { class: "relative" }, Je = { class: "text-sm" }, Ge = ["src"], Ke = {
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
  setup(f, { emit: M }) {
    const a = f, u = M, {
      state: d,
      loading: y,
      error: n,
      sourceUrl: j,
      cropRegion: E,
      imageTransform: O,
      config: D,
      loadFile: H,
      loadUrl: R,
      setZoom: w,
      pan: S,
      reset: v,
      exportCropAsFile: p,
      cleanup: z
    } = Xe({
      shape: a.shape,
      cropSize: a.cropSize,
      outputSize: a.outputSize,
      ...a.config
    }), b = C(null), k = C(!1), h = C({ x: 0, y: 0 });
    ee(() => a.file, async (r) => {
      r && await H(r);
    }, { immediate: !0 }), ee(() => a.url, async (r) => {
      r && !a.file && await R(r);
    }, { immediate: !0 }), ee(E, (r) => {
      r && u("crop-change", r);
    });
    const _ = A(() => d.value.minZoom ? Math.round(d.value.zoom / d.value.minZoom * 100) : 100), o = A({
      get: () => {
        const { zoom: r, minZoom: l, maxZoom: t } = d.value;
        return t === l ? 0 : (r - l) / (t - l);
      },
      set: (r) => {
        const { minZoom: l, maxZoom: t } = d.value, $ = l + r * (t - l);
        w($);
      }
    }), c = A(() => {
      switch (a.shape) {
        case "circle":
          return "rounded-full";
        case "rounded":
          return "rounded-3xl";
        default:
          return "";
      }
    });
    function g(r) {
      if (y.value) return;
      k.value = !0, h.value = { x: r.clientX, y: r.clientY }, r.target.setPointerCapture(r.pointerId);
    }
    function x(r) {
      if (!k.value) return;
      const l = r.clientX - h.value.x, t = r.clientY - h.value.y;
      S(l, t), h.value = { x: r.clientX, y: r.clientY };
    }
    function L(r) {
      k.value = !1, r.target.releasePointerCapture(r.pointerId);
    }
    function T(r) {
      r.preventDefault();
      const l = r.deltaY > 0 ? -0.1 : 0.1, { zoom: t, minZoom: $, maxZoom: W } = d.value, q = W - $, Z = t + l * q * 0.3;
      w(Z);
    }
    let V = 0;
    function N(r) {
      r.touches.length === 2 && (V = G(r.touches));
    }
    function K(r) {
      if (r.touches.length === 2) {
        r.preventDefault();
        const l = G(r.touches), t = l / V;
        w(d.value.zoom * t), V = l;
      }
    }
    function G(r) {
      const l = r[0].clientX - r[1].clientX, t = r[0].clientY - r[1].clientY;
      return Math.sqrt(l * l + t * t);
    }
    async function I() {
      if (!E.value) return;
      const r = await p();
      r && u("confirm", { file: r, crop: E.value });
    }
    function F() {
      z(), u("cancel");
    }
    function B() {
      v();
    }
    function X(r) {
      r.key === "Escape" ? F() : r.key === "Enter" && I();
    }
    return se(() => {
      document.addEventListener("keydown", X);
    }), me(() => {
      document.removeEventListener("keydown", X), z();
    }), (r, l) => (s(), i("div", We, [
      e("div", qe, [
        m(y) ? (s(), i("div", {
          key: 0,
          class: Y(["flex items-center justify-center bg-dark-800", c.value]),
          style: J({ width: `${f.cropSize}px`, height: `${f.cropSize}px` })
        }, [...l[3] || (l[3] = [
          e("div", { class: "w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" }, null, -1)
        ])], 6)) : m(n) ? (s(), i("div", {
          key: 1,
          class: Y(["flex flex-col items-center justify-center gap-2 bg-dark-800 text-red-400", c.value]),
          style: J({ width: `${f.cropSize}px`, height: `${f.cropSize}px` })
        }, [
          l[4] || (l[4] = e("svg", {
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
          e("span", Je, P(m(n)), 1)
        ], 6)) : m(d).image ? (s(), i("div", {
          key: 2,
          ref_key: "cropAreaRef",
          ref: b,
          class: Y(["relative overflow-hidden bg-dark-900 select-none touch-none", c.value]),
          style: J({
            width: `${f.cropSize}px`,
            height: `${f.cropSize}px`,
            cursor: k.value ? "grabbing" : "grab"
          }),
          onPointerdown: g,
          onPointermove: x,
          onPointerup: L,
          onPointercancel: L,
          onWheel: T,
          onTouchstart: N,
          onTouchmove: K
        }, [
          e("img", {
            src: m(j) || "",
            alt: "Crop preview",
            class: "pointer-events-none",
            style: J({
              position: "absolute",
              top: "0",
              left: "0",
              width: `${m(d).naturalWidth}px`,
              height: `${m(d).naturalHeight}px`,
              maxWidth: "none",
              maxHeight: "none",
              transformOrigin: "0 0",
              transform: m(O)
            }),
            draggable: "false"
          }, null, 12, Ge),
          l[6] || (l[6] = Me('<div class="absolute inset-0 pointer-events-none opacity-0 hover:opacity-100 transition-opacity" data-v-235e5b45><div class="absolute inset-0 border border-white/20" data-v-235e5b45></div><div class="absolute left-1/3 top-0 bottom-0 w-px bg-white/10" data-v-235e5b45></div><div class="absolute right-1/3 top-0 bottom-0 w-px bg-white/10" data-v-235e5b45></div><div class="absolute top-1/3 left-0 right-0 h-px bg-white/10" data-v-235e5b45></div><div class="absolute bottom-1/3 left-0 right-0 h-px bg-white/10" data-v-235e5b45></div><div class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6" data-v-235e5b45><div class="absolute left-1/2 top-0 bottom-0 w-px bg-white/30 -translate-x-1/2" data-v-235e5b45></div><div class="absolute top-1/2 left-0 right-0 h-px bg-white/30 -translate-y-1/2" data-v-235e5b45></div></div></div>', 1)),
          k.value ? U("", !0) : (s(), i("div", Ke, [...l[5] || (l[5] = [
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
              ve(" Drag to reposition ")
            ], -1)
          ])]))
        ], 38)) : (s(), i("div", {
          key: 3,
          class: Y(["flex items-center justify-center bg-dark-800 text-dark-500", c.value]),
          style: J({ width: `${f.cropSize}px`, height: `${f.cropSize}px` })
        }, [...l[7] || (l[7] = [
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
        a.shape !== "circle" && m(d).image ? (s(), i("div", {
          key: 4,
          class: Y(["absolute inset-0 pointer-events-none border-2 border-white/20", c.value])
        }, null, 2)) : U("", !0)
      ]),
      f.showZoomSlider && m(d).image ? (s(), i("div", Qe, [
        e("div", et, [
          e("button", {
            type: "button",
            class: "p-1.5 text-dark-400 hover:text-white rounded-lg hover:bg-dark-700 transition-colors",
            onClick: l[0] || (l[0] = (t) => m(w)(m(d).zoom - (m(d).maxZoom - m(d).minZoom) * 0.1)),
            disabled: m(d).zoom <= m(d).minZoom
          }, [...l[8] || (l[8] = [
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
              value: o.value,
              min: "0",
              max: "1",
              step: "0.01",
              class: "zoom-slider w-full h-2 bg-dark-700 rounded-full appearance-none cursor-pointer",
              onInput: l[1] || (l[1] = (t) => o.value = parseFloat(t.target.value))
            }, null, 40, ot)
          ]),
          e("button", {
            type: "button",
            class: "p-1.5 text-dark-400 hover:text-white rounded-lg hover:bg-dark-700 transition-colors",
            onClick: l[2] || (l[2] = (t) => m(w)(m(d).zoom + (m(d).maxZoom - m(d).minZoom) * 0.1)),
            disabled: m(d).zoom >= m(d).maxZoom
          }, [...l[9] || (l[9] = [
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
          e("span", lt, P(_.value) + "% ", 1)
        ])
      ])) : U("", !0),
      e("div", rt, [
        f.showReset && m(d).image ? (s(), i("button", {
          key: 0,
          type: "button",
          class: "px-4 py-2 text-sm text-dark-400 hover:text-white rounded-lg hover:bg-dark-700 transition-colors",
          onClick: B
        }, " Reset ")) : U("", !0),
        e("button", {
          type: "button",
          class: "px-4 py-2 text-sm text-dark-300 bg-dark-700 hover:bg-dark-600 rounded-lg transition-colors",
          onClick: F
        }, P(f.cancelLabel), 1),
        e("button", {
          type: "button",
          class: "px-6 py-2 text-sm font-medium text-white bg-primary-600 hover:bg-primary-500 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed",
          disabled: !m(d).image || m(y),
          onClick: I
        }, P(f.confirmLabel), 9, st)
      ])
    ]));
  }
}), Ce = /* @__PURE__ */ le(it, [["__scopeId", "data-v-235e5b45"]]), ut = {
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
}, xt = /* @__PURE__ */ oe({
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
  setup(f, { emit: M }) {
    const a = f, u = M, {
      uploading: d,
      progress: y,
      error: n,
      previewUrl: j,
      selectedFile: E,
      selectFile: O,
      clearSelection: D,
      upload: H,
      uploadWithCrop: R
    } = Ne(a.config), w = C(null), S = C(!1), v = C(!1), p = C(null), z = C(null), b = A(() => j.value || a.modelValue || null), k = A(() => {
      switch (a.shape) {
        case "rounded":
          return "rounded-2xl";
        case "square":
          return "rounded-none";
        default:
          return "rounded-full";
      }
    }), h = A(() => 2 * Math.PI * 45), _ = A(() => h.value - y.value / 100 * h.value);
    ee(y, (I) => {
      u("upload-progress", I);
    }), ee(n, (I) => {
      I && u("upload-error", I);
    });
    function o() {
      var I;
      !a.editable || d.value || (I = w.value) == null || I.click();
    }
    function c(I) {
      var X;
      const F = I.target, B = (X = F.files) == null ? void 0 : X[0];
      B && g(B), F.value = "";
    }
    function g(I) {
      if (!["image/jpeg", "image/png", "image/webp", "image/heic", "image/heif"].some((B) => I.type === B)) {
        u("upload-error", {
          message: "Invalid file type. Please select a JPEG, PNG, WebP, or HEIC image.",
          code: "INVALID_TYPE"
        });
        return;
      }
      if (u("file-selected", I), a.enableCrop)
        p.value = I, v.value = !0;
      else {
        if (O(I))
          return;
        x();
      }
    }
    async function x() {
      var F, B, X, r;
      if (!E.value) return;
      u("upload-start", E.value);
      const I = await H();
      if (I) {
        u("upload-success", I);
        const l = ((B = (F = I.variants) == null ? void 0 : F.lg) == null ? void 0 : B.url) || ((r = (X = I.variants) == null ? void 0 : X.md) == null ? void 0 : r.url) || I.url;
        u("update:modelValue", l), D();
      }
    }
    async function L(I) {
      var X, r, l, t;
      if (v.value = !1, p.value = null, z.value = I.crop, u("crop-applied", I), O(I.file))
        return;
      u("upload-start", I.file);
      const B = await R(I.crop);
      if (B) {
        u("upload-success", { ...B, crop: I.crop });
        const $ = ((r = (X = B.variants) == null ? void 0 : X.lg) == null ? void 0 : r.url) || ((t = (l = B.variants) == null ? void 0 : l.md) == null ? void 0 : t.url) || B.url;
        u("update:modelValue", $), D();
      }
    }
    function T() {
      v.value = !1, p.value = null;
    }
    function V(I) {
      I.preventDefault(), a.editable && !d.value && (S.value = !0);
    }
    function N(I) {
      I.preventDefault(), S.value = !1;
    }
    function K(I) {
      I.preventDefault();
    }
    function G(I) {
      var B;
      if (I.preventDefault(), S.value = !1, !a.editable || d.value) return;
      const F = (B = I.dataTransfer) == null ? void 0 : B.files[0];
      F && F.type.startsWith("image/") && g(F);
    }
    return me(() => {
      D();
    }), (I, F) => (s(), i("div", null, [
      (s(), ie(he, { to: "body" }, [
        ne(ge, { name: "fade" }, {
          default: ye(() => [
            v.value && p.value ? (s(), i("div", ut, [
              e("div", {
                class: "absolute inset-0 bg-black/80 backdrop-blur-sm",
                onClick: T
              }),
              e("div", ct, [
                F[0] || (F[0] = e("h3", { class: "text-lg font-semibold text-white mb-4 text-center" }, " Adjust your photo ", -1)),
                ne(Ce, {
                  file: p.value,
                  shape: f.shape,
                  "crop-size": f.cropSize,
                  "output-size": f.cropOutputSize,
                  "confirm-label": "Save",
                  onConfirm: L,
                  onCancel: T
                }, null, 8, ["file", "shape", "crop-size", "output-size"])
              ])
            ])) : U("", !0)
          ]),
          _: 1
        })
      ])),
      e("div", {
        class: Y(["avatar-upload-container relative inline-block", f.containerClass]),
        style: J({ width: `${f.size}px`, height: `${f.size}px` })
      }, [
        e("input", {
          ref_key: "fileInput",
          ref: w,
          type: "file",
          accept: "image/jpeg,image/png,image/webp,image/heic,image/heif",
          class: "hidden",
          onChange: c
        }, null, 544),
        e("div", {
          class: Y(["avatar-upload relative w-full h-full overflow-hidden transition-all duration-200", [
            k.value,
            f.editable && !m(d) ? "cursor-pointer hover:ring-4 hover:ring-primary-500/30" : "",
            S.value ? "ring-4 ring-primary-500 scale-105" : "",
            m(n) ? "ring-2 ring-red-500" : ""
          ]]),
          onClick: o,
          onDragenter: V,
          onDragleave: N,
          onDragover: K,
          onDrop: G
        }, [
          b.value ? (s(), i("img", {
            key: 0,
            src: b.value,
            alt: "Avatar",
            class: "w-full h-full object-cover"
          }, null, 8, dt)) : (s(), i("div", vt, [
            f.placeholder ? (s(), i("span", {
              key: 0,
              class: "text-white font-semibold",
              style: J({ fontSize: `${f.size / 3}px` })
            }, P(f.placeholder), 5)) : (s(), i("svg", {
              key: 1,
              class: "text-slate-400",
              width: f.size / 2.5,
              height: f.size / 2.5,
              fill: "currentColor",
              viewBox: "0 0 24 24"
            }, [...F[1] || (F[1] = [
              e("path", { d: "M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" }, null, -1)
            ])], 8, pt))
          ])),
          f.editable && !m(d) ? (s(), i("div", ft, [...F[2] || (F[2] = [
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
          ])])) : U("", !0),
          m(d) ? (s(), i("div", mt, [
            f.showProgress ? (s(), i("svg", ht, [
              F[3] || (F[3] = e("circle", {
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
                "stroke-dasharray": h.value,
                "stroke-dashoffset": _.value
              }, null, 8, gt)
            ])) : U("", !0),
            e("span", yt, P(m(y)) + "%", 1)
          ])) : U("", !0)
        ], 34),
        m(n) && !m(d) ? (s(), i("div", kt, P(m(n).message), 1)) : U("", !0)
      ], 6)
    ]));
  }
}), Da = /* @__PURE__ */ le(xt, [["__scopeId", "data-v-36262731"]]), fe = C({});
function Ba(f) {
  fe.value = { ...fe.value, ...f };
}
function bt(f) {
  const M = C([]), a = C(!1), u = C(null), d = C(!1), y = C(0), n = A(() => ({
    apiBaseUrl: "/api",
    getHeaders: () => ({}),
    ...fe.value,
    ...f
  })), j = A(() => M.value.find((v) => v.is_primary));
  async function E() {
    a.value = !0, u.value = null;
    try {
      let v = `${n.value.apiBaseUrl}/avatars`;
      const p = new URLSearchParams();
      n.value.projectId && p.set("project_id", n.value.projectId), n.value.entityType && p.set("entity_type", n.value.entityType), n.value.entityId && p.set("entity_id", n.value.entityId), p.toString() && (v += `?${p.toString()}`);
      const z = await fetch(v, {
        headers: n.value.getHeaders()
      });
      if (!z.ok)
        throw new Error(await z.text());
      const b = await z.json();
      M.value = b.avatars || [];
    } catch (v) {
      u.value = v.message || "Failed to fetch avatars";
    } finally {
      a.value = !1;
    }
  }
  async function O(v) {
    u.value = null;
    try {
      const p = await fetch(`${n.value.apiBaseUrl}/avatars`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...n.value.getHeaders()
        },
        body: JSON.stringify({
          original_url: v.original_url,
          file_id: v.file_id,
          name: v.name,
          is_primary: v.is_primary ?? !1,
          source: "upload",
          format: "static",
          variants: v.variants,
          blurhash: v.blurhash,
          dominant_color: v.dominant_color,
          alt_text: v.alt_text,
          fallback_type: v.fallback_initials ? "initials" : "default",
          fallback_data: v.fallback_initials ? { initials: v.fallback_initials } : void 0
        })
      });
      if (!p.ok)
        throw new Error(await p.text());
      const z = await p.json();
      return await E(), z;
    } catch (p) {
      return u.value = p.message || "Failed to create avatar", null;
    }
  }
  async function D(v) {
    u.value = null;
    try {
      const p = await fetch(`${n.value.apiBaseUrl}/avatars/${v}/primary`, {
        method: "POST",
        headers: n.value.getHeaders()
      });
      if (!p.ok)
        throw new Error(await p.text());
      return M.value = M.value.map((z) => ({
        ...z,
        is_primary: z.id === v
      })), !0;
    } catch (p) {
      return u.value = p.message || "Failed to set primary avatar", !1;
    }
  }
  async function H(v) {
    u.value = null;
    try {
      const p = await fetch(`${n.value.apiBaseUrl}/avatars/${v}`, {
        method: "DELETE",
        headers: n.value.getHeaders()
      });
      if (!p.ok)
        throw new Error(await p.text());
      return M.value = M.value.filter((z) => z.id !== v), !0;
    } catch (p) {
      return u.value = p.message || "Failed to delete avatar", !1;
    }
  }
  async function R(v, p) {
    u.value = null;
    try {
      const z = await fetch(`${n.value.apiBaseUrl}/avatars/${v}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...n.value.getHeaders()
        },
        body: JSON.stringify(p)
      });
      if (!z.ok)
        throw new Error(await z.text());
      const b = await z.json();
      return M.value = M.value.map(
        (k) => k.id === v ? b : k
      ), b;
    } catch (z) {
      return u.value = z.message || "Failed to update avatar", null;
    }
  }
  async function w(v, p) {
    if (!n.value.uploadUrl)
      return u.value = "Upload URL not configured", null;
    d.value = !0, y.value = 0, u.value = null;
    try {
      const z = new FormData();
      z.append("file", v), z.append("profile", "avatar");
      const b = await new Promise((h, _) => {
        const o = new XMLHttpRequest();
        o.upload.addEventListener("progress", (g) => {
          g.lengthComputable && (y.value = Math.round(g.loaded / g.total * 100));
        }), o.addEventListener("load", () => {
          if (o.status >= 200 && o.status < 300)
            try {
              const g = JSON.parse(o.responseText);
              h(g.data || g);
            } catch {
              _(new Error("Invalid response from server"));
            }
          else {
            let g = "Upload failed";
            try {
              const x = JSON.parse(o.responseText);
              g = x.error || x.message || g;
            } catch {
            }
            _(new Error(g));
          }
        }), o.addEventListener("error", () => _(new Error("Network error"))), o.addEventListener("abort", () => _(new Error("Upload cancelled"))), o.open("POST", n.value.uploadUrl);
        const c = n.value.getHeaders();
        for (const [g, x] of Object.entries(c))
          o.setRequestHeader(g, x);
        o.send(z);
      });
      return y.value = 100, await O({
        original_url: b.url || b.signed_url,
        file_id: b.id,
        name: p == null ? void 0 : p.name,
        is_primary: p == null ? void 0 : p.is_primary,
        variants: b.variants,
        fallback_initials: p == null ? void 0 : p.fallback_initials
      });
    } catch (z) {
      return u.value = z.message || "Failed to upload avatar", null;
    } finally {
      d.value = !1;
    }
  }
  function S(v, p = "md") {
    var b, k, h, _, o, c, g;
    if (p === "original")
      return v.original_url;
    if (p === "source")
      return ((b = v.variants.source) == null ? void 0 : b.url) || v.original_url;
    const z = v.variants[p];
    return z ? z.url : p === "sm" ? ((k = v.variants.md) == null ? void 0 : k.url) || ((h = v.variants.lg) == null ? void 0 : h.url) || v.original_url : p === "md" ? ((_ = v.variants.lg) == null ? void 0 : _.url) || ((o = v.variants.sm) == null ? void 0 : o.url) || v.original_url : p === "lg" && (((c = v.variants.md) == null ? void 0 : c.url) || ((g = v.variants.sm) == null ? void 0 : g.url)) || v.original_url;
  }
  return {
    // State
    avatars: M,
    loading: a,
    error: u,
    uploading: d,
    uploadProgress: y,
    primaryAvatar: j,
    config: n,
    // Methods
    fetchAvatars: E,
    createAvatar: O,
    setPrimary: D,
    deleteAvatar: H,
    updateAvatar: R,
    uploadAndCreateAvatar: w,
    getAvatarUrl: S
  };
}
const wt = { class: "avatar-manager" }, _t = {
  key: 0,
  class: "fixed inset-0 z-50 flex items-center justify-center p-4"
}, Ct = { class: "relative bg-dark-900 rounded-2xl p-6 shadow-2xl border border-dark-700 max-w-md w-full" }, $t = { class: "text-lg font-semibold text-white mb-4 text-center" }, zt = {
  key: 0,
  class: "flex items-center justify-center py-8"
}, Mt = {
  key: 1,
  class: "text-center py-8"
}, St = { class: "text-red-400 mb-2" }, It = {
  key: 2,
  class: "space-y-3"
}, Et = { class: "flex flex-wrap gap-3" }, Ut = ["onClick"], Lt = ["src", "alt"], jt = {
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
}, Wt = { class: "space-y-2" }, qt = ["onClick"], Jt = ["src", "alt"], Gt = { class: "flex-1 min-w-0" }, Kt = { class: "flex items-center gap-2" }, Qt = { class: "font-medium text-white truncate" }, ea = {
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
  setup(f, { emit: M }) {
    const a = f, u = M, {
      avatars: d,
      loading: y,
      error: n,
      uploading: j,
      uploadProgress: E,
      config: O,
      fetchAvatars: D,
      setPrimary: H,
      deleteAvatar: R,
      uploadAndCreateAvatar: w,
      getAvatarUrl: S
    } = bt(a.config), v = C(null), p = C(null), z = C(null), b = C(!1), k = C("upload"), h = C(null), _ = C(null), o = A(() => a.allowUpload && d.value.length < a.maxAvatars), c = A(() => {
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
    }), g = A(() => _.value ? _.value.original_url : null);
    se(() => {
      D();
    });
    function x() {
      var r;
      (r = v.value) == null || r.click();
    }
    async function L(r) {
      var $;
      const l = r.target, t = ($ = l.files) == null ? void 0 : $[0];
      if (t)
        if (l.value = "", a.enableCropOnUpload)
          h.value = t, k.value = "upload", b.value = !0;
        else {
          const W = await w(t, {
            name: `Avatar ${d.value.length + 1}`,
            is_primary: d.value.length === 0,
            fallback_initials: a.initials
          });
          W ? u("upload-success", W) : n.value && u("upload-error", n.value);
        }
    }
    function T(r) {
      _.value = r, k.value = "edit", b.value = !0;
    }
    async function V(r) {
      if (b.value = !1, k.value === "upload" && h.value) {
        const l = await w(r.file, {
          name: `Avatar ${d.value.length + 1}`,
          is_primary: d.value.length === 0,
          fallback_initials: a.initials,
          crop: r.crop
        });
        l ? u("upload-success", l) : n.value && u("upload-error", n.value);
      } else if (k.value === "edit" && _.value) {
        const l = await w(r.file, {
          name: _.value.name,
          is_primary: _.value.is_primary,
          fallback_initials: a.initials,
          crop: r.crop
        });
        l ? (await R(_.value.id), u("crop-updated", l, r.crop)) : n.value && u("upload-error", n.value);
      }
      h.value = null, _.value = null;
    }
    function N() {
      b.value = !1, h.value = null, _.value = null;
    }
    async function K(r) {
      if (r.is_primary) return;
      await H(r.id) && u("primary-changed", r);
    }
    async function G(r) {
      if (p.value !== r.id) {
        p.value = r.id;
        return;
      }
      await R(r.id) && (u("delete", r), p.value = null);
    }
    function I() {
      p.value = null;
    }
    function F(r) {
      z.value = r.id, u("select", r);
    }
    function B(r) {
      const l = new Date(r);
      return l.toLocaleDateString(void 0, {
        month: "short",
        day: "numeric",
        year: l.getFullYear() !== (/* @__PURE__ */ new Date()).getFullYear() ? "numeric" : void 0
      });
    }
    function X(r) {
      return {
        upload: "Uploaded",
        gravatar: "Gravatar",
        oauth: "OAuth",
        generated: "Generated",
        ai: "AI Generated"
      }[r] || r;
    }
    return (r, l) => (s(), i("div", wt, [
      e("input", {
        ref_key: "fileInputRef",
        ref: v,
        type: "file",
        accept: "image/*",
        class: "hidden",
        onChange: L
      }, null, 544),
      (s(), ie(he, { to: "body" }, [
        ne(ge, { name: "fade" }, {
          default: ye(() => [
            b.value && (h.value || _.value) ? (s(), i("div", _t, [
              e("div", {
                class: "absolute inset-0 bg-black/80 backdrop-blur-sm",
                onClick: N
              }),
              e("div", Ct, [
                e("h3", $t, P(k.value === "edit" ? "Adjust your photo" : "Position your photo"), 1),
                ne(Ce, {
                  file: h.value,
                  url: g.value,
                  shape: f.shape,
                  "crop-size": f.cropSize,
                  config: { mediaProxyUrl: m(O).mediaProxyUrl },
                  "confirm-label": k.value === "edit" ? "Save changes" : "Upload",
                  onConfirm: V,
                  onCancel: N
                }, null, 8, ["file", "url", "shape", "crop-size", "config", "confirm-label"])
              ])
            ])) : U("", !0)
          ]),
          _: 1
        })
      ])),
      m(y) && m(d).length === 0 ? (s(), i("div", zt, [...l[1] || (l[1] = [
        e("div", { class: "w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" }, null, -1)
      ])])) : m(n) && m(d).length === 0 ? (s(), i("div", Mt, [
        e("div", St, P(m(n)), 1),
        e("button", {
          onClick: l[0] || (l[0] = //@ts-ignore
          (...t) => m(D) && m(D)(...t)),
          class: "text-sm text-primary-400 hover:text-primary-300 underline"
        }, " Try again ")
      ])) : f.mode === "compact" ? (s(), i("div", It, [
        e("div", Et, [
          (s(!0), i(Q, null, ae(m(d), (t) => (s(), i("div", {
            key: t.id,
            class: "relative group",
            style: J({ width: `${f.avatarSize}px`, height: `${f.avatarSize}px` })
          }, [
            e("button", {
              onClick: ($) => F(t),
              class: Y(["w-full h-full overflow-hidden transition-all duration-200", [
                c.value,
                t.is_primary ? "ring-[3px] ring-emerald-500 ring-offset-2 ring-offset-dark-900" : z.value === t.id ? "ring-2 ring-dark-400 ring-offset-2 ring-offset-dark-900" : "ring-2 ring-transparent hover:ring-dark-500 ring-offset-2 ring-offset-dark-900"
              ]])
            }, [
              e("img", {
                src: m(S)(t, "md"),
                alt: t.alt_text || t.name || "Avatar",
                class: "w-full h-full object-cover",
                style: J(t.dominant_color ? { backgroundColor: t.dominant_color } : {})
              }, null, 12, Lt)
            ], 10, Ut),
            t.moderation_status === "pending" ? (s(), i("div", jt, [...l[2] || (l[2] = [
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
            ])])) : U("", !0),
            e("div", {
              class: Y(["absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1", [
                c.value,
                p.value === t.id ? "z-50 opacity-100" : "z-10"
              ]])
            }, [
              f.allowEdit ? (s(), i("button", {
                key: 0,
                type: "button",
                onClick: te(($) => T(t), ["stop"]),
                class: "p-1.5 bg-dark-700 hover:bg-primary-600 rounded-lg transition-colors",
                title: "Edit crop"
              }, [...l[3] || (l[3] = [
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
              ])], 8, At)) : U("", !0),
              t.is_primary ? U("", !0) : (s(), i("button", {
                key: 1,
                type: "button",
                onClick: te(($) => K(t), ["stop"]),
                class: "p-1.5 bg-dark-700 hover:bg-emerald-600 rounded-lg transition-colors",
                title: "Set as primary"
              }, [...l[4] || (l[4] = [
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
              f.allowDelete ? (s(), i("button", {
                key: 2,
                type: "button",
                onClick: te(($) => G(t), ["stop"]),
                class: Y(["p-1.5 rounded-lg transition-colors", p.value === t.id ? "bg-red-600 hover:bg-red-700" : "bg-dark-700 hover:bg-red-600"]),
                title: p.value === t.id ? "Click again to confirm" : "Delete"
              }, [...l[5] || (l[5] = [
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
              ])], 10, Pt)) : U("", !0)
            ], 2)
          ], 4))), 128)),
          o.value ? (s(), i("button", {
            key: 0,
            type: "button",
            onClick: x,
            disabled: m(j),
            class: Y(["flex items-center justify-center border-2 border-dashed border-dark-600 hover:border-primary-500 transition-colors", c.value]),
            style: J({ width: `${f.avatarSize}px`, height: `${f.avatarSize}px` })
          }, [
            m(j) ? (s(), i("div", Ot, [
              (s(), i("svg", Tt, [
                l[6] || (l[6] = e("path", {
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
                  "stroke-dasharray": `${m(E)}, 100`,
                  d: "M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                }, null, 8, Dt)
              ])),
              e("span", Bt, P(m(E)) + "%", 1)
            ])) : (s(), i("div", Ht, [...l[7] || (l[7] = [
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
          ], 14, Rt)) : U("", !0)
        ]),
        e("p", Zt, [
          m(d).length === 0 ? (s(), i("span", Yt, "Upload your first avatar")) : (s(), i("span", Vt, [
            ve(P(m(d).length) + "/" + P(f.maxAvatars) + " · ", 1),
            l[8] || (l[8] = e("span", { class: "text-emerald-500" }, "Green ring", -1)),
            l[9] || (l[9] = ve(" = primary · Hover for options ", -1))
          ]))
        ]),
        m(n) ? (s(), i("div", Nt, P(m(n)), 1)) : U("", !0)
      ])) : (s(), i("div", Xt, [
        e("div", Wt, [
          (s(!0), i(Q, null, ae(m(d), (t) => (s(), i("div", {
            key: t.id,
            class: Y(["flex items-center gap-4 p-3 rounded-xl transition-colors", [
              t.is_primary ? "bg-emerald-500/10 border border-emerald-500/30" : "bg-dark-800 border border-dark-700 hover:border-dark-600"
            ]])
          }, [
            e("button", {
              onClick: ($) => F(t),
              class: Y(["flex-shrink-0 w-14 h-14 overflow-hidden transition-transform hover:scale-105", c.value])
            }, [
              e("img", {
                src: m(S)(t, "sm"),
                alt: t.alt_text || t.name || "Avatar",
                class: "w-full h-full object-cover"
              }, null, 8, Jt)
            ], 10, qt),
            e("div", Gt, [
              e("div", Kt, [
                e("span", Qt, P(t.name || "Unnamed avatar"), 1),
                t.is_primary ? (s(), i("span", ea, " Primary ")) : U("", !0),
                t.moderation_status === "pending" ? (s(), i("span", ta, " Pending ")) : U("", !0)
              ]),
              e("div", aa, [
                e("span", null, P(X(t.source)), 1),
                l[10] || (l[10] = e("span", null, "·", -1)),
                e("span", null, P(B(t.created_at)), 1),
                t.format === "animated" ? (s(), i("span", oa, "·")) : U("", !0),
                t.format === "animated" ? (s(), i("span", na, "Animated")) : U("", !0)
              ])
            ]),
            e("div", la, [
              f.allowEdit ? (s(), i("button", {
                key: 0,
                type: "button",
                onClick: ($) => T(t),
                class: "p-2 text-dark-400 hover:text-primary-400 hover:bg-dark-700 rounded-lg transition-colors",
                title: "Edit crop"
              }, [...l[11] || (l[11] = [
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
              ])], 8, ra)) : U("", !0),
              t.is_primary ? U("", !0) : (s(), i("button", {
                key: 1,
                type: "button",
                onClick: ($) => K(t),
                class: "p-2 text-dark-400 hover:text-emerald-400 hover:bg-dark-700 rounded-lg transition-colors",
                title: "Set as primary"
              }, [...l[12] || (l[12] = [
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
              f.allowDelete ? (s(), i("button", {
                key: 2,
                type: "button",
                onClick: ($) => G(t),
                class: Y(["p-2 rounded-lg transition-colors", p.value === t.id ? "text-white bg-red-600 hover:bg-red-700" : "text-dark-400 hover:text-red-400 hover:bg-dark-700"]),
                title: p.value === t.id ? "Click again to confirm" : "Delete"
              }, [...l[13] || (l[13] = [
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
              ])], 10, ia)) : U("", !0)
            ])
          ], 2))), 128))
        ]),
        o.value ? (s(), i("button", {
          key: 0,
          type: "button",
          onClick: x,
          disabled: m(j),
          class: "w-full flex items-center justify-center gap-3 p-4 border-2 border-dashed border-dark-600 hover:border-primary-500 rounded-xl transition-colors group"
        }, [
          m(j) ? (s(), i(Q, { key: 0 }, [
            l[14] || (l[14] = e("div", { class: "w-5 h-5 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" }, null, -1)),
            e("span", ca, "Uploading... " + P(m(E)) + "%", 1)
          ], 64)) : (s(), i(Q, { key: 1 }, [
            l[15] || (l[15] = e("svg", {
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
            l[16] || (l[16] = e("span", { class: "text-dark-500 group-hover:text-primary-400 transition-colors" }, " Add new avatar ", -1))
          ], 64))
        ], 8, ua)) : U("", !0),
        e("div", da, [
          e("span", null, P(m(d).length) + " of " + P(f.maxAvatars) + " avatars", 1),
          m(n) ? (s(), i("span", va, P(m(n)), 1)) : U("", !0)
        ])
      ])),
      p.value ? (s(), i("div", {
        key: 4,
        class: "fixed inset-0 z-40",
        onClick: I
      })) : U("", !0)
    ]));
  }
}), Ha = /* @__PURE__ */ le(pa, [["__scopeId", "data-v-52a5c188"]]), fa = [
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
  smileys: [
    "😀",
    "😃",
    "😄",
    "😁",
    "😅",
    "😂",
    "🤣",
    "😊",
    "😇",
    "🙂",
    "🙃",
    "😉",
    "😌",
    "😍",
    "🥰",
    "😘",
    "😗",
    "😙",
    "😚",
    "😋",
    "😛",
    "😜",
    "🤪",
    "😝",
    "🤑",
    "🤗",
    "🤭",
    "🤫",
    "🤔",
    "🤐",
    "🤨",
    "😐",
    "😑",
    "😶",
    "😏",
    "😒",
    "🙄",
    "😬",
    "🤥",
    "😌",
    "😔",
    "😪",
    "🤤",
    "😴",
    "😷",
    "🤒",
    "🤕",
    "🤢",
    "🤮",
    "🤧",
    "🥵",
    "🥶",
    "🥴",
    "😵",
    "🤯",
    "🤠",
    "🥳",
    "🥸",
    "😎",
    "🤓",
    "🧐",
    "😕",
    "😟",
    "🙁",
    "☹️",
    "😮",
    "😯",
    "😲",
    "😳",
    "🥺",
    "😦",
    "😧",
    "😨",
    "😰",
    "😥",
    "😢",
    "😭",
    "😱",
    "😖",
    "😣",
    "😞",
    "😓",
    "😩",
    "😫",
    "🥱",
    "😤",
    "😡",
    "😠",
    "🤬",
    "😈",
    "👿",
    "💀",
    "☠️",
    "💩",
    "🤡",
    "👹",
    "👺",
    "👻",
    "👽",
    "👾",
    "🤖"
  ],
  people: [
    "👋",
    "🤚",
    "🖐️",
    "✋",
    "🖖",
    "👌",
    "🤌",
    "🤏",
    "✌️",
    "🤞",
    "🤟",
    "🤘",
    "🤙",
    "👈",
    "👉",
    "👆",
    "🖕",
    "👇",
    "☝️",
    "👍",
    "👎",
    "✊",
    "👊",
    "🤛",
    "🤜",
    "👏",
    "🙌",
    "👐",
    "🤲",
    "🤝",
    "🙏",
    "✍️",
    "💅",
    "🤳",
    "💪",
    "🦾",
    "🦿",
    "🦵",
    "🦶",
    "👂",
    "🦻",
    "👃",
    "🧠",
    "🫀",
    "🫁",
    "🦷",
    "🦴",
    "👀",
    "👁️",
    "👅",
    "👄",
    "💋",
    "👶",
    "🧒",
    "👦",
    "👧",
    "🧑",
    "👱",
    "👨",
    "🧔",
    "👩",
    "🧓",
    "👴",
    "👵"
  ],
  animals: [
    "🐶",
    "🐱",
    "🐭",
    "🐹",
    "🐰",
    "🦊",
    "🐻",
    "🐼",
    "🐨",
    "🐯",
    "🦁",
    "🐮",
    "🐷",
    "🐸",
    "🐵",
    "🙈",
    "🙉",
    "🙊",
    "🐒",
    "🐔",
    "🐧",
    "🐦",
    "🐤",
    "🐣",
    "🐥",
    "🦆",
    "🦅",
    "🦉",
    "🦇",
    "🐺",
    "🐗",
    "🐴",
    "🦄",
    "🐝",
    "🪱",
    "🐛",
    "🦋",
    "🐌",
    "🐞",
    "🐜",
    "🪰",
    "🪲",
    "🪳",
    "🦟",
    "🦗",
    "🕷️",
    "🦂",
    "🐢",
    "🐍",
    "🦎",
    "🦖",
    "🦕",
    "🐙",
    "🦑",
    "🦐",
    "🦞",
    "🦀",
    "🐡",
    "🐠",
    "🐟",
    "🐬",
    "🐳",
    "🐋",
    "🦈",
    "🐊"
  ],
  food: [
    "🍏",
    "🍎",
    "🍐",
    "🍊",
    "🍋",
    "🍌",
    "🍉",
    "🍇",
    "🍓",
    "🫐",
    "🍈",
    "🍒",
    "🍑",
    "🥭",
    "🍍",
    "🥥",
    "🥝",
    "🍅",
    "🍆",
    "🥑",
    "🥦",
    "🥬",
    "🥒",
    "🌶️",
    "🫑",
    "🌽",
    "🥕",
    "🫒",
    "🧄",
    "🧅",
    "🥔",
    "🍠",
    "🥐",
    "🥯",
    "🍞",
    "🥖",
    "🥨",
    "🧀",
    "🥚",
    "🍳",
    "🧈",
    "🥞",
    "🧇",
    "🥓",
    "🥩",
    "🍗",
    "🍖",
    "🦴",
    "🌭",
    "🍔",
    "🍟",
    "🍕",
    "🫓",
    "🥪",
    "🥙",
    "🧆",
    "🌮",
    "🌯",
    "🫔",
    "🥗",
    "🥘",
    "🫕",
    "🍝",
    "🍜",
    "🍲",
    "🍛",
    "🍣",
    "🍱",
    "🥟",
    "🦪",
    "🍤",
    "🍙",
    "🍚",
    "🍘",
    "🍥",
    "🥠",
    "🥮",
    "🍢",
    "🍡",
    "🍧",
    "🍨",
    "🍦",
    "🥧",
    "🧁",
    "🍰",
    "🎂",
    "🍮",
    "🍭",
    "🍬",
    "🍫",
    "🍿",
    "🍩",
    "🍪",
    "🌰",
    "🥜",
    "🍯",
    "🥛",
    "🍼",
    "☕",
    "🍵",
    "🧃",
    "🥤",
    "🧋",
    "🍶",
    "🍺",
    "🍻",
    "🥂",
    "🍷",
    "🥃",
    "🍸",
    "🍹",
    "🧉",
    "🍾",
    "🧊"
  ],
  travel: [
    "🚗",
    "🚕",
    "🚙",
    "🚌",
    "🚎",
    "🏎️",
    "🚓",
    "🚑",
    "🚒",
    "🚐",
    "🛻",
    "🚚",
    "🚛",
    "🚜",
    "🏍️",
    "🛵",
    "🚲",
    "🛴",
    "🛹",
    "🛼",
    "🚁",
    "🛸",
    "✈️",
    "🛩️",
    "🛫",
    "🛬",
    "🚀",
    "🛰️",
    "🚢",
    "⛵",
    "🛥️",
    "🚤",
    "⛴️",
    "🛳️",
    "🚂",
    "🚃",
    "🚄",
    "🚅",
    "🚆",
    "🚇",
    "🚈",
    "🚉",
    "🚊",
    "🚝",
    "🚞",
    "🏠",
    "🏡",
    "🏢",
    "🏣",
    "🏤",
    "🏥",
    "🏦",
    "🏨",
    "🏩",
    "🏪",
    "🏫",
    "🏬",
    "🏭",
    "🏯",
    "🏰",
    "💒",
    "🗼",
    "🗽",
    "⛪",
    "🕌",
    "🛕",
    "🕍",
    "⛩️",
    "🕋",
    "⛲",
    "⛺",
    "🌁",
    "🌃",
    "🏙️",
    "🌄",
    "🌅",
    "🌆",
    "🌇",
    "🌉",
    "🎠",
    "🎡",
    "🎢",
    "🚣",
    "🗾",
    "🏔️",
    "⛰️",
    "🌋",
    "🗻",
    "🏕️",
    "🏖️",
    "🏜️",
    "🏝️",
    "🏞️"
  ],
  activities: [
    "⚽",
    "🏀",
    "🏈",
    "⚾",
    "🥎",
    "🎾",
    "🏐",
    "🏉",
    "🥏",
    "🎱",
    "🪀",
    "🏓",
    "🏸",
    "🏒",
    "🏑",
    "🥍",
    "🏏",
    "🪃",
    "🥅",
    "⛳",
    "🪁",
    "🏹",
    "🎣",
    "🤿",
    "🥊",
    "🥋",
    "🎽",
    "🛹",
    "🛼",
    "🛷",
    "⛸️",
    "🥌",
    "🎿",
    "⛷️",
    "🏂",
    "🪂",
    "🏋️",
    "🤼",
    "🤸",
    "🤺",
    "⛹️",
    "🤾",
    "🏌️",
    "🏇",
    "🧘",
    "🏄",
    "🏊",
    "🤽",
    "🚣",
    "🧗",
    "🚴",
    "🚵",
    "🎪",
    "🎭",
    "🎨",
    "🎬",
    "🎤",
    "🎧",
    "🎼",
    "🎹",
    "🥁",
    "🪘",
    "🎷",
    "🎺",
    "🪗",
    "🎸",
    "🪕",
    "🎻",
    "🎲",
    "♟️",
    "🎯",
    "🎳",
    "🎮",
    "🎰",
    "🧩"
  ],
  objects: [
    "💡",
    "🔦",
    "🏮",
    "🪔",
    "📱",
    "📲",
    "💻",
    "🖥️",
    "🖨️",
    "⌨️",
    "🖱️",
    "🖲️",
    "💽",
    "💾",
    "💿",
    "📀",
    "🧮",
    "🎥",
    "🎞️",
    "📽️",
    "📺",
    "📷",
    "📸",
    "📹",
    "📼",
    "🔍",
    "🔎",
    "🕯️",
    "💰",
    "💴",
    "💵",
    "💶",
    "💷",
    "💸",
    "💳",
    "🧾",
    "💎",
    "⚖️",
    "🪜",
    "🧰",
    "🪛",
    "🔧",
    "🔨",
    "⚒️",
    "🛠️",
    "⛏️",
    "🪚",
    "🔩",
    "⚙️",
    "🪤",
    "🧱",
    "⛓️",
    "🧲",
    "🔫",
    "💣",
    "🧨",
    "🪓",
    "🔪",
    "🗡️",
    "⚔️",
    "🛡️",
    "🚬",
    "⚰️",
    "🪦",
    "⚱️",
    "🏺",
    "🔮",
    "📿",
    "🧿",
    "💈",
    "⚗️",
    "🔭",
    "🔬",
    "🕳️",
    "🩹",
    "🩺",
    "💊",
    "💉",
    "🩸",
    "🧬",
    "🦠",
    "🧫",
    "🧪",
    "🌡️",
    "🧹",
    "🪠",
    "🧺",
    "🧻",
    "🚽",
    "🚿",
    "🛁",
    "🛀",
    "🧼",
    "🪥",
    "🪒",
    "🧽",
    "🪣",
    "🧴",
    "🛎️",
    "🔑",
    "🗝️",
    "🚪",
    "🪑",
    "🛋️",
    "🛏️",
    "🛌",
    "🧸",
    "🪆",
    "🖼️",
    "🪞",
    "🪟",
    "🛍️",
    "🛒",
    "🎁",
    "🎈",
    "🎏",
    "🎀",
    "🪄",
    "🪅",
    "🎊",
    "🎉",
    "🎎",
    "🏮",
    "🎐",
    "🧧",
    "✉️",
    "📩",
    "📨",
    "📧",
    "💌",
    "📥",
    "📤",
    "📦",
    "🏷️",
    "📪",
    "📫",
    "📬",
    "📭",
    "📮",
    "📯",
    "📜",
    "📃",
    "📄",
    "📑",
    "🧾",
    "📊",
    "📈",
    "📉",
    "🗒️",
    "🗓️",
    "📆",
    "📅",
    "🗑️",
    "📇",
    "🗃️",
    "🗳️",
    "🗄️",
    "📋",
    "📁",
    "📂",
    "🗂️",
    "🗞️",
    "📰",
    "📓",
    "📔",
    "📒",
    "📕",
    "📗",
    "📘",
    "📙",
    "📚",
    "📖",
    "🔖",
    "🧷",
    "🔗",
    "📎",
    "🖇️",
    "📐",
    "📏",
    "🧮",
    "📌",
    "📍",
    "✂️",
    "🖊️",
    "🖋️",
    "✒️",
    "🖌️",
    "🖍️",
    "📝",
    "✏️",
    "🔍",
    "🔎",
    "🔏",
    "🔐",
    "🔒",
    "🔓"
  ],
  symbols: [
    "❤️",
    "🧡",
    "💛",
    "💚",
    "💙",
    "💜",
    "🖤",
    "🤍",
    "🤎",
    "💔",
    "❣️",
    "💕",
    "💞",
    "💓",
    "💗",
    "💖",
    "💘",
    "💝",
    "💟",
    "☮️",
    "✝️",
    "☪️",
    "🕉️",
    "☸️",
    "✡️",
    "🔯",
    "🕎",
    "☯️",
    "☦️",
    "🛐",
    "⛎",
    "♈",
    "♉",
    "♊",
    "♋",
    "♌",
    "♍",
    "♎",
    "♏",
    "♐",
    "♑",
    "♒",
    "♓",
    "🆔",
    "⚛️",
    "🉑",
    "☢️",
    "☣️",
    "📴",
    "📳",
    "🈶",
    "🈚",
    "🈸",
    "🈺",
    "🈷️",
    "✴️",
    "🆚",
    "💮",
    "🉐",
    "㊙️",
    "㊗️",
    "🈴",
    "🈵",
    "🈹",
    "🈲",
    "🅰️",
    "🅱️",
    "🆎",
    "🆑",
    "🅾️",
    "🆘",
    "❌",
    "⭕",
    "🛑",
    "⛔",
    "📛",
    "🚫",
    "💯",
    "💢",
    "♨️",
    "🚷",
    "🚯",
    "🚳",
    "🚱",
    "🔞",
    "📵",
    "🚭",
    "❗",
    "❕",
    "❓",
    "❔",
    "‼️",
    "⁉️",
    "🔅",
    "🔆",
    "〽️",
    "⚠️",
    "🚸",
    "🔱",
    "⚜️",
    "🔰",
    "♻️",
    "✅",
    "🈯",
    "💹",
    "❇️",
    "✳️",
    "❎",
    "🌐",
    "💠",
    "Ⓜ️",
    "🌀",
    "💤",
    "🏧",
    "🚾",
    "♿",
    "🅿️",
    "🛗",
    "🈳",
    "🈂️",
    "🛂",
    "🛃",
    "🛄",
    "🛅",
    "🚹",
    "🚺",
    "🚼",
    "⚧️",
    "🚻",
    "🚮",
    "🎦",
    "📶",
    "🈁",
    "🔣",
    "ℹ️",
    "🔤",
    "🔡",
    "🔠",
    "🆖",
    "🆗",
    "🆙",
    "🆒",
    "🆕",
    "🆓",
    "0️⃣",
    "1️⃣",
    "2️⃣",
    "3️⃣",
    "4️⃣",
    "5️⃣",
    "6️⃣",
    "7️⃣",
    "8️⃣",
    "9️⃣",
    "🔟",
    "🔢",
    "#️⃣",
    "*️⃣",
    "⏏️",
    "▶️",
    "⏸️",
    "⏯️",
    "⏹️",
    "⏺️",
    "⏭️",
    "⏮️",
    "⏩",
    "⏪",
    "⏫",
    "⏬",
    "◀️",
    "🔼",
    "🔽",
    "➡️",
    "⬅️",
    "⬆️",
    "⬇️",
    "↗️",
    "↘️",
    "↙️",
    "↖️",
    "↕️",
    "↔️",
    "↪️",
    "↩️",
    "⤴️",
    "⤵️",
    "🔀",
    "🔁",
    "🔂",
    "🔄",
    "🔃",
    "🎵",
    "🎶",
    "➕",
    "➖",
    "➗",
    "✖️",
    "♾️",
    "💲",
    "💱",
    "™️",
    "©️",
    "®️",
    "〰️",
    "➰",
    "➿",
    "🔚",
    "🔙",
    "🔛",
    "🔝",
    "🔜",
    "✔️",
    "☑️",
    "🔘",
    "🔴",
    "🟠",
    "🟡",
    "🟢",
    "🔵",
    "🟣",
    "⚫",
    "⚪",
    "🟤",
    "🔺",
    "🔻",
    "🔸",
    "🔹",
    "🔶",
    "🔷",
    "🔳",
    "🔲",
    "▪️",
    "▫️",
    "◾",
    "◽",
    "◼️",
    "◻️",
    "🟥",
    "🟧",
    "🟨",
    "🟩",
    "🟦",
    "🟪",
    "⬛",
    "⬜",
    "🟫",
    "🔈",
    "🔇",
    "🔉",
    "🔊",
    "🔔",
    "🔕",
    "📣",
    "📢",
    "👁️‍🗨️",
    "💬",
    "💭",
    "🗯️",
    "♠️",
    "♣️",
    "♥️",
    "♦️",
    "🃏",
    "🎴",
    "🀄",
    "🕐",
    "🕑",
    "🕒",
    "🕓",
    "🕔",
    "🕕",
    "🕖",
    "🕗",
    "🕘",
    "🕙",
    "🕚",
    "🕛",
    "🕜",
    "🕝",
    "🕞",
    "🕟",
    "🕠",
    "🕡",
    "🕢",
    "🕣",
    "🕤",
    "🕥",
    "🕦",
    "🕧"
  ],
  flags: [
    "🏳️",
    "🏴",
    "🏁",
    "🚩",
    "🏳️‍🌈",
    "🏳️‍⚧️",
    "🏴‍☠️",
    "🇦🇫",
    "🇦🇱",
    "🇩🇿",
    "🇦🇸",
    "🇦🇩",
    "🇦🇴",
    "🇦🇮",
    "🇦🇶",
    "🇦🇬",
    "🇦🇷",
    "🇦🇲",
    "🇦🇼",
    "🇦🇺",
    "🇦🇹",
    "🇦🇿",
    "🇧🇸",
    "🇧🇭",
    "🇧🇩",
    "🇧🇧",
    "🇧🇾",
    "🇧🇪",
    "🇧🇿",
    "🇧🇯",
    "🇧🇲",
    "🇧🇹",
    "🇧🇴",
    "🇧🇦",
    "🇧🇼",
    "🇧🇷",
    "🇮🇴",
    "🇻🇬",
    "🇧🇳",
    "🇧🇬",
    "🇧🇫",
    "🇧🇮",
    "🇰🇭",
    "🇨🇲",
    "🇨🇦",
    "🇮🇨",
    "🇨🇻",
    "🇧🇶",
    "🇰🇾",
    "🇨🇫",
    "🇹🇩",
    "🇨🇱",
    "🇨🇳",
    "🇨🇽",
    "🇨🇨",
    "🇨🇴",
    "🇰🇲",
    "🇨🇬",
    "🇨🇩",
    "🇨🇰",
    "🇨🇷",
    "🇨🇮",
    "🇭🇷",
    "🇨🇺",
    "🇨🇼",
    "🇨🇾",
    "🇨🇿",
    "🇩🇰",
    "🇩🇯",
    "🇩🇲",
    "🇩🇴",
    "🇪🇨",
    "🇪🇬",
    "🇸🇻",
    "🇬🇶",
    "🇪🇷",
    "🇪🇪",
    "🇸🇿",
    "🇪🇹",
    "🇪🇺",
    "🇫🇰",
    "🇫🇴",
    "🇫🇯",
    "🇫🇮",
    "🇫🇷",
    "🇬🇫",
    "🇵🇫",
    "🇹🇫",
    "🇬🇦",
    "🇬🇲",
    "🇬🇪",
    "🇩🇪",
    "🇬🇭",
    "🇬🇮",
    "🇬🇷",
    "🇬🇱",
    "🇬🇩",
    "🇬🇵",
    "🇬🇺",
    "🇬🇹",
    "🇬🇬",
    "🇬🇳",
    "🇬🇼",
    "🇬🇾",
    "🇭🇹",
    "🇭🇳",
    "🇭🇰",
    "🇭🇺",
    "🇮🇸",
    "🇮🇳",
    "🇮🇩",
    "🇮🇷",
    "🇮🇶",
    "🇮🇪",
    "🇮🇲",
    "🇮🇱",
    "🇮🇹",
    "🇯🇲",
    "🇯🇵",
    "🎌",
    "🇯🇪",
    "🇯🇴",
    "🇰🇿",
    "🇰🇪",
    "🇰🇮",
    "🇽🇰",
    "🇰🇼",
    "🇰🇬",
    "🇱🇦",
    "🇱🇻",
    "🇱🇧",
    "🇱🇸",
    "🇱🇷",
    "🇱🇾",
    "🇱🇮",
    "🇱🇹",
    "🇱🇺",
    "🇲🇴",
    "🇲🇬",
    "🇲🇼",
    "🇲🇾",
    "🇲🇻",
    "🇲🇱",
    "🇲🇹",
    "🇲🇭",
    "🇲🇶",
    "🇲🇷",
    "🇲🇺",
    "🇾🇹",
    "🇲🇽",
    "🇫🇲",
    "🇲🇩",
    "🇲🇨",
    "🇲🇳",
    "🇲🇪",
    "🇲🇸",
    "🇲🇦",
    "🇲🇿",
    "🇲🇲",
    "🇳🇦",
    "🇳🇷",
    "🇳🇵",
    "🇳🇱",
    "🇳🇨",
    "🇳🇿",
    "🇳🇮",
    "🇳🇪",
    "🇳🇬",
    "🇳🇺",
    "🇳🇫",
    "🇰🇵",
    "🇲🇰",
    "🇲🇵",
    "🇳🇴",
    "🇴🇲",
    "🇵🇰",
    "🇵🇼",
    "🇵🇸",
    "🇵🇦",
    "🇵🇬",
    "🇵🇾",
    "🇵🇪",
    "🇵🇭",
    "🇵🇳",
    "🇵🇱",
    "🇵🇹",
    "🇵🇷",
    "🇶🇦",
    "🇷🇪",
    "🇷🇴",
    "🇷🇺",
    "🇷🇼",
    "🇼🇸",
    "🇸🇲",
    "🇸🇹",
    "🇸🇦",
    "🇸🇳",
    "🇷🇸",
    "🇸🇨",
    "🇸🇱",
    "🇸🇬",
    "🇸🇽",
    "🇸🇰",
    "🇸🇮",
    "🇬🇸",
    "🇸🇧",
    "🇸🇴",
    "🇿🇦",
    "🇰🇷",
    "🇸🇸",
    "🇪🇸",
    "🇱🇰",
    "🇧🇱",
    "🇸🇭",
    "🇰🇳",
    "🇱🇨",
    "🇵🇲",
    "🇻🇨",
    "🇸🇩",
    "🇸🇷",
    "🇸🇪",
    "🇨🇭",
    "🇸🇾",
    "🇹🇼",
    "🇹🇯",
    "🇹🇿",
    "🇹🇭",
    "🇹🇱",
    "🇹🇬",
    "🇹🇰",
    "🇹🇴",
    "🇹🇹",
    "🇹🇳",
    "🇹🇷",
    "🇹🇲",
    "🇹🇨",
    "🇹🇻",
    "🇻🇮",
    "🇺🇬",
    "🇺🇦",
    "🇦🇪",
    "🇬🇧",
    "🏴󠁧󠁢󠁥󠁮󠁧󠁿",
    "🏴󠁧󠁢󠁳󠁣󠁴󠁿",
    "🏴󠁧󠁢󠁷󠁬󠁳󠁿",
    "🇺🇸",
    "🇺🇾",
    "🇺🇿",
    "🇻🇺",
    "🇻🇦",
    "🇻🇪",
    "🇻🇳",
    "🇼🇫",
    "🇪🇭",
    "🇾🇪",
    "🇿🇲",
    "🇿🇼"
  ]
};
function ha() {
  const f = [];
  for (const [M, a] of Object.entries(ma))
    for (const u of a)
      f.push({
        id: u,
        value: u,
        type: "emoji",
        keywords: [u],
        // Basic - could be enhanced with actual keyword data
        category: M
      });
  return f;
}
function ga(f = {}) {
  var o;
  const {
    categories: M = fa,
    customItems: a = [],
    getFavorites: u = () => [],
    saveFavorite: d,
    maxFavorites: y = 16,
    columns: n = 8
  } = f, j = C(!1), E = C(""), O = C(((o = M[0]) == null ? void 0 : o.id) || "smileys"), D = C(0), H = Se(ha()), R = A(() => [...H.value, ...a]), w = A(() => {
    const c = u();
    return R.value.filter((g) => c.includes(g.id)).slice(0, y);
  }), S = A(() => {
    const c = E.value.toLowerCase().trim();
    return c ? R.value.filter((g) => g.value.includes(c) ? !0 : g.keywords.some((x) => x.toLowerCase().includes(c))) : [];
  }), v = A(() => O.value === "favorites" ? w.value : R.value.filter((c) => c.category === O.value)), p = A(() => E.value.trim() ? S.value : v.value);
  function z() {
    j.value = !0, E.value = "";
  }
  function b() {
    j.value = !1;
  }
  function k(c) {
    return d && d(c.id), c;
  }
  function h(c) {
    O.value = c, E.value = "";
  }
  function _(c) {
    E.value = c;
  }
  return {
    // State
    isOpen: j,
    searchQuery: E,
    activeCategory: O,
    selectedSkinTone: D,
    // Data
    categories: M,
    allItems: R,
    favorites: w,
    displayItems: p,
    searchResults: S,
    columns: n,
    // Actions
    open: z,
    close: b,
    selectItem: k,
    setCategory: h,
    setSearch: _
  };
}
const ya = { class: "nui-picker-search" }, ka = ["value", "placeholder"], xa = { class: "nui-picker-categories" }, ba = ["title", "onClick"], wa = { class: "nui-category-icon" }, _a = {
  key: 0,
  class: "nui-picker-empty"
}, Ca = { key: 0 }, $a = { key: 1 }, za = { key: 2 }, Ma = ["title", "onClick"], Sa = {
  key: 0,
  class: "nui-item-emoji"
}, Ia = ["src", "alt"], Ea = {
  key: 2,
  class: "nui-item-fallback"
}, Ua = {
  key: 0,
  class: "nui-picker-favorites"
}, La = { class: "nui-favorites-grid" }, ja = ["title", "onClick"], Aa = {
  key: 0,
  class: "nui-item-emoji"
}, Fa = ["src", "alt"], Pa = /* @__PURE__ */ oe({
  __name: "EmojiPicker",
  props: {
    favorites: { default: () => [] },
    customItems: { default: () => [] },
    categories: {},
    columns: { default: 8 },
    maxFavorites: { default: 16 },
    searchPlaceholder: { default: "Search emoji..." }
  },
  emits: ["select", "favorite"],
  setup(f, { emit: M }) {
    const a = f, u = M, d = {
      categories: a.categories,
      customItems: a.customItems,
      getFavorites: () => a.favorites,
      saveFavorite: (h) => u("favorite", h),
      maxFavorites: a.maxFavorites,
      columns: a.columns
    }, {
      searchQuery: y,
      activeCategory: n,
      categories: j,
      displayItems: E,
      favorites: O,
      setCategory: D,
      setSearch: H,
      selectItem: R
    } = ga(d), w = C(null), S = C(null);
    se(() => {
      Ie(() => {
        var h;
        (h = w.value) == null || h.focus();
      });
    });
    function v(h) {
      const _ = R(h);
      u("select", _);
    }
    function p(h) {
      const _ = h.target.value;
      H(_);
    }
    function z(h) {
      D(h);
    }
    function b(h) {
      var _;
      h.key === "Escape" && ((_ = w.value) == null || _.blur());
    }
    const k = A(() => ({
      gridTemplateColumns: `repeat(${a.columns}, 1fr)`
    }));
    return (h, _) => (s(), i("div", {
      class: "nui-emoji-picker",
      onKeydown: b
    }, [
      e("div", ya, [
        e("input", {
          ref_key: "searchInputRef",
          ref: w,
          type: "text",
          value: m(y),
          placeholder: f.searchPlaceholder,
          class: "nui-picker-search-input",
          onInput: p
        }, null, 40, ka),
        _[0] || (_[0] = e("svg", {
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
      e("div", xa, [
        (s(!0), i(Q, null, ae(m(j), (o) => (s(), i("button", {
          key: o.id,
          class: Y(["nui-picker-category-tab", { active: m(n) === o.id }]),
          title: o.name,
          onClick: (c) => z(o.id)
        }, [
          e("span", wa, P(o.icon), 1)
        ], 10, ba))), 128))
      ]),
      e("div", {
        ref_key: "gridRef",
        ref: S,
        class: "nui-picker-grid-container"
      }, [
        m(E).length === 0 ? (s(), i("div", _a, [
          m(y) ? (s(), i("span", Ca, 'No results for "' + P(m(y)) + '"', 1)) : m(n) === "favorites" ? (s(), i("span", $a, "No favorites yet")) : (s(), i("span", za, "No items"))
        ])) : (s(), i("div", {
          key: 1,
          class: "nui-picker-grid",
          style: J(k.value)
        }, [
          (s(!0), i(Q, null, ae(m(E), (o) => {
            var c;
            return s(), i("button", {
              key: o.id,
              class: Y(["nui-picker-item", { "is-custom": o.type !== "emoji" }]),
              title: ((c = o.keywords) == null ? void 0 : c[0]) || o.value,
              onClick: (g) => v(o)
            }, [
              o.type === "emoji" ? (s(), i("span", Sa, P(o.value), 1)) : o.url ? (s(), i("img", {
                key: 1,
                src: o.url,
                alt: o.value,
                class: "nui-item-image"
              }, null, 8, Ia)) : (s(), i("span", Ea, P(o.value), 1))
            ], 10, Ma);
          }), 128))
        ], 4))
      ], 512),
      m(O).length > 0 ? (s(), i("div", Ua, [
        _[1] || (_[1] = e("div", { class: "nui-favorites-label" }, "⭐ Favorites", -1)),
        e("div", La, [
          (s(!0), i(Q, null, ae(m(O), (o) => (s(), i("button", {
            key: "fav-" + o.id,
            class: "nui-picker-item nui-favorite-item",
            title: o.value,
            onClick: (c) => v(o)
          }, [
            o.type === "emoji" ? (s(), i("span", Aa, P(o.value), 1)) : o.url ? (s(), i("img", {
              key: 1,
              src: o.url,
              alt: o.value,
              class: "nui-item-image"
            }, null, 8, Fa)) : U("", !0)
          ], 8, ja))), 128))
        ])
      ])) : U("", !0)
    ], 32));
  }
}), Za = /* @__PURE__ */ le(Pa, [["__scopeId", "data-v-4ed80c96"]]);
export {
  Ce as AvatarCropper,
  Ha as AvatarManager,
  Da as AvatarUpload,
  Za as EmojiPicker,
  Ve as ImageViewer,
  Oa as ImageViewerProvider,
  Ba as configureAvatarManager,
  Ta as configureAvatarUpload,
  Xe as useAvatarCropper,
  bt as useAvatarManager,
  Ne as useAvatarUpload,
  ga as useEmojiPicker,
  _e as useImageViewer
};
//# sourceMappingURL=index.js.map
