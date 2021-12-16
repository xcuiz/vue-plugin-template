// Generated from Route.g4 by ANTLR 4.7.1
// jshint ignore: start
import antlr4 from 'antlr4/index'
import RouteListener from './RouteListener'
var grammarFileName = 'Route.g4'

var serializedATN = ["\u0003\u608b\ua72a\u8133\ub9ed\u417c\u3be7\u7786\u5964",
    "\u0003&\u00b3\u0004\u0002\t\u0002\u0004\u0003\t\u0003\u0004\u0004\t",
    "\u0004\u0004\u0005\t\u0005\u0004\u0006\t\u0006\u0004\u0007\t\u0007\u0004",
    "\b\t\b\u0004\t\t\t\u0004\n\t\n\u0004\u000b\t\u000b\u0004\f\t\f\u0004",
    "\r\t\r\u0004\u000e\t\u000e\u0004\u000f\t\u000f\u0004\u0010\t\u0010\u0004",
    "\u0011\t\u0011\u0004\u0012\t\u0012\u0004\u0013\t\u0013\u0003\u0002\u0003",
    "\u0002\u0003\u0002\u0003\u0002\u0003\u0003\u0003\u0003\u0003\u0003\u0003",
    "\u0003\u0003\u0004\u0003\u0004\u0003\u0004\u0003\u0004\u0003\u0005\u0003",
    "\u0005\u0003\u0005\u0005\u00056\n\u0005\u0003\u0005\u0003\u0005\u0003",
    "\u0005\u0007\u0005;\n\u0005\f\u0005\u000e\u0005>\u000b\u0005\u0005\u0005",
    "@\n\u0005\u0003\u0006\u0003\u0006\u0003\u0006\u0003\u0006\u0003\u0006",
    "\u0003\u0007\u0003\u0007\u0003\u0007\u0003\u0007\u0003\b\u0003\b\u0003",
    "\b\u0003\b\u0003\b\u0003\b\u0003\b\u0003\b\u0003\b\u0005\bT\n\b\u0007",
    "\bV\n\b\f\b\u000e\bY\u000b\b\u0003\b\u0003\b\u0003\b\u0003\b\u0003\b",
    "\u0003\b\u0005\ba\n\b\u0003\t\u0006\td\n\t\r\t\u000e\te\u0003\t\u0003",
    "\t\u0003\n\u0005\nk\n\n\u0003\n\u0003\n\u0003\n\u0003\n\u0003\n\u0007",
    "\nr\n\n\f\n\u000e\nu\u000b\n\u0003\n\u0005\nx\n\n\u0003\u000b\u0003",
    "\u000b\u0003\f\u0003\f\u0003\r\u0003\r\u0003\r\u0003\r\u0003\u000e\u0003",
    "\u000e\u0003\u000e\u0003\u000e\u0007\u000e\u0086\n\u000e\f\u000e\u000e",
    "\u000e\u0089\u000b\u000e\u0003\u000e\u0003\u000e\u0003\u000e\u0003\u000e",
    "\u0005\u000e\u008f\n\u000e\u0003\u000f\u0003\u000f\u0003\u000f\u0003",
    "\u000f\u0007\u000f\u0095\n\u000f\f\u000f\u000e\u000f\u0098\u000b\u000f",
    "\u0003\u000f\u0003\u000f\u0003\u0010\u0003\u0010\u0003\u0010\u0005\u0010",
    "\u009f\n\u0010\u0003\u0011\u0003\u0011\u0003\u0012\u0003\u0012\u0003",
    "\u0013\u0003\u0013\u0003\u0013\u0003\u0013\u0007\u0013\u00a9\n\u0013",
    "\f\u0013\u000e\u0013\u00ac\u000b\u0013\u0003\u0013\u0003\u0013\u0003",
    "\u0013\u0005\u0013\u00b1\n\u0013\u0003\u0013\u0002\u0002\u0014\u0002",
    "\u0004\u0006\b\n\f\u000e\u0010\u0012\u0014\u0016\u0018\u001a\u001c\u001e",
    " \"$\u0002\u0005\u0003\u0002!#\u0004\u0002\u0015\u001b\u001e\u001f\u0003",
    "\u0002\u0011\u0013\u0002\u00b4\u0002&\u0003\u0002\u0002\u0002\u0004",
    "*\u0003\u0002\u0002\u0002\u0006.\u0003\u0002\u0002\u0002\b2\u0003\u0002",
    "\u0002\u0002\nA\u0003\u0002\u0002\u0002\fF\u0003\u0002\u0002\u0002\u000e",
    "`\u0003\u0002\u0002\u0002\u0010c\u0003\u0002\u0002\u0002\u0012j\u0003",
    "\u0002\u0002\u0002\u0014y\u0003\u0002\u0002\u0002\u0016{\u0003\u0002",
    "\u0002\u0002\u0018}\u0003\u0002\u0002\u0002\u001a\u008e\u0003\u0002",
    "\u0002\u0002\u001c\u0090\u0003\u0002\u0002\u0002\u001e\u009e\u0003\u0002",
    "\u0002\u0002 \u00a0\u0003\u0002\u0002\u0002\"\u00a2\u0003\u0002\u0002",
    "\u0002$\u00b0\u0003\u0002\u0002\u0002&\'\u0007\u0003\u0002\u0002\'(",
    "\u0007\u0004\u0002\u0002()\u0005\u001a\u000e\u0002)\u0003\u0003\u0002",
    "\u0002\u0002*+\u0007\u0005\u0002\u0002+,\u0007\u0004\u0002\u0002,-\u0005",
    " \u0011\u0002-\u0005\u0003\u0002\u0002\u0002./\u0007\u0006\u0002\u0002",
    "/0\u0007\u0004\u0002\u000201\u0005\u001c\u000f\u00021\u0007\u0003\u0002",
    "\u0002\u000223\u0007\u0007\u0002\u00023?\u0007\u0004\u0002\u000246\u0007",
    " \u0002\u000254\u0003\u0002\u0002\u000256\u0003\u0002\u0002\u000267",
    "\u0003\u0002\u0002\u00027<\u0005\u0012\n\u000289\u0007 \u0002\u0002",
    "9;\u0005\u0012\n\u0002:8\u0003\u0002\u0002\u0002;>\u0003\u0002\u0002",
    "\u0002<:\u0003\u0002\u0002\u0002<=\u0003\u0002\u0002\u0002=@\u0003\u0002",
    "\u0002\u0002><\u0003\u0002\u0002\u0002?5\u0003\u0002\u0002\u0002?@\u0003",
    "\u0002\u0002\u0002@\t\u0003\u0002\u0002\u0002AB\u0007\b\u0002\u0002",
    "BC\u0007\u0004\u0002\u0002CD\u0007\u0014\u0002\u0002DE\u0007$\u0002",
    "\u0002E\u000b\u0003\u0002\u0002\u0002FG\u0007\t\u0002\u0002GH\u0007",
    "\u0004\u0002\u0002HI\u0005\"\u0012\u0002I\r\u0003\u0002\u0002\u0002",
    "JK\u0007\n\u0002\u0002KL\u0007\u000b\u0002\u0002LW\u0005\u0002\u0002",
    "\u0002MS\u0007\f\u0002\u0002NT\u0005\u0004\u0003\u0002OT\u0005\u0006",
    "\u0004\u0002PT\u0005\b\u0005\u0002QT\u0005\n\u0006\u0002RT\u0005\f\u0007",
    "\u0002SN\u0003\u0002\u0002\u0002SO\u0003\u0002\u0002\u0002SP\u0003\u0002",
    "\u0002\u0002SQ\u0003\u0002\u0002\u0002SR\u0003\u0002\u0002\u0002TV\u0003",
    "\u0002\u0002\u0002UM\u0003\u0002\u0002\u0002VY\u0003\u0002\u0002\u0002",
    "WU\u0003\u0002\u0002\u0002WX\u0003\u0002\u0002\u0002XZ\u0003\u0002\u0002",
    "\u0002YW\u0003\u0002\u0002\u0002Z[\u0007\r\u0002\u0002[a\u0003\u0002",
    "\u0002\u0002\\]\u0007\n\u0002\u0002]^\u0007\u000b\u0002\u0002^_\u0007",
    "\f\u0002\u0002_a\u0007\r\u0002\u0002`J\u0003\u0002\u0002\u0002`\\\u0003",
    "\u0002\u0002\u0002a\u000f\u0003\u0002\u0002\u0002bd\u0005\u000e\b\u0002",
    "cb\u0003\u0002\u0002\u0002de\u0003\u0002\u0002\u0002ec\u0003\u0002\u0002",
    "\u0002ef\u0003\u0002\u0002\u0002fg\u0003\u0002\u0002\u0002gh\u0007\u0002",
    "\u0002\u0003h\u0011\u0003\u0002\u0002\u0002ik\u0007\u001c\u0002\u0002",
    "ji\u0003\u0002\u0002\u0002jk\u0003\u0002\u0002\u0002kl\u0003\u0002\u0002",
    "\u0002lm\u0007$\u0002\u0002mn\u0005\u0016\f\u0002ns\u0005\u0014\u000b",
    "\u0002op\u0007\u000e\u0002\u0002pr\u0005\u0014\u000b\u0002qo\u0003\u0002",
    "\u0002\u0002ru\u0003\u0002\u0002\u0002sq\u0003\u0002\u0002\u0002st\u0003",
    "\u0002\u0002\u0002tw\u0003\u0002\u0002\u0002us\u0003\u0002\u0002\u0002",
    "vx\u0007\u001d\u0002\u0002wv\u0003\u0002\u0002\u0002wx\u0003\u0002\u0002",
    "\u0002x\u0013\u0003\u0002\u0002\u0002yz\t\u0002\u0002\u0002z\u0015\u0003",
    "\u0002\u0002\u0002{|\t\u0003\u0002\u0002|\u0017\u0003\u0002\u0002\u0002",
    "}~\u0007$\u0002\u0002~\u007f\u0007\u0015\u0002\u0002\u007f\u0080\u0005",
    "\u001e\u0010\u0002\u0080\u0019\u0003\u0002\u0002\u0002\u0081\u0082\u0007",
    "\u000f\u0002\u0002\u0082\u0087\u0005\u0018\r\u0002\u0083\u0084\u0007",
    "\u000e\u0002\u0002\u0084\u0086\u0005\u0018\r\u0002\u0085\u0083\u0003",
    "\u0002\u0002\u0002\u0086\u0089\u0003\u0002\u0002\u0002\u0087\u0085\u0003",
    "\u0002\u0002\u0002\u0087\u0088\u0003\u0002\u0002\u0002\u0088\u008a\u0003",
    "\u0002\u0002\u0002\u0089\u0087\u0003\u0002\u0002\u0002\u008a\u008b\u0007",
    "\u0010\u0002\u0002\u008b\u008f\u0003\u0002\u0002\u0002\u008c\u008d\u0007",
    "\u000f\u0002\u0002\u008d\u008f\u0007\u0010\u0002\u0002\u008e\u0081\u0003",
    "\u0002\u0002\u0002\u008e\u008c\u0003\u0002\u0002\u0002\u008f\u001b\u0003",
    "\u0002\u0002\u0002\u0090\u0091\u0007\u000b\u0002\u0002\u0091\u0096\u0005",
    "\u001a\u000e\u0002\u0092\u0093\u0007\u000e\u0002\u0002\u0093\u0095\u0005",
    "\u001a\u000e\u0002\u0094\u0092\u0003\u0002\u0002\u0002\u0095\u0098\u0003",
    "\u0002\u0002\u0002\u0096\u0094\u0003\u0002\u0002\u0002\u0096\u0097\u0003",
    "\u0002\u0002\u0002\u0097\u0099\u0003\u0002\u0002\u0002\u0098\u0096\u0003",
    "\u0002\u0002\u0002\u0099\u009a\u0007\r\u0002\u0002\u009a\u001d\u0003",
    "\u0002\u0002\u0002\u009b\u009f\u0007%\u0002\u0002\u009c\u009f\u0005",
    "$\u0013\u0002\u009d\u009f\u0007#\u0002\u0002\u009e\u009b\u0003\u0002",
    "\u0002\u0002\u009e\u009c\u0003\u0002\u0002\u0002\u009e\u009d\u0003\u0002",
    "\u0002\u0002\u009f\u001f\u0003\u0002\u0002\u0002\u00a0\u00a1\u0005$",
    "\u0013\u0002\u00a1!\u0003\u0002\u0002\u0002\u00a2\u00a3\t\u0004\u0002",
    "\u0002\u00a3#\u0003\u0002\u0002\u0002\u00a4\u00a5\u0007\u000b\u0002",
    "\u0002\u00a5\u00aa\u0007%\u0002\u0002\u00a6\u00a7\u0007\u000e\u0002",
    "\u0002\u00a7\u00a9\u0007%\u0002\u0002\u00a8\u00a6\u0003\u0002\u0002",
    "\u0002\u00a9\u00ac\u0003\u0002\u0002\u0002\u00aa\u00a8\u0003\u0002\u0002",
    "\u0002\u00aa\u00ab\u0003\u0002\u0002\u0002\u00ab\u00ad\u0003\u0002\u0002",
    "\u0002\u00ac\u00aa\u0003\u0002\u0002\u0002\u00ad\u00b1\u0007\r\u0002",
    "\u0002\u00ae\u00af\u0007\u000b\u0002\u0002\u00af\u00b1\u0007\r\u0002",
    "\u0002\u00b0\u00a4\u0003\u0002\u0002\u0002\u00b0\u00ae\u0003\u0002\u0002",
    "\u0002\u00b1%\u0003\u0002\u0002\u0002\u00125<?SW`ejsw\u0087\u008e\u0096",
    "\u009e\u00aa\u00b0"].join("");


