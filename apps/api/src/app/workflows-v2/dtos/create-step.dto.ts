import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';
import { StepDto } from './step.dto';

export class StepCreateDto extends StepDto {
  @ApiPropertyOptional({
    description: 'Control values for the step',
    type: 'object',
    nullable: true,
    additionalProperties: true,
  })
  @IsOptional()
  controlValues?: Record<string, unknown> | null;
}
