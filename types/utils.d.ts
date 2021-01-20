export declare const hasChild: (parent: Element, el: Element) => boolean;
export declare const applyStyle: <T extends Partial<CSSStyleDeclaration>>(element: HTMLElement, styles: T) => void;
export declare const isEqualDOMRect: (firstDOMRect: {
    x: number;
    y: number;
    width: number;
    height: number;
} | null, secondDOMRect: {
    x: number;
    y: number;
    width: number;
    height: number;
} | null) => boolean | null;
