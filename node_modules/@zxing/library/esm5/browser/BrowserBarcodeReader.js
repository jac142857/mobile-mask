"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var BrowserCodeReader_1 = require("./BrowserCodeReader");
var MultiFormatOneDReader_1 = require("../core/oned/MultiFormatOneDReader");
/**
 * Barcode reader reader to use from browser.
 *
 * @class BrowserBarcodeReader
 * @extends {BrowserCodeReader}
 */
var BrowserBarcodeReader = /** @class */ (function (_super) {
    __extends(BrowserBarcodeReader, _super);
    /**
     * Creates an instance of BrowserBarcodeReader.
     * @param {number} [timeBetweenScansMillis=500] the time delay between subsequent decode tries
     * @param {Map<DecodeHintType, any>} hints
     * @memberOf BrowserBarcodeReader
     */
    function BrowserBarcodeReader(timeBetweenScansMillis, hints) {
        if (timeBetweenScansMillis === void 0) { timeBetweenScansMillis = 500; }
        return _super.call(this, new MultiFormatOneDReader_1.default(hints), timeBetweenScansMillis, hints) || this;
    }
    return BrowserBarcodeReader;
}(BrowserCodeReader_1.BrowserCodeReader));
exports.BrowserBarcodeReader = BrowserBarcodeReader;
//# sourceMappingURL=BrowserBarcodeReader.js.map