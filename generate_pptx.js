/**
 * Professional PowerPoint Presentation Generator (.pptx)
 * Project: ELECTRICITY BILL CALCULATOR
 * Department of Information Technology, SRM TRP Engineering College
 * Generates an 8-Slide OpenXML PresentationML (.pptx) file.
 * Strictly compliant with ECMA-376 / ISO-29500 standards.
 */

const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

const buildDir = path.resolve(__dirname, 'pptx_build');

// Clean and recreate directory structure
if (fs.existsSync(buildDir)) {
    fs.rmSync(buildDir, { recursive: true, force: true });
}

fs.mkdirSync(path.join(buildDir, '_rels'), { recursive: true });
fs.mkdirSync(path.join(buildDir, 'docProps'), { recursive: true });
fs.mkdirSync(path.join(buildDir, 'ppt/_rels'), { recursive: true });
fs.mkdirSync(path.join(buildDir, 'ppt/slides/_rels'), { recursive: true });
fs.mkdirSync(path.join(buildDir, 'ppt/slideLayouts/_rels'), { recursive: true });
fs.mkdirSync(path.join(buildDir, 'ppt/slideMasters/_rels'), { recursive: true });
fs.mkdirSync(path.join(buildDir, 'ppt/theme'), { recursive: true });
fs.mkdirSync(path.join(buildDir, 'ppt/media'), { recursive: true });

// Copy media assets
const mediaSrc = path.resolve(__dirname, 'report_images');
const logoSrc = path.resolve(__dirname, 'template_extracted/word/media/image1.png');

if (fs.existsSync(logoSrc)) {
    fs.copyFileSync(logoSrc, path.join(buildDir, 'ppt/media/logo.png'));
}

const imagesToCopy = [
    'fig3_1_architecture.png',
    'fig3_2_usecase.png',
    'fig3_3_dfd0.png',
    'fig3_4_dfd1.png',
    'fig3_5_workflow.png',
    'fig4_2_homepage.png',
    'fig4_3_tariffs.png',
    'fig4_4_calculator_form.png',
    'fig4_5_bill_result.png',
    'fig4_6_history.png',
    'fig4_7_printable_bill.png',
    'fig4_8_validation_error.png'
];

for (let img of imagesToCopy) {
    const s = path.join(mediaSrc, img);
    if (fs.existsSync(s)) {
        fs.copyFileSync(s, path.join(buildDir, 'ppt/media', img));
    }
}
console.log('Media assets successfully prepared.');

// 1. [Content_Types].xml
const contentTypesXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
  <Default Extension="png" ContentType="image/png"/>
  <Default Extension="jpeg" ContentType="image/jpeg"/>
  <Default Extension="jpg" ContentType="image/jpeg"/>
  <Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
  <Default Extension="xml" ContentType="application/xml"/>
  <Override PartName="/ppt/presentation.xml" ContentType="application/vnd.openxmlformats-officedocument.presentationml.presentation.main+xml"/>
  <Override PartName="/ppt/presProps.xml" ContentType="application/vnd.openxmlformats-officedocument.presentationml.presProps+xml"/>
  <Override PartName="/ppt/viewProps.xml" ContentType="application/vnd.openxmlformats-officedocument.presentationml.viewProps+xml"/>
  <Override PartName="/ppt/tableStyles.xml" ContentType="application/vnd.openxmlformats-officedocument.presentationml.tableStyles+xml"/>
  <Override PartName="/ppt/slideMasters/slideMaster1.xml" ContentType="application/vnd.openxmlformats-officedocument.presentationml.slideMaster+xml"/>
  <Override PartName="/ppt/slideLayouts/slideLayout1.xml" ContentType="application/vnd.openxmlformats-officedocument.presentationml.slideLayout+xml"/>
  <Override PartName="/ppt/theme/theme1.xml" ContentType="application/vnd.openxmlformats-officedocument.theme+xml"/>
  <Override PartName="/ppt/slides/slide1.xml" ContentType="application/vnd.openxmlformats-officedocument.presentationml.slide+xml"/>
  <Override PartName="/ppt/slides/slide2.xml" ContentType="application/vnd.openxmlformats-officedocument.presentationml.slide+xml"/>
  <Override PartName="/ppt/slides/slide3.xml" ContentType="application/vnd.openxmlformats-officedocument.presentationml.slide+xml"/>
  <Override PartName="/ppt/slides/slide4.xml" ContentType="application/vnd.openxmlformats-officedocument.presentationml.slide+xml"/>
  <Override PartName="/ppt/slides/slide5.xml" ContentType="application/vnd.openxmlformats-officedocument.presentationml.slide+xml"/>
  <Override PartName="/ppt/slides/slide6.xml" ContentType="application/vnd.openxmlformats-officedocument.presentationml.slide+xml"/>
  <Override PartName="/ppt/slides/slide7.xml" ContentType="application/vnd.openxmlformats-officedocument.presentationml.slide+xml"/>
  <Override PartName="/ppt/slides/slide8.xml" ContentType="application/vnd.openxmlformats-officedocument.presentationml.slide+xml"/>
  <Override PartName="/docProps/core.xml" ContentType="application/vnd.openxmlformats-package.core-properties+xml"/>
  <Override PartName="/docProps/app.xml" ContentType="application/vnd.openxmlformats-officedocument.extended-properties+xml"/>
</Types>`;
fs.writeFileSync(path.join(buildDir, '[Content_Types].xml'), contentTypesXml);

// 2. _rels/.rels
const rootRelsXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="ppt/presentation.xml"/>
  <Relationship Id="rId2" Type="http://schemas.openxmlformats.org/package/2006/relationships/metadata/core-properties" Target="docProps/core.xml"/>
  <Relationship Id="rId3" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/extended-properties" Target="docProps/app.xml"/>
</Relationships>`;
fs.writeFileSync(path.join(buildDir, '_rels/.rels'), rootRelsXml);

// 3. docProps/core.xml
const coreXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<cp:coreProperties xmlns:cp="http://schemas.openxmlformats.org/package/2006/metadata/core-properties" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:dcterms="http://purl.org/dc/terms/" xmlns:dcmitype="http://purl.org/dc/dcmitype/" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
  <dc:title>ELECTRICITY BILL CALCULATOR - Mini Project Presentation</dc:title>
  <dc:subject>Web Technology Mini Project Presentation (IT25301)</dc:subject>
  <dc:creator>Shapthagiri G, Rengesh M, Sai Saran N</dc:creator>
  <cp:lastModifiedBy>Shapthagiri G</cp:lastModifiedBy>
  <dcterms:created xsi:type="dcterms:W3CDTF">2026-11-09T18:00:00Z</dcterms:created>
  <dcterms:modified xsi:type="dcterms:W3CDTF">2026-11-09T18:00:00Z</dcterms:modified>
</cp:coreProperties>`;
fs.writeFileSync(path.join(buildDir, 'docProps/core.xml'), coreXml);

// 4. docProps/app.xml
const appXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Properties xmlns="http://schemas.openxmlformats.org/officeDocument/2006/extended-properties" xmlns:vt="http://schemas.openxmlformats.org/officeDocument/2006/docPropsVTypes">
  <TotalTime>0</TotalTime>
  <Words>0</Words>
  <Application>Microsoft Office PowerPoint</Application>
  <PresentationFormat>Widescreen</PresentationFormat>
  <Paragraphs>0</Paragraphs>
  <Slides>8</Slides>
  <Notes>0</Notes>
  <HiddenSlides>0</HiddenSlides>
  <MMClips>0</MMClips>
  <ScaleCrop>false</ScaleCrop>
  <Company>SRM TRP Engineering College</Company>
  <LinksUpToDate>false</LinksUpToDate>
  <SharedDoc>false</SharedDoc>
  <HyperlinksChanged>false</HyperlinksChanged>
  <AppVersion>16.0000</AppVersion>
</Properties>`;
fs.writeFileSync(path.join(buildDir, 'docProps/app.xml'), appXml);

// 5. ppt/presProps.xml
const presPropsXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<p:presentationPr xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" xmlns:p="http://schemas.openxmlformats.org/presentationml/2006/main"/>`;
fs.writeFileSync(path.join(buildDir, 'ppt/presProps.xml'), presPropsXml);

// 6. ppt/viewProps.xml
const viewPropsXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<p:viewPr xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" xmlns:p="http://schemas.openxmlformats.org/presentationml/2006/main">
  <p:normalViewPr>
    <p:restoredLeft sz="15620" autoAdjust="0"/>
    <p:restoredTop sz="94660" autoAdjust="0"/>
  </p:normalViewPr>
  <p:slideViewPr>
    <p:cSldViewPr>
      <p:cViewPr varScale="1">
        <p:scale>
          <a:sx n="100" d="100"/>
          <a:sy n="100" d="100"/>
        </p:scale>
        <p:origin x="0" y="0"/>
      </p:cViewPr>
      <p:guideLst/>
    </p:cSldViewPr>
  </p:slideViewPr>
</p:viewPr>`;
fs.writeFileSync(path.join(buildDir, 'ppt/viewProps.xml'), viewPropsXml);

// 7. ppt/tableStyles.xml
const tableStylesXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<a:tblStyleLst xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" def="{5C22544A-7EE6-4342-B048-85BDC9FD1C3A}"/>`;
fs.writeFileSync(path.join(buildDir, 'ppt/tableStyles.xml'), tableStylesXml);

