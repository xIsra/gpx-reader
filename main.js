const fs = require('fs');


const buf = fs.readFileSync("files/one.gpx");
console.log(new Uint8Array(buf));


const byteLength = buf.byteLength;
console.log("Size: " + (byteLength / 1000) + "kb")

const header = new Uint8Array(buf.slice(0, 4), 0, 4);


const decompressedDataLength = buf.readInt32LE(4);
console.log(decompressedDataLength);

console.log(header + " - uncompressed length: " + decompressedDataLength);

const dataBuf = buf.subarray(7, byteLength);
const dataBufLength = dataBuf.byteLength;

let byteOffset = 0;
while (byteOffset < dataBufLength) {
    const compressionBit = dataBuf.readUInt8(byteOffset);
    if (compressionBit !== 1 && compressionBit !== 0) {
        throw new Error("error not a compression bit");
    }
    const isCompressed = compressionBit === 1;
    console.log(`CHUNK:${byteOffset}, C:${isCompressed}`)
    if (isCompressed) {
        const lengthBit = dataBuf.readUInt32BE(byteOffset++);
        const lengthBitExtracted = lengthBit >>> 28;
        console.log("CHUNK:bytes: " + lengthBitExtracted);

    } else {
        byteOffset++;
        const lengthBit = dataBuf.readUInt32LE(byteOffset);
        console.log(lengthBit.toString(2));
        const lengthBitExtracted = lengthBit >>> 30;
        console.log("CHUNK:bytes: " + lengthBitExtracted);

        const chunkByteArray = [];
        for (let i = 0; i < lengthBitExtracted; i++) {
            byteOffset++;
            chunkByteArray.push(dataBuf.readUInt8(byteOffset))
        }
        console.log("CHUNK:data " + chunkByteArray)
    }

    byteOffset++;
}
