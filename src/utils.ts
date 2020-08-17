export function hasChild(parent:Element, el:Element){
  var child = parent && parent.firstChild;
  
  while (child) {
    if (child === el) {
      return true;
    }

    child = child.nextSibling;
  }

  return false;
}
