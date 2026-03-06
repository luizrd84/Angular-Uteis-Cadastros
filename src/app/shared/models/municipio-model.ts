export interface Municipio {
  id: number;
  nome: string;
}

/*RETORNO COMPLETO, porém vou usar apenas a cidade mesmo. 
{
  "id": 4205407,
  "nome": "Florianópolis",
  "microrregiao": {
    "id": 42016,
    "nome": "Florianópolis",
    "mesorregiao": {
      "id": 4204,
      "nome": "Grande Florianópolis",
      "UF": {
        "id": 42,
        "sigla": "SC",
        "nome": "Santa Catarina",
        "regiao": {
          "id": 4,
          "sigla": "S",
          "nome": "Sul"
        }
      }
    }
  }
}
*/