// 8. ppt/presentation.xml
const presentationXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<p:presentation xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" xmlns:p="http://schemas.openxmlformats.org/presentationml/2006/main">
  <p:sldMasterIdLst>
    <p:sldMasterId id="2147483648" r:id="rId1"/>
  </p:sldMasterIdLst>
  <p:sldIdLst>
    <p:sldId id="256" r:id="rId2"/>
    <p:sldId id="257" r:id="rId3"/>
    <p:sldId id="258" r:id="rId4"/>
    <p:sldId id="259" r:id="rId5"/>
    <p:sldId id="260" r:id="rId6"/>
    <p:sldId id="261" r:id="rId7"/>
    <p:sldId id="262" r:id="rId8"/>
    <p:sldId id="263" r:id="rId9"/>
  </p:sldIdLst>
  <p:sldSz cx="12192000" cy="6858000" type="screen16x9"/>
  <p:notesSz cx="6858000" cy="9144000"/>
  <p:defaultTextStyle>
    <a:defPPr>
      <a:defRPr lang="en-US">
        <a:latin typeface="Segoe UI"/>
      </a:defRPr>
    </a:defPPr>
    <a:lvl1pPr marL="0" algn="l" defTabSz="914400">
      <a:defRPr sz="1400" kern="1200">
        <a:solidFill><a:schemeClr val="tx1"/></a:solidFill>
        <a:latin typeface="Segoe UI"/>
      </a:defRPr>
    </a:lvl1pPr>
  </p:defaultTextStyle>
</p:presentation>`;
fs.writeFileSync(path.join(buildDir, 'ppt/presentation.xml'), presentationXml);

// 9. ppt/_rels/presentation.xml.rels
const presRelsXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/slideMaster" Target="slideMasters/slideMaster1.xml"/>
  <Relationship Id="rId2" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/slide" Target="slides/slide1.xml"/>
  <Relationship Id="rId3" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/slide" Target="slides/slide2.xml"/>
  <Relationship Id="rId4" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/slide" Target="slides/slide3.xml"/>
  <Relationship Id="rId5" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/slide" Target="slides/slide4.xml"/>
  <Relationship Id="rId6" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/slide" Target="slides/slide5.xml"/>
  <Relationship Id="rId7" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/slide" Target="slides/slide6.xml"/>
  <Relationship Id="rId8" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/slide" Target="slides/slide7.xml"/>
  <Relationship Id="rId9" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/slide" Target="slides/slide8.xml"/>
  <Relationship Id="rId10" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/theme" Target="theme/theme1.xml"/>
  <Relationship Id="rId11" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/presProps" Target="presProps.xml"/>
  <Relationship Id="rId12" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/viewProps" Target="viewProps.xml"/>
  <Relationship Id="rId13" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/tableStyles" Target="tableStyles.xml"/>
</Relationships>`;
fs.writeFileSync(path.join(buildDir, 'ppt/_rels/presentation.xml.rels'), presRelsXml);

// 10. ppt/slideMasters/slideMaster1.xml
const slideMasterXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<p:sldMaster xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" xmlns:p="http://schemas.openxmlformats.org/presentationml/2006/main">
  <p:cSld>
    <p:spTree>
      <p:nvGrpSpPr>
        <p:cNvPr id="1" name=""/>
        <p:cNvGrpSpPr/>
        <p:nvPr/>
      </p:nvGrpSpPr>
      <p:grpSpPr>
        <a:xfrm>
          <a:off x="0" y="0"/>
          <a:ext cx="0" cy="0"/>
          <a:chOff x="0" y="0"/>
          <a:chExt cx="0" cy="0"/>
        </a:xfrm>
      </p:grpSpPr>
    </p:spTree>
  </p:cSld>
  <p:clrMap bg1="lt1" tx1="dk1" bg2="lt2" tx2="dk2" accent1="accent1" accent2="accent2" accent3="accent3" accent4="accent4" accent5="accent5" accent6="accent6" hlink="hlink" folHlink="folHlink"/>
  <p:sldLayoutIdLst>
    <p:sldLayoutId id="2147483649" r:id="rId1"/>
  </p:sldLayoutIdLst>
  <p:txStyles>
    <p:titleStyle>
      <a:lvl1pPr algn="ctr" defTabSz="914400">
        <a:defRPr sz="4000" kern="1200">
          <a:solidFill><a:schemeClr val="tx1"/></a:solidFill>
          <a:latin typeface="Segoe UI"/>
        </a:defRPr>
      </a:lvl1pPr>
    </p:titleStyle>
    <p:bodyStyle>
      <a:lvl1pPr marL="288000" indent="-288000" defTabSz="914400">
        <a:buFont typeface="Arial"/>
        <a:buChar char="•"/>
        <a:defRPr sz="1800" kern="1200">
          <a:solidFill><a:schemeClr val="tx1"/></a:solidFill>
          <a:latin typeface="Segoe UI"/>
        </a:defRPr>
      </a:lvl1pPr>
    </p:bodyStyle>
    <p:otherStyle>
      <a:defPPr>
        <a:defRPr lang="en-US">
          <a:latin typeface="Segoe UI"/>
        </a:defRPr>
      </a:defPPr>
    </p:otherStyle>
  </p:txStyles>
</p:sldMaster>`;
fs.writeFileSync(path.join(buildDir, 'ppt/slideMasters/slideMaster1.xml'), slideMasterXml);

// 11. ppt/slideMasters/_rels/slideMaster1.xml.rels
const slideMasterRelsXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/slideLayout" Target="../slideLayouts/slideLayout1.xml"/>
  <Relationship Id="rId2" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/theme" Target="../theme/theme1.xml"/>
</Relationships>`;
fs.writeFileSync(path.join(buildDir, 'ppt/slideMasters/_rels/slideMaster1.xml.rels'), slideMasterRelsXml);

// 12. ppt/slideLayouts/slideLayout1.xml
const slideLayoutXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<p:sldLayout xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" xmlns:p="http://schemas.openxmlformats.org/presentationml/2006/main" type="blank" preserve="1">
  <p:cSld name="Blank">
    <p:spTree>
      <p:nvGrpSpPr>
        <p:cNvPr id="1" name=""/>
        <p:cNvGrpSpPr/>
        <p:nvPr/>
      </p:nvGrpSpPr>
      <p:grpSpPr>
        <a:xfrm>
          <a:off x="0" y="0"/>
          <a:ext cx="0" cy="0"/>
          <a:chOff x="0" y="0"/>
          <a:chExt cx="0" cy="0"/>
        </a:xfrm>
      </p:grpSpPr>
    </p:spTree>
  </p:cSld>
  <p:clrMapOvr><a:masterClrMapping/></p:clrMapOvr>
</p:sldLayout>`;
fs.writeFileSync(path.join(buildDir, 'ppt/slideLayouts/slideLayout1.xml'), slideLayoutXml);

// 13. ppt/slideLayouts/_rels/slideLayout1.xml.rels
const slideLayoutRelsXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/slideMaster" Target="../slideMasters/slideMaster1.xml"/>
</Relationships>`;
fs.writeFileSync(path.join(buildDir, 'ppt/slideLayouts/_rels/slideLayout1.xml.rels'), slideLayoutRelsXml);

// 14. ppt/theme/theme1.xml
const themeXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<a:theme xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" name="Office Theme">
  <a:themeElements>
    <a:clrScheme name="Office">
      <a:dk1><a:sysClr val="windowText" lastClr="000000"/></a:dk1>
      <a:lt1><a:sysClr val="window" lastClr="FFFFFF"/></a:lt1>
      <a:dk2><a:srgbClr val="0F2C59"/></a:dk2>
      <a:lt2><a:srgbClr val="F8FAFC"/></a:lt2>
      <a:accent1><a:srgbClr val="0F2C59"/></a:accent1>
      <a:accent2><a:srgbClr val="0066CC"/></a:accent2>
      <a:accent3><a:srgbClr val="F59E0B"/></a:accent3>
      <a:accent4><a:srgbClr val="10B981"/></a:accent4>
      <a:accent5><a:srgbClr val="6366F1"/></a:accent5>
      <a:accent6><a:srgbClr val="EF4444"/></a:accent6>
      <a:hlink><a:srgbClr val="0066CC"/></a:hlink>
      <a:folHlink><a:srgbClr val="850066"/></a:folHlink>
    </a:clrScheme>
    <a:fontScheme name="Office">
      <a:majorFont>
        <a:latin typeface="Segoe UI"/>
        <a:ea typeface=""/>
        <a:cs typeface=""/>
      </a:majorFont>
      <a:minorFont>
        <a:latin typeface="Segoe UI"/>
        <a:ea typeface=""/>
        <a:cs typeface=""/>
      </a:minorFont>
    </a:fontScheme>
    <a:fmtScheme name="Office">
      <a:fillStyleLst>
        <a:solidFill><a:schemeClr val="phClr"/></a:solidFill>
        <a:gradFill rotWithShape="1">
          <a:gsLst>
            <a:gs pos="0"><a:schemeClr val="phClr"><a:tint val="50000"/><a:satMod val="300000"/></a:schemeClr></a:gs>
            <a:gs pos="100000"><a:schemeClr val="phClr"><a:shade val="37000"/><a:satMod val="300000"/></a:schemeClr></a:gs>
          </a:gsLst>
          <a:lin ang="16200000" scaled="1"/>
        </a:gradFill>
        <a:gradFill rotWithShape="1">
          <a:gsLst>
            <a:gs pos="0"><a:schemeClr val="phClr"><a:tint val="100000"/><a:shade val="100000"/><a:satMod val="130000"/></a:schemeClr></a:gs>
            <a:gs pos="100000"><a:schemeClr val="phClr"><a:tint val="50000"/><a:shade val="100000"/><a:satMod val="350000"/></a:schemeClr></a:gs>
          </a:gsLst>
          <a:lin ang="16200000" scaled="0"/>
        </a:gradFill>
      </a:fillStyleLst>
      <a:lnStyleLst>
        <a:ln w="9525" cap="flat" cmpd="s" algn="ctr"><a:solidFill><a:schemeClr val="phClr"/></a:solidFill><a:prstDash val="solid"/></a:ln>
        <a:ln w="25400" cap="flat" cmpd="s" algn="ctr"><a:solidFill><a:schemeClr val="phClr"/></a:solidFill><a:prstDash val="solid"/></a:ln>
        <a:ln w="38100" cap="flat" cmpd="s" algn="ctr"><a:solidFill><a:schemeClr val="phClr"/></a:solidFill><a:prstDash val="solid"/></a:ln>
      </a:lnStyleLst>
      <a:effectStyleLst>
        <a:effectStyle><a:effectLst/></a:effectStyle>
        <a:effectStyle><a:effectLst/></a:effectStyle>
        <a:effectStyle><a:effectLst/></a:effectStyle>
      </a:effectStyleLst>
      <a:bgFillStyleLst>
        <a:solidFill><a:schemeClr val="phClr"/></a:solidFill>
        <a:solidFill><a:schemeClr val="phClr"><a:tint val="95000"/><a:satMod val="170000"/></a:schemeClr></a:solidFill>
        <a:gradFill rotWithShape="1">
          <a:gsLst>
            <a:gs pos="0"><a:schemeClr val="phClr"><a:tint val="93000"/><a:satMod val="150000"/></a:schemeClr></a:gs>
            <a:gs pos="100000"><a:schemeClr val="phClr"><a:shade val="98000"/><a:satMod val="130000"/></a:schemeClr></a:gs>
          </a:gsLst>
          <a:lin ang="16200000" scaled="0"/>
        </a:gradFill>
      </a:bgFillStyleLst>
    </a:fmtScheme>
  </a:themeElements>
