export default class DateFormat {
    /**
     * 
     * @param {Date} date 
     * @param {Boolean} zero 是否補零
     * @returns 
     */
    localDate(date, zero) {
        let TWDate = null;
        if (zero) {
            TWDate =
                date.getFullYear() +
                "/" +
                this.checkTime(date.getMonth() + 1) +
                "/" +
                this.checkTime(date.getDate());
        } else {
            TWDate =
                date.getFullYear() +
                "/" +
                (date.getMonth() + 1) +
                "/" +
                date.getDate();
        }

        return TWDate;
    }

    /**
     * TW date to ISO format date
     * @param Date date 本土日期 
     */
    localtoISOdate(date) {
        return date.split("/").join("-");
    }

    /**
     * 
     * @param Date date 日期
     * @param String  formatString 時間格式
     * @returns 
     */
    timeFormat(date, formatString) {
        let stringArr = formatString.split(":");
        let time = [];
        stringArr.forEach(string => {
            switch (string) {
                case "h":
                    time.push(this.checkTime(date.getHours()));
                    break;
                case "i":
                    time.push(this.checkTime(date.getMinutes()));
                    break;
                case "s":
                    time.push(this.checkTime(date.getSeconds()));
                    break;
            }
        });
        return time.join(":");
    }

    checkTime(time) {
        if (time < 10) {
            time = "0" + time;
        }
        return time;
    }

}