var atn = new antlr4.atn.ATNDeserializer().deserialize(serializedATN);

var decisionsToDFA = atn.decisionToState.map( function(ds, index) { return new antlr4.dfa.DFA(ds, index); });

var sharedContextCache = new antlr4.PredictionContextCache();

var literalNames = [ null, "'source'", "':'", "'groupBy'", "'variable'", 
                     "'filter'", "'sort'", "'exhibit'", "'analysis'", "'['", 
                     "'|'", "']'", "','", "'{'", "'}'", "'table'", "'bar'", 
                     "'pie'", null, "'='", "'>'", "'>='", "'<'", "'<='", 
                     null, null, "'('", "')'" ];

var symbolicNames = [ null, null, null, null, null, null, null, null, null, 
                      null, null, null, null, null, null, "Table", "Bar", 
                      "Pie", "SortStat", "Eq", "Gt", "Ge", "Lt", "Le", "In", 
                      "NotIn", "QuoteStart", "QuoteEnd", "NotLike", "Like", 
                      "OrAnd", "Quote", "FilterValue", "Int", "Literal", 
                      "String", "WS" ];

var ruleNames =  [ "dataSource", "aggregate", "variable", "filter", "sort", 
                   "exhibit", "analysis", "analysises", "fil", "filterValue", 
                   "operator", "beanLiteral", "bean", "beans", "beanValue", 
                   "groupValue", "exhibitValue", "array" ];

