#!/usr/bin/env python3
"""Canwell House brand asset pipeline.

One source, all variants derived. Run: python3 brand/build_assets.py
"""

import math
import os
import re
import struct
from pathlib import Path
from PIL import Image, ImageDraw
from fontTools.ttLib import TTFont
from fontTools.pens.svgPathPen import SVGPathPen

# ── Tokens (single source of truth) ──────────────────────────────────────────

INK = "#1B1A18"
STONE = "#F4F1EC"
BRASS = "#B08D57"

BRAND_DIR = Path(__file__).parent
FONT_LIGHT = BRAND_DIR / "fonts" / "Fraunces_72pt-Light.ttf"
FONT_SOFT_SEMIBOLD = BRAND_DIR / "fonts" / "Fraunces_72pt_Soft-SemiBold.ttf"
SRC_DIR = BRAND_DIR / "src"
DIST_DIR = BRAND_DIR / "dist"
LETTER_SPACING = 0.18  # em units for wordmark tracking

UPM = 2000
NORM = 1000  # normalised coordinate space
CAP_HEIGHT = 1400  # font cap height in font units


# ── Glyph helpers ────────────────────────────────────────────────────────────

def _load_font(path):
    return TTFont(str(path))


def glyph_to_path(font_path, char):
    """Return SVG path d-string for a single glyph, normalised to 1000-unit space."""
    font = _load_font(font_path)
    gs = font.getGlyphSet()
    cmap = font.getBestCmap()
    glyph_name = cmap[ord(char)]
    pen = SVGPathPen(gs)
    gs[glyph_name].draw(pen)
    raw = pen.getCommands()
    hmtx = font["hmtx"]
    advance = hmtx[glyph_name][0]
    scale = NORM / UPM
    scaled = _scale_path(raw, scale, scale)
    return scaled, advance * scale


def _scale_path(d_str, sx, sy):
    """Scale all coordinates in an SVG path d-string."""
    tokens = re.findall(r'[A-Za-z]|[-+]?(?:\d+\.?\d*|\.\d+)', d_str)
    result = []
    cmd = None
    nums = []
    for token in tokens:
        if token.isalpha():
            if cmd is not None:
                result.append(_apply_scale(cmd, nums, sx, sy))
            cmd = token
            nums = []
        else:
            nums.append(float(token))
    if cmd is not None:
        result.append(_apply_scale(cmd, nums, sx, sy))
    return "".join(result)


def _apply_scale(cmd, nums, sx, sy):
    upper = cmd.upper()
    if upper == "Z":
        return cmd
    if upper == "H":
        scaled = [n * sx for n in nums]
        return cmd + " ".join(f"{v:.1f}" for v in scaled)
    if upper == "V":
        scaled = [n * sy for n in nums]
        return cmd + " ".join(f"{v:.1f}" for v in scaled)
    scaled = []
    for i, n in enumerate(nums):
        scaled.append(n * sx if i % 2 == 0 else n * sy)
    return cmd + " ".join(f"{v:.1f}" for v in scaled)


def wordmark_paths(font_path, text):
    """Lay out tracked all-caps text as (list_of_path_d_strings, total_width, height).

    Returns paths in normalised 1000-unit space with 0.18em tracking.
    """
    font = _load_font(font_path)
    gs = font.getGlyphSet()
    cmap = font.getBestCmap()
    hmtx = font["hmtx"]
    scale = NORM / UPM
    cap_h = CAP_HEIGHT * scale
    tracking = LETTER_SPACING * cap_h
    raw_space = hmtx[cmap[ord(" ")]][0] * scale
    space_width = raw_space + tracking

    paths = []
    cursor_x = 0.0
    y_min = 0.0
    y_max = cap_h
    words = text.upper().split(" ")

    for wi, word in enumerate(words):
        for ci, ch in enumerate(word):
            glyph_name = cmap[ord(ch)]
            pen = SVGPathPen(gs)
            gs[glyph_name].draw(pen)
            raw = pen.getCommands()
            scaled_path = _scale_path(raw, scale, scale)
            advance = hmtx[glyph_name][0] * scale
            # Track vertical extent from untranslated glyphs
            b = _path_bounds(scaled_path)
            if b != (0, 0, 0, 0):
                y_min = min(y_min, b[1])
                y_max = max(y_max, b[3])
            translated = _translate_path(scaled_path, cursor_x, 0)
            paths.append(translated)
            cursor_x += advance
            if ci < len(word) - 1:
                cursor_x += tracking
        if wi < len(words) - 1:
            cursor_x += space_width

    return paths, cursor_x, cap_h, y_min, y_max


