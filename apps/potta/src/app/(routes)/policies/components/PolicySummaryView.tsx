import React, { useEffect, useState } from 'react';
import { Policy } from '../utils/types';
import { ChevronRight, UserCheck, CheckCircle2, AlertCircle, Settings, Users } from 'lucide-react';
import { peopleApi } from '../../payroll/people/utils/api';
import { MdOutlinePendingActions } from 'react-icons/md';

interface PolicySummaryViewProps {
  policy: Policy;
}

interface Employee {
  uuid: string;
  firstName: string;
  lastName: string;
  profile_url?: string;
}

const requirementLabels: Record<string, { label: string; description: string; icon: React.ReactNode }> = {
  requireReceipt: {
    label: 'Receipt Required',
    description: 'Must attach receipt for this expense',
    icon: <i className="ri-receipt-2-line text-gray-600" />
  },
  requireMemo: {
    label: 'Memo Required',
    description: 'Must provide a memo explaining the expense',
    icon: <i className="ri-file-text-line text-gray-600" />
  },
  requireScreenshots: {
    label: 'Screenshots Required',
    description: 'Must attach screenshots as proof',
    icon: <i className="ri-image-line text-gray-600" />
  },
  requireNetSuiteCustomerJob: {
    label: 'NetSuite Customer/Job',
    description: 'Must select NetSuite customer or job',
    icon: <i className="ri-briefcase-line text-gray-600" />
  },
  requireGpsCoordinates: {
    label: 'GPS Coordinates',
    description: 'Must include GPS location data',
    icon: <i className="ri-map-pin-line text-gray-600" />
  },
  businessPurpose: {
    label: 'Business Purpose',
    description: 'Must specify business purpose',
    icon: <i className="ri-building-2-line text-gray-600" />
  },
  requireBeforeAfterScreenshots: {
    label: 'Before/After Screenshots',
    description: 'Must provide before and after screenshots',
    icon: <i className="ri-split-cells-horizontal text-gray-600" />
  },
};

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
      <div className="border border-gray-200 p-6 bg-gray-50 text-center text-gray-500">
        <AlertCircle className="h-8 w-8 mx-auto mb-2 text-gray-400" />
        <p>No rules defined for this policy.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {policy.rules.map((rule, idx) => (
        <div
          key={rule.uuid || rule.id || idx}
          className="bg-gray-50 border border-gray-200 p-6"
        >
          {/* Rule Header */}
          <div className="flex items-center gap-3 mb-4 pb-3 border-b border-gray-200">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-green-100">
                <Settings className="h-4 w-4 text-green-600" />
              </div>
              <div>
                <span className="text-green-600 font-semibold text-lg">Rule {idx + 1}</span>
                <div className="text-xs text-gray-500">
                  Condition Operator: {rule.conditionOperator?.toUpperCase() || 'AND'}
                </div>
              </div>
            </div>
          </div>

          {/* Conditions */}
          <div className="mb-4">
            <div className="flex items-center gap-2 mb-3">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              <span className="font-semibold text-gray-700">Conditions</span>
              <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5">
                {rule.conditions.length} condition{rule.conditions.length !== 1 ? 's' : ''}
              </span>
            </div>
            <div className="space-y-2">
              {rule.conditions.map((cond) => (
                <div key={cond.id} className="flex items-center gap-3 p-3 bg-white border border-gray-100">
                  <div className="flex-1">
                    <span className="capitalize font-medium text-gray-700">
                      {cond.criterionType}
                    </span>
                    <span className="text-gray-500 mx-2">
                      {cond.comparisonOperator}
                    </span>
                    <span className="text-green-700 font-semibold">
                      {cond.value}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Requirements */}
          {rule.requirements &&
            Object.values(rule.requirements).some(Boolean) && (
              <div className="mb-4">
                <div className="flex items-center gap-2 mb-3">
                  <AlertCircle className="h-4 w-4 text-gray-600" />
                  <span className="font-semibold text-gray-700">Requirements</span>
                  <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5">
                    {Object.values(rule.requirements).filter(Boolean).length} requirement{Object.values(rule.requirements).filter(Boolean).length !== 1 ? 's' : ''}
                  </span>
                </div>
                <div className="space-y-2">
                  {Object.entries(rule.requirements).map(([key, value]) =>
                    value ? (
                      <div key={key} className="flex items-center gap-3 p-3 bg-white border border-gray-100">
                        <div className="flex-shrink-0">
                          {requirementLabels[key]?.icon || <i className="ri-check-line text-gray-400" />}
                        </div>
                        <div className="flex-1">
                          <div className="font-medium text-gray-700">
                            {requirementLabels[key]?.label || key.replace(/([A-Z])/g, ' $1').replace(/^./, (s) => s.toUpperCase())}
                          </div>
                          <div className="text-sm text-gray-500">
                            {requirementLabels[key]?.description || 'Required for this policy'}
                          </div>
                        </div>
                      </div>
                    ) : null
                  )}
                </div>
              </div>
            )}

          {/* Actions */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <MdOutlinePendingActions  className="h-4 w-4 text-gray-600" />
              <span className="font-semibold text-gray-700">Actions</span>
              <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5">
                {rule.actions.length} action{rule.actions.length !== 1 ? 's' : ''}
              </span>
            </div>
            <div className="space-y-3">
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
                    className="p-4 bg-white border border-gray-100"
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <div className="p-1.5 bg-green-100">
                        <UserCheck className="h-3 w-3 text-green-600" />
                      </div>
                      <div className="flex-1">
                        <div className="font-medium capitalize text-gray-700">{action.type}</div>
                        <div className="text-sm text-gray-500">
                          Approval Mode: {action.parameters?.approvalMode || 'Standard'}
                        </div>
                      </div>
                    </div>
                    
                    {/* Approvers */}
                    {loading ? (
                      <div className="text-sm text-gray-400 italic">Loading approvers...</div>
                    ) : (
                      Array.isArray(userIds) &&
                      userIds.length > 0 && (
                        <div className="mt-3 pt-3 border-t border-gray-100">
                          <div className="text-sm font-medium text-gray-600 mb-2">Approvers:</div>
                          <div className="flex flex-wrap gap-2">
                            {userIds.map((id: string) => {
                              const emp = employeeMap[id];
                              return emp ? (
                                <span
                                  key={id}
                                  className="inline-flex items-center gap-1 px-3 py-1 bg-green-50 text-green-700 border border-green-200 text-sm"
                                >
                                  <i className="ri-user-line text-green-600"></i>
                                  {emp.firstName} {emp.lastName}
                                </span>
                              ) : (
                                <span
                                  key={id}
                                  className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 text-gray-600 border border-gray-200 text-sm"
                                >
                                  <i className="ri-user-line text-gray-400"></i>
                                  {id}
                                </span>
                              );
                            })}
                          </div>
                        </div>
                      )
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
