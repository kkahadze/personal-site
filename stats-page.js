import { initTheme } from "./main.js";
import { initI18n } from "./i18n.js";
import { languageTrees, proficiencyColors } from "./data/languages.js";

// Desktop vertical layout constants
const NODE_W = 120;
const ROOT_NODE_W = 160;
const NODE_H = 36;
const NODE_RX = 6;
const GAP_X = 40;
const GAP_Y = 70;
const BAR_W = 56;
const BAR_H = 10;
const BAR_GAP = 2;
const BAR_TOP = 8;

// Mobile horizontal layout constants
const M_NODE_W = 100;
const M_ROOT_NODE_W = 130;
const M_NODE_H = 32;
const M_NODE_RX = 6;
const M_GAP_X = 36;
const M_GAP_Y = 14;
const M_BAR_W = 48;
const M_BAR_H = 8;
const M_BAR_GAP = 2;
const M_BAR_TOP = 6;

function isMobile() {
  return window.innerWidth <= 736;
}

function getThemeColors() {
  const style = getComputedStyle(document.documentElement);
  const isDark = document.documentElement.getAttribute("data-theme") === "dark";
  return {
    text: style.getPropertyValue("--text").trim(),
    bg: style.getPropertyValue("--bg").trim(),
    nodeBg: isDark ? "#ffffff" : style.getPropertyValue("--nav-bg").trim(),
    border: isDark ? "#ffffff" : style.getPropertyValue("--border").trim(),
    nodeText: isDark ? "#7a0000" : null,
  };
}

function getLang() {
  return document.documentElement.lang || "en";
}

function getDisplayName(node) {
  const lang = getLang();
  return (lang === "ka" && node.nameKa) ? node.nameKa : node.name;
}

// ── Desktop: vertical top-down layout ──

function leafCount(node) {
  if (!node.children || node.children.length === 0) return 1;
  return node.children.reduce((sum, c) => sum + leafCount(c), 0);
}

function layout(node, x, y) {
  if (!node.children || node.children.length === 0) {
    const h = NODE_H + (node.level != null ? BAR_TOP + BAR_H : 0);
    return { x, y, w: NODE_W, h, node, children: [] };
  }

  const childLayouts = [];
  let cx = x;
  for (const child of node.children) {
    const cl = layout(child, cx, y + NODE_H + GAP_Y);
    childLayouts.push(cl);
    cx = cl.x + cl.w + GAP_X;
  }

  const isRoot = y === 0;
  const nw = isRoot ? ROOT_NODE_W : NODE_W;
  const first = childLayouts[0];
  const last = childLayouts[childLayouts.length - 1];
  const firstCenter = (first.nodeX != null ? first.nodeX : first.x) + NODE_W / 2;
  const lastCenter = (last.nodeX != null ? last.nodeX : last.x) + NODE_W / 2;
  const nodeX = (firstCenter + lastCenter) / 2 - nw / 2;

  const leftEdge = Math.min(nodeX, first.x);
  const rightEdge = Math.max(nodeX + nw, last.x + last.w);

  let maxBottom = y + NODE_H;
  for (const cl of childLayouts) {
    const bottom = cl.y + cl.h;
    if (bottom > maxBottom) maxBottom = bottom;
  }

  return {
    x: leftEdge,
    y,
    w: rightEdge - leftEdge,
    h: maxBottom - y,
    nodeX,
    node,
    children: childLayouts,
  };
}

function renderProficiencyBar(cx, y, level) {
  const squareW = (BAR_W - BAR_GAP * 3) / 4;
  const startX = cx - BAR_W / 2;
  let svg = "";
  for (let i = 0; i < 4; i++) {
    const filled = i < level;
    const color = filled ? proficiencyColors[i] : "rgba(128,128,128,0.25)";
    svg += `<rect x="${startX + i * (squareW + BAR_GAP)}" y="${y}" width="${squareW}" height="${BAR_H}" rx="2" fill="${color}"/>`;
  }
  return svg;
}

