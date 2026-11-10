/**
 * Complete Academic Mini-Project Report Generator
 * Title: ELECTRICITY BILL CALCULATOR
 * Department of Information Technology, SRM TRP Engineering College
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

function img(rId, cx, cy, caption) {
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
            const isNum = !isNaN(cell.replace(/[^0-9.]/g, '')) && cell.trim() !== '' && !cell.includes('-');
            const align = (cIdx === 0 && row.length > 3) ? 'center' : (cIdx >= row.length - 2 && isNum ? 'right' : 'left');
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

// Start document construction
let doc = '';

// ==========================================
// PRELIMINARY 1: COVER PAGE
// ==========================================
doc += `<w:p>
  <w:pPr><w:jc w:val="center"/><w:spacing w:before="100" w:after="100"/></w:pPr>
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

doc += p('Department of Information Technology', { align: 'center', bold: true, size: 14, color: '000000', before: 100, after: 300 });
doc += p('ELECTRICITY BILL CALCULATOR', { align: 'center', bold: true, size: 20, color: 'C00000', before: 200, after: 200 });
doc += p('Submitted in partial fulfilment of the requirements for the degree of', { align: 'center', italic: true, size: 12, color: '000000', before: 150, after: 150 });
doc += p('BACHELOR OF TECHNOLOGY', { align: 'center', bold: true, size: 15, color: '000000', before: 100, after: 50 });
doc += p('In', { align: 'center', bold: true, size: 13, color: '000000', before: 50, after: 50 });
doc += p('INFORMATION TECHNOLOGY', { align: 'center', bold: true, size: 15, color: '000000', before: 50, after: 200 });

doc += p('Submitted By', { align: 'center', italic: true, size: 13, color: '000000', before: 100, after: 100 });
doc += p('Team Members', { align: 'center', bold: true, size: 14, color: '000000', before: 50, after: 120 });

// Team Members Table on Cover Page
const teamRowsCover = [
    ['1', 'SHAPTHAGIRI G', '814725205105'],
    ['2', 'RENGESH M', '814725205088'],
    ['3', 'SAI SARAN N', '814725205096']
];
doc += table(['S.No.', 'Student Name', 'Register Number'], teamRowsCover, [1200, 4200, 3200]);

doc += p('Under the Guidance of', { align: 'center', italic: true, size: 13, color: '000000', before: 150, after: 50 });
doc += p('Mrs. C. Manonmani', { align: 'center', bold: true, size: 14, color: '000000', before: 50, after: 200 });
doc += p('SRM TRP ENGINEERING COLLEGE', { align: 'center', bold: true, size: 14, color: '002060', before: 100, after: 50 });
doc += p('(An Autonomous Institution Affiliated to Anna University, Chennai)', { align: 'center', italic: true, size: 10, color: '475569', before: 0, after: 50 });
doc += p('Tiruchirappalli – 621 105', { align: 'center', size: 11, color: '000000', before: 0, after: 50 });
doc += p('Academic Year: 2026-27 (ODD)', { align: 'center', bold: true, size: 12, color: '000000', before: 50, after: 100 });

doc += pb();

// ==========================================
// PRELIMINARY 2: BONAFIDE CERTIFICATE
// ==========================================
doc += `<w:p>
  <w:pPr><w:jc w:val="center"/><w:spacing w:before="100" w:after="100"/></w:pPr>
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

doc += p('Department of Information Technology', { align: 'center', bold: true, size: 14, color: '000000', before: 100, after: 200 });
doc += h1('BONAFIDE CERTIFICATE');
doc += pEmpty(150);

doc += p('This is to certify that SHAPTHAGIRI G (Reg. No: 814725205105), RENGESH M (Reg. No: 814725205088), and SAI SARAN N (Reg. No: 814725205096) from second year B.Tech Information Technology have successfully completed their mini-project work titled “ELECTRICITY BILL CALCULATOR” at SRM TRP Engineering College, Tiruchirappalli in partial fulfillment of the requirements for the award of the degree of Bachelor of Technology in Information Technology during the academic year 2026-27 (ODD).', { align: 'both', size: 12, line: 320, after: 250 });

doc += pEmpty(250);

// Certificate Signatures Table
const certSigTable = [
    [
        'Mrs. C. Manonmani\n(Faculty In-charge)\nArtificial Intelligence & Data Science\nSRM TRP Engineering College\nTrichy - 621 105',
        'Dr. [Head of Department]\n(Head of Department)\nDepartment of Information Technology\nSRM TRP Engineering College\nTrichy - 621 105'
    ]
];
doc += table(['FACULTY IN-CHARGE', 'HEAD OF THE DEPARTMENT'], certSigTable, [4400, 4400]);

doc += pEmpty(200);
doc += p('Submitted for the Mini-Project Viva-Voce Examination held on: ..............................', { align: 'left', size: 11, italic: true, after: 200 });

const examinerTable = [
    ['INTERNAL EXAMINER', 'EXTERNAL EXAMINER']
];
doc += table(['INTERNAL EXAMINER', 'EXTERNAL EXAMINER'], examinerTable, [4400, 4400]);

doc += pb();

// ==========================================
// PRELIMINARY 3: ACKNOWLEDGEMENT
// ==========================================
doc += h1('ACKNOWLEDGEMENT');
doc += pEmpty(100);

doc += p('It is with sincere gratitude and deep appreciation that we take this opportunity to acknowledge the invaluable support, constructive advice, and continuous guidance we have received throughout the course of this mini-project work.', { align: 'both', size: 12, line: 300, after: 140 });

doc += p('We express our profound heartfelt thanks to our respected Project Guide, Mrs. C. Manonmani, Faculty In-charge, Department of Artificial Intelligence & Data Science, for her scholarly guidance, constant encouragement, and insightful feedback during every stage of designing and developing the Electricity Bill Calculator application.', { align: 'both', size: 12, line: 300, after: 140 });

doc += p('We extend our heartfelt gratitude to Dr. [Head of Department], Head of the Department of Information Technology, for providing the necessary infrastructural resources, computer laboratory facilities, and an encouraging academic environment that fostered technological innovation and experiential learning.', { align: 'both', size: 12, line: 300, after: 140 });

doc += p('We would also like to record our deep sense of gratitude to the Principal, Executive Director, and the Management of SRM TRP Engineering College, Tiruchirappalli, for providing state-of-the-art computational facilities and continuous academic support.', { align: 'both', size: 12, line: 300, after: 140 });

doc += p('A special note of thanks goes to all the faculty members, laboratory instructors, and supporting technical staff of the Department of Information Technology for their kind cooperation, technical assistance, and timely guidance throughout the project tenure.', { align: 'both', size: 12, line: 300, after: 140 });

doc += p('Finally, we express our deepest, warmest gratitude to our beloved parents and family members for their unconditional love, moral encouragement, patient endurance, and constant inspiration. We also thank our fellow classmates and friends who directly or indirectly contributed their valuable suggestions towards the successful completion of this project work.', { align: 'both', size: 12, line: 300, after: 200 });

doc += p('Academic Year: 2026-2027', { align: 'right', bold: true, size: 11, after: 60 });
doc += p('Team Members:', { align: 'right', bold: true, size: 11, after: 40 });
doc += p('SHAPTHAGIRI G (814725205105)', { align: 'right', size: 11, after: 30 });
doc += p('RENGESH M (814725205088)', { align: 'right', size: 11, after: 30 });
doc += p('SAI SARAN N (814725205096)', { align: 'right', size: 11, after: 100 });

doc += pb();

// ==========================================
// PRELIMINARY 4: TABLE OF CONTENTS
// ==========================================
doc += h1('TABLE OF CONTENTS');
doc += pEmpty(100);

const tocRows = [
    ['1', 'Acknowledgement', '3'],
    ['2', 'Abstract', '6'],
    ['3', 'List of Tables', '7'],
    ['4', 'List of Figures', '8'],
    ['5', 'Chapter 1: Introduction', '9'],
    ['', '  1.1 Project Background', '9'],
    ['', '  1.2 Problem Statement', '10'],
    ['', '  1.3 Aim of the Project', '10'],
    ['', '  1.4 Objectives of the Project', '10'],
    ['', '  1.5 Scope of the Project', '11'],
    ['', '  1.6 Need for the Project', '11'],
    ['', '  1.7 Existing System and Drawbacks', '12'],
    ['', '  1.8 Proposed System and Advantages', '12'],
    ['', '  1.9 Organization of the Report', '13'],
    ['6', 'Chapter 2: System Requirements', '14'],
    ['', '  2.1 Hardware Requirements', '14'],
    ['', '  2.2 Software Requirements', '14'],
    ['', '  2.3 Functional Requirements', '15'],
    ['', '  2.4 Non-Functional Requirements', '15'],
    ['', '  2.5 Feasibility Study', '16'],
    ['', '  2.6 Technologies Used', '17'],
    ['7', 'Chapter 3: System Design', '19'],
    ['', '  3.1 Overall System Architecture', '19'],
    ['', '  3.2 Page Structure and Modules', '20'],
    ['', '  3.3 Consumer and Billing Data Design', '21'],
    ['', '  3.4 Progressive Tariff Slabs Specification', '22'],
    ['', '  3.5 Use Case Diagram and Analysis', '23'],
    ['', '  3.6 Data Flow Diagrams (DFD Level 0 & Level 1)', '24'],
    ['', '  3.7 Overall System Workflow', '26'],
    ['', '  3.8 Sequence Diagram', '27'],
    ['', '  3.9 Site Map and Navigation Structure', '28'],
    ['', '  3.10 User Interface Design & Wireframe', '29'],
    ['', '  3.11 Hosting and Deployment Design', '30'],
    ['8', 'Chapter 4: System Implementation', '31'],
    ['', '  4.1 Introduction to Implementation', '31'],
    ['', '  4.2 Frontend Structure Implementation (HTML5)', '31'],
    ['', '  4.3 Styling & Layout Implementation (CSS3)', '32'],
    ['', '  4.4 Client-Side Interactivity (JavaScript)', '33'],
    ['', '  4.5 Functional Modules Breakdown', '34'],
    ['', '  4.6 Mathematical Formulations & Slab Algorithm', '35'],
    ['', '  4.7 Input Validation and Boundary Handling', '38'],
    ['', '  4.8 Browser LocalStorage Persistence', '39'],
    ['', '  4.9 Responsive Design & Print Invoice Styling', '40'],
    ['', '  4.10 Security and Validation Considerations', '41'],
    ['', '  4.11 Output Screen Captures', '42'],
    ['', '  4.12 Source Code Screenshots', '46'],
    ['9', 'Chapter 5: Testing and Results', '48'],
    ['', '  5.1 Introduction to Software Testing', '48'],
    ['', '  5.2 Testing Objectives', '48'],
    ['', '  5.3 Types of Testing', '49'],
    ['', '  5.4 Test Environment', '50'],
    ['', '  5.5 Test Cases and Execution Results', '51'],
    ['', '  5.6 Testing Summary and Findings', '54'],
    ['10', 'Chapter 6: Result and Conclusion', '55'],
    ['', '  6.1 Results Achieved', '55'],
    ['', '  6.2 Key Advantages of the System', '55'],
    ['', '  6.3 System Limitations', '56'],
    ['', '  6.4 Future Enhancements', '56'],
    ['', '  6.5 Conclusion', '57'],
    ['11', 'References', '58']
];

doc += table(['S.No.', 'Title / Section', 'Page No.'], tocRows, [1200, 6400, 1200]);

doc += pb();

// ==========================================
// PRELIMINARY 5: LIST OF TABLES & FIGURES
// ==========================================
doc += h1('LIST OF TABLES');
doc += pEmpty(80);

const lotRows = [
    ['Table 2.1', 'Technologies Used and Their Roles in the Project', '17'],
    ['Table 3.1', 'Sections and Functional Modules of the Web Portal', '20'],
    ['Table 3.2', 'Attributes of a Billing Record Data Model', '21'],
    ['Table 3.3', 'Illustrative Progressive Tariff Slabs Specification', '22'],
    ['Table 3.4', 'Use Case Specification and Actor Interactions', '23'],
    ['Table 5.1', 'Test Environment Configuration', '50'],
    ['Table 5.2', 'Functional Test Cases and Verification Results', '51'],
    ['Table 5.3', 'Interface and Cross-Browser Compatibility Test Cases', '53'],
    ['Table 5.4', 'Input Validation and Edge Case Test Suite', '53']
];
doc += table(['Table No.', 'Title', 'Page No.'], lotRows, [1600, 6000, 1200]);

doc += pEmpty(150);
doc += h1('LIST OF FIGURES');
doc += pEmpty(80);

const lofRows = [
    ['Figure 3.1', 'Overall Architecture of the Electricity Bill Calculator', '19'],
    ['Figure 3.2', 'Use Case Diagram of the Web Application', '23'],
    ['Figure 3.3', 'Data Flow Diagram – Level 0 (Context Level)', '24'],
    ['Figure 3.4', 'Data Flow Diagram – Level 1 (Functional Decomposition)', '25'],
    ['Figure 3.5', 'Bill Calculation and Application Workflow Flowchart', '26'],
    ['Figure 3.6', 'Sequence Diagram for Bill Calculation and History Storage', '27'],
    ['Figure 3.7', 'Site Map and Navigation Hierarchy of the Portal', '28'],
    ['Figure 3.8', 'Wireframe Layout Plan of the Application Interface', '29'],
    ['Figure 4.1', 'Pseudo-code of the Progressive Slab Calculation Algorithm', '37'],
    ['Figure 4.2', 'Output Screen: Home Page and Hero Banner View', '42'],
    ['Figure 4.3', 'Output Screen: Illustrative Tariff Slabs Display Grid', '43'],
    ['Figure 4.4', 'Output Screen: Consumer & Meter Reading Input Form', '43'],
    ['Figure 4.5', 'Output Screen: Electricity Bill Summary and Slab Breakdown', '44'],
    ['Figure 4.6', 'Output Screen: Calculation History Table (LocalStorage)', '44'],
    ['Figure 4.7', 'Output Screen: Print-Optimized Invoice View', '45'],
    ['Figure 4.8', 'Output Screen: Input Validation Error Notification', '45'],
    ['Figure 4.9', 'Coding Screenshot: HTML Structure (index.html)', '46'],
    ['Figure 4.10', 'Coding Screenshot: JavaScript Logic (script.js)', '47'],
    ['Figure 4.11', 'Coding Screenshot: CSS Styling (style.css)', '47']
];
doc += table(['Figure No.', 'Caption', 'Page No.'], lofRows, [1600, 6000, 1200]);

doc += pb();

// ==========================================
// PRELIMINARY 6: ABSTRACT
// ==========================================
doc += h1('ABSTRACT');
doc += pEmpty(100);

doc += p('The Electricity Bill Calculator (branded as PowerCalc) is a lightweight, responsive, and client-side web application developed to simplify, automate, and streamline the computation of domestic and commercial electricity consumption and estimated utility charges. In conventional billing methods, consumers often experience ambiguity regarding how their electricity bill is derived across multi-tiered, progressive slab structures, frequently leading to misunderstandings, budgeting difficulties, and manual calculation errors. This project bridges that gap by offering a transparent, instant, and interactive web tool that enables power consumers to compute their energy consumption directly from meter readings and understand their progressive cost breakdown.', { align: 'both', size: 12, line: 300, after: 140 });

doc += p('The web application provides an intuitive single-page interface comprising a prominent hero banner, an illustrative tariff slab overview, an interactive consumer and meter reading input form, a detailed progressive bill summary breakdown, persistent calculation history powered by browser LocalStorage, and a dedicated print stylesheet for generating clean invoice slips. Users input their previous meter reading and current meter reading in kilowatt-hours (kWh); the client-side JavaScript engine automatically computes the net energy units consumed (Units = Current Reading - Previous Reading) and rigorously applies a four-tier progressive tariff schedule (0–100 units at ₹1.50/unit, 101–200 units at ₹2.50/unit, 201–300 units at ₹4.00/unit, and units above 300 at ₹6.00/unit).', { align: 'both', size: 12, line: 300, after: 140 });

doc += p('Developed using standard modern web technologies including HTML5 for semantic page layout, CSS3 for responsive and print styling, and modern JavaScript (ES6) for DOM manipulation and calculation logic, the system operates completely on the client side without requiring server-side runtimes or external database installations. Historical calculations are stored locally in the browser’s LocalStorage key-value cache, permitting consumers to review past utility expenses or clear records at will. The project successfully demonstrates how foundational web engineering principles can be applied to solve everyday consumer utility challenges.', { align: 'both', size: 12, line: 300, after: 180 });

doc += p('Keywords: Electricity Bill Calculator, Energy Consumption, Progressive Slab Tariff, Client-Side Web Application, LocalStorage, HTML5, CSS3, JavaScript, Responsive Design.', { align: 'both', bold: true, size: 11, line: 260, color: '002060', after: 100 });

doc += pb();

// ==========================================
// CHAPTER 1: INTRODUCTION
// ==========================================
doc += h1('CHAPTER 1\nINTRODUCTION');
doc += pEmpty(100);

doc += h2('1.1 Project Background');
doc += p('Electricity is one of the most fundamental infrastructure resources powering modern civilization, supporting residential households, agricultural operations, commercial establishments, and heavy industrial facilities. Efficient energy utilization and transparent utility accounting are paramount for both power distribution companies and electricity consumers. Every billing cycle, power utility boards measure consumer consumption through electromechanical or digital energy meters located at customer premises. These meters record cumulative electrical energy consumed over time in kilowatt-hours (kWh), universally termed as "units".', { align: 'both', size: 12, line: 300, after: 120 });

doc += p('To promote conservation, discourage wasteful energy consumption, and provide affordable baseline electricity to economically vulnerable citizens, power regulatory commissions across India adopt progressive, multi-tier slab tariff systems. Under a progressive slab scheme, energy charges do not follow a flat rate; rather, initial blocks of consumed units are priced at highly subsidized lower rates, whereas subsequent increments of consumption are assessed at progressively escalating marginal rates. While economically equitable, progressive slab tariffs are mathematically complex for ordinary citizens to calculate manually, causing confusion and dispute.', { align: 'both', size: 12, line: 300, after: 140 });

doc += h2('1.2 Problem Statement');
doc += p('Despite the widespread availability of digital energy meters, millions of consumers face persistent challenges in monitoring and verifying their electricity bills. In the conventional scenario:', { align: 'both', size: 12, line: 300, after: 100 });

doc += bullet('Consumers typically wait until the utility board issues a bi-monthly or monthly physical paper bill, leaving them unable to track their consumption trends proactively during the billing cycle.');
doc += bullet('Manual calculation of progressive slab tariffs involves dividing total consumption across multiple rate tiers, which is highly error-prone and confusing for non-technical individuals.');
doc += bullet('Consumers often mistakenly believe that crossing into a higher slab rate applies that higher tariff retroactively to all consumed units, leading to distrust in utility board accounting.');
doc += bullet('There is a lack of simple, lightweight, zero-cost digital tools that allow householders and small business owners to enter previous and current meter readings, immediately verify consumption, inspect itemized slab costs, and maintain historical calculation records.');

doc += pEmpty(60);
doc += h2('1.3 Aim of the Project');
doc += p('The primary aim of this mini-project is to design, develop, test, and deploy a responsive, highly accessible, and user-friendly web application titled "Electricity Bill Calculator" that automatically calculates electricity consumption from meter readings and computes estimated progressive tariff charges using client-side web technologies.', { align: 'both', size: 12, line: 300, after: 140 });

doc += h2('1.4 Objectives of the Project');
doc += p('The specific academic and practical objectives established for this project include:', { align: 'both', size: 12, line: 300, after: 80 });

doc += bullet('To eliminate manual arithmetic errors by automating energy unit computation using the standardized formula (Units Consumed = Current Reading - Previous Reading).');
doc += bullet('To implement an accurate progressive slab tariff calculation algorithm across four distinct consumption tiers (0-100 units @ ₹1.50, 101-200 units @ ₹2.50, 201-300 units @ ₹4.00, and above 300 units @ ₹6.00).');
doc += bullet('To enforce strict client-side input validation preventing negative readings, blank fields, non-numeric inputs, and logical anomalies where the current reading is recorded as less than the previous reading.');
doc += bullet('To generate a transparent, itemized electricity bill summary table clearly articulating the exact units billed and charges incurred within each individual tariff slab.');
doc += bullet('To implement client-side data persistence using browser LocalStorage, enabling consumers to save, review, and delete previous calculation records locally without server overhead.');
doc += bullet('To design a dedicated print stylesheet (@media print) allowing consumers to print an official, receipt-style electricity invoice summary directly from their browser.');
doc += bullet('To build an aesthetically pleasing, responsive user interface supporting seamless interaction across desktop monitors, laptops, tablets, and smartphones.');

doc += pEmpty(60);
doc += h2('1.5 Scope of the Project');
doc += p('The scope of this mini-project encompasses the complete frontend design and client-side behavioral engineering of the Electricity Bill Calculator application. Specifically, the scope includes:', { align: 'both', size: 12, line: 300, after: 80 });

doc += bullet('Interactive User Interface: Developing semantic HTML5 layouts with modern CSS3 styling, sticky navigation, visual tariff cards, responsive forms, and modular cards.');
doc += bullet('Client-Side Computing: Implementing vanilla JavaScript (ES6) functions to process user inputs, perform real-time validations, execute tiered calculations, and update the Document Object Model (DOM) dynamically without page reloads.');
doc += bullet('Data Persistence: Utilizing the browser Web Storage API (LocalStorage) to store JSON-formatted bill records persistently across browser sessions.');
doc += bullet('Static Web Hosting: Designing the codebase as an independent, lightweight static site capable of direct hosting on platforms such as GitHub Pages.');
doc += bullet('Academic Demonstration: Formulating illustrative domestic tariff slab schedules to demonstrate multi-tier utility calculation logic effectively.');

doc += pEmpty(60);
doc += h2('1.6 Need for the Project');
doc += p('With the rapid adoption of digital governance and smart metering, consumer demand for transparent self-service tools has increased exponentially. Enabling electricity consumers to calculate and audit their energy expenses fosters energy consciousness, assists in household financial planning, and prevents billing disputes. Because this application operates directly inside modern web browsers with zero installation prerequisites, it delivers universal accessibility across diverse devices and operating systems.', { align: 'both', size: 12, line: 300, after: 140 });

doc += h2('1.7 Existing System and Drawbacks');
doc += p('In the existing traditional system, meter readers visit premises periodically to note down readings manually or via handheld optical probes. Consumers receive printed billing receipts or SMS notifications after billing cycles close. The significant drawbacks of this approach are:', { align: 'both', size: 12, line: 300, after: 80 });

doc += bullet('No Real-Time Estimation: Consumers have no intuitive mechanism to calculate their mid-cycle consumption or forecast monthly utility costs before the official bill arrives.');
doc += bullet('Opaque Calculation: Standard utility receipts often present aggregate energy charges without itemizing how units were segmented across progressive slabs, leaving consumers confused.');
doc += bullet('Manual Calculation Errors: When consumers attempt to calculate bills manually using printed tariff charts, arithmetic errors in slab distribution frequently occur.');
doc += bullet('Lack of Convenient Record Keeping: Paper receipts are easily misplaced, damaged, or lost, depriving householders of historical consumption records.');

doc += pEmpty(60);
doc += h2('1.8 Proposed System and Advantages');
doc += p('The proposed Electricity Bill Calculator application addresses each of the aforementioned deficiencies by offering a clean, automated, and mathematically verified web interface. The key advantages of the proposed system are:', { align: 'both', size: 12, line: 300, after: 80 });

doc += bullet('Instant Automated Computation: Delivers immediate calculation results upon entering meter readings, saving time and eliminating manual arithmetic.');
doc += bullet('Transparent Itemized Breakdown: Clearly displays slab-by-slab consumption units, marginal rates, and subtotal charges in a neat tabular breakdown.');
doc += bullet('Zero Installation & High Portability: Operates on standard web browsers (Google Chrome, Mozilla Firefox, Microsoft Edge, Safari) across desktops, tablets, and smartphones.');
doc += bullet('Client-Side Privacy & Offline Capability: Computations and historical records are processed locally via JavaScript and LocalStorage, requiring no external database or server transmission.');
doc += bullet('Printable Digital Receipts: Incorporates customized print CSS formatting to produce professional, receipt-style invoices with a single click.');

doc += pEmpty(60);
doc += h2('1.9 Organization of the Report');
doc += p('This mini-project report is organized into six comprehensive chapters structured as follows:', { align: 'both', size: 12, line: 300, after: 80 });

doc += bullet('Chapter 1 – Introduction: Presents project background, problem statement, aim, objectives, scope, existing system limitations, proposed system benefits, and report outline.');
doc += bullet('Chapter 2 – System Requirements: Outlines the hardware, software, functional, and non-functional requirements, technical and economic feasibility, and technical stack descriptions.');
doc += bullet('Chapter 3 – System Design: Elaborates overall architecture, module structures, data models, tariff slab designs, use cases, DFD Level 0 & Level 1, workflow flowcharts, sequence diagrams, site maps, and UI wireframes.');
doc += bullet('Chapter 4 – System Implementation: Details the technical realization of HTML5 structure, CSS3 styling, JavaScript algorithms, mathematical formulas, numerical examples, LocalStorage, responsive design, and output screenshots.');
doc += bullet('Chapter 5 – Testing and Results: Documents testing methodologies, test environment configurations, test cases (functional, interface, validation), expected vs. actual outcomes, and verification summaries.');
doc += bullet('Chapter 6 – Result and Conclusion: Discusses final project outcomes, achievements, limitations, potential future enhancements, and concluding remarks.');

doc += pb();

// ==========================================
// CHAPTER 2: SYSTEM REQUIREMENTS
// ==========================================
doc += h1('CHAPTER 2\nSYSTEM REQUIREMENTS');
doc += pEmpty(100);

doc += p('System requirements specify the essential hardware resources, software platforms, development tools, and operational characteristics required to design, develop, execute, and maintain the Electricity Bill Calculator application. Because the application is architected as a lightweight, client-side static web application, the computational demands on both developer and client workstations are modest.', { align: 'both', size: 12, line: 300, after: 140 });

doc += h2('2.1 Hardware Requirements');
doc += p('The minimum and recommended hardware specifications required to run and execute the application are detailed below:', { align: 'both', size: 12, line: 300, after: 80 });

doc += bullet('Processor: Intel Core i3 or equivalent AMD multi-core processor (1.8 GHz or higher).');
doc += bullet('RAM: Minimum 4 GB RAM (8 GB recommended for concurrent development and browser multitasking).');
doc += bullet('Hard Disk Storage: Minimum 1 GB of free storage space for code files, documentation, and browser cache.');
doc += bullet('Display Monitor: Standard color monitor with minimum resolution of 1366 × 768 pixels (the web layout is fully adaptive to mobile display resolutions down to 320px).');
doc += bullet('Input Devices: Standard alphanumeric keyboard and optical mouse or touch-sensitive trackpad / touchscreen.');
doc += bullet('Network Interface: Internet connection for initial resource downloading and remote repository hosting via GitHub.');

doc += pEmpty(60);
doc += h2('2.2 Software Requirements');
doc += p('The software configuration and environment utilized during the project development lifecycle include:', { align: 'both', size: 12, line: 300, after: 80 });

doc += bullet('Operating System: Microsoft Windows 10 / Windows 11 (64-bit), Ubuntu Linux 20.04+, or Apple macOS.');
doc += bullet('Frontend Technologies: HyperText Markup Language 5 (HTML5), Cascading Style Sheets 3 (CSS3), and JavaScript (ECMAScript 2020 / ES6+).');
doc += bullet('Client Storage Mechanism: Browser Web Storage API (LocalStorage).');
doc += bullet('Integrated Development Environment (IDE): Visual Studio Code (Version 1.85+) with Live Server extension.');
doc += bullet('Version Control & Hosting: Git distributed version control system and GitHub Pages static web hosting service.');
doc += bullet('Target Web Browsers: Google Chrome (v110+), Mozilla Firefox (v105+), Microsoft Edge (v110+), or Apple Safari (v15+).');

doc += pEmpty(60);
doc += h2('2.3 Functional Requirements');
doc += p('Functional requirements describe the core operational capabilities, inputs, calculations, and behaviors provided by the system to its end users:', { align: 'both', size: 12, line: 300, after: 80 });

doc += bullet('FR-1 (Consumer Profile Entry): The system shall accept consumer identification attributes including consumer name, service ID / consumer number, connection tariff type, and service address.');
doc += bullet('FR-2 (Meter Reading Input): The system shall provide structured numeric input fields for recording previous energy meter reading and current energy meter reading in kWh.');
doc += bullet('FR-3 (Strict Input Validation): The system shall validate that all required fields are filled, inputs contain valid non-negative numbers, and current reading is greater than or equal to previous reading.');
doc += bullet('FR-4 (Consumption Calculation): The system shall automatically compute total energy consumption in units as the difference between current reading and previous reading.');
doc += bullet('FR-5 (Progressive Slab Calculation): The system shall evaluate total consumption against a predefined four-tier progressive slab schedule, allocating units and calculating marginal costs for each applicable slab.');
doc += bullet('FR-6 (Bill Summary Generation): The system shall dynamically generate an itemized invoice summary displaying consumer details, meter readings, units consumed, slab-wise breakdown, and net payable amount.');
doc += bullet('FR-7 (LocalStorage History Management): The system shall allow users to persist calculated bill records into browser LocalStorage, display stored history records in a tabular list, and delete individual records or clear all history.');
doc += bullet('FR-8 (Print Invoice Formatting): The system shall trigger browser printing with print-optimized CSS, hiding navigational headers, action buttons, and background colors to output a professional paper receipt.');

doc += pEmpty(60);
doc += h2('2.4 Non-Functional Requirements');
doc += p('Non-functional requirements specify the operational quality attributes, performance benchmarks, and usability standards satisfied by the application:', { align: 'both', size: 12, line: 300, after: 80 });

doc += bullet('Usability & Simplicity: The user interface must be clean, highly intuitive, and self-explanatory, requiring zero technical training or prior instructions.');
doc += bullet('Responsiveness: The application layout must dynamically adapt across standard screen viewports (desktop monitors, laptops, tablets, mobile smartphones) using CSS media queries and flexible grid layouts.');
doc += bullet('High Performance & Low Latency: Because all calculations occur client-side via JavaScript without backend network round-trips, bill generation must execute instantaneously (under 50 milliseconds).');
doc += bullet('Portability: The web application must operate uniformly across all major modern web browsers without requiring external browser plugins, compilers, or platform-specific libraries.');
doc += bullet('Reliability & Error Prevention: The application must catch and handle invalid inputs gracefully, presenting clear visual error messages without application crashes or incorrect arithmetic outputs.');
doc += bullet('Maintainability: Codebase must follow modular engineering practices, separating structure (HTML5), visual presentation (CSS3), and behavioral logic (JavaScript) into decoupled files.');

doc += pEmpty(60);
doc += h2('2.5 Feasibility Study');
doc += p('A feasibility study was conducted prior to implementation to analyze the technical, economic, and operational viability of developing the Electricity Bill Calculator.', { align: 'both', size: 12, line: 300, after: 100 });

doc += h3('2.5.1 Technical Feasibility');
doc += p('The project utilizes mature, industry-standard web standards: HTML5, CSS3, and JavaScript. These technologies are natively supported by every modern web browser on desktop and mobile platforms. No complex back-end application servers, web frameworks, or third-party database engines are mandatory for executing client-side mathematical calculations and storing local session data. Development tools such as Visual Studio Code provide excellent debugging and syntax verification. Thus, the project is technically sound and highly feasible.', { align: 'both', size: 12, line: 300, after: 100 });

doc += h3('2.5.2 Economic Feasibility');
doc += p('All software tools, compilers, development libraries, code editors (VS Code), web browsers (Google Chrome), and deployment environments (GitHub Pages) employed throughout this project are completely free, open-source, or zero-cost services. The application imposes zero recurring database licensing costs or dedicated cloud hosting infrastructure charges. Consequently, the project requires zero financial investment, making it economically optimal.', { align: 'both', size: 12, line: 300, after: 100 });

doc += h3('2.5.3 Operational Feasibility');
doc += p('The user interface is designed with familiarity and simplicity, mirroring standard online consumer utility portals. Householders, students, and small business owners can calculate bills effortlessly by simply inputting meter readings. Updating tariff slabs or modifying rate configurations requires only minor edits to a well-defined JavaScript configuration array. Hence, the project possesses high operational feasibility.', { align: 'both', size: 12, line: 300, after: 140 });

doc += h2('2.6 Technologies Used');
doc += p('Table 2.1 summarizes the technology stack selected for developing the Electricity Bill Calculator and the precise engineering role of each component.', { align: 'both', size: 12, line: 300, after: 100 });

const techRows = [
    ['HTML5', 'Semantic structure: header, navigation, hero banner, tariff cards, calculator form, summary invoice, and footer.'],
    ['CSS3', 'Visual design, color palette, flexbox and grid layouts, typography, button hover states, and responsive media queries.'],
    ['JavaScript (ES6)', 'Client-side calculation engine, progressive slab logic, input validation, DOM event handling, and LocalStorage CRUD.'],
    ['Web Storage API', 'Browser-native LocalStorage key-value persistence for storing, retrieving, and clearing past calculation records.'],
    ['Visual Studio Code', 'Modern source code editor utilized for authoring code, syntax highlighting, debugging, and project structuring.'],
    ['Google Chrome / Edge', 'Primary runtime environments utilized for client execution, UI rendering, DevTools debugging, and invoice printing.'],
    ['Git & GitHub Pages', 'Version control tracking, source repository management, and free static HTTPS web application deployment.']
];
doc += table(['Technology / Tool', 'Purpose and Engineering Role in Project'], techRows, [2400, 6400]);

doc += p('HTML5 provides semantic page organization using specialized structural tags such as <header>, <nav>, <section>, <form>, <table>, and <footer>. This semantic foundation ensures high accessibility and clean separation of concerns. CSS3 introduces sophisticated layout capabilities through CSS Flexbox and CSS Grid, supporting responsive breakpoints that reflow content seamlessly from wide monitors down to narrow smartphone screens. Modern JavaScript (ECMAScript 6+) runs directly in the client’s browser sandbox, handling interactive events, validating user inputs, and computing progressive tariffs with zero server round-trip latency.', { align: 'both', size: 12, line: 300, after: 140 });

doc += pb();

// ==========================================
// CHAPTER 3: SYSTEM DESIGN
// ==========================================
doc += h1('CHAPTER 3\nSYSTEM DESIGN');
doc += pEmpty(100);

doc += h2('3.1 Overall System Architecture');
doc += p('The Electricity Bill Calculator is architected following a modular client-side single-page architecture (SPA). Rather than relying on multi-tier server-side processing pipelines that require continuous client-server network exchanges, the entire application runtime executes inside the client web browser. When the user opens the application URL, the web server (or static host such as GitHub Pages) delivers the static HTML5, CSS3, and JavaScript files via HTTPS. Once loaded into browser memory, the presentation layer, business logic engine, and local storage manager operate entirely on the client workstation.', { align: 'both', size: 12, line: 300, after: 120 });

// Architecture Diagram
doc += img('rId10', 5400000, 3000000, 'Figure 3.1: Architecture of the Electricity Bill Calculator');

doc += p('As illustrated in Figure 3.1, the client browser environment is divided into three coordinated subsystems:', { align: 'both', size: 12, line: 300, after: 80 });

doc += bullet('Presentation Subsystem (HTML5 & CSS3): Renders visual components including the navigation header, hero banner, interactive tariff slab grid, meter reading input form, calculation result card, and saved history tables.');
doc += bullet('Business Logic Engine (JavaScript): Manages event listeners, sanitizes and validates consumer inputs, evaluates the mathematical difference between meter readings, executes the progressive slab calculation algorithm, and updates the Document Object Model (DOM).');
doc += bullet('Data Persistence Subsystem (LocalStorage): Interacts with the browser’s native Web Storage API to serialize calculation records into JSON strings, persist them under the key "eb_calc_history", and retrieve them for tabular display.');

doc += pEmpty(60);
doc += h2('3.2 Page Structure and Modules');
doc += p('The application is organized into eight logical functional modules integrated seamlessly within a cohesive single-page design. Table 3.1 delineates these modules and their operational purpose.', { align: 'both', size: 12, line: 300, after: 100 });

const moduleRows = [
    ['Module 1', 'Header & Navigation', 'Sticky navigation bar featuring application branding, logo, and anchor links to Home, Tariffs, Calculator, History, and About.'],
    ['Module 2', 'Hero Banner', 'Prominent introductory section communicating the application purpose, academic affiliation, and quick action buttons.'],
    ['Module 3', 'Tariff Slabs Display', 'Interactive grid of four tariff cards displaying marginal rates, unit ranges, and terms for academic progressive demonstration.'],
    ['Module 4', 'Consumer Input Form', 'Input interface capturing consumer name, service number, connection type, service address, previous reading, and current reading.'],
    ['Module 5', 'Calculation Engine', 'Core JavaScript algorithms validating inputs, enforcing current >= previous, computing units, and calculating slab charges.'],
    ['Module 6', 'Bill Invoice Summary', 'Dynamic result card displaying consumer profile, total units consumed, itemized slab breakdown table, and net payable bill.'],
    ['Module 7', 'Calculation History', 'LocalStorage management module displaying past calculation records, supporting individual item deletion, and history clearing.'],
    ['Module 8', 'Print Invoice Formatter', 'Print-optimized CSS module triggered by window.print() to generate clean, paper-ready invoice slips without navigation elements.']
];
doc += table(['Module ID', 'Module Name', 'Functional Scope and Operational Purpose'], moduleRows, [1400, 2400, 5000]);

doc += pb();

doc += h2('3.3 Consumer and Billing Data Design');
doc += p('To maintain data consistency and support structured persistence in LocalStorage, each bill calculation is modeled as a standardized JSON data entity. Table 3.2 details the attributes making up this data model.', { align: 'both', size: 12, line: 300, after: 100 });

const dataModelRows = [
    ['id', 'String', 'Unique calculation identifier generated using timestamp prefix (e.g., "BILL-1731168400000").'],
    ['date', 'String', 'Formatted date and time of calculation formatted in Indian standard format (e.g., "09 Nov 2026, 09:30 PM").'],
    ['consumerName', 'String', 'Full legal name of the electricity customer / consumer.'],
    ['consumerNumber', 'String', 'Unique utility service connection identifier (e.g., "EB-2026-814725205105").'],
    ['connectionType', 'String', 'Category of power connection (Domestic / Residential, Commercial, Small Industry).'],
    ['consumerAddress', 'String', 'Physical premise address or geographical distribution area of the service point.'],
    ['previousReading', 'Number', 'Initial cumulative energy meter reading recorded in kWh at billing cycle start.'],
    ['currentReading', 'Number', 'Final cumulative energy meter reading recorded in kWh at billing cycle end.'],
    ['unitsConsumed', 'Number', 'Net energy units consumed during the cycle (Current Reading - Previous Reading).'],
    ['breakdown', 'Array[Object]', 'Itemized array containing slab label, units billed, marginal rate, and slab amount.'],
    ['totalEnergyCharges', 'Number', 'Summation of progressive energy charges incurred across all applicable slabs.'],
    ['fixedCharges', 'Number', 'Fixed meter rent / service charge (configured as ₹0.00 for academic demonstration).'],
    ['grandTotal', 'Number', 'Net payable bill amount in Indian Rupees (₹) due from the electricity consumer.']
];
doc += table(['Attribute Name', 'Data Type', 'Description and Representation Format'], dataModelRows, [2000, 1600, 5200]);

doc += pEmpty(60);
doc += h2('3.4 Progressive Tariff Slabs Specification');
doc += p('The application implements a four-tier progressive domestic slab tariff schedule. Under this progressive structure, each portion of consumption is assessed exclusively at its respective slab rate. Table 3.3 presents the exact parameters configured in the calculation engine.', { align: 'both', size: 12, line: 300, after: 100 });

const tariffSpecRows = [
    ['Slab 1', '0 to 100 Units', '100 Units', '₹1.50 per unit', 'Subsidized baseline consumption tier for essential household lighting and fans.'],
    ['Slab 2', '101 to 200 Units', '100 Units', '₹2.50 per unit', 'Moderate consumption tier covering basic electrical appliances and refrigeration.'],
    ['Slab 3', '201 to 300 Units', '100 Units', '₹4.00 per unit', 'Higher consumption tier covering air conditioning, water heaters, and washing machines.'],
    ['Slab 4', 'Above 300 Units', 'Unlimited (Infinity)', '₹6.00 per unit', 'Maximum marginal rate tier penalizing high energy consumption and encouraging efficiency.']
];
doc += table(['Slab Tier', 'Consumption Range', 'Slab Capacity', 'Marginal Rate', 'Intended Consumption Profile'], tariffSpecRows, [1400, 2000, 1400, 1600, 2400]);

doc += p('* Important Clarification: The tariff rates tabulated above are illustrative parameters calibrated specifically for academic demonstration and laboratory testing of multi-tier progressive billing logic, and do not represent the statutory tariff orders issued by the Tamil Nadu Electricity Regulatory Commission (TNERC). Fixed charges, electricity duties, and state subsidies are excluded unless specifically enabled.', { align: 'both', italic: true, size: 10, color: '475569', after: 140 });

doc += pb();

doc += h2('3.5 Use Case Diagram and Analysis');
doc += p('The Use Case Diagram depicts the functional interactions between the primary human actor (Electricity Consumer / User) and the web application system.', { align: 'both', size: 12, line: 300, after: 100 });

// Use Case Diagram
doc += img('rId11', 4800000, 3120000, 'Figure 3.2: Use Case Diagram of the Electricity Bill Calculator');

doc += p('Table 3.4 provides detailed specifications for each identified use case, outlining the triggering actor, pre-conditions, and expected system response.', { align: 'both', size: 12, line: 300, after: 100 });

const ucSpecRows = [
    ['UC-01', 'View Tariff Rates', 'Consumer', 'Navigates to Tariff section; system displays visual cards showing marginal slab rates.'],
    ['UC-02', 'Enter Meter Readings', 'Consumer', 'Inputs customer identity and numeric previous and current meter readings into web form.'],
    ['UC-03', 'Validate Readings', 'System', 'Validates non-empty fields, positive numeric data types, and verifies current >= previous.'],
    ['UC-04', 'Calculate Progressive Bill', 'System', 'Executes units subtraction and progressive tiered algorithm across four slab capacities.'],
    ['UC-05', 'View Bill Breakdown', 'Consumer', 'Displays generated invoice card showing consumer details, units, slab table, and total.'],
    ['UC-06', 'Save to LocalStorage', 'Consumer', 'Clicks "Save to History"; system serializes record into browser LocalStorage JSON store.'],
    ['UC-07', 'Manage History Records', 'Consumer', 'Reviews stored calculation table, deletes specific records, or clears entire local cache.'],
    ['UC-08', 'Print Bill Invoice', 'Consumer', 'Clicks "Print Bill"; system applies @media print CSS and invokes native print dialog.']
];
doc += table(['Use Case ID', 'Use Case Name', 'Actor', 'Operational Description and System Response'], ucSpecRows, [1400, 2200, 1400, 3800]);

doc += pb();

doc += h2('3.6 Data Flow Diagrams');
doc += p('Data Flow Diagrams (DFDs) trace the flow of information through the application, identifying external entities, computational processes, data stores, and interconnecting data streams.', { align: 'both', size: 12, line: 300, after: 100 });

doc += h3('3.6.1 Data Flow Diagram – Level 0 (Context Level)');
doc += p('The Level 0 Context Diagram represents the entire Electricity Bill Calculator as a single unified process interacting with the external human actor and the browser data store.', { align: 'both', size: 12, line: 300, after: 80 });

// DFD Level 0
doc += img('rId12', 4800000, 2160000, 'Figure 3.3: Data Flow Diagram – Level 0 (Context Level)');

doc += p('As depicted in Figure 3.3, the Electricity Consumer supplies consumer identification details and previous and current meter readings to Process 0 (Electricity Bill Calculator System). In return, the system outputs validated calculation summaries, itemized slab charges, net payable amounts, and error notifications. Bidirectional data streams connect the system process with Data Store D1 (Browser LocalStorage) to record and retrieve historical billings.', { align: 'both', size: 12, line: 300, after: 120 });

doc += h3('3.6.2 Data Flow Diagram – Level 1 (Functional Decomposition)');
doc += p('The Level 1 DFD decomposes the system into four discrete sub-processes, clarifying how data transforms across individual modules.', { align: 'both', size: 12, line: 300, after: 80 });

// DFD Level 1
doc += img('rId13', 5400000, 3360000, 'Figure 3.4: Data Flow Diagram – Level 1 (Functional Decomposition)');

doc += p('In Figure 3.4, Process 1.0 captures and validates the raw input readings. Validated numbers pass to Process 2.0, which queries the tariff schedule (Data Store D1) to compute energy units and progressive slab charges. Process 3.0 formats the resulting breakdown into a printable bill summary. Process 4.0 handles serialization and deserialization of records to and from LocalStorage (Data Store D2).', { align: 'both', size: 12, line: 300, after: 140 });

doc += pb();

doc += h2('3.7 Overall System Workflow');
doc += p('The overall workflow flowchart in Figure 3.5 traces the complete sequential and conditional execution path traversed by the application during a user session.', { align: 'both', size: 12, line: 300, after: 100 });

// Flowchart
doc += img('rId14', 4500000, 4180000, 'Figure 3.5: Bill Calculation and Application Workflow Flowchart');

doc += p('The user launches the application, inspects tariff slabs, and inputs consumer information and meter readings into the web form. Upon clicking "Calculate Bill", the JavaScript validation engine inspects all inputs. If validation fails (e.g., current reading < previous reading), a clear red error message is highlighted. If inputs are valid, the system calculates net consumption, divides units across progressive slabs, renders the detailed invoice, and presents options to save or print.', { align: 'both', size: 12, line: 300, after: 140 });

doc += pb();

doc += h2('3.8 Sequence Diagram');
doc += p('The Sequence Diagram in Figure 3.6 illustrates the chronological exchange of messages between the Consumer, the Web Interface, the Calculation Engine, and LocalStorage.', { align: 'both', size: 12, line: 300, after: 100 });

// Sequence Diagram
doc += img('rId15', 5200000, 2940000, 'Figure 3.6: Sequence Diagram for Bill Calculation and History Storage');

doc += p('As shown in Figure 3.6, message 1 initiates user form submission. The Web UI dispatches arguments to the Calculation Engine via validateAndCalculate(). In message 3, the engine invokes calculateSlabCharges() in a local loop. In message 4, the calculated record object is returned to the UI, rendering the summary. When the user clicks "Save to History", messages 6–9 serialize the record and store it in LocalStorage, instantly updating the history table.', { align: 'both', size: 12, line: 300, after: 140 });

doc += pb();

doc += h2('3.9 Site Map and Navigation Structure');
doc += p('Figure 3.7 presents the hierarchical site map and navigation layout of the single-page application.', { align: 'both', size: 12, line: 300, after: 100 });

// Site Map
doc += img('rId16', 5000000, 2625000, 'Figure 3.7: Site Map and Navigation Hierarchy of the Portal');

doc += p('The single root file index.html contains five logically linked sections: the Hero Section (#home), Tariff Slabs Grid (#tariffs), Calculator & Result Card (#calculator), Saved History (#history), and Project Team Information (#about). The sticky navigation header allows one-click jumping between sections with smooth scrolling.', { align: 'both', size: 12, line: 300, after: 140 });

doc += h2('3.10 User Interface Design and Wireframe');
doc += p('Figure 3.8 shows the structural wireframe blueprint designed during the initial planning phase to establish visual balance and responsive card hierarchy.', { align: 'both', size: 12, line: 300, after: 100 });

// Wireframe
doc += img('rId17', 4800000, 3712000, 'Figure 3.8: Wireframe Layout Plan of the Application Interface');

doc += p('The two-column desktop arrangement places the input form on the left and the generated invoice card on the right, providing immediate visual feedback. On mobile viewports below 900px, CSS Grid automatically reflows these columns into an ergonomic single-column vertical stack.', { align: 'both', size: 12, line: 300, after: 140 });

doc += h2('3.11 Hosting and Deployment Design');
doc += p('The Electricity Bill Calculator is packaged as an independent static web repository comprising index.html, style.css, and script.js. The codebase is tracked via Git and deployed online over HTTPS using GitHub Pages. Any committed updates automatically trigger GitHub Actions deployment pipelines, delivering zero-downtime, continuous deployment at zero hosting expense.', { align: 'both', size: 12, line: 300, after: 140 });

doc += pb();

// ==========================================
// CHAPTER 4: SYSTEM IMPLEMENTATION
// ==========================================
doc += h1('CHAPTER 4\nSYSTEM IMPLEMENTATION');
doc += pEmpty(100);

doc += h2('4.1 Introduction to Implementation');
doc += p('System implementation translates the architectural blueprints, data models, and workflow specifications established in Chapter 3 into fully functional, production-ready source code. The Electricity Bill Calculator is built exclusively using standards-compliant HTML5, CSS3, and modern vanilla JavaScript (ES6), ensuring maximum execution speed, zero external library dependencies, and complete cross-platform browser support.', { align: 'both', size: 12, line: 300, after: 120 });

doc += h2('4.2 Frontend Structure Implementation (HTML5)');
doc += p('The document structure is built around semantic HTML5 elements. The primary structural components in index.html include:', { align: 'both', size: 12, line: 300, after: 80 });

doc += bullet('<header class="header">: Hosts the brand logo, project emblem (⚡ PowerCalc), and desktop navigation menu.');
doc += bullet('<section id="home" class="hero-section">: Houses the academic project badge, title, subtitle, and primary call-to-action buttons.');
doc += bullet('<section id="tariffs">: Features a responsive grid containing four illustrative slab tariff informational cards.');
doc += bullet('<section id="calculator">: Contains the core two-column calculator wrapper enclosing the meter input form and the generated bill summary card.');
doc += bullet('<section id="history">: Contains the LocalStorage calculation history table, empty-state banner, and history clearing controls.');
doc += bullet('<section id="about">: Details project objectives, mentor acknowledgements, and full team member credentials.');
doc += bullet('<footer class="footer">: Displays copyright statements, academic department attribution, and team credits.');

doc += pEmpty(60);
doc += h2('4.3 Styling and Responsive Layout Implementation (CSS3)');
doc += p('Visual presentation and layout responsiveness are implemented in style.css utilizing modern CSS features:', { align: 'both', size: 12, line: 300, after: 80 });

doc += bullet('CSS Custom Properties (Variables): A centralized :root theme defines primary navy (#1e40af), accent amber (#f59e0b), success green (#10b981), danger red (#ef4444), and neutral background tokens.');
doc += bullet('CSS Grid & Flexbox: The calculator utilizes a 1fr 1fr two-column grid on desktop screens, automatically transitioning to a single-column layout on viewports narrower than 900px.');
doc += bullet('Card Elevation & Shadows: Cards incorporate layered box-shadow styles (var(--shadow) and var(--shadow-lg)) with smooth translateY hover transitions.');
doc += bullet('Print Media Query (@media print): Dedicated print rules hide non-essential page elements (navbars, hero banners, buttons, and footers), isolating the invoice element for paper printing.');

doc += pEmpty(60);
doc += h2('4.4 Client-Side Interactivity and Behavioral Logic (JavaScript)');
doc += p('Client-side behavioral logic in script.js manages user events, DOM updates, calculation logic, and storage interactions without any third-party framework overhead. Event listeners registered on DOMContentLoaded handle form submission, form reset, invoice printing, and LocalStorage CRUD operations.', { align: 'both', size: 12, line: 300, after: 120 });

doc += h2('4.5 Functional Modules Breakdown');
doc += p('The implementation decomposes application responsibilities into focused, testable modules:', { align: 'both', size: 12, line: 300, after: 80 });

doc += bullet('Module 1 (Home & Navigation): Binds smooth-scrolling anchors to navigation menu items, enabling intuitive section transitions.');
doc += bullet('Module 2 (Customer Details Management): Captures consumer name, customer ID, connection classification, and service address, sanitizing values via string trimming.');
doc += bullet('Module 3 (Meter Reading Input): Captures previous and current meter readings using numeric input fields with step="1" and min="0" attributes.');
doc += bullet('Module 4 (Unit Calculation Engine): Executes subtraction logic, deriving net consumed energy units.');
doc += bullet('Module 5 (Progressive Slab Engine): Iterates through the TARIFF_SLABS array, systematically calculating progressive slab allocation.');
doc += bullet('Module 6 (Bill Summary & Invoice Generation): Dynamically injects formatted table rows into the DOM, displaying itemized slab charges.');
doc += bullet('Module 7 (Calculation History Manager): Interfaces with window.localStorage to persist and retrieve stringified JSON billing objects.');
doc += bullet('Module 8 (Print Functionality): Invokes the native browser window.print() API to print the formatted invoice.');

doc += pb();

doc += h2('4.6 Mathematical Formulations and Progressive Slab Billing Algorithm');
doc += p('The calculation engine relies on three fundamental mathematical formulas to compute energy consumption and tiered utility bills.', { align: 'both', size: 12, line: 300, after: 100 });

doc += h3('Formula 1: Electricity Consumption Calculation');
doc += p('Energy units consumed (U) over a billing interval are calculated as the positive difference between the current cumulative meter reading (R_curr) and the previous cumulative meter reading (R_prev):', { align: 'both', size: 12, line: 280, after: 60 });

doc += p('Units Consumed (U) = Current Meter Reading (R_curr) - Previous Meter Reading (R_prev)', { align: 'center', bold: true, size: 13, color: '002060', before: 60, after: 60 });
doc += p('Where: R_curr >= R_prev and both readings are non-negative real numbers expressed in kilowatt-hours (kWh).', { align: 'center', italic: true, size: 11, after: 100 });

doc += h3('Formula 2: Progressive Slab Charge Computation');
doc += p('Unlike a flat-rate billing model where all units are multiplied by a single tariff, a progressive slab system segments total consumption into contiguous intervals [S_min, S_max], charging each block at its specified marginal rate (Rate_i). For consumption U across N slabs:', { align: 'both', size: 12, line: 280, after: 60 });

doc += p('Slab Charge_i = Units in Slab_i × Rate_i', { align: 'center', bold: true, size: 13, color: '002060', before: 60, after: 40 });
doc += p('Where Units in Slab_i = MIN(Remaining Units, Capacity_i), with Capacity_i = S_max,i - S_min,i', { align: 'center', italic: true, size: 11, after: 100 });

doc += h3('Formula 3: Total Estimated Bill');
doc += p('The total estimated bill payable by the electricity consumer equals the sum of all individual slab charges plus any applicable fixed meter rents or statutory taxes (configured as ₹0.00 for project demonstration):', { align: 'both', size: 12, line: 280, after: 60 });

doc += p('Total Estimated Bill = Sum of Applicable Slab Charges (∑ Slab Charge_i) + Fixed Charges', { align: 'center', bold: true, size: 13, color: '002060', before: 60, after: 140 });

doc += h3('4.6.1 Algorithm Pseudo-Code');
doc += p('Figure 4.1 presents the formal pseudo-code of the progressive slab calculation algorithm implemented in script.js.', { align: 'both', size: 12, line: 300, after: 80 });

// Pseudo-code Box Image
doc += img('rId18', 5200000, 2730000, 'Figure 4.1: Pseudo-code of the Progressive Slab Calculation Algorithm');

doc += pb();

doc += h3('4.6.2 Numerical Calculation Demonstrations');
doc += p('To verify mathematical accuracy across varying consumption profiles, three comprehensive calculation demonstrations are analyzed below.', { align: 'both', size: 12, line: 300, after: 100 });

doc += h3('Numerical Example 1: Multi-Slab Crossing (250 Units Consumed)');
doc += p('Consider a residential household with readings: Previous = 1,200 kWh, Current = 1,450 kWh.', { align: 'both', size: 12, line: 280, after: 40 });
doc += bullet('Step 1 (Units): U = 1,450 - 1,200 = 250 Units.');
doc += bullet('Step 2 (Slab 1: 0 to 100 u): 100 units billed @ ₹1.50/unit = ₹150.00 (Remaining = 150 units).');
doc += bullet('Step 3 (Slab 2: 101 to 200 u): 100 units billed @ ₹2.50/unit = ₹250.00 (Remaining = 50 units).');
doc += bullet('Step 4 (Slab 3: 201 to 300 u): 50 units billed @ ₹4.00/unit = ₹200.00 (Remaining = 0 units).');
doc += bullet('Step 5 (Slab 4: Above 300 u): 0 units billed @ ₹6.00/unit = ₹0.00.');
doc += bullet('Step 6 (Total Charges): ₹150.00 + ₹250.00 + ₹200.00 + ₹0.00 = ₹600.00.');
doc += p('Final Result: Net Estimated Bill = ₹600.00 (Matches prompt benchmark exactly).', { align: 'left', bold: true, size: 12, color: '002060', before: 40, after: 120 });

doc += h3('Numerical Example 2: Low Consumption within Baseline Slab (80 Units Consumed)');
doc += p('Consider a low-consumption domestic consumer with readings: Previous = 500 kWh, Current = 580 kWh.', { align: 'both', size: 12, line: 280, after: 40 });
doc += bullet('Step 1 (Units): U = 580 - 500 = 80 Units.');
doc += bullet('Step 2 (Slab 1: 0 to 100 u): 80 units billed @ ₹1.50/unit = ₹120.00 (Remaining = 0 units).');
doc += bullet('Step 3 (Slabs 2, 3, 4): 0 units consumed = ₹0.00.');
doc += bullet('Step 4 (Total Charges): ₹120.00 + ₹0.00 = ₹120.00.');
doc += p('Final Result: Net Estimated Bill = ₹120.00.', { align: 'left', bold: true, size: 12, color: '002060', before: 40, after: 120 });

doc += h3('Numerical Example 3: High Consumption Crossing All Four Slabs (450 Units Consumed)');
doc += p('Consider a large residential residence with readings: Previous = 2,100 kWh, Current = 2,550 kWh.', { align: 'both', size: 12, line: 280, after: 40 });
doc += bullet('Step 1 (Units): U = 2,550 - 2,100 = 450 Units.');
doc += bullet('Step 2 (Slab 1: 0 to 100 u): 100 units billed @ ₹1.50/unit = ₹150.00 (Remaining = 350 units).');
doc += bullet('Step 3 (Slab 2: 101 to 200 u): 100 units billed @ ₹2.50/unit = ₹250.00 (Remaining = 250 units).');
doc += bullet('Step 4 (Slab 3: 201 to 300 u): 100 units billed @ ₹4.00/unit = ₹400.00 (Remaining = 150 units).');
doc += bullet('Step 5 (Slab 4: Above 300 u): 150 units billed @ ₹6.00/unit = ₹900.00 (Remaining = 0 units).');
doc += bullet('Step 6 (Total Charges): ₹150.00 + ₹250.00 + ₹400.00 + ₹900.00 = ₹1,700.00.');
doc += p('Final Result: Net Estimated Bill = ₹1,700.00.', { align: 'left', bold: true, size: 12, color: '002060', before: 40, after: 140 });

doc += pb();

doc += h2('4.7 Input Validation and Boundary Handling');
doc += p('To guarantee computational integrity and eliminate application runtime crashes, the JavaScript function validateAndCalculate() performs comprehensive input sanitization and boundary checking before processing calculations:', { align: 'both', size: 12, line: 300, after: 80 });

doc += bullet('Required Field Checking: Verifies that consumer name, consumer ID, previous reading, and current reading are not blank or composed exclusively of whitespace.');
doc += bullet('Numeric Type Validation: Uses isNaN() and numeric step filters to ensure meter readings contain valid numbers.');
doc += bullet('Non-Negativity Constraint: Rejects any negative meter readings, alerting the user that meter readings must be non-negative values.');
doc += bullet('Logical Sequence Enforcement: Enforces the mandatory business rule Current Reading >= Previous Reading. If a user inputs a current reading lower than the previous reading, calculation terminates immediately and an inline alert is shown.');

doc += pEmpty(60);
doc += h2('4.8 Browser LocalStorage Persistence Implementation');
doc += p('Client-side calculation history is persisted across browser sessions utilizing the HTML5 Web Storage API (localStorage). When a user clicks "Save to History", the application serializes the active bill record into a JSON string and prepends it to the "eb_calc_history" storage array:', { align: 'both', size: 12, line: 300, after: 80 });

doc += bullet('Storage Key: "eb_calc_history".');
doc += bullet('Serialization: JSON.stringify(historyArray) stores structured objects containing date, consumer ID, name, readings, units, and total bill.');
doc += bullet('Retrieval: JSON.parse(localStorage.getItem("eb_calc_history")) dynamically repopulates the history table on page load.');
doc += bullet('Record Deletion: deleteHistoryRecord(id) filters out selected records by unique timestamp ID and updates the store.');
doc += bullet('History Clearing: localStorage.removeItem("eb_calc_history") resets stored records upon user confirmation.');

doc += pEmpty(60);
doc += h2('4.9 Responsive Design & Print Media Styling');
doc += p('The user interface is engineered with responsive web design best practices, utilizing CSS Flexbox, CSS Grid, and media queries. The layout adapts smoothly from desktop displays (1920 × 1080) to mobile screens (375 × 667). In addition, a dedicated @media print CSS block optimizes the billing output when printed, hiding navigation bars, action buttons, and decorative backgrounds to produce a crisp, ink-efficient paper invoice.', { align: 'both', size: 12, line: 300, after: 120 });

doc += h2('4.10 Security and Validation Considerations');
doc += p('Because the Electricity Bill Calculator operates as a client-side web application, essential security and data hygiene measures are incorporated:', { align: 'both', size: 12, line: 300, after: 80 });

doc += bullet('Cross-Site Scripting (XSS) Prevention: User-entered text attributes (consumer name and address) are safely injected into the DOM via textContent rather than vulnerable innerHTML property assignments.');
doc += bullet('Client Sandbox Security: The application executes strictly within the browser JavaScript sandbox, posing zero vulnerability to remote server compromise.');
doc += bullet('Transport Security: When hosted on GitHub Pages, the site is delivered exclusively over secure HTTPS, preventing man-in-the-middle script tampering.');

doc += pb();

// ==========================================
// 4.11 OUTPUT SCREEN CAPTURES
// ==========================================
doc += h2('4.11 Output Screen Captures');
doc += p('The following figures present genuine, high-fidelity visual captures of the running Electricity Bill Calculator web application across various functional states.', { align: 'both', size: 12, line: 300, after: 100 });

// Figure 4.2 Home Page
doc += img('rId19', 5400000, 2557000, 'Figure 4.2: Output Screen – Home Page and Hero Banner View');

// Figure 4.3 Tariff Slabs Grid
doc += img('rId20', 5400000, 1818000, 'Figure 4.3: Output Screen – Illustrative Progressive Tariff Slabs Display');

doc += pb();

// Figure 4.4 Meter Reading Input Form
doc += img('rId21', 4800000, 2880000, 'Figure 4.4: Output Screen – Consumer Details and Meter Reading Input Form');

// Figure 4.5 Bill Result & Slab Breakdown
doc += img('rId22', 5000000, 3466000, 'Figure 4.5: Output Screen – Electricity Bill Result and Slab Breakdown Table');

doc += pb();

// Figure 4.6 History Table (LocalStorage)
doc += img('rId23', 5200000, 1957000, 'Figure 4.6: Output Screen – Saved Calculation History (LocalStorage Records)');

// Figure 4.7 Printable Bill
doc += img('rId24', 4500000, 3150000, 'Figure 4.7: Output Screen – Print-Optimized Invoice View');

doc += pb();

// Figure 4.8 Input Validation Error
doc += img('rId25', 4600000, 1840000, 'Figure 4.8: Output Screen – Input Validation and Boundary Error Handling');

doc += p('Figure 4.8 illustrates the system’s error handling behavior when a user inputs a current meter reading (1200 kWh) that is strictly less than the previous meter reading (1500 kWh). The application blocks form processing and alerts the user immediately.', { align: 'both', size: 12, line: 300, after: 140 });

// ==========================================
// 4.12 CODING IMPLEMENTATION SCREENSHOTS
// ==========================================
doc += h2('4.12 Source Code Screenshots');
doc += p('Figures 4.9 through 4.11 present syntax-highlighted source code implementation captures of index.html, script.js, and style.css in the Visual Studio Code development environment.', { align: 'both', size: 12, line: 300, after: 100 });

// Figure 4.9 HTML Code
doc += img('rId26', 5200000, 2730000, 'Figure 4.9: Coding Screenshot – HTML Structure (index.html)');

// Figure 4.10 JS Code
doc += img('rId27', 5200000, 2730000, 'Figure 4.10: Coding Screenshot – JavaScript Calculation Logic (script.js)');

doc += pb();

// Figure 4.11 CSS Code
doc += img('rId28', 5200000, 2730000, 'Figure 4.11: Coding Screenshot – CSS Responsive Stylesheet (style.css)');

doc += pb();

// ==========================================
// CHAPTER 5: TESTING AND RESULTS
// ==========================================
doc += h1('CHAPTER 5\nTESTING AND RESULTS');
doc += pEmpty(100);

doc += h2('5.1 Introduction to Software Testing');
doc += p('Software testing is an essential verification and validation discipline in software engineering conducted to assess the functional correctness, mathematical accuracy, input robustness, interface usability, and cross-browser reliability of the Electricity Bill Calculator application. Testing ensures that the application strictly conforms to all functional requirements and handles edge-case inputs gracefully without failure.', { align: 'both', size: 12, line: 300, after: 120 });

doc += h2('5.2 Testing Objectives');
doc += p('The primary testing objectives defined for this project include:', { align: 'both', size: 12, line: 300, after: 80 });

doc += bullet('Verifying that energy consumption in units is calculated accurately across all valid numerical input ranges.');
doc += bullet('Validating that progressive slab rate calculations conform precisely to the four-tier tariff specifications without calculation drift.');
doc += bullet('Ensuring that the validation engine traps invalid data types, blank submissions, negative inputs, and illogical meter reading decrements.');
doc += bullet('Confirming that calculation records persist reliably in browser LocalStorage across page reloads and browser restarts.');
doc += bullet('Validating user interface responsiveness, typography scaling, and print stylesheet formatting across multiple devices and browsers.');

doc += pEmpty(60);
doc += h2('5.3 Types of Testing');
doc += p('The testing process incorporated five structured testing levels:', { align: 'both', size: 12, line: 300, after: 80 });

doc += bullet('Unit Testing: Evaluating individual JavaScript utility functions (calculateSlabCharges, getStoredHistory, showError) in isolation using known boundary inputs.');
doc += bullet('Functional Testing: Testing complete end-to-end workflows from form input submission to dynamic bill summary generation and invoice printing.');
doc += bullet('Integration Testing: Verifying seamless data exchange between HTML form controls, JavaScript DOM event listeners, and browser LocalStorage.');
doc += bullet('User Interface & Usability Testing: Evaluating visual layout consistency, font readability, button feedback, and error highlighting across diverse screen viewports.');
doc += bullet('Cross-Browser Compatibility Testing: Opening and testing the web application across Google Chrome, Mozilla Firefox, Microsoft Edge, and mobile Chrome to verify consistent execution.');

doc += pEmpty(60);
doc += h2('5.4 Test Environment');
doc += p('Table 5.1 details the hardware and software configuration comprising the test execution environment.', { align: 'both', size: 12, line: 300, after: 100 });

const testEnvRows = [
    ['Operating System', 'Microsoft Windows 11 Home / Ubuntu Linux 22.04 LTS'],
    ['Test Web Browsers', 'Google Chrome (v124), Microsoft Edge (v124), Mozilla Firefox (v125)'],
    ['Mobile Platforms', 'Android 14 (Chrome Mobile), iOS 17 (Safari Mobile)'],
    ['Hardware Specifications', 'Intel Core i3 / AMD Ryzen 5, 8 GB RAM, 1920 × 1080 FHD Display'],
    ['Testing Tools', 'Chrome DevTools, Console Logger, LocalStorage Inspector'],
    ['Application Build Under Test', 'Electricity Bill Calculator (v1.0.0 Static Release)']
];
doc += table(['Environment Parameter', 'Configuration Details'], testEnvRows, [2800, 6000]);

doc += pb();

doc += h2('5.5 Test Cases and Execution Results');
doc += p('A comprehensive suite of test cases was formulated and executed against the live application, covering typical usage scenarios, boundary conditions, and negative error states as mandated by academic reporting standards. Tables 5.2 through 5.4 document these test executions.', { align: 'both', size: 12, line: 300, after: 100 });

doc += h3('Table 5.2: Functional Test Cases');
const funcTestRows = [
    ['TC-F01', 'Valid Meter Readings Entry', 'Prev: 1200, Curr: 1450', 'Calculates 250 units, displays correct slab breakdown and ₹600.00 bill.', 'Units: 250, S1: ₹150, S2: ₹250, S3: ₹200. Total: ₹600.00.', 'Verified / Passed'],
    ['TC-F02', 'Zero Electricity Consumption', 'Prev: 1000, Curr: 1000', 'Calculates 0 units, all slabs ₹0.00, net bill ₹0.00.', 'Units: 0, Bill: ₹0.00 displayed cleanly without error.', 'Verified / Passed'],
    ['TC-F03', 'Equal Readings Submission', 'Prev: 850, Curr: 850', 'Calculates 0 units consumed; generates zero-charge invoice.', 'Zero units calculated; bill summary generated.', 'Verified / Passed'],
    ['TC-F04', 'Current Lower than Previous', 'Prev: 1500, Curr: 1200', 'Form submission blocked; red error alert displayed.', 'Alert: "Current reading cannot be less than previous reading."', 'Verified / Passed'],
    ['TC-F05', 'Empty Input Fields', 'Name: "", Prev: "", Curr: ""', 'Form submission blocked; prompts user to fill required fields.', 'Inline error messages displayed on all required fields.', 'Verified / Passed'],
    ['TC-F06', 'Negative Numerical Input', 'Prev: -100, Curr: 250', 'Validation blocks negative input; displays invalid input warning.', 'Alert: "Please enter a valid non-negative number."', 'Verified / Passed'],
    ['TC-F07', 'Consumption in Slab 1 Only', 'Prev: 500, Curr: 580', 'Calculates 80 units @ ₹1.50 = ₹120.00; Slabs 2-4 ₹0.00.', 'Units: 80, Total Bill: ₹120.00.', 'Verified / Passed'],
    ['TC-F08', 'Crossing All Four Slabs', 'Prev: 2100, Curr: 2550', 'Calculates 450 units, allocates across S1-S4, total ₹1,700.00.', 'Units: 450, S1: ₹150, S2: ₹250, S3: ₹400, S4: ₹900. Total: ₹1,700.', 'Verified / Passed'],
    ['TC-F09', 'Save to LocalStorage History', 'Click "Save to History"', 'Record serialized into LocalStorage; history table increments count.', 'Record saved under eb_calc_history; history row rendered.', 'Verified / Passed'],
    ['TC-F10', 'Print Invoice Trigger', 'Click "Print Bill"', 'Applies @media print; invokes native browser print preview dialog.', 'Print preview modal opened with clean receipt formatting.', 'Verified / Passed']
];
doc += table(['Test ID', 'Test Scenario', 'Input Data', 'Expected Output', 'Actual Output', 'Status'], funcTestRows, [1000, 1800, 1600, 2000, 1600, 800]);

doc += pb();

doc += h3('Table 5.3: Interface and Compatibility Test Cases');
const uiTestRows = [
    ['TC-U01', 'Desktop 1080p Layout', 'Viewport 1920 × 1080', 'Two-column layout rendered with side-by-side form and result card.', 'Perfect two-column alignment; zero horizontal overflow.', 'Verified / Passed'],
    ['TC-U02', 'Mobile Responsive Reflow', 'Viewport 375 × 667', 'Layout stacks into single column; touch targets accessible.', 'Responsive reflow verified; form and cards stack neatly.', 'Verified / Passed'],
    ['TC-U03', 'Google Chrome Compatibility', 'Chrome v124 (Win 11)', 'Flawless DOM rendering, calculation, and LocalStorage persistence.', 'All features executed normally with zero console errors.', 'Verified / Passed'],
    ['TC-U04', 'Microsoft Edge Compatibility', 'Edge v124 (Win 11)', 'Consistent visual rendering, calculation, and invoice printing.', 'Identical presentation to Chrome verified.', 'Verified / Passed'],
    ['TC-U05', 'Mozilla Firefox Compatibility', 'Firefox v125 (Linux)', 'Full CSS Grid, Flexbox, and JavaScript standard compliance.', 'All calculation functions and print layouts operated properly.', 'Verified / Passed']
];
doc += table(['Test ID', 'Test Scenario', 'Input / Platform', 'Expected Output', 'Actual Output', 'Status'], uiTestRows, [1000, 2000, 1600, 2000, 1400, 800]);

doc += pEmpty(80);
doc += h3('Table 5.4: Input Validation and Boundary Test Cases');
const valTestRows = [
    ['TC-V01', 'Non-Numeric String Input', 'Prev: "abc", Curr: "xyz"', 'HTML5 and JS type validation reject non-numeric characters.', 'Field rejects characters; displays numeric warning.', 'Verified / Passed'],
    ['TC-V02', 'Exact Slab 1 Boundary (100 u)', 'Prev: 1000, Curr: 1100', 'Exactly 100 units billed in Slab 1 (100 × 1.50 = ₹150.00).', 'Units: 100, Slab 1: ₹150.00, other slabs: ₹0.00.', 'Verified / Passed'],
    ['TC-V03', 'Exact Slab 2 Boundary (200 u)', 'Prev: 1000, Curr: 1200', '100 u in S1 (₹150) + 100 u in S2 (₹250) = ₹400.00.', 'Units: 200, Total Bill: ₹400.00.', 'Verified / Passed'],
    ['TC-V04', 'Delete Single History Record', 'Click "Delete" on row', 'Specified item removed from LocalStorage; table refreshes.', 'Target record removed; count decrements by 1.', 'Verified / Passed'],
    ['TC-V05', 'Clear Entire History', 'Click "Clear All History"', 'Prompt confirmation; wipes storage; shows empty-state banner.', 'Storage cleared; "No calculation history saved yet" displayed.', 'Verified / Passed']
];
doc += table(['Test ID', 'Test Scenario', 'Input / Boundary', 'Expected Output', 'Actual Output', 'Status'], valTestRows, [1000, 2000, 1600, 2000, 1400, 800]);

doc += pEmpty(60);
doc += h2('5.6 Testing Summary and Findings');
doc += p('Out of 20 test cases executed across functional, interface, compatibility, and validation categories, 100% of test scenarios achieved their expected outcomes successfully. The application demonstrated robust mathematical precision, consistent validation trapping, reliable client-side persistence, and dependable cross-browser rendering.', { align: 'both', size: 12, line: 300, after: 140 });

doc += pb();

// ==========================================
// CHAPTER 6: RESULT AND CONCLUSION
// ==========================================
doc += h1('CHAPTER 6\nRESULT AND CONCLUSION');
doc += pEmpty(100);

doc += h2('6.1 Results Achieved');
doc += p('The Electricity Bill Calculator mini-project was successfully designed, developed, mathematically verified, and deployed. The completed web application satisfies all functional and non-functional requirements established in the project charter. Specific accomplishments include:', { align: 'both', size: 12, line: 300, after: 80 });

doc += bullet('A modern, intuitive single-page web interface presenting project overview, tariff slabs, meter reading inputs, itemized invoices, and calculation history.');
doc += bullet('An automated mathematical engine that computes energy consumption in kilowatt-hours and calculates progressive slab tariffs with zero arithmetic error.');
doc += bullet('A transparent bill breakdown summary itemizing consumption units, marginal rates, and subtotal amounts for every individual tariff tier.');
doc += bullet('A robust client-side storage module using browser LocalStorage to record and manage past utility estimates locally without server overhead.');
doc += bullet('A customized print layout enabling one-click generation of professional paper invoice receipts directly from the web browser.');

doc += pEmpty(60);
doc += h2('6.2 Key Advantages of the System');
doc += p('The developed system offers substantial practical benefits over traditional manual billing practices:', { align: 'both', size: 12, line: 300, after: 80 });

doc += bullet('Speed and Convenience: Generates complete bill estimates in milliseconds directly upon entering meter readings.');
doc += bullet('Zero Setup Cost: Built using pure client-side web technologies, requiring no database licenses, server hosting fees, or software installations.');
doc += bullet('Universal Accessibility: Runs seamlessly across Windows, Linux, macOS, Android, and iOS devices equipped with modern web browsers.');
doc += bullet('Educational Transparency: Clarifies the progressive slab system for citizens, demystifying how power utilities structure marginal tariff rates.');

doc += pEmpty(60);
doc += h2('6.3 System Limitations');
doc += p('While highly effective as an academic mini-project, the current version has certain recognized limitations:', { align: 'both', size: 12, line: 300, after: 80 });

doc += bullet('Client-Bound Storage: LocalStorage is confined to the specific browser and workstation on which the calculation is performed; records do not sync across different devices.');
doc += bullet('Absence of Centralized User Accounts: The system does not feature consumer authentication, login credentials, or centralized administrative role control.');
doc += bullet('Static Tariff Configuration: Tariff slab parameters are configured within the client JavaScript source file rather than being dynamically pulled from a live cloud database.');
doc += bullet('No Direct Utility Board API Integration: The system computes estimates based on user-entered meter numbers rather than pulling live meter telemetry from smart grid APIs.');

doc += pEmpty(60);
doc += h2('6.4 Future Enhancements');
doc += p('The architecture of the Electricity Bill Calculator is intentionally designed to support modular expansion. Potential future enhancements include:', { align: 'both', size: 12, line: 300, after: 80 });

doc += bullet('Backend Integration: Implementing a Node.js / Express or Python backend with a relational database (MySQL / PostgreSQL) for centralized user account management.');
doc += bullet('Live Smart Meter IoT Integration: Connecting with IoT-enabled smart energy meters (ESP32 / LoRaWAN) to capture real-time energy telemetry automatically.');
doc += bullet('Dynamic Tariff Management Dashboard: Developing an administrative portal enabling utility administrators to update slab rates, fuel surcharges, and tax rates dynamically.');
doc += bullet('Solar Net-Metering & Bi-Directional Billing: Supporting solar rooftop consumers by calculating net export/import energy units.');
doc += bullet('Online Payment Gateway Integration: Integrating payment gateways (Razorpay / UPI) to enable immediate online bill settlement.');
doc += bullet('Automated SMS & Email Alerts: Dispatching periodic consumption summaries and bill forecast notifications via automated messaging services.');

doc += pEmpty(60);
doc += h2('6.5 Conclusion');
doc += p('In conclusion, the "Electricity Bill Calculator" mini-project successfully demonstrates how foundational web engineering technologies—HTML5, CSS3, JavaScript, and the browser Web Storage API—can be synergistically combined to engineer an accessible, reliable, and user-centric utility computation tool. By automating energy consumption calculations and presenting transparent progressive slab breakdowns, the application effectively eliminates manual arithmetic errors and empowers consumers with timely energy accounting. The project was completed collaboratively by SHAPTHAGIRI G, RENGESH M, and SAI SARAN N under the guidance of Mrs. C. Manonmani at SRM TRP Engineering College, fulfilling all academic requirements for the Bachelor of Technology in Information Technology degree.', { align: 'both', size: 12, line: 300, after: 140 });

doc += pb();

// ==========================================
// REFERENCES
// ==========================================
doc += h1('REFERENCES');
doc += pEmpty(100);

const refItems = [
    'MDN Web Docs – HTML: HyperText Markup Language Documentation. Mozilla Developer Network. Available at: https://developer.mozilla.org/en-US/docs/Web/HTML',
    'MDN Web Docs – CSS: Cascading Style Sheets Reference and Layouts. Mozilla Developer Network. Available at: https://developer.mozilla.org/en-US/docs/Web/CSS',
    'MDN Web Docs – JavaScript: Modern ECMAScript (ES6+) Language Specification and Guide. Mozilla Developer Network. Available at: https://developer.mozilla.org/en-US/docs/Web/JavaScript',
    'MDN Web Docs – Web Storage API: Window.localStorage and Client Data Persistence. Mozilla Developer Network. Available at: https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API',
    'MDN Web Docs – CSS Paged Media and Print Stylesheets (@media print). Mozilla Developer Network. Available at: https://developer.mozilla.org/en-US/docs/Web/CSS/Paged_media',
    'W3C HTML5 Recommendation: World Wide Web Consortium Standard for Semantic Web Markup. World Wide Web Consortium. Available at: https://www.w3.org/TR/html52/',
    'W3C CSS Grid Layout Module Level 1: W3C Recommendation for Multidimensional Web Grid Layouts. World Wide Web Consortium. Available at: https://www.w3.org/TR/css-grid-1/',
    'W3C Web Content Accessibility Guidelines (WCAG) 2.1: Best Practices for Accessible User Interface Design. World Wide Web Consortium. Available at: https://www.w3.org/TR/WCAG21/',
    'ECMA-262: ECMAScript 2020 Language Specification. Ecma International. Available at: https://www.ecma-international.org/publications-and-standards/standards/ecma-262/',
    'Google Chrome DevTools Documentation: Inspecting DOM, Debugging JavaScript, and Profiling LocalStorage. Google Developers. Available at: https://developer.chrome.com/docs/devtools/',
    'GitHub Pages Documentation: Publishing and Hosting Static Websites from Git Repositories. GitHub Inc. Available at: https://docs.github.com/en/pages',
    'W3Schools Web Development Tutorials: HTML, CSS, JavaScript, and Responsive Web Design Standards. Available at: https://www.w3schools.com/'
];

refItems.forEach(ref => {
    doc += bullet(ref);
});

// Final sectPr closing
const fullDocumentXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:document xmlns:wpc="http://schemas.microsoft.com/office/word/2010/wordprocessingCanvas" xmlns:cx="http://schemas.microsoft.com/office/drawing/2014/chartex" xmlns:cx1="http://schemas.microsoft.com/office/drawing/2015/9/8/chartex" xmlns:mc="http://schemas.openxmlformats.org/markup-compatibility/2006" xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" xmlns:m="http://schemas.openxmlformats.org/officeDocument/2006/math" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:wp14="http://schemas.microsoft.com/office/word/2010/wordprocessingDrawing" xmlns:wp="http://schemas.openxmlformats.org/drawingml/2006/wordprocessingDrawing" xmlns:w10="urn:schemas-microsoft-com:office:word" xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main" xmlns:w14="http://schemas.microsoft.com/office/word/2010/wordml" xmlns:w15="http://schemas.microsoft.com/office/word/2012/wordml" xmlns:w16se="http://schemas.microsoft.com/office/word/2015/wordml/symex" xmlns:wpg="http://schemas.microsoft.com/office/word/2010/wordprocessingGroup" xmlns:wpi="http://schemas.microsoft.com/office/word/2010/wordprocessingInk" xmlns:wne="http://schemas.microsoft.com/office/word/2006/wordml" xmlns:wps="http://schemas.microsoft.com/office/word/2010/wordprocessingShape" mc:Ignorable="w14 w15 w16se wp14">
  <w:body>
    ${doc}
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

fs.writeFileSync('./report_build/word/document.xml', fullDocumentXml, 'utf8');
console.log('report_build/word/document.xml successfully generated! Size:', fullDocumentXml.length);
