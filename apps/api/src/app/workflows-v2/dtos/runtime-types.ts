import { StepCreateDto, StepUpdateDto, UpdateWorkflowDto } from '@novu/api/models/components';

export type UpsertWorkflowBody = Omit<UpdateWorkflowDto, 'steps'> & {
  steps: UpsertStepBody[];
};

export type UpsertStepBody = StepCreateBody | UpdateStepBody;
export type StepCreateBody = StepCreateDto;
export type UpdateStepBody = StepUpdateDto;

export function isStepCreateBody(step: UpsertStepBody): step is StepCreateDto {
  return step && typeof step === 'object' && !(step as UpdateStepBody).id;
}

export function isStepUpdateBody(step: UpsertStepBody): step is UpdateStepBody {
  return step && typeof step === 'object' && !!(step as UpdateStepBody).id;
}
