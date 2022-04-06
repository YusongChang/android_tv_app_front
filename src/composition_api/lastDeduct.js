import { DateFormat } from './';

export function lastDeduct(timeData, courseSeq) {
    let timeArr = [];
    let lastTime = null;
    if (Array.from(timeData).length > 0) {
        timeData.forEach(dateObj => {
            if (courseSeq === dateObj.VCCourseq) { // 取出相同選課序之紀錄
                let vDate = dateObj.VDate;
                let vTime = dateObj.VTime;
                let vSubPoint = dateObj.VSubPoint;
                let ISOdateTime = null;
                let time = null;
                if (parseInt(vSubPoint)) { // 只取有扣點的紀錄
                    ISOdateTime = DateFormat.localtoISOdate(vDate) + " " + vTime;
                    time = new Date(ISOdateTime).getTime();
                    timeArr.push(time);
                }
            }
        });
        timeArr.sort(); // 氣泡排序

        if (timeArr.length) // 有扣點紀錄
            lastTime = timeArr[timeArr.length - 1]; // 取最後一個
        else lastTime = 0;

    } else {
        if (courseSeq === timeData.VCCourseq) { // 取出相同選課序之紀錄
            let ISOdateTime = DateFormat.localtoISOdate(timeData.VDate) + " " + timeData.VTime
            lastTime = new Date(ISOdateTime).getTime();
        }else lastTime = 0;

        // console.log(lastTime);
    }

    return lastTime;
}