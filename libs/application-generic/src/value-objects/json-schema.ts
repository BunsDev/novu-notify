import { IsArray, IsBoolean, IsEnum, IsNumber, IsOptional, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

// Enum for JSON Schema types
// eslint-disable-next-line @typescript-eslint/naming-convention
export enum JsonSchemaType {
  STRING = 'string',
  NUMBER = 'number',
  INTEGER = 'integer',
  BOOLEAN = 'boolean',
  ARRAY = 'array',
  OBJECT = 'object',
  NULL = 'null',
}

export class JSONSchema {
  @IsOptional()
  @IsEnum(JsonSchemaType)
  type?: JsonSchemaType;

  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  default?: any;

  @IsOptional()
  const?: any;

  @IsOptional()
  @IsNumber()
  minimum?: number;

  @IsOptional()
  @IsNumber()
  maximum?: number;

  @IsOptional()
  @IsBoolean()
  exclusiveMinimum?: boolean;

  @IsOptional()
  @IsBoolean()
  exclusiveMaximum?: boolean;

  @IsOptional()
  @IsNumber()
  minLength?: number;

  @IsOptional()
  @IsNumber()
  maxLength?: number;

  @IsOptional()
  @IsString()
  pattern?: string;

  @IsOptional()
  @IsNumber()
  minItems?: number;

  @IsOptional()
  @IsNumber()
  maxItems?: number;

  @IsOptional()
  @IsBoolean()
  uniqueItems?: boolean;

  @IsOptional()
  @ValidateNested()
  @Type(() => JSONSchema)
  items?: JSONSchema;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  required?: string[];

  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => JSONSchema)
  properties?: Record<string, JSONSchema>;

  @IsOptional()
  @ValidateNested()
  @Type(() => JSONSchema)
  additionalProperties?: JSONSchema | boolean;

  @IsOptional()
  @IsArray()
  enum?: any[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => JSONSchema)
  allOf?: JSONSchema[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => JSONSchema)
  anyOf?: JSONSchema[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => JSONSchema)
  oneOf?: JSONSchema[];

  @IsOptional()
  @ValidateNested()
  @Type(() => JSONSchema)
  not?: JSONSchema;
}
