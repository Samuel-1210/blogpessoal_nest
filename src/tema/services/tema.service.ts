import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Tema } from '../entities/tema.entity';
import { DeleteResult, ILike, Repository } from 'typeorm';

@Injectable()
export class TemaService {
  constructor(
    @InjectRepository(Tema)
    private temaRepository: Repository<Tema>,
  ) {}

  async findAll(): Promise<Tema[]> {
    return await this.temaRepository.find({
      relations: {
        postagem: true,
      },
    }); // select * from tb_temas;
  }

  async findById(id: number): Promise<Tema> {
    let tema = await this.temaRepository.findOne({
      where: {
        id,
      },
      relations: {
        postagem: true,
      },
    });
    if (!tema)
      throw new HttpException('Tema não encontrado!', HttpStatus.NOT_FOUND);
    return tema;
  }

  async findByDescricao(descricao: string): Promise<Tema[]> {
    return await this.temaRepository.find({
      where: {
        descricao: ILike(`%${descricao}%`), // ILIKE > Não é case sensitive
      },
      relations: {
        postagem: true,
      },
    }); // select * from tb_temas;
  }

  async create(tema: Tema): Promise<Tema> {
    // INSERT INTO tb_TEMAS (titulo,texto) VALUES (?, ?)
    return await this.temaRepository.save(tema);
  }

  async update(tema: Tema): Promise<Tema> {
    await this.findById(tema.id);
    // UPDATE  tb_tema SET tema.descricao = ? where id = tema.idl
    return await this.temaRepository.save(tema);
  }

  async delete(id: number): Promise<DeleteResult> {
    await this.findById(id);

    // delete tb_temas where id = ?
    return await this.temaRepository.delete(id);
  }
}
