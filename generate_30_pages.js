/**
 * 30-Page Word Report Generator for ELECTRICITY BILL CALCULATOR
 * Formatted to match SRM TRP Engineering College specifications
 * and the faculty's requested Table of Contents layout.
 */

const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

const srcDir = './template_extracted';
const buildDir = './report_30_build';

// 1. Clone template extracted directory
function copyDirSync(src, dest) {
    if (!fs.existsSync(dest)) fs.mkdirSync(dest, { recursive: true });
    const entries = fs.readdirSync(src, { withFileTypes: true });
    for (let entry of entries) {
        const srcPath = path.join(src, entry.name);
        const destPath = path.join(dest, entry.name);
        if (entry.isDirectory()) {
            copyDirSync(srcPath, destPath);
        } else {
            fs.copyFileSync(srcPath, destPath);
        }
    }
}

if (fs.existsSync(buildDir)) {
    fs.rmSync(buildDir, { recursive: true, force: true });
}
copyDirSync(srcDir, buildDir);

// 2. Copy images into word/media
const imgDir = './report_images';
const mediaDir = path.join(buildDir, 'word/media');

const imageMap = [
    { src: 'fig3_1_architecture.png', dest: 'image2.png', rId: 'rId10' },
    { src: 'fig3_2_usecase.png', dest: 'image3.png', rId: 'rId11' },
    { src: 'fig3_3_dfd0.png', dest: 'image4.png', rId: 'rId12' },
    { src: 'fig3_4_dfd1.png', dest: 'image5.png', rId: 'rId13' },
    { src: 'fig3_5_workflow.png', dest: 'image6.png', rId: 'rId14' },
    { src: 'fig3_6_sequence.png', dest: 'image7.png', rId: 'rId15' },
    { src: 'fig3_7_sitemap.png', dest: 'image8.png', rId: 'rId16' },
    { src: 'fig3_8_wireframe.png', dest: 'image9.png', rId: 'rId17' },
    { src: 'fig4_1_pseudocode.png', dest: 'image10.png', rId: 'rId18' },
    { src: 'fig4_2_homepage.png', dest: 'image11.png', rId: 'rId19' },
    { src: 'fig4_3_tariffs.png', dest: 'image12.png', rId: 'rId20' },
    { src: 'fig4_4_calculator_form.png', dest: 'image13.png', rId: 'rId21' },
    { src: 'fig4_5_bill_result.png', dest: 'image14.png', rId: 'rId22' },
    { src: 'fig4_6_history.png', dest: 'image15.png', rId: 'rId23' },
    { src: 'fig4_7_printable_bill.png', dest: 'image16.png', rId: 'rId24' },
    { src: 'fig4_8_validation_error.png', dest: 'image17.png', rId: 'rId25' },
    { src: 'fig4_9_code_html.png', dest: 'image18.png', rId: 'rId26' },
    { src: 'fig4_10_code_js.png', dest: 'image19.png', rId: 'rId27' },
    { src: 'fig4_11_code_css.png', dest: 'image20.png', rId: 'rId28' }
];

for (let item of imageMap) {
    fs.copyFileSync(path.join(imgDir, item.src), path.join(mediaDir, item.dest));
}

// Remove old jpegs
const mediaFiles = fs.readdirSync(mediaDir);
for (let f of mediaFiles) {
    if (f.endsWith('.jpeg')) fs.unlinkSync(path.join(mediaDir, f));
}

// 3. Update document.xml.rels
let relsXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/numbering" Target="numbering.xml"/>
  <Relationship Id="rId2" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/>
  <Relationship Id="rId3" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/settings" Target="settings.xml"/>
  <Relationship Id="rId4" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/webSettings" Target="webSettings.xml"/>
  <Relationship Id="rId5" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/footnotes" Target="footnotes.xml"/>
  <Relationship Id="rId6" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/endnotes" Target="endnotes.xml"/>
  <Relationship Id="rId7" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/image" Target="media/image1.png"/>
  <Relationship Id="rId8" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/header" Target="header1.xml"/>
  <Relationship Id="rId9" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/footer" Target="footer1.xml"/>
`;

for (let item of imageMap) {
    relsXml += `  <Relationship Id="${item.rId}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/image" Target="media/${item.dest}"/>\n`;
}

relsXml += `  <Relationship Id="rId29" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/theme" Target="theme/theme1.xml"/>
  <Relationship Id="rId30" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/fontTable" Target="fontTable.xml"/>
</Relationships>`;

fs.writeFileSync(path.join(buildDir, 'word/_rels/document.xml.rels'), relsXml, 'utf8');

// 4. XML Helper functions
function escapeXml(unsafe) {
    if (typeof unsafe !== 'string') return unsafe;
    return unsafe.replace(/[<>&'"]/g, function (c) {
        switch (c) {
            case '<': return '&lt;';
            case '>': return '&gt;';
            case '&': return '&amp;';
            case '\'': return '&apos;';
            case '"': return '&quot;';
        }
    });
}

function p(text, opts = {}) {
    const jc = opts.align ? `<w:jc w:val="${opts.align}"/>` : '<w:jc w:val="both"/>';
    const sb = opts.before !== undefined ? opts.before : 0;
    const sa = opts.after !== undefined ? opts.after : 80;
    const line = opts.line !== undefined ? opts.line : 250;
    const indent = opts.indent ? `<w:ind w:left="${opts.indent}"/>` : '';
    
    let rPr = '<w:rFonts w:ascii="Times New Roman" w:hAnsi="Times New Roman"/>';
    if (opts.bold) rPr += '<w:b/>';
    if (opts.italic) rPr += '<w:i/>';
    if (opts.underline) rPr += '<w:u w:val="single"/>';
    if (opts.size) rPr += `<w:sz w:val="${opts.size * 2}"/>`;
    else rPr += '<w:sz w:val="24"/>';
    if (opts.color) rPr += `<w:color w:val="${opts.color}"/>`;

    return `<w:p>
      <w:pPr>${jc}<w:spacing w:before="${sb}" w:after="${sa}" w:line="${line}" w:lineRule="auto"/>${indent}</w:pPr>
      <w:r><w:rPr>${rPr}</w:rPr><w:t xml:space="preserve">${escapeXml(text)}</w:t></w:r>
    </w:p>`;
}

function pEmpty(sa = 80) {
    return `<w:p><w:pPr><w:spacing w:after="${sa}"/></w:pPr></w:p>`;
}

function h1(title) {
    return `<w:p>
      <w:pPr><w:jc w:val="center"/><w:spacing w:before="160" w:after="120"/></w:pPr>
      <w:r><w:rPr><w:rFonts w:ascii="Times New Roman" w:hAnsi="Times New Roman"/><w:b/><w:sz w:val="30"/><w:color w:val="002060"/></w:rPr><w:t>${escapeXml(title)}</w:t></w:r>
    </w:p>`;
}

function h2(title) {
    return `<w:p>
      <w:pPr><w:jc w:val="left"/><w:spacing w:before="140" w:after="60"/></w:pPr>
      <w:r><w:rPr><w:rFonts w:ascii="Times New Roman" w:hAnsi="Times New Roman"/><w:b/><w:sz w:val="26"/><w:color w:val="002060"/></w:rPr><w:t>${escapeXml(title)}</w:t></w:r>
    </w:p>`;
}

function h3(title) {
    return `<w:p>
      <w:pPr><w:jc w:val="left"/><w:spacing w:before="100" w:after="40"/></w:pPr>
      <w:r><w:rPr><w:rFonts w:ascii="Times New Roman" w:hAnsi="Times New Roman"/><w:b/><w:sz w:val="24"/><w:color w:val="1E3A8A"/></w:rPr><w:t>${escapeXml(title)}</w:t></w:r>
    </w:p>`;
}

function bullet(text) {
    return `<w:p>
      <w:pPr><w:jc w:val="both"/><w:spacing w:before="20" w:after="40" w:line="240" w:lineRule="auto"/><w:ind w:left="360" w:hanging="200"/></w:pPr>
      <w:r><w:rPr><w:rFonts w:ascii="Times New Roman" w:hAnsi="Times New Roman"/><w:sz w:val="23"/></w:rPr><w:t xml:space="preserve">&#8226;  ${escapeXml(text)}</w:t></w:r>
    </w:p>`;
}

function pb() {
    return `<w:p><w:r><w:br w:type="page"/></w:r></w:p>`;
}

function img(rId, cx, cy, caption) {
    return `<w:p>
      <w:pPr><w:jc w:val="center"/><w:spacing w:before="80" w:after="40"/></w:pPr>
      <w:r>
        <w:drawing>
          <wp:inline distT="0" distB="0" distL="0" distR="0">
            <wp:extent cx="${cx}" cy="${cy}"/>
            <wp:docPr id="${Math.floor(Math.random()*100000)}" name="Figure"/>
            <wp:cNvGraphicFramePr><a:graphicFrameLocks xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" noChangeAspect="1"/></wp:cNvGraphicFramePr>
            <a:graphic xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main">
              <a:graphicData uri="http://schemas.openxmlformats.org/drawingml/2006/picture">
                <pic:pic xmlns:pic="http://schemas.openxmlformats.org/drawingml/2006/picture">
                  <pic:nvPicPr><pic:cNvPr id="0" name=""/><pic:cNvPicPr/></pic:nvPicPr>
                  <pic:blipFill><a:blip r:embed="${rId}"/><a:stretch><a:fillRect/></a:stretch></pic:blipFill>
                  <pic:spPr><a:xfrm><a:off x="0" y="0"/><a:ext cx="${cx}" cy="${cy}"/></a:xfrm><a:prstGeom prst="rect"><a:avLst/></a:prstGeom></pic:spPr>
                </pic:pic>
              </a:graphicData>
            </a:graphic>
          </wp:inline>
        </w:drawing>
      </w:r>
    </w:p>
    <w:p>
      <w:pPr><w:jc w:val="center"/><w:spacing w:before="20" w:after="100"/></w:pPr>
      <w:r><w:rPr><w:rFonts w:ascii="Times New Roman" w:hAnsi="Times New Roman"/><w:b/><w:i/><w:sz w:val="21"/><w:color w:val="002060"/></w:rPr><w:t>${escapeXml(caption)}</w:t></w:r>
    </w:p>`;
}

function table(headers, rows, colWidths = [], isHeaderShaded = true) {
    let gridXml = '<w:tblGrid>';
    colWidths.forEach(w => {
        gridXml += `<w:gridCol w:w="${w}"/>`;
    });
    gridXml += '</w:tblGrid>';

    let headerXml = '<w:tr><w:trPr><w:tblHeader/></w:trPr>';
    headers.forEach((h, idx) => {
        const wXml = colWidths[idx] ? `<w:tcW w:w="${colWidths[idx]}" w:type="dxa"/>` : '';
        const shd = isHeaderShaded ? '<w:shd w:val="clear" w:color="auto" w:fill="002060"/>' : '<w:shd w:val="clear" w:color="auto" w:fill="FFFFFF"/>';
        const textColor = isHeaderShaded ? 'FFFFFF' : '000000';
        headerXml += `<w:tc>
          <w:tcPr>${wXml}${shd}<w:vAlign w:val="center"/></w:tcPr>
          <w:p><w:pPr><w:jc w:val="center"/><w:spacing w:before="40" w:after="40"/></w:pPr>
          <w:r><w:rPr><w:rFonts w:ascii="Times New Roman" w:hAnsi="Times New Roman"/><w:b/><w:sz w:val="22"/><w:color w:val="${textColor}"/></w:rPr><w:t>${escapeXml(h)}</w:t></w:r></w:p>
        </w:tc>`;
    });
    headerXml += '</w:tr>';

    let rowsXml = '';
    rows.forEach((row, rIdx) => {
        const fill = (isHeaderShaded && rIdx % 2 === 1) ? 'F8FAFC' : 'FFFFFF';
        rowsXml += '<w:tr>';
        row.forEach((cell, cIdx) => {
            const wXml = colWidths[cIdx] ? `<w:tcW w:w="${colWidths[cIdx]}" w:type="dxa"/>` : '';
            const isNum = !isNaN(cell.replace(/[^0-9.]/g, '')) && cell.trim() !== '' && !cell.includes('-');
            const align = (cIdx === 0 && row.length > 3) ? 'center' : (cIdx >= row.length - 2 && isNum ? 'right' : 'left');
            rowsXml += `<w:tc>
              <w:tcPr>${wXml}<w:shd w:val="clear" w:color="auto" w:fill="${fill}"/><w:vAlign w:val="center"/></w:tcPr>
              <w:p><w:pPr><w:jc w:val="${align}"/><w:spacing w:before="40" w:after="40" w:line="220" w:lineRule="auto"/></w:pPr>
              <w:r><w:rPr><w:rFonts w:ascii="Times New Roman" w:hAnsi="Times New Roman"/><w:sz w:val="21"/></w:rPr><w:t xml:space="preserve">${escapeXml(cell)}</w:t></w:r></w:p>
            </w:tc>`;
        });
        rowsXml += '</w:tr>';
    });

    return `<w:tbl>
      <w:tblPr>
        <w:tblW w:w="5000" w:type="pct"/>
        <w:jc w:val="center"/>
        <w:tblBorders>
          <w:top w:val="single" w:sz="6" w:space="0" w:color="000000"/>
          <w:left w:val="single" w:sz="6" w:space="0" w:color="000000"/>
          <w:bottom w:val="single" w:sz="6" w:space="0" w:color="000000"/>
          <w:right w:val="single" w:sz="6" w:space="0" w:color="000000"/>
          <w:insideH w:val="single" w:sz="4" w:space="0" w:color="000000"/>
          <w:insideV w:val="single" w:sz="4" w:space="0" w:color="000000"/>
        </w:tblBorders>
        <w:tblCellMar>
          <w:top w:w="80" w:type="dxa"/>
          <w:bottom w:w="80" w:type="dxa"/>
          <w:left w:w="120" w:type="dxa"/>
          <w:right w:w="120" w:type="dxa"/>
        </w:tblCellMar>
      </w:tblPr>
      ${gridXml}
      ${headerXml}
      ${rowsXml}
    </w:tbl>
    <w:p><w:pPr><w:spacing w:after="100"/></w:pPr></w:p>`;
}

// 5. Construct Exactly 30 Pages
const pages = [];

// =========================================================================
// PAGE 1: COVER PAGE
// =========================================================================
let p1 = '';
p1 += `<w:p>
  <w:pPr><w:jc w:val="center"/><w:spacing w:before="60" w:after="60"/></w:pPr>
  <w:r>
    <w:drawing>
      <wp:inline distT="0" distB="0" distL="0" distR="0">
        <wp:extent cx="3943350" cy="981075"/>
        <wp:docPr id="1" name="College Logo"/>
        <wp:cNvGraphicFramePr><a:graphicFrameLocks xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" noChangeAspect="1"/></wp:cNvGraphicFramePr>
        <a:graphic xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main">
          <a:graphicData uri="http://schemas.openxmlformats.org/drawingml/2006/picture">
            <pic:pic xmlns:pic="http://schemas.openxmlformats.org/drawingml/2006/picture">
              <pic:nvPicPr><pic:cNvPr id="0" name=""/><pic:cNvPicPr/></pic:nvPicPr>
              <pic:blipFill><a:blip r:embed="rId7"/><a:stretch><a:fillRect/></a:stretch></pic:blipFill>
              <pic:spPr><a:xfrm><a:off x="0" y="0"/><a:ext cx="3943350" cy="981075"/></a:xfrm><a:prstGeom prst="rect"><a:avLst/></a:prstGeom></pic:spPr>
            </pic:pic>
          </a:graphicData>
        </a:graphic>
      </wp:inline>
    </w:drawing>
  </w:r>
