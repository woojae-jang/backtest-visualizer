// 238720
// 최초일 : 2016.03.03

const tradingDateList = [
  "20160303",
  "20160304",
  "20160307",
  "20160308",
  "20160309",
  "20160310",
  "20160311",
  "20160314",
  "20160315",
  "20160316",
  "20160317",
  "20160318",
  "20160321",
  "20160322",
  "20160323",
  "20160324",
  "20160325",
  "20160328",
  "20160329",
  "20160330",
  "20160331",
  "20160401",
  "20160404",
  "20160405",
  "20160406",
  "20160407",
  "20160408",
  "20160411",
  "20160412",
  "20160414",
  "20160415",
  "20160418",
  "20160419",
  "20160420",
  "20160421",
  "20160422",
  "20160425",
  "20160426",
  "20160427",
  "20160428",
  "20160429",
  "20160502",
  "20160503",
  "20160504",
  "20160509",
  "20160510",
  "20160511",
  "20160512",
  "20160513",
  "20160516",
  "20160517",
  "20160518",
  "20160519",
  "20160520",
  "20160523",
  "20160524",
  "20160525",
  "20160526",
  "20160527",
  "20160530",
  "20160531",
  "20160601",
  "20160602",
  "20160603",
  "20160607",
  "20160608",
  "20160609",
  "20160610",
  "20160613",
  "20160614",
  "20160615",
  "20160616",
  "20160617",
  "20160620",
  "20160621",
  "20160622",
  "20160623",
  "20160624",
  "20160627",
  "20160628",
  "20160629",
  "20160630",
  "20160701",
  "20160704",
  "20160705",
  "20160706",
  "20160707",
  "20160708",
  "20160711",
  "20160712",
  "20160713",
  "20160714",
  "20160715",
  "20160718",
  "20160719",
  "20160720",
  "20160721",
  "20160722",
  "20160725",
  "20160726",
  "20160727",
  "20160728",
  "20160729",
  "20160801",
  "20160802",
  "20160803",
  "20160804",
  "20160805",
  "20160808",
  "20160809",
  "20160810",
  "20160811",
  "20160812",
  "20160816",
  "20160817",
  "20160818",
  "20160819",
  "20160822",
  "20160823",
  "20160824",
  "20160825",
  "20160826",
  "20160829",
  "20160830",
  "20160831",
  "20160901",
  "20160902",
  "20160905",
  "20160906",
  "20160907",
  "20160908",
  "20160909",
  "20160912",
  "20160913",
  "20160919",
  "20160920",
  "20160921",
  "20160922",
  "20160923",
  "20160926",
  "20160927",
  "20160928",
  "20160929",
  "20160930",
  "20161004",
  "20161005",
  "20161006",
  "20161007",
  "20161010",
  "20161011",
  "20161012",
  "20161013",
  "20161014",
  "20161017",
  "20161018",
  "20161019",
  "20161020",
  "20161021",
  "20161024",
  "20161025",
  "20161026",
  "20161027",
  "20161028",
  "20161031",
  "20161101",
  "20161102",
  "20161103",
  "20161104",
  "20161107",
  "20161108",
  "20161109",
  "20161110",
  "20161111",
  "20161114",
  "20161115",
  "20161116",
  "20161117",
  "20161118",
  "20161121",
  "20161122",
  "20161123",
  "20161124",
  "20161125",
  "20161128",
  "20161129",
  "20161130",
  "20161201",
  "20161202",
  "20161205",
  "20161206",
  "20161207",
  "20161208",
  "20161209",
  "20161212",
  "20161213",
  "20161214",
  "20161215",
  "20161216",
  "20161219",
  "20161220",
  "20161221",
  "20161222",
  "20161223",
  "20161226",
  "20161227",
  "20161228",
  "20161229",
  "20170102",
  "20170103",
  "20170104",
  "20170105",
  "20170106",
  "20170109",
  "20170110",
  "20170111",
  "20170112",
  "20170113",
  "20170116",
  "20170117",
  "20170118",
  "20170119",
  "20170120",
  "20170123",
  "20170124",
  "20170125",
  "20170126",
  "20170131",
  "20170201",
  "20170202",
  "20170203",
  "20170206",
  "20170207",
  "20170208",
  "20170209",
  "20170210",
  "20170213",
  "20170214",
  "20170215",
  "20170216",
  "20170217",
  "20170220",
  "20170221",
  "20170222",
  "20170223",
  "20170224",
  "20170227",
  "20170228",
  "20170302",
  "20170303",
  "20170306",
  "20170307",
  "20170308",
  "20170309",
  "20170310",
  "20170313",
  "20170314",
  "20170315",
  "20170316",
  "20170317",
  "20170320",
  "20170321",
  "20170322",
  "20170323",
  "20170324",
  "20170327",
  "20170328",
  "20170329",
  "20170330",
  "20170331",
  "20170403",
  "20170404",
  "20170405",
  "20170406",
  "20170407",
  "20170410",
  "20170411",
  "20170412",
  "20170413",
  "20170414",
  "20170417",
  "20170418",
  "20170419",
  "20170420",
  "20170421",
  "20170424",
  "20170425",
  "20170426",
  "20170427",
  "20170428",
  "20170502",
  "20170504",
  "20170508",
  "20170510",
  "20170511",
  "20170512",
  "20170515",
  "20170516",
  "20170517",
  "20170518",
  "20170519",
  "20170522",
  "20170523",
  "20170524",
  "20170525",
  "20170526",
  "20170529",
  "20170530",
  "20170531",
  "20170601",
  "20170602",
  "20170605",
  "20170607",
  "20170608",
  "20170609",
  "20170612",
  "20170613",
  "20170614",
  "20170615",
  "20170616",
  "20170619",
  "20170620",
  "20170621",
  "20170622",
  "20170623",
  "20170626",
  "20170627",
  "20170628",
  "20170629",
  "20170630",
  "20170703",
  "20170704",
  "20170705",
  "20170706",
  "20170707",
  "20170710",
  "20170711",
  "20170712",
  "20170713",
  "20170714",
  "20170717",
  "20170718",
  "20170719",
  "20170720",
  "20170721",
  "20170724",
  "20170725",
  "20170726",
  "20170727",
  "20170728",
  "20170731",
  "20170801",
  "20170802",
  "20170803",
  "20170804",
  "20170807",
  "20170808",
  "20170809",
  "20170810",
  "20170811",
  "20170814",
  "20170816",
  "20170817",
  "20170818",
  "20170821",
  "20170822",
  "20170823",
  "20170824",
  "20170825",
  "20170828",
  "20170829",
  "20170830",
  "20170831",
  "20170901",
  "20170904",
  "20170905",
  "20170906",
  "20170907",
  "20170908",
  "20170911",
  "20170912",
  "20170913",
  "20170914",
  "20170915",
  "20170918",
  "20170919",
  "20170920",
  "20170921",
  "20170922",
  "20170925",
  "20170926",
  "20170927",
  "20170928",
  "20170929",
  "20171010",
  "20171011",
  "20171012",
  "20171013",
  "20171016",
  "20171017",
  "20171018",
  "20171019",
  "20171020",
  "20171023",
  "20171024",
  "20171025",
  "20171026",
  "20171027",
  "20171030",
  "20171031",
  "20171101",
  "20171102",
  "20171103",
  "20171106",
  "20171107",
  "20171108",
  "20171109",
  "20171110",
  "20171113",
  "20171114",
  "20171115",
  "20171116",
  "20171117",
  "20171120",
  "20171121",
  "20171122",
  "20171123",
  "20171124",
  "20171127",
  "20171128",
  "20171129",
  "20171130",
  "20171201",
  "20171204",
  "20171205",
  "20171206",
  "20171207",
  "20171208",
  "20171211",
  "20171212",
  "20171213",
  "20171214",
  "20171215",
  "20171218",
  "20171219",
  "20171220",
  "20171221",
  "20171222",
  "20171226",
  "20171227",
  "20171228",
  "20180102",
  "20180103",
  "20180104",
  "20180105",
  "20180108",
  "20180109",
  "20180110",
  "20180111",
  "20180112",
  "20180115",
  "20180116",
  "20180117",
  "20180118",
  "20180119",
  "20180122",
  "20180123",
  "20180124",
  "20180125",
  "20180126",
  "20180129",
  "20180130",
  "20180131",
  "20180201",
  "20180202",
  "20180205",
  "20180206",
  "20180207",
  "20180208",
  "20180209",
  "20180212",
  "20180213",
  "20180214",
  "20180219",
  "20180220",
  "20180221",
  "20180222",
  "20180223",
  "20180226",
  "20180227",
  "20180228",
  "20180302",
  "20180305",
  "20180306",
  "20180307",
  "20180308",
  "20180309",
  "20180312",
  "20180313",
  "20180314",
  "20180315",
  "20180316",
  "20180319",
  "20180320",
  "20180321",
  "20180322",
  "20180323",
  "20180326",
  "20180327",
  "20180328",
  "20180329",
  "20180330",
  "20180402",
  "20180403",
  "20180404",
  "20180405",
  "20180406",
  "20180409",
  "20180410",
  "20180411",
  "20180412",
  "20180413",
  "20180416",
  "20180417",
  "20180418",
  "20180419",
  "20180420",
  "20180423",
  "20180424",
  "20180425",
  "20180426",
  "20180427",
  "20180430",
  "20180502",
  "20180503",
  "20180504",
  "20180508",
  "20180509",
  "20180510",
  "20180511",
  "20180514",
  "20180515",
  "20180516",
  "20180517",
  "20180518",
  "20180521",
  "20180523",
  "20180524",
  "20180525",
  "20180528",
  "20180529",
  "20180530",
  "20180531",
  "20180601",
  "20180604",
  "20180605",
  "20180607",
  "20180608",
  "20180611",
  "20180612",
  "20180614",
  "20180615",
  "20180618",
  "20180619",
  "20180620",
  "20180621",
  "20180622",
  "20180625",
  "20180626",
  "20180627",
  "20180628",
  "20180629",
  "20180702",
  "20180703",
  "20180704",
  "20180705",
  "20180706",
  "20180709",
  "20180710",
  "20180711",
  "20180712",
  "20180713",
  "20180716",
  "20180717",
  "20180718",
  "20180719",
  "20180720",
  "20180723",
  "20180724",
  "20180725",
  "20180726",
  "20180727",
  "20180730",
  "20180731",
  "20180801",
  "20180802",
  "20180803",
  "20180806",
  "20180807",
  "20180808",
  "20180809",
  "20180810",
  "20180813",
  "20180814",
  "20180816",
  "20180817",
  "20180820",
  "20180821",
  "20180822",
  "20180823",
  "20180824",
  "20180827",
  "20180828",
  "20180829",
  "20180830",
  "20180831",
  "20180903",
  "20180904",
  "20180905",
  "20180906",
  "20180907",
  "20180910",
  "20180911",
  "20180912",
  "20180913",
  "20180914",
  "20180917",
  "20180918",
  "20180919",
  "20180920",
  "20180921",
  "20180927",
  "20180928",
  "20181001",
  "20181002",
  "20181004",
  "20181005",
  "20181008",
  "20181010",
  "20181011",
  "20181012",
  "20181015",
  "20181016",
  "20181017",
  "20181018",
  "20181019",
  "20181022",
  "20181023",
  "20181024",
  "20181025",
  "20181026",
  "20181029",
  "20181030",
  "20181031",
  "20181101",
  "20181102",
  "20181105",
  "20181106",
  "20181107",
  "20181108",
  "20181109",
  "20181112",
  "20181113",
  "20181114",
  "20181115",
  "20181116",
  "20181119",
  "20181120",
  "20181121",
  "20181122",
  "20181123",
  "20181126",
  "20181127",
  "20181128",
  "20181129",
  "20181130",
  "20181203",
  "20181204",
  "20181205",
  "20181206",
  "20181207",
  "20181210",
  "20181211",
  "20181212",
  "20181213",
  "20181214",
  "20181217",
  "20181218",
  "20181219",
  "20181220",
  "20181221",
  "20181224",
  "20181226",
  "20181227",
  "20181228",
  "20190102",
  "20190103",
  "20190104",
  "20190107",
  "20190108",
  "20190109",
  "20190110",
  "20190111",
  "20190114",
  "20190115",
  "20190116",
  "20190117",
  "20190118",
  "20190121",
  "20190122",
  "20190123",
  "20190124",
  "20190125",
  "20190128",
  "20190129",
  "20190130",
  "20190131",
  "20190201",
  "20190207",
  "20190208",
  "20190211",
  "20190212",
  "20190213",
  "20190214",
  "20190215",
  "20190218",
  "20190219",
  "20190220",
  "20190221",
  "20190222",
  "20190225",
  "20190226",
  "20190227",
  "20190228",
  "20190304",
  "20190305",
  "20190306",
  "20190307",
  "20190308",
  "20190311",
  "20190312",
  "20190313",
  "20190314",
  "20190315",
  "20190318",
  "20190319",
  "20190320",
  "20190321",
  "20190322",
  "20190325",
  "20190326",
  "20190327",
  "20190328",
  "20190329",
  "20190401",
  "20190402",
  "20190403",
  "20190404",
  "20190405",
  "20190408",
  "20190409",
  "20190410",
  "20190411",
  "20190412",
  "20190415",
  "20190416",
  "20190417",
  "20190418",
  "20190419",
  "20190422",
  "20190423",
  "20190424",
  "20190425",
  "20190426",
"20190429",
"20190430",
"20190502",
"20190503",
"20190507",
"20190508",
"20190509",
"20190510",
"20190513",
"20190514",
"20190515",
"20190516",
];

