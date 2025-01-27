import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Postagem } from '../entities/postagem.entity';
import { DeleteResult, ILike, Repository } from 'typeorm';
import { TemaService } from '../../tema/services/tema.service';

@Injectable()
export class PostagemService {
  constructor(
    @InjectRepository(Postagem)
    private postagemRepository: Repository<Postagem>,
    private temaService: TemaService,
  ) {}

  async findAll(): Promise<Postagem[]> {
    return await this.postagemRepository.find({
      relations: {
        tema: true,
        usuario:true,
      },
    }); // select * from tb_postagens;
  }

  async findById(id: number): Promise<Postagem> {
    let postagem = await this.postagemRepository.findOne({
      where: {
        id,
      },
      relations: {
        tema: true,
        usuario:true,
      },
    });
    if (!postagem)
      throw new HttpException('Postagem não encontrada!', HttpStatus.NOT_FOUND);
    return postagem;
  }

  async findByTitulo(titulo: string): Promise<Postagem[]> {
    return await this.postagemRepository.find({
      where: {
        titulo: ILike(`%${titulo}%`), // ILIKE > Não é case sensitive
      },
      relations: {
        tema: true,
        usuario:true,
      },
    }); // select * from tb_postagens;
  }

  async create(postagem: Postagem): Promise<Postagem> {
    await this.temaService.findById(postagem.tema.id);

    // INSERT INTO tb_postagens (titulo,texto) VALUES (?, ?)
    return await this.postagemRepository.save(postagem);
  }

  async update(postagem: Postagem): Promise<Postagem> {
    
    await this.findById(postagem.id);

    // UPDATE  tb_postagens SET postagem.titulo = ?, postagem.texto =?, data= current_timestamp() where id = postagem.idl
    return await this.postagemRepository.save(postagem);
  }

  async delete(id: number): Promise<DeleteResult> {
    await this.findById(id);

    // delete tb_postagens where id = ?
    return await this.postagemRepository.delete(id);
  }
}


