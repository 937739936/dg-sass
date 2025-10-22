<template>
  <div>
    <div class="agree">
      <p class="tr serialNo"><strong>编号：{{agreeManageInfo.serialNo}}</strong></p>
      <p class="tac"><strong>电子仓单管理协议</strong></p>
      <p class="tr signArea" ><strong>签署地点：{{agreeManageInfo.signArea}}</strong></p>
      <p class="tr effectiveStartDate"><strong>签署日期：{{agreeManageInfo.effectiveStartDate}}</strong></p>
      <p>甲方（仓储方）：{{storageCompanyInfo.storageCompanyName}}</p>
      <p>统一社会信用代码：{{storageCompanyInfo.storageCompanyUscc}}</p>
      <p>法定代表人：{{legalPersonName}}</p>
      <p>&nbsp;</p>
      <p>乙方（核心企业）：{{companyInfo.name}}</p>
      <p>统一社会信用代码：{{companyInfo.uscc}}</p>
      <p>法定代表人：{{companyInfo.legalPersonName}}</p>
      <p>&nbsp;</p>
      <p><strong><strong>鉴于：</strong></strong></p>
      <p v-if="agreeManageInfo.templateType =='WAREHOUSE_RECEIPT_MANAGE_AGREEMENT_001'"  class="indent mb8 storageCompanyAddress">1.甲方是根据《中华人民共和国民法典》规定，经过工商行政管理机关核准登记的专营或兼营仓储业务且具有从事仓储资格的法人或其他组织。
        <span >甲方拥有位于{{storageCompanyAddress}}（以下简称为&ldquo;仓储地&rdquo;）的所有权和经营管理权，有权在仓储地为其他主体提供货物仓储及仓储管理等服务。</span>
      </p>
      <p  v-if="agreeManageInfo.templateType =='WAREHOUSE_RECEIPT_MANAGE_AGREEMENT_002'"  class="indent mb8 storageCompanyAddress">1.甲方拥有位于{{storageCompanyAddress}}（以下简称为&ldquo;仓储地&rdquo;）的租赁权和经营管理权，有权在仓储地为其他主体提供货物仓储及仓储管理等服务。</p>
      <p class="indent mb8 stationLeaseContractNo">2.甲方为乙方在仓储地提供仓储管理服务，并签订了编号为 {{stationLeaseContractNo}}的【《仓库租赁合同》】（以下简称为&ldquo;原合同&rdquo;）。</p>
      <p class="indent mb8">现甲乙双方协商一致，就甲乙双方在数链平台就甲方在仓储地的库存货物（如有）及甲方在原合同服务期限内仓储地后续入库货物在{{systemConfig.name}}平台（以下简称为&ldquo;{{ systemConfig.name }}&rdquo;或&ldquo;数链平台&rdquo;）上开立电子仓单，并就电子仓单后续流转、融资及注销等事宜达成如下协议。</p>
      <p>&nbsp;</p>
      <p><strong><strong>一、订立目的及特殊说明</strong></strong></p>
      <p class="indent mb8">1.1甲乙双方按照《{{ systemConfig.name }}用户服务协议》《电子仓单用户服务协议》注册成为{{ systemConfig.name }}平台用户，并享受电子仓单相关服务，包括但不限于电子仓单开立、电子仓单流转、电子仓单融资以及电子仓单注销服务等。甲方作为仓储管理服务的提供者（以下简称为&ldquo;仓储方&rdquo;）与仓储场地内标的货物的所有权人（或未来获取仓储场地内标的货物的所有权，以下简称为&ldquo;核心企业&rdquo;）签署本协议，对于甲乙双方在数链平台上涉及的电子仓单的开立、流转、融资及注销等事项进行约定。</p>
      <p class="indent mb8"><strong><strong>1.2需要重点提醒的是：甲乙方均作为{{ systemConfig.name }}平台用户，需要通过数链平台，以电子签名形式签署本协议。甲乙双方确认均已认真阅读、知晓、理解和同意接受本协议的全部条款和条件，甲乙双方通过电子签名形式签订本协议且协议生效后，对各方产生法律效力。</strong></strong></p>
      <p class="indent mb8"><strong><strong>1.3需要特殊说明的是，如本协议条款与甲乙双方签订的原合同对于权利义务约定不一致的，对于开立电子仓单的标的货物，以本协议条款约定为准；对于仍未开立电子仓单的标的货物，以原合同约定为准。</strong></strong></p>
      <p><strong><strong>二、定义</strong></strong></p>
      <p class="indent mb8">如无特殊约定或说明，下列词语或表述在本协议项下具有如下定义和解释。</p>
      <p class="indent mb8">2.1平台：指为各方主体提供电子仓单开立、流转、融资及注销服务的{{ systemConfig.name }}平台。</p>
      <p  class="indent mb8">2.2《电子仓单用户服务协议》：指甲乙双方各自和数链平台签订的关于平台为甲乙双方分别提供电子仓单线上服务的约定。本协议以《电子仓单用户服务协议》为基础，本协议项下条款和内容与《电子仓单用户服务协议》不一致的，以本协议为准；本协议没有约定或提及的，以《电子仓单用户服务协议》的约定为准。</p>
      <p  class="indent mb8">2.3核心企业：指在数链平台注册、通过货物入库或货物货权转移取得仓储方开立的电子仓单，并有权提取电子仓单对应的货物或转移电子仓单对应货物货权的法人或其他组织。</p>
      <p  class="indent mb8">2.4仓储方：指根据《中华人民共和国民法典》规定，经过工商行政管理机关核准登记的专营或兼营仓储业务且具有从事仓储资格、或租赁某一仓储地并为仓储地内存储货物提供仓储服务的法人或其他组织。</p>
      <p  class="indent mb8">2.5电子仓单：指仓储方依据现实存在的货物在数链平台上开具的，包含存货人名称、存货信息、存货仓储信息及保险信息等信息的，表征特定仓储物品权利的单据。</p>
      <p  class="indent mb8">2.6金融机构：指在数链平台上为电子仓单提供质押融资服务的法人或其他组织。</p>
      <p  class="indent mb8">2.7标的货物：指电子仓单上记载的、对应现实存在的货物。</p>
      <p  class="indent mb8">2.8电子仓单持有人：指因仓储方根据仓储地现实存货情况、确认核心企业发出的电子仓单开立申请或因电子仓单的流转而持有电子仓单的核心企业。</p>
      <p class="indent mb8">电子仓单持有人有权转让电子仓单、注销电子仓单或利用电子仓单进行融资；也有权要求自身指定的第三方提取电子仓单对应的全部或部分现实货物。</p>
      <p>
      <p class="indent mb8">2.9电子仓单受让人：指根据数链平台要求和指引，在仓储方同意的情况下，受让电子仓单的核心企业。</p>
      <p class="indent mb8">2.10第三方提货人：指根据电子仓单持有人请求，在仓储方同意的情况下，有权提取电子仓单对应的全部或部分标的货物第三方法人或其他组织。</p>
      <p class="indent mb8">2.11电子仓单的开立：指仓储方在数链平台上基于现实货物为现实货物所有权人开出电子仓单，以确认相关主体对现实货物具有所有权。</p>
      <p class="indent mb8">2.12电子仓单的流转：指电子仓单持有人将电子仓单所对应的标的货物所有权全部或部分转让给其他主体的行为。如电子仓单全部或部分转让，则电子仓单对应的现实标的货物的所有权也全部或部分转让。</p>
      <p class="indent mb8">2.13电子仓单的注销：电子仓单的注销存在以下两种情况：（1）电子仓单持有人要求仓储方将电子仓单进行实物提货，仓储方在数链平台上注销相应的电子仓单。仓储方应当为电子仓单持有人开具相关单据供电子仓单持有人或其指定第三方顺利提取货物；（2）电子仓单持有人将电子仓单全部或部分转让给电子仓单受让人，在仓储方同意的情况下，电子仓单的流转完成，此时仓储方需要注销电子仓单持有人原来持有的电子仓单。</p>
      <p class="indent mb8">2.14电子仓单融资：指电子仓单持有人根据金融机构的要求，利用电子仓单发起融资的行为。</p>
      <p><strong><strong>三、电子仓单的开立</strong></strong></p>
      <p class="indent mb8">在乙方申请开立电子仓单时，甲乙双方需要遵守下述条款并承担相应的权利义务。</p>
      <p class="indent mb8">3.1 乙方通过数链平台进入&ldquo;电子仓单管理&rdquo;项下&ldquo;仓单开立&rdquo;页面，根据平台的要求和规定并选择相关入库货物信息发起电子仓单开立申请。数链平台有权对于电子仓单开立申请进行审核。</p>
      <p class="indent mb8">3.2 数链平台有权对于电子仓单申请进行形式审查，数链平台有权：</p>
      <p class="indent mb8">（1）审查不通过的，退回乙方的电子仓单开立申请；</p>
      <p class="indent mb8">（2）审查通过的，若甲方审核通过并盖章的，则电子仓单开立；若甲方审核不通过的，则电子仓单未能开立。</p>
      <p class="indent mb8">甲乙方确认，数链平台不对电子仓单申请（包括但不限于货物信息、仓储地信息等）的真实性、合法性作出任何承诺或确认。因库存货物真实性、仓储地管理情况等产生的任何纠纷或损失，由甲乙方自行解决，数链平台不承担任何形式的责任。</p>
      <p class="indent mb8">3.3 甲方在收到乙方发出的电子仓单开立申请后，甲方有权独立自主地判断是否同意乙方电子仓单开立申请并为乙方开立电子仓单。</p>
      <p class="indent mb8">3.4 如甲方同意为乙方开立电子仓单，则应当于确认期限内在待开立的电子仓单上通过电子签名方式加盖公章。在甲方加盖公章后，电子仓单开立成功，对于甲乙双方产生法律效力。</p>
      <p class="indent mb8">3.5 发生如下任一情形时，电子仓单开立失败：</p>
      <p class="indent mb8">（1）在甲方在待开立电子仓单上加盖公章前任何时点，乙方单方撤回电子仓单开立申请（具体以线上操作流程为准）；</p>
      <p class="indent mb8">（2）数链平台退回电子仓单开立申请的；</p>
      <p class="indent mb8">（3）甲方在确认期限内拒绝加盖公章的；</p>
      <p class="indent mb8">（4）甲方在确认期限内未作出任何确认的。</p>
      <p class="indent mb8">3.6 在电子仓单开立成功后，乙方即成为电子仓单持有人，电子仓单具体内容如附件一《电子仓单模板》。乙方成为电子仓单持有人后，有权对于电子仓单进行电子仓单的转让、注销以及利用电子仓单开展融资。</p>
      <p class="indent mb8"><strong><strong>3.7</strong></strong>&nbsp;<strong><strong>甲乙双方确认，在数链平台上电子仓单的开立，并不必然意味着电子仓单具有法律意义上的仓单效力。如因法律规定，导致数链平台上开立的电子仓单未能发生预期的法律效力，则数链平台不承担任何责任。</strong></strong></p>
      <p><strong><strong>四、电子仓单的流转</strong></strong></p>
      <p class="indent mb8">在乙方作为电子仓单持有人，需要将电子仓单转让给电子仓单受让人时，甲乙双方需要遵守下述条款并承担相应的权利义务。</p>
      <p class="indent mb8">4.1 乙方通过数链平台进入&ldquo;电子仓单管理&rdquo;项下&ldquo;仓单过户&rdquo;页面，根据平台的要求和规定并确定转让标的货物的质数量发起电子仓单转让申请。数链平台有权对于电子仓单转让申请进行审核。</p>
      <p class="indent mb8"> 4.2 在乙方确认转让标的货物质数量及电子仓单受让人后，需要在数链平台确认转让标的货物的质数量、转让电子仓单的编号以及电子仓单受让人的相关信息。确认相关信息并在平台相关文件盖章后，乙方成功发起电子仓单转让申请。</p>
      <p class="indent mb8">4.3 电子仓单受让人在数链平台收到电子仓单转让申请后，可以在数链平台确认转让标的货物的质数量、转让电子仓单的编号以及电子仓单转让人的相关信息。如电子仓单确认相关信息无误的，电子仓单受让人可以在数链平台确认签署信息并在平台相关文件盖章后，电子仓单受让人成功接收电子仓单转让申请。</p>
      <p class="indent mb8">4.4 在电子仓单持有人及电子仓单受让人均确认转让标的货物的信息且在平台相关文件盖章后，开立电子仓单的仓储方需要审核前述电子仓单转让的相关信息（包括但不限于电子仓单持有人电子仓单对应的标的货物是否充足、电子仓单受让人是否有权利接受转让的电子仓单等）。确认前述信息均符合仓储方要求后，如电子仓单持有人将自身持有的电子仓单对应的全部标的货物转让给电子仓单受让人的，仓储方应在数链平台注销原有电子仓单，就转让的标的货物为电子仓单受让人重新开立电子仓单；如电子仓单持有人将自身持有的电子仓单对应的部分标的货物转让给电子仓单受让人的，仓储方应在数链平台注销原有电子仓单，就转让的标的货物为电子仓单受让人开立电子仓单、就未转让的标的货物为电子仓单持有人开立电子仓单。</p>
      <p class="indent mb8">4.5 发生如下任一情形时，电子仓单转让失败：</p>
      <p class="indent mb8">（1）在仓储方在新开立的电子仓单上加盖公章前任何时点，乙方单方撤回电子仓单转让申请的（具体以线上操作流程为准）；</p>
      <p class="indent mb8">（2）数链平台退回电子仓单转让申请的；</p>
      <p class="indent mb8">（3）电子仓单受让人拒绝受让电子仓单的（具体表现为电子仓单受让人拒绝确认电子仓单受让相关信息或在平台相关文件上盖章）；</p>
      <p class="indent mb8">（4）仓储方审核未通过的（具体表现为仓储方拒绝注销原有电子仓单或拒绝开立新电子仓单的）。</p>
      <p class="indent mb8">4.6 在电子仓单转让成功后，电子仓单持有人的原有电子仓单自仓储方注销时无效，新的电子仓单自仓储方盖章时对新电子仓单持有人及仓储方发生效力。</p>
      <p class="indent mb8"><strong><strong>4.7 甲乙双方确认，如因法律规定，导致数链平台上电子仓单的流转未能发生预期的法律效力，则数链平台不承担任何责任。</strong></strong></p>
      <p><strong><strong>五、电子仓单的注销</strong></strong></p>
      <p  class="indent mb8">在乙方作为电子仓单持有人，需要提取电子仓单对应的标的货物（包括但不限于乙方直接提货或乙方指定的其他第三方提货）时，乙方需要遵守如下条款</p>
      <p  class="indent mb8">5.1 乙方通过数链平台进入&ldquo;电子仓单管理&rdquo;项下&ldquo;仓单提货&rdquo;页面，根据平台的要求和规定并确定转让标的货物的质数量发起电子仓单提货申请。数链平台有权对于电子仓单提货申请进行审核。</p>
      <p  class="indent mb8">5.2 在乙方确认提货的标的货物质数量及提货人后，需要在数链平台确认提取标的货物的质数量、提取标的货物对应的电子仓单编号以及提货人、提货方式和提货时间等相关信息。乙方确认前述信息无误后，在平台相关文件上盖章确认，并将前述提货申请发给仓储方。</p>
      <p  class="indent mb8">5.3 在仓储方收到乙方提起的提货申请后，需要在数链平台确认提货申请具体内容的真实性（包括但不限于对应电子仓单的效力、对应标的货物的质数量情况等）。如仓储方认为该提货申请符合仓储方要求，仓储方应在数链平台审核通过本次提货申请并在平台相关文件上盖章。</p>
      <p  class="indent mb8">5.4 在仓储方确认提货申请无误且在平台相关文件上盖章后，仓储方应协助乙方或乙方指定的第三方完成电子仓单对应现实货物的提取。在提取的标的货物出库时，如乙方提取电子仓单对应的全部现实货物的，则仓储方应及时完成原有电子仓单的注销；如乙方提取电子仓单对应的部分现实货物的，则仓储方应及时完成原有电子仓单的注销，并就剩余标的货物为乙方开立新的电子仓单。</p>
      <p  class="indent mb8">5.5 无论何种情况，如乙方或乙方指定第三方已经现实提取电子仓单对应的现实标的货物，则原有电子仓单自乙方或乙方指定第三方提取标的货物时无效。乙方应及时要求仓储方在平台上注销原有电子仓单并就剩余标的货物开立新的电子仓单（如有）。</p>
      <p  class="indent mb8"><strong><strong>5.6 甲乙双方确认，如乙方现实并未提取标的货物且线上注销了相应的电子仓单或乙方现实提取了标的货物且线上并未注销相应的电子仓单，甲乙双方或甲乙方和任何第三方发生的任何纠纷，均和数链平台无关。数链平台无义务且无能力保证线上流程和线下实际货物的流转完全保持一致。</strong></strong></p>
      <p  class="indent mb8">5.7 需要特殊说明的是：在电子仓单流转的过程中，存在仓储方将原有电子仓单注销的情况，在此种情况下，需要仓储方自行判断是否同意电子仓单注销等事项。</p>
      <p><strong><strong>六、电子仓单的融资</strong></strong></p>
      <p  class="indent mb8">6.1 数链平台提供电子仓单融资的线上服务，在满足金融机构要求的情况下，乙方可根据持有的电子仓单申请融资服务。具体融资服务的提供及内容以金融机构的要求及实际资金发放情况为准。</p>
      <p  class="indent mb8">6.2 甲乙双方确认，数链平台并不对电子仓单融资的实际结果作出任何承诺及保证。</p>
      <p><strong><strong>七、甲方承诺</strong></strong></p>
      <p  class="indent mb8">7.1 甲方承诺，甲方为合法成立并有效存续的主体，已为签署本协议履行了必要的批准、核准或备案手续，并能够履行其在本协议项下的义务。</p>
      <p  class="indent mb8">7.2 甲方承诺，甲方对于仓储地有合法的所有权/租赁权，并有权提供仓储管理服务。如甲方已经丧失（或预期丧失）仓储地的所有权/租赁权，则甲方应当和乙方及数链平台沟通，并及时完成乙方电子仓单的注销等，避免因甲方所有权/租赁权的灭失而导致乙方权利遭受损害。</p>
      <p  class="indent mb8">7.3 甲方向数链平台提交的所有资料与信息均合法、真实、准确、完整和有效，因资料与信息不合法、不真实、不准确、不完整、无效或其他原因给数链平台、乙方或其他第三方造成的损失，由甲方承担全部赔偿责任。</p>
      <p  class="indent mb8">7.4 甲方确认并承诺，如无特殊情况，在仓储地内仍存在开立电子仓单的标的货物的情况下，甲方不转移仓储地的所有权及租赁权。如因法院强制执行或破产清算等导致甲方失去了仓储地的所有权及租赁权，甲方应当协调仓储地后续权利方和乙方完成仓储地内货物的处理及电子仓单的注销事宜。</p>
      <p  class="indent mb8">7.5 甲方确认并承诺，如甲方在数链平台开立电子仓单，甲方不会通过除数链平台外的任何平台就开立电子仓单的标的货物申请任何权利（包括但不限于在其他平台开立仓单或电子仓单、申请担保货权或开立其他债权凭证等）。</p>
      <p><strong><strong>八、乙方承诺</strong></strong></p>
      <p  class="indent mb8">8.1 乙方承诺，乙方为合法成立并有效存续的主体，已为签署本协议履行了必要的批准、核准或备案手续，并能够履行其在本协议项下的义务。</p>
      <p  class="indent mb8">8.2 乙方承诺，乙方作为电子仓单开立人时，对于电子仓单对应的现实标的货物存在合法有效、无瑕疵的所有权，且该现实标的货物不存在任何抵押权等物权上权利、也不为法院强制执行、破产清算的对象。乙方作为电子仓单持有人时，对于电子仓单对应的现实货物不得在任何其他平台、交易所开立任何电子仓单、仓单等其他物权或债权凭证。</p>
      <p  class="indent mb8">8.3 乙方承诺，乙方作为电子仓单持有人时，未经各方书面同意，不得在电子仓单对应的现实货物上设立任何抵押权等物权上权利。</p>
      <p><strong><strong>九、违约责任</strong></strong></p>
      <p class="indent mb8">9.1 本协议任何一方未能遵守协议约定，该违约行为给守约方造成损失的，违约方应当赔偿守约方的全部损失并承担相应违约责任。</p>
      <p class="indent mb8">9.2 甲乙双方应按照原合同约定，由乙方向甲方按时足额支付仓储费用，甲方按照原合同约定向乙方提供仓储地及仓储管理服务。如甲方或乙方违反原合同约定，导致电子仓单内容和实际情况不符，以至于相对方、数链平台及其他第三方遭受损失的，违约方就遭受损害一方遭受的全部损失承担赔偿责任。</p>
      <p class="indent mb8"><strong><strong>9.3 甲乙双方一致认可，{{ systemConfig.name }}作为交易平台，仅提供电子仓单的开立、流转、注销及融资等线上化服务，并未实质介入相关流程，数链平台不负有任何义务，也不会承担任何赔偿等责任。</strong></strong></p>
      <p><strong><strong>十、法律适用和争议解决</strong></strong></p>
      <p class="indent mb8">10.1 本协议的订立、生效、履行、解释及争议的解决均应适用中华人民共和国法律并根据中华人民共和国法律解释。</p>
      <p class="indent mb8">10.2 因履行本协议产生的或与本协议有关的一切争议，双方应首先通过友好协商解决；如协商不能解决的，任何一方均应向原告所在地具有管辖权的人民法院提起诉讼。</p>
      <p><strong><strong>十一、其他</strong></strong></p>
      <p class="indent mb8">11.1 本协议附件为本协议不可分割的组成部分，与本协议具有同等法律效力。</p>
      <p class="indent mb8">11.2 甲乙双方均已确认和承诺已经认真阅读、知晓、理解并接受本协议的全部条款和条件。</p>
      <p class="indent mb8">11.3 本协议自甲乙双方通过电子签名方式签署后生效。</p>
      <p>（以下无正文）</p>
      <p>&nbsp;</p>
      <p>&nbsp;</p>
      <div style="margin-top: 100px;">
        <div>
          <p ><strong>甲方（签章）：{{storageCompanyInfo.storageCompanyName}}</strong></p>
          <p  style="margin-top:20px"><strong><strong>法定代表人/授权代表：{{legalPersonName}}</strong></strong></p>
        </div>
        <div  style="margin-top: 100px;">
            <p><strong><strong>乙方（签章）：{{companyInfo.name}}<span></span></strong></strong></p>
            <p  style="margin-top:20px"><strong>法定代表人/授权代表：{{companyInfo.legalPersonName}}</strong></p>
        </div>
      </div>
       <p  style="margin-top:100px;margin-bottom:20px">附件一：电子仓单模板</p>
      <div class="modalContent">
     
      <p class="title">电子仓单</p>
      <div class="modalContent-top">
        <p class="dis dis-1" ><span class="c8">编号：</span><span th:text="${warehouseReceiptNo}"></span></p>
        <p class="dis  dis-2"><span class="c8">仓单填发人：<span th:text="${warehouseCompanyName}"></span></span><span></span></p>
        <p class="dis  dis-3"><span class="c8">填发地址：<span th:text="${stationNameArea}"></span></span><span></span></p>
      </div>
      <table cellspacing="0" cellpadding="0" class="modalTable"  >
        <tr>
          <td colspan="1" class="c8 w120">存储人</td>
          <td colspan="10" class="left">
            <table cellspacing="0" cellpadding="0" class="modalTable3" >
              <tr class="border-bottom">
                <td  class="c8 w120 border-right border-bottom ">企业名称</td>
                <td class="border-bottom break-all">
                  <span class="break-all" th:text="${bailorCompanyName}"></span>
                </td>
              </tr>
              <tr>
                <td class="c8 w120 border-right border-bottom">统一社会信用代码</td>
                <td class="border-bottom break-all  ">
                  <span class="break-all" th:text="${bailorCompanyUscc}"></span>
                </td>
              </tr>
              <tr>
                <td class="c8 w120 border-right">联系人及联系地址</td>
                <td >
                  <span class="break-all" th:text="${bailorCompanyLinkman}"></span>
                  <span class="break-all" th:text="${bailorCompanyLinkmanAddress}"></span>
                </td>
              </tr>
            </table>
          </td>
          <td colspan="1"  class="c8 w120" >保管人</td>
          <td colspan="9" class="left">
            <table cellspacing="0" cellpadding="0" class="modalTable3" >
              <tr class="border-bottom">
                <td  class="c8 w120 border-right border-bottom ">企业名称</td>
                <td class="border-bottom break-all">
                  <span class="break-all" th:text="${warehouseCompanyName}"></span>
                </td>
              </tr>
              <tr>
                <td class="c8 w120 border-right border-bottom">统一社会信用代码</td>
                <td class="border-bottom ">
                  <span th:text="${warehouseCompanyUscc}"></span>
                </td>
              </tr>
              <tr>
                <td class="c8 w120 border-right">联系人及联系地址</td>
                <td >
                  <span th:text="${warehouseCompanyLinkman}"></span>
                  <span class="break-all" th:text="${warehouseCompanyLinkmanAddress}"></span>
                </td>
              </tr>
            </table>
          </td>
        </tr>
        <tr>
          <td colspan="1"  class="c8 w120">存货信息</td>
          <td colspan="10" class="left">
            <table cellspacing="0" cellpadding="0" class="modalTable3" >
              <tr class="border-bottom">
                <td  class="c8 w120 border-right border-bottom ">品名</td>
                <td class="border-bottom break-all">
                  <span class="break-all" th:text="${goodsName}"></span>
                </td>
              </tr>
              <tr>
                <td class="c8 w120 border-right">质量指标</td>
                <td >
                  <div  th:each="item,itemStat:${productIndicatorList}">
                    <p  style="display: inline;" th:text="${item.indicatorName}"></p>：<span  style="display: inline;" th:text="${item.showValue}"></span>
                  </div>
                </td>
              </tr>
            </table>
          </td>
          <td colspan="1" class="c8 w120">数量(吨)</td>
          <td colspan="9" class="left"><span th:text="${quantity}"></span></td>
        </tr>
        <tr>
          <td colspan="1"  class="c8 w120" >存货仓储信息</td>
          <td colspan="20" class="left">
            <div class="table-2">
              <table cellspacing="0" cellpadding="0" class="modalTable3" >
                <tr class="border-bottom">
                  <td  class="c8 w120 border-right border-bottom ">储存仓库名称</td>
                  <td class="border-bottom break-all">
                    <span class="break-all" th:text="${stationName}"></span>
                  </td>
                </tr>
                <tr>
                  <td class="c8 w120 border-right border-bottom">储存地址</td>
                  <td class="border-bottom break-all ">
                    <span class="break-all" th:text="${stationNameAddress}"></span>
                  </td>
                </tr>
              </table>
              <table cellspacing="0" cellpadding="0" style="width: 100%" class="modalTable modalTable2">
                <tr>
                  <td colspan="10"  class="left  border-right"  style="border-left: 0;padding: 0;height: 28px;">
                    <table cellspacing="0" cellpadding="0" class="modalTable3" >
                      <tr class="">
                        <td  class="c8 w120 border-right " style="border-bottom:0">仓储合同编号</td>
                        <td class="break-all">
                          <span class="break-all" th:text="${bizContractNo}"></span>
                        </td>
                      </tr>
                    </table>
                  </td>
                  <td colspan="1" style="width: 120px;height: 28px;padding: 0;">储存期限</td>
                  <td colspan="9" class="tal" style="border-right: 0;height: 28px;padding: 0"><span th:text="${storageTime}"></span></td>
                </tr>
              </table>
              <table cellspacing="0" cellpadding="0" class="modalTable3" >
                <tr class="">
                  <td  class="c8 w120 border-right">仓储费</td>
                  <td class="break-all">
                    <span class="break-all" th:text="${storageFees}"></span>
                  </td>
                </tr>
              </table>
            </div>
          </td>
        </tr>
        <tr >
          <td colspan="21"  class="c8" >如货物已办理保险，补充以下信息</td>
        </tr>
        <tr>
          <td colspan="1"  class="c8" style="width: 95px;">保险单</td>
          <td colspan="20" class="left">
            <div class="table-2">
              <table cellspacing="0" cellpadding="0" style="width: 100%" class="modalTable modalTable2">
                <tr>
                  <td colspan="10"  class="left"  style="border-left: 0;padding: 0;height: 28px;">
                    <table cellspacing="0" cellpadding="0" class="modalTable3" >
                      <tr class="">
                        <td  class="c8 w120 border-right">保险单号</td>
                        <td class="break-all">
                          <span class="break-all" th:text="${policyNo}"></span>
                        </td>
                      </tr>
                    </table>
                  </td>
                  <td colspan="1" style="width: 120px;height: 28px;padding: 0">保险金额（元）</td>
                  <td colspan="9" class="tal" style="border-right: 0;height: 28px;padding: 0"><span th:text="${insuranceAmount}"></span></td>
                </tr>
              </table>
              <table cellspacing="0" cellpadding="0" style="width: 100%" class="modalTable modalTable2">
                <tr>
                  <td colspan="10"  class="left"  style="border-left: 0;padding: 0;height: 28px;">
                    <table cellspacing="0" cellpadding="0" class="modalTable3" >
                      <tr class="">
                        <td  class="c8 w120 border-right">保险人</td>
                        <td class="break-all">
                          <span class="break-all"  th:text="${policyHolder}"></span>
                        </td>
                      </tr>
                    </table>
                  </td>
                  <td colspan="1" style="width: 120px;height: 28px;padding: 0">险种</td>
                  <td colspan="9" class="tal" style="border-right: 0;height: 28px;padding: 0"><span th:text="${insuranceType}"></span></td>
                </tr>
              </table>
              <table cellspacing="0" cellpadding="0" class="modalTable3" >
                <tr class="">
                  <td  class="c8 w120 border-right">保险期间</td>
                  <td class="break-all">
                    <span class="break-all" th:text="${insurancePeriod}"></span>
                  </td>
                </tr>
              </table>
            </div>
          </td>

        </tr>
        <tr >
          <td colspan="21"  class="c8 tal" >
            <div style="line-height: 40px; " class="fw break-all">
              1. 存货人承诺储存地址内的存货真实存在且与本电子仓单记载信息相符。保管人对于存货进行保管，本电子仓单是唯一提货凭证，不再另行开具纸质凭证，其他任何单据不得作为提货凭证。
            </div>
            <div style="line-height: 40px;" class="fw break-all">
              2. 本电子仓单自保管人加盖电子印章后生效。
            </div>
            <div style="line-height: 40px;" class="fw break-all">
              3. 存货人或仓单持有人在本电子仓单上背书并经保管人加盖电子印章的，可以转让本电子仓单。
            </div>

          </td>
        </tr>
        <!-- <tr >
          <td colspan="10"  class="c8 tal" >
            保管人签章：
          </td>
            <td colspan="11"  class="c8 tal" >

          </td>
      
        </tr>
             <tr >
          <td colspan="10"  class="c8 tal" >
            生效日期：
          </td>
            <td colspan="11"  class="c8 tal" >

          </td>
      
        </tr> -->
      </table>
      <p style="text-align: right;">保管人签章：<span th:text="${warehouseCompanyName}"></span></p>
      <p style="text-align: right;margin-top:50px">生效日期：<span th:text="${createDate}"></span></p>
    </div>
    </div>

  </div>