function renderTree(treeLayout, colors, offsetX, offsetY) {
  let svg = "";
  const l = treeLayout;
  const isLeaf = l.children.length === 0;
  const isRoot = l.y === 0;

  const nw = isRoot ? ROOT_NODE_W : NODE_W;
  const nx = (l.nodeX != null ? l.nodeX : l.x) + offsetX;
  const ny = l.y + offsetY;
  const centerX = nx + nw / 2;
  const centerY = ny + NODE_H / 2;

  for (const child of l.children) {
    const childNx = (child.nodeX != null ? child.nodeX : child.x) + offsetX;
    const childCenterX = childNx + NODE_W / 2;
    const childTopY = child.y + offsetY;

    const startY = ny + NODE_H;
    const midY = startY + (childTopY - startY) / 2;

    svg += `<path d="M ${centerX} ${startY} C ${centerX} ${midY}, ${childCenterX} ${midY}, ${childCenterX} ${childTopY}" fill="none" stroke="${colors.border}" stroke-width="1.5"/>`;
  }

  const fontSize = isRoot ? "14" : isLeaf ? "13" : "12";
  const fontWeight = isRoot ? "800" : isLeaf ? "800" : "600";
  const opacity = (!isRoot && !isLeaf) ? "0.75" : "1";
  const hasLink = !!l.node.url;

  if (hasLink) svg += `<a href="${l.node.url}" target="_blank" rel="noopener" style="cursor:pointer">`;
  svg += `<rect x="${nx}" y="${ny}" width="${nw}" height="${NODE_H}" rx="${NODE_RX}" fill="${colors.nodeBg}" stroke="${colors.border}" stroke-width="1" opacity="${opacity}"/>`;
  const textColor = colors.nodeText || colors.text;
  const displayName = getDisplayName(l.node);
  svg += `<text x="${centerX}" y="${centerY + 1}" text-anchor="middle" dominant-baseline="central" fill="${textColor}" font-family="'Raleway','Noto Sans Georgian',sans-serif" font-size="${fontSize}" font-weight="${fontWeight}" opacity="${opacity}">${displayName}</text>`;
  if (hasLink) svg += `</a>`;

  if (isLeaf && l.node.level != null) {
    svg += renderProficiencyBar(centerX, ny + NODE_H + BAR_TOP, l.node.level);
  }

  for (const child of l.children) {
    svg += renderTree(child, colors, offsetX, offsetY);
  }

  return svg;
}

// ── Mobile: horizontal left-to-right layout ──

function layoutH(node, x, y, depth) {
  const isRoot = depth === 0;
  const nw = isRoot ? M_ROOT_NODE_W : M_NODE_W;
  const isLeaf = !node.children || node.children.length === 0;

  if (isLeaf) {
    const h = M_NODE_H + (node.level != null ? M_BAR_TOP + M_BAR_H : 0);
    return { nx: x, ny: y, nw, totalH: h, node, children: [], depth };
  }

  const childLayouts = [];
  let cy = y;
  for (const child of node.children) {
    const cl = layoutH(child, x + nw + M_GAP_X, cy, depth + 1);
    childLayouts.push(cl);
    cy += cl.totalH + M_GAP_Y;
  }

  const totalChildH = cy - y - M_GAP_Y;
  const nodeY = y + totalChildH / 2 - M_NODE_H / 2;

  return {
    nx: x,
    ny: nodeY,
    nw,
    totalH: Math.max(totalChildH, M_NODE_H),
    node,
    children: childLayouts,
    depth,
  };
}

function getBoundsH(l) {
  const isLeaf = l.children.length === 0;
  let minX = l.nx;
  let minY = l.ny;
  let maxX = l.nx + l.nw;
  let maxY = l.ny + M_NODE_H + (isLeaf && l.node.level != null ? M_BAR_TOP + M_BAR_H : 0);

  for (const child of l.children) {
    const cb = getBoundsH(child);
    minX = Math.min(minX, cb.minX);
    minY = Math.min(minY, cb.minY);
    maxX = Math.max(maxX, cb.maxX);
    maxY = Math.max(maxY, cb.maxY);
  }

  return { minX, minY, maxX, maxY };
}

function renderProficiencyBarH(cx, y, level) {
  const squareW = (M_BAR_W - M_BAR_GAP * 3) / 4;
  const startX = cx - M_BAR_W / 2;
  let svg = "";
  for (let i = 0; i < 4; i++) {
    const filled = i < level;
    const color = filled ? proficiencyColors[i] : "rgba(128,128,128,0.25)";
    svg += `<rect x="${startX + i * (squareW + M_BAR_GAP)}" y="${y}" width="${squareW}" height="${M_BAR_H}" rx="2" fill="${color}"/>`;
  }
  return svg;
}

