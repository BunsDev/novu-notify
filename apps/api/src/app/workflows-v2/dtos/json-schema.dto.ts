import { ApiExtraModels, ApiPropertyOptional } from '@nestjs/swagger';
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

// Enum for standard JSON Schema formats
// eslint-disable-next-line @typescript-eslint/naming-convention
export enum JsonSchemaFormat {
  // Date and Time Formats
  DATE = 'date',
  TIME = 'time',
  DATETIME = 'date-time',
  DURATION = 'duration',

  // String Formats
  EMAIL = 'email',
  HOSTNAME = 'hostname',
  IDN_HOSTNAME = 'idn-hostname',
  IPV4 = 'ipv4',
  IPV6 = 'ipv6',
  JSON_POINTER = 'json-pointer',
  RELATIVE_JSON_POINTER = 'relative-json-pointer',
  REGEX = 'regex',
  URI = 'uri',
  URI_REFERENCE = 'uri-reference',
  URI_TEMPLATE = 'uri-template',
  URL = 'url',

  // Identifier Formats
  UUID = 'uuid',
  GUID = 'guid',

  // Other Specific Formats
  PHONE = 'phone',
  PASSWORD = 'password',
  COLOR = 'color',
}

@ApiExtraModels()
export class JSONSchemaDto {
  @ApiPropertyOptional({
    description: 'JSON Schema type',
    enum: [...Object.values(JsonSchemaType)],
    enumName: 'JsonSchemaType',
  })
  @IsOptional()
  @IsEnum(JsonSchemaType)
  type?: JsonSchemaType;

  @ApiPropertyOptional({
    description: 'Format validation for strings',
    enum: [...Object.values(JsonSchemaFormat)],
    enumName: 'JsonSchemaFormat',
    type: 'string',
  })
  @IsOptional()
  @IsEnum(JsonSchemaFormat)
  format?: JsonSchemaFormat;