function RouteParser (input) {
	antlr4.Parser.call(this, input);
    this._interp = new antlr4.atn.ParserATNSimulator(this, atn, decisionsToDFA, sharedContextCache);
    this.ruleNames = ruleNames;
    this.literalNames = literalNames;
    this.symbolicNames = symbolicNames;
    return this;
}

RouteParser.prototype = Object.create(antlr4.Parser.prototype);
RouteParser.prototype.constructor = RouteParser;

Object.defineProperty(RouteParser.prototype, "atn", {
	get : function() {
		return atn;
	}
});

RouteParser.EOF = antlr4.Token.EOF;
RouteParser.T__0 = 1;
RouteParser.T__1 = 2;
RouteParser.T__2 = 3;
RouteParser.T__3 = 4;
RouteParser.T__4 = 5;
RouteParser.T__5 = 6;
RouteParser.T__6 = 7;
RouteParser.T__7 = 8;
RouteParser.T__8 = 9;
RouteParser.T__9 = 10;
RouteParser.T__10 = 11;
RouteParser.T__11 = 12;
RouteParser.T__12 = 13;
RouteParser.T__13 = 14;
RouteParser.Table = 15;
RouteParser.Bar = 16;
RouteParser.Pie = 17;
RouteParser.SortStat = 18;
RouteParser.Eq = 19;
RouteParser.Gt = 20;
RouteParser.Ge = 21;
RouteParser.Lt = 22;
RouteParser.Le = 23;
RouteParser.In = 24;
RouteParser.NotIn = 25;
RouteParser.QuoteStart = 26;
RouteParser.QuoteEnd = 27;
RouteParser.NotLike = 28;
RouteParser.Like = 29;
RouteParser.OrAnd = 30;
RouteParser.Quote = 31;
RouteParser.FilterValue = 32;
RouteParser.Int = 33;
RouteParser.Literal = 34;
RouteParser.String = 35;
RouteParser.WS = 36;

RouteParser.RULE_dataSource = 0;
RouteParser.RULE_aggregate = 1;
RouteParser.RULE_variable = 2;
RouteParser.RULE_filter = 3;
RouteParser.RULE_sort = 4;
RouteParser.RULE_exhibit = 5;
RouteParser.RULE_analysis = 6;
RouteParser.RULE_analysises = 7;
RouteParser.RULE_fil = 8;
RouteParser.RULE_filterValue = 9;
RouteParser.RULE_operator = 10;
RouteParser.RULE_beanLiteral = 11;
RouteParser.RULE_bean = 12;
RouteParser.RULE_beans = 13;
RouteParser.RULE_beanValue = 14;
RouteParser.RULE_groupValue = 15;
RouteParser.RULE_exhibitValue = 16;
RouteParser.RULE_array = 17;

function DataSourceContext(parser, parent, invokingState) {
	if(parent===undefined) {
	    parent = null;
	}
	if(invokingState===undefined || invokingState===null) {
		invokingState = -1;
	}
	antlr4.ParserRuleContext.call(this, parent, invokingState);
    this.parser = parser;
    this.ruleIndex = RouteParser.RULE_dataSource;
    return this;
}

DataSourceContext.prototype = Object.create(antlr4.ParserRuleContext.prototype);
DataSourceContext.prototype.constructor = DataSourceContext;

DataSourceContext.prototype.bean = function() {
    return this.getTypedRuleContext(BeanContext,0);
};

DataSourceContext.prototype.enterRule = function(listener) {
    if(listener instanceof RouteListener ) {
        listener.enterDataSource(this);
	}
};

DataSourceContext.prototype.exitRule = function(listener) {
    if(listener instanceof RouteListener ) {
        listener.exitDataSource(this);
	}
};




RouteParser.DataSourceContext = DataSourceContext;

RouteParser.prototype.dataSource = function() {

    var localctx = new DataSourceContext(this, this._ctx, this.state);
    this.enterRule(localctx, 0, RouteParser.RULE_dataSource);
    try {
        this.enterOuterAlt(localctx, 1);
        this.state = 36;
        this.match(RouteParser.T__0);
        this.state = 37;
        this.match(RouteParser.T__1);
        this.state = 38;
        this.bean();
    } catch (re) {
    	if(re instanceof antlr4.error.RecognitionException) {
	        localctx.exception = re;
	        this._errHandler.reportError(this, re);
	        this._errHandler.recover(this, re);
	    } else {
	    	throw re;
	    }
    } finally {
        this.exitRule();
    }
    return localctx;
};

function AggregateContext(parser, parent, invokingState) {
	if(parent===undefined) {
	    parent = null;
	}
	if(invokingState===undefined || invokingState===null) {
		invokingState = -1;
	}
	antlr4.ParserRuleContext.call(this, parent, invokingState);
    this.parser = parser;
    this.ruleIndex = RouteParser.RULE_aggregate;
    return this;
}

AggregateContext.prototype = Object.create(antlr4.ParserRuleContext.prototype);
AggregateContext.prototype.constructor = AggregateContext;

AggregateContext.prototype.groupValue = function() {
    return this.getTypedRuleContext(GroupValueContext,0);
};

AggregateContext.prototype.enterRule = function(listener) {
    if(listener instanceof RouteListener ) {
        listener.enterAggregate(this);
	}
};

AggregateContext.prototype.exitRule = function(listener) {
    if(listener instanceof RouteListener ) {
        listener.exitAggregate(this);
	}
};




RouteParser.AggregateContext = AggregateContext;

RouteParser.prototype.aggregate = function() {

    var localctx = new AggregateContext(this, this._ctx, this.state);
    this.enterRule(localctx, 2, RouteParser.RULE_aggregate);
    try {
        this.enterOuterAlt(localctx, 1);
        this.state = 40;
        this.match(RouteParser.T__2);
        this.state = 41;
        this.match(RouteParser.T__1);
        this.state = 42;
        this.groupValue();
    } catch (re) {
    	if(re instanceof antlr4.error.RecognitionException) {
	        localctx.exception = re;
	        this._errHandler.reportError(this, re);
	        this._errHandler.recover(this, re);
	    } else {
	    	throw re;
	    }
    } finally {
        this.exitRule();
    }
    return localctx;
};

function VariableContext(parser, parent, invokingState) {
	if(parent===undefined) {
	    parent = null;
	}
	if(invokingState===undefined || invokingState===null) {
		invokingState = -1;
	}
	antlr4.ParserRuleContext.call(this, parent, invokingState);
    this.parser = parser;
    this.ruleIndex = RouteParser.RULE_variable;
    return this;
}

VariableContext.prototype = Object.create(antlr4.ParserRuleContext.prototype);
VariableContext.prototype.constructor = VariableContext;

VariableContext.prototype.beans = function() {
    return this.getTypedRuleContext(BeansContext,0);
};

VariableContext.prototype.enterRule = function(listener) {
    if(listener instanceof RouteListener ) {
        listener.enterVariable(this);
	}
};

VariableContext.prototype.exitRule = function(listener) {
    if(listener instanceof RouteListener ) {
        listener.exitVariable(this);
	}
};




RouteParser.VariableContext = VariableContext;

