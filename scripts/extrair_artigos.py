#!/usr/bin/env python3
"""Regera referencias/ a partir do acervo de leis em Markdown.

Uso: python3 extrair_artigos.py /caminho/para/repo-leis
Copia literalmente os artigos selecionados (caput, incisos, paragrafos)
preservando o frontmatter de origem (fonte, urn, versao_texto, baixado_em).
"""
import re
import sys
from pathlib import Path

SELECAO = {
    "lgpd-13709-2018": ("federal/leis-ordinarias/2018/lei-13709-2018-08-14.md",
        ["1º", "2º", "3º", "4º", "5º", "6º", "7º", "8º", "9º", "10", "11", "12", "14",
         "15", "16", "17", "18", "33", "37", "38", "39", "41", "42", "46", "48", "52"]),
    "marco-civil-12965-2014": ("federal/leis-ordinarias/2014/lei-12965-2014-04-23.md",
        ["3º", "5º", "7º", "8º", "10", "11", "13", "15", "16", "18", "19", "20", "21"]),
    "dec-8771-2016": ("federal/decretos/2016/dec-8771-2016-05-11.md",
        ["11", "12", "13", "14", "15", "16"]),
    "cdc-8078-1990": ("federal/leis-ordinarias/1990/lei-8078-1990-09-11.md",
        ["2º", "3º", "6º", "14", "20", "25", "26", "27", "30", "31", "39", "43",
         "46", "47", "49", "51", "54", "101"]),
    "dec-7962-2013": ("federal/decretos/2013/dec-7962-2013-03-15.md",
        ["1º", "2º", "3º", "4º", "5º", "6º", "7º"]),
    "direitos-autorais-9610-1998": ("federal/leis-ordinarias/1998/lei-9610-1998-02-19.md",
        ["7º", "11", "22", "28", "29", "49", "50"]),
    "propriedade-industrial-9279-1996": ("federal/leis-ordinarias/1996/lei-9279-1996-05-14.md",
        ["10", "88", "122", "124", "129", "195"]),
    "codigo-civil-10406-2002": ("federal/leis-ordinarias/2002/lei-10406-2002-01-10.md",
        ["104", "107", "113", "186", "187", "421", "421-A", "422", "423", "424",
         "927", "944"]),
    "assinatura-eletronica-14063-2020": ("federal/leis-ordinarias/2020/lei-14063-2020-09-23.md",
        ["3º", "4º"]),
    "eca-digital-15211-2025": ("federal/leis-ordinarias/2025/lei-15211-2025-09-17.md",
        ["1º", "2º", "3º", "6º", "9º", "10", "12", "13", "20", "22", "26", "27", "35", "39", "40"]),
    "liberdade-economica-13874-2019": ("federal/leis-ordinarias/2019/lei-13874-2019-09-20.md",
        ["1º", "2º", "3º"]),
}

INICIO_ART = re.compile(r"^\*\*Art\. ([0-9.]+(?:º|°)?(?:-[A-Z])?)\.?\*\*")
FIM_BLOCO = re.compile(r"^(\*\*Art\. |#)")
CAMPOS = ("titulo", "ementa", "versao_texto", "urn", "fonte", "baixado_em")


def ler(caminho):
    texto = caminho.read_text(encoding="utf-8")
    _, front, corpo = texto.split("---\n", 2)
    meta = {}
    for linha in front.splitlines():
        chave, _, valor = linha.partition(": ")
        meta[chave] = valor
    return meta, corpo.splitlines()


def artigos(linhas):
    atual, bloco = None, []
    for linha in linhas:
        m = INICIO_ART.match(linha)
        if m or (atual and FIM_BLOCO.match(linha)):
            if atual:
                yield atual, "\n".join(bloco).strip()
            atual, bloco = (m.group(1).rstrip(".").replace("°", "º"), [linha]) if m else (None, [])
        elif atual:
            bloco.append(linha)
    if atual:
        yield atual, "\n".join(bloco).strip()


def main(repo):
    destino = Path(__file__).resolve().parent.parent / "referencias"
    destino.mkdir(exist_ok=True)
    faltando = []
    indice = ["# Índice das referências", "",
              "Trechos literais do acervo `leis`. Âncoras: `<arquivo>.md#art-N`. "
              "A tese do STF está em [stf-tema-987.md](stf-tema-987.md).", ""]
    for nome, (rel, selecao) in SELECAO.items():
        meta, linhas = ler(repo / rel)
        achados = {}
        for num, bloco in artigos(linhas):
            achados.setdefault(num, bloco)  # primeira ocorrencia: texto principal
        saida = ["---"] + [f"{c}: {meta[c]}" for c in CAMPOS if c in meta]
        titulo = meta["titulo"].strip('"')
        saida += [f'origem_acervo: "{rel}"', "---", f"# {titulo}", ""]
        indice += [f"## [{titulo}]({nome}.md)", ""]
        for num in selecao:
            if num not in achados:
                faltando.append(f"{nome} art. {num}")
                continue
            ancora = "art-" + re.sub(r"[º°.]", "", num).lower()
            saida += [f'<a id="{ancora}"></a>', "", achados[num], ""]
            caput = INICIO_ART.sub("", achados[num].splitlines()[0]).strip()
            indice.append(f"- [art. {num}]({nome}.md#{ancora}) — {caput[:90]}…")
        indice.append("")
        (destino / f"{nome}.md").write_text("\n".join(saida), encoding="utf-8")
        print(f"{nome}: {len(selecao)} artigos")
    (destino / "indice.md").write_text("\n".join(indice), encoding="utf-8")
    if faltando:
        print("NAO ENCONTRADOS:", *faltando, sep="\n  ")
        return 1
    return 0


if __name__ == "__main__":
    sys.exit(main(Path(sys.argv[1])))
