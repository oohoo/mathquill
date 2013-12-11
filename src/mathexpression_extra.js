/**
 * *************************************************************************
 * *                               MathExpression                         **
 * *************************************************************************
 * @package     qtype                                                     **
 * @subpackage  mathexpression                                            **
 * @name        MathExpression                                            **
 * @copyright   oohoo.biz                                                 **
 * @link        http://oohoo.biz                                          **
 * @author      Nicolas Bretin (bretin@ualberta.ca)                       **
 * @license     http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later  **
 * *************************************************************************
 * ************************************************************************ */


//------------------------------------------------------------------------------
// Function for the brackets (), [],{} but also for the operators with one parameter like ||, etc

var meBracket = P(MathCommand, function(_, _super) {
    _.init = function(open, close, ctrlSeq) {
        _super.init.call(this, ctrlSeq,
                '<span class="non-leaf">'
                + '<span class="scaled paren">' + open + '</span>'
                + '<span class="non-leaf">&0</span>'
                + '<span class="scaled paren">' + close + '</span>'
                + '</span>',
                [open, close]);
    };
    _.jQadd = function() {
        _super.jQadd.apply(this, arguments);
        var jQ = this.jQ;
        this.bracketjQs = jQ.children('.scaled');
    };
    _.redraw = function() {
        var blockjQ = this.ends[L].jQ;
        var height = blockjQ.outerHeight() / +blockjQ.css('fontSize').slice(0, -2);
        scale(this.bracketjQs, min(1 + .2 * (height - 1), 1.2), 1.05 * height);
    };
});

// Closing bracket matching opening bracket above
var meCloseBracket = P(Bracket, function(_, _super) {
    _.createLeftOf = function(cursor) {
        // just put cursor after my parent
        if (!cursor[R] && cursor.parent.parent)
            cursor.insRightOf(cursor.parent.parent);
    };
    _.placeCursor = function(cursor) {
        this.ends[L].blur();
        cursor.insRightOf(this);
    };
});

//list of brackets and other operators
var brackets = [
    {name: 'meParen', open: '(', close: ')'},
    {name: 'meBrace', open: '{', close: '}'},
    {name: 'meBracket', open: '[', close: ']'},
    {name: 'meAbsolute', open: '|', close: '|'},
    {name: 'meAngle', open: '&lang;', close: '&rang;'},
    {name: 'meCeil', open: '&#x2308;', close: '&#x2309;'},
    {name: 'meFloor', open: '&#x230A;', close: '&#x230B;'}
];

jQuery.each(brackets, function(i) {
    var cmd = brackets[i];
    LatexCmds[cmd.name] = bind(meBracket, cmd.open, cmd.close, '\\' + cmd.name);
    if (cmd.open !== '')
    {
        CharCmds[cmd.open] = LatexCmds[cmd.name];
        if (cmd.close !== '')
        {
            CharCmds[cmd.close] = bind(meCloseBracket, cmd.open, cmd.close, '\\' + cmd.name);
        }
    }
});

//------------------------------------------------------------------------------
// Function for function and content into brackets like cos(), sin(), etc

var meBracketFunction = P(MathCommand, function(_, _super) {
    _.init = function(func, exp, ctrlSeq) {
        _super.init.call(this, ctrlSeq,
                '<span class="non-leaf">'
                + '<span class="non-italicized-function">' + func + '</span>'
                + (exp !== '' ? '<sup class="non-leaf">' + exp + '</sup>' : '')
                + '<span class="scaled paren">(</span>'
                + '<span class="non-leaf">&0</span>'
                + '<span class="scaled paren">)</span>'
                + '</span>',
                [func + '(', ')']);
    };
    _.jQadd = function() {
        _super.jQadd.apply(this, arguments);
        var jQ = this.jQ;
        this.bracketjQs = jQ.children('.scaled');
    };
    _.redraw = function() {
        var blockjQ = this.ends[L].jQ;
        var height = blockjQ.outerHeight() / +blockjQ.css('fontSize').slice(0, -2);
        scale(this.bracketjQs, min(1 + .2 * (height - 1), 1.2), 1.05 * height);
    };
});

