"use strict";

var code = require("./lib/code"),

    selectors = {
        tag   : `"selector"`,
        class : `".selector"`,
        tmpl  : `\`template\``,

        "class + attr" : `".selector[attr]"`
    },

    classes = {
        missing : false,
        empty   : `""`,
        value   : `"class"`,
        tmpl    : `\`class\``
    },

    classnames = {
        missing : false,
        empty   : `""`,
        value   : `"className"`,
        tmpl    : `\`className\``
    },
    
    strings = {
        missing : false,
        value   : `"inner"`
    };

describe("Attributes", () => {
    describe("class vs className", () => {
        var combinations = [];

        Object.keys(selectors).forEach((selectorval) =>
            Object.keys(classes).forEach((classval) =>
                Object.keys(classnames).forEach((classnameval) =>
                    Object.keys(strings).forEach((stringval) => {
                        combinations.push({
                            name      : `selector ${selectorval}, class ${classval}, className ${classnameval}, string ${stringval}`,
                            selector  : selectors[selectorval],
                            class     : classes[classval],
                            classname : classnames[classnameval],
                            string    : strings[stringval]
                        });
                    })
                )
            )
        );

        combinations.forEach((test) => {
            it(test.name, () => {
                var str = "",
                    
                    hasClass     = typeof test.class === "string",
                    hasClassName = typeof test.classname === "string",
                    hasString    = typeof test.string === "string";

                str += `m(${test.selector}`;

                if(hasClass || hasClassName) {
                    str += `, {`;

                    if(hasClass) {
                        str += `class: ${test.class}`;
                    }

                    if(hasClassName) {
                        if(hasClass) {
                            str += `, `;
                        }

                        str += `className: ${test.classname}`;
                    }

                    str += `}`;
                }

                if(hasString) {
                    str += `, ${test.string}`;
                }

                str += `);`;

                expect(code(str)).toMatchSnapshot();
            });
        });
    });
});
