import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UploadedFile,
  UseInterceptors,
  BadRequestException,
  Res,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { Response } from 'express';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post('upload-product')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const name = file.originalname.split('.')[0];
          const fileExtension = file.originalname.split('.')[1];
          const newFileName =
            name.split(' ').join('_') + '_' + Date.now() + '.' + fileExtension;

          cb(null, newFileName);
        },
      }),

      fileFilter: (req, file, cb) => {
        if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
          return cb(null, false);
        }

        cb(null, true);
      },
    }),
  )
  async createProduct(
    @UploadedFile() file: Express.Multer.File,
    @Body() createProductDto: CreateProductDto,
  ) {
    if (!file) {
      throw new BadRequestException('Por favor seleccione una imagen.');
    } else {
      const response = {
        filePath: `http://localhost:3001/products/prueba/${file.filename}`,
      };

      let { name, description, category, price, imageFileName } =
        createProductDto;

      imageFileName = response.filePath;

      const product = {
        name: name,
        description: description,
        category: category,
        price: price,
        imageFileName: imageFileName,
      };

      return this.productsService.createProduct(product);
    }
  }

  @Get('prueba/:filename')
  async getPicture(@Param('filename') filename: string, @Res() res: Response) {
    res.sendFile(filename, { root: './uploads' });
  }

  @Get('getProducts')
  findAllProducts() {
    return this.productsService.findAllProducts();
  }

  @Get('category/:category')
  findOneProduct(@Param('category') category: string) {
    return this.productsService.findOneProduct(category);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    return this.productsService.update(+id, updateProductDto);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.productsService.remove(id);
  }
}
