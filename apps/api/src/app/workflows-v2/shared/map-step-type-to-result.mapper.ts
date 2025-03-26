import { JSONSchema } from '@novu/application-generic';
import { ActionStepEnum, actionStepSchemas, ChannelStepEnum, channelStepSchemas } from '@novu/framework/internal';
import { StepTypeEnum } from '@novu/shared';
import { JsonSchemaType } from '../dtos';

export function computeResultSchema(stepType: StepTypeEnum, payloadSchema?: JSONSchema) {
  const mapStepTypeToResult: Record<ChannelStepEnum & ActionStepEnum, JSONSchema> = {
    [ChannelStepEnum.SMS]: channelStepSchemas[ChannelStepEnum.SMS].result,
    [ChannelStepEnum.EMAIL]: channelStepSchemas[ChannelStepEnum.EMAIL].result,
    [ChannelStepEnum.PUSH]: channelStepSchemas[ChannelStepEnum.PUSH].result,
    [ChannelStepEnum.CHAT]: channelStepSchemas[ChannelStepEnum.CHAT].result,
    [ChannelStepEnum.IN_APP]: channelStepSchemas[ChannelStepEnum.IN_APP].result,
    [ActionStepEnum.DELAY]: actionStepSchemas[ActionStepEnum.DELAY].result,
    [ActionStepEnum.DIGEST]: buildDigestResult(payloadSchema),
  };

  return mapStepTypeToResult[stepType];
}

function buildDigestResult(payloadSchema?: JSONSchema): JSONSchema {
  return {
    type: JsonSchemaType.OBJECT,
    properties: {
      events: {
        type: JsonSchemaType.ARRAY,
        properties: {
          // the length property is JS native property on arrays
          length: {
            type: JsonSchemaType.NUMBER,
          },
        },
        items: {
          type: JsonSchemaType.OBJECT,
          properties: {
            id: {
              type: JsonSchemaType.STRING,
            },
            time: {
              type: JsonSchemaType.STRING,
            },
            payload:
              payloadSchema && typeof payloadSchema === 'object'
                ? { ...payloadSchema, additionalProperties: true }
                : {
                    type: JsonSchemaType.OBJECT,
                    additionalProperties: true,
                  },
          },
          required: ['id', 'time', 'payload'],
          additionalProperties: false,
        },
      },
    },
    required: ['events'],
    additionalProperties: false,
  };
}
