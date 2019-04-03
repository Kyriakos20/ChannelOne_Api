module.exports = {
    initialize:function(api, next){
        api.helpers = {
            convertUnixTimestamp:function(timestamp, format){
                var moment = require('moment');
                var m = moment.unix(timestamp);

                if(format)
                {
                    return m.format(format);
                } else {
                    return m.format();
                }
            },
            formatPhone:function (number) {
                var n = number.replace(/\D/g,"");
                n = n.replace("+","");
                n = n.replace(" ", "");
                return n.replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3');
            },
            removeCounty:function (c) {
                return c.replace(' County','').trim();
            },
            fixCountyArray:function (arr) {
                var that = this;
                ret = [];
                for(var i = 0; i<arr.length;i++)
                {
                    ret.push(that.removeCounty(arr[i]));
                }
                return ret;
            },
            fixAddressForZillow: function (prop) {
                return (prop.address.street1+"-"+prop.address.city+"-"+prop.address.state+"-"+prop.address.zip).split(" ").join("-");
            },
            stripTextToNum: function (txt) {
                return parseFloat(txt.replace(/,|\$/, ""));
            }
        };
        next();
    }
};