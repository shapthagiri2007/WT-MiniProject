const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

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

    // CRC32 table
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

        // Compress using deflateRaw
        const compressed = zlib.deflateRawSync(data, { level: 6 });
        const compressedSize = compressed.length;

        const nameBuf = Buffer.from(f.entryPath.replace(/\\/g, '/'), 'utf8');

        // Local file header (30 bytes + nameBuf.length)
        const lf = Buffer.alloc(30 + nameBuf.length);
        lf.writeUInt32LE(0x04034b50, 0); // signature
        lf.writeUInt16LE(20, 4);         // version needed (2.0)
        lf.writeUInt16LE(0, 6);          // flags
        lf.writeUInt16LE(8, 8);          // compression method: 8 (deflate)
        lf.writeUInt16LE(0, 10);         // mod time
        lf.writeUInt16LE(0, 12);         // mod date
        lf.writeUInt32LE(crc, 14);       // crc32
        lf.writeUInt32LE(compressedSize, 18);
        lf.writeUInt32LE(uncompressedSize, 22);
        lf.writeUInt16LE(nameBuf.length, 26);
        lf.writeUInt16LE(0, 28);         // extra length
        nameBuf.copy(lf, 30);

        outParts.push(lf);
        outParts.push(compressed);

        // Central directory file header (46 bytes + nameBuf.length)
        const cd = Buffer.alloc(46 + nameBuf.length);
        cd.writeUInt32LE(0x02014b50, 0); // signature
        cd.writeUInt16LE(20, 4);         // version made by
        cd.writeUInt16LE(20, 6);         // version needed
        cd.writeUInt16LE(0, 8);          // flags
        cd.writeUInt16LE(8, 10);         // compression method: 8
        cd.writeUInt16LE(0, 12);         // mod time
        cd.writeUInt16LE(0, 14);         // mod date
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
    console.log(`Successfully created standard zip archive: ${outputFile} (${fullZip.length} bytes, ${files.length} entries)`);
}

createZip('./report_build', 'Electricity_Bill_Calculator_Mini_Project_Report.docx');
