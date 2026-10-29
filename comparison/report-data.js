import {area,massArea} from './layouts.js?v=4';
export const MODEL_STOREY_HEIGHT=3.65;
export const REPORT_DATE='2026-10-29';
export const schemeNarratives=[
 {letter:'A',name:'围合街坊',position:'集中到达、围合成院的城市公共界面',shortAdvantage:'主轴清晰，沿街与院落界面集中',shortRisk:'院落环境、入口疏散与廊下管理',
  concept:'以转角主楼、南侧公共翼楼、斜向会客翼及东翼围合中央大院。南侧留出入口主轴，沿街柱廊形成连续的到达体验。',
  architecture:'主区采用围合翼楼和转角组合；北区由纵向翼楼与分开的门厅组织院落，东区改为迎宾院落。',plots:'内部地块按围合街坊、北部院落和东部迎宾空间重新组织，外围参考用地边界不变。',traffic:'外围服务车行与中央步行主轴分开表达；院内以步行到达、集散及停留为主。',landscape:'中央大院以铺装、秩序树阵与局部种植形成明确空间边界，强调入口和公共形象。',
  advantage:'适合强调主入口识别、集中接待和院落秩序的汇报方向。',risk:'需深化院落日照与通风、入口集散疏散、柱廊使用和公共界面管理；本轮未完成专项验证。',scenario:'优先考虑集中接待、公共展示和统一沿街形象时。',next:'核定功能任务书与建筑规模，重点深化南入口、围合院落环境及服务交通。',roof:'常规屋面与设备区示意',retreat:'本轮未设置楼层退台',openness:'中央大院集中组织',mobility:'外围服务车行 + 中央步行主轴'},
 {letter:'B',name:'庭院共享园区',position:'保留原有建筑关系，以共享庭院串联使用',shortAdvantage:'延续原图，建筑与庭院关系稳健',shortRisk:'CAD 配准、连接裙房与界面细节',
  concept:'保留已讨论的建筑落位和体量组合，通过树荫庭院、连续步行联系与休憩节点组织室外使用。作为本轮保留基准。',
  architecture:'保留西侧主楼、南侧主楼、连接裙房、东侧主楼及北部条状建筑组合。',plots:'维持上一版的内部地块与庭院组织，以局部细化为主，不做总图重构。',traffic:'延续现有外围服务路线和庭院步行联系，后续仍需结合任务书校核到达与服务组织。',landscape:'庭院种植、树荫停留与休憩设施共同形成室内外联系，软硬空间相对均衡。',
  advantage:'适合希望延续原图关系、稳步深化并突出日常使用体验的讨论方向。',risk:'需取得 CAD 后核定建筑轮廓与用地边界；连接裙房、入口、停车及设施需统一深化。',scenario:'优先考虑保留原有布局、共享使用及渐进深化时。',next:'以此为基准核定功能和规模，完成图纸配准及庭院、入口、建筑细节设计。',roof:'保留原有屋面表达',retreat:'本轮未设置楼层退台',openness:'多处共享庭院串联',mobility:'延续外围车行 + 庭院步行'},
 {letter:'C',name:'公园聚落',position:'分散退台体量，让连续公园贯穿园区',shortAdvantage:'体量分散，公园与步行空间贯通',shortRisk:'规模平衡、全天候联系与运营维护',
  concept:'以小体量退台建筑、花园组团和展示 / 服务亭围绕连续公园组织。外围承担车行服务，内部以步行联系与景观体验为主。',
  architecture:'主区采用分散建筑和局部退台；北区改为两个花园式组团，东区以小型亭式建筑组织。',plots:'内部地块拆分为较小的建筑与铺装单元，连续绿地连接组团，外围参考用地边界不变。',traffic:'服务车行位于外围；公园步道重新串联各组团，须进一步深化无障碍、遮雨及服务联系。',landscape:'以连续种植、公园步道和屋面绿化意向强化坡地至园区的联系；不代表已验证雨洪或生态性能。',
  advantage:'适合强调分散体量、步行体验和生态形象的汇报方向。',risk:'当前规模指数低于 B，需确认任务书承载；分散运营、全天候步行、屋面结构防水及排水维护均需专项深化。',scenario:'优先考虑公园体验、分散组团和自然景观形象时。',next:'先平衡功能与规模，再深化组团联系、屋面绿化和运维策略。',roof:'种植屋面意向，结构 / 排水待核',retreat:'三座主楼局部退台：3F / 4F 线性内收约 5.5% / 11%',openness:'连续公园 + 分散停留节点',mobility:'外围服务车行 + 公园步行网络'}
];
export function deriveReportMetrics(specs,baseline){const base=baseline.reduce((s,b)=>s+area(b.pts),0),own=specs.reduce((s,b)=>s+area(b.pts),0),sizes=specs.map(s=>s.floors),index=Math.round(massArea(specs)/massArea(baseline)*100),countByFloor={};specs.forEach(b=>countByFloor[b.floors]=(countByFloor[b.floors]||0)+1);return {volumeCount:specs.length,sizeIndex:index,sizeDelta:index-100,footprintIndex:Math.round(own/base*100),minFloors:Math.min(...sizes),maxFloors:Math.max(...sizes),floorRange:Math.min(...sizes)+'–'+Math.max(...sizes)+' F',floorMix:Object.keys(countByFloor).sort((a,b)=>+a-+b).map(f=>f+'F × '+countByFloor[f]).join('；'),storeyHeight:MODEL_STOREY_HEIGHT,terracedVolumes:specs.filter(b=>b.upperInset).length,greenRoofIntentVolumes:specs.filter(b=>b.greenRoof).length};}
export function buildComparisonRows(metrics,parcelCount=3){return [
 {label:'建筑体量单元',kind:'模型统计',values:metrics.map(m=>m.volumeCount+' 组')},
 {label:'示意层数范围',kind:'模型设定',values:metrics.map(m=>m.floorRange)},
 {label:'层数组成',kind:'模型统计',values:metrics.map(m=>m.floorMix)},
 {label:'建筑规模指数',kind:'模型计算',values:metrics.map(m=>m.sizeIndex+'（B=100）')},
 {label:'相对 B 的规模变化',kind:'模型计算',values:metrics.map(m=>m.sizeDelta===0?'保留基准':(m.sizeDelta>0?'+':'')+m.sizeDelta+'%')},
 {label:'基底轮廓累计指数',kind:'模型计算',values:metrics.map(m=>m.footprintIndex+'（B=100）')},
 {label:'示意层高',kind:'模型设定',values:metrics.map(m=>m.storeyHeight.toFixed(2)+' m / 层')},
 {label:'参考用地分区',kind:'参考底盘',values:metrics.map(()=>parcelCount+' 处，外部范围保持一致')},
 {label:'建筑组织',kind:'设计意向',values:schemeNarratives.map(n=>n.architecture)},
 {label:'开放空间结构',kind:'设计意向',values:schemeNarratives.map(n=>n.openness)},
 {label:'交通组织',kind:'设计意向',values:schemeNarratives.map(n=>n.mobility)},
 {label:'退台表达',kind:'模型 / 意向',values:schemeNarratives.map(n=>n.retreat)},
 {label:'屋面策略',kind:'设计意向',values:schemeNarratives.map(n=>n.roof)},
 {label:'计容面积 / 容积率',kind:'待核定',values:metrics.map(()=>'待 CAD、任务书及计量口径核定')},
 {label:'绿地率 / 停车位数',kind:'待核定',values:metrics.map(()=>'未统计，不作为本轮定选指标')},
 {label:'造价 / 工期 / 环境性能',kind:'未测算',values:metrics.map(()=>'未进行概算、施工周期或专项模拟')}
];}
export const metricMethod='建筑规模指数＝各体量逐层轮廓面积累加后，以 B=100 归一化；C 计入楼层退台。基底指数＝各体量首层轮廓面积累加后归一化。连接部位未做面积去重，屋面设施不计入该指数。两项均为概念模型相对值，不是计容建筑面积、建筑密度或报批指标。';
export const reviewPosition='本轮建议：以 B 为保留基准，A 与 C 作为总图替代方向。若优先强调集中到达与围合形象，可深化 A；若优先强调公园体验与分散体量，可深化 C。正式定选前，先统一功能任务书、建筑规模、规划约束和概算口径。';