</a:theme>`;
fs.writeFileSync(path.join(buildDir, 'ppt/theme/theme1.xml'), themeXml);

// Helper functions for Slide OpenXML Generation
let shapeCounter = 2;
function getNextId() {
    return shapeCounter++;
}

function escapeXml(str) {
    if (!str) return '';
    return str.toString()
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&apos;');
}

function makeCard(x, y, cx, cy, fillHex, strokeHex, strokeWidth, cornerRadius) {
    const id = getNextId();
    let geom = cornerRadius ? `
      <a:prstGeom prst="roundRect">
        <a:avLst><a:gd name="adj" fmla="val ${cornerRadius}"/></a:avLst>
      </a:prstGeom>` : `
      <a:prstGeom prst="rect"><a:avLst/></a:prstGeom>`;
    
    let fill = fillHex ? `<a:solidFill><a:srgbClr val="${fillHex}"/></a:solidFill>` : '<a:noFill/>';
    let stroke = strokeHex ? `
      <a:ln w="${strokeWidth || 12700}">
        <a:solidFill><a:srgbClr val="${strokeHex}"/></a:solidFill>
      </a:ln>` : '<a:ln><a:noFill/></a:ln>';

    return `
      <p:sp>
        <p:nvSpPr>
          <p:cNvPr id="${id}" name="Card_${id}"/>
          <p:cNvSpPr/>
          <p:nvPr/>
        </p:nvSpPr>
        <p:spPr>
          <a:xfrm>
            <a:off x="${x}" y="${y}"/>
            <a:ext cx="${cx}" cy="${cy}"/>
          </a:xfrm>
          ${geom}
          ${fill}
          ${stroke}
        </p:spPr>
        <p:txBody>
          <a:bodyPr rtlCol="0" anchor="t" tIns="0" bIns="0" lIns="0" rIns="0"/>
          <a:lstStyle/>
          <a:p><a:endParaRPr lang="en-US"/></a:p>
        </p:txBody>
      </p:sp>`;
}

function makeTextBox(x, y, cx, cy, paras, opts = {}) {
    const id = getNextId();
    const padT = opts.padT !== undefined ? opts.padT : 40000;
    const padB = opts.padB !== undefined ? opts.padB : 40000;
    const padL = opts.padL !== undefined ? opts.padL : 40000;
    const padR = opts.padR !== undefined ? opts.padR : 40000;
    const anchor = opts.anchor || 't';

    let bgFill = opts.bgHex ? `<a:solidFill><a:srgbClr val="${opts.bgHex}"/></a:solidFill>` : '<a:noFill/>';
    let border = opts.borderHex ? `<a:ln w="${opts.borderWidth || 12700}"><a:solidFill><a:srgbClr val="${opts.borderHex}"/></a:solidFill></a:ln>` : '<a:ln><a:noFill/></a:ln>';
    let geom = opts.radius ? `<a:prstGeom prst="roundRect"><a:avLst><a:gd name="adj" fmla="val ${opts.radius}"/></a:avLst></a:prstGeom>` : '<a:prstGeom prst="rect"><a:avLst/></a:prstGeom>';

    let pXml = paras.map(p => {
        let algn = p.align || 'l';
        let pPrAttrs = [`algn="${algn}"`];
        if (p.bullet) {
            pPrAttrs.push('marL="288000" indent="-288000"');
        }

        // Strictly comply with ECMA-376 drawingml CT_TextParagraphProperties sequence:
        // 1. spcBef, 2. spcAft, 3. buFont, 4. buChar
        let pPrChildren = [];
        if (p.spaceBefore) {
            pPrChildren.push(`<a:spcBef><a:spcPts val="${Math.round(p.spaceBefore * 100)}"/></a:spcBef>`);
        }
        if (p.spaceAfter) {
            pPrChildren.push(`<a:spcAft><a:spcPts val="${Math.round(p.spaceAfter * 100)}"/></a:spcAft>`);
        }
        if (p.bullet) {
            pPrChildren.push('<a:buFont typeface="Arial"/>');
            pPrChildren.push('<a:buChar char="•"/>');
        }

        let pPrXml = pPrChildren.length > 0 || p.bullet ? `
          <a:pPr ${pPrAttrs.join(' ')}>
            ${pPrChildren.join('\n            ')}
          </a:pPr>` : `
          <a:pPr ${pPrAttrs.join(' ')}/>`;

        let runsXml = (p.runs || []).map(r => {
            let b = r.bold ? ' b="1"' : '';
            let i = r.italic ? ' i="1"' : '';
            let sz = r.size ? ` sz="${Math.round(r.size * 100)}"` : ' sz="1400"';
            let clr = r.color ? `<a:solidFill><a:srgbClr val="${r.color}"/></a:solidFill>` : '<a:solidFill><a:srgbClr val="1E293B"/></a:solidFill>';
            let font = `<a:latin typeface="${r.font || 'Segoe UI'}"/>`;
            return `<a:r><a:rPr lang="en-US"${sz}${b}${i}>${clr}${font}</a:rPr><a:t>${escapeXml(r.text)}</a:t></a:r>`;
        }).join('');

        return `
          <a:p>
            ${pPrXml}
            ${runsXml}
            <a:endParaRPr lang="en-US"/>
          </a:p>`;
    }).join('');

    return `
      <p:sp>
        <p:nvSpPr>
          <p:cNvPr id="${id}" name="TextBox_${id}"/>
          <p:cNvSpPr/>
          <p:nvPr/>
        </p:nvSpPr>
        <p:spPr>
          <a:xfrm>
            <a:off x="${x}" y="${y}"/>
            <a:ext cx="${cx}" cy="${cy}"/>
          </a:xfrm>
          ${geom}
          ${bgFill}
          ${border}
        </p:spPr>
        <p:txBody>
          <a:bodyPr rtlCol="0" anchor="${anchor}" tIns="${padT}" bIns="${padB}" lIns="${padL}" rIns="${padR}"/>
          <a:lstStyle/>
          ${pXml}
        </p:txBody>
      </p:sp>`;
}

function makePicture(x, y, cx, cy, rId, borderHex, borderWidth) {
    const id = getNextId();
    let stroke = borderHex ? `
      <a:ln w="${borderWidth || 19050}">
        <a:solidFill><a:srgbClr val="${borderHex}"/></a:solidFill>
      </a:ln>` : '<a:ln><a:noFill/></a:ln>';

    return `
      <p:pic>
        <p:nvPicPr>
          <p:cNvPr id="${id}" name="Picture_${id}"/>
          <p:cNvPicPr><a:picLocks noChangeAspect="1"/></p:cNvPicPr>
          <p:nvPr/>
        </p:nvPicPr>
        <p:blipFill>
          <a:blip r:embed="${rId}"/>
          <a:stretch><a:fillRect/></a:stretch>
        </p:blipFill>
        <p:spPr>
          <a:xfrm>
            <a:off x="${x}" y="${y}"/>
            <a:ext cx="${cx}" cy="${cy}"/>
          </a:xfrm>
          <a:prstGeom prst="rect"><a:avLst/></a:prstGeom>
          ${stroke}
        </p:spPr>
      </p:pic>`;
}

function makeStandardSlideHeader(title, subtitle, tagText, slideNum) {
    let elements = [];
    // Category Tag Badge
    elements.push(makeTextBox(600000, 360000, 5000000, 300000, [
        {
            runs: [
                { text: (tagText || 'WEB TECHNOLOGY MINI-PROJECT').toUpperCase(), bold: true, size: 9.5, color: '0066CC' },
                { text: '  |  SRM TRP ENGINEERING COLLEGE', bold: false, size: 9.5, color: '64748B' }
            ]
        }
    ], { padT: 0, padB: 0, padL: 0, padR: 0 }));

    // Main Slide Title
    elements.push(makeTextBox(600000, 620000, 9500000, 520000, [
        {
            runs: [
                { text: title, bold: true, size: 21, color: '0F2C59' }
            ]
        },
        {
            spaceBefore: 2,
            runs: [
                { text: subtitle, bold: false, size: 11, color: '475569' }
            ]
        }
    ], { padT: 0, padB: 0, padL: 0, padR: 0 }));

    // Number Badge (Top Right)
    elements.push(makeTextBox(10800000, 480000, 792000, 360000, [
        {
            align: 'ctr',
            runs: [
                { text: `0${slideNum} / 08`, bold: true, size: 11, color: 'FFFFFF' }
            ]
        }
    ], { bgHex: '0F2C59', radius: 4000, anchor: 'ctr', padT: 20000, padB: 20000 }));

    // Top dividing line
    elements.push(makeCard(600000, 1180000, 10992000, 12000, '0066CC', null, 0));

    return elements.join('');
}

function makeStandardSlideFooter(slideNum) {
    let elements = [];
    // Footer bottom separator
    elements.push(makeCard(600000, 6420000, 10992000, 8000, 'E2E8F0', null, 0));

    // Footer Text Left
    elements.push(makeTextBox(600000, 6460000, 8500000, 260000, [
        {
            runs: [
                { text: 'Department of Information Technology, SRM TRP Engineering College  •  Academic Year 2026-27 (Odd Semester)', size: 9, color: '64748B' }
            ]
        }
    ], { padT: 0, padB: 0, padL: 0, padR: 0 }));

    // Footer Text Right
    elements.push(makeTextBox(9500000, 6460000, 2092000, 260000, [
        {
            align: 'r',
            runs: [
                { text: 'IT25301 - Web Technology Lab', bold: true, size: 9, color: '0066CC' }
            ]
        }
    ], { padT: 0, padB: 0, padL: 0, padR: 0 }));

    return elements.join('');
}

function assembleSlideXml(shapeXmlList) {
    return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<p:sld xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" xmlns:p="http://schemas.openxmlformats.org/presentationml/2006/main">
  <p:cSld>
    <p:spTree>
      <p:nvGrpSpPr>
        <p:cNvPr id="1" name=""/>
        <p:cNvGrpSpPr/>
        <p:nvPr/>
      </p:nvGrpSpPr>
      <p:grpSpPr>
        <a:xfrm>
          <a:off x="0" y="0"/>
          <a:ext cx="0" cy="0"/>
          <a:chOff x="0" y="0"/>
          <a:chExt cx="0" cy="0"/>
        </a:xfrm>
      </p:grpSpPr>
      ${shapeXmlList.join('\n')}
    </p:spTree>
  </p:cSld>
  <p:clrMapOvr><a:masterClrMapping/></p:clrMapOvr>
</p:sld>`;
}

