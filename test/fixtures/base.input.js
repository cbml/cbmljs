<!--ok>line1
/*<jdists>*/line1.2/*</jdists>*/
line2</ok-->
/*<jdists import="6.js" line3 />*/
/*<jdists clean id='ttc' import="5.js" line4>*/
console.log(line5);
/*</jdists>*/
/*<remove line7>
console.log(line8);
</remove>*/
(*<delphi line10>
console.log(line11);
</delphi>*)
(*<delphi line13>*)
console.log(line14);
(*</delphi>*)
'''<release line16>'''
line14
'''</release>'''
'''<release line19>
test
/*<jdists import="line21.js">*/
line17</release>'''
/*<jdists import="line23.js">*/
console.log(line19);
/*</jdists>*/
/*<jdists import="line26.js">*/
  /*<jdists import="line27.js">*/
    /*<jdists import="line28.js">*/console.log(4);/*</jdists>*/
    /*<jdists import="line29.js">*/console.log(5);/*</jdists>*/
    console.log(line30);
  /*</jdists>*/
line32/*</jdists>*/
line33
--[[<lua>]]
line35 = {}
--[[</lua>]]