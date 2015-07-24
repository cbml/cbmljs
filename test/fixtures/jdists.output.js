{
  "type": "cbml",
  "nodes": [
    {
      "type": "block",
      "pos": 0,
      "endpos": 112,
      "value": "/*<jdists encoding=\"base64\">*/\nhello world!\n  /*<jdists encoding=\"quoted\">*/\n  123\n  /*</jdists>*/\n/*</jdists>*/",
      "tag": "jdists",
      "language": "c",
      "attrs": {
        "encoding": "base64"
      },
      "line": 1,
      "col": 1,
      "nodes": [
        {
          "type": "text",
          "pos": 30,
          "endpos": 46,
          "value": "\nhello world!\n  ",
          "line": 1,
          "col": 31
        },
        {
          "type": "block",
          "pos": 46,
          "endpos": 98,
          "value": "/*<jdists encoding=\"quoted\">*/\n  123\n  /*</jdists>*/",
          "tag": "jdists",
          "language": "c",
          "attrs": {
            "encoding": "quoted"
          },
          "line": 3,
          "col": 3,
          "nodes": [
            {
              "type": "text",
              "pos": 76,
              "endpos": 85,
              "value": "\n  123\n  ",
              "line": 3,
              "col": 33
            }
          ],
          "content": "\n  123\n  ",
          "prefix": "/*<jdists encoding=\"quoted\">*/",
          "suffix": "/*</jdists>*/"
        },
        {
          "type": "text",
          "pos": 98,
          "endpos": 99,
          "value": "\n",
          "line": 5,
          "col": 16
        }
      ],
      "content": "\nhello world!\n  /*<jdists encoding=\"quoted\">*/\n  123\n  /*</jdists>*/\n",
      "prefix": "/*<jdists encoding=\"base64\">*/",
      "suffix": "/*</jdists>*/"
    }
  ],
  "endpos": 112
}