/**
 *
 * @param buffer:Buffer
 */
const fs = require("fs");
const assert = require("assert");

class BitBuffer {

    constructor(data) {
        // this.buffer = fs.readFileSync("files/one.gpx");
        this.buffer = Buffer.from(data);
        this.bufferLength = this.buffer.length;
        this.bitOffset = 0;
        this.byteOffset = 0;
    }

    readBit() {
        if (this.bitOffset <= 0) {
            this.byte = this.buffer.readUInt8(this.byteOffset)
            // this.byte = buf[0];
            this.bitOffset = 0;
        }
        let bit = (this.byte >> (7 - this.bitOffset)) & 0x1;

        if (this.bitOffset >= 7) {
            this.bitOffset = 0;
            this.byteOffset++;
        } else {
            this.bitOffset += 1;
        }
        return bit;
    }

    // bigEndian MSB
    readBits(count) {
        console.assert(count <= 64);
        let word = 0;
        for (let i = 0; i < count; i++) {
            let bit = this.readBit();
            word = word + (bit << (count - 1 - i));
        }
        return word
    }

    readBitsReversed(count) {
        let word = 0;
        for (let i = 0; i < count; i++) {
            let bit = this.readBit();
            word = word + (bit << i);
        }
        return word;
    }

    readUInt16() {
        const value = this.readBits(16);
        return reverse(value);
    }

    readUInt16BE() {
        const data = this.readBits(16);
        return data;
    }
}


// pub fn test_bit_buffer_read_bit() {
let data = [0b11001010, 0b11110000];
let bb = new BitBuffer(data);
let bits = Array.from(new Array(16)).map(_ => bb.readBit());
assert.deepStrictEqual(bits, [1, 1, 0, 0, 1, 0, 1, 0, 1, 1, 1, 1, 0, 0, 0, 0]);


let bb2 = new BitBuffer(data);
let bits2 = bb2.readBitsReversed(8);
assert.strictEqual(bits2, 83);


let bb3 = new BitBuffer(data);
let bits3 = bb3.readBitsReversed(7);
assert.strictEqual(bits3, 83);

let bb4 = new BitBuffer(data);
let bits4 = bb4.readBits(8);
assert.strictEqual(bits4, 202);

let bb5 = new BitBuffer(data);
let bits5 = bb5.readBits(7);
assert.strictEqual(bits5, 101);

let data2 = [0b11001010, 0b11110000, 0b11110000];
let bb6 = new BitBuffer(data2);
bb6.readBits(2);
let num1 = bb6.readUInt16(); //00101011_11000011
assert.strictEqual(num1, 50132); // orginal:49963

let bb7 = new BitBuffer(data2);
bb7.readBits(2);
let num2 = bb7.readUInt16BE(); //00101011_11000011
assert.strictEqual(num2, 11203);

function bitReverse(n) {
    let i = 0
    let reversed = 0
    let last
    while (i < 16) {
        last = n & 1
        n >>= 1
        reversed <<= 1
        reversed += last
        i++
    }
    return reversed
}

function reverse(bits) {
    var x = new Uint16Array(1);
    x[0] = bits;
    // x[0] = ((x[0] & 0x0000ffff) << 16) | ((x[0] & 0xffff0000) >>> 16);
    x[0] = ((x[0] & 0x55555555) << 1) | ((x[0] & 0xAAAAAAAA) >>> 1);
    x[0] = ((x[0] & 0x33333333) << 2) | ((x[0] & 0xCCCCCCCC) >>> 2);
    x[0] = ((x[0] & 0x0F0F0F0F) << 4) | ((x[0] & 0xF0F0F0F0) >>> 4);
    x[0] = ((x[0] & 0x00FF00FF) << 8) | ((x[0] & 0xFF00FF00) >>> 8);
    return x[0];
}
