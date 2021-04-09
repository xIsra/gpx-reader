const fs = require('fs');

const buf = fs.readFileSync("files/one.gpx");
const byteLength = buf.byteLength;
console.log("Size: " + (byteLength / 1000) + "kb")

const header = buf.readUIntLE(0, 4);
const decompressedDataLength = buf.readIntLE(16, 4);
console.log(decompressedDataLength);
console.log(header + " - uncompressed length: " + decompressedDataLength);
// const dataBuf = buf.subarray(36, byteLength);
// const dataBufLength = dataBuf.byteLength;

const decompressedBitArray = [];

const bufLength = buf.length;
let bitOffset = 36;
while (bitOffset < bufLength) {
    const compressionBit = buf.readIntLE(bitOffset, 1);
    bitOffset++;
    console.log(`CHUNK:${bitOffset}, C:${compressionBit}`)
    if (!compressionBit) {
        const lengthBit = buf.readIntLE(bitOffset, 2);
        console.log(`CHUNK:${bitOffset}, L:${lengthBit}`)
        bitOffset += 2;
        const rawData = buf.readIntLE(bitOffset, lengthBit);
        decompressedBitArray.push(rawData);
        bitOffset += lengthBit;
    } else {
        console.log(`CHUNK:${bitOffset}, C:${compressionBit}`);

        const lengthBit = buf.readIntLE(bitOffset, 4);
        console.log(`CHUNK:${bitOffset} L:${lengthBit.toString(2)}` );
        console.log("CHUNK:bytes: " + lengthBit);

        const decompressedRaw = buf.readUIntBE(bitOffset, bitOffset);

        console.log("CHUNK:data " + decompressedRaw)
    }
}

console.log("DECOMPRESSED:", decompressedBitArray)
