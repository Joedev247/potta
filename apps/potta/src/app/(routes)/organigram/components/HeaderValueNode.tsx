'use client';

import { memo } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';

interface HeaderValueNodeData {
  header: string;
  value: string;
  description?: string;
  icon?: string;
  color?: string;
  entity?: any;
  onAction?: (action: string, nodeId: string, entity?: any) => void;
  onViewEmployees?: (filters: any) => void;
}

interface HeaderValueNodeProps extends NodeProps {
  data: HeaderValueNodeData;
}

const HeaderValueNode = memo(({ data, id }: HeaderValueNodeProps) => {
  return (
    <div className="relative">
      <Handle
        type="target"
        position={Position.Top}
        className="w-3 h-3 !bg-gray-400 !border-2 !border-white"
      />

      <div className="bg-white border-2 border-gray-300 shadow-lg min-w-[280px]">
        {/* Header Section */}
        <div
          className="px-4 py-2 text-white text-xs font-semibold uppercase tracking-wider text-center"
          style={{ backgroundColor: data.color || '#6b7280' }}
        >
          {data.header}
        </div>

        {/* Value Section */}
        <div className="px-4 py-3 bg-white">
          <div className="text-gray-900 font-bold text-center text-lg">
            {data.value}
          </div>
          {data.description && (
            <div className="text-gray-600 text-xs mt-2 text-center">
              {data.description}
            </div>
          )}
        </div>
      </div>

      <Handle
        type="source"
        position={Position.Bottom}
        className="w-3 h-3 !bg-gray-400 !border-2 !border-white"
      />
    </div>
  );
});

HeaderValueNode.displayName = 'HeaderValueNode';

export default HeaderValueNode;
