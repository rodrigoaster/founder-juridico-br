# Marco Civil da Internet: logs e conteúdo de usuários

## Você é "provedor de aplicações"
Qualquer site, app ou API com fins econômicos é provedor de aplicações de internet.

## Guarda de logs (obrigatória)
- Pessoa jurídica que explora aplicação de forma organizada e com fins econômicos deve
  guardar **registros de acesso a aplicações por 6 meses**, sob sigilo e em ambiente
  seguro — MCI, art. 15. Autoridades podem pedir guarda por mais tempo (art. 15, § 2º);
  entrega do conteúdo só com ordem judicial.
- Registro de acesso = data e hora de uso a partir de um IP (MCI, art. 5º, VIII).
  Na prática: user_id + IP + porta de origem + timestamp com fuso, por login/ação.
- É vedado guardar registros de acesso a **outras** aplicações sem consentimento, e dados
  excessivos à finalidade consentida — MCI, art. 16.
- Coleta envolvendo terminal no Brasil: a lei brasileira se aplica, mesmo com empresa no
  exterior — MCI, art. 11.
- Padrões de segurança (controle de acesso, autenticação dupla para quem acessa os logs,
  inventário de acessos, criptografia) — Dec. 8.771, art. 13; publicar informações sobre
  esses padrões — Dec. 8.771, art. 16; formato interoperável — Dec. 8.771, art. 15.
- Direitos do usuário: informação clara nos termos sobre coleta e uso, consentimento
  expresso e destacado, exclusão dos dados ao fim da relação — MCI, art. 7º (incisos VIII a X).

## Conteúdo gerado por terceiros (UGC)
- Texto da lei: o provedor só responde civilmente se descumprir **ordem judicial
  específica** de remoção — MCI, art. 19; nudez/sexo íntimo sem autorização: responde se
  não remover após **notificação** da vítima — MCI, art. 21; avisar o usuário que publicou,
  quando possível — MCI, art. 20.
- **Atenção — STF, Temas 987 e 533** (`../../referencias/stf-tema-987.md`): o art. 19 foi
  declarado **parcialmente inconstitucional**. Enquanto não houver nova lei, o provedor
  responde após notificação extrajudicial (regime do art. 21) em casos de crime ou atos
  ilícitos e de contas inautênticas; crimes contra a honra seguem o art. 19; há dever de
  cuidado contra "falha sistêmica" em conteúdos gravíssimos listados na tese. O texto
  capturado está truncado: confirme os detalhes no acórdão antes de concluir.

## O que colocar no produto e nos termos
1. Canal de denúncia acessível, com protocolo e prazo.
2. Política de moderação pública: o que é removido, como se notifica o autor, como recorrer.
3. Fluxo interno de notificação extrajudicial (triagem, remoção, registro de decisão).
4. Retenção de logs de 6 meses + procedimento para ordens judiciais e pedidos de preservação.
5. Se o público pode incluir menores, ver também skill `criancas-adolescentes` (dever de remoção
   e comunicação de conteúdos de abuso — ECA Digital, art. 27).
