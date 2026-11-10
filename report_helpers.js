/**
 * Build Script for Electricity Bill Calculator Mini Project Report
 * Generates the complete, academic Word document (document.xml)
 * following the exact SRM TRP Engineering College template structure.
 */

const fs = require('fs');
const path = require('path');

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
    const sa = opts.after !== undefined ? opts.after : 120;
    const line = opts.line !== undefined ? opts.line : 280;
    const indent = opts.indent ? `<w:ind w:left="${opts.indent}"/>` : '';
    
    let rPr = '<w:rFonts w:ascii="Times New Roman" w:hAnsi="Times New Roman"/>';
    if (opts.bold) rPr += '<w:b/>';
    if (opts.italic) rPr += '<w:i/>';
    if (opts.size) rPr += `<w:sz w:val="${opts.size * 2}"/>`;
    else rPr += '<w:sz w:val="24"/>'; // 12pt default
    if (opts.color) rPr += `<w:color w:val="${opts.color}"/>`;

    return `<w:p>
      <w:pPr>${jc}<w:spacing w:before="${sb}" w:after="${sa}" w:line="${line}" w:lineRule="auto"/>${indent}</w:pPr>
      <w:r><w:rPr>${rPr}</w:rPr><w:t xml:space="preserve">${escapeXml(text)}</w:t></w:r>
    </w:p>`;
}

function pEmpty(sa = 120) {
    return `<w:p><w:pPr><w:spacing w:after="${sa}"/></w:pPr></w:p>`;
}

function h1(title) {
    return `<w:p>
      <w:pPr><w:jc w:val="center"/><w:spacing w:before="240" w:after="160"/></w:pPr>
      <w:r><w:rPr><w:rFonts w:ascii="Times New Roman" w:hAnsi="Times New Roman"/><w:b/><w:sz w:val="32"/><w:color w:val="002060"/></w:rPr><w:t>${escapeXml(title)}</w:t></w:r>
    </w:p>`;
}

function h2(title) {
    return `<w:p>
      <w:pPr><w:jc w:val="left"/><w:spacing w:before="200" w:after="100"/></w:pPr>
      <w:r><w:rPr><w:rFonts w:ascii="Times New Roman" w:hAnsi="Times New Roman"/><w:b/><w:sz w:val="28"/><w:color w:val="002060"/></w:rPr><w:t>${escapeXml(title)}</w:t></w:r>
    </w:p>`;
}

function h3(title) {
    return `<w:p>
      <w:pPr><w:jc w:val="left"/><w:spacing w:before="140" w:after="80"/></w:pPr>
      <w:r><w:rPr><w:rFonts w:ascii="Times New Roman" w:hAnsi="Times New Roman"/><w:b/><w:sz w:val="24"/><w:color w:val="1E3A8A"/></w:rPr><w:t>${escapeXml(title)}</w:t></w:r>
    </w:p>`;
}

function bullet(text) {
    return `<w:p>
      <w:pPr><w:jc w:val="both"/><w:spacing w:before="40" w:after="60" w:line="260" w:lineRule="auto"/><w:ind w:left="400" w:hanging="240"/></w:pPr>
      <w:r><w:rPr><w:rFonts w:ascii="Times New Roman" w:hAnsi="Times New Roman"/><w:sz w:val="24"/></w:rPr><w:t xml:space="preserve">&#8226;  ${escapeXml(text)}</w:t></w:r>
    </w:p>`;
}

function pb() {
    return `<w:p><w:r><w:br w:type="page"/></w:r></w:p>`;
}

function img(rId, cx, cy, caption, figNum = '') {
    return `<w:p>
      <w:pPr><w:jc w:val="center"/><w:spacing w:before="140" w:after="80"/></w:pPr>
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
      <w:pPr><w:jc w:val="center"/><w:spacing w:before="40" w:after="160"/></w:pPr>
      <w:r><w:rPr><w:rFonts w:ascii="Times New Roman" w:hAnsi="Times New Roman"/><w:b/><w:i/><w:sz w:val="22"/><w:color w:val="002060"/></w:rPr><w:t>${escapeXml(caption)}</w:t></w:r>
    </w:p>`;
}

