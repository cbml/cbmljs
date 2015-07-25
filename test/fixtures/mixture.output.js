{
  "type": "cbml",
  "nodes": [
    {
      "type": "block",
      "pos": 0,
      "endpos": 101,
      "value": "/*<header info=\"file\">*/\n/**\n * (*<replace encoding=\"base64\">2014-10-16</replace>*)\n */\n/*</header>*/",
      "tag": "header",
      "language": "c",
      "attrs": {
        "info": "file"
      },
      "line": 1,
      "col": 1,
      "nodes": [
        {
          "type": "text",
          "pos": 24,
          "endpos": 32,
          "value": "\n/**\n * ",
          "line": 1,
          "col": 25
        },
        {
          "type": "block",
          "pos": 32,
          "endpos": 83,
          "value": "(*<replace encoding=\"base64\">2014-10-16</replace>*)",
          "comment": true,
          "tag": "replace",
          "language": "pascal",
          "attrs": {
            "encoding": "base64"
          },
          "line": 3,
          "col": 4,
          "nodes": [
            {
              "type": "text",
              "pos": 61,
              "endpos": 71,
              "value": "2014-10-16",
              "line": 3,
              "col": 33
            }
          ],
          "content": "2014-10-16",
          "prefix": "(*<replace encoding=\"base64\">",
          "suffix": "</replace>*)"
        },
        {
          "type": "text",
          "pos": 83,
          "endpos": 88,
          "value": "\n */\n",
          "line": 3,
          "col": 55
        }
      ],
      "content": "\n/**\n * (*<replace encoding=\"base64\">2014-10-16</replace>*)\n */\n",
      "prefix": "/*<header info=\"file\">*/",
      "suffix": "/*</header>*/"
    },
    {
      "type": "text",
      "pos": 101,
      "endpos": 102,
      "value": "\n",
      "line": 5,
      "col": 14
    }
  ],
  "endpos": 102
}