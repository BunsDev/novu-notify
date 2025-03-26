import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional } from 'class-validator';
import { UiComponentEnum } from '@novu/shared';

export class UiSchemaProperty {
  @ApiPropertyOptional({
    description: 'Placeholder for the UI Schema Property',
    type: 'object',
  })
  @IsOptional()
  placeholder?: unknown;

  @ApiProperty({
    description: 'Component type for the UI Schema Property',
    enum: [...Object.values(UiComponentEnum)],
    enumName: 'UiComponentEnum',
  })
  @IsEnum(UiComponentEnum)
  component: UiComponentEnum;
}
