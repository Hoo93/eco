import { Controller } from '@nestjs/common';
import { FileManagerService } from './file-manager.service';

@Controller('file-manager')
export class FileManagerController {
  constructor(private readonly fileManagerService: FileManagerService) {}
}