function renderTreeH(l, colors, offsetX, offsetY) {
  let svg = "";
  const isLeaf = l.children.length === 0;
  const isRoot = l.depth === 0;

  const nx = l.nx + offsetX;
  const ny = l.ny + offsetY;
  const centerX = nx + l.nw / 2;
  const centerY = ny + M_NODE_H / 2;
  const rightX = nx + l.nw;

  // Horizontal bezier curves to children
  for (const child of l.children) {
    const childNx = child.nx + offsetX;
    const childNy = child.ny + offsetY;
    const childCenterY = childNy + M_NODE_H / 2;
    const childLeftX = childNx;

    const midX = rightX + (childLeftX - rightX) / 2;
    svg += `<path d="M ${rightX} ${centerY} C ${midX} ${centerY}, ${midX} ${childCenterY}, ${childLeftX} ${childCenterY}" fill="none" stroke="${colors.border}" stroke-width="1.5"/>`;
  }

  // Node rectangle
  const fontSize = isRoot ? "12" : isLeaf ? "11" : "10";
  const fontWeight = isRoot ? "800" : isLeaf ? "800" : "600";
  const opacity = (!isRoot && !isLeaf) ? "0.75" : "1";
  const hasLink = !!l.node.url;

  if (hasLink) svg += `<a href="${l.node.url}" target="_blank" rel="noopener" style="cursor:pointer">`;
  svg += `<rect x="${nx}" y="${ny}" width="${l.nw}" height="${M_NODE_H}" rx="${M_NODE_RX}" fill="${colors.nodeBg}" stroke="${colors.border}" stroke-width="1" opacity="${opacity}"/>`;
  const textColor = colors.nodeText || colors.text;
  const displayName = getDisplayName(l.node);
  svg += `<text x="${centerX}" y="${centerY + 1}" text-anchor="middle" dominant-baseline="central" fill="${textColor}" font-family="'Raleway','Noto Sans Georgian',sans-serif" font-size="${fontSize}" font-weight="${fontWeight}" opacity="${opacity}">${displayName}</text>`;
  if (hasLink) svg += `</a>`;

  // Proficiency bar below leaf
  if (isLeaf && l.node.level != null) {
    svg += renderProficiencyBarH(centerX, ny + M_NODE_H + M_BAR_TOP, l.node.level);
  }

  for (const child of l.children) {
    svg += renderTreeH(child, colors, offsetX, offsetY);
  }

  return svg;
}

// ── Render all trees ──

function renderAllTrees() {
  const container = document.getElementById("lang-trees");
  const colors = getThemeColors();

  if (isMobile()) {
    // Horizontal left-to-right trees, stacked vertically
    let html = "";
    for (const tree of languageTrees) {
      const l = layoutH(tree, 0, 0, 0);
      const bounds = getBoundsH(l);
      const padding = 16;
      const svgW = bounds.maxX - bounds.minX + padding * 2;
      const svgH = bounds.maxY - bounds.minY + padding * 2;

      html += `<svg viewBox="0 0 ${svgW} ${svgH}" width="100%" xmlns="http://www.w3.org/2000/svg" style="display:block;margin-bottom:1rem">`;
      html += renderTreeH(l, colors, padding - bounds.minX, padding - bounds.minY);
      html += `</svg>`;
    }
    container.innerHTML = html;
  } else {
    // Desktop: vertical top-down trees side by side
    const layouts = languageTrees.map((tree) => layout(tree, 0, 0));

    const treePadding = 60;
    let totalW = 0;
    let maxH = 0;

    for (const l of layouts) {
      totalW += l.w;
      if (l.h > maxH) maxH = l.h;
    }
    totalW += treePadding * (layouts.length - 1);

    const padding = 30;
    const svgW = totalW + padding * 2;
    const svgH = maxH + padding * 2;

    let svg = `<svg viewBox="0 0 ${svgW} ${svgH}" width="100%" xmlns="http://www.w3.org/2000/svg">`;

    let offsetX = padding;
    for (const l of layouts) {
      svg += renderTree(l, colors, offsetX - l.x, padding);
      offsetX += l.w + treePadding;
    }

    svg += "</svg>";
    container.innerHTML = svg;
  }
}

document.addEventListener("DOMContentLoaded", () => {
  initTheme();
  initI18n();
  renderAllTrees();

  // Re-render on theme toggle
  document.getElementById("theme-toggle").addEventListener("click", () => {
    requestAnimationFrame(() => renderAllTrees());
  });

  // Re-render on system theme change
  window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", () => {
    requestAnimationFrame(() => renderAllTrees());
  });

  // Re-render when language changes
  document.querySelectorAll(".lang-option").forEach((opt) => {
    opt.addEventListener("click", () => {
      requestAnimationFrame(() => renderAllTrees());
    });
  });

  // Re-render on resize (switch between mobile/desktop layout)
  let lastMobile = isMobile();
  window.addEventListener("resize", () => {
    const nowMobile = isMobile();
    if (nowMobile !== lastMobile) {
      lastMobile = nowMobile;
      renderAllTrees();
    }
  });
});
