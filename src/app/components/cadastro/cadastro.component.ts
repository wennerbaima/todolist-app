import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { TodoService } from 'src/app/services/todo.service';
import { Todo } from 'src/app/models/todo';
import { MessageService } from 'primeng/api';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';

@Component({
  selector: 'app-cadastro',
  templateUrl: './cadastro.component.html',
  styleUrls: ['./cadastro.component.css']
})
export class CadastroComponent implements OnInit {
  
  public id!: number;
  public todo: Todo = new Todo();
  public form!: FormGroup;

  constructor(
    private todoService: TodoService,
    private messageService: MessageService,
    private ref: DynamicDialogRef,
    private config: DynamicDialogConfig
  ){}

  /**INICIALIZA O COMPONENTE */
  ngOnInit() {

    this.form = new FormGroup({
      id: new FormControl(),
      titulo: new FormControl(null, Validators.required),
      descricao: new FormControl(null, Validators.required),
      dataCadastro: new FormControl(),
      dataEdicao: new FormControl(),
      concluido: new FormControl(false, Validators.required)
    });

    if(this.config.data.id != undefined){
      this.id = this.config.data.id;
      this.todoService.findById(this.id).subscribe(
        result => 
          this.form.patchValue(result)
      )
    }      
  }

  get f(){
    return this.form.controls;
  }
  
  /**CHAMA O SERVIÇO PARA INSERIR/ATUALIZAR UMA TAREFA */
  salvar():void {

    if(this.id == null){
      /**INSERE */      
      this.todoService.create(this.form.value).subscribe({
        next: () => this.ref.close(true),
        error: (e) => this.messageService.add({severity:'error', summary: 'Erro', detail: e.message}),
      });

    }
    else {
      /**ATUALIZA */
      this.todoService.update(this.id, this.form.value).subscribe({
        next: () => this.ref.close(true),
        error: (e) => this.messageService.add({severity:'error', summary: 'Erro', detail: e.message})
      });
    }
  }
}