//list of brackets and other operators
var BracketFunctions = [
    {name: 'meCos', func: 'cos'},
    {name: 'meCosh', func: 'cosh'},
    {name: 'meArcCos', func: 'cos', exp: '&ndash;1'},
    {name: 'meSin', func: 'sin'},
    {name: 'meSinh', func: 'sinh'},
    {name: 'meArcSin', func: 'sin', exp: '&ndash;1'},
    {name: 'meTan', func: 'tan'},
    {name: 'meTanh', func: 'tanh'},
    {name: 'meArcTan', func: 'tan', exp: '&ndash;1'},
    {name: 'meSec', func: 'sec'},
    {name: 'meLog', func: 'log'},
    {name: 'meLn', func: 'ln'},
    {name: 'meCsc', func: 'csc'},
    {name: 'meCot', func: 'cot'},
];

jQuery.each(BracketFunctions, function(i) {
    var cmd = BracketFunctions[i];
    var exp = '';
    if (typeof cmd.exp !== 'undefined')
    {
        exp = cmd.exp;
    }
    LatexCmds[cmd.name] = bind(meBracketFunction, cmd.func, exp, '\\' + cmd.name);
    if (cmd.open !== '')
    {
        CharCmds[cmd.open] = LatexCmds[cmd.name];
        /*if (cmd.close !== '')
         {
         CharCmds[cmd.close] = bind(meCloseBracket, '(', ')', '\\' + cmd.name);
         }*/
    }
});

//------------------------------------------------------------------------------
// Function for the operators with one parameter at the right like -x

var meOpeLeft = P(MathCommand, function(_, _super) {
    _.init = function(left, ctrlSeq, textTemplate) {
        _super.init.call(this, ctrlSeq,
                '<span class="non-leaf">'
                + '<span class="">' + left + '</span>'
                + '<span class="non-leaf">&0</span>'
                + '</span>',
                textTemplate);
    };
    _.jQadd = function() {
        _super.jQadd.apply(this, arguments);
        var jQ = this.jQ;
        this.operatorjQs = jQ.children(':first');
    };
    _.redraw = function() {
        var blockjQ = this.ends[L].jQ;

        var height = blockjQ.outerHeight() / +blockjQ.css('fontSize').slice(0, -2);
        scale(this.operatorjQs, min(1 + .2 * (height - 1), 1.2), 1.05 * height);
    };
});

var leftParams = [
    {name: 'meMinusElem', left: '&ndash;', key: '', textTemplate: ['-']},
];

jQuery.each(leftParams, function(i) {
    var cmd = leftParams[i];
    LatexCmds[cmd.name] = bind(meOpeLeft, cmd.left, '\\' + cmd.name, cmd.textTemplate);
    if (cmd.key !== '')
    {
        LatexCmds[cmd.key] = LatexCmds[cmd.name];
    }
});

//------------------------------------------------------------------------------
// Function for the operators with one parameter at the right like x!

var meOpeRight = P(MathCommand, function(_, _super) {
    _.init = function(right, ctrlSeq, textTemplate) {
        _super.init.call(this, ctrlSeq,
                '<span class="non-leaf">'
                + '<span class="non-leaf">&0</span>'
                + '<span class="">' + right + '</span>'
                + '</span>',
                textTemplate);
    };
    _.jQadd = function() {
        _super.jQadd.apply(this, arguments);
        var jQ = this.jQ;
        this.paramsjQs = jQ.children(':last');
    };
    _.redraw = function() {
        var blockjQ = this.ends[L].jQ;
        var height = blockjQ.outerHeight() / +blockjQ.css('fontSize').slice(0, -2);
        scale(this.paramsjQs, min(1 + .2 * (height - 1), 1.2), 1.05 * height);
    };
});

var rightParams = [
    {name: 'meFactorial', right: '!', key: '!', textTemplate: ['', '!']},
];

jQuery.each(rightParams, function(i) {
    var cmd = rightParams[i];
    LatexCmds[cmd.name] = bind(meOpeRight, cmd.right, '\\' + cmd.name, cmd.textTemplate);
    if (cmd.key !== '')
    {
        LatexCmds[cmd.key] = LatexCmds[cmd.name];
    }
});


//------------------------------------------------------------------------------
// Function for the operators with one parameter and the operator on the top like a vector

var meOpeTop = P(MathCommand, function(_, _super) {
    _.init = function(top, ctrlSeq, textTemplate) {
        _super.init.call(this, ctrlSeq,
                '<span class="non-leaf">'
                + '<span class="vector-prefix">' + top + '</span>'
                + '<span class="vector-stem">&0</span>'
                + '</span>',
                textTemplate);
    };
});

