// Gera um .docx com os guias do plugin para revisão jurídica.
// Uso: npm install && node scripts/gerar_revisao.js [saida.docx]
const fs = require("fs");
const path = require("path");
const {
  Document, Packer, Paragraph, TextRun, HeadingLevel, Table, TableRow, TableCell,
  WidthType, ShadingType, LevelFormat, AlignmentType, BorderStyle, PageBreak,
  Footer, PageNumber, TableOfContents,
} = require("docx");

const REPO = path.resolve(__dirname, "..");
const SAIDA = process.argv[2] || "guias-revisao.docx";
const FONTE = "Calibri";
const LARGURA = 9026; // A4 com margens de 1 polegada, em DXA

const GUIAS = [
  ["skills/termos-de-uso/guia.md", [
    "Em B2C, a cláusula de foro na sede da empresa e a arbitragem obrigatória devem ser simplesmente evitadas, ou existe redação que se sustente?",
    "A leitura de que o CDC, art. 51, I permite limitar a indenização quando o consumidor é pessoa jurídica está correta e é suficiente para orientar SaaS vendidos a pequenas empresas?",
    "O modelo de alteração dos termos (aviso prévio + direito de sair sem custo) é adequado? Que prazo de aviso o senhor(a) recomendaria?",
  ]],
  ["skills/termos-de-uso/roteiro-revisao.md", [
    "O roteiro deixa de fora algum ponto que costuma aparecer em litígios ou fiscalização de Procon?",
  ]],
  ["skills/politica-privacidade/guia.md", [
    "A tabela de bases legais por tratamento típico (art. 7º) reflete a prática e a orientação da ANPD?",
    "As resoluções da ANPD citadas (CD/ANPD nº 2/2022, 15/2024 e 19/2024) não estão no acervo de onde os textos foram extraídos. A numeração e o conteúdo atribuídos a elas estão corretos e vigentes?",
    "A orientação sobre cookies (consentimento para analytics e publicidade, botão de recusa equivalente) está alinhada ao entendimento atual?",
  ]],
  ["skills/checkout-assinatura/guia.md", [
    "O guia orienta reembolso integral em 7 dias também para planos anuais e serviços digitais já usados. Essa é a posição recomendável, considerando a discussão sobre arrependimento em serviços digitais?",
    "Há outras normas (por exemplo, regras recentes sobre cancelamento de assinaturas ou do Banco Central sobre pagamentos recorrentes) que deveriam constar?",
  ]],
  ["skills/conteudo-e-logs/guia.md", [
    "A síntese da tese do STF nos Temas 987 e 533 está correta? O texto capturado da fonte (Banco Nacional de Precedentes do CNJ) está truncado no item 5.3.",
    "A orientação prática de guarda de logs (campos e prazo de 6 meses) é suficiente, ou recomendaria prazo maior por prudência?",
  ]],
  ["skills/criancas-adolescentes/guia.md", [
    "Qual é a data de vigência do ECA Digital (Lei 15.211/2025) e quais regulamentações já foram editadas? O texto do acervo não traz a cláusula de vigência.",
    "O critério de \"acesso provável\" está descrito de forma útil para um founder decidir se a lei se aplica ao produto?",
  ]],
  ["skills/pi-software/guia.md", [
    "A Lei 9.609/1998 (Lei do Software) não está no acervo. A referência ao art. 4º, sobre titularidade do programa desenvolvido por empregado ou contratado, está correta e é aplicável a PJ e freelancers?",
    "O checklist de cláusulas para contratos com quem escreve código está completo? Há riscos de vínculo empregatício a mencionar?",
    "O alerta sobre AGPL em SaaS está adequado?",
  ]],
  ["skills/pi-software/startup-societario.md", [
    "Nenhum dos textos deste guia está no acervo. Os pontos sobre o Marco Legal das Startups (LC 182/2021), Simples Nacional e stock options estão corretos e atualizados?",
  ]],
  ["skills/contratos-saas/guia.md", [
    "A orientação sobre limitação de responsabilidade em B2B (teto de 12 meses de mensalidade, exclusão de lucros cessantes, inaplicabilidade em caso de dolo) é defensável sob o CC, art. 421-A?",
    "A descrição do alcance da Lei 14.063/2020 entre particulares está correta?",
  ]],
  ["skills/auditoria-juridica/checklist-lancamento.md", [
    "Algum item obrigatório está faltando no checklist pré-lançamento?",
  ]],
  ["referencias/REGRAS.md", [
    "O aviso legal (\"informativo, não substitui assessoria jurídica\") é suficiente diante do Estatuto da Advocacia (Lei 8.906/94) para uma ferramenta open source? Recomendaria outra redação?",
  ]],
];

