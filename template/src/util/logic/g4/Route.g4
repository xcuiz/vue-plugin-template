grammar Route;
dataSource:'source'':'bean;
aggregate:'groupBy'':' groupValue;
variable:'variable'':'beans;
filter : 'filter'':'(OrAnd?fil (OrAnd  fil)*)?;
sort:'sort'':'SortStat   Literal ;
exhibit: 'exhibit'':' exhibitValue;
analysis: 'analysis''[' dataSource ('|'(aggregate|variable|filter|sort|exhibit))*']'
|'analysis''[''|'']'
;
analysises:analysis+EOF;



fil:QuoteStart?Literal   operator filterValue (','filterValue)* QuoteEnd? ;
filterValue:FilterValue|Int|Quote;
operator
    :    Eq
    |   Gt
    |   Ge
    |    Lt
    |   Le
    |   Like
    |   NotLike
    | In
    |NotIn
    ;
beanLiteral  :Literal  Eq beanValue;
bean:'{' beanLiteral (',' beanLiteral )*'}'
|'{''}';
beans: '['bean (','  bean )*']';
beanValue:String|array|Int;
groupValue:array;
exhibitValue:Table|Bar|Pie;
array:'[' String (',' String )*']'
|'['']';
Table:'table';
Bar:'bar';
Pie:'pie';
SortStat:('+'|'-');
Eq:'=';
Gt:'>';
Ge:'>=';
Lt:'<';
Le:'<=';
In:WS[iI][nN]WS* QuoteStart;
NotIn:WS[nN][oO][tT]WS+[iI][nN]WS* QuoteStart;
QuoteStart:'(';
QuoteEnd:')';
NotLike:WS[iI][sS] WS+  [nN][oO][tT] WS*  Like;
Like :WS[lL][iI][kK][eE]WS;
OrAnd:WS([oO][rR])WS|WS([Aa][Nn][Dd])WS;
Quote:'$'~[ \t\r\n|"\]()]+;
FilterValue:'\''~[']*'\'';
Int:'-'?('0'|[1-9][0-9]*);
Literal:~[ \t\r\n'"$#=><,:;[\]\-+{}|\\]+;
String:'"'~[\t\r\n|"]+'"';
WS  :  [ \t\r\n\u000C]+ -> skip;
