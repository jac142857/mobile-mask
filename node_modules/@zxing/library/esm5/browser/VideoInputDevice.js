"use strict";
/**
 * Video input device metadata containing the id and label of the device if available.
 *
 * @export
 * @class VideoInputDevice
 */
Object.defineProperty(exports, "__esModule", { value: true });
var VideoInputDevice = /** @class */ (function () {
    /**
     * Creates an instance of VideoInputDevice.
     * @param {string} deviceId the video input device id
     * @param {string} label the label of the device if available
     *
     * @memberOf VideoInputDevice
     */
    function VideoInputDevice(deviceId, label) {
        this.deviceId = deviceId;
        this.label = label;
    }
    return VideoInputDevice;
}());
exports.VideoInputDevice = VideoInputDevice;
//# sourceMappingURL=VideoInputDevice.js.map