// ---------- Markdown -> docx ----------
function inline(texto, base = {}) {
  const runs = [];
  const re = /(\*\*\*[^*]+\*\*\*|\*\*[^*]+\*\*|`[^`]+`|\*[^*]+\*|\[[^\]]+\]\([^)]+\))/g;
  let ultimo = 0, m;
  while ((m = re.exec(texto))) {
    if (m.index > ultimo) runs.push(new TextRun({ text: texto.slice(ultimo, m.index), ...base }));
    const t = m[0];
    if (t.startsWith("***")) runs.push(new TextRun({ text: t.slice(3, -3), bold: true, italics: true, ...base }));
    else if (t.startsWith("**")) runs.push(new TextRun({ text: t.slice(2, -2), bold: true, ...base }));
    else if (t.startsWith("`")) runs.push(new TextRun({ text: t.slice(1, -1), font: "Consolas", size: 20, ...base }));
    else if (t.startsWith("[")) runs.push(new TextRun({ text: t.slice(1, t.indexOf("]")), ...base }));
    else runs.push(new TextRun({ text: t.slice(1, -1), italics: true, ...base }));
    ultimo = m.index + t.length;
  }
  if (ultimo < texto.length) runs.push(new TextRun({ text: texto.slice(ultimo), ...base }));
  return runs;
}

function celula(texto, largura, cabecalho) {
  return new TableCell({
    width: { size: largura, type: WidthType.DXA },
    shading: cabecalho ? { type: ShadingType.CLEAR, color: "auto", fill: "E7ECF2" } : undefined,
    margins: { top: 60, bottom: 60, left: 100, right: 100 },
    children: [new Paragraph({ children: inline(texto.trim(), cabecalho ? { bold: true } : {}) })],
  });
}

function tabela(linhas) {
  const dados = linhas.filter((l) => !/^\|\s*:?-+/.test(l))
    .map((l) => l.replace(/^\|/, "").replace(/\|$/, "").split("|"));
  const n = dados[0].length;
  const larguras = Array(n).fill(Math.floor(LARGURA / n));
  larguras[n - 1] += LARGURA - larguras.reduce((a, b) => a + b, 0);
  return new Table({
    width: { size: LARGURA, type: WidthType.DXA },
    columnWidths: larguras,
    rows: dados.map((cols, i) => new TableRow({
      tableHeader: i === 0,
      children: cols.map((c, j) => celula(c, larguras[j], i === 0)),
    })),
  });
}

