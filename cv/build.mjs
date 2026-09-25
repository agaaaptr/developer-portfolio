// Builds ATS-friendly DOCX + PDF for both CV languages from the markdown source.
// Usage: node cv/build.mjs
// Output: public/documents/Gagah-Putra-Anugrah-Software-Engineer-{EN,ID}.{docx,pdf}
import { readFileSync, writeFileSync, mkdirSync, createWriteStream } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { Document, Packer, Paragraph, TextRun, TabStopType } from 'docx';
import PDFDocument from 'pdfkit';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');
const PDF_OUT = join(ROOT, 'public', 'documents');
const DOCX_OUT = join(ROOT, 'cv');

const LANGS = [
  { id: 'EN', file: 'Gagah-Putra-Anugrah-Software-Engineer-EN.md' },
  { id: 'ID', file: 'Gagah-Putra-Anugrah-Software-Engineer-ID.md' },
];

// ---------- Shared layout constants ----------
// A4 in twips: 11906 x 16838
const PAGE_W = 11906;
const MARGIN_LR = 1008; // 0.7in
const RIGHT_TAB = PAGE_W - MARGIN_LR * 2; // 9890 twips

// ---------- Markdown parser (specific to this CV structure) ----------
const SECTIONS = ['SUMMARY', 'EXPERIENCE', 'PROJECTS', 'SKILLS', 'EDUCATION'];

function parseMarkdown(src) {
  const lines = src.split(/\r?\n/).map((l) => l.trimEnd());
  const header = {
    name: lines[0].trim(),
    subtitle: lines[1].trim(),
    contact: [],
  };
  let i = 2;
  while (i < lines.length && lines[i].trim() !== '') header.contact.push(lines[i].trim()), i++;
  while (i < lines.length && lines[i].trim() === '') i++;

  const sections = [];
  while (i < lines.length) {
    const title = lines[i].trim();
    if (!SECTIONS.includes(title)) { i++; continue; }
    i++;
    while (i < lines.length && lines[i].trim() === '') i++;

    const section = { title };
    if (title === 'SUMMARY') {
      section.paragraphs = [];
      while (i < lines.length && !SECTIONS.includes(lines[i].trim())) {
        if (lines[i].trim() !== '') section.paragraphs.push(lines[i].trim());
        i++;
      }
    } else if (title === 'SKILLS') {
      section.lines = [];
      while (i < lines.length && !SECTIONS.includes(lines[i].trim())) {
        if (lines[i].trim() !== '') section.lines.push(lines[i].trim());
        i++;
      }
    } else {
      section.entries = [];
      while (i < lines.length && !SECTIONS.includes(lines[i].trim())) {
        if (lines[i].trim() === '') { i++; continue; }
        const entry = { header: lines[i].trim(), meta: [], bullets: [] };
        i++;
        while (i < lines.length && lines[i].trim() !== '' && !SECTIONS.includes(lines[i].trim())) {
          const l = lines[i].trim();
          if (l.startsWith('- ')) entry.bullets.push(l.slice(2).trim());
          else entry.meta.push(l);
          i++;
        }
        section.entries.push(entry);
        while (i < lines.length && lines[i].trim() === '') i++;
      }
    }
    sections.push(section);
  }
  return { header, sections };
}

function splitMeta(meta) {
  // "Location | Dates" -> [left, right]; otherwise [whole, null]
  const idx = meta.indexOf(' | ');
  if (idx === -1) return [meta, null];
  return [meta.slice(0, idx), meta.slice(idx + 3)];
}

