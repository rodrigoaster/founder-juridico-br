# Contratos SaaS B2B, SLA, NDA e assinatura eletrônica

## B2B não é automaticamente livre do CDC
Empresa que usa o software como **destinatária final** pode ser consumidora (CDC, art. 2º);
vulnerabilidade concreta também atrai o CDC. Para clientes empresariais típicos, vale o
Código Civil:
- Contratos empresariais presumem-se paritários; partes podem definir interpretação,
  alocação de riscos e revisão é excepcional — CC, art. 421-A.
- Liberdade contratual dentro da função social — CC, art. 421; boa-fé — CC, art. 422.
- Liberdade econômica e intervenção mínima — Lei 13.874/2019, arts. 1º a 3º (o art. 3º, VIII
  garante que negócios empresariais paritários sejam respeitados).
- Se o contrato for padronizado (adesão), mesmo B2B: ambiguidade contra quem redigiu e
  nula renúncia antecipada a direitos — CC, arts. 423 e 424.

## Cláusulas centrais
1. **Escopo e SLA**: disponibilidade mensal (ex.: 99,5%), como se mede, janelas de
  manutenção, exclusões, tempos de resposta por severidade, créditos como remédio.
2. **Limitação de responsabilidade**: teto (ex.: 12 meses de mensalidade), exclusão de
  lucros cessantes/danos indiretos. Aceita em B2B paritário; **não** vale para dolo, e é
  frágil em dano a terceiros ou violação de dados. Indenização mede-se pela extensão do
  dano — CC, art. 944; ato ilícito e abuso de direito — CC, arts. 186, 187 e 927.
3. **Proteção de dados (DPA)**: cliente controlador, você operador; instruções, suboperadores,
  segurança, incidentes, transferência internacional, devolução/eliminação ao fim — LGPD,
  arts. 37, 39, 42, 46, 48 e 33.
4. **PI**: plataforma é sua; dados e conteúdo do cliente são do cliente; feedback.
5. **Confidencialidade** com prazo de sobrevivência.
6. **Preço e reajuste** por índice definido; inadimplência e suspensão com aviso.
7. **Prazo, renovação e rescisão**; exportação dos dados ao final.
8. **Foro ou arbitragem** (em B2B paritário é possível escolher).

## NDA
Defina informação confidencial, exceções (pública, já conhecida, ordem judicial),
finalidade permitida, prazo, devolução, multa. Lembre que segredo empresarial também é
protegido pela concorrência desleal — Lei 9.279, art. 195.

## Assinatura eletrônica
- Classificação: simples, avançada e qualificada (ICP-Brasil) — Lei 14.063/2020, art. 4º;
  definições — art. 3º. A lei regula sobretudo interação com entes públicos; entre
  particulares vale a forma livre (CC, art. 107) e a prova da autoria/integridade.
- Na prática: plataformas de assinatura (avançada) bastam para SaaS, NDA e contratos com
  devs; guarde trilha de auditoria (e-mail, IP, hash, data).