RouteParser.prototype.variable = function() {

    var localctx = new VariableContext(this, this._ctx, this.state);
    this.enterRule(localctx, 4, RouteParser.RULE_variable);
    try {
        this.enterOuterAlt(localctx, 1);
        this.state = 44;
        this.match(RouteParser.T__3);
        this.state = 45;
        this.match(RouteParser.T__1);
        this.state = 46;
        this.beans();
    } catch (re) {
    	if(re instanceof antlr4.error.RecognitionException) {
	        localctx.exception = re;
	        this._errHandler.reportError(this, re);
	        this._errHandler.recover(this, re);
	    } else {
	    	throw re;
	    }
    } finally {
        this.exitRule();
    }
    return localctx;
};

function FilterContext(parser, parent, invokingState) {
	if(parent===undefined) {
	    parent = null;
	}
	if(invokingState===undefined || invokingState===null) {
		invokingState = -1;
	}
	antlr4.ParserRuleContext.call(this, parent, invokingState);
    this.parser = parser;
    this.ruleIndex = RouteParser.RULE_filter;
    return this;
}

FilterContext.prototype = Object.create(antlr4.ParserRuleContext.prototype);
FilterContext.prototype.constructor = FilterContext;

FilterContext.prototype.fil = function(i) {
    if(i===undefined) {
        i = null;
    }
    if(i===null) {
        return this.getTypedRuleContexts(FilContext);
    } else {
        return this.getTypedRuleContext(FilContext,i);
    }
};

FilterContext.prototype.OrAnd = function(i) {
	if(i===undefined) {
		i = null;
	}
    if(i===null) {
        return this.getTokens(RouteParser.OrAnd);
    } else {
        return this.getToken(RouteParser.OrAnd, i);
    }
};


FilterContext.prototype.enterRule = function(listener) {
    if(listener instanceof RouteListener ) {
        listener.enterFilter(this);
	}
};

FilterContext.prototype.exitRule = function(listener) {
    if(listener instanceof RouteListener ) {
        listener.exitFilter(this);
	}
};




RouteParser.FilterContext = FilterContext;

RouteParser.prototype.filter = function() {

    var localctx = new FilterContext(this, this._ctx, this.state);
    this.enterRule(localctx, 6, RouteParser.RULE_filter);
    var _la = 0; // Token type
    try {
        this.enterOuterAlt(localctx, 1);
        this.state = 48;
        this.match(RouteParser.T__4);
        this.state = 49;
        this.match(RouteParser.T__1);
        this.state = 61;
        this._errHandler.sync(this);
        _la = this._input.LA(1);
        if(((((_la - 26)) & ~0x1f) == 0 && ((1 << (_la - 26)) & ((1 << (RouteParser.QuoteStart - 26)) | (1 << (RouteParser.OrAnd - 26)) | (1 << (RouteParser.Literal - 26)))) !== 0)) {
            this.state = 51;
            this._errHandler.sync(this);
            _la = this._input.LA(1);
            if(_la===RouteParser.OrAnd) {
                this.state = 50;
                this.match(RouteParser.OrAnd);
            }

            this.state = 53;
            this.fil();
            this.state = 58;
            this._errHandler.sync(this);
            _la = this._input.LA(1);
            while(_la===RouteParser.OrAnd) {
                this.state = 54;
                this.match(RouteParser.OrAnd);
                this.state = 55;
                this.fil();
                this.state = 60;
                this._errHandler.sync(this);
                _la = this._input.LA(1);
            }
        }

    } catch (re) {
    	if(re instanceof antlr4.error.RecognitionException) {
	        localctx.exception = re;
	        this._errHandler.reportError(this, re);
	        this._errHandler.recover(this, re);
	    } else {
	    	throw re;
	    }
    } finally {
        this.exitRule();
    }
    return localctx;
};

function SortContext(parser, parent, invokingState) {
	if(parent===undefined) {
	    parent = null;
	}
	if(invokingState===undefined || invokingState===null) {
		invokingState = -1;
	}
	antlr4.ParserRuleContext.call(this, parent, invokingState);
    this.parser = parser;
    this.ruleIndex = RouteParser.RULE_sort;
    return this;
}

SortContext.prototype = Object.create(antlr4.ParserRuleContext.prototype);
SortContext.prototype.constructor = SortContext;

SortContext.prototype.SortStat = function() {
    return this.getToken(RouteParser.SortStat, 0);
};

SortContext.prototype.Literal = function() {
    return this.getToken(RouteParser.Literal, 0);
};

SortContext.prototype.enterRule = function(listener) {
    if(listener instanceof RouteListener ) {
        listener.enterSort(this);
	}
};

SortContext.prototype.exitRule = function(listener) {
    if(listener instanceof RouteListener ) {
        listener.exitSort(this);
	}
};




RouteParser.SortContext = SortContext;

RouteParser.prototype.sort = function() {

    var localctx = new SortContext(this, this._ctx, this.state);
    this.enterRule(localctx, 8, RouteParser.RULE_sort);
    try {
        this.enterOuterAlt(localctx, 1);
        this.state = 63;
        this.match(RouteParser.T__5);
        this.state = 64;
        this.match(RouteParser.T__1);
        this.state = 65;
        this.match(RouteParser.SortStat);
        this.state = 66;
        this.match(RouteParser.Literal);
    } catch (re) {
    	if(re instanceof antlr4.error.RecognitionException) {
	        localctx.exception = re;
	        this._errHandler.reportError(this, re);
	        this._errHandler.recover(this, re);
	    } else {
	    	throw re;
	    }
    } finally {
        this.exitRule();
    }
    return localctx;
};

function ExhibitContext(parser, parent, invokingState) {
	if(parent===undefined) {
	    parent = null;
	}
	if(invokingState===undefined || invokingState===null) {
		invokingState = -1;
	}
	antlr4.ParserRuleContext.call(this, parent, invokingState);
    this.parser = parser;
    this.ruleIndex = RouteParser.RULE_exhibit;
    return this;
}

ExhibitContext.prototype = Object.create(antlr4.ParserRuleContext.prototype);
ExhibitContext.prototype.constructor = ExhibitContext;

ExhibitContext.prototype.exhibitValue = function() {
    return this.getTypedRuleContext(ExhibitValueContext,0);
};

ExhibitContext.prototype.enterRule = function(listener) {
    if(listener instanceof RouteListener ) {
        listener.enterExhibit(this);
	}
};

ExhibitContext.prototype.exitRule = function(listener) {
    if(listener instanceof RouteListener ) {
        listener.exitExhibit(this);
	}
};




RouteParser.ExhibitContext = ExhibitContext;

RouteParser.prototype.exhibit = function() {

    var localctx = new ExhibitContext(this, this._ctx, this.state);
    this.enterRule(localctx, 10, RouteParser.RULE_exhibit);
    try {
        this.enterOuterAlt(localctx, 1);
        this.state = 68;
        this.match(RouteParser.T__6);
        this.state = 69;
        this.match(RouteParser.T__1);
        this.state = 70;
        this.exhibitValue();
    } catch (re) {
    	if(re instanceof antlr4.error.RecognitionException) {
	        localctx.exception = re;
	        this._errHandler.reportError(this, re);
	        this._errHandler.recover(this, re);
	    } else {
	    	throw re;
	    }
    } finally {
        this.exitRule();
    }
    return localctx;
};

function AnalysisContext(parser, parent, invokingState) {
	if(parent===undefined) {
	    parent = null;
	}
	if(invokingState===undefined || invokingState===null) {
		invokingState = -1;
	}
	antlr4.ParserRuleContext.call(this, parent, invokingState);
    this.parser = parser;
    this.ruleIndex = RouteParser.RULE_analysis;
    return this;
}

AnalysisContext.prototype = Object.create(antlr4.ParserRuleContext.prototype);
AnalysisContext.prototype.constructor = AnalysisContext;