function converter(md, nivelBase) {
  // remove frontmatter e junta linhas de continuação (indentadas) ao item anterior
  md = md.replace(/^---\n[\s\S]*?\n---\n/, "");
  const brutas = md.split("\n");
  const linhas = [];
  for (const l of brutas) {
    const continuacao = /^\s{2,}\S/.test(l) && !/^\s*([-*]|\d+\.)\s/.test(l) && linhas.length
      && linhas[linhas.length - 1].trim() !== "";
    if (continuacao) linhas[linhas.length - 1] += " " + l.trim();
    else linhas.push(l);
  }
  const out = [];
  let paragrafo = [];
  const fechar = () => {
    if (paragrafo.length) out.push(new Paragraph({ children: inline(paragrafo.join(" ")), spacing: { after: 120 } }));
    paragrafo = [];
  };
  for (let i = 0; i < linhas.length; i++) {
    const l = linhas[i];
    let m;
    if (!l.trim()) { fechar(); continue; }
    if ((m = l.match(/^(#{1,4}) (.+)/))) {
      fechar();
      const nivel = Math.min(m[1].length + nivelBase, 4);
      out.push(new Paragraph({ heading: [HeadingLevel.HEADING_1, HeadingLevel.HEADING_2, HeadingLevel.HEADING_3, HeadingLevel.HEADING_4][nivel - 1], children: inline(m[2]) }));
    } else if (l.startsWith("|")) {
      fechar();
      const bloco = [];
      while (i < linhas.length && linhas[i].startsWith("|")) bloco.push(linhas[i++]);
      i--;
      out.push(tabela(bloco));
      out.push(new Paragraph({ children: [], spacing: { after: 60 } }));
    } else if ((m = l.match(/^(\s*)[-*] \[ \] (.+)/))) {
      fechar();
      out.push(new Paragraph({ numbering: { reference: "checklist", level: 0 }, children: inline(m[2]) }));
    } else if ((m = l.match(/^(\s*)[-*] (.+)/))) {
      fechar();
      out.push(new Paragraph({ numbering: { reference: "bullets", level: m[1].length >= 2 ? 1 : 0 }, children: inline(m[2]) }));
    } else if ((m = l.match(/^(\s*)\d+\. (.+)/))) {
      fechar();
      out.push(new Paragraph({ numbering: { reference: "numeros", level: 0, instance: secaoAtual }, children: inline(m[2]) }));
    } else if ((m = l.match(/^> ?(.*)/))) {
      fechar();
      out.push(new Paragraph({
        children: inline(m[1].replace(/^\[!\w+\]\s*/, "")),
        indent: { left: 360 },
        border: { left: { style: BorderStyle.SINGLE, size: 12, color: "8899AA", space: 8 } },
      }));
    } else {
      paragrafo.push(l.trim());
    }
  }
  fechar();
  return out;
}

let secaoAtual = 0;
const p = (texto, opts = {}) => new Paragraph({ children: inline(texto), spacing: { after: 120 }, ...opts });
const bullet = (texto) => new Paragraph({ numbering: { reference: "bullets", level: 0 }, children: inline(texto) });

// ---------- conteúdo ----------
const plugin = JSON.parse(fs.readFileSync(path.join(REPO, ".claude-plugin/plugin.json"), "utf8"));
const hoje = new Date().toLocaleDateString("pt-BR", { timeZone: "America/Sao_Paulo" });

const filhos = [
  new Paragraph({ children: [], spacing: { before: 2400 } }),
  new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "founder-juridico-br", bold: true, size: 48 })] }),
  new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 200 }, children: [new TextRun({ text: "Guias jurídicos para founders de software", size: 32 })] }),
  new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 200 }, children: [new TextRun({ text: "Documento para revisão jurídica", italics: true, size: 26 })] }),
  new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 1200 }, children: [new TextRun({ text: `Versão ${plugin.version} · ${hoje}`, size: 22 })] }),
  new Paragraph({ children: [new PageBreak()] }),

  new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun("Apresentação ao revisor")] }),
  p("Este documento reúne os guias do **founder-juridico-br**, um conjunto de instruções open source (licença MIT) para o Claude Code, assistente de IA da Anthropic. Os guias orientam a IA ao ajudar fundadores de startups de software a redigir e revisar Termos de Uso, Políticas de Privacidade, contratos SaaS e cuidados de propriedade intelectual sob o direito brasileiro."),
  p("Antes da publicação, pedimos uma revisão jurídica do conteúdo. O material é informativo e não pretende substituir assessoria jurídica; ainda assim, ele vai orientar decisões reais de quem lança produtos, e queremos evitar afirmações incorretas, desatualizadas ou imprudentes."),
  new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("Como o conteúdo foi produzido")] }),
  bullet("Os textos legais citados foram extraídos **literalmente** do acervo open source ctresb/leis, que converte para Markdown publicações de fontes oficiais (normas.leg.br, Planalto, Banco Nacional de Precedentes do CNJ). Os textos foram baixados em outubro de 2026."),
  bullet("Os guias foram redigidos com auxílio de IA. Uma checagem automática confirma que cada artigo citado existe nos trechos extraídos e que cada trecho é idêntico ao do acervo. Essa checagem **não** avalia se a interpretação está correta, e é isso que pedimos ao revisor."),
  bullet("O que não pôde ser conferido no acervo está marcado como \"não verificado no acervo\": Lei 9.609/1998 (só a retificação foi capturada), LC 182/2021, LC 123/2006 e as resoluções da ANPD."),
  new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("O que pedimos")] }),
  bullet("Apontar erros de interpretação, omissões relevantes e afirmações que deveriam ser mais cautelosas."),
  bullet("Indicar alterações legislativas, regulamentares ou jurisprudenciais posteriores que afetem o conteúdo."),
  bullet("Responder às perguntas específicas ao final de cada guia, destacadas como \"Pontos para o revisor\"."),
  bullet("Usar comentários ou o controle de alterações do Word diretamente neste arquivo."),
  new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("Convenções")] }),
  p("As citações seguem o formato \"LGPD, art. 18\". Abreviações: LGPD (Lei 13.709/2018), MCI (Marco Civil da Internet, Lei 12.965/2014), CDC (Lei 8.078/1990), CC (Código Civil, Lei 10.406/2002), Dec. 7.962 (Decreto 7.962/2013), Dec. 8.771 (Decreto 8.771/2016), ECA Digital (Lei 15.211/2025). Referências a \"skill\" indicam outro guia deste documento. O Anexo lista todos os artigos disponíveis na base de referência."),
  new Paragraph({ children: [new PageBreak()] }),
  new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun("Sumário")] }),
  new TableOfContents("Sumário", { hyperlink: true, headingStyleRange: "1-2" }),
  new Paragraph({ children: [new PageBreak()] }),
];

