<template>
	<div style="height: 100%">
		<!--    头部-->
		<Header class="white"></Header>
		<div id="case">
			<!--    内容-->
			<div id="container">
				<div class="banner"></div>
				<div class="tabs">
					<a-tabs
						v-model="activeTab"
						@change="changeTab"
					>
						<a-tab-pane
							key="1"
							tab="金融机构"
						>
							<div class="tab-1">
								<div class="nav">
									<div class="title">
										标杆案例
										<a-icon
											type="down"
											style="margin-left: 20px"
										/>
									</div>
									<ul>
										<li @click="changeCompany('nx')">宁夏银行</li>
										<li @click="changeCompany('yc')">华能云成保理</li>
									</ul>
								</div>
								<div class="detail">
									<!--                宁夏银行-->
									<template v-if="activeCompany === 'nx'">
										<div class="title">“宁夏银行”标杆案例</div>
										<p class="desc">金融科技、供应链金融、数字供应链解决方案</p>
										<!-- <video
											src="https://shdatalink.oss-cn-zhangjiakou.aliyuncs.com/video/%E5%AE%81%E5%A4%8F%E9%93%B6%E8%A1%8C.mp4"
											controls="controls"
											muted
											autoplay
											loop
											preload="auto"
											style="width: 100%"
											v-if="!isMobile"
										></video> -->
										<img
											src="../../../assets/imgs/home/nxyh_video_poster.png"
											alt=""
											style="width: 100%"
										/>
										<ul class="type">
											<li
												:class="activeType == 1 ? 'active' : ''"
												@click="changeType(1)"
											>
												项目背景
											</li>
											<li
												:class="activeType == 2 ? 'active' : ''"
												@click="changeType(2)"
											>
												行业痛点
											</li>
											<li
												:class="activeType == 3 ? 'active' : ''"
												@click="changeType(3)"
											>
												解决方案
											</li>
											<li
												:class="activeType == 4 ? 'active' : ''"
												@click="changeType(4)"
											>
												客户价值
											</li>
										</ul>
										<div>
											<template v-if="activeType == 1">
												<p class="text">
													宁夏银行2007年12月28日，经中国银行业监督委员会批准，银川市商业银行股份有限公司正式更名为宁夏银行股份有限公司并挂牌，简称宁夏银行。
												</p>
												<p class="text">
													其前身银川市商业银行股份有限公司成立于1998年10月28日，是宁夏唯一一家股份制商业银行，由自治区和银川市两级财政控股，国有股份、中资法人股份及众多个人股份共同组成。宁夏第一家“宁”字号地方商业银行的诞生，标志着宁夏地方金融改革发展步入崭新的历史阶段。
												</p>
											</template>
											<template v-if="activeType == 2">
												<p class="text">
													地方性商业银行由于服务更灵活、决策更高效，在服务地区经济、开展普惠业务、扶持中小企业方面发挥了举足轻重的作用。宁夏银行作为西部地区第一家以省级行政区命名的地方性商业银行、宁夏地区系统性重要银行，不断在帮扶中小企业纾困解难上寻找新的金融服务突破口。
												</p>
											</template>
											<template v-if="activeType == 3">
												<p class="text">
													11月中旬，中国银保监会召开专题会议，研究部署银行业保险业深化供应链融资改革工作时指出，“鼓励银行机构围绕实体经济需求提供精准金融服务”。
													为竭力解决中小企业融资难、融资贵等问题，宁夏银行积极对接实体经济需求，倾心探索创新供应链金融的模式和技术，实现了“金融活水”精准滴灌每一家有实际需求的实体企业。
												</p>
												<p class="text">
													为解决在贷款审批过程中验证交易真实性的问题，宁东能链与数链科技合作，依托物联网、大数据、区块链等技术打破原有的信息壁垒，使交易过程变得规范且透明。
												</p>
												<p class="text">
													在数链科技研发的数字供应链管理平台上，宁东能链利用电子签章、可视化物流、电子发货、电子结算等数字化功能，实现了煤炭从坑口采购到运输至电厂的全路径可视化、透明化；交易信息以及对应的原始凭证实时上传至云监管平台，做到了从入库、质检、称重到结算的数据收集和信息同步；利用区块链技术的加密算法，保障交易的真实性、流程的规范性、货物的安全性，以此建立起交易流程“数据信用”和交易标的“物的信用”；权属企业及合作银行可以随时调取查看平台上的实时监控和交易数据，这不仅降低了银行审批的难度，也给银行资金上了一层“保险”，有效规避了金融风险。
												</p>
												<p class="text">
													以往的传统模式，银行主要依靠产业链核心企业的担保机制，向产业链上下游中小企业提供供应链金融贷款，但此举经常面临中小企业覆盖面不够大，且信贷额度无法满足企业实际经营需求等痛点。如今，数字供应链管理平台的介入，让银行可以通过多重验真，掌握更多中小企业真实的业务往来。不仅对于宁东能链这样的核心企业来说，可以将“主体信用”渗透至更多上下游企业。有了金融科技的加持，银行也能够在降低风控成本的同时，使资金直达以往无法覆盖的资产，为进一步延伸金融服务的触角夯实基础，起到一箭双雕的效果。
												</p>
											</template>
											<template v-if="activeType == 4">
												<p class="text">
													坚持特色化经营和差异化服务是城商行发展的基本路线，“服务地方经济，服务中小企业，服务城乡居民”的市场定位。宁夏银行积极创新多样化金融服务，通过引入第三方金融科技平台，将产业链上下游中小企业资金周转状况、贸易合同履约状况、贸易场景等因素纳入供应链贷款评估范畴，大幅拓宽了供应链金融服务覆盖面，让更多产业链中小企业享受到了低息、便捷的金融服务，有效缓解了链上中小微企业融资难题。
												</p>
												<p class="text">
													政策引导下，宁夏银行正积极探索供应链金融的数字化解决方案，为拓宽中小企业融资渠道创造更大空间。作为西部地区第一家以省级行政区命名的地方性商业银行，宁夏银行被中国人民银行评为宁夏地区系统性重要银行，为地方经济发展做出突出贡献，其在供应链金融领域的探索对于拓展金融工具创新具有重要的启迪作用。
												</p>
											</template>
										</div>
									</template>
									<!--                弄开供应链-->
									<template v-if="activeCompany === 'yc'">
										<div class="title">“华能云成保理”标杆案例</div>
										<p class="desc">开辟融资“绿色通道”、拓宽业务场景、金融服务多样化</p>
										<!-- <video
											controls="controls"
											src="https://shdatalink.oss-cn-zhangjiakou.aliyuncs.com/video/%E4%BA%91%E6%88%90%E4%BF%9D%E7%90%86.mp4"
											autoplay
											muted
											loop
											preload="auto"
											style="width: 100%"
											v-if="!isMobile"
										></video> -->
										<img
											src="../../../assets/imgs/home/hnycbl_video_poster.png"
											alt=""
											style="width: 100%"
										/>
										<ul class="type">
											<li
												:class="activeType == 1 ? 'active' : ''"
												@click="changeType(1)"
											>
												项目背景
											</li>
											<li
												:class="activeType == 2 ? 'active' : ''"
												@click="changeType(2)"
											>
												行业痛点
											</li>
											<li
												:class="activeType == 3 ? 'active' : ''"
												@click="changeType(3)"
											>
												解决方案
											</li>
											<li
												:class="activeType == 4 ? 'active' : ''"
												@click="changeType(4)"
											>
												客户价值
											</li>
										</ul>
										<div>
											<template v-if="activeType == 1">
												<p class="text">
													传统意义上，保理公司提供的的保理服务是一项集贸易融资、商业资信调查、应收账款管理及信用风险承担于一体的综合性金融服务，流程多、风控难、成本高。近年来，随着我国保理业务稳步发展，规模逐步提升，传统的业务模式已不能满足新的发展要求。
												</p>
												<p class="text">
													华能云成商业保理（天津）有限公司（以下简称“云成保理”）在深化“产融结合、融融合作”、加速央企“金融科技赋能供应链金融”领域不断开展创新实践，主动出击、寻求合作，不断探索、挖掘产融结合在更广泛大宗商品应用场景下的发展潜力。
												</p>
											</template>
											<template v-if="activeType == 2">
												<p class="text">
													大宗商品行业作为百万亿级的蓝海，潜在融资需求巨大。但行业准入门槛较高，需要具备丰富的产业实践经验、深刻的产业洞察力，才能摸索出即符合产业发展需要，又符合金融服务标准的数字供应链金融解决方案。保理公司等金融机构由于缺乏行业相关经验，货物把控能力不足、缺乏监管机制，对于深入开展大宗商品业务场景望而却步。
												</p>
												<p class="text">
													大宗商品行业交易环节多、透明度低，各个环节之间容易形成信息孤岛；金融机构很难清晰的监管到交易的每个节点，交易环节的不透明也导致了大宗商品融资难的行业现象。
												</p>
											</template>
											<template v-if="activeType == 3">
												<p class="text">
													云成保理于2018年7月组建，是中国华能集团旗下专业保理公司。云成保理深耕中国华能电力产业供应链，对接中国华能物资采购、燃料采购电商平台，专注为中国华能电煤采购、物资采购提供专业化、个性化、高效率的融资服务。
												</p>
												<p class="text">
													随着供应链金融领域科技应用的持续深入，金融科技成为保理行业创新发展的引擎，为云成保理这类行业先行者在风控合规领域赋能，提升工作效能。云成保理在科技应用方面一直走在行业前列，依托其母公司云成金服研发的“云链通”平台，云成保理可以快速响应企业融资需求、线上完成业务操作。数链科技作为大宗商品行业领先的数字供应链平台，已与“云链通”完成系统对接、实现平台互联互通。企业仅需在数链科技平台上完成注册、发起融资需求，经过双方平台审核通过后，即可获得云成保理提供的融资服务，有效提升业务操作便利性和工作效率。依托平台之间构建的信息共享、科技互信，为企业融资开辟了便捷、高效的“绿色通道”。
												</p>
												<p class="text">
													科技应用为供应链金融业务提供关键支撑，数链科技深入产业的独特优势为业务场景的扩展带来了更多可能。作为一个既懂大宗、又懂金融的科技公司，数链科技凭借多年累积的产业资源优势，与陕煤供应链、平煤供应链、宁东能源化工供应链等多家区域内的龙头企业建立良好的合作关系，形成独特的“做市商”制度，并依靠龙头企业的辐射带动作用，迅速打开区域市场，形成产业生态圈。
												</p>
												<p class="text">
													产业作为基础、科技作为利器，数链科技通过区块链、大数据等新一代信息技术整合大宗商品行业的资金流、物流、商流和信息流，并将整合后的信息推送至“云链通”平台，协助云成保理获得更多可信赖的优质产业客户。
												</p>
												<p class="text">
													从金融视角出发，对产业链信用体系进行重构，为链属企业切实增信。数链科技研发的数字供应链平台深入贯穿大宗商品交易全流程，通过场景化全链交易、智能化资产整理、一体化风险管理、多维度安全验证，提升整个大宗商品供应链全流程的透明度、规范化和真实性，为企业构建可信的数字资产。从上游采购、港口仓储、货物运输到终端销售，数链科技针对企业在各个环节的融资需求，与云成保理携手，针对不同的业务场景拓展多样化的金融服务。
												</p>
												<p class="text">
													以煤炭贸易为例，数链科技与云成保理合作，凭借核心企业对货物严格把控和全流程智能化实时监控，形成“数据信用”“物的信用”与“主体信用”相结合的信用体系，并在此基础上针对上游煤炭采购场景开展仓单质押保理业务，针对下游煤炭销售场景开展应收账款保理业务，使金融服务覆盖煤炭贸易全链条。
												</p>
												<p class="text">
													数链科技为云成保理提供丰富多样的金融服务，港口仓单质押业务是其中的代表。基于自身的大宗产业背景、先进的数字供应链理念以及平台上核心企业的主体信用，数链科技为云成保理的风控保驾护航，使其能够积极介入港口场景下的仓单质押融资业务。核心企业及中小贸易商还可以通过“以货换货”、“仓押转应收”等方式，在货物流转过程中实现资金的高效配置。通过港口仓单质押融资，盘活了中小贸易商的存量资产，使贷款资金更加前置，最终实现多方共赢。
												</p>
												<p class="text">
													凭借数链科技对大宗商品贸易全链条的纵深把控，以及区块链、大数据、云计算等技术的深化应用，云成保理得以疏通与大宗商品企业之间的信息堵点，通过多位一体的信用通道，顺利开展多样化的金融服务，打破核心企业的融资瓶颈、满足中小贸易商的融资需求，为自身业务增量培育新的增长引擎。
												</p>
											</template>
											<template v-if="activeType == 4">
												<p class="text">
													数链科技为云成保理提供丰富多样的金融服务，港口仓单质押业务是其中的代表。基于自身的大宗产业背景、先进的数字供应链理念以及平台上核心企业的主体信用，数链科技为云成保理的风控保驾护航，使其能够积极介入港口场景下的仓单质押融资业务。核心企业及中小贸易商还可以通过“以货换货”、“仓押转应收”等方式，在货物流转过程中实现资金的高效配置。通过港口仓单质押融资，盘活了中小贸易商的存量资产，使贷款资金更加前置，最终实现多方共赢。
												</p>
												<p class="text">
													凭借数链科技对大宗商品贸易全链条的纵深把控，以及区块链、大数据、云计算等技术的深化应用，云成保理得以疏通与大宗商品企业之间的信息堵点，通过多位一体的信用通道，顺利开展多样化的金融服务，打破核心企业的融资瓶颈、满足中小贸易商的融资需求，为自身业务增量培育新的增长引擎。
												</p>
											</template>
										</div>
									</template>
								</div>
							</div>
						</a-tab-pane>
						<a-tab-pane
							key="2"
							tab="核心企业"
						>
							<div class="tab-2">
								<div class="nav">
									<div class="title">
										标杆案例
										<a-icon
											type="down"
											style="margin-left: 20px"
										/>
									</div>
									<ul>
										<li @click="changeCompany('sm')">陕煤供应链</li>
										<li @click="changeCompany('nk')">农开供应链</li>
									</ul>
								</div>
								<div class="detail">
									<!--                陕煤供应链-->
									<template v-if="activeCompany === 'sm'">
										<div class="title">“陕煤供应链”标杆案例</div>
										<p class="desc">
											数链科技为核心企业及其供应链生态圈提供线上化、 <br />
											可视化、数字化的解决方案
										</p>
										<!-- <video
											controls="controls"
											src="https://shdatalink.oss-cn-zhangjiakou.aliyuncs.com/video/%E9%99%95%E8%A5%BF%E9%99%95%E7%85%A4.mp4"
											muted
											autoplay
											loop
											preload="auto"
											style="width: 100%"
											v-if="!isMobile"
										></video> -->
										<img
											src="../../../assets/imgs/home/sxsm_video_poster.png"
											alt=""
											style="width: 100%"
										/>
										<ul class="type">
											<li
												:class="activeType == 1 ? 'active' : ''"
												@click="changeType(1)"
											>
												项目背景
											</li>
											<li
												:class="activeType == 2 ? 'active' : ''"
												@click="changeType(2)"
											>
												业务痛点
											</li>
											<li
												:class="activeType == 3 ? 'active' : ''"
												@click="changeType(3)"
											>
												解决方案
											</li>
											<li
												:class="activeType == 4 ? 'active' : ''"
												@click="changeType(4)"
											>
												客户价值
											</li>
										</ul>
										<div>
											<template v-if="activeType == 1">
												<p class="text">
													陕西陕煤供应链管理有限公司（以下简称“陕煤供应链”）是由陕西煤业股份有限公司控股，同瑞茂通供应链管理股份有限公司共同出资45亿元人民币，2019年注册成立的混合所有制企业。公司经营范围为煤炭、石油化工、铁矿石、有色金属等大宗商品的供应链服务。业务范围覆盖西北、华中、华东、华北等区域，并与印尼、澳大利亚、菲律宾、俄罗斯、美国等地企业开展业务往来。
												</p>
												<p class="text">
													陕煤供应链沿袭了陕煤和瑞茂通的大宗商品基因，拥有扎实的供应链网络和强大的资源优势，希望利用数字化手段，提升对供应链上下游企业在商流、物流、信息流和资金流方面的整合管理能力，促进提质增效，稳定供应链，实现链属企业的协同创新、共同发展。
												</p>
											</template>
											<template v-if="activeType == 2">
												<p
													class="text"
													style="text-indent: 0"
												>
													<span> 业务流程非标准化，缺乏信息共享和管理手段 </span> <br />
													合同、发票、货物质量、资金流转、税务等关键环节标准化、数字化程度低，信息壁垒使得流程复杂冗长、效率低下，企业缺少提高供应链管理能力的有效抓手。
												</p>
												<p
													class="text"
													style="text-indent: 0"
												>
													<span>交易环节不透明，风控依赖线下 </span>
													<br />
													大宗商品贸易链条长，各个节点各自形成信息孤岛，无法交叉验证，交易风险较大。
												</p>
												<p
													class="text"
													style="text-indent: 0"
												>
													<span> 融资存在上限，业务发展受限 </span><br />
													传统供应链业务基于传统企业授信，融资存在上限，业务规模很难突破，从而削弱企业市场竞争力。
												</p>
											</template>
											<template v-if="activeType == 3">
												<p class="text">面对挑战，数链科技基于对行业的深刻理解，为陕煤供应链打造了数字供应链服务解决方案。</p>
												<p
													class="text"
													style="text-indent: 0"
												>
													<span>搭建标准化、可视化的数字资产平台</span> <br />
													<span style="text-indent: 64px; color: #595757; font-size: 26px">
														数链科技为陕煤供应链搭建数字化平台，使合同签订、物流追踪、货转、付款、结算、付款、发票、回款等实现全流程线上化操作，全面覆盖每个关键环节，并对信息进行数字化、规范化管理，避免线下单据管理混乱的问题。系统实现对资产数据的自动化整理及核验功能，并与金融机构进行银企直联，高效安全的开展银行对接，实现资产数据的系统传输，同时支持核心企业线上确权，并通过区块链技术，所有资产数据上链，数据可溯源、真实性有保障。
													</span>
												</p>
												<p
													class="text"
													style="text-indent: 0"
												>
													<span>搭建智慧管理大屏 实时监测交易风险</span> <br />
													<span style="text-indent: 64px; color: #595757; font-size: 26px">
														基于数字资产平台及交易场景的数字整理，数链科技为陕煤供应链搭建了全场景、可视化的数据分析平台，助力其精准识别产业风险、及时预警、评估风险影响、提供应对决策等，使其高管更好的基于数据做科学决策。
													</span>
												</p>
											</template>
											<template v-if="activeType == 4">
												<p
													class="text"
													style="text-indent: 0"
												>
													<span>变现信誉优势，精益压降“两金”</span> <br />
													将核心企业强大的主体信誉优势变现，有效盘活了陕煤供应链应收账款存量，降低资产负债率。
												</p>
												<p
													class="text"
													style="text-indent: 0"
												>
													<span>强化供应链管理能力，实现“保链”“稳链”</span> <br />
													为合作中小企业解决“融资难”、“融资贵”问题，提升合作粘性，强化陕煤供应链对产业链生态圈的管理控制能力，降低断链带来的潜在风险。
												</p>
												<p
													class="text"
													style="text-indent: 0"
												>
													<span>有效整合产业链资源，掘金增量价值</span> <br />
													打通信息孤岛，共享透明、可信数据，为产业链生态圈激活赋能，为企业成长贡献业务增量。
												</p>
											</template>
										</div>
									</template>
									<!--                弄开供应链-->
									<template v-if="activeCompany === 'nk'">
										<div class="title">“农开供应链”标杆案例</div>
										<p class="desc">智慧粮仓、云监管平台、数字供应链解决方案</p>
										<!-- <video
											controls="controls"
											src="https://shdatalink.oss-cn-zhangjiakou.aliyuncs.com/video/%E5%86%9C%E5%BC%80%E4%BE%9B%E5%BA%94%E9%93%BE.mp4"
											muted
											autoplay
											loop
											preload="auto"
											style="width: 100%"
											v-if="!isMobile"
										></video> -->
										<img
											src="../../../assets/imgs/home/nkgyl_video_poster.png"
											alt=""
											style="width: 100%"
										/>
										<ul class="type">
											<li
												:class="activeType == 1 ? 'active' : ''"
												@click="changeType(1)"
											>
												项目背景
											</li>
											<li
												:class="activeType == 2 ? 'active' : ''"
												@click="changeType(2)"
											>
												业务痛点
											</li>
											<li
												:class="activeType == 3 ? 'active' : ''"
												@click="changeType(3)"
											>
												解决方案
											</li>
											<li
												:class="activeType == 4 ? 'active' : ''"
												@click="changeType(4)"
											>
												客户价值
											</li>
										</ul>
										<div>
											<template v-if="activeType == 1">
												<p class="text">
													河南农开供应链有限公司（简称“农开供应链”）2019年，河南农开旗下控股子公司下属公司与深耕供应链管理20年的上市公司瑞茂通旗下全资子公司共同出资成立农开供应链。
												</p>
												<p class="text">
													依托河南农开的国企资源，一手连政府，一手连市场，公司从战略上与股东单位齐头并进，协同推进涉农业务的发展，迅速拓宽市场渠道。
												</p>
												<p class="text">
													农开供应链平台业务以自营业务为基础，发挥农开供应链在渠道、信息、资金等方面的优势，打造农产品供应链平台，帮助行业中其他参与方扩大规模和加快周转。此外，平台业务中农开供应链不承担价格波动带来的市场风险，同时通过控制货权的方式控制交易风险，有效保障资金安全。
												</p>
											</template>
											<template v-if="activeType == 2">
												<p class="text">
													“十四五”开局之年，全面推进乡村振兴已上升为国家战略，促进农业数字化流通，推动农业农村现代化发展，解决好“三农”问题是工作的重中之重。习近平曾在视察河南时指出：“粮食生产是河南的一大优势，也是河南的一张王牌，这张王牌任何时候都不能丢”。对于“中原粮仓”河南来说，如何做好农业转型升级，已然成为一个必须破解的时代课题，也是摆在企业面前的一次重大机遇。
												</p>
											</template>
											<template v-if="activeType == 3">
												<p class="text">
													依托股东双方在区域背景和产业资源方面的优势，不断扩展业务品种，增加综合服务能力，以客户为核心，结合自身发展情况，深耕优化现有商业模式，为农开进行数字资产整理和场景数字化平台建设。
												</p>
												<p class="text">
													随着数字化改革的深入，数链科技为智慧粮仓研发了一整套线上-线下信息数据平台——智慧粮仓云监管平台。入库车辆通过“一卡通”管理，实现从入库、质检、称重到结算的数据收集和信息同步。粮食入库、出库后，品种、产地、质数量、交易等信息以及对应的原始凭证将实时上传至云监管平台，并利用区块链技术的加密算法，保障交易的真实性、流程的规范性、粮食的安全性。权属企业及合作银行可随时调取查看。通过云监管平台，不仅能对粮仓进行实时监控、为粮情管控提高效率、让粮食存储更有保障，更重要的是通过数字化供应链建设，有效解决了粮食交易整个流程的真实性、透明化和规范化问题，让仓储的粮食作为动产也能获得普惠金融的支持。
												</p>
												<p class="text">
													农开供应链凭借良好的企业资质和信用评级，充分发挥其作为核心企业的“主体信用”，加之智慧粮仓对货物严格把控形成的“物的信用”，和依托云监管平台进行数据采集形成的“数据信用”，三者合一，能够打消金融机构的疑虑，为上下游企业增信，降低中小企业的融资门槛，大大缓解了收储企业的资金压力。
												</p>
												<p class="text">
													同时，智慧粮仓云监管平台还帮助核心企业打破了融资瓶颈，让农开供应链在原有信用评级的基础上获得了更多资金支持，在与中原银行的合作中获得5000万元授信额度，用于支持上下游涉农企业的融资需求。2021年，农开供应链再度延伸供应链金融的触角，与农发行合作，获得政策性资金4亿元，为产业链最前沿的小农精准放款，确保农民能够粮出手、钱到手，真正实现了国家提倡的“钱等粮”。
												</p>
												<p class="text">
													有效链接生产企业、物流企业、终端用户和金融机构，充分整合商品的商流、信息流、物流和资金流，形成完备的产业链生态体系，带来客户价值和自身价值的最大提升。
												</p>
												<div style="text-align: center">
													<img
														src="../../../assets/imgs/home/case-nk.png"
														alt="农开数字化供应链生态图"
														style="width: 800px"
													/>
												</div>
											</template>
											<template v-if="activeType == 4">
												<p class="text">
													基于云监管平台的数字供应链解决方案，通过整合核心企业主体信用、交易全链条的数据信用和仓储粮食物的信用，资金方打消了疑虑，可以使资金直达资产，在解决粮食收储企业融资难、融资贵的同时，也有力保证了售粮农户粮出手、钱到手，切实保障了售粮农户的利益。
												</p>
												<p class="text">
													由于粮食的储销周期较长，仓储安全不仅直接影响涉农企业的经营状况，还与国民舌尖上的安全息息相关。因此，农业供应链的数字化转型我们以仓储的智能化改造为切入点。以河南新华国家粮食储备库为范本打造智慧粮仓，通过铺设测温点、架设传感器，利用物联网和AI智能监控技术，对粮仓内的粮食进行全方位实时监控。在2021年夏粮收购中，完成改造的智慧粮仓已投入使用，中央电视台新闻频道对此进行了报道，并对智慧粮仓在节粮减损、保障粮食安全方面发挥的重要作用予以肯定。
												</p>
												<p class="text">
													如今，科技在一定程度上代表了企业的生命力和创造力，数链科技运用人工智能、大数据、云计算、区块链等技术手段帮助农开供应链这样的行业领头羊在数字化转型的道路上不断探索、前进。在双方的深入合作和共同努力下，数链科技将致力于为更多涉农企业提供数字化解决方案，为打通农业供应链渠道、构建农业产业链生态贡献一份“数科力量”。
												</p>
											</template>
										</div>
									</template>
								</div>
							</div>
						</a-tab-pane>
					</a-tabs>
				</div>
			</div>
			<!--    底部-->
			<Footer></Footer>
		</div>
	</div>