AnalysisContext.prototype.dataSource = function() {
    return this.getTypedRuleContext(DataSourceContext,0);
};

AnalysisContext.prototype.aggregate = function(i) {
    if(i===undefined) {
        i = null;
    }
    if(i===null) {
        return this.getTypedRuleContexts(AggregateContext);
    } else {
        return this.getTypedRuleContext(AggregateContext,i);
    }
};

AnalysisContext.prototype.variable = function(i) {
    if(i===undefined) {
        i = null;
    }
    if(i===null) {
        return this.getTypedRuleContexts(VariableContext);
    } else {
        return this.getTypedRuleContext(VariableContext,i);
    }
};

AnalysisContext.prototype.filter = function(i) {
    if(i===undefined) {
        i = null;
    }
    if(i===null) {
        return this.getTypedRuleContexts(FilterContext);
    } else {
        return this.getTypedRuleContext(FilterContext,i);
    }
};

AnalysisContext.prototype.sort = function(i) {
    if(i===undefined) {
        i = null;
    }
    if(i===null) {
        return this.getTypedRuleContexts(SortContext);
    } else {
        return this.getTypedRuleContext(SortContext,i);
    }
};

AnalysisContext.prototype.exhibit = function(i) {
    if(i===undefined) {
        i = null;
    }
    if(i===null) {
        return this.getTypedRuleContexts(ExhibitContext);
    } else {
        return this.getTypedRuleContext(ExhibitContext,i);
    }
};

AnalysisContext.prototype.enterRule = function(listener) {
    if(listener instanceof RouteListener ) {
        listener.enterAnalysis(this);
	}
};

AnalysisContext.prototype.exitRule = function(listener) {
    if(listener instanceof RouteListener ) {
        listener.exitAnalysis(this);
	}
};




RouteParser.AnalysisContext = AnalysisContext;

RouteParser.prototype.analysis = function() {

    var localctx = new AnalysisContext(this, this._ctx, this.state);
    this.enterRule(localctx, 12, RouteParser.RULE_analysis);
    var _la = 0; // Token type
    try {
        this.state = 94;
        this._errHandler.sync(this);
        var la_ = this._interp.adaptivePredict(this._input,5,this._ctx);
        switch(la_) {
        case 1:
            this.enterOuterAlt(localctx, 1);
            this.state = 72;
            this.match(RouteParser.T__7);
            this.state = 73;
            this.match(RouteParser.T__8);
            this.state = 74;
            this.dataSource();
            this.state = 85;
            this._errHandler.sync(this);
            _la = this._input.LA(1);
            while(_la===RouteParser.T__9) {
                this.state = 75;
                this.match(RouteParser.T__9);
                this.state = 81;
                this._errHandler.sync(this);
                switch(this._input.LA(1)) {
                case RouteParser.T__2:
                    this.state = 76;
                    this.aggregate();
                    break;
                case RouteParser.T__3:
                    this.state = 77;
                    this.variable();
                    break;
                case RouteParser.T__4:
                    this.state = 78;
                    this.filter();
                    break;
                case RouteParser.T__5:
                    this.state = 79;
                    this.sort();
                    break;
                case RouteParser.T__6:
                    this.state = 80;
                    this.exhibit();
                    break;
                default:
                    throw new antlr4.error.NoViableAltException(this);
                }
                this.state = 87;
                this._errHandler.sync(this);
                _la = this._input.LA(1);
            }
            this.state = 88;
            this.match(RouteParser.T__10);
            break;

        case 2:
            this.enterOuterAlt(localctx, 2);
            this.state = 90;
            this.match(RouteParser.T__7);
            this.state = 91;
            this.match(RouteParser.T__8);
            this.state = 92;
            this.match(RouteParser.T__9);
            this.state = 93;
            this.match(RouteParser.T__10);
            break;

        }
    } catch (re) {
    	if(re instanceof antlr4.error.RecognitionException) {
	        localctx.exception = re;
	        this._errHandler.reportError(this, re);
	        this._errHandler.recover(this, re);
	    } else {
	    	throw re;
	    }
    } finally {
        this.exitRule();
    }
    return localctx;
};

function AnalysisesContext(parser, parent, invokingState) {
	if(parent===undefined) {
	    parent = null;
	}
	if(invokingState===undefined || invokingState===null) {
		invokingState = -1;
	}
	antlr4.ParserRuleContext.call(this, parent, invokingState);
    this.parser = parser;
    this.ruleIndex = RouteParser.RULE_analysises;
    return this;
}

AnalysisesContext.prototype = Object.create(antlr4.ParserRuleContext.prototype);
AnalysisesContext.prototype.constructor = AnalysisesContext;

AnalysisesContext.prototype.EOF = function() {
    return this.getToken(RouteParser.EOF, 0);
};

AnalysisesContext.prototype.analysis = function(i) {
    if(i===undefined) {
        i = null;
    }
    if(i===null) {
        return this.getTypedRuleContexts(AnalysisContext);
    } else {
        return this.getTypedRuleContext(AnalysisContext,i);
    }
};

AnalysisesContext.prototype.enterRule = function(listener) {
    if(listener instanceof RouteListener ) {
        listener.enterAnalysises(this);
	}
};

AnalysisesContext.prototype.exitRule = function(listener) {
    if(listener instanceof RouteListener ) {
        listener.exitAnalysises(this);
	}
};




RouteParser.AnalysisesContext = AnalysisesContext;

RouteParser.prototype.analysises = function() {

    var localctx = new AnalysisesContext(this, this._ctx, this.state);
    this.enterRule(localctx, 14, RouteParser.RULE_analysises);
    var _la = 0; // Token type
    try {
        this.enterOuterAlt(localctx, 1);
        this.state = 97; 
        this._errHandler.sync(this);
        _la = this._input.LA(1);
        do {
            this.state = 96;
            this.analysis();
            this.state = 99; 
            this._errHandler.sync(this);
            _la = this._input.LA(1);
        } while(_la===RouteParser.T__7);
        this.state = 101;
        this.match(RouteParser.EOF);
    } catch (re) {
    	if(re instanceof antlr4.error.RecognitionException) {
	        localctx.exception = re;
	        this._errHandler.reportError(this, re);
	        this._errHandler.recover(this, re);
	    } else {
	    	throw re;
	    }
    } finally {
        this.exitRule();
    }
    return localctx;
};

function FilContext(parser, parent, invokingState) {
	if(parent===undefined) {
	    parent = null;
	}
	if(invokingState===undefined || invokingState===null) {
		invokingState = -1;
	}
	antlr4.ParserRuleContext.call(this, parent, invokingState);
    this.parser = parser;
    this.ruleIndex = RouteParser.RULE_fil;
    return this;
}

FilContext.prototype = Object.create(antlr4.ParserRuleContext.prototype);
FilContext.prototype.constructor = FilContext;

FilContext.prototype.Literal = function() {
    return this.getToken(RouteParser.Literal, 0);
};

FilContext.prototype.operator = function() {
    return this.getTypedRuleContext(OperatorContext,0);
};

FilContext.prototype.filterValue = function(i) {
    if(i===undefined) {
        i = null;
    }
    if(i===null) {
        return this.getTypedRuleContexts(FilterValueContext);
    } else {
        return this.getTypedRuleContext(FilterValueContext,i);
    }
};

FilContext.prototype.QuoteStart = function() {
    return this.getToken(RouteParser.QuoteStart, 0);
};

FilContext.prototype.QuoteEnd = function() {
    return this.getToken(RouteParser.QuoteEnd, 0);
};

FilContext.prototype.enterRule = function(listener) {
    if(listener instanceof RouteListener ) {
        listener.enterFil(this);
	}
};

