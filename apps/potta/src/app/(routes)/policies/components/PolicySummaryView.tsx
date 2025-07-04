import React, { useEffect, useState } from 'react';
import { Policy } from '../utils/types';
import { ChevronRight, UserCheck, CheckCircle2 } from 'lucide-react';
import { peopleApi } from '../../payroll/people/utils/api';

interface PolicySummaryViewProps {
  policy: Policy;
}

interface Employee {
  uuid: string;
  firstName: string;
  lastName: string;
  profile_url?: string;
}

export const PolicySummaryView: React.FC<PolicySummaryViewProps> = ({
  policy,
}) => {
  const [employeeMap, setEmployeeMap] = useState<Record<string, Employee>>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Collect all unique user IDs from all actions in all rules
    const userIds = new Set<string>();
    policy.rules.forEach((rule) => {
      rule.actions.forEach((action) => {
        const ids =
          action.parameters?.users ||
          (action.parameters && 'selectedUserIds' in action.parameters
            ? action.parameters.selectedUserIds
            : []) ||
          [];
        ids.forEach((id: string) => userIds.add(id));
      });
    });
    if (userIds.size === 0) return;
    setLoading(true);
    // Fetch employee details in bulk using peopleApi
    peopleApi
      .filterPersons({ ids: Array.from(userIds) })
      .then((res) => {
        const employees: Employee[] = res.data || [];
        const map: Record<string, Employee> = {};
        employees.forEach((emp) => {
          map[emp.uuid] = emp;
        });
        setEmployeeMap(map);
      })
      .finally(() => setLoading(false));
  }, [policy]);

  if (!policy || !policy.rules || policy.rules.length === 0) {
    return (
      <div className="border rounded-md p-4 bg-white text-center text-gray-500">
        No rules defined for this policy.
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      {policy.rules.map((rule, idx) => (
        <div
          key={rule.uuid || rule.id || idx}
          className="bg-gray-50 border p-6"
        >
          <div className="flex items-center gap-2 mb-4">
            <span className="text-blue-600 font-bold">Rule {idx + 1}</span>
            <span className="text-xs text-gray-400">
              ({rule.conditionOperator?.toUpperCase()})
            </span>
          </div>
          {/* Conditions */}
          <div className="mb-2">
            <div className="font-semibold text-gray-700 mb-1">Conditions</div>
            <ul className="ml-4 list-disc text-gray-800">
              {rule.conditions.map((cond) => (
                <li key={cond.id}>
                  <span className="capitalize font-medium">
                    {cond.criterionType}
                  </span>{' '}
                  <span className="text-gray-500">
                    {cond.comparisonOperator}
                  </span>{' '}
                  <span className="text-blue-700 font-semibold">
                    {cond.value}
                  </span>
                </li>
              ))}
            </ul>
          </div>
          {/* Requirements */}
          {rule.requirements &&
            Object.values(rule.requirements).some(Boolean) && (
              <div className="mb-2">
                <div className="font-semibold text-gray-700 mb-1">
                  Requirements
                </div>
                <div className="flex flex-wrap gap-2">
                  {Object.entries(rule.requirements).map(([key, value]) =>
                    value ? (
                      <span
                        key={key}
                        className="bg-gray-200 text-xs px-2 py-0.5 rounded"
                      >
                        {key
                          .replace(/([A-Z])/g, ' $1')
                          .replace(/^./, (s) => s.toUpperCase())}
                      </span>
                    ) : null
                  )}
                </div>
              </div>
            )}
          {/* Actions */}
          <div>
            <div className="font-semibold text-gray-700 mb-1">Actions</div>
            {rule.actions.map((action, actionIdx) => {
              const userIds =
                action.parameters?.users ||
                (action.parameters && 'selectedUserIds' in action.parameters
                  ? action.parameters.selectedUserIds
                  : []) ||
                [];
              return (
                <div
                  key={action.id || actionIdx}
                  className="flex items-center gap-2 text-sm"
                >
                  <span className="font-medium capitalize">{action.type}</span>
                  <span className="text-gray-500">
                    (Approval Mode: {action.parameters?.approvalMode})
                  </span>
                  {/* Approvers */}
                  {loading ? (
                    <span className="ml-2 text-gray-400">Loading users...</span>
                  ) : (
                    Array.isArray(userIds) &&
                    userIds.length > 0 && (
                      <span className="flex flex-wrap gap-1">
                        {userIds.map((id: string) => {
                          const emp = employeeMap[id];
                          return emp ? (
                            <span
                              key={id}
                              className="bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded text-xs"
                            >
                              {emp.firstName} {emp.lastName}
                            </span>
                          ) : (
                            <span
                              key={id}
                              className="bg-gray-200 text-gray-700 px-2 py-0.5 rounded text-xs"
                            >
                              {id}
                            </span>
                          );
                        })}
                      </span>
                    )
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
};
