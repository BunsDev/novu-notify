import { expect } from 'chai';
import { UserSession } from '@novu/testing';
import { EnvironmentRepository, NotificationTemplateEntity, NotificationTemplateRepository } from '@novu/dal';
import { Novu } from '@novu/api';
import {
  CreateWorkflowDto,
  PreviewPayloadDto,
  RedirectTargetEnum,
  StepTypeEnum,
  WorkflowCreationSourceEnum,
  WorkflowOriginEnum,
  WorkflowResponseDto,
} from '@novu/api/models/components';
import { slugify } from '@novu/shared';
import { initNovuClassSdk } from '../../shared/helpers/e2e/sdk/e2e-sdk.helper';

const TEST_WORKFLOW_NAME = 'Test Workflow Name';

describe('Workflow Step Preview - POST /:workflowId/step/:stepId/preview #novu-v2', () => {
  let session: UserSession;
  const notificationTemplateRepository = new NotificationTemplateRepository();
  const environmentRepository = new EnvironmentRepository();
  let novuClient: Novu;

  beforeEach(async () => {
    session = new UserSession();
    await session.initialize();
    novuClient = initNovuClassSdk(session);
  });

  it('should generate preview for in-app init page - no variables example in dto body, stored empty payload schema', async () => {
    const workflow = await createWorkflow({
      payloadSchema: {
        $schema: 'http://json-schema.org/draft-07/schema#',
        type: 'object',
        properties: {},
      },
    });

    const stepId = workflow.steps[0].id;
    const controlValues = {
      subject: 'Welcome {{subscriber.firstName}}',
      body: 'Hello {{subscriber.firstName}} {{subscriber.lastName}}, Welcome to {{payload.organizationName | upcase}}!',
    };
    const previewPayload = {
      // empty previewPayload
    };
    const { result } = await novuClient.workflows.steps.generatePreview({
      generatePreviewRequestDto: {
        controlValues,
        previewPayload,
      },
      stepId,
      workflowId: workflow.id,
    });

    expect(result).to.deep.equal({
      data: {
        result: {
          preview: {
            subject: 'Welcome {{subscriber.firstName}}',
            // cspell:disable-next-line
            body: 'Hello {{subscriber.firstName}} {{subscriber.lastName}}, Welcome to {{PAYLOAD.ORGANIZATIONNAME}}!',
          },
          type: 'in_app',
        },
        previewPayloadExample: {
          subscriber: {
            firstName: '{{subscriber.firstName}}',
            lastName: '{{subscriber.lastName}}',
          },
          payload: {
            organizationName: '{{payload.organizationName}}',
          },
        },
      },
    });
  });

  it('should generate preview for in-app init page - no variables example in dto body', async () => {
    const workflow = await createWorkflow();

    const stepId = workflow.steps[0].id;
    const controlValues = {
      subject: `{{subscriber.firstName}} Hello, World! `,
      body: `Hello, World! {{payload.placeholder.body}} {{payload.placeholder.random}}`,
      avatar: 'https://www.example.com/avatar.png',
      primaryAction: {
        label: '{{payload.primaryUrlLabel}}',
        redirect: {
          target: RedirectTargetEnum.Blank,
          url: '/home/primary-action',
        },
      },
      secondaryAction: {
        label: 'Secondary Action',
        redirect: {
          target: RedirectTargetEnum.Blank,
          url: '/home/secondary-action',
        },
      },
      data: {
        key: 'value',
      },
      redirect: {
        target: RedirectTargetEnum.Blank,
        url: 'https://www.example.com/redirect',
      },
    };
    const previewPayload = {
      // empty previewPayload
    };
    const { result } = await novuClient.workflows.steps.generatePreview({
      generatePreviewRequestDto: {
        controlValues,
        previewPayload,
      },
      stepId,
      workflowId: workflow.id,
    });

    expect(result).to.deep.equal({
      result: {
        preview: {
          subject: '{{subscriber.firstName}} Hello, World! ',
          body: 'Hello, World! {{payload.placeholder.body}} {{payload.placeholder.random}}',
          avatar: 'https://www.example.com/avatar.png',
          primaryAction: {
            label: '{{payload.primaryUrlLabel}}',
            redirect: {
              url: '/home/primary-action',
              target: '_blank',
            },
          },
          secondaryAction: {
            label: 'Secondary Action',
            redirect: {
              url: '/home/secondary-action',
              target: '_blank',
            },
          },
          redirect: {
            url: 'https://www.example.com/redirect',
            target: '_blank',
          },
          data: {
            key: 'value',
          },
        },
        type: 'in_app',
      },
      previewPayloadExample: {
        subscriber: {
          firstName: '{{subscriber.firstName}}',
        },
        payload: {
          placeholder: {
            body: '{{payload.placeholder.body}}',
            random: '{{payload.placeholder.random}}',
          },
          primaryUrlLabel: '{{payload.primaryUrlLabel}}',
        },
      },
    });
  });

  it('should generate preview for in-app step', async () => {
    const workflow = await createWorkflow();

    const stepId = workflow.steps[0].id;
    const controlValues = {
      subject: `{{subscriber.firstName}} Hello, World! `,
      body: `Hello, World! {{payload.placeholder.body}}`,
      avatar: 'https://www.example.com/avatar.png',
      primaryAction: {
        label: '{{payload.primaryUrlLabel}}',
        redirect: {
          target: RedirectTargetEnum.Blank,
          url: '/home/primary-action',
        },
      },
      secondaryAction: {
        label: 'Secondary Action',
        redirect: {
          target: RedirectTargetEnum.Blank,
          url: '/home/secondary-action',
        },
      },
      data: {
        key: 'value',
      },
      redirect: {
        target: RedirectTargetEnum.Blank,
        url: 'https://www.example.com/redirect',
      },
    };
    const previewPayload: PreviewPayloadDto = {
      subscriber: {
        firstName: 'John',
      },
      payload: {
        placeholder: {
          body: 'This is a body',
        },
        primaryUrlLabel: 'https://example.com',
      },
    };

    const { result } = await novuClient.workflows.steps.generatePreview({
      workflowId: workflow.id,
      stepId,
      generatePreviewRequestDto: { controlValues, previewPayload },
    });

    expect(result).to.deep.equal({
      result: {
        preview: {
          subject: 'John Hello, World! ',
          body: 'Hello, World! This is a body',
          avatar: 'https://www.example.com/avatar.png',
          primaryAction: {
            label: 'https://example.com',
            redirect: {
              url: '/home/primary-action',
              target: '_blank',
            },
          },
          secondaryAction: {
            label: 'Secondary Action',
            redirect: {
              url: '/home/secondary-action',
              target: '_blank',
            },
          },
          redirect: {
            url: 'https://www.example.com/redirect',
            target: '_blank',
          },
          data: {
            key: 'value',
          },
        },
        type: 'in_app',
      },
      previewPayloadExample: {
        subscriber: {
          firstName: 'John',
        },
        payload: {
          placeholder: {
            body: 'This is a body',
          },
          primaryUrlLabel: 'https://example.com',
        },
      },
    });
  });

  it('should generate preview for in-app step, based on stored payload schema', async () => {
    const payloadSchema = {
      type: 'object',
      properties: {
        placeholder: {
          type: 'object',
          properties: {
            body: {
              type: 'string',
              default: 'Default body text',
            },
            random: {
              type: 'string',
            },
          },
        },
        primaryUrlLabel: {
          type: 'string',
          default: 'Click here',
        },
        organizationName: {
          type: 'string',
          default: 'Pokemon Organization',
        },
      },
    };
    const workflow = await createWorkflow({ payloadSchema });
    await emulateExternalOrigin(workflow.id);

    const stepId = workflow.steps[0].id;
    const controlValues = {
      subject: `{{subscriber.firstName}} Hello, World! `,
      body: `Hello, World! {{payload.placeholder.body}} {{payload.placeholder.random}}`,
      avatar: 'https://www.example.com/avatar.png',
      primaryAction: {
        label: '{{payload.primaryUrlLabel}}',
        redirect: {
          target: RedirectTargetEnum.Blank,
          url: '/home/primary-action',
        },
      },
      secondaryAction: {
        label: 'Secondary Action',
        redirect: {
          target: RedirectTargetEnum.Blank,
          url: '/home/secondary-action',
        },
      },
      data: {
        key: 'value',
      },
      redirect: {
        target: RedirectTargetEnum.Blank,
        url: 'https://www.example.com/redirect',
      },
    };
    const clientVariablesExample = {
      subscriber: {
        firstName: 'First Name',
      },
      payload: {
        primaryUrlLabel: 'New Click Here',
      },
    };
    const { result } = await novuClient.workflows.steps.generatePreview({
      generatePreviewRequestDto: {
        controlValues,
        previewPayload: clientVariablesExample,
      },
      stepId,
      workflowId: workflow.id,
    });

    expect(result).to.deep.equal({
      result: {
        preview: {
          subject: 'First Name Hello, World! ',
          body: 'Hello, World! Default body text {{payload.placeholder.random}}',
          avatar: 'https://www.example.com/avatar.png',
          primaryAction: {
            label: 'New Click Here',
            redirect: {
              url: '/home/primary-action',
              target: '_blank',
            },
          },
          secondaryAction: {
            label: 'Secondary Action',
            redirect: {
              url: '/home/secondary-action',
              target: '_blank',
            },
          },
          redirect: {
            url: 'https://www.example.com/redirect',
            target: '_blank',
          },
          data: {
            key: 'value',
          },
        },
        type: 'in_app',
      },
      previewPayloadExample: {
        subscriber: {
          firstName: 'First Name',
        },
        payload: {
          placeholder: {
            body: 'Default body text',
            random: '{{payload.placeholder.random}}',
          },
          primaryUrlLabel: 'New Click Here',
          organizationName: 'Pokemon Organization',
        },
      },
    });
  });

  it('should gracefully handle undefined variables that are not present in payload schema', async () => {
    const pay = {
      type: 'object',
      properties: {
        /*
         * orderId: {
         *   type: 'string',
         * },
         */
        lastName: {
          type: 'string',
        },
        organizationName: {
          type: 'string',
        },
      },
    };
    const workflow = await createWorkflow({ payloadSchema: pay });
    await emulateExternalOrigin(workflow.id);

    const stepId = workflow.steps[0].id;
    const controlValues = {
      subject: 'Welcome {{payload.firstName}}',
      body: 'Hello {{payload.firstName}}, your order #{{payload.orderId}} is ready!',
    };
    const { result } = await novuClient.workflows.steps.generatePreview({
      generatePreviewRequestDto: {
        controlValues,
        previewPayload: {
          payload: {
            firstName: 'John',
            // orderId is missing
          },
        },
      },
      stepId,
      workflowId: workflow.id,
    });

    expect(result).to.deep.equal({
      result: {
        preview: {
          subject: 'Welcome John',
          // missing orderId will be replaced with placeholder "{{payload.orderId}}"
          body: 'Hello John, your order #{{payload.orderId}} is ready!',
        },
        type: 'in_app',
      },
      previewPayloadExample: {
        payload: {
          lastName: '{{payload.lastName}}',
          organizationName: '{{payload.organizationName}}',
          firstName: 'John',
          orderId: '{{payload.orderId}}',
        },
      },
    });

    const { result: result2 } = await novuClient.workflows.steps.generatePreview({
      generatePreviewRequestDto: {
        controlValues,
        previewPayload: {
          payload: {
            firstName: 'John',
            orderId: '123456', // orderId is will override the variable example that driven by workflow payload schema
          },
        },
      },
      stepId,
      workflowId: workflow.id,
    });

    expect(result2).to.deep.equal({
      result: {
        preview: {
          subject: 'Welcome John',
          body: 'Hello John, your order #123456 is ready!', // orderId is not defined in the payload schema
        },
        type: 'in_app',
      },
      previewPayloadExample: {
        payload: {
          lastName: '{{payload.lastName}}',
          organizationName: '{{payload.organizationName}}',
          orderId: '123456',
          firstName: 'John',
        },
      },
    });
  });

  it('should return 201 for non-existent workflow', async () => {
    const pay = {
      type: 'object',
      properties: {
        firstName: {
          type: 'string',
        },
        lastName: {
          type: 'string',
        },
        organizationName: {
          type: 'string',
        },
      },
    };
    const workflow = await createWorkflow({ payloadSchema: pay });

    const nonExistentWorkflowId = 'non-existent-id';
    const stepId = workflow.steps[0].id;
    const { result } = await novuClient.workflows.steps.generatePreview({
      generatePreviewRequestDto: {
        controlValues: {},
      },
      stepId,
      workflowId: nonExistentWorkflowId,
    });

    expect(result).to.deep.equal({
      result: {
        preview: {},
      },
      previewPayloadExample: {},
    });
  });

  it('should return 201 for non-existent step', async () => {
    const pay = {
      type: 'object',
      properties: {
        firstName: {
          type: 'string',
        },
        lastName: {
          type: 'string',
        },
        organizationName: {
          type: 'string',
        },
      },
    };
    const workflow = await createWorkflow({ payloadSchema: pay });
    const nonExistentStepId = 'non-existent-step-id';
    const { result } = await novuClient.workflows.steps.generatePreview({
      generatePreviewRequestDto: {
        controlValues: {},
      },
      stepId: nonExistentStepId,
      workflowId: workflow.id,
    });

    expect(result).to.deep.equal({
      result: {
        preview: {},
      },
      previewPayloadExample: {},
    });
  });

  async function createWorkflow(overrides: Partial<NotificationTemplateEntity> = {}): Promise<WorkflowResponseDto> {
    const createWorkflowDto: CreateWorkflowDto = {
      source: WorkflowCreationSourceEnum.Editor,
      name: TEST_WORKFLOW_NAME,
      workflowId: `${slugify(TEST_WORKFLOW_NAME)}`,
      description: 'This is a test workflow',
      active: true,
      steps: [
        {
          name: 'In-App Test Step',
          type: StepTypeEnum.InApp,
        },
        {
          name: 'Email Test Step',
          type: StepTypeEnum.Email,
        },
      ],
    };

    const res = await novuClient.workflows.create(createWorkflowDto);

    await notificationTemplateRepository.updateOne(
      {
        _organizationId: session.organization._id,
        _environmentId: session.environment._id,
        _id: res.result.id,
      },
      {
        ...overrides,
      }
    );

    return res.result;
  }

  /**
   * Emulate external origin bridge with the local bridge
   */
  async function emulateExternalOrigin(_workflowId: string) {
    await notificationTemplateRepository.updateOne(
      {
        _organizationId: session.organization._id,
        _environmentId: session.environment._id,
        _id: _workflowId,
      },
      {
        origin: WorkflowOriginEnum.External,
      }
    );

    await environmentRepository.updateOne(
      {
        _id: session.environment._id,
      },
      {
        bridge: { url: `http://localhost:${process.env.PORT}/v1/environments/${session.environment._id}/bridge` },
      }
    );
  }
});