FilContext.prototype.exitRule = function(listener) {
    if(listener instanceof RouteListener ) {
        listener.exitFil(this);
	}
};




RouteParser.FilContext = FilContext;

RouteParser.prototype.fil = function() {

    var localctx = new FilContext(this, this._ctx, this.state);
    this.enterRule(localctx, 16, RouteParser.RULE_fil);
    var _la = 0; // Token type
    try {
        this.enterOuterAlt(localctx, 1);
        this.state = 104;
        this._errHandler.sync(this);
        _la = this._input.LA(1);
        if(_la===RouteParser.QuoteStart) {
            this.state = 103;
            this.match(RouteParser.QuoteStart);
        }

        this.state = 106;
        this.match(RouteParser.Literal);
        this.state = 107;
        this.operator();
        this.state = 108;
        this.filterValue();
        this.state = 113;
        this._errHandler.sync(this);
        _la = this._input.LA(1);
        while(_la===RouteParser.T__11) {
            this.state = 109;
            this.match(RouteParser.T__11);
            this.state = 110;
            this.filterValue();
            this.state = 115;
            this._errHandler.sync(this);
            _la = this._input.LA(1);
        }
        this.state = 117;
        this._errHandler.sync(this);
        _la = this._input.LA(1);
        if(_la===RouteParser.QuoteEnd) {
            this.state = 116;
            this.match(RouteParser.QuoteEnd);
        }

    } catch (re) {
    	if(re instanceof antlr4.error.RecognitionException) {
	        localctx.exception = re;
	        this._errHandler.reportError(this, re);
	        this._errHandler.recover(this, re);
	    } else {
	    	throw re;
	    }
    } finally {
        this.exitRule();
    }
    return localctx;
};

function FilterValueContext(parser, parent, invokingState) {
	if(parent===undefined) {
	    parent = null;
	}
	if(invokingState===undefined || invokingState===null) {
		invokingState = -1;
	}
	antlr4.ParserRuleContext.call(this, parent, invokingState);
    this.parser = parser;
    this.ruleIndex = RouteParser.RULE_filterValue;
    return this;
}

FilterValueContext.prototype = Object.create(antlr4.ParserRuleContext.prototype);
FilterValueContext.prototype.constructor = FilterValueContext;

FilterValueContext.prototype.FilterValue = function() {
    return this.getToken(RouteParser.FilterValue, 0);
};

FilterValueContext.prototype.Int = function() {
    return this.getToken(RouteParser.Int, 0);
};

FilterValueContext.prototype.Quote = function() {
    return this.getToken(RouteParser.Quote, 0);
};

FilterValueContext.prototype.enterRule = function(listener) {
    if(listener instanceof RouteListener ) {
        listener.enterFilterValue(this);
	}
};

FilterValueContext.prototype.exitRule = function(listener) {
    if(listener instanceof RouteListener ) {
        listener.exitFilterValue(this);
	}
};




RouteParser.FilterValueContext = FilterValueContext;

RouteParser.prototype.filterValue = function() {

    var localctx = new FilterValueContext(this, this._ctx, this.state);
    this.enterRule(localctx, 18, RouteParser.RULE_filterValue);
    var _la = 0; // Token type
    try {
        this.enterOuterAlt(localctx, 1);
        this.state = 119;
        _la = this._input.LA(1);
        if(!(((((_la - 31)) & ~0x1f) == 0 && ((1 << (_la - 31)) & ((1 << (RouteParser.Quote - 31)) | (1 << (RouteParser.FilterValue - 31)) | (1 << (RouteParser.Int - 31)))) !== 0))) {
        this._errHandler.recoverInline(this);
        }
        else {
        	this._errHandler.reportMatch(this);
            this.consume();
        }
    } catch (re) {
    	if(re instanceof antlr4.error.RecognitionException) {
	        localctx.exception = re;
	        this._errHandler.reportError(this, re);
	        this._errHandler.recover(this, re);
	    } else {
	    	throw re;
	    }
    } finally {
        this.exitRule();
    }
    return localctx;
};

function OperatorContext(parser, parent, invokingState) {
	if(parent===undefined) {
	    parent = null;
	}
	if(invokingState===undefined || invokingState===null) {
		invokingState = -1;
	}
	antlr4.ParserRuleContext.call(this, parent, invokingState);
    this.parser = parser;
    this.ruleIndex = RouteParser.RULE_operator;
    return this;
}

OperatorContext.prototype = Object.create(antlr4.ParserRuleContext.prototype);
OperatorContext.prototype.constructor = OperatorContext;

OperatorContext.prototype.Eq = function() {
    return this.getToken(RouteParser.Eq, 0);
};

OperatorContext.prototype.Gt = function() {
    return this.getToken(RouteParser.Gt, 0);
};

OperatorContext.prototype.Ge = function() {
    return this.getToken(RouteParser.Ge, 0);
};

OperatorContext.prototype.Lt = function() {
    return this.getToken(RouteParser.Lt, 0);
};

OperatorContext.prototype.Le = function() {
    return this.getToken(RouteParser.Le, 0);
};

OperatorContext.prototype.Like = function() {
    return this.getToken(RouteParser.Like, 0);
};

OperatorContext.prototype.NotLike = function() {
    return this.getToken(RouteParser.NotLike, 0);
};

OperatorContext.prototype.In = function() {
    return this.getToken(RouteParser.In, 0);
};

OperatorContext.prototype.NotIn = function() {
    return this.getToken(RouteParser.NotIn, 0);
};

OperatorContext.prototype.enterRule = function(listener) {
    if(listener instanceof RouteListener ) {
        listener.enterOperator(this);
	}
};

OperatorContext.prototype.exitRule = function(listener) {
    if(listener instanceof RouteListener ) {
        listener.exitOperator(this);
	}
};




RouteParser.OperatorContext = OperatorContext;

RouteParser.prototype.operator = function() {

    var localctx = new OperatorContext(this, this._ctx, this.state);
    this.enterRule(localctx, 20, RouteParser.RULE_operator);
    var _la = 0; // Token type
    try {
        this.enterOuterAlt(localctx, 1);
        this.state = 121;
        _la = this._input.LA(1);
        if(!((((_la) & ~0x1f) == 0 && ((1 << _la) & ((1 << RouteParser.Eq) | (1 << RouteParser.Gt) | (1 << RouteParser.Ge) | (1 << RouteParser.Lt) | (1 << RouteParser.Le) | (1 << RouteParser.In) | (1 << RouteParser.NotIn) | (1 << RouteParser.NotLike) | (1 << RouteParser.Like))) !== 0))) {
        this._errHandler.recoverInline(this);
        }
        else {
        	this._errHandler.reportMatch(this);
            this.consume();
        }
    } catch (re) {
    	if(re instanceof antlr4.error.RecognitionException) {
	        localctx.exception = re;
	        this._errHandler.reportError(this, re);
	        this._errHandler.recover(this, re);
	    } else {
	    	throw re;
	    }
    } finally {
        this.exitRule();
    }
    return localctx;
};

function BeanLiteralContext(parser, parent, invokingState) {
	if(parent===undefined) {
	    parent = null;
	}
	if(invokingState===undefined || invokingState===null) {
		invokingState = -1;
	}
	antlr4.ParserRuleContext.call(this, parent, invokingState);
    this.parser = parser;
    this.ruleIndex = RouteParser.RULE_beanLiteral;
    return this;
}

BeanLiteralContext.prototype = Object.create(antlr4.ParserRuleContext.prototype);
BeanLiteralContext.prototype.constructor = BeanLiteralContext;