var topParams = [
    {name: 'meVector', left: '&rarr;', key: '', textTemplate: ['vec{', '}']},
    {name: 'meHat', left: '&#94;', key: '', textTemplate: ['hat{', '}']},
    {name: 'meBar', left: '&#x203E;', key: '', textTemplate: ['bar{', '}']}
];

jQuery.each(leftParams, function(i) {
    var cmd = leftParams[i];
    LatexCmds[cmd.name] = bind(meOpeLeft, cmd.left, '\\' + cmd.name, cmd.textTemplate);
    if (cmd.key !== '')
    {
        LatexCmds[cmd.key] = LatexCmds[cmd.name];
    }
});

//------------------------------------------------------------------------------
// Function for the classic operator: + - % *, etc

var meClassicOperator = P(MathCommand, function(_, _super) {
    _.init = function(operator, ctrlSeq, textTemplate) {
        _super.init.call(this, ctrlSeq,
                '<span class="non-leaf">'
                + '<span>&0</span>'
                + '<span style="operator">' + operator + '</span>'
                + '<span>&1</span>'
                + '</span>',
                textTemplate);
    };
    _.finalizeTree = function() {
        this.up = this.ends[R].up = this.ends[L];
        this.down = this.ends[L].down = this.ends[R];
    };
});

var classicOperators = [
    {name: 'mePlus', operator: '+', key: '+', textTemplate: ['(', '+', ')']},
    {name: 'meMinus', operator: '-', key: '-', textTemplate: ['(', '-', ')']},
    {name: 'meTimes', operator: '&times;', key: '*', textTemplate: ['(', '*', ')']},
    {name: 'meDivision', operator: '&divide;', key: '/', textTemplate: ['(', '/', ')']},
    {name: 'mePlusMinus', operator: '&plusmn;', key: '±', textTemplate: ['(', '±', ')']},
    {name: 'meMinusPlus', operator: '&#8723;', key: '', textTemplate: ['(', '', ')']},
    {name: 'meLT', operator: '&lt;', key: '<', textTemplate: ['(', '<', ')']},
    {name: 'meGT', operator: '&gt;', key: '>', textTemplate: ['(', '>', ')']},
    {name: 'meLE', operator: '&le;', key: '≤', textTemplate: ['(', '≤', ')']},
    {name: 'meGE', operator: '&ge;', key: '≥', textTemplate: ['(', '≥', ')']},
    {name: 'meEqual', operator: '=', key: '=', textTemplate: ['(', '=', ')']},
    {name: 'meNotEqual', operator: '≠', key: '≠', textTemplate: ['(', '≠', ')']},
    {name: 'meApproximately', operator: '&#x223C;', key: '∼', textTemplate: ['(', '∼', ')']},
    {name: 'meAsymptoticallyEqual', operator: '&#8771;', key: '≃', textTemplate: ['(', '≃', ')']},
    {name: 'meCrossProduct', operator: '&times;', key: '', textTemplate: ['(', '*', ')']},
    {name: 'meDotProduct', operator: '&bullet;', key: '', textTemplate: ['(', '*', ')']},
    {name: 'meScalarProduct', operator: '&middot;', key: '', textTemplate: ['(', '*', ')']},
];

jQuery.each(classicOperators, function(i) {
    var cmd = classicOperators[i];
    LatexCmds[cmd.name] = bind(meClassicOperator, cmd.operator, '\\' + cmd.name, cmd.textTemplate);
    if (cmd.key !== '')
    {
        CharCmds[cmd.key] = LatexCmds[cmd.name];
    }
});


//------------------------------------------------------------------------------
//Special ones

var mePower =
        LatexCmds.mePower =
        LatexCmds['mePower'] = P(MathCommand, function(_, _super) {
    _.ctrlSeq = '\\mePower';
    _.htmlTemplate =
            '<span class="non-leaf">'
            + '<span>&0</span>'
            + '<sup class="non-leaf">'
            + '<span>&1</span>'
            + '</sup>'
            + '</span>'
            ;
    _.textTemplate = ['^'];
    _.finalizeTree = function() {
        this.up = this.ends[R].up = this.ends[L];
        this.down = this.ends[L].down = this.ends[R];
    };
});

