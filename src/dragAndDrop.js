import addGlobalEventListener from "../utils/addGlobalEventListener.js"

export default function setupDragAndDrop(onDragComplete) {
  addGlobalEventListener("mousedown", "[data-draggable]", (e) => {
    const selectedNode = e.target
    const itemClone = selectedNode.cloneNode(true)
    const ghost = selectedNode.cloneNode()

    const offset = setupDragItems(selectedNode, itemClone, ghost, e)

    setupDragEvents(selectedNode, itemClone, offset, ghost, onDragComplete)
  })
}

function setupDragItems(selectedNode, itemClone, ghost, e) {
  const originalRect = selectedNode.getBoundingClientRect()
  const offset = {
    x: e.clientX - originalRect.left,
    y: e.clientY - originalRect.top,
  }

  selectedNode.classList.add("hide")

  itemClone.classList.add("dragging")
  itemClone.style.width = `${originalRect.width}px`
  positionClone(itemClone, e, offset)
  document.body.append(itemClone)

  ghost.style.height = `${originalRect.height}px`
  ghost.classList.add("ghost")
  ghost.innerHTML = ""
  selectedNode.parentElement.insertBefore(ghost, selectedNode)

  return offset
}

function setupDragEvents(
  selectedNode,
  itemClone,
  offset,
  ghost,
  onDragComplete
) {
  const moveMouseFunction = (e) => {
    positionClone(itemClone, e, offset)

    const dropZone = getDropZone(e.target)
    if (dropZone == null) return

    const closestChild = Array.from(dropZone.children).find((child) => {
      const rect = child.getBoundingClientRect()
      return e.clientY < rect.top + rect.height / 2
    })

    if (closestChild !== null) {
      dropZone.insertBefore(ghost, closestChild)
    } else {
      dropZone.append(ghost)
    }
  }

  document.addEventListener("mousemove", moveMouseFunction)

  document.addEventListener(
    "mouseup",
    (e) => {
      document.removeEventListener("mousemove", moveMouseFunction)

      const dropZone = getDropZone(ghost)
      if (dropZone) {
        onDragComplete({
          startZone: getDropZone(selectedNode),
          endZone: dropZone,
          dragElement: selectedNode,
          index: Array.from(dropZone.children).indexOf(ghost),
        })
        dropZone.insertBefore(selectedNode, ghost)
      }

      stopDrag(selectedNode, itemClone, ghost)
    },
    { once: true }
  )
}

function positionClone(itemClone, mousePosition, offset) {
  itemClone.style.top = `${mousePosition.clientY - offset.y}px`
  itemClone.style.left = `${mousePosition.clientX - offset.x}px`
}

function stopDrag(selectedNode, itemClone, ghost) {
  selectedNode.classList.remove("hide")
  itemClone.remove()
  ghost.remove()
}

function getDropZone(element) {
  if (element.matches("[data-drop-zone]")) {
    return element
  } else {
    return element.closest("[data-drop-zone]")
  }
}