def _translate_path(d_str, tx, ty):
    """Translate all absolute coordinates in an SVG path d-string."""
    tokens = re.findall(r'[A-Za-z]|[-+]?(?:\d+\.?\d*|\.\d+)', d_str)
    result = []
    cmd = None
    nums = []
    for token in tokens:
        if token.isalpha():
            if cmd is not None:
                result.append(_apply_translate(cmd, nums, tx, ty))
            cmd = token
            nums = []
        else:
            nums.append(float(token))
    if cmd is not None:
        result.append(_apply_translate(cmd, nums, tx, ty))
    return "".join(result)


def _apply_translate(cmd, nums, tx, ty):
    if cmd.islower() or cmd.upper() == "Z":
        return cmd + " ".join(f"{v:.1f}" for v in nums)
    upper = cmd.upper()
    if upper == "H":
        shifted = [n + tx for n in nums]
        return cmd + " ".join(f"{v:.1f}" for v in shifted)
    if upper == "V":
        shifted = [n + ty for n in nums]
        return cmd + " ".join(f"{v:.1f}" for v in shifted)
    shifted = []
    for i, n in enumerate(nums):
        shifted.append(n + tx if i % 2 == 0 else n + ty)
    return cmd + " ".join(f"{v:.1f}" for v in shifted)


# ── SVG builders ─────────────────────────────────────────────────────────────

def _svg_wrap(content, vb_w, vb_h, vb_x=0, vb_y=0):
    return (
        f'<svg xmlns="http://www.w3.org/2000/svg" '
        f'viewBox="{vb_x} {vb_y} {vb_w} {vb_h}" '
        f'width="{vb_w}" height="{vb_h}">\n{content}\n</svg>\n'
    )


def build_mark_svg():
    """240×240 mark: square portal frame with brass plinth, centred C."""
    inset = 24
    stroke = 6
    frame_left = inset
    frame_right = 240 - inset
    frame_top = inset
    frame_bottom = 240 - inset
    inner_w = frame_right - frame_left
    inner_h = frame_bottom - frame_top

    # Frame edges as filled rects for crisp rendering
    half = stroke / 2
    # Top edge (ink)
    top = f'<rect x="{frame_left}" y="{frame_top}" width="{inner_w}" height="{stroke}" fill="{INK}"/>'
    # Left edge (ink)
    left = f'<rect x="{frame_left}" y="{frame_top}" width="{stroke}" height="{inner_h}" fill="{INK}"/>'
    # Right edge (ink)
    right = f'<rect x="{frame_right - stroke}" y="{frame_top}" width="{stroke}" height="{inner_h}" fill="{INK}"/>'
    # Bottom edge (brass plinth)
    bottom = f'<rect x="{frame_left}" y="{frame_bottom - stroke}" width="{inner_w}" height="{stroke}" fill="{BRASS}"/>'

    # Centred C glyph
    c_path, c_advance = glyph_to_path(FONT_SOFT_SEMIBOLD, "C")
    # Font coords: y goes up. SVG: y goes down. Flip vertically.
    # In normalised space, cap height = 700, glyph baseline at y=0, top at ~700

    # Target: C cap height ≈ 60% of inner frame height
    target_cap = inner_h * 0.60
    glyph_cap = CAP_HEIGHT * NORM / UPM  # 700
    glyph_scale = target_cap / glyph_cap

    # Parse path bounds to centre properly
    c_bounds = _path_bounds(c_path)
    glyph_w = (c_bounds[2] - c_bounds[0]) * glyph_scale
    glyph_h = (c_bounds[3] - c_bounds[1]) * glyph_scale

    # Centre position within the frame interior (excluding stroke)
    interior_left = frame_left + stroke
    interior_top = frame_top + stroke
    interior_w = inner_w - 2 * stroke
    interior_h = inner_h - 2 * stroke

    cx = interior_left + (interior_w - glyph_w) / 2
    cy = interior_top + (interior_h - glyph_h) / 2

    # Transform: flip Y (font y-up → SVG y-down), scale, translate
    tx = cx - c_bounds[0] * glyph_scale
    ty = cy + c_bounds[3] * glyph_scale  # flip: top of glyph maps to cy

    transform = f"translate({tx:.2f},{ty:.2f}) scale({glyph_scale:.4f},{-glyph_scale:.4f})"
    c_elem = f'<path d="{c_path}" fill="{INK}" transform="{transform}"/>'

    content = f"  {top}\n  {left}\n  {right}\n  {bottom}\n  {c_elem}"
    return _svg_wrap(content, 240, 240)