BeanLiteralContext.prototype.Literal = function() {
    return this.getToken(RouteParser.Literal, 0);
};

BeanLiteralContext.prototype.Eq = function() {
    return this.getToken(RouteParser.Eq, 0);
};

BeanLiteralContext.prototype.beanValue = function() {
    return this.getTypedRuleContext(BeanValueContext,0);
};

BeanLiteralContext.prototype.enterRule = function(listener) {
    if(listener instanceof RouteListener ) {
        listener.enterBeanLiteral(this);
	}
};

BeanLiteralContext.prototype.exitRule = function(listener) {
    if(listener instanceof RouteListener ) {
        listener.exitBeanLiteral(this);
	}
};




RouteParser.BeanLiteralContext = BeanLiteralContext;

RouteParser.prototype.beanLiteral = function() {

    var localctx = new BeanLiteralContext(this, this._ctx, this.state);
    this.enterRule(localctx, 22, RouteParser.RULE_beanLiteral);
    try {
        this.enterOuterAlt(localctx, 1);
        this.state = 123;
        this.match(RouteParser.Literal);
        this.state = 124;
        this.match(RouteParser.Eq);
        this.state = 125;
        this.beanValue();
    } catch (re) {
    	if(re instanceof antlr4.error.RecognitionException) {
	        localctx.exception = re;
	        this._errHandler.reportError(this, re);
	        this._errHandler.recover(this, re);
	    } else {
	    	throw re;
	    }
    } finally {
        this.exitRule();
    }
    return localctx;
};

function BeanContext(parser, parent, invokingState) {
	if(parent===undefined) {
	    parent = null;
	}
	if(invokingState===undefined || invokingState===null) {
		invokingState = -1;
	}
	antlr4.ParserRuleContext.call(this, parent, invokingState);
    this.parser = parser;
    this.ruleIndex = RouteParser.RULE_bean;
    return this;
}

BeanContext.prototype = Object.create(antlr4.ParserRuleContext.prototype);
BeanContext.prototype.constructor = BeanContext;

BeanContext.prototype.beanLiteral = function(i) {
    if(i===undefined) {
        i = null;
    }
    if(i===null) {
        return this.getTypedRuleContexts(BeanLiteralContext);
    } else {
        return this.getTypedRuleContext(BeanLiteralContext,i);
    }
};

BeanContext.prototype.enterRule = function(listener) {
    if(listener instanceof RouteListener ) {
        listener.enterBean(this);
	}
};

BeanContext.prototype.exitRule = function(listener) {
    if(listener instanceof RouteListener ) {
        listener.exitBean(this);
	}
};




RouteParser.BeanContext = BeanContext;

RouteParser.prototype.bean = function() {

    var localctx = new BeanContext(this, this._ctx, this.state);
    this.enterRule(localctx, 24, RouteParser.RULE_bean);
    var _la = 0; // Token type
    try {
        this.state = 140;
        this._errHandler.sync(this);
        var la_ = this._interp.adaptivePredict(this._input,11,this._ctx);
        switch(la_) {
        case 1:
            this.enterOuterAlt(localctx, 1);
            this.state = 127;
            this.match(RouteParser.T__12);
            this.state = 128;
            this.beanLiteral();
            this.state = 133;
            this._errHandler.sync(this);
            _la = this._input.LA(1);
            while(_la===RouteParser.T__11) {
                this.state = 129;
                this.match(RouteParser.T__11);
                this.state = 130;
                this.beanLiteral();
                this.state = 135;
                this._errHandler.sync(this);
                _la = this._input.LA(1);
            }
            this.state = 136;
            this.match(RouteParser.T__13);
            break;

        case 2:
            this.enterOuterAlt(localctx, 2);
            this.state = 138;
            this.match(RouteParser.T__12);
            this.state = 139;
            this.match(RouteParser.T__13);
            break;

        }
    } catch (re) {
    	if(re instanceof antlr4.error.RecognitionException) {
	        localctx.exception = re;
	        this._errHandler.reportError(this, re);
	        this._errHandler.recover(this, re);
	    } else {
	    	throw re;
	    }
    } finally {
        this.exitRule();
    }
    return localctx;
};

function BeansContext(parser, parent, invokingState) {
	if(parent===undefined) {
	    parent = null;
	}
	if(invokingState===undefined || invokingState===null) {
		invokingState = -1;
	}
	antlr4.ParserRuleContext.call(this, parent, invokingState);
    this.parser = parser;
    this.ruleIndex = RouteParser.RULE_beans;
    return this;
}

BeansContext.prototype = Object.create(antlr4.ParserRuleContext.prototype);
BeansContext.prototype.constructor = BeansContext;

BeansContext.prototype.bean = function(i) {
    if(i===undefined) {
        i = null;
    }
    if(i===null) {
        return this.getTypedRuleContexts(BeanContext);
    } else {
        return this.getTypedRuleContext(BeanContext,i);
    }
};

BeansContext.prototype.enterRule = function(listener) {
    if(listener instanceof RouteListener ) {
        listener.enterBeans(this);
	}
};

BeansContext.prototype.exitRule = function(listener) {
    if(listener instanceof RouteListener ) {
        listener.exitBeans(this);
	}
};




RouteParser.BeansContext = BeansContext;

RouteParser.prototype.beans = function() {

    var localctx = new BeansContext(this, this._ctx, this.state);
    this.enterRule(localctx, 26, RouteParser.RULE_beans);
    var _la = 0; // Token type
    try {
        this.enterOuterAlt(localctx, 1);
        this.state = 142;
        this.match(RouteParser.T__8);
        this.state = 143;
        this.bean();
        this.state = 148;
        this._errHandler.sync(this);
        _la = this._input.LA(1);
        while(_la===RouteParser.T__11) {
            this.state = 144;
            this.match(RouteParser.T__11);
            this.state = 145;
            this.bean();
            this.state = 150;
            this._errHandler.sync(this);
            _la = this._input.LA(1);
        }
        this.state = 151;
        this.match(RouteParser.T__10);
    } catch (re) {
    	if(re instanceof antlr4.error.RecognitionException) {
	        localctx.exception = re;
	        this._errHandler.reportError(this, re);
	        this._errHandler.recover(this, re);
	    } else {
	    	throw re;
	    }
    } finally {
        this.exitRule();
    }
    return localctx;
};

function BeanValueContext(parser, parent, invokingState) {
	if(parent===undefined) {
	    parent = null;
	}
	if(invokingState===undefined || invokingState===null) {
		invokingState = -1;
	}
	antlr4.ParserRuleContext.call(this, parent, invokingState);
    this.parser = parser;
    this.ruleIndex = RouteParser.RULE_beanValue;
    return this;
}

BeanValueContext.prototype = Object.create(antlr4.ParserRuleContext.prototype);
BeanValueContext.prototype.constructor = BeanValueContext;

BeanValueContext.prototype.String = function() {
    return this.getToken(RouteParser.String, 0);
};

BeanValueContext.prototype.array = function() {
    return this.getTypedRuleContext(ArrayContext,0);
};

BeanValueContext.prototype.Int = function() {
    return this.getToken(RouteParser.Int, 0);
};

BeanValueContext.prototype.enterRule = function(listener) {
    if(listener instanceof RouteListener ) {
        listener.enterBeanValue(this);
	}
};

BeanValueContext.prototype.exitRule = function(listener) {
    if(listener instanceof RouteListener ) {
        listener.exitBeanValue(this);
	}
};




RouteParser.BeanValueContext = BeanValueContext;

