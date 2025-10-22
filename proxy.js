const ip = 'https://test1-trade.shanghaishulian.com';

const proxyUrl = ip.startsWith('http') ? ip : `http://${ip}:8889/`; // 交易服务
const proxyUrlGrain = ip.startsWith('http') ? ip : `http://${ip}:9090/`; // 粮食服务
const proxyUrlSteels = ip.startsWith('http') ? ip : `http://${ip}:9090/`; // 钢材服务
const proxyUrlUser = ip.startsWith('http') ? ip : `http://${ip}:8089/`; // 用户服务
const proxyUrlStation = ip.startsWith('http') ? ip : `http://${ip}:8093/`; // 物流节点

module.exports = {
	//一般接口请求地址
	'/dg-trade-api/api': {
		target: proxyUrl,
		changeOrigin: true
	},
	//文件相关的代理地址
	'/trade-files': {
		target: proxyUrl,
		changeOrigin: true
	},
	//文件相关的代理地址(粮食/仓储)
	'/grain-files': {
		target: proxyUrl,
		changeOrigin: true
	},
	// 钢材
	'/dg-steel-api': {
		target: proxyUrlSteels,
		changeOrigin: true
	},
	//文件相关的代理地址(钢材)
	'/steel-files': {
		target: proxyUrl,
		changeOrigin: true
	},
	//证书相关下载
	'/static': {
		target: proxyUrl,
		changeOrigin: true
	},
	// 粮食/仓储
	'/dg-grain-api': {
		target: proxyUrlGrain,
		changeOrigin: true
	},
	'/dg-trade-api/soa': {
		target: proxyUrl,
		changeOrigin: true
	},
	// 用户
	'/dg-user-api': {
		target: proxyUrlUser,
		changeOrigin: true
	},
	// 物流节点
	'/dg-station-api': {
		target: proxyUrlStation,
		changeOrigin: true
	},
	//文件相关的代理地址
	'/station-files': {
		target: proxyUrl,
		changeOrigin: true
	},
	'dg-onlyoffice':{
		target: proxyUrl,
		changeOrigin: true
	}
};
