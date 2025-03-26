import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsString } from 'class-validator';
import { StepTypeEnum } from '@novu/shared';

export class StepDto {
  @ApiProperty({
    description: 'Name of the step',
  })
  @IsString()
  name: string;

  @ApiProperty({
    description: 'Type of the step',
    enum: [...Object.values(StepTypeEnum)],
    enumName: 'StepTypeEnum',
  })
  @IsEnum(StepTypeEnum)
  type: StepTypeEnum;
}
