import EncodeHintType from '../core/EncodeHintType';
declare class BrowserQRCodeSvgWriter {
    private static readonly QUIET_ZONE_SIZE;
    /**
     * SVG markup NameSpace
     */
    private static readonly SVG_NS;
    /**
     * A HTML container element for the image.
     */
    private containerElement;
    /**
     * Constructs. 😉
     */
    constructor(containerElement: string | HTMLElement);
    write(contents: string, width: number, height: number, hints?: Map<EncodeHintType, any>): SVGSVGElement;
    /**
     * Note that the input matrix uses 0 == white, 1 == black.
     * The output matrix uses 0 == black, 255 == white (i.e. an 8 bit greyscale bitmap).
     */
    private renderResult;
    private createSVGElement;
    private createSvgRectElement;
}
export { BrowserQRCodeSvgWriter };
