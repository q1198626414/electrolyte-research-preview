/* saddle3d.js — Plotly 交互局部马鞍面（真实 FD Hessian 双主频，与 fig12 同式）
   E(q-,q+) = 0.5*(λ-·q-² + λ+·q+²)，λ∓ = ∓/±ω²；能量与坐标均归一化。 */
"use strict";

(function () {
  window.renderSaddle3D = function (boxId) {
    if (typeof Plotly === "undefined" || !window.SADDLE) return;
    var wN = window.SADDLE.wNeg, wP = window.SADDLE.wPos;
    var lamN = -Math.abs(wN) * Math.abs(wN), lamP = Math.abs(wP) * Math.abs(wP);
    var N = 41, q = [];
    for (var i = 0; i < N; i++) q.push(-1 + 2 * i / (N - 1));
    var maxAbs = 0.5 * Math.max(Math.abs(lamN), lamP);
    // Plotly surface rows follow y, and columns follow x.
    var z = q.map(function (qStable) {
      return q.map(function (qUnstable) {
        return 0.5 * (lamN * qUnstable * qUnstable + lamP * qStable * qStable) / maxAbs;
      });
    });
    var ready = Plotly.newPlot(boxId, [{
      type: "surface", z: z, x: q, y: q,
      cmin: -1, cmax: 1,
      colorscale: [["0.0", "#B45309"], ["0.5", "#F7F9F8"], ["1.0", "#0F766E"]],
      hovertemplate: "q₋ %{x:.2f}<br>q₊ %{y:.2f}<br>E (norm.) %{z:.3f}<extra></extra>",
      showscale: false, contours: { x: { show: true, size: 0.25, color: "#B7C2BE", width: 1 },
                                    y: { show: true, size: 0.25, color: "#B7C2BE", width: 1 } }
    }], {
      margin: { l: 0, r: 0, t: 8, b: 0 },
      scene: {
        xaxis: { title: { text: "unstable q₋", font: { size: 11 } }, showgrid: false },
        yaxis: { title: { text: "stable q₊", font: { size: 11 } }, showgrid: false },
        zaxis: { title: { text: "E (norm.)", font: { size: 11 } }, showgrid: false },
        camera: { eye: { x: 1.55, y: -1.35, z: 0.9 } },
        aspectmode: "cube"
      },
      paper_bgcolor: "#FFFFFF", plot_bgcolor: "#FFFFFF"
    }, { displayModeBar: false, responsive: true });
    return ready.then(function (plot) {
      plot.insertAdjacentHTML("afterbegin",
        '<span style="position:absolute;left:10px;top:8px;font-size:12px;color:#5F6E6A;z-index:5">'
        + "局部谐振近似 · ω₋=" + wN + " / ω₊=+" + wP + " cm⁻¹</span>");
    });
  };
})();
