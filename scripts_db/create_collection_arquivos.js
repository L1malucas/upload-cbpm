db.createCollection("Arquivos", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      title: "Objeto para validação dos campos do documento",
      required: [
        "Pasta",
        "NomeArquivo",
        "Operador",
        "ReferenciaFTP",
        "CamposBusca",
        "DataUpload",
        "DataDigitalizacao",
      ],
      properties: {
        Pasta: {
          bsonType: "string",
          description: "O campo'Pasta' deve ser uma string e é obrigatório",
        },
        NomeArquivo: {
          bsonType: "string",
          description:
            "O campo 'NomeArquivo' deve ser uma string e é obrigatório",
        },
        Operador: {
          bsonType: "string",
          description: "O campo 'Operador' deve ser uma string e é obrigatório",
        },
        ReferenciaFTP: {
          bsonType: "string",
          description:
            "O campo 'ReferenciaFTP' deve ser uma string e é obrigatório",
        },
        CamposBusca: {
          bsonType: "array",
          description: "'CamposBusca' deve ser um array e é obrigatório",
          items: {
            bsonType: "string",
            description:
              "'CamposBusca' deve ser um array de string e é obrigatório",
          },
        },
        DataUpload: {
          bsonType: "date",
          description: "O campo 'DataUpload' deve ser uma data e é obrigatório",
        },
        DataDigitalizacao: {
          bsonType: "date",
          description:
            "O campo 'DataDigitalizacao' deve ser uma data e é obrigatório",
        },
      },
    },
  },
});

db.Arquivos.createIndex({ Pasta: 1 }, { name: "idx_Pasta" });
db.Arquivos.createIndex({ DataUpload: 1 }, { name: "idx_DataUpload" });
db.Arquivos.createIndex(
  { DataDigitalizacao: 1 },
  { name: "idx_DataDigitalizacao" }
);
db.Arquivos.createIndex({ CamposBusca: 1 }, { name: "idx_CamposBusca" });
db.Arquivos.createIndex({ Operador: 1 }, { name: "idx_Operador" });