// ---------- DOCX renderer ----------
function buildDocx(data, outPath) {
  const children = [];

  // Header
  children.push(new Paragraph({
    spacing: { after: 40 },
    children: [new TextRun({ text: data.header.name, bold: true, size: 40, font: 'Arial' })],
  }));
  children.push(new Paragraph({
    spacing: { after: 40 },
    children: [new TextRun({ text: data.header.subtitle, size: 22, font: 'Arial' })],
  }));
  for (const c of data.header.contact) {
    children.push(new Paragraph({
      spacing: { after: 20 },
      children: [new TextRun({ text: c, size: 20, font: 'Arial' })],
    }));
  }

  for (const section of data.sections) {
    // Section heading: bold, all caps, 13pt
    children.push(new Paragraph({
      spacing: { before: 240, after: 120 },
      children: [new TextRun({ text: section.title, bold: true, size: 26, font: 'Arial' })],
    }));

    if (section.title === 'SUMMARY') {
      for (const para of section.paragraphs) {
        children.push(new Paragraph({
          spacing: { after: 40 },
          children: [new TextRun({ text: para, size: 22, font: 'Arial' })],
        }));
      }
    } else if (section.title === 'SKILLS') {
      for (const line of section.lines) {
        const ci = line.indexOf(':');
        const label = line.slice(0, ci + 1);
        const rest = line.slice(ci + 1);
        children.push(new Paragraph({
          spacing: { after: 20 },
          children: [
            new TextRun({ text: label, bold: true, size: 22, font: 'Arial' }),
            new TextRun({ text: rest, size: 22, font: 'Arial' }),
          ],
        }));
      }
    } else {
      // EXPERIENCE, PROJECTS, EDUCATION
      for (const entry of section.entries) {
        // Entry header: bold 11pt
        children.push(new Paragraph({
          spacing: { before: 120, after: 20 },
          children: [new TextRun({ text: entry.header, bold: true, size: 22, font: 'Arial' })],
        }));

        // Meta lines. For EXPERIENCE/EDUCATION, meta[0] = "Left | Right" -> right-aligned right side.
        if (section.title !== 'PROJECTS') {
          if (entry.meta.length > 0) {
            const [left, right] = splitMeta(entry.meta[0]);
            children.push(new Paragraph({
              tabStops: [{ type: TabStopType.RIGHT, position: RIGHT_TAB }],
              spacing: { after: 20 },
              children: [
                new TextRun({ text: left, size: 22, font: 'Arial' }),
                ...(right ? [new TextRun({ text: '\t' + right, size: 22, font: 'Arial' })] : []),
              ],
            }));
          }
        } else {
          for (const m of entry.meta) {
            children.push(new Paragraph({
              spacing: { after: 20 },
              children: [new TextRun({ text: m, size: 22, font: 'Arial' })],
            }));
          }
        }

        for (const b of entry.bullets) {
          children.push(new Paragraph({
            bullet: { level: 0 },
            spacing: { after: 20 },
            children: [new TextRun({ text: b, size: 22, font: 'Arial' })],
          }));
        }
      }
    }
  }

  const doc = new Document({
    styles: { default: { document: { run: { font: 'Arial', size: 22 } } } },
    sections: [{
      properties: {
        page: {
          size: { width: PAGE_W, height: 16838 },
          margin: { top: 720, bottom: 720, left: MARGIN_LR, right: MARGIN_LR },
        },
      },
      children,
    }],
  });
  return Packer.toBuffer(doc).then((buf) => writeFileSync(outPath, buf));
}