</template>

<script>
import moment from 'moment'
import { API_GET_COMPANYINFO_BY_USCC } from '@/v2/api/common';
import systemConfig from '@/v2/config/common';

export default {
	data() {
		return {
      // 法人
      legalPersonName: '',
      systemConfig
    };
	},
  computed: {
    agreeManageInfo() {
      return this.$store.state.logisticsPlatform.agreeManageInfo
    },
    signArea() {
			return this.$store.state.logisticsPlatform.agreeManageInfo.signArea;
		},
    effectiveStartDate() {
      return this.$store.state.logisticsPlatform.agreeManageInfo.effectiveStartDate;
    },
    // 仓储企业
    storageCompanyInfo() {
      return this.$store.state.logisticsPlatform.storageCompanyInfo;
    },
    // 当前企业
    companyInfo() {
     return this.$store.state.user.VUEX_ST_COMPANYSUER.company ;
    },
    // 仓储地址
    storageCompanyAddress() {
      return this.$store.state.logisticsPlatform.agreeManageInfo.storageCompanyAddress;
    },
    // 仓储合同号
    stationLeaseContractNo() {
      return this.$store.state.logisticsPlatform.agreeManageInfo.stationLeaseContractNo;
    },

  },
  watch: {
    // 地址
		signArea(info) {
			this.goScroll('signArea', 120);
		},
    // 日期
    effectiveStartDate(info) {
			this.goScroll('signArea', 120);
		},
    // 地址
    storageCompanyAddress() {
      this.goScroll('storageCompanyAddress', 120);
    },
    // 合同号
    stationLeaseContractNo() {
      this.goScroll('stationLeaseContractNo', 120);
    },
    storageCompanyInfo(info) {
      this.getPerson(info.storageCompanyUscc)
      
    },

	},
  mounted() {
    this.getPerson()
  },
	methods: {
    // 获取法人
    async getPerson(uscc) {
      if(!this.storageCompanyInfo.storageCompanyUscc && !uscc) {return}
      const params = {
        uscc: this.storageCompanyInfo.storageCompanyUscc
      }
      const res = await API_GET_COMPANYINFO_BY_USCC(params)
      let info = res.data || {}
      this.legalPersonName = info.legalPersonName
      console.log( this.legalPersonName, ' this.legalPersonName----')

    },
    /** 滚动到位置 */
		goScroll(key, num) {
			const child = document.querySelector(`.${key}`);
			const supple = document.querySelector('.agree');
			supple.scrollTo({
				top: child.offsetTop - num, //
				behavior: 'smooth'
			});
		}
  },
	components: {}
};
</script>

