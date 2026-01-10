import { ref as _, readonly as ie, defineComponent as le, computed as O, watch as Q, onMounted as fe, onUnmounted as me, createBlock as ne, openBlock as d, Teleport as he, createVNode as ae, Transition as ge, withCtx as ye, createElementBlock as p, createCommentVNode as U, withModifiers as ee, createElementVNode as e, toDisplayString as R, withDirectives as ze, normalizeStyle as W, vShow as $e, Fragment as te, renderList as ce, normalizeClass as Y, unref as h, createStaticVNode as Me, createTextVNode as de } from "vue";
const oe = _(!1), ke = _([]), we = _(0);
let be = null;
function Ce() {
  function c(k) {
    be = k;
  }
  function S() {
    return be;
  }
  function a(k, l = 0) {
    ke.value = k, we.value = l, oe.value = !0;
  }
  function i() {
    oe.value = !1;
  }
  function u(k, l) {
    a([{ url: k, alt: l }], 0);
  }
  return {
    // State (readonly to prevent external mutation)
    isOpen: ie(oe),
    images: ie(ke),
    initialIndex: ie(we),
    // Actions
    openViewer: a,
    closeViewer: i,
    openImage: u,
    setVariantFetcher: c,
    getVariantFetcher: S,
    // For the provider component
    _setOpen: (k) => {
      oe.value = k;
    }
  };
}
const Se = { class: "viewer-toolbar top" }, Le = {
  key: 0,
  class: "image-counter"
}, Ee = { class: "image-container" }, Ue = {
  key: 0,
  class: "loading-spinner"
}, Ie = {
  key: 1,
  class: "error-state"
}, Ae = ["src", "alt"], je = {
  key: 2,
  class: "loading-variants"
}, Oe = { class: "viewer-toolbar bottom" }, Pe = { class: "zoom-controls" }, Re = {
  key: 2,
  class: "thumbnail-strip"
}, De = ["onClick"], Be = ["src", "alt"], Te = 0.5, Fe = 5, xe = 0.25, Ze = /* @__PURE__ */ le({
  __name: "ImageViewer",
  props: {
    images: {},
    initialIndex: { default: 0 },
    open: { type: Boolean }
  },
  emits: ["close", "indexChange"],
  setup(c, { emit: S }) {
    const a = c, i = S, { getVariantFetcher: u } = Ce(), k = _(a.initialIndex), l = _(1), j = _(0), I = _(0), D = _(!1), T = _({ x: 0, y: 0 }), H = _(!0), Z = _(!1), z = _(!1), $ = _(/* @__PURE__ */ new Map()), s = O(() => a.images[k.value]), v = O(() => {
      const n = s.value;
      if (!n) return null;
      if (n.fileId && $.value.has(n.fileId)) {
        const L = $.value.get(n.fileId);
        return { ...n, variants: L };
      }
      return n;
    }), b = O(() => {
      var L, X, N, F, se;
      const n = v.value;
      if (!n) return "";
      if (n.variants) {
        if ((L = n.variants.lg) != null && L.url) return n.variants.lg.url;
        if ((X = n.variants.original) != null && X.url) return n.variants.original.url;
        if ((N = n.variants.md) != null && N.url) return n.variants.md.url;
        if ((F = n.variants.sm) != null && F.url) return n.variants.sm.url;
        if ((se = n.variants.thumb) != null && se.url) return n.variants.thumb.url;
      }
      return n.url;
    }), w = O(() => a.images.length > 1), y = O(() => k.value > 0), r = O(() => k.value < a.images.length - 1);
    Q(k, () => {
      l.value = 1, j.value = 0, I.value = 0, H.value = !0, Z.value = !1, i("indexChange", k.value);
    }), Q(() => a.open, (n) => {
      n ? (k.value = a.initialIndex, l.value = 1, j.value = 0, I.value = 0, H.value = !0, Z.value = !1, document.body.style.overflow = "hidden", f()) : document.body.style.overflow = "";
    }), Q(s, () => {
      f();
    });
    async function f() {
      var X, N;
      const n = s.value;
      if (!(n != null && n.fileId) || $.value.has(n.fileId) || (X = n.variants) != null && X.lg || (N = n.variants) != null && N.original) return;
      const L = u();
      if (L) {
        z.value = !0;
        try {
          const F = await L(n.fileId);
          F && $.value.set(n.fileId, F);
        } catch (F) {
          console.error("Failed to fetch variants:", F);
        } finally {
          z.value = !1;
        }
      }
    }
    function m() {
      y.value && k.value--;
    }
    function g() {
      r.value && k.value++;
    }
    function x(n) {
      n >= 0 && n < a.images.length && (k.value = n);
    }
    function E() {
      l.value = Math.min(Fe, l.value + xe);
    }
    function B() {
      l.value = Math.max(Te, l.value - xe), l.value <= 1 && (j.value = 0, I.value = 0);
    }
    function V() {
      l.value = 1, j.value = 0, I.value = 0;
    }
    function q(n) {
      n.preventDefault(), n.deltaY < 0 ? E() : B();
    }
    function G(n) {
      if (l.value <= 1) return;
      D.value = !0;
      const L = "touches" in n ? n.touches[0] : n;
      T.value = { x: L.clientX - j.value, y: L.clientY - I.value };
    }
    function K(n) {
      if (!D.value) return;
      n.preventDefault();
      const L = "touches" in n ? n.touches[0] : n;
      j.value = L.clientX - T.value.x, I.value = L.clientY - T.value.y;
    }
    function J() {
      D.value = !1;
    }
    function C(n) {
      if (a.open)
        switch (n.key) {
          case "Escape":
            i("close");
            break;
          case "ArrowLeft":
            m();
            break;
          case "ArrowRight":
            g();
            break;
          case "+":
          case "=":
            E();
            break;
          case "-":
            B();
            break;
          case "0":
            V();
            break;
        }
    }
    async function A() {
      if (v.value)
        try {
          const n = b.value, X = await (await fetch(n)).blob(), N = URL.createObjectURL(X), F = document.createElement("a");
          F.href = N, F.download = v.value.alt || `image-${k.value + 1}`, document.body.appendChild(F), F.click(), document.body.removeChild(F), URL.revokeObjectURL(N);
        } catch (n) {
          console.error("Failed to download image:", n);
        }
    }
    function P() {
      H.value = !1;
    }
    function M() {
      H.value = !1, Z.value = !0;
    }
    function t(n) {
      n.target.classList.contains("viewer-backdrop") && i("close");
    }
    fe(() => {
      window.addEventListener("keydown", C);
    }), me(() => {
      window.removeEventListener("keydown", C), document.body.style.overflow = "";
    });
    const o = O(() => ({
      transform: `scale(${l.value}) translate(${j.value / l.value}px, ${I.value / l.value}px)`,
      cursor: l.value > 1 ? D.value ? "grabbing" : "grab" : "default"
    }));
    return (n, L) => (d(), ne(he, { to: "body" }, [
      ae(ge, { name: "viewer" }, {
        default: ye(() => {
          var X;
          return [
            c.open ? (d(), p("div", {
              key: 0,
              class: "viewer-backdrop",
              onClick: t,
              onWheel: ee(q, ["prevent"])
            }, [
              e("button", {
                class: "viewer-btn close-btn",
                onClick: L[0] || (L[0] = (N) => i("close")),
                title: "Close (Esc)"
              }, [...L[1] || (L[1] = [
                e("svg", {
                  viewBox: "0 0 24 24",
                  fill: "none",
                  stroke: "currentColor",
                  "stroke-width": "2"
                }, [
                  e("path", { d: "M18 6L6 18M6 6l12 12" })
                ], -1)
              ])]),
              e("div", Se, [
                w.value ? (d(), p("span", Le, R(k.value + 1) + " / " + R(c.images.length), 1)) : U("", !0)
              ]),
              w.value && y.value ? (d(), p("button", {
                key: 0,
                class: "viewer-btn nav-btn prev",
                onClick: ee(m, ["stop"]),
                title: "Previous (←)"
              }, [...L[2] || (L[2] = [
                e("svg", {
                  viewBox: "0 0 24 24",
                  fill: "none",
                  stroke: "currentColor",
                  "stroke-width": "2"
                }, [
                  e("path", { d: "M15 18l-6-6 6-6" })
                ], -1)
              ])])) : U("", !0),
              w.value && r.value ? (d(), p("button", {
                key: 1,
                class: "viewer-btn nav-btn next",
                onClick: ee(g, ["stop"]),
                title: "Next (→)"
              }, [...L[3] || (L[3] = [
                e("svg", {
                  viewBox: "0 0 24 24",
                  fill: "none",
                  stroke: "currentColor",
                  "stroke-width": "2"
                }, [
                  e("path", { d: "M9 18l6-6-6-6" })
                ], -1)
              ])])) : U("", !0),
              e("div", Ee, [
                H.value ? (d(), p("div", Ue, [...L[4] || (L[4] = [
                  e("div", { class: "spinner" }, null, -1)
                ])])) : U("", !0),
                Z.value ? (d(), p("div", Ie, [...L[5] || (L[5] = [
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
                ze(e("img", {
                  src: b.value,
                  alt: ((X = v.value) == null ? void 0 : X.alt) || "Image",
                  style: W(o.value),
                  class: "viewer-image",
                  draggable: "false",
                  onLoad: P,
                  onError: M,
                  onMousedown: G,
                  onMousemove: K,
                  onMouseup: J,
                  onMouseleave: J,
                  onTouchstart: G,
                  onTouchmove: K,
                  onTouchend: J
                }, null, 44, Ae), [
                  [$e, !Z.value]
                ]),
                z.value ? (d(), p("div", je, " Loading full resolution... ")) : U("", !0)
              ]),
              e("div", Oe, [
                e("div", Pe, [
                  e("button", {
                    class: "viewer-btn small",
                    onClick: B,
                    title: "Zoom out (-)"
                  }, [...L[6] || (L[6] = [
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
                    onClick: V,
                    title: "Reset zoom (0)"
                  }, R(Math.round(l.value * 100)) + "% ", 1),
                  e("button", {
                    class: "viewer-btn small",
                    onClick: E,
                    title: "Zoom in (+)"
                  }, [...L[7] || (L[7] = [
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
                  onClick: A,
                  title: "Download"
                }, [...L[8] || (L[8] = [
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
              w.value && c.images.length <= 20 ? (d(), p("div", Re, [
                (d(!0), p(te, null, ce(c.images, (N, F) => (d(), p("button", {
                  key: F,
                  class: Y(["thumbnail", { active: F === k.value }]),
                  onClick: (se) => x(F)
                }, [
                  e("img", {
                    src: N.thumbnail || N.url,
                    alt: `Thumbnail ${F + 1}`
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
}), re = (c, S) => {
  const a = c.__vccOpts || c;
  for (const [i, u] of S)
    a[i] = u;
  return a;
}, He = /* @__PURE__ */ re(Ze, [["__scopeId", "data-v-1fa5ee85"]]), pa = /* @__PURE__ */ le({
  __name: "ImageViewerProvider",
  setup(c) {
    const { isOpen: S, images: a, initialIndex: i, _setOpen: u } = Ce(), k = O(() => [...a.value]);
    function l() {
      u(!1);
    }
    return (j, I) => (d(), ne(He, {
      images: k.value,
      "initial-index": h(i),
      open: h(S),
      onClose: l
    }, null, 8, ["images", "initial-index", "open"]));
  }
}), ve = _({});
function fa(c) {
  ve.value = { ...ve.value, ...c };
}
function Ve(c) {
  const S = _(!1), a = _(0), i = _(null), u = _(null), k = _(null), l = O(() => ({
    uploadUrl: "/api/v1/upload",
    profile: "avatar",
    maxFileSize: 10 * 1024 * 1024,
    // 10MB
    acceptedTypes: ["image/jpeg", "image/png", "image/webp", "image/heic", "image/heif"],
    ...ve.value,
    ...c
  }));
  function j(z) {
    var $;
    return ($ = l.value.acceptedTypes) != null && $.some((s) => z.type === s || z.type.startsWith(s.replace("/*", "/"))) ? l.value.maxFileSize && z.size > l.value.maxFileSize ? {
      message: `File too large. Maximum size is ${Math.round(l.value.maxFileSize / 1048576)}MB.`,
      code: "FILE_TOO_LARGE"
    } : null : {
      message: "Invalid file type. Please select a JPEG, PNG, WebP, or HEIC image.",
      code: "INVALID_TYPE"
    };
  }
  function I(z) {
    const $ = j(z);
    return $ ? (i.value = $, $) : (u.value && URL.revokeObjectURL(u.value), k.value = z, u.value = URL.createObjectURL(z), i.value = null, null);
  }
  function D() {
    u.value && URL.revokeObjectURL(u.value), k.value = null, u.value = null, i.value = null, a.value = 0;
  }
  async function T() {
    if (!k.value)
      return i.value = { message: "No file selected", code: "NO_FILE" }, null;
    S.value = !0, a.value = 0, i.value = null;
    try {
      const z = new FormData();
      z.append("file", k.value), z.append("profile", l.value.profile || "avatar"), l.value.projectId && z.append("project_id", l.value.projectId);
      const $ = {};
      l.value.apiKey && ($.Authorization = `Bearer ${l.value.apiKey}`), l.value.headers && Object.assign($, l.value.headers);
      const s = await new Promise((v, b) => {
        const w = new XMLHttpRequest();
        w.upload.addEventListener("progress", (y) => {
          y.lengthComputable && (a.value = Math.round(y.loaded / y.total * 100));
        }), w.addEventListener("load", () => {
          if (w.status >= 200 && w.status < 300)
            try {
              const y = JSON.parse(w.responseText), r = y.data || y;
              v({
                id: r.id,
                url: r.url || r.signed_url,
                variants: r.variants || {}
              });
            } catch {
              b({ message: "Invalid response from server", code: "PARSE_ERROR" });
            }
          else {
            let y = "Upload failed";
            try {
              const r = JSON.parse(w.responseText);
              y = r.error || r.message || y;
            } catch {
            }
            b({ message: y, code: `HTTP_${w.status}` });
          }
        }), w.addEventListener("error", () => {
          b({ message: "Network error during upload", code: "NETWORK_ERROR" });
        }), w.addEventListener("abort", () => {
          b({ message: "Upload cancelled", code: "ABORTED" });
        }), w.open("POST", l.value.uploadUrl);
        for (const [y, r] of Object.entries($))
          w.setRequestHeader(y, r);
        w.send(z);
      });
      return a.value = 100, s;
    } catch (z) {
      return i.value = z, null;
    } finally {
      S.value = !1;
    }
  }
  async function H(z) {
    return I(z) ? null : T();
  }
  async function Z(z) {
    if (!k.value)
      return i.value = { message: "No file selected", code: "NO_FILE" }, null;
    S.value = !0, a.value = 0, i.value = null;
    try {
      const $ = new FormData();
      $.append("file", k.value), $.append("profile", l.value.profile || "avatar"), $.append("crop_x", String(z.x)), $.append("crop_y", String(z.y)), $.append("crop_width", String(z.width)), $.append("crop_height", String(z.height)), z.zoom !== void 0 && $.append("crop_zoom", String(z.zoom)), l.value.projectId && $.append("project_id", l.value.projectId);
      const s = {};
      l.value.apiKey && (s.Authorization = `Bearer ${l.value.apiKey}`), l.value.headers && Object.assign(s, l.value.headers);
      const v = await new Promise((b, w) => {
        const y = new XMLHttpRequest();
        y.upload.addEventListener("progress", (r) => {
          r.lengthComputable && (a.value = Math.round(r.loaded / r.total * 100));
        }), y.addEventListener("load", () => {
          if (y.status >= 200 && y.status < 300)
            try {
              const r = JSON.parse(y.responseText), f = r.data || r;
              b({
                id: f.id,
                url: f.url || f.signed_url,
                variants: f.variants || {}
              });
            } catch {
              w({ message: "Invalid response from server", code: "PARSE_ERROR" });
            }
          else {
            let r = "Upload failed";
            try {
              const f = JSON.parse(y.responseText);
              r = f.error || f.message || r;
            } catch {
            }
            w({ message: r, code: `HTTP_${y.status}` });
          }
        }), y.addEventListener("error", () => {
          w({ message: "Network error during upload", code: "NETWORK_ERROR" });
        }), y.addEventListener("abort", () => {
          w({ message: "Upload cancelled", code: "ABORTED" });
        }), y.open("POST", l.value.uploadUrl);
        for (const [r, f] of Object.entries(s))
          y.setRequestHeader(r, f);
        y.send($);
      });
      return a.value = 100, v;
    } catch ($) {
      return i.value = $, null;
    } finally {
      S.value = !1;
    }
  }
  return {
    // State
    uploading: S,
    progress: a,
    error: i,
    previewUrl: u,
    selectedFile: k,
    config: l,
    // Methods
    validateFile: j,
    selectFile: I,
    clearSelection: D,
    upload: T,
    selectAndUpload: H,
    uploadWithCrop: Z
  };
}
const ue = {
  shape: "circle",
  cropSize: 280,
  outputSize: 512,
  maxZoom: 5,
  format: "image/jpeg",
  quality: 0.92
};
function Ye(c) {
  const S = O(() => ({ ...ue, ...c })), a = _({
    image: null,
    naturalWidth: 0,
    naturalHeight: 0,
    panX: 0,
    panY: 0,
    zoom: 1,
    minZoom: 1,
    maxZoom: ue.maxZoom
  }), i = _(!1), u = _(null), k = _(null), l = _(null);
  async function j(r) {
    i.value = !0, u.value = null, k.value = r, l.value && URL.revokeObjectURL(l.value);
    try {
      const f = URL.createObjectURL(r);
      l.value = f;
      const m = await D(f);
      a.value.image = m, a.value.naturalWidth = m.naturalWidth, a.value.naturalHeight = m.naturalHeight;
      const { cropSize: g } = S.value, x = g / m.naturalWidth, E = g / m.naturalHeight, B = Math.max(x, E);
      return a.value.minZoom = B, a.value.maxZoom = B * S.value.maxZoom, a.value.zoom = B, T(), i.value = !1, !0;
    } catch {
      return u.value = "Failed to load image", i.value = !1, !1;
    }
  }
  async function I(r) {
    i.value = !0, u.value = null, k.value = null, l.value = r;
    try {
      const f = await D(r);
      a.value.image = f, a.value.naturalWidth = f.naturalWidth, a.value.naturalHeight = f.naturalHeight;
      const { cropSize: m } = S.value, g = m / f.naturalWidth, x = m / f.naturalHeight, E = Math.max(g, x);
      return a.value.minZoom = E, a.value.maxZoom = E * S.value.maxZoom, a.value.zoom = E, T(), i.value = !1, !0;
    } catch {
      return u.value = "Failed to load image", i.value = !1, !1;
    }
  }
  function D(r) {
    return new Promise((f, m) => {
      const g = new Image();
      g.crossOrigin = "anonymous", g.onload = () => f(g), g.onerror = () => m(new Error("Failed to load image")), g.src = r;
    });
  }
  function T() {
    const { cropSize: r } = S.value, { naturalWidth: f, naturalHeight: m, zoom: g } = a.value, x = f * g, E = m * g;
    a.value.panX = (x - r) / 2 / g, a.value.panY = (E - r) / 2 / g;
  }
  function H(r) {
    const { minZoom: f, maxZoom: m } = a.value, g = Math.max(f, Math.min(m, r)), x = a.value.zoom, { cropSize: E } = S.value, B = a.value.panX + E / (2 * x), V = a.value.panY + E / (2 * x);
    a.value.zoom = g, a.value.panX = B - E / (2 * g), a.value.panY = V - E / (2 * g), z();
  }
  function Z(r, f) {
    const { zoom: m } = a.value;
    a.value.panX -= r / m, a.value.panY -= f / m, z();
  }
  function z() {
    const { cropSize: r } = S.value, { naturalWidth: f, naturalHeight: m, zoom: g } = a.value, x = r / g, E = r / g, B = f - x, V = m - E;
    a.value.panX = Math.max(0, Math.min(B, a.value.panX)), a.value.panY = Math.max(0, Math.min(V, a.value.panY));
  }
  const $ = O(() => {
    if (!a.value.image) return null;
    const { cropSize: r } = S.value, { panX: f, panY: m, zoom: g } = a.value, x = r / g, E = r / g;
    return {
      x: Math.round(f),
      y: Math.round(m),
      width: Math.round(x),
      height: Math.round(E),
      zoom: g
    };
  }), s = O(() => {
    const { zoom: r, panX: f, panY: m } = a.value, g = -f * r, x = -m * r;
    return `translate(${g}px, ${x}px) scale(${r})`;
  });
  async function v() {
    if (!a.value.image || !$.value) return null;
    const { outputSize: r, format: f, quality: m } = S.value, g = $.value, x = document.createElement("canvas");
    x.width = r, x.height = r;
    const E = x.getContext("2d");
    return E ? (E.drawImage(
      a.value.image,
      g.x,
      g.y,
      g.width,
      g.height,
      0,
      0,
      r,
      r
    ), new Promise((B) => {
      x.toBlob(
        (V) => B(V),
        f,
        m
      );
    })) : null;
  }
  async function b(r) {
    const f = await v();
    if (!f) return null;
    const { format: m } = S.value, g = m.split("/")[1], x = r || `avatar-cropped.${g}`;
    return new File([f], x, { type: m });
  }
  function w() {
    l.value && k.value && URL.revokeObjectURL(l.value), a.value = {
      image: null,
      naturalWidth: 0,
      naturalHeight: 0,
      panX: 0,
      panY: 0,
      zoom: 1,
      minZoom: 1,
      maxZoom: ue.maxZoom
    }, k.value = null, l.value = null, u.value = null;
  }
  function y() {
    if (!a.value.image) return;
    const { cropSize: r } = S.value, f = r / a.value.naturalWidth, m = r / a.value.naturalHeight, g = Math.max(f, m);
    a.value.zoom = g, T();
  }
  return {
    // State
    state: a,
    loading: i,
    error: u,
    sourceFile: k,
    sourceUrl: l,
    cropRegion: $,
    imageTransform: s,
    config: S,
    // Methods
    loadFile: j,
    loadUrl: I,
    setZoom: H,
    pan: Z,
    centerImage: T,
    reset: y,
    exportCrop: v,
    exportCropAsFile: b,
    cleanup: w
  };
}
const Ne = { class: "avatar-cropper flex flex-col items-center gap-6" }, Xe = { class: "relative" }, We = { class: "text-sm" }, qe = ["src"], Je = {
  key: 0,
  class: "absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 hover:opacity-100 transition-opacity pointer-events-none"
}, Ge = {
  key: 0,
  class: "w-full max-w-xs space-y-2"
}, Ke = { class: "flex items-center gap-3" }, Qe = ["disabled"], et = { class: "flex-1 relative" }, tt = ["value"], at = ["disabled"], lt = { class: "w-12 text-right text-sm text-dark-400 tabular-nums" }, ot = { class: "flex items-center gap-3" }, nt = ["disabled"], rt = /* @__PURE__ */ le({
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
  setup(c, { emit: S }) {
    const a = c, i = S, {
      state: u,
      loading: k,
      error: l,
      sourceUrl: j,
      cropRegion: I,
      imageTransform: D,
      config: T,
      loadFile: H,
      loadUrl: Z,
      setZoom: z,
      pan: $,
      reset: s,
      exportCropAsFile: v,
      cleanup: b
    } = Ye({
      shape: a.shape,
      cropSize: a.cropSize,
      outputSize: a.outputSize,
      ...a.config
    }), w = _(null), y = _(!1), r = _({ x: 0, y: 0 });
    Q(() => a.file, async (t) => {
      t && await H(t);
    }, { immediate: !0 }), Q(() => a.url, async (t) => {
      t && !a.file && await Z(t);
    }, { immediate: !0 }), Q(I, (t) => {
      t && i("crop-change", t);
    });
    const f = O(() => u.value.minZoom ? Math.round(u.value.zoom / u.value.minZoom * 100) : 100), m = O({
      get: () => {
        const { zoom: t, minZoom: o, maxZoom: n } = u.value;
        return n === o ? 0 : (t - o) / (n - o);
      },
      set: (t) => {
        const { minZoom: o, maxZoom: n } = u.value, L = o + t * (n - o);
        z(L);
      }
    }), g = O(() => {
      switch (a.shape) {
        case "circle":
          return "rounded-full";
        case "rounded":
          return "rounded-3xl";
        default:
          return "";
      }
    });
    function x(t) {
      if (k.value) return;
      y.value = !0, r.value = { x: t.clientX, y: t.clientY }, t.target.setPointerCapture(t.pointerId);
    }
    function E(t) {
      if (!y.value) return;
      const o = t.clientX - r.value.x, n = t.clientY - r.value.y;
      $(o, n), r.value = { x: t.clientX, y: t.clientY };
    }
    function B(t) {
      y.value = !1, t.target.releasePointerCapture(t.pointerId);
    }
    function V(t) {
      t.preventDefault();
      const o = t.deltaY > 0 ? -0.1 : 0.1, { zoom: n, minZoom: L, maxZoom: X } = u.value, N = X - L, F = n + o * N * 0.3;
      z(F);
    }
    let q = 0;
    function G(t) {
      t.touches.length === 2 && (q = J(t.touches));
    }
    function K(t) {
      if (t.touches.length === 2) {
        t.preventDefault();
        const o = J(t.touches), n = o / q;
        z(u.value.zoom * n), q = o;
      }
    }
    function J(t) {
      const o = t[0].clientX - t[1].clientX, n = t[0].clientY - t[1].clientY;
      return Math.sqrt(o * o + n * n);
    }
    async function C() {
      if (!I.value) return;
      const t = await v();
      t && i("confirm", { file: t, crop: I.value });
    }
    function A() {
      b(), i("cancel");
    }
    function P() {
      s();
    }
    function M(t) {
      t.key === "Escape" ? A() : t.key === "Enter" && C();
    }
    return fe(() => {
      document.addEventListener("keydown", M);
    }), me(() => {
      document.removeEventListener("keydown", M), b();
    }), (t, o) => (d(), p("div", Ne, [
      e("div", Xe, [
        h(k) ? (d(), p("div", {
          key: 0,
          class: Y(["flex items-center justify-center bg-dark-800", g.value]),
          style: W({ width: `${c.cropSize}px`, height: `${c.cropSize}px` })
        }, [...o[3] || (o[3] = [
          e("div", { class: "w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" }, null, -1)
        ])], 6)) : h(l) ? (d(), p("div", {
          key: 1,
          class: Y(["flex flex-col items-center justify-center gap-2 bg-dark-800 text-red-400", g.value]),
          style: W({ width: `${c.cropSize}px`, height: `${c.cropSize}px` })
        }, [
          o[4] || (o[4] = e("svg", {
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
          e("span", We, R(h(l)), 1)
        ], 6)) : h(u).image ? (d(), p("div", {
          key: 2,
          ref_key: "cropAreaRef",
          ref: w,
          class: Y(["relative overflow-hidden bg-dark-900 select-none touch-none", g.value]),
          style: W({
            width: `${c.cropSize}px`,
            height: `${c.cropSize}px`,
            cursor: y.value ? "grabbing" : "grab"
          }),
          onPointerdown: x,
          onPointermove: E,
          onPointerup: B,
          onPointercancel: B,
          onWheel: V,
          onTouchstart: G,
          onTouchmove: K
        }, [
          e("img", {
            src: h(j) || "",
            alt: "Crop preview",
            class: "absolute top-0 left-0 origin-top-left pointer-events-none",
            style: W({ transform: h(D) }),
            draggable: "false"
          }, null, 12, qe),
          o[6] || (o[6] = Me('<div class="absolute inset-0 pointer-events-none opacity-0 hover:opacity-100 transition-opacity" data-v-4c04fc7e><div class="absolute inset-0 border border-white/20" data-v-4c04fc7e></div><div class="absolute left-1/3 top-0 bottom-0 w-px bg-white/10" data-v-4c04fc7e></div><div class="absolute right-1/3 top-0 bottom-0 w-px bg-white/10" data-v-4c04fc7e></div><div class="absolute top-1/3 left-0 right-0 h-px bg-white/10" data-v-4c04fc7e></div><div class="absolute bottom-1/3 left-0 right-0 h-px bg-white/10" data-v-4c04fc7e></div><div class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6" data-v-4c04fc7e><div class="absolute left-1/2 top-0 bottom-0 w-px bg-white/30 -translate-x-1/2" data-v-4c04fc7e></div><div class="absolute top-1/2 left-0 right-0 h-px bg-white/30 -translate-y-1/2" data-v-4c04fc7e></div></div></div>', 1)),
          y.value ? U("", !0) : (d(), p("div", Je, [...o[5] || (o[5] = [
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
              de(" Drag to reposition ")
            ], -1)
          ])]))
        ], 38)) : (d(), p("div", {
          key: 3,
          class: Y(["flex items-center justify-center bg-dark-800 text-dark-500", g.value]),
          style: W({ width: `${c.cropSize}px`, height: `${c.cropSize}px` })
        }, [...o[7] || (o[7] = [
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
        a.shape !== "circle" && h(u).image ? (d(), p("div", {
          key: 4,
          class: Y(["absolute inset-0 pointer-events-none border-2 border-white/20", g.value])
        }, null, 2)) : U("", !0)
      ]),
      c.showZoomSlider && h(u).image ? (d(), p("div", Ge, [
        e("div", Ke, [
          e("button", {
            type: "button",
            class: "p-1.5 text-dark-400 hover:text-white rounded-lg hover:bg-dark-700 transition-colors",
            onClick: o[0] || (o[0] = (n) => h(z)(h(u).zoom - (h(u).maxZoom - h(u).minZoom) * 0.1)),
            disabled: h(u).zoom <= h(u).minZoom
          }, [...o[8] || (o[8] = [
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
          ])], 8, Qe),
          e("div", et, [
            e("input", {
              type: "range",
              value: m.value,
              min: "0",
              max: "1",
              step: "0.01",
              class: "zoom-slider w-full h-2 bg-dark-700 rounded-full appearance-none cursor-pointer",
              onInput: o[1] || (o[1] = (n) => m.value = parseFloat(n.target.value))
            }, null, 40, tt)
          ]),
          e("button", {
            type: "button",
            class: "p-1.5 text-dark-400 hover:text-white rounded-lg hover:bg-dark-700 transition-colors",
            onClick: o[2] || (o[2] = (n) => h(z)(h(u).zoom + (h(u).maxZoom - h(u).minZoom) * 0.1)),
            disabled: h(u).zoom >= h(u).maxZoom
          }, [...o[9] || (o[9] = [
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
          ])], 8, at),
          e("span", lt, R(f.value) + "% ", 1)
        ])
      ])) : U("", !0),
      e("div", ot, [
        c.showReset && h(u).image ? (d(), p("button", {
          key: 0,
          type: "button",
          class: "px-4 py-2 text-sm text-dark-400 hover:text-white rounded-lg hover:bg-dark-700 transition-colors",
          onClick: P
        }, " Reset ")) : U("", !0),
        e("button", {
          type: "button",
          class: "px-4 py-2 text-sm text-dark-300 bg-dark-700 hover:bg-dark-600 rounded-lg transition-colors",
          onClick: A
        }, R(c.cancelLabel), 1),
        e("button", {
          type: "button",
          class: "px-6 py-2 text-sm font-medium text-white bg-primary-600 hover:bg-primary-500 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed",
          disabled: !h(u).image || h(k),
          onClick: C
        }, R(c.confirmLabel), 9, nt)
      ])
    ]));
  }
}), _e = /* @__PURE__ */ re(rt, [["__scopeId", "data-v-4c04fc7e"]]), st = {
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
}, yt = /* @__PURE__ */ le({
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
  setup(c, { emit: S }) {
    const a = c, i = S, {
      uploading: u,
      progress: k,
      error: l,
      previewUrl: j,
      selectedFile: I,
      selectFile: D,
      clearSelection: T,
      upload: H,
      uploadWithCrop: Z
    } = Ve(a.config), z = _(null), $ = _(!1), s = _(!1), v = _(null), b = _(null), w = O(() => j.value || a.modelValue || null), y = O(() => {
      switch (a.shape) {
        case "rounded":
          return "rounded-2xl";
        case "square":
          return "rounded-none";
        default:
          return "rounded-full";
      }
    }), r = O(() => 2 * Math.PI * 45), f = O(() => r.value - k.value / 100 * r.value);
    Q(k, (C) => {
      i("upload-progress", C);
    }), Q(l, (C) => {
      C && i("upload-error", C);
    });
    function m() {
      var C;
      !a.editable || u.value || (C = z.value) == null || C.click();
    }
    function g(C) {
      var M;
      const A = C.target, P = (M = A.files) == null ? void 0 : M[0];
      P && x(P), A.value = "";
    }
    function x(C) {
      if (!["image/jpeg", "image/png", "image/webp", "image/heic", "image/heif"].some((P) => C.type === P)) {
        i("upload-error", {
          message: "Invalid file type. Please select a JPEG, PNG, WebP, or HEIC image.",
          code: "INVALID_TYPE"
        });
        return;
      }
      if (i("file-selected", C), a.enableCrop)
        v.value = C, s.value = !0;
      else {
        if (D(C))
          return;
        E();
      }
    }
    async function E() {
      var A, P, M, t;
      if (!I.value) return;
      i("upload-start", I.value);
      const C = await H();
      if (C) {
        i("upload-success", C);
        const o = ((P = (A = C.variants) == null ? void 0 : A.lg) == null ? void 0 : P.url) || ((t = (M = C.variants) == null ? void 0 : M.md) == null ? void 0 : t.url) || C.url;
        i("update:modelValue", o), T();
      }
    }
    async function B(C) {
      var M, t, o, n;
      if (s.value = !1, v.value = null, b.value = C.crop, i("crop-applied", C), D(C.file))
        return;
      i("upload-start", C.file);
      const P = await Z(C.crop);
      if (P) {
        i("upload-success", { ...P, crop: C.crop });
        const L = ((t = (M = P.variants) == null ? void 0 : M.lg) == null ? void 0 : t.url) || ((n = (o = P.variants) == null ? void 0 : o.md) == null ? void 0 : n.url) || P.url;
        i("update:modelValue", L), T();
      }
    }
    function V() {
      s.value = !1, v.value = null;
    }
    function q(C) {
      C.preventDefault(), a.editable && !u.value && ($.value = !0);
    }
    function G(C) {
      C.preventDefault(), $.value = !1;
    }
    function K(C) {
      C.preventDefault();
    }
    function J(C) {
      var P;
      if (C.preventDefault(), $.value = !1, !a.editable || u.value) return;
      const A = (P = C.dataTransfer) == null ? void 0 : P.files[0];
      A && A.type.startsWith("image/") && x(A);
    }
    return me(() => {
      T();
    }), (C, A) => (d(), p("div", null, [
      (d(), ne(he, { to: "body" }, [
        ae(ge, { name: "fade" }, {
          default: ye(() => [
            s.value && v.value ? (d(), p("div", st, [
              e("div", {
                class: "absolute inset-0 bg-black/80 backdrop-blur-sm",
                onClick: V
              }),
              e("div", it, [
                A[0] || (A[0] = e("h3", { class: "text-lg font-semibold text-white mb-4 text-center" }, " Adjust your photo ", -1)),
                ae(_e, {
                  file: v.value,
                  shape: c.shape,
                  "crop-size": c.cropSize,
                  "output-size": c.cropOutputSize,
                  "confirm-label": "Save",
                  onConfirm: B,
                  onCancel: V
                }, null, 8, ["file", "shape", "crop-size", "output-size"])
              ])
            ])) : U("", !0)
          ]),
          _: 1
        })
      ])),
      e("div", {
        class: Y(["avatar-upload-container relative inline-block", c.containerClass]),
        style: W({ width: `${c.size}px`, height: `${c.size}px` })
      }, [
        e("input", {
          ref_key: "fileInput",
          ref: z,
          type: "file",
          accept: "image/jpeg,image/png,image/webp,image/heic,image/heif",
          class: "hidden",
          onChange: g
        }, null, 544),
        e("div", {
          class: Y(["avatar-upload relative w-full h-full overflow-hidden transition-all duration-200", [
            y.value,
            c.editable && !h(u) ? "cursor-pointer hover:ring-4 hover:ring-primary-500/30" : "",
            $.value ? "ring-4 ring-primary-500 scale-105" : "",
            h(l) ? "ring-2 ring-red-500" : ""
          ]]),
          onClick: m,
          onDragenter: q,
          onDragleave: G,
          onDragover: K,
          onDrop: J
        }, [
          w.value ? (d(), p("img", {
            key: 0,
            src: w.value,
            alt: "Avatar",
            class: "w-full h-full object-cover"
          }, null, 8, ut)) : (d(), p("div", ct, [
            c.placeholder ? (d(), p("span", {
              key: 0,
              class: "text-white font-semibold",
              style: W({ fontSize: `${c.size / 3}px` })
            }, R(c.placeholder), 5)) : (d(), p("svg", {
              key: 1,
              class: "text-slate-400",
              width: c.size / 2.5,
              height: c.size / 2.5,
              fill: "currentColor",
              viewBox: "0 0 24 24"
            }, [...A[1] || (A[1] = [
              e("path", { d: "M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" }, null, -1)
            ])], 8, dt))
          ])),
          c.editable && !h(u) ? (d(), p("div", vt, [...A[2] || (A[2] = [
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
          h(u) ? (d(), p("div", pt, [
            c.showProgress ? (d(), p("svg", ft, [
              A[3] || (A[3] = e("circle", {
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
                "stroke-dasharray": r.value,
                "stroke-dashoffset": f.value
              }, null, 8, mt)
            ])) : U("", !0),
            e("span", ht, R(h(k)) + "%", 1)
          ])) : U("", !0)
        ], 34),
        h(l) && !h(u) ? (d(), p("div", gt, R(h(l).message), 1)) : U("", !0)
      ], 6)
    ]));
  }
}), ma = /* @__PURE__ */ re(yt, [["__scopeId", "data-v-36262731"]]), pe = _({});
function ha(c) {
  pe.value = { ...pe.value, ...c };
}
function kt(c) {
  const S = _([]), a = _(!1), i = _(null), u = _(!1), k = _(0), l = O(() => ({
    apiBaseUrl: "/api",
    getHeaders: () => ({}),
    ...pe.value,
    ...c
  })), j = O(() => S.value.find((s) => s.is_primary));
  async function I() {
    a.value = !0, i.value = null;
    try {
      let s = `${l.value.apiBaseUrl}/avatars`;
      const v = new URLSearchParams();
      l.value.projectId && v.set("project_id", l.value.projectId), l.value.entityType && v.set("entity_type", l.value.entityType), l.value.entityId && v.set("entity_id", l.value.entityId), v.toString() && (s += `?${v.toString()}`);
      const b = await fetch(s, {
        headers: l.value.getHeaders()
      });
      if (!b.ok)
        throw new Error(await b.text());
      const w = await b.json();
      S.value = w.avatars || [];
    } catch (s) {
      i.value = s.message || "Failed to fetch avatars";
    } finally {
      a.value = !1;
    }
  }
  async function D(s) {
    i.value = null;
    try {
      const v = await fetch(`${l.value.apiBaseUrl}/avatars`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...l.value.getHeaders()
        },
        body: JSON.stringify({
          original_url: s.original_url,
          file_id: s.file_id,
          name: s.name,
          is_primary: s.is_primary ?? !1,
          source: "upload",
          format: "static",
          variants: s.variants,
          blurhash: s.blurhash,
          dominant_color: s.dominant_color,
          alt_text: s.alt_text,
          fallback_type: s.fallback_initials ? "initials" : "default",
          fallback_data: s.fallback_initials ? { initials: s.fallback_initials } : void 0
        })
      });
      if (!v.ok)
        throw new Error(await v.text());
      const b = await v.json();
      return await I(), b;
    } catch (v) {
      return i.value = v.message || "Failed to create avatar", null;
    }
  }
  async function T(s) {
    i.value = null;
    try {
      const v = await fetch(`${l.value.apiBaseUrl}/avatars/${s}/primary`, {
        method: "POST",
        headers: l.value.getHeaders()
      });
      if (!v.ok)
        throw new Error(await v.text());
      return S.value = S.value.map((b) => ({
        ...b,
        is_primary: b.id === s
      })), !0;
    } catch (v) {
      return i.value = v.message || "Failed to set primary avatar", !1;
    }
  }
  async function H(s) {
    i.value = null;
    try {
      const v = await fetch(`${l.value.apiBaseUrl}/avatars/${s}`, {
        method: "DELETE",
        headers: l.value.getHeaders()
      });
      if (!v.ok)
        throw new Error(await v.text());
      return S.value = S.value.filter((b) => b.id !== s), !0;
    } catch (v) {
      return i.value = v.message || "Failed to delete avatar", !1;
    }
  }
  async function Z(s, v) {
    i.value = null;
    try {
      const b = await fetch(`${l.value.apiBaseUrl}/avatars/${s}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...l.value.getHeaders()
        },
        body: JSON.stringify(v)
      });
      if (!b.ok)
        throw new Error(await b.text());
      const w = await b.json();
      return S.value = S.value.map(
        (y) => y.id === s ? w : y
      ), w;
    } catch (b) {
      return i.value = b.message || "Failed to update avatar", null;
    }
  }
  async function z(s, v) {
    if (!l.value.uploadUrl)
      return i.value = "Upload URL not configured", null;
    u.value = !0, k.value = 0, i.value = null;
    try {
      const b = new FormData();
      b.append("file", s), b.append("profile", "avatar");
      const w = await new Promise((r, f) => {
        const m = new XMLHttpRequest();
        m.upload.addEventListener("progress", (x) => {
          x.lengthComputable && (k.value = Math.round(x.loaded / x.total * 100));
        }), m.addEventListener("load", () => {
          if (m.status >= 200 && m.status < 300)
            try {
              const x = JSON.parse(m.responseText);
              r(x.data || x);
            } catch {
              f(new Error("Invalid response from server"));
            }
          else {
            let x = "Upload failed";
            try {
              const E = JSON.parse(m.responseText);
              x = E.error || E.message || x;
            } catch {
            }
            f(new Error(x));
          }
        }), m.addEventListener("error", () => f(new Error("Network error"))), m.addEventListener("abort", () => f(new Error("Upload cancelled"))), m.open("POST", l.value.uploadUrl);
        const g = l.value.getHeaders();
        for (const [x, E] of Object.entries(g))
          m.setRequestHeader(x, E);
        m.send(b);
      });
      return k.value = 100, await D({
        original_url: w.url || w.signed_url,
        file_id: w.id,
        name: v == null ? void 0 : v.name,
        is_primary: v == null ? void 0 : v.is_primary,
        variants: w.variants,
        fallback_initials: v == null ? void 0 : v.fallback_initials
      });
    } catch (b) {
      return i.value = b.message || "Failed to upload avatar", null;
    } finally {
      u.value = !1;
    }
  }
  function $(s, v = "md") {
    var w, y, r, f, m, g, x;
    if (v === "original")
      return s.original_url;
    if (v === "source")
      return ((w = s.variants.source) == null ? void 0 : w.url) || s.original_url;
    const b = s.variants[v];
    return b ? b.url : v === "sm" ? ((y = s.variants.md) == null ? void 0 : y.url) || ((r = s.variants.lg) == null ? void 0 : r.url) || s.original_url : v === "md" ? ((f = s.variants.lg) == null ? void 0 : f.url) || ((m = s.variants.sm) == null ? void 0 : m.url) || s.original_url : v === "lg" && (((g = s.variants.md) == null ? void 0 : g.url) || ((x = s.variants.sm) == null ? void 0 : x.url)) || s.original_url;
  }
  return {
    // State
    avatars: S,
    loading: a,
    error: i,
    uploading: u,
    uploadProgress: k,
    primaryAvatar: j,
    config: l,
    // Methods
    fetchAvatars: I,
    createAvatar: D,
    setPrimary: T,
    deleteAvatar: H,
    updateAvatar: Z,
    uploadAndCreateAvatar: z,
    getAvatarUrl: $
  };
}
const wt = { class: "avatar-manager" }, bt = {
  key: 0,
  class: "fixed inset-0 z-50 flex items-center justify-center p-4"
}, xt = { class: "relative bg-dark-900 rounded-2xl p-6 shadow-2xl border border-dark-700 max-w-md w-full" }, Ct = { class: "text-lg font-semibold text-white mb-4 text-center" }, _t = {
  key: 0,
  class: "flex items-center justify-center py-8"
}, zt = {
  key: 1,
  class: "text-center py-8"
}, $t = { class: "text-red-400 mb-2" }, Mt = {
  key: 2,
  class: "space-y-3"
}, St = { class: "flex flex-wrap gap-3" }, Lt = ["onClick"], Et = ["src", "alt"], Ut = {
  key: 0,
  class: "absolute -top-1 -right-1 w-5 h-5 bg-yellow-500 rounded-full flex items-center justify-center shadow-lg",
  title: "Pending moderation"
}, It = ["onClick"], At = ["onClick"], jt = ["onClick", "title"], Ot = ["disabled"], Pt = {
  key: 0,
  class: "relative w-full h-full flex items-center justify-center"
}, Rt = {
  class: "absolute inset-2 w-auto h-auto",
  viewBox: "0 0 36 36"
}, Dt = ["stroke-dasharray"], Bt = { class: "text-xs font-medium text-dark-300" }, Tt = {
  key: 1,
  class: "text-dark-500 hover:text-primary-400 transition-colors"
}, Ft = { class: "text-xs text-dark-500" }, Zt = { key: 0 }, Ht = { key: 1 }, Vt = {
  key: 0,
  class: "text-sm text-red-400"
}, Yt = {
  key: 3,
  class: "space-y-3"
}, Nt = { class: "space-y-2" }, Xt = ["onClick"], Wt = ["src", "alt"], qt = { class: "flex-1 min-w-0" }, Jt = { class: "flex items-center gap-2" }, Gt = { class: "font-medium text-white truncate" }, Kt = {
  key: 0,
  class: "px-2 py-0.5 text-xs font-medium bg-emerald-500/20 text-emerald-400 rounded-full"
}, Qt = {
  key: 1,
  class: "px-2 py-0.5 text-xs font-medium bg-yellow-500/20 text-yellow-400 rounded-full"
}, ea = { class: "flex items-center gap-3 mt-1 text-xs text-dark-400" }, ta = { key: 0 }, aa = {
  key: 1,
  class: "text-purple-400"
}, la = { class: "flex items-center gap-2" }, oa = ["onClick"], na = ["onClick"], ra = ["onClick", "title"], sa = ["disabled"], ia = { class: "text-dark-400" }, ua = { class: "flex items-center justify-between text-xs text-dark-500" }, ca = {
  key: 0,
  class: "text-red-400"
}, da = /* @__PURE__ */ le({
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
  setup(c, { emit: S }) {
    const a = c, i = S, {
      avatars: u,
      loading: k,
      error: l,
      uploading: j,
      uploadProgress: I,
      fetchAvatars: D,
      setPrimary: T,
      deleteAvatar: H,
      uploadAndCreateAvatar: Z,
      getAvatarUrl: z
    } = kt(a.config), $ = _(null), s = _(null), v = _(null), b = _(!1), w = _("upload"), y = _(null), r = _(null), f = O(() => a.allowUpload && u.value.length < a.maxAvatars), m = O(() => {
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
    }), g = O(() => r.value ? r.value.original_url : null);
    fe(() => {
      D();
    });
    function x() {
      var M;
      (M = $.value) == null || M.click();
    }
    async function E(M) {
      var n;
      const t = M.target, o = (n = t.files) == null ? void 0 : n[0];
      if (o)
        if (t.value = "", a.enableCropOnUpload)
          y.value = o, w.value = "upload", b.value = !0;
        else {
          const L = await Z(o, {
            name: `Avatar ${u.value.length + 1}`,
            is_primary: u.value.length === 0,
            fallback_initials: a.initials
          });
          L ? i("upload-success", L) : l.value && i("upload-error", l.value);
        }
    }
    function B(M) {
      r.value = M, w.value = "edit", b.value = !0;
    }
    async function V(M) {
      if (b.value = !1, w.value === "upload" && y.value) {
        const t = await Z(M.file, {
          name: `Avatar ${u.value.length + 1}`,
          is_primary: u.value.length === 0,
          fallback_initials: a.initials,
          crop: M.crop
        });
        t ? i("upload-success", t) : l.value && i("upload-error", l.value);
      } else if (w.value === "edit" && r.value) {
        const t = await Z(M.file, {
          name: r.value.name,
          is_primary: r.value.is_primary,
          fallback_initials: a.initials,
          crop: M.crop
        });
        t ? (await H(r.value.id), i("crop-updated", t, M.crop)) : l.value && i("upload-error", l.value);
      }
      y.value = null, r.value = null;
    }
    function q() {
      b.value = !1, y.value = null, r.value = null;
    }
    async function G(M) {
      if (M.is_primary) return;
      await T(M.id) && i("primary-changed", M);
    }
    async function K(M) {
      if (s.value !== M.id) {
        s.value = M.id;
        return;
      }
      await H(M.id) && (i("delete", M), s.value = null);
    }
    function J() {
      s.value = null;
    }
    function C(M) {
      v.value = M.id, i("select", M);
    }
    function A(M) {
      const t = new Date(M);
      return t.toLocaleDateString(void 0, {
        month: "short",
        day: "numeric",
        year: t.getFullYear() !== (/* @__PURE__ */ new Date()).getFullYear() ? "numeric" : void 0
      });
    }
    function P(M) {
      return {
        upload: "Uploaded",
        gravatar: "Gravatar",
        oauth: "OAuth",
        generated: "Generated",
        ai: "AI Generated"
      }[M] || M;
    }
    return (M, t) => (d(), p("div", wt, [
      e("input", {
        ref_key: "fileInputRef",
        ref: $,
        type: "file",
        accept: "image/*",
        class: "hidden",
        onChange: E
      }, null, 544),
      (d(), ne(he, { to: "body" }, [
        ae(ge, { name: "fade" }, {
          default: ye(() => [
            b.value && (y.value || r.value) ? (d(), p("div", bt, [
              e("div", {
                class: "absolute inset-0 bg-black/80 backdrop-blur-sm",
                onClick: q
              }),
              e("div", xt, [
                e("h3", Ct, R(w.value === "edit" ? "Adjust your photo" : "Position your photo"), 1),
                ae(_e, {
                  file: y.value,
                  url: g.value,
                  shape: c.shape,
                  "crop-size": c.cropSize,
                  "confirm-label": w.value === "edit" ? "Save changes" : "Upload",
                  onConfirm: V,
                  onCancel: q
                }, null, 8, ["file", "url", "shape", "crop-size", "confirm-label"])
              ])
            ])) : U("", !0)
          ]),
          _: 1
        })
      ])),
      h(k) && h(u).length === 0 ? (d(), p("div", _t, [...t[1] || (t[1] = [
        e("div", { class: "w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" }, null, -1)
      ])])) : h(l) && h(u).length === 0 ? (d(), p("div", zt, [
        e("div", $t, R(h(l)), 1),
        e("button", {
          onClick: t[0] || (t[0] = //@ts-ignore
          (...o) => h(D) && h(D)(...o)),
          class: "text-sm text-primary-400 hover:text-primary-300 underline"
        }, " Try again ")
      ])) : c.mode === "compact" ? (d(), p("div", Mt, [
        e("div", St, [
          (d(!0), p(te, null, ce(h(u), (o) => (d(), p("div", {
            key: o.id,
            class: "relative group",
            style: W({ width: `${c.avatarSize}px`, height: `${c.avatarSize}px` })
          }, [
            e("button", {
              onClick: (n) => C(o),
              class: Y(["w-full h-full overflow-hidden transition-all duration-200", [
                m.value,
                o.is_primary ? "ring-[3px] ring-emerald-500 ring-offset-2 ring-offset-dark-900" : v.value === o.id ? "ring-2 ring-dark-400 ring-offset-2 ring-offset-dark-900" : "ring-2 ring-transparent hover:ring-dark-500 ring-offset-2 ring-offset-dark-900"
              ]])
            }, [
              e("img", {
                src: h(z)(o, "md"),
                alt: o.alt_text || o.name || "Avatar",
                class: "w-full h-full object-cover",
                style: W(o.dominant_color ? { backgroundColor: o.dominant_color } : {})
              }, null, 12, Et)
            ], 10, Lt),
            o.moderation_status === "pending" ? (d(), p("div", Ut, [...t[2] || (t[2] = [
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
                m.value,
                s.value === o.id ? "z-50 opacity-100" : "z-10"
              ]])
            }, [
              c.allowEdit ? (d(), p("button", {
                key: 0,
                type: "button",
                onClick: ee((n) => B(o), ["stop"]),
                class: "p-1.5 bg-dark-700 hover:bg-primary-600 rounded-lg transition-colors",
                title: "Edit crop"
              }, [...t[3] || (t[3] = [
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
              ])], 8, It)) : U("", !0),
              o.is_primary ? U("", !0) : (d(), p("button", {
                key: 1,
                type: "button",
                onClick: ee((n) => G(o), ["stop"]),
                class: "p-1.5 bg-dark-700 hover:bg-emerald-600 rounded-lg transition-colors",
                title: "Set as primary"
              }, [...t[4] || (t[4] = [
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
              ])], 8, At)),
              c.allowDelete ? (d(), p("button", {
                key: 2,
                type: "button",
                onClick: ee((n) => K(o), ["stop"]),
                class: Y(["p-1.5 rounded-lg transition-colors", s.value === o.id ? "bg-red-600 hover:bg-red-700" : "bg-dark-700 hover:bg-red-600"]),
                title: s.value === o.id ? "Click again to confirm" : "Delete"
              }, [...t[5] || (t[5] = [
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
              ])], 10, jt)) : U("", !0)
            ], 2)
          ], 4))), 128)),
          f.value ? (d(), p("button", {
            key: 0,
            type: "button",
            onClick: x,
            disabled: h(j),
            class: Y(["flex items-center justify-center border-2 border-dashed border-dark-600 hover:border-primary-500 transition-colors", m.value]),
            style: W({ width: `${c.avatarSize}px`, height: `${c.avatarSize}px` })
          }, [
            h(j) ? (d(), p("div", Pt, [
              (d(), p("svg", Rt, [
                t[6] || (t[6] = e("path", {
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
                  "stroke-dasharray": `${h(I)}, 100`,
                  d: "M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                }, null, 8, Dt)
              ])),
              e("span", Bt, R(h(I)) + "%", 1)
            ])) : (d(), p("div", Tt, [...t[7] || (t[7] = [
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
          ], 14, Ot)) : U("", !0)
        ]),
        e("p", Ft, [
          h(u).length === 0 ? (d(), p("span", Zt, "Upload your first avatar")) : (d(), p("span", Ht, [
            de(R(h(u).length) + "/" + R(c.maxAvatars) + " · ", 1),
            t[8] || (t[8] = e("span", { class: "text-emerald-500" }, "Green ring", -1)),
            t[9] || (t[9] = de(" = primary · Hover for options ", -1))
          ]))
        ]),
        h(l) ? (d(), p("div", Vt, R(h(l)), 1)) : U("", !0)
      ])) : (d(), p("div", Yt, [
        e("div", Nt, [
          (d(!0), p(te, null, ce(h(u), (o) => (d(), p("div", {
            key: o.id,
            class: Y(["flex items-center gap-4 p-3 rounded-xl transition-colors", [
              o.is_primary ? "bg-emerald-500/10 border border-emerald-500/30" : "bg-dark-800 border border-dark-700 hover:border-dark-600"
            ]])
          }, [
            e("button", {
              onClick: (n) => C(o),
              class: Y(["flex-shrink-0 w-14 h-14 overflow-hidden transition-transform hover:scale-105", m.value])
            }, [
              e("img", {
                src: h(z)(o, "sm"),
                alt: o.alt_text || o.name || "Avatar",
                class: "w-full h-full object-cover"
              }, null, 8, Wt)
            ], 10, Xt),
            e("div", qt, [
              e("div", Jt, [
                e("span", Gt, R(o.name || "Unnamed avatar"), 1),
                o.is_primary ? (d(), p("span", Kt, " Primary ")) : U("", !0),
                o.moderation_status === "pending" ? (d(), p("span", Qt, " Pending ")) : U("", !0)
              ]),
              e("div", ea, [
                e("span", null, R(P(o.source)), 1),
                t[10] || (t[10] = e("span", null, "·", -1)),
                e("span", null, R(A(o.created_at)), 1),
                o.format === "animated" ? (d(), p("span", ta, "·")) : U("", !0),
                o.format === "animated" ? (d(), p("span", aa, "Animated")) : U("", !0)
              ])
            ]),
            e("div", la, [
              c.allowEdit ? (d(), p("button", {
                key: 0,
                type: "button",
                onClick: (n) => B(o),
                class: "p-2 text-dark-400 hover:text-primary-400 hover:bg-dark-700 rounded-lg transition-colors",
                title: "Edit crop"
              }, [...t[11] || (t[11] = [
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
              ])], 8, oa)) : U("", !0),
              o.is_primary ? U("", !0) : (d(), p("button", {
                key: 1,
                type: "button",
                onClick: (n) => G(o),
                class: "p-2 text-dark-400 hover:text-emerald-400 hover:bg-dark-700 rounded-lg transition-colors",
                title: "Set as primary"
              }, [...t[12] || (t[12] = [
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
              ])], 8, na)),
              c.allowDelete ? (d(), p("button", {
                key: 2,
                type: "button",
                onClick: (n) => K(o),
                class: Y(["p-2 rounded-lg transition-colors", s.value === o.id ? "text-white bg-red-600 hover:bg-red-700" : "text-dark-400 hover:text-red-400 hover:bg-dark-700"]),
                title: s.value === o.id ? "Click again to confirm" : "Delete"
              }, [...t[13] || (t[13] = [
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
              ])], 10, ra)) : U("", !0)
            ])
          ], 2))), 128))
        ]),
        f.value ? (d(), p("button", {
          key: 0,
          type: "button",
          onClick: x,
          disabled: h(j),
          class: "w-full flex items-center justify-center gap-3 p-4 border-2 border-dashed border-dark-600 hover:border-primary-500 rounded-xl transition-colors group"
        }, [
          h(j) ? (d(), p(te, { key: 0 }, [
            t[14] || (t[14] = e("div", { class: "w-5 h-5 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" }, null, -1)),
            e("span", ia, "Uploading... " + R(h(I)) + "%", 1)
          ], 64)) : (d(), p(te, { key: 1 }, [
            t[15] || (t[15] = e("svg", {
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
            t[16] || (t[16] = e("span", { class: "text-dark-500 group-hover:text-primary-400 transition-colors" }, " Add new avatar ", -1))
          ], 64))
        ], 8, sa)) : U("", !0),
        e("div", ua, [
          e("span", null, R(h(u).length) + " of " + R(c.maxAvatars) + " avatars", 1),
          h(l) ? (d(), p("span", ca, R(h(l)), 1)) : U("", !0)
        ])
      ])),
      s.value ? (d(), p("div", {
        key: 4,
        class: "fixed inset-0 z-40",
        onClick: J
      })) : U("", !0)
    ]));
  }
}), ga = /* @__PURE__ */ re(da, [["__scopeId", "data-v-9c73c40c"]]);
export {
  _e as AvatarCropper,
  ga as AvatarManager,
  ma as AvatarUpload,
  He as ImageViewer,
  pa as ImageViewerProvider,
  ha as configureAvatarManager,
  fa as configureAvatarUpload,
  Ye as useAvatarCropper,
  kt as useAvatarManager,
  Ve as useAvatarUpload,
  Ce as useImageViewer
};
//# sourceMappingURL=index.js.map