  @ApiPropertyOptional({
    description: 'Title of the schema',
    type: 'string',
  })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiPropertyOptional({
    description: 'Description of the schema',
    type: 'string',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({
    description: 'Default value',
  })
  @IsOptional()
  default?: any;

  @ApiPropertyOptional({
    description: 'Const value (exact match required)',
  })
  @IsOptional()
  const?: any;

  @ApiPropertyOptional({
    description: 'Minimum value for numbers',
    type: 'number',
  })
  @IsOptional()
  @IsNumber()
  minimum?: number;

  @ApiPropertyOptional({
    description: 'Maximum value for numbers',
    type: 'number',
  })
  @IsOptional()
  @IsNumber()
  maximum?: number;

  @ApiPropertyOptional({
    description: 'Exclusive minimum',
    type: 'boolean',
  })
  @IsOptional()
  @IsBoolean()
  exclusiveMinimum?: boolean;

  @ApiPropertyOptional({
    description: 'Exclusive maximum',
    type: 'boolean',
  })
  @IsOptional()
  @IsBoolean()
  exclusiveMaximum?: boolean;

  @ApiPropertyOptional({
    description: 'Minimum length for strings',
    type: 'number',
  })
  @IsOptional()
  @IsNumber()
  minLength?: number;

  @ApiPropertyOptional({
    description: 'Maximum length for strings',
    type: 'number',
  })
  @IsOptional()
  @IsNumber()
  maxLength?: number;

  @ApiPropertyOptional({
    description: 'Regular expression pattern',
    type: 'string',
  })
  @IsOptional()
  @IsString()
  pattern?: string;

  @ApiPropertyOptional({
    description: 'Minimum number of items in array',
    type: 'number',
  })
  @IsOptional()
  @IsNumber()
  minItems?: number;

  @ApiPropertyOptional({
    description: 'Maximum number of items in array',
    type: 'number',
  })
  @IsOptional()
  @IsNumber()
  maxItems?: number;

  @ApiPropertyOptional({
    description: 'Items must be unique',
    type: 'boolean',
  })
  @IsOptional()
  @IsBoolean()
  uniqueItems?: boolean;

  @ApiPropertyOptional({
    description: 'Schema for array items',
    oneOf: [{ $ref: '#/components/schemas/JSONSchemaDto' }],
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => JSONSchemaDto)
  items?: JSONSchemaDto;

  @ApiPropertyOptional({
    description: 'Required properties for object',
    type: 'array',
    items: {
      type: 'string',
    },
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  required?: string[];

  @ApiPropertyOptional({
    description: 'Object properties',
    type: 'object',
    additionalProperties: {
      oneOf: [{ $ref: '#/components/schemas/JSONSchemaDto' }],
    },
  })
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => JSONSchemaDto)
  properties?: Record<string, JSONSchemaDto>;

  @ApiPropertyOptional({
    description: 'Additional properties schema',
    oneOf: [{ $ref: '#/components/schemas/JSONSchemaDto' }, { type: 'boolean' }],
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => JSONSchemaDto)
  additionalProperties?: JSONSchemaDto | boolean;

  @ApiPropertyOptional({
    description: 'Enumeration of possible values',
    type: 'array',
    items: {
      type: 'object', // or use a more specific type
    },
  })
  @IsOptional()
  @IsArray()
  enum?: any[];

  @ApiPropertyOptional({
    description: 'Combination of schemas (allOf)',
    type: 'array',
    items: {
      oneOf: [{ $ref: '#/components/schemas/JSONSchemaDto' }],
    },
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => JSONSchemaDto)
  allOf?: JSONSchemaDto[];

  @ApiPropertyOptional({
    description: 'At least one schema must match (anyOf)',
    type: 'array',
    items: {
      oneOf: [{ $ref: '#/components/schemas/JSONSchemaDto' }],
    },
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => JSONSchemaDto)
  anyOf?: JSONSchemaDto[];

  @ApiPropertyOptional({
    description: 'Only one schema must match (oneOf)',
    type: 'array',
    items: {
      oneOf: [{ $ref: '#/components/schemas/JSONSchemaDto' }],
    },
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => JSONSchemaDto)
  oneOf?: JSONSchemaDto[];

  @ApiPropertyOptional({
    description: 'Schema must not match (not)',
    oneOf: [{ $ref: '#/components/schemas/JSONSchemaDto' }],
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => JSONSchemaDto)
  not?: JSONSchemaDto;

  @ApiPropertyOptional({
    description: 'Conditional validation schema (if condition)',
    oneOf: [{ $ref: '#/components/schemas/JSONSchemaDto' }],
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => JSONSchemaDto)
  if?: JSONSchemaDto;

  @ApiPropertyOptional({
    description: 'Schema to apply if "if" condition is true',
    oneOf: [{ $ref: '#/components/schemas/JSONSchemaDto' }],
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => JSONSchemaDto)
  then?: JSONSchemaDto;

  @ApiPropertyOptional({
    description: 'Schema to apply if "if" condition is false',
    oneOf: [{ $ref: '#/components/schemas/JSONSchemaDto' }],
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => JSONSchemaDto)
  else?: JSONSchemaDto;

  @ApiPropertyOptional({
    description: 'Content encoding (e.g., base64)',
    type: 'string',
  })
  @IsOptional()
  @IsString()
  contentEncoding?: string;

  @ApiPropertyOptional({
    description: 'Content media type',
    type: 'string',
  })
  @IsOptional()
  @IsString()
  contentMediaType?: string;

  @ApiPropertyOptional({
    description: 'Dependent required properties',
    type: 'object',
    additionalProperties: {
      type: 'array',
      items: {
        type: 'string',
      },
    },
  })
  @IsOptional()
  @ValidateNested()
  dependentRequired?: Record<string, string[]>;

  @ApiPropertyOptional({
    description: 'Dependent schemas',
    type: 'object',
    additionalProperties: {
      oneOf: [{ $ref: '#/components/schemas/JSONSchemaDto' }],
    },
  })
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => JSONSchemaDto)
  dependentSchemas?: Record<string, JSONSchemaDto>;

  @ApiPropertyOptional({
    description: 'JSON Schema version',
    type: 'string',
  })
  @IsOptional()
  @IsString()
  $schema?: string;

  @ApiPropertyOptional({
    description: 'Unique identifier for the schema',
    type: 'string',
  })
  @IsOptional()
  @IsString()
  $id?: string;

  @ApiPropertyOptional({
    description: 'Content schema for specific types',
    oneOf: [{ $ref: '#/components/schemas/JSONSchemaDto' }],
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => JSONSchemaDto)
  contentSchema?: JSONSchemaDto;

  @ApiPropertyOptional({
    description: 'Example values',
    type: 'array',
    items: {
      type: 'object', // or use a more specific type
    },
  })
  @IsOptional()
  @IsArray()
  examples?: any[];

  @ApiPropertyOptional({
    description: 'Minimum number of decimal places',
    type: 'number',
  })
  @IsOptional()
  @IsNumber()
  multipleOf?: number;
}
