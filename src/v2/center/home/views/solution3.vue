<template>
	<div style="height: 100%">
		<!--    头部-->
		<Header class="white"></Header>
		<div id="solution">
			<!--    内容-->
			<div class="container">
				<div class="banner"></div>
				<div class="content">
					<div class="nav">
						<div
							v-for="item in navList"
							:key="item.key"
							class="nav-item"
						>
							<div
								class="title"
								@click="companyChange(item.key)"
							>
								{{ item.name }}
							</div>
							<ul v-if="item.key == active">
								<li
									v-for="i in item.children"
									:key="i.key"
									class="nav-item-child"
								>
									<div @click="goAnchor('#tab' + i.key)">
										{{ i.name }}
									</div>
								</li>
							</ul>
						</div>
					</div>
					<div
						class="detail-1"
						v-if="active == 1"
					>
						<!-- <video
							controls="controls"
							src="https://shdatalink.oss-cn-zhangjiakou.aliyuncs.com/video/MG5.mp4"
							muted
							autoplay
							loop
							preload="auto"
							style="width: 1210px; margin-left: 517px; margin-top: 94px"
						></video> -->
						<img
							src="../../../assets/imgs/home/zxqy_video_poster.png"
							alt=""
							style="width: 1210px; margin-left: 517px; margin-top: 94px"
						/>
						<div
							class="tab-1"
							id="tab1-1"
						>
							<div class="title">数链e付</div>
							<p>
								数链科技与40余家金融机构对接，依托不同地域的核心企业，根据煤炭终端（包括但不限于：电厂、钢厂、水泥厂、化工厂、造纸厂等）形成的账期，提供应收账款融资对接服务，融资金额最高可达货值90%。本产品无需抵质押，合同签订、单据传递、提还款等流程均为线上化操作，简便高效，并由线上、线下专业人员提供全程服务。
							</p>
							<div class="pay-type">
								<div class="zcf">
									<div class="line">
										<div>装车付</div>
									</div>
									<p>
										专门针对火车煤炭运输业务推出的一款应收前置服务产品。在货物完成火车装运后，即可申请第一次融资，融资金额为货值的50%-70%；在货物抵达目的地完成验收后，即可申请第二次融资，两次融资金额合计最高可达货值的90%。
									</p>
								</div>
								<div class="dcf">
									<div class="line">
										<div>到厂付</div>
									</div>
									<p style="margin-top: 98px">在货物抵达目的地完成验收后，即可申请融资，融资金额最高可达货值的90%。</p>
								</div>
							</div>
							<div class="cpys">产品要素</div>
							<div class="time-line">
								<div class="line"></div>
								<ul style="display: flex; justify-content: space-between">
									<li>
										<span class="circle"></span>
										<div class="headline">融资金额</div>
										<div class="des">
											单笔可至货值的 <br />
											50%-90%
										</div>
									</li>
									<li>
										<span class="circle"></span>
										<div class="headline">融资期限</div>
										<div class="des">
											一般最长周期为90天 <br />
											根据不同金融产品期，可适当延长
										</div>
									</li>
									<li>
										<span class="circle"></span>
										<div class="headline">资金成本</div>
										<div class="des">年化6%-12%</div>
									</li>
								</ul>
							</div>
							<div class="cpys">准入标准</div>
							<ul class="standard">
								<li style="line-height: 240px">
									<div>数链平台注册客户</div>
								</li>
								<li style="padding-top: 72px">
									<div style="line-height: 48px">
										部分资金项目需提供 <br />
										企业经营情况报表
									</div>
								</li>
								<li style="padding-top: 38px">
									<div style="line-height: 40px; margin-bottom: 8px">
										装车付用户限定火运业务 <br />
										并指定金融机构
									</div>
									<div style="line-height: 38px; font-size: 22px; font-weight: 300">
										工商注册经营范围： <br />
										必须有相关大宗商品的经营范围
									</div>
								</li>
								<li style="padding-top: 62px">
									<div>公司纳税资格:</div>
									<div style="line-height: 38px; font-size: 22px">
										必须是一般纳税人， <br />
										可以开具增值税专用发票
									</div>
								</li>
								<li style="padding-top: 42px">
									<div>公司征信记录:</div>
									<div style="line-height: 38px; font-size: 22px; font-weight: 300">
										半年内无重大失信、被执行记 <br />
										录，没有受到重大的行政类处罚 <br />
										或税务处罚记录
									</div>
								</li>
								<li style="padding-top: 43px">
									<div>法定代表人征信:</div>
									<div style="line-height: 38px; font-size: 22px; font-weight: 300">
										半年内无违法、失信、超期 <br />
										欠款（尤其是欠金融机构）<br />
										等不良记录
									</div>
								</li>
							</ul>
							<div class="tab1-bg"></div>
						</div>
						<div
							class="tab-2"
							id="tab1-2"
						>
							<div class="title">数链e货</div>
							<div class="kind">煤炭</div>
							<p>
								本产品是针对煤炭领域的仓押场景类融资产品。在煤炭集散的主要物流仓库、铁路站台、港口等地，贸易商将货物转给核心企业代为销售，核心企业取得货权后，贸易商即可在数链平台申请融资。数链平台根据核心企业和金融机构的要求，线上匹配金融机构合适资金。
							</p>
							<div
								class="cpys"
								style="margin-top: 51px"
							>
								产品要素
							</div>
							<div class="time-line">
								<div class="line"></div>
								<ul style="display: flex; justify-content: space-between">
									<li>
										<span class="circle"></span>
										<div class="headline">融资金额</div>
										<div class="des">
											单笔可至货值的 <br />
											65%-100%
										</div>
									</li>
									<li>
										<span class="circle"></span>
										<div class="headline">借款期限</div>
										<div class="des">
											一般最长周期为90天， <br />
											根据不同金融产品期，可适当延长
										</div>
									</li>
									<li>
										<span class="circle"></span>
										<div class="headline">资金成本</div>
										<div class="des">10-15%</div>
									</li>
								</ul>
							</div>
							<div class="cpys">准入标准</div>
							<ul class="standard">
								<li style="padding-top: 70px">
									<div style="line-height: 40px">
										仓储地需符合 <br />
										数链科技监管要求
									</div>
								</li>
								<li style="line-height: 240px">
									<div>数链平台注册客户</div>
								</li>
								<li style="padding-top: 70px">
									<div style="line-height: 40px; margin-bottom: 8px">工商注册经营范围：</div>
									<div style="line-height: 38px; font-size: 22px; font-weight: 300">必须有相关大宗商品的经营范围</div>
								</li>
								<li style="padding-top: 62px">
									<div>公司纳税资格:</div>
									<div style="line-height: 38px; font-size: 22px">
										必须是一般纳税人， <br />
										可以开具增值税专用发票
									</div>
								</li>
								<li style="padding-top: 42px">
									<div>公司征信记录:</div>
									<div style="line-height: 38px; font-size: 22px; font-weight: 300">
										半年内无重大失信、被执行记 <br />
										录，没有受到重大的行政类处罚 <br />
										或税务处罚记录
									</div>
								</li>
								<li style="padding-top: 43px">
									<div>法定代表人征信:</div>
									<div style="line-height: 38px; font-size: 22px; font-weight: 300">
										半年内无违法、失信、超期 <br />
										欠款（尤其是欠金融机构）<br />
										等不良记录
									</div>
								</li>
							</ul>
							<div class="kind">钢材</div>
							<p>
								本产品是针对钢材领域的仓押场景类融资产品。在钢材集散的主要物流仓库，贸易商将货物转由给核心企业代为销售，核心企业取得货权后，贸易商在数链平台申请融资。数链平台根据核心企业和金融机构的要求，线上匹配金融机构合适资金。
							</p>
							<div
								class="cpys"
								style="margin-top: 71px"
							>
								产品要素
							</div>
							<div class="time-line">
								<div class="line"></div>
								<ul style="display: flex; justify-content: space-between">
									<li>
										<span class="circle"></span>
										<div class="headline">融资金额</div>
										<div class="des">
											单笔可至货值的 <br />
											75%-100%
										</div>
									</li>
									<li>
										<span class="circle"></span>
										<div class="headline">借款期限</div>
										<div class="des">
											一般最长周期为90天， <br />
											根据不同金融产品期，可适当延长
										</div>
									</li>
									<li>
										<span class="circle"></span>
										<div class="headline">资金成本</div>
										<div class="des">9-10.2%</div>
									</li>
								</ul>
							</div>
							<div class="cpys">准入标准</div>
							<ul class="standard-gc">
								<li style="padding-top: 40px">
									<div style="line-height: 40px; margin-bottom: 8px">工商注册经营范围：</div>
									<div style="line-height: 38px; font-size: 22px; font-weight: 300">必须有相关大宗商品的经营范围</div>
								</li>
								<li style="padding-top: 40px">
									<div>公司纳税资格:</div>
									<div style="line-height: 38px; font-size: 22px">必须是一般纳税人， 可以开具增值税专用发票</div>
								</li>
								<li style="padding-top: 30px">
									<div>公司征信记录:</div>
									<div style="line-height: 38px; font-size: 22px; font-weight: 300">
										半年内无重大失信、被执行记录，没有受到 <br />
										重大的行政类处罚 或税务处罚记录
									</div>
								</li>
								<li style="padding-top: 30px">
									<div>法定代表人征信:</div>
									<div style="line-height: 38px; font-size: 22px; font-weight: 300">
										半年内无违法、失信、超期 欠款（尤其是欠<br />金融机构 等不良记录
									</div>
								</li>
							</ul>
						</div>
						<div
							class="tab-3"
							id="tab1-3"
						>
							<div class="title">数链e采</div>
							<p>
								本产品是针对煤炭领域的预付场景类融资产品。核心企业通过贸易商指定的采购方采购煤炭，在贸易商向核心企业缴纳一定比例的保证金后，即可线上申请融资，申请通过后，核心企业可向其指定的采购方全额支付对应金额的货款。贸易商随后可以一次性或者分批次向核心企业采购该批次煤炭。
							</p>
							<div class="cpys">产品要素</div>
							<div class="time-line">
								<div class="line"></div>
								<ul style="display: flex; justify-content: space-between">
									<li>
										<span class="circle"></span>
										<div class="headline">融资金额</div>
										<div class="des">
											单笔可至货值的 <br />
											80%-90%
										</div>
									</li>
									<li>
										<span class="circle"></span>
										<div class="headline">借款期限</div>
										<div class="des">
											一般最长周期为90天，<br />
											根据不同金融产品期，可适当延长
										</div>
									</li>
									<li>
										<span class="circle"></span>
										<div class="headline">资金成本</div>
										<div class="des">年化12%</div>
									</li>
								</ul>
							</div>
							<div class="cpys">准入标准</div>
							<ul class="standard">
								<li style="line-height: 240px">
									<div>注册善美融资平台</div>
								</li>
								<li style="line-height: 240px">
									<div>数链平台注册客户</div>
								</li>
								<li style="padding-top: 70px">
									<div style="line-height: 40px; margin-bottom: 8px">工商注册经营范围：</div>
									<div style="line-height: 38px; font-size: 22px; font-weight: 300">必须有相关大宗商品的经营范围</div>
								</li>
								<li style="padding-top: 62px">
									<div>公司纳税资格:</div>
									<div style="line-height: 38px; font-size: 22px">
										必须是一般纳税人， <br />
										可以开具增值税专用发票
									</div>
								</li>
								<li style="padding-top: 42px">
									<div>公司征信记录:</div>
									<div style="line-height: 38px; font-size: 22px; font-weight: 300">
										半年内无重大失信、被执行记 <br />
										录，没有受到重大的行政类处罚 <br />
										或税务处罚记录
									</div>
								</li>
								<li style="padding-top: 43px">
									<div>法定代表人征信:</div>
									<div style="line-height: 38px; font-size: 22px; font-weight: 300">
										半年内无违法、失信、超期 <br />
										欠款（尤其是欠金融机构）<br />
										等不良记录
									</div>
								</li>
							</ul>
						</div>
					</div>
					<div
						class="detail-2"
						v-if="active == 2"
					>
						<!-- <video
							controls="controls"
							src="https://shdatalink.oss-cn-zhangjiakou.aliyuncs.com/video/MG3.mp4"
							muted
							autoplay
							loop
							preload="auto"
							style="width: 1210px; margin-left: 517px; margin-top: 94px"
						></video> -->
						<img
							src="../../../assets/imgs/home/jrjg_video_poster.png"
							alt=""
							style="width: 1210px; margin-left: 517px; margin-top: 94px"
						/>
						<div
							class="tab-1"
							id="tab2-1"
						>
							<div class="title">金融机构云资产平台</div>
							<p>
								数链科技为金融机构提供大宗商品供应链资产云对接服务，平台对供应链资产数据进行数字化、标准化整理，形成可信的数字资产包。金融机构根据资产包可以实现对融资方单笔业务精准放款，资产平台打开资产黑匣子，提升金融机构资产风控能力。
							</p>
							<div class="tab1-bg"></div>
						</div>
						<div
							class="tab-2"
							id="tab2-2"
						>
							<div class="title">金融机构云风控服务</div>
							<p>
								数链科技为金融机构提供大宗商品供应链资产云对接服务，平台对供应链资产数据进行数字化、标准化整理，形成可信的数字资产包。金融机构根据资产包可以实现对融资方单笔业务精准放款，资产平台打开资产黑匣子，提升金融机构资产风控能力。
							</p>
							<ul class="fk">
								<li>
									<img
										src="../../../assets/imgs/home/solution-fk-icon-1.png"
										alt="产业全周期数字风控解决方案"
									/>
									<div>
										<div
											class="article-title"
											style="margin-top: 53px"
										>
											产业全周期数字风控解决方案
										</div>
										<div class="article">
											聚焦大宗供应链生态圈，打造过程管控、数据驱动、场景定制化开发的供应链金融风控新模式。基于贷前、贷中、贷后全生命周期风控策略和模型，提供供应商、核心企业和终端的丰富企业画像；自动化资产审核和贸易背景交叉验真，生成多维数据分析的资产审核报告；对授信对象进行全周期监控预警服务，精准推送贷后数字报告。
										</div>
									</div>
								</li>
								<li>
									<img
										src="../../../assets/imgs/home/solution-fk-icon-2.png"
										alt="产业链企业评价服务"
									/>
									<div>
										<div
											class="article-title"
											style="margin-top: 80px"
										>
											产业链企业评价服务
										</div>
										<div class="article">
											基于工商、司法、税务等大数据筛查和产业全链条多维交易和融资行为数据分析，构建上下游履约能力评价和回款付款能力评价模型，以丰富企业画像呈现供应链上下游不同主体的优劣势和在同类客户中的信用层级水平。
										</div>
									</div>
								</li>
								<li>
									<img
										src="../../../assets/imgs/home/solution-fk-icon-3.png"
										alt="资产数字化验真"
									/>
									<div>
										<div
											class="article-title"
											style="margin-top: 45px"
										>
											资产数字化验真
										</div>
										<div class="article">
											将大宗商品交易全链条实时数字化，充分采集物流、商流、资金流、信息流等四流数据，基于自研终端货值计算模型、物联网、区块链、OCR识别等技术，设计多维勾稽风控模型，进行自动化资产审核，对贸易真实性进行交叉验真，自动生成资产数字化验真报告，让企业的资产可视、可控、可追溯，打造具有金融服务属性的优质数字资产。
										</div>
									</div>
								</li>
								<li>
									<img
										src="../../../assets/imgs/home/solution-fk-icon-4.png"
										alt="AI监控预警"
									/>
									<div>
										<div
											class="article-title"
											style="margin-top: 80px"
										>
											AI监控预警
										</div>
										<div class="article">
											聚焦于大宗供应链多场景，搭建覆盖产业端主体信用评价、交易端和融资端的全生命周期预警指标体系，为金融机构输出24*7的一站式风险监控及预警服务，支持定制化配置和预警指标聚合分析，打造风险监控数据看板。
										</div>
									</div>
								</li>
								<li>
									<img
										src="../../../assets/imgs/home/solution-fk-icon-5.png"
										alt="资产数字贷后"
									/>
									<div>
										<div
											class="article-title"
											style="margin-top: 64px"
										>
											资产数字贷后
										</div>
										<div class="article">
											基于供应链的交易属性，持续跟踪发票、合同、结算单等核心业务单据的完备性和实时状态，聚焦物流轨迹跟踪预警、资金流闭环管理、全链条业务智能完结分析、主体信用异动监控和风控统计分析等，输出过程信用为主，主体信用为辅的数字贷后管理报告。
										</div>
									</div>
								</li>
							</ul>
						</div>
					</div>
					<div
						class="detail-3"
						v-if="active == 3"
					>
						<!-- <video
							controls="controls"
							src="https://shdatalink.oss-cn-zhangjiakou.aliyuncs.com/video/MG4.mp4"
							muted
							autoplay
							loop
							preload="auto"
							style="width: 1210px; margin-left: 517px; margin-top: 94px"
						></video> -->
						<img
							src="../../../assets/imgs/home/hxqy_video_poster.png"
							alt=""
							style="width: 1210px; margin-left: 517px; margin-top: 94px"
						/>
						<div
							class="tab-1"
							id="tab3-1"
						>
							<div class="title">数字化升级</div>
							<p>
								数链科技基于产业认知，运用现代科技手段，为核心企业提供大宗商品交易全链条数字化改造升级服务，实现供应链业务生态线上化、数字化和标准化，实时反映业务风险，为业务真实性保驾护航。
							</p>
							<ul class="szh">
								<li>
									<img
										src="../../../assets/imgs/home/solution-szh-icon-1.png"
										alt="客户综合分析管理"
									/>
									<div class="article-title">客户综合分析管理</div>
									<div class="article">通过多种数据源，对客户主体信息及经营数据进行分析及评估。</div>
								</li>
								<li style="padding-top: 145px">
									<img
										src="../../../assets/imgs/home/solution-szh-icon-2.png"
										alt="电子单据签署"
									/>
									<div class="article-title">电子单据签署</div>
									<div class="article">
										针对合同、货转、结算单等关键单据，采用电子签章方式，解决线下单据传输效率、安全等问题。
									</div>
								</li>
								<li>
									<img
										src="../../../assets/imgs/home/solution-szh-icon-3.png"
										alt="交易全流程数字化管理"
									/>
									<div class="article-title">交易全流程数字化管理</div>
									<div class="article">
										合同签订、物流追踪、货转、付款、结算、付款、发票、回款等实现全流程线上化操作，全面覆盖每个关键环节，并对信息进行数字化、规范化管理，避免线下单据管理混乱的问题。
									</div>
								</li>
								<li style="padding-top: 230px">
									<img
										src="../../../assets/imgs/home/solution-szh-icon-4.png"
										alt="内外部系统对接，提升业务效率"
									/>
									<div class="article-title">内外部系统对接，提升业务效率</div>
									<div class="article">
										对接企业内部erp、OA审批等系统，打破企业间不同系统之间的数据孤岛；对接金融机构系统，实现融资数据的互通互联，实现线上化融资。
									</div>
								</li>
								<li>
									<img
										src="../../../assets/imgs/home/solution-szh-icon-5.png"
										alt="多端操作"
									/>
									<div class="article-title">多端操作</div>
									<div class="article">电脑端、移动端、微信小程序，实现业务的多场景操作需求。</div>
								</li>
								<li>
									<img
										src="../../../assets/imgs/home/solution-szh-icon-6.png"
										alt="灵活部署"
									/>
									<div class="article-title">灵活部署</div>
									<div class="article">公有云、私有化部署两种模式可选，功能按需配置，支持企业扩展需求。</div>
								</li>
							</ul>
						</div>
						<div
							class="tab-2"
							id="tab3-2"
						>
							<div class="title">资产数字化整理</div>
							<p>
								数链科技基于丰富的业务及银行对接经验，结合不同的业务场景及金融机构的融资要求，实现对资产数据的自动化整理及核验功能，并与金融机构进行银企直联，高效安全的开展银行对接，实现资产数据的系统传输，同时支持核心企业线上确权，并通过区块链技术，所有资产数据上链，数据可溯源、真实性有保障。
							</p>
						</div>
						<div
							class="tab-3"
							id="tab3-3"
						>
							<div class="title">BI管理驾驶舱</div>
							<p>
								数链科技整合核心企业各类场景资源，对运营数据进行深度分析建模，形成全场景、可视化的数据分析平台，实现对源数据的规范性管理，助力企业精准识别产业风险、及时预警、评估风险影响、提供应对决策等，并使企业高管更好的基于数据做科学决策。
							</p>
						</div>
						<div
							class="tab-4"
							id="tab3-4"
						>
							<div class="title">智慧仓储</div>
							<div class="zh-bg"></div>
							<div class="ls">
								<div class="kind">粮食</div>
								<p>
									数链科技通过软硬件结合的方式，通过视频监控、自动道闸、电子锁等硬件对粮食的入库、在库、出库等全流程进行管理。
								</p>
								<ul>
									<li class="up">
										<img
											src="../../../assets/imgs/home/solution-zh-icon-1.png"
											alt="一卡通智慧出入库管理系统"
										/>
										<div class="article-title">一卡通智慧出入库管理系统</div>
										<div class="article">
											通过发放一卡通，实现卡、人、车唯一性绑定，对发卡、化验、核价、毛重、卸车、皮重、结算、销卡进行全流程管理；与地磅直连，自动读取重量，避免人工操作问题，同时对过磅车辆进行实时抓拍。
										</div>
									</li>
									<li class="up">
										<img
											src="../../../assets/imgs/home/solution-zh-icon-2.png"
											alt="粮库监控"
										/>
										<div class="article-title">粮库监控</div>
										<div class="article">
											对粮库从大门、仓门到仓内加装智能摄像头，对粮库进行全面监控。其中仓内安装智能球机，支持夜视和360度全方位监控，对在库期间的粮面进行动态监测，对画面移动进行实时预警
										</div>
									</li>
								</ul>
								<ul>
									<li class="down">
										<img
											src="../../../assets/imgs/home/solution-zh-icon-3.png"
											alt="电子锁"
										/>
										<div class="article-title">电子锁</div>
										<div class="article">
											粮食封仓期间，对仓门加装电子锁，对仓门的开关实现远程管理，企业可远程通过APP审批开锁申请，并对所有的开关锁均进行系统记录。
										</div>
									</li>
									<li class="down">
										<img
											src="../../../assets/imgs/home/solution-zh-icon-5.png"
											alt="粮情监测"
										/>
										<div class="article-title">粮情监测</div>
										<div class="article">
											与粮库的粮情监测系统进行对接，实时监测仓内粮食的温度、湿度、气体、虫害等信息，针对异常进行及时预警。
										</div>
									</li>
									<li class="down">
										<img
											src="../../../assets/imgs/home/solution-zh-icon-2.png"
											alt="巡库管理"
										/>
										<div class="article-title">巡库管理</div>
										<div class="article">
											通过APP，企业对驻库员的巡库任务进行线上化管理，对巡库任务进行规划化管理，提升企业管理效率。
										</div>
									</li>
								</ul>
							</div>
							<div class="mt">
								<div class="kind">煤炭</div>
								<p>
									数链科技通过运用物联网、人工智能等技术对煤炭仓库进行智能化升级改造，对煤炭的“入、存、出”全方位的智慧管控，实现企业对仓储的数字化全方位监管要求。
								</p>
								<ul>
									<li>
										<img
											src="../../../assets/imgs/home/solution-zh-icon-3.png"
											alt="智能磅房系统"
										/>
										<div class="article-title">智能磅房系统</div>
										<div class="article">
											对车辆车牌进行自动识别，提升操作效率；通过红外定位、雷达限位等对车辆进行位置固定，保障车辆停在正确位置，避免称重不准；与地磅数据进行直连，避免人为操控称重数据；高清监控实时自动抓拍汽车多方位图片，对出入库进行图像留存。
										</div>
									</li>
									<li>
										<img
											src="../../../assets/imgs/home/solution-zh-icon-4.png"
											alt="库存管理系统"
										/>
										<div class="article-title">库存管理系统</div>
										<div class="article">
											汽运通过智能磅房系统完成称重后，自动生成出入库记录；火运通过OCR识别铁路大票等重要业务单据并与铁路平台对接，交叉验证贸易真实性，通过出入库的数字化管理形成库存台账，形成电子存货凭证。
										</div>
									</li>
									<li>
										<img
											src="../../../assets/imgs/home/solution-zh-icon-5.png"
											alt="AI视频监管"
										/>
										<div class="article-title">AI视频监管</div>
										<div class="article">
											通过“AI+视频监控”等方式，对在库货物进行7 x
											24h全方位监控，智能监控巡检及画面动态侦测功能，及时获取监控掉线、画面异动情况，进行实时预警，确保在库货物的货物安全。
										</div>
									</li>
								</ul>
							</div>
							<div class="gc">
								<div class="kind">钢材</div>
								<p>数链科技通过运用物联网、人工智能等技术对钢材仓库进行智能化升级改造，实现仓库业务流程的数字化升级。</p>
								<ul>
									<li>
										<img
											src="../../../assets/imgs/home/solution-zh-icon-3.png"
											alt="智能磅房系统"
										/>
										<div class="article-title">智能磅房系统</div>
										<div class="article">
											对车辆车牌进行自动识别，提升操作效率；通过红外定位、雷达限位等对车辆进行位置固定，保障车辆停在正确位置，避免称重不准；与地磅数据进行直连，避免人为操控称重数据；高清监控实时自动抓拍汽车多方位图片，对出入库进行图像留存。
										</div>
									</li>
									<li>
										<img
											src="../../../assets/imgs/home/solution-zh-icon-4.png"
											alt="智慧钢材管理系统"
										/>
										<div class="article-title">智慧钢材管理系统</div>
										<div class="article">
											实现对钢材仓库的业务流程的线上化、数字化升级。合同管理、入库通知单、库存管理、提货通知单、盈亏盘点、结算管理等。
										</div>
									</li>
									<li>
										<img
											src="../../../assets/imgs/home/solution-zh-icon-5.png"
											alt="AI看货"
										/>
										<div class="article-title">“AI看货”</div>
										<div class="article">
											通过“AI+视频监控”等方式，对在库货物进行7 x
											24h全方位监控，建立仓库三维立体图像，智能监控巡检及画面动态侦测功能，及时获取监控掉线、画面异动情况，进行实时预警，确保在库货物的货物安全。
										</div>
									</li>
								</ul>
							</div>
						</div>
					</div>
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
import { pageResize, unset, cancelUnset } from '../lib/rem';
import keywords from '@/config/keywords';