<style scoped  lang='less' >
  .agree {
    padding: 10px;
    height: 160px;
    overflow: auto;
  }
  .df {
    display: flex;
    justify-content: space-between;
  }
  .f1 {
    flex: 1;
  }
  .tac {
    text-align: center;
  }
  .tc {
    text-align: center;
  }
  .tl {
    text-align: left;
  }
  .tr {
    text-align: right;
  }
  .mb8 {
    margin-bottom: 8px;
  }
  .indent {
    /*text-indent: 50px;*/
    text-indent: 2em;
  }
    .tac {
      text-align: center;
    }
    .tal {
      text-align:left;
    }
    .modalContent {
      color:#383A3F;
      border-top: 1px solid #000000;
      /* border: 1px solid rgba(0,0,0,0.8); */
      /* padding: 30px; */
      /* padding-top: 20px; */
    }
    .modalContent > div {
      /* display: flex; */
      /* flex-direction: row;
      justify-content: space-between; */
      /* margin-bottom: 5px; */
    }
    .modalContent > p {
      text-align: center;
      font-size: 18px;
      /* color:#0053DB; */
    }
    .modalContent .title {
      color: #000;
      font-weight: 500;
      padding-top: 20px;
      padding-bottom: 20px;
      border-left: 1px solid #000000;
      border-right: 1px solid #000000;
    }
    .modalContent-top {
      border-top: 1px solid #000;
      /* padding: 0 10px; */
      padding-top: 20px;
      padding-bottom: 20px;
      border-left: 1px solid #000000;
      border-right: 1px solid #000000;
      color: #000;
      display: flex;
    }
    .modalTable{
      width:100%;
      height:100%;
      /* border: 1px solid rgba(0,0,0,0.8); */
      text-align:center;/*文本居中*/
      border-collapse: collapse;/*边框重叠，否则你会看到双实线*/
      table-layout:fixed;
      border-left: 0;
      border-right: 0;
    }
    .modalTable th,td {
      height: 32px;
      border:1px solid black;
      color: #000000;
      padding: 10px 6px;
    }
    .modalTable .left {
      text-align: left;
      padding: 0;
    }
    .modalTable .left p {
      color: rgba(0,0,0,0.8);
    }
    .modalTable .left p  span {
      display: inline-block;
      vertical-align: middle;
      /* width: 110px; */
    }
    .table-1  {
      display: flex;
      justify-content: space-between;
      flex-direction: column;
    }
    .table-1 .table-1-div {
      height: auto;
      /* display: flex; */
      /* justify-content:space-between; */
      border-bottom: 1px solid #000000;
      position: relative;
      /* align-items: center; */
    }
    .table-2 .table-2-div {
      height: auto;
      /* display: flex; */
      /* justify-content:space-between; */
      border-bottom: 1px solid #000000;
      position: relative;
      /* align-items: center; */


    }
    .table-2-div-div {
      /* display: flex; */
      flex: 1;
    }
    .w300 {
      width: 150px;
      flex-shrink: 0;
      display: inline-block;
      /* position: absolute; */
      top: 0;
      left: 0;
    }
    .wfl1 {
      /* width: calc(100% - 150px); */
      display: inline-block;
      /* position: absolute; */
      top: 0;
      /* left: 150px; */
    }
    .modalTable2 tr {
      border: 0;
      /* border-left: 0; */
    }
    .modalTable2 tr td {
      border-top: 0;
      /* border-bottom: 0; */

    }
    .w120 {
      width: 120px;
      box-sizing: border-box;
    }
    .fw {
      font-weight: 600;
    }
    .dis {
      display: inline-block;
      /* text-align: center; */
    }
    .dis-1 {
      display: inline-block;
      /* text-align: left; */
      min-width: 30%;
    }
    .dis-2 {
      display: inline-block;
      /* text-align: center; */
      min-width: 30%;
    }
    .dis-3 {
      display: inline-block;
      /* text-align: right; */
      min-width: 40%;
    }
    .disline {
      display: inline-block;

    }
    .modalTable3  {
      border: none;
      width: 100%;
      height: 100%;
      table-layout:fixed;
    }
    .modalTable3 tr {
      border: none;
    }

    .modalTable3 td {
      border: none;
    }
    .border-right {
      border-right: 1px solid #000 !important;
    }
    .modalTable3 .border-bottom {
      border-bottom: 1px solid #000 !important;
    }
    .break-all {
      word-break: break-all;
    }
    .table {
      width: 100%;
      height: 100%;
      border: 1px solid #000000;
      border-left: 0;
      border-right: 0;
      border-collapse: collapse;
      table-layout: fixed;
      margin: 8px 0;
    }
    .table th,
    .table td {
      border: 1px solid black;
      /*padding: 3px 6px;*/
      padding: 10px 6px;
    }
</style>
