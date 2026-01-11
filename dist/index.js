import { ref as _, readonly as ie, defineComponent as oe, computed as F, watch as Q, onMounted as fe, onUnmounted as me, createBlock as le, openBlock as d, Teleport as he, createVNode as ae, Transition as ge, withCtx as ye, createElementBlock as p, createCommentVNode as I, withModifiers as ee, createElementVNode as e, toDisplayString as R, withDirectives as ze, normalizeStyle as q, vShow as $e, Fragment as te, renderList as ce, normalizeClass as X, unref as h, createStaticVNode as Me, createTextVNode as de } from "vue";
const ne = _(!1), ke = _([]), we = _(0);
let xe = null;
function Ce() {
  function c(k) {
    xe = k;
  }
  function L() {
    return xe;
  }
  function a(k, o = 0) {
    ke.value = k, we.value = o, ne.value = !0;
  }
  function i() {
    ne.value = !1;
  }
  function u(k, o) {
    a([{ url: k, alt: o }], 0);
  }
  return {
    // State (readonly to prevent external mutation)
    isOpen: ie(ne),
    images: ie(ke),
    initialIndex: ie(we),
    // Actions
    openViewer: a,
    closeViewer: i,
    openImage: u,
    setVariantFetcher: c,
    getVariantFetcher: L,
    // For the provider component
    _setOpen: (k) => {
      ne.value = k;
    }
  };
}
const Se = { class: "viewer-toolbar top" }, Le = {
  key: 0,
  class: "image-counter"
}, Ee = { class: "image-container" }, Ie = {
  key: 0,
  class: "loading-spinner"
}, Ue = {
  key: 1,
  class: "error-state"
}, Ae = ["src", "alt"], Oe = {
  key: 2,
  class: "loading-variants"
}, je = { class: "viewer-toolbar bottom" }, Fe = { class: "zoom-controls" }, Pe = {
  key: 2,
  class: "thumbnail-strip"
}, Re = ["onClick"], De = ["src", "alt"], Be = 0.5, Te = 5, be = 0.25, Ze = /* @__PURE__ */ oe({
  __name: "ImageViewer",
  props: {
    images: {},
    initialIndex: { default: 0 },
    open: { type: Boolean }
  },
  emits: ["close", "indexChange"],
  setup(c, { emit: L }) {
    const a = c, i = L, { getVariantFetcher: u } = Ce(), k = _(a.initialIndex), o = _(1), O = _(0), U = _(0), D = _(!1), H = _({ x: 0, y: 0 }), B = _(!0), Z = _(!1), $ = _(!1), M = _(/* @__PURE__ */ new Map()), r = F(() => a.images[k.value]), v = F(() => {
      const l = r.value;
      if (!l) return null;
      if (l.fileId && M.value.has(l.fileId)) {
        const S = M.value.get(l.fileId);
        return { ...l, variants: S };
      }
      return l;
    }), w = F(() => {
      var S, W, N, T, se;
      const l = v.value;
      if (!l) return "";
      if (l.variants) {
        if ((S = l.variants.lg) != null && S.url) return l.variants.lg.url;
        if ((W = l.variants.original) != null && W.url) return l.variants.original.url;
        if ((N = l.variants.md) != null && N.url) return l.variants.md.url;
        if ((T = l.variants.sm) != null && T.url) return l.variants.sm.url;
        if ((se = l.variants.thumb) != null && se.url) return l.variants.thumb.url;
      }
      return l.url;
    }), x = F(() => a.images.length > 1), g = F(() => k.value > 0), y = F(() => k.value < a.images.length - 1);
    Q(k, () => {
      o.value = 1, O.value = 0, U.value = 0, B.value = !0, Z.value = !1, i("indexChange", k.value);
    }), Q(() => a.open, (l) => {
      l ? (k.value = a.initialIndex, o.value = 1, O.value = 0, U.value = 0, B.value = !0, Z.value = !1, document.body.style.overflow = "hidden", s()) : document.body.style.overflow = "";
    }), Q(r, () => {
      s();
    });
    async function s() {
      var W, N;
      const l = r.value;
      if (!(l != null && l.fileId) || M.value.has(l.fileId) || (W = l.variants) != null && W.lg || (N = l.variants) != null && N.original) return;
      const S = u();
      if (S) {
        $.value = !0;
        try {
          const T = await S(l.fileId);
          T && M.value.set(l.fileId, T);
        } catch (T) {
          console.error("Failed to fetch variants:", T);
        } finally {
          $.value = !1;
        }
      }
    }
    function f() {
      g.value && k.value--;
    }
    function C() {
      y.value && k.value++;
    }
    function m(l) {
      l >= 0 && l < a.images.length && (k.value = l);
    }
    function E() {
      o.value = Math.min(Te, o.value + be);
    }
    function j() {
      o.value = Math.max(Be, o.value - be), o.value <= 1 && (O.value = 0, U.value = 0);
    }
    function V() {
      o.value = 1, O.value = 0, U.value = 0;
    }
    function Y(l) {
      l.preventDefault(), l.deltaY < 0 ? E() : j();
    }
    function G(l) {
      if (o.value <= 1) return;
      D.value = !0;
      const S = "touches" in l ? l.touches[0] : l;
      H.value = { x: S.clientX - O.value, y: S.clientY - U.value };
    }
    function K(l) {
      if (!D.value) return;
      l.preventDefault();
      const S = "touches" in l ? l.touches[0] : l;
      O.value = S.clientX - H.value.x, U.value = S.clientY - H.value.y;
    }
    function J() {
      D.value = !1;
    }
    function b(l) {
      if (a.open)
        switch (l.key) {
          case "Escape":
            i("close");
            break;
          case "ArrowLeft":
            f();
            break;
          case "ArrowRight":
            C();
            break;
          case "+":
          case "=":
            E();
            break;
          case "-":
            j();
            break;
          case "0":
            V();
            break;
        }
    }
    async function A() {
      if (v.value)
        try {
          const l = w.value, W = await (await fetch(l)).blob(), N = URL.createObjectURL(W), T = document.createElement("a");
          T.href = N, T.download = v.value.alt || `image-${k.value + 1}`, document.body.appendChild(T), T.click(), document.body.removeChild(T), URL.revokeObjectURL(N);
        } catch (l) {
          console.error("Failed to download image:", l);
        }
    }
    function P() {
      B.value = !1;
    }
    function z() {
      B.value = !1, Z.value = !0;
    }
    function t(l) {
      l.target.classList.contains("viewer-backdrop") && i("close");
    }
    fe(() => {
      window.addEventListener("keydown", b);
    }), me(() => {
      window.removeEventListener("keydown", b), document.body.style.overflow = "";
    });
    const n = F(() => ({
      transform: `scale(${o.value}) translate(${O.value / o.value}px, ${U.value / o.value}px)`,
      cursor: o.value > 1 ? D.value ? "grabbing" : "grab" : "default"
    }));
    return (l, S) => (d(), le(he, { to: "body" }, [
      ae(ge, { name: "viewer" }, {
        default: ye(() => {
          var W;
          return [
            c.open ? (d(), p("div", {
              key: 0,
              class: "viewer-backdrop",
              onClick: t,
              onWheel: ee(Y, ["prevent"])
            }, [
              e("button", {
                class: "viewer-btn close-btn",
                onClick: S[0] || (S[0] = (N) => i("close")),
                title: "Close (Esc)"
              }, [...S[1] || (S[1] = [
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
                x.value ? (d(), p("span", Le, R(k.value + 1) + " / " + R(c.images.length), 1)) : I("", !0)
              ]),
              x.value && g.value ? (d(), p("button", {
                key: 0,
                class: "viewer-btn nav-btn prev",
                onClick: ee(f, ["stop"]),
                title: "Previous (←)"
              }, [...S[2] || (S[2] = [
                e("svg", {
                  viewBox: "0 0 24 24",
                  fill: "none",
                  stroke: "currentColor",
                  "stroke-width": "2"
                }, [
                  e("path", { d: "M15 18l-6-6 6-6" })
                ], -1)
              ])])) : I("", !0),
              x.value && y.value ? (d(), p("button", {
                key: 1,
                class: "viewer-btn nav-btn next",
                onClick: ee(C, ["stop"]),
                title: "Next (→)"
              }, [...S[3] || (S[3] = [
                e("svg", {
                  viewBox: "0 0 24 24",
                  fill: "none",
                  stroke: "currentColor",
                  "stroke-width": "2"
                }, [
                  e("path", { d: "M9 18l6-6-6-6" })
                ], -1)
              ])])) : I("", !0),
              e("div", Ee, [
                B.value ? (d(), p("div", Ie, [...S[4] || (S[4] = [
                  e("div", { class: "spinner" }, null, -1)
                ])])) : I("", !0),
                Z.value ? (d(), p("div", Ue, [...S[5] || (S[5] = [
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
                ])])) : I("", !0),
                ze(e("img", {
                  src: w.value,
                  alt: ((W = v.value) == null ? void 0 : W.alt) || "Image",
                  style: q(n.value),
                  class: "viewer-image",
                  draggable: "false",
                  onLoad: P,
                  onError: z,
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
                $.value ? (d(), p("div", Oe, " Loading full resolution... ")) : I("", !0)
              ]),
              e("div", je, [
                e("div", Fe, [
                  e("button", {
                    class: "viewer-btn small",
                    onClick: j,
                    title: "Zoom out (-)"
                  }, [...S[6] || (S[6] = [
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
                  }, R(Math.round(o.value * 100)) + "% ", 1),
                  e("button", {
                    class: "viewer-btn small",
                    onClick: E,
                    title: "Zoom in (+)"
                  }, [...S[7] || (S[7] = [
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
                }, [...S[8] || (S[8] = [
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
              x.value && c.images.length <= 20 ? (d(), p("div", Pe, [
                (d(!0), p(te, null, ce(c.images, (N, T) => (d(), p("button", {
                  key: T,
                  class: X(["thumbnail", { active: T === k.value }]),
                  onClick: (se) => m(T)
                }, [
                  e("img", {
                    src: N.thumbnail || N.url,
                    alt: `Thumbnail ${T + 1}`
                  }, null, 8, De)
                ], 10, Re))), 128))
              ])) : I("", !0)
            ], 32)) : I("", !0)
          ];
        }),
        _: 1
      })
    ]));
  }
}), re = (c, L) => {
  const a = c.__vccOpts || c;
  for (const [i, u] of L)
    a[i] = u;
  return a;
}, He = /* @__PURE__ */ re(Ze, [["__scopeId", "data-v-1fa5ee85"]]), pa = /* @__PURE__ */ oe({
  __name: "ImageViewerProvider",
  setup(c) {
    const { isOpen: L, images: a, initialIndex: i, _setOpen: u } = Ce(), k = F(() => [...a.value]);
    function o() {
      u(!1);
    }
    return (O, U) => (d(), le(He, {
      images: k.value,
      "initial-index": h(i),
      open: h(L),
      onClose: o
    }, null, 8, ["images", "initial-index", "open"]));
  }
}), ve = _({});
function fa(c) {
  ve.value = { ...ve.value, ...c };
}
function Ye(c) {
  const L = _(!1), a = _(0), i = _(null), u = _(null), k = _(null), o = F(() => ({
    uploadUrl: "/api/v1/upload",
    profile: "avatar",
    maxFileSize: 10 * 1024 * 1024,
    // 10MB
    acceptedTypes: ["image/jpeg", "image/png", "image/webp", "image/heic", "image/heif"],
    ...ve.value,
    ...c
  }));
  function O($) {
    var M;
    return (M = o.value.acceptedTypes) != null && M.some((r) => $.type === r || $.type.startsWith(r.replace("/*", "/"))) ? o.value.maxFileSize && $.size > o.value.maxFileSize ? {
      message: `File too large. Maximum size is ${Math.round(o.value.maxFileSize / 1048576)}MB.`,
      code: "FILE_TOO_LARGE"
    } : null : {
      message: "Invalid file type. Please select a JPEG, PNG, WebP, or HEIC image.",
      code: "INVALID_TYPE"
    };
  }
  function U($) {
    const M = O($);
    return M ? (i.value = M, M) : (u.value && URL.revokeObjectURL(u.value), k.value = $, u.value = URL.createObjectURL($), i.value = null, null);
  }
  function D() {
    u.value && URL.revokeObjectURL(u.value), k.value = null, u.value = null, i.value = null, a.value = 0;
  }
  async function H() {
    if (!k.value)
      return i.value = { message: "No file selected", code: "NO_FILE" }, null;
    L.value = !0, a.value = 0, i.value = null;
    try {
      const $ = new FormData();
      $.append("file", k.value), $.append("profile", o.value.profile || "avatar"), o.value.projectId && $.append("project_id", o.value.projectId);
      const M = {};
      o.value.apiKey && (M.Authorization = `Bearer ${o.value.apiKey}`), o.value.headers && Object.assign(M, o.value.headers);
      const r = await new Promise((v, w) => {
        const x = new XMLHttpRequest();
        x.upload.addEventListener("progress", (g) => {
          g.lengthComputable && (a.value = Math.round(g.loaded / g.total * 100));
        }), x.addEventListener("load", () => {
          if (x.status >= 200 && x.status < 300)
            try {
              const g = JSON.parse(x.responseText), y = g.data || g;
              v({
                id: y.id,
                url: y.url || y.signed_url,
                variants: y.variants || {}
              });
            } catch {
              w({ message: "Invalid response from server", code: "PARSE_ERROR" });
            }
          else {
            let g = "Upload failed";
            try {
              const y = JSON.parse(x.responseText);
              g = y.error || y.message || g;
            } catch {
            }
            w({ message: g, code: `HTTP_${x.status}` });
          }
        }), x.addEventListener("error", () => {
          w({ message: "Network error during upload", code: "NETWORK_ERROR" });
        }), x.addEventListener("abort", () => {
          w({ message: "Upload cancelled", code: "ABORTED" });
        }), x.open("POST", o.value.uploadUrl);
        for (const [g, y] of Object.entries(M))
          x.setRequestHeader(g, y);
        x.send($);
      });
      return a.value = 100, r;
    } catch ($) {
      return i.value = $, null;
    } finally {
      L.value = !1;
    }
  }
  async function B($) {
    return U($) ? null : H();
  }
  async function Z($) {
    if (!k.value)
      return i.value = { message: "No file selected", code: "NO_FILE" }, null;
    L.value = !0, a.value = 0, i.value = null;
    try {
      const M = new FormData();
      M.append("file", k.value), M.append("profile", o.value.profile || "avatar"), M.append("crop_x", String($.x)), M.append("crop_y", String($.y)), M.append("crop_width", String($.width)), M.append("crop_height", String($.height)), $.zoom !== void 0 && M.append("crop_zoom", String($.zoom)), o.value.projectId && M.append("project_id", o.value.projectId);
      const r = {};
      o.value.apiKey && (r.Authorization = `Bearer ${o.value.apiKey}`), o.value.headers && Object.assign(r, o.value.headers);
      const v = await new Promise((w, x) => {
        const g = new XMLHttpRequest();
        g.upload.addEventListener("progress", (y) => {
          y.lengthComputable && (a.value = Math.round(y.loaded / y.total * 100));
        }), g.addEventListener("load", () => {
          if (g.status >= 200 && g.status < 300)
            try {
              const y = JSON.parse(g.responseText), s = y.data || y;
              w({
                id: s.id,
                url: s.url || s.signed_url,
                variants: s.variants || {}
              });
            } catch {
              x({ message: "Invalid response from server", code: "PARSE_ERROR" });
            }
          else {
            let y = "Upload failed";
            try {
              const s = JSON.parse(g.responseText);
              y = s.error || s.message || y;
            } catch {
            }
            x({ message: y, code: `HTTP_${g.status}` });
          }
        }), g.addEventListener("error", () => {
          x({ message: "Network error during upload", code: "NETWORK_ERROR" });
        }), g.addEventListener("abort", () => {
          x({ message: "Upload cancelled", code: "ABORTED" });
        }), g.open("POST", o.value.uploadUrl);
        for (const [y, s] of Object.entries(r))
          g.setRequestHeader(y, s);
        g.send(M);
      });
      return a.value = 100, v;
    } catch (M) {
      return i.value = M, null;
    } finally {
      L.value = !1;
    }
  }
  return {
    // State
    uploading: L,
    progress: a,
    error: i,
    previewUrl: u,
    selectedFile: k,
    config: o,
    // Methods
    validateFile: O,
    selectFile: U,
    clearSelection: D,
    upload: H,
    selectAndUpload: B,
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
function Ve(c) {
  const L = F(() => ({ ...ue, ...c })), a = _({
    image: null,
    naturalWidth: 0,
    naturalHeight: 0,
    panX: 0,
    panY: 0,
    zoom: 1,
    minZoom: 1,
    maxZoom: ue.maxZoom
  }), i = _(!1), u = _(null), k = _(null), o = _(null);
  function O(s) {
    a.value.image = s, a.value.naturalWidth = s.naturalWidth, a.value.naturalHeight = s.naturalHeight;
    const { cropSize: f } = L.value, C = f / s.naturalWidth, m = f / s.naturalHeight, E = Math.max(C, m);
    console.log("[Cropper] Image initialized:", {
      naturalWidth: s.naturalWidth,
      naturalHeight: s.naturalHeight,
      cropSize: f,
      scaleX: C.toFixed(4),
      scaleY: m.toFixed(4),
      minZoom: E.toFixed(4)
    }), a.value.minZoom = E, a.value.maxZoom = E * L.value.maxZoom, a.value.zoom = E, B(), console.log("[Cropper] After centering:", {
      panX: a.value.panX.toFixed(2),
      panY: a.value.panY.toFixed(2),
      zoom: a.value.zoom.toFixed(4)
    });
  }
  async function U(s) {
    i.value = !0, u.value = null, k.value = s, o.value && URL.revokeObjectURL(o.value);
    try {
      const f = URL.createObjectURL(s);
      o.value = f;
      const C = await H(f);
      return O(C), i.value = !1, !0;
    } catch {
      return u.value = "Failed to load image", i.value = !1, !1;
    }
  }
  async function D(s) {
    i.value = !0, u.value = null, k.value = null, o.value = s;
    try {
      const f = await H(s);
      return O(f), i.value = !1, !0;
    } catch {
      return u.value = "Failed to load image", i.value = !1, !1;
    }
  }
  function H(s) {
    return new Promise((f, C) => {
      const m = new Image();
      m.crossOrigin = "anonymous", m.onload = () => f(m), m.onerror = () => C(new Error("Failed to load image")), m.src = s;
    });
  }
  function B() {
    const { cropSize: s } = L.value, { naturalWidth: f, naturalHeight: C, zoom: m } = a.value, E = s / m, j = s / m;
    a.value.panX = (f - E) / 2, a.value.panY = (C - j) / 2;
  }
  function Z(s) {
    const { minZoom: f, maxZoom: C } = a.value, m = Math.max(f, Math.min(C, s)), E = a.value.zoom, { cropSize: j } = L.value, V = a.value.panX + j / (2 * E), Y = a.value.panY + j / (2 * E);
    a.value.zoom = m, a.value.panX = V - j / (2 * m), a.value.panY = Y - j / (2 * m), M();
  }
  function $(s, f) {
    const { zoom: C } = a.value;
    a.value.panX -= s / C, a.value.panY -= f / C, M();
  }
  function M() {
    const { cropSize: s } = L.value, { naturalWidth: f, naturalHeight: C, zoom: m } = a.value, E = s / m, j = s / m, V = f - E, Y = C - j;
    a.value.panX = Math.max(0, Math.min(V, a.value.panX)), a.value.panY = Math.max(0, Math.min(Y, a.value.panY));
  }
  const r = F(() => {
    if (!a.value.image) return null;
    const { cropSize: s } = L.value, { panX: f, panY: C, zoom: m } = a.value, E = s / m, j = s / m;
    return {
      x: Math.round(f),
      y: Math.round(C),
      width: Math.round(E),
      height: Math.round(j),
      zoom: m
    };
  }), v = F(() => {
    const { zoom: s, panX: f, panY: C } = a.value, m = -f * s, E = -C * s;
    return Math.random() < 0.01 && console.log("[Cropper] Transform:", {
      panX: f.toFixed(2),
      panY: C.toFixed(2),
      zoom: s.toFixed(4),
      translateX: m.toFixed(2),
      translateY: E.toFixed(2)
    }), `translate(${m}px, ${E}px) scale(${s})`;
  });
  async function w() {
    if (!a.value.image || !r.value) return null;
    const { outputSize: s, format: f, quality: C } = L.value, m = r.value, E = document.createElement("canvas");
    E.width = s, E.height = s;
    const j = E.getContext("2d");
    return j ? (j.drawImage(
      a.value.image,
      m.x,
      m.y,
      m.width,
      m.height,
      0,
      0,
      s,
      s
    ), new Promise((V) => {
      E.toBlob(
        (Y) => V(Y),
        f,
        C
      );
    })) : null;
  }
  async function x(s) {
    const f = await w();
    if (!f) return null;
    const { format: C } = L.value, m = C.split("/")[1], E = s || `avatar-cropped.${m}`;
    return new File([f], E, { type: C });
  }
  function g() {
    o.value && k.value && URL.revokeObjectURL(o.value), a.value = {
      image: null,
      naturalWidth: 0,
      naturalHeight: 0,
      panX: 0,
      panY: 0,
      zoom: 1,
      minZoom: 1,
      maxZoom: ue.maxZoom
    }, k.value = null, o.value = null, u.value = null;
  }
  function y() {
    if (!a.value.image) return;
    const { cropSize: s } = L.value, f = s / a.value.naturalWidth, C = s / a.value.naturalHeight, m = Math.max(f, C);
    a.value.zoom = m, B();
  }
  return {
    // State
    state: a,
    loading: i,
    error: u,
    sourceFile: k,
    sourceUrl: o,
    cropRegion: r,
    imageTransform: v,
    config: L,
    // Methods
    loadFile: U,
    loadUrl: D,
    setZoom: Z,
    pan: $,
    centerImage: B,
    reset: y,
    exportCrop: w,
    exportCropAsFile: x,
    cleanup: g
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
  setup(c, { emit: L }) {
    const a = c, i = L, {
      state: u,
      loading: k,
      error: o,
      sourceUrl: O,
      cropRegion: U,
      imageTransform: D,
      config: H,
      loadFile: B,
      loadUrl: Z,
      setZoom: $,
      pan: M,
      reset: r,
      exportCropAsFile: v,
      cleanup: w
    } = Ve({
      shape: a.shape,
      cropSize: a.cropSize,
      outputSize: a.outputSize,
      ...a.config
    }), x = _(null), g = _(!1), y = _({ x: 0, y: 0 });
    Q(() => a.file, async (t) => {
      t && await B(t);
    }, { immediate: !0 }), Q(() => a.url, async (t) => {
      t && !a.file && await Z(t);
    }, { immediate: !0 }), Q(U, (t) => {
      t && i("crop-change", t);
    });
    const s = F(() => u.value.minZoom ? Math.round(u.value.zoom / u.value.minZoom * 100) : 100), f = F({
      get: () => {
        const { zoom: t, minZoom: n, maxZoom: l } = u.value;
        return l === n ? 0 : (t - n) / (l - n);
      },
      set: (t) => {
        const { minZoom: n, maxZoom: l } = u.value, S = n + t * (l - n);
        $(S);
      }
    }), C = F(() => {
      switch (a.shape) {
        case "circle":
          return "rounded-full";
        case "rounded":
          return "rounded-3xl";
        default:
          return "";
      }
    });
    function m(t) {
      if (k.value) return;
      g.value = !0, y.value = { x: t.clientX, y: t.clientY }, t.target.setPointerCapture(t.pointerId);
    }
    function E(t) {
      if (!g.value) return;
      const n = t.clientX - y.value.x, l = t.clientY - y.value.y;
      M(n, l), y.value = { x: t.clientX, y: t.clientY };
    }
    function j(t) {
      g.value = !1, t.target.releasePointerCapture(t.pointerId);
    }
    function V(t) {
      t.preventDefault();
      const n = t.deltaY > 0 ? -0.1 : 0.1, { zoom: l, minZoom: S, maxZoom: W } = u.value, N = W - S, T = l + n * N * 0.3;
      $(T);
    }
    let Y = 0;
    function G(t) {
      t.touches.length === 2 && (Y = J(t.touches));
    }
    function K(t) {
      if (t.touches.length === 2) {
        t.preventDefault();
        const n = J(t.touches), l = n / Y;
        $(u.value.zoom * l), Y = n;
      }
    }
    function J(t) {
      const n = t[0].clientX - t[1].clientX, l = t[0].clientY - t[1].clientY;
      return Math.sqrt(n * n + l * l);
    }
    async function b() {
      if (!U.value) return;
      const t = await v();
      t && i("confirm", { file: t, crop: U.value });
    }
    function A() {
      w(), i("cancel");
    }
    function P() {
      r();
    }
    function z(t) {
      t.key === "Escape" ? A() : t.key === "Enter" && b();
    }
    return fe(() => {
      document.addEventListener("keydown", z);
    }), me(() => {
      document.removeEventListener("keydown", z), w();
    }), (t, n) => (d(), p("div", Xe, [
      e("div", Ne, [
        h(k) ? (d(), p("div", {
          key: 0,
          class: X(["flex items-center justify-center bg-dark-800", C.value]),
          style: q({ width: `${c.cropSize}px`, height: `${c.cropSize}px` })
        }, [...n[3] || (n[3] = [
          e("div", { class: "w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" }, null, -1)
        ])], 6)) : h(o) ? (d(), p("div", {
          key: 1,
          class: X(["flex flex-col items-center justify-center gap-2 bg-dark-800 text-red-400", C.value]),
          style: q({ width: `${c.cropSize}px`, height: `${c.cropSize}px` })
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
          e("span", We, R(h(o)), 1)
        ], 6)) : h(u).image ? (d(), p("div", {
          key: 2,
          ref_key: "cropAreaRef",
          ref: x,
          class: X(["relative overflow-hidden bg-dark-900 select-none touch-none", C.value]),
          style: q({
            width: `${c.cropSize}px`,
            height: `${c.cropSize}px`,
            cursor: g.value ? "grabbing" : "grab"
          }),
          onPointerdown: m,
          onPointermove: E,
          onPointerup: j,
          onPointercancel: j,
          onWheel: V,
          onTouchstart: G,
          onTouchmove: K
        }, [
          e("img", {
            src: h(O) || "",
            alt: "Crop preview",
            class: "absolute pointer-events-none",
            style: q({
              top: "0",
              left: "0",
              transformOrigin: "0 0",
              transform: h(D)
            }),
            draggable: "false"
          }, null, 12, qe),
          n[6] || (n[6] = Me('<div class="absolute inset-0 pointer-events-none opacity-0 hover:opacity-100 transition-opacity" data-v-e9681595><div class="absolute inset-0 border border-white/20" data-v-e9681595></div><div class="absolute left-1/3 top-0 bottom-0 w-px bg-white/10" data-v-e9681595></div><div class="absolute right-1/3 top-0 bottom-0 w-px bg-white/10" data-v-e9681595></div><div class="absolute top-1/3 left-0 right-0 h-px bg-white/10" data-v-e9681595></div><div class="absolute bottom-1/3 left-0 right-0 h-px bg-white/10" data-v-e9681595></div><div class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6" data-v-e9681595><div class="absolute left-1/2 top-0 bottom-0 w-px bg-white/30 -translate-x-1/2" data-v-e9681595></div><div class="absolute top-1/2 left-0 right-0 h-px bg-white/30 -translate-y-1/2" data-v-e9681595></div></div></div>', 1)),
          g.value ? I("", !0) : (d(), p("div", Je, [...n[5] || (n[5] = [
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
          class: X(["flex items-center justify-center bg-dark-800 text-dark-500", C.value]),
          style: q({ width: `${c.cropSize}px`, height: `${c.cropSize}px` })
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
        a.shape !== "circle" && h(u).image ? (d(), p("div", {
          key: 4,
          class: X(["absolute inset-0 pointer-events-none border-2 border-white/20", C.value])
        }, null, 2)) : I("", !0)
      ]),
      c.showZoomSlider && h(u).image ? (d(), p("div", Ge, [
        e("div", Ke, [
          e("button", {
            type: "button",
            class: "p-1.5 text-dark-400 hover:text-white rounded-lg hover:bg-dark-700 transition-colors",
            onClick: n[0] || (n[0] = (l) => h($)(h(u).zoom - (h(u).maxZoom - h(u).minZoom) * 0.1)),
            disabled: h(u).zoom <= h(u).minZoom
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
          ])], 8, Qe),
          e("div", et, [
            e("input", {
              type: "range",
              value: f.value,
              min: "0",
              max: "1",
              step: "0.01",
              class: "zoom-slider w-full h-2 bg-dark-700 rounded-full appearance-none cursor-pointer",
              onInput: n[1] || (n[1] = (l) => f.value = parseFloat(l.target.value))
            }, null, 40, tt)
          ]),
          e("button", {
            type: "button",
            class: "p-1.5 text-dark-400 hover:text-white rounded-lg hover:bg-dark-700 transition-colors",
            onClick: n[2] || (n[2] = (l) => h($)(h(u).zoom + (h(u).maxZoom - h(u).minZoom) * 0.1)),
            disabled: h(u).zoom >= h(u).maxZoom
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
          ])], 8, at),
          e("span", ot, R(s.value) + "% ", 1)
        ])
      ])) : I("", !0),
      e("div", nt, [
        c.showReset && h(u).image ? (d(), p("button", {
          key: 0,
          type: "button",
          class: "px-4 py-2 text-sm text-dark-400 hover:text-white rounded-lg hover:bg-dark-700 transition-colors",
          onClick: P
        }, " Reset ")) : I("", !0),
        e("button", {
          type: "button",
          class: "px-4 py-2 text-sm text-dark-300 bg-dark-700 hover:bg-dark-600 rounded-lg transition-colors",
          onClick: A
        }, R(c.cancelLabel), 1),
        e("button", {
          type: "button",
          class: "px-6 py-2 text-sm font-medium text-white bg-primary-600 hover:bg-primary-500 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed",
          disabled: !h(u).image || h(k),
          onClick: b
        }, R(c.confirmLabel), 9, lt)
      ])
    ]));
  }
}), _e = /* @__PURE__ */ re(rt, [["__scopeId", "data-v-e9681595"]]), st = {
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
  setup(c, { emit: L }) {
    const a = c, i = L, {
      uploading: u,
      progress: k,
      error: o,
      previewUrl: O,
      selectedFile: U,
      selectFile: D,
      clearSelection: H,
      upload: B,
      uploadWithCrop: Z
    } = Ye(a.config), $ = _(null), M = _(!1), r = _(!1), v = _(null), w = _(null), x = F(() => O.value || a.modelValue || null), g = F(() => {
      switch (a.shape) {
        case "rounded":
          return "rounded-2xl";
        case "square":
          return "rounded-none";
        default:
          return "rounded-full";
      }
    }), y = F(() => 2 * Math.PI * 45), s = F(() => y.value - k.value / 100 * y.value);
    Q(k, (b) => {
      i("upload-progress", b);
    }), Q(o, (b) => {
      b && i("upload-error", b);
    });
    function f() {
      var b;
      !a.editable || u.value || (b = $.value) == null || b.click();
    }
    function C(b) {
      var z;
      const A = b.target, P = (z = A.files) == null ? void 0 : z[0];
      P && m(P), A.value = "";
    }
    function m(b) {
      if (!["image/jpeg", "image/png", "image/webp", "image/heic", "image/heif"].some((P) => b.type === P)) {
        i("upload-error", {
          message: "Invalid file type. Please select a JPEG, PNG, WebP, or HEIC image.",
          code: "INVALID_TYPE"
        });
        return;
      }
      if (i("file-selected", b), a.enableCrop)
        v.value = b, r.value = !0;
      else {
        if (D(b))
          return;
        E();
      }
    }
    async function E() {
      var A, P, z, t;
      if (!U.value) return;
      i("upload-start", U.value);
      const b = await B();
      if (b) {
        i("upload-success", b);
        const n = ((P = (A = b.variants) == null ? void 0 : A.lg) == null ? void 0 : P.url) || ((t = (z = b.variants) == null ? void 0 : z.md) == null ? void 0 : t.url) || b.url;
        i("update:modelValue", n), H();
      }
    }
    async function j(b) {
      var z, t, n, l;
      if (r.value = !1, v.value = null, w.value = b.crop, i("crop-applied", b), D(b.file))
        return;
      i("upload-start", b.file);
      const P = await Z(b.crop);
      if (P) {
        i("upload-success", { ...P, crop: b.crop });
        const S = ((t = (z = P.variants) == null ? void 0 : z.lg) == null ? void 0 : t.url) || ((l = (n = P.variants) == null ? void 0 : n.md) == null ? void 0 : l.url) || P.url;
        i("update:modelValue", S), H();
      }
    }
    function V() {
      r.value = !1, v.value = null;
    }
    function Y(b) {
      b.preventDefault(), a.editable && !u.value && (M.value = !0);
    }
    function G(b) {
      b.preventDefault(), M.value = !1;
    }
    function K(b) {
      b.preventDefault();
    }
    function J(b) {
      var P;
      if (b.preventDefault(), M.value = !1, !a.editable || u.value) return;
      const A = (P = b.dataTransfer) == null ? void 0 : P.files[0];
      A && A.type.startsWith("image/") && m(A);
    }
    return me(() => {
      H();
    }), (b, A) => (d(), p("div", null, [
      (d(), le(he, { to: "body" }, [
        ae(ge, { name: "fade" }, {
          default: ye(() => [
            r.value && v.value ? (d(), p("div", st, [
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
                  onConfirm: j,
                  onCancel: V
                }, null, 8, ["file", "shape", "crop-size", "output-size"])
              ])
            ])) : I("", !0)
          ]),
          _: 1
        })
      ])),
      e("div", {
        class: X(["avatar-upload-container relative inline-block", c.containerClass]),
        style: q({ width: `${c.size}px`, height: `${c.size}px` })
      }, [
        e("input", {
          ref_key: "fileInput",
          ref: $,
          type: "file",
          accept: "image/jpeg,image/png,image/webp,image/heic,image/heif",
          class: "hidden",
          onChange: C
        }, null, 544),
        e("div", {
          class: X(["avatar-upload relative w-full h-full overflow-hidden transition-all duration-200", [
            g.value,
            c.editable && !h(u) ? "cursor-pointer hover:ring-4 hover:ring-primary-500/30" : "",
            M.value ? "ring-4 ring-primary-500 scale-105" : "",
            h(o) ? "ring-2 ring-red-500" : ""
          ]]),
          onClick: f,
          onDragenter: Y,
          onDragleave: G,
          onDragover: K,
          onDrop: J
        }, [
          x.value ? (d(), p("img", {
            key: 0,
            src: x.value,
            alt: "Avatar",
            class: "w-full h-full object-cover"
          }, null, 8, ut)) : (d(), p("div", ct, [
            c.placeholder ? (d(), p("span", {
              key: 0,
              class: "text-white font-semibold",
              style: q({ fontSize: `${c.size / 3}px` })
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
          ])])) : I("", !0),
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
                "stroke-dasharray": y.value,
                "stroke-dashoffset": s.value
              }, null, 8, mt)
            ])) : I("", !0),
            e("span", ht, R(h(k)) + "%", 1)
          ])) : I("", !0)
        ], 34),
        h(o) && !h(u) ? (d(), p("div", gt, R(h(o).message), 1)) : I("", !0)
      ], 6)
    ]));
  }
}), ma = /* @__PURE__ */ re(yt, [["__scopeId", "data-v-36262731"]]), pe = _({});
function ha(c) {
  pe.value = { ...pe.value, ...c };
}
function kt(c) {
  const L = _([]), a = _(!1), i = _(null), u = _(!1), k = _(0), o = F(() => ({
    apiBaseUrl: "/api",
    getHeaders: () => ({}),
    ...pe.value,
    ...c
  })), O = F(() => L.value.find((r) => r.is_primary));
  async function U() {
    a.value = !0, i.value = null;
    try {
      let r = `${o.value.apiBaseUrl}/avatars`;
      const v = new URLSearchParams();
      o.value.projectId && v.set("project_id", o.value.projectId), o.value.entityType && v.set("entity_type", o.value.entityType), o.value.entityId && v.set("entity_id", o.value.entityId), v.toString() && (r += `?${v.toString()}`);
      const w = await fetch(r, {
        headers: o.value.getHeaders()
      });
      if (!w.ok)
        throw new Error(await w.text());
      const x = await w.json();
      L.value = x.avatars || [];
    } catch (r) {
      i.value = r.message || "Failed to fetch avatars";
    } finally {
      a.value = !1;
    }
  }
  async function D(r) {
    i.value = null;
    try {
      const v = await fetch(`${o.value.apiBaseUrl}/avatars`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...o.value.getHeaders()
        },
        body: JSON.stringify({
          original_url: r.original_url,
          file_id: r.file_id,
          name: r.name,
          is_primary: r.is_primary ?? !1,
          source: "upload",
          format: "static",
          variants: r.variants,
          blurhash: r.blurhash,
          dominant_color: r.dominant_color,
          alt_text: r.alt_text,
          fallback_type: r.fallback_initials ? "initials" : "default",
          fallback_data: r.fallback_initials ? { initials: r.fallback_initials } : void 0
        })
      });
      if (!v.ok)
        throw new Error(await v.text());
      const w = await v.json();
      return await U(), w;
    } catch (v) {
      return i.value = v.message || "Failed to create avatar", null;
    }
  }
  async function H(r) {
    i.value = null;
    try {
      const v = await fetch(`${o.value.apiBaseUrl}/avatars/${r}/primary`, {
        method: "POST",
        headers: o.value.getHeaders()
      });
      if (!v.ok)
        throw new Error(await v.text());
      return L.value = L.value.map((w) => ({
        ...w,
        is_primary: w.id === r
      })), !0;
    } catch (v) {
      return i.value = v.message || "Failed to set primary avatar", !1;
    }
  }
  async function B(r) {
    i.value = null;
    try {
      const v = await fetch(`${o.value.apiBaseUrl}/avatars/${r}`, {
        method: "DELETE",
        headers: o.value.getHeaders()
      });
      if (!v.ok)
        throw new Error(await v.text());
      return L.value = L.value.filter((w) => w.id !== r), !0;
    } catch (v) {
      return i.value = v.message || "Failed to delete avatar", !1;
    }
  }
  async function Z(r, v) {
    i.value = null;
    try {
      const w = await fetch(`${o.value.apiBaseUrl}/avatars/${r}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...o.value.getHeaders()
        },
        body: JSON.stringify(v)
      });
      if (!w.ok)
        throw new Error(await w.text());
      const x = await w.json();
      return L.value = L.value.map(
        (g) => g.id === r ? x : g
      ), x;
    } catch (w) {
      return i.value = w.message || "Failed to update avatar", null;
    }
  }
  async function $(r, v) {
    if (!o.value.uploadUrl)
      return i.value = "Upload URL not configured", null;
    u.value = !0, k.value = 0, i.value = null;
    try {
      const w = new FormData();
      w.append("file", r), w.append("profile", "avatar");
      const x = await new Promise((y, s) => {
        const f = new XMLHttpRequest();
        f.upload.addEventListener("progress", (m) => {
          m.lengthComputable && (k.value = Math.round(m.loaded / m.total * 100));
        }), f.addEventListener("load", () => {
          if (f.status >= 200 && f.status < 300)
            try {
              const m = JSON.parse(f.responseText);
              y(m.data || m);
            } catch {
              s(new Error("Invalid response from server"));
            }
          else {
            let m = "Upload failed";
            try {
              const E = JSON.parse(f.responseText);
              m = E.error || E.message || m;
            } catch {
            }
            s(new Error(m));
          }
        }), f.addEventListener("error", () => s(new Error("Network error"))), f.addEventListener("abort", () => s(new Error("Upload cancelled"))), f.open("POST", o.value.uploadUrl);
        const C = o.value.getHeaders();
        for (const [m, E] of Object.entries(C))
          f.setRequestHeader(m, E);
        f.send(w);
      });
      return k.value = 100, await D({
        original_url: x.url || x.signed_url,
        file_id: x.id,
        name: v == null ? void 0 : v.name,
        is_primary: v == null ? void 0 : v.is_primary,
        variants: x.variants,
        fallback_initials: v == null ? void 0 : v.fallback_initials
      });
    } catch (w) {
      return i.value = w.message || "Failed to upload avatar", null;
    } finally {
      u.value = !1;
    }
  }
  function M(r, v = "md") {
    var x, g, y, s, f, C, m;
    if (v === "original")
      return r.original_url;
    if (v === "source")
      return ((x = r.variants.source) == null ? void 0 : x.url) || r.original_url;
    const w = r.variants[v];
    return w ? w.url : v === "sm" ? ((g = r.variants.md) == null ? void 0 : g.url) || ((y = r.variants.lg) == null ? void 0 : y.url) || r.original_url : v === "md" ? ((s = r.variants.lg) == null ? void 0 : s.url) || ((f = r.variants.sm) == null ? void 0 : f.url) || r.original_url : v === "lg" && (((C = r.variants.md) == null ? void 0 : C.url) || ((m = r.variants.sm) == null ? void 0 : m.url)) || r.original_url;
  }
  return {
    // State
    avatars: L,
    loading: a,
    error: i,
    uploading: u,
    uploadProgress: k,
    primaryAvatar: O,
    config: o,
    // Methods
    fetchAvatars: U,
    createAvatar: D,
    setPrimary: H,
    deleteAvatar: B,
    updateAvatar: Z,
    uploadAndCreateAvatar: $,
    getAvatarUrl: M
  };
}
const wt = { class: "avatar-manager" }, xt = {
  key: 0,
  class: "fixed inset-0 z-50 flex items-center justify-center p-4"
}, bt = { class: "relative bg-dark-900 rounded-2xl p-6 shadow-2xl border border-dark-700 max-w-md w-full" }, Ct = { class: "text-lg font-semibold text-white mb-4 text-center" }, _t = {
  key: 0,
  class: "flex items-center justify-center py-8"
}, zt = {
  key: 1,
  class: "text-center py-8"
}, $t = { class: "text-red-400 mb-2" }, Mt = {
  key: 2,
  class: "space-y-3"
}, St = { class: "flex flex-wrap gap-3" }, Lt = ["onClick"], Et = ["src", "alt"], It = {
  key: 0,
  class: "absolute -top-1 -right-1 w-5 h-5 bg-yellow-500 rounded-full flex items-center justify-center shadow-lg",
  title: "Pending moderation"
}, Ut = ["onClick"], At = ["onClick"], Ot = ["onClick", "title"], jt = ["disabled"], Ft = {
  key: 0,
  class: "relative w-full h-full flex items-center justify-center"
}, Pt = {
  class: "absolute inset-2 w-auto h-auto",
  viewBox: "0 0 36 36"
}, Rt = ["stroke-dasharray"], Dt = { class: "text-xs font-medium text-dark-300" }, Bt = {
  key: 1,
  class: "text-dark-500 hover:text-primary-400 transition-colors"
}, Tt = { class: "text-xs text-dark-500" }, Zt = { key: 0 }, Ht = { key: 1 }, Yt = {
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
  setup(c, { emit: L }) {
    const a = c, i = L, {
      avatars: u,
      loading: k,
      error: o,
      uploading: O,
      uploadProgress: U,
      fetchAvatars: D,
      setPrimary: H,
      deleteAvatar: B,
      uploadAndCreateAvatar: Z,
      getAvatarUrl: $
    } = kt(a.config), M = _(null), r = _(null), v = _(null), w = _(!1), x = _("upload"), g = _(null), y = _(null), s = F(() => a.allowUpload && u.value.length < a.maxAvatars), f = F(() => {
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
    }), C = F(() => y.value ? y.value.original_url : null);
    fe(() => {
      D();
    });
    function m() {
      var z;
      (z = M.value) == null || z.click();
    }
    async function E(z) {
      var l;
      const t = z.target, n = (l = t.files) == null ? void 0 : l[0];
      if (n)
        if (t.value = "", a.enableCropOnUpload)
          g.value = n, x.value = "upload", w.value = !0;
        else {
          const S = await Z(n, {
            name: `Avatar ${u.value.length + 1}`,
            is_primary: u.value.length === 0,
            fallback_initials: a.initials
          });
          S ? i("upload-success", S) : o.value && i("upload-error", o.value);
        }
    }
    function j(z) {
      y.value = z, x.value = "edit", w.value = !0;
    }
    async function V(z) {
      if (w.value = !1, x.value === "upload" && g.value) {
        const t = await Z(z.file, {
          name: `Avatar ${u.value.length + 1}`,
          is_primary: u.value.length === 0,
          fallback_initials: a.initials,
          crop: z.crop
        });
        t ? i("upload-success", t) : o.value && i("upload-error", o.value);
      } else if (x.value === "edit" && y.value) {
        const t = await Z(z.file, {
          name: y.value.name,
          is_primary: y.value.is_primary,
          fallback_initials: a.initials,
          crop: z.crop
        });
        t ? (await B(y.value.id), i("crop-updated", t, z.crop)) : o.value && i("upload-error", o.value);
      }
      g.value = null, y.value = null;
    }
    function Y() {
      w.value = !1, g.value = null, y.value = null;
    }
    async function G(z) {
      if (z.is_primary) return;
      await H(z.id) && i("primary-changed", z);
    }
    async function K(z) {
      if (r.value !== z.id) {
        r.value = z.id;
        return;
      }
      await B(z.id) && (i("delete", z), r.value = null);
    }
    function J() {
      r.value = null;
    }
    function b(z) {
      v.value = z.id, i("select", z);
    }
    function A(z) {
      const t = new Date(z);
      return t.toLocaleDateString(void 0, {
        month: "short",
        day: "numeric",
        year: t.getFullYear() !== (/* @__PURE__ */ new Date()).getFullYear() ? "numeric" : void 0
      });
    }
    function P(z) {
      return {
        upload: "Uploaded",
        gravatar: "Gravatar",
        oauth: "OAuth",
        generated: "Generated",
        ai: "AI Generated"
      }[z] || z;
    }
    return (z, t) => (d(), p("div", wt, [
      e("input", {
        ref_key: "fileInputRef",
        ref: M,
        type: "file",
        accept: "image/*",
        class: "hidden",
        onChange: E
      }, null, 544),
      (d(), le(he, { to: "body" }, [
        ae(ge, { name: "fade" }, {
          default: ye(() => [
            w.value && (g.value || y.value) ? (d(), p("div", xt, [
              e("div", {
                class: "absolute inset-0 bg-black/80 backdrop-blur-sm",
                onClick: Y
              }),
              e("div", bt, [
                e("h3", Ct, R(x.value === "edit" ? "Adjust your photo" : "Position your photo"), 1),
                ae(_e, {
                  file: g.value,
                  url: C.value,
                  shape: c.shape,
                  "crop-size": c.cropSize,
                  "confirm-label": x.value === "edit" ? "Save changes" : "Upload",
                  onConfirm: V,
                  onCancel: Y
                }, null, 8, ["file", "url", "shape", "crop-size", "confirm-label"])
              ])
            ])) : I("", !0)
          ]),
          _: 1
        })
      ])),
      h(k) && h(u).length === 0 ? (d(), p("div", _t, [...t[1] || (t[1] = [
        e("div", { class: "w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" }, null, -1)
      ])])) : h(o) && h(u).length === 0 ? (d(), p("div", zt, [
        e("div", $t, R(h(o)), 1),
        e("button", {
          onClick: t[0] || (t[0] = //@ts-ignore
          (...n) => h(D) && h(D)(...n)),
          class: "text-sm text-primary-400 hover:text-primary-300 underline"
        }, " Try again ")
      ])) : c.mode === "compact" ? (d(), p("div", Mt, [
        e("div", St, [
          (d(!0), p(te, null, ce(h(u), (n) => (d(), p("div", {
            key: n.id,
            class: "relative group",
            style: q({ width: `${c.avatarSize}px`, height: `${c.avatarSize}px` })
          }, [
            e("button", {
              onClick: (l) => b(n),
              class: X(["w-full h-full overflow-hidden transition-all duration-200", [
                f.value,
                n.is_primary ? "ring-[3px] ring-emerald-500 ring-offset-2 ring-offset-dark-900" : v.value === n.id ? "ring-2 ring-dark-400 ring-offset-2 ring-offset-dark-900" : "ring-2 ring-transparent hover:ring-dark-500 ring-offset-2 ring-offset-dark-900"
              ]])
            }, [
              e("img", {
                src: h($)(n, "md"),
                alt: n.alt_text || n.name || "Avatar",
                class: "w-full h-full object-cover",
                style: q(n.dominant_color ? { backgroundColor: n.dominant_color } : {})
              }, null, 12, Et)
            ], 10, Lt),
            n.moderation_status === "pending" ? (d(), p("div", It, [...t[2] || (t[2] = [
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
            ])])) : I("", !0),
            e("div", {
              class: X(["absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1", [
                f.value,
                r.value === n.id ? "z-50 opacity-100" : "z-10"
              ]])
            }, [
              c.allowEdit ? (d(), p("button", {
                key: 0,
                type: "button",
                onClick: ee((l) => j(n), ["stop"]),
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
              ])], 8, Ut)) : I("", !0),
              n.is_primary ? I("", !0) : (d(), p("button", {
                key: 1,
                type: "button",
                onClick: ee((l) => G(n), ["stop"]),
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
                onClick: ee((l) => K(n), ["stop"]),
                class: X(["p-1.5 rounded-lg transition-colors", r.value === n.id ? "bg-red-600 hover:bg-red-700" : "bg-dark-700 hover:bg-red-600"]),
                title: r.value === n.id ? "Click again to confirm" : "Delete"
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
              ])], 10, Ot)) : I("", !0)
            ], 2)
          ], 4))), 128)),
          s.value ? (d(), p("button", {
            key: 0,
            type: "button",
            onClick: m,
            disabled: h(O),
            class: X(["flex items-center justify-center border-2 border-dashed border-dark-600 hover:border-primary-500 transition-colors", f.value]),
            style: q({ width: `${c.avatarSize}px`, height: `${c.avatarSize}px` })
          }, [
            h(O) ? (d(), p("div", Ft, [
              (d(), p("svg", Pt, [
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
                  "stroke-dasharray": `${h(U)}, 100`,
                  d: "M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                }, null, 8, Rt)
              ])),
              e("span", Dt, R(h(U)) + "%", 1)
            ])) : (d(), p("div", Bt, [...t[7] || (t[7] = [
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
          ], 14, jt)) : I("", !0)
        ]),
        e("p", Tt, [
          h(u).length === 0 ? (d(), p("span", Zt, "Upload your first avatar")) : (d(), p("span", Ht, [
            de(R(h(u).length) + "/" + R(c.maxAvatars) + " · ", 1),
            t[8] || (t[8] = e("span", { class: "text-emerald-500" }, "Green ring", -1)),
            t[9] || (t[9] = de(" = primary · Hover for options ", -1))
          ]))
        ]),
        h(o) ? (d(), p("div", Yt, R(h(o)), 1)) : I("", !0)
      ])) : (d(), p("div", Vt, [
        e("div", Xt, [
          (d(!0), p(te, null, ce(h(u), (n) => (d(), p("div", {
            key: n.id,
            class: X(["flex items-center gap-4 p-3 rounded-xl transition-colors", [
              n.is_primary ? "bg-emerald-500/10 border border-emerald-500/30" : "bg-dark-800 border border-dark-700 hover:border-dark-600"
            ]])
          }, [
            e("button", {
              onClick: (l) => b(n),
              class: X(["flex-shrink-0 w-14 h-14 overflow-hidden transition-transform hover:scale-105", f.value])
            }, [
              e("img", {
                src: h($)(n, "sm"),
                alt: n.alt_text || n.name || "Avatar",
                class: "w-full h-full object-cover"
              }, null, 8, Wt)
            ], 10, Nt),
            e("div", qt, [
              e("div", Jt, [
                e("span", Gt, R(n.name || "Unnamed avatar"), 1),
                n.is_primary ? (d(), p("span", Kt, " Primary ")) : I("", !0),
                n.moderation_status === "pending" ? (d(), p("span", Qt, " Pending ")) : I("", !0)
              ]),
              e("div", ea, [
                e("span", null, R(P(n.source)), 1),
                t[10] || (t[10] = e("span", null, "·", -1)),
                e("span", null, R(A(n.created_at)), 1),
                n.format === "animated" ? (d(), p("span", ta, "·")) : I("", !0),
                n.format === "animated" ? (d(), p("span", aa, "Animated")) : I("", !0)
              ])
            ]),
            e("div", oa, [
              c.allowEdit ? (d(), p("button", {
                key: 0,
                type: "button",
                onClick: (l) => j(n),
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
              ])], 8, na)) : I("", !0),
              n.is_primary ? I("", !0) : (d(), p("button", {
                key: 1,
                type: "button",
                onClick: (l) => G(n),
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
              ])], 8, la)),
              c.allowDelete ? (d(), p("button", {
                key: 2,
                type: "button",
                onClick: (l) => K(n),
                class: X(["p-2 rounded-lg transition-colors", r.value === n.id ? "text-white bg-red-600 hover:bg-red-700" : "text-dark-400 hover:text-red-400 hover:bg-dark-700"]),
                title: r.value === n.id ? "Click again to confirm" : "Delete"
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
              ])], 10, ra)) : I("", !0)
            ])
          ], 2))), 128))
        ]),
        s.value ? (d(), p("button", {
          key: 0,
          type: "button",
          onClick: m,
          disabled: h(O),
          class: "w-full flex items-center justify-center gap-3 p-4 border-2 border-dashed border-dark-600 hover:border-primary-500 rounded-xl transition-colors group"
        }, [
          h(O) ? (d(), p(te, { key: 0 }, [
            t[14] || (t[14] = e("div", { class: "w-5 h-5 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" }, null, -1)),
            e("span", ia, "Uploading... " + R(h(U)) + "%", 1)
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
        ], 8, sa)) : I("", !0),
        e("div", ua, [
          e("span", null, R(h(u).length) + " of " + R(c.maxAvatars) + " avatars", 1),
          h(o) ? (d(), p("span", ca, R(h(o)), 1)) : I("", !0)
        ])
      ])),
      r.value ? (d(), p("div", {
        key: 4,
        class: "fixed inset-0 z-40",
        onClick: J
      })) : I("", !0)
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
  Ve as useAvatarCropper,
  kt as useAvatarManager,
  Ye as useAvatarUpload,
  Ce as useImageViewer
};
//# sourceMappingURL=index.js.map
