import { VARZ } from '@/const/varz';
import { UserMinimalType } from '@/types/user';
import { Node, Viewport } from '@xyflow/react';

export const thunkResHandler = (
  thunkRes: Promise<any>,
  thunkKey: string,
  onSuccess: (res: any) => void,
  onError: (res: any) => void,
): void => {
  thunkRes.then((res) => {
    if (res.type === `${thunkKey}/fulfilled`) {
      onSuccess(res);
    } else if (res.type === `${thunkKey}/rejected`) {
      onError(res);
    }
  });
};

function doLinesIntersect(
  p1: { x: number; y: number },
  p2: { x: number; y: number },
  p3: { x: number; y: number },
  p4: { x: number; y: number },
): boolean {
  const orientation = (
    a: { x: number; y: number },
    b: { x: number; y: number },
    c: { x: number; y: number },
  ) => (b.y - a.y) * (c.x - b.x) - (b.x - a.x) * (c.y - b.y);

  const o1 = orientation(p1, p2, p3);
  const o2 = orientation(p1, p2, p4);
  const o3 = orientation(p3, p4, p1);
  const o4 = orientation(p3, p4, p2);

  return o1 * o2 < 0 && o3 * o4 < 0;
}

export const checkNodesCollision = (
  myNode: Node,
  targetNode: Node,
  jailNode?: Node,
) => {
  //get target node position
  let target_x = targetNode?.position?.x;
  let target_y = targetNode?.position?.y;

  const target_position = target_x >= 0 && target_y >= 0;
  //get my node position
  let my_node_x = myNode.position.x;
  let my_node_y = myNode.position.y;

  const my_node_position = my_node_x >= 0 && my_node_y >= 0;

  let COLLISION_MARGIN = VARZ.collisionMargin;
  //find center of target node
  let target_measure_w = targetNode?.measured?.width;
  let target_measure_h = targetNode?.measured?.height;
  let my_node_measure_w = myNode?.measured?.width;
  let my_node_measure_h = myNode?.measured?.height;

  if (!target_measure_w || !target_measure_h)
    return { x_position: target_x, y_position: target_y };
  if (!my_node_measure_w || !my_node_measure_h)
    return { x_position: my_node_x, y_position: my_node_y };

  let target_radius = target_measure_w / 2;
  let my_node_radius = my_node_measure_w / 2;

  const center_x = target_x + target_measure_w / 2;
  const center_y = target_y + target_measure_h / 2;

  const my_center_x = my_node_x + my_node_measure_w / 2;
  const my_center_y = my_node_y + my_node_measure_h / 2;

  let total_radius = target_radius + my_node_radius;
  let distance = total_radius;

  let has_collied = false;

  if (my_node_position && target_position) {
    distance = Math.sqrt(
      Math.pow(center_x - my_center_x, 2) + Math.pow(center_y - my_center_y, 2),
    );
  }

  if (target_measure_w) {
    COLLISION_MARGIN = target_measure_w;
  }

  let top_dir = false;
  let bottom_dir = false;
  let left_dir = false;
  let right_dir = false;

  if (my_node_x <= target_x + target_measure_w) {
    right_dir = true;
  } else {
    right_dir = false;
  }
  if (my_node_x + my_node_measure_w > target_x) {
    left_dir = true;
  } else {
    left_dir = false;
  }
  if (my_node_y <= target_y + target_measure_h) {
    bottom_dir = true;
  } else {
    bottom_dir = false;
  }
  if (my_node_y + my_node_measure_h > target_y) {
    top_dir = true;
  }

  let final_x = target_x;
  let final_y = target_y;

  if (right_dir) {
    final_x = target_x + COLLISION_MARGIN;
    final_y = my_node_y;
  }
  if (left_dir) {
    final_x = target_x - my_node_measure_w;
    final_y = my_node_y;
  }
  if (bottom_dir) {
    final_x = my_node_x;
    final_y = target_y + my_node_y;
  }
  if (top_dir) {
    final_x = my_node_x;
    final_y = target_y - my_node_measure_h;
  }

  if (distance < total_radius) {
    has_collied = true;
  }

  if (jailNode) {
    const jail_x = jailNode.position.x;
    const jail_y = jailNode.position.y;
    const jail_w = jailNode?.measured?.width ?? VARZ.jailWidth;
    const jail_h = jailNode?.measured?.height ?? VARZ.jailHeight;
    const max_y = jail_y + jail_h;
    const max_x = jail_x + jail_w;

    if (final_x <= jail_x) {
      final_x = jail_x + my_node_measure_w;
      final_y = final_y + my_node_measure_w;
    }
    if (final_x >= max_x) {
      final_x = max_x - my_node_measure_w;
      final_y = final_y + my_node_measure_w;
    }
    if (final_y <= jail_y) {
      final_y = jail_y + my_node_measure_h;
      final_x = final_x + my_node_measure_h;
    }
    if (final_y >= max_y) {
      final_y = max_y - my_node_measure_h;
      final_x = final_x + my_node_measure_h;
    }
  }

  return { x_position: final_x, y_position: final_y, distance, has_collied };
};

function isLineIntersectingRectangle(
  rect: Viewport & { width: number; height: number },
  lineStart: { x: number; y: number },
  lineEnd: { x: number; y: number },
): boolean {
  //define four sides of rectangle

  const rectLines = [
    {
      start: { x: rect.x, y: rect.y },
      end: { x: rect.x + rect.width, y: rect.y },
    },
    {
      start: { x: rect.x, y: rect.y },
      end: { x: rect.x, y: rect.y + rect.height },
    },
    {
      start: { x: rect.x + rect.width, y: rect.y },
      end: {
        x: rect.x + rect.width,
        y: rect.y + rect.height,
      },
    },
    {
      start: { x: rect.x, y: rect.y + rect.height },
      end: {
        x: rect.x + rect.width,
        y: rect.y + rect.height,
      },
    },
  ];

  return rectLines.some(({ start, end }) => {
    return doLinesIntersect(lineStart, lineEnd, start, end);
  });
}

