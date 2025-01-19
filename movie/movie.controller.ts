import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { MovieService } from './movie.service';

@Controller('movie')
export class MovieController {
  constructor(private readonly movieService: MovieService) {}


 @Get()
 getMovies(@Query('title') title?: string) {
  return this.movieService.getManyMovies(title);
 }

 @Get(':id')
 getMovieById(@Param('id') id: string) {
  return this.movieService.getMovideById(+ id); //정수로 받음
 }

 @Post()
 createMovie(@Query('title') title: string) {
  return this.movieService.createMovie(title);
 }


 @Patch()
  patchMovie(@Param('id') id: string, @Body('title')title: string)  {
   return this.movieService.updateMovie(+id,title);
  }
 

 @Delete()
 DeleteMovieById(@Param('id') id: string) {
  return this.movieService.deleteMovie(+id);
 }

 

}