</w:p>`;

p1 += p('Department of Information Technology', { align: 'center', bold: true, size: 14, color: '000000', before: 60, after: 200 });
p1 += p('ELECTRICITY BILL CALCULATOR', { align: 'center', bold: true, size: 20, color: 'C00000', before: 100, after: 120 });
p1 += p('Submitted in partial fulfilment of the requirements for the degree of', { align: 'center', italic: true, size: 12, color: '000000', before: 80, after: 80 });
p1 += p('BACHELOR OF TECHNOLOGY', { align: 'center', bold: true, size: 15, color: '000000', before: 60, after: 30 });
p1 += p('In', { align: 'center', bold: true, size: 13, color: '000000', before: 30, after: 30 });
p1 += p('INFORMATION TECHNOLOGY', { align: 'center', bold: true, size: 15, color: '000000', before: 30, after: 140 });

p1 += p('Submitted By', { align: 'center', italic: true, size: 13, color: '000000', before: 60, after: 60 });
p1 += p('Team Members', { align: 'center', bold: true, size: 14, color: '000000', before: 30, after: 100 });

p1 += table(['S.No.', 'Student Name', 'Register Number'], [
    ['1', 'SHAPTHAGIRI G', '814725205105'],
    ['2', 'RENGESH M', '814725205088'],
    ['3', 'SAI SARAN N', '814725205096']
], [1000, 4400, 3400], true);

p1 += p('Under the Guidance of', { align: 'center', italic: true, size: 13, color: '000000', before: 100, after: 30 });
p1 += p('Mrs. C. Manonmani', { align: 'center', bold: true, size: 14, color: '000000', before: 30, after: 140 });
p1 += p('SRM TRP ENGINEERING COLLEGE', { align: 'center', bold: true, size: 14, color: '002060', before: 60, after: 30 });
p1 += p('(An Autonomous Institution Affiliated to Anna University, Chennai)', { align: 'center', italic: true, size: 10, color: '475569', before: 0, after: 30 });
p1 += p('Tiruchirappalli – 621 105', { align: 'center', size: 11, color: '000000', before: 0, after: 30 });
p1 += p('Academic Year: 2026-27 (ODD)', { align: 'center', bold: true, size: 12, color: '000000', before: 30, after: 60 });

pages.push(p1);

// =========================================================================
// PAGE 2: BONAFIDE CERTIFICATE
// =========================================================================
let p2 = '';
p2 += `<w:p>
  <w:pPr><w:jc w:val="center"/><w:spacing w:before="60" w:after="60"/></w:pPr>
  <w:r>
    <w:drawing>
      <wp:inline distT="0" distB="0" distL="0" distR="0">
        <wp:extent cx="3943350" cy="981075"/>
        <wp:docPr id="2" name="College Logo"/>
        <wp:cNvGraphicFramePr><a:graphicFrameLocks xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" noChangeAspect="1"/></wp:cNvGraphicFramePr>
        <a:graphic xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main">
          <a:graphicData uri="http://schemas.openxmlformats.org/drawingml/2006/picture">
            <pic:pic xmlns:pic="http://schemas.openxmlformats.org/drawingml/2006/picture">
              <pic:nvPicPr><pic:cNvPr id="0" name=""/><pic:cNvPicPr/></pic:nvPicPr>
              <pic:blipFill><a:blip r:embed="rId7"/><a:stretch><a:fillRect/></a:stretch></pic:blipFill>
              <pic:spPr><a:xfrm><a:off x="0" y="0"/><a:ext cx="3943350" cy="981075"/></a:xfrm><a:prstGeom prst="rect"><a:avLst/></a:prstGeom></pic:spPr>
            </pic:pic>
          </a:graphicData>
        </a:graphic>
      </wp:inline>
    </w:drawing>
  </w:r>
</w:p>`;

p2 += p('Department of Information Technology', { align: 'center', bold: true, size: 14, color: '000000', before: 80, after: 140 });
p2 += h1('BONAFIDE CERTIFICATE');
p2 += pEmpty(80);

p2 += p('This is to certify that SHAPTHAGIRI G (Reg. No: 814725205105), RENGESH M (Reg. No: 814725205088), and SAI SARAN N (Reg. No: 814725205096) from second year B.Tech Information Technology have successfully completed their mini-project work titled “ELECTRICITY BILL CALCULATOR” at SRM TRP Engineering College, Tiruchirappalli in partial fulfillment of the requirements for the award of the degree of Bachelor of Technology in Information Technology during the academic year 2026-27 (ODD).', { align: 'both', size: 12, line: 300, after: 200 });

p2 += pEmpty(160);

p2 += table(['FACULTY IN-CHARGE', 'HEAD OF THE DEPARTMENT'], [
    [
        'Mrs. C. Manonmani\n(Faculty In-charge)\nArtificial Intelligence & Data Science\nSRM TRP Engineering College\nTrichy - 621 105',
        'Dr. S. Sabeetha Saraswathi\n(Head of Department)\nDepartment of Information Technology\nSRM TRP Engineering College\nTrichy - 621 105'
    ]
], [4400, 4400], true);

p2 += pEmpty(120);
p2 += p('Submitted for the Mini-Project Viva-Voce Examination held on: ..............................', { align: 'left', size: 11, italic: true, after: 120 });

p2 += table(['INTERNAL EXAMINER', 'EXTERNAL EXAMINER'], [
    ['INTERNAL EXAMINER', 'EXTERNAL EXAMINER']
], [4400, 4400], true);

pages.push(p2);

// =========================================================================
// PAGE 3: ACKNOWLEDGEMENT
// =========================================================================
let p3 = '';
p3 += h1('ACKNOWLEDGEMENT');
p3 += pEmpty(60);

p3 += p('It is with sincere gratitude and deep appreciation that we take this opportunity to acknowledge the invaluable support, constructive advice, and continuous guidance we have received throughout the course of this mini-project work.', { align: 'both', size: 12, line: 280, after: 100 });

p3 += p('We express our profound heartfelt thanks to our respected Project Guide, Mrs. C. Manonmani, Faculty In-charge, Department of Artificial Intelligence & Data Science, for her scholarly guidance, constant encouragement, and insightful feedback during every stage of designing and developing the Electricity Bill Calculator application.', { align: 'both', size: 12, line: 280, after: 100 });

p3 += p('We extend our heartfelt gratitude to Dr. S. Sabeetha Saraswathi, Head of the Department of Information Technology, for providing the necessary infrastructural resources, computer laboratory facilities, and an encouraging academic environment that fostered technological innovation and experiential learning.', { align: 'both', size: 12, line: 280, after: 100 });

p3 += p('We would also like to record our deep sense of gratitude to the Principal, Executive Director, and the Management of SRM TRP Engineering College, Tiruchirappalli, for providing state-of-the-art computational facilities and continuous academic support.', { align: 'both', size: 12, line: 280, after: 100 });

p3 += p('A special note of thanks goes to all the faculty members, laboratory instructors, and supporting technical staff of the Department of Information Technology for their kind cooperation, technical assistance, and timely guidance throughout the project tenure.', { align: 'both', size: 12, line: 280, after: 100 });

p3 += p('Finally, we express our deepest, warmest gratitude to our beloved parents and family members for their unconditional love, moral encouragement, patient endurance, and constant inspiration. We also thank our fellow classmates and friends who directly or indirectly contributed their valuable suggestions towards the successful completion of this project work.', { align: 'both', size: 12, line: 280, after: 140 });

p3 += p('Academic Year: 2026-2027', { align: 'right', bold: true, size: 11, after: 40 });
p3 += p('Team Members:', { align: 'right', bold: true, size: 11, after: 20 });
p3 += p('SHAPTHAGIRI G (814725205105)', { align: 'right', size: 11, after: 20 });
p3 += p('RENGESH M (814725205088)', { align: 'right', size: 11, after: 20 });
p3 += p('SAI SARAN N (814725205096)', { align: 'right', size: 11, after: 40 });

pages.push(p3);

// =========================================================================
// PAGE 4: TABLE OF CONTENTS (STRICT SCREENSHOT REPLICATION)
// =========================================================================
let p4 = '';
// Heading matching screenshot: TABLE OF CONTENTS, bold, underlined, centered
p4 += `<w:p>
  <w:pPr><w:jc w:val="center"/><w:spacing w:before="200" w:after="240"/></w:pPr>
  <w:r><w:rPr><w:rFonts w:ascii="Times New Roman" w:hAnsi="Times New Roman"/><w:b/><w:u w:val="single"/><w:sz w:val="32"/><w:color w:val="000000"/></w:rPr><w:t>TABLE OF CONTENTS</w:t></w:r>
