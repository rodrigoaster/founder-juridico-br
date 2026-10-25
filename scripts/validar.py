#!/usr/bin/env python3
"""Valida o plugin: frontmatter das skills, links internos e citações de artigos.

Uso: python3 scripts/validar.py [--acervo /caminho/do/repo-leis]
Com --acervo, confere também se cada trecho de referencias/ é cópia literal do original.
"""
import argparse
import re
import sys
from pathlib import Path

RAIZ = Path(__file__).resolve().parent.parent
REFS = RAIZ / "referencias"

# Abreviação usada nos textos -> arquivo em referencias/
LEIS = {
    "LGPD": "lgpd-13709-2018",
    "MCI": "marco-civil-12965-2014",
    "Marco Civil": "marco-civil-12965-2014",
    "CDC": "cdc-8078-1990",
    "CC": "codigo-civil-10406-2002",
    "Dec. 7.962": "dec-7962-2013",
    "Dec. 8.771": "dec-8771-2016",
    "Lei 9.610": "direitos-autorais-9610-1998",
    "Lei 9.610/98": "direitos-autorais-9610-1998",
    "Lei 9.279": "propriedade-industrial-9279-1996",
    "Lei 9.279/96": "propriedade-industrial-9279-1996",
    "ECA Digital": "eca-digital-15211-2025",
    "Lei 14.063/2020": "assinatura-eletronica-14063-2020",
    "Lei 13.874/2019": "liberdade-economica-13874-2019",
}
CITACAO = re.compile(
    r"(LGPD|MCI|Marco Civil|CDC|CC|Dec\. [0-9.]+|Lei [0-9./]+|ECA Digital), arts?\. ([0-9º,\-A e]+)")
LINK = re.compile(r"`((?:\.\./)*[\w./-]+\.md)(?:#[\w-]+)?`")


def ancoras():
    return {f.stem: set(re.findall(r'<a id="([^"]+)"', f.read_text(encoding="utf-8")))
            for f in REFS.glob("*.md")}


def checar_skills(erros):
    for skill in sorted((RAIZ / "skills").iterdir()):
        arquivo = skill / "SKILL.md"
        if not arquivo.exists():
            erros.append(f"{skill.name}: sem SKILL.md")
            continue
        partes = arquivo.read_text(encoding="utf-8").split("---\n")
        front = partes[1] if len(partes) > 2 else ""
        nome = re.search(r"^name: (.+)$", front, re.M)
        if not nome or nome.group(1).strip() != skill.name:
            erros.append(f"{skill.name}: name ausente ou diferente da pasta")
        if not re.search(r'^description: ".+"$', front, re.M):
            erros.append(f"{skill.name}: description ausente ou sem aspas")


def checar_textos(erros, mapa):
    textos = list((RAIZ / "skills").glob("*/*.md")) + [REFS / "REGRAS.md"]
    total = 0
    for texto in textos:
        conteudo = texto.read_text(encoding="utf-8")
        rel = texto.relative_to(RAIZ)
        for caminho in LINK.findall(conteudo):
            alvos = [texto.parent / caminho, REFS / caminho, RAIZ / caminho]
            if not any(a.exists() for a in alvos):
                erros.append(f"{rel}: link quebrado {caminho}")
        for lei, arts in CITACAO.findall(conteudo):
            for art in re.findall(r"\d+(?:-A)?", arts):
                total += 1
                if f"art-{art.lower()}" not in mapa.get(LEIS.get(lei, ""), ()):
                    erros.append(f"{rel}: {lei}, art. {art} não está em referencias/")
    return total


def checar_acervo(erros, acervo):
    total = 0
    for ref in REFS.glob("*.md"):
        conteudo = ref.read_text(encoding="utf-8")
        origem = re.search(r'origem_acervo: "(.+)"', conteudo)
        if not origem or ref.name == "stf-tema-987.md":
            continue
        original = (acervo / origem.group(1)).read_text(encoding="utf-8")
        for bloco in re.split(r'<a id="[^"]+"></a>\n\n', conteudo.split("---\n", 2)[2])[1:]:
            total += 1
            if bloco.strip() not in original:
                erros.append(f"{ref.name}: trecho diverge do acervo: {bloco[:60]!r}")
    return total


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--acervo", type=Path)
    args = parser.parse_args()
    erros = []
    checar_skills(erros)
    citacoes = checar_textos(erros, ancoras())
    print(f"{citacoes} citações conferidas")
    if args.acervo:
        print(f"{checar_acervo(erros, args.acervo)} trechos conferidos com o acervo")
    for erro in erros:
        print("ERRO:", erro)
    return 1 if erros else 0


if __name__ == "__main__":
    sys.exit(main())
