<div align="center">

<img src=".claude-plugin/icon.png" alt="" width="96">

# founder-juridico-br

**Direito brasileiro para quem constrói software.**

Termos de Uso, Política de Privacidade, checkout, contratos e auditoria do código,
com o texto literal da lei e link para a fonte oficial.

[![Release](https://img.shields.io/github/v/release/rodrigoaster/founder-juridico-br?label=vers%C3%A3o)](https://github.com/rodrigoaster/founder-juridico-br/releases/latest)
[![Licença MIT](https://img.shields.io/badge/licen%C3%A7a-MIT-blue)](LICENSE)
[![Claude Code](https://img.shields.io/badge/Claude%20Code-plugin-d97757)](https://claude.com/claude-code)

</div>

> [!IMPORTANT]
> Conteúdo informativo. **Não é consultoria jurídica e não substitui advogado.**
> Os textos legais são de out/2026 e podem ter mudado. Versão 0.2.0, com revisão
> jurídica em andamento.

## O que ele faz

| | Skill | Use para |
| --- | --- | --- |
| 📄 | `termos-de-uso` | Redigir ou revisar Termos de Uso e achar cláusulas nulas pelo CDC |
| 🔒 | `politica-privacidade` | Política de Privacidade, cookies, ROPA, DPA, direitos do titular e incidentes (LGPD) |
| 💳 | `checkout-assinatura` | Assinatura, teste grátis, reajuste, cancelamento e arrependimento de 7 dias |
| 💬 | `conteudo-e-logs` | Guarda de logs, moderação e remoção de conteúdo (Marco Civil e STF) |
| 🧒 | `criancas-adolescentes` | ECA Digital: acesso provável, verificação de idade e vedações |
| 🧠 | `pi-software` | Quem é dono do código, cessão com devs e PJ, open source, marca no INPI |
| 🤝 | `contratos-saas` | Contrato B2B, SLA, limitação de responsabilidade, NDA, assinatura eletrônica |
| 🔍 | `auditoria-juridica` | Comparar o **código** do produto com o que os Termos e a Política prometem |

## Instalação

**No Claude Code**, rode os dois comandos:

```
/plugin marketplace add rodrigoaster/founder-juridico-br
/plugin install founder-juridico-br@founder-juridico-br
```

<details>
<summary><b>Fora do Claude Code</b> (claude.ai, app do Claude e outros agentes)</summary>

<br>

Cada [release](https://github.com/rodrigoaster/founder-juridico-br/releases/latest) traz
um `.zip` por skill, autocontido: regras comuns e só as leis que aquela skill cita.

- **claude.ai e app do Claude:** envie o `.zip` na área de Skills das configurações.
- **Claude Code sem o plugin:** descompacte em `.claude/skills/` (só no projeto) ou em
  `~/.claude/skills/` (em todos os projetos).
- **Outros agentes com suporte a Agent Skills:** descompacte no diretório de skills da
  ferramenta.

A `auditoria-juridica` já inclui os guias das outras skills. As demais funcionam sozinhas;
quando uma delas menciona outra skill, a menção só vale se a outra também estiver instalada.

</details>

## Como usar

Converse normalmente. O Claude escolhe a skill certa pelo assunto do pedido; não é
preciso decorar comandos.

**1. Descreva o produto ou aponte o documento.** Quanto mais contexto, menos perguntas:

> Gere os termos de uso de um SaaS B2C com assinatura mensal e teste grátis de 14 dias.
> Hospedamos na AWS dos EUA e usamos Stripe e Google Analytics.

**2. Responda à triagem.** Se faltar algo que muda a resposta (B2B ou B2C, que dados
coleta, se cobra, se menores podem usar, quem escreveu o código), o Claude pergunta antes
de escrever. Se você estiver no repositório do produto, ele confere no código em vez de
perguntar.

**3. Receba o resultado.** Cada entrega traz:

- o documento ou parecer em português claro, com as cláusulas restritivas destacadas;
- os artigos citados com o trecho literal e o link oficial;
- os riscos ordenados por gravidade;
- o que depende de decisão de negócio;
- o que levar a um advogado antes de publicar.

### Exemplos de pedidos

| Situação | O que pedir |
| --- | --- |
| Vou lançar e não tenho nada | "Gere termos de uso e política de privacidade para este app." |
| Já tenho um documento | "Revise esta política de privacidade." (cole o texto ou indique o arquivo) |
| Quero saber se estou pronto | "Audite este repositório: estamos prontos para lançar no Brasil?" |
| Vou cobrar assinatura | "Como devo fazer o cancelamento e o teste grátis para não violar o CDC?" |
| Contratei freelancer | "Um freelancer escreveu metade do nosso app. O que preciso assinar com ele?" |
| Vou vender para empresas | "Revise este contrato SaaS do ponto de vista do fornecedor." |
| Público jovem | "Meu app de estudos pode ser usado por adolescentes. O que muda?" |

> [!TIP]
> Para a **auditoria**, abra o Claude Code dentro do repositório do produto. Ele varre
> formulários, SDKs, cookies, logs, exclusão de conta e cancelamento, cruza com os seus
> Termos e Política e entrega uma tabela com o arquivo e a linha de cada achado.

Se quiser chamar uma skill diretamente, use `/founder-juridico-br:<skill>`, por exemplo
`/founder-juridico-br:termos-de-uso`.

## De onde vêm as citações

As skills só citam artigos que estão em [`referencias/`](referencias/indice.md), trechos
literais extraídos das fontes oficiais. O que não está ali aparece marcado como
**"não verificado no acervo"**, com a URL oficial para você conferir.

O plugin foi construído a partir do acervo de legislação
[ctresb/leis](https://github.com/ctresb/leis). É dele que saem os trechos de
`referencias/` e a validação das citações.

**Leis incluídas:** LGPD (13.709/2018) · Marco Civil da Internet (12.965/2014) e
Decreto 8.771/2016 · CDC (8.078/1990) e Decreto 7.962/2013 · Código Civil (10.406/2002) ·
ECA Digital (15.211/2025) · Direitos Autorais (9.610/1998) · Propriedade Industrial
(9.279/1996) · Assinatura Eletrônica (14.063/2020) · Liberdade Econômica (13.874/2019) ·
STF Temas 987 e 533

**Ainda não incluídas:** Lei 9.609/1998 (software), LC 182/2021 (Marco das Startups) e
resoluções da ANPD. A tese do STF sobre o art. 19 do Marco Civil vem truncada na fonte.

## Desenvolvimento

<details>
<summary>Estrutura, scripts e release</summary>

<br>

```
skills/<skill>/SKILL.md      fluxo da skill
skills/<skill>/guia.md       orientação detalhada, com citações
referencias/                 trechos literais das leis, compartilhados pelas skills
referencias/REGRAS.md        triagem, regras de citação e aviso legal comuns
referencias/indice.md        tema → artigo → arquivo
scripts/extrair_artigos.py   regera referencias/ a partir do acervo
scripts/validar.py           checagem da CI
scripts/gerar_revisao.js     gera o Word para revisão jurídica
scripts/exportar_skills.py   gera as skills avulsas em dist/ (pastas e .zip)
```

Testar localmente a partir de um clone:

```
claude --plugin-dir ./founder-juridico-br
```

Os trechos vêm do acervo [ctresb/leis](https://github.com/ctresb/leis):

```
git clone https://github.com/ctresb/leis ../leis     # ~17 GB, fora deste repositório
python3 scripts/extrair_artigos.py ../leis           # regera referencias/
python3 scripts/validar.py --acervo ../leis          # confere citações e trechos
```

Gerar o Word para revisão por advogado (capa, apresentação, perguntas por guia e anexo de
artigos; as perguntas ficam em `GUIAS`, no topo do script):

```
npm install
npm run revisao -- guias-revisao.docx
```

Skills avulsas: `python3 scripts/exportar_skills.py`. Uma tag `vX.Y.Z` igual à versão do
`plugin.json` publica a release com os zips.

</details>

Contribuições são bem-vindas: veja o [CONTRIBUTING.md](CONTRIBUTING.md).

## Licença

MIT ([LICENSE](LICENSE)). Créditos do acervo e status dos textos legais no [NOTICE](NOTICE).
