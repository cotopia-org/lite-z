import { VARZ } from "@/const/varz"
import { Node } from "@xyflow/react"

export const thunkResHandler = (
  thunkRes: Promise<any>,
  thunkKey: string,
  onSuccess: (res: any) => void,
  onError: (res: any) => void
): void => {
  thunkRes.then((res) => {
    if (res.type === `${thunkKey}/fulfilled`) {
      onSuccess(res)
    } else if (res.type === `${thunkKey}/rejected`) {
      onError(res)
    }
  })
}

export const checkNodesCollision = (
  myNode: Node,
  targetNode: Node,
  jailNode?: Node
) => {
  //get target node position
  let target_x = targetNode?.position?.x
  let target_y = targetNode?.position?.y

  const target_position = target_x >= 0 && target_y >= 0
  //get my node position
  let my_node_x = myNode.position.x
  let my_node_y = myNode.position.y

  const my_node_position = my_node_x >= 0 && my_node_y >= 0

  let COLLISION_MARGIN = VARZ.collisionMargin
  //find center of target node
  let target_measure_w = targetNode?.measured?.width
  let target_measure_h = targetNode?.measured?.height
  let my_node_measure_w = myNode?.measured?.width
  let my_node_measure_h = myNode?.measured?.height

  if (!target_measure_w || !target_measure_h)
    return { x_position: target_x, y_position: target_y }
  if (!my_node_measure_w || !my_node_measure_h)
    return { x_position: my_node_x, y_position: my_node_y }

  let target_radius = target_measure_w / 2
  let my_node_radius = my_node_measure_w / 2

  const center_x = target_x + target_measure_w / 2
  const center_y = target_y + target_measure_h / 2

  const my_center_x = my_node_x + my_node_measure_w / 2
  const my_center_y = my_node_y + my_node_measure_h / 2

  let total_radius = target_radius + my_node_radius
  let distance = total_radius

  let has_collied = false

  if (my_node_position && target_position) {
    distance = Math.sqrt(
      Math.pow(center_x - my_center_x, 2) + Math.pow(center_y - my_center_y, 2)
    )
  }

  if (target_measure_w) {
    COLLISION_MARGIN = target_measure_w
  }

  let top_dir = false
  let bottom_dir = false
  let left_dir = false
  let right_dir = false

  if (my_node_x <= target_x + target_measure_w) {
    right_dir = true
  } else {
    right_dir = false
  }
  if (my_node_x + my_node_measure_w > target_x) {
    left_dir = true
  } else {
    left_dir = false
  }
  if (my_node_y <= target_y + target_measure_h) {
    bottom_dir = true
  } else {
    bottom_dir = false
  }
  if (my_node_y + my_node_measure_h > target_y) {
    top_dir = true
  }

  let final_x = target_x
  let final_y = target_y

  if (right_dir) {
    final_x = target_x + COLLISION_MARGIN
    final_y = my_node_y
  }
  if (left_dir) {
    final_x = target_x - my_node_measure_w
    final_y = my_node_y
  }
  if (bottom_dir) {
    final_x = my_node_x
    final_y = target_y + my_node_y
  }
  if (top_dir) {
    final_x = my_node_x
    final_y = target_y - my_node_measure_h
  }

  if (distance < total_radius) {
    has_collied = true
  }

  if (jailNode) {
    const jail_x = jailNode.position.x
    const jail_y = jailNode.position.y
    const jail_w = jailNode?.measured?.width ?? VARZ.jailWidth
    const jail_h = jailNode?.measured?.height ?? VARZ.jailHeight
    const max_y = jail_y + jail_h
    const max_x = jail_x + jail_w

    console.log(max_x, max_y, final_x, final_y)
    if (final_x <= jail_x) {
      final_x = jail_x + my_node_measure_w
      final_y = final_y + my_node_measure_w
    }
    if (final_x >= max_x) {
      final_x = max_x - my_node_measure_w
      final_y = final_y + my_node_measure_w
    }
    if (final_y <= jail_y) {
      final_y = jail_y + my_node_measure_h
      final_x = final_x + my_node_measure_h
    }
    if (final_y >= max_y) {
      final_y = max_y - my_node_measure_h
      final_x = final_x + my_node_measure_h
    }
  }

  return { x_position: final_x, y_position: final_y, distance, has_collied }
}
