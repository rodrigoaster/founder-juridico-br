# Como contribuir

## Regra de ouro
Toda afirmação jurídica cita um artigo presente em `referencias/`, no formato
"LGPD, art. 18", ou é marcada como **"não verificado no acervo"**, com a URL oficial.
A CI (`scripts/validar.py`) rejeita citações de artigos que não estão em `referencias/` e
links internos quebrados.

## Adicionar um artigo ou uma lei
1. Clone o acervo: `git clone https://github.com/ctresb/leis`.
2. Edite o dicionário `SELECAO` no topo de `scripts/extrair_artigos.py`.
3. Rode `python3 scripts/extrair_artigos.py ../leis`. Nunca edite `referencias/` à mão
   (exceção: `stf-tema-987.md` e `REGRAS.md`).
4. Se criar uma abreviação nova (ex.: "CLT"), adicione-a ao dicionário `LEIS` em
   `scripts/validar.py`.
5. Rode `python3 scripts/validar.py --acervo ../leis`.

## Adicionar ou alterar uma skill
- Cada skill fica em `skills/<nome>/`, com `SKILL.md` (frontmatter `name` igual à pasta e
  `description` entre aspas) e os arquivos de apoio.
- A `description` diz **quando** usar a skill, com as palavras que um founder digitaria.
- Referências compartilhadas: escreva o caminho como `../../referencias/<arquivo>.md`; o
  exportador reescreve esses caminhos nas skills avulsas.
- Teste localmente com `claude --plugin-dir .` e `claude plugin validate .`, e rode
  `python3 scripts/exportar_skills.py` (a CI falha se uma skill avulsa apontar para fora
  da própria pasta).

## O que não aceitamos
- Jurisprudência sem fonte no acervo.
- Paráfrase de lei apresentada como texto legal.
- Modelos que prometem conformidade garantida.
