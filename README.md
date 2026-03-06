# Funcionalidades Úteis para Cadastros

## 1 - Sistema de Busca de Endereços

Aplicação web desenvolvida em Angular para busca de endereços brasileiros a partir de:

- CEP
- Estado + Cidade + Nome da Rua

O sistema utiliza APIs públicas para localizar endereços e auxiliar no preenchimento de formulários de cadastro de forma rápida e padronizada.

## Tecnologias Utilizadas

- Angular 17+
- TypeScript
- HTML5
- CSS3
- Angular Forms (ngModel + ReactiveForms)
- RxJS (debounce, switchMap)
- APIs públicas (ViaCEP e IBGE)

## APIs Utilizadas

# ViaCEP

Utilizada para:

- Busca de endereço completo por CEP
- Busca de logradouros por estado, cidade e nome da rua
- Documentação: https://viacep.com.br/

# IBGE

Utilizada para:

- Listagem de municípios por estado
- Documentação: https://servicodados.ibge.gov.br/api/docs/localidades

## Funcionalidades

- Busca de endereço completo por CEP
- Formatação automática do CEP enquanto o usuário digita
- Seleção de estado para carregamento das cidades
- Autocomplete de cidades com filtragem dinâmica
- Busca de logradouros por nome da rua
- Lista de sugestões de ruas conforme o usuário digita
- Seleção de endereço completo com exibição formatada
- Reset automático de campos dependentes (estado → cidade → rua)

## Futuros Updates

- Mostrar um mapa com a rua
- Trazer outros tipos de funcionalidades úteis para cadastros

## Demostração do Projeto

-

## Como Executar o Projeto

```bash
# instalar dependências
npm install

# rodar aplicação
ng serve

```

### Autor

- Desenvolvido por Luiz Ricardo Dias.
