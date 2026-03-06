import { Injectable } from '@angular/core';
import { Cep } from '../../shared/models/cep-model';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Municipio } from '../../shared/models/municipio-model';


@Injectable({
  providedIn: 'root',
})
export class ViacepService {

  estados:string[] = [
    'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 
    'MA', 'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 
    'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'
  ];

  
  private apiCepUrl = 'https://viacep.com.br/ws';
  private apiMunicipiosUrl = 'https://servicodados.ibge.gov.br/api/v1/localidades/estados';

  constructor(private http: HttpClient) {
    
  }

  //https://viacep.com.br/ws/{CEP}/{FORMATO}/
  getByCEP(cep: number): Observable<Cep> {
    return this.http.get<Cep>(`${this.apiCepUrl}/${cep}/json`);
  }

  getEstados():string[] {
    return this.estados;
  }

  // https://servicodados.ibge.gov.br/api/v1/localidades/estados/${uf}/municipios
  getMunicipiosByEstado(estado: string): Observable<Municipio[]> {
    return this.http.get<Municipio[]>(`${this.apiMunicipiosUrl}/${estado}/municipios`);
  }

  //https://viacep.com.br/ws/{UF}/{CIDADE}/{LOGRADOURO}/json/
  getLogradouro(estado: string, municipio: string, logradouro: string): Observable<Cep[]> {

    const logradouroConferido = encodeURIComponent(logradouro);

    return this.http.get<Cep[]>(`${this.apiCepUrl}/${estado}/${municipio}/${logradouroConferido}/json`);
    
  }


}
