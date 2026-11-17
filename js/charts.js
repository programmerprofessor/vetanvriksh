window.HRMS = window.HRMS || {};
(function (HRMS) {
  'use strict';
  var U = HRMS.Util;
  var PALETTE = ['#2f5de3', '#0f7a56', '#b45309', '#7c3aed', '#0369a1', '#be185d', '#4d7c0f', '#c2410c'];

  function donut(data, size) {
    size = size || 150;
    var total = data.reduce(function (s, d) { return s + d.value; }, 0) || 1;
    var r = size / 2 - 12, cx = size / 2, cy = size / 2, circ = 2 * Math.PI * r;
    var offset = 0;
    var segs = data.map(function (d, i) {
      var frac = d.value / total;
      var dash = frac * circ;
      var seg = '<circle cx="' + cx + '" cy="' + cy + '" r="' + r + '" fill="none" stroke="' + (d.color || PALETTE[i % PALETTE.length]) +
        '" stroke-width="18" stroke-dasharray="' + dash + ' ' + (circ - dash) + '" stroke-dashoffset="' + (-offset) + '" transform="rotate(-90 ' + cx + ' ' + cy + ')"/>';
      offset += dash;
      return seg;
    }).join('');
    return '<svg class="chart" viewBox="0 0 ' + size + ' ' + size + '" width="' + size + '" height="' + size + '">' +
      '<circle cx="' + cx + '" cy="' + cy + '" r="' + r + '" fill="none" stroke="var(--c-surface-3)" stroke-width="18"/>' + segs +
      '<text x="' + cx + '" y="' + (cy - 2) + '" text-anchor="middle" font-size="17" font-weight="700" fill="var(--c-text)">' + total + '</text>' +
      '<text x="' + cx + '" y="' + (cy + 15) + '" text-anchor="middle" font-size="9" fill="var(--c-text-muted)">TOTAL</text></svg>';
  }

  function legend(data) {
    return '<div class="chart-legend">' + data.map(function (d, i) {
      return '<span><i style="background:' + (d.color || PALETTE[i % PALETTE.length]) + '"></i>' + U.esc(d.label) + ' · <strong>' + d.value + '</strong></span>';
    }).join('') + '</div>';
  }

  function bars(data, opts) {
    opts = opts || {};
    var h = opts.height || 160, max = Math.max.apply(null, data.map(function (d) { return d.value; }).concat([1]));
    var w = 100 / data.length;
    var rects = data.map(function (d, i) {
      var bh = (d.value / max) * (h - 34);
      var x = i * w + w * 0.2, bw = w * 0.6;
      return '<rect x="' + x + '%" y="' + (h - 22 - bh) + '" width="' + bw + '%" height="' + bh + '" rx="3" fill="' + (d.color || PALETTE[i % PALETTE.length]) + '"/>' +
        '<text x="' + (x + bw / 2) + '%" y="' + (h - 8) + '" text-anchor="middle" font-size="8.5" fill="var(--c-text-muted)">' + U.esc(d.label) + '</text>' +
        '<text x="' + (x + bw / 2) + '%" y="' + (h - 28 - bh) + '" text-anchor="middle" font-size="9" font-weight="700" fill="var(--c-text)">' + d.value + '</text>';
    }).join('');
    return '<svg class="chart" viewBox="0 0 100 ' + h + '" preserveAspectRatio="none" height="' + h + '">' + rects + '</svg>';
  }

  function line(data, opts) {
    opts = opts || {};
    var h = opts.height || 170, w = 300;
    var max = Math.max.apply(null, data.map(function (d) { return d.value; }).concat([1]));
    var step = w / Math.max(1, data.length - 1);
    var pts = data.map(function (d, i) { return (i * step) + ',' + (h - 26 - (d.value / max) * (h - 46)); }).join(' ');
    var area = '0,' + (h - 26) + ' ' + pts + ' ' + w + ',' + (h - 26);
    var dots = data.map(function (d, i) {
      var x = i * step, y = h - 26 - (d.value / max) * (h - 46);
      return '<circle cx="' + x + '" cy="' + y + '" r="2.6" fill="var(--c-primary)"/>' +
        '<text x="' + x + '" y="' + (h - 8) + '" text-anchor="middle" font-size="8" fill="var(--c-text-muted)">' + U.esc(d.label) + '</text>';
    }).join('');
    return '<svg class="chart" viewBox="0 0 ' + w + ' ' + h + '" preserveAspectRatio="none" height="' + h + '">' +
      '<polygon points="' + area + '" fill="var(--c-primary-soft)" opacity=".7"/>' +
      '<polyline points="' + pts + '" fill="none" stroke="var(--c-primary)" stroke-width="2" stroke-linejoin="round"/>' +
      dots + '</svg>';
  }

  function hbars(data, opts) {
    opts = opts || {};
    var max = Math.max.apply(null, data.map(function (d) { return d.value; }).concat([1]));
    return data.map(function (d, i) {
      var pct = Math.round((d.value / max) * 100);
      return '<div class="bar-row"><span class="truncate">' + U.esc(d.label) + '</span>' +
        '<span class="track"><i style="width:' + pct + '%;background:' + (d.color || PALETTE[i % PALETTE.length]) + '"></i></span>' +
        '<span class="val">' + d.value + '</span></div>';
    }).join('');
  }

  HRMS.Charts = { donut: donut, legend: legend, bars: bars, line: line, hbars: hbars, palette: PALETTE };
})(window.HRMS);