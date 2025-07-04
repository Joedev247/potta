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
        const ids = action.parameters?.users || action.selectedUserIds || [];
        ids.forEach((id: string) => userIds.add(id));
      });
    });
    if (userIds.size === 0) return;
    setLoading(true);
    // Fetch employee details in bulk using peopleApi
    peopleApi
      .filterPersons({ uuids: Array.from(userIds) })
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
    <div className="space-y-8  mx-auto">
      {policy.rules.map((rule, ruleIndex) => (
        <div
          key={rule.uuid || ruleIndex}
          className="rounded-xl p-6 bg-white"
        >
          <div className="flex items-center mb-4">
            <ChevronRight className="text-blue-400 mr-2" size={22} />
            <h4 className="text-xl font-semibold text-blue-700">
              Rule {ruleIndex + 1}
            </h4>
          </div>

          {/* Conditions */}
          <div className="mb-4">
            <div className="font-medium text-gray-700 mb-1 flex items-center">
              <span className="inline-block w-2 h-2 rounded-full bg-blue-400 mr-2"></span>
              Conditions
            </div>
            <ul className="list-disc ml-8 space-y-1">
              {rule.conditions.map((condition, condIdx) => (
                <li key={condition.id || condIdx} className="text-gray-800">
                  <span className="font-semibold capitalize">
                    {condition.criterionType || condition.field}
                  </span>{' '}
                  <span className="text-gray-500">
                    {condition.comparisonOperator || condition.operator}
                  </span>{' '}
                  <span className="text-blue-700 font-medium">
                    {String(condition.value)}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Requirements */}
          {rule.requirements &&
            Object.values(rule.requirements).some(Boolean) && (
              <div className="mb-4">
                <div className="font-medium text-gray-700 mb-1 flex items-center">
                  <CheckCircle2 className="text-green-500 mr-2" size={18} />
                  Requirements
                </div>
                <div className="flex flex-wrap gap-2 ml-6 mt-1">
                  {Object.entries(rule.requirements).map(
                    ([key, value]) =>
                      value && (
                        <span
                          key={key}
                          className="bg-gray-100 border border-gray-200 text-gray-700 px-2 py-0.5 rounded text-xs capitalize"
                        >
                          {key.replace(/([A-Z])/g, ' $1').trim()}
                        </span>
                      )
                  )}
                </div>
              </div>
            )}

          {/* Actions */}
          <div>
            <div className="font-medium text-gray-700 mb-1 flex items-center">
              <UserCheck className="text-indigo-500 mr-2" size={18} />
              Actions
            </div>
            <ul className="ml-8 space-y-1">
              {rule.actions.map((action, actionIdx) => {
                const userIds =
                  action.parameters?.users || action.selectedUserIds || [];
                return (
                  <li key={action.id || actionIdx} className="text-gray-800">
                    <span className="font-semibold capitalize">
                      {action.type}
                    </span>{' '}
                    <span className="text-gray-500">
                      (Approval Mode:{' '}
                      {action.parameters?.approvalMode || action.mode})
                    </span>
                    {loading ? (
                      <span className="ml-2 text-gray-400">
                        Loading users...
                      </span>
                    ) : userIds.length > 0 ? (
                      <span className="flex flex-wrap gap-2 items-center">
                        {userIds.map((id: string) => {
                          const emp = employeeMap[id];
                          return emp ? (
                            <span
                              key={id}
                              className="inline-flex items-center bg-gray-200 px-2 py-0.5 text-xs"
                            >
                              {emp.firstName} {emp.lastName}
                            </span>
                          ) : null;
                        })}
                      </span>
                    ) : null}
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      ))}
    </div>
  );
};