def _path_bounds(d_str):
    """Rough bounding box from path coordinates (absolute commands only)."""
    nums = re.findall(r'[-+]?(?:\d+\.?\d*|\.\d+)', d_str)
    if not nums:
        return (0, 0, 0, 0)
    coords = [float(n) for n in nums]
    xs = coords[0::2]
    ys = coords[1::2]
    if not xs or not ys:
        return (0, 0, 0, 0)
    return (min(xs), min(ys), max(xs), max(ys))


def build_wordmark_svg():
    """Wordmark: CANWELL HOUSE in Fraunces Light, outlined, tracked."""
    paths, total_w, cap_h, y_min, y_max = wordmark_paths(FONT_LIGHT, "CANWELL HOUSE")
    margin = 20
    height = y_max - y_min
    vb_w = total_w + 2 * margin
    vb_h = height + 2 * margin

    ty = y_max + margin
    tx = margin

    path_strs = []
    for p in paths:
        path_strs.append(f'    <path d="{p}" fill="{INK}"/>')
    group_content = "\n".join(path_strs)
    content = f'  <g transform="translate({tx:.1f},{ty:.1f}) scale(1,-1)">\n{group_content}\n  </g>'

    return _svg_wrap(content, round(vb_w, 1), round(vb_h, 1)), total_w, height


def build_lockup_horizontal_svg():
    """Mark left, wordmark right, vertically centred, gap = 0.5 × mark width."""
    mark_size = 240
    gap = mark_size * 0.5

    paths, wm_w, wm_cap, wm_min_y, wm_max_y = wordmark_paths(FONT_LIGHT, "CANWELL HOUSE")
    wm_h = wm_max_y - wm_min_y

    # Scale wordmark so cap height = 45% of mark
    target_wm_cap = mark_size * 0.45
    wm_scale = target_wm_cap / wm_h if wm_h > 0 else 1.0
    wm_rendered_w = wm_w * wm_scale

    margin = 20
    total_w = margin + mark_size + gap + wm_rendered_w + margin
    total_h = mark_size

    mark_content = _mark_elements(margin, 0)

    wm_tx = margin + mark_size + gap
    wm_ty = mark_size / 2 + (wm_max_y * wm_scale) / 2

    wm_paths = []
    for p in paths:
        wm_paths.append(f'    <path d="{p}" fill="{INK}"/>')
    wm_group = "\n".join(wm_paths)

    content = (
        f"{mark_content}\n"
        f'  <g transform="translate({wm_tx:.1f},{wm_ty:.1f}) scale({wm_scale},-{wm_scale})">\n'
        f"{wm_group}\n"
        f"  </g>"
    )

    return _svg_wrap(content, round(total_w), round(total_h))


def build_lockup_stacked_svg():
    """Mark centred above wordmark, gap = 0.4 × mark height."""
    mark_size = 240
    paths, wm_w, wm_cap, wm_min_y, wm_max_y = wordmark_paths(FONT_LIGHT, "CANWELL HOUSE")
    wm_h = wm_max_y - wm_min_y

    # Scale wordmark so its width ≈ 2.8× the mark width
    target_wm_w = mark_size * 2.8
    wm_scale = target_wm_w / wm_w
    wm_rendered_w = wm_w * wm_scale
    wm_rendered_h = wm_h * wm_scale

    gap = wm_rendered_h * 0.6
    margin = 10
    total_w = max(mark_size, wm_rendered_w) + 2 * margin
    total_h = mark_size + gap + wm_rendered_h + 2 * margin

    mark_x = (total_w - mark_size) / 2
    mark_content = _mark_elements(mark_x, margin)

    wm_tx = (total_w - wm_rendered_w) / 2
    wm_ty = margin + mark_size + gap + wm_max_y * wm_scale

    wm_paths = []
    for p in paths:
        wm_paths.append(f'    <path d="{p}" fill="{INK}"/>')
    wm_group = "\n".join(wm_paths)

    content = (
        f"{mark_content}\n"
        f'  <g transform="translate({wm_tx:.1f},{wm_ty:.1f}) scale({wm_scale},-{wm_scale})">\n'
        f"{wm_group}\n"
        f"  </g>"
    )

    return _svg_wrap(content, round(total_w), round(total_h))


