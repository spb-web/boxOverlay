export const hasChild = (parent:Element, el:Element) => {
  var child = parent && parent.firstChild;
  
  while (child) {
    if (child === el) {
      return true;
    }

    child = child.nextSibling;
  }

  return false;
}

export const applyStyle = <T extends Partial<CSSStyleDeclaration>>(
  element:HTMLElement,
  styles:T,
) => {
  Object.entries(styles).forEach(([key, value]:any[]) => {
    element.style[key] = value
  })
}

export const isEqualDOMRect = (
  firstDOMRect:{x:number, y:number, width:number, height: number}|null,
  secondDOMRect:{x:number, y:number, width:number, height: number}|null,
) => (
  (firstDOMRect === null && secondDOMRect === null)
  || (
    firstDOMRect
    && secondDOMRect
    && (firstDOMRect.x === secondDOMRect.x
    && firstDOMRect.y === secondDOMRect.y
    && firstDOMRect.width === secondDOMRect.width
    && firstDOMRect.height === secondDOMRect.height)
  )
)