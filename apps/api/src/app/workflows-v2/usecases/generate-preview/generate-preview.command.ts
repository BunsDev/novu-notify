import { EnvironmentWithUserObjectCommand } from '@novu/application-generic';
import { GeneratePreviewRequestDto } from '../../dtos';

export class GeneratePreviewCommand extends EnvironmentWithUserObjectCommand {
  workflowIdOrInternalId: string;
  stepIdOrInternalId: string;
  generatePreviewRequestDto: GeneratePreviewRequestDto;
}
