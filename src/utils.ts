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

export const setDefaultOverlayStyles = (element:HTMLElement) => {
  applyStyle(element, {
    position: `fixed`,
    left: '0',
    top: '0',
  })
}