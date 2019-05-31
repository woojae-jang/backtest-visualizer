// 국내주식                             40 - 10
// 069500	KODEX200 					           40 - 0
// 232080	TIGER코스닥150				        20 - 0
// 해외주식                             40 - 10
// 143850	TIGER미국S&P500선물(H)		    20 - 0
// 195930	TIGER유로스탁스50(합성H)	     20 - 0
// 238720	KINDEX일본Nikkei225(H)	      20 - 0
// 192090	TIGER차이나CSI300			        20 - 0
// 국내채권, 해외채권                    60-20
// 148070	KOSEF국고채10년				        50 - 0
// 136340	KBSTAR중기우량회사채		       40 - 0
// 182490	TIGER단기선진하이일드(합성H)	 40 - 5
// 원자재                               20 - 5
// 132030	KODEX골드선물(H)			        15 - 0
// 130680	TIGER원유선물Enhanced(H)	    15 - 0
// 리스크 관리 수단
// Inverse	                           20 - 0
// 114800	KODEX인버스				            20 - 0
// FX	                                 20 - 0
// 138230	KOSEF미국달러선물			        20 - 0
// 139660	KOSEF미국달러선물인버스	    	20 - 0
// 현금	                               50 - 1
// 130730	KOSEF단기자금				         49 - 0
// 현금								                 50 - 1

import * as d3 from "d3";
import * as moment from "moment";
import TradingDate from "utils/TradingDate";
import { tradingDateList as dateList } from "utils/data";

let firstDateOfMonth = [];

const parseFirstDateOfMonthFromDateList = (
  dateList,
  baseYearMonth = "201602"
) => {
  let preYearMonth = baseYearMonth;
  const array = [];
  dateList.forEach(date => {
    let yearMonth = date.slice(0, 6);
    if (yearMonth > preYearMonth) {
      array.push(date);
      preYearMonth = yearMonth;
    }
  });
  return array;
};

const firstMonday = "20160104";
const firstFriday = "20160108";

const getFirstDateOfWeekInRange = (
  startDate = "20160101",
  endDate = "20191231",
  dayOfWeek = true // true: first(usually monday), false(usually friday)
) => {
  let date = null;
  if (dayOfWeek) {
    date = firstMonday;
  } else {
    date = firstFriday;
  }

  const dateMoment = moment(date, "YYYYMMDD");
  const dateList = [];

  let i = 0;
  while (true) {
    const tmpDate = dateMoment.add(7, "days").format("YYYYMMDD");
    if (tmpDate > endDate) break;

    dateList.push(TradingDate.magnet(tmpDate, true));
    i += 1;
  }

  const nonDupulicatedDateList = new Set(dateList);
  return [...nonDupulicatedDateList];
};

const firtDateOfWeek = getFirstDateOfWeekInRange();

firstDateOfMonth = parseFirstDateOfMonthFromDateList(dateList);

// d3.csv("/dateList.csv").then(data => {
//   dateList = parseDateListFromCSVData(data);
//   firstDateOfMonth = parseFirstDateOfMonthFromDateList(dateList);
// });

const parseDateListFromCSVData = data => {
  const rows = data;
  const array = [];
  rows.forEach(row => {
    const date = Object.values(row)[0];
    array.push(date);
  });
  return array;
};

export { dateList, firstDateOfMonth, firtDateOfWeek };
