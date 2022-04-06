export default class Cookie {

    setCookie(data) {
        const daysToExpire = new Date(2147483647 * 10000).toUTCString();
        document.cookie = `setting=${data}; expires=${daysToExpire}; path=/`;
    }

    extractValueFromCookie(cookieName) {
        let name = cookieName + "=";
        // Splitting cookie
        let allCookieArray = document.cookie.split(";");
        for (let i = 0; i < allCookieArray.length; i++) {
            let temp = allCookieArray[i].trim();
            if (temp.indexOf(name) === 0)
                return temp.substring(name.length, temp.length);
        }
        // Else return empty string
        return "";
    }

    readCookie(name) {
        let cookie = this.extractValueFromCookie(name);
        if (cookie !== "") {
            return cookie;
        }
    }
}