def build_endorsement_svg():
    """Small mark + 'PART OF CANWELL HOUSE' as one horizontal unit."""
    mark_size = 36

    paths, wm_w, wm_cap, wm_min_y, wm_max_y = wordmark_paths(FONT_LIGHT, "PART OF CANWELL HOUSE")
    wm_h = wm_max_y - wm_min_y

    # Scale wordmark so cap height = 55% of mark height
    target_wm_h = mark_size * 0.55
    wm_scale = target_wm_h / wm_h if wm_h > 0 else 1.0
    wm_rendered_w = wm_w * wm_scale

    gap = mark_size * 0.35
    margin = 10
    total_w = margin + mark_size + gap + wm_rendered_w + margin
    total_h = mark_size + 2 * margin

    mark_content = _mark_elements_scaled(margin, margin, mark_size)

    wm_tx = margin + mark_size + gap
    wm_ty = margin + mark_size / 2 + (wm_max_y * wm_scale) / 2

    wm_paths = []
    for p in paths:
        wm_paths.append(f'    <path d="{p}" fill="{INK}"/>')
    wm_group = "\n".join(wm_paths)

    content = (
        f"{mark_content}\n"
        f'  <g transform="translate({wm_tx:.1f},{wm_ty:.1f}) scale({wm_scale},-{wm_scale})">\n'
        f"{wm_group}\n"
        f"  </g>"
    )

    return _svg_wrap(content, round(total_w), round(total_h))


def _mark_elements(ox, oy):
    """Generate mark frame + C glyph elements at given offset, at 240px size."""
    return _mark_elements_scaled(ox, oy, 240)


def _mark_elements_scaled(ox, oy, size):
    """Generate mark frame + C glyph elements at given offset and size."""
    s = size / 240  # scale factor from canonical 240
    inset = 24 * s
    stroke = 6 * s
    frame_left = ox + inset
    frame_right = ox + size - inset
    frame_top = oy + inset
    frame_bottom = oy + size - inset
    inner_w = frame_right - frame_left
    inner_h = frame_bottom - frame_top

    top = f'  <rect x="{frame_left:.1f}" y="{frame_top:.1f}" width="{inner_w:.1f}" height="{stroke:.1f}" fill="{INK}"/>'
    left = f'  <rect x="{frame_left:.1f}" y="{frame_top:.1f}" width="{stroke:.1f}" height="{inner_h:.1f}" fill="{INK}"/>'
    right = f'  <rect x="{frame_right - stroke:.1f}" y="{frame_top:.1f}" width="{stroke:.1f}" height="{inner_h:.1f}" fill="{INK}"/>'
    bottom = f'  <rect x="{frame_left:.1f}" y="{frame_bottom - stroke:.1f}" width="{inner_w:.1f}" height="{stroke:.1f}" fill="{BRASS}"/>'

    c_path, c_advance = glyph_to_path(FONT_SOFT_SEMIBOLD, "C")
    target_cap = inner_h * 0.60
    glyph_cap = CAP_HEIGHT * NORM / UPM
    glyph_scale = target_cap / glyph_cap

    c_bounds = _path_bounds(c_path)
    glyph_w = (c_bounds[2] - c_bounds[0]) * glyph_scale
    glyph_h = (c_bounds[3] - c_bounds[1]) * glyph_scale

    interior_left = frame_left + stroke
    interior_top = frame_top + stroke
    interior_w = inner_w - 2 * stroke
    interior_h = inner_h - 2 * stroke

    cx = interior_left + (interior_w - glyph_w) / 2
    cy = interior_top + (interior_h - glyph_h) / 2
    tx = cx - c_bounds[0] * glyph_scale
    ty = cy + c_bounds[3] * glyph_scale

    transform = f"translate({tx:.2f},{ty:.2f}) scale({glyph_scale:.6f},{-glyph_scale:.6f})"
    c_elem = f'  <path d="{c_path}" fill="{INK}" transform="{transform}"/>'

    return f"{top}\n{left}\n{right}\n{bottom}\n{c_elem}"


# ── Recolour variants ────────────────────────────────────────────────────────

def _recolour_mono(svg_content):
    """All colours become ink."""
    out = svg_content.replace(BRASS, INK)
    return out


def _recolour_reverse(svg_content):
    """Ink and brass become stone, for dark grounds."""
    out = svg_content.replace(INK, STONE).replace(BRASS, STONE)
    return out


# ── Raster rendering ────────────────────────────────────────────────────────

def _parse_svg_for_raster(svg_content):
    """Extract drawable elements from SVG for Pillow rendering."""
    elements = []
    # Extract rects
    for m in re.finditer(
        r'<rect\s+x="([^"]+)"\s+y="([^"]+)"\s+width="([^"]+)"\s+height="([^"]+)"\s+fill="([^"]+)"',
        svg_content,
    ):
        elements.append({
            "type": "rect",
            "x": float(m.group(1)),
            "y": float(m.group(2)),
            "w": float(m.group(3)),
            "h": float(m.group(4)),
            "fill": m.group(5),
        })
    # Extract path groups with transforms
    for m in re.finditer(
        r'<g\s+transform="([^"]*)">\s*(.*?)\s*</g>',
        svg_content,
        re.DOTALL,
    ):
        group_transform = m.group(1)
        inner = m.group(2)
        for pm in re.finditer(r'<path\s+d="([^"]+)"\s+fill="([^"]+)"', inner):
            elements.append({
                "type": "path",
                "d": pm.group(1),
                "fill": pm.group(2),
                "transform": group_transform,
            })
    # Extract standalone paths with transforms
    for m in re.finditer(
        r'<path\s+d="([^"]+)"\s+fill="([^"]+)"\s+transform="([^"]+)"',
        svg_content,
    ):
        # Check this isn't inside a group we already captured
        elements.append({
            "type": "path",
            "d": m.group(1),
            "fill": m.group(2),
            "transform": m.group(3),
        })
    return elements


