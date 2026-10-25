# founder-juridico-br

Plugin para o [Claude Code](https://claude.com/claude-code) que ajuda founders de software
a lidar com o direito brasileiro: Termos de Uso, Política de Privacidade, checkout e
assinatura, conteúdo de usuários, crianças e adolescentes, propriedade intelectual e
contratos SaaS. Cada orientação cita **o texto literal da lei**, com link para a fonte
oficial.

> [!IMPORTANT]
> Conteúdo informativo. **Não é consultoria jurídica e não substitui advogado.** Os textos
> legais são de out/2026 e podem ter mudado; confira a fonte antes de usar.
>
> **Status:** versão 0.1.0, ainda sem revisão por advogado. A revisão está em andamento.

## Instalação

```
/plugin marketplace add rodrigoaster/founder-juridico-br
/plugin install founder-juridico-br@founder-juridico-br
```

Para testar localmente a partir de um clone: `claude --plugin-dir ./founder-juridico-br`.

## Skills

| Skill | Use para |
| --- | --- |
| `termos-de-uso` | Redigir ou revisar Termos de Uso; detectar cláusulas nulas pelo CDC |
| `politica-privacidade` | Política de Privacidade, cookies, ROPA, DPA, direitos do titular, incidentes (LGPD) |
| `checkout-assinatura` | Assinatura, teste grátis, reajuste, cancelamento, arrependimento de 7 dias |
| `conteudo-e-logs` | Guarda de logs, moderação e remoção de conteúdo (Marco Civil + tese do STF) |
| `criancas-adolescentes` | ECA Digital: acesso provável, verificação de idade, vedações |
| `pi-software` | Quem é dono do código, cessão com devs/PJ, open source, marca no INPI |
| `contratos-saas` | Contrato B2B, SLA, limitação de responsabilidade, NDA, assinatura eletrônica |
| `auditoria-juridica` | Comparar o **código** do produto com o que os Termos e a Política declaram |

Exemplos de pedidos:

- "Gere os termos de uso de um SaaS B2C com assinatura mensal e teste grátis."
- "Revise esta política de privacidade."
- "Audite este repositório: estamos prontos para lançar no Brasil?"
- "Um freelancer escreveu metade do nosso app. O que preciso assinar com ele?"

## Como funciona

```
skills/<skill>/SKILL.md     fluxo da skill
skills/<skill>/guia.md      orientação detalhada, com citações
skills/termos-de-uso/roteiro-revisao.md          roteiro para revisar termos existentes
skills/auditoria-juridica/checklist-lancamento.md checklist pré-lançamento
skills/pi-software/startup-societario.md         pontos societários da startup
referencias/                trechos literais das leis, compartilhados por todas as skills
referencias/REGRAS.md       triagem, regras de citação e aviso legal comuns
referencias/indice.md       tema → artigo → arquivo
scripts/extrair_artigos.py  regera referencias/ a partir do acervo
scripts/validar.py          checagem da CI
scripts/gerar_revisao.js    gera o Word para revisão jurídica
```

As skills só citam artigos presentes em `referencias/`. O que não está ali aparece marcado
como **"não verificado no acervo"**, com a URL oficial.

**Leis incluídas:** LGPD (13.709/2018), Marco Civil da Internet (12.965/2014) e
Decreto 8.771/2016, CDC (8.078/1990) e Decreto 7.962/2013, Código Civil (10.406/2002),
ECA Digital (15.211/2025), Direitos Autorais (9.610/1998), Propriedade Industrial
(9.279/1996), Assinatura Eletrônica (14.063/2020), Liberdade Econômica (13.874/2019) e
STF Temas 987/533.

**Lacunas conhecidas:** Lei 9.609/1998 (software), LC 182/2021 (Marco das Startups),
resoluções da ANPD; a tese do STF sobre o art. 19 do Marco Civil está truncada na fonte.

## Desenvolvimento

Os trechos vêm do acervo [ctresb/leis](https://github.com/ctresb/leis):

```
git clone https://github.com/ctresb/leis ../leis     # ~17 GB, fora deste repositório
python3 scripts/extrair_artigos.py ../leis        # regera referencias/
python3 scripts/validar.py --acervo ../leis       # confere citações e trechos
```

Para enviar os guias a um advogado, gere um Word com capa, apresentação ao revisor,
perguntas por guia e anexo de artigos (as perguntas ficam em `GUIAS`, no topo do script):

```
npm install
npm run revisao -- guias-revisao.docx
```

Contribuições: veja [CONTRIBUTING.md](CONTRIBUTING.md).

## Licença

MIT ([LICENSE](LICENSE)). Créditos do acervo e status dos textos legais em [NOTICE](NOTICE).
