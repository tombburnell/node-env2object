'use strict';

module.exports = {
    env2obj: env2obj
};

function env2obj(object, opts) {
    var PREFIX = opts.prefix || "CONF_";
    var delim = opts.delim || "__";
    Object.keys(process.env).forEach(key => {
        if (key.indexOf(PREFIX) === 0) {
            var tmp = object;
            key.slice(PREFIX.length).split(delim).forEach((prop, i, all) => {
                if ((i + 1) < all.length) {
                    tmp = tmp[prop] || (tmp[prop] = {});
                } else {
                    var value = process.env[key];
                    // either the initial object is an Array
                    // or the string contains a,b,b but not a\,b\,c *
                    // * to allow use of comma in single value
                    if (tmp[prop] instanceof Array || /[^\\],/.test(value)) {
                        tmp[prop] = value.split(/\s*,\s*/);
                    } else {
                        // in other cases drop the possible \ before ,
                        tmp[prop] = value.replace(/[^\\],/g, ',');
                    }
                }
            });
        }
    });
}
