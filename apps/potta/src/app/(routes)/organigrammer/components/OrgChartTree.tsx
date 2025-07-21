import React, { useState, useRef, useLayoutEffect, useEffect } from 'react';
import { Tree, TreeNode } from 'react-organizational-chart';
import { OrgChart, OrgChartNode } from './OrgSidebarBuilder';
import { AiTwotoneEdit } from 'react-icons/ai';
import { IoTrashOutline } from 'react-icons/io5';

interface OrgChartTreeProps {
  orgChart: OrgChart | null;
  nodes: OrgChartNode[];
  onAddNode: (node: OrgChartNode) => void;
  onEditNode?: (node: OrgChartNode) => void;
  onDeleteNode?: (name: string) => void;
}

function buildTree(nodes: OrgChartNode[], orgChartName: string) {
  const filtered = nodes.filter((n) => n.orgChartName === orgChartName);
  const nodeMap: Record<string, OrgChartNode & { children: OrgChartNode[] }> =
    {};
  filtered.forEach((node) => {
    nodeMap[node.name] = { ...node, children: [] };
  });
  const roots: (OrgChartNode & { children: OrgChartNode[] })[] = [];
  filtered.forEach((node) => {
    if (node.parentName && nodeMap[node.parentName]) {
      nodeMap[node.parentName].children.push(nodeMap[node.name]);
    } else {
      roots.push(nodeMap[node.name]);
    }
  });
  return roots;
}