def _hex_to_rgb(h):
    h = h.lstrip("#")
    return tuple(int(h[i:i+2], 16) for i in (0, 2, 4))


def _parse_transform(t_str):
    """Parse translate(...) scale(...) transform string."""
    tx, ty, sx, sy = 0, 0, 1, 1
    m = re.search(r'translate\(\s*([-\d.]+)\s*,\s*([-\d.]+)\s*\)', t_str)
    if m:
        tx, ty = float(m.group(1)), float(m.group(2))
    m = re.search(r'scale\(\s*([-\d.]+)\s*,\s*([-\d.]+)\s*\)', t_str)
    if m:
        sx, sy = float(m.group(1)), float(m.group(2))
    elif (m := re.search(r'scale\(\s*([-\d.]+)\s*\)', t_str)):
        sx = sy = float(m.group(1))
    return tx, ty, sx, sy


def _linearise_path(d_str, steps=8):
    """Convert SVG path to list of contours, each a list of (x,y) points."""
    tokens = re.findall(r'[A-Za-z]|[-+]?(?:\d+\.?\d*|\.\d+)', d_str)
    contours = []
    current = []
    cx, cy = 0.0, 0.0
    start_x, start_y = 0.0, 0.0
    i = 0

    def next_num():
        nonlocal i
        i += 1
        return float(tokens[i])

    while i < len(tokens):
        t = tokens[i]
        if t == "M":
            if current:
                contours.append(current)
                current = []
            x, y = next_num(), next_num()
            cx, cy = x, y
            start_x, start_y = x, y
            current.append((x, y))
            # Implicit lineTo after M
            while i + 1 < len(tokens) and not tokens[i + 1].isalpha():
                x, y = next_num(), next_num()
                cx, cy = x, y
                current.append((x, y))
        elif t == "m":
            if current:
                contours.append(current)
                current = []
            dx, dy = next_num(), next_num()
            cx, cy = cx + dx, cy + dy
            start_x, start_y = cx, cy
            current.append((cx, cy))
        elif t == "L":
            while i + 1 < len(tokens) and not tokens[i + 1].isalpha():
                x, y = next_num(), next_num()
                cx, cy = x, y
                current.append((x, y))
        elif t == "l":
            while i + 1 < len(tokens) and not tokens[i + 1].isalpha():
                dx, dy = next_num(), next_num()
                cx, cy = cx + dx, cy + dy
                current.append((cx, cy))
        elif t == "H":
            while i + 1 < len(tokens) and not tokens[i + 1].isalpha():
                x = next_num()
                cx = x
                current.append((cx, cy))
        elif t == "h":
            while i + 1 < len(tokens) and not tokens[i + 1].isalpha():
                dx = next_num()
                cx += dx
                current.append((cx, cy))
        elif t == "V":
            while i + 1 < len(tokens) and not tokens[i + 1].isalpha():
                y = next_num()
                cy = y
                current.append((cx, cy))
        elif t == "v":
            while i + 1 < len(tokens) and not tokens[i + 1].isalpha():
                dy = next_num()
                cy += dy
                current.append((cx, cy))
        elif t == "Q":
            while i + 2 < len(tokens) and not tokens[i + 1].isalpha():
                qx1, qy1 = next_num(), next_num()
                qx2, qy2 = next_num(), next_num()
                for s in range(1, steps + 1):
                    tt = s / steps
                    u = 1 - tt
                    px = u * u * cx + 2 * u * tt * qx1 + tt * tt * qx2
                    py = u * u * cy + 2 * u * tt * qy1 + tt * tt * qy2
                    current.append((px, py))
                cx, cy = qx2, qy2
        elif t == "q":
            while i + 2 < len(tokens) and not tokens[i + 1].isalpha():
                dqx1, dqy1 = next_num(), next_num()
                dqx2, dqy2 = next_num(), next_num()
                qx1, qy1 = cx + dqx1, cy + dqy1
                qx2, qy2 = cx + dqx2, cy + dqy2
                for s in range(1, steps + 1):
                    tt = s / steps
                    u = 1 - tt
                    px = u * u * cx + 2 * u * tt * qx1 + tt * tt * qx2
                    py = u * u * cy + 2 * u * tt * qy1 + tt * tt * qy2
                    current.append((px, py))
                cx, cy = qx2, qy2
        elif t == "C":
            while i + 3 < len(tokens) and not tokens[i + 1].isalpha():
                cx1, cy1 = next_num(), next_num()
                cx2, cy2 = next_num(), next_num()
                ex, ey = next_num(), next_num()
                for s in range(1, steps + 1):
                    tt = s / steps
                    u = 1 - tt
                    px = u**3*cx + 3*u**2*tt*cx1 + 3*u*tt**2*cx2 + tt**3*ex
                    py = u**3*cy + 3*u**2*tt*cy1 + 3*u*tt**2*cy2 + tt**3*ey
                    current.append((px, py))
                cx, cy = ex, ey
        elif t == "c":
            while i + 3 < len(tokens) and not tokens[i + 1].isalpha():
                dcx1, dcy1 = next_num(), next_num()
                dcx2, dcy2 = next_num(), next_num()
                dex, dey = next_num(), next_num()
                ax1, ay1 = cx + dcx1, cy + dcy1
                ax2, ay2 = cx + dcx2, cy + dcy2
                aex, aey = cx + dex, cy + dey
                for s in range(1, steps + 1):
                    tt = s / steps
                    u = 1 - tt
                    px = u**3*cx + 3*u**2*tt*ax1 + 3*u*tt**2*ax2 + tt**3*aex
                    py = u**3*cy + 3*u**2*tt*ay1 + 3*u*tt**2*ay2 + tt**3*aey
                    current.append((px, py))
                cx, cy = aex, aey
        elif t in ("Z", "z"):
            cx, cy = start_x, start_y
            if current:
                contours.append(current)
                current = []
        i += 1

    if current:
        contours.append(current)
    return contours


