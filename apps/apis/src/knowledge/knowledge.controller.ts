import { CreateProjectDto, UpdateProjectDto } from './dto/project.dto';
import { KnowledgeService } from './knowledge.service';
import { JwtUser } from '@/common/decorators';
import { JwtAuthGuard } from '@/common/guards';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { TokenPayload } from 'types';

@Controller('knowledge')
@UseGuards(JwtAuthGuard)
export class KnowledgeController {
  constructor(private knowledgeService: KnowledgeService) {}

  // @Post()
  // @UseInterceptors(FileInterceptor('file'))
  // async upload(@UploadedFile() file: Express.Multer.File) {
  //   const filePath = await this.knowledgeService.uploadMinio(file);
  //   return { message: 'success', filePath };
  // }

  @Post('/presigned')
  async presignedFile(@Body('fileName') fileName: string) {
    return this.knowledgeService.presignedMinio(fileName);
  }

  // @Post('crawl')
  // CrawlWebsite(@Body() { url }: { url: string }) {
  //   return this.knowledgeService.CrawlWebsite(url);
  // }

  @Post()
  createProject(
    @Body() { title }: CreateProjectDto,
    @JwtUser() { team_id }: TokenPayload,
  ) {
    return this.knowledgeService.createKnowledge({ title, team_id });
  }

  @Get()
  getAll(@JwtUser() { team_id }: TokenPayload) {
    return this.knowledgeService.getAll(team_id);
  }

  @Patch()
  update(@Body() projectDto: UpdateProjectDto) {
    return this.knowledgeService.updateTitle(projectDto);
  }

  @Delete(':id')
  deleteProject(@Param('id') id: string) {
    return this.knowledgeService.delete(id);
  }
}