function makeSlideRelsXml(imageRels = []) {
    let rels = [
        `<Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/slideLayout" Target="../slideLayouts/slideLayout1.xml"/>`
    ];
    let counter = 2;
    for (let img of imageRels) {
        rels.push(`<Relationship Id="rId${counter++}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/image" Target="../media/${img}"/>`);
    }
    return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  ${rels.join('\n  ')}
</Relationships>`;
}

// ==========================================
// SLIDE 1: Title & Academic Credentials
// ==========================================
console.log('Generating Slide 1: Title & Credentials...');
shapeCounter = 2;
const s1Shapes = [];

// Deep Navy Background Card
s1Shapes.push(makeCard(400000, 300000, 11392000, 6258000, '0B192C', '1E3E62', 19050, 4000));
s1Shapes.push(makeCard(450000, 350000, 11292000, 6158000, '0F2C59', '1E40AF', 12700, 3000));

// College Logo (rId2)
s1Shapes.push(makePicture(750000, 600000, 1100000, 1100000, 'rId2'));

// College Header Text
s1Shapes.push(makeTextBox(2000000, 580000, 9300000, 1200000, [
    {
        runs: [
            { text: 'SRM TRP ENGINEERING COLLEGE', bold: true, size: 21, color: 'FFFFFF' }
        ]
    },
    {
        spaceBefore: 2,
        runs: [
            { text: '(Approved by AICTE, New Delhi & Affiliated to Anna University, Chennai)', size: 10.5, color: '93C5FD' }
        ]
    },
    {
        spaceBefore: 3,
        runs: [
            { text: 'DEPARTMENT OF INFORMATION TECHNOLOGY', bold: true, size: 13, color: 'F59E0B' }
        ]
    },
    {
        spaceBefore: 2,
        runs: [
            { text: 'Academic Year 2026 – 2027 (Odd Semester)  •  Course: IT25301 Web Technology Laboratory', size: 10, color: 'CBD5E1' }
        ]
    }
]));

// Divider Line
s1Shapes.push(makeCard(750000, 1850000, 10692000, 15000, '2563EB', null, 0));

// Mini Project Badge
s1Shapes.push(makeTextBox(750000, 2050000, 3400000, 360000, [
    {
        align: 'ctr',
        runs: [
            { text: 'MINI PROJECT PRESENTATION', bold: true, size: 10.5, color: 'FFFFFF' }
        ]
    }
], { bgHex: '2563EB', radius: 4000, anchor: 'ctr', padT: 20000, padB: 20000 }));

// Project Title Hero
s1Shapes.push(makeTextBox(750000, 2500000, 10692000, 1500000, [
    {
        runs: [
            { text: 'ELECTRICITY BILL CALCULATOR', bold: true, size: 32, color: 'FFFFFF' }
        ]
    },
    {
        spaceBefore: 4,
        runs: [
            { text: 'An Automated Web Application for Slab-Tiered Tariff Calculation, Real-Time Billing Breakdown & Utility History Tracking', size: 14, color: '94A3B8' }
        ]
    }
]));

// Team Card (Left)
s1Shapes.push(makeCard(750000, 4100000, 5200000, 2150000, '0B192C', '1E3A8A', 15875, 3000));
s1Shapes.push(makeTextBox(950000, 4220000, 4800000, 1950000, [
    {
        runs: [
            { text: 'PROJECT TEAM MEMBERS', bold: true, size: 11.5, color: 'F59E0B' }
        ]
    },
    {
        spaceBefore: 6,
        bullet: true,
        runs: [
            { text: 'SHAPTHAGIRI G', bold: true, size: 12, color: 'FFFFFF' },
            { text: '  (Reg. No: 814725205105)', size: 10.5, color: '93C5FD' }
        ]
    },
    {
        spaceBefore: 4,
        bullet: true,
        runs: [
            { text: 'RENGESH M', bold: true, size: 12, color: 'FFFFFF' },
            { text: '  (Reg. No: 814725205088)', size: 10.5, color: '93C5FD' }
        ]
    },
    {
        spaceBefore: 4,
        bullet: true,
        runs: [
            { text: 'SAI SARAN N', bold: true, size: 12, color: 'FFFFFF' },
            { text: '  (Reg. No: 814725205096)', size: 10.5, color: '93C5FD' }
        ]
    },
    {
        spaceBefore: 6,
        runs: [
            { text: 'Degree & Branch: ', bold: true, size: 10, color: '94A3B8' },
            { text: 'B.Tech – Information Technology (II Year)', size: 10, color: 'E2E8F0' }
        ]
    }
]));

// Supervision Card (Right)
s1Shapes.push(makeCard(6150000, 4100000, 5292000, 2150000, '0B192C', '1E3A8A', 15875, 3000));
s1Shapes.push(makeTextBox(6350000, 4220000, 4900000, 1950000, [
    {
        runs: [
            { text: 'PROJECT SUPERVISION & DEPARTMENT', bold: true, size: 11.5, color: 'F59E0B' }
        ]
    },
    {
        spaceBefore: 6,
        runs: [
            { text: 'Faculty In-Charge & Project Guide:', size: 10, color: '94A3B8' }
        ]
    },
    {
        spaceBefore: 2,
        runs: [
            { text: 'Mrs. C. MANONMANI, M.E., (Ph.D.)', bold: true, size: 12.5, color: 'FFFFFF' }
        ]
    },
    {
        runs: [
            { text: 'Assistant Professor, Department of Artificial Intelligence & Data Science', size: 10, color: '93C5FD' }
        ]
    },
    {
        spaceBefore: 8,
        runs: [
            { text: 'Head of the Department:', size: 10, color: '94A3B8' }
        ]
    },
    {
        spaceBefore: 2,
        runs: [
            { text: 'Dr. S. SABEETHA SARASWATHI, M.Tech., Ph.D.', bold: true, size: 12.5, color: 'FFFFFF' }
        ]
    },
    {
        runs: [
            { text: 'Associate Professor & Head, Department of Information Technology', size: 10, color: '93C5FD' }
        ]
    }
]));

fs.writeFileSync(path.join(buildDir, 'ppt/slides/slide1.xml'), assembleSlideXml(s1Shapes));
fs.writeFileSync(path.join(buildDir, 'ppt/slides/_rels/slide1.xml.rels'), makeSlideRelsXml(['logo.png']));


// ==========================================
// SLIDE 2: Project Overview & Objectives
// ==========================================
console.log('Generating Slide 2: Project Overview & Objectives...');
shapeCounter = 2;
const s2Shapes = [];

s2Shapes.push(makeStandardSlideHeader('Project Overview, Problem Statement & Objectives', 'Addressing manual calculation errors and billing obscurity with a modern client-side web utility', 'Context & Objectives', 2));
s2Shapes.push(makeStandardSlideFooter(2));

// Left Column: Problem & Proposed Solution
s2Shapes.push(makeCard(600000, 1350000, 5200000, 2350000, 'FFFFFF', 'EF4444', 15875, 2500));
s2Shapes.push(makeCard(600000, 1350000, 5200000, 380000, 'FEF2F2', 'FCA5A5', 9525, 2500));
s2Shapes.push(makeTextBox(800000, 1420000, 4800000, 300000, [
    {
        runs: [
            { text: 'CHALLENGES IN CONVENTIONAL BILLING', bold: true, size: 11.5, color: 'B91C1C' }
        ]
    }
]));
s2Shapes.push(makeTextBox(800000, 1800000, 4800000, 1800000, [
    {
        spaceBefore: 3,
        bullet: true,
        runs: [
            { text: 'Prone to Human Error: ', bold: true, size: 10.5, color: '1E293B' },
            { text: 'Manual subtraction of meter readings often leads to incorrect billing disputes.', size: 10.5, color: '475569' }
        ]
    },
    {
        spaceBefore: 5,
        bullet: true,
        runs: [
            { text: 'Complex Progressive Tariffs: ', bold: true, size: 10.5, color: '1E293B' },
            { text: 'Consumers struggle to verify slab-tiered calculations on physical bills.', size: 10.5, color: '475569' }
        ]
    },
    {
        spaceBefore: 5,
        bullet: true,
        runs: [
            { text: 'Zero Pre-Bill Transparency: ', bold: true, size: 10.5, color: '1E293B' },
            { text: 'Consumers receive physical bills weeks later, leaving no means for mid-cycle tracking.', size: 10.5, color: '475569' }
        ]
    }
]));

// Proposed Solution Card
s2Shapes.push(makeCard(600000, 3850000, 5200000, 2400000, 'FFFFFF', '10B981', 15875, 2500));
s2Shapes.push(makeCard(600000, 3850000, 5200000, 380000, 'ECFDF5', '6EE7B7', 9525, 2500));
s2Shapes.push(makeTextBox(800000, 3920000, 4800000, 300000, [
    {
        runs: [
            { text: 'THE PROPOSED WEB SOLUTION', bold: true, size: 11.5, color: '047857' }
        ]
    }
]));
s2Shapes.push(makeTextBox(800000, 4300000, 4800000, 1850000, [
    {
        spaceBefore: 3,
        bullet: true,
        runs: [
            { text: 'Instantaneous Calculation: ', bold: true, size: 10.5, color: '1E293B' },
            { text: 'Computes units and slab breakdowns dynamically in < 5 ms.', size: 10.5, color: '475569' }
        ]
    },
    {
        spaceBefore: 5,
        bullet: true,
        runs: [
            { text: 'Zero Server Installation: ', bold: true, size: 10.5, color: '1E293B' },
            { text: '100% client-side HTML5/CSS3/JavaScript execution with zero maintenance cost.', size: 10.5, color: '475569' }
        ]
    },
    {
        spaceBefore: 5,
        bullet: true,
        runs: [
            { text: 'Offline History & Printing: ', bold: true, size: 10.5, color: '1E293B' },
            { text: 'Persistent LocalStorage tracking and one-click printable formal invoices.', size: 10.5, color: '475569' }
        ]
    }
]));

// Right Column: 4 Project Objectives Grid
// Obj 1
s2Shapes.push(makeCard(6100000, 1350000, 2600000, 2350000, 'F8FAFC', 'CBD5E1', 12700, 2000));
s2Shapes.push(makeTextBox(6250000, 1450000, 2300000, 2150000, [
    {
        runs: [
            { text: '01', bold: true, size: 22, color: '0066CC' }
        ]
    },
    {
        spaceBefore: 2,
        runs: [
            { text: 'Automated Calculation', bold: true, size: 11.5, color: '0F2C59' }
        ]
    },
    {
        spaceBefore: 4,
        runs: [
            { text: 'Automatically computes consumed units (Units = Current − Previous) and strictly enforces validation to reject negative or inverted readings.', size: 9.5, color: '475569' }
        ]
    }
]));

// Obj 2
s2Shapes.push(makeCard(8900000, 1350000, 2600000, 2350000, 'F8FAFC', 'CBD5E1', 12700, 2000));
s2Shapes.push(makeTextBox(9050000, 1450000, 2300000, 2150000, [
    {
        runs: [
            { text: '02', bold: true, size: 22, color: 'F59E0B' }
        ]
    },
    {
        spaceBefore: 2,
        runs: [
            { text: 'Slab-Tiered Engine', bold: true, size: 11.5, color: '0F2C59' }
        ]
    },
    {
        spaceBefore: 4,
        runs: [
            { text: 'Accurately partitions consumed units across progressive domestic tariff slabs (₹1.50, ₹2.50, ₹4.00, ₹6.00) without retroactive penalty.', size: 9.5, color: '475569' }
        ]
    }
]));

// Obj 3
s2Shapes.push(makeCard(6100000, 3850000, 2600000, 2400000, 'F8FAFC', 'CBD5E1', 12700, 2000));
s2Shapes.push(makeTextBox(6250000, 3950000, 2300000, 2200000, [
    {
        runs: [
            { text: '03', bold: true, size: 22, color: '10B981' }
        ]
    },
    {
        spaceBefore: 2,
        runs: [
            { text: 'Transparent Invoicing', bold: true, size: 11.5, color: '0F2C59' }
        ]
    },
    {
        spaceBefore: 4,
        runs: [
            { text: 'Generates detailed itemized bills displaying consumption per slab, applicable rate, subtotal, and print-ready bill receipt using CSS print media.', size: 9.5, color: '475569' }
        ]
    }
]));

// Obj 4
s2Shapes.push(makeCard(8900000, 3850000, 2600000, 2400000, 'F8FAFC', 'CBD5E1', 12700, 2000));
s2Shapes.push(makeTextBox(9050000, 3950000, 2300000, 2200000, [
    {
        runs: [
            { text: '04', bold: true, size: 22, color: '6366F1' }
        ]
    },
    {
        spaceBefore: 2,
        runs: [
            { text: 'Persistent History', bold: true, size: 11.5, color: '0F2C59' }
        ]
    },
    {
        spaceBefore: 4,
        runs: [
            { text: 'Saves past calculations to browser LocalStorage, allowing consumers to review previous consumption records, audit past bills, or clear records on demand.', size: 9.5, color: '475569' }
        ]
    }
]));

fs.writeFileSync(path.join(buildDir, 'ppt/slides/slide2.xml'), assembleSlideXml(s2Shapes));
fs.writeFileSync(path.join(buildDir, 'ppt/slides/_rels/slide2.xml.rels'), makeSlideRelsXml([]));


// ==========================================
// SLIDE 3: System Architecture & Tech Stack
// ==========================================
console.log('Generating Slide 3: System Architecture & Tech Stack...');
shapeCounter = 2;
const s3Shapes = [];

s3Shapes.push(makeStandardSlideHeader('System Architecture & Technology Stack', 'Three-tier client-side architecture delivering responsive performance and persistent utility storage', 'Architecture & Stack', 3));
s3Shapes.push(makeStandardSlideFooter(3));

// Left Column: Architecture Diagram (rId2)
s3Shapes.push(makeCard(600000, 1350000, 5300000, 4850000, 'FFFFFF', 'CBD5E1', 15875, 2000));
s3Shapes.push(makePicture(700000, 1450000, 5100000, 4200000, 'rId2'));
s3Shapes.push(makeTextBox(700000, 5750000, 5100000, 350000, [
    {
        align: 'ctr',
        runs: [
            { text: 'Figure 3.1: 3-Tier Client-Side Web Application Architecture', bold: true, size: 10, color: '0F2C59' }
        ]
    }
]));

// Right Column: Architectural Tiers Breakdown
// Tier 1: Presentation Layer
s3Shapes.push(makeCard(6200000, 1350000, 5400000, 1450000, 'FFFFFF', '0066CC', 12700, 2000));
s3Shapes.push(makeTextBox(6400000, 1420000, 5000000, 1300000, [
    {
        runs: [
            { text: '1. PRESENTATION LAYER (HTML5 + CSS3)', bold: true, size: 11.5, color: '0066CC' }
        ]
    },
    {
        spaceBefore: 3,
        bullet: true,
        runs: [
            { text: 'HTML5 Semantic Structure: ', bold: true, size: 10, color: '1E293B' },
            { text: 'Clean semantic elements (<header>, <section>, <form>, <table>) ensuring high accessibility.', size: 10, color: '475569' }
        ]
    },
    {
        spaceBefore: 2,
        bullet: true,
        runs: [
            { text: 'Modern CSS3 Layout: ', bold: true, size: 10, color: '1E293B' },
            { text: 'CSS Flexbox/Grid responsive system, CSS variables, and @media print stylesheet.', size: 10, color: '475569' }
        ]
    }
]));

// Tier 2: Business Logic Layer
s3Shapes.push(makeCard(6200000, 2900000, 5400000, 1550000, 'FFFFFF', 'F59E0B', 12700, 2000));
s3Shapes.push(makeTextBox(6400000, 2970000, 5000000, 1400000, [
    {
        runs: [
            { text: '2. BUSINESS LOGIC ENGINE (JAVASCRIPT ES6+)', bold: true, size: 11.5, color: 'D97706' }
        ]
    },
    {
        spaceBefore: 3,
        bullet: true,
        runs: [
            { text: 'Input Validation & Sanitization: ', bold: true, size: 10, color: '1E293B' },
            { text: 'Rejects negative values, non-numeric strings, and inverted meter conditions.', size: 10, color: '475569' }
        ]
    },
    {
        spaceBefore: 2,
        bullet: true,
        runs: [
            { text: 'Progressive Slab Algorithm: ', bold: true, size: 10, color: '1E293B' },
            { text: 'Dynamic loop iterating through configured tariff tiers with immediate breakdown.', size: 10, color: '475569' }
        ]
    }
]));

// Tier 3: Storage Layer
s3Shapes.push(makeCard(6200000, 4550000, 5400000, 1650000, 'FFFFFF', '10B981', 12700, 2000));
s3Shapes.push(makeTextBox(6400000, 4620000, 5000000, 1500000, [
    {
        runs: [
            { text: '3. STORAGE & PLATFORM COMPATIBILITY', bold: true, size: 11.5, color: '059669' }
        ]
    },
    {
        spaceBefore: 3,
        bullet: true,
        runs: [
            { text: 'HTML5 LocalStorage: ', bold: true, size: 10, color: '1E293B' },
            { text: 'Stores past bill records as serialized JSON. Retains data across sessions with zero server costs.', size: 10, color: '475569' }
        ]
    },
    {
        spaceBefore: 2,
        bullet: true,
        runs: [
            { text: 'Cross-Platform Execution: ', bold: true, size: 10, color: '1E293B' },
            { text: 'Works seamlessly on all browsers (Google Chrome, MS Edge, Firefox, Safari) and mobile displays.', size: 10, color: '475569' }
        ]
    }
]));

fs.writeFileSync(path.join(buildDir, 'ppt/slides/slide3.xml'), assembleSlideXml(s3Shapes));
fs.writeFileSync(path.join(buildDir, 'ppt/slides/_rels/slide3.xml.rels'), makeSlideRelsXml(['fig3_1_architecture.png']));


// ==========================================
// SLIDE 4: Progressive Tariff Slabs & Mathematical Model
// ==========================================
console.log('Generating Slide 4: Progressive Tariff Slabs & Math Model...');
shapeCounter = 2;
const s4Shapes = [];

s4Shapes.push(makeStandardSlideHeader('Progressive Tariff Slabs & Mathematical Model', 'Exact mathematical formulas, non-retroactive tiered logic, and verified benchmark calculations', 'Tariff & Math Model', 4));
s4Shapes.push(makeStandardSlideFooter(4));

// Left Column: Formulas & Slab Table
s4Shapes.push(makeCard(600000, 1350000, 5200000, 1950000, 'FFFFFF', '0066CC', 15875, 2000));
s4Shapes.push(makeTextBox(800000, 1420000, 4800000, 1800000, [
    {
        runs: [
            { text: 'CORE MATHEMATICAL FORMULATIONS', bold: true, size: 11.5, color: '0066CC' }
        ]
    },
    {
        spaceBefore: 4,
        runs: [
            { text: '1. Electricity Units Consumed (U):', bold: true, size: 10.5, color: '0F2C59' }
        ]
    },
    {
        spaceBefore: 1,
        runs: [
            { text: '    U = Reading_current − Reading_previous   (where R_curr ≥ R_prev ≥ 0)', size: 10.5, color: '1E293B' }
        ]
    },
    {
        spaceBefore: 5,
        runs: [
            { text: '2. Progressive Slab Total Charge (Total Bill):', bold: true, size: 10.5, color: '0F2C59' }
        ]
    },
    {
        spaceBefore: 1,
        runs: [
            { text: '    Total Bill = ∑ (Units in Slab_i × Rate_i)  for i = 1 to k', size: 10.5, color: '1E293B' }
        ]
    },
    {
        spaceBefore: 3,
        runs: [
            { text: '    *Tariffs are non-retroactive: each tier charges only the units falling within its span.', size: 9, color: '64748B' }
        ]
    }
]));

// Slab Schedule Card / Table
s4Shapes.push(makeCard(600000, 3450000, 5200000, 2750000, 'FFFFFF', 'CBD5E1', 12700, 2000));
s4Shapes.push(makeTextBox(800000, 3550000, 4800000, 2550000, [
    {
        runs: [
            { text: 'OFFICIAL DOMESTIC TARIFF SLABS', bold: true, size: 11.5, color: '0F2C59' }
        ]
    },
    {
        spaceBefore: 5,
        runs: [
            { text: '• Slab 1 (0 – 100 Units): ', bold: true, size: 10.5, color: '0066CC' },
            { text: '₹1.50 / unit  ', bold: true, size: 10.5, color: '0F2C59' },
            { text: '(Lifeline domestic allowance)', size: 9.5, color: '64748B' }
        ]
    },
    {
        spaceBefore: 4,
        runs: [
            { text: '• Slab 2 (101 – 200 Units): ', bold: true, size: 10.5, color: '10B981' },
            { text: '₹2.50 / unit  ', bold: true, size: 10.5, color: '0F2C59' },
            { text: '(Domestic baseline consumption)', size: 9.5, color: '64748B' }
        ]
    },
    {
        spaceBefore: 4,
        runs: [
            { text: '• Slab 3 (201 – 300 Units): ', bold: true, size: 10.5, color: 'F59E0B' },
            { text: '₹4.00 / unit  ', bold: true, size: 10.5, color: '0F2C59' },
            { text: '(Standard domestic consumption)', size: 9.5, color: '64748B' }
        ]
    },
    {
        spaceBefore: 4,
        runs: [
            { text: '• Slab 4 (Above 300 Units): ', bold: true, size: 10.5, color: 'EF4444' },
            { text: '₹6.00 / unit  ', bold: true, size: 10.5, color: '0F2C59' },
            { text: '(High energy consumption tier)', size: 9.5, color: '64748B' }
        ]
    }
]));

// Right Column: Concrete Worked Examples
// Example 1: 80 Units
s4Shapes.push(makeCard(6100000, 1350000, 5400000, 1400000, 'F0FDF4', '86EFAC', 12700, 2000));
s4Shapes.push(makeTextBox(6300000, 1420000, 5000000, 1250000, [
    {
        runs: [
            { text: 'EXAMPLE 1: LOW DOMESTIC CONSUMPTION (80 UNITS)', bold: true, size: 11, color: '15803D' }
        ]
    },
    {
        spaceBefore: 2,
        runs: [
            { text: '• Slab 1 (80 units @ ₹1.50): ', bold: true, size: 10, color: '1E293B' },
            { text: '80 × 1.50 = ₹120.00', size: 10, color: '334155' }
        ]
    },
    {
        spaceBefore: 2,
        runs: [
            { text: '• Total Payable: ', bold: true, size: 11, color: '15803D' },
            { text: '₹120.00   ', bold: true, size: 12, color: '15803D' },
            { text: '(Single slab tier applied)', size: 9.5, color: '64748B' }
        ]
    }
]));

// Example 2: 250 Units
s4Shapes.push(makeCard(6100000, 2850000, 5400000, 1600000, 'EFF6FF', '93C5FD', 12700, 2000));
s4Shapes.push(makeTextBox(6300000, 2920000, 5000000, 1450000, [
    {
        runs: [
            { text: 'EXAMPLE 2: TYPICAL HOUSEHOLD CONSUMPTION (250 UNITS)', bold: true, size: 11, color: '1D4ED8' }
        ]
    },
    {
        spaceBefore: 2,
        runs: [
            { text: '• Slab 1 (100 u @ ₹1.50): ₹150.00  |  Slab 2 (100 u @ ₹2.50): ₹250.00', size: 9.5, color: '334155' }
        ]
    },
    {
        spaceBefore: 1,
        runs: [
            { text: '• Slab 3 (50 u @ ₹4.00): ₹200.00', size: 9.5, color: '334155' }
        ]
    },
    {
        spaceBefore: 2,
        runs: [
            { text: '• Total Payable: ', bold: true, size: 11, color: '1D4ED8' },
            { text: '₹600.00   ', bold: true, size: 12, color: '1D4ED8' },
            { text: '(150 + 250 + 200 = ₹600.00 across 3 tiers)', size: 9.5, color: '64748B' }
        ]
    }
]));

// Example 3: 450 Units
s4Shapes.push(makeCard(6100000, 4550000, 5400000, 1650000, 'FEF3C7', 'FCD34D', 12700, 2000));
s4Shapes.push(makeTextBox(6300000, 4620000, 5000000, 1500000, [
    {
        runs: [
            { text: 'EXAMPLE 3: HEAVY CONSUMPTION (450 UNITS)', bold: true, size: 11, color: 'B45309' }
        ]
    },
    {
        spaceBefore: 2,
        runs: [
            { text: '• Slab 1: ₹150.00  |  Slab 2: ₹250.00  |  Slab 3: ₹400.00', size: 9.5, color: '334155' }
        ]
    },
    {
        spaceBefore: 1,
        runs: [
            { text: '• Slab 4 (150 u @ ₹6.00): ₹900.00', size: 9.5, color: '334155' }
        ]
    },
    {
        spaceBefore: 2,
        runs: [
            { text: '• Total Payable: ', bold: true, size: 11, color: 'B45309' },
            { text: '₹1,700.00   ', bold: true, size: 12, color: 'B45309' },
            { text: '(150 + 250 + 400 + 900 = ₹1,700.00 across all 4 tiers)', size: 9.5, color: '64748B' }
        ]
    }
]));

fs.writeFileSync(path.join(buildDir, 'ppt/slides/slide4.xml'), assembleSlideXml(s4Shapes));
fs.writeFileSync(path.join(buildDir, 'ppt/slides/_rels/slide4.xml.rels'), makeSlideRelsXml([]));


// ==========================================
// SLIDE 5: System Design & Data Flow Modeling
// ==========================================
console.log('Generating Slide 5: System Design & Data Flow Modeling...');
shapeCounter = 2;
const s5Shapes = [];

s5Shapes.push(makeStandardSlideHeader('System Design & Data Flow Modeling', 'Data flow architecture from user input acquisition to dynamic invoice calculation and persistence', 'Design & Workflows', 5));
s5Shapes.push(makeStandardSlideFooter(5));

// Left Column: Level 0 DFD (rId2)
s5Shapes.push(makeCard(600000, 1350000, 5200000, 3100000, 'FFFFFF', 'CBD5E1', 15875, 2000));
s5Shapes.push(makePicture(700000, 1450000, 5000000, 2600000, 'rId2'));
s5Shapes.push(makeTextBox(700000, 4100000, 5000000, 300000, [
    {
        align: 'ctr',
        runs: [
            { text: 'Figure 3.3: Data Flow Diagram (Level 0 Context Diagram)', bold: true, size: 10, color: '0F2C59' }
        ]
    }
]));

// Left Column Bottom: Context Flow Explanation
s5Shapes.push(makeCard(600000, 4600000, 5200000, 1600000, 'F8FAFC', 'E2E8F0', 12700, 2000));
s5Shapes.push(makeTextBox(800000, 4680000, 4800000, 1450000, [
    {
        runs: [
            { text: 'DATA FLOW OVERVIEW (LEVEL 0 CONTEXT)', bold: true, size: 10.5, color: '0066CC' }
        ]
    },
    {
        spaceBefore: 2,
        bullet: true,
        runs: [
            { text: 'External Entity: ', bold: true, size: 9.5, color: '1E293B' },
            { text: 'Consumer submits previous and current readings.', size: 9.5, color: '475569' }
        ]
    },
    {
        spaceBefore: 2,
        bullet: true,
        runs: [
            { text: 'Core Processing: ', bold: true, size: 9.5, color: '1E293B' },
            { text: 'Validates input, calculates units, and evaluates progressive slab tiers.', size: 9.5, color: '475569' }
        ]
    },
    {
        spaceBefore: 2,
        bullet: true,
        runs: [
            { text: 'Data Stores: ', bold: true, size: 9.5, color: '1E293B' },
            { text: 'Appends calculation records to browser LocalStorage for review.', size: 9.5, color: '475569' }
        ]
    }
]));

// Right Column: Workflow Diagram (rId3)
s5Shapes.push(makeCard(6100000, 1350000, 5400000, 4850000, 'FFFFFF', 'CBD5E1', 15875, 2000));
s5Shapes.push(makePicture(6200000, 1450000, 5200000, 4350000, 'rId3'));
s5Shapes.push(makeTextBox(6200000, 5850000, 5200000, 300000, [
    {
        align: 'ctr',
        runs: [
            { text: 'Figure 3.5: End-to-End System Calculation & Workflow Logic', bold: true, size: 10, color: '0F2C59' }
        ]
    }
]));

fs.writeFileSync(path.join(buildDir, 'ppt/slides/slide5.xml'), assembleSlideXml(s5Shapes));
fs.writeFileSync(path.join(buildDir, 'ppt/slides/_rels/slide5.xml.rels'), makeSlideRelsXml(['fig3_3_dfd0.png', 'fig3_5_workflow.png']));


// ==========================================
// SLIDE 6: Live Application UI Showcase
// ==========================================
console.log('Generating Slide 6: Live Application UI Showcase...');
shapeCounter = 2;
const s6Shapes = [];

s6Shapes.push(makeStandardSlideHeader('Application UI Showcase & Interactive Modules', 'Visual walkthrough of the responsive home page, tariff table, input form, and instant bill breakdown', 'Application UI', 6));
s6Shapes.push(makeStandardSlideFooter(6));

// Left Column: Home Banner (rId2) & Calculator Form (rId3)
s6Shapes.push(makeCard(600000, 1350000, 5200000, 2300000, 'FFFFFF', 'CBD5E1', 12700, 2000));
s6Shapes.push(makePicture(650000, 1400000, 5100000, 1900000, 'rId2'));
s6Shapes.push(makeTextBox(650000, 3320000, 5100000, 280000, [
    {
        align: 'ctr',
        runs: [
            { text: 'Figure 4.2: Navigation Header, Hero Section & Domestic Tariffs', bold: true, size: 9.5, color: '0F2C59' }
        ]
    }
]));

s6Shapes.push(makeCard(600000, 3750000, 5200000, 2450000, 'FFFFFF', 'CBD5E1', 12700, 2000));
s6Shapes.push(makePicture(650000, 3800000, 5100000, 2050000, 'rId3'));
s6Shapes.push(makeTextBox(650000, 5870000, 5100000, 280000, [
    {
        align: 'ctr',
        runs: [
            { text: 'Figure 4.4: Meter Reading Input Form with Real-Time Validation', bold: true, size: 9.5, color: '0F2C59' }
        ]
    }
]));

// Right Column: Bill Result Invoice (rId4)
s6Shapes.push(makeCard(6100000, 1350000, 5400000, 3400000, 'FFFFFF', 'CBD5E1', 12700, 2000));
s6Shapes.push(makePicture(6200000, 1400000, 5200000, 3000000, 'rId4'));
s6Shapes.push(makeTextBox(6200000, 4420000, 5200000, 280000, [
    {
        align: 'ctr',
        runs: [
            { text: 'Figure 4.5: Generated Bill Invoice with Slab-by-Slab Cost Breakdown', bold: true, size: 9.5, color: '0F2C59' }
        ]
    }
]));

// Right Column Bottom: Summary Card
s6Shapes.push(makeCard(6100000, 4800000, 5400000, 1400000, 'F0FDF4', '86EFAC', 12700, 2000));
s6Shapes.push(makeTextBox(6300000, 4880000, 5000000, 1250000, [
    {
        runs: [
            { text: 'KEY USER INTERFACE HIGHLIGHTS', bold: true, size: 10.5, color: '15803D' }
        ]
    },
    {
        spaceBefore: 2,
        bullet: true,
        runs: [
            { text: 'Instant Feedback: ', bold: true, size: 9.5, color: '1E293B' },
            { text: 'Full bill rendered immediately upon form submit without page reload.', size: 9.5, color: '475569' }
        ]
    },
    {
        spaceBefore: 2,
        bullet: true,
        runs: [
            { text: 'Itemized Transparency: ', bold: true, size: 9.5, color: '1E293B' },
            { text: 'Clear breakdown table showing consumed units in each slab and rate applied.', size: 9.5, color: '475569' }
        ]
    }
]));

fs.writeFileSync(path.join(buildDir, 'ppt/slides/slide6.xml'), assembleSlideXml(s6Shapes));
fs.writeFileSync(path.join(buildDir, 'ppt/slides/_rels/slide6.xml.rels'), makeSlideRelsXml(['fig4_2_homepage.png', 'fig4_4_calculator_form.png', 'fig4_5_bill_result.png']));


// ==========================================
// SLIDE 7: History Tracking, Validation & Print Receipt
// ==========================================
console.log('Generating Slide 7: History Tracking, Validation & Print...');
shapeCounter = 2;
const s7Shapes = [];

s7Shapes.push(makeStandardSlideHeader('History Tracking, Validation & Print Invoice', 'Ensuring data integrity through strict input constraints, offline persistence, and print formatting', 'Advanced Features', 7));
s7Shapes.push(makeStandardSlideFooter(7));

// Left Column: History Table (rId2)
s7Shapes.push(makeCard(600000, 1350000, 5200000, 3100000, 'FFFFFF', 'CBD5E1', 12700, 2000));
s7Shapes.push(makePicture(650000, 1400000, 5100000, 2700000, 'rId2'));
s7Shapes.push(makeTextBox(650000, 4120000, 5100000, 280000, [
    {
        align: 'ctr',
        runs: [
            { text: 'Figure 4.6: Client-Side Persistent History Table (HTML5 LocalStorage)', bold: true, size: 9.5, color: '0F2C59' }
        ]
    }
]));

// Left Column Bottom: History Features Card
s7Shapes.push(makeCard(600000, 4550000, 5200000, 1650000, 'F8FAFC', 'E2E8F0', 12700, 2000));
s7Shapes.push(makeTextBox(800000, 4630000, 4800000, 1500000, [
    {
        runs: [
            { text: 'LOCALSTORAGE PERSISTENCE CAPABILITY', bold: true, size: 10.5, color: '0066CC' }
        ]
    },
    {
        spaceBefore: 2,
        bullet: true,
        runs: [
            { text: 'Structured Records: ', bold: true, size: 9.5, color: '1E293B' },
            { text: 'Stores timestamp, readings, consumed units, and total bill in browser cache.', size: 9.5, color: '475569' }
        ]
    },
    {
        spaceBefore: 2,
        bullet: true,
        runs: [
            { text: 'Session Independent: ', bold: true, size: 9.5, color: '1E293B' },
            { text: 'Data remains available across browser restarts and offline states.', size: 9.5, color: '475569' }
        ]
    }
]));

// Right Column Top: Validation Error Alert (rId3)
s7Shapes.push(makeCard(6100000, 1350000, 5400000, 2250000, 'FFFFFF', 'EF4444', 12700, 2000));
s7Shapes.push(makePicture(6200000, 1400000, 5200000, 1850000, 'rId3'));
s7Shapes.push(makeTextBox(6200000, 3270000, 5200000, 280000, [
    {
        align: 'ctr',
        runs: [
            { text: 'Figure 4.8: Input Validation Alert (Current Reading < Previous Reading)', bold: true, size: 9.5, color: 'B91C1C' }
        ]
    }
]));

// Right Column Bottom: Printable Invoice (rId4)
s7Shapes.push(makeCard(6100000, 3750000, 5400000, 2450000, 'FFFFFF', '10B981', 12700, 2000));
s7Shapes.push(makePicture(6200000, 3800000, 5200000, 2050000, 'rId4'));
s7Shapes.push(makeTextBox(6200000, 5870000, 5200000, 280000, [
    {
        align: 'ctr',
        runs: [
            { text: 'Figure 4.7: Print-Ready Invoice via CSS @media print Stylesheet', bold: true, size: 9.5, color: '047857' }
        ]
    }
]));

fs.writeFileSync(path.join(buildDir, 'ppt/slides/slide7.xml'), assembleSlideXml(s7Shapes));
fs.writeFileSync(path.join(buildDir, 'ppt/slides/_rels/slide7.xml.rels'), makeSlideRelsXml(['fig4_6_history.png', 'fig4_8_validation_error.png', 'fig4_7_printable_bill.png']));


// ==========================================
// SLIDE 8: Testing Matrix, Future Scope & Conclusion
// ==========================================
console.log('Generating Slide 8: Testing Matrix, Future Scope & Conclusion...');
shapeCounter = 2;
const s8Shapes = [];

s8Shapes.push(makeStandardSlideHeader('Testing Matrix, Future Scope & Conclusion', '100% verification pass rate, system scalability roadmap, and final project outcomes', 'Testing & Conclusion', 8));
s8Shapes.push(makeStandardSlideFooter(8));

// Left Column: Testing Verification
s8Shapes.push(makeCard(600000, 1350000, 5200000, 2850000, 'FFFFFF', '0066CC', 15875, 2000));
s8Shapes.push(makeTextBox(800000, 1420000, 4800000, 2700000, [
    {
        runs: [
            { text: 'VERIFICATION & TESTING SUMMARY', bold: true, size: 11.5, color: '0066CC' },
            { text: '   [20 / 20 TEST CASES PASSED (100%)]', bold: true, size: 10, color: '10B981' }
        ]
    },
    {
        spaceBefore: 4,
        bullet: true,
        runs: [
            { text: 'Unit Testing: ', bold: true, size: 10, color: '1E293B' },
            { text: 'Verified differential unit computation, input boundary checking, and individual slab rate calculations.', size: 9.5, color: '475569' }
        ]
    },
    {
        spaceBefore: 3,
        bullet: true,
        runs: [
            { text: 'Boundary Value Testing: ', bold: true, size: 10, color: '1E293B' },
            { text: 'Tested exact threshold transitions at 0, 100, 200, and 300 units with 100% mathematical consistency.', size: 9.5, color: '475569' }
        ]
    },
    {
        spaceBefore: 3,
        bullet: true,
        runs: [
            { text: 'Negative & Error Testing: ', bold: true, size: 10, color: '1E293B' },
            { text: 'Rejected non-numeric strings, negative meter values, and current < previous inputs gracefully.', size: 9.5, color: '475569' }
        ]
    },
    {
        spaceBefore: 3,
        bullet: true,
        runs: [
            { text: 'Cross-Browser Verification: ', bold: true, size: 10, color: '1E293B' },
            { text: 'Flawless layout and script execution on Google Chrome, Microsoft Edge, Firefox, and Safari.', size: 9.5, color: '475569' }
        ]
    }
]));

// Left Column Bottom: Performance Metrics Card
s8Shapes.push(makeCard(600000, 4350000, 5200000, 1850000, 'F0FDF4', '86EFAC', 12700, 2000));
s8Shapes.push(makeTextBox(800000, 4430000, 4800000, 1700000, [
    {
        runs: [
            { text: 'PERFORMANCE & SYSTEM EFFICIENCY', bold: true, size: 11, color: '15803D' }
        ]
    },
    {
        spaceBefore: 3,
        bullet: true,
        runs: [
            { text: 'Computation Latency: ', bold: true, size: 10, color: '1E293B' },
            { text: '< 5 ms execution time (instantaneous client response).', size: 10, color: '475569' }
        ]
    },
    {
        spaceBefore: 2,
        bullet: true,
        runs: [
            { text: 'Storage Footprint: ', bold: true, size: 10, color: '1E293B' },
            { text: '< 50 KB local browser cache overhead.', size: 10, color: '475569' }
        ]
    },
    {
        spaceBefore: 2,
        bullet: true,
        runs: [
            { text: 'Zero Server Cost: ', bold: true, size: 10, color: '1E293B' },
            { text: 'Completely static client-side operation with 100% offline uptime.', size: 10, color: '475569' }
        ]
    }
]));

// Right Column: Future Enhancements
s8Shapes.push(makeCard(6100000, 1350000, 5400000, 2850000, 'FFFFFF', 'F59E0B', 15875, 2000));
s8Shapes.push(makeTextBox(6300000, 1420000, 5000000, 2700000, [
    {
        runs: [
            { text: 'FUTURE ENHANCEMENT ROADMAP', bold: true, size: 11.5, color: 'D97706' }
        ]
    },
    {
        spaceBefore: 4,
        bullet: true,
        runs: [
            { text: 'IoT Smart Meter Integration: ', bold: true, size: 10, color: '1E293B' },
            { text: 'Automated telemetry ingestion via ESP32 / Wi-Fi optical pulse counter.', size: 9.5, color: '475569' }
        ]
    },
    {
        spaceBefore: 3,
        bullet: true,
        runs: [
            { text: 'Cloud Backend & Multi-User DB: ', bold: true, size: 10, color: '1E293B' },
            { text: 'Centralized database (Node.js / MongoDB) with consumer authentication.', size: 9.5, color: '475569' }
        ]
    },
    {
        spaceBefore: 3,
        bullet: true,
        runs: [
            { text: 'Integrated Payment Gateway: ', bold: true, size: 10, color: '1E293B' },
            { text: 'Direct bill settlement supporting UPI, NetBanking, and credit/debit cards.', size: 9.5, color: '475569' }
        ]
    },
    {
        spaceBefore: 3,
        bullet: true,
        runs: [
            { text: 'Predictive Energy Analytics: ', bold: true, size: 10, color: '1E293B' },
            { text: 'Machine learning forecasting to alert households before crossing into higher slabs.', size: 9.5, color: '475569' }
        ]
    }
]));

// Right Column Bottom: Conclusion Card
s8Shapes.push(makeCard(6100000, 4350000, 5400000, 1850000, '0F2C59', '1E40AF', 15875, 2000));
s8Shapes.push(makeTextBox(6300000, 4430000, 5000000, 1700000, [
    {
        runs: [
            { text: 'CONCLUSION', bold: true, size: 11.5, color: 'F59E0B' }
        ]
    },
    {
        spaceBefore: 3,
        runs: [
            { text: 'The Electricity Bill Calculator successfully delivers a lightweight, dependable, and transparent utility solution. By automating differential meter calculations and enforcing progressive slab tariffs, the application eliminates manual errors, clarifies utility billing for everyday consumers, and provides persistent historical records with zero operational cost.', size: 9.5, color: 'FFFFFF' }
        ]
    }
]));

fs.writeFileSync(path.join(buildDir, 'ppt/slides/slide8.xml'), assembleSlideXml(s8Shapes));
fs.writeFileSync(path.join(buildDir, 'ppt/slides/_rels/slide8.xml.rels'), makeSlideRelsXml([]));

console.log('All 8 slides successfully written.');

// ==========================================
// ZIP PACKAGING INTO PPTX (STANDARD MS-DOS TIMESTAMP)
// ==========================================
function createZip(sourceDir, outputFile) {
    const files = [];

    // Ensure [Content_Types].xml and _rels are placed first
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

    // Sort files so [Content_Types].xml is always the first entry
    files.sort((a, b) => {
        if (a.entryPath === '[Content_Types].xml') return -1;
        if (b.entryPath === '[Content_Types].xml') return 1;
        if (a.entryPath.startsWith('_rels')) return -1;
        if (b.entryPath.startsWith('_rels')) return 1;
        return a.entryPath.localeCompare(b.entryPath);
    });

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

    // Valid MS-DOS Timestamp: 2026-11-09 12:00:00
    const dosTime = 0x6000;
    const dosDate = 0x5D69;

    for (let f of files) {
        const data = fs.readFileSync(f.fullPath);
        const crc = crc32(data);
        const uncompressedSize = data.length;

        const compressed = zlib.deflateRawSync(data, { level: 6 });
        const compressedSize = compressed.length;

        const nameBuf = Buffer.from(f.entryPath.replace(/\\/g, '/'), 'utf8');

        // Local header (30 bytes + nameBuf.length)
        const lf = Buffer.alloc(30 + nameBuf.length);
        lf.writeUInt32LE(0x04034b50, 0); // signature
        lf.writeUInt16LE(20, 4);         // version needed (2.0)
        lf.writeUInt16LE(0, 6);          // flags
        lf.writeUInt16LE(8, 8);          // compression method: 8
        lf.writeUInt16LE(dosTime, 10);   // mod time
        lf.writeUInt16LE(dosDate, 12);   // mod date
        lf.writeUInt32LE(crc, 14);       // crc32
        lf.writeUInt32LE(compressedSize, 18);
        lf.writeUInt32LE(uncompressedSize, 22);
        lf.writeUInt16LE(nameBuf.length, 26);
        lf.writeUInt16LE(0, 28);         // extra len
        nameBuf.copy(lf, 30);

        outParts.push(lf);
        outParts.push(compressed);

        // Central directory header (46 bytes + nameBuf.length)
        const cd = Buffer.alloc(46 + nameBuf.length);
        cd.writeUInt32LE(0x02014b50, 0); // signature
        cd.writeUInt16LE(20, 4);         // version made by
        cd.writeUInt16LE(20, 6);         // version needed
        cd.writeUInt16LE(0, 8);          // flags
        cd.writeUInt16LE(8, 10);         // compression method: 8
        cd.writeUInt16LE(dosTime, 12);   // mod time
        cd.writeUInt16LE(dosDate, 14);   // mod date
        cd.writeUInt32LE(crc, 16);       // crc32
        cd.writeUInt32LE(compressedSize, 20);
        cd.writeUInt32LE(uncompressedSize, 24);
        cd.writeUInt16LE(nameBuf.length, 28);
        cd.writeUInt16LE(0, 30);         // extra field len
        cd.writeUInt16LE(0, 32);         // comment len
        cd.writeUInt16LE(0, 34);         // disk number start
        cd.writeUInt16LE(0, 36);         // internal file attributes
        cd.writeUInt32LE(0, 38);         // external file attributes
        cd.writeUInt32LE(offset, 42);    // relative offset of local header
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

    // End of Central Directory Record (22 bytes)
    const eocd = Buffer.alloc(22);
    eocd.writeUInt32LE(0x06054b50, 0); // signature
    eocd.writeUInt16LE(0, 4);          // disk number
    eocd.writeUInt16LE(0, 6);          // disk number with CD
    eocd.writeUInt16LE(files.length, 8);  // entries on disk
    eocd.writeUInt16LE(files.length, 10); // total entries
    eocd.writeUInt32LE(cdSize, 12);       // central directory size
    eocd.writeUInt32LE(cdStart, 16);      // offset of start of central directory
    eocd.writeUInt16LE(0, 20);            // comment length

    outParts.push(eocd);

    const fullZip = Buffer.concat(outParts);
    fs.writeFileSync(outputFile, fullZip);
    console.log(`Successfully generated presentation: ${outputFile} (${fullZip.length} bytes, ${files.length} entries).`);
}

createZip(buildDir, path.resolve(__dirname, 'Electricity_Bill_Calculator_Presentation.pptx'));