def _render_svg_to_image(svg_content, target_w, target_h, bg_color=None, supersample=4):
    """Render SVG content to a Pillow Image at target size via 4× supersampling."""
    # Parse viewBox
    m = re.search(r'viewBox="([-\d.]+)\s+([-\d.]+)\s+([-\d.]+)\s+([-\d.]+)"', svg_content)
    vb_x, vb_y, vb_w, vb_h = (float(g) for g in m.groups())

    ss_w = target_w * supersample
    ss_h = target_h * supersample
    scale_x = ss_w / vb_w
    scale_y = ss_h / vb_h

    if bg_color:
        img = Image.new("RGBA", (ss_w, ss_h), _hex_to_rgb(bg_color) + (255,))
    else:
        img = Image.new("RGBA", (ss_w, ss_h), (0, 0, 0, 0))

    draw = ImageDraw.Draw(img)
    elements = _parse_svg_for_raster(svg_content)

    for elem in elements:
        fill_rgb = _hex_to_rgb(elem["fill"])
        if elem["type"] == "rect":
            x1 = (elem["x"] - vb_x) * scale_x
            y1 = (elem["y"] - vb_y) * scale_y
            x2 = x1 + elem["w"] * scale_x
            y2 = y1 + elem["h"] * scale_y
            draw.rectangle([x1, y1, x2, y2], fill=fill_rgb + (255,))
        elif elem["type"] == "path":
            tx, ty, sx, sy = _parse_transform(elem.get("transform", ""))
            contours = _linearise_path(elem["d"])
            # Even-odd fill: XOR contour masks
            mask = Image.new("L", (ss_w, ss_h), 0)
            mask_draw = ImageDraw.Draw(mask)
            for contour in contours:
                if len(contour) < 3:
                    continue
                transformed = []
                for px, py in contour:
                    rx = (px * sx + tx - vb_x) * scale_x
                    ry = (py * sy + ty - vb_y) * scale_y
                    transformed.append((rx, ry))
                temp = Image.new("L", (ss_w, ss_h), 0)
                temp_draw = ImageDraw.Draw(temp)
                temp_draw.polygon(transformed, fill=255)
                # XOR for even-odd
                from PIL import ImageChops
                mask = ImageChops.difference(mask, temp)
            # Apply mask with fill colour
            colour_layer = Image.new("RGBA", (ss_w, ss_h), fill_rgb + (255,))
            img.paste(colour_layer, mask=mask)

    return img.resize((target_w, target_h), Image.LANCZOS)


# ── Export functions ─────────────────────────────────────────────────────────

def _write_svg(path, content):
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(content, encoding="utf-8")


