import { Component, OnInit } from '@angular/core';
import { Todo } from 'src/app/models/todo';
import { TodoService } from 'src/app/services/todo.service';
import { MessageService } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { CadastroComponent } from '../cadastro/cadastro.component';

@Component({
  selector: 'app-consulta',
  templateUrl: './consulta.component.html',
  styleUrls: ['./consulta.component.css'],
  providers: [DialogService]
})
export class ConsultaComponent implements OnInit {

  public ref!: DynamicDialogRef;
  public title!: string;
  public todo: Todo[] = [];

  constructor(
    private todoService: TodoService,
    private messageService: MessageService,
    public dialogService: DialogService) { }

  ngOnInit(): void {
    this.title = "TAREFAS CADASTRADAS";

    this.listar();
  }

  listar() {
    this.todoService.findAll().subscribe({
      next: (res) => this.todo = res.content,
      error: (e) => this.messageService.add({severity:'error', summary: 'Erro', detail: e.message}),
    })
  }

  dialogCadastroTarefa(id: any) {
    let header: string;
    let msg: string;
    if(id == null) {
      header = 'Criar Tarefa';
      msg = 'Tarefa criada!'; 
    } else {
      header = 'Editar Tarefa';
      msg = 'Tarefa editada!';
    }
    
    this.ref = this.dialogService.open(CadastroComponent, {
      header: header,
      width: '30%',
      data: {
        id: id
      }
    })

    this.ref.onClose.subscribe((reload) => {
      if (reload) {
        this.listar();
        this.messageService.add({severity:'success', summary: 'Sucesso', detail: msg})
      }
    });
  }

  delete(id: any) {
    if(confirm("Deseja realmente excluir esse registro?")){
      this.todoService.deleteById(id).subscribe({
        next: () => {
          this.messageService.add({severity:'success', summary: 'Successo', detail: 'Tarefa excluída!'}),
          this.todo = this.todo.filter(i => i.id !== id)
        },
        error: (e) => this.messageService.add({severity:'error', summary: 'Erro', detail: e.message}),
      })
    }
  }
}