</w:p>`;

// Strict Table matching user's screenshot
const tocRowsExact = [
    ['1', 'Acknowledgement………………………………………………………………………………', '3'],
    ['2', 'Abstract …………………………………………………………………………………………', '5'],
    ['3', 'Introduction………………………………………………………………………………………', '6'],
    ['4', 'System Requirements ……………………………………………………………………………', '9'],
    ['5', 'System Design……………………………………………………………………………………', '12'],
    ['6', 'Implementation……………………………………………………………………………………', '17'],
    ['7', 'Testing……………………………………………………………………………………………', '23'],
    ['8.', 'Result and Conclusion …………………………………………………………………………', '27'],
    ['9.', 'References…………………………………………………………………………………………', '29']
];

p4 += table(['Sr. No', 'Title', 'Page\nNo.'], tocRowsExact, [1100, 6500, 1200], false);

pages.push(p4);

// =========================================================================
// PAGE 5: ABSTRACT
// =========================================================================
let p5 = '';
p5 += h1('ABSTRACT');
p5 += pEmpty(80);

p5 += p('The Electricity Bill Calculator (branded as PowerCalc) is a lightweight, responsive, client-side web application designed to simplify, automate, and streamline the computation of domestic and commercial electricity consumption and estimated utility charges. In conventional manual billing, consumers often experience ambiguity regarding how their electricity bill is derived across multi-tiered, progressive slab structures, frequently leading to misunderstandings, budgeting difficulties, and manual calculation errors. This project bridges that gap by offering a transparent, instant, and interactive web tool that enables power consumers to compute their energy consumption directly from meter readings and understand their progressive cost breakdown.', { align: 'both', size: 12, line: 280, after: 120 });

p5 += p('The web application provides an intuitive single-page interface comprising a prominent hero banner, an illustrative tariff slab overview, an interactive consumer and meter reading input form, a detailed progressive bill summary breakdown, persistent calculation history powered by browser LocalStorage, and a dedicated print stylesheet for generating clean invoice slips. Users input their previous meter reading and current meter reading in kilowatt-hours (kWh); the client-side JavaScript engine automatically computes the net energy units consumed (Units = Current Reading - Previous Reading) and rigorously applies a four-tier progressive tariff schedule (0–100 units at ₹1.50/unit, 101–200 units at ₹2.50/unit, 201–300 units at ₹4.00/unit, and units above 300 at ₹6.00/unit).', { align: 'both', size: 12, line: 280, after: 120 });

p5 += p('Developed using standard modern web technologies including HTML5 for semantic page layout, CSS3 for responsive and print styling, and modern JavaScript (ES6) for DOM manipulation and calculation logic, the system operates completely on the client side without requiring server-side runtimes or external database installations. Historical calculations are stored locally in the browser’s LocalStorage key-value cache, permitting consumers to review past utility expenses or clear records at will. The project successfully demonstrates how foundational web engineering principles can be applied to solve everyday consumer utility challenges.', { align: 'both', size: 12, line: 280, after: 140 });

p5 += p('Keywords: Electricity Bill Calculator, Energy Consumption, Progressive Slab Tariff, Client-Side Web Application, LocalStorage, HTML5, CSS3, JavaScript, Responsive Design.', { align: 'both', bold: true, size: 11, line: 250, color: '002060', after: 40 });

pages.push(p5);

// =========================================================================
// PAGE 6: CHAPTER 1 - INTRODUCTION (PART 1)
// =========================================================================
let p6 = '';
p6 += h1('CHAPTER 1\nINTRODUCTION');
p6 += pEmpty(60);

p6 += h2('1.1 Project Background');
p6 += p('Electricity is one of the most fundamental infrastructure resources powering modern civilization, supporting residential households, agricultural operations, commercial establishments, and heavy industrial facilities. Efficient energy utilization and transparent utility accounting are paramount for both power distribution companies and electricity consumers. Every billing cycle, power utility boards measure consumer consumption through electromechanical or digital energy meters located at customer premises. These meters record cumulative electrical energy consumed over time in kilowatt-hours (kWh), universally termed as "units".', { align: 'both', size: 12, line: 270, after: 100 });

p6 += p('To promote conservation, discourage wasteful energy consumption, and provide affordable baseline electricity to economically vulnerable citizens, power regulatory commissions across India adopt progressive, multi-tier slab tariff systems. Under a progressive slab scheme, energy charges do not follow a flat rate; rather, initial blocks of consumed units are priced at highly subsidized lower rates, whereas subsequent increments of consumption are assessed at progressively escalating marginal rates. While economically equitable, progressive slab tariffs are mathematically complex for ordinary citizens to calculate manually, causing confusion and dispute.', { align: 'both', size: 12, line: 270, after: 100 });

p6 += h2('1.2 Problem Statement');
p6 += p('Despite the widespread availability of digital energy meters, millions of consumers face persistent challenges in monitoring and verifying their electricity bills. In the conventional scenario:', { align: 'both', size: 12, line: 270, after: 60 });

p6 += bullet('Consumers typically wait until the utility board issues a bi-monthly or monthly physical paper bill, leaving them unable to track their consumption trends proactively during the billing cycle.');
p6 += bullet('Manual calculation of progressive slab tariffs involves dividing total consumption across multiple rate tiers, which is highly error-prone and confusing for non-technical individuals.');
p6 += bullet('Consumers often mistakenly believe that crossing into a higher slab rate applies that higher tariff retroactively to all consumed units, leading to distrust in utility board accounting.');
p6 += bullet('There is a lack of simple, lightweight, zero-cost digital tools that allow householders and small business owners to enter previous and current meter readings, immediately verify consumption, inspect itemized slab costs, and maintain historical calculation records.');

pages.push(p6);

// =========================================================================
// PAGE 7: CHAPTER 1 - INTRODUCTION (PART 2)
// =========================================================================
let p7 = '';
p7 += h2('1.3 Aim of the Project');
p7 += p('The primary aim of this mini-project is to design, develop, test, and deploy a responsive, highly accessible, and user-friendly web application titled "Electricity Bill Calculator" that automatically calculates electricity consumption from meter readings and computes estimated progressive tariff charges using client-side web technologies.', { align: 'both', size: 12, line: 270, after: 100 });

p7 += h2('1.4 Objectives of the Project');
p7 += p('The specific academic and practical objectives established for this project include:', { align: 'both', size: 12, line: 270, after: 60 });

p7 += bullet('To eliminate manual arithmetic errors by automating energy unit computation using the standardized formula (Units Consumed = Current Reading - Previous Reading).');
p7 += bullet('To implement an accurate progressive slab tariff calculation algorithm across four distinct consumption tiers (0-100 units @ ₹1.50, 101-200 units @ ₹2.50, 201-300 units @ ₹4.00, and above 300 units @ ₹6.00).');
p7 += bullet('To enforce strict client-side input validation preventing negative readings, blank fields, non-numeric inputs, and logical anomalies where current reading is less than previous reading.');
p7 += bullet('To generate a transparent, itemized electricity bill summary table clearly articulating the exact units billed and charges incurred within each individual tariff slab.');
p7 += bullet('To implement client-side data persistence using browser LocalStorage, enabling consumers to save, review, and delete previous calculation records locally without server overhead.');
p7 += bullet('To design a dedicated print stylesheet (@media print) allowing consumers to print an official, receipt-style electricity invoice summary directly from their browser.');
p7 += bullet('To build an aesthetically pleasing, responsive user interface supporting seamless interaction across desktop monitors, laptops, tablets, and smartphones.');

p7 += h2('1.5 Scope of the Project');
p7 += p('The project encompasses complete frontend client-side development: semantic HTML5 structures, modern responsive CSS3 styling, client JavaScript computing, LocalStorage data persistence, and static hosting via GitHub Pages. It models progressive slab accounting cleanly for academic demonstration.', { align: 'both', size: 12, line: 270, after: 80 });

p7 += h2('1.6 Need for the Project');
p7 += p('With the transition toward self-service e-governance and smart metering, accessible tools that clarify utility computations empower citizens, encourage energy conservation, and eliminate billing disputes.', { align: 'both', size: 12, line: 270, after: 60 });

pages.push(p7);

// =========================================================================
// PAGE 8: CHAPTER 1 - INTRODUCTION (PART 3)
// =========================================================================
let p8 = '';
p8 += h2('1.7 Existing System and Drawbacks');
p8 += p('In the existing traditional system, meter readers visit premises periodically to note down readings manually. Consumers receive paper receipts or SMS alerts after billing cycles close. Major drawbacks include:', { align: 'both', size: 12, line: 270, after: 60 });

p8 += bullet('No Real-Time Estimation: Consumers cannot calculate mid-cycle consumption or forecast monthly utility costs before the official bill arrives.');
p8 += bullet('Opaque Calculation: Utility bills often show lump-sum charges without itemizing how units were segmented across progressive slabs.');
p8 += bullet('Manual Arithmetic Errors: Hand-calculating tiered slab rates often results in calculation errors and confusion.');
p8 += bullet('Misplaced Physical Records: Paper receipts are easily lost or damaged, depriving consumers of historical consumption records.');

p8 += h2('1.8 Proposed System and Advantages');
p8 += p('The proposed Electricity Bill Calculator application provides a modern, automated web interface addressing each existing deficiency:', { align: 'both', size: 12, line: 270, after: 60 });

p8 += bullet('Instant Automated Computation: Eliminates arithmetic effort by calculating net units and progressive charges in milliseconds.');
p8 += bullet('Transparent Itemized Breakdown: Clearly displays units, rates, and amounts for every slab in a clean summary table.');
p8 += bullet('Zero Installation & High Portability: Operates on any browser across desktop, laptop, tablet, and mobile devices.');
p8 += bullet('Client-Side Privacy: Computations and historical records are processed locally via JavaScript and LocalStorage.');
p8 += bullet('Printable Digital Invoices: Incorporates print CSS to format clean, receipt-style paper invoices.');

p8 += h2('1.9 Organization of the Report');
p8 += p('This report is organized into six chapters: Chapter 1 introduces the project background, problem statement, objectives, and scope. Chapter 2 details hardware, software, functional requirements, feasibility, and technologies used. Chapter 3 explains system design, architecture, DFDs, use cases, and workflows. Chapter 4 presents implementation, algorithms, formulas, and screenshots. Chapter 5 covers test cases, testing types, and verification results. Chapter 6 concludes with achievements, limitations, and future enhancements.', { align: 'both', size: 12, line: 270, after: 60 });

pages.push(p8);

// =========================================================================
// PAGE 9: CHAPTER 2 - SYSTEM REQUIREMENTS (PART 1)
// =========================================================================
let p9 = '';
p9 += h1('CHAPTER 2\nSYSTEM REQUIREMENTS');
p9 += pEmpty(60);

p9 += p('System requirements specify the essential hardware resources, software platforms, development tools, and operational characteristics required to design, develop, execute, and maintain the Electricity Bill Calculator application. Because the application is architected as a lightweight, client-side static web application, the computational demands on both developer and client workstations are modest.', { align: 'both', size: 12, line: 270, after: 100 });

p9 += h2('2.1 Hardware Requirements');
p9 += bullet('Processor: Intel Core i3 or equivalent AMD multi-core processor (1.8 GHz or higher).');
p9 += bullet('RAM: Minimum 4 GB RAM (8 GB recommended for development and browser multitasking).');
p9 += bullet('Hard Disk Storage: Minimum 1 GB of free storage space for code files, documentation, and browser cache.');
p9 += bullet('Display Monitor: Standard color monitor with minimum resolution of 1366 × 768 pixels (adaptive to mobile displays down to 320px).');
p9 += bullet('Input Devices: Standard alphanumeric keyboard and optical mouse or touch-sensitive trackpad / touchscreen.');
p9 += bullet('Network Interface: Internet connection for initial resource downloading and remote repository hosting via GitHub.');

p9 += h2('2.2 Software Requirements');
p9 += bullet('Operating System: Microsoft Windows 10 / Windows 11 (64-bit), Ubuntu Linux 20.04+, or Apple macOS.');
p9 += bullet('Frontend Technologies: HyperText Markup Language 5 (HTML5), Cascading Style Sheets 3 (CSS3), and JavaScript (ECMAScript 2020 / ES6+).');
p9 += bullet('Client Storage Mechanism: Browser Web Storage API (LocalStorage).');
p9 += bullet('Integrated Development Environment (IDE): Visual Studio Code (Version 1.85+) with Live Server extension.');
p9 += bullet('Version Control & Hosting: Git distributed version control system and GitHub Pages static web hosting service.');
p9 += bullet('Target Web Browsers: Google Chrome (v110+), Mozilla Firefox (v105+), Microsoft Edge (v110+), or Apple Safari (v15+).');

p9 += h2('2.3 Functional Requirements');
p9 += bullet('FR-1 (Consumer Profile Entry): Accepts consumer name, service ID, connection type, and service address.');
p9 += bullet('FR-2 (Meter Reading Input): Structured numeric fields capturing previous and current readings in kWh.');
p9 += bullet('FR-3 (Strict Input Validation): Traps empty fields, negative inputs, and ensures current reading >= previous reading.');
p9 += bullet('FR-4 (Consumption Calculation): Automatically computes energy consumption: Units = Current - Previous.');
p9 += bullet('FR-5 (Progressive Slab Calculation): Evaluates units against four progressive slab tiers.');
p9 += bullet('FR-6 (Bill Summary Generation): Generates itemized invoice summary with slab charges and net bill.');
p9 += bullet('FR-7 (LocalStorage History Management): Saves, displays, and deletes past calculation records locally.');
p9 += bullet('FR-8 (Print Invoice Formatting): Triggers browser printing with print-optimized CSS receipt formatting.');

pages.push(p9);

// =========================================================================
// PAGE 10: CHAPTER 2 - SYSTEM REQUIREMENTS (PART 2)
// =========================================================================
let p10 = '';
p10 += h2('2.4 Non-Functional Requirements');
p10 += p('Non-functional requirements specify the operational quality attributes, performance benchmarks, and usability standards satisfied by the application:', { align: 'both', size: 12, line: 270, after: 60 });

p10 += bullet('Usability & Simplicity: The user interface is clean, highly intuitive, and self-explanatory, requiring zero technical training or prior instructions.');
p10 += bullet('Responsiveness: The application layout dynamically adapts across standard screen viewports (desktop monitors, laptops, tablets, mobile smartphones) using CSS media queries and flexible grid layouts.');
p10 += bullet('High Performance & Low Latency: Because all calculations occur client-side via JavaScript without backend network round-trips, bill generation executes instantaneously (under 50 milliseconds).');
p10 += bullet('Portability: The web application operates uniformly across all major modern web browsers without requiring external browser plugins, compilers, or platform-specific libraries.');
p10 += bullet('Reliability & Error Prevention: The application catches and handles invalid inputs gracefully, presenting clear visual error messages without application crashes or incorrect arithmetic outputs.');
p10 += bullet('Maintainability: Codebase follows modular engineering practices, separating structure (HTML5), visual presentation (CSS3), and behavioral logic (JavaScript) into decoupled files.');

p10 += h2('2.5 Feasibility Study');
p10 += p('A structured feasibility study was conducted to evaluate the technical, economic, and operational viability of the project before development.', { align: 'both', size: 12, line: 270, after: 80 });

p10 += h3('2.5.1 Technical Feasibility');
p10 += p('The project utilizes mature, industry-standard web standards: HTML5, CSS3, and JavaScript. These technologies are natively supported by every modern web browser on desktop and mobile platforms. No complex back-end application servers, web frameworks, or third-party database engines are mandatory for executing client-side mathematical calculations and storing local session data. Thus, the project is technically sound and highly feasible.', { align: 'both', size: 12, line: 270, after: 80 });

p10 += h3('2.5.2 Economic Feasibility');
p10 += p('All software tools, compilers, development libraries, code editors (VS Code), web browsers (Google Chrome), and deployment environments (GitHub Pages) employed throughout this project are completely free, open-source, or zero-cost services. The application imposes zero recurring database licensing costs or dedicated cloud hosting infrastructure charges. Consequently, the project requires zero financial investment, making it economically optimal.', { align: 'both', size: 12, line: 270, after: 80 });

p10 += h3('2.5.3 Operational Feasibility');
p10 += p('The user interface is designed with familiarity and simplicity, mirroring standard online consumer utility portals. Householders, students, and small business owners can calculate bills effortlessly by simply inputting meter readings. Updating tariff slabs or modifying rate configurations requires only minor edits to a well-defined JavaScript configuration array. Hence, the project possesses high operational feasibility.', { align: 'both', size: 12, line: 270, after: 80 });

pages.push(p10);

// =========================================================================
// PAGE 11: CHAPTER 2 - SYSTEM REQUIREMENTS (PART 3)
// =========================================================================
let p11 = '';
p11 += h2('2.6 Technologies Used');
p11 += p('Table 2.1 summarizes the technology stack selected for developing the Electricity Bill Calculator and the precise engineering role of each component.', { align: 'both', size: 12, line: 270, after: 80 });

const techRowsCompact = [
    ['HTML5', 'Semantic structure: header, navigation, hero banner, tariff cards, calculator form, summary invoice, and footer.'],
    ['CSS3', 'Visual design, color palette, flexbox and grid layouts, typography, button hover states, and responsive media queries.'],
    ['JavaScript (ES6)', 'Client-side calculation engine, progressive slab logic, input validation, DOM event handling, and LocalStorage CRUD.'],
    ['Web Storage API', 'Browser-native LocalStorage key-value persistence for storing, retrieving, and clearing past calculation records.'],
    ['Visual Studio Code', 'Modern source code editor utilized for authoring code, syntax highlighting, debugging, and project structuring.'],
    ['Google Chrome / Edge', 'Primary runtime environments utilized for client execution, UI rendering, DevTools debugging, and invoice printing.'],
    ['Git & GitHub Pages', 'Version control tracking, source repository management, and free static HTTPS web application deployment.']
];
p11 += table(['Technology / Tool', 'Purpose and Engineering Role in Project'], techRowsCompact, [2400, 6400], true);

p11 += p('HTML5 provides semantic page organization using specialized structural tags such as <header>, <nav>, <section>, <form>, <table>, and <footer>. This semantic foundation ensures high accessibility and clean separation of concerns.', { align: 'both', size: 12, line: 270, after: 60 });
p11 += p('CSS3 introduces sophisticated layout capabilities through CSS Flexbox and CSS Grid, supporting responsive breakpoints that reflow content seamlessly from wide monitors down to narrow smartphone screens. CSS Custom Properties (:root) maintain a consistent visual design system.', { align: 'both', size: 12, line: 270, after: 60 });
p11 += p('Modern JavaScript (ECMAScript 6+) runs directly in the client’s browser sandbox, handling interactive events, validating user inputs, and computing progressive tariffs with zero server round-trip latency. Browser LocalStorage provides persistent client-side data storage without backend database dependencies.', { align: 'both', size: 12, line: 270, after: 60 });

pages.push(p11);

// =========================================================================
// PAGE 12: CHAPTER 3 - SYSTEM DESIGN (PART 1: ARCHITECTURE)
// =========================================================================
let p12 = '';
p12 += h1('CHAPTER 3\nSYSTEM DESIGN');
p12 += pEmpty(60);

p12 += h2('3.1 Overall System Architecture');
p12 += p('The Electricity Bill Calculator is architected following a modular client-side single-page architecture (SPA). Rather than relying on multi-tier server-side processing pipelines that require continuous client-server network exchanges, the entire application runtime executes inside the client web browser. When the user opens the application URL, the static files (index.html, style.css, script.js) are delivered via HTTPS from GitHub Pages. Once loaded, all business logic and storage operations execute locally.', { align: 'both', size: 12, line: 270, after: 80 });

p12 += img('rId10', 4400000, 2440000, 'Figure 3.1: Architecture of the Electricity Bill Calculator');

p12 += p('As illustrated in Figure 3.1, the client browser environment is divided into three coordinated subsystems:', { align: 'both', size: 12, line: 270, after: 40 });
p12 += bullet('Presentation Subsystem (HTML5 & CSS3): Renders the navigation header, hero banner, tariff slab cards, meter reading input form, calculation result card, and saved history tables.');
p12 += bullet('Business Logic Engine (JavaScript): Manages DOM events, sanitizes inputs, enforces validation rules, evaluates energy consumption, and executes progressive slab arithmetic.');
p12 += bullet('Data Persistence Subsystem (LocalStorage): Interacts with the Web Storage API to serialize and persist calculation history records under the key "eb_calc_history".');

pages.push(p12);

// =========================================================================
// PAGE 13: CHAPTER 3 - SYSTEM DESIGN (PART 2: MODULES & DATA DESIGN)
// =========================================================================
let p13 = '';
p13 += h2('3.2 Page Structure and Modules');
p13 += p('The portal is structured into functional modules accessible via sticky navigation. Table 3.1 summarizes these modules.', { align: 'both', size: 12, line: 260, after: 60 });

const modRowsCompact = [
    ['Header & Navigation', 'Sticky navigation bar featuring brand emblem, title, and smooth-scrolling section links.'],
    ['Hero Banner', 'Prominent introductory section communicating the application purpose and action buttons.'],
    ['Tariff Slabs Display', 'Interactive grid of four cards displaying marginal rates and consumption ranges.'],
    ['Meter Input Form', 'Input interface capturing consumer name, ID, connection type, address, and readings.'],
    ['Calculation Engine', 'JavaScript algorithms validating readings, computing units, and calculating slab charges.'],
    ['Bill Summary Invoice', 'Dynamic result card displaying consumer profile, units consumed, and slab breakdown.'],
    ['Calculation History', 'LocalStorage management module displaying past records and deletion controls.'],
    ['Print Invoice Formatter', 'Print-optimized CSS module generating clean paper invoice receipts.']
];
p13 += table(['Module Name', 'Functional Scope and Operational Purpose'], modRowsCompact, [2600, 6200], true);

p13 += h2('3.3 Consumer and Billing Data Design');
p13 += p('Each bill calculation is modeled as a standardized JSON data entity stored in LocalStorage. Attributes include: id (unique timestamp ID), date (formatted timestamp), consumerName, consumerNumber, connectionType, consumerAddress, previousReading, currentReading, unitsConsumed, breakdown (itemized slab array), totalEnergyCharges, fixedCharges, and grandTotal.', { align: 'both', size: 12, line: 260, after: 60 });

p13 += h2('3.4 Progressive Tariff Slabs Specification');
const tariffRowsCompact = [
    ['Slab 1', '0 – 100 Units', '100 Units', '₹1.50 / unit', 'Subsidized baseline consumption tier for lighting and fans.'],
    ['Slab 2', '101 – 200 Units', '100 Units', '₹2.50 / unit', 'Moderate tier covering basic household electrical appliances.'],
    ['Slab 3', '201 – 300 Units', '100 Units', '₹4.00 / unit', 'Higher tier covering air conditioning and water heaters.'],
    ['Slab 4', 'Above 300 Units', 'Unlimited', '₹6.00 / unit', 'Maximum marginal rate tier discouraging wasteful consumption.']
];
p13 += table(['Slab Tier', 'Range', 'Capacity', 'Rate', 'Intended Profile'], tariffRowsCompact, [1200, 1800, 1300, 1500, 3000], true);

pages.push(p13);

// =========================================================================
// PAGE 14: CHAPTER 3 - SYSTEM DESIGN (PART 3: USE CASE DIAGRAM)
// =========================================================================
let p14 = '';
p14 += h2('3.5 Use Case Diagram and Analysis');
p14 += p('The Use Case Diagram depicts the functional interactions between the Electricity Consumer and the web application.', { align: 'both', size: 12, line: 260, after: 60 });

p14 += img('rId11', 4300000, 2795000, 'Figure 3.2: Use Case Diagram of the Electricity Bill Calculator');

p14 += p('Table 3.4 details the actors, pre-conditions, and system responses for each identified use case.', { align: 'both', size: 12, line: 260, after: 60 });

const ucRowsCompact = [
    ['UC-01', 'View Tariff Rates', 'Consumer', 'Displays visual cards showing illustrative slab rates.'],
    ['UC-02', 'Enter Meter Readings', 'Consumer', 'Inputs customer identity and previous/current readings.'],
    ['UC-03', 'Validate Readings', 'System', 'Validates non-empty fields and verifies current >= previous.'],
    ['UC-04', 'Calculate Bill', 'System', 'Computes units and executes progressive tiered algorithm.'],
    ['UC-05', 'View Summary', 'Consumer', 'Displays invoice card showing units, slab breakdown, and total.'],
    ['UC-06', 'Save to LocalStorage', 'Consumer', 'Serializes record into browser LocalStorage JSON store.'],
    ['UC-07', 'Manage History', 'Consumer', 'Reviews stored calculation table, deletes records, or clears all.'],
    ['UC-08', 'Print Bill Invoice', 'Consumer', 'Applies @media print CSS and invokes native print dialog.']
];
p14 += table(['Use Case ID', 'Use Case Name', 'Actor', 'System Response'], ucRowsCompact, [1400, 2400, 1400, 3600], true);

pages.push(p14);

// =========================================================================
// PAGE 15: CHAPTER 3 - SYSTEM DESIGN (PART 4: DATA FLOW DIAGRAMS)
// =========================================================================
let p15 = '';
p15 += h2('3.6 Data Flow Diagrams');
p15 += p('Data Flow Diagrams (DFDs) trace the flow of information through the application, identifying external entities, computational processes, data stores, and interconnecting data streams.', { align: 'both', size: 12, line: 260, after: 40 });

p15 += h3('3.6.1 Data Flow Diagram – Level 0 (Context Level)');
p15 += img('rId12', 3800000, 1710000, 'Figure 3.3: Data Flow Diagram – Level 0 (Context Level)');
p15 += p('As depicted in Figure 3.3, the Consumer provides readings to the system process, which returns bill summaries and error alerts while storing past records in LocalStorage (D1).', { align: 'both', size: 11, line: 240, after: 40 });

p15 += h3('3.6.2 Data Flow Diagram – Level 1 (Functional Decomposition)');
p15 += img('rId13', 4200000, 2613000, 'Figure 3.4: Data Flow Diagram – Level 1 (Functional Decomposition)');
p15 += p('In Figure 3.4, Process 1.0 validates readings, Process 2.0 queries tariff rates (D1) to calculate charges, Process 3.0 renders the invoice, and Process 4.0 manages LocalStorage history (D2).', { align: 'both', size: 11, line: 240, after: 40 });

pages.push(p15);

// =========================================================================
// PAGE 16: CHAPTER 3 - SYSTEM DESIGN (PART 5: WORKFLOW & SEQUENCE)
// =========================================================================
let p16 = '';
p16 += h2('3.7 Overall System Workflow & Sequence Diagram');
p16 += p('Figure 3.5 illustrates the sequential execution flowchart, while Figure 3.6 depicts the chronological sequence of messages between the Consumer, Web UI, Calculation Engine, and LocalStorage.', { align: 'both', size: 12, line: 260, after: 40 });

p16 += img('rId14', 2900000, 2690000, 'Figure 3.5: Bill Calculation Workflow Flowchart');
p16 += img('rId15', 4000000, 2260000, 'Figure 3.6: Sequence Diagram for Bill Calculation and History Storage');

p16 += p('3.8 Hosting & Deployment: The site is deployed as a lightweight static repository on GitHub Pages over HTTPS, delivering fast, zero-maintenance global availability.', { align: 'both', size: 11, line: 240, after: 40 });

pages.push(p16);

// =========================================================================
// PAGE 17: CHAPTER 4 - IMPLEMENTATION (PART 1: OVERVIEW & FRONTEND)
// =========================================================================
let p17 = '';
p17 += h1('CHAPTER 4\nIMPLEMENTATION');
p17 += pEmpty(60);

p17 += h2('4.1 Introduction to Implementation');
p17 += p('System implementation translates architectural designs into production-ready source code. The Electricity Bill Calculator is developed using standards-compliant HTML5, CSS3, and vanilla JavaScript (ES6), ensuring high performance, zero external framework overhead, and universal browser compatibility.', { align: 'both', size: 12, line: 270, after: 80 });

p17 += h2('4.2 Frontend Structure Implementation (HTML5)');
p17 += p('The application structure in index.html is organized into semantic elements: <header> contains branding and sticky navigation; <section id="home"> houses the hero title and call-to-action buttons; <section id="tariffs"> displays four slab cards; <section id="calculator"> houses the two-column input form and dynamic invoice card; <section id="history"> contains the LocalStorage history table; <section id="about"> presents project and team credentials; and <footer> provides copyright attribution.', { align: 'both', size: 12, line: 270, after: 80 });

p17 += h2('4.3 Styling and Responsive Layout Implementation (CSS3)');
p17 += p('Visual presentation in style.css utilizes modern CSS techniques: centralized CSS Custom Properties (:root) define color tokens; CSS Grid and Flexbox establish responsive layouts that transition from a two-column desktop grid to a single-column mobile view below 900px; card shadows and smooth hover transitions enhance interactivity; and dedicated @media print rules format clean, ink-friendly paper invoice receipts.', { align: 'both', size: 12, line: 270, after: 80 });

p17 += h2('4.4 Client-Side Interactivity and Behavioral Logic (JavaScript)');
p17 += p('Behavioral logic in script.js manages DOM events, input sanitization, calculation algorithms, dynamic table rendering, and LocalStorage CRUD operations. All computations run in the client browser with zero server round-trip latency.', { align: 'both', size: 12, line: 270, after: 80 });

p17 += h2('4.5 Functional Modules Breakdown');
p17 += p('The codebase comprises 8 functional modules: Navigation, Customer Details, Meter Reading Input, Unit Calculation, Progressive Slab Engine, Bill Summary Generation, LocalStorage History Manager, and Browser Print Integration.', { align: 'both', size: 12, line: 270, after: 60 });

pages.push(p17);

// =========================================================================
// PAGE 18: CHAPTER 4 - IMPLEMENTATION (PART 2: FORMULAS & ALGORITHM)
// =========================================================================
let p18 = '';
p18 += h2('4.6 Mathematical Formulations and Progressive Slab Billing Algorithm');
p18 += p('The calculation engine relies on three mathematical formulas to compute tiered power bills:', { align: 'both', size: 12, line: 260, after: 40 });

p18 += p('Formula 1: Units Consumed (U) = Current Meter Reading (R_curr) - Previous Meter Reading (R_prev)', { align: 'center', bold: true, size: 12, color: '002060', before: 30, after: 30 });
p18 += p('Formula 2: Slab Charge_i = Units in Slab_i × Rate_i (where Units in Slab_i = MIN(Remaining Units, Capacity_i))', { align: 'center', bold: true, size: 12, color: '002060', before: 30, after: 30 });
p18 += p('Formula 3: Total Estimated Bill = Sum of Applicable Slab Charges (∑ Slab Charge_i) + Fixed Charges', { align: 'center', bold: true, size: 12, color: '002060', before: 30, after: 60 });

p18 += img('rId18', 4300000, 2260000, 'Figure 4.1: Pseudo-code of the Progressive Slab Calculation Algorithm');

p18 += h3('4.6.1 Numerical Calculation Demonstrations');
p18 += p('• Example 1 (Benchmark: 250 Units): Prev = 1200, Curr = 1450. Units = 250. Slab 1 (100 u @ ₹1.50) = ₹150.00; Slab 2 (100 u @ ₹2.50) = ₹250.00; Slab 3 (50 u @ ₹4.00) = ₹200.00; Slab 4 = ₹0.00. Total Bill = ₹600.00.', { align: 'both', size: 11, line: 230, after: 30 });
p18 += p('• Example 2 (Baseline: 80 Units): Prev = 500, Curr = 580. Units = 80. Slab 1 (80 u @ ₹1.50) = ₹120.00; Slabs 2-4 = ₹0.00. Total Bill = ₹120.00.', { align: 'both', size: 11, line: 230, after: 30 });
p18 += p('• Example 3 (High Consumption: 450 Units): Prev = 2100, Curr = 2550. Units = 450. S1 (100u@₹1.50)=₹150; S2 (100u@₹2.50)=₹250; S3 (100u@₹4.00)=₹400; S4 (150u@₹6.00)=₹900. Total Bill = ₹1,700.00.', { align: 'both', size: 11, line: 230, after: 30 });

pages.push(p18);

// =========================================================================
// PAGE 19: CHAPTER 4 - IMPLEMENTATION (PART 3: VALIDATION, STORAGE, SECURITY)
// =========================================================================
let p19 = '';
p19 += h2('4.7 Input Validation and Boundary Handling');
p19 += p('To guarantee computational integrity and eliminate application runtime crashes, validateAndCalculate() performs comprehensive input validation before processing calculations:', { align: 'both', size: 12, line: 270, after: 60 });

p19 += bullet('Required Field Checking: Verifies that consumer name, ID, and meter readings are not blank or whitespace.');
p19 += bullet('Numeric Type Validation: Uses isNaN() and numeric step filters to ensure meter readings contain valid numbers.');
p19 += bullet('Non-Negativity Constraint: Rejects any negative meter readings, displaying an inline warning.');
p19 += bullet('Logical Sequence Enforcement: Enforces the mandatory business rule Current Reading >= Previous Reading. If a user inputs a current reading lower than the previous reading, calculation terminates and a red error is shown.');

p19 += h2('4.8 Browser LocalStorage Persistence Implementation');
p19 += p('Client-side calculation history is persisted across browser sessions utilizing the HTML5 Web Storage API (localStorage):', { align: 'both', size: 12, line: 270, after: 60 });

p19 += bullet('Storage Key: "eb_calc_history".');
p19 += bullet('Serialization: JSON.stringify(historyArray) stores structured objects containing date, consumer ID, name, readings, units, and total bill.');
p19 += bullet('Retrieval: JSON.parse(localStorage.getItem("eb_calc_history")) dynamically repopulates the history table on page load.');
p19 += bullet('Record Deletion: deleteHistoryRecord(id) filters out selected records by unique timestamp ID and updates the store.');
p19 += bullet('History Clearing: localStorage.removeItem("eb_calc_history") wipes stored records upon user confirmation.');

p19 += h2('4.9 Security and Validation Considerations');
p19 += p('• Cross-Site Scripting (XSS) Prevention: User-entered text attributes are safely injected into the DOM via textContent rather than innerHTML. • Client Sandbox Security: The application executes strictly within the browser JavaScript sandbox, posing zero vulnerability to remote server compromise. • Transport Security: When hosted on GitHub Pages, the site is delivered exclusively over secure HTTPS, preventing script tampering.', { align: 'both', size: 12, line: 270, after: 60 });

pages.push(p19);

// =========================================================================
// PAGE 20: CHAPTER 4 - IMPLEMENTATION (PART 4: SCREENSHOTS 4.2 & 4.3)
// =========================================================================
let p20 = '';
p20 += h2('4.10 Output Screen Captures – Home & Tariff Slabs');
p20 += p('Figures 4.2 and 4.3 present genuine visual captures of the running Electricity Bill Calculator web application.', { align: 'both', size: 12, line: 260, after: 40 });

p20 += img('rId19', 4600000, 2180000, 'Figure 4.2: Output Screen – Home Page and Hero Banner View');
p20 += p('Figure 4.2 shows the landing interface with the PowerCalc branding, navigation bar, academic badge, and call-to-action buttons.', { align: 'both', size: 11, line: 230, after: 40 });

p20 += img('rId20', 4600000, 1550000, 'Figure 4.3: Output Screen – Illustrative Progressive Tariff Slabs Display');
p20 += p('Figure 4.3 displays the four illustrative progressive tariff cards detailing slab unit ranges, marginal rates, and billing terms.', { align: 'both', size: 11, line: 230, after: 40 });

pages.push(p20);

// =========================================================================
// PAGE 21: CHAPTER 4 - IMPLEMENTATION (PART 5: SCREENSHOTS 4.4 & 4.5)
// =========================================================================
let p21 = '';
p21 += h2('4.11 Output Screen Captures – Input Form & Bill Summary');
p21 += p('Figures 4.4 and 4.5 illustrate the consumer input form and the generated progressive bill summary invoice.', { align: 'both', size: 12, line: 260, after: 40 });

p21 += img('rId21', 4200000, 2520000, 'Figure 4.4: Output Screen – Consumer Details and Meter Reading Input Form');
p21 += p('Figure 4.4 illustrates the input form capturing consumer profile details, connection type, and meter readings (Previous: 1200, Current: 1450).', { align: 'both', size: 11, line: 230, after: 40 });

p21 += img('rId22', 4300000, 2980000, 'Figure 4.5: Output Screen – Electricity Bill Result and Slab Breakdown Table');
p21 += p('Figure 4.5 demonstrates the generated progressive bill invoice showing 250 units consumed, slab-by-slab charges (S1: ₹150, S2: ₹250, S3: ₹200), and net bill of ₹600.00.', { align: 'both', size: 11, line: 230, after: 40 });

pages.push(p21);

// =========================================================================
// PAGE 22: CHAPTER 4 - IMPLEMENTATION (PART 6: SCREENSHOTS 4.6, 4.7, 4.8)
// =========================================================================
let p22 = '';
p22 += h2('4.12 Output Screen Captures – History, Print, & Validation');
p22 += p('Figures 4.6, 4.7, and 4.8 display the LocalStorage history manager, printable invoice view, and input validation error handling.', { align: 'both', size: 12, line: 250, after: 30 });

p22 += img('rId23', 4400000, 1650000, 'Figure 4.6: Output Screen – Saved Calculation History (LocalStorage Records)');
p22 += p('Figure 4.6 displays the saved calculations stored in browser LocalStorage with timestamps, readings, units, total amounts, and delete controls.', { align: 'both', size: 10, line: 220, after: 20 });

p22 += img('rId24', 3600000, 2520000, 'Figure 4.7: Output Screen – Print-Optimized Invoice View');
p22 += p('Figure 4.7 illustrates the clean receipt-style invoice generated by invoking browser printing via the custom print stylesheet.', { align: 'both', size: 10, line: 220, after: 20 });

p22 += img('rId25', 4200000, 1680000, 'Figure 4.8: Output Screen – Input Validation and Boundary Error Handling');
p22 += p('Figure 4.8 illustrates the inline validation error displayed when current reading (1200) is entered as less than previous reading (1500).', { align: 'both', size: 10, line: 220, after: 20 });

pages.push(p22);

// =========================================================================
// PAGE 23: CHAPTER 5 - TESTING AND RESULTS (PART 1: OVERVIEW & ENV)
// =========================================================================
let p23 = '';
p23 += h1('CHAPTER 5\nTESTING AND RESULTS');
p23 += pEmpty(60);

p23 += h2('5.1 Introduction to Software Testing');
p23 += p('Software testing is an essential verification and validation discipline in software engineering conducted to assess the functional correctness, mathematical accuracy, input robustness, interface usability, and cross-browser reliability of the Electricity Bill Calculator application. Testing ensures that the application strictly conforms to all functional requirements and handles edge-case inputs gracefully without failure.', { align: 'both', size: 12, line: 270, after: 80 });

p23 += h2('5.2 Testing Objectives');
p23 += bullet('Verifying that energy consumption in units is calculated accurately across all valid numerical input ranges.');
p23 += bullet('Validating that progressive slab rate calculations conform precisely to the four-tier tariff specifications without calculation drift.');
p23 += bullet('Ensuring that the validation engine traps invalid data types, blank submissions, negative inputs, and illogical meter reading decrements.');
p23 += bullet('Confirming that calculation records persist reliably in browser LocalStorage across page reloads and browser restarts.');
p23 += bullet('Validating user interface responsiveness, typography scaling, and print stylesheet formatting across multiple devices and browsers.');

p23 += h2('5.3 Types of Testing');
p23 += p('The testing process incorporated five structured testing levels: Unit Testing (evaluating calculateSlabCharges, getStoredHistory in isolation), Functional Testing (end-to-end form calculation and invoice printing), Integration Testing (HTML form to JavaScript calculation and LocalStorage persistence), User Interface Testing (layout consistency and responsive reflow), and Cross-Browser Compatibility Testing (Chrome, Firefox, Edge).', { align: 'both', size: 12, line: 270, after: 80 });

p23 += h2('5.4 Test Environment');
const testEnvCompact = [
    ['Operating System', 'Microsoft Windows 11 Home / Ubuntu Linux 22.04 LTS'],
    ['Test Web Browsers', 'Google Chrome (v124), Microsoft Edge (v124), Mozilla Firefox (v125)'],
    ['Mobile Platforms', 'Android 14 (Chrome Mobile), iOS 17 (Safari Mobile)'],
    ['Hardware Specs', 'Intel Core i3 / AMD Ryzen 5, 8 GB RAM, 1920 × 1080 Display'],
    ['Testing Tools', 'Chrome DevTools, Console Logger, LocalStorage Inspector'],
    ['Build Under Test', 'Electricity Bill Calculator (v1.0.0 Static Release)']
];
p23 += table(['Environment Parameter', 'Configuration Details'], testEnvCompact, [2800, 6000], true);

pages.push(p23);

// =========================================================================
// PAGE 24: CHAPTER 5 - TESTING AND RESULTS (PART 2: FUNCTIONAL TEST CASES)
// =========================================================================
let p24 = '';
p24 += h2('5.5 Functional Test Cases and Execution Results');
p24 += p('Table 5.2 documents the execution of ten comprehensive functional test cases covering normal, boundary, and negative scenarios.', { align: 'both', size: 12, line: 250, after: 50 });

const funcRowsCompact = [
    ['TC-F01', 'Valid Readings', 'Prev: 1200, Curr: 1450', '250 units, S1-S3 breakdown, ₹600.00 bill.', 'Units: 250, Bill: ₹600.00.', 'Passed'],
    ['TC-F02', 'Zero Consumption', 'Prev: 1000, Curr: 1000', '0 units consumed, all slabs ₹0.00, bill ₹0.00.', 'Units: 0, Bill: ₹0.00.', 'Passed'],
    ['TC-F03', 'Equal Readings', 'Prev: 850, Curr: 850', '0 units consumed, zero-charge invoice generated.', 'Zero units, bill ₹0.00.', 'Passed'],
    ['TC-F04', 'Current < Previous', 'Prev: 1500, Curr: 1200', 'Blocked; alert: Current reading < previous.', 'Inline error shown; blocked.', 'Passed'],
    ['TC-F05', 'Empty Fields', 'Name: "", Prev: "", Curr: ""', 'Blocked; highlights required fields.', 'Inline error on empty fields.', 'Passed'],
    ['TC-F06', 'Negative Input', 'Prev: -100, Curr: 250', 'Blocked; displays non-negative alert.', 'Alert: Non-negative required.', 'Passed'],
    ['TC-F07', 'Slab 1 Consumption', 'Prev: 500, Curr: 580', '80 units @ ₹1.50 = ₹120.00; Slabs 2-4 ₹0.00.', 'Units: 80, Bill: ₹120.00.', 'Passed'],
    ['TC-F08', 'Crossing All Slabs', 'Prev: 2100, Curr: 2550', '450 units across S1-S4 = ₹1,700.00.', 'Units: 450, Bill: ₹1,700.00.', 'Passed'],
    ['TC-F09', 'Save LocalStorage', 'Click "Save to History"', 'Record serialized into LocalStorage array.', 'Record stored; count +1.', 'Passed'],
    ['TC-F10', 'Print Bill Trigger', 'Click "Print Bill"', 'Applies @media print; invokes print dialog.', 'Print preview opened.', 'Passed']
];
p24 += table(['ID', 'Test Scenario', 'Input Data', 'Expected Output', 'Actual Output', 'Status'], funcRowsCompact, [900, 1600, 1600, 2000, 1800, 900], true);

p24 += p('All ten functional test scenarios executed with 100% adherence to expected calculation and validation rules.', { align: 'both', size: 11, line: 240, after: 40 });

pages.push(p24);

// =========================================================================
// PAGE 25: CHAPTER 5 - TESTING AND RESULTS (PART 3: UI & VALIDATION TESTS)
// =========================================================================
let p25 = '';
p25 += h2('5.6 Interface, Compatibility, and Validation Test Cases');
p25 += p('Table 5.3 summarizes interface and cross-browser compatibility tests, while Table 5.4 documents boundary validation tests.', { align: 'both', size: 12, line: 250, after: 40 });

const uiRowsCompact = [
    ['TC-U01', 'Desktop 1080p Layout', '1920 × 1080 Viewport', 'Two-column layout rendered neatly side by side.', 'Passed'],
    ['TC-U02', 'Mobile Reflow Layout', '375 × 667 Viewport', 'Layout reflows to single vertical stack without overflow.', 'Passed'],
    ['TC-U03', 'Google Chrome Compatibility', 'Chrome v124 (Win 11)', 'Flawless DOM rendering, calculation, and LocalStorage.', 'Passed'],
    ['TC-U04', 'Microsoft Edge Compatibility', 'Edge v124 (Win 11)', 'Consistent UI layout, calculation, and invoice printing.', 'Passed'],
    ['TC-U05', 'Mozilla Firefox Compatibility', 'Firefox v125 (Linux)', 'Full CSS Grid, Flexbox, and JS standard compliance.', 'Passed']
];
p25 += table(['ID', 'Scenario', 'Platform / Viewport', 'Observed Outcome', 'Status'], uiRowsCompact, [1000, 2200, 2000, 2700, 900], true);

const valRowsCompact = [
    ['TC-V01', 'Non-Numeric String Input', 'Prev: "abc", Curr: "xyz"', 'Field rejects characters; displays numeric warning.', 'Passed'],
    ['TC-V02', 'Exact Slab 1 Boundary (100 u)', 'Prev: 1000, Curr: 1100', 'Exactly 100 units billed in S1 (100 × 1.50 = ₹150.00).', 'Passed'],
    ['TC-V03', 'Exact Slab 2 Boundary (200 u)', 'Prev: 1000, Curr: 1200', '100u in S1 (₹150) + 100u in S2 (₹250) = ₹400.00.', 'Passed'],
    ['TC-V04', 'Delete Single History Record', 'Click "Delete" on row', 'Specified item removed from LocalStorage; table refreshes.', 'Passed'],
    ['TC-V05', 'Clear Entire History', 'Click "Clear All History"', 'Wipes storage array; displays empty-state message.', 'Passed']
];
p25 += table(['ID', 'Scenario', 'Input / Boundary', 'Observed Outcome', 'Status'], valRowsCompact, [1000, 2200, 2000, 2700, 900], true);

pages.push(p25);

// =========================================================================
// PAGE 26: CHAPTER 5 - TESTING AND RESULTS (PART 4: CODE SCREENSHOTS & SUMMARY)
// =========================================================================
let p26 = '';
p26 += h2('5.7 Source Code Verification & Testing Summary');
p26 += p('Figures 4.9 and 4.10 depict verified source code segments in Visual Studio Code implementing the HTML structure and JavaScript calculation engine.', { align: 'both', size: 12, line: 260, after: 40 });

p26 += img('rId26', 4400000, 2310000, 'Figure 4.9: Coding Screenshot – HTML Structure (index.html)');
p26 += img('rId27', 4400000, 2310000, 'Figure 4.10: Coding Screenshot – JavaScript Logic (script.js)');

p26 += p('5.8 Summary: All 20 test cases executed successfully with a 100% pass rate. The application demonstrated robust mathematical precision, consistent validation trapping, reliable client persistence, and dependable cross-browser rendering.', { align: 'both', size: 11, line: 240, after: 40 });

pages.push(p26);

// =========================================================================
// PAGE 27: CHAPTER 6 - RESULT AND CONCLUSION (PART 1)
// =========================================================================
let p27 = '';
p27 += h1('CHAPTER 6\nRESULT AND CONCLUSION');
p27 += pEmpty(60);

p27 += h2('6.1 Results Achieved');
p27 += p('The Electricity Bill Calculator mini-project was successfully designed, developed, mathematically verified, and deployed. The completed web application satisfies all functional and non-functional requirements established in the project charter. Specific accomplishments include:', { align: 'both', size: 12, line: 270, after: 80 });

p27 += bullet('A modern, intuitive single-page web interface presenting project overview, tariff slabs, meter reading inputs, itemized invoices, and calculation history.');
p27 += bullet('An automated mathematical engine that computes energy consumption in kilowatt-hours and calculates progressive slab tariffs with zero arithmetic error.');
p27 += bullet('A transparent bill breakdown summary itemizing consumption units, marginal rates, and subtotal amounts for every individual tariff tier.');
p27 += bullet('A robust client-side storage module using browser LocalStorage to record and manage past utility estimates locally without server overhead.');
p27 += bullet('A customized print layout enabling one-click generation of professional paper invoice receipts directly from the web browser.');

p27 += h2('6.2 Key Advantages of the System');
p27 += p('The developed system offers substantial practical benefits over traditional manual billing practices:', { align: 'both', size: 12, line: 270, after: 80 });

p27 += bullet('Speed and Convenience: Generates complete bill estimates in milliseconds directly upon entering meter readings.');
p27 += bullet('Zero Setup Cost: Built using pure client-side web technologies, requiring no database licenses, server hosting fees, or software installations.');
p27 += bullet('Universal Accessibility: Runs seamlessly across Windows, Linux, macOS, Android, and iOS devices equipped with modern web browsers.');
p27 += bullet('Educational Transparency: Clarifies the progressive slab system for citizens, demystifying how power utilities structure marginal tariff rates.');

pages.push(p27);

// =========================================================================
// PAGE 28: CHAPTER 6 - RESULT AND CONCLUSION (PART 2)
// =========================================================================
let p28 = '';
p28 += h2('6.3 System Limitations');
p28 += p('While highly effective as an academic mini-project, the current version has certain recognized limitations:', { align: 'both', size: 12, line: 270, after: 60 });

p28 += bullet('Client-Bound Storage: LocalStorage is confined to the specific browser and workstation on which the calculation is performed; records do not sync across different devices.');
p28 += bullet('Absence of Centralized User Accounts: The system does not feature consumer authentication, login credentials, or centralized administrative role control.');
p28 += bullet('Static Tariff Configuration: Tariff slab parameters are configured within the client JavaScript source file rather than being dynamically pulled from a live cloud database.');
p28 += bullet('No Direct Utility Board API Integration: The system computes estimates based on user-entered meter numbers rather than pulling live meter telemetry from smart grid APIs.');

p28 += h2('6.4 Future Enhancements');
p28 += p('The architecture of the Electricity Bill Calculator is intentionally designed to support modular expansion. Potential future enhancements include:', { align: 'both', size: 12, line: 270, after: 60 });

p28 += bullet('Backend Integration: Implementing a Node.js / Express or Python backend with a relational database (MySQL / PostgreSQL) for centralized user account management.');
p28 += bullet('Live Smart Meter IoT Integration: Connecting with IoT-enabled smart energy meters (ESP32 / LoRaWAN) to capture real-time energy telemetry automatically.');
p28 += bullet('Dynamic Tariff Management Dashboard: Developing an administrative portal enabling utility administrators to update slab rates, fuel surcharges, and tax rates dynamically.');
p28 += bullet('Solar Net-Metering & Bi-Directional Billing: Supporting solar rooftop consumers by calculating net export/import energy units.');
p28 += bullet('Online Payment Gateway Integration: Integrating payment gateways (Razorpay / UPI) to enable immediate online bill settlement.');
p28 += bullet('Automated SMS & Email Alerts: Dispatching periodic consumption summaries and bill forecast notifications via automated messaging services.');

p28 += h2('6.5 Conclusion');
p28 += p('In conclusion, the "Electricity Bill Calculator" mini-project successfully demonstrates how foundational web engineering technologies—HTML5, CSS3, JavaScript, and the browser Web Storage API—can be synergistically combined to engineer an accessible, reliable, and user-centric utility computation tool. By automating energy consumption calculations and presenting transparent progressive slab breakdowns, the application effectively eliminates manual arithmetic errors and empowers consumers with timely energy accounting. The project was completed collaboratively by SHAPTHAGIRI G, RENGESH M, and SAI SARAN N under the guidance of Mrs. C. Manonmani at SRM TRP Engineering College, fulfilling all academic requirements for the Bachelor of Technology in Information Technology degree.', { align: 'both', size: 12, line: 270, after: 60 });

pages.push(p28);

// =========================================================================
// PAGE 29: REFERENCES (PART 1)
// =========================================================================
let p29 = '';
p29 += h1('REFERENCES');
p29 += pEmpty(60);

p29 += p('The following authentic technical standards, official documentations, and specifications served as authoritative references during the design, development, and testing of the Electricity Bill Calculator application:', { align: 'both', size: 12, line: 270, after: 80 });

const refsPage29 = [
    'MDN Web Docs – HTML: HyperText Markup Language Documentation. Mozilla Developer Network. Comprehensive guide on semantic HTML5 elements, web forms, and client validation APIs. Available at: https://developer.mozilla.org/en-US/docs/Web/HTML',
    'MDN Web Docs – CSS: Cascading Style Sheets Reference and Layouts. Mozilla Developer Network. Detailed documentation on CSS Flexbox, CSS Grid layouts, and responsive media queries. Available at: https://developer.mozilla.org/en-US/docs/Web/CSS',
    'MDN Web Docs – JavaScript: Modern ECMAScript (ES6+) Language Specification and Guide. Mozilla Developer Network. Comprehensive documentation on DOM manipulation, functions, and client-side logic. Available at: https://developer.mozilla.org/en-US/docs/Web/JavaScript',
    'MDN Web Docs – Web Storage API: Window.localStorage and Client Data Persistence. Mozilla Developer Network. Technical specification on key-value string storage and JSON serialization in web applications. Available at: https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API',
    'MDN Web Docs – CSS Paged Media and Print Stylesheets (@media print). Mozilla Developer Network. Guidelines for creating ink-efficient, print-optimized web layouts and invoices. Available at: https://developer.mozilla.org/en-US/docs/Web/CSS/Paged_media',
    'W3C HTML5 Recommendation: World Wide Web Consortium Standard for Semantic Web Markup. W3C Recommendation. Specifies semantic container tagging, accessibility, and form validation attributes. Available at: https://www.w3.org/TR/html52/'
];

refsPage29.forEach(r => {
    p29 += bullet(r);
});

pages.push(p29);

// =========================================================================
// PAGE 30: REFERENCES (PART 2) & DECLARATION
// =========================================================================
let p30 = '';
p30 += h2('Additional Technical References');
p30 += pEmpty(40);

const refsPage30 = [
    'W3C CSS Grid Layout Module Level 1: W3C Recommendation for Multidimensional Web Grid Layouts. World Wide Web Consortium. Available at: https://www.w3.org/TR/css-grid-1/',
    'W3C Web Content Accessibility Guidelines (WCAG) 2.1: Best Practices for Accessible User Interface Design and High-Contrast Typography. World Wide Web Consortium. Available at: https://www.w3.org/TR/WCAG21/',
    'ECMA-262: ECMAScript 2020 Language Specification. Ecma International. Standards specification for JavaScript syntax, arrays, JSON parsing, and calculation safety. Available at: https://www.ecma-international.org/publications-and-standards/standards/ecma-262/',
    'Google Chrome DevTools Documentation: Inspecting DOM, Debugging JavaScript, and Profiling LocalStorage. Google Developers. Available at: https://developer.chrome.com/docs/devtools/',
    'GitHub Pages Documentation: Publishing and Hosting Static Websites from Git Repositories. GitHub Inc. Available at: https://docs.github.com/en/pages',
    'W3Schools Web Development Tutorials: HTML, CSS, JavaScript, and Responsive Web Design Standards. Available at: https://www.w3schools.com/'
];

refsPage30.forEach(r => {
    p30 += bullet(r);
});

p30 += pEmpty(100);
p30 += h2('Academic Integrity & Joint Authorship Declaration');
p30 += p('We hereby declare that this mini-project report titled “ELECTRICITY BILL CALCULATOR” is a bona fide record of original academic work jointly undertaken by us under the faculty supervision of Mrs. C. Manonmani, Department of Artificial Intelligence & Data Science, SRM TRP Engineering College, Tiruchirappalli. The application has been developed and verified in accordance with prescribed curriculum standards for Bachelor of Technology in Information Technology.', { align: 'both', size: 11, italic: true, line: 250, after: 120 });

const declSignTable = [
    [
        'SHAPTHAGIRI G\nReg. No: 814725205105\nB.Tech IT (II Year)',
        'RENGESH M\nReg. No: 814725205088\nB.Tech IT (II Year)',
        'SAI SARAN N\nReg. No: 814725205096\nB.Tech IT (II Year)'
    ]
];
p30 += table(['STUDENT 1', 'STUDENT 2', 'STUDENT 3'], declSignTable, [2900, 2900, 2900], true);

pages.push(p30);

// Verify page count
console.log(`Total Pages Planned: ${pages.length}`);
if (pages.length !== 30) {
    throw new Error(`Expected exactly 30 pages, but got ${pages.length}`);
}

// Join pages with explicit page breaks
let fullBodyXml = '';
for (let i = 0; i < pages.length; i++) {
    fullBodyXml += pages[i];
    if (i < pages.length - 1) {
        fullBodyXml += pb();
    }
}

// Wrap in full document XML with college section properties
const finalDocXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:document xmlns:wpc="http://schemas.microsoft.com/office/word/2010/wordprocessingCanvas" xmlns:cx="http://schemas.microsoft.com/office/drawing/2014/chartex" xmlns:cx1="http://schemas.microsoft.com/office/drawing/2015/9/8/chartex" xmlns:mc="http://schemas.openxmlformats.org/markup-compatibility/2006" xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" xmlns:m="http://schemas.openxmlformats.org/officeDocument/2006/math" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:wp14="http://schemas.microsoft.com/office/word/2010/wordprocessingDrawing" xmlns:wp="http://schemas.openxmlformats.org/drawingml/2006/wordprocessingDrawing" xmlns:w10="urn:schemas-microsoft-com:office:word" xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main" xmlns:w14="http://schemas.microsoft.com/office/word/2010/wordml" xmlns:w15="http://schemas.microsoft.com/office/word/2012/wordml" xmlns:w16se="http://schemas.microsoft.com/office/word/2015/wordml/symex" xmlns:wpg="http://schemas.microsoft.com/office/word/2010/wordprocessingGroup" xmlns:wpi="http://schemas.microsoft.com/office/word/2010/wordprocessingInk" xmlns:wne="http://schemas.microsoft.com/office/word/2006/wordml" xmlns:wps="http://schemas.microsoft.com/office/word/2010/wordprocessingShape" mc:Ignorable="w14 w15 w16se wp14">
  <w:body>
    ${fullBodyXml}
    <w:sectPr w:rsidR="00231C11">
      <w:headerReference w:type="default" r:id="rId8"/>
      <w:footerReference w:type="default" r:id="rId9"/>
      <w:pgSz w:w="11910" w:h="16840"/>
      <w:pgMar w:top="1340" w:right="1417" w:bottom="1200" w:left="1417" w:header="509" w:footer="963" w:gutter="0"/>
      <w:pgBorders w:offsetFrom="page">
        <w:top w:val="single" w:sz="4" w:space="24" w:color="000000"/>
        <w:left w:val="single" w:sz="4" w:space="24" w:color="000000"/>
        <w:bottom w:val="single" w:sz="4" w:space="24" w:color="000000"/>
        <w:right w:val="single" w:sz="4" w:space="24" w:color="000000"/>
      </w:pgBorders>
      <w:cols w:space="720"/>
    </w:sectPr>
  </w:body>
</w:document>`;

