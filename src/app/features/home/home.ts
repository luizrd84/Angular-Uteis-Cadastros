import { Component } from '@angular/core';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Cep } from '../../shared/models/cep-model';
import { ViacepService } from '../../core/services/viacep-service';
import { FormControl } from '@angular/forms';
import { debounceTime, distinctUntilChanged, filter, switchMap } from 'rxjs/operators';
import { ReactiveFormsModule } from '@angular/forms';
import { of } from 'rxjs';
import { map } from 'rxjs/operators';

import { ChangeDetectorRef } from '@angular/core';

import { tap } from 'rxjs/operators';


@Component({
  selector: 'app-home',
  imports: [FormsModule, ReactiveFormsModule],
  templateUrl: './home.html',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  styleUrl: './home.css',
})
export class Home {

  logradouroControl = new FormControl('', { nonNullable: true });
  logradouros: Cep[] = [];
  estadoSelecionado = ''; 
  estados: string[] = [];

  cidadeSelecionada: string = "";
  cidades: string[] = [];
  cidadesFiltradas: string[] = [];
  cidadeControl = new FormControl('', { nonNullable: true });

  inputCep:string = "";
  resultadoBuscaCep:string = "";

  exibirBuscaPorRua:boolean = false;
  resultadoBuscaPorRua:string = "";

  constructor (private viaCepService: ViacepService,  private cdr: ChangeDetectorRef) {

  }

  ngOnInit() {
    this.estados = this.viaCepService.getEstados(); 
    this.configuraBuscaPorLogradouro();
    this.configuraBuscaNomeCidade();          
  }

 
  buscarPorCep() {

    const cepLimpo = this.inputCep.replace(/\D/g, '');
    //Get by CEP
    this.viaCepService.getByCEP(Number(cepLimpo)).subscribe(cep => {
      console.log(cep.logradouro);
      this.resultadoBuscaCep = cep.logradouro + cep.complemento + "\nBairro: " + cep.bairro + 
        "\nCidade: " + cep.localidade + "\nEstado: " + cep.uf;
      this.cdr.detectChanges(); // força atualização
    });
      
  }

  //Busca enquanto o usuário digita o nome do logradouro
  configuraBuscaPorLogradouro() {
    this.logradouroControl.valueChanges.pipe(
        debounceTime(300),
        distinctUntilChanged(),
        switchMap((valor: string) => {
            if (valor.length < 3) return of([]);
            return this.viaCepService.getLogradouro(this.estadoSelecionado, this.cidadeControl.value, 
              valor).pipe(
                map(lista => lista.map(item => ({
                  ...item,
                  logradouro: item.complemento ? `${item.logradouro} - ${item.complemento}` : item.logradouro
                })))

              );
        }),
        // Opcional: use o tap para garantir que o Angular veja a mudança
        tap(() => this.cdr.markForCheck()) 
    ).subscribe(resultado => {
        this.logradouros = resultado;
        this.cdr.detectChanges(); // Força a renderização da lista de ruas
    });
  }


  configuraBuscaNomeCidade() {
    this.cidadeControl.valueChanges.pipe(
      debounceTime(200),
      filter(valor => valor.length > 0),
      map(valor => valor.toLowerCase()),
      map(valor =>
        this.cidades.filter(c =>
          c.toLowerCase().includes(valor)
        )
      )
    ).subscribe(lista => {
      this.cidadesFiltradas = lista;
    });

  }


  selecionarCidade(cidade: string) {
    this.cidadeControl.setValue(cidade, { emitEvent: false }); 
    this.cidadesFiltradas = [];
    this.cdr.detectChanges();
  }


  cidadeInvalida = false;
  validarCidade() {
    this.resetBuscaPorRua("cidade");

    const valor = this.cidadeControl.value.toLowerCase();

    const cidadeExiste = this.cidades.some(
      c => c.toLowerCase() === valor
    );

    if (!cidadeExiste) {
      this.cidadeControl.setValue('');
      this.cidadeInvalida = true;
    } else {
      this.cidadeInvalida = false;
    }

  }


  onEstadoChangeCarregarCidadades(estado: string) {
    this.resetBuscaPorRua("estado");

    this.cidades = [];
    
    this.viaCepService.getMunicipiosByEstado(estado).subscribe(municipios => {

      this.cidades = municipios.map(m => m.nome);

    });

  }


  selecionarLogradouro(endereco: Cep) {  

    this.exibirBuscaPorRua = true;
    this.resultadoBuscaPorRua = endereco.logradouro + "\n";
    if(endereco.complemento !== "") {
      this.resultadoBuscaPorRua+= "Complemento: " + endereco.complemento + "\n"
    }
    this.resultadoBuscaPorRua+= "Bairro: " + endereco.bairro + "\n" + "Cidade: " 
      + endereco.localidade + "\n" + "Estado: " + endereco.uf + "\n" + "CEP: " + endereco.cep;

    this.logradouroControl.setValue(endereco.logradouro, { emitEvent: false });
    this.logradouros = [];    
    this.cdr.detectChanges();
  }


  formatarCep() {
    // remove tudo que não é número
    let cep = this.inputCep.replace(/\D/g, '');

    // limita a 8 dígitos
    cep = cep.substring(0, 8);

    // aplica a máscara
    if (cep.length > 5) {
      cep = cep.replace(/^(\d{2})(\d{3})(\d{0,3})$/, '$1.$2-$3');
    } else if (cep.length > 2) {
      cep = cep.replace(/^(\d{2})(\d{0,3})$/, '$1.$2');
    }

    this.inputCep = cep;
  }

  resetBuscaPorRua(etapa:string) {    
    
    this.exibirBuscaPorRua = false;
    this.resultadoBuscaPorRua = "";
    this.cdr.detectChanges();

    if(etapa === "estado") {
      this.logradouros = [];
      this.cidadeSelecionada = "";
      this.cidades = [];
      this.cidadesFiltradas = [];
      this.cidadeControl.reset();
      this.logradouroControl.reset();
    } 
    else if(etapa === "cidade") {
      this.logradouroControl.reset();
      this.logradouros = [];  
    }    
  }


}

