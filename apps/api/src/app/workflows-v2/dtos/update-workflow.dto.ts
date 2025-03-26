import { ApiExtraModels, ApiProperty, ApiPropertyOptional, getSchemaPath } from '@nestjs/swagger';
import { IsArray, IsEnum, IsOptional, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { WorkflowOriginEnum } from '@novu/shared';
import { WorkflowCommonsFields } from './workflow-commons.dto';
import { StepCreateDto } from './create-step.dto';
import { StepUpdateDto } from './step-update.dto';
import { PreferencesRequestDto } from './preferences.request.dto';

@ApiExtraModels(StepUpdateDto)
export class UpdateWorkflowDto extends WorkflowCommonsFields {
  @ApiPropertyOptional({
    description: 'Workflow ID (allowed only for code-first workflows)',
    type: 'string',
  })
  @IsOptional()
  workflowId?: string;

  @ApiProperty({
    description: 'Steps of the workflow',
    type: 'array',
    items: {
      oneOf: [{ $ref: getSchemaPath(StepCreateDto) }, { $ref: getSchemaPath(StepUpdateDto) }],
    },
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => Object, {
    discriminator: {
      property: 'type',
      subTypes: [
        { value: StepCreateDto, name: 'create' },
        { value: StepUpdateDto, name: 'update' },
      ],
    },
  })
  steps: (StepCreateDto | StepUpdateDto)[];

  @ApiProperty({
    description: 'Workflow preferences',
    type: () => PreferencesRequestDto,
  })
  @ValidateNested()
  @Type(() => PreferencesRequestDto)
  preferences: PreferencesRequestDto;

  @ApiProperty({
    description: 'Origin of the workflow',
    enum: [...Object.values(WorkflowOriginEnum)],
    enumName: 'WorkflowOriginEnum',
  })
  @IsEnum(WorkflowOriginEnum)
  origin: WorkflowOriginEnum;
}