// ---------- PDF renderer (pdfkit, text-based) ----------
function buildPdf(data, outPath) {
  return new Promise((resolve, reject) => {
  const doc = new PDFDocument({
    size: 'A4',
    margins: { top: 36, bottom: 36, left: 50.4, right: 50.4 },
    info: { Title: 'CV - ' + data.header.name, Author: data.header.name },
  });
  const stream = createWriteStream(outPath);
  stream.on('finish', resolve);
  stream.on('error', reject);
  doc.pipe(stream);
  const M = doc.page.margins;
  const pageW = doc.page.width;
  const contentW = pageW - M.left - M.right;
  let y = M.top;

  const ensure = (h) => {
    if (y + h > doc.page.height - M.bottom) { doc.addPage(); y = M.top; }
  };
  const text = (str, { size = 11, font = 'Helvetica', align = 'left', x = M.left, width = contentW, gap = 2, lineGap = 1.12 } = {}) => {
    if (!str) return;
    doc.font(font).fontSize(size).fillColor('#000');
    const h = doc.heightOfString(str, { width, lineGap });
    ensure(h);
    doc.text(str, x, y, { width, align, lineGap });
    y += h + gap;
  };
  const line = (str, opts) => text(str, opts);

  // Header
  line(data.header.name, { size: 20, font: 'Helvetica-Bold', gap: 4 });
  line(data.header.subtitle, { size: 12, gap: 4 });
  for (const c of data.header.contact) line(c, { size: 10, gap: 2 });

  for (const section of data.sections) {
    y += 10;
    ensure(16);
    line(section.title, { size: 13, font: 'Helvetica-Bold', gap: 4 });

    if (section.title === 'SUMMARY') {
      for (const para of section.paragraphs) line(para, { size: 11, gap: 4 });
    } else if (section.title === 'SKILLS') {
      for (const l of section.lines) {
        const ci = l.indexOf(':');
        const label = l.slice(0, ci + 1);
        const rest = l.slice(ci + 1);
        // label bold + rest normal on same flowing line
        doc.font('Helvetica-Bold').fontSize(11);
        const labelW = doc.widthOfString(label);
        const restW = contentW - labelW;
        const restH = doc.heightOfString(rest, { width: restW });
        const labelH = doc.heightOfString(label, { width: labelW });
        const h = Math.max(labelH, restH);
        ensure(h);
        doc.text(label, M.left, y, { width: labelW });
        doc.font('Helvetica').fontSize(11);
        doc.text(rest, M.left + labelW, y, { width: restW });
        y += h + 2;
      }
    } else {
      for (const entry of section.entries) {
        y += 4;
        ensure(14);
        // header bold
        const headerH = doc.heightOfString(entry.header, { width: contentW });
        ensure(headerH);
        doc.font('Helvetica-Bold').fontSize(11);
        doc.text(entry.header, M.left, y, { width: contentW });
        y += headerH + 2;

        if (section.title !== 'PROJECTS') {
          if (entry.meta.length > 0) {
            const [left, right] = splitMeta(entry.meta[0]);
            const rightW = 175;
            const leftW = contentW - rightW;
            const lh = doc.heightOfString(left, { width: leftW });
            const rh = right ? doc.heightOfString(right, { width: rightW }) : 0;
            const h = Math.max(lh, rh);
            ensure(h);
            doc.font('Helvetica').fontSize(11);
            doc.text(left, M.left, y, { width: leftW });
            if (right) doc.text(right, M.left + leftW, y, { width: rightW, align: 'right' });
            y += h + 2;
          }
        } else {
          for (const m of entry.meta) line(m, { size: 11, gap: 2 });
        }

        for (const b of entry.bullets) {
          const bulletX = M.left;
          const textX = M.left + 14;
          const width = contentW - 14;
          doc.font('Helvetica').fontSize(11);
          const h = doc.heightOfString(b, { width });
          ensure(h);
          doc.text('•', bulletX, y, { width: 14 });
          doc.text(b, textX, y, { width, lineGap: 1.1 });
          y += h + 2;
        }
      }
    }
  }

  doc.end();
  });
}

// ---------- Run ----------
mkdirSync(PDF_OUT, { recursive: true });
mkdirSync(DOCX_OUT, { recursive: true });
for (const lang of LANGS) {
  const src = readFileSync(join(__dirname, lang.file), 'utf-8');
  const data = parseMarkdown(src);
  const docxPath = join(DOCX_OUT, `Gagah-Putra-Anugrah-Software-Engineer-${lang.id}.docx`);
  const pdfPath = join(PDF_OUT, `Gagah-Putra-Anugrah-Software-Engineer-${lang.id}.pdf`);
  await buildDocx(data, docxPath);
  await buildPdf(data, pdfPath);
  console.log(`✓ ${lang.id}: ${docxPath}`);
  console.log(`✓ ${lang.id}: ${pdfPath}`);
}
console.log('Done.');