fs.writeFileSync(path.join(buildDir, 'word/document.xml'), finalDocXml, 'utf8');
console.log('report_30_build/word/document.xml successfully generated! Size:', finalDocXml.length);

// 6. Zip into final output docx
function createZip(sourceDir, outputFile) {
    const files = [];

    function walk(dir, relPath) {
        const items = fs.readdirSync(dir, { withFileTypes: true });
        for (let item of items) {
            const fullPath = path.join(dir, item.name);
            const entryPath = relPath ? (relPath + '/' + item.name) : item.name;
            if (item.isDirectory()) {
                walk(fullPath, entryPath);
            } else {
                files.push({ fullPath, entryPath });
            }
        }
    }

    walk(sourceDir, '');

    const localHeaders = [];
    const cdHeaders = [];
    let offset = 0;

    const crcTable = [];
    for (let n = 0; n < 256; n++) {
        let c = n;
        for (let k = 0; k < 8; k++) {
            c = (c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1);
        }
        crcTable[n] = c >>> 0;
    }

    function crc32(buf) {
        let c = 0xFFFFFFFF;
        for (let i = 0; i < buf.length; i++) {
            c = crcTable[(c ^ buf[i]) & 0xFF] ^ (c >>> 8);
        }
        return (c ^ 0xFFFFFFFF) >>> 0;
    }

    const outParts = [];

    for (let f of files) {
        const data = fs.readFileSync(f.fullPath);
        const crc = crc32(data);
        const uncompressedSize = data.length;
        const compressed = zlib.deflateRawSync(data, { level: 6 });
        const compressedSize = compressed.length;

        const nameBuf = Buffer.from(f.entryPath.replace(/\\/g, '/'), 'utf8');

        const lf = Buffer.alloc(30 + nameBuf.length);
        lf.writeUInt32LE(0x04034b50, 0);
        lf.writeUInt16LE(20, 4);
        lf.writeUInt16LE(0, 6);
        lf.writeUInt16LE(8, 8);
        lf.writeUInt16LE(0, 10);
        lf.writeUInt16LE(0, 12);
        lf.writeUInt32LE(crc, 14);
        lf.writeUInt32LE(compressedSize, 18);
        lf.writeUInt32LE(uncompressedSize, 22);
        lf.writeUInt16LE(nameBuf.length, 26);
        lf.writeUInt16LE(0, 28);
        nameBuf.copy(lf, 30);

        outParts.push(lf);
        outParts.push(compressed);

        const cd = Buffer.alloc(46 + nameBuf.length);
        cd.writeUInt32LE(0x02014b50, 0);
        cd.writeUInt16LE(20, 4);
        cd.writeUInt16LE(20, 6);
        cd.writeUInt16LE(0, 8);
        cd.writeUInt16LE(8, 10);
        cd.writeUInt16LE(0, 12);
        cd.writeUInt16LE(0, 14);
        cd.writeUInt32LE(crc, 16);
        cd.writeUInt32LE(compressedSize, 20);
        cd.writeUInt32LE(uncompressedSize, 24);
        cd.writeUInt16LE(nameBuf.length, 28);
        cd.writeUInt16LE(0, 30);
        cd.writeUInt16LE(0, 32);
        cd.writeUInt16LE(0, 34);
        cd.writeUInt16LE(0, 36);
        cd.writeUInt32LE(0, 38);
        cd.writeUInt32LE(offset, 42);
        nameBuf.copy(cd, 46);

        cdHeaders.push(cd);
        offset += lf.length + compressed.length;
    }

    const cdStart = offset;
    let cdSize = 0;
    for (let cd of cdHeaders) {
        outParts.push(cd);
        cdSize += cd.length;
    }

    const eocd = Buffer.alloc(22);
    eocd.writeUInt32LE(0x06054b50, 0);
    eocd.writeUInt16LE(0, 4);
    eocd.writeUInt16LE(0, 6);
    eocd.writeUInt16LE(files.length, 8);
    eocd.writeUInt16LE(files.length, 10);
    eocd.writeUInt32LE(cdSize, 12);
    eocd.writeUInt32LE(cdStart, 16);
    eocd.writeUInt16LE(0, 20);

    outParts.push(eocd);

    const fullZip = Buffer.concat(outParts);
    fs.writeFileSync(outputFile, fullZip);
    console.log(`Successfully generated final docx: ${outputFile} (${fullZip.length} bytes, ${files.length} entries)`);
}

createZip(buildDir, 'Electricity_Bill_Calculator_Final_Report_30_Pages.docx');