RouteParser.prototype.beanValue = function() {

    var localctx = new BeanValueContext(this, this._ctx, this.state);
    this.enterRule(localctx, 28, RouteParser.RULE_beanValue);
    try {
        this.state = 156;
        this._errHandler.sync(this);
        switch(this._input.LA(1)) {
        case RouteParser.String:
            this.enterOuterAlt(localctx, 1);
            this.state = 153;
            this.match(RouteParser.String);
            break;
        case RouteParser.T__8:
            this.enterOuterAlt(localctx, 2);
            this.state = 154;
            this.array();
            break;
        case RouteParser.Int:
            this.enterOuterAlt(localctx, 3);
            this.state = 155;
            this.match(RouteParser.Int);
            break;
        default:
            throw new antlr4.error.NoViableAltException(this);
        }
    } catch (re) {
    	if(re instanceof antlr4.error.RecognitionException) {
	        localctx.exception = re;
	        this._errHandler.reportError(this, re);
	        this._errHandler.recover(this, re);
	    } else {
	    	throw re;
	    }
    } finally {
        this.exitRule();
    }
    return localctx;
};

function GroupValueContext(parser, parent, invokingState) {
	if(parent===undefined) {
	    parent = null;
	}
	if(invokingState===undefined || invokingState===null) {
		invokingState = -1;
	}
	antlr4.ParserRuleContext.call(this, parent, invokingState);
    this.parser = parser;
    this.ruleIndex = RouteParser.RULE_groupValue;
    return this;
}

GroupValueContext.prototype = Object.create(antlr4.ParserRuleContext.prototype);
GroupValueContext.prototype.constructor = GroupValueContext;

GroupValueContext.prototype.array = function() {
    return this.getTypedRuleContext(ArrayContext,0);
};

GroupValueContext.prototype.enterRule = function(listener) {
    if(listener instanceof RouteListener ) {
        listener.enterGroupValue(this);
	}
};

GroupValueContext.prototype.exitRule = function(listener) {
    if(listener instanceof RouteListener ) {
        listener.exitGroupValue(this);
	}
};




RouteParser.GroupValueContext = GroupValueContext;

RouteParser.prototype.groupValue = function() {

    var localctx = new GroupValueContext(this, this._ctx, this.state);
    this.enterRule(localctx, 30, RouteParser.RULE_groupValue);
    try {
        this.enterOuterAlt(localctx, 1);
        this.state = 158;
        this.array();
    } catch (re) {
    	if(re instanceof antlr4.error.RecognitionException) {
	        localctx.exception = re;
	        this._errHandler.reportError(this, re);
	        this._errHandler.recover(this, re);
	    } else {
	    	throw re;
	    }
    } finally {
        this.exitRule();
    }
    return localctx;
};

function ExhibitValueContext(parser, parent, invokingState) {
	if(parent===undefined) {
	    parent = null;
	}
	if(invokingState===undefined || invokingState===null) {
		invokingState = -1;
	}
	antlr4.ParserRuleContext.call(this, parent, invokingState);
    this.parser = parser;
    this.ruleIndex = RouteParser.RULE_exhibitValue;
    return this;
}

ExhibitValueContext.prototype = Object.create(antlr4.ParserRuleContext.prototype);
ExhibitValueContext.prototype.constructor = ExhibitValueContext;

ExhibitValueContext.prototype.Table = function() {
    return this.getToken(RouteParser.Table, 0);
};

ExhibitValueContext.prototype.Bar = function() {
    return this.getToken(RouteParser.Bar, 0);
};

ExhibitValueContext.prototype.Pie = function() {
    return this.getToken(RouteParser.Pie, 0);
};

ExhibitValueContext.prototype.enterRule = function(listener) {
    if(listener instanceof RouteListener ) {
        listener.enterExhibitValue(this);
	}
};

ExhibitValueContext.prototype.exitRule = function(listener) {
    if(listener instanceof RouteListener ) {
        listener.exitExhibitValue(this);
	}
};




RouteParser.ExhibitValueContext = ExhibitValueContext;

RouteParser.prototype.exhibitValue = function() {

    var localctx = new ExhibitValueContext(this, this._ctx, this.state);
    this.enterRule(localctx, 32, RouteParser.RULE_exhibitValue);
    var _la = 0; // Token type
    try {
        this.enterOuterAlt(localctx, 1);
        this.state = 160;
        _la = this._input.LA(1);
        if(!((((_la) & ~0x1f) == 0 && ((1 << _la) & ((1 << RouteParser.Table) | (1 << RouteParser.Bar) | (1 << RouteParser.Pie))) !== 0))) {
        this._errHandler.recoverInline(this);
        }
        else {
        	this._errHandler.reportMatch(this);
            this.consume();
        }
    } catch (re) {
    	if(re instanceof antlr4.error.RecognitionException) {
	        localctx.exception = re;
	        this._errHandler.reportError(this, re);
	        this._errHandler.recover(this, re);
	    } else {
	    	throw re;
	    }
    } finally {
        this.exitRule();
    }
    return localctx;
};

function ArrayContext(parser, parent, invokingState) {
	if(parent===undefined) {
	    parent = null;
	}
	if(invokingState===undefined || invokingState===null) {
		invokingState = -1;
	}
	antlr4.ParserRuleContext.call(this, parent, invokingState);
    this.parser = parser;
    this.ruleIndex = RouteParser.RULE_array;
    return this;
}

ArrayContext.prototype = Object.create(antlr4.ParserRuleContext.prototype);
ArrayContext.prototype.constructor = ArrayContext;

ArrayContext.prototype.String = function(i) {
	if(i===undefined) {
		i = null;
	}
    if(i===null) {
        return this.getTokens(RouteParser.String);
    } else {
        return this.getToken(RouteParser.String, i);
    }
};


ArrayContext.prototype.enterRule = function(listener) {
    if(listener instanceof RouteListener ) {
        listener.enterArray(this);
	}
};

ArrayContext.prototype.exitRule = function(listener) {
    if(listener instanceof RouteListener ) {
        listener.exitArray(this);
	}
};




RouteParser.ArrayContext = ArrayContext;

RouteParser.prototype.array = function() {

    var localctx = new ArrayContext(this, this._ctx, this.state);
    this.enterRule(localctx, 34, RouteParser.RULE_array);
    var _la = 0; // Token type
    try {
        this.state = 174;
        this._errHandler.sync(this);
        var la_ = this._interp.adaptivePredict(this._input,15,this._ctx);
        switch(la_) {
        case 1:
            this.enterOuterAlt(localctx, 1);
            this.state = 162;
            this.match(RouteParser.T__8);
            this.state = 163;
            this.match(RouteParser.String);
            this.state = 168;
            this._errHandler.sync(this);
            _la = this._input.LA(1);
            while(_la===RouteParser.T__11) {
                this.state = 164;
                this.match(RouteParser.T__11);
                this.state = 165;
                this.match(RouteParser.String);
                this.state = 170;
                this._errHandler.sync(this);
                _la = this._input.LA(1);
            }
            this.state = 171;
            this.match(RouteParser.T__10);
            break;

        case 2:
            this.enterOuterAlt(localctx, 2);
            this.state = 172;
            this.match(RouteParser.T__8);
            this.state = 173;
            this.match(RouteParser.T__10);
            break;

        }
    } catch (re) {
    	if(re instanceof antlr4.error.RecognitionException) {
	        localctx.exception = re;
	        this._errHandler.reportError(this, re);
	        this._errHandler.recover(this, re);
	    } else {
	    	throw re;
	    }
    } finally {
        this.exitRule();
    }
    return localctx;
};

export default RouteParser
