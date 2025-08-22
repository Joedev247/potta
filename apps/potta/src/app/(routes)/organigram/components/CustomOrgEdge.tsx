import { BaseEdge, EdgeProps } from 'reactflow';

export function CustomOrgEdge({
  sourceX,
  sourceY,
  targetX,
  targetY,
  style = {},
  markerEnd,
}: EdgeProps) {
  // Create orthogonal (step) path
  const centerY = (sourceY + targetY) / 2;

  const edgePath = `M ${sourceX} ${sourceY} L ${sourceX} ${centerY} L ${targetX} ${centerY} L ${targetX} ${targetY}`;

  return (
    <BaseEdge
      path={edgePath}
      markerEnd={markerEnd}
      style={{
        ...style,
        stroke: '#237804',
        strokeWidth: 2,
      }}
    />
  );
}
