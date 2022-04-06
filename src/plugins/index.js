import x2js from 'x2js';


const x2j = (data) => {
    const x2j = new x2js();
    data = x2j.xml2js(data)
    return data;
}

export {
    x2j,
}