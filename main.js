const fs = require('fs');


const buf = fs.readFileSync("files/one.gpx");


const byteLength = buf.byteLength;
console.log("Size: " + (byteLength / 1000) + "kb")

const header = new Uint8Array(buf.slice(0, 4), 0, 4);


// const decompressedDataLength = buf.readInt32LE(4);
const decompressedDataLength = buf.readIntLE(4, 32);
console.log(decompressedDataLength);

console.log(header + " - uncompressed length: " + decompressedDataLength);


const dataBuf = buf.subarray(36, byteLength);
const dataBufLength = dataBuf.byteLength;

const decompressedBitArray = [];

let bitOffset = 0;
while (bitOffset < dataBufLength) {
    const compressionBit = dataBuf.readIntLE(bitOffset, 1);
    bitOffset++;
    console.log("BLOCK:"+compressionBit);
    if (compressionBit) {
        console.log(`CHUNK:${bitOffset}, C:${compressionBit}`)
        const lengthBit = dataBuf.readIntLE(bitOffset, 2);
        console.log(`CHUNK:${bitOffset}, L:${lengthBit}`)
        bitOffset += 2;
        const rawData = dataBuf.readIntLE(bitOffset, lengthBit);
        decompressedBitArray.push(rawData);
        bitOffset += lengthBit;
    } else {
        console.log(`CHUNK:${bitOffset}, C:${compressionBit}`);

        const lengthBit = dataBuf.readIntLE(bitOffset, 4);
        console.log(`CHUNK:${bitOffset} L:${lengthBit.toString(2)}` );
        console.log("CHUNK:bytes: " + lengthBitExtracted);

        const chunkByteArray = [];
        for (let i = 0; i < lengthBitExtracted; i++) {
            bitOffset++;
            chunkByteArray.push(dataBuf.readUInt8(bitOffset))
        }
        console.log("CHUNK:data " + chunkByteArray)
    }

    byteOffset++;
}
