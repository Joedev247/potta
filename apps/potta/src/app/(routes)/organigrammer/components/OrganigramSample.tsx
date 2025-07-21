import React from 'react';

// Simple sample data for demonstration
const orgData = {
  name: 'CEO',
  children: [
    {
      name: 'CTO',
      children: [
        { name: 'Lead Engineer', children: [{ name: 'Developer' }] },
        { name: 'QA Manager', children: [{ name: 'QA Tester' }] },
      ],
    },
    {
      name: 'CFO',
      children: [{ name: 'Accountant' }, { name: 'Financial Analyst' }],
    },
    {
      name: 'COO',
      children: [{ name: 'Operations Manager' }],
    },
  ],
};

// Recursive component to render the tree
function OrgNode({ node }: { node: any }) {
  return (
    <div style={{ marginLeft: 20, marginTop: 8 }}>
      <div
        style={{
          fontWeight: 'bold',
          border: '1px solid #ccc',
          padding: 8,
          borderRadius: 4,
          display: 'inline-block',
          background: '#F3FBFB',
        }}
      >
        {node.name}
      </div>
      {node.children && (
        <div style={{ display: 'flex', gap: 24, marginTop: 8 }}>
          {node.children.map((child: any, idx: number) => (
            <OrgNode key={idx} node={child} />
          ))}
        </div>
      )}
    </div>
  );
}

export default function OrganigramSample() {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Sample Organigram</h2>
      <OrgNode node={orgData} />
    </div>
  );
}
