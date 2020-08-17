export declare class Overlay {
    private element;
    constructor();
    private style;
    set color(color: string);
    get color(): string;
    get borderRadius(): number;
    set borderRadius(radius: number);
    getElement(): HTMLDivElement;
    setRect(rect: DOMRect | null): void;
    mount(): void;
    destroy(): void;
    private applyStyle;
}
