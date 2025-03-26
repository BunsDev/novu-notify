import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { StepCreateDto } from './create-step.dto';

export class StepUpdateDto extends StepCreateDto {
  @ApiProperty({
    description: 'Unique identifier of the step',
    type: 'string',
  })
  @IsString()
  _id: string;
}
