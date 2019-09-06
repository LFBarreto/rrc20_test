export default function (str) {
    if (str.length > 30) {
        return str.substr(0, 10) + '...' + str.substr(str.length-10, str.length);
    }
    return str;
}