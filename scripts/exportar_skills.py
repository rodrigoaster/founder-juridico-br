#!/usr/bin/env python3
"""Exporta cada skill como pasta autocontida, para uso fora do Claude Code.

Uso: python3 scripts/exportar_skills.py [--saida dist]
Gera <saida>/<skill>/ e <saida>/<skill>.zip. Cada pasta leva o REGRAS.md e só as
referências que a skill cita; os caminhos são reescritos para dentro da pasta.
Termina com erro se alguma pasta exportada apontar para arquivo inexistente.
"""
import argparse
import re
import shutil
import sys
import zipfile
from pathlib import Path

from validar import CITACAO, LEIS, LINK, RAIZ, REFS

SKILLS = RAIZ / "skills"
OUTRAS_SKILLS = "`../<skill>/guia.md`"  # usado pela auditoria para ler os outros guias


def referencias_citadas(textos):
    nomes = set()
    for texto in textos:
        nomes.update(LEIS[lei] for lei, _ in CITACAO.findall(texto) if lei in LEIS)
        nomes.update(re.findall(r"referencias/([\w-]+)\.md", texto))
    nomes.discard("REGRAS")
    nomes.discard("indice")
    return sorted(nomes)


def indice_filtrado(nomes):
    """Mantém do índice só as seções das leis presentes na pasta exportada."""
    linhas, manter = [], True
    for linha in (REFS / "indice.md").read_text(encoding="utf-8").splitlines():
        secao = re.match(r"## \[.+\]\(([\w-]+)\.md\)", linha)
        if secao:
            manter = secao.group(1) in nomes
        if manter and not ("stf-tema-987" in linha and "stf-tema-987" not in nomes):
            linhas.append(linha)
    return "\n".join(linhas) + "\n"


def exportar(skill, saida):
    destino = saida / skill.name
    shutil.rmtree(destino, ignore_errors=True)
    shutil.copytree(skill, destino)
    (destino / "referencias").mkdir()

    textos = {p: p.read_text(encoding="utf-8") for p in destino.glob("*.md")}
    if any(OUTRAS_SKILLS in t for t in textos.values()):
        (destino / "guias").mkdir()
        for outra in sorted(SKILLS.iterdir()):
            if outra != skill and (outra / "guia.md").exists():
                alvo = destino / "guias" / f"{outra.name}.md"
                textos[alvo] = (outra / "guia.md").read_text(encoding="utf-8")

    regras = (REFS / "REGRAS.md").read_text(encoding="utf-8")
    regras = regras.replace("relativos à raiz do plugin", "relativos à pasta desta skill")
    textos[destino / "REGRAS.md"] = regras

    for caminho, texto in textos.items():
        prefixo = "../" if caminho.parent.name == "guias" else ""
        texto = texto.replace("../../referencias/REGRAS.md", "REGRAS.md")
        texto = texto.replace("../../referencias/", prefixo + "referencias/")
        texto = texto.replace(OUTRAS_SKILLS, "`guias/<skill>.md`")
        caminho.write_text(texto, encoding="utf-8")

    nomes = referencias_citadas(textos.values())
    for nome in nomes:
        if (REFS / f"{nome}.md").exists():  # ausentes são acusados por verificar()
            shutil.copy(REFS / f"{nome}.md", destino / "referencias" / f"{nome}.md")
    (destino / "referencias" / "indice.md").write_text(indice_filtrado(nomes), encoding="utf-8")

    with zipfile.ZipFile(saida / f"{skill.name}.zip", "w", zipfile.ZIP_DEFLATED) as zf:
        for arquivo in sorted(destino.rglob("*")):
            if arquivo.is_file():
                zf.write(arquivo, arquivo.relative_to(saida))
    return destino, nomes


def verificar(destino):
    erros = []
    for arquivo in destino.rglob("*.md"):
        texto = arquivo.read_text(encoding="utf-8")
        for caminho in LINK.findall(texto):
            candidatos = [arquivo.parent / caminho, destino / caminho]
            if not any(c.resolve().is_relative_to(destino.resolve()) and c.exists() for c in candidatos):
                erros.append(f"{arquivo.relative_to(destino.parent)}: aponta para fora ou para arquivo inexistente: {caminho}")
        for lei, arts in CITACAO.findall(texto):
            nome = LEIS.get(lei)
            if nome and not (destino / "referencias" / f"{nome}.md").exists():
                erros.append(f"{arquivo.relative_to(destino.parent)}: cita {lei} sem a referência na pasta")
    return erros


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--saida", type=Path, default=RAIZ / "dist")
    args = parser.parse_args()
    args.saida.mkdir(parents=True, exist_ok=True)
    erros = []
    for skill in sorted(p for p in SKILLS.iterdir() if (p / "SKILL.md").exists()):
        destino, nomes = exportar(skill, args.saida)
        erros += verificar(destino)
        print(f"{skill.name}: {len(nomes)} referências")
    for erro in erros:
        print("ERRO:", erro)
    return 1 if erros else 0


if __name__ == "__main__":
    sys.exit(main())
