# Figma Export Checklist

Export each item from Figma (select the layer/frame → right panel → **Export** → choose format → Export),
then save into the folders below using the EXACT filename. Once done, tell the agent "done exporting".

How to export in Figma:
1. Click the layer or frame you want.
2. Bottom of the right sidebar → **Export** section → click **+**.
3. Choose format: **SVG** for logos/icons, **PNG (2x or 3x)** for photos/images.
4. Click **Export [name]** and save to the matching folder below.

---

## 1) LOGOS  →  save in  public/images/figma/
| What | Filename | Format |
|------|----------|--------|
| Main logo (the one used in header, light/white version) | `logo-light.svg` | SVG |
| Dark/colored logo version (if exists) | `logo-dark.svg` | SVG |
| Footer logo (if different) | `logo-footer.svg` | SVG |

## 2) SECTION ICONS  →  save in  public/images/figma/icons/
| Section | What | Filename | Format |
|---------|------|----------|--------|
| Focus Areas | "المحتاج" icon | `focus-needy.svg` | SVG |
| Focus Areas | "مساجد المجدوعي" icon | `focus-mosques.svg` | SVG |
| Focus Areas | "شركاء التنفيذ" icon | `focus-partners.svg` | SVG |
| Leadership | decorative tile/pattern next to photo | `leadership-tile.svg` | SVG |
| Header | search icon | `icon-search.svg` | SVG |
| Header | dark-mode / moon icon | `icon-moon.svg` | SVG |
| Header | language / globe icon | `icon-language.svg` | SVG |

## 3) PHOTOS / IMAGES  →  save in  public/images/figma/sections/
| Section | What | Filename | Format |
|---------|------|----------|--------|
| Leadership | Sheikh portrait photo | `leadership-portrait.png` | PNG 2x |
| Programs | مبادرة تضمين image | `program-tadmeen.png` | PNG 2x |
| Programs | مبادرة عمارة image | `program-imaara.png` | PNG 2x |
| Programs | مبادرة منارة image | `program-manara.png` | PNG 2x |
| Programs | مبادرة تطوير image | `program-tatweer.png` | PNG 2x |
| Programs | تفريج كربة image | `program-tafrij.png` | PNG 2x |
| Programs | مبادرة رسالة image | `program-risala.png` | PNG 2x |
| News | حفل تكريم الشركاء image | `news-1.png` | PNG 2x |
| News | شراكة استراتيجية image | `news-2.png` | PNG 2x |
| News | مبادرة منارة launch image | `news-3.png` | PNG 2x |
| Any section background patterns / decorative shapes | `bg-<name>.png` or `.svg` | as needed |

---

## TIP — fastest method
If you'd rather not export one-by-one, you can:
- Select a whole **section frame** in Figma → Export as **PNG 2x** → save as `sections/full-<section>.png`
  (e.g. `full-leadership.png`, `full-programs.png`). The agent can slice/reference from these.

When finished, just say **"done exporting"** and the agent will wire everything in.