for (const [arquivo, perguntas] of GUIAS) {
  secaoAtual++;
  const md = fs.readFileSync(path.join(REPO, arquivo), "utf8");
  filhos.push(...converter(md, 0));
  filhos.push(new Paragraph({
    spacing: { before: 240, after: 120 },
    shading: { type: ShadingType.CLEAR, color: "auto", fill: "FFF4D6" },
    children: [new TextRun({ text: "Pontos para o revisor", bold: true })],
  }));
  for (const q of perguntas) {
    filhos.push(new Paragraph({ numbering: { reference: "perguntas", level: 0, instance: secaoAtual }, children: inline(q) }));
  }
  filhos.push(new Paragraph({ children: [new PageBreak()] }));
}

filhos.push(new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun("Anexo — artigos disponíveis na base de referência")] }));
filhos.push(p("Os guias só citam artigos desta lista. O texto literal de cada um acompanha o repositório, na pasta referencias/, com o link para a fonte oficial."));
const indice = fs.readFileSync(path.join(REPO, "referencias/indice.md"), "utf8")
  .split("\n").filter((l) => !l.startsWith("# ") && !l.startsWith("Trechos literais")).join("\n");
filhos.push(...converter(indice, 1));

// ---------- documento ----------
const lista = (ref, formato, texto) => ({
  reference: ref,
  levels: [
    { level: 0, format: formato, text: texto, alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 720, hanging: 360 } } } },
    { level: 1, format: LevelFormat.BULLET, text: "◦", alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 1440, hanging: 360 } } } },
  ],
});

const doc = new Document({
  creator: plugin.author.name,
  features: { updateFields: true },
  title: "founder-juridico-br — guias para revisão jurídica",
  styles: {
    default: { document: { run: { font: FONTE, size: 22 } } },
    paragraphStyles: [
      { id: "Heading1", name: "Heading 1", basedOn: "Normal", next: "Normal", quickFormat: true, run: { size: 34, bold: true, color: "1F3A5F" }, paragraph: { spacing: { before: 240, after: 160 }, outlineLevel: 0 } },
      { id: "Heading2", name: "Heading 2", basedOn: "Normal", next: "Normal", quickFormat: true, run: { size: 28, bold: true, color: "1F3A5F" }, paragraph: { spacing: { before: 240, after: 120 }, outlineLevel: 1 } },
      { id: "Heading3", name: "Heading 3", basedOn: "Normal", next: "Normal", quickFormat: true, run: { size: 24, bold: true }, paragraph: { spacing: { before: 200, after: 100 }, outlineLevel: 2 } },
    ],
  },
  numbering: {
    config: [
      lista("bullets", LevelFormat.BULLET, "•"),
      lista("checklist", LevelFormat.BULLET, "☐"),
      lista("numeros", LevelFormat.DECIMAL, "%1."),
      lista("perguntas", LevelFormat.DECIMAL, "%1."),
    ],
  },
  sections: [{
    properties: { page: { size: { width: 11906, height: 16838 }, margin: { top: 1440, bottom: 1440, left: 1440, right: 1440 } } },
    footers: {
      default: new Footer({
        children: [new Paragraph({
          alignment: AlignmentType.CENTER,
          children: [new TextRun({ text: "founder-juridico-br · documento para revisão · página ", size: 18, color: "666666" }),
            new TextRun({ children: [PageNumber.CURRENT], size: 18, color: "666666" })],
        })],
      }),
    },
    children: filhos,
  }],
});

Packer.toBuffer(doc).then((buf) => {
  fs.writeFileSync(SAIDA, buf);
  console.log("gerado:", SAIDA, buf.length, "bytes");
});
