import {
    Controller,
    Post,
    Body,
    Get,
    Param,
    HttpStatus,
    HttpCode,
    Delete,
    Put,
  } from '@nestjs/common';
  import { AlbumService } from './album.service';
  import { CreateAlbumDto } from './dto/create-album.dto';
  import { Album } from './entity/album.entity';
  
  @Controller('albums')
  export class AlbumController {
    constructor(private readonly albumService: AlbumService) {}
  
    @Post() 
    @HttpCode(HttpStatus.CREATED)
    async createAlbum(@Body() newAlbum: CreateAlbumDto): Promise<Album> {
      const album = new Album();
      album.title = newAlbum.title;
      album.remark = newAlbum.remark;
      return await this.albumService.createOrUpdate(album);
    }
  
    @Get() 
    async findAlbums(): Promise<Album[]> {
      return await this.albumService.findAll();
    }
  
    @Get(':id') 
    async findAlbum(@Param('id') id: number): Promise<any> {

      const album = await this.albumService.findOne(id);
      if(!album){
        return {massage:'there is no album with that id'};
      }

      return await this.albumService.findOne(id);
    }
  
    @Put(':id') 
    async updateAlbum(
      @Param('id') id: number,
      @Body() createAlbumDto: CreateAlbumDto,
    ): Promise<any> {
      const album = await this.albumService.findOne(id);

      if(!album){
        return {massage:'there is no album with that id'};
      }

        album.title = createAlbumDto.title;
        album.remark = createAlbumDto.remark;
        return await this.albumService.createOrUpdate(album);
    }
  
    @Delete(':id')  
    async deleteAlbum(@Param('id') id: number): Promise<any> {
      const album = await this.albumService.findOne(id);

      if(album){
        await this.albumService.delete(id);
        return { success: true , massage:'this album has been deleted'};
      }else {
        return {massage:'there is no album with that id'};
      }

      

      
    }
  }