export default function OrgChartTree({
  orgChart,
  nodes,
  onAddNode,
  onEditNode,
  onDeleteNode,
}: OrgChartTreeProps) {
  const [addOpenNode, setAddOpenNode] = useState<string | null>(null);
  const [showTopLevelAdd, setShowTopLevelAdd] = useState(false);
  const [form, setForm] = useState({
    name: '',
    title: '',
    roleType: 'standard',
    standardRole: '',
    email: '',
    department: '',
  });
  // Reset form when opening top-level add node modal
  React.useEffect(() => {
    if (showTopLevelAdd) {
      setForm({
        name: '',
        title: '',
        roleType: 'standard',
        standardRole: '',
        email: '',
        department: '',
      });
    }
  }, [showTopLevelAdd]);
  if (!orgChart)
    return <div className="text-gray-400">Select an org chart to view.</div>;
  const roots = buildTree(nodes, orgChart.name);
  if (roots.length === 0)
    return (
      <div className="relative overflow-auto p-4 flex flex-col items-center justify-center min-h-[300px]">
        <button
          className="bg-[#154406] text-white px-6 py-2 rounded mb-6"
          onClick={() => setShowTopLevelAdd(true)}
        >
          + Add Top Level Node
        </button>
        {showTopLevelAdd && (
          <div
            className="fixed z-50 w-[320px] animate-fade-in"
            style={{ left: '50%', top: '30%', transform: 'translate(-50%, 0)' }}
          >
            <div className="p-4 bg-white border border-[#154406]">
              <input
                className="border px-2 py-1 w-full mb-2"
                type="text"
                placeholder="Full Name"
                value={form.name}
                onChange={(e) =>
                  setForm((f) => ({ ...f, name: e.target.value }))
                }
              />
              <input
                className="border px-2 py-1 w-full mb-2"
                type="text"
                placeholder="Title"
                value={form.title}
                onChange={(e) =>
                  setForm((f) => ({ ...f, title: e.target.value }))
                }
              />
              <input
                className="border px-2 py-1 w-full mb-2"
                type="email"
                placeholder="Email"
                value={form.email}
                onChange={(e) =>
                  setForm((f) => ({ ...f, email: e.target.value }))
                }
              />
              <input
                className="border px-2 py-1 w-full mb-2"
                type="text"
                placeholder="Department (optional)"
                value={form.department}
                onChange={(e) =>
                  setForm((f) => ({ ...f, department: e.target.value }))
                }
              />
              <select
                className="border px-2 py-1 w-full mb-2"
                value={form.standardRole}
                onChange={(e) =>
                  setForm((f) => ({ ...f, standardRole: e.target.value }))
                }
              >
                <option value="">Select Standard Role</option>
                <option value="CEO">CEO</option>
                <option value="VP">VP</option>
                <option value="MANAGER">Manager</option>
                <option value="STAFF">Staff</option>
              </select>
              <div className="flex gap-2 mt-3">
                <button
                  className="flex-1 border border-[#154406] text-[#154406] py-1"
                  onClick={() => setShowTopLevelAdd(false)}
                >
                  Cancel
                </button>
                <button
                  className="flex-1 bg-[#154406] text-white py-1"
                  onClick={() => {
                    onAddNode({
                      ...form,
                      orgChartName: orgChart.name,
                      roleType: 'standard',
                      parentName: null,
                    });
                    setShowTopLevelAdd(false);
                  }}
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  return (
    <div className="relative overflow-auto p-4">
      <Tree
        lineWidth={'2px'}
        lineColor={'#154406'}
        lineBorderRadius={''}
        label={
          <div className="text-lg font-bold text-[#154406]">
            {orgChart.name}
            <div className="text-xs font-normal text-gray-400">
              {orgChart.description}
            </div>
          </div>
        }
      >
        {roots.map((root) => (
          <OrgChartNodeBox
            key={root.name}
            node={root}
            orgChartName={orgChart.name}
            allNodes={nodes}
            onAddNode={onAddNode}
            onEditNode={onEditNode}
            onDeleteNode={onDeleteNode}
            addOpenNode={addOpenNode}
            setAddOpenNode={setAddOpenNode}
          />
        ))}
      </Tree>
    </div>
  );
}

function OrgChartNodeBox({
  node,
  orgChartName,
  allNodes,
  onAddNode,
  onEditNode,
  onDeleteNode,
  addOpenNode,
  setAddOpenNode,
}: {
  node: OrgChartNode & { children?: OrgChartNode[] };
  orgChartName: string;
  allNodes: OrgChartNode[];
  onAddNode: (node: OrgChartNode) => void;
  onEditNode?: (node: OrgChartNode) => void;
  onDeleteNode?: (name: string) => void;
  addOpenNode: string | null;
  setAddOpenNode: (name: string | null) => void;
}) {
  const [editOpen, setEditOpen] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const addNodeAnchor = useRef<HTMLSpanElement>(null);
  const [addFormPos, setAddFormPos] = useState<'bottom' | 'top'>('bottom');
  const [deletePos, setDeletePos] = useState<'bottom' | 'top'>('bottom');

  // For role select
  const roleOptions = [
    { value: 'CEO', label: 'CEO' },
    { value: 'VP', label: 'VP' },
    { value: 'MANAGER', label: 'Manager' },
    { value: 'STAFF', label: 'Staff' },
  ];

  // Positioning logic for add/edit/delete forms
  useLayoutEffect(() => {
    if ((addOpenNode === node.name || editOpen) && addNodeAnchor.current) {
      const anchorRect = addNodeAnchor.current.getBoundingClientRect();
      const spaceBelow = window.innerHeight - anchorRect.bottom;
      setAddFormPos(spaceBelow < 320 ? 'top' : 'bottom');
    }
    if (confirmDelete && addNodeAnchor.current) {
      const anchorRect = addNodeAnchor.current.getBoundingClientRect();
      const spaceBelow = window.innerHeight - anchorRect.bottom;
      setDeletePos(spaceBelow < 120 ? 'top' : 'bottom');
    }
  }, [addOpenNode, editOpen, confirmDelete, node.name]);

  // Add/Edit form state
  const [form, setForm] = useState({
    name: '',
    title: '',
    roleType: 'standard',
    standardRole: '',
    email: '',
    department: '',
  });
  // Reset form when opening add node modal
  useEffect(() => {
    if (addOpenNode === node.name) {
      setForm({
        name: '',
        title: '',
        roleType: 'standard',
        standardRole: '',
        email: '',
        department: '',
      });
    }
  }, [addOpenNode, node.name]);
  const [editForm, setEditForm] = useState({
    name: node.name,
    title: node.title,
    roleType: node.roleType,
    standardRole: node.standardRole,
    email: node.email,
    department: node.department || '',
    parentName: node.parentName,
  });

  // Render children recursively
  const children = node.children || [];

  return (
    <TreeNode
      key={node.name}
      label={
        <div className="relative bg-[#F3FBFB] border border-[#154406] px-4 py-2 text-sm font-semibold min-w-[180px] text-center flex flex-col items-center">
          <div className="flex w-full justify-end gap-2 absolute top-1 right-2">
            <button
              className="text-xs text-[#154406] hover:underline mr-1"
              title="Edit"
              onClick={(e) => {
                e.stopPropagation();
                setEditOpen((v) => !v);
                setAddOpenNode(null);
                setConfirmDelete(false);
              }}
            >
              <AiTwotoneEdit />
            </button>
            <button
              className="text-xs text-red-600 hover:underline"
              title="Delete"
              onClick={(e) => {
                e.stopPropagation();
                setConfirmDelete(true);
                setAddOpenNode(null);
                setEditOpen(false);
              }}
            >
              <IoTrashOutline />
            </button>
          </div>
          <span className="text-base text-[#154406] font-bold">
            {node.name}
          </span>
          <span className="text-xs text-gray-600">{node.title}</span>
          {node.department && (
            <span className="text-xs text-gray-400 mt-1">
              {node.department}
            </span>
          )}
          <span
            ref={addNodeAnchor}
            className="text-xs text-[#154406] mt-2 cursor-pointer select-none absolute right-2 bottom-1"
            onClick={(e) => {
              e.stopPropagation();
              setAddOpenNode(addOpenNode === node.name ? null : node.name);
              setEditOpen(false);
              setConfirmDelete(false);
            }}
          >
            + Add Node
          </span>
          {/* Add Node Form */}
          {addOpenNode === node.name && (
            <div
              className={`fixed z-50 w-[320px] animate-fade-in`}
              style={(() => {
                if (!addNodeAnchor.current) return { left: '50%', top: '50%' };
                const anchorRect =
                  addNodeAnchor.current.getBoundingClientRect();
                const left = anchorRect.right - 311;
                const top =
                  addFormPos === 'bottom'
                    ? anchorRect.bottom + 8
                    : anchorRect.top - 320 - 8;
                return { left: Math.max(left, 8), top: Math.max(top, 8) };
              })()}
            >
              <div className="p-4 bg-white border border-[#005D1F]">
                <input
                  className="border px-2 py-1 w-full mb-2"
                  type="text"
                  placeholder="Full Name"
                  value={form.name}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, name: e.target.value }))
                  }
                />
                <input
                  className="border px-2 py-1 w-full mb-2"
                  type="text"
                  placeholder="Title"
                  value={form.title}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, title: e.target.value }))
                  }
                />
                <input
                  className="border px-2 py-1 w-full mb-2"
                  type="email"
                  placeholder="Email"
                  value={form.email}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, email: e.target.value }))
                  }
                />
                <input
                  className="border px-2 py-1 w-full mb-2"
                  type="text"
                  placeholder="Department"
                  value={form.department}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, department: e.target.value }))
                  }
                />
                <select
                  className="border px-2 py-1 w-full mb-2"
                  value={form.standardRole}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, standardRole: e.target.value }))
                  }
                >
                  <option value="">Select Standard Role</option>
                  {roleOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
                <div className="flex gap-2 mt-3">
                  <button
                    className="flex-1 border border-[#154406] text-[#154406] py-1"
                    onClick={() => setAddOpenNode(null)}
                  >
                    Cancel
                  </button>
                  <button
                    className="flex-1 bg-[#154406] text-white py-1"
                    onClick={() => {
                      onAddNode({
                        ...form,
                        orgChartName,
                        roleType: 'standard',
                        parentName: node.name,
                      });
                      setAddOpenNode(null);
                    }}
                  >
                    Save
                  </button>
                </div>
              </div>
            </div>
          )}
          {/* Edit Node Form */}
          {editOpen && (
            <div
              className={`fixed z-50 w-[320px] animate-fade-in`}
              style={(() => {
                if (!addNodeAnchor.current) return { left: '50%', top: '50%' };
                const anchorRect =
                  addNodeAnchor.current.getBoundingClientRect();
                const left = anchorRect.right - 311;
                const top =
                  addFormPos === 'bottom'
                    ? anchorRect.bottom + 8
                    : anchorRect.top - 320 - 8;
                return { left: Math.max(left, 8), top: Math.max(top, 8) };
              })()}
            >
              <div className="p-4 bg-white border border-[#154406]">
                <input
                  className="border px-2 py-1 w-full mb-2"
                  type="text"
                  placeholder="Full Name"
                  value={editForm.name}
                  onChange={(e) =>
                    setEditForm((f) => ({ ...f, name: e.target.value }))
                  }
                />
                <input
                  className="border px-2 py-1 w-full mb-2"
                  type="text"
                  placeholder="Title"
                  value={editForm.title}
                  onChange={(e) =>
                    setEditForm((f) => ({ ...f, title: e.target.value }))
                  }
                />
                <input
                  className="border px-2 py-1 w-full mb-2"
                  type="email"
                  placeholder="Email"
                  value={editForm.email}
                  onChange={(e) =>
                    setEditForm((f) => ({ ...f, email: e.target.value }))
                  }
                />
                <input
                  className="border px-2 py-1 w-full mb-2"
                  type="text"
                  placeholder="Department (optional)"
                  value={editForm.department}
                  onChange={(e) =>
                    setEditForm((f) => ({ ...f, department: e.target.value }))
                  }
                />
                <select
                  className="border px-2 py-1 w-full mb-2"
                  value={editForm.standardRole}
                  onChange={(e) =>
                    setEditForm((f) => ({ ...f, standardRole: e.target.value }))
                  }
                >
                  <option value="">Select Standard Role</option>
                  {roleOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
                <div className="flex gap-2 mt-3">
                  <button
                    className="flex-1 border border-[#154406] text-[#154406] py-1"
                    onClick={() => setEditOpen(false)}
                  >
                    Cancel
                  </button>
                  <button
                    className="flex-1 bg-[#154406] text-white py-1"
                    onClick={() => {
                      if (onEditNode) onEditNode({ ...node, ...editForm });
                      setEditOpen(false);
                    }}
                  >
                    Save
                  </button>
                </div>
              </div>
            </div>
          )}
          {/* Delete Modal */}
          {confirmDelete && (
            <div
              className={`fixed z-50 w-[320px]`}
              style={(() => {
                if (!addNodeAnchor.current) return { left: '50%', top: '50%' };
                const anchorRect =
                  addNodeAnchor.current.getBoundingClientRect();
                const left = anchorRect.right - 311;
                const top =
                  deletePos === 'bottom'
                    ? anchorRect.bottom + 8
                    : anchorRect.top - 120 - 8;
                return { left: Math.max(left, 8), top: Math.max(top, 8) };
              })()}
            >
              <div className="p-4 bg-white border border-red-400">
                <div className="text-sm mb-2">
                  Delete this node and all its children?
                </div>
                <div className="flex gap-2">
                  <button
                    className="flex-1 border border-gray-400 py-1"
                    onClick={() => setConfirmDelete(false)}
                  >
                    Cancel
                  </button>
                  <button
                    className="flex-1 bg-red-600 text-white py-1"
                    onClick={() => {
                      if (onDeleteNode) onDeleteNode(node.name);
                      setConfirmDelete(false);
                    }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      }
    >
      {children.map((child) => (
        <OrgChartNodeBox
          key={child.name}
          node={child}
          orgChartName={orgChartName}
          allNodes={allNodes}
          onAddNode={onAddNode}
          onEditNode={onEditNode}
          onDeleteNode={onDeleteNode}
          addOpenNode={addOpenNode}
          setAddOpenNode={setAddOpenNode}
        />
      ))}
    </TreeNode>
  );
}
