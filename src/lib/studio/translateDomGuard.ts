/**
 * Google Translate rewrites the live DOM (wrapping text nodes in <font>), so React can
 * later try to remove/insert relative to a node that is no longer a child of its parent
 * and throw NotFoundError. Tolerate those stale references instead of crashing the tree.
 * See https://github.com/facebook/react/issues/11538
 */
let installed = false

export function installTranslateDomGuard(): void {
  if (installed || typeof Node === 'undefined') return
  installed = true

  const originalRemoveChild = Node.prototype.removeChild
  Node.prototype.removeChild = function removeChild<T extends Node>(this: Node, child: T): T {
    if (child.parentNode !== this) {
      return child
    }
    return originalRemoveChild.call(this, child) as T
  }

  const originalInsertBefore = Node.prototype.insertBefore
  Node.prototype.insertBefore = function insertBefore<T extends Node>(
    this: Node,
    newNode: T,
    referenceNode: Node | null,
  ): T {
    if (referenceNode && referenceNode.parentNode !== this) {
      return originalInsertBefore.call(this, newNode, null) as T
    }
    return originalInsertBefore.call(this, newNode, referenceNode) as T
  }
}