let navList = [
	{
		name: '中小企业',
		key: '1',
		children: [
			{
				name: '数链e付',
				key: '1-1'
			},
			{
				name: '数链e货',
				key: '1-2'
			},
			{
				name: '数链e采',
				key: '1-3'
			}
		]
	},
	{
		name: '金融机构 +',
		key: '2',
		children: [
			{
				name: '金融机构云资产平台',
				key: '2-1'
			},
			{
				name: '金融机构云风控服务',
				key: '2-2'
			}
		]
	},
	{
		name: '核心企业 +',
		key: '3',
		children: [
			{
				name: '数字化升级',
				key: '3-1'
			},
			{
				name: '资产数字化整理',
				key: '3-2'
			},
			{
				name: 'BI管理驾驶舱',
				key: '3-3'
			},
			{
				name: '智慧仓储',
				key: '3-4'
			}
		]
	}
];
export default {
	metaInfo: {
		...keywords.solutiontab3
	},
	name: 'Solution.vue',
	data() {
		return {
			active: 3,
			navList
		};
	},
	created() {},
	destroyed() {
		cancelUnset();
	},
	mounted() {
		pageResize(document.querySelector('#solution'));
	},
	components: {
		Header,
		Footer
	},
	methods: {
		companyChange(activeKey) {
			this.active = activeKey;
		},
		goAnchor(id) {
			document.querySelector(id).scrollIntoView({
				behavior: 'smooth',
				block: 'start',
				inline: 'start'
			});
		}
	}
};
</script>

