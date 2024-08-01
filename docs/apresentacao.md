---
title: Sistema de Upload de Arquivos da CBPM
theme: default
header: Sistema de Upload de Arquivos da CBPM
footer: RENOVA
paginate: true
marp: true
---
<!-- markdownlint-disable MD025 MD033 MD003 MD024 -->

<style>
img[alt~="center"] {
  display: block;
  margin: 0 auto;
}
</style>

# CBPM

## Sistema de Upload de Arquivos

<br/>
<br/>
<br/>

<style scoped>
h1 {
    padding-top: 1.5em;
}
</style>

---

## Apresentação

Este documento tem como objetivo apresentar o sistema de upload de arquivos da CBPM, que tem como finalidade o armazenamento de arquivos de diversos tipos, bem como o armazenamento de metadados associados a esses arquivos em um banco de dados.

---

## Arquitetura do Sistema

<!-- Imagem da Arquitetura do Sistema -->

![w:800px center](./img/diagrama.png)

---

## Arquitetura do Sistema

<br>

![w:800px center](./img/fluxo_execucao.png)

---

## Tecnologias Utilizadas

- Electron
- Node.js
- MongoDB
- Prisma ORM
- Dotenv

---

## Fluxo de Execução

1. O ***usuário*** seleciona a pasta que deseja fazer o upload dos arquivos.
2. O ***sistema*** faz um processo de varredura na pasta selecionada, entrando em todas as subpastas, caso existam.
3. O ***sistema*** faz a leitura dos arquivos, de forma individual, juntamente com os metadados associados a eles.
4. O ***sistema*** faz o envio dos arquivos para o servidor ftp.
5. O ***sistema*** faz a inserção dos metadados do arquivo no banco de dados.
6. O ***sistema*** faz uma marcação no arquivo, adicionando um prefixo no seu nome, indicando que o mesmo já foi processado.

---

## Fluxo de Execução

<!-- O sistema foi pensado para ser executado em um ambiente *headless*, ou seja, sem a necessidade de interação com o usuário. O sistema é executado em *background*, de forma automática, sem a necessidade de intervenção humana. -->

O sistema foi pensado para ser executado como um ***tray application***, ou seja, um aplicativo que roda na bandeja do sistema.

![w:300 center](./img/fluxo_execucao01.png)

---

## Fluxo de Execução

O gerenciador de arquivos é aberto e o usuário seleciona a pasta que deseja fazer o upload dos arquivos.

![w:600px center](./img/fluxo_execucao02.png)

---

## Fluxo de Execução

Exemplo de arquivos antes do processamento.

![w:600px center](./img/fluxo_execucao03.png)

---

## Fluxo de Execução

Arquivos processados salvos no servidor FTP.

![w:600px center](./img/fluxo_execucao05.png)

---

## Fluxo de Execução

Metadados dos arquivos salvos no banco de dados (MongoDB).

![w:400px center](./img/fluxo_execucao06.png)

---

## Fluxo de Execução

O sistema faz a marcação dos arquivos "locais" processados, adicionando um prefixo no nome do arquivo.

![w:600px center](./img/fluxo_execucao04.png)

---

## Dúvidas❓❓❓
