import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsInt, IsNumber, IsOptional, IsString } from 'class-validator';

// Enum for sorting direction
export enum DirectionEnum {
  ASC = 'ASC',
  DESC = 'DESC',
}

export function LimitOffsetPaginationQueryDto<T, K extends keyof T>(
  BaseClass: new (...args: any[]) => T,
  allowedFields: K[]
): new () => {
  limit?: number;
  offset?: number;
  orderDirection?: DirectionEnum;
  orderBy?: K;
} {
  class PaginationDto {
    @ApiProperty({
      description: 'Number of items to return per page',
      type: 'number',
      required: false,
    })
    @IsNumber()
    @IsInt()
    @IsOptional()
    limit?: number;

    @ApiProperty({
      description: 'Number of items to skip before starting to return results',
      type: 'number',
      required: false,
    })
    @IsInt()
    @IsNumber()
    @IsOptional()
    offset?: number;

    @ApiPropertyOptional({
      description: 'Direction of sorting',
      enum: DirectionEnum,
      enumName: 'DirectionEnum',
      required: false,
    })
    @IsOptional()
    @IsEnum(DirectionEnum)
    orderDirection?: DirectionEnum;

    @ApiPropertyOptional({
      description: 'Field to sort the results by',
      enum: allowedFields,
      enumName: `${BaseClass.name}SortField`,
      type: 'string',
      required: false,
    })
    @IsOptional()
    @IsString()
    @IsEnum(Object.fromEntries(allowedFields.map((field) => [field, field])))
    orderBy?: K;
  }

  return PaginationDto;
}
