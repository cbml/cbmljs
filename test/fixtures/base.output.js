{
  "type": "cbml",
  "nodes": [
    {
      "type": "block",
      "pos": 0,
      "endpos": 58,
      "value": "<!--ok>line1\n/*<jdists>*/line1.2/*</jdists>*/\nline2</ok-->",
      "comment": true,
      "tag": "ok",
      "language": "xml",
      "attrs": {},
      "line": 1,
      "col": 1,
      "nodes": [
        {
          "type": "text",
          "pos": 7,
          "endpos": 13,
          "value": "line1\n",
          "line": 1,
          "col": 8
        },
        {
          "type": "block",
          "pos": 13,
          "endpos": 45,
          "value": "/*<jdists>*/line1.2/*</jdists>*/",
          "tag": "jdists",
          "language": "c",
          "attrs": {},
          "line": 2,
          "col": 1,
          "nodes": [
            {
              "type": "text",
              "pos": 25,
              "endpos": 32,
              "value": "line1.2",
              "line": 2,
              "col": 13
            }
          ],
          "content": "line1.2",
          "prefix": "/*<jdists>*/",
          "suffix": "/*</jdists>*/"
        },
        {
          "type": "text",
          "pos": 45,
          "endpos": 51,
          "value": "\nline2",
          "line": 2,
          "col": 33
        }
      ],
      "content": "line1\n/*<jdists>*/line1.2/*</jdists>*/\nline2",
      "prefix": "<!--ok>",
      "suffix": "</ok-->"
    },
    {
      "type": "text",
      "pos": 58,
      "endpos": 59,
      "value": "\n",
      "line": 3,
      "col": 13
    },
    {
      "type": "single",
      "pos": 59,
      "endpos": 93,
      "value": "/*<jdists import=\"6.js\" line3 />*/",
      "tag": "jdists",
      "language": "c",
      "attrs": {
        "import": "6.js",
        "line3": ""
      },
      "line": 4,
      "col": 1
    },
    {
      "type": "text",
      "pos": 93,
      "endpos": 94,
      "value": "\n",
      "line": 4,
      "col": 35
    },
    {
      "type": "block",
      "pos": 94,
      "endpos": 175,
      "value": "/*<jdists clean id='ttc' import=\"5.js\" line4>*/\nconsole.log(line5);\n/*</jdists>*/",
      "tag": "jdists",
      "language": "c",
      "attrs": {
        "clean": "",
        "id": "ttc",
        "import": "5.js",
        "line4": ""
      },
      "line": 5,
      "col": 1,
      "nodes": [
        {
          "type": "text",
          "pos": 141,
          "endpos": 162,
          "value": "\nconsole.log(line5);\n",
          "line": 5,
          "col": 48
        }
      ],
      "content": "\nconsole.log(line5);\n",
      "prefix": "/*<jdists clean id='ttc' import=\"5.js\" line4>*/",
      "suffix": "/*</jdists>*/"
    },
    {
      "type": "text",
      "pos": 175,
      "endpos": 176,
      "value": "\n",
      "line": 7,
      "col": 14
    },
    {
      "type": "block",
      "pos": 176,
      "endpos": 224,
      "value": "/*<remove line7>\nconsole.log(line8);\n</remove>*/",
      "comment": true,
      "tag": "remove",
      "language": "c",
      "attrs": {
        "line7": ""
      },
      "line": 8,
      "col": 1,
      "nodes": [
        {
          "type": "text",
          "pos": 192,
          "endpos": 213,
          "value": "\nconsole.log(line8);\n",
          "line": 8,
          "col": 17
        }
      ],
      "content": "\nconsole.log(line8);\n",
      "prefix": "/*<remove line7>",
      "suffix": "</remove>*/"
    },
    {
      "type": "text",
      "pos": 224,
      "endpos": 225,
      "value": "\n",
      "line": 10,
      "col": 12
    },
    {
      "type": "block",
      "pos": 225,
      "endpos": 275,
      "value": "(*<delphi line10>\nconsole.log(line11);\n</delphi>*)",
      "comment": true,
      "tag": "delphi",
      "language": "pascal",
      "attrs": {
        "line10": ""
      },
      "line": 11,
      "col": 1,
      "nodes": [
        {
          "type": "text",
          "pos": 242,
          "endpos": 264,
          "value": "\nconsole.log(line11);\n",
          "line": 11,
          "col": 18
        }
      ],
      "content": "\nconsole.log(line11);\n",
      "prefix": "(*<delphi line10>",
      "suffix": "</delphi>*)"
    },
    {
      "type": "text",
      "pos": 275,
      "endpos": 276,
      "value": "\n",
      "line": 13,
      "col": 12
    },
    {
      "type": "block",
      "pos": 276,
      "endpos": 330,
      "value": "(*<delphi line13>*)\nconsole.log(line14);\n(*</delphi>*)",
      "tag": "delphi",
      "language": "pascal",
      "attrs": {
        "line13": ""
      },
      "line": 14,
      "col": 1,
      "nodes": [
        {
          "type": "text",
          "pos": 295,
          "endpos": 317,
          "value": "\nconsole.log(line14);\n",
          "line": 14,
          "col": 20
        }
      ],
      "content": "\nconsole.log(line14);\n",
      "prefix": "(*<delphi line13>*)",
      "suffix": "(*</delphi>*)"
    },
    {
      "type": "text",
      "pos": 330,
      "endpos": 331,
      "value": "\n",
      "line": 16,
      "col": 14
    },
    {
      "type": "block",
      "pos": 331,
      "endpos": 377,
      "value": "'''<release line16>'''\nline14\n'''</release>'''",
      "tag": "release",
      "language": "python",
      "attrs": {
        "line16": ""
      },
      "line": 17,
      "col": 1,
      "nodes": [
        {
          "type": "text",
          "pos": 353,
          "endpos": 361,
          "value": "\nline14\n",
          "line": 17,
          "col": 23
        }
      ],
      "content": "\nline14\n",
      "prefix": "'''<release line16>'''",
      "suffix": "'''</release>'''"
    },
    {
      "type": "text",
      "pos": 377,
      "endpos": 378,
      "value": "\n",
      "line": 19,
      "col": 17
    },
    {
      "type": "block",
      "pos": 378,
      "endpos": 454,
      "value": "'''<release line19>\ntest\n/*<jdists import=\"line21.js\">*/\nline17</release>'''",
      "comment": true,
      "tag": "release",
      "language": "python",
      "attrs": {
        "line19": ""
      },
      "line": 20,
      "col": 1,
      "nodes": [
        {
          "type": "text",
          "pos": 397,
          "endpos": 403,
          "value": "\ntest\n",
          "line": 20,
          "col": 20
        },
        {
          "type": "text",
          "pos": 403,
          "endpos": 441,
          "value": "/*<jdists import=\"line21.js\">*/\nline17",
          "line": 22,
          "col": 1
        }
      ],
      "content": "\ntest\n/*<jdists import=\"line21.js\">*/\nline17",
      "prefix": "'''<release line19>",
      "suffix": "</release>'''"
    },
    {
      "type": "text",
      "pos": 454,
      "endpos": 455,
      "value": "\n",
      "line": 23,
      "col": 20
    },
    {
      "type": "block",
      "pos": 455,
      "endpos": 521,
      "value": "/*<jdists import=\"line23.js\">*/\nconsole.log(line19);\n/*</jdists>*/",
      "tag": "jdists",
      "language": "c",
      "attrs": {
        "import": "line23.js"
      },
      "line": 24,
      "col": 1,
      "nodes": [
        {
          "type": "text",
          "pos": 486,
          "endpos": 508,
          "value": "\nconsole.log(line19);\n",
          "line": 24,
          "col": 32
        }
      ],
      "content": "\nconsole.log(line19);\n",
      "prefix": "/*<jdists import=\"line23.js\">*/",
      "suffix": "/*</jdists>*/"
    },
    {
      "type": "text",
      "pos": 521,
      "endpos": 522,
      "value": "\n",
      "line": 26,
      "col": 14
    },
    {
      "type": "block",
      "pos": 522,
      "endpos": 776,
      "value": "/*<jdists import=\"line26.js\">*/\n  /*<jdists import=\"line27.js\">*/\n    /*<jdists import=\"line28.js\">*/console.log(4);/*</jdists>*/\n    /*<jdists import=\"line29.js\">*/console.log(5);/*</jdists>*/\n    console.log(line30);\n  /*</jdists>*/\nline32/*</jdists>*/",
      "tag": "jdists",
      "language": "c",
      "attrs": {
        "import": "line26.js"
      },
      "line": 27,
      "col": 1,
      "nodes": [
        {
          "type": "text",
          "pos": 553,
          "endpos": 556,
          "value": "\n  ",
          "line": 27,
          "col": 32
        },
        {
          "type": "block",
          "pos": 556,
          "endpos": 756,
          "value": "/*<jdists import=\"line27.js\">*/\n    /*<jdists import=\"line28.js\">*/console.log(4);/*</jdists>*/\n    /*<jdists import=\"line29.js\">*/console.log(5);/*</jdists>*/\n    console.log(line30);\n  /*</jdists>*/",
          "tag": "jdists",
          "language": "c",
          "attrs": {
            "import": "line27.js"
          },
          "line": 28,
          "col": 3,
          "nodes": [
            {
              "type": "text",
              "pos": 587,
              "endpos": 592,
              "value": "\n    ",
              "line": 28,
              "col": 34
            },
            {
              "type": "block",
              "pos": 592,
              "endpos": 651,
              "value": "/*<jdists import=\"line28.js\">*/console.log(4);/*</jdists>*/",
              "tag": "jdists",
              "language": "c",
              "attrs": {
                "import": "line28.js"
              },
              "line": 29,
              "col": 5,
              "nodes": [
                {
                  "type": "text",
                  "pos": 623,
                  "endpos": 638,
                  "value": "console.log(4);",
                  "line": 29,
                  "col": 36
                }
              ],
              "content": "console.log(4);",
              "prefix": "/*<jdists import=\"line28.js\">*/",
              "suffix": "/*</jdists>*/"
            },
            {
              "type": "text",
              "pos": 651,
              "endpos": 656,
              "value": "\n    ",
              "line": 29,
              "col": 64
            },
            {
              "type": "block",
              "pos": 656,
              "endpos": 715,
              "value": "/*<jdists import=\"line29.js\">*/console.log(5);/*</jdists>*/",
              "tag": "jdists",
              "language": "c",
              "attrs": {
                "import": "line29.js"
              },
              "line": 30,
              "col": 5,
              "nodes": [
                {
                  "type": "text",
                  "pos": 687,
                  "endpos": 702,
                  "value": "console.log(5);",
                  "line": 30,
                  "col": 36
                }
              ],
              "content": "console.log(5);",
              "prefix": "/*<jdists import=\"line29.js\">*/",
              "suffix": "/*</jdists>*/"
            },
            {
              "type": "text",
              "pos": 715,
              "endpos": 743,
              "value": "\n    console.log(line30);\n  ",
              "line": 30,
              "col": 64
            }
          ],
          "content": "\n    /*<jdists import=\"line28.js\">*/console.log(4);/*</jdists>*/\n    /*<jdists import=\"line29.js\">*/console.log(5);/*</jdists>*/\n    console.log(line30);\n  ",
          "prefix": "/*<jdists import=\"line27.js\">*/",
          "suffix": "/*</jdists>*/"
        },
        {
          "type": "text",
          "pos": 756,
          "endpos": 763,
          "value": "\nline32",
          "line": 32,
          "col": 16
        }
      ],
      "content": "\n  /*<jdists import=\"line27.js\">*/\n    /*<jdists import=\"line28.js\">*/console.log(4);/*</jdists>*/\n    /*<jdists import=\"line29.js\">*/console.log(5);/*</jdists>*/\n    console.log(line30);\n  /*</jdists>*/\nline32",
      "prefix": "/*<jdists import=\"line26.js\">*/",
      "suffix": "/*</jdists>*/"
    },
    {
      "type": "text",
      "pos": 776,
      "endpos": 784,
      "value": "\nline33\n",
      "line": 33,
      "col": 20
    },
    {
      "type": "block",
      "pos": 784,
      "endpos": 820,
      "value": "--[[<lua>]]\nline35 = {}\n--[[</lua>]]",
      "tag": "lua",
      "language": "lua",
      "attrs": {},
      "line": 35,
      "col": 1,
      "nodes": [
        {
          "type": "text",
          "pos": 795,
          "endpos": 808,
          "value": "\nline35 = {}\n",
          "line": 35,
          "col": 12
        }
      ],
      "content": "\nline35 = {}\n",
      "prefix": "--[[<lua>]]",
      "suffix": "--[[</lua>]]"
    }
  ],
  "endpos": 820
}