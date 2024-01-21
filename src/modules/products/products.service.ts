import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  async createProduct(createProductDto: CreateProductDto) {
    const existingProduct = await this.productRepository.findOne({
      where: [
        { name: createProductDto.name },
        { description: createProductDto.description },
        { category: createProductDto.category },
        { price: createProductDto.price },
        { imageFileName: createProductDto.imageFileName },
      ],
    });

    console.log('Existing Product:', existingProduct);
    if (existingProduct) {
      throw new InternalServerErrorException('El producto ya existe.');
    }

    const product = this.productRepository.create(createProductDto);

    if (!product)
      throw new InternalServerErrorException('El usuario no ha sido creado...');

    await this.productRepository.save(product);

    return product;
  }

  findAllProducts() {
    const allProducts = this.productRepository.find();

    if (!allProducts)
      throw new InternalServerErrorException('No se encontraron productos.');

    return allProducts;
  }

  async findOneProduct(category: string) {
    const findProduct = await this.productRepository.find({
      where: { category },
    });

    if (!findProduct.length)
      throw new BadRequestException(
        `El producto con la categoria: ${category} no ha sido encontrado.`,
      );

    return findProduct;
  }

  update(id: number, updateProductDto: UpdateProductDto) {
    return `This action updates a #${id} product`;
  }

  async remove(id: number) {
    const deleteProduct = await this.productRepository.findOne({
      where: { id },
    });

    if (!deleteProduct) {
      throw new BadRequestException('El producto no existe...');
    }

    console.log(deleteProduct);

    await this.productRepository.remove(deleteProduct);

    return `El producto con el ID ${id} ha sido eliminado`;
  }
}
