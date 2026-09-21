// scripts/TK4R8-headcount.js — Employee headcount isotype matrix

document.addEventListener("DOMContentLoaded", function () {
  var container = document.querySelector(".TK4R8-chart-container");
  if (!container) return;

  // 1. Data
  var years = ["FY16", "FY17", "FY18", "FY19", "FY20", "FY21", "FY22", "FY23", "FY24", "FY25", "FY26"];
  var tcs = [353843, 387223, 394998, 424285, 448464, 488649, 592195, 614795, 601546, 607979, 584519];
  var infosys = [194044, 200364, 204107, 228123, 242371, 259619, 314015, 343234, 317240, 323578, 328594];
  var wipro = [156831, 165481, 159923, 171425, 182886, 197712, 246743, 258570, 232614, 233346, 242156];

  // matrix settings
  var COLUMNS = 3; // columns per bar
  var UNIT = 5000; // employees per cell
  var CELL_SIZE = 9; // px, must match .TK4R8-cell width/height
  var GAP = 3;

  var data = years.map(function (y, i) {
    var combined = infosys[i] + wipro[i];
    var t = Math.round(tcs[i] / UNIT);
    var inf = Math.round(infosys[i] / UNIT);
    var w = Math.round(wipro[i] / UNIT);
    return {
      year: y,
      tcs: tcs[i], infosys: infosys[i], wipro: wipro[i], combined: combined,
      tCells: t, infCells: inf, wCells: w,
      combinedCells: inf + w
    };
  });

  var maxCells = Math.max.apply(null, data.map(function (d) { return Math.max(d.tCells, d.combinedCells); }));
  var ROWS = Math.ceil(maxCells / COLUMNS);
  var plotHeight = ROWS * (CELL_SIZE + GAP);

  container.style.setProperty("--TK4R8-plot-height", plotHeight + "px");

  // 2. DOM references
  var yAxis = container.querySelector(".TK4R8-y-axis");
  var groupsWrapper = container.querySelector(".TK4R8-groups-wrapper");
  var xAxis = container.querySelector(".TK4R8-x-axis");
  var tooltip = document.querySelector(".TK4R8-tooltip");

  // y-axis labels (top = max, bottom = 0)
  var yTicks = 5;
  for (var t = yTicks; t >= 0; t--) {
    var val = Math.round((maxCells * UNIT) * (t / yTicks));
    var lbl = document.createElement("div");
    lbl.textContent = (val / 1000).toFixed(0) + "k";
    yAxis.appendChild(lbl);
  }

  var barWidth = COLUMNS * (CELL_SIZE + GAP);
  var groupWidth = barWidth * 2 + 6; // two bars + gap between them

  function buildMatrix(cellTypesInOrder, tooltipHtml) {
    var totalSlots = ROWS * COLUMNS;
    var cellType = new Array(totalSlots).fill("empty");
    var idx = 0;
    cellTypesInOrder.forEach(function (seg) {
      for (var i = 0; i < seg.count && idx < totalSlots; i++, idx++) cellType[idx] = seg.cls;
    });

    var fillOrder = [];
    for (var r = ROWS - 1; r >= 0; r--) {
      for (var c = 0; c < COLUMNS; c++) {
        fillOrder.push({ row: r, col: c });
      }
    }

    var grid = [];
    for (var r = 0; r < ROWS; r++) { grid.push(new Array(COLUMNS).fill("empty")); }
    fillOrder.forEach(function (pos, i) {
      grid[pos.row][pos.col] = cellType[i];
    });

    var matrix = document.createElement("div");
    matrix.className = "TK4R8-matrix";
    matrix.style.gap = GAP + "px";
    matrix.style.gridTemplateColumns = "repeat(" + COLUMNS + ", " + CELL_SIZE + "px)";
    matrix.style.gridTemplateRows = "repeat(" + ROWS + ", " + CELL_SIZE + "px)";

    for (var r = 0; r < ROWS; r++) {
      for (var c = 0; c < COLUMNS; c++) {
        var cell = document.createElement("div");
        var cls = grid[r][c];
        cell.className = "TK4R8-cell" + (cls !== "empty" ? " TK4R8-" + cls : "");
        matrix.appendChild(cell);
      }
    }

    var barBlock = document.createElement("div");
    barBlock.className = "TK4R8-bar-block";
    barBlock.style.width = barWidth + "px";
    barBlock.appendChild(matrix);
    barBlock.addEventListener("mousemove", function (ev) {
      tooltip.style.display = "block";
      tooltip.style.left = (ev.clientX + 14) + "px";
      tooltip.style.top = (ev.clientY + 14) + "px";
      tooltip.innerHTML = tooltipHtml;
    });
    barBlock.addEventListener("mouseleave", function () {
      tooltip.style.display = "none";
    });
    return barBlock;
  }

  data.forEach(function (d) {
    var groupBlock = document.createElement("div");
    groupBlock.className = "TK4R8-group-block";
    groupBlock.style.width = groupWidth + "px";

    var groupBars = document.createElement("div");
    groupBars.className = "TK4R8-group-bars";

    var tcsTooltip = "<strong>" + d.year + " — TCS</strong><br>" + d.tcs.toLocaleString();
    var combinedTooltip = "<strong>" + d.year + " — Infosys + Wipro</strong><br>" +
      "Infosys: " + d.infosys.toLocaleString() + "<br>" +
      "Wipro: " + d.wipro.toLocaleString() + "<br>" +
      "Combined: " + d.combined.toLocaleString();

    var tcsBar = buildMatrix([{ cls: "filled-tcs", count: d.tCells }], tcsTooltip);
    var combinedBar = buildMatrix(
      [{ cls: "filled-infosys", count: d.infCells }, { cls: "filled-wipro", count: d.wCells }],
      combinedTooltip
    );

    groupBars.appendChild(tcsBar);
    groupBars.appendChild(combinedBar);
    groupBlock.appendChild(groupBars);
    groupsWrapper.appendChild(groupBlock);

    var xLabel = document.createElement("span");
    xLabel.style.width = groupWidth + "px";
    xLabel.textContent = d.year;
    xAxis.appendChild(xLabel);
  });
});
