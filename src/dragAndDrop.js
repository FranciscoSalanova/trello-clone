import addGlobalEventListener from "../utils/addGlobalEventListener.js"

export default function setupDragAndDrop() {
  addGlobalEventListener("mousedown", "[data-draggable]", (e) => {
    const selectedNode = e.target
    const itemClone = selectedNode.cloneNode(true)
    itemClone.classList.add("dragging")

    positionClone(itemClone, e)
    document.body.append(itemClone)
    selectedNode.classList.add("hide")

    const moveMouseFunction = (e) => {
      positionClone(itemClone, e)
    }
    document.addEventListener("mousemove", moveMouseFunction)

    document.addEventListener(
      "mouseup",
      (e) => {
        document.removeEventListener("mousemove", moveMouseFunction)
        selectedNode.classList.remove("hide")
        itemClone.remove()
      },
      { once: true }
    )
  })
}

function positionClone(itemClone, mousePosition) {
  itemClone.style.top = `${mousePosition.clientY}px`
  itemClone.style.left = `${mousePosition.clientX}px`
}
