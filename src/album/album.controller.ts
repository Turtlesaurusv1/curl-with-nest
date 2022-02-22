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
    Req,
  } from '@nestjs/common';
  import { AlbumService } from './album.service';
  import { CreateAlbumDto } from './dto/create-album.dto';
  import { Album } from './entity/album.entity';
  import {Request} from "express";
  
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

    @Get('search')
    async searchalbum(@Req() req:Request){

     const album = await this.albumService.queryBuilder('album');
       
     if(req.query.s){
      album.where("album.title LIKE :s OR album.remark LIKE :s", {s: `%${req.query.s}%`})
     }

     const sort: any = req.query.sort;

     if(sort){
      album.orderBy('album.title');
    }
      const page: number = parseInt(req.query.page as any) || 1;
      const perPage = 2;
      const total = await album.getCount();
      album.offset((page - 1) * perPage).limit(perPage);
      return {
          data: await album.getMany(),
          total,
          page
      };

    }

  
    @Get(':id') 
    async findAlbum(@Param('id') id: number): Promise<any> {

      const album = await this.albumService.findOne(id);
      if(!album){
        return {message:'there is no album with that id'};
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
        return {message:'there is no album with that id'};
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
        return { success: true , message:'this album has been deleted'};
      }else {
        return {message:'there is no album with that id'};
      }

      

      
    }
  }

function order(arg0: string, arg1: any, order: any, arg3: number) {
  throw new Error('Function not implemented.');
}