<style scoped lang="less">
#solution {
	padding-top: 150px;
	height: 1px;
}
.banner {
	width: 100%;
	height: 515px;
	background: url('../../../assets/imgs/home/solution-banner.png') no-repeat;
	background-size: cover;
}

.content {
	display: flex;
	justify-content: space-between;
	position: relative;

	.nav {
		width: 322px;
		position: absolute;
		left: 195px;
		top: 94px;
		z-index: 999;

		.nav-item {
			margin-bottom: 41px;

			.title {
				line-height: 34px;
				font-size: 36px;
				font-weight: 500;
				color: #2f6eb4;
				cursor: pointer;
			}

			ul {
				margin-top: 27px;
			}

			.nav-item-child {
				margin-bottom: 16px;
				font-weight: 300;
				color: #6f6d6d;
				font-size: 24px;

				div {
					cursor: pointer;
				}
			}
		}
	}

	.kind {
		width: 124px;
		height: 44px;
		line-height: 44px;
		text-align: center;
		background: #2f6eb4;
		border-radius: 22px;
		margin: 51px 0 36px;
		color: #ffffff;
		font-size: 32px;
	}

	.detail-1 {
		//padding-left: 332px;

		.title {
			font-size: 36px;
			font-weight: 500;
			color: #1e1e1e;
			padding-bottom: 21px;
			margin-bottom: 45px;
			border-bottom: 1px solid #6f6d6d;
		}

		p {
			font-size: 30px;
			font-weight: 300;
			color: #6f6d6d;
			line-height: 54px;
		}

		.pay-type {
			display: flex;
			justify-content: space-between;
			margin-top: 70px;
			margin-bottom: 80px;

			p {
				margin-top: 54px;
				font-size: 28px;
			}

			.zcf {
				width: 690px;
				height: 450px;
				background: #ffffff;
				padding: 77px 49px 65px 49px;
				box-shadow: 0px 5px 30px 0px rgba(200, 200, 200, 0.5);
				border-radius: 10px;

				.line {
					width: 100%;
					height: 1px;
					background: #2f6eb4;

					div {
						width: 150px;
						height: 44px;
						background: #2f6eb4;
						border-radius: 22px;
						line-height: 44px;
						text-align: center;
						margin: 0 auto;
						font-size: 32px;
						font-weight: 400;
						color: #ffffff;
						position: relative;
						top: -22px;
					}
				}
			}

			.dcf {
				height: 450px;
				width: 490px;
				background: #ffffff;
				padding: 77px 49px 65px 49px;
				box-shadow: 0px 5px 30px 0px rgba(200, 200, 200, 0.5);
				border-radius: 10px;

				.line {
					width: 100%;
					height: 1px;
					background: #2d4574;

					div {
						width: 150px;
						height: 44px;
						background: #2d4574;
						border-radius: 22px;
						line-height: 44px;
						text-align: center;
						margin: 0 auto;
						font-size: 32px;
						font-weight: 400;
						color: #ffffff;
						position: relative;
						top: -22px;
					}
				}
			}
		}

		.cpys {
			height: 34px;
			font-size: 36px;
			text-align: center;
			font-weight: 400;
			color: #1e1e1e;
			margin-bottom: 45px;
		}

		.time-line {
			text-align: center;
			margin-bottom: 86px;

			.line {
				height: 1px;
				background: #1e1e1e;
			}

			.circle {
				width: 14px;
				height: 14px;
				background-color: #2f6eb4;
				border-radius: 50%;
				position: relative;
				top: -9px;
				display: inline-block;
			}

			.headline {
				font-size: 30px;
				font-weight: 400;
				color: #1e1e1e;
				line-height: 54px;
				margin-bottom: 12px;
			}

			.des {
				font-size: 30px;
				font-weight: 400;
				color: #6f6d6d;
				text-align: center;
				line-height: 36px;
			}
		}

		.tab-1,
		.tab-2,
		.tab-3 {
			position: relative;

			.standard {
				display: flex;
				flex-direction: row;
				flex-wrap: wrap;
				justify-content: space-between;

				li {
					height: 240px;
					background-color: red;
					margin-bottom: 25px;
					width: 32%;
					text-align: center;
					border-radius: 10px;
					font-size: 26px;
					font-weight: 400;
					background-color: rgb(27, 101, 171);
					color: #ffffff;

					&:nth-child(2n + 2) {
						background-color: rgb(36, 62, 105);
					}
				}
			}

			.standard-gc {
				display: flex;
				flex-direction: row;
				flex-wrap: wrap;
				justify-content: space-between;

				li {
					height: 180px;
					background-color: red;
					margin-bottom: 25px;
					width: 48%;
					text-align: center;
					border-radius: 10px;
					font-size: 26px;
					font-weight: 400;
					background-color: rgb(36, 62, 105);
					color: #ffffff;

					&:nth-child(2),
					&:nth-child(3) {
						background-color: rgb(27, 101, 171);
					}
				}
			}
		}

		.tab-1 {
			background: url('../../../assets/imgs/home/solution-tab1-bg.png') no-repeat;
			background-size: cover;
			padding: 94px 193px 130px 527px;
		}

		.tab-2 {
			background: url('../../../assets/imgs/home/solution-tab1-bg.png') no-repeat;
			background-size: cover;
			padding: 94px 193px 130px 527px;
		}

		.tab-3 {
			background: url('../../../assets/imgs/home/solution-tab3-bg.png') no-repeat;
			background-size: cover;
			padding: 94px 193px 130px 527px;
		}
	}

	.detail-2 {
		.title {
			font-size: 36px;
			font-weight: 500;
			color: #1e1e1e;
			padding-bottom: 21px;
			margin-bottom: 45px;
			border-bottom: 1px solid #6f6d6d;
			margin-left: 517px;
			margin-right: 193px;
		}

		p {
			font-size: 30px;
			font-weight: 300;
			color: #6f6d6d;
			line-height: 54px;
			margin-left: 517px;
			margin-right: 193px;
		}

		.tab-1 {
			padding-top: 94px;
			margin-bottom: 74px;

			.tab1-bg {
				height: 550px;
				margin-top: 78px;
				background: url('../../../assets/imgs/home/solution-tab2-bg.png') no-repeat;
				background-size: cover;
			}
		}

		.fk {
			padding-left: 517px;
			padding-right: 192px;
			margin-bottom: 188px;
			margin-top: 72px;

			li {
				height: 380px;
				background: #ffffff;
				box-shadow: 0px 5px 30px 0px rgba(200, 200, 200, 0.5);
				border-radius: 10px;
				margin-bottom: 30px;
				display: flex;
				padding-left: 97px;
				padding-right: 45px;
				position: relative;

				&:before {
					content: '';
					display: block;
					position: absolute;
					left: 0;
					top: 0;
					width: 22px;
					height: 380px;
					background: #2f6eb4;
					border-radius: 10px 0px 0px 10px;
				}

				&:nth-child(2n + 2) {
					&:before {
						background-color: #2d4574;
					}
				}

				img {
					width: 137px;
					height: 134px;
					margin-right: 61px;
					margin-top: 112px;
				}

				.article-title {
					font-size: 32px;
					color: #1e1e1e;
					margin-bottom: 18px;
					font-weight: 500;
				}

				.article {
					color: #6f6d6d;
					font-size: 26px;
					line-height: 42px;
				}
			}
		}
	}

	.detail-3 {
		.title {
			font-size: 36px;
			font-weight: 500;
			color: #1e1e1e;
			padding-bottom: 21px;
			margin-bottom: 45px;
			border-bottom: 1px solid #6f6d6d;
			margin-left: 517px;
			margin-right: 193px;
		}

		p {
			font-size: 30px;
			font-weight: 300;
			color: #6f6d6d;
			line-height: 54px;
			margin-left: 517px;
			margin-right: 193px;
		}

		.tab-1 {
			padding-top: 94px;
			margin-bottom: 74px;
		}

		.szh {
			display: flex;
			flex-direction: row;
			flex-wrap: wrap;
			justify-content: space-between;
			margin: 50px 192px 76px 516px;

			li {
				width: 48%;
				padding: 181px 45px 0 50px;
				box-shadow: 0px 5px 30px 0px rgba(200, 200, 200, 0.5);
				border-radius: 10px;
				background-color: #ffffff;
				position: relative;
				margin-bottom: 28px;

				&:nth-child(1),
				&:nth-child(2) {
					height: 400px;
				}

				&:nth-child(3),
				&:nth-child(4) {
					height: 560px;
					padding-top: 200px;
				}

				&:nth-child(5),
				&:nth-child(6) {
					height: 380px;
				}

				img {
					position: absolute;
					width: 146px;
					height: 146px;
					right: 44px;
					top: 43px;
				}

				.article-title {
					font-size: 32px;
					color: #1e1e1e;
					line-height: 54px;
				}

				.article {
					font-size: 26px;
					color: #6f6d6d;
					line-height: 54px;
				}
			}
		}

		.tab-2 {
			height: 440px;
			background: #2d4574;
			padding-top: 54px;
			margin-bottom: 72px;

			.title {
				color: #ffffff;
				border-bottom: 1px solid #ffffff;
			}

			p {
				color: #ffffff;
			}
		}

		.tab-3 {
			margin-bottom: 82px;
		}

		.tab-4 {
			background: url('../../../assets/imgs/home/solution-tab3-bg.png') no-repeat;
			background-size: cover;

			.zh-bg {
				height: 420px;
				background: url('../../../assets/imgs/home/solution-zh-bg.png') no-repeat;
				background-size: cover;
				margin-bottom: 72px;
			}

			.ls,
			.mt,
			.gc {
				padding-left: 516px;
				padding-right: 192px;

				.article-title {
					font-size: 36px;
					font-weight: 400;
					color: #ffffff;
					line-height: 48px;
					margin-bottom: 16px;
				}

				img {
					margin-bottom: 44px;
				}

				.article {
					font-size: 26px;
					font-weight: 300;
					color: #ffffff;
					line-height: 44px;
				}

				ul {
					display: flex;
					justify-content: space-between;
				}

				p {
					margin: 0;
				}
			}

			.ls {
				.up {
					height: 555px;
					margin: 48px 0;
					background: #2d4574;
					text-align: center;
					box-shadow: 0px 5px 30px 0px rgba(200, 200, 200, 0.5);
					width: 49%;
					border-radius: 10px;
					padding: 50px;

					&:nth-child(2) {
						background: #435f94;
					}
				}
				.down {
					height: 550px;
					margin: 48px 0;
					background: #2d4574;
					text-align: center;
					box-shadow: 0px 5px 30px 0px rgba(200, 200, 200, 0.5);
					width: 32%;
					border-radius: 10px;
					padding: 40px;

					&:nth-child(2) {
						background: #435f94;
					}

					.article {
						text-align: left;
					}
				}
			}

			.mt {
				li {
					height: 764px;
					margin: 48px 0;
					background: #435f94;
					text-align: center;
					box-shadow: 0px 5px 30px 0px rgba(200, 200, 200, 0.5);
					width: 32%;
					border-radius: 10px;
					padding: 40px;

					&:nth-child(2) {
						background: #2d4574;
					}

					.article {
						text-align: left;
					}
				}
			}

			.gc {
				padding-bottom: 186px;

				li {
					height: 750px;
					margin: 48px 0;
					background: #2d4574;
					text-align: center;
					box-shadow: 0px 5px 30px 0px rgba(200, 200, 200, 0.5);
					width: 32%;
					border-radius: 10px;
					padding: 40px;

					&:nth-child(2) {
						background: #435f94;
					}

					.article {
						text-align: left;
					}
				}
			}
		}
	}
}
</style>
