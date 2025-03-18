import { useMemo, useState } from 'react';
import { FieldValues, useFormContext } from 'react-hook-form';

import { Button } from '@/components/primitives/button';
import { Card, CardContent } from '@/components/primitives/card';
import { ControlInput } from '@/components/primitives/control-input';
import { FormField } from '@/components/primitives/form/form';
import { Input, InputRoot } from '@/components/primitives/input';
import { useSaveForm } from '@/components/workflow-editor/steps/save-form-context';
import { useWorkflow } from '@/components/workflow-editor/workflow-provider';
import { parseStepVariablesToLiquidVariables } from '@/utils/parseStepVariablesToLiquidVariables';
import { RiAddLine, RiDeleteBin6Line, RiInputField, RiQuestionLine } from 'react-icons/ri';
import { Link } from 'react-router-dom';

const dataObjectKey = 'data';

const InnerDataObject = ({ field }: { field: FieldValues }) => {
  const { saveForm } = useSaveForm();
  const { step } = useWorkflow();

  const variables = useMemo(() => (step ? parseStepVariablesToLiquidVariables(step.variables) : []), [step]);

  const [currentPairs, setCurrentPairs] = useState(() => {
    const obj = field.value ?? {};
    return Object.entries(obj).map(([key, value]) => ({
      key,
      value: String(value ?? ''),
    }));
  });

  const updateFormField = (pairs: Array<{ key: string; value: string }>) => {
    setCurrentPairs(pairs);
    const uniquePairLength = new Set<string>(pairs.map((pair) => pair.key)).size;
    const hasNoDuplicates = uniquePairLength === pairs.length;

    if (hasNoDuplicates) {
      field.onChange(
        pairs.reduce(
          (acc, { key, value }) => {
            acc[key] = value;
            return acc;
          },
          {} as Record<string, string>
        )
      );
    }
  };

  const handleAddPair = () => {
    const newPairs = [...currentPairs, { key: '', value: '' }];
    updateFormField(newPairs);
    saveForm();
  };

  const handleUpdateKey = (index: number, newKey: string) => {
    const newPairs = currentPairs.map((pair, i) => (i === index ? { ...pair, key: newKey } : pair));
    updateFormField(newPairs);
  };

  const handleUpdateValue = (index: number, newValue: string) => {
    const newPairs = currentPairs.map((pair, i) => (i === index ? { ...pair, value: newValue } : pair));
    updateFormField(newPairs);
  };

  const handleRemovePair = (index: number) => {
    const newPairs = currentPairs.filter((_, i) => i !== index);
    updateFormField(newPairs);
    saveForm();
  };

  return (
    <div className="bg-neutral-alpha-50 flex flex-col gap-2 rounded-lg border border-neutral-200 p-2">
      <div className="flex items-center gap-2">
        <RiInputField className="text-feature size-4" />
        <span className="text-xs">Data object</span>
      </div>
      <Card className="rounded-md">
        <CardContent className="flex flex-col gap-1 p-2">
          <div className="flex flex-col gap-1">
            {currentPairs.map((pair, index) => (
              <div key={index} className="grid grid-cols-[3fr,4fr,1.75rem] items-center gap-2">
                <Input
                  placeholder="Insert property name..."
                  type="text"
                  value={pair.key}
                  onChange={(e) => handleUpdateKey(index, e.target.value)}
                />
                <InputRoot>
                  <ControlInput
                    multiline={false}
                    indentWithTab={false}
                    value={pair.value}
                    placeholder="Insert text or variable..."
                    onChange={(newValue) => {
                      handleUpdateValue(index, typeof newValue === 'string' ? newValue : '');
                    }}
                    variables={variables}
                  />
                </InputRoot>
                <Button variant="secondary" mode="outline" className="h-7" onClick={() => handleRemovePair(index)}>
                  <RiDeleteBin6Line className="size-4" />
                </Button>
              </div>
            ))}
          </div>
          {currentPairs.length < 10 && (
            <Button variant="secondary" mode="lighter" className="self-start" onClick={handleAddPair}>
              <RiAddLine className="size-4" />
              Add property
            </Button>
          )}
        </CardContent>
      </Card>
      <Link
        className="text-foreground-600 flex items-center gap-1 text-xs"
        to={`https://docs.novu.co/platform/inbox/overview`}
        target="_blank"
      >
        <RiQuestionLine className="text-foreground-400 size-4" />
        {`Learn more about the data object in Novu`}
      </Link>
    </div>
  );
};

export const DataObject = () => {
  const { control } = useFormContext();

  return <FormField control={control} name={dataObjectKey} render={({ field }) => <InnerDataObject field={field} />} />;
};
