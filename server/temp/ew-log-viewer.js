/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Je = window, Ht = Je.ShadowRoot && (Je.ShadyCSS === void 0 || Je.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype, zt = Symbol(), jt = /* @__PURE__ */ new WeakMap();
class mi {
  constructor(t, i, a) {
    if (this._$cssResult$ = !0, a !== zt)
      throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
    this.cssText = t, this.t = i;
  }
  get styleSheet() {
    let t = this.o;
    const i = this.t;
    if (Ht && t === void 0) {
      const a = i !== void 0 && i.length === 1;
      a && (t = jt.get(i)), t === void 0 && ((this.o = t = new CSSStyleSheet()).replaceSync(this.cssText), a && jt.set(i, t));
    }
    return t;
  }
  toString() {
    return this.cssText;
  }
}
const zi = (e) => new mi(typeof e == "string" ? e : e + "", void 0, zt), Me = (e, ...t) => {
  const i = e.length === 1 ? e[0] : t.reduce((a, r, n) => a + ((s) => {
    if (s._$cssResult$ === !0)
      return s.cssText;
    if (typeof s == "number")
      return s;
    throw Error("Value passed to 'css' function must be a 'css' function result: " + s + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
  })(r) + e[n + 1], e[0]);
  return new mi(i, e, zt);
}, Ui = (e, t) => {
  Ht ? e.adoptedStyleSheets = t.map((i) => i instanceof CSSStyleSheet ? i : i.styleSheet) : t.forEach((i) => {
    const a = document.createElement("style"), r = Je.litNonce;
    r !== void 0 && a.setAttribute("nonce", r), a.textContent = i.cssText, e.appendChild(a);
  });
}, Qt = Ht ? (e) => e : (e) => e instanceof CSSStyleSheet ? ((t) => {
  let i = "";
  for (const a of t.cssRules)
    i += a.cssText;
  return zi(i);
})(e) : e;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
var wt;
const qe = window, Kt = qe.trustedTypes, Yi = Kt ? Kt.emptyScript : "", Jt = qe.reactiveElementPolyfillSupport, Nt = { toAttribute(e, t) {
  switch (t) {
    case Boolean:
      e = e ? Yi : null;
      break;
    case Object:
    case Array:
      e = e == null ? e : JSON.stringify(e);
  }
  return e;
}, fromAttribute(e, t) {
  let i = e;
  switch (t) {
    case Boolean:
      i = e !== null;
      break;
    case Number:
      i = e === null ? null : Number(e);
      break;
    case Object:
    case Array:
      try {
        i = JSON.parse(e);
      } catch {
        i = null;
      }
  }
  return i;
} }, bi = (e, t) => t !== e && (t == t || e == e), xt = { attribute: !0, type: String, converter: Nt, reflect: !1, hasChanged: bi };
class ye extends HTMLElement {
  constructor() {
    super(), this._$Ei = /* @__PURE__ */ new Map(), this.isUpdatePending = !1, this.hasUpdated = !1, this._$El = null, this.u();
  }
  static addInitializer(t) {
    var i;
    (i = this.h) !== null && i !== void 0 || (this.h = []), this.h.push(t);
  }
  static get observedAttributes() {
    this.finalize();
    const t = [];
    return this.elementProperties.forEach((i, a) => {
      const r = this._$Ep(a, i);
      r !== void 0 && (this._$Ev.set(r, a), t.push(r));
    }), t;
  }
  static createProperty(t, i = xt) {
    if (i.state && (i.attribute = !1), this.finalize(), this.elementProperties.set(t, i), !i.noAccessor && !this.prototype.hasOwnProperty(t)) {
      const a = typeof t == "symbol" ? Symbol() : "__" + t, r = this.getPropertyDescriptor(t, a, i);
      r !== void 0 && Object.defineProperty(this.prototype, t, r);
    }
  }
  static getPropertyDescriptor(t, i, a) {
    return { get() {
      return this[i];
    }, set(r) {
      const n = this[t];
      this[i] = r, this.requestUpdate(t, n, a);
    }, configurable: !0, enumerable: !0 };
  }
  static getPropertyOptions(t) {
    return this.elementProperties.get(t) || xt;
  }
  static finalize() {
    if (this.hasOwnProperty("finalized"))
      return !1;
    this.finalized = !0;
    const t = Object.getPrototypeOf(this);
    if (t.finalize(), this.elementProperties = new Map(t.elementProperties), this._$Ev = /* @__PURE__ */ new Map(), this.hasOwnProperty("properties")) {
      const i = this.properties, a = [...Object.getOwnPropertyNames(i), ...Object.getOwnPropertySymbols(i)];
      for (const r of a)
        this.createProperty(r, i[r]);
    }
    return this.elementStyles = this.finalizeStyles(this.styles), !0;
  }
  static finalizeStyles(t) {
    const i = [];
    if (Array.isArray(t)) {
      const a = new Set(t.flat(1 / 0).reverse());
      for (const r of a)
        i.unshift(Qt(r));
    } else
      t !== void 0 && i.push(Qt(t));
    return i;
  }
  static _$Ep(t, i) {
    const a = i.attribute;
    return a === !1 ? void 0 : typeof a == "string" ? a : typeof t == "string" ? t.toLowerCase() : void 0;
  }
  u() {
    var t;
    this._$E_ = new Promise((i) => this.enableUpdating = i), this._$AL = /* @__PURE__ */ new Map(), this._$Eg(), this.requestUpdate(), (t = this.constructor.h) === null || t === void 0 || t.forEach((i) => i(this));
  }
  addController(t) {
    var i, a;
    ((i = this._$ES) !== null && i !== void 0 ? i : this._$ES = []).push(t), this.renderRoot !== void 0 && this.isConnected && ((a = t.hostConnected) === null || a === void 0 || a.call(t));
  }
  removeController(t) {
    var i;
    (i = this._$ES) === null || i === void 0 || i.splice(this._$ES.indexOf(t) >>> 0, 1);
  }
  _$Eg() {
    this.constructor.elementProperties.forEach((t, i) => {
      this.hasOwnProperty(i) && (this._$Ei.set(i, this[i]), delete this[i]);
    });
  }
  createRenderRoot() {
    var t;
    const i = (t = this.shadowRoot) !== null && t !== void 0 ? t : this.attachShadow(this.constructor.shadowRootOptions);
    return Ui(i, this.constructor.elementStyles), i;
  }
  connectedCallback() {
    var t;
    this.renderRoot === void 0 && (this.renderRoot = this.createRenderRoot()), this.enableUpdating(!0), (t = this._$ES) === null || t === void 0 || t.forEach((i) => {
      var a;
      return (a = i.hostConnected) === null || a === void 0 ? void 0 : a.call(i);
    });
  }
  enableUpdating(t) {
  }
  disconnectedCallback() {
    var t;
    (t = this._$ES) === null || t === void 0 || t.forEach((i) => {
      var a;
      return (a = i.hostDisconnected) === null || a === void 0 ? void 0 : a.call(i);
    });
  }
  attributeChangedCallback(t, i, a) {
    this._$AK(t, a);
  }
  _$EO(t, i, a = xt) {
    var r;
    const n = this.constructor._$Ep(t, a);
    if (n !== void 0 && a.reflect === !0) {
      const s = (((r = a.converter) === null || r === void 0 ? void 0 : r.toAttribute) !== void 0 ? a.converter : Nt).toAttribute(i, a.type);
      this._$El = t, s == null ? this.removeAttribute(n) : this.setAttribute(n, s), this._$El = null;
    }
  }
  _$AK(t, i) {
    var a;
    const r = this.constructor, n = r._$Ev.get(t);
    if (n !== void 0 && this._$El !== n) {
      const s = r.getPropertyOptions(n), l = typeof s.converter == "function" ? { fromAttribute: s.converter } : ((a = s.converter) === null || a === void 0 ? void 0 : a.fromAttribute) !== void 0 ? s.converter : Nt;
      this._$El = n, this[n] = l.fromAttribute(i, s.type), this._$El = null;
    }
  }
  requestUpdate(t, i, a) {
    let r = !0;
    t !== void 0 && (((a = a || this.constructor.getPropertyOptions(t)).hasChanged || bi)(this[t], i) ? (this._$AL.has(t) || this._$AL.set(t, i), a.reflect === !0 && this._$El !== t && (this._$EC === void 0 && (this._$EC = /* @__PURE__ */ new Map()), this._$EC.set(t, a))) : r = !1), !this.isUpdatePending && r && (this._$E_ = this._$Ej());
  }
  async _$Ej() {
    this.isUpdatePending = !0;
    try {
      await this._$E_;
    } catch (i) {
      Promise.reject(i);
    }
    const t = this.scheduleUpdate();
    return t != null && await t, !this.isUpdatePending;
  }
  scheduleUpdate() {
    return this.performUpdate();
  }
  performUpdate() {
    var t;
    if (!this.isUpdatePending)
      return;
    this.hasUpdated, this._$Ei && (this._$Ei.forEach((r, n) => this[n] = r), this._$Ei = void 0);
    let i = !1;
    const a = this._$AL;
    try {
      i = this.shouldUpdate(a), i ? (this.willUpdate(a), (t = this._$ES) === null || t === void 0 || t.forEach((r) => {
        var n;
        return (n = r.hostUpdate) === null || n === void 0 ? void 0 : n.call(r);
      }), this.update(a)) : this._$Ek();
    } catch (r) {
      throw i = !1, this._$Ek(), r;
    }
    i && this._$AE(a);
  }
  willUpdate(t) {
  }
  _$AE(t) {
    var i;
    (i = this._$ES) === null || i === void 0 || i.forEach((a) => {
      var r;
      return (r = a.hostUpdated) === null || r === void 0 ? void 0 : r.call(a);
    }), this.hasUpdated || (this.hasUpdated = !0, this.firstUpdated(t)), this.updated(t);
  }
  _$Ek() {
    this._$AL = /* @__PURE__ */ new Map(), this.isUpdatePending = !1;
  }
  get updateComplete() {
    return this.getUpdateComplete();
  }
  getUpdateComplete() {
    return this._$E_;
  }
  shouldUpdate(t) {
    return !0;
  }
  update(t) {
    this._$EC !== void 0 && (this._$EC.forEach((i, a) => this._$EO(a, this[a], i)), this._$EC = void 0), this._$Ek();
  }
  updated(t) {
  }
  firstUpdated(t) {
  }
}
ye.finalized = !0, ye.elementProperties = /* @__PURE__ */ new Map(), ye.elementStyles = [], ye.shadowRootOptions = { mode: "open" }, Jt == null || Jt({ ReactiveElement: ye }), ((wt = qe.reactiveElementVersions) !== null && wt !== void 0 ? wt : qe.reactiveElementVersions = []).push("1.4.1");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
var At;
const et = window, be = et.trustedTypes, qt = be ? be.createPolicy("lit-html", { createHTML: (e) => e }) : void 0, ne = `lit$${(Math.random() + "").slice(9)}$`, wi = "?" + ne, Wi = `<${wi}>`, we = document, ke = (e = "") => we.createComment(e), Pe = (e) => e === null || typeof e != "object" && typeof e != "function", xi = Array.isArray, Bi = (e) => xi(e) || typeof (e == null ? void 0 : e[Symbol.iterator]) == "function", Ee = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, ei = /-->/g, ti = />/g, le = RegExp(`>|[ 	
\f\r](?:([^\\s"'>=/]+)([ 	
\f\r]*=[ 	
\f\r]*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`, "g"), ii = /'/g, ai = /"/g, Ai = /^(?:script|style|textarea|title)$/i, Vi = (e) => (t, ...i) => ({ _$litType$: e, strings: t, values: i }), j = Vi(1), de = Symbol.for("lit-noChange"), $ = Symbol.for("lit-nothing"), ri = /* @__PURE__ */ new WeakMap(), Xi = (e, t, i) => {
  var a, r;
  const n = (a = i == null ? void 0 : i.renderBefore) !== null && a !== void 0 ? a : t;
  let s = n._$litPart$;
  if (s === void 0) {
    const l = (r = i == null ? void 0 : i.renderBefore) !== null && r !== void 0 ? r : null;
    n._$litPart$ = s = new $e(t.insertBefore(ke(), l), l, void 0, i != null ? i : {});
  }
  return s._$AI(e), s;
}, me = we.createTreeWalker(we, 129, null, !1), Zi = (e, t) => {
  const i = e.length - 1, a = [];
  let r, n = t === 2 ? "<svg>" : "", s = Ee;
  for (let o = 0; o < i; o++) {
    const h = e[o];
    let u, d, c = -1, p = 0;
    for (; p < h.length && (s.lastIndex = p, d = s.exec(h), d !== null); )
      p = s.lastIndex, s === Ee ? d[1] === "!--" ? s = ei : d[1] !== void 0 ? s = ti : d[2] !== void 0 ? (Ai.test(d[2]) && (r = RegExp("</" + d[2], "g")), s = le) : d[3] !== void 0 && (s = le) : s === le ? d[0] === ">" ? (s = r != null ? r : Ee, c = -1) : d[1] === void 0 ? c = -2 : (c = s.lastIndex - d[2].length, u = d[1], s = d[3] === void 0 ? le : d[3] === '"' ? ai : ii) : s === ai || s === ii ? s = le : s === ei || s === ti ? s = Ee : (s = le, r = void 0);
    const g = s === le && e[o + 1].startsWith("/>") ? " " : "";
    n += s === Ee ? h + Wi : c >= 0 ? (a.push(u), h.slice(0, c) + "$lit$" + h.slice(c) + ne + g) : h + ne + (c === -2 ? (a.push(void 0), o) : g);
  }
  const l = n + (e[i] || "<?>") + (t === 2 ? "</svg>" : "");
  if (!Array.isArray(e) || !e.hasOwnProperty("raw"))
    throw Error("invalid template strings array");
  return [qt !== void 0 ? qt.createHTML(l) : l, a];
};
class Re {
  constructor({ strings: t, _$litType$: i }, a) {
    let r;
    this.parts = [];
    let n = 0, s = 0;
    const l = t.length - 1, o = this.parts, [h, u] = Zi(t, i);
    if (this.el = Re.createElement(h, a), me.currentNode = this.el.content, i === 2) {
      const d = this.el.content, c = d.firstChild;
      c.remove(), d.append(...c.childNodes);
    }
    for (; (r = me.nextNode()) !== null && o.length < l; ) {
      if (r.nodeType === 1) {
        if (r.hasAttributes()) {
          const d = [];
          for (const c of r.getAttributeNames())
            if (c.endsWith("$lit$") || c.startsWith(ne)) {
              const p = u[s++];
              if (d.push(c), p !== void 0) {
                const g = r.getAttribute(p.toLowerCase() + "$lit$").split(ne), f = /([.?@])?(.*)/.exec(p);
                o.push({ type: 1, index: n, name: f[2], strings: g, ctor: f[1] === "." ? ji : f[1] === "?" ? Ki : f[1] === "@" ? Ji : dt });
              } else
                o.push({ type: 6, index: n });
            }
          for (const c of d)
            r.removeAttribute(c);
        }
        if (Ai.test(r.tagName)) {
          const d = r.textContent.split(ne), c = d.length - 1;
          if (c > 0) {
            r.textContent = be ? be.emptyScript : "";
            for (let p = 0; p < c; p++)
              r.append(d[p], ke()), me.nextNode(), o.push({ type: 2, index: ++n });
            r.append(d[c], ke());
          }
        }
      } else if (r.nodeType === 8)
        if (r.data === wi)
          o.push({ type: 2, index: n });
        else {
          let d = -1;
          for (; (d = r.data.indexOf(ne, d + 1)) !== -1; )
            o.push({ type: 7, index: n }), d += ne.length - 1;
        }
      n++;
    }
  }
  static createElement(t, i) {
    const a = we.createElement("template");
    return a.innerHTML = t, a;
  }
}
function xe(e, t, i = e, a) {
  var r, n, s, l;
  if (t === de)
    return t;
  let o = a !== void 0 ? (r = i._$Cl) === null || r === void 0 ? void 0 : r[a] : i._$Cu;
  const h = Pe(t) ? void 0 : t._$litDirective$;
  return (o == null ? void 0 : o.constructor) !== h && ((n = o == null ? void 0 : o._$AO) === null || n === void 0 || n.call(o, !1), h === void 0 ? o = void 0 : (o = new h(e), o._$AT(e, i, a)), a !== void 0 ? ((s = (l = i)._$Cl) !== null && s !== void 0 ? s : l._$Cl = [])[a] = o : i._$Cu = o), o !== void 0 && (t = xe(e, o._$AS(e, t.values), o, a)), t;
}
class Gi {
  constructor(t, i) {
    this.v = [], this._$AN = void 0, this._$AD = t, this._$AM = i;
  }
  get parentNode() {
    return this._$AM.parentNode;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  p(t) {
    var i;
    const { el: { content: a }, parts: r } = this._$AD, n = ((i = t == null ? void 0 : t.creationScope) !== null && i !== void 0 ? i : we).importNode(a, !0);
    me.currentNode = n;
    let s = me.nextNode(), l = 0, o = 0, h = r[0];
    for (; h !== void 0; ) {
      if (l === h.index) {
        let u;
        h.type === 2 ? u = new $e(s, s.nextSibling, this, t) : h.type === 1 ? u = new h.ctor(s, h.name, h.strings, this, t) : h.type === 6 && (u = new qi(s, this, t)), this.v.push(u), h = r[++o];
      }
      l !== (h == null ? void 0 : h.index) && (s = me.nextNode(), l++);
    }
    return n;
  }
  m(t) {
    let i = 0;
    for (const a of this.v)
      a !== void 0 && (a.strings !== void 0 ? (a._$AI(t, a, i), i += a.strings.length - 2) : a._$AI(t[i])), i++;
  }
}
class $e {
  constructor(t, i, a, r) {
    var n;
    this.type = 2, this._$AH = $, this._$AN = void 0, this._$AA = t, this._$AB = i, this._$AM = a, this.options = r, this._$C_ = (n = r == null ? void 0 : r.isConnected) === null || n === void 0 || n;
  }
  get _$AU() {
    var t, i;
    return (i = (t = this._$AM) === null || t === void 0 ? void 0 : t._$AU) !== null && i !== void 0 ? i : this._$C_;
  }
  get parentNode() {
    let t = this._$AA.parentNode;
    const i = this._$AM;
    return i !== void 0 && t.nodeType === 11 && (t = i.parentNode), t;
  }
  get startNode() {
    return this._$AA;
  }
  get endNode() {
    return this._$AB;
  }
  _$AI(t, i = this) {
    t = xe(this, t, i), Pe(t) ? t === $ || t == null || t === "" ? (this._$AH !== $ && this._$AR(), this._$AH = $) : t !== this._$AH && t !== de && this.$(t) : t._$litType$ !== void 0 ? this.T(t) : t.nodeType !== void 0 ? this.k(t) : Bi(t) ? this.O(t) : this.$(t);
  }
  S(t, i = this._$AB) {
    return this._$AA.parentNode.insertBefore(t, i);
  }
  k(t) {
    this._$AH !== t && (this._$AR(), this._$AH = this.S(t));
  }
  $(t) {
    this._$AH !== $ && Pe(this._$AH) ? this._$AA.nextSibling.data = t : this.k(we.createTextNode(t)), this._$AH = t;
  }
  T(t) {
    var i;
    const { values: a, _$litType$: r } = t, n = typeof r == "number" ? this._$AC(t) : (r.el === void 0 && (r.el = Re.createElement(r.h, this.options)), r);
    if (((i = this._$AH) === null || i === void 0 ? void 0 : i._$AD) === n)
      this._$AH.m(a);
    else {
      const s = new Gi(n, this), l = s.p(this.options);
      s.m(a), this.k(l), this._$AH = s;
    }
  }
  _$AC(t) {
    let i = ri.get(t.strings);
    return i === void 0 && ri.set(t.strings, i = new Re(t)), i;
  }
  O(t) {
    xi(this._$AH) || (this._$AH = [], this._$AR());
    const i = this._$AH;
    let a, r = 0;
    for (const n of t)
      r === i.length ? i.push(a = new $e(this.S(ke()), this.S(ke()), this, this.options)) : a = i[r], a._$AI(n), r++;
    r < i.length && (this._$AR(a && a._$AB.nextSibling, r), i.length = r);
  }
  _$AR(t = this._$AA.nextSibling, i) {
    var a;
    for ((a = this._$AP) === null || a === void 0 || a.call(this, !1, !0, i); t && t !== this._$AB; ) {
      const r = t.nextSibling;
      t.remove(), t = r;
    }
  }
  setConnected(t) {
    var i;
    this._$AM === void 0 && (this._$C_ = t, (i = this._$AP) === null || i === void 0 || i.call(this, t));
  }
}
class dt {
  constructor(t, i, a, r, n) {
    this.type = 1, this._$AH = $, this._$AN = void 0, this.element = t, this.name = i, this._$AM = r, this.options = n, a.length > 2 || a[0] !== "" || a[1] !== "" ? (this._$AH = Array(a.length - 1).fill(new String()), this.strings = a) : this._$AH = $;
  }
  get tagName() {
    return this.element.tagName;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AI(t, i = this, a, r) {
    const n = this.strings;
    let s = !1;
    if (n === void 0)
      t = xe(this, t, i, 0), s = !Pe(t) || t !== this._$AH && t !== de, s && (this._$AH = t);
    else {
      const l = t;
      let o, h;
      for (t = n[0], o = 0; o < n.length - 1; o++)
        h = xe(this, l[a + o], i, o), h === de && (h = this._$AH[o]), s || (s = !Pe(h) || h !== this._$AH[o]), h === $ ? t = $ : t !== $ && (t += (h != null ? h : "") + n[o + 1]), this._$AH[o] = h;
    }
    s && !r && this.P(t);
  }
  P(t) {
    t === $ ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, t != null ? t : "");
  }
}
class ji extends dt {
  constructor() {
    super(...arguments), this.type = 3;
  }
  P(t) {
    this.element[this.name] = t === $ ? void 0 : t;
  }
}
const Qi = be ? be.emptyScript : "";
class Ki extends dt {
  constructor() {
    super(...arguments), this.type = 4;
  }
  P(t) {
    t && t !== $ ? this.element.setAttribute(this.name, Qi) : this.element.removeAttribute(this.name);
  }
}
class Ji extends dt {
  constructor(t, i, a, r, n) {
    super(t, i, a, r, n), this.type = 5;
  }
  _$AI(t, i = this) {
    var a;
    if ((t = (a = xe(this, t, i, 0)) !== null && a !== void 0 ? a : $) === de)
      return;
    const r = this._$AH, n = t === $ && r !== $ || t.capture !== r.capture || t.once !== r.once || t.passive !== r.passive, s = t !== $ && (r === $ || n);
    n && this.element.removeEventListener(this.name, this, r), s && this.element.addEventListener(this.name, this, t), this._$AH = t;
  }
  handleEvent(t) {
    var i, a;
    typeof this._$AH == "function" ? this._$AH.call((a = (i = this.options) === null || i === void 0 ? void 0 : i.host) !== null && a !== void 0 ? a : this.element, t) : this._$AH.handleEvent(t);
  }
}
class qi {
  constructor(t, i, a) {
    this.element = t, this.type = 6, this._$AN = void 0, this._$AM = i, this.options = a;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AI(t) {
    xe(this, t);
  }
}
const ni = et.litHtmlPolyfillSupport;
ni == null || ni(Re, $e), ((At = et.litHtmlVersions) !== null && At !== void 0 ? At : et.litHtmlVersions = []).push("2.3.1");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
var Mt, Tt;
class J extends ye {
  constructor() {
    super(...arguments), this.renderOptions = { host: this }, this._$Do = void 0;
  }
  createRenderRoot() {
    var t, i;
    const a = super.createRenderRoot();
    return (t = (i = this.renderOptions).renderBefore) !== null && t !== void 0 || (i.renderBefore = a.firstChild), a;
  }
  update(t) {
    const i = this.render();
    this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(t), this._$Do = Xi(i, this.renderRoot, this.renderOptions);
  }
  connectedCallback() {
    var t;
    super.connectedCallback(), (t = this._$Do) === null || t === void 0 || t.setConnected(!0);
  }
  disconnectedCallback() {
    var t;
    super.disconnectedCallback(), (t = this._$Do) === null || t === void 0 || t.setConnected(!1);
  }
  render() {
    return de;
  }
}
J.finalized = !0, J._$litElement$ = !0, (Mt = globalThis.litElementHydrateSupport) === null || Mt === void 0 || Mt.call(globalThis, { LitElement: J });
const si = globalThis.litElementPolyfillSupport;
si == null || si({ LitElement: J });
((Tt = globalThis.litElementVersions) !== null && Tt !== void 0 ? Tt : globalThis.litElementVersions = []).push("3.2.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Te = (e) => (t) => typeof t == "function" ? ((i, a) => (customElements.define(i, a), a))(e, t) : ((i, a) => {
  const { kind: r, elements: n } = a;
  return { kind: r, elements: n, finisher(s) {
    customElements.define(i, s);
  } };
})(e, t);
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const ea = (e, t) => t.kind === "method" && t.descriptor && !("value" in t.descriptor) ? { ...t, finisher(i) {
  i.createProperty(t.key, e);
} } : { kind: "field", key: Symbol(), placement: "own", descriptor: {}, originalKey: t.key, initializer() {
  typeof t.initializer == "function" && (this[t.key] = t.initializer.call(this));
}, finisher(i) {
  i.createProperty(t.key, e);
} };
function U(e) {
  return (t, i) => i !== void 0 ? ((a, r, n) => {
    r.constructor.createProperty(n, a);
  })(e, t, i) : ea(e, t);
}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
function Mi(e) {
  return U({ ...e, state: !0 });
}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Ti = ({ finisher: e, descriptor: t }) => (i, a) => {
  var r;
  if (a === void 0) {
    const n = (r = i.originalKey) !== null && r !== void 0 ? r : i.key, s = t != null ? { kind: "method", placement: "prototype", key: n, descriptor: t(i.key) } : { ...i, key: n };
    return e != null && (s.finisher = function(l) {
      e(l, n);
    }), s;
  }
  {
    const n = i.constructor;
    t !== void 0 && Object.defineProperty(i, a, t(a)), e == null || e(n, a);
  }
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
function ct(e, t) {
  return Ti({ descriptor: (i) => {
    const a = { get() {
      var r, n;
      return (n = (r = this.renderRoot) === null || r === void 0 ? void 0 : r.querySelector(e)) !== null && n !== void 0 ? n : null;
    }, enumerable: !0, configurable: !0 };
    if (t) {
      const r = typeof i == "symbol" ? Symbol() : "__" + i;
      a.get = function() {
        var n, s;
        return this[r] === void 0 && (this[r] = (s = (n = this.renderRoot) === null || n === void 0 ? void 0 : n.querySelector(e)) !== null && s !== void 0 ? s : null), this[r];
      };
    }
    return a;
  } });
}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
function ta(e) {
  return Ti({ descriptor: (t) => ({ get() {
    var i, a;
    return (a = (i = this.renderRoot) === null || i === void 0 ? void 0 : i.querySelectorAll(e)) !== null && a !== void 0 ? a : [];
  }, enumerable: !0, configurable: !0 }) });
}
/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
var St;
((St = window.HTMLSlotElement) === null || St === void 0 ? void 0 : St.prototype.assignedElements) != null;
/**
 * @license
 * Copyright 2011 Dan Vanderkam (danvdk@gmail.com)
 * MIT-licensed (http://opensource.org/licenses/MIT)
 */
var ia = function(e, t, i, a, r, n) {
  var s = function(l) {
    return l === "logscale" ? !1 : a(l);
  };
  return ce(e, t, i, s, r, n);
}, ce = function(e, t, i, a, r, n) {
  var s = a("pixelsPerLabel"), l = [], o, h, u, d;
  if (n)
    for (o = 0; o < n.length; o++)
      l.push({ v: n[o] });
  else {
    if (a("logscale")) {
      d = Math.floor(i / s);
      var c = nt(e, Ge, 1), p = nt(t, Ge, -1);
      c == -1 && (c = 0), p == -1 && (p = Ge.length - 1);
      var g = null;
      if (p - c >= d / 4) {
        for (var f = p; f >= c; f--) {
          var y = Ge[f], m = Math.log(y / e) / Math.log(t / e) * i, _ = { v: y };
          g === null ? g = {
            tickValue: y,
            pixel_coord: m
          } : Math.abs(m - g.pixel_coord) >= s ? g = {
            tickValue: y,
            pixel_coord: m
          } : _.label = "", l.push(_);
        }
        l.reverse();
      }
    }
    if (l.length === 0) {
      var b = a("labelsKMG2"), A, T;
      b ? (A = [1, 2, 4, 8, 16, 32, 64, 128, 256], T = 16) : (A = [1, 2, 5, 10, 20, 50, 100], T = 10);
      var k = Math.ceil(i / s), w = Math.abs(t - e) / k, M = Math.floor(Math.log(w) / Math.log(T)), L = Math.pow(T, M), x, C, F, Y;
      for (h = 0; h < A.length && (x = L * A[h], C = Math.floor(e / x) * x, F = Math.ceil(t / x) * x, d = Math.abs(F - C) / x, Y = i / d, !(Y > s)); h++)
        ;
      for (C > F && (x *= -1), o = 0; o <= d; o++)
        u = C + o * x, l.push({ v: u });
    }
  }
  var V = a("axisLabelFormatter");
  for (o = 0; o < l.length; o++)
    l[o].label === void 0 && (l[o].label = V.call(r, l[o].v, 0, a, r));
  return l;
}, He = function(e, t, i, a, r, n) {
  var s = aa(e, t, i, a);
  return s >= 0 ? Si(e, t, s, a, r) : [];
}, D = {
  MILLISECONDLY: 0,
  TWO_MILLISECONDLY: 1,
  FIVE_MILLISECONDLY: 2,
  TEN_MILLISECONDLY: 3,
  FIFTY_MILLISECONDLY: 4,
  HUNDRED_MILLISECONDLY: 5,
  FIVE_HUNDRED_MILLISECONDLY: 6,
  SECONDLY: 7,
  TWO_SECONDLY: 8,
  FIVE_SECONDLY: 9,
  TEN_SECONDLY: 10,
  THIRTY_SECONDLY: 11,
  MINUTELY: 12,
  TWO_MINUTELY: 13,
  FIVE_MINUTELY: 14,
  TEN_MINUTELY: 15,
  THIRTY_MINUTELY: 16,
  HOURLY: 17,
  TWO_HOURLY: 18,
  SIX_HOURLY: 19,
  DAILY: 20,
  TWO_DAILY: 21,
  WEEKLY: 22,
  MONTHLY: 23,
  QUARTERLY: 24,
  BIANNUAL: 25,
  ANNUAL: 26,
  DECADAL: 27,
  CENTENNIAL: 28,
  NUM_GRANULARITIES: 29
}, E = {
  DATEFIELD_Y: 0,
  DATEFIELD_M: 1,
  DATEFIELD_D: 2,
  DATEFIELD_HH: 3,
  DATEFIELD_MM: 4,
  DATEFIELD_SS: 5,
  DATEFIELD_MS: 6,
  NUM_DATEFIELDS: 7
}, O = [];
O[D.MILLISECONDLY] = { datefield: E.DATEFIELD_MS, step: 1, spacing: 1 };
O[D.TWO_MILLISECONDLY] = { datefield: E.DATEFIELD_MS, step: 2, spacing: 2 };
O[D.FIVE_MILLISECONDLY] = { datefield: E.DATEFIELD_MS, step: 5, spacing: 5 };
O[D.TEN_MILLISECONDLY] = { datefield: E.DATEFIELD_MS, step: 10, spacing: 10 };
O[D.FIFTY_MILLISECONDLY] = { datefield: E.DATEFIELD_MS, step: 50, spacing: 50 };
O[D.HUNDRED_MILLISECONDLY] = { datefield: E.DATEFIELD_MS, step: 100, spacing: 100 };
O[D.FIVE_HUNDRED_MILLISECONDLY] = { datefield: E.DATEFIELD_MS, step: 500, spacing: 500 };
O[D.SECONDLY] = { datefield: E.DATEFIELD_SS, step: 1, spacing: 1e3 * 1 };
O[D.TWO_SECONDLY] = { datefield: E.DATEFIELD_SS, step: 2, spacing: 1e3 * 2 };
O[D.FIVE_SECONDLY] = { datefield: E.DATEFIELD_SS, step: 5, spacing: 1e3 * 5 };
O[D.TEN_SECONDLY] = { datefield: E.DATEFIELD_SS, step: 10, spacing: 1e3 * 10 };
O[D.THIRTY_SECONDLY] = { datefield: E.DATEFIELD_SS, step: 30, spacing: 1e3 * 30 };
O[D.MINUTELY] = { datefield: E.DATEFIELD_MM, step: 1, spacing: 1e3 * 60 };
O[D.TWO_MINUTELY] = { datefield: E.DATEFIELD_MM, step: 2, spacing: 1e3 * 60 * 2 };
O[D.FIVE_MINUTELY] = { datefield: E.DATEFIELD_MM, step: 5, spacing: 1e3 * 60 * 5 };
O[D.TEN_MINUTELY] = { datefield: E.DATEFIELD_MM, step: 10, spacing: 1e3 * 60 * 10 };
O[D.THIRTY_MINUTELY] = { datefield: E.DATEFIELD_MM, step: 30, spacing: 1e3 * 60 * 30 };
O[D.HOURLY] = { datefield: E.DATEFIELD_HH, step: 1, spacing: 1e3 * 3600 };
O[D.TWO_HOURLY] = { datefield: E.DATEFIELD_HH, step: 2, spacing: 1e3 * 3600 * 2 };
O[D.SIX_HOURLY] = { datefield: E.DATEFIELD_HH, step: 6, spacing: 1e3 * 3600 * 6 };
O[D.DAILY] = { datefield: E.DATEFIELD_D, step: 1, spacing: 1e3 * 86400 };
O[D.TWO_DAILY] = { datefield: E.DATEFIELD_D, step: 2, spacing: 1e3 * 86400 * 2 };
O[D.WEEKLY] = { datefield: E.DATEFIELD_D, step: 7, spacing: 1e3 * 604800 };
O[D.MONTHLY] = { datefield: E.DATEFIELD_M, step: 1, spacing: 1e3 * 7200 * 365.2524 };
O[D.QUARTERLY] = { datefield: E.DATEFIELD_M, step: 3, spacing: 1e3 * 21600 * 365.2524 };
O[D.BIANNUAL] = { datefield: E.DATEFIELD_M, step: 6, spacing: 1e3 * 43200 * 365.2524 };
O[D.ANNUAL] = { datefield: E.DATEFIELD_Y, step: 1, spacing: 1e3 * 86400 * 365.2524 };
O[D.DECADAL] = { datefield: E.DATEFIELD_Y, step: 10, spacing: 1e3 * 864e3 * 365.2524 };
O[D.CENTENNIAL] = { datefield: E.DATEFIELD_Y, step: 100, spacing: 1e3 * 864e4 * 365.2524 };
var Ge = function() {
  for (var e = [], t = -39; t <= 39; t++)
    for (var i = Math.pow(10, t), a = 1; a <= 9; a++) {
      var r = i * a;
      e.push(r);
    }
  return e;
}(), aa = function(e, t, i, a) {
  for (var r = a("pixelsPerLabel"), n = 0; n < D.NUM_GRANULARITIES; n++) {
    var s = ra(e, t, n);
    if (i / s >= r)
      return n;
  }
  return -1;
}, ra = function(e, t, i) {
  var a = O[i].spacing;
  return Math.round(1 * (t - e) / a);
}, Si = function(e, t, i, a, r) {
  var n = a("axisLabelFormatter"), s = a("labelsUTC"), l = s ? Yt : Ut, o = O[i].datefield, h = O[i].step, u = O[i].spacing, d = new Date(e), c = [];
  c[E.DATEFIELD_Y] = l.getFullYear(d), c[E.DATEFIELD_M] = l.getMonth(d), c[E.DATEFIELD_D] = l.getDate(d), c[E.DATEFIELD_HH] = l.getHours(d), c[E.DATEFIELD_MM] = l.getMinutes(d), c[E.DATEFIELD_SS] = l.getSeconds(d), c[E.DATEFIELD_MS] = l.getMilliseconds(d);
  var p = c[o] % h;
  i == D.WEEKLY && (p = l.getDay(d)), c[o] -= p;
  for (var g = o + 1; g < E.NUM_DATEFIELDS; g++)
    c[g] = g === E.DATEFIELD_D ? 1 : 0;
  var f = [], y = l.makeDate.apply(null, c), m = y.getTime();
  if (i <= D.HOURLY)
    for (m < e && (m += u, y = new Date(m)); m <= t; )
      f.push({
        v: m,
        label: n.call(r, y, i, a, r)
      }), m += u, y = new Date(m);
  else
    for (m < e && (c[o] += h, y = l.makeDate.apply(null, c), m = y.getTime()); m <= t; )
      (i >= D.DAILY || l.getHours(y) % h === 0) && f.push({
        v: m,
        label: n.call(r, y, i, a, r)
      }), c[o] += h, y = l.makeDate.apply(null, c), m = y.getTime();
  return f;
};
/**
 * @license
 * Copyright 2011 Dan Vanderkam (danvdk@gmail.com)
 * MIT-licensed (http://opensource.org/licenses/MIT)
 */
var _e = 10, na = Math.log(_e), P = function(e) {
  return Math.log(e) / na;
}, tt = function(e, t, i) {
  var a = P(e), r = P(t), n = a + i * (r - a), s = Math.pow(_e, n);
  return s;
}, sa = [7, 3], oa = [7, 2, 2, 2], it = 1, at = 2, rt = function(e) {
  return e.getContext("2d");
}, Le = function(t, i, a) {
  t.addEventListener(i, a, !1);
};
function K(e, t, i) {
  e.removeEventListener(t, i, !1);
}
function ae(e) {
  return e = e || window.event, e.stopPropagation && e.stopPropagation(), e.preventDefault && e.preventDefault(), e.cancelBubble = !0, e.cancel = !0, e.returnValue = !1, !1;
}
function la(e, t, i) {
  var a, r, n;
  if (t === 0)
    a = i, r = i, n = i;
  else {
    var s = Math.floor(e * 6), l = e * 6 - s, o = i * (1 - t), h = i * (1 - t * l), u = i * (1 - t * (1 - l));
    switch (s) {
      case 1:
        a = h, r = i, n = o;
        break;
      case 2:
        a = o, r = i, n = u;
        break;
      case 3:
        a = o, r = h, n = i;
        break;
      case 4:
        a = u, r = o, n = i;
        break;
      case 5:
        a = i, r = o, n = h;
        break;
      case 6:
      case 0:
        a = i, r = u, n = o;
        break;
    }
  }
  return a = Math.floor(255 * a + 0.5), r = Math.floor(255 * r + 0.5), n = Math.floor(255 * n + 0.5), "rgb(" + a + "," + r + "," + n + ")";
}
function ze(e) {
  var t = e.getBoundingClientRect(), i = window, a = document.documentElement;
  return {
    x: t.left + (i.pageXOffset || a.scrollLeft),
    y: t.top + (i.pageYOffset || a.scrollTop)
  };
}
function ut(e) {
  return !e.pageX || e.pageX < 0 ? 0 : e.pageX;
}
function pt(e) {
  return !e.pageY || e.pageY < 0 ? 0 : e.pageY;
}
function ft(e, t) {
  return ut(e) - t.px;
}
function gt(e, t) {
  return pt(e) - t.py;
}
function ha(e) {
  return !!e && !isNaN(e);
}
function Ne(e, t) {
  return !(!e || e.yval === null || e.x === null || e.x === void 0 || e.y === null || e.y === void 0 || isNaN(e.x) || !t && isNaN(e.y));
}
function Di(e, t) {
  var i = Math.min(Math.max(1, t || 2), 21);
  return Math.abs(e) < 1e-3 && e !== 0 ? e.toExponential(i - 1) : e.toPrecision(i);
}
function he(e) {
  return e < 10 ? "0" + e : "" + e;
}
var Ut = {
  getFullYear: (e) => e.getFullYear(),
  getMonth: (e) => e.getMonth(),
  getDate: (e) => e.getDate(),
  getHours: (e) => e.getHours(),
  getMinutes: (e) => e.getMinutes(),
  getSeconds: (e) => e.getSeconds(),
  getMilliseconds: (e) => e.getMilliseconds(),
  getDay: (e) => e.getDay(),
  makeDate: function(e, t, i, a, r, n, s) {
    return new Date(e, t, i, a, r, n, s);
  }
}, Yt = {
  getFullYear: (e) => e.getUTCFullYear(),
  getMonth: (e) => e.getUTCMonth(),
  getDate: (e) => e.getUTCDate(),
  getHours: (e) => e.getUTCHours(),
  getMinutes: (e) => e.getUTCMinutes(),
  getSeconds: (e) => e.getUTCSeconds(),
  getMilliseconds: (e) => e.getUTCMilliseconds(),
  getDay: (e) => e.getUTCDay(),
  makeDate: function(e, t, i, a, r, n, s) {
    return new Date(Date.UTC(e, t, i, a, r, n, s));
  }
};
function It(e, t, i, a) {
  var r = he(e) + ":" + he(t);
  if (i && (r += ":" + he(i), a)) {
    var n = "" + a;
    r += "." + ("000" + n).substring(n.length);
  }
  return r;
}
function Ei(e, t) {
  var i = t ? Yt : Ut, a = new Date(e), r = i.getFullYear(a), n = i.getMonth(a), s = i.getDate(a), l = i.getHours(a), o = i.getMinutes(a), h = i.getSeconds(a), u = i.getMilliseconds(a), d = "" + r, c = he(n + 1), p = he(s), g = l * 3600 + o * 60 + h + 1e-3 * u, f = d + "/" + c + "/" + p;
  return g && (f += " " + It(l, o, h, u)), f;
}
function Dt(e, t) {
  var i = Math.pow(10, t);
  return Math.round(e * i) / i;
}
function nt(e, t, i, a, r) {
  if ((a == null || r === null || r === void 0) && (a = 0, r = t.length - 1), a > r)
    return -1;
  i == null && (i = 0);
  var n = function(h) {
    return h >= 0 && h < t.length;
  }, s = parseInt((a + r) / 2, 10), l = t[s], o;
  return l == e ? s : l > e ? i > 0 && (o = s - 1, n(o) && t[o] < e) ? s : nt(e, t, i, a, s - 1) : l < e ? i < 0 && (o = s + 1, n(o) && t[o] > e) ? s : nt(e, t, i, s + 1, r) : -1;
}
function Ci(e) {
  var t, i;
  if ((e.search("-") == -1 || e.search("T") != -1 || e.search("Z") != -1) && (i = je(e), i && !isNaN(i)))
    return i;
  if (e.search("-") != -1) {
    for (t = e.replace("-", "/", "g"); t.search("-") != -1; )
      t = t.replace("-", "/");
    i = je(t);
  } else
    e.length == 8 ? (t = e.substr(0, 4) + "/" + e.substr(4, 2) + "/" + e.substr(6, 2), i = je(t)) : i = je(e);
  return (!i || isNaN(i)) && console.error("Couldn't parse " + e + " as a date"), i;
}
function je(e) {
  return new Date(e).getTime();
}
function q(e, t) {
  if (typeof t < "u" && t !== null)
    for (var i in t)
      t.hasOwnProperty(i) && (e[i] = t[i]);
  return e;
}
function Wt(e, t) {
  function i(r) {
    return typeof Node == "object" ? r instanceof Node : typeof r == "object" && typeof r.nodeType == "number" && typeof r.nodeName == "string";
  }
  if (typeof t < "u" && t !== null)
    for (var a in t)
      t.hasOwnProperty(a) && (t[a] === null ? e[a] = null : Se(t[a]) ? e[a] = t[a].slice() : i(t[a]) ? e[a] = t[a] : typeof t[a] == "object" ? ((typeof e[a] != "object" || e[a] === null) && (e[a] = {}), Wt(e[a], t[a])) : e[a] = t[a]);
  return e;
}
function Se(e) {
  var t = typeof e;
  return !(t != "object" && !(t == "function" && typeof e.item == "function") || e === null || typeof e.length != "number" || e.nodeType === 3);
}
function Li(e) {
  return !(typeof e != "object" || e === null || typeof e.getTime != "function");
}
function Oi(e) {
  for (var t = [], i = 0; i < e.length; i++)
    Se(e[i]) ? t.push(Oi(e[i])) : t.push(e[i]);
  return t;
}
function st() {
  return document.createElement("canvas");
}
function kt(e) {
  try {
    var t = window.devicePixelRatio, i = e.webkitBackingStorePixelRatio || e.mozBackingStorePixelRatio || e.msBackingStorePixelRatio || e.oBackingStorePixelRatio || e.backingStorePixelRatio || 1;
    return t !== void 0 ? t / i : 1;
  } catch {
    return 1;
  }
}
function Ni(e, t, i, a) {
  t = t || 0, i = i || e.length, this.hasNext = !0, this.peek = null, this.start_ = t, this.array_ = e, this.predicate_ = a, this.end_ = Math.min(e.length, t + i), this.nextIdx_ = t - 1, this.next();
}
Ni.prototype.next = function() {
  if (!this.hasNext)
    return null;
  for (var e = this.peek, t = this.nextIdx_ + 1, i = !1; t < this.end_; ) {
    if (!this.predicate_ || this.predicate_(this.array_, t)) {
      this.peek = this.array_[t], i = !0;
      break;
    }
    t++;
  }
  return this.nextIdx_ = t, i || (this.hasNext = !1, this.peek = null), e;
};
function Bt(e, t, i, a) {
  return new Ni(e, t, i, a);
}
var da = function() {
  return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame || function(e) {
    window.setTimeout(e, 1e3 / 60);
  };
}();
function Ii(e, t, i, a) {
  var r = 0, n, s = new Date().getTime();
  if (e(r), t == 1) {
    a();
    return;
  }
  var l = t - 1;
  (function o() {
    r >= t || da.call(window, function() {
      var h = new Date().getTime(), u = h - s;
      n = r, r = Math.floor(u / i);
      var d = r - n, c = r + d > l;
      c || r >= l ? (e(l), a()) : (d !== 0 && e(r), o());
    });
  })();
}
var oi = {
  annotationClickHandler: !0,
  annotationDblClickHandler: !0,
  annotationMouseOutHandler: !0,
  annotationMouseOverHandler: !0,
  axisLineColor: !0,
  axisLineWidth: !0,
  clickCallback: !0,
  drawCallback: !0,
  drawHighlightPointCallback: !0,
  drawPoints: !0,
  drawPointCallback: !0,
  drawGrid: !0,
  fillAlpha: !0,
  gridLineColor: !0,
  gridLineWidth: !0,
  hideOverlayOnMouseOut: !0,
  highlightCallback: !0,
  highlightCircleSize: !0,
  interactionModel: !0,
  labelsDiv: !0,
  labelsKMB: !0,
  labelsKMG2: !0,
  labelsSeparateLines: !0,
  labelsShowZeroValues: !0,
  legend: !0,
  panEdgeFraction: !0,
  pixelsPerYLabel: !0,
  pointClickCallback: !0,
  pointSize: !0,
  rangeSelectorPlotFillColor: !0,
  rangeSelectorPlotFillGradientColor: !0,
  rangeSelectorPlotStrokeColor: !0,
  rangeSelectorBackgroundStrokeColor: !0,
  rangeSelectorBackgroundLineWidth: !0,
  rangeSelectorPlotLineWidth: !0,
  rangeSelectorForegroundStrokeColor: !0,
  rangeSelectorForegroundLineWidth: !0,
  rangeSelectorAlpha: !0,
  showLabelsOnHighlight: !0,
  showRoller: !0,
  strokeWidth: !0,
  underlayCallback: !0,
  unhighlightCallback: !0,
  zoomCallback: !0
};
function ca(e, t) {
  var i = {};
  if (e)
    for (var a = 1; a < e.length; a++)
      i[e[a]] = !0;
  var r = function(o) {
    for (var h in o)
      if (o.hasOwnProperty(h) && !oi[h])
        return !0;
    return !1;
  };
  for (var n in t)
    if (!!t.hasOwnProperty(n)) {
      if (n == "highlightSeriesOpts" || i[n] && !t.series) {
        if (r(t[n]))
          return !0;
      } else if (n == "series" || n == "axes") {
        var s = t[n];
        for (var l in s)
          if (s.hasOwnProperty(l) && r(s[l]))
            return !0;
      } else if (!oi[n])
        return !0;
    }
  return !1;
}
var Vt = {
  DEFAULT: function(e, t, i, a, r, n, s) {
    i.beginPath(), i.fillStyle = n, i.arc(a, r, s, 0, 2 * Math.PI, !1), i.fill();
  }
};
function ki(e) {
  for (var t = 0; t < e.length; t++) {
    var i = e.charAt(t);
    if (i === "\r")
      return t + 1 < e.length && e.charAt(t + 1) === `
` ? `\r
` : i;
    if (i === `
`)
      return t + 1 < e.length && e.charAt(t + 1) === "\r" ? `
\r` : i;
  }
  return null;
}
function li(e, t) {
  if (t === null || e === null)
    return !1;
  for (var i = e; i && i !== t; )
    i = i.parentNode;
  return i === t;
}
function hi(e, t) {
  return t < 0 ? 1 / Math.pow(e, -t) : Math.pow(e, t);
}
var ua = /^rgba?\((\d{1,3}),\s*(\d{1,3}),\s*(\d{1,3})(?:,\s*([01](?:\.\d+)?))?\)$/;
function di(e) {
  var t = ua.exec(e);
  if (!t)
    return null;
  var i = parseInt(t[1], 10), a = parseInt(t[2], 10), r = parseInt(t[3], 10);
  return t[4] ? { r: i, g: a, b: r, a: parseFloat(t[4]) } : { r: i, g: a, b: r };
}
function vt(e) {
  var t = di(e);
  if (t)
    return t;
  var i = document.createElement("div");
  i.style.backgroundColor = e, i.style.visibility = "hidden", document.body.appendChild(i);
  var a = window.getComputedStyle(i, null).backgroundColor;
  return document.body.removeChild(i), di(a);
}
function pa(e) {
  try {
    var t = e || document.createElement("canvas");
    t.getContext("2d");
  } catch {
    return !1;
  }
  return !0;
}
function re(e, t, i) {
  var a = parseFloat(e);
  if (!isNaN(a))
    return a;
  if (/^ *$/.test(e))
    return null;
  if (/^ *nan *$/i.test(e))
    return NaN;
  var r = "Unable to parse '" + e + "' as a number";
  return i !== void 0 && t !== void 0 && (r += " on line " + (1 + (t || 0)) + " ('" + i + "') of CSV."), console.error(r), null;
}
var fa = ["K", "M", "B", "T", "Q"], ga = ["k", "M", "G", "T", "P", "E", "Z", "Y"], va = ["m", "u", "n", "p", "f", "a", "z", "y"];
function Pt(e, t) {
  var i = t("sigFigs");
  if (i !== null)
    return Di(e, i);
  var a = t("digitsAfterDecimal"), r = t("maxNumberWidth"), n = t("labelsKMB"), s = t("labelsKMG2"), l;
  if (e !== 0 && (Math.abs(e) >= Math.pow(10, r) || Math.abs(e) < Math.pow(10, -a)) ? l = e.toExponential(a) : l = "" + Dt(e, a), n || s) {
    var o, h = [], u = [];
    n && (o = 1e3, h = fa), s && (n && console.warn("Setting both labelsKMB and labelsKMG2. Pick one!"), o = 1024, h = ga, u = va);
    for (var d = Math.abs(e), c = hi(o, h.length), p = h.length - 1; p >= 0; p--, c /= o)
      if (d >= c) {
        l = Dt(e / c, a) + h[p];
        break;
      }
    if (s) {
      var g = String(e.toExponential()).split("e-");
      g.length === 2 && g[1] >= 3 && g[1] <= 24 && (g[1] % 3 > 0 ? l = Dt(
        g[0] / hi(10, g[1] % 3),
        a
      ) : l = Number(g[0]).toFixed(2), l += u[Math.floor(g[1] / 3) - 1]);
    }
  }
  return l;
}
function Rt(e, t, i) {
  return Pt.call(this, e, i);
}
var ci = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
function Ue(e, t, i) {
  var a = i("labelsUTC"), r = a ? Yt : Ut, n = r.getFullYear(e), s = r.getMonth(e), l = r.getDate(e), o = r.getHours(e), h = r.getMinutes(e), u = r.getSeconds(e), d = r.getMilliseconds(e);
  if (t >= D.DECADAL)
    return "" + n;
  if (t >= D.MONTHLY)
    return ci[s] + "&#160;" + n;
  var c = o * 3600 + h * 60 + u + 1e-3 * d;
  if (c === 0 || t >= D.DAILY)
    return he(l) + "&#160;" + ci[s];
  if (t < D.SECONDLY) {
    var p = "" + d;
    return he(u) + "." + ("000" + p).substring(p.length);
  } else
    return t > D.MINUTELY ? It(o, h, u, 0) : It(o, h, u, d);
}
function yt(e, t) {
  return Ei(e, t("labelsUTC"));
}
/**
 * @license
 * Copyright 2011 Dan Vanderkam (danvdk@gmail.com)
 * MIT-licensed (http://opensource.org/licenses/MIT)
 */
var H = function(e) {
  this.dygraph_ = e, this.points = [], this.setNames = [], this.annotations = [], this.yAxes_ = null, this.xTicks_ = null, this.yTicks_ = null;
};
H.prototype.addDataset = function(e, t) {
  this.points.push(t), this.setNames.push(e);
};
H.prototype.getPlotArea = function() {
  return this.area_;
};
H.prototype.computePlotArea = function() {
  var e = {
    x: 0,
    y: 0
  };
  e.w = this.dygraph_.width_ - e.x - this.dygraph_.getOption("rightGap"), e.h = this.dygraph_.height_;
  var t = {
    chart_div: this.dygraph_.graphDiv,
    reserveSpaceLeft: function(i) {
      var a = {
        x: e.x,
        y: e.y,
        w: i,
        h: e.h
      };
      return e.x += i, e.w -= i, a;
    },
    reserveSpaceRight: function(i) {
      var a = {
        x: e.x + e.w - i,
        y: e.y,
        w: i,
        h: e.h
      };
      return e.w -= i, a;
    },
    reserveSpaceTop: function(i) {
      var a = {
        x: e.x,
        y: e.y,
        w: e.w,
        h: i
      };
      return e.y += i, e.h -= i, a;
    },
    reserveSpaceBottom: function(i) {
      var a = {
        x: e.x,
        y: e.y + e.h - i,
        w: e.w,
        h: i
      };
      return e.h -= i, a;
    },
    chartRect: function() {
      return { x: e.x, y: e.y, w: e.w, h: e.h };
    }
  };
  this.dygraph_.cascadeEvents_("layout", t), this.area_ = e;
};
H.prototype.setAnnotations = function(e) {
  this.annotations = [];
  for (var t = this.dygraph_.getOption("xValueParser") || function(r) {
    return r;
  }, i = 0; i < e.length; i++) {
    var a = {};
    if (!e[i].xval && e[i].x === void 0) {
      console.error("Annotations must have an 'x' property");
      return;
    }
    if (e[i].icon && !(e[i].hasOwnProperty("width") && e[i].hasOwnProperty("height"))) {
      console.error("Must set width and height when setting annotation.icon property");
      return;
    }
    q(a, e[i]), a.xval || (a.xval = t(a.x)), this.annotations.push(a);
  }
};
H.prototype.setXTicks = function(e) {
  this.xTicks_ = e;
};
H.prototype.setYAxes = function(e) {
  this.yAxes_ = e;
};
H.prototype.evaluate = function() {
  this._xAxis = {}, this._evaluateLimits(), this._evaluateLineCharts(), this._evaluateLineTicks(), this._evaluateAnnotations();
};
H.prototype._evaluateLimits = function() {
  var e = this.dygraph_.xAxisRange();
  this._xAxis.minval = e[0], this._xAxis.maxval = e[1];
  var t = e[1] - e[0];
  this._xAxis.scale = t !== 0 ? 1 / t : 1, this.dygraph_.getOptionForAxis("logscale", "x") && (this._xAxis.xlogrange = P(this._xAxis.maxval) - P(this._xAxis.minval), this._xAxis.xlogscale = this._xAxis.xlogrange !== 0 ? 1 / this._xAxis.xlogrange : 1);
  for (var i = 0; i < this.yAxes_.length; i++) {
    var a = this.yAxes_[i];
    a.minyval = a.computedValueRange[0], a.maxyval = a.computedValueRange[1], a.yrange = a.maxyval - a.minyval, a.yscale = a.yrange !== 0 ? 1 / a.yrange : 1, this.dygraph_.getOption("logscale") && (a.ylogrange = P(a.maxyval) - P(a.minyval), a.ylogscale = a.ylogrange !== 0 ? 1 / a.ylogrange : 1, (!isFinite(a.ylogrange) || isNaN(a.ylogrange)) && console.error("axis " + i + " of graph at " + a.g + " can't be displayed in log scale for range [" + a.minyval + " - " + a.maxyval + "]"));
  }
};
H.calcXNormal_ = function(e, t, i) {
  return i ? (P(e) - P(t.minval)) * t.xlogscale : (e - t.minval) * t.scale;
};
H.calcYNormal_ = function(e, t, i) {
  if (i) {
    var a = 1 - (P(t) - P(e.minyval)) * e.ylogscale;
    return isFinite(a) ? a : NaN;
  } else
    return 1 - (t - e.minyval) * e.yscale;
};
H.prototype._evaluateLineCharts = function() {
  for (var e = this.dygraph_.getOption("stackedGraph"), t = this.dygraph_.getOptionForAxis("logscale", "x"), i = 0; i < this.points.length; i++) {
    for (var a = this.points[i], r = this.setNames[i], n = this.dygraph_.getOption("connectSeparatedPoints", r), s = this.dygraph_.axisPropertiesForSeries(r), l = this.dygraph_.attributes_.getForSeries("logscale", r), o = 0; o < a.length; o++) {
      var h = a[o];
      h.x = H.calcXNormal_(h.xval, this._xAxis, t);
      var u = h.yval;
      e && (h.y_stacked = H.calcYNormal_(
        s,
        h.yval_stacked,
        l
      ), u !== null && !isNaN(u) && (u = h.yval_stacked)), u === null && (u = NaN, n || (h.yval = NaN)), h.y = H.calcYNormal_(s, u, l);
    }
    this.dygraph_.dataHandler_.onLineEvaluated(a, s, l);
  }
};
H.prototype._evaluateLineTicks = function() {
  var e, t, i, a, r, n;
  for (this.xticks = [], e = 0; e < this.xTicks_.length; e++)
    t = this.xTicks_[e], i = t.label, n = !("label_v" in t), r = n ? t.v : t.label_v, a = this.dygraph_.toPercentXCoord(r), a >= 0 && a < 1 && this.xticks.push({ pos: a, label: i, has_tick: n });
  for (this.yticks = [], e = 0; e < this.yAxes_.length; e++)
    for (var s = this.yAxes_[e], l = 0; l < s.ticks.length; l++)
      t = s.ticks[l], i = t.label, n = !("label_v" in t), r = n ? t.v : t.label_v, a = this.dygraph_.toPercentYCoord(r, e), a > 0 && a <= 1 && this.yticks.push({ axis: e, pos: a, label: i, has_tick: n });
};
H.prototype._evaluateAnnotations = function() {
  var e, t = {};
  for (e = 0; e < this.annotations.length; e++) {
    var i = this.annotations[e];
    t[i.xval + "," + i.series] = i;
  }
  if (this.annotated_points = [], !(!this.annotations || !this.annotations.length))
    for (var a = 0; a < this.points.length; a++) {
      var r = this.points[a];
      for (e = 0; e < r.length; e++) {
        var n = r[e], s = n.xval + "," + n.name;
        s in t && (n.annotation = t[s], this.annotated_points.push(n));
      }
    }
};
H.prototype.removeAllDatasets = function() {
  delete this.points, delete this.setNames, delete this.setPointsLengths, delete this.setPointsOffsets, this.points = [], this.setNames = [], this.setPointsLengths = [], this.setPointsOffsets = [];
};
/**
 * @license
 * Copyright 2006 Dan Vanderkam (danvdk@gmail.com)
 * MIT-licensed (http://opensource.org/licenses/MIT)
 */
var N = function(e, t, i, a) {
  if (this.dygraph_ = e, this.layout = a, this.element = t, this.elementContext = i, this.height = e.height_, this.width = e.width_, !pa(this.element))
    throw "Canvas is not supported.";
  this.area = a.getPlotArea();
  var r = this.dygraph_.canvas_ctx_;
  r.beginPath(), r.rect(this.area.x, this.area.y, this.area.w, this.area.h), r.clip(), r = this.dygraph_.hidden_ctx_, r.beginPath(), r.rect(this.area.x, this.area.y, this.area.w, this.area.h), r.clip();
};
N.prototype.clear = function() {
  this.elementContext.clearRect(0, 0, this.width, this.height);
};
N.prototype.render = function() {
  this._updatePoints(), this._renderLineChart();
};
N._getIteratorPredicate = function(e) {
  return e ? N._predicateThatSkipsEmptyPoints : null;
};
N._predicateThatSkipsEmptyPoints = function(e, t) {
  return e[t].yval !== null;
};
N._drawStyledLine = function(e, t, i, a, r, n, s) {
  var l = e.dygraph, o = l.getBooleanOption("stepPlot", e.setName);
  Se(a) || (a = null);
  var h = l.getBooleanOption("drawGapEdgePoints", e.setName), u = e.points, d = e.setName, c = Bt(
    u,
    0,
    u.length,
    N._getIteratorPredicate(
      l.getBooleanOption("connectSeparatedPoints", d)
    )
  ), p = a && a.length >= 2, g = e.drawingContext;
  g.save(), p && g.setLineDash && g.setLineDash(a);
  var f = N._drawSeries(
    e,
    c,
    i,
    s,
    r,
    h,
    o,
    t
  );
  N._drawPointsOnLine(
    e,
    f,
    n,
    t,
    s
  ), p && g.setLineDash && g.setLineDash([]), g.restore();
};
N._drawSeries = function(e, t, i, a, r, n, s, l) {
  var o = null, h = null, u = null, d, c, p = [], g = !0, f = e.drawingContext;
  f.beginPath(), f.strokeStyle = l, f.lineWidth = i;
  for (var y = t.array_, m = t.end_, _ = t.predicate_, b = t.start_; b < m; b++) {
    if (c = y[b], _) {
      for (; b < m && !_(y, b); )
        b++;
      if (b == m)
        break;
      c = y[b];
    }
    if (c.canvasy === null || c.canvasy != c.canvasy)
      s && o !== null && (f.moveTo(o, h), f.lineTo(c.canvasx, h)), o = h = null;
    else {
      if (d = !1, n || o === null) {
        t.nextIdx_ = b, t.next(), u = t.hasNext ? t.peek.canvasy : null;
        var A = u === null || u != u;
        d = o === null && A, n && (!g && o === null || t.hasNext && A) && (d = !0);
      }
      o !== null ? i && (s && (f.moveTo(o, h), f.lineTo(c.canvasx, h)), f.lineTo(c.canvasx, c.canvasy)) : f.moveTo(c.canvasx, c.canvasy), (r || d) && p.push([c.canvasx, c.canvasy, c.idx]), o = c.canvasx, h = c.canvasy;
    }
    g = !1;
  }
  return f.stroke(), p;
};
N._drawPointsOnLine = function(e, t, i, a, r) {
  for (var n = e.drawingContext, s = 0; s < t.length; s++) {
    var l = t[s];
    n.save(), i.call(
      e.dygraph,
      e.dygraph,
      e.setName,
      n,
      l[0],
      l[1],
      a,
      r,
      l[2]
    ), n.restore();
  }
};
N.prototype._updatePoints = function() {
  for (var e = this.layout.points, t = e.length; t--; )
    for (var i = e[t], a = i.length; a--; ) {
      var r = i[a];
      r.canvasx = this.area.w * r.x + this.area.x, r.canvasy = this.area.h * r.y + this.area.y;
    }
};
N.prototype._renderLineChart = function(e, t) {
  var i = t || this.elementContext, a, r = this.layout.points, n = this.layout.setNames, s;
  this.colors = this.dygraph_.colorsMap_;
  var l = this.dygraph_.getOption("plotter"), o = l;
  Se(o) || (o = [o]);
  var h = {};
  for (a = 0; a < n.length; a++) {
    s = n[a];
    var u = this.dygraph_.getOption("plotter", s);
    u != l && (h[s] = u);
  }
  for (a = 0; a < o.length; a++)
    for (var d = o[a], c = a == o.length - 1, p = 0; p < r.length; p++)
      if (s = n[p], !(e && s != e)) {
        var g = r[p], f = d;
        if (s in h)
          if (c)
            f = h[s];
          else
            continue;
        var y = this.colors[s], m = this.dygraph_.getOption("strokeWidth", s);
        i.save(), i.strokeStyle = y, i.lineWidth = m, f({
          points: g,
          setName: s,
          drawingContext: i,
          color: y,
          strokeWidth: m,
          dygraph: this.dygraph_,
          axis: this.dygraph_.axisPropertiesForSeries(s),
          plotArea: this.area,
          seriesIndex: p,
          seriesCount: r.length,
          singleSeriesName: e,
          allSeriesPoints: r
        }), i.restore();
      }
};
N._Plotters = {
  linePlotter: function(e) {
    N._linePlotter(e);
  },
  fillPlotter: function(e) {
    N._fillPlotter(e);
  },
  errorPlotter: function(e) {
    N._errorPlotter(e);
  }
};
N._linePlotter = function(e) {
  var t = e.dygraph, i = e.setName, a = e.strokeWidth, r = t.getNumericOption("strokeBorderWidth", i), n = t.getOption("drawPointCallback", i) || Vt.DEFAULT, s = t.getOption("strokePattern", i), l = t.getBooleanOption("drawPoints", i), o = t.getNumericOption("pointSize", i);
  r && a && N._drawStyledLine(
    e,
    t.getOption("strokeBorderColor", i),
    a + 2 * r,
    s,
    l,
    n,
    o
  ), N._drawStyledLine(
    e,
    e.color,
    a,
    s,
    l,
    n,
    o
  );
};
N._errorPlotter = function(e) {
  var t = e.dygraph, i = e.setName, a = t.getBooleanOption("errorBars") || t.getBooleanOption("customBars");
  if (!!a) {
    var r = t.getBooleanOption("fillGraph", i);
    r && console.warn("Can't use fillGraph option with error bars");
    var n = e.drawingContext, s = e.color, l = t.getNumericOption("fillAlpha", i), o = t.getBooleanOption("stepPlot", i), h = e.points, u = Bt(
      h,
      0,
      h.length,
      N._getIteratorPredicate(
        t.getBooleanOption("connectSeparatedPoints", i)
      )
    ), d, c = NaN, p = NaN, g = [-1, -1], f = vt(s), y = "rgba(" + f.r + "," + f.g + "," + f.b + "," + l + ")";
    n.fillStyle = y, n.beginPath();
    for (var m = function(b) {
      return b == null || isNaN(b);
    }; u.hasNext; ) {
      var _ = u.next();
      if (!o && m(_.y) || o && !isNaN(p) && m(p)) {
        c = NaN;
        continue;
      }
      d = [_.y_bottom, _.y_top], o && (p = _.y), isNaN(d[0]) && (d[0] = _.y), isNaN(d[1]) && (d[1] = _.y), d[0] = e.plotArea.h * d[0] + e.plotArea.y, d[1] = e.plotArea.h * d[1] + e.plotArea.y, isNaN(c) || (o ? (n.moveTo(c, g[0]), n.lineTo(_.canvasx, g[0]), n.lineTo(_.canvasx, g[1])) : (n.moveTo(c, g[0]), n.lineTo(_.canvasx, d[0]), n.lineTo(_.canvasx, d[1])), n.lineTo(c, g[1]), n.closePath()), g = d, c = _.canvasx;
    }
    n.fill();
  }
};
N._fastCanvasProxy = function(e) {
  var t = [], i = null, a = null, r = 1, n = 2, s = 0, l = function(u) {
    if (!(t.length <= 1)) {
      for (var d = t.length - 1; d > 0; d--) {
        var c = t[d];
        if (c[0] == n) {
          var p = t[d - 1];
          p[1] == c[1] && p[2] == c[2] && t.splice(d, 1);
        }
      }
      for (var d = 0; d < t.length - 1; ) {
        var c = t[d];
        c[0] == n && t[d + 1][0] == n ? t.splice(d, 1) : d++;
      }
      if (t.length > 2 && !u) {
        var g = 0;
        t[0][0] == n && g++;
        for (var f = null, y = null, d = g; d < t.length; d++) {
          var c = t[d];
          if (c[0] == r)
            if (f === null && y === null)
              f = d, y = d;
            else {
              var m = c[2];
              m < t[f][2] ? f = d : m > t[y][2] && (y = d);
            }
        }
        var _ = t[f], b = t[y];
        t.splice(g, t.length - g), f < y ? (t.push(_), t.push(b)) : (f > y && t.push(b), t.push(_));
      }
    }
  }, o = function(u) {
    l(u);
    for (var d = 0, c = t.length; d < c; d++) {
      var p = t[d];
      p[0] == r ? e.lineTo(p[1], p[2]) : p[0] == n && e.moveTo(p[1], p[2]);
    }
    t.length && (a = t[t.length - 1][1]), s += t.length, t = [];
  }, h = function(u, d, c) {
    var p = Math.round(d);
    if (i === null || p != i) {
      var g = i - a > 1, f = p - i > 1, y = g || f;
      o(y), i = p;
    }
    t.push([u, d, c]);
  };
  return {
    moveTo: function(u, d) {
      h(n, u, d);
    },
    lineTo: function(u, d) {
      h(r, u, d);
    },
    stroke: function() {
      o(!0), e.stroke();
    },
    fill: function() {
      o(!0), e.fill();
    },
    beginPath: function() {
      o(!0), e.beginPath();
    },
    closePath: function() {
      o(!0), e.closePath();
    },
    _count: function() {
      return s;
    }
  };
};
N._fillPlotter = function(e) {
  if (!e.singleSeriesName && e.seriesIndex === 0) {
    for (var t = e.dygraph, i = t.getLabels().slice(1), a = i.length; a >= 0; a--)
      t.visibility()[a] || i.splice(a, 1);
    var r = function() {
      for (var ge = 0; ge < i.length; ge++)
        if (t.getBooleanOption("fillGraph", i[ge]))
          return !0;
      return !1;
    }();
    if (!!r)
      for (var n = e.plotArea, s = e.allSeriesPoints, l = s.length, o = t.getBooleanOption("stackedGraph"), h = t.getColors(), u = {}, d, c, p = function(ge, $i, Hi, Zt) {
        if (ge.lineTo($i, Hi), o)
          for (var bt = Zt.length - 1; bt >= 0; bt--) {
            var Gt = Zt[bt];
            ge.lineTo(Gt[0], Gt[1]);
          }
      }, g = l - 1; g >= 0; g--) {
        var f = e.drawingContext, y = i[g];
        if (!!t.getBooleanOption("fillGraph", y)) {
          var m = t.getNumericOption("fillAlpha", y), _ = t.getBooleanOption("stepPlot", y), b = h[g], A = t.axisPropertiesForSeries(y), T = 1 + A.minyval * A.yscale;
          T < 0 ? T = 0 : T > 1 && (T = 1), T = n.h * T + n.y;
          var k = s[g], w = Bt(
            k,
            0,
            k.length,
            N._getIteratorPredicate(
              t.getBooleanOption("connectSeparatedPoints", y)
            )
          ), M = NaN, L = [-1, -1], x, C = vt(b), F = "rgba(" + C.r + "," + C.g + "," + C.b + "," + m + ")";
          f.fillStyle = F, f.beginPath();
          var Y, V = !0;
          (k.length > 2 * t.width_ || v.FORCE_FAST_PROXY) && (f = N._fastCanvasProxy(f));
          for (var G = [], I; w.hasNext; ) {
            if (I = w.next(), !ha(I.y) && !_) {
              p(f, M, L[1], G), G = [], M = NaN, I.y_stacked !== null && !isNaN(I.y_stacked) && (u[I.canvasx] = n.h * I.y_stacked + n.y);
              continue;
            }
            if (o) {
              if (!V && Y == I.xval)
                continue;
              V = !1, Y = I.xval, d = u[I.canvasx];
              var te;
              d === void 0 ? te = T : c ? te = d[0] : te = d, x = [I.canvasy, te], _ ? L[0] === -1 ? u[I.canvasx] = [I.canvasy, T] : u[I.canvasx] = [I.canvasy, L[0]] : u[I.canvasx] = I.canvasy;
            } else
              isNaN(I.canvasy) && _ ? x = [n.y + n.h, T] : x = [I.canvasy, T];
            isNaN(M) ? (f.moveTo(I.canvasx, x[1]), f.lineTo(I.canvasx, x[0])) : (_ && f.lineTo(I.canvasx, L[0]), f.lineTo(I.canvasx, x[0]), o && (G.push([M, L[1]]), c && d ? G.push([I.canvasx, d[1]]) : G.push([I.canvasx, x[1]]))), L = x, M = I.canvasx;
          }
          c = _, x && I && (p(f, I.canvasx, x[1], G), G = []), f.fill();
        }
      }
  }
};
/**
 * @license
 * Copyright 2011 Robert Konigsberg (konigsberg@google.com)
 * MIT-licensed (http://opensource.org/licenses/MIT)
 */
var ya = 100, S = {};
S.maybeTreatMouseOpAsClick = function(e, t, i) {
  i.dragEndX = ft(e, i), i.dragEndY = gt(e, i);
  var a = Math.abs(i.dragEndX - i.dragStartX), r = Math.abs(i.dragEndY - i.dragStartY);
  a < 2 && r < 2 && t.lastx_ !== void 0 && t.lastx_ != -1 && S.treatMouseOpAsClick(t, e, i), i.regionWidth = a, i.regionHeight = r;
};
S.startPan = function(e, t, i) {
  var a, r;
  i.isPanning = !0;
  var n = t.xAxisRange();
  if (t.getOptionForAxis("logscale", "x") ? (i.initialLeftmostDate = P(n[0]), i.dateRange = P(n[1]) - P(n[0])) : (i.initialLeftmostDate = n[0], i.dateRange = n[1] - n[0]), i.xUnitsPerPixel = i.dateRange / (t.plotter_.area.w - 1), t.getNumericOption("panEdgeFraction")) {
    var s = t.width_ * t.getNumericOption("panEdgeFraction"), l = t.xAxisExtremes(), o = t.toDomXCoord(l[0]) - s, h = t.toDomXCoord(l[1]) + s, u = t.toDataXCoord(o), d = t.toDataXCoord(h);
    i.boundedDates = [u, d];
    var c = [], p = t.height_ * t.getNumericOption("panEdgeFraction");
    for (a = 0; a < t.axes_.length; a++) {
      r = t.axes_[a];
      var g = r.extremeRange, f = t.toDomYCoord(g[0], a) + p, y = t.toDomYCoord(g[1], a) - p, m = t.toDataYCoord(f, a), _ = t.toDataYCoord(y, a);
      c[a] = [m, _];
    }
    i.boundedValues = c;
  }
  for (i.is2DPan = !1, i.axes = [], a = 0; a < t.axes_.length; a++) {
    r = t.axes_[a];
    var b = {}, A = t.yAxisRange(a), T = t.attributes_.getForAxis("logscale", a);
    T ? (b.initialTopValue = P(A[1]), b.dragValueRange = P(A[1]) - P(A[0])) : (b.initialTopValue = A[1], b.dragValueRange = A[1] - A[0]), b.unitsPerPixel = b.dragValueRange / (t.plotter_.area.h - 1), i.axes.push(b), r.valueRange && (i.is2DPan = !0);
  }
};
S.movePan = function(e, t, i) {
  i.dragEndX = ft(e, i), i.dragEndY = gt(e, i);
  var a = i.initialLeftmostDate - (i.dragEndX - i.dragStartX) * i.xUnitsPerPixel;
  i.boundedDates && (a = Math.max(a, i.boundedDates[0]));
  var r = a + i.dateRange;
  if (i.boundedDates && r > i.boundedDates[1] && (a = a - (r - i.boundedDates[1]), r = a + i.dateRange), t.getOptionForAxis("logscale", "x") ? t.dateWindow_ = [
    Math.pow(_e, a),
    Math.pow(_e, r)
  ] : t.dateWindow_ = [a, r], i.is2DPan)
    for (var n = i.dragEndY - i.dragStartY, s = 0; s < t.axes_.length; s++) {
      var l = t.axes_[s], o = i.axes[s], h = n * o.unitsPerPixel, u = i.boundedValues ? i.boundedValues[s] : null, d = o.initialTopValue + h;
      u && (d = Math.min(d, u[1]));
      var c = d - o.dragValueRange;
      u && c < u[0] && (d = d - (c - u[0]), c = d - o.dragValueRange), t.attributes_.getForAxis("logscale", s) ? l.valueRange = [
        Math.pow(_e, c),
        Math.pow(_e, d)
      ] : l.valueRange = [c, d];
    }
  t.drawGraph_(!1);
};
S.endPan = S.maybeTreatMouseOpAsClick;
S.startZoom = function(e, t, i) {
  i.isZooming = !0, i.zoomMoved = !1;
};
S.moveZoom = function(e, t, i) {
  i.zoomMoved = !0, i.dragEndX = ft(e, i), i.dragEndY = gt(e, i);
  var a = Math.abs(i.dragStartX - i.dragEndX), r = Math.abs(i.dragStartY - i.dragEndY);
  i.dragDirection = a < r / 2 ? at : it, t.drawZoomRect_(
    i.dragDirection,
    i.dragStartX,
    i.dragEndX,
    i.dragStartY,
    i.dragEndY,
    i.prevDragDirection,
    i.prevEndX,
    i.prevEndY
  ), i.prevEndX = i.dragEndX, i.prevEndY = i.dragEndY, i.prevDragDirection = i.dragDirection;
};
S.treatMouseOpAsClick = function(e, t, i) {
  for (var a = e.getFunctionOption("clickCallback"), r = e.getFunctionOption("pointClickCallback"), n = null, s = -1, l = Number.MAX_VALUE, o = 0; o < e.selPoints_.length; o++) {
    var h = e.selPoints_[o], u = Math.pow(h.canvasx - i.dragEndX, 2) + Math.pow(h.canvasy - i.dragEndY, 2);
    !isNaN(u) && (s == -1 || u < l) && (l = u, s = o);
  }
  var d = e.getNumericOption("highlightCircleSize") + 2;
  if (l <= d * d && (n = e.selPoints_[s]), n) {
    var p = {
      cancelable: !0,
      point: n,
      canvasx: i.dragEndX,
      canvasy: i.dragEndY
    }, c = e.cascadeEvents_("pointClick", p);
    if (c)
      return;
    r && r.call(e, t, n);
  }
  var p = {
    cancelable: !0,
    xval: e.lastx_,
    pts: e.selPoints_,
    canvasx: i.dragEndX,
    canvasy: i.dragEndY
  };
  e.cascadeEvents_("click", p) || a && a.call(e, t, e.lastx_, e.selPoints_);
};
S.endZoom = function(e, t, i) {
  t.clearZoomRect_(), i.isZooming = !1, S.maybeTreatMouseOpAsClick(e, t, i);
  var a = t.getArea();
  if (i.regionWidth >= 10 && i.dragDirection == it) {
    var r = Math.min(i.dragStartX, i.dragEndX), n = Math.max(i.dragStartX, i.dragEndX);
    r = Math.max(r, a.x), n = Math.min(n, a.x + a.w), r < n && t.doZoomX_(r, n), i.cancelNextDblclick = !0;
  } else if (i.regionHeight >= 10 && i.dragDirection == at) {
    var s = Math.min(i.dragStartY, i.dragEndY), l = Math.max(i.dragStartY, i.dragEndY);
    s = Math.max(s, a.y), l = Math.min(l, a.y + a.h), s < l && t.doZoomY_(s, l), i.cancelNextDblclick = !0;
  }
  i.dragStartX = null, i.dragStartY = null;
};
S.startTouch = function(e, t, i) {
  e.preventDefault(), e.touches.length > 1 && (i.startTimeForDoubleTapMs = null);
  for (var a = [], r = 0; r < e.touches.length; r++) {
    var n = e.touches[r];
    a.push({
      pageX: n.pageX,
      pageY: n.pageY,
      dataX: t.toDataXCoord(n.pageX),
      dataY: t.toDataYCoord(n.pageY)
    });
  }
  if (i.initialTouches = a, a.length == 1)
    i.initialPinchCenter = a[0], i.touchDirections = { x: !0, y: !0 };
  else if (a.length >= 2) {
    i.initialPinchCenter = {
      pageX: 0.5 * (a[0].pageX + a[1].pageX),
      pageY: 0.5 * (a[0].pageY + a[1].pageY),
      dataX: 0.5 * (a[0].dataX + a[1].dataX),
      dataY: 0.5 * (a[0].dataY + a[1].dataY)
    };
    var s = 180 / Math.PI * Math.atan2(
      i.initialPinchCenter.pageY - a[0].pageY,
      a[0].pageX - i.initialPinchCenter.pageX
    );
    s = Math.abs(s), s > 90 && (s = 90 - s), i.touchDirections = {
      x: s < 90 - 45 / 2,
      y: s > 45 / 2
    };
  }
  i.initialRange = {
    x: t.xAxisRange(),
    y: t.yAxisRange()
  };
};
S.moveTouch = function(e, t, i) {
  i.startTimeForDoubleTapMs = null;
  var a, r = [];
  for (a = 0; a < e.touches.length; a++) {
    var n = e.touches[a];
    r.push({
      pageX: n.pageX,
      pageY: n.pageY
    });
  }
  var s = i.initialTouches, l, o = i.initialPinchCenter;
  r.length == 1 ? l = r[0] : l = {
    pageX: 0.5 * (r[0].pageX + r[1].pageX),
    pageY: 0.5 * (r[0].pageY + r[1].pageY)
  };
  var h = {
    pageX: l.pageX - o.pageX,
    pageY: l.pageY - o.pageY
  }, u = i.initialRange.x[1] - i.initialRange.x[0], d = i.initialRange.y[0] - i.initialRange.y[1];
  h.dataX = h.pageX / t.plotter_.area.w * u, h.dataY = h.pageY / t.plotter_.area.h * d;
  var c, p;
  if (r.length == 1)
    c = 1, p = 1;
  else if (r.length >= 2) {
    var g = s[1].pageX - o.pageX;
    c = (r[1].pageX - l.pageX) / g;
    var f = s[1].pageY - o.pageY;
    p = (r[1].pageY - l.pageY) / f;
  }
  c = Math.min(8, Math.max(0.125, c)), p = Math.min(8, Math.max(0.125, p));
  var y = !1;
  if (i.touchDirections.x && (t.dateWindow_ = [
    o.dataX - h.dataX + (i.initialRange.x[0] - o.dataX) / c,
    o.dataX - h.dataX + (i.initialRange.x[1] - o.dataX) / c
  ], y = !0), i.touchDirections.y)
    for (a = 0; a < 1; a++) {
      var m = t.axes_[a], _ = t.attributes_.getForAxis("logscale", a);
      _ || (m.valueRange = [
        o.dataY - h.dataY + (i.initialRange.y[0] - o.dataY) / p,
        o.dataY - h.dataY + (i.initialRange.y[1] - o.dataY) / p
      ], y = !0);
    }
  if (t.drawGraph_(!1), y && r.length > 1 && t.getFunctionOption("zoomCallback")) {
    var b = t.xAxisRange();
    t.getFunctionOption("zoomCallback").call(t, b[0], b[1], t.yAxisRanges());
  }
};
S.endTouch = function(e, t, i) {
  if (e.touches.length !== 0)
    S.startTouch(e, t, i);
  else if (e.changedTouches.length == 1) {
    var a = new Date().getTime(), r = e.changedTouches[0];
    i.startTimeForDoubleTapMs && a - i.startTimeForDoubleTapMs < 500 && i.doubleTapX && Math.abs(i.doubleTapX - r.screenX) < 50 && i.doubleTapY && Math.abs(i.doubleTapY - r.screenY) < 50 ? t.resetZoom() : (i.startTimeForDoubleTapMs = a, i.doubleTapX = r.screenX, i.doubleTapY = r.screenY);
  }
};
var ui = function(e, t, i) {
  return e < t ? t - e : e > i ? e - i : 0;
}, _a = function(e, t) {
  var i = ze(t.canvas_), a = {
    left: i.x,
    right: i.x + t.canvas_.offsetWidth,
    top: i.y,
    bottom: i.y + t.canvas_.offsetHeight
  }, r = {
    x: ut(e),
    y: pt(e)
  }, n = ui(r.x, a.left, a.right), s = ui(r.y, a.top, a.bottom);
  return Math.max(n, s);
};
S.defaultModel = {
  mousedown: function(e, t, i) {
    if (!(e.button && e.button == 2)) {
      i.initializeMouseDown(e, t, i), e.altKey || e.shiftKey ? S.startPan(e, t, i) : S.startZoom(e, t, i);
      var a = function(n) {
        if (i.isZooming) {
          var s = _a(n, t);
          s < ya ? S.moveZoom(n, t, i) : i.dragEndX !== null && (i.dragEndX = null, i.dragEndY = null, t.clearZoomRect_());
        } else
          i.isPanning && S.movePan(n, t, i);
      }, r = function(n) {
        i.isZooming ? i.dragEndX !== null ? S.endZoom(n, t, i) : S.maybeTreatMouseOpAsClick(n, t, i) : i.isPanning && S.endPan(n, t, i), K(document, "mousemove", a), K(document, "mouseup", r), i.destroy();
      };
      t.addAndTrackEvent(document, "mousemove", a), t.addAndTrackEvent(document, "mouseup", r);
    }
  },
  willDestroyContextMyself: !0,
  touchstart: function(e, t, i) {
    S.startTouch(e, t, i);
  },
  touchmove: function(e, t, i) {
    S.moveTouch(e, t, i);
  },
  touchend: function(e, t, i) {
    S.endTouch(e, t, i);
  },
  dblclick: function(e, t, i) {
    if (i.cancelNextDblclick) {
      i.cancelNextDblclick = !1;
      return;
    }
    var a = {
      canvasx: i.dragEndX,
      canvasy: i.dragEndY,
      cancelable: !0
    };
    t.cascadeEvents_("dblclick", a) || e.altKey || e.shiftKey || t.resetZoom();
  }
};
S.nonInteractiveModel_ = {
  mousedown: function(e, t, i) {
    i.initializeMouseDown(e, t, i);
  },
  mouseup: S.maybeTreatMouseOpAsClick
};
S.dragIsPanInteractionModel = {
  mousedown: function(e, t, i) {
    i.initializeMouseDown(e, t, i), S.startPan(e, t, i);
  },
  mousemove: function(e, t, i) {
    i.isPanning && S.movePan(e, t, i);
  },
  mouseup: function(e, t, i) {
    i.isPanning && S.endPan(e, t, i);
  }
};
var ot = {
  highlightCircleSize: 3,
  highlightSeriesOpts: null,
  highlightSeriesBackgroundAlpha: 0.5,
  highlightSeriesBackgroundColor: "rgb(255, 255, 255)",
  labelsSeparateLines: !1,
  labelsShowZeroValues: !0,
  labelsKMB: !1,
  labelsKMG2: !1,
  showLabelsOnHighlight: !0,
  digitsAfterDecimal: 2,
  maxNumberWidth: 6,
  sigFigs: null,
  strokeWidth: 1,
  strokeBorderWidth: 0,
  strokeBorderColor: "white",
  axisTickSize: 3,
  axisLabelFontSize: 14,
  rightGap: 5,
  showRoller: !1,
  xValueParser: void 0,
  delimiter: ",",
  sigma: 2,
  errorBars: !1,
  fractions: !1,
  wilsonInterval: !0,
  customBars: !1,
  fillGraph: !1,
  fillAlpha: 0.15,
  connectSeparatedPoints: !1,
  stackedGraph: !1,
  stackedGraphNaNFill: "all",
  hideOverlayOnMouseOut: !0,
  legend: "onmouseover",
  stepPlot: !1,
  xRangePad: 0,
  yRangePad: null,
  drawAxesAtZero: !1,
  titleHeight: 28,
  xLabelHeight: 18,
  yLabelWidth: 18,
  axisLineColor: "black",
  axisLineWidth: 0.3,
  gridLineWidth: 0.3,
  axisLabelWidth: 50,
  gridLineColor: "rgb(128,128,128)",
  interactionModel: S.defaultModel,
  animatedZooms: !1,
  showRangeSelector: !1,
  rangeSelectorHeight: 40,
  rangeSelectorPlotStrokeColor: "#808FAB",
  rangeSelectorPlotFillGradientColor: "white",
  rangeSelectorPlotFillColor: "#A7B1C4",
  rangeSelectorBackgroundStrokeColor: "gray",
  rangeSelectorBackgroundLineWidth: 1,
  rangeSelectorPlotLineWidth: 1.5,
  rangeSelectorForegroundStrokeColor: "black",
  rangeSelectorForegroundLineWidth: 1,
  rangeSelectorAlpha: 0.6,
  showInRangeSelector: null,
  plotter: [
    N._fillPlotter,
    N._errorPlotter,
    N._linePlotter
  ],
  plugins: [],
  axes: {
    x: {
      pixelsPerLabel: 70,
      axisLabelWidth: 60,
      axisLabelFormatter: Ue,
      valueFormatter: yt,
      drawGrid: !0,
      drawAxis: !0,
      independentTicks: !0,
      ticker: He
    },
    y: {
      axisLabelWidth: 50,
      pixelsPerLabel: 30,
      valueFormatter: Pt,
      axisLabelFormatter: Rt,
      drawGrid: !0,
      drawAxis: !0,
      independentTicks: !0,
      ticker: ce
    },
    y2: {
      axisLabelWidth: 50,
      pixelsPerLabel: 30,
      valueFormatter: Pt,
      axisLabelFormatter: Rt,
      drawAxis: !0,
      drawGrid: !1,
      independentTicks: !1,
      ticker: ce
    }
  }
};
/**
 * @license
 * Copyright 2011 Dan Vanderkam (danvdk@gmail.com)
 * MIT-licensed (http://opensource.org/licenses/MIT)
 */
var Oe = null;
if (typeof process < "u" && process.env.NODE_ENV != "production") {
  Oe = {
    xValueParser: {
      default: "parseFloat() or Date.parse()*",
      labels: ["CSV parsing"],
      type: "function(str) -> number",
      description: "A function which parses x-values (i.e. the dependent series). Must return a number, even when the values are dates. In this case, millis since epoch are used. This is used primarily for parsing CSV data. *=Dygraphs is slightly more accepting in the dates which it will parse. See code for details."
    },
    stackedGraph: {
      default: "false",
      labels: ["Data Line display"],
      type: "boolean",
      description: "If set, stack series on top of one another rather than drawing them independently. The first series specified in the input data will wind up on top of the chart and the last will be on bottom. NaN values are drawn as white areas without a line on top, see stackedGraphNaNFill for details."
    },
    stackedGraphNaNFill: {
      default: "all",
      labels: ["Data Line display"],
      type: "string",
      description: 'Controls handling of NaN values inside a stacked graph. NaN values are interpolated/extended for stacking purposes, but the actual point value remains NaN in the legend display. Valid option values are "all" (interpolate internally, repeat leftmost and rightmost value as needed), "inside" (interpolate internally only, use zero outside leftmost and rightmost value), and "none" (treat NaN as zero everywhere).'
    },
    pointSize: {
      default: "1",
      labels: ["Data Line display"],
      type: "integer",
      description: 'The size of the dot to draw on each point in pixels (see drawPoints). A dot is always drawn when a point is "isolated", i.e. there is a missing point on either side of it. This also controls the size of those dots.'
    },
    drawPoints: {
      default: "false",
      labels: ["Data Line display"],
      type: "boolean",
      description: "Draw a small dot at each point, in addition to a line going through the point. This makes the individual data points easier to see, but can increase visual clutter in the chart. The small dot can be replaced with a custom rendering by supplying a <a href='#drawPointCallback'>drawPointCallback</a>."
    },
    drawGapEdgePoints: {
      default: "false",
      labels: ["Data Line display"],
      type: "boolean",
      description: "Draw points at the edges of gaps in the data. This improves visibility of small data segments or other data irregularities."
    },
    drawPointCallback: {
      default: "null",
      labels: ["Data Line display"],
      type: "function(g, seriesName, canvasContext, cx, cy, color, pointSize)",
      parameters: [
        ["g", "the reference graph"],
        ["seriesName", "the name of the series"],
        ["canvasContext", "the canvas to draw on"],
        ["cx", "center x coordinate"],
        ["cy", "center y coordinate"],
        ["color", "series color"],
        ["pointSize", "the radius of the image."],
        ["idx", "the row-index of the point in the data."]
      ],
      description: "Draw a custom item when drawPoints is enabled. Default is a small dot matching the series color. This method should constrain drawing to within pointSize pixels from (cx, cy).  Also see <a href='#drawHighlightPointCallback'>drawHighlightPointCallback</a>"
    },
    height: {
      default: "320",
      labels: ["Overall display"],
      type: "integer",
      description: "Height, in pixels, of the chart. If the container div has been explicitly sized, this will be ignored."
    },
    zoomCallback: {
      default: "null",
      labels: ["Callbacks"],
      type: "function(minDate, maxDate, yRanges)",
      parameters: [
        ["minDate", "milliseconds since epoch"],
        ["maxDate", "milliseconds since epoch."],
        ["yRanges", "is an array of [bottom, top] pairs, one for each y-axis."]
      ],
      description: "A function to call when the zoom window is changed (either by zooming in or out). When animatedZooms is set, zoomCallback is called once at the end of the transition (it will not be called for intermediate frames)."
    },
    pointClickCallback: {
      snippet: "function(e, point){<br>&nbsp;&nbsp;alert(point);<br>}",
      default: "null",
      labels: ["Callbacks", "Interactive Elements"],
      type: "function(e, point)",
      parameters: [
        ["e", "the event object for the click"],
        ["point", "the point that was clicked See <a href='#point_properties'>Point properties</a> for details"]
      ],
      description: "A function to call when a data point is clicked. and the point that was clicked."
    },
    color: {
      default: "(see description)",
      labels: ["Data Series Colors"],
      type: "string",
      example: "red",
      description: "A per-series color definition. Used in conjunction with, and overrides, the colors option."
    },
    colors: {
      default: "(see description)",
      labels: ["Data Series Colors"],
      type: "array<string>",
      example: "['red', '#00FF00']",
      description: `List of colors for the data series. These can be of the form "#AABBCC" or "rgb(255,100,200)" or "yellow", etc. If not specified, equally-spaced points around a color wheel are used. Overridden by the 'color' option.`
    },
    connectSeparatedPoints: {
      default: "false",
      labels: ["Data Line display"],
      type: "boolean",
      description: "Usually, when Dygraphs encounters a missing value in a data series, it interprets this as a gap and draws it as such. If, instead, the missing values represents an x-value for which only a different series has data, then you'll want to connect the dots by setting this to true. To explicitly include a gap with this option set, use a value of NaN."
    },
    highlightCallback: {
      default: "null",
      labels: ["Callbacks"],
      type: "function(event, x, points, row, seriesName)",
      description: "When set, this callback gets called every time a new point is highlighted.",
      parameters: [
        ["event", "the JavaScript mousemove event"],
        ["x", "the x-coordinate of the highlighted points"],
        ["points", "an array of highlighted points: <code>[ {name: 'series', yval: y-value}, &hellip; ]</code>"],
        ["row", "integer index of the highlighted row in the data table, starting from 0"],
        ["seriesName", "name of the highlighted series, only present if highlightSeriesOpts is set."]
      ]
    },
    drawHighlightPointCallback: {
      default: "null",
      labels: ["Data Line display"],
      type: "function(g, seriesName, canvasContext, cx, cy, color, pointSize)",
      parameters: [
        ["g", "the reference graph"],
        ["seriesName", "the name of the series"],
        ["canvasContext", "the canvas to draw on"],
        ["cx", "center x coordinate"],
        ["cy", "center y coordinate"],
        ["color", "series color"],
        ["pointSize", "the radius of the image."],
        ["idx", "the row-index of the point in the data."]
      ],
      description: "Draw a custom item when a point is highlighted.  Default is a small dot matching the series color. This method should constrain drawing to within pointSize pixels from (cx, cy) Also see <a href='#drawPointCallback'>drawPointCallback</a>"
    },
    highlightSeriesOpts: {
      default: "null",
      labels: ["Interactive Elements"],
      type: "Object",
      description: "When set, the options from this object are applied to the timeseries closest to the mouse pointer for interactive highlighting. See also 'highlightCallback'. Example: highlightSeriesOpts: { strokeWidth: 3 }."
    },
    highlightSeriesBackgroundAlpha: {
      default: "0.5",
      labels: ["Interactive Elements"],
      type: "float",
      description: "Fade the background while highlighting series. 1=fully visible background (disable fading), 0=hiddden background (show highlighted series only)."
    },
    highlightSeriesBackgroundColor: {
      default: "rgb(255, 255, 255)",
      labels: ["Interactive Elements"],
      type: "string",
      description: "Sets the background color used to fade out the series in conjunction with 'highlightSeriesBackgroundAlpha'."
    },
    includeZero: {
      default: "false",
      labels: ["Axis display"],
      type: "boolean",
      description: "Usually, dygraphs will use the range of the data plus some padding to set the range of the y-axis. If this option is set, the y-axis will always include zero, typically as the lowest value. This can be used to avoid exaggerating the variance in the data"
    },
    rollPeriod: {
      default: "1",
      labels: ["Error Bars", "Rolling Averages"],
      type: "integer &gt;= 1",
      description: "Number of days over which to average data. Discussed extensively above."
    },
    unhighlightCallback: {
      default: "null",
      labels: ["Callbacks"],
      type: "function(event)",
      parameters: [
        ["event", "the mouse event"]
      ],
      description: "When set, this callback gets called every time the user stops highlighting any point by mousing out of the graph."
    },
    axisTickSize: {
      default: "3.0",
      labels: ["Axis display"],
      type: "number",
      description: "The size of the line to display next to each tick mark on x- or y-axes."
    },
    labelsSeparateLines: {
      default: "false",
      labels: ["Legend"],
      type: "boolean",
      description: "Put <code>&lt;br/&gt;</code> between lines in the label string. Often used in conjunction with <strong>labelsDiv</strong>."
    },
    valueFormatter: {
      default: "Depends on the type of your data.",
      labels: ["Legend", "Value display/formatting"],
      type: "function(num or millis, opts, seriesName, dygraph, row, col)",
      description: "Function to provide a custom display format for the values displayed on mouseover. This does not affect the values that appear on tick marks next to the axes. To format those, see axisLabelFormatter. This is usually set on a <a href='per-axis.html'>per-axis</a> basis. .",
      parameters: [
        ["num_or_millis", "The value to be formatted. This is always a number. For date axes, it's millis since epoch. You can call new Date(millis) to get a Date object."],
        ["opts", "This is a function you can call to access various options (e.g. opts('labelsKMB')). It returns per-axis values for the option when available."],
        ["seriesName", "The name of the series from which the point came, e.g. 'X', 'Y', 'A', etc."],
        ["dygraph", "The dygraph object for which the formatting is being done"],
        ["row", "The row of the data from which this point comes. g.getValue(row, 0) will return the x-value for this point."],
        ["col", "The column of the data from which this point comes. g.getValue(row, col) will return the original y-value for this point. This can be used to get the full confidence interval for the point, or access un-rolled values for the point."]
      ]
    },
    annotationMouseOverHandler: {
      default: "null",
      labels: ["Annotations"],
      type: "function(annotation, point, dygraph, event)",
      description: "If provided, this function is called whenever the user mouses over an annotation."
    },
    annotationMouseOutHandler: {
      default: "null",
      labels: ["Annotations"],
      type: "function(annotation, point, dygraph, event)",
      parameters: [
        ["annotation", "the annotation left"],
        ["point", "the point associated with the annotation"],
        ["dygraph", "the reference graph"],
        ["event", "the mouse event"]
      ],
      description: "If provided, this function is called whenever the user mouses out of an annotation."
    },
    annotationClickHandler: {
      default: "null",
      labels: ["Annotations"],
      type: "function(annotation, point, dygraph, event)",
      parameters: [
        ["annotation", "the annotation left"],
        ["point", "the point associated with the annotation"],
        ["dygraph", "the reference graph"],
        ["event", "the mouse event"]
      ],
      description: "If provided, this function is called whenever the user clicks on an annotation."
    },
    annotationDblClickHandler: {
      default: "null",
      labels: ["Annotations"],
      type: "function(annotation, point, dygraph, event)",
      parameters: [
        ["annotation", "the annotation left"],
        ["point", "the point associated with the annotation"],
        ["dygraph", "the reference graph"],
        ["event", "the mouse event"]
      ],
      description: "If provided, this function is called whenever the user double-clicks on an annotation."
    },
    drawCallback: {
      default: "null",
      labels: ["Callbacks"],
      type: "function(dygraph, is_initial)",
      parameters: [
        ["dygraph", "The graph being drawn"],
        ["is_initial", "True if this is the initial draw, false for subsequent draws."]
      ],
      description: "When set, this callback gets called every time the dygraph is drawn. This includes the initial draw, after zooming and repeatedly while panning."
    },
    labelsKMG2: {
      default: "false",
      labels: ["Value display/formatting"],
      type: "boolean",
      description: "Show k/M/G for kilo/Mega/Giga on y-axis. This is different than <code>labelsKMB</code> in that it uses base 2, not 10."
    },
    delimiter: {
      default: ",",
      labels: ["CSV parsing"],
      type: "string",
      description: "The delimiter to look for when separating fields of a CSV file. Setting this to a tab is not usually necessary, since tab-delimited data is auto-detected."
    },
    axisLabelFontSize: {
      default: "14",
      labels: ["Axis display"],
      type: "integer",
      description: "Size of the font (in pixels) to use in the axis labels, both x- and y-axis."
    },
    underlayCallback: {
      default: "null",
      labels: ["Callbacks"],
      type: "function(context, area, dygraph)",
      parameters: [
        ["context", "the canvas drawing context on which to draw"],
        ["area", "An object with {x,y,w,h} properties describing the drawing area."],
        ["dygraph", "the reference graph"]
      ],
      description: "When set, this callback gets called before the chart is drawn. It details on how to use this."
    },
    width: {
      default: "480",
      labels: ["Overall display"],
      type: "integer",
      description: "Width, in pixels, of the chart. If the container div has been explicitly sized, this will be ignored."
    },
    pixelRatio: {
      default: "(devicePixelRatio / context.backingStoreRatio)",
      labels: ["Overall display"],
      type: "float",
      description: "Overrides the pixel ratio scaling factor for the canvas's 2d context. Ordinarily, this is set to the devicePixelRatio / (context.backingStoreRatio || 1), so on mobile devices, where the devicePixelRatio can be somewhere around 3, performance can be improved by overriding this value to something less precise, like 1, at the expense of resolution."
    },
    interactionModel: {
      default: "...",
      labels: ["Interactive Elements"],
      type: "Object",
      description: "TODO(konigsberg): document this"
    },
    ticker: {
      default: "Dygraph.dateTicker or Dygraph.numericTicks",
      labels: ["Axis display"],
      type: "function(min, max, pixels, opts, dygraph, vals) -> [{v: ..., label: ...}, ...]",
      parameters: [
        ["min", ""],
        ["max", ""],
        ["pixels", ""],
        ["opts", ""],
        ["dygraph", "the reference graph"],
        ["vals", ""]
      ],
      description: "This lets you specify an arbitrary function to generate tick marks on an axis. The tick marks are an array of (value, label) pairs. The built-in functions go to great lengths to choose good tick marks so, if you set this option, you'll most likely want to call one of them and modify the result. See dygraph-tickers.js for an extensive discussion. This is set on a <a href='per-axis.html'>per-axis</a> basis."
    },
    xAxisHeight: {
      default: "(null)",
      labels: ["Axis display"],
      type: "integer",
      description: "Height, in pixels, of the x-axis. If not set explicitly, this is computed based on axisLabelFontSize and axisTickSize."
    },
    showLabelsOnHighlight: {
      default: "true",
      labels: ["Interactive Elements", "Legend"],
      type: "boolean",
      description: "Whether to show the legend upon mouseover."
    },
    axis: {
      default: "(none)",
      labels: ["Axis display"],
      type: "string",
      description: "Set to either 'y1' or 'y2' to assign a series to a y-axis (primary or secondary). Must be set per-series."
    },
    pixelsPerLabel: {
      default: "70 (x-axis) or 30 (y-axes)",
      labels: ["Axis display", "Grid"],
      type: "integer",
      description: "Number of pixels to require between each x- and y-label. Larger values will yield a sparser axis with fewer ticks. This is set on a <a href='per-axis.html'>per-axis</a> basis."
    },
    labelsDiv: {
      default: "null",
      labels: ["Legend"],
      type: "DOM element or string",
      example: "<code style='font-size: small'>document.getElementById('foo')</code>or<code>'foo'",
      description: "Show data labels in an external div, rather than on the graph.  This value can either be a div element or a div id."
    },
    fractions: {
      default: "false",
      labels: ["CSV parsing", "Error Bars"],
      type: "boolean",
      description: 'When set, attempt to parse each cell in the CSV file as "a/b", where a and b are integers. The ratio will be plotted. This allows computation of Wilson confidence intervals (see below).'
    },
    logscale: {
      default: "false",
      labels: ["Axis display"],
      type: "boolean",
      description: `When set for the y-axis or x-axis, the graph shows that axis in log scale. Any values less than or equal to zero are not displayed. Showing log scale with ranges that go below zero will result in an unviewable graph.

 Not compatible with showZero. connectSeparatedPoints is ignored. This is ignored for date-based x-axes.`
    },
    strokeWidth: {
      default: "1.0",
      labels: ["Data Line display"],
      type: "float",
      example: "0.5, 2.0",
      description: "The width of the lines connecting data points. This can be used to increase the contrast or some graphs."
    },
    strokePattern: {
      default: "null",
      labels: ["Data Line display"],
      type: "array<integer>",
      example: "[10, 2, 5, 2]",
      description: "A custom pattern array where the even index is a draw and odd is a space in pixels. If null then it draws a solid line. The array should have a even length as any odd lengthed array could be expressed as a smaller even length array. This is used to create dashed lines."
    },
    strokeBorderWidth: {
      default: "null",
      labels: ["Data Line display"],
      type: "float",
      example: "1.0",
      description: "Draw a border around graph lines to make crossing lines more easily distinguishable. Useful for graphs with many lines."
    },
    strokeBorderColor: {
      default: "white",
      labels: ["Data Line display"],
      type: "string",
      example: "red, #ccffdd",
      description: "Color for the line border used if strokeBorderWidth is set."
    },
    wilsonInterval: {
      default: "true",
      labels: ["Error Bars"],
      type: "boolean",
      description: 'Use in conjunction with the "fractions" option. Instead of plotting +/- N standard deviations, dygraphs will compute a Wilson confidence interval and plot that. This has more reasonable behavior for ratios close to 0 or 1.'
    },
    fillGraph: {
      default: "false",
      labels: ["Data Line display"],
      type: "boolean",
      description: "Should the area underneath the graph be filled? This option is not compatible with error bars. This may be set on a <a href='per-axis.html'>per-series</a> basis."
    },
    highlightCircleSize: {
      default: "3",
      labels: ["Interactive Elements"],
      type: "integer",
      description: "The size in pixels of the dot drawn over highlighted points."
    },
    gridLineColor: {
      default: "rgb(128,128,128)",
      labels: ["Grid"],
      type: "red, blue",
      description: "The color of the gridlines. This may be set on a per-axis basis to define each axis' grid separately."
    },
    gridLinePattern: {
      default: "null",
      labels: ["Grid"],
      type: "array<integer>",
      example: "[10, 2, 5, 2]",
      description: "A custom pattern array where the even index is a draw and odd is a space in pixels. If null then it draws a solid line. The array should have a even length as any odd lengthed array could be expressed as a smaller even length array. This is used to create dashed gridlines."
    },
    visibility: {
      default: "[true, true, ...]",
      labels: ["Data Line display"],
      type: "Array of booleans",
      description: "Which series should initially be visible? Once the Dygraph has been constructed, you can access and modify the visibility of each series using the <code>visibility</code> and <code>setVisibility</code> methods."
    },
    valueRange: {
      default: "Full range of the input is shown",
      labels: ["Axis display"],
      type: "Array of two numbers",
      example: "[10, 110]",
      description: "Explicitly set the vertical range of the graph to [low, high]. This may be set on a per-axis basis to define each y-axis separately. If either limit is unspecified, it will be calculated automatically (e.g. [null, 30] to automatically calculate just the lower bound)"
    },
    colorSaturation: {
      default: "1.0",
      labels: ["Data Series Colors"],
      type: "float (0.0 - 1.0)",
      description: "If <strong>colors</strong> is not specified, saturation of the automatically-generated data series colors."
    },
    hideOverlayOnMouseOut: {
      default: "true",
      labels: ["Interactive Elements", "Legend"],
      type: "boolean",
      description: "Whether to hide the legend when the mouse leaves the chart area."
    },
    legend: {
      default: "onmouseover",
      labels: ["Legend"],
      type: "string",
      description: 'When to display the legend. By default, it only appears when a user mouses over the chart. Set it to "always" to always display a legend of some sort. When set to "follow", legend follows highlighted points.'
    },
    legendFormatter: {
      default: "null",
      labels: ["Legend"],
      type: "function(data): string",
      params: [
        ["data", 'An object containing information about the selection (or lack of a selection). This includes formatted values and series information. See <a href="https://github.com/danvk/dygraphs/pull/683">here</a> for sample values.']
      ],
      description: 'Set this to supply a custom formatter for the legend. See <a href="https://github.com/danvk/dygraphs/pull/683">this comment</a> and the <a href="tests/legend-formatter.html">legendFormatter demo</a> for usage.'
    },
    labelsShowZeroValues: {
      default: "true",
      labels: ["Legend"],
      type: "boolean",
      description: "Show zero value labels in the labelsDiv."
    },
    stepPlot: {
      default: "false",
      labels: ["Data Line display"],
      type: "boolean",
      description: "When set, display the graph as a step plot instead of a line plot. This option may either be set for the whole graph or for single series."
    },
    labelsUTC: {
      default: "false",
      labels: ["Value display/formatting", "Axis display"],
      type: "boolean",
      description: "Show date/time labels according to UTC (instead of local time)."
    },
    labelsKMB: {
      default: "false",
      labels: ["Value display/formatting"],
      type: "boolean",
      description: "Show K/M/B for thousands/millions/billions on y-axis."
    },
    rightGap: {
      default: "5",
      labels: ["Overall display"],
      type: "integer",
      description: "Number of pixels to leave blank at the right edge of the Dygraph. This makes it easier to highlight the right-most data point."
    },
    drawAxesAtZero: {
      default: "false",
      labels: ["Axis display"],
      type: "boolean",
      description: "When set, draw the X axis at the Y=0 position and the Y axis at the X=0 position if those positions are inside the graph's visible area. Otherwise, draw the axes at the bottom or left graph edge as usual."
    },
    xRangePad: {
      default: "0",
      labels: ["Axis display"],
      type: "float",
      description: "Add the specified amount of extra space (in pixels) around the X-axis value range to ensure points at the edges remain visible."
    },
    yRangePad: {
      default: "null",
      labels: ["Axis display"],
      type: "float",
      description: "If set, add the specified amount of extra space (in pixels) around the Y-axis value range to ensure points at the edges remain visible. If unset, use the traditional Y padding algorithm."
    },
    axisLabelFormatter: {
      default: "Depends on the data type",
      labels: ["Axis display"],
      type: "function(number or Date, granularity, opts, dygraph)",
      parameters: [
        ["number or date", "Either a number (for a numeric axis) or a Date object (for a date axis)"],
        ["granularity", "specifies how fine-grained the axis is. For date axes, this is a reference to the time granularity enumeration, defined in dygraph-tickers.js, e.g. Dygraph.WEEKLY."],
        ["opts", "a function which provides access to various options on the dygraph, e.g. opts('labelsKMB')."],
        ["dygraph", "the referenced graph"]
      ],
      description: "Function to call to format the tick values that appear along an axis. This is usually set on a <a href='per-axis.html'>per-axis</a> basis."
    },
    clickCallback: {
      snippet: "function(e, date_millis){<br>&nbsp;&nbsp;alert(new Date(date_millis));<br>}",
      default: "null",
      labels: ["Callbacks"],
      type: "function(e, x, points)",
      parameters: [
        ["e", "The event object for the click"],
        ["x", "The x value that was clicked (for dates, this is milliseconds since epoch)"],
        ["points", "The closest points along that date. See <a href='#point_properties'>Point properties</a> for details."]
      ],
      description: "A function to call when the canvas is clicked."
    },
    labels: {
      default: '["X", "Y1", "Y2", ...]*',
      labels: ["Legend"],
      type: "array<string>",
      description: "A name for each data series, including the independent (X) series. For CSV files and DataTable objections, this is determined by context. For raw data, this must be specified. If it is not, default values are supplied and a warning is logged."
    },
    dateWindow: {
      default: "Full range of the input is shown",
      labels: ["Axis display"],
      type: "Array of two numbers",
      example: "[<br>&nbsp;&nbsp;Date.parse('2006-01-01'),<br>&nbsp;&nbsp;(new Date()).valueOf()<br>]",
      description: "Initially zoom in on a section of the graph. Is of the form [earliest, latest], where earliest/latest are milliseconds since epoch. If the data for the x-axis is numeric, the values in dateWindow must also be numbers."
    },
    showRoller: {
      default: "false",
      labels: ["Interactive Elements", "Rolling Averages"],
      type: "boolean",
      description: "If the rolling average period text box should be shown."
    },
    sigma: {
      default: "2.0",
      labels: ["Error Bars"],
      type: "float",
      description: "When errorBars is set, shade this many standard deviations above/below each point."
    },
    customBars: {
      default: "false",
      labels: ["CSV parsing", "Error Bars"],
      type: "boolean",
      description: 'When set, parse each CSV cell as "low;middle;high". Error bars will be drawn for each point between low and high, with the series itself going through middle.'
    },
    colorValue: {
      default: "1.0",
      labels: ["Data Series Colors"],
      type: "float (0.0 - 1.0)",
      description: "If colors is not specified, value of the data series colors, as in hue/saturation/value. (0.0-1.0, default 0.5)"
    },
    errorBars: {
      default: "false",
      labels: ["CSV parsing", "Error Bars"],
      type: "boolean",
      description: "Does the data contain standard deviations? Setting this to true alters the input format (see above)."
    },
    displayAnnotations: {
      default: "false",
      labels: ["Annotations"],
      type: "boolean",
      description: "Only applies when Dygraphs is used as a GViz chart. Causes string columns following a data series to be interpreted as annotations on points in that series. This is the same format used by Google's AnnotatedTimeLine chart."
    },
    panEdgeFraction: {
      default: "null",
      labels: ["Axis display", "Interactive Elements"],
      type: "float",
      description: "A value representing the farthest a graph may be panned, in percent of the display. For example, a value of 0.1 means that the graph can only be panned 10% passed the edges of the displayed values. null means no bounds."
    },
    title: {
      labels: ["Chart labels"],
      type: "string",
      default: "null",
      description: "Text to display above the chart. You can supply any HTML for this value, not just text. If you wish to style it using CSS, use the 'dygraph-label' or 'dygraph-title' classes."
    },
    titleHeight: {
      default: "18",
      labels: ["Chart labels"],
      type: "integer",
      description: "Height of the chart title, in pixels. This also controls the default font size of the title. If you style the title on your own, this controls how much space is set aside above the chart for the title's div."
    },
    xlabel: {
      labels: ["Chart labels"],
      type: "string",
      default: "null",
      description: "Text to display below the chart's x-axis. You can supply any HTML for this value, not just text. If you wish to style it using CSS, use the 'dygraph-label' or 'dygraph-xlabel' classes."
    },
    xLabelHeight: {
      labels: ["Chart labels"],
      type: "integer",
      default: "18",
      description: "Height of the x-axis label, in pixels. This also controls the default font size of the x-axis label. If you style the label on your own, this controls how much space is set aside below the chart for the x-axis label's div."
    },
    ylabel: {
      labels: ["Chart labels"],
      type: "string",
      default: "null",
      description: "Text to display to the left of the chart's y-axis. You can supply any HTML for this value, not just text. If you wish to style it using CSS, use the 'dygraph-label' or 'dygraph-ylabel' classes. The text will be rotated 90 degrees by default, so CSS rules may behave in unintuitive ways. No additional space is set aside for a y-axis label. If you need more space, increase the width of the y-axis tick labels using the yAxisLabelWidth option. If you need a wider div for the y-axis label, either style it that way with CSS (but remember that it's rotated, so width is controlled by the 'height' property) or set the yLabelWidth option."
    },
    y2label: {
      labels: ["Chart labels"],
      type: "string",
      default: "null",
      description: "Text to display to the right of the chart's secondary y-axis. This label is only displayed if a secondary y-axis is present. See <a href='http://dygraphs.com/tests/two-axes.html'>this test</a> for an example of how to do this. The comments for the 'ylabel' option generally apply here as well. This label gets a 'dygraph-y2label' instead of a 'dygraph-ylabel' class."
    },
    yLabelWidth: {
      labels: ["Chart labels"],
      type: "integer",
      default: "18",
      description: "Width of the div which contains the y-axis label. Since the y-axis label appears rotated 90 degrees, this actually affects the height of its div."
    },
    drawGrid: {
      default: "true for x and y, false for y2",
      labels: ["Grid"],
      type: "boolean",
      description: "Whether to display gridlines in the chart. This may be set on a per-axis basis to define the visibility of each axis' grid separately."
    },
    independentTicks: {
      default: "true for y, false for y2",
      labels: ["Axis display", "Grid"],
      type: "boolean",
      description: "Only valid for y and y2, has no effect on x: This option defines whether the y axes should align their ticks or if they should be independent. Possible combinations: 1.) y=true, y2=false (default): y is the primary axis and the y2 ticks are aligned to the the ones of y. (only 1 grid) 2.) y=false, y2=true: y2 is the primary axis and the y ticks are aligned to the the ones of y2. (only 1 grid) 3.) y=true, y2=true: Both axis are independent and have their own ticks. (2 grids) 4.) y=false, y2=false: Invalid configuration causes an error."
    },
    drawAxis: {
      default: "true for x and y, false for y2",
      labels: ["Axis display"],
      type: "boolean",
      description: "Whether to draw the specified axis. This may be set on a per-axis basis to define the visibility of each axis separately. Setting this to false also prevents axis ticks from being drawn and reclaims the space for the chart grid/lines."
    },
    gridLineWidth: {
      default: "0.3",
      labels: ["Grid"],
      type: "float",
      description: "Thickness (in pixels) of the gridlines drawn under the chart. The vertical/horizontal gridlines can be turned off entirely by using the drawGrid option. This may be set on a per-axis basis to define each axis' grid separately."
    },
    axisLineWidth: {
      default: "0.3",
      labels: ["Axis display"],
      type: "float",
      description: "Thickness (in pixels) of the x- and y-axis lines."
    },
    axisLineColor: {
      default: "black",
      labels: ["Axis display"],
      type: "string",
      description: "Color of the x- and y-axis lines. Accepts any value which the HTML canvas strokeStyle attribute understands, e.g. 'black' or 'rgb(0, 100, 255)'."
    },
    fillAlpha: {
      default: "0.15",
      labels: ["Error Bars", "Data Series Colors"],
      type: "float (0.0 - 1.0)",
      description: "Error bars (or custom bars) for each series are drawn in the same color as the series, but with partial transparency. This sets the transparency. A value of 0.0 means that the error bars will not be drawn, whereas a value of 1.0 means that the error bars will be as dark as the line for the series itself. This can be used to produce chart lines whose thickness varies at each point."
    },
    axisLabelWidth: {
      default: "50 (y-axis), 60 (x-axis)",
      labels: ["Axis display", "Chart labels"],
      type: "integer",
      description: "Width (in pixels) of the containing divs for x- and y-axis labels. For the y-axis, this also controls the width of the y-axis. Note that for the x-axis, this is independent from pixelsPerLabel, which controls the spacing between labels."
    },
    sigFigs: {
      default: "null",
      labels: ["Value display/formatting"],
      type: "integer",
      description: "By default, dygraphs displays numbers with a fixed number of digits after the decimal point. If you'd prefer to have a fixed number of significant figures, set this option to that number of sig figs. A value of 2, for instance, would cause 1 to be display as 1.0 and 1234 to be displayed as 1.23e+3."
    },
    digitsAfterDecimal: {
      default: "2",
      labels: ["Value display/formatting"],
      type: "integer",
      description: "Unless it's run in scientific mode (see the <code>sigFigs</code> option), dygraphs displays numbers with <code>digitsAfterDecimal</code> digits after the decimal point. Trailing zeros are not displayed, so with a value of 2 you'll get '0', '0.1', '0.12', '123.45' but not '123.456' (it will be rounded to '123.46'). Numbers with absolute value less than 0.1^digitsAfterDecimal (i.e. those which would show up as '0.00') will be displayed in scientific notation."
    },
    maxNumberWidth: {
      default: "6",
      labels: ["Value display/formatting"],
      type: "integer",
      description: "When displaying numbers in normal (not scientific) mode, large numbers will be displayed with many trailing zeros (e.g. 100000000 instead of 1e9). This can lead to unwieldy y-axis labels. If there are more than <code>maxNumberWidth</code> digits to the left of the decimal in a number, dygraphs will switch to scientific notation, even when not operating in scientific mode. If you'd like to see all those digits, set this to something large, like 20 or 30."
    },
    file: {
      default: "(set when constructed)",
      labels: ["Data"],
      type: "string (URL of CSV or CSV), GViz DataTable or 2D Array",
      description: "Sets the data being displayed in the chart. This can only be set when calling updateOptions; it cannot be set from the constructor. For a full description of valid data formats, see the <a href='http://dygraphs.com/data.html'>Data Formats</a> page."
    },
    timingName: {
      default: "null",
      labels: ["Debugging", "Deprecated"],
      type: "string",
      description: "Set this option to log timing information. The value of the option will be logged along with the timimg, so that you can distinguish multiple dygraphs on the same page."
    },
    showRangeSelector: {
      default: "false",
      labels: ["Range Selector"],
      type: "boolean",
      description: "Show or hide the range selector widget."
    },
    rangeSelectorHeight: {
      default: "40",
      labels: ["Range Selector"],
      type: "integer",
      description: "Height, in pixels, of the range selector widget. This option can only be specified at Dygraph creation time."
    },
    rangeSelectorPlotStrokeColor: {
      default: "#808FAB",
      labels: ["Range Selector"],
      type: "string",
      description: 'The range selector mini plot stroke color. This can be of the form "#AABBCC" or "rgb(255,100,200)" or "yellow". You can also specify null or "" to turn off stroke.'
    },
    rangeSelectorPlotFillColor: {
      default: "#A7B1C4",
      labels: ["Range Selector"],
      type: "string",
      description: 'The range selector mini plot fill color. This can be of the form "#AABBCC" or "rgb(255,100,200)" or "yellow". You can also specify null or "" to turn off fill.'
    },
    rangeSelectorPlotFillGradientColor: {
      default: "white",
      labels: ["Range Selector"],
      type: "string",
      description: 'The top color for the range selector mini plot fill color gradient. This can be of the form "#AABBCC" or "rgb(255,100,200)" or "rgba(255,100,200,42)" or "yellow". You can also specify null or "" to disable the gradient and fill with one single color.'
    },
    rangeSelectorBackgroundStrokeColor: {
      default: "gray",
      labels: ["Range Selector"],
      type: "string",
      description: 'The color of the lines below and on both sides of the range selector mini plot. This can be of the form "#AABBCC" or "rgb(255,100,200)" or "yellow".'
    },
    rangeSelectorBackgroundLineWidth: {
      default: "1",
      labels: ["Range Selector"],
      type: "float",
      description: "The width of the lines below and on both sides of the range selector mini plot."
    },
    rangeSelectorPlotLineWidth: {
      default: "1.5",
      labels: ["Range Selector"],
      type: "float",
      description: "The width of the range selector mini plot line."
    },
    rangeSelectorForegroundStrokeColor: {
      default: "black",
      labels: ["Range Selector"],
      type: "string",
      description: 'The color of the lines in the interactive layer of the range selector. This can be of the form "#AABBCC" or "rgb(255,100,200)" or "yellow".'
    },
    rangeSelectorForegroundLineWidth: {
      default: "1",
      labels: ["Range Selector"],
      type: "float",
      description: "The width the lines in the interactive layer of the range selector."
    },
    rangeSelectorAlpha: {
      default: "0.6",
      labels: ["Range Selector"],
      type: "float (0.0 - 1.0)",
      description: "The transparency of the veil that is drawn over the unselected portions of the range selector mini plot. A value of 0 represents full transparency and the unselected portions of the mini plot will appear as normal. A value of 1 represents full opacity and the unselected portions of the mini plot will be hidden."
    },
    showInRangeSelector: {
      default: "null",
      labels: ["Range Selector"],
      type: "boolean",
      description: "Mark this series for inclusion in the range selector. The mini plot curve will be an average of all such series. If this is not specified for any series, the default behavior is to average all the visible series. Setting it for one series will result in that series being charted alone in the range selector. Once it's set for a single series, it needs to be set for all series which should be included (regardless of visibility)."
    },
    animatedZooms: {
      default: "false",
      labels: ["Interactive Elements"],
      type: "boolean",
      description: "Set this option to animate the transition between zoom windows. Applies to programmatic and interactive zooms. Note that if you also set a drawCallback, it will be called several times on each zoom. If you set a zoomCallback, it will only be called after the animation is complete."
    },
    plotter: {
      default: "[DygraphCanvasRenderer.Plotters.fillPlotter, DygraphCanvasRenderer.Plotters.errorPlotter, DygraphCanvasRenderer.Plotters.linePlotter]",
      labels: ["Data Line display"],
      type: "array or function",
      description: "A function (or array of functions) which plot each data series on the chart. TODO(danvk): more details! May be set per-series."
    },
    axes: {
      default: "null",
      labels: ["Configuration"],
      type: "Object",
      description: "Defines per-axis options. Valid keys are 'x', 'y' and 'y2'. Only some options may be set on a per-axis basis. If an option may be set in this way, it will be noted on this page. See also documentation on <a href='http://dygraphs.com/per-axis.html'>per-series and per-axis options</a>."
    },
    series: {
      default: "null",
      labels: ["Series"],
      type: "Object",
      description: "Defines per-series options. Its keys match the y-axis label names, and the values are dictionaries themselves that contain options specific to that series."
    },
    plugins: {
      default: "[]",
      labels: ["Configuration"],
      type: "Array<plugin>",
      description: "Defines per-graph plugins. Useful for per-graph customization"
    },
    dataHandler: {
      default: "(depends on data)",
      labels: ["Data"],
      type: "Dygraph.DataHandler",
      description: "Custom DataHandler. This is an advanced customization. See http://bit.ly/151E7Aq."
    }
  };
  var Qe = function(e) {
    window.console && window.console.warn(e);
  }, Ce = ["type", "default", "description"], pi = [
    "Annotations",
    "Axis display",
    "Chart labels",
    "CSV parsing",
    "Callbacks",
    "Data",
    "Data Line display",
    "Data Series Colors",
    "Error Bars",
    "Grid",
    "Interactive Elements",
    "Range Selector",
    "Legend",
    "Overall display",
    "Rolling Averages",
    "Series",
    "Value display/formatting",
    "Zooming",
    "Debugging",
    "Configuration",
    "Deprecated"
  ], B, fi = {};
  for (B = 0; B < pi.length; B++)
    fi[pi[B]] = !0;
  for (var ve in Oe)
    if (!!Oe.hasOwnProperty(ve)) {
      var Et = Oe[ve];
      for (B = 0; B < Ce.length; B++)
        Et.hasOwnProperty(Ce[B]) ? typeof Et[Ce[B]] != "string" && Qe(ve + "." + Ce[B] + " must be of type string") : Qe("Option " + ve + ' missing "' + Ce[B] + '" property');
      var Ke = Et.labels;
      if (typeof Ke != "object")
        Qe('Option "' + ve + '" is missing a "labels": [...] option');
      else
        for (B = 0; B < Ke.length; B++)
          fi.hasOwnProperty(Ke[B]) || Qe('Option "' + ve + '" has label "' + Ke[B] + '", which is invalid.');
    }
}
const Ie = Oe;
/**
 * @license
 * Copyright 2011 Dan Vanderkam (danvdk@gmail.com)
 * MIT-licensed (http://opensource.org/licenses/MIT)
 */
var z = function(e) {
  this.dygraph_ = e, this.yAxes_ = [], this.xAxis_ = {}, this.series_ = {}, this.global_ = this.dygraph_.attrs_, this.user_ = this.dygraph_.user_attrs_ || {}, this.labels_ = [], this.highlightSeries_ = this.get("highlightSeriesOpts") || {}, this.reparseSeries();
};
z.AXIS_STRING_MAPPINGS_ = {
  y: 0,
  Y: 0,
  y1: 0,
  Y1: 0,
  y2: 1,
  Y2: 1
};
z.axisToIndex_ = function(e) {
  if (typeof e == "string") {
    if (z.AXIS_STRING_MAPPINGS_.hasOwnProperty(e))
      return z.AXIS_STRING_MAPPINGS_[e];
    throw "Unknown axis : " + e;
  }
  if (typeof e == "number") {
    if (e === 0 || e === 1)
      return e;
    throw "Dygraphs only supports two y-axes, indexed from 0-1.";
  }
  if (e)
    throw "Unknown axis : " + e;
  return 0;
};
z.prototype.reparseSeries = function() {
  var e = this.get("labels");
  if (!!e) {
    this.labels_ = e.slice(1), this.yAxes_ = [{ series: [], options: {} }], this.xAxis_ = { options: {} }, this.series_ = {};
    for (var t = this.user_.series || {}, i = 0; i < this.labels_.length; i++) {
      var a = this.labels_[i], r = t[a] || {}, n = z.axisToIndex_(r.axis);
      this.series_[a] = {
        idx: i,
        yAxis: n,
        options: r
      }, this.yAxes_[n] ? this.yAxes_[n].series.push(a) : this.yAxes_[n] = { series: [a], options: {} };
    }
    var s = this.user_.axes || {};
    q(this.yAxes_[0].options, s.y || {}), this.yAxes_.length > 1 && q(this.yAxes_[1].options, s.y2 || {}), q(this.xAxis_.options, s.x || {}), typeof process < "u" && process.env.NODE_ENV != "production" && this.validateOptions_();
  }
};
z.prototype.get = function(e) {
  var t = this.getGlobalUser_(e);
  return t !== null ? t : this.getGlobalDefault_(e);
};
z.prototype.getGlobalUser_ = function(e) {
  return this.user_.hasOwnProperty(e) ? this.user_[e] : null;
};
z.prototype.getGlobalDefault_ = function(e) {
  return this.global_.hasOwnProperty(e) ? this.global_[e] : ot.hasOwnProperty(e) ? ot[e] : null;
};
z.prototype.getForAxis = function(e, t) {
  var i, a;
  if (typeof t == "number")
    i = t, a = i === 0 ? "y" : "y2";
  else {
    if (t == "y1" && (t = "y"), t == "y")
      i = 0;
    else if (t == "y2")
      i = 1;
    else if (t == "x")
      i = -1;
    else
      throw "Unknown axis " + t;
    a = t;
  }
  var r = i == -1 ? this.xAxis_ : this.yAxes_[i];
  if (r) {
    var n = r.options;
    if (n.hasOwnProperty(e))
      return n[e];
  }
  if (!(t === "x" && e === "logscale")) {
    var s = this.getGlobalUser_(e);
    if (s !== null)
      return s;
  }
  var l = ot.axes[a];
  return l.hasOwnProperty(e) ? l[e] : this.getGlobalDefault_(e);
};
z.prototype.getForSeries = function(e, t) {
  if (t === this.dygraph_.getHighlightSeries() && this.highlightSeries_.hasOwnProperty(e))
    return this.highlightSeries_[e];
  if (!this.series_.hasOwnProperty(t))
    throw "Unknown series: " + t;
  var i = this.series_[t], a = i.options;
  return a.hasOwnProperty(e) ? a[e] : this.getForAxis(e, i.yAxis);
};
z.prototype.numAxes = function() {
  return this.yAxes_.length;
};
z.prototype.axisForSeries = function(e) {
  return this.series_[e].yAxis;
};
z.prototype.axisOptions = function(e) {
  return this.yAxes_[e].options;
};
z.prototype.seriesForAxis = function(e) {
  return this.yAxes_[e].series;
};
z.prototype.seriesNames = function() {
  return this.labels_;
};
if (typeof process < "u" && process.env.NODE_ENV != "production") {
  z.prototype.validateOptions_ = function() {
    if (typeof Ie > "u")
      throw "Called validateOptions_ in prod build.";
    for (var e = this, t = function(o) {
      Ie[o] || e.warnInvalidOption_(o);
    }, i = [
      this.xAxis_.options,
      this.yAxes_[0].options,
      this.yAxes_[1] && this.yAxes_[1].options,
      this.global_,
      this.user_,
      this.highlightSeries_
    ], a = this.seriesNames(), r = 0; r < a.length; r++) {
      var n = a[r];
      this.series_.hasOwnProperty(n) && i.push(this.series_[n].options);
    }
    for (var r = 0; r < i.length; r++) {
      var s = i[r];
      if (!!s)
        for (var l in s)
          s.hasOwnProperty(l) && t(l);
    }
  };
  var Ct = {};
  z.prototype.warnInvalidOption_ = function(e) {
    if (!Ct[e]) {
      Ct[e] = !0;
      var t = this.labels_.indexOf(e) >= 0;
      throw console.warn(t ? "Use new-style per-series options (saw " + e + " as top-level options key). See http://bit.ly/1tceaJs" : "Unknown option " + e + " (full list of options at dygraphs.com/options.html"), "invalid option " + e;
    }
  }, z.resetWarnings_ = function() {
    Ct = {};
  };
}
function _t() {
  this.tarps = [];
}
_t.prototype.cover = function() {
  for (var e = document.getElementsByTagName("iframe"), t = 0; t < e.length; t++) {
    var i = e[t], a = ze(i), r = a.x, n = a.y, s = i.offsetWidth, l = i.offsetHeight, o = document.createElement("div");
    o.style.position = "absolute", o.style.left = r + "px", o.style.top = n + "px", o.style.width = s + "px", o.style.height = l + "px", o.style.zIndex = 999, document.body.appendChild(o), this.tarps.push(o);
  }
};
_t.prototype.uncover = function() {
  for (var e = 0; e < this.tarps.length; e++)
    this.tarps[e].parentNode.removeChild(this.tarps[e]);
  this.tarps = [];
};
/**
 * @license
 * Copyright 2013 David Eberlein (david.eberlein@ch.sauter-bc.com)
 * MIT-licensed (http://opensource.org/licenses/MIT)
 */
var Ae = function() {
}, Q = Ae;
Q.X = 0;
Q.Y = 1;
Q.EXTRAS = 2;
Q.prototype.extractSeries = function(e, t, i) {
};
Q.prototype.seriesToPoints = function(e, t, i) {
  for (var a = [], r = 0; r < e.length; ++r) {
    var n = e[r], s = n[1], l = s === null ? null : Q.parseFloat(s), o = {
      x: NaN,
      y: NaN,
      xval: Q.parseFloat(n[0]),
      yval: l,
      name: t,
      idx: r + i
    };
    a.push(o);
  }
  return this.onPointsCreated_(e, a), a;
};
Q.prototype.onPointsCreated_ = function(e, t) {
};
Q.prototype.rollingAverage = function(e, t, i) {
};
Q.prototype.getExtremeYValues = function(e, t, i) {
};
Q.prototype.onLineEvaluated = function(e, t, i) {
};
Q.parseFloat = function(e) {
  return e === null ? NaN : e;
};
/**
 * @license
 * Copyright 2013 David Eberlein (david.eberlein@ch.sauter-bc.com)
 * MIT-licensed (http://opensource.org/licenses/MIT)
 */
var fe = function() {
};
fe.prototype = new Ae();
fe.prototype.extractSeries = function(e, t, i) {
  for (var a = [], r = i.get("logscale"), n = 0; n < e.length; n++) {
    var s = e[n][0], l = e[n][t];
    r && l <= 0 && (l = null), a.push([s, l]);
  }
  return a;
};
fe.prototype.rollingAverage = function(e, t, i) {
  t = Math.min(t, e.length);
  var a = [], r, n, s, l, o;
  if (t == 1)
    return e;
  for (r = 0; r < e.length; r++) {
    for (l = 0, o = 0, n = Math.max(0, r - t + 1); n < r + 1; n++)
      s = e[n][1], !(s === null || isNaN(s)) && (o++, l += e[n][1]);
    o ? a[r] = [e[r][0], l / o] : a[r] = [e[r][0], null];
  }
  return a;
};
fe.prototype.getExtremeYValues = function(e, t, i) {
  for (var a = null, r = null, n, s = 0, l = e.length - 1, o = s; o <= l; o++)
    n = e[o][1], !(n === null || isNaN(n)) && ((r === null || n > r) && (r = n), (a === null || n < a) && (a = n));
  return [a, r];
};
/**
 * @license
 * Copyright 2013 David Eberlein (david.eberlein@ch.sauter-bc.com)
 * MIT-licensed (http://opensource.org/licenses/MIT)
 */
var ee = function() {
  Ae.call(this);
};
ee.prototype = new Ae();
ee.prototype.extractSeries = function(e, t, i) {
};
ee.prototype.rollingAverage = function(e, t, i) {
};
ee.prototype.onPointsCreated_ = function(e, t) {
  for (var i = 0; i < e.length; ++i) {
    var a = e[i], r = t[i];
    r.y_top = NaN, r.y_bottom = NaN, r.yval_minus = Ae.parseFloat(a[2][0]), r.yval_plus = Ae.parseFloat(a[2][1]);
  }
};
ee.prototype.getExtremeYValues = function(e, t, i) {
  for (var a = null, r = null, n, s = 0, l = e.length - 1, o = s; o <= l; o++)
    if (n = e[o][1], !(n === null || isNaN(n))) {
      var h = e[o][2][0], u = e[o][2][1];
      h > n && (h = n), u < n && (u = n), (r === null || u > r) && (r = u), (a === null || h < a) && (a = h);
    }
  return [a, r];
};
ee.prototype.onLineEvaluated = function(e, t, i) {
  for (var a, r = 0; r < e.length; r++)
    a = e[r], a.y_top = H.calcYNormal_(t, a.yval_minus, i), a.y_bottom = H.calcYNormal_(t, a.yval_plus, i);
};
/**
 * @license
 * Copyright 2013 David Eberlein (david.eberlein@ch.sauter-bc.com)
 * MIT-licensed (http://opensource.org/licenses/MIT)
 */
var Ye = function() {
};
Ye.prototype = new ee();
Ye.prototype.extractSeries = function(e, t, i) {
  for (var a = [], r, n, s, l, o = i.get("sigma"), h = i.get("logscale"), u = 0; u < e.length; u++)
    r = e[u][0], l = e[u][t], h && l !== null && (l[0] <= 0 || l[0] - o * l[1] <= 0) && (l = null), l !== null ? (n = l[0], n !== null && !isNaN(n) ? (s = o * l[1], a.push([r, n, [n - s, n + s, l[1]]])) : a.push([r, n, [n, n, n]])) : a.push([r, null, [null, null, null]]);
  return a;
};
Ye.prototype.rollingAverage = function(e, t, i) {
  t = Math.min(t, e.length);
  var a = [], r = i.get("sigma"), n, s, l, o, h, u, d, c, p;
  for (n = 0; n < e.length; n++) {
    for (h = 0, c = 0, u = 0, s = Math.max(0, n - t + 1); s < n + 1; s++)
      l = e[s][1], !(l === null || isNaN(l)) && (u++, h += l, c += Math.pow(e[s][2][2], 2));
    u ? (d = Math.sqrt(c) / u, p = h / u, a[n] = [
      e[n][0],
      p,
      [p - r * d, p + r * d]
    ]) : (o = t == 1 ? e[n][1] : null, a[n] = [e[n][0], o, [o, o]]);
  }
  return a;
};
/**
 * @license
 * Copyright 2013 David Eberlein (david.eberlein@ch.sauter-bc.com)
 * MIT-licensed (http://opensource.org/licenses/MIT)
 */
var We = function() {
};
We.prototype = new ee();
We.prototype.extractSeries = function(e, t, i) {
  for (var a = [], r, n, s, l = i.get("logscale"), o = 0; o < e.length; o++)
    r = e[o][0], s = e[o][t], l && s !== null && (s[0] <= 0 || s[1] <= 0 || s[2] <= 0) && (s = null), s !== null ? (n = s[1], n !== null && !isNaN(n) ? a.push([r, n, [s[0], s[2]]]) : a.push([r, n, [n, n]])) : a.push([r, null, [null, null]]);
  return a;
};
We.prototype.rollingAverage = function(e, t, i) {
  t = Math.min(t, e.length);
  var a = [], r, n, s, l, o, h, u;
  for (n = 0, l = 0, s = 0, o = 0, h = 0; h < e.length; h++) {
    if (r = e[h][1], u = e[h][2], a[h] = e[h], r !== null && !isNaN(r) && (n += u[0], l += r, s += u[1], o += 1), h - t >= 0) {
      var d = e[h - t];
      d[1] !== null && !isNaN(d[1]) && (n -= d[2][0], l -= d[1], s -= d[2][1], o -= 1);
    }
    o ? a[h] = [
      e[h][0],
      1 * l / o,
      [
        1 * n / o,
        1 * s / o
      ]
    ] : a[h] = [e[h][0], null, [null, null]];
  }
  return a;
};
/**
 * @license
 * Copyright 2013 David Eberlein (david.eberlein@ch.sauter-bc.com)
 * MIT-licensed (http://opensource.org/licenses/MIT)
 */
var Be = function() {
};
Be.prototype = new fe();
Be.prototype.extractSeries = function(e, t, i) {
  for (var a = [], r, n, s, l, o, h, u = 100, d = i.get("logscale"), c = 0; c < e.length; c++)
    r = e[c][0], s = e[c][t], d && s !== null && (s[0] <= 0 || s[1] <= 0) && (s = null), s !== null ? (l = s[0], o = s[1], l !== null && !isNaN(l) ? (h = o ? l / o : 0, n = u * h, a.push([r, n, [l, o]])) : a.push([r, l, [l, o]])) : a.push([r, null, [null, null]]);
  return a;
};
Be.prototype.rollingAverage = function(e, t, i) {
  t = Math.min(t, e.length);
  var a = [], r, n = 0, s = 0, l = 100;
  for (r = 0; r < e.length; r++) {
    n += e[r][2][0], s += e[r][2][1], r - t >= 0 && (n -= e[r - t][2][0], s -= e[r - t][2][1]);
    var o = e[r][0], h = s ? n / s : 0;
    a[r] = [o, l * h];
  }
  return a;
};
/**
 * @license
 * Copyright 2013 David Eberlein (david.eberlein@ch.sauter-bc.com)
 * MIT-licensed (http://opensource.org/licenses/MIT)
 */
var Ve = function() {
};
Ve.prototype = new ee();
Ve.prototype.extractSeries = function(e, t, i) {
  for (var a = [], r, n, s, l, o, h, u, d, c = 100, p = i.get("sigma"), g = i.get("logscale"), f = 0; f < e.length; f++)
    r = e[f][0], s = e[f][t], g && s !== null && (s[0] <= 0 || s[1] <= 0) && (s = null), s !== null ? (l = s[0], o = s[1], l !== null && !isNaN(l) ? (h = o ? l / o : 0, u = o ? p * Math.sqrt(h * (1 - h) / o) : 1, d = c * u, n = c * h, a.push([r, n, [n - d, n + d, l, o]])) : a.push([r, l, [l, l, l, o]])) : a.push([r, null, [null, null, null, null]]);
  return a;
};
Ve.prototype.rollingAverage = function(e, t, i) {
  t = Math.min(t, e.length);
  var a = [], r = i.get("sigma"), n = i.get("wilsonInterval"), s, l, o, h, u = 0, d = 0, c = 100;
  for (o = 0; o < e.length; o++) {
    u += e[o][2][2], d += e[o][2][3], o - t >= 0 && (u -= e[o - t][2][2], d -= e[o - t][2][3]);
    var p = e[o][0], g = d ? u / d : 0;
    if (n)
      if (d) {
        var f = g < 0 ? 0 : g, y = d, m = r * Math.sqrt(f * (1 - f) / y + r * r / (4 * y * y)), _ = 1 + r * r / d;
        s = (f + r * r / (2 * d) - m) / _, l = (f + r * r / (2 * d) + m) / _, a[o] = [
          p,
          f * c,
          [s * c, l * c]
        ];
      } else
        a[o] = [p, 0, [0, 0]];
    else
      h = d ? r * Math.sqrt(g * (1 - g) / d) : 1, a[o] = [
        p,
        c * g,
        [c * (g - h), c * (g + h)]
      ];
  }
  return a;
};
/**
 * @license
 * Copyright 2012 Dan Vanderkam (danvdk@gmail.com)
 * MIT-licensed (http://opensource.org/licenses/MIT)
 */
var se = function() {
  this.annotations_ = [];
};
se.prototype.toString = function() {
  return "Annotations Plugin";
};
se.prototype.activate = function(e) {
  return {
    clearChart: this.clearChart,
    didDrawChart: this.didDrawChart
  };
};
se.prototype.detachLabels = function() {
  for (var e = 0; e < this.annotations_.length; e++) {
    var t = this.annotations_[e];
    t.parentNode && t.parentNode.removeChild(t), this.annotations_[e] = null;
  }
  this.annotations_ = [];
};
se.prototype.clearChart = function(e) {
  this.detachLabels();
};
se.prototype.didDrawChart = function(e) {
  var t = e.dygraph, i = t.layout_.annotated_points;
  if (!(!i || i.length === 0))
    for (var a = e.canvas.parentNode, r = function(A, T, k) {
      return function(w) {
        var M = k.annotation;
        M.hasOwnProperty(A) ? M[A](M, k, t, w) : t.getOption(T) && t.getOption(T)(M, k, t, w);
      };
    }, n = e.dygraph.getArea(), s = {}, l = 0; l < i.length; l++) {
      var o = i[l];
      if (!(o.canvasx < n.x || o.canvasx > n.x + n.w || o.canvasy < n.y || o.canvasy > n.y + n.h)) {
        var h = o.annotation, u = 6;
        h.hasOwnProperty("tickHeight") && (u = h.tickHeight);
        var d = document.createElement("div");
        d.style.fontSize = t.getOption("axisLabelFontSize") + "px";
        var c = "dygraph-annotation";
        h.hasOwnProperty("icon") || (c += " dygraphDefaultAnnotation dygraph-default-annotation"), h.hasOwnProperty("cssClass") && (c += " " + h.cssClass), d.className = c;
        var p = h.hasOwnProperty("width") ? h.width : 16, g = h.hasOwnProperty("height") ? h.height : 16;
        if (h.hasOwnProperty("icon")) {
          var f = document.createElement("img");
          f.src = h.icon, f.width = p, f.height = g, d.appendChild(f);
        } else
          o.annotation.hasOwnProperty("shortText") && d.appendChild(document.createTextNode(o.annotation.shortText));
        var y = o.canvasx - p / 2;
        d.style.left = y + "px";
        var m = 0;
        if (h.attachAtBottom) {
          var _ = n.y + n.h - g - u;
          s[y] ? _ -= s[y] : s[y] = 0, s[y] += u + g, m = _;
        } else
          m = o.canvasy - g - u;
        d.style.top = m + "px", d.style.width = p + "px", d.style.height = g + "px", d.title = o.annotation.text, d.style.color = t.colorsMap_[o.name], d.style.borderColor = t.colorsMap_[o.name], h.div = d, t.addAndTrackEvent(
          d,
          "click",
          r("clickHandler", "annotationClickHandler", o)
        ), t.addAndTrackEvent(
          d,
          "mouseover",
          r("mouseOverHandler", "annotationMouseOverHandler", o)
        ), t.addAndTrackEvent(
          d,
          "mouseout",
          r("mouseOutHandler", "annotationMouseOutHandler", o)
        ), t.addAndTrackEvent(
          d,
          "dblclick",
          r("dblClickHandler", "annotationDblClickHandler", o)
        ), a.appendChild(d), this.annotations_.push(d);
        var b = e.drawingContext;
        if (b.save(), b.strokeStyle = h.hasOwnProperty("tickColor") ? h.tickColor : t.colorsMap_[o.name], b.lineWidth = h.hasOwnProperty("tickWidth") ? h.tickWidth : t.getOption("strokeWidth"), b.beginPath(), !h.attachAtBottom)
          b.moveTo(o.canvasx, o.canvasy), b.lineTo(o.canvasx, o.canvasy - 2 - u);
        else {
          var _ = m + g;
          b.moveTo(o.canvasx, _), b.lineTo(o.canvasx, _ + u);
        }
        b.closePath(), b.stroke(), b.restore();
      }
    }
};
se.prototype.destroy = function() {
  this.detachLabels();
};
/**
 * @license
 * Copyright 2012 Dan Vanderkam (danvdk@gmail.com)
 * MIT-licensed (http://opensource.org/licenses/MIT)
 */
var oe = function() {
  this.xlabels_ = [], this.ylabels_ = [];
};
oe.prototype.toString = function() {
  return "Axes Plugin";
};
oe.prototype.activate = function(e) {
  return {
    layout: this.layout,
    clearChart: this.clearChart,
    willDrawChart: this.willDrawChart
  };
};
oe.prototype.layout = function(e) {
  var t = e.dygraph;
  if (t.getOptionForAxis("drawAxis", "y")) {
    var i = t.getOptionForAxis("axisLabelWidth", "y") + 2 * t.getOptionForAxis("axisTickSize", "y");
    e.reserveSpaceLeft(i);
  }
  if (t.getOptionForAxis("drawAxis", "x")) {
    var a;
    t.getOption("xAxisHeight") ? a = t.getOption("xAxisHeight") : a = t.getOptionForAxis("axisLabelFontSize", "x") + 2 * t.getOptionForAxis("axisTickSize", "x"), e.reserveSpaceBottom(a);
  }
  if (t.numAxes() == 2) {
    if (t.getOptionForAxis("drawAxis", "y2")) {
      var i = t.getOptionForAxis("axisLabelWidth", "y2") + 2 * t.getOptionForAxis("axisTickSize", "y2");
      e.reserveSpaceRight(i);
    }
  } else
    t.numAxes() > 2 && t.error("Only two y-axes are supported at this time. (Trying to use " + t.numAxes() + ")");
};
oe.prototype.detachLabels = function() {
  function e(t) {
    for (var i = 0; i < t.length; i++) {
      var a = t[i];
      a.parentNode && a.parentNode.removeChild(a);
    }
  }
  e(this.xlabels_), e(this.ylabels_), this.xlabels_ = [], this.ylabels_ = [];
};
oe.prototype.clearChart = function(e) {
  this.detachLabels();
};
oe.prototype.willDrawChart = function(e) {
  var t = e.dygraph;
  if (!t.getOptionForAxis("drawAxis", "x") && !t.getOptionForAxis("drawAxis", "y") && !t.getOptionForAxis("drawAxis", "y2"))
    return;
  function i(x) {
    return Math.round(x) + 0.5;
  }
  function a(x) {
    return Math.round(x) - 0.5;
  }
  var r = e.drawingContext, n = e.canvas.parentNode, s = t.width_, l = t.height_, o, h, u, d = function(x) {
    return {
      position: "absolute",
      fontSize: t.getOptionForAxis("axisLabelFontSize", x) + "px",
      width: t.getOptionForAxis("axisLabelWidth", x) + "px"
    };
  }, c = {
    x: d("x"),
    y: d("y"),
    y2: d("y2")
  }, p = function(x, C, F) {
    var Y = document.createElement("div"), V = c[F == "y2" ? "y2" : C];
    q(Y.style, V);
    var G = document.createElement("div");
    return G.className = "dygraph-axis-label dygraph-axis-label-" + C + (F ? " dygraph-axis-label-" + F : ""), G.innerHTML = x, Y.appendChild(G), Y;
  };
  r.save();
  var g = t.layout_, f = e.dygraph.plotter_.area, y = function(x) {
    return function(C) {
      return t.getOptionForAxis(C, x);
    };
  };
  if (t.getOptionForAxis("drawAxis", "y")) {
    if (g.yticks && g.yticks.length > 0) {
      var m = t.numAxes(), _ = [y("y"), y("y2")];
      g.yticks.forEach((x) => {
        if (x.label !== void 0) {
          h = f.x;
          var C = "y1", F = _[0];
          x.axis == 1 && (h = f.x + f.w, C = "y2", F = _[1]);
          var Y = F("axisLabelFontSize");
          u = f.y + x.pos * f.h, o = p(x.label, "y", m == 2 ? C : null);
          var V = u - Y / 2;
          V < 0 && (V = 0), V + Y + 3 > l ? o.style.bottom = "0" : o.style.top = V + "px", x.axis === 0 ? (o.style.left = f.x - F("axisLabelWidth") - F("axisTickSize") + "px", o.style.textAlign = "right") : x.axis == 1 && (o.style.left = f.x + f.w + F("axisTickSize") + "px", o.style.textAlign = "left"), o.style.width = F("axisLabelWidth") + "px", n.appendChild(o), this.ylabels_.push(o);
        }
      });
      var b = this.ylabels_[0], A = t.getOptionForAxis("axisLabelFontSize", "y"), T = parseInt(b.style.top, 10) + A;
      T > l - A && (b.style.top = parseInt(b.style.top, 10) - A / 2 + "px");
    }
    var k;
    if (t.getOption("drawAxesAtZero")) {
      var w = t.toPercentXCoord(0);
      (w > 1 || w < 0 || isNaN(w)) && (w = 0), k = i(f.x + w * f.w);
    } else
      k = i(f.x);
    r.strokeStyle = t.getOptionForAxis("axisLineColor", "y"), r.lineWidth = t.getOptionForAxis("axisLineWidth", "y"), r.beginPath(), r.moveTo(k, a(f.y)), r.lineTo(k, a(f.y + f.h)), r.closePath(), r.stroke(), t.numAxes() == 2 && (r.strokeStyle = t.getOptionForAxis("axisLineColor", "y2"), r.lineWidth = t.getOptionForAxis("axisLineWidth", "y2"), r.beginPath(), r.moveTo(a(f.x + f.w), a(f.y)), r.lineTo(a(f.x + f.w), a(f.y + f.h)), r.closePath(), r.stroke());
  }
  if (t.getOptionForAxis("drawAxis", "x")) {
    if (g.xticks) {
      var M = y("x");
      g.xticks.forEach((x) => {
        if (x.label !== void 0) {
          h = f.x + x.pos * f.w, u = f.y + f.h, o = p(x.label, "x"), o.style.textAlign = "center", o.style.top = u + M("axisTickSize") + "px";
          var C = h - M("axisLabelWidth") / 2;
          C + M("axisLabelWidth") > s && (C = s - M("axisLabelWidth"), o.style.textAlign = "right"), C < 0 && (C = 0, o.style.textAlign = "left"), o.style.left = C + "px", o.style.width = M("axisLabelWidth") + "px", n.appendChild(o), this.xlabels_.push(o);
        }
      });
    }
    r.strokeStyle = t.getOptionForAxis("axisLineColor", "x"), r.lineWidth = t.getOptionForAxis("axisLineWidth", "x"), r.beginPath();
    var L;
    if (t.getOption("drawAxesAtZero")) {
      var w = t.toPercentYCoord(0, 0);
      (w > 1 || w < 0) && (w = 1), L = a(f.y + w * f.h);
    } else
      L = a(f.y + f.h);
    r.moveTo(i(f.x), L), r.lineTo(i(f.x + f.w), L), r.closePath(), r.stroke();
  }
  r.restore();
};
/**
 * @license
 * Copyright 2012 Dan Vanderkam (danvdk@gmail.com)
 * MIT-licensed (http://opensource.org/licenses/MIT)
 */
var ie = function() {
  this.title_div_ = null, this.xlabel_div_ = null, this.ylabel_div_ = null, this.y2label_div_ = null;
};
ie.prototype.toString = function() {
  return "ChartLabels Plugin";
};
ie.prototype.activate = function(e) {
  return {
    layout: this.layout,
    didDrawChart: this.didDrawChart
  };
};
var gi = function(e) {
  var t = document.createElement("div");
  return t.style.position = "absolute", t.style.left = e.x + "px", t.style.top = e.y + "px", t.style.width = e.w + "px", t.style.height = e.h + "px", t;
};
ie.prototype.detachLabels_ = function() {
  for (var e = [
    this.title_div_,
    this.xlabel_div_,
    this.ylabel_div_,
    this.y2label_div_
  ], t = 0; t < e.length; t++) {
    var i = e[t];
    !i || i.parentNode && i.parentNode.removeChild(i);
  }
  this.title_div_ = null, this.xlabel_div_ = null, this.ylabel_div_ = null, this.y2label_div_ = null;
};
var vi = function(e, t, i, a, r) {
  var n = document.createElement("div");
  n.style.position = "absolute", i == 1 ? n.style.left = "0px" : n.style.left = t.x + "px", n.style.top = t.y + "px", n.style.width = t.w + "px", n.style.height = t.h + "px", n.style.fontSize = e.getOption("yLabelWidth") - 2 + "px";
  var s = document.createElement("div");
  s.style.position = "absolute", s.style.width = t.h + "px", s.style.height = t.w + "px", s.style.top = t.h / 2 - t.w / 2 + "px", s.style.left = t.w / 2 - t.h / 2 + "px", s.className = "dygraph-label-rotate-" + (i == 1 ? "right" : "left");
  var l = document.createElement("div");
  return l.className = a, l.innerHTML = r, s.appendChild(l), n.appendChild(s), n;
};
ie.prototype.layout = function(e) {
  this.detachLabels_();
  var t = e.dygraph, i = e.chart_div;
  if (t.getOption("title")) {
    var a = e.reserveSpaceTop(t.getOption("titleHeight"));
    this.title_div_ = gi(a), this.title_div_.style.fontSize = t.getOption("titleHeight") - 8 + "px";
    var r = document.createElement("div");
    r.className = "dygraph-label dygraph-title", r.innerHTML = t.getOption("title"), this.title_div_.appendChild(r), i.appendChild(this.title_div_);
  }
  if (t.getOption("xlabel")) {
    var n = e.reserveSpaceBottom(t.getOption("xLabelHeight"));
    this.xlabel_div_ = gi(n), this.xlabel_div_.style.fontSize = t.getOption("xLabelHeight") - 2 + "px";
    var r = document.createElement("div");
    r.className = "dygraph-label dygraph-xlabel", r.innerHTML = t.getOption("xlabel"), this.xlabel_div_.appendChild(r), i.appendChild(this.xlabel_div_);
  }
  if (t.getOption("ylabel")) {
    var s = e.reserveSpaceLeft(0);
    this.ylabel_div_ = vi(
      t,
      s,
      1,
      "dygraph-label dygraph-ylabel",
      t.getOption("ylabel")
    ), i.appendChild(this.ylabel_div_);
  }
  if (t.getOption("y2label") && t.numAxes() == 2) {
    var l = e.reserveSpaceRight(0);
    this.y2label_div_ = vi(
      t,
      l,
      2,
      "dygraph-label dygraph-y2label",
      t.getOption("y2label")
    ), i.appendChild(this.y2label_div_);
  }
};
ie.prototype.didDrawChart = function(e) {
  var t = e.dygraph;
  this.title_div_ && (this.title_div_.children[0].innerHTML = t.getOption("title")), this.xlabel_div_ && (this.xlabel_div_.children[0].innerHTML = t.getOption("xlabel")), this.ylabel_div_ && (this.ylabel_div_.children[0].children[0].innerHTML = t.getOption("ylabel")), this.y2label_div_ && (this.y2label_div_.children[0].children[0].innerHTML = t.getOption("y2label"));
};
ie.prototype.clearChart = function() {
};
ie.prototype.destroy = function() {
  this.detachLabels_();
};
/**
 * @license
 * Copyright 2012 Dan Vanderkam (danvdk@gmail.com)
 * MIT-licensed (http://opensource.org/licenses/MIT)
 */
var De = function() {
};
De.prototype.toString = function() {
  return "Gridline Plugin";
};
De.prototype.activate = function(e) {
  return {
    willDrawChart: this.willDrawChart
  };
};
De.prototype.willDrawChart = function(e) {
  var t = e.dygraph, i = e.drawingContext, a = t.layout_, r = e.dygraph.plotter_.area;
  function n(m) {
    return Math.round(m) + 0.5;
  }
  function s(m) {
    return Math.round(m) - 0.5;
  }
  var l, o, h, u;
  if (t.getOptionForAxis("drawGrid", "y")) {
    for (var d = ["y", "y2"], c = [], p = [], g = [], f = [], y = [], h = 0; h < d.length; h++)
      g[h] = t.getOptionForAxis("drawGrid", d[h]), g[h] && (c[h] = t.getOptionForAxis("gridLineColor", d[h]), p[h] = t.getOptionForAxis("gridLineWidth", d[h]), y[h] = t.getOptionForAxis("gridLinePattern", d[h]), f[h] = y[h] && y[h].length >= 2);
    u = a.yticks, i.save(), u.forEach((m) => {
      if (!!m.has_tick) {
        var _ = m.axis;
        g[_] && (i.save(), f[_] && i.setLineDash && i.setLineDash(y[_]), i.strokeStyle = c[_], i.lineWidth = p[_], l = n(r.x), o = s(r.y + m.pos * r.h), i.beginPath(), i.moveTo(l, o), i.lineTo(l + r.w, o), i.stroke(), i.restore());
      }
    }), i.restore();
  }
  if (t.getOptionForAxis("drawGrid", "x")) {
    u = a.xticks, i.save();
    var y = t.getOptionForAxis("gridLinePattern", "x"), f = y && y.length >= 2;
    f && i.setLineDash && i.setLineDash(y), i.strokeStyle = t.getOptionForAxis("gridLineColor", "x"), i.lineWidth = t.getOptionForAxis("gridLineWidth", "x"), u.forEach((b) => {
      !b.has_tick || (l = n(r.x + b.pos * r.w), o = s(r.y + r.h), i.beginPath(), i.moveTo(l, o), i.lineTo(l, r.y), i.closePath(), i.stroke());
    }), f && i.setLineDash && i.setLineDash([]), i.restore();
  }
};
De.prototype.destroy = function() {
};
/**
 * @license
 * Copyright 2012 Dan Vanderkam (danvdk@gmail.com)
 * MIT-licensed (http://opensource.org/licenses/MIT)
 */
var Z = function() {
  this.legend_div_ = null, this.is_generated_div_ = !1;
};
Z.prototype.toString = function() {
  return "Legend Plugin";
};
Z.prototype.activate = function(e) {
  var t, i = e.getOption("labelsDiv");
  return i && i !== null ? typeof i == "string" || i instanceof String ? t = document.getElementById(i) : t = i : (t = document.createElement("div"), t.className = "dygraph-legend", e.graphDiv.appendChild(t), this.is_generated_div_ = !0), this.legend_div_ = t, this.one_em_width_ = 10, {
    select: this.select,
    deselect: this.deselect,
    predraw: this.predraw,
    didDrawChart: this.didDrawChart
  };
};
var ma = function(e) {
  var t = document.createElement("span");
  t.setAttribute("style", "margin: 0; padding: 0 0 0 1em; border: 0;"), e.appendChild(t);
  var i = t.offsetWidth;
  return e.removeChild(t), i;
}, ba = function(e) {
  return e.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
};
Z.prototype.select = function(e) {
  var t = e.selectedX, i = e.selectedPoints, a = e.selectedRow, r = e.dygraph.getOption("legend");
  if (r === "never") {
    this.legend_div_.style.display = "none";
    return;
  }
  if (r === "follow") {
    var n = e.dygraph.plotter_.area, s = this.legend_div_.offsetWidth, l = e.dygraph.getOptionForAxis("axisLabelWidth", "y"), o = i[0].x * n.w + 50, h = i[0].y * n.h - 50;
    o + s + 1 > n.w && (o = o - 2 * 50 - s - (l - n.x)), e.dygraph.graphDiv.appendChild(this.legend_div_), this.legend_div_.style.left = l + o + "px", this.legend_div_.style.top = h + "px";
  }
  var u = Z.generateLegendHTML(e.dygraph, t, i, this.one_em_width_, a);
  this.legend_div_.innerHTML = u, this.legend_div_.style.display = "";
};
Z.prototype.deselect = function(e) {
  var t = e.dygraph.getOption("legend");
  t !== "always" && (this.legend_div_.style.display = "none");
  var i = ma(this.legend_div_);
  this.one_em_width_ = i;
  var a = Z.generateLegendHTML(e.dygraph, void 0, void 0, i, null);
  this.legend_div_.innerHTML = a;
};
Z.prototype.didDrawChart = function(e) {
  this.deselect(e);
};
Z.prototype.predraw = function(e) {
  if (!!this.is_generated_div_) {
    e.dygraph.graphDiv.appendChild(this.legend_div_);
    var t = e.dygraph.getArea(), i = this.legend_div_.offsetWidth;
    this.legend_div_.style.left = t.x + t.w - i - 1 + "px", this.legend_div_.style.top = t.y + "px";
  }
};
Z.prototype.destroy = function() {
  this.legend_div_ = null;
};
Z.generateLegendHTML = function(e, t, i, a, r) {
  var n = {
    dygraph: e,
    x: t,
    series: []
  }, s = {}, l = e.getLabels();
  if (l)
    for (var o = 1; o < l.length; o++) {
      var h = e.getPropertiesForSeries(l[o]), u = e.getOption("strokePattern", l[o]), d = {
        dashHTML: wa(u, h.color, a),
        label: l[o],
        labelHTML: ba(l[o]),
        isVisible: h.visible,
        color: h.color
      };
      n.series.push(d), s[l[o]] = d;
    }
  if (typeof t < "u") {
    var c = e.optionsViewForAxis_("x"), p = c("valueFormatter");
    n.xHTML = p.call(e, t, c, l[0], e, r, 0);
    for (var g = [], f = e.numAxes(), o = 0; o < f; o++)
      g[o] = e.optionsViewForAxis_("y" + (o ? 1 + o : ""));
    var y = e.getOption("labelsShowZeroValues"), m = e.getHighlightSeries();
    for (o = 0; o < i.length; o++) {
      var _ = i[o], d = s[_.name];
      if (d.y = _.yval, _.yval === 0 && !y || isNaN(_.canvasy)) {
        d.isVisible = !1;
        continue;
      }
      var h = e.getPropertiesForSeries(_.name), b = g[h.axis - 1], A = b("valueFormatter"), T = A.call(e, _.yval, b, _.name, e, r, l.indexOf(_.name));
      q(d, { yHTML: T }), _.name == m && (d.isHighlighted = !0);
    }
  }
  var k = e.getOption("legendFormatter") || Z.defaultFormatter;
  return k.call(e, n);
};
Z.defaultFormatter = function(e) {
  var t = e.dygraph;
  if (t.getOption("showLabelsOnHighlight") !== !0)
    return "";
  var i = t.getOption("labelsSeparateLines"), a;
  if (typeof e.x > "u") {
    if (t.getOption("legend") != "always")
      return "";
    a = "";
    for (var r = 0; r < e.series.length; r++) {
      var n = e.series[r];
      !n.isVisible || (a !== "" && (a += i ? "<br/>" : " "), a += `<span style='font-weight: bold; color: ${n.color};'>${n.dashHTML} ${n.labelHTML}</span>`);
    }
    return a;
  }
  a = e.xHTML + ":";
  for (var r = 0; r < e.series.length; r++) {
    var n = e.series[r];
    if (!!n.isVisible) {
      i && (a += "<br>");
      var s = n.isHighlighted ? ' class="highlight"' : "";
      a += `<span${s}> <b><span style='color: ${n.color};'>${n.labelHTML}</span></b>:&#160;${n.yHTML}</span>`;
    }
  }
  return a;
};
function wa(e, t, i) {
  if (!e || e.length <= 1)
    return `<div class="dygraph-legend-line" style="border-bottom-color: ${t};"></div>`;
  var a, r, n, s, l = 0, o = 0, h = [], u;
  for (a = 0; a <= e.length; a++)
    l += e[a % e.length];
  if (u = Math.floor(i / (l - e[0])), u > 1) {
    for (a = 0; a < e.length; a++)
      h[a] = e[a] / i;
    o = h.length;
  } else {
    for (u = 1, a = 0; a < e.length; a++)
      h[a] = e[a] / l;
    o = h.length + 1;
  }
  var d = "";
  for (r = 0; r < u; r++)
    for (a = 0; a < o; a += 2)
      n = h[a % h.length], a < e.length ? s = h[(a + 1) % h.length] : s = 0, d += `<div class="dygraph-legend-dash" style="margin-right: ${s}em; padding-left: ${n}em;"></div>`;
  return d;
}
/**
 * @license
 * Copyright 2011 Paul Felix (paul.eric.felix@gmail.com)
 * MIT-licensed (http://opensource.org/licenses/MIT)
 */
var R = function() {
  this.hasTouchInterface_ = typeof TouchEvent < "u", this.isMobileDevice_ = /mobile|android/gi.test(navigator.appVersion), this.interfaceCreated_ = !1;
};
R.prototype.toString = function() {
  return "RangeSelector Plugin";
};
R.prototype.activate = function(e) {
  return this.dygraph_ = e, this.getOption_("showRangeSelector") && this.createInterface_(), {
    layout: this.reserveSpace_,
    predraw: this.renderStaticLayer_,
    didDrawChart: this.renderInteractiveLayer_
  };
};
R.prototype.destroy = function() {
  this.bgcanvas_ = null, this.fgcanvas_ = null, this.leftZoomHandle_ = null, this.rightZoomHandle_ = null;
};
R.prototype.getOption_ = function(e, t) {
  return this.dygraph_.getOption(e, t);
};
R.prototype.setDefaultOption_ = function(e, t) {
  this.dygraph_.attrs_[e] = t;
};
R.prototype.createInterface_ = function() {
  this.createCanvases_(), this.createZoomHandles_(), this.initInteraction_(), this.getOption_("animatedZooms") && (console.warn("Animated zooms and range selector are not compatible; disabling animatedZooms."), this.dygraph_.updateOptions({ animatedZooms: !1 }, !0)), this.interfaceCreated_ = !0, this.addToGraph_();
};
R.prototype.addToGraph_ = function() {
  var e = this.graphDiv_ = this.dygraph_.graphDiv;
  e.appendChild(this.bgcanvas_), e.appendChild(this.fgcanvas_), e.appendChild(this.leftZoomHandle_), e.appendChild(this.rightZoomHandle_);
};
R.prototype.removeFromGraph_ = function() {
  var e = this.graphDiv_;
  e.removeChild(this.bgcanvas_), e.removeChild(this.fgcanvas_), e.removeChild(this.leftZoomHandle_), e.removeChild(this.rightZoomHandle_), this.graphDiv_ = null;
};
R.prototype.reserveSpace_ = function(e) {
  this.getOption_("showRangeSelector") && e.reserveSpaceBottom(this.getOption_("rangeSelectorHeight") + 4);
};
R.prototype.renderStaticLayer_ = function() {
  !this.updateVisibility_() || (this.resize_(), this.drawStaticLayer_());
};
R.prototype.renderInteractiveLayer_ = function() {
  !this.updateVisibility_() || this.isChangingRange_ || (this.placeZoomHandles_(), this.drawInteractiveLayer_());
};
R.prototype.updateVisibility_ = function() {
  var e = this.getOption_("showRangeSelector");
  if (e)
    this.interfaceCreated_ ? (!this.graphDiv_ || !this.graphDiv_.parentNode) && this.addToGraph_() : this.createInterface_();
  else if (this.graphDiv_) {
    this.removeFromGraph_();
    var t = this.dygraph_;
    setTimeout(function() {
      t.width_ = 0, t.resize();
    }, 1);
  }
  return e;
};
R.prototype.resize_ = function() {
  function e(r, n, s, l) {
    var o = l || kt(n);
    r.style.top = s.y + "px", r.style.left = s.x + "px", r.width = s.w * o, r.height = s.h * o, r.style.width = s.w + "px", r.style.height = s.h + "px", o != 1 && n.scale(o, o);
  }
  var t = this.dygraph_.layout_.getPlotArea(), i = 0;
  this.dygraph_.getOptionForAxis("drawAxis", "x") && (i = this.getOption_("xAxisHeight") || this.getOption_("axisLabelFontSize") + 2 * this.getOption_("axisTickSize")), this.canvasRect_ = {
    x: t.x,
    y: t.y + t.h + i + 4,
    w: t.w,
    h: this.getOption_("rangeSelectorHeight")
  };
  var a = this.dygraph_.getNumericOption("pixelRatio");
  e(this.bgcanvas_, this.bgcanvas_ctx_, this.canvasRect_, a), e(this.fgcanvas_, this.fgcanvas_ctx_, this.canvasRect_, a);
};
R.prototype.createCanvases_ = function() {
  this.bgcanvas_ = st(), this.bgcanvas_.className = "dygraph-rangesel-bgcanvas", this.bgcanvas_.style.position = "absolute", this.bgcanvas_.style.zIndex = 9, this.bgcanvas_ctx_ = rt(this.bgcanvas_), this.fgcanvas_ = st(), this.fgcanvas_.className = "dygraph-rangesel-fgcanvas", this.fgcanvas_.style.position = "absolute", this.fgcanvas_.style.zIndex = 9, this.fgcanvas_.style.cursor = "default", this.fgcanvas_ctx_ = rt(this.fgcanvas_);
};
R.prototype.createZoomHandles_ = function() {
  var e = new Image();
  e.className = "dygraph-rangesel-zoomhandle", e.style.position = "absolute", e.style.zIndex = 10, e.style.visibility = "hidden", e.style.cursor = "col-resize", e.width = 9, e.height = 16, e.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAkAAAAQCAYAAADESFVDAAAAAXNSR0IArs4c6QAAAAZiS0dEANAAzwDP4Z7KegAAAAlwSFlzAAAOxAAADsQBlSsOGwAAAAd0SU1FB9sHGw0cMqdt1UwAAAAZdEVYdENvbW1lbnQAQ3JlYXRlZCB3aXRoIEdJTVBXgQ4XAAAAaElEQVQoz+3SsRFAQBCF4Z9WJM8KCDVwownl6YXsTmCUsyKGkZzcl7zkz3YLkypgAnreFmDEpHkIwVOMfpdi9CEEN2nGpFdwD03yEqDtOgCaun7sqSTDH32I1pQA2Pb9sZecAxc5r3IAb21d6878xsAAAAAASUVORK5CYII=", this.isMobileDevice_ && (e.width *= 2, e.height *= 2), this.leftZoomHandle_ = e, this.rightZoomHandle_ = e.cloneNode(!1);
};
R.prototype.initInteraction_ = function() {
  var e = this, t = document, i = 0, a = null, r = !1, n = !1, s = !this.isMobileDevice_, l = new _t(), o, h, u, d, c, p, g, f, y, m, _, b, A, T;
  o = function(w) {
    var M = e.dygraph_.xAxisExtremes(), L = (M[1] - M[0]) / e.canvasRect_.w, x = M[0] + (w.leftHandlePos - e.canvasRect_.x) * L, C = M[0] + (w.rightHandlePos - e.canvasRect_.x) * L;
    return [x, C];
  }, h = function(w) {
    return ae(w), r = !0, i = w.clientX, a = w.target ? w.target : w.srcElement, (w.type === "mousedown" || w.type === "dragstart") && (Le(t, "mousemove", u), Le(t, "mouseup", d)), e.fgcanvas_.style.cursor = "col-resize", l.cover(), !0;
  }, u = function(w) {
    if (!r)
      return !1;
    ae(w);
    var M = w.clientX - i;
    if (Math.abs(M) < 4)
      return !0;
    i = w.clientX;
    var L = e.getZoomHandleStatus_(), x;
    a == e.leftZoomHandle_ ? (x = L.leftHandlePos + M, x = Math.min(x, L.rightHandlePos - a.width - 3), x = Math.max(x, e.canvasRect_.x)) : (x = L.rightHandlePos + M, x = Math.min(x, e.canvasRect_.x + e.canvasRect_.w), x = Math.max(x, L.leftHandlePos + a.width + 3));
    var C = a.width / 2;
    return a.style.left = x - C + "px", e.drawInteractiveLayer_(), s && c(), !0;
  }, d = function(w) {
    return r ? (r = !1, l.uncover(), K(t, "mousemove", u), K(t, "mouseup", d), e.fgcanvas_.style.cursor = "default", s || c(), !0) : !1;
  }, c = function() {
    try {
      var w = e.getZoomHandleStatus_();
      if (e.isChangingRange_ = !0, !w.isZoomed)
        e.dygraph_.resetZoom();
      else {
        var M = o(w);
        e.dygraph_.doZoomXDates_(M[0], M[1]);
      }
    } finally {
      e.isChangingRange_ = !1;
    }
  }, p = function(w) {
    var M = e.leftZoomHandle_.getBoundingClientRect(), L = M.left + M.width / 2;
    M = e.rightZoomHandle_.getBoundingClientRect();
    var x = M.left + M.width / 2;
    return w.clientX > L && w.clientX < x;
  }, g = function(w) {
    return !n && p(w) && e.getZoomHandleStatus_().isZoomed ? (ae(w), n = !0, i = w.clientX, w.type === "mousedown" && (Le(t, "mousemove", f), Le(t, "mouseup", y)), !0) : !1;
  }, f = function(w) {
    if (!n)
      return !1;
    ae(w);
    var M = w.clientX - i;
    if (Math.abs(M) < 4)
      return !0;
    i = w.clientX;
    var L = e.getZoomHandleStatus_(), x = L.leftHandlePos, C = L.rightHandlePos, F = C - x;
    x + M <= e.canvasRect_.x ? (x = e.canvasRect_.x, C = x + F) : C + M >= e.canvasRect_.x + e.canvasRect_.w ? (C = e.canvasRect_.x + e.canvasRect_.w, x = C - F) : (x += M, C += M);
    var Y = e.leftZoomHandle_.width / 2;
    return e.leftZoomHandle_.style.left = x - Y + "px", e.rightZoomHandle_.style.left = C - Y + "px", e.drawInteractiveLayer_(), s && m(), !0;
  }, y = function(w) {
    return n ? (n = !1, K(t, "mousemove", f), K(t, "mouseup", y), s || m(), !0) : !1;
  }, m = function() {
    try {
      e.isChangingRange_ = !0, e.dygraph_.dateWindow_ = o(e.getZoomHandleStatus_()), e.dygraph_.drawGraph_(!1);
    } finally {
      e.isChangingRange_ = !1;
    }
  }, _ = function(w) {
    if (!(r || n)) {
      var M = p(w) ? "move" : "default";
      M != e.fgcanvas_.style.cursor && (e.fgcanvas_.style.cursor = M);
    }
  }, b = function(w) {
    w.type == "touchstart" && w.targetTouches.length == 1 ? h(w.targetTouches[0]) && ae(w) : w.type == "touchmove" && w.targetTouches.length == 1 ? u(w.targetTouches[0]) && ae(w) : d(w);
  }, A = function(w) {
    w.type == "touchstart" && w.targetTouches.length == 1 ? g(w.targetTouches[0]) && ae(w) : w.type == "touchmove" && w.targetTouches.length == 1 ? f(w.targetTouches[0]) && ae(w) : y(w);
  }, T = function(w, M) {
    for (var L = ["touchstart", "touchend", "touchmove", "touchcancel"], x = 0; x < L.length; x++)
      e.dygraph_.addAndTrackEvent(w, L[x], M);
  }, this.setDefaultOption_("interactionModel", S.dragIsPanInteractionModel), this.setDefaultOption_("panEdgeFraction", 1e-4);
  var k = window.opera ? "mousedown" : "dragstart";
  this.dygraph_.addAndTrackEvent(this.leftZoomHandle_, k, h), this.dygraph_.addAndTrackEvent(this.rightZoomHandle_, k, h), this.dygraph_.addAndTrackEvent(this.fgcanvas_, "mousedown", g), this.dygraph_.addAndTrackEvent(this.fgcanvas_, "mousemove", _), this.hasTouchInterface_ && (T(this.leftZoomHandle_, b), T(this.rightZoomHandle_, b), T(this.fgcanvas_, A));
};
R.prototype.drawStaticLayer_ = function() {
  var e = this.bgcanvas_ctx_;
  e.clearRect(0, 0, this.canvasRect_.w, this.canvasRect_.h);
  try {
    this.drawMiniPlot_();
  } catch (i) {
    console.warn(i);
  }
  var t = 0.5;
  this.bgcanvas_ctx_.lineWidth = this.getOption_("rangeSelectorBackgroundLineWidth"), e.strokeStyle = this.getOption_("rangeSelectorBackgroundStrokeColor"), e.beginPath(), e.moveTo(t, t), e.lineTo(t, this.canvasRect_.h - t), e.lineTo(this.canvasRect_.w - t, this.canvasRect_.h - t), e.lineTo(this.canvasRect_.w - t, t), e.stroke();
};
R.prototype.drawMiniPlot_ = function() {
  var e = this.getOption_("rangeSelectorPlotFillColor"), t = this.getOption_("rangeSelectorPlotFillGradientColor"), i = this.getOption_("rangeSelectorPlotStrokeColor");
  if (!(!e && !i)) {
    var a = this.getOption_("stepPlot"), r = this.computeCombinedSeriesAndLimits_(), n = r.yMax - r.yMin, s = this.bgcanvas_ctx_, l = 0.5, o = this.dygraph_.xAxisExtremes(), h = Math.max(o[1] - o[0], 1e-30), u = (this.canvasRect_.w - l) / h, d = (this.canvasRect_.h - l) / n, c = this.canvasRect_.w - l, p = this.canvasRect_.h - l, g = null, f = null;
    s.beginPath(), s.moveTo(l, p);
    for (var y = 0; y < r.data.length; y++) {
      var m = r.data[y], _ = m[0] !== null ? (m[0] - o[0]) * u : NaN, b = m[1] !== null ? p - (m[1] - r.yMin) * d : NaN;
      !a && g !== null && Math.round(_) == Math.round(g) || (isFinite(_) && isFinite(b) ? (g === null ? s.lineTo(_, p) : a && s.lineTo(_, f), s.lineTo(_, b), g = _, f = b) : (g !== null && (a ? (s.lineTo(_, f), s.lineTo(_, p)) : s.lineTo(g, p)), g = f = null));
    }
    if (s.lineTo(c, p), s.closePath(), e) {
      var A = this.bgcanvas_ctx_.createLinearGradient(0, 0, 0, p);
      t && A.addColorStop(0, t), A.addColorStop(1, e), this.bgcanvas_ctx_.fillStyle = A, s.fill();
    }
    i && (this.bgcanvas_ctx_.strokeStyle = i, this.bgcanvas_ctx_.lineWidth = this.getOption_("rangeSelectorPlotLineWidth"), s.stroke());
  }
};
R.prototype.computeCombinedSeriesAndLimits_ = function() {
  var e = this.dygraph_, t = this.getOption_("logscale"), i, a = e.numColumns(), r = e.getLabels(), n = new Array(a), s = !1, l = e.visibility(), o = [];
  for (i = 1; i < a; i++) {
    var h = this.getOption_("showInRangeSelector", r[i]);
    o.push(h), h !== null && (s = !0);
  }
  if (s)
    for (i = 1; i < a; i++)
      n[i] = o[i - 1];
  else
    for (i = 1; i < a; i++)
      n[i] = l[i - 1];
  var u = [], d = e.dataHandler_, c = e.attributes_;
  for (i = 1; i < e.numColumns(); i++)
    if (!!n[i]) {
      var p = d.extractSeries(e.rawData_, i, c);
      e.rollPeriod() > 1 && (p = d.rollingAverage(p, e.rollPeriod(), c)), u.push(p);
    }
  var g = [];
  for (i = 0; i < u[0].length; i++) {
    for (var f = 0, y = 0, m = 0; m < u.length; m++) {
      var _ = u[m][i][1];
      _ === null || isNaN(_) || (y++, f += _);
    }
    g.push([u[0][i][0], f / y]);
  }
  var b = Number.MAX_VALUE, A = -Number.MAX_VALUE;
  for (i = 0; i < g.length; i++) {
    var T = g[i][1];
    T !== null && isFinite(T) && (!t || T > 0) && (b = Math.min(b, T), A = Math.max(A, T));
  }
  var k = 0.25;
  if (t)
    for (A = P(A), A += A * k, b = P(b), i = 0; i < g.length; i++)
      g[i][1] = P(g[i][1]);
  else {
    var w, M = A - b;
    M <= Number.MIN_VALUE ? w = A * k : w = M * k, A += w, b -= w;
  }
  return { data: g, yMin: b, yMax: A };
};
R.prototype.placeZoomHandles_ = function() {
  var e = this.dygraph_.xAxisExtremes(), t = this.dygraph_.xAxisRange(), i = e[1] - e[0], a = Math.max(0, (t[0] - e[0]) / i), r = Math.max(0, (e[1] - t[1]) / i), n = this.canvasRect_.x + this.canvasRect_.w * a, s = this.canvasRect_.x + this.canvasRect_.w * (1 - r), l = Math.max(this.canvasRect_.y, this.canvasRect_.y + (this.canvasRect_.h - this.leftZoomHandle_.height) / 2), o = this.leftZoomHandle_.width / 2;
  this.leftZoomHandle_.style.left = n - o + "px", this.leftZoomHandle_.style.top = l + "px", this.rightZoomHandle_.style.left = s - o + "px", this.rightZoomHandle_.style.top = this.leftZoomHandle_.style.top, this.leftZoomHandle_.style.visibility = "visible", this.rightZoomHandle_.style.visibility = "visible";
};
R.prototype.drawInteractiveLayer_ = function() {
  var e = this.fgcanvas_ctx_;
  e.clearRect(0, 0, this.canvasRect_.w, this.canvasRect_.h);
  var t = 1, i = this.canvasRect_.w - t, a = this.canvasRect_.h - t, r = this.getZoomHandleStatus_();
  if (e.strokeStyle = this.getOption_("rangeSelectorForegroundStrokeColor"), e.lineWidth = this.getOption_("rangeSelectorForegroundLineWidth"), !r.isZoomed)
    e.beginPath(), e.moveTo(t, t), e.lineTo(t, a), e.lineTo(i, a), e.lineTo(i, t), e.stroke();
  else {
    var n = Math.max(t, r.leftHandlePos - this.canvasRect_.x), s = Math.min(i, r.rightHandlePos - this.canvasRect_.x);
    e.fillStyle = "rgba(240, 240, 240, " + this.getOption_("rangeSelectorAlpha").toString() + ")", e.fillRect(0, 0, n, this.canvasRect_.h), e.fillRect(s, 0, this.canvasRect_.w - s, this.canvasRect_.h), e.beginPath(), e.moveTo(t, t), e.lineTo(n, t), e.lineTo(n, a), e.lineTo(s, a), e.lineTo(s, t), e.lineTo(i, t), e.stroke();
  }
};
R.prototype.getZoomHandleStatus_ = function() {
  var e = this.leftZoomHandle_.width / 2, t = parseFloat(this.leftZoomHandle_.style.left) + e, i = parseFloat(this.rightZoomHandle_.style.left) + e;
  return {
    leftHandlePos: t,
    rightHandlePos: i,
    isZoomed: t - 1 > this.canvasRect_.x || i + 1 < this.canvasRect_.x + this.canvasRect_.w
  };
};
/**
 * @license
 * Copyright 2011 Dan Vanderkam (danvdk@gmail.com)
 * MIT-licensed (http://opensource.org/licenses/MIT)
 */
var mt = function(e) {
  this.container = e;
};
mt.prototype.draw = function(e, t) {
  this.container.innerHTML = "", typeof this.date_graph < "u" && this.date_graph.destroy(), this.date_graph = new v(this.container, e, t);
};
mt.prototype.setSelection = function(e) {
  var t = !1;
  e.length && (t = e[0].row), this.date_graph.setSelection(t);
};
mt.prototype.getSelection = function() {
  var e = [], t = this.date_graph.getSelection();
  if (t < 0)
    return e;
  for (var i = this.date_graph.layout_.points, a = 0; a < i.length; ++a)
    e.push({ row: t, column: a + 1 });
  return e;
};
/**
 * @license
 * Copyright 2006 Dan Vanderkam (danvdk@gmail.com)
 * MIT-licensed (http://opensource.org/licenses/MIT)
 */
var v = function(e, t, i) {
  this.__init__(e, t, i);
};
v.NAME = "Dygraph";
v.VERSION = "2.0.0";
v.DEFAULT_ROLL_PERIOD = 1;
v.DEFAULT_WIDTH = 480;
v.DEFAULT_HEIGHT = 320;
v.ANIMATION_STEPS = 12;
v.ANIMATION_DURATION = 200;
v.Plotters = N._Plotters;
v.addedAnnotationCSS = !1;
v.prototype.__init__ = function(e, t, i) {
  if (this.is_initial_draw_ = !0, this.readyFns_ = [], i == null && (i = {}), i = v.copyUserAttrs_(i), typeof e == "string" && (e = document.getElementById(e)), !e)
    throw new Error("Constructing dygraph with a non-existent div!");
  this.maindiv_ = e, this.file_ = t, this.rollPeriod_ = i.rollPeriod || v.DEFAULT_ROLL_PERIOD, this.previousVerticalX_ = -1, this.fractions_ = i.fractions || !1, this.dateWindow_ = i.dateWindow || null, this.annotations_ = [], e.innerHTML = "", e.style.width === "" && i.width && (e.style.width = i.width + "px"), e.style.height === "" && i.height && (e.style.height = i.height + "px"), e.style.height === "" && e.clientHeight === 0 && (e.style.height = v.DEFAULT_HEIGHT + "px", e.style.width === "" && (e.style.width = v.DEFAULT_WIDTH + "px")), this.width_ = e.clientWidth || i.width || 0, this.height_ = e.clientHeight || i.height || 0, i.stackedGraph && (i.fillGraph = !0), this.user_attrs_ = {}, q(this.user_attrs_, i), this.attrs_ = {}, Wt(this.attrs_, ot), this.boundaryIds_ = [], this.setIndexByName_ = {}, this.datasetIndex_ = [], this.registeredEvents_ = [], this.eventListeners_ = {}, this.attributes_ = new z(this), this.createInterface_(), this.plugins_ = [];
  for (var a = v.PLUGINS.concat(this.getOption("plugins")), r = 0; r < a.length; r++) {
    var n = a[r], s;
    typeof n.activate < "u" ? s = n : s = new n();
    var l = {
      plugin: s,
      events: {},
      options: {},
      pluginOptions: {}
    }, o = s.activate(this);
    for (var h in o)
      !o.hasOwnProperty(h) || (l.events[h] = o[h]);
    this.plugins_.push(l);
  }
  for (var r = 0; r < this.plugins_.length; r++) {
    var u = this.plugins_[r];
    for (var h in u.events)
      if (!!u.events.hasOwnProperty(h)) {
        var d = u.events[h], c = [u.plugin, d];
        h in this.eventListeners_ ? this.eventListeners_[h].push(c) : this.eventListeners_[h] = [c];
      }
  }
  this.createDragInterface_(), this.start_();
};
v.prototype.cascadeEvents_ = function(e, t) {
  if (!(e in this.eventListeners_))
    return !1;
  var i = {
    dygraph: this,
    cancelable: !1,
    defaultPrevented: !1,
    preventDefault: function() {
      if (!i.cancelable)
        throw "Cannot call preventDefault on non-cancelable event.";
      i.defaultPrevented = !0;
    },
    propagationStopped: !1,
    stopPropagation: function() {
      i.propagationStopped = !0;
    }
  };
  q(i, t);
  var a = this.eventListeners_[e];
  if (a)
    for (var r = a.length - 1; r >= 0; r--) {
      var n = a[r][0], s = a[r][1];
      if (s.call(n, i), i.propagationStopped)
        break;
    }
  return i.defaultPrevented;
};
v.prototype.getPluginInstance_ = function(e) {
  for (var t = 0; t < this.plugins_.length; t++) {
    var i = this.plugins_[t];
    if (i.plugin instanceof e)
      return i.plugin;
  }
  return null;
};
v.prototype.isZoomed = function(e) {
  const t = !!this.dateWindow_;
  if (e === "x")
    return t;
  const i = this.axes_.map((a) => !!a.valueRange).indexOf(!0) >= 0;
  if (e == null)
    return t || i;
  if (e === "y")
    return i;
  throw new Error(`axis parameter is [${e}] must be null, 'x' or 'y'.`);
};
v.prototype.toString = function() {
  var e = this.maindiv_, t = e && e.id ? e.id : e;
  return "[Dygraph " + t + "]";
};
v.prototype.attr_ = function(e, t) {
  return typeof process < "u" && process.env.NODE_ENV != "production" && (typeof Ie > "u" ? console.error("Must include options reference JS for testing") : Ie.hasOwnProperty(e) || (console.error("Dygraphs is using property " + e + ", which has no entry in the Dygraphs.OPTIONS_REFERENCE listing."), Ie[e] = !0)), t ? this.attributes_.getForSeries(e, t) : this.attributes_.get(e);
};
v.prototype.getOption = function(e, t) {
  return this.attr_(e, t);
};
v.prototype.getNumericOption = function(e, t) {
  return this.getOption(e, t);
};
v.prototype.getStringOption = function(e, t) {
  return this.getOption(e, t);
};
v.prototype.getBooleanOption = function(e, t) {
  return this.getOption(e, t);
};
v.prototype.getFunctionOption = function(e, t) {
  return this.getOption(e, t);
};
v.prototype.getOptionForAxis = function(e, t) {
  return this.attributes_.getForAxis(e, t);
};
v.prototype.optionsViewForAxis_ = function(e) {
  var t = this;
  return function(i) {
    var a = t.user_attrs_.axes;
    return a && a[e] && a[e].hasOwnProperty(i) ? a[e][i] : e === "x" && i === "logscale" ? !1 : typeof t.user_attrs_[i] < "u" ? t.user_attrs_[i] : (a = t.attrs_.axes, a && a[e] && a[e].hasOwnProperty(i) ? a[e][i] : e == "y" && t.axes_[0].hasOwnProperty(i) ? t.axes_[0][i] : e == "y2" && t.axes_[1].hasOwnProperty(i) ? t.axes_[1][i] : t.attr_(i));
  };
};
v.prototype.rollPeriod = function() {
  return this.rollPeriod_;
};
v.prototype.xAxisRange = function() {
  return this.dateWindow_ ? this.dateWindow_ : this.xAxisExtremes();
};
v.prototype.xAxisExtremes = function() {
  var e = this.getNumericOption("xRangePad") / this.plotter_.area.w;
  if (this.numRows() === 0)
    return [0 - e, 1 + e];
  var t = this.rawData_[0][0], i = this.rawData_[this.rawData_.length - 1][0];
  if (e) {
    var a = i - t;
    t -= a * e, i += a * e;
  }
  return [t, i];
};
v.prototype.yAxisExtremes = function() {
  const e = this.gatherDatasets_(this.rolledSeries_, null), { extremes: t } = e, i = this.axes_;
  this.computeYAxisRanges_(t);
  const a = this.axes_;
  return this.axes_ = i, a.map((r) => r.extremeRange);
};
v.prototype.yAxisRange = function(e) {
  if (typeof e > "u" && (e = 0), e < 0 || e >= this.axes_.length)
    return null;
  var t = this.axes_[e];
  return [t.computedValueRange[0], t.computedValueRange[1]];
};
v.prototype.yAxisRanges = function() {
  for (var e = [], t = 0; t < this.axes_.length; t++)
    e.push(this.yAxisRange(t));
  return e;
};
v.prototype.toDomCoords = function(e, t, i) {
  return [this.toDomXCoord(e), this.toDomYCoord(t, i)];
};
v.prototype.toDomXCoord = function(e) {
  if (e === null)
    return null;
  var t = this.plotter_.area, i = this.xAxisRange();
  return t.x + (e - i[0]) / (i[1] - i[0]) * t.w;
};
v.prototype.toDomYCoord = function(e, t) {
  var i = this.toPercentYCoord(e, t);
  if (i === null)
    return null;
  var a = this.plotter_.area;
  return a.y + i * a.h;
};
v.prototype.toDataCoords = function(e, t, i) {
  return [this.toDataXCoord(e), this.toDataYCoord(t, i)];
};
v.prototype.toDataXCoord = function(e) {
  if (e === null)
    return null;
  var t = this.plotter_.area, i = this.xAxisRange();
  if (this.attributes_.getForAxis("logscale", "x")) {
    var a = (e - t.x) / t.w;
    return tt(i[0], i[1], a);
  } else
    return i[0] + (e - t.x) / t.w * (i[1] - i[0]);
};
v.prototype.toDataYCoord = function(e, t) {
  if (e === null)
    return null;
  var i = this.plotter_.area, a = this.yAxisRange(t);
  if (typeof t > "u" && (t = 0), this.attributes_.getForAxis("logscale", t)) {
    var r = (e - i.y) / i.h;
    return tt(a[1], a[0], r);
  } else
    return a[0] + (i.y + i.h - e) / i.h * (a[1] - a[0]);
};
v.prototype.toPercentYCoord = function(e, t) {
  if (e === null)
    return null;
  typeof t > "u" && (t = 0);
  var i = this.yAxisRange(t), a, r = this.attributes_.getForAxis("logscale", t);
  if (r) {
    var n = P(i[0]), s = P(i[1]);
    a = (s - P(e)) / (s - n);
  } else
    a = (i[1] - e) / (i[1] - i[0]);
  return a;
};
v.prototype.toPercentXCoord = function(e) {
  if (e === null)
    return null;
  var t = this.xAxisRange(), i, a = this.attributes_.getForAxis("logscale", "x");
  if (a === !0) {
    var r = P(t[0]), n = P(t[1]);
    i = (P(e) - r) / (n - r);
  } else
    i = (e - t[0]) / (t[1] - t[0]);
  return i;
};
v.prototype.numColumns = function() {
  return this.rawData_ ? this.rawData_[0] ? this.rawData_[0].length : this.attr_("labels").length : 0;
};
v.prototype.numRows = function() {
  return this.rawData_ ? this.rawData_.length : 0;
};
v.prototype.getValue = function(e, t) {
  return e < 0 || e > this.rawData_.length || t < 0 || t > this.rawData_[e].length ? null : this.rawData_[e][t];
};
v.prototype.createInterface_ = function() {
  var e = this.maindiv_;
  this.graphDiv = document.createElement("div"), this.graphDiv.style.textAlign = "left", this.graphDiv.style.position = "relative", e.appendChild(this.graphDiv), this.canvas_ = st(), this.canvas_.style.position = "absolute", this.hidden_ = this.createPlotKitCanvas_(this.canvas_), this.canvas_ctx_ = rt(this.canvas_), this.hidden_ctx_ = rt(this.hidden_), this.resizeElements_(), this.graphDiv.appendChild(this.hidden_), this.graphDiv.appendChild(this.canvas_), this.mouseEventElement_ = this.createMouseEventElement_(), this.layout_ = new H(this);
  var t = this;
  this.mouseMoveHandler_ = function(i) {
    t.mouseMove_(i);
  }, this.mouseOutHandler_ = function(i) {
    var a = i.target || i.fromElement, r = i.relatedTarget || i.toElement;
    li(a, t.graphDiv) && !li(r, t.graphDiv) && t.mouseOut_(i);
  }, this.addAndTrackEvent(window, "mouseout", this.mouseOutHandler_), this.addAndTrackEvent(this.mouseEventElement_, "mousemove", this.mouseMoveHandler_), this.resizeHandler_ || (this.resizeHandler_ = function(i) {
    t.resize();
  }, this.addAndTrackEvent(window, "resize", this.resizeHandler_));
};
v.prototype.resizeElements_ = function() {
  this.graphDiv.style.width = this.width_ + "px", this.graphDiv.style.height = this.height_ + "px";
  var e = this.getNumericOption("pixelRatio"), t = e || kt(this.canvas_ctx_);
  this.canvas_.width = this.width_ * t, this.canvas_.height = this.height_ * t, this.canvas_.style.width = this.width_ + "px", this.canvas_.style.height = this.height_ + "px", t !== 1 && this.canvas_ctx_.scale(t, t);
  var i = e || kt(this.hidden_ctx_);
  this.hidden_.width = this.width_ * i, this.hidden_.height = this.height_ * i, this.hidden_.style.width = this.width_ + "px", this.hidden_.style.height = this.height_ + "px", i !== 1 && this.hidden_ctx_.scale(i, i);
};
v.prototype.destroy = function() {
  this.canvas_ctx_.restore(), this.hidden_ctx_.restore();
  for (var e = this.plugins_.length - 1; e >= 0; e--) {
    var t = this.plugins_.pop();
    t.plugin.destroy && t.plugin.destroy();
  }
  var i = function(r) {
    for (; r.hasChildNodes(); )
      i(r.firstChild), r.removeChild(r.firstChild);
  };
  this.removeTrackedEvents_(), K(window, "mouseout", this.mouseOutHandler_), K(this.mouseEventElement_, "mousemove", this.mouseMoveHandler_), K(window, "resize", this.resizeHandler_), this.resizeHandler_ = null, i(this.maindiv_);
  var a = function(r) {
    for (var n in r)
      typeof r[n] == "object" && (r[n] = null);
  };
  a(this.layout_), a(this.plotter_), a(this);
};
v.prototype.createPlotKitCanvas_ = function(e) {
  var t = st();
  return t.style.position = "absolute", t.style.top = e.style.top, t.style.left = e.style.left, t.width = this.width_, t.height = this.height_, t.style.width = this.width_ + "px", t.style.height = this.height_ + "px", t;
};
v.prototype.createMouseEventElement_ = function() {
  return this.canvas_;
};
v.prototype.setColors_ = function() {
  var e = this.getLabels(), t = e.length - 1;
  this.colors_ = [], this.colorsMap_ = {};
  for (var i = this.getNumericOption("colorSaturation") || 1, a = this.getNumericOption("colorValue") || 0.5, r = Math.ceil(t / 2), n = this.getOption("colors"), s = this.visibility(), l = 0; l < t; l++)
    if (!!s[l]) {
      var o = e[l + 1], h = this.attributes_.getForSeries("color", o);
      if (!h)
        if (n)
          h = n[l % n.length];
        else {
          var u = l % 2 ? r + (l + 1) / 2 : Math.ceil((l + 1) / 2), d = 1 * u / (1 + t);
          h = la(d, i, a);
        }
      this.colors_.push(h), this.colorsMap_[o] = h;
    }
};
v.prototype.getColors = function() {
  return this.colors_;
};
v.prototype.getPropertiesForSeries = function(e) {
  for (var t = -1, i = this.getLabels(), a = 1; a < i.length; a++)
    if (i[a] == e) {
      t = a;
      break;
    }
  return t == -1 ? null : {
    name: e,
    column: t,
    visible: this.visibility()[t - 1],
    color: this.colorsMap_[e],
    axis: 1 + this.attributes_.axisForSeries(e)
  };
};
v.prototype.createRollInterface_ = function() {
  var e = this.roller_;
  e || (this.roller_ = e = document.createElement("input"), e.type = "text", e.style.display = "none", e.className = "dygraph-roller", this.graphDiv.appendChild(e));
  var t = this.getBooleanOption("showRoller") ? "block" : "none", i = this.getArea(), a = {
    top: i.y + i.h - 25 + "px",
    left: i.x + 1 + "px",
    display: t
  };
  e.size = "2", e.value = this.rollPeriod_, q(e.style, a), e.onchange = () => this.adjustRoll(e.value);
};
v.prototype.createDragInterface_ = function() {
  var e = {
    isZooming: !1,
    isPanning: !1,
    is2DPan: !1,
    dragStartX: null,
    dragStartY: null,
    dragEndX: null,
    dragEndY: null,
    dragDirection: null,
    prevEndX: null,
    prevEndY: null,
    prevDragDirection: null,
    cancelNextDblclick: !1,
    initialLeftmostDate: null,
    xUnitsPerPixel: null,
    dateRange: null,
    px: 0,
    py: 0,
    boundedDates: null,
    boundedValues: null,
    tarp: new _t(),
    initializeMouseDown: function(s, l, o) {
      s.preventDefault ? s.preventDefault() : (s.returnValue = !1, s.cancelBubble = !0);
      var h = ze(l.canvas_);
      o.px = h.x, o.py = h.y, o.dragStartX = ft(s, o), o.dragStartY = gt(s, o), o.cancelNextDblclick = !1, o.tarp.cover();
    },
    destroy: function() {
      var s = this;
      if ((s.isZooming || s.isPanning) && (s.isZooming = !1, s.dragStartX = null, s.dragStartY = null), s.isPanning) {
        s.isPanning = !1, s.draggingDate = null, s.dateRange = null;
        for (var l = 0; l < i.axes_.length; l++)
          delete i.axes_[l].draggingValue, delete i.axes_[l].dragValueRange;
      }
      s.tarp.uncover();
    }
  }, t = this.getOption("interactionModel"), i = this, a = function(s) {
    return function(l) {
      s(l, i, e);
    };
  };
  for (var r in t)
    !t.hasOwnProperty(r) || this.addAndTrackEvent(
      this.mouseEventElement_,
      r,
      a(t[r])
    );
  if (!t.willDestroyContextMyself) {
    var n = function(s) {
      e.destroy();
    };
    this.addAndTrackEvent(document, "mouseup", n);
  }
};
v.prototype.drawZoomRect_ = function(e, t, i, a, r, n, s, l) {
  var o = this.canvas_ctx_;
  n == it ? o.clearRect(
    Math.min(t, s),
    this.layout_.getPlotArea().y,
    Math.abs(t - s),
    this.layout_.getPlotArea().h
  ) : n == at && o.clearRect(
    this.layout_.getPlotArea().x,
    Math.min(a, l),
    this.layout_.getPlotArea().w,
    Math.abs(a - l)
  ), e == it ? i && t && (o.fillStyle = "rgba(128,128,128,0.33)", o.fillRect(
    Math.min(t, i),
    this.layout_.getPlotArea().y,
    Math.abs(i - t),
    this.layout_.getPlotArea().h
  )) : e == at && r && a && (o.fillStyle = "rgba(128,128,128,0.33)", o.fillRect(
    this.layout_.getPlotArea().x,
    Math.min(a, r),
    this.layout_.getPlotArea().w,
    Math.abs(r - a)
  ));
};
v.prototype.clearZoomRect_ = function() {
  this.currentZoomRectArgs_ = null, this.canvas_ctx_.clearRect(0, 0, this.width_, this.height_);
};
v.prototype.doZoomX_ = function(e, t) {
  this.currentZoomRectArgs_ = null;
  var i = this.toDataXCoord(e), a = this.toDataXCoord(t);
  this.doZoomXDates_(i, a);
};
v.prototype.doZoomXDates_ = function(e, t) {
  var i = this.xAxisRange(), a = [e, t];
  const r = this.getFunctionOption("zoomCallback");
  this.doAnimatedZoom(i, a, null, null, () => {
    r && r.call(this, e, t, this.yAxisRanges());
  });
};
v.prototype.doZoomY_ = function(e, t) {
  this.currentZoomRectArgs_ = null;
  for (var i = this.yAxisRanges(), a = [], r = 0; r < this.axes_.length; r++) {
    var n = this.toDataYCoord(e, r), s = this.toDataYCoord(t, r);
    a.push([s, n]);
  }
  const l = this.getFunctionOption("zoomCallback");
  this.doAnimatedZoom(null, null, i, a, () => {
    if (l) {
      const [o, h] = this.xAxisRange();
      l.call(this, o, h, this.yAxisRanges());
    }
  });
};
v.zoomAnimationFunction = function(e, t) {
  var i = 1.5;
  return (1 - Math.pow(i, -e)) / (1 - Math.pow(i, -t));
};
v.prototype.resetZoom = function() {
  const e = this.isZoomed("x"), t = this.isZoomed("y"), i = e || t;
  if (this.clearSelection(), !i)
    return;
  const [a, r] = this.xAxisExtremes(), n = this.getBooleanOption("animatedZooms"), s = this.getFunctionOption("zoomCallback");
  if (!n) {
    this.dateWindow_ = null, this.axes_.forEach((d) => {
      d.valueRange && delete d.valueRange;
    }), this.drawGraph_(), s && s.call(this, a, r, this.yAxisRanges());
    return;
  }
  var l = null, o = null, h = null, u = null;
  e && (l = this.xAxisRange(), o = [a, r]), t && (h = this.yAxisRanges(), u = this.yAxisExtremes()), this.doAnimatedZoom(
    l,
    o,
    h,
    u,
    () => {
      this.dateWindow_ = null, this.axes_.forEach((d) => {
        d.valueRange && delete d.valueRange;
      }), s && s.call(this, a, r, this.yAxisRanges());
    }
  );
};
v.prototype.doAnimatedZoom = function(e, t, i, a, r) {
  var n = this.getBooleanOption("animatedZooms") ? v.ANIMATION_STEPS : 1, s = [], l = [], o, h;
  if (e !== null && t !== null)
    for (o = 1; o <= n; o++)
      h = v.zoomAnimationFunction(o, n), s[o - 1] = [
        e[0] * (1 - h) + h * t[0],
        e[1] * (1 - h) + h * t[1]
      ];
  if (i !== null && a !== null)
    for (o = 1; o <= n; o++) {
      h = v.zoomAnimationFunction(o, n);
      for (var u = [], d = 0; d < this.axes_.length; d++)
        u.push([
          i[d][0] * (1 - h) + h * a[d][0],
          i[d][1] * (1 - h) + h * a[d][1]
        ]);
      l[o - 1] = u;
    }
  Ii((c) => {
    if (l.length)
      for (var p = 0; p < this.axes_.length; p++) {
        var g = l[c][p];
        this.axes_[p].valueRange = [g[0], g[1]];
      }
    s.length && (this.dateWindow_ = s[c]), this.drawGraph_();
  }, n, v.ANIMATION_DURATION / n, r);
};
v.prototype.getArea = function() {
  return this.plotter_.area;
};
v.prototype.eventToDomCoords = function(e) {
  if (e.offsetX && e.offsetY)
    return [e.offsetX, e.offsetY];
  var t = ze(this.mouseEventElement_), i = ut(e) - t.x, a = pt(e) - t.y;
  return [i, a];
};
v.prototype.findClosestRow = function(e) {
  for (var t = 1 / 0, i = -1, a = this.layout_.points, r = 0; r < a.length; r++)
    for (var n = a[r], s = n.length, l = 0; l < s; l++) {
      var o = n[l];
      if (!!Ne(o, !0)) {
        var h = Math.abs(o.canvasx - e);
        h < t && (t = h, i = o.idx);
      }
    }
  return i;
};
v.prototype.findClosestPoint = function(e, t) {
  for (var i = 1 / 0, a, r, n, s, l, o, h, u = this.layout_.points.length - 1; u >= 0; --u)
    for (var d = this.layout_.points[u], c = 0; c < d.length; ++c)
      s = d[c], Ne(s) && (r = s.canvasx - e, n = s.canvasy - t, a = r * r + n * n, a < i && (i = a, l = s, o = u, h = s.idx));
  var p = this.layout_.setNames[o];
  return {
    row: h,
    seriesName: p,
    point: l
  };
};
v.prototype.findStackedPoint = function(e, t) {
  for (var i = this.findClosestRow(e), a, r, n = 0; n < this.layout_.points.length; ++n) {
    var s = this.getLeftBoundary_(n), l = i - s, o = this.layout_.points[n];
    if (!(l >= o.length)) {
      var h = o[l];
      if (!!Ne(h)) {
        var u = h.canvasy;
        if (e > h.canvasx && l + 1 < o.length) {
          var d = o[l + 1];
          if (Ne(d)) {
            var c = d.canvasx - h.canvasx;
            if (c > 0) {
              var p = (e - h.canvasx) / c;
              u += p * (d.canvasy - h.canvasy);
            }
          }
        } else if (e < h.canvasx && l > 0) {
          var g = o[l - 1];
          if (Ne(g)) {
            var c = h.canvasx - g.canvasx;
            if (c > 0) {
              var p = (h.canvasx - e) / c;
              u += p * (g.canvasy - h.canvasy);
            }
          }
        }
        (n === 0 || u < t) && (a = h, r = n);
      }
    }
  }
  var f = this.layout_.setNames[r];
  return {
    row: i,
    seriesName: f,
    point: a
  };
};
v.prototype.mouseMove_ = function(e) {
  var t = this.layout_.points;
  if (t != null) {
    var i = this.eventToDomCoords(e), a = i[0], r = i[1], n = this.getOption("highlightSeriesOpts"), s = !1;
    if (n && !this.isSeriesLocked()) {
      var l;
      this.getBooleanOption("stackedGraph") ? l = this.findStackedPoint(a, r) : l = this.findClosestPoint(a, r), s = this.setSelection(l.row, l.seriesName);
    } else {
      var o = this.findClosestRow(a);
      s = this.setSelection(o);
    }
    var h = this.getFunctionOption("highlightCallback");
    h && s && h.call(
      this,
      e,
      this.lastx_,
      this.selPoints_,
      this.lastRow_,
      this.highlightSet_
    );
  }
};
v.prototype.getLeftBoundary_ = function(e) {
  if (this.boundaryIds_[e])
    return this.boundaryIds_[e][0];
  for (var t = 0; t < this.boundaryIds_.length; t++)
    if (this.boundaryIds_[t] !== void 0)
      return this.boundaryIds_[t][0];
  return 0;
};
v.prototype.animateSelection_ = function(e) {
  var t = 10, i = 30;
  this.fadeLevel === void 0 && (this.fadeLevel = 0), this.animateId === void 0 && (this.animateId = 0);
  var a = this.fadeLevel, r = e < 0 ? a : t - a;
  if (r <= 0) {
    this.fadeLevel && this.updateSelection_(1);
    return;
  }
  var n = ++this.animateId, s = this, l = function() {
    s.fadeLevel !== 0 && e < 0 && (s.fadeLevel = 0, s.clearSelection());
  };
  Ii(
    function(o) {
      s.animateId == n && (s.fadeLevel += e, s.fadeLevel === 0 ? s.clearSelection() : s.updateSelection_(s.fadeLevel / t));
    },
    r,
    i,
    l
  );
};
v.prototype.updateSelection_ = function(e) {
  this.cascadeEvents_("select", {
    selectedRow: this.lastRow_ === -1 ? void 0 : this.lastRow_,
    selectedX: this.lastx_ === -1 ? void 0 : this.lastx_,
    selectedPoints: this.selPoints_
  });
  var t, i = this.canvas_ctx_;
  if (this.getOption("highlightSeriesOpts")) {
    i.clearRect(0, 0, this.width_, this.height_);
    var a = 1 - this.getNumericOption("highlightSeriesBackgroundAlpha"), r = vt(this.getOption("highlightSeriesBackgroundColor"));
    if (a) {
      var n = !0;
      if (n) {
        if (e === void 0) {
          this.animateSelection_(1);
          return;
        }
        a *= e;
      }
      i.fillStyle = "rgba(" + r.r + "," + r.g + "," + r.b + "," + a + ")", i.fillRect(0, 0, this.width_, this.height_);
    }
    this.plotter_._renderLineChart(this.highlightSet_, i);
  } else if (this.previousVerticalX_ >= 0) {
    var s = 0, l = this.attr_("labels");
    for (t = 1; t < l.length; t++) {
      var o = this.getNumericOption("highlightCircleSize", l[t]);
      o > s && (s = o);
    }
    var h = this.previousVerticalX_;
    i.clearRect(
      h - s - 1,
      0,
      2 * s + 2,
      this.height_
    );
  }
  if (this.selPoints_.length > 0) {
    var u = this.selPoints_[0].canvasx;
    for (i.save(), t = 0; t < this.selPoints_.length; t++) {
      var d = this.selPoints_[t];
      if (!isNaN(d.canvasy)) {
        var c = this.getNumericOption("highlightCircleSize", d.name), p = this.getFunctionOption("drawHighlightPointCallback", d.name), g = this.plotter_.colors[d.name];
        p || (p = Vt.DEFAULT), i.lineWidth = this.getNumericOption("strokeWidth", d.name), i.strokeStyle = g, i.fillStyle = g, p.call(
          this,
          this,
          d.name,
          i,
          u,
          d.canvasy,
          g,
          c,
          d.idx
        );
      }
    }
    i.restore(), this.previousVerticalX_ = u;
  }
};
v.prototype.setSelection = function(e, t, i) {
  this.selPoints_ = [];
  var a = !1;
  if (e !== !1 && e >= 0) {
    e != this.lastRow_ && (a = !0), this.lastRow_ = e;
    for (var r = 0; r < this.layout_.points.length; ++r) {
      var n = this.layout_.points[r], s = e - this.getLeftBoundary_(r);
      if (s >= 0 && s < n.length && n[s].idx == e) {
        var l = n[s];
        l.yval !== null && this.selPoints_.push(l);
      } else
        for (var o = 0; o < n.length; ++o) {
          var l = n[o];
          if (l.idx == e) {
            l.yval !== null && this.selPoints_.push(l);
            break;
          }
        }
    }
  } else
    this.lastRow_ >= 0 && (a = !0), this.lastRow_ = -1;
  return this.selPoints_.length ? this.lastx_ = this.selPoints_[0].xval : this.lastx_ = -1, t !== void 0 && (this.highlightSet_ !== t && (a = !0), this.highlightSet_ = t), i !== void 0 && (this.lockedSet_ = i), a && this.updateSelection_(void 0), a;
};
v.prototype.mouseOut_ = function(e) {
  this.getFunctionOption("unhighlightCallback") && this.getFunctionOption("unhighlightCallback").call(this, e), this.getBooleanOption("hideOverlayOnMouseOut") && !this.lockedSet_ && this.clearSelection();
};
v.prototype.clearSelection = function() {
  if (this.cascadeEvents_("deselect", {}), this.lockedSet_ = !1, this.fadeLevel) {
    this.animateSelection_(-1);
    return;
  }
  this.canvas_ctx_.clearRect(0, 0, this.width_, this.height_), this.fadeLevel = 0, this.selPoints_ = [], this.lastx_ = -1, this.lastRow_ = -1, this.highlightSet_ = null;
};
v.prototype.getSelection = function() {
  if (!this.selPoints_ || this.selPoints_.length < 1)
    return -1;
  for (var e = 0; e < this.layout_.points.length; e++)
    for (var t = this.layout_.points[e], i = 0; i < t.length; i++)
      if (t[i].x == this.selPoints_[0].x)
        return t[i].idx;
  return -1;
};
v.prototype.getHighlightSeries = function() {
  return this.highlightSet_;
};
v.prototype.isSeriesLocked = function() {
  return this.lockedSet_;
};
v.prototype.loadedEvent_ = function(e) {
  this.rawData_ = this.parseCSV_(e), this.cascadeDataDidUpdateEvent_(), this.predraw_();
};
v.prototype.addXTicks_ = function() {
  var e;
  this.dateWindow_ ? e = [this.dateWindow_[0], this.dateWindow_[1]] : e = this.xAxisExtremes();
  var t = this.optionsViewForAxis_("x"), i = t("ticker")(
    e[0],
    e[1],
    this.plotter_.area.w,
    t,
    this
  );
  this.layout_.setXTicks(i);
};
v.prototype.getHandlerClass_ = function() {
  var e;
  return this.attr_("dataHandler") ? e = this.attr_("dataHandler") : this.fractions_ ? this.getBooleanOption("errorBars") ? e = Ve : e = Be : this.getBooleanOption("customBars") ? e = We : this.getBooleanOption("errorBars") ? e = Ye : e = fe, e;
};
v.prototype.predraw_ = function() {
  var e = new Date();
  this.dataHandler_ = new (this.getHandlerClass_())(), this.layout_.computePlotArea(), this.computeYAxes_(), this.is_initial_draw_ || (this.canvas_ctx_.restore(), this.hidden_ctx_.restore()), this.canvas_ctx_.save(), this.hidden_ctx_.save(), this.plotter_ = new N(
    this,
    this.hidden_,
    this.hidden_ctx_,
    this.layout_
  ), this.createRollInterface_(), this.cascadeEvents_("predraw"), this.rolledSeries_ = [null];
  for (var t = 1; t < this.numColumns(); t++) {
    var i = this.dataHandler_.extractSeries(this.rawData_, t, this.attributes_);
    this.rollPeriod_ > 1 && (i = this.dataHandler_.rollingAverage(i, this.rollPeriod_, this.attributes_)), this.rolledSeries_.push(i);
  }
  this.drawGraph_();
  var a = new Date();
  this.drawingTimeMs_ = a - e;
};
v.PointType = void 0;
v.stackPoints_ = function(e, t, i, a) {
  for (var r = null, n = null, s = null, l = -1, o = function(g) {
    if (!(l >= g)) {
      for (var f = g; f < e.length; ++f)
        if (s = null, !isNaN(e[f].yval) && e[f].yval !== null) {
          l = f, s = e[f];
          break;
        }
    }
  }, h = 0; h < e.length; ++h) {
    var u = e[h], d = u.xval;
    t[d] === void 0 && (t[d] = 0);
    var c = u.yval;
    isNaN(c) || c === null ? a == "none" ? c = 0 : (o(h), n && s && a != "none" ? c = n.yval + (s.yval - n.yval) * ((d - n.xval) / (s.xval - n.xval)) : n && a == "all" ? c = n.yval : s && a == "all" ? c = s.yval : c = 0) : n = u;
    var p = t[d];
    r != d && (p += c, t[d] = p), r = d, u.yval_stacked = p, p > i[1] && (i[1] = p), p < i[0] && (i[0] = p);
  }
};
v.prototype.gatherDatasets_ = function(e, t) {
  var i = [], a = [], r = [], n = {}, s, l, o, h, u, d = e.length - 1, c;
  for (s = d; s >= 1; s--)
    if (!!this.visibility()[s - 1]) {
      if (t) {
        c = e[s];
        var p = t[0], g = t[1];
        for (o = null, h = null, l = 0; l < c.length; l++)
          c[l][0] >= p && o === null && (o = l), c[l][0] <= g && (h = l);
        o === null && (o = 0);
        for (var f = o, y = !0; y && f > 0; )
          f--, y = c[f][1] === null;
        h === null && (h = c.length - 1);
        var m = h;
        for (y = !0; y && m < c.length - 1; )
          m++, y = c[m][1] === null;
        f !== o && (o = f), m !== h && (h = m), i[s - 1] = [o, h], c = c.slice(o, h + 1);
      } else
        c = e[s], i[s - 1] = [0, c.length - 1];
      var _ = this.attr_("labels")[s], b = this.dataHandler_.getExtremeYValues(
        c,
        t,
        this.getBooleanOption("stepPlot", _)
      ), A = this.dataHandler_.seriesToPoints(
        c,
        _,
        i[s - 1][0]
      );
      this.getBooleanOption("stackedGraph") && (u = this.attributes_.axisForSeries(_), r[u] === void 0 && (r[u] = []), v.stackPoints_(
        A,
        r[u],
        b,
        this.getBooleanOption("stackedGraphNaNFill")
      )), n[_] = b, a[s] = A;
    }
  return { points: a, extremes: n, boundaryIds: i };
};
v.prototype.drawGraph_ = function() {
  var e = new Date(), t = this.is_initial_draw_;
  this.is_initial_draw_ = !1, this.layout_.removeAllDatasets(), this.setColors_(), this.attrs_.pointSize = 0.5 * this.getNumericOption("highlightCircleSize");
  var i = this.gatherDatasets_(this.rolledSeries_, this.dateWindow_), a = i.points, r = i.extremes;
  this.boundaryIds_ = i.boundaryIds, this.setIndexByName_ = {};
  for (var n = this.attr_("labels"), s = 0, l = 1; l < a.length; l++)
    !this.visibility()[l - 1] || (this.layout_.addDataset(n[l], a[l]), this.datasetIndex_[l] = s++);
  for (var l = 0; l < n.length; l++)
    this.setIndexByName_[n[l]] = l;
  if (this.computeYAxisRanges_(r), this.layout_.setYAxes(this.axes_), this.addXTicks_(), this.layout_.evaluate(), this.renderGraph_(t), this.getStringOption("timingName")) {
    var o = new Date();
    console.log(this.getStringOption("timingName") + " - drawGraph: " + (o - e) + "ms");
  }
};
v.prototype.renderGraph_ = function(e) {
  this.cascadeEvents_("clearChart"), this.plotter_.clear();
  const t = this.getFunctionOption("underlayCallback");
  t && t.call(
    this,
    this.hidden_ctx_,
    this.layout_.getPlotArea(),
    this,
    this
  );
  var i = {
    canvas: this.hidden_,
    drawingContext: this.hidden_ctx_
  };
  this.cascadeEvents_("willDrawChart", i), this.plotter_.render(), this.cascadeEvents_("didDrawChart", i), this.lastRow_ = -1, this.canvas_.getContext("2d").clearRect(0, 0, this.width_, this.height_);
  const a = this.getFunctionOption("drawCallback");
  if (a !== null && a.call(this, this, e), e)
    for (this.readyFired_ = !0; this.readyFns_.length > 0; ) {
      var r = this.readyFns_.pop();
      r(this);
    }
};
v.prototype.computeYAxes_ = function() {
  var e, t, i;
  for (this.axes_ = [], e = 0; e < this.attributes_.numAxes(); e++)
    t = { g: this }, q(t, this.attributes_.axisOptions(e)), this.axes_[e] = t;
  for (e = 0; e < this.axes_.length; e++)
    if (e === 0)
      t = this.optionsViewForAxis_("y" + (e ? "2" : "")), i = t("valueRange"), i && (this.axes_[e].valueRange = i);
    else {
      var a = this.user_attrs_.axes;
      a && a.y2 && (i = a.y2.valueRange, i && (this.axes_[e].valueRange = i));
    }
};
v.prototype.numAxes = function() {
  return this.attributes_.numAxes();
};
v.prototype.axisPropertiesForSeries = function(e) {
  return this.axes_[this.attributes_.axisForSeries(e)];
};
v.prototype.computeYAxisRanges_ = function(e) {
  for (var t = function(te) {
    return isNaN(parseFloat(te));
  }, i = this.attributes_.numAxes(), a, r, n, s, l, o = 0; o < i; o++) {
    var h = this.axes_[o], u = this.attributes_.getForAxis("logscale", o), d = this.attributes_.getForAxis("includeZero", o), c = this.attributes_.getForAxis("independentTicks", o);
    n = this.attributes_.seriesForAxis(o), a = !0, s = 0.1;
    const te = this.getNumericOption("yRangePad");
    if (te !== null && (a = !1, s = te / this.plotter_.area.h), n.length === 0)
      h.extremeRange = [0, 1];
    else {
      for (var p = 1 / 0, g = -1 / 0, f, y, m = 0; m < n.length; m++)
        !e.hasOwnProperty(n[m]) || (f = e[n[m]][0], f !== null && (p = Math.min(f, p)), y = e[n[m]][1], y !== null && (g = Math.max(y, g)));
      d && !u && (p > 0 && (p = 0), g < 0 && (g = 0)), p == 1 / 0 && (p = 0), g == -1 / 0 && (g = 1), r = g - p, r === 0 && (g !== 0 ? r = Math.abs(g) : (g = 1, r = 1));
      var _ = g, b = p;
      a && (u ? (_ = g + s * r, b = p) : (_ = g + s * r, b = p - s * r, b < 0 && p >= 0 && (b = 0), _ > 0 && g <= 0 && (_ = 0))), h.extremeRange = [b, _];
    }
    if (h.valueRange) {
      var A = t(h.valueRange[0]) ? h.extremeRange[0] : h.valueRange[0], T = t(h.valueRange[1]) ? h.extremeRange[1] : h.valueRange[1];
      h.computedValueRange = [A, T];
    } else
      h.computedValueRange = h.extremeRange;
    if (!a)
      if (u) {
        A = h.computedValueRange[0], T = h.computedValueRange[1];
        var k = s / (2 * s - 1), w = (s - 1) / (2 * s - 1);
        h.computedValueRange[0] = tt(A, T, k), h.computedValueRange[1] = tt(A, T, w);
      } else
        A = h.computedValueRange[0], T = h.computedValueRange[1], r = T - A, h.computedValueRange[0] = A - r * s, h.computedValueRange[1] = T + r * s;
    if (c) {
      h.independentTicks = c;
      var M = this.optionsViewForAxis_("y" + (o ? "2" : "")), L = M("ticker");
      h.ticks = L(
        h.computedValueRange[0],
        h.computedValueRange[1],
        this.plotter_.area.h,
        M,
        this
      ), l || (l = h);
    }
  }
  if (l === void 0)
    throw 'Configuration Error: At least one axis has to have the "independentTicks" option activated.';
  for (var o = 0; o < i; o++) {
    var h = this.axes_[o];
    if (!h.independentTicks) {
      for (var M = this.optionsViewForAxis_("y" + (o ? "2" : "")), L = M("ticker"), x = l.ticks, C = l.computedValueRange[1] - l.computedValueRange[0], F = h.computedValueRange[1] - h.computedValueRange[0], Y = [], V = 0; V < x.length; V++) {
        var G = (x[V].v - l.computedValueRange[0]) / C, I = h.computedValueRange[0] + G * F;
        Y.push(I);
      }
      h.ticks = L(
        h.computedValueRange[0],
        h.computedValueRange[1],
        this.plotter_.area.h,
        M,
        this,
        Y
      );
    }
  }
};
v.prototype.detectTypeFromString_ = function(e) {
  var t = !1, i = e.indexOf("-");
  (i > 0 && e[i - 1] != "e" && e[i - 1] != "E" || e.indexOf("/") >= 0 || isNaN(parseFloat(e)) || e.length == 8 && e > "19700101" && e < "20371231") && (t = !0), this.setXAxisOptions_(t);
};
v.prototype.setXAxisOptions_ = function(e) {
  e ? (this.attrs_.xValueParser = Ci, this.attrs_.axes.x.valueFormatter = yt, this.attrs_.axes.x.ticker = He, this.attrs_.axes.x.axisLabelFormatter = Ue) : (this.attrs_.xValueParser = function(t) {
    return parseFloat(t);
  }, this.attrs_.axes.x.valueFormatter = function(t) {
    return t;
  }, this.attrs_.axes.x.ticker = ce, this.attrs_.axes.x.axisLabelFormatter = this.attrs_.axes.x.valueFormatter);
};
v.prototype.parseCSV_ = function(e) {
  var t = [], i = ki(e), a = e.split(i || `
`), r, n, s = this.getStringOption("delimiter");
  a[0].indexOf(s) == -1 && a[0].indexOf("	") >= 0 && (s = "	");
  var l = 0;
  "labels" in this.user_attrs_ || (l = 1, this.attrs_.labels = a[0].split(s), this.attributes_.reparseSeries());
  for (var o, h = !1, u = this.attr_("labels").length, d = !1, c = l; c < a.length; c++) {
    var p = a[c];
    if (p.length !== 0 && p[0] != "#") {
      var g = p.split(s);
      if (!(g.length < 2)) {
        var f = [];
        if (h || (this.detectTypeFromString_(g[0]), o = this.getFunctionOption("xValueParser"), h = !0), f[0] = o(g[0], this), this.fractions_)
          for (n = 1; n < g.length; n++)
            r = g[n].split("/"), r.length != 2 ? (console.error(`Expected fractional "num/den" values in CSV data but found a value '` + g[n] + "' on line " + (1 + c) + " ('" + p + "') which is not of this form."), f[n] = [0, 0]) : f[n] = [
              re(r[0], c, p),
              re(r[1], c, p)
            ];
        else if (this.getBooleanOption("errorBars"))
          for (g.length % 2 != 1 && console.error("Expected alternating (value, stdev.) pairs in CSV data but line " + (1 + c) + " has an odd number of values (" + (g.length - 1) + "): '" + p + "'"), n = 1; n < g.length; n += 2)
            f[(n + 1) / 2] = [
              re(g[n], c, p),
              re(g[n + 1], c, p)
            ];
        else if (this.getBooleanOption("customBars"))
          for (n = 1; n < g.length; n++) {
            var y = g[n];
            /^ *$/.test(y) ? f[n] = [null, null, null] : (r = y.split(";"), r.length == 3 ? f[n] = [
              re(r[0], c, p),
              re(r[1], c, p),
              re(r[2], c, p)
            ] : console.warn('When using customBars, values must be either blank or "low;center;high" tuples (got "' + y + '" on line ' + (1 + c)));
          }
        else
          for (n = 1; n < g.length; n++)
            f[n] = re(g[n], c, p);
        if (t.length > 0 && f[0] < t[t.length - 1][0] && (d = !0), f.length != u && console.error("Number of columns in line " + c + " (" + f.length + ") does not agree with number of labels (" + u + ") " + p), c === 0 && this.attr_("labels")) {
          var m = !0;
          for (n = 0; m && n < f.length; n++)
            f[n] && (m = !1);
          if (m) {
            console.warn("The dygraphs 'labels' option is set, but the first row of CSV data ('" + p + "') appears to also contain labels. Will drop the CSV labels and use the option labels.");
            continue;
          }
        }
        t.push(f);
      }
    }
  }
  return d && (console.warn("CSV is out of order; order it correctly to speed loading."), t.sort(function(_, b) {
    return _[0] - b[0];
  })), t;
};
function xa(e) {
  const t = e[0], i = t[0];
  if (typeof i != "number" && !Li(i))
    throw new Error(`Expected number or date but got ${typeof i}: ${i}.`);
  for (let a = 1; a < t.length; a++) {
    const r = t[a];
    if (r != null && typeof r != "number" && !Se(r))
      throw new Error(`Expected number or array but got ${typeof r}: ${r}.`);
  }
}
v.prototype.parseArray_ = function(e) {
  if (e.length === 0)
    return console.error("Can't plot empty data set"), null;
  if (e[0].length === 0)
    return console.error("Data set cannot contain an empty row"), null;
  xa(e);
  var t;
  if (this.attr_("labels") === null) {
    for (console.warn("Using default labels. Set labels explicitly via 'labels' in the options parameter"), this.attrs_.labels = ["X"], t = 1; t < e[0].length; t++)
      this.attrs_.labels.push("Y" + t);
    this.attributes_.reparseSeries();
  } else {
    var i = this.attr_("labels");
    if (i.length != e[0].length)
      return console.error("Mismatch between number of labels (" + i + ") and number of columns in array (" + e[0].length + ")"), null;
  }
  if (Li(e[0][0])) {
    this.attrs_.axes.x.valueFormatter = yt, this.attrs_.axes.x.ticker = He, this.attrs_.axes.x.axisLabelFormatter = Ue;
    var a = Oi(e);
    for (t = 0; t < e.length; t++) {
      if (a[t].length === 0)
        return console.error("Row " + (1 + t) + " of data is empty"), null;
      if (a[t][0] === null || typeof a[t][0].getTime != "function" || isNaN(a[t][0].getTime()))
        return console.error("x value in row " + (1 + t) + " is not a Date"), null;
      a[t][0] = a[t][0].getTime();
    }
    return a;
  } else
    return this.attrs_.axes.x.valueFormatter = function(r) {
      return r;
    }, this.attrs_.axes.x.ticker = ce, this.attrs_.axes.x.axisLabelFormatter = Rt, e;
};
v.prototype.parseDataTable_ = function(e) {
  var t = function(A) {
    var T = String.fromCharCode(65 + A % 26);
    for (A = Math.floor(A / 26); A > 0; )
      T = String.fromCharCode(65 + (A - 1) % 26) + T.toLowerCase(), A = Math.floor((A - 1) / 26);
    return T;
  }, i = e.getNumberOfColumns(), a = e.getNumberOfRows(), r = e.getColumnType(0);
  if (r == "date" || r == "datetime")
    this.attrs_.xValueParser = Ci, this.attrs_.axes.x.valueFormatter = yt, this.attrs_.axes.x.ticker = He, this.attrs_.axes.x.axisLabelFormatter = Ue;
  else if (r == "number")
    this.attrs_.xValueParser = function(A) {
      return parseFloat(A);
    }, this.attrs_.axes.x.valueFormatter = function(A) {
      return A;
    }, this.attrs_.axes.x.ticker = ce, this.attrs_.axes.x.axisLabelFormatter = this.attrs_.axes.x.valueFormatter;
  else
    throw new Error(
      "only 'date', 'datetime' and 'number' types are supported for column 1 of DataTable input (Got '" + r + "')"
    );
  var n = [], s = {}, l = !1, o, h;
  for (o = 1; o < i; o++) {
    var u = e.getColumnType(o);
    if (u == "number")
      n.push(o);
    else if (u == "string" && this.getBooleanOption("displayAnnotations")) {
      var d = n[n.length - 1];
      s.hasOwnProperty(d) ? s[d].push(o) : s[d] = [o], l = !0;
    } else
      throw new Error(
        "Only 'number' is supported as a dependent type with Gviz. 'string' is only supported if displayAnnotations is true"
      );
  }
  var c = [e.getColumnLabel(0)];
  for (o = 0; o < n.length; o++)
    c.push(e.getColumnLabel(n[o])), this.getBooleanOption("errorBars") && (o += 1);
  this.attrs_.labels = c, i = c.length;
  var p = [], g = !1, f = [];
  for (o = 0; o < a; o++) {
    var y = [];
    if (typeof e.getValue(o, 0) > "u" || e.getValue(o, 0) === null) {
      console.warn("Ignoring row " + o + " of DataTable because of undefined or null first column.");
      continue;
    }
    if (r == "date" || r == "datetime" ? y.push(e.getValue(o, 0).getTime()) : y.push(e.getValue(o, 0)), this.getBooleanOption("errorBars"))
      for (h = 0; h < i - 1; h++)
        y.push([e.getValue(o, 1 + 2 * h), e.getValue(o, 2 + 2 * h)]);
    else {
      for (h = 0; h < n.length; h++) {
        var m = n[h];
        if (y.push(e.getValue(o, m)), l && s.hasOwnProperty(m) && e.getValue(o, s[m][0]) !== null) {
          var _ = {};
          _.series = e.getColumnLabel(m), _.xval = y[0], _.shortText = t(f.length), _.text = "";
          for (var b = 0; b < s[m].length; b++)
            b && (_.text += `
`), _.text += e.getValue(o, s[m][b]);
          f.push(_);
        }
      }
      for (h = 0; h < y.length; h++)
        isFinite(y[h]) || (y[h] = null);
    }
    p.length > 0 && y[0] < p[p.length - 1][0] && (g = !0), p.push(y);
  }
  g && (console.warn("DataTable is out of order; order it correctly to speed loading."), p.sort(function(A, T) {
    return A[0] - T[0];
  })), this.rawData_ = p, f.length > 0 && this.setAnnotations(f, !0), this.attributes_.reparseSeries();
};
v.prototype.cascadeDataDidUpdateEvent_ = function() {
  this.cascadeEvents_("dataDidUpdate", {});
};
v.prototype.start_ = function() {
  var e = this.file_;
  if (typeof e == "function" && (e = e()), Se(e))
    this.rawData_ = this.parseArray_(e), this.cascadeDataDidUpdateEvent_(), this.predraw_();
  else if (typeof e == "object" && typeof e.getColumnRange == "function")
    this.parseDataTable_(e), this.cascadeDataDidUpdateEvent_(), this.predraw_();
  else if (typeof e == "string") {
    var t = ki(e);
    if (t)
      this.loadedEvent_(e);
    else {
      var i;
      window.XMLHttpRequest ? i = new XMLHttpRequest() : i = new ActiveXObject("Microsoft.XMLHTTP");
      var a = this;
      i.onreadystatechange = function() {
        i.readyState == 4 && (i.status === 200 || i.status === 0) && a.loadedEvent_(i.responseText);
      }, i.open("GET", e, !0), i.send(null);
    }
  } else
    console.error("Unknown data format: " + typeof e);
};
v.prototype.updateOptions = function(e, t) {
  typeof t > "u" && (t = !1);
  var i = e.file, a = v.copyUserAttrs_(e);
  "rollPeriod" in a && (this.rollPeriod_ = a.rollPeriod), "dateWindow" in a && (this.dateWindow_ = a.dateWindow);
  var r = ca(this.attr_("labels"), a);
  Wt(this.user_attrs_, a), this.attributes_.reparseSeries(), i ? (this.cascadeEvents_("dataWillUpdate", {}), this.file_ = i, t || this.start_()) : t || (r ? this.predraw_() : this.renderGraph_(!1));
};
v.copyUserAttrs_ = function(e) {
  var t = {};
  for (var i in e)
    !e.hasOwnProperty(i) || i != "file" && e.hasOwnProperty(i) && (t[i] = e[i]);
  return t;
};
v.prototype.resize = function(e, t) {
  if (!this.resize_lock) {
    this.resize_lock = !0, e === null != (t === null) && (console.warn("Dygraph.resize() should be called with zero parameters or two non-NULL parameters. Pretending it was zero."), e = t = null);
    var i = this.width_, a = this.height_;
    e ? (this.maindiv_.style.width = e + "px", this.maindiv_.style.height = t + "px", this.width_ = e, this.height_ = t) : (this.width_ = this.maindiv_.clientWidth, this.height_ = this.maindiv_.clientHeight), (i != this.width_ || a != this.height_) && (this.resizeElements_(), this.predraw_()), this.resize_lock = !1;
  }
};
v.prototype.adjustRoll = function(e) {
  this.rollPeriod_ = e, this.predraw_();
};
v.prototype.visibility = function() {
  for (this.getOption("visibility") || (this.attrs_.visibility = []); this.getOption("visibility").length < this.numColumns() - 1; )
    this.attrs_.visibility.push(!0);
  return this.getOption("visibility");
};
v.prototype.setVisibility = function(e, t) {
  var i = this.visibility(), a = !1;
  if (Array.isArray(e) || (e !== null && typeof e == "object" ? a = !0 : e = [e]), a)
    for (var r in e)
      e.hasOwnProperty(r) && (r < 0 || r >= i.length ? console.warn("Invalid series number in setVisibility: " + r) : i[r] = e[r]);
  else
    for (var r = 0; r < e.length; r++)
      typeof e[r] == "boolean" ? r >= i.length ? console.warn("Invalid series number in setVisibility: " + r) : i[r] = e[r] : e[r] < 0 || e[r] >= i.length ? console.warn("Invalid series number in setVisibility: " + e[r]) : i[e[r]] = t;
  this.predraw_();
};
v.prototype.size = function() {
  return { width: this.width_, height: this.height_ };
};
v.prototype.setAnnotations = function(e, t) {
  if (this.annotations_ = e, !this.layout_) {
    console.warn("Tried to setAnnotations before dygraph was ready. Try setting them in a ready() block. See dygraphs.com/tests/annotation.html");
    return;
  }
  this.layout_.setAnnotations(this.annotations_), t || this.predraw_();
};
v.prototype.annotations = function() {
  return this.annotations_;
};
v.prototype.getLabels = function() {
  var e = this.attr_("labels");
  return e ? e.slice() : null;
};
v.prototype.indexFromSetName = function(e) {
  return this.setIndexByName_[e];
};
v.prototype.getRowForX = function(e) {
  for (var t = 0, i = this.numRows() - 1; t <= i; ) {
    var a = i + t >> 1, r = this.getValue(a, 0);
    if (r < e)
      t = a + 1;
    else if (r > e)
      i = a - 1;
    else if (t != a)
      i = a;
    else
      return a;
  }
  return null;
};
v.prototype.ready = function(e) {
  this.is_initial_draw_ ? this.readyFns_.push(e) : e.call(this, this);
};
v.prototype.addAndTrackEvent = function(e, t, i) {
  Le(e, t, i), this.registeredEvents_.push({ elem: e, type: t, fn: i });
};
v.prototype.removeTrackedEvents_ = function() {
  if (this.registeredEvents_)
    for (var e = 0; e < this.registeredEvents_.length; e++) {
      var t = this.registeredEvents_[e];
      K(t.elem, t.type, t.fn);
    }
  this.registeredEvents_ = [];
};
v.PLUGINS = [
  Z,
  oe,
  R,
  ie,
  se,
  De
];
v.GVizChart = mt;
v.DASHED_LINE = sa;
v.DOT_DASH_LINE = oa;
v.dateAxisLabelFormatter = Ue;
v.toRGB_ = vt;
v.findPos = ze;
v.pageX = ut;
v.pageY = pt;
v.dateString_ = Ei;
v.defaultInteractionModel = S.defaultModel;
v.nonInteractiveModel = v.nonInteractiveModel_ = S.nonInteractiveModel_;
v.Circles = Vt;
v.Plugins = {
  Legend: Z,
  Axes: oe,
  Annotations: se,
  ChartLabels: ie,
  Grid: De,
  RangeSelector: R
};
v.DataHandlers = {
  DefaultHandler: fe,
  BarsHandler: ee,
  CustomBarsHandler: We,
  DefaultFractionHandler: Be,
  ErrorBarsHandler: Ye,
  FractionsBarsHandler: Ve
};
v.startPan = S.startPan;
v.startZoom = S.startZoom;
v.movePan = S.movePan;
v.moveZoom = S.moveZoom;
v.endPan = S.endPan;
v.endZoom = S.endZoom;
v.numericLinearTicks = ia;
v.numericTicks = ce;
v.dateTicker = He;
v.Granularity = D;
v.getDateAxis = Si;
v.floatFormat = Di;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
console.warn("The main 'lit-element' module entrypoint is deprecated. Please update your imports to use the 'lit' package: 'lit' and 'lit/decorators.ts' or import from 'lit-element/lit-element.ts'. See https://lit.dev/msg/deprecated-import-path for more information.");
var Aa = Object.defineProperty, Ma = Object.getOwnPropertyDescriptor, Xe = (e, t, i, a) => {
  for (var r = a > 1 ? void 0 : a ? Ma(t, i) : t, n = e.length - 1, s; n >= 0; n--)
    (s = e[n]) && (r = (a ? s(t, i, r) : s(r)) || r);
  return a && r && Aa(t, i, r), r;
};
let ue = class extends J {
  constructor() {
    super(...arguments), this.option = "flat", this.iconOnly = !1, this.full = !1, this.disabled = !1;
  }
  render() {
    return j`
            <button
	            class="${this.option} ${this.iconOnly ? "icon-only" : ""} ${this.full ? "full" : ""}"
	            ?disabled=${this.disabled}
	            @click=${this.onclick}
            >
	            <slot name="icon"></slot>
                <slot></slot>
            </button>
		`;
  }
};
ue.styles = Me`
      button {
        width: 100%;
        position: relative;
        display: flex;
        align-items: center;
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
        justify-content: center;
        cursor: pointer;
        font-family: inherit;
        font-weight: 300;
        height: var(--se-button-height, 36px);
        padding: var(--se-button-padding, 4px 16px);
        border-radius: var(--se-button-border-radius, 2px);
        outline: none;
        transition-property: outline-width;
        transition-duration: 0.2s;
      }
      button.full {
        width: 100%;
      }
	  button.icon-only {
	    padding: 4px;
	  }
      button.flat {
        background: var(--se-primary, #3dcd58);
        border: none;
        color: white; //var(--se-button-color-font);
      }
      button.outline {
        background-color: transparent;
        border: 1px solid var(--se-background-standard-contrast, #333333);
        color: var(--se-background-standard-contrast, #333333);
      }
      button.text {
        background-color: transparent;
        color: var(--se-border, #9fa0a4);
      }
      button:after {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
      }
      button:not([disabled]):hover:after {
        background-color: rgba(0, 0, 0, .3);
      }
      button[disabled] {
        cursor: not-allowed;
      }
      button[disabled]:after {
        background-color: rgba(197, 197, 197, .7);
      }
	  ::slotted([slot="icon"]) {
        height: 100%;
        box-sizing: border-box;
	  }
	`;
Xe([
  U()
], ue.prototype, "option", 2);
Xe([
  U({ type: Boolean, attribute: "icon-only" })
], ue.prototype, "iconOnly", 2);
Xe([
  U({ type: Boolean, attribute: "full" })
], ue.prototype, "full", 2);
Xe([
  U({ type: Boolean })
], ue.prototype, "disabled", 2);
ue = Xe([
  Te("ew-button")
], ue);
var Ta = Object.defineProperty, Sa = Object.getOwnPropertyDescriptor, Pi = (e, t, i, a) => {
  for (var r = a > 1 ? void 0 : a ? Sa(t, i) : t, n = e.length - 1, s; n >= 0; n--)
    (s = e[n]) && (r = (a ? s(t, i, r) : s(r)) || r);
  return a && r && Ta(t, i, r), r;
};
let lt = class extends J {
  constructor() {
    super(...arguments), this.open = !1;
  }
  close() {
    this.open = !1;
    const e = new CustomEvent("dialog-closed");
    this.dispatchEvent(e);
  }
  firstUpdated() {
    this._watchEscape = this._watchEscape.bind(this);
  }
  render() {
    return j`
		    <div class="wrapper ${this.open ? "open" : ""}" aria-hidden="${!this.open}">
			    <div class="overlay" @click="${this.close}"></div>
			    <div class="dialog" role="dialog" aria-labelledby="title" aria-describedby="content">
			        <div class="header">
                        <h2><slot name="title"></slot></h2>
				        <ew-button option="outline" aria-label="Close" @click=${this.close}>✖</ew-button>
		            </div>
			        <div id="content" class="content">
			          	<slot></slot>
			        </div>
                    <div class="footer">
                        <slot name="footer"></slot>
                    </div>
			    </div>
		    </div>
		`;
  }
  _watchEscape(e) {
    e.key === "Escape" && this.close();
  }
};
lt.styles = Me`
	  .wrapper {
        opacity: 0;
        transition: visibility 0s, opacity 0.25s ease-in;
      }
      .wrapper:not(.open) {
        visibility: hidden;
      }
      .wrapper.open {
        align-items: center;
        display: flex;
        justify-content: center;
        height: 100vh;
        position: fixed;
        top: 0;
        left: 0;
	    right: 0;
        bottom: 0;
        opacity: 1;
        visibility: visible;
        z-index: 30;
      }
      .overlay {
        background: var(--se-background-alternative-contrast, #333333);
        opacity: 0.7;
        height: 100%;
        position: fixed;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        width: 100%;
      }
      .dialog {
        position: fixed;
        display: flex;
        flex-direction: column;
        row-gap: 16px;
        background: var(--se-background-alternative, #ffffff);
        padding: 1rem;
        //max-width: 760px;
        min-width: 260px;
      }
	  .header {
	    display: flex;
	    flex-direction: row;
	    justify-content: space-between;
	    align-items: center;
	  }
	  .header h2 {
        margin: 0;
        height: fit-content;
	  }
	  .content {
	    max-height: calc(100vh - 320px);
	    overflow: auto;
	  }
	`;
Pi([
  U({ type: Boolean, attribute: "open", reflect: !0 })
], lt.prototype, "open", 2);
lt = Pi([
  Te("ew-dialog")
], lt);
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Da = { ATTRIBUTE: 1, CHILD: 2, PROPERTY: 3, BOOLEAN_ATTRIBUTE: 4, EVENT: 5, ELEMENT: 6 }, Ea = (e) => (...t) => ({ _$litDirective$: e, values: t });
class Ca {
  constructor(t) {
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AT(t, i, a) {
    this._$Ct = t, this._$AM = i, this._$Ci = a;
  }
  _$AS(t, i) {
    return this.update(t, i);
  }
  update(t, i) {
    return this.render(...i);
  }
}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
class Ft extends Ca {
  constructor(t) {
    if (super(t), this.it = $, t.type !== Da.CHILD)
      throw Error(this.constructor.directiveName + "() can only be used in child bindings");
  }
  render(t) {
    if (t === $ || t == null)
      return this._t = void 0, this.it = t;
    if (t === de)
      return t;
    if (typeof t != "string")
      throw Error(this.constructor.directiveName + "() called with a non-string value");
    if (t === this.it)
      return this._t;
    this.it = t;
    const i = [t];
    return i.raw = i, this._t = { _$litType$: this.constructor.resultType, strings: i, values: [] };
  }
}
Ft.directiveName = "unsafeHTML", Ft.resultType = 1;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
class $t extends Ft {
}
$t.directiveName = "unsafeSVG", $t.resultType = 2;
const La = Ea($t), Oa = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024">

<path d="M512,894c-51.6,0-101.6-10.1-148.7-30c-45.5-19.2-86.3-46.8-121.4-81.9c-35.1-35.1-62.6-75.9-81.9-121.4
			c-19.9-47.1-30-97.1-30-148.7s10.1-101.6,30-148.7c19.2-45.5,46.8-86.3,81.9-121.4s75.9-62.6,121.4-81.9
			c47.1-19.9,97.1-30,148.7-30v54c-87.6,0-170,34.1-231.9,96.1S184,424.4,184,512s34.1,170,96.1,231.9S424.4,840,512,840
			s170-34.1,231.9-96.1S840,599.6,840,512h54c0,51.6-10.1,101.6-30,148.7c-19.2,45.5-46.8,86.3-81.9,121.4
			c-35.1,35.1-75.9,62.6-121.4,81.9C613.6,883.9,563.6,894,512,894z"/>
</svg>
`;
var Na = Object.defineProperty, Ia = Object.getOwnPropertyDescriptor, Ri = (e, t, i, a) => {
  for (var r = a > 1 ? void 0 : a ? Ia(t, i) : t, n = e.length - 1, s; n >= 0; n--)
    (s = e[n]) && (r = (a ? s(t, i, r) : s(r)) || r);
  return a && r && Na(t, i, r), r;
};
let ht = class extends J {
  constructor() {
    super(...arguments), this.loading = !1;
  }
  render() {
    return this.loading ? j`
	            <div class="loading-wrapper">
		            <div class="se-loading standard color-primary">
			            <div class="loading-icon">
	                        ${La(Oa)}
			            </div>
			            <div class="message">
				            <slot></slot>
			            </div>
		            </div>
	            </div>
	            <div class="loading-background"></div>
			` : $;
  }
};
ht.styles = Me`
	  :host {
        box-sizing: border-box;
        overflow: auto;
        position: relative;
        --se-container-color-background: var(--se-background-alternative, #ffffff);
        background-color: var(--se-container-color-background);
        color: var(--se-background-alternative-contrast);
	  }
      .loading-wrapper {
        position: absolute;
        inset: 0;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .loading-background {
        position: absolute;
        inset: 0;
        animation-duration: 0.2s;
        animation-fill-mode: both;
        z-index: 20;
      }
	  .se-loading {
        padding: 8px 8px 0;
        position: relative;
        z-index: 25;
        animation-duration: 0.2s;
        animation-fill-mode: both;
        display: flex;
        flex-direction: column;
        align-items: center;
      }
      .color-primary {
        color: var(--se-primary, #3dcd58);
      }
      .loading-icon {
        line-height: 128px;
        position: relative;
        font-size: 100px;
        height: 100px;
        width: 100px;
        animation: 1.5s linear 0s infinite normal none running clockwiseSpin;
        fill: currentcolor;
      }
      .message {
        padding: 0 16px 16px;
        color: var(--se-background-alternative-contrast, #333333);
      }
      @keyframes clockwiseSpin {
        0% {
          transform: rotate(0deg);
        }

        100% {
          transform: rotate(360deg);
        }
      }
	`;
Ri([
  U({ type: Boolean, attribute: "loading", reflect: !0 })
], ht.prototype, "loading", 2);
ht = Ri([
  Te("ew-loading")
], ht);
function Fi() {
  const e = Date.now().toString(36), t = Math.random().toString(36).substring(2);
  return e + t;
}
const yi = (e) => "0123456789ABCDEF".substring(e, e + 1), Lt = (e) => [yi(e >> 4 & 15), yi(e & 15)].join(""), ka = (e, t, i) => "#" + Lt(e) + Lt(t) + Lt(i), Pa = (e, t, i, a = 128, r = 127) => Array.from({ length: e }).map((n, s) => {
  const l = Math.sin(t.r * s + i.r) * r + a, o = Math.sin(t.g * s + i.g) * r + a, h = Math.sin(t.b * s + i.b) * r + a;
  return ka(l, o, h);
});
var Ra = Object.defineProperty, Fa = Object.getOwnPropertyDescriptor, Ze = (e, t, i, a) => {
  for (var r = a > 1 ? void 0 : a ? Fa(t, i) : t, n = e.length - 1, s; n >= 0; n--)
    (s = e[n]) && (r = (a ? s(t, i, r) : s(r)) || r);
  return a && r && Ra(t, i, r), r;
};
let pe = class extends J {
  constructor() {
    super(...arguments), this.options = [], this.disabled = !1;
  }
  handleSelectChange(e) {
    const i = {
      detail: { value: e.target.value },
      bubbles: !0,
      composed: !0
    };
    this.dispatchEvent(new CustomEvent("didChange", i));
  }
  render() {
    var t;
    const e = Fi();
    return j`
			<label class='ew-select-label' for='root'>${(t = this.label) != null ? t : ""}</label>
			<select
				class='ew-select-field'
				id=${e}
				@change=${this.handleSelectChange}
				?disabled=${this.disabled}
				aria-disabled=${this.disabled}
			>
				${this.options.length > 0 ? j`
						<option ?selected=${!this.selectedOption}>---</option>
						${this.options.map((i) => j`
							<option ?selected=${i === this.selectedOption} value=${i}>
								${i}
							</option>
						`)}
					` : j`<option>No options</option>`}
			</select>
		`;
  }
};
pe.styles = Me`
		.ew-select-label {
			display: block;
			max-width: none;
			text-align: left;
          	white-space: nowrap;
			line-height: 1.5;
			margin: 4px 0 4px 1px;
			align-items: flex-start;
			font-size: 14px;
			font-weight: bold;
		}
		.ew-select-field {
			font-size: 14px;
			padding: 10px 32px 10px 8px;
			appearance: none;
			border-radius: 0;
			background-image: linear-gradient(45deg, transparent 50%, gray 50%), linear-gradient(135deg, gray 50%, transparent 50%);
			background-position: calc(100% - 20px) calc(1em + 2px), calc(100% - 15px) calc(1em + 2px);
			background-size: 5px 5px, 5px 5px;
			background-repeat: no-repeat;
			border-color: var(--se-border, #9fa0a4) !important;
			width: 100%;
		    text-overflow: ellipsis;
	        white-space: nowrap;
		}
	`;
Ze([
  U({ type: String })
], pe.prototype, "label", 2);
Ze([
  U({ type: Array })
], pe.prototype, "options", 2);
Ze([
  U({ type: String })
], pe.prototype, "selectedOption", 2);
Ze([
  U({ type: Boolean })
], pe.prototype, "disabled", 2);
pe = Ze([
  Te("ew-select")
], pe);
var $a = Object.defineProperty, Ha = Object.getOwnPropertyDescriptor, Xt = (e, t, i, a) => {
  for (var r = a > 1 ? void 0 : a ? Ha(t, i) : t, n = e.length - 1, s; n >= 0; n--)
    (s = e[n]) && (r = (a ? s(t, i, r) : s(r)) || r);
  return a && r && $a(t, i, r), r;
};
let Fe = class extends J {
  constructor() {
    super(...arguments), this.checked = !1, this.labelSuffix = "";
  }
  toggleCheckbox(e) {
    e.preventDefault(), e.stopPropagation(), this.checked = !this.checked;
  }
  handleCheckboxClick(e) {
    const { checked: t } = e.target;
    this.checked = t;
  }
  render() {
    const e = Fi();
    return j`
            <label for="${e}">
	            <span class="label">
		            <slot></slot>
		            <span class="label-suffix">${this.labelSuffix}</span>
	            </span>	            
                <span class="container">
	                <input
			        	id="${e}"
				        type="checkbox"
				        tabindex="-1"
				        .checked=${this.checked}
				        @click=${this.handleCheckboxClick}
				        hidden
	                >
	            	<button class="checkmark" @click=${this.toggleCheckbox}></button>
                </span>
            </label>
		`;
  }
};
Fe.styles = Me`
	  label {
        position: relative;
        display: flex;
        column-gap: 8px;
        align-items: center;
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
        cursor: pointer;
	    padding: 8px 12px;
	  }
      :host(:not([dir="rtl"])) label {
        flex-flow: row-reverse;
        justify-content: flex-end;
	  }
	  .container {
        line-height: 0;
	  }
	  .label {
	    display: flex;
	    justify-content: space-between;
        flex: 1;
        flex-flow: row wrap-reverse;
        gap: 0.5rem;
	  }
      .label-suffix {
        opacity: 0.6;
	  }
      input {
        position: absolute !important;
        width: 1px !important;
        height: 1px !important;
        padding: 0 !important;
        margin: -1px !important;
        overflow: hidden !important;
        clip: rect(0px, 0px, 0px, 0px) !important;
        white-space: nowrap !important;
        border: 0 !important;
      }
	  .checkmark {
        position: relative;
        background-color: var(--se-background-alternative, #ffffff);
        border-width: 1px;
        border-style: solid;
        border-image: initial;
        border-radius: 2px;
        transition: all 0.2s ease 0s;
        box-sizing: border-box;
        flex: 0 0 auto;
        border-color: var(--se-border, #9fa0a4) !important;
        width: 20px;
        height: 20px;
	  }
	  .checkmark:after {
        content: "";
        position: absolute;
        top: 50%;
        bottom: auto;
	  }
      :host(:not([dir="rtl"])) .checkmark {
        padding-right: 0;
      }
      :host(:not([dir="rtl"])) .checkmark:after {
        left: 50%;
        right: auto;
        transform: translate(-50%, -50%);
      }
      :host([dir="rtl"]) .checkmark {
        padding-left: 0;
      }
      :host([dir="rtl"]) .checkmark:after {
        right: 50%;
        left: auto;
        transform: translate(50%, -50%);
      }
      label:hover input:not(:checked) + .checkmark:not(.indeterminate):not(.disabled):after {
        width: 8px;
        height: 8px;
        background-color: var(--se-primary, #3dcd58);
        opacity: .3;
      }
      input:checked + .checkmark:not(.indeterminate):not(.disabled):after {
        width: 16px;
        height: 12px;
        background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 12'><path fill='%23FFF' d='M14 0l-1 1-8 7-2-2H0v2l4 4h2l1-1 8-8 1-1-1-2h-1z'/></svg>")
      }
      input:checked + .checkmark:not(.indeterminate):not(.disabled) {
        background-color: var(--se-primary, #3dcd58);
      }
	`;
Xt([
  Mi()
], Fe.prototype, "checked", 2);
Xt([
  U({ type: String, attribute: "label-suffix", reflect: !0 })
], Fe.prototype, "labelSuffix", 2);
Fe = Xt([
  Te("ew-checkbox")
], Fe);
const za = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDI0IDEwMjQiPjxwYXRoIGQ9Ik00OTUgNjgwTDMyNCA1MTBjLTgtOC04LTIyIDAtMzBzMjItOCAzMCAwbDEzNyAxMzZWMTQ5YzAtMTEgOS0yMSAyMS0yMXMyMSAxMCAyMSAyMXY0NjdsMTM3LTEzNmM4LTggMjEtOCAzMCAwIDggOCA4IDIyIDAgMzBMNTI5IDY4MGMtNCA1LTEwIDktMTcgOXMtMTMtNC0xNy05em0zODAtODNjMTEgMCAyMSAxMCAyMSAyMnYyNTZjMCAxMS0xMCAyMS0yMSAyMUgxNDljLTExIDAtMjEtMTAtMjEtMjFWNjE5YzAtMTIgMTAtMjIgMjEtMjIgMTIgMCAyMiAxMCAyMiAyMnYyMzRoNjgyVjYxOWMwLTEyIDEwLTIyIDIyLTIyeiIvPjwvc3ZnPg==", Ua = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDI0IDEwMjQiPjxwYXRoIGQ9Ik01NzcgODk2YzQgMCA4LTEgMTEtMyA3LTQgMTEtMTEgMTEtMThWNTQ4bDI0Ni0zODdjNC03IDUtMTUgMS0yMnMtMTEtMTEtMTktMTFIMTk2Yy03IDAtMTQgNC0xOCAxMXMtNCAxNSAwIDIybDI0NSAzODN2MjUzYzAgOCA0IDE1IDEwIDE5bDEzNCA3N2MzIDIgNyAzIDEwIDN6TTQ2NSA3ODVWNTM4YzAtNC0xLTgtMy0xMUwyMzUgMTcxaDU1M0w1NTkgNTMwYy0yIDQtMyA4LTMgMTJ2Mjk2eiIvPjwvc3ZnPg==", Ya = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDI0IDEwMjQiPjxwYXRoIGQ9Ik04MzEgNDY5aDFjMjMgMCA0MyAxOSA0MiA0M3YyMTNjMCAyNC0xOSA0My00MiA0M2gtMjJ2MTA3YzAgMTEtMTAgMjEtMjIgMjFIMjM0Yy0xMiAwLTIyLTEwLTIyLTIxVjc2OGgtMjFjLTI0IDAtNDMtMTktNDMtNDNWNTEyYzAtMjQgMTktNDMgNDMtNDNoMjJWMTQ5YzAtMTEgMTAtMjEgMjItMjFoMzYxYzYgMCAxMiAyIDE3IDZsMTkwIDE5MmM0IDQgNyAxMCA3IDE1djEyOGgyMXptLTY0IDBWMzYzSDU5NmMtMTEgMC0yMS0xMC0yMS0yMlYxNzFIMjU1djI5OGg1MTJ6TTYxOCAyMDF2MTE2aDExN3ptLTc0IDQzOWMzIDQgNSA5IDQgMTQgMCA2LTMgMTMtOSAxNi03IDUtMTUgOC0yMyA3LTYgMC0xMS0xLTE3LTMtNC0yLTctNS05LTktMy00LTUtOC03LTEyLTEtNC0zLTctNi0xMC0yLTItNi0zLTktMy0zLTEtNi0xLTkgMS0zIDMtNCA2LTQgMTAgMCA3IDIgMTUgNiAyMSA1IDcgMTEgMTIgMTggMTcgMTIgNiAyNSA5IDM5IDkgMTEgMCAyMy0yIDM0LTcgOC00IDE2LTEwIDIxLTE4czgtMTcgOC0yNmMwLTctMi0xNC01LTIwLTMtNS03LTEwLTEyLTEzLTUtNC0xMS04LTE4LTEwbC0yNC03LTE2LTMtOS01Yy0yLTEtNS0zLTctNS0yLTMtMy02LTItOSAwLTUgMy0xMCA3LTEzIDYtNCAxMy02IDIwLTUgNy0xIDE0IDEgMTkgNSA1IDMgOSA4IDExIDE0bDYgOWM1IDUgMTMgNSAxOCAwIDMtMyA1LTYgNS0xMCAwLTUtMi05LTQtMTMtMi01LTYtOS0xMC0xMi01LTUtMTEtOC0xNy0xMC05LTMtMTctNC0yNi00LTEwIDAtMjEgMi0zMiA1LTggNC0xNSA5LTIwIDE2cy03IDE1LTcgMjMgMiAxNyA3IDIzYzQgNyAxMSAxMiAxOCAxNSA5IDQgMTkgNyAyOCA5IDcgMiAxNCAzIDIxIDYgNCAxIDkgNCAxMiA3em01Mi04OWMyIDMgMyA1IDUgN3Y2YzEgMSAxIDMgMCA1bDM4IDEwM2MyIDMgNCA3IDQgMTFsOCA2YzIgMyA1IDUgOCA3czcgMyAxMSAyYzQgMSA3IDAgMTEtMiAzLTIgNS00IDctN3MzLTYgNC05YzItNCAzLTggNS0xMWwzOC0xMDR2LTE2YzAtMi0xLTUtMi03LTItMi0zLTQtNi01LTItMS01LTEtNyAwLTQgMC03IDEtOSAyLTIgMi00IDQtNSA2LTEgNC0zIDgtNCAxMmwtMzYgMTA2LTM2LTEwNWMtMS02LTQtMTEtNy0xNy0zLTMtNy01LTExLTQtNCAwLTggMS0xMSA0cy01IDYtNSAxMHptLTI2OCA5OWMtMy05LTUtMTktNS0yOS0xLTE1IDMtMzAgMTItNDIgNy0xMCAxOS0xNiAzMS0xNSA4LTEgMTUgMiAyMSA2czExIDEwIDE1IDE3YzIgNCA0IDcgNyAxMCAzIDIgNyAyIDExIDEgMyAwIDctMSA5LTQgMi0yIDQtNiA0LTkgMC04LTMtMTYtOC0yMi02LTgtMTQtMTUtMjMtMTktMTEtNS0yMy03LTM0LTctMTAgMC0yMCAyLTMwIDUtOSA0LTE3IDktMjQgMTYtNyA4LTEzIDE3LTE2IDI3LTUgMTAtNyAyMS04IDMzIDAgNyAxIDE1IDMgMjIgMSA3IDIgMTQgNSAyMSAzIDYgNyAxMSAxMiAxNiA0IDUgMTAgMTAgMTUgMTMgNiA0IDEzIDYgMTkgOCA4IDEgMTUgMiAyMyAyIDEwIDAgMjAtMSAyOS01IDctMyAxNC04IDIwLTE0IDUtNSA5LTExIDEyLTE3IDItNSAzLTExIDQtMTcgMC00LTItNy01LTEwLTItMi02LTMtOS0zLTQtMS04IDEtMTAgMy0yIDQtNCA3LTUgMTEtMyA4LTggMTUtMTQgMjAtNyA0LTE2IDctMjQgN3MtMTUtMi0yMi02Yy03LTUtMTItMTEtMTUtMTl6bTQzOSAyMDN2LTg1SDI1NXY4NWg1MTJ6Ii8+PC9zdmc+", Wa = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDI0IDEwMjQiPjxwYXRoIGQ9Ik04ODEgMjEwYzExIDMgMTcgMTUgMTQgMjZsLTQ2IDE1NGMwIDEgMCAxLTEgMi0yIDUtNiA5LTExIDEyLTYgMi0xMyAyLTE4LTFsLTE0MS0zMmMtMTItMy0xOS0xNC0xNi0yNSAyLTEyIDE0LTE5IDI1LTE2bDEwMyAyM2MtMzYtNjItOTItMTExLTE1OC0xMzgtNzctMzEtMTYzLTMxLTI0MCAwLTgwIDMzLTE0NCA5Ny0xNzYgMTc3LTE2IDM4LTI0IDc5LTI0IDEyMCAwIDEyLTEwIDIxLTIxIDIxLTE0IDItMjItOS0yMi0yMSAwLTQ3IDktOTMgMjctMTM2IDM3LTkxIDEwOS0xNjQgMjAwLTIwMCA4OC0zNiAxODQtMzYgMjcyIDAgNzQgMjkgMTM2IDgzIDE3NiAxNTBsMzAtMTAyYzQtMTEgMTUtMTggMjctMTR6bS0yOCAyODFjMTIgMCAyMiA5IDIyIDIxIDAgNDctOSA5My0yNyAxMzYtMzcgOTEtMTEwIDE2NC0yMDAgMjAwLTQ0IDE4LTkwIDI3LTEzNiAyN3MtOTItOS0xMzYtMjdjLTc0LTI5LTEzNi04My0xNzYtMTUwbC0zMCAxMDJjLTMgOS0xMiAxNS0yMSAxNS0yIDAtNCAwLTYtMS0xMS0zLTE4LTE1LTE0LTI2bDQ1LTE1MWMxLTcgNi0xNCAxMy0xNyA2LTIgMTMtMiAxOCAxbDE0MSAzMmMxMiAzIDE5IDE0IDE2IDI1LTMgMTItMTQgMTktMjUgMTZsLTEwMy0yM2MzNiA2MiA5MiAxMTEgMTU4IDEzOCA3NyAzMSAxNjMgMzEgMjQwIDAgODAtMzMgMTQ0LTk3IDE3Ni0xNzcgMTYtMzggMjQtNzkgMjQtMTIwIDAtMTIgMTAtMjEgMjEtMjF6Ii8+PC9zdmc+";
var Ba = Object.defineProperty, Va = Object.getOwnPropertyDescriptor, X = (e, t, i, a) => {
  for (var r = a > 1 ? void 0 : a ? Va(t, i) : t, n = e.length - 1, s; n >= 0; n--)
    (s = e[n]) && (r = (a ? s(t, i, r) : s(r)) || r);
  return a && r && Ba(t, i, r), r;
};
const _i = "ew-log-viewer-visibility";
function Xa(e) {
  const t = (i) => i !== "";
  return e.split(`\r
`).filter(t);
}
function Ot(e, t = "/") {
  const i = ".", a = e.replace(/^\//, "").split(t), {
    length: r,
    0: n,
    [a.length - 1]: s,
    ...l
  } = a;
  return {
    length: r,
    root: r !== 1 ? n : i,
    path: r <= 2 ? "/" : Object.values(l).join("/"),
    ...s !== "" && { filename: s }
  };
}
let W = class extends J {
  constructor() {
    super(...arguments), this.chartTitle = "", this.legendPosition = "side", this.series = {}, this.files = [], this.currentFile = void 0, this.isLoading = !1, this.rootOptions = [], this.pathOptions = [], this.filenameOptions = [], this.drawChartCallback = (e, t) => {
      var i, a;
      if (this.isLoading = !1, t) {
        console.log(e), this.series = W.getSeriesFromChart(e);
        const r = Object.keys(this.series).length;
        e.updateOptions({
          colors: Pa(
            r,
            { r: 1.666, g: 2.666, b: 3.666 },
            { r: 0, g: 0, b: 0 }
          )
        });
        const n = this.getSeriesVisibilityFromLocalStorage();
        for (const s of [...(i = this._visibilityCheckboxes) != null ? i : []]) {
          const l = Object.entries(n), [, o] = (a = l.find(([h]) => h === s.dataset.setIndex)) != null ? a : ["dummy-key", l.length === 0];
          s.checked = o;
        }
        this.setSeriesVisibility(n);
      }
    };
  }
  getVisibilitiesFromCheckboxes() {
    var e;
    return [...(e = this._visibilityCheckboxes) != null ? e : []].filter((t) => !!t.dataset.setIndex).reduce((t, i) => ({
      ...t,
      [i.dataset.setIndex]: i.checked
    }), {});
  }
  disconnectedCallback() {
    super.disconnectedCallback(), this.chart && this.chart.destroy();
  }
  render() {
    const e = Object.entries(this.series);
    return j`
            <slot hidden @change=${this._onChange} @change2=${this._onChange}></slot>
            <div class="header">
	            <div class='fields'>
	                <div class='fields-item'>
	                    <ew-select
	                        label="Root filesystem"
	                        options=${JSON.stringify(this.rootOptions)}
	                        @didChange=${this.handleRootChange}
	                        ?disabled=${this.files.length === 0}
	                    />
	                </div>
	                <div class='fields-item'>
	                    <ew-select
	                        label="Folder"
	                        options=${JSON.stringify(this.pathOptions)}
	                        @didChange=${this.handlePathChange}
	                        ?disabled=${this.pathOptions.length === 0 || !this.root}
	                    />
	                </div>
	                <div class='fields-item'>
	                    <ew-select
	                        label="Filename"
	                        options=${JSON.stringify(this.filenameOptions)}
	                        @didChange=${this.handleFilenameChange}
	                        ?disabled=${this.filenameOptions.length === 0 || !this.root || !this.path}
	                    />
	                </div>
	            </div>
	            <div class='actions'>
                    <div class="data">
	                    <ew-button option="flat" ?disabled=${!(this.root && this.path && this.filename) || this.currentFile} @click=${this.drawChart}>
	                        Load Log
	                    </ew-button>
	                    <ew-button
                            icon-only
                            option="outline"
                            ?disabled=${!(this.root && this.path && this.filename) || !this.currentFile}
                            @click=${this.drawChart}
	                    >
	                        <img src=${Wa} slot="icon"  alt="Refresh Icon"/>
	                    </ew-button>
                    </div>
		            <div class="settings">
			            <ew-button
		                    icon-only
				            option="outline"
		                    ?disabled=${Object.entries(this.series).length === 0}
		                    @click=${this.handleDownloadModalOpen}
			            >
		                    <img src=${za} slot="icon"  alt="Download Icon"/>
			            </ew-button>
		                <ew-button
			                icon-only
			                option="outline"
			                ?disabled=${Object.entries(this.series).length === 0 || !this.currentFile}
			                @click=${this.handleFilterModalOpen}
		                >
		                    <img src=${Ua} slot="icon"  alt="Filter Icon"/>
		                </ew-button>
		                <ew-dialog id="download-dialog">
		                    <div slot="title">Download CSV</div>
		                    <div class="download-dialog-content">
			                    ${this.files.map(({ filename: t, root: i, path: a }) => j`
				                    <a href="/${i}/${a}/${t}" download=${t}>
                                        <ew-button option="outline" full>
                                            <img src=${Ya} slot="icon"  alt="CSV File Icon"/>
                                            <span class="download-dialog-content-item">
	                                            <strong>${t}</strong>
	                                            <small>(${i}/${a})</small>
                                            </span>
                                        </ew-button>
				                    </a>
			                    `)} 
		                    </div>
		                </ew-dialog>
                        <ew-dialog id="filter-dialog">
                            <div slot="title">Series Visibility</div>
                            <div class="filter-dialog-content">
                                ${e.length > 0 ? e.map(([t, i]) => j`
									<ew-checkbox
										name="series-visibility[]"
										title="${i}"
										label-suffix="(#${parseInt(t) + 1})"
										data-set-index=${t}
									>
										${i}
									</ew-checkbox>
								`) : j`<p>No series available.</p>`}
                            </div>
                            <div slot="footer" class="footer">
                                <div class="extra-actions">
                                    <ew-button option="outline" @click=${this.handleSaveDefaultVisibilityClick}>Save as default</ew-button>
                                    <ew-button option="outline" @click=${this.handleSaveFileVisibilityClick}>Save for ${this.filename}</ew-button>
                                </div>
                                <div class="main-actions">
                                    <ew-button @click=${this.handleFilterConfirmClick}>Show Series</ew-button>
                                </div>
                            </div>
                        </ew-dialog>
		            </div>
            	</div>
            </div>
            <div class="content" style=${this.legendPosition === "top" && "flex-direction: column-reverse"}>
	            ${j`
                    <ew-loading class="chart-loader" .loading=${this.isLoading}>Drawing chart...</ew-loading>
                    <div class="chart-container">
	                    <div class="chart" style=${this.legendPosition === "top" && "flex-direction: column-reverse"}></div>
                        <div class=${`legend legend-${this.legendPosition}`}></div>
                    </div>
	            `}
            </div>
        `;
  }
  drawChart() {
    this.chart && this.chart.destroy(), this.isLoading = !0;
    const e = [this.root, this.path !== "/" ? this.path : void 0, this.filename].join("/");
    if (this.currentFile = Ot(e), this._chartContainer)
      try {
        const t = this.drawChartCallback;
        this.chart = new v(
          this._chartContainer,
          `${window.location.origin}/${e}?t=${Date.now()}`,
          {
            legend: "always",
            title: this.chartTitle,
            hideOverlayOnMouseOut: !1,
            labelsDiv: this._legendContainer,
            delimiter: ";",
            labelsSeparateLines: this.legendPosition === "side",
            strokeWidth: 1.3,
            drawCallback: t
          }
        ), this.chart.ready(() => {
          this.isLoading = !1;
        }), console.log(this.chart);
      } catch (t) {
        this.isLoading = !1, console.error(t), alert("An error occured.");
      }
  }
  static getSeriesFromChart(e) {
    var t;
    return ((t = e.getLabels()) != null ? t : []).reduce((i, a, r) => e.datasetIndex_ && !isNaN(e.datasetIndex_[r]) ? {
      ...i,
      [e.datasetIndex_[r]]: a
    } : i, {});
  }
  setSeriesVisibility(e) {
    if (this.chart)
      this.chart.setVisibility(e, !0);
    else
      throw new Error("No chart instance available.");
  }
  saveSeriesVisibilityToLocalStorage(e, t) {
    window.localStorage.setItem(t, JSON.stringify(e));
  }
  getSeriesVisibilityFromLocalStorage() {
    var t;
    const e = (t = this.currentFile && window.localStorage.getItem(`${this.currentFile.filename}-visibility`)) != null ? t : window.localStorage.getItem(_i);
    return JSON.parse(e != null ? e : "{}");
  }
  handleFilterConfirmClick() {
    var e;
    this.setSeriesVisibility(this.getVisibilitiesFromCheckboxes()), (e = this._filterDialog) == null || e.close();
  }
  handleSaveFileVisibilityClick() {
    this.currentFile ? this.saveSeriesVisibilityToLocalStorage(this.getVisibilitiesFromCheckboxes(), `${this.currentFile.filename}-visibility`) : console.error("No file selected");
  }
  handleSaveDefaultVisibilityClick() {
    this.saveSeriesVisibilityToLocalStorage(this.getVisibilitiesFromCheckboxes(), _i);
  }
  handleDownloadModalOpen() {
    this._downloadDialog && (this._downloadDialog.open = !0);
  }
  handleFilterModalOpen() {
    this._filterDialog && (this._filterDialog.open = !0);
  }
  handleRootChange(e) {
    this.root = e.detail.value, this.path = void 0, this.filename = void 0, this.currentFile = void 0, this.pathOptions = [...new Set(
      this.files.filter((t) => t.root === this.root).map((t) => t.path)
    )];
  }
  handlePathChange(e) {
    this.path = e.detail.value, this.filename = void 0, this.currentFile = void 0, this.filenameOptions = [...new Set(
      this.files.filter((t) => t.root === this.root).filter((t) => t.path === this.path).reduce((t, i) => i.filename !== void 0 ? [...t, i.filename] : t, [])
    )], this.filename = this.filename && this.filenameOptions.includes(this.filename) ? this.filename : void 0;
  }
  handleFilenameChange(e) {
    this.filename = e.detail.value, this.currentFile = void 0;
  }
  _onChange(e) {
    var i;
    const t = (i = e.target) == null ? void 0 : i.value;
    t.endsWith(".csv") ? console.log(Ot(t)) : t !== "###" ? fetch(window.location.origin + "/" + t).then((a) => a.text()).then((a) => Xa(a)).then((a) => {
      this.files = a.map((r) => Ot(r)), this.rootOptions = [...new Set(this.files.map((r) => r.root))];
    }).catch((a) => console.error(a)) : console.error("Filepath not valid.");
  }
};
W.styles = Me`
      :host {
        display: flex;
        gap: 24px;
        padding: 16px;
        flex-grow: 1;
        flex-direction: column;
        max-height: 100%;
        font: normal 14px Arial, sans-serif;
      }
	  .header {
        gap: 12px;
        display: flex;
        flex-direction: column;
	  }
      .content {
        display: flex;
        position: relative;
        flex: 1;
        width: 100%;
        flex-direction: column;
		padding: 12px 0;
		background-color: var(--se-background-alternative, #ffffff);
		box-sizing: border-box;
      }
	  .chart-loader[loading] {
        height: 100%;
        position: absolute;
        z-index: 10;
        width: 100%;
	  }
	  .chart-container {
        display: flex;
        gap: 16px;
        flex: 1;
        width: 100%;
	  }
      .chart {
        flex: 1;
        height: 100%;
        width: calc(100% - 200px);
      }
      .legend-container {
        flex: 0 1;
      }
      .legend.legend-top {

      }
      .legend.legend-side {
        flex-basis: 200px;
      }
      .actions {
        flex: 1 1 auto;
        display: flex;
        flex-wrap: wrap;
        gap: 12px;
        align-items: flex-end;
        justify-content: space-between;
      }
	  .data {
	    flex: 0 0 auto;
	    display: flex;
	    flex-wrap: nowrap;
	    gap: 4px;
	    align-items: start;
	  }
      .settings {
        flex: 0 1 auto;
        display: flex;
        flex-wrap: wrap;
        gap: 4px;
        align-items: flex-end;
      }
      .fields {
        display: flex;
        max-width: 900px;
        flex: 60 1 auto;
        flex-wrap: wrap;
        row-gap: 4px;
        column-gap: 8px;
      }

      .fields-item {
        flex: 1;
        max-width: 300px;
      }
      ew-dialog .footer {
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
        column-gap: 20px;
        row-gap: 8px;
      }
      ew-dialog .footer .extra-actions,
      ew-dialog .footer .main-actions {
        display: flex;
        flex: 1 1 auto;
        flex-wrap: wrap;
        column-gap: 8px;
        row-gap: 4px;
      }
      ew-dialog .footer .main-actions {
        justify-content: end;
      }
      ew-dialog#download-dialog .download-dialog-content,
      ew-dialog#filter-dialog .filter-dialog-content {
        display: grid;
        box-sizing: border-box;
        width: 90vw;
        grid-template-columns: repeat(auto-fill, minmax(220px, auto));
      }
      ew-dialog#download-dialog .download-dialog-content {
        gap: 10px;
      }
      ew-dialog#download-dialog .download-dialog-content-item {
        display: flex;
        flex-direction: column;
        flex: 1 0 auto;
        align-items: flex-start;
      }
      @media screen and (min-width: 640px) {
        ew-dialog#download-dialog .download-dialog-content,
        ew-dialog#filter-dialog .filter-dialog-content {
          width: 70vw;
          column-gap: 1rem;
        }        
      }
      @media screen and (min-width: 768px) {
        .header {
			flex-direction: row;
        }
        ew-dialog#download-dialog .download-dialog-content,
        ew-dialog#filter-dialog .filter-dialog-content {
          width: 60vw;
        }
      }
      @media screen and (min-width: 992px) {
        ew-dialog#download-dialog .download-dialog-content,
        ew-dialog#filter-dialog .filter-dialog-content {
          width: 60vw;
        }
      }
      @media screen and (min-width: 1024px) {
        ew-dialog#download-dialog .download-dialog-content,
        ew-dialog#filter-dialog .filter-dialog-content {
          width: 50vw;
          column-gap: 2rem;
        }
      }
      @media screen and (min-width: 1280px) {
        ew-dialog#download-dialog .download-dialog-content,
        ew-dialog#filter-dialog .filter-dialog-content {
          width: 40vw;
        }
      }
	`;
X([
  U({ type: String })
], W.prototype, "chartTitle", 2);
X([
  U({ type: String })
], W.prototype, "legendPosition", 2);
X([
  Mi()
], W.prototype, "series", 2);
X([
  U({ attribute: !1 })
], W.prototype, "files", 2);
X([
  U({ type: String })
], W.prototype, "root", 2);
X([
  U({ type: String })
], W.prototype, "path", 2);
X([
  U({ type: String })
], W.prototype, "filename", 2);
X([
  U({ attribute: !1 })
], W.prototype, "currentFile", 2);
X([
  U({ type: Boolean })
], W.prototype, "isLoading", 2);
X([
  ct(".chart")
], W.prototype, "_chartContainer", 2);
X([
  ct(".legend")
], W.prototype, "_legendContainer", 2);
X([
  ct("#download-dialog")
], W.prototype, "_downloadDialog", 2);
X([
  ct("#filter-dialog")
], W.prototype, "_filterDialog", 2);
X([
  ta('[name="series-visibility[]"]')
], W.prototype, "_visibilityCheckboxes", 2);
W = X([
  Te("ew-log-viewer")
], W);