function table(headers, rows, colWidths = []) {
    let gridXml = '<w:tblGrid>';
    colWidths.forEach(w => {
        gridXml += `<w:gridCol w:w="${w}"/>`;
    });
    gridXml += '</w:tblGrid>';

    let headerXml = '<w:tr><w:trPr><w:tblHeader/></w:trPr>';
    headers.forEach((h, idx) => {
        const wXml = colWidths[idx] ? `<w:tcW w:w="${colWidths[idx]}" w:type="dxa"/>` : '';
        headerXml += `<w:tc>
          <w:tcPr>${wXml}<w:shd w:val="clear" w:color="auto" w:fill="002060"/><w:vAlign w:val="center"/></w:tcPr>
          <w:p><w:pPr><w:jc w:val="center"/><w:spacing w:before="60" w:after="60"/></w:pPr>
          <w:r><w:rPr><w:rFonts w:ascii="Times New Roman" w:hAnsi="Times New Roman"/><w:b/><w:sz w:val="22"/><w:color w:val="FFFFFF"/></w:rPr><w:t>${escapeXml(h)}</w:t></w:r></w:p>
        </w:tc>`;
    });
    headerXml += '</w:tr>';

    let rowsXml = '';
    rows.forEach((row, rIdx) => {
        const fill = (rIdx % 2 === 1) ? 'F1F5F9' : 'FFFFFF';
        rowsXml += '<w:tr>';
        row.forEach((cell, cIdx) => {
            const wXml = colWidths[cIdx] ? `<w:tcW w:w="${colWidths[cIdx]}" w:type="dxa"/>` : '';
            const align = (cIdx === 0 && row.length > 3) ? 'center' : (cIdx >= row.length - 2 && !isNaN(cell.replace(/[^0-9.]/g, '')) ? 'right' : 'left');
            rowsXml += `<w:tc>
              <w:tcPr>${wXml}<w:shd w:val="clear" w:color="auto" w:fill="${fill}"/><w:vAlign w:val="center"/></w:tcPr>
              <w:p><w:pPr><w:jc w:val="${align}"/><w:spacing w:before="60" w:after="60" w:line="240" w:lineRule="auto"/></w:pPr>
              <w:r><w:rPr><w:rFonts w:ascii="Times New Roman" w:hAnsi="Times New Roman"/><w:sz w:val="22"/></w:rPr><w:t xml:space="preserve">${escapeXml(cell)}</w:t></w:r></w:p>
            </w:tc>`;
        });
        rowsXml += '</w:tr>';
    });

    return `<w:tbl>
      <w:tblPr>
        <w:tblW w:w="5000" w:type="pct"/>
        <w:jc w:val="center"/>
        <w:tblBorders>
          <w:top w:val="single" w:sz="6" w:space="0" w:color="002060"/>
          <w:left w:val="single" w:sz="6" w:space="0" w:color="002060"/>
          <w:bottom w:val="single" w:sz="6" w:space="0" w:color="002060"/>
          <w:right w:val="single" w:sz="6" w:space="0" w:color="002060"/>
          <w:insideH w:val="single" w:sz="4" w:space="0" w:color="CBD5E1"/>
          <w:insideV w:val="single" w:sz="4" w:space="0" w:color="CBD5E1"/>
        </w:tblBorders>
        <w:tblCellMar>
          <w:top w:w="120" w:type="dxa"/>
          <w:bottom w:w="120" w:type="dxa"/>
          <w:left w:w="140" w:type="dxa"/>
          <w:right w:w="140" w:type="dxa"/>
        </w:tblCellMar>
      </w:tblPr>
      ${gridXml}
      ${headerXml}
      ${rowsXml}
    </w:tbl>
    <w:p><w:pPr><w:spacing w:after="140"/></w:pPr></w:p>`;
}

console.log('OpenXML helper functions loaded.');