const holiyDayList = [
  42434, // 20160305
  42435,
  42441,
  42442,
  42448,
  42449,
  42455,
  42456,
  42462,
  42463,
  42469,
  42470,
  42473,
  42476,
  42477,
  42483,
  42484,
  42490,
  42491,
  42495,
  42496,
  42497,
  42498,
  42504,
  42505,
  42511,
  42512,
  42518,
  42519,
  42525,
  42526,
  42527,
  42532,
  42533,
  42539,
  42540,
  42546,
  42547,
  42553,
  42554,
  42560,
  42561,
  42567,
  42568,
  42574,
  42575,
  42581,
  42582,
  42588,
  42589,
  42595,
  42596,
  42597,
  42602,
  42603,
  42609,
  42610,
  42616,
  42617,
  42623,
  42624,
  42627,
  42628,
  42629,
  42630,
  42631,
  42637,
  42638,
  42644,
  42645,
  42646,
  42651,
  42652,
  42658,
  42659,
  42665,
  42666,
  42672,
  42673,
  42679,
  42680,
  42686,
  42687,
  42693,
  42694,
  42700,
  42701,
  42707,
  42708,
  42714,
  42715,
  42721,
  42722,
  42728,
  42729,
  42734,
  42735,
  42736,
  42742,
  42743,
  42749,
  42750,
  42756,
  42757,
  42762,
  42763,
  42764,
  42765,
  42770,
  42771,
  42777,
  42778,
  42784,
  42785,
  42791,
  42792,
  42795,
  42798,
  42799,
  42805,
  42806,
  42812,
  42813,
  42819,
  42820,
  42826,
  42827,
  42833,
  42834,
  42840,
  42841,
  42847,
  42848,
  42854,
  42855,
  42856,
  42858,
  42860,
  42861,
  42862,
  42864,
  42868,
  42869,
  42875,
  42876,
  42882,
  42883,
  42889,
  42890,
  42892,
  42896,
  42897,
  42903,
  42904,
  42910,
  42911,
  42917,
  42918,
  42924,
  42925,
  42931,
  42932,
  42938,
  42939,
  42945,
  42946,
  42952,
  42953,
  42959,
  42960,
  42962,
  42966,
  42967,
  42973,
  42974,
  42980,
  42981,
  42987,
  42988,
  42994,
  42995,
  43001,
  43002,
  43008,
  43009,
  43010,
  43011,
  43012,
  43013,
  43014,
  43015,
  43016,
  43017,
  43022,
  43023,
  43029,
  43030,
  43036,
  43037,
  43043,
  43044,
  43050,
  43051,
  43057,
  43058,
  43064,
  43065,
  43071,
  43072,
  43078,
  43079,
  43085,
  43086,
  43092,
  43093,
  43094,
  43098,
  43099,
  43100,
  43101,
  43106,
  43107,
  43113,
  43114,
  43120,
  43121,
  43127,
  43128,
  43134,
  43135,
  43141,
  43142,
  43146,
  43147,
  43148,
  43149,
  43155,
  43156,
  43160,
  43162,
  43163,
  43169,
  43170,
  43176,
  43177,
  43183,
  43184,
  43190,
  43191,
  43197,
  43198,
  43204,
  43205,
  43211,
  43212,
  43218,
  43219,
  43221,
  43225,
  43226,
  43227,
  43232,
  43233,
  43239,
  43240,
  43242,
  43246,
  43247,
  43253,
  43254,
  43257,
  43260,
  43261,
  43264,
  43267,
  43268,
  43274,
  43275,
  43281,
  43282,
  43288,
  43289,
  43295,
  43296,
  43302,
  43303,
  43309,
  43310,
  43316,
  43317,
  43323,
  43324,
  43327,
  43330,
  43331,
  43337,
  43338,
  43344,
  43345,
  43351,
  43352,
  43358,
  43359,
  43365,
  43366,
  43367,
  43368,
  43369,
  43372,
  43373,
  43376,
  43379,
  43380,
  43382,
  43386,
  43387,
  43393,
  43394,
  43400,
  43401,
  43407,
  43408,
  43414,
  43415,
  43421,
  43422,
  43428,
  43429,
  43435,
  43436,
  43442,
  43443,
  43449,
  43450,
  43456,
  43457,
  43459,
  43463,
  43464,
  43465,
  43466,
  43470,
  43471,
  43477,
  43478,
  43484,
  43485,
  43491,
  43492,
  43498,
  43499,
  43500,
  43501,
  43502,
  43505,
  43506,
  43512,
  43513,
  43519,
  43520,
  43525,
  43526,
  43527,
  43533,
  43534,
  43540,
  43541,
  43547,
  43548,
  43554,
  43555
];