</template>

<script>
import Header from '../components/Header';
import Footer from '../components/Footer';
import { pageResize, unset, cancelUnset } from '@/v2/center/home/lib/rem';
import keywords from '@/config/keywords';

export default {
	metaInfo: {
		...keywords.case
	},
	name: 'Case.vue',
	data() {
		let isMobile = navigator.userAgent.includes('Mobile');
		return {
			activeType: 1,
			activeCompany: null,
			activeTab: null,
			isMobile
		};
	},
	components: {
		Header,
		Footer
	},
	destroyed() {
		cancelUnset();
	},
	mounted() {
		pageResize(document.querySelector('#case'));
		this.changeTab(this.$route.query.tab || '1');
	},
	methods: {
		changeCompany(name) {
			this.activeCompany = name;
			this.activeType = 1;
		},
		changeType(type) {
			this.activeType = type;
		},
		changeTab(e) {
			this.activeTab = e;
			if (e == 1) {
				this.changeCompany('nx');
			} else {
				this.changeCompany('sm');
			}
		}
	}
};
</script>

<style scoped lang="less">
#case {
	padding-top: 150px;
	height: 1px;
}
#container {
	.banner {
		width: 100%;
		height: 515px;
		background: url('../../../assets/imgs/home/case-banner.png') no-repeat;
		background-size: cover;
	}

	::v-deep .tabs {
		.ant-tabs-nav {
			& > div {
				margin: 0 auto;
				color: #868686;
				font-size: 28px;
			}
		}

		.ant-tabs-tab-active {
			color: #2f6eb4;
			border-bottom: 6px solid #4d6ba2;
		}

		.ant-tabs-ink-bar {
			display: none !important;
		}

		.ant-tabs-tab {
			padding: 24px 0px;
			margin-right: 190px;

			&:last-child {
				margin-right: 0;
			}
		}

		.ant-tabs-bar {
			margin-bottom: 0;
		}

		.ant-pagination {
			text-align: center;
			margin-bottom: 62px;

			li {
				margin: 0 12px;
			}
		}

		.ant-pagination-item-active {
			background-color: #4682f3;
			border: none;
			border-radius: 50%;

			a {
				color: #ffffff;
			}
		}
	}

	.tabs {
		position: relative;
		background-color: #ffffff;
		background: url('../../../assets/imgs/home/solution-tab3-bg.png') no-repeat;
		background-size: cover;

		.tab-2,
		.tab-1 {
			padding: 81px 200px 266px;
			display: flex;
			justify-content: space-between;

			.nav {
				width: 332px;

				.title {
					font-size: 30px;
					font-weight: 400;
					color: #1e1e1e;
					margin-bottom: 44px;
				}

				li {
					font-size: 24px;
					font-weight: 300;
					color: #6f6d6d;
					line-height: 48px;
					cursor: pointer;
				}
			}

			.detail {
				flex: 1;

				.title {
					font-size: 36px;
					line-height: 35px;
					font-weight: 500;
					color: #1e1e1e;
					padding-bottom: 20px;
					border-bottom: 1px solid #6f6d6d;
					margin-bottom: 45px;
				}

				.desc {
					font-size: 32px;
					font-weight: 300;
					color: #6f6d6d;
					line-height: 54px;
				}

				img {
					width: 100%;
					margin-top: 64px;
					margin-bottom: 81px;
				}

				.type {
					display: flex;
					justify-content: space-between;
					margin-bottom: 59px;

					li {
						width: 168px;
						height: 48px;
						border-radius: 24px;
						line-height: 48px;
						text-align: center;
						font-size: 30px;
						border: 2px solid #6f6d6d;
						font-weight: 400;
						color: #1e1e1e;
						cursor: pointer;
					}

					.active {
						background: #2f6eb4;
						border: none;
						color: #ffffff;
					}
				}

				.text {
					font-size: 26px;
					font-weight: 300;
					color: #595757;
					line-height: 48px;
					margin-bottom: 32px;
					text-indent: 52px;

					span {
						font-size: 28px;
						color: #1e1e1e;
						display: inline-block;
						font-weight: 500;
						margin-bottom: 6px;
					}
				}
			}
		}
	}
}

video {
	margin-top: 64px;
	width: 100%;
	margin-bottom: 81px;
}
</style>