def _render_and_save(svg_content, path, w, h, bg=None, fmt=None):
    """Render SVG to raster and save."""
    img = _render_svg_to_image(svg_content, w, h, bg_color=bg)
    path.parent.mkdir(parents=True, exist_ok=True)
    if fmt == "ico":
        _save_ico(img, path)
    elif fmt == "webp":
        img.save(str(path), "WEBP", quality=90)
    elif fmt == "jpg":
        rgb = Image.new("RGB", img.size, _hex_to_rgb(STONE))
        rgb.paste(img, mask=img.split()[3] if img.mode == "RGBA" else None)
        rgb.save(str(path), "JPEG", quality=92)
    else:
        img.save(str(path), "PNG")


def _save_ico(img, path):
    """Save as ICO with 16, 32, 48 sizes packed."""
    sizes = [(16, 16), (32, 32), (48, 48)]
    imgs = [img.resize(s, Image.LANCZOS) for s in sizes]
    imgs[0].save(str(path), format="ICO", sizes=sizes, append_images=imgs[1:])


def build_all():
    """Build all brand assets."""
    SRC_DIR.mkdir(parents=True, exist_ok=True)
    DIST_DIR.mkdir(parents=True, exist_ok=True)

    print("Building master SVGs...")

    # 1. Mark
    mark_svg = build_mark_svg()
    _write_svg(SRC_DIR / "mark.svg", mark_svg)
    _write_svg(SRC_DIR / "mark-mono.svg", _recolour_mono(mark_svg))
    _write_svg(SRC_DIR / "mark-reverse.svg", _recolour_reverse(mark_svg))

    # 2. Wordmark
    wordmark_svg, _, _ = build_wordmark_svg()
    _write_svg(SRC_DIR / "wordmark.svg", wordmark_svg)
    _write_svg(SRC_DIR / "wordmark-mono.svg", _recolour_mono(wordmark_svg))
    _write_svg(SRC_DIR / "wordmark-reverse.svg", _recolour_reverse(wordmark_svg))

    # 3. Lockup horizontal
    lockup_h_svg = build_lockup_horizontal_svg()
    _write_svg(SRC_DIR / "lockup-horizontal.svg", lockup_h_svg)
    _write_svg(SRC_DIR / "lockup-horizontal-mono.svg", _recolour_mono(lockup_h_svg))
    _write_svg(SRC_DIR / "lockup-horizontal-reverse.svg", _recolour_reverse(lockup_h_svg))

    # 4. Lockup stacked
    lockup_s_svg = build_lockup_stacked_svg()
    _write_svg(SRC_DIR / "lockup-stacked.svg", lockup_s_svg)
    _write_svg(SRC_DIR / "lockup-stacked-mono.svg", _recolour_mono(lockup_s_svg))
    _write_svg(SRC_DIR / "lockup-stacked-reverse.svg", _recolour_reverse(lockup_s_svg))

    # 5. Endorsement
    endorsement_svg = build_endorsement_svg()
    _write_svg(SRC_DIR / "endorsement.svg", endorsement_svg)
    _write_svg(SRC_DIR / "endorsement-mono.svg", _recolour_mono(endorsement_svg))
    _write_svg(SRC_DIR / "endorsement-reverse.svg", _recolour_reverse(endorsement_svg))

    print(f"  {len(list(SRC_DIR.glob('*.svg')))} SVGs written to {SRC_DIR}")

    # ── Raster exports ──
    print("Rendering raster exports...")

    # Favicon
    _write_svg(DIST_DIR / "favicon.svg", mark_svg)

    # Favicon ICO (16, 32, 48)
    _render_and_save(mark_svg, DIST_DIR / "favicon.ico", 48, 48, fmt="ico")

    # Favicon PNGs
    _render_and_save(mark_svg, DIST_DIR / "favicon-16.png", 16, 16)
    _render_and_save(mark_svg, DIST_DIR / "favicon-32.png", 32, 32)

    # Apple touch icon 180×180 with stone bg, ~12% padding
    padding = round(180 * 0.12)
    apple_mark = _render_svg_to_image(mark_svg, 180 - 2 * padding, 180 - 2 * padding)
    apple_img = Image.new("RGBA", (180, 180), _hex_to_rgb(STONE) + (255,))
    apple_img.paste(apple_mark, (padding, padding), apple_mark)
    apple_img.save(str(DIST_DIR / "apple-touch-icon.png"), "PNG")

    # PWA icons on stone
    for size in [192, 512]:
        icon_padding = round(size * 0.12)
        icon_mark = _render_svg_to_image(mark_svg, size - 2 * icon_padding, size - 2 * icon_padding)
        icon_img = Image.new("RGBA", (size, size), _hex_to_rgb(STONE) + (255,))
        icon_img.paste(icon_mark, (icon_padding, icon_padding), icon_mark)
        icon_img.save(str(DIST_DIR / f"icon-{size}.png"), "PNG")

    # Maskable icon: mark in centre 60% safe zone
    safe_zone = 0.60
    mask_size = 512
    mark_render_size = round(mask_size * safe_zone * 0.75)
    mask_mark = _render_svg_to_image(mark_svg, mark_render_size, mark_render_size)
    mask_img = Image.new("RGBA", (mask_size, mask_size), _hex_to_rgb(STONE) + (255,))
    offset = (mask_size - mark_render_size) // 2
    mask_img.paste(mask_mark, (offset, offset), mask_mark)
    mask_img.save(str(DIST_DIR / "icon-512-maskable.png"), "PNG")

    # Avatar 400px
    avatar_padding = round(400 * 0.15)
    avatar_mark = _render_svg_to_image(mark_svg, 400 - 2 * avatar_padding, 400 - 2 * avatar_padding)
    # Ink bg
    avatar_ink = Image.new("RGBA", (400, 400), _hex_to_rgb(INK) + (255,))
    mark_reverse_img = _render_svg_to_image(
        _recolour_reverse(mark_svg),
        400 - 2 * avatar_padding,
        400 - 2 * avatar_padding,
    )
    avatar_ink.paste(mark_reverse_img, (avatar_padding, avatar_padding), mark_reverse_img)
    avatar_ink.save(str(DIST_DIR / "avatar-400-ink.png"), "PNG")
    # Stone bg
    avatar_stone = Image.new("RGBA", (400, 400), _hex_to_rgb(STONE) + (255,))
    avatar_stone.paste(avatar_mark, (avatar_padding, avatar_padding), avatar_mark)
    avatar_stone.save(str(DIST_DIR / "avatar-400-stone.png"), "PNG")

    # OG images 1200×630
    og_svg = lockup_s_svg
    m = re.search(r'viewBox="([-\d.]+)\s+([-\d.]+)\s+([-\d.]+)\s+([-\d.]+)"', og_svg)
    og_vb_w, og_vb_h = float(m.group(3)), float(m.group(4))
    # Scale lockup to fit within generous margin
    og_margin = 120
    avail_w = 1200 - 2 * og_margin
    avail_h = 630 - 2 * og_margin
    og_scale = min(avail_w / og_vb_w, avail_h / og_vb_h)
    render_w = round(og_vb_w * og_scale)
    render_h = round(og_vb_h * og_scale)

    og_lockup = _render_svg_to_image(og_svg, render_w, render_h)
    og_img = Image.new("RGBA", (1200, 630), _hex_to_rgb(STONE) + (255,))
    ox = (1200 - render_w) // 2
    oy = (630 - render_h) // 2
    og_img.paste(og_lockup, (ox, oy), og_lockup)
    og_img.save(str(DIST_DIR / "og-canwellhouse-1200x630.webp"), "WEBP", quality=90)
    og_rgb = Image.new("RGB", (1200, 630), _hex_to_rgb(STONE))
    og_rgb.paste(og_lockup, (ox, oy), og_lockup)
    og_rgb.save(str(DIST_DIR / "og-canwellhouse-1200x630.jpg"), "JPEG", quality=92)

    # @2x PNGs from master SVGs
    _render_2x_variants("mark", mark_svg)
    _render_2x_variants("lockup-horizontal", lockup_h_svg)
    _render_2x_variants("lockup-stacked", lockup_s_svg)
    _render_2x_variants("endorsement", endorsement_svg, base_h=200)

    print(f"  Exports written to {DIST_DIR}")
    print(f"  Total files: {len(list(DIST_DIR.iterdir()))}")


def _render_2x_variants(name, svg_content, base_h=400):
    """Render full-colour, mono, reverse @2x PNGs."""
    m = re.search(r'viewBox="([-\d.]+)\s+([-\d.]+)\s+([-\d.]+)\s+([-\d.]+)"', svg_content)
    vb_w, vb_h = float(m.group(3)), float(m.group(4))
    aspect = vb_w / vb_h
    h = base_h
    w = round(h * aspect)

    # Full colour
    _render_and_save(svg_content, DIST_DIR / f"{name}@2x.png", w * 2, h * 2)
    # Mono
    _render_and_save(
        _recolour_mono(svg_content),
        DIST_DIR / f"{name}-mono@2x.png",
        w * 2,
        h * 2,
    )
    # Reverse
    _render_and_save(
        _recolour_reverse(svg_content),
        DIST_DIR / f"{name}-reverse@2x.png",
        w * 2,
        h * 2,
    )


if __name__ == "__main__":
    build_all()
