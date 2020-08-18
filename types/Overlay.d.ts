export declare class Overlay {
    private element;
    private disableEventsElement;
    constructor();
    private style;
    set color(color: string);
    get color(): string;
    get borderRadius(): number;
    set borderRadius(radius: number);
    get zIndex(): number;
    set zIndex(zIndex: number);
    getElement(): HTMLDivElement;
    setRect(rect: DOMRect | null): void;
    mount(): void;
    destroy(): void;
    private applyStyle;
}
