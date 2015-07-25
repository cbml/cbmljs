{
  "type": "cbml",
  "nodes": [
    {
      "type": "block",
      "pos": 0,
      "endpos": 102,
      "value": "<!--relpace encoding=\"quoted\">\nline3\n/*<jdists encoding=\"base64\">\nline4\n</jdists>*/\nline2\n</relpace-->",
      "comment": true,
      "tag": "relpace",
      "language": "xml",
      "attrs": {
        "encoding": "quoted"
      },
      "line": 1,
      "col": 1,
      "nodes": [
        {
          "type": "text",
          "pos": 30,
          "endpos": 37,
          "value": "\nline3\n",
          "line": 1,
          "col": 31
        },
        {
          "type": "block",
          "pos": 37,
          "endpos": 83,
          "value": "/*<jdists encoding=\"base64\">\nline4\n</jdists>*/",
          "comment": true,
          "tag": "jdists",
          "language": "c",
          "attrs": {
            "encoding": "base64"
          },
          "line": 3,
          "col": 1,
          "nodes": [
            {
              "type": "text",
              "pos": 65,
              "endpos": 72,
              "value": "\nline4\n",
              "line": 3,
              "col": 29
            }
          ],
          "content": "\nline4\n",
          "prefix": "/*<jdists encoding=\"base64\">",
          "suffix": "</jdists>*/"
        },
        {
          "type": "text",
          "pos": 83,
          "endpos": 90,
          "value": "\nline2\n",
          "line": 5,
          "col": 12
        }
      ],
      "content": "\nline3\n/*<jdists encoding=\"base64\">\nline4\n</jdists>*/\nline2\n",
      "prefix": "<!--relpace encoding=\"quoted\">",
      "suffix": "</relpace-->"
    }
  ],
  "endpos": 102
}