const codeList = [
  "069500",
  "232080",
  "143850",
  "195930",
  "238720",
  "192090",
  "148070",
  "136340",
  "182490",
  "132030",
  "130680",
  "114800",
  "138230",
  "139660",
  "130730",
  "WORLD_STOCK"
];

const nameList = [
  "KODEX200",
  "TIGER코스닥150",
  "TIGER미국S&P500선물(H)",
  "TIGER유로스탁스50(합성H)",
  "KINDEX일본Nikkei225(H)",
  "TIGER차이나CSI300",
  "KOSEF국고채10년",
  "KBSTAR중기우량회사채",
  "TIGER단기선진하이일드(합성H)",
  "KODEX골드선물(H)",
  "TIGER원유선물Enhanced(H)",
  "KODEX인버스",
  "KOSEF미국달러선물",
  "KOSEF미국달러선물인버스",
  "KOSEF단기자금",
  "세계종합주가지수"
];

const shortNameList = [
  "코스피",
  "코스닥",
  "S&P500",
  "유로스탁스",
  "Nikkei225",
  "CSI300",
  "국고채10년",
  "중기회사채",
  "하이일드",
  "골드",
  "원유",
  "인버스",
  "달러",
  "달러인버스",
  "단기자금",
  "세계주가지수"
];

const getAssetName = code => {
  const idx = codeList.indexOf(code);
  return nameList[idx];
};

const getAssetShortName = code => {
  const idx = codeList.indexOf(code);
  return shortNameList[idx];
};

export {
  tradingDateList,
  codeList as assetCodeList,
  nameList as assetNameList,
  shortNameList as assetShortNameList,
  getAssetName,
  getAssetShortName
};