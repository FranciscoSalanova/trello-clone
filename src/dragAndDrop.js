import addGlobalEventListener from '../utils/addGlobalEventListener.js'

export default function setupDragAndDrop() {
  addGlobalEventListener('mousedown', '[data-draggable]', (e) => {
    const selectedNode = e.target
    const itemClone = selectedNode.cloneNode(true)
    const ghost = selectedNode.cloneNode()

    const offset = setupDragItems(selectedNode, itemClone, ghost, e)

    setupDragEvents(selectedNode, itemClone, offset)
  })
}

function setupDragItems(selectedNode, itemClone, ghost, e) {
  const originalRect = selectedNode.getBoundingClientRect()
  const offset = {
    x: e.clientX - originalRect.left,
    y: e.clientY - originalRect.top,
  }

  selectedNode.classList.add('hide')

  itemClone.classList.add('dragging')
  itemClone.style.width = `${originalRect.width}px`
  positionClone(itemClone, e, offset)
  document.body.append(itemClone)

  ghost.classList.add('ghost')
  ghost.innerHTML = ''
  selectedNode.parentElement.insertBefore(ghost, selectedNode)

  return offset
}

function setupDragEvents(selectedNode, itemClone, offset) {
  const moveMouseFunction = (e) => {
    positionClone(itemClone, e, offset)
  }
  document.addEventListener('mousemove', moveMouseFunction)

  document.addEventListener(
    'mouseup',
    (e) => {
      document.removeEventListener('mousemove', moveMouseFunction)
      selectedNode.classList.remove('hide')
      itemClone.remove()
    },
    { once: true }
  )
}

function positionClone(itemClone, mousePosition, offset) {
  itemClone.style.top = `${mousePosition.clientY - offset.y}px`
  itemClone.style.left = `${mousePosition.clientX - offset.x}px`
}
