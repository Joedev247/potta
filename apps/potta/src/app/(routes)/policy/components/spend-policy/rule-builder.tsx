// components/spend-policy/rule-builder.tsx
"use client";

import { useState } from "react";
import { Button } from "@potta/components/shadcn/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@potta/components/shadcn/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@potta/components/shadcn/select";

import { ConditionBuilder } from "./condition-builder";
import { PlusCircle, Trash2 } from "lucide-react";


type Rule = {
  id: string;
  conditionOperator: "AND" | "OR";
  conditions: Condition[];
  actions: Action[];
};

type Condition = {
  id: string;
  criterionType: string;
  comparisonOperator: string;
  value: any;
};

type Action = {
  id: string;
  type: string;
  parameters: any;
};

type RuleBuilderProps = {
  rules: Rule[];
  onChange: (rules: Rule[]) => void;
};

export function RuleBuilder({ rules = [], onChange }: RuleBuilderProps) {
  const addRule = () => {
    const newRule = {
      id: `rule-${Date.now()}`,
      conditionOperator: "AND" as const,
      conditions: [],
      actions: []
    };
    onChange([...rules, newRule]);
  };
  
  const updateRule = (index: number, updatedRule: Rule) => {
    const newRules = [...rules];
    newRules[index] = updatedRule;
    onChange(newRules);
  };
  
  const removeRule = (index: number) => {
    const newRules = [...rules];
    newRules.splice(index, 1);
    onChange(newRules);
  };
  
  const addCondition = (ruleIndex: number) => {
    const rule = rules[ruleIndex];
    const newCondition = {
      id: `condition-${Date.now()}`,
      criterionType: "AMOUNT",
      comparisonOperator: "GREATER_THAN",
      value: 0
    };
    
    const updatedRule = {
      ...rule,
      conditions: [...rule.conditions, newCondition]
    };
    
    updateRule(ruleIndex, updatedRule);
  };
  
  const updateCondition = (ruleIndex: number, conditionIndex: number, updatedCondition: Condition) => {
    const rule = rules[ruleIndex];
    const newConditions = [...rule.conditions];
    newConditions[conditionIndex] = updatedCondition;
    
    updateRule(ruleIndex, {
      ...rule,
      conditions: newConditions
    });
  };
  
  const removeCondition = (ruleIndex: number, conditionIndex: number) => {
    const rule = rules[ruleIndex];
    const newConditions = [...rule.conditions];
    newConditions.splice(conditionIndex, 1);
    
    updateRule(ruleIndex, {
      ...rule,
      conditions: newConditions
    });
  };
  
  return (
    <div className="space-y-4">
      {rules.length === 0 ? (
        <div className="text-center p-8 border border-dashed rounded-md">
          <p className="text-muted-foreground mb-4">No rules defined yet</p>
          <Button onClick={addRule}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Add First Rule
          </Button>
        </div>
      ) : (
        rules.map((rule, ruleIndex) => (
          <Card key={rule.id} className="border-primary/20">
            <CardHeader className="bg-primary/5">
              <CardTitle className="text-sm font-medium flex items-center justify-between">
                <span>Rule {ruleIndex + 1}</span>
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={() => removeRule(ruleIndex)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Condition Operator</label>
                <Select
                  value={rule.conditionOperator}
                  onValueChange={(value: "AND" | "OR") => 
                    updateRule(ruleIndex, { ...rule, conditionOperator: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="AND">AND (All conditions must be true)</SelectItem>
                    <SelectItem value="OR">OR (Any condition can be true)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-medium">Conditions</h4>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => addCondition(ruleIndex)}
                  >
                    <PlusCircle className="mr-2 h-3 w-3" />
                    Add Condition
                  </Button>
                </div>
                
                {rule.conditions.length === 0 ? (
                  <p className="text-sm text-muted-foreground italic">
                    No conditions added yet
                  </p>
                ) : (
                  rule.conditions.map((condition, conditionIndex) => (
                    <ConditionBuilder
                      key={condition.id}
                      condition={condition}
                      onChange={(updatedCondition) => 
                        updateCondition(ruleIndex, conditionIndex, updatedCondition)
                      }
                      onRemove={() => removeCondition(ruleIndex, conditionIndex)}
                    />
                  ))
                )}
              </div>
            </CardContent>
            <CardFooter className="border-t bg-muted/50 flex justify-between">
              <div className="text-xs text-muted-foreground">
                {rule.conditions.length} condition(s)
              </div>
            </CardFooter>
          </Card>
        ))
      )}
      
      {rules.length > 0 && (
        <Button 
          variant="outline" 
          className="w-full"
          onClick={addRule}
        >
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Another Rule
        </Button>
      )}
    </div>
  );
}
