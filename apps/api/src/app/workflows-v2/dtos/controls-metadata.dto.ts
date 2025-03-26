import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, ValidateNested } from 'class-validator';
import { JSONSchemaDto } from './json-schema.dto';
import { UiSchema } from './ui-schema.dto';

export class ControlsMetadata {
  @ApiPropertyOptional({
    description: 'JSON Schema for data',
    oneOf: [{ $ref: '#/components/schemas/JSONSchemaDto' }],
  })
  @IsOptional()
  @ValidateNested()
  dataSchema?: JSONSchemaDto;

  @ApiPropertyOptional({
    description: 'UI Schema for rendering',
    type: 'object',
  })
  @IsOptional()
  @ValidateNested()
  uiSchema?: UiSchema;

  @ApiProperty({
    description: 'Control values',
    type: 'object',
    additionalProperties: true,
  })
  values: Record<string, unknown>;
}
