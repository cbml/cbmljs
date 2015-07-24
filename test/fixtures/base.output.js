{
  "type": "cbml",
  "nodes": [
    {
      "type": "block",
      "pos": 0,
      "endpos": 58,
      "value": "<!--ok>line1\n</ok-->",
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
          "type": "text",
          "pos": 13,
          "endpos": 808,
          "value": "/*<jdists>*/line1.2\nline2/*<jdists clean id='ttc' import=\"5.js\" line4>*/\nconsole.log(line5);\n\n(*<delphi line13>*)\nconsole.log(line14);\n\n'''<release line16>'''\nline14\n\n/*<jdists import=\"line21.js\">*/\nline17/*<jdists import=\"line23.js\">*/\nconsole.log(line19);\n\n/*<jdists import=\"line26.js\">*/\n  /*<jdists import=\"line27.js\">*/\n    /*<jdists import=\"line28.js\">*/console.log(4);\n    /*<jdists import=\"line29.js\">*/console.log(5);\n    console.log(line30);\n  \nline32\nline33\n--[[<lua>]]\nline35 = {}\n",
          "line": 2,
          "col": 1
        }
      ],
      "content": "line1\n/*<jdists>*/line1.2\nline2",
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
      "type": "text",
      "pos": 94,
      "endpos": 808,
      "value": "/*<jdists clean id='ttc' import=\"5.js\" line4>*/\nconsole.log(line5);\n\n(*<delphi line13>*)\nconsole.log(line14);\n\n'''<release line16>'''\nline14\n\n/*<jdists import=\"line21.js\">*/\nline17/*<jdists import=\"line23.js\">*/\nconsole.log(line19);\n\n/*<jdists import=\"line26.js\">*/\n  /*<jdists import=\"line27.js\">*/\n    /*<jdists import=\"line28.js\">*/console.log(4);\n    /*<jdists import=\"line29.js\">*/console.log(5);\n    console.log(line30);\n  \nline32\nline33\n--[[<lua>]]\nline35 = {}\n",
      "line": 5,
      "col": 1
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
      "type": "text",
      "pos": 276,
      "endpos": 808,
      "value": "(*<delphi line13>*)\nconsole.log(line14);\n\n'''<release line16>'''\nline14\n\n/*<jdists import=\"line21.js\">*/\nline17/*<jdists import=\"line23.js\">*/\nconsole.log(line19);\n\n/*<jdists import=\"line26.js\">*/\n  /*<jdists import=\"line27.js\">*/\n    /*<jdists import=\"line28.js\">*/console.log(4);\n    /*<jdists import=\"line29.js\">*/console.log(5);\n    console.log(line30);\n  \nline32\nline33\n--[[<lua>]]\nline35 = {}\n",
      "line": 14,
      "col": 1
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
      "type": "text",
      "pos": 455,
      "endpos": 808,
      "value": "/*<jdists import=\"line23.js\">*/\nconsole.log(line19);\n\n/*<jdists import=\"line26.js\">*/\n  /*<jdists import=\"line27.js\">*/\n    /*<jdists import=\"line28.js\">*/console.log(4);\n    /*<jdists import=\"line29.js\">*/console.log(5);\n    console.log(line30);\n  \nline32\nline33\n--[[<lua>]]\nline35 = {}\n",
      "line": 24,
      "col": 1
    }
  ],
  "endpos": 808
}