import { JSONSchemaDto, JsonSchemaType } from '../dtos';

function determineSchemaType(value: unknown): JSONSchemaDto {
  if (value === null) {
    return { type: JsonSchemaType.NULL };
  }

  if (Array.isArray(value)) {
    return {
      type: JsonSchemaType.ARRAY,
      items: value.length > 0 ? determineSchemaType(value[0]) : { type: JsonSchemaType.ARRAY },
    };
  }

  switch (typeof value) {
    case 'string':
      return { type: JsonSchemaType.STRING, default: value };
    case 'number':
      return { type: JsonSchemaType.NUMBER, default: value };
    case 'boolean':
      return { type: JsonSchemaType.BOOLEAN, default: value };
    case 'object':
      return {
        type: JsonSchemaType.OBJECT,
        properties: Object.entries(value).reduce(
          (acc, [key, val]) => {
            acc[key] = determineSchemaType(val);

            return acc;
          },
          {} as { [key: string]: JSONSchemaDto }
        ),
        required: Object.keys(value),
      };

    default:
      return { type: JsonSchemaType.NULL };
  }
}

export function buildVariablesSchema(object: unknown) {
  const schema: JSONSchemaDto = {
    type: JsonSchemaType.OBJECT,
    properties: {},
    required: [],
    additionalProperties: true,
  };

  if (object) {
    for (const [key, value] of Object.entries(object)) {
      if (schema.properties && schema.required) {
        schema.properties[key] = determineSchemaType(value);
        schema.required.push(key);
      }
    }
  }

  return schema;
}