// function checkNodesInViewport(
//   viewport: Viewport & { width: number; height: number },
//   nodes: Node[]
// ) {
//   const viewportCenter = {
//     x: viewport.x + viewport.width / 2,
//     y: viewport.y + viewport.height / 2,
//   }

//   return nodes.map((node) => {
//     const nodeCenter = {
//       x: node.position.x + (node.measured?.width ?? 94) / 2,
//       y: node.position.y + (node.measured?.height ?? 94) / 2,
//     }

//     const intersects = isLineIntersectingRectangle(
//       viewport,
//       viewportCenter,
//       nodeCenter
//     )

//     return {
//       node,
//       isOutside: intersects,
//     }
//   })
// }

const checkNodesInViewport = () => {};

const doesLineIntersectRectangle = (
  rect: Viewport & { width: number; height: number },
  lineStart: { x: number; y: number },
  lineEnd: { x: number; y: number },
) => {
  const { x: rx, y: ry, width, height } = rect;

  // مختصات چهار ضلع مستطیل
  const left = rx; // ضلع چپ
  const right = rx + width; // ضلع راست
  const top = ry; // ضلع بالا
  const bottom = ry + height; // ضلع پایین

  // تابع محاسبه y بر اساس x
  const getY = (x: number, x1: number, y1: number, x2: number, y2: number) =>
    y1 + ((y2 - y1) * (x - x1)) / (x2 - x1);

  // تابع محاسبه x بر اساس y
  const getX = (y: number, x1: number, y1: number, x2: number, y2: number) =>
    x1 + ((x2 - x1) * (y - y1)) / (y2 - y1);

  // بررسی تقاطع با اضلاع مستطیل
  const intersectsTop = getX(
    top,
    lineStart.x,
    lineStart.y,
    lineEnd.x,
    lineEnd.y,
  ); // تقاطع با ضلع بالا
  const intersectsBottom = getX(
    bottom,
    lineStart.x,
    lineStart.y,
    lineEnd.x,
    lineEnd.y,
  ); // تقاطع با ضلع پایین
  const intersectsLeft = getY(
    left,
    lineStart.x,
    lineStart.y,
    lineEnd.x,
    lineEnd.y,
  ); // تقاطع با ضلع چپ
  const intersectsRight = getY(
    right,
    lineStart.x,
    lineStart.y,
    lineEnd.x,
    lineEnd.y,
  ); // تقاطع با ضلع راست

  // بررسی اینکه نقاط تقاطع در بازه اضلاع مستطیل قرار دارند یا نه
  const topInBounds = intersectsTop >= left && intersectsTop <= right; // داخل بازه ضلع بالا
  const bottomInBounds = intersectsBottom >= left && intersectsBottom <= right; // داخل بازه ضلع پایین
  const leftInBounds = intersectsLeft >= top && intersectsLeft <= bottom; // داخل بازه ضلع چپ
  const rightInBounds = intersectsRight >= top && intersectsRight <= bottom; // داخل بازه ضلع راست

  // آیا خط با مستطیل برخورد دارد؟
  return topInBounds || bottomInBounds || leftInBounds || rightInBounds;
};
export const getExternalNodesFromViewport = (
  user: UserMinimalType,
  viewport: Viewport & { width: number; height: number },
  nodes: Node[],
) => {
  let vx = viewport.x;
  let vy = viewport.y;
  let zoom = viewport.zoom;
  const v_mutable_x = Math.abs(vx);
  const v_mutable_y = Math.abs(vy);

  let final_nodes = nodes.map((n) => {
    const is_my_account = n.id === user.username;
    //check applying scaling user that we setted 0.6 to user width and height if thats not my user
    const z_width = n.measured?.width ?? 94 * zoom;
    const z_height = n.measured?.height ?? 94 * zoom;
    return {
      ...n,
      position: { x: n.position.x * zoom, y: n.position.y * zoom },
      measured: {
        width: !is_my_account ? z_width * 0.6 : z_width,
        heigth: !is_my_account ? z_height * 0.6 : z_height,
      },
    };
  });

  let internal_nodes: Node[] = [];

  for (let node of final_nodes) {
    const v_center = {
      x: viewport.x + viewport.width / 2,
      y: viewport.y + viewport.height / 2,
    };
    const target_center = {
      x: node.position.x + node.measured.width / 2,
      y: node.position.y + node.measured.heigth / 2,
    };

    const outside_left = node.position.x + node.measured.width < v_mutable_x;
    const outside_right = node.position.x > v_mutable_x + viewport.width;
    const outside_top = node.position.y + node.measured.heigth < v_mutable_y;
    const outside_bottom = node.position.y > v_mutable_y + viewport.height;

    if (!outside_left && !outside_right && !outside_top && !outside_bottom) {
      internal_nodes.push(node);
    }

    // const has_collision = doesLineIntersectRectangle(
    //   { ...viewport, x: mutable_x, y: mutable_y },
    //   v_center,
    //   target_center
    // )
    // if (has_collision) {
    //   internal_nodes.push(node)
    // }
  }

  return internal_nodes;

  // return checkNodesInViewport(
  //   { ...viewport, x: mutable_x, y: mutable_y, zoom },
  //   final_nodes
  // )
};

export const isPathIncluded = (path: string, formats: string[]): boolean => {
  const regexes = formats.map((format) => {
    const regexString = format.replace(/:[^/]+/g, '[^/]+');
    return new RegExp(`^${regexString}$`);
  });

  return !regexes.some((regex) => regex.test(path));
};