var meExponential =
        LatexCmds.meExponential =
        LatexCmds['meExponential'] = P(MathCommand, function(_, _super) {
    _.ctrlSeq = '\\meExponential';
    _.htmlTemplate =
            '<span class="non-leaf">'
            + '<span>e</span>'
            + '<sup class="non-leaf">'
            + '<span>&1</span>'
            + '</sup>'
            + '</span>'
            ;
    _.textTemplate = ['e^(', ')'];
});

var meExponential =
        LatexCmds.meExponential =
        LatexCmds['meExponential'] = P(MathCommand, function(_, _super) {
    _.ctrlSeq = '\\meExponential';
    _.htmlTemplate =
            '<span class="non-leaf">'
            + '<span>e</span>'
            + '<sup class="non-leaf">'
            + '<span>&0</span>'
            + '</sup>'
            + '</span>'
            ;
    _.textTemplate = ['e^(', ')'];
});


var meLogBase =
        LatexCmds.meLogBase =
        LatexCmds['meLogBase'] = P(MathCommand, function(_, _super) {
    _.ctrlSeq = '\\meLogBase';
    _.htmlTemplate =
            '<span class="non-leaf">'
            + '<span class="non-italicized-function">log</span>'
            + '<sub class="non-leaf"><span>&0</span></sub>'
            + '<span class="non-leaf">'
            + '<span class="scaled paren">(</span>'
            + '<span class="non-leaf">&1</span>'
            + '<span class="scaled paren">)</span>'
            + '</span>'
            + '</span>',
            _.textTemplate = ['log_{', '}(', ')'];
    _.jQadd = function() {
        _super.jQadd.apply(this, arguments);
        var jQ = this.jQ;
        this.bracketjQs = jQ.children('.scaled');
    };
    _.redraw = function() {
        var blockjQ = this.ends[L].jQ;
        var height = blockjQ.outerHeight() / +blockjQ.css('fontSize').slice(0, -2);
        scale(this.bracketjQs, min(1 + .2 * (height - 1), 1.2), 1.05 * height);
    };
});

var meFrac =
        LatexCmds.meFrac =
        LatexCmds['meFrac'] = P(MathCommand, function(_, _super) {
    _.ctrlSeq = '\\meFrac';
    _.htmlTemplate =
            '<span class="fraction non-leaf">'
            + '<span class="numerator">&0</span>'
            + '<span class="denominator">&1</span>'
            + '<span style="display:inline-block;width:0">&nbsp;</span>'
            + '</span>'
            ;
    _.textTemplate = ['(', '/', ')'];
    _.finalizeTree = function() {
        this.up = this.ends[R].up = this.ends[L];
        this.down = this.ends[L].down = this.ends[R];
    };
});

var meSqrt =
        LatexCmds.meSqrt =
        LatexCmds['√'] = P(MathCommand, function(_, _super) {
    _.ctrlSeq = '\\meSqrt';
    _.htmlTemplate =
            '<span class="non-leaf">'
            + '<span class="scaled sqrt-prefix">&radic;</span>'
            + '<span class="non-leaf sqrt-stem">&0</span>'
            + '</span>'
            ;
    _.textTemplate = ['sqrt(', ')'];
    _.parser = function() {
        return latexMathParser.optBlock.then(function(optBlock) {
            return latexMathParser.block.map(function(block) {
                var nthroot = NthRoot();
                nthroot.blocks = [optBlock, block];
                optBlock.adopt(nthroot, 0, 0);
                block.adopt(nthroot, optBlock, 0);
                return nthroot;
            });
        }).or(_super.parser.call(this));
    };
    _.redraw = function() {
        var block = this.ends[R].jQ;
        scale(block.prev(), 1, block.innerHeight() / +block.css('fontSize').slice(0, -2) - .1);
    };
});

var meNthRoot =
        LatexCmds.meNthRoot = P(meSqrt, function(_, _super) {
            _.ctrlSeq = '\\meNthRoot';
            _.htmlTemplate =
                    '<sup class="nthroot non-leaf">&0</sup>'
                    + '<span class="scaled">'
                    + '<span class="sqrt-prefix scaled">&radic;</span>'
                    + '<span class="sqrt-stem non-leaf">&1</span>'
                    + '</span>'
                    ;
            _.textTemplate = ['sqrt[', '](', ')